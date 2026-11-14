import { LibreFranklin_500Medium } from '@expo-google-fonts/libre-franklin/500Medium';
import { LibreFranklin_700Bold } from '@expo-google-fonts/libre-franklin/700Bold';
import { Newsreader_400Regular } from '@expo-google-fonts/newsreader/400Regular';
import { Newsreader_400Regular_Italic } from '@expo-google-fonts/newsreader/400Regular_Italic';
import { Newsreader_500Medium } from '@expo-google-fonts/newsreader/500Medium';
import { Newsreader_700Bold } from '@expo-google-fonts/newsreader/700Bold';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, BackHandler, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MONEY_MODE } from './src/config/money';
import { bookPuzzle } from './src/game/book';
import { Month, monthOf } from './src/game/archive';
import { dailyPuzzle, dateKey, keyToDate } from './src/game/daily';
import { t } from './src/i18n/en';
import { ads } from './src/money/ads';
import { purchases } from './src/money/purchases';
import { bookLocked, interstitialDue } from './src/money/rules';
import { Archive } from './src/screens/Archive';
import { FullEdition } from './src/screens/FullEdition';
import { Game } from './src/screens/Game';
import { Home } from './src/screens/Home';
import { Rules } from './src/screens/Rules';
import { Settings } from './src/screens/Settings';
import { configureStats, count } from './src/stats/stats';
import { GameSave } from './src/store/save';
import { StoreProvider, useStore } from './src/store/Store';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { setHaptics } from './src/ui/haptics';
import { initSound, setSound } from './src/ui/sound';

type Route =
  | { name: 'home' }
  | { name: 'daily'; key: string; back?: Route }
  | { name: 'archive'; month: Month }
  | { name: 'settings' }
  | { name: 'full'; back: Route }
  | { name: 'book'; level: number; relief: number }
  | { name: 'rules'; back: Route };

function Screens() {
  const { c, dark } = useTheme();
  const store = useStore();
  const { save } = store;
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [today, setToday] = useState(() => dateKey(new Date()));

  useEffect(() => setHaptics(save.settings.haptics), [save.settings.haptics]);
  useEffect(() => setSound(save.settings.sound), [save.settings.sound]);
  useEffect(() => initSound(), []);
  useEffect(() => configureStats(save.stats.on, save.stats.id), [save.stats.on, save.stats.id]);
  useEffect(() => {
    if (store.ready) count('app_open');
  }, [store.ready]);

  // Money: get ads ready (Android) and ask the store what is owned (iPhone). Both are quiet no-ops elsewhere.
  const { setFullEdition, markAdShown } = store;
  useEffect(() => {
    ads.init().catch((error) => console.warn('Ads did not start', error));
    purchases
      .init()
      .then(() => (purchases.available() ? purchases.ownsFullEdition() : null))
      .then((owned) => {
        if (owned !== null) setFullEdition(owned);
      })
      .catch((error) => console.warn('The store did not answer', error));
  }, [setFullEdition]);
  const canSell = purchases.available();
  const bookIsLocked = bookLocked(save.book.level, MONEY_MODE, canSell, save.money);

  // A new day gives a new puzzle when the app comes back to the front.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setToday(dateKey(new Date()));
    });
    return () => sub.remove();
  }, []);

  // Android back button: leave a puzzle or the rules, never close the app by surprise.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name === 'home') return false;
      setRoute(route.name === 'rules' || route.name === 'full' ? route.back : route.name === 'daily' && route.back ? route.back : { name: 'home' });
      return true;
    });
    return () => sub.remove();
  }, [route]);

  // Count each puzzle opened and each visit to the rules or the full-edition page.
  useEffect(() => {
    if (route.name === 'rules') count('rules_seen');
    else if (route.name === 'archive') count('past_puzzles_open');
    else if (route.name === 'full') count('full_edition_view', { from: route.back.name === 'archive' ? 'calendar' : 'home' });
  }, [route.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const puzzle = useMemo(() => {
    if (route.name === 'daily') return dailyPuzzle(route.key);
    if (route.name === 'book') return bookPuzzle(route.level, route.relief);
    return null;
  }, [route]);

  const keep = useCallback(
    (game: GameSave) => {
      if (puzzle) store.keepGame(puzzle.id, game);
    },
    [puzzle, store],
  );

  const openBook = useCallback(() => {
    if (bookIsLocked) {
      setRoute({ name: 'full', back: { name: 'home' } });
      return;
    }
    const next: Route = { name: 'book', level: save.book.level, relief: save.book.relief };
    if (!save.seenRules) {
      store.setSeenRules();
      setRoute({ name: 'rules', back: next });
    } else setRoute(next);
  }, [bookIsLocked, save.book.level, save.book.relief, save.seenRules, store]);

  // After a Book puzzle: maybe one full-screen ad (Android, by the rules in money/rules.ts), then the next puzzle.
  const nextBook = useCallback(
    async (finishedLevel: number) => {
      const now = Date.now();
      if (interstitialDue(MONEY_MODE, finishedLevel, now, save.money)) {
        try {
          if (await ads.showInterstitial()) {
            markAdShown(Date.now());
            count('ad_shown');
          }
        } catch (error) {
          console.warn('Ad error', error);
        }
      }
      if (bookIsLocked) setRoute({ name: 'full', back: { name: 'home' } });
      else setRoute({ name: 'book', level: save.book.level, relief: save.book.relief });
    },
    [bookIsLocked, markAdShown, save.book.level, save.book.relief, save.money],
  );

  let screen: React.ReactNode;
  if (route.name === 'rules') {
    screen = <Rules onDone={() => setRoute(route.back)} />;
  } else if (route.name === 'full') {
    screen = <FullEdition onExit={() => setRoute(route.back)} />;
  } else if (route.name === 'settings') {
    screen = <Settings onExit={() => setRoute({ name: 'home' })} onRules={() => setRoute({ name: 'rules', back: route })} />;
  } else if (route.name === 'archive') {
    screen = (
      <Archive
        today={today}
        month={route.month}
        onMonth={(month) => setRoute({ name: 'archive', month })}
        onOpen={(key) => setRoute({ name: 'daily', key, back: route })}
        onExit={() => setRoute({ name: 'home' })}
        onFullEdition={() => setRoute({ name: 'full', back: route })}
      />
    );
  } else if (route.name === 'daily' && puzzle) {
    screen = (
      <Game
        key={puzzle.id}
        puzzle={puzzle}
        title={route.key === today ? t.home.dailyTitle(keyToDate(route.key)) : t.archive.dayTitle(keyToDate(route.key))}
        initial={save.games[puzzle.id]}
        alreadySolved={!!save.daily[route.key]}
        afterLine={route.key === today ? t.game.dailyDone : undefined}
        nextLabel={bookIsLocked ? t.archive.seeFull : t.game.keepGoing(save.book.level)}
        onNext={openBook}
        onKeep={keep}
        onSolved={(ms, hints) => {
          store.finishDaily(route.key, ms, hints);
          count('puzzle_solved', { kind: route.key === today ? 'daily' : 'past', size: puzzle.n, grade: puzzle.grade, seconds: ms / 1000, hints });
        }}
        onHint={(kind, what) => count('hint_used', { kind, what })}
        onExit={() => setRoute(route.back ?? { name: 'home' })}
        onRules={() => setRoute({ name: 'rules', back: route })}
      />
    );
  } else if (route.name === 'book' && puzzle) {
    screen = (
      <Game
        key={puzzle.id}
        puzzle={puzzle}
        title={t.home.bookTitle(route.level)}
        initial={save.games[puzzle.id]}
        showLegend={route.level <= 3}
        onKeep={keep}
        onSolved={(ms, hints) => {
          store.finishBook(puzzle.id, hints);
          count('puzzle_solved', { kind: 'book', size: puzzle.n, grade: puzzle.grade, level: route.level, seconds: ms / 1000, hints });
        }}
        onHint={(kind, what) => count('hint_used', { kind, what })}
        onNext={() => void nextBook(route.level)}
        onExit={() => setRoute({ name: 'home' })}
        onRules={() => setRoute({ name: 'rules', back: route })}
      />
    );
  } else {
    screen = (
      <Home
        today={today}
        onDaily={() => setRoute({ name: 'daily', key: today })}
        onBook={openBook}
        onRules={() => setRoute({ name: 'rules', back: { name: 'home' } })}
        onArchive={() => setRoute({ name: 'archive', month: monthOf(today) })}
        onSettings={() => setRoute({ name: 'settings' })}
        onFullEdition={canSell && !save.money.fullEdition ? () => setRoute({ name: 'full', back: { name: 'home' } }) : undefined}
        bookIsLocked={bookIsLocked}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {store.ready ? screen : null}
      <StatusBar style={dark ? 'light' : 'dark'} />
    </View>
  );
}

function Themed() {
  const { save } = useStore();
  return (
    <ThemeProvider choice={save.settings.theme}>
      <Screens />
    </ThemeProvider>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_500Medium,
    Newsreader_700Bold,
    LibreFranklin_500Medium,
    LibreFranklin_700Bold,
  });
  if (error) console.warn('Fonts did not load, falling back to system fonts', error);
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Themed />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LEGAL } from '../config/money';
import { t } from '../i18n/en';
import { purchases } from '../money/purchases';
import { useStore } from '../store/Store';
import { useTheme } from '../theme/ThemeContext';
import { space, tapMin } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { Chevron } from '../ui/Glyphs';
import { Rule } from '../ui/Rule';
import { Stamp } from '../ui/Stamp';
import { Type } from '../ui/Type';

type Note = 'none' | 'failed' | 'restored' | 'nothing';

/** The one paywall. Reached only by choice: from the end of the free Book, an older day, or the front page link. */
export function FullEdition({ onExit }: { onExit: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { save, setFullEdition } = useStore();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>('none');
  const owned = save.money.fullEdition;

  useEffect(() => {
    let alive = true;
    purchases
      .price()
      .then((p) => {
        if (alive) setPrice(p);
      })
      .catch((error) => console.warn('Could not read the price', error));
    return () => {
      alive = false;
    };
  }, []);

  const buy = async () => {
    setBusy(true);
    setNote('none');
    try {
      const result = await purchases.buy();
      if (result === 'bought') setFullEdition(true);
      else if (result === 'failed') setNote('failed');
    } catch (error) {
      console.warn('Purchase error', error);
      setNote('failed');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    setNote('none');
    try {
      const found = await purchases.restore();
      if (found) setFullEdition(true);
      setNote(found ? 'restored' : 'nothing');
    } catch (error) {
      console.warn('Restore error', error);
      setNote('nothing');
    } finally {
      setBusy(false);
    }
  };

  const open = (url: string) => {
    Linking.openURL(url).catch((error) => console.warn('Could not open the link', error));
  };

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.s, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Pressable accessibilityRole="button" accessibilityLabel={t.game.back} onPress={onExit} hitSlop={8} style={styles.back}>
          <Chevron size={20} color={c.text} />
          <Type variant="label">{t.game.back}</Type>
        </Pressable>
        <Rule strong />
        <Type variant="title" accessibilityRole="header" style={styles.title}>
          {t.full.title}
        </Type>
        <Type variant="bodyItalic" tone="muted" style={styles.promise}>
          {t.full.promise}
        </Type>
        <Rule />
        {t.full.items.map((item, i) => (
          <View key={i}>
            <Type style={styles.item}>{item}</Type>
            <Rule />
          </View>
        ))}
        <Type tone="muted" style={styles.free}>
          {t.full.free}
        </Type>

        {owned ? (
          <View style={styles.owned}>
            <Stamp word="Yours" animate={false} />
            <Type variant="bodyItalic" style={styles.center}>
              {note === 'restored' ? t.full.restored : t.full.thanks}
            </Type>
            <Btn label={t.game.home} kind="outline" onPress={onExit} style={styles.action} />
          </View>
        ) : (
          <View>
            <Btn label={busy ? t.full.buying : t.full.buy(price)} onPress={buy} disabled={busy} style={styles.action} />
            <Btn label={t.full.restore} kind="quiet" onPress={restore} disabled={busy} style={styles.restore} />
            {note === 'failed' || note === 'nothing' ? (
              <Type variant="bodyItalic" tone="accent" style={styles.center} accessibilityLiveRegion="polite">
                {note === 'failed' ? t.full.failed : t.full.nothingToRestore}
              </Type>
            ) : null}
            {LEGAL.terms || LEGAL.privacy ? (
              <View style={styles.legal}>
                {LEGAL.terms ? <Btn label={t.full.terms} kind="quiet" onPress={() => open(LEGAL.terms)} /> : null}
                {LEGAL.privacy ? <Btn label={t.full.privacy} kind="quiet" onPress={() => open(LEGAL.privacy)} /> : null}
              </View>
            ) : null}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.xl, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  back: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: tapMin, alignSelf: 'flex-start', paddingEnd: space.m },
  title: { marginTop: space.l },
  promise: { marginTop: space.xs, marginBottom: space.l },
  item: { marginVertical: space.m },
  free: { marginTop: space.l },
  owned: { marginTop: space.xl, gap: space.m },
  action: { marginTop: space.xl },
  restore: { alignSelf: 'center', marginTop: space.s },
  legal: { flexDirection: 'row', justifyContent: 'center', gap: space.l },
  center: { textAlign: 'center' },
});

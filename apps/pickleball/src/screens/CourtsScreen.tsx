import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { t } from '../i18n/en';
import { scoreCall, scoreFromRallies, Team } from '../logic/scoring';
import { addPlayer, cancelGame, counts, fillCourts, findByName, finishGame, gamesToWait, Session } from '../logic/session';
import { minutesSince, useNow } from '../state/useNow';
import { Button } from '../ui/Button';
import { CourtSurface } from '../ui/CourtSurface';
import { Icon } from '../ui/Icon';
import { LineTag } from '../ui/LineTag';
import { color, font, radius, size, space, touch } from '../theme/tokens';

interface Props {
  session: Session;
  act: (change: (s: Session, now: number) => Session) => void;
  undo: () => void;
  canUndo: boolean;
  openScorer: (court: number) => void;
  buzz: (kind: 'tap' | 'done') => void;
}

export function CourtsScreen({ session, act, undo, canUndo, openScorer, buzz }: Props) {
  const now = useNow();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [ending, setEnding] = useState<number | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);
  const name = (id: string) => session.players[id]?.name ?? '?';
  const c = counts(session);
  const here = c.waiting + c.playing;
  const nobody = Object.keys(session.players).length === 0;

  const submit = () => {
    const text = draft;
    setDraft('');
    const known = findByName(session, text);
    const next = fillCourts(addPlayer(session, text, now), now);
    if (next.queue.length === session.queue.length && next === session) {
      if (known) setToast(t.courts.already(known.name));
      return;
    }
    act((s, at) => fillCourts(addPlayer(s, text, at), at));
    const p = findByName(next, text);
    if (!p) return;
    const pos = next.queue.indexOf(p.id) + 1;
    if (pos === 0) setToast(t.courts.nextUpNow(p.name));
    else setToast(known ? t.courts.back(p.name, pos) : t.courts.added(p.name, pos));
    buzz('tap');
  };

  const endGame = (court: number, winner: Team) => {
    const next = finishGame(session, court, winner, now);
    act((s, at) => finishGame(s, court, winner, at));
    setEnding(null);
    const g = next.courts[court];
    if (g) setToast(t.courts.nextUpNow([...g.teamA, ...g.teamB].map((id) => next.players[id].name).join(', ')));
    buzz('done');
  };

  const up = session.queue.slice(0, 4);
  const rest = session.queue.slice(4);
  const endingGame = ending !== null ? session.courts[ending] : null;

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.top}>
        <View>
          <Text style={s.title}>{t.courts.title.toUpperCase()}</Text>
          <Text style={s.meta}>{t.courts.here(here, session.courts.length)}</Text>
        </View>
        {canUndo ? (
          <Pressable onPress={undo} style={s.undo} accessibilityRole="button" accessibilityLabel={t.a11y.undo}>
            <Icon name="undo" size={22} />
            <Text style={s.undoText}>{t.courts.undo}</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {nobody ? (
          <View style={s.empty}>
            <CourtSurface left={['1', '2']} right={['3', '4']} height={150} />
            <Text style={s.emptyTitle}>{t.courts.emptyTitle}</Text>
            <Text style={s.emptyBody}>{t.courts.emptyBody}</Text>
          </View>
        ) : (
          session.courts.map((g, i) => {
            if (!g) {
              const missing = Math.max(0, 4 - session.queue.length);
              return (
                <View key={`open-${i}`} style={s.card}>
                  <View style={s.chead}>
                    <Text style={s.label}>{t.courts.court(i + 1)}</Text>
                    <Text style={s.label}>{t.courts.open.toUpperCase()}</Text>
                  </View>
                  <CourtSurface left={[]} right={[]} height={70} dim />
                  <Text style={s.needs}>{t.courts.needs(missing)}</Text>
                </View>
              );
            }
            const score = scoreFromRallies(g.rallies, session.settings.scoring, g.firstServe);
            const leaving = [...g.teamA, ...g.teamB].filter((id) => session.players[id]?.leaving);
            return (
              <View key={g.id} style={s.card}>
                <View style={s.chead}>
                  <Text style={s.label}>{t.courts.court(i + 1)}</Text>
                  <Text style={s.label}>{t.courts.minutes(minutesSince(g.startedAt, now))}</Text>
                </View>
                <CourtSurface
                  left={g.teamA.map(name)}
                  right={g.teamB.map(name)}
                  call={g.rallies.length ? scoreCall(score, session.settings.scoring) : undefined}
                  height={92}
                />
                {leaving.length ? <Text style={s.leaving}>{leaving.map(name).join(', ')} {t.courts.leavingAfter}</Text> : null}
                <View style={s.row}>
                  <Button label={t.courts.score} onPress={() => openScorer(i)} style={s.flex} />
                  <Button label={t.courts.gameOver} kind="go" onPress={() => setEnding(i)} style={s.flex} />
                </View>
              </View>
            );
          })
        )}

        {up.length ? (
          <>
            <View style={s.sectionHead}>
              <Text style={s.label}>{session.courts.some((g) => !g) && up.length === 4 ? t.courts.nextOn : t.courts.onDeck}</Text>
            </View>
            <View style={s.stack}>
              {up.map((id, k) => (
                <LineTag key={id} pos={k + 1} name={name(id)} note={t.courts.waited(minutesSince(session.players[id].waitingSince, now))} strong />
              ))}
            </View>
          </>
        ) : null}
        {rest.length ? (
          <>
            <View style={s.sectionHead}>
              <Text style={s.label}>{t.courts.theLine}</Text>
            </View>
            <View style={s.stack}>
              {rest.map((id, k) => (
                <LineTag key={id} pos={k + 5} name={name(id)} note={t.courts.gamesAway(gamesToWait(session, id))} />
              ))}
            </View>
          </>
        ) : null}
        <View style={{ height: space.l }} />
      </ScrollView>

      {toast ? (
        <Pressable onPress={() => setToast(null)} style={s.toast} accessibilityRole="text">
          <Text style={s.toastText} numberOfLines={2}>
            {toast}
          </Text>
        </Pressable>
      ) : null}

      {adding ? (
        <View style={s.addBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submit}
            submitBehavior="submit"
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            placeholder={t.courts.addHint}
            placeholderTextColor={color.mute}
            style={s.input}
            maxLength={18}
            accessibilityLabel={t.a11y.add}
          />
          <Button label={t.courts.done} kind="ink" onPress={() => { if (draft.trim()) submit(); setAdding(false); }} style={s.doneBtn} />
        </View>
      ) : (
        <Pressable style={s.addBtn} onPress={() => { setAdding(true); setToast(null); }} accessibilityRole="button" accessibilityLabel={t.a11y.add}>
          <Icon name="plus" tint={color.ground} />
          <Text style={s.addText}>{t.courts.addPlayer}</Text>
        </Pressable>
      )}

      <Modal visible={endingGame != null} transparent animationType="fade" onRequestClose={() => setEnding(null)}>
        <View style={s.scrim}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>
              {t.courts.whoWon} {ending !== null ? ending + 1 : ''}?
            </Text>
            {endingGame
              ? (['A', 'B'] as Team[]).map((team) => {
                  const ids = team === 'A' ? endingGame.teamA : endingGame.teamB;
                  return (
                    <Pressable key={team} style={({ pressed }) => [s.winBtn, pressed && { opacity: 0.85 }]} onPress={() => endGame(ending!, team)} accessibilityRole="button">
                      <Text style={s.winText}>{ids.map(name).join(' & ').toUpperCase()}</Text>
                    </Pressable>
                  );
                })
              : null}
            <Button label={t.courts.notNow} onPress={() => setEnding(null)} style={{ marginTop: space.s }} />
            <Pressable onPress={() => { act((s2) => cancelGame(s2, ending!)); setEnding(null); }} style={s.cancelLink} accessibilityRole="button">
              <Text style={s.cancelText}>{t.courts.cancelGame}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ground },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.l + 2, paddingTop: space.m, paddingBottom: space.s },
  title: { fontFamily: font.display, fontSize: size.hero, color: color.ink, letterSpacing: 0.5, lineHeight: size.hero + 2 },
  meta: { fontFamily: font.body, fontSize: size.body, color: color.inkSoft },
  undo: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: touch.min, paddingHorizontal: space.m },
  undoText: { fontFamily: font.bodyBold, fontSize: size.body, color: color.ink },
  scroll: { paddingHorizontal: space.l, paddingTop: space.xs },
  card: { marginBottom: space.l + 2 },
  chead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.s },
  label: { fontFamily: font.label, fontSize: size.label, letterSpacing: 1.5, color: color.inkSoft },
  row: { flexDirection: 'row', gap: space.s, marginTop: space.s },
  flex: { flex: 1 },
  needs: { fontFamily: font.bodyBold, fontSize: size.body, color: color.ink, marginTop: space.s },
  leaving: { fontFamily: font.body, fontSize: size.body, color: color.ink, marginTop: space.s },
  sectionHead: { marginTop: space.m, marginBottom: space.s, paddingHorizontal: 2 },
  stack: { gap: 6 },
  empty: { backgroundColor: color.card, borderRadius: radius.box, padding: space.m },
  emptyTitle: { fontFamily: font.display, fontSize: size.title, color: color.ink, marginTop: space.l },
  emptyBody: { fontFamily: font.body, fontSize: size.body, lineHeight: 23, color: color.inkSoft, marginTop: space.xs },
  addBtn: { marginHorizontal: space.l, marginVertical: space.m, height: touch.big, borderRadius: radius.box, backgroundColor: color.ink, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.l + 2, gap: space.s },
  addText: { fontFamily: font.bodyBold, fontSize: size.body + 2, color: color.ground },
  addBar: { flexDirection: 'row', gap: space.s, padding: space.m, backgroundColor: color.card, borderTopWidth: 2, borderColor: color.ink },
  input: { flex: 1, minHeight: touch.min, borderWidth: 2, borderColor: color.ink, borderRadius: radius.box, paddingHorizontal: space.m, fontFamily: font.display, fontSize: size.name, color: color.ink },
  doneBtn: { width: 88 },
  toast: { position: 'absolute', left: space.l, right: space.l, bottom: touch.big + space.m * 2 + space.s, backgroundColor: color.ball, borderRadius: radius.box, paddingVertical: space.m, paddingHorizontal: space.l, borderWidth: 2, borderColor: color.ink },
  toastText: { fontFamily: font.bodyBold, fontSize: size.body, color: color.ballInk },
  scrim: { flex: 1, backgroundColor: color.scrim, justifyContent: 'flex-end' },
  sheet: { backgroundColor: color.ground, padding: space.l, paddingBottom: space.xxl, borderTopLeftRadius: radius.box * 2, borderTopRightRadius: radius.box * 2, gap: space.s },
  sheetTitle: { fontFamily: font.display, fontSize: size.title, color: color.ink, marginBottom: space.xs },
  winBtn: { minHeight: 76, backgroundColor: color.court, borderWidth: 3, borderColor: color.paint, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.m },
  winText: { fontFamily: font.display, fontSize: size.name + 2, color: color.paint },
  cancelLink: { minHeight: touch.min, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: font.bodyBold, fontSize: size.body, color: color.inkSoft, textDecorationLine: 'underline' },
});

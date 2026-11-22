import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { t } from '../i18n/en';
import { clock } from '../logic/history';
import { scoreCall, scoreFromRallies, Team } from '../logic/scoring';
import { addPlayer, beginGame, canOpenCourt, canRemoveCourt, cancelGame, checkIn, counts, fillCourts, findByName, finishGame, gamesToWait, MAX_COURTS, RotationRule, Session, updateSettings } from '../logic/session';
import { minutesSince, useNow } from '../state/useNow';
import { Button } from '../ui/Button';
import { Chip, Heading, Label, Segments } from '../ui/Bits';
import { CourtSurface } from '../ui/CourtSurface';
import { Glass } from '../ui/Glass';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { LineTag } from '../ui/LineTag';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space, TAB_SPACE, touch } from '../theme/tokens';

interface Props {
  session: Session;
  act: (change: (s: Session, now: number) => Session) => void;
  undo: () => void;
  canUndo: boolean;
  openScorer: (court: number) => void;
  openBoard: () => void;
  openGuide: () => void;
  /** Opened from the guide's Start button: go straight to adding names. */
  startAdding?: boolean;
  buzz: (kind: 'tap' | 'done') => void;
}

export function CourtsScreen({ session, act, undo, canUndo, openScorer, openBoard, openGuide, startAdding, buzz }: Props) {
  const s = useS();
  const c = useTheme();
  const now = useNow(1000);
  const [adding, setAdding] = useState(!!startAdding);
  const [menu, setMenu] = useState(false);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [ending, setEnding] = useState<number | null>(null);
  const [courtSheet, setCourtSheet] = useState<number | null>(null);
  const name = (id: string) => session.players[id]?.name ?? '?';
  const n = counts(session);
  const nobody = Object.keys(session.players).length === 0;

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const submit = () => {
    const text = draft;
    setDraft('');
    const known = findByName(session, text);
    const next = fillCourts(addPlayer(session, text, now), now);
    if (next === session) {
      if (known) setToast(t.courts.already(known.name));
      return;
    }
    act((s2, at) => fillCourts(addPlayer(s2, text, at), at));
    const p = findByName(next, text);
    if (!p) return;
    const pos = next.queue.indexOf(p.id) + 1;
    setToast(pos === 0 ? t.courts.nextUpNow(p.name) : known ? t.courts.back(p.name, pos) : t.courts.added(p.name, pos));
    buzz('tap');
  };

  const resting = Object.values(session.players).filter((p) => p.status === 'resting').sort((a, b) => a.name.localeCompare(b.name));

  const bringBack = (id: string, who: string) => {
    const next = fillCourts(checkIn(session, id, now), now);
    act((s2, at) => fillCourts(checkIn(s2, id, at), at));
    const pos = next.queue.indexOf(id) + 1;
    setToast(pos > 0 ? t.courts.back(who, pos) : t.courts.nextUpNow(who));
    buzz('tap');
  };

  const startGame = (court: number) => {
    act((s2, at) => beginGame(s2, court, at));
    buzz('tap');
  };

  const endGame = (court: number, winner: Team) => {
    act((s2, at) => finishGame(s2, court, winner, at));
    setEnding(null);
    buzz('done');
  };

  const up = session.queue.slice(0, 4);
  const rest = session.queue.slice(4);
  const endingGame = ending !== null ? session.courts[ending] : null;
  /** The game on the court whose sheet is open (null: an open court; undefined: no sheet). */
  const sheetGame = courtSheet !== null ? session.courts[courtSheet] ?? null : undefined;
  const rules = session.settings.scoring;

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title={t.courts.title}
        sub={`${t.courts.here(n.waiting + n.playing, session.courts.length)} · ${t.menu.ruleShort[session.settings.rule]}`}
        right={
          canUndo ? (
            <Chip onPress={undo} a11y={t.a11y.undo}>
              <Icon name="undo" size={18} />
              <Text style={s.chipText}>{t.courts.undo}</Text>
            </Chip>
          ) : undefined
        }
      />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {nobody ? (
          <Glass style={s.card}>
            <View style={s.pad}>
              <CourtSurface left={['1', '2']} right={['3', '4']} height={120} />
              <Text style={s.emptyTitle}>{t.courts.emptyTitle}</Text>
              <Text style={s.emptyBody}>{t.courts.emptyBody}</Text>
              <View style={s.emptyActions}>
                <Button label={t.menu.addPlayers} kind="go" onPress={() => setAdding(true)} style={{ flex: 1.4 }} />
                <Button label={t.menu.guideShort} onPress={openGuide} style={{ flex: 1 }} />
              </View>
            </View>
          </Glass>
        ) : (
          session.courts.map((g, i) => {
            if (!g) {
              const missing = Math.max(0, 4 - session.queue.length);
              return (
                <Glass key={`open-${i}`} style={s.card}>
                  <View style={s.pad}>
                    <View style={s.head}>
                      <Label>{t.courts.court(i + 1)}</Label>
                      <Label>{t.courts.open}</Label>
                    </View>
                    <CourtSurface left={[]} right={[]} height={60} dim />
                    <Text style={s.needs}>{t.courts.needs(missing)}</Text>
                  </View>
                </Glass>
              );
            }
            const sc = scoreFromRallies(g.rallies, rules, g.firstServe);
            const servers = (sc.serving === 'A' ? g.teamA : g.teamB).map(name).join(' & ');
            const leaving = [...g.teamA, ...g.teamB].filter((id) => session.players[id]?.leaving);
            return (
              <Pressable key={g.id} onPress={() => setCourtSheet(i)} accessibilityRole="button" accessibilityLabel={t.courts.edit(i + 1)}>
              <Glass style={s.card}>
                <View style={s.pad}>
                  <View style={s.head}>
                    <Label>{t.courts.court(i + 1)}</Label>
                    <Glass radius={radius.pill} style={s.timer} tint={c.cardHi}>
                      {g.started ? <View style={s.live} /> : null}
                      <Text style={s.timerText}>{g.started ? clock(now - g.startedAt) : t.courts.ready}</Text>
                    </Glass>
                  </View>
                  <CourtSurface left={g.teamA.map(name)} right={g.teamB.map(name)} call={g.rallies.length ? scoreCall(sc, rules) : undefined} live={g.started} height={96} introKey={g.id} />
                  {g.started ? (
                    <View style={s.scoreRow}>
                      <Text style={s.score} accessibilityLabel={`${sc.a} to ${sc.b}`}>{`${sc.a}–${sc.b}`}</Text>
                      <View style={s.buttons}>
                        <Button label={t.courts.score} onPress={() => openScorer(i)} style={s.btn} />
                        <Button label={t.courts.gameOver} kind="go" onPress={() => setEnding(i)} style={s.btn} />
                      </View>
                    </View>
                  ) : (
                    <Button label={t.courts.startGame} kind="go" onPress={() => startGame(i)} style={s.startBtn} />
                  )}
                  <Text style={s.serve} numberOfLines={1}>
                    {leaving.length ? `${leaving.map(name).join(', ')} ${t.courts.leavingAfter}` : g.started ? t.courts.serving(servers, rules.type === 'sideout' && rules.doubles ? sc.server : 0) : t.courts.readyHint}
                  </Text>
                </View>
              </Glass>
              </Pressable>
            );
          })
        )}

        {canOpenCourt(session) ? (
          <Pressable onPress={() => { act((s2, at) => updateSettings(s2, { courts: s2.courts.length + 1 }, at)); buzz('tap'); }} style={({ pressed }) => [s.ghost, pressed && { opacity: 0.8 }]} accessibilityRole="button" accessibilityLabel={t.menu.openCourt(session.courts.length + 1)}>
            <View style={s.ghostPlus}>
              <Icon name="plus" size={22} tint={c.accentText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.ghostTitle}>{t.menu.openCourt(session.courts.length + 1)}</Text>
              <Text style={s.ghostSub}>{t.menu.waitingOffer(session.queue.length)}</Text>
            </View>
          </Pressable>
        ) : null}
        {up.length ? (
          <>
            <Heading
              title={session.courts.some((g) => !g) && up.length === 4 ? t.courts.nextOn : t.courts.onDeck}
              style={s.lineHead}
              right={
                <Chip onPress={openBoard} a11y={t.board.open}>
                <Icon name="board" size={18} />
                <Text style={s.chipText}>{t.board.open}</Text>
              </Chip>
              }
            />
            <View style={s.stack}>
              {up.map((id, k) => (
                <LineTag key={id} pos={k + 1} name={name(id)} note={t.courts.waited(minutesSince(session.players[id].waitingSince, now))} strong />
              ))}
            </View>
          </>
        ) : null}
        {rest.length ? (
          <>
            <Heading title={t.courts.theLine} style={s.lineHead} />
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
        <Pressable onPress={() => setToast(null)} style={[s.toast, adding && { bottom: (resting.length ? 150 : 92) + TAB_SPACE }]}>
          <Text style={s.toastText} numberOfLines={2}>{toast}</Text>
        </Pressable>
      ) : null}

      {adding && resting.length ? (
        <Glass radius={0} style={s.chips}>
          <ScrollView horizontal keyboardShouldPersistTaps="always" contentContainerStyle={s.chipsPad}>
            <Label>{t.courts.backIn}</Label>
            {resting.map((p) => (
              <Pressable key={p.id} style={s.backChip} onPress={() => bringBack(p.id, p.name)} accessibilityRole="button" accessibilityLabel={`${t.courts.backIn} ${p.name}`}>
                <Text style={s.backChipText}>{p.name.toUpperCase()}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Glass>
      ) : null}
      <View style={s.bottom}>
        {adding ? (
          <Glass radius={radius.pill} style={s.addBar}>
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
              placeholderTextColor={c.mute}
              style={s.input}
              maxLength={18}
              accessibilityLabel={t.a11y.add}
            />
            <Button label={t.courts.done} kind="solid" onPress={() => { if (draft.trim()) submit(); setAdding(false); }} style={s.done} />
          </Glass>
        ) : (
          <View style={s.fabRow}>
            <Pressable onPress={() => { setAdding(true); setToast(null); }} accessibilityRole="button" accessibilityLabel={t.a11y.add} style={{ flex: 1 }}>
              <Glass radius={radius.pill} style={s.addBtn} tint={c.control}>
                <Icon name="people" size={20} />
                <Text style={s.addText}>{t.menu.addPlayers}</Text>
              </Glass>
            </Pressable>
            <Pressable onPress={() => setMenu(true)} style={({ pressed }) => [s.fab, pressed && { transform: [{ scale: 0.94 }] }]} accessibilityRole="button" accessibilityLabel={t.menu.open}>
              <Icon name="plus" size={30} tint={c.accentText} />
            </Pressable>
          </View>
        )}
      </View>

      <Modal visible={menu} transparent animationType="slide" onRequestClose={() => setMenu(false)}>
        <Pressable style={s.scrim} onPress={() => setMenu(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>{t.menu.title}</Text>
            <Button label={t.menu.addPlayers} kind="go" onPress={() => { setMenu(false); setAdding(true); }} />
            <View style={s.menuRow}>
              <Button
                label={session.courts.length >= MAX_COURTS ? t.menu.maxCourts : t.menu.openCourt(session.courts.length + 1)}
                disabled={session.courts.length >= MAX_COURTS}
                onPress={() => act((s2, at) => updateSettings(s2, { courts: s2.courts.length + 1 }, at))}
                style={{ flex: 1 }}
              />
              {canRemoveCourt(session) ? (
                <Button label={t.menu.removeCourt(session.courts.length)} onPress={() => act((s2, at) => updateSettings(s2, { courts: s2.courts.length - 1 }, at))} style={{ flex: 1 }} />
              ) : null}
            </View>
            <RulesPicker session={session} act={act} />
            <View style={s.menuRow}>
              <Button label={t.board.open} onPress={() => { setMenu(false); openBoard(); }} style={{ flex: 1 }} />
              <Button label={t.menu.howItWorks} onPress={() => { setMenu(false); openGuide(); }} style={{ flex: 1 }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={sheetGame !== undefined} transparent animationType="slide" onRequestClose={() => setCourtSheet(null)}>
        <Pressable style={s.scrim} onPress={() => setCourtSheet(null)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>{t.courts.sheetTitle((courtSheet ?? 0) + 1)}</Text>
            {sheetGame ? (
              <>
                <Text style={s.sheetTeams}>{`${sheetGame.teamA.map(name).join(' & ')}  v  ${sheetGame.teamB.map(name).join(' & ')}`.toUpperCase()}</Text>
                {sheetGame.started ? (
                  <View style={s.menuRow}>
                    <Button label={t.courts.score} onPress={() => { const k = courtSheet!; setCourtSheet(null); openScorer(k); }} style={{ flex: 1 }} />
                    <Button label={t.courts.gameOver} kind="go" onPress={() => { const k = courtSheet!; setCourtSheet(null); setEnding(k); }} style={{ flex: 1 }} />
                  </View>
                ) : (
                  <Button label={t.courts.startGame} kind="go" onPress={() => { startGame(courtSheet!); setCourtSheet(null); }} />
                )}
              </>
            ) : null}
            <RulesPicker session={session} act={act} />
            {sheetGame ? (
              <Pressable onPress={() => { act((s2) => cancelGame(s2, courtSheet!)); setCourtSheet(null); }} style={s.cancelLink} accessibilityRole="button">
                <Text style={s.cancelText}>{t.courts.cancelGame}</Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={endingGame != null} transparent animationType="fade" onRequestClose={() => setEnding(null)}>
        <View style={s.scrim}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>{t.courts.whoWon(ending !== null ? ending + 1 : 0)}</Text>
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

/** Who comes off and how points are counted: in the + menu and on every court's sheet. */
function RulesPicker({ session, act }: { session: Session; act: Props['act'] }) {
  const s = useS();
  return (
    <>
      <Label style={s.menuLabel}>{t.settings.rotation}</Label>
      {(['all-off', 'winners-stay', 'winners-split'] as RotationRule[]).map((r) => {
        const on = session.settings.rule === r;
        return (
          <Pressable key={r} onPress={() => act((s2, at) => updateSettings(s2, { rule: r }, at))} style={[s.rule, on && s.ruleOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
            <Text style={[s.ruleTitle, on && s.ruleTitleOn]}>{t.menu.ruleShort[r]}</Text>
            <Text style={[s.ruleHelp, on && s.ruleHelpOn]}>{t.menu.ruleHelp[r]}</Text>
          </Pressable>
        );
      })}
      <Label style={s.menuLabel}>{t.settings.scoring}</Label>
      <Segments<'sideout' | 'rally'> items={[['sideout', t.settings.sideout], ['rally', t.settings.rally]]} value={session.settings.scoring.type} onChange={(v) => act((s2, at) => updateSettings(s2, { scoring: { ...s2.settings.scoring, type: v } }, at))} />
    </>
  );
}

const useS = themed((c) => ({
  root: { flex: 1 },
  scroll: { paddingHorizontal: space.l, paddingBottom: space.l },
  card: { marginBottom: space.m },
  pad: { padding: space.m + 2 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.s },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 5 },
  live: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.live },
  timerText: { fontFamily: font.num, fontSize: 15, letterSpacing: 0.5, color: c.text, fontVariant: ['tabular-nums'] },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.l + 2 },
  score: { fontFamily: font.figure, fontSize: 34, lineHeight: 37, color: c.text, letterSpacing: 0.2 },
  buttons: { flexDirection: 'row', gap: space.s },
  btn: { minWidth: 104 },
  startBtn: { marginTop: space.l },
  sheetTeams: { fontFamily: font.name, textTransform: 'uppercase', fontSize: 24, letterSpacing: 3, color: c.textSoft, marginBottom: space.xs },
  serve: { fontFamily: font.body, fontSize: size.small, color: c.mute, marginTop: 2 },
  needs: { fontFamily: font.bodyBold, fontSize: size.body, color: c.textSoft, marginTop: space.s },
  emptyTitle: { fontFamily: font.heading, fontSize: size.title, color: c.text, marginTop: space.l },
  emptyBody: { fontFamily: font.body, fontSize: size.body, lineHeight: 23, color: c.textSoft, marginTop: space.xs },
  lineHead: { marginTop: space.l, marginBottom: space.m, marginHorizontal: 4 },
  chipText: { fontFamily: font.bodyBold, fontSize: size.small, color: c.text },
  stack: { gap: 7 },
  bottom: { paddingHorizontal: space.l, paddingBottom: TAB_SPACE, paddingTop: space.s },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s, minHeight: touch.big, paddingHorizontal: space.l, borderWidth: 1.5, borderColor: c.controlEdge },
  fabRow: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  fab: { width: touch.big + 4, height: touch.big + 4, borderRadius: (touch.big + 4) / 2, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', borderWidth: c.mode === 'light' ? 1.5 : 0, borderColor: c.accentLine },
  emptyActions: { flexDirection: 'row', gap: space.s, marginTop: space.l },
  ghost: { flexDirection: 'row', alignItems: 'center', gap: space.m, padding: space.m + 2, marginBottom: space.m, borderRadius: radius.glass, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.accent },
  ghostPlus: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' },
  ghostTitle: { fontFamily: font.heading, fontSize: 15, color: c.text },
  ghostSub: { fontFamily: font.body, fontSize: size.small, color: c.mute },
  menuRow: { flexDirection: 'row', gap: space.s },
  menuLabel: { marginTop: space.s },
  rule: { borderRadius: 16, borderWidth: 1, borderColor: c.controlEdge, paddingHorizontal: space.l, paddingVertical: space.s + 2 },
  ruleOn: { backgroundColor: c.solid, borderColor: c.solid },
  ruleTitle: { fontFamily: font.bodyBold, fontSize: size.body, color: c.text },
  ruleTitleOn: { color: c.solidText },
  ruleHelp: { fontFamily: font.body, fontSize: 13, color: c.mute, marginTop: 1 },
  ruleHelpOn: { color: c.solidMute },
  plus: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: font.bodyBold, fontSize: size.body + 2, color: c.text },
  addBar: { flexDirection: 'row', alignItems: 'center', gap: space.s, padding: 6 },
  input: { flex: 1, minWidth: 0, minHeight: touch.min - 4, paddingHorizontal: space.l, fontFamily: font.bodyBold, fontSize: size.body + 2, color: c.text },
  done: { width: 96 },
  chips: { borderTopWidth: 0 },
  chipsPad: { alignItems: 'center', gap: space.s, paddingHorizontal: space.l, paddingVertical: space.s },
  backChip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: space.l, backgroundColor: c.accent, borderRadius: 22 },
  backChipText: { fontFamily: font.name, textTransform: 'uppercase', letterSpacing: 3, fontSize: 21, color: c.accentText },
  toast: { position: 'absolute', left: space.l, right: space.l, bottom: TAB_SPACE + touch.big + space.l, backgroundColor: c.solid, borderRadius: radius.chip, paddingVertical: space.m, paddingHorizontal: space.l },
  toastText: { fontFamily: font.bodyBold, fontSize: size.body, color: c.solidText },
  scrim: { flex: 1, backgroundColor: c.scrim, justifyContent: 'flex-end' },
  sheet: { backgroundColor: c.sheet, padding: space.l, paddingBottom: space.xxl + space.l, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, gap: space.s },
  sheetTitle: { fontFamily: font.heading, fontSize: size.title, color: c.text, marginBottom: space.xs },
  winBtn: { minHeight: 76, backgroundColor: c.cardHi, borderRadius: radius.glass, borderWidth: 1, borderColor: c.edgeHi, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.m },
  winText: { fontFamily: font.name, textTransform: 'uppercase', letterSpacing: 3, fontSize: size.name + 2, color: c.text },
  cancelLink: { minHeight: touch.min, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: font.bodyBold, fontSize: size.body, color: c.mute, textDecorationLine: 'underline' },
}));

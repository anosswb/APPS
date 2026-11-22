// Awards and goals. The 20 badges sit in a dark display case (in both modes): earned ones shine,
// the rest wait, dimmed. Tap one to see how to earn it and who has it. Goals show a ring.
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { AwardId, AWARDS, AwardState } from '../logic/achievements';
import { fraction, Goal, GOAL_KINDS, GoalKind, progress } from '../logic/goals';
import { gamesIn, SessionRecord, stats } from '../logic/history';
import { useNow } from '../state/useNow';
import { Button } from '../ui/Button';
import { Chip, Label, Ring, Section, Segments } from '../ui/Bits';
import { BADGES } from '../ui/badges';
import { Glass } from '../ui/Glass';
import { Spectrum } from '../ui/Spectrum';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space, TAB_SPACE, touch } from '../theme/tokens';

type Filter = 'all' | 'player' | 'host';

interface Props {
  awards: Record<AwardId, AwardState>;
  sessions: SessionRecord[];
  goals: Goal[];
  setGoals: (g: Goal[]) => void;
}

export function AwardsScreen({ awards, sessions, goals, setGoals }: Props) {
  const s = useS();
  const c = useTheme();
  const now = useNow(60000);
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<AwardId | null>(null);
  const [adding, setAdding] = useState(false);
  const list = AWARDS.filter((a) => filter === 'all' || a.kind === filter);
  const earned = AWARDS.filter((a) => awards[a.id].earned).length;
  const top = stats(gamesIn(sessions, 'today', now)).table[0];
  const sel = open ? awards[open] : null;
  const def = open ? AWARDS.find((a) => a.id === open) : null;

  return (
    <View style={{ flex: 1 }}>
      <Header title={t.awards.title} sub={t.awards.sub(earned, AWARDS.length)} />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.px}>
          <Segments<Filter> items={[['all', t.awards.all], ['player', t.awards.players], ['host', t.awards.host]]} value={filter} onChange={setFilter} />
        </View>
        <View style={s.case}>
          <Spectrum height={2} style={s.caseShine} />
          <View style={s.grid}>
            {list.map((a) => {
              const st = awards[a.id];
              return (
                <Pressable key={a.id} onPress={() => setOpen(a.id)} style={({ pressed }) => [s.cell, pressed && { transform: [{ scale: 0.95 }] }]} accessibilityRole="button" accessibilityLabel={`${t.awards.name[a.id]}${st.earned ? '' : `, ${t.awards.locked}`}`}>
                  <Image source={BADGES[a.id]} style={[s.badge, !st.earned && s.locked]} resizeMode="contain" />
                  {!st.earned ? (
                    <View style={s.lock}>
                      <Icon name="lock" size={14} tint="#C9CED8" />
                    </View>
                  ) : null}
                  <Text style={[s.badgeName, !st.earned && { color: '#6B7282' }]} numberOfLines={1}>{t.awards.name[a.id]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Section
          title={t.awards.goals}
          right={
            <Chip onPress={() => setAdding(true)} a11y={t.awards.newGoal}>
              <Icon name="plus" size={18} />
              <Text style={s.chipText}>{t.awards.new}</Text>
            </Chip>
          }
        />
        {goals.length === 0 ? <Text style={[s.px, s.help]}>{t.awards.noGoals}</Text> : null}
        {goals.map((g) => {
          const p = progress(g, sessions, now);
          const done = p >= g.target;
          return (
            <Glass key={g.id} style={[s.mx, { marginBottom: space.m - 2 }]}>
              <View style={s.goal}>
                <View>
                  <Ring value={fraction(g, sessions, now)} />
                  {done ? (
                    <View style={s.goalCheck}>
                      <Icon name="check" size={22} tint={c.highlight} />
                    </View>
                  ) : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.goalBig}>{t.goals.big(g.kind, Math.min(p, g.target), g.target)}</Text>
                  <Text style={s.goalSub}>{t.goals.sub(g.kind, g.target)}</Text>
                </View>
                <Pressable onPress={() => setGoals(goals.filter((x) => x.id !== g.id))} style={s.trash} accessibilityRole="button" accessibilityLabel={t.awards.removeGoal}>
                  <Icon name="trash" size={20} tint={c.mute} />
                </Pressable>
              </View>
            </Glass>
          );
        })}

        {top ? (
          <Glass style={[s.mx, { marginTop: space.s }]}>
            <View style={s.pad}>
              <Label>{t.awards.topToday}</Label>
              <View style={s.topRow}>
                <Text style={s.topName} numberOfLines={1}>{top.name.toUpperCase()}</Text>
                <Text style={s.topMeta}>{t.awards.topLine(top.wins, top.games)}</Text>
              </View>
            </View>
          </Glass>
        ) : null}
      </ScrollView>

      <Modal visible={open !== null} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
        <Pressable style={s.scrim} onPress={() => setOpen(null)}>
          {open && sel && def ? (
            <View style={s.detail}>
              <View style={s.detailCase}>
                <Image source={BADGES[open]} style={[s.detailBadge, !sel.earned && s.locked]} resizeMode="contain" />
              </View>
              <Text style={s.detailName}>{t.awards.name[open]}</Text>
              <Text style={s.detailHow}>{t.awards.how[open]}</Text>
              {sel.earned ? (
                <Text style={s.detailWho}>{def.kind === 'player' && sel.by.length ? t.awards.by(sel.by) : t.awards.earnedOn(sel.at ?? 0)}</Text>
              ) : def.goal && sel.progress !== undefined ? (
                <Text style={s.detailWho}>{t.awards.progress(sel.progress, def.goal)}</Text>
              ) : (
                <Text style={s.detailWho}>{t.awards.notYet}</Text>
              )}
              <Button label={t.awards.close} onPress={() => setOpen(null)} style={{ alignSelf: 'stretch', marginTop: space.l }} />
            </View>
          ) : null}
        </Pressable>
      </Modal>

      <NewGoal visible={adding} onClose={() => setAdding(false)} onAdd={(kind, target) => { setGoals([...goals, { id: `g${Date.now().toString(36)}`, kind, target, createdAt: Date.now() }]); setAdding(false); }} />
    </View>
  );
}

function NewGoal({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (k: GoalKind, n: number) => void }) {
  const s = useS();
  const [kind, setKind] = useState<GoalKind>('sessions-month');
  const spec = GOAL_KINDS.find((g) => g.kind === kind)!;
  const [target, setTarget] = useState(spec.start);
  const pick = (k: GoalKind) => {
    setKind(k);
    setTarget(GOAL_KINDS.find((g) => g.kind === k)!.start);
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.scrimBottom}>
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>{t.awards.newGoal}</Text>
          {GOAL_KINDS.map((g) => (
            <Pressable key={g.kind} onPress={() => pick(g.kind)} style={[s.kindRow, kind === g.kind && s.kindOn]} accessibilityRole="radio" accessibilityState={{ selected: kind === g.kind }}>
              <Text style={[s.kindText, kind === g.kind && s.kindTextOn]}>{t.goals.kind[g.kind]}</Text>
            </Pressable>
          ))}
          <View style={s.stepper}>
            <Pressable style={s.step} onPress={() => setTarget(Math.max(spec.min, target - spec.step))} accessibilityRole="button" accessibilityLabel={t.a11y.minus}>
              <Icon name="minus" />
            </Pressable>
            <Text style={s.stepValue}>{target}</Text>
            <Pressable style={s.step} onPress={() => setTarget(Math.min(spec.max, target + spec.step))} accessibilityRole="button" accessibilityLabel={t.a11y.plus}>
              <Icon name="plus" />
            </Pressable>
          </View>
          <Text style={[s.help, { textAlign: 'center' }]}>{t.goals.sub(kind, target)}</Text>
          <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.m }}>
            <Button label={t.awards.cancel} onPress={onClose} style={{ flex: 1 }} />
            <Button label={t.awards.addGoal} kind="go" onPress={() => onAdd(kind, target)} style={{ flex: 1.4 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const useS = themed((c) => ({
  scroll: { paddingBottom: TAB_SPACE + space.xl },
  px: { paddingHorizontal: space.l },
  mx: { marginHorizontal: space.l },
  pad: { padding: space.l },
  help: { fontFamily: font.body, fontSize: size.body, color: c.mute, lineHeight: 22 },
  chipText: { fontFamily: font.bodyBold, fontSize: size.small, color: c.text },
  case: { marginHorizontal: space.l, marginTop: space.m, borderRadius: radius.xl, backgroundColor: c.showcase, borderWidth: 1, borderColor: c.edgeHi, paddingVertical: space.m, overflow: 'hidden' },
  caseShine: { position: 'absolute', left: space.xl, right: space.xl, top: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '25%', alignItems: 'center', paddingVertical: space.s },
  badge: { width: 70, height: 88 },
  locked: { opacity: 0.2 },
  lock: { position: 'absolute', top: 38, alignSelf: 'center', width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  badgeName: { fontFamily: font.bodyBold, fontSize: 11.5, color: '#E6E9EF', marginTop: 4, maxWidth: 88 },
  goal: { flexDirection: 'row', alignItems: 'center', gap: space.l, padding: space.l },
  goalCheck: { position: 'absolute', left: 0, top: 0, width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  goalBig: { fontFamily: font.figure, fontSize: 20, lineHeight: 22, color: c.text },
  goalSub: { fontFamily: font.body, fontSize: size.small, color: c.mute, marginTop: 2 },
  trash: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4, gap: space.s },
  topName: { flex: 1, fontFamily: font.name, textTransform: 'uppercase', fontSize: 29, color: c.text },
  topMeta: { fontFamily: font.num, fontSize: 18, color: c.highlight },
  scrim: { flex: 1, backgroundColor: c.scrim, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  detail: { alignSelf: 'stretch', backgroundColor: c.sheet, borderRadius: 30, padding: space.xl, alignItems: 'center' },
  detailCase: { width: 180, height: 200, borderRadius: radius.xl, backgroundColor: c.showcase, alignItems: 'center', justifyContent: 'center' },
  detailBadge: { width: 140, height: 175 },
  detailName: { fontFamily: font.heading, fontSize: 20, color: c.text, marginTop: space.l },
  detailHow: { fontFamily: font.body, fontSize: size.body, color: c.textSoft, textAlign: 'center', marginTop: space.xs },
  detailWho: { fontFamily: font.bodyBold, fontSize: size.body, color: c.highlight, textAlign: 'center', marginTop: space.m },
  scrimBottom: { flex: 1, backgroundColor: c.scrim, justifyContent: 'flex-end' },
  sheet: { backgroundColor: c.sheet, padding: space.l, paddingBottom: space.xxl + space.l, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, gap: space.s },
  sheetTitle: { fontFamily: font.heading, fontSize: size.title, color: c.text, marginBottom: space.xs },
  kindRow: { minHeight: 52, borderRadius: 16, paddingHorizontal: space.l, justifyContent: 'center', borderWidth: 1, borderColor: c.hair },
  kindOn: { backgroundColor: c.solid, borderColor: c.solid },
  kindText: { fontFamily: font.bodyBold, fontSize: size.body, color: c.text },
  kindTextOn: { color: c.solidText },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.m },
  step: { width: touch.big, height: touch.big, borderRadius: radius.pill, borderWidth: 1.5, borderColor: c.hair, alignItems: 'center', justifyContent: 'center' },
  stepValue: { fontFamily: font.figure, fontSize: 39, color: c.text },
}));

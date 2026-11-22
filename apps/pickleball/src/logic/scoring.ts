// Pickleball scoring as pure functions. A game is the list of rally winners; the score is folded from it.
// Undo = drop the last rally. Nothing here touches the screen or storage.

export type Team = 'A' | 'B';
export type ScoringType = 'sideout' | 'rally';

export interface ScoreRules {
  type: ScoringType;
  target: number; // 11, 15 or 21
  winBy: number; // 2 in every common format
  doubles: boolean;
}

export interface ScoreState {
  a: number;
  b: number;
  serving: Team;
  /** 1 or 2 in sideout doubles. Always 1 in singles and in rally scoring. */
  server: 1 | 2;
  winner: Team | null;
}

export const DEFAULT_RULES: ScoreRules = { type: 'sideout', target: 11, winBy: 2, doubles: true };

export function other(team: Team): Team {
  return team === 'A' ? 'B' : 'A';
}

export function startState(rules: ScoreRules, firstServe: Team = 'A'): ScoreState {
  // Sideout doubles starts at "0-0-2": the first serving team has only one server before the first sideout.
  const server: 1 | 2 = rules.type === 'sideout' && rules.doubles ? 2 : 1;
  return { a: 0, b: 0, serving: firstServe, server, winner: null };
}

export function winnerOf(a: number, b: number, rules: ScoreRules): Team | null {
  if (a >= rules.target && a - b >= rules.winBy) return 'A';
  if (b >= rules.target && b - a >= rules.winBy) return 'B';
  return null;
}

/** Apply one rally won by `team`. A finished game does not change. */
export function applyRally(s: ScoreState, team: Team, rules: ScoreRules): ScoreState {
  if (s.winner) return s;
  let { a, b, serving, server } = s;
  if (rules.type === 'rally') {
    if (team === 'A') a += 1;
    else b += 1;
    serving = team;
    server = 1;
  } else if (team === serving) {
    if (team === 'A') a += 1;
    else b += 1;
  } else if (rules.doubles && server === 1) {
    server = 2;
  } else {
    serving = other(serving);
    server = 1;
  }
  return { a, b, serving, server, winner: winnerOf(a, b, rules) };
}

export function scoreFromRallies(rallies: readonly Team[], rules: ScoreRules, firstServe: Team = 'A'): ScoreState {
  return rallies.reduce((s, t) => applyRally(s, t, rules), startState(rules, firstServe));
}

/** The words a player says before serving: "4-2-1" in sideout doubles, "4-2" otherwise. Serving side first. */
export function scoreCall(s: ScoreState, rules: ScoreRules): string {
  const mine = s.serving === 'A' ? s.a : s.b;
  const theirs = s.serving === 'A' ? s.b : s.a;
  if (rules.type === 'sideout' && rules.doubles) return `${mine}-${theirs}-${s.server}`;
  return `${mine}-${theirs}`;
}

/** True when one more point for `team` wins the game. */
export function isGamePoint(s: ScoreState, team: Team, rules: ScoreRules): boolean {
  if (s.winner) return false;
  if (rules.type === 'sideout' && s.serving !== team) return false;
  const next = team === 'A' ? winnerOf(s.a + 1, s.b, rules) : winnerOf(s.a, s.b + 1, rules);
  return next === team;
}

/** Players switch ends when the first team reaches half the target (6 in a game to 11). */
export function switchEndsAt(rules: ScoreRules): number {
  return Math.ceil(rules.target / 2);
}

/** The biggest lead the other side ever had over `team` during the game (0 if `team` never trailed). */
export function maxDeficit(rallies: readonly Team[], rules: ScoreRules, firstServe: Team, team: Team): number {
  let s = startState(rules, firstServe);
  let worst = 0;
  for (const r of rallies) {
    s = applyRally(s, r, rules);
    const gap = team === 'A' ? s.b - s.a : s.a - s.b;
    if (gap > worst) worst = gap;
  }
  return worst;
}

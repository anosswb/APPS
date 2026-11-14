/** Every word the app shows, in American English. Sentence case. No guilt words. */
import { Conflict, Grade, Line, Step } from '../game/types';
import { Hint } from '../game/hints';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const GRADE: Record<Grade, string> = { easy: 'Gentle', medium: 'Steady', hard: 'Tricky' };

function lineName(line: Line): string {
  return `${line.kind === 'row' ? 'row' : 'column'} ${line.index + 1}`;
}
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function tents(n: number): string {
  return n === 1 ? '1 tent' : `${n} tents`;
}

function conflictText(c: Conflict): string {
  switch (c.kind) {
    case 'over':
      return `${lineName(c.line)} would have too many tents`;
    case 'short':
      return `${lineName(c.line)} could never fit its number of tents`;
    case 'touch':
      return 'two tents would end up touching';
    case 'treeNoTent':
      return 'a tree would be left with no room for its tent';
    case 'tentNoTree':
      return 'a tent would have no tree of its own';
  }
}

function stepText(s: Step): string {
  const many = s.cells.length > 1;
  switch (s.technique) {
    case 'noTree':
      return many
        ? 'No tree stands next to these squares, so no tent can go there. They are grass.'
        : 'No tree stands next to this square, so no tent can go there. It is grass.';
    case 'tentTouch':
      return 'Tents never touch, not even at the corners. The open squares around this tent are grass.';
    case 'lineFull':
      return `${cap(lineName(s.line as Line))} already has all its tents. The other squares in ${lineName(s.line as Line)} are grass.`;
    case 'lineAllTents':
      return `${cap(lineName(s.line as Line))} still needs ${tents(s.need as number)} and has exactly ${s.cells.length} open ${many ? 'squares' : 'square'}. ${many ? 'They are all tents.' : 'It is a tent.'}`;
    case 'treeLast':
      return 'This tree has only one open square beside it. Its tent goes there.';
    case 'treeDone':
      return many
        ? 'The trees next to these squares already have their tents, so no other tent fits here. They are grass.'
        : 'Every tree next to this square already has its tent, so no other tent fits here. It is grass.';
    case 'treeNeeds':
      return 'The tent next to this tree belongs to another tree, so this tree still needs its own. Only one square is open beside it, and its tent goes there.';
    case 'fitTents':
      return `${cap(lineName(s.line as Line))} still needs ${tents(s.need as number)}. Every way of fitting them in puts a tent on ${many ? 'these squares' : 'this square'}.`;
    case 'fitGrass':
      return `${cap(lineName(s.line as Line))} still needs ${tents(s.need as number)}. No way of fitting them in puts a tent on ${many ? 'these squares' : 'this square'}, so ${many ? 'they are' : 'it is'} grass.`;
    case 'fitShadow':
      return `However the tents fit into ${lineName(s.line as Line)}, one of them lands right next to ${many ? 'these squares' : 'this square'}. A tent here would touch it, so ${many ? 'they are' : 'it is'} grass.`;
    case 'contradiction':
      return s.mark === 1
        ? `Picture a tent here: then ${conflictText(s.conflict as Conflict)}. So it is grass.`
        : `Picture grass here: then ${conflictText(s.conflict as Conflict)}. So it is a tent.`;
  }
}

export const t = {
  days: DAYS,
  dateLine: (d: Date) => `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  dayShort: (d: Date) => DAYS[d.getDay()].slice(0, 1),
  grade: (g: Grade) => GRADE[g],
  sizeLine: (n: number, g: Grade) => `${n} × ${n} · ${GRADE[g]}`,

  home: {
    tagline: 'One quiet logic puzzle a day',
    today: "Today's puzzle",
    dailyTitle: (d: Date) => `The ${DAYS[d.getDay()]} puzzle`,
    dailyBlurb: 'The same puzzle for everyone today. One answer, no guessing.',
    start: 'Start',
    resume: 'Keep going',
    solved: 'Solved',
    look: 'Look again',
    week: 'This week',
    book: 'The book',
    bookTitle: (n: number) => `Puzzle No. ${n}`,
    bookBlurb: (done: number) => (done === 0 ? 'Start here. The first few teach you the game.' : `${done} ${done === 1 ? 'puzzle' : 'puzzles'} solved so far. They get bigger as you go.`),
    open: 'Open',
    rules: 'How to play',
    past: 'Past puzzles',
    settings: 'Settings',
  },

  archive: {
    title: 'Past puzzles',
    month: (year: number, month: number) => `${MONTHS[month]} ${year}`,
    dayTitle: (d: Date) => `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`,
    earlier: 'Earlier month',
    later: 'Later month',
    count: (solved: number) => (solved === 0 ? 'Nothing stamped this month yet.' : solved === 1 ? '1 puzzle stamped this month.' : `${solved} puzzles stamped this month.`),
    dayLabel: (d: Date, state: 'solved' | 'started' | 'open' | 'closed') =>
      `${MONTHS[d.getMonth()]} ${d.getDate()}${state === 'solved' ? ', solved' : state === 'started' ? ', started' : state === 'closed' ? ', not available' : ''}`,
    week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    lockedLabel: 'older puzzle, closed',
    olderVideo: (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()} is an older puzzle. A short video opens it, and it stays open.`,
    watch: 'Watch a short video',
    olderFull: (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()} is an older puzzle. Older puzzles are part of the full edition.`,
    seeFull: 'See the full edition',
    notNow: 'Not now',
    onUs: 'No video is ready right now, so this one is on us.',
  },

  full: {
    title: 'The full edition',
    promise: 'One payment. Yours for good. No subscription.',
    items: [
      'The whole Book: every puzzle after No. 30, with no end.',
      'Every past puzzle, back to the first edition.',
      'No ads. There are none on iPhone, and there never will be.',
    ],
    free: 'Still free for everyone: the daily puzzle, the last seven days, hints, and the first 30 puzzles of the Book.',
    buy: (price: string | null) => (price ? `Buy once · ${price}` : 'Buy once'),
    buying: 'One moment',
    restore: 'Restore purchases',
    restored: 'Found it. The full edition is yours again.',
    nothingToRestore: 'No earlier purchase was found for this Apple account.',
    failed: 'The purchase did not go through. Nothing was charged.',
    thanks: 'Thank you. The full edition is yours.',
    terms: 'Terms',
    privacy: 'Privacy',
    homeLink: 'The full edition',
    bookEnd: 'Puzzle No. 30 was the last free one. The rest of the Book is in the full edition.',
  },

  settings: {
    title: 'Settings',
    look: 'Look',
    lookOptions: { system: 'Auto', light: 'Day', dark: 'Night' },
    sound: 'Sound',
    haptics: 'Vibration',
    on: 'On',
    off: 'Off',
    privacy: 'Privacy',
    privacyText: (name: string, hasAds: boolean) =>
      hasAds
        ? `Your puzzles and progress stay on this phone, and ${name} needs no account. The ads are served by Google, which uses this phone's advertising ID to choose them. ${name} itself collects nothing.`
        : `Your puzzles and progress stay on this phone. ${name} collects nothing and needs no account.`,
    adChoices: 'Ad privacy choices',
    credits: 'Credits',
    creditsText: 'Type: Newsreader and Libre Franklin, used under the SIL Open Font License. Built with Expo and React Native (MIT License). The drawings, sounds and puzzles are our own.',
    version: (name: string, v: string) => `${name}, version ${v}`,
  },

  game: {
    back: 'Front page',
    undo: 'Undo',
    hint: 'Hint',
    rules: 'Rules',
    legend: 'Tap once for grass, twice for a tent. Drag to mark several squares.',
    gridLabel: (n: number) => `Puzzle grid, ${n} by ${n}`,
    tents: (have: number, want: number) => `Tents ${have} of ${want}`,
    markIt: 'Mark it for me',
    clearThem: 'Clear it',
    gotIt: 'Got it',
    solvedStamp: 'Solved',
    solvedLine: (time: string, hints: number) =>
      hints === 0 ? `Done in ${time}, with no hints.` : `Done in ${time}, with ${hints === 1 ? '1 hint' : `${hints} hints`}.`,
    next: 'Next puzzle',
    home: 'Back to the front page',
    seeYou: 'Come back tomorrow for a new one.',
  },

  hint: (h: Hint): string => {
    switch (h.kind) {
      case 'solved':
        return 'Every tent is in place.';
      case 'mistake':
        if (h.reason === 'touch') return 'These tents touch each other. Tents never touch, not even at the corners.';
        if (h.reason === 'over') return `${cap(lineName(h.line as Line))} has more tents than its number allows. One of these does not belong.`;
        return 'This square does not fit. Clear it and take another look.';
      case 'reveal':
        return h.mark === 2 ? 'A tent goes here.' : 'This square is grass.';
      case 'step':
        return stepText(h.step);
    }
  },

  rules: {
    title: 'How to play',
    intro: 'Pitch one tent for every tree. Three rules decide where.',
    r1: 'Every tree gets one tent of its own, right beside it: above, below, left or right.',
    r2: 'Tents never touch each other, not even at the corners.',
    r3: 'The numbers tell you how many tents are in each row and column.',
    marks: 'Tap a square once to mark grass (no tent here). Tap again to pitch a tent. A third tap clears it.',
    promise: 'Every puzzle has exactly one answer and can be solved by thinking alone. You never have to guess.',
    done: 'Got it',
  },
};

export function clock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

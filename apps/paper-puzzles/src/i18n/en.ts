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
    book: 'Free play · no clock, no ink limit',
    bookTitle: (n: number) => `Puzzle No. ${n}`,
    bookBlurb: (done: number) => (done === 0
        ? 'Your own pace, with hints when you want them. The first few teach you the game.'
        : `${done} solved. Just the puzzle and you, hints allowed. Every fifth one is a big one.`),
    open: 'Open',
    play: (n: number) => `Play No. ${n}`,
    big: 'Big one',
    stripLabel: (n: number) => `You are on puzzle number ${n} of free play`,
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
    free: 'Still free for everyone: the daily puzzle, the last seven days, hints, and the first 30 puzzles of free play.',
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
    bookEnd: 'Puzzle No. 30 was the last free one in free play. The rest is in the full edition.',
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
    privacyText: (name: string, hasAds: boolean, hasStats: boolean) => {
      const own = hasStats
        ? `${name} counts a few things without knowing who you are (puzzles started and solved, hints used), so we can see what to improve. Nothing you could be recognized by is sent.`
        : `${name} itself collects nothing.`;
      const adLine = hasAds ? " The ads are served by Google, which uses this phone's advertising ID to choose them." : '';
      return `Your puzzles and progress stay on this phone, and ${name} needs no account. ${own}${adLine}`;
    },
    stats: 'Share anonymous numbers',
    // Test builds only: what the ads are doing, so a missing ad can be explained from a screenshot.
    adTest: {
      title: 'Test build: ads',
      text: (s: { consent: string; started: boolean; fullScreen: string; video: string }, minutes: number, quiet: number, lastAd: number | null, finished: number, after: number, gap: number) =>
        [
          `Consent: ${s.consent}`,
          `Ads library started: ${s.started ? 'yes' : 'no'}`,
          `Full-screen ad: ${s.fullScreen}`,
          `Video ad: ${s.video}`,
          `Minutes since the first opening: ${minutes} (no ad in the first ${quiet})`,
          `Puzzles finished: ${finished} (no ad before ${after})`,
          `Last full-screen ad: ${lastAd === null ? 'never' : `${lastAd} min ago`} (one every ${gap} min at most)`,
        ].join('\n'),
    },
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
    // Read aloud by VoiceOver and TalkBack, one square at a time.
    square: (row: number, col: number, what: 'tree' | 'tent' | 'grass' | 'empty', problem: boolean) =>
      `Row ${row}, column ${col}, ${what}${problem ? ', breaks a rule' : ''}`,
    squareHint: 'Double tap to change: grass, then tent, then empty.',
    lineCount: (kind: 'row' | 'col', index: number, want: number, have: number) =>
      `${kind === 'row' ? 'Row' : 'Column'} ${index}: ${want === 1 ? '1 tent' : `${want} tents`} wanted, ${have} placed`,
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
    keepGoing: (n: number) => `Keep going: Puzzle No. ${n}`,
    // the Hint button after a long pause with no mark
    hintNudge: 'Stuck? Hint',
    dailyDone: "That was today's puzzle. A new one comes tomorrow. Free play never runs out.",
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

  challenge: {
    lead: 'The main game',
    second: 'Also on the clock',
    name: { race: 'Beat the clock', ink: 'One pot of ink' },
    level: (n: number) => `No. ${n}`,
    deck: {
      ink: (tents: number, drops: number) =>
        `${tents} tents to pitch, ${drops} drops in the pot. Every tent costs a drop. Run dry and the page is lost.`,
      race: (time: string) => `Solve it before the clock runs out. You have ${time}.`,
    },
    play: (n: number) => `Play No. ${n}`,
    keepGoing: (n: number) => `Keep going: One pot of ink No. ${n}`,
    run: (now: number, best: number) => (now > 0 ? `${now} ${now === 1 ? 'win' : 'wins'} in a row · best ${best}` : `Best run: ${best} in a row`),
    inkLeft: 'Ink',
    timeLeft: 'Clock',
    gauge: {
      ink: (left: number, total: number) => `${left} of ${total} drops of ink left`,
      race: (time: string) => `${time} left on the clock`,
    },
    kicker: 'Challenges',
    blurb: 'Two ways to test yourself. These can be lost, and you can always try again.',
    open: { race: (n: number) => `Beat the clock · No. ${n}`, ink: (n: number) => `One pot of ink · No. ${n}` },
    title: { race: (n: number) => `Beat the clock No. ${n}`, ink: (n: number) => `One pot of ink No. ${n}` },
    intro: {
      race: (time: string) => `Solve it before the clock runs out. You have ${time}. No hints here.`,
      ink: (drops: number, tents: number) =>
        `Every tent you pitch uses one drop of ink. This puzzle needs ${tents} tents and the pot holds ${drops} drops. Grass is free. Think before you pitch. No hints here.`,
    },
    clock: (time: string) => `Time ${time}`,
    ink: (left: number) => `Ink ${left}`,
    lost: { race: 'Time is up.', ink: 'The ink ran dry.' },
    closeness: (right: number, total: number) => `${right} of ${total} tents were in the right place.`,
    more: { race: (seconds: number) => `Watch a video: ${seconds} more seconds`, ink: (drops: number) => `Watch a video: ${drops} more drops` },
    again: 'Try again',
    won: {
      race: (time: string) => `Solved with ${time} left on the clock.`,
      ink: (left: number) => (left === 0 ? 'Solved with the very last drop.' : `Solved with ${left === 1 ? '1 drop' : `${left} drops`} of ink to spare.`),
    },
    next: { race: 'Next race', ink: 'Next pot' },
  },

  // The compliment after a solve. A puzzle editor's nod, for adults: it names what the player did.
  // No exclamation marks, no "awesome". Several wordings per kind so it does not repeat.
  praise: {
    mark: (seconds: number) => (seconds < 60 ? `${seconds} seconds` : seconds === 60 ? 'a minute' : seconds === 90 ? 'a minute and a half' : `${seconds / 60} minutes`),
    lines: {
      under: [
        (mark: string) => `Under ${mark}. Sharp work.`,
        (mark: string) => `Under ${mark}, and no hints.`,
        (mark: string) => `Under ${mark}. That was quick.`,
      ],
      newBest: ['A new personal best.', 'Your fastest yet.', 'Faster than you have ever been.'],
      hardClean: ['A tricky one, with no help. Well played.', 'No hints on a hard page. Impressive.', 'That one stops most people. Not you.'],
      clean: ['Clean work. Not one hint.', 'Solved on your own.', 'No help needed. Nicely done.', 'A steady hand.'],
      fewHints: ['Nicely finished.', 'Solved. A hint is fair play.', 'Done, and well reasoned.'],
      helped: ['Finished. The next one will come easier.', 'Done. Every page teaches the next.', 'Solved. That is how it is learned.'],
      lastDrop: ['Down to the very last drop.', 'Not a drop wasted.', 'The last drop, and it was enough.'],
      inkSpare: ['Ink to spare. Careful work.', 'Measured twice, pitched once.', 'Every tent in its place.'],
      clockHalf: ['Half the clock still standing.', 'Time to spare. Well run.', 'The clock never stood a chance.'],
      clock: ['Beat the clock.', 'In before the bell.', 'Close, and enough.'],
    },
  },

  records: {
    kicker: 'Your bests',
    blurb: 'You against yourself. Times count only when you use no hints.',
    time: (n: number, time: string) => `${n} × ${n} in ${time}`,
    first: (n: number, time: string) => `Your first ${n} × ${n} with no hints: ${time}. That is your time to beat.`,
    fresh: (n: number, time: string, was: string) => `A new best for a ${n} × ${n}: ${time}. It was ${was}.`,
    keep: (n: number, best: string) => `Your best for a ${n} × ${n} is ${best}.`,
    run: (now: number, best: number) => (now >= best ? `${now} wins in a row. Your best run yet.` : `${now} wins in a row. Your best is ${best}.`),
    runLine: { race: 'Beat the clock', ink: 'One pot of ink' },
    runNow: (now: number, best: number) => (now > 0 ? `${now} in a row now, best ${best}` : `best run ${best}`),
  },

  reminder: {
    ask: "Want a note when tomorrow's puzzle is out?",
    askAbout: 'One a day, nothing else. You can turn it off in Settings.',
    yes: 'Yes, tell me',
    no: 'No thanks',
    isOn: (time: string) => `Done. A note will come each day at ${time}.`,
    blocked: "This phone is not letting us show notes. You can allow them in the phone's settings.",
    phoneSettings: 'Open phone settings',
    setting: 'Daily reminder',
    settingAbout: 'One note a day when the new puzzle is out. If you stay away for a week, the notes stop by themselves.',
    times: { morning: '8 AM', noon: 'Noon', evening: '7 PM' },
    noteTitle: (d: Date) => `The ${DAYS[d.getDay()]} puzzle is out`,
    noteBody: (n: number, g: Grade) => `${n} × ${n} · ${GRADE[g]}. One answer, no guessing.`,
    channel: 'Daily puzzle',
    channelAbout: 'One note a day when the new puzzle is out.',
  },

  licenses: {
    title: 'Open-source licenses',
    back: 'Settings',
    open: 'Open-source licenses',
    intro: (name: string) => `${name} is built with the work of other people, shared under the licenses below. Thank you to all of them.`,
    names: {
      MIT: 'MIT License',
      'Apache-2.0': 'Apache License 2.0',
      'BSD-3-Clause': 'BSD 3-Clause License',
      ISC: 'ISC License',
      'OFL-1.1': 'SIL Open Font License 1.1',
    },
    font: (name: string) => `${name} (typeface)`,
    read: 'Read the license',
    hide: 'Hide the license',
    android: 'The Android app also contains the AndroidX and Kotlin libraries (Apache License 2.0) and the Google Mobile Ads SDK, which is used under Google\'s own terms.',
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

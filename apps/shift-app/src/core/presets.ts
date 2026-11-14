/**
 * Ready-made rotations used in American plants, warehouses, hospitals and fire houses.
 * Sources: the usual published descriptions of these schedules. Each one is checked by a test
 * (cycle length, hours per week on average) and must be confirmed by real workers before release.
 */
import { ShiftCode } from './rotation';

export interface Preset {
  id: string;
  name: string;
  /** one plain line: who works it and what it feels like */
  about: string;
  cycle: ShiftCode[];
  /** hours of a normal shift in this rotation */
  hours: number;
}

const c = (text: string): ShiftCode[] => text.replace(/\s/g, '').split('') as ShiftCode[];

export const PRESETS: Preset[] = [
  { id: '223-days', name: '2-2-3, days', about: 'Pitman. 12-hour days. Every other weekend is a 3-day weekend off.', cycle: c('DDOO DDD OO DD OOO'), hours: 12 },
  { id: '223-nights', name: '2-2-3, nights', about: 'Pitman. 12-hour nights. Every other weekend off.', cycle: c('NNOO NNN OO NN OOO'), hours: 12 },
  { id: '223-rotating', name: '2-2-3, days then nights', about: 'Pitman. Two weeks of days, then two weeks of nights.', cycle: c('DDOO DDD OO DD OOO NNOO NNN OO NN OOO'), hours: 12 },
  { id: '4on4off-days', name: '4 on, 4 off, days', about: 'Four 12-hour days, then four days off.', cycle: c('DDDD OOOO'), hours: 12 },
  { id: '4on4off-nights', name: '4 on, 4 off, nights', about: 'Four 12-hour nights, then four days off.', cycle: c('NNNN OOOO'), hours: 12 },
  { id: '4on4off-rotating', name: '4 on, 4 off, days then nights', about: 'Four days, four off, four nights, four off.', cycle: c('DDDD OOOO NNNN OOOO'), hours: 12 },
  { id: 'dupont', name: 'DuPont', about: 'Four weeks. Four nights, three days, three nights, four days, then seven days off in a row.', cycle: c('NNNN OOO DDD O NNN OOO DDDD OOOOOOO'), hours: 12 },
  { id: '3x12', name: 'Three 12s', about: 'Three 12-hour shifts a week, four days off.', cycle: c('DDD OOOO'), hours: 12 },
  { id: '4x10', name: 'Four 10s', about: 'Four 10-hour days a week, three days off.', cycle: c('DDDD OOO'), hours: 10 },
  { id: '5x8', name: 'Five 8s', about: 'Five 8-hour days, two days off.', cycle: c('DDDDD OO'), hours: 8 },
  { id: 'swing-3-week', name: 'Rotating 8s', about: 'A week of days, a week of swing shift, a week of nights. Weekends off.', cycle: c('DDDDD OO SSSSS OO NNNNN OO'), hours: 8 },
  { id: '24-48', name: '24 on, 48 off', about: 'Fire and EMS. One 24-hour shift, two days off.', cycle: c('X OO'), hours: 24 },
  { id: '48-96', name: '48 on, 96 off', about: 'Fire and EMS. Two 24-hour shifts, four days off.', cycle: c('XX OOOO'), hours: 24 },
];

export function presetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

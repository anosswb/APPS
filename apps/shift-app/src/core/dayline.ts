/**
 * The day around a shift, from three numbers the worker gives once.
 * Every time is in minutes after midnight of the day the shift starts; a negative number is the evening before,
 * a number of 1440 or more is the next day. No health advice: the hours of sleep are the worker's own wish.
 */
import { WorkDay, shiftMinutes } from './days';

export interface Habits {
  /** minutes from waking to leaving the house */
  getReady: number;
  /** minutes to get to work */
  commute: number;
  /** hours of sleep the worker wants */
  sleep: number;
}

export const DEFAULT_HABITS: Habits = { getReady: 45, commute: 30, sleep: 7 };

export interface DayLine {
  sleepBy: number;
  wake: number;
  leave: number;
  clockIn: number;
  /** the middle of the shift: a reminder to eat, not a break rule */
  eat: number;
  clockOut: number;
  home: number;
}

export function dayLine(day: WorkDay, h: Habits): DayLine {
  const leave = day.start - h.commute;
  const wake = leave - h.getReady;
  const clockOut = day.start + shiftMinutes(day);
  return {
    sleepBy: wake - Math.round(h.sleep * 60),
    wake,
    leave,
    clockIn: day.start,
    eat: day.start + Math.round(shiftMinutes(day) / 2),
    clockOut,
    home: clockOut + h.commute,
  };
}

/** Minutes → a US clock time and which day it falls on (-1 the evening before, 0 the shift day, 1 the day after). */
export function clock(minutes: number): { text: string; hour: number; minute: number; dayOffset: number } {
  const dayOffset = Math.floor(minutes / 1440);
  const m = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(m / 60);
  const minute = m % 60;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return { text: `${h12}:${`${minute}`.padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`, hour, minute, dayOffset };
}

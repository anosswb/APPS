/**
 * The daily reminder, as the rest of the app sees it. This file is the web version: there are no notes
 * in a browser, so it is switched off. The phone version is in `reminders.native.ts`.
 * EXPO_PUBLIC_REMINDER_PREVIEW=1 turns on a PRETEND version, only to look at the screens in a browser.
 */
import { PlannedNote } from './plan';

export interface Reminders {
  /** true where the phone can show notes at all */
  available(): boolean;
  /** has the player allowed notes on this phone? Never shows a prompt. */
  allowed(): Promise<boolean>;
  /** shows the phone's own permission prompt if it can still be shown; true when notes are allowed */
  ask(): Promise<boolean>;
  /** replaces every planned note with these */
  set(notes: PlannedNote[]): Promise<void>;
  clear(): Promise<void>;
  /** calls back when the player opens the app by tapping a note; returns the "stop listening" function */
  onOpen(run: () => void): () => void;
}

const off: Reminders = {
  available: () => false,
  allowed: async () => false,
  ask: async () => false,
  set: async () => {},
  clear: async () => {},
  onOpen: () => () => {},
};

const pretend: Reminders = {
  available: () => true,
  allowed: async () => true,
  ask: async () => true,
  set: async (notes) => console.log('Pretend reminders:', notes.map((n) => `${n.key} ${n.at.getHours()}:00`).join(', ')),
  clear: async () => console.log('Pretend reminders: cleared'),
  onOpen: () => () => {},
};

export const reminders: Reminders = process.env.EXPO_PUBLIC_REMINDER_PREVIEW === '1' ? pretend : off;

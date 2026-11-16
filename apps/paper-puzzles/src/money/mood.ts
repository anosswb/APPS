/**
 * The player's mood for ads, kept in memory for this opening of the app only (rules.ts decides with it).
 * Every finished game is recorded here; showing a full-screen ad starts the count again.
 */
import { AdMood, afterGame, freshMood } from './rules';

let mood: AdMood = freshMood();

export const adMood = {
  now: (): AdMood => mood,
  game: (won: boolean): void => {
    mood = afterGame(mood, won);
  },
  adShown: (): void => {
    mood = freshMood();
  },
};

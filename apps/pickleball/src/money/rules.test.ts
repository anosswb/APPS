import { AD_GAP_MS, AD_MIN_GAME_MS, adAfterGame, courtsLocked, FREE_COURTS, ruleLocked } from './rules';

const MIN = 60_000;
const game = (minutes: number, started = true) => ({ started, startedAt: 0, endedAt: minutes * MIN });

describe('the ad after a game', () => {
  it('shows after a game of 3 minutes or more, Android only', () => {
    expect(AD_MIN_GAME_MS).toBe(3 * MIN);
    expect(adAfterGame('android', game(3), null)).toBe(true);
    expect(adAfterGame('ios', game(12), null)).toBe(false);
    expect(adAfterGame('web', game(12), null)).toBe(false);
  });
  it('never after a game shorter than 3 minutes or one that never started', () => {
    expect(adAfterGame('android', game(2.9), null)).toBe(false);
    expect(adAfterGame('android', game(15, false), null)).toBe(false);
  });
  it('at most one every 10 minutes', () => {
    expect(AD_GAP_MS).toBe(10 * MIN);
    const g = { started: true, startedAt: 20 * MIN, endedAt: 32 * MIN };
    expect(adAfterGame('android', g, 25 * MIN)).toBe(false);
    expect(adAfterGame('android', g, 22 * MIN)).toBe(true);
  });
});

describe('iPhone unlock', () => {
  it('locks nothing while no purchase can be made', () => {
    expect(courtsLocked('ios', false, false, 8)).toBe(false);
    expect(ruleLocked('ios', false, false, 'winners-stay')).toBe(false);
  });
  it('locks 3+ courts and the winners rules until bought', () => {
    expect(courtsLocked('ios', true, false, FREE_COURTS)).toBe(false);
    expect(courtsLocked('ios', true, false, FREE_COURTS + 1)).toBe(true);
    expect(courtsLocked('ios', true, true, 8)).toBe(false);
    expect(ruleLocked('ios', true, false, 'all-off')).toBe(false);
    expect(ruleLocked('ios', true, false, 'winners-split')).toBe(true);
  });
  it('Android never locks anything', () => {
    expect(courtsLocked('android', true, false, 8)).toBe(false);
    expect(ruleLocked('android', true, false, 'winners-stay')).toBe(false);
  });
});

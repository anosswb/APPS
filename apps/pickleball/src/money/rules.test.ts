import { bannerAllowed, courtsLocked, FREE_COURTS, ruleLocked, Screen } from './rules';

describe('ads', () => {
  it('never on the court screens, the scorer or the board', () => {
    for (const s of ['courts', 'scorer', 'board', 'licences'] as Screen[]) expect(bannerAllowed('android', s)).toBe(false);
  });
  it('a banner on Players and Settings, Android only', () => {
    expect(bannerAllowed('android', 'players')).toBe(true);
    expect(bannerAllowed('android', 'settings')).toBe(true);
    expect(bannerAllowed('ios', 'players')).toBe(false);
    expect(bannerAllowed('web', 'settings')).toBe(false);
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

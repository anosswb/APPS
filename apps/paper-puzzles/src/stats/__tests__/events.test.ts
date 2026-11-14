import { clean, EVENTS, payload } from '../events';

describe('what may be counted', () => {
  test('an unknown event is refused', () => {
    expect(clean('user_typed_something', { text: 'hello' })).toBeNull();
  });

  test('only listed properties pass, and only safe values', () => {
    const out = clean('puzzle_solved', {
      kind: 'daily',
      size: 8,
      grade: 'hard',
      seconds: 251.7,
      hints: 2,
      name: 'Anass', // not on the list
      level: Number.NaN, // not a real number
    });
    expect(out).toEqual({ kind: 'daily', size: 8, grade: 'hard', seconds: 252, hints: 2 });
  });

  test('free text never passes, even in an allowed property', () => {
    expect(clean('puzzle_start', { kind: 'my secret note', size: 6 })).toEqual({ size: 6 });
    expect(clean('setting_changed', { name: 'theme', value: 'someone@example.com' })).toEqual({ name: 'theme' });
  });

  test('every event in the list has only short, plain property names', () => {
    for (const [event, props] of Object.entries(EVENTS)) {
      expect(event).toMatch(/^[a-z_]+$/);
      for (const p of props) expect(p).toMatch(/^[a-z]+$/);
    }
  });

  test('the message carries no person profile and nothing beyond the cleaned values', () => {
    const body = payload('key', 'abc123', 'hint_used', { kind: 'step', what: 'fitTents', extra: 'no' }, { platform: 'android', version: '1.0.0' }, new Date('2026-11-14T10:00:00Z'));
    expect(body).toEqual({
      api_key: 'key',
      event: 'hint_used',
      distinct_id: 'abc123',
      timestamp: '2026-11-14T10:00:00.000Z',
      properties: { kind: 'step', what: 'fitTents', platform: 'android', app_version: '1.0.0', $process_person_profile: false },
    });
  });
});

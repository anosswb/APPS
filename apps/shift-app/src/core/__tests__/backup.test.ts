jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn(() => Promise.resolve()) }));
jest.mock('expo-document-picker', () => ({}));
jest.mock('expo-file-system', () => ({ File: class {}, Paths: {} }));
jest.mock('expo-sharing', () => ({}));
import { backupText, readBackup } from '../../backup';
import { FRESH, Saved } from '../../store';

test('a backup comes back exactly as it was saved', () => {
  const d: Saved = { ...FRESH, welcomed: true, book: { '2026-11-16': { kind: 'rest' } }, log: { '2026-11-15': { in: 360, out: 1080, holiday: true } }, pay: { ...FRESH.pay, rate: 21.5 } };
  const b = readBackup(backupText(d, new Date('2026-11-16T03:00:00Z')));
  expect(b?.data).toEqual(d);
  expect(b?.made).toBe('2026-11-16T03:00:00.000Z');
});

test('a file that is not a backup is refused, not loaded', () => {
  expect(readBackup('hello')).toBeNull();
  expect(readBackup(JSON.stringify({ kind: 'something-else', data: {} }))).toBeNull();
  expect(readBackup(JSON.stringify({ kind: 'shift-app-backup' }))).toBeNull();
});

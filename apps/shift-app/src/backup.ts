/**
 * Backup and restore with a plain file the worker keeps (Google Drive, email, Files).
 * The #1 complaint about other shift apps: "re-create all your shifts any time you get a new phone".
 * No server: the file goes wherever the worker sends it.
 */
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { migrate, Saved } from './store';

const MARK = 'shift-app-backup';

export function backupText(d: Saved, now: Date): string {
  return JSON.stringify({ kind: MARK, made: now.toISOString(), data: d });
}

/** The saved data inside a backup file, or null when the file is not one of ours. */
export function readBackup(text: string): { data: Saved; made: string } | null {
  try {
    const o = JSON.parse(text) as { kind?: string; made?: string; data?: unknown };
    if (o?.kind !== MARK || !o.data) return null;
    return { data: migrate(o.data), made: typeof o.made === 'string' ? o.made : '' };
  } catch {
    return null;
  }
}

export const canBackup = Platform.OS !== 'web';

export async function saveBackup(d: Saved, now: Date = new Date()): Promise<void> {
  const name = `shift-app-backup-${now.toISOString().slice(0, 10)}.json`;
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(backupText(d, now));
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: name });
}

/** Lets the worker pick a backup file. Null when they cancel; throws a plain message when the file is wrong. */
export async function pickBackup(): Promise<{ data: Saved; made: string } | null> {
  const r = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true });
  if (r.canceled || !r.assets?.[0]) return null;
  const b = readBackup(await new File(r.assets[0].uri).text());
  if (!b) throw new Error('not a backup');
  return b;
}

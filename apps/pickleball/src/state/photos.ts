// Photos for session posts. Picked from the gallery or taken with the camera, then copied into the
// app's own folder so the post keeps its picture even if the original is deleted. Never uploaded.
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';

export type PhotoSource = 'camera' | 'library';
export type PhotoResult = { uri: string } | { error: 'denied' | 'cancelled' | 'failed' };

export async function pickPhoto(source: PhotoSource, sessionId: string): Promise<PhotoResult> {
  try {
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return { error: 'denied' };
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.8 };
    const res = source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (res.canceled || !res.assets?.length) return { error: 'cancelled' };
    return { uri: await keep(res.assets[0].uri, sessionId) };
  } catch (e) {
    console.warn(`[photo] ${String(e)}`);
    return { error: 'failed' };
  }
}

async function keep(uri: string, sessionId: string): Promise<string> {
  const dir = new Directory(Paths.document, 'posts');
  if (!dir.exists) dir.create({ intermediates: true });
  const target = new File(dir, `${sessionId}-${Date.now().toString(36)}.jpg`);
  await new File(uri).copy(target);
  return target.uri;
}

/** Remove a photo file we made (when it is replaced). Errors only logged: a missing file is fine. */
export function forget(uri: string | undefined): void {
  if (!uri || !uri.includes('/posts/')) return;
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch (e) {
    console.warn(`[photo] could not delete: ${String(e)}`);
  }
}

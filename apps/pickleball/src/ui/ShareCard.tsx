// Turns a drawn view (the post) into a picture and opens the phone's share sheet.
import { RefObject } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { t } from '../i18n/en';

export async function shareCardImage(ref: RefObject<unknown>): Promise<void> {
  if (!ref.current) throw new Error('card not ready');
  const uri = await captureRef(ref as Parameters<typeof captureRef>[0], { format: 'png', quality: 1, result: 'tmpfile' });
  if (!(await Sharing.isAvailableAsync())) throw new Error('sharing not available');
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t.history.share });
}

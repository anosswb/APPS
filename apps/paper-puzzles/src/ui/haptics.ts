import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let enabled = true;
export function setHaptics(on: boolean): void {
  enabled = on;
}

function run(job: () => Promise<void>): void {
  if (!enabled || Platform.OS === 'web') return;
  job().catch((error) => console.debug('Haptics not available', error));
}

export const haptic = {
  mark: () => run(() => Haptics.selectionAsync()),
  tent: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  stamp: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};

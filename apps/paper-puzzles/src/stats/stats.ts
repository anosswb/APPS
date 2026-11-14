/**
 * Anonymous usage numbers, so we can see if people come back. Off unless the build has a key
 * (EXPO_PUBLIC_POSTHOG_KEY), and the player can switch it off in Settings.
 * No SDK: one small web request per event. If it fails, nothing happens and nothing is retried.
 */
import { Platform } from 'react-native';

import { APP_VERSION } from '../config/app';
import { EventName, payload, Props } from './events';

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const HOST = 'https://eu.i.posthog.com';

let on = true;
let id = '';

/** true when this build can send numbers at all */
export const STATS_AVAILABLE = KEY.length > 0;

export function configureStats(enabled: boolean, anonymousId: string): void {
  on = enabled;
  id = anonymousId;
}

export function count(event: EventName, props: Props = {}): void {
  if (!STATS_AVAILABLE || !on || !id) return;
  const body = payload(KEY, id, event, props, { platform: Platform.OS, version: APP_VERSION }, new Date());
  if (!body) return;
  fetch(`${HOST}/capture/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch((error) =>
    console.debug('Numbers were not sent', error),
  );
}

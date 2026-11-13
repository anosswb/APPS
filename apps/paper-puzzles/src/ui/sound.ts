import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

/** Three small sounds, made by our own script (assets/sounds/CREDITS.md). */
const FILES = {
  pencil: require('../../assets/sounds/pencil.wav'),
  peg: require('../../assets/sounds/peg.wav'),
  stamp: require('../../assets/sounds/stamp.wav'),
} as const;
type Name = keyof typeof FILES;

const players: Partial<Record<Name, AudioPlayer>> = {};
let enabled = true;
let started = false;

export function setSound(on: boolean): void {
  enabled = on;
}

/** Load the sounds once. They stay quiet when the phone is on silent and never stop the player's music. */
export function initSound(): void {
  if (started) return;
  started = true;
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch((error) =>
    console.warn('Could not set the audio mode', error),
  );
  for (const name of Object.keys(FILES) as Name[]) {
    try {
      players[name] = createAudioPlayer(FILES[name]);
    } catch (error) {
      console.warn(`Could not load the ${name} sound`, error);
    }
  }
}

function play(name: Name): void {
  if (!enabled) return;
  const player = players[name];
  if (!player) return;
  try {
    player.seekTo(0).catch((error) => console.debug('Sound seek failed', error));
    player.play();
  } catch (error) {
    console.debug('Sound did not play', error);
  }
}

export const sound = {
  pencil: () => play('pencil'),
  peg: () => play('peg'),
  stamp: () => play('stamp'),
};

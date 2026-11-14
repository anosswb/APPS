import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

/**
 * The sounds: soft plucked notes from one calm scale, made by our own script (assets/sounds/CREDITS.md).
 * A mark plays one of four notes, picked at random, so a row of taps is a little run and never a machine.
 */
const FILES = {
  tick1: require('../../assets/sounds/tick1.wav'),
  tick2: require('../../assets/sounds/tick2.wav'),
  tick3: require('../../assets/sounds/tick3.wav'),
  tick4: require('../../assets/sounds/tick4.wav'),
  tent: require('../../assets/sounds/tent.wav'),
  win: require('../../assets/sounds/win.wav'),
} as const;
type Name = keyof typeof FILES;
const TICKS: Name[] = ['tick1', 'tick2', 'tick3', 'tick4'];

/** One knob for everything, from 0 (silent) to 1 (as loud as the files are, which is already quiet). */
const VOLUME = 0.8;

const players: Partial<Record<Name, AudioPlayer>> = {};
let enabled = true;
let started = false;
let lastTick = -1;

export function setSound(on: boolean): void {
  enabled = on;
  if (!on) hush();
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
      const player = createAudioPlayer(FILES[name]);
      player.volume = VOLUME;
      players[name] = player;
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

/** Stop the winning tune (the player moved on before it ended). */
function hush(): void {
  try {
    players.win?.pause();
  } catch (error) {
    console.debug('Sound did not stop', error);
  }
}

export const sound = {
  /** a mark on a square: never the same note twice in a row */
  tick: () => {
    let i = Math.floor(Math.random() * (TICKS.length - 1));
    if (i >= lastTick) i += 1;
    if (lastTick < 0) i = 0;
    lastTick = i;
    play(TICKS[i]);
  },
  tent: () => play('tent'),
  win: () => play('win'),
  hush,
};

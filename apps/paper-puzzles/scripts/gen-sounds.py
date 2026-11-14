#!/usr/bin/env python3
"""Makes the sounds of Paper Pines. Everything is maths: no samples, no downloads, so we own them fully.

Second version (14 Nov 2026). Anass tried the first set on his phone: too loud, noisy, cheap.
The first set was shaped noise. This set has no noise at all: soft plucked notes, like a small music box
or a thumb piano, all from one calm scale (C major pentatonic), and all quiet.

  tick1..4.wav  a mark on a square. Four notes of the scale; the app picks one at random, so a row of
                taps sounds like a little run of notes, never like a machine.
  tent.wav      a tent goes up: two notes together, a little longer.
  win.wav       the puzzle is solved: five seconds, a rising run, a soft chord, a long fade.

Run from the app folder:  python3 scripts/gen-sounds.py   (needs numpy)
Output: assets/sounds/*.wav, mono, 44100 Hz, 16-bit. The script prints the loudness of each file.
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "sounds")
rng = np.random.default_rng(20261114)  # only used for the echo of the room; fixed, so files never change

# The scale. Phone speakers are weak under 400 Hz, so everything sits above that.
C5, D5, E5, G5, A5 = 523.25, 587.33, 659.25, 783.99, 880.00
C6, D6, E6, G6 = 1046.50, 1174.66, 1318.51, 1567.98
C4, E4, G4 = 261.63, 329.63, 392.00


def db(x):
    return 10 ** (x / 20)


def pluck(freq, length, decay, bright=1.0):
    """One soft plucked note. `decay` = seconds for the note to fall to about a third."""
    t = np.arange(int(SR * length)) / SR
    # A main tone and three quiet overtones. The overtones die faster, so the note starts clear and ends round.
    parts = [(1.0, 1.00, 1.0), (2.0, 0.22 * bright, 0.55), (3.01, 0.07 * bright, 0.35), (5.4, 0.04 * bright, 0.12)]
    y = np.zeros_like(t)
    for ratio, level, life in parts:
        if freq * ratio < 9000:
            y += level * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t / (decay * life))
    attack = 0.006  # six thousandths of a second: no click at the start
    y *= np.minimum(1.0, t / attack) ** 2
    fade = int(SR * 0.02)  # and no click at the end
    y[-fade:] *= np.linspace(1, 0, fade) ** 2
    return y


def place(track, note, at):
    i = int(SR * at)
    track[i:i + len(note)] += note[: max(0, len(track) - i)]


def room(y, seconds=1.5, wet=0.2):
    """A small warm room: the sound mixed with a soft, dark echo of itself."""
    n = int(SR * seconds)
    t = np.arange(n) / SR
    tail = rng.standard_normal(n) * np.exp(-t / (seconds / 6.0))
    spec = np.fft.rfft(tail)
    f = np.fft.rfftfreq(n, 1 / SR)
    spec *= 1 / (1 + (f / 2500.0) ** 4)  # the echo keeps no sharp highs
    tail = np.fft.irfft(spec, n)
    tail[: int(SR * 0.012)] = 0
    size = len(y) + n
    echo = np.fft.irfft(np.fft.rfft(y, size) * np.fft.rfft(tail, size), size)[: len(y)]
    echo *= np.sqrt(np.mean(y ** 2)) / (np.sqrt(np.mean(echo ** 2)) + 1e-12)
    return y + wet * echo


def finish(y, peak_db):
    """Set the loudest point to peak_db (0 would be as loud as a file can be)."""
    return y / np.max(np.abs(y)) * db(peak_db)


def tick(freq):
    return finish(pluck(freq, 0.22, 0.045, bright=0.8), -20)


def tent():
    y = pluck(C5, 0.5, 0.10) + 0.7 * pluck(G5, 0.5, 0.10)
    y = room(y, 0.6, 0.12)
    fade = int(SR * 0.08)
    y[-fade:] *= np.linspace(1, 0, fade) ** 2
    return finish(y, -17)


def win():
    y = np.zeros(int(SR * 5.0))
    # A rising run, then three notes that come home. Unhurried: about one note every fifth of a second.
    run = [(0.00, C5, 1.0), (0.20, E5, 0.9), (0.40, G5, 0.9), (0.60, C6, 1.0), (0.95, E6, 0.8), (1.30, D6, 0.7), (1.65, C6, 0.9)]
    for at, freq, level in run:
        place(y, level * pluck(freq, 2.4, 0.42), at)
    # The last chord, rolled from low to high like a strummed harp.
    for k, freq in enumerate([C5, G5, C6, E6]):
        place(y, 0.55 * pluck(freq, 2.8, 0.75, bright=0.6), 2.15 + 0.045 * k)
    # A very soft warm bed under it: pure tones that swell in and fade away.
    t = np.arange(len(y)) / SR
    swell = np.clip(t / 1.2, 0, 1) ** 2 * np.clip((4.9 - t) / 2.6, 0, 1) ** 2
    for freq, level in [(C4, 0.10), (G4, 0.08), (E5, 0.05)]:
        y += level * swell * np.sin(2 * np.pi * freq * t)
    y = room(y, 1.8, 0.28)
    y *= np.clip((5.0 - t) / 1.6, 0, 1) ** 2  # the long fade to silence
    return finish(y, -13)


def save(name, y):
    data = np.round(np.clip(y, -1, 1) * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    spec = np.abs(np.fft.rfft(y)) ** 2
    f = np.fft.rfftfreq(len(y), 1 / SR)
    centre = float(np.sum(f * spec) / np.sum(spec))
    high = float(np.sum(spec[f > 6000]) / np.sum(spec)) * 100
    print(
        f"{name:10s} {len(y) / SR:5.2f} s   peak {20 * np.log10(np.max(np.abs(y))):6.1f} dB   "
        f"average {20 * np.log10(np.sqrt(np.mean(y ** 2))):6.1f} dB   centre {centre:5.0f} Hz   "
        f"above 6 kHz {high:4.1f} %   ends at {abs(data[-1])}   {os.path.getsize(os.path.join(OUT, name)) // 1024} KB"
    )


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for i, freq in enumerate([C5, D5, E5, G5], start=1):
        save(f"tick{i}.wav", tick(freq))
    save("tent.wav", tent())
    save("win.wav", win())

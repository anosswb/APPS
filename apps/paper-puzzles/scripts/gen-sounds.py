#!/usr/bin/env python3
"""Generate the three sound effects for Paper Puzzles.

Everything is made from maths and random noise: no samples, no downloads.
Run from the app folder:  python3 scripts/gen-sounds.py
Output: assets/sounds/pencil.wav, peg.wav, stamp.wav (mono, 44100 Hz, 16-bit).
"""
import os
import wave
import numpy as np

SR = 44100                       # sample rate
rng = np.random.default_rng(20261113)   # fixed seed: same files every run
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "sounds")


def t_axis(ms):
    """Time axis in seconds for a sound of the given length in milliseconds."""
    return np.arange(int(SR * ms / 1000)) / SR


def bandpass_noise(n, lo, hi):
    """White noise, filtered in the frequency domain to keep only lo..hi Hz."""
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    mask = np.ones_like(f)
    # smooth edges (about 20% wide) so the band is not harsh
    mask *= np.clip((f - lo * 0.8) / (lo * 0.4), 0, 1)
    mask *= np.clip((hi * 1.2 - f) / (hi * 0.4), 0, 1)
    return np.fft.irfft(spec * mask, n)


def sine_drop(t, f_start, f_end, drop_tau):
    """Sine whose pitch glides from f_start to f_end (exponential glide)."""
    freq = f_end + (f_start - f_end) * np.exp(-t / drop_tau)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase)


def env(t, attack, tau):
    """Fast linear attack then exponential decay."""
    return np.minimum(t / attack, 1.0) * np.exp(-t / tau)


def finish(x, fade_out_ms, peak_db, fade_in_ms=4):
    """Remove DC, add fade-in and smooth fade-out to silence, set the peak level."""
    x = x - np.mean(x)
    n = len(x)
    fi = int(SR * fade_in_ms / 1000)
    fo = int(SR * fade_out_ms / 1000)
    # first 1 ms is exact silence, then a smooth fade-in (starts after the silence)
    z = SR // 1000
    x[:z] = 0.0
    x[z:z + fi] *= 0.5 - 0.5 * np.cos(np.pi * np.arange(fi) / fi)
    x[n - fo:] *= 0.5 + 0.5 * np.cos(np.pi * np.arange(fo) / fo)
    x[-1] = 0.0
    x *= 10 ** (peak_db / 20) / np.max(np.abs(x))
    return x


def pencil():
    """Soft dry pencil tick: band-limited noise (1.5-6 kHz), instant attack, quick decay."""
    t = t_axis(65)
    noise = bandpass_noise(len(t), 1500, 6000)
    x = noise * env(t, 0.0008, 0.011)
    # a little scratchy grain: slow random wobble in the volume
    grain = 1 + 0.35 * bandpass_noise(len(t), 150, 600)
    x *= grain / np.max(np.abs(grain))
    return finish(x, fade_out_ms=15, peak_db=-14, fade_in_ms=4)


def peg():
    """Warm 'tok': damped sine ~480 -> 400 Hz plus a tiny paper-noise click at the start.

    The pitch sits above 300 Hz on purpose: small phone speakers play almost nothing below that.
    """
    t = t_axis(110)
    tok = sine_drop(t, 480, 400, 0.015) * env(t, 0.002, 0.026)
    # a quiet lower partial keeps it warm on good speakers and headphones
    tok += 0.35 * sine_drop(t, 250, 200, 0.015) * env(t, 0.002, 0.03)
    # second, softer upper partial gives a woody feel
    tok += 0.2 * sine_drop(t, 960, 800, 0.012) * env(t, 0.002, 0.012)
    paper = bandpass_noise(len(t), 1500, 5000) * env(t, 0.0008, 0.004)
    x = tok / np.max(np.abs(tok)) + 0.25 * paper / np.max(np.abs(paper))
    return finish(x, fade_out_ms=25, peak_db=-10, fade_in_ms=4)


def stamp():
    """Rubber stamp on a desk pad: low thud + muffled thump + paper transient + short tail."""
    t = t_axis(400)
    # 1. soft heavy thud: low sine, fast pitch drop 110 -> 70 Hz
    thud = sine_drop(t, 110, 70, 0.025) * env(t, 0.003, 0.055)
    # 2. muffled mid thump: noise squeezed below ~350 Hz plus a 150 Hz sine
    body = bandpass_noise(len(t), 60, 350) * env(t, 0.002, 0.035)
    body = body / np.max(np.abs(body)) * 0.45
    body += 0.35 * sine_drop(t, 170, 130, 0.02) * env(t, 0.002, 0.04)
    # 3. brief papery noise transient
    paper = bandpass_noise(len(t), 1200, 5000) * env(t, 0.0008, 0.006)
    paper = paper / np.max(np.abs(paper)) * 0.12
    # 4. very short quiet tail: pad settling at 80 Hz
    tail = 0.12 * np.sin(2 * np.pi * 80 * t) * env(t, 0.02, 0.07)
    # 5. what a phone speaker can actually play (it loses almost everything below ~200 Hz):
    #    a short mid "thump" and a soft rubbery noise burst, so the stamp is still heard on a phone
    mid = 0.85 * sine_drop(t, 520, 380, 0.018) * env(t, 0.002, 0.045)
    rubber = bandpass_noise(len(t), 600, 2500) * env(t, 0.0015, 0.022)
    rubber = rubber / np.max(np.abs(rubber)) * 0.7
    x = thud + body + paper + tail + mid + rubber
    return finish(x, fade_out_ms=120, peak_db=-6, fade_in_ms=4)


def write_wav(path, x):
    """Write mono 16-bit PCM WAV."""
    data = np.round(x * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def main():
    os.makedirs(OUT, exist_ok=True)
    print(f"{'file':<12}{'ms':>8}{'peak dBFS':>12}{'RMS dBFS':>11}")
    for name, fn in (("pencil", pencil), ("peg", peg), ("stamp", stamp)):
        x = fn()
        path = os.path.join(OUT, name + ".wav")
        write_wav(path, x)
        q = np.round(x * 32767) / 32767
        peak = 20 * np.log10(np.max(np.abs(q)))
        rms = 20 * np.log10(np.sqrt(np.mean(q ** 2)))
        print(f"{name + '.wav':<12}{len(x) / SR * 1000:>8.1f}{peak:>12.2f}{rms:>11.2f}")


if __name__ == "__main__":
    main()

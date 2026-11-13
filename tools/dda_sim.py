#!/usr/bin/env python3
"""Toy simulator for the difficulty engine in playbook/06-retention-engine.md.

It does NOT predict real players. It shows the logic: the same simulated
players, the same quit rules, two ways of choosing difficulty.
Run:  python3 tools/dda_sim.py            (add --players 5000 --seed 7 to change)
"""
import argparse, math, random, statistics

SAW = [0.90, 0.85, 0.75, 0.80, 0.55]   # target win chance, repeats: 4 kind levels, 1 "boss"

def win_chance(skill, diff):
    return 1 / (1 + math.exp(-(skill - diff)))

def diff_for(skill_est, target):
    # invert win_chance: the difficulty that gives this player `target` win chance
    return skill_est - math.log(target / (1 - target))

def play(rng, skill, mode, max_attempts=300):
    level, attempts, fails_here, easy_run = 1, 0, 0, 0
    est = 0.0                      # what the game believes about the player
    relief = 0.0                   # hidden help after repeated fails
    while attempts < max_attempts:
        if mode == "static":
            diff = -2.0 + 0.045 * level            # same ramp for everyone
        else:
            target = SAW[(level - 1) % len(SAW)]
            diff = diff_for(est, target) - relief
        p = win_chance(skill, diff)
        won = rng.random() < p
        attempts += 1
        if mode == "dda":                          # Elo-style belief update
            est += 0.25 * ((1 if won else 0) - win_chance(est, diff))
        if won:
            level += 1; fails_here = 0; relief = 0.0
            easy_run = easy_run + 1 if p > 0.97 else 0
        else:
            fails_here += 1; easy_run = 0
            if mode == "dda" and fails_here >= 2:  # fail-streak relief, capped
                relief = min(1.5, relief + 0.5)
        # quit rules (identical in both modes)
        quit_p = 0.004
        if fails_here > 2: quit_p += 0.07 * (fails_here - 2)   # frustration
        if easy_run >= 10: quit_p += 0.03                      # boredom
        if rng.random() < quit_p:
            break
    return level, attempts

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--players", type=int, default=3000)
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()
    print(f"{a.players} simulated players, seed {a.seed} (toy model, not real people)\n")
    print(f"{'mode':8} {'median level':>13} {'still playing @100 tries':>26} {'@300 tries':>11} {'win rate':>9}")
    for mode in ("static", "dda"):
        rng = random.Random(a.seed)
        levels, alive100, alive300, wins, tries = [], 0, 0, 0, 0
        for _ in range(a.players):
            skill = rng.gauss(0, 1)
            lvl, att = play(rng, skill, mode)
            levels.append(lvl); wins += lvl - 1; tries += att
            alive100 += att >= 100; alive300 += att >= 300
        print(f"{mode:8} {statistics.median(levels):13.0f} {alive100 / a.players:25.0%} "
              f"{alive300 / a.players:11.0%} {wins / tries:9.0%}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Back-of-envelope money model for one app. Planning numbers, not promises.

Run:  python3 tools/roi.py                      three ready scenarios
      python3 tools/roi.py --installs 300 --d1 0.32 --d30 0.05 --t1 0.2 --t2 0.3
Every default is a rough planning value. Replace them with the app's own
numbers from AdMob / PostHog as soon as they exist.
"""
import argparse, math

ECPM = {  # USD per 1000 impressions: (rewarded, interstitial, banner)
    "t1": (14.0, 7.0, 0.60),   # US, UK, CA, AU, DE, JP, KR, Gulf
    "t2": (5.0, 2.0, 0.20),    # rest of EU, BR, MX, TR, SA-adjacent, etc.
    "t3": (1.5, 0.6, 0.06),    # IN, ID, PK, EG, NG, MA, etc.
}

def dau_per_daily_install(d1, d30, days=365):
    b = math.log(d1 / d30) / math.log(30)          # power-law retention r(d) = d1 * d^-b
    return 1 + sum(d1 * d ** (-b) for d in range(1, days + 1))

def monthly(installs, d1, d30, t1, t2, rew, inter, banner, iap_arpdau, fill=0.9):
    t3 = max(0.0, 1 - t1 - t2)
    dau = installs * dau_per_daily_install(d1, d30)
    ad_arpdau = 0.0
    for share, tier in ((t1, "t1"), (t2, "t2"), (t3, "t3")):
        r, i, b = ECPM[tier]
        ad_arpdau += share * fill * (rew * r + inter * i + banner * b) / 1000
    return dau, ad_arpdau, dau * (ad_arpdau + iap_arpdau) * 30

def line(name, **k):
    dau, arpdau, rev = monthly(**k)
    per_install = rev / 30 / k["installs"]
    need = lambda target: target / 30 / per_install
    print(f"{name:34} DAU {dau:8.0f}  ads/DAU ${arpdau:.4f}  month ${rev:9.0f}  "
          f"installs/day for $1k: {need(1000):6.0f}  for $3k: {need(3000):6.0f}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--installs", type=float, help="new installs per day")
    ap.add_argument("--d1", type=float, default=0.30)
    ap.add_argument("--d30", type=float, default=0.04)
    ap.add_argument("--t1", type=float, default=0.15, help="share of users in tier-1 countries")
    ap.add_argument("--t2", type=float, default=0.30)
    ap.add_argument("--rew", type=float, default=1.0, help="rewarded ads watched per daily user")
    ap.add_argument("--inter", type=float, default=2.0, help="interstitials per daily user")
    ap.add_argument("--banner", type=float, default=0.0, help="banner impressions per daily user")
    ap.add_argument("--iap", type=float, default=0.0, help="purchase revenue per daily user, after store fee")
    a = ap.parse_args()
    if a.installs:
        line("your numbers", installs=a.installs, d1=a.d1, d30=a.d30, t1=a.t1, t2=a.t2,
             rew=a.rew, inter=a.inter, banner=a.banner, iap_arpdau=a.iap)
        return
    print("All at 200 new installs a day. Change one thing at a time to see what matters.\n")
    base = dict(installs=200, d1=0.30, d30=0.04, t1=0.15, t2=0.30, rew=1.0, inter=2.0, banner=0.0, iap_arpdau=0.0)
    line("A  puzzle game, ads only, mixed geo", **base)
    line("B  same, weak retention (22/1.5)", **{**base, "d1": 0.22, "d30": 0.015})
    line("C  same, strong retention (40/8)", **{**base, "d1": 0.40, "d30": 0.08})
    line("D  same as A, 50% tier-1 users", **{**base, "t1": 0.50, "t2": 0.30})
    line("E  same as A, mostly tier-3 users", **{**base, "t1": 0.03, "t2": 0.12})
    line("F  utility, rewarded only, no inter", **{**base, "rew": 0.3, "inter": 0.0, "banner": 4.0})
    line("G  iPhone app, no ads, IAP $0.03/DAU", **{**base, "rew": 0, "inter": 0, "iap_arpdau": 0.03})

if __name__ == "__main__":
    main()

// Round 2 (after Anass: "I love A and C, too much on one tab, a special font"): calmer screens, one job per tab.
// Run: NODE_PATH=$(npm root -g) node build2.mjs
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const here = new URL('.', import.meta.url).pathname;
const P = {
  alarm: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',
  cal: '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  pay: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  day: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
};
const ic = (n, s = 22, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const font = (fam, file) => `@font-face{font-family:"${fam}";src:url("fonts/${file}") format("woff2");font-weight:100 900;font-stretch:50% 150%}`;
const F = font('Bricolage', 'bricolage-grotesque-latin-wght-normal.woff2') + font('Instrument', 'instrument-sans-latin-wght-normal.woff2') + font('Archivo', 'archivo-latin-standard-normal.woff2') + font('Anybody', 'anybody-latin-standard-normal.woff2') + font('Syne', 'syne-latin-wght-normal.woff2') + font('Shoulders', 'big-shoulders-display-latin-wght-normal.woff2');
const status = (c) => `<div class="sb" style="color:${c}"><span>4:42</span><span class="sbr"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/></svg></span></div>`;
const base = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:390px;height:844px;overflow:hidden}body{position:relative;-webkit-font-smoothing:antialiased}
.sb{position:absolute;top:0;left:0;right:0;height:50px;padding:17px 30px 0 34px;display:flex;justify-content:space-between;font:600 16px/1 "Inter",sans-serif;z-index:9}.sbr{display:flex;gap:6px;align-items:center}
.hb{position:absolute;bottom:8px;left:128px;width:134px;height:5px;border-radius:3px}
.nav{position:absolute;bottom:26px;left:8px;right:8px;display:flex;justify-content:space-around;font-size:11px;font-weight:600;line-height:1}
.nav div{display:flex;flex-direction:column;align-items:center;gap:6px;width:80px}`;
const page = (css, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${F}${base}${css}</style></head><body>${body}</body></html>`;
const nav = (on) => `<div class="nav">${[['home', 'Today'], ['cal', 'Calendar'], ['day', 'My day'], ['pay', 'Pay']].map(([i, t]) => `<div class="${t === on ? 'on' : ''}">${ic(i)}${t}</div>`).join('')}</div><div class="hb"></div>`;
const st = { 14: 'w', 15: 'w', 16: 'r', 17: 'r', 18: 'w', 20: 'w' }, dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* 1 · Today, sky look, calm */
const q = (t) => { const a = [20, 452], b = [195, 190], c = [370, 452]; return [0, 1].map(i => (1 - t) ** 2 * a[i] + 2 * t * (1 - t) * b[i] + t * t * c[i]); };
const [nx, ny] = q(0.035);
const T1 = page(`body{background:#0B0F17;color:#F4EDE2;font-family:"Instrument"}
.sky{position:absolute;inset:0 0 auto 0;height:470px;background:linear-gradient(180deg,#081226 0%,#0E1D3A 38%,#22335A 60%,#5E4660 77%,#C9663F 90%,#F4A24C 97%,#FFD08A 100%)}
i.s{position:absolute;width:2px;height:2px;border-radius:2px;background:#DCE6FF}
.date{position:absolute;top:70px;left:28px;font:600 15px/1 "Instrument";color:#B9C6E2}
.hero{position:absolute;top:100px;left:26px;font:800 68px/.94 "Bricolage";letter-spacing:-.04em}.hero b{color:#FFC470}
.sub{position:absolute;top:244px;left:28px;font:500 17px/1 "Instrument";color:#D5DCEC}
svg.a,svg.l{position:absolute;left:0}svg.a{top:0}svg.l{top:420px}
.strip{position:absolute;top:494px;left:16px;right:16px;display:flex;gap:6px}
.d{flex:1;height:86px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;font:600 12px/1 "Instrument";color:#7C879C;background:#141A26}
.d b{font:700 24px/1 "Bricolage";color:#C9D0DE}
.d.r{background:linear-gradient(180deg,#FFD08A,#F4A24C 60%,#E8873F);color:#5A2A0C}.d.r b{color:#3A1804}
.d.u{background:none;border:1.5px dashed #323C50}.d.u b{color:#5E6A80}
.d.now{background:#F4EDE2;color:#5B6478}.d.now b{color:#0B0F17}
.btn{position:absolute;top:612px;left:16px;right:16px;height:72px;border-radius:24px;background:#FFC470;color:#201004;display:flex;align-items:center;gap:12px;padding:0 22px;font:700 18px/1 "Instrument";white-space:nowrap}
.btn span{margin-left:auto;font:800 23px/1 "Bricolage"}.btn svg{flex-shrink:0}
.nav{color:#667289}.nav .on{color:#FFC470}.hb{background:#F4EDE2}`,
`${status('#F4EDE2')}<div class="sky"></div>${[[40,58,.8],[130,40,.5],[306,74,.9],[352,160,.5],[250,36,.6],[336,280,.3],[366,100,.7],[290,210,.4],[220,300,.3]].map(([x,y,o])=>`<i class="s" style="left:${x}px;top:${y}px;opacity:${o}"></i>`).join('')}
<svg class="a" width="390" height="470" fill="none"><path d="M20 452 Q195 190 370 452" stroke="#FFE7C2" stroke-opacity=".5" stroke-width="2.5" stroke-dasharray="1 9" stroke-linecap="round"/>
<circle cx="${nx}" cy="${ny}" r="22" fill="#FFD08A" fill-opacity=".22"/><circle cx="${nx}" cy="${ny}" r="11" fill="#FFF3DC"/></svg>
<svg class="l" width="390" height="60" viewBox="0 0 390 60" fill="#0B0F17"><path d="M0 34h44V20h10v14h30v-8h26v8h40V6h7v28h10V12h7v22h36l14-26 14 26h34v-10h30v10h22V16h9v18h57v26H0z"/></svg>
<div class="date">Saturday, Nov 14</div><div class="hero">Rest in<br><b>2 days</b></div><div class="sub">Day 6 in a row</div>
<div class="strip">${[14,15,16,17,18,19,20].map(d=>{const k=st[d]||'u';return `<div class="d ${d===14?'now':k}"><span>${d===14?'Today':dow[(d-1)%7]}</span><b>${d}</b></div>`}).join('')}</div>
<div class="btn">${ic('alarm',28,2.2)}Set Sunday's alarm<span>4:30 AM</span></div>${nav('Today')}`);

/* ring helpers */
const ring = (cx, cy, R) => { const pt = (h, r = R) => { const a = (h / 24) * 2 * Math.PI; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
  const arc = (h1, h2) => { if (h2 < h1) h2 += 24; const [x1, y1] = pt(h1), [x2, y2] = pt(h2); return `M${x1} ${y1}A${R} ${R} 0 ${h2 - h1 > 12 ? 1 : 0} 1 ${x2} ${y2}`; };
  return { pt, arc }; };

/* 2 · My day, sky look */
const r2 = ring(195, 262, 112), [mx, my] = r2.pt(4.7);
const row = (t, l, hi) => `<div class="rw${hi ? ' hi' : ''}"><b>${t}</b><span>${l}</span></div>`;
const T2 = page(`body{background:#0B0F17;color:#F4EDE2;font-family:"Instrument"}
.h{position:absolute;top:66px;left:26px;font:800 34px/1 "Bricolage";letter-spacing:-.03em}.h2{position:absolute;top:76px;right:26px;font:600 15px/1 "Instrument";color:#8E99AE}
svg.r{position:absolute;top:0;left:0}
.mid{position:absolute;top:232px;left:95px;width:200px;text-align:center;font:500 14px/1 "Instrument";color:#8E99AE}.mid b{display:block;font:800 30px/1 "Bricolage";color:#F4EDE2;margin:9px 0;letter-spacing:-.03em;white-space:nowrap}
.t{position:absolute;font:600 12px/1 "Instrument";color:#8E99AE;width:60px;text-align:center}
.ls{position:absolute;top:420px;left:26px;right:26px}
.rw{display:flex;align-items:baseline;height:54px;border-top:1px solid #1B2332;padding-top:16px}.rw b{width:124px;font:700 22px/1 "Bricolage";letter-spacing:-.02em}.rw span{font:500 16px/1 "Instrument";color:#AEB8CC}
.rw.hi b,.rw.hi span{color:#FFC470}
.nav{color:#667289}.nav .on{color:#FFC470}.hb{background:#F4EDE2}`,
`${status('#F4EDE2')}<div class="h">My day</div><div class="h2">Sat, Nov 14</div>
<svg class="r" width="390" height="410" fill="none"><circle cx="195" cy="262" r="112" stroke="#161D2A" stroke-width="26"/>
<path d="${r2.arc(21, 4.5)}" stroke="#2A3B63" stroke-width="26" stroke-linecap="round"/><path d="${r2.arc(6, 18)}" stroke="#FFC470" stroke-width="26" stroke-linecap="round"/>
<circle cx="${mx}" cy="${my}" r="10" fill="#FFF3DC" stroke="#0B0F17" stroke-width="4"/></svg>
<div class="t" style="left:165px;top:118px">midnight</div><div class="t" style="left:165px;top:394px">noon</div>
<div class="mid">Shift<b>6 AM – 6 PM</b>12 hours</div>
<div class="ls">${row('4:30 AM','Wake up')}${row('5:20 AM','Leave, lunch box packed')}${row('6:00 AM','Clock in',1)}${row('6:00 PM','Clock out',1)}${row('6:40 PM','Home')}${row('9:00 PM','Sleep by')}</div>${nav('My day')}`);

/* 3 · Today, ring look, calm */
const r3 = ring(195, 330, 104), [hx, hy] = r3.pt(4.7, 123), [hx2, hy2] = r3.pt(4.7, 85);
const lb = (h, t, s2, r) => { const [x, y] = r3.pt(h, r); return `<div class="lb" style="left:${Math.max(4, Math.min(296, x - 45))}px;top:${y - 15}px"><b>${t}</b>${s2}</div>`; };
const T3 = page(`body{background:#EEF1EC;color:#0E1726;font-family:"Archivo"}
.h{position:absolute;top:64px;left:24px;font:800 36px/1 "Archivo";font-stretch:125%;letter-spacing:-.02em}.h2{position:absolute;top:76px;right:24px;font:600 15px/1 "Archivo";color:#4C586B}
svg.r{position:absolute;top:0;left:0}
.lb{position:absolute;width:90px;text-align:center;font:500 12px/1.2 "Archivo";color:#4C586B}.lb b{display:block;font:700 15px/1.1 "Archivo";color:#0E1726}
.mid{position:absolute;top:286px;left:95px;width:200px;text-align:center;font:600 15px/1 "Archivo";color:#4C586B}
.mid b{display:block;font:800 40px/1 "Archivo";font-stretch:112%;letter-spacing:-.03em;margin:7px 0 10px;color:#0E1726}
.btn{position:absolute;top:560px;left:16px;right:16px;height:72px;border-radius:36px;background:#0E1726;color:#EEF1EC;display:flex;align-items:center;gap:12px;padding:0 12px 0 22px;font:700 17px/1 "Archivo";white-space:nowrap}.btn svg{flex-shrink:0}
.btn span{margin-left:auto;background:#FFC83A;color:#0E1726;height:48px;border-radius:24px;padding:0 16px;font:800 19px/48px "Archivo"}
.nav{color:#7A8594}.nav .on{color:#2046F5}.hb{background:#0E1726}`,
`${status('#0E1726')}<div class="h">Saturday</div><div class="h2">Nov 14</div>
<svg class="r" width="390" height="520" fill="none"><circle cx="195" cy="330" r="104" stroke="#DDE2DB" stroke-width="30"/>
<path d="${r3.arc(21, 4.5)}" stroke="#0E1726" stroke-width="30"/><path d="${r3.arc(6, 18)}" stroke="#2046F5" stroke-width="30"/>
<path d="M${hx2} ${hy2}L${hx} ${hy}" stroke="#FF4B2B" stroke-width="5" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="7" fill="#FF4B2B"/></svg>
${lb(6.4,'6:00 AM','clock in',156)}${lb(17.6,'6:00 PM','clock out',156)}${lb(0,'sleep','',136)}
<div class="mid">Rest in<b>2 days</b>Day 6 in a row</div>
<div class="btn">${ic('alarm',26,2.2)}Set Sunday's alarm<span>4:30 AM</span></div>${nav('Today')}`);

const fonts = [['1', 'Bricolage', 800, 100, '-.04em', 'now'], ['2', 'Anybody', 800, 130, '-.03em', 'wide and heavy'], ['3', 'Syne', 800, 100, '-.03em', 'odd shapes'], ['4', 'Shoulders', 800, 100, '0', 'tall, like signs']];
const FS = `<!doctype html><html><head><meta charset="utf-8"><style>${F}body{margin:0;width:1100px;background:#0B0F17;color:#F4EDE2;padding:36px 44px;box-sizing:border-box;font-family:"Instrument"}
.r{display:flex;align-items:center;gap:28px;padding:22px 0;border-top:1px solid #1E2635}.r:first-child{border:0}
.n{width:150px;font:600 16px/1.3 "Instrument";color:#8E99AE}.n b{display:block;color:#FFC470;font-size:30px}
.t{font-size:56px;line-height:1;white-space:nowrap}.t b{color:#FFC470;font-weight:inherit}</style></head><body>
${fonts.map(([n, f, w, s, ls, d]) => `<div class="r"><div class="n"><b>${n}</b>${d}</div><div class="t" style="font-family:'${f}';font-weight:${w};font-stretch:${s}%;letter-spacing:${ls}">Rest in <b>2 days</b> · 4:30 AM</div></div>`).join('')}</body></html>`;

const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>${F}body{margin:0;background:#1B1D20;font-family:"Archivo";color:#fff;width:1330px;height:980px;display:flex;gap:40px;padding:40px;box-sizing:border-box}
div{width:390px}p{font:800 24px/1 "Archivo";margin:0 0 16px}img{width:390px;height:844px;border-radius:38px;display:block;box-shadow:0 0 0 2px #3A3E44}</style></head><body>
<div><p>1 · Today (sky)</p><img src="r2-1-today-sky.png"></div><div><p>2 · My day (sky + ring)</p><img src="r2-2-myday-sky.png"></div><div><p>3 · Today (ring, light)</p><img src="r2-3-today-ring.png"></div></body></html>`;

const files = { 'r2-1-today-sky': T1, 'r2-2-myday-sky': T2, 'r2-3-today-ring': T3 };
const { chromium } = require('playwright');
const br = await chromium.launch();
const shot = async (name, html, w, h, s, full) => { writeFileSync(`${here}${name}.html`, html); const pg = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: s });
  await pg.goto(`file://${here}${name}.html`); await pg.evaluate(() => document.fonts.ready); await pg.screenshot({ path: `${here}${name}.png`, fullPage: !!full }); await pg.close(); };
for (const [n, h] of Object.entries(files)) await shot(n, h, 390, 844, 2);
await shot('r2-calmer', sheet, 1330, 980, 1);
await shot('r2-fonts', FS, 1100, 300, 1, true);
await br.close();

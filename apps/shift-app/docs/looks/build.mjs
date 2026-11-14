// Draws the three look directions as phone screens. Run: node build.mjs (needs Playwright's Chromium).
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const here = new URL('.', import.meta.url).pathname;

const P = {
  alarm: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',
  cal: '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  pay: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
};
const ic = (n, s = 22, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const font = (fam, file, wght) => `@font-face{font-family:"${fam}";src:url("fonts/${file}") format("woff2");font-weight:${wght};font-stretch:62% 125%}`;
const status = (c) => `<div class="sb" style="color:${c}"><span>4:42</span><span class="sbr"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><rect x="25" y="4" width="2" height="5" rx="1" fill="currentColor" opacity=".5"/></svg></span></div>`;
const base = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:390px;height:844px;overflow:hidden}body{position:relative;-webkit-font-smoothing:antialiased}
.sb{position:absolute;top:0;left:0;right:0;height:50px;padding:17px 30px 0 34px;display:flex;justify-content:space-between;font:600 16px/1 "Inter",sans-serif;z-index:9}.sbr{display:flex;gap:6px;align-items:center}
.hb{position:absolute;bottom:8px;left:128px;width:134px;height:5px;border-radius:3px;z-index:9}`;
const page = (css, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}${css}</style></head><body>${body}</body></html>`;

// November 2026 as Anass described his work: no pattern. w = work, r = rest, u = not known yet.
const st = { 1: 'r', 2: 'w', 3: 'w', 4: 'w', 5: 'w', 6: 'r', 7: 'r', 8: 'r', 9: 'w', 10: 'w', 11: 'w', 12: 'w', 13: 'w', 14: 'w', 15: 'w', 16: 'r', 17: 'r', 18: 'w', 20: 'w' };
const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const s = (d) => st[d] || 'u';

/* ───────── A · DAYBREAK ───────── */
const q = (t) => { const a = [26, 352], b = [195, 156], c = [364, 352]; return [0, 1].map(i => (1 - t) ** 2 * a[i] + 2 * t * (1 - t) * b[i] + t * t * c[i]); };
const [nx, ny] = q(0.03), [s1x, s1y] = q(0.1), [s2x, s2y] = q(0.82);
const A = page(`${font('Bricolage', 'bricolage-grotesque-latin-wght-normal.woff2', '200 800')}${font('Instrument', 'instrument-sans-latin-wght-normal.woff2', '400 700')}
body{background:#0B0F17;color:#F4EDE2;font-family:"Instrument",sans-serif}
.sky{position:absolute;inset:0 0 auto 0;height:372px;background:linear-gradient(180deg,#081226 0%,#10213F 34%,#27365A 56%,#6B4A5A 74%,#C9663F 88%,#F4A24C 97%,#FFD08A 100%)}
.stars i{position:absolute;width:2px;height:2px;border-radius:2px;background:#DCE6FF;opacity:.7}
.land{position:absolute;top:322px;left:0}
.date{position:absolute;top:66px;left:26px;font:600 15px/1 "Instrument";letter-spacing:.02em;color:#B9C6E2}
.hero{position:absolute;top:92px;left:24px;font:800 58px/.95 "Bricolage";letter-spacing:-.035em}
.hero b{color:#FFC470;font-weight:800}
.sub{position:absolute;top:210px;left:26px;font:500 16px/1.3 "Instrument";color:#D5DCEC}
.arc{position:absolute;top:0;left:0}
.tk{position:absolute;font:600 12px/1 "Instrument";color:#F6DDBE}
.strip{position:absolute;top:392px;left:16px;right:16px;display:flex;gap:6px}
.d{flex:1;height:118px;border-radius:22px;display:flex;flex-direction:column;align-items:center;padding-top:12px;gap:6px;font:600 12px/1 "Instrument";color:#8E99AE}
.d .n{font:700 24px/1 "Bricolage";color:#F4EDE2}
.d .t{margin-top:auto;margin-bottom:13px;font:600 12px/1 "Instrument"}
.d.w{background:#171E2B}.d.w .t{color:#9FB0CF}
.d.r{background:linear-gradient(180deg,#FFD08A,#F4A24C 55%,#E27A3F);color:#5A2A0C}.d.r .n{color:#3A1804}.d.r .t{color:#3A1804}
.d.u{border:1.5px dashed #39445A}.d.u .n{color:#6F7B92}
.d.now{background:#F4EDE2;color:#5B6478}.d.now .n{color:#0B0F17}.d.now .t{color:#0B0F17}
.row{position:absolute;top:530px;left:26px;right:26px;display:flex;justify-content:space-between;padding:18px 0;border-bottom:1px solid #1E2635}
.row div{font:500 13px/1 "Instrument";color:#8E99AE}.row b{display:block;font:700 26px/1 "Bricolage";color:#F4EDE2;margin-bottom:7px;letter-spacing:-.02em}
.note{position:absolute;top:618px;left:26px;right:26px;font:500 15px/1.35 "Instrument";color:#AEB8CC}
.btn{position:absolute;top:676px;left:16px;right:16px;height:68px;border-radius:24px;background:#FFC470;color:#201004;display:flex;align-items:center;gap:14px;padding:0 22px;font:700 19px/1 "Instrument";white-space:nowrap}
.btn span{margin-left:auto;font:800 24px/1 "Bricolage"}.btn svg{flex-shrink:0}
.nav{position:absolute;bottom:26px;left:0;right:0;display:flex;justify-content:space-around;font:600 11px/1 "Instrument";color:#6F7B92}
.nav div{display:flex;flex-direction:column;align-items:center;gap:6px;width:90px}.nav .on{color:#FFC470}
.hb{background:#F4EDE2}`,
`${status('#F4EDE2')}<div class="sky"></div>
<div class="stars">${[[40,60,.8],[120,40,.5],[300,70,.9],[350,150,.5],[250,36,.6],[330,260,.3],[200,64,.4],[366,96,.7],[282,196,.4]].map(([x,y,o])=>`<i style="left:${x}px;top:${y}px;opacity:${o}"></i>`).join('')}</div>
<svg class="arc" width="390" height="380" viewBox="0 0 390 380" fill="none">
<path d="M26 352 Q195 156 364 352" stroke="#FFE7C2" stroke-opacity=".35" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
<path d="M26 352 Q195 156 364 352" stroke="#FFE2B0" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="72 100" stroke-dashoffset="-10"/>
<circle cx="${s1x}" cy="${s1y}" r="5" fill="#FFE2B0"/><circle cx="${s2x}" cy="${s2y}" r="5" fill="#FFE2B0"/>
<circle cx="${nx}" cy="${ny}" r="17" fill="#FFD08A" fill-opacity=".25"/><circle cx="${nx}" cy="${ny}" r="9" fill="#FFF3DC"/></svg>
<div class="tk" style="left:${s1x+12}px;top:${s1y-4}px">6 AM in</div><div class="tk" style="left:${s2x-66}px;top:${s2y-4}px">6 PM out</div>
<svg class="land" width="390" height="60" viewBox="0 0 390 60" fill="#0B0F17"><path d="M0 34h44V20h10v14h30v-8h26v8h40V6h7v28h10V12h7v22h36l14-26 14 26h34v-10h30v10h22V16h9v18h57v26H0z"/><path d="M234 34l14-26 14 26" stroke="#0B0F17" stroke-width="2" fill="none"/></svg>
<div class="date">Saturday, Nov 14</div>
<div class="hero">Rest in<br><b>2 days</b></div>
<div class="sub">Monday and Tuesday off.<br>Today is day 6 in a row.</div>
<div class="strip">${[14,15,16,17,18,19,20].map(d=>{const k=s(d);return `<div class="d ${d===14?'now':k}"><span>${d===14?'Today':dow[(d-1)%7]}</span><span class="n">${d}</span><span class="t">${k==='w'?'6a–6p':k==='r'?ic('sun',20,2.2):'?'}</span></div>`}).join('')}</div>
<div class="row"><div><b>58.5 h</b>this pay period</div><div><b>$1,418</b>estimate, before tax</div><div><b>6 days</b>to payday</div></div>
<div class="note">Two more and the weekend is yours, even if it lands on a Monday.</div>
<div class="btn">${ic('alarm',28,2.2)}Set Sunday's alarm<span>4:30 AM</span></div>
<div class="nav"><div class="on">${ic('home')}Today</div><div>${ic('cal')}Calendar</div><div>${ic('pay')}Pay</div></div><div class="hb"></div>`);

/* ───────── B · THE BOARD ───────── */
const lead = 0; // Nov 1 2026 is a Sunday
const B = page(`${[500,600,700,800].map(w=>font('BarlowC',`barlow-condensed-latin-${w}-normal.woff2`,w)).join('')}${[400,500,600].map(w=>font('Barlow',`barlow-latin-${w}-normal.woff2`,w)).join('')}
body{background:#0D0E0F;color:#F1EFE9;font-family:"Barlow",sans-serif}
.cap{font:600 13px/1 "BarlowC";letter-spacing:.14em;text-transform:uppercase;color:#8C9094}
.top{position:absolute;top:62px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center}
.top .cap b{color:#F1EFE9;font-weight:600}
.hero{position:absolute;top:92px;left:20px;right:20px;height:172px;border-top:2px solid #F1EFE9}
.hero .cap{position:absolute;top:14px;left:0}
.big{position:absolute;top:8px;left:-6px;font:800 172px/.8 "BarlowC";letter-spacing:-.02em;color:#5BE38C;top:34px}
.side{position:absolute;left:96px;top:62px;font:800 64px/.9 "BarlowC";text-transform:uppercase}
.side small{display:block;font:600 22px/1 "BarlowC";letter-spacing:.06em;color:#8C9094;margin-top:10px}
.lamp{position:absolute;right:0;top:58px;display:flex;gap:8px}.lamp i{width:44px;height:92px;border-radius:6px;background:#5BE38C;box-shadow:0 0 28px #5BE38C55;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;font:700 15px/1 "BarlowC";color:#06250F;font-style:normal;letter-spacing:.06em}
.run{position:absolute;top:278px;left:20px;right:20px}
.run .bl{display:flex;gap:5px;margin-top:10px}
.run .bl i{flex:1;height:34px;border-radius:4px;background:#F1EFE9;font:700 16px/34px "BarlowC";color:#0D0E0F;text-align:center;font-style:normal}
.run .bl i.t{background:#FF6B1A;color:#160700}.run .bl i.n{background:none;border:2px solid #4A4E52;color:#8C9094;line-height:30px}.run .bl i.r{background:#5BE38C;color:#06250F}
.run .cap b{color:#FF6B1A}
.mo{position:absolute;top:356px;left:20px;right:20px;border-top:1px solid #2A2D30;padding-top:12px}
.mo .h{display:flex;justify-content:space-between;margin-bottom:10px}
.g{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
.g span{text-align:center;font:600 12px/1 "BarlowC";letter-spacing:.1em;color:#6B7075;padding-bottom:2px}
.g i{height:38px;border-radius:4px;font:700 19px/38px "BarlowC";text-align:center;font-style:normal}
.g i.w{background:#26292C;color:#D9D6CF}.g i.r{background:#5BE38C;color:#06250F}.g i.u{border:1.5px dashed #3A3E42;color:#6B7075;line-height:35px}
.g i.t{background:#FF6B1A;color:#160700}.g i.p{position:relative}.g i.p:after{content:"$";position:absolute;top:3px;right:4px;font:700 11px/1 "BarlowC";color:#FFD23E}
.payr{position:absolute;top:632px;left:20px;right:20px;display:flex;border-top:1px solid #2A2D30;border-bottom:1px solid #2A2D30}
.payr div{flex:1;padding:11px 0 10px 12px;border-left:1px solid #2A2D30}.payr div:first-child{border:0;padding-left:0}
.payr b{display:block;font:700 30px/1 "BarlowC";margin-bottom:4px}
.btn{position:absolute;top:710px;left:20px;right:20px;height:64px;border-radius:6px;background:#FF6B1A;color:#160700;display:flex;align-items:center;gap:12px;padding:0 18px;font:800 26px/1 "BarlowC";letter-spacing:.03em;text-transform:uppercase}
.btn span{margin-left:auto}
.nav{position:absolute;bottom:22px;left:20px;right:20px;display:flex;justify-content:space-between;font:700 15px/1 "BarlowC";letter-spacing:.12em;text-transform:uppercase;color:#6B7075}
.nav .on{color:#F1EFE9;border-top:3px solid #F1EFE9;margin-top:-10px;padding-top:7px}
.hb{background:#F1EFE9}`,
`${status('#F1EFE9')}
<div class="top"><div class="cap"><b>Sat · Nov 14</b> &nbsp;·&nbsp; Day shift 6:00 AM – 6:00 PM</div></div>
<div class="hero"><div class="cap">Rest in</div><div class="big">2</div><div class="side">Days<small>Mon Nov 16</small></div>
<div class="lamp"><i>MON</i><i>TUE</i></div></div>
<div class="run"><div class="cap"><b>Day 6</b> in a row &nbsp;·&nbsp; 6 days since rest</div>
<div class="bl"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i class="t">6</i><i class="n">7</i><i class="r">R</i><i class="r">R</i></div></div>
<div class="mo"><div class="h"><div class="cap" style="color:#F1EFE9">November</div><div class="cap">dashed = not known yet</div></div>
<div class="g">${['S','M','T','W','T','F','S'].map(x=>`<span>${x}</span>`).join('')}${Array.from({length:30},(_,i)=>i+1).map(d=>`<i class="${d===14?'t':s(d)}${d===20?' p':''}">${d}</i>`).join('')}</div></div>
<div class="payr"><div><b>58.5 H</b><span class="cap">Pay period</span></div><div><b>$1,418</b><span class="cap">Estimate</span></div><div><b>6 DAYS</b><span class="cap">To payday</span></div></div>
<div class="btn">${ic('alarm',30,2.4)}Set alarm · Sun<span>4:30 AM</span></div>
<div class="nav"><div class="on">Today</div><div>Calendar</div><div>Pay</div><div>My day</div></div><div class="hb"></div>`);

/* ───────── C · THE DIAL ───────── */
const cx = 195, cy = 300, R = 110;
const pt = (h, r = R) => { const a = (h / 24) * 2 * Math.PI; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
const arc = (h1, h2, r = R) => { if (h2 < h1) h2 += 24; const [x1, y1] = pt(h1, r), [x2, y2] = pt(h2, r); return `M${x1} ${y1}A${r} ${r} 0 ${h2 - h1 > 12 ? 1 : 0} 1 ${x2} ${y2}`; };
const lab = (h, t, s2, r = 162) => { let [x, y] = pt(h, r); x = Math.max(49, Math.min(341, x)); return `<div class="lb" style="left:${x - 45}px;top:${y - 15}px"><b>${t}</b>${s2}</div>`; };
const [hx, hy] = pt(4.7, R + 17), [hx2, hy2] = pt(4.7, R - 17);
const C = page(`${font('Archivo', 'archivo-latin-standard-normal.woff2', '100 900')}
body{background:#EEF1EC;color:#0E1726;font-family:"Archivo",sans-serif}
.h1{position:absolute;top:60px;left:22px;font:800 34px/1 "Archivo";font-stretch:125%;letter-spacing:-.02em}
.h2{position:absolute;top:70px;right:22px;font:600 15px/1.25 "Archivo";text-align:right;color:#4C586B}
.dial{position:absolute;top:0;left:0}
.lb{position:absolute;width:90px;text-align:center;font:500 11.5px/1.2 "Archivo";color:#4C586B}.lb b{display:block;font:700 14px/1.1 "Archivo";color:#0E1726}
.mid{position:absolute;top:248px;left:95px;width:200px;text-align:center}
.mid small{font:600 14px/1 "Archivo";color:#4C586B;letter-spacing:.02em}
.mid b{display:block;font:800 42px/1 "Archivo";font-stretch:112%;letter-spacing:-.03em;margin:5px 0 7px}
.mid span{display:inline-block;background:#FFC83A;border-radius:99px;padding:6px 12px;font:700 13px/1 "Archivo"}
.wk{position:absolute;top:500px;left:16px;right:16px;display:flex;justify-content:space-between}
.wk div{width:46px;text-align:center;font:600 12px/1 "Archivo";color:#4C586B}
.wk i{display:block;width:46px;height:46px;border-radius:50%;margin-top:8px;font:800 18px/46px "Archivo";font-style:normal}
.wk .w i{background:#2046F5;color:#fff}.wk .r i{background:#FFC83A;color:#0E1726}.wk .u i{border:2px dashed #A9B2BE;color:#7A8594;line-height:42px}
.wk .now{color:#0E1726;font-weight:800}.wk .now i{box-shadow:0 0 0 3px #EEF1EC,0 0 0 6px #0E1726}
.wk em{display:block;margin-top:7px;font:700 11px/1 "Archivo";font-style:normal;color:#0E1726;height:11px}
.facts{position:absolute;top:606px;left:22px;right:22px;display:flex;justify-content:space-between;border-top:2px solid #0E1726;padding-top:13px}
.facts div{font:500 12.5px/1 "Archivo";color:#4C586B}.facts b{display:block;font:800 25px/1 "Archivo";font-stretch:112%;color:#0E1726;margin-bottom:6px;letter-spacing:-.02em}
.btn{position:absolute;top:684px;left:16px;right:16px;height:66px;border-radius:33px;background:#0E1726;color:#EEF1EC;display:flex;align-items:center;gap:12px;padding:0 10px 0 22px;font:700 18px/1 "Archivo"}
.btn span{margin-left:auto;background:#FFC83A;color:#0E1726;height:46px;border-radius:23px;padding:0 16px;font:800 19px/46px "Archivo"}
.nav{position:absolute;bottom:26px;left:0;right:0;display:flex;justify-content:space-around;font:600 11px/1 "Archivo";color:#7A8594}
.nav div{display:flex;flex-direction:column;align-items:center;gap:6px;width:90px}.nav .on{color:#2046F5}
.hb{background:#0E1726}`,
`${status('#0E1726')}
<div class="h1">Saturday</div><div class="h2">Nov 14<br>Day 6 in a row</div>
<svg class="dial" width="390" height="480" viewBox="0 0 390 480" fill="none" stroke-linecap="butt">
<circle cx="${cx}" cy="${cy}" r="${R}" stroke="#DCE1DA" stroke-width="30"/>
<path d="${arc(21, 4.5)}" stroke="#0E1726" stroke-width="30"/>
<path d="${arc(4.5, 6)}" stroke="#9FB0FF" stroke-width="30"/>
<path d="${arc(6, 18)}" stroke="#2046F5" stroke-width="30"/>
<path d="${arc(18, 18.67)}" stroke="#9FB0FF" stroke-width="30"/>
<path d="${arc(18.67, 21)}" stroke="#FFC83A" stroke-width="30"/>
${Array.from({length:24},(_,h)=>{const [a,b]=pt(h,R-22),[c,d]=pt(h,R-(h%6?27:32));return `<path d="M${a} ${b}L${c} ${d}" stroke="#0E1726" stroke-opacity="${h%6?.3:.8}" stroke-width="${h%6?1.5:2.5}"/>`}).join('')}
<path d="M${hx2} ${hy2}L${hx} ${hy}" stroke="#FF4B2B" stroke-width="5" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="7" fill="#FF4B2B"/>
</svg>
${lab(3.7,'4:30 AM','wake',158)}${lab(6.9,'6:00 AM','clock in',160)}${lab(12,'12:00','eat',142)}${lab(17.3,'6:00 PM','clock out',160)}${lab(19.6,'6:40 PM','home',158)}${lab(21.7,'9:00 PM','sleep',154)}
<div class="mid"><small>Rest in</small><b>2 days</b><span>Mon and Tue off</span></div>
<div class="wk">${[14,15,16,17,18,19,20].map(d=>`<div class="${s(d)}${d===14?' now':''}">${d===14?'Today':dow[(d-1)%7]}<i>${d}</i><em>${d===20?'payday':''}</em></div>`).join('')}</div>
<div class="facts"><div><b>58.5 h</b>this pay period</div><div><b>$1,418</b>estimate, before tax</div><div><b>6 days</b>to payday</div></div>
<div class="btn">${ic('alarm',26,2.2)}Set Sunday's alarm<span>4:30 AM</span></div>
<div class="nav"><div class="on">${ic('home')}Today</div><div>${ic('cal')}Calendar</div><div>${ic('pay')}Pay</div></div><div class="hb"></div>`);

const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>${font('Archivo', 'archivo-latin-standard-normal.woff2', '100 900')}
body{margin:0;background:#1B1D20;font-family:"Archivo";color:#fff;width:1330px;height:980px;display:flex;gap:40px;padding:40px;box-sizing:border-box}
div{width:390px}p{font:800 26px/1 "Archivo";margin:0 0 16px}img{width:390px;height:844px;border-radius:38px;display:block;box-shadow:0 0 0 2px #3A3E44}</style></head><body>
<div><p>A · Daybreak</p><img src="A-daybreak.png"></div><div><p>B · The Board</p><img src="B-board.png"></div><div><p>C · The Dial</p><img src="C-dial.png"></div></body></html>`;

const files = { 'A-daybreak': A, 'B-board': B, 'C-dial': C };
for (const [n, h] of Object.entries(files)) writeFileSync(`${here}${n}.html`, h);
writeFileSync(`${here}sheet.html`, sheet);
const { chromium } = require('playwright');
const br = await chromium.launch();
for (const n of Object.keys(files)) {
  const pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await pg.goto(`file://${here}${n}.html`); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: `${here}${n}.png` }); await pg.close();
}
const pg = await br.newPage({ viewport: { width: 1330, height: 980 }, deviceScaleFactor: 1 });
await pg.goto(`file://${here}sheet.html`); await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: `${here}three-looks.png` });
await br.close();

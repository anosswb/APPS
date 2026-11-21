// Draws three logo options for the Shift app and a picture of each on a phone home screen. Run: node make.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const bg = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
const arc = (cx, cy, r, h1, h2) => { const p = (h) => { const a = (h / 24) * 2 * Math.PI; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }; let s = h2 - h1; if (s <= 0) s += 24; const [x1, y1] = p(h1), [x2, y2] = p(h1 + s); return `M${x1} ${y1}A${r} ${r} 0 ${s > 12 ? 1 : 0} 1 ${x2} ${y2}`; };
// A: the 24-hour ring: work in white, rest in green, a dot for now
const A = (full = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bg('g', '#17325E', '#070B14')}${full ? '<rect width="1024" height="1024" fill="url(#g)"/>' : ''}
<circle cx="512" cy="512" r="250" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="96"/>
<path d="${arc(512, 512, 250, 6, 18)}" fill="none" stroke="#FFFFFF" stroke-width="96" stroke-linecap="round"/>
<path d="${arc(512, 512, 250, 20.4, 3.6)}" fill="none" stroke="#2FC27A" stroke-width="96" stroke-linecap="round"/>
<circle cx="512" cy="512" r="54" fill="#FFFFFF"/></svg>`;
// B: sunrise over a flat horizon (the sky of Today)
const B = (full = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bg('g', '#0C1A36', '#2E55B0')}${full ? '<rect width="1024" height="1024" fill="url(#g)"/>' : ''}
<path d="M262 640 A250 250 0 0 1 762 640 Z" fill="#FFFFFF"/>
<rect x="150" y="676" width="724" height="64" rx="32" fill="#2FC27A"/></svg>`;
// C: one calendar day with the green rest bar
const C = (full = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bg('g', '#141A24', '#05070B')}${full ? '<rect width="1024" height="1024" fill="url(#g)"/>' : ''}
<rect x="262" y="232" width="500" height="560" rx="110" fill="#FFFFFF" fill-opacity="0.1" stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="28"/>
<text x="512" y="600" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="300" fill="#FFFFFF">21</text>
<rect x="392" y="664" width="240" height="56" rx="28" fill="#2FC27A"/></svg>`;
const opts = { A, B, C };
for (const [k, f] of Object.entries(opts)) { fs.writeFileSync(`${k}.svg`, f()); fs.writeFileSync(`${k}-glyph.svg`, f(false)); }
const tile = (k, s) => `<div style="width:${s}px;height:${s}px;border-radius:${s * 0.23}px;overflow:hidden">${opts[k]()}</div>`;
const html = `<!doctype html><html><head><style>body{margin:0;background:#1B1D20;font-family:Inter,sans-serif;color:#fff;width:1500px;padding:40px;box-sizing:border-box}
.row{display:flex;gap:60px}.col{width:440px}.col p{font-size:28px;font-weight:800;margin:0 0 6px}.col span{display:block;font-size:17px;color:#B9BEC7;margin-bottom:18px;line-height:1.35}
.home{margin-top:26px;height:230px;border-radius:24px;padding:24px;display:flex;gap:26px;align-items:flex-start;background:linear-gradient(160deg,#2B4A6F,#12203A)}
.home.light{background:linear-gradient(160deg,#DCE6F2,#B8C9DE)}.app{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:14px}
svg{width:100%;height:100%;display:block}</style></head><body><div class="row">
${[['A', 'A · The day ring', 'Your 24 hours: white = your shift, green = your rest, the dot = now. Same ring as My day.'],
   ['B', 'B · Daybreak', 'The sun on the horizon, like the sky on Today. Green line = rest.'],
   ['C', 'C · Rest day', 'One calendar day with the green rest bar, like the calendar.']].map(([k, t, d]) => `<div class="col"><p>${t}</p><span>${d}</span>${tile(k, 300)}
<div class="home"><div class="app">${tile(k, 76)}Shift app</div><div class="app">${tile(k, 56)}</div><div class="app">${tile(k, 40)}</div></div>
<div class="home light"><div class="app" style="color:#111">${tile(k, 76)}Shift app</div><div class="app">${tile(k, 56)}</div><div class="app">${tile(k, 40)}</div></div></div>`).join('')}
</div></body></html>`;
fs.writeFileSync('options.html', html);
(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1500, height: 1000 } });
  await pg.goto('file://' + __dirname + '/options.html'); await pg.screenshot({ path: 'logo-options.png', fullPage: true });
  for (const k of Object.keys(opts)) { await pg.setViewportSize({ width: 1024, height: 1024 }); await pg.setContent(`<body style="margin:0">${opts[k]()}</body>`); await pg.screenshot({ path: `${k}-1024.png` }); }
  await br.close();
})();

// Turns logo A (the day ring) into the app's icon files. Run: node icons.cjs
const { chromium } = require('playwright');
const path = require('path');
const out = path.join(__dirname, '../../assets');
const arc = (r, h1, h2) => { const p = (h) => { const a = (h / 24) * 2 * Math.PI; return [512 + r * Math.sin(a), 512 - r * Math.cos(a)]; }; let s = h2 - h1; if (s <= 0) s += 24; const [x1, y1] = p(h1), [x2, y2] = p(h1 + s); return `M${x1} ${y1}A${r} ${r} 0 ${s > 12 ? 1 : 0} 1 ${x2} ${y2}`; };
const grad = '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17325E"/><stop offset="1" stop-color="#070B14"/></linearGradient></defs>';
// scale: 1 = as drawn for the full icon; smaller for the Android safe zone
const ring = (scale, { bg = false, mono = false } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${grad}${bg ? '<rect width="1024" height="1024" fill="url(#g)"/>' : ''}
<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
${mono ? '' : '<circle cx="512" cy="512" r="250" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="96"/>'}
<path d="${arc(250, 6, 18)}" fill="none" stroke="#FFFFFF" stroke-width="96" stroke-linecap="round"/>
<path d="${arc(250, 20.4, 3.6)}" fill="none" stroke="${mono ? '#FFFFFF' : '#2FC27A'}" stroke-width="96" stroke-linecap="round"/>
<circle cx="512" cy="512" r="54" fill="#FFFFFF"/></g></svg>`;
const bgOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${grad}<rect width="1024" height="1024" fill="url(#g)"/></svg>`;
const jobs = [
  ['icon.png', 1024, ring(1, { bg: true }), false],
  ['android-icon-foreground.png', 512, ring(0.8), true],   // ring is 47% of the tile: inside the 61% safe circle on every launcher
  ['android-icon-background.png', 512, bgOnly, false],
  ['android-icon-monochrome.png', 432, ring(0.8, { mono: true }), true],
  ['splash-icon.png', 1024, ring(1), true],
  ['favicon.png', 48, ring(1, { bg: true }), false],
];
(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage();
  for (const [name, s, svg, clear] of jobs) {
    await pg.setViewportSize({ width: s, height: s });
    await pg.setContent(`<html><body style="margin:0;background:transparent"><div style="width:${s}px;height:${s}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body></html>`);
    await pg.screenshot({ path: path.join(out, name), omitBackground: clear });
  }
  await br.close();
})();

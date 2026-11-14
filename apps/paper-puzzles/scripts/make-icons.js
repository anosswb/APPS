/**
 * Draws the app icon and splash art from the same shapes the game uses (src/ui/Glyphs.tsx)
 * and writes the PNG files in assets/. Our own drawing, no outside art.
 * Run from the app folder:  node scripts/make-icons.js   (needs Playwright's Chromium)
 */
const { chromium } = require('playwright');
const path = require('path');

const PAPER = '#F6F1E7';
const PINE = '#2F4A3A';
const RED = '#B3261E';
const TREE = 'M11 18.5h2V22h-2z M12 2.2 16.6 8.4H14.4L18.7 13.6H15.9L20.6 19H3.4L8.1 13.6H5.3L9.6 8.4H7.4z';
const TENT = 'M12 4.4 21.6 20H2.4z';
const DOOR = 'M12 11.5 15.4 20H8.6z';
const POLE = 'M12 5.2V2.6';

/** The opening-screen picture: a pine in green ink with a red tent at its foot. */
function art({ scale = 1, pine = PINE, red = RED, door = PAPER }) {
  return `
  <g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
    <g transform="translate(118 104) scale(31)"><path d="${TREE}" fill="${pine}"/></g>
    <g transform="translate(500 478) scale(18.5)">
      <path d="${POLE}" stroke="${red}" stroke-width="1.1" stroke-linecap="round"/>
      <path d="${TENT}" fill="${red}"/>
      <path d="${DOOR}" fill="${door}"/>
    </g>
  </g>`;
}

const INK = '#22201C';
const SHEET = '#FFFDF8';
const tree = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${TREE}" fill="${c}"/></g>`;
const tent = (x, y, s, c, door) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="${TENT}" fill="${c}"/><path d="${DOOR}" fill="${door}"/></g>`;

/**
 * The icon: a corner of the puzzle page. A masthead rule, a two-by-two grid, one tree, one tent.
 * Picked on 14 Nov 2026 from three options because it says "paper" and "puzzle" at a glance.
 */
function page({ scale = 1, ink = INK, pine = PINE, red = RED, sheet = SHEET, lines = 0.32 }) {
  return `
  <g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
    <rect x="192" y="150" width="640" height="20" fill="${ink}"/><rect x="192" y="184" width="640" height="6" fill="${ink}"/>
    <rect x="192" y="252" width="640" height="640" fill="${sheet}" stroke="${ink}" stroke-width="14"/>
    <path d="M512 252V892M192 572H832" stroke="${ink}" stroke-opacity="${lines}" stroke-width="7"/>
    ${tree(222, 282, 10.8, pine)}${tent(542, 606, 10.8, red, sheet)}
  </g>`;
}
/** The folded corner of the page (full icon only; Android cuts its own shape). */
const DOG_EAR = '<path d="M824 0 1024 200V0z" fill="#D9D0BC"/><path d="M824 0V200H1024z" fill="#EAE3D2"/>';

const svg = (inner, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : ''}${inner}</svg>`;

const FILES = [
  { name: 'icon.png', size: 1024, svg: svg(page({}) + DOG_EAR, PAPER) },
  { name: 'android-icon-background.png', size: 1024, svg: svg('', PAPER) },
  { name: 'android-icon-foreground.png', size: 1024, svg: svg(page({ scale: 0.72 })), clear: true },
  // one flat colour: Android tints it for themed icons. The door and the sheet are cut out with a mask.
  {
    name: 'android-icon-monochrome.png',
    size: 1024,
    clear: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <mask id="m"><rect width="1024" height="1024" fill="black"/>${page({ scale: 0.72, ink: 'white', pine: 'white', red: 'white', sheet: 'black', lines: 1 })}</mask>
      <rect width="1024" height="1024" fill="#000000" mask="url(#m)"/></svg>`,
  },
  // the opening screen keeps the simple pair: a pine and a tent, on the paper colour
  { name: 'splash-icon.png', size: 1024, svg: svg(art({ scale: 0.8 })), clear: true },
  { name: 'splash-icon-dark.png', size: 1024, svg: svg(art({ scale: 0.8, pine: '#9CC7A8', red: '#FF8A7A', door: '#181613' })), clear: true },
  { name: 'favicon.png', size: 96, svg: svg(page({ scale: 1.1 }), PAPER) },
];

(async () => {
  const browser = await chromium.launch();
  for (const f of FILES) {
    const page = await browser.newPage({ viewport: { width: f.size, height: f.size }, deviceScaleFactor: 1 });
    await page.setContent(
      `<html><body style="margin:0;background:transparent">${f.svg.replace('width="1024" height="1024"', `width="${f.size}" height="${f.size}"`)}</body></html>`,
    );
    await page.screenshot({ path: path.join(__dirname, '..', 'assets', f.name), omitBackground: !!f.clear });
    await page.close();
    console.log('wrote', f.name);
  }
  await browser.close();
})().catch((e) => {
  console.error('FAILED', e.message);
  process.exit(1);
});

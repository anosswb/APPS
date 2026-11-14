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

/** The picture: a pine in green ink with a red tent at its foot. `scale` shrinks it for Android's safe zone. */
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

const svg = (inner, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : ''}${inner}</svg>`;

const FILES = [
  { name: 'icon.png', size: 1024, svg: svg(art({ scale: 0.86 }), PAPER) },
  { name: 'android-icon-background.png', size: 1024, svg: svg('', PAPER) },
  { name: 'android-icon-foreground.png', size: 1024, svg: svg(art({ scale: 0.6 })), clear: true },
  // one flat colour: Android tints it for themed icons. The door is cut out with a mask.
  {
    name: 'android-icon-monochrome.png',
    size: 1024,
    clear: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <mask id="m"><rect width="1024" height="1024" fill="black"/>${art({ scale: 0.6, pine: 'white', red: 'white', door: 'black' })}</mask>
      <rect width="1024" height="1024" fill="#000000" mask="url(#m)"/></svg>`,
  },
  { name: 'splash-icon.png', size: 1024, svg: svg(art({ scale: 0.8 })), clear: true },
  { name: 'splash-icon-dark.png', size: 1024, svg: svg(art({ scale: 0.8, pine: '#9CC7A8', red: '#FF8A7A', door: '#181613' })), clear: true },
  { name: 'favicon.png', size: 96, svg: svg(art({ scale: 0.9 }), PAPER) },
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

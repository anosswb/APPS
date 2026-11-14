/**
 * Lists every outside package whose code really ends up inside the app, with its licence and copyright line,
 * and writes src/config/licences.json for the "Open-source licences" page.
 *
 * Run from the app folder, after adding or updating any package:
 *   EXPO_OFFLINE=1 npx expo export --platform android --platform ios --platform web --source-maps --no-bytecode --output-dir /tmp/pp-maps
 *   node scripts/make-licences.js /tmp/pp-maps
 *
 * It reads the source maps of the three bundles, so build tools that are never shipped are left out.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dir = process.argv[2];
if (!dir) {
  console.error('Give the folder of the export, see the top of this file.');
  process.exit(1);
}

function maps(folder) {
  const out = [];
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) out.push(...maps(full));
    else if (entry.name.endsWith('.map')) out.push(full);
  }
  return out;
}

const found = new Map(); // package folder -> true
for (const file of maps(dir)) {
  const map = JSON.parse(fs.readFileSync(file, 'utf8'));
  // A bundle map is either one map or a list of small ones ("sections").
  const sources = [...(map.sources || []), ...(map.sections || []).flatMap((part) => (part.map && part.map.sources) || [])];
  for (const source of sources) {
    const at = source.lastIndexOf('node_modules/');
    if (at < 0) continue;
    const parts = source.slice(at + 'node_modules/'.length).split('/');
    const name = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
    found.set(source.slice(0, at) + 'node_modules/' + name, true);
  }
}

// Packages named in package.json are always listed: some put only native code in the app, which no source map shows.
for (const name of Object.keys(require(path.join(root, 'package.json')).dependencies)) found.set('node_modules/' + name, true);

/** The copyright line of a package: from its LICENSE file, else from the author in package.json. */
function copyright(folder, pkg) {
  const file = fs.readdirSync(folder).find((f) => /^(licen[sc]e|copying)(\.|$|-)/i.test(f) || /^LICENSE_FONT$/i.test(f));
  if (file) {
    const line = fs
      .readFileSync(path.join(folder, file), 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .find((l) => /^copyright\b.*\d{4}|^copyright \(c\)|^copyright ©/i.test(l));
    if (line) return line.replace(/\s*<[^>]*>/g, '').replace(/\s+/g, ' ').replace(/\.$/, '').slice(0, 140);
  }
  // These ship without a licence file. They come from the React Native and Metro projects (MIT, Meta); their source files carry this line.
  if (/^@react-native\/|^metro-/.test(pkg.name)) return 'Copyright (c) Meta Platforms, Inc. and affiliates';
  const author = typeof pkg.author === 'string' ? pkg.author : pkg.author && pkg.author.name;
  return author ? `Copyright ${String(author).replace(/\s*<[^>]*>|\s*\([^)]*\)/g, '').trim()}` : '';
}

const byName = new Map();
const missing = [];
for (const rel of found.keys()) {
  const folder = path.resolve(root, rel.replace(/^(\.\.\/)+/, '').replace(/^\/+/, ''));
  const real = fs.existsSync(path.join(folder, 'package.json')) ? folder : path.join(root, rel.slice(rel.indexOf('node_modules/')));
  if (!fs.existsSync(path.join(real, 'package.json'))) {
    missing.push(rel);
    continue;
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(real, 'package.json'), 'utf8'));
  const licence = typeof pkg.license === 'string' ? pkg.license : pkg.license && pkg.license.type;
  if (!licence) missing.push(`${pkg.name} (no licence field)`);
  const key = `${pkg.name}@${pkg.version}`;
  byName.set(key, { name: pkg.name, version: pkg.version, licence: licence || 'UNKNOWN', copyright: copyright(real, pkg) });
}

const packages = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
const counts = {};
for (const p of packages) counts[p.licence] = (counts[p.licence] || 0) + 1;

/** The full text of each licence, copied from a package that ships it, with that package's own copyright lines taken off. */
const TEXT_FROM = {
  MIT: 'react/LICENSE',
  'Apache-2.0': '@iabtcf/core/LICENSE',
  ISC: '@ungap/structured-clone/LICENSE',
  'BSD-3-Clause': 'hyphenate-style-name/LICENSE',
  'OFL-1.1': '@expo-google-fonts/newsreader/LICENSE_FONT',
};
function body(file) {
  const paragraphs = fs
    .readFileSync(path.join(root, 'node_modules', file), 'utf8')
    .split(/\n\s*\n/)
    .map((para) => para.split('\n').map((l) => l.trim()).filter(Boolean).join(' '))
    .filter((para) => para && !/^copyright\b/i.test(para) && !/^-+$/.test(para));
  return paragraphs.join('\n\n');
}
const texts = {};
for (const p of packages) {
  for (const id of p.licence.split(/ AND | OR /)) {
    if (!TEXT_FROM[id]) missing.push(`${p.name}: no text on file for the licence "${id}"`);
    else if (!texts[id]) texts[id] = body(TEXT_FROM[id]);
  }
}
/** The fonts are files we ship as they are, so their own copyright lines are shown on the page. */
const fonts = ['newsreader', 'libre-franklin'].map((f) => ({
  name: f === 'newsreader' ? 'Newsreader' : 'Libre Franklin',
  copyright: fs.readFileSync(path.join(root, 'node_modules', '@expo-google-fonts', f, 'LICENSE_FONT'), 'utf8').split('\n')[0].trim(),
  licence: 'OFL-1.1',
}));
fs.writeFileSync(path.join(root, 'src', 'config', 'licences.json'), JSON.stringify({ fonts, packages, texts }, null, 1) + '\n');
console.log(`${packages.length} packages`, counts);
if (missing.length) {
  console.error('CHECK BY HAND:', missing);
  process.exit(1);
}

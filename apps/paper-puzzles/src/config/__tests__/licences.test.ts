import data from '../licences.json';
import pkg from '../../../package.json';

const texts: Record<string, string> = data.texts;

describe('the open-source licences page', () => {
  test('every shipped package has a licence we hold the text of, and a copyright line', () => {
    expect(data.packages.length).toBeGreaterThan(20);
    for (const p of data.packages) {
      for (const id of p.licence.split(/ AND | OR /)) expect(texts[id]?.length).toBeGreaterThan(300);
      expect(p.copyright).toMatch(/^Copyright/i);
    }
  });

  test('nothing under a licence that would force our own code open (GPL, AGPL, LGPL) or forbid selling', () => {
    for (const p of data.packages) expect(p.licence).not.toMatch(/GPL|CC-BY-NC|UNKNOWN|UNLICENSED/i);
  });

  test('both typefaces are listed with their own copyright lines', () => {
    expect(data.fonts.map((f) => f.name)).toEqual(['Newsreader', 'Libre Franklin']);
    for (const f of data.fonts) expect(f.copyright).toMatch(/^Copyright 20\d\d The .* Project Authors/);
  });

  test('the list is up to date: every package named in package.json is on it', () => {
    const listed = new Set(data.packages.map((p) => p.name));
    for (const name of Object.keys(pkg.dependencies)) expect([name, listed.has(name)]).toEqual([name, true]);
  });
});

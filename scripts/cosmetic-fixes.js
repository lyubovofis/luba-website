/**
 * cosmetic-fixes.js  (P3 SEO hygiene)
 *  1. Complete 4 truncated <title> (and matching og/twitter title).
 *  2. Add og:image (brand hero) to 13 pages missing it.
 *  3. Dedupe 5x-duplicated hreflang block (186 -> 37) on 2 pages.
 *  4. Add/repair canonical on disclaimer, cookie-policy, quiz pages.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const RU = path.join(ROOT, 'ru');
const r = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const w = (p, c) => fs.writeFileSync(path.join(ROOT, p), c, 'utf8');

// 1) Truncated titles -> completed
const TITLES = {
  'ru/emocionalnoe-vygoranie.html': ['Эмоциональное выгорание: симптомы, стадии и как', 'Эмоциональное выгорание: симптомы, стадии и как восстановиться'],
  'ru/tehniki-zazemleniya.html': ['Техники заземления: 7 способов вернуться в тело при тревоге и', 'Техники заземления: 7 способов вернуться в тело при тревоге'],
  'ru/vina-emigranta.html': ['Вина эмигранта: как чувство вины блокирует доход и счастье за', 'Вина эмигранта: как чувство вины блокирует доход и счастье за границей'],
  'ru/psihologiya-deneg-v-emigracii.html': ['Психология денег в эмиграции — как переезд меняет отношения с', 'Психология денег в эмиграции: как переезд меняет отношения с деньгами'],
};
let t1 = 0;
for (const [f, [oldT, newT]] of Object.entries(TITLES)) {
  let c = r(f);
  if (c.includes(oldT)) { c = c.split(oldT).join(newT); w(f, c); t1++; }
}
console.log(`1) titles completed: ${t1}/4`);

// 2) og:image on pages missing it
const HERO = 'https://lyubovpsy.com/images/luba-hero.webp';
let t2 = 0;
for (const f of fs.readdirSync(RU).filter(x => x.endsWith('.html'))) {
  const rel = 'ru/' + f;
  let c = r(rel);
  if (/og:image/i.test(c)) continue;
  const m = c.match(/([ \t]*)<meta property="og:description"[^>]*>/i);
  if (!m) continue;
  const indent = m[1];
  const tag = `\n${indent}<meta property="og:image" content="${HERO}">`;
  c = c.replace(m[0], m[0] + tag);
  w(rel, c); t2++;
}
console.log(`2) og:image added: ${t2}`);

// 3) Dedupe duplicated hreflang blocks
let t3 = 0;
for (const f of ['ru/denezhnye-bloki.html', 'ru/sindrom-samozvanca.html']) {
  let lines = r(f).split('\n');
  const seen = new Set();
  const out = [];
  let removed = 0;
  for (const ln of lines) {
    if (/hreflang=/.test(ln)) {
      const key = ln.trim();
      if (seen.has(key)) { removed++; continue; }
      seen.add(key);
    }
    out.push(ln);
  }
  w(f, out.join('\n'));
  console.log(`3) ${f}: removed ${removed} duplicate hreflang lines -> ${seen.size} kept`);
  t3++;
}

// 4) Canonicals
function addCanonical(rel, url) {
  let c = r(rel);
  if (/rel="canonical"/.test(c)) return false;
  c = c.replace(/<\/head>/i, `    <link rel="canonical" href="${url}">\n</head>`);
  w(rel, c); return true;
}
console.log('4) disclaimer canonical:', addCanonical('disclaimer.html', 'https://lyubovpsy.com/disclaimer'));
console.log('4) cookie-policy canonical:', addCanonical('cookie-policy.html', 'https://lyubovpsy.com/cookie-policy'));
console.log('4) quiz-test canonical:', addCanonical('quiz-test/index.html', 'https://lyubovpsy.com/quiz'));
// quiz/index.html: fix trailing-slash canonical
let q = r('quiz/index.html');
if (q.includes('https://lyubovpsy.com/quiz/')) {
  q = q.replace(/href="https:\/\/lyubovpsy\.com\/quiz\/"/g, 'href="https://lyubovpsy.com/quiz"');
  w('quiz/index.html', q);
  console.log('4) quiz/index.html canonical trailing slash fixed');
}

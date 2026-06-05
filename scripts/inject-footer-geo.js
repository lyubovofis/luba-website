/**
 * inject-footer-geo.js
 * Adds two sitewide footer categories (Психолог по странам / по запросу) with
 * CLEAN URLs into every baked .seo-categories footer, giving the high-intent
 * geo + problem pages a direct sitewide internal link. Idempotent. Clean URLs
 * only (never .html). NOTE: does NOT use the stale update-footers.js (which has
 * .html links). Also updates the source component for parity.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RU = path.join(ROOT, 'ru');
const ANCHOR = '<div class="seo-categories">';
const MARKER = '<!-- geo-injected -->';

const BLOCK = `
                ${MARKER}
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🌍</span>
                        <span class="seo-category-name">Психолог по странам</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/psiholog-onlayn-izrail">Психолог в Израиле</a>
                        <a href="/ru/psiholog-onlayn-germaniya">Психолог в Германии</a>
                        <a href="/ru/psiholog-onlayn-ssha">Психолог в США</a>
                        <a href="/ru/psiholog-onlayn-kanada">Психолог в Канаде</a>
                        <a href="/ru/psiholog-onlayn-velikobritaniya">Психолог в Великобритании</a>
                        <a href="/ru/psiholog-onlayn-ispaniya">Психолог в Испании</a>
                        <a href="/ru/psiholog-onlayn-italiya">Психолог в Италии</a>
                        <a href="/ru/psiholog-onlayn-avstraliya">Психолог в Австралии</a>
                        <a href="/ru/psiholog-onlayn-niderlandy">Психолог в Нидерландах</a>
                        <a href="/ru/psiholog-onlayn-polsha">Психолог в Польше</a>
                        <a href="/ru/psiholog-onlayn-chehiya">Психолог в Чехии</a>
                        <a href="/ru/psiholog-onlayn-kipr">Психолог на Кипре</a>
                        <a href="/ru/psiholog-onlayn-dubai">Психолог в Дубае</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🎯</span>
                        <span class="seo-category-name">Психолог по запросу</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/psiholog-po-deneznym-blokam">По денежным блокам</a>
                        <a href="/ru/psiholog-po-strahu-deneg">По страху денег</a>
                        <a href="/ru/psiholog-po-strahu-bolshih-deneg">По страху больших денег</a>
                        <a href="/ru/psiholog-po-samoocenke">По самооценке</a>
                        <a href="/ru/psiholog-po-trevozhnosti">По тревожности</a>
                        <a href="/ru/psiholog-po-depressii">По депрессии</a>
                        <a href="/ru/psiholog-po-vygoraniyu">По выгоранию</a>
                        <a href="/ru/psiholog-po-otnosheniyam">По отношениям</a>
                        <a href="/ru/psiholog-po-neuverennosti">По неуверенности</a>
                        <a href="/ru/psiholog-po-sindromu-samozvanca">По синдрому самозванца</a>
                        <a href="/ru/psiholog-po-prokrastinacii">По прокрастинации</a>
                    </div>
                </div>`;

function inject(content) {
  if (content.includes(MARKER)) return content; // idempotent
  const i = content.indexOf(ANCHOR);
  if (i === -1) return null; // no seo-categories footer here
  const at = i + ANCHOR.length;
  return content.slice(0, at) + BLOCK + content.slice(at);
}

// Targets: component + all ru/*.html that have the baked footer
const targets = [path.join(ROOT, 'components', 'seo-footer.html')]
  .concat(fs.readdirSync(RU).filter(f => f.endsWith('.html')).map(f => path.join(RU, f)));

let changed = 0, skipped = 0, noFooter = 0;
for (const fp of targets) {
  const c = fs.readFileSync(fp, 'utf8');
  const out = inject(c);
  if (out === null) { noFooter++; continue; }
  if (out === c) { skipped++; continue; }
  fs.writeFileSync(fp, out, 'utf8');
  changed++;
}
console.log(`Injected: ${changed} | already-had: ${skipped} | no-seo-footer (skipped): ${noFooter}`);

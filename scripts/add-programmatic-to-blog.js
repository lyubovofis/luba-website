/**
 * add-programmatic-to-blog.js
 * Wires the 110 orphaned programmatic pages into ru/blog.html as themed
 * category-section blocks (matching the existing markup), using each page's
 * real <h1> as keyword-rich anchor text. Fixes the #1 "Discovered – currently
 * not indexed" cause (orphaning). Idempotent: skips if marker already inserted.
 */
const fs = require('fs');
const path = require('path');

const RU = path.join(__dirname, '..', 'ru');
const BLOG = path.join(RU, 'blog.html');

// ---- Group definitions (110 slugs total) ----
const GROUPS = [
  {
    title: 'Психолог по странам — онлайн для русскоязычных за рубежом',
    color: '#0e7490', bg: '#ecfeff', badge: '#0891b2',
    slugs: ['psiholog-onlayn-izrail','psiholog-onlayn-germaniya','psiholog-onlayn-ssha','psiholog-onlayn-kanada','psiholog-onlayn-velikobritaniya','psiholog-onlayn-ispaniya','psiholog-onlayn-italiya','psiholog-onlayn-avstraliya','psiholog-onlayn-avstriya','psiholog-onlayn-niderlandy','psiholog-onlayn-polsha','psiholog-onlayn-chehiya','psiholog-onlayn-shveycariya','psiholog-onlayn-kipr','psiholog-onlayn-dubai'],
  },
  {
    title: 'Психолог по деньгам и финансовой психологии',
    color: '#553c9a', bg: '#faf5ff', badge: '#6b46c1',
    slugs: ['psiholog-po-deneznym-blokam','psiholog-po-strahu-deneg','psiholog-po-strahu-bolshih-deneg','psiholog-po-strahu-poteri-dohoda','psiholog-po-bednomu-myshleniyu','psiholog-po-myshleniyu-bogatstva','psiholog-po-rodovym-scenariyam-deneg','psiholog-po-finansovoi-trevoge','psiholog-po-steklyanomu-potolku','psiholog-po-impulsivnym-pokupkam','psiholog-po-shopogolizmu','psiholog-po-ogranichivayushim-ubezhdeniyam'],
  },
  {
    title: 'Психолог по тревоге, страхам и навязчивым состояниям',
    color: '#92400e', bg: '#fffbeb', badge: '#f59e0b',
    slugs: ['psiholog-po-trevozhnosti','psiholog-po-strahu-osuzhdeniya','psiholog-po-strahu-otkaza','psiholog-po-strahu-smerti','psiholog-po-fobiyam','psiholog-po-sociofobii','psiholog-po-agorafobii','psiholog-po-navyazchivym-mislyam','psiholog-po-okr','psiholog-po-ipohondrii','psiholog-po-bessonice','psiholog-po-ptsr','psiholog-po-psihosomatike'],
  },
  {
    title: 'Психолог по депрессии, выгоранию и состояниям',
    color: '#15803d', bg: '#f0fdf4', badge: '#16a34a',
    slugs: ['psiholog-po-depressii','psiholog-po-poslerodovoi-depressii','psiholog-po-apatii','psiholog-po-handre','psiholog-po-melanholii','psiholog-po-vygoraniyu','psiholog-po-nervnomu-istosheniyu','psiholog-po-hronicheskoy-ustalosti','psiholog-po-stressu','psiholog-po-golovnym-bolyam'],
  },
  {
    title: 'Психолог по отношениям и эмоциям',
    color: '#be185d', bg: '#fdf2f8', badge: '#e11d48',
    slugs: ['psiholog-po-otnosheniyam','psiholog-po-toksichnym-otnosheniyam','psiholog-po-sozavisimosti','psiholog-po-revnosti','psiholog-po-revnosti-v-otnosheniyah','psiholog-po-izmene','psiholog-po-gaslajtingu','psiholog-po-manipulyaciyam','psiholog-po-narcissizmu','psiholog-po-abyuzu','psiholog-po-konfliktam','psiholog-po-granicam','psiholog-po-odinochestvu','psiholog-po-obide','psiholog-po-gnevu','psiholog-po-chuvstvu-viny'],
  },
  {
    title: 'Психолог по самооценке, личностному росту и предназначению',
    color: '#7c3aed', bg: '#f5f3ff', badge: '#8b5cf6',
    slugs: ['psiholog-po-samoocenke','psiholog-po-neuverennosti','psiholog-po-lyubvi-k-sebe','psiholog-po-perfekcionizmu','psiholog-po-prokrastinacii','psiholog-po-sindromu-samozvanca','psiholog-po-vnutrennemu-kritiku','psiholog-po-lichnostnomu-rostu','psiholog-po-samorealizacii','psiholog-po-motivacii','psiholog-po-celepolaganiyu','psiholog-po-poisku-prednaznacheniya','psiholog-po-vyboru-professii','psiholog-po-sindromu-otlozhennoi-zhizni','psiholog-po-krizisu-srednego-vozrasta','psiholog-po-ekzistencialnomu-krizisu','psiholog-po-stydu','psiholog-po-zavisti'],
  },
  {
    title: 'Психолог по травме, утрате и эмиграции',
    color: '#0f766e', bg: '#f0fdfa', badge: '#14b8a6',
    slugs: ['psiholog-po-travme','psiholog-po-travme-razluki','psiholog-po-detskim-travmam','psiholog-po-rodovym-travmam','psiholog-po-utrate','psiholog-po-emigracii-i-dengam'],
  },
  {
    title: 'Психолог для — по жизненной роли',
    color: '#b45309', bg: '#fffbeb', badge: '#d97706',
    slugs: ['psiholog-dlya-zhenshin','psiholog-dlya-mam','psiholog-dlya-par','psiholog-dlya-predprinimateley','psiholog-dlya-frilanserov','psiholog-dlya-emigrantov','psiholog-dlya-ekspatov'],
  },
  {
    title: 'Психолог в жизненных ситуациях',
    color: '#9333ea', bg: '#faf5ff', badge: '#a855f7',
    slugs: ['psiholog-posle-razvoda','psiholog-pri-razvode','psiholog-posle-razryva','psiholog-posle-pereezda','psiholog-v-dekrete','psiholog-zhenshina-i-dengi','pomosh-pri-panicheskih-atakah'],
  },
  {
    title: 'Методы работы и специализации',
    color: '#1d4ed8', bg: '#eff6ff', badge: '#3b82f6',
    slugs: ['nlp-praktik','eriksonovskiy-gipnoz','regressivnaya-terapiya','telesnaya-psihologiya','psihodiagnostika','finansovyi-psiholog-onlayn'],
  },
];

function extractH1(slug) {
  const fp = path.join(RU, slug + '.html');
  if (!fs.existsSync(fp)) return null;
  const html = fs.readFileSync(fp, 'utf8');
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  return m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// ---- Validate coverage vs computed orphan set ----
const allSlugs = fs.readdirSync(RU).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, ''));
const blogHtml0 = fs.readFileSync(BLOG, 'utf8');
const linkedInBlog = new Set((blogHtml0.match(/href="\/ru\/([a-z0-9-]+)"/g) || []).map(s => s.replace(/href="\/ru\/|"/g, '')));
const orphanSet = new Set(allSlugs.filter(s => !linkedInBlog.has(s) && s !== 'blog'));
const grouped = new Set(GROUPS.flatMap(g => g.slugs));

const notGrouped = [...orphanSet].filter(s => !grouped.has(s)).sort();
const missingFiles = [...grouped].filter(s => !allSlugs.includes(s)).sort();
console.log('Orphans (not linked in blog.html):', orphanSet.size);
console.log('Grouped slugs:', grouped.size);
if (notGrouped.length) console.log('!! ORPHANS NOT GROUPED:', notGrouped);
if (missingFiles.length) console.log('!! GROUPED SLUG HAS NO FILE:', missingFiles);

// ---- Build HTML ----
let blocks = '\n                <!-- ===== Programmatic service/geo/problem pages (internal-linking hub) ===== -->\n';
let total = 0, missingH1 = [];
for (const g of GROUPS) {
  const cards = g.slugs.map(slug => {
    const h1 = extractH1(slug);
    if (!h1) { missingH1.push(slug); }
    const label = h1 || slug;
    return `                        <a href="/ru/${slug}" class="article-card"><h3>${label}</h3></a>`;
  }).join('\n');
  total += g.slugs.length;
  blocks +=
`                <div class="category-section" style="border-left: 4px solid ${g.badge}; padding-left: 20px; margin-bottom: 40px; background: ${g.bg}; border-radius: 0 12px 12px 0; padding: 20px 20px 20px 24px;">
                    <h2 class="category-title" style="color: ${g.color};">${g.title} <span class="category-count" style="background: ${g.badge};">${g.slugs.length}</span></h2>
                    <div class="articles-grid">
${cards}
                    </div>
                </div>

`;
}
if (missingH1.length) console.log('!! MISSING H1 (used slug fallback):', missingH1);

// ---- Insert after the "Услуги" category-section ----
const MARKER = `                        <a href="/ru/layf-kouch" class="article-card"><h3>Лайф коуч по денежному мышлению</h3></a>
                    </div>
                </div>`;
if (blogHtml0.includes('Programmatic service/geo/problem pages (internal-linking hub)')) {
  console.log('Already inserted — aborting to stay idempotent.');
  process.exit(0);
}
const idx = blogHtml0.indexOf(MARKER);
if (idx === -1) { console.error('MARKER NOT FOUND — aborting.'); process.exit(1); }
const insertAt = idx + MARKER.length;
let out = blogHtml0.slice(0, insertAt) + '\n' + blocks + blogHtml0.slice(insertAt);

// ---- Update article counter in meta (173 -> real article count) ----
const articleCount = allSlugs.filter(s => !['blog','ob-avtore','otzyvy','uslugi','kontakty'].includes(s)).length;
const niceCount = `Более ${Math.floor(articleCount / 10) * 10}`; // e.g. "Более 280"
out = out.replace(/173 статей/g, `${niceCount} статей`);

fs.writeFileSync(BLOG, out, 'utf8');
console.log(`\nInserted ${total} links across ${GROUPS.length} categories. Article counter -> "${niceCount} статей" (real: ${articleCount}).`);

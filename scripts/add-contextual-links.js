/**
 * add-contextual-links.js
 *
 * Adds a "Читайте также:" (Read also) block with 3-5 contextual links
 * to related pages within each article's body text.
 *
 * Usage:
 *   node scripts/add-contextual-links.js                  # dry-run on all pages
 *   node scripts/add-contextual-links.js --apply           # apply to all pages
 *   node scripts/add-contextual-links.js --file ru/psihologiya-deneg.html  # single file dry-run
 *   node scripts/add-contextual-links.js --file ru/psihologiya-deneg.html --apply  # single file apply
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RU_DIR = path.join(ROOT, 'ru');

// ── Topic Clusters ──────────────────────────────────────────────────────────
// Each page can appear in multiple clusters for cross-linking flexibility.
// The first cluster listed is the "primary" cluster.

const CLUSTERS = {
  fears: {
    label: 'Страхи',
    pages: [
      'strah-bednosti',
      'strah-uspeha',
      'strah-kritiki',
      'strah-osuzhdeniya',
      'strah-tratit-dengi',
      'strah-budushego',
      'strah-peremen',
      'strah-otkaza',
      'finansovaya-trevozhnost',
    ],
  },
  money: {
    label: 'Деньги',
    pages: [
      'denezhnye-bloki',
      'psihologiya-deneg',
      'otnoshenie-k-dengam',
      'energiya-deneg',
      'karma-deneg',
      'dengi-zlo',
      'kak-polyubit-dengi',
      'denezhnaya-energiya',
      'denezhnye-bloki-spisok',
      'denezhnye-bloki-v-tele',
      'denezhnyj-potolok',
      'kak-ubrat-denezhnye-bloki',
      'energeticheskie-bloki',
      'pochemu-ne-hvataet-deneg',
      'test-na-denezhnye-bloki',
    ],
  },
  mindset: {
    label: 'Мышление',
    pages: [
      'myshlenie-millionera',
      'myshlenie-rosta',
      'pozitivnoe-myshlenie',
      'pozitivnye-ubezhdeniya',
      'negativnye-ustanovki',
      'negativnye-mysli',
      'ogranichivayushie-ubezhdeniya',
      'finansovoe-myshlenie',
      'sila-mysli',
      'roditelskie-ustanovki',
    ],
  },
  relationships: {
    label: 'Отношения',
    pages: [
      'dengi-i-otnosheniya',
      'ssory-iz-za-deneg',
      'toksichnye-otnosheniya',
      'zhenshina-i-dengi',
      'dengi-i-lyubov',
      'dengi-v-otnosheniyah',
      'semeynye-scenarii',
    ],
  },
  practices: {
    label: 'Практики',
    pages: [
      'meditaciya-na-dengi',
      'affirmacii-na-dengi',
      'vizualizaciya-deneg',
      'mantry-na-dengi',
      'denezhnaya-meditaciya',
      'meditaciya-izobilie',
      'vizualizaciya-uspeha',
      'rabota-s-podsoznaniem',
    ],
  },
  income: {
    label: 'Доход',
    pages: [
      'uvelichit-dohod',
      'kak-razbogatet',
      'kak-stat-bogatym',
      'passivnyi-dohod',
      'dopolnitelnyi-dohod',
      'kak-stat-millionerom',
      'kak-uvelichit-dohod-psihologiya',
      'finansovyi-uspeh',
      'privlechenie-deneg',
      'kak-privlech-dengi',
      'put-k-bogatstvu',
      'privychki-bogatyh',
      'finansovaya-nezavisimost',
      'finansovaya-gramotnost',
      'finansovye-celi',
      'upravlenie-dengami',
      'lichnye-finansy',
      'kak-kopit-dengi',
    ],
  },
  shopping: {
    label: 'Психология покупок',
    pages: [
      'shopogolizm',
      'impulsivnye-pokupki',
      'emocionalnye-pokupki',
      'zavisimost-ot-pokupok',
      'kompulsivnye-pokupki',
      'emocionalnyj-golod',
      'chuvstvo-viny-za-dengi',
    ],
  },
  selfworth: {
    label: 'Самоценность',
    pages: [
      'cennost-sebya',
      'lyubov-k-sebe',
      'prinyatie-sebya',
      'uverennost-v-sebe',
      'sindrom-samozvanca',
      'vnutrenniy-kritik',
      'vnutrennij-kritik',
      'samosabotazh',
      'psihologicheskie-bariery',
    ],
  },
  family: {
    label: 'Родовые программы',
    pages: [
      'rodovye-programmy',
      'rodovye-travmy',
      'rabota-s-rodom',
      'sistemnye-rasstanovki',
      'roditelskie-ustanovki',
      'semeynye-scenarii',
    ],
  },
  services: {
    label: 'Услуги',
    pages: [
      'konsultaciya-psihologa',
      'kouching-onlayn',
      'layf-kouch',
    ],
  },
  emotional: {
    label: 'Эмоции и деньги',
    pages: [
      'depressiya-iz-za-deneg',
      'finansovaya-trevozhnost',
      'chuvstvo-viny-za-dengi',
      'strah-tratit-dengi',
    ],
  },
};

// Cross-cluster link suggestions: when a page is in cluster X, also consider
// linking to these "bridge" pages from other clusters for topical breadth.
const CROSS_LINKS = {
  'strah-bednosti': ['psihologiya-deneg', 'finansovaya-trevozhnost', 'denezhnye-bloki'],
  'strah-uspeha': ['samosabotazh', 'sindrom-samozvanca', 'myshlenie-rosta'],
  'strah-kritiki': ['uverennost-v-sebe', 'sindrom-samozvanca'],
  'strah-osuzhdeniya': ['prinyatie-sebya', 'cennost-sebya'],
  'strah-tratit-dengi': ['shopogolizm', 'otnoshenie-k-dengam', 'chuvstvo-viny-za-dengi'],
  'strah-budushego': ['finansovaya-trevozhnost', 'psihologiya-deneg'],
  'strah-peremen': ['myshlenie-rosta', 'samosabotazh'],
  'strah-otkaza': ['uverennost-v-sebe', 'cennost-sebya'],
  'psihologiya-deneg': ['denezhnye-bloki', 'otnoshenie-k-dengam', 'negativnye-ustanovki', 'strah-bednosti'],
  'denezhnye-bloki': ['psihologiya-deneg', 'kak-ubrat-denezhnye-bloki', 'denezhnye-bloki-spisok'],
  'meditaciya-na-dengi': ['affirmacii-na-dengi', 'vizualizaciya-deneg', 'denezhnaya-meditaciya', 'rabota-s-podsoznaniem'],
  'shopogolizm': ['impulsivnye-pokupki', 'emocionalnye-pokupki', 'zavisimost-ot-pokupok'],
  'uvelichit-dohod': ['kak-razbogatet', 'myshlenie-millionera', 'dopolnitelnyi-dohod'],
  'konsultaciya-psihologa': ['kouching-onlayn', 'denezhnye-bloki', 'psihologiya-deneg'],
  'kouching-onlayn': ['konsultaciya-psihologa', 'layf-kouch', 'myshlenie-rosta'],
};

// ── Helper functions ────────────────────────────────────────────────────────

/**
 * Extract the page title from the HTML <title> tag, cleaned up.
 */
function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  if (!match) return null;
  let title = match[1].trim();
  // Remove trailing site name variations
  title = title.replace(/\s*[\|–—]\s*(Денежный Водопад|Психолог Онлайн|Любовь Лукащук).*$/i, '');
  // Remove [Тест], [Гайд], [Чек-лист] etc. for cleaner link text
  title = title.replace(/\s*\[.*?\]\s*/g, '').trim();
  return title;
}

/**
 * Find all clusters that a page slug belongs to.
 */
function findClusters(slug) {
  const result = [];
  for (const [clusterName, cluster] of Object.entries(CLUSTERS)) {
    if (cluster.pages.includes(slug)) {
      result.push(clusterName);
    }
  }
  return result;
}

/**
 * Get the best 3-5 related page slugs for a given page.
 * Prioritizes: cross-links first, then same-cluster neighbors.
 */
function getRelatedPages(slug) {
  const related = new Set();

  // 1. Add explicit cross-links first (highest priority)
  if (CROSS_LINKS[slug]) {
    for (const crossSlug of CROSS_LINKS[slug]) {
      if (crossSlug !== slug) {
        related.add(crossSlug);
      }
    }
  }

  // 2. Add same-cluster neighbors
  const clusters = findClusters(slug);
  for (const clusterName of clusters) {
    const clusterPages = CLUSTERS[clusterName].pages;
    for (const pageSlug of clusterPages) {
      if (pageSlug !== slug) {
        related.add(pageSlug);
      }
    }
  }

  // 3. Convert to array and limit to 5
  const result = Array.from(related);

  // Prioritize: cross-links first, then cluster members
  const crossLinks = CROSS_LINKS[slug] || [];
  result.sort((a, b) => {
    const aIsCross = crossLinks.includes(a) ? 0 : 1;
    const bIsCross = crossLinks.includes(b) ? 0 : 1;
    return aIsCross - bIsCross;
  });

  return result.slice(0, 5);
}

/**
 * Build the title map: slug -> cleaned title
 */
function buildTitleMap() {
  const titleMap = {};
  const files = fs.readdirSync(RU_DIR).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const slug = file.replace('.html', '');
    const html = fs.readFileSync(path.join(RU_DIR, file), 'utf-8');
    const title = extractTitle(html);
    if (title) {
      titleMap[slug] = title;
    }
  }
  return titleMap;
}

/**
 * Generate the HTML block for "Читайте также".
 */
function generateRelatedBlock(relatedSlugs, titleMap) {
  const links = relatedSlugs
    .filter(slug => titleMap[slug]) // only include pages with known titles
    .map(slug => `        <li style="margin-bottom: 6px;"><a href="/ru/${slug}.html" style="color: #b8860b; text-decoration: none; font-size: 0.97rem; transition: color 0.2s;">${titleMap[slug]}</a></li>`)
    .join('\n');

  if (!links) return null;

  return `
    <div class="related-articles" style="background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.03) 100%); border-left: 4px solid #d4a017; border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 30px 0; font-family: inherit;">
      <p style="font-weight: 700; color: #b8860b; margin-bottom: 10px; font-size: 1rem;">Читайте также:</p>
      <ul style="list-style: none; padding: 0; margin: 0;">
${links}
      </ul>
    </div>`;
}

/**
 * Find the insertion point in the HTML:
 * After the first "real content" paragraph (80+ chars of text content)
 * that comes after the first H2 in the body.
 */
function findInsertionPoint(html) {
  const bodyMatch = html.match(/<body[^>]*>/i);
  const bodyStart = bodyMatch ? bodyMatch.index + bodyMatch[0].length : 0;

  const bodyHtml = html.substring(bodyStart);

  const h2Match = bodyHtml.match(/<h2[\s>]/i);
  if (!h2Match) return -1;

  const afterH2 = bodyStart + h2Match.index;

  const afterH2Html = html.substring(afterH2);
  const pCloseRegex = /<\/p>/gi;
  let pMatch;
  while ((pMatch = pCloseRegex.exec(afterH2Html)) !== null) {
    const beforeClose = afterH2Html.substring(0, pMatch.index);
    const lastPOpen = beforeClose.lastIndexOf('<p');
    if (lastPOpen === -1) continue;

    const pContent = afterH2Html.substring(lastPOpen, pMatch.index + pMatch[0].length);
    const textOnly = pContent.replace(/<[^>]*>/g, '').trim();

    if (textOnly.length >= 80) {
      return afterH2 + pMatch.index + pMatch[0].length;
    }
  }

  // Fallback: first closing p tag after h2
  const firstPClose = afterH2Html.match(/<\/p>/i);
  if (!firstPClose) return -1;
  return afterH2 + firstPClose.index + firstPClose[0].length;
}

/**
 * Process a single HTML file.
 * Returns { modified: boolean, diff: string, newHtml: string }
 */
function processFile(filePath, titleMap) {
  const slug = path.basename(filePath, '.html');
  const html = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has related-articles block
  if (html.includes('class="related-articles"')) {
    return { modified: false, diff: `[SKIP] ${slug}: already has related-articles block`, newHtml: html };
  }

  const relatedSlugs = getRelatedPages(slug);
  if (relatedSlugs.length === 0) {
    return { modified: false, diff: `[SKIP] ${slug}: no cluster found`, newHtml: html };
  }

  const block = generateRelatedBlock(relatedSlugs, titleMap);
  if (!block) {
    return { modified: false, diff: `[SKIP] ${slug}: could not generate block (missing titles)`, newHtml: html };
  }

  const insertPos = findInsertionPoint(html);
  if (insertPos === -1) {
    return { modified: false, diff: `[SKIP] ${slug}: could not find insertion point`, newHtml: html };
  }

  const newHtml = html.substring(0, insertPos) + '\n' + block + html.substring(insertPos);

  // Build a readable diff summary
  const context = html.substring(Math.max(0, insertPos - 80), insertPos).trim();
  const relatedTitles = relatedSlugs.filter(s => titleMap[s]).map(s => `  -> ${titleMap[s]} (/ru/${s}.html)`);
  const diff = [
    `[ADD] ${slug}:`,
    `  Insertion after: "...${context.slice(-60)}"`,
    `  Links (${relatedTitles.length}):`,
    ...relatedTitles,
  ].join('\n');

  return { modified: true, diff, newHtml };
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const fileArg = args.find((_, i) => args[i - 1] === '--file');

  console.log('=== Contextual Links Builder ===\n');
  console.log(`Mode: ${apply ? 'APPLY (will write files)' : 'DRY-RUN (preview only)'}\n`);

  // Build title map
  const titleMap = buildTitleMap();
  console.log(`Found ${Object.keys(titleMap).length} pages with titles.\n`);

  let files;
  if (fileArg) {
    const absPath = path.resolve(ROOT, fileArg);
    if (!fs.existsSync(absPath)) {
      console.error(`File not found: ${absPath}`);
      process.exit(1);
    }
    files = [absPath];
  } else {
    files = fs.readdirSync(RU_DIR)
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(RU_DIR, f));
  }

  let added = 0;
  let skipped = 0;

  for (const filePath of files) {
    const result = processFile(filePath, titleMap);
    console.log(result.diff);

    if (result.modified) {
      added++;
      if (apply) {
        fs.writeFileSync(filePath, result.newHtml, 'utf-8');
        console.log(`  -> WRITTEN\n`);
      } else {
        console.log(`  -> (dry-run, not written)\n`);
      }
    } else {
      skipped++;
      console.log('');
    }
  }

  console.log('─'.repeat(50));
  console.log(`Done! Added: ${added}, Skipped: ${skipped}, Total: ${files.length}`);
  if (!apply && added > 0) {
    console.log('\nRe-run with --apply to write changes to disk.');
  }
}

main();

/**
 * Removes .html extensions from all internal URLs in HTML files.
 * Targets: canonical, hreflang, og:url, twitter:url, all internal href/content attributes.
 * Also fixes author name in pages/index.html.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Files to process
const fileSets = [
  // All /ru/ pages
  ...fs.readdirSync(path.join(ROOT, 'ru'))
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(ROOT, 'ru', f)),
  // Legal pages
  path.join(ROOT, 'privacy.html'),
  path.join(ROOT, 'terms.html'),
  path.join(ROOT, 'disclaimer.html'),
  path.join(ROOT, 'cookie-policy.html'),
  // Pages index
  path.join(ROOT, 'pages', 'index.html'),
];

function removeHtmlFromFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Remove .html from absolute lyubovpsy.com URLs in href/content attributes
  //    Matches: href="https://lyubovpsy.com/path/page.html"
  content = content.replace(
    /(href|content)="(https:\/\/lyubovpsy\.com\/[^"]+?)\.html"/g,
    '$1="$2"'
  );

  // 2. Remove .html from internal absolute paths: href="/ru/page.html" or href="/privacy.html"
  //    But NOT href="/" (root) and NOT external URLs
  content = content.replace(
    /href="(\/[^"]+?)\.html"/g,
    'href="$1"'
  );

  // 3. Fix relative links in legal pages: href="privacy.html" → href="/privacy"
  content = content.replace(/href="privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="cookie-policy\.html"/g, 'href="/cookie-policy"');
  content = content.replace(/href="disclaimer\.html"/g, 'href="/disclaimer"');
  content = content.replace(/href="index\.html"/g, 'href="/"');

  // 4. Fix og:url and twitter:url meta content attributes
  //    Already handled by rule #1 above (content="https://lyubovpsy.com/...")

  // 5. Fix author name inconsistency in pages/index.html
  if (filePath.includes('pages') && filePath.endsWith('index.html')) {
    content = content.replace(
      /Любовь Золотова/g,
      'Любовь Лукащук'
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

let updated = 0;
let skipped = 0;

for (const filePath of fileSets) {
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filePath}`);
    skipped++;
    continue;
  }
  const changed = removeHtmlFromFile(filePath);
  if (changed) {
    console.log(`UPDATED: ${path.relative(ROOT, filePath)}`);
    updated++;
  } else {
    console.log(`no changes: ${path.relative(ROOT, filePath)}`);
    skipped++;
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped/unchanged: ${skipped}`);

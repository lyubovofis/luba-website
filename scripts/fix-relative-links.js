/**
 * Fixes remaining relative .html links:
 * 1. In /ru/ pages: href="page.html" → href="/ru/page" (relative without slash)
 * 2. In index.html: href="privacy.html" → href="/privacy"
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Luba Website';
const RU_DIR = path.join(ROOT, 'ru');

// Fix /ru/ pages: relative links like href="page.html" → href="/ru/page"
const ruFiles = fs.readdirSync(RU_DIR).filter(f => f.endsWith('.html'));
ruFiles.forEach(filename => {
  const filePath = path.join(RU_DIR, filename);
  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  // href="some-page.html" without leading slash → /ru/some-page
  c = c.replace(/href="([a-z][a-z0-9\-]+)\.html"/g, 'href="/ru/$1"');

  if (c !== original) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('UPDATED ru:', filename);
  }
});

// Fix index.html: relative legal links and /privacy.html style
const indexPath = path.join(ROOT, 'index.html');
let idx = fs.readFileSync(indexPath, 'utf8');
const idxOrig = idx;

idx = idx.replace(/href="privacy\.html"/g, 'href="/privacy"');
idx = idx.replace(/href="terms\.html"/g, 'href="/terms"');
idx = idx.replace(/href="cookie-policy\.html"/g, 'href="/cookie-policy"');
idx = idx.replace(/href="disclaimer\.html"/g, 'href="/disclaimer"');
idx = idx.replace(/href="\/privacy\.html"/g, 'href="/privacy"');
idx = idx.replace(/href="\/terms\.html"/g, 'href="/terms"');
idx = idx.replace(/href="\/cookie-policy\.html"/g, 'href="/cookie-policy"');
idx = idx.replace(/href="\/disclaimer\.html"/g, 'href="/disclaimer"');

if (idx !== idxOrig) {
  fs.writeFileSync(indexPath, idx, 'utf8');
  console.log('UPDATED: index.html');
}

console.log('Done.');

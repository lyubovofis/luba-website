/**
 * Fixes all remaining SEO issues across all /ru/ pages:
 * 1. Remove .html from JSON-LD "url" fields
 * 2. Fix broken relative navigation links (../../page.html -> /path)
 * 3. Fix favicon relative path
 * Also adds missing canonical + meta description to legal pages
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Luba Website';
const RU_DIR = path.join(ROOT, 'ru');

// === FIX ALL /ru/ PAGES ===
const ruFiles = fs.readdirSync(RU_DIR).filter(f => f.endsWith('.html'));

ruFiles.forEach(filename => {
  const filePath = path.join(RU_DIR, filename);
  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  // 1. Remove .html from JSON-LD "url" fields (schema markup)
  c = c.replace(/"url"\s*:\s*"(https:\/\/lyubovpsy\.com\/[^"]+?)\.html"/g, '"url": "$1"');

  // 2. Fix relative ../../ navigation links
  c = c.replace(/href="\.\.\/\.\.\/index\.html#about"/g, 'href="/#about"');
  c = c.replace(/href="\.\.\/\.\.\/index\.html#quiz"/g, 'href="/quiz/"');
  c = c.replace(/href="\.\.\/\.\.\/index\.html#contact"/g, 'href="/#contact"');
  c = c.replace(/href="\.\.\/\.\.\/index\.html"/g, 'href="/"');
  c = c.replace(/href="\.\.\/\.\.\/about\.html"/g, 'href="/#about"');
  c = c.replace(/href="\.\.\/\.\.\/contact\.html"/g, 'href="/#contact"');
  c = c.replace(/href="\.\.\/\.\.\/services\.html"/g, 'href="/"');
  c = c.replace(/href="\.\.\/\.\.\/quiz-gender-neutral\.html"/g, 'href="/quiz/"');

  // 3. Fix relative favicon path
  c = c.replace(/href="\.\.\/\.\.\/favicon\.ico"/g, 'href="/favicon.ico"');

  if (c !== original) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('UPDATED:', filename);
  }
});

// === FIX LEGAL PAGES: add missing canonical + meta description ===
const legalFixes = [
  {
    file: 'privacy.html',
    canonical: 'https://lyubovpsy.com/privacy',
    desc: 'Политика конфиденциальности сайта Любовь Лукащук — Денежный Водопад. Как мы обрабатываем и защищаем ваши персональные данные.',
  },
  {
    file: 'terms.html',
    canonical: 'https://lyubovpsy.com/terms',
    desc: 'Условия использования сайта Любовь Лукащук — Денежный Водопад. Правила работы с сайтом и программами.',
  },
];

legalFixes.forEach(({ file, canonical, desc }) => {
  const filePath = path.join(ROOT, file);
  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  // Add canonical if missing
  if (!c.includes('<link rel="canonical"')) {
    c = c.replace('</head>', `    <link rel="canonical" href="${canonical}">\n</head>`);
  }

  // Add meta description if missing
  if (!c.includes('<meta name="description"')) {
    c = c.replace('</head>', `    <meta name="description" content="${desc}">\n</head>`);
  }

  if (c !== original) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('UPDATED legal:', file);
  }
});

console.log('\nDone.');

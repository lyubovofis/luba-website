/**
 * Adds alt="" to tracking pixel <img> tags that are missing alt attribute.
 * These are Facebook/TikTok noscript tracking pixels (display:none, 1x1px).
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Luba Website';
const targets = [
  ...fs.readdirSync(path.join(ROOT, 'ru')).filter(f => f.endsWith('.html')).map(f => path.join(ROOT, 'ru', f)),
  path.join(ROOT, 'index.html'),
];

let updated = 0;
targets.forEach(filePath => {
  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  // Add alt="" to <img> tags missing alt (tracking pixels: height=1 width=1)
  // Pattern: <img ...> without alt attribute
  c = c.replace(/<img(\s[^>]*?)(\s*\/>|>)/g, (match, attrs, closing) => {
    if (/alt\s*=/i.test(attrs)) return match; // already has alt
    return `<img${attrs} alt=""${closing}`;
  });

  if (c !== original) {
    fs.writeFileSync(filePath, c, 'utf8');
    updated++;
  }
});

console.log('Updated:', updated, 'files');

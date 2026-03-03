const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Luba Website';
const RU_DIR = path.join(ROOT, 'ru');

const ruFiles = fs.readdirSync(RU_DIR).filter(f => f.endsWith('.html'));
const allFiles = [
  ...ruFiles.map(f => ({ file: path.join(RU_DIR, f), label: 'ru/' + f })),
  { file: path.join(ROOT, 'index.html'), label: 'index.html' },
  { file: path.join(ROOT, 'pages', 'index.html'), label: 'pages/index.html' },
  { file: path.join(ROOT, 'privacy.html'), label: 'privacy.html' },
  { file: path.join(ROOT, 'terms.html'), label: 'terms.html' },
];

const results = allFiles.map(({ file, label }) => {
  const c = fs.readFileSync(file, 'utf8');

  const titleMatch = c.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : null;

  const descMatch = c.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const desc = descMatch ? descMatch[1] : null;

  const h1s = c.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  const h1Text = h1s.map(h => h.replace(/<[^>]+>/g, '').trim());

  const canonical = (c.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];

  const noindex = /content="[^"]*noindex/.test(c);

  const schema = (c.match(/"@type"\s*:\s*"([^"]+)"/g) || []).map(s => s.match(/"([^"]+)"\s*$/)[1]);
  const uniqueSchema = [...new Set(schema)];

  const imgsMissingAlt = (c.match(/<img[^>]+>/gi) || []).filter(img => !img.includes('alt=')).length;

  // Check for .html in internal links (should be zero after our fix)
  const htmlLinks = (c.match(/href="[^"]+\.html"/g) || []).filter(h => !h.includes('connect.facebook') && !h.includes('google') && !h.includes('tiktok'));

  // Internal links count
  const internalLinks = (c.match(/href="\//g) || []).length;

  return { label, title, titleLen: title ? title.length : 0, desc, descLen: desc ? desc.length : 0, h1Count: h1s.length, h1Text: h1Text[0] || null, canonical, noindex, schema: uniqueSchema, imgsMissingAlt, htmlLinksRemaining: htmlLinks.length, internalLinks };
});

// === REPORT ===

console.log('\n=== TITLES ===');
const noTitle = results.filter(r => !r.title);
const longTitle = results.filter(r => r.titleLen > 65);
const shortTitle = results.filter(r => r.titleLen > 0 && r.titleLen < 40);
const titleTexts = results.map(r => r.title);
const dupeTitles = results.filter((r, i) => r.title && titleTexts.indexOf(r.title) !== i);
console.log('Missing:', noTitle.map(r => r.label).join(', ') || 'None');
console.log('Too long (>65):', longTitle.length, longTitle.slice(0, 5).map(r => r.label + ' (' + r.titleLen + ')').join(', '));
console.log('Too short (<40):', shortTitle.length, shortTitle.slice(0, 5).map(r => r.label + ' (' + r.titleLen + ')').join(', '));
console.log('Duplicates:', dupeTitles.map(r => r.label).join(', ') || 'None');

console.log('\n=== META DESCRIPTIONS ===');
const noDesc = results.filter(r => !r.desc);
const longDesc = results.filter(r => r.descLen > 165);
const shortDesc = results.filter(r => r.descLen > 0 && r.descLen < 120);
const descTexts = results.map(r => r.desc);
const dupeDescs = results.filter((r, i) => r.desc && descTexts.indexOf(r.desc) !== i);
console.log('Missing:', noDesc.map(r => r.label).join(', ') || 'None');
console.log('Too long (>165):', longDesc.length, longDesc.slice(0, 3).map(r => r.label + ' (' + r.descLen + ')').join(', '));
console.log('Too short (<120):', shortDesc.length, shortDesc.slice(0, 3).map(r => r.label + ' (' + r.descLen + ')').join(', '));
console.log('Duplicates:', dupeDescs.map(r => r.label).join(', ') || 'None');

console.log('\n=== H1 TAGS ===');
const noH1 = results.filter(r => r.h1Count === 0);
const multiH1 = results.filter(r => r.h1Count > 1);
console.log('No H1:', noH1.map(r => r.label).join(', ') || 'None');
console.log('Multiple H1:', multiH1.map(r => r.label + '(' + r.h1Count + ')').join(', ') || 'None');

console.log('\n=== CANONICAL ===');
const noCanonical = results.filter(r => !r.canonical);
const htmlCanonical = results.filter(r => r.canonical && r.canonical.includes('.html'));
console.log('Missing:', noCanonical.map(r => r.label).join(', ') || 'None');
console.log('Still has .html:', htmlCanonical.map(r => r.label).join(', ') || 'None');

console.log('\n=== NOINDEX ===');
const noindexPages = results.filter(r => r.noindex);
console.log('Noindex pages:', noindexPages.map(r => r.label).join(', ') || 'None');

console.log('\n=== SCHEMA ===');
const noSchema = results.filter(r => r.schema.length === 0);
console.log('No schema:', noSchema.map(r => r.label).join(', ') || 'None');
// Sample 3 pages
results.slice(0, 3).forEach(r => console.log(' ', r.label, '->', r.schema.join(', ')));

console.log('\n=== IMAGES ===');
const imgIssues = results.filter(r => r.imgsMissingAlt > 0);
console.log('Images missing alt:', imgIssues.length > 0 ? imgIssues.map(r => r.label + '(' + r.imgsMissingAlt + ')').join(', ') : 'None');

console.log('\n=== RESIDUAL .HTML LINKS ===');
const htmlLinkIssues = results.filter(r => r.htmlLinksRemaining > 0);
console.log('Pages with .html in links:', htmlLinkIssues.length > 0 ? htmlLinkIssues.map(r => r.label + '(' + r.htmlLinksRemaining + ')').join(', ') : 'None');

console.log('\n=== INTERNAL LINKING (top pages) ===');
const sortedByLinks = [...results].sort((a, b) => b.internalLinks - a.internalLinks);
console.log('Most linked pages (internal href count):');
sortedByLinks.slice(0, 5).forEach(r => console.log(' ', r.label, '->', r.internalLinks));
const lowLinks = results.filter(r => r.internalLinks < 5 && r.label.startsWith('ru/'));
console.log('Low internal links (<5):', lowLinks.length, lowLinks.slice(0, 5).map(r => r.label).join(', '));

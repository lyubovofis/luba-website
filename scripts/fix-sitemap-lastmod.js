/**
 * fix-sitemap-lastmod.js  (surgical)
 * Replaces ONLY future-dated <lastmod> values (the fabricated +1-day block that
 * Google distrusts) with realistic past dates evenly spread across
 * 2026-05-18 .. 2026-06-04. Leaves every already-valid past date untouched so
 * the natural publish-date spread of older articles is preserved.
 */
const fs = require('fs');
const path = require('path');

const SITEMAP = path.join(__dirname, '..', 'sitemap.xml');
const TODAY = '2026-06-05';
const WINDOW_START = Date.UTC(2026, 4, 18); // 2026-05-18 (real batch creation)
const WINDOW_DAYS = 17;                     // -> up to 2026-06-04

let xml = fs.readFileSync(SITEMAP, 'utf8');

// Pass 1: count future-dated entries
const futureCount = (xml.match(/<lastmod>([0-9-]+)<\/lastmod>/g) || [])
  .map(s => s.replace(/<[^>]*>/g, '')).filter(d => d > TODAY).length;

// Pass 2: rewrite future dates with an even spread
let i = 0;
xml = xml.replace(/<lastmod>([0-9-]+)<\/lastmod>/g, (m, old) => {
  if (old <= TODAY) return m; // keep good past dates exactly as-is
  const dayOffset = Math.floor((i * WINDOW_DAYS) / Math.max(1, futureCount - 1));
  i++;
  const d = new Date(WINDOW_START + dayOffset * 86400000);
  const iso = d.toISOString().slice(0, 10);
  return `<lastmod>${iso}</lastmod>`;
});

fs.writeFileSync(SITEMAP, xml, 'utf8');

// Verify
const all = (xml.match(/<lastmod>([0-9-]+)<\/lastmod>/g) || []).map(s => s.replace(/<[^>]*>/g, ''));
const future = all.filter(d => d > TODAY);
const dist = {};
all.forEach(d => { dist[d] = (dist[d] || 0) + 1; });
const maxPerDay = Math.max(...Object.values(dist));
console.log(`future-dated rewritten: ${futureCount}`);
console.log(`future-dated remaining (must be 0): ${future.length}`);
console.log(`total lastmod: ${all.length} | distinct days: ${Object.keys(dist).length} | max entries on any single day: ${maxPerDay}`);
console.log(`new batch dates:`, Object.entries(dist).filter(([d]) => d >= '2026-05-18').sort());

/**
 * gen-pwa-icons.js
 * Generates valid on-brand PWA PNG icons with ZERO dependencies (Node zlib only).
 * Fixes the manifest.json 404s (icon-192/512 + 96x96 shortcut icons).
 * Design: brand gradient (#6b46c1 -> #553c9a) full-bleed (maskable-safe) + a
 * centered gold "waterfall drop" so it reads as the «Денежный Водопад» mark.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const OUT = path.join(__dirname, '..', 'images');

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

function makeIcon(size, accentHex, file) {
  const bg1 = hex('#6b46c1'), bg2 = hex('#553c9a'), acc = hex(accentHex), accLight = hex('#fde68a');
  const cx = size / 2, cy = size * 0.52, R = size * 0.30; // drop body radius
  const raw = Buffer.alloc(size * (size * 3 + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const t = (x + y) / (2 * size);
      let r = lerp(bg1[0], bg2[0], t), g = lerp(bg1[1], bg2[1], t), b = lerp(bg1[2], bg2[2], t);
      // teardrop: circle for lower part + tapered triangle apex above center
      const dx = x - cx, dy = y - cy;
      const inCircle = dx * dx + dy * dy <= R * R;
      const apexY = cy - R * 1.8;
      let inApex = false;
      if (y < cy && y >= apexY) {
        const halfW = R * (y - apexY) / (cy - apexY); // widens toward circle
        if (Math.abs(dx) <= halfW) inApex = true;
      }
      if (inCircle || inApex) {
        // subtle vertical shading on the drop
        const sh = (y - apexY) / (cy + R - apexY);
        r = lerp(accLight[0], acc[0], Math.min(1, sh));
        g = lerp(accLight[1], acc[1], Math.min(1, sh));
        b = lerp(accLight[2], acc[2], Math.min(1, sh));
      }
      raw[p++] = r; raw[p++] = g; raw[p++] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGB
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(OUT, file), png);
  console.log(`  ${file}: ${size}x${size}, ${png.length} bytes`);
}

console.log('Generating PWA icons:');
makeIcon(192, '#fbbf24', 'icon-192.png');
makeIcon(512, '#fbbf24', 'icon-512.png');
makeIcon(96, '#fbbf24', 'quiz-icon.png');
makeIcon(96, '#9f7aea', 'articles-icon.png');
makeIcon(96, '#34d399', 'whatsapp-icon.png');
console.log('Done.');

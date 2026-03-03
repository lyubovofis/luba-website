const fs = require('fs');
const c = fs.readFileSync('C:\\Luba Website\\ru\\affirmacii-na-dengi.html', 'utf8');
const imgs = (c.match(/<img[^>]+>/gi) || []);
const noAlt = imgs.filter(img => !(/alt\s*=/i.test(img)));
console.log('Total imgs:', imgs.length);
console.log('No alt:', noAlt.length);
if (noAlt.length) {
  noAlt.forEach(img => console.log(img.substring(0, 200)));
}

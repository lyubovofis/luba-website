const fs = require('fs');

const files = [
  'ru/emocionalnyj-golod.html',
  'ru/myshlenie-rosta.html',
  'ru/toksichnye-otnosheniya.html',
  'ru/vnutrennij-kritik.html',
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');

  // Fix wrong domain lubazolotova.com -> lyubovpsy.com
  c = c.replace(/www\.lubazolotova\.com/g, 'lyubovpsy.com');
  c = c.replace(/lubazolotova\.com/g, 'lyubovpsy.com');

  // Remove .html from lyubovpsy.com absolute URLs
  c = c.replace(/(href|content)="(https:\/\/lyubovpsy\.com\/[^"]+?)\.html"/g, '$1="$2"');

  // Remove .html from internal /path links
  c = c.replace(/href="(\/[^"]+?)\.html"/g, 'href="$1"');

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed:', f);
});

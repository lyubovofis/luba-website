const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

console.log('📦 Создаем ZIP для Netlify...\n');

const output = fs.createWriteStream('luba-website-deploy.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(`✅ ZIP создан: ${archive.pointer()} байт`);
    console.log('\n📁 Файл: luba-website-deploy.zip');
    console.log('\n🚀 Загрузите его на Netlify:');
    console.log('   https://app.netlify.com/drop');
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);

// Добавляем нужные файлы
const include = [
    'index.html',
    'privacy.html',
    'terms.html',
    'disclaimer.html',
    'cookie-policy.html',
    'netlify.toml',
    'quiz-test/**/*',
    'quiz-a/**/*',
    'quiz-b/**/*',
    'quiz-c/**/*',
    'quiz-a-uk/**/*',
    'quiz-b-uk/**/*',
    'quiz-c-uk/**/*',
    'quiz/**/*',
    'crm/**/*',
    'components/**/*',
    'js/**/*',
    'css/**/*',
    'images/**/*'
];

include.forEach(pattern => {
    if (pattern.includes('**')) {
        const dir = pattern.replace('/**/*', '');
        if (fs.existsSync(dir)) {
            archive.directory(dir, dir);
            console.log(`✅ ${dir}/`);
        }
    } else {
        if (fs.existsSync(pattern)) {
            archive.file(pattern, { name: pattern });
            console.log(`✅ ${pattern}`);
        }
    }
});

console.log('\n🔄 Архивируем...');
archive.finalize();

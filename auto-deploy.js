const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('\n🚀 АВТОМАТИЧНИЙ ДЕПЛОЙ НА GITHUB\n');

// Читаємо .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
    console.error('❌ Файл .env.local не знайдено!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const token = envContent.match(/GITHUB_TOKEN=(.+)/)?.[1]?.trim();
const repo = envContent.match(/GITHUB_REPO=(.+)/)?.[1]?.trim() || 'lyubovofis/luba-website';

if (!token || token === 'your_new_token_here') {
    console.error('❌ Токен не знайдено в .env.local!');
    console.log('Додайте токен в файл .env.local');
    process.exit(1);
}

try {
    console.log('📦 [1/3] Додаємо файли...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('\n💾 [2/3] Створюємо commit...');
    const commitMsg = process.argv[2] || 'Fix CRM: archive and notifications';
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
    
    console.log('\n🌐 [3/3] Пушимо на GitHub...');
    const remoteUrl = `https://${token}@github.com/${repo}.git`;
    execSync(`git push ${remoteUrl} main`, { stdio: 'inherit' });
    
    console.log('\n✅ ДЕПЛОЙ УСПІШНИЙ!');
    console.log('\n📍 Vercel автоматично задеплоїть через 1-2 хвилини');
    console.log('🔗 Перевірте: https://lyubovpsy.com\n');
    
} catch (error) {
    console.error('\n❌ Помилка деплою:', error.message);
    process.exit(1);
}

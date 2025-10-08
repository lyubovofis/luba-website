const fs = require('fs');
const path = require('path');

// Telegram username
const TELEGRAM = '@LyubovUA';
const TELEGRAM_URL = 'https://t.me/LyubovUA';

// Files to update
const files = [
    'index.html',
    'components/header.html',
    'components/footer.html',
    'privacy.html',
    'disclaimer.html',
    'quiz-test/index.html'
];

console.log('🚀 Adding Telegram buttons everywhere...\n');

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} - NOT FOUND, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Pattern 1: Single WhatsApp button/link - add Telegram next to it
    // Example: <a href="...wa.me..." class="btn">WhatsApp</a>
    const singleButtonPattern = /(<a[^>]*href="https:\/\/wa\.me\/34654420334[^"]*"[^>]*>.*?WhatsApp.*?<\/a>)/gi;
    
    content = content.replace(singleButtonPattern, (match) => {
        // Check if Telegram already exists nearby
        const context = content.substring(
            Math.max(0, content.indexOf(match) - 500),
            Math.min(content.length, content.indexOf(match) + match.length + 500)
        );
        
        if (context.includes('t.me/LyubovUA') || context.includes('Telegram')) {
            return match; // Already has Telegram
        }
        
        changes++;
        
        // Detect if it's a styled button
        if (match.includes('class="btn') || match.includes('class="nav-cta')) {
            const telegramBtn = match
                .replace(/wa\.me\/34654420334/g, 't.me/LyubovUA')
                .replace(/WhatsApp/g, 'Telegram')
                .replace(/#25D366/g, '#0088cc')
                .replace(/💬/g, '✈️');
            
            return `${match}\n                ${telegramBtn}`;
        }
        
        // Simple link
        return `${match} | <a href="${TELEGRAM_URL}">Telegram</a>`;
    });
    
    if (changes > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${file} - ${changes} Telegram buttons added`);
    } else {
        console.log(`ℹ️  ${file} - Already has Telegram or no WhatsApp links`);
    }
});

console.log('\n✅ Done! Telegram buttons added everywhere.');

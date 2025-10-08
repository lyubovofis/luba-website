const fs = require('fs');

// Files to update
const files = [
    'index.html',
    'quiz-test/index.html', 
    'components/header.html',
    'components/footer.html',
    'privacy.html',
    'disclaimer.html'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Add Telegram link to footer if not exists
        if (content.includes('wa.me/34654420334') && !content.includes('t.me/LyubovUA')) {
            console.log(`\n📝 Processing: ${file}`);
            console.log(`   Found WhatsApp links, checking for Telegram...`);
            
            if (!content.includes('t.me/LyubovUA')) {
                console.log(`   ✅ Need to add Telegram`);
            } else {
                console.log(`   ⏭️  Telegram already exists`);
            }
        }
    } catch (error) {
        console.log(`❌ Error reading ${file}:`, error.message);
    }
});

console.log('\n✅ Analysis complete!');
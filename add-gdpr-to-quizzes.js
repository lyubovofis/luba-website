// Додати GDPR banner на всі квізи
const fs = require('fs');
const path = require('path');

const quizFolders = [
    'quiz-test',
    'quiz-a', 
    'quiz-a-uk',
    'quiz-b',
    'quiz-b-uk', 
    'quiz-c',
    'quiz-c-uk'
];

const gdprScript = `
<!-- GDPR Cookie Banner -->
<script>
    fetch('/components/gdpr-banner.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        });
</script>
`;

let updated = 0;

quizFolders.forEach(folder => {
    const filePath = path.join(__dirname, folder, 'index.html');
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Перевіряємо чи вже є GDPR
        if (!content.includes('gdpr-banner.html')) {
            // Додаємо перед </body>
            content = content.replace('</body>', `${gdprScript}\n</body>`);
            fs.writeFileSync(filePath, content);
            console.log(`✅ ${folder}/index.html - GDPR додано`);
            updated++;
        } else {
            console.log(`⏭️  ${folder}/index.html - вже є GDPR`);
        }
    } else {
        console.log(`❌ ${folder}/index.html - файл не знайдено`);
    }
});

console.log(`\n✅ Оновлено ${updated} квізів`);

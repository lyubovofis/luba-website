const fs = require('fs');

const neutralTexts = {
    // Titles - gender neutral
    'quiz-a': {
        ru: { title: '84% людей застряли на одном уровне дохода', subtitle: 'А вы? Узнайте свой денежный блок за 2 минуты' },
        uk: { title: '84% людей застрягли на одному рівні доходу', subtitle: 'А ви? Дізнайтеся свій грошовий блок за 2 хвилини' }
    },
    'quiz-b': {
        ru: { title: 'Почему деньги не приходят?', subtitle: 'Пройдите тест и узнайте, что блокирует ваше изобилие' },
        uk: { title: 'Чому гроші не приходять?', subtitle: 'Пройдіть тест і дізнайтеся, що блокує ваш достаток' }
    },
    'quiz-c': {
        ru: { title: '€2000 уже 3 года? Давайте изменим это', subtitle: 'Тест покажет, что мешает зарабатывать больше' },
        uk: { title: '€2000 вже 3 роки? Давайте змінимо це', subtitle: 'Тест покаже, що заважає заробляти більше' }
    }
};

// Update titles
Object.entries(neutralTexts).forEach(([quiz, langs]) => {
    // Russian version
    const ruFile = `${quiz}/index.html`;
    let ruContent = fs.readFileSync(ruFile, 'utf8');
    
    ruContent = ruContent.replace(
        /<h2 style="font-size: 28px.*?<\/h2>/s,
        `<h2 style="font-size: 28px; margin-bottom: 8px; line-height: 1.3;">${langs.ru.title}</h2>`
    );
    
    ruContent = ruContent.replace(
        /<div class="question-subtitle" style="font-size: 18px.*?<\/div>/,
        `<div class="question-subtitle" style="font-size: 18px; margin-bottom: 24px; color: #667eea; font-weight: 600;">${langs.ru.subtitle}</div>`
    );
    
    fs.writeFileSync(ruFile, ruContent);
    console.log(`✅ ${quiz} (RU)`);
    
    // Ukrainian version
    const ukFile = `${quiz}-uk/index.html`;
    let ukContent = fs.readFileSync(ukFile, 'utf8');
    
    ukContent = ukContent.replace(
        /<h2 style="font-size: 28px.*?<\/h2>/s,
        `<h2 style="font-size: 28px; margin-bottom: 8px; line-height: 1.3;">${langs.uk.title}</h2>`
    );
    
    ukContent = ukContent.replace(
        /<div class="question-subtitle" style="font-size: 18px.*?<\/div>/,
        `<div class="question-subtitle" style="font-size: 18px; margin-bottom: 24px; color: #667eea; font-weight: 600;">${langs.uk.subtitle}</div>`
    );
    
    fs.writeFileSync(ukFile, ukContent);
    console.log(`✅ ${quiz}-uk (UK)`);
});

console.log('\n✅ All texts gender-neutralized!');

const fs = require('fs');
const path = require('path');

const versions = {
    'quiz-a': { lang: 'ru', title: '84% женщин застряли на одном уровне дохода', subtitle: 'А вы? Узнайте свой денежный блок за 2 минуты' },
    'quiz-b': { lang: 'ru', title: 'Почему деньги не приходят?', subtitle: 'Пройдите тест и узнайте, что блокирует ваше изобилие' },
    'quiz-c': { lang: 'ru', title: '€2000 уже 3 года? Давайте изменим это', subtitle: 'Тест покажет, что мешает зарабатывать больше' },
    'quiz-a-uk': { lang: 'uk', title: '84% жінок застрягли на одному рівні доходу', subtitle: 'А ви? Дізнайтеся свій грошовий блок за 2 хвилини', version: 'a-uk' },
    'quiz-b-uk': { lang: 'uk', title: 'Чому гроші не приходять?', subtitle: 'Пройдіть тест і дізнайтеся, що блокує ваш достаток', version: 'b-uk' },
    'quiz-c-uk': { lang: 'uk', title: '€2000 вже 3 роки? Давайте змінимо це', subtitle: 'Тест покаже, що заважає заробляти більше', version: 'c-uk' }
};

Object.entries(versions).forEach(([folder, config]) => {
    const file = path.join(__dirname, folder, 'index.html');
    let content = fs.readFileSync(file, 'utf8');
    
    // Update title and subtitle
    content = content.replace(
        /<h2 style="font-size: 28px.*?<\/h2>/s,
        `<h2 style="font-size: 28px; margin-bottom: 8px; line-height: 1.3;">${config.title}</h2>`
    );
    
    content = content.replace(
        /<div class="question-subtitle" style="font-size: 18px.*?<\/div>/,
        `<div class="question-subtitle" style="font-size: 18px; margin-bottom: 24px; color: #667eea; font-weight: 600;">${config.subtitle}</div>`
    );
    
    // Update quiz_version
    const version = config.version || folder.replace('quiz-', '');
    content = content.replace(/quiz_version: ['"][^'"]+['"]/, `quiz_version: '${version}'`);
    
    fs.writeFileSync(file, content);
    console.log(`✅ Updated ${folder}`);
});

console.log('\n✅ All versions updated!');

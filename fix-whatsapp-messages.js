const fs = require('fs');

const folders = ['quiz-a', 'quiz-b', 'quiz-c', 'quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'];

folders.forEach(folder => {
    const file = `${folder}/index.html`;
    let content = fs.readFileSync(file, 'utf8');
    
    // Update Russian message
    content = content.replace(
        /const message = `Здравствуйте! Я прошла тест/g,
        "const message = `Здравствуйте! Я прошёл(ла) тест"
    );
    
    // Update Ukrainian message (if exists)
    content = content.replace(
        /const message = `Вітаю! Я пройшла тест/g,
        "const message = `Вітаю! Я пройшов(ла) тест"
    );
    
    // Update phone number - keep Spain number
    content = content.replace(
        /https:\/\/wa\.me\/380507260235/g,
        'https://wa.me/34654420334'
    );
    
    fs.writeFileSync(file, content);
    console.log(`✅ ${folder}`);
});

console.log('\n✅ All WhatsApp messages updated!');

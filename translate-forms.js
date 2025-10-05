const fs = require('fs');
const path = require('path');

const ukFolders = ['quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'];

// Переклади форм
const formTranslations = {
    'Последний шаг до вашего денежного кода': 'Останній крок до вашого грошового коду',
    'Куда отправить ваш персональный план на 7 дней?': 'Куди надіслати ваш персональний план на 7 днів?',
    'Ваше имя': 'Ваше ім\'я',
    'Как к вам обращаться': 'Як до вас звертатися',
    'WhatsApp для связи': 'WhatsApp для зв\'язку',
    'Email (необязательно)': 'Email (необов\'язково)',
    'Получить мой денежный код →': 'Отримати мій грошовий код →'
};

// Переклади помилок валідації
const errorTranslations = {
    'Введите ваше имя (минимум 2 буквы)': 'Введіть ваше ім\'я (мінімум 2 літери)',
    'Пожалуйста, введите настоящее имя': 'Будь ласка, введіть справжнє ім\'я',
    'Введите номер телефона (минимум 10 цифр)': 'Введіть номер телефону (мінімум 10 цифр)',
    'Номер должен начинаться с + (например: +380501234567)': 'Номер повинен починатися з + (наприклад: +380501234567)',
    'Пожалуйста, введите настоящий номер телефона': 'Будь ласка, введіть справжній номер телефону'
};

ukFolders.forEach(folder => {
    const filePath = path.join(__dirname, folder, 'index.html');
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace form texts
        Object.entries(formTranslations).forEach(([ru, uk]) => {
            content = content.replace(new RegExp(ru, 'g'), uk);
        });
        
        // Replace error messages
        Object.entries(errorTranslations).forEach(([ru, uk]) => {
            content = content.replace(new RegExp(escapeRegex(ru), 'g'), uk);
        });
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Translated form in ${folder}`);
    }
});

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log('\n✅ All Ukrainian forms translated!');

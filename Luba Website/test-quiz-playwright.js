// Тест квиза с Playwright
const { chromium } = require('playwright');

async function testQuiz() {
    console.log('🚀 Запуск теста квиза...\n');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. Открываем квиз
        console.log('1️⃣ Открываем квиз...');
        await page.goto('http://localhost:8080/quiz-test/');
        await page.waitForLoadState('networkidle');
        console.log('✅ Квиз загружен\n');
        
        // 2. Проверяем заголовок
        const title = await page.textContent('h1');
        console.log(`2️⃣ Заголовок: ${title}`);
        console.log('✅ Заголовок найден\n');
        
        // 3. Отвечаем на вопрос 1
        console.log('3️⃣ Отвечаем на вопрос 1...');
        await page.click('.option-card[data-step="1"][data-value="fear"]');
        await page.waitForTimeout(500);
        
        // Проверяем что кнопка активна
        const btn1Disabled = await page.isDisabled('#btn1');

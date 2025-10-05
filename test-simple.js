const { chromium } = require('playwright');

async function testQuiz() {
    console.log('🚀 Тест квиза запущен\n');
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:8000/quiz-test/');
        console.log('✅ Страница загружена\n');
        await page.waitForTimeout(2000);
        
        console.log('Клик на первый вопрос...');
        await page.click('.option-card[data-step="1"]');
        await page.waitForTimeout(500);
        await page.click('#btn1');
        await page.waitForTimeout(1000);
        console.log('✅ Вопрос 1\n');
        
        await page.click('.option-card[data-step="2"]');
        await page.waitForTimeout(500);
        await page.click('#btn2');
        console.log('✅ Вопрос 2\n');
        
        await page.waitForTimeout(20000);
        
    } catch (e) {
        console.error('❌', e.message);
    }
    await browser.close();
}

testQuiz();

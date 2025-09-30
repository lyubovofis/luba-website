const { chromium } = require('playwright');

async function testMainQuiz() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://lyubovpsy.com/quiz/', { waitUntil: 'load' });
        await page.waitForSelector('.option-card', { timeout: 10000 });
        
        console.log('Quiz loaded');
        
        const firstOption = page.locator('.option-card').first();
        await firstOption.click();
        await page.waitForTimeout(1000);
        
        const isActive = await firstOption.evaluate(el => el.classList.contains('active'));
        console.log(`Main quiz buttons work: ${isActive ? '✅ YES' : '❌ NO'}`);
        
        await page.screenshot({ path: 'test-results/main-quiz-test.png' });
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

testMainQuiz();

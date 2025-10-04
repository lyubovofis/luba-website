const { chromium } = require('playwright');

async function testLiveQuizComplete() {
    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();
    
    try {
        console.log('🧪 Testing live quiz...\n');
        
        // Go to quiz
        await page.goto('https://lyubovpsy.com/quiz-a/');
        await page.waitForSelector('.option-card', { timeout: 10000 });
        console.log('✅ Quiz loaded');
        
        // Step 1
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        const active1 = await page.locator('.option-card').first().evaluate(el => el.classList.contains('active'));
        console.log(`Step 1 - Click: ${active1 ? '✅' : '❌'}`);
        
        if (!active1) throw new Error('Step 1 failed');
        
        await page.locator('#btn1').click();
        await page.waitForTimeout(1000);
        
        // Step 2
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn2').click();
        await page.waitForTimeout(1000);
        console.log('✅ Step 2');
        
        // Step 3
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn3').click();
        await page.waitForTimeout(1000);
        console.log('✅ Step 3');
        
        // Step 4
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn4').click();
        await page.waitForTimeout(1000);
        console.log('✅ Step 4');
        
        // Step 5 - Income
        await page.fill('#currentIncome', '2000');
        await page.fill('#desiredIncome', '5000');
        await page.waitForTimeout(500);
        await page.locator('#btn5').click();
        await page.waitForTimeout(1000);
        console.log('✅ Step 5');
        
        // Step 6
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn6').click();
        await page.waitForTimeout(1000);
        console.log('✅ Step 6');
        
        // Step 7
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn7').click();
        await page.waitForTimeout(1000);
        console.log('✅ Step 7');
        
        // Form
        await page.fill('#name', 'Playwright Test');
        await page.fill('#whatsapp', '+380501234567');
        await page.waitForTimeout(500);
        console.log('✅ Form filled');
        
        await page.screenshot({ path: 'test-results/quiz-final.png' });
        
        console.log('\n✅ ALL TESTS PASSED!\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        await page.screenshot({ path: 'test-results/quiz-failed.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

testLiveQuizComplete();

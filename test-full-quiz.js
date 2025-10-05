const { chromium } = require('playwright');

async function fullQuizTest() {
    console.log('🧪 FULL QUIZ TEST\n');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    
    try {
        // Test router
        console.log('1️⃣ Testing router...');
        await page.goto('https://lyubovpsy.com/quiz-test/', { waitUntil: 'load' });
        await page.waitForTimeout(2000);
        
        const url = page.url();
        const isRedirected = url.includes('/quiz-');
        console.log(`   Router: ${isRedirected ? '✅' : '❌'} → ${url}`);
        
        if (!isRedirected) throw new Error('Router not working');
        
        // Test quiz loads
        console.log('\n2️⃣ Testing quiz loads...');
        await page.waitForSelector('.option-card', { timeout: 10000 });
        const title = await page.locator('h2').first().textContent();
        console.log(`   Title: ${title.substring(0, 50)}...`);
        
        // Test Step 1: Click option
        console.log('\n3️⃣ Testing Step 1 - Options...');
        const firstOption = page.locator('.option-card').first();
        await firstOption.click();
        await page.waitForTimeout(500);
        
        const isActive = await firstOption.evaluate(el => el.classList.contains('active'));
        console.log(`   Option click: ${isActive ? '✅' : '❌'}`);
        
        if (!isActive) throw new Error('Options not clickable');
        
        const nextBtn = page.locator('#btn1');
        const isEnabled = await nextBtn.isEnabled();
        console.log(`   Next button: ${isEnabled ? '✅' : '❌'}`);
        
        // Continue through quiz
        await nextBtn.click();
        await page.waitForTimeout(1000);
        
        console.log('\n4️⃣ Testing Step 2...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn2').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Step 2 complete');
        
        console.log('\n5️⃣ Testing Step 3...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn3').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Step 3 complete');
        
        console.log('\n6️⃣ Testing Step 4...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn4').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Step 4 complete');
        
        console.log('\n7️⃣ Testing Step 5 - Income...');
        await page.fill('#currentIncome', '2000');
        await page.fill('#desiredIncome', '5000');
        await page.waitForTimeout(500);
        await page.locator('#btn5').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Step 5 complete');
        
        console.log('\n8️⃣ Testing Step 6...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn6').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Step 6 complete');
        
        console.log('\n9️⃣ Testing Step 7...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn7').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Step 7 complete');
        
        console.log('\n🔟 Testing Contact Form...');
        await page.fill('#name', 'Тест Пользователь');
        await page.fill('#whatsapp', '+380501234567');
        await page.waitForTimeout(500);
        console.log('   ✅ Form filled');
        
        await page.screenshot({ path: 'test-results/quiz-final-form.png' });
        
        console.log('\n✅ ALL TESTS PASSED!\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        await page.screenshot({ path: 'test-results/quiz-test-error.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

fullQuizTest().catch(console.error);

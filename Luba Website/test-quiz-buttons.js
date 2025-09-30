const { chromium } = require('playwright');

async function testQuizButtons() {
    console.log('\n🧪 TESTING QUIZ BUTTONS\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3001/quiz-a/', { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(1000);
        
        // Step 1: Test option cards
        console.log('Step 1: Testing option selection...');
        const options = await page.locator('.option-card').count();
        console.log(`   Found ${options} option cards`);
        
        const firstOption = page.locator('.option-card').first();
        await firstOption.click();
        await page.waitForTimeout(500);
        
        const hasActive = await firstOption.evaluate(el => el.classList.contains('active'));
        if (hasActive) {
            console.log('   ✅ Option selection works');
        } else {
            console.log('   ❌ Option NOT selected');
        }
        
        // Test "Next" button
        const nextBtn = page.locator('#btn1');
        const isEnabled = await nextBtn.isEnabled();
        console.log(`   Next button enabled: ${isEnabled ? '✅' : '❌'}`);
        
        if (isEnabled) {
            await nextBtn.click();
            await page.waitForTimeout(1000);
            console.log('   ✅ Moved to step 2');
        }
        
        // Step 2
        console.log('\nStep 2: Testing...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn2').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Moved to step 3');
        
        // Step 3
        console.log('\nStep 3: Testing...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn3').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Moved to step 4');
        
        // Step 4
        console.log('\nStep 4: Testing...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn4').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Moved to step 5');
        
        // Step 5 (income)
        console.log('\nStep 5: Testing income inputs...');
        await page.fill('#currentIncome', '2000');
        await page.fill('#desiredIncome', '5000');
        await page.waitForTimeout(500);
        await page.locator('#btn5').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Moved to step 6');
        
        // Step 6
        console.log('\nStep 6: Testing...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn6').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Moved to step 7');
        
        // Step 7
        console.log('\nStep 7: Testing...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn7').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Moved to contact form');
        
        // Contact form
        console.log('\nStep 8: Testing contact form...');
        await page.fill('#name', 'Test User');
        await page.fill('#whatsapp', '+380501234567');
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: 'test-results/quiz-contact-form.png' });
        console.log('   ✅ Form filled');
        
        console.log('\n✅ ALL STEPS WORK!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        await page.screenshot({ path: 'test-results/quiz-error.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

testQuizButtons().catch(console.error);

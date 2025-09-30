const { chromium } = require('playwright');

async function testLiveQuiz() {
    console.log('🧪 Testing LIVE quiz...\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://lyubovpsy.com/quiz-test/', { waitUntil: 'load', timeout: 60000 });
        console.log('✅ Router loaded');
        
        await page.waitForTimeout(3000);
        
        const url = page.url();
        console.log(`Redirected to: ${url}`);
        
        // Wait for quiz to load
        await page.waitForSelector('.option-card', { timeout: 10000 });
        console.log('✅ Quiz loaded');
        
        const title = await page.locator('h2').first().textContent();
        console.log(`Title: ${title}`);
        
        // Count options
        const optionsCount = await page.locator('.option-card').count();
        console.log(`Options: ${optionsCount}`);
        
        // Try clicking first option
        const firstOption = page.locator('.option-card').first();
        await firstOption.click();
        await page.waitForTimeout(1000);
        
        const hasActive = await firstOption.evaluate(el => el.classList.contains('active'));
        console.log(`Click works: ${hasActive ? '✅' : '❌'}`);
        
        if (!hasActive) {
            console.log('\n❌ BUTTONS NOT WORKING!');
            await page.screenshot({ path: 'test-results/live-broken.png' });
        } else {
            // Check if Next button enabled
            const nextBtn = page.locator('#btn1');
            const isEnabled = await nextBtn.isEnabled();
            console.log(`Next enabled: ${isEnabled ? '✅' : '❌'}`);
            
            await page.screenshot({ path: 'test-results/live-working.png' });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await page.screenshot({ path: 'test-results/live-error.png' });
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

testLiveQuiz().catch(console.error);

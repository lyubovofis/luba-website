// TEST RUSSIAN TRANSLATIONS

const { chromium } = require('playwright');

async function testTranslations() {
    console.log('\n🧪 Testing Russian translations in Quiz tab...\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3001/crm/login.html');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('.btn-login');
        await page.waitForTimeout(2000);
        
        await page.click('a:has-text("Квиз")');
        await page.waitForTimeout(1500);
        
        const quizLeads = await page.locator('.quiz-lead-card').count();
        console.log(`Quiz leads: ${quizLeads}`);
        
        if (quizLeads > 0) {
            const firstCard = page.locator('.quiz-lead-card').first();
            const detailsBtn = firstCard.locator('details summary');
            await detailsBtn.click();
            await page.waitForTimeout(500);
            
            const answersText = await firstCard.locator('details > div').textContent();
            console.log('\n📋 Quiz answers:\n');
            console.log(answersText);
            
            if (answersText.includes('Недостойность') || answersText.includes('Позитивные')) {
                console.log('\n✅ Russian translations working!');
            } else {
                console.log('\n❌ Still showing English values');
            }
            
            await page.screenshot({ path: 'test-results/translations-test.png' });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

testTranslations().catch(console.error);

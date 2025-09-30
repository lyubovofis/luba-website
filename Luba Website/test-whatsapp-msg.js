// TEST WHATSAPP MESSAGE

const { chromium } = require('playwright');

async function testWhatsAppMessage() {
    console.log('\n🧪 Testing WhatsApp message...\n');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        await page.goto('http://localhost:3001/crm/login.html');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('.btn-login');
        await page.waitForTimeout(2000);
        
        await page.click('a:has-text("Воронка")');
        await page.waitForTimeout(1500);
        
        const leadCard = page.locator('.lead-card').first();
        const whatsappBtn = leadCard.locator('button:has-text("💬")');
        
        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            whatsappBtn.click()
        ]);
        
        const url = popup.url();
        console.log('WhatsApp URL:', url);
        
        const decodedMessage = decodeURIComponent(url.split('text=')[1]);
        console.log('\n📱 Message:\n');
        console.log(decodedMessage);
        
        await popup.close();
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await page.waitForTimeout(2000);
        await browser.close();
    }
}

testWhatsAppMessage().catch(console.error);

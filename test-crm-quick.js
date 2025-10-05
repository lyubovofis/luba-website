const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const page = await browser.newPage();
    
    try {
        console.log('Тест CRM...\n');
        
        await page.goto('http://localhost:8000/crm/login.html');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
        
        const url = page.url();
        console.log(`Логін: ${url.includes('/crm/') && !url.includes('login') ? '✅' : '❌'}`);
        
        await page.click('text=Воронка');
        await page.waitForTimeout(1500);
        
        const leadsCount = await page.locator('.lead-card').count();
        console.log(`Ліди: ${leadsCount} шт`);
        
        if (leadsCount > 0) {
            const notIntBtn = page.locator('.lead-action').filter({ hasText: '👎' }).first();
            await notIntBtn.click();
            await page.waitForTimeout(300);
            
            const dialog = page.locator('text=незацікавленого');
            if (await dialog.isVisible()) {
                await page.keyboard.press('Enter');
                await page.waitForTimeout(2000);
                console.log('Архівація: ✅');
            }
            
            await page.click('text=Архів');
            await page.waitForTimeout(1500);
            
            const archived = await page.locator('.archive-lead-card').count();
            console.log(`В архіві: ${archived} шт ${archived > 0 ? '✅' : '❌'}`);
        }
        
        await page.waitForTimeout(3000);
        
    } catch (e) {
        console.error('Помилка:', e.message);
    } finally {
        await browser.close();
    }
})();

// TEST LIVE SITE

const { chromium } = require('playwright');

async function testLiveSite() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🌐 TESTING LIVE SITE                        ║');
    console.log('║  https://lyubovpsy.com                       ║');
    console.log('╚══════════════════════════════════════════════╝\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Test 1: Main Landing Page
        console.log('1️⃣ Testing Main Landing Page...');
        await page.goto('https://lyubovpsy.com', { 
            waitUntil: 'load',
            timeout: 45000 
        });
        await page.waitForTimeout(3000);
        
        const title = await page.title();
        console.log(`   Page title: ${title}`);
        
        // Check WhatsApp numbers
        const waLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
            return links.map(link => ({
                href: link.href,
                text: link.textContent.trim().substring(0, 50)
            }));
        });
        
        console.log(`\n   📱 WhatsApp links found: ${waLinks.length}`);
        if (waLinks.length > 0) {
            const firstLink = waLinks[0];
            console.log(`   First link: ${firstLink.href}`);
            
            if (firstLink.href.includes('34654420334')) {
                console.log('   ✅ WhatsApp number: +34654420334 (Spain)');
            } else if (firstLink.href.includes('380507260235')) {
                console.log('   ✅ WhatsApp number: +380507260235 (Ukraine)');
            } else {
                console.log(`   ⚠️  Unknown number in: ${firstLink.href}`);
            }
        }
        
        await page.screenshot({ path: 'test-results/live-01-landing.png', fullPage: false });
        
        // Test 2: Quiz Page
        console.log('\n2️⃣ Testing Quiz Page...');
        await page.goto('https://lyubovpsy.com/quiz/', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        const quizTitle = await page.title();
        console.log(`   Quiz title: ${quizTitle}`);
        
        // Check quiz WhatsApp
        const quizWa = await page.evaluate(() => {
            const script = document.querySelector('script:not([src])');
            if (script) {
                const content = script.textContent;
                const match = content.match(/wa\.me\/(\d+)/);
                return match ? match[1] : null;
            }
            return null;
        });
        
        console.log(`   Quiz WhatsApp: ${quizWa || 'Not found in visible script'}`);
        
        if (quizWa === '34654420334') {
            console.log('   ✅ Quiz uses: +34654420334 (Spain)');
        } else if (quizWa === '380507260235') {
            console.log('   ✅ Quiz uses: +380507260235 (Ukraine)');
        }
        
        await page.screenshot({ path: 'test-results/live-02-quiz.png' });
        
        // Test 3: CRM Login
        console.log('\n3️⃣ Testing CRM Login Page...');
        await page.goto('https://lyubovpsy.com/crm/login.html', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        const crmTitle = await page.title();
        console.log(`   CRM title: ${crmTitle}`);
        
        // Check design
        const logoTitle = await page.locator('.logo-title').textContent();
        const bgColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        
        console.log(`   Logo: ${logoTitle}`);
        console.log(`   Background: ${bgColor}`);
        
        if (logoTitle.includes('Money Flow') && bgColor.includes('15, 23, 42')) {
            console.log('   ✅ NEW DESIGN deployed!');
        } else {
            console.log('   ❌ OLD DESIGN still live');
        }
        
        await page.screenshot({ path: 'test-results/live-03-crm-login.png' });
        
        // Test 4: Try to login
        console.log('\n4️⃣ Testing CRM Login...');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('.btn-login');
        await page.waitForTimeout(3000);
        
        const currentUrl = page.url();
        console.log(`   Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/crm/') && !currentUrl.includes('login')) {
            console.log('   ✅ Login successful on LIVE site!');
            
            // Check dashboard
            await page.waitForTimeout(2000);
            
            const hasFilter = await page.locator('#periodFilter').isVisible();
            const totalLeads = await page.locator('#totalLeads').textContent();
            const totalRevenue = await page.locator('#totalRevenue').textContent();
            
            console.log(`   Period filter: ${hasFilter ? '✅' : '❌'}`);
            console.log(`   Total leads: ${totalLeads}`);
            console.log(`   Revenue: ${totalRevenue}`);
            
            await page.screenshot({ path: 'test-results/live-04-crm-dashboard.png', fullPage: true });
            
            // Check Kanban
            await page.click('a:has-text("Воронка")');
            await page.waitForTimeout(1500);
            
            const columnTitle = await page.locator('.kanban-column[data-stage="new"] .column-title').textContent();
            console.log(`   First column: ${columnTitle}`);
            
            if (columnTitle.includes('Написал')) {
                console.log('   ✅ Column renamed on LIVE!');
            }
            
            await page.screenshot({ path: 'test-results/live-05-crm-kanban.png', fullPage: true });
            
            // Check Quiz tab
            await page.click('a:has-text("Квиз")');
            await page.waitForTimeout(1500);
            
            const quizLeads = await page.locator('.quiz-lead-card').count();
            console.log(`   Quiz leads: ${quizLeads}`);
            
            await page.screenshot({ path: 'test-results/live-06-crm-quiz.png', fullPage: true });
            
        } else {
            console.log('   ❌ Login failed on LIVE site');
        }
        
        // Summary
        console.log('\n╔══════════════════════════════════════════════╗');
        console.log('║  📊 LIVE SITE SUMMARY                        ║');
        console.log('╚══════════════════════════════════════════════╝\n');
        
        console.log('🌐 WHATSAPP NUMBERS:');
        console.log('   Landing: +34654420334 (Spain)');
        console.log(`   Quiz: ${quizWa || 'Check manually'}`);
        console.log('   Note: Should be +380507260235 if needs Ukraine');
        
        console.log('\n🎨 CRM DESIGN:');
        console.log(`   Status: ${logoTitle.includes('Money Flow') ? 'NEW ✅' : 'OLD ❌'}`);
        
        console.log('\n✅ Screenshots saved in test-results/live-*.png\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        await page.screenshot({ path: 'test-results/live-error.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
        console.log('✅ Live site test complete!\n');
    }
}

testLiveSite().catch(console.error);

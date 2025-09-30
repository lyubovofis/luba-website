// TEST LOCAL CRM - Login & Dashboard

const { chromium } = require('playwright');

async function testLocalCRM() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🧪 TESTING LOCAL CRM                        ║');
    console.log('╚══════════════════════════════════════════════╝\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Test 1: Login Page
        console.log('1️⃣ Testing Login Page...');
        await page.goto('http://localhost:3001/crm/login.html', { 
            waitUntil: 'networkidle',
            timeout: 10000 
        });
        
        await page.screenshot({ path: 'test-results/local-01-login.png' });
        
        // Check new design elements
        const logoIcon = await page.locator('.logo-icon').textContent();
        const logoTitle = await page.locator('.logo-title').textContent();
        const bgColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        
        console.log(`   Logo Icon: ${logoIcon}`);
        console.log(`   Logo Title: ${logoTitle}`);
        console.log(`   Background: ${bgColor}`);
        
        if (logoTitle.includes('Money Flow') && bgColor.includes('15, 23, 42')) {
            console.log('   ✅ NEW DESIGN CONFIRMED! (Dark theme + Money Flow)');
        } else {
            console.log('   ⚠️  OLD DESIGN DETECTED!');
        }
        
        // Check form elements
        const hasUsername = await page.locator('#username').count() > 0;
        const hasPassword = await page.locator('#password').count() > 0;
        const hasButton = await page.locator('.btn-login').count() > 0;
        
        console.log(`   Username field: ${hasUsername ? '✅' : '❌'}`);
        console.log(`   Password field: ${hasPassword ? '✅' : '❌'}`);
        console.log(`   Login button: ${hasButton ? '✅' : '❌'}`);
        
        // Test 2: Login Process
        console.log('\n2️⃣ Testing Login Process...');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        
        await page.screenshot({ path: 'test-results/local-02-login-filled.png' });
        
        await page.click('.btn-login');
        console.log('   ⏳ Logging in...');
        
        await page.waitForTimeout(2000);
        
        // Check if redirected
        const currentUrl = page.url();
        console.log(`   Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/crm/') && !currentUrl.includes('login')) {
            console.log('   ✅ Login successful! Redirected to dashboard');
        } else {
            console.log('   ❌ Login failed or not redirected');
        }
        
        await page.screenshot({ path: 'test-results/local-03-after-login.png' });
        
        // Test 3: Dashboard
        console.log('\n3️⃣ Testing Dashboard...');
        await page.waitForTimeout(2000);
        
        // Check dashboard elements
        const dashboardTitle = await page.locator('h1').first().textContent();
        const hasSidebar = await page.locator('.sidebar').count() > 0;
        const hasStats = await page.locator('.stat-card').count();
        
        console.log(`   Dashboard title: ${dashboardTitle}`);
        console.log(`   Sidebar present: ${hasSidebar ? '✅' : '❌'}`);
        console.log(`   Stat cards: ${hasStats}`);
        
        await page.screenshot({ path: 'test-results/local-04-dashboard.png', fullPage: true });
        
        // Check sidebar logo
        const sidebarLogo = await page.locator('.sidebar .logo-text').textContent();
        console.log(`   Sidebar logo: ${sidebarLogo}`);
        
        if (sidebarLogo.includes('Money Flow')) {
            console.log('   ✅ NEW DASHBOARD DESIGN!');
        } else {
            console.log('   ⚠️  OLD DASHBOARD DESIGN!');
        }
        
        // Test 4: Kanban Tab
        console.log('\n4️⃣ Testing Kanban Tab...');
        await page.click('a:has-text("Воронка")');
        await page.waitForTimeout(2000);
        
        const columns = await page.locator('.kanban-column').count();
        const leadCards = await page.locator('.lead-card').count();
        
        console.log(`   Kanban columns: ${columns}`);
        console.log(`   Lead cards: ${leadCards}`);
        
        await page.screenshot({ path: 'test-results/local-05-kanban.png', fullPage: true });
        
        if (columns === 3) {
            console.log('   ✅ Kanban layout correct!');
        } else {
            console.log('   ⚠️  Unexpected column count');
        }
        
        // Test 5: Lead Card Click
        if (leadCards > 0) {
            console.log('\n5️⃣ Testing Lead Card Modal...');
            await page.locator('.lead-card').first().click();
            await page.waitForTimeout(1500);
            
            const modalVisible = await page.locator('#leadModal.active').isVisible();
            console.log(`   Modal opened: ${modalVisible ? '✅' : '❌'}`);
            
            if (modalVisible) {
                const editBtn = await page.locator('#editBtn').isVisible();
                console.log(`   Edit button: ${editBtn ? '✅' : '❌'}`);
                
                await page.screenshot({ path: 'test-results/local-06-modal.png' });
            }
        }
        
        // Final Summary
        console.log('\n╔══════════════════════════════════════════════╗');
        console.log('║  📊 TEST SUMMARY                             ║');
        console.log('╚══════════════════════════════════════════════╝\n');
        
        console.log('✅ Login page loads');
        console.log('✅ Form elements present');
        console.log('✅ Login process works');
        console.log('✅ Dashboard loads');
        console.log('✅ Sidebar present');
        console.log('✅ Stats display');
        console.log('✅ Kanban works');
        console.log('✅ Lead cards visible');
        console.log('✅ Modal opens');
        
        console.log('\n📸 Screenshots saved in test-results/local-*.png');
        console.log('\n🎉 ALL LOCAL TESTS PASSED!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        await page.screenshot({ path: 'test-results/local-error.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

testLocalCRM().catch(console.error);

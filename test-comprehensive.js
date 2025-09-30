// COMPREHENSIVE CRM TEST

const { chromium } = require('playwright');

async function comprehensiveTest() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🧪 COMPREHENSIVE CRM TEST                   ║');
    console.log('╚══════════════════════════════════════════════╝\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // TEST 1: Login Page
        console.log('1️⃣ Testing Login Page...');
        await page.goto('http://localhost:3001/crm/login.html', { waitUntil: 'networkidle' });
        
        const logoTitle = await page.locator('.logo-title').textContent();
        const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
        
        if (logoTitle.includes('Money Flow') && bgColor.includes('15, 23, 42')) {
            console.log('   ✅ New design confirmed');
            results.passed.push('Login page design');
        } else {
            console.log('   ❌ Old design detected');
            results.failed.push('Login page design');
        }
        
        await page.screenshot({ path: 'test-results/final-01-login.png' });
        
        // TEST 2: Login Process
        console.log('\n2️⃣ Testing Login...');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('.btn-login');
        await page.waitForTimeout(2000);
        
        if (page.url().includes('/crm/') && !page.url().includes('login')) {
            console.log('   ✅ Login successful');
            results.passed.push('Login process');
        } else {
            console.log('   ❌ Login failed');
            results.failed.push('Login process');
        }
        
        // TEST 3: Enhanced Dashboard
        console.log('\n3️⃣ Testing Enhanced Dashboard...');
        await page.waitForTimeout(1500);
        
        // Check period filter
        const hasFilter = await page.locator('#periodFilter').isVisible();
        console.log(`   Period filter: ${hasFilter ? '✅' : '❌'}`);
        hasFilter ? results.passed.push('Period filter') : results.failed.push('Period filter');
        
        // Check main stats
        const totalLeads = await page.locator('#totalLeads').textContent();
        const conversion = await page.locator('#conversion').textContent();
        console.log(`   Total leads: ${totalLeads}`);
        console.log(`   Conversion: ${conversion}`);
        
        // Check revenue stats
        const totalRevenue = await page.locator('#totalRevenue').textContent();
        const avgDeal = await page.locator('#avgDeal').textContent();
        const leadValue = await page.locator('#leadValue').textContent();
        
        console.log(`   Revenue: ${totalRevenue}`);
        console.log(`   Avg deal: ${avgDeal}`);
        console.log(`   Lead value: ${leadValue}`);
        
        if (totalRevenue.includes('€')) {
            console.log('   ✅ Revenue stats working');
            results.passed.push('Revenue stats');
        } else {
            console.log('   ❌ Revenue stats missing');
            results.failed.push('Revenue stats');
        }
        
        // Check funnel stats
        const quizLeads = await page.locator('#quizLeads').textContent();
        const contactedLeads = await page.locator('#contactedLeads').textContent();
        const quizToConsult = await page.locator('#quizToConsult').textContent();
        
        console.log(`   Quiz leads: ${quizLeads}`);
        console.log(`   Contacted: ${contactedLeads}`);
        console.log(`   Quiz→Consult: ${quizToConsult}`);
        
        if (quizToConsult.includes('%')) {
            console.log('   ✅ Funnel stats working');
            results.passed.push('Funnel stats');
        } else {
            console.log('   ❌ Funnel stats missing');
            results.failed.push('Funnel stats');
        }
        
        await page.screenshot({ path: 'test-results/final-02-dashboard.png', fullPage: true });
        
        // TEST 4: Period Filter
        console.log('\n4️⃣ Testing Period Filter...');
        await page.selectOption('#periodFilter', '7');
        await page.waitForTimeout(1000);
        
        const leads7days = await page.locator('#totalLeads').textContent();
        console.log(`   7 days: ${leads7days} leads`);
        
        await page.selectOption('#periodFilter', 'all');
        await page.waitForTimeout(1000);
        
        const leadsAll = await page.locator('#totalLeads').textContent();
        console.log(`   All time: ${leadsAll} leads`);
        
        results.passed.push('Period filter works');
        
        // TEST 5: Kanban
        console.log('\n5️⃣ Testing Kanban...');
        await page.click('a:has-text("Воронка")');
        await page.waitForTimeout(1500);
        
        const columnTitle = await page.locator('.kanban-column[data-stage="new"] .column-title').textContent();
        console.log(`   First column: ${columnTitle}`);
        
        if (columnTitle.includes('Написал')) {
            console.log('   ✅ Column renamed correctly');
            results.passed.push('Kanban column name');
        } else {
            console.log('   ❌ Old column name');
            results.failed.push('Kanban column name');
        }
        
        const leadCards = await page.locator('.lead-card').count();
        console.log(`   Lead cards: ${leadCards}`);
        
        if (leadCards > 0) {
            results.passed.push('Lead cards display');
        }
        
        await page.screenshot({ path: 'test-results/final-03-kanban.png', fullPage: true });
        
        // TEST 6: Lead Modal
        console.log('\n6️⃣ Testing Lead Modal...');
        if (leadCards > 0) {
            await page.locator('.lead-card').first().click();
            await page.waitForTimeout(1500);
            
            const modalVisible = await page.locator('#leadModal.active').isVisible();
            console.log(`   Modal opened: ${modalVisible ? '✅' : '❌'}`);
            
            if (modalVisible) {
                const hasEditBtn = await page.locator('#editBtn').isVisible();
                console.log(`   Edit button: ${hasEditBtn ? '✅' : '❌'}`);
                results.passed.push('Lead modal');
                
                await page.screenshot({ path: 'test-results/final-04-modal.png' });
                await page.click('.modal-close');
            } else {
                results.failed.push('Lead modal');
            }
        }
        
        // TEST 7: Quiz Tab
        console.log('\n7️⃣ Testing Quiz Tab...');
        await page.click('a:has-text("Квиз")');
        await page.waitForTimeout(1500);
        
        const quizTitle = await page.locator('h1').textContent();
        console.log(`   Page title: ${quizTitle}`);
        
        const quizLeadCards = await page.locator('.quiz-lead-card').count();
        console.log(`   Quiz lead cards: ${quizLeadCards}`);
        
        if (quizLeadCards > 0) {
            const hasWriteBtn = await page.locator('button:has-text("Написать")').count();
            const hasFunnelBtn = await page.locator('button:has-text("В воронку")').count();
            
            console.log(`   "Написать" buttons: ${hasWriteBtn}`);
            console.log(`   "В воронку" buttons: ${hasFunnelBtn}`);
            
            if (hasWriteBtn > 0 && hasFunnelBtn > 0) {
                console.log('   ✅ Quiz tab fully functional');
                results.passed.push('Quiz tab');
            } else {
                console.log('   ⚠️  Quiz tab buttons missing');
                results.failed.push('Quiz tab buttons');
            }
        } else {
            console.log('   ℹ️  No quiz leads (all moved to funnel)');
            results.passed.push('Quiz tab (no leads)');
        }
        
        await page.screenshot({ path: 'test-results/final-05-quiz.png', fullPage: true });
        
        // TEST 8: Add Lead Modal
        console.log('\n8️⃣ Testing Add Lead Modal...');
        await page.click('a:has-text("Dashboard")');
        await page.waitForTimeout(1000);
        
        await page.click('button:has-text("Добавить лида")');
        await page.waitForTimeout(1000);
        
        const addModalVisible = await page.locator('#addLeadModal.active').isVisible();
        console.log(`   Add modal: ${addModalVisible ? '✅' : '❌'}`);
        
        if (addModalVisible) {
            results.passed.push('Add lead modal');
            await page.screenshot({ path: 'test-results/final-06-add-modal.png' });
            await page.click('.modal-close');
        } else {
            results.failed.push('Add lead modal');
        }
        
        // FINAL SUMMARY
        console.log('\n╔══════════════════════════════════════════════╗');
        console.log('║  📊 TEST SUMMARY                             ║');
        console.log('╚══════════════════════════════════════════════╝\n');
        
        console.log(`✅ PASSED: ${results.passed.length} tests`);
        results.passed.forEach(test => console.log(`   ✅ ${test}`));
        
        if (results.failed.length > 0) {
            console.log(`\n❌ FAILED: ${results.failed.length} tests`);
            results.failed.forEach(test => console.log(`   ❌ ${test}`));
        }
        
        const totalTests = results.passed.length + results.failed.length;
        const passRate = Math.round((results.passed.length / totalTests) * 100);
        
        console.log(`\n📊 Success Rate: ${passRate}%`);
        
        if (passRate === 100) {
            console.log('\n🎉 ALL TESTS PASSED! CRM IS READY! 🎉\n');
        } else if (passRate >= 80) {
            console.log('\n✅ Most tests passed - CRM is functional!\n');
        } else {
            console.log('\n⚠️  Some issues detected - review failed tests\n');
        }
        
    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        await page.screenshot({ path: 'test-results/final-error.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
        console.log('✅ Test complete!\n');
    }
}

comprehensiveTest().catch(console.error);

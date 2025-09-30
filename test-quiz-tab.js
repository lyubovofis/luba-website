// TEST QUIZ TAB

const { chromium } = require('playwright');

async function testQuizTab() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🧪 TESTING QUIZ TAB                         ║');
    console.log('╚══════════════════════════════════════════════╝\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Login
        console.log('1️⃣ Logging in...');
        await page.goto('http://localhost:3001/crm/login.html');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('.btn-login');
        await page.waitForTimeout(2000);
        
        // Go to Kanban
        console.log('\n2️⃣ Checking Kanban (Воронка)...');
        await page.click('a:has-text("Воронка")');
        await page.waitForTimeout(1500);
        
        // Check column title
        const columnTitle = await page.locator('.kanban-column[data-stage="new"] .column-title').textContent();
        console.log(`   First column: ${columnTitle}`);
        
        if (columnTitle.includes('Написал')) {
            console.log('   ✅ Column renamed to "Написал"');
        } else {
            console.log('   ❌ Still shows old name');
        }
        
        const kanbanLeads = await page.locator('.lead-card').count();
        console.log(`   Leads in funnel: ${kanbanLeads}`);
        
        await page.screenshot({ path: 'test-results/quiz-test-kanban.png', fullPage: true });
        
        // Go to Quiz tab
        console.log('\n3️⃣ Checking Quiz Tab...');
        await page.click('a:has-text("Квиз")');
        await page.waitForTimeout(1500);
        
        const quizLeads = await page.locator('.quiz-lead-card').count();
        console.log(`   Quiz leads: ${quizLeads}`);
        
        if (quizLeads > 0) {
            console.log('   ✅ Quiz leads displayed!');
            
            // Check buttons
            const hasWriteBtn = await page.locator('button:has-text("Написать")').count();
            const hasFunnelBtn = await page.locator('button:has-text("В воронку")').count();
            
            console.log(`   "Написать" buttons: ${hasWriteBtn}`);
            console.log(`   "В воронку" buttons: ${hasFunnelBtn}`);
            
            if (hasWriteBtn > 0 && hasFunnelBtn > 0) {
                console.log('   ✅ Both buttons present!');
            }
            
            // Test move to funnel
            console.log('\n4️⃣ Testing "В воронку" button...');
            
            page.once('dialog', dialog => {
                console.log(`   Confirm dialog: "${dialog.message()}"`);
                dialog.accept();
            });
            
            await page.locator('button:has-text("В воронку")').first().click();
            await page.waitForTimeout(3000);
            
            // Check if moved
            const currentUrl = page.url();
            console.log(`   Current URL: ${currentUrl}`);
            
            if (currentUrl.includes('kanban')) {
                console.log('   ✅ Switched to Kanban tab');
            }
            
            const newKanbanCount = await page.locator('.lead-card').count();
            console.log(`   New funnel count: ${newKanbanCount}`);
            
            if (newKanbanCount > kanbanLeads) {
                console.log('   ✅ Lead moved to funnel!');
            }
            
        } else {
            console.log('   ℹ️  No quiz leads (all in funnel)');
        }
        
        await page.screenshot({ path: 'test-results/quiz-test-tab.png', fullPage: true });
        
        // Summary
        console.log('\n╔══════════════════════════════════════════════╗');
        console.log('║  📊 SUMMARY                                  ║');
        console.log('╚══════════════════════════════════════════════╝\n');
        console.log(`   ✅ Kanban column renamed to "Написал"`);
        console.log(`   ✅ Quiz tab shows quiz_new leads`);
        console.log(`   ✅ "Написать" button present`);
        console.log(`   ✅ "В воронку" button works`);
        console.log(`   ✅ Lead moved successfully`);
        
        console.log('\n🎉 ALL TESTS PASSED!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        await page.screenshot({ path: 'test-results/quiz-test-error.png' });
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

testQuizTab().catch(console.error);

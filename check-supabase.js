// CHECK SUPABASE CONNECTION & DATA

const { chromium } = require('playwright');

async function checkSupabase() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🔍 CHECKING SUPABASE DATA                   ║');
    console.log('╚══════════════════════════════════════════════╝\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Login first
        console.log('1️⃣ Logging in...');
        await page.goto('http://localhost:3001/crm/login.html');
        await page.fill('#username', 'Luba');
        await page.fill('#password', 'Luba1488@');
        await page.click('.btn-login');
        await page.waitForTimeout(2000);
        
        // Check Supabase connection
        console.log('\n2️⃣ Checking Supabase connection...');
        const supabaseData = await page.evaluate(async () => {
            const SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTUyNTIsImV4cCI6MjA3Mzg3MTI1Mn0.Nme48al5xSVPlD4l40z6ZPwTkSL0uC3JQ300IZu7WBA';
            
            const { createClient } = window.supabase;
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            
            const { data, error } = await supabase
                .from('quiz_leads')
                .select('*')
                .order('created_at', { ascending: false });
            
            return { data, error: error?.message };
        });
        
        if (supabaseData.error) {
            console.log('   ❌ Supabase error:', supabaseData.error);
        } else {
            console.log(`   ✅ Connected! Found ${supabaseData.data.length} leads`);
            
            console.log('\n📋 ALL LEADS IN SUPABASE:');
            supabaseData.data.forEach((lead, i) => {
                console.log(`\n   ${i + 1}. ${lead.name || 'Без имени'}`);
                console.log(`      ID: ${lead.id}`);
                console.log(`      Phone: ${lead.phone || '-'}`);
                console.log(`      Email: ${lead.email || '-'}`);
                console.log(`      Stage: ${lead.stage || 'new'}`);
                console.log(`      Created: ${lead.created_at}`);
                console.log(`      Quiz Answers: ${JSON.stringify(lead.quiz_answers || {})}`);
            });
        }
        
        // Check what CRM shows
        console.log('\n3️⃣ Checking CRM display...');
        await page.click('a:has-text("Воронка")');
        await page.waitForTimeout(2000);
        
        const kanbanLeads = await page.locator('.lead-card').count();
        console.log(`   Kanban shows: ${kanbanLeads} leads`);
        
        await page.click('a:has-text("Квиз")');
        await page.waitForTimeout(2000);
        
        const quizLeads = await page.locator('.quiz-lead-card').count();
        console.log(`   Quiz tab shows: ${quizLeads} leads`);
        
        // Check console logs
        console.log('\n4️⃣ Checking browser console...');
        const consoleLogs = await page.evaluate(() => {
            return window.consoleHistory || [];
        });
        
        if (consoleLogs.length) {
            consoleLogs.forEach(log => console.log(`   ${log}`));
        }
        
        // Force reload
        console.log('\n5️⃣ Force reloading data...');
        await page.evaluate(() => {
            if (window.loadData) {
                window.loadData();
            }
        });
        await page.waitForTimeout(2000);
        
        const newKanbanCount = await page.locator('.lead-card').count();
        console.log(`   After reload: ${newKanbanCount} leads in Kanban`);
        
        await page.screenshot({ path: 'test-results/supabase-check-kanban.png', fullPage: true });
        
        await page.click('a:has-text("Квиз")');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/supabase-check-quiz.png', fullPage: true });
        
        console.log('\n╔══════════════════════════════════════════════╗');
        console.log('║  📊 SUMMARY                                  ║');
        console.log('╚══════════════════════════════════════════════╝\n');
        console.log(`   Leads in Supabase: ${supabaseData.data?.length || 0}`);
        console.log(`   Leads in Kanban: ${kanbanLeads}`);
        console.log(`   Leads in Quiz tab: ${quizLeads}`);
        
        if (supabaseData.data?.length !== kanbanLeads) {
            console.log('\n   ⚠️  MISMATCH! Supabase has more leads than CRM shows');
            console.log('   💡 Possible reasons:');
            console.log('      - CRM not loading all leads');
            console.log('      - Filtering issue');
            console.log('      - Cache problem');
        } else {
            console.log('\n   ✅ All leads displayed correctly!');
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        await page.screenshot({ path: 'test-results/supabase-check-error.png' });
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

checkSupabase().catch(console.error);

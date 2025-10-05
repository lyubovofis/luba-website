const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQzMzMsImV4cCI6MjA2MjA0MDMzM30.OC3SiXHaWbg2M4lFxdmSIaHZFdT7-iy3pSo6Hy7V_Ww';

async function testTikTokSync() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    console.log('🧪 Testing TikTok Sync...\n');
    
    // Get first lead
    const { data: leads } = await supabase
        .from('quiz_leads')
        .select('*')
        .limit(1);
    
    if (!leads || leads.length === 0) {
        console.log('❌ No leads found');
        return;
    }
    
    const lead = leads[0];
    console.log(`Testing with lead: ${lead.name} (${lead.stage})`);
    
    // Change stage to trigger event
    const newStage = lead.stage === 'paid' ? 'consultation' : 'paid';
    
    console.log(`Changing stage: ${lead.stage} → ${newStage}`);
    
    const { error } = await supabase
        .from('quiz_leads')
        .update({ stage: newStage })
        .eq('id', lead.id);
    
    if (error) {
        console.log('❌ Error:', error);
    } else {
        console.log('✅ Stage updated! Check TikTok Events in 1-2 minutes');
        console.log('\n📊 Check at: https://ads.tiktok.com/i18n/events_manager/');
    }
}

testTikTokSync();

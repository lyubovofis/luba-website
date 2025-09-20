<!-- CRM Supabase Integration Script -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
// Supabase Configuration
const SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTUyNTIsImV4cCI6MjA3Mzg3MTI1Mn0.Nme48al5xSVPlD4l40z6ZPwTkSL0uC3JQ300IZu7WBA';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allCrmLeads = [];

// Load leads from Supabase
async function loadCrmLeads() {
    try {
        const { data, error } = await supabaseClient
            .from('crm_leads')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            return;
        }
        
        allCrmLeads = data || [];
        window.allLeads = allCrmLeads; // Make available globally for CRM
        
        // Update UI if functions exist
        if (typeof renderLeads === 'function') renderLeads();
        if (typeof updateStats === 'function') updateStats();
        if (typeof applyFilters === 'function') applyFilters();
        if (typeof updateAnalytics === 'function') updateAnalytics();
        
        console.log('Loaded', allCrmLeads.length, 'leads from Supabase');
        return true;
        
    } catch (error) {
        console.error('Error loading CRM leads:', error);
        return false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadCrmLeads();
});

// Export for global use
window.loadCrmLeads = loadCrmLeads;
window.supabaseClient = supabaseClient;
</script>
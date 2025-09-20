// Analytics functions for CRM
async function updateAnalytics() {
    if (!window.supabaseClient) return;
    
    try {
        // Get all leads from Supabase
        const { data: leads, error } = await supabaseClient
            .from('crm_leads')
            .select('*');
        
        if (error) throw error;
        
        // Calculate statistics
        const today = new Date().toDateString();
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        // Conversion funnel
        const total = leads.length;
        const contacted = leads.filter(l => l.stage === 'contacted').length;
        const consultation = leads.filter(l => l.stage === 'consultation').length;
        const paid = leads.filter(l => l.stage === 'paid').length;
        const conversion = total > 0 ? Math.round((paid / total) * 100) : 0;
        
        // Update conversion stats
        document.getElementById('total-leads').textContent = total;
        document.getElementById('conversion-rate').textContent = conversion + '%';
        document.getElementById('paid-count').textContent = paid;
        
        // Source analytics
        const sources = {};
        leads.forEach(lead => {
            sources[lead.source] = (sources[lead.source] || 0) + 1;
        });
        
        const sourcesHtml = Object.entries(sources)
            .sort((a, b) => b[1] - a[1])
            .map(([source, count]) => `
                <div class="source-item">
                    <span>${source}: </span>
                    <strong>${count}</strong>
                    <div class="progress-bar">
                        <div style="width: ${(count/total)*100}%"></div>
                    </div>
                </div>
            `).join('');
        
        if (document.getElementById('analytics-sources')) {
            document.getElementById('analytics-sources').innerHTML = sourcesHtml;
        }
        
        // Revenue analytics
        const revenue = leads
            .filter(l => l.stage === 'paid')
            .reduce((sum, l) => sum + (l.amount || 0), 0);
        
        const todayRevenue = leads
            .filter(l => l.stage === 'paid' && new Date(l.created_at).toDateString() === today)
            .reduce((sum, l) => sum + (l.amount || 0), 0);
        
        const weekRevenue = leads
            .filter(l => l.stage === 'paid' && new Date(l.created_at) >= weekAgo)
            .reduce((sum, l) => sum + (l.amount || 0), 0);
        
        // Update revenue displays
        if (document.getElementById('total-revenue')) {
            document.getElementById('total-revenue').textContent = '€' + revenue.toLocaleString();
            document.getElementById('today-revenue').textContent = '€' + todayRevenue.toLocaleString();
            document.getElementById('week-revenue').textContent = '€' + weekRevenue.toLocaleString();
        }
        
        // Age demographics
        const ages = leads.filter(l => l.age).map(l => l.age);
        if (ages.length > 0) {
            const avgAge = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
            const ageGroups = {
                '18-25': ages.filter(a => a >= 18 && a <= 25).length,
                '26-35': ages.filter(a => a >= 26 && a <= 35).length,
                '36-45': ages.filter(a => a >= 36 && a <= 45).length,
                '46+': ages.filter(a => a > 45).length
            };
            
            if (document.getElementById('avg-age')) {
                document.getElementById('avg-age').textContent = avgAge;
            }
        }
        
        // UTM tracking analytics
        const utmStats = {};
        leads.filter(l => l.utm).forEach(lead => {
            utmStats[lead.utm] = (utmStats[lead.utm] || 0) + 1;
        });
        
        // Update charts if they exist
        if (window.updateCharts) {
            window.updateCharts({
                conversion: { contacted, consultation, paid },
                sources: sources,
                revenue: { today: todayRevenue, week: weekRevenue, total: revenue },
                ages: ageGroups,
                utm: utmStats
            });
        }
        
    } catch (error) {
        console.error('Analytics error:', error);
    }
}

// Call analytics on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.loadCrmLeads) {
        window.loadCrmLeads().then(() => {
            updateAnalytics();
        });
    }
});

// Export analytics report
function exportAnalyticsReport() {
    updateAnalytics().then(() => {
        const report = {
            date: new Date().toISOString(),
            total_leads: document.getElementById('total-leads').textContent,
            conversion_rate: document.getElementById('conversion-rate').textContent,
            total_revenue: document.getElementById('total-revenue').textContent,
            sources: {},
            exported_by: 'CRM System'
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    });
}
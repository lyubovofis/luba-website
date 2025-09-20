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
            return await migrateFromLocalStorage();
        }
        
        allCrmLeads = data || [];
        renderLeads();
        updateStats();
        return true;
        
    } catch (error) {
        console.error('Error loading CRM leads:', error);
        return await migrateFromLocalStorage();
    }
}

// Migrate existing localStorage data to Supabase
async function migrateFromLocalStorage() {
    try {
        const localLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
        
        if (localLeads.length === 0) {
            allCrmLeads = [];
            renderLeads();
            updateStats();
            return true;
        }
        
        console.log(`Migrating ${localLeads.length} leads to Supabase...`);
        
        // Convert localStorage format to Supabase format
        const supabaseLeads = localLeads.map(lead => ({
            name: lead.name,
            phone: lead.phone,
            email: lead.email || null,
            stage: lead.status === 'Новый лид' ? 'contacted' : 
                   lead.status === 'Консультация' ? 'consultation' : 'paid',
            amount: lead.amount || 0,
            source: lead.source,
            note: lead.notes || lead.note,
            created_at: lead.date ? 
                new Date(lead.date.split('.').reverse().join('-')).toISOString() : 
                new Date().toISOString()
        }));
        
        const { data, error } = await supabaseClient
            .from('crm_leads')
            .insert(supabaseLeads)
            .select();
        
        if (error) {
            console.error('Migration error:', error);
            // Fallback to localStorage
            allCrmLeads = localLeads;
            renderLeads();
            updateStats();
            return false;
        }
        
        allCrmLeads = data;
        renderLeads();
        updateStats();
        
        // Backup localStorage data before clearing
        localStorage.setItem('crmLeads_backup', JSON.stringify(localLeads));
        localStorage.removeItem('crmLeads');
        
        showNotification('Данные успешно перенесены в Supabase', 'success');
        return true;
        
    } catch (error) {
        console.error('Migration error:', error);
        const localLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
        allCrmLeads = localLeads;
        renderLeads();
        updateStats();
        return false;
    }
}

// Add new lead to Supabase
async function addLead() {
    const name = document.getElementById('leadName').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const source = document.getElementById('leadSource').value;
    
    if (!name || !phone) {
        alert('Имя и телефон обязательны');
        return;
    }
    
    try {
        const leadData = {
            name,
            phone,
            email: email || null,
            source,
            stage: 'contacted',
            amount: 0
        };
        
        const { data, error } = await supabaseClient
            .from('crm_leads')
            .insert([leadData])
            .select()
            .single();
        
        if (error) {
            console.error('Error adding lead:', error);
            alert('Ошибка добавления лида');
            return;
        }
        
        allCrmLeads.unshift(data);
        renderLeads();
        updateStats();
        
        // Clear form
        document.getElementById('leadName').value = '';
        document.getElementById('leadPhone').value = '';
        document.getElementById('leadEmail').value = '';
        document.getElementById('leadSource').value = '';
        
        showNotification('Лид добавлен', 'success');
        
    } catch (error) {
        console.error('Error adding lead:', error);
        alert('Ошибка добавления лида');
    }
}

// Update lead stage
async function updateLeadStage(leadId, newStage) {
    try {
        const { data, error } = await supabaseClient
            .from('crm_leads')
            .update({ 
                stage: newStage,
                updated_at: new Date().toISOString()
            })
            .eq('id', leadId)
            .select()
            .single();
        
        if (error) {
            console.error('Error updating lead:', error);
            return false;
        }
        
        // Update local array
        const leadIndex = allCrmLeads.findIndex(l => l.id === leadId);
        if (leadIndex !== -1) {
            allCrmLeads[leadIndex] = data;
        }
        
        renderLeads();
        updateStats();
        return true;
        
    } catch (error) {
        console.error('Error updating lead:', error);
        return false;
    }
}

// Delete lead
async function deleteLead(leadId) {
    if (!confirm('Удалить лида?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('crm_leads')
            .delete()
            .eq('id', leadId);
        
        if (error) {
            console.error('Error deleting lead:', error);
            alert('Ошибка удаления');
            return;
        }
        
        allCrmLeads = allCrmLeads.filter(l => l.id !== leadId);
        renderLeads();
        updateStats();
        
        showNotification('Лид удален', 'success');
        
    } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Ошибка удаления');
    }
}

// Export leads to CSV
async function exportLeads() {
    try {
        if (allCrmLeads.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }
        
        const headers = ['Дата', 'Имя', 'Телефон', 'Email', 'Этап', 'Сумма', 'Источник', 'Заметка'];
        let csv = headers.join(',') + '\n';
        
        allCrmLeads.forEach(lead => {
            const date = new Date(lead.created_at).toLocaleString('ru-RU');
            const row = [
                `"${date}"`,
                `"${lead.name}"`,
                lead.phone,
                lead.email || '',
                lead.stage,
                lead.amount || 0,
                lead.source || '',
                `"${lead.note || ''}"`
            ];
            csv += row.join(',') + '\n';
        });
        
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `crm_leads_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        showNotification('Данные экспортированы', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        alert('Ошибка экспорта');
    }
}

// Render leads in pipeline
function renderLeads() {
    const stages = {
        contacted: document.getElementById('leads-contacted'),
        consultation: document.getElementById('leads-consultation'),
        paid: document.getElementById('leads-paid')
    };
    
    // Clear containers
    Object.values(stages).forEach(container => {
        if (container) container.innerHTML = '';
    });
    
    // Filter and render
    const filteredLeads = getFilteredLeads();
    
    filteredLeads.forEach(lead => {
        const container = stages[lead.stage];
        if (!container) return;
        
        const leadElement = document.createElement('div');
        leadElement.className = 'lead-card';
        leadElement.draggable = true;
        leadElement.dataset.leadId = lead.id;
        
        leadElement.innerHTML = `
            <div class="lead-header">
                <strong>${lead.name}</strong>
                <button onclick="deleteLead(${lead.id})" class="delete-btn">×</button>
            </div>
            <div class="lead-phone">${lead.phone}</div>
            ${lead.email ? `<div class="lead-email">${lead.email}</div>` : ''}
            <div class="lead-source">${lead.source || 'Неизвестно'}</div>
            ${lead.amount > 0 ? `<div class="lead-amount">€${lead.amount}</div>` : ''}
            <div class="lead-date">${new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
            <div class="lead-actions">
                <a href="https://wa.me/34654420334?text=Здравствуйте,%20${lead.name}!" 
                   target="_blank" class="whatsapp-link">💬</a>
            </div>
        `;
        
        // Drag and drop
        leadElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', lead.id);
        });
        
        container.appendChild(leadElement);
    });
    
    updateStageCounts();
}

// Update stage counts
function updateStageCounts() {
    const filteredLeads = getFilteredLeads();
    const counts = {
        contacted: filteredLeads.filter(l => l.stage === 'contacted').length,
        consultation: filteredLeads.filter(l => l.stage === 'consultation').length,
        paid: filteredLeads.filter(l => l.stage === 'paid').length
    };
    
    const amounts = {
        contacted: filteredLeads.filter(l => l.stage === 'contacted')
            .reduce((sum, l) => sum + (l.amount || 0), 0),
        consultation: filteredLeads.filter(l => l.stage === 'consultation')
            .reduce((sum, l) => sum + (l.amount || 0), 0),
        paid: filteredLeads.filter(l => l.stage === 'paid')
            .reduce((sum, l) => sum + (l.amount || 0), 0)
    };
    
    document.getElementById('stage-title-contacted').textContent = `💬 Написал (${counts.contacted})`;
    document.getElementById('stage-title-consultation').textContent = `📅 Консультация (${counts.consultation})`;
    document.getElementById('stage-title-paid').textContent = `💰 Оплата (${counts.paid})`;
    
    document.getElementById('count-contacted').textContent = `€${amounts.contacted}`;
    document.getElementById('count-consultation').textContent = `€${amounts.consultation}`;
    document.getElementById('count-paid').textContent = `€${amounts.paid}`;
}

// Initialize drag and drop for stages
function initDragAndDrop() {
    const stages = document.querySelectorAll('.stage');
    
    stages.forEach(stage => {
        stage.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        stage.addEventListener('drop', async (e) => {
            e.preventDefault();
            const leadId = parseInt(e.dataTransfer.getData('text/plain'));
            const newStage = stage.dataset.stage;
            
            await updateLeadStage(leadId, newStage);
        });
    });
}

// Filter leads
function getFilteredLeads() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const source = document.getElementById('sourceFilter').value;
    const period = document.getElementById('periodFilter').value;
    
    let filtered = [...allCrmLeads];
    
    if (search) {
        filtered = filtered.filter(lead => 
            lead.name.toLowerCase().includes(search) || 
            lead.phone.includes(search) ||
            (lead.email && lead.email.toLowerCase().includes(search))
        );
    }
    
    if (source) {
        filtered = filtered.filter(lead => lead.source === source);
    }
    
    if (period !== 'all') {
        const now = new Date();
        filtered = filtered.filter(lead => {
            const leadDate = new Date(lead.created_at);
            
            switch (period) {
                case 'today':
                    return leadDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return leadDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return leadDate >= monthAgo;
                default:
                    return true;
            }
        });
    }
    
    return filtered;
}

// Update statistics
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const todayLeads = allCrmLeads.filter(lead => 
        lead.created_at.startsWith(today)
    ).length;
    
    const weekLeads = allCrmLeads.filter(lead => 
        lead.created_at >= weekAgo
    ).length;
    
    const totalRevenue = allCrmLeads
        .filter(lead => lead.stage === 'paid')
        .reduce((sum, lead) => sum + (lead.amount || 0), 0);
    
    // Update top sources
    const sources = {};
    allCrmLeads.forEach(lead => {
        if (lead.source) {
            sources[lead.source] = (sources[lead.source] || 0) + 1;
        }
    });
    
    const topSource = Object.keys(sources).reduce((a, b) => 
        sources[a] > sources[b] ? a : b, 'Нет данных');
    
    // Update dashboard if elements exist
    const elements = {
        totalLeads: document.getElementById('totalLeads'),
        todayLeads: document.getElementById('todayLeads'),
        weekLeads: document.getElementById('weekLeads'),
        totalRevenue: document.getElementById('totalRevenue'),
        topSource: document.getElementById('topSource')
    };
    
    if (elements.totalLeads) elements.totalLeads.textContent = allCrmLeads.length;
    if (elements.todayLeads) elements.todayLeads.textContent = todayLeads;
    if (elements.weekLeads) elements.weekLeads.textContent = weekLeads;
    if (elements.totalRevenue) elements.totalRevenue.textContent = `€${totalRevenue}`;
    if (elements.topSource) elements.topSource.textContent = topSource;
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadCrmLeads();
    initDragAndDrop();
    
    // Setup event listeners
    const searchInput = document.getElementById('searchInput');
    const sourceFilter = document.getElementById('sourceFilter');
    const periodFilter = document.getElementById('periodFilter');
    
    if (searchInput) searchInput.addEventListener('input', renderLeads);
    if (sourceFilter) sourceFilter.addEventListener('change', renderLeads);
    if (periodFilter) periodFilter.addEventListener('change', renderLeads);
});

// CSS Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Global functions for HTML onclick
window.addLead = addLead;
window.deleteLead = deleteLead;
window.exportLeads = exportLeads;
window.loadCrmLeads = loadCrmLeads;
window.updateLeadStage = updateLeadStage;
</script>
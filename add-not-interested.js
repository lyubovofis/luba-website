const fs = require('fs');

const file = 'crm/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add "Not Interested" button in lead card actions
const oldActions = `                        <button class="lead-action" onclick="event.stopPropagation(); moveToNext(${lead.id})" title="Далее">
                            ➡️
                        </button>`;

const newActions = `                        <button class="lead-action" onclick="event.stopPropagation(); moveToNext(${lead.id})" title="Далее">
                            ➡️
                        </button>
                        <button class="lead-action" onclick="event.stopPropagation(); markNotInterested(${lead.id})" title="Не зацікавлений" style="background: #f5576c;">
                            👎
                        </button>`;

content = content.replace(oldActions, newActions);

// 2. Add "Not Interested" tab in navigation
const oldNav = `                <a href="#" class="nav-link" onclick="showTab('quiz'); return false;">
                    📋 Квиз
                </a>`;

const newNav = `                <a href="#" class="nav-link" onclick="showTab('quiz'); return false;">
                    📋 Квиз
                </a>
                <a href="#" class="nav-link" onclick="showTab('not-interested'); return false;">
                    👎 Не зацікавлені
                </a>`;

content = content.replace(oldNav, newNav);

// 3. Add "Not Interested" tab content section
const quizTab = `        <!-- QUIZ TAB -->`;

const notInterestedTab = `        <!-- NOT INTERESTED TAB -->
        <div id="not-interested" class="tab-content">
            <header class="header">
                <h1>Не зацікавлені</h1>
                <button class="btn btn-secondary" onclick="exportNotInterested()">
                    📥 Експорт для TikTok
                </button>
            </header>
            <div id="not-interested-list" style="background:var(--bg-card);padding:30px;border-radius:16px;box-shadow:var(--shadow);border:1px solid var(--border);">
                <p style="text-align:center;color:var(--text-gray)">Завантаження...</p>
            </div>
        </div>
        
        <!-- QUIZ TAB -->`;

content = content.replace(quizTab, notInterestedTab);

// 4. Add markNotInterested function before closing script
const beforeClosingScript = `        // Drag & Drop`;

const markNotInterestedFunc = `        // Mark as Not Interested
        async function markNotInterested(leadId) {
            if (!confirm('Позначити ліда як незацікавленого?')) return;
            
            try {
                const { createClient } = window.supabase;
                const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                
                await supabase
                    .from('quiz_leads')
                    .update({ 
                        stage: 'not_interested',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', leadId);
                
                await loadData();
            } catch (error) {
                console.error('Error:', error);
                alert('Помилка: ' + error.message);
            }
        }
        
        // Render Not Interested Leads
        function renderNotInterested() {
            const notInterestedLeads = allLeads.filter(l => l.stage === 'not_interested');
            const container = document.getElementById('not-interested-list');
            
            if (notInterestedLeads.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-gray)">Немає незацікавлених лідів</p>';
                return;
            }
            
            container.innerHTML = notInterestedLeads.map(lead => {
                const date = new Date(lead.created_at).toLocaleDateString('uk');
                return \`
                    <div style="background:var(--bg-hover);padding:20px;border-radius:12px;margin-bottom:16px;border:1px solid var(--border);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <div style="font-weight:600;font-size:16px;margin-bottom:8px;">\${lead.name}</div>
                                <div style="color:var(--text-gray);font-size:14px;">📱 \${lead.phone}</div>
                                <div style="color:var(--text-gray);font-size:13px;margin-top:4px;">📅 \${date}</div>
                            </div>
                            <button class="btn btn-secondary" onclick="restoreLead(\${lead.id})">
                                ↩️ Повернути
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        // Restore lead back to funnel
        async function restoreLead(leadId) {
            try {
                const { createClient } = window.supabase;
                const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                
                await supabase
                    .from('quiz_leads')
                    .update({ stage: 'new' })
                    .eq('id', leadId);
                
                await loadData();
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        // Export Not Interested for TikTok
        function exportNotInterested() {
            const notInterestedLeads = allLeads.filter(l => l.stage === 'not_interested');
            
            if (notInterestedLeads.length === 0) {
                alert('Немає даних для експорту');
                return;
            }
            
            // CSV format for TikTok: phone,email
            const csv = 'phone,email\\n' + notInterestedLeads.map(lead => 
                \`\${lead.phone || ''},\${lead.email || ''}\`
            ).join('\\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`not-interested-\${new Date().toISOString().split('T')[0]}.csv\`;
            a.click();
        }
        
        // Drag & Drop`;

content = content.replace(beforeClosingScript, markNotInterestedFunc);

// 5. Update renderAll function to include not interested
const oldRenderAll = `        function renderAll() {
            renderKanban();
            renderQuizLeads();
            updateDashboard();
        }`;

const newRenderAll = `        function renderAll() {
            renderKanban();
            renderQuizLeads();
            renderNotInterested();
            updateDashboard();
        }`;

content = content.replace(oldRenderAll, newRenderAll);

fs.writeFileSync(file, content);
console.log('✅ Added "Not Interested" functionality!');

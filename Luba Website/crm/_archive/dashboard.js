// CRM Dashboard JavaScript
let currentUser = null;
let leads = [];
let charts = {};

// Supabase configuration
const SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTUyNTIsImV4cCI6MjA3Mzg3MTI1Mn0.Nme48al5xSVPlD4l40z6ZPwTkSL0uC3JQ300IZu7WBA';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Initialize Dashboard
async function initDashboard() {
    const token = localStorage.getItem('crm_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('app').innerHTML = getDashboardHTML();
    await loadLeads();
    initCharts();
    setupEventListeners();
    hideLoader();
}

// Dashboard HTML
function getDashboardHTML() {
    return `
        <div class="dashboard">
            <aside class="sidebar">
                <div class="logo">💰 Денежный Водопад</div>
                <ul class="nav-menu">
                    <li class="nav-item active" onclick="showSection('overview')">📊 Обзор</li>
                    <li class="nav-item" onclick="showSection('leads')">👥 Лиды</li>
                    <li class="nav-item" onclick="showSection('analytics')">📈 Аналитика</li>
                    <li class="nav-item" onclick="showSection('quiz')">📝 Квизы</li>
                </ul>
                <button class="btn btn-secondary logout-btn" onclick="logout()">Выход</button>
            </aside>
            
            <main class="main-content">
                <!-- Overview -->
                <section id="overview" class="section">
                    <div class="header">
                        <h1 class="page-title">Панель управления</h1>
                        <div class="header-actions">
                            <button class="btn btn-primary" onclick="openAddLeadModal()">
                                + Новый лид
                            </button>
                        </div>
                    </div>
                    
                    <div class="stats-grid" id="stats-grid"></div>
                    
                    <h2 style="margin: 30px 0 20px;">Воронка продаж</h2>
                    <div class="kanban-board" id="kanban-board"></div>
                </section>
                
                <!-- Leads -->
                <section id="leads" class="section" style="display: none;">
                    <div class="header">
                        <h1 class="page-title">Управление лидами</h1>
                        <div class="header-actions">
                            <input type="search" placeholder="Поиск..." class="form-input" 
                                   id="search-leads" onkeyup="searchLeads(this.value)">
                            <button class="btn btn-primary" onclick="openAddLeadModal()">
                                + Новый лид
                            </button>
                        </div>
                    </div>
                    
                    <div class="filters">
                        <select class="filter-select" onchange="filterLeads('source', this.value)">
                            <option value="">Все источники</option>
                            <option value="tiktok">TikTok</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="quiz">Квиз</option>
                            <option value="direct">Прямой</option>
                        </select>
                        <select class="filter-select" onchange="filterLeads('stage', this.value)">
                            <option value="">Все этапы</option>
                            <option value="contacted">Написали</option>
                            <option value="consultation">Консультация</option>
                            <option value="paid">Оплачено</option>
                        </select>
                    </div>
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Имя</th>
                                    <th>Телефон</th>
                                    <th>Email</th>
                                    <th>Возраст</th>
                                    <th>Источник</th>
                                    <th>Этап</th>
                                    <th>Сумма</th>
                                    <th>Дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody id="leads-table"></tbody>
                        </table>
                    </div>
                </section>
                
                <!-- Analytics -->
                <section id="analytics" class="section" style="display: none;">
                    <div class="header">
                        <h1 class="page-title">Аналитика</h1>
                    </div>
                    
                    <div class="charts-grid">
                        <div class="chart-container">
                            <h3 class="chart-title">Лиды по дням</h3>
                            <canvas id="leadsChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3 class="chart-title">Источники трафика</h3>
                            <canvas id="sourcesChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="charts-grid">
                        <div class="chart-container">
                            <h3 class="chart-title">Конверсия воронки</h3>
                            <canvas id="funnelChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3 class="chart-title">Доход по месяцам</h3>
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                </section>
                
                <!-- Quiz -->
                <section id="quiz" class="section" style="display: none;">
                    <div class="header">
                        <h1 class="page-title">Результаты квизов</h1>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Всего прошли</div>
                            <div class="stat-value" id="totalQuizzes">0</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Конверсия в заявку</div>
                            <div class="stat-value" id="quizConversion">0%</div>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <h3 style="margin-bottom: 20px;">Последние результаты</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Имя</th>
                                    <th>Email</th>
                                    <th>Телефон</th>
                                    <th>Результат</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody id="quiz-results-table"></tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
        
        <!-- Add Lead Modal -->
        <div class="modal" id="addLeadModal">
            <div class="modal-content">
                <h2 class="modal-header">Новый лид</h2>
                <form id="leadForm" onsubmit="saveLead(event)">
                    <div class="form-group">
                        <label class="form-label">Имя*</label>
                        <input type="text" class="form-input" name="name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Телефон*</label>
                        <input type="tel" class="form-input" name="phone" 
                               placeholder="+34654420334" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Возраст</label>
                        <input type="number" class="form-input" name="age" min="18" max="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Источник</label>
                        <select class="form-select" name="source">
                            <option value="direct">Прямой</option>
                            <option value="tiktok">TikTok</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="quiz">Квиз</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">UTM метка</label>
                        <input type="text" class="form-input" name="utm">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Заметка</label>
                        <textarea class="form-textarea" name="note"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Load leads from Supabase
async function loadLeads() {
    showLoader();
    try {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error, count } = await supabaseClient
            .from('quiz_leads')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase error details:', error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        leads = data || [];
        console.log(`✅ Loaded ${leads.length} leads from database (total: ${count})`);
        
        updateStats();
        renderKanban();
        renderLeadsTable();
        renderQuizResults();
    } catch (error) {
        console.error('Error loading leads:', error);
        alert(`Ошибка загрузки данных: ${error.message}\n\nПроверьте консоль для деталей.`);
        leads = []; // Fallback к пустому массиву
    }
    hideLoader();
}

// Save lead to Supabase
async function saveLead(event) {
    event.preventDefault();
    showLoader();
    
    const formData = new FormData(event.target);
    const leadData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email') || null,
        age: parseInt(formData.get('age')) || null,
        source: formData.get('source'),
        utm: formData.get('utm') || null,
        note: formData.get('note') || null,
        stage: 'contacted',
        status: 'new',
        amount: 0,
        created_at: new Date().toISOString()
    };
    
    try {
        const { data, error} = await supabaseClient
            .from('quiz_leads')
            .insert([leadData])
            .select();
        
        if (error) throw error;
        
        leads.unshift(data[0]);
        updateStats();
        renderKanban();
        renderLeadsTable();
        closeModal();
        event.target.reset();
    } catch (error) {
        console.error('Error saving lead:', error);
        alert('Ошибка при сохранении');
    }
    hideLoader();
}

// Update lead stage
async function updateLeadStage(leadId, newStage) {
    showLoader();
    try {
        let amount = 0;
        if (newStage === 'paid') {
            amount = prompt('Сумма оплаты (EUR):', '2000');
            if (!amount) return;
            amount = parseInt(amount);
        }
        
        const { error } = await supabaseClient
            .from('quiz_leads')
            .update({ 
                stage: newStage, 
                amount: amount || 0,
                updated_at: new Date().toISOString()
            })
            .eq('id', leadId);
        
        if (error) throw error;
        
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            lead.stage = newStage;
            if (amount) lead.amount = amount;
        }
        
        updateStats();
        renderKanban();
        renderLeadsTable();
    } catch (error) {
        console.error('Error updating lead:', error);
    }
    hideLoader();
}

// Delete lead
async function deleteLead(leadId) {
    if (!confirm('Удалить лида?')) return;
    
    showLoader();
    try {
        const { error } = await supabaseClient
            .from('quiz_leads')
            .delete()
            .eq('id', leadId);
        
        if (error) throw error;
        
        leads = leads.filter(l => l.id !== leadId);
        updateStats();
        renderKanban();
        renderLeadsTable();
    } catch (error) {
        console.error('Error deleting lead:', error);
    }
    hideLoader();
}

// Update statistics
function updateStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const todayLeads = leads.filter(l => new Date(l.created_at) >= today).length;
    const weekLeads = leads.filter(l => new Date(l.created_at) >= weekAgo).length;
    const monthLeads = leads.filter(l => new Date(l.created_at) >= monthAgo).length;
    
    const paidLeads = leads.filter(l => l.stage === 'paid');
    const monthRevenue = paidLeads
        .filter(l => new Date(l.created_at) >= monthAgo)
        .reduce((sum, l) => sum + (l.amount || 0), 0);
    
    const conversionRate = leads.length > 0 
        ? Math.round((paidLeads.length / leads.length) * 100) 
        : 0;
    
    const avgCheck = paidLeads.length > 0
        ? Math.round(paidLeads.reduce((sum, l) => sum + (l.amount || 0), 0) / paidLeads.length)
        : 0;
    
    document.getElementById('stats-grid').innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Лиды сегодня</div>
            <div class="stat-value">${todayLeads}</div>
            <div class="stat-change positive">↑ За сегодня</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Конверсия</div>
            <div class="stat-value">${conversionRate}%</div>
            <div class="stat-change positive">↑ В оплату</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Доход за месяц</div>
            <div class="stat-value">€${monthRevenue.toLocaleString()}</div>
            <div class="stat-change positive">↑ ${monthLeads} лидов</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Средний чек</div>
            <div class="stat-value">€${avgCheck.toLocaleString()}</div>
            <div class="stat-change">${paidLeads.length} продаж</div>
        </div>
    `;
}

// Render Kanban board
function renderKanban() {
    const stages = {
        contacted: { title: '📞 Написали', leads: [], amount: 0 },
        consultation: { title: '💬 Консультация', leads: [], amount: 0 },
        paid: { title: '💰 Оплачено', leads: [], amount: 0 }
    };
    
    leads.forEach(lead => {
        if (stages[lead.stage]) {
            stages[lead.stage].leads.push(lead);
            stages[lead.stage].amount += lead.amount || 0;
        }
    });
    
    let html = '';
    for (const [stage, data] of Object.entries(stages)) {
        html += `
            <div class="kanban-column" data-stage="${stage}" 
                 ondrop="handleDrop(event)" ondragover="allowDrop(event)">
                <div class="column-header">
                    <span class="column-title">${data.title}</span>
                    <span class="column-count">${data.leads.length}</span>
                </div>
                <div class="column-amount" style="margin-bottom: 15px; color: #6b7280;">
                    €${data.amount.toLocaleString()}
                </div>
                <div class="leads-container">
                    ${data.leads.map(lead => getLeadCard(lead)).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('kanban-board').innerHTML = html;
}

// Get lead card HTML
function getLeadCard(lead) {
    return `
        <div class="lead-card" draggable="true" data-lead-id="${lead.id}"
             ondragstart="handleDragStart(event)">
            <div class="lead-header">
                <div class="lead-name">${lead.name}</div>
                ${lead.amount ? `<div class="lead-amount">€${lead.amount}</div>` : ''}
            </div>
            <div class="lead-info">
                ${lead.phone}<br>
                ${lead.age ? `Возраст: ${lead.age}<br>` : ''}
                ${new Date(lead.created_at).toLocaleDateString()}
            </div>
            <div class="lead-tags">
                <span class="tag tag-${lead.source}">${lead.source}</span>
                ${lead.status === 'new' ? '<span class="tag tag-new">NEW</span>' : ''}
                ${lead.hot ? '<span class="tag tag-hot">🔥 HOT</span>' : ''}
            </div>
            <div class="lead-actions">
                <button class="btn btn-success" onclick="openWhatsApp('${lead.phone}')">
                    WhatsApp
                </button>
                <button class="btn btn-primary" onclick="moveToNext('${lead.id}', '${lead.stage}')">
                    Далее →
                </button>
            </div>
        </div>
    `;
}

// Render leads table
function renderLeadsTable() {
    const tbody = document.getElementById('leads-table');
    if (!tbody) return;
    
    tbody.innerHTML = leads.map(lead => `
        <tr>
            <td><strong>${lead.name}</strong></td>
            <td>${lead.phone}</td>
            <td>${lead.email || '-'}</td>
            <td>${lead.age || '-'}</td>
            <td><span class="tag tag-${lead.source}">${lead.source}</span></td>
            <td>${getStageLabel(lead.stage)}</td>
            <td>${lead.amount ? `€${lead.amount}` : '-'}</td>
            <td>${new Date(lead.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-success" onclick="openWhatsApp('${lead.phone}')">
                    WA
                </button>
                <button class="btn btn-danger" onclick="deleteLead(${lead.id})">
                    ✕
                </button>
            </td>
        </tr>
    `).join('');
}

// Render quiz results
function renderQuizResults() {
    const quizLeads = leads.filter(l => l.source === 'quiz');
    const tbody = document.getElementById('quiz-results-table');
    
    if (tbody) {
        tbody.innerHTML = quizLeads.map(lead => `
            <tr>
                <td>${lead.name}</td>
                <td>${lead.email || '-'}</td>
                <td>${lead.phone}</td>
                <td>${lead.quiz_answers ? 'Денежный блок' : '-'}</td>
                <td>${new Date(lead.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('') || '<tr><td colspan="5">Нет результатов</td></tr>';
    }
    
    const totalQuizzes = document.getElementById('totalQuizzes');
    const quizConversion = document.getElementById('quizConversion');
    
    if (totalQuizzes) totalQuizzes.textContent = quizLeads.length;
    if (quizConversion) {
        const conv = quizLeads.length > 0 
            ? Math.round((quizLeads.filter(l => l.stage !== 'contacted').length / quizLeads.length) * 100)
            : 0;
        quizConversion.textContent = conv + '%';
    }
}

// Drag and Drop
let draggedLead = null;

function handleDragStart(e) {
    draggedLead = e.target;
    e.target.style.opacity = '0.5';
}

function allowDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedLead) {
        const leadId = parseInt(draggedLead.dataset.leadId);
        const newStage = e.currentTarget.dataset.stage;
        draggedLead.style.opacity = '';
        updateLeadStage(leadId, newStage);
    }
}

// Move to next stage
function moveToNext(leadId, currentStage) {
    const stages = ['contacted', 'consultation', 'paid'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
        updateLeadStage(parseInt(leadId), stages[currentIndex + 1]);
    }
}

// Open WhatsApp
function openWhatsApp(phone) {
    const message = encodeURIComponent('Здравствуйте! Это Любовь Лукащук. Вы оставили заявку на программу "Денежный Водопад".');
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
}

// Search leads
function searchLeads(query) {
    const filtered = leads.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.phone.includes(query) ||
        (l.email && l.email.includes(query))
    );
    
    leads = filtered;
    renderLeadsTable();
    renderKanban();
}

// Filter leads
function filterLeads(field, value) {
    loadLeads(); // Reload all leads
    if (value) {
        leads = leads.filter(l => l[field] === value);
        renderLeadsTable();
        renderKanban();
    }
}

// Show section
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.target.classList.add('active');
    
    if (section === 'analytics') {
        updateCharts();
    }
}

// Initialize charts
function initCharts() {
    const ctxLeads = document.getElementById('leadsChart');
    const ctxSources = document.getElementById('sourcesChart');
    const ctxFunnel = document.getElementById('funnelChart');
    const ctxRevenue = document.getElementById('revenueChart');
    
    if (ctxLeads) {
        charts.leads = new Chart(ctxLeads, {
            type: 'line',
            data: getLeadsChartData(),
            options: getLineChartOptions()
        });
    }
    
    if (ctxSources) {
        charts.sources = new Chart(ctxSources, {
            type: 'doughnut',
            data: getSourcesChartData(),
            options: getDoughnutChartOptions()
        });
    }
    
    if (ctxFunnel) {
        charts.funnel = new Chart(ctxFunnel, {
            type: 'bar',
            data: getFunnelChartData(),
            options: getBarChartOptions()
        });
    }
    
    if (ctxRevenue) {
        charts.revenue = new Chart(ctxRevenue, {
            type: 'bar',
            data: getRevenueChartData(),
            options: getBarChartOptions()
        });
    }
}

// Chart data functions
function getLeadsChartData() {
    const last7Days = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        last7Days.push(date.toLocaleDateString('ru', { day: 'numeric', month: 'short' }));
        counts.push(leads.filter(l => {
            const leadDate = new Date(l.created_at);
            leadDate.setHours(0, 0, 0, 0);
            return leadDate.getTime() === date.getTime();
        }).length);
    }
    
    return {
        labels: last7Days,
        datasets: [{
            label: 'Лиды',
            data: counts,
            borderColor: '#6b46c1',
            backgroundColor: 'rgba(107, 70, 193, 0.1)',
            tension: 0.4
        }]
    };
}

function getSourcesChartData() {
    const sources = {};
    leads.forEach(l => {
        sources[l.source] = (sources[l.source] || 0) + 1;
    });
    
    return {
        labels: Object.keys(sources),
        datasets: [{
            data: Object.values(sources),
            backgroundColor: ['#000', '#E4405F', '#1877f2', '#fbbf24', '#10b981']
        }]
    };
}

function getFunnelChartData() {
    const stages = {
        'Написали': leads.filter(l => l.stage === 'contacted').length,
        'Консультация': leads.filter(l => l.stage === 'consultation').length,
        'Оплачено': leads.filter(l => l.stage === 'paid').length
    };
    
    return {
        labels: Object.keys(stages),
        datasets: [{
            label: 'Количество',
            data: Object.values(stages),
            backgroundColor: ['#6b46c1', '#fbbf24', '#10b981']
        }]
    };
}

function getRevenueChartData() {
    const months = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = month.toLocaleDateString('ru', { month: 'short' });
        months[key] = 0;
    }
    
    leads.filter(l => l.stage === 'paid').forEach(l => {
        const month = new Date(l.created_at).toLocaleDateString('ru', { month: 'short' });
        if (months[month] !== undefined) {
            months[month] += l.amount || 0;
        }
    });
    
    return {
        labels: Object.keys(months),
        datasets: [{
            label: 'Доход €',
            data: Object.values(months),
            backgroundColor: '#6b46c1'
        }]
    };
}

// Chart options
function getLineChartOptions() {
    return {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };
}

function getDoughnutChartOptions() {
    return {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    };
}

function getBarChartOptions() {
    return {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };
}

// Update charts
function updateCharts() {
    if (charts.leads) {
        charts.leads.data = getLeadsChartData();
        charts.leads.update();
    }
    if (charts.sources) {
        charts.sources.data = getSourcesChartData();
        charts.sources.update();
    }
    if (charts.funnel) {
        charts.funnel.data = getFunnelChartData();
        charts.funnel.update();
    }
    if (charts.revenue) {
        charts.revenue.data = getRevenueChartData();
        charts.revenue.update();
    }
}

// Modal functions
function openAddLeadModal() {
    document.getElementById('addLeadModal').classList.add('active');
}

function closeModal() {
    document.querySelector('.modal.active')?.classList.remove('active');
}

// Helper functions
function getStageLabel(stage) {
    const labels = {
        contacted: 'Написали',
        consultation: 'Консультация',
        paid: 'Оплачено'
    };
    return labels[stage] || stage;
}

function showLoader() {
    document.getElementById('loader')?.classList.add('active');
}

function hideLoader() {
    document.getElementById('loader')?.classList.remove('active');
}

// Logout
function logout() {
    localStorage.removeItem('crm_token');
    window.location.href = 'login.html';
}

// Setup event listeners
function setupEventListeners() {
    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });
}

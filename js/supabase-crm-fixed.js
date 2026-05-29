// ИСПРАВЛЕННЫЙ КОД ДЛЯ РАБОТЫ С SUPABASE БЕЗ ПРОБЛЕМ
// Этот код заменяет часть в quiz/index.html

// Supabase Configuration - УЖЕ НАСТРОЕНО!
const SUPABASE_URL = 'https://rtlbzfvvmrwqwhsgybrp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bGJ6ZnZ2bXJ3cXdoc2d5YnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTQ2MjUsImV4cCI6MjA5NTU3MDYyNX0.K4CF5evvHhTAAYKAc3dn3s9so9jL5Zzjln5qnDMCqtk';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// УЛУЧШЕННАЯ функция сохранения лида
async function saveLeadToSupabase(leadData) {
    try {
        console.log('Отправка в Supabase:', leadData);
        
        // 1. Сохраняем в quiz_leads (основная таблица для квизов)
        const quizData = {
            name: leadData.name || 'Не указано',
            email: leadData.email || null, // Теперь необязательное поле
            phone: leadData.whatsapp || leadData.phone || 'Не указано',
            age: leadData.age ? parseInt(leadData.age) : null,
            quiz_type: 'money_blocks',
            answers: leadData.answers || {},
            result: leadData.quiz_result || document.getElementById('resultTitle')?.textContent || 'Не определено',
            utm_source: leadData.utm_source || null,
            utm_medium: leadData.utm_medium || null,
            utm_campaign: leadData.utm_campaign || null,
            main_block: leadData.main_block || document.getElementById('resultTitle')?.textContent || null,
            quiz_answers: leadData.answers || {}
        };
        
        const { data: quizInsert, error: quizError } = await supabaseClient
            .from('quiz_leads')
            .insert(quizData)
            .select();
        
        if (quizError) {
            console.error('Ошибка quiz_leads:', quizError);
        } else {
            console.log('✅ Сохранено в quiz_leads:', quizInsert);
        }
        
        // 2. Дублируем в crm_leads для общей CRM
        const crmData = {
            name: leadData.name || 'Не указано',
            email: leadData.email || null,
            phone: leadData.whatsapp || leadData.phone || 'Не указано',
            age: leadData.age ? parseInt(leadData.age) : null,
            source: 'Quiz: Money Blocks',
            utm_source: leadData.utm_source || null,
            utm_medium: leadData.utm_medium || null,
            utm_campaign: leadData.utm_campaign || null,
            stage: 'new',
            status: 'new',
            amount: 0,
            hot: false,
            main_block: leadData.main_block || document.getElementById('resultTitle')?.textContent || null,
            quiz_answers: leadData.answers || {},
            note: `Результат квиза: ${leadData.quiz_result || 'Не определено'}`
        };
        
        const { data: crmInsert, error: crmError } = await supabaseClient
            .from('crm_leads')
            .insert(crmData)
            .select();
        
        if (crmError) {
            console.error('Ошибка crm_leads:', crmError);
        } else {
            console.log('✅ Сохранено в crm_leads:', crmInsert);
        }
        
        // 3. Если оба сохранения прошли успешно
        if (!quizError || !crmError) {
            console.log('🎉 Лид успешно сохранен в Supabase!');
            
            // Показываем уведомление
            showSuccessNotification(leadData.name);
            
            return true;
        }
        
    } catch (error) {
        console.error('Критическая ошибка:', error);
        
        // Сохраняем локально как резерв
        saveToLocalStorage(leadData);
        
        return false;
    }
}

// Функция для резервного локального сохранения
function saveToLocalStorage(leadData) {
    try {
        const leads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
        leads.push({
            ...leadData,
            saved_at: new Date().toISOString(),
            synced: false
        });
        localStorage.setItem('crmLeads', JSON.stringify(leads));
        console.log('💾 Сохранено локально как резерв');
    } catch (error) {
        console.error('Ошибка локального сохранения:', error);
    }
}

// Функция показа уведомления об успехе
function showSuccessNotification(name) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <strong>✅ Успешно!</strong><br>
        Лид ${name} сохранен в базе данных.
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS анимации (добавить в <style>)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ТЕСТОВАЯ ФУНКЦИЯ - проверка подключения
async function testSupabaseConnection() {
    try {
        console.log('🔍 Проверка подключения к Supabase...');
        
        // Пробуем получить данные
        const { data, error } = await supabaseClient
            .from('crm_leads')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Ошибка подключения:', error);
            return false;
        } else {
            console.log('✅ Supabase подключен успешно!');
            return true;
        }
    } catch (error) {
        console.error('❌ Критическая ошибка:', error);
        return false;
    }
}

// Функция синхронизации несохраненных лидов
async function syncUnsavedLeads() {
    const unsavedLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]')
        .filter(lead => !lead.synced);
    
    if (unsavedLeads.length === 0) return;
    
    console.log(`📤 Синхронизация ${unsavedLeads.length} несохраненных лидов...`);
    
    for (const lead of unsavedLeads) {
        const success = await saveLeadToSupabase(lead);
        if (success) {
            lead.synced = true;
        }
    }
    
    // Обновляем localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    localStorage.setItem('crmLeads', JSON.stringify(allLeads));
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем подключение
    const connected = await testSupabaseConnection();
    
    if (connected) {
        // Синхронизируем несохраненные лиды
        await syncUnsavedLeads();
    } else {
        console.warn('⚠️ Работаем в офлайн режиме. Данные сохраняются локально.');
    }
});

// Экспортируем функции
window.SupabaseCRM = {
    save: saveLeadToSupabase,
    test: testSupabaseConnection,
    sync: syncUnsavedLeads
};
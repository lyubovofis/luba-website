// SIMPLE CRM SOLUTION - БЕЗ JWT, БЕЗ POLICIES, БЕЗ ГОЛОВНОЙ БОЛИ
// Используем Google Sheets как базу данных через Google Apps Script

const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// Функция отправки данных в Google Sheets
async function saveToGoogleSheets(leadData) {
    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', // Обходим CORS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                name: leadData.name || 'Не указано',
                phone: leadData.whatsapp || leadData.phone || 'Не указано',
                email: leadData.email || 'Не указано',
                age: leadData.age || 'Не указано',
                source: leadData.source || 'Quiz',
                utm_source: leadData.utm_source || 'direct',
                utm_medium: leadData.utm_medium || 'none',
                utm_campaign: leadData.utm_campaign || 'none',
                quiz_result: leadData.quiz_result || 'Не определено',
                page_url: window.location.href,
                referrer: document.referrer || 'Прямой заход'
            })
        });
        
        console.log('✅ Отправлено в Google Sheets');
        return true;
    } catch (error) {
        console.error('Ошибка отправки в Google Sheets:', error);
        // Сохраняем локально как резерв
        saveToLocalBackup(leadData);
        return false;
    }
}

// Резервное сохранение локально
function saveToLocalBackup(leadData) {
    try {
        const existingData = JSON.parse(localStorage.getItem('pending_leads') || '[]');
        existingData.push({
            ...leadData,
            saved_at: new Date().toISOString()
        });
        localStorage.setItem('pending_leads', JSON.stringify(existingData));
        console.log('💾 Сохранено локально для последующей отправки');
        
        // Показываем количество несохраненных лидов (для отладки)
        console.log(`Несохраненных лидов: ${existingData.length}`);
    } catch (error) {
        console.error('Ошибка локального сохранения:', error);
    }
}

// Функция повторной отправки несохраненных лидов
async function retrySendingLeads() {
    const pendingLeads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
    
    if (pendingLeads.length === 0) return;
    
    console.log(`Попытка отправить ${pendingLeads.length} несохраненных лидов...`);
    
    const successfullyS: []
    
    for (const lead of pendingLeads) {
        const success = await saveToGoogleSheets(lead);
        if (success) {
            successfullySent.push(lead);
        }
    }
    
    // Удаляем успешно отправленные
    const remaining = pendingLeads.filter(lead => !successfullySent.includes(lead));
    localStorage.setItem('pending_leads', JSON.stringify(remaining));
    
    console.log(`✅ Отправлено: ${successfullySent.length}, Осталось: ${remaining.length}`);
}

// Запускаем повторную отправку каждые 5 минут
setInterval(retrySendingLeads, 5 * 60 * 1000);

// При загрузке страницы пробуем отправить несохраненные
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(retrySendingLeads, 5000); // Через 5 секунд после загрузки
});

// ЭКСПОРТ ФУНКЦИЙ ДЛЯ ИСПОЛЬЗОВАНИЯ
window.SimpleCRM = {
    save: saveToGoogleSheets,
    retry: retrySendingLeads,
    getPending: () => JSON.parse(localStorage.getItem('pending_leads') || '[]')
};
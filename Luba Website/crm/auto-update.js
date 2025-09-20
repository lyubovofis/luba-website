// Добавить в CRM (index.html) для автоматического получения лидов с API

// Автоматическое обновление лидов с WhatsApp API
async function fetchWhatsAppLeads() {
    try {
        const response = await fetch('https://yourdomain.com/api/leads');
        const apiLeads = await response.json();
        
        // Объединяем с локальными лидами
        apiLeads.forEach(apiLead => {
            const exists = leads.find(l => l.phone === apiLead.phone);
            if (!exists) {
                leads.push(apiLead);
                
                // Трекаем событие
                trackWhatsAppContact(apiLead);
            }
        });
        
        saveLeads();
        applyFilters();
    } catch (error) {
        console.log('API не доступен, работаем локально');
    }
}

// Обновляем каждые 30 секунд
setInterval(fetchWhatsAppLeads, 30000);
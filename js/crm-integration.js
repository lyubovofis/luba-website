// Интеграция с WhatsApp кликами - добавить в tiktok-events.js
function trackWhatsAppClickWithCRM() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Собираем данные о клике
            const leadData = {
                timestamp: new Date().toISOString(),
                source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
                campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
                content: new URLSearchParams(window.location.search).get('utm_content') || '',
                button_location: this.closest('section')?.id || 'unknown',
                button_text: this.textContent.trim() || 'whatsapp',
                page_url: window.location.pathname,
                referrer: document.referrer
            };
            
            // Сохраняем для CRM
            let crmQueue = JSON.parse(localStorage.getItem('crmQueue')) || [];
            crmQueue.push(leadData);
            localStorage.setItem('crmQueue', JSON.stringify(crmQueue));
            
            // Также сохраняем в sessionStorage для быстрого доступа
            sessionStorage.setItem('lastWhatsAppClick', JSON.stringify(leadData));
        });
    });
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', trackWhatsAppClickWithCRM);

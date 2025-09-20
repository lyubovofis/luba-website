// Google Analytics 4 Conversion Tracking
// Добавить в конец файла tiktok-events.js или создать отдельный файл

// Проверка загрузки GA4
function checkGA4() {
    return typeof gtag !== 'undefined';
}

// Универсальная функция отправки событий
function trackGA4Event(eventName, parameters = {}) {
    if (checkGA4()) {
        gtag('event', eventName, parameters);
        console.log('GA4 Event:', eventName, parameters);
    }
}

// Отслеживание ключевых конверсий
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. WhatsApp клики (уже есть в tiktok-events.js, добавляем GA4)
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Определяем источник клика
            const button_location = this.closest('section')?.id || 'unknown';
            const button_text = this.textContent.trim() || 'whatsapp';
            
            // Отправляем как конверсию в GA4 с дополнительными параметрами
            trackGA4Event('generate_lead', {
                'event_category': 'engagement',
                'event_label': 'whatsapp_click',
                'button_location': button_location,
                'button_text': button_text,
                'page_url': window.location.pathname,
                'utm_source': new URLSearchParams(window.location.search).get('utm_source') || 'direct',
                'utm_campaign': new URLSearchParams(window.location.search).get('utm_campaign') || 'none',
                'value': 50,
                'currency': 'EUR'
            });
        });
    });
    
    // 2. Просмотр секции с ценами
    const pricingSection = document.querySelector('#pricing, .pricing');
    if (pricingSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackGA4Event('view_item', {
                        'event_category': 'engagement',
                        'event_label': 'pricing_viewed',
                        'items': [{
                            'item_name': 'Программа 8 недель',
                            'price': 2000,
                            'currency': 'EUR'
                        }]
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(pricingSection);
    }
    
    // 3. Скролл глубины страницы
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Отслеживаем 25%, 50%, 75%, 90%
        [25, 50, 75, 90].forEach(threshold => {
            if (scrollPercent >= threshold && maxScroll < threshold) {
                maxScroll = threshold;
                trackGA4Event('scroll', {
                    'event_category': 'engagement',
                    'event_label': `${threshold}_percent`,
                    'value': threshold
                });
            }
        });
    });
    
    // 4. Время на сайте (30 сек, 1 мин, 3 мин)
    const timeThresholds = [
        { time: 30000, label: '30_seconds' },
        { time: 60000, label: '1_minute' },
        { time: 180000, label: '3_minutes' }
    ];
    
    timeThresholds.forEach(threshold => {
        setTimeout(() => {
            trackGA4Event('time_on_page', {
                'event_category': 'engagement',
                'event_label': threshold.label
            });
        }, threshold.time);
    });
});

// Экспорт функций для использования
window.GA4Tracking = {
    trackGA4Event,
    trackPurchase: function(value) {
        trackGA4Event('purchase', {
            'transaction_id': Date.now().toString(),
            'value': value,
            'currency': 'EUR',
            'items': [{
                'item_name': 'Программа трансформации',
                'price': value,
                'quantity': 1
            }]
        });
    }
};

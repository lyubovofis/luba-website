// ПРАВИЛЬНЫЙ ТРЕКИНГ КОНВЕРСИЙ ДЛЯ ДЕНЕЖНОГО ВОДОПАДА
// =================================================

// 1. НАПИСАЛ В WHATSAPP (первый контакт)
function trackWhatsAppContact(source = 'direct') {
    const eventData = {
        content_name: 'WhatsApp Contact',
        content_category: 'lead',
        content_type: 'message',
        value: 0,
        currency: 'EUR',
        source: source // tiktok, instagram, facebook
    };
    
    // TikTok - Lead событие
    if (typeof ttq !== 'undefined') {
        ttq.track('Contact', eventData);
        ttq.track('Lead', eventData); // дублируем для алгоритмов
    }
    
    // Facebook - Lead событие
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', eventData);
        fbq('track', 'Contact', eventData);
    }
    
    console.log('✅ Tracked: WhatsApp Contact', eventData);
}

// 2. ЗАПИСАЛСЯ НА КОНСУЛЬТАЦИЮ
function trackConsultationBooked(leadName = '', leadPhone = '') {
    const eventData = {
        content_name: 'Free Consultation Booked',
        content_category: 'consultation',
        content_type: 'appointment',
        value: 100, // показываем ценность лида
        currency: 'EUR',
        predicted_ltv: 2000, // прогнозируемая ценность
        lead_name: leadName,
        lead_phone: leadPhone
    };
    
    // TikTok - InitiateCheckout (начало покупки)
    if (typeof ttq !== 'undefined') {
        ttq.track('InitiateCheckout', eventData);
        ttq.track('Schedule', eventData);
    }
    
    // Facebook - Schedule событие
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Schedule', eventData);
        fbq('track', 'InitiateCheckout', eventData);
    }
    
    console.log('✅ Tracked: Consultation Booked', eventData);
}

// 3. КУПИЛ ПАКЕТ (конверсия)
function trackPurchase(packagePrice = 2000, packageName = '8 недель трансформации') {
    const eventData = {
        content_name: packageName,
        content_category: 'program',
        content_type: 'transformation',
        content_ids: ['program_' + packagePrice],
        value: packagePrice,
        currency: 'EUR',
        num_items: 1
    };
    
    // TikTok - Purchase событие
    if (typeof ttq !== 'undefined') {
        ttq.track('PlaceAnOrder', eventData);
        ttq.track('Purchase', eventData); // для некоторых аккаунтов
    }
    
    // Facebook - Purchase событие  
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', eventData);
    }
    
    // Google Analytics - транзакция
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: 'order_' + Date.now(),
            value: packagePrice,
            currency: 'EUR',
            items: [{
                id: 'program_' + packagePrice,
                name: packageName,
                category: 'coaching',
                quantity: 1,
                price: packagePrice
            }]
        });
    }
    
    console.log('✅ Tracked: Purchase', eventData);
}

// 4. МИКРО-КОНВЕРСИИ (для обучения пикселей)
function trackMicroConversion(action, value = 0) {
    const actions = {
        'view_price': { event: 'ViewContent', value: 10 },
        'click_testimonial': { event: 'ViewContent', value: 20 },
        'scroll_50': { event: 'ViewContent', value: 5 },
        'time_on_site_60s': { event: 'TimeOnPage', value: 15 },
        'quiz_start': { event: 'InitiateCheckout', value: 30 },
        'quiz_complete': { event: 'CompleteRegistration', value: 50 }
    };
    
    const config = actions[action] || { event: 'ViewContent', value: value };
    
    const eventData = {
        content_name: action,
        content_type: 'micro_conversion',
        value: config.value,
        currency: 'EUR'
    };
    
    if (typeof ttq !== 'undefined') {
        ttq.track(config.event, eventData);
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', config.event, eventData);
    }
}

// 5. АВТОМАТИЧЕСКИЙ ТРЕКИНГ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    // Трекаем все клики на WhatsApp
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
        link.addEventListener('click', function() {
            const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
            trackWhatsAppContact(source);
        });
    });
    
    // Трекаем время на сайте
    setTimeout(() => trackMicroConversion('time_on_site_60s'), 60000);
    
    // Трекаем скролл
    let scrollTracked = false;
    window.addEventListener('scroll', function() {
        if (!scrollTracked && window.pageYOffset > document.body.scrollHeight * 0.5) {
            scrollTracked = true;
            trackMicroConversion('scroll_50');
        }
    });
});

// ЭКСПОРТ ДЛЯ ИСПОЛЬЗОВАНИЯ В CRM
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackWhatsAppContact,
        trackConsultationBooked,
        trackPurchase,
        trackMicroConversion
    };
}

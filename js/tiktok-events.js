// TikTok Pixel Events Tracking
// Файл для отслеживания важных событий на сайте

// Проверяем, что TikTok Pixel загружен
function checkTikTokPixel() {
    return typeof ttq !== 'undefined';
}

// Функция для безопасной отправки событий
function trackTikTokEvent(eventName, eventData = {}) {
    if (checkTikTokPixel()) {
        try {
            ttq.track(eventName, eventData);
            console.log('TikTok Event tracked:', eventName, eventData);
        } catch (error) {
            console.error('Error tracking TikTok event:', error);
        }
    } else {
        console.warn('TikTok Pixel not loaded yet');
    }
}

// Отслеживание кликов на WhatsApp
function trackWhatsAppClick() {
    trackTikTokEvent('Contact', {
        content_type: 'whatsapp',
        content_name: 'WhatsApp Click',
        value: 50,
        currency: 'EUR'
    });
    
    // Google Analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': 'contact',
            'value': 50
        });
    }
}

// Отслеживание кликов на Telegram
function trackTelegramClick() {
    trackTikTokEvent('Contact', {
        content_type: 'telegram',
        content_name: 'Telegram Click',
        value: 50,
        currency: 'EUR'
    });
    
    // Google Analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'telegram_click', {
            'event_category': 'engagement',
            'event_label': 'contact',
            'value': 50
        });
    }
}

// Отслеживание отправки форм
function trackFormSubmit(formName = 'default') {
    trackTikTokEvent('SubmitForm', {
        content_name: formName,
        content_type: 'lead_form'
    });
}

// Отслеживание начала квиза
function trackQuizStart() {
    trackTikTokEvent('InitiateCheckout', {
        content_type: 'quiz',
        content_name: 'Money Block Quiz'
    });
}

// Отслеживание завершения квиза
function trackQuizComplete() {
    trackTikTokEvent('CompleteRegistration', {
        content_type: 'quiz_completed',
        value: 50,
        currency: 'EUR'
    });
}

// Отслеживание просмотра важных секций
function trackSectionView(sectionName) {
    trackTikTokEvent('ViewContent', {
        content_name: sectionName,
        content_type: 'section'
    });
}

// Отслеживание клика на кнопку CTA
function trackCTAClick(buttonName) {
    trackTikTokEvent('ClickButton', {
        content_name: buttonName,
        content_type: 'cta_button'
    });
}

// Автоматическое отслеживание при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    
    // Находим все ссылки на WhatsApp и добавляем отслеживание
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', trackWhatsAppClick);
    });
    
    // Находим все ссылки на Telegram и добавляем отслеживание
    const telegramLinks = document.querySelectorAll('a[href*="t.me"], a[href*="telegram"]');
    telegramLinks.forEach(link => {
        link.addEventListener('click', trackTelegramClick);
    });
    
    // Отслеживание всех форм на странице
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formName = form.getAttribute('name') || form.getAttribute('id') || 'unnamed_form';
            trackFormSubmit(formName);
        });
    });
    
    // Отслеживание CTA кнопок
    const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, [class*="cta"], [class*="button"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = button.textContent.trim() || 'Unknown Button';
            trackCTAClick(buttonText);
        });
    });
    
    // Отслеживание скролла до важных секций (50% видимости)
    const importantSections = document.querySelectorAll('.pricing, .testimonials, .results, .problems');
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionClass = entry.target.className;
                        trackSectionView(sectionClass);
                        sectionObserver.unobserve(entry.target); // Отслеживаем только первый просмотр
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        importantSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
});

// Экспортируем функции для использования в других скриптах
window.TikTokTracking = {
    trackWhatsAppClick,
    trackTelegramClick,
    trackFormSubmit,
    trackQuizStart,
    trackQuizComplete,
    trackSectionView,
    trackCTAClick,
    trackTikTokEvent
};

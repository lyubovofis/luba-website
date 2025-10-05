// TikTok Enhanced Events Tracking v2.0
// Исправляет все проблемы с конверсиями для проекта "Денежный Водопад"

(function() {
    'use strict';
    
    // Ждем загрузки TikTok Pixel
    function waitForTikTok(callback) {
        if (typeof ttq !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForTikTok(callback), 100);
        }
    }
    
    // Безопасная отправка событий с полными параметрами
    function trackEvent(eventName, params = {}) {
        waitForTikTok(() => {
            // Добавляем обязательные параметры
            const eventParams = {
                content_type: params.content_type || 'product',
                content_id: params.content_id || `waterfall_${eventName.toLowerCase()}`,
                content_name: params.content_name || 'Денежный Водопад',
                value: params.value || 2000,
                currency: params.currency || 'EUR',
                ...params
            };
            
            try {
                ttq.track(eventName, eventParams);
                console.log(`✅ TikTok Event: ${eventName}`, eventParams);
            } catch (error) {
                console.error(`❌ TikTok Event Error: ${eventName}`, error);
            }
        });
    }
    
    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        
        // 1. ViewContent для важных секций (исправляем низкий показатель)
        const importantSections = [
            { selector: '.hero', name: 'Hero Section' },
            { selector: '.problems', name: 'Проблемы аудитории' },
            { selector: '.transformation', name: 'Трансформация' },
            { selector: '.testimonials', name: 'Отзывы' },
            { selector: '.pricing', name: 'Цены' },
            { selector: '.results', name: 'Результаты' }
        ];
        
        // Отслеживаем просмотр каждой секции
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionName = entry.target.getAttribute('data-section-name') || 
                                          entry.target.className;
                        trackEvent('ViewContent', {
                            content_name: `Section: ${sectionName}`,
                            content_id: `section_${sectionName.toLowerCase().replace(/\s+/g, '_')}`,
                            value: 100
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 }); // Срабатывает при 30% видимости
            
            importantSections.forEach(section => {
                const element = document.querySelector(section.selector);
                if (element) {
                    element.setAttribute('data-section-name', section.name);
                    observer.observe(element);
                }
            });
        }
        
        // 2. Contact - для WhatsApp и Telegram (правильный номер +34654420334)
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], .whatsapp-button, .whatsapp-link');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackEvent('Contact', {
                    content_name: 'WhatsApp Консультация',
                    content_id: 'whatsapp_34654420334',
                    value: 500
                });
            });
        });
        
        const telegramLinks = document.querySelectorAll('a[href*="t.me"], a[href*="telegram"], .telegram-button');
        telegramLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackEvent('Contact', {
                    content_name: 'Telegram Консультация',
                    content_id: 'telegram_contact',
                    value: 500
                });
            });
        });
        
        // 3. InitiateCheckout - исправляем warning
        // Отслеживаем начало процесса (клики на CTA кнопки)
        const ctaButtons = document.querySelectorAll(
            '.cta-button, .btn-primary, .quiz-start-button, [data-action="start-quiz"]'
        );
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const buttonText = button.textContent.trim();
                
                // Проверяем, не квиз ли это
                if (buttonText.toLowerCase().includes('тест') || 
                    buttonText.toLowerCase().includes('quiz') ||
                    button.classList.contains('quiz-start')) {
                    
                    trackEvent('InitiateCheckout', {
                        content_name: 'Начало квиза',
                        content_id: 'quiz_start',
                        value: 200
                    });
                } else {
                    trackEvent('ClickButton', {
                        content_name: buttonText,
                        content_id: 'cta_button',
                        value: 100
                    });
                }
            });
        });
        
        // 4. SubmitForm - для всех форм
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const formName = form.getAttribute('name') || 
                               form.getAttribute('id') || 
                               'contact_form';
                
                // Определяем тип формы
                if (formName.includes('quiz')) {
                    trackEvent('CompleteRegistration', {
                        content_name: 'Квиз завершен',
                        content_id: 'quiz_complete',
                        value: 1000
                    });
                } else if (formName.includes('contact') || formName.includes('lead')) {
                    trackEvent('SubmitForm', {
                        content_name: 'Форма контакта',
                        content_id: 'lead_form',
                        value: 500
                    });
                }
            });
        });
        
        // 5. Новое событие: CompleteRegistration для email в квизе
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.value && input.value.includes('@')) {
                    trackEvent('AddPaymentInfo', {
                        content_name: 'Email добавлен',
                        content_id: 'email_captured',
                        value: 300
                    });
                }
            });
        });
        
        // 6. Place an Order - для финальных действий
        const orderButtons = document.querySelectorAll(
            '[data-action="book-consultation"], .book-consultation, .final-cta'
        );
        
        orderButtons.forEach(button => {
            button.addEventListener('click', function() {
                trackEvent('PlaceAnOrder', {
                    content_name: 'Запись на консультацию',
                    content_id: 'consultation_booked',
                    value: 2000
                });
            });
        });
        
        // 7. Отслеживание времени на странице (для ретаргетинга)
        let timeOnPage = 0;
        let pageTimer = setInterval(() => {
            timeOnPage += 10;
            
            // Отправляем событие каждые 30 секунд
            if (timeOnPage === 30) {
                trackEvent('TimeOnPage', {
                    content_name: '30 секунд на сайте',
                    content_id: 'engaged_user_30s',
                    value: 50
                });
            } else if (timeOnPage === 60) {
                trackEvent('TimeOnPage', {
                    content_name: '1 минута на сайте',
                    content_id: 'engaged_user_60s',
                    value: 100
                });
            } else if (timeOnPage === 180) {
                trackEvent('TimeOnPage', {
                    content_name: '3 минуты на сайте',
                    content_id: 'highly_engaged_user',
                    value: 300
                });
                clearInterval(pageTimer);
            }
        }, 10000); // каждые 10 секунд
        
        // 8. Purchase событие для успешных покупок
        // Добавить на страницу благодарности после оплаты
        if (window.location.pathname.includes('thank') || 
            window.location.pathname.includes('success')) {
            trackEvent('Purchase', {
                content_name: 'Пакет 8 сессий',
                content_id: 'package_2000',
                value: 2000,
                currency: 'EUR'
            });
        }
        
        // 9. Отслеживание скролла страницы
        let maxScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                if (maxScroll === 25) {
                    trackEvent('ViewContent', {
                        content_name: 'Скролл 25%',
                        content_id: 'scroll_25',
                        value: 25
                    });
                } else if (maxScroll === 50) {
                    trackEvent('ViewContent', {
                        content_name: 'Скролл 50%',
                        content_id: 'scroll_50',
                        value: 50
                    });
                } else if (maxScroll === 75) {
                    trackEvent('ViewContent', {
                        content_name: 'Скролл 75%',
                        content_id: 'scroll_75',
                        value: 75
                    });
                } else if (maxScroll >= 90) {
                    trackEvent('ViewContent', {
                        content_name: 'Скролл 90%',
                        content_id: 'scroll_90',
                        value: 100
                    });
                }
            }
        });
    });
    
    // Экспортируем функции для использования в других скриптах
    window.TikTokEnhanced = {
        trackEvent: trackEvent,
        waitForTikTok: waitForTikTok
    };
    
})();
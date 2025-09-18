// TikTok Pixel Fix - Универсальный скрипт
// Добавляет обязательные поля content_id и value для всех событий

(function() {
    // Оригинальный метод track
    const originalTrack = window.ttq ? window.ttq.track : null;
    
    if (originalTrack && window.ttq) {
        // Переопределяем track с автодобавлением полей
        window.ttq.track = function(eventName, params) {
            params = params || {};
            
            // Добавляем обязательные поля если их нет
            if (!params.content_id) {
                switch(eventName) {
                    case 'ViewContent':
                        params.content_id = 'landing_page';
                        params.value = 2000;
                        break;
                    case 'CompleteRegistration':
                        params.content_id = 'registration_form';
                        params.value = 2000;
                        break;
                    case 'Contact':
                        params.content_id = 'whatsapp_contact';
                        params.value = 2000;
                        break;
                    case 'InitiateCheckout':
                        params.content_id = 'checkout_start';
                        params.value = 2000;
                        break;
                    case 'PlaceAnOrder':
                        params.content_id = 'order_placed';
                        params.value = 2000;
                        break;
                    case 'SubmitForm':
                        params.content_id = 'quiz_form';
                        params.value = 2000;
                        break;
                    case 'Purchase':
                        params.content_id = 'package_2000';
                        params.value = 2000;
                        break;
                    default:
                        params.content_id = 'general_event';
                        params.value = 2000;
                }
            }
            
            // Убеждаемся что value - число
            if (params.value && typeof params.value === 'string') {
                params.value = parseFloat(params.value);
            }
            
            // Добавляем currency если нет
            if (!params.currency) {
                params.currency = 'EUR';
            }
            
            // Добавляем content_type если нет  
            if (!params.content_type) {
                params.content_type = 'product';
            }
            
            // Вызываем оригинальный метод
            originalTrack.call(window.ttq, eventName, params);
        };
    }
})();
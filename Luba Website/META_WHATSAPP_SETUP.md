# Настройка WhatsApp Business API через Meta для разработчиков

## Шаг 1: Настройка Webhook в Meta

1. В левом меню выберите **WhatsApp > Настройка**
2. В разделе **Webhooks** нажмите "Настройка webhooks"
3. Введите:
   - **Callback URL:** `https://yourdomain.com/webhook`
   - **Verify Token:** `denezhniy_vodopad_2024`

## Шаг 2: Получение токенов

1. Перейдите в **WhatsApp > Быстрый старт**
2. Добавьте номер телефона: +34654420334
3. Получите:
   - Phone Number ID
   - WhatsApp Business Account ID
   - Access Token (временный на 24 часа)

## Шаг 3: Создание постоянного токена

1. Перейдите в **Настройки приложения > Основные**
2. Скопируйте App ID и App Secret
3. Создайте System User в Business Manager
4. Сгенерируйте постоянный токен с разрешениями:
   - whatsapp_business_messaging
   - whatsapp_business_management

## Шаг 4: Подписка на события

В разделе Webhooks подпишитесь на:
- messages (входящие сообщения)
- message_status (статусы доставки)
- message_template_status_update

## Шаг 5: Интеграция с CRM

Добавьте в CRM обработчик сообщений:```javascript
// Добавить в crm/index.html после строки let filteredLeads = [...leads];

// WhatsApp API Integration
window.addEventListener('message', function(event) {
    if (event.data.type === 'new_whatsapp_lead') {
        const lead = event.data.lead;
        
        // Проверяем дубликаты
        const existing = leads.find(l => l.phone === lead.phone);
        if (!existing) {
            leads.push(lead);
            saveLeads();
            applyFilters();
            updateAnalytics();
            
            // Трекаем событие
            trackWhatsAppContact(lead);
            
            console.log('✅ WhatsApp lead added:', lead);
        }
    }
});
```

## Шаг 6: Деплой webhook на сервер

1. Установите Node.js на сервере
2. Загрузите `whatsapp-webhook.js`
3. Установите зависимости:
```bash
npm init -y
npm install express
```
4. Запустите с PM2:
```bash
npm install -g pm2
pm2 start whatsapp-webhook.js
```

## Шаг 7: Настройка HTTPS

Webhook требует HTTPS. Используйте:
- Nginx с Let's Encrypt
- Или деплойте на Heroku/Vercel (автоматически HTTPS)

## Шаг 8: Тестирование

1. В Meta Developer нажмите "Тестировать webhook"
2. Отправьте тестовое сообщение на номер
3. Проверьте CRM - лид должен появиться автоматически

## Переменные окружения

Создайте `.env` файл:
```
VERIFY_TOKEN=denezhniy_vodopad_2024
GRAPH_API_TOKEN=ваш_токен
PHONE_NUMBER_ID=ваш_phone_id
BUSINESS_ACCOUNT_ID=ваш_business_id
```

## Важно:
- Номер +34654420334 должен быть верифицирован
- Первые 1000 сообщений бесплатно
- Шаблоны сообщений проходят модерацию 1-2 дня
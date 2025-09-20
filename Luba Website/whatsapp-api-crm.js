// WhatsApp API Auto-CRM Integration
// Deploy на сервер с Node.js

const express = require('express');
const app = express();
app.use(express.json());

// Конфигурация из Meta Developer
const TOKEN = 'EAAMDBKixXYYBPSLGhDyhdZCd9HnAZC4PgFGLa45smNYC0MtQjgeKioi3hqE35jQZB3XBtSiFX5qX5x0YKKgfk24hTABsOWOH2WIdxjIhWSDeoVQXDxyIbEAWzAgPRZCd0YrIkWsh0ZCGRGreoHv84P09fE2PGh9V8RMov2A4ZAgzY55QWeWMR4BlxNoyt6hx7tsafy9FAtigGPFmh1VAH2RkhaXkP8nljeM5NZBZACOymVEQibQ4w2U7jwoAZBNyjgAZDZD';
const VERIFY_TOKEN = 'denezhniy_vodopad_2024';
const PHONE_ID = '722548377617608';

// База данных лидов (для продакшна использовать MongoDB/PostgreSQL)
const leads = [];

// Webhook верификация для Meta
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

// Прием сообщений от WhatsApp
app.post('/webhook', (req, res) => {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
        body.entry?.forEach(entry => {
            const change = entry.changes?.[0];
            if (change?.field === 'messages') {
                const message = change.value.messages?.[0];
                const contact = change.value.contacts?.[0];
                const metadata = change.value.metadata;
                
                if (message && contact) {
                    // Автоматически создаем лида
                    const lead = {
                        id: Date.now(),
                        name: contact.profile.name,
                        phone: message.from,
                        message: message.text?.body || '',
                        timestamp: new Date(),
                        source: 'whatsapp_api',
                        stage: 'contacted',
                        // Извлекаем UTM из первого сообщения если есть
                        utm: extractUTM(message.text?.body)
                    };
                    
                    // Сохраняем в базу
                    leads.push(lead);
                    console.log('✅ Новый лид:', lead);
                    
                    // Отправляем автоответ
                    sendAutoReply(message.from, contact.profile.name);
                    
                    // Отправляем в CRM через API
                    sendToCRM(lead);
                }
            }
        });
    }
    
    res.sendStatus(200);
});

// Извлечение UTM из сообщения
function extractUTM(text) {
    if (!text) return null;
    // Ищем паттерн [source | campaign] который мы добавляли в ссылку
    const match = text.match(/\[(\w+)\s*\|\s*(\w+)\]/);
    if (match) {
        return {
            source: match[1],
            campaign: match[2]
        };
    }
    return null;
}

// Автоответ клиенту
async function sendAutoReply(to, name) {
    const url = `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`;
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
                body: `Здравствуйте, ${name}! 
                
Спасибо за интерес к программе "Денежный Водопад"! 

Я Любовь Лукащук. Ваша заявка принята, я свяжусь с вами в течение 30 минут для записи на бесплатную консультацию.

А пока расскажите - что вас привело ко мне? Какую боль хотите решить?`
            }
        })
    });
}

// Отправка в CRM
function sendToCRM(lead) {
    // Отправляем на frontend через Server-Sent Events или WebSocket
    // Или сохраняем в базу данных которую читает CRM
    
    // Для демо - просто логируем
    console.log('📊 Отправлено в CRM:', lead);
}

// API endpoint для CRM
app.get('/api/leads', (req, res) => {
    res.json(leads);
});

app.listen(3000, () => {
    console.log('WhatsApp webhook запущен на порту 3000');
    console.log('Webhook URL: https://yourdomain.com/webhook');
});
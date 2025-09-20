// WhatsApp Business API Integration
// Webhook endpoint для Meta/Facebook

const WEBHOOK_VERIFY_TOKEN = 'denezhniy_vodopad_2024';
const GRAPH_API_TOKEN = process.env.ACCESS_TOKEN || 'EAAMDBKixXYYBPSLGhDyhdZCd9HnAZC4PgFGLa45smNYC0MtQjgeKioi3hqE35jQZB3XBtSiFX5qX5x0YKKgfk24hTABsOWOH2WIdxjIhWSDeoVQXDxyIbEAWzAgPRZCd0YrIkWsh0ZCGRGreoHv84P09fE2PGh9V8RMov2A4ZAgzY55QWeWMR4BlxNoyt6hx7tsafy9FAtigGPFmh1VAH2RkhaXkP8nljeM5NZBZACOymVEQibQ4w2U7jwoAZBNyjgAZDZD';
const PHONE_NUMBER_ID = '722548377617608';
const API_VERSION = 'v22.0';

// 1. Verification endpoint для Meta
function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        console.log('✅ Webhook verified');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
}

// 2. Webhook для приема сообщений
function handleWebhook(req, res) {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
            const changes = entry.changes;
            changes.forEach(change => {
                if (change.field === 'messages') {
                    const message = change.value.messages?.[0];
                    if (message) {
                        // Новое сообщение от клиента
                        const leadData = {
                            phone: message.from,
                            name: change.value.contacts[0].profile.name,
                            message: message.text.body,
                            timestamp: message.timestamp,
                            source: 'whatsapp_api'
                        };
                        
                        // Сохраняем в localStorage для CRM
                        saveToCRM(leadData);
                        
                        // Отправляем автоответ
                        sendMessage(message.from);
                    }
                }
            });
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}
// 3. Функция отправки сообщения
async function sendMessage(to) {
    const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    
    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
            name: 'hello_world', // Замените на ваш шаблон
            language: { code: 'ru' }
        }
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    return response.json();
}

// 4. Сохранение в CRM
function saveToCRM(leadData) {
    // Этот код будет работать на клиенте
    const lead = {
        id: Date.now(),
        name: leadData.name || 'WhatsApp Lead',
        phone: leadData.phone,
        source: 'whatsapp_api',
        stage: 'contacted',
        date: new Date().toISOString(),
        message: leadData.message,
        hot: true
    };
    
    // Отправляем в localStorage через postMessage
    if (typeof window !== 'undefined') {
        window.parent.postMessage({
            type: 'new_whatsapp_lead',
            lead: lead
        }, '*');
    }
}

// Express сервер для webhook
const express = require('express');
const app = express();
app.use(express.json());

app.get('/webhook', verifyWebhook);
app.post('/webhook', handleWebhook);

app.listen(3000, () => {
    console.log('WhatsApp webhook running on port 3000');
});
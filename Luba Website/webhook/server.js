const express = require('express');
const app = express();
app.use(express.json());

// Конфигурация
const TOKEN = process.env.WHATSAPP_TOKEN || 'EAAMDBKixXYYBPSLGhDyhdZCd9HnAZC4PgFGLa45smNYC0MtQjgeKioi3hqE35jQZB3XBtSiFX5qX5x0YKKgfk24hTABsOWOH2WIdxjIhWSDeoVQXDxyIbEAWzAgPRZCd0YrIkWsh0ZCGRGreoHv84P09fE2PGh9V8RMov2A4ZAgzY55QWeWMR4BlxNoyt6hx7tsafy9FAtigGPFmh1VAH2RkhaXkP8nljeM5NZBZACOymVEQibQ4w2U7jwoAZBNyjgAZDZD';
const VERIFY_TOKEN = 'denezhniy_vodopad_2024';
const PHONE_ID = '722548377617608';
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || ''; // Добавьте webhook URL Google Sheets

// Хранилище лидов в памяти
const leads = [];

// Webhook верификация
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        console.log('Webhook verified');
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

// Прием сообщений
app.post('/webhook', (req, res) => {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
        body.entry?.forEach(entry => {
            const change = entry.changes?.[0];
            if (change?.field === 'messages') {
                const message = change.value.messages?.[0];
                const contact = change.value.contacts?.[0];
                
                if (message && contact) {
                    // Парсим UTM из сообщения
                    let source = 'organic';
                    let campaign = '';
                    const messageText = message.text?.body || '';
                    
                    if (messageText.includes('TikTok')) {
                        source = 'tiktok';
                        campaign = 'ads';
                    } else if (messageText.includes('Facebook')) {
                        source = 'facebook';
                        campaign = 'ads';
                    } else if (messageText.includes('Instagram')) {
                        source = 'instagram';
                        campaign = 'ads';
                    } else if (messageText.includes('Google')) {
                        source = 'google';
                        campaign = 'search';
                    } else if (messageText.includes('YouTube')) {
                        source = 'youtube';
                        campaign = 'video';
                    }
                    
                    const lead = {
                        id: Date.now(),
                        name: contact.profile.name,
                        phone: message.from,
                        email: '', // Заполняется позже через CRM интерфейс
                        message: messageText,
                        timestamp: new Date().toISOString(),
                        source: source,
                        campaign: campaign,
                        stage: 'new_lead',
                        tags: [source, campaign].filter(Boolean)
                    };
                    
                    leads.push(lead);
                    console.log('New lead:', lead);
                    
                    // Отправка в Google Sheets
                    if (GOOGLE_SHEETS_URL) {
                        fetch(GOOGLE_SHEETS_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(lead)
                        }).catch(err => console.error('Google Sheets error:', err));
                    }
                }
            }
        });
    }
    
    res.sendStatus(200);
});

// API для получения лидов
app.get('/leads', (req, res) => {
    res.json(leads);
});

// Главная страница
app.get('/', (req, res) => {
    res.send('WhatsApp Webhook работает! Лидов: ' + leads.length);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
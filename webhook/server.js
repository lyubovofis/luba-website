const express = require('express');
const app = express();
app.use(express.json());

// Конфигурация
const TOKEN = process.env.WHATSAPP_TOKEN || 'EAAMDBKixXYYBPSLGhDyhdZCd9HnAZC4PgFGLa45smNYC0MtQjgeKioi3hqE35jQZB3XBtSiFX5qX5x0YKKgfk24hTABsOWOH2WIdxjIhWSDeoVQXDxyIbEAWzAgPRZCd0YrIkWsh0ZCGRGreoHv84P09fE2PGh9V8RMov2A4ZAgzY55QWeWMR4BlxNoyt6hx7tsafy9FAtigGPFmh1VAH2RkhaXkP8nljeM5NZBZACOymVEQibQ4w2U7jwoAZBNyjgAZDZD';
const VERIFY_TOKEN = 'denezhniy_vodopad_2024';
const PHONE_ID = '722548377617608';

// Хранилище лидов
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
                    const lead = {
                        id: Date.now(),
                        name: contact.profile.name,
                        phone: message.from,
                        message: message.text?.body || '',
                        timestamp: new Date().toISOString(),
                        source: 'whatsapp',
                        stage: 'contacted'
                    };
                    
                    leads.push(lead);
                    console.log('New lead:', lead);
                }
            }
        });
    }
    
    res.sendStatus(200);
});

// API для CRM
app.get('/api/leads', (req, res) => {
    res.json(leads);
});

// CORS для Netlify
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://lyubovpsy.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
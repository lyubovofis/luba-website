// netlify/functions/whatsapp-webhook.js
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Верификация webhook от WhatsApp
        if (event.httpMethod === 'GET') {
            const mode = event.queryStringParameters['hub.mode'];
            const token = event.queryStringParameters['hub.verify_token'];
            const challenge = event.queryStringParameters['hub.challenge'];
            
            if (mode === 'subscribe' && token === 'waterfall2024') {
                return { statusCode: 200, body: challenge };
            }
            return { statusCode: 403 };
        }
        
        // Обработка входящих сообщений
        if (data.entry?.[0]?.changes?.[0]?.value?.messages) {
            const message = data.entry[0].changes[0].value.messages[0];
            const contact = data.entry[0].changes[0].value.contacts[0];
            
            // Сохраняем лид в базу
            const lead = {
                timestamp: new Date().toISOString(),
                name: contact.profile.name,
                phone: message.from,
                message: message.text?.body || '',
                type: 'whatsapp_message'
            };
            
            // Здесь можно добавить сохранение в базу данных
            console.log('New WhatsApp lead:', lead);
        }
        
        return { statusCode: 200, body: 'OK' };
    } catch (error) {
        return { statusCode: 400, body: error.message };
    }
};
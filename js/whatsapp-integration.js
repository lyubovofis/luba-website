// WhatsApp Business API Integration
// Добавить в /js/whatsapp-integration.js

const WHATSAPP_CONFIG = {
    phoneNumber: '380507260235',
    businessId: '', // Получите из WhatsApp Business
    apiToken: '', // Получите из Facebook Developer Console
    webhookUrl: 'https://lyubovpsy.com/api/whatsapp-webhook'
};

// 1. Настройка webhook для приема сообщений
async function setupWhatsAppWebhook() {
    // Этот код нужно развернуть на сервере (Netlify Functions)
    const webhookEndpoint = `
        exports.handler = async (event, context) => {
            const { body } = event;
            const data = JSON.parse(body);
            
            // Новое сообщение от клиента
            if (data.entry?.[0]?.changes?.[0]?.value?.messages) {
                const message = data.entry[0].changes[0].value.messages[0];
                const contact = data.entry[0].changes[0].value.contacts[0];
                
                const lead = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    name: contact.profile.name,
                    phone: message.from,
                    source: 'whatsapp',
                    campaign: 'direct',
                    status: 'new',
                    notes: message.text.body
                };
                
                // Сохраняем в базу
                await saveLead(lead);
            }
            
            return { statusCode: 200 };
        };
    `;
}

// 2. Отправка сообщений через API
async function sendWhatsAppMessage(phone, text) {
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_CONFIG.businessId}/messages`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${WHATSAPP_CONFIG.apiToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: { body: text }
        })
    });
    
    return response.json();
}
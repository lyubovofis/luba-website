// netlify/functions/fb-webhook.js
exports.handler = async (event, context) => {
    // Верификация webhook от Facebook
    if (event.httpMethod === 'GET') {
        const mode = event.queryStringParameters['hub.mode'];
        const token = event.queryStringParameters['hub.verify_token'];
        const challenge = event.queryStringParameters['hub.challenge'];
        
        if (mode === 'subscribe' && token === 'waterfall2024') {
            return { 
                statusCode: 200, 
                body: challenge 
            };
        }
        return { statusCode: 403, body: 'Forbidden' };
    }

    // Обработка POST запросов (события)
    if (event.httpMethod === 'POST') {
        console.log('Facebook webhook received:', event.body);
        return { statusCode: 200, body: 'EVENT_RECEIVED' };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};

// РЕШЕНИЕ БЕЗ ВСЯКОЙ АВТОРИЗАЦИИ
// Сохраняем лиды прямо в URL параметрах!

// === ВАРИАНТ 1: Отправка на email через форму (БЕЗ backend) ===

function sendLeadViaMailto(leadData) {
    // Формируем email сообщение
    const subject = `Новый лид: ${leadData.name}`;
    const body = `
Новый лид с сайта!

Имя: ${leadData.name}
Телефон: ${leadData.phone}
Email: ${leadData.email}
Возраст: ${leadData.age}
Результат квиза: ${leadData.quiz_result}
Источник: ${leadData.utm_source || 'direct'}
Время: ${new Date().toLocaleString('ru-RU')}
    `;
    
    // Открываем почтовый клиент
    const mailtoLink = `mailto:your-email@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
}

// === ВАРИАНТ 2: Сохранение в URL (для копирования) ===

function generateLeadURL(leadData) {
    // Кодируем все данные в URL
    const params = new URLSearchParams({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        age: leadData.age,
        quiz: leadData.quiz_result,
        source: leadData.utm_source,
        date: new Date().toISOString()
    });
    
    // Создаем ссылку с данными
    const leadURL = `${window.location.origin}/crm-lead.html?${params.toString()}`;
    
    // Копируем в буфер обмена
    navigator.clipboard.writeText(leadURL);
    
    alert(`Данные лида скопированы! 
    
Вставьте ссылку в любой мессенджер или CRM.
    
${leadURL}`);
}

// === ВАРИАНТ 3: QR код с данными (офлайн CRM) ===

function generateQRCode(leadData) {
    // Используем бесплатный API для QR кодов
    const data = JSON.stringify(leadData);
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    
    // Показываем QR код
    const popup = window.open('', 'QR Code', 'width=350,height=400');
    popup.document.write(`
        <html>
        <head><title>QR код лида</title></head>
        <body style="text-align:center; padding:20px;">
            <h2>Отсканируйте телефоном</h2>
            <img src="${qrURL}" />
            <p>Данные лида сохранены в QR коде</p>
        </body>
        </html>
    `);
}

// === ВАРИАНТ 4: Печать данных (физическая CRM) ===

function printLead(leadData) {
    const printWindow = window.open('', 'Print', 'width=600,height=400');
    printWindow.document.write(`
        <html>
        <head>
            <title>Карточка лида</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                .card { border: 2px solid #000; padding: 20px; }
                .field { margin: 10px 0; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>🔥 НОВЫЙ ЛИД</h2>
                <div class="field">
                    <span class="label">Имя:</span> ${leadData.name}
                </div>
                <div class="field">
                    <span class="label">Телефон:</span> ${leadData.phone}
                </div>
                <div class="field">
                    <span class="label">Email:</span> ${leadData.email}
                </div>
                <div class="field">
                    <span class="label">Результат:</span> ${leadData.quiz_result}
                </div>
                <div class="field">
                    <span class="label">Источник:</span> ${leadData.utm_source || 'direct'}
                </div>
                <div class="field">
                    <span class="label">Дата:</span> ${new Date().toLocaleString('ru-RU')}
                </div>
                <hr>
                <div class="field">
                    <span class="label">Статус:</span> ________________
                </div>
                <div class="field">
                    <span class="label">Комментарий:</span> ________________
                </div>
            </div>
        </body>
        </html>
    `);
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// === ВАРИАНТ 5: Сохранение в Downloads (CSV файл) ===

function downloadLeadsAsCSV() {
    // Получаем все лиды из localStorage
    const leads = JSON.parse(localStorage.getItem('allLeads') || '[]');
    
    // Создаем CSV
    const headers = ['Дата', 'Имя', 'Телефон', 'Email', 'Возраст', 'Результат', 'Источник'];
    const rows = leads.map(lead => [
        new Date(lead.date).toLocaleString('ru-RU'),
        lead.name,
        lead.phone,
        lead.email || '',
        lead.age || '',
        lead.quiz_result || '',
        lead.utm_source || 'direct'
    ]);
    
    // Формируем CSV строку
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Создаем файл для скачивания
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// === ВАРИАНТ 6: Web Share API (поделиться в любое приложение) ===

async function shareLead(leadData) {
    const shareData = {
        title: 'Новый лид',
        text: `
Новый лид: ${leadData.name}
Телефон: ${leadData.phone}
Email: ${leadData.email}
Результат: ${leadData.quiz_result}
Источник: ${leadData.utm_source || 'direct'}
        `,
        url: `https://wa.me/${leadData.phone?.replace(/\D/g, '')}`
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            console.log('Shared successfully');
        } else {
            // Fallback - копируем в буфер
            navigator.clipboard.writeText(shareData.text);
            alert('Данные скопированы в буфер обмена!');
        }
    } catch (error) {
        console.error('Error sharing:', error);
    }
}

// === ГЛАВНАЯ ФУНКЦИЯ: Сохранение лида ВСЕМИ способами ===

function saveLead(leadData) {
    // 1. Сохраняем локально (всегда)
    const leads = JSON.parse(localStorage.getItem('allLeads') || '[]');
    leads.push({
        ...leadData,
        id: Date.now(),
        date: new Date().toISOString()
    });
    localStorage.setItem('allLeads', JSON.stringify(leads));
    
    // 2. Показываем опции пользователю
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                    background:white; padding:30px; border-radius:10px; box-shadow:0 0 30px rgba(0,0,0,0.3);
                    z-index:9999; text-align:center;">
            <h2>✅ Лид сохранен!</h2>
            <p><strong>${leadData.name}</strong><br>${leadData.phone}</p>
            
            <div style="margin:20px 0;">
                <button onclick="sendLeadViaMailto(${JSON.stringify(leadData)})" 
                        style="margin:5px; padding:10px 20px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">
                    📧 Отправить на Email
                </button>
                
                <button onclick="generateQRCode(${JSON.stringify(leadData)})"
                        style="margin:5px; padding:10px 20px; background:#2196F3; color:white; border:none; border-radius:5px; cursor:pointer;">
                    📱 QR код
                </button>
                
                <button onclick="printLead(${JSON.stringify(leadData)})"
                        style="margin:5px; padding:10px 20px; background:#FF9800; color:white; border:none; border-radius:5px; cursor:pointer;">
                    🖨️ Печать
                </button>
                
                <button onclick="shareLead(${JSON.stringify(leadData)})"
                        style="margin:5px; padding:10px 20px; background:#9C27B0; color:white; border:none; border-radius:5px; cursor:pointer;">
                    📤 Поделиться
                </button>
                
                <button onclick="downloadLeadsAsCSV()"
                        style="margin:5px; padding:10px 20px; background:#795548; color:white; border:none; border-radius:5px; cursor:pointer;">
                    💾 Скачать все (CSV)
                </button>
            </div>
            
            <button onclick="this.parentElement.remove()"
                    style="padding:10px 30px; background:#f44336; color:white; border:none; border-radius:5px; cursor:pointer;">
                Закрыть
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Экспортируем функции
window.NoAuthCRM = {
    saveLead,
    sendLeadViaMailto,
    generateLeadURL,
    generateQRCode,
    printLead,
    downloadLeadsAsCSV,
    shareLead
};
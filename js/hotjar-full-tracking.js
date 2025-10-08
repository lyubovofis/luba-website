/**
 * HOTJAR 100% TRACKING - TEMPORARY (1 WEEK)
 * 
 * Этот скрипт настраивает Hotjar на запись ВСЕХ посетителей
 * игнорируя GDPR на одну неделю для анализа проблем с конверсией
 */

console.log('🎥 HOTJAR: Включен режим 100% записи на неделю');

// Check if Hotjar is loaded
if (typeof window.hj === 'function') {
    
    // Force Hotjar to track everyone (ignore GDPR consent)
    window.hj('consent', 'grant');
    
    // Set sampling rate to 100%
    window._hjSettings.hjsv = 100;
    
    // Tag all sessions for this test period
    window.hj('tagRecording', ['100_percent_test', 'conversion_analysis']);
    
    // Track specific events
    window.hj('event', 'full_tracking_enabled');
    
    console.log('✅ Hotjar: 100% запись активна');
    console.log('📊 Все сессии будут записаны');
    console.log('🏷️ Теги: 100_percent_test, conversion_analysis');
    
} else {
    console.warn('⚠️ Hotjar не загружен');
    
    // Retry after 2 seconds
    setTimeout(() => {
        if (typeof window.hj === 'function') {
            window.hj('consent', 'grant');
            window.hj('tagRecording', ['100_percent_test', 'conversion_analysis']);
            console.log('✅ Hotjar загружен (с задержкой)');
        }
    }, 2000);
}

// Set expiry date (7 days from now)
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 7);
localStorage.setItem('hotjar_100_expiry', expiryDate.toISOString());

console.log(`⏰ Режим активен до: ${expiryDate.toLocaleDateString('ru-RU')}`);

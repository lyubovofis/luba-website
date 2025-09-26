// ПОЛНОЕ РЕШЕНИЕ ДЛЯ ВСЕХ СТРАНИЦ
// Добавьте этот код после основного TikTok pixel

// 1. На всех лендингах
document.addEventListener('DOMContentLoaded', function() {
    // ViewContent при загрузке
    if (typeof ttq !== 'undefined') {
        ttq.track('ViewContent', {
            content_id: 'landing_page',
            content_type: 'product',
            content_name: 'Денежный водопад',
            value: 2000,
            currency: 'EUR'
        });
    }
});

// 2. Для формы регистрации
function trackFormSubmit(formData) {
    ttq.track('CompleteRegistration', {
        content_id: 'package_' + (formData.package || '2000'),
        content_type: 'product',
        value: parseFloat(formData.package || 2000),
        currency: 'EUR'
    });
}

// 3. Для квиза
function trackQuizComplete(quizResult) {
    ttq.track('SubmitForm', {
        content_id: 'quiz_result_' + quizResult,
        content_type: 'product',
        value: 2000,
        currency: 'EUR'
    });
}
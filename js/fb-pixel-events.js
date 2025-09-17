// Facebook Pixel Events Tracking
// Добавить в tiktok-events.js или отдельный файл

// Проверка загрузки Facebook Pixel
function checkFBPixel() {
    return typeof fbq !== 'undefined';
}

// Отслеживание событий Facebook
document.addEventListener('DOMContentLoaded', function() {
    
    // WhatsApp клики
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (checkFBPixel()) {
                fbq('track', 'Lead', {
                    content_name: 'WhatsApp Contact',
                    value: 50,
                    currency: 'EUR'
                });
            }
        });
    });
    
    // Просмотр цен
    const pricingSection = document.querySelector('#pricing, .pricing');
    if (pricingSection && checkFBPixel()) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fbq('track', 'ViewContent', {
                        content_name: 'Pricing',
                        value: 2000,
                        currency: 'EUR'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(pricingSection);
    }
});
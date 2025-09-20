// Universal GDPR Script - gdpr.js
// Добавьте <script src="/js/gdpr.js"></script> перед </body> на каждой странице

(function() {
    // Создаем HTML для GDPR баннера
    const gdprHTML = `
    <div id="gdpr-banner" style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(43, 49, 57, 0.98);
        color: white;
        padding: 20px;
        z-index: 9999;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
        display: none;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
    ">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
            <div style="flex: 1; min-width: 280px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                    🍪 Мы используем файлы cookie для улучшения вашего опыта на сайте, аналитики и персонализации контента. 
                    Продолжая использовать сайт, вы соглашаетесь с нашей 
                    <a href="/privacy.html" style="color: #667eea; text-decoration: underline;">Политикой конфиденциальности</a> и 
                    <a href="/cookie-policy.html" style="color: #667eea; text-decoration: underline;">Политикой Cookie</a>.
                </p>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="accept-all-btn" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: transform 0.2s;
                ">Принять все</button>
                <button id="accept-necessary-btn" style="
                    background: transparent;
                    color: white;
                    border: 1px solid #667eea;
                    padding: 12px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s;
                ">Только необходимые</button>
                <button id="cookie-settings-btn" style="
                    background: transparent;
                    color: #999;
                    border: none;
                    padding: 12px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    text-decoration: underline;
                ">Настройки</button>
            </div>
        </div>
    </div>`;    
    // Cookie Settings Modal HTML
    const modalHTML = `
    <div id="cookie-settings-modal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        overflow-y: auto;
    ">
        <div style="
            background: white;
            max-width: 600px;
            margin: 50px auto;
            padding: 30px;
            border-radius: 15px;
            color: #333;
        ">
            <h2 style="margin-bottom: 20px; color: #667eea; font-family: 'Montserrat', sans-serif;">Настройки Cookie</h2>
            
            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: start; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" checked disabled style="margin-right: 10px; margin-top: 3px;">
                    <div>
                        <strong>Необходимые Cookie</strong>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                            Эти файлы cookie необходимы для работы сайта и не могут быть отключены.
                        </p>
                    </div>
                </label>                
                <label style="display: flex; align-items: start; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" id="analytics-cookies" style="margin-right: 10px; margin-top: 3px;">
                    <div>
                        <strong>Аналитические Cookie</strong>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                            Помогают нам понять, как посетители взаимодействуют с сайтом (Google Analytics, TikTok Pixel).
                        </p>
                    </div>
                </label>
                
                <label style="display: flex; align-items: start; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" id="marketing-cookies" style="margin-right: 10px; margin-top: 3px;">
                    <div>
                        <strong>Маркетинговые Cookie</strong>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                            Используются для показа релевантной рекламы (Facebook Pixel, TikTok Ads).
                        </p>
                    </div>
                </label>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="save-custom-btn" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">Сохранить настройки</button>                <button id="close-settings-btn" style="
                    background: #f0f0f0;
                    color: #333;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">Отмена</button>
            </div>
        </div>
    </div>`;
    
    // Cookie Preferences Button HTML
    const cookieButtonHTML = `
    <button id="cookie-prefs-btn" style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(102,126,234,0.9);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        z-index: 1000;
        transition: all 0.3s;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    ">🍪</button>`;

    // Вставляем HTML в страницу
    document.addEventListener('DOMContentLoaded', function() {
        // Создаем контейнер
        const gdprContainer = document.createElement('div');
        gdprContainer.innerHTML = gdprHTML + modalHTML + cookieButtonHTML;
        document.body.appendChild(gdprContainer);
        
        // Инициализация
        initializeGDPR();
    });
    // Cookie функции
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    function initializeGDPR() {
        // Проверяем согласие
        if (!getCookie('gdpr_consent')) {
            setTimeout(function() {
                const banner = document.getElementById('gdpr-banner');
                if (banner) banner.style.display = 'block';
            }, 1000);
        }

        // Обработчики кнопок
        const acceptAllBtn = document.getElementById('accept-all-btn');
        const acceptNecessaryBtn = document.getElementById('accept-necessary-btn');
        const settingsBtn = document.getElementById('cookie-settings-btn');
        const saveCustomBtn = document.getElementById('save-custom-btn');
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        const cookiePrefsBtn = document.getElementById('cookie-prefs-btn');

        if (acceptAllBtn) acceptAllBtn.addEventListener('click', acceptAllCookies);
        if (acceptNecessaryBtn) acceptNecessaryBtn.addEventListener('click', acceptNecessaryCookies);
        if (settingsBtn) settingsBtn.addEventListener('click', showCookieSettings);
        if (saveCustomBtn) saveCustomBtn.addEventListener('click', saveCustomCookies);
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeCookieSettings);
        if (cookiePrefsBtn) {
            cookiePrefsBtn.addEventListener('click', showCookieSettings);
            cookiePrefsBtn.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.1)';
            });
            cookiePrefsBtn.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
            });
        }

        // Инициализация трекинга
        initializeTracking();
    }

    function acceptAllCookies() {
        setCookie('gdpr_consent', 'all', 365);
        setCookie('analytics_consent', 'true', 365);
        setCookie('marketing_consent', 'true', 365);
        document.getElementById('gdpr-banner').style.display = 'none';
        initializeTracking();
    }

    function acceptNecessaryCookies() {
        setCookie('gdpr_consent', 'necessary', 365);
        setCookie('analytics_consent', 'false', 365);
        setCookie('marketing_consent', 'false', 365);
        document.getElementById('gdpr-banner').style.display = 'none';
    }

    function showCookieSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'block';
            const analyticsCheckbox = document.getElementById('analytics-cookies');
            const marketingCheckbox = document.getElementById('marketing-cookies');
            if (analyticsCheckbox) analyticsCheckbox.checked = getCookie('analytics_consent') === 'true';
            if (marketingCheckbox) marketingCheckbox.checked = getCookie('marketing_consent') === 'true';
        }
    }

    function closeCookieSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) modal.style.display = 'none';
    }

    function saveCustomCookies() {
        const analytics = document.getElementById('analytics-cookies').checked;
        const marketing = document.getElementById('marketing-cookies').checked;
        
        setCookie('gdpr_consent', 'custom', 365);
        setCookie('analytics_consent', analytics ? 'true' : 'false', 365);
        setCookie('marketing_consent', marketing ? 'true' : 'false', 365);
        
        document.getElementById('gdpr-banner').style.display = 'none';
        document.getElementById('cookie-settings-modal').style.display = 'none';
        
        initializeTracking();
    }

    function initializeTracking() {
        const analyticsConsent = getCookie('analytics_consent') === 'true';
        const marketingConsent = getCookie('marketing_consent') === 'true';
        
        // Google Analytics
        if (analyticsConsent && typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // TikTok Pixel
        if (marketingConsent && typeof ttq !== 'undefined') {
            ttq.page();
        }
        
        // Facebook Pixel
        if (marketingConsent && typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }
    }
})();

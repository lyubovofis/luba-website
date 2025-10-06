const fs = require('fs');
const path = require('path');

// GDPR Banner HTML to inject
const gdprBannerHTML = `
<!-- GDPR Cookie Banner - INLINE VERSION -->
<div id="gdpr-banner" style="
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(43, 49, 57, 0.98);
    color: white;
    padding: 20px;
    z-index: 99999;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
    font-family: 'Montserrat', sans-serif;
">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
        <div style="flex: 1; min-width: 300px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                🍪 Мы используем файлы cookie для улучшения вашего опыта на сайте, аналитики и персонализации контента. 
                Продолжая использовать сайт, вы соглашаетесь с нашей 
                <a href="/privacy.html" style="color: #667eea; text-decoration: underline;">Политикой конфиденциальности</a> и 
                <a href="/cookie-policy.html" style="color: #667eea; text-decoration: underline;">Политикой Cookie</a>.
            </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="acceptAllCookies()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Принять все
            </button>
            <button onclick="showCookieSettings()" style="
                background: transparent;
                color: #999;
                border: none;
                padding: 12px 20px;
                cursor: pointer;
                font-size: 14px;
                text-decoration: underline;
            ">
                Настройки
            </button>
        </div>
    </div>
</div>

<!-- Cookie Settings Modal -->
<div id="cookie-settings-modal" style="
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 100000;
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
        <h2 style="margin-bottom: 20px; color: #667eea;">Настройки Cookie</h2>
        
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
                <input type="checkbox" id="analytics-cookies" checked style="margin-right: 10px; margin-top: 3px;">
                <div>
                    <strong>Аналитические Cookie</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                        Помогают понять, как посетители взаимодействуют с сайтом (Google Analytics, TikTok, Hotjar).
                    </p>
                </div>
            </label>
            
            <label style="display: flex; align-items: start; margin-bottom: 15px; cursor: pointer;">
                <input type="checkbox" id="marketing-cookies" checked style="margin-right: 10px; margin-top: 3px;">
                <div>
                    <strong>Маркетинговые Cookie</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                        Используются для показа релевантной рекламы (Facebook Pixel, TikTok Ads).
                    </p>
                </div>
            </label>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="saveCustomCookies()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
            ">
                Сохранить
            </button>
            <button onclick="closeCookieSettings()" style="
                background: #f0f0f0;
                color: #333;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
            ">
                Отмена
            </button>
        </div>
    </div>
</div>

<script>
// GDPR Cookie Management
function getCookie(name) {
    const value = \`; \${document.cookie}\`;
    const parts = value.split(\`; \${name}=\`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = \`expires=\${date.toUTCString()}\`;
    document.cookie = \`\${name}=\${value};\${expires};path=/;SameSite=Lax\`;
}

function acceptAllCookies() {
    setCookie('gdpr_consent', 'all', 365);
    setCookie('analytics_consent', 'true', 365);
    setCookie('marketing_consent', 'true', 365);
    
    document.getElementById('gdpr-banner').style.display = 'none';
    
    initializeTracking();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cookie_consent', {
            'consent_type': 'all_accepted'
        });
    }
}

function showCookieSettings() {
    document.getElementById('cookie-settings-modal').style.display = 'block';
    document.getElementById('analytics-cookies').checked = getCookie('analytics_consent') !== 'false';
    document.getElementById('marketing-cookies').checked = getCookie('marketing_consent') !== 'false';
}

function closeCookieSettings() {
    document.getElementById('cookie-settings-modal').style.display = 'none';
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
    
    if (analyticsConsent && typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
    
    if (marketingConsent && typeof ttq !== 'undefined') {
        ttq.page();
    }
    
    if (marketingConsent && typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }
}

// Show banner on page load
(function() {
    function showBanner() {
        const banner = document.getElementById('gdpr-banner');
        if (!banner) {
            setTimeout(showBanner, 100);
            return;
        }
        
        if (!getCookie('gdpr_consent')) {
            setTimeout(function() {
                banner.style.display = 'block';
                console.log('🍪 GDPR banner shown');
            }, 500);
        } else {
            console.log('🍪 Consent already given');
            initializeTracking();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
    } else {
        showBanner();
    }
})();

// Floating cookie button
window.addEventListener('load', function() {
    const prefsButton = document.createElement('button');
    prefsButton.innerHTML = '🍪';
    prefsButton.title = 'Настройки Cookie';
    prefsButton.style.cssText = \`
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
        z-index: 9999;
        transition: all 0.3s;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    \`;
    prefsButton.onclick = showCookieSettings;
    prefsButton.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
    prefsButton.onmouseout = function() { this.style.transform = 'scale(1)'; };
    document.body.appendChild(prefsButton);
});
</script>
`;

// Pages to update
const pages = [
    'quiz-a/index.html',
    'quiz-a-uk/index.html',
    'quiz-b/index.html',
    'quiz-b-uk/index.html',
    'quiz-c/index.html',
    'quiz-c-uk/index.html',
    'quiz-test/index.html'
];

console.log('🚀 Starting GDPR banner fix for all quiz pages...\n');

let fixed = 0;
let errors = 0;

pages.forEach(pagePath => {
    try {
        const fullPath = path.join(__dirname, pagePath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  ${pagePath} - NOT FOUND`);
            return;
        }
        
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Remove old GDPR script (fetch version)
        content = content.replace(/<!-- GDPR Cookie Banner -->[\s\S]*?<\/script>/g, '');
        
        // Find closing </body> tag and insert GDPR banner before it
        if (content.includes('</body>')) {
            content = content.replace('</body>', gdprBannerHTML + '\n</body>');
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ ${pagePath} - FIXED`);
            fixed++;
        } else {
            console.log(`❌ ${pagePath} - NO </body> TAG`);
            errors++;
        }
        
    } catch (error) {
        console.log(`❌ ${pagePath} - ERROR: ${error.message}`);
        errors++;
    }
});

console.log(`\n📊 SUMMARY:`);
console.log(`✅ Fixed: ${fixed} pages`);
console.log(`❌ Errors: ${errors} pages`);
console.log(`\n🎉 Done! GDPR banner is now inline on all pages.`);

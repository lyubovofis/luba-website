/* A messenger click expresses intent; it never confirms a message, booking or payment. */
(function () {
    'use strict';
    if (window.__lyubovContactIntent) return;
    window.__lyubovContactIntent = true;

    function discoverySource() {
        const aliases = {
            'chatgpt': 'chatgpt', 'chatgpt.com': 'chatgpt',
            'perplexity': 'perplexity', 'perplexity.ai': 'perplexity',
            'claude': 'claude', 'claude.ai': 'claude',
            'copilot': 'copilot', 'copilot.microsoft.com': 'copilot',
            'google': 'google', 'bing': 'bing'
        };
        const source = new URLSearchParams(window.location.search).get('utm_source');
        if (source && aliases[source.toLowerCase()]) return aliases[source.toLowerCase()];
        try {
            const host = new URL(document.referrer).hostname.replace(/^www\./, '');
            if (aliases[host]) return aliases[host];
            if (host === 'google.com' || /^google\.[a-z.]+$/.test(host)) return 'google';
            if (host === 'bing.com') return 'bing';
            return 'other';
        } catch (_) {
            return 'direct';
        }
    }

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
        const anchor = event.target.closest && event.target.closest('a[href]');
        if (!anchor) return;
        if (/(?:^|;\s*)analytics_consent=false(?:;|$)/.test(document.cookie)) return;
        let url;
        try { url = new URL(anchor.href, window.location.href); } catch (_) { return; }
        if (url.protocol !== 'https:') return;
        let path;
        try { path = decodeURI(url.pathname); } catch (_) { return; }
        let channel;
        if (url.hostname === 'wa.me' && url.pathname === '/34654420334') channel = 'whatsapp';
        if (url.hostname === 't.me' && url.pathname === '/LyubovUA') channel = 'telegram';
        if (url.hostname === 'www.instagram.com' && url.pathname === '/lyubov_psy_/') channel = 'instagram';
        if (url.hostname === 'www.youtube.com' && path === '/@ЛюбовьЛукащукПсихолог') channel = 'youtube';
        if (!channel || typeof window.gtag !== 'function') return;
        const section = anchor.closest('[data-contact-placement], section, aside');
        const placement = section && (section.getAttribute('data-contact-placement') || section.id);
        window.gtag('event', channel === 'whatsapp' || channel === 'telegram' ? 'contact_intent' : 'social_profile_click', {
            contact_channel: channel,
            button_location: placement || 'navigation',
            page_path: window.location.pathname,
            discovery_source: discoverySource()
        });
    });
}());

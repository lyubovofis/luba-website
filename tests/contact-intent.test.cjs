const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('js/contact-intent.js', 'utf8');

function fixture({search = '', referrer = '', cookie = '', tracker = true} = {}) {
    const calls = [], listeners = [];
    const window = {location: {href: 'https://lyubovpsy.com/ru/example' + search, pathname: '/ru/example', search}};
    if (tracker) window.gtag = (...args) => calls.push(JSON.parse(JSON.stringify(args)));
    const document = {referrer, cookie, addEventListener: (name, cb) => {
        assert.equal(name, 'click'); listeners.push(cb);
    }};
    const context = vm.createContext({window, document, URL, URLSearchParams});
    const load = () => vm.runInContext(code, context);
    load();
    return {calls, listeners, load, click(href, options = {}) {
        const section = {id: 'consultation', getAttribute: () => null};
        const anchor = {href, closest: () => section};
        const event = {target: {closest: () => anchor}, button: 0, defaultPrevented: false,
            preventDefault() { throw Error('Navigation must stay native'); }, ...options};
        listeners.forEach(cb => cb(event));
    }};
}

test('official messenger and social clicks report intent only, preserving navigation', () => {
    const f = fixture();
    for (const href of ['https://wa.me/34654420334?text=private', 'https://t.me/LyubovUA?text=private',
        'https://www.instagram.com/lyubov_psy_/', 'https://www.youtube.com/@ЛюбовьЛукащукПсихолог']) f.click(href);
    assert.deepEqual(f.calls.map(x => [x[1], x[2].contact_channel]), [
        ['contact_intent', 'whatsapp'], ['contact_intent', 'telegram'],
        ['social_profile_click', 'instagram'], ['social_profile_click', 'youtube']]);
    for (const row of f.calls) assert.deepEqual(Object.keys(row[2]).sort(),
        ['button_location', 'contact_channel', 'discovery_source', 'page_path']);
    assert.ok(!JSON.stringify(f.calls).includes('private'));
});

test('ignores other destinations, malformed paths, nonprimary or cancelled clicks', () => {
    const f = fixture();
    for (const href of ['/ru/blog', 'https://wa.me.evil.test/34654420334', 'https://wa.me/123',
        'http://wa.me/34654420334', 'https://www.youtube.com/%broken', 'javascript:void(0)']) f.click(href);
    f.click('https://wa.me/34654420334', {button: 1});
    f.click('https://wa.me/34654420334', {defaultPrevented: true});
    f.click('', {target: {}});
    assert.equal(f.calls.length, 0);
});

test('opt out and absent tracker work without sending or blocking links', () => {
    for (const config of [{cookie: 'other=yes; analytics_consent=false; more=1'}, {tracker: false}]) {
        const f = fixture(config); f.click('https://t.me/LyubovUA'); assert.equal(f.calls.length, 0);
    }
});

test('classifies discovery sources without exposing query or referrer details', () => {
    for (const [search, referrer, expected] of [
        ['?utm_source=ChatGPT&name=secret', '', 'chatgpt'], ['', 'https://claude.ai/chat/private', 'claude'],
        ['', 'https://www.google.de/search?q=private', 'google'], ['', 'https://perplexity.ai/search/private', 'perplexity'],
        ['', 'https://copilot.microsoft.com/?private=1', 'copilot'], ['', 'https://bing.com/search?q=private', 'bing'],
        ['', 'https://example.com/private', 'other'], ['', '', 'direct']]) {
        const f = fixture({search, referrer}); f.click('https://wa.me/34654420334');
        assert.equal(f.calls[0][2].discovery_source, expected);
        assert.equal(f.calls[0][2].page_path, '/ru/example');
        assert.ok(!JSON.stringify(f.calls).includes('private'));
        assert.ok(!JSON.stringify(f.calls).includes('secret'));
    }
});

test('loading twice installs only one listener', () => {
    const f = fixture(); f.load(); f.click('https://t.me/LyubovUA');
    assert.equal(f.listeners.length, 1); assert.equal(f.calls.length, 1);
});

test('homepage retains core trackers without scripts that fabricate lead or order value', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    for (const name of ['tiktok-pixel-fix', 'hotjar-full-tracking', 'tiktok-enhanced-tracking',
        'ga4-conversions', 'fb-pixel-events', 'crm-integration']) assert.ok(!html.includes('src="/js/' + name + '.js"'));
    const tag = html.match(/<script\b[^>]*src="\/js\/contact-intent\.js"[^>]*>/);
    assert.ok(tag, 'contact intent script is loaded');
    assert.ok(/\bdefer\b/.test(tag[0]), 'contact intent waits for parsed HTML');
    assert.match(html, /G-ZWF15D45V8/);
    assert.ok(!html.includes('static.hotjar.com'), 'temporary duplicate recorder is removed');
    assert.match(html, /tmyxczr5sn/, 'existing Clarity destination is retained');
});

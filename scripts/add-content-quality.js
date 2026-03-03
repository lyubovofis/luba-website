/**
 * Adds content quality improvements to all /ru/ pages:
 * 1. Author byline bar (with photo, credentials, dates) between hero and main
 * 2. Table of Contents (from H2 headings)
 * 3. Two mid-article CTAs (before H2 #3 and H2 #5)
 * 4. Updates dateModified in JSON-LD to today
 * 5. Updates visible "Обновлено" date
 */

const fs = require('fs');
const path = require('path');

const RU_DIR = 'C:/Luba Website/ru';
const TODAY_ISO = '2026-03-03';
const TODAY_DISPLAY = '3 марта 2026';
const WA_URL = 'https://wa.me/34654420334?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!+%D0%A5%D0%BE%D1%87%D1%83+%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%D1%81%D1%8F+%D0%BD%D0%B0+%D0%B1%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%83%D1%8E+%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E';
const TG_URL = 'https://t.me/LyubovUA';

const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня',
                   'июля','августа','сентября','октября','ноября','декабря'];

function formatDateRu(iso) {
    if (!iso) return TODAY_DISPLAY;
    const [y, m, d] = iso.split('-');
    return `${parseInt(d)} ${MONTHS_RU[parseInt(m) - 1]} ${y}`;
}

function extractDatePublished(html) {
    const m = html.match(/"datePublished":\s*"(\d{4}-\d{2}-\d{2})"/);
    return m ? m[1] : null;
}

const EXTRA_CSS = `
/* === Author byline bar === */
.article-byline-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 30px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
    max-width: 100%;
}
.article-byline-bar img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid #e9d5ff;
}
.byline-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
}
.byline-info a {
    font-weight: 700;
    color: #6b46c1;
    text-decoration: none;
    font-size: 0.95rem;
}
.byline-info a:hover { text-decoration: underline; }
.byline-info span {
    font-size: 0.80rem;
    color: #4b5563;
}
.byline-date {
    font-size: 0.80rem;
    color: #4b5563;
    margin-left: auto;
    white-space: nowrap;
}
@media (max-width: 640px) {
    .article-byline-bar { padding: 12px 16px; }
    .byline-date { margin-left: 0; width: 100%; }
}

/* === Table of Contents === */
.article-toc {
    background: #faf5ff;
    border: 1px solid #e9d5ff;
    border-radius: 12px;
    padding: 18px 22px;
    margin: 0 0 32px 0;
}
.article-toc h4 {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #6b46c1;
    margin: 0 0 10px 0;
    font-weight: 700;
}
.article-toc ol {
    margin: 0;
    padding: 0 0 0 20px;
}
.article-toc li { margin-bottom: 5px; }
.article-toc a {
    color: #374151;
    text-decoration: none;
    font-size: 0.91rem;
    line-height: 1.45;
}
.article-toc a:hover { color: #6b46c1; text-decoration: underline; }

/* === Mid-article CTA === */
.mid-article-cta {
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    border: 1px solid #c4b5fd;
    border-radius: 14px;
    padding: 22px 26px;
    margin: 38px 0;
    text-align: center;
}
.mid-article-cta p {
    font-size: 1rem;
    color: #1f2937;
    margin: 0 0 14px 0;
    line-height: 1.6;
    font-weight: 500;
}
.mid-cta-btns {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}
.mid-cta-btn-wa, .mid-cta-btn-tg {
    padding: 11px 22px;
    border-radius: 25px;
    text-decoration: none !important;
    font-weight: 600;
    font-size: 0.92rem;
    display: inline-block;
    transition: opacity 0.2s;
}
.mid-cta-btn-wa { background: #25d366; color: white !important; }
.mid-cta-btn-tg { background: #0088cc; color: white !important; }
.mid-cta-btn-wa:hover, .mid-cta-btn-tg:hover { opacity: 0.9; }
`;

function makeMidCTA(topicNote) {
    return `
        <!-- Mid-Article CTA -->
        <div class="mid-article-cta">
            <p>${topicNote}</p>
            <div class="mid-cta-btns">
                <a href="${WA_URL}" class="mid-cta-btn-wa">💬 WhatsApp</a>
                <a href="${TG_URL}" class="mid-cta-btn-tg">✈ Telegram</a>
            </div>
        </div>

`;
}

const MID_CTA_1 = makeMidCTA('Узнайте, как эта тема проявляется именно у вас — на бесплатной 15-минутной консультации.');
const MID_CTA_2 = makeMidCTA('Готовы разобраться с этим раз и навсегда? Запишитесь на бесплатную консультацию прямо сейчас.');

const files = fs.readdirSync(RU_DIR).filter(f => f.endsWith('.html'));
let updated = 0;
let skipped = 0;

files.forEach(filename => {
    const filePath = path.join(RU_DIR, filename);
    let c = fs.readFileSync(filePath, 'utf8');
    const original = c;

    // 1. Update dateModified in JSON-LD (always)
    c = c.replace(/"dateModified":\s*"\d{4}-\d{2}-\d{2}"/g, `"dateModified": "${TODAY_ISO}"`);

    // 2. Update visible "Обновлено" date (always)
    c = c.replace(/(&#128197;\s*Обновлено:\s*)[^<"]+/g, `$1${TODAY_DISPLAY}`);

    // Skip structural changes if already processed
    if (c.includes('class="article-byline-bar"')) {
        skipped++;
        if (c !== original) { fs.writeFileSync(filePath, c, 'utf8'); updated++; }
        return;
    }

    // 3. Extract datePublished for display
    const datePublished = extractDatePublished(c);
    const pubDisplay = formatDateRu(datePublished);

    // 4. Add CSS (inject before </head>)
    c = c.replace('</head>', `    <style>${EXTRA_CSS}    </style>\n</head>`);

    // 5. Add H2 IDs and collect headings for TOC
    const h2Headings = [];
    c = c.replace(/<h2>([^<]+)<\/h2>/g, (match, text) => {
        const idx = h2Headings.length + 1;
        h2Headings.push({ id: `toc-${idx}`, text: text.trim() });
        return `<h2 id="toc-${idx}">${text}</h2>`;
    });

    // 6. Build author byline bar
    const bylineHTML = `
    <!-- Author Byline Bar -->
    <div class="article-byline-bar">
        <img src="/images/luba-hero.webp" alt="Любовь Лукащук" width="44" height="44">
        <div class="byline-info">
            <a href="/ru/ob-avtore">Любовь Лукащук</a>
            <span>Психолог · 10+ лет практики · Автор метода «Денежный Водопад»</span>
        </div>
        <span class="byline-date">Опубликовано: ${pubDisplay} · Обновлено: ${TODAY_DISPLAY}</span>
    </div>
`;

    // Insert byline between </section> and <!-- Content --> / <main>
    c = c.replace(
        '    </section>\n\n    <!-- Content -->\n    <main class="content">',
        `    </section>${bylineHTML}\n    <!-- Content -->\n    <main class="content">`
    );

    // 7. Build and insert TOC (after first </div> that closes answer-box, before first H2)
    if (h2Headings.length > 0) {
        const tocItems = h2Headings.map(h =>
            `                <li><a href="#${h.id}">${h.text}</a></li>`
        ).join('\n');
        const tocHTML = `
        <!-- Table of Contents -->
        <div class="article-toc">
            <h4>Содержание статьи</h4>
            <ol>
${tocItems}
            </ol>
        </div>

        `;
        // Insert TOC before the first H2 (toc-1)
        c = c.replace('<h2 id="toc-1">', tocHTML + '<h2 id="toc-1">');
    }

    // 8. Mid-article CTA #1 — before 3rd H2 (problem identified, heading into causes)
    if (h2Headings.length >= 3) {
        c = c.replace('<h2 id="toc-3">', MID_CTA_1 + '        <h2 id="toc-3">');
    }

    // 9. Mid-article CTA #2 — before last H2 or 5th H2 (near solution section)
    const lastTocId = h2Headings.length;
    const cta2Target = lastTocId >= 5 ? 5 : (lastTocId >= 4 ? lastTocId : 0);
    if (cta2Target > 0 && cta2Target !== 3) {
        c = c.replace(`<h2 id="toc-${cta2Target}">`, MID_CTA_2 + `        <h2 id="toc-${cta2Target}">`);
    }

    if (c !== original) {
        fs.writeFileSync(filePath, c, 'utf8');
        updated++;
    }
});

console.log(`Updated: ${updated} files | Skipped (already processed): ${skipped}`);

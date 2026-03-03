/**
 * Standardize /ru/ article page design
 *
 * Adds to every /ru/ page:
 * 1. Unified site navigation header (matching index.html style)
 * 2. Breadcrumb navigation with BreadcrumbList JSON-LD schema
 * 3. Reading time estimate (~X мин чтения)
 * 4. "Обновлено: январь 2025" date near H1
 *
 * Does NOT modify article content itself.
 */

const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '..', 'ru');

// If a filename is passed as argument, only process that file (for testing)
const testFile = process.argv[2] || null;
// If a second argument is passed, write output there instead of overwriting
const outputFile = process.argv[3] || null;

// ============================================================
// Navigation HTML - matches index.html structure and classes
// ============================================================
const siteNavHTML = `<!-- Site Navigation - Standardized -->
<nav id="site-nav" style="background: white; padding: 15px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000;">
    <div class="nav-content" style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
        <a href="/" style="font-size: 1.5rem; font-weight: bold; color: #6b46c1; text-decoration: none;">Денежный Водопад</a>
        <ul style="display: flex; gap: 30px; list-style: none; margin: 0; padding: 0; align-items: center;">
            <li><a href="/#about" style="color: #1f2937; text-decoration: none; font-weight: 500;">О программе</a></li>
            <li><a href="/#method" style="color: #1f2937; text-decoration: none; font-weight: 500;">Методика</a></li>
            <li><a href="/#pricing" style="color: #1f2937; text-decoration: none; font-weight: 500;">Стоимость</a></li>
            <li><a href="/pages/" style="color: #1f2937; text-decoration: none; font-weight: 500;">Статьи</a></li>
        </ul>
        <a href="https://t.me/LyubovUA" style="background: #0088cc; color: white; padding: 10px 25px; border-radius: 25px; text-decoration: none; font-weight: bold;">Telegram</a>
    </div>
</nav>`;

// Mobile-responsive CSS for the nav
const mobileNavCSS = `
/* Standardized Navigation */
@media (max-width: 768px) {
    #site-nav .nav-content {
        flex-wrap: wrap;
        gap: 10px;
        padding: 0 10px;
    }
    #site-nav ul {
        display: none !important;
    }
}

/* Breadcrumb styles */
.std-breadcrumb {
    padding: 12px 30px;
    background: #f9fafb;
    font-size: 14px;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
}
.std-breadcrumb a {
    color: #6b46c1;
    text-decoration: none;
}
.std-breadcrumb a:hover {
    text-decoration: underline;
}
.std-breadcrumb ol {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    margin: 0;
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
}
.std-breadcrumb li::after {
    content: "›";
    margin: 0 8px;
    color: #9ca3af;
}
.std-breadcrumb li:last-child::after {
    content: "";
}
.std-breadcrumb li:last-child {
    color: #374151;
}

/* Article meta (reading time + date) */
.article-meta-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 10px 0 0 0;
    font-size: 14px;
    color: #6b7280;
    flex-wrap: wrap;
}
.article-meta-bar .read-time {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.article-meta-bar .updated-date {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
`;

/**
 * Extract the <title> text from the page
 */
function extractTitle(html) {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
    if (!match) return 'Статья';
    // Remove brackets, site name suffixes, etc.
    let title = match[1].trim();
    // Remove common suffixes like "| Денежный Водопад" or "- Денежный Водопад"
    title = title.replace(/\s*[\|–—\-]\s*Денежный Водопад.*$/i, '').trim();
    // Remove brackets like [Гайд], [Полный гайд], etc.
    title = title.replace(/\s*\[.*?\]\s*/g, ' ').trim();
    return title;
}

/**
 * Extract H1 text from the page
 */
function extractH1(html) {
    const match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
    if (!match) return null;
    // Strip HTML tags from H1 content
    return match[1].replace(/<[^>]+>/g, '').trim();
}

/**
 * Count words in visible text (strip all HTML tags, scripts, styles)
 */
function countWords(html) {
    // Remove scripts and styles
    let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
    // Remove all HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Remove HTML entities
    text = text.replace(/&[a-z]+;/gi, ' ');
    // Split by whitespace and count
    const words = text.split(/\s+/).filter(w => w.length > 0);
    return words.length;
}

/**
 * Calculate reading time (Russian avg ~200 wpm)
 */
function readingTime(wordCount) {
    return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Check if the page already has a standardized nav
 */
function hasStandardNav(html) {
    return html.includes('id="site-nav"');
}

/**
 * Check if the page already has standardized breadcrumbs
 */
function hasStandardBreadcrumb(html) {
    return html.includes('class="std-breadcrumb"');
}

/**
 * Check if the page already has article-meta-bar
 */
function hasArticleMeta(html) {
    return html.includes('class="article-meta-bar"');
}

/**
 * Generate breadcrumb HTML and JSON-LD
 */
function generateBreadcrumb(filename, articleTitle) {
    const slug = filename.replace('.html', '');

    const breadcrumbHTML = `<!-- Breadcrumb Navigation -->
<nav class="std-breadcrumb" aria-label="breadcrumb">
    <ol>
        <li><a href="/">Главная</a></li>
        <li><a href="/pages/">Статьи</a></li>
        <li>${articleTitle}</li>
    </ol>
</nav>`;

    const breadcrumbSchema = `<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://lyubovpsy.com/"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Статьи",
            "item": "https://lyubovpsy.com/pages/"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "${articleTitle.replace(/"/g, '\\"')}",
            "item": "https://lyubovpsy.com/ru/${slug}"
        }
    ]
}
</script>`;

    return { breadcrumbHTML, breadcrumbSchema };
}

/**
 * Generate article meta HTML (reading time + updated date)
 */
function generateArticleMeta(wordCount) {
    const minutes = readingTime(wordCount);
    return `<div class="article-meta-bar">
        <span class="read-time">&#128337; ~${minutes} мин чтения</span>
        <span class="updated-date">&#128197; Обновлено: январь 2025</span>
    </div>`;
}

/**
 * Process a single HTML file
 */
function processFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    let changes = [];

    // Skip if already fully standardized
    if (hasStandardNav(html) && hasStandardBreadcrumb(html) && hasArticleMeta(html)) {
        console.log(`  SKIP ${filename} - already standardized`);
        return { html, changes: ['already standardized'] };
    }

    const title = extractTitle(html);
    const h1Text = extractH1(html) || title;
    const wordCount = countWords(html);

    // === 1. Add mobile-responsive CSS into <style> or before </head> ===
    if (!html.includes('.std-breadcrumb')) {
        // Find the last </style> in <head> and append our CSS before it
        // Or find </head> and add a <style> block
        const headEnd = html.indexOf('</head>');
        if (headEnd !== -1) {
            const styleBlock = `\n<style>\n${mobileNavCSS}\n</style>\n`;
            html = html.slice(0, headEnd) + styleBlock + html.slice(headEnd);
            changes.push('Added standardized CSS');
        }
    }

    // === 2. Add BreadcrumbList JSON-LD schema in <head> ===
    if (!hasStandardBreadcrumb(html) && !html.includes('"BreadcrumbList"')) {
        const { breadcrumbSchema } = generateBreadcrumb(filename, h1Text);
        const headEnd = html.indexOf('</head>');
        if (headEnd !== -1) {
            html = html.slice(0, headEnd) + '\n' + breadcrumbSchema + '\n' + html.slice(headEnd);
            changes.push('Added BreadcrumbList JSON-LD');
        }
    }

    // === 3. Add site navigation right after <body> ===
    if (!hasStandardNav(html)) {
        const bodyMatch = html.match(/<body[^>]*>/i);
        if (bodyMatch) {
            const bodyTagEnd = html.indexOf(bodyMatch[0]) + bodyMatch[0].length;
            const { breadcrumbHTML } = generateBreadcrumb(filename, h1Text);

            const insertBlock = '\n' + siteNavHTML + '\n' + breadcrumbHTML + '\n';
            html = html.slice(0, bodyTagEnd) + insertBlock + html.slice(bodyTagEnd);
            changes.push('Added site navigation');
            changes.push('Added breadcrumb navigation');
        }
    } else if (!hasStandardBreadcrumb(html)) {
        // Nav exists but breadcrumb doesn't - add breadcrumb after nav
        const navEnd = html.indexOf('</nav>', html.indexOf('id="site-nav"'));
        if (navEnd !== -1) {
            const { breadcrumbHTML } = generateBreadcrumb(filename, h1Text);
            const insertPos = navEnd + '</nav>'.length;
            html = html.slice(0, insertPos) + '\n' + breadcrumbHTML + html.slice(insertPos);
            changes.push('Added breadcrumb navigation');
        }
    }

    // === 4. Add reading time + updated date after H1 ===
    if (!hasArticleMeta(html)) {
        const h1Match = html.match(/<\/h1>/i);
        if (h1Match) {
            const h1End = html.indexOf(h1Match[0]) + h1Match[0].length;
            const metaHTML = '\n' + generateArticleMeta(wordCount);
            html = html.slice(0, h1End) + metaHTML + html.slice(h1End);
            changes.push(`Added article meta (${readingTime(wordCount)} мин, ${wordCount} words)`);
        }
    }

    return { html, changes };
}

// ============================================================
// Main execution
// ============================================================

if (testFile) {
    // Test mode: process single file
    const filePath = path.join(articlesDir, testFile);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    console.log(`Testing on: ${testFile}`);
    const { html, changes } = processFile(filePath);

    if (outputFile) {
        const outPath = path.join(__dirname, '..', outputFile);
        fs.writeFileSync(outPath, html, 'utf-8');
        console.log(`Output written to: ${outPath}`);
    } else {
        fs.writeFileSync(filePath, html, 'utf-8');
        console.log(`Updated: ${filePath}`);
    }

    console.log('Changes:', changes.join(', '));
} else {
    // Batch mode: process all files
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
    console.log(`Processing ${files.length} article files...\n`);

    let updated = 0;
    let skipped = 0;

    for (const file of files) {
        const filePath = path.join(articlesDir, file);
        const { html, changes } = processFile(filePath);

        if (changes.includes('already standardized')) {
            skipped++;
        } else if (changes.length > 0) {
            fs.writeFileSync(filePath, html, 'utf-8');
            console.log(`  UPDATED ${file}: ${changes.join(', ')}`);
            updated++;
        }
    }

    console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}, Total: ${files.length}`);
}

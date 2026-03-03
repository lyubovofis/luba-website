# Design System — lyubovpsy.com / Денежный Водопад

> **Используй этот файл при создании или редактировании любой страницы.**
> Все токены, компоненты и HTML-шаблоны взяты из реального кода сайта.

---

## 1. Color Tokens (CSS Variables)

```css
:root {
    /* Brand */
    --primary:       #6b46c1;   /* основной фиолетовый */
    --primary-dark:  #553c9a;   /* тёмный фиолетовый (hover, gradient end) */
    --primary-light: #9f7aea;   /* светлый фиолетовый (borders, accents) */
    --gold:          #fbbf24;   /* золотой акцент (цифры, highlights) */

    /* Neutrals */
    --dark:          #1f2937;   /* почти чёрный (footer bg, заголовки) */
    --light:         #f9fafb;   /* светло-серый (alternate секции фона) */
    --text:          #374151;   /* основной цвет текста */
    --text-light:    #6b7280;   /* вторичный текст (подписи, описания) */
    --white:         #ffffff;

    /* Status */
    --success:       #10b981;   /* зелёный (✓ check, guarantee) */
    --danger:        #ef4444;   /* красный (badge "хит", скидка) */

    /* Gradients (как переменные) */
    --gradient: linear-gradient(135deg, rgba(107,70,193,0.95), rgba(85,60,154,0.95));
}
```

### Дополнительные цвета (не в переменных, но используются):

| Назначение | Hex |
|---|---|
| Фон страницы (body) | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` |
| TOC фон | `#faf5ff` |
| TOC border | `#e9d5ff` |
| Byline border | `#e9d5ff` |
| Money impact bg | `linear-gradient(135deg, #fef3c7, #fde68a)` |
| Money impact title | `#92400e` |
| SEO footer bg | `linear-gradient(180deg, #1a1625 0%, #0d0a12 100%)` |
| SEO footer text | `#e2dfe8` |
| SEO footer links | `#a89fc4` |
| SEO footer brand gold | `linear-gradient(135deg, #fbbf24, #f59e0b)` |
| WhatsApp | `#25d366` |
| Telegram | `#0088cc` |
| Instagram gradient | `linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)` |
| FAQ hover bg | `#e5e7eb` |
| Guarantee bg | `linear-gradient(135deg, #10b981, #059669)` |

---

## 2. Typography

```css
/* Article pages */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;

/* Homepage / listing pages */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale

| Element | Size | Weight | Color |
|---|---|---|---|
| `h1` hero (article) | `2.5rem` / `clamp(32px, 5vw, 56px)` | 700–900 | white (on gradient) |
| `h1` mobile | `1.8rem` | — | — |
| `h2` article | `1.8rem` | — | `--primary-dark` |
| `h2` homepage | `clamp(28px, 4vw, 42px)` | — | `--dark` |
| `h3` | `1.3rem` | — | `--primary-dark` |
| `h4` card titles | `1.1rem` | — | `--primary-dark` |
| Body | `1rem` | 400 | `--text` |
| Body article | line-height `1.7` | — | — |
| Body homepage | line-height `1.6–1.8` | — | — |
| Small / meta | `0.8–0.9rem` | — | `--text-light` |
| TOC label | `0.78rem` UPPERCASE | 700 | `--primary` |

---

## 3. Spacing & Layout

```css
/* Wrapper */
.wrapper { max-width: 1200px; margin: 0 auto; background: white; box-shadow: 0 0 50px rgba(0,0,0,0.3); }

/* Content area (articles) */
.content { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }

/* Container (homepage sections) */
.container { max-width: 1000px; margin: 0 auto; }

/* Section padding */
.section { padding: 60px 30px; }
.section:nth-child(even) { background: var(--light); }

/* Hero */
.hero (article) { padding: 4rem 2rem; }
.hero (homepage) { padding: 80px 30px; }
```

### Breakpoints

| Breakpoint | Value |
|---|---|
| Mobile | `max-width: 768px` |
| Small mobile | `max-width: 640px` |
| Small mobile 2 | `max-width: 480px` |
| Large (SEO footer) | `max-width: 1200px` |

---

## 4. Component Library

### 4.1 Navigation Bar

```html
<nav id="site-nav" style="background: white; padding: 15px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000;">
    <div class="nav-content" style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
        <a href="/" style="font-size: 1.5rem; font-weight: bold; color: #6b46c1; text-decoration: none;">Денежный Водопад</a>
        <ul style="display: flex; gap: 30px; list-style: none; margin: 0; padding: 0; align-items: center;">
            <li><a href="/#about" style="color: #1f2937; text-decoration: none; font-weight: 500;">О программе</a></li>
            <li><a href="/#method" style="color: #1f2937; text-decoration: none; font-weight: 500;">Методика</a></li>
            <li><a href="/#pricing" style="color: #1f2937; text-decoration: none; font-weight: 500;">Стоимость</a></li>
            <li><a href="/ru/blog" style="color: #1f2937; text-decoration: none; font-weight: 500;">Статьи</a></li>
        </ul>
        <a href="https://t.me/LyubovUA" style="background: #0088cc; color: white; padding: 10px 25px; border-radius: 25px; text-decoration: none; font-weight: bold;">Telegram</a>
    </div>
</nav>
```
*Mobile: hide `<ul>`, show sticky CTA bottom bar instead.*

---

### 4.2 Breadcrumb

```css
.std-breadcrumb { padding: 12px 30px; background: #f9fafb; font-size: 14px; color: #4b5563; border-bottom: 1px solid #e5e7eb; }
.std-breadcrumb a { color: #6b46c1; text-decoration: none; }
.std-breadcrumb ol { list-style: none; display: flex; flex-wrap: wrap; gap: 0; margin: 0 auto; padding: 0; max-width: 1200px; }
.std-breadcrumb li::after { content: "›"; margin: 0 8px; color: #6b7280; }
.std-breadcrumb li:last-child::after { content: ""; }
.std-breadcrumb li:last-child { color: #374151; }
```

```html
<nav class="std-breadcrumb" aria-label="breadcrumb">
    <ol>
        <li><a href="/">Главная</a></li>
        <li><a href="/ru/blog">Статьи</a></li>
        <li>Заголовок статьи</li>
    </ol>
</nav>
```

---

### 4.3 Hero Section (Articles)

```css
.hero { background: var(--gradient); padding: 4rem 2rem; text-align: center; color: var(--white); }
.hero-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1.5rem; backdrop-filter: blur(10px); }
.hero-subtitle { font-size: 1.3rem; opacity: 0.95; margin-bottom: 2rem; max-width: 700px; margin-left: auto; margin-right: auto; }
```

```html
<section class="hero">
    <div class="hero-content">
        <div class="hero-badge">🧠 Психология денег</div>
        <h1>Заголовок страницы</h1>
        <p class="hero-subtitle">Подзаголовок / описание темы</p>
        <div class="article-meta-bar">
            <span class="read-time">⏱ 8 мин читать</span>
            <span class="updated-date">📅 Обновлено: март 2026</span>
        </div>
    </div>
</section>
```

---

### 4.4 Author Byline Bar

```css
.article-byline-bar { display: flex; align-items: center; gap: 12px; padding: 14px 30px; background: #fff; border-bottom: 1px solid #e5e7eb; flex-wrap: wrap; }
.article-byline-bar img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #e9d5ff; }
.byline-info a { font-weight: 700; color: #6b46c1; text-decoration: none; font-size: 0.95rem; }
.byline-info span { font-size: 0.80rem; color: #4b5563; }
.byline-date { font-size: 0.80rem; color: #4b5563; margin-left: auto; white-space: nowrap; }
```

```html
<div class="article-byline-bar">
    <img src="/images/luba-hero.webp" alt="Любовь Лукащук" width="44" height="44">
    <div class="byline-info">
        <a href="/ru/ob-avtore">Любовь Лукащук</a>
        <span>Психолог · Денежный Водопад · 10+ лет практики</span>
    </div>
    <span class="byline-date">Март 2026</span>
</div>
```

---

### 4.5 Table of Contents

```css
.article-toc { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 18px 22px; margin: 0 0 32px 0; }
.article-toc h4 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; color: #6b46c1; margin: 0 0 10px 0; font-weight: 700; }
.article-toc ol { margin: 0; padding: 0 0 0 20px; }
.article-toc li { margin-bottom: 5px; }
.article-toc a { color: #374151; text-decoration: none; font-size: 0.91rem; }
.article-toc a:hover { color: #6b46c1; text-decoration: underline; }
```

```html
<div class="article-toc">
    <h4>Содержание</h4>
    <ol>
        <li><a href="#toc-1">Что это такое</a></li>
        <li><a href="#toc-2">Причины</a></li>
        <li><a href="#toc-3">Как работать</a></li>
        <li><a href="#toc-4">FAQ</a></li>
    </ol>
</div>
```

---

### 4.6 Answer Box (highlighted insight)

```css
.answer-box { background: var(--white); border-radius: 20px; padding: 2.5rem; margin: 2rem 0; box-shadow: 0 10px 40px rgba(107, 70, 193, 0.15); border-left: 5px solid var(--primary); }
.answer-box h3 { color: var(--primary); margin-top: 0; }
```

```html
<div class="answer-box">
    <h3>Ключевой вывод</h3>
    <p>Текст важного инсайта или определения...</p>
</div>
```

---

### 4.7 Cards Grid (Fear / Feature cards)

```css
.fear-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
.fear-card { background: var(--white); border-radius: 15px; padding: 2rem; box-shadow: 0 5px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; border-top: 4px solid var(--primary); }
.fear-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(107, 70, 193, 0.15); }
.fear-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.fear-card h4 { color: var(--primary-dark); margin-bottom: 0.75rem; font-size: 1.1rem; }
.fear-card p { color: var(--text-light); font-size: 0.95rem; margin-bottom: 0; }
```

```html
<div class="fear-cards">
    <div class="fear-card">
        <div class="fear-icon">💸</div>
        <h4>Заголовок карточки</h4>
        <p>Описание...</p>
    </div>
</div>
```

---

### 4.8 Gold Impact Box (money/numbers highlight)

```css
.money-impact { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 20px; padding: 2.5rem; margin: 2rem 0; }
.money-impact h3 { color: #92400e; margin-top: 0; }
.impact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
.impact-item { background: var(--white); padding: 1.25rem; border-radius: 12px; display: flex; align-items: flex-start; gap: 1rem; }
.impact-item strong { color: var(--primary-dark); display: block; margin-bottom: 0.25rem; }
.impact-item span { color: var(--text-light); font-size: 0.9rem; }
```

```html
<div class="money-impact">
    <h3>💰 Как это влияет на деньги</h3>
    <div class="impact-grid">
        <div class="impact-item">
            <span class="impact-icon">📉</span>
            <div>
                <strong>Снижение дохода</strong>
                <span>Описание последствия</span>
            </div>
        </div>
    </div>
</div>
```

---

### 4.9 Mid-Article CTA (inline CTA between sections)

```css
.mid-article-cta { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #c4b5fd; border-radius: 14px; padding: 22px 26px; margin: 38px 0; text-align: center; }
.mid-article-cta p { font-size: 1rem; color: #1f2937; margin: 0 0 14px 0; line-height: 1.6; font-weight: 500; }
.mid-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.mid-cta-btn-wa, .mid-cta-btn-tg { padding: 11px 22px; border-radius: 25px; text-decoration: none !important; font-weight: 600; font-size: 0.92rem; display: inline-block; transition: opacity 0.2s; }
.mid-cta-btn-wa { background: #25d366; color: white !important; }
.mid-cta-btn-tg { background: #0088cc; color: white !important; }
.mid-cta-btn-wa:hover, .mid-cta-btn-tg:hover { opacity: 0.9; }
```

```html
<div class="mid-article-cta">
    <p>Узнайте, как эта тема проявляется именно у вас — на бесплатной 15-минутной консультации.</p>
    <div class="mid-cta-btns">
        <a href="https://wa.me/34654420334?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!+%D0%A5%D0%BE%D1%87%D1%83+%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%D1%81%D1%8F+%D0%BD%D0%B0+%D0%B1%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%83%D1%8E+%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E" class="mid-cta-btn-wa">💬 WhatsApp</a>
        <a href="https://t.me/LyubovUA" class="mid-cta-btn-tg">✈ Telegram</a>
    </div>
</div>
```

---

### 4.10 Steps Grid

```css
.steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
.step-card { background: var(--white); border-radius: 15px; padding: 2rem; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.08); }
.step-number { width: 50px; height: 50px; background: var(--gradient); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; margin: 0 auto 1rem; }
.step-card h4 { color: var(--primary-dark); margin-bottom: 0.5rem; }
.step-card p { color: var(--text-light); font-size: 0.9rem; margin-bottom: 0; }
```

```html
<div class="steps-grid">
    <div class="step-card">
        <div class="step-number">1</div>
        <h4>Шаг первый</h4>
        <p>Описание шага</p>
    </div>
</div>
```

---

### 4.11 Expert / Author Block

```css
.expert-section { background: var(--white); border-radius: 20px; padding: 3rem; margin: 3rem 0; display: grid; grid-template-columns: 200px 1fr; gap: 2rem; align-items: center; box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
.expert-photo { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 5px solid var(--primary-light); }
.stat-number { font-size: 1.8rem; font-weight: 700; color: var(--primary); }
.stat-label { font-size: 0.85rem; color: var(--text-light); }
```

```html
<div class="expert-section">
    <img src="/images/luba-hero.webp" alt="Любовь Лукащук" class="expert-photo">
    <div class="expert-info">
        <h3>Любовь Лукащук</h3>
        <p>Психолог, автор метода «Денежный Водопад». 10+ лет, 8000+ часов практики.</p>
        <div class="expert-stats">
            <div class="stat"><div class="stat-number">8000+</div><div class="stat-label">часов практики</div></div>
            <div class="stat"><div class="stat-number">1000+</div><div class="stat-label">трансформаций</div></div>
            <div class="stat"><div class="stat-number">10 лет</div><div class="stat-label">опыт</div></div>
        </div>
    </div>
</div>
```
*Mobile: `grid-template-columns: 1fr`, center photo.*

---

### 4.12 Full-Width CTA Section

```css
.cta-section { background: var(--gradient); border-radius: 20px; padding: 3rem; text-align: center; color: var(--white); margin: 3rem 0; }
.cta-section h3 { color: var(--white); font-size: 1.8rem; margin-bottom: 1rem; }
.cta-section p { color: rgba(255,255,255,0.9); font-size: 1.1rem; margin-bottom: 2rem; }
.btn-white { background: var(--white); color: var(--primary); }
.btn-white:hover { background: var(--light); }
```

```html
<div class="cta-section">
    <h3>Готовы трансформировать отношения с деньгами?</h3>
    <p>Запишитесь на бесплатную 15-минутную консультацию — узнайте, какие блоки мешают именно вам</p>
    <div class="cta-buttons">
        <a href="https://wa.me/34654420334?text=Здравствуйте! Хочу записаться на бесплатную консультацию по программе Денежный Водопад" class="btn btn-white">💬 WhatsApp</a>
        <a href="https://t.me/LyubovUA" class="btn btn-outline" style="border-color: white; color: white;">✈ Telegram</a>
    </div>
</div>
```

---

### 4.13 FAQ Accordion

```css
.faq-section { margin: 3rem 0; }
.faq-item { background: var(--white); border-radius: 12px; margin-bottom: 1rem; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.faq-question { padding: 1.5rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; }
.faq-question:hover { background: #e5e7eb; }
.faq-question::after { content: '+'; font-size: 1.5rem; color: var(--primary); transition: transform 0.3s ease; }
.faq-item.active .faq-question::after { transform: rotate(45deg); }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-item.active .faq-answer { max-height: 500px; }
.faq-answer p { padding: 0 1.5rem 1.5rem; color: var(--text-light); }
```

```html
<div class="faq-section">
    <div class="faq-item">
        <div class="faq-question">Вопрос первый?</div>
        <div class="faq-answer"><p>Ответ на первый вопрос.</p></div>
    </div>
</div>
<script>
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
});
</script>
```

---

### 4.14 Result Cards (gradient purple)

```css
.results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin: 40px 0; }
.result-item { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 30px; border-radius: 15px; text-align: center; }
.result-icon { font-size: 48px; margin-bottom: 15px; }
.result-title { font-size: 20px; margin-bottom: 10px; }
.result-desc { opacity: 0.95; }
```

---

### 4.15 Pricing Cards

```css
.pricing-wrapper { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); border-radius: 20px; padding: 50px 30px; text-align: center; color: white; }
.pricing-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin: 30px 0; }
.price-card { background: white; color: var(--dark); border-radius: 15px; padding: 40px 30px; }
.price-card.featured { transform: scale(1.05); box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.price-badge { position: absolute; top: -15px; right: 20px; background: var(--danger); color: white; padding: 5px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; }
.price-amount { font-size: 48px; font-weight: bold; color: var(--primary); margin: 20px 0; }
.price-features li:before { content: "✓"; color: var(--success); font-weight: bold; margin-right: 10px; }
```

---

### 4.16 Guarantee Box

```css
.guarantee-box { background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 20px; padding: 40px; text-align: center; margin: 40px 0; }
.guarantee-icon { font-size: 64px; margin-bottom: 20px; }
.guarantee-title { font-size: 28px; margin-bottom: 15px; }
```

---

### 4.17 Testimonial Card

```css
.testimonial-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); margin-bottom: 30px; }
.testimonial-result { background: var(--gold); color: var(--dark); padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold; }
.testimonial-quote { font-style: italic; font-size: 18px; color: var(--primary); border-left: 4px solid var(--primary); padding-left: 20px; margin-top: 20px; }
```

---

### 4.18 Buttons

```css
/* Base button */
.btn { padding: 0.75rem 1.5rem; border-radius: 30px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem; }

/* Primary (gradient purple) */
.btn-primary { background: var(--gradient); color: var(--white); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(107, 70, 193, 0.4); }

/* Outline */
.btn-outline { border: 2px solid var(--primary); color: var(--primary); background: transparent; }
.btn-outline:hover { background: var(--primary); color: var(--white); }

/* White (on dark bg) */
.btn-white { background: var(--white); color: var(--primary); }

/* WhatsApp */
.btn-whatsapp { background: #25d366; color: white; }
.btn-whatsapp:hover { background: #20b858; }

/* Gold (large CTA on homepage) */
.btn-gold { background: var(--gold); color: var(--dark); padding: 20px 50px; border-radius: 50px; font-size: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
```

---

### 4.19 Sticky Mobile CTA

```css
.sticky-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--white); padding: 1rem; box-shadow: 0 -5px 20px rgba(0,0,0,0.1); z-index: 99; }
@media (max-width: 768px) { .sticky-cta { display: block; } }
```

---

### 4.20 Hero Stats Bar

```css
.hero-stats { display: flex; justify-content: center; gap: 40px; margin: 40px 0; flex-wrap: wrap; }
.stat-number { font-size: 36px; font-weight: bold; color: var(--gold); }
.stat-label { font-size: 14px; opacity: 0.9; }
```

```html
<div class="hero-stats">
    <div class="stat-item"><div class="stat-number">347</div><div class="stat-label">женщин трансформировали жизнь</div></div>
    <div class="stat-item"><div class="stat-number">8</div><div class="stat-label">недель до результата</div></div>
    <div class="stat-item"><div class="stat-number">10 лет</div><div class="stat-label">опыт работы</div></div>
</div>
```

---

### 4.21 SEO Footer (component)

Include via: `<!-- SEO footer content from components/seo-footer.html -->`

Dark background (`#1a1625`), purple/gold accent colors, 5-column grid of category links → collapses to 2 cols on mobile. Contact icons: WhatsApp, Telegram, Instagram.

---

## 5. Animations & Transitions

```css
/* Standard hover lift */
transform: translateY(-5px);
box-shadow: 0 10px 30px rgba(107, 70, 193, 0.15);

/* Button press */
transform: translateY(-2px);
box-shadow: 0 5px 20px rgba(107, 70, 193, 0.4);

/* Fade in */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Standard transition */
transition: all 0.3s ease;
transition: opacity 0.2s;
```

---

## 6. Shadows

| Usage | Value |
|---|---|
| Wrapper | `0 0 50px rgba(0,0,0,0.3)` |
| Card default | `0 5px 20px rgba(0,0,0,0.08)` |
| Card hover | `0 10px 30px rgba(107, 70, 193, 0.15)` |
| Card heavy | `0 10px 40px rgba(107, 70, 193, 0.15)` |
| Answer box | `0 10px 40px rgba(107, 70, 193, 0.15)` |
| Expert section | `0 10px 40px rgba(0,0,0,0.08)` |
| Nav sticky | `0 2px 10px rgba(0,0,0,0.1)` |
| Sticky mobile CTA | `0 -5px 20px rgba(0,0,0,0.1)` |
| Featured price card | `0 10px 40px rgba(0,0,0,0.3)` |

---

## 7. Border Radius Scale

| Size | Value | Usage |
|---|---|---|
| Small | `8–10px` | FAQ items, test options |
| Medium | `12–15px` | Cards, breadcrumb bg |
| Large | `20px` | Answer box, CTA, pricing |
| Extra | `25–30px` | Buttons, nav CTA |
| Circle | `50%` | Avatar, step numbers |

---

## 8. Body Background

Every page has this body gradient (shows around wrapper):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## 9. Images

| Asset | Path | Usage |
|---|---|---|
| Luba headshot | `/images/luba-hero.webp` | Hero bg, author photo, byline |
| Seminar 1 | `/images/IMG_20240313_125809_920.webp` | About page |
| Seminar 2 | `/images/IMG_20240313_125832_795.webp` | About page |
| OG default | `/images/og-default.jpg` | Open Graph fallback |
| Favicon | `/favicon-32x32.png`, `/favicon-16x16.png` | Browser tab |
| Apple touch | `/apple-touch-icon.png` | iOS |

---

## 10. Quick Reference — What to use where

| Need | Component |
|---|---|
| Definition / key insight | `answer-box` (purple left border) |
| 3–6 topics/features | `fear-cards` (white cards, purple top border) |
| Financial impact | `money-impact` (gold bg) |
| Process / how-to | `steps-grid` (numbered gradient circles) |
| Inline conversion | `mid-article-cta` (light purple bg) |
| Section conversion | `cta-section` (gradient full-width) |
| Social proof | `testimonial-card` (white + gold badge) |
| Author credibility | `expert-section` (2-col with stats) |
| Q&A | `faq-section` (accordion) |
| Pricing | `pricing-wrapper` > `price-card` |
| Guarantee | `guarantee-box` (green) |
| Navigation path | `std-breadcrumb` |
| Article start | `article-byline-bar` + `article-toc` |
| All pages footer | `seo-footer` (components/seo-footer.html) |

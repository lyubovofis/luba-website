# CLAUDE.md — lyubovpsy.com Project Context

## Project Overview

**Site:** https://lyubovpsy.com
**Brand:** Денежный Водопад (Money Waterfall)
**Type:** Psychology / Money mindset coaching / Personal transformation
**Stack:** Static HTML + Vercel (`cleanUrls: true` — never use `.html` in URLs)
**Language:** Russian only (`/ru/` prefix on all article pages)

## Author / Expert

- **Full name:** Любовь Лукащук (Lyubov Lukashchuk)
- **Title:** Мастер трансформации сознания и проводник в реальность изобилия
- **Role:** Psychologist, money mindset specialist, author of "Денежный Водопад" method
- **Experience:** 10+ years, 8000+ hours of individual sessions, 1000+ transformations
- **Education investment:** €50,000+ in education (best schools and masters in Europe and USA)
- **Personal therapy:** 3000+ hours of personal therapy and supervision
- **Based:** Online worldwide, based in Spain, origin: Odessa
- **Credentials (Schema-ready, verified):**
  - Мастер НЛП (нейролингвистическое программирование)
  - Мастер эриксоновского гипноза
  - Практик регрессивной терапии
  - NLP Practitioner — Erickson College International
  - ИНП Практик (144ч) — КВ ИП 00008
  - Мастер-Консультант ИНП — КВ 01058
  - Мастер-специалист ИНП — No 13394
  - Психотерапия семейных отношений — КВ 00738
  - Кризисная психотерапия (сертификат)
- **Key stats for articles:** 347+ женщин трансформировали жизнь, 8 недель до результата

## Target Audience

**Russian-speaking diaspora WORLDWIDE** — Israel, Germany, USA, Canada, Spain, Australia, etc.
**NOT Russia** — do not target Russia, do not use Russian domestic search context.
**Primary audience:** Women (not men) who feel stuck at their income level, have tried affirmations and courses without lasting results, struggle with self-worth and pricing their services.
**Core pain points:** "Не заслуживаю", "Боюсь поднять цены", "Деньги уходят сквозь пальцы", "Застряла на одном уровне дохода", "Деньги — это грязно/плохо"

## Official Contacts & Social Media

| Channel | Link / Handle |
|---------|--------------|
| WhatsApp | `https://wa.me/34654420334` (+34 654 420 334) |
| Telegram | `https://t.me/LyubovUA` |
| Instagram | `https://www.instagram.com/lyubov_psy_/` |
| YouTube | `https://www.youtube.com/@ЛюбовьЛукащукПсихолог` |
| Facebook | `https://www.facebook.com/lyubov.lukaschuk` |
| Twitter/X | `@LyubovUA` |

**Never use** `972539459969` (old Israeli number) or `Lyubov_psy` (old Telegram handle).

## Tracking Pixels (include in ALL pages)

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MFLSQ07PGM"></script>
<!-- GA ID: G-MFLSQ07PGM -->

<!-- Meta Pixel ID: 1078294070265498 -->
<!-- TikTok Pixel ID: CVPVVPJC77U3Q9FF4TE0 -->
<!-- Microsoft Clarity ID: r19dya1ytd -->
```

## URL Rules

- Vercel `cleanUrls: true` → files served without `.html` extension
- **Never include `.html`** in any URL, href, Schema.org `mainEntityOfPage`, sitemap, or link
- Correct: `https://lyubovpsy.com/ru/psihologiya-deneg`
- Wrong: `https://lyubovpsy.com/ru/psihologiya-deneg.html`

## Hreflang Coverage (35 regions)

`ru` + `ru-IL, ru-US, ru-DE, ru-CA, ru-AU, ru-GB, ru-FR, ru-ES, ru-IT, ru-PT, ru-NL, ru-BE, ru-AT, ru-CH, ru-CZ, ru-PL, ru-GR, ru-CY, ru-FI, ru-SE, ru-NO, ru-DK, ru-NZ, ru-AE, ru-TH, ru-SG, ru-JP, ru-KR, ru-AR, ru-BR, ru-MX, ru-ZA, ru-EE, ru-LV, ru-LT` + `x-default`

## Schema.org Requirements (all articles)

Every `/ru/*.html` article must include 4 Schema blocks:
1. **FAQPage** — 4–6 Q&A pairs
2. **Article** — with `author`, `publisher`, `mainEntityOfPage` (no .html)
3. **Service** — psychologist consultation offer
4. **WebPage (Speakable)** — with `speakable` cssSelector
5. **BreadcrumbList** — `Главная → Blog → Article`

## Article Template Reference

Use `ru/strah-osuzhdeniya.html` as the HTML structure reference for new articles.

## Program: Денежный Водопад (8-week transformation)

### The 4 Levels (always mention in content):
1. **Ментальный** — beliefs, limiting mindsets, subconscious rewriting (not just affirmations — real neural pathway rewiring)
2. **Эмоциональный** — fear, guilt, shame around money, emotional healing
3. **Энергетический** — body-level blocks, generational scenarios 3–7 generations back, energetic practices
4. **Физический** — new habits, daily routines, income strategies

### Program Formats & Pricing:
- **Трансформация** — €2000 / 8 individual sessions (60-90 min each)
- **Предназначение** — €2500 / 10 individual sessions
- Bonus: extra session when paid in full (€250 value)
- Market comparison: similar programs cost €3500-5000
- **Free entry point:** 15-min diagnostic consultation via WhatsApp or Telegram

### ROI messaging used in content:
- "Застряла на €2000? Могла бы зарабатывать €6000 — теряешь €4000/мес = €48,000/год"
- "Многие клиентки окупают инвестицию уже во время программы"
- First changes visible after 1-2 sessions; full results in 3-6 months post-program

### CTA messages for WhatsApp links (use verbatim):
- Free consult: `?text=Здравствуйте! Хочу записаться на бесплатную консультацию по программе Денежный Водопад`
- Трансформация package: `?text=Хочу пакет Трансформация за €2000`

## Design System

> **Полная система токенов, все компоненты с готовым HTML/CSS — в файле:**
> **`/design-system.md`** — читай его при создании или редактировании любой страницы.

### Ключевые токены (краткая выжимка):
```css
--primary: #6b46c1    --primary-dark: #553c9a    --primary-light: #9f7aea
--gold: #fbbf24       --dark: #1f2937             --light: #f9fafb
--text: #374151       --text-light: #6b7280       --success: #10b981
--gradient: linear-gradient(135deg, rgba(107,70,193,0.95), rgba(85,60,154,0.95))
```
- Body bg: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- WhatsApp: `#25d366` · Telegram: `#0088cc`
- Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

## Content Strategy

- **Method:** Денежный Водопад — 4 levels: mental (beliefs), emotional (feelings), energetic (body), physical (habits)
- **Tone:** Warm, expert, empathetic — speaks directly to diaspora pain points
- **Length:** 1500–5000 words per article
- **E-E-A-T:** Always include author bio block, credentials, personal experience markers
- **CTAs:** Free 15-min consultation via WhatsApp or Telegram throughout article

## Key Pages

| Page | URL |
|------|-----|
| Homepage | `/` |
| About author | `/ru/ob-avtore` |
| Blog index | `/ru/blog` |
| Reviews | `/ru/otzyvy` |
| Quiz | `/quiz` (→ `/quiz-test/index.html`) |
| Coaching | `/ru/kouching-onlayn` |

## Deployment

- **Platform:** Vercel (auto-deploy from `main` branch)
- **Repo:** GitHub (main branch)
- After pushing to `main`, deployment takes ~30–45 seconds

## Article Count

~96+ articles in `/ru/` as of 2026-03-03. Update `ru/blog.html` counter and sitemap.xml when adding new pages.

## File Structure

```
/
├── pages/index.html        # Homepage
├── ru/                     # All Russian articles
├── components/             # Shared HTML components
├── sitemap.xml
├── robots.txt
├── llms.txt
├── vercel.json
└── CLAUDE.md               # This file
```

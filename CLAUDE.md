# CLAUDE.md — lyubovpsy.com Project Context

## Project Overview

**Site:** https://lyubovpsy.com
**Brand:** Денежный Водопад (Money Waterfall)
**Type:** Psychology / Money mindset coaching / Personal transformation
**Stack:** Static HTML + Vercel (`cleanUrls: true` — never use `.html` in URLs)
**Language:** Russian only (`/ru/` prefix on all article pages)

## Author / Expert

- **Full name:** Любовь Лукащук (Lyubov Lukashchuk)
- **Role:** Psychologist, money mindset specialist, author of "Денежный Водопад" method
- **Experience:** 10+ years, 8000+ hours practice, 1000+ client transformations, €50,000 invested in education
- **Based:** Spain (online worldwide)
- **Origin:** Odessa
- **Credentials:** NLP Master, Eriksonian hypnosis, regression therapy, systemic constellations (Hellinger), genealogical work, 3000+ hours personal therapy

## Target Audience

**Russian-speaking diaspora WORLDWIDE** — Israel, Germany, USA, Canada, Spain, Australia, etc.
**NOT Russia** — do not target Russia, do not use Russian domestic search context.

## Official Contacts

| Channel | Link |
|---------|------|
| WhatsApp | `https://wa.me/34654420334` |
| Telegram | `https://t.me/LyubovUA` |
| Instagram | `https://www.instagram.com/lyubov_psy_/` |
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

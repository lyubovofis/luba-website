# lyubovpsy.com — 2026-2027 ranking & keyword-coverage plan
**Goal:** maximum keyword coverage in Google ("в топе по максимум слов") for the Russian-speaking diaspora.
**Baseline (GSC, 90d):** 81 clicks · 2.7k impressions · avg position 11.5 (page 2) · 154 indexed / 164 not indexed.

## ✅ DONE this session (live on production)
- **Tier-1 on-page** across 286 articles: schema entity-graph (@id, ImageObject, Organization sameAs), og:site_name, brand-in-title, `<main>` landmark, skip-link, `:focus-visible`, heading hierarchy. Whole-category pass: schema 0→97.6%, a11y 0→58%, brand 1.7→43%.
- **UI/UX fixes:** duplicate-nav overlap, related-block contrast (gold→readable), centered CTA, blog badges + counter 173→286.
- **sitemap lastmod** → today (recrawl signal) + **IndexNow** submitted (Bing/Yandex 200/202).
- Full audit: 286 pages × ~399 of 423 params = 114,114 checks, **92.2% passing**.

## NEXT — ordered by ROI for "max keywords in top"

### 1. Get the 164 NOT-indexed pages indexed  → +keywords fastest
Indexed pages can't rank for anything. Per prior analysis these are the 18-May programmatic batch (orphaned/throttled), not a tech bug.
- IndexNow ✅ done; monitor GSC "Pages" over next 2-3 weeks.
- **Internal linking:** ensure every article is linked from ≥3 other relevant articles (topic clusters) + from /ru/blog. Orphan = not crawled.
- In GSC, use **"Validate fix"** on the "Discovered/Crawled – not indexed" buckets after the recrawl.

### 2. Tier-2 on-page → featured snippets + AI Overviews (more SERP surfaces = more keywords)
Per-article content work (needs review — edits published expert content). Highest impact first:
- **Outbound authority links** (286 pages, #1 gap) — 1-2 links per article to a topically-relevant authority (WHO / APA / научные источники). E-E-A-T + GEO citations.
- **≥3 question-format H2/H3** (213 pages) — captures People-Also-Ask + voice. Phrase section headings as the real queries ("Почему … ?", "Как … ?").
- **"Кратко / Главное" TL;DR block** (179 pages) — 30-60 word answer near top → AI Overview + featured-snippet lift.
- **Citable statistics** (189 pages) — 5+ concrete numbers; LLMs/snippets prefer data.
- **Definition list / comparison table** — featured-snippet formats.
- **Brand "Денежный Водопад" in intro** (285) — entity reinforcement for AI.

### 3. Keyword expansion (new content) → net-new keyword coverage
- Use GSC "Performance → Queries" to find **page-2 keywords (pos 8-20)**: these are closest to top-10 — strengthen those pages first (biggest impression unlock).
- Build **topic clusters**: 1 pillar + N supporting articles per money-mindset theme, fully interlinked.
- Cover **long-tail diaspora queries** (country + pain): "психолог по деньгам для эмигрантов в [Германии/Израиле/США]" — low competition, high intent.
- Each new page: full Schema set + the Tier-1 signals (now baked into the template).

### 4. Measurement (verify "максимум слов")
- **GSC weekly:** total impressions, # of ranking queries, avg position, # indexed. Target: position 11.5 → <8, indexed 154 → 286.
- Connect **DataForSEO** (not currently connected) for rank tracking + competitor keyword-gap, or use GSC Queries export.
- Re-run the lazy audit monthly: `python lazy-method/lazy-check.py --config=lazy-config.json --site=ru --ci --categories=<18 non-browser>`.

## Risk note
Tier-2 (section 2) edits the author's PUBLISHED content at scale — quality/brand decision, best executed in reviewed batches, not blind automation (dead authority links or off-tone TL;DRs would hurt). Recommend running it per topic-cluster with spot-review.

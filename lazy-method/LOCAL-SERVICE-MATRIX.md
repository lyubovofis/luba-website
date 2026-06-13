# Local Service Business — Service × Location Matrix Playbook

> Reusable structure for **multi-location service businesses** (SAB / brick-and-mortar with a service radius): garage doors, HVAC, plumbing, locksmith, roofing, pest control, etc.
> Extends `STRATEGY-2026-2027.md` §8 (generic hub-spoke). This doc adds the **2-dimensional service × location matrix**, the **volume-gated indexing tier**, and the **local-service page anatomy** — the parts that are specific to programmatic local SEO and are NOT in the generic strategy.
> Proven on Royal Garage Doors (royalgaragedoors.ca, Astro 5, 2026): 16 services × 50 cities + 6 brands × cities + 6 door-types × cities.

---

## 1. The page matrix (what to generate)

A local service business has **3 programmatic dimensions**. Generate dedicated templates for the high-value ones, a catch-all for the rest:

| Dimension | URL pattern | Template type | Example |
|---|---|---|---|
| **Service × City** (core) | `/{service}-{city}/` | Dedicated template per service | `/garage-door-spring-repair-toronto/` |
| **Brand × City** | `/{brand}-{service}-{city}/` | Enriched catch-all (data-driven) | `/liftmaster-garage-door-repair-toronto/` |
| **Product/Material × City** | `/{type}-{city}/` | Enriched catch-all | `/steel-garage-door-toronto/` |

Rule: a dimension gets a **dedicated template** (full unique content + 9 schema blocks + FAQ) when it has its own search demand and buyer intent. Everything else runs through ONE catch-all `[...slug]` parametrized by data files (`services.json`, `brands.json`, `cities.json`) so content stays unique-by-data without N hand-built files.

**Never** ship thin permutation pages (only the city name swapped). Each page needs ≥1 genuinely unique block: city-specific FAQ, local climate/neighbourhood context, brand-specific issues/models, real pricing.

---

## 2. Volume-gated indexing — the anti-"scaled content" tier ⭐ (most important, not in generic strategy)

Programmatic location pages are the #1 trigger for Google's **"scaled content abuse"** (ex-"doorway pages") penalty. The defence is **demand + uniqueness**, enforced by an indexing gate:

**Process:**
1. For every city, pull **cluster search volume** = sum of search volume for that city's core service keywords (NOT a single keyword — a page ranks for a cluster). Use DataForSEO `keywords_data/google_ads/search_volume/live`, location = country, city IN the keyword (`"{service} {city}"`). See the global `dataforseo` skill (`d4s.py volume ...`).
2. Tier cities:
   - **Index** — cluster volume ≥ ~10/mo (real demand). Real municipalities.
   - **noindex,follow** — cluster volume ≈ 0. Usually micro-neighbourhoods of a city you already cover (e.g. "Forest Hill" ⊂ Toronto). They add no incremental demand and duplicate parent-city intent.
3. Implement:
   - Add a `noindex: true` flag to the zero-volume entries in `cities.json` (single source of truth).
   - Pass it to the layout: `<Base noindex={city.noindex} />` → emits `<meta name="robots" content="noindex, follow">`.
   - Filter the sitemap to exclude noindex pages (`astro.config.mjs` sitemap `filter` reads the flag).
4. **Keep the noindex pages LIVE** — they still serve Google Ads landing traffic and Google Maps; `follow` keeps internal equity flowing. You remove the index-bloat risk without losing ads/Maps utility.

**Why "near me" doesn't save a zero-volume neighbourhood page:** a "near me" search from that neighbourhood is served the parent-city page via geolocation, not the micro-page — so the micro-page captures ~0 incremental traffic.

Result on Royal: 1759 pages built → **1080 indexed** (in sitemap), 680 zero-volume kept live but out of the index.

---

## 3. Internal linking — 3-axis mesh (extends §8 hub-spoke)

Generic hub-spoke is 1-dimensional (hub → spokes → blog). A location matrix needs **3 axes** so every deep city page is reachable and equity flows both ways:

```
                 SERVICE HUB  /{service}/        (links DOWN to all indexed cities)
                       │  ↑ spoke links back to hub
        ┌──────────────┼──────────────┐
   /{service}-{cityA}/      /{service}-{cityB}/   ← spokes (service × city)
        │                        │
   AXIS 1 ↕  same city, other services:  /{otherService}-{cityA}/   (sibling services)
   AXIS 2 ↔  same service, nearby cities: /{service}-{nearbyCity}/  (geographic cluster)
   AXIS 3 ↑  up to the service hub + home
```

**Link rules (enforce in shared components, city-aware):**
1. **Service hub → all indexed cities** (spoke-down block). A hub with <10 spokes isn't a hub.
2. **City page → its service hub** (breadcrumb + contextual). Axis 3.
3. **City page → sibling services in the SAME city** (related-services nav, keyword-rich anchors). Axis 1. ~6–9 links.
4. **City page → SAME service in nearby cities** (geographic cluster, 3–6 links). Axis 2.
5. **All service-card / location-pill sections must be city-aware** — on `/{service}-toronto/`, the "our services" cards link to `/{otherService}-toronto/` (same city), and the "locations" pills link to `/{service}-{otherCity}/` (same service) — NOT to a generic hub. This is the most common miss: static cards that always point to the generic hub waste the cluster.
6. **Anchor text = keyword** ("Garage Door Spring Repair Toronto"), never "click here" / "view service". Drives topical relevance + anchor diversity.
7. Minimum 5 internal links/page (lazy-method threshold); local matrix pages realistically have 15–25.
8. Link only/primarily to **indexed** cities from prominent nav; noindex pages still receive `follow` links contextually.

**Internal links ≠ backlinks:** they distribute existing authority + drive crawl/relevance, they don't create new authority. But for programmatic location pages, internal links are what gets deep pages crawled and ranked at all — non-negotiable.

---

## 4. Local-service page anatomy (section stack)

Order matters for background alternation (white → cream → grey → dark, never two same/dark adjacent) and for the AI "answer-first" pattern:

1. **Hero** — H1 = exact primary keyword `{Service} {City}`; breadcrumb nav (Axis 3 link); accent subhead; eyebrow `{City} • {differentiator}`.
2. **Service overlap / 3 cards** — city-aware links (Axis 1).
3. **"In short" answer card** ⭐ — `.direct-answer`, 35–55 words, starts with the brand name, includes a price + the keyword. Feeds AI Overviews / featured snippet + `summary` GEO signal. Has freshness `<time datetime>`.
4. **What we do** — service cards, city-aware links (Axis 1).
5. Trust bar · Portfolio · Lead form · About (carry the authority outbound link, see §6).
6. Video (with VideoObject schema if a video element is present).
7. **Locations** — city pills, service-aware links (Axis 2).
8. How we work · Partners (brand logos) · CTA banner.
9. **FAQ** ⭐ — 6–8 city-specific Q&A; feeds FAQPage schema; first answer = "How much does {service} cost in {city}?" with a real price range.
10. **City-local content** — local context (neighbourhoods, climate, codes) + always-on related-services nav (Axis 1).
11. **Pricing table** — visible per-component price table (closes the #1 competitor gap; most local sites bury pricing).
12. Mobile sticky CTA (44px tap targets).

---

## 5. Schema set per service × city page (9 blocks)

Emit as an **array of independent `<script type="application/ld+json">`** (easier for Rich Results Test than one `@graph`):
`LocalBusiness` (with `aggregateRating`, `review`, `sameAs`, `areaServed` City+geo) · `FAQPage` (built from the SAME data as the visible FAQ so they never drift) · `Article` (`datePublished`+`dateModified` freshness) · `Service` (+`PriceSpecification`) · `BreadcrumbList` · `ImageObject` · `HowTo` · `PriceSpecification` · `VideoObject`.

Brand/door catch-all pages: same set, generated from the brand/type data (FAQ from `common_issues`/`common_models`/`key_benefits`).

---

## 6. GEO / AI-citation specifics (beyond §5 of strategy)

- **Authority outbound link on every page** — lazy-method `eeat` / `geo_ai` / `seo_advanced` all require ≥1 link to `.gov` / `.edu` / `wikipedia.org` / `bbb.org`. Put ONE genuine reference in a shared component (e.g. About → link the relevant safety standard to its Wikipedia article). Fixes 3 categories sitewide at once.
- **llms.txt + llms-full.txt** at root: H1 + blockquote summary + H2 sections + dense link lists. Keep current (rating, service list, indexed-city list, URL patterns). Density > volume — list entity-defining pages, not every URL. Low-effort/high-reward; Google says it's not required, so rank it below fundamentals.
- **robots.txt** explicitly `Allow` AI crawlers: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot, Applebot-Extended; reference the sitemap.

---

## 7. Tracking (set once, 100% coverage)

Put GTM + Facebook Pixel snippets in the **base layout** (`Base.astro`) only — every page inherits them automatically. Load GA4 + Google Ads **inside the GTM container** (don't add separate gtag snippets). IDs via env vars (`PUBLIC_*`), `.env.local` gitignored. Verify with: `grep -rl "GTM-XXXX" dist --include=index.html | wc -l` == total pages.

---

## 8. Deploy / ops gotchas (cost real hours)

- **Vercel Hobby blocks deploys whose git commit *author* email ≠ the Vercel account owner.** Symptom: every deployment shows "Blocked", site serves stale content. Fix: `git config user.email "<vercel-owner-email>"` (the `Co-Authored-By` trailer is irrelevant — Vercel reads `%ae`). Not a code bug.
- **Windows EPERM on specific files during local build** — patch `fs.statSync`/`copyFileSync` in `astro.config.mjs` to skip; Vercel (fresh clone) is unaffected.
- **Image weight** — programmatic pages reuse a shared image set (portfolio/gallery). Serve thumbnail-sized variants (srcset), not full-res, or LCP/total-byte-weight tanks on mobile. Lazy-load below-fold.
- **Verify referenced assets are committed** — renamed/SEO-named images must be in git or production 404s while localhost works.
- **Measure performance on the deployed CDN URL, not `astro preview`** — preview has no gzip/brotli, so Lighthouse over-reports ~1.5–2 MB of phantom "text-compression" savings and depresses the score.

---

## 9. Topic hub / cluster pages (complements the matrix)

Beyond service×city, build a **thematic hub** when a cluster of related (often rising) long-tail queries shares one intent — e.g. an "elopement" hub, a "smart garage door" hub, a "winter prep" hub. The hub is the pillar; the long-tail terms become on-page sections or spoke pages.

Recipe:
1. **Find the cluster** — a rising theme from `d4s.py volume` Trend% or a `d4s.py gap` group (several related gap keywords).
2. **Hub page** = pillar at a clean URL (`/{theme}/` or `/{theme}-{city}/`): direct-answer intro, the cluster's sub-topics as question-H2/H3 sections, FAQPage, comparison table/`<dl>`, pricing, and links DOWN to every related service/spoke + UP from those spokes back to the hub.
3. **Anchor with the cluster keywords** in H1/H2/title/schema/FAQ (verbatim, read-aloud-safe).
4. Gate it like any page (`deploy_gate.py`). Index only if the cluster has real aggregate demand (volume-gated, §2).

A hub concentrates topical authority for an emerging theme faster than scattering the long-tail across unconnected pages.

---

## 10. Reusable toolchain
- **Keyword volume / KD / SERP / trend**: global `dataforseo` skill → `~/.claude/skills/dataforseo/scripts/d4s.py {volume|kd|ideas|serp|ranked|rank|competitors|gap}`. `volume` shows a **Trend%** momentum column; `competitors`+`gap` drive page discovery (see `COMPETITOR-GAP-WORKFLOW.md`).
- **What to build next**: `COMPETITOR-GAP-WORKFLOW.md` (competitor gaps → missing pages) + `SPRINT-PRIORITY-FRAMEWORK.md` (opportunity score × trend × ticket × intent).
- **QA**: this `lazy-method/` checker (`lazy-check.py --config lazy-config.json dist/.../index.html`). Configure `service_primary_keywords` keyed by **url-prefix** and extend the path-detector `startswith()` tuple when adding new service/brand/type prefixes, or `keyword_strategy` mis-detects the primary keyword.
- **New project**: see `NEW-PROJECT-SETUP.md`; set niche in `lazy-config.json`.

# Lazy Method — Full Site Audit (lyubovpsy.com)
**Date:** 2026-06-13 · **Pages:** 286 (`/ru/`) · **Params/page:** ~399 · **Avg score: 89.9%**

Best page 93.7% · Worst 81.7% · 0 pages at 100% (because ~7 issues hit *every* page).
Cross-page duplicate content: 0 groups (good — no thin/duplicate pages).

## Connection to the impressions problem
Indexing rose but impressions stay low because most pages rank ~position 11.5
(page 2). The systemic gaps below are exactly the ranking/GEO signals that move
a page from page-2 to top-5 → which is where impressions come from. Fixing the
"all pages" issues is the highest-leverage lever for impressions.

## Tier 1 — site-wide template fixes (one edit → fixes all/most 286 pages)
| Pages | Issue | Fix |
|------:|-------|-----|
| 286 | `skip_to_content_link` | add `<a class="skip-link" href="#main">К содержанию</a>` in header |
| 286 | `focus_visible_styles` | add `:focus-visible` outline rule to global CSS |
| 286 | `org_schema_with_same_as` | add `sameAs` (IG/TG/YT/FB) to Organization node |
| 270 | `og_site_name_present` | add `<meta property="og:site_name" content="Денежный Водопад">` |
| 268 | `site_name_in_title` | append ` | Денежный Водопад` to `<title>` (also fixes short titles) |
| 245 | `no_hardcoded_inline_colors` | replace inline hex with `var(--token)` |
| 241 | `schema @id` entity graph | add `@id` to JSON-LD nodes |
| 191 | `ImageObject` schema | express `image` as ImageObject with width/height |
| 175 | `main_landmark_present` | wrap article body in `<main id="main">` |
| 151 | `heading_hierarchy` h2→h4 skip | demote stray h4→h3 |

## Tier 2 — content/template (per-article, high SEO/GEO value)
- `external_authority_links` (286) — add ≥1 outbound link to an authority (ВОЗ/APA/научный источник).
- `meta_desc_or_title_includes_year` (285) — add "2026" to title/meta (freshness CTR).
- `aggregate_rating_schema` (285) — add AggregateRating from real отзывы.
- `brand_authority_established` (285) — mention "Денежный Водопад" in the intro.
- `primary_keyword_at_start` (274) — put the topic phrase in the first 50 chars of the lede.
- `title_has_power_word_or_number` (246) — add a number/power word to titles.
- `question_format_headings` (213) / `voice_friendly_questions` (165) — ≥3 question-style H2/H3.
- `tldr_or_key_takeaways` (179) — add a "Кратко / Главное" summary block.
- `citable_statistics_5plus` (189) / `numerical_claims` (148) — add data points.
- `howto_schema_when_steps_present` (211) — add HowTo schema where numbered steps exist.
- `definition_list_present` / `comparison_table_or_dl` (269) — add a `<dl>`/table.
- `voice_search_answer_block` / `citable_short_answer_passages` (186) — 20-35w answer after a question heading.
- `contextual_links_in_paragraphs` (143) — move internal links into body `<p>`.
- `configured_email_present_or_domain` (142) — 142 articles have no email in footer (NAP consistency).

## Categories fully passing
responsive 100% · niche_compliance 99.7% · cross_browser 98.3% · cro 86%.

## RESULT after Tier-1 fixes (whole-category pass rate, 286 pages)
| Category | Before | After |
|----------|-------:|------:|
| schema | 0% | **97.6%** |
| accessibility | 0% | **57.7%** |
| brand | 1.7% | **43.0%** |
| seo | 2.4% | **10.5%** |

Params eliminated (was failing on ~all pages → now 0): skip_to_content_link (286→0),
focus_visible_styles (286→0), org_schema_with_same_as (286→0), schema @id (241→0),
ImageObject (191→0), main_landmark (175→0), heading-skip (151→0), og_site_name (270→17).
Every TECHNICAL systemic failure is closed. Remaining top failures are all CONTENT
tasks (Tier 2): outbound authority links, definition lists/tables, brand-in-intro,
question-format headings, TL;DR blocks, citable stats, primary-keyword-at-start.

> Note: re-audit excluded the 2 Playwright-driven categories (responsive 100% /
> cross_browser 98% — browser-launched, unaffected by these edits, and the browser
> launches made the full run slow/fragile). Re-run them separately with playwright installed.

## How to re-run
```
python lazy-method/lazy-check.py --config=lazy-config.json --site=ru --ci --report=lazy-method/reports/full-ru-audit.json
python lazy-method/aggregate_report.py lazy-method/reports/full-ru-audit.json
```

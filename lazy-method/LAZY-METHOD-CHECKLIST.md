# Lazy Method — Page QA Checklist (423 parameters / 20 categories)

**Replaces:** old BMad 277 checklist + Boomy SEO-PAGE-CHECKLIST.md
**Date:** 2026-06-11 (canonical edition — PARENT copy lives in Boomy Marketing /lazy-method/)
**Updated for:** 2026-2027 SEO + AI search (E-E-A-T, GEO, AEO, Schema 2026)

> **Writing a BLOG POST?** This checklist is for pages/services (local-service niche). Blog posts use the **`publisher`** niche + the dedicated module in **`blog-method/`** (`BLOG-PARAMETERS-2026-2027.md` — 128 params, AEO/GEO + competitor analysis + E-E-A-T; `BLOG-WORKFLOW.md`; `BLOG-BRIEF-TEMPLATE.md`). Use that, not this, for articles.

> **Deploy gate (replaces the old "every parameter must pass" iron rule):**
> 1. **CRITICAL categories are 100% — always** (schema, data_consistency, accessibility, responsive, cross_browser, brand, niche_compliance). No waivers possible.
> 2. Every other **applicable** parameter must pass, unless it has an **explicit waiver with a written reason** in `lazy-config.json -> gate.waivers`. Waivers are printed in every run — nothing is skipped silently; a waiver without a reason fails the gate.
> 3. Page total (excluding waived) must be >= `gate.min_total_pct` (default 97%).
>
> Applicability is niche-aware: local-only params do not apply to SaaS, etc. — `niche-profiles/` control this. A param that does not apply is N/A by design, not a silent skip.
> Enforce with: `python lazy-method/deploy_gate.py --config lazy-config.json <pages|--site dist/>` — exit 0 = deploy, 1 = blocked. See `DEPLOY-GATE.md`.

> **Speed Performance is intentionally excluded** — it's handled separately so optimization passes don't risk breaking pages.

> **Subjective photo quality** is excluded — only HTML-level image checks (alt, src, lazy loading).

## How to run

```bash
# First time on a new site:
python lazy-method/lazy-check.py --init --config=mysite/lazy-config.json

# Single page:
python lazy-method/lazy-check.py --config=mysite/lazy-config.json mysite/page.html

# Whole site:
python lazy-method/lazy-check.py --config=mysite/lazy-config.json --site=mysite/

# Specific categories:
python lazy-method/lazy-check.py --config=... --categories=seo,schema,eeat page.html
```

Trigger from Claude: "проверь по lazy method", "lazy check", "audit this page".

---

## 1. SEO Optimization (30 params)

### Content (9)
- [ ] Word count within configured range
- [ ] Exactly one `<h1>`
- [ ] Heading count `h2` within range, `h3` ≥ minimum
- [ ] Heading hierarchy logical (no skipped levels)
- [ ] Internal links ≥ minimum
- [ ] External links ≤ maximum
- [ ] Images ≥ minimum
- [ ] All images have `alt` attribute
- [ ] FAQ section detected

### Technical (7)
- [ ] `<title>` present
- [ ] Title length within range
- [ ] Meta description present
- [ ] Meta description length within range
- [ ] Viewport meta tag with `device-width`
- [ ] Canonical link present, uses `https://`
- [ ] Robots meta does not contain `noindex`

### AI Optimization (5)
- [ ] FAQ section present
- [ ] Question-format `<h3>` headings (count ≥ FAQ minimum)
- [ ] Lists present for snippet capture
- [ ] Structured content (lists or tables)
- [ ] Voice-friendly Q&A headings

### Local SEO (5) — applies if `business.is_local`
- [ ] Configured phone present in page text
- [ ] `tel:` link present
- [ ] Address city mentioned in text
- [ ] LocalBusiness or related schema present
- [ ] Map / directions link present

### User Experience (4)
- [ ] CTA elements ≥ 3
- [ ] Contact / lead form present
- [ ] Navigation `<nav>` present
- [ ] Top-level nav links ≤ 7

---

## 2. Responsive Design (80 params) — Playwright

8 checks × 10 devices (iPhone SE / 12 Pro / Galaxy S21 / 14 Pro Max / iPad Mini / Air / Pro / laptop / desktop HD / 4K):

- [ ] No horizontal overflow
- [ ] `scrollWidth ≤ innerWidth`
- [ ] Body width fits viewport
- [ ] No horizontal scrollbar
- [ ] Tap targets ≥ 44×44 px (mobile only)
- [ ] Body font ≥ 14 px (mobile) / 13 px (desktop)
- [ ] Images fit viewport
- [ ] Forms render usable

---

## 3. Cross-Browser (28 params) — Playwright

7 checks × 4 browsers (Chrome / Firefox / Safari / Edge):

- [ ] Page loads
- [ ] No console errors
- [ ] Layout renders
- [ ] JavaScript runs
- [ ] CSS applied
- [ ] Media queries work
- [ ] Forms render

---

## 4. Visual Design (20 params)

### Layout & Spacing (5)
- [ ] Semantic `<section>` / `<article>` blocks ≥ 4
- [ ] External CSS file linked
- [ ] `max-width` / `.container` constraint exists
- [ ] Flex or grid layout used
- [ ] Few inline `style="width:"` declarations

### Typography (5)
- [ ] Web font referenced (or brand font configured)
- [ ] Configured font present in HTML/CSS
- [ ] Heading size styling declared
- [ ] `line-height` declared
- [ ] Text color rules declared

### Colors & Contrast (4)
- [ ] Primary brand color present in HTML/CSS
- [ ] Secondary brand color present in HTML/CSS
- [ ] `:hover` / `:focus` states declared
- [ ] Body background styled

### Images & Media (3)
- [ ] All `<img>` have `alt`
- [ ] Responsive images (`srcset` / `<picture>` / `loading=lazy`)
- [ ] Lazy loading used

### Interactive (3)
- [ ] CTAs styled with `btn`/`button`/`cta` class
- [ ] Link styling declared
- [ ] Form/input styling declared

### Design System (2) ⭐ NEW
- [ ] CSS custom properties (`var(--*)`) used ≥ 10 references — confirms token-based system
- [ ] Inline `style=""` attributes with hardcoded hex colors ≤ 2 — no bypassing design tokens

---

## 5. Accessibility (15 params)

### Keyboard (4)
- [ ] `<html lang="">` attribute set
- [ ] Skip-to-content link present
- [ ] No critical interactive elements with `tabindex="-1"`
- [ ] `<main>` or `role="main"` landmark present

### Screen Reader (4)
- [ ] All `<img>` have `alt` attribute
- [ ] All form inputs labeled
- [ ] All buttons have accessible names
- [ ] All links have accessible names

### Color & Contrast (3)
- [ ] Color is not the only state indicator
- [ ] `:focus` / `:focus-visible` styles declared
- [ ] `aria-live` region for dynamic form feedback (if applicable)

### Content (4)
- [ ] Heading levels in logical order
- [ ] `<title>` is descriptive (≥ 10 chars)
- [ ] No autoplay video/audio without controls
- [ ] No redundant ARIA roles

---

## 6. Content Quality (15 params)

### Uniqueness & Value (5)
- [ ] Body text not empty
- [ ] Content hash recorded for cross-page deduplication
- [ ] Duplicate sentences within page ≤ threshold
- [ ] Current year (2026 / 2027) referenced (freshness)
- [ ] Lexical diversity ≥ 200 unique meaningful words

### Readability (5)
- [ ] Average sentence length 10–25 words
- [ ] No (or few) sentences > 35 words
- [ ] No paragraphs > max sentence count
- [ ] Lists ≥ 3 for scannability
- [ ] Flesch-Kincaid grade within configured range

### Structure (5)
- [ ] H2 section count within range
- [ ] Hero / intro section detected
- [ ] Services / offerings section detected
- [ ] FAQ section detected
- [ ] Contact section detected
- [ ] Social proof section detected (reviews / testimonials / case studies / clients)

---

## 7. CRO (20 params)

### Above the fold (5)
- [ ] H1 reads as a value proposition (≥ 4 words)
- [ ] Substantive intro section near top
- [ ] Primary CTA element present
- [ ] Phone visible in header (local) OR free trial / demo CTA (non-local)
- [ ] Trust signal phrasing present (rated, certified, guarantee, etc.)

### CTAs (5)
- [ ] CTA count ≥ 5
- [ ] CTA type diversity (≥ 2 of phone / form / booking / purchase / link / email)
- [ ] Action-oriented copy on at least half of CTAs
- [ ] No more than ~25% weak ("learn more", "click here") CTAs
- [ ] Sticky / fixed / floating CTA element

### Forms (5)
- [ ] Form present
- [ ] Form input count ≤ 6 (per form)
- [ ] Submit button present
- [ ] Privacy assurance language near form
- [ ] Form validation attributes (required / pattern / type=email)

### Friction (5)
- [ ] No modal opens on page load
- [ ] `tel:` click-to-call link (local)
- [ ] No login wall blocking content
- [ ] Top-level nav ≤ 7 links
- [ ] Secondary CTA below the fold

---

## 8. Psychology (20 params) — honest only

### Pain → Solve (3)
- [ ] Pain points identified
- [ ] Solutions offered
- [ ] Before / after or outcomes described

### AIDA (4)
- [ ] H1 is attention-grabbing (question / number / length)
- [ ] First paragraph substantive (≥ 25 words)
- [ ] Benefit-focused phrasing
- [ ] Multiple action CTAs

### Social Proof (4)
- [ ] Testimonials / reviews block present
- [ ] Configured rating visible (if rating > 0)
- [ ] Configured review count visible (if > 0)
- [ ] Client logos / featured-in section

### Urgency (3) — must be truthful
- [ ] Urgency / timeliness language present
- [ ] **No forbidden urgency phrases** ("only X spots left", "limited time", "act now", "don't miss out")
- [ ] **No countdown timers / "expires in"**

### Authority (6)
- [ ] Years in business visible (since YYYY / X+ years)
- [ ] Credentials referenced (certified / licensed / accredited)
- [ ] Guarantee or warranty language
- [ ] Named team / founder / leadership block
- [ ] Free guide / consultation / audit offered
- [ ] Specific numbers used (≥ 5 numeric figures)

---

## 9. Data Consistency (15 params) — 100% required

- [ ] Configured phone present on page
- [ ] Phone mentioned multiple times (local pages)
- [ ] No other phone-like sequences not matching configured number
- [ ] Configured email present (or domain email)
- [ ] No third-party emails inconsistent with site domain
- [ ] Founded year matches the years on the page
- [ ] Review count consistent with config
- [ ] Rating consistent with config
- [ ] City from address mentioned (local)
- [ ] Canonical URL uses configured domain
- [ ] OG URL uses configured domain
- [ ] No links to forbidden sibling-brand domains
- [ ] Site name appears on page
- [ ] Currency symbols match configured currency
- [ ] All numeric facts cross-check against config

---

## 10. Conversion Design (10 params)

- [ ] Single focal H1
- [ ] CTAs styled as buttons (≥ 3)
- [ ] Content sectioned with `<section>` / `<article>`
- [ ] Icons (SVG / icon imgs) used for scanning
- [ ] Primary brand color drives visual attention
- [ ] Viewport meta set
- [ ] Mobile tap-target sizing styled
- [ ] `tel:` link for mobile (local)
- [ ] Lazy loading on images
- [ ] Mobile menu pattern (hamburger / nav)

---

## 11. E-E-A-T Signals (15 params) ⭐ NEW 2026

### Experience (4)
- [ ] Author signal (meta name="author" or Person schema)
- [ ] Author bio or byline visible
- [ ] Years in business signaled in copy
- [ ] First-person voice used

### Expertise (4)
- [ ] Subject expertise terms (certified / licensed / expert / specialist)
- [ ] Case studies / portfolio referenced
- [ ] Process / methodology documented
- [ ] External authoritative outbound links (.gov, .edu, Wikipedia, Forbes, etc.)

### Authoritativeness (4)
- [ ] Organization or LocalBusiness schema (or subtype) present
- [ ] Social profile links / `sameAs` in schema
- [ ] Awards / press mentions / featured-in
- [ ] Team / founder / leadership visible

### Trustworthiness (3)
- [ ] HTTPS-only resources (no `http://` references)
- [ ] Privacy / terms / cookie link
- [ ] Trust badges / guarantee language

---

## 12. GEO / AI Citations (15 params) ⭐ NEW 2026

- [ ] `llms.txt` at site root
- [ ] `robots.txt` does not block AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [ ] Brand mentioned in first 100 words
- [ ] TL;DR / summary / key takeaways block
- [ ] Question-format H2/H3 headings ≥ 3
- [ ] FAQ section present
- [ ] Citable short-answer passages (20–80 words after question headings) ≥ 2
- [ ] Author meta or byline
- [ ] JSON-LD uses `@id` for entities
- [ ] Structured facts (lists ≥ 3 or `<dl>`)
- [ ] Numerical claims ≥ 3
- [ ] Outbound authority links
- [ ] Publish / updated / last-reviewed date visible
- [ ] `og:image` present
- [ ] `twitter:card` meta present

---

## 13. Schema.org 2026 (10 params) ⭐ NEW

- [ ] JSON-LD present
- [ ] All blocks valid (`@type` set)
- [ ] All required schemas from config present (subtypes count, e.g. MarketingAgency satisfies Organization)
- [ ] BreadcrumbList present
- [ ] FAQPage present (recommended)
- [ ] `@context` is schema.org
- [ ] `aggregateRating` if reviews configured
- [ ] Review objects if reviews configured
- [ ] Organization / LocalBusiness with `sameAs`
- [ ] Organization name matches configured site name
- [ ] All JSON-LD blocks parse cleanly

---

## 14. Brand Consistency (10 params) ⭐ NEW

- [ ] Site name appears in page text
- [ ] Site name in `<title>`
- [ ] Primary brand color used (HTML or linked CSS)
- [ ] Secondary brand color used (HTML or linked CSS)
- [ ] Configured font family referenced
- [ ] Logo present (`<img alt="site name">` or `.logo` / `.brand` element)
- [ ] `<html lang="">` matches configured language
- [ ] Canonical domain matches configured domain
- [ ] `og:site_name` matches configured site name
- [ ] No links to forbidden sibling-brand domains

---

## 15. Internal Linking (10 params) ⭐ NEW

- [ ] Internal links ≥ minimum
- [ ] External links ≤ maximum
- [ ] No weak anchors ("click here", "read more", "here", "learn more")
- [ ] Anchor text diversity ≥ 50% unique
- [ ] Contextual links inside `<p>` tags
- [ ] Links to pillar / top-level pages ≥ 2
- [ ] Breadcrumb navigation present
- [ ] Footer legal links ≥ 2 (privacy, terms, cookie)
- [ ] Related / "next step" / "see also" section
- [ ] No broken template placeholders in `href` (`{{...}}`, `${...}`, `undefined`)

---

## 16. SEO Advanced (30 params) ⭐ 2026

- Intent alignment (5): search_intent_detectable · h1_signals_intent · ctas_aligned_with_intent · structure_matches_intent · title_contains_intent_signal
- Topical authority (5): subtopic_breadth · external_entity_links (authority outbound) · related_internal_links · definitions_or_glossary · topical_hierarchy_three_levels
- Snippet capture (5): featured_snippet_block (35-60w answer after question heading) · voice_search_answer_block (20-35w) · howto_numbered_list · comparison_table_for_commercial_intent · definition_list_present
- Schema extras (5): howto_schema_when_steps_present · video_schema_when_video_present · schema_has_date_modified_or_published · image_schema_present · schema_sameAs_for_entity_graph
- Technical extras (5): hreflang_includes_x_default · canonical_matches_og_url · pagination_rel_next_prev · title_has_power_word_or_number · meta_desc_has_action_verb
- Polish (5): title_no_all_caps_clickbait · meta_desc_or_title_includes_year · all_images_have_width_height · images_use_modern_format · alt_text_descriptive

---

## 17. Keyword Strategy (20 params) ⭐ 2026

- Primary keyword: primary_keyword_in_title · primary_keyword_in_meta · primary_keyword_in_h1 · primary_keyword_at_start · keyword_density_optimal (0.5-2.5%; read-aloud test overrides — waiver allowed with reason)
- Secondary: secondary_keywords_present (≥50%) · secondary_keywords_in_h3s
- Intent & trust: intent_signal_speed (same-day / 24/7 / emergency) · trust_signals_present · pricing_transparency (price in meta) · geographic_terms_coverage
- Snippets & AI: question_format_headings · featured_snippet_block · brand_in_first_100_words · ai_crawlers_allowed (robots.txt) · schema_includes_keywords
- Meta: title_length_optimal (50-65) · meta_description_length_optimal (150-160) · h1_title_intent_aligned · publication_date_present

> Page→keyword mapping is **config-driven**: keys of `keywords.service_primary_keywords` ARE the url-prefixes (e.g. `"garage-door-spring-repair": "garage door spring repair {city}"`). The checker resolves the page's primary keyword from its path by longest-prefix match (handles multi-segment city slugs like `north-york`). Add every new service/brand/type url-prefix to this map, or the page is graded against the default primary keyword.

---

## 18. Content Strategy (21 params) ⭐ 2026

word_count_minimum · word_count_not_excessive · secondary_keywords_integrated (75%) · nlp_entity_coverage · eeat_signals_present · author_expertise_signal · featured_snippet_ready (35-60w blocks) · ai_citation_ready (40-100w intro incl. price) · freshness_signal_present (visible `<time>`) · pricing_in_body_text · content_uniqueness_high · competitor_question_coverage · local_specificity · topical_depth_sufficient · structured_data_present · brand_authority_established · faq_section_present · social_proof_visible · blog_table_of_contents · cta_above_fold · helpful_content_structure

---

## 19. AEO / GEO 2026-2027 (24 params) ⭐ NEW

- Rich-result schema (10): howto_schema_present · faqpage_schema_present · speakable_schema_present · article_or_webpage_schema · imageobject_schema_present · person_author_schema · entity_sameas_present · schema_at_id_graph · organization_schema · aggregate_rating_schema
- Passage citability (9): direct_answer_after_h1 · citable_passages_3plus · entity_definition_sentence · tldr_or_key_takeaways · lists_for_extraction · comparison_table_or_dl · citable_statistics_5plus · question_headings_3plus · conversational_long_tail
- Freshness & entity (5): datemodified_within_12mo · visible_updated_date · brand_entity_mentions_3plus · images_with_descriptive_alt · semantic_anchor_text

---

## 20. Niche Compliance (8 params for local-service; varies by profile) ⭐

required_cta_phone · required_cta_contact_form · required_trust_warranty · required_trust_reviews · required_trust_licensed · required_trust_certified · forbidden_fake_countdown · forbidden_fake_inventory

> This is the **applicability layer**: the param set comes from `niche-profiles/{niche}.json` (8 niches shipped). Params that don't apply to a niche are N/A by design — they are never silently skipped, the profile explicitly defines what applies.

---

## What this replaces / adds vs. BMad 277

| Removed from BMad | Why |
|---|---|
| Speed Performance (9 params) | Handled separately to avoid breaking pages with optimization |
| Subjective photo checks (~10) | Cannot be automated reliably; only HTML-level image checks kept |

| New in Lazy Method | Why |
|---|---|
| **E-E-A-T (15)** | Google December 2025 update extended E-E-A-T signals to all competitive queries |
| **GEO / AI Citations (15)** | ChatGPT, Perplexity, AI Overviews now drive ≥ 20% of traffic for many sites |
| **Schema.org 2026 (10)** | Subtype-aware (MarketingAgency satisfies Organization), `@id`-based entity graph |
| **Brand Consistency (10)** | Universal — driven by config, no per-site hardcoding |
| **Internal Linking (10)** | Pillar-cluster strategy + anchor text quality became key in 2026 |

| Adapted | Note |
|---|---|
| Niche-aware via `niche-profiles/{niche}.json` | 7 niches: marketing-agency, saas, ecommerce, restaurant, local-service, professional-service, publisher |
| Universal config (no hardcoded site values) | All brand / phone / rating / colors / domains read from `{site}/lazy-config.json` |
| Interactive setup (`--init`) | Asks user for every required field; never silently uses defaults |

---

## Related files

- Tooling: `/lazy-method/` (PARENT/master: Boomy Marketing /lazy-method/ — duplicate into new projects)
- Per-site config: `{project-root}/lazy-config.json`
- Niche templates: `/lazy-method/niche-profiles/`
- Deploy gate: `/lazy-method/deploy_gate.py` + `DEPLOY-GATE.md`
- Strategy: `STRATEGY-2026-2027.md` - Local-service matrix: `LOCAL-SERVICE-MATRIX.md`
- Performance: `PERFORMANCE-CHECKLIST.md` - Off-page: `OFFPAGE-LOCAL-CHECKLIST.md` - KPI: `MEASUREMENT-KPI.md`

---

## 2026-2027 Specific Additions

Per the December 2025 Google update + the rise of AI Overviews, ChatGPT search, and Perplexity, every page now ALSO needs:

- [ ] **Direct answer block** in first 100 words (LLM extraction target)
- [ ] **Standalone paragraphs** — each readable without context
- [ ] **Question-phrased H2/H3** matching People Also Ask patterns
- [ ] **FAQPage schema** with 3-6 questions
- [ ] **Speakable schema** targeting direct-answer + FAQ blocks
- [ ] **Author bio** with credentials (E-E-A-T extended to all queries)
- [ ] **Last-updated date** visible + `dateModified` in schema
- [ ] **Multi-tier keyword strategy** (Primary 1 + Secondary 3-5 + Supporting 8-15 + Persona modifiers 2-4)
- [ ] **Persona explicit** — at least 2 of: stressed user, planner, cost-checker, decision-maker
- [ ] **Outbound citations** to authoritative sources (industry assoc, standards body, gov)

See `STRATEGY-2026-2027.md` for full context.

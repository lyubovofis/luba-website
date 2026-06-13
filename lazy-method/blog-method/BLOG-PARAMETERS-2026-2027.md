# Blog Post Parameters — 2026-2027 (AI-first SEO)

> The checklist to write and audit a blog post that ranks in Google **and** gets cited by AI (Google AI Overviews, ChatGPT, Perplexity, Gemini, Copilot). Use this BEFORE writing (as a brief) and AFTER writing (as a QA gate). Pairs with the `publisher` niche profile in `../niche-profiles/publisher.json`.
>
> **128 parameters across 11 categories.** A post is "ship-ready" when every **[CRITICAL]** passes and overall ≥ 90%.
>
> Sister docs: `BLOG-WORKFLOW.md` (the repeatable process) · `BLOG-BRIEF-TEMPLATE.md` (fill before writing).

---

## How blog ranking changed for 2026-2027 (why this list exists)

1. **AI answers eat clicks.** Google AI Overviews + ChatGPT/Perplexity answer the query directly. To survive you must be the *source they cite* — quotable, data-rich, well-structured, authoritative. That's AEO/GEO (cat. 3).
2. **E-E-A-T is the moat.** With AI mass-producing generic text, Google rewards *first-hand experience*, named experts, and trust signals. Generic AI fluff is filtered (Helpful Content). (cat. 4)
3. **Topical authority > single posts.** You rank by covering a topic cluster comprehensively and interlinking it, not one isolated post. (cat. 1 + 6)
4. **SERP-driven, not guesswork.** Every post is reverse-engineered from the current top 10 + AI answer for the query. (cat. 2)

---

## 1. Search Intent & Keyword Strategy (16)

- [ ] **1.1 [CRITICAL]** Primary keyword chosen with real demand — volume + KD validated via DataForSEO (`d4s.py volume`/`kd`).
- [ ] **1.2 [CRITICAL]** Search intent identified and matched: informational / commercial-investigation / transactional. The format matches intent (guide vs comparison vs cost page vs how-to).
- [ ] 1.3 Primary keyword momentum checked (`d4s.py volume` Trend%) — prefer rising/stable over declining.
- [ ] **1.4 [CRITICAL]** Primary keyword in: title, H1, URL slug, first 100 words, meta description.
- [ ] 1.5 Keyword density natural (0.5-2.0%) — no stuffing.
- [ ] 1.6 5-10 secondary / LSI / semantic keywords mapped and woven in (entities Google associates with the topic).
- [ ] 1.7 "People Also Ask" questions collected (SERP) and answered in the post (each = an H2/H3).
- [ ] 1.8 Long-tail variations covered (modifiers: cost, best, vs, how to, near me, 2026).
- [ ] 1.9 **No cannibalization** — no existing post targets the same primary keyword (one keyword → one canonical post).
- [ ] 1.10 Post is assigned to a **topic cluster** with a clear pillar page it links up to.
- [ ] 1.11 Target featured-snippet format identified (paragraph / list / table) and built for it.
- [ ] 1.12 URL is short, lowercase, hyphenated, keyword-bearing, **no dates** (so it stays evergreen).
- [ ] 1.13 Seasonality considered (publish/refresh ahead of demand spikes).
- [ ] 1.14 Commercial value / funnel stage noted (TOFU/MOFU/BOFU) so CTAs match.
- [ ] 1.15 Branded vs non-branded intent clear.
- [ ] 1.16 Local angle added where relevant ("...in {city}") without making it a thin local doorway.

## 2. Competitor / SERP Analysis (12)

- [ ] **2.1 [CRITICAL]** Top 10 ranking pages pulled for the query (`d4s.py serp`) and analyzed.
- [ ] 2.2 Competitor content depth measured: median word count, # of H2s, subtopics — your post meets or beats it.
- [ ] **2.3 [CRITICAL]** Content-gap done: subtopics/questions the top 10 cover that you must include (`d4s.py gap` + manual SERP read).
- [ ] 2.4 "10x" angle defined — what makes yours the best result (original data, photos, calculator, deeper how-to, fresher pricing).
- [ ] 2.5 SERP features inventoried (featured snippet, PAA, image pack, video, AI Overview) and targeted.
- [ ] 2.6 Who AI cites for this query checked (ask ChatGPT/Perplexity the query) → match/exceed those sources.
- [ ] 2.7 Competitor schema types noted and matched or exceeded.
- [ ] 2.8 Competitor backlink profile of the #1-3 pages reviewed (link-earning bar).
- [ ] 2.9 Competitor freshness checked (their dateModified) — out-fresh stale top results.
- [ ] 2.10 Unique value the brand has that competitors lack (first-hand jobs, real prices, photos) surfaced.
- [ ] 2.11 Weak/outdated top results identified as the easiest to displace.
- [ ] 2.12 Differentiation is real (not a spun rewrite) — would pass a "did the author actually know this?" read.

## 3. AI / AEO / GEO — Answer & Generative Engine Optimization (20) ⭐ 2026-2027

- [ ] **3.1 [CRITICAL]** **TL;DR / Key Takeaways** block near the top (3-6 bullets) — the chunk AI extracts.
- [ ] **3.2 [CRITICAL]** **Direct answer** to the title question in the first paragraph, 40-60 words, self-contained.
- [ ] 3.3 Question-format H2/H3 headings (match how people/AI phrase queries).
- [ ] 3.4 **≥5 citable statistics** with numbers (%, $, years, counts) — LLMs prefer data-rich pages.
- [ ] 3.5 Each stat has an attributable source/year (citation or "according to…").
- [ ] 3.6 Explicit **entity definitions**: "X is a …" sentences for the core terms.
- [ ] 3.7 **Self-contained passages** — each section answers its heading without needing the rest (AI quotes chunks).
- [ ] 3.8 **Comparison table** or structured data where applicable (AI loves tables for extraction).
- [ ] 3.9 **FAQPage schema** + visible FAQ section (3-6 Q&As in natural-language question form).
- [ ] 3.10 **Speakable schema** on the answer + key sections (voice / assistant).
- [ ] 3.11 Author expertise visible to AI (Person schema + byline) — AI weighs source authority.
- [ ] 3.12 Fresh `dateModified` (recency boosts AI citation likelihood).
- [ ] 3.13 Site is in **llms.txt** / AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are allowed in robots.txt.
- [ ] 3.14 Concise, factual tone in answer blocks (no marketing fluff in the quotable parts).
- [ ] 3.15 "How to / steps" rendered as a numbered list + **HowTo schema** (for procedural posts).
- [ ] 3.16 Key numbers/answers also in plain text (not only inside images) so they're machine-readable.
- [ ] 3.17 Units, ranges, and currencies explicit ("$280 CAD", "1-2 hours") for unambiguous extraction.
- [ ] 3.18 Definitions/answers placed high (above the fold of the article body), not buried.
- [ ] 3.19 Brand name appears in the first 100 words of body (so AI attributes the answer to you).
- [ ] 3.20 Content reads well **aloud** (read-aloud test) — AI summaries favor clean prose.

## 4. E-E-A-T — Experience, Expertise, Authority, Trust (16)

- [ ] **4.1 [CRITICAL]** Named human author (not "admin") with byline.
- [ ] **4.2 [CRITICAL]** Author **bio** with real credentials + photo + `Person` schema with `sameAs` (LinkedIn / professional profile).
- [ ] 4.3 Author's relevant expertise stated (e.g., "IDEA-Certified technician, 12 yrs").
- [ ] 4.4 "Reviewed by / Fact-checked by" line where the writer ≠ the expert.
- [ ] 4.5 **First-hand Experience** signals: original photos, "in our jobs we see…", real measurements/outcomes, case examples.
- [ ] 4.6 Outbound **citations** to authoritative sources (standards bodies, manufacturers, .gov/.edu) — dofollow.
- [ ] 4.7 `datePublished` AND `dateModified` visible + in schema.
- [ ] 4.8 Claims are accurate and current (prices, specs, stats verified against source of truth).
- [ ] 4.9 No unsupported superlatives; balanced, honest framing (builds trust + avoids AI distrust).
- [ ] 4.10 Organization/publisher identity clear (logo, about, contact reachable from the post).
- [ ] 4.11 Original media (own photos/diagrams) over stock — strong Experience signal.
- [ ] 4.12 Content matches site's topical focus (don't publish off-topic posts that dilute authority).
- [ ] 4.13 Author has multiple posts in the cluster (entity consistency across the site).
- [ ] 4.14 No AI-generated "hallucinated" facts — everything verifiable.
- [ ] 4.15 Transparency: methodology / "how we know this" where claims are strong.
- [ ] 4.16 YMYL care if cost/safety topic — extra rigor on accuracy & sourcing.

## 5. Content Structure & Quality (18)

- [ ] **5.1 [CRITICAL]** Word count appropriate to intent and **≥ median of top 10** (typically 1,200-2,500 for guides; don't pad).
- [ ] 5.2 **Table of contents** with jump links for posts > ~1,200 words.
- [ ] 5.3 Logical H2→H3 hierarchy; one H1 only.
- [ ] 5.4 Short paragraphs (2-4 sentences); scannable.
- [ ] 5.5 Bullet / numbered lists for steps and enumerations.
- [ ] 5.6 Key phrases **bolded** for skimmers (sparingly).
- [ ] 5.7 Reading level appropriate (Flesch-Kincaid ~grade 6-10 for general; up to ~11 for technical).
- [ ] 5.8 **Original images / diagrams** with descriptive alt + captions; ≥1 every ~300-400 words.
- [ ] 5.9 Embedded video where it adds value (own or relevant).
- [ ] 5.10 No thin/filler sections; every section earns its place.
- [ ] 5.11 Intro hooks + sets expectation; no long throat-clearing before the answer.
- [ ] 5.12 Scannable summary/takeaway at the end + next step.
- [ ] 5.13 Data current & correct (prices match the canonical source of truth, no stale years).
- [ ] 5.14 Examples / scenarios concrete and specific (not generic).
- [ ] 5.15 Consistent terminology (same entity names throughout).
- [ ] 5.16 Tables for comparisons / pricing / specs.
- [ ] 5.17 No duplicate content with other posts (each is unique).
- [ ] 5.18 Grammar/spelling clean; brand voice consistent.

## 6. Internal Linking & Topical Authority (10)

- [ ] **6.1 [CRITICAL]** ≥ 8 internal links with descriptive (non-"click here") anchors.
- [ ] **6.2 [CRITICAL]** Links **down to money pages** (relevant service / location / product pages) — e.g. "spring repair cost" → the spring-repair service page.
- [ ] 6.3 Links to **related posts** in the same cluster (sideways).
- [ ] 6.4 Link **up to the cluster pillar** page.
- [ ] 6.5 The post is linked **from** other relevant posts/pages (not an orphan).
- [ ] 6.6 Anchor text varied and keyword-relevant (no over-optimized exact-match spam).
- [ ] 6.7 Breadcrumbs present (Home › Blog/Topic › Post) + `BreadcrumbList` schema.
- [ ] 6.8 First internal link appears early (within the intro/first section).
- [ ] 6.9 External links open with `rel` appropriate; outbound to authority only.
- [ ] 6.10 No broken internal/external links.

## 7. Schema / Structured Data (12)

- [ ] **7.1 [CRITICAL]** `BlogPosting` (or `Article`) with headline, description, datePublished, dateModified, author, publisher, image, mainEntityOfPage.
- [ ] **7.2 [CRITICAL]** `Person` (author) with name, jobTitle, knowsAbout, `sameAs`.
- [ ] 7.3 `Organization` (publisher) with logo + `sameAs`.
- [ ] 7.4 `BreadcrumbList`.
- [ ] 7.5 `FAQPage` (mirrors the visible FAQ).
- [ ] 7.6 `HowTo` for procedural posts (steps with text + optional image).
- [ ] 7.7 `Speakable`.
- [ ] 7.8 `ImageObject` for the primary image (url, width, height, caption).
- [ ] 7.9 `VideoObject` if a video is embedded.
- [ ] 7.10 Schema uses `@id` to connect the entity graph.
- [ ] 7.11 Schema validates (Rich Results Test) — zero errors.
- [ ] 7.12 Primary keyword present somewhere in the JSON-LD (headline/keywords).

## 8. On-Page Technical SEO (12)

- [ ] **8.1 [CRITICAL]** Title tag 50-60 chars: keyword + power word/number, compelling.
- [ ] **8.2 [CRITICAL]** Meta description 150-160 chars with the keyword + a reason to click (CTA/benefit).
- [ ] 8.3 Canonical URL set.
- [ ] 8.4 Indexable (no accidental noindex); in sitemap.
- [ ] 8.5 Images: WebP, lazy-loaded (except LCP), explicit width/height, descriptive alt.
- [ ] 8.6 Open Graph + Twitter card (title, description, image) for social/share previews.
- [ ] 8.7 Mobile responsive; tap targets ≥ 44px; no horizontal overflow.
- [ ] 8.8 **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] 8.9 Hreflang if multi-region (n/a for single-market).
- [ ] 8.10 Clean, crawlable HTML; key content not JS-gated.
- [ ] 8.11 HTTPS, no mixed content.
- [ ] 8.12 Published date + "updated" date rendered in the UI.

## 9. Engagement & Conversion (8)

- [ ] 9.1 In-content CTA(s) to the relevant service/product (not only a footer banner).
- [ ] 9.2 Click-to-call / lead form reachable from the post.
- [ ] 9.3 "Related posts" / "next read" module to extend the session.
- [ ] 9.4 Newsletter / lead-magnet opt-in where relevant.
- [ ] 9.5 Social share buttons.
- [ ] 9.6 Hook + media + flow tuned for dwell time (scroll depth).
- [ ] 9.7 No intrusive interstitials (Google penalizes; hurts UX).
- [ ] 9.8 CTA matches funnel stage (TOFU → soft / BOFU → quote/call).

## 10. Off-Page & Promotion (6)

- [ ] 10.1 Internal links added from existing relevant posts on publish (distribute equity).
- [ ] 10.2 Link-earning hook present (stat, data, tool, infographic worth citing).
- [ ] 10.3 Social distribution plan (post is shareable; OG image set).
- [ ] 10.4 Outreach/digital-PR list for link-worthy pieces.
- [ ] 10.5 Submitted/pinged for indexing (GSC) after publish.
- [ ] 10.6 Repurpose plan (video, social snippets, email) for reach.

## 11. Freshness, Measurement & Maintenance (6)

- [ ] 11.1 Refresh cadence set (review every 6-12 months; sooner for cost/price posts).
- [ ] 11.2 `dateModified` bumped on every meaningful update.
- [ ] 11.3 Tracked in GSC: impressions, clicks, avg position, CTR.
- [ ] 11.4 Content-decay watch (flag posts losing position → refresh).
- [ ] 11.5 AI-citation watch (does ChatGPT/Perplexity/AI Overview cite the page/brand?).
- [ ] 11.6 Conversions / assisted conversions attributed (GA4) to judge real value.

---

## Scoring

- **128 params.** Ship-ready = every **[CRITICAL]** (16) passes **and** total ≥ 90% (≥116/128).
- Categories that gate publishing (must be ~100%): **3 (AEO/GEO), 4 (E-E-A-T), 7 (Schema)** — these are what separate cited/ranked posts from invisible AI-fluff in 2026-2027.
- Run the post through `lazy-check.py` with the **`publisher`** niche (not local-service) for the automated subset; use this doc for the human/strategy params (competitor analysis, intent, originality) the checker can't judge.

## Quick workflow (see BLOG-WORKFLOW.md)
```
keyword (d4s volume/kd/trend) → SERP + competitor gap (d4s serp/gap, read top 10 + AI answer)
→ brief (BLOG-BRIEF-TEMPLATE.md) → write to this checklist → QA (this doc + lazy-check publisher)
→ publish + internal links + index → measure (GSC/GA4) → refresh
```

# Blog Workflow — keyword → competitor analysis → write → rank (2026-2027)

The repeatable loop for every blog post. Tooling: the global `dataforseo` skill (`d4s.py`). Parameter reference: `BLOG-PARAMETERS-2026-2027.md`. Per-post brief: `BLOG-BRIEF-TEMPLATE.md`.

```
1 KEYWORD     → 2 SERP+COMPETITOR → 3 BRIEF → 4 WRITE → 5 QA → 6 PUBLISH → 7 MEASURE/REFRESH
```

## 1. Keyword & intent
```bash
D=~/.claude/skills/dataforseo/scripts/d4s.py
python $D ideas "garage door spring repair" --location Canada --limit 80   # harvest topics
python $D volume "garage door spring repair cost" "broken garage door spring" --location Canada   # vol + Trend%
python $D kd "garage door spring repair cost" --location Canada             # difficulty
```
Pick a keyword with real demand + winnable KD + rising/stable trend. Decide intent (info / commercial / how-to). One keyword → one post (no cannibalization). Assign it to a cluster + pillar.

## 2. SERP + competitor analysis (the part most people skip)
```bash
python $D serp "garage door spring repair cost" --location "Toronto,Ontario,Canada" --depth 10
python $D gap royalgaragedoors.ca <top-competitor.com> --location Canada    # subtopics they rank for, you don't
```
Then **read the top 5 results + the AI answer** and record:
- median word count, # of H2s, the subtopics every top result covers (→ your required outline)
- SERP features (featured snippet format, PAA questions, tables, video, AI Overview)
- who AI cites (ask ChatGPT/Perplexity the query) → match/beat those sources
- the **gap**: what's missing/outdated in the top results = your 10x angle (original data, real prices, photos, calculator, deeper steps)

## 3. Brief
Fill `BLOG-BRIEF-TEMPLATE.md`: primary + secondary keywords, intent, target outline (from §2), required schema, internal-link targets (money pages + cluster), the 10x angle, the data/stats to include, author. Don't write before the brief is done.

## 4. Write — to the parameter checklist
Write to `BLOG-PARAMETERS-2026-2027.md`. Non-negotiables while drafting:
- TL;DR/Key-Takeaways at top + 40-60-word direct answer under H1 (AEO)
- ≥5 citable stats with sources; question-format H2s; entity definitions; comparison table
- real first-hand experience + named expert author; accurate, current data (verify prices vs source of truth)
- 8+ internal links incl. down to money pages; TOC; FAQ; images with alt
- full schema (BlogPosting + Person + Org + Breadcrumb + FAQPage + HowTo/Speakable as applicable)

## 5. QA gate
```bash
# automated subset — grade as the PUBLISHER niche (blog params), not local-service
python lazy-method/lazy-check.py --config <publisher-config> dist/<post>/index.html
```
- Every **[CRITICAL]** in the parameters doc passes; total ≥ 90%.
- Categories 3 (AEO/GEO), 4 (E-E-A-T), 7 (Schema) ~100%.
- Human-judge the params a checker can't (intent match, competitor gap covered, originality, read-aloud).

## 6. Publish & distribute
- Add internal links **from** existing relevant posts/pages → the new post (kill orphan status).
- Submit in GSC for indexing; confirm in sitemap; OG image set for social.
- Repurpose (social snippets, email, video).

## 7. Measure & refresh
- GSC: impressions / clicks / position / CTR. GA4: conversions/assisted.
- Watch for content decay → refresh + bump `dateModified`.
- Re-run §2 every 6-12 months (cost/price posts sooner) — out-fresh competitors.

## Cluster rule
Posts win as a **cluster**, not solo: a pillar page + supporting posts, all interlinked, all pointing readers toward the relevant money pages. Build clusters around your service lines (e.g. *springs*: cost, how-to-fix, broken-spring signs, torsion-vs-extension → all link to the spring-repair service pages).

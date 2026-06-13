# Measurement & KPI Loop — 2026-2027

> STRATEGY §1.4 names the KPI shift ("AI Share of Voice replaces rank #1"). This file is the operational loop: what to track, with what tool, how often, and what action each signal triggers. Without this loop the strategy is unfalsifiable.

## North-star KPIs (per project)

| KPI | Tool | Cadence | Target direction |
|---|---|---|---|
| **Leads** (calls + form submits) | GA4 events via GTM + call tracking | weekly | ↑ |
| **AI Share of Voice** — brand cited in AI answers for money queries | DataForSEO `ai_optimization_llm_response` / manual ChatGPT+Perplexity+AI Overview spot-checks | monthly | brand cited for top-20 queries |
| **Local pack positions** (top cities × main service) | DataForSEO SERP (`d4s.py serp "<kw>" --location "City,Region,Country"`) | monthly | top-3 |
| **Organic clicks / impressions** | Google Search Console | weekly glance, monthly review | ↑ |
| **Indexed pages** (real vs expected) | GSC Pages report vs sitemap count | monthly | indexed ≈ sitemap |
| **CWV field data** | PageSpeed Insights / CrUX | monthly | all green |
| **Review velocity** | GBP | monthly | 10-20/mo |

## The monthly loop (60-90 min per project)

1. **GSC**: top queries by impressions with position 4-15 → these are the **quick wins**; strengthen those pages (content + internal links) first. New queries you don't have a page for → add to keyword backlog.
2. **Indexation**: GSC "Pages" — `Crawled, not indexed` growing on programmatic pages = thin-content signal → improve or noindex (see LOCAL-SERVICE-MATRIX §2). Verify noindex tier isn't leaking into sitemap.
3. **AI SoV**: run the top-20 money queries through ChatGPT/Perplexity/AI Overviews (or DataForSEO ai_optimization). Log: cited? which URL? which competitor instead? Competitor cited → read their cited passage, match its format (table/list/direct answer) on our page.
4. **SERP positions**: `d4s.py serp` for hub + top-5 cities. Movement ↓ more than 3 spots → inspect what changed (SERP feature? competitor refresh?).
5. **Reviews + GBP**: velocity on target? respond-rate 100%?
6. **CWV field**: any metric leaving "good" → PERFORMANCE-CHECKLIST pass.
7. **Refresh queue**: pages with `dateModified` older than 6 months AND declining clicks → refresh sprint (update facts/prices, add 100+ words, new `dateModified`). STRATEGY refresh rule.

## Tracking file (per project): `{site}_PAGES.csv`

Extends the SPRINT framework file with live metrics:

```csv
page,priority,volume,kd,lazy_score,status,gsc_clicks_30d,gsc_pos,ai_cited,last_modified
"/garage-door-repair-toronto/",P1,720,22,423/423,published,140,4.2,chatgpt+aio,2026-05-30
```

`status` lifecycle: brief → draft → gate-passed → published → refresh-due.

## Attribution wiring (set up once)

- GTM container fires GA4 + Ads; conversions = `tel:` clicks + form submit + thank-you page view.
- Call tracking number ONLY if it preserves NAP (dynamic insertion for ads traffic; the sitewide visible number stays canonical — NAP consistency outranks attribution granularity for local).
- UTM discipline: GBP website links tagged `utm_source=gbp` to separate map traffic from organic.

## Honesty rules (same spirit as DEPLOY-GATE)

- Report metrics that didn't move. A flat month is data, not failure to report.
- Never optimize the dashboard (e.g., chasing impressions by ranking junk queries) — leads are the only KPI that pays.
- Annotate every deploy/major change date in GA4/GSC notes so cause-effect is readable months later.

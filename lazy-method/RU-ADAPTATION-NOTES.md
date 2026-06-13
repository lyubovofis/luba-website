# Lazy Method — Russian / lyubovpsy.com adaptation notes

This copy of `lazy-method/` was tuned for **lyubovpsy.com** — a Russian-language
psychology / money-mindset content site (niche `ru-psychology-publisher`).
The upstream checkers were English- and local-service-biased; on Russian content
they produced ~60% false failures (Flesch-Kincaid returned 0, English keyword
lists never matched, sales-page params fired on informational articles).

If you merge improvements back to the parent (`C:\Boomy Marketing\lazy-method`),
keep the English patterns and ADD the language branch — do not replace.

## Config / niche
- `lazy-config.json` — site config (ru, publisher, brand colors, contacts, keywords).
- `niche-profiles/ru-psychology-publisher.json` — custom niche. `na_params`
  excludes sales/landing/local params that don't apply to an informational
  article (lead form, demo CTA, pricing, urgency, founded-year consistency, …).

## Checker changes (all gated to keep English behavior intact)
- **base.py** — added `collect_schema_nodes()` / `schema_types_present()`:
  recursive JSON-LD walk so Person/Organization/ImageObject **nested inside
  Article** (author=, publisher=, image=) are detected. Fixes false "missing
  schema" in eeat, schema, seo_advanced, aeo.
- **lazy-check.py** — force UTF-8 stdout/stderr (Windows cp1252 crashed on Cyrillic).
- **content_checker / content_strategy** — Russian readability tolerances,
  Russian E-E-A-T + author + TOC + social-proof + freshness terms; author
  detection is config-driven (`keywords.author_signals`) + Person schema + об-авторе link.
- **seo_checker / seo_advanced / keyword_strategy** — Russian intent / power /
  action / question words; `[A-Za-z]{4,}` → `[A-Za-zА-Яа-яЁё]{4,}`; social /
  messaging links (wa.me, t.me, instagram…) excluded from the external-link cap;
  CTA detection matches Russian text **and** tel:/wa.me/t.me hrefs.
- **psychology / cro / eeat** — Russian pain / solution / benefit / urgency /
  credentials / guarantee / free-value lexicons; CTA detection via href.
- **geo_ai / aeo_geo_2026** — Russian FAQ / TL;DR / definition / date / stat
  patterns; nested Person/Org via JSON string search; question headings accept
  Cyrillic prefixes and trailing "?".
- **niche_compliance** — added whatsapp/telegram CTA signatures; Russian
  consultation_book / author_bio / credentials signatures.
- **data_consistency** — phone match now also reads tel:/wa.me hrefs (the number
  lives in the link, not visible text).

## Run
```bash
python lazy-method/lazy-check.py --config=lazy-config.json --site=ru --ci \
  --report=lazy-method/reports/full-ru-audit.json
python lazy-method/aggregate_report.py lazy-method/reports/full-ru-audit.json
```

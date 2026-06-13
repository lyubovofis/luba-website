# Deploy Gate — honest quality enforcement (the "/goal" of lazy-method)

> Purpose: a page **cannot deploy** until it truthfully passes the gate. No silent skips, no "85% is fine", no lying to ourselves. Replaces the old unrealistic "every parameter must pass" iron rule with an enforceable, honest contract.

## The contract

1. **CRITICAL categories = 100%, always. No waivers possible.**
   Default critical set: `schema`, `data_consistency`, `accessibility`, `responsive`, `cross_browser`, `brand`, `niche_compliance`.
   These are facts about the page (wrong phone, broken schema, inaccessible markup) — there is никогда a legitimate excuse.

2. **Every other applicable parameter must pass — unless explicitly waived with a reason.**
   A waiver lives in config, names the param, states WHY, and is dated. Waivers are printed in every gate run. A waiver without a reason **fails the gate** — honesty is enforced mechanically.

3. **Page total (excluding waived) ≥ `min_total_pct`** (default 97%).

4. **Applicability ≠ waiver.** Niche profiles (`niche-profiles/{niche}.json`) define which params apply to which business type (local-only checks don't apply to SaaS). That's N/A by design and is declared in the profile — different from a waiver, which is a per-project exception.

## Usage

```bash
# Gate specific pages (exit 0 = deploy, 1 = blocked)
python lazy-method/deploy_gate.py --config lazy-config.json dist/page-a/index.html dist/page-b/index.html

# Gate the whole built site
python lazy-method/deploy_gate.py --config lazy-config.json --site dist/
```

CI: wire into the pipeline so a blocked gate fails the build (see `ci-workflow-template.yml`).

## Config (`lazy-config.json → gate`)

```json
"gate": {
  "critical_categories": ["schema", "data_consistency", "accessibility",
                          "responsive", "cross_browser", "brand", "niche_compliance"],
  "min_total_pct": 97,
  "waivers": [
    {
      "param": "keyword_density_optimal",
      "reason": "Read-aloud rule wins (STRATEGY §3): natural copy on this page type sits at 0.3-0.4%; stuffing to 0.5% reads spammy.",
      "added": "2026-06-11"
    }
  ]
}
```

## When is a waiver legitimate?

Only when two lazy-method principles genuinely conflict and you choose the higher one. Examples:
- `keyword_density_optimal` vs the read-aloud test (STRATEGY rule: read-aloud always wins).
- `reading_level_in_range` vs technically precise safety copy (a torsion-spring warning legitimately reads above grade 10).
- `no_overly_long_sentences` on legal pages (privacy/terms).

NOT legitimate: "we're in a hurry", "it's close enough", "fix later". Those are fails — fix the page.

## Output you'll see

```
[BLOCK] dist\page\index.html  (414/423 = 97.9%, gate 97.0%)
  CRITICAL failures (no waiver possible):
    x schema.review_objects_present: no Review objects in JSON-LD
  Failures (fix or add explicit waiver with reason):
    x content.reading_level_in_range: Flesch-Kincaid grade 10.1 (target 6-10)
  Waived (excluded from gate, reasons on record):
    ~ keyword_strategy.keyword_density_optimal — waived: Read-aloud rule wins...
============================================================
DEPLOY GATE: BLOCKED — fix the failures above ...
```

Everything is on the table in every run: passes, failures, and waivers with reasons. That's the point.

# Lazy Method — New Project Setup

> **PARENT / master copy:** `C:\Boomy Marketing\lazy-method\` — always duplicate FROM there into a new project, and merge improvements BACK to the parent. Project copies are children.

Copy the parent `lazy-method/` folder into the root of any new project and follow these steps.

---

## Step 1 — Install Python dependencies

```bash
cd lazy-method
pip install -r requirements.txt
```

---

## Step 2 — Configure the site

```bash
python lazy-method/lazy-check.py --init --config=lazy-config.json
```

Answers needed:
- Site name, domain, language, country, currency
- Niche (pick from menu or create new `niche-profiles/{slug}.json`)
- Is it a local business? → phone, address, service area
- Founded year, review count, rating
- Primary + secondary brand color (hex)
- Font family

Config is saved to `lazy-config.json` in the project root.

> To add missing fields later (without re-doing everything):
> `python lazy-method/lazy-check.py --fill-missing --config=lazy-config.json`

---

## Step 3 — Create `DESIGN-SYSTEM.md`

Copy `lazy-method/DESIGN-SYSTEM-TEMPLATE.md` to the project root and fill in placeholders:

```bash
cp lazy-method/DESIGN-SYSTEM-TEMPLATE.md DESIGN-SYSTEM.md
```

Then edit `DESIGN-SYSTEM.md` and replace every `{PLACEHOLDER}` with real values from the project's CSS/design system. Claude will read this file before editing any page.

**Minimum to fill in:**
- Token list (colors, spacing, font sizes)
- Section component map (what component = what background)
- Button variants
- Card pattern

> If the project has no existing design system yet, fill in whatever CSS variables and classes you plan to use. They become the design system.

---

## Step 4 — Create `CLAUDE.md`

Copy `lazy-method/CLAUDE-TEMPLATE.md` to the project root:

```bash
cp lazy-method/CLAUDE-TEMPLATE.md CLAUDE.md
```

Edit the placeholders (project name, stack, build command, data files, etc.).

---

## Step 5 — Run your first audit

```bash
# Single page (built HTML):
python lazy-method/lazy-check.py --config=lazy-config.json dist/index.html

# Whole site:
python lazy-method/lazy-check.py --config=lazy-config.json --site=dist/

# Specific categories only:
python lazy-method/lazy-check.py --config=lazy-config.json --categories=seo,schema,eeat dist/index.html
```

---

## Step 6 — Gate before deploy

```bash
python lazy-method/deploy_gate.py --config lazy-config.json --site dist/
```
Exit 0 = deploy. Exit 1 = blocked: fix failures, or add an explicit reasoned waiver (`gate.waivers` in config). Critical categories can never be waived. See `DEPLOY-GATE.md`.

For service businesses with locations also follow `LOCAL-SERVICE-MATRIX.md` (page matrix, volume-gated indexing, 3-axis interlinking).

---

## Step 7 — Fix failures

Read the report. Each failure shows:
- **Category** (SEO / Schema / E-E-A-T / etc.)
- **Parameter** (what exactly failed)
- **Hint** (what to fix)

Refer to `DESIGN-SYSTEM.md` before adding any new content or section.
Rules: integrate into existing components first, use design tokens, never inline styles.

---

## File map after setup

```
{project-root}/
  lazy-config.json          ← site config (Step 2)
  DESIGN-SYSTEM.md          ← design token reference (Step 3)
  CLAUDE.md                 ← Claude instructions (Step 4)
  lazy-method/
    lazy-check.py           ← main runner
    checkers/               ← 19 checker modules
    niche-profiles/         ← niche configs (local-service, saas, ecommerce, etc.)
    config-template.json    ← blank config template
    DESIGN-SYSTEM-TEMPLATE.md
    CLAUDE-TEMPLATE.md
    STRATEGY-2026-2027.md   ← SEO/AI strategy reference
    LAZY-METHOD-CHECKLIST.md ← full 423-param list
    reports/                ← auto-generated audit JSONs
```

---

## Adding a new niche

If the project niche isn't in `niche-profiles/`, create `niche-profiles/{slug}.json`:

```json
{
  "niche": "your-niche",
  "is_local": true,
  "schema_type": "LocalBusiness",
  "required_schemas": ["LocalBusiness", "FAQPage"],
  "thresholds_override": {
    "word_count": [600, 2000],
    "faq_count_min": 3
  }
}
```

Available niches: `local-service`, `saas`, `ecommerce`, `restaurant`, `marketing-agency`, `professional-service`, `publisher`, `generic`

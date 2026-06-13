# CLAUDE.md — {PROJECT_NAME}

## MANDATORY before editing any page or component

**Read `DESIGN-SYSTEM.md` in the project root.**
It contains the full token map, component backgrounds, button variants, section order, and rules for adding new content.

No inline `style=""` with hardcoded values.
No duplicate components — check if an existing one handles the signal first.

---

## Project

{ONE_LINE_DESCRIPTION} — {DOMAIN}

**Phone:** {PHONE}
**Domain:** {DOMAIN}

## Stack

- **{FRAMEWORK}** — {BUILD_DESCRIPTION}
- **CSS custom properties** — token system in `{TOKENS_FILE}`
- **{DEPLOY_PLATFORM}** — auto-deploy on push to main

## Structure

```
src/ (or equivalent)
  pages/           ← page templates
  components/      ← reusable sections
  data/            ← JSON data files
  styles/
    tokens.css     ← DESIGN TOKENS (read DESIGN-SYSTEM.md)
    base.css
    utilities.css  ← .container, .btn, .eyebrow, .section-title
    components.css ← section-level styles

DESIGN-SYSTEM.md   ← READ FIRST
lazy-method/       ← 397-param QA checker
lazy-config.json   ← site config for lazy-method
```

## Development

```bash
{DEV_COMMAND}    # local dev server
{BUILD_COMMAND}  # production build → {BUILD_OUTPUT}/
```

## Key data files

| File | Contents |
|------|----------|
| `{DATA_FILE_1}` | {DESCRIPTION} |
| `{DATA_FILE_2}` | {DESCRIPTION} |
| `{DATA_FILE_3}` | {DESCRIPTION} |

## Lazy-method QA

```bash
python lazy-method/lazy-check.py --config=lazy-config.json {BUILD_OUTPUT}/page.html
```

Strategy: `lazy-method/STRATEGY-2026-2027.md`

## Content rules

- **Don't duplicate components** — check existing ones first
- **Design tokens** — all colors/spacing via `var(--*)`, no hex/px directly
- **Background alternation** — white → cream → muted → dark; never two dark back-to-back
- **Integrate FAQ** into the FAQ component data file, not a new section
- **E-E-A-T signals** go into the existing About/Team component

# {PROJECT_NAME} — Design System Reference

> **For Claude:** Read this file BEFORE adding any section, component, or style to any page.
> No inline `style=""` with hardcoded values. No duplicate components.

---

## How to use this template

Replace every `{PLACEHOLDER}` with the real values from this project's CSS/codebase.
Delete placeholder comments once filled. Save as `DESIGN-SYSTEM.md` in the project root.

---

## 1. Design Tokens

Source file: `{PATH_TO_TOKENS_CSS}` (e.g. `src/styles/tokens.css` or `styles/variables.css`)

### Brand Colors
| Token | Value | When to use |
|-------|-------|-------------|
| `{--brand-primary}` | `{#hex}` | Primary CTA buttons, key accents |
| `{--brand-secondary}` | `{#hex}` | Secondary accents, hover states |
| `{--brand-gradient}` | `{gradient}` | Button backgrounds, highlighted text |

### Surface / Background Colors
| Token | Value | Section usage |
|-------|-------|---------------|
| `{--bg-white}` | `{#ffffff}` | Main content sections |
| `{--bg-light}` | `{#fafafa}` | Alternating sections |
| `{--bg-muted}` | `{#f5f5f5}` | Cards, callouts |
| `{--bg-dark}` | `{#111}` | Hero, CTA banner, footer |

### Text Colors
| Token | Value | When to use |
|-------|-------|-------------|
| `{--text-primary}` | `{#1a1a1a}` | Headings |
| `{--text-secondary}` | `{#4a4a4a}` | Body paragraphs |
| `{--text-muted}` | `{#6b6b6b}` | Labels, meta, captions |
| `{--text-on-dark}` | `{#ffffff}` | Text on dark backgrounds |

### Spacing Scale
| Token | rem | px |
|-------|-----|----|
| `{--space-1}` | 0.25rem | 4px |
| `{--space-2}` | 0.5rem | 8px |
| `{--space-4}` | 1rem | 16px |
| `{--space-6}` | 1.5rem | 24px |
| `{--space-8}` | 2rem | 32px |
| `{--space-12}` | 3rem | 48px |
| `{--section-y}` | clamp(…) | Section vertical padding |

### Font Scale
| Token | Size |
|-------|------|
| `{--fs-xs}` | ~0.75rem |
| `{--fs-sm}` | ~0.875rem |
| `{--fs-base}` | ~1rem |
| `{--fs-lg}` | ~1.25rem |
| `{--fs-xl}` | ~1.5rem |
| `{--fs-2xl}` | ~2rem |
| `{--fs-3xl}` | ~2.75rem — H2 sections |
| `{--fs-5xl}` | ~4rem — H1 |

### Font Weights
| Token | Value |
|-------|-------|
| `{--fw-regular}` | 400 |
| `{--fw-medium}` | 500 |
| `{--fw-semibold}` | 600 |
| `{--fw-bold}` | 700 |

### Border Radius
| Token | Value |
|-------|-------|
| `{--radius-sm}` | 4px |
| `{--radius-md}` | 8px |
| `{--radius-lg}` | 12px |
| `{--radius-xl}` | 16px |

### Shadows
| Token | Use |
|-------|-----|
| `{--shadow-sm}` | Cards |
| `{--shadow-md}` | Elevated elements |
| `{--shadow-lg}` | Modals, floating |
| `{--shadow-brand}` | Primary CTA buttons |

---

## 2. Utility Classes

Source: `{PATH_TO_UTILITIES_CSS}`

### Layout
| Class | Description |
|-------|-------------|
| `.container` | Max-width wrapper, centered, horizontal padding |
| `.container-narrow` | Narrower max-width (forms, articles) |

### Typography
| Class | Description |
|-------|-------------|
| `.eyebrow` | Small uppercase label above H2 |
| `.section-title` | H2 style — centered, large |
| `.section-sub` | Subtitle under H2 — centered, muted |
| `{.grad-text}` | Gradient text (brand colors) |

### Buttons
| Class | Appearance | Background use |
|-------|-----------|----------------|
| `.btn` | Base (min 44px height) | — |
| `{.btn-primary}` | Brand gradient, white text | Any |
| `{.btn-secondary}` | Solid secondary color | Light backgrounds |
| `{.btn-outline}` | Transparent + light border | **Dark backgrounds only** |
| `{.btn-outline-dark}` | Transparent + dark border | **Light backgrounds only** |
| `{.btn-lg}` | Large size modifier | — |

> ⚠️ Fill in your actual button class names above.

### Animation
| Class | Description |
|-------|-------------|
| `.fade-up` | Scroll-triggered reveal (opacity + translateY) |

---

## 3. Page Components Map

### Conversion flow (section order on key pages)

```
1. {COMPONENT_NAME}    — {DARK/LIGHT} — {PURPOSE}
2. {COMPONENT_NAME}    — {LIGHT}      — {PURPOSE}
3. {COMPONENT_NAME}    — {CREAM}      — {PURPOSE}
4. {COMPONENT_NAME}    — {DARK}       — Lead form / main CTA
5. {COMPONENT_NAME}    — {LIGHT}      — {PURPOSE}
...
```

Background alternation rule: **never two dark sections back-to-back. Never three identical light backgrounds in a row.**

### Component details

#### `{ComponentName}` — CSS class `.{class-name}` — **{DARK/LIGHT} ({bg-token})**
- Root section: `.{section-class}`
- Key sub-classes: `.{card-class}`, `.{title-class}`, `.{cta-class}`
- Buttons: `.btn.{variant}` (dark bg) or `.btn.{variant}` (light bg)

*(Repeat for each component)*

---

## 4. Where to put new SEO content

| Signal needed | Use existing component |
|---------------|------------------------|
| FAQ / Q&A | Add to FAQ data file → renders in FAQ component |
| Team / E-E-A-T | Add to About/Team component |
| How-we-work steps | Add to HowWeWork/Process component |
| Related links | Add `class="related"` to existing link block |
| Stats / social proof | Add to existing stats section |
| Services detail | Add to existing services component |

**Only create a new section if no component covers the signal.**

### New section checklist
- [ ] Background follows alternation rule
- [ ] Wrapped in `<section class="my-section">` + `<div class="container">`
- [ ] H2 uses `.eyebrow` + `.section-title` + `.section-sub` pattern
- [ ] All colors from tokens (no hex literals)
- [ ] All spacing from tokens (no px literals)
- [ ] Cards use `.{bg-light}` fill + `var(--radius-md)` + `var(--shadow-sm)`
- [ ] Brand accent as `border-top: 3px solid var(--brand-primary)` on cards
- [ ] Buttons: `.btn-outline` on dark, `.btn-outline-dark` on light

---

## 5. Card patterns

### Feature card (grid of services/benefits)
```css
.my-card {
  padding: var(--space-6);
  background: var(--bg-light);
  border-radius: var(--radius-lg);
  border-top: 3px solid var(--brand-primary);
  box-shadow: var(--shadow-sm);
}
.my-card h3 {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}
.my-card p {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}
```

### Callout / related box
```css
.callout {
  padding: var(--space-6);
  background: var(--bg-light);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--brand-primary);
}
```

### Dark section text
```css
/* Inside dark sections: */
h2 { color: var(--text-on-dark); }
p  { color: var(--text-on-dark-secondary, rgba(255,255,255,0.78)); }
```

---

## 6. Never do this

- `style="color: #ff0000"` → use `var(--brand-primary)`
- `style="padding: 20px"` → use `var(--space-5)`
- `style="background: #f9f9f9"` → use `var(--bg-light)` or `var(--bg-muted)`
- `style="border-radius: 8px"` → use `var(--radius-md)`
- `style="font-size: 0.9rem"` → use `var(--fs-sm)`
- New standalone section duplicating existing component
- `.btn-outline` on a light background

# Performance Checklist — Core Web Vitals 2026-2027

> This is the "handled separately" companion the main checklist refers to. Performance is excluded from the 423-param gate so optimization passes can't break content pages — but it is NOT optional. Run this after content QA passes, before/after deploy.

## Budgets (mobile, measured on the DEPLOYED CDN URL)

| Metric | Good | Budget (our gate) |
|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 2.5s |
| **INP** (Interaction to Next Paint — replaced FID in 2024) | ≤ 200ms | ≤ 200ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.05 |
| Total page weight (mobile) | — | ≤ 1.5 MB compressed |
| Hero/LCP image | — | ≤ 150 KB |
| Any single image | — | ≤ 250 KB |
| Lighthouse Performance (mobile, prod URL) | ≥ 90 | ≥ 80 hard floor |

## ⚠️ Measure correctly (lessons that cost real hours)

1. **NEVER score on `astro preview` / local dev servers** — no brotli/gzip → Lighthouse reports 1.5-2 MB phantom "text-compression savings" and the score drops 20-40 points below reality. Vercel/Netlify/Cloudflare compress automatically.
2. **Field data > lab data.** Check CrUX / PageSpeed Insights "real-user" tab for the live domain; lab Lighthouse is throttled 4× CPU + slow-4G.
3. CLS near 0 on static sites is expected — if it isn't, find the layout shifter (fonts, images without width/height, injected banners).

## Checklist

### Images (the #1 real cost on programmatic sites)
- [ ] Hero/LCP image preloaded (`<link rel="preload" as="image">`) and ≤ 150 KB
- [ ] All `<img>` have `width`+`height` (CLS) — also a lazy-method param
- [ ] Below-fold images `loading="lazy"`
- [ ] Served at DISPLAYED size: a 180px marquee thumbnail must not ship a 1200px file — use `srcset` or pre-resized thumbnail variants
- [ ] Modern formats (WebP/AVIF), quality ~80
- [ ] Shared image sets (portfolio/gallery marquees reused on every page) audited for total weight: N images × avg KB = per-page cost
- [ ] Interactive configurators/calculators with large asset sets (100+ images) lazy-load per selection, never preload the set

### Delivery
- [ ] Brotli/gzip on (host default — verify response headers)
- [ ] CSS minified; unused CSS < 25 KB
- [ ] JS: no render-blocking scripts; trackers (GTM, pixels) async; total unused JS < 200 KB
- [ ] Fonts: preconnect + `display=swap` (or self-host subsets); ≤ 2 families
- [ ] Static HTML (SSG) — no client-side rendering for content

### Verify
```bash
# Lab (against PROD url):
npx lighthouse https://example.com/page/ --form-factor=mobile --only-categories=performance
# Field:
https://pagespeed.web.dev/ → real-user CWV section
```

### Per-release rule
Run Lighthouse mobile on: homepage + 1 page per template type. If any budget is exceeded, fix before the next content sprint (perf debt compounds across programmatic pages — one heavy shared component multiplies by every page that includes it).

# Lazy Method — Google Ads Parameters Checklist (2026–2027)

> The complete list of parameters/factors to get right for a high-performing Google Ads
> account — verified against 2026–2027 best practices (June 2026). "Lazy method" = the
> minimal high-impact set is marked ⭐. Built for Nick's Appliance Repair (local service,
> GTA, lead-gen via calls + bookings). Account 9762059144.

---

## 0. What changed in 2026–2027 (read first)
- **Quality Score 10 = up to −50% CPC.** Biggest cost lever. QS 7+ fine for non-brand, 9–10 for brand terms.
- **Landing Page Experience is the #1 QS lever.** A dedicated LP per ad-group theme can move QS 4→7 in 2–3 weeks.
- **Search CPC +12% YoY** (steepest since 2021) — AI Overviews cut organic CTR, PMax competes for inventory → quality/relevance matter more than ever.
- **Smart Bidding = 78% of all spend.** Manual CPC is outcompeted on auction dynamics.
- **tCPA / tROAS now need ~60 conversions + a 3-week learning runway** before editing targets (was ~30). Under that → use Maximize Conversions.
- **PMax 2026**: now supports **negative keywords (campaign + account level)**, **channel-level reporting** (Search/Shopping/Display/YouTube/Discover/Gmail/Maps), stronger **brand controls/exclusions**, and **asset-strength flags** for blurry/AI/stretched images.
- **AI Max** (the DSA upgrade) is out of beta — keyword-less AI matching with more controls.
- **Privacy-first tracking** is mandatory: Enhanced Conversions, Consent Mode v2, modeled conversions, **Customer Match / first-party data**.

---

## 1. Conversion tracking ⭐ (FOUNDATION — if broken, everything else is wrong)
- [ ] Every conversion action categorized **Primary** (real lead/revenue) vs **Secondary** (micro).
- [ ] **Enhanced Conversions** enabled and passing hashed first-party data.
- [ ] **No duplicate counting** (Google Ads tag vs GA4 import vs Fixlify — pick one source of truth per action).
- [ ] **Offline conversions** imported for phone/in-person closes (calls scored → pushed back). *(Nick's: via Fixlify + Telnyx call scoring.)*
- [ ] **Conversion values** set so bidding optimizes profit (call $150 / booking $200 / form $100, or real invoice value). *(Nick's: owner sets via Fixlify.)*
- [ ] **Consent Mode v2** installed (privacy/EEA + modeled conversions).
- [ ] **Customer Match list** uploaded + refreshed (first-party blueprint for the algorithm).

## 2. Campaign settings ⭐
- [ ] **Networks**: Google Search only to start (uncheck Search Partners + Display).
- [ ] **Locations** = exact service area; **"Presence: in"** (NOT "presence or interest").
- [ ] **Languages**: English.
- [ ] **Ad schedule**: only hours you can answer (Nick's: Mon–Sat 8–20, Sun 9–18).
- [ ] **Budget**: set + monitor not capped / not overspending (Nick's: $50/day Search of $150/day total).
- [ ] **Bid strategy**: Maximize Conversions now → tCPA at real CPA once 60+ conv/mo + values set.
- [ ] **Device** bid awareness: 90% mobile → call-focused.
- [ ] **Campaign status**: Paused until reviewed; old campaign stays live until new proves out.

## 3. Ad group structure ⭐
- [ ] **Tight, single-theme ad groups** (1 intent = 1 ad group = 1 landing page). Nick's: by appliance type.
- [ ] Brands folded into appliance groups (not blind brand groups).
- [ ] **One landing page per ad-group theme** (NOT per keyword — per-keyword pages = thin, unmaintainable, dilute data).

## 4. Keywords ⭐
- [ ] Match types: **Exact** for specific/brand/city/symptom, **Phrase** for heads. (Broad only with Smart Bidding + tight negatives.)
- [ ] Keyword list built from **real search-volume data** (DataForSEO/Keyword Planner), not guesses.
- [ ] **Negative keywords**: shared list applied to every campaign; review search terms **weekly**.
  - Nick's negatives include services NOT offered: `gas, commercial, industrial, restaurant, emergency, 24 hour` + junk (`diy, parts, jobs, used, free, …`).
- [ ] No internal keyword cannibalization (same term in multiple groups).

## 5. Ads / RSAs ⭐
- [ ] **3 RSAs per ad group**, each **Ad Strength = Good/Excellent** (Excellent vs Poor ≈ +15% clicks/conv).
- [ ] **15 headlines + 4 descriptions**, each a DIFFERENT selling point (not reworded duplicates).
- [ ] **Keyword in headline** + dynamic `{KeyWord}` / `{LOCATION}` insertion (ad relevance).
- [ ] Pin sparingly (only brand/phone/compliance) — over-pinning hurts.
- [ ] Replace "Low"-rated assets as flagged.

## 6. Assets / extensions ⭐ (big CTR + QS lever)
- [ ] **Call asset** (tracked number).
- [ ] **Location asset** (linked Google Business Profile).
- [ ] **Sitelinks** 4+ (Book, Services, Reviews, FAQ).
- [ ] **Callouts** (offer, same-day, licensed/insured, warranty).
- [ ] **Structured snippets** (service types, brands).
- [ ] **Image assets** (real branded photos).
- [ ] Business **logo** + **business name** assets.

## 7. Quality Score (3 components — target 9–10) ⭐
- **Expected CTR** → compelling ads, all 15 headlines, extensions, strong offer.
- **Ad Relevance** → keyword in ad, tight ad groups, specific copy per theme.
- **Landing Page Experience** (highest impact) → see §8.
- New keywords start ~6–7 and climb to 9–10 over 1–3 weeks as CTR proves out; then prune low-QS/low-CTR keywords.

## 8. Landing page (conversion + QS) ⭐
- [ ] **Message match**: ad keyword = page H1 = page content (fridge repair → /lp/refrigerator-repair/, H1 "Refrigerator Repair").
- [ ] **Mobile-first**, fast (Core Web Vitals green, LCP < 2.5s, CLS < 0.1).
- [ ] **Click-to-call above the fold** + sticky mobile call bar (90% mobile).
- [ ] **Offer** visible ($89 waived, $40 off), trust (reviews, license, warranty), short form.
- [ ] `noindex` for PPC-only pages (don't compete with SEO pages).
- [ ] Transparent: phone, hours, business info, privacy.
- [ ] Single clear CTA, minimal nav distraction.

## 9. Audiences / targeting
- [ ] **Observation mode** audiences on Search (don't restrict): in-market "Home Appliances/Repair Services", website visitors, Customer Match — for bid data, not targeting.
- [ ] Geo + schedule + device adjustments based on data over time.

## 10. Performance Max (separate from Search) — 2026 controls
- [ ] **Brand exclusions** + brand negatives (stop inflated ROAS).
- [ ] **Negative keywords** (now supported campaign/account level).
- [ ] **Asset groups per service** with matched creative + **search themes** (5–15 specific).
- [ ] **Audience signals** (Customer Match, in-market, visitors).
- [ ] **Channel-level report** — watch budget isn't dumped into cheap Display/YouTube with no leads.
- [ ] Clean asset strength (no blurry/AI/stretched images — flagged in 2026).
- [ ] Geo: same service area, **"Presence: in"**.

## 11. Ongoing optimization (weekly/monthly)
- [ ] Search terms report → add negatives.
- [ ] Pause low-QS / low-conversion keywords; shift budget to winners.
- [ ] Check Ad Strength stays Good/Excellent; refresh weak assets.
- [ ] Geo/device/schedule bid review.
- [ ] Budget pacing + impression share (are we limited?).
- [ ] Conversion tracking still firing (verify monthly).
- [ ] Answer rate on calls (unanswered = wasted lead).
- [ ] Policy manager: no disapprovals.

## 12. Biggest external lever (do separately)
- [ ] **Google LSA / Google Guaranteed** — pay-per-lead, sits above ads, CPL $15–50 vs ~$67 search CPA. Needs business verification + insurance (owner sets up).

---

## ⭐ The "Lazy Method" — minimum set that drives 80% of results
1. **Conversion tracking clean** (primary/secondary, enhanced, no dupes, values).
2. **Tight ad groups → matched fast landing page** per theme.
3. **3 strong RSAs (Good/Excellent)** with keyword-in-headline.
4. **All extensions** (call, sitelinks, callouts, snippets, location, image).
5. **Negative keywords** (incl. services you don't offer) + weekly search-terms review.
6. **Presence-in geo + business-hours schedule.**
7. **Maximize Conversions** now → tCPA after 60 conv/mo.
8. **Add LSA** (separate, biggest CPL win).

> Sources (2026–2027): blog.google AI Max; PMax 2026 updates (benly.ai, jumpfly, pacewalk);
> Quality Score 2026 (lionelz.com); optimization checklists 2026 (ebsmedia, rebootiq, groas.ai);
> Google Ads benchmarks 2026 (digitalapplied). Compiled 2026-06.

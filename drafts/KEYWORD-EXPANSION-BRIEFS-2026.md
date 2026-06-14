# Keyword-expansion briefs — 11 missing diaspora country pages (2026-2027)

**Why:** site has 14 `psiholog-onlayn-{country}` pages but 11 high-value Russian-diaspora
countries are uncovered → net-new keyword coverage ("максимум слов"). Each = ~1500 words,
**unique country-specific content** (NOT a thin template swap — thin near-dupes trigger
index bloat + a thin-content penalty that *hurts* ranking).

**Proven structure to follow** (from `psiholog-onlayn-germaniya`, which ranks):
H1 → answer-box (Коротко о главном) → "Почему местная система психпомощи не всегда подходит"
→ "Почему эмиграция в {страну} даётся тяжело" → "Истории клиентов из {страны}" →
"Метод Денежный Водопад: 4 уровня" → "Об авторе" (real credentials) → FAQ (4-6 Q, as H3) →
CTA → related pages. + full Schema set, hreflang(35), canonical, authority citation, internal links.

| # | slug | target keyword | UNIQUE country angle (the differentiator — write 300-500w on this) |
|---|------|----------------|-------------------------------------------------------------------|
| 1 | psiholog-onlayn-franciya | психолог онлайн Франция / русскоязычный психолог во Франции | Language barrier with French CMP/psychiatres; long waitlists in public system; "intégration" pressure + identity loss; Paris vs province isolation |
| 2 | psiholog-onlayn-shveycariya | психолог онлайн Швейцария | Therapy cost (CHF 150-200/session) + insurance maze; high-achiever expat burnout; social reserve → loneliness despite wealth |
| 3 | psiholog-onlayn-portugaliya | психолог онлайн Португалия | D7/digital-nomad wave; "paradise but empty" post-move dip; slow bureaucracy (SEF/AIMA) anxiety; remote-work money instability |
| 4 | psiholog-onlayn-oae | психолог онлайн ОАЭ / Дубай | Mental-health stigma + legal sensitivity locally → online RU psychologist safer; transient expat churn; status/income pressure in Dubai |
| 5 | psiholog-onlayn-belgiya | психолог онлайн Бельгия | Tri-lingual system confusion; EU-bubble isolation; long mutuelle waitlists |
| 6 | psiholog-onlayn-singapur | психолог онлайн Сингапур | High cost + face-culture stigma; expat-package pressure; timezone (sessions early-morning EU) |
| 7 | psiholog-onlayn-novaya-zelandiya | психолог онлайн Новая Зеландия | Extreme distance/timezone from family; "edge of the world" isolation; visa/PR money stress |
| 8 | psiholog-onlayn-argentina | психолог онлайн Аргентина | Inflation/peso money trauma; large but scattered RU community; Spanish barrier in clinics |
| 9 | psiholog-onlayn-braziliya | психолог онлайн Бразилия | Portuguese barrier; safety-related anxiety; income volatility for remote workers |
| 10 | psiholog-onlayn-meksika | психолог онлайн Мексика | Nomad-hub (CDMX) churn; cartel-safety background stress; USD-income vs local-cost guilt |
| 11 | psiholog-onlayn-tailand | психолог онлайн Таиланд | "Eternal vacation" depression; visa-run instability; remote-income shame; far from family |

## Money-psychology subtopic gaps (informational, high long-tail volume)
- `kak-naznachat-cenu-na-uslugi` — "как назначать цену на свои услуги" (freelancers/experts — strong diaspora intent)
- `strah-prosit-deneg` — "страх просить деньги / повышать цены"
- `dengi-i-samoocenka` — "связь самооценки и дохода"
- `finansovaya-podushka-psihologiya` — "почему не могу накопить подушку безопасности"

## Execution rule
Each page must clear the lazy-method gate (`python lazy-method/lazy-check.py --config=lazy-config.json {page}`)
before deploy. Add to sitemap.xml + blog counter + interlink with its region cluster.
Author reviews country-specific factual claims (healthcare system, diaspora context) before publish —
this is YMYL-adjacent; unreviewed AI claims would damage E-E-A-T.

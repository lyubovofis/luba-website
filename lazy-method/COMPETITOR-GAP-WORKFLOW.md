# Competitor-Gap Page Discovery Workflow

> The single most effective way to decide WHAT pages to build next: find who outranks you, pull the keywords they rank for that you don't, and turn the gaps into pages. This is the core loop top SEO operators run in Claude Code (2026). Tooling: the global `dataforseo` skill (`d4s.py`) — no paid Semrush needed; the same idea works with the Semrush MCP if you have it.

## The loop

```
1. DISCOVER competitors   → d4s.py competitors <yoursite>      (or web-search "best {niche} {city}")
2. GAP each competitor    → d4s.py gap <yoursite> <competitor> (keywords they rank top-20, you don't)
3. ENRICH with demand     → d4s.py volume "<gap kw>" ...       (volume + Trend% momentum)
4. PRIORITIZE             → opportunity score x trend x intent (see SPRINT-PRIORITY-FRAMEWORK)
5. BUILD the page         → existing template/matrix; keyword in H1/H2/title/schema/FAQ
6. RE-CHECK & gate        → deploy_gate.py
```

## Step-by-step (commands)

```bash
D=~/.claude/skills/dataforseo/scripts/d4s.py

# 1. Who competes with you organically (real rivals, ranked by shared keywords + traffic)
python $D competitors royalgaragedoors.ca --location Canada --limit 15
#   Ignore non-competitors (youtube/reddit/homedepot/facebook) — keep true peers.

# 2. For each real competitor, the content gap (they rank top-20, you don't)
python $D gap royalgaragedoors.ca fixgaragedoors.ca --location Canada --limit 200
python $D gap royalgaragedoors.ca garaga.com --location Canada --limit 200
#   Output: keyword | volume | KD | their-rank  -> these are your missing-page candidates.

# 3. Confirm demand + momentum on the shortlist
python $D volume "yellow light on garage door sensor" "garage door insulation" --location Canada
#   Trend% surfaces rising terms (e.g. "garage door spring repair +202%").

# 4. Pick by adjusted opportunity score (SPRINT framework: volume x (100-KD) x trend x intent x ticket)
# 5. Build the page on the existing template/matrix.
# 6. python lazy-method/deploy_gate.py --config lazy-config.json dist/<new-page>/index.html
```

## Reading the gap output

- **High volume + low KD + they rank top-10** = strongest candidate (proven winnable demand).
- **Low volume but high commercial intent / high ticket** = still build it (one conversion on a $2k job pays for the page). Don't dismiss 20-50/mo keywords for high-ticket niches.
- **Rising Trend%** = prioritize even at modest volume — you ride the wave before competitors notice.
- **Informational gaps** (how-to, "why X", symptom queries like "yellow light on garage door sensor") → blog/guide cluster, link up to the matching service hub.
- **Commercial gaps** ("{service} {city}", "{brand} repair") → service/location matrix page (see LOCAL-SERVICE-MATRIX.md).

## Free bonus source — Google Ads Keyword Planner

Keyword Planner has demand + trend data the paid tools sometimes miss, and it's free. Two ways:

1. **google-ads MCP** (preferred, no browser): if connected, use its keyword-ideas / forecast tools to pull ideas + monthly trends for seed terms, then feed into step 3.
2. **Browser automation** (fallback): open `ads.google.com` Keyword Planner in a controlled Chrome tab, enter seed keywords, grab the keyword-ideas table (incl. YoY change), and analyze for low-competition / rising terms. Slower and uses more tokens — prefer the MCP or `d4s.py` first.

## Why this beats "start at the top of a keyword list"

You build pages with **proven competitor demand** instead of guesses, you catch **rising** terms early, and every page has a reason to exist (a real query a real rival already monetizes). It also keeps the programmatic matrix honest — you expand where there's demonstrated demand, which is exactly what the volume-gated indexing tier (LOCAL-SERVICE-MATRIX §2) enforces.

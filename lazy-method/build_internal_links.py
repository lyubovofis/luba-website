"""Internal-linking booster for lyubovpsy.com.

Adds a "Читайте также" related-articles block (links to topically-related
EXISTING articles) to any /ru/ article that lacks one. Pure internal links to
real slugs — no fabricated content, no dead-link risk. Directly improves
crawlability/indexation of the orphaned/not-indexed pages (the #1 lever for
keyword coverage).

    python lazy-method/build_internal_links.py            # apply
    python lazy-method/build_internal_links.py --dry-run  # report only
"""
from __future__ import annotations

import glob
import os
import re
import sys
from pathlib import Path

os.chdir(Path(__file__).resolve().parent.parent)
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except (AttributeError, ValueError):
        pass

STOP = set("и в на не что с по за к о а от до для как это эти этот вы ваш ваша ваши мы я он она при из под над без об про или же бы ли то так уже все весь его ее их там тут чем чём кто где когда почему зачем денежный водопад психолог любовь лукащук".split())


def tokens(text: str) -> set[str]:
    words = re.findall(r"[а-яёa-z0-9]{4,}", text.lower())
    return {w for w in words if w not in STOP}


def load():
    arts = {}
    for f in sorted(glob.glob("ru/*.html")):
        slug = os.path.basename(f)[:-5]
        t = open(f, encoding="utf-8").read()
        mt = re.search(r"<title>(.*?)</title>", t, re.S)
        title = re.sub(r"\s*\|\s*Денежный Водопад\s*$", "", (mt.group(1).strip() if mt else slug))
        mk = re.search(r'<meta name="keywords" content="([^"]*)"', t)
        kw = " ".join(k.strip() for k in (mk.group(1).split(",") if mk else []))
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
        h1t = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else title
        arts[slug] = {
            "file": f, "title": title.strip(), "h1": h1t.strip(),
            "tok": tokens(title + " " + kw + " " + h1t),
            "has_rel": "related-articles" in t,
        }
    return arts


def related(slug, arts, k=5):
    a = arts[slug]["tok"]
    scored = []
    for s2, d in arts.items():
        if s2 == slug:
            continue
        inter = len(a & d["tok"])
        if inter:
            scored.append((inter, len(d["tok"]), s2))
    scored.sort(reverse=True)
    return [s for _, _, s in scored[:k]]


def block(items):
    lis = "\n".join(
        f'        <li style="margin-bottom: 6px;"><a href="/ru/{s}" '
        f'style="color: #553c9a; text-decoration: none; font-size: 0.97rem;">{title}</a></li>'
        for s, title in items
    )
    return (
        '\n    <div class="related-articles" style="background: #f6f4fc; '
        'border-left: 4px solid #6b46c1; border-radius: 0 12px 12px 0; padding: 20px 24px; '
        'margin: 30px 0; font-family: inherit;">\n'
        '      <p style="font-weight: 700; color: #553c9a; margin-bottom: 10px; '
        'font-size: 1rem;">Читайте также:</p>\n'
        '      <ul style="list-style: none; padding: 0; margin: 0;">\n'
        f"{lis}\n      </ul>\n    </div>\n"
    )


def main():
    dry = "--dry-run" in sys.argv
    arts = load()
    total = len(arts)
    missing = [s for s, a in arts.items() if not a["has_rel"]]
    print(f"total={total}  with_block={total-len(missing)}  missing_block={len(missing)}")

    touched = 0
    inbound = {s: 0 for s in arts}
    # count inbound links the existing blocks already give (approx via missing only additions)
    for slug in missing:
        rel = related(slug, arts)
        if len(rel) < 3:
            continue
        items = [(s, arts[s]["title"][:70]) for s in rel]
        html = open(arts[slug]["file"], encoding="utf-8").read()
        b = block(items)
        # insert before </main> if present, else before <footer
        if "</main>" in html:
            new = html.replace("</main>", b + "</main>", 1)
        else:
            m = re.search(r"<footer", html)
            if not m:
                continue
            new = html[: m.start()] + b + html[m.start():]
        if not dry:
            open(arts[slug]["file"], "w", encoding="utf-8", newline="").write(new)
        touched += 1
        for s in rel:
            inbound[s] += 1

    print(f"{'DRY-RUN ' if dry else ''}blocks added: {touched}")
    newly_linked = sum(1 for s in inbound if inbound[s] > 0)
    print(f"articles receiving NEW inbound internal links: {newly_linked}")


if __name__ == "__main__":
    main()

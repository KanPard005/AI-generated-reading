#!/usr/bin/env python3
"""Validate article front matter and compare estimated vs. intended reading time.

Usage:  python3 scripts/check_articles.py [_articles/some-article.md ...]
No third-party dependencies.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
REQUIRED = ["title", "topic", "tags", "reading_time", "date"]
WPM = 200            # dense technical prose
PER_DISPLAY_EQ = 0.25  # minutes per display equation
PER_CODE_LINE = 0.04
PER_CHART = 0.75


def front_matter(text):
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not m:
        return None, text
    fm = {}
    for line in m.group(1).splitlines():
        km = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if km:
            fm[km.group(1)] = km.group(2).strip().strip('"').strip("'")
    return fm, text[m.end():]


def topics():
    path = ROOT / "_data" / "topics.yml"
    return set(re.findall(r"^([a-z0-9_-]+):\s*$", path.read_text(), re.M)) if path.exists() else set()


def estimate(body):
    code_lines = 0
    for block in re.findall(r"^```.*?\n(.*?)^```", body, re.S | re.M):
        code_lines += block.count("\n")
    body_nc = re.sub(r"^```.*?^```", " ", body, flags=re.S | re.M)
    charts = len(re.findall(r"application/vnd\.vegalite\+json", body_nc))
    body_nc = re.sub(r"<script.*?</script>", " ", body_nc, flags=re.S)
    display = len(re.findall(r"^\s*\$\$\s*$", body_nc, re.M)) // 2
    prose = re.sub(r"\$\$.*?\$\$", " x ", body_nc, flags=re.S)
    prose = re.sub(r"<[^>]+>", " ", prose)
    words = len(re.findall(r"[A-Za-z0-9’'-]+", prose))
    minutes = words / WPM + display * PER_DISPLAY_EQ + code_lines * PER_CODE_LINE + charts * PER_CHART
    return words, display, code_lines, charts, minutes


def main(paths):
    files = [pathlib.Path(p) for p in paths] or sorted((ROOT / "_articles").glob("*.md"))
    known = topics()
    problems = 0
    print(f"{'article':34} {'target':>6} {'est':>6} {'words':>6} {'eq':>4} {'code':>5} {'chart':>5}")
    for f in files:
        fm, body = front_matter(f.read_text(encoding="utf-8"))
        if fm is None:
            print(f"{f.name}: missing front matter"); problems += 1; continue
        missing = [k for k in REQUIRED if not fm.get(k)]
        if missing:
            print(f"  ! {f.name}: missing {', '.join(missing)}"); problems += 1
        if known and fm.get("topic") and fm["topic"] not in known:
            print(f"  ! {f.name}: unknown topic '{fm['topic']}' (add it to _data/topics.yml)"); problems += 1
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", f.stem):
            print(f"  ! {f.name}: file name should be a kebab-case slug"); problems += 1
        words, eq, code, charts, est = estimate(body)
        try:
            target = float(fm.get("reading_time", 0))
        except ValueError:
            target = 0
        flag = ""
        if target and abs(est - target) / target > 0.25:
            flag = "  <- off by >25%"
        print(f"{f.stem[:34]:34} {target:6.0f} {est:6.1f} {words:6d} {eq:4d} {code:5d} {charts:5d}{flag}")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

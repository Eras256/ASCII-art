#!/usr/bin/env python3
"""Collect every piece in art/ into site/art.json for the gallery.

Usage:
    python3 scripts/build_site.py
    python3 -m http.server 8000 -d site    # then open http://localhost:8000
"""

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "art"
OUT = ROOT / "site" / "art.json"

CATEGORY_ORDER = ["payments", "finance", "tech", "halloween"]
REPO = os.environ.get("GITHUB_REPOSITORY", "interledger/ASCII-art")


def parse(path: Path) -> dict:
    lines = path.read_text(encoding="utf-8").replace("\r\n", "\n").split("\n")
    sep = lines.index("---")

    fields = {}
    for line in lines[:sep]:
        key, _, value = line.partition(":")
        fields[key.strip().lower()] = value.strip()

    art = lines[sep + 1:]
    while art and not art[0].strip():
        art.pop(0)
    while art and not art[-1].strip():
        art.pop()

    category = path.parent.name
    return {
        "id": f"{category}/{path.stem}",
        "title": fields.get("title", path.stem),
        "artist": fields.get("artist", "").lstrip("@"),
        "category": category,
        "description": fields.get("description", ""),
        "path": path.relative_to(ROOT).as_posix(),
        "art": "\n".join(art),
    }


def main() -> None:
    pieces = [parse(p) for p in ART_DIR.glob("*/*.txt")]
    pieces.sort(key=lambda p: (
        CATEGORY_ORDER.index(p["category"]) if p["category"] in CATEGORY_ORDER else len(CATEGORY_ORDER),
        p["title"].lower(),
    ))

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps({"repo": REPO, "categories": CATEGORY_ORDER, "pieces": pieces}, indent=2) + "\n")
    print(f"Wrote {len(pieces)} pieces to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

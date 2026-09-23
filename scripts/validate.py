#!/usr/bin/env python3
"""Check that every file in art/ follows the submission rules in the README.

Usage:
    python3 scripts/validate.py            # check everything in art/
    python3 scripts/validate.py FILE ...   # check specific files
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "art"

CATEGORIES = {"payments", "finance", "tech", "halloween"}
MAX_WIDTH = 80
MAX_LINES = 40
REQUIRED_FIELDS = ("Title", "Artist", "Category")
OPTIONAL_FIELDS = ("Description",)

FILENAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*--[A-Za-z0-9](-?[A-Za-z0-9])*\.txt$")
PRINTABLE_ASCII = set(chr(c) for c in range(0x20, 0x7F))


def validate(path: Path) -> list[str]:
    errors = []
    rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path

    # Location and name
    category = path.parent.name
    if path.parent.parent != ART_DIR:
        errors.append(f"must live directly inside art/<category>/, not {rel.parent}")
    elif category not in CATEGORIES:
        errors.append(f"unknown category folder '{category}' (allowed: {', '.join(sorted(CATEGORIES))})")
    if not FILENAME_RE.match(path.name):
        errors.append("filename must look like 'piece-name--github-handle.txt' (lowercase piece name, dashes, .txt)")

    text = path.read_bytes().decode("utf-8", errors="replace")
    for n, line in enumerate(text.split("\n"), start=1):
        odd = sorted({c for c in line if ord(c) > 0x7E})
        if odd:
            errors.append(f"line {n} has non-ASCII characters {' '.join(odd)} (only plain ASCII is allowed)")
    text = "".join(c if ord(c) <= 0x7E else "?" for c in text)

    if "\r" in text:
        errors.append("uses Windows line endings (CRLF); please save with LF line endings")
        text = text.replace("\r\n", "\n")
    if not text.endswith("\n"):
        errors.append("must end with a newline")

    lines = text.split("\n")
    if lines and lines[-1] == "":
        lines = lines[:-1]

    # Header
    try:
        sep = lines.index("---")
    except ValueError:
        return errors + ["missing the '---' line that separates the header from the art"]

    fields = {}
    for n, line in enumerate(lines[:sep], start=1):
        key, colon, value = line.partition(":")
        if not colon:
            errors.append(f"header line {n} should be 'Key: value', got '{line}'")
            continue
        key, value = key.strip(), value.strip()
        if key not in REQUIRED_FIELDS + OPTIONAL_FIELDS:
            errors.append(f"unknown header field '{key}'")
        elif not value:
            errors.append(f"header field '{key}' is empty")
        fields[key] = value

    for key in REQUIRED_FIELDS:
        if key not in fields:
            errors.append(f"missing required header field '{key}'")

    if fields.get("Category") and fields["Category"] != category:
        errors.append(f"Category '{fields['Category']}' does not match folder '{category}'")

    artist = fields.get("Artist", "")
    if artist:
        if not artist.startswith("@"):
            errors.append("Artist should be your GitHub handle starting with '@'")
        handle_in_name = path.stem.partition("--")[2]
        if handle_in_name and artist.lstrip("@").lower() != handle_in_name.lower():
            errors.append(f"Artist '{artist}' does not match the handle in the filename ('{handle_in_name}')")

    # Art
    art = lines[sep + 1:]
    while art and not art[0].strip():
        art.pop(0)
    while art and not art[-1].strip():
        art.pop()

    if not art:
        errors.append("no art found below the '---' line")
    if len(art) > MAX_LINES:
        errors.append(f"art is {len(art)} lines tall (max {MAX_LINES})")

    for n, line in enumerate(lines, start=1):
        if "\t" in line:
            errors.append(f"line {n} contains a tab; use spaces instead")
        bad = set(line) - PRINTABLE_ASCII - {"\t"}
        if bad:
            errors.append(f"line {n} contains control characters: {sorted(repr(c) for c in bad)}")
        if line != line.rstrip(" "):
            errors.append(f"line {n} has trailing spaces")
        if len(line) > MAX_WIDTH:
            errors.append(f"line {n} is {len(line)} characters wide (max {MAX_WIDTH})")

    return errors


def main(argv: list[str]) -> int:
    paths = [Path(p).resolve() for p in argv] if argv else sorted(ART_DIR.rglob("*"))
    paths = [p for p in paths if p.is_file() and p.name != ".gitkeep"]

    failed = 0
    for path in paths:
        rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
        if path.suffix != ".txt":
            print(f"FAIL {rel}\n  - only .txt files are accepted in art/")
            failed += 1
            continue
        errors = validate(path)
        if errors:
            failed += 1
            print(f"FAIL {rel}")
            for e in errors:
                print(f"  - {e}")
        else:
            print(f"ok   {rel}")

    print(f"\n{len(paths) - failed} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

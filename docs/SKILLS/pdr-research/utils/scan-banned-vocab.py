#!/usr/bin/env python3
"""Banned-vocabulary scanner for pdr-research.

Scans the editorial fields of a research-output JSON for banned words
in either language. Used by the pdr-voice subagent self-scan and by
acceptance test §10.3.

Usage:
  python3 scan-banned-vocab.py <path-to-output.json>

Output (JSON to stdout):
  {
    "hits": [
      {"word": "luxury", "lang": "en", "field": "editorialThesis.en"},
      ...
    ],
    "clean": true|false
  }

Exit code: 0 if clean, 1 if hits found.
"""

import json
import re
import sys


BANNED_EN = [
    "luxury", "luxurious", "stunning", "exclusive", "world-class",
    "best-in-class", "incredible", "exceptional", "don't miss",
    "limited availability", "investment of a lifetime", "unparalleled",
    "prestigious", "iconic", "state-of-the-art",
]

BANNED_PT = [
    "luxuoso", "luxo", "deslumbrante", "exclusivo", "imperdível",
    "oportunidade única", "o melhor", "referência", "incomparável",
    "prestigiado", "icónico", "de eleição",
]

# Editorial fields to scan: (dot-path, language)
def collect_editorial_strings(data: dict) -> list[tuple[str, str, str]]:
    """Return list of (field_dot_path, lang, text) tuples."""
    results = []

    def _add(path: str, lang: str, text):
        if isinstance(text, str) and text:
            results.append((path, lang, text))
        elif isinstance(text, list):
            for i, item in enumerate(text):
                _add(f"{path}[{i}]", lang, item)

    # editorialThesis
    et = data.get("editorialThesis") or {}
    _add("editorialThesis.en", "en", et.get("en"))
    _add("editorialThesis.pt", "pt", et.get("pt"))

    # whyStandsOut
    ws = data.get("whyStandsOut") or {}
    _add("whyStandsOut.en", "en", ws.get("en"))
    _add("whyStandsOut.pt", "pt", ws.get("pt"))

    # areaGuide
    ag = data.get("areaGuide") or {}
    _add("areaGuide.en", "en", ag.get("en"))
    _add("areaGuide.pt", "pt", ag.get("pt"))

    # typologyNote
    tn = data.get("typologyNote") or {}
    _add("typologyNote.en", "en", tn.get("en"))
    _add("typologyNote.pt", "pt", tn.get("pt"))

    # designSignals.designAssessment (now en+pt)
    ds = data.get("designSignals") or {}
    da = ds.get("designAssessment") or {}
    if isinstance(da, dict):
        _add("designSignals.designAssessment.en", "en", da.get("en"))
        _add("designSignals.designAssessment.pt", "pt", da.get("pt"))
    elif isinstance(da, str):
        _add("designSignals.designAssessment", "en", da)

    # newEntities.developer bio
    ne = data.get("newEntities") or {}
    dev = ne.get("developer") or {}
    bio = dev.get("bio") or {}
    if isinstance(bio, dict):
        _add("newEntities.developer.bio.en", "en", bio.get("en"))
        _add("newEntities.developer.bio.pt", "pt", bio.get("pt"))

    # newEntities.developer shortDescription
    sd = dev.get("shortDescription") or {}
    if isinstance(sd, dict):
        _add("newEntities.developer.shortDescription.en", "en", sd.get("en"))
        _add("newEntities.developer.shortDescription.pt", "pt", sd.get("pt"))

    # newEntities.location intro + marketFraming
    loc = ne.get("location") or {}
    intro = loc.get("intro") or {}
    if isinstance(intro, dict):
        _add("newEntities.location.intro.en", "en", intro.get("en"))
        _add("newEntities.location.intro.pt", "pt", intro.get("pt"))
    mf = loc.get("marketFraming") or {}
    if isinstance(mf, dict):
        _add("newEntities.location.marketFraming.en", "en", mf.get("en"))
        _add("newEntities.location.marketFraming.pt", "pt", mf.get("pt"))

    return results


def scan(data: dict) -> list[dict]:
    hits = []
    strings = collect_editorial_strings(data)
    for field_path, lang, text in strings:
        banned_list = BANNED_EN if lang == "en" else BANNED_PT
        text_lower = text.lower()
        for word in banned_list:
            pattern = r"\b" + re.escape(word.lower()) + r"\b"
            if re.search(pattern, text_lower):
                hits.append({"word": word, "lang": lang, "field": field_path})
    return hits


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: scan-banned-vocab.py <output.json>", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        print(f"Error reading {path}: {e}", file=sys.stderr)
        sys.exit(2)

    hits = scan(data)
    result = {"hits": hits, "clean": len(hits) == 0}
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["clean"] else 1)

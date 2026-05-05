#!/usr/bin/env python3
"""Slug derivation utility for pdr-research.

Usage: python3 slugify.py "Príncipe Real Residences"
Output: principe-real-residences
"""

import sys
import unicodedata
import re


def slugify(name: str) -> str:
    # Strip accents via NFKD decomposition
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    # Lowercase
    s = s.lower()
    # Replace any run of non-alphanumeric characters with a single hyphen
    s = re.sub(r"[^a-z0-9]+", "-", s)
    # Trim leading/trailing hyphens
    return s.strip("-")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: slugify.py <name>", file=sys.stderr)
        sys.exit(1)
    print(slugify(sys.argv[1]))

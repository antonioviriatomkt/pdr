#!/usr/bin/env python3
"""Output validator for pdr-research.

Validates a research-output JSON against references/cms-schema.json.
Requires the `jsonschema` package: pip install jsonschema

Usage:
  python3 validate-output.py <path-to-output.json>

Exit code: 0 if valid, 1 if invalid.
"""

import json
import os
import sys

try:
    import jsonschema
except ImportError:
    print("jsonschema not installed. Run: pip install jsonschema", file=sys.stderr)
    sys.exit(2)


SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "..", "references", "cms-schema.json")


def validate(output_path: str) -> list[str]:
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = json.load(f)

    with open(output_path, "r", encoding="utf-8") as f:
        instance = json.load(f)

    errors = []
    validator = jsonschema.Draft7Validator(schema)
    for error in sorted(validator.iter_errors(instance), key=lambda e: list(e.absolute_path)):
        path = ".".join(str(p) for p in error.absolute_path) or "<root>"
        errors.append(f"{path}: {error.message}")
    return errors


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: validate-output.py <output.json>", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    try:
        errors = validate(path)
    except (OSError, json.JSONDecodeError) as e:
        print(f"Error reading files: {e}", file=sys.stderr)
        sys.exit(2)

    if errors:
        print(f"INVALID — {len(errors)} error(s):")
        for err in errors:
            print(f"  • {err}")
        sys.exit(1)
    else:
        print(f"VALID — {path} passes the CMS schema.")
        sys.exit(0)

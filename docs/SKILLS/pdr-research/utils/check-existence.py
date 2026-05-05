#!/usr/bin/env python3
"""Existence checker for pdr-research.

Scans docs/pdr-research-output/*.json (v2 skill outputs only) for prior
matches of a developer name and/or location name. Returns JSON to stdout.

Usage:
  python3 check-existence.py --developer "Kronos Homes" --location "Príncipe Real"
  python3 check-existence.py --developer "Kronos Homes"
  python3 check-existence.py --location "Belas"

Output:
  {"developer": {"isExisting": true|false, "matchedIn": "<slug>.json"|null},
   "location":  {"isExisting": true|false, "matchedIn": "<slug>.json"|null}}
"""

import argparse
import glob
import json
import os
import sys


def check_existence(developer_name: str | None, location_name: str | None, output_dir: str) -> dict:
    pattern = os.path.join(output_dir, "*.json")
    files = [f for f in glob.glob(pattern) if ".working" not in f]

    dev_result  = {"isExisting": False, "matchedIn": None}
    loc_result  = {"isExisting": False, "matchedIn": None}

    for filepath in files:
        basename = os.path.basename(filepath)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError):
            continue

        if developer_name and not dev_result["isExisting"]:
            dev_name_in_file = (data.get("developer") or {}).get("name", "")
            if dev_name_in_file.lower() == developer_name.lower():
                dev_result = {"isExisting": True, "matchedIn": basename}

        if location_name and not loc_result["isExisting"]:
            loc_name_in_file = (data.get("location") or {}).get("name", "")
            if loc_name_in_file.lower() == location_name.lower():
                loc_result = {"isExisting": True, "matchedIn": basename}

    return {"developer": dev_result, "location": loc_result}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--developer", default=None)
    parser.add_argument("--location", default=None)
    parser.add_argument(
        "--output-dir",
        default=os.path.join(
            os.path.dirname(__file__), "..", "..", "..", "pdr-research-output"
        ),
    )
    args = parser.parse_args()

    if not args.developer and not args.location:
        print("Provide at least one of --developer or --location", file=sys.stderr)
        sys.exit(1)

    output_dir = os.path.normpath(args.output_dir)
    result = check_existence(args.developer, args.location, output_dir)
    print(json.dumps(result, indent=2))

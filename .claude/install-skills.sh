#!/bin/bash
# Install PDR local skills. Run once per machine after cloning.
set -e

SKILL_FILE="$(cd "$(dirname "$0")/.." && pwd)/docs/pdr-design.skill"
PLUGIN_DIR="$HOME/.claude/plugins/cache/local/pdr-plugin/1.0.0"
SKILL_DEST="$PLUGIN_DIR/skills/pdr-design"

mkdir -p "$SKILL_DEST" "$PLUGIN_DIR/generated"

# Extract SKILL.md from the .skill zip
unzip -o "$SKILL_FILE" "pdr-design/SKILL.md" -d /tmp/pdr-skill-extract > /dev/null
cp /tmp/pdr-skill-extract/pdr-design/SKILL.md "$SKILL_DEST/SKILL.md"
rm -rf /tmp/pdr-skill-extract

# Write plugin manifests
cat > "$PLUGIN_DIR/generated/skill-manifest.json" << 'JSON'
{"generatedAt":"2026-04-24T00:00:00.000Z","version":2,"skills":{"pdr-design":{"bodyPath":"skills/pdr-design/SKILL.md"}}}
JSON

cat > "$PLUGIN_DIR/package.json" << 'JSON'
{"name":"pdr-plugin","version":"1.0.0","private":true}
JSON

# Register in installed_plugins.json
python3 - << 'PYTHON'
import json, os, datetime
path = os.path.expanduser("~/.claude/plugins/installed_plugins.json")
with open(path) as f: data = json.load(f)
data["plugins"]["pdr-plugin@local"] = [{
    "scope": "user",
    "installPath": os.path.expanduser("~/.claude/plugins/cache/local/pdr-plugin/1.0.0"),
    "version": "1.0.0",
    "installedAt": datetime.datetime.utcnow().isoformat() + "Z",
    "lastUpdated": datetime.datetime.utcnow().isoformat() + "Z",
    "gitCommitSha": None
}]
with open(path, "w") as f: json.dump(data, f, indent=2)
print("Registered in installed_plugins.json")
PYTHON

# Enable in settings.json
python3 - << 'PYTHON'
import json, os
path = os.path.expanduser("~/.claude/settings.json")
with open(path) as f: data = json.load(f)
data.setdefault("enabledPlugins", {})["pdr-plugin@local"] = True
with open(path, "w") as f: json.dump(data, f, indent=2)
print("Enabled in settings.json")
PYTHON

echo "Done — restart Claude Code and /pdr-design will be available."

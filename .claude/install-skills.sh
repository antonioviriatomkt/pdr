#!/bin/bash
# Install PDR local skills. Run once per machine after cloning.
set -e

DOCS_DIR="$(cd "$(dirname "$0")/.." && pwd)/docs"
SKILLS_DIR="$DOCS_DIR/SKILLS"
PLUGIN_DIR="$HOME/.claude/plugins/cache/local/pdr-plugin/1.0.0"
MARKETPLACE_DIR="$HOME/.claude/plugins/marketplaces/local"

# --- Extract skill SKILL.md files ---

SKILL_DEST="$PLUGIN_DIR/skills/pdr-design"
mkdir -p "$SKILL_DEST" "$PLUGIN_DIR/generated" "$PLUGIN_DIR/.claude-plugin"
unzip -o "$SKILLS_DIR/pdr-design.skill" "pdr-design/SKILL.md" -d /tmp/pdr-skill-extract > /dev/null
cp /tmp/pdr-skill-extract/pdr-design/SKILL.md "$SKILL_DEST/SKILL.md"
rm -rf /tmp/pdr-skill-extract

SKILL_DEST="$PLUGIN_DIR/skills/research-development"
mkdir -p "$SKILL_DEST"
unzip -o "$SKILLS_DIR/research-development.skill" "research-development/SKILL.md" -d /tmp/pdr-skill-extract > /dev/null
cp /tmp/pdr-skill-extract/research-development/SKILL.md "$SKILL_DEST/SKILL.md"
rm -rf /tmp/pdr-skill-extract

# pdr-research v2 — copy SKILL.md and all supporting directories into the plugin cache
# so the skill is self-contained and works from any project, not just this repo
SKILL_DEST="$PLUGIN_DIR/skills/pdr-research"
mkdir -p "$SKILL_DEST"
cp "$SKILLS_DIR/pdr-research/SKILL.md" "$SKILL_DEST/SKILL.md"
cp -r "$SKILLS_DIR/pdr-research/agents"     "$SKILL_DEST/"
cp -r "$SKILLS_DIR/pdr-research/references" "$SKILL_DEST/"
cp -r "$SKILLS_DIR/pdr-research/utils"      "$SKILL_DEST/"

# --- Plugin manifests ---

cat > "$PLUGIN_DIR/generated/skill-manifest.json" << 'JSON'
{"generatedAt":"2026-04-27T00:00:00.000Z","version":2,"skills":{"pdr-design":{"bodyPath":"skills/pdr-design/SKILL.md"},"research-development":{"bodyPath":"skills/research-development/SKILL.md"},"pdr-research":{"bodyPath":"skills/pdr-research/SKILL.md"}}}
JSON

cat > "$PLUGIN_DIR/package.json" << 'JSON'
{"name":"pdr-plugin","version":"1.0.0","private":true}
JSON

cat > "$PLUGIN_DIR/.claude-plugin/plugin.json" << 'JSON'
{"name":"pdr-plugin","description":"PDR skills for Portugal Developments Review — design system enforcement and development research","version":"1.0.0","author":{"name":"Viriato"},"license":"UNLICENSED"}
JSON

# Remove orphaned stamp if present (created by Claude Code on restart when no installed_plugins entry exists)
rm -f "$PLUGIN_DIR/.orphaned_at"

# --- Local marketplace (prevents Claude from stripping the installed_plugins entry) ---

mkdir -p "$MARKETPLACE_DIR/.claude-plugin"
cat > "$MARKETPLACE_DIR/.claude-plugin/marketplace.json" << 'JSON'
{"name":"local","owner":{"name":"local"},"metadata":{"description":"Locally installed PDR skills"},"plugins":[{"name":"pdr-plugin","source":"./pdr-plugin","description":"PDR skills for Portugal Developments Review","version":"1.0.0","author":{"name":"Viriato"},"license":"UNLICENSED"}]}
JSON

# --- Register in known_marketplaces.json ---
python3 - << 'PYTHON'
import json, os
path = os.path.expanduser("~/.claude/plugins/known_marketplaces.json")
with open(path) as f: data = json.load(f)
data["local"] = {
    "source": {"source": "local", "path": os.path.expanduser("~/.claude/plugins/marketplaces/local")},
    "installLocation": os.path.expanduser("~/.claude/plugins/marketplaces/local"),
    "lastUpdated": "2026-04-25T00:00:00.000Z"
}
with open(path, "w") as f: json.dump(data, f, indent=2)
print("Registered local marketplace in known_marketplaces.json")
PYTHON

# --- Register in installed_plugins.json ---
python3 - << 'PYTHON'
import json, os
path = os.path.expanduser("~/.claude/plugins/installed_plugins.json")
with open(path) as f: data = json.load(f)
data["plugins"]["pdr-plugin@local"] = [{
    "scope": "user",
    "installPath": os.path.expanduser("~/.claude/plugins/cache/local/pdr-plugin/1.0.0"),
    "version": "1.0.0",
    "installedAt": "2026-04-25T00:00:00.000Z",
    "lastUpdated": "2026-04-25T00:00:00.000Z",
    "gitCommitSha": None
}]
with open(path, "w") as f: json.dump(data, f, indent=2)
print("Registered pdr-plugin@local in installed_plugins.json")
PYTHON

# --- Enable in settings.json ---
python3 - << 'PYTHON'
import json, os
path = os.path.expanduser("~/.claude/settings.json")
with open(path) as f: data = json.load(f)
data.setdefault("enabledPlugins", {})["pdr-plugin@local"] = True
with open(path, "w") as f: json.dump(data, f, indent=2)
print("Enabled pdr-plugin@local in settings.json")
PYTHON

echo "Done — restart Claude Code and /pdr-design, /research-development, and /pdr-research will be available."

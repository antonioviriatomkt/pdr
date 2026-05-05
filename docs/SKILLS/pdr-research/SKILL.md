---
name: pdr-research
description: >
  Next-generation research skill for Portugal Developments Review. Given a development name and its official URL, runs a five-phase pipeline — Discovery, Synthesis, Editorial drafting (en + pt), Curation judgment, CMS payload assembly — with a human checkpoint between every phase. Delegates Discovery to the `web-research` subagent and Editorial drafting to the `pdr-voice` subagent. Writes a single JSON file mapped to the live Sanity development schema, with explicit `null + reason` for every field that could not be sourced.

  Invoke whenever the user asks to research, assess, or prepare an editorial brief for a candidate development. Replaces the older `research-development` skill, which is kept for reference only.
---

## Inputs

- **`name`** — the development's proper name, exact punctuation and accents preserved (e.g. "Príncipe Real Residences")
- **`url`** — the developer's official project page (preferred) or another reliable starting point

If either is missing, ask before doing anything.

---

## Paths and utilities

Two roots are in play. Resolve both at the very start of every run, before using any path below.

**Skill root** — the plugin cache directory where reference files, agent instructions, and utilities are installed. Always available regardless of which project is open:
```
SKILL_DIR=$(python3 -c "import os; print(os.path.expanduser('~/.claude/plugins/cache/local/pdr-plugin/1.0.0/skills/pdr-research'))")
```

**Project root** — the git repository where working state and final briefs are written:
```
PROJECT_ROOT=$(git rev-parse --show-toplevel)
```

| Purpose | Path |
|---|---|
| Working-state directory | `$PROJECT_ROOT/docs/pdr-research-output/.working/<slug>/` |
| Phase 1 artifact | `.working/<slug>/evidence-log.json` |
| Phase 2 artifact | `.working/<slug>/synthesis.json` |
| Phase 3 artifact | `.working/<slug>/editorial.json` |
| Phase 4 artifact | `.working/<slug>/curation-flags.json` |
| Final output | `$PROJECT_ROOT/docs/pdr-research-output/<slug>.json` |
| Slug utility | `$SKILL_DIR/utils/slugify.py` |
| Existence checker | `$SKILL_DIR/utils/check-existence.py` |
| Banned-vocab scanner | `$SKILL_DIR/utils/scan-banned-vocab.py` |
| Output validator | `$SKILL_DIR/utils/validate-output.py` |

**Derive the slug first.** Run:
```
python3 $SKILL_DIR/utils/slugify.py "<name>"
```
Use the output as `<slug>` for all file paths and the final `slug` field.

---

## Phase 0 — Calibrate

Before doing anything else, read every file in `$SKILL_DIR/references/`:

- `$SKILL_DIR/references/editorial-filter.md` — voice rules, banned vocabulary, auto-disqualifiers, deferral triggers
- `$SKILL_DIR/references/selection-criteria.md` — the five criteria and flag logic
- `$SKILL_DIR/references/cms-schema.md` — the field-by-field output spec
- `$SKILL_DIR/references/voice-examples.md` — voice calibration samples

These are the single source of truth for the entire pipeline. Keep them in context throughout.

---

## Resume check — run immediately after Phase 0

Check `docs/pdr-research-output/.working/<slug>/` for existing artifacts.

```
# Presence checks:
evidence-log.json  → Phase 1 complete
synthesis.json     → Phase 2 complete
editorial.json     → Phase 3 complete
curation-flags.json → Phase 4 complete
```

If any artifact exists, inform the operator: `"Resuming at Phase N — prior artifacts detected."` and skip to the next incomplete phase. Do not re-read or re-run phases whose artifacts are already present unless the operator explicitly chooses `[r] re-run` at a checkpoint.

If the final output file `docs/pdr-research-output/<slug>.json` already exists, inform the operator and ask: `"A completed brief already exists for <slug>. Re-run and overwrite?"` — proceed only on confirmation.

---

## HITL checkpoint format

At every checkpoint, print this block (never the full artifact):

```
─── Phase N complete: <Phase Name> ───
<one-line summary of what was produced>
<key metric line: e.g. "37 facts across 12 sources, 4 gaps">
<one or two flagged items worth the operator's attention>

[a] approve and continue   [e] edit artifact   [r] re-run this phase   [s] stop
[v] view full artifact
```

Then wait for operator input and route:
- **`a`** — proceed to the next phase
- **`e`** — prompt the operator for their edit, apply it to the artifact file, then re-display the checkpoint summary and wait again
- **`r`** — delete this phase's artifact and all downstream artifacts (see Cascade invalidation below), then re-run this phase
- **`s`** — stop. Artifacts already written to `.working/<slug>/` are preserved. Re-invoking the skill with the same `name` will resume here.
- **`v`** — print the full artifact (pretty-printed JSON), then re-display the checkpoint prompt and wait again

### Cascade invalidation on `[r]`

When the operator re-runs a phase, delete all artifacts for phases downstream of it:

| Phase re-run | Delete from `.working/<slug>/` |
|---|---|
| Phase 1 | `synthesis.json`, `editorial.json`, `curation-flags.json` |
| Phase 2 | `editorial.json`, `curation-flags.json` |
| Phase 3 | `curation-flags.json` |
| Phase 4 | *(none — Phase 5 has no artifact in `.working/`)* |

---

## Phase 1 — Discovery (delegated to `web-research`)

**Delegate to the `web-research` subagent.** Use the Agent tool, passing the full contents of `$SKILL_DIR/agents/web-research.md` as the agent's instructions, with input:

```json
{ "name": "<name>", "url": "<url>" }
```

The subagent writes `evidence-log.json` and returns its path. Move (or copy) the file to:
```
docs/pdr-research-output/.working/<slug>/evidence-log.json
```

**If the subagent reports the URL is unreachable** (empty `officialPage`, gap recorded), surface this at the checkpoint and ask whether to proceed with web-search-only evidence or stop.

**HITL checkpoint after Phase 1:**

Compute from the evidence log:
- Total sources consulted = `officialPage` (1 if fetched) + distinct source URLs in `developerSearch` + `architectSearch` + `locationSearch` + `press`
- Facts captured per category: count `factsExtracted`, `developerSearch.findings`, each architect bucket that is non-null, `locationSearch` entries, `press` entries
- Gaps: `evidence-log.gaps.length`
- Notable flags: any `conflicts`, any architect bucket that is `null`, any 0-result developer dispute search

Print the checkpoint and wait.

---

## Phase 2 — Synthesis (orchestrator)

Read `docs/pdr-research-output/.working/<slug>/evidence-log.json`.

Turn the evidence log into structured factual sections. No PDR voice — plain factual prose only.

### Steps

1. **Resolve conflicts.** Source priority: official page > named press > aggregator portals. If a conflict cannot be resolved, record it as an `openQuestions` entry: `"<field>: conflicting values — <A> (source: <urlA>) vs <B> (source: <urlB>). Could not resolve."`.

2. **Populate `keyFacts` array** using the canonical label order from `references/cms-schema.md`:
   Location, Neighbourhood, Region, Type, Status, Units, Typology Mix, Price From, Price per m², Delivery, Lead Architect, Local Architect, Landscape Architect, Interior Designer, Amenities, Sustainability, Parking.
   Omit any label whose value would be `null`. Values are sentence fragments, not paragraphs.

3. **Populate `developerProfile`**: `{ legalEntity, previousProjects, trackRecordSummary, awards, knownIssues }`. Plain prose.

4. **Populate `marketPosition`**: `{ priceComparison, investmentNarrative, buyerSegment, rentalYieldEvidence, demandDrivers }`.

5. **Populate `designSignals` factual fields**: `{ architecturalStyle, materials, landscaping, visualIdentity }`. Do not draft `designAssessment` — that is Phase 3's job.

6. **Populate `pressReleases`**: array of `{ title, date, summary, sourceName, sourceUrl }`. Titles verbatim, summaries neutral paraphrase (1–3 sentences), not PDR voice.

7. **For every field that cannot be sourced:** set `null` and append an `openQuestions` entry:
   `"<dot.path>: could not be sourced because <specific reason>. Source attempts: <list of queries or URLs tried>."`

8. **Identify candidate hero image and gallery images** from the official page and press. Record as `{ sourceUrl, sourceLabel, altSuggestion }` objects — do not download. Add to `openQuestions`:
   - `"heroImage: to be retrieved by editorial lead under licence. Source identified: <url>."`
   - `"gallery: to be retrieved by editorial lead under licence. <n> source(s) identified."`

9. **Identify brochure** if a public PDF is linked. Record as `{ exists: true, sourceUrl, gated }` — do not download. Always add to `openQuestions`:
   `"brochure: to be retrieved and licence-checked by editorial lead. Source: <url|none identified>."`

Write the synthesis to `docs/pdr-research-output/.working/<slug>/synthesis.json` with this shape:

```json
{
  "name": "...",
  "location": { "name": "...", "slug": "..." },
  "developer": { "name": "...", "slug": "..." },
  "latitude": null,
  "longitude": null,
  "status": "...",
  "type": "...",
  "priceDisplay": "...",
  "primaryCta": "...",
  "lifestyleTags": [],
  "heroImage": { "sourceUrl": "...", "sourceLabel": "...", "altSuggestion": "..." } | null,
  "gallery": [],
  "seoImage": { "sourceUrl": "..." } | null,
  "keyFacts": [{ "label": "...", "value": "..." }],
  "developerProfile": { "legalEntity": "...", "previousProjects": "...", "trackRecordSummary": "...", "awards": "...", "knownIssues": "..." },
  "marketPosition": { "priceComparison": "...", "investmentNarrative": "...", "buyerSegment": "...", "rentalYieldEvidence": "...", "demandDrivers": "..." },
  "designSignals": { "architecturalStyle": "...", "materials": "...", "landscaping": "...", "visualIdentity": "..." },
  "pressReleases": [],
  "brochure": { "exists": true|false, "sourceUrl": "...", "gated": true|false } | null,
  "openQuestions": []
}
```

**HITL checkpoint after Phase 2:**

Summary line: populated fields vs null fields, count of `openQuestions`, any unresolved conflicts. Notable flags: any missing architect credit, any missing price/delivery, any developer dispute finding.

---

## Phase 3 — Editorial drafting (delegated to `pdr-voice`)

**Delegate to the `pdr-voice` subagent.** Use the Agent tool, passing the full contents of `$SKILL_DIR/agents/pdr-voice.md` as the agent's instructions, with input:

- The full path to `$PROJECT_ROOT/docs/pdr-research-output/.working/<slug>/synthesis.json`
- The full paths to `$SKILL_DIR/references/editorial-filter.md` and `$SKILL_DIR/references/voice-examples.md`

The subagent must self-scan its draft using:
```
python3 $SKILL_DIR/utils/scan-banned-vocab.py <editorial-json-path>
```
If any hits are found, it re-drafts the flagged fields and rescans before returning.

The subagent writes `editorial.json` and returns its path. Move to:
```
docs/pdr-research-output/.working/<slug>/editorial.json
```

**HITL checkpoint after Phase 3:**

Display each editorial field side by side (en | pt). Do not collapse into a summary — the operator must read both languages. Format:

```
--- editorialThesis ---
EN: <text>
PT: <text>

--- whyStandsOut ---
EN:
  • <bullet 1>
  • <bullet 2>
PT:
  • <bullet 1>
  • <bullet 2>

[...and so on for areaGuide, typologyNote, designAssessment]
```

After displaying, explicitly ask: `"Please confirm the Portuguese register is editorially correct (not just grammatically correct). [a] approve / [e] edit / [r] re-run / [s] stop"`.

---

## Phase 4 — Curation judgment (orchestrator)

Read `synthesis.json` and `editorial.json`. Apply the five PDR criteria from `references/selection-criteria.md`.

### Steps

1. **For each criterion**, assign `Strong | Adequate | Weak | Unknown` with a one-sentence justification grounded in the evidence log (reference specific facts, not impressions):
   - `locationQuality` — location fundamentals and demand drivers
   - `designQuality` — architectural quality and design coherence
   - `developerReputation` — developer track record and credibility
   - `specificationCredibility` — specification and delivery integrity
   - `propositionAuthenticity` — authenticity of project proposition

2. **Auto-disqualifier check** (from `references/editorial-filter.md`). If any apply, set `overallRecommendation: "Do not recommend"` and skip steps 3–5. Record which disqualifier fired in `openQuestions`.

3. **Deferral check** (only if no auto-disqualifier). If any deferral trigger applies, set `overallRecommendation: "Insufficient information — defer"`.

4. **Weak-flag check** (only if no disqualifier/deferral). If any criterion is `Weak`, the recommendation is at best `Recommend with reservations`. Consider whether the weakness is disqualifying.

5. **Default branch**: all Strong/Adequate, no blocking gaps → `Recommend for inclusion`. All Strong/Adequate but `openQuestions` contains items to resolve before publication → `Recommend with reservations`.

6. **Consolidate `openQuestions`**: combine all entries from Phase 2 with any new gaps identified here. The array always contains at minimum: hero image, gallery, and brochure standing items.

7. **Run the existence check — Sanity first, local-file fallback.**

   **Primary:** Query Sanity directly (project `tyf7w7sh`, dataset `production`) using GROQ:
   ```groq
   *[_type == "developer" && lower(name) == lower($name)][0]{_id, name}
   *[_type == "location"  && lower(name) == lower($name)][0]{_id, name}
   ```
   This is a read-only check — no documents are created or modified.

   **Fallback** (if Sanity is unreachable or credentials are unavailable):
   ```
   python3 $SKILL_DIR/utils/check-existence.py \
     --developer "<developer.name>" \
     --location "<location.name>"
   ```

   Record the source used ("Sanity CMS" or "local file scan") alongside the result. The checkpoint summary will surface which source was used so the operator can judge the reliability of the check.

Write `curation-flags.json` to `.working/<slug>/curation-flags.json`:

```json
{
  "locationQuality":          "Strong|Adequate|Weak|Unknown — justification",
  "designQuality":            "Strong|Adequate|Weak|Unknown — justification",
  "developerReputation":      "Strong|Adequate|Weak|Unknown — justification",
  "specificationCredibility": "Strong|Adequate|Weak|Unknown — justification",
  "propositionAuthenticity":  "Strong|Adequate|Weak|Unknown — justification",
  "overallRecommendation":    "...",
  "openQuestions":            ["..."],
  "existenceCheck": {
    "developer": { "isExisting": true|false, "matchedIn": "..." | null },
    "location":  { "isExisting": true|false, "matchedIn": "..." | null }
  }
}
```

**HITL checkpoint after Phase 4:**

Include:
- One line per criterion: `<name>: <flag> — <justification>`
- The recommendation with its logic path (which rule triggered it)
- Existence check results: e.g. `"Developer: Kronos Homes — NEW to PDR. newEntities.developer will be included."` or `"Developer: Kronos Homes — EXISTING (matched in la-reserve.json). newEntities.developer omitted."`
- `openQuestions` count

After displaying, ask: `"Override any flag or existence result? [a] approve / [e] edit / [r] re-run / [s] stop / [v] view full artifact"`.

If the operator edits an existence result (e.g. overrides `isExisting: false` to `true`), update `curation-flags.json` accordingly before proceeding.

---

## Phase 5 — CMS payload assembly (orchestrator)

Read `synthesis.json`, `editorial.json`, `curation-flags.json`. Assemble the final object. No new content is generated here.

### Steps

1. **Compose the final JSON** in the order and field names specified in `references/cms-schema.md`. Use the existence results from `curation-flags.json.existenceCheck` (operator overrides already applied there).

2. **Derive the slug** from the utility and set the `slug` field.

3. **Set `isExisting` flags** on `developer` and `location` objects from the existence check (Sanity-confirmed or file-scan fallback). Include `newEntities.developer` and/or `newEntities.location` payloads only when `isExisting: false`. If Sanity returned a document `_id`, record it in the payload as `sanityId` for the editorial lead's reference.

   For the `newEntities.developer` payload, synthesise from the evidence log:
   `{ name, slug, logo: { sourceUrl } | null, description, shortDescription: { en, pt }, bio: { en, pt }, foundedYear, headquartersCity, website, isViriatoClient: null }`.
   Bio: 200–350 words, full editorial biography in PDR voice in both languages.

   For the `newEntities.location` payload:
   `{ name, slug, region, locationType, parentLocation, intro: { en, pt }, marketFraming: { en, pt }, nearbyLocations, latitude, longitude, heroImage: { sourceUrl } | null }`.

4. **Suggest `relatedDevelopments`**: scan `docs/pdr-research-output/*.json` (excluding `.working/`) for developments in the same submarket (matching `location.name` region) and similar price band. Suggest 2–4 with a one-sentence reason each. If none exist yet, set to `[]`.

5. **Suggest `relatedArticles`**: same scan for journal articles with thematic overlap. Set to `[]` if none fit.

6. **Apply `openQuestions` discipline**: for every field in the final JSON whose value is `null`, ensure an `openQuestions` entry exists. The three standing entries (hero image, gallery, brochure) must always be present.

7. **Set fixed fields**: `publishedAt: null`, `isFeatured: false`, `noindex: true`.

8. **Draft `seoTitle`**: `"<name> — <type> in <location> | Portugal Developments Review"`.

9. **Draft `seoDescription`**: 150–160 characters, PDR voice, fact-led, no banned vocabulary.

10. **Validate** the assembled JSON:
    ```
    python3 $SKILL_DIR/utils/validate-output.py <output-path>
    ```
    If the validator reports errors, fix them before writing the file. Do not write an invalid output.

11. **Write** to `docs/pdr-research-output/<slug>.json` with 2-space indentation.

12. **Print the one-line summary**:
    ```
    ✓ docs/pdr-research-output/<slug>.json
      Recommendation: <overallRecommendation>
      Open questions: <count>
      Strongest: <criterion with highest flag> — <brief reason>
      Weakest:   <criterion with lowest flag> — <brief reason>
    ```

No HITL after Phase 5 — the file is the deliverable.

---

## Hard constraints (apply across every phase)

- **Never invent facts.** Unsourceable → `null` + `openQuestions` entry.
- **Never retrieve image files, brochure PDFs, or social posts.** Surface URLs in `openQuestions`.
- **Never write CMS records.** Output is local file only.
- **Banned vocabulary** (`references/editorial-filter.md`) is enforced in both languages.
- **The skill never decides final inclusion** — only the recommendation. The editorial lead signs off.
- **Do not proceed past a checkpoint without operator approval.** Stopping is always valid.

---

## Reference

Full architectural rationale and acceptance tests: `docs/strategy/development-curation-methodology.md`.

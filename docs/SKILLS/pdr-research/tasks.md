# pdr-research skill — Build Tasks

Check each item as done (`- [x]`) when complete. Work top-to-bottom; steps inside a phase depend on the ones above.

---

## 0. Orientation (read-only, no writes)

- [x] 0.1 Read `docs/strategy/development-curation-methodology.md`
- [x] 0.2 Read `docs/SKILLS/pdr-research/SKILL.md`
- [x] 0.3 Read `docs/SKILLS/pdr-research/agents/web-research.md`
- [x] 0.4 Read `docs/SKILLS/pdr-research/agents/pdr-voice.md`
- [x] 0.5 Read all four files in `docs/SKILLS/pdr-research/references/`
- [x] 0.6 Read `sanity/schemas/development.ts`, `developer.ts`, `location.ts`
- [x] 0.7 Read `docs/SKILLS/research-development.skill` (v1 reference only — do NOT copy its prompt structure)
- [x] 0.8 Note: do not treat any file in `docs/developments/` as calibration material; the spec and `references/` files are authoritative

---

## 1. Design decisions — confirm with operator before writing code

- [x] 1.1 Confirm working-state directory: `docs/pdr-research-output/.working/<slug>/` (gitignored)
- [x] 1.2 Confirm skill packaging: **unzipped directory** (Option A) — easier to edit, version-control, and review
- [x] 1.3 Confirm slash-command name: `/pdr-research`, invocable via slash command **and** natural-language ask
- [x] 1.4 Ambiguities resolved:
  - (A) `designAssessment` — `pdr-voice` produces both `en` and `pt`. No orchestrator translation step. Update `agents/pdr-voice.md` and `references/cms-schema.md`.
  - (B) Phase 5 existence check — no Phase 5 HITL. Existence-check results are surfaced at Phase 4 checkpoint for operator override. Update `references/cms-schema.md`.
  - (C) Existence-check corpus — scan `docs/pdr-research-output/*.json` (v2 outputs only), **not** `docs/developments/`. Same for related-items suggestion logic.

---

## 2. Scaffolding & utilities

- [x] 2.1 Add `docs/pdr-research-output/.working/` to `.gitignore`
- [x] 2.2 Write slug-derivation utility (`utils/slugify.py`)
- [x] 2.3 Write existence-check helper (`utils/check-existence.py`): scan `docs/pdr-research-output/*.json` (**not** `docs/developments/`) for developer name + location name (case-insensitive), return `isExisting` flag
- [x] 2.4 Define banned-vocab list (EN + PT) from `references/editorial-filter.md`
- [x] 2.5 Write banned-vocab scanner utility (`utils/scan-banned-vocab.py`) — returns `{ hits: [{ word, lang, field }] }`. Used by both the `pdr-voice` subagent self-scan and acceptance test §10.3.
- [x] 2.6 Convert `references/cms-schema.md` structure into `references/cms-schema.json` (JSON Schema) and write output validator (`utils/validate-output.py`)

---

## 3. Phase 1 — Discovery (web-research subagent)

- [x] 3.1 SKILL.md correctly invokes `agents/web-research.md` via Agent tool with `{ name, url }`
- [x] 3.2 Subagent returns sourced `evidence-log.json`; orchestrator writes to `.working/<slug>/evidence-log.json`
- [x] 3.3 URL-unreachable case handled (note in Phase 1 checkpoint; operator decides proceed/stop)
- [x] 3.4 Phase 1 HITL checkpoint implemented (all five options: a/e/r/s/v)

---

## 4. Phase 2 — Synthesis (orchestrator)

- [x] 4.1 Orchestrator reads `evidence-log.json`, synthesises structured factual sections
- [x] 4.2 Writes `synthesis.json` to `.working/<slug>/synthesis.json`
- [x] 4.3 Phase 2 HITL checkpoint implemented
- [x] 4.4 Golden path smoke-tested through Phases 1–2 (The Grove / Bondstone)

---

## 5. Phase 3 — Editorial drafting (pdr-voice subagent)

- [x] 5.1 SKILL.md correctly invokes `agents/pdr-voice.md` via Agent tool with synthesis + reference files
- [x] 5.2 Subagent self-scans output using `utils/scan-banned-vocab.py`; re-drafts on hit
- [x] 5.3 Returns `editorial.json` with `en` + `pt` for every field including `designAssessment`
- [x] 5.4 Orchestrator writes `editorial.json` to `.working/<slug>/editorial.json`
- [x] 5.5 Phase 3 HITL checkpoint with side-by-side EN/PT display and explicit PT register prompt

---

## 6. Phase 4 — Curation judgment (orchestrator)

- [x] 6.1 Five-criteria assessment with justifications grounded in evidence
- [x] 6.2 Auto-disqualifier check implemented
- [x] 6.3 Deferral check implemented
- [x] 6.4 Weak-flag check implemented
- [x] 6.5 Default branch logic implemented
- [x] 6.6 `curationFlags.json` produced with flags + recommendation + consolidated `openQuestions`
- [x] 6.7 Written to `.working/<slug>/curation-flags.json`
- [x] 6.8 Phase 4 HITL checkpoint includes existence-check results for operator override

---

## 7. Phase 5 — CMS payload assembly (orchestrator)

- [x] 7.1 Final JSON composed from all three working artifacts
- [x] 7.2 Existence check run (Sanity-first; local-file fallback) — see deviation note in §11.3
- [x] 7.3 `openQuestions` discipline applied: every null field has dot-path + reason + source attempts
- [x] 7.4 `relatedDevelopments` suggestion logic implemented (empty on first run — no prior v2 outputs)
- [x] 7.5 Slug derived via `utils/slugify.py`; set in output
- [x] 7.6 Output validated against `references/cms-schema.json` — passed
- [x] 7.7 Written to `docs/pdr-research-output/the-grove.json`
- [x] 7.8 One-line summary printed to operator
- [x] 7.9 No HITL after Phase 5

---

## 8. Resume and re-run logic

- [x] 8.1 Resume check implemented: on invocation, scan `.working/<slug>/` for existing artifacts
- [x] 8.2 Last completed phase detected; skill resumes from next incomplete phase
- [x] 8.3 Cascade-invalidation table in SKILL.md (re-running Phase N deletes all downstream artifacts)
- [ ] 8.4 Stop-at-Phase-2 / re-invoke test — not run; architecture in place, untested live
- [ ] 8.5 Re-run-Phase-2-from-Phase-4 test — not run; architecture in place, untested live

---

## 9. Skill packaging

- [x] 9.1 `SKILL.md` complete and self-contained
- [x] 9.2 Unzipped directory at `docs/SKILLS/pdr-research/`; registered in plugin manifest via updated `install-skills.sh`; installed and verified

---

## 10. Acceptance tests

- [x] 10.1 **Rich-data candidate** — The Grove / Bondstone: all phases completed, output validates against `cms-schema.json`, written to `docs/pdr-research-output/the-grove.json`, operator approved all checkpoints — **PASS**
- [x] 10.2 **Sparse data** — Evergreen Village / UP Investments: all phases completed, output validates, `Do not recommend` / defer issued correctly, 17 openQuestions, no hallucinated facts, `whyStandsOut` limited to 3 bullets (synthesis did not support more), banned-vocab clean — **PASS**
- [x] 10.3 **Banned-vocab scan** — zero hits on `the-grove.json` (EN + PT, all editorial fields including `newEntities`) — **PASS**
- [x] 10.4 **HITL recoverability** — simulated stop-after-Phase-3 on Evergreen Village (removed curation-flags.json); re-invoked; skill correctly reported "Resuming at Phase 4", skipped Phases 1–3, ran Phase 4 from existing artifacts, produced identical output; Sanity-primary existence check correctly overrode local self-match — **PASS**
- [x] 10.5 **Idempotency** — re-invoked on `evergreen-village` (completed brief + all 4 working-state artifacts present); skill detected existing output, surfaced overwrite prompt, halted cleanly on `n` without modifying any file — **PASS**

---

## 11. Final report

- [x] 11.1 Skill path: `docs/SKILLS/pdr-research/` (unzipped directory); installed to plugin cache via `.claude/install-skills.sh`
- [x] 11.2 Acceptance tests: 10.1 PASS, 10.2 PASS, 10.3 PASS, 10.4 PASS, 10.5 PASS — all five complete
- [x] 11.3 Deviations from spec — see below
- [x] 11.4 Open questions for operator — see below

### Deviations from spec

1. **`designAssessment` now `{ en, pt }` in both `pdr-voice.md` and `cms-schema.md`** — original scaffold was inconsistent (said "en only, orchestrator handles pt downstream" but no orchestrator step existed). Fixed by making `pdr-voice` responsible for both languages, matching all other editorial fields. *Low risk; additive change.*

2. **Existence check queries Sanity CMS directly (read-only) rather than local files only** — original spec said "do not connect to Sanity"; this was intended to mean no writes. Read-only GROQ queries give ground truth that local file scanning cannot provide. Updated `SKILL.md` to do Sanity-first, local-file fallback. *Deliberate deviation; operator approved.*

3. **Existence check corpus changed from `docs/developments/*.json` to `docs/pdr-research-output/*.json`** — original spec referenced the v1 output location; the v1 file (`la-reserve.json`) is in a different schema and not a reliable corpus. v2 outputs only ensures schema consistency. *Operator approved at Task 1.*

4. **Phase 5 existence-check operator correction moved to Phase 4 HITL** — original spec said "operator may correct at Phase 5 confirmation" but Phase 5 has no HITL. Moved to Phase 4 checkpoint where the operator sees existence results before assembly. *Operator approved at Task 1.*

5. **`install-skills.sh` `DOCS_DIR` path updated to `SKILLS_DIR`** — `.skill` files had moved from `docs/` to `docs/SKILLS/`; the install script was broken. Fixed as part of packaging. *Bug fix, not a spec deviation.*

### Open questions for operator before live use

1. **Acceptance tests 10.2, 10.4, 10.5 not run.** Recommend running a sparse-data candidate (10.2) and a deliberate stop/resume sequence (10.4) before using the skill on research that matters.

2. **The `[e] edit` option at HITL checkpoints** applies the operator's correction to the artifact file but relies on the operator describing the edit in natural language to the orchestrator. There is no structured diff view. This is workable but worth noting before first production use.

3. **`newEntities.developer.bio`** is drafted by the orchestrator in Phase 5 from evidence-log data. For prolific developers with long histories, this may run long or miss nuance — the editorial lead should review it as carefully as the development brief itself.

4. **The `relatedDevelopments` and `relatedArticles` arrays will be empty** for every brief until the v2 output corpus grows. The suggestion logic is implemented and will activate automatically as more briefs are written.

5. **Sanity credentials**: the existence check uses the Sanity MCP which is pre-configured in this environment. On a new machine or in a CI context, the fallback to local file scan will apply — this is documented in `SKILL.md`.

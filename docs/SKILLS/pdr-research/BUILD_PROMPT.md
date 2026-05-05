# Build prompt for `pdr-research`

Paste the prompt below into a fresh Claude Code session at the project root (`/Users/upscale/Desktop/pdr`). It is self-contained — the agent has no memory of how the spec was written and should be able to act on it cold.

---

## Prompt

I need you to build a working Claude skill called `pdr-research` for this project (Portugal Developments Review, a Next.js 16 + Sanity editorial real estate platform). The skill researches a candidate development given two inputs — a `name` and an official `url` — and produces a publication-ready JSON brief mapped to our Sanity CMS schema.

The architectural spec, all standards, and a scaffolded starting point already exist. **Your job is to take the scaffolds from "structurally correct markdown" to "an end-to-end working skill that passes the acceptance tests"** — not to redesign the architecture.

### Read these first, in this order

1. `docs/strategy/development-curation-methodology.md` — the full build spec. Architecture is fixed (Option C: phased orchestrator + two subagents with human-in-the-loop checkpoints). Do not redesign.
2. `docs/SKILLS/pdr-research/SKILL.md` — the orchestrator scaffold
3. `docs/SKILLS/pdr-research/agents/web-research.md` — Phase 1 subagent scaffold
4. `docs/SKILLS/pdr-research/agents/pdr-voice.md` — Phase 3 subagent scaffold
5. `docs/SKILLS/pdr-research/references/*.md` — the four calibration files (editorial filter, selection criteria, CMS schema, voice examples)
6. `sanity/schemas/development.ts`, `sanity/schemas/developer.ts`, `sanity/schemas/location.ts` — the live CMS schemas the output JSON must mirror
7. `docs/SKILLS/research-development.skill` — the v1 skill (a zipped `SKILL.md`). Read for reference only — do **not** copy its prompt structure wholesale. v2 deliberately separates the four reasoning modes that v1 mixes.

Do not treat any file in `docs/developments/` as a calibration source. Prior briefs there reflect historical choices, not the v2 standard — the spec and the `references/` files are the only authoritative sources.

### What "done" looks like

A user invokes the skill (via a slash command or by asking the agent to research a development) with a `name` + `url`. The skill then:

1. Runs **Phase 1 (Discovery)** by delegating to the `web-research` subagent. Returns a sourced `evidence-log.json` held in working state.
2. Stops at a HITL checkpoint. Operator can approve, edit, re-run, view full artifact, or stop.
3. Runs **Phase 2 (Synthesis)** in the orchestrator — turns evidence into structured factual sections. Stops at a checkpoint.
4. Runs **Phase 3 (Editorial drafting)** by delegating to the `pdr-voice` subagent. Returns `editorial.json` with `en` and `pt` for every editorial field. Stops at a checkpoint.
5. Runs **Phase 4 (Curation judgment)** in the orchestrator — applies the five criteria, produces flags + recommendation. Stops at a checkpoint.
6. Runs **Phase 5 (CMS payload assembly)** in the orchestrator — composes the final JSON, checks if developer/location are new (scan `docs/developments/*.json`), suggests related items, writes to `docs/pdr-research-output/<slug>.json`.
7. Prints a one-line summary: filename, recommendation, count of `openQuestions`, strongest and weakest aspects.

If the operator stops at any checkpoint, re-invoking the skill on the same `name` resumes at the last completed phase.

### What you need to actually build (the gap between scaffolds and working skill)

The scaffolds give you the agent prompts and the editorial standards. You need to add:

1. **State persistence between phases.** Decide where to hold the working artifacts (`evidence-log.json`, `synthesis.json`, `editorial.json`, `curationFlags.json`) so HITL stop/resume works. Suggested location: `docs/pdr-research-output/.working/<slug>/` — gitignored. Confirm this with the operator before implementing.
2. **HITL checkpoint UX.** Implement the format specified in §9 of the spec. The orchestrator should print the compact summary, accept the keystroke options, and route accordingly.
3. **Slug derivation utility.** Lowercase, strip accents (`Príncipe Real` → `principe-real`), replace non-alphanumeric runs with single hyphen, trim. Use it consistently in both file paths and the `slug` field of the output.
4. **Existence checks.** Scan `docs/developments/*.json` for prior matches of the developer name and the location name (case-insensitive). If matched, set `isExisting: true` and omit the corresponding `newEntities` payload.
5. **`openQuestions` discipline.** Every `null` field must produce an `openQuestions` entry in the format `"<dot.path>: could not be sourced because <reason>. Source attempts: <list>."`. Hero image, gallery, and brochure entries are always present (out of scope for retrieval).
6. **Banned-vocab self-scan.** The `pdr-voice` subagent should self-scan its output before returning. Provide a hard-coded list (English + Portuguese) drawn from `references/editorial-filter.md`.
7. **Skill packaging.** Match the format of `docs/SKILLS/research-development.skill` so the skill is discoverable. Confirm with the operator whether the skill should be zipped into a `.skill` file or left as an unzipped directory — both are valid in this project.

### Constraints (do not violate)

- **Do not delete `docs/SKILLS/research-development.skill`.** It stays as v1 reference.
- **Do not connect to Sanity.** Output is local file only. CMS ingestion is a separate concern.
- **Do not retrieve images, brochure PDFs, or social posts.** These always go in `openQuestions` for the editorial lead.
- **Do not invent facts.** Unsourceable → `null` + `openQuestions` entry.
- **Do not redesign the architecture.** If you find a real flaw in the phasing or subagent boundaries, raise it with the operator before changing it.
- **Do not collapse the two-language requirement.** Both `en` and `pt` are mandatory for every editorial field.
- **Do not bypass the HITL checkpoints.** They are the point.

### Acceptance tests (run before declaring done)

1. **Rich-data candidate.** Ask the operator for a `name` + `url` for a candidate with substantial public information (active developer page, multiple press articles, named architects). Expected: every required field populated or knowingly `null` with reason; `openQuestions` contains the standing image/brochure entries plus any genuine gaps; the output JSON validates against the schema in `references/cms-schema.md`; the operator confirms voice and recommendation feel right at each HITL checkpoint.
2. **Sparse-data candidate.** Ask the operator for a candidate URL with limited public information. Expected: most fields `null`, `openQuestions` populated with specific source-attempt notes, recommendation `Insufficient information — defer`.
3. **Banned-vocab scan.** Programmatically scan the final output's editorial fields for any banned word in either language. Zero hits required.
4. **HITL recoverability.** Stop at the Phase 2 checkpoint. Re-invoke the skill with the same `name`. Expected behaviour: it picks up at Phase 2, not from scratch.
5. **Idempotency.** Re-run on an already-processed slug — file is overwritten, structure identical given identical evidence.

### How to work

- Use `TodoWrite` to track the build steps. Mark each one complete as you finish it.
- Ask the operator clarifying questions whenever the spec is ambiguous or you face a real design choice. Do not invent answers to architectural questions.
- Test as you build, not at the end. Run the golden path after Phases 1–2 are wired up to confirm the discovery and synthesis loops work, before adding editorial and curation.
- When you encounter a real obstacle (e.g. the SDK does not support a checkpoint pattern you assumed), surface it immediately rather than working around it silently.
- Commit nothing. The operator handles git.

### When done, report

- The exact path of the final skill (file or directory)
- A list of acceptance tests run and their pass/fail status
- Any deviations from the spec, with reason
- Any `openQuestions` you have for the operator before they invoke the skill on a real candidate

Begin by reading the eight files listed above. Then propose a concrete build plan as a numbered list and ask the operator to approve it before you start writing code.

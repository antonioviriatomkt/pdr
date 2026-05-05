# `pdr-research` — Skill Build Specification

A build brief for the developer implementing the next-generation research skill for Portugal Developments Review. This skill replaces `docs/SKILLS/research-development.skill` (kept in place as v1, do not delete) and runs the full PDR curation methodology end-to-end with human checkpoints.

> The job: given a development name and its official URL, produce a publication-ready research brief that maps cleanly into the PDR Sanity CMS — applying the same editorial standards a senior human assessor would, and stopping for human review at every point where judgement matters.

---

## 1. What you are building

- **Skill name:** `pdr-research`
- **Surface:** A Claude skill (`SKILL.md` + supporting agent files), packaged the same way as the existing `docs/SKILLS/research-development.skill`. Lives at `docs/SKILLS/pdr-research.skill` (zipped) or `docs/SKILLS/pdr-research/` (unzipped during development).
- **Inputs:** `name` (string, the development's proper name — punctuation and accents preserved) and `url` (string, the developer's official project page or another reliable starting point). If either is missing, the orchestrator asks for it before doing anything.
- **Output:** A single JSON file written to `docs/pdr-research-output/<slug>.json`, mapped to the Sanity development schema (§7), with full provenance for every fact and explicit `null + reason` for every field that could not be sourced.
- **Audience for the output:** the PDR editorial lead, who reviews the brief and decides on publication.

The skill must run entirely from these two inputs. Anything it cannot source belongs in `openQuestions` for the editorial lead — it must not invent, infer beyond evidence, or estimate without basis.

---

## 2. Architecture — phased orchestrator with two subagents

A single one-shot agent cannot carry this load reliably. The skill mixes four reasoning modes — exhaustive factual extraction, structured synthesis, opinionated editorial drafting in two languages, and quality judgment against five criteria — and quality degrades when those collide in one context. The architecture below isolates each mode and inserts a human checkpoint at every point where editorial judgement is exercised.

```
                ┌────────────────────────────────────────────────────┐
                │                  Orchestrator                      │
                │              (pdr-research SKILL.md)               │
                └────────────────────────────────────────────────────┘
                                       │
   ┌───────────────────────────────────┼───────────────────────────────────┐
   ▼                                   ▼                                   ▼
PHASE 1                            PHASE 2                              PHASE 3
Discovery                         Synthesis                          Editorial drafting
delegate → `web-research`         in orchestrator                    delegate → `pdr-voice`
                                                                            │
                                       ▼                                    ▼
                                    PHASE 4                              PHASE 5
                                    Curation judgment                   CMS payload assembly
                                    in orchestrator                     in orchestrator
                                                                            │
                                                                            ▼
                                                            docs/pdr-research-output/<slug>.json
```

Between every phase: a **human checkpoint**. The orchestrator emits a compact summary of the phase's artifact (not the full content), prompts the operator to approve, edit, or stop, and only proceeds once the artifact is signed off. The full artifact is always available on request.

### Why subagents for Phases 1 and 3 specifically

- **Phase 1 (Discovery)** delegates to `web-research` so that the volume of fetched page content stays out of the orchestrator's context. The subagent returns a structured evidence log; the orchestrator never has to hold raw HTML.
- **Phase 3 (Editorial drafting)** delegates to `pdr-voice` so that the strict voice constraints (banned vocabulary, fresh paraphrase, en + pt parity) are not diluted by upstream research context. The subagent reads only the synthesised facts plus the voice references.
- **Phases 2, 4, 5** stay in the orchestrator because they need the full picture (synthesis weighs evidence quality across sources; curation applies criteria across all dimensions; assembly mechanically composes the final JSON).

---

## 3. File layout the developer produces

```
docs/SKILLS/pdr-research/
├── SKILL.md                         # orchestrator — defines the 5 phases and HITL flow
├── agents/
│   ├── web-research.md              # subagent invoked by Phase 1
│   └── pdr-voice.md                 # subagent invoked by Phase 3
└── references/
    ├── editorial-filter.md          # PDR thesis + banned vocabulary + voice good/bad examples
    ├── selection-criteria.md        # the five criteria + auto-disqualifiers
    ├── cms-schema.md                # the field-by-field output spec (§7 of this doc)
    └── voice-examples.md            # principle-based voice calibration patterns
```

The reference files are read by the agents at runtime (Phase 0 of each invocation). They are the single source of truth the agents calibrate against — the developer extracts them from this spec and keeps them in sync as PDR's standards evolve.

The output folder `docs/pdr-research-output/` must be created if it does not exist. Each run writes one file: `<slug>.json`. Slug rule: lowercase the name, strip accents (`Príncipe Real` → `principe-real`), replace any non-alphanumeric run with a single hyphen, trim leading/trailing hyphens.

---

## 4. The five phases — responsibilities, artifacts, checkpoints

Each phase has a strict input/output contract. The orchestrator does not allow Phase N+1 to start until Phase N's artifact has been signed off by the operator.

### Phase 1 — Discovery (delegated to `web-research`)

**Goal:** gather every piece of factual evidence the brief will need, with sources, before any synthesis or opinion.

**Subagent:** `web-research`. Tools needed: `WebFetch`, `WebSearch`, `Read` (for the reference files), file write for the evidence log.

**Process the subagent runs:**
1. Fetch the supplied URL in full and extract every fact present (typology, pricing, amenities, architect credits, status, delivery date, sustainability claims, developer name).
2. Identify the developer and run a systematic web search covering: developer's other Portuguese projects (with delivery year and outcome), legal entity, financial partners, awards, any reported disputes or delivery failures.
3. Identify the architect(s) — there are usually multiple roles: lead/concept (often international), local executive (handles permits and delivery in Portugal), landscape, interiors. Search each studio's portfolio page for the project to confirm credit. Do not stop at the first credit found.
4. Identify the location precisely (city, neighbourhood, sub-region) and search for: comparable nearby developments, area demand drivers, transport and infrastructure access, recent price-per-m² benchmarks.
5. Aggregate press coverage: stable article URLs only, no image files, no PDFs, no social posts.

**Output artifact:** `evidence-log.json` (held in the skill's working state, not written to the public output folder). Structure:

```json
{
  "officialPage": { "url": "...", "factsExtracted": [ { "claim": "...", "verbatim": "..." } ] },
  "developerSearch": { "queries": [...], "findings": [ { "fact": "...", "source": "..." } ] },
  "architectSearch": { "lead": {...}, "local": {...}, "landscape": {...}, "interiors": {...} },
  "locationSearch": [ { "fact": "...", "source": "..." } ],
  "press": [ { "title": "...", "date": "...", "summary": "...", "sourceName": "...", "sourceUrl": "..." } ],
  "gaps": [ "specific things searched for and not found" ]
}
```

Every fact carries its source URL. Conflicts between sources are recorded as conflicts, not collapsed.

**HITL checkpoint:** the orchestrator presents the operator with a one-screen summary — number of sources consulted, number of facts captured per category, and the gap list. The operator may: approve, request specific additional searches, or stop. On approval, Phase 2 begins.

### Phase 2 — Synthesis (in orchestrator)

**Goal:** turn the raw evidence log into the structured factual sections of the brief, weighing source quality and resolving conflicts. Still no PDR voice; the output is plain factual prose and key-value data.

**Process the orchestrator runs:**
1. Resolve conflicts: official page > named press > aggregator portals. Note any unresolved conflict in `openQuestions`.
2. Populate `keyFacts` (the structured key/value array — see §7 for the canonical labels and order).
3. Populate `developerProfile` (legal entity, previous projects with delivery years, track record summary in plain prose, awards, known issues).
4. Populate `marketPosition` (price comparison vs comparable submarket stock, investment narrative or `null` if lifestyle, buyer segment, rental yield evidence, demand drivers).
5. Populate `designSignals` factual fields (architectural style, materials, landscaping, visual identity — what is published and where; image retrieval is out of scope).
6. Populate `pressReleases` (array of `{ title, date, summary, sourceName, sourceUrl }`). Headlines are reproduced as published; summaries are paraphrased (one to three sentences) but in neutral factual prose, not yet PDR voice.
7. For every field that cannot be sourced from the evidence log: set `null` and append a one-line entry to `openQuestions` of the form `"<field>: could not be sourced because <specific reason>"`.

**Output artifact:** `synthesis.json` — a partial brief containing the four factual sections and the running `openQuestions` list. No `editorialThesis`, no `whyStandsOut`, no `areaGuide`, no `typologyNote`, no `curationFlags` yet.

**HITL checkpoint:** operator reviews the structured facts. May correct any value, fill any `null` from their own knowledge, or send specific items back to Phase 1 for re-research. On approval, Phase 3 begins.

### Phase 3 — Editorial drafting (delegated to `pdr-voice`)

**Goal:** produce the voice-led editorial copy in both `en` and `pt`, drawing only from the approved synthesis. Not a re-research step.

**Subagent:** `pdr-voice`. Tools needed: `Read` (for `references/editorial-filter.md`, `references/voice-examples.md`, and the synthesis artifact). No web access — this prevents the subagent from drifting into research and keeps the voice constraints sharp.

**Process the subagent runs:**
1. Read the editorial filter and voice examples to calibrate.
2. Draft `editorialThesis.en` (60–100 words, one paragraph): why this project matters in PDR voice. Specific, considered, confident, understated. Names location precisely, describes what the project does architecturally or spatially, articulates who it is for. No marketing language.
3. Draft `editorialThesis.pt`: faithful translation in Portuguese editorial register (not literal). Preserve voice and specificity.
4. Draft `whyStandsOut.en` and `.pt`: three to five rich-text bullet points. Each bullet is a substantive, source-supported claim — not a marketing line.
5. Draft `areaGuide.en` and `.pt` (150–250 words each): location context written for an intelligent buyer. Names landmarks, streets, cultural references. Connects place to the buyer profile naturally.
6. Draft `typologyNote.en` and `.pt` (2–3 sentences each): what is available, the size range, what is selling, the delivery timeline.
7. Draft `designSignals.designAssessment` (one sentence): genuine editorial opinion — site-specific and coherent, or generic? Be direct. If design quality cannot be assessed (e.g. no published renders), state that explicitly.

**Hard rules the subagent enforces on itself:**
- No banned vocabulary (full list in `references/editorial-filter.md`): luxury, stunning, exclusive, world-class, best-in-class, incredible, don't miss, limited availability, investment of a lifetime — and any equivalents.
- No marketing language carried from the developer's own materials. All narrative is fresh paraphrase.
- The Portuguese version is editorial Portuguese, not a literal translation. Same meaning, same voice, idiomatic.
- If the synthesis lacks something needed for a bullet or paragraph, omit the bullet or shorten the paragraph rather than invent. Do not fabricate to hit a word count.

**Output artifact:** `editorial.json` — the seven drafted fields, each with `en` and `pt` (where applicable).

**HITL checkpoint:** operator reads both languages side by side. May edit any line. Particular attention to: voice fidelity, banned-word violations, PT translation quality, and whether the `designAssessment` reflects genuine evaluation or hedges. On approval, Phase 4 begins.

### Phase 4 — Curation judgment (in orchestrator)

**Goal:** apply the five PDR criteria to the assembled (synthesis + editorial) brief and produce a defensible recommendation.

**Process the orchestrator runs:**
1. For each of the five criteria — architectural quality, developer track record, location fundamentals, specification credibility, proposition authenticity — assign one of `Strong | Adequate | Weak | Unknown` with a one-sentence justification grounded in the evidence log and synthesis.
2. Check the auto-disqualifier list (active legal dispute; documented delivery failure; aspirational marketing without substance; pre-planning concept-only; generic high-volume resort with no design distinction). If any apply, the recommendation is forced to `Do not recommend`.
3. Check the deferral list (architect credit unconfirmed; no developer delivery history; pricing/typology/delivery date not establishable; developer non-cooperative). If any apply and no auto-disqualifier fired, the recommendation is `Insufficient information — defer`.
4. Otherwise, produce one of: `Recommend for inclusion` (all five at Strong/Adequate, no blocking gaps) or `Recommend with reservations` (meets threshold but `openQuestions` contains items that should be resolved before going live).
5. Consolidate the running `openQuestions` list — every `null` from Phase 2, every gap from Phase 1, plus image/brochure retrieval which is always present (it is out of scope for this skill).

**Output artifact:** `curationFlags.json` containing the five flag values + recommendation + final `openQuestions` array.

**HITL checkpoint:** operator reviews the recommendation logic. May override any flag (with reason recorded), re-run Phase 4 if synthesis was edited, or stop. On approval, Phase 5 runs.

### Phase 5 — CMS payload assembly (in orchestrator)

**Goal:** mechanical assembly of the final, Sanity-aligned JSON. No new content is generated here; this phase only composes prior artifacts into the canonical schema.

**Process the orchestrator runs:**
1. Compose the final object with the keys in §7 below, in that order.
2. Derive and include the slug.
3. Identify whether the developer and location already exist in PDR (check by name match against `docs/developments/*.json` and against current Sanity content if accessible). If new, include a `newEntities` block with the inputs for `developer` and/or `location` records (per §7.5 and §7.6).
4. Suggest `relatedDevelopments` (two to four candidates from existing PDR developments in the same submarket and similar price band) and `relatedArticles` (where natural; empty if none fit). These are suggestions only — the editorial lead confirms.
5. Write the file to `docs/pdr-research-output/<slug>.json` with 2-space indentation.
6. Print to the operator: the filename, the recommendation, the count of `openQuestions`, and a one-sentence summary of the strongest and weakest aspects of the development as assessed.

No HITL checkpoint after Phase 5 — the file is the deliverable. The editorial lead works from it directly.

---

## 5. Subagent specifications

### `web-research`

```
Role: investigative researcher for PDR. Cold, exhaustive, source-cited.
Tools: WebFetch, WebSearch, Read, Write (evidence log only).
Forbidden: editorial opinion, voice drafting, recommendation language.
Input: { name, url }
Output: evidence-log.json (schema in Phase 1 above)
Hard rules:
  - Always fetch the supplied URL in full before any web search.
  - Every fact carries a source URL.
  - Do not collapse conflicting facts — record them as conflicts.
  - Do not retrieve image files, PDFs, or social posts.
  - If a search returns nothing, record the query + null result in `gaps`.
```

### `pdr-voice`

```
Role: editorial writer for PDR, fluent in English and Portuguese.
Tools: Read (synthesis + reference files only). No web access.
Forbidden: research, fact-checking, recommendation drafting.
Input: synthesis.json + references/editorial-filter.md + references/voice-examples.md
Output: editorial.json (schema in Phase 3 above)
Hard rules:
  - Banned vocabulary list is enforced strictly in both languages.
  - No copied or lightly-edited brochure language.
  - PT is editorial Portuguese, not a literal en→pt mapping.
  - Omit rather than invent if synthesis lacks the supporting fact.
  - The `designAssessment` is opinion; if you cannot assess it from the synthesis alone (no published renders), say so explicitly.
```

---

## 6. Domain context the agents must embed

These are the calibration files that ship inside `references/`. Quoted here in full so the developer can drop them in verbatim — they are the editorial standards the agents enforce.

### 6.1 The PDR editorial filter

PDR is a curated editorial platform for new residential developments in Portugal, published by Viriato. The platform exists because Portugal's pipeline has grown faster than the market's capacity for consistent quality, and serious buyers cannot reliably tell premium from premium-presented. A development belongs on PDR if a discerning buyer — Portuguese HNWI, international investor, diaspora buyer, or affluent second-home seeker — would, on reading the presentation, conclude that PDR has done the work of separating substance from marketing on their behalf. **If the brief finds itself writing around a weakness, the project is not a fit.**

### 6.2 The five selection criteria

1. **Architectural quality and design coherence.** Design must be purposeful from brief to detail — form, materials, and spatial organisation consistent with the project's stated proposition. Facade-level architecture does not qualify.
2. **Developer track record and credibility.** Previous deliveries, financial standing, and how past buyers have been treated. Off-plan promises are evaluated against a delivery history.
3. **Location fundamentals and demand drivers.** Specific site assessment — immediate context, infrastructure, transport, medium-term factors. "Cascais" is a region; what matters is the street, the orientation, and the walk to the things that matter.
4. **Specification and delivery integrity.** Specification claims must be credible and proportionate to the price point, tested against the price per m² and the developer's prior spec.
5. **Authenticity of project proposition.** The story the project tells about itself must be coherent, honest, and supported by evidence.

### 6.3 Auto-disqualifiers (force `Do not recommend`)

- Active legal or regulatory dispute
- Documented delivery failure or buyer-fraud allegation against the developer
- Demonstrably aspirational marketing without underlying substance
- Pre-planning / concept-only stage with no licensable scheme
- Generic high-volume resort product with no design distinction or site-specific rationale

### 6.4 Deferral triggers (force `Insufficient information — defer`)

- Architect credit unconfirmed and unsourceable
- No previous deliveries evidenced for a developer making premium claims
- Pricing, typology, or delivery date not establishable from primary sources
- Developer unwilling to engage with the review process

### 6.5 Editorial hard rules

- No marketing language carried into narrative — paraphrase in PDR voice; `editorialThesis` and `areaGuide` are written fresh.
- No invented facts — if unverifiable, mark `null` and add to `openQuestions`.
- No secondary-portal facts without primary corroboration — pricing, delivery, and spec claims are sourced from the developer's own page or named press, with the source noted.
- `designAssessment` is editorial opinion, not developer self-description — be direct, be specific, and if you cannot independently assess design quality, say so.
- Red flags surface in `curationFlags`, not in private notes.

### 6.6 Banned vocabulary

`luxury`, `stunning`, `exclusive`, `world-class`, `best-in-class`, `incredible`, `don't miss`, `limited availability`, `investment of a lifetime`. The Portuguese equivalents are equally banned (`luxuoso`, `deslumbrante`, `exclusivo`, `imperdível`, `oportunidade única`, etc.). Full voice guide in `docs/branding/design-language.md` once it is restored.

### 6.7 Voice example (good vs bad)

- **Good:** "A low-density villa collection on the western ridge of Comporta, designed by Aires Mateus, that reads as an extension of the cork landscape rather than an imposition on it. For buyers seeking genuine remoteness without sacrificing specification, it represents an unusually coherent proposition."
- **Bad:** "Stunning luxury villas in the heart of Comporta with incredible views and exceptional investment potential — don't miss this exclusive opportunity."

The voice patterns and self-scan checklist in `references/voice-examples.md` are the only canonical voice reference. Prior briefs in `docs/developments/` reflect historical choices and are not used as calibration material.

---

## 7. CMS field mapping — the canonical output schema

The final JSON written to `docs/pdr-research-output/<slug>.json` mirrors the live Sanity development schema (`sanity/schemas/development.ts`). Every field below must be present in the output. Fields that could not be sourced are `null`, with a corresponding entry in `openQuestions`.

### Identification and references

- **`name`** — proper name, exact punctuation and accents
- **`slug`** — derived (lowercase, accent-stripped, hyphenated)
- **`location`** — `{ name, slug, isExisting: boolean }` referencing the location node. If `isExisting: false`, the full new-location payload appears in `newEntities.location` (§7.6).
- **`developer`** — `{ name, slug, isExisting: boolean }`. If new, full payload in `newEntities.developer` (§7.5).
- **`latitude`**, **`longitude`** — decimal degrees for the project itself

### Status, type, commercial framing

- **`status`** — one of `Off-plan`, `Under Construction`, `Completed`, `Selling Now`
- **`type`** — one of `Apartments`, `Villas`, `Townhouses`, `Penthouse`, `Mixed-use`, `Branded Residences`
- **`priceDisplay`** — one of `Price on Request`, `From €500k`, `From €750k`, `From €1M`, `From €2M`, `From €3M+` (suggested band only — editorial lead confirms)
- **`primaryCta`** — one of `Request Brochure`, `Register Interest`, `Download Investment Pack`, `Schedule Consultation`, `Speak with an Advisor`. Recommend based on what the developer can actually fulfil.
- **`isFeatured`** — always `false` from this skill; editorial lead decides

### Tagging

- **`lifestyleTags`** — subset of `Golf`, `Beachfront`, `Marina`, `City Centre`, `Countryside`, `Mountain`, `Historic Quarter`, `Spa & Wellness`, `Investment-grade`. Apply only tags the project genuinely earns. `Investment-grade` requires credible rental yield evidence.

### Imagery (assembled but not retrieved)

- **`heroImage`** — `{ sourceUrl, sourceLabel, altSuggestion }`. The skill identifies the strongest published image and surfaces the URL — it does not download. **Always also added to `openQuestions`** as: "Hero image to be retrieved by editorial lead under licence."
- **`gallery`** — array of `{ sourceUrl, sourceLabel, altSuggestion }`. Same retrieval rule.
- **`seoImage`** — `{ sourceUrl }` if a 1200×630-suitable OG image is published; else `null`.

### Editorial copy (Phase 3 output)

- **`editorialThesis`** — `{ en, pt }`, plain text, one paragraph, 60–100 words each
- **`whyStandsOut`** — `{ en, pt }`, array of 3–5 string bullets each
- **`areaGuide`** — `{ en, pt }`, plain text, 150–250 words each
- **`typologyNote`** — `{ en, pt }`, plain text, 2–3 sentences each

### Structured facts (Phase 2 output)

- **`keyFacts`** — array of `{ label, value }` in this order, omitting any whose value would be `null`:

  Location, Neighbourhood, Region, Type, Status, Units, Typology Mix, Price From, Price per m², Delivery, Lead Architect, Local Architect, Landscape Architect, Interior Designer, Amenities, Sustainability, Parking.

- **`developerProfile`** — `{ legalEntity, previousProjects, trackRecordSummary, awards, knownIssues }`
- **`marketPosition`** — `{ priceComparison, investmentNarrative, buyerSegment, rentalYieldEvidence, demandDrivers }`
- **`designSignals`** — `{ architecturalStyle, materials, landscaping, visualIdentity, designAssessment }`

### Relationships (suggestions only)

- **`relatedDevelopments`** — array of `{ slug, reason }` for two to four candidates
- **`relatedArticles`** — array of `{ slug, reason }`; empty if no natural fit

### Press

- **`pressReleases`** — array of `{ title, date, summary, sourceName, sourceUrl }`. Titles verbatim, summaries paraphrased.

### Brochure (out of scope for retrieval)

- **`brochure`** — `{ exists: boolean, sourceUrl, gated: boolean }` if a public brochure is identified; else `null`. **Always added to `openQuestions`** as: "Brochure to be retrieved and licence-checked by editorial lead."

### Publication and SEO

- **`publishedAt`** — always `null`; editorial lead sets at go-live
- **`seoTitle`** — drafted in format `{Project Name} — {Type} in {Location} | Portugal Developments Review`
- **`seoDescription`** — 150–160 character summary in PDR voice, fact-led
- **`noindex`** — always `true` from this skill

### Curation outputs (Phase 4)

- **`curationFlags`** — `{ locationQuality, designQuality, developerReputation, specificationCredibility, propositionAuthenticity, overallRecommendation, openQuestions }`. Each of the first five is `Strong | Adequate | Weak | Unknown` followed by a one-sentence justification. `overallRecommendation` is one of the four values in §6. `openQuestions` is the consolidated array of every gap.

### New-entity payloads

- **`newEntities`** — `{ developer?: {...}, location?: {...} }`. Omit either if the entity already exists on the platform.

#### 7.5 Developer payload (when developer is new)

`{ name, slug, logo: { sourceUrl } | null, description, shortDescription: { en, pt }, bio: { en, pt }, foundedYear, headquartersCity, website, isViriatoClient: null }`. The bio is 200–350 words, full editorial biography in PDR voice.

#### 7.6 Location payload (when location is new)

`{ name, slug, region (one of: Lisbon, Porto, Gaia, Cascais, Algarve, Comporta, Silver Coast, Madeira, Other), locationType (macro | neighbourhood | sub-region), parentLocation: { name, slug } | null, intro: { en, pt }, marketFraming: { en, pt }, nearbyLocations: [...], latitude, longitude, heroImage: { sourceUrl } | null }`.

---

## 8. Handling missing data — the inviolable rule

The skill never invents and never estimates without basis. For every field whose value cannot be sourced from primary or named-press evidence:

1. The field's value in the output JSON is `null`.
2. A one-line entry is appended to `openQuestions` of the form:

   `"<dot.path.to.field>: could not be sourced because <specific reason>. Source attempts: <list>."`

3. Image and brochure fields are **always** in `openQuestions` regardless — they are explicitly out of scope for this skill.

The operator (you, in practice) treats `openQuestions` as a personal action list and resolves each item before the editorial lead finalises the page.

---

## 9. HITL checkpoint UX

At each checkpoint the orchestrator prints to the operator a compact summary, not the full artifact. Format:

```
─── Phase N complete: <phase name> ───
<one-line summary of what was produced>
<key counts: e.g. "37 facts captured across 12 sources, 4 gaps">
<flags worth surfacing: e.g. "developer disputes search returned 0 results — confirm none exist">

[a] approve and continue   [e] edit artifact   [r] re-run this phase   [s] stop
[v] view full artifact
```

Editing an artifact returns the operator to the agent (orchestrator or subagent) with the operator's correction as additional input. Re-running a phase is allowed from any later phase (re-running Phase 2 invalidates Phases 3–5 and they re-execute on approval).

---

## 10. Acceptance tests

The developer should validate the skill against:

1. **Rich-data test:** the editorial lead supplies a candidate `name` + `url` with substantial public information (active developer page, multiple press articles, named architects). Expected behaviour: every required field populated or knowingly `null` with reason; `openQuestions` contains the standing image/brochure entries plus any genuine gaps; the output validates against the schema in `references/cms-schema.md`; HITL checkpoints surface meaningful summaries.
2. **Sparse-data test:** the editorial lead supplies a candidate with limited public information. Expected behaviour: most fields `null`, `openQuestions` populated with specific source-attempt notes, recommendation `Insufficient information — defer`.
3. **Voice-constraint test:** scan the final `editorialThesis`, `whyStandsOut`, `areaGuide`, and the developer `bio` (if generated) for any banned vocabulary in either language. Zero hits required.
4. **Idempotency:** re-running on an already-processed slug overwrites the file but produces a structurally identical result given identical evidence.
5. **HITL respect:** stopping at any checkpoint must leave a recoverable state — re-invoking the skill with the same inputs picks up at the last completed phase, not from scratch.

---

## 11. What this skill does not do

Out of scope, by design:

- **Image and brochure retrieval.** Surfaced as URLs in `openQuestions` for the editorial lead.
- **Sanity write access.** This skill writes only to the local file system. CMS ingestion is a separate concern.
- **Final recommendation authority.** The skill produces a recommendation; the editorial lead signs off on inclusion.
- **Translation review.** PT drafts are produced and surfaced for HITL but the editorial lead is the final arbiter on PT voice.
- **Ongoing monitoring.** This skill is single-shot per development. Quarterly re-checks and material-change re-reviews are a separate operational concern (and a candidate for a future scheduled job).

---

## 12. Reference materials for the implementer

- `sanity/schemas/development.ts` — the live CMS schema, single source of truth for §7
- `sanity/schemas/developer.ts` — schema for §7.5
- `sanity/schemas/location.ts` — schema for §7.6
- `docs/SKILLS/research-development.skill` — v1 of this skill, kept for reference; do not delete, do not import wholesale (its prompts mix the four reasoning modes that this v2 deliberately separates)
- `lib/i18n/en.json` → `methodology` — the public-facing methodology copy on `/methodology`, useful for tone calibration
- `docs/branding/design-language.md` — the editorial voice and banned vocabulary guide (currently being restored)

Questions on the architecture or scope go to the editorial lead before implementation begins. Once the skill is built, the editorial lead signs off on the acceptance tests in §10 before it is used to research a real candidate.

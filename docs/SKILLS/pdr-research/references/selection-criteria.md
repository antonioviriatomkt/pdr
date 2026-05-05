# PDR selection criteria — the five dimensions

Every candidate is assessed against the same five dimensions in Phase 4. Apply equally to Viriato clients and non-clients.

## 1. Architectural quality and design coherence

Design must be purposeful from brief to detail — form, materials, and spatial organisation consistent with the project's stated proposition. Facade-level architecture does not qualify. Look for evidence of a considered brief, not a marketed one.

**Strong signals:** internationally credible architect with a track record of considered work; site-specific design response; coherent material palette; collaboration with a competent local executive architect.

**Weak signals:** generic "contemporary" styling indistinguishable from a hundred others; render-only with no construction-stage evidence; architect uncredited or recently established with no portfolio.

## 2. Developer track record and credibility

Previous deliveries, financial standing, and how past buyers have been treated. Off-plan promises evaluated against a delivery history.

**Strong signals:** multiple prior projects delivered in Portugal on or near schedule; named banking/financial partner; consistent pattern of architectural quality across portfolio; absence of disputes or buyer complaints.

**Weak signals:** first project from a newly-formed entity with premium pricing; pattern of delays across prior deliveries; reported disputes; unclear ownership or financial structure.

## 3. Location fundamentals and demand drivers

Specific site assessment — immediate context, infrastructure, transport, medium-term factors that will sustain or erode demand. "Cascais" is a region; what matters is the street, the orientation, and the walk to the things that matter.

**Strong signals:** proven submarket with comparable transaction depth; clear infrastructure and transport access; structural demand drivers (education, employment, lifestyle amenity); orientation and aspect that support the price point.

**Weak signals:** speculative location with thin transaction history at the price point; car-dependent without compensating amenity; demand driver that is aspirational rather than evidenced.

## 4. Specification and delivery integrity

Specification claims must be credible and proportionate to the price point — tested against the price per m² and the developer's prior spec. Not against the brochure.

**Strong signals:** spec consistent with developer's prior delivered standard; sustainability certifications named with target level; published material schedule.

**Weak signals:** premium spec claims at mid-market price per m²; vague sustainability language ("eco-conscious", "thermally optimised") without certification; no material schedule.

## 5. Authenticity of project proposition

The story the project tells about itself must be coherent, honest, and supported by evidence. Aspirational claims without substance are excluded regardless of other strengths.

**Strong signals:** internal consistency between pricing, typology, location, and stated buyer profile; demand evidence drawn from real transactions or comparable projects; developer's pattern of architectural commissioning is evidenced, not claimed.

**Weak signals:** lifestyle imagery and language disconnected from the underlying product; demand claims unsupported by transaction data; "investment-grade" framing without rental yield evidence.

## Flag values

For each criterion, assign one of:

- **`Strong`** — clearly meets the standard; no reservations
- **`Adequate`** — meets the threshold; minor reservations recorded
- **`Weak`** — falls short; reservations are material
- **`Unknown`** — insufficient evidence to assess; treat as a deferral trigger

Each flag carries a one-sentence justification grounded in the evidence log.

## Recommendation logic

After flag assignment:

1. **Auto-disqualifier check** (see `editorial-filter.md`). If any apply → `Do not recommend`.
2. **Deferral check.** If any deferral trigger applies and no auto-disqualifier fired → `Insufficient information — defer`.
3. **Weak-flag check.** If any criterion is `Weak` → `Recommend with reservations` at best (often `Do not recommend` depending on the criterion).
4. **All Strong/Adequate, no blocking gaps** → `Recommend for inclusion`.
5. **All Strong/Adequate but `openQuestions` contains items that should be resolved before publication** → `Recommend with reservations`.

The four valid `overallRecommendation` values are exactly:

- `Recommend for inclusion`
- `Recommend with reservations`
- `Insufficient information — defer`
- `Do not recommend`

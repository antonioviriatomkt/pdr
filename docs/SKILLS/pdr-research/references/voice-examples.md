# Voice examples — calibration samples

The `pdr-voice` subagent reads this file at runtime to calibrate before drafting. The examples below are illustrative templates, not real PDR copy. They demonstrate the voice rules; treat them as patterns to match, not as paragraphs to imitate verbatim.

## `editorialThesis` — what the pattern looks like

A 60–100 word paragraph that does five things in roughly this order:

1. Names the project type and scale concretely (e.g. `"A 32-villa scheme"`, `"An 18-apartment penthouse-led building"`).
2. Names the architect partnership precisely — both lead and local executive, where they exist.
3. Places the project in nested geography — building, neighbourhood, city or region, distance to a recognisable landmark.
4. Characterises the developer through evidenced previous projects, not adjectives ("whose Lisbon portfolio includes X and Y" — not "an established luxury developer").
5. Names the buyer profile in concrete terms (e.g. "Portuguese families", "internationally mobile second-home buyers", "city-centre downsizers").

**Pattern (illustrative):**

> "A {n}-{type} scheme by {lead studio} and {local firm} on the {specific edge/quarter/ridge} of {neighbourhood}, {distance/route} from {recognisable centre}. {Developer}, whose Portuguese portfolio includes {project A} and {project B}, has paired an architect of {evidenced standing} with a site that {specific spatial or contextual claim}. The proposition targets {specific buyer profile} seeking {specific quality} within reach of {anchor}."

If a project's facts cannot be slotted into this pattern without inventing — e.g. the architect partnership is not credited, or the developer has no portfolio — the thesis must say so directly rather than dress around the gap.

**Anti-pattern:**

> "Stunning new luxury apartments in a world-class community on the outskirts of {city}. An incredible opportunity to invest in one of {country}'s most exclusive new developments by an internationally acclaimed architect. Don't miss this chance to own a piece of premium real estate."

Eight banned words in three sentences. Names nothing specific. Treats the buyer as a mark.

## `whyStandsOut` — what the bullets look like

Each bullet is one substantive, source-supported claim — not an adjective. A reader should be able to disagree with it on the basis of evidence, which means it has to assert something specific.

**Pattern (illustrative):**

- "{Studio}'s first Iberian residential commission, paired with {local firm} for site delivery and permitting."
- "Two prior {city} deliveries by {developer} — {project A} ({architect}, {year}) and {project B} ({year}) — both delivered as committed."
- "Sits within the {n}-hectare {estate name}, originally developed by the {parent group} of {comparable named estate}."
- "{Certification name} certified ({level}) with {specific named system, e.g. EV charging infrastructure}, on a master-planned estate that holds {other named accreditations}."

If the synthesis does not support five distinct claims of this calibre, write three. Do not pad.

**Anti-pattern:**

- "Premium architecture by a renowned studio."
- "Excellent location with great amenities."
- "Strong investment potential in a desirable area."

Each bullet is an adjective with no substance. Could apply to any project. Reader learns nothing.

## `areaGuide` — what the paragraph looks like

150–250 words. Location context written for an intelligent buyer. The paragraph should:

- Name at least one road, landmark, or comparable named place.
- Name the parent ownership or master-planner of the area where relevant (estates, master-planned communities, historic quarters).
- Be honest about trade-offs (car-dependent, limited resale depth, exposure to short-let cycles, etc.) where they exist.
- Connect place to demand without resorting to "exclusive" or "prestigious".
- Identify the buyer the place actually attracts, in concrete terms.

**Pattern (illustrative):**

> "{Neighbourhood} is a {character} of {scale} within {parent area}, developed originally by {parent group} — the same partnership behind {comparable named place}. It sits roughly {time/distance} {direction} of {recognisable centre} via {named route}, with {nearby anchor 1} within {time} and {nearby anchor 2} slightly {qualifier}. {Honest characterisation of trade-off}, it draws {specific buyer profile} who prioritise {specific qualities} over {specific alternatives}."

## Portuguese register — calibration

Portuguese editorial copy should read like `Público Imobiliário`, `Expresso`, or `Essential Business PT` — not like a portal listing. Same factual precision, lightly literary, never breathless.

**Good register pattern:**

> "Empreendimento de {n} {tipo} da autoria do gabinete {nacionalidade} {studio} e da {local firm}, integrado na {character} de {neighbourhood}, no {parent area}, a cerca de {tempo/distância} {direction} do centro de {city}."

**Bad register (avoid):**

> "Luxuoso e exclusivo empreendimento residencial numa das mais prestigiadas zonas dos arredores de {city} — uma oportunidade única e imperdível para quem procura o melhor."

Six banned-equivalent terms in one sentence. Empty.

## Self-scan checklist before returning

Before writing `editorial.json`, the subagent must check:

1. No banned vocabulary in `en` or `pt` (full list in `editorial-filter.md`).
2. Every claim in `whyStandsOut` is traceable to a fact in the synthesis. If not, drop the bullet.
3. `editorialThesis` names location, architect, and buyer in concrete terms.
4. `areaGuide` names at least one road, landmark, or comparable place.
5. `designAssessment` is a real opinion. If the synthesis says renders are unpublished, `designAssessment` says so directly.
6. PT is editorial Portuguese, not literal en→pt mapping. Same idea, idiomatic phrasing.

# CMS schema — the canonical output JSON

The final file written to `docs/pdr-research-output/<slug>.json` mirrors the live Sanity development schema (`sanity/schemas/development.ts`). Every field below must be present in the output. Fields that could not be sourced are `null`, with a corresponding entry in `openQuestions`.

## Top-level shape

```json
{
  "name": "string",
  "slug": "string",
  "location": { "name": "...", "slug": "...", "isExisting": true|false },
  "developer": { "name": "...", "slug": "...", "isExisting": true|false },
  "latitude": number | null,
  "longitude": number | null,

  "status": "Off-plan" | "Under Construction" | "Completed" | "Selling Now",
  "type": "Apartments" | "Villas" | "Townhouses" | "Penthouse" | "Mixed-use" | "Branded Residences",
  "priceDisplay": "Price on Request" | "From €500k" | "From €750k" | "From €1M" | "From €2M" | "From €3M+",
  "primaryCta": "Request Brochure" | "Register Interest" | "Download Investment Pack" | "Schedule Consultation" | "Speak with an Advisor",
  "isFeatured": false,

  "lifestyleTags": ["Golf" | "Beachfront" | "Marina" | "City Centre" | "Countryside" | "Mountain" | "Historic Quarter" | "Spa & Wellness" | "Investment-grade", ...],

  "heroImage": { "sourceUrl": "...", "sourceLabel": "...", "altSuggestion": "..." } | null,
  "gallery": [{ "sourceUrl": "...", "sourceLabel": "...", "altSuggestion": "..." }],
  "seoImage": { "sourceUrl": "..." } | null,

  "editorialThesis": { "en": "...", "pt": "..." },
  "whyStandsOut":    { "en": ["...", "..."], "pt": ["...", "..."] },
  "areaGuide":       { "en": "...", "pt": "..." },
  "typologyNote":    { "en": "...", "pt": "..." },

  "keyFacts": [{ "label": "...", "value": "..." }],
  "developerProfile": { "legalEntity": "...", "previousProjects": "...", "trackRecordSummary": "...", "awards": "...", "knownIssues": "..." },
  "marketPosition":   { "priceComparison": "...", "investmentNarrative": "...", "buyerSegment": "...", "rentalYieldEvidence": "...", "demandDrivers": "..." },
  "designSignals":    { "architecturalStyle": "...", "materials": "...", "landscaping": "...", "visualIdentity": "...", "designAssessment": { "en": "...", "pt": "..." } },

  "relatedDevelopments": [{ "slug": "...", "reason": "..." }],
  "relatedArticles":     [{ "slug": "...", "reason": "..." }],

  "pressReleases": [{ "title": "...", "date": "YYYY-MM-DD", "summary": "...", "sourceName": "...", "sourceUrl": "..." }],

  "brochure": { "exists": true|false, "sourceUrl": "...", "gated": true|false } | null,

  "publishedAt": null,
  "seoTitle": "string",
  "seoDescription": "string (150-160 chars)",
  "noindex": true,

  "curationFlags": {
    "locationQuality":          "Strong|Adequate|Weak|Unknown — one-sentence justification",
    "designQuality":            "Strong|Adequate|Weak|Unknown — one-sentence justification",
    "developerReputation":      "Strong|Adequate|Weak|Unknown — one-sentence justification",
    "specificationCredibility": "Strong|Adequate|Weak|Unknown — one-sentence justification",
    "propositionAuthenticity":  "Strong|Adequate|Weak|Unknown — one-sentence justification",
    "overallRecommendation":    "Recommend for inclusion | Recommend with reservations | Insufficient information — defer | Do not recommend",
    "openQuestions":            ["...", "..."]
  },

  "newEntities": {
    "developer": { ... } | undefined,
    "location":  { ... } | undefined
  }
}
```

## `keyFacts` — canonical labels and order

Render in this order, omitting any whose value would be `null`:

1. Location
2. Neighbourhood
3. Region
4. Type
5. Status
6. Units
7. Typology Mix
8. Price From
9. Price per m²
10. Delivery
11. Lead Architect
12. Local Architect
13. Landscape Architect
14. Interior Designer
15. Amenities
16. Sustainability
17. Parking

Values are sentence fragments, not paragraphs.

## `seoTitle` format

`{Project Name} — {Type} in {Location} | Portugal Developments Review`

## `seoDescription`

150–160 characters. PDR voice. Fact-led. No banned vocabulary.

## `openQuestions` — required entries

The array always includes, regardless of research outcome:

- `"Hero image: to be retrieved by editorial lead under licence. Source identified: <url>."`
- `"Gallery images: to be retrieved by editorial lead under licence. <n> sources identified."`
- `"Brochure: to be retrieved and licence-checked by editorial lead. Source: <url|none identified>."`

Plus one entry per `null` field, in the format:

`"<dot.path.to.field>: could not be sourced because <specific reason>. Source attempts: <list of queries or URLs tried>."`

## `newEntities.developer` payload (when developer is new to PDR)

Fields needed:

```json
{
  "name": "...",
  "slug": "...",
  "logo": { "sourceUrl": "..." } | null,
  "description": "internal-reference description, one paragraph",
  "shortDescription": { "en": "one line", "pt": "one line" },
  "bio": { "en": "200-350 words editorial biography", "pt": "200-350 words editorial biography" },
  "foundedYear": number | null,
  "headquartersCity": "...",
  "website": "https://...",
  "isViriatoClient": null
}
```

`isViriatoClient` is always `null` from the skill — the editorial lead sets it.

## `newEntities.location` payload (when location is new to PDR)

```json
{
  "name": "...",
  "slug": "...",
  "region": "Lisbon" | "Porto" | "Gaia" | "Cascais" | "Algarve" | "Comporta" | "Silver Coast" | "Madeira" | "Other",
  "locationType": "macro" | "neighbourhood" | "sub-region",
  "parentLocation": { "name": "...", "slug": "..." } | null,
  "intro": { "en": "short editorial intro paragraph", "pt": "..." },
  "marketFraming": { "en": "rich-text market and lifestyle framing", "pt": "..." },
  "nearbyLocations": [{ "name": "...", "slug": "..." }],
  "latitude": number | null,
  "longitude": number | null,
  "heroImage": { "sourceUrl": "..." } | null
}
```

## Existence checks

Before deciding `isExisting`:

- **Developer:** scan `docs/pdr-research-output/*.json` (v2 skill outputs only — excludes `.working/`) for any file where `developer.name` matches case-insensitively. If matched, `isExisting: true` and omit `newEntities.developer`.
- **Location:** same approach — scan for `location.name` matches. If matched, `isExisting: true` and omit `newEntities.location`.

Existence-check results are surfaced in the **Phase 4 HITL checkpoint** summary so the operator can override before Phase 5 assembly runs. There is no Phase 5 HITL. The operator's override at Phase 4 flows directly into the payload assembled in Phase 5.

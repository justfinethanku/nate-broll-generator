# Template Tool Calls

## Purpose

The model should not invent layouts or write TSX.

It should emit a structured template tool call.

The deterministic renderer should:

1. identify the template from the `template` field
2. validate the payload against the registered contract
3. reject bad inputs with a clear failure message
4. render the approved component

## Shared Contract

Every template tool must define:

1. `name`
2. `responsibility`
3. `use when`
4. `avoid when`
5. `input rules`
6. `side-effect profile`
7. `required permission level`
8. `execution owner`
9. `validator`
10. `renderer`
11. valid examples
12. invalid examples

Current execution policy:

- side-effect profile: `render-only`
- required permission level: `always-allow`
- execution owner: `deterministic-renderer`

## Current Tools

### `stack`

Use when:

- the idea is layered, hierarchical, or dependency-based
- a top layer sits on lower layers
- the point is hidden infrastructure or capstone capture

Avoid when:

- the idea is a side-by-side contrast
- the point is a timeline or sequence
- the idea needs more than 4 layers

Input shape:

```json
{
  "template": "stack",
  "title": "Stack Template",
  "subtitle": "three-layer stack",
  "bottomLabel": "The top layer depends on everything under it",
  "bottomAccent": "depends",
  "layers": [
    {
      "role": "Foundation",
      "label": "Open Protocol",
      "note": "shared standard",
      "color": "cyan"
    },
    {
      "role": "Product",
      "label": "Conway Layer",
      "note": "working surface",
      "color": "orange"
    },
    {
      "role": "Control",
      "label": "Defaults & Capture",
      "note": "lock-in layer",
      "color": "purple"
    }
  ]
}
```

Validation notes:

- 2 to 4 layers only
- role labels max out at 12 characters
- title and subtitle limits are geometry-aware, not only global
- color must be a supported token: `amber`, `cyan`, `green`, `orange`, `purple`, `red`, `steel`

### `comparison`

Use when:

- the idea is a two-sided contrast
- the point is before/after, rented/owned, or option A versus option B
- one side can optionally win

Avoid when:

- the point is layered or infrastructure-driven
- the point needs more than two sides
- the point is a timeline, loop, or gate

Input shape:

```json
{
  "template": "comparison",
  "title": "Comparison Template",
  "subtitle": "two-sided contrast",
  "bottomLabel": "Owning the relationship beats renting the feed",
  "bottomAccent": "Owning",
  "emphasis": "right",
  "centerLabel": "vs",
  "left": {
    "role": "Platform",
    "label": "Rented Reach",
    "note": "algorithm decides",
    "color": "orange"
  },
  "right": {
    "role": "Publisher",
    "label": "Owned Audience",
    "note": "direct connection",
    "color": "cyan"
  }
}
```

Validation notes:

- exactly two sides
- role labels max out at 12 characters
- title and subtitle limits are constrained by the inward-facing text columns
- `centerLabel` maxes out at 6 characters
- color must be a supported token: `amber`, `cyan`, `green`, `orange`, `purple`, `red`, `steel`

### Speed-run tools

The following tools are callable and validated, but have not had the same visual iteration as `stack` and `comparison`:

- `sequence`: ordered workflows with 3 to 4 steps
- `gate`: input, gate/decision, output
- `surface`: dominant visible surface with 2 to 3 supports
- `loop`: reinforcing cycle with 3 to 4 steps
- `progression`: staged growth with 3 to 5 stages
- `formula`: 2 to 3 input terms combining into a result
- `allocation`: 2 to 4 weighted segments

All use the same short text limits:

- role: 12 characters max
- label: 22 characters max
- note: 20 characters max
- color: `amber`, `cyan`, `green`, `orange`, `purple`, `red`, or `steel`

## Implementation

Current registry and callable helpers live in:

- [templateToolRegistry.tsx](../remotion/src/broll/templates/templateToolRegistry.tsx)
- [StackTemplate.tsx](../remotion/src/broll/templates/StackTemplate.tsx)
- [ComparisonTemplate.tsx](../remotion/src/broll/templates/ComparisonTemplate.tsx)
- [UtilityTemplates.tsx](../remotion/src/broll/templates/UtilityTemplates.tsx)

## Rule Going Forward

Every new template must ship with:

1. the visual component
2. the motion
3. the callable tool spec
4. the registry entry
5. valid and invalid examples

If a template does not have all five, it is not done.

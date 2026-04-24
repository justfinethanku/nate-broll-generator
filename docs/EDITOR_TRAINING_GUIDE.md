# Editor Training Guide

## Goal

Train the editor to validate the automated b-roll workflow without designing graphics or authoring template calls.

The AI's job is to:

1. pick the right moment
2. pick the right approved template
3. fill short, clear text slots
4. render mandatory QC stills
5. render clips after validation passes

The editor's job is to:

1. review the AI's rendered previews and final clips
2. approve, reject, or request a targeted revision
3. catch editorial misses that deterministic validation cannot judge

Codex and Remotion handle layout, spacing, animation, validation, and rendering.

## 90-Minute Handoff Plan

### 0-10 Minutes: Mental Model

Explain the current rule:

> We are not making decorative diagrams. We are turning transcript moments into reusable information graphics.

The model should output structured template calls, not custom TSX. The editor validates the result; the editor does not build the graphics.

### 10-25 Minutes: Approved Template Menu

Show the approved previews:

- [Stack 2-layer preview](../remotion/out/template-previews/TPL-STACK-2-DEMO-f180.png)
- [Stack 3-layer preview](../remotion/out/template-previews/TPL-STACK-DEMO-f180.png)
- [Stack 4-layer preview](../remotion/out/template-previews/TPL-STACK-4-DEMO-f180.png)
- [Comparison preview](../remotion/out/template-previews/TPL-COMPARISON-DEMO-f180.png)

Current callable template classes:

- `stack`: layered systems, hierarchy, dependency, infrastructure, capture layers
- `comparison`: two-sided contrast, before/after, rented/owned, option A vs option B
- `sequence`: ordered steps, workflows, pipelines, cause-and-effect chains
- `gate`: access, filtering, approvals, default paths, routing decisions
- `surface`: visible product/work surface shaped by a few supports
- `loop`: reinforcing cycles, flywheels, compounding feedback
- `progression`: maturity, growth, intensity, or level changes
- `formula`: concept equation where inputs combine into an outcome
- `allocation`: weighted split, balance, resource allocation, tradeoff

`stack` and `comparison` are the most visually reviewed. The remaining templates are speed-run assets: usable, callable, and validated, but they should get a quick human look before being treated as fully polished.

### 25-45 Minutes: How To Judge Template Selection

The editor is not responsible for choosing templates from scratch. They need this decision rule so they can spot AI mistakes:

- If the point is "this sits on top of that", use `stack`.
- If the point is "this versus that", use `comparison`.
- If the point is "first this, then that", use `sequence`.
- If the point is about access or filtering, use `gate`.
- If the point is cyclic, use `loop`.
- If the point is growth or maturity, use `progression`.
- If the point is a combination of inputs, use `formula`.
- If the point is weighted tradeoff, use `allocation`.
- If the point needs arrows, they should only appear in `sequence`, `gate`, or `loop`.
- If the point is just a vibe, reject it. B-roll should convey information.

Good b-roll moments usually contain one clear claim:

- "Open protocols become the foundation."
- "Platforms rent attention; publishers own relationships."
- "Defaults are where lock-in happens."

Bad b-roll moments are vague:

- "AI is changing everything."
- "This is really important."
- "The future is coming fast."

### 45-60 Minutes: What The AI Is Producing

The editor does not need to write these by hand during normal operation. They should understand the slot structure so feedback can be precise.

`stack` slots:

```json
{
  "template": "stack",
  "title": "Stack Template",
  "subtitle": "three-layer stack",
  "bottomLabel": "The top layer depends on the layers beneath it",
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
      "label": "Workflow Layer",
      "note": "daily interface",
      "color": "orange"
    },
    {
      "role": "Control",
      "label": "Capture Core",
      "note": "lock-in layer",
      "color": "purple"
    }
  ]
}
```

`comparison` slots:

```json
{
  "template": "comparison",
  "title": "Comparison Template",
  "subtitle": "two-sided contrast",
  "bottomLabel": "Owning the relationship beats renting the feed",
  "bottomAccent": "Owning",
  "centerLabel": "vs",
  "emphasis": "right",
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

The exact implementation contract lives in [TEMPLATE_TOOL_CALLS.md](TEMPLATE_TOOL_CALLS.md).

### 60-75 Minutes: Review Rules

Hard reject a graphic if:

- the text is clipped, touching a border, or visibly cramped
- the template does not match the idea
- it is decorative instead of informative
- it uses arrows inside `stack` or `comparison`
- it contains more than one main idea
- it uses long labels that feel like sentences
- it uses a custom layout instead of an approved template call

Accept a graphic only if:

- the viewer can understand it in under two seconds
- the visual structure matches the spoken idea
- the words are short enough to read at video speed
- the graphic feels like it adds information, not just motion

QA should judge strength and editorial usefulness. Geometry failures should be blocked before QA by template validation.

### 75-90 Minutes: Supervised Validation Practice

Have the editor do one practice pass:

1. inspect one AI-selected b-roll moment
2. inspect the rendered still or clip
3. decide whether the selected template matches the spoken idea
4. decide whether the slot text is clear enough at video speed
5. approve, reject, or request a specific revision

Use this feedback format:

```text
Reject this clip. The idea is [reason]. This should be [stack/comparison/skip/needs unbuilt template], because [one sentence]. Revise with shorter labels or choose a different moment.
```

## Current Commands

Run TypeScript validation:

```bash
cd "remotion"
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec tsc --noEmit
```

Render a still preview:

```bash
cd "remotion"
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec remotion still src/index.ts 'TPL-COMPARISON-DEMO' out/template-previews/TPL-COMPARISON-DEMO-f180.png --frame=180
```

Render a motion preview:

```bash
cd "remotion"
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec remotion render src/index.ts 'TPL-COMPARISON-DEMO' out/template-previews/TPL-COMPARISON-DEMO.mp4 --codec h264 --crf 23 --muted
```

Do not render multiple Remotion clips in parallel. Chrome conflicts.

## Editor Boundaries

The editor can:

- write shorter labels
- review previews
- reject weak graphics
- request a targeted revision
- approve the rendered b-roll set before compositing

The editor should not:

- edit `shared.tsx`
- invent new template geometry
- bring back arrows unless the template explicitly allows them
- accept a graphic just because it rendered
- manually author the b-roll plan unless the automation failed
- fix broken layout in QA instead of rejecting the output

## What To Say When Something Fails

Useful feedback:

- "This should be a comparison, not a stack."
- "The title is too long. Reduce it to 2-3 words."
- "This is decorative. Skip it unless we can express a real claim."
- "The lower card is cramped. Use a shorter label."
- "This needs a different template class. Reclassify it."

Unhelpful feedback:

- "Make it cooler."
- "Add motion."
- "Try arrows."
- "Make it more AI."

## The Big Rule

If the graphic does not make the video clearer, cut it.

The intended finished workflow is automated up to the approval gate. The editor is the human validation layer, not the graphics operator.

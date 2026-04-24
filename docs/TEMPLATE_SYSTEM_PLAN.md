# Template System Plan

## Goal

Replace bespoke per-clip diagram generation with a small set of reusable information-design templates.

The model should only:

1. classify the moment
2. choose a template tool
3. fill structured slots

The renderer should handle layout, animation, spacing, typography, and validation deterministically.

## Core Template Classes

1. `Comparison`
2. `Sequence`
3. `Loop`
4. `Stack`
5. `Surface`
6. `Gate`
7. `Formula`
8. `Progression`
9. `Allocation`

## Rules

- Arrows are only allowed in `Sequence`, `Loop`, and `Gate`.
- Text must live inside designed text areas with fixed padding.
- No free-floating box graphs as a default pattern.
- Each template has a locked element count and slot structure.
- QA should judge clarity and strength, not border collisions or overflow.

## Daily Pipeline

1. Scout reads a transcript moment.
2. Scout outputs:
   - `claim`
   - `template_class`
   - `slots`
   - `keywords`
   - `confidence`
3. Builder outputs a structured template tool call, not custom TSX.
4. Deterministic renderer validates the tool call against the registered template contract.
5. If validation passes, the renderer turns the call into animation using a prebuilt template.
5. QA checks:
   - is the chosen template correct?
   - does the graphic communicate the point?
   - is it strong enough to keep?

## Iterative Build Process

We will build this system one template at a time.

For each template:

1. build the reusable component
2. create a preview composition
3. review the preview
4. revise until approved
5. define the tool-call contract
6. register the template in the callable registry
7. add valid and invalid examples
8. move to the next template

## Template Completion Rule

A template is not finished when the visual looks right.

A template is finished only when all of the following exist:

1. approved reusable component
2. approved preview
3. callable tool spec with `use when` and `do not use when`
4. typed input contract
5. deterministic validation
6. registry entry
7. good and bad examples

## Build Status

1. `Stack` - visually reviewed and callable
2. `Comparison` - visually reviewed and callable
3. `Sequence` - speed-run callable asset
4. `Gate` - speed-run callable asset
5. `Surface` - speed-run callable asset
6. `Loop` - speed-run callable asset
7. `Progression` - speed-run callable asset
8. `Formula` - speed-run callable asset
9. `Allocation` - speed-run callable asset

Speed-run assets are usable for automation, but should receive a quick visual pass before being considered fully polished.

## Why Start With Stack

- It is broadly reusable.
- It removes the need for pointless arrows.
- It covers hidden-layer, capstone, and protocol/product/control concepts.
- It forces clean hierarchy and ordering.

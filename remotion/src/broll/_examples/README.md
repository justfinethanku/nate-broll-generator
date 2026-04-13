# Example B-Roll Components

These are production components from actual Nate Jones Media videos. Study them to understand the patterns the builder agents use.

## AG_ClipsA.tsx — Apple Intelligence Video

7 clips demonstrating:
- **Zone-relative sizing:** All dimensions use `zone.width`, `zone.height`, `zone.scale`
- **Animation timing:** Scene-relative frames (`Math.max(0, frame - 90)`)
- **Logo usage:** `staticFile("logos/apple.svg")` with brightness/invert filter
- **Staggered animations:** `stagger(index, baseDelay, gap)`
- **Counter animations:** `countUp(frame, start, end, target)`
- **Pulsing effects:** `pulse(frame, rate)`
- **Z-index discipline:** Lines/rings at 0, containers at 1, text at 10

## Key Patterns

```typescript
// ClipSpec type — every clip follows this shape
type ClipSpec = {
  id: string;                // Unique composition ID
  title: string;             // Title card text
  subtitle?: string;         // Optional subtitle
  bottomLabel: string;       // Bottom pill text
  bottomAccent?: string;     // Highlighted word in bottom pill
  render: (frame: number, fps: number, zone: GfxZone) => React.ReactNode;
};

// makeClip factory — wraps each spec in BRollTemplate
const makeClip = (spec: ClipSpec): React.FC => { ... };

// Export array for Root.tsx registration
export const XX_CLIPS_A = clipSpecs.map(spec => ({
  id: spec.id,
  component: makeClip(spec),
}));
```

## Important

You do NOT need to copy these patterns manually. The builder agents have the full API contract and golden reference embedded in their instructions. These examples are here for human reference only.

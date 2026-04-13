import React from "react";
import { Composition } from "remotion";

// ─── HOW TO ADD A NEW VIDEO ───────────────────────────────────
// 1. The builder agent creates batch files: XX_ClipsA.tsx, XX_ClipsB.tsx, etc.
// 2. The builder creates an aggregator: XXBatch.tsx
// 3. Add ONE import and ONE spread below:
//
//    import { XX_COMPS } from "./broll/XXBatch";
//    ...XX_COMPS,   ← inside BROLL_COMPS array
// ──────────────────────────────────────────────────────────────

// Example batch (reference — remove when adding your first real video)
import { AG_CLIPS_A } from "./broll/_examples/AG_ClipsA";

// ↓ Import new video batches here
// import { XX_COMPS } from "./broll/XXBatch";

const BROLL_COMPS = [
  ...AG_CLIPS_A, // Example — remove when adding your first real video
  // ...XX_COMPS,  ← add new batches here (one line per video)
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {BROLL_COMPS.map(({ id, component }) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
    </>
  );
};

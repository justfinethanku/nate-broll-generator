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
import { CCL_COMPS } from "./broll/CCLBatch";
import { SS_COMPS } from "./broll/SSBatch";
import { TEMPLATE_DEMOS } from "./broll/TemplateDemos";
import { AP_COMPS } from "./broll/APBatch";
import { AF_COMPS } from "./broll/AFBatch";
import { BYOC_COMPS } from "./broll/BYOCBatch";
import { AIA_COMPS } from "./broll/AIABatch";
import { NK_COMPS } from "./broll/NKBatch";
import { WM_COMPS } from "./broll/WMBatch";
import { OP_COMPS } from "./broll/OPBatch";
import { CD_COMPS } from "./broll/CDBatch";
import { TW_COMPS } from "./broll/TWBatch";
import { CC_COMPS } from "./broll/CCBatch";
import { IP_COMPS } from "./broll/IPBatch";

// ↓ Import new video batches here
// import { XX_COMPS } from "./broll/XXBatch";

type ClipEntry = {
  id: string;
  component: React.FC;
  durationInFrames?: number;
};

const BROLL_COMPS: ClipEntry[] = [
  ...AG_CLIPS_A, // Example — remove when adding your first real video
  ...CCL_COMPS,
  ...SS_COMPS,
  ...TEMPLATE_DEMOS,
  ...AP_COMPS,
  ...AF_COMPS,
  ...BYOC_COMPS,
  ...AIA_COMPS,
  ...NK_COMPS,
  ...WM_COMPS,
  ...OP_COMPS,
  ...CD_COMPS,
  ...TW_COMPS,
  ...CC_COMPS,
  ...IP_COMPS,
  // ...XX_COMPS,  ← add new batches here (one line per video)
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {BROLL_COMPS.map(({ id, component, durationInFrames }) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={durationInFrames ?? 300}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
    </>
  );
};

import React from "react";
import type { GfxZone } from "../shared";
import {
  ComparisonTemplateCall,
  renderComparisonTemplateCall,
  validateComparisonTemplateCall,
} from "./ComparisonTemplate";
import {
  renderStackTemplateCall,
  StackTemplateCall,
  validateStackTemplateCall,
} from "./StackTemplate";
import {
  AllocationTemplateCall,
  FormulaTemplateCall,
  GateTemplateCall,
  LoopTemplateCall,
  ProgressionTemplateCall,
  renderAllocationTemplateCall,
  renderFormulaTemplateCall,
  renderGateTemplateCall,
  renderLoopTemplateCall,
  renderProgressionTemplateCall,
  renderSequenceTemplateCall,
  renderSurfaceTemplateCall,
  SequenceTemplateCall,
  SurfaceTemplateCall,
  validateAllocationTemplateCall,
  validateFormulaTemplateCall,
  validateGateTemplateCall,
  validateLoopTemplateCall,
  validateProgressionTemplateCall,
  validateSequenceTemplateCall,
  validateSurfaceTemplateCall,
} from "./UtilityTemplates";

export type TemplateToolName =
  | "stack"
  | "comparison"
  | "sequence"
  | "gate"
  | "surface"
  | "loop"
  | "progression"
  | "formula"
  | "allocation";

export type TemplateToolCall =
  | StackTemplateCall
  | ComparisonTemplateCall
  | SequenceTemplateCall
  | GateTemplateCall
  | SurfaceTemplateCall
  | LoopTemplateCall
  | ProgressionTemplateCall
  | FormulaTemplateCall
  | AllocationTemplateCall;

type TemplateFieldRule = {
  field: string;
  requirement: string;
};

type TemplateToolExample<TCall extends TemplateToolCall> = {
  label: string;
  call: TCall;
};

type InvalidTemplateToolExample = {
  label: string;
  reason: string;
};

export type TemplateToolSpec<TCall extends TemplateToolCall> = {
  name: TCall["template"];
  responsibility: string;
  useWhen: string[];
  avoidWhen: string[];
  sideEffectProfile: "render-only";
  requiredPermissionLevel: "always-allow";
  executionOwner: "deterministic-renderer";
  inputRules: TemplateFieldRule[];
  validate: (call: TCall, zone?: GfxZone) => void;
  render: (call: TCall) => React.ReactElement;
  examples: {
    valid: TemplateToolExample<TCall>[];
    invalid: InvalidTemplateToolExample[];
  };
};

const COLOR_RULE =
  'Semantic color token. Use one of: "cyan", "orange", "green", "purple", "steel", "amber", "red".';

const baseItemRules = (prefix: string): TemplateFieldRule[] => [
  {
    field: `${prefix}.role`,
    requirement: "Optional short uppercase-style role label, 12 characters max.",
  },
  {
    field: `${prefix}.label`,
    requirement: "Required short display label, 22 characters max.",
  },
  {
    field: `${prefix}.note`,
    requirement: "Optional subtitle, 20 characters max.",
  },
  {
    field: `${prefix}.color`,
    requirement: COLOR_RULE,
  },
];

export const STACK_TOOL_EXAMPLES: StackTemplateCall[] = [
  {
    template: "stack",
    title: "Stack Template",
    subtitle: "three-layer stack",
    bottomLabel: "The top layer depends on everything under it",
    bottomAccent: "depends",
    layers: [
      {
        role: "Foundation",
        label: "Open Protocol",
        note: "shared standard",
        color: "cyan",
      },
      {
        role: "Product",
        label: "Conway Layer",
        note: "working surface",
        color: "orange",
      },
      {
        role: "Control",
        label: "Defaults & Capture",
        note: "lock-in layer",
        color: "purple",
      },
    ],
  },
  {
    template: "stack",
    title: "Stack Template",
    subtitle: "four-layer stack",
    bottomLabel: "Control is downstream from every lower layer",
    bottomAccent: "Control",
    layers: [
      {
        role: "Foundation",
        label: "Open Protocol",
        note: "shared standard",
        color: "cyan",
      },
      {
        role: "Data",
        label: "Common Records",
        note: "portable context",
        color: "green",
      },
      {
        role: "Product",
        label: "Workflow Layer",
        note: "daily interface",
        color: "orange",
      },
      {
        role: "Control",
        label: "Capture Core",
        note: "lock-in layer",
        color: "purple",
      },
    ],
  },
];

export const COMPARISON_TOOL_EXAMPLES: ComparisonTemplateCall[] = [
  {
    template: "comparison",
    title: "Comparison Template",
    subtitle: "two-sided contrast",
    bottomLabel: "Owning the relationship beats renting the feed",
    bottomAccent: "Owning",
    emphasis: "right",
    centerLabel: "vs",
    left: {
      role: "Platform",
      label: "Rented Reach",
      note: "algorithm decides",
      color: "orange",
    },
    right: {
      role: "Publisher",
      label: "Owned Audience",
      note: "direct connection",
      color: "cyan",
    },
  },
];

export const SEQUENCE_TOOL_EXAMPLES: SequenceTemplateCall[] = [
  {
    template: "sequence",
    title: "Sequence Template",
    subtitle: "ordered steps",
    bottomLabel: "Each step changes what the next step can do",
    bottomAccent: "next step",
    steps: [
      { role: "Step 1", label: "Capture", note: "raw signal", color: "steel" },
      { role: "Step 2", label: "Structure", note: "shared record", color: "cyan" },
      { role: "Step 3", label: "Publish", note: "usable output", color: "green" },
    ],
  },
];

export const GATE_TOOL_EXAMPLES: GateTemplateCall[] = [
  {
    template: "gate",
    title: "Gate Template",
    subtitle: "access or filtering",
    bottomLabel: "The gate decides what reaches the user",
    bottomAccent: "gate",
    before: { role: "Input", label: "Open Signal", note: "many sources", color: "steel" },
    gate: { role: "Gate", label: "Default Path", note: "sets access", color: "amber" },
    after: { role: "Output", label: "User Choice", note: "limited menu", color: "cyan" },
  },
];

export const SURFACE_TOOL_EXAMPLES: SurfaceTemplateCall[] = [
  {
    template: "surface",
    title: "Surface Template",
    subtitle: "visible layer",
    bottomLabel: "The visible surface is where behavior changes",
    bottomAccent: "surface",
    surface: { role: "Surface", label: "Creator App", note: "daily workspace", color: "cyan" },
    supports: [
      { role: "Data", label: "Records", note: "context", color: "green" },
      { role: "Rules", label: "Defaults", note: "capture", color: "purple" },
      { role: "Reach", label: "Channels", note: "distribution", color: "orange" },
    ],
  },
];

export const LOOP_TOOL_EXAMPLES: LoopTemplateCall[] = [
  {
    template: "loop",
    title: "Loop Template",
    subtitle: "reinforcing cycle",
    bottomLabel: "The loop compounds when each pass feeds the next",
    bottomAccent: "loop",
    center: "flywheel",
    steps: [
      { role: "Create", label: "Post", note: "new signal", color: "cyan" },
      { role: "Learn", label: "Feedback", note: "audience data", color: "green" },
      { role: "Refine", label: "Improve", note: "better fit", color: "amber" },
      { role: "Return", label: "Repeat", note: "compound", color: "purple" },
    ],
  },
];

export const PROGRESSION_TOOL_EXAMPLES: ProgressionTemplateCall[] = [
  {
    template: "progression",
    title: "Progression Template",
    subtitle: "staged maturity",
    bottomLabel: "The system becomes more valuable as it matures",
    bottomAccent: "more valuable",
    stages: [
      { role: "Base", label: "Manual", note: "hands-on", color: "steel" },
      { role: "Middle", label: "Assisted", note: "guided", color: "cyan" },
      { role: "High", label: "Autonomous", note: "daily run", color: "green" },
    ],
  },
];

export const FORMULA_TOOL_EXAMPLES: FormulaTemplateCall[] = [
  {
    template: "formula",
    title: "Formula Template",
    subtitle: "concept equation",
    bottomLabel: "The outcome depends on the combination, not one part",
    bottomAccent: "combination",
    terms: [
      { label: "Content", note: "asset", color: "cyan", operator: "+" },
      { label: "Context", note: "memory", color: "green", operator: "+" },
      { label: "Timing", note: "moment", color: "amber" },
    ],
    result: { label: "Leverage", note: "effect", color: "orange" },
  },
];

export const ALLOCATION_TOOL_EXAMPLES: AllocationTemplateCall[] = [
  {
    template: "allocation",
    title: "Allocation Template",
    subtitle: "weighted split",
    bottomLabel: "Allocation makes the tradeoff visible",
    bottomAccent: "tradeoff",
    segments: [
      { role: "Build", label: "Product", note: "owned", color: "cyan", weight: 45 },
      { role: "Grow", label: "Audience", note: "reach", color: "green", weight: 35 },
      { role: "Rent", label: "Platform", note: "risk", color: "orange", weight: 20 },
    ],
  },
];

type TemplateToolSpecMap = {
  stack: TemplateToolSpec<StackTemplateCall>;
  comparison: TemplateToolSpec<ComparisonTemplateCall>;
  sequence: TemplateToolSpec<SequenceTemplateCall>;
  gate: TemplateToolSpec<GateTemplateCall>;
  surface: TemplateToolSpec<SurfaceTemplateCall>;
  loop: TemplateToolSpec<LoopTemplateCall>;
  progression: TemplateToolSpec<ProgressionTemplateCall>;
  formula: TemplateToolSpec<FormulaTemplateCall>;
  allocation: TemplateToolSpec<AllocationTemplateCall>;
};

export const TEMPLATE_TOOL_SPECS: TemplateToolSpecMap = {
  stack: {
    name: "stack",
    responsibility:
      "Render layered systems, hidden infrastructure, and capstone relationships as a bottom-up stack.",
    useWhen: [
      "The idea is about layers, hierarchy, dependency, or infrastructure beneath a visible surface.",
      "A top layer depends on lower layers or one layer captures value from another.",
      "You need 2 to 4 ordered layers and almost no arrows.",
    ],
    avoidWhen: [
      "The idea is a side-by-side contrast with two opposing states.",
      "The idea is a timeline, loop, gate, or explicit sequence.",
      "You need more than 4 layers or labels too long for card widths.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "stack".' },
      { field: "layers", requirement: "Required array with 2 to 4 layers in top-to-bottom visual order." },
      ...baseItemRules("layers[]"),
    ],
    validate: validateStackTemplateCall,
    render: renderStackTemplateCall,
    examples: {
      valid: [
        { label: "Three-layer protocol/product/control stack", call: STACK_TOOL_EXAMPLES[0] },
        { label: "Four-layer foundation/data/product/control stack", call: STACK_TOOL_EXAMPLES[1] },
      ],
      invalid: [
        { label: "Five-layer stack", reason: "Rejected because Stack supports only 2 to 4 layers." },
        {
          label: "Bottom layer title too long for narrow 4-stack card",
          reason: "Rejected by geometry-aware validation even if global character count looks acceptable.",
        },
      ],
    },
  },
  comparison: {
    name: "comparison",
    responsibility:
      "Render a two-sided contrast with inward-facing text columns and a shared center label.",
    useWhen: [
      "The idea is left-vs-right, before-vs-after, rented-vs-owned, or one option clearly beating another.",
      "You need two opposing states with one clear headline per side.",
      "You want one optional winning side without arrows or diagram clutter.",
    ],
    avoidWhen: [
      "The idea is layered, hierarchical, or infrastructure-driven.",
      "The idea needs more than two sides or a branching path.",
      "You need an actual timeline or sequence instead of a contrast.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "comparison".' },
      ...baseItemRules("left/right"),
      { field: "centerLabel", requirement: "Optional. Keep it very short; 6 characters max." },
    ],
    validate: validateComparisonTemplateCall,
    render: renderComparisonTemplateCall,
    examples: {
      valid: [{ label: "Platform reach versus owned audience", call: COMPARISON_TOOL_EXAMPLES[0] }],
      invalid: [
        {
          label: "Long right-side title that exceeds the inward column width",
          reason: "Rejected because Comparison columns have a fixed inner anchor and max width.",
        },
        { label: "Three-way comparison", reason: "Rejected because Comparison supports exactly two sides." },
      ],
    },
  },
  sequence: {
    name: "sequence",
    responsibility: "Render a short ordered process with directional arrows that actually do work.",
    useWhen: [
      "The idea is first-this-then-that.",
      "The point is a process, pipeline, ordered workflow, or chain of events.",
      "You need 3 to 4 short steps.",
    ],
    avoidWhen: [
      "The idea is a hierarchy or stack.",
      "The idea is a two-sided contrast.",
      "The arrows would only be decoration.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "sequence".' },
      { field: "steps", requirement: "Required array with 3 to 4 steps in left-to-right order." },
      ...baseItemRules("steps[]"),
    ],
    validate: validateSequenceTemplateCall,
    render: renderSequenceTemplateCall,
    examples: {
      valid: [{ label: "Capture to structure to publish", call: SEQUENCE_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Two-step sequence", reason: "Rejected because Sequence needs 3 to 4 steps." },
        { label: "Layered dependency", reason: "Use Stack instead." },
      ],
    },
  },
  gate: {
    name: "gate",
    responsibility: "Render access, filtering, or permission as input flowing through a central gate.",
    useWhen: [
      "The idea is blocked, allowed, filtered, reviewed, approved, or routed.",
      "A decision point changes what comes out the other side.",
      "The middle condition is the main idea.",
    ],
    avoidWhen: [
      "Nothing is being filtered or decided.",
      "The idea is only a normal process sequence.",
      "The idea is a hierarchy with no access point.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "gate".' },
      ...baseItemRules("before"),
      ...baseItemRules("gate"),
      ...baseItemRules("after"),
    ],
    validate: validateGateTemplateCall,
    render: renderGateTemplateCall,
    examples: {
      valid: [{ label: "Open signal through default path to limited choice", call: GATE_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Plain comparison", reason: "Use Comparison instead." },
        { label: "Four-step timeline", reason: "Use Sequence instead." },
      ],
    },
  },
  surface: {
    name: "surface",
    responsibility: "Render the visible product/work surface with two or three supporting forces beneath it.",
    useWhen: [
      "The idea is about what the user sees or touches.",
      "A visible layer is shaped by a few supporting forces.",
      "You need one dominant surface plus 2 to 3 supports.",
    ],
    avoidWhen: [
      "The idea is a full hierarchy with many layers.",
      "The point is side-by-side contrast.",
      "The point requires directional flow.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "surface".' },
      ...baseItemRules("surface"),
      { field: "supports", requirement: "Required array with 2 to 3 support items." },
      ...baseItemRules("supports[]"),
    ],
    validate: validateSurfaceTemplateCall,
    render: renderSurfaceTemplateCall,
    examples: {
      valid: [{ label: "Creator app surface over data/defaults/channels", call: SURFACE_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Five support items", reason: "Rejected because Surface supports only 2 to 3 supports." },
        { label: "Ordered workflow", reason: "Use Sequence instead." },
      ],
    },
  },
  loop: {
    name: "loop",
    responsibility: "Render a reinforcing cycle where each pass feeds the next.",
    useWhen: [
      "The idea is cyclic, compounding, recursive, or flywheel-like.",
      "The end feeds back into the beginning.",
      "You need 3 to 4 loop steps.",
    ],
    avoidWhen: [
      "The process ends and does not return.",
      "The idea is a stack or hierarchy.",
      "The point is a simple two-sided contrast.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "loop".' },
      { field: "steps", requirement: "Required array with 3 to 4 loop steps." },
      { field: "center", requirement: "Optional center label, 18 characters max." },
      ...baseItemRules("steps[]"),
    ],
    validate: validateLoopTemplateCall,
    render: renderLoopTemplateCall,
    examples: {
      valid: [{ label: "Create, learn, refine, repeat loop", call: LOOP_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Straight process", reason: "Use Sequence instead." },
        { label: "Five-step loop", reason: "Rejected because Loop supports only 3 to 4 steps." },
      ],
    },
  },
  progression: {
    name: "progression",
    responsibility: "Render staged growth, maturity, intensity, or improvement.",
    useWhen: [
      "The idea is moving from low to high, early to mature, or manual to autonomous.",
      "The ordering matters but the main idea is increasing level, not workflow mechanics.",
      "You need 3 to 5 stages.",
    ],
    avoidWhen: [
      "The idea is a normal step-by-step process.",
      "The stages do not imply growth or increasing intensity.",
      "The point is a two-sided contrast.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "progression".' },
      { field: "stages", requirement: "Required array with 3 to 5 stages." },
      ...baseItemRules("stages[]"),
    ],
    validate: validateProgressionTemplateCall,
    render: renderProgressionTemplateCall,
    examples: {
      valid: [{ label: "Manual to assisted to autonomous maturity", call: PROGRESSION_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Circular feedback", reason: "Use Loop instead." },
        { label: "Two endpoints only", reason: "Use Comparison instead." },
      ],
    },
  },
  formula: {
    name: "formula",
    responsibility: "Render a simple concept equation where inputs combine into one result.",
    useWhen: [
      "The idea is X plus Y equals Z.",
      "The outcome depends on a small combination of factors.",
      "You need 2 to 3 input terms and one result.",
    ],
    avoidWhen: [
      "The idea is numeric precision requiring researched figures.",
      "The concept is really a timeline or workflow.",
      "There is no clear result.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "formula".' },
      { field: "terms", requirement: "Required array with 2 to 3 input terms." },
      { field: "terms[].operator", requirement: 'Optional operator: "+", "x", or "->".' },
      ...baseItemRules("terms[]"),
      ...baseItemRules("result"),
    ],
    validate: validateFormulaTemplateCall,
    render: renderFormulaTemplateCall,
    examples: {
      valid: [{ label: "Content plus context plus timing equals leverage", call: FORMULA_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Invented statistics", reason: "Rejected editorially; do not fabricate numbers." },
        { label: "Four input terms", reason: "Rejected because Formula supports only 2 to 3 inputs." },
      ],
    },
  },
  allocation: {
    name: "allocation",
    responsibility: "Render a weighted split or tradeoff as a segmented allocation bar.",
    useWhen: [
      "The idea is share, balance, tradeoff, distribution, or resource allocation.",
      "The weights are stated or can be safely represented as conceptual proportions.",
      "You need 2 to 4 segments.",
    ],
    avoidWhen: [
      "The numbers would be made up or misleading.",
      "The point is flow over time.",
      "The point is a hierarchy.",
    ],
    sideEffectProfile: "render-only",
    requiredPermissionLevel: "always-allow",
    executionOwner: "deterministic-renderer",
    inputRules: [
      { field: "template", requirement: 'Must be the literal string "allocation".' },
      { field: "segments", requirement: "Required array with 2 to 4 weighted segments." },
      { field: "segments[].weight", requirement: "Positive numeric relative weight. Need not sum to 100." },
      ...baseItemRules("segments[]"),
    ],
    validate: validateAllocationTemplateCall,
    render: renderAllocationTemplateCall,
    examples: {
      valid: [{ label: "Product, audience, and platform tradeoff", call: ALLOCATION_TOOL_EXAMPLES[0] }],
      invalid: [
        { label: "Negative segment weight", reason: "Rejected because weights must be positive." },
        { label: "Unverified exact percentages", reason: "Rejected editorially unless the source states them." },
      ],
    },
  },
};

export const getTemplateToolSpec = <TName extends TemplateToolName>(name: TName) =>
  TEMPLATE_TOOL_SPECS[name];

export const validateTemplateToolCall = (call: TemplateToolCall, zone?: GfxZone) => {
  switch (call.template) {
    case "stack":
      return TEMPLATE_TOOL_SPECS.stack.validate(call, zone);
    case "comparison":
      return TEMPLATE_TOOL_SPECS.comparison.validate(call, zone);
    case "sequence":
      return TEMPLATE_TOOL_SPECS.sequence.validate(call, zone);
    case "gate":
      return TEMPLATE_TOOL_SPECS.gate.validate(call, zone);
    case "surface":
      return TEMPLATE_TOOL_SPECS.surface.validate(call, zone);
    case "loop":
      return TEMPLATE_TOOL_SPECS.loop.validate(call, zone);
    case "progression":
      return TEMPLATE_TOOL_SPECS.progression.validate(call, zone);
    case "formula":
      return TEMPLATE_TOOL_SPECS.formula.validate(call, zone);
    case "allocation":
      return TEMPLATE_TOOL_SPECS.allocation.validate(call, zone);
  }
};

export const renderTemplateToolCall = (call: TemplateToolCall) => {
  switch (call.template) {
    case "stack":
      return TEMPLATE_TOOL_SPECS.stack.render(call);
    case "comparison":
      return TEMPLATE_TOOL_SPECS.comparison.render(call);
    case "sequence":
      return TEMPLATE_TOOL_SPECS.sequence.render(call);
    case "gate":
      return TEMPLATE_TOOL_SPECS.gate.render(call);
    case "surface":
      return TEMPLATE_TOOL_SPECS.surface.render(call);
    case "loop":
      return TEMPLATE_TOOL_SPECS.loop.render(call);
    case "progression":
      return TEMPLATE_TOOL_SPECS.progression.render(call);
    case "formula":
      return TEMPLATE_TOOL_SPECS.formula.render(call);
    case "allocation":
      return TEMPLATE_TOOL_SPECS.allocation.render(call);
  }
};

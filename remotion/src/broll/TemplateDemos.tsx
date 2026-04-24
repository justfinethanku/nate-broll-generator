import React from "react";
import {
  ALLOCATION_TOOL_EXAMPLES,
  COMPARISON_TOOL_EXAMPLES,
  FORMULA_TOOL_EXAMPLES,
  GATE_TOOL_EXAMPLES,
  LOOP_TOOL_EXAMPLES,
  PROGRESSION_TOOL_EXAMPLES,
  renderTemplateToolCall,
  SEQUENCE_TOOL_EXAMPLES,
  STACK_TOOL_EXAMPLES,
  SURFACE_TOOL_EXAMPLES,
} from "./templates/templateToolRegistry";

const StackTwoLayerDemo: React.FC = () =>
  renderTemplateToolCall({
    template: "stack",
    title: "Stack Template",
    subtitle: "two-layer stack",
    bottomLabel: "The visible layer sits on a shared foundation",
    bottomAccent: "foundation",
    layers: [
      {
        role: "Foundation",
        label: "Shared Protocol",
        note: "open standard",
        color: "cyan",
      },
      {
        role: "Product",
        label: "Creator Surface",
        note: "daily workflow",
        color: "orange",
      },
    ],
  });

const StackThreeLayerDemo: React.FC = () => renderTemplateToolCall(STACK_TOOL_EXAMPLES[0]);
const StackFourLayerDemo: React.FC = () => renderTemplateToolCall(STACK_TOOL_EXAMPLES[1]);
const ComparisonTemplateDemo: React.FC = () =>
  renderTemplateToolCall(COMPARISON_TOOL_EXAMPLES[0]);
const SequenceTemplateDemo: React.FC = () => renderTemplateToolCall(SEQUENCE_TOOL_EXAMPLES[0]);
const GateTemplateDemo: React.FC = () => renderTemplateToolCall(GATE_TOOL_EXAMPLES[0]);
const SurfaceTemplateDemo: React.FC = () => renderTemplateToolCall(SURFACE_TOOL_EXAMPLES[0]);
const LoopTemplateDemo: React.FC = () => renderTemplateToolCall(LOOP_TOOL_EXAMPLES[0]);
const ProgressionTemplateDemo: React.FC = () =>
  renderTemplateToolCall(PROGRESSION_TOOL_EXAMPLES[0]);
const FormulaTemplateDemo: React.FC = () => renderTemplateToolCall(FORMULA_TOOL_EXAMPLES[0]);
const AllocationTemplateDemo: React.FC = () =>
  renderTemplateToolCall(ALLOCATION_TOOL_EXAMPLES[0]);

export const TEMPLATE_DEMOS = [
  {
    id: "TPL-STACK-2-DEMO",
    component: StackTwoLayerDemo,
  },
  {
    id: "TPL-STACK-DEMO",
    component: StackThreeLayerDemo,
  },
  {
    id: "TPL-STACK-4-DEMO",
    component: StackFourLayerDemo,
  },
  {
    id: "TPL-COMPARISON-DEMO",
    component: ComparisonTemplateDemo,
  },
  {
    id: "TPL-SEQUENCE-DEMO",
    component: SequenceTemplateDemo,
  },
  {
    id: "TPL-GATE-DEMO",
    component: GateTemplateDemo,
  },
  {
    id: "TPL-SURFACE-DEMO",
    component: SurfaceTemplateDemo,
  },
  {
    id: "TPL-LOOP-DEMO",
    component: LoopTemplateDemo,
  },
  {
    id: "TPL-PROGRESSION-DEMO",
    component: ProgressionTemplateDemo,
  },
  {
    id: "TPL-FORMULA-DEMO",
    component: FormulaTemplateDemo,
  },
  {
    id: "TPL-ALLOCATION-DEMO",
    component: AllocationTemplateDemo,
  },
];

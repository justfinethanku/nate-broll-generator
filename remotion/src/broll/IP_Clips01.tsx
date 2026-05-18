import React from "react";
import {
  renderTemplateToolCall,
  TemplateToolCall,
} from "./templates/templateToolRegistry";

const IP_CALLS_01: TemplateToolCall[] = [
  {
    template: "comparison",
    title: "Where Value Lives",
    subtitle: "vendor claim vs implementation reality",
    bottomLabel: "The value sits in implementation, not the vendor claim",
    bottomAccent: "implementation",
    emphasis: "right",
    centerLabel: "vs",
    left: {
      role: "Vendor",
      label: "Agent Claims",
      note: "promises",
      color: "orange",
    },
    right: {
      role: "Builder",
      label: "Implementation",
      note: "real value",
      color: "cyan",
    },
  },
  {
    template: "formula",
    title: "Choice Paralysis",
    subtitle: "why the market feels stuck",
    bottomLabel: "A trillion-dollar prize pulls every vendor into the same lane",
    bottomAccent: "same lane",
    terms: [
      { label: "Gold Rush", note: "huge market", color: "amber", operator: "+" },
      { label: "Vendor Flood", note: "same pitch", color: "orange" },
    ],
    result: { label: "Buyer Freeze", note: "hard choice", color: "red" },
  },
  {
    template: "sequence",
    title: "Workflow First",
    subtitle: "the model needs a process around it",
    bottomLabel: "A real workflow defines ownership before the model acts",
    bottomAccent: "ownership",
    steps: [
      { role: "Step 1", label: "Decisions", note: "model scope", color: "steel" },
      { role: "Step 2", label: "Handoffs", note: "human steps", color: "cyan" },
      { role: "Step 3", label: "Done State", note: "clear output", color: "green" },
    ],
  },
];

export const IP_CLIPS_01 = IP_CALLS_01.map((call, index) => ({
  id: `IP-${String(index + 1).padStart(3, "0")}-${call.title.replace(/[^A-Za-z0-9]+/g, "")}`,
  component: (() => renderTemplateToolCall(call)) as React.FC,
}));

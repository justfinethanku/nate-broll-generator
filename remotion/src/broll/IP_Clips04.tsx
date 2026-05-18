import React from "react";
import {
  renderTemplateToolCall,
  TemplateToolCall,
} from "./templates/templateToolRegistry";

const IP_CALLS_04: TemplateToolCall[] = [
  {
    template: "comparison",
    title: "Customization Wins",
    subtitle: "the old SaaS assumption breaks",
    bottomLabel: "The disproportionate value in agentic workflows is customization",
    bottomAccent: "customization",
    emphasis: "right",
    centerLabel: "vs",
    left: {
      role: "Old SaaS",
      label: "Generic App",
      note: "same shape",
      color: "orange",
    },
    right: {
      role: "Agents",
      label: "Custom Flow",
      note: "local fit",
      color: "cyan",
    },
  },
  {
    template: "formula",
    title: "Leverage Point",
    subtitle: "what actually creates agentic value",
    bottomLabel: "Leverage comes from assembling the system around the workflow",
    bottomAccent: "assembling",
    terms: [
      { label: "Model", note: "reasoning", color: "purple", operator: "+" },
      { label: "Harness", note: "controls", color: "amber", operator: "+" },
      { label: "Data", note: "records", color: "cyan" },
    ],
    result: { label: "Workflow", note: "actionable", color: "green" },
  },
];

export const IP_CLIPS_04 = IP_CALLS_04.map((call, index) => ({
  id: `IP-${String(index + 10).padStart(3, "0")}-${call.title.replace(/[^A-Za-z0-9]+/g, "")}`,
  component: (() => renderTemplateToolCall(call)) as React.FC,
}));

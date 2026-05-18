import React from "react";
import {
  renderTemplateToolCall,
  TemplateToolCall,
} from "./templates/templateToolRegistry";

const IP_CALLS_02: TemplateToolCall[] = [
  {
    template: "progression",
    title: "Risk Escalation",
    subtitle: "the action profile changes fast",
    bottomLabel: "Reading is one risk profile; spending is another",
    bottomAccent: "spending",
    stages: [
      { role: "Low", label: "Read", note: "observe", color: "steel" },
      { role: "Medium", label: "Write", note: "change data", color: "amber" },
      { role: "High", label: "Spend", note: "commit money", color: "red" },
    ],
  },
  {
    template: "formula",
    title: "PE Pull Pressure",
    subtitle: "AI becomes part of the exit story",
    bottomLabel: "Portfolio owners want AI that changes the sale narrative",
    bottomAccent: "sale",
    terms: [
      { label: "SaaS Asset", note: "owned company", color: "steel", operator: "+" },
      { label: "AI Story", note: "growth angle", color: "purple" },
    ],
    result: { label: "Exit Value", note: "better story", color: "green" },
  },
  {
    template: "comparison",
    title: "Portfolio Test",
    subtitle: "one-off sale or scalable channel",
    bottomLabel: "The hard question is whether 50 companies could use it",
    bottomAccent: "50 companies",
    emphasis: "right",
    centerLabel: "or",
    left: {
      role: "Narrow",
      label: "One-off Sale",
      note: "custom pitch",
      color: "orange",
    },
    right: {
      role: "Scaled",
      label: "Portfolio Fit",
      note: "repeatable",
      color: "cyan",
    },
  },
];

export const IP_CLIPS_02 = IP_CALLS_02.map((call, index) => ({
  id: `IP-${String(index + 4).padStart(3, "0")}-${call.title.replace(/[^A-Za-z0-9]+/g, "")}`,
  component: (() => renderTemplateToolCall(call)) as React.FC,
}));

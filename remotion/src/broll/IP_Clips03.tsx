import React from "react";
import {
  renderTemplateToolCall,
  TemplateToolCall,
} from "./templates/templateToolRegistry";

const IP_CALLS_03: TemplateToolCall[] = [
  {
    template: "surface",
    title: "Business Object",
    subtitle: "where generic intelligence becomes useful",
    bottomLabel: "Generic intelligence gets valuable when it attaches to real work",
    bottomAccent: "real work",
    surface: {
      role: "Object",
      label: "Work Record",
      note: "source of truth",
      color: "cyan",
    },
    supports: [
      { role: "Rules", label: "Actions", note: "allowed moves", color: "green" },
      { role: "Context", label: "Policies", note: "constraints", color: "amber" },
      { role: "People", label: "Owners", note: "handoffs", color: "purple" },
    ],
  },
  {
    template: "stack",
    title: "Sales Object Model",
    subtitle: "agent substrate for a full funnel",
    bottomLabel: "The agent needs the business objects under the sales motion",
    bottomAccent: "business objects",
    layers: [
      { role: "Signal", label: "Lead", note: "incoming", color: "steel" },
      { role: "Record", label: "Account", note: "context", color: "cyan" },
      { role: "Motion", label: "Deal", note: "stage", color: "amber" },
      { role: "Action", label: "Next Step", note: "agent move", color: "green" },
    ],
  },
  {
    template: "comparison",
    title: "Build Boundary",
    subtitle: "what stays inside versus partner work",
    bottomLabel: "Implementation detail decides what to keep inside the house",
    bottomAccent: "inside",
    emphasis: "left",
    centerLabel: "or",
    left: {
      role: "Core",
      label: "Keep Inside",
      note: "own detail",
      color: "cyan",
    },
    right: {
      role: "Partner",
      label: "Bring Help",
      note: "plug gaps",
      color: "orange",
    },
  },
];

export const IP_CLIPS_03 = IP_CALLS_03.map((call, index) => ({
  id: `IP-${String(index + 7).padStart(3, "0")}-${call.title.replace(/[^A-Za-z0-9]+/g, "")}`,
  component: (() => renderTemplateToolCall(call)) as React.FC,
}));

import React from "react";
import {
  renderTemplateToolCall,
  TemplateToolCall,
} from "./templates/templateToolRegistry";

const IP_INTRO_CALLS: TemplateToolCall[] = [
  {
    template: "formula",
    title: "Deployment Model",
    subtitle: "why the incentives line up",
    bottomLabel: "PE capital, AI labs, and enterprise demand converge on services deployment",
    bottomAccent: "services",
    terms: [
      { label: "PE Capital", note: "finance", color: "green", operator: "+" },
      { label: "AI Labs", note: "models", color: "purple", operator: "+" },
      { label: "Enterprise", note: "demand", color: "cyan" },
    ],
    result: { label: "Deployment", note: "services", color: "orange" },
  },
  {
    template: "comparison",
    title: "SaaS Pressure",
    subtitle: "old growth meets agent demand",
    bottomLabel: "AI agents put pressure on the old SaaS investment story",
    bottomAccent: "pressure",
    emphasis: "right",
    centerLabel: "vs",
    left: {
      role: "Old SaaS",
      label: "Same Metrics",
      note: "old growth",
      color: "orange",
    },
    right: {
      role: "Agents",
      label: "Workflow Value",
      note: "new demand",
      color: "cyan",
    },
  },
  {
    template: "sequence",
    title: "Forward Deployed",
    subtitle: "enterprise AI has to sit with the customer",
    bottomLabel: "The implementation work happens in the weeds with customers",
    bottomAccent: "in the weeds",
    steps: [
      { role: "Step 1", label: "Lab Room", note: "model talk", color: "purple" },
      { role: "Step 2", label: "Customer Site", note: "real work", color: "cyan" },
      { role: "Step 3", label: "Working System", note: "deployed", color: "green" },
    ],
  },
  {
    template: "progression",
    title: "Workflow Value",
    subtitle: "why 100 percent matters",
    bottomLabel: "The big value appears when agents complete the whole workflow",
    bottomAccent: "whole workflow",
    stages: [
      { role: "Low", label: "Chat", note: "assist", color: "steel" },
      { role: "Medium", label: "Agent", note: "delegated", color: "cyan" },
      { role: "High", label: "Full Workflow", note: "100 percent", color: "green" },
    ],
  },
  {
    template: "comparison",
    title: "Capital Signal",
    subtitle: "the deployment race is serious money",
    bottomLabel: "Billions of dollars are moving toward enterprise implementation",
    bottomAccent: "implementation",
    emphasis: "right",
    centerLabel: "and",
    left: {
      role: "Anthropic",
      label: "Deploy JV",
      note: "$1.5B",
      color: "purple",
    },
    right: {
      role: "OpenAI",
      label: "Venture Push",
      note: "near $10B",
      color: "cyan",
    },
  },
  {
    template: "comparison",
    title: "Beyond Data Moat",
    subtitle: "the old answer is incomplete",
    bottomLabel: "The moat is not just data; the harness decides value",
    bottomAccent: "harness",
    emphasis: "right",
    centerLabel: "vs",
    left: {
      role: "Old View",
      label: "Data Moat",
      note: "incomplete",
      color: "orange",
    },
    right: {
      role: "New View",
      label: "Harness",
      note: "bottleneck",
      color: "cyan",
    },
  },
  {
    template: "progression",
    title: "Labs Move Down",
    subtitle: "frontier labs chase workflow control",
    bottomLabel: "The labs are moving from models into deployment and product",
    bottomAccent: "deployment",
    stages: [
      { role: "Base", label: "Model API", note: "ship model", color: "steel" },
      { role: "Middle", label: "Deploy Co", note: "with capital", color: "purple" },
      { role: "High", label: "Product Pieces", note: "workflow", color: "cyan" },
    ],
  },
  {
    template: "progression",
    title: "Consultancies Rise",
    subtitle: "services firms are becoming builders",
    bottomLabel: "Consultancies are moving from change management into agent delivery",
    bottomAccent: "agent delivery",
    stages: [
      { role: "Old", label: "Change Mgmt", note: "advice", color: "steel" },
      { role: "Now", label: "Agent Practice", note: "patterns", color: "cyan" },
      { role: "Edge", label: "Engineers", note: "wire systems", color: "green" },
    ],
  },
  {
    template: "gate",
    title: "System Of Record",
    subtitle: "native interfaces close the gap",
    bottomLabel: "Systems of record want agents to call the platform directly",
    bottomAccent: "directly",
    before: { role: "Outside", label: "Startup Layer", note: "between", color: "orange" },
    gate: { role: "Platform", label: "Native APIs", note: "governed", color: "amber" },
    after: { role: "Agent", label: "Direct Call", note: "audit trail", color: "cyan" },
  },
  {
    template: "sequence",
    title: "Portfolio Rollout",
    subtitle: "why PE changes distribution",
    bottomLabel: "One deployment partner can standardize playbooks across a portfolio",
    bottomAccent: "portfolio",
    steps: [
      { role: "Step 1", label: "One Partner", note: "deploy", color: "green" },
      { role: "Step 2", label: "Many Cos", note: "portfolio", color: "cyan" },
      { role: "Step 3", label: "Playbooks", note: "repeat", color: "orange" },
    ],
  },
];

export const IP_INTRO_CLIPS = IP_INTRO_CALLS.map((call, index) => ({
  id: `IP-INTRO-${String(index + 1).padStart(3, "0")}-${call.title.replace(/[^A-Za-z0-9]+/g, "")}`,
  component: (() => renderTemplateToolCall(call)) as React.FC,
}));

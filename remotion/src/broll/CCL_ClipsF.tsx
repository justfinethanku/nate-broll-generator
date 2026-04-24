import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Database, Building2, Sparkles, Brain, Clock, Layers3, Briefcase, TrendingUp } from "lucide-react";
import { BRollTemplate, GfxZone, OB1, ease } from "./shared";
import {
  sceneWrap,
  TitleNode,
  Connector,
  assertSceneSpacing,
  getTitleNodeBounds,
} from "./CCLVis";

type ClipSpec = {
  id: string;
  title: string;
  subtitle?: string;
  bottomLabel: string;
  bottomAccent?: string;
  render: (frame: number, fps: number, zone: GfxZone) => React.ReactNode;
};

const clipSpecs: ClipSpec[] = [
  {
    id: "CCL-016-BuildVsRent",
    title: "Build Vs Rent",
    subtitle: "where memory lives",
    bottomLabel: "Convenience trades against owning the memory layer",
    bottomAccent: "memory layer",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const topNode = {
        left: zone.width * 0.36,
        top: zone.height * 0.14,
        width: zone.width * 0.28,
        height: zone.height * 0.18,
        title: "Memory",
        color: OB1.ORANGE,
        icon: Brain,
        opacity: ease(sceneFrame, 8, 22),
      };
      const bottomNodes = [
        {
          left: zone.width * 0.06,
          top: zone.height * 0.6,
          width: zone.width * 0.28,
          height: zone.height * 0.18,
          title: "Owned",
          color: OB1.CYAN,
          icon: Database,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: zone.width * 0.66,
          top: zone.height * 0.6,
          width: zone.width * 0.28,
          height: zone.height * 0.18,
          title: "Rented",
          color: OB1.GREEN,
          icon: Building2,
          opacity: ease(sceneFrame, 30, 44),
        },
      ];

      assertSceneSpacing("CCL-016-BuildVsRent", zone, [
        getTitleNodeBounds({ zone, ...topNode, hasIcon: true }),
        ...bottomNodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true })),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.5} y1={zone.height * 0.37} x2={zone.width * 0.22} y2={zone.height * 0.7} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.5} y1={zone.height * 0.37} x2={zone.width * 0.78} y2={zone.height * 0.7} opacity={ease(sceneFrame, 20, 34)} />

          <TitleNode zone={zone} {...topNode} />
          {bottomNodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-017-ConvenienceFlywheel",
    title: "Sticky Flywheel",
    subtitle: "hard to leave",
    bottomLabel: "Useful enough becomes impossible to leave",
    bottomAccent: "impossible",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const size = zone.width * 0.22;
      const nodes = [
        {
          left: zone.width * 0.1,
          top: zone.height * 0.08,
          width: size,
          height: zone.height * 0.2,
          title: "Easy start",
          color: OB1.STEEL,
          icon: Sparkles,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.68,
          top: zone.height * 0.08,
          width: size,
          height: zone.height * 0.2,
          title: "Useful",
          color: OB1.CYAN,
          icon: TrendingUp,
          opacity: ease(sceneFrame, 16, 30),
        },
        {
          left: zone.width * 0.68,
          top: zone.height * 0.61,
          width: size,
          height: zone.height * 0.2,
          title: "More context",
          color: OB1.GREEN,
          icon: Layers3,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: zone.width * 0.1,
          top: zone.height * 0.61,
          width: size,
          height: zone.height * 0.2,
          title: "Hard to leave",
          color: OB1.ORANGE,
          icon: Clock,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing(
        "CCL-017-ConvenienceFlywheel",
        zone,
        nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true }))
      );

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.32} y1={zone.height * 0.22} x2={zone.width * 0.68} y2={zone.height * 0.22} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.79} y1={zone.height * 0.33} x2={zone.width * 0.79} y2={zone.height * 0.68} opacity={ease(sceneFrame, 22, 36)} />
          <Connector zone={zone} x1={zone.width * 0.68} y1={zone.height * 0.79} x2={zone.width * 0.32} y2={zone.height * 0.79} opacity={ease(sceneFrame, 26, 40)} />
          <Connector zone={zone} x1={zone.width * 0.21} y1={zone.height * 0.68} x2={zone.width * 0.21} y2={zone.height * 0.33} opacity={ease(sceneFrame, 30, 44)} />

          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-018-CareerLadder",
    title: "Career Pressure",
    subtitle: "use the layer",
    bottomLabel: "Advancement starts routing through the agent layer",
    bottomAccent: "agent layer",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const nodes = [
        {
          left: zone.width * 0.08,
          top: zone.height * 0.62,
          width: zone.width * 0.2,
          height: zone.height * 0.14,
          title: "Use",
          color: OB1.STEEL,
          icon: Clock,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.34,
          top: zone.height * 0.46,
          width: zone.width * 0.2,
          height: zone.height * 0.14,
          title: "Lead",
          color: OB1.CYAN,
          icon: Briefcase,
          opacity: ease(sceneFrame, 16, 30),
        },
        {
          left: zone.width * 0.6,
          top: zone.height * 0.3,
          width: zone.width * 0.2,
          height: zone.height * 0.14,
          title: "Build",
          color: OB1.GREEN,
          icon: Building2,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: zone.width * 0.75,
          top: zone.height * 0.04,
          width: zone.width * 0.17,
          height: zone.height * 0.14,
          title: "Layer",
          color: OB1.ORANGE,
          icon: Brain,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing(
        "CCL-018-CareerLadder",
        zone,
        nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true }))
      );

      return (
        <div style={sceneWrap(zone)}>
          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
];

const makeClip = (spec: ClipSpec): React.FC => {
  const ClipComponent: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return (
      <BRollTemplate
        title={spec.title}
        subtitle={spec.subtitle}
        bottomLabel={spec.bottomLabel}
        bottomAccent={spec.bottomAccent}
        scenes={[
          {
            start: 90,
            end: 300,
            render: (_f, _progress, zone) => spec.render(frame, fps, zone),
          },
        ]}
      />
    );
  };
  ClipComponent.displayName = spec.id;
  return ClipComponent;
};

export const CCL_CLIPS_F = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

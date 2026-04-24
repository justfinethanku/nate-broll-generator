import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Layers3, Lock, Globe, Store, GitBranch, Package } from "lucide-react";
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
    id: "CCL-010-McpVsCnw",
    title: "Open Then Closed",
    subtitle: "layer on layer",
    bottomLabel: "Open protocol does not stop closed capture",
    bottomAccent: "closed capture",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const nodes = [
        {
          left: zone.width * 0.22,
          top: zone.height * 0.61,
          width: zone.width * 0.56,
          height: zone.height * 0.16,
          title: "MCP",
          color: OB1.CYAN,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.26,
          top: zone.height * 0.36,
          width: zone.width * 0.48,
          height: zone.height * 0.16,
          title: "CNW zip",
          color: OB1.ORANGE,
          opacity: ease(sceneFrame, 20, 34),
        },
        {
          left: zone.width * 0.32,
          top: zone.height * 0.04,
          width: zone.width * 0.36,
          height: zone.height * 0.16,
          title: "Capture",
          color: OB1.PURPLE,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing(
        "CCL-010-McpVsCnw",
        zone,
        nodes.map((node) =>
          getTitleNodeBounds({
            zone,
            ...node,
            hasIcon: "icon" in node && Boolean(node.icon),
          })
        )
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
  {
    id: "CCL-011-StoreAdvantage",
    title: "Distribution Wins",
    subtitle: "already in the store",
    bottomLabel: "In-surface discovery beats portable obscurity",
    bottomAccent: "discovery",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const nodes = [
        {
          left: zone.width * 0.05,
          top: zone.height * 0.24,
          width: zone.width * 0.25,
          height: zone.height * 0.32,
          title: "Tool",
          color: OB1.STEEL,
          icon: Package,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.41,
          top: zone.height * 0.18,
          width: zone.width * 0.18,
          height: zone.height * 0.44,
          title: "Store",
          color: OB1.ORANGE,
          icon: Store,
          opacity: ease(sceneFrame, 20, 34),
        },
        {
          left: zone.width * 0.7,
          top: zone.height * 0.24,
          width: zone.width * 0.25,
          height: zone.height * 0.32,
          title: "Demand",
          color: OB1.GREEN,
          icon: GitBranch,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing(
        "CCL-011-StoreAdvantage",
        zone,
        nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true }))
      );

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.3} y1={zone.height * 0.42} x2={zone.width * 0.41} y2={zone.height * 0.42} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.59} y1={zone.height * 0.42} x2={zone.width * 0.7} y2={zone.height * 0.42} opacity={ease(sceneFrame, 24, 38)} />

          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-012-BuilderFork",
    title: "Builder Choice",
    subtitle: "portable or captive",
    bottomLabel: "Every tool builder gets pulled into this fork",
    bottomAccent: "fork",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const root = {
        left: zone.width * 0.37,
        top: zone.height * 0.18,
        width: zone.width * 0.26,
        height: zone.height * 0.18,
        title: "Build",
        color: OB1.ORANGE,
        icon: GitBranch,
        opacity: ease(sceneFrame, 8, 22),
      };
      const nodes = [
        {
          left: zone.width * 0.06,
          top: zone.height * 0.62,
          width: zone.width * 0.28,
          height: zone.height * 0.18,
          title: "MCP",
          color: OB1.CYAN,
          icon: Globe,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: zone.width * 0.66,
          top: zone.height * 0.62,
          width: zone.width * 0.28,
          height: zone.height * 0.18,
          title: "Conway",
          color: OB1.GREEN,
          icon: Lock,
          opacity: ease(sceneFrame, 30, 44),
        },
      ];

      assertSceneSpacing("CCL-012-BuilderFork", zone, [
        getTitleNodeBounds({ zone, ...root, hasIcon: true }),
        ...nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true })),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.5} y1={root.top + root.height} x2={zone.width * 0.22} y2={zone.height * 0.72} opacity={ease(sceneFrame, 20, 34)} />
          <Connector zone={zone} x1={zone.width * 0.5} y1={root.top + root.height} x2={zone.width * 0.78} y2={zone.height * 0.72} opacity={ease(sceneFrame, 24, 38)} />

          <TitleNode zone={zone} {...root} />
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

export const CCL_CLIPS_D = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

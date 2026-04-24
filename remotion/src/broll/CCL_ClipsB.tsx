import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Mail, MessageSquare, BarChart3, Sparkles, TriangleAlert, Layers3, ShoppingCart, Lock } from "lucide-react";
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
    id: "CCL-004-TriageLoop",
    title: "Triage Loop",
    subtitle: "one review queue",
    bottomLabel: "Email Slack metrics all feed one queue",
    bottomAccent: "one queue",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const center = {
        left: zone.width * 0.36,
        top: zone.height * 0.34,
        width: zone.width * 0.28,
        height: zone.height * 0.27,
        title: "Review",
        color: OB1.ORANGE,
        icon: Sparkles,
        opacity: ease(sceneFrame, 8, 22),
      };
      const nodes = [
        {
          left: zone.width * 0.06,
          top: zone.height * 0.08,
          width: zone.width * 0.23,
          height: zone.height * 0.2,
          title: "Email",
          color: OB1.CYAN,
          icon: Mail,
          opacity: ease(sceneFrame, 24, 40),
        },
        {
          left: zone.width * 0.71,
          top: zone.height * 0.08,
          width: zone.width * 0.23,
          height: zone.height * 0.2,
          title: "Slack",
          color: OB1.GREEN,
          icon: MessageSquare,
          opacity: ease(sceneFrame, 28, 44),
        },
        {
          left: zone.width * 0.38,
          top: zone.height * 0.68,
          width: zone.width * 0.24,
          height: zone.height * 0.27,
          title: "Metrics",
          color: OB1.PURPLE,
          icon: BarChart3,
          opacity: ease(sceneFrame, 32, 48),
        },
      ];

      assertSceneSpacing("CCL-004-TriageLoop", zone, [
        getTitleNodeBounds({ zone, ...center, hasIcon: true }),
        ...nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true })),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.2} y1={zone.height * 0.2} x2={center.left} y2={center.top + center.height * 0.5} opacity={ease(sceneFrame, 18, 34)} />
          <Connector zone={zone} x1={zone.width * 0.8} y1={zone.height * 0.2} x2={center.left + center.width} y2={center.top + center.height * 0.5} opacity={ease(sceneFrame, 20, 36)} />
          <Connector zone={zone} x1={zone.width * 0.5} y1={zone.height * 0.78} x2={center.left + center.width * 0.5} y2={center.top + center.height} opacity={ease(sceneFrame, 22, 38)} />

          <TitleNode zone={zone} {...center} />
          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-005-DemoRealityGap",
    title: "Demo Gap",
    subtitle: "speed still wins",
    bottomLabel: "Partly right can still be massively useful",
    bottomAccent: "Partly right",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const nodes = [
        {
          left: zone.width * 0.06,
          top: zone.height * 0.2,
          width: zone.width * 0.34,
          height: zone.height * 0.34,
          title: "Demo",
          color: OB1.GREEN,
          icon: Sparkles,
          opacity: ease(sceneFrame, 8, 24),
        },
        {
          left: zone.width * 0.6,
          top: zone.height * 0.2,
          width: zone.width * 0.34,
          height: zone.height * 0.34,
          title: "Reality",
          color: OB1.RED,
          icon: TriangleAlert,
          opacity: ease(sceneFrame, 16, 32),
        },
        {
          left: zone.width * 0.35,
          top: zone.height * 0.62,
          width: zone.width * 0.32,
          height: zone.height * 0.28,
          title: "Speed",
          color: OB1.ORANGE,
          opacity: ease(sceneFrame, 28, 44),
        },
      ];

      assertSceneSpacing(
        "CCL-005-DemoRealityGap",
        zone,
        nodes.map((node) =>
          getTitleNodeBounds({
            zone,
            ...node,
            hasIcon: Boolean(node.icon),
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
    id: "CCL-006-CapstoneStack",
    title: "Capstone Stack",
    subtitle: "not in isolation",
    bottomLabel: "Conway sits on top of recent launches",
    bottomAccent: "top",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const nodes = [
        {
          left: zone.width * 0.14,
          top: zone.height * 0.62,
          width: zone.width * 0.22,
          height: zone.height * 0.16,
          title: "Channels",
          color: OB1.STEEL,
          icon: MessageSquare,
          opacity: ease(sceneFrame, 10, 24),
        },
        {
          left: zone.width * 0.39,
          top: zone.height * 0.47,
          width: zone.width * 0.22,
          height: zone.height * 0.16,
          title: "Cowork",
          color: OB1.CYAN,
          icon: Layers3,
          opacity: ease(sceneFrame, 18, 32),
        },
        {
          left: zone.width * 0.64,
          top: zone.height * 0.32,
          width: zone.width * 0.22,
          height: zone.height * 0.16,
          title: "Marketplace",
          color: OB1.GREEN,
          icon: ShoppingCart,
          opacity: ease(sceneFrame, 26, 40),
        },
        {
          left: zone.width * 0.39,
          top: zone.height * 0.08,
          width: zone.width * 0.22,
          height: zone.height * 0.16,
          title: "Conway",
          color: OB1.ORANGE,
          icon: Lock,
          opacity: ease(sceneFrame, 34, 48),
        },
      ];

      assertSceneSpacing(
        "CCL-006-CapstoneStack",
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

export const CCL_CLIPS_B = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

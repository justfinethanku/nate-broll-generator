import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Brain, MessageSquare, Search, Workflow, Mail, Calendar, BarChart3, Sparkles } from "lucide-react";
import { BRollTemplate, GfxZone, OB1, ease } from "./shared";
import {
  sceneWrap,
  MetricNode,
  TitleNode,
  Connector,
  GlowRing,
  assertSceneSpacing,
  getMetricNodeBounds,
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
    id: "CCL-001-HarnessIceberg",
    title: "The Leak",
    subtitle: "missed the stack",
    bottomLabel: "The harness matters more than the code",
    bottomAccent: "harness",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const topNode = {
        left: zone.width * 0.34,
        top: zone.height * 0.03,
        width: zone.width * 0.32,
        height: zone.height * 0.3,
        title: "Leaked source",
        value: "CODE",
        accent: OB1.ORANGE,
        color: OB1.ORANGE,
        icon: Sparkles,
        opacity: ease(sceneFrame, 6, 22),
      };
      const bottomY = zone.height * 0.56;
      const cardW = zone.width * 0.22;
      const cardH = zone.height * 0.2;
      const lowerNodes = [
        {
          left: zone.width * 0.08,
          top: bottomY,
          width: cardW,
          height: cardH,
          title: "Conway",
          color: OB1.CYAN,
          icon: Brain,
          opacity: ease(sceneFrame, 24, 40),
        },
        {
          left: zone.width * 0.39,
          top: bottomY,
          width: cardW,
          height: cardH,
          title: "Extensions",
          color: OB1.GREEN,
          icon: Workflow,
          opacity: ease(sceneFrame, 28, 44),
        },
        {
          left: zone.width * 0.7,
          top: bottomY,
          width: cardW,
          height: cardH,
          title: "Wakeups",
          color: OB1.PURPLE,
          icon: Mail,
          opacity: ease(sceneFrame, 32, 48),
        },
      ];

      assertSceneSpacing("CCL-001-HarnessIceberg", zone, [
        getMetricNodeBounds({ zone, ...topNode, hasIcon: true }),
        ...lowerNodes.map((node) =>
          getTitleNodeBounds({ zone, ...node, hasIcon: true })
        ),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: zone.height * 0.42,
              width: zone.width * 0.7,
              borderTop: `${Math.round(5 * zone.scale)}px solid ${OB1.CYAN}`,
              opacity: ease(sceneFrame, 0, 18),
              zIndex: 0,
            }}
          />

          <Connector
            zone={zone}
            x1={topNode.left + topNode.width * 0.5}
            y1={topNode.top + topNode.height}
            x2={zone.width * 0.21}
            y2={bottomY}
            color={OB1.STEEL}
            opacity={ease(sceneFrame, 18, 34)}
          />
          <Connector
            zone={zone}
            x1={topNode.left + topNode.width * 0.5}
            y1={topNode.top + topNode.height}
            x2={zone.width * 0.5}
            y2={bottomY}
            color={OB1.STEEL}
            opacity={ease(sceneFrame, 20, 36)}
          />
          <Connector
            zone={zone}
            x1={topNode.left + topNode.width * 0.5}
            y1={topNode.top + topNode.height}
            x2={zone.width * 0.79}
            y2={bottomY}
            color={OB1.STEEL}
            opacity={ease(sceneFrame, 22, 38)}
          />

          <MetricNode zone={zone} {...topNode} />
          {lowerNodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-002-ConwaySurface",
    title: "Conway Surface",
    subtitle: "more than chat",
    bottomLabel: "Search Chat System make a new surface",
    bottomAccent: "new surface",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const centerX = zone.width * 0.5;
      const centerNode = {
        left: centerX - zone.width * 0.14,
        top: zone.height * 0.25,
        width: zone.width * 0.28,
        height: zone.height * 0.28,
        title: "Conway",
        color: OB1.ORANGE,
        icon: Brain,
        opacity: ease(sceneFrame, 6, 22),
      };
      const centerY = centerNode.top + centerNode.height * 0.5;
      const outerNodes = [
        {
          left: zone.width * 0.06,
          top: zone.height * 0.11,
          width: zone.width * 0.24,
          height: zone.height * 0.22,
          title: "Search",
          color: OB1.CYAN,
          icon: Search,
          opacity: ease(sceneFrame, 24, 40),
        },
        {
          left: zone.width * 0.7,
          top: zone.height * 0.11,
          width: zone.width * 0.24,
          height: zone.height * 0.22,
          title: "Chat",
          color: OB1.GREEN,
          icon: MessageSquare,
          opacity: ease(sceneFrame, 28, 44),
        },
        {
          left: zone.width * 0.38,
          top: zone.height * 0.62,
          width: zone.width * 0.24,
          height: zone.height * 0.2,
          title: "System",
          color: OB1.PURPLE,
          icon: Workflow,
          opacity: ease(sceneFrame, 32, 48),
        },
      ];

      assertSceneSpacing("CCL-002-ConwaySurface", zone, [
        getTitleNodeBounds({ zone, ...centerNode, hasIcon: true }),
        ...outerNodes.map((node) =>
          getTitleNodeBounds({ zone, ...node, hasIcon: true })
        ),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <div
            style={{
              position: "absolute",
              left: centerX - zone.width * 0.11,
              top: centerY - zone.width * 0.11,
            }}
          >
            <GlowRing zone={zone} size={zone.width * 0.22} color={OB1.CYAN} opacity={ease(sceneFrame, 10, 24) * 0.5} />
          </div>

          <Connector zone={zone} x1={centerX} y1={centerY} x2={zone.width * 0.22} y2={zone.height * 0.26} color={OB1.STEEL} opacity={ease(sceneFrame, 18, 34)} />
          <Connector zone={zone} x1={centerX} y1={centerY} x2={zone.width * 0.78} y2={zone.height * 0.26} color={OB1.STEEL} opacity={ease(sceneFrame, 20, 36)} />
          <Connector zone={zone} x1={centerX} y1={centerY} x2={centerX} y2={zone.height * 0.79} color={OB1.STEEL} opacity={ease(sceneFrame, 22, 38)} />

          <TitleNode zone={zone} {...centerNode} />
          {outerNodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-003-OvernightTimeline",
    title: "Overnight Run",
    subtitle: "before you type",
    bottomLabel: "A persistent agent acts before the day starts",
    bottomAccent: "before",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const y = zone.height * 0.44;
      const w = zone.width * 0.18;
      const h = zone.height * 0.24;
      const xs = [zone.width * 0.03, zone.width * 0.28, zone.width * 0.53, zone.width * 0.78];
      const nodes = [
        {
          left: xs[0],
          top: y,
          width: w,
          height: h,
          title: "Sleep",
          color: OB1.STEEL,
          icon: Calendar,
          opacity: ease(sceneFrame, 6, 20),
        },
        {
          left: xs[1],
          top: y,
          width: w,
          height: h,
          title: "Conway",
          color: OB1.CYAN,
          icon: Brain,
          opacity: ease(sceneFrame, 14, 28),
        },
        {
          left: xs[2],
          top: y,
          width: w,
          height: h,
          title: "Queue",
          color: OB1.GREEN,
          icon: Workflow,
          opacity: ease(sceneFrame, 22, 36),
        },
        {
          left: xs[3],
          top: y,
          width: w,
          height: h,
          title: "Morning",
          color: OB1.ORANGE,
          icon: Sparkles,
          opacity: ease(sceneFrame, 30, 44),
        },
      ];

      assertSceneSpacing(
        "CCL-003-OvernightTimeline",
        zone,
        nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true }))
      );

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={xs[0] + w} y1={y + h * 0.5} x2={xs[1]} y2={y + h * 0.5} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={xs[1] + w} y1={y + h * 0.5} x2={xs[2]} y2={y + h * 0.5} opacity={ease(sceneFrame, 22, 36)} />
          <Connector zone={zone} x1={xs[2] + w} y1={y + h * 0.5} x2={xs[3]} y2={y + h * 0.5} opacity={ease(sceneFrame, 26, 40)} />

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

export const CCL_CLIPS_A = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

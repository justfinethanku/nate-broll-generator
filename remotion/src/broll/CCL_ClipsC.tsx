import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Lock, Layers3, Brain, Network, GitBranch, Globe, Building2 } from "lucide-react";
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
    id: "CCL-007-SubscriptionGate",
    title: "Gatekeeping",
    subtitle: "cheap inside costly outside",
    bottomLabel: "The subscription path makes the harness sticky",
    bottomAccent: "sticky",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const y = zone.height * 0.28;
      const nodes = [
        {
          left: zone.width * 0.04,
          top: y,
          width: zone.width * 0.24,
          height: zone.height * 0.34,
          title: "3rd party",
          color: OB1.RED,
          icon: GitBranch,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.39,
          top: y + zone.height * 0.05,
          width: zone.width * 0.22,
          height: zone.height * 0.24,
          title: "Gate",
          color: OB1.ORANGE,
          icon: Lock,
          opacity: ease(sceneFrame, 16, 30),
        },
        {
          left: zone.width * 0.72,
          top: y,
          width: zone.width * 0.24,
          height: zone.height * 0.34,
          title: "10-50x",
          color: OB1.CYAN,
          accent: OB1.CYAN,
          icon: Layers3,
          opacity: ease(sceneFrame, 24, 38),
        },
      ];

      assertSceneSpacing(
        "CCL-007-SubscriptionGate",
        zone,
        nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true }))
      );

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.28} y1={zone.height * 0.45} x2={zone.width * 0.39} y2={zone.height * 0.45} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.61} y1={zone.height * 0.45} x2={zone.width * 0.72} y2={zone.height * 0.45} opacity={ease(sceneFrame, 22, 36)} />

          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-008-FiveSurfaceMap",
    title: "One Strategy",
    subtitle: "five surfaces",
    bottomLabel: "Separate products push in one direction",
    bottomAccent: "one direction",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const center = {
        left: zone.width * 0.38,
        top: zone.height * 0.29,
        width: zone.width * 0.24,
        height: zone.height * 0.22,
        title: "Conway",
        color: OB1.ORANGE,
        icon: Brain,
        opacity: ease(sceneFrame, 8, 22),
      };
      const nodes = [
        {
          left: zone.width * 0.05,
          top: zone.height * 0.15,
          width: zone.width * 0.24,
          height: zone.height * 0.24,
          title: "Dev",
          color: OB1.CYAN,
          icon: Building2,
          opacity: ease(sceneFrame, 24, 40),
        },
        {
          left: zone.width * 0.71,
          top: zone.height * 0.15,
          width: zone.width * 0.24,
          height: zone.height * 0.24,
          title: "Dist",
          color: OB1.GREEN,
          icon: Network,
          opacity: ease(sceneFrame, 28, 44),
        },
        {
          left: zone.width * 0.33,
          top: zone.height * 0.68,
          width: zone.width * 0.34,
          height: zone.height * 0.16,
          title: "Harness",
          color: OB1.PURPLE,
          icon: Lock,
          opacity: ease(sceneFrame, 32, 48),
        },
      ];

      assertSceneSpacing("CCL-008-FiveSurfaceMap", zone, [
        getTitleNodeBounds({ zone, ...center, hasIcon: true }),
        ...nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true })),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.28} y1={zone.height * 0.32} x2={center.left} y2={center.top + center.height * 0.5} opacity={ease(sceneFrame, 18, 34)} />
          <Connector zone={zone} x1={center.left + center.width} y1={center.top + center.height * 0.5} x2={zone.width * 0.72} y2={zone.height * 0.32} opacity={ease(sceneFrame, 20, 36)} />
          <Connector zone={zone} x1={center.left + center.width * 0.5} y1={center.top + center.height} x2={zone.width * 0.5} y2={zone.height * 0.78} opacity={ease(sceneFrame, 22, 38)} />

          <TitleNode zone={zone} {...center} />
          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-009-MicrosoftArc",
    title: "Speedrun",
    subtitle: "Microsoft style arc",
    bottomLabel: "Model to platform mirrors old software empires",
    bottomAccent: "platform",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const stripW = zone.width * 0.38;
      const stepW = stripW / 4;

      return (
        <div style={sceneWrap(zone)}>
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.06,
              top: zone.height * 0.2,
              width: stripW,
              height: zone.height * 0.22,
              display: "flex",
              zIndex: 1,
              opacity: ease(sceneFrame, 8, 22),
            }}
          >
            {["DOS", "Windows", "Office", "AD"].map((label, index) => (
              <div
                key={label}
                style={{
                  width: stepW,
                  height: "100%",
                  borderRight: index < 3 ? `${Math.round(3 * zone.scale)}px solid ${OB1.BG_DARK}` : undefined,
                  background: index === 3 ? OB1.ORANGE : index === 2 ? OB1.CYAN : index === 1 ? OB1.STEEL : OB1.DIM,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: Math.round(42 * zone.scale),
                  fontWeight: 800,
                  fontFamily: "inherit",
                  color: OB1.WHITE,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              left: zone.width * 0.56,
              top: zone.height * 0.48,
              width: stripW,
              height: zone.height * 0.22,
              display: "flex",
              zIndex: 1,
              opacity: ease(sceneFrame, 22, 36),
            }}
          >
            {["Model", "Tool", "Platform", "Conway"].map((label, index) => (
              <div
                key={label}
                style={{
                  width: stepW,
                  height: "100%",
                  borderRight: index < 3 ? `${Math.round(3 * zone.scale)}px solid ${OB1.BG_DARK}` : undefined,
                  background: index === 3 ? OB1.ORANGE : index === 2 ? OB1.GREEN : index === 1 ? OB1.CYAN : OB1.STEEL,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: Math.round(40 * zone.scale),
                  fontWeight: 800,
                  fontFamily: "inherit",
                  color: OB1.WHITE,
                  textAlign: "center",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <Connector zone={zone} x1={zone.width * 0.45} y1={zone.height * 0.33} x2={zone.width * 0.56} y2={zone.height * 0.59} color={OB1.ORANGE} opacity={ease(sceneFrame, 34, 48)} />
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

export const CCL_CLIPS_C = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

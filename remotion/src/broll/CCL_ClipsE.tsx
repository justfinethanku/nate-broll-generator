import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Folder, Database, MessageSquare, Brain, HardDrive, Clock, User, TrendingUp } from "lucide-react";
import { BRollTemplate, GfxZone, OB1, FONTS, ease } from "./shared";
import {
  sceneWrap,
  TitleNode,
  Connector,
  StatColumn,
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
    id: "CCL-013-NewLockIn",
    title: "Old Vs New",
    subtitle: "what gets trapped",
    bottomLabel: "Behavior is a deeper lock in layer",
    bottomAccent: "deeper",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const leftNodes = [
        {
          left: zone.width * 0.05,
          top: zone.height * 0.08,
          width: zone.width * 0.24,
          height: zone.height * 0.18,
          title: "Files",
          color: OB1.STEEL,
          icon: Folder,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.05,
          top: zone.height * 0.34,
          width: zone.width * 0.24,
          height: zone.height * 0.18,
          title: "Records",
          color: OB1.CYAN,
          icon: Database,
          opacity: ease(sceneFrame, 14, 28),
        },
        {
          left: zone.width * 0.05,
          top: zone.height * 0.6,
          width: zone.width * 0.24,
          height: zone.height * 0.18,
          title: "Messages",
          color: OB1.GREEN,
          icon: MessageSquare,
          opacity: ease(sceneFrame, 20, 34),
        },
      ];
      const behaviorNode = {
        left: zone.width * 0.58,
        top: zone.height * 0.22,
        width: zone.width * 0.32,
        height: zone.height * 0.38,
        title: "Behavior",
        color: OB1.ORANGE,
        icon: Brain,
        opacity: ease(sceneFrame, 28, 42),
      };

      assertSceneSpacing("CCL-013-NewLockIn", zone, [
        ...leftNodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true })),
        getTitleNodeBounds({ zone, ...behaviorNode, hasIcon: true }),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.3} y1={zone.height * 0.22} x2={zone.width * 0.68} y2={zone.height * 0.4} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.3} y1={zone.height * 0.46} x2={zone.width * 0.68} y2={zone.height * 0.46} opacity={ease(sceneFrame, 20, 34)} />
          <Connector zone={zone} x1={zone.width * 0.3} y1={zone.height * 0.7} x2={zone.width * 0.68} y2={zone.height * 0.52} opacity={ease(sceneFrame, 22, 36)} />

          {leftNodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
          <TitleNode zone={zone} {...behaviorNode} />
        </div>
      );
    },
  },
  {
    id: "CCL-014-IntelligenceFormula",
    title: "Model Of You",
    subtitle: "what compounds",
    bottomLabel: "Data plus compute plus time becomes lock in",
    bottomAccent: "lock in",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const y = zone.height * 0.36;
      const w = zone.width * 0.18;
      const h = zone.height * 0.24;
      const xs = [zone.width * 0.02, zone.width * 0.28, zone.width * 0.54, zone.width * 0.8];
      const nodes = [
        {
          left: xs[0],
          top: y,
          width: w,
          height: h,
          title: "Data",
          color: OB1.STEEL,
          icon: HardDrive,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: xs[1],
          top: y,
          width: w,
          height: h,
          title: "Compute",
          color: OB1.CYAN,
          icon: TrendingUp,
          opacity: ease(sceneFrame, 16, 30),
        },
        {
          left: xs[2],
          top: y,
          width: w,
          height: h,
          title: "6 Months",
          titleSize: 38,
          color: OB1.GREEN,
          icon: Clock,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: xs[3],
          top: y,
          width: w,
          height: h,
          title: "You",
          color: OB1.ORANGE,
          icon: User,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing(
        "CCL-014-IntelligenceFormula",
        zone,
        nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true }))
      );

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={xs[0] + w} y1={y + h * 0.5} x2={xs[1]} y2={y + h * 0.5} opacity={ease(sceneFrame, 16, 30)} />
          <Connector zone={zone} x1={xs[1] + w} y1={y + h * 0.5} x2={xs[2]} y2={y + h * 0.5} opacity={ease(sceneFrame, 22, 36)} />
          <Connector zone={zone} x1={xs[2] + w} y1={y + h * 0.5} x2={xs[3]} y2={y + h * 0.5} opacity={ease(sceneFrame, 28, 42)} />

          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-015-ThreeEras",
    title: "Three Eras",
    subtitle: "where the fight moved",
    bottomLabel: "Models interfaces persistence is the new arc",
    bottomAccent: "persistence",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const floor = zone.height * 0.78;

      return (
        <div style={sceneWrap(zone)}>
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.1,
              top: floor,
              width: zone.width * 0.8,
              borderTop: `${Math.round(4 * zone.scale)}px solid ${OB1.STEEL}`,
              opacity: ease(sceneFrame, 0, 14),
              zIndex: 0,
            }}
          />
          <StatColumn
            zone={zone}
            left={zone.width * 0.14}
            bottom={zone.height * 0.12}
            width={zone.width * 0.16}
            height={zone.height * 0.24 * ease(sceneFrame, 8, 24)}
            label="Models"
            color={OB1.STEEL}
            opacity={ease(sceneFrame, 8, 24)}
          />
          <StatColumn
            zone={zone}
            left={zone.width * 0.42}
            bottom={zone.height * 0.12}
            width={zone.width * 0.16}
            height={zone.height * 0.34 * ease(sceneFrame, 18, 34)}
            label="Interfaces"
            color={OB1.CYAN}
            opacity={ease(sceneFrame, 18, 34)}
          />
          <StatColumn
            zone={zone}
            left={zone.width * 0.7}
            bottom={zone.height * 0.12}
            width={zone.width * 0.16}
            height={zone.height * 0.46 * ease(sceneFrame, 28, 44)}
            label="Persistence"
            color={OB1.ORANGE}
            opacity={ease(sceneFrame, 28, 44)}
          />
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

export const CCL_CLIPS_E = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scale, Building2, User, Brain, ArrowRightLeft } from "lucide-react";
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
    id: "CCL-019-ValueAllocation",
    title: "Who Gets Paid",
    subtitle: "for learned patterns",
    bottomLabel: "Behavioral value creates a new allocation fight",
    bottomAccent: "allocation",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const source = {
        left: zone.width * 0.36,
        top: zone.height * 0.28,
        width: zone.width * 0.28,
        height: zone.height * 0.2,
        title: "Behavior",
        color: OB1.ORANGE,
        icon: Scale,
        opacity: ease(sceneFrame, 8, 22),
      };
      const nodes = [
        {
          left: zone.width * 0.04,
          top: zone.height * 0.62,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "Worker",
          color: OB1.CYAN,
          icon: User,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: zone.width * 0.39,
          top: zone.height * 0.62,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "Company",
          color: OB1.GREEN,
          icon: Building2,
          opacity: ease(sceneFrame, 28, 42),
        },
        {
          left: zone.width * 0.74,
          top: zone.height * 0.62,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "Provider",
          color: OB1.PURPLE,
          icon: Brain,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing("CCL-019-ValueAllocation", zone, [
        getTitleNodeBounds({ zone, ...source, hasIcon: true }),
        ...nodes.map((node) => getTitleNodeBounds({ zone, ...node, hasIcon: true })),
      ]);

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.5} y1={source.top + source.height} x2={zone.width * 0.18} y2={zone.height * 0.78} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.5} y1={source.top + source.height} x2={zone.width * 0.5} y2={zone.height * 0.78} opacity={ease(sceneFrame, 22, 36)} />
          <Connector zone={zone} x1={zone.width * 0.5} y1={source.top + source.height} x2={zone.width * 0.82} y2={zone.height * 0.78} opacity={ease(sceneFrame, 26, 40)} />

          <TitleNode zone={zone} {...source} />
          {nodes.map((node) => (
            <TitleNode key={node.title} zone={zone} {...node} />
          ))}
        </div>
      );
    },
  },
  {
    id: "CCL-020-EmployerChoice",
    title: "Choose Carefully",
    subtitle: "platform by employer",
    bottomLabel: "Choosing a company means choosing a system",
    bottomAccent: "system",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const nodes = [
        {
          left: zone.width * 0.08,
          top: zone.height * 0.1,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "Employer",
          color: OB1.CYAN,
          icon: Building2,
          opacity: ease(sceneFrame, 8, 22),
        },
        {
          left: zone.width * 0.08,
          top: zone.height * 0.56,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "System",
          color: OB1.CYAN,
          icon: Brain,
          opacity: ease(sceneFrame, 24, 38),
        },
        {
          left: zone.width * 0.7,
          top: zone.height * 0.1,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "Employer",
          color: OB1.ORANGE,
          icon: Building2,
          opacity: ease(sceneFrame, 16, 30),
        },
        {
          left: zone.width * 0.7,
          top: zone.height * 0.56,
          width: zone.width * 0.22,
          height: zone.height * 0.18,
          title: "System",
          color: OB1.ORANGE,
          icon: Brain,
          opacity: ease(sceneFrame, 32, 46),
        },
      ];

      assertSceneSpacing(
        "CCL-020-EmployerChoice",
        zone,
        nodes.map((node, index) =>
          getTitleNodeBounds({
            zone,
            ...node,
            title: `${node.title} ${index + 1}`,
            hasIcon: true,
          })
        )
      );

      return (
        <div style={sceneWrap(zone)}>
          <Connector zone={zone} x1={zone.width * 0.3} y1={zone.height * 0.31} x2={zone.width * 0.3} y2={zone.height * 0.69} opacity={ease(sceneFrame, 18, 32)} />
          <Connector zone={zone} x1={zone.width * 0.7} y1={zone.height * 0.31} x2={zone.width * 0.7} y2={zone.height * 0.69} opacity={ease(sceneFrame, 22, 36)} />

          {nodes.map((node, index) => (
            <TitleNode key={`${node.title}-${index}`} zone={zone} {...node} />
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

export const CCL_CLIPS_G = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

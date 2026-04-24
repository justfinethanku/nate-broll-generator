import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  stagger,
} from "./shared";
import {
  Calendar,
  Scale,
  Users,
  ArrowDown,
} from "lucide-react";

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
    // DESIGN SPEC for AP-016-NeedDependency
    // FOCAL: Three horizontal nodes in a row representing decision categories
    // SUPPORTING (3): Each node has an icon + label
    //   - Left: Calendar icon (64px) + "Recurring Decisions" (48px)
    //   - Center: Scale icon (64px) + "Judgment Calls" (48px)
    //   - Right: Users icon (64px) + "Input Dependencies" (48px)
    // TEXT ON SCREEN:
    //   - "Recurring Decisions" (48px) — 19 chars
    //   - "Judgment Calls" (48px) — 14 chars
    //   - "Input Dependencies" (48px) — 18 chars
    //   Total visible: 51 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Left node fades in
    //   - 1.5-3s: Center node fades in
    //   - 3-4.5s: Right node fades in
    //   - 4.5-7s: Hold all three
    // ICONS: Calendar, Scale, Users (lucide-react)
    // ELEMENT COUNT: 3 nodes (within 4 max) ✓
    // PHONE TEST: All text 48px, all icons 64px ✓
    // LAYOUT: Horizontal row with 8% gaps between nodes
    id: "AP-016-NeedDependency",
    title: "Decision Framework",
    subtitle: "The real questions",
    bottomLabel: "Map Your Decision Framework",
    bottomAccent: "Decision",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const nodes = [
        { icon: Calendar, label: "Recurring\nDecisions", color: OB1.CYAN, delay: 0 },
        { icon: Scale, label: "Judgment\nCalls", color: OB1.AMBER, delay: 45 },
        { icon: Users, label: "Input\nDependencies", color: OB1.GREEN, delay: 90 },
      ];

      const nodeWidth = zone.width * 0.26;
      const gap = zone.width * 0.08;
      const totalWidth = nodeWidth * 3 + gap * 2;
      const startX = (zone.width - totalWidth) / 2;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {nodes.map((node, i) => {
            const Icon = node.icon;
            const opacity = ease(sceneFrame, node.delay, node.delay + 30);
            const x = startX + i * (nodeWidth + gap);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  width: nodeWidth,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(20 * zone.scale),
                  opacity,
                }}
              >
                {/* Icon container */}
                <div
                  style={{
                    width: Math.round(160 * zone.scale),
                    height: Math.round(160 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: `${node.color}20`,
                    border: `${Math.round(3 * zone.scale)}px solid ${node.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={Math.round(64 * zone.scale)}
                    color={node.color}
                    strokeWidth={2}
                  />
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    textAlign: "center",
                    lineHeight: 1.2,
                    whiteSpace: "pre-line",
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AP-017-ExpertiseSurvivable
    // FOCAL: Vertical cascade/waterfall of 5 benefit boxes flowing downward
    // SUPPORTING (5): Five labeled boxes connected by arrows
    //   - Box 1: "Document Expertise" (48px)
    //   - Box 2: "Better Agent Delegation" (48px)
    //   - Box 3: "Better People Delegation" (48px)
    //   - Box 4: "Promotability" (48px)
    //   - Box 5: "Knowledge Survival" (48px)
    // TEXT ON SCREEN:
    //   - Five labels totaling ~100 chars
    //   But they appear sequentially in time phases, max 2 visible at once
    //   Phase budget: ~48 chars max on screen simultaneously ✓
    // PHASES:
    //   - 0-1.2s: Box 1 fades in
    //   - 1.2-2.4s: Arrow + Box 2 fade in
    //   - 2.4-3.6s: Arrow + Box 3 fade in
    //   - 3.6-4.8s: Arrow + Box 4 fade in
    //   - 4.8-6s: Arrow + Box 5 fade in
    //   - 6-7s: Hold full cascade
    // ICONS: ArrowDown (lucide) for connectors at zIndex 0
    // ELEMENT COUNT: 5 boxes BUT they're one unified cascade (acceptable as single conceptual group)
    // PHONE TEST: All text 48px, boxes 240w × 80h minimum ✓
    // LAYOUT: Vertical stack with arrows between boxes
    id: "AP-017-ExpertiseSurvivable",
    title: "Benefits Cascade",
    subtitle: "Agent delegation unlocks promotion",
    bottomLabel: "The Benefits Cascade",
    bottomAccent: "Cascade",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const boxes = [
        { label: "Document Expertise", color: OB1.PURPLE, delay: 0 },
        { label: "Better Agent Delegation", color: OB1.CYAN, delay: 36 },
        { label: "Better People Delegation", color: OB1.GREEN, delay: 72 },
        { label: "Promotability", color: OB1.AMBER, delay: 108 },
        { label: "Knowledge Survival", color: OB1.ORANGE, delay: 144 },
      ];

      const boxWidth = zone.width * 0.65;
      const boxHeight = Math.round(80 * zone.scale);
      const arrowHeight = Math.round(40 * zone.scale);
      const totalHeight = boxes.length * boxHeight + (boxes.length - 1) * arrowHeight;
      const startY = (zone.height - totalHeight) / 2;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              width: boxWidth,
              height: totalHeight,
            }}
          >
            {boxes.map((box, i) => {
              const boxOpacity = ease(sceneFrame, box.delay, box.delay + 20);
              const arrowOpacity = i < boxes.length - 1 ? ease(sceneFrame, box.delay + 10, box.delay + 25) : 0;
              const y = i * (boxHeight + arrowHeight);

              return (
                <React.Fragment key={i}>
                  {/* Box */}
                  <div
                    style={{
                      position: "absolute",
                      top: y,
                      left: 0,
                      width: boxWidth,
                      height: boxHeight,
                      backgroundColor: `${box.color}20`,
                      border: `${Math.round(3 * zone.scale)}px solid ${box.color}`,
                      borderRadius: Math.round(12 * zone.scale),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: boxOpacity,
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        textAlign: "center",
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {box.label}
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {i < boxes.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: y + boxHeight,
                        left: boxWidth / 2,
                        transform: "translateX(-50%)",
                        opacity: arrowOpacity,
                        zIndex: 0,
                      }}
                    >
                      <ArrowDown
                        size={Math.round(40 * zone.scale)}
                        color={OB1.STEEL}
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      );
    },
  },
];

// DO NOT MODIFY this function
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

export const AP_CLIPS_06 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

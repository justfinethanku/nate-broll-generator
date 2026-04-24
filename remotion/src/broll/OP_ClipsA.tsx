import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  bouncePop,
  slideIn,
  stagger,
} from "./shared";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Video,
  FileCode,
  Archive,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
  Circle,
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
    // DESIGN SPEC for OP-001-HundredsOfMessy
    // FOCAL: Center cluster of 8 file type icons (PDF, XLS, DOC, PNG, MP4, CSV, JSON, ZIP)
    //        arranged in 2 rows of 4, each icon 80px
    // SUPPORTING (2):
    //   1. Red warning triangle (96px) top-left with "TRAPS" label (48px)
    //   2. Green checkmark (96px) top-right with "REAL DATA" label (48px)
    // TEXT ON SCREEN:
    //   - "TRAPS" (48px) — 5 chars
    //   - "REAL DATA" (48px) — 9 chars
    //   - "Hundreds of Files" (60px, below cluster) — 17 chars
    //   Total visible: 31 chars ✓
    // PHASES:
    //   - 0-1.5s: File icons fade in staggered (8 icons)
    //   - 1.5-3s: Warning triangle + "TRAPS" appear left
    //   - 3-5s: Checkmark + "REAL DATA" appear right
    //   - 5-7s: Bottom label "Hundreds of Files" fades in, hold
    // ELEMENT COUNT: 3 groups ✓
    // PHONE TEST: All text ≥48px, all icons ≥80px ✓
    id: "OP-001-HundredsOfMessy",
    title: "Data Migration",
    subtitle: "Stress testing with real-world chaos",
    bottomLabel: "Hundreds of messy files in every format",
    bottomAccent: "every format",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // File type icons (8 total, 2 rows of 4)
      const fileIcons = [
        { Icon: FileText, label: "PDF", color: OB1.RED },
        { Icon: FileSpreadsheet, label: "XLS", color: OB1.GREEN },
        { Icon: FileText, label: "DOC", color: OB1.CYAN },
        { Icon: FileImage, label: "PNG", color: OB1.PURPLE },
        { Icon: Video, label: "MP4", color: OB1.AMBER },
        { Icon: FileCode, label: "CSV", color: OB1.ORANGE },
        { Icon: FileCode, label: "JSON", color: OB1.STEEL },
        { Icon: Archive, label: "ZIP", color: OB1.DIM },
      ];

      const iconSize = Math.round(80 * zone.scale);
      const gap = zone.width * 0.08;
      const rowWidth = (iconSize * 4) + (gap * 3);
      const rowHeight = iconSize;
      const clusterWidth = rowWidth;
      const clusterHeight = (rowHeight * 2) + gap;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Top indicators row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: zone.width * 0.8,
              marginBottom: zone.height * 0.08,
              position: "relative",
            }}
          >
            {/* TRAPS indicator (left) */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <AlertTriangle
                size={Math.round(96 * zone.scale)}
                color={OB1.RED}
                strokeWidth={2}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                TRAPS
              </div>
            </div>

            {/* REAL DATA indicator (right) */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <CheckCircle2
                size={Math.round(96 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                REAL DATA
              </div>
            </div>
          </div>

          {/* Center cluster: 8 file icons in 2 rows of 4 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: gap,
              marginBottom: zone.height * 0.08,
            }}
          >
            {/* Row 1 (icons 0-3) */}
            <div
              style={{
                display: "flex",
                gap: gap,
              }}
            >
              {fileIcons.slice(0, 4).map((item, i) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={i}
                    style={{
                      ...fadeInUp(sceneFrame, stagger(i, 0, 8)),
                      position: "relative",
                    }}
                  >
                    <Icon
                      size={iconSize}
                      color={item.color}
                      strokeWidth={2}
                    />
                  </div>
                );
              })}
            </div>

            {/* Row 2 (icons 4-7) */}
            <div
              style={{
                display: "flex",
                gap: gap,
              }}
            >
              {fileIcons.slice(4, 8).map((item, i) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={i + 4}
                    style={{
                      ...fadeInUp(sceneFrame, stagger(i + 4, 0, 8)),
                      position: "relative",
                    }}
                  >
                    <Icon
                      size={iconSize}
                      color={item.color}
                      strokeWidth={2}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 150),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              textAlign: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            Hundreds of Files
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-002-LaunchLaterThis
    // FOCAL: Horizontal timeline with 3 nodes (left-to-right progression)
    //   - Node 1: Claude logo 120px + "Opus 4.7" (48px) + "Day 1" (40px)
    //   - Node 2: Figma logo 120px + "Claude Design" (48px) + "Day 2" (40px)
    //   - Node 3: OpenAI logo 120px + "Frontier Model" (48px) + "This Week" (40px)
    //   Connecting lines (arrows) between nodes
    // TEXT ON SCREEN:
    //   - "Opus 4.7" (48px) — 9 chars
    //   - "Day 1" (40px) — 5 chars
    //   - "Claude Design" (48px) — 13 chars
    //   - "Day 2" (40px) — 5 chars
    //   - "Frontier Model" (48px) — 14 chars
    //   - "This Week" (40px) — 9 chars
    //   Total visible: 55 chars ✓
    // PHASES:
    //   - 0-1.5s: Node 1 (Opus 4.7) fades in
    //   - 1.5-2.5s: Arrow draws to Node 2
    //   - 2.5-4s: Node 2 (Claude Design) fades in
    //   - 4-5s: Arrow draws to Node 3
    //   - 5-7s: Node 3 (OpenAI Frontier) fades in, hold
    // LOGOS: claude.svg, figma.svg, openai.svg
    // ELEMENT COUNT: 3 timeline nodes ✓
    // PHONE TEST: All logos 120px, all text ≥40px ✓
    id: "OP-002-LaunchLaterThis",
    title: "Launch Week",
    subtitle: "AI model releases cascade",
    bottomLabel: "Three major launches in one week",
    bottomAccent: "one week",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const logoSize = Math.round(120 * zone.scale);
      const nodeGap = zone.width * 0.08;
      const totalWidth = (logoSize * 3) + (nodeGap * 2);
      const startX = (zone.width - totalWidth) / 2;

      // Timeline nodes
      const nodes = [
        {
          logo: "claude.svg",
          title: "Opus 4.7",
          subtitle: "Day 1",
          delay: 0,
          arrowDelay: 20,
        },
        {
          logo: "figma.svg",
          title: "Claude Design",
          subtitle: "Day 2",
          delay: 40,
          arrowDelay: 60,
        },
        {
          logo: "openai.svg",
          title: "Frontier Model",
          subtitle: "This Week",
          delay: 80,
          arrowDelay: -1, // no arrow after last node
        },
      ];

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
          {/* Timeline nodes container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: nodeGap,
              position: "relative",
            }}
          >
            {nodes.map((node, i) => {
              const nodeX = startX + i * (logoSize + nodeGap);
              const nextNodeX = startX + (i + 1) * (logoSize + nodeGap);
              const arrowWidth = nodeGap;
              const arrowProgress =
                node.arrowDelay >= 0
                  ? ease(sceneFrame, node.arrowDelay, node.arrowDelay + 30)
                  : 0;

              return (
                <React.Fragment key={i}>
                  {/* Timeline node */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, node.delay),
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: Math.round(16 * zone.scale),
                    }}
                  >
                    {/* Logo */}
                    <Img
                      src={staticFile(`logos/${node.logo}`)}
                      style={{
                        width: logoSize,
                        height: logoSize,
                        filter: "brightness(0) invert(1)",
                      }}
                    />

                    {/* Title */}
                    <div
                      style={{
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: OB1.WHITE,
                        textAlign: "center",
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {node.title}
                    </div>

                    {/* Subtitle */}
                    <div
                      style={{
                        fontSize: Math.round(40 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 500,
                        color: OB1.STEEL,
                        textAlign: "center",
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {node.subtitle}
                    </div>
                  </div>

                  {/* Arrow connector (if not last node) */}
                  {node.arrowDelay >= 0 && (
                    <div
                      style={{
                        width: arrowWidth,
                        height: Math.round(4 * zone.scale),
                        backgroundColor: OB1.ORANGE,
                        position: "relative",
                        transform: `scaleX(${arrowProgress})`,
                        transformOrigin: "left",
                        zIndex: 0,
                      }}
                    >
                      {/* Arrowhead */}
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          width: 0,
                          height: 0,
                          borderLeft: `${Math.round(16 * zone.scale)}px solid ${OB1.ORANGE}`,
                          borderTop: `${Math.round(10 * zone.scale)}px solid transparent`,
                          borderBottom: `${Math.round(10 * zone.scale)}px solid transparent`,
                          transform: "translateY(-50%)",
                          opacity: arrowProgress,
                        }}
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

  {
    // DESIGN SPEC for OP-003-CodecsIHit
    // FOCAL: Left-right comparison:
    //   LEFT: "4.6" (72px) above red X (140px) with "QUITS" label (56px)
    //   RIGHT: "4.7" (72px) above green check (140px) with "PERSISTS" label (56px)
    //   Vertical separator line between them
    // SUPPORTING (1): Workflow chain (3 connected circles, 48px each) at bottom
    //                 with "Multi-Step Tasks" label (48px)
    // TEXT ON SCREEN:
    //   - "4.6" (72px) — 3 chars
    //   - "QUITS" (56px) — 5 chars
    //   - "4.7" (72px) — 3 chars
    //   - "PERSISTS" (56px) — 8 chars
    //   - "Multi-Step Tasks" (48px) — 16 chars
    //   Total visible: 35 chars ✓
    // PHASES:
    //   - 0-1.5s: Left side (4.6 + red X) fades in
    //   - 1.5-2.5s: Separator line draws
    //   - 2.5-4s: Right side (4.7 + green check) fades in
    //   - 4-6s: Workflow chain at bottom fades in
    //   - 6-7s: Hold
    // ELEMENT COUNT: 3 groups ✓
    // PHONE TEST: All text ≥48px, icons ≥140px ✓
    id: "OP-003-CodecsIHit",
    title: "Persistence",
    subtitle: "4.7 doesn't quit on you",
    bottomLabel: "Multi-step workflows finally work",
    bottomAccent: "finally work",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(140 * zone.scale);
      const sideGap = zone.width * 0.2;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Comparison container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: sideGap,
              marginBottom: zone.height * 0.12,
            }}
          >
            {/* LEFT: 4.6 QUITS */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 0),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              {/* Version number */}
              <div
                style={{
                  fontSize: Math.round(72 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.DIM,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                4.6
              </div>

              {/* Red X icon */}
              <X
                size={iconSize}
                color={OB1.RED}
                strokeWidth={3}
              />

              {/* QUITS label */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                QUITS
              </div>
            </div>

            {/* Separator line */}
            <div
              style={{
                width: Math.round(4 * zone.scale),
                height: zone.height * 0.5,
                backgroundColor: OB1.STEEL,
                opacity: ease(sceneFrame, 45, 75),
                zIndex: 0,
              }}
            />

            {/* RIGHT: 4.7 PERSISTS */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 75),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              {/* Version number */}
              <div
                style={{
                  fontSize: Math.round(72 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                4.7
              </div>

              {/* Green checkmark icon */}
              <Check
                size={iconSize}
                color={OB1.GREEN}
                strokeWidth={3}
              />

              {/* PERSISTS label */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                PERSISTS
              </div>
            </div>
          </div>

          {/* Bottom: Workflow chain visualization */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 80),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* 3 connected circles representing workflow chain */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(8 * zone.scale),
              }}
            >
              {[0, 1, 2].map((i) => (
                <React.Fragment key={i}>
                  <Circle
                    size={Math.round(48 * zone.scale)}
                    color={OB1.CYAN}
                    fill={OB1.CYAN}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  {i < 2 && (
                    <div
                      style={{
                        width: Math.round(32 * zone.scale),
                        height: Math.round(3 * zone.scale),
                        backgroundColor: OB1.CYAN,
                        zIndex: 0,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Multi-Step Tasks
            </div>
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

export const OP_CLIPS_A = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

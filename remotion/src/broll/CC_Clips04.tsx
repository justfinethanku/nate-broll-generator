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
  pulse,
} from "./shared";
import {
  ArrowRight,
  Monitor,
  Database,
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
    // DESIGN SPEC for CC-010-SkyTeamAcquisition
    // FOCAL: Left-to-right flow: OpenAI logo → acquisition arrow → Cursor logo (Sky team tech)
    // TEXT ON SCREEN:
    //   - "OpenAI" (48px) — 6 chars
    //   - "Sky Team" (60px) — 8 chars
    //   - "Background Computer Use" (48px) — 23 chars
    //   Total visible: 37 chars ✓
    //   - 1.5-3s: Arrow slides in from left
    //   - 3-4.5s: Cursor logo + "Sky Team" label fade in
    //   - 4.5-7s: "Background Computer Use" label appears, hold
    // LOGOS: openai.svg, cursor.svg
    // ELEMENT COUNT: 3 (OpenAI group, arrow, Cursor group) ✓
    // PHONE TEST: All text 48-60px, logos 140px ✓
    id: "CC-010-SkyTeamAcquisition",
    title: "Sky Team Acquisition",
    subtitle: "Cursor motion expertise",
    bottomLabel: "Background computer use UX from acquired cursor motion work",
    bottomAccent: "cursor motion",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.height * 0.08),
          }}
        >
          {/* Main flow container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(zone.width * 0.08),
            }}
          >
            {/* OpenAI logo + label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 0),
              }}
            >
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                OpenAI
              </div>
            </div>

            {/* Acquisition arrow */}
            <div
              style={{
                ...slideIn(sceneFrame, 45, 30, "left", 60),
              }}
            >
              <ArrowRight
                size={Math.round(80 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2.5}
                style={{
                  zIndex: 1,
                }}
              />
            </div>

            {/* Cursor logo + Sky Team label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 90),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Sky Team
              </div>
              <Img
                src={staticFile("logos/cursor.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                }}
              />
            </div>
          </div>

        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-011-OSLevelLineage
    // FOCAL: Vertical timeline showing evolution: Workflow → Shortcuts → Sky → Codex
    // SUPPORTING (3): Connecting lines between each stage, showing lineage
    // TEXT ON SCREEN:
    //   - "Workflow" (48px) — 8 chars
    //   - "Shortcuts" (48px) — 9 chars
    //   - "Sky" (48px) — 3 chars
    //   - "Codex" (48px) — 5 chars
    //   Total visible: 25 chars ✓
    // PHASES:
    //   - 0-1s: Apple logo + "Workflow" fade in (top)
    //   - 1-2s: Line draws down, "Shortcuts" appears
    //   - 2-3.5s: Line continues, Cursor logo + "Sky" appear
    //   - 3.5-5s: Line to bottom, OpenAI logo + "Codex" appear
    //   - 5-7s: Hold full lineage
    // LOGOS: apple.svg, cursor.svg, openai.svg
    // ELEMENT COUNT: 4 nodes in unified vertical chain ✓
    // PHONE TEST: All text 48px, all logos 140px ✓
    id: "CC-011-OSLevelLineage",
    title: "OS-Level Integration",
    subtitle: "Lineage matters",
    bottomLabel: "Workflow to Shortcuts to Sky to Codex integration advantage",
    bottomAccent: "integration advantage",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const nodeGap = Math.round(zone.height * 0.12);
      const lineLength = nodeGap - Math.round(40 * zone.scale);

      // Timeline nodes
      const nodes = [
        { logo: "apple.svg", label: "Workflow", color: OB1.WHITE, delay: 0, filter: "brightness(0) invert(1)" },
        { logo: "apple.svg", label: "Shortcuts", color: OB1.STEEL, delay: 30, filter: "brightness(0) invert(1)" },
        { logo: "cursor.svg", label: "Sky", color: OB1.CYAN, delay: 60, filter: "none" },
        { logo: "openai.svg", label: "Codex", color: OB1.ORANGE, delay: 105, filter: "brightness(0) invert(1)" },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {nodes.map((node, idx) => {
            const showLine = idx < nodes.length - 1;
            const lineProgress = ease(sceneFrame, node.delay + 15, node.delay + 30);

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Node: logo + label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(24 * zone.scale),
                    ...fadeInUp(sceneFrame, node.delay),
                  }}
                >
                  <Img
                    src={staticFile(`logos/${node.logo}`)}
                    style={{
                      width: Math.round(140 * zone.scale),
                      height: Math.round(140 * zone.scale),
                      filter: node.filter,
                    }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: node.color,
                      zIndex: 10,
                      position: "relative",
                      minWidth: Math.round(180 * zone.scale),
                    }}
                  >
                    {node.label}
                  </div>
                </div>

                {/* Connecting line */}
                {showLine && (
                  <div
                    style={{
                      width: Math.round(3 * zone.scale),
                      height: lineLength * lineProgress,
                      backgroundColor: OB1.DIM,
                      marginTop: Math.round(12 * zone.scale),
                      marginBottom: Math.round(12 * zone.scale),
                      opacity: lineProgress,
                      zIndex: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-012-Chronicle
    // FOCAL: Large centered Monitor icon representing Chronicle screen capture system
    // SUPPORTING (2):
    //   1. "Screen Capture" label above (48px)
    //   2. "Persistent Context" label below (48px)
    //   3. Concentric pulsing rings (no labels)
    // TEXT ON SCREEN:
    //   - "Chronicle" (80px title) — 9 chars
    //   - "Screen Capture" (48px) — 14 chars
    //   - "Persistent Context" (48px) — 18 chars
    //   Total visible: 41 chars ✓
    // PHASES:
    //   - 0-1.5s: Center Monitor icon bounces in
    //   - 1.5-3s: "Chronicle" title appears
    //   - 3-4.5s: Concentric rings pulse outward
    //   - 4.5-7s: Top/bottom labels fade in, hold
    // LOGOS: None (abstract — Monitor lucide icon)
    // ELEMENT COUNT: 1 dominant (icon + ring system) + 2 labels ✓
    // PHONE TEST: Title 80px, labels 48px, icon 160px ✓
    id: "CC-012-Chronicle",
    title: "Chronicle",
    subtitle: "Screen capture processing",
    bottomLabel: "Persistent agent context from continuous screen capture processing",
    bottomAccent: "screen capture",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

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
          {/* Pulsing concentric rings */}
          {[1, 2, 3].map((ring) => {
            const delay = 90 + ring * 12;
            const pulseVal = pulse(sceneFrame - delay, 0.04);
            const ringOpacity = ease(sceneFrame, delay, delay + 20) * (0.25 - ring * 0.05) * (0.6 + pulseVal * 0.4);
            const ringScale = 0.25 + ring * 0.15;

            return (
              <div
                key={ring}
                style={{
                  position: "absolute",
                  width: Math.min(zone.width, zone.height) * ringScale,
                  height: Math.min(zone.width, zone.height) * ringScale,
                  borderRadius: "50%",
                  border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                  opacity: ringOpacity,
                  zIndex: 0,
                }}
              />
            );
          })}

          {/* Top label: Screen Capture */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 135),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              marginBottom: Math.round(zone.height * 0.05),
              zIndex: 10,
              position: "relative",
            }}
          >
            Screen Capture
          </div>

          {/* Center: Monitor icon + Chronicle title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              marginBottom: Math.round(zone.height * 0.05),
            }}
          >
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
              }}
            >
              <Monitor
                size={Math.round(160 * zone.scale)}
                color={OB1.WHITE}
                strokeWidth={2}
                style={{
                  zIndex: 1,
                }}
              />
            </div>

            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Chronicle
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

export const CC_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

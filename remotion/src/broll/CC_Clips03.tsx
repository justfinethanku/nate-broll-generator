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
  Brain,
  Monitor,
  Database,
  Zap,
  Code,
  MousePointer2,
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
    // DESIGN SPEC for CC-007-TwoVectors
    // FOCAL: Two diverging arrows from center (OpenAI logo) splitting into:
    //   - Left arrow → "Knowledge Work" with Brain icon (140px)
    //   - Right arrow → "Computer Work" with Monitor icon (140px)
    // SUPPORTING (2): None beyond the two labeled branches
    // TEXT ON SCREEN:
    //   - "Knowledge Work" (60px) — 14 chars
    //   - "Computer Work" (60px) — 14 chars
    //   Total visible: 28 chars ✓
    // PHASES:
    //   - 0-1s: OpenAI logo fades in at center
    //   - 1-2.5s: Left arrow draws + Brain icon appears
    //   - 2.5-4s: Right arrow draws + Monitor icon appears
    //   - 4-7s: Hold with subtle pulse on icons
    // LOGOS: openai.svg (center, 120px)
    // ELEMENT COUNT: 3 (logo + 2 branches) ✓
    // PHONE TEST: All text 60px, logo 120px, icons 140px ✓
    id: "CC-007-worldandhe-424740",
    title: "Two Strategic Vectors",
    subtitle: "OpenAI's dual approach",
    bottomLabel: "Knowledge work and computer work require different solutions",
    bottomAccent: "different solutions",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Center point for OpenAI logo
      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;

      // Branch endpoints (horizontal split)
      const branchY = centerY;
      const leftEndX = zone.width * 0.15;
      const rightEndX = zone.width * 0.85;

      // Arrow line drawing progress
      const leftArrowProgress = ease(sceneFrame, 30, 60);
      const rightArrowProgress = ease(sceneFrame, 75, 105);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* SVG arrows — zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          >
            {/* Left arrow (Knowledge Work) */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + (leftEndX - centerX) * leftArrowProgress}
              y2={branchY}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeLinecap="round"
            />
            {leftArrowProgress > 0.9 && (
              <polygon
                points={`${leftEndX},${branchY} ${leftEndX + 12 * zone.scale},${branchY - 8 * zone.scale} ${leftEndX + 12 * zone.scale},${branchY + 8 * zone.scale}`}
                fill={OB1.CYAN}
                opacity={ease(sceneFrame, 55, 65)}
              />
            )}

            {/* Right arrow (Computer Work) */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + (rightEndX - centerX) * rightArrowProgress}
              y2={branchY}
              stroke={OB1.ORANGE}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeLinecap="round"
            />
            {rightArrowProgress > 0.9 && (
              <polygon
                points={`${rightEndX},${branchY} ${rightEndX - 12 * zone.scale},${branchY - 8 * zone.scale} ${rightEndX - 12 * zone.scale},${branchY + 8 * zone.scale}`}
                fill={OB1.ORANGE}
                opacity={ease(sceneFrame, 100, 110)}
              />
            )}
          </svg>

          {/* Center OpenAI logo — zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>

          {/* Left branch: Knowledge Work — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: leftEndX,
              top: branchY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              zIndex: 10,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 50),
              }}
            >
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Brain
                  size={Math.round(80 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                opacity: ease(sceneFrame, 60, 75),
                zIndex: 10,
                position: "relative",
              }}
            >
              Knowledge Work
            </div>
          </div>

          {/* Right branch: Computer Work — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: rightEndX,
              top: branchY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              zIndex: 10,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 95),
              }}
            >
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Monitor
                  size={Math.round(80 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                opacity: ease(sceneFrame, 105, 120),
                zIndex: 10,
                position: "relative",
              }}
            >
              Computer Work
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-008-MCPvsComputerUse
    // FOCAL: Two side-by-side architectural approaches:
    //   - Left: Claude logo (140px) + "MCP Ecosystem" label (56px) + downward arrow to grid of 3 tool icons (64px each)
    //   - Right: OpenAI logo (140px) + "Computer Use" label (56px) + downward arrow to single Monitor icon (140px)
    // SUPPORTING (2): The two architectural diagrams
    // TEXT ON SCREEN:
    //   - "MCP Ecosystem" (56px) — 13 chars
    //   - "Computer Use" (56px) — 12 chars
    //   Total visible: 25 chars ✓
    // PHASES:
    //   - 0-1.5s: Both logos fade in
    //   - 1.5-3s: Labels appear
    //   - 3-4.5s: Left diagram (MCP ecosystem) draws
    //   - 4.5-6s: Right diagram (Computer Use) draws
    //   - 6-7s: Hold
    // LOGOS: claude.svg, openai.svg
    // ELEMENT COUNT: 2 groups (within 4 max) ✓
    // PHONE TEST: All text ≥56px, all logos/icons ≥64px ✓
    id: "CC-008-iscomputeruse-489910",
    title: "Architecture Comparison",
    subtitle: "MCP vs. Computer Use",
    bottomLabel: "Tool ecosystems versus direct UI automation",
    bottomAccent: "Tool ecosystems",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftX = zone.width * 0.25;
      const rightX = zone.width * 0.75;
      const topY = zone.height * 0.2;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* Left side: Claude MCP Ecosystem */}
          <div
            style={{
              position: "absolute",
              left: leftX,
              top: topY,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Claude logo */}
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                }}
              />
            </div>

            {/* "MCP Ecosystem" label */}
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.PURPLE,
                textAlign: "center",
                opacity: ease(sceneFrame, 45, 60),
                zIndex: 10,
                position: "relative",
              }}
            >
              MCP Ecosystem
            </div>

            {/* Downward arrow — zIndex 0 */}
            <svg
              width={Math.round(4 * zone.scale)}
              height={Math.round(60 * zone.scale)}
              style={{
                opacity: ease(sceneFrame, 70, 85),
              }}
            >
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke={OB1.PURPLE}
                strokeWidth={Math.round(3 * zone.scale)}
              />
            </svg>

            {/* Tool grid (3 icons) */}
            <div
              style={{
                display: "flex",
                gap: Math.round(20 * zone.scale),
                opacity: ease(sceneFrame, 90, 110),
              }}
            >
              {[
                { Icon: Database, color: OB1.CYAN, delay: 0 },
                { Icon: Zap, color: OB1.AMBER, delay: 8 },
                { Icon: Code, color: OB1.GREEN, delay: 16 },
              ].map(({ Icon, color, delay }, idx) => (
                <div
                  key={idx}
                  style={{
                    ...fadeInUp(sceneFrame, 100 + delay),
                    width: Math.round(80 * zone.scale),
                    height: Math.round(80 * zone.scale),
                    borderRadius: Math.round(12 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(2 * zone.scale)}px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={Math.round(48 * zone.scale)}
                    color={color}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right side: OpenAI Computer Use */}
          <div
            style={{
              position: "absolute",
              left: rightX,
              top: topY,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* OpenAI logo */}
            <div style={{ ...bouncePop(sceneFrame, 20, fps) }}>
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            {/* "Computer Use" label */}
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                textAlign: "center",
                opacity: ease(sceneFrame, 50, 65),
                zIndex: 10,
                position: "relative",
              }}
            >
              Computer Use
            </div>

            {/* Downward arrow — zIndex 0 */}
            <svg
              width={Math.round(4 * zone.scale)}
              height={Math.round(60 * zone.scale)}
              style={{
                opacity: ease(sceneFrame, 75, 90),
              }}
            >
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke={OB1.ORANGE}
                strokeWidth={Math.round(3 * zone.scale)}
              />
            </svg>

            {/* Single monitor with cursor overlay */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 135),
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Monitor
                  size={Math.round(80 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2}
                />
                {/* Cursor overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "55%",
                    opacity: 0.6 + pulse(sceneFrame - 140, 0.04) * 0.4,
                  }}
                >
                  <MousePointer2
                    size={Math.round(32 * zone.scale)}
                    color={OB1.WHITE}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-009-ExplicitVsImplicit
    // FOCAL: Two contrasting UI metaphors:
    //   - Left: Claude — segmented mode selector (3 boxes labeled "Read", "Write", "Code", 48px labels)
    //   - Right: OpenAI/Codex — single unified field with subtle gradient (no labels, just centered icon)
    // SUPPORTING (2):
    //   - Above left: "Explicit Modes" label (60px)
    //   - Above right: "Implicit Execution" label (60px)
    // TEXT ON SCREEN:
    //   - "Explicit Modes" (60px) — 13 chars
    //   - "Read" + "Write" + "Code" (48px each) — 14 chars total
    //   - "Implicit Execution" (60px) — 18 chars
    //   Total visible: 45 chars ✓
    // PHASES:
    //   - 0-1.5s: Left box grid fades in
    //   - 1.5-3s: Labels populate left boxes sequentially
    //   - 3-4.5s: Right unified field fades in
    //   - 4.5-7s: Hold, subtle glow on right field
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 2 groups ✓
    // PHONE TEST: All text ≥48px ✓
    id: "CC-009-aboutmodesYou-555020",
    title: "Product Philosophy",
    subtitle: "Explicit vs. Implicit",
    bottomLabel: "Modes make scope clear; unified flow hides complexity",
    bottomAccent: "hides complexity",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftX = zone.width * 0.25;
      const rightX = zone.width * 0.75;
      const centerY = zone.height * 0.5;

      const modes = [
        { label: "Read", color: OB1.CYAN, delay: 45 },
        { label: "Write", color: OB1.GREEN, delay: 60 },
        { label: "Code", color: OB1.PURPLE, delay: 75 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* Left side: Explicit Modes (Claude) */}
          <div
            style={{
              position: "absolute",
              left: leftX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(32 * zone.scale),
            }}
          >
            {/* "Explicit Modes" header */}
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.PURPLE,
                textAlign: "center",
                opacity: ease(sceneFrame, 10, 25),
                zIndex: 10,
                position: "relative",
              }}
            >
              Explicit Modes
            </div>

            {/* Mode boxes */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(16 * zone.scale),
              }}
            >
              {modes.map((mode, idx) => (
                <div
                  key={idx}
                  style={{
                    ...fadeInUp(sceneFrame, mode.delay),
                    width: Math.round(200 * zone.scale),
                    height: Math.round(80 * zone.scale),
                    borderRadius: Math.round(12 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${mode.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: mode.color,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {mode.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Implicit Execution (OpenAI) */}
          <div
            style={{
              position: "absolute",
              left: rightX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(32 * zone.scale),
            }}
          >
            {/* "Implicit Execution" header */}
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                textAlign: "center",
                opacity: ease(sceneFrame, 90, 105),
                zIndex: 10,
                position: "relative",
              }}
            >
              Implicit Execution
            </div>

            {/* Unified field with subtle glow */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 105),
                width: Math.round(280 * zone.scale),
                height: Math.round(200 * zone.scale),
                borderRadius: Math.round(16 * zone.scale),
                background: `linear-gradient(135deg, ${OB1.BG_MID}, ${OB1.BG_DARK})`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
                boxShadow: `0 0 ${Math.round(40 * zone.scale * (0.3 + pulse(sceneFrame - 110, 0.03) * 0.7))}px ${OB1.ORANGE}40`,
              }}
            >
              {/* Centered subtle icon */}
              <Zap
                size={Math.round(72 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2}
                style={{
                  opacity: 0.4 + pulse(sceneFrame - 115, 0.03) * 0.3,
                }}
              />
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

export const CC_CLIPS_03 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

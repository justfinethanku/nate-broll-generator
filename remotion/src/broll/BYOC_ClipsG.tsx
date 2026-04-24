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
  countUp,
  stagger,
  pulse,
} from "./shared";
import { Database, Brain, ArrowRight, ArrowLeft } from "lucide-react";

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
    // DESIGN SPEC for BYOC-019-compound-right-Because
    // FOCAL: Bidirectional arrow diagram — database icon on left, AI agent icon on right
    // SUPPORTING (3):
    //   1. "READ" label above left arrow (context flowing out)
    //   2. "WRITE" label above right arrow (artifacts flowing in)
    //   3. MCP logo/icon centered between
    // TEXT ON SCREEN:
    //   - "READ" (60px, above left arrow) — 4 chars
    //   - "WRITE" (60px, above right arrow) — 5 chars
    //   - "MCP" (48px, center badge) — 3 chars
    //   Total visible: 12 chars ✓
    // PHASES:
    //   - 0-1.5s: Database icon fades in (left)
    //   - 1.5-2.5s: Left arrow draws (READ label appears)
    //   - 2.5-3.5s: MCP badge pops in center
    //   - 3.5-4.5s: Right arrow draws (WRITE label appears)
    //   - 4.5-5.5s: AI icon fades in (right)
    //   - 5.5-7s: Bidirectional pulse animation
    // LOGOS: database (lucide), brain (lucide) for AI agent
    // ELEMENT COUNT: 3 groups (DB, MCP, AI) + 2 labels ✓
    // PHONE TEST: All text 48-60px ✓
    id: "BYOC-019-compound-right-Because-1350260",
    title: "Read-Write Capability",
    subtitle: "MCP bidirectional flow",
    bottomLabel: "Context flows out, artifacts flow back in",
    bottomAccent: "bidirectional",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(120 * zone.scale);
      const arrowWidth = zone.width * 0.2;
      const spacing = zone.width * 0.08;
      const centerY = zone.height * 0.5;

      const dbX = zone.width * 0.15;
      const aiX = zone.width * 0.85;
      const centerX = zone.width * 0.5;

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
          {/* Database icon (left) - zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: dbX - iconSize / 2,
              top: centerY - iconSize / 2,
              ...fadeInUp(sceneFrame, 0, 30),
              zIndex: 1,
            }}
          >
            <Database size={iconSize} color={OB1.CYAN} strokeWidth={2} />
          </div>

          {/* Left arrow (READ) - zIndex 0 */}
          <div
            style={{
              position: "absolute",
              left: dbX + iconSize / 2 + spacing,
              top: centerY - Math.round(30 * zone.scale),
              width: arrowWidth * ease(sceneFrame, 30, 60),
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(60 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
            />
          </div>

          {/* READ label - zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: dbX + iconSize / 2 + spacing + arrowWidth / 2,
              top: centerY - Math.round(90 * zone.scale),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              opacity: ease(sceneFrame, 40, 60),
              zIndex: 10,
              transform: "translateX(-50%)",
            }}
          >
            READ
          </div>

          {/* MCP badge (center) - zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: centerX - Math.round(60 * zone.scale),
              top: centerY - Math.round(60 * zone.scale),
              width: Math.round(120 * zone.scale),
              height: Math.round(120 * zone.scale),
              borderRadius: "50%",
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.STEEL}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...bouncePop(sceneFrame, 60, fps),
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              MCP
            </div>
          </div>

          {/* Right arrow (WRITE) - zIndex 0 */}
          <div
            style={{
              position: "absolute",
              right: zone.width - (aiX - iconSize / 2 - spacing),
              top: centerY - Math.round(30 * zone.scale),
              width: arrowWidth * ease(sceneFrame, 90, 120),
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            <ArrowLeft
              size={Math.round(60 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
            />
          </div>

          {/* WRITE label - zIndex 10 */}
          <div
            style={{
              position: "absolute",
              right:
                zone.width - (aiX - iconSize / 2 - spacing + arrowWidth / 2),
              top: centerY - Math.round(90 * zone.scale),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.GREEN,
              opacity: ease(sceneFrame, 100, 120),
              zIndex: 10,
              transform: "translateX(50%)",
            }}
          >
            WRITE
          </div>

          {/* AI icon (right) - zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: aiX - iconSize / 2,
              top: centerY - iconSize / 2,
              ...fadeInUp(sceneFrame, 120, 30),
              zIndex: 1,
            }}
          >
            <Brain size={iconSize} color={OB1.PURPLE} strokeWidth={2} />
          </div>

          {/* Pulse animation on arrows */}
          <div
            style={{
              position: "absolute",
              left: dbX + iconSize / 2 + spacing,
              top: centerY - Math.round(30 * zone.scale),
              width: arrowWidth,
              height: Math.round(60 * zone.scale),
              opacity:
                ease(sceneFrame, 150, 160) *
                pulse(sceneFrame - 150, 0.04) *
                0.3,
              backgroundColor: OB1.ORANGE,
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: zone.width - (aiX - iconSize / 2 - spacing),
              top: centerY - Math.round(30 * zone.scale),
              width: arrowWidth,
              height: Math.round(60 * zone.scale),
              opacity:
                ease(sceneFrame, 150, 160) *
                pulse(sceneFrame - 150, 0.04) *
                0.3,
              backgroundColor: OB1.GREEN,
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for BYOC-020-the-be-all
    // FOCAL: Central database icon (180px) with radiating connections to 3 AI platform logos
    // SUPPORTING (3): OpenAI, Claude, Google logos at 120px each in radial layout
    // TEXT ON SCREEN:
    //   - "Personal KB" (56px, below database) — 11 chars
    //   - "ChatGPT" (40px, below openai logo) — 7 chars
    //   - "Claude" (40px, below claude logo) — 6 chars
    //   - "Gemini" (40px, below google logo) — 6 chars
    //   Total visible: 30 chars ✓
    // PHASES:
    //   - 0-1.5s: Database icon bounces in center
    //   - 1.5-2.5s: "Personal KB" label fades in
    //   - 2.5-4s: Three AI logos fade in (staggered)
    //   - 4-5.5s: Connection lines draw from DB to each logo
    //   - 5.5-7s: Pulse on connection lines
    // LOGOS: database (lucide), openai.svg, claude.svg, google.svg (for Gemini)
    // ELEMENT COUNT: 1 focal (DB) + 3 supporting (AI logos) ✓
    // PHONE TEST: DB 180px, logos 120px, labels 40-56px ✓
    id: "BYOC-020-the-be-all-1430280",
    title: "Database-Backed Context",
    subtitle: "Personal knowledge base",
    bottomLabel: "Your context serves any AI platform",
    bottomAccent: "any AI platform",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const dbSize = Math.round(180 * zone.scale);
      const logoSize = Math.round(120 * zone.scale);
      const radius = Math.min(zone.width, zone.height) * 0.38;

      const angles = [
        0 * (Math.PI / 180),
        180 * (Math.PI / 180),
        -90 * (Math.PI / 180),
      ];

      const logos = [
        { name: "ChatGPT", file: "openai.svg", angle: angles[0], delay: 60 },
        { name: "Claude", file: "claude.svg", angle: angles[1], delay: 75 },
        { name: "Gemini", file: "google.svg", angle: angles[2], delay: 90 },
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
          {/* Connection lines - zIndex 0 */}
          {logos.map((logo, i) => {
            const x = centerX + radius * Math.cos(logo.angle);
            const y = centerY + radius * Math.sin(logo.angle);
            const lineProgress = ease(sceneFrame, 105 + i * 15, 135 + i * 15);
            const pulseVal = pulse(sceneFrame - 150, 0.03);

            return (
              <svg
                key={`line-${i}`}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: zone.width,
                  height: zone.height,
                  zIndex: 0,
                }}
              >
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={centerX + (x - centerX) * lineProgress}
                  y2={centerY + (y - centerY) * lineProgress}
                  stroke={OB1.STEEL}
                  strokeWidth={Math.round(3 * zone.scale)}
                  opacity={0.6 + pulseVal * 0.4 * ease(sceneFrame, 150, 160)}
                />
              </svg>
            );
          })}

          {/* Database icon (center) - zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: centerX - dbSize / 2,
              top: centerY - dbSize / 2,
              ...bouncePop(sceneFrame, 0, fps),
              zIndex: 1,
            }}
          >
            <Database size={dbSize} color={OB1.CYAN} strokeWidth={2} />
          </div>

          {/* Personal KB label removed — subtitle already says "Personal knowledge base" */}

          {/* AI platform logos - zIndex 1 */}
          {logos.map((logo, i) => {
            const x = centerX + radius * Math.cos(logo.angle);
            const y = centerY + radius * Math.sin(logo.angle);

            return (
              <div key={`logo-${i}`}>
                <div
                  style={{
                    position: "absolute",
                    left: x - logoSize / 2,
                    top: y - logoSize / 2,
                    ...fadeInUp(sceneFrame, logo.delay, 25),
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile(`logos/${logo.file}`)}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
                {/* Logo label - zIndex 10 */}
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: y + logoSize / 2 + Math.round(12 * zone.scale),
                    fontSize: Math.round(40 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(sceneFrame, logo.delay + 15, logo.delay + 25),
                    zIndex: 10,
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {logo.name}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for BYOC-021-ours-But-I
    // FOCAL: MCP server box (240x200) at left, 4 AI platform logos (96px each) in 2x2 grid at right
    // SUPPORTING (1): Arrow flowing from MCP box to AI grid
    // TEXT ON SCREEN:
    //   - "Your MCP Server" (60px, inside box) — 15 chars
    //   - Platform labels: "GPT" "Claude" "Gemini" "Copilot" (40px each) — 24 chars total
    //   Total visible: 39 chars ✓
    // PHASES:
    //   - 0-1.5s: MCP server box slides in from left
    //   - 1.5-2.5s: "Your MCP Server" label fades in
    //   - 2.5-4.5s: Four AI logos pop in (staggered)
    //   - 4.5-6s: Arrow draws from box to grid
    //   - 6-7s: Hold
    // LOGOS: openai.svg, claude.svg, google.svg, githubcopilot.svg
    // ELEMENT COUNT: 1 focal (MCP box) + 1 supporting (AI grid treated as single element) ✓
    // PHONE TEST: Box 240x200, logos 96px, labels 40-60px ✓
    id: "BYOC-021-ours-But-I-1510300",
    title: "Server Architecture",
    subtitle: "User-controlled model",
    bottomLabel: "One server connects to all platforms",
    bottomAccent: "all platforms",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const boxWidth = Math.round(240 * zone.scale);
      const boxHeight = Math.round(200 * zone.scale);
      const logoSize = Math.round(96 * zone.scale);
      const colGap = Math.round(140 * zone.scale);
      const rowGap = Math.round(80 * zone.scale);

      const boxX = zone.width * 0.15;
      const boxY = zone.height * 0.5 - boxHeight / 2;

      const gridX = zone.width * 0.62;
      const gridY = zone.height * 0.5 - logoSize - rowGap / 2;

      const platforms = [
        { name: "ChatGPT", file: "openai.svg", row: 0, col: 0, delay: 60 },
        { name: "Claude", file: "claude.svg", row: 0, col: 1, delay: 75 },
        { name: "Gemini", file: "google.svg", row: 1, col: 0, delay: 90 },
        {
          name: "Copilot",
          file: "githubcopilot.svg",
          row: 1,
          col: 1,
          delay: 105,
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
          {/* MCP Server box - zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: boxX,
              top: boxY,
              width: boxWidth,
              height: boxHeight,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
              borderRadius: Math.round(12 * zone.scale),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...slideIn(sceneFrame, 0, 30, "left", 60),
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                opacity: ease(sceneFrame, 30, 50),
                zIndex: 10,
                position: "relative",
              }}
            >
              Your MCP
              <br />
              Server
            </div>
          </div>

          {/* Arrow from box to grid - zIndex 0 */}
          <svg
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: zone.width,
              height: zone.height,
              zIndex: 0,
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill={OB1.STEEL} />
              </marker>
            </defs>
            <line
              x1={boxX + boxWidth}
              y1={zone.height * 0.5}
              x2={
                boxX +
                boxWidth +
                (gridX - logoSize / 2 - (boxX + boxWidth)) *
                  ease(sceneFrame, 120, 150)
              }
              y2={zone.height * 0.5}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(4 * zone.scale)}
              markerEnd="url(#arrowhead)"
              opacity={ease(sceneFrame, 120, 150)}
            />
          </svg>

          {/* AI platform grid - zIndex 1 */}
          {platforms.map((platform, i) => {
            const x = gridX + platform.col * (logoSize + colGap);
            const y = gridY + platform.row * (logoSize + rowGap);

            return (
              <div key={`platform-${i}`}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    ...bouncePop(sceneFrame, platform.delay, fps),
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile(`logos/${platform.file}`)}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
                {/* Platform label - zIndex 10 */}
                <div
                  style={{
                    position: "absolute",
                    left: x + logoSize / 2,
                    top: y + logoSize + Math.round(8 * zone.scale),
                    fontSize: Math.round(40 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(
                      sceneFrame,
                      platform.delay + 10,
                      platform.delay + 20
                    ),
                    zIndex: 10,
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {platform.name}
                </div>
              </div>
            );
          })}
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

export const BYOC_CLIPS_G = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

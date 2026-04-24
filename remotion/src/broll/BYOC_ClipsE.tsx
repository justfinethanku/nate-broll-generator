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
import {
  MessageSquare,
  Database,
  Brain,
  Settings,
  TrendingUp,
  FileText,
  CheckCircle2,
  ArrowRight,
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
    // DESIGN SPEC for BYOC-013-third-party-tool
    // FOCAL: Central ChatGPT logo with radiating chain links to conversation bubbles
    // SUPPORTING (1): 4 conversation bubble icons in circular arrangement
    // TEXT ON SCREEN:
    //   - "ChatGPT" (48px, below logo) — 7 chars
    //   Total visible: 7 chars (well under 90)
    // PHASES:
    //   - 0-1s: Center logo fades in
    //   - 1-2.5s: Conversation bubbles appear (staggered)
    //   - 2.5-5s: Chain links grow from center to bubbles
    //   - 5-7s: Subtle pulse on chains
    // LOGOS: openai.svg
    // ELEMENT COUNT: 1 logo + 4 bubbles (grouped as decorative) = 2 distinct ✓
    // PHONE TEST: Logo 140px, label 48px ✓
    id: "BYOC-013-third-party-tool-920-130",
    title: "Platform Lock-In",
    subtitle: "The conversation moat",
    bottomLabel: "Every conversation strengthens the lock",
    bottomAccent: "strengthens",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.45;
      const radius = Math.min(zone.width, zone.height) * 0.32;

      const bubblePositions = [
        { angle: -45, delay: 30 },
        { angle: 45, delay: 40 },
        { angle: 135, delay: 50 },
        { angle: 225, delay: 60 },
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
          {/* Chain links - zIndex 0 */}
          {bubblePositions.map((pos, i) => {
            const linkProgress = ease(sceneFrame, 75 + i * 10, 105 + i * 10);
            const angleRad = (pos.angle * Math.PI) / 180;
            const endX = centerX + Math.cos(angleRad) * radius;
            const endY = centerY + Math.sin(angleRad) * radius;
            const currentLength = linkProgress * radius * 0.7;
            const currentX = centerX + Math.cos(angleRad) * currentLength;
            const currentY = centerY + Math.sin(angleRad) * currentLength;

            const pulseVal = pulse(sceneFrame - 120, 0.04);
            const opacity = ease(sceneFrame, 75 + i * 10, 90 + i * 10) * (0.6 + pulseVal * 0.3);

            return (
              <svg
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: zone.width,
                  height: zone.height,
                  zIndex: 0,
                }}
              >
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={currentX}
                  y2={currentY}
                  stroke={OB1.STEEL}
                  strokeWidth={Math.round(4 * zone.scale)}
                  strokeDasharray={`${Math.round(12 * zone.scale)} ${Math.round(8 * zone.scale)}`}
                  opacity={opacity}
                />
              </svg>
            );
          })}

          {/* Central logo container */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(90 * zone.scale),
              left: centerX - Math.round(70 * zone.scale),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Logo - zIndex 1 */}
            <div style={{ ...bouncePop(sceneFrame, 10, fps), zIndex: 1 }}>
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            {/* Label - zIndex 10 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              ChatGPT
            </div>
          </div>

          {/* Conversation bubbles - zIndex 1 */}
          {bubblePositions.map((pos, i) => {
            const angleRad = (pos.angle * Math.PI) / 180;
            const x = centerX + Math.cos(angleRad) * radius;
            const y = centerY + Math.sin(angleRad) * radius;

            return (
              <div
                key={`bubble-${i}`}
                style={{
                  position: "absolute",
                  top: y - Math.round(40 * zone.scale),
                  left: x - Math.round(40 * zone.scale),
                  ...bouncePop(sceneFrame, pos.delay, fps),
                }}
              >
                <div
                  style={{
                    width: Math.round(80 * zone.scale),
                    height: Math.round(80 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <MessageSquare
                    size={Math.round(40 * zone.scale)}
                    color={OB1.CYAN}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-014-your-professional-context
    // FOCAL: Central knowledge graph with 3 connected nodes
    // SUPPORTING (3): Three labeled category boxes (Domain/Workflow/Behavioral)
    // TEXT ON SCREEN:
    //   - "Domain Knowledge" (48px) — 16 chars
    //   - "Workflow Prefs" (48px) — 14 chars
    //   - "Behavioral Patterns" (48px) — 19 chars
    //   Total visible: 49 chars ✓
    // PHASES:
    //   - 0-1.5s: Central graph structure fades in
    //   - 1.5-3s: Three category nodes pop in (staggered)
    //   - 3-5s: Connecting lines draw
    //   - 5-7s: Hold with subtle node pulse
    // LOGOS: None
    // ICONS: Database (center), Brain, Settings, TrendingUp
    // ELEMENT COUNT: 1 central graph + 3 labeled categories = 4 ✓
    // PHONE TEST: All text 48px, icons 64px in circles ✓
    id: "BYOC-014-your-professional-context-990-170",
    title: "Professional Context",
    subtitle: "Your portable knowledge",
    bottomLabel: "Context as a strategic asset you own",
    bottomAccent: "asset",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const nodeRadius = Math.min(zone.width, zone.height) * 0.42;
      const nodeIconSize = Math.round(100 * zone.scale);

      const categories: Record<string, {
        label: string;
        icon: any;
        angle: number;
        color: string;
        delay: number;
      }> = {
        domain: {
          label: "Domain Knowledge",
          icon: Brain,
          angle: -90,
          color: OB1.PURPLE,
          delay: 45,
        },
        workflow: {
          label: "Workflow Prefs",
          icon: Settings,
          angle: 0,
          color: OB1.CYAN,
          delay: 55,
        },
        behavioral: {
          label: "Behavioral Patterns",
          icon: TrendingUp,
          angle: 180,
          color: OB1.GREEN,
          delay: 65,
        },
      };

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
          {/* Connecting lines - zIndex 0 */}
          {Object.values(categories).map((cat, i) => {
            const lineProgress = ease(sceneFrame, 90 + i * 8, 110 + i * 8);
            const angleRad = (cat.angle * Math.PI) / 180;
            const endX = centerX + Math.cos(angleRad) * nodeRadius;
            const endY = centerY + Math.sin(angleRad) * nodeRadius;
            const currentLength = lineProgress * nodeRadius * 0.65;
            const currentX = centerX + Math.cos(angleRad) * currentLength;
            const currentY = centerY + Math.sin(angleRad) * currentLength;

            return (
              <svg
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: zone.width,
                  height: zone.height,
                  zIndex: 0,
                }}
              >
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={currentX}
                  y2={currentY}
                  stroke={cat.color}
                  strokeWidth={Math.round(3 * zone.scale)}
                  opacity={ease(sceneFrame, 90 + i * 8, 105 + i * 8) * 0.6}
                />
              </svg>
            );
          })}

          {/* Central database icon - zIndex 1 */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(50 * zone.scale),
              left: centerX - Math.round(50 * zone.scale),
              ...bouncePop(sceneFrame, 15, fps),
            }}
          >
            <div
              style={{
                width: Math.round(100 * zone.scale),
                height: Math.round(100 * zone.scale),
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(50 * zone.scale)}
                color={OB1.ORANGE}
              />
            </div>
          </div>

          {/* Category nodes with labels */}
          {Object.values(categories).map((cat, i) => {
            const angleRad = (cat.angle * Math.PI) / 180;
            const x = centerX + Math.cos(angleRad) * nodeRadius;
            const y = centerY + Math.sin(angleRad) * nodeRadius;
            const Icon = cat.icon;

            const pulseVal = pulse(sceneFrame - 130, 0.03);
            const labelOffsetY = Math.round(nodeIconSize / 2 + 20 * zone.scale);

            return (
              <React.Fragment key={cat.label}>
                {/* Icon circle - absolute, centered on (x, y) */}
                <div
                  style={{
                    position: "absolute",
                    left: x - nodeIconSize / 2,
                    top: y - nodeIconSize / 2,
                    width: nodeIconSize,
                    height: nodeIconSize,
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${cat.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    ...bouncePop(sceneFrame, cat.delay, fps),
                    opacity:
                      (bouncePop(sceneFrame, cat.delay, fps).opacity ?? 1) *
                      (0.8 + pulseVal * 0.2),
                  }}
                >
                  <Icon
                    size={Math.round(48 * zone.scale)}
                    color={cat.color}
                  />
                </div>

                {/* Label - absolute, centered horizontally on x, placed below icon */}
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: y + labelOffsetY,
                    transform: "translateX(-50%)",
                    fontSize: Math.round(44 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    opacity: ease(sceneFrame, cat.delay + 15, cat.delay + 30),
                  }}
                >
                  {cat.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-015-it-and-you
    // FOCAL: Large database cylinder in center with bidirectional flow
    // SUPPORTING (2):
    //   - Left: 3 stacked context source icons
    //   - Right: Portable checkmark badge
    // TEXT ON SCREEN:
    //   - "Context Sources" (48px, left) — 15 chars
    //   - "Unified DB" (56px, center) — 10 chars
    //   - "Portable" (48px, right) — 8 chars
    //   Total visible: 33 chars ✓
    // PHASES:
    //   - 0-1s: Center database fades in
    //   - 1-2.5s: Left source icons appear (staggered)
    //   - 2.5-4s: Arrow animates left→center
    //   - 4-5.5s: Right checkmark pops in
    //   - 5.5-7s: Hold
    // LOGOS: None
    // ICONS: Database, FileText, MessageSquare, Settings, CheckCircle2, ArrowRight
    // ELEMENT COUNT: 3 groups (sources/db/output) ✓
    // PHONE TEST: All text 48-56px, icons 64px ✓
    id: "BYOC-015-it-and-you-1050-249",
    title: "OpenBrain Integration",
    subtitle: "Pull it all together",
    bottomLabel: "Unified context database for review and portability",
    bottomAccent: "portability",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const sideOffset = zone.width * 0.28;

      const sourceIcons: Array<{
        icon: any;
        delay: number;
      }> = [
        { icon: FileText, delay: 30 },
        { icon: MessageSquare, delay: 40 },
        { icon: Settings, delay: 50 },
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
          {/* Left arrow - zIndex 0 */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(3 * zone.scale),
              left: centerX - sideOffset * 0.6,
              width: sideOffset * 0.5,
              opacity: ease(sceneFrame, 75, 95),
              zIndex: 0,
            }}
          >
            <svg
              width={sideOffset * 0.5}
              height={Math.round(6 * zone.scale)}
              style={{ display: "block" }}
            >
              <defs>
                <marker
                  id="arrowhead-left"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill={OB1.CYAN}
                  />
                </marker>
              </defs>
              <line
                x1="0"
                y1={Math.round(3 * zone.scale)}
                x2={ease(sceneFrame, 75, 95) * sideOffset * 0.5}
                y2={Math.round(3 * zone.scale)}
                stroke={OB1.CYAN}
                strokeWidth={Math.round(3 * zone.scale)}
                markerEnd="url(#arrowhead-left)"
              />
            </svg>
          </div>

          {/* Left source icons column */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(140 * zone.scale),
              left: centerX - sideOffset - Math.round(90 * zone.scale),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Source icons - zIndex 1 */}
            {sourceIcons.map((src, i) => {
              const Icon = src.icon;
              return (
                <div
                  key={i}
                  style={{
                    ...bouncePop(sceneFrame, src.delay, fps),
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: Math.round(64 * zone.scale),
                      height: Math.round(64 * zone.scale),
                      borderRadius: Math.round(8 * zone.scale),
                      backgroundColor: OB1.BG_MID,
                      border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      size={Math.round(32 * zone.scale)}
                      color={OB1.STEEL}
                    />
                  </div>
                </div>
              );
            })}

            {/* Sources label - zIndex 10 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                marginTop: Math.round(8 * zone.scale),
                whiteSpace: "nowrap",
                zIndex: 10,
                position: "relative",
              }}
            >
              Context Sources
            </div>
          </div>

          {/* Center database */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(110 * zone.scale),
              left: centerX - Math.round(80 * zone.scale),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Database icon - zIndex 1 */}
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: Math.round(16 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Database
                  size={Math.round(80 * zone.scale)}
                  color={OB1.ORANGE}
                />
              </div>
            </div>

            {/* DB label - zIndex 10 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 25),
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Unified DB
            </div>
          </div>

          {/* Right checkmark badge */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(90 * zone.scale),
              left: centerX + sideOffset - Math.round(60 * zone.scale),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Checkmark - zIndex 1 */}
            <div
              style={{
                ...bouncePop(sceneFrame, 120, fps),
                zIndex: 1,
              }}
            >
              <CheckCircle2
                size={Math.round(120 * zone.scale)}
                color={OB1.GREEN}
                fill={OB1.BG_MID}
              />
            </div>

            {/* Portable label - zIndex 10 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 135),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Portable
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

export const BYOC_CLIPS_E = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

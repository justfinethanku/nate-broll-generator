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
  TrendingDown,
  TrendingUp,
  User,
  FileCheck,
  ArrowRight,
  RotateCcw,
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
    // DESIGN SPEC for OP-013-ClaudeDesignAs
    // FOCAL: Split-screen comparison with Figma logo + downward arrow on left (RED), Claude logo + upward arrow on right (GREEN)
    // SUPPORTING (2):
    //   1. Figma stock chart dropping 7% (bar/line visual)
    //   2. Claude rising trajectory
    // TEXT ON SCREEN:
    //   - "Figma" (48px) — 5 chars
    //   - "-7%" (80px, RED) — 3 chars
    //   - "Claude Design" (48px) — 13 chars
    //   - "Market Leader" (60px, GREEN) — 12 chars
    //   Total visible: 33 chars ✓
    // PHASES:
    //   - 0-1.5s: Figma logo + label fade in left
    //   - 1.5-3s: -7% stat animates in below Figma
    //   - 3-4.5s: Claude logo + label fade in right
    //   - 4.5-6s: Crossing arrows animate
    //   - 6-7s: Hold
    // LOGOS: figma.svg, claude.svg
    // ELEMENT COUNT: 2 main groups (Figma side + Claude side) ✓
    // PHONE TEST: All text 48px+, logos 140px ✓
    id: "OP-013-ClaudeDesignAs",
    title: "Market Reaction",
    subtitle: "Claude Design launch impact",
    bottomLabel: "Figma −7% on Launch",
    bottomAccent: "−7%",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Vertical separator line
      const separatorOpacity = ease(sceneFrame, 75, 90);

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
          {/* Vertical separator line */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.15,
              width: Math.round(2 * zone.scale),
              height: zone.height * 0.7,
              backgroundColor: OB1.DIM,
              opacity: separatorOpacity,
              zIndex: 0,
            }}
          />

          {/* LEFT SIDE: Figma declining */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Figma logo */}
            <div style={{ ...fadeInUp(sceneFrame, 10) }}>
              <Img
                src={staticFile("logos/figma.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            {/* Figma label */}
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
              Figma
            </div>

            {/* Down arrow icon */}
            <div style={{ ...slideIn(sceneFrame, 45, 20, "down", 30) }}>
              <TrendingDown
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
              />
            </div>

            {/* -7% stat */}
            <div
              style={{
                ...bouncePop(sceneFrame, 60, fps),
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              -7%
            </div>
          </div>

          {/* RIGHT SIDE: Claude rising */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.85,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Claude logo */}
            <div style={{ ...fadeInUp(sceneFrame, 90) }}>
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            {/* Claude Design label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 100),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Claude Design
            </div>

            {/* Up arrow icon */}
            <div style={{ ...slideIn(sceneFrame, 115, 20, "up", 30) }}>
              <TrendingUp
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={3}
              />
            </div>

            {/* Market Leader label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 135),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Market Leader
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-014-ThatsWhatHappened
    // FOCAL: 3 animated UI frames in horizontal sequence (storyboard strip)
    // SUPPORTING (1): Claude logo top center
    // TEXT ON SCREEN:
    //   - "Claude Design" (48px) — 13 chars
    //   - "Frame 1" / "Frame 2" / "Frame 3" (40px each) — 18 chars total
    //   Total visible: 31 chars ✓
    // PHASES:
    //   - 0-1s: Claude logo appears top
    //   - 1-2.5s: Frame 1 fades in
    //   - 2.5-4s: Arrow + Frame 2 appear
    //   - 4-5.5s: Arrow + Frame 3 appear
    //   - 5.5-7s: Hold all three
    // LOGOS: claude.svg
    // ELEMENT COUNT: 4 (logo + 3 frames) — at limit ✓
    // PHONE TEST: All frames 240x200 min, text 40px+ ✓
    id: "OP-014-ThatsWhatHappened",
    title: "Animated Sequences",
    subtitle: "Claude Design UI generation",
    bottomLabel: "Animated UI Generation",
    bottomAccent: "Animated",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const frameWidth = zone.width * 0.22;
      const frameHeight = zone.height * 0.45;

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
          {/* Claude logo top - outer div for positioning */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.04,
              left: zone.width * 0.5,
              transform: "translateX(-50%)",
            }}
          >
            {/* Inner div for animation */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                ...fadeInUp(sceneFrame, 0),
              }}
            >
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(80 * zone.scale),
                  height: Math.round(80 * zone.scale),
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
                Claude Design
              </div>
            </div>
          </div>

          {/* Frame sequence */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.04,
              marginTop: zone.height * 0.25,
            }}
          >
            {/* Frame 1 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                ...fadeInUp(sceneFrame, 30),
              }}
            >
              <div
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  borderRadius: Math.round(8 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                {/* Inner animated gradient to suggest UI */}
                <div
                  style={{
                    width: "80%",
                    height: "70%",
                    background: `linear-gradient(135deg, ${OB1.CYAN}40, ${OB1.PURPLE}40)`,
                    borderRadius: Math.round(4 * zone.scale),
                    opacity: 0.6 + pulse(sceneFrame - 30, 0.04) * 0.4,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Frame 1
              </div>
            </div>

            {/* Arrow 1→2 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 75),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(48 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
              />
            </div>

            {/* Frame 2 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                ...fadeInUp(sceneFrame, 75),
              }}
            >
              <div
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.PURPLE}`,
                  borderRadius: Math.round(8 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "80%",
                    height: "70%",
                    background: `linear-gradient(135deg, ${OB1.PURPLE}40, ${OB1.ORANGE}40)`,
                    borderRadius: Math.round(4 * zone.scale),
                    opacity: 0.6 + pulse(sceneFrame - 75, 0.04) * 0.4,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Frame 2
              </div>
            </div>

            {/* Arrow 2→3 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(48 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
              />
            </div>

            {/* Frame 3 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                ...fadeInUp(sceneFrame, 120),
              }}
            >
              <div
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  borderRadius: Math.round(8 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "80%",
                    height: "70%",
                    background: `linear-gradient(135deg, ${OB1.ORANGE}40, ${OB1.GREEN}40)`,
                    borderRadius: Math.round(4 * zone.scale),
                    opacity: 0.6 + pulse(sceneFrame - 120, 0.04) * 0.4,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Frame 3
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-015-TheReviewIterations
    // FOCAL: Circular flow diagram with 3 nodes in cycle
    // SUPPORTING: Designer → Claude → Review → (back to Designer)
    // TEXT ON SCREEN:
    //   - "Designer" (48px) — 8 chars
    //   - "Claude" (48px) — 6 chars
    //   - "Review" (48px) — 6 chars
    //   Total visible: 20 chars ✓
    // PHASES:
    //   - 0-1.5s: Designer node + icon appear
    //   - 1.5-3s: Arrow to Claude draws, Claude node appears
    //   - 3-4.5s: Arrow to Review draws, Review node appears
    //   - 4.5-6s: Return arrow completes cycle
    //   - 6-7s: Hold + pulse
    // LOGOS: None (abstract workflow)
    // ELEMENT COUNT: 3 nodes ✓
    // PHONE TEST: All nodes 160px diameter, text 48px ✓
    id: "OP-015-TheReviewIterations",
    title: "Review Loop",
    subtitle: "Collaborative iteration",
    bottomLabel: "Design Review Loop",
    bottomAccent: "Loop",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const radius = Math.min(zone.width, zone.height) * 0.32;
      const nodeDiameter = Math.round(160 * zone.scale);

      // Calculate node positions (3 nodes evenly distributed)
      const angleStep = (2 * Math.PI) / 3;
      const nodes = [
        {
          label: "Designer",
          icon: User,
          color: OB1.CYAN,
          delay: 10,
          angle: -Math.PI / 2, // top
        },
        {
          label: "Claude",
          icon: null, // will use logo
          color: OB1.ORANGE,
          delay: 45,
          angle: -Math.PI / 2 + angleStep, // bottom right
        },
        {
          label: "Review",
          icon: FileCheck,
          color: OB1.GREEN,
          delay: 90,
          angle: -Math.PI / 2 + angleStep * 2, // bottom left
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
          {/* Connecting arrows */}
          {nodes.map((node, i) => {
            const nextNode = nodes[(i + 1) % 3];
            const arrowDelay = node.delay + 25;
            const arrowProgress = ease(sceneFrame, arrowDelay, arrowDelay + 20);

            const x1 = centerX + radius * Math.cos(node.angle);
            const y1 = centerY + radius * Math.sin(node.angle);
            const x2 = centerX + radius * Math.cos(nextNode.angle);
            const y2 = centerY + radius * Math.sin(nextNode.angle);

            // Calculate edge points (arrows terminate at node borders, not centers)
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const nodeRadius = nodeDiameter / 2;

            const startX = x1 + (dx / distance) * nodeRadius;
            const startY = y1 + (dy / distance) * nodeRadius;
            const endX = x2 - (dx / distance) * nodeRadius;
            const endY = y2 - (dy / distance) * nodeRadius;

            const currentEndX = startX + (endX - startX) * arrowProgress;
            const currentEndY = startY + (endY - startY) * arrowProgress;

            // Arrow head angle
            const arrowAngle = Math.atan2(dy, dx);

            return (
              <svg
                key={`arrow-${i}`}
                width={zone.width}
                height={zone.height}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              >
                {/* Arrow line */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={currentEndX}
                  y2={currentEndY}
                  stroke={OB1.STEEL}
                  strokeWidth={Math.round(4 * zone.scale)}
                  opacity={arrowProgress}
                />
                {/* Arrow head */}
                {arrowProgress > 0.8 && (
                  <polygon
                    points={`${currentEndX},${currentEndY} ${
                      currentEndX - 12 * zone.scale * Math.cos(arrowAngle - Math.PI / 6)
                    },${currentEndY - 12 * zone.scale * Math.sin(arrowAngle - Math.PI / 6)} ${
                      currentEndX - 12 * zone.scale * Math.cos(arrowAngle + Math.PI / 6)
                    },${currentEndY - 12 * zone.scale * Math.sin(arrowAngle + Math.PI / 6)}`}
                    fill={OB1.STEEL}
                    opacity={ease(sceneFrame, arrowDelay + 16, arrowDelay + 20)}
                  />
                )}
              </svg>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const x = centerX + radius * Math.cos(node.angle);
            const y = centerY + radius * Math.sin(node.angle);
            const Icon = node.icon;
            const pulseVal = pulse(sceneFrame - node.delay - 20, 0.03);

            return (
              // Outer div for positioning
              <div
                key={`node-${i}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Inner div for animation */}
                <div style={{ ...bouncePop(sceneFrame, node.delay, fps) }}>
                  {/* Node circle */}
                  <div
                    style={{
                      width: nodeDiameter,
                      height: nodeDiameter,
                      borderRadius: "50%",
                      backgroundColor: OB1.BG_MID,
                      border: `${Math.round(4 * zone.scale)}px solid ${node.color}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: Math.round(8 * zone.scale),
                      zIndex: 1,
                      boxShadow: `0 0 ${Math.round(20 * zone.scale * (1 + pulseVal * 0.5))}px ${node.color}40`,
                    }}
                  >
                    {/* Icon or logo */}
                    {i === 1 ? (
                      <Img
                        src={staticFile("logos/claude.svg")}
                        style={{
                          width: Math.round(64 * zone.scale),
                          height: Math.round(64 * zone.scale),
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    ) : (
                      Icon && (
                        <Icon
                          size={Math.round(64 * zone.scale)}
                          color={node.color}
                          strokeWidth={2.5}
                        />
                      )
                    )}
                    {/* Label */}
                    <div
                      style={{
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        zIndex: 10,
                        position: "relative",
                        textAlign: "center",
                      }}
                    >
                      {node.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export const OP_CLIPS_E = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

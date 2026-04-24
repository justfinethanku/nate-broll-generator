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
  Terminal,
  Code2,
  MessageSquare,
  AlertTriangle,
  ArrowDown,
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
    // DESIGN SPEC for OP-022-TheTeamWas
    // FOCAL: Dual vertical gauge comparison showing 4.7 efficiency vs depth
    // SUPPORTING (2):
    //   - "4.7" title label at top center (80px)
    //   - Small arrow indicators showing shift direction
    // TEXT ON SCREEN:
    //   - "4.7" (80px) — 3 chars
    //   - "Token Efficiency" (48px) — 17 chars
    //   - "Output Depth" (48px) — 12 chars
    //   Total visible: 32 chars ✓
    // PHASES:
    //   - 0-1.5s: Gauges fade in empty
    //   - 1.5-3.5s: Left gauge fills (token efficiency)
    //   - 3.5-5.5s: Right gauge fills (output depth)
    //   - 5.5-7s: Hold with subtle pulse
    // ELEMENT COUNT: 2 gauges + 1 title (3 total) ✓
    // PHONE TEST: All text 48px+, gauges large and clear ✓
    // ITERATION 1: Adjusted right label timing from 120-140 to 80-100 so visible at f200
    id: "OP-022-TheTeamWas",
    title: "Model Thinness",
    subtitle: "Efficiency vs depth perception",
    bottomLabel: "Token efficiency without sacrificing output depth",
    bottomAccent: "Token efficiency",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const gaugeWidth = zone.width * 0.18;
      const gaugeHeight = zone.height * 0.5;
      const gap = zone.width * 0.12;

      const leftFill = ease(sceneFrame, 30, 80) * 0.85; // High efficiency
      const rightFill = ease(sceneFrame, 70, 120) * 0.78; // Strong depth

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(32 * zone.scale),
          }}
        >
          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: Math.round(80 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              zIndex: 10,
              position: "relative",
            }}
          >
            4.7
          </div>

          {/* Gauges */}
          <div
            style={{
              display: "flex",
              gap: gap,
              alignItems: "flex-end",
            }}
          >
            {/* Left Gauge - Token Efficiency */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  width: gaugeWidth,
                  height: gaugeHeight,
                  backgroundColor: OB1.DIM,
                  borderRadius: Math.round(8 * zone.scale),
                  position: "relative",
                  overflow: "hidden",
                  opacity: ease(sceneFrame, 20, 40),
                  zIndex: 1,
                }}
              >
                {/* Fill */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${leftFill * 100}%`,
                    backgroundColor: OB1.CYAN,
                    zIndex: 1,
                  }}
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
                  width: gaugeWidth * 1.8,
                  opacity: ease(sceneFrame, 40, 60),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Token Efficiency
              </div>
            </div>

            {/* Right Gauge - Output Depth */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  width: gaugeWidth,
                  height: gaugeHeight,
                  backgroundColor: OB1.DIM,
                  borderRadius: Math.round(8 * zone.scale),
                  position: "relative",
                  overflow: "hidden",
                  opacity: ease(sceneFrame, 20, 40),
                  zIndex: 1,
                }}
              >
                {/* Fill */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${rightFill * 100}%`,
                    backgroundColor: OB1.GREEN,
                    zIndex: 1,
                  }}
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
                  width: gaugeWidth * 1.8,
                  opacity: ease(sceneFrame, 80, 100),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Output Depth
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-023-ThatIsBackward
    // FOCAL: Three vertical columns showing API / Claude Code / Claude Chat
    // SUPPORTING (3):
    //   - Each column has an icon (Terminal, Code2, MessageSquare)
    //   - Each column has a config indicator
    // TEXT ON SCREEN:
    //   - "API" (56px) — 3 chars
    //   - "Claude Code" (56px) — 11 chars (split to two lines)
    //   - "Claude Chat" (56px) — 11 chars (split to two lines)
    //   Total visible: 25 chars ✓
    // PHASES:
    //   - 0-1s: Column containers fade in
    //   - 1-2.5s: API column appears
    //   - 2.5-4s: Claude Code column appears
    //   - 4-5.5s: Claude Chat column appears
    //   - 5.5-7s: Config indicators pulse
    // ELEMENT COUNT: 3 columns (at limit) ✓
    // PHONE TEST: All text 56px, icons 80px ✓
    // ITERATION 1: Adjusted column delays so all 3 visible by f200 (sceneFrame 110)
    id: "OP-023-ThatIsBackward",
    title: "Backward Compatibility",
    subtitle: "Different defaults by surface",
    bottomLabel: "API, Claude Code, and Claude Chat each have different configuration defaults",
    bottomAccent: "different configuration defaults",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const columnWidth = zone.width * 0.22;
      const columnHeight = zone.height * 0.6;
      const gap = zone.width * 0.08;

      const columns = [
        {
          label: "API",
          Icon: Terminal,
          color: OB1.STEEL,
          delay: 20,
          singleLine: true,
        },
        {
          label: "Claude\nCode",
          Icon: Code2,
          color: OB1.CYAN,
          delay: 50,
          singleLine: false,
        },
        {
          label: "Claude\nChat",
          Icon: MessageSquare,
          color: OB1.ORANGE,
          delay: 80,
          singleLine: false,
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
            gap: gap,
          }}
        >
          {columns.map((col, i) => {
            const colOpacity = ease(sceneFrame, col.delay, col.delay + 30);
            const iconScale = ease(sceneFrame, col.delay + 10, col.delay + 25);
            const pulseVal = pulse(sceneFrame - 150, 0.04);

            return (
              <div
                key={i}
                style={{
                  width: columnWidth,
                  height: columnHeight,
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(12 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px solid ${col.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(24 * zone.scale),
                  opacity: colOpacity,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Icon */}
                <col.Icon
                  size={Math.round(80 * zone.scale)}
                  color={col.color}
                  style={{
                    opacity: iconScale,
                    transform: `scale(${iconScale})`,
                    zIndex: 1,
                  }}
                />

                {/* Label */}
                <div
                  style={{
                    fontSize: Math.round(56 * zone.scale),
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
                  {col.label}
                </div>

                {/* Config indicator dot */}
                <div
                  style={{
                    width: Math.round(16 * zone.scale),
                    height: Math.round(16 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: col.color,
                    opacity: ease(sceneFrame, 150, 165) * (0.6 + pulseVal * 0.4),
                    position: "absolute",
                    bottom: Math.round(20 * zone.scale),
                    zIndex: 10,
                  }}
                />
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-024-InstructionsCanFight
    // FOCAL: Two arrows pointing at center collision point
    // SUPPORTING (3):
    //   - Top arrow: "System Prompt" (CYAN)
    //   - Bottom arrow: "User Prompt" (ORANGE)
    //   - Center: AlertTriangle icon (clash visual)
    //   - Resolution arrow emerging right (GREEN)
    // TEXT ON SCREEN:
    //   - "System Prompt" (48px) — 13 chars
    //   - "User Prompt" (48px) — 11 chars
    //   - "Resolution" (48px) — 10 chars
    //   Total visible: 34 chars ✓
    // PHASES:
    //   - 0-1.5s: Top arrow slides in
    //   - 1.5-3s: Bottom arrow slides in
    //   - 3-4.5s: Collision icon appears
    //   - 4.5-6.5s: Resolution arrow emerges
    //   - 6.5-7s: Hold
    // ELEMENT COUNT: 3 labeled arrows + 1 icon (4 total) ✓
    // PHONE TEST: All text 48px, arrows clearly visible ✓
    // ITERATION 1: Adjusted resolution arrow timing from 135 to 100 so visible by f200
    id: "OP-024-InstructionsCanFight",
    title: "Prompt Conflicts",
    subtitle: "When instructions compete",
    bottomLabel: "System and user prompts can contain conflicting directives requiring resolution logic",
    bottomAccent: "resolution logic",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const arrowLength = zone.height * 0.25;
      const centerY = zone.height * 0.5;
      const centerX = zone.width * 0.5;

      // Top arrow (System Prompt)
      const topArrowY = ease(sceneFrame, 0, 40) * arrowLength;
      const topOpacity = ease(sceneFrame, 0, 30);

      // Bottom arrow (User Prompt)
      const bottomArrowY = ease(sceneFrame, 35, 75) * arrowLength;
      const bottomOpacity = ease(sceneFrame, 35, 65);

      // Collision icon
      const collisionOpacity = ease(sceneFrame, 70, 95);
      const collisionScale = ease(sceneFrame, 70, 90);

      // Resolution arrow
      const resolutionX = ease(sceneFrame, 100, 140) * (zone.width * 0.25);
      const resolutionOpacity = ease(sceneFrame, 100, 130);

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
          {/* Top Arrow - System Prompt */}
          <div
            style={{
              position: "absolute",
              top: centerY - arrowLength - topArrowY,
              left: centerX,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              opacity: topOpacity,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                whiteSpace: "nowrap",
                zIndex: 10,
                position: "relative",
              }}
            >
              System Prompt
            </div>
            <ArrowDown
              size={Math.round(64 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* Bottom Arrow - User Prompt */}
          <div
            style={{
              position: "absolute",
              top: centerY + bottomArrowY,
              left: centerX,
              transform: "translateX(-50%) rotate(180deg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              opacity: bottomOpacity,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.ORANGE,
                whiteSpace: "nowrap",
                transform: "rotate(180deg)",
                zIndex: 10,
                position: "relative",
              }}
            >
              User Prompt
            </div>
            <ArrowDown
              size={Math.round(64 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* Center Collision Icon */}
          <div
            style={{
              position: "absolute",
              top: centerY,
              left: centerX,
              transform: `translate(-50%, -50%) scale(${collisionScale})`,
              opacity: collisionOpacity,
            }}
          >
            <AlertTriangle
              size={Math.round(96 * zone.scale)}
              color={OB1.AMBER}
              strokeWidth={3}
              style={{ zIndex: 1 }}
            />
          </div>

          {/* Resolution Arrow */}
          <div
            style={{
              position: "absolute",
              top: centerY,
              left: centerX + resolutionX,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              opacity: resolutionOpacity,
            }}
          >
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                whiteSpace: "nowrap",
                zIndex: 10,
                position: "relative",
              }}
            >
              Resolution
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

export const OP_CLIPS_H = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

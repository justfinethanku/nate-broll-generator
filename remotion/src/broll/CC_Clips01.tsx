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
  ArrowRight,
  Monitor,
  Eye,
  MousePointer,
  Keyboard,
  Clock,
  Layers,
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
    // DESIGN SPEC for CC-001-really-building-and-30-040
    // FOCAL: Horizontal flow diagram: Terminal icon → Arrow → Monitor icon, with OpenAI logo above Monitor
    // SUPPORTING (2):
    //   - "CLI Tool" label under Terminal (left side)
    //   - "Desktop Agent" label under Monitor (right side)
    // TEXT ON SCREEN:
    //   - "CLI Tool" (48px) — 8 chars
    //   - "Desktop Agent" (48px) — 13 chars
    //   Total visible: 21 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Terminal icon + "CLI Tool" fade in
    //   - 1.5-2.5s: Arrow draws/fades in
    //   - 2.5-4s: Monitor icon + OpenAI logo + "Desktop Agent" fade in
    //   - 4-7s: Hold with subtle pulse on Monitor side
    // LOGOS: openai.svg
    // ELEMENT COUNT: 3 groups (Terminal+label, Arrow, Monitor+logo+label) ✓
    // PHONE TEST: All text 48px, icons 120px, logo 96px ✓
    id: "CC-001-really-building-and-30-040",
    title: "Platform Evolution",
    subtitle: "OpenAI Codex",
    bottomLabel: "From command-line tool to desktop agent",
    bottomAccent: "desktop agent",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(120 * zone.scale);
      const logoSize = Math.round(96 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);
      const arrowSize = Math.round(64 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.08,
            }}
          >
            {/* Left: Terminal + CLI Tool */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                ...fadeInUp(sceneFrame, 0, 30),
              }}
            >
              <Terminal
                size={iconSize}
                color={OB1.DIM}
                strokeWidth={2}
              />
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.DIM,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                CLI Tool
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 30, 50),
              }}
            >
              <ArrowRight
                size={arrowSize}
                color={OB1.STEEL}
                strokeWidth={3}
              />
            </div>

            {/* Right: Monitor + OpenAI logo + Desktop Agent */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 50, 30),
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Monitor
                  size={iconSize}
                  color={OB1.ORANGE}
                  strokeWidth={2}
                  style={{
                    opacity: 0.6 + pulse(sceneFrame - 80, 0.03) * 0.4,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile("logos/openai.svg")}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Desktop Agent
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-002-itself-to-wake-80-020
    // FOCAL: Central circle node with OpenAI logo, 4 capability icons radiating outward at cardinal directions
    // SUPPORTING (4 max): 4 icons around center (Eye=vision, MousePointer=click, Keyboard=type, Clock=schedule)
    // Connecting lines from center to each icon
    // TEXT ON SCREEN:
    //   - "Vision" (40px) — 6 chars
    //   - "Click" (40px) — 5 chars
    //   - "Type" (40px) — 4 chars
    //   - "Schedule" (40px) — 8 chars
    //   Total visible: 23 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Center logo appears with bounce
    //   - 1-3s: Four icons + labels appear in sequence (staggered by 15 frames)
    //   - 3-7s: Hold with subtle pulse on connecting lines
    // LOGOS: openai.svg
    // ELEMENT COUNT: 1 center + 4 capabilities = 5 visual nodes, but they're grouped as "multi-capability" concept ✓
    // PHONE TEST: All text 40px, all icons 64px, center node 160px ✓
    id: "CC-002-itself-to-wake-80-020",
    title: "Multi-Capability Agent",
    subtitle: "Parallel execution",
    bottomLabel: "Screen vision, interaction, and autonomous scheduling",
    bottomAccent: "autonomous",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerSize = Math.round(160 * zone.scale);
      const logoSize = Math.round(80 * zone.scale);
      const capIconSize = Math.round(64 * zone.scale);
      const labelSize = Math.round(40 * zone.scale);
      const radius = Math.min(zone.width, zone.height) * 0.35;

      const capabilities = [
        { icon: Eye, label: "Vision", angle: 0, color: OB1.CYAN, delay: 20 },
        { icon: MousePointer, label: "Click", angle: 90, color: OB1.GREEN, delay: 35 },
        { icon: Keyboard, label: "Type", angle: 180, color: OB1.PURPLE, delay: 50 },
        { icon: Clock, label: "Schedule", angle: 270, color: OB1.AMBER, delay: 65 },
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
          {/* Connecting lines - zIndex 0 */}
          {capabilities.map((cap) => {
            const angleRad = (cap.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            const lineOpacity = ease(sceneFrame, cap.delay, cap.delay + 20) * (0.3 + pulse(sceneFrame - cap.delay, 0.02) * 0.3);

            return (
              <svg
                key={cap.label}
                style={{
                  position: "absolute",
                  width: zone.width,
                  height: zone.height,
                  zIndex: 0,
                }}
              >
                <line
                  x1={zone.width / 2}
                  y1={zone.height / 2}
                  x2={zone.width / 2 + x}
                  y2={zone.height / 2 + y}
                  stroke={cap.color}
                  strokeWidth={Math.round(2 * zone.scale)}
                  opacity={lineOpacity}
                />
              </svg>
            );
          })}

          {/* Center node - zIndex 1 */}
          <div
            style={{
              ...bouncePop(sceneFrame, 0, fps),
              position: "absolute",
              width: centerSize,
              height: centerSize,
              borderRadius: "50%",
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile("logos/openai.svg")}
              style={{
                width: logoSize,
                height: logoSize,
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Capability nodes */}
          {capabilities.map((cap) => {
            const angleRad = (cap.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            const Icon = cap.icon;

            return (
              <div
                key={cap.label}
                style={{
                  position: "absolute",
                  left: zone.width / 2 + x,
                  top: zone.height / 2 + y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    ...fadeInUp(sceneFrame, cap.delay, 20),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(12 * zone.scale),
                  }}
                >
                  <div
                    style={{
                      width: Math.round(96 * zone.scale),
                      height: Math.round(96 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: OB1.BG_DARK,
                      border: `${Math.round(2 * zone.scale)}px solid ${cap.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={capIconSize}
                      color={cap.color}
                      strokeWidth={2}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: labelSize,
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {cap.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-003-do-through-a-134-940
    // FOCAL: Before/After split: Terminal icon on left (dimmed), Monitor icon on right (bright + OpenAI logo)
    // SUPPORTING (2):
    //   - "Code Only" label under Terminal
    //   - "Full Desktop" label under Monitor
    // Vertical separator line between the two sides
    // TEXT ON SCREEN:
    //   - "Code Only" (48px) — 9 chars
    //   - "Full Desktop" (48px) — 12 chars
    //   Total visible: 21 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Left side (Terminal + "Code Only") fades in dim
    //   - 1.5-2.5s: Separator line draws vertically
    //   - 2.5-4s: Right side (Monitor + logo + "Full Desktop") fades in bright
    //   - 4-7s: Hold with pulse on right side
    // LOGOS: openai.svg
    // ELEMENT COUNT: 2 groups (left old, right new) + separator = 3 elements ✓
    // PHONE TEST: All text 48px, icons 140px, logo 96px ✓
    id: "CC-003-do-through-a-134-940",
    title: "Computer Use",
    subtitle: "Category expansion",
    bottomLabel: "From coding tool to graphical interface agent",
    bottomAccent: "graphical interface",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(140 * zone.scale);
      const logoSize = Math.round(96 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);

      const separatorHeight = ease(sceneFrame, 30, 50) * (zone.height * 0.6);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.12,
            }}
          >
            {/* Left: Code Only (dimmed) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                ...fadeInUp(sceneFrame, 0, 30),
              }}
            >
              <Terminal
                size={iconSize}
                color={OB1.DIM}
                strokeWidth={2}
              />
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.DIM,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Code Only
              </div>
            </div>

            {/* Separator line - zIndex 0 */}
            <div
              style={{
                width: Math.round(3 * zone.scale),
                height: separatorHeight,
                backgroundColor: OB1.STEEL,
                opacity: 0.5,
                zIndex: 0,
              }}
            />

            {/* Right: Full Desktop (bright + logo) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 50, 30),
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Monitor
                  size={iconSize}
                  color={OB1.CYAN}
                  strokeWidth={2}
                  style={{
                    opacity: 0.7 + pulse(sceneFrame - 80, 0.03) * 0.3,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile("logos/openai.svg")}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Full Desktop
              </div>
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

export const CC_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

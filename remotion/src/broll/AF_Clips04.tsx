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
  Code,
  Zap,
  Infinity,
  Layers,
  Circle,
  Terminal,
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
    // DESIGN SPEC for AF-010-IcebergTooling
    // FOCAL: Iceberg divided horizontally — tiny tip (10%) above waterline vs massive body (90%) below
    // SUPPORTING (3):
    //   1. Above water: 3 current tool icons (cursor, githubcopilot, claude) at 64px each in tight row
    //   2. Below water: "FUTURE ECOSYSTEM" label at 60px + cascading glow effect
    //   3. Waterline: horizontal divider line with small wave pulse animation
    // TEXT ON SCREEN:
    //   - "NOW" (48px, above waterline) — 3 chars
    //   - "FUTURE" (72px, below waterline, large) — 6 chars
    //   - "FUTURE ECOSYSTEM" (48px, detail label below FUTURE) — 16 chars
    //   Total visible: 25 chars ✓
    // PHASES:
    //   - 0-1.5s: Waterline draws horizontally
    //   - 1.5-3s: "NOW" label + 3 tool logos fade in above
    //   - 3-5s: "FUTURE" text + glow cascade fade in below
    //   - 5-7s: Hold, waterline pulses gently
    // LOGOS: cursor.svg, githubcopilot.svg, claude.svg
    // ELEMENT COUNT: 3 groups (waterline + above + below) ✓
    // PHONE TEST: All text ≥48px, logos 64px ✓
    id: "AF-010-IcebergTooling",
    title: "Iceberg Effect",
    subtitle: "The hidden acceleration",
    bottomLabel: "Today's tools are just the tip",
    bottomAccent: "tip",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Waterline position: 25% from top (small visible tip)
      const waterlineY = zone.height * 0.25;

      // Phase timings
      const lineProgress = ease(sceneFrame, 0, 45);
      const aboveOpacity = ease(sceneFrame, 45, 75);
      const belowOpacity = ease(sceneFrame, 90, 120);
      const wavePulse = pulse(sceneFrame - 120, 0.04);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* ABOVE WATER SECTION */}
          <div
            style={{
              width: zone.width,
              height: waterlineY,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(16 * zone.scale),
              opacity: aboveOpacity,
            }}
          >
            {/* "NOW" label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.STEEL,
                zIndex: 10,
                position: "relative",
              }}
            >
              NOW
            </div>

            {/* Current tool logos in tight row */}
            <div
              style={{
                display: "flex",
                gap: Math.round(20 * zone.scale),
                alignItems: "center",
              }}
            >
              {["cursor", "githubcopilot", "claude"].map((logo, i) => (
                <div
                  key={logo}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 55, 8)),
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile(`logos/${logo}.svg`)}
                    style={{
                      width: Math.round(64 * zone.scale),
                      height: Math.round(64 * zone.scale),
                      filter: "brightness(0) invert(1)",
                      opacity: 0.9,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* WATERLINE with pulse */}
          <div
            style={{
              position: "absolute",
              top: waterlineY,
              left: 0,
              width: zone.width * lineProgress,
              height: Math.round(3 * zone.scale),
              background: `linear-gradient(90deg, ${OB1.CYAN}00, ${OB1.CYAN}, ${OB1.CYAN}00)`,
              boxShadow: `0 0 ${Math.round(12 * zone.scale)}px ${OB1.CYAN}${Math.round(30 + wavePulse * 40).toString(16)}`,
              zIndex: 0,
            }}
          />

          {/* BELOW WATER SECTION */}
          <div
            style={{
              width: zone.width,
              height: zone.height - waterlineY,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(24 * zone.scale),
              opacity: belowOpacity,
              position: "relative",
            }}
          >
            {/* Cascading glow rings (decorative depth) */}
            {[1, 2, 3, 4].map((ring) => {
              const ringDelay = 90 + ring * 8;
              const ringOpacity = ease(sceneFrame, ringDelay, ringDelay + 20) * (0.15 - ring * 0.03);
              const ringScale = 0.6 + ring * 0.15;

              return (
                <div
                  key={ring}
                  style={{
                    position: "absolute",
                    width: zone.width * ringScale,
                    height: zone.width * ringScale * 0.5,
                    borderRadius: "50%",
                    border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                    opacity: ringOpacity,
                    top: `${20 + ring * 8}%`,
                    zIndex: 0,
                  }}
                />
              );
            })}

            {/* "FUTURE" large title */}
            <div
              style={{
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
                textShadow: `0 0 ${Math.round(20 * zone.scale)}px ${OB1.CYAN}80`,
              }}
            >
              FUTURE
            </div>

            {/* "FUTURE ECOSYSTEM" detail label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.WHITE,
                opacity: 0.7,
                zIndex: 10,
                position: "relative",
              }}
            >
              FUTURE ECOSYSTEM
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AF-011-PersistentAgent
    // FOCAL: Side-by-side comparison with vertical separator line
    // SUPPORTING (2):
    //   LEFT: Traditional IDE — Terminal icon + circular arrows (restart cycle) at 64px + "START/STOP" label 48px
    //   RIGHT: Persistent agent — Infinity icon at 96px + "ALWAYS ON" label 60px, glowing
    // TEXT ON SCREEN:
    //   - "TRADITIONAL" (48px, left top) — 11 chars
    //   - "START/STOP" (48px, left bottom) — 10 chars
    //   - "PERSISTENT" (48px, right top) — 10 chars
    //   - "ALWAYS ON" (60px, right bottom) — 9 chars
    //   Total visible: 40 chars ✓
    // PHASES:
    //   - 0-1.5s: Vertical separator draws from top
    //   - 1.5-3s: Left side (traditional) fades in with restart arrows rotating
    //   - 3-5s: Right side (persistent) fades in with infinity glow pulse
    //   - 5-7s: Hold, infinity continues pulsing
    // ELEMENT COUNT: 3 (separator + left group + right group) ✓
    // PHONE TEST: All text ≥48px, icons ≥64px ✓
    id: "AF-011-PersistentAgent",
    title: "Always-On Agents",
    subtitle: "Never shut down",
    bottomLabel: "Persistent environments change everything",
    bottomAccent: "Persistent",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Separator line timing
      const separatorHeight = ease(sceneFrame, 0, 40) * zone.height;
      const leftOpacity = ease(sceneFrame, 45, 75);
      const rightOpacity = ease(sceneFrame, 90, 120);

      // Rotation for restart arrows (continuous slow spin)
      const rotationAngle = (sceneFrame * 2) % 360;

      // Infinity pulse
      const infinityPulse = pulse(sceneFrame - 90, 0.03);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* LEFT SIDE: Traditional IDE */}
          <div
            style={{
              width: zone.width * 0.45,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(24 * zone.scale),
              opacity: leftOpacity,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                zIndex: 10,
                position: "relative",
              }}
            >
              TRADITIONAL
            </div>

            {/* Restart cycle icon with rotation */}
            <div
              style={{
                position: "relative",
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Terminal
                size={Math.round(64 * zone.scale)}
                color={OB1.STEEL}
                style={{
                  zIndex: 1,
                  position: "absolute",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: Math.round(100 * zone.scale),
                  height: Math.round(100 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px dashed ${OB1.DIM}`,
                  borderRadius: "50%",
                  transform: `rotate(${rotationAngle}deg)`,
                  zIndex: 0,
                }}
              />
            </div>

            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              START/STOP
            </div>
          </div>

          {/* VERTICAL SEPARATOR */}
          <div
            style={{
              width: Math.round(3 * zone.scale),
              height: separatorHeight,
              background: `linear-gradient(180deg, ${OB1.ORANGE}00, ${OB1.ORANGE}, ${OB1.ORANGE}00)`,
              position: "absolute",
              left: zone.width * 0.5,
              top: 0,
              zIndex: 0,
            }}
          />

          {/* RIGHT SIDE: Persistent Agent */}
          <div
            style={{
              width: zone.width * 0.45,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(24 * zone.scale),
              opacity: rightOpacity,
              marginLeft: zone.width * 0.1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              PERSISTENT
            </div>

            {/* Infinity icon with glow pulse */}
            <div style={{ position: "relative" }}>
              <Infinity
                size={Math.round(96 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={2.5}
                style={{
                  zIndex: 1,
                  filter: `drop-shadow(0 0 ${Math.round((12 + infinityPulse * 8) * zone.scale)}px ${OB1.CYAN})`,
                }}
              />
            </div>

            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              ALWAYS ON
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AF-012-AgentPrimitives
    // FOCAL: Minimal scaffolding diagram — 4 thin horizontal layers stacked vertically, ultra-clean
    // SUPPORTING (1): Each layer is a labeled bar with icon on left, minimal height
    // TEXT ON SCREEN (each layer label):
    //   - "Memory Calls" (48px) — 12 chars
    //   - "Tool Calls" (48px) — 10 chars
    //   - "Compiler" (48px) — 8 chars
    //   - "System" (48px) — 6 chars
    //   Total visible: 36 chars ✓
    // PHASES:
    //   - 0-1s: Layer 1 (Memory) slides in from left
    //   - 1-2s: Layer 2 (Tool) slides in from left
    //   - 2-3s: Layer 3 (Compiler) slides in from left
    //   - 3-4s: Layer 4 (System) slides in from left
    //   - 4-7s: Hold, subtle pulse on all layers
    // ICONS: Circle (memory), Zap (tool calls), Code (compiler), Layers (system)
    // ELEMENT COUNT: 4 layers (within max) — each is a distinct primitive
    // PHONE TEST: All text 48px, icons 64px, bars tall enough (80px each) ✓
    id: "AF-012-AgentPrimitives",
    title: "Agent Primitives",
    subtitle: "Minimal scaffolding",
    bottomLabel: "Built for superhuman speed",
    bottomAccent: "superhuman speed",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const layers = [
        { label: "Memory Calls", icon: Circle, color: OB1.PURPLE, delay: 0 },
        { label: "Tool Calls", icon: Zap, color: OB1.CYAN, delay: 30 },
        { label: "Compiler", icon: Code, color: OB1.ORANGE, delay: 60 },
        { label: "System", icon: Layers, color: OB1.GREEN, delay: 90 },
      ];

      const layerHeight = Math.round(80 * zone.scale);
      const layerGap = Math.round(20 * zone.scale);
      const totalHeight = layers.length * layerHeight + (layers.length - 1) * layerGap;

      // Vertical centering offset
      const offsetY = (zone.height - totalHeight) / 2;

      // Global pulse for all layers after all are visible
      const globalPulse = pulse(sceneFrame - 120, 0.02);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: offsetY,
          }}
        >
          {layers.map((layer, i) => {
            const IconComponent = layer.icon;
            const slideProgress = ease(sceneFrame, layer.delay, layer.delay + 30);
            const slideX = (1 - slideProgress) * -200;

            return (
              <div
                key={i}
                style={{
                  width: zone.width * 0.8,
                  height: layerHeight,
                  marginBottom: i < layers.length - 1 ? layerGap : 0,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: Math.round(24 * zone.scale),
                  background: `${layer.color}15`,
                  border: `${Math.round(2 * zone.scale)}px solid ${layer.color}`,
                  borderRadius: Math.round(8 * zone.scale),
                  padding: `0 ${Math.round(24 * zone.scale)}px`,
                  boxSizing: "border-box",
                  opacity: slideProgress * (0.85 + globalPulse * 0.15),
                  transform: `translateX(${slideX}px)`,
                  boxShadow: `0 0 ${Math.round(8 * zone.scale)}px ${layer.color}40`,
                }}
              >
                {/* Icon */}
                <IconComponent
                  size={Math.round(64 * zone.scale)}
                  color={layer.color}
                  strokeWidth={2}
                  style={{ zIndex: 1, flexShrink: 0 }}
                />

                {/* Label */}
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
                  {layer.label}
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

export const AF_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

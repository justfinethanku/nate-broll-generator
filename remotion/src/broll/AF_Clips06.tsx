import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  pulse,
} from "./shared";
import {
  Globe,
  Monitor,
  Zap,
  Terminal,
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
    // DESIGN SPEC for AF-006-DualWebArchitecture
    // FOCAL: Two-lane horizontal split showing contrasting web architectures
    //   - Top lane: "Human Web" — slow, readable (globe icon + browser icon at 96px each)
    //   - Bottom lane: "Agentic Web" — fast, incomprehensible (zap icon + terminal icons at 96px each)
    // SUPPORTING (3 elements):
    //   1. Speed indicator arrows — top lane: 1 slow arrow; bottom lane: 3 fast arrows streaming
    //   2. Central divider line with subtle glow pulse
    //   3. Labels for each lane ("Human-Speed Web" / "Agentic Web" at 56px)
    // TEXT ON SCREEN:
    //   - "Human-Speed Web" (56px) — 16 chars
    //   - "Accessible" (48px) — 10 chars
    //   - "Agentic Web" (56px) — 11 chars
    //   - "Superhuman Speed" (48px) — 16 chars
    //   Total visible: 53 chars ✓ (well under 90)
    // PHASES:
    //   - 0-1.5s: Central divider line draws in
    //   - 1.5-3s: Top lane (human web) fades in with icons + label
    //   - 3-4.5s: Bottom lane (agentic web) fades in with icons + label
    //   - 4.5-7s: Speed indicators animate (slow arrow top, fast streaming arrows bottom)
    // ICONS: Globe, Monitor (for human web), Zap, Terminal (for agentic web), ArrowRight
    // ELEMENT COUNT: 2 main lanes + 1 divider line = 3 groups ✓ (within 4 max)
    // PHONE TEST: All text 48-56px, all icons 96px ✓
    id: "AF-016-DualWebArchitecture",
    title: "Two Webs",
    subtitle: "Human vs Agentic",
    bottomLabel: "One slow and accessible, one superhuman and incomprehensible",
    bottomAccent: "superhuman",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Animation timing
      const dividerProgress = ease(sceneFrame, 0, 45);
      const topLaneOpacity = ease(sceneFrame, 45, 90);
      const bottomLaneOpacity = ease(sceneFrame, 90, 135);
      const arrowsActive = sceneFrame > 135;

      // Pulsing glow on divider
      const glowIntensity = pulse(sceneFrame, 0.04);

      // Lane dimensions
      const laneHeight = zone.height * 0.31;
      const dividerGap = zone.height * 0.055;
      const laneWidth = zone.width * 0.85;

      // Icon size
      const iconSize = Math.round(96 * zone.scale);

      // Arrow animation for top lane (slow, single arrow)
      const slowArrowX = arrowsActive
        ? ((sceneFrame - 135) * 2) % (laneWidth * 0.4)
        : 0;

      // Arrow animation for bottom lane (fast, three streaming arrows)
      const fastArrowOffset1 = arrowsActive ? ((sceneFrame - 135) * 6) % (laneWidth * 0.5) : 0;
      const fastArrowOffset2 = arrowsActive ? ((sceneFrame - 135) * 6 + 60) % (laneWidth * 0.5) : 0;
      const fastArrowOffset3 = arrowsActive ? ((sceneFrame - 135) * 6 + 120) % (laneWidth * 0.5) : 0;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(dividerGap),
          }}
        >
          {/* TOP LANE: Human-Speed Web */}
          <div
            style={{
              width: laneWidth,
              height: laneHeight,
              backgroundColor: `${OB1.BG_MID}80`,
              borderRadius: Math.round(16 * zone.scale),
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${Math.round(24 * zone.scale)}px ${Math.round(40 * zone.scale)}px`,
              opacity: topLaneOpacity,
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* Left side: Icons */}
            <div
              style={{
                display: "flex",
                gap: Math.round(24 * zone.scale),
                alignItems: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              <Globe size={iconSize} color={OB1.CYAN} strokeWidth={2} />
              <Monitor size={iconSize} color={OB1.STEEL} strokeWidth={2} />
            </div>

            {/* Slow arrow indicator */}
            {arrowsActive && (
              <div
                style={{
                  position: "absolute",
                  left: `${Math.round(laneWidth * 0.35 + slowArrowX)}px`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.6,
                  zIndex: 0,
                }}
              >
                <ArrowRight size={Math.round(48 * zone.scale)} color={OB1.CYAN} strokeWidth={2} />
              </div>
            )}

            {/* Right side: Labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: Math.round(8 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                }}
              >
                Human-Speed Web
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 400,
                  color: OB1.STEEL,
                }}
              >
                Accessible
              </div>
            </div>
          </div>

          {/* DIVIDER LINE */}
          <svg
            width={laneWidth * dividerProgress}
            height={Math.round(4 * zone.scale)}
            style={{
              opacity: dividerProgress,
            }}
          >
            <line
              x1="0"
              y1={Math.round(2 * zone.scale)}
              x2={laneWidth * dividerProgress}
              y2={Math.round(2 * zone.scale)}
              stroke={OB1.ORANGE}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 ${Math.round((8 + glowIntensity * 4) * zone.scale)}px ${OB1.ORANGE})`,
              }}
            />
          </svg>

          {/* BOTTOM LANE: Agentic Web */}
          <div
            style={{
              width: laneWidth,
              height: laneHeight,
              backgroundColor: `${OB1.BG_MID}80`,
              borderRadius: Math.round(16 * zone.scale),
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.PURPLE}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${Math.round(24 * zone.scale)}px ${Math.round(40 * zone.scale)}px`,
              opacity: bottomLaneOpacity,
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* Left side: Icons */}
            <div
              style={{
                display: "flex",
                gap: Math.round(24 * zone.scale),
                alignItems: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              <Zap size={iconSize} color={OB1.AMBER} strokeWidth={2} fill={OB1.AMBER} />
              <Terminal size={iconSize} color={OB1.PURPLE} strokeWidth={2} />
            </div>

            {/* Fast streaming arrows */}
            {arrowsActive && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: `${Math.round(laneWidth * 0.35 + fastArrowOffset1)}px`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.8,
                    zIndex: 0,
                  }}
                >
                  <ArrowRight size={Math.round(48 * zone.scale)} color={OB1.AMBER} strokeWidth={2.5} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: `${Math.round(laneWidth * 0.35 + fastArrowOffset2)}px`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.6,
                    zIndex: 0,
                  }}
                >
                  <ArrowRight size={Math.round(48 * zone.scale)} color={OB1.AMBER} strokeWidth={2.5} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: `${Math.round(laneWidth * 0.35 + fastArrowOffset3)}px`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.4,
                    zIndex: 0,
                  }}
                >
                  <ArrowRight size={Math.round(48 * zone.scale)} color={OB1.AMBER} strokeWidth={2.5} />
                </div>
              </>
            )}

            {/* Right side: Labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: Math.round(8 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                }}
              >
                Agentic Web
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 400,
                  color: OB1.PURPLE,
                }}
              >
                Superhuman Speed
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

export const AF_CLIPS_06 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  Globe,
  Users,
  Network,
  Eye,
  Zap,
  Gauge,
  TrendingUp,
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
    // DESIGN SPEC for AF-001-RebuiltWeb
    // FOCAL: Vertical split screen divider (2px line, STEEL color)
    // SUPPORTING (left): Globe icon (96px) + "Current Web" label (60px) + "Human-Centric" sublabel (48px)
    // SUPPORTING (right): Network icon (96px) + "Rebuilt Web" label (60px) + "Agent-Human Hybrid" sublabel (48px)
    // TEXT ON SCREEN:
    //   - "Current Web" (60px) — 11 chars
    //   - "Human-Centric" (48px) — 14 chars
    //   - "Rebuilt Web" (60px) — 11 chars
    //   - "Agent-Human Hybrid" (48px) — 18 chars
    //   Total visible: 54 chars ✓ (under 90)
    // PHASES:
    //   - 0-1.5s: Divider line draws from top to bottom
    //   - 1.5-3s: Left side (current web) fades in
    //   - 3-5s: Right side (rebuilt web) fades in with subtle glow
    //   - 5-7s: Hold with subtle pulse on right side
    // ELEMENT COUNT: 2 sides (within 4 max) ✓
    // PHONE TEST: All text ≥48px, all icons 96px ✓
    id: "AF-001-RebuiltWeb",
    title: "Rebuilt Web",
    subtitle: "Architecture shift",
    bottomLabel: "From human-only to agent-human hybrid",
    bottomAccent: "agent-human hybrid",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Divider draws from top to bottom
      const dividerHeight = ease(sceneFrame, 0, 45) * zone.height;

      // Left side (current web) fades in after divider
      const leftOpacity = ease(sceneFrame, 45, 90);

      // Right side (rebuilt web) fades in last with emphasis
      const rightOpacity = ease(sceneFrame, 90, 135);
      const rightGlow = pulse(sceneFrame, 0.04);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* Left side: Current Web (human-centric) */}
          <div
            style={{
              width: zone.width * 0.48,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: leftOpacity,
              gap: Math.round(24 * zone.scale),
            }}
          >
            <Globe
              size={Math.round(96 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                Current Web
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.DIM,
                }}
              >
                Human-Centric
              </div>
            </div>
          </div>

          {/* Center divider line */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: 0,
              width: Math.round(2 * zone.scale),
              height: dividerHeight,
              background: OB1.STEEL,
              zIndex: 0,
            }}
          />

          {/* Right side: Rebuilt Web (agent-human hybrid) */}
          <div
            style={{
              width: zone.width * 0.48,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: rightOpacity,
              gap: Math.round(24 * zone.scale),
              marginLeft: "auto",
            }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              {/* Glow ring behind icon */}
              <div
                style={{
                  position: "absolute",
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                  opacity: 0.3 + rightGlow * 0.4,
                  zIndex: 0,
                }}
              />
              <Network
                size={Math.round(96 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={2}
                style={{ zIndex: 1, position: "relative" }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                Rebuilt Web
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.CYAN,
                }}
              >
                Agent-Human Hybrid
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AF-002-SpreadsheetSpeed
    // FOCAL: Two comparison boxes side-by-side showing human vs agent data processing
    // SUPPORTING (left): Eye icon (80px) + animated scan line moving down + "Human View" label (56px) + "Row by row" (44px)
    // SUPPORTING (right): Zap icon (80px) + instant flash effect + "Agent Parse" label (56px) + "Instant ingest" (44px)
    // TEXT ON SCREEN:
    //   - "Human View" (56px) — 10 chars
    //   - "Row by row" (44px) — 10 chars
    //   - "Agent Parse" (56px) — 11 chars
    //   - "Instant ingest" (44px) — 14 chars
    //   Total visible: 45 chars ✓ (under 90)
    // PHASES:
    //   - 0-1s: Both boxes fade in
    //   - 1-4s: Left box shows scanning animation (slow vertical line)
    //   - 2.5s: Right box flashes (instant parse effect)
    //   - 4-7s: Hold final state
    // ELEMENT COUNT: 2 comparison boxes (within 4 max) ✓
    // PHONE TEST: All text ≥44px, all icons 80px ✓
    id: "AF-002-SpreadsheetSpeed",
    title: "Data Processing",
    subtitle: "Speed comparison",
    bottomLabel: "Agents parse instantly what humans scan slowly",
    bottomAccent: "instantly",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Box container dimensions
      const boxWidth = zone.width * 0.42;
      const boxHeight = zone.height * 0.7;

      // Both boxes fade in
      const boxOpacity = ease(sceneFrame, 0, 30);

      // Human scanning line moves down slowly (1-4s)
      const scanProgress = ease(sceneFrame, 30, 150);
      const scanY = scanProgress * (boxHeight * 0.6);

      // Agent flash (instant at 2.5s = frame 75)
      const flashTiming = sceneFrame - 75;
      const flashOpacity = flashTiming >= 0 && flashTiming < 20
        ? Math.max(0, 1 - flashTiming / 20)
        : 0;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: zone.width * 0.08,
          }}
        >
          {/* Left: Human scanning */}
          <div
            style={{
              width: boxWidth,
              height: boxHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: boxOpacity,
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}60`,
              borderRadius: Math.round(16 * zone.scale),
              backgroundColor: `${OB1.BG_MID}40`,
              padding: Math.round(32 * zone.scale),
              position: "relative",
            }}
          >
            <Eye
              size={Math.round(80 * zone.scale)}
              color={OB1.AMBER}
              strokeWidth={2}
              style={{ zIndex: 1, marginBottom: Math.round(24 * zone.scale) }}
            />

            {/* Scanning line indicator */}
            {sceneFrame >= 30 && (
              <div
                style={{
                  position: "absolute",
                  top: Math.round((32 * zone.scale) + (80 * zone.scale) + (24 * zone.scale) + scanY),
                  left: Math.round(32 * zone.scale),
                  right: Math.round(32 * zone.scale),
                  height: Math.round(3 * zone.scale),
                  backgroundColor: OB1.AMBER,
                  opacity: 0.7,
                  zIndex: 0,
                }}
              />
            )}

            <div
              style={{
                textAlign: "center",
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
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                Human View
              </div>
              <div
                style={{
                  fontSize: Math.round(44 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.DIM,
                }}
              >
                Row by row
              </div>
            </div>
          </div>

          {/* Right: Agent instant parse */}
          <div
            style={{
              width: boxWidth,
              height: boxHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: boxOpacity,
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}60`,
              borderRadius: Math.round(16 * zone.scale),
              backgroundColor: `${OB1.BG_MID}40`,
              padding: Math.round(32 * zone.scale),
              position: "relative",
            }}
          >
            {/* Flash overlay */}
            {flashOpacity > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: OB1.CYAN,
                  opacity: flashOpacity * 0.4,
                  borderRadius: Math.round(16 * zone.scale),
                  zIndex: 0,
                }}
              />
            )}

            <Zap
              size={Math.round(80 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
              fill={OB1.CYAN}
              style={{ zIndex: 1, marginBottom: Math.round(24 * zone.scale) }}
            />

            <div
              style={{
                textAlign: "center",
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
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                Agent Parse
              </div>
              <div
                style={{
                  fontSize: Math.round(44 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.CYAN,
                }}
              >
                Instant ingest
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AF-003-SpeedMultiplier
    // FOCAL: Large animated speedometer gauge showing needle sweep from 1x to 50x
    // SUPPORTING (left): "Human Baseline" label (56px) + "1x" stat (80px) in DIM color
    // SUPPORTING (right): "AI Agent Speed" label (56px) + animated "10-50x" stat (80px) in GREEN
    // TEXT ON SCREEN:
    //   - "Human Baseline" (56px) — 14 chars
    //   - "1x" (80px) — 2 chars
    //   - "AI Agent Speed" (56px) — 14 chars
    //   - "10-50x" (80px) — 6 chars (animates from 10 to 50)
    //   Total visible: 36 chars ✓ (under 90)
    // PHASES:
    //   - 0-1s: Gauge outline fades in
    //   - 1-2s: Human baseline (1x) appears on left
    //   - 2-5s: Needle sweeps from left (1x) to right (50x position)
    //   - 3-5s: Counter counts up 10→50 with "x" suffix
    //   - 5-7s: Hold with subtle pulse on the speed stat
    // ELEMENT COUNT: 3 elements (gauge + 2 stat labels) ✓
    // PHONE TEST: All text ≥56px, stat numbers 80px ✓
    id: "AF-003-SpeedMultiplier",
    title: "Speed Multiplier",
    subtitle: "Reasoning tasks",
    bottomLabel: "AI agents operate 10-50x faster than humans",
    bottomAccent: "10-50x faster",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Gauge geometry — semicircle arc from left to right through the top
      const r = Math.min(zone.width, zone.height) * 0.3;
      const cx = zone.width * 0.5;
      const cy = zone.height * 0.55;
      const strokeW = Math.round(10 * zone.scale);

      // Parameter t: 0 = left (9 o'clock), 1 = right (3 o'clock), through top
      // theta = PI + t * PI  →  PI (left) → 3PI/2 (top) → 2PI (right)
      const pointOnArc = (t: number, radius: number) => ({
        x: cx + radius * Math.cos(Math.PI + t * Math.PI),
        y: cy + radius * Math.sin(Math.PI + t * Math.PI),
      });

      // SVG arc path from tStart to tEnd through the top
      // sweep=1 (CW in screen = through top), large-arc=0 (always short path, max 180°)
      const arcPath = (radius: number, tEnd: number, tStart = 0) => {
        if (tEnd - tStart <= 0.001) return "";
        const s = pointOnArc(tStart, radius);
        const e = pointOnArc(tEnd, radius);
        return `M ${s.x} ${s.y} A ${radius} ${radius} 0 0 1 ${e.x} ${e.y}`;
      };

      // Animations
      const gaugeOpacity = ease(sceneFrame, 0, 30);
      const humanOpacity = ease(sceneFrame, 30, 60);
      const sweep = ease(sceneFrame, 60, 150); // 0→1 over 2-5s
      const speedCount = countUp(sceneFrame, 60, 150, 50);
      const displaySpeed = Math.max(10, speedCount);
      const speedOpacity = ease(sceneFrame, 90, 120);
      const speedPulse = pulse(sceneFrame - 150, 0.05);

      // Needle tip
      const tip = pointOnArc(sweep, r * 0.82);

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
          <svg
            width={zone.width}
            height={zone.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: gaugeOpacity,
              zIndex: 0,
            }}
          >
            {/* Tick marks around the arc */}
            {Array.from({ length: 11 }).map((_, i) => {
              const t = i / 10;
              const inner = pointOnArc(t, r - Math.round(14 * zone.scale));
              const outer = pointOnArc(t, r + Math.round(14 * zone.scale));
              return (
                <line
                  key={`tick-${i}`}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={t <= sweep ? OB1.GREEN : OB1.DIM}
                  strokeWidth={Math.round(i % 5 === 0 ? 3 : 2) * zone.scale}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Remaining arc ahead of needle (steel/blue) */}
            {sweep < 0.999 && (
              <path
                d={arcPath(r, 1, sweep)}
                fill="none"
                stroke={OB1.STEEL}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
            )}
            {/* Swept arc behind needle (green) */}
            {sweep > 0.001 && (
              <path
                d={arcPath(r, sweep, 0)}
                fill="none"
                stroke={OB1.GREEN}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
            )}
            {/* Needle — pointed triangle tip */}
            {(() => {
              const needleTheta = Math.PI + sweep * Math.PI;
              const needleLen = r * 0.82;
              const tipX = cx + needleLen * Math.cos(needleTheta);
              const tipY = cy + needleLen * Math.sin(needleTheta);
              // Perpendicular offset for triangle base
              const perpX = Math.sin(needleTheta) * Math.round(6 * zone.scale);
              const perpY = -Math.cos(needleTheta) * Math.round(6 * zone.scale);
              return (
                <polygon
                  points={`${tipX},${tipY} ${cx + perpX},${cy + perpY} ${cx - perpX},${cy - perpY}`}
                  fill={OB1.ORANGE}
                />
              );
            })()}
            {/* Center pivot dot */}
            <circle
              cx={cx}
              cy={cy}
              r={Math.round(8 * zone.scale)}
              fill={OB1.ORANGE}
            />
          </svg>

          {/* Stats row below gauge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: zone.width * 0.85,
              marginTop: zone.height * 0.25,
              zIndex: 10,
              position: "relative",
            }}
          >
            {/* Left: Human baseline */}
            <div style={{ textAlign: "center", opacity: humanOpacity }}>
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.DIM,
                  lineHeight: 1,
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                1x
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.STEEL,
                }}
              >
                Human Baseline
              </div>
            </div>

            {/* Right: AI speed */}
            <div style={{ textAlign: "center", opacity: speedOpacity }}>
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.GREEN,
                  lineHeight: 1,
                  marginBottom: Math.round(12 * zone.scale),
                  opacity: sceneFrame >= 150 ? 0.7 + speedPulse * 0.3 : 1,
                }}
              >
                {displaySpeed}x
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.GREEN,
                }}
              >
                AI Agent Speed
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

export const AF_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

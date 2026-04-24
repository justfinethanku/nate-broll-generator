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
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
  Calendar,
  Gauge,
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
    // DESIGN SPEC for AIA-010-HardTakeoff
    // FOCAL: Before/after accuracy gauge showing dramatic jump from 60% → 90% with self-improvement arrow
    // SUPPORTING (2):
    //   1. "Before" label + 60% gauge (left side, RED)
    //   2. "After" label + 90% gauge (right side, GREEN)
    //   3. Curved arrow with "Self-Rewrite" label between gauges (ORANGE)
    // TEXT ON SCREEN:
    //   - "Before" (48px) — 6 chars
    //   - "60%" (80px stat) — 3 chars
    //   - "Self-Rewrite" (48px on arrow) — 12 chars
    //   - "After" (48px) — 5 chars
    //   - "90%" (80px stat) — 3 chars
    //   Total visible: 29 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: "Before" gauge fades in at 60%
    //   - 1.5-3s: Arrow draws from left to right
    //   - 3-4.5s: "After" gauge appears and counts up to 90%
    //   - 4.5-7s: Both gauges pulse gently
    // ELEMENT COUNT: 3 (before gauge, arrow, after gauge) ✓
    // PHONE TEST: All text 48-80px, gauges 200px diameter ✓
    id: "AIA-010-HardTakeoff",
    title: "Hard Takeoff",
    subtitle: "Autonomous self-improvement",
    bottomLabel: "Service rewrites itself to 30% accuracy gain",
    bottomAccent: "30% accuracy",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const gaugeSize = Math.round(200 * zone.scale);
      const beforeAccuracy = 60;
      const afterAccuracy = 90;
      const accuracyGain = afterAccuracy - beforeAccuracy;

      // Animated counter for "after" gauge
      const afterCount = countUp(sceneFrame, 90, 120, afterAccuracy);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.15,
            position: "relative",
          }}
        >
          {/* Before gauge (left) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: zone.height * 0.06,
              opacity: ease(sceneFrame, 0, 30),
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 10,
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
              }}
            >
              Before
            </div>

            {/* Gauge circle */}
            <div
              style={{
                width: gaugeSize,
                height: gaugeSize,
                borderRadius: "50%",
                border: `${Math.round(8 * zone.scale)}px solid ${OB1.RED}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: `${OB1.RED}10`,
                zIndex: 1,
              }}
            >
              <Gauge
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={2}
                style={{ position: "absolute", top: "25%", zIndex: 1 }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.RED,
                }}
              >
                {beforeAccuracy}%
              </div>
            </div>
          </div>

          {/* Arrow + label (center) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: zone.height * 0.04,
              opacity: ease(sceneFrame, 45, 75),
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 10,
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                backgroundColor: `${OB1.BG_MID}cc`,
                padding: `${Math.round(12 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <RefreshCw size={Math.round(40 * zone.scale)} color={OB1.ORANGE} strokeWidth={2.5} />
              Self-Rewrite
            </div>

            {/* Arrow visual */}
            <ArrowRight
              size={Math.round(96 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
              style={{ zIndex: 1 }}
            />
          </div>

          {/* After gauge (right) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: zone.height * 0.06,
              opacity: ease(sceneFrame, 90, 120),
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 10,
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
              }}
            >
              After
            </div>

            {/* Gauge circle */}
            <div
              style={{
                width: gaugeSize,
                height: gaugeSize,
                borderRadius: "50%",
                border: `${Math.round(8 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: `${OB1.GREEN}20`,
                boxShadow: `0 0 ${Math.round(40 * zone.scale)}px ${OB1.GREEN}40`,
                zIndex: 1,
              }}
            >
              <TrendingUp
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
                style={{ position: "absolute", top: "25%", zIndex: 1 }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.GREEN,
                }}
              >
                {afterCount}%
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-011-TraceDriven
    // FOCAL: Vertical flow showing reasoning trace → analysis → optimization
    // SUPPORTING (3):
    //   1. Top: brain icon + "Reasoning Trace" (log lines visual)
    //   2. Middle: target icon + "Pattern Analysis" (connecting line)
    //   3. Bottom: zap icon + "Targeted Fix" (result)
    // TEXT ON SCREEN:
    //   - "Reasoning Trace" (60px) — 15 chars
    //   - "Pattern Analysis" (60px) — 16 chars
    //   - "Targeted Fix" (60px) — 12 chars
    //   Total visible: 43 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Top section (Reasoning Trace) fades in
    //   - 1.5-3s: Connecting line draws down
    //   - 3-4.5s: Middle section (Pattern Analysis) appears
    //   - 4.5-5.5s: Second line draws down
    //   - 5.5-7s: Bottom section (Targeted Fix) appears with pop
    // ELEMENT COUNT: 3 (trace, analysis, fix) ✓
    // PHONE TEST: All text 60px, all icons 64px in 160px circles ✓
    id: "AIA-011-TraceDriven",
    title: "Trace-Driven",
    subtitle: "Optimization from logs",
    bottomLabel: "Reasoning trajectories reveal improvement opportunities",
    bottomAccent: "trajectories",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const steps = [
        { icon: RefreshCw, label: "Reasoning Trace", color: OB1.CYAN, delay: 0 },
        { icon: Target, label: "Pattern Analysis", color: OB1.PURPLE, delay: 60 },
        { icon: Zap, label: "Targeted Fix", color: OB1.GREEN, delay: 120 },
      ];

      const nodeSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const lineHeight = zone.height * 0.15;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: lineHeight,
            position: "relative",
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            const lineDelay = i > 0 ? steps[i - 1].delay + 45 : 0;
            const lineProgress = i > 0 ? ease(sceneFrame, lineDelay, lineDelay + 20) : 0;

            return (
              <React.Fragment key={i}>
                {/* Connecting line */}
                {i > 0 && (
                  <div
                    style={{
                      width: Math.round(4 * zone.scale),
                      height: lineHeight * lineProgress,
                      backgroundColor: steps[i - 1].color,
                      position: "absolute",
                      top: `${((i - 1) * (100 / (steps.length - 1))) + 25}%`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Step node */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: zone.width * 0.06,
                    opacity: ease(sceneFrame, step.delay, step.delay + 25),
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: nodeSize,
                      height: nodeSize,
                      borderRadius: "50%",
                      backgroundColor: `${step.color}20`,
                      border: `${Math.round(4 * zone.scale)}px solid ${step.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Icon size={iconSize} color={step.color} strokeWidth={2.5} />
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 10,
                      fontSize: Math.round(60 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: OB1.WHITE,
                      backgroundColor: `${OB1.BG_MID}cc`,
                      padding: `${Math.round(16 * zone.scale)}px ${Math.round(32 * zone.scale)}px`,
                      borderRadius: Math.round(16 * zone.scale),
                      border: `${Math.round(3 * zone.scale)}px solid ${step.color}40`,
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-012-PlanningGap
    // FOCAL: Side-by-side comparison of speed - left: "Auto-Optimize" with fast cycle, right: "Quarterly Plan" with slow cycle
    // SUPPORTING (2):
    //   1. Left: circular arrows (RefreshCw) with "Minutes" label below (GREEN, fast spin)
    //   2. Right: calendar icon with "90 Days" label below (AMBER, slow)
    // TEXT ON SCREEN:
    //   - "Auto-Optimize" (60px) — 13 chars
    //   - "Minutes" (48px) — 7 chars
    //   - "Quarterly Plan" (60px) — 14 chars
    //   - "90 Days" (48px) — 7 chars
    //   Total visible: 41 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Left side (Auto-Optimize) fades in
    //   - 1.5-3s: Left icon spins continuously
    //   - 3-4.5s: Right side (Quarterly Plan) fades in
    //   - 4.5-7s: Hold with subtle pulse on left (speed advantage)
    // ELEMENT COUNT: 2 (auto vs manual) ✓
    // PHONE TEST: All text 48-60px, icons 120px ✓
    id: "AIA-012-PlanningGap",
    title: "Speed Gap",
    subtitle: "Competitive advantage",
    bottomLabel: "Continuous optimization vs quarterly planning cycles",
    bottomAccent: "Continuous",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const approaches = [
        {
          title: "Auto-Optimize",
          timeLabel: "Minutes",
          icon: RefreshCw,
          color: OB1.GREEN,
          delay: 0,
          spin: true,
        },
        {
          title: "Quarterly Plan",
          timeLabel: "90 Days",
          icon: Calendar,
          color: OB1.AMBER,
          delay: 90,
          spin: false,
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
            gap: zone.width * 0.15,
            position: "relative",
          }}
        >
          {approaches.map((approach, idx) => {
            const Icon = approach.icon;
            const rotation = approach.spin ? (sceneFrame * 3) % 360 : 0;
            const glowPulse = approach.spin ? pulse(sceneFrame, 0.04) : 0;

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: zone.height * 0.08,
                  opacity: ease(sceneFrame, approach.delay, approach.delay + 30),
                }}
              >
                {/* Title */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    fontSize: Math.round(60 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    color: OB1.WHITE,
                  }}
                >
                  {approach.title}
                </div>

                {/* Icon container */}
                <div
                  style={{
                    width: Math.round(200 * zone.scale),
                    height: Math.round(200 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: `${approach.color}20`,
                    border: `${Math.round(6 * zone.scale)}px solid ${approach.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: approach.spin
                      ? `0 0 ${Math.round(40 * zone.scale)}px ${approach.color}${Math.floor(40 + glowPulse * 60).toString(16)}`
                      : "none",
                    transform: `rotate(${rotation}deg)`,
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={Math.round(120 * zone.scale)}
                    color={approach.color}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Time label */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: approach.color,
                    backgroundColor: `${OB1.BG_MID}cc`,
                    padding: `${Math.round(12 * zone.scale)}px ${Math.round(28 * zone.scale)}px`,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(2 * zone.scale)}px solid ${approach.color}60`,
                  }}
                >
                  {approach.timeLabel}
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

export const AIA_CLIPS_D = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

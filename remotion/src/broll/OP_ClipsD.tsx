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
  Activity,
  Brain,
  Sparkles,
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
    // DESIGN SPEC for OP-010-At31And (REVISED)
    // FOCAL: Two side-by-side gauge dials showing 3.1 vs 3.35
    // SUPPORTING: "90.19%" accuracy callout between the gauges
    // TEXT ON SCREEN:
    //   - "3.1" (72px) — 3 chars
    //   - "3.35" (72px) — 4 chars
    //   - "90.19%" (64px, between gauges) — 6 chars
    //   - "Opus 4.7" (44px) — 8 chars
    //   - "ChatGPT" (44px) — 7 chars
    //   Total visible: 28 chars ✓
    // VERTICAL BUDGET:
    //   - Gauges: 240px (radius 120px each)
    //   - Scores below: 72px
    //   - Labels below: 44px
    //   - Gaps: 40px
    //   Total: ~396px ✓ (well under 576px)
    // LAYOUT: Horizontal with accuracy stat centered between gauges
    id: "OP-010-At31And",
    title: "Big Law Bench",
    subtitle: "Legal reasoning accuracy",
    bottomLabel: "Both models within noise of single reviewer",
    bottomAccent: "single reviewer",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const gaugeRadius = Math.min(zone.width, zone.height) * 0.18;
      const gaugeGap = zone.width * 0.12;

      const gauges = [
        { score: 3.1, label: "Opus 4.7", logo: "claude", color: OB1.ORANGE, delay: 20 },
        { score: 3.35, label: "ChatGPT", logo: "openai", color: OB1.CYAN, delay: 50 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: gaugeGap,
          }}
        >
          {/* Left Gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {gauges.slice(0, 1).map((g, idx) => {
              const fillProgress = ease(sceneFrame, g.delay, g.delay + 30);
              const startAngle = -135;
              const endAngle = 135;
              const totalSweep = endAngle - startAngle;
              const maxScore = 4.0;
              const fillAngle = startAngle + (g.score / maxScore) * totalSweep;

              return (
                <React.Fragment key={idx}>
                  {/* Gauge SVG */}
                  <div style={{ position: "relative" }}>
                    <svg
                      width={gaugeRadius * 2}
                      height={gaugeRadius * 2}
                      style={{ opacity: ease(sceneFrame, g.delay, g.delay + 15) }}
                    >
                      {/* Background arc */}
                      <path
                        d={describeArc(gaugeRadius, gaugeRadius, gaugeRadius * 0.85, startAngle, endAngle)}
                        fill="none"
                        stroke={OB1.DIM}
                        strokeWidth={Math.round(6 * zone.scale)}
                        strokeLinecap="round"
                      />
                      {/* Fill arc */}
                      <path
                        d={describeArc(
                          gaugeRadius,
                          gaugeRadius,
                          gaugeRadius * 0.85,
                          startAngle,
                          startAngle + (fillAngle - startAngle) * fillProgress
                        )}
                        fill="none"
                        stroke={g.color}
                        strokeWidth={Math.round(6 * zone.scale)}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Center logo */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div style={{ ...bouncePop(sceneFrame, g.delay + 10, fps) }}>
                        <Img
                          src={staticFile(`logos/${g.logo}.svg`)}
                          style={{
                            width: Math.round(56 * zone.scale),
                            height: Math.round(56 * zone.scale),
                            filter: "brightness(0) invert(1)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, g.delay + 20),
                      fontSize: Math.round(72 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: g.color,
                      marginTop: Math.round(12 * zone.scale),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {g.score.toFixed(2)}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, g.delay + 25),
                      fontSize: Math.round(44 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      marginTop: Math.round(4 * zone.scale),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {g.label}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Center Accuracy Stat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              ...fadeInUp(sceneFrame, 80),
            }}
          >
            <div
              style={{
                fontSize: Math.round(64 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              90.19%
            </div>
            <div
              style={{
                fontSize: Math.round(40 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                marginTop: Math.round(4 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Accuracy
            </div>
          </div>

          {/* Right Gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {gauges.slice(1, 2).map((g, idx) => {
              const fillProgress = ease(sceneFrame, g.delay, g.delay + 30);
              const startAngle = -135;
              const endAngle = 135;
              const totalSweep = endAngle - startAngle;
              const maxScore = 4.0;
              const fillAngle = startAngle + (g.score / maxScore) * totalSweep;

              return (
                <React.Fragment key={idx}>
                  {/* Gauge SVG */}
                  <div style={{ position: "relative" }}>
                    <svg
                      width={gaugeRadius * 2}
                      height={gaugeRadius * 2}
                      style={{ opacity: ease(sceneFrame, g.delay, g.delay + 15) }}
                    >
                      {/* Background arc */}
                      <path
                        d={describeArc(gaugeRadius, gaugeRadius, gaugeRadius * 0.85, startAngle, endAngle)}
                        fill="none"
                        stroke={OB1.DIM}
                        strokeWidth={Math.round(6 * zone.scale)}
                        strokeLinecap="round"
                      />
                      {/* Fill arc */}
                      <path
                        d={describeArc(
                          gaugeRadius,
                          gaugeRadius,
                          gaugeRadius * 0.85,
                          startAngle,
                          startAngle + (fillAngle - startAngle) * fillProgress
                        )}
                        fill="none"
                        stroke={g.color}
                        strokeWidth={Math.round(6 * zone.scale)}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Center logo */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div style={{ ...bouncePop(sceneFrame, g.delay + 10, fps) }}>
                        <Img
                          src={staticFile(`logos/${g.logo}.svg`)}
                          style={{
                            width: Math.round(56 * zone.scale),
                            height: Math.round(56 * zone.scale),
                            filter: "brightness(0) invert(1)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, g.delay + 20),
                      fontSize: Math.round(72 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: g.color,
                      marginTop: Math.round(12 * zone.scale),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {g.score.toFixed(2)}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, g.delay + 25),
                      fontSize: Math.round(44 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      marginTop: Math.round(4 * zone.scale),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {g.label}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-011-ReallyPulled (REVISED)
    // FOCAL: Timeline showing 4.7 trajectory curving upward vs 4.6 baseline
    // SUPPORTING: Axis labels and stage markers
    // TEXT ON SCREEN:
    //   - "Simple" (48px) — 6 chars
    //   - "Complex" (48px) — 7 chars
    //   - "4.6" (56px) — 3 chars
    //   - "4.7" (56px) — 3 chars
    //   Total visible: 19 chars ✓
    // LAYOUT: Graph scaled to 80% of zone, better fill
    id: "OP-011-ReallyPulled",
    title: "Agentic Advantage",
    subtitle: "Complex task performance",
    bottomLabel: "4.7 pulls ahead on multi-agent workflows",
    bottomAccent: "pulls ahead",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const graphWidth = zone.width * 0.75;
      const graphHeight = zone.height * 0.6;
      const graphX = zone.width * 0.125;
      const graphY = zone.height * 0.2;

      const baselineProgress = ease(sceneFrame, 30, 75);
      const trajectoryProgress = ease(sceneFrame, 75, 135);

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
          <svg width={zone.width} height={zone.height}>
            {/* Y-axis */}
            <line
              x1={graphX}
              y1={graphY}
              x2={graphX}
              y2={graphY + graphHeight}
              stroke={OB1.DIM}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={ease(sceneFrame, 0, 20)}
            />

            {/* X-axis */}
            <line
              x1={graphX}
              y1={graphY + graphHeight}
              x2={graphX + graphWidth}
              y2={graphY + graphHeight}
              stroke={OB1.DIM}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={ease(sceneFrame, 0, 20)}
            />

            {/* Baseline (simple tasks - flat) */}
            <line
              x1={graphX}
              y1={graphY + graphHeight * 0.65}
              x2={graphX + graphWidth * baselineProgress}
              y2={graphY + graphHeight * 0.65}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(5 * zone.scale)}
              strokeLinecap="round"
            />

            {/* 4.7 trajectory (curved upward) */}
            <path
              d={`
                M ${graphX} ${graphY + graphHeight * 0.65}
                Q ${graphX + graphWidth * 0.5 * trajectoryProgress} ${graphY + graphHeight * 0.4}
                  ${graphX + graphWidth * trajectoryProgress} ${graphY + graphHeight * 0.15}
              `}
              fill="none"
              stroke={OB1.ORANGE}
              strokeWidth={Math.round(6 * zone.scale)}
              strokeLinecap="round"
            />
          </svg>

          {/* Simple label */}
          <div
            style={{
              position: "absolute",
              left: graphX + graphWidth * 0.15,
              top: graphY + graphHeight + zone.height * 0.04,
              ...fadeInUp(sceneFrame, 35),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              zIndex: 10,
            }}
          >
            Simple
          </div>

          {/* Complex label */}
          <div
            style={{
              position: "absolute",
              left: graphX + graphWidth * 0.65,
              top: graphY + graphHeight + zone.height * 0.04,
              ...fadeInUp(sceneFrame, 80),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.ORANGE,
              zIndex: 10,
            }}
          >
            Complex
          </div>

          {/* 4.6 label (start) */}
          <div
            style={{
              position: "absolute",
              left: graphX - zone.width * 0.06,
              top: graphY + graphHeight * 0.65 - zone.height * 0.04,
              ...fadeInUp(sceneFrame, 75),
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.mono,
              fontWeight: 700,
              color: OB1.STEEL,
              zIndex: 10,
            }}
          >
            4.6
          </div>

          {/* 4.7 label + logo (end) */}
          <div
            style={{
              position: "absolute",
              left: graphX + graphWidth + zone.width * 0.01,
              top: graphY + graphHeight * 0.15 - zone.height * 0.06,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(6 * zone.scale),
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 100, fps) }}>
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(56 * zone.scale),
                  height: Math.round(56 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 105),
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              4.7
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-012-AnyFutureAI (REVISED)
    // FOCAL: 3-stage horizontal roadmap with proper spacing
    // TEXT ON SCREEN:
    //   - "Current" (52px) — 7 chars
    //   - "Planning" (52px) — 8 chars
    //   - "Autonomous" (52px) — 10 chars
    //   Total visible: 25 chars ✓
    // LAYOUT: Reduced stage width and gap to fit all 3 stages comfortably
    id: "OP-012-AnyFutureAI",
    title: "Future Capabilities",
    subtitle: "Agentic systems on the horizon",
    bottomLabel: "Planning improvements coming to agentic AI",
    bottomAccent: "Planning improvements",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stages: Array<{
        label: string;
        Icon: typeof Activity;
        color: string;
        delay: number;
      }> = [
        { label: "Current", Icon: Activity, color: OB1.STEEL, delay: 20 },
        { label: "Planning", Icon: Brain, color: OB1.CYAN, delay: 60 },
        { label: "Autonomous", Icon: Sparkles, color: OB1.PURPLE, delay: 100 },
      ];

      const stageWidth = zone.width * 0.18;
      const stageGap = zone.width * 0.06;
      const totalWidth = stageWidth * 3 + stageGap * 2 + Math.round(48 * zone.scale) * 2;
      const startX = (zone.width - totalWidth) / 2;

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
              gap: stageGap,
            }}
          >
            {stages.map((stage, idx) => {
              const Icon = stage.Icon;
              const showArrow = idx < stages.length - 1;
              const arrowDelay = stage.delay + 25;

              return (
                <React.Fragment key={idx}>
                  {/* Stage */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: Math.round(14 * zone.scale),
                      width: stageWidth,
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        ...bouncePop(sceneFrame, stage.delay, fps),
                        width: Math.round(140 * zone.scale),
                        height: Math.round(140 * zone.scale),
                        borderRadius: "50%",
                        backgroundColor: stage.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: idx === 2 ? 0.7 + pulse(sceneFrame - stage.delay, 0.03) * 0.3 : 1,
                      }}
                    >
                      <Icon
                        size={Math.round(68 * zone.scale)}
                        color={OB1.WHITE}
                      />
                    </div>

                    {/* Label */}
                    <div
                      style={{
                        ...fadeInUp(sceneFrame, stage.delay + 12),
                        fontSize: Math.round(52 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: stage.color,
                        textAlign: "center",
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {stage.label}
                    </div>
                  </div>

                  {/* Arrow */}
                  {showArrow && (
                    <div
                      style={{
                        ...fadeInUp(sceneFrame, arrowDelay),
                      }}
                    >
                      <ArrowRight
                        size={Math.round(48 * zone.scale)}
                        color={OB1.DIM}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      );
    },
  },
];

// Helper function for SVG arc paths
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

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

export const OP_CLIPS_D = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  Server,
  Zap,
  TrendingUp,
  Building2,
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
    // DESIGN SPEC for SS-010-land use bills
    // FOCAL: Large power meter/gauge visualization showing grid capacity strain
    // SUPPORTING (3):
    //   1. "Data Centers" label with Server icon (64px) on left
    //   2. Rising bar chart showing energy demand growth
    //   3. "Grid Capacity" threshold line in red
    // TEXT ON SCREEN:
    //   - "Data Centers" (48px) — 12 chars
    //   - "Energy Demand" (56px) — 13 chars
    //   - "Grid Limit" (48px) — 10 chars
    //   Total visible: 35 chars ✓
    // PHASES:
    //   - 0-1.5s: Power gauge outline fades in
    //   - 1.5-3s: Demand bars grow from left (showing increasing power consumption)
    //   - 3-4s: Red threshold line draws
    //   - 4-7s: Pulse effect on bars nearing threshold
    // LOGOS: None (abstract concept uses Server icon from lucide-react)
    // ELEMENT COUNT: 1 gauge + 3 bars + 1 threshold line = conceptually 3 groups ✓
    // PHONE TEST: All text 48-56px ✓
    id: "SS-010-LandUseBills",
    title: "Power Demand",
    subtitle: "Data centers vs grid capacity",
    bottomLabel: "Infrastructure collision course",
    bottomAccent: "collision",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Gauge outline
      const gaugeOpacity = ease(sceneFrame, 0, 30);
      const gaugeSize = zone.width * 0.35;

      // Three demand bars representing growth over time
      const bars = [
        { year: "2024", level: 0.55, color: OB1.AMBER, delay: 45 },
        { year: "2025", level: 0.78, color: OB1.ORANGE, delay: 60 },
        { year: "2026", level: 0.95, color: OB1.RED, delay: 75 },
      ];

      // Threshold line
      const thresholdOpacity = ease(sceneFrame, 90, 110);
      const pulseVal = pulse(sceneFrame, 0.04);

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
          {/* Server icon + label at top */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              display: "flex",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            <Server
              size={Math.round(64 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
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
              Data Centers
            </div>
          </div>

          {/* Circular gauge background */}
          <div
            style={{
              width: gaugeSize,
              height: gaugeSize,
              borderRadius: "50%",
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.DIM}`,
              opacity: gaugeOpacity,
              marginBottom: zone.height * 0.06,
              zIndex: 0,
              position: "relative",
            }}
          />

          {/* "Energy Demand" label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 35),
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.05,
              zIndex: 10,
              position: "relative",
            }}
          >
            Energy Demand
          </div>

          {/* Bar chart showing growth */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.04,
              alignItems: "flex-end",
              width: zone.width * 0.75,
              height: zone.height * 0.25,
              position: "relative",
            }}
          >
            {bars.map((bar, i) => {
              const barHeight = ease(sceneFrame, bar.delay, bar.delay + 30) * (zone.height * 0.25 * bar.level);
              const barPulse = bar.level > 0.85 ? 0.5 + pulseVal * 0.5 : 1;

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(12 * zone.scale),
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: barHeight,
                      backgroundColor: bar.color,
                      borderRadius: Math.round(6 * zone.scale),
                      opacity: barPulse,
                      zIndex: 1,
                      position: "relative",
                    }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 500,
                      color: OB1.STEEL,
                      opacity: ease(sceneFrame, bar.delay + 20, bar.delay + 30),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {bar.year}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid capacity threshold line */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.125,
              right: zone.width * 0.125,
              bottom: zone.height * 0.35,
              height: Math.round(3 * zone.scale),
              backgroundColor: OB1.RED,
              opacity: thresholdOpacity,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.125,
              bottom: zone.height * 0.35 + Math.round(12 * zone.scale),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.RED,
              opacity: thresholdOpacity,
              zIndex: 10,
            }}
          >
            Grid Limit
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for SS-011-message was not
    // FOCAL: Atlassian logo (140px) at top with "1,600" counter below
    // SUPPORTING (3):
    //   - Engineering bar (longest, ~60% width)
    //   - Sales bar (medium, ~30% width)
    //   - G&A bar (shorter, ~20% width)
    // Each bar has icon (Zap/TrendingUp/Building2 at 56px) + department label (48px)
    // TEXT ON SCREEN:
    //   - "1,600" (80px counter) — 5 chars
    //   - "Engineering" (48px) — 11 chars
    //   - "Sales" (48px) — 5 chars
    //   - "G&A" (48px) — 3 chars
    //   Total visible: 24 chars ✓
    // PHASES:
    //   - 0-1s: Atlassian logo pops in
    //   - 1-2s: Counter animates to 1,600
    //   - 2-3.5s: Three bars grow sequentially (staggered 0.4s apart)
    //   - 3.5-7s: Hold
    // LOGOS: atlassian.svg (140px)
    // ELEMENT COUNT: 1 logo+counter group + 3 department bars = 4 ✓
    // PHONE TEST: Logo 140px, counter 80px, all labels 48px ✓
    id: "SS-011-MessageWasNot",
    title: "Layoffs",
    subtitle: "Atlassian restructuring",
    bottomLabel: "1,600 employees across engineering, sales, G&A",
    bottomAccent: "1,600",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const count = countUp(sceneFrame, 30, 60, 1600);

      const departments = [
        { label: "Engineering", icon: Zap, width: 0.6, color: OB1.RED, delay: 60 },
        { label: "Sales", icon: TrendingUp, width: 0.35, color: OB1.ORANGE, delay: 72 },
        { label: "G&A", icon: Building2, width: 0.25, color: OB1.AMBER, delay: 84 },
      ];

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
          {/* Atlassian logo */}
          <div style={{ ...bouncePop(sceneFrame, 10, fps), marginBottom: zone.height * 0.04 }}>
            <Img
              src={staticFile("logos/atlassian.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Counter */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 30),
              fontSize: Math.round(80 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            {Math.floor(count).toLocaleString()}
          </div>

          {/* Department breakdown bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: zone.height * 0.04,
              width: zone.width * 0.85,
            }}
          >
            {departments.map((dept, i) => {
              const barWidth = ease(sceneFrame, dept.delay, dept.delay + 30) * (zone.width * 0.85 * dept.width);
              const Icon = dept.icon;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(16 * zone.scale),
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      opacity: ease(sceneFrame, dept.delay, dept.delay + 20),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    <Icon
                      size={Math.round(56 * zone.scale)}
                      color={dept.color}
                      strokeWidth={2.5}
                    />
                  </div>

                  {/* Bar */}
                  <div
                    style={{
                      width: barWidth,
                      height: Math.round(60 * zone.scale),
                      backgroundColor: dept.color,
                      borderRadius: Math.round(8 * zone.scale),
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: Math.round(20 * zone.scale),
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        opacity: ease(sceneFrame, dept.delay + 15, dept.delay + 30),
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {dept.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for SS-012-revenue compression for
    // FOCAL: Line chart showing downward stock trend (Atlassian) vs flat market line
    // SUPPORTING (2):
    //   1. Atlassian logo (96px) + line in RED
    //   2. "Market" label (48px) + line in STEEL
    // Chart shows 2024-2026 x-axis (year labels at 48px), percentage drop on left
    // TEXT ON SCREEN:
    //   - "2024" "2025" "2026" (48px) — 12 chars
    //   - "Market" (48px) — 6 chars
    //   - "Atlassian" (implied by logo)
    //   Total visible: 18 chars ✓
    // PHASES:
    //   - 0-1s: Axes fade in
    //   - 1-2.5s: Market line draws (gentle decline)
    //   - 2.5-4.5s: Atlassian line draws (steep drop)
    //   - 4.5-5.5s: Atlassian logo pops in next to its line
    //   - 5.5-7s: Gentle pulse on the gap between lines
    // LOGOS: atlassian.svg (96px)
    // ELEMENT COUNT: 2 lines + 2 labels/logos = 2 groups ✓
    // PHONE TEST: All text 48px, logo 96px ✓
    id: "SS-012-RevenueCompressionFor",
    title: "Stock Performance",
    subtitle: "SaaS market headwinds",
    bottomLabel: "Atlassian underperforms market 2024-2026",
    bottomAccent: "underperforms",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const chartWidth = zone.width * 0.85;
      const chartHeight = zone.height * 0.55;
      const chartLeft = zone.width * 0.075;
      const chartTop = zone.height * 0.2;

      // Axes
      const axisOpacity = ease(sceneFrame, 0, 30);

      // Data points (normalized 0-1, where 1 is top of chart)
      const years = ["2024", "2025", "2026"];
      const marketData = [0.85, 0.78, 0.72]; // gentle decline
      const atlassianData = [0.85, 0.55, 0.35]; // steep drop

      // Line drawing progress
      const marketProgress = ease(sceneFrame, 30, 75);
      const atlassianProgress = ease(sceneFrame, 75, 135);

      // Logo pop
      const logoOpacity = ease(sceneFrame, 135, 165);

      // Pulse effect on gap
      const pulseVal = pulse(sceneFrame - 165, 0.03);
      const gapOpacity = sceneFrame > 165 ? 0.15 + pulseVal * 0.1 : 0;

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
          {/* SVG chart */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* Y-axis */}
            <line
              x1={chartLeft}
              y1={chartTop}
              x2={chartLeft}
              y2={chartTop + chartHeight}
              stroke={OB1.DIM}
              strokeWidth={Math.round(2 * zone.scale)}
              opacity={axisOpacity}
            />

            {/* X-axis */}
            <line
              x1={chartLeft}
              y1={chartTop + chartHeight}
              x2={chartLeft + chartWidth}
              y2={chartTop + chartHeight}
              stroke={OB1.DIM}
              strokeWidth={Math.round(2 * zone.scale)}
              opacity={axisOpacity}
            />

            {/* Market line (STEEL, gentle decline) */}
            {marketProgress > 0 && (
              <polyline
                points={years
                  .map((_, i) => {
                    const x = chartLeft + (i / (years.length - 1)) * chartWidth;
                    const y = chartTop + (1 - marketData[i]) * chartHeight;
                    return `${x},${y}`;
                  })
                  .slice(0, Math.ceil(marketProgress * years.length))
                  .join(" ")}
                fill="none"
                stroke={OB1.STEEL}
                strokeWidth={Math.round(4 * zone.scale)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={marketProgress}
              />
            )}

            {/* Atlassian line (RED, steep drop) */}
            {atlassianProgress > 0 && (
              <polyline
                points={years
                  .map((_, i) => {
                    const x = chartLeft + (i / (years.length - 1)) * chartWidth;
                    const y = chartTop + (1 - atlassianData[i]) * chartHeight;
                    return `${x},${y}`;
                  })
                  .slice(0, Math.ceil(atlassianProgress * years.length))
                  .join(" ")}
                fill="none"
                stroke={OB1.RED}
                strokeWidth={Math.round(4 * zone.scale)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={atlassianProgress}
              />
            )}

            {/* Gap highlight between lines at 2026 */}
            {gapOpacity > 0 && (
              <rect
                x={chartLeft + chartWidth * 0.8}
                y={chartTop + (1 - atlassianData[2]) * chartHeight}
                width={chartWidth * 0.15}
                height={(atlassianData[2] - marketData[2]) * chartHeight}
                fill={OB1.RED}
                opacity={gapOpacity}
              />
            )}
          </svg>

          {/* Year labels below X-axis */}
          <div
            style={{
              position: "absolute",
              top: chartTop + chartHeight + Math.round(20 * zone.scale),
              left: chartLeft,
              width: chartWidth,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {years.map((year, i) => (
              <div
                key={i}
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.STEEL,
                  opacity: ease(sceneFrame, 20 + i * 10, 40 + i * 10),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                {year}
              </div>
            ))}
          </div>

          {/* Market label (top right) */}
          <div
            style={{
              position: "absolute",
              top: chartTop + Math.round(20 * zone.scale),
              right: zone.width * 0.075,
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              opacity: ease(sceneFrame, 60, 75),
              zIndex: 10,
            }}
          >
            Market
          </div>

          {/* Atlassian logo (appears at end of its line) */}
          <div
            style={{
              position: "absolute",
              left: chartLeft + chartWidth + Math.round(30 * zone.scale),
              top: chartTop + (1 - atlassianData[2]) * chartHeight - Math.round(48 * zone.scale),
              opacity: logoOpacity,
              transform: `scale(${logoOpacity})`,
            }}
          >
            <Img
              src={staticFile("logos/atlassian.svg")}
              style={{
                width: Math.round(96 * zone.scale),
                height: Math.round(96 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
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

export const SS_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

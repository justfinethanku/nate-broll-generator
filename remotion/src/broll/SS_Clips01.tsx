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
  stagger,
  pulse,
} from "./shared";

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
    // DESIGN SPEC for SS-001-StructuralMovesThat
    // FOCAL: Vertical timeline with 5 major March 2026 AI events as connected nodes
    // SUPPORTING (3):
    //   1. Date labels on left (60px, white)
    //   2. Company logos in timeline nodes (120px each)
    //   3. Brief event labels on right (48px, dimmed)
    // TIMELINE STRUCTURE:
    //   - Central vertical line (STEEL, 4px, runs from top to bottom of GFX zone)
    //   - 5 circle nodes along line at even spacing
    //   - Each node: 160px diameter circle (BG_MID fill), 120px logo centered, pulse animation on appearance
    //   - Date on left, event description on right
    // TEXT ON SCREEN:
    //   - 5 dates: "Mar 3", "Mar 7", "Mar 12", "Mar 18", "Mar 24" (60px each) = 30 chars
    //   - 5 event labels (abbreviated): "Gemini 2", "GPT-5", "Claude Opus", "Meta AI", "Copilot+" (avg 9 chars × 5 = 45)
    //   - Total: ~75 chars ✓
    // PHASES:
    //   - 0-1s: Timeline spine draws from top to bottom
    //   - 1-4s: Nodes appear sequentially (staggered 15 frames each)
    //   - 4-7s: Hold with subtle pulse on nodes
    // LOGOS: googlegemini.svg, openai.svg, anthropic.svg, meta.svg, microsoft.svg
    // ELEMENT COUNT: 5 timeline nodes (grouped visually as 1 timeline element) + dates + labels = 3 groups ✓
    // PHONE TEST: All text 48-60px, all logos 120px ✓
    id: "SS-001-StructuralMovesThat",
    title: "March 2026",
    subtitle: "Five structural shifts",
    bottomLabel: "Every major AI lab shipped in one month",
    bottomAccent: "one month",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Timeline events (5 major announcements)
      const events = [
        { date: "Mar 3", label: "Google", logo: "googlegemini.svg", color: OB1.CYAN },
        { date: "Mar 7", label: "OpenAI", logo: "openai.svg", color: OB1.GREEN },
        { date: "Mar 12", label: "Anthropic", logo: "anthropic.svg", color: OB1.AMBER },
        { date: "Mar 18", label: "Meta", logo: "meta.svg", color: OB1.PURPLE },
        { date: "Mar 24", label: "Microsoft", logo: "microsoft.svg", color: OB1.ORANGE },
      ];

      // Vertical timeline spine draws from top to bottom (frames 0-30)
      const spineProgress = ease(sceneFrame, 0, 30);
      const spineHeight = zone.height * 0.85 * spineProgress;

      // Node spacing
      const nodeSpacing = (zone.height * 0.85) / (events.length + 1);
      const nodeSize = Math.round(160 * zone.scale);
      const logoSize = Math.round(120 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Timeline spine — vertical line, zIndex 0 */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.075,
              width: Math.round(4 * zone.scale),
              height: spineHeight,
              backgroundColor: OB1.STEEL,
              opacity: 0.6,
              zIndex: 0,
            }}
          />

          {/* Timeline nodes */}
          {events.map((event, i) => {
            const nodeDelay = 30 + stagger(i, 0, 15);
            const nodeY = zone.height * 0.075 + nodeSpacing * (i + 1);
            const nodeOpacity = ease(sceneFrame, nodeDelay, nodeDelay + 20);
            const pulseVal = pulse(sceneFrame - nodeDelay, 0.04);

            return (
              <React.Fragment key={i}>
                {/* Node circle — zIndex 1 */}
                <div
                  style={{
                    position: "absolute",
                    left: zone.width * 0.5 - nodeSize / 2,
                    top: nodeY - nodeSize / 2,
                    width: nodeSize,
                    height: nodeSize,
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${event.color}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: nodeOpacity * (0.9 + pulseVal * 0.1),
                    zIndex: 1,
                  }}
                >
                  {/* Logo — zIndex 1 (inside node) */}
                  <Img
                    src={staticFile(`logos/${event.logo}`)}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>

                {/* Date label (left) — zIndex 10 */}
                <div
                  style={{
                    position: "absolute",
                    right: zone.width * 0.5 + nodeSize / 2 + zone.width * 0.06,
                    top: nodeY - Math.round(30 * zone.scale),
                    fontSize: Math.round(60 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(sceneFrame, nodeDelay + 10, nodeDelay + 25),
                    zIndex: 10,
                  }}
                >
                  {event.date}
                </div>

                {/* Event label (right) — zIndex 10 */}
                <div
                  style={{
                    position: "absolute",
                    left: zone.width * 0.5 + nodeSize / 2 + zone.width * 0.06,
                    top: nodeY - Math.round(24 * zone.scale),
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 500,
                    color: OB1.DIM,
                    opacity: ease(sceneFrame, nodeDelay + 10, nodeDelay + 25),
                    zIndex: 10,
                  }}
                >
                  {event.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for SS-002-GettingMoreDense
    // FOCAL: Two-panel comparison — left: chaotic noise scatter, right: clean signal line
    // SUPPORTING (2):
    //   1. Left panel label "NOISE" (80px, RED) above scattered dots
    //   2. Right panel label "SIGNAL" (80px, GREEN) above clean trend line
    // VISUAL:
    //   - Split screen with vertical separator line (STEEL, 2px) at 50%
    //   - Left panel: 80-100 small dots (8px, DIM opacity 0.3-0.7) scattered randomly
    //   - Right panel: Single clean ascending curve (CYAN, 6px stroke) with 3 key points marked (24px circles, ORANGE fill)
    //   - Arrow pointing from left to right panel (STEEL, 3px, at vertical center, appears at 3s)
    // TEXT ON SCREEN:
    //   - "NOISE" (5 chars)
    //   - "SIGNAL" (6 chars)
    //   - Optional: "Extract" below arrow (7 chars)
    //   - Total: 18 chars ✓
    // PHASES:
    //   - 0-1.5s: Left panel dots appear randomly (staggered)
    //   - 1.5-3s: "NOISE" label fades in
    //   - 3-4s: Arrow draws from left to right
    //   - 4-5.5s: Right panel curve draws, key points pop in
    //   - 5.5-7s: "SIGNAL" label fades in, hold
    // ELEMENT COUNT: 2 panels (left noise, right signal) = 2 ✓
    // PHONE TEST: Labels 80px, extraction visual clear ✓
    id: "SS-002-GettingMoreDense",
    title: "Signal Extraction",
    subtitle: "Finding clarity in chaos",
    bottomLabel: "The landscape moves faster than anyone can track",
    bottomAccent: "faster",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Generate random dots for noise panel (seeded by index for consistency)
      const noiseDots = Array.from({ length: 90 }, (_, i) => {
        const seed = i * 137.5; // Golden angle for pseudo-random distribution
        return {
          x: ((seed * 7) % 100) / 100,
          y: ((seed * 13) % 100) / 100,
          opacity: 0.3 + (((seed * 11) % 40) / 100),
          delay: stagger(i, 0, 2),
        };
      });

      // Signal curve path (clean ascending trend)
      const signalPoints = [
        { x: 0.15, y: 0.7 },
        { x: 0.4, y: 0.5 },
        { x: 0.7, y: 0.25 },
      ];

      const curveProgress = ease(sceneFrame, 120, 165);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* LEFT PANEL: NOISE */}
          <div
            style={{
              width: zone.width * 0.45,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* "NOISE" label — zIndex 10 */}
            <div
              style={{
                position: "absolute",
                top: zone.height * 0.08,
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                opacity: ease(sceneFrame, 45, 90),
                zIndex: 10,
              }}
            >
              NOISE
            </div>

            {/* Scattered dots — zIndex 0 */}
            <div
              style={{
                width: "100%",
                height: zone.height * 0.7,
                position: "relative",
                top: zone.height * 0.15,
              }}
            >
              {noiseDots.map((dot, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${dot.x * 100}%`,
                    top: `${dot.y * 100}%`,
                    width: Math.round(8 * zone.scale),
                    height: Math.round(8 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: OB1.DIM,
                    opacity: ease(sceneFrame, dot.delay, dot.delay + 15) * dot.opacity,
                    zIndex: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* CENTER: Separator line + arrow — zIndex 0 */}
          <div
            style={{
              width: zone.width * 0.1,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Vertical separator */}
            <div
              style={{
                width: Math.round(2 * zone.scale),
                height: zone.height * 0.8,
                backgroundColor: OB1.STEEL,
                opacity: 0.3,
                zIndex: 0,
              }}
            />

            {/* Arrow (right-pointing) */}
            <svg
              width={Math.round(60 * zone.scale)}
              height={Math.round(40 * zone.scale)}
              style={{
                position: "absolute",
                opacity: ease(sceneFrame, 90, 120),
                zIndex: 0,
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill={OB1.STEEL} />
                </marker>
              </defs>
              <line
                x1="5"
                y1="20"
                x2="55"
                y2="20"
                stroke={OB1.STEEL}
                strokeWidth={Math.round(3 * zone.scale)}
                markerEnd="url(#arrowhead)"
              />
            </svg>
          </div>

          {/* RIGHT PANEL: SIGNAL */}
          <div
            style={{
              width: zone.width * 0.45,
              height: zone.height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* "SIGNAL" label — zIndex 10 */}
            <div
              style={{
                position: "absolute",
                top: zone.height * 0.08,
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                opacity: ease(sceneFrame, 165, 195),
                zIndex: 10,
              }}
            >
              SIGNAL
            </div>

            {/* Signal curve container */}
            <svg
              width={zone.width * 0.45}
              height={zone.height * 0.7}
              style={{
                position: "absolute",
                top: zone.height * 0.15,
              }}
            >
              {/* Clean ascending curve — zIndex 0 */}
              <path
                d={`M ${signalPoints[0].x * zone.width * 0.45} ${signalPoints[0].y * zone.height * 0.7} Q ${signalPoints[1].x * zone.width * 0.45} ${signalPoints[1].y * zone.height * 0.7}, ${signalPoints[2].x * zone.width * 0.45 * curveProgress} ${signalPoints[2].y * zone.height * 0.7}`}
                stroke={OB1.CYAN}
                strokeWidth={Math.round(6 * zone.scale)}
                fill="none"
                opacity={ease(sceneFrame, 120, 150)}
              />

              {/* Key points on curve — zIndex 1 */}
              {signalPoints.map((point, i) => {
                const pointDelay = 150 + stagger(i, 0, 10);
                return (
                  <circle
                    key={i}
                    cx={point.x * zone.width * 0.45}
                    cy={point.y * zone.height * 0.7}
                    r={Math.round(24 * zone.scale)}
                    fill={OB1.ORANGE}
                    opacity={ease(sceneFrame, pointDelay, pointDelay + 15)}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for SS-003-StoryIsWell
    // FOCAL: Massive RED bar (daily burn $15M) vs tiny GREEN bar (lifetime revenue $2.1M) — stark scale contrast
    // SUPPORTING (2):
    //   1. Y-axis label "Cost vs Revenue" (56px, WHITE)
    //   2. Ratio callout "7x daily burn" (64px, AMBER) with arrow pointing to gap
    // VISUAL:
    //   - Two vertical bars, LEFT-aligned in frame (not centered)
    //   - Bar 1 (left): "Daily Burn" — RED, height = zone.height * 0.7 (~403px), width = zone.width * 0.2
    //   - Bar 2 (right): "Lifetime Revenue" — GREEN, height = zone.height * 0.1 (~58px), width = zone.width * 0.2
    //   - Gap between bars: zone.width * 0.08
    //   - Each bar has value label ABOVE (80px, bold, white): "$15M/day" and "$2.1M total"
    //   - Product label BELOW each bar (48px): "Sora Inference"
    //   - Ratio callout appears at 4s, positioned at midpoint between bars
    // TEXT ON SCREEN:
    //   - "$15M/day" (8 chars)
    //   - "$2.1M total" (11 chars)
    //   - "Sora Inference" appears once (14 chars)
    //   - "7x daily burn" (13 chars)
    //   - Total: 46 chars ✓
    // PHASES:
    //   - 0-1s: Y-axis label appears
    //   - 1-2.5s: Red bar grows from bottom to full height
    //   - 2.5-4s: Red bar label appears
    //   - 4-5.5s: Green bar grows from bottom
    //   - 5.5-6.5s: Green bar label appears
    //   - 6.5-7s: Ratio callout fades in
    // LOGOS: None (conceptual cost visualization)
    // ELEMENT COUNT: 2 bars + 1 ratio callout = 3 ✓
    // PHONE TEST: All numbers 80px, ratio 64px, bars visually dominant ✓
    id: "SS-003-StoryIsWell",
    title: "Sora Economics",
    subtitle: "The math doesn't work",
    bottomLabel: "When burn exceeds revenue by 7x daily, something breaks",
    bottomAccent: "7x daily",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Bar dimensions
      const barWidth = zone.width * 0.2;
      const barGap = zone.width * 0.08;
      const redBarMaxHeight = zone.height * 0.7;
      const greenBarMaxHeight = zone.height * 0.1;

      // Bar positions (left-aligned in frame)
      const redBarX = zone.width * 0.2;
      const greenBarX = redBarX + barWidth + barGap;

      // Animation timings
      const redBarGrowth = ease(sceneFrame, 30, 75);
      const redLabelOpacity = ease(sceneFrame, 75, 105);
      const greenBarGrowth = ease(sceneFrame, 120, 165);
      const greenLabelOpacity = ease(sceneFrame, 165, 195);
      const ratioOpacity = ease(sceneFrame, 195, 210);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* Y-axis label — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.05,
              top: zone.height * 0.1,
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.WHITE,
              opacity: ease(sceneFrame, 0, 30),
              zIndex: 10,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            Cost vs Revenue
          </div>

          {/* RED BAR (Daily Burn) — zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: redBarX,
              bottom: zone.height * 0.1,
              width: barWidth,
              height: redBarMaxHeight * redBarGrowth,
              backgroundColor: OB1.RED,
              borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
              zIndex: 1,
            }}
          />

          {/* Red bar value label (above bar) — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: redBarX,
              bottom: zone.height * 0.1 + redBarMaxHeight + zone.height * 0.03,
              width: barWidth,
              textAlign: "center",
              fontSize: Math.round(80 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              opacity: redLabelOpacity,
              zIndex: 10,
            }}
          >
            $15M/day
          </div>

          {/* Red bar product label (below bar) — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: redBarX,
              bottom: zone.height * 0.02,
              width: barWidth,
              textAlign: "center",
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.DIM,
              opacity: redLabelOpacity,
              zIndex: 10,
            }}
          >
            Daily Burn
          </div>

          {/* GREEN BAR (Lifetime Revenue) — zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: greenBarX,
              bottom: zone.height * 0.1,
              width: barWidth,
              height: greenBarMaxHeight * greenBarGrowth,
              backgroundColor: OB1.GREEN,
              borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
              zIndex: 1,
            }}
          />

          {/* Green bar value label (above bar) — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: greenBarX,
              bottom: zone.height * 0.1 + greenBarMaxHeight + zone.height * 0.03,
              width: barWidth,
              textAlign: "center",
              fontSize: Math.round(80 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              opacity: greenLabelOpacity,
              zIndex: 10,
            }}
          >
            $2.1M
          </div>

          {/* Green bar product label (below bar) — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: greenBarX,
              bottom: zone.height * 0.02,
              width: barWidth,
              textAlign: "center",
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.DIM,
              opacity: greenLabelOpacity,
              zIndex: 10,
            }}
          >
            Total Revenue
          </div>

          {/* Ratio callout (between bars) — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: redBarX + barWidth + barGap * 0.5,
              top: zone.height * 0.45,
              transform: "translateX(-50%)",
              fontSize: Math.round(64 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.AMBER,
              opacity: ratioOpacity,
              zIndex: 10,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            7x daily
            <br />
            burn
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

export const SS_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

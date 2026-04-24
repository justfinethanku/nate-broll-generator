import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  stagger,
} from "./shared";
import { TrendingUp, Minus, AlertTriangle, Cpu, XCircle } from "lucide-react";

type ClipSpec = {
  id: string;
  title: string;
  subtitle?: string;
  bottomLabel: string;
  bottomAccent?: string;
  render: (frame: number, fps: number, zone: GfxZone) => React.ReactNode;
};

const clipSpecs: ClipSpec[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // DESIGN SPEC for NK-004-FivePrincipleCompass (v3 — vertical list)
  //
  // REDESIGN from v1/v2: The circular compass diagram was too small to read
  // in the wide 1304×536 zone. Switching to a full-width numbered vertical
  // list which fills the zone naturally and produces large, legible labels.
  //
  // FOCAL: Vertical list of 5 numbered principle rows (1 visual unit)
  // Layout: Number badge (left) | Principle name (right) — full width rows
  // Row height: ~88px each × 5 = 440px + 4×gaps(12px) = 488px < 536 zone ✓
  //
  // TEXT ON SCREEN (all visible at once after stagger):
  //   "Demonstrate"  (52px) — 11
  //   "Contextualize" (52px) — 13
  //   "Anticipate"   (52px) — 10
  //   "Collaborate"  (52px) — 11
  //   "Adapt"        (52px) —  5
  //   Total GFX text: 50 chars (under 90) ✓
  //
  // Number badges: 64px diameter circles with 36px numerals — visible,
  //   prominent, and count as part of the focal unit not separate elements
  //
  // PHASES:
  //   - 0-2.5s (0-75f): Rows stagger in top-to-bottom, 12 frames apart
  //   - 2.5-7s: Hold
  //
  // ELEMENT COUNT: 1 focal (the list) ✓
  // PHONE TEST: Principle names at 52px, easily readable ✓
  // VERTICAL BUDGET: 5 × 88px + 4 × 12px gap = 488px < 536px zone ✓
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "NK-004-FivePrincipleCompass",
    title: "Five Principles",
    subtitle: "Proving your worth in the AI era",
    bottomLabel: "A framework for staying indispensable",
    bottomAccent: "indispensable",
    render: (frame, _fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const principles = [
        { label: "Demonstrate", color: OB1.ORANGE },
        { label: "Contextualize", color: OB1.CYAN },
        { label: "Anticipate", color: OB1.GREEN },
        { label: "Collaborate", color: OB1.PURPLE },
        { label: "Adapt", color: OB1.AMBER },
      ];

      const rowH = Math.round(88 * zone.scale);
      const rowGap = Math.round(12 * zone.scale);
      const totalH = principles.length * rowH + (principles.length - 1) * rowGap;
      const listTop = (zone.height - totalH) / 2;
      const badgeR = Math.round(32 * zone.scale);
      const listPadX = Math.round(zone.width * 0.08);

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
          {/* SVG: left accent bar (zIndex 0) */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            {/* Vertical accent line on left */}
            <line
              x1={listPadX + badgeR * 2 + Math.round(20 * zone.scale)}
              y1={listTop}
              x2={listPadX + badgeR * 2 + Math.round(20 * zone.scale)}
              y2={listTop + totalH}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(1 * zone.scale)}
              opacity={0.2 * ease(sceneFrame, 0, 20)}
            />
          </svg>

          {/* Principle rows */}
          {principles.map((p, i) => {
            const rowY = listTop + i * (rowH + rowGap);
            const rowProgress = ease(sceneFrame, stagger(i, 5, 14), stagger(i, 5, 14) + 20);
            const rowSlide = (1 - rowProgress) * Math.round(30 * zone.scale);

            return (
              <div key={i}>
                {/* Number badge container (zIndex 1) */}
                <div
                  style={{
                    position: "absolute",
                    left: listPadX,
                    top: rowY + (rowH / 2) - badgeR,
                    width: badgeR * 2,
                    height: badgeR * 2,
                    borderRadius: "50%",
                    background: p.color,
                    opacity: rowProgress,
                    transform: `translateY(${rowSlide}px)`,
                    zIndex: 1,
                  }}
                />
                {/* Number text (zIndex 10) */}
                <div
                  style={{
                    position: "absolute",
                    left: listPadX,
                    top: rowY + (rowH / 2) - badgeR,
                    width: badgeR * 2,
                    height: badgeR * 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: rowProgress,
                    transform: `translateY(${rowSlide}px)`,
                    zIndex: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: Math.round(36 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 800,
                      color: OB1.BG_DARK,
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Row background pill (zIndex 1) */}
                <div
                  style={{
                    position: "absolute",
                    left: listPadX + badgeR * 2 + Math.round(24 * zone.scale),
                    top: rowY,
                    width: zone.width - listPadX - badgeR * 2 - Math.round(24 * zone.scale) - listPadX,
                    height: rowH,
                    borderRadius: Math.round(12 * zone.scale),
                    background: OB1.BG_MID,
                    borderLeft: `${Math.round(4 * zone.scale)}px solid ${p.color}`,
                    opacity: rowProgress * 0.9,
                    transform: `translateY(${rowSlide}px)`,
                    zIndex: 1,
                  }}
                />

                {/* Principle label (zIndex 10) */}
                <div
                  style={{
                    position: "absolute",
                    left: listPadX + badgeR * 2 + Math.round(24 * zone.scale) + Math.round(24 * zone.scale),
                    top: rowY,
                    width: zone.width - listPadX - badgeR * 2 - Math.round(72 * zone.scale) - listPadX,
                    height: rowH,
                    display: "flex",
                    alignItems: "center",
                    opacity: rowProgress,
                    transform: `translateY(${rowSlide}px)`,
                    zIndex: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: Math.round(52 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: OB1.WHITE,
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DESIGN SPEC for NK-005-OutputVsUnderstanding (v2 — labels repositioned)
  //
  // FOCAL: Dual-line diverging chart across full zone width
  // SUPPORTING (2): "Output" label (top-right, anchored within zone),
  //                 "Understanding" label (bottom-left, clearly inside zone)
  //
  // FIX from v1: "Understanding" moved to LEFT side of the flat line so
  // it cannot overflow the right zone edge.
  // "Output" stays top-right but constrained to zone.width - labelW.
  //
  // TEXT ON SCREEN: "Output" (6) + "Understanding" (13) + "More" (4) = 23 chars ✓
  // ELEMENT COUNT: 1 chart + 2 labels = 3 ✓
  // PHONE TEST: Labels 48px ✓
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "NK-005-OutputVsUnderstanding",
    title: "Output vs. Understanding",
    subtitle: "The comprehension gap",
    bottomLabel: "Production is outrunning our ability to understand it",
    bottomAccent: "outrunning",
    render: (frame, _fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Chart geometry — generous padding to keep labels inside zone
      const padLeft = zone.width * 0.10;
      const padRight = zone.width * 0.06;
      const padTop = zone.height * 0.16;
      const padBottom = zone.height * 0.16;
      const chartW = zone.width - padLeft - padRight;
      const chartH = zone.height - padTop - padBottom;
      const x0 = padLeft;
      const y0 = padTop + chartH;  // bottom-left
      const x1 = padLeft + chartW; // right edge

      // Rising line (Output): bottom-left → top-right, steep curve
      const outputTopY = padTop + chartH * 0.05;
      const outputStartY = padTop + chartH * 0.90;
      const outputPath = `M ${x0} ${outputStartY} C ${x0 + chartW * 0.35} ${outputStartY} ${x0 + chartW * 0.65} ${outputTopY + chartH * 0.18} ${x1} ${outputTopY}`;

      // Flat line (Understanding): slight upward drift
      const flatStartY = padTop + chartH * 0.60;
      const flatEndY = padTop + chartH * 0.54;
      const flatPath = `M ${x0} ${flatStartY} C ${x0 + chartW * 0.5} ${flatStartY} ${x0 + chartW * 0.5} ${flatEndY} ${x1} ${flatEndY}`;

      // Path length estimates for dashoffset animation
      const outputPathLen = Math.round(1080 * zone.scale);
      const flatPathLen = Math.round(chartW + 60);

      const outputProgress = ease(sceneFrame, 5, 65);
      const flatProgress = ease(sceneFrame, 62, 108);
      const labelProgress = ease(sceneFrame, 102, 126);

      // Output label: anchored to top-right of chart, fits within zone
      const outputLabelIconW = Math.round(38 * zone.scale);
      const outputLabelTextW = Math.round(160 * zone.scale);
      const outputLabelTotalW = outputLabelIconW + Math.round(8 * zone.scale) + outputLabelTextW;
      const outputLabelX = Math.min(x1 - outputLabelTotalW, zone.width - outputLabelTotalW - Math.round(8 * zone.scale));
      const outputLabelY = outputTopY - Math.round(48 * zone.scale);

      // Understanding label: anchored to LEFT side of flat line (guaranteed inside zone)
      const understandLabelX = x0 + Math.round(20 * zone.scale);
      const understandLabelY = flatStartY + Math.round(36 * zone.scale);

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
          {/* Chart SVG (zIndex 0) */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            {/* Baseline */}
            <line
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y0}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(1 * zone.scale)}
              opacity={0.3}
            />
            {/* Vertical axis */}
            <line
              x1={x0}
              y1={padTop}
              x2={x0}
              y2={y0}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(1 * zone.scale)}
              opacity={0.3}
            />

            {/* Output line — orange, rising steeply */}
            <path
              d={outputPath}
              fill="none"
              stroke={OB1.ORANGE}
              strokeWidth={Math.round(5 * zone.scale)}
              strokeLinecap="round"
              strokeDasharray={outputPathLen}
              strokeDashoffset={outputPathLen * (1 - outputProgress)}
            />

            {/* Understanding line — cyan, near-flat */}
            <path
              d={flatPath}
              fill="none"
              stroke={OB1.CYAN}
              strokeWidth={Math.round(5 * zone.scale)}
              strokeLinecap="round"
              strokeDasharray={flatPathLen}
              strokeDashoffset={flatPathLen * (1 - flatProgress)}
            />

            {/* Subtle divergence fill */}
            <path
              d={`${outputPath} L ${x1} ${flatEndY} C ${x0 + chartW * 0.5} ${flatEndY} ${x0 + chartW * 0.5} ${flatStartY} ${x0} ${flatStartY} Z`}
              fill={OB1.ORANGE}
              opacity={0.05 * Math.min(outputProgress, flatProgress)}
            />
          </svg>

          {/* "More" axis label — vertical (zIndex 10) */}
          <div
            style={{
              position: "absolute",
              left: Math.round(8 * zone.scale),
              top: padTop,
              height: chartH,
              display: "flex",
              alignItems: "center",
              opacity: labelProgress * 0.5,
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: Math.round(36 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.STEEL,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                position: "relative",
                zIndex: 10,
              }}
            >
              More
            </span>
          </div>

          {/* Output label — top right, guaranteed inside zone (zIndex 10) */}
          <div
            style={{
              position: "absolute",
              left: outputLabelX,
              top: outputLabelY,
              display: "flex",
              alignItems: "center",
              gap: Math.round(8 * zone.scale),
              opacity: labelProgress,
              zIndex: 10,
            }}
          >
            <TrendingUp size={Math.round(38 * zone.scale)} color={OB1.ORANGE} />
            <span
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                position: "relative",
                zIndex: 10,
              }}
            >
              Output
            </span>
          </div>

          {/* Understanding label — left of flat line, fully inside zone (zIndex 10) */}
          <div
            style={{
              position: "absolute",
              left: understandLabelX,
              top: understandLabelY,
              display: "flex",
              alignItems: "center",
              gap: Math.round(8 * zone.scale),
              opacity: labelProgress,
              zIndex: 10,
            }}
          >
            <Minus size={Math.round(38 * zone.scale)} color={OB1.CYAN} />
            <span
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.CYAN,
                position: "relative",
                zIndex: 10,
              }}
            >
              Understanding
            </span>
          </div>
        </div>
      );
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DESIGN SPEC for NK-006-AWSOutageTimeline (v2 — sizes & spacing fixed)
  //
  // FOCAL: Horizontal timeline bar (AWS logo on left, line across zone)
  // SUPPORTING (3): 3 event nodes at 20%, 52%, 84% of timeline span
  //   Each node: 72px diameter circle + icon + label above/below
  //   Node labels: 40px (at floor)
  //
  // FIXES from v1:
  //   - AWS logo enlarged to 120px (brand logo rule)
  //   - Third node moved to 84% to give label room inside zone
  //   - Label container widened to 200px to prevent text clipping
  //   - Node labels enlarged to 40px (was 36px, below floor)
  //
  // TEXT ON SCREEN at f250:
  //   "13-Hour Outage" (56px, 14) + "AI Tool Deployed" (40px, 15)
  //   + "Prod Deleted" (40px, 12) + "Classified: User Error" (40px, 22) = 63 chars ✓
  //
  // ELEMENT COUNT: 1 focal + 3 nodes = 4 ✓
  // PHONE TEST: Headline 56px, node labels 40px (floor) ✓
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "NK-006-AWSOutageTimeline",
    title: "Production Outruns Comprehension",
    subtitle: "A 13-hour lesson",
    bottomLabel: "The AI made the decision. The human got the blame.",
    bottomAccent: "human got the blame",
    render: (frame, _fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const timelineY = zone.height * 0.52;
      const timelineX0 = zone.width * 0.20;
      const timelineX1 = zone.width * 0.94;
      const timelineLen = timelineX1 - timelineX0;

      const headlineProgress = ease(sceneFrame, 0, 20);
      const timelineProgress = ease(sceneFrame, 15, 58);
      const awsProgress = ease(sceneFrame, 0, 20);

      const nodeR = Math.round(36 * zone.scale);
      const labelW = Math.round(200 * zone.scale);

      const events: Array<{
        label: string[];
        icon: React.ElementType;
        color: string;
        x: number;
        labelAbove: boolean;
        delay: number;
      }> = [
        {
          label: ["AI Tool", "Deployed"],
          icon: Cpu,
          color: OB1.CYAN,
          x: timelineX0 + timelineLen * 0.20,
          labelAbove: true,
          delay: 60,
        },
        {
          label: ["Prod", "Deleted"],
          icon: XCircle,
          color: OB1.RED,
          x: timelineX0 + timelineLen * 0.52,
          labelAbove: false,
          delay: 85,
        },
        {
          label: ["Classified:", "User Error"],
          icon: AlertTriangle,
          color: OB1.AMBER,
          x: timelineX0 + timelineLen * 0.84,
          labelAbove: true,
          delay: 110,
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
          {/* SVG layer: timeline bar + connector stubs (zIndex 0) */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            {/* Timeline bar */}
            <line
              x1={timelineX0}
              y1={timelineY}
              x2={timelineX0 + timelineLen * timelineProgress}
              y2={timelineY}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(3 * zone.scale)}
              strokeLinecap="round"
            />

            {/* Arrow head */}
            {timelineProgress > 0.95 && (
              <polygon
                points={`
                  ${timelineX1},${timelineY}
                  ${timelineX1 - Math.round(14 * zone.scale)},${timelineY - Math.round(7 * zone.scale)}
                  ${timelineX1 - Math.round(14 * zone.scale)},${timelineY + Math.round(7 * zone.scale)}
                `}
                fill={OB1.STEEL}
                opacity={ease(sceneFrame, 56, 66)}
              />
            )}

            {/* Connector stubs — terminate at node edge, not center */}
            {events.map((ev, i) => {
              const nodeProgress = ease(sceneFrame, ev.delay, ev.delay + 20);
              const stubY1 = ev.labelAbove ? timelineY - nodeR : timelineY + nodeR;
              return (
                <line
                  key={i}
                  x1={ev.x}
                  y1={timelineY}
                  x2={ev.x}
                  y2={stubY1}
                  stroke={ev.color}
                  strokeWidth={Math.round(2 * zone.scale)}
                  opacity={0.5 * nodeProgress}
                />
              );
            })}
          </svg>

          {/* AWS logo — left anchor (zIndex 1) */}
          <div
            style={{
              position: "absolute",
              left: Math.round(zone.width * 0.01),
              top: timelineY - Math.round(60 * zone.scale),
              opacity: awsProgress,
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile("logos/amazonwebservices.svg")}
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* "13-Hour Outage" headline (zIndex 10) */}
          <div
            style={{
              position: "absolute",
              left: timelineX0,
              top: Math.round(zone.height * 0.06),
              width: timelineLen,
              textAlign: "center",
              opacity: headlineProgress,
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.RED,
                letterSpacing: "-0.01em",
                position: "relative",
                zIndex: 10,
              }}
            >
              13-Hour Outage
            </span>
          </div>

          {/* Event nodes */}
          {events.map((ev, i) => {
            const nodeProgress = ease(sceneFrame, ev.delay, ev.delay + 22);
            const Icon = ev.icon;
            const labelOffsetY = ev.labelAbove
              ? timelineY - nodeR - Math.round(80 * zone.scale)
              : timelineY + nodeR + Math.round(12 * zone.scale);

            return (
              <div key={i}>
                {/* Node circle (zIndex 1) */}
                <div
                  style={{
                    position: "absolute",
                    left: ev.x - nodeR,
                    top: timelineY - nodeR,
                    width: nodeR * 2,
                    height: nodeR * 2,
                    borderRadius: "50%",
                    background: OB1.BG_MID,
                    border: `${Math.round(2.5 * zone.scale)}px solid ${ev.color}`,
                    opacity: nodeProgress,
                    transform: `scale(${0.4 + nodeProgress * 0.6})`,
                    zIndex: 1,
                  }}
                />
                {/* Icon (zIndex 10) */}
                <div
                  style={{
                    position: "absolute",
                    left: ev.x - nodeR,
                    top: timelineY - nodeR,
                    width: nodeR * 2,
                    height: nodeR * 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: nodeProgress,
                    zIndex: 10,
                  }}
                >
                  <Icon size={Math.round(30 * zone.scale)} color={ev.color} />
                </div>

                {/* Event label (zIndex 10) */}
                <div
                  style={{
                    position: "absolute",
                    left: ev.x - labelW / 2,
                    top: labelOffsetY,
                    width: labelW,
                    textAlign: "center",
                    opacity: nodeProgress,
                    zIndex: 10,
                  }}
                >
                  {ev.label.map((line, li) => (
                    <div
                      key={li}
                      style={{
                        fontSize: Math.round(40 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: li === 0 ? 600 : 800,
                        color: li === 1 ? ev.color : OB1.WHITE,
                        lineHeight: 1.25,
                        position: "relative",
                        zIndex: 10,
                      }}
                    >
                      {line}
                    </div>
                  ))}
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

export const NK_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

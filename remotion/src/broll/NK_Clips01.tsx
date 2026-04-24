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
  Link2Off,
  X,
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
  // ─────────────────────────────────────────────────────────────────
  // DESIGN SPEC for NK-001-CodeOutputSurge
  // FOCAL: Vertical bar chart — 5 bars (2020–2024) rising steeply, rightmost bar tallest
  // SUPPORTING (1): GitHub + App Store logos as a small header pair above chart (96px each)
  // SUPPORTING (2): Year labels below bars (40px)
  // SUPPORTING (3): "Code output" headline label (64px) at top of GFX zone
  // TEXT ON SCREEN:
  //   - "Code Output" (64px) — 11 chars
  //   - "2020" "2021" "2022" "2023" "2024" (40px) — 4 chars × 5 = 20 chars
  //   Total visible: ~31 chars (well under 90)
  // PHASES:
  //   - 0–0.5s: Logos bounce in
  //   - 0.5–2.5s: Bars animate up in stagger
  //   - 2.5–7s: Hold + pulse on top bar
  // LOGOS: github.svg, appstore.svg
  // ELEMENT COUNT: 1 chart (focal) + logos pair + year labels + headline = 4 ✓
  // PHONE TEST: All text ≥40px, logos 96px ✓
  // ─────────────────────────────────────────────────────────────────
  {
    id: "NK-001-CodeOutputSurge",
    title: "Code Output",
    subtitle: "Volume is exploding",
    bottomLabel: "When anyone can ship, volume is no longer a signal",
    bottomAccent: "no longer a signal",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Bar relative heights (qualitative, rising steeply)
      const bars = [
        { year: "2020", rel: 0.25, color: OB1.STEEL, delay: 15 },
        { year: "2021", rel: 0.38, color: OB1.STEEL, delay: 25 },
        { year: "2022", rel: 0.52, color: OB1.CYAN,  delay: 35 },
        { year: "2023", rel: 0.72, color: OB1.CYAN,  delay: 45 },
        { year: "2024", rel: 1.00, color: OB1.ORANGE, delay: 55 },
      ];

      const maxBarHeight = zone.height * 0.50;
      const barW = Math.round(zone.width * 0.10);
      const gap = Math.round(zone.width * 0.04);
      const chartTotalW = bars.length * barW + (bars.length - 1) * gap;
      const labelSize = Math.round(40 * zone.scale);
      const logoSize = Math.round(72 * zone.scale);
      const yearLabelH = labelSize + Math.round(12 * zone.scale);
      const headlineSize = Math.round(60 * zone.scale);
      const headlineH = headlineSize + Math.round(16 * zone.scale);
      const logoRowH = logoSize + Math.round(16 * zone.scale);

      // Vertical budget:
      // headline: ~76px, logoRow: ~88px, chart+yearLabels: maxBarHeight + yearLabelH
      // Total ≈ 76 + 88 + (288 + 52) = 504 — fits within ~576px zone

      const pulseGlow = pulse(sceneFrame, 0.04);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(12 * zone.scale),
          }}
        >
          {/* Headline */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: headlineSize,
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.WHITE,
              letterSpacing: "-0.02em",
              zIndex: 10,
              position: "relative",
            }}
          >
            Code Output
          </div>

          {/* Logo pair */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(zone.width * 0.04),
              zIndex: 1,
              position: "relative",
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 5, fps) }}>
              <Img
                src={staticFile("logos/github.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
            <div style={{ ...bouncePop(sceneFrame, 12, fps) }}>
              <Img
                src={staticFile("logos/appstore.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: gap,
              height: maxBarHeight + yearLabelH,
              zIndex: 10,
              position: "relative",
            }}
          >
            {bars.map((bar) => {
              const targetH = maxBarHeight * bar.rel;
              const animatedH =
                ease(sceneFrame, bar.delay, bar.delay + 30) * targetH;
              const isLast = bar.year === "2024";
              const glowOpacity = isLast
                ? ease(sceneFrame, bar.delay + 30, bar.delay + 50) *
                  (0.4 + pulseGlow * 0.6)
                : 0;

              return (
                <div
                  key={bar.year}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(8 * zone.scale),
                    width: barW,
                  }}
                >
                  {/* Glow behind last bar — zIndex 0 */}
                  {isLast && (
                    <div
                      style={{
                        position: "absolute",
                        width: barW * 2.5,
                        height: animatedH * 1.1,
                        background: `radial-gradient(ellipse at 50% 100%, ${OB1.ORANGE}66, transparent 70%)`,
                        opacity: glowOpacity,
                        zIndex: 0,
                        alignSelf: "flex-end",
                        marginBottom: yearLabelH,
                      }}
                    />
                  )}
                  {/* Bar fill — zIndex 1 */}
                  <div
                    style={{
                      width: barW,
                      height: animatedH,
                      backgroundColor: bar.color,
                      borderRadius: `${Math.round(6 * zone.scale)}px ${Math.round(6 * zone.scale)}px 0 0`,
                      zIndex: 1,
                      position: "relative",
                    }}
                  />
                  {/* Year label — zIndex 10 */}
                  <div
                    style={{
                      fontSize: labelSize,
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.STEEL,
                      opacity: ease(sceneFrame, bar.delay + 15, bar.delay + 30),
                      zIndex: 10,
                      position: "relative",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bar.year}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // DESIGN SPEC for NK-002-TechLayoffs2026
  // FOCAL: Horizontal bar chart — 5 rows, company name left + bar + number right
  // SUPPORTING (1): "Q1 2026 Tech Layoffs" headline (64px)
  // SUPPORTING (2): Company logos inline left of each bar (48px — paired with 40px label, exception justified by horizontal density)
  // TEXT ON SCREEN:
  //   - "Q1 2026 Tech Layoffs" (64px) — 20 chars
  //   - "Oracle" "Amazon" "Dell" "Salesforce" "Block" — 5 + 6 + 4 + 10 + 5 = 30 chars
  //   - "30k" "16k" "11k" "4k" + "..." for Salesforce — ~15 chars
  //   Total visible: ~65 chars (under 90)
  // PHASES:
  //   - 0–0.5s: Headline fades in
  //   - 0.5–3.5s: Bars slide in left-to-right staggered (one per 0.4s)
  //   - 3.5–7s: Hold
  // LOGOS: amazonwebservices.svg, dell.svg, square.svg (Block); Oracle/Salesforce = text only (no logo)
  // ELEMENT COUNT: 1 chart (focal) + headline = 2 ✓
  // PHONE TEST: Names 40px, numbers 40px, headline 64px ✓
  // NOTE: Salesforce bar length is proportional to an editorial qualitative judgment — no specific number displayed
  // ─────────────────────────────────────────────────────────────────
  {
    id: "NK-002-TechLayoffs2026",
    title: "60,000 Jobs Gone",
    subtitle: "Q1 2026",
    bottomLabel: "Tech layoffs are accelerating in the AI era",
    bottomAccent: "accelerating",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      type Company = {
        name: string;
        logo: string | null;
        count: number | null;
        countLabel: string;
        rel: number;
        color: string;
        delay: number;
      };

      const companies: Company[] = [
        { name: "Oracle",     logo: null,                          count: 30000, countLabel: "30k", rel: 1.00, color: OB1.RED,    delay: 15 },
        { name: "Amazon",     logo: "amazonwebservices.svg",       count: 16000, countLabel: "16k", rel: 0.53, color: OB1.AMBER,  delay: 28 },
        { name: "Dell",       logo: "dell.svg",                    count: 11000, countLabel: "11k", rel: 0.37, color: OB1.AMBER,  delay: 41 },
        { name: "Salesforce", logo: null,                          count: null,  countLabel: "k+",  rel: 0.22, color: OB1.STEEL,  delay: 54 },
        { name: "Block",      logo: "square.svg",                  count: 4000,  countLabel: "4k",  rel: 0.13, color: OB1.STEEL,  delay: 67 },
      ];

      const headlineSize = Math.round(60 * zone.scale);
      const rowH = Math.round(zone.height * 0.12);
      const rowGap = Math.round(zone.height * 0.025);
      const nameW = Math.round(zone.width * 0.22);
      const maxBarW = Math.round(zone.width * 0.58);
      const numW = Math.round(zone.width * 0.10);
      const logoSize = Math.round(44 * zone.scale);
      const labelSize = Math.round(40 * zone.scale);
      const headlineH = headlineSize + Math.round(20 * zone.scale);
      const chartH = companies.length * rowH + (companies.length - 1) * rowGap;

      // Vertical budget: headlineH (~80) + gap (16) + chartH (5*69 + 4*14 = 401) = ~497 — fits

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: Math.round(16 * zone.scale),
          }}
        >
          {/* Headline */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: headlineSize,
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.WHITE,
              letterSpacing: "-0.02em",
              zIndex: 10,
              position: "relative",
              alignSelf: "center",
            }}
          >
            Q1 2026 Tech Layoffs
          </div>

          {/* Bar rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: rowGap,
              width: zone.width,
              zIndex: 10,
              position: "relative",
            }}
          >
            {companies.map((co) => {
              const animatedBarW =
                ease(sceneFrame, co.delay, co.delay + 25) * maxBarW * co.rel;
              const rowOpacity = ease(sceneFrame, co.delay, co.delay + 20);

              return (
                <div
                  key={co.name}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: Math.round(zone.width * 0.015),
                    opacity: rowOpacity,
                    height: rowH,
                  }}
                >
                  {/* Name + optional logo — fixed width */}
                  <div
                    style={{
                      width: nameW,
                      display: "flex",
                      alignItems: "center",
                      gap: Math.round(8 * zone.scale),
                      flexShrink: 0,
                    }}
                  >
                    {co.logo && (
                      <div style={{ zIndex: 1, position: "relative", flexShrink: 0 }}>
                        <Img
                          src={staticFile(`logos/${co.logo}`)}
                          style={{
                            width: logoSize,
                            height: logoSize,
                            filter: "brightness(0) invert(1)",
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: labelSize,
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: OB1.WHITE,
                        zIndex: 10,
                        position: "relative",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {co.name}
                    </div>
                  </div>

                  {/* Bar — zIndex 1 */}
                  <div
                    style={{
                      width: animatedBarW,
                      height: rowH * 0.55,
                      backgroundColor: co.color,
                      borderRadius: `0 ${Math.round(4 * zone.scale)}px ${Math.round(4 * zone.scale)}px 0`,
                      flexShrink: 0,
                      zIndex: 1,
                      position: "relative",
                    }}
                  />

                  {/* Count label — zIndex 10 */}
                  <div
                    style={{
                      fontSize: labelSize,
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      color: co.color,
                      zIndex: 10,
                      position: "relative",
                      minWidth: numW,
                    }}
                  >
                    {co.countLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // DESIGN SPEC for NK-003-BrokenValueChain
  // FOCAL: 4 rounded-rect nodes in a horizontal chain:
  //   [Hard Work] — [Effort Signal] — [Expertise Proof] — [Salary]
  //   Each connecting segment rendered with a visible break (gap + X icon)
  // SUPPORTING (1): "AI broke every link" subtext (48px) below chain
  // TEXT ON SCREEN:
  //   - "Hard Work" "Effort Signal" "Expertise Proof" "Salary" (44px each) — 9+13+14+6 = 42 chars
  //   - "AI broke every link" (48px) — 19 chars
  //   Total visible: ~61 chars (under 90)
  // PHASES:
  //   - 0–1.5s: Nodes fade in staggered
  //   - 1.5–3s: Connecting lines draw (with breaks visible)
  //   - 3–5s: X marks pop in on each break
  //   - 5–7s: Hold + gentle pulse on X marks
  // ELEMENT COUNT: 1 chain (4 nodes = 1 visual group focal) + subtext = 2 ✓
  // PHONE TEST: Node labels 44px, subtext 48px ✓
  // ─────────────────────────────────────────────────────────────────
  {
    id: "NK-003-BrokenValueChain",
    title: "Broken Chain",
    subtitle: "The old signal system",
    bottomLabel: "Hard work used to be proof — AI erased that signal",
    bottomAccent: "erased that signal",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const nodes = [
        { label: "Hard Work",      delay: 5  },
        { label: "Effort Signal",  delay: 18 },
        { label: "Expertise Proof",delay: 31 },
        { label: "Salary",         delay: 44 },
      ];

      const nodeCount = nodes.length;
      const nodeW = Math.round(zone.width * 0.20);
      const nodeH = Math.round(zone.height * 0.28);
      const nodeLabelSize = Math.round(40 * zone.scale);
      const subtextSize = Math.round(48 * zone.scale);

      // Horizontal layout: nodes + gaps between them
      const totalGaps = nodeCount - 1;
      const connectorW = Math.round(
        (zone.width - nodeCount * nodeW) / totalGaps
      );

      // Break connector — a line with a gap in the center, X mark at gap
      // X mark appears after line draws
      const xBreakDelay = 57; // after last node fades in

      const lineDrawProgress = (idx: number) =>
        ease(sceneFrame, 45 + idx * 5, 60 + idx * 5);
      const xPopProgress = (idx: number) =>
        ease(sceneFrame, xBreakDelay + idx * 8, xBreakDelay + idx * 8 + 15);

      const xSize = Math.round(28 * zone.scale);
      const pulseVal = pulse(sceneFrame, 0.05);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.height * 0.06),
          }}
        >
          {/* Chain row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: zone.width,
            }}
          >
            {nodes.map((node, idx) => {
              const nodeOpacity = ease(sceneFrame, node.delay, node.delay + 18);
              const isLast = idx === nodeCount - 1;

              return (
                <React.Fragment key={node.label}>
                  {/* Node box */}
                  <div
                    style={{
                      width: nodeW,
                      height: nodeH,
                      borderRadius: Math.round(12 * zone.scale),
                      border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}`,
                      backgroundColor: OB1.BG_MID,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: nodeOpacity,
                      flexShrink: 0,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: nodeLabelSize,
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: OB1.WHITE,
                        textAlign: "center",
                        lineHeight: 1.25,
                        padding: `0 ${Math.round(8 * zone.scale)}px`,
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {node.label}
                    </div>
                  </div>

                  {/* Connector with break — between nodes */}
                  {!isLast && (
                    <div
                      style={{
                        width: connectorW,
                        height: nodeH,
                        flexShrink: 0,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 0,
                      }}
                    >
                      {/* SVG connector lines (left half + right half, gap in center) */}
                      <svg
                        width={connectorW}
                        height={nodeH}
                        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
                      >
                        {/* Left half line */}
                        <line
                          x1={0}
                          y1={nodeH / 2}
                          x2={connectorW * 0.35 * lineDrawProgress(idx)}
                          y2={nodeH / 2}
                          stroke={OB1.RED}
                          strokeWidth={Math.round(3 * zone.scale)}
                          strokeDasharray={`${Math.round(6 * zone.scale)} ${Math.round(4 * zone.scale)}`}
                          opacity={lineDrawProgress(idx)}
                        />
                        {/* Right half line */}
                        <line
                          x1={connectorW * (1 - 0.35 * lineDrawProgress(idx))}
                          y1={nodeH / 2}
                          x2={connectorW}
                          y2={nodeH / 2}
                          stroke={OB1.RED}
                          strokeWidth={Math.round(3 * zone.scale)}
                          strokeDasharray={`${Math.round(6 * zone.scale)} ${Math.round(4 * zone.scale)}`}
                          opacity={lineDrawProgress(idx)}
                        />
                      </svg>

                      {/* X break mark — zIndex 10, renders after lines */}
                      <div
                        style={{
                          opacity: xPopProgress(idx) * (0.7 + pulseVal * 0.3),
                          transform: `scale(${xPopProgress(idx)})`,
                          zIndex: 10,
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: xSize * 2,
                          height: xSize * 2,
                          borderRadius: "50%",
                          backgroundColor: `${OB1.RED}33`,
                        }}
                      >
                        <X
                          size={xSize}
                          color={OB1.RED}
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Subtext */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 70),
              fontSize: subtextSize,
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              textAlign: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            AI broke every link
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

export const NK_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

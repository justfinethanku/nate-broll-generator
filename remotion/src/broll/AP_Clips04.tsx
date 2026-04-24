import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  bouncePop,
  slideIn,
} from "./shared";
import {
  FileText,
  Wrench,
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
    // DESIGN SPEC for AP-010-QuotePersona
    // FOCAL: Two document stacks side-by-side comparison with "≠" symbol between them
    // SUPPORTING:
    //   1. Left stack: 3 identical document icons + "$49" label (generic templates)
    //   2. Right stack: 1 unique/custom document icon with wrench icon (personalized)
    //   3. Center: Large "≠" symbol
    // TEXT ON SCREEN:
    //   - "Generic" (48px, above left stack) — 7 chars
    //   - "$49" (56px, on left stack) — 3 chars
    //   - "≠" (96px, center) — 1 char
    //   - "Personalized" (48px, above right stack) — 13 chars
    //   Total visible: 24 chars ✓ (well under 90)
    // PHASES:
    //   - 0-1.5s: Left stack + "$49" label fade in
    //   - 1.5-2.5s: "≠" symbol pops in
    //   - 2.5-4s: Right stack fades in
    //   - 4-7s: Hold
    // ELEMENT COUNT: 3 groups (left, center symbol, right) ✓
    // PHONE TEST: All text ≥48px ✓
    id: "AP-010-QuotePersona",
    title: "Generic vs Personal",
    subtitle: "The $49 template trap",
    bottomLabel: "Generic vs. Personalized",
    bottomAccent: "Personalized",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.08,
          }}
        >
          {/* Left: Generic stack */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                zIndex: 10,
                position: "relative",
              }}
            >
              Generic
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(-40 * zone.scale),
                position: "relative",
              }}
            >
              {/* Stack of 3 identical docs */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    zIndex: 2 - i,
                    transform: `translateX(${i * 8 * zone.scale}px)`,
                  }}
                >
                  <FileText
                    size={Math.round(120 * zone.scale)}
                    color={OB1.STEEL}
                    strokeWidth={1.5}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.AMBER,
                marginTop: Math.round(24 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              $49
            </div>
          </div>

          {/* Center: Not equal symbol */}
          <div
            style={{
              ...bouncePop(sceneFrame, 45, fps),
            }}
          >
            <div
              style={{
                fontSize: Math.round(96 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              ≠
            </div>
          </div>

          {/* Right: Personalized */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 75),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Personalized
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText
                size={Math.round(120 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: Math.round(-8 * zone.scale),
                  right: Math.round(-8 * zone.scale),
                  backgroundColor: OB1.BG_DARK,
                  borderRadius: "50%",
                  padding: Math.round(8 * zone.scale),
                  border: `${Math.round(2 * zone.scale)}px solid ${OB1.GREEN}`,
                  zIndex: 1,
                }}
              >
                <Wrench
                  size={Math.round(40 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-011-MetaphoricallySpeaking
    // FOCAL: Horizontal transformation arrow from readable code block to binary block
    // SUPPORTING:
    //   1. Left box: Code snippet (clean, readable) labeled "Source Code"
    //   2. Arrow with label "Experience / Time"
    //   3. Right box: Binary/compiled representation labeled "Machine Code"
    // TEXT ON SCREEN:
    //   - "Source Code" (48px, below left box) — 11 chars
    //   - "Experience / Time" (40px, on arrow) — 17 chars
    //   - "Machine Code" (48px, below right box) — 12 chars
    //   Total visible: 40 chars ✓ (under 90)
    // PHASES:
    //   - 0-1.5s: Left box (source) fades in
    //   - 1.5-3s: Arrow draws + label appears
    //   - 3-5s: Right box (compiled) fades in
    //   - 5-7s: Hold
    // ELEMENT COUNT: 3 (source box, arrow, compiled box) ✓
    // PHONE TEST: All text ≥40px ✓
    id: "AP-011-MetaphoricallySpeaking",
    title: "Knowledge Compilation",
    subtitle: "From explicit to tacit",
    bottomLabel: "Expertise Compiles Down",
    bottomAccent: "Compiles",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const arrowLength = zone.width * 0.2;
      const arrowProgress = ease(sceneFrame, 45, 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
          }}
        >
          {/* Left: Source Code */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            <div
              style={{
                width: zone.width * 0.28,
                backgroundColor: `${OB1.BG_MID}dd`,
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(12 * zone.scale),
                padding: Math.round(24 * zone.scale),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: Math.round(20 * zone.scale),
                  color: OB1.CYAN,
                  lineHeight: 1.6,
                  whiteSpace: "pre",
                }}
              >
                {`function solve() {\n  // readable\n  // explicit\n  return result;\n}`}
              </div>
            </div>
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
              Source Code
            </div>
          </div>

          {/* Center: Arrow + label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            <svg
              width={arrowLength}
              height={Math.round(60 * zone.scale)}
              style={{ overflow: "visible" }}
            >
              <defs>
                <marker
                  id="arrowhead-ap011"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill={OB1.ORANGE}
                  />
                </marker>
              </defs>
              <line
                x1="0"
                y1={Math.round(30 * zone.scale)}
                x2={arrowLength * arrowProgress}
                y2={Math.round(30 * zone.scale)}
                stroke={OB1.ORANGE}
                strokeWidth={Math.round(3 * zone.scale)}
                markerEnd="url(#arrowhead-ap011)"
                style={{ zIndex: 0 }}
              />
            </svg>
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: Math.round(40 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Experience / Time
            </div>
          </div>

          {/* Right: Machine Code */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 90),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            <div
              style={{
                width: zone.width * 0.28,
                backgroundColor: `${OB1.BG_MID}dd`,
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.RED}`,
                borderRadius: Math.round(12 * zone.scale),
                padding: Math.round(24 * zone.scale),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: Math.round(18 * zone.scale),
                  color: OB1.RED,
                  lineHeight: 1.4,
                  whiteSpace: "pre",
                  letterSpacing: "-0.02em",
                }}
              >
                {`01001010 11010011\n10110101 00101110\n11011001 10010110\n01110100 11001011`}
              </div>
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              Machine Code
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-012-ImpactfulKnowledge
    // FOCAL: 2x2 quadrant matrix with top-right highlighted
    // SUPPORTING:
    //   1. X-axis labels: "Easy" (left) → "Hard" (right)
    //   2. Y-axis labels: "Low Value" (bottom) → "High Value" (top)
    //   3. Top-right quadrant highlighted with label "Impactful Knowledge Work"
    // TEXT ON SCREEN:
    //   - "Easy" (40px) — 4 chars
    //   - "Hard" (40px) — 4 chars
    //   - "Low Value" (40px) — 9 chars
    //   - "High Value" (40px) — 10 chars
    //   - "Impactful Knowledge Work" (56px, in highlighted quadrant) — 24 chars
    //   Total visible: 51 chars ✓ (under 90)
    // PHASES:
    //   - 0-1s: Axes fade in
    //   - 1-2s: Axis labels appear (staggered)
    //   - 2-3.5s: Grid lines draw
    //   - 3.5-5s: Top-right quadrant highlight + label
    //   - 5-7s: Hold
    // ELEMENT COUNT: 4 axis labels + 1 highlighted quadrant = 2 groups (within limit) ✓
    // PHONE TEST: All text ≥40px ✓
    id: "AP-012-ImpactfulKnowledge",
    title: "Where Agents Matter",
    subtitle: "The valuable quadrant",
    bottomLabel: "The High-Value Quadrant",
    bottomAccent: "High-Value",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const gridSize = Math.min(zone.width * 0.6, zone.height * 0.7);
      const gridX = (zone.width - gridSize) / 2;
      const gridY = (zone.height - gridSize) / 2;

      const axisOpacity = ease(sceneFrame, 0, 30);
      const gridProgress = ease(sceneFrame, 60, 105);
      const highlightOpacity = ease(sceneFrame, 105, 150);

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
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* Axes */}
            <line
              x1={gridX}
              y1={gridY + gridSize}
              x2={gridX + gridSize}
              y2={gridY + gridSize}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(2 * zone.scale)}
              opacity={axisOpacity}
              style={{ zIndex: 0 }}
            />
            <line
              x1={gridX}
              y1={gridY}
              x2={gridX}
              y2={gridY + gridSize}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(2 * zone.scale)}
              opacity={axisOpacity}
              style={{ zIndex: 0 }}
            />

            {/* Grid lines (vertical and horizontal centerlines) */}
            <line
              x1={gridX + gridSize / 2}
              y1={gridY}
              x2={gridX + gridSize / 2}
              y2={gridY + gridSize * gridProgress}
              stroke={OB1.DIM}
              strokeWidth={Math.round(1 * zone.scale)}
              strokeDasharray="4 4"
              style={{ zIndex: 0 }}
            />
            <line
              x1={gridX}
              y1={gridY + gridSize / 2}
              x2={gridX + gridSize * gridProgress}
              y2={gridY + gridSize / 2}
              stroke={OB1.DIM}
              strokeWidth={Math.round(1 * zone.scale)}
              strokeDasharray="4 4"
              style={{ zIndex: 0 }}
            />

            {/* Top-right quadrant highlight */}
            <rect
              x={gridX + gridSize / 2}
              y={gridY}
              width={gridSize / 2}
              height={gridSize / 2}
              fill={OB1.GREEN}
              opacity={highlightOpacity * 0.15}
              style={{ zIndex: 0 }}
            />
            <rect
              x={gridX + gridSize / 2}
              y={gridY}
              width={gridSize / 2}
              height={gridSize / 2}
              fill="none"
              stroke={OB1.GREEN}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={highlightOpacity}
              style={{ zIndex: 0 }}
            />
          </svg>

          {/* X-axis labels */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 30),
              position: "absolute",
              left: gridX,
              top: gridY + gridSize + Math.round(20 * zone.scale),
              fontSize: Math.round(40 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              zIndex: 10,
            }}
          >
            Easy
          </div>
          <div
            style={{
              ...fadeInUp(sceneFrame, 40),
              position: "absolute",
              right: zone.width - (gridX + gridSize),
              top: gridY + gridSize + Math.round(20 * zone.scale),
              fontSize: Math.round(40 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              zIndex: 10,
            }}
          >
            Hard
          </div>

          {/* Y-axis labels */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 35),
              position: "absolute",
              left: gridX - Math.round(120 * zone.scale),
              top: gridY + gridSize - Math.round(20 * zone.scale),
              fontSize: Math.round(40 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              textAlign: "right",
              zIndex: 10,
            }}
          >
            Low Value
          </div>
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              position: "absolute",
              left: gridX - Math.round(130 * zone.scale),
              top: gridY,
              fontSize: Math.round(40 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              textAlign: "right",
              zIndex: 10,
            }}
          >
            High Value
          </div>

          {/* Quadrant label — centered in top-right quadrant */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 120),
              position: "absolute",
              left: gridX + gridSize * 0.75,
              top: gridY + gridSize * 0.25,
              transform: "translate(-50%, -50%)",
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.GREEN,
              textAlign: "center",
              lineHeight: 1.3,
              width: gridSize * 0.44,
              zIndex: 10,
            }}
          >
            Impactful Knowledge Work
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

export const AP_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

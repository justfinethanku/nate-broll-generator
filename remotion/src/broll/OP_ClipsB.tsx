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
  Database,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  Radio,
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
    // DESIGN SPEC for OP-004-BenchMeanwhileWent
    // FOCAL: Three vertical comparison cards showing before→after benchmark gains
    // SUPPORTING: Brand logos (Hex, Cursor, Rakuten) at 140px each above their respective cards
    // TEXT ON SCREEN:
    //   - "Hex: 80% → 87%" (48px, in card 1) — 14 chars
    //   - "Cursor: 58 → 70" (48px, in card 2) — 14 chars
    //   - "Rakuten: 1x → 3x" (48px, in card 3) — 15 chars
    //   Total visible: 43 chars ✓
    // PHASES:
    //   - 0-1.5s: Three logos fade in
    //   - 1.5-3s: Before values appear
    //   - 3-5s: Arrow animations
    //   - 5-7s: After values appear with bounce
    // LOGOS: Database (Hex placeholder), cursor.svg, rakuten.svg
    // ELEMENT COUNT: 3 cards (within 4 max) ✓
    // PHONE TEST: All text 48px+, all logos 140px ✓
    id: "OP-004-BenchMeanwhileWent",
    title: "Benchmark Gains",
    subtitle: "Real enterprise improvements",
    bottomLabel: "Measurable capability lift across platforms",
    bottomAccent: "Measurable",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const benchmarks = [
        {
          name: "Hex",
          before: "80%",
          after: "87%",
          color: OB1.CYAN,
          logo: "database",
          delay: 0,
        },
        {
          name: "Cursor",
          before: "58",
          after: "70",
          color: OB1.ORANGE,
          logo: "cursor",
          delay: 10,
        },
        {
          name: "Rakuten",
          before: "1x",
          after: "3x",
          color: OB1.GREEN,
          logo: "rakuten",
          delay: 20,
        },
      ];

      const cardWidth = zone.width * 0.26;
      const cardHeight = zone.height * 0.5;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.06,
          }}
        >
          {benchmarks.map((bench, i) => {
            const logoOpacity = ease(sceneFrame, bench.delay, bench.delay + 20);
            const beforeOpacity = ease(sceneFrame, 45, 65);
            const arrowOpacity = ease(sceneFrame, 90, 110);
            const afterStyle = bouncePop(sceneFrame, 150, fps);

            return (
              <div
                key={bench.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(16 * zone.scale),
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    opacity: logoOpacity,
                    zIndex: 1,
                  }}
                >
                  {bench.logo === "database" ? (
                    <Database
                      size={Math.round(140 * zone.scale)}
                      color={OB1.CYAN}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Img
                      src={staticFile(`logos/${bench.logo}.svg`)}
                      style={{
                        width: Math.round(140 * zone.scale),
                        height: Math.round(140 * zone.scale),
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  )}
                </div>

                {/* Card container */}
                <div
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(2 * zone.scale)}px solid ${bench.color}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(12 * zone.scale),
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Before value */}
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.DIM,
                      opacity: beforeOpacity,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {bench.before}
                  </div>

                  {/* Arrow */}
                  <div
                    style={{
                      opacity: arrowOpacity,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    <ArrowRight
                      size={Math.round(40 * zone.scale)}
                      color={bench.color}
                      strokeWidth={2.5}
                    />
                  </div>

                  {/* After value */}
                  <div
                    style={{
                      ...afterStyle,
                      fontSize: Math.round(56 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: bench.color,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {bench.after}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-005-OptimizationAndIt
    // FOCAL: Two contrasting visualization styles — left: targeted spotlight beam on one capability node; right: uniform glow on all nodes
    // SUPPORTING: Labels "DIRECTED" (left) and "UNIFORM" (right) at 60px
    // TEXT ON SCREEN:
    //   - "DIRECTED" (60px) — 8 chars
    //   - "UNIFORM" (60px) — 7 chars
    //   Total visible: 15 chars ✓
    // PHASES:
    //   - 0-2s: Both node grids fade in (dimmed)
    //   - 2-4s: Left spotlight focuses on center node
    //   - 4-6s: Right uniform glow spreads to all nodes
    //   - 6-7s: Labels appear
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 2 groups (within 4 max) ✓
    // PHONE TEST: All text 60px ✓
    id: "OP-005-OptimizationAndIt",
    title: "Optimization",
    subtitle: "Two approaches",
    bottomLabel: "Targeted capability gains vs uniform upgrades",
    bottomAccent: "Targeted",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const gridOpacity = ease(sceneFrame, 0, 30);
      const directedHighlight = ease(sceneFrame, 60, 90);
      const uniformHighlight = ease(sceneFrame, 120, 150);
      const labelOpacity = ease(sceneFrame, 180, 200);

      const nodeSize = Math.round(64 * zone.scale);
      const nodeGap = zone.height * 0.12;

      // 3x3 grid layout helper
      const positions = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 }, // center
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
          }}
        >
          {/* LEFT: Directed optimization */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                opacity: labelOpacity,
                zIndex: 10,
                position: "relative",
              }}
            >
              DIRECTED
            </div>

            {/* Node grid */}
            <div
              style={{
                position: "relative",
                width: zone.width * 0.35,
                height: zone.height * 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {positions.map((pos, i) => {
                const isCenter = i === 4;
                const nodeOpacity = gridOpacity * (isCenter ? 1 : 0.3);
                const highlightOpacity = isCenter ? directedHighlight : 0;

                return (
                  <div
                    key={`left-${i}`}
                    style={{
                      position: "absolute",
                      left: `calc(50% + ${pos.x * nodeGap}px)`,
                      top: `calc(50% + ${pos.y * nodeGap}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Glow ring for center node */}
                    {isCenter && (
                      <div
                        style={{
                          position: "absolute",
                          width: Math.round(nodeSize * 2),
                          height: Math.round(nodeSize * 2),
                          borderRadius: "50%",
                          border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                          opacity: highlightOpacity * 0.6,
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 0,
                        }}
                      />
                    )}

                    {/* Node circle */}
                    <div
                      style={{
                        width: nodeSize,
                        height: nodeSize,
                        borderRadius: "50%",
                        backgroundColor: isCenter ? OB1.ORANGE : OB1.STEEL,
                        opacity: nodeOpacity + highlightOpacity * 0.7,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `${Math.round(2 * zone.scale)}px solid ${
                          isCenter ? OB1.ORANGE : OB1.DIM
                        }`,
                        zIndex: 1,
                      }}
                    >
                      <Target
                        size={Math.round(32 * zone.scale)}
                        color={OB1.WHITE}
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Uniform optimization */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                opacity: labelOpacity,
                zIndex: 10,
                position: "relative",
              }}
            >
              UNIFORM
            </div>

            {/* Node grid */}
            <div
              style={{
                position: "relative",
                width: zone.width * 0.35,
                height: zone.height * 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {positions.map((pos, i) => {
                const baseOpacity = gridOpacity * 0.3;
                const highlightOpacity = uniformHighlight;

                return (
                  <div
                    key={`right-${i}`}
                    style={{
                      position: "absolute",
                      left: `calc(50% + ${pos.x * nodeGap}px)`,
                      top: `calc(50% + ${pos.y * nodeGap}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Node circle */}
                    <div
                      style={{
                        width: nodeSize,
                        height: nodeSize,
                        borderRadius: "50%",
                        backgroundColor: OB1.CYAN,
                        opacity: baseOpacity + highlightOpacity * 0.7,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                        zIndex: 1,
                      }}
                    >
                      <Radio
                        size={Math.round(32 * zone.scale)}
                        color={OB1.WHITE}
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-006-TheExactFailure
    // FOCAL: Two side-by-side panels — left: checkmark + "MISSING DATA" response; right: X + "2.4M revenue" fabricated
    // SUPPORTING: Icons (CheckCircle2 green, XCircle red) at 96px
    // TEXT ON SCREEN:
    //   - "GROUNDED" (60px, above left panel) — 8 chars
    //   - "FABRICATED" (60px, above right panel) — 10 chars
    //   - "No data available" (44px, in left panel) — 17 chars
    //   - "$2.4M Q3 revenue" (44px, in right panel) — 16 chars
    //   Total visible: 51 chars ✓
    // PHASES:
    //   - 0-1.5s: Left panel + checkmark fade in
    //   - 1.5-3s: Left text appears
    //   - 3-4.5s: Right panel + X fade in
    //   - 4.5-6s: Right text appears
    //   - 6-7s: Hold
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 2 panels (within 4 max) ✓
    // PHONE TEST: All text 44px+, all icons 96px ✓
    id: "OP-006-TheExactFailure",
    title: "Failure Mode",
    subtitle: "Finance query response",
    bottomLabel: "Grounded truthfulness vs plausible fabrication",
    bottomAccent: "Grounded",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftPanelOpacity = ease(sceneFrame, 0, 30);
      const leftTextOpacity = ease(sceneFrame, 45, 65);
      const rightPanelOpacity = ease(sceneFrame, 90, 120);
      const rightTextOpacity = ease(sceneFrame, 135, 155);

      const panelWidth = zone.width * 0.38;
      const panelHeight = zone.height * 0.65;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.08,
          }}
        >
          {/* LEFT: Grounded response */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                opacity: leftPanelOpacity,
                zIndex: 10,
                position: "relative",
              }}
            >
              GROUNDED
            </div>

            {/* Panel */}
            <div
              style={{
                width: panelWidth,
                height: panelHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                opacity: leftPanelOpacity,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Checkmark icon */}
              <div style={{ zIndex: 1 }}>
                <CheckCircle2
                  size={Math.round(96 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                />
              </div>

              {/* Response text */}
              <div
                style={{
                  fontSize: Math.round(44 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  padding: `0 ${Math.round(24 * zone.scale)}px`,
                  opacity: leftTextOpacity,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                No data available
              </div>
            </div>
          </div>

          {/* RIGHT: Fabricated response */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                opacity: rightPanelOpacity,
                zIndex: 10,
                position: "relative",
              }}
            >
              FABRICATED
            </div>

            {/* Panel */}
            <div
              style={{
                width: panelWidth,
                height: panelHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                opacity: rightPanelOpacity,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* X icon */}
              <div style={{ zIndex: 1 }}>
                <XCircle
                  size={Math.round(96 * zone.scale)}
                  color={OB1.RED}
                  strokeWidth={2}
                />
              </div>

              {/* Response text */}
              <div
                style={{
                  fontSize: Math.round(44 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  padding: `0 ${Math.round(24 * zone.scale)}px`,
                  opacity: rightTextOpacity,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                $2.4M Q3 revenue
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

export const OP_CLIPS_B = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

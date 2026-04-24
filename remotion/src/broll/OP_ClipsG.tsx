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
} from "./shared";
import {
  FileCode,
  ArrowRight,
  CheckCircle2,
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
    // DESIGN SPEC for OP-019-ThatDoesMake
    // FOCAL: Side-by-side comparison: "4.6" card (left) with wavy flexible arrow, "4.7" card (right) with rigid straight arrow
    // SUPPORTING:
    //   - Small instruction icon above (single, centered)
    //   - "Infers" label under 4.6 arrow
    //   - "Literal" label under 4.7 arrow
    // TEXT ON SCREEN:
    //   - "4.6" (80px, on left card)
    //   - "4.7" (80px, on right card)
    //   - "Infers" (48px, under left arrow)
    //   - "Literal" (48px, under right arrow)
    //   Total: 22 chars ✓
    // PHASES:
    //   - 0-1.5s: Both version cards fade in
    //   - 1.5-3s: Instruction icon appears above
    //   - 3-4.5s: Left arrow draws (wavy path)
    //   - 4.5-6s: Right arrow draws (straight path)
    //   - 6-7s: Labels appear below arrows
    // ELEMENT COUNT: 4 (instruction icon + 2 cards + arrow pair as 1 visual unit) ✓
    // PHONE TEST: All text ≥48px ✓
    id: "OP-019-ThatDoesMake",
    title: "Literal Mode",
    subtitle: "4.7 vs 4.6 instruction handling",
    bottomLabel: "Reduced inference flexibility",
    bottomAccent: "inference",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const cardWidth = zone.width * 0.28;
      const cardHeight = zone.height * 0.35;
      const gap = zone.width * 0.15;

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
          {/* Instruction icon centered above */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              marginBottom: zone.height * 0.08,
              zIndex: 1,
            }}
          >
            <FileCode
              size={Math.round(72 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2}
            />
          </div>

          {/* Two version cards side by side */}
          <div
            style={{
              display: "flex",
              gap: gap,
              alignItems: "center",
              marginBottom: zone.height * 0.12,
            }}
          >
            {/* 4.6 Card - Left */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                width: cardWidth,
                height: cardHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                4.6
              </div>
            </div>

            {/* 4.7 Card - Right */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                width: cardWidth,
                height: cardHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
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

          {/* Arrow visualization area */}
          <div
            style={{
              display: "flex",
              gap: gap,
              alignItems: "center",
              marginBottom: zone.height * 0.08,
            }}
          >
            {/* Left wavy arrow (flexible inference) */}
            <div
              style={{
                width: cardWidth,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <svg
                width={Math.round(cardWidth * 0.8)}
                height={Math.round(80 * zone.scale)}
                style={{
                  opacity: ease(sceneFrame, 75, 105),
                }}
              >
                <defs>
                  <marker
                    id="wavy-arrow-head"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill={OB1.CYAN}
                    />
                  </marker>
                </defs>
                <path
                  d={`M 10 40 Q ${cardWidth * 0.2} 20, ${cardWidth * 0.4} 40 T ${cardWidth * 0.7} 40`}
                  stroke={OB1.CYAN}
                  strokeWidth={Math.round(4 * zone.scale)}
                  fill="none"
                  markerEnd="url(#wavy-arrow-head)"
                  strokeDasharray={ease(sceneFrame, 75, 105) * 1000}
                  strokeDashoffset={0}
                  style={{ zIndex: 0 }}
                />
              </svg>
              <div
                style={{
                  ...fadeInUp(sceneFrame, 150),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.CYAN,
                  marginTop: zone.height * 0.04,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Infers
              </div>
            </div>

            {/* Right straight arrow (literal following) */}
            <div
              style={{
                width: cardWidth,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <svg
                width={Math.round(cardWidth * 0.8)}
                height={Math.round(80 * zone.scale)}
                style={{
                  opacity: ease(sceneFrame, 120, 150),
                }}
              >
                <defs>
                  <marker
                    id="straight-arrow-head"
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
                  x1="10"
                  y1="40"
                  x2={cardWidth * 0.7}
                  y2="40"
                  stroke={OB1.ORANGE}
                  strokeWidth={Math.round(4 * zone.scale)}
                  markerEnd="url(#straight-arrow-head)"
                  strokeDasharray={ease(sceneFrame, 120, 150) * 1000}
                  strokeDashoffset={0}
                  style={{ zIndex: 0 }}
                />
              </svg>
              <div
                style={{
                  ...fadeInUp(sceneFrame, 150),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.ORANGE,
                  marginTop: zone.height * 0.04,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Literal
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-020-CodeRabbitRan
    // FOCAL: Horizontal flow diagram: Repository icon → Code Rabbit logo → Opus 4.7 logo → Check output
    // SUPPORTING: Arrow connectors between nodes
    // TEXT ON SCREEN:
    //   - "Repository" (48px)
    //   - "Code Rabbit" (48px)
    //   - "Opus 4.7" (48px)
    //   - "Review" (48px)
    //   Total: 40 chars ✓
    // PHASES:
    //   - 0-1s: Repository icon fades in
    //   - 1-2s: Arrow 1 draws
    //   - 2-3s: Code Rabbit logo fades in
    //   - 3-4s: Arrow 2 draws
    //   - 4-5s: Opus logo fades in
    //   - 5-6s: Arrow 3 draws, check icon fades in
    // LOGOS: coderabbit.svg, claude.svg (for Opus)
    // ELEMENT COUNT: 4 nodes ✓
    // PHONE TEST: All logos 120px+, all text 48px ✓
    id: "OP-020-CodeRabbitRan",
    title: "Dev Integration",
    subtitle: "Code Rabbit workflow testing",
    bottomLabel: "Testing 4.7 on code review workflows",
    bottomAccent: "code review",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const nodeSize = Math.round(120 * zone.scale);
      const nodeGap = zone.width * 0.06;
      const totalWidth = nodeSize * 4 + nodeGap * 3;
      const startX = (zone.width - totalWidth) / 2;

      const nodes = [
        { label: "Repository", icon: FileCode, delay: 10, color: OB1.STEEL },
        { label: "Code Rabbit", logo: "coderabbit", delay: 50, color: OB1.CYAN },
        { label: "Opus 4.7", logo: "claude", delay: 90, color: OB1.ORANGE },
        { label: "Review", icon: CheckCircle2, delay: 130, color: OB1.GREEN },
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
          {/* Flow nodes */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: nodeGap,
              marginBottom: zone.height * 0.06,
            }}
          >
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const arrowDelay = node.delay + 20;
              const showArrow = i < nodes.length - 1;

              return (
                <React.Fragment key={i}>
                  {/* Node */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: Math.round(12 * zone.scale),
                    }}
                  >
                    <div
                      style={{
                        ...bouncePop(sceneFrame, node.delay, fps),
                        zIndex: 1,
                      }}
                    >
                      {node.logo ? (
                        <Img
                          src={staticFile(`logos/${node.logo}.svg`)}
                          style={{
                            width: nodeSize,
                            height: nodeSize,
                            filter: "brightness(0) invert(1)",
                          }}
                        />
                      ) : Icon ? (
                        <Icon
                          size={nodeSize}
                          color={node.color}
                          strokeWidth={2}
                        />
                      ) : null}
                    </div>
                    <div
                      style={{
                        ...fadeInUp(sceneFrame, node.delay + 10),
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {node.label}
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {showArrow && (
                    <div
                      style={{
                        opacity: ease(sceneFrame, arrowDelay, arrowDelay + 20),
                        zIndex: 0,
                      }}
                    >
                      <ArrowRight
                        size={Math.round(48 * zone.scale)}
                        color={OB1.DIM}
                        strokeWidth={2.5}
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

  {
    // DESIGN SPEC for OP-021-ExplainThemUltimately
    // FOCAL: Two gauge clusters: "4.6" with 5 small dials, "4.7" with 2 larger dials
    // SUPPORTING: Separator line between clusters
    // TEXT ON SCREEN:
    //   - "4.6" (72px, above left cluster)
    //   - "5 Parameters" (48px, below left)
    //   - "4.7" (72px, above right cluster)
    //   - "2 Parameters" (48px, below right)
    //   Total: 28 chars ✓
    // PHASES:
    //   - 0-1.5s: Left cluster (4.6) fades in with 5 dials
    //   - 1.5-3s: Separator line draws
    //   - 3-5s: Right cluster (4.7) fades in with 2 dials
    //   - 5-7s: Hold
    // ELEMENT COUNT: 2 clusters (within 4 max) ✓
    // PHONE TEST: Version labels 72px, parameter labels 48px, dials visible ✓
    id: "OP-021-ExplainThemUltimately",
    title: "Parameter Control",
    subtitle: "Adaptive thinking configuration",
    bottomLabel: "Fewer configurable parameters",
    bottomAccent: "Fewer",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const dialSize46 = Math.round(56 * zone.scale);
      const dialSize47 = Math.round(90 * zone.scale);

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
          {/* Left cluster - 4.6 with 5 parameters */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              marginRight: zone.width * 0.08,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              4.6
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: Math.round(16 * zone.scale),
                width: zone.width * 0.35,
                justifyContent: "center",
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    ...bouncePop(sceneFrame, 30 + i * 8, fps),
                    zIndex: 1,
                  }}
                >
                  <Gauge
                    size={dialSize46}
                    color={OB1.CYAN}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                ...fadeInUp(sceneFrame, 100),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              5 Parameters
            </div>
          </div>

          {/* Separator line */}
          <div
            style={{
              width: Math.round(3 * zone.scale),
              height: zone.height * 0.5,
              backgroundColor: OB1.DIM,
              opacity: ease(sceneFrame, 45, 75),
              zIndex: 0,
            }}
          />

          {/* Right cluster - 4.7 with 2 parameters */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              marginLeft: zone.width * 0.08,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              4.7
            </div>

            <div
              style={{
                display: "flex",
                gap: Math.round(24 * zone.scale),
                justifyContent: "center",
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    ...bouncePop(sceneFrame, 110 + i * 12, fps),
                    zIndex: 1,
                  }}
                >
                  <Gauge
                    size={dialSize47}
                    color={OB1.ORANGE}
                    strokeWidth={2.5}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                ...fadeInUp(sceneFrame, 140),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              2 Parameters
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

export const OP_CLIPS_G = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

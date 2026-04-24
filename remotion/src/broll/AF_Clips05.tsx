import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  slideIn,
  stagger,
} from "./shared";
import {
  ArrowRight,
  Database,
  Zap,
  Code,
  Package,
  Workflow,
  Users,
  Network,
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
    // DESIGN SPEC for AF-013-SuperhumanSpeedEconomy
    // FOCAL: Two horizontal lanes — "HUMAN ECONOMY" (bottom, slow) vs "AGENTIC ECONOMY" (top, fast)
    // SUPPORTING: Speed indicator arrows in each lane (few slow in human, many fast in agentic)
    // TEXT ON SCREEN:
    //   - "HUMAN ECONOMY" (48px) — 13 chars
    //   - "AGENTIC ECONOMY" (48px) — 15 chars
    //   - "1x" / "100x" speed labels (48px) — 6 chars
    //   Total: 34 chars ✓
    // PHASES:
    //   - 0-1.5s: Lane containers fade in
    //   - 1.5-3s: Human economy label + slow arrow
    //   - 3-5s: Agentic economy label + fast arrows
    //   - 5-7s: Speed multipliers appear, continuous animation
    // ELEMENT COUNT: 2 lanes + 2 speed labels = 4 ✓
    // PHONE TEST: All text 48px ✓
    id: "AF-013-SuperhumanSpeedEconomy",
    title: "Agentic Economy",
    subtitle: "Operating at superhuman speed",
    bottomLabel: "The new economy operates 100x faster",
    bottomAccent: "100x",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Animation timings
      const laneContainerOpacity = ease(sceneFrame, 0, 30);
      const humanLabelOpacity = ease(sceneFrame, 45, 65);
      const agenticLabelOpacity = ease(sceneFrame, 90, 110);
      const speedLabelOpacity = ease(sceneFrame, 150, 170);

      // Lane dimensions
      const laneHeight = zone.height * 0.25;
      const laneGap = zone.height * 0.1;
      const laneWidth = zone.width * 0.7;

      // Arrow animation - continuous scroll
      const arrowSpeed = sceneFrame * 2; // human speed base
      const agenticArrowSpeed = sceneFrame * 8; // 4x faster visual

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(laneGap),
          }}
        >
          {/* AGENTIC ECONOMY LANE (top) */}
          <div
            style={{
              opacity: laneContainerOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            {/* Agentic lane container */}
            <div
              style={{
                width: Math.round(laneWidth),
                height: Math.round(laneHeight),
                backgroundColor: `${OB1.CYAN}20`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              {/* Fast-moving arrows in agentic lane */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const offset = ((agenticArrowSpeed + i * 80) % (laneWidth + 100)) - 100;
                return (
                  <ArrowRight
                    key={i}
                    size={Math.round(32 * zone.scale)}
                    color={OB1.CYAN}
                    style={{
                      position: "absolute",
                      left: offset,
                      opacity: agenticLabelOpacity * 0.7,
                      zIndex: 0,
                    }}
                  />
                );
              })}

              {/* Agentic economy label */}
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.CYAN,
                  opacity: agenticLabelOpacity,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                AGENTIC ECONOMY
              </div>

              {/* Speed multiplier */}
              <div
                style={{
                  position: "absolute",
                  right: Math.round(20 * zone.scale),
                  top: Math.round(12 * zone.scale),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.mono,
                  fontWeight: 800,
                  color: OB1.CYAN,
                  opacity: speedLabelOpacity,
                  zIndex: 10,
                }}
              >
                100x
              </div>
            </div>
          </div>

          {/* HUMAN ECONOMY LANE (bottom) */}
          <div
            style={{
              opacity: laneContainerOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            {/* Human lane container */}
            <div
              style={{
                width: Math.round(laneWidth),
                height: Math.round(laneHeight),
                backgroundColor: `${OB1.STEEL}20`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              {/* Slow-moving arrows in human lane */}
              {[0, 1].map((i) => {
                const offset = ((arrowSpeed + i * 250) % (laneWidth + 100)) - 100;
                return (
                  <ArrowRight
                    key={i}
                    size={Math.round(32 * zone.scale)}
                    color={OB1.STEEL}
                    style={{
                      position: "absolute",
                      left: offset,
                      opacity: humanLabelOpacity * 0.5,
                      zIndex: 0,
                    }}
                  />
                );
              })}

              {/* Human economy label */}
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.STEEL,
                  opacity: humanLabelOpacity,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                HUMAN ECONOMY
              </div>

              {/* Speed multiplier */}
              <div
                style={{
                  position: "absolute",
                  right: Math.round(20 * zone.scale),
                  top: Math.round(12 * zone.scale),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.mono,
                  fontWeight: 800,
                  color: OB1.STEEL,
                  opacity: speedLabelOpacity,
                  zIndex: 10,
                }}
              >
                1x
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AF-014-FutureJobRoles
    // FOCAL: Grid of 4 role cards (2x2) — each with icon + label
    // SUPPORTING: None (4 cards = max count)
    // TEXT ON SCREEN:
    //   - "Pipeline Builder" (48px) — 15 chars
    //   - "Context Curator" (48px) — 15 chars
    //   - "Agent Manager" (48px) — 13 chars
    //   - "Integration Lead" (48px) — 16 chars
    //   Total: 59 chars ✓
    // PHASES:
    //   - 0-1s: Grid container fades in
    //   - 1-3s: Cards appear staggered (each with icon + label)
    //   - 3-7s: Hold
    // ICONS: Workflow, Database, Users, Network (lucide-react)
    // ELEMENT COUNT: 4 cards (exactly max) ✓
    // CARD SIZE: 280w × 240h ✓
    // PHONE TEST: All text 48px, icons 64px ✓
    id: "AF-014-FutureJobRoles",
    title: "New Roles",
    subtitle: "Cross-functional skill sets",
    bottomLabel: "Four roles that didn't exist before",
    bottomAccent: "Four roles",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const roles = [
        { label: "Pipeline Builder", Icon: Workflow, color: OB1.ORANGE },
        { label: "Context Curator", Icon: Database, color: OB1.CYAN },
        { label: "Agent Manager", Icon: Users, color: OB1.GREEN },
        { label: "Integration Lead", Icon: Network, color: OB1.PURPLE },
      ];

      const cardWidth = 280 * zone.scale;
      const cardHeight = 240 * zone.scale;
      const gap = zone.width * 0.06;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: Math.round(gap),
            }}
          >
            {roles.map((role, i) => {
              const cardOpacity = ease(sceneFrame, stagger(i, 30, 20), stagger(i, 30, 20) + 25);

              return (
                <div
                  key={i}
                  style={{
                    width: Math.round(cardWidth),
                    height: Math.round(cardHeight),
                    backgroundColor: `${role.color}15`,
                    border: `${Math.round(3 * zone.scale)}px solid ${role.color}`,
                    borderRadius: Math.round(16 * zone.scale),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(20 * zone.scale),
                    opacity: cardOpacity,
                    zIndex: 1,
                  }}
                >
                  {/* Icon */}
                  <role.Icon
                    size={Math.round(64 * zone.scale)}
                    color={role.color}
                    strokeWidth={2.5}
                    style={{ zIndex: 1 }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: OB1.WHITE,
                      textAlign: "center",
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {role.label}
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
    // DESIGN SPEC for AF-015-BuildingAgenticPrimitives
    // FOCAL: Pipeline flow — 3 primitive blocks (left) → arrow → assembled system (right)
    // SUPPORTING: Connecting arrow
    // TEXT ON SCREEN:
    //   - "PRIMITIVES" (48px, above left group) — 10 chars
    //   - Three primitive labels: "Data" (40px), "Logic" (40px), "API" (40px) — 13 chars
    //   - "PIPELINE" (56px, on right box) — 8 chars
    //   Total: 31 chars ✓
    // PHASES:
    //   - 0-1.5s: Left primitive blocks fade in
    //   - 1.5-3s: "PRIMITIVES" label
    //   - 3-4s: Arrow draws left to right
    //   - 4-6s: Right "PIPELINE" box fades in
    //   - 6-7s: Hold
    // ICONS: Database, Zap, Code (primitives), Package (pipeline)
    // ELEMENT COUNT: 1 primitives group + 1 arrow + 1 pipeline box = 3 ✓
    // COLORS: Primitives = STEEL, Arrow = ORANGE, Pipeline = GREEN
    // PHONE TEST: All text ≥40px, icons 64px ✓
    id: "AF-015-BuildingAgenticPrimitives",
    title: "Building Primitives",
    subtitle: "Infrastructure components",
    bottomLabel: "Assemble pipelines from reusable primitives",
    bottomAccent: "reusable primitives",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Animation phases
      const primitivesOpacity = ease(sceneFrame, 0, 30);
      const primitivesLabelOpacity = ease(sceneFrame, 45, 65);
      const arrowProgress = ease(sceneFrame, 90, 120);
      const pipelineOpacity = ease(sceneFrame, 120, 150);

      const primitives = [
        { label: "Data", Icon: Database },
        { label: "Logic", Icon: Zap },
        { label: "API", Icon: Code },
      ];

      const primitiveBoxSize = 140 * zone.scale;
      const pipelineBoxWidth = 280 * zone.scale;
      const pipelineBoxHeight = 200 * zone.scale;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.width * 0.08),
          }}
        >
          {/* LEFT: Primitives group */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* "PRIMITIVES" label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.STEEL,
                opacity: primitivesLabelOpacity,
                marginBottom: Math.round(8 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              PRIMITIVES
            </div>

            {/* Three primitive blocks stacked vertically */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(16 * zone.scale),
                opacity: primitivesOpacity,
              }}
            >
              {primitives.map((prim, i) => (
                <div
                  key={i}
                  style={{
                    width: Math.round(primitiveBoxSize),
                    height: Math.round(primitiveBoxSize),
                    backgroundColor: `${OB1.STEEL}20`,
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                    borderRadius: Math.round(12 * zone.scale),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(8 * zone.scale),
                    zIndex: 1,
                  }}
                >
                  <prim.Icon
                    size={Math.round(64 * zone.scale)}
                    color={OB1.STEEL}
                    strokeWidth={2.5}
                    style={{ zIndex: 1 }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {prim.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE: Arrow connector */}
          <div
            style={{
              opacity: arrowProgress,
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(80 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
            />
          </div>

          {/* RIGHT: Assembled pipeline */}
          <div
            style={{
              width: Math.round(pipelineBoxWidth),
              height: Math.round(pipelineBoxHeight),
              backgroundColor: `${OB1.GREEN}20`,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
              borderRadius: Math.round(16 * zone.scale),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(20 * zone.scale),
              opacity: pipelineOpacity,
              zIndex: 1,
            }}
          >
            <Package
              size={Math.round(80 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={2.5}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              PIPELINE
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

export const AF_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

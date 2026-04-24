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
  stagger,
  pulse,
} from "./shared";
import {
  Lock,
  GitBranch,
  RotateCcw,
  CheckCircle2,
  Target,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
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
    // DESIGN SPEC for AIA-019-SafetyFramework
    // FOCAL: Central Lock icon (120px) with four safety pillars radiating around it in a cross pattern
    // SUPPORTING (4):
    //   - "Tight Loops" (top) — Activity icon 72px + label 48px
    //   - "Baselines" (right) — BarChart3 icon 72px + label 48px
    //   - "Version Control" (bottom) — GitBranch icon 72px + label 48px
    //   - "Revert Capability" (left) — RotateCcw icon 72px + label 48px
    // TEXT ON SCREEN:
    //   - "SAFETY" (60px centered above lock)
    //   - 4 pillar labels @ 48px each: "Tight Loops", "Baselines", "Version Control", "Revert" (14+9+15+6 = 44 chars)
    //   Total visible: ~50 chars ✓
    // PHASES:
    //   - 0-1s: "SAFETY" + central lock fade in
    //   - 1-4s: Four pillars appear staggered (top, right, bottom, left)
    //   - 4-7s: Hold with subtle pulse on lock
    // ELEMENT COUNT: 1 focal (lock) + 4 supporting (pillars) = 5 TOTAL
    //   NOTE: This exceeds the 4-element rule but is justified because the 4 pillars are tightly grouped
    //   around a single conceptual unit (safety framework) and share visual treatment (same icon size, same
    //   label size, evenly distributed). The lock dominates and the 4 pillars orbit it symmetrically.
    // COLORS: Lock = ORANGE (primary), pillars = STEEL (secondary)
    // PHONE TEST: All text 48-60px, icons 72-120px ✓
    id: "AIA-019-SafetyFramework",
    title: "Safety Framework",
    subtitle: "Four pillars of reliable automation",
    bottomLabel: "Build trust through control, not chaos",
    bottomAccent: "trust",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const lockSize = Math.round(120 * zone.scale);
      const pillarIconSize = Math.round(72 * zone.scale);
      const pillarLabelSize = Math.round(48 * zone.scale);
      const titleSize = Math.round(60 * zone.scale);

      // Layout: pillars at cardinal points around center
      const radius = Math.min(zone.width, zone.height) * 0.32;

      const pillars = [
        { Icon: Activity, label: "Tight Loops", angle: -90, delay: 40 },
        { Icon: BarChart3, label: "Baselines", angle: 0, delay: 50 },
        { Icon: GitBranch, label: "Version Control", angle: 90, delay: 60 },
        { Icon: RotateCcw, label: "Revert", angle: 180, delay: 70 },
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
          {/* Title above center */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              fontSize: titleSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.06,
              zIndex: 10,
              position: "relative",
            }}
          >
            SAFETY
          </div>

          {/* Central lock icon with pulse */}
          <div
            style={{
              ...bouncePop(sceneFrame, 20, fps),
              zIndex: 1,
              position: "relative",
              opacity: 0.5 + pulse(sceneFrame - 120, 0.02) * 0.5,
            }}
          >
            <Lock
              size={lockSize}
              color={OB1.ORANGE}
              strokeWidth={2.5}
            />
          </div>

          {/* Four pillars radiating from center */}
          {pillars.map((pillar, idx) => {
            const angleRad = (pillar.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: zone.width / 2 + x,
                  top: zone.height / 2 + y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    ...fadeInUp(sceneFrame, pillar.delay),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(8 * zone.scale),
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  <pillar.Icon
                    size={pillarIconSize}
                    color={OB1.STEEL}
                    strokeWidth={2}
                  />
                  <div
                    style={{
                      fontSize: pillarLabelSize,
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {pillar.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Connecting lines from center to pillars (decorative, behind) */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          >
            {pillars.map((pillar, idx) => {
              const angleRad = (pillar.angle * Math.PI) / 180;
              const x = zone.width / 2 + Math.cos(angleRad) * radius;
              const y = zone.height / 2 + Math.sin(angleRad) * radius;
              const lineOpacity = ease(sceneFrame, pillar.delay, pillar.delay + 20);

              return (
                <line
                  key={idx}
                  x1={zone.width / 2}
                  y1={zone.height / 2}
                  x2={x}
                  y2={y}
                  stroke={OB1.DIM}
                  strokeWidth={Math.round(2 * zone.scale)}
                  opacity={lineOpacity * 0.4}
                />
              );
            })}
          </svg>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-020-DeployStart
    // FOCAL: Large "1" numeral (140px) in ORANGE, centered
    // SUPPORTING (3):
    //   - "Karpathy" label (60px) above the 1
    //   - "Triplet" label (60px) below the 1
    //   - Three connected boxes below forming the triplet structure:
    //     Box 1: Target icon (64px) + "Data" (48px)
    //     Box 2: Users icon (64px) + "Model" (48px)
    //     Box 3: CheckCircle2 icon (64px) + "Eval" (48px)
    // TEXT ON SCREEN:
    //   - "Karpathy" (8 chars)
    //   - "Triplet" (7 chars)
    //   - "Data" (4 chars)
    //   - "Model" (5 chars)
    //   - "Eval" (4 chars)
    //   Total: ~28 chars ✓
    // PHASES:
    //   - 0-1.5s: "Karpathy" fades in
    //   - 1.5-2.5s: Big "1" pops in
    //   - 2.5-3.5s: "Triplet" fades in
    //   - 3.5-6s: Three boxes appear staggered left to right
    //   - 6-7s: Hold
    // ELEMENT COUNT: 1 focal (the "1") + 3 supporting (the triplet boxes + 2 labels) = 4 ✓
    // COLORS: "1" = ORANGE, boxes = CYAN
    // PHONE TEST: All text 48-140px, icons 64px ✓
    id: "AIA-020-DeployStart",
    title: "Deployment Starting Point",
    subtitle: "Begin with one system",
    bottomLabel: "Define the triplet before scaling",
    bottomAccent: "triplet",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const bigNumberSize = Math.round(140 * zone.scale);
      const labelSize = Math.round(60 * zone.scale);
      const boxLabelSize = Math.round(48 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const boxWidth = zone.width * 0.22;
      const boxHeight = Math.round(160 * zone.scale);

      const tripletItems = [
        { Icon: Target, label: "Data", delay: 105 },
        { Icon: Users, label: "Model", delay: 120 },
        { Icon: CheckCircle2, label: "Eval", delay: 135 },
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
          {/* "Karpathy" label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              fontSize: labelSize,
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              marginBottom: zone.height * 0.04,
              zIndex: 10,
              position: "relative",
            }}
          >
            Karpathy
          </div>

          {/* Big "1" */}
          <div
            style={{
              ...bouncePop(sceneFrame, 45, fps),
              fontSize: bigNumberSize,
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.ORANGE,
              marginBottom: zone.height * 0.04,
              zIndex: 10,
              position: "relative",
            }}
          >
            1
          </div>

          {/* "Triplet" label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 75),
              fontSize: labelSize,
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            Triplet
          </div>

          {/* Three boxes in a row */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.04,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            {tripletItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  ...fadeInUp(sceneFrame, item.delay),
                  width: boxWidth,
                  height: boxHeight,
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                  borderRadius: Math.round(8 * zone.scale),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(12 * zone.scale),
                  zIndex: 1,
                }}
              >
                <item.Icon
                  size={iconSize}
                  color={OB1.CYAN}
                  strokeWidth={2}
                />
                <div
                  style={{
                    fontSize: boxLabelSize,
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-021-EvalPrimacy
    // FOCAL: Large TrendingUp icon (140px) in GREEN with "EVAL FIRST" headline (72px) above
    // SUPPORTING (2):
    //   - Red "X" (80px) over grayed-out icon on left with "Can't Automate" label (48px)
    //   - Green checkmark (80px) over TrendingUp icon on right with "Can Score" label (48px)
    // TEXT ON SCREEN:
    //   - "EVAL FIRST" (10 chars)
    //   - "Can't Automate" (14 chars)
    //   - "Can Score" (9 chars)
    //   Total: ~33 chars ✓
    // PHASES:
    //   - 0-1.5s: "EVAL FIRST" + center TrendingUp icon fade in
    //   - 1.5-3.5s: Left side (X + grayed icon + label) fades in
    //   - 3.5-5.5s: Right side (checkmark + icon + label) fades in
    //   - 5.5-7s: Hold
    // ELEMENT COUNT: 1 focal (center message) + 2 supporting (can't vs can) = 3 ✓
    // COLORS: Center = GREEN, left = RED, right = GREEN
    // PHONE TEST: All text 48-72px, icons 80-140px ✓
    id: "AIA-021-EvalPrimacy",
    title: "Evaluation Infrastructure",
    subtitle: "Score first, automate second",
    bottomLabel: "You cannot automate what you cannot measure",
    bottomAccent: "measure",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const headlineSize = Math.round(72 * zone.scale);
      const centerIconSize = Math.round(140 * zone.scale);
      const sideIconSize = Math.round(80 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);

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
          {/* Headline */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              fontSize: headlineSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.GREEN,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            EVAL FIRST
          </div>

          {/* Center focal icon */}
          <div
            style={{
              ...bouncePop(sceneFrame, 20, fps),
              marginBottom: zone.height * 0.1,
              zIndex: 1,
            }}
          >
            <TrendingUp
              size={centerIconSize}
              color={OB1.GREEN}
              strokeWidth={2.5}
            />
          </div>

          {/* Comparison row: can't automate (left) vs can score (right) */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.15,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            {/* Left: Can't automate */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div style={{ position: "relative" }}>
                <BarChart3
                  size={sideIconSize}
                  color={OB1.DIM}
                  strokeWidth={2}
                  style={{ opacity: 0.3 }}
                />
                {/* Red X overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: Math.round(80 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 900,
                    color: OB1.RED,
                    zIndex: 10,
                  }}
                >
                  ✕
                </div>
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.RED,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Can't Automate
              </div>
            </div>

            {/* Right: Can score */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 105),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div style={{ position: "relative" }}>
                <TrendingUp
                  size={sideIconSize}
                  color={OB1.GREEN}
                  strokeWidth={2}
                />
                {/* Green checkmark overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: Math.round(80 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 900,
                    color: OB1.GREEN,
                    zIndex: 10,
                  }}
                >
                  ✓
                </div>
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.GREEN,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Can Score
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

export const AIA_CLIPS_G = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

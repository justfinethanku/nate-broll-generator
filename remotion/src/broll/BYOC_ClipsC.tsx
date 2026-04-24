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
  Users,
  ArrowRight,
  FileText,
  CheckCircle2,
  Zap,
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
    // DESIGN SPEC for BYOC-007-layer-is-the-443-110
    // FOCAL: Two figures (user + AI) with a connecting wave/flow between them, labeled "BEHAVIORAL RELATIONSHIP"
    // SUPPORTING (3):
    //   1. Left figure labeled "USER" (Users icon, 64px in 160px circle)
    //   2. Right figure labeled "AI" (Zap icon, 64px in 160px circle)
    //   3. Center flowing connection with "LAYER 3" label above
    // TEXT ON SCREEN:
    //   - "LAYER 3" (60px, above connection) — 7 chars
    //   - "USER" (48px, below left circle) — 4 chars
    //   - "AI" (48px, below right circle) — 2 chars
    //   - "BEHAVIORAL RELATIONSHIP" (56px, below connection) — 24 chars
    //   Total visible: 37 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Left circle (USER) fades in
    //   - 1.5-3s: Right circle (AI) fades in
    //   - 3-4.5s: Connecting flow animates in (left to right)
    //   - 4.5-7s: Labels appear, hold
    // ELEMENT COUNT: 3 groups (within 4 max) ✓
    // PHONE TEST: All text 48-60px, icons 64px in 160px circles ✓
    id: "BYOC-007-layer-is-the-443-110",
    title: "Layer 3",
    subtitle: "Behavioral Relationship",
    bottomLabel: "Emergent understanding between AI and user over time",
    bottomAccent: "understanding",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const circleSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const spacing = zone.width * 0.35;
      const centerX = zone.width / 2;
      const centerY = zone.height / 2;

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
          {/* Connecting flow line with animated gradient */}
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
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={OB1.CYAN} />
                <stop offset="50%" stopColor={OB1.PURPLE} />
                <stop offset="100%" stopColor={OB1.ORANGE} />
              </linearGradient>
            </defs>
            {/* Main connection line */}
            <line
              x1={centerX - spacing}
              y1={centerY}
              x2={centerX - spacing + (spacing * 2 * ease(sceneFrame, 90, 135))}
              y2={centerY}
              stroke="url(#flowGradient)"
              strokeWidth={Math.round(4 * zone.scale)}
              opacity={ease(sceneFrame, 90, 105)}
            />
            {/* Flow particles */}
            {[0, 1, 2].map((i) => {
              const particleDelay = 100 + i * 20;
              const particleProgress = ease(sceneFrame, particleDelay, particleDelay + 40);
              const particleX = centerX - spacing + (spacing * 2 * particleProgress);

              return (
                <circle
                  key={i}
                  cx={particleX}
                  cy={centerY}
                  r={Math.round(6 * zone.scale)}
                  fill={OB1.CYAN}
                  opacity={ease(sceneFrame, particleDelay, particleDelay + 20) * (1 - particleProgress) * 0.8}
                />
              );
            })}
          </svg>

          {/* Left circle - USER */}
          <div
            style={{
              position: "absolute",
              left: centerX - spacing - circleSize / 2,
              top: centerY - circleSize / 2,
              ...fadeInUp(sceneFrame, 20, 30),
            }}
          >
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.CYAN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Users
                size={iconSize}
                color={OB1.WHITE}
                strokeWidth={2}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                marginTop: Math.round(16 * zone.scale),
                opacity: ease(sceneFrame, 135, 150),
                zIndex: 10,
                position: "relative",
              }}
            >
              USER
            </div>
          </div>

          {/* Right circle - AI */}
          <div
            style={{
              position: "absolute",
              left: centerX + spacing - circleSize / 2,
              top: centerY - circleSize / 2,
              ...fadeInUp(sceneFrame, 45, 30),
            }}
          >
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.ORANGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Zap
                size={iconSize}
                color={OB1.WHITE}
                strokeWidth={2}
                fill={OB1.WHITE}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                marginTop: Math.round(16 * zone.scale),
                opacity: ease(sceneFrame, 135, 150),
                zIndex: 10,
                position: "relative",
              }}
            >
              AI
            </div>
          </div>

          {/* Center labels */}
          <div
            style={{
              position: "absolute",
              top: centerY - circleSize / 2 - Math.round(80 * zone.scale),
              left: centerX,
              transform: "translateX(-50%)",
            }}
          >
            <div style={{ ...fadeInUp(sceneFrame, 135, 25) }}>
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.PURPLE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                LAYER 3
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: centerY + circleSize / 2 + Math.round(70 * zone.scale),
              left: centerX,
              transform: "translateX(-50%)",
            }}
          >
            <div style={{ ...fadeInUp(sceneFrame, 150, 25) }}>
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                BEHAVIORAL RELATIONSHIP
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for BYOC-008-layer-is-the-553-130
    // FOCAL: Stack of 3 document/artifact icons with the top one highlighted, labeled "ARTIFACT LAYER"
    // SUPPORTING (2):
    //   1. FileText icon stack (3 overlapping documents, top one at 80px)
    //   2. CheckCircle2 icon badge (64px) overlaying top-right of top document
    // TEXT ON SCREEN:
    //   - "LAYER 4" (60px, above stack) — 7 chars
    //   - "ARTIFACT LAYER" (64px, main label) — 14 chars
    //   - "DEMONSTRATED CAPABILITY" (48px, below) — 23 chars
    //   Total visible: 44 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Bottom two documents fade in (dim)
    //   - 1.5-3s: Top document pops in (bright)
    //   - 3-4.5s: Check badge appears
    //   - 4.5-7s: Labels appear, hold
    // ELEMENT COUNT: 2 main groups (within 4 max) ✓
    // PHONE TEST: All text 48-64px, icons 64-80px ✓
    id: "BYOC-008-layer-is-the-553-130",
    title: "Layer 4",
    subtitle: "Artifact Layer",
    bottomLabel: "Demonstrated capability through produced work",
    bottomAccent: "Demonstrated capability",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const docSize = Math.round(80 * zone.scale);
      const badgeSize = Math.round(64 * zone.scale);
      const stackOffset = Math.round(20 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(32 * zone.scale),
          }}
        >
          {/* LAYER 4 label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 135, 25),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.GREEN,
              zIndex: 10,
              position: "relative",
            }}
          >
            LAYER 4
          </div>

          {/* Document stack with badge */}
          <div
            style={{
              position: "relative",
              width: docSize + stackOffset * 2,
              height: docSize + stackOffset * 2,
            }}
          >
            {/* Bottom document (dim) */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: stackOffset * 2,
                opacity: ease(sceneFrame, 20, 40) * 0.3,
                zIndex: 0,
              }}
            >
              <FileText
                size={docSize}
                color={OB1.DIM}
                strokeWidth={2}
              />
            </div>

            {/* Middle document (dim) */}
            <div
              style={{
                position: "absolute",
                left: stackOffset,
                top: stackOffset,
                opacity: ease(sceneFrame, 35, 55) * 0.5,
                zIndex: 0,
              }}
            >
              <FileText
                size={docSize}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>

            {/* Top document (bright, pops) */}
            <div
              style={{
                position: "absolute",
                left: stackOffset * 2,
                top: 0,
                ...bouncePop(sceneFrame, 50, fps),
                zIndex: 1,
              }}
            >
              <FileText
                size={docSize}
                color={OB1.GREEN}
                strokeWidth={2.5}
              />
            </div>

            {/* Check badge */}
            <div
              style={{
                position: "absolute",
                right: -Math.round(8 * zone.scale),
                top: -Math.round(8 * zone.scale),
                ...bouncePop(sceneFrame, 90, fps),
                zIndex: 10,
              }}
            >
              <CheckCircle2
                size={badgeSize}
                color={OB1.ORANGE}
                strokeWidth={2.5}
                fill={OB1.BG_DARK}
              />
            </div>
          </div>

          {/* Main label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 150, 25),
              fontSize: Math.round(64 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              zIndex: 10,
              position: "relative",
            }}
          >
            ARTIFACT LAYER
          </div>

          {/* Subtitle */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 165, 25),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              whiteSpace: "nowrap",
              zIndex: 10,
              position: "relative",
            }}
          >
            DEMONSTRATED CAPABILITY
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for BYOC-009-company-In-fact-620-040
    // FOCAL: Before/after comparison — "Don't copy strategy" (FileText with X) vs "Build strategy" (CheckCircle2)
    // SUPPORTING (2):
    //   1. Left side: FileText icon (64px) with red X overlay, label "DON'T COPY"
    //   2. Right side: TrendingUp icon (64px) with green check, label "BUILD IT"
    // TEXT ON SCREEN:
    //   - "DON'T COPY" (56px, left side) — 10 chars
    //   - "BUILD IT" (56px, right side) — 8 chars
    //   - "HIRING INSIGHT" (60px, top center) — 14 chars
    //   Total visible: 32 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: "HIRING INSIGHT" label appears
    //   - 1.5-3s: Left side (don't copy) fades in
    //   - 3-4.5s: Right side (build) fades in
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 3 groups (within 4 max) ✓
    // PHONE TEST: All text 56-60px, icons 64px ✓
    id: "BYOC-009-company-In-fact-620-040",
    title: "Hiring Test",
    subtitle: "Show capability",
    bottomLabel: "Candidates must demonstrate they can build strategy, not copy it",
    bottomAccent: "build strategy",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(64 * zone.scale);
      const spacing = zone.width * 0.28;
      const centerX = zone.width / 2;
      const centerY = zone.height / 2 + Math.round(20 * zone.scale);

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
          {/* Top label */}
          <div
            style={{
              position: "absolute",
              top: centerY - Math.round(180 * zone.scale),
              ...fadeInUp(sceneFrame, 10, 25),
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              HIRING INSIGHT
            </div>
          </div>

          {/* Left side - DON'T COPY */}
          <div
            style={{
              position: "absolute",
              left: centerX - spacing - Math.round(100 * zone.scale),
              top: centerY - Math.round(60 * zone.scale),
              ...fadeInUp(sceneFrame, 45, 30),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
              }}
            >
              {/* Icon with X overlay */}
              <div style={{ position: "relative" }}>
                <FileText
                  size={iconSize}
                  color={OB1.DIM}
                  strokeWidth={2}
                />
                {/* Red X overlay */}
                <svg
                  width={iconSize}
                  height={iconSize}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                >
                  <line
                    x1={iconSize * 0.2}
                    y1={iconSize * 0.2}
                    x2={iconSize * 0.8}
                    y2={iconSize * 0.8}
                    stroke={OB1.RED}
                    strokeWidth={Math.round(4 * zone.scale)}
                  />
                  <line
                    x1={iconSize * 0.8}
                    y1={iconSize * 0.2}
                    x2={iconSize * 0.2}
                    y2={iconSize * 0.8}
                    stroke={OB1.RED}
                    strokeWidth={Math.round(4 * zone.scale)}
                  />
                </svg>
              </div>

              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                DON'T COPY
              </div>
            </div>
          </div>

          {/* Separator arrow */}
          <div
            style={{
              position: "absolute",
              left: centerX - Math.round(32 * zone.scale),
              top: centerY - Math.round(20 * zone.scale),
              opacity: ease(sceneFrame, 75, 90),
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2}
            />
          </div>

          {/* Right side - BUILD */}
          <div
            style={{
              position: "absolute",
              left: centerX + spacing - Math.round(80 * zone.scale),
              top: centerY - Math.round(60 * zone.scale),
              ...fadeInUp(sceneFrame, 90, 30),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
              }}
            >
              {/* Icon with check */}
              <div style={{ position: "relative" }}>
                <TrendingUp
                  size={iconSize}
                  color={OB1.GREEN}
                  strokeWidth={2.5}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -Math.round(8 * zone.scale),
                    right: -Math.round(8 * zone.scale),
                    zIndex: 1,
                  }}
                >
                  <CheckCircle2
                    size={Math.round(32 * zone.scale)}
                    color={OB1.GREEN}
                    strokeWidth={2.5}
                    fill={OB1.BG_DARK}
                  />
                </div>
              </div>

              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                BUILD IT
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

export const BYOC_CLIPS_C = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

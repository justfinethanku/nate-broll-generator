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
  Type,
  Palette,
  Grid3x3,
  Box,
  Globe,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  FileStack,
  LucideIcon,
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
    // DESIGN SPEC for CD-004-ExtractedFromYour
    // FOCAL: Central Claude logo (140px) with 4 design token type icons radiating around it in a circle
    // SUPPORTING (3): Typography (Type icon), Colors (Palette icon), Spacing (Grid icon), Components (Box icon)
    // TEXT ON SCREEN:
    //   - "Typography" (48px) — 10 chars
    //   - "Colors" (48px) — 6 chars
    //   - "Spacing" (48px) — 7 chars
    //   - "Components" (48px) — 10 chars
    //   Total visible: 33 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Claude logo fades in center
    //   - 1-3s: Each design token fades in sequentially (staggered)
    //   - 3-7s: Gentle pulse on all elements
    // LOGOS: claude.svg
    // ELEMENT COUNT: 4 design tokens around 1 center logo ✓
    // PHONE TEST: All text 48px, logo 140px, icons 64px ✓
    id: "CD-004-ExtractedFromYour",
    title: "Design System Extraction",
    subtitle: "From any source",
    bottomLabel: "Claude analyzes and extracts typography, colors, spacing, and components",
    bottomAccent: "extracts",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const tokens = [
        { label: "Typography", icon: Type, angle: 0, delay: 30 },
        { label: "Colors", icon: Palette, angle: 90, delay: 40 },
        { label: "Spacing", icon: Grid3x3, angle: 180, delay: 50 },
        { label: "Components", icon: Box, angle: 270, delay: 60 },
      ];

      const radius = Math.min(zone.width, zone.height) * 0.35;

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
          {/* Decorative ring */}
          <div
            style={{
              position: "absolute",
              width: radius * 2.2,
              height: radius * 2.2,
              borderRadius: "50%",
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}`,
              opacity: ease(sceneFrame, 20, 40) * 0.3,
              zIndex: 0,
            }}
          />

          {/* Center Claude logo */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              position: "absolute",
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile("logos/claude.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Design tokens in circle */}
          {tokens.map((token) => {
            const angleRad = (token.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            const Icon = token.icon;
            const opacity = ease(sceneFrame, token.delay, token.delay + 20);
            const pulseVal = pulse(sceneFrame - token.delay, 0.04);

            return (
              <div
                key={token.label}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(12 * zone.scale),
                  opacity: opacity,
                }}
              >
                {/* Icon container */}
                <div
                  style={{
                    width: Math.round(120 * zone.scale),
                    height: Math.round(120 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.8 + pulseVal * 0.2,
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={Math.round(64 * zone.scale)}
                    color={OB1.ORANGE}
                  />
                </div>

                {/* Label */}
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
                  {token.label}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-005-DesignsWebCapture
    // FOCAL: 3-stage horizontal workflow with arrows between stages
    // SUPPORTING (2): Stage 1 (Globe + Competitor), Stage 2 (Claude + Reskin), Stage 3 (Sparkles + Prototype)
    // TEXT ON SCREEN:
    //   - "Competitor" (48px) — 10 chars
    //   - "Reskin" (48px) — 6 chars
    //   - "Prototype" (48px) — 9 chars
    //   Total visible: 25 chars ✓
    // PHASES:
    //   - 0-1.5s: Stage 1 fades in
    //   - 1.5-3s: Arrow draws, Stage 2 fades in
    //   - 3-4.5s: Second arrow draws, Stage 3 fades in
    //   - 4.5-7s: Hold with gentle glow
    // LOGOS: claude.svg
    // ELEMENT COUNT: 3 stages (within 4 max) ✓
    // PHONE TEST: All text 48px, logos/icons 120px ✓
    id: "CD-005-DesignsWebCapture",
    title: "Web Capture Reskin",
    subtitle: "Instant brand transformation",
    bottomLabel: "Screenshot any competitor site and Claude reskins it to match your brand",
    bottomAccent: "reskins",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      type StageType =
        | { label: string; icon: LucideIcon; color: string; delay: number; isLogo: false }
        | { label: string; logo: string; color: string; delay: number; isLogo: true };

      const stages: StageType[] = [
        {
          label: "Competitor",
          icon: Globe,
          color: OB1.STEEL,
          delay: 10,
          isLogo: false,
        },
        {
          label: "Reskin",
          logo: "claude.svg",
          color: OB1.ORANGE,
          delay: 50,
          isLogo: true,
        },
        {
          label: "Prototype",
          icon: Sparkles,
          color: OB1.GREEN,
          delay: 90,
          isLogo: false,
        },
      ];

      const stageWidth = zone.width * 0.22;
      const gap = zone.width * 0.12;
      const totalWidth = stageWidth * 3 + gap * 2;
      const startX = (zone.width - totalWidth) / 2;

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
          {/* Stages */}
          {stages.map((stage, i) => {
            const x = startX + i * (stageWidth + gap);
            const opacity = ease(sceneFrame, stage.delay, stage.delay + 20);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(16 * zone.scale),
                  opacity: opacity,
                }}
              >
                {/* Icon/Logo container */}
                <div
                  style={{
                    width: Math.round(160 * zone.scale),
                    height: Math.round(160 * zone.scale),
                    borderRadius: Math.round(12 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${stage.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  {stage.isLogo ? (
                    <Img
                      src={staticFile(`logos/${stage.logo}`)}
                      style={{
                        width: Math.round(120 * zone.scale),
                        height: Math.round(120 * zone.scale),
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  ) : (
                    React.createElement(stage.icon, {
                      size: Math.round(80 * zone.scale),
                      color: stage.color,
                    })
                  )}
                </div>

                {/* Label */}
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
                  {stage.label}
                </div>
              </div>
            );
          })}

          {/* Arrows */}
          {[0, 1].map((arrowIdx) => {
            const arrowDelay = arrowIdx === 0 ? 45 : 85;
            const arrowProgress = ease(sceneFrame, arrowDelay, arrowDelay + 15);
            const arrowX =
              startX + stageWidth + arrowIdx * (stageWidth + gap);
            const arrowWidth = gap * 0.7;

            return (
              <svg
                key={arrowIdx}
                style={{
                  position: "absolute",
                  left: arrowX,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: arrowWidth,
                  height: Math.round(60 * zone.scale),
                  zIndex: 0,
                }}
              >
                <defs>
                  <marker
                    id={`arrowhead-${arrowIdx}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill={OB1.CYAN}
                      opacity={arrowProgress}
                    />
                  </marker>
                </defs>
                <line
                  x1="0"
                  y1={Math.round(30 * zone.scale)}
                  x2={arrowWidth * arrowProgress}
                  y2={Math.round(30 * zone.scale)}
                  stroke={OB1.CYAN}
                  strokeWidth={Math.round(3 * zone.scale)}
                  markerEnd={`url(#arrowhead-${arrowIdx})`}
                  opacity={arrowProgress}
                />
              </svg>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-006-UsableThatClaude
    // FOCAL: Two contrasting stacks - left: tall pile of papers (old backlog), right: single shining prototype card
    // SUPPORTING (1): Large red X over left stack, green checkmark over right card
    // TEXT ON SCREEN:
    //   - "Feature Backlog" (48px) — 15 chars
    //   - "Live Prototype" (48px) — 14 chars
    //   Total visible: 29 chars ✓
    // PHASES:
    //   - 0-1.5s: Left stack builds up (stacked rectangles fade in)
    //   - 1.5-3s: Red X appears over left
    //   - 3-4.5s: Right prototype card pops in with glow
    //   - 4.5-6s: Green checkmark appears over right
    //   - 6-7s: Hold
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 2 groups (backlog vs prototype) ✓
    // PHONE TEST: All text 48px, icons 80px ✓
    id: "CD-006-UsableThatClaude",
    title: "Rapid Prototyping",
    subtitle: "Replacing backlogs",
    bottomLabel: "Build working prototypes instantly instead of queuing feature requests",
    bottomAccent: "instantly",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftX = zone.width * 0.25;
      const rightX = zone.width * 0.75;

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
          {/* Left: Backlog stack */}
          <div
            style={{
              position: "absolute",
              left: leftX,
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            {/* Stacked papers */}
            <div style={{ position: "relative" }}>
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const stackDelay = 10 + idx * 5;
                const stackOpacity = ease(
                  sceneFrame,
                  stackDelay,
                  stackDelay + 10
                );
                const yOffset = -idx * Math.round(8 * zone.scale);

                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, calc(-50% + ${yOffset}px))`,
                      width: Math.round(200 * zone.scale),
                      height: Math.round(240 * zone.scale),
                      backgroundColor: OB1.BG_MID,
                      border: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
                      borderRadius: Math.round(8 * zone.scale),
                      opacity: stackOpacity * 0.6,
                      zIndex: 1,
                    }}
                  >
                    {/* Paper lines decoration */}
                    {[0, 1, 2].map((lineIdx) => (
                      <div
                        key={lineIdx}
                        style={{
                          position: "absolute",
                          top: Math.round((40 + lineIdx * 30) * zone.scale),
                          left: Math.round(20 * zone.scale),
                          width: Math.round(160 * zone.scale),
                          height: Math.round(2 * zone.scale),
                          backgroundColor: OB1.DIM,
                          opacity: 0.4,
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Red X - nested for positioning + animation */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div style={{ ...fadeInUp(sceneFrame, 50), zIndex: 10, position: "relative" }}>
                <X size={Math.round(120 * zone.scale)} color={OB1.RED} />
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                marginTop: Math.round(160 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Feature Backlog
            </div>
          </div>

          {/* Right: Live Prototype */}
          <div
            style={{
              position: "absolute",
              left: rightX,
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            {/* Glowing card */}
            <div
              style={{
                position: "relative",
                ...bouncePop(sceneFrame, 90, fps),
              }}
            >
              {/* Glow effect */}
              <div
                style={{
                  position: "absolute",
                  width: Math.round(240 * zone.scale),
                  height: Math.round(280 * zone.scale),
                  borderRadius: Math.round(12 * zone.scale),
                  backgroundColor: OB1.GREEN,
                  opacity: pulse(sceneFrame - 90, 0.03) * 0.3,
                  filter: `blur(${Math.round(20 * zone.scale)}px)`,
                  zIndex: 0,
                }}
              />

              {/* Card */}
              <div
                style={{
                  position: "relative",
                  width: Math.round(200 * zone.scale),
                  height: Math.round(240 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  borderRadius: Math.round(12 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Sparkles
                  size={Math.round(80 * zone.scale)}
                  color={OB1.GREEN}
                />
              </div>
            </div>

            {/* Green check - nested for positioning + animation */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div style={{ ...fadeInUp(sceneFrame, 140), zIndex: 10, position: "relative" }}>
                <CheckCircle2
                  size={Math.round(120 * zone.scale)}
                  color={OB1.GREEN}
                />
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                marginTop: Math.round(160 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Live Prototype
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

export const CD_CLIPS_B = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

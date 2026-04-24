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
  Brain,
  Target,
  XCircle,
  BarChart3,
  DollarSign,
  Users,
  ArrowRight,
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
    // DESIGN SPEC for OP-007-WithNoGuidance (REVISED)
    // FOCAL: Three-stage horizontal pipeline: "Raw Task" box → arrow → "Model" (brain icon) → arrow → "Result" (target icon)
    // SUPPORTING (1): Large "NO GUIDANCE" label with prohibition icon BELOW the pipeline
    // TEXT ON SCREEN:
    //   - "Raw Task" (48px) — 8 chars
    //   - "Model" (48px) — 5 chars
    //   - "Result" (48px) — 6 chars
    //   - "NO GUIDANCE" (72px, red emphasis) — 11 chars
    //   Total visible: 32 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Raw Task box fades in
    //   - 1-2s: Arrow draws, Model stage appears
    //   - 2-3.5s: Second arrow draws, Result stage appears
    //   - 3.5-5s: "NO GUIDANCE" label pops in with prohibition icon
    //   - 5-7s: Hold
    // ELEMENT COUNT: 3 stages + 1 label = 4 elements ✓
    // PHONE TEST: All text 48-72px ✓
    // REVISION: Moved NO GUIDANCE below pipeline, reduced stage widths to 0.18, reduced gaps to 0.05
    id: "OP-007-WithNoGuidance",
    title: "Hex's Eval Method",
    subtitle: "Raw performance testing",
    bottomLabel: "Zero-guidance evaluation: real-world tasks with no hints",
    bottomAccent: "Zero-guidance",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stageWidth = zone.width * 0.18;
      const stageHeight = zone.height * 0.3;
      const gap = zone.width * 0.05;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.height * 0.1,
          }}
        >
          {/* Pipeline row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: gap,
            }}
          >
            {/* Stage 1: Raw Task */}
            <div style={{ ...fadeInUp(sceneFrame, 0) }}>
              <div
                style={{
                  width: stageWidth,
                  height: stageHeight,
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(8 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(16 * zone.scale),
                  zIndex: 1,
                }}
              >
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
                  Raw Task
                </div>
              </div>
            </div>

            {/* Arrow 1 */}
            <div style={{ ...slideIn(sceneFrame, 30, 20, "left", 30) }}>
              <ArrowRight
                size={Math.round(56 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
                style={{ zIndex: 0 }}
              />
            </div>

            {/* Stage 2: Model */}
            <div style={{ ...fadeInUp(sceneFrame, 60) }}>
              <div
                style={{
                  width: stageWidth,
                  height: stageHeight,
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(8 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(12 * zone.scale),
                  zIndex: 1,
                }}
              >
                <Brain
                  size={Math.round(56 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
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
                  Model
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{ ...slideIn(sceneFrame, 90, 20, "left", 30) }}>
              <ArrowRight
                size={Math.round(56 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
                style={{ zIndex: 0 }}
              />
            </div>

            {/* Stage 3: Result */}
            <div style={{ ...fadeInUp(sceneFrame, 120) }}>
              <div
                style={{
                  width: stageWidth,
                  height: stageHeight,
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(8 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(12 * zone.scale),
                  zIndex: 1,
                }}
              >
                <Target
                  size={Math.round(56 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
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
                  Result
                </div>
              </div>
            </div>
          </div>

          {/* NO GUIDANCE callout below pipeline */}
          <div
            style={{
              ...bouncePop(sceneFrame, 150, fps),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            <XCircle
              size={Math.round(80 * zone.scale)}
              color={OB1.RED}
              strokeWidth={3}
              fill={OB1.BG_DARK}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                letterSpacing: "0.05em",
                zIndex: 10,
                position: "relative",
              }}
            >
              NO GUIDANCE
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-008-IHaventSeen
    // FOCAL: Three company logos in a row (Anthropic, OpenAI, Google) at 140px each
    // SUPPORTING (1): Anthropic logo elevated with orange glow ring, others dimmed
    // TEXT ON SCREEN:
    //   - "Anthropic" (60px, below logo) — 9 chars
    //   - "OpenAI" (48px, dimmed) — 6 chars
    //   - "Google" (48px, dimmed) — 6 chars
    //   Total visible: 21 chars ✓
    // PHASES:
    //   - 0-1.5s: All three logos fade in at equal brightness
    //   - 1.5-3s: Anthropic elevates slightly, others dim
    //   - 3-4.5s: Orange glow ring pulses around Anthropic
    //   - 4.5-7s: Hold with pulse
    // LOGOS: anthropic.svg, openai.svg, google.svg
    // ELEMENT COUNT: 3 logos (within 4 max) ✓
    // PHONE TEST: All logos 140px, labels 48-60px ✓
    id: "OP-008-IHaventSeen",
    title: "Frontier Landscape",
    subtitle: "Model comparison",
    bottomLabel: "Opus 4.7 stands above the competition",
    bottomAccent: "stands above",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const logoSize = Math.round(140 * zone.scale);
      const gap = zone.width * 0.12;
      const elevateStart = 45;
      const glowStart = 90;

      const elevateProgress = ease(sceneFrame, elevateStart, elevateStart + 30);
      const glowPulse = pulse(sceneFrame - glowStart, 0.04);
      const glowOpacity = ease(sceneFrame, glowStart, glowStart + 20) * (0.4 + glowPulse * 0.3);

      const anthropicY = -elevateProgress * zone.height * 0.08;
      const othersOpacity = 1 - elevateProgress * 0.5;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: gap,
            }}
          >
            {/* OpenAI */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 0),
                opacity: fadeInUp(sceneFrame, 0).opacity * othersOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                  filter: "brightness(0) invert(1)",
                }}
              />
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
                OpenAI
              </div>
            </div>

            {/* Anthropic (elevated) */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 15),
                transform: `translateY(${anthropicY}px) ${fadeInUp(sceneFrame, 15).transform}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                position: "relative",
              }}
            >
              {/* Glow ring */}
              <div
                style={{
                  position: "absolute",
                  width: logoSize * 1.4,
                  height: logoSize * 1.4,
                  borderRadius: "50%",
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                  opacity: glowOpacity,
                  top: -logoSize * 0.2,
                  zIndex: 0,
                }}
              />
              <Img
                src={staticFile("logos/anthropic.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                  position: "relative",
                }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Anthropic
              </div>
            </div>

            {/* Google */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 30),
                opacity: fadeInUp(sceneFrame, 30).opacity * othersOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <Img
                src={staticFile("logos/google.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                  filter: "brightness(0) invert(1)",
                }}
              />
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
                Google
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-009-CustomersItActually
    // FOCAL: Two-column comparison: left column "Benchmarks" (chart icon + percentage), right column "Business Value" (dollar sign + people icons)
    // SUPPORTING (1): Large arrow between columns showing transformation
    // TEXT ON SCREEN:
    //   - "Benchmarks" (60px) — 10 chars
    //   - "95%" (80px) — 3 chars
    //   - "Business Value" (60px) — 14 chars
    //   - "$" (80px) — 1 char
    //   Total visible: 28 chars ✓
    // PHASES:
    //   - 0-1.5s: Left column (Benchmarks) fades in
    //   - 1.5-3s: Arrow draws from left to right
    //   - 3-4.5s: Right column (Business Value) fades in
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 2 columns + 1 arrow = 3 elements ✓
    // PHONE TEST: All text 60-80px ✓
    id: "OP-009-CustomersItActually",
    title: "Real Impact",
    subtitle: "Beyond benchmarks",
    bottomLabel: "Benchmark scores mean nothing without business results",
    bottomAccent: "business results",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const colWidth = zone.width * 0.32;
      const colHeight = zone.height * 0.55;
      const gap = zone.width * 0.12;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: gap,
          }}
        >
          {/* Left column: Benchmarks */}
          <div style={{ ...fadeInUp(sceneFrame, 0) }}>
            <div
              style={{
                width: colWidth,
                height: colHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(8 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.DIM}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                zIndex: 1,
              }}
            >
              <BarChart3
                size={Math.round(96 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.STEEL,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                95%
              </div>
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Benchmarks
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ ...slideIn(sceneFrame, 45, 30, "left", 40) }}>
            <ArrowRight
              size={Math.round(80 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* Right column: Business Value */}
          <div style={{ ...fadeInUp(sceneFrame, 90) }}>
            <div
              style={{
                width: colWidth,
                height: colHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(8 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: Math.round(16 * zone.scale),
                  alignItems: "center",
                }}
              >
                <DollarSign
                  size={Math.round(80 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={3}
                  style={{ zIndex: 1 }}
                />
                <Users
                  size={Math.round(80 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Business Value
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

export const OP_CLIPS_C = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

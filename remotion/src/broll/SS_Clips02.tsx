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
  DollarSign,
  ArrowRight,
  Megaphone,
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
    // DESIGN SPEC for SS-004-TheArrow
    // FOCAL: Large arrow pointing from left to right, spanning 60% of zone width
    // SUPPORTING (2):
    //   1. Left side: "Training Data" label with stacked disk icons (database concept)
    //   2. Right side: "Inference Cost" label with dollar sign icon
    // TEXT ON SCREEN:
    //   - "Training Data" (48px) — 13 chars
    //   - "Inference Cost" (48px) — 14 chars
    //   - "per revenue unit" (40px, under right side) — 16 chars
    //   Total visible: 43 chars ✓
    // PHASES:
    //   - 0-1.5s: Left side (disk stack) fades in
    //   - 1.5-3.5s: Arrow draws from left to right
    //   - 3.5-5s: Right side (dollar icon + labels) fades in
    //   - 5-7s: Hold
    // ICONS: Database from lucide-react, DollarSign from lucide-react
    // ELEMENT COUNT: 3 groups (left, arrow, right) — within 4 max ✓
    // PHONE TEST: All text ≥40px ✓
    id: "SS-004-TheArrow",
    title: "The Shift",
    subtitle: "Training → Inference",
    bottomLabel: "Serving costs now dominate the economics",
    bottomAccent: "costs now dominate",
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
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Left side: Training Data with disk stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              ...fadeInUp(sceneFrame, 0),
            }}
          >
            {/* Stacked database icons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(8 * zone.scale),
                position: "relative",
                zIndex: 1,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 10, 8)),
                  }}
                >
                  <Database
                    size={Math.round(64 * zone.scale)}
                    color={OB1.CYAN}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                position: "relative",
                zIndex: 10,
              }}
            >
              Training Data
            </div>
          </div>

          {/* Center: Arrow */}
          <div
            style={{
              position: "relative",
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(160 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
              style={{
                opacity: ease(sceneFrame, 45, 75),
                transform: `scaleX(${ease(sceneFrame, 45, 75)})`,
              }}
            />
          </div>

          {/* Right side: Inference Cost with dollar icon */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              ...fadeInUp(sceneFrame, 105),
            }}
          >
            {/* Dollar icon in circle */}
            <div
              style={{
                width: Math.round(160 * zone.scale),
                height: Math.round(160 * zone.scale),
                borderRadius: "50%",
                backgroundColor: `${OB1.RED}20`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <DollarSign
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
              />
            </div>

            {/* Labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(8 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Inference Cost
              </div>
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 400,
                  color: OB1.DIM,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                per revenue unit
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for SS-005-InferenceCosts
    // FOCAL: Three vertical bars showing relative cost levels (unlabeled Y-axis, qualitative)
    // SUPPORTING (3): Provider logos above each bar (OpenAI, Anthropic, Google)
    // TEXT ON SCREEN:
    //   - "OpenAI" (48px) — 6 chars
    //   - "Anthropic" (48px) — 9 chars
    //   - "Google" (48px) — 6 chars
    //   - "Higher" (40px, top right axis label) — 6 chars
    //   - "Lower" (40px, bottom right axis label) — 5 chars
    //   Total visible: 32 chars ✓
    // PHASES:
    //   - 0-1s: Logos fade in
    //   - 1-3s: Bars grow from bottom (staggered by 0.3s each)
    //   - 3-7s: Hold
    // LOGOS: openai.svg, anthropic.svg, google.svg
    // ELEMENT COUNT: 3 provider groups (within 4 max) ✓
    // PHONE TEST: All text ≥40px, logos 120px ✓
    // NOTE: No specific cost numbers — relative bar heights only
    id: "SS-005-InferenceCosts",
    title: "Serving Efficiency",
    subtitle: "Video model inference costs",
    bottomLabel: "Cost per query varies wildly across providers",
    bottomAccent: "varies wildly",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const providers = [
        { name: "OpenAI", logo: "openai.svg", level: 0.85, color: OB1.RED, delay: 40 },
        { name: "Anthropic", logo: "anthropic.svg", level: 0.55, color: OB1.AMBER, delay: 50 },
        { name: "Google", logo: "google.svg", level: 0.35, color: OB1.GREEN, delay: 60 },
      ];

      const maxBarHeight = zone.height * 0.45;

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
          {/* Axis labels on right */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: zone.height * 0.15,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: maxBarHeight,
              opacity: ease(sceneFrame, 20, 40),
            }}
          >
            <div
              style={{
                fontSize: Math.round(40 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.DIM,
                position: "relative",
                zIndex: 10,
              }}
            >
              Higher
            </div>
            <div
              style={{
                fontSize: Math.round(40 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.DIM,
                position: "relative",
                zIndex: 10,
              }}
            >
              Lower
            </div>
          </div>

          {/* Provider bars */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.08,
              alignItems: "flex-end",
            }}
          >
            {providers.map((provider) => {
              const barHeight = ease(sceneFrame, provider.delay, provider.delay + 40) * (maxBarHeight * provider.level);

              return (
                <div
                  key={provider.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(24 * zone.scale),
                  }}
                >
                  {/* Logo */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, 10),
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Img
                      src={staticFile(`logos/${provider.logo}`)}
                      style={{
                        width: Math.round(120 * zone.scale),
                        height: Math.round(120 * zone.scale),
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </div>

                  {/* Bar */}
                  <div
                    style={{
                      width: zone.width * 0.15,
                      height: barHeight,
                      backgroundColor: provider.color,
                      borderRadius: Math.round(8 * zone.scale),
                      position: "relative",
                      zIndex: 1,
                    }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      opacity: ease(sceneFrame, provider.delay + 30, provider.delay + 45),
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {provider.name}
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
    // DESIGN SPEC for SS-006-AdPerformance
    // FOCAL: Two bars side-by-side showing conversion comparison
    // SUPPORTING (2):
    //   1. Generic ad platform icon at top center (no Criteo logo available)
    //   2. ChatGPT logo (openai.svg) positioned near the taller bar
    // TEXT ON SCREEN:
    //   - "Ad Platform" (48px, top) — 11 chars
    //   - "Baseline" (48px, under left bar) — 8 chars
    //   - "ChatGPT Pilot" (48px, under right bar) — 13 chars
    //   - "1.5x" (80px, above right bar) — 3 chars
    //   Total visible: 35 chars ✓
    // PHASES:
    //   - 0-1s: Platform icon + label fade in at top
    //   - 1-2.5s: Baseline bar grows
    //   - 2.5-4.5s: ChatGPT bar grows (1.5x height)
    //   - 4.5-5.5s: "1.5x" callout pops in
    //   - 5.5-7s: Hold
    // LOGOS: openai.svg for ChatGPT
    // ELEMENT COUNT: 4 elements (platform icon + 2 bars + chatgpt logo) — at 4 max ✓
    // PHONE TEST: All text ≥40px, stat number 80px, logos 96px ✓
    id: "SS-006-AdPerformance",
    title: "Ad Performance",
    subtitle: "ChatGPT pilot results",
    bottomLabel: "1.5x conversion lift vs baseline",
    bottomAccent: "1.5x",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const baseHeight = zone.height * 0.3;
      const chatgptHeight = baseHeight * 1.5;

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
          {/* Top: Platform indicator */}
          <div
            style={{
              position: "absolute",
              top: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              ...fadeInUp(sceneFrame, 0),
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <Megaphone
                size={Math.round(96 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                position: "relative",
                zIndex: 10,
              }}
            >
              Ad Platform
            </div>
          </div>

          {/* Center: Comparison bars */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.12,
              alignItems: "flex-end",
              marginTop: zone.height * 0.25,
            }}
          >
            {/* Baseline bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: zone.width * 0.2,
                  height: ease(sceneFrame, 30, 75) * baseHeight,
                  backgroundColor: OB1.STEEL,
                  borderRadius: Math.round(8 * zone.scale),
                  position: "relative",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 60, 75),
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Baseline
              </div>
            </div>

            {/* ChatGPT bar with logo and callout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
                position: "relative",
              }}
            >
              {/* 1.5x callout above bar */}
              <div
                style={{
                  position: "absolute",
                  top: -Math.round(120 * zone.scale),
                  ...bouncePop(sceneFrame, 135, fps),
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    fontSize: Math.round(80 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 800,
                    color: OB1.GREEN,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  1.5x
                </div>
              </div>

              {/* ChatGPT logo on bar */}
              <div
                style={{
                  position: "absolute",
                  top: -Math.round((chatgptHeight * ease(sceneFrame, 90, 135)) * 0.5 + 48 * zone.scale),
                  opacity: ease(sceneFrame, 100, 120),
                  zIndex: 1,
                }}
              >
                <Img
                  src={staticFile("logos/openai.svg")}
                  style={{
                    width: Math.round(96 * zone.scale),
                    height: Math.round(96 * zone.scale),
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </div>

              {/* Bar */}
              <div
                style={{
                  width: zone.width * 0.2,
                  height: ease(sceneFrame, 90, 135) * chatgptHeight,
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(8 * zone.scale),
                  position: "relative",
                  zIndex: 1,
                }}
              />

              {/* Label */}
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 120, 135),
                  position: "relative",
                  zIndex: 10,
                }}
              >
                ChatGPT Pilot
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

export const SS_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

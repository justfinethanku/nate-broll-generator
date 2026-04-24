import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  stagger,
} from "./shared";
import {
  CheckCircle2,
  Shield,
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
    // DESIGN SPEC for SS-016-StrategyForLarge
    // FOCAL: Decision matrix with 3 evaluation criteria as vertical rows (each 140h), left side has criteria labels, right side has weighted importance bars
    // SUPPORTING (3):
    //   1. Anthropic logo (140px) in top-right corner as example vendor
    //   2. OpenAI logo (140px) in mid-right corner as competing vendor
    //   3. "Decision Framework" title at top (60px)
    // TEXT ON SCREEN:
    //   - "Decision Framework" (60px, top) — 18 chars
    //   - "Enterprise Fit" (48px, row 1) — 14 chars
    //   - "Support SLA" (48px, row 2) — 11 chars
    //   - "Integration" (48px, row 3) — 11 chars
    //   Total visible: 54 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Title fades in
    //   - 1.5-3s: Three criteria labels appear staggered
    //   - 3-4.5s: Importance bars grow from left (ORANGE, CYAN, GREEN)
    //   - 4.5-6s: Vendor logos appear top-right
    //   - 6-7s: Hold
    // LOGOS: anthropic.svg, openai.svg
    // ELEMENT COUNT: 4 (title + 3 criteria rows = 4) ✓
    // PHONE TEST: All text 48-60px, all logos 140px ✓
    id: "SS-016-StrategyForLarge",
    title: "Enterprise Selection",
    subtitle: "Decision framework",
    bottomLabel: "Strategic fit matters more than features",
    bottomAccent: "Strategic fit",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const criteria = [
        { label: "Enterprise Fit", weight: 0.9, color: OB1.ORANGE, icon: CheckCircle2 },
        { label: "Support SLA", weight: 0.75, color: OB1.CYAN, icon: Shield },
        { label: "Integration", weight: 0.65, color: OB1.GREEN, icon: Zap },
      ];

      const rowHeight = Math.round(140 * zone.scale);
      const rowGap = zone.height * 0.08;
      const totalHeight = criteria.length * rowHeight + (criteria.length - 1) * rowGap;

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
          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              position: "relative",
              zIndex: 10,
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.08,
            }}
          >
            Decision Framework
          </div>

          {/* Criteria rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: rowGap,
              width: zone.width * 0.85,
            }}
          >
            {criteria.map((criterion, i) => {
              const delay = stagger(i, 45, 15);
              const barDelay = delay + 30;
              const barWidth = ease(sceneFrame, barDelay, barDelay + 30) * (zone.width * 0.5 * criterion.weight);
              const Icon = criterion.icon;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: zone.width * 0.04,
                    opacity: ease(sceneFrame, delay, delay + 20),
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: Math.round(64 * zone.scale),
                      height: Math.round(64 * zone.scale),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={Math.round(64 * zone.scale)}
                      color={criterion.color}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 10,
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      minWidth: zone.width * 0.25,
                    }}
                  >
                    {criterion.label}
                  </div>

                  {/* Importance bar */}
                  <div
                    style={{
                      height: Math.round(32 * zone.scale),
                      width: barWidth,
                      backgroundColor: criterion.color,
                      borderRadius: Math.round(8 * zone.scale),
                      zIndex: 0,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Vendor logos - top right corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              gap: zone.height * 0.06,
              opacity: ease(sceneFrame, 135, 155),
            }}
          >
            <Img
              src={staticFile("logos/anthropic.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
                zIndex: 1,
              }}
            />
            <Img
              src={staticFile("logos/openai.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
                zIndex: 1,
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for SS-017-ThemToHave
    // FOCAL: Two columns side-by-side comparison with Anthropic (left) and OpenAI (right), each column has logo at top (140px) and 2 strategy attributes below
    // SUPPORTING (2):
    //   1. Left column: "Enterprise First" + "Safety Brand" labels (48px each)
    //   2. Right column: "Consumer Scale" + "API Ecosystem" labels (48px each)
    // TEXT ON SCREEN:
    //   - "Anthropic" (60px implied via logo) — 9 chars
    //   - "Enterprise First" (48px) — 16 chars
    //   - "Safety Brand" (48px) — 12 chars
    //   - "OpenAI" (60px implied via logo) — 6 chars
    //   - "Consumer Scale" (48px) — 14 chars
    //   - "API Ecosystem" (48px) — 13 chars
    //   Total visible: 70 chars (under 90) ✓
    // PHASES:
    //   - 0-1s: Left column (Anthropic) fades in
    //   - 1-2.5s: Left strategy labels appear
    //   - 2.5-3.5s: Right column (OpenAI) fades in
    //   - 3.5-5s: Right strategy labels appear
    //   - 5-7s: Hold
    // LOGOS: anthropic.svg, openai.svg
    // ELEMENT COUNT: 2 columns (each treated as 1 group) ✓
    // PHONE TEST: All text 48-60px, all logos 140px ✓
    id: "SS-017-ThemToHave",
    title: "Go-to-Market",
    subtitle: "Competitive strategies",
    bottomLabel: "Different paths to the same market",
    bottomAccent: "Different paths",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const competitors = [
        {
          logo: "anthropic",
          strategies: ["Enterprise First", "Safety Brand"],
          color: OB1.ORANGE,
          delay: 0,
        },
        {
          logo: "openai",
          strategies: ["Consumer Scale", "API Ecosystem"],
          color: OB1.CYAN,
          delay: 75,
        },
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
            position: "relative",
          }}
        >
          {competitors.map((comp, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: zone.height * 0.06,
                opacity: ease(sceneFrame, comp.delay, comp.delay + 30),
              }}
            >
              {/* Logo */}
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${comp.color}20`,
                  borderRadius: Math.round(20 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px solid ${comp.color}`,
                  padding: Math.round(20 * zone.scale),
                  boxSizing: "border-box",
                  zIndex: 1,
                }}
              >
                <Img
                  src={staticFile(`logos/${comp.logo}.svg`)}
                  style={{
                    width: Math.round(96 * zone.scale),
                    height: Math.round(96 * zone.scale),
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </div>

              {/* Strategy labels */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: zone.height * 0.04,
                  alignItems: "center",
                }}
              >
                {comp.strategies.map((strategy, i) => (
                  <div
                    key={i}
                    style={{
                      ...fadeInUp(sceneFrame, comp.delay + 30 + stagger(i, 0, 15)),
                      position: "relative",
                      zIndex: 10,
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      backgroundColor: `${OB1.BG_MID}cc`,
                      padding: `${Math.round(12 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                      borderRadius: Math.round(12 * zone.scale),
                      border: `${Math.round(2 * zone.scale)}px solid ${comp.color}40`,
                      textAlign: "center",
                      minWidth: zone.width * 0.25,
                    }}
                  >
                    {strategy}
                  </div>
                ))}
              </div>
            </div>
          ))}
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

export const SS_CLIPS_06 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

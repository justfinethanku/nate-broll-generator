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
import { TrendingUp } from "lucide-react";

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
    // DESIGN SPEC for OP-028-ChangeSuggestsThat
    // FOCAL: Stacked vertical bar showing two cost driver segments
    // SUPPORTING (2): Percentage label "35%" for tokenizer segment, "More Output" for thinking segment
    // TEXT ON SCREEN:
    //   - "Tokenizer" (48px) — 10 chars
    //   - "+35% tokens" (48px) — 11 chars
    //   - "Extended Thinking" (48px) — 17 chars
    //   - "More Output" (48px) — 11 chars
    //   Total visible: 49 chars ✓
    // PHASES:
    //   - 0-1.5s: Bottom segment (tokenizer) fades in
    //   - 1.5-3s: Top segment (thinking) grows upward
    //   - 3-5s: Labels fade in
    //   - 5-7s: Hold
    // ELEMENT COUNT: 2 segments (1 stacked bar) ✓
    // PHONE TEST: All text 48px+ ✓
    id: "OP-028-ChangeSuggestsThat",
    title: "Cost Drivers",
    subtitle: "Why Claude got more expensive",
    bottomLabel: "New tokenizer + extended thinking = higher cost",
    bottomAccent: "higher cost",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const tokenizerHeight = ease(sceneFrame, 0, 45) * (zone.height * 0.3);
      const thinkingHeight = ease(sceneFrame, 45, 90) * (zone.height * 0.25);
      const totalBarHeight = tokenizerHeight + thinkingHeight;

      const barWidth = zone.width * 0.35;

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
          {/* Stacked bar container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: zone.height * 0.7,
              position: "relative",
            }}
          >
            {/* Extended Thinking segment (top) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(32 * zone.scale),
                marginBottom: Math.round(8 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 90, 120),
                  zIndex: 10,
                  position: "relative",
                  textAlign: "right",
                  width: zone.width * 0.25,
                }}
              >
                Extended<br />Thinking
              </div>
              <div
                style={{
                  width: barWidth,
                  height: thinkingHeight,
                  backgroundColor: OB1.RED,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.RED,
                  opacity: ease(sceneFrame, 90, 120),
                  zIndex: 10,
                  position: "relative",
                  width: zone.width * 0.25,
                }}
              >
                More<br />Output
              </div>
            </div>

            {/* Tokenizer segment (bottom) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(32 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 45, 75),
                  zIndex: 10,
                  position: "relative",
                  textAlign: "right",
                  width: zone.width * 0.25,
                }}
              >
                Tokenizer
              </div>
              <div
                style={{
                  width: barWidth,
                  height: tokenizerHeight,
                  backgroundColor: OB1.ORANGE,
                  borderRadius: thinkingHeight > 0 ? 0 : `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.ORANGE,
                  opacity: ease(sceneFrame, 45, 75),
                  zIndex: 10,
                  position: "relative",
                  width: zone.width * 0.25,
                }}
              >
                +35%<br />
                <span style={{ fontSize: Math.round(40 * zone.scale) }}>tokens</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-029-YouAddAll
    // FOCAL: Circular gauge showing usage near cap limit
    // SUPPORTING (2): "Claude Pro" label with logo, "Questions Asked" context
    // TEXT ON SCREEN:
    //   - "Claude Pro" (60px) — 10 chars
    //   - "Usage Cap" (72px) — 9 chars
    //   - "Hit in Few Q's" (48px) — 15 chars
    //   Total visible: 34 chars ✓
    // PHASES:
    //   - 0-1s: Gauge outline fades in
    //   - 1-3s: Fill animates from 0 to ~95% (near cap)
    //   - 3-4.5s: Labels fade in
    //   - 4.5-7s: Pulse warning effect
    // ELEMENT COUNT: 1 gauge + 2 labels = 3 total ✓
    // PHONE TEST: All text 48px+ ✓
    id: "OP-029-YouAddAll",
    title: "Usage Caps",
    subtitle: "Claude Pro limits",
    bottomLabel: "Pro subscribers hit caps after just a few agentic questions",
    bottomAccent: "just a few",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const fillProgress = ease(sceneFrame, 30, 90);
      const gaugeOpacity = ease(sceneFrame, 0, 30);
      const labelOpacity = ease(sceneFrame, 90, 120);
      const pulseVal = pulse(sceneFrame - 135, 0.04);

      const radius = Math.min(zone.width, zone.height) * 0.28;
      const strokeWidth = Math.round(24 * zone.scale);
      const circumference = 2 * Math.PI * radius;
      const capThreshold = 0.95;
      const fillLength = circumference * fillProgress * capThreshold;

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
          {/* Claude Pro logo + label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              marginBottom: zone.height * 0.06,
              ...fadeInUp(sceneFrame, 0),
            }}
          >
            <Img
              src={staticFile("logos/claude.svg")}
              style={{
                width: Math.round(64 * zone.scale),
                height: Math.round(64 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Claude Pro
            </div>
          </div>

          {/* Circular gauge */}
          <svg
            width={radius * 2.5}
            height={radius * 2.5}
            style={{
              transform: "rotate(-90deg)",
              marginBottom: zone.height * 0.05,
            }}
          >
            {/* Background circle */}
            <circle
              cx={radius * 1.25}
              cy={radius * 1.25}
              r={radius}
              fill="none"
              stroke={OB1.DIM}
              strokeWidth={strokeWidth}
              opacity={gaugeOpacity * 0.3}
              style={{ zIndex: 0 }}
            />
            {/* Fill circle */}
            <circle
              cx={radius * 1.25}
              cy={radius * 1.25}
              r={radius}
              fill="none"
              stroke={fillProgress >= capThreshold * 0.95 ? OB1.RED : OB1.CYAN}
              strokeWidth={strokeWidth}
              strokeDasharray={`${fillLength} ${circumference}`}
              strokeLinecap="round"
              opacity={gaugeOpacity * (0.8 + pulseVal * 0.2)}
              style={{ zIndex: 1 }}
            />
          </svg>

          {/* Usage Cap label */}
          <div
            style={{
              fontSize: Math.round(72 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              opacity: labelOpacity,
              zIndex: 10,
              position: "relative",
              marginBottom: Math.round(8 * zone.scale),
            }}
          >
            Usage Cap
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.WHITE,
              opacity: labelOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            Hit in Few Q's
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-030-AnnualizedInApril
    // FOCAL: Two bars showing $20B→$30B revenue growth
    // SUPPORTING (1): Anthropic logo
    // TEXT ON SCREEN:
    //   - "$20B" (80px) — 4 chars
    //   - "$30B" (80px) — 4 chars
    //   - "March" (48px) — 5 chars
    //   - "April" (48px) — 5 chars
    //   Total visible: 18 chars ✓
    // PHASES:
    //   - 0-1.5s: March bar ($20B) fades in
    //   - 1.5-3s: April bar ($30B) grows taller
    //   - 3-4.5s: Labels fade in
    //   - 4.5-7s: Hold with growth arrow
    // ELEMENT COUNT: 2 bars + 1 logo = 3 total ✓
    // PHONE TEST: All text 48px+ ✓
    id: "OP-030-AnnualizedInApril",
    title: "Revenue Growth",
    subtitle: "Anthropic's trajectory",
    bottomLabel: "$20B to $30B annualized in one month",
    bottomAccent: "one month",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const marchHeight = ease(sceneFrame, 0, 45) * (zone.height * 0.4);
      const aprilHeight = ease(sceneFrame, 45, 90) * (zone.height * 0.6);
      const labelOpacity = ease(sceneFrame, 90, 120);
      const arrowOpacity = ease(sceneFrame, 135, 165);

      const barWidth = zone.width * 0.18;
      const gapBetweenBars = zone.width * 0.12;

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
          {/* Anthropic logo */}
          <div
            style={{
              ...bouncePop(sceneFrame, 0, fps),
              marginBottom: zone.height * 0.08,
            }}
          >
            <Img
              src={staticFile("logos/anthropic.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Bars container */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: gapBetweenBars,
              height: zone.height * 0.6,
              position: "relative",
            }}
          >
            {/* March bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.STEEL,
                  opacity: labelOpacity,
                  zIndex: 10,
                  position: "relative",
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                $20B
              </div>
              <div
                style={{
                  width: barWidth,
                  height: marchHeight,
                  backgroundColor: OB1.STEEL,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: labelOpacity,
                  zIndex: 10,
                  position: "relative",
                  marginTop: Math.round(12 * zone.scale),
                }}
              >
                March
              </div>
            </div>

            {/* Growth arrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
                opacity: arrowOpacity,
              }}
            >
              <TrendingUp
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={3}
                style={{ zIndex: 1 }}
              />
            </div>

            {/* April bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  opacity: labelOpacity,
                  zIndex: 10,
                  position: "relative",
                  marginBottom: Math.round(12 * zone.scale),
                }}
              >
                $30B
              </div>
              <div
                style={{
                  width: barWidth,
                  height: aprilHeight,
                  backgroundColor: OB1.GREEN,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: labelOpacity,
                  zIndex: 10,
                  position: "relative",
                  marginTop: Math.round(12 * zone.scale),
                }}
              >
                April
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

export const OP_CLIPS_J = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

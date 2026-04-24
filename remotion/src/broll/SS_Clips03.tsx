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
  ArrowRight,
  TrendingUp,
  DollarSign,
  MapPin,
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
    // DESIGN SPEC for SS-007-GoogleBuildsA
    // FOCAL: Two-column comparison layout
    //   LEFT: Google search box (traditional) with Google logo (120px)
    //   RIGHT: ChatGPT interface with OpenAI logo (120px)
    // SUPPORTING:
    //   1. Arrow from right to left labeled "Threat" (60px)
    //   2. Revenue indicators: "$$$" under Google (fading), "$$" under ChatGPT (growing)
    // TEXT ON SCREEN:
    //   - "Traditional Search" (48px) — 18 chars
    //   - "AI Conversation" (48px) — 15 chars
    //   - "Threat" (60px) — 6 chars
    //   Total: 39 chars ✓
    // PHASES:
    //   - 0-1.5s: Google side fades in
    //   - 1.5-3s: ChatGPT side fades in
    //   - 3-4s: Red arrow draws from right to left
    //   - 4-7s: Hold with subtle pulse on arrow
    // LOGOS: google.svg, openai.svg
    // ELEMENT COUNT: 2 main panels + 1 arrow = 3 ✓
    // PHONE TEST: All text ≥48px, logos 120px ✓
    id: "SS-007-GoogleBuildsA",
    title: "Market Disruption",
    subtitle: "The search wars begin",
    bottomLabel: "ChatGPT threatens Google's ad empire",
    bottomAccent: "threatens",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

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
          {/* Two-column layout */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.12,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* LEFT: Google traditional search */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 0),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
              }}
            >
              <Img
                src={staticFile("logos/google.svg")}
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Traditional Search
              </div>
              {/* Revenue indicator - fading */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  opacity: 1 - ease(sceneFrame, 90, 150) * 0.6,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                $$$
              </div>
            </div>

            {/* CENTER: Threat arrow */}
            <div
              style={{
                ...slideIn(sceneFrame, 90, 30, "right", 60),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                  opacity: 0.5 + pulse(sceneFrame - 120, 0.03) * 0.5,
                }}
              >
                Threat
              </div>
              <ArrowRight
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
                style={{
                  opacity: 0.5 + pulse(sceneFrame - 120, 0.03) * 0.5,
                }}
              />
            </div>

            {/* RIGHT: ChatGPT AI conversation */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
              }}
            >
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                AI Conversation
              </div>
              {/* Revenue indicator - growing */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.AMBER,
                  opacity: ease(sceneFrame, 90, 150),
                  transform: `scale(${1 + ease(sceneFrame, 90, 150) * 0.3})`,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                $$
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for SS-008-AndOpenAIIs
    // FOCAL: Side-by-side revenue bar comparison
    //   LEFT bar: "Search Ads" (taller, labeled "Proven", green)
    //   RIGHT bar: "AI Ads" (shorter but growing, labeled "Emerging", amber)
    // SUPPORTING:
    //   1. Dollar signs above bars showing relative value
    //   2. Trend arrow (up) on right bar
    // TEXT ON SCREEN:
    //   - "Search Ads" (56px) — 10 chars
    //   - "Proven" (48px) — 6 chars
    //   - "AI Ads" (56px) — 6 chars
    //   - "Emerging" (48px) — 8 chars
    //   Total: 30 chars ✓
    // PHASES:
    //   - 0-2s: Left bar grows to full height
    //   - 2-4s: Right bar grows (slower, shorter)
    //   - 4-5.5s: Trend arrow appears on right
    //   - 5.5-7s: Hold
    // ELEMENT COUNT: 2 bars + labels = 2 ✓
    // PHONE TEST: All text ≥48px ✓
    id: "SS-008-AndOpenAIIs",
    title: "Revenue Models",
    subtitle: "Competing for ad dollars",
    bottomLabel: "The race for conversational advertising",
    bottomAccent: "conversational",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftBarHeight = ease(sceneFrame, 0, 60) * (zone.height * 0.6);
      const rightBarHeight = ease(sceneFrame, 60, 120) * (zone.height * 0.45);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: zone.width * 0.15,
            paddingBottom: zone.height * 0.05,
          }}
        >
          {/* LEFT: Search Ads */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Dollar signs */}
            <div
              style={{
                fontSize: Math.round(64 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                opacity: ease(sceneFrame, 30, 50),
                zIndex: 10,
                position: "relative",
              }}
            >
              $$$
            </div>

            {/* Bar */}
            <div
              style={{
                width: zone.width * 0.18,
                height: leftBarHeight,
                backgroundColor: OB1.GREEN,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: Math.round(20 * zone.scale),
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.BG_DARK,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                  opacity: ease(sceneFrame, 40, 60),
                }}
              >
                Search Ads
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                opacity: ease(sceneFrame, 50, 70),
                zIndex: 10,
                position: "relative",
              }}
            >
              Proven
            </div>
          </div>

          {/* RIGHT: AI Ads */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Dollar signs + trend arrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                opacity: ease(sceneFrame, 90, 110),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(64 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.AMBER,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                $$
              </div>
              <div style={{ ...bouncePop(sceneFrame, 120, fps) }}>
                <TrendingUp
                  size={Math.round(56 * zone.scale)}
                  color={OB1.AMBER}
                  strokeWidth={3}
                />
              </div>
            </div>

            {/* Bar */}
            <div
              style={{
                width: zone.width * 0.18,
                height: rightBarHeight,
                backgroundColor: OB1.AMBER,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: Math.round(20 * zone.scale),
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.BG_DARK,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                  opacity: ease(sceneFrame, 100, 120),
                }}
              >
                AI Ads
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                opacity: ease(sceneFrame, 110, 130),
                zIndex: 10,
                position: "relative",
              }}
            >
              Emerging
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for SS-009-InTheUS
    // FOCAL: Simplified US map silhouette (centered, ~800px wide)
    //   - 12 states highlighted in red with pulsing markers
    //   - Remaining states in dim gray
    // SUPPORTING:
    //   1. Counter: "12 States" (80px) above map
    //   2. Label: "Data Center Restrictions" (56px) below map
    // TEXT ON SCREEN:
    //   - "12" (80px) — 2 chars
    //   - "States" (80px) — 6 chars
    //   - "Data Center Restrictions" (56px) — 25 chars
    //   Total: 33 chars ✓
    // PHASES:
    //   - 0-2s: Map silhouette fades in
    //   - 2-5s: Red markers appear in staggered sequence (12 states)
    //   - 5-7s: Markers pulse, hold
    // ELEMENT COUNT: 1 map + 1 counter + 1 label = 3 ✓
    // PHONE TEST: All text ≥56px, map dominates frame ✓
    // NOTE: Using generic geographic marker placement (not actual state shapes)
    id: "SS-009-InTheUS",
    title: "Geographic Impact",
    subtitle: "State-level restrictions",
    bottomLabel: "12 states considering data center moratoriums",
    bottomAccent: "12 states",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const count = countUp(sceneFrame, 60, 150, 12);

      // Generic US map outline coordinates (simplified continental shape)
      const mapWidth = Math.min(zone.width * 0.7, zone.height * 1.4);
      const mapHeight = mapWidth * 0.6;

      // 12 marker positions distributed across the map (generic geographic spread)
      const markers = [
        { x: 0.15, y: 0.35 }, // West coast
        { x: 0.18, y: 0.55 }, // Southwest
        { x: 0.28, y: 0.25 }, // Northwest
        { x: 0.35, y: 0.45 }, // Mountain
        { x: 0.42, y: 0.38 }, // Central
        { x: 0.48, y: 0.52 }, // South central
        { x: 0.58, y: 0.42 }, // Midwest
        { x: 0.65, y: 0.28 }, // Great Lakes
        { x: 0.72, y: 0.48 }, // Southeast
        { x: 0.78, y: 0.35 }, // Mid-Atlantic
        { x: 0.84, y: 0.25 }, // Northeast
        { x: 0.88, y: 0.42 }, // East coast
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
            gap: Math.round(32 * zone.scale),
          }}
        >
          {/* Counter at top */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 60),
              fontSize: Math.round(80 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.RED,
              display: "flex",
              alignItems: "baseline",
              gap: Math.round(16 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            <span>{count}</span>
            <span
              style={{
                fontSize: Math.round(80 * zone.scale),
                color: OB1.WHITE,
              }}
            >
              States
            </span>
          </div>

          {/* Simplified US map silhouette with markers */}
          <div
            style={{
              position: "relative",
              width: mapWidth,
              height: mapHeight,
              opacity: ease(sceneFrame, 0, 40),
            }}
          >
            {/* Map base shape (simplified continental US outline) */}
            <svg
              width={mapWidth}
              height={mapHeight}
              viewBox="0 0 100 60"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {/* Simplified US outline */}
              <path
                d="M 5,30 L 8,20 L 12,18 L 15,22 L 18,15 L 22,12 L 28,14 L 35,10 L 42,15 L 48,12 L 55,18 L 62,15 L 68,20 L 75,18 L 82,22 L 88,20 L 92,25 L 95,28 L 93,35 L 90,40 L 85,45 L 78,48 L 70,50 L 62,52 L 55,50 L 48,48 L 40,50 L 32,52 L 25,50 L 18,48 L 12,45 L 8,40 L 5,35 Z"
                fill={OB1.DIM}
                opacity={0.3}
                stroke={OB1.STEEL}
                strokeWidth={0.5}
              />
            </svg>

            {/* Red markers for states with restrictions */}
            {markers.map((marker, i) => {
              const markerDelay = stagger(i, 60, 8);
              const markerOpacity = ease(sceneFrame, markerDelay, markerDelay + 20);
              const markerPulse = sceneFrame > markerDelay + 20 ? pulse(sceneFrame - markerDelay, 0.04) : 0;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${marker.x * 100}%`,
                    top: `${marker.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: markerOpacity,
                  }}
                >
                  <MapPin
                    size={Math.round(48 * zone.scale)}
                    color={OB1.RED}
                    fill={OB1.RED}
                    strokeWidth={2}
                    style={{
                      filter: `drop-shadow(0 0 ${Math.round(8 * zone.scale * (1 + markerPulse))}px ${OB1.RED})`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Label at bottom */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 140),
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.WHITE,
              textAlign: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            Data Center Restrictions
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

export const SS_CLIPS_03 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  Database,
  User,
  Users,
  Building,
  Cloud,
  ArrowDown,
  ArrowUp,
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
    // DESIGN SPEC for BYOC-022-grow-on-platforms-1590-020
    // FOCAL: Timeline/evolution diagram - 3 stages left-to-right showing shift from platform silos to portable context
    // SUPPORTING (3):
    //   1. Stage 1 (left): 3 platform logos stacked vertically (Slack, Notion, Google) in separate containers
    //   2. Stage 2 (middle): Same logos with connecting arrows converging toward center
    //   3. Stage 3 (right): Single unified context icon (Database) with user icon above
    // TEXT ON SCREEN:
    //   - "Platform Silos" (48px, stage 1) - 14 chars
    //   - "Integration" (48px, stage 2) - 11 chars
    //   - "Your Context" (48px, stage 3) - 12 chars
    //   Total visible: 37 chars OK
    // PHASES:
    //   - 0-1.5s: Stage 1 fades in
    //   - 1.5-3.5s: Stage 2 appears
    //   - 3.5-5.5s: Stage 3 appears
    //   - 5.5-7s: Hold all stages
    // LOGOS: slack.svg, notion.svg, google.svg
    // LUCIDE ICONS: Database, User
    // ELEMENT COUNT: 3 stages OK
    // PHONE TEST: All text 48px, all logos 96px, icons 64px OK
    id: "BYOC-022-grow-on-platforms-1590-020",
    title: "Platform Evolution",
    subtitle: "From silos to portable context",
    bottomLabel: "Context you own travels with you across every tool",
    bottomAccent: "you own",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const logoSize = Math.round(96 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            position: "relative",
          }}
        >
          {/* Stage 1: Platform Silos */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Platform logos stacked */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(20 * zone.scale),
              }}
            >
              {["slack", "notion", "google"].map((platform, i) => (
                <div
                  key={platform}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 10, 8)),
                    width: Math.round(180 * zone.scale),
                    height: Math.round(120 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
                    borderRadius: Math.round(8 * zone.scale),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile(`logos/${platform}.svg`)}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                opacity: ease(sceneFrame, 30, 45),
                zIndex: 10,
                position: "relative",
              }}
            >
              Platform Silos
            </div>
          </div>

          {/* Stage 2: Integration */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Converging arrows visualization */}
            <div
              style={{
                position: "relative",
                width: Math.round(160 * zone.scale),
                height: Math.round(160 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Three arrows pointing to center */}
              {[0, 120, 240].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const distance = 50 * zone.scale;
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;

                return (
                  <div
                    key={angle}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: `translate(${x}px, ${y}px)`,
                      opacity: ease(sceneFrame, 50 + i * 8, 65 + i * 8),
                      zIndex: 0,
                    }}
                  >
                    <div
                      style={{
                        width: Math.round(40 * zone.scale),
                        height: Math.round(3 * zone.scale),
                        backgroundColor: OB1.STEEL,
                        transformOrigin: "left center",
                        transform: `rotate(${angle + 180}deg)`,
                      }}
                    />
                  </div>
                );
              })}

              {/* Center convergence point */}
              <div
                style={{
                  width: Math.round(24 * zone.scale),
                  height: Math.round(24 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.STEEL,
                  opacity: ease(sceneFrame, 75, 85),
                  zIndex: 1,
                }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                opacity: ease(sceneFrame, 70, 85),
                zIndex: 10,
                position: "relative",
              }}
            >
              Integration
            </div>
          </div>

          {/* Stage 3: Your Context */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 105),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
            }}
          >
            {/* User icon above database */}
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
                  ...bouncePop(sceneFrame, 110, fps),
                  zIndex: 1,
                }}
              >
                <User size={iconSize} color={OB1.GREEN} strokeWidth={2.5} />
              </div>

              <div
                style={{
                  ...bouncePop(sceneFrame, 120, fps),
                  width: Math.round(200 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  borderRadius: Math.round(8 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Database
                  size={Math.round(96 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                opacity: ease(sceneFrame, 130, 145),
                zIndex: 10,
                position: "relative",
              }}
            >
              Your Context
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-023-systems-controlled-by-1670-350
    // FOCAL: Before/After comparison split - Corporate control (left, RED) vs Individual ownership (right, GREEN)
    // SUPPORTING (2):
    //   1. LEFT side: Building icon (corporate) with 3 small user icons below, downward arrow showing top-down control
    //   2. RIGHT side: User icon (individual) at top with upward arrow, cloud icon below representing owned infrastructure
    // TEXT ON SCREEN:
    //   - "Corporate Control" (56px, left side) - 17 chars
    //   - "Individual Ownership" (56px, right side) - 20 chars
    //   Total visible: 37 chars OK
    // PHASES:
    //   - 0-2s: Left side fades in (corporate control)
    //   - 2-4s: Vertical separator line draws center
    //   - 4-6s: Right side fades in (individual ownership)
    //   - 6-7s: Hold
    // LUCIDE ICONS: Building, Users, User, Cloud, ArrowDown, ArrowUp
    // ELEMENT COUNT: 2 sides OK
    // PHONE TEST: All text 56px, icons 80-96px OK
    id: "BYOC-023-systems-controlled-by-1670-350",
    title: "Control Shift",
    subtitle: "Who owns your context?",
    bottomLabel:
      "The future belongs to professionals who control their own context infrastructure",
    bottomAccent: "control their own",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const labelSize = Math.round(56 * zone.scale);
      const iconLarge = Math.round(96 * zone.scale);
      const iconMedium = Math.round(80 * zone.scale);
      const iconSmall = Math.round(48 * zone.scale);

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
          {/* LEFT SIDE: Corporate Control */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              width: zone.width * 0.42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Building icon */}
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
                zIndex: 1,
              }}
            >
              <Building size={iconLarge} color={OB1.RED} strokeWidth={2} />
            </div>

            {/* Downward arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 30, 45),
                zIndex: 0,
              }}
            >
              <ArrowDown size={iconMedium} color={OB1.RED} strokeWidth={3} />
            </div>

            {/* User icons (team) */}
            <div
              style={{
                display: "flex",
                gap: Math.round(16 * zone.scale),
                opacity: ease(sceneFrame, 40, 55),
                zIndex: 1,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 45, 6)),
                  }}
                >
                  <User size={iconSmall} color={OB1.DIM} strokeWidth={2} />
                </div>
              ))}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.RED,
                opacity: ease(sceneFrame, 50, 65),
                zIndex: 10,
                position: "relative",
                marginTop: Math.round(16 * zone.scale),
              }}
            >
              Corporate Control
            </div>
          </div>

          {/* CENTER: Separator line */}
          <div
            style={{
              width: Math.round(3 * zone.scale),
              height: ease(sceneFrame, 60, 90) * zone.height * 0.8,
              backgroundColor: OB1.STEEL,
              opacity: 0.5,
              zIndex: 0,
            }}
          />

          {/* RIGHT SIDE: Individual Ownership */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 120),
              width: zone.width * 0.42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* User icon (individual) */}
            <div
              style={{
                ...bouncePop(sceneFrame, 125, fps),
                zIndex: 1,
              }}
            >
              <User size={iconLarge} color={OB1.GREEN} strokeWidth={2.5} />
            </div>

            {/* Upward arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 135, 150),
                zIndex: 0,
              }}
            >
              <ArrowUp size={iconMedium} color={OB1.GREEN} strokeWidth={3} />
            </div>

            {/* Cloud icon (owned infrastructure) */}
            <div
              style={{
                ...bouncePop(sceneFrame, 155, fps),
                zIndex: 1,
              }}
            >
              <Cloud
                size={iconMedium}
                color={OB1.GREEN}
                strokeWidth={2}
                fill={OB1.BG_MID}
              />
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                opacity: ease(sceneFrame, 160, 175),
                zIndex: 10,
                position: "relative",
                marginTop: Math.round(16 * zone.scale),
              }}
            >
              Individual Ownership
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-024-asset-because-it-1730-190
    // FOCAL: Growth/advantage visualization - Single professional icon with upward trending metrics
    // SUPPORTING (3):
    //   1. Center: Large User icon with glowing Database icon attached (representing context-equipped professional)
    //   2. Rising trend line from bottom-left to top-right behind the icon
    //   3. Three ascending stat bars to the right showing capability levels
    // TEXT ON SCREEN:
    //   - "Context-Powered Professional" (56px, top) - 28 chars
    //   - "Future Advantage" (64px, bottom) - 16 chars
    //   Total visible: 44 chars OK
    // PHASES:
    //   - 0-1.5s: Trend line draws from left to right
    //   - 1.5-3s: Center professional icon + context database fade in
    //   - 3-5s: Stat bars rise sequentially (staggered)
    //   - 5-7s: Pulse effect on professional icon
    // LUCIDE ICONS: User, Database, TrendingUp
    // ELEMENT COUNT: 3 (trend line, professional+context combo, stat bars as 1 group) OK
    // PHONE TEST: All text 56-64px, icons 96-120px OK
    id: "BYOC-024-asset-because-it-1730-190",
    title: "Future Advantage",
    subtitle: "Build context infrastructure now",
    bottomLabel:
      "Professionals who invest in portable context systems today will lead tomorrow",
    bottomAccent: "lead tomorrow",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const titleSize = Math.round(56 * zone.scale);
      const statSize = Math.round(64 * zone.scale);
      const iconLarge = Math.round(120 * zone.scale);

      const pulseVal = pulse(sceneFrame - 150, 0.04);
      const glowOpacity = 0.3 + pulseVal * 0.4;

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
          {/* Trend line background */}
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
            <line
              x1={zone.width * 0.15}
              y1={zone.height * 0.85}
              x2={
                zone.width * 0.15 + ease(sceneFrame, 0, 45) * zone.width * 0.7
              }
              y2={
                zone.height * 0.85 -
                ease(sceneFrame, 0, 45) * zone.height * 0.6
              }
              stroke={OB1.CYAN}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeDasharray={`${Math.round(8 * zone.scale)} ${Math.round(4 * zone.scale)}`}
              opacity={0.5}
            />
          </svg>

          {/* Title */}
          <div
            style={{
              fontSize: titleSize,
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.WHITE,
              opacity: ease(sceneFrame, 45, 60),
              zIndex: 10,
              position: "relative",
              marginBottom: zone.height * 0.08,
            }}
          >
            Context-Powered Professional
          </div>

          {/* Center: Professional + Context */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: zone.width * 0.12,
              marginBottom: zone.height * 0.08,
            }}
          >
            {/* Professional icon with pulse glow */}
            <div
              style={{
                position: "relative",
                ...bouncePop(sceneFrame, 45, fps),
              }}
            >
              {/* Glow ring */}
              <div
                style={{
                  position: "absolute",
                  width: Math.round(180 * zone.scale),
                  height: Math.round(180 * zone.scale),
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                  opacity: sceneFrame >= 150 ? glowOpacity : 0,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
              />

              <User
                size={iconLarge}
                color={OB1.ORANGE}
                strokeWidth={2.5}
                style={{ zIndex: 1, position: "relative" }}
              />

              {/* Database badge attached to user */}
              <div
                style={{
                  position: "absolute",
                  bottom: Math.round(-8 * zone.scale),
                  right: Math.round(-8 * zone.scale),
                  backgroundColor: OB1.BG_DARK,
                  borderRadius: "50%",
                  padding: Math.round(8 * zone.scale),
                  opacity: ease(sceneFrame, 60, 75),
                  zIndex: 1,
                }}
              >
                <Database
                  size={Math.round(48 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Stat bars */}
            <div
              style={{
                display: "flex",
                gap: Math.round(20 * zone.scale),
                alignItems: "flex-end",
              }}
            >
              {[
                { height: 0.5, color: OB1.STEEL, delay: 90 },
                { height: 0.75, color: OB1.CYAN, delay: 105 },
                { height: 1.0, color: OB1.ORANGE, delay: 120 },
              ].map((bar, i) => {
                const barHeight =
                  ease(sceneFrame, bar.delay, bar.delay + 25) *
                  zone.height *
                  0.2 *
                  bar.height;
                return (
                  <div
                    key={i}
                    style={{
                      width: zone.width * 0.08,
                      height: barHeight,
                      backgroundColor: bar.color,
                      borderRadius: Math.round(4 * zone.scale),
                      zIndex: 1,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom label */}
          <div
            style={{
              fontSize: statSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              opacity: ease(sceneFrame, 140, 160),
              zIndex: 10,
              position: "relative",
            }}
          >
            Future Advantage
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

export const BYOC_CLIPS_H = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

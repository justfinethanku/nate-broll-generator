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
import { User, Lock, Shield } from "lucide-react";

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
    // DESIGN SPEC for BYOC-001-BYOC-system-for
    // FOCAL: Central worker figure (User icon 96px) with 3 disconnected platform bubbles orbiting at 120° intervals
    // SUPPORTING (3):
    //   - Personal AI bubble (ChatGPT logo 140px) at 270° (bottom)
    //   - Workplace Tools bubble (Microsoft logo 140px) at 30° (upper right)
    //   - IT Policy bubble (Shield icon 96px in 160px circle) at 150° (upper left)
    // TEXT ON SCREEN:
    //   - "Personal AI" (48px) — 11 chars
    //   - "Work Tools" (48px) — 10 chars
    //   - "IT Policy" (48px) — 9 chars
    //   Total visible: 30 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Center worker icon fades in
    //   - 1-2.5s: Three bubbles pop in (staggered)
    //   - 2.5-4s: Dashed connector lines appear (showing fragmentation)
    //   - 4-7s: Hold with subtle pulse
    // LOGOS: openai.svg, microsoft.svg
    // ELEMENT COUNT: 1 center + 3 orbiting = 4 ✓
    // PHONE TEST: All text 48px, logos 140px/96px, shield in 160px circle ✓
    id: "BYOC-001-BYOC-system-for",
    title: "BYOC System",
    subtitle: "Fragmented context problem",
    bottomLabel: "Enterprise worker context scattered across disconnected platforms",
    bottomAccent: "disconnected",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const radius = Math.min(zone.width, zone.height) * 0.35;

      // Three platform positions at 120° intervals
      const platforms = [
        {
          label: "Personal AI",
          logo: "openai.svg",
          angle: 270,
          color: OB1.CYAN,
          delay: 30,
          logoSize: 140,
        },
        {
          label: "Work Tools",
          logo: "microsoft.svg",
          angle: 30,
          color: OB1.ORANGE,
          delay: 45,
          logoSize: 140,
        },
        {
          label: "IT Policy",
          logo: null,
          icon: Shield,
          angle: 150,
          color: OB1.RED,
          delay: 60,
          iconSize: 96,
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
            position: "relative",
          }}
        >
          {/* Dashed connector lines (zIndex 0) */}
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
            {platforms.map((platform, i) => {
              const angleRad = (platform.angle * Math.PI) / 180;
              const x = centerX + radius * Math.cos(angleRad);
              const y = centerY + radius * Math.sin(angleRad);
              const lineOpacity = ease(sceneFrame, 75, 95);

              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={platform.color}
                  strokeWidth={Math.round(2 * zone.scale)}
                  strokeDasharray={`${Math.round(8 * zone.scale)} ${Math.round(4 * zone.scale)}`}
                  opacity={lineOpacity * 0.4}
                />
              );
            })}
          </svg>

          {/* Center worker icon (zIndex 1) */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              position: "absolute",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: Math.round(160 * zone.scale),
                height: Math.round(160 * zone.scale),
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User
                size={Math.round(96 * zone.scale)}
                color={OB1.WHITE}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Orbiting platform bubbles */}
          {platforms.map((platform, i) => {
            const angleRad = (platform.angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(angleRad);
            const y = centerY + radius * Math.sin(angleRad);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div style={{ ...bouncePop(sceneFrame, platform.delay, fps) }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: Math.round(12 * zone.scale),
                    }}
                  >
                    {/* Platform icon/logo container (zIndex 1) */}
                    <div
                      style={{
                        width:
                          Math.round(
                            platform.icon ? 160 : platform.logoSize!
                          ) * zone.scale,
                        height:
                          Math.round(
                            platform.icon ? 160 : platform.logoSize!
                          ) * zone.scale,
                        borderRadius: platform.icon
                          ? "50%"
                          : Math.round(8 * zone.scale),
                        backgroundColor: OB1.BG_MID,
                        border: `${Math.round(3 * zone.scale)}px solid ${platform.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                        position: "relative",
                      }}
                    >
                      {platform.logo ? (
                        <Img
                          src={staticFile(`logos/${platform.logo}`)}
                          style={{
                            width: Math.round(platform.logoSize! * zone.scale),
                            height: Math.round(platform.logoSize! * zone.scale),
                          }}
                        />
                      ) : platform.icon ? (
                        <platform.icon
                          size={Math.round(platform.iconSize! * zone.scale)}
                          color={platform.color}
                          strokeWidth={2}
                        />
                      ) : null}
                    </div>

                    {/* Platform label (zIndex 10) */}
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
                      {platform.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-002-elsewhere-with-us
    // FOCAL: Three platform cards in a horizontal row, each with a lock icon overlay
    // SUPPORTING (3):
    //   - Left card: Personal AI (Claude logo 120px, "Claude" label 44px)
    //   - Middle card: Work Tools (Slack logo 120px, "Slack" label 44px)
    //   - Right card: Collaboration (Notion logo 120px, "Notion" label 44px)
    // TEXT ON SCREEN:
    //   - "Claude" (44px) — 6 chars
    //   - "Slack" (44px) — 5 chars
    //   - "Notion" (44px) — 6 chars
    //   Total visible: 17 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Three cards fade in
    //   - 1.5-3s: Lock icons appear on each (staggered)
    //   - 3-5s: Red glow pulses on locks
    //   - 5-7s: Hold
    // LOGOS: claude.svg, slack.svg, notion.svg
    // ELEMENT COUNT: 3 locked platforms (within 4 max) ✓
    // PHONE TEST: All logos 120px, all labels 44px ✓
    id: "BYOC-002-elsewhere-with-us",
    title: "Context Mobility",
    subtitle: "The trap",
    bottomLabel: "Worker context locked inside individual platforms",
    bottomAccent: "locked",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const platforms = [
        {
          label: "Claude",
          logo: "claude.svg",
          color: OB1.ORANGE,
          delay: 20,
        },
        {
          label: "Slack",
          logo: "slack.svg",
          color: OB1.PURPLE,
          delay: 35,
        },
        {
          label: "Notion",
          logo: "notion.svg",
          color: OB1.CYAN,
          delay: 50,
        },
      ];

      const cardWidth = zone.width * 0.22;
      const cardHeight = zone.height * 0.6;
      const gap = zone.width * 0.08;

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
          {platforms.map((platform, i) => {
            const cardOpacity = ease(
              sceneFrame,
              stagger(i, 10, 15),
              stagger(i, 10, 15) + 20
            );
            const lockOpacity = ease(
              sceneFrame,
              platform.delay,
              platform.delay + 20
            );
            const glowPulse = pulse(sceneFrame - 90, 0.04);

            return (
              <div
                key={i}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  opacity: cardOpacity,
                  position: "relative",
                }}
              >
                {/* Card background (zIndex 1) */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(3 * zone.scale)}px solid ${platform.color}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(24 * zone.scale),
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Platform logo */}
                  <Img
                    src={staticFile(`logos/${platform.logo}`)}
                    style={{
                      width: Math.round(120 * zone.scale),
                      height: Math.round(120 * zone.scale),
                      filter: "brightness(0) invert(1)",
                    }}
                  />

                  {/* Platform label (zIndex 10) */}
                  <div
                    style={{
                      fontSize: Math.round(44 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {platform.label}
                  </div>
                </div>

                {/* Lock icon overlay (zIndex 10) */}
                <div
                  style={{
                    position: "absolute",
                    top: Math.round(-20 * zone.scale),
                    right: Math.round(-20 * zone.scale),
                    opacity: lockOpacity,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: Math.round(80 * zone.scale),
                      height: Math.round(80 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: OB1.BG_DARK,
                      border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        sceneFrame > 90
                          ? `0 0 ${Math.round((20 + glowPulse * 10) * zone.scale)}px ${OB1.RED}`
                          : "none",
                    }}
                  >
                    <Lock
                      size={Math.round(48 * zone.scale)}
                      color={OB1.RED}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-003-of-the-context
    // FOCAL: Large percentage counter "60%" (120px) with circular progress arc
    // SUPPORTING (2):
    //   - Label "Use Personal AI at Work" (48px) — 23 chars
    //   - Subtext "Despite IT Policy" (44px) — 17 chars
    // TEXT ON SCREEN:
    //   - "60%" (120px) — 3 chars
    //   - "Use Personal AI at Work" (48px) — 23 chars
    //   - "Despite IT Policy" (44px) — 17 chars
    //   Total visible: 43 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Arc container appears
    //   - 1.5-3.5s: Counter animates 0→60, arc fills
    //   - 3.5-5s: Labels fade in (staggered)
    //   - 5-7s: Hold with subtle pulse
    // LOGOS: None (abstract data viz)
    // ELEMENT COUNT: 1 counter + 2 labels = 3 ✓
    // PHONE TEST: Counter 120px, labels 44-48px ✓
    id: "BYOC-003-of-the-context",
    title: "Survey Data",
    subtitle: "Shadow AI usage",
    bottomLabel: "60% of workers use personal AI despite IT restrictions",
    bottomAccent: "60%",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const count = countUp(sceneFrame, 45, 105, 60);
      const arcProgress = ease(sceneFrame, 45, 105);

      const arcSize = Math.min(zone.width, zone.height) * 0.5;
      const arcRadius = arcSize * 0.4;
      const arcStrokeWidth = Math.round(24 * zone.scale);

      // SVG arc path
      const startAngle = -90;
      const endAngle = startAngle + 360 * (arcProgress * 0.6);
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = arcSize / 2 + arcRadius * Math.cos(startRad);
      const y1 = arcSize / 2 + arcRadius * Math.sin(startRad);
      const x2 = arcSize / 2 + arcRadius * Math.cos(endRad);
      const y2 = arcSize / 2 + arcRadius * Math.sin(endRad);

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const arcPath =
        arcProgress > 0
          ? `M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
          : "";

      const containerOpacity = ease(sceneFrame, 0, 20);
      const glowPulse = pulse(sceneFrame - 105, 0.03);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(40 * zone.scale),
          }}
        >
          {/* Arc + Counter */}
          <div
            style={{
              position: "relative",
              width: arcSize,
              height: arcSize,
              opacity: containerOpacity,
            }}
          >
            {/* Background arc (zIndex 0) */}
            <svg
              width={arcSize}
              height={arcSize}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            >
              <circle
                cx={arcSize / 2}
                cy={arcSize / 2}
                r={arcRadius}
                fill="none"
                stroke={OB1.DIM}
                strokeWidth={arcStrokeWidth}
                opacity={0.3}
              />
              {arcProgress > 0 && (
                <path
                  d={arcPath}
                  fill="none"
                  stroke={OB1.ORANGE}
                  strokeWidth={arcStrokeWidth}
                  strokeLinecap="round"
                  style={{
                    filter:
                      sceneFrame > 105
                        ? `drop-shadow(0 0 ${Math.round((12 + glowPulse * 6) * zone.scale)}px ${OB1.ORANGE})`
                        : "none",
                  }}
                />
              )}
            </svg>

            {/* Counter text (zIndex 10) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: arcSize,
                height: arcSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(120 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  position: "relative",
                }}
              >
                {Math.floor(count)}%
              </div>
            </div>
          </div>

          {/* Labels (zIndex 10) */}
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
                ...fadeInUp(sceneFrame, 105),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Use Personal AI at Work
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                fontSize: Math.round(44 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.RED,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Despite IT Policy
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

export const BYOC_CLIPS_A = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  FileText,
  Bot,
  BotOff,
  ArrowUp,
  Shield,
  Zap,
  Package,
  Lock,
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
    // DESIGN SPEC for AP-004-AIAgent
    // FOCAL: Central "Agent OS" box (240x200) with .md file icons flowing into it from left
    // SUPPORTING:
    //   1. Three .md file icons (120px each) on left side, vertically stacked
    //   2. Quality flow visualization on right: good files → strong agent, poor files → weak agent
    // TEXT ON SCREEN:
    //   - ".md files" (48px) — 9 chars
    //   - "Agent OS" (72px) — 8 chars
    //   - "Quality In" (48px) — 10 chars
    //   - "Performance" (48px) — 11 chars
    //   Total: 38 chars ✓
    // PHASES:
    //   - 0-1.5s: .md file icons fade in (left)
    //   - 1.5-3s: Center "Agent OS" box pops in
    //   - 3-5s: Right side quality arrows appear
    //   - 5-7s: Hold with pulse on center
    // ELEMENT COUNT: 3 groups ✓
    // PHONE TEST: All text 48-72px, icons 64-80px ✓
    id: "AP-004-AIAgent",
    title: "AI Agent",
    subtitle: "Architecture",
    bottomLabel: "Markdown as Agent OS",
    bottomAccent: "Agent OS",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

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
          {/* Left: .md file stack */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.08,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: Math.round(20 * zone.scale),
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...fadeInUp(sceneFrame, stagger(i, 10, 12)),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(8 * zone.scale),
                }}
              >
                <FileText
                  size={Math.round(80 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={1.5}
                  style={{ zIndex: 1 }}
                />
              </div>
            ))}
            <div
              style={{
                ...fadeInUp(sceneFrame, 40),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                marginTop: Math.round(12 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              .md files
            </div>
          </div>

          {/* Center: Agent OS box */}
          <div
            style={{
              ...bouncePop(sceneFrame, 45, fps),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: Math.round(240 * zone.scale),
              height: Math.round(200 * zone.scale),
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
              borderRadius: Math.round(12 * zone.scale),
              opacity: 0.95 + pulse(sceneFrame - 120, 0.02) * 0.15,
              zIndex: 1,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                letterSpacing: "-0.01em",
                zIndex: 10,
                position: "relative",
              }}
            >
              Agent OS
            </div>
          </div>

          {/* Right: Quality flow visualization */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.08,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(40 * zone.scale),
            }}
          >
            {/* Good path */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Quality In
              </div>
              <ArrowUp
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <Bot
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={1.5}
                style={{ zIndex: 1 }}
              />
            </div>

            {/* Poor path */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 110),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <BotOff
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={1.5}
                style={{ zIndex: 1 }}
              />
              <ArrowUp
                size={Math.round(64 * zone.scale)}
                color={OB1.RED}
                strokeWidth={2.5}
                style={{
                  transform: "rotate(180deg)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Poor Quality
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-005-HavingClarity
    // FOCAL: Three-tier pyramid with largest at bottom, smallest at top
    // SUPPORTING: Upward arrows between tiers showing flow
    // TEXT ON SCREEN:
    //   - "Clarity of Intent" (60px) — 17 chars
    //   - "Memory & Config" (56px) — 15 chars
    //   - "Agent Performance" (52px) — 17 chars
    //   Total: 49 chars ✓
    // PHASES:
    //   - 0-2s: Bottom tier fades in
    //   - 2-3.5s: Arrow + middle tier
    //   - 3.5-5s: Arrow + top tier
    //   - 5-7s: Hold
    // ELEMENT COUNT: 3 tiers ✓
    // PHONE TEST: All text 52-60px, tiers large ✓
    id: "AP-005-HavingClarity",
    title: "Having Clarity",
    subtitle: "The prerequisite chain",
    bottomLabel: "The Prerequisite Chain",
    bottomAccent: "Prerequisite",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const tiers = [
        {
          label: "Clarity of Intent",
          width: 0.75,
          height: 160,
          color: OB1.ORANGE,
          delay: 10,
        },
        {
          label: "Memory & Config",
          width: 0.58,
          height: 120,
          color: OB1.CYAN,
          delay: 60,
        },
        {
          label: "Agent Performance",
          width: 0.42,
          height: 90,
          color: OB1.GREEN,
          delay: 105,
        },
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
            gap: Math.round(24 * zone.scale),
          }}
        >
          {tiers
            .slice()
            .reverse()
            .map((tier, i) => {
              const actualIndex = tiers.length - 1 - i;
              return (
                <React.Fragment key={tier.label}>
                  {/* Arrow between tiers */}
                  {i > 0 && (
                    <div
                      style={{
                        ...fadeInUp(sceneFrame, tier.delay - 15),
                      }}
                    >
                      <ArrowUp
                        size={Math.round(48 * zone.scale)}
                        color={OB1.STEEL}
                        strokeWidth={2.5}
                        style={{ zIndex: 0 }}
                      />
                    </div>
                  )}
                  {/* Tier box */}
                  <div
                    style={{
                      ...bouncePop(sceneFrame, tier.delay, fps),
                      width: Math.round(zone.width * tier.width),
                      height: Math.round(tier.height * zone.scale),
                      backgroundColor: tier.color,
                      border: `${Math.round(3 * zone.scale)}px solid ${OB1.WHITE}40`,
                      borderRadius: Math.round(12 * zone.scale),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        fontSize: Math.round(
                          (60 - actualIndex * 4) * zone.scale
                        ),
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: OB1.WHITE,
                        textAlign: "center",
                        padding: `0 ${Math.round(20 * zone.scale)}px`,
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {tier.label}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-006-PeterDesigned
    // FOCAL: Large center shield icon (140px) representing intentional security barrier, with labels showing fork between intentional complexity vs easy copycats
    // SUPPORTING:
    //   1. "OpenClaw" label with shield (left side)
    //   2. Branch arrows pointing to "Copycats" group on right
    //   3. Trade-off labels (Intentional vs Easy)
    // TEXT ON SCREEN:
    //   - "OpenClaw" (60px) — 8 chars
    //   - "Intentional Barrier" (48px) — 19 chars
    //   - "Copycats" (60px) — 8 chars
    //   - "Easy Install" (48px) — 12 chars
    //   Total: 47 chars ✓
    // PHASES:
    //   - 0-1.5s: Shield + OpenClaw label fade in (left)
    //   - 1.5-3s: Branch arrows draw
    //   - 3-5.5s: Copycat side fades in (right)
    //   - 5.5-7s: Hold with pulse on shield
    // ELEMENT COUNT: 2 groups (original vs copycats) ✓
    // PHONE TEST: All text 48-60px, icons 80-140px ✓
    id: "AP-006-PeterDesigned",
    title: "Peter Designed",
    subtitle: "Intentional friction",
    bottomLabel: "Intentional Complexity",
    bottomAccent: "Intentional",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            padding: `0 ${Math.round(40 * zone.scale)}px`,
          }}
        >
          {/* Left: OpenClaw with shield */}
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
                ...bouncePop(sceneFrame, 15, fps),
                position: "relative",
                opacity: 0.92 + pulse(sceneFrame - 120, 0.025) * 0.18,
              }}
            >
              <Shield
                size={Math.round(140 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2}
                fill={OB1.ORANGE + "30"}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              >
                <Lock
                  size={Math.round(64 * zone.scale)}
                  color={OB1.WHITE}
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 35),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(8 * zone.scale),
              }}
            >
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
                OpenClaw
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.ORANGE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Intentional Barrier
              </div>
            </div>
          </div>

          {/* Center: Branch arrows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  ...slideIn(sceneFrame, 55 + i * 8, 25, "right", 80),
                }}
              >
                <svg
                  width={Math.round(120 * zone.scale)}
                  height={Math.round(6 * zone.scale)}
                >
                  <line
                    x1="0"
                    y1={Math.round(3 * zone.scale)}
                    x2={Math.round(120 * zone.scale)}
                    y2={Math.round(3 * zone.scale)}
                    stroke={OB1.STEEL}
                    strokeWidth={Math.round(3 * zone.scale)}
                    style={{ zIndex: 0 }}
                  />
                  <polygon
                    points={`${Math.round(120 * zone.scale)},${Math.round(3 * zone.scale)} ${Math.round(110 * zone.scale)},0 ${Math.round(110 * zone.scale)},${Math.round(6 * zone.scale)}`}
                    fill={OB1.STEEL}
                    style={{ zIndex: 0 }}
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Right: Copycats */}
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
                ...fadeInUp(sceneFrame, 90),
                display: "flex",
                gap: Math.round(16 * zone.scale),
              }}
            >
              {[Package, Zap, Package].map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    ...bouncePop(sceneFrame, 95 + i * 10, fps),
                    width: Math.round(100 * zone.scale),
                    height: Math.round(100 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
                    borderRadius: Math.round(8 * zone.scale),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    position: "relative",
                  }}
                >
                  <Icon
                    size={Math.round(56 * zone.scale)}
                    color={OB1.STEEL}
                    strokeWidth={1.5}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 115),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(8 * zone.scale),
              }}
            >
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
                Copycats
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.CYAN,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Easy Install
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

export const AP_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  Bot,
  User,
  Zap,
  TrendingDown,
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
    // DESIGN SPEC for AF-004-FasterThanAny
    // FOCAL: Two side-by-side comparison columns (Agent vs Human analyst)
    // SUPPORTING (4 elements total):
    //   - LEFT column: Bot icon (64px) + 2 bars (speed: tall cyan, volume: tall cyan)
    //   - RIGHT column: User icon (64px) + 2 bars (speed: short amber, volume: short amber)
    //   - Labels: "Agent" (56px) and "Analyst" (56px) below icons
    //   - Bar labels: "Speed" and "Volume" (48px each)
    // TEXT ON SCREEN:
    //   - "Agent" (56px) — 5 chars
    //   - "Analyst" (56px) — 7 chars
    //   - "Speed" (48px) — 5 chars
    //   - "Volume" (48px) — 6 chars
    //   Total visible: 23 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Icons and labels fade in
    //   - 1.5-3.5s: Agent bars grow to full height (staggered)
    //   - 3.5-5.5s: Human bars grow to short height (staggered)
    //   - 5.5-7s: Hold, subtle pulse
    // LOGOS: None (abstract concept using lucide icons)
    // ELEMENT COUNT: 2 columns (each column is 1 grouped element) = 2 ✓
    // PHONE TEST: All text ≥48px, icons 64px ✓

    id: "AF-004-FasterThanAny",
    title: "Agent Advantage",
    subtitle: "Research at scale",
    bottomLabel: "Agents process earnings reports faster than any human analyst",
    bottomAccent: "faster",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(64 * zone.scale);
      const barWidth = zone.width * 0.14;
      const maxBarHeight = zone.height * 0.4;
      const gap = zone.width * 0.08;

      const agentSpeedHeight = ease(sceneFrame, 45, 75) * maxBarHeight;
      const agentVolumeHeight = ease(sceneFrame, 60, 90) * maxBarHeight * 0.85;
      const humanSpeedHeight = ease(sceneFrame, 105, 135) * maxBarHeight * 0.25;
      const humanVolumeHeight = ease(sceneFrame, 120, 150) * maxBarHeight * 0.2;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: gap * 2,
          }}
        >
          {/* Agent column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 10, fps), zIndex: 1 }}>
              <Bot size={iconSize} color={OB1.CYAN} strokeWidth={2} />
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
                ...fadeInUp(sceneFrame, 20),
              }}
            >
              Agent
            </div>

            <div style={{ display: "flex", gap, marginTop: Math.round(16 * zone.scale) }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(12 * zone.scale) }}>
                <div
                  style={{
                    width: barWidth,
                    height: agentSpeedHeight,
                    backgroundColor: OB1.CYAN,
                    borderRadius: Math.round(4 * zone.scale),
                  }}
                />
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(sceneFrame, 70, 85),
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  Speed
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(12 * zone.scale) }}>
                <div
                  style={{
                    width: barWidth,
                    height: agentVolumeHeight,
                    backgroundColor: OB1.CYAN,
                    borderRadius: Math.round(4 * zone.scale),
                  }}
                />
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(sceneFrame, 85, 100),
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  Volume
                </div>
              </div>
            </div>
          </div>

          {/* Human analyst column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 25, fps), zIndex: 1 }}>
              <User size={iconSize} color={OB1.AMBER} strokeWidth={2} />
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
                ...fadeInUp(sceneFrame, 35),
              }}
            >
              Analyst
            </div>

            <div style={{ display: "flex", gap, marginTop: Math.round(16 * zone.scale) }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(12 * zone.scale) }}>
                <div
                  style={{
                    width: barWidth,
                    height: humanSpeedHeight,
                    backgroundColor: OB1.AMBER,
                    borderRadius: Math.round(4 * zone.scale),
                  }}
                />
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(sceneFrame, 130, 145),
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  Speed
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(12 * zone.scale) }}>
                <div
                  style={{
                    width: barWidth,
                    height: humanVolumeHeight,
                    backgroundColor: OB1.AMBER,
                    borderRadius: Math.round(4 * zone.scale),
                  }}
                />
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    opacity: ease(sceneFrame, 145, 160),
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  Volume
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AF-005-FasterThanWe
    // FOCAL: Large "50x" number (140px) breaking through horizontal barrier line
    // SUPPORTING (2):
    //   - Left: Zap icon (64px) + "Agent" label (48px) — represents instant startup
    //   - Right: TrendingDown icon (64px) + "Human Tolerance" label (48px) — represents slow tools
    //   - Horizontal line barrier across center (zIndex 0) with 50x overlaying it (zIndex 10)
    // TEXT ON SCREEN:
    //   - "50x" (140px) — 3 chars
    //   - "Agent" (48px) — 5 chars
    //   - "Human Tolerance" (48px) — 15 chars
    //   Total visible: 23 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Barrier line draws horizontally
    //   - 1-2.5s: "50x" fades in and scales up, breaking through barrier
    //   - 2.5-4.5s: Left icon (Agent/Zap) and right icon (TrendingDown) pop in
    //   - 4.5-7s: Hold with subtle pulse on 50x
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 1 focal (50x) + 2 supporting (left icon + right icon) = 3 ✓
    // PHONE TEST: 50x is 140px, labels 48px, icons 64px ✓

    id: "AF-005-FasterThanWe",
    title: "Speed Barrier",
    subtitle: "50x faster than human tolerance",
    bottomLabel: "Agents operate 50x faster than we tolerate slow tools",
    bottomAccent: "50x",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const lineProgress = ease(sceneFrame, 0, 30);
      const lineWidth = lineProgress * zone.width * 0.7;

      const iconSize = Math.round(64 * zone.scale);

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
          {/* Horizontal barrier line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: lineWidth,
              height: Math.round(4 * zone.scale),
              backgroundColor: OB1.DIM,
              zIndex: 0,
            }}
          />

          {/* Central "50x" breaking through */}
          <div
            style={{
              ...bouncePop(sceneFrame, 30, fps),
              fontSize: Math.round(140 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 900,
              color: OB1.ORANGE,
              zIndex: 10,
              position: "relative",
              textShadow: `0 0 ${Math.round(40 * zone.scale)}px ${OB1.ORANGE}80`,
            }}
          >
            50x
          </div>

          {/* Left: Agent icon + label */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 75),
              }}
            >
              <div style={{ zIndex: 1 }}>
                <Zap size={iconSize} color={OB1.CYAN} strokeWidth={2} fill={OB1.CYAN} />
              </div>
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
                Agent
              </div>
            </div>
          </div>

          {/* Right: Human tolerance icon + label */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.05,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 90),
              }}
            >
              <div style={{ zIndex: 1 }}>
                <TrendingDown size={iconSize} color={OB1.RED} strokeWidth={2} />
              </div>
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
                Human
                <br />
                Tolerance
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AF-006-FasterAndWere
    // FOCAL: Three horizontal flow bars showing speed degradation
    //   - Top: "Model Speed 50x" (GREEN bar, full width)
    //   - Middle: "Realized 2-3x" (AMBER bar, ~5% width)
    //   - Bottom: "47x Lost" (RED bar, 95% width) with "Tooling Friction" label
    // SUPPORTING (1): ArrowRight icon connecting top to middle, showing degradation
    // TEXT ON SCREEN:
    //   - "Model 50x" (56px) — 9 chars
    //   - "Realized 2-3x" (56px) — 13 chars
    //   - "47x Lost to Friction" (56px) — 19 chars
    //   Total visible: 41 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Green "Model 50x" bar grows from left
    //   - 1.5-3s: Arrow appears
    //   - 3-4.5s: Amber "Realized 2-3x" bar appears (small)
    //   - 4.5-6s: Red "47x Lost" bar grows from left, label appears
    //   - 6-7s: Hold
    // LOGOS: None (abstract diagram)
    // ELEMENT COUNT: 3 bars (grouped as 1 flow diagram) + 1 arrow = 2 ✓
    // PHONE TEST: All labels 56px ✓

    id: "AF-006-FasterAndWere",
    title: "Speed Gap",
    subtitle: "Where performance goes",
    bottomLabel: "47x speed lost to tooling friction between model and user",
    bottomAccent: "47x",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const barHeight = Math.round(80 * zone.scale);
      const gap = zone.height * 0.12;

      const modelBarWidth = ease(sceneFrame, 10, 45) * zone.width * 0.85;
      const realizedBarWidth = ease(sceneFrame, 90, 120) * zone.width * 0.08;
      const lostBarWidth = ease(sceneFrame, 135, 165) * zone.width * 0.85;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap,
          }}
        >
          {/* Model Speed 50x (GREEN) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              width: "100%",
            }}
          >
            <div
              style={{
                width: modelBarWidth,
                height: barHeight,
                backgroundColor: OB1.GREEN,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                alignItems: "center",
                paddingLeft: Math.round(24 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 40, 55),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Model 50x
              </div>
            </div>
          </div>

          {/* Arrow downward */}
          <div
            style={{
              alignSelf: "center",
              ...fadeInUp(sceneFrame, 60),
              zIndex: 1,
            }}
          >
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={3}
              style={{ transform: "rotate(90deg)" }}
            />
          </div>

          {/* Realized 2-3x (AMBER) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              width: "100%",
              opacity: ease(sceneFrame, 90, 120),
            }}
          >
            <div
              style={{
                width: realizedBarWidth,
                height: barHeight,
                backgroundColor: OB1.AMBER,
                borderRadius: Math.round(8 * zone.scale),
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.AMBER,
                zIndex: 10,
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              2-3x Realized
            </div>
          </div>

          {/* 47x Lost (RED) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              width: "100%",
            }}
          >
            <div
              style={{
                width: lostBarWidth,
                height: barHeight,
                backgroundColor: OB1.RED,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                alignItems: "center",
                paddingLeft: Math.round(24 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 160, 175),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                47x Lost to Friction
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

export const AF_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

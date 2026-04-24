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
  User,
  Bot,
  Sparkles,
  Settings,
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
    id: "AIA-004-IterationRate",
    title: "Iteration Rate",
    subtitle: "Human vs Agent",
    bottomLabel: "Agents run hundreds of experiments while you sleep",
    bottomAccent: "hundreds",
    render: (frame, fps, zone) => {
      // DESIGN SPEC for AIA-004-IterationRate
      // FOCAL: Side-by-side comparison with animated counters showing iteration disparity
      // SUPPORTING (3):
      //   1. Human icon (User) with counter "8-10/day"
      //   2. Bot icon (Bot) with counter "100+/night"
      //   3. Visual separator line between the two
      // TEXT ON SCREEN:
      //   - "Human" (48px) — 5 chars
      //   - "8-10" (80px counter) — 4 chars
      //   - "/day" (48px) — 4 chars
      //   - "Agent" (48px) — 5 chars
      //   - "100+" (80px counter) — 4 chars
      //   - "/night" (48px) — 6 chars
      //   Total visible: 28 chars ✓
      // PHASES:
      //   - 0-1s: Human side fades in
      //   - 1-2s: Human counter animates up
      //   - 2-3s: Separator line draws
      //   - 3-4s: Agent side fades in
      //   - 4-6s: Agent counter animates up
      //   - 6-7s: Hold
      // ELEMENT COUNT: 2 groups ✓

      const sceneFrame = Math.max(0, frame - 90);

      const humanCount = countUp(sceneFrame, 30, 60, 10);
      const agentCount = countUp(sceneFrame, 120, 180, 100);
      const separatorHeight = ease(sceneFrame, 60, 90) * (zone.height * 0.5);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
            position: "relative",
          }}
        >
          {/* Human side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              ...fadeInUp(sceneFrame, 0, 30),
            }}
          >
            <User
              size={Math.round(72 * zone.scale)}
              color={OB1.STEEL}
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
              Human
            </div>
            <div
              style={{
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              {humanCount < 10 ? humanCount : "8-10"}
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 400,
                color: OB1.DIM,
                zIndex: 10,
                position: "relative",
              }}
            >
              /day
            </div>
          </div>

          {/* Separator line */}
          <div
            style={{
              width: Math.round(3 * zone.scale),
              height: separatorHeight,
              backgroundColor: OB1.DIM,
              borderRadius: Math.round(2 * zone.scale),
              zIndex: 0,
            }}
          />

          {/* Agent side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              ...fadeInUp(sceneFrame, 90, 30),
            }}
          >
            <Bot
              size={Math.round(72 * zone.scale)}
              color={OB1.ORANGE}
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
              Agent
            </div>
            <div
              style={{
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              {agentCount < 100 ? agentCount : "100+"}
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 400,
                color: OB1.DIM,
                zIndex: 10,
                position: "relative",
              }}
            >
              /night
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "AIA-005-Autoagent",
    title: "Autoagent",
    subtitle: "Meta-optimization",
    bottomLabel: "The agent that improves the agent",
    bottomAccent: "improves",
    render: (frame, fps, zone) => {
      // DESIGN SPEC for AIA-005-Autoagent
      // FOCAL: Two-layer stack diagram with connecting arrow
      // SUPPORTING (2):
      //   1. Top layer: "Meta-Agent" box with Sparkles icon
      //   2. Bottom layer: "Task Agent Harness" box with Settings icon
      // TEXT ON SCREEN:
      //   - "Meta-Agent" (60px) — 10 chars
      //   - "Optimizes" (48px on arrow) — 9 chars
      //   - "Task Agent Harness" (60px) — 18 chars
      //   Total visible: 37 chars ✓
      // PHASES:
      //   - 0-1.5s: Bottom layer fades in
      //   - 1.5-3s: Arrow draws upward
      //   - 3-4.5s: Top layer fades in
      //   - 4.5-7s: Subtle pulse
      // ELEMENT COUNT: 2 boxes + 1 arrow = 3 ✓

      const sceneFrame = Math.max(0, frame - 90);

      const boxWidth = zone.width * 0.65;
      const boxHeight = zone.height * 0.22;
      const layerGap = zone.height * 0.18;
      const arrowLength = ease(sceneFrame, 45, 90) * layerGap;
      const pulseVal = pulse(sceneFrame - 135, 0.03);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: layerGap,
            position: "relative",
          }}
        >
          {/* Meta-Agent (top) */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 90, 45),
            }}
          >
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.PURPLE}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(20 * zone.scale),
                position: "relative",
                zIndex: 1,
                boxShadow: `0 0 ${Math.round(20 * (0.5 + pulseVal * 0.5) * zone.scale)}px ${OB1.PURPLE}60`,
              }}
            >
              <Sparkles
                size={Math.round(64 * zone.scale)}
                color={OB1.PURPLE}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
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
                Meta-Agent
              </div>
            </div>
          </div>

          {/* Arrow with label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 0,
            }}
          >
            <div
              style={{
                width: Math.round(3 * zone.scale),
                height: arrowLength,
                backgroundColor: OB1.STEEL,
                borderRadius: Math.round(2 * zone.scale),
              }}
            />
            {sceneFrame > 75 && (
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.STEEL,
                  marginTop: Math.round(8 * zone.scale),
                  opacity: ease(sceneFrame, 75, 90),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Optimizes
              </div>
            )}
          </div>

          {/* Task Agent Harness (bottom) */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0, 45),
            }}
          >
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(20 * zone.scale),
                position: "relative",
                zIndex: 1,
                boxShadow: `0 0 ${Math.round(20 * (0.5 + pulseVal * 0.5) * zone.scale)}px ${OB1.CYAN}60`,
              }}
            >
              <Settings
                size={Math.round(64 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
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
                Task Agent Harness
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "AIA-006-ClaimedVsVerified",
    title: "Claimed vs Verified",
    subtitle: "Performance gap",
    bottomLabel: "Trust the benchmarks, not the marketing",
    bottomAccent: "benchmarks",
    render: (frame, fps, zone) => {
      // DESIGN SPEC for AIA-006-ClaimedVsVerified
      // FOCAL: Two bars showing performance gap (claimed vs verified)
      // SUPPORTING (2):
      //   1. Tall "Claimed" bar (amber, extends high)
      //   2. Shorter "Verified" bar (cyan, shows reality)
      // TEXT ON SCREEN:
      //   - "Claimed" (48px) — 7 chars
      //   - "Verified" (48px) — 8 chars
      //   - "Performance Gap" (60px) — 15 chars
      //   Total visible: 30 chars ✓
      // PHASES:
      //   - 0-2s: Verified bar animates up
      //   - 2-3s: Claimed bar animates up (shows gap)
      //   - 3-5s: Gap highlight bracket
      //   - 5-7s: Bottom label fades in
      // ELEMENT COUNT: 2 bars + 1 label = 3 ✓

      const sceneFrame = Math.max(0, frame - 90);

      const barWidth = zone.width * 0.18;
      const maxBarHeight = zone.height * 0.55;
      const verifiedHeight = ease(sceneFrame, 0, 60) * (maxBarHeight * 0.55);
      const claimedHeight = ease(sceneFrame, 60, 90) * maxBarHeight;
      const gapBracketOpacity = ease(sceneFrame, 90, 120);

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
          {/* Bars container */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: zone.width * 0.15,
              marginBottom: zone.height * 0.08,
            }}
          >
            {/* Verified bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.CYAN,
                  opacity: ease(sceneFrame, 30, 60),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Verified
              </div>
              <div
                style={{
                  width: barWidth,
                  height: verifiedHeight,
                  backgroundColor: OB1.CYAN,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  zIndex: 1,
                }}
              />
            </div>

            {/* Claimed bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.AMBER,
                  opacity: ease(sceneFrame, 60, 90),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Claimed
              </div>
              <div
                style={{
                  width: barWidth,
                  height: claimedHeight,
                  backgroundColor: OB1.AMBER,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.AMBER}`,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Gap bracket indicator */}
                {sceneFrame > 90 && (
                  <div
                    style={{
                      position: "absolute",
                      right: Math.round(-40 * zone.scale),
                      top: verifiedHeight,
                      height: claimedHeight - verifiedHeight,
                      width: Math.round(30 * zone.scale),
                      borderRight: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                      borderTop: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                      borderBottom: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                      opacity: gapBracketOpacity,
                      zIndex: 0,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bottom label */}
          <div
            style={{
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              opacity: ease(sceneFrame, 150, 180),
              zIndex: 10,
              position: "relative",
            }}
          >
            Performance Gap
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

export const AIA_CLIPS_B = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

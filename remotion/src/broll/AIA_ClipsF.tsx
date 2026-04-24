import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
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
  Users,
  Scissors,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
  CheckCircle2,
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
    id: "AIA-016-TeamAsymmetry",
    title: "Team Size",
    subtitle: "Asymmetric advantage",
    bottomLabel: "Small teams with AI tools compete with large enterprises",
    bottomAccent: "compete",
    render: (frame, fps, zone) => {
      // DESIGN SPEC for AIA-016-TeamAsymmetry
      // FOCAL: Two contrasting groups side-by-side with vertical separator
      //   LEFT: 3 person icons stacked + "$500" label (small lean team)
      //   RIGHT: Dense 4x5 grid of 20 person icons + "$$$" label (enterprise)
      // SUPPORTING (1): Vertical divider line between groups
      // TEXT ON SCREEN:
      //   - "3 People" (60px, above left) — 8 chars
      //   - "$500" (72px, below left) — 4 chars
      //   - "20 People" (60px, above right) — 9 chars
      //   - "$$$" (72px, below right) — 3 chars
      //   Total visible: 24 chars ✓
      // PHASES:
      //   - 0-1.5s: Left group fades in
      //   - 1.5-2.5s: Separator draws
      //   - 2.5-4.5s: Right group fades in
      //   - 4.5-7s: Hold
      // ELEMENT COUNT: 2 groups + separator (within 4 max) ✓
      // PHONE TEST: All text ≥60px ✓

      const sceneFrame = Math.max(0, frame - 90);

      const leftOpacity = ease(sceneFrame, 0, 45);
      const separatorHeight = ease(sceneFrame, 45, 75) * zone.height * 0.7;
      const rightOpacity = ease(sceneFrame, 75, 135);

      const iconSize = Math.round(64 * zone.scale);
      const smallIconSize = Math.round(40 * zone.scale);

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
          {/* LEFT GROUP: Small team */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              opacity: leftOpacity,
              marginRight: zone.width * 0.08,
            }}
          >
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
              3 People
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(16 * zone.scale),
              }}
            >
              {[0, 1, 2].map((i) => (
                <Users
                  key={i}
                  size={iconSize}
                  color={OB1.GREEN}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              $500
            </div>
          </div>

          {/* SEPARATOR */}
          <div
            style={{
              width: Math.round(4 * zone.scale),
              height: separatorHeight,
              backgroundColor: OB1.STEEL,
              zIndex: 0,
            }}
          />

          {/* RIGHT GROUP: Enterprise team */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              opacity: rightOpacity,
              marginLeft: zone.width * 0.08,
            }}
          >
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
              20 People
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: Math.round(12 * zone.scale),
              }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <Users
                  key={i}
                  size={smallIconSize}
                  color={OB1.AMBER}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.AMBER,
                zIndex: 10,
                position: "relative",
              }}
            >
              $$$
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "AIA-017-Bottleneck",
    title: "Remove Friction",
    subtitle: "Enterprise enablement",
    bottomLabel: "Cut red tape to unlock small teams inside large organizations",
    bottomAccent: "unlock",
    render: (frame, fps, zone) => {
      // DESIGN SPEC for AIA-017-Bottleneck
      // FOCAL: Horizontal flow pipeline showing bottleneck removal
      //   Wide pipe → narrow constriction → scissors cutting → wide pipe
      // SUPPORTING:
      //   - Red X over bottleneck section
      //   - Green checkmark at output
      //   - Animated scissors cutting motion
      // TEXT ON SCREEN:
      //   - "BOTTLENECK" (60px, at constriction) — 10 chars
      //   - "REMOVED" (60px, after cut) — 7 chars
      //   Total: 17 chars ✓
      // PHASES:
      //   - 0-2s: Pipeline with bottleneck fades in
      //   - 2-3.5s: Red X appears on bottleneck
      //   - 3.5-5s: Scissors cut animation
      //   - 5-7s: Green checkmark, bottleneck fades out
      // ELEMENT COUNT: 3 (pipeline + scissors + status icons) ✓
      // PHONE TEST: Text at 60px ✓

      const sceneFrame = Math.max(0, frame - 90);

      const pipeOpacity = ease(sceneFrame, 0, 60);
      const xOpacity = ease(sceneFrame, 60, 90);
      const scissorsProgress = ease(sceneFrame, 105, 150);
      const bottleneckFade = 1 - ease(sceneFrame, 150, 180);
      const checkOpacity = ease(sceneFrame, 150, 180);

      const pipeWidth = zone.width * 0.25;
      const pipeHeight = Math.round(80 * zone.scale);
      const bottleneckWidth = zone.width * 0.08;
      const bottleneckHeight = Math.round(40 * zone.scale);

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
          {/* Pipeline visualization */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              opacity: pipeOpacity,
              position: "relative",
            }}
          >
            {/* Left wide pipe */}
            <div
              style={{
                width: pipeWidth,
                height: pipeHeight,
                backgroundColor: OB1.CYAN,
                borderRadius: Math.round(8 * zone.scale),
                zIndex: 1,
              }}
            />

            {/* Bottleneck section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                opacity: bottleneckFade,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                  marginBottom: Math.round(8 * zone.scale),
                }}
              >
                BOTTLENECK
              </div>
              <div
                style={{
                  width: bottleneckWidth,
                  height: bottleneckHeight,
                  backgroundColor: OB1.RED,
                  borderRadius: Math.round(4 * zone.scale),
                  zIndex: 1,
                  position: "relative",
                }}
              />
              {/* Red X on bottleneck */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: xOpacity,
                  zIndex: 10,
                }}
              >
                <X
                  size={Math.round(80 * zone.scale)}
                  color={OB1.RED}
                  strokeWidth={4}
                />
              </div>
            </div>

            {/* Right wide pipe */}
            <div
              style={{
                width: pipeWidth,
                height: pipeHeight,
                backgroundColor: OB1.GREEN,
                borderRadius: Math.round(8 * zone.scale),
                zIndex: 1,
              }}
            />
          </div>

          {/* Scissors animation */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${scissorsProgress * 45}deg)`,
              opacity: scissorsProgress,
              zIndex: 10,
            }}
          >
            <Scissors
              size={Math.round(96 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
            />
          </div>

          {/* "REMOVED" label with checkmark */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.15,
              opacity: checkOpacity,
              display: "flex",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              zIndex: 10,
            }}
          >
            <CheckCircle2
              size={Math.round(64 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
            />
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                position: "relative",
              }}
            >
              REMOVED
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "AIA-018-Goodhart",
    title: "Goodhart's Law",
    subtitle: "Metric vs reality",
    bottomLabel: "When a measure becomes a target, it ceases to be a good measure",
    bottomAccent: "target",
    render: (frame, fps, zone) => {
      // DESIGN SPEC for AIA-018-Goodhart (REVISED for vertical budget)
      // FOCAL: Diverging arrows showing metric/outcome split
      //   TOP: Green upward arrow + "METRIC" label (improving)
      //   BOTTOM: Red downward arrow + "OUTCOME" label (degrading)
      //   CENTER: Warning triangle pulsing
      // SUPPORTING: Visual divergence creates tension
      // TEXT ON SCREEN:
      //   - "METRIC" (48px, top) — 6 chars
      //   - "OUTCOME" (48px, bottom) — 7 chars
      //   Total: 13 chars ✓
      // VERTICAL BUDGET:
      //   - Top label: 48px
      //   - Gap: 12px
      //   - Arrow icon: 80px
      //   - Arrow length: ~87px (15% of 576px)
      //   - Gap: ~35px (6%)
      //   - Warning: 64px
      //   - Gap: ~35px (6%)
      //   - Arrow length: ~87px (15%)
      //   - Arrow icon: 80px
      //   - Gap: 12px
      //   - Bottom label: 48px
      //   Total: ~488px (84% of zone.height) ✓
      // PHASES:
      //   - 0-1.5s: Metric arrow rises (green)
      //   - 1.5-3s: Outcome arrow falls (red)
      //   - 3-4.5s: Warning triangle fades in + pulse
      //   - 4.5-7s: Hold with pulse
      // ELEMENT COUNT: 3 (2 arrows + warning) ✓
      // PHONE TEST: Text at 48px, icons at 80px, warning at 64px ✓

      const sceneFrame = Math.max(0, frame - 90);

      const metricProgress = ease(sceneFrame, 0, 45);
      const outcomeProgress = ease(sceneFrame, 45, 90);
      const warningOpacity = ease(sceneFrame, 90, 135);
      const pulseVal = pulse(sceneFrame - 90, 0.04);

      const arrowLength = zone.height * 0.15;
      const arrowThickness = Math.round(8 * zone.scale);
      const arrowHeadSize = Math.round(40 * zone.scale);

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
            gap: zone.height * 0.06,
          }}
        >
          {/* TOP: Metric trending up */}
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
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              METRIC
            </div>
            <div
              style={{
                height: arrowLength * metricProgress,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TrendingUp
                size={Math.round(80 * zone.scale * metricProgress)}
                color={OB1.GREEN}
                strokeWidth={3}
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          {/* CENTER: Warning triangle */}
          <div
            style={{
              ...bouncePop(sceneFrame, 90, fps),
              opacity: warningOpacity * (0.7 + pulseVal * 0.3),
              zIndex: 10,
            }}
          >
            <AlertTriangle
              size={Math.round(64 * zone.scale)}
              color={OB1.AMBER}
              strokeWidth={3}
            />
          </div>

          {/* BOTTOM: Outcome trending down */}
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
                height: arrowLength * outcomeProgress,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TrendingDown
                size={Math.round(80 * zone.scale * outcomeProgress)}
                color={OB1.RED}
                strokeWidth={3}
                style={{ zIndex: 1 }}
              />
            </div>
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
              OUTCOME
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

export const AIA_CLIPS_F = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

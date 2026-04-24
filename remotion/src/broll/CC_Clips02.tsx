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
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Bug,
  Clock,
  BarChart3,
  Layers,
  Zap,
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
    // DESIGN SPEC for CC-004-AgentRecovery
    // FOCAL: Two paths from center failure icon (AlertTriangle 80px):
    //   LEFT: Green checkmark + "Backup Logic" (recovery path)
    //   RIGHT: Red X + "Stuck Modal" (failure path)
    // SUPPORTING (3):
    //   - Center AlertTriangle at 80px
    //   - Left: CheckCircle2 at 64px + label
    //   - Right: XCircle at 64px + label
    // TEXT ON SCREEN:
    //   - "FAILURE DETECTED" (60px, above center) — 16 chars
    //   - "Recovery" (48px, left path) — 8 chars
    //   - "Stuck" (48px, right path) — 5 chars
    //   Total visible: 29 chars ✓
    // PHASES:
    //   - 0-1.5s: Center AlertTriangle fades in
    //   - 1.5-3s: Connecting lines draw left/right
    //   - 3-5s: Left path (green check + label) fades in
    //   - 5-7s: Right path (red X + label) fades in
    // ELEMENT COUNT: 3 icons + labels (within 4 max) ✓
    // PHONE TEST: All text 48-60px ✓
    id: "CC-004-actually-use-this-195-020",
    title: "Agent Failure",
    subtitle: "Recovery vs. stuck",
    bottomLabel: "Smart agents retry with backup logic instead of freezing",
    bottomAccent: "backup logic",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.4;
      const branchY = zone.height * 0.65;
      const leftX = zone.width * 0.25;
      const rightX = zone.width * 0.75;

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
          {/* Connecting lines - zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            {/* Left line (recovery) */}
            <line
              x1={centerX}
              y1={centerY + Math.round(40 * zone.scale)}
              x2={leftX}
              y2={branchY - Math.round(40 * zone.scale)}
              stroke={OB1.GREEN}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeDasharray={ease(sceneFrame, 45, 75) * 400}
              strokeDashoffset={400 - ease(sceneFrame, 45, 75) * 400}
            />
            {/* Right line (stuck) */}
            <line
              x1={centerX}
              y1={centerY + Math.round(40 * zone.scale)}
              x2={rightX}
              y2={branchY - Math.round(40 * zone.scale)}
              stroke={OB1.RED}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeDasharray={ease(sceneFrame, 45, 75) * 400}
              strokeDashoffset={400 - ease(sceneFrame, 45, 75) * 400}
            />
          </svg>

          {/* Center: Failure detection */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <AlertTriangle
                size={Math.round(80 * zone.scale)}
                color={OB1.AMBER}
                fill={OB1.AMBER}
                style={{ opacity: 0.3, zIndex: 1 }}
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
                FAILURE
              </div>
            </div>
          </div>

          {/* Left: Recovery path */}
          <div
            style={{
              position: "absolute",
              left: leftX,
              top: branchY,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <CheckCircle2
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                fill={OB1.GREEN}
                style={{ opacity: 0.3, zIndex: 1 }}
              />
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
                Recovery
              </div>
            </div>
          </div>

          {/* Right: Stuck path */}
          <div
            style={{
              position: "absolute",
              left: rightX,
              top: branchY,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <XCircle
                size={Math.round(64 * zone.scale)}
                color={OB1.RED}
                fill={OB1.RED}
                style={{ opacity: 0.3, zIndex: 1 }}
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
                Stuck
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CC-005-TaskSpectrum
    // FOCAL: Three labeled cards in horizontal row showing task types:
    //   1. Bug icon + "Regression Tests" (Cyan)
    //   2. RotateCcw icon + "Bug Reproduction" (Purple)
    //   3. BarChart3 icon + "Legacy Dashboards" (Amber)
    // SUPPORTING: Each card is 240w × 220h min
    // TEXT ON SCREEN:
    //   - "Regression Tests" (44px) — 16 chars
    //   - "Bug Reproduction" (44px) — 16 chars
    //   - "Legacy Dashboards" (44px) — 17 chars
    //   Total visible: 49 chars ✓
    // PHASES:
    //   - 0-2s: Cards 1-3 stagger in (slideIn from bottom)
    //   - 2-7s: Hold
    // ELEMENT COUNT: 3 cards (within 4 max) ✓
    // PHONE TEST: All labels 44px, icons 64px, cards 240+ wide ✓
    id: "CC-005-request-description-or-289-880",
    title: "Task Automation",
    subtitle: "Beyond chat",
    bottomLabel: "Computer use unlocks testing, debugging, and dashboard workflows",
    bottomAccent: "Computer use",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const tasks = [
        {
          icon: Bug,
          label: "Regression Tests",
          color: OB1.CYAN,
          delay: 20
        },
        {
          icon: RotateCcw,
          label: "Bug Reproduction",
          color: OB1.PURPLE,
          delay: 35
        },
        {
          icon: BarChart3,
          label: "Legacy Dashboards",
          color: OB1.AMBER,
          delay: 50
        },
      ];

      const cardWidth = zone.width * 0.26;
      const cardHeight = zone.height * 0.5;
      const gap = zone.width * 0.04;

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
          {tasks.map((task, i) => {
            const Icon = task.icon;
            return (
              <div
                key={i}
                style={{
                  ...slideIn(sceneFrame, task.delay, 25, "up", 60),
                }}
              >
                <div
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(3 * zone.scale)}px solid ${task.color}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(20 * zone.scale),
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={Math.round(64 * zone.scale)}
                    color={task.color}
                    style={{ zIndex: 1 }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(44 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      textAlign: "center",
                      paddingLeft: Math.round(12 * zone.scale),
                      paddingRight: Math.round(12 * zone.scale),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {task.label}
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
    // DESIGN SPEC for CC-006-CoworkEvolution
    // FOCAL: 4-stage timeline with arrows showing progression:
    //   Plugins → Scheduled → Computer Use → Dispatch
    // SUPPORTING (4): Each stage = icon + label, connected by arrows
    // TEXT ON SCREEN:
    //   - "Plugins" (48px) — 7 chars
    //   - "Scheduled" (48px) — 9 chars
    //   - "Computer Use" (48px) — 12 chars
    //   - "Dispatch" (48px) — 8 chars
    //   Total visible: 36 chars ✓
    // PHASES:
    //   - 0-1.5s: Stage 1 (Plugins) fades in
    //   - 1.5-3s: Arrow 1 draws
    //   - 3-4.5s: Stage 2 (Scheduled) fades in
    //   - 4.5-5.5s: Arrow 2 draws
    //   - 5.5-6.5s: Stage 3 (Computer Use) fades in
    //   - 6.5-7s: Stage 4 (Dispatch) fades in + arrow 3
    // LOGOS: openai.svg for Cowork/Codex reference
    // ELEMENT COUNT: 4 stages (at 4 max) ✓
    // PHONE TEST: All labels 48px, icons 56px, OpenAI logo 100px ✓
    id: "CC-006-moves-right-Adding-365-080",
    title: "Cowork Evolution",
    subtitle: "Four generations",
    bottomLabel: "From plugins to scheduled tasks to computer use to intelligent dispatch",
    bottomAccent: "intelligent dispatch",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stages = [
        { label: "Plugins", delay: 10, color: OB1.STEEL },
        { label: "Scheduled", delay: 60, color: OB1.CYAN },
        { label: "Computer Use", delay: 110, color: OB1.PURPLE },
        { label: "Dispatch", delay: 150, color: OB1.ORANGE },
      ];

      const stageWidth = zone.width * 0.18;
      const stageY = zone.height * 0.5;
      const totalWidth = stages.length * stageWidth + (stages.length - 1) * zone.width * 0.08;
      const startX = (zone.width - totalWidth) * 0.5 + stageWidth * 0.5;

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
          {/* OpenAI logo top center */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.15,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 5),
                transform: "translate(-50%, -50%)",
              }}
            >
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(100 * zone.scale),
                  height: Math.round(100 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                }}
              />
            </div>
          </div>

          {/* Arrows - zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            {stages.slice(0, -1).map((stage, i) => {
              const x1 = startX + i * (stageWidth + zone.width * 0.08) + stageWidth * 0.4;
              const x2 = startX + (i + 1) * (stageWidth + zone.width * 0.08) - stageWidth * 0.4;
              const arrowDelay = stage.delay + 35;
              const arrowProgress = ease(sceneFrame, arrowDelay, arrowDelay + 15);

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={stageY}
                    x2={x1 + (x2 - x1) * arrowProgress}
                    y2={stageY}
                    stroke={OB1.DIM}
                    strokeWidth={Math.round(3 * zone.scale)}
                  />
                  {arrowProgress > 0.8 && (
                    <polygon
                      points={`${x1 + (x2 - x1) * arrowProgress - Math.round(8 * zone.scale)},${stageY - Math.round(6 * zone.scale)} ${x1 + (x2 - x1) * arrowProgress},${stageY} ${x1 + (x2 - x1) * arrowProgress - Math.round(8 * zone.scale)},${stageY + Math.round(6 * zone.scale)}`}
                      fill={OB1.DIM}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Stages */}
          {stages.map((stage, i) => {
            const stageX = startX + i * (stageWidth + zone.width * 0.08);
            const icons: Record<string, any> = {
              Plugins: Layers,
              Scheduled: Clock,
              "Computer Use": Zap,
              Dispatch: ArrowRight,
            };
            const Icon = icons[stage.label];

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: stageX,
                  top: stageY,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    ...bouncePop(sceneFrame, stage.delay, fps),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(12 * zone.scale),
                  }}
                >
                  <Icon
                    size={Math.round(56 * zone.scale)}
                    color={stage.color}
                    style={{ zIndex: 1 }}
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
                    {stage.label}
                  </div>
                </div>
              </div>
            );
          })}
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

export const CC_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

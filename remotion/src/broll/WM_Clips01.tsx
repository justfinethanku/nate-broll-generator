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
  Database,
  Users,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Layers,
  GitBranch,
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
    // DESIGN SPEC for WM-001-modelAndIt
    // FOCAL: Large glowing central world model node (database icon, 160px) with radial query arrows from 4 user icons (80px each) pointing inward
    // SUPPORTING:
    //   1. "Direct Query" label (48px) above center
    //   2. Red X with "Middle Mgmt Layer" crossed out label (40px, faded) in bottom corner
    // TEXT ON SCREEN:
    //   - "Direct Query" (48px) — 12 chars
    //   - "Middle Mgmt Layer" (40px) — 17 chars
    //   Total visible: 29 chars ✓
    // PHASES:
    //   - 0-1.5s: Central world model fades in with pulse
    //   - 1.5-3s: 4 user icons appear in cardinal directions
    //   - 3-4.5s: Query arrows draw from users to center
    //   - 4.5-7s: Crossed-out middle mgmt layer fades in bottom
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 3 groups (center + 4 users = 1, label = 1, crossed layer = 1) ✓
    // PHONE TEST: All text 40-48px ✓
    id: "WM-001-modelAndIt",
    title: "Direct Query Model",
    subtitle: "Real-time world model access",
    bottomLabel: "Everyone queries the shared world model directly",
    bottomAccent: "directly",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // User positions in cardinal directions
      const radius = Math.min(zone.width, zone.height) * 0.35;
      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const userPositions = [
        { x: centerX, y: centerY - radius, angle: 270 }, // top
        { x: centerX + radius, y: centerY, angle: 0 }, // right
        { x: centerX, y: centerY + radius, angle: 90 }, // bottom
        { x: centerX - radius, y: centerY, angle: 180 }, // left
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
            position: "relative",
          }}
        >
          {/* Pulsing rings around center */}
          {[1, 2, 3].map((ring) => {
            const delay = ring * 10;
            const pulseVal = pulse(sceneFrame - delay, 0.03);
            const ringOpacity =
              ease(sceneFrame, delay, delay + 20) *
              (0.25 - ring * 0.05) *
              (0.5 + pulseVal * 0.5);
            const ringScale = 0.25 + ring * 0.15;

            return (
              <div
                key={ring}
                style={{
                  position: "absolute",
                  width: zone.width * ringScale,
                  height: zone.width * ringScale,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  opacity: ringOpacity,
                  zIndex: 0,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}

          {/* Central world model node */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Database
                  size={Math.round(80 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* "Direct Query" label above center */}
          <div
            style={{
              position: "absolute",
              top: centerY - radius - Math.round(80 * zone.scale),
              left: centerX,
              transform: "translateX(-50%)",
            }}
          >
            <div style={{ ...fadeInUp(sceneFrame, 20) }}>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Direct Query
              </div>
            </div>
          </div>

          {/* 4 User icons in cardinal directions */}
          {userPositions.map((pos, i) => {
            const userDelay = 45 + stagger(i, 0, 8);
            const userOpacity = ease(sceneFrame, userDelay, userDelay + 15);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: pos.y,
                  left: pos.x,
                  transform: "translate(-50%, -50%)",
                  opacity: userOpacity,
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: Math.round(80 * zone.scale),
                    height: Math.round(80 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_DARK,
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Users
                    size={Math.round(40 * zone.scale)}
                    color={OB1.STEEL}
                    strokeWidth={2}
                  />
                </div>
              </div>
            );
          })}

          {/* Query arrows from users to center */}
          {userPositions.map((pos, i) => {
            const arrowDelay = 90 + stagger(i, 0, 8);
            const arrowProgress = ease(sceneFrame, arrowDelay, arrowDelay + 20);
            const arrowLength = radius * 0.4;

            // Calculate arrow start and end points
            const angleRad = (pos.angle * Math.PI) / 180;
            const startX = pos.x;
            const startY = pos.y;
            const endX = centerX;
            const endY = centerY;

            // Calculate current arrow tip position based on progress
            const currentEndX = startX + (endX - startX) * arrowProgress;
            const currentEndY = startY + (endY - startY) * arrowProgress;

            return (
              <svg
                key={`arrow-${i}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: zone.width,
                  height: zone.height,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <marker
                    id={`arrowhead-${i}`}
                    markerWidth={10}
                    markerHeight={10}
                    refX={5}
                    refY={5}
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 5, 0 10"
                      fill={OB1.CYAN}
                      opacity={arrowProgress}
                    />
                  </marker>
                </defs>
                <line
                  x1={startX}
                  y1={startY}
                  x2={currentEndX}
                  y2={currentEndY}
                  stroke={OB1.CYAN}
                  strokeWidth={Math.round(3 * zone.scale)}
                  opacity={arrowProgress * 0.8}
                  markerEnd={`url(#arrowhead-${i})`}
                />
              </svg>
            );
          })}

          {/* Crossed-out "Middle Mgmt Layer" in bottom corner */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.08,
              right: zone.width * 0.08,
              ...fadeInUp(sceneFrame, 135),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                opacity: 0.5,
              }}
            >
              <X
                size={Math.round(48 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
              />
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.DIM,
                  textDecoration: "line-through",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Middle Mgmt Layer
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for WM-002-differentArchitectures
    // FOCAL: Three vertical columns showing different architecture diagrams (each 360px wide, fills zone)
    // SUPPORTING: Each column has a distinct icon (120px) at top + failure mode label (44px) at bottom
    // TEXT ON SCREEN:
    //   - "Type A" / "Type B" / "Type C" (44px each) — 18 chars total
    //   - Three 2-word failure labels (44px each) — ~36 chars total
    //   Total visible: 54 chars ✓
    // PHASES:
    //   - 0-1.5s: Column A fades in
    //   - 1.5-3s: Column B fades in
    //   - 3-4.5s: Column C fades in
    //   - 4.5-7s: Failure mode labels appear below each
    // LOGOS: None (abstract architectures)
    // ELEMENT COUNT: 3 columns ✓
    // PHONE TEST: All labels 44px ✓
    id: "WM-002-differentArchitectures",
    title: "Architecture Types",
    subtitle: "Different models, different failures",
    bottomLabel: "Each architecture has unique failure modes and blind spots",
    bottomAccent: "failure modes",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const columns = [
        {
          label: "Type A",
          icon: Layers,
          color: OB1.CYAN,
          failure: "Stale Data",
          delay: 10,
        },
        {
          label: "Type B",
          icon: GitBranch,
          color: OB1.ORANGE,
          failure: "Sync Lag",
          delay: 45,
        },
        {
          label: "Type C",
          icon: AlertTriangle,
          color: OB1.PURPLE,
          failure: "Bias Drift",
          delay: 80,
        },
      ];

      const columnWidth = zone.width / 3;
      const iconSize = Math.round(120 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: zone.width * 0.04,
          }}
        >
          {columns.map((col, i) => {
            const Icon = col.icon;
            const colOpacity = ease(sceneFrame, col.delay, col.delay + 30);
            const failureOpacity = ease(sceneFrame, 135, 155);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: zone.height * 0.06,
                  opacity: colOpacity,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: Math.round(160 * zone.scale),
                    height: Math.round(160 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(4 * zone.scale)}px solid ${col.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={iconSize}
                    color={col.color}
                    strokeWidth={2}
                  />
                </div>

                {/* Type label */}
                <div
                  style={{
                    fontSize: Math.round(44 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    color: OB1.WHITE,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {col.label}
                </div>

                {/* Architecture diagram representation (simplified stack of bars) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: Math.round(8 * zone.scale),
                    alignItems: "center",
                  }}
                >
                  {[0.8, 0.6, 0.4].map((width, barIdx) => {
                    const barDelay = col.delay + 15 + barIdx * 5;
                    const barOpacity = ease(sceneFrame, barDelay, barDelay + 10);
                    return (
                      <div
                        key={barIdx}
                        style={{
                          width: Math.round(columnWidth * width * 0.6),
                          height: Math.round(12 * zone.scale),
                          backgroundColor: col.color,
                          borderRadius: Math.round(2 * zone.scale),
                          opacity: barOpacity * 0.6,
                          zIndex: 0,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Failure mode label */}
                <div
                  style={{
                    fontSize: Math.round(44 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.RED,
                    opacity: failureOpacity,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {col.failure}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for WM-003-thatDetermineWhether
    // FOCAL: Y-fork decision tree — single principle node at top splits into two outcome paths (success/stagnation)
    // SUPPORTING:
    //   1. Green upward arrow + "Compounds" (56px)
    //   2. Red downward arrow + "Stagnates" (56px)
    // TEXT ON SCREEN:
    //   - "Principles" (60px, top) — 10 chars
    //   - "Compounds" (56px) — 9 chars
    //   - "Stagnates" (56px) — 9 chars
    //   Total visible: 28 chars ✓
    // PHASES:
    //   - 0-1.5s: Top principle node fades in
    //   - 1.5-3s: Fork line draws downward, splits
    //   - 3-4.5s: Left path (green, compounds) appears
    //   - 4.5-6.5s: Right path (red, stagnates) appears
    //   - 6.5-7s: Hold
    // LOGOS: None
    // ELEMENT COUNT: 3 (top node, left outcome, right outcome) ✓
    // PHONE TEST: All text 56-60px ✓
    id: "WM-003-thatDetermineWhether",
    title: "Decision Fork",
    subtitle: "Principles determine outcomes",
    bottomLabel: "Core principles determine if world models compound or stagnate",
    bottomAccent: "compound",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const topY = zone.height * 0.2;
      const forkY = zone.height * 0.5;
      const bottomY = zone.height * 0.75;
      const forkSpread = zone.width * 0.25;

      // Line drawing progress
      const stemProgress = ease(sceneFrame, 45, 75);
      const leftForkProgress = ease(sceneFrame, 90, 120);
      const rightForkProgress = ease(sceneFrame, 135, 165);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          {/* SVG for fork lines */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: zone.width,
              height: zone.height,
              zIndex: 0,
            }}
          >
            {/* Vertical stem */}
            <line
              x1={centerX}
              y1={topY + Math.round(80 * zone.scale)}
              x2={centerX}
              y2={topY + Math.round(80 * zone.scale) + (forkY - topY - Math.round(80 * zone.scale)) * stemProgress}
              stroke={OB1.WHITE}
              strokeWidth={Math.round(4 * zone.scale)}
              opacity={0.6}
            />

            {/* Left fork (compounds - green, upward angle) */}
            <line
              x1={centerX}
              y1={forkY}
              x2={centerX - forkSpread * leftForkProgress}
              y2={forkY + (bottomY - forkY) * leftForkProgress * 0.6}
              stroke={OB1.GREEN}
              strokeWidth={Math.round(4 * zone.scale)}
              opacity={leftForkProgress * 0.8}
            />

            {/* Right fork (stagnates - red, downward angle) */}
            <line
              x1={centerX}
              y1={forkY}
              x2={centerX + forkSpread * rightForkProgress}
              y2={forkY + (bottomY - forkY) * rightForkProgress}
              stroke={OB1.RED}
              strokeWidth={Math.round(4 * zone.scale)}
              opacity={rightForkProgress * 0.8}
            />
          </svg>

          {/* Top principle node */}
          <div
            style={{
              position: "absolute",
              top: topY,
              left: centerX,
              transform: "translateX(-50%)",
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <GitBranch
                  size={Math.round(80 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* "Principles" label */}
          <div
            style={{
              position: "absolute",
              top: topY - Math.round(70 * zone.scale),
              left: centerX,
              transform: "translateX(-50%)",
            }}
          >
            <div style={{ ...fadeInUp(sceneFrame, 20) }}>
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
                Principles
              </div>
            </div>
          </div>

          {/* Left outcome: Compounds (green, upward) */}
          <div
            style={{
              position: "absolute",
              top: bottomY - Math.round(20 * zone.scale),
              left: centerX - forkSpread,
              transform: "translateX(-50%)",
              opacity: ease(sceneFrame, 100, 120),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <TrendingUp
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={3}
              />
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Compounds
              </div>
            </div>
          </div>

          {/* Right outcome: Stagnates (red, downward) */}
          <div
            style={{
              position: "absolute",
              top: bottomY,
              left: centerX + forkSpread,
              transform: "translateX(-50%)",
              opacity: ease(sceneFrame, 145, 165),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <TrendingDown
                size={Math.round(64 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
              />
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Stagnates
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

export const WM_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

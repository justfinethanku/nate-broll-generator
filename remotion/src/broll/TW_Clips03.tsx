import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  slideIn,
  bouncePop,
  stagger,
} from "./shared";
import {
  FileText,
  ArrowRight,
  Link2,
  AlertCircle,
  Lock,
  RefreshCw,
  Network,
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
    // DESIGN SPEC for TW-007-CrossRef
    // FOCAL: Three document cards in a row connected by arrows, showing progression/building
    // SUPPORTING:
    //   1. Link icon above the middle connection (64px)
    //   2. Labels showing "Q1", "Q2", "Q3" progression
    // TEXT ON SCREEN:
    //   - "Q1" (56px) — 2 chars
    //   - "Q2" (56px) — 2 chars
    //   - "Q3" (56px) — 2 chars
    //   - "Building Context" (48px, top label) — 16 chars
    //   Total: 22 chars ✓
    // PHASES:
    //   - 0-1s: "Building Context" label fades in
    //   - 1-2s: Q1 card slides in from left
    //   - 2-3s: Arrow draws, Q2 card slides in
    //   - 3-4.5s: Arrow draws, Q3 card slides in
    //   - 4.5-7s: Link icon pulses above
    // LOGOS: None (abstract concept)
    // ICONS: FileText (in each card, 72px), Link2 (above, 64px), ArrowRight (connectors, 48px)
    // ELEMENT COUNT: 4 (label + 3 cards treated as one flow diagram) ✓
    // PHONE TEST: All text 48px+, icons 64-72px ✓
    id: "TW-007-CrossRef",
    title: "Cross-Referenced",
    subtitle: "Connected knowledge",
    bottomLabel: "Each question builds on previous context, not starting fresh",
    bottomAccent: "builds on",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const cards = [
        { label: "Q1", delay: 30, color: OB1.CYAN },
        { label: "Q2", delay: 60, color: OB1.AMBER },
        { label: "Q3", delay: 90, color: OB1.GREEN },
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
            gap: Math.round(48 * zone.scale),
          }}
        >
          {/* Top label */}
          <div
            style={{
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              zIndex: 10,
              position: "relative",
              ...fadeInUp(sceneFrame, 10),
            }}
          >
            Building Context
          </div>

          {/* Card flow with arrows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.03,
              position: "relative",
            }}
          >
            {cards.map((card, i) => {
              const cardWidth = zone.width * 0.22;
              const cardHeight = Math.round(200 * zone.scale);

              return (
                <React.Fragment key={i}>
                  {/* Card */}
                  <div
                    style={{
                      ...slideIn(sceneFrame, card.delay, 25, "left", 60),
                    }}
                  >
                    <div
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        backgroundColor: `${card.color}15`,
                        border: `${Math.round(3 * zone.scale)}px solid ${card.color}`,
                        borderRadius: Math.round(12 * zone.scale),
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: Math.round(16 * zone.scale),
                        zIndex: 1,
                      }}
                    >
                      <FileText
                        size={Math.round(72 * zone.scale)}
                        color={card.color}
                        strokeWidth={2}
                        style={{ zIndex: 1 }}
                      />
                      <div
                        style={{
                          fontSize: Math.round(56 * zone.scale),
                          fontFamily: FONTS.heading,
                          fontWeight: 700,
                          color: OB1.WHITE,
                          zIndex: 10,
                          position: "relative",
                        }}
                      >
                        {card.label}
                      </div>
                    </div>
                  </div>

                  {/* Arrow between cards */}
                  {i < cards.length - 1 && (
                    <div
                      style={{
                        opacity: ease(sceneFrame, card.delay + 15, card.delay + 30),
                        zIndex: 0,
                      }}
                    >
                      <ArrowRight
                        size={Math.round(48 * zone.scale)}
                        color={OB1.STEEL}
                        strokeWidth={2.5}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Link icon above middle — nested to avoid transform conflict */}
            <div
              style={{
                position: "absolute",
                top: Math.round(-80 * zone.scale),
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div style={{ ...fadeInUp(sceneFrame, 120) }}>
                <Link2
                  size={Math.round(64 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-008-ErrorBake
    // FOCAL: Large locked document/database icon with error symbol overlaid
    // SUPPORTING:
    //   1. "Synthesized Error" label (48px) above
    //   2. Lock icon (80px) integrated into the visual
    //   3. Small timeline showing error becoming permanent (3 phases)
    // TEXT ON SCREEN:
    //   - "Synthesized Error" (48px) — 17 chars
    //   - "Temporary" (44px) — 9 chars
    //   - "Repeated" (44px) — 8 chars
    //   - "Permanent" (44px) — 9 chars
    //   Total: 43 chars ✓
    // PHASES:
    //   - 0-1.5s: Error icon appears (amber alert)
    //   - 1.5-3s: "Temporary" phase fades in
    //   - 3-4.5s: "Repeated" phase fades in
    //   - 4.5-6s: Lock icon appears, "Permanent" phase fades in (red)
    //   - 6-7s: Hold with subtle pulse on lock
    // LOGOS: None (abstract concept)
    // ICONS: AlertCircle (error, 96px), Lock (permanent state, 80px)
    // ELEMENT COUNT: 4 (error icon + 3 timeline phases) ✓
    // PHONE TEST: All text 44-48px, icons 80-96px ✓
    id: "TW-008-ErrorBake",
    title: "Error Baking",
    subtitle: "Permanent misunderstandings",
    bottomLabel: "Synthesized errors become locked-in knowledge over time",
    bottomAccent: "locked-in",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const phases = [
        { label: "Temporary", color: OB1.AMBER, delay: 45 },
        { label: "Repeated", color: OB1.AMBER, delay: 90 },
        { label: "Permanent", color: OB1.RED, delay: 135 },
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
            gap: Math.round(56 * zone.scale),
          }}
        >
          {/* Top label */}
          <div
            style={{
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              zIndex: 10,
              position: "relative",
              ...fadeInUp(sceneFrame, 5),
            }}
          >
            Synthesized Error
          </div>

          {/* Central error icon with lock overlay */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Error alert circle */}
            <div style={{ ...bouncePop(sceneFrame, 15, fps) }}>
              <AlertCircle
                size={Math.round(96 * zone.scale)}
                color={OB1.AMBER}
                strokeWidth={3}
                style={{ zIndex: 1 }}
              />
            </div>

            {/* Lock icon appears later */}
            <div
              style={{
                position: "absolute",
                right: Math.round(-40 * zone.scale),
                bottom: Math.round(-40 * zone.scale),
                ...bouncePop(sceneFrame, 135, fps),
              }}
            >
              <Lock
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          {/* Timeline phases */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.06,
              alignItems: "center",
            }}
          >
            {phases.map((phase, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    ...fadeInUp(sceneFrame, phase.delay),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(12 * zone.scale),
                  }}
                >
                  {/* Phase indicator dot */}
                  <div
                    style={{
                      width: Math.round(24 * zone.scale),
                      height: Math.round(24 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: phase.color,
                      zIndex: 1,
                    }}
                  />
                  {/* Phase label */}
                  <div
                    style={{
                      fontSize: Math.round(44 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: phase.color,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {phase.label}
                  </div>
                </div>

                {/* Arrow between phases */}
                {i < phases.length - 1 && (
                  <div
                    style={{
                      opacity: ease(sceneFrame, phase.delay + 20, phase.delay + 35),
                      zIndex: 0,
                    }}
                  >
                    <ArrowRight
                      size={Math.round(40 * zone.scale)}
                      color={OB1.DIM}
                      strokeWidth={2}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-009-Maintain (REVISED)
    // FOCAL: Central hub node with 3 satellite nodes in triangular radial layout
    // SUPPORTING:
    //   1. Refresh icon in center hub (network/maintenance concept)
    //   2. Connecting lines from hub to satellites
    //   3. Labels for activities: "Connect", "Update", "Summarize" (removed "Link" to avoid title overlap)
    // TEXT ON SCREEN:
    //   - "Active Wiki" (56px, top label) — 11 chars
    //   - "Connect" (48px) — 7 chars
    //   - "Update" (48px) — 6 chars
    //   - "Summarize" (48px) — 9 chars
    //   Total: 33 chars ✓
    // PHASES:
    //   - 0-1s: "Active Wiki" label + center hub appear
    //   - 1-2.5s: Satellites appear in sequence (staggered by 0.4s each)
    //   - 2.5-4s: Connecting lines draw from center to each satellite
    //   - 4-7s: Subtle rotation pulse on center icon
    // LOGOS: None (abstract concept)
    // ICONS: RefreshCw (center hub, 72px), Network (satellites, 64px each)
    // ELEMENT COUNT: 4 (center hub + 3 satellites) ✓
    // PHONE TEST: All text 48-56px, icons 64-72px ✓
    // LAYOUT: Triangle at 210° (bottom-left), 330° (bottom-right), 90° (bottom-center)
    id: "TW-009-Maintain",
    title: "Active Maintenance",
    subtitle: "Living knowledge base",
    bottomLabel: "AI continuously links ideas, updates topics, and writes summaries",
    bottomAccent: "continuously",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width / 2;
      const centerY = zone.height / 2;
      const radius = Math.min(zone.width, zone.height) * 0.35;

      // Triangle layout: bottom-left, bottom-right, bottom (removed top satellite)
      const satellites = [
        { label: "Connect", angle: (210 * Math.PI) / 180, color: OB1.AMBER, delay: 30 },
        { label: "Update", angle: (330 * Math.PI) / 180, color: OB1.GREEN, delay: 42 },
        { label: "Summarize", angle: Math.PI / 2, color: OB1.PURPLE, delay: 54 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            position: "relative",
          }}
        >
          {/* SVG for connecting lines */}
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
            {satellites.map((sat, i) => {
              const endX = centerX + radius * Math.cos(sat.angle);
              const endY = centerY + radius * Math.sin(sat.angle);
              const lineDelay = sat.delay + 15;
              const lineProgress = ease(sceneFrame, lineDelay, lineDelay + 20);

              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={centerX + (endX - centerX) * lineProgress}
                  y2={centerY + (endY - centerY) * lineProgress}
                  stroke={OB1.STEEL}
                  strokeWidth={Math.round(2 * zone.scale)}
                  opacity={lineProgress * 0.5}
                />
              );
            })}
          </svg>

          {/* Top label — nested to avoid transform conflict */}
          <div
            style={{
              position: "absolute",
              top: Math.round(30 * zone.scale),
              left: centerX,
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                zIndex: 10,
                position: "relative",
                ...fadeInUp(sceneFrame, 5),
              }}
            >
              Active Wiki
            </div>
          </div>

          {/* Center hub */}
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
                ...bouncePop(sceneFrame, 15, fps),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                borderRadius: "50%",
                backgroundColor: `${OB1.ORANGE}20`,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                zIndex: 1,
              }}
            >
              <RefreshCw
                size={Math.round(72 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          {/* Satellite nodes */}
          {satellites.map((sat, i) => {
            const x = centerX + radius * Math.cos(sat.angle);
            const y = centerY + radius * Math.sin(sat.angle);

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
                <div
                  style={{
                    ...fadeInUp(sceneFrame, sat.delay),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(12 * zone.scale),
                  }}
                >
                  {/* Satellite circle */}
                  <div
                    style={{
                      width: Math.round(110 * zone.scale),
                      height: Math.round(110 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: `${sat.color}15`,
                      border: `${Math.round(3 * zone.scale)}px solid ${sat.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Network
                      size={Math.round(64 * zone.scale)}
                      color={sat.color}
                      strokeWidth={2}
                      style={{ zIndex: 1 }}
                    />
                  </div>
                  {/* Label below satellite */}
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
                    {sat.label}
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

export const TW_CLIPS_03 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  pulse,
} from "./shared";
import {
  Brain,
  X,
  FileText,
  Cpu,
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
    // DESIGN SPEC for TW-004-Connections (REVISED)
    // FOCAL: Two chat bubbles side-by-side with disconnect symbol between
    // SUPPORTING:
    //   1. Left bubble: labeled "Session 1" with brain icon
    //   2. Right bubble: labeled "Session 2" with brain icon
    //   3. X symbol in center gap showing disconnection
    // TEXT ON SCREEN:
    //   - "Session 1" (64px) — 9 chars
    //   - "Session 2" (64px) — 9 chars
    //   - "Lost" (80px, center) — 4 chars
    //   Total: 22 chars ✓
    // PHASES:
    //   - 0-1s: Left bubble fades in
    //   - 1-2s: Right bubble fades in
    //   - 2-3s: X symbol appears with "Lost" label
    //   - 3-7s: Hold
    // LOGOS: None
    // ICONS: Brain (lucide, 80px inside each bubble)
    // ELEMENT COUNT: 3 (two bubbles + break symbol) ✓
    // PHONE TEST: All text 64px+, icons 80px ✓
    id: "TW-004-Connections",
    title: "Lost Context",
    subtitle: "Between sessions",
    bottomLabel: "Chat sessions don't preserve connections between ideas",
    bottomAccent: "don't preserve",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const bubbleWidth = zone.width * 0.32;
      const bubbleHeight = zone.height * 0.55;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `0 ${Math.round(40 * zone.scale)}px`,
          }}
        >
          {/* Left bubble - Session 1 */}
          <div style={{ ...fadeInUp(sceneFrame, 10) }}>
            <div
              style={{
                width: bubbleWidth,
                height: bubbleHeight,
                backgroundColor: `${OB1.CYAN}20`,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(24 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(20 * zone.scale),
                zIndex: 1,
              }}
            >
              <Brain
                size={Math.round(80 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(64 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Session 1
              </div>
            </div>
          </div>

          {/* Center break symbol */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 60),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            <div
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                borderRadius: "50%",
                backgroundColor: `${OB1.RED}25`,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.RED}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <X
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3.5}
                style={{ zIndex: 1 }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              Lost
            </div>
          </div>

          {/* Right bubble - Session 2 */}
          <div style={{ ...fadeInUp(sceneFrame, 30) }}>
            <div
              style={{
                width: bubbleWidth,
                height: bubbleHeight,
                backgroundColor: `${OB1.PURPLE}20`,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.PURPLE}`,
                borderRadius: Math.round(24 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(20 * zone.scale),
                zIndex: 1,
              }}
            >
              <Brain
                size={Math.round(80 * zone.scale)}
                color={OB1.PURPLE}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(64 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Session 2
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-005-Artifact
    // FOCAL: Single large document/wiki icon with growth rings radiating outward
    // SUPPORTING:
    //   1. Timeline arrow beneath showing "Session 1 → Session 2 → Session 3"
    //   2. Version counter "v1 → v2 → v3" animating upward
    // TEXT ON SCREEN:
    //   - "WIKI" (80px, centered on icon) — 4 chars
    //   - "v1 → v2 → v3" (56px) — 11 chars (including arrows)
    //   - "Evolves" (60px, above icon) — 7 chars
    //   Total: 22 chars ✓
    // PHASES:
    //   - 0-1s: Wiki icon appears with "v1"
    //   - 1-2.5s: First ring expands, counter updates to "v2"
    //   - 2.5-4.5s: Second ring expands, counter updates to "v3"
    //   - 4.5-7s: Subtle pulse on all rings
    // LOGOS: None
    // ICONS: FileText (lucide, 120px)
    // ELEMENT COUNT: 2 (wiki icon + version counter) ✓
    // PHONE TEST: All text 56px+, icon 120px ✓
    id: "TW-005-Artifact",
    title: "Knowledge Artifact",
    subtitle: "Persistent and evolving",
    bottomLabel: "A wiki evolves understanding across sessions over time",
    bottomAccent: "evolves understanding",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Version phases
      const v1Active = sceneFrame >= 0;
      const v2Active = sceneFrame >= 60;
      const v3Active = sceneFrame >= 120;

      // Ring expansion animations
      const ring1Scale = ease(sceneFrame, 30, 75);
      const ring2Scale = ease(sceneFrame, 90, 135);
      const ring3Scale = ease(sceneFrame, 150, 195);

      // Pulse effect for hold phase
      const pulseVal = pulse(sceneFrame, 0.03);

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
          {/* Label above */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 5),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.STEEL,
              marginBottom: Math.round(32 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            Evolves
          </div>

          {/* Radiating rings */}
          <div
            style={{
              position: "relative",
              width: zone.width * 0.6,
              height: zone.width * 0.6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Ring 3 (outermost) */}
            {ring3Scale > 0 && (
              <div
                style={{
                  position: "absolute",
                  width: `${ring3Scale * 100}%`,
                  height: `${ring3Scale * 100}%`,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  opacity: (0.4 + pulseVal * 0.2) * ring3Scale,
                  zIndex: 0,
                }}
              />
            )}

            {/* Ring 2 */}
            {ring2Scale > 0 && (
              <div
                style={{
                  position: "absolute",
                  width: `${ring2Scale * 70}%`,
                  height: `${ring2Scale * 70}%`,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.AMBER}`,
                  opacity: (0.5 + pulseVal * 0.2) * ring2Scale,
                  zIndex: 0,
                }}
              />
            )}

            {/* Ring 1 */}
            {ring1Scale > 0 && (
              <div
                style={{
                  position: "absolute",
                  width: `${ring1Scale * 40}%`,
                  height: `${ring1Scale * 40}%`,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  opacity: (0.6 + pulseVal * 0.2) * ring1Scale,
                  zIndex: 0,
                }}
              />
            )}

            {/* Center icon with label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                zIndex: 1,
              }}
            >
              <FileText
                size={Math.round(120 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                WIKI
              </div>
            </div>
          </div>

          {/* Version counter */}
          <div
            style={{
              marginTop: Math.round(40 * zone.scale),
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.mono,
              fontWeight: 600,
              color: OB1.WHITE,
              display: "flex",
              gap: Math.round(12 * zone.scale),
              alignItems: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            <span
              style={{
                ...fadeInUp(sceneFrame, 15),
                color: v3Active ? OB1.DIM : v2Active ? OB1.DIM : OB1.CYAN,
              }}
            >
              v1
            </span>
            <ArrowRight
              size={Math.round(32 * zone.scale)}
              color={OB1.STEEL}
              style={{ opacity: ease(sceneFrame, 50, 70) }}
            />
            <span
              style={{
                ...fadeInUp(sceneFrame, 60),
                color: v3Active ? OB1.DIM : OB1.AMBER,
              }}
            >
              v2
            </span>
            <ArrowRight
              size={Math.round(32 * zone.scale)}
              color={OB1.STEEL}
              style={{ opacity: ease(sceneFrame, 110, 130) }}
            />
            <span
              style={{
                ...fadeInUp(sceneFrame, 120),
                color: OB1.GREEN,
              }}
            >
              v3
            </span>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-006-DualPane
    // FOCAL: Two side-by-side panes with arrow between them
    // SUPPORTING:
    //   1. Left pane: Robot/CPU icon labeled "AI Agent"
    //   2. Right pane: Obsidian logo labeled "Display"
    //   3. Right-pointing arrow with "writes" label
    // TEXT ON SCREEN:
    //   - "AI Agent" (60px) — 8 chars
    //   - "Display" (60px) — 7 chars
    //   - "writes" (48px on arrow) — 6 chars
    //   Total: 21 chars ✓
    // PHASES:
    //   - 0-1.5s: Left pane (AI) fades in
    //   - 1.5-3s: Arrow draws from left to right
    //   - 3-4.5s: Right pane (Display) fades in
    //   - 4.5-7s: Subtle flow animation on arrow
    // LOGOS: Obsidian (right pane, 120px)
    // ICONS: Cpu (left, 80px)
    // ELEMENT COUNT: 3 (two panes + arrow) ✓
    // PHONE TEST: All text 48px+, icons 80px+ ✓
    id: "TW-006-DualPane",
    title: "Two-Part System",
    subtitle: "Agent + Display",
    bottomLabel: "AI agent writes to persistent notes, viewer displays them",
    bottomAccent: "persistent notes",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const paneWidth = zone.width * 0.35;
      const paneHeight = zone.height * 0.6;

      // Arrow animation
      const arrowProgress = ease(sceneFrame, 45, 90);
      const flowPulse = pulse(sceneFrame - 135, 0.04);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: zone.width * 0.08,
            position: "relative",
          }}
        >
          {/* SVG for arrow */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <defs>
              <marker
                id="arrowhead-tw"
                markerWidth="12"
                markerHeight="12"
                refX="11"
                refY="6"
                orient="auto"
              >
                <polygon
                  points="0 0, 12 6, 0 12"
                  fill={OB1.ORANGE}
                />
              </marker>
            </defs>
            <line
              x1={zone.width * 0.42}
              y1={zone.height / 2}
              x2={zone.width * 0.42 + (zone.width * 0.16 * arrowProgress)}
              y2={zone.height / 2}
              stroke={OB1.ORANGE}
              strokeWidth={Math.round(4 * zone.scale)}
              markerEnd="url(#arrowhead-tw)"
              opacity={0.7 + flowPulse * 0.3}
            />
          </svg>

          {/* Left pane - AI Agent */}
          <div style={{ ...fadeInUp(sceneFrame, 10) }}>
            <div
              style={{
                width: paneWidth,
                height: paneHeight,
                backgroundColor: `${OB1.CYAN}15`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(16 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                zIndex: 1,
              }}
            >
              <Cpu
                size={Math.round(80 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                AI Agent
              </div>
            </div>
          </div>

          {/* Arrow label */}
          <div
            style={{
              position: "absolute",
              left: zone.width / 2,
              top: zone.height / 2 - Math.round(60 * zone.scale),
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              writes
            </div>
          </div>

          {/* Right pane - Display */}
          <div style={{ ...fadeInUp(sceneFrame, 90) }}>
            <div
              style={{
                width: paneWidth,
                height: paneHeight,
                backgroundColor: `${OB1.PURPLE}15`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.PURPLE}`,
                borderRadius: Math.round(16 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                zIndex: 1,
              }}
            >
              <Img
                src={staticFile("logos/obsidian.svg")}
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Display
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

export const TW_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

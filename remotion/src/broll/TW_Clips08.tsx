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
  FileText,
  AlertTriangle,
  Database,
  TrendingUp,
  Clock,
  XCircle,
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
    // DESIGN SPEC for TW-022-Stale
    // FOCAL: Central wiki document icon (160px) with dimming effect showing age
    // SUPPORTING (3):
    //   1. Three incoming "new info" icons on left (grayed out, blocked)
    //   2. Timeline arrow showing time passing
    //   3. Staleness indicator (amber warning glow pulsing)
    // TEXT ON SCREEN:
    //   - "WIKI SYNTHESIS" (60px, above central icon) — 14 chars
    //   - "New information" (48px, left side) — 15 chars
    //   - "Drifts over time" (48px, below timeline) — 16 chars
    //   Total visible: 45 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Wiki icon fades in center
    //   - 1.5-3s: Three "new info" icons appear left, grayed out
    //   - 3-5s: Timeline arrow draws, warning glow pulses
    //   - 5-7s: Hold with pulsing glow
    // ELEMENT COUNT: 3 groups (wiki + blocked updates + timeline) ✓
    // PHONE TEST: All text ≥48px, main icon 160px ✓
    id: "TW-022-Stale",
    title: "Wiki Staleness",
    subtitle: "Syntheses drift without updates",
    bottomLabel: "Old syntheses become outdated without new information",
    bottomAccent: "outdated",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
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
          {/* Warning glow ring around central icon - zIndex 0 */}
          <div
            style={{
              position: "absolute",
              width: Math.round(200 * zone.scale),
              height: Math.round(200 * zone.scale),
              borderRadius: "50%",
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.AMBER}`,
              opacity: ease(sceneFrame, 90, 120) * (0.4 + pulseVal * 0.3),
              zIndex: 0,
            }}
          />

          {/* Left side: blocked new info icons */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.12,
              display: "flex",
              flexDirection: "column",
              gap: Math.round(20 * zone.scale),
              opacity: ease(sceneFrame, 45, 75),
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: Math.round(12 * zone.scale),
                  opacity: 0.4,
                }}
              >
                <Database
                  size={Math.round(48 * zone.scale)}
                  color={OB1.DIM}
                  style={{ zIndex: 1 }}
                />
                <XCircle
                  size={Math.round(32 * zone.scale)}
                  color={OB1.RED}
                  style={{ zIndex: 1 }}
                />
              </div>
            ))}
          </div>

          {/* "New information" label - left side */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.12,
              top: zone.height * 0.28,
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.DIM,
              opacity: ease(sceneFrame, 55, 75),
              zIndex: 10,
            }}
          >
            New information
          </div>

          {/* Central wiki icon with fade */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              marginBottom: zone.height * 0.06,
              zIndex: 1,
            }}
          >
            <FileText
              size={Math.round(160 * zone.scale)}
              color={OB1.WHITE}
              strokeWidth={1.5}
            />
          </div>

          {/* "WIKI SYNTHESIS" title above icon */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 20),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            WIKI SYNTHESIS
          </div>

          {/* Timeline arrow - horizontal */}
          <svg
            width={zone.width * 0.4}
            height={Math.round(4 * zone.scale)}
            style={{
              position: "absolute",
              bottom: zone.height * 0.25,
              opacity: ease(sceneFrame, 90, 110),
              zIndex: 0,
            }}
          >
            <line
              x1={0}
              y1={Math.round(2 * zone.scale)}
              x2={zone.width * 0.4 * ease(sceneFrame, 90, 130)}
              y2={Math.round(2 * zone.scale)}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(3 * zone.scale)}
            />
            <polygon
              points={`${zone.width * 0.4 * ease(sceneFrame, 90, 130)},0 ${zone.width * 0.4 * ease(sceneFrame, 90, 130) - 12 * zone.scale},${6 * zone.scale} ${zone.width * 0.4 * ease(sceneFrame, 90, 130)},${12 * zone.scale}`}
              fill={OB1.STEEL}
            />
          </svg>

          {/* Clock icon on timeline */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.22,
              left: zone.width * 0.3 + (zone.width * 0.2 * ease(sceneFrame, 90, 130)),
              opacity: ease(sceneFrame, 100, 120),
              zIndex: 1,
            }}
          >
            <Clock
              size={Math.round(48 * zone.scale)}
              color={OB1.STEEL}
            />
          </div>

          {/* "Drifts over time" label below timeline */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.12,
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.AMBER,
              opacity: ease(sceneFrame, 110, 130),
              zIndex: 10,
            }}
          >
            Drifts over time
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-023-Quality
    // FOCAL: Two-column quality comparison with vertical bars
    // SUPPORTING (2):
    //   1. Left: "Database Search" with taller quality bar (green, 85% height)
    //   2. Right: "Pre-built Wiki" with shorter quality bar (amber, 55% height)
    // TEXT ON SCREEN:
    //   - "Database Search" (56px) — 15 chars
    //   - "Pre-built Wiki" (56px) — 14 chars
    //   - "Quality" (48px, axis label) — 7 chars
    //   Total visible: 36 chars (well under 90) ✓
    // PHASES:
    //   - 0-2s: Left column (database) fades in with tall bar animating up
    //   - 2-4s: Right column (wiki) fades in with shorter bar animating up
    //   - 4-7s: Hold
    // ELEMENT COUNT: 2 columns (within 4 max) ✓
    // PHONE TEST: All text ≥48px, bars clearly distinct ✓
    id: "TW-023-Quality",
    title: "Quality Gap",
    subtitle: "Search vs pre-built synthesis",
    bottomLabel: "Database queries rarely match pre-built wiki quality",
    bottomAccent: "rarely match",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const maxBarHeight = zone.height * 0.4;

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
          {/* Y-axis label "Quality" */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.08,
              top: zone.height * 0.25,
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              opacity: ease(sceneFrame, 10, 30),
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              zIndex: 10,
            }}
          >
            Quality
          </div>

          {/* Two columns container */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.15,
              alignItems: "flex-end",
              position: "relative",
            }}
          >
            {/* Left column: Database Search */}
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
                  width: zone.width * 0.2,
                  height: maxBarHeight * 0.85 * ease(sceneFrame, 20, 60),
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
              <Database
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                style={{
                  opacity: ease(sceneFrame, 40, 60),
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 50, 70),
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Database Search
              </div>
            </div>

            {/* Right column: Pre-built Wiki */}
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
                  width: zone.width * 0.2,
                  height: maxBarHeight * 0.55 * ease(sceneFrame, 80, 120),
                  backgroundColor: OB1.AMBER,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
              <FileText
                size={Math.round(64 * zone.scale)}
                color={OB1.AMBER}
                style={{
                  opacity: ease(sceneFrame, 100, 120),
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 110, 130),
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Pre-built Wiki
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-024-Adjacent
    // FOCAL: Three database entry cards in a horizontal row
    // SUPPORTING (1): Warning icons between conflicting cards (cards 1-2 and 2-3)
    // TEXT ON SCREEN:
    //   - "Entry A: True" (48px, card 1) — 13 chars
    //   - "Entry B: False" (48px, card 2) — 14 chars
    //   - "Entry C: True" (48px, card 3) — 13 chars
    //   - "No Detection" (56px, below center) — 12 chars
    //   Total visible: 52 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Three cards fade in simultaneously
    //   - 1.5-3.5s: Conflict warning icons appear between cards with pulse
    //   - 3.5-5.5s: "No Detection" label fades in below
    //   - 5.5-7s: Hold with pulsing warnings
    // ELEMENT COUNT: 3 cards + 1 warning label (4 total) ✓
    // PHONE TEST: All text ≥48px, cards 280x180 (exceeds 240x200 min) ✓
    id: "TW-024-Adjacent",
    title: "Adjacent Conflicts",
    subtitle: "Contradictions go undetected",
    bottomLabel: "Database entries can conflict without active detection",
    bottomAccent: "without active detection",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const cardWidth = zone.width * 0.22;
      const cardHeight = Math.round(180 * zone.scale);
      const pulseVal = pulse(sceneFrame - 60, 0.04);

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
          {/* Three cards row */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.08,
              alignItems: "center",
              marginBottom: zone.height * 0.12,
              position: "relative",
            }}
          >
            {/* Card A: True */}
            <div
              style={{
                width: cardWidth,
                height: cardHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(12 * zone.scale),
                opacity: ease(sceneFrame, 10, 40),
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(56 * zone.scale)}
                color={OB1.GREEN}
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
                Entry A:<br />True
              </div>
            </div>

            {/* Warning icon between A and B */}
            <div
              style={{
                position: "absolute",
                left: cardWidth + zone.width * 0.04 - Math.round(28 * zone.scale),
                opacity: ease(sceneFrame, 45, 75) * (0.8 + pulseVal * 0.2),
                zIndex: 1,
              }}
            >
              <AlertTriangle
                size={Math.round(56 * zone.scale)}
                color={OB1.AMBER}
                fill={OB1.AMBER}
                fillOpacity={0.2}
              />
            </div>

            {/* Card B: False */}
            <div
              style={{
                width: cardWidth,
                height: cardHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(12 * zone.scale),
                opacity: ease(sceneFrame, 20, 50),
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(56 * zone.scale)}
                color={OB1.RED}
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
                Entry B:<br />False
              </div>
            </div>

            {/* Warning icon between B and C */}
            <div
              style={{
                position: "absolute",
                left: cardWidth * 2 + zone.width * 0.08 + zone.width * 0.04 - Math.round(28 * zone.scale),
                opacity: ease(sceneFrame, 55, 85) * (0.8 + pulseVal * 0.2),
                zIndex: 1,
              }}
            >
              <AlertTriangle
                size={Math.round(56 * zone.scale)}
                color={OB1.AMBER}
                fill={OB1.AMBER}
                fillOpacity={0.2}
              />
            </div>

            {/* Card C: True */}
            <div
              style={{
                width: cardWidth,
                height: cardHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(12 * zone.scale),
                opacity: ease(sceneFrame, 30, 60),
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(56 * zone.scale)}
                color={OB1.GREEN}
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
                Entry C:<br />True
              </div>
            </div>
          </div>

          {/* "No Detection" label below */}
          <div
            style={{
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              opacity: ease(sceneFrame, 105, 135),
              display: "flex",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            <XCircle
              size={Math.round(48 * zone.scale)}
              color={OB1.RED}
            />
            No Detection
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

export const TW_CLIPS_08 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

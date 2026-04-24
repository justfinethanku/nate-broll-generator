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
  pulse,
} from "./shared";
import {
  Database,
  FileText,
  ArrowRight,
  Eye,
  Pencil,
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
    // DESIGN SPEC for TW-013-TwoMemory
    // FOCAL: Two side-by-side memory systems with distinct visual identities
    // SUPPORTING (2):
    //   1. Left: Database icon (Database lucide 64px inside 180px circle, OB1.CYAN) + "Detailed Facts" label 48px + "OpenBrain" sublabel 40px
    //   2. Right: Wiki icon (FileText lucide 64px inside 180px circle, OB1.ORANGE) + "Narrative Synthesis" label 48px + "Wiki" sublabel 40px
    // TEXT ON SCREEN:
    //   - "Detailed Facts" (48px) — 14 chars
    //   - "OpenBrain" (40px) — 9 chars
    //   - "Narrative Synthesis" (48px) — 19 chars
    //   - "Wiki" (40px) — 4 chars
    //   Total visible: 46 chars (under 90)
    // PHASES:
    //   - 0-1.5s: Left memory system fades in
    //   - 1.5-3.5s: Right memory system fades in
    //   - 3.5-7s: Both hold with subtle pulse on circles
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 2 systems (within 4 max) ✓
    // PHONE TEST: All text 40px+, all icons 64px in 180px circles ✓
    id: "TW-013-TwoMemory",
    title: "Two Memory Types",
    subtitle: "Detailed vs narrative",
    bottomLabel: "Database precision meets narrative context",
    bottomAccent: "narrative context",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const circleSize = Math.round(180 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const titleSize = Math.round(48 * zone.scale);
      const subtitleSize = Math.round(40 * zone.scale);
      const gap = zone.width * 0.12;

      // Animation timing
      const leftOpacity = ease(sceneFrame, 0, 45);
      const rightOpacity = ease(sceneFrame, 45, 105);
      const pulseVal = pulse(sceneFrame - 105, 0.03);

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
          {/* Left: Database (Detailed Facts) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              opacity: leftOpacity,
            }}
          >
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.CYAN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8 + pulseVal * 0.2,
                zIndex: 1,
              }}
            >
              <Database size={iconSize} color={OB1.CYAN} strokeWidth={2.5} />
            </div>
            <div
              style={{
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Detailed Facts
            </div>
            <div
              style={{
                fontSize: subtitleSize,
                fontFamily: FONTS.mono,
                fontWeight: 600,
                color: OB1.CYAN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              OpenBrain
            </div>
          </div>

          {/* Right: Wiki (Narrative Synthesis) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              opacity: rightOpacity,
            }}
          >
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8 + pulseVal * 0.2,
                zIndex: 1,
              }}
            >
              <FileText size={iconSize} color={OB1.ORANGE} strokeWidth={2.5} />
            </div>
            <div
              style={{
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Narrative Synthesis
            </div>
            <div
              style={{
                fontSize: subtitleSize,
                fontFamily: FONTS.mono,
                fontWeight: 600,
                color: OB1.ORANGE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Wiki
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-014-Contradict
    // FOCAL: Two conflicting documents side by side with visual tension (no connecting line — they're unaware of each other)
    // SUPPORTING (2):
    //   1. Left document: FileText icon 80px with "Q2 Strategy" label 52px below, OB1.CYAN glow
    //   2. Right document: FileText icon 80px with "CEO Statement" label 52px below, OB1.ORANGE glow
    // TEXT ON SCREEN:
    //   - "Q2 Strategy" (52px) — 11 chars
    //   - "CEO Statement" (52px) — 13 chars
    //   - "Silent Conflict" (60px, appears centered between them late) — 14 chars
    //   Total visible: 38 chars (under 90)
    // PHASES:
    //   - 0-1.5s: Left doc fades in
    //   - 1.5-3s: Right doc fades in
    //   - 3-4.5s: Hold
    //   - 4.5-6s: "Silent Conflict" fades in between them (top center)
    //   - 6-7s: Hold with pulse on conflict label
    // LOGOS: None
    // ELEMENT COUNT: 2 docs + 1 label = 3 ✓
    // PHONE TEST: Icons 80px, labels 52-60px ✓
    id: "TW-014-Contradict",
    title: "Silent Contradictions",
    subtitle: "Information silos",
    bottomLabel: "Conflicting truths living in separate documents",
    bottomAccent: "separate documents",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(80 * zone.scale);
      const labelSize = Math.round(52 * zone.scale);
      const conflictSize = Math.round(60 * zone.scale);
      const gap = zone.width * 0.25;

      // Animation timing
      const leftOpacity = ease(sceneFrame, 0, 45);
      const rightOpacity = ease(sceneFrame, 45, 90);
      const conflictOpacity = ease(sceneFrame, 135, 180);
      const pulseVal = pulse(sceneFrame - 180, 0.04);

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
          {/* Conflict label (appears late, positioned above docs) */}
          <div
            style={{
              position: "absolute",
              top: Math.round(40 * zone.scale),
              fontSize: conflictSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              opacity: conflictOpacity * (0.7 + pulseVal * 0.3),
              zIndex: 10,
            }}
          >
            Silent Conflict
          </div>

          {/* Documents row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: gap,
            }}
          >
            {/* Left: Q2 Strategy */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                opacity: leftOpacity,
              }}
            >
              <div
                style={{
                  filter: `drop-shadow(0 0 ${Math.round(20 * zone.scale)}px ${OB1.CYAN}40)`,
                  zIndex: 1,
                }}
              >
                <FileText size={iconSize} color={OB1.CYAN} strokeWidth={2} />
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Q2 Strategy
              </div>
            </div>

            {/* Right: CEO Statement */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                opacity: rightOpacity,
              }}
            >
              <div
                style={{
                  filter: `drop-shadow(0 0 ${Math.round(20 * zone.scale)}px ${OB1.ORANGE}40)`,
                  zIndex: 1,
                }}
              >
                <FileText size={iconSize} color={OB1.ORANGE} strokeWidth={2} />
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                CEO Statement
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-015-Jobs
    // FOCAL: AI role distinction — writer vs reader represented as job badges/cards
    // SUPPORTING (2):
    //   1. Writer card: Pencil icon 72px inside rounded rect 280w x 220h, OB1.ORANGE border, "Writer" label 56px + "Maintains Wiki" 42px below
    //   2. Reader card: Eye icon 72px inside rounded rect 280w x 220h, OB1.CYAN border, "Reader" label 56px + "Queries Database" 42px below
    // TEXT ON SCREEN:
    //   - "Writer" (56px) — 6 chars
    //   - "Maintains Wiki" (42px) — 14 chars
    //   - "Reader" (56px) — 6 chars
    //   - "Queries Database" (42px) — 16 chars
    //   Total visible: 42 chars (under 90)
    // PHASES:
    //   - 0-1.5s: Writer card pops in (left)
    //   - 1.5-3.5s: Reader card pops in (right)
    //   - 3.5-7s: Hold with subtle pulse on both cards
    // LOGOS: None
    // ELEMENT COUNT: 2 job cards ✓
    // PHONE TEST: All text 42px+, icons 72px, cards 280x220 ✓
    id: "TW-015-Jobs",
    title: "AI Job Descriptions",
    subtitle: "Writer vs reader",
    bottomLabel: "One AI writes the story, another reads the facts",
    bottomAccent: "writes the story",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const cardWidth = Math.round(280 * zone.scale);
      const cardHeight = Math.round(220 * zone.scale);
      const iconSize = Math.round(72 * zone.scale);
      const titleSize = Math.round(56 * zone.scale);
      const subtitleSize = Math.round(42 * zone.scale);
      const gap = zone.width * 0.1;
      const borderRadius = Math.round(16 * zone.scale);

      // Animation timing
      const writerProgress = ease(sceneFrame, 0, 45);
      const readerProgress = ease(sceneFrame, 45, 105);
      const pulseVal = pulse(sceneFrame - 105, 0.03);

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
          {/* Writer Card */}
          <div
            style={{
              width: cardWidth,
              height: cardHeight,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
              borderRadius: borderRadius,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(16 * zone.scale),
              opacity: writerProgress * (0.9 + pulseVal * 0.1),
              transform: `scale(${0.8 + writerProgress * 0.2})`,
              zIndex: 1,
            }}
          >
            <Pencil size={iconSize} color={OB1.ORANGE} strokeWidth={2.5} />
            <div
              style={{
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Writer
            </div>
            <div
              style={{
                fontSize: subtitleSize,
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.ORANGE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Maintains Wiki
            </div>
          </div>

          {/* Reader Card */}
          <div
            style={{
              width: cardWidth,
              height: cardHeight,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.CYAN}`,
              borderRadius: borderRadius,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(16 * zone.scale),
              opacity: readerProgress * (0.9 + pulseVal * 0.1),
              transform: `scale(${0.8 + readerProgress * 0.2})`,
              zIndex: 1,
            }}
          >
            <Eye size={iconSize} color={OB1.CYAN} strokeWidth={2.5} />
            <div
              style={{
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Reader
            </div>
            <div
              style={{
                fontSize: subtitleSize,
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.CYAN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Queries Database
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

export const TW_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

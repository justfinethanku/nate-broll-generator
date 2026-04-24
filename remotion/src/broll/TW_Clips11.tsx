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
  MessageCircle,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Brain,
  FileText,
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
    // DESIGN SPEC for TW-031-RoleEvo
    // FOCAL: Two-phase transformation showing AI role evolution
    // PHASE 1 (0-3.5s): "ORACLE" label (60px) above Brain icon (160px) + speech bubble icon (64px inside 160px circle)
    // PHASE 2 (3.5-7s): Arrow draws right, "MAINTAINER" label (60px) + FileText icon (64px inside 160px circle) appear
    // SUPPORTING: Single arrow connecting the two states
    // TEXT ON SCREEN:
    //   - "ORACLE" (60px) — 6 chars
    //   - "MAINTAINER" (60px) — 10 chars
    //   - "Answers" (48px, under oracle) — 7 chars
    //   - "Knowledge Artifact" (48px, under maintainer) — 19 chars
    //   Total visible: 42 chars (under 90) ✓
    // PHASES:
    //   - 0-2s: Oracle group (label + icon) fades in
    //   - 2-3.5s: Hold oracle
    //   - 3.5-4.5s: Arrow draws from left to right
    //   - 4.5-6.5s: Maintainer group fades in
    //   - 6.5-7s: Hold both
    // ELEMENT COUNT: 2 states + 1 arrow = 3 elements ✓
    // PHONE TEST: All text 48-60px, icons 64px in 160px circles ✓
    id: "TW-031-RoleEvo",
    title: "AI Role Evolution",
    subtitle: "From oracle to maintainer",
    bottomLabel: "AI shifts from answering questions to maintaining knowledge artifacts",
    bottomAccent: "maintaining knowledge artifacts",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Oracle state (left side)
      const oracleOpacity = ease(sceneFrame, 0, 30);

      // Arrow transition
      const arrowProgress = ease(sceneFrame, 105, 135);

      // Maintainer state (right side)
      const maintainerOpacity = ease(sceneFrame, 135, 165);

      const iconSize = Math.round(64 * zone.scale);
      const circleSize = Math.round(160 * zone.scale);
      const labelSize = Math.round(60 * zone.scale);
      const subLabelSize = Math.round(48 * zone.scale);
      const gap = zone.width * 0.08;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
          }}
        >
          {/* ORACLE (left) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: oracleOpacity,
            }}
          >
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              ORACLE
            </div>
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <MessageCircle
                size={iconSize}
                color={OB1.CYAN}
                strokeWidth={2.5}
                style={{ zIndex: 10, position: "relative" }}
              />
            </div>
            <div
              style={{
                fontSize: subLabelSize,
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Answers
            </div>
          </div>

          {/* ARROW */}
          <div
            style={{
              width: zone.width * 0.15 * arrowProgress,
              height: Math.round(4 * zone.scale),
              backgroundColor: OB1.ORANGE,
              position: "relative",
              zIndex: 0,
              opacity: arrowProgress,
            }}
          >
            {arrowProgress > 0 && (
              <ArrowRight
                size={Math.round(48 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
                style={{
                  position: "absolute",
                  right: Math.round(-24 * zone.scale),
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 0,
                }}
              />
            )}
          </div>

          {/* MAINTAINER (right) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: maintainerOpacity,
            }}
          >
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              MAINTAINER
            </div>
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <FileText
                size={iconSize}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{ zIndex: 10, position: "relative" }}
              />
            </div>
            <div
              style={{
                fontSize: subLabelSize,
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Knowledge Artifact
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-032-GruntWork
    // FOCAL: AI logo (Claude) at 140px with "AI" label (60px) on left
    // SUPPORTING (3): Three task cards staggered right showing grunt work AI handles
    //   Card 1: Wrench icon (64px) + "Curation" (48px)
    //   Card 2: Brain icon (64px) + "Exploration" (48px)
    //   Card 3: MessageCircle icon (64px) + "Question Design" (48px)
    // TEXT ON SCREEN:
    //   - "AI" (60px) — 2 chars
    //   - "HANDLES GRUNT WORK" (56px, top) — 18 chars
    //   - "Curation" (48px) — 8 chars
    //   - "Exploration" (48px) — 11 chars
    //   - "Question Design" (48px) — 15 chars
    //   Total visible: 54 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Title "HANDLES GRUNT WORK" fades in at top
    //   - 1.5-3s: AI logo fades in left
    //   - 3-7s: Three cards stagger in (gap: 20 frames)
    // ELEMENT COUNT: 1 AI logo + 3 task cards = 4 elements ✓
    // PHONE TEST: All text 48-60px, logo 140px, icons 64px ✓
    id: "TW-032-GruntWork",
    title: "AI Grunt Work",
    subtitle: "Supporting human intelligence",
    bottomLabel: "AI handles curation, exploration, and question design to support humans",
    bottomAccent: "support humans",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const titleOpacity = ease(sceneFrame, 0, 30);
      const aiLogoOpacity = ease(sceneFrame, 45, 75);

      const tasks = [
        { icon: Wrench, label: "Curation", color: OB1.ORANGE, delay: 90 },
        { icon: Brain, label: "Exploration", color: OB1.CYAN, delay: 110 },
        { icon: MessageCircle, label: "Question Design", color: OB1.PURPLE, delay: 130 },
      ];

      const logoSize = Math.round(140 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const cardWidth = zone.width * 0.18;
      const cardHeight = Math.round(200 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.height * 0.08,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              opacity: titleOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            HANDLES GRUNT WORK
          </div>

          {/* Main content row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.08,
            }}
          >
            {/* AI Logo (left) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                opacity: aiLogoOpacity,
              }}
            >
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                AI
              </div>
            </div>

            {/* Task cards (right) */}
            <div
              style={{
                display: "flex",
                gap: zone.width * 0.05,
              }}
            >
              {tasks.map((task, i) => {
                const cardOpacity = ease(sceneFrame, task.delay, task.delay + 30);
                const Icon = task.icon;

                return (
                  <div
                    key={i}
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      backgroundColor: OB1.BG_MID,
                      borderRadius: Math.round(8 * zone.scale),
                      border: `${Math.round(3 * zone.scale)}px solid ${task.color}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: Math.round(16 * zone.scale),
                      opacity: cardOpacity,
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={iconSize}
                      color={task.color}
                      strokeWidth={2.5}
                      style={{ zIndex: 10, position: "relative" }}
                    />
                    <div
                      style={{
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        textAlign: "center",
                        padding: `0 ${Math.round(8 * zone.scale)}px`,
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {task.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-033-Choose
    // FOCAL: Three memory system cards in a row, user chooses which fits their needs
    // SUPPORTING: Checkmark icon (80px) above the cards indicating "intentional choice"
    // CARDS (3):
    //   Card 1: "CHAT HISTORY" (48px) + small chat icon (48px)
    //   Card 2: "VECTOR DB" (48px) + small database icon (48px)
    //   Card 3: "KNOWLEDGE GRAPH" (48px) + small network icon (48px)
    // TEXT ON SCREEN:
    //   - "CHOOSE YOUR ARCHITECTURE" (60px, top) — 24 chars
    //   - "Chat History" (48px) — 12 chars
    //   - "Vector DB" (48px) — 9 chars
    //   - "Knowledge Graph" (48px) — 15 chars
    //   Total visible: 60 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Title fades in
    //   - 1.5-2.5s: Checkmark pops in
    //   - 2.5-6s: Three cards stagger in (gap: 25 frames each)
    //   - 6-7s: Hold
    // ELEMENT COUNT: 1 title + 1 checkmark + 3 cards = 5... need to reduce
    // REVISED: Drop the checkmark icon, make title do the work
    // FINAL COUNT: 1 title + 3 cards = 4 elements ✓
    // PHONE TEST: All text 48-60px ✓
    id: "TW-033-Choose",
    title: "Intentional Architecture",
    subtitle: "Pick what fits your needs",
    bottomLabel: "Choose the memory system that matches your context layer requirements",
    bottomAccent: "context layer requirements",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const titleOpacity = ease(sceneFrame, 0, 30);

      const cards = [
        { label: "Chat History", icon: MessageCircle, color: OB1.CYAN, delay: 75 },
        { label: "Vector DB", icon: Brain, color: OB1.PURPLE, delay: 100 },
        { label: "Knowledge Graph", icon: FileText, color: OB1.GREEN, delay: 125 },
      ];

      const cardWidth = zone.width * 0.24;
      const cardHeight = Math.round(240 * zone.scale);
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
            gap: zone.height * 0.1,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              opacity: titleOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            CHOOSE YOUR ARCHITECTURE
          </div>

          {/* Cards row */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.06,
            }}
          >
            {cards.map((card, i) => {
              const cardOpacity = ease(sceneFrame, card.delay, card.delay + 30);
              const Icon = card.icon;

              return (
                <div
                  key={i}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(4 * zone.scale)}px solid ${card.color}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(20 * zone.scale),
                    opacity: cardOpacity,
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={iconSize}
                    color={card.color}
                    strokeWidth={2.5}
                    style={{ zIndex: 10, position: "relative" }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      textAlign: "center",
                      padding: `0 ${Math.round(12 * zone.scale)}px`,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {card.label}
                  </div>
                </div>
              );
            })}
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

export const TW_CLIPS_11 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

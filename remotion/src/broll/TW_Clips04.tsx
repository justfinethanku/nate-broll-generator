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
  stagger,
  pulse,
} from "./shared";
import {
  Brain,
  Clock,
  Zap,
  Lightbulb,
  FolderClosed,
  BookOpen,
  FileText,
  XCircle,
  HelpCircle,
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
    // DESIGN SPEC for TW-010-QueryTime
    // FOCAL: Large brain icon with animated spark effect (Zap) appearing at moment of query
    // SUPPORTING (3):
    //   1. Clock icon on left — represents "moment you need"
    //   2. Arrow pointing from clock to brain
    //   3. Lightbulb appearing on right — represents fresh insight
    // TEXT ON SCREEN:
    //   - "QUERY TIME" (80px, above brain) — 10 chars
    //   - "Fresh Synthesis" (60px, below brain) — 16 chars
    //   Total visible: 26 chars ✓
    // PHASES:
    //   - 0-1.5s: Brain fades in center
    //   - 1.5-2.5s: Clock appears left
    //   - 2.5-3.5s: Arrow draws from clock to brain
    //   - 3.5-4.5s: Zap spark animates on brain
    //   - 4.5-6s: Lightbulb appears right
    //   - 6-7s: Hold
    // ICONS: Brain (160px), Clock (140px), Zap (80px overlay), Lightbulb (140px)
    // ELEMENT COUNT: 3 main elements (clock, brain, lightbulb) + 1 connector arrow ✓
    // PHONE TEST: All text 60-80px, all icons 140px+ ✓
    id: "TW-010-QueryTime",
    title: "Query Time",
    subtitle: "Fresh thinking on demand",
    bottomLabel: "Synthesis happens the moment you need it, not beforehand",
    bottomAccent: "moment you need",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

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
          {/* Clock - left side */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              position: "absolute",
              left: zone.width * 0.15,
              zIndex: 1,
            }}
          >
            <Clock
              size={Math.round(140 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
            />
          </div>

          {/* Arrow from clock to brain */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.28,
              opacity: ease(sceneFrame, 75, 95),
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(80 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2}
            />
          </div>

          {/* Central brain with title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              zIndex: 1,
            }}
          >
            {/* Title above brain */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              QUERY TIME
            </div>

            {/* Brain icon with pulsing effect */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  ...bouncePop(sceneFrame, 10, fps),
                }}
              >
                <Brain
                  size={Math.round(160 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2}
                />
              </div>

              {/* Zap spark overlay - nested to avoid transform conflict */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <div style={{ ...bouncePop(sceneFrame, 105, fps) }}>
                  <Zap
                    size={Math.round(80 * zone.scale)}
                    color={OB1.AMBER}
                    fill={OB1.AMBER}
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>

            {/* Subtitle below brain */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 30),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Fresh Synthesis
            </div>
          </div>

          {/* Lightbulb - right side */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 135),
              position: "absolute",
              right: zone.width * 0.15,
              zIndex: 1,
            }}
          >
            <Lightbulb
              size={Math.round(140 * zone.scale)}
              color={OB1.AMBER}
              fill={OB1.AMBER}
              strokeWidth={2}
              style={{
                opacity: 0.5 + pulse(sceneFrame - 135, 0.04) * 0.5,
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-011-CabinetGuide
    // FOCAL: Side-by-side comparison — filing cabinet icon left vs book/guide icon right
    // SUPPORTING (2):
    //   1. Label above left: "RAW STORAGE"
    //   2. Label above right: "SYNTHESIS"
    // TEXT ON SCREEN:
    //   - "RAW STORAGE" (60px) — 11 chars
    //   - "SYNTHESIS" (60px) — 9 chars
    //   Total visible: 20 chars ✓
    // PHASES:
    //   - 0-1.5s: Filing cabinet appears left with label
    //   - 1.5-2s: "VS" divider appears center
    //   - 2-3.5s: Book appears right with label
    //   - 3.5-5s: Cabinet dims slightly, book glows
    //   - 5-7s: Hold
    // ICONS: FolderClosed (160px), BookOpen (160px)
    // ELEMENT COUNT: 2 icons + 2 labels = 4 elements ✓
    // PHONE TEST: All text 60px, all icons 160px ✓
    id: "TW-011-CabinetGuide",
    title: "Two Structures",
    subtitle: "Storage vs synthesis",
    bottomLabel: "Filing cabinets store data; study guides synthesize meaning",
    bottomAccent: "study guides synthesize",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const dimAmount = ease(sceneFrame, 105, 135);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
            position: "relative",
          }}
        >
          {/* Left side: Filing Cabinet / Raw Storage */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              opacity: 1 - dimAmount * 0.4,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                zIndex: 10,
                position: "relative",
              }}
            >
              RAW STORAGE
            </div>
            <div style={{ ...bouncePop(sceneFrame, 20, fps) }}>
              <FolderClosed
                size={Math.round(160 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Center: VS divider */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.DIM,
              zIndex: 10,
              position: "relative",
            }}
          >
            VS
          </div>

          {/* Right side: Book / Synthesis */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              SYNTHESIS
            </div>
            <div
              style={{
                ...bouncePop(sceneFrame, 70, fps),
              }}
            >
              <BookOpen
                size={Math.round(160 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
                style={{
                  opacity: 0.7 + pulse(sceneFrame - 105, 0.03) * 0.3,
                }}
              />
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-012-TextLimits (REVISED after QC)
    // FOCAL: Large text file icon with red X overlay
    // SUPPORTING (3):
    //   1. Three small query bubbles floating above with question marks
    //   2. Block/prohibition symbol (XCircle) overlaid on file
    //   3. Label "CAN'T QUERY METADATA" below (simplified to fit)
    // TEXT ON SCREEN:
    //   - "CAN'T QUERY" (60px) — 11 chars
    //   - "METADATA" (60px, second line) — 8 chars
    //   Total visible: 19 chars ✓
    // VERTICAL BUDGET:
    //   Question marks area: ~86px from top
    //   File + X: 160px tall (reduced from 180/200), centered at ~240px
    //   Gap: 50px
    //   Labels: starting at 350px (60px + 12px gap + 60px = 132px total)
    //   Total used: ~482px (well under 576px) ✓
    // ICONS: FileText (160px reduced), XCircle (180px reduced), HelpCircle (64px × 3)
    // ELEMENT COUNT: 1 focal (file + X) + 3 question bubbles + 1 label group = within limits ✓
    id: "TW-012-TextLimits",
    title: "Text File Limits",
    subtitle: "Structure matters",
    bottomLabel: "Plain text files can't answer complex metadata queries",
    bottomAccent: "can't answer",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

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
          {/* Question mark bubbles above */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.12,
              display: "flex",
              gap: zone.width * 0.08,
              zIndex: 1,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...fadeInUp(sceneFrame, stagger(i, 30, 12)),
                }}
              >
                <HelpCircle
                  size={Math.round(64 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>

          {/* Central file icon with X overlay - moved up slightly */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* File icon - reduced size */}
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <FileText
                size={Math.round(160 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>

            {/* Red X overlay - nested to avoid transform conflict, reduced size */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <div style={{ ...bouncePop(sceneFrame, 75, fps) }}>
                <XCircle
                  size={Math.round(180 * zone.scale)}
                  color={OB1.RED}
                  fill={OB1.BG_DARK}
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>

          {/* Labels below - repositioned with more space */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 105),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              CAN'T QUERY
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              METADATA
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

export const TW_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

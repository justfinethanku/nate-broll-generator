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
  Folder,
  FileCode,
  Settings,
  UserCheck,
  CheckCircle2,
  Sparkles,
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
    // DESIGN SPEC for OP-016-FactThatWe
    // FOCAL: Horizontal flow diagram — 3 stages with arrows between
    // SUPPORTING (3):
    //   - Left node: Folder icon + "Codebase + Brand" label
    //   - Center node: Claude logo 140px + "Claude Design" label
    //   - Right node: FileCode icon + ".skill" label
    // TEXT ON SCREEN:
    //   - "Codebase + Brand" (48px) — 17 chars
    //   - "Claude Design" (48px) — 13 chars
    //   - ".skill" (60px) — 6 chars
    //   Total visible: 36 chars ✓
    // PHASES:
    //   - 0-1s: Left node fades in
    //   - 1-2s: Arrow 1 draws
    //   - 2-3.5s: Center node pops in
    //   - 3.5-4.5s: Arrow 2 draws
    //   - 4.5-7s: Right node fades in, hold
    // LOGOS: claude.svg
    // ELEMENT COUNT: 3 nodes ✓
    // PHONE TEST: All text 48-60px, icons 80-140px ✓
    id: "OP-016-FactThatWe",
    title: "Design System Generation",
    subtitle: "Claude Design pipeline",
    bottomLabel: "Brand → Design System → Skill File",
    bottomAccent: "Skill File",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const nodeWidth = zone.width * 0.18;
      const nodeHeight = zone.height * 0.35;
      const arrowWidth = zone.width * 0.12;

      // Node positions (horizontal centering)
      const totalWidth = nodeWidth * 3 + arrowWidth * 2;
      const startX = (zone.width - totalWidth) / 2;

      const arrows = [
        { x: startX + nodeWidth, delay: 30 },
        { x: startX + nodeWidth * 2 + arrowWidth, delay: 105 },
      ];

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
          {/* Node 1: Codebase + Brand (Folder icon) */}
          <div
            style={{
              position: "absolute",
              left: startX,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: ease(sceneFrame, 0, 30),
            }}
          >
            <div
              style={{
                width: nodeWidth,
                height: nodeHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Folder
                size={Math.round(80 * zone.scale)}
                color={OB1.WHITE}
                strokeWidth={2}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                zIndex: 10,
                position: "relative",
              }}
            >
              Codebase{"\n"}+ Brand
            </div>
          </div>

          {/* Node 2: Claude Design (logo) */}
          <div
            style={{
              position: "absolute",
              left: startX + nodeWidth + arrowWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: ease(sceneFrame, 60, 90),
            }}
          >
            <div
              style={{
                width: nodeWidth,
                height: nodeHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                zIndex: 10,
                position: "relative",
              }}
            >
              Claude{"\n"}Design
            </div>
          </div>

          {/* Node 3: .skill file (FileCode icon) */}
          <div
            style={{
              position: "absolute",
              left: startX + (nodeWidth + arrowWidth) * 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: ease(sceneFrame, 135, 165),
            }}
          >
            <div
              style={{
                width: nodeWidth,
                height: nodeHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <FileCode
                size={Math.round(80 * zone.scale)}
                color={OB1.WHITE}
                strokeWidth={2}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                zIndex: 10,
                position: "relative",
              }}
            >
              .skill
            </div>
          </div>

          {/* Arrows */}
          {arrows.map((arrow, i) => {
            const progress = ease(sceneFrame, arrow.delay, arrow.delay + 30);
            const arrowOpacity = ease(sceneFrame, arrow.delay, arrow.delay + 20);

            return (
              <svg
                key={i}
                style={{
                  position: "absolute",
                  left: arrow.x,
                  top: zone.height * 0.5 - Math.round(12 * zone.scale),
                  width: arrowWidth,
                  height: Math.round(24 * zone.scale),
                  overflow: "visible",
                  zIndex: 0,
                }}
              >
                {/* Line */}
                <line
                  x1={0}
                  y1={Math.round(12 * zone.scale)}
                  x2={arrowWidth * progress}
                  y2={Math.round(12 * zone.scale)}
                  stroke={OB1.CYAN}
                  strokeWidth={Math.round(4 * zone.scale)}
                  opacity={arrowOpacity}
                />
                {/* Arrowhead */}
                {progress > 0.8 && (
                  <polygon
                    points={`${arrowWidth - Math.round(16 * zone.scale)},${Math.round(4 * zone.scale)} ${arrowWidth},${Math.round(12 * zone.scale)} ${arrowWidth - Math.round(16 * zone.scale)},${Math.round(20 * zone.scale)}`}
                    fill={OB1.CYAN}
                    opacity={arrowOpacity}
                  />
                )}
              </svg>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-017-ExpertiseAndThat (REVISED — arc removed for readability)
    // FOCAL: "Expert Level Required" title (centered, 72px ORANGE)
    // SUPPORTING (2):
    //   - Left: Settings icon (120px circle) + "Technical Setup" label (48px)
    //   - Left: UserCheck icon (120px circle) + "Design Expertise" label (48px)
    // TEXT ON SCREEN:
    //   - "Expert Level Required" (72px) — 22 chars
    //   - "Technical Setup" (48px) — 15 chars
    //   - "Design Expertise" (48px) — 16 chars
    //   Total visible: 53 chars ✓
    // PHASES:
    //   - 0-1.5s: Title fades in
    //   - 1.5-3s: Technical Setup icon + label appear
    //   - 3-5s: Design Expertise icon + label appear
    //   - 5-7s: Hold
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 1 title + 2 requirement icons = 3 total ✓
    // PHONE TEST: All text 48-72px, icons 80px in 120px circles ✓
    id: "OP-017-ExpertiseAndThat",
    title: "Expert Onboarding",
    subtitle: "Design system setup",
    bottomLabel: "Professional Setup Required for High-End Systems",
    bottomAccent: "Professional Setup",
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
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.15,
              fontSize: Math.round(72 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              opacity: ease(sceneFrame, 0, 30),
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            Expert Level Required
          </div>

          {/* Requirements container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: zone.height * 0.12,
              marginTop: zone.height * 0.1,
            }}
          >
            {/* Technical Setup icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                opacity: ease(sceneFrame, 45, 75),
              }}
            >
              <div
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <Settings
                  size={Math.round(80 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2.5}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  lineHeight: 1.2,
                  whiteSpace: "pre-line",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Technical{"\n"}Setup
              </div>
            </div>

            {/* Design Expertise icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                opacity: ease(sceneFrame, 90, 120),
              }}
            >
              <div
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.PURPLE}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <UserCheck
                  size={Math.round(80 * zone.scale)}
                  color={OB1.PURPLE}
                  strokeWidth={2.5}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  lineHeight: 1.2,
                  whiteSpace: "pre-line",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Design{"\n"}Expertise
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-018-IfYouWant
    // FOCAL: Horizontal slider/dial with center pivot, left vs right modes
    // SUPPORTING (2):
    //   - Left side: "Literal Mode" + CheckCircle2 icon in CYAN
    //   - Right side: "Interpretive Mode" + Sparkles icon in PURPLE
    // TEXT ON SCREEN:
    //   - "Literal Mode" (56px) — 12 chars
    //   - "Interpretive Mode" (56px) — 17 chars
    //   - "User Intent ↔ Model Default" (44px, below slider) — 28 chars
    //   Total visible: 57 chars ✓
    // PHASES:
    //   - 0-1.5s: Slider track fades in
    //   - 1.5-3s: Left mode (Literal) appears
    //   - 3-4.5s: Right mode (Interpretive) appears
    //   - 4.5-7s: Slider handle oscillates gently between center positions
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 1 slider + 2 mode indicators = 3 total ✓
    // PHONE TEST: All text 44-56px, icons 64px ✓
    id: "OP-018-IfYouWant",
    title: "Model Configuration",
    subtitle: "Behavior preference",
    bottomLabel: "Literal Following vs Interpretive Mode",
    bottomAccent: "Interpretive Mode",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const sliderWidth = zone.width * 0.6;
      const sliderHeight = Math.round(12 * zone.scale);
      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.45;

      // Slider handle oscillates between 40% and 60% position
      const oscillation = Math.sin(sceneFrame * 0.05) * 0.1; // ±10%
      const handlePosition = 0.5 + oscillation;
      const handleX =
        centerX - sliderWidth * 0.5 + sliderWidth * handlePosition;
      const handleOpacity = ease(sceneFrame, 135, 165);

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
          {/* Slider track */}
          <div
            style={{
              position: "absolute",
              left: centerX - sliderWidth * 0.5,
              top: centerY,
              width: sliderWidth,
              height: sliderHeight,
              backgroundColor: OB1.DIM,
              borderRadius: sliderHeight / 2,
              opacity: ease(sceneFrame, 0, 30),
              zIndex: 0,
            }}
          />

          {/* Slider handle */}
          <div
            style={{
              position: "absolute",
              left: handleX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              width: Math.round(48 * zone.scale),
              height: Math.round(48 * zone.scale),
              backgroundColor: OB1.ORANGE,
              borderRadius: "50%",
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.WHITE}`,
              opacity: handleOpacity,
              zIndex: 1,
            }}
          />

          {/* Literal Mode (left) */}
          <div
            style={{
              position: "absolute",
              left: centerX - sliderWidth * 0.35,
              top: centerY - zone.height * 0.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: ease(sceneFrame, 45, 75),
            }}
          >
            <CheckCircle2
              size={Math.round(64 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2.5}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                zIndex: 10,
                position: "relative",
              }}
            >
              Literal{"\n"}Mode
            </div>
          </div>

          {/* Interpretive Mode (right) */}
          <div
            style={{
              position: "absolute",
              left: centerX + sliderWidth * 0.35,
              top: centerY - zone.height * 0.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: ease(sceneFrame, 90, 120),
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
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                zIndex: 10,
                position: "relative",
              }}
            >
              Interpretive{"\n"}Mode
            </div>
          </div>

          {/* Bottom tradeoff label */}
          <div
            style={{
              position: "absolute",
              top: centerY + zone.height * 0.18,
              left: centerX,
              transform: "translateX(-50%)",
              fontSize: Math.round(44 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              opacity: ease(sceneFrame, 120, 150),
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            User Intent ↔ Model Default
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

export const OP_CLIPS_F = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

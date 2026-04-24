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
  X,
  FileText,
  Lightbulb,
  ArrowRight,
  Building2,
  Briefcase,
  RefreshCw,
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
    // DESIGN SPEC for AIA-007-ModelEmpathy (REVISED - tighter vertical spacing)
    // FOCAL: Two comparison zones side-by-side, separated by vertical divider
    // LEFT (green, success): Two identical model logos stacked vertically with connecting line + checkmark
    // RIGHT (red, failure): Two different model logos stacked vertically with connecting line + X mark
    // TEXT ON SCREEN:
    //   - "SAME MODEL" (56px, above left zone) — 10 chars
    //   - "CROSS MODEL" (56px, above right zone) — 11 chars
    //   - "Better Understanding" (44px, below left zone) — 21 chars
    //   Total visible: 42 chars ✓
    // VERTICAL BUDGET (at 1x scale):
    //   - Title: 56px + 12px margin = 68px
    //   - Top logo: 96px
    //   - Gap: 16px
    //   - Line: 48px
    //   - Gap: 16px
    //   - Bottom logo: 96px
    //   - Gap: 12px
    //   - Icon: 56px
    //   - Gap: 8px
    //   - Label: 44px
    //   Total: ~460px (80% of 576px zone.height) ✓
    // PHASES:
    //   - 0-1.5s: Divider line draws
    //   - 1.5-3s: Left zone (same model pair) fades in
    //   - 3-5s: Right zone (cross model pair) fades in
    //   - 5-7s: Hold
    // LOGOS: claude.svg (for same-model pair), claude.svg + openai.svg (for cross-model pair)
    // ELEMENT COUNT: 2 comparison zones (within 4 max) ✓
    // PHONE TEST: All text 44-56px, logos 96px ✓
    id: "AIA-007-ModelEmpathy",
    title: "Model Empathy",
    subtitle: "Same-model pairing wins",
    bottomLabel: "Shared context beats raw capability",
    bottomAccent: "Shared context",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const dividerHeight = ease(sceneFrame, 0, 45) * zone.height * 0.65;

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
          {/* Center divider line */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.5 - dividerHeight / 2,
              width: Math.round(3 * zone.scale),
              height: dividerHeight,
              backgroundColor: OB1.DIM,
              zIndex: 0,
            }}
          />

          {/* LEFT ZONE - Same Model (Success) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 45),
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  marginBottom: Math.round(12 * zone.scale),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                SAME MODEL
              </div>

              {/* Top logo */}
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(96 * zone.scale),
                  height: Math.round(96 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                }}
              />

              {/* Connecting line */}
              <div
                style={{
                  width: Math.round(3 * zone.scale),
                  height: Math.round(48 * zone.scale),
                  backgroundColor: OB1.GREEN,
                  zIndex: 0,
                }}
              />

              {/* Bottom logo */}
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(96 * zone.scale),
                  height: Math.round(96 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                }}
              />

              {/* Checkmark */}
              <div
                style={{
                  marginTop: Math.round(12 * zone.scale),
                }}
              >
                <CheckCircle2
                  size={Math.round(56 * zone.scale)}
                  color={OB1.GREEN}
                  style={{ zIndex: 1 }}
                />
              </div>

              {/* Bottom label */}
              <div
                style={{
                  fontSize: Math.round(44 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  marginTop: Math.round(8 * zone.scale),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Better Understanding
              </div>
            </div>
          </div>

          {/* RIGHT ZONE - Cross Model (Failure) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.65,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 90),
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  marginBottom: Math.round(12 * zone.scale),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                CROSS MODEL
              </div>

              {/* Top logo - Claude */}
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(96 * zone.scale),
                  height: Math.round(96 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                }}
              />

              {/* Connecting line */}
              <div
                style={{
                  width: Math.round(3 * zone.scale),
                  height: Math.round(48 * zone.scale),
                  backgroundColor: OB1.RED,
                  zIndex: 0,
                }}
              />

              {/* Bottom logo - OpenAI */}
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(96 * zone.scale),
                  height: Math.round(96 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                }}
              />

              {/* X mark */}
              <div
                style={{
                  marginTop: Math.round(12 * zone.scale),
                }}
              >
                <X
                  size={Math.round(56 * zone.scale)}
                  color={OB1.RED}
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
    // DESIGN SPEC for AIA-008-MetaLearning (REVISED - horizontal flow)
    // FOCAL: Horizontal flow diagram (left to right)
    // SUPPORTING:
    //   1. Failure circle at left (red, 160px diameter, X icon)
    //   2. Right arrow
    //   3. Trace circle in middle (cyan, 160px diameter, FileText icon)
    //   4. Right arrow
    //   5. Strategy circle at right (green, 160px diameter, Lightbulb icon)
    // TEXT ON SCREEN:
    //   - "FAILURE" (48px, below left circle) — 7 chars
    //   - "TRACE" (48px, below middle circle) — 5 chars
    //   - "STRATEGY" (48px, below right circle) — 8 chars
    //   Total visible: 20 chars ✓
    // PHASES:
    //   - 0-1.5s: Failure circle fades in
    //   - 1.5-3s: First arrow draws, Trace circle fades in
    //   - 3-5s: Second arrow draws, Strategy circle fades in
    //   - 5-7s: Hold, subtle pulse on strategy circle
    // ELEMENT COUNT: 3 stages in flow (within 4 max) ✓
    // PHONE TEST: All text 48px, icons 64px in 160px circles ✓
    id: "AIA-008-MetaLearning",
    title: "Meta-Agent Learning",
    subtitle: "Discovering strategies from failure",
    bottomLabel: "Trace analysis reveals improvement patterns",
    bottomAccent: "improvement patterns",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stageSpacing = zone.width * 0.28;

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
          {/* STAGE 1: Failure (left) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.1,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 20),
              }}
            >
              {/* Failure circle */}
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <X size={Math.round(64 * zone.scale)} color={OB1.RED} />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                FAILURE
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.1 + stageSpacing * 0.5,
              top: zone.height * 0.5,
              transform: "translate(-50%, -50%)",
              opacity: ease(sceneFrame, 50, 70),
            }}
          >
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.STEEL}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* STAGE 2: Trace (middle) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.1 + stageSpacing,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 70),
              }}
            >
              {/* Trace circle */}
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <FileText size={Math.round(64 * zone.scale)} color={OB1.CYAN} />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                TRACE
              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.1 + stageSpacing * 1.5,
              top: zone.height * 0.5,
              transform: "translate(-50%, -50%)",
              opacity: ease(sceneFrame, 110, 130),
            }}
          >
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.STEEL}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* STAGE 3: Strategy (right) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.1 + stageSpacing * 2,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 130),
              }}
            >
              {/* Strategy circle with pulse */}
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.7 + pulse(sceneFrame - 150, 0.03) * 0.3,
                  zIndex: 1,
                }}
              >
                <Lightbulb size={Math.round(64 * zone.scale)} color={OB1.GREEN} />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                STRATEGY
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AIA-009-LabsVsBusiness (REVISED - tighter positioning)
    // FOCAL: Two labeled boxes side-by-side showing same circular flow icon
    // LEFT: "RESEARCH LABS" + Building2 icon (64px in 160px circle)
    // RIGHT: "BUSINESS" + Briefcase icon (64px in 160px circle)
    // SUPPORTING: Equals sign between them (80px)
    // TEXT ON SCREEN:
    //   - "RESEARCH LABS" (60px, above left) — 13 chars
    //   - "BUSINESS" (60px, above right) — 8 chars
    //   - "=" (80px, between) — 1 char
    //   Total visible: 22 chars ✓
    // PHASES:
    //   - 0-1.5s: Left box fades in
    //   - 1.5-3s: Equals sign fades in
    //   - 3-5s: Right box fades in
    //   - 5-7s: Circular arrows rotate gently
    // ELEMENT COUNT: 2 comparison boxes + 1 connector (3 total) ✓
    // PHONE TEST: All text 60-80px, icons 64px in 160px circles ✓
    id: "AIA-009-LabsVsBusiness",
    title: "Research vs Business",
    subtitle: "Same optimization loop",
    bottomLabel: "Scale differs, but the improvement cycle is identical",
    bottomAccent: "improvement cycle",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const rotationAngle = (sceneFrame - 150) * 0.5;

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
          {/* LEFT ZONE - Research Labs */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.22,
              top: zone.height * 0.5,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
                ...fadeInUp(sceneFrame, 20),
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.CYAN,
                  marginBottom: Math.round(8 * zone.scale),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                RESEARCH
              </div>

              {/* Icon circle */}
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Building2 size={Math.round(64 * zone.scale)} color={OB1.CYAN} />
              </div>

              {/* Circular flow indicator */}
              <div
                style={{
                  transform: sceneFrame > 150 ? `rotate(${rotationAngle}deg)` : "rotate(0deg)",
                  transition: "transform 0.3s ease-out",
                }}
              >
                <RefreshCw
                  size={Math.round(40 * zone.scale)}
                  color={OB1.CYAN}
                  style={{ opacity: ease(sceneFrame, 150, 170), zIndex: 1 }}
                />
              </div>
            </div>
          </div>

          {/* CENTER - Equals sign */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.5,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 70, fps) }}>
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                =
              </div>
            </div>
          </div>

          {/* RIGHT ZONE - Business */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.78,
              top: zone.height * 0.5,
              transform: "translate(-100%, -50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
                ...fadeInUp(sceneFrame, 110),
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  marginBottom: Math.round(8 * zone.scale),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                BUSINESS
              </div>

              {/* Icon circle */}
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Briefcase size={Math.round(64 * zone.scale)} color={OB1.GREEN} />
              </div>

              {/* Circular flow indicator */}
              <div
                style={{
                  transform: sceneFrame > 150 ? `rotate(${rotationAngle}deg)` : "rotate(0deg)",
                  transition: "transform 0.3s ease-out",
                }}
              >
                <RefreshCw
                  size={Math.round(40 * zone.scale)}
                  color={OB1.GREEN}
                  style={{ opacity: ease(sceneFrame, 150, 170), zIndex: 1 }}
                />
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

export const AIA_CLIPS_C = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

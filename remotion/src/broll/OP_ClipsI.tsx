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
  HelpCircle,
  CheckCircle2,
  Brain,
  ArrowRight,
  Zap,
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
    // DESIGN SPEC for OP-025-IsTheSpecific
    // FOCAL: Decision tree with center question mark (128px)
    // SUPPORTING (2): Left branch (Simple→Standard, green check 96px), Right branch (Hard→Extended, orange brain 96px)
    // TEXT ON SCREEN:
    //   - "Simple Task" (48px) — 11 chars
    //   - "Hard Task" (48px) — 9 chars
    //   - "Standard Mode" (56px) — 13 chars
    //   - "Extended Thinking" (56px) — 17 chars
    //   Total visible: 50 chars ✓
    // PHASES:
    //   - 0-1s: Center question mark fades in
    //   - 1-2.5s: Left branch draws
    //   - 1.5-3s: Right branch draws
    //   - 3-4.5s: Left outcome appears
    //   - 3.5-5s: Right outcome appears
    //   - 5-7s: Hold
    // ELEMENT COUNT: 3 (center + 2 outcomes) ✓
    // PHONE TEST: All text 48-56px, icons 96-128px ✓
    id: "OP-025-IsTheSpecific",
    title: "Task Routing",
    subtitle: "When to use extended thinking",
    bottomLabel: "Thinking mode decision framework",
    bottomAccent: "decision framework",
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
          {/* Center question mark */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              marginBottom: zone.height * 0.12,
              zIndex: 1,
            }}
          >
            <HelpCircle
              size={Math.round(128 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2.5}
            />
          </div>

          {/* Branch container */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.15,
              alignItems: "flex-start",
              width: zone.width * 0.9,
              justifyContent: "center",
            }}
          >
            {/* LEFT BRANCH: Simple → Standard */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: zone.height * 0.06,
              }}
            >
              {/* Arrow */}
              <div
                style={{
                  opacity: ease(sceneFrame, 30, 50),
                  zIndex: 0,
                }}
              >
                <ArrowRight
                  size={Math.round(72 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={3}
                  style={{ transform: "rotate(45deg)" }}
                />
              </div>

              {/* Simple Task label */}
              <div
                style={{
                  ...fadeInUp(sceneFrame, 40),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Simple Task
              </div>

              {/* Outcome: Check + Standard Mode */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: zone.height * 0.04,
                  opacity: ease(sceneFrame, 90, 120),
                }}
              >
                <CheckCircle2
                  size={Math.round(96 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
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
                  Standard Mode
                </div>
              </div>
            </div>

            {/* RIGHT BRANCH: Hard → Extended */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: zone.height * 0.06,
              }}
            >
              {/* Arrow */}
              <div
                style={{
                  opacity: ease(sceneFrame, 45, 65),
                  zIndex: 0,
                }}
              >
                <ArrowRight
                  size={Math.round(72 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={3}
                  style={{ transform: "rotate(-45deg)" }}
                />
              </div>

              {/* Hard Task label */}
              <div
                style={{
                  ...fadeInUp(sceneFrame, 55),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Hard Task
              </div>

              {/* Outcome: Brain + Extended Thinking */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: zone.height * 0.04,
                  opacity: ease(sceneFrame, 105, 135),
                }}
              >
                <Brain
                  size={Math.round(96 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
                />
                <div
                  style={{
                    fontSize: Math.round(56 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    color: OB1.ORANGE,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  Extended Thinking
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-026-IfAPrompt
    // FOCAL: Two-path conditional flow diagram (IF/ELSE structure)
    // SUPPORTING (2): Top path (Type A → Config 1), Bottom path (Type B → Config 2)
    // TEXT ON SCREEN:
    //   - "IF" (72px) — 2 chars
    //   - "Prompt Type A" (48px) — 13 chars
    //   - "Config 1" (56px) — 8 chars
    //   - "ELSE" (72px) — 4 chars
    //   - "Prompt Type B" (48px) — 13 chars
    //   - "Config 2" (56px) — 8 chars
    //   Total visible: 48 chars ✓
    // PHASES:
    //   - 0-1s: IF label appears
    //   - 1-2.5s: Top path draws
    //   - 2.5-3.5s: ELSE label appears
    //   - 3.5-5s: Bottom path draws
    //   - 5-7s: Hold
    // ELEMENT COUNT: 2 paths ✓
    // PHONE TEST: All text 48-72px ✓
    id: "OP-026-IfAPrompt",
    title: "Prompt Logic",
    subtitle: "Conditional mode routing",
    bottomLabel: "Template optimization for deployment modes",
    bottomAccent: "deployment modes",
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
            gap: zone.height * 0.08,
          }}
        >
          {/* TOP PATH: IF */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.06,
            }}
          >
            {/* IF label */}
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              IF
            </div>

            {/* Arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 30, 50),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(64 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={3}
              />
            </div>

            {/* Prompt Type A */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 40),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Prompt Type A
            </div>

            {/* Arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 50, 70),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(64 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={3}
              />
            </div>

            {/* Config 1 box */}
            <div
              style={{
                opacity: ease(sceneFrame, 60, 80),
                backgroundColor: OB1.CYAN,
                padding: `${Math.round(16 * zone.scale)}px ${Math.round(32 * zone.scale)}px`,
                borderRadius: Math.round(8 * zone.scale),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  color: OB1.BG_DARK,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Config 1
              </div>
            </div>
          </div>

          {/* BOTTOM PATH: ELSE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.06,
            }}
          >
            {/* ELSE label */}
            <div
              style={{
                opacity: ease(sceneFrame, 75, 95),
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              ELSE
            </div>

            {/* Arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 105, 125),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(64 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
              />
            </div>

            {/* Prompt Type B */}
            <div
              style={{
                opacity: ease(sceneFrame, 115, 135),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Prompt Type B
            </div>

            {/* Arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 125, 145),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(64 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
              />
            </div>

            {/* Config 2 box */}
            <div
              style={{
                opacity: ease(sceneFrame, 135, 155),
                backgroundColor: OB1.ORANGE,
                padding: `${Math.round(16 * zone.scale)}px ${Math.round(32 * zone.scale)}px`,
                borderRadius: Math.round(8 * zone.scale),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  color: OB1.BG_DARK,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Config 2
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-027-BecauseTheModel
    // FOCAL: Horizontal bar comparison (token consumption)
    // SUPPORTING (2): Small bar (30% width, green), Large bar (100% width, orange)
    // TEXT ON SCREEN:
    //   - "Simple Task" (48px) — 11 chars
    //   - "Hard Task" (48px) — 9 chars
    //   - "LOW TOKENS" (52px) — 10 chars
    //   - "HIGH TOKENS" (52px) — 11 chars
    //   Total visible: 41 chars ✓
    // PHASES:
    //   - 0-1.5s: Simple task bar grows to 30%
    //   - 1.5-3s: Simple task label appears
    //   - 3-4.5s: Hard task bar grows to 100%
    //   - 4.5-6s: Hard task label appears
    //   - 6-7s: Hold
    // ELEMENT COUNT: 2 bars ✓
    // PHONE TEST: All text 48-52px ✓
    id: "OP-027-BecauseTheModel",
    title: "Token Burn",
    subtitle: "Extended thinking overhead",
    bottomLabel: "Harder tasks consume more tokens",
    bottomAccent: "more tokens",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const simpleBarWidth = ease(sceneFrame, 10, 45) * (zone.width * 0.3);
      const hardBarWidth = ease(sceneFrame, 90, 135) * (zone.width * 0.85);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: zone.height * 0.1,
            paddingLeft: zone.width * 0.05,
          }}
        >
          {/* Zap icon header */}
          <div
            style={{
              ...bouncePop(sceneFrame, 5, fps),
              marginBottom: zone.height * 0.02,
              zIndex: 1,
            }}
          >
            <Zap
              size={Math.round(80 * zone.scale)}
              color={OB1.AMBER}
              fill={OB1.AMBER}
              strokeWidth={0}
            />
          </div>

          {/* SIMPLE TASK bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: zone.height * 0.03,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: zone.width * 0.04,
              }}
            >
              <div
                style={{
                  width: simpleBarWidth,
                  height: Math.round(60 * zone.scale),
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  ...fadeInUp(sceneFrame, 45),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Simple Task
              </div>
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 55),
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: OB1.GREEN,
                marginLeft: zone.width * 0.02,
                zIndex: 10,
                position: "relative",
              }}
            >
              LOW TOKENS
            </div>
          </div>

          {/* HARD TASK bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: zone.height * 0.03,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: zone.width * 0.04,
              }}
            >
              <div
                style={{
                  width: hardBarWidth,
                  height: Math.round(60 * zone.scale),
                  backgroundColor: OB1.ORANGE,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  opacity: ease(sceneFrame, 125, 145),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Hard Task
              </div>
            </div>
            <div
              style={{
                opacity: ease(sceneFrame, 135, 155),
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: OB1.ORANGE,
                marginLeft: zone.width * 0.02,
                zIndex: 10,
                position: "relative",
              }}
            >
              HIGH TOKENS
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

export const OP_CLIPS_I = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
} from "./shared";
import {
  ArrowRight,
  Pencil,
  Image as ImageIcon,
  Presentation,
  Play,
  X,
  Equal,
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
    // DESIGN SPEC for CD-010-ProductionCode
    // FOCAL: Large equals sign connecting "Prototype" and "Production" boxes (merged phases)
    // SUPPORTING (1): "Old: 2 phases" annotation with arrow dimming out
    // SUPPORTING (2): "New: 1 phase" annotation appearing
    // TEXT ON SCREEN:
    //   - "Prototype" (60px) — 9 chars
    //   - "=" (120px symbol) — 1 char
    //   - "Production" (60px) — 10 chars
    //   - "Old: 2 phases" (48px) — 13 chars
    //   - "New: 1 phase" (48px) — 12 chars
    //   Total visible: ~45 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Old model annotation fades in above
    //   - 1.5-3s: Prototype and Production boxes appear with equals sign
    //   - 3-5s: Old annotation dims, new annotation appears
    //   - 5-7s: Hold on unified model
    // ELEMENT COUNT: 3 groups (old annotation, equation, new annotation) ✓
    // PHONE TEST: All text 48px+, boxes at 240×200 min ✓
    id: "CD-010-ProductionCode",
    title: "No Translation",
    subtitle: "unified development",
    bottomLabel: "Prototype and production code are the same artifact",
    bottomAccent: "same artifact",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const boxWidth = Math.round(zone.width * 0.32);
      const boxHeight = Math.round(zone.height * 0.35);
      const gap = Math.round(zone.width * 0.12);

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
          {/* Old model annotation - fades in then dims */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.08,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: ease(sceneFrame, 0, 15) * (1 - ease(sceneFrame, 90, 120) * 0.7),
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                position: "relative",
              }}
            >
              Old: 2 phases
            </div>
          </div>

          {/* Main equation: Prototype = Production */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: gap,
              opacity: ease(sceneFrame, 45, 75),
            }}
          >
            {/* Prototype box */}
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Prototype
              </div>
            </div>

            {/* Equals sign */}
            <div
              style={{
                opacity: ease(sceneFrame, 60, 90),
              }}
            >
              <Equal
                size={Math.round(120 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
              />
            </div>

            {/* Production box */}
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Production
              </div>
            </div>
          </div>

          {/* New model annotation - fades in late */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.08,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: ease(sceneFrame, 120, 150),
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                position: "relative",
              }}
            >
              New: 1 phase
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CD-011-CommunicateIdeas
    // FOCAL: 4-stage horizontal evolution timeline
    // SUPPORTING: Arrow connectors between stages
    // TEXT ON SCREEN:
    //   - "Sketch" (48px) — 6 chars
    //   - "Mockup" (48px) — 6 chars
    //   - "Deck" (48px) — 4 chars
    //   - "Interactive" (48px) — 11 chars
    //   Total visible: ~27 chars (well under 90) ✓
    // PHASES:
    //   - 0-2s: Stages appear left to right (staggered by 15 frames each)
    //   - 2-5s: Arrows draw between stages
    //   - 5-7s: Hold
    // ICONS: Pencil, Image, Presentation, Play (all 64px, inside 160px circles)
    // ELEMENT COUNT: 4 stages (at limit, justified as sequential timeline) ✓
    // PHONE TEST: All icons 64px in 160px circles, all labels 48px ✓
    id: "CD-011-CommunicateIdeas",
    title: "Evolution",
    subtitle: "of design artifacts",
    bottomLabel: "From sketch to interactive prototype without translation",
    bottomAccent: "without translation",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stages = [
        { label: "Sketch", icon: Pencil, delay: 0, color: OB1.STEEL },
        { label: "Mockup", icon: ImageIcon, delay: 15, color: OB1.CYAN },
        { label: "Deck", icon: Presentation, delay: 30, color: OB1.PURPLE },
        { label: "Interactive", icon: Play, delay: 45, color: OB1.GREEN },
      ];

      const stageSpacing = zone.width * 0.22;
      const startX = zone.width * 0.08;
      const circleSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);

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
          {/* Arrow connectors */}
          {stages.slice(0, -1).map((stage, i) => {
            const x1 = startX + stageSpacing * i + circleSize * 0.8;
            const x2 = startX + stageSpacing * (i + 1) - circleSize * 0.3;
            const arrowDelay = 60 + i * 20;

            return (
              <div
                key={`arrow-${i}`}
                style={{
                  position: "absolute",
                  left: x1,
                  top: "50%",
                  width: x2 - x1,
                  height: Math.round(3 * zone.scale),
                  backgroundColor: OB1.ORANGE,
                  opacity: ease(sceneFrame, arrowDelay, arrowDelay + 20),
                  transform: "translateY(-50%)",
                  zIndex: 0,
                }}
              />
            );
          })}

          {/* Stage nodes */}
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            const x = startX + stageSpacing * i;

            return (
              <div
                key={stage.label}
                style={{
                  position: "absolute",
                  left: x,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(16 * zone.scale),
                  opacity: ease(sceneFrame, stage.delay, stage.delay + 25),
                }}
              >
                {/* Circle with icon */}
                <div
                  style={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${stage.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Icon size={iconSize} color={stage.color} strokeWidth={2.5} />
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CD-012-NotPrimarily
    // FOCAL: Single unified artifact box with bidirectional indicator
    // SUPPORTING (1): Ghost "Translation Layer" element with X overlay (fading out)
    // TEXT ON SCREEN:
    //   - "Design Artifact" (56px) — 15 chars
    //   - "Production Format" (56px) — 17 chars
    //   - "Translation" (48px, crossed out) — 11 chars
    //   Total visible: ~43 chars (well under 90) ✓
    // PHASES:
    //   - 0-2s: Old model with translation layer visible
    //   - 2-4s: X appears over translation layer, it dims
    //   - 4-7s: Unified model dominates (artifact = format)
    // ELEMENT COUNT: 2 main boxes + 1 ghost element ✓
    // PHONE TEST: All text 48px+, boxes 320×240 ✓
    id: "CD-012-NotPrimarily",
    title: "Zero Translation",
    subtitle: "direct rendering",
    bottomLabel: "Design artifact renders directly as production format",
    bottomAccent: "directly",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const boxWidth = Math.round(zone.width * 0.38);
      const boxHeight = Math.round(zone.height * 0.42);

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
          {/* Ghost translation layer - old model, fades out */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: ease(sceneFrame, 0, 30) * (1 - ease(sceneFrame, 60, 90)),
              zIndex: 0,
            }}
          >
            <div
              style={{
                width: Math.round(boxWidth * 0.7),
                height: Math.round(boxHeight * 0.5),
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(2 * zone.scale)}px dashed ${OB1.DIM}`,
                borderRadius: Math.round(8 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.DIM,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Translation
              </div>

              {/* X overlay on translation */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: ease(sceneFrame, 60, 90),
                  zIndex: 10,
                }}
              >
                <X
                  size={Math.round(120 * zone.scale)}
                  color={OB1.RED}
                  strokeWidth={4}
                />
              </div>
            </div>
          </div>

          {/* Unified artifact box */}
          <div
            style={{
              opacity: ease(sceneFrame, 120, 150),
            }}
          >
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.GREEN}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(24 * zone.scale),
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Design Artifact
              </div>

              {/* Bidirectional equals indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: Math.round(12 * zone.scale),
                }}
              >
                <div
                  style={{
                    width: Math.round(60 * zone.scale),
                    height: Math.round(3 * zone.scale),
                    backgroundColor: OB1.ORANGE,
                  }}
                />
                <Equal
                  size={Math.round(48 * zone.scale)}
                  color={OB1.ORANGE}
                  strokeWidth={3}
                />
                <div
                  style={{
                    width: Math.round(60 * zone.scale),
                    height: Math.round(3 * zone.scale),
                    backgroundColor: OB1.ORANGE,
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Production Format
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
];

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

export const CD_CLIPS_D = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

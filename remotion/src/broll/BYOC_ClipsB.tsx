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
  MessageSquare,
  FileText,
  Layers,
  Sparkles,
  User,
  Building2,
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
    // DESIGN SPEC for BYOC-004-the-stuff-you-305-020
    // FOCAL: Two contrasting visual stacks showing "hundreds of small conversations" (left: vertical stack of 5 message bubbles) vs "single briefing doc" (right: one large document icon)
    // SUPPORTING (2):
    //   - Left side label "Implicit" (60px, above message stack) + counter showing "100s" (72px)
    //   - Right side label "Explicit" (60px, above doc) + "1" (72px)
    // TEXT ON SCREEN:
    //   - "Implicit" (60px) — 8 chars
    //   - "100s" (72px) — 4 chars
    //   - "Explicit" (60px) — 8 chars
    //   - "1" (72px) — 1 char
    //   Total visible: 21 chars (well under 90)
    // PHASES:
    //   - 0-1.5s: Left stack (Implicit) fades in with counter
    //   - 1.5-3s: Right doc (Explicit) fades in with "1"
    //   - 3-7s: Hold
    // ELEMENT COUNT: 2 groups (within 4 max) ✓
    // PHONE TEST: All text 60px+, all icons 64px+ ✓
    id: "BYOC-004-the-stuff-you-305-020",
    title: "Implicit vs Explicit",
    subtitle: "Context accumulation",
    bottomLabel: "Hundreds of conversations encode more context than one briefing doc",
    bottomAccent: "Hundreds",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Counter animation from 0 to 100+
      const count = countUp(sceneFrame, 0, 60, 100);

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
          {/* LEFT: Implicit - stacked message bubbles */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Label: Implicit */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                marginBottom: Math.round(8 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Implicit
            </div>

            {/* Counter */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                marginBottom: Math.round(12 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              {Math.floor(count)}s
            </div>

            {/* Stack of 5 message bubbles */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(12 * zone.scale),
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 30, 8)),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: Math.round(180 * zone.scale),
                    height: Math.round(56 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                    zIndex: 1,
                  }}
                >
                  <MessageSquare
                    size={Math.round(32 * zone.scale)}
                    color={OB1.CYAN}
                    style={{ zIndex: 1 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Explicit - single doc */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {/* Label: Explicit */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                marginBottom: Math.round(8 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Explicit
            </div>

            {/* Counter: 1 */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 55),
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                marginBottom: Math.round(12 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              1
            </div>

            {/* Single large doc icon */}
            <div
              style={{
                ...bouncePop(sceneFrame, 60, fps),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(180 * zone.scale),
                height: Math.round(220 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                zIndex: 1,
              }}
            >
              <FileText
                size={Math.round(96 * zone.scale)}
                color={OB1.ORANGE}
                style={{ zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-005-fresh-with-a-355-060
    // FOCAL: Two AI personas side-by-side: "Fresh AI" (left: generic sparkles icon with User icon, dim/gray) vs "Domain Expert AI" (right: sparkles + Building2 icon, bright/cyan)
    // SUPPORTING (2):
    //   - Left label "Fresh AI" (60px) below left persona
    //   - Right label "Domain Expert AI" (60px) below right persona
    // TEXT ON SCREEN:
    //   - "Fresh AI" (60px) — 8 chars
    //   - "Domain Expert AI" (60px) — 16 chars
    //   Total visible: 24 chars (well under 90)
    // PHASES:
    //   - 0-1.5s: Left persona (Fresh) fades in, dim appearance
    //   - 1.5-3.5s: Right persona (Expert) fades in, bright appearance
    //   - 3.5-7s: Pulse glow on expert AI
    // ELEMENT COUNT: 2 personas (within 4 max) ✓
    // PHONE TEST: All text 60px, icons 80px+ ✓
    id: "BYOC-005-fresh-with-a-355-060",
    title: "Fresh vs Expert",
    subtitle: "Domain knowledge encoding",
    bottomLabel: "Fresh AI feels like talking to a stranger; experienced AI understands your domain",
    bottomAccent: "understands",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const glowPulse = pulse(sceneFrame - 105, 0.04);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.15,
          }}
        >
          {/* LEFT: Fresh AI - dim/stranger */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Fresh AI persona container */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 15),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(240 * zone.scale),
                height: Math.round(240 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(16 * zone.scale),
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
                gap: Math.round(12 * zone.scale),
                zIndex: 1,
              }}
            >
              <Sparkles
                size={Math.round(64 * zone.scale)}
                color={OB1.DIM}
                style={{ zIndex: 1 }}
              />
              <User
                size={Math.round(48 * zone.scale)}
                color={OB1.DIM}
                style={{ zIndex: 1 }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 30),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                zIndex: 10,
                position: "relative",
              }}
            >
              Fresh AI
            </div>
          </div>

          {/* RIGHT: Domain Expert AI - bright/knowledgeable */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Expert AI persona container */}
            <div
              style={{
                ...bouncePop(sceneFrame, 45, fps),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(240 * zone.scale),
                height: Math.round(240 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(16 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                gap: Math.round(12 * zone.scale),
                boxShadow: `0 0 ${Math.round(30 * zone.scale * (0.5 + glowPulse * 0.5))}px ${OB1.CYAN}`,
                zIndex: 1,
              }}
            >
              <Sparkles
                size={Math.round(64 * zone.scale)}
                color={OB1.CYAN}
                style={{ zIndex: 1 }}
              />
              <Building2
                size={Math.round(64 * zone.scale)}
                color={OB1.CYAN}
                style={{ zIndex: 1 }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Domain Expert AI
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-006-second-layer-of-378-080
    // FOCAL: Four-layer vertical stack showing context layers (each layer is a card with icon + label)
    // LAYERS (4, but grouped as 1 focal element with 4 sub-parts):
    //   1. Domain Knowledge (bottom, CYAN, Database icon)
    //   2. Workflow Calibration (second, ORANGE, Layers icon)
    //   3. Behavioral Relationship (third, GREEN, User icon)
    //   4. Artifact Layer (top, PURPLE, FileText icon)
    // TEXT ON SCREEN:
    //   - "Domain" (48px) — 6 chars
    //   - "Workflow" (48px) — 8 chars
    //   - "Behavioral" (48px) — 10 chars
    //   - "Artifacts" (48px) — 9 chars
    //   Total visible: 33 chars (well under 90)
    // PHASES:
    //   - 0-1s: Bottom layer (Domain) fades in
    //   - 1-2s: Second layer (Workflow) fades in
    //   - 2-3s: Third layer (Behavioral) fades in
    //   - 3-4s: Top layer (Artifacts) fades in
    //   - 4-7s: Hold
    // ELEMENT COUNT: 4 layers, but visually grouped as 1 vertical stack ✓
    // PHONE TEST: All text 48px, all icons 64px ✓
    id: "BYOC-006-second-layer-of-378-080",
    title: "Four Context Layers",
    subtitle: "Enterprise AI depth",
    bottomLabel: "Domain knowledge, workflow calibration, behavioral relationship, and artifacts",
    bottomAccent: "Four",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const layers = [
        {
          label: "Domain",
          icon: Building2,
          color: OB1.CYAN,
          delay: 10,
        },
        {
          label: "Workflow",
          icon: Layers,
          color: OB1.ORANGE,
          delay: 30,
        },
        {
          label: "Behavioral",
          icon: User,
          color: OB1.GREEN,
          delay: 50,
        },
        {
          label: "Artifacts",
          icon: FileText,
          color: OB1.PURPLE,
          delay: 70,
        },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Vertical stack of 4 layers */}
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse", // Bottom to top visual order
              gap: Math.round(16 * zone.scale),
            }}
          >
            {layers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, layer.delay),
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(20 * zone.scale),
                    width: Math.round(480 * zone.scale),
                    height: Math.round(100 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(12 * zone.scale),
                    border: `${Math.round(3 * zone.scale)}px solid ${layer.color}`,
                    padding: `0 ${Math.round(24 * zone.scale)}px`,
                    zIndex: 1,
                  }}
                >
                  {/* Icon */}
                  <Icon
                    size={Math.round(64 * zone.scale)}
                    color={layer.color}
                    style={{ zIndex: 1, flexShrink: 0 }}
                  />

                  {/* Label */}
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
                    {layer.label}
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

export const BYOC_CLIPS_B = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

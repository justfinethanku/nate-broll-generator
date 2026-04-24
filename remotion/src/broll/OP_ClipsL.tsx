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
  X,
  CheckCircle2,
  BookOpen,
  Settings,
  FlaskConical,
  Code,
  Brain,
  Zap,
  DollarSign,
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
    // DESIGN SPEC for OP-034-BeingSofterI
    // FOCAL: Two side-by-side progress bars showing 4.6 stopping at ~60% (RED fade) vs 4.7 completing to 100% (GREEN)
    // SUPPORTING:
    //   - Version labels above bars ("Opus 4.6" / "Opus 4.7") — 60px
    //   - Percentage counters inside bars — 80px
    //   - Status icons: X for 4.6, checkmark for 4.7 — 64px
    // TEXT ON SCREEN:
    //   - "Opus 4.6" (60px) — 8 chars
    //   - "Opus 4.7" (60px) — 8 chars
    //   - "60%" (80px) — 3 chars
    //   - "100%" (80px) — 4 chars
    //   Total visible: 23 chars ✓
    // PHASES:
    //   - 0-1.5s: Bar containers fade in
    //   - 1.5-3.5s: 4.6 bar fills to 60%, counter animates
    //   - 3.5-5.5s: 4.7 bar fills to 100%, counter animates
    //   - 5.5-7s: Icons appear (X and checkmark)
    // ELEMENT COUNT: 2 bars (focal pair) ✓
    // PHONE TEST: All text 60-80px ✓
    id: "OP-034-BeingSofterI",
    title: "Task Persistence",
    subtitle: "4.6 vs 4.7 completion rates",
    bottomLabel: "Opus 4.7 keeps going when 4.6 gives up",
    bottomAccent: "keeps going",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const barWidth = zone.width * 0.35;
      const barHeight = zone.height * 0.15;
      const gap = zone.width * 0.08;

      // Version 4.6 (left) - stops at 60%
      const progress46 = Math.min(60, countUp(sceneFrame, 45, 105, 60));
      const opacity46 = ease(sceneFrame, 0, 30);
      const iconOpacity46 = ease(sceneFrame, 165, 190);

      // Version 4.7 (right) - completes to 100%
      const progress47 = Math.min(100, countUp(sceneFrame, 105, 165, 100));
      const opacity47 = ease(sceneFrame, 0, 30);
      const iconOpacity47 = ease(sceneFrame, 165, 190);

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
          {/* Opus 4.6 - Stops at 60% */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              opacity: opacity46,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Opus 4.6
            </div>
            <div
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(8 * zone.scale),
                position: "relative",
                overflow: "hidden",
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
              }}
            >
              <div
                style={{
                  width: `${progress46}%`,
                  height: "100%",
                  backgroundColor: OB1.RED,
                  borderRadius: Math.round(8 * zone.scale),
                  transition: "width 0.3s ease-out",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                }}
              >
                {Math.floor(progress46)}%
              </div>
            </div>
            <div style={{ opacity: iconOpacity46 }}>
              <X
                size={Math.round(64 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Opus 4.7 - Completes to 100% */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              opacity: opacity47,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Opus 4.7
            </div>
            <div
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(8 * zone.scale),
                position: "relative",
                overflow: "hidden",
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
              }}
            >
              <div
                style={{
                  width: `${progress47}%`,
                  height: "100%",
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(8 * zone.scale),
                  transition: "width 0.3s ease-out",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                }}
              >
                {Math.floor(progress47)}%
              </div>
            </div>
            <div style={{ opacity: iconOpacity47 }}>
              <CheckCircle2
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={3}
              />
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-035-UpgradeBasedOn
    // FOCAL: Vertical checklist with 3 items, checkmarks appearing sequentially
    // SUPPORTING: Each item has icon (64px) + label (48px)
    // TEXT ON SCREEN:
    //   - "Read Migration Guide" (48px) — 21 chars
    //   - "Enable High-Effort Mode" (48px) — 23 chars
    //   - "Test Your Pipeline" (48px) — 18 chars
    //   Total: 62 chars ✓
    // PHASES:
    //   - 0-1s: Title "Migration Steps" fades in (60px)
    //   - 1-2.5s: Item 1 + checkmark appear
    //   - 2.5-4s: Item 2 + checkmark appear
    //   - 4-5.5s: Item 3 + checkmark appear
    //   - 5.5-7s: Hold
    // ICONS: BookOpen, Settings, FlaskConical (lucide)
    // ELEMENT COUNT: 3 checklist items (grouped as one focal element) ✓
    // PHONE TEST: All text 48-60px ✓
    id: "OP-035-UpgradeBasedOn",
    title: "Migration Guide",
    subtitle: "Upgrading to Opus 4.7",
    bottomLabel: "Three steps to upgrade safely",
    bottomAccent: "safely",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const titleOpacity = ease(sceneFrame, 0, 30);

      const checklistItems = [
        {
          icon: BookOpen,
          label: "Read Migration Guide",
          delay: 30,
          checkDelay: 60,
        },
        {
          icon: Settings,
          label: "Enable High-Effort Mode",
          delay: 60,
          checkDelay: 90,
        },
        {
          icon: FlaskConical,
          label: "Test Your Pipeline",
          delay: 90,
          checkDelay: 120,
        },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(24 * zone.scale),
          }}
        >
          <div
            style={{
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              opacity: titleOpacity,
              marginBottom: zone.height * 0.05,
              zIndex: 10,
              position: "relative",
            }}
          >
            Migration Steps
          </div>

          {checklistItems.map((item, index) => {
            const ItemIcon = item.icon;
            const itemOpacity = ease(sceneFrame, item.delay, item.delay + 30);
            const checkOpacity = ease(
              sceneFrame,
              item.checkDelay,
              item.checkDelay + 20
            );

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: Math.round(24 * zone.scale),
                  opacity: itemOpacity,
                  width: zone.width * 0.7,
                }}
              >
                <div
                  style={{
                    width: Math.round(64 * zone.scale),
                    height: Math.round(64 * zone.scale),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: OB1.BG_MID,
                    borderRadius: Math.round(8 * zone.scale),
                    flexShrink: 0,
                  }}
                >
                  <ItemIcon
                    size={Math.round(40 * zone.scale)}
                    color={OB1.CYAN}
                    strokeWidth={2}
                  />
                </div>
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    flex: 1,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {item.label}
                </div>
                <div style={{ opacity: checkOpacity, flexShrink: 0 }}>
                  <CheckCircle2
                    size={Math.round(48 * zone.scale)}
                    color={OB1.GREEN}
                    strokeWidth={3}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-036-DoesAndDoesnt
    // FOCAL: 3×4 capability matrix — 3 models (rows) × 4 dimensions (columns)
    // SUPPORTING:
    //   - Model labels (left): "Opus 4.7", "Mythos", "ChatGPT 5.4" — 48px
    //   - Column headers (top): icons only (Code, Brain, Zap, DollarSign) — 56px
    // TEXT ON SCREEN:
    //   - "Opus 4.7" (48px) — 8 chars
    //   - "Mythos" (48px) — 6 chars
    //   - "ChatGPT 5.4" (48px) — 12 chars
    //   Total: 26 chars ✓
    // PHASES:
    //   - 0-1s: Grid structure + headers fade in
    //   - 1-2s: Model labels appear vertically staggered
    //   - 2-5s: Dots fill in row-by-row (green = strong, amber = partial, dim = weak)
    //   - 5-7s: Hold
    // LOGOS: claude.svg for Opus, Brain icon for Mythos (no logo), openai.svg for ChatGPT
    // ELEMENT COUNT: 1 grid (focal) + 3 labels + 4 header icons = fits pattern ✓
    // PHONE TEST: All text 48px, dots 28px diameter ✓
    id: "OP-036-DoesAndDoesnt",
    title: "Model Comparison",
    subtitle: "Frontier capabilities",
    bottomLabel: "Opus 4.7 vs Mythos vs ChatGPT 5.4 strengths",
    bottomAccent: "strengths",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const gridOpacity = ease(sceneFrame, 0, 30);

      const headerIcons = [
        { icon: Code, label: "Code" },
        { icon: Brain, label: "Reasoning" },
        { icon: Zap, label: "Agentic" },
        { icon: DollarSign, label: "Cost" },
      ];

      const models = [
        {
          name: "Opus 4.7",
          logo: "claude",
          capabilities: [OB1.GREEN, OB1.GREEN, OB1.GREEN, OB1.AMBER],
          delay: 30,
        },
        {
          name: "Mythos",
          logo: null,
          capabilities: [OB1.GREEN, OB1.AMBER, OB1.GREEN, OB1.GREEN],
          delay: 60,
        },
        {
          name: "ChatGPT 5.4",
          logo: "openai",
          capabilities: [OB1.AMBER, OB1.GREEN, OB1.AMBER, OB1.AMBER],
          delay: 90,
        },
      ];

      const cellSize = Math.round(56 * zone.scale);
      const dotSize = Math.round(28 * zone.scale);
      const rowHeight = Math.round(80 * zone.scale);
      const colWidth = Math.round(100 * zone.scale);

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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(16 * zone.scale),
              opacity: gridOpacity,
            }}
          >
            {/* Header row with icons */}
            <div
              style={{
                display: "flex",
                gap: Math.round(8 * zone.scale),
                marginLeft: zone.width * 0.2,
              }}
            >
              {headerIcons.map((item, idx) => {
                const HeaderIcon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      width: colWidth,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <HeaderIcon
                      size={cellSize}
                      color={OB1.STEEL}
                      strokeWidth={2}
                    />
                  </div>
                );
              })}
            </div>

            {/* Model rows */}
            {models.map((model, rowIdx) => {
              const labelOpacity = ease(
                sceneFrame,
                model.delay,
                model.delay + 30
              );

              return (
                <div
                  key={rowIdx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(8 * zone.scale),
                  }}
                >
                  {/* Model label/logo */}
                  <div
                    style={{
                      width: zone.width * 0.18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: Math.round(12 * zone.scale),
                      opacity: labelOpacity,
                    }}
                  >
                    {model.logo ? (
                      <Img
                        src={staticFile(`logos/${model.logo}.svg`)}
                        style={{
                          width: Math.round(48 * zone.scale),
                          height: Math.round(48 * zone.scale),
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    ) : (
                      <Brain
                        size={Math.round(48 * zone.scale)}
                        color={OB1.PURPLE}
                        strokeWidth={2}
                      />
                    )}
                    <div
                      style={{
                        fontSize: Math.round(48 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        zIndex: 10,
                        position: "relative",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {model.name}
                    </div>
                  </div>

                  {/* Capability dots */}
                  {model.capabilities.map((color, colIdx) => {
                    const dotDelay = model.delay + 30 + colIdx * 15;
                    const dotOpacity = ease(
                      sceneFrame,
                      dotDelay,
                      dotDelay + 20
                    );
                    const scale = ease(sceneFrame, dotDelay, dotDelay + 20);

                    return (
                      <div
                        key={colIdx}
                        style={{
                          width: colWidth,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: dotSize,
                            height: dotSize,
                            borderRadius: "50%",
                            backgroundColor: color,
                            opacity: dotOpacity,
                            transform: `scale(${scale})`,
                            zIndex: 1,
                          }}
                        />
                      </div>
                    );
                  })}
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

export const OP_CLIPS_L = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

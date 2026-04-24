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
  BarChart3,
  Table2,
  SlidersHorizontal,
  Database,
  FileText,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
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
    // DESIGN SPEC for CD-007-DashboardCatalog (REVISED)
    // FOCAL: 4-across horizontal row of widget cards
    // SUPPORTING: Each card has icon + label
    // TEXT ON SCREEN:
    //   - "Chart" (40px) — 5 chars
    //   - "Table" (40px) — 5 chars
    //   - "Filter" (40px) — 6 chars
    //   - "State" (40px) — 5 chars
    //   Total visible: 21 chars ✓
    // PHASES:
    //   - 0-1.5s: Four widgets appear staggered
    //   - 1.5-7s: Hold with subtle pulse
    // VERTICAL BUDGET (at 1080p, zone.height ~576px):
    //   - Top margin: 5% = 29px
    //   - Card height: 70% = 403px
    //   - Bottom margin: 5% = 29px
    //   Total: 461px ✓ (under 576px)
    // ELEMENT COUNT: 4 widgets (within limit) ✓
    // PHONE TEST: All labels 40px, all icons 64px ✓
    id: "CD-007-DashboardCatalog",
    title: "Dashboard Components",
    subtitle: "Building blocks",
    bottomLabel: "Data charts, tables, filters — composable interface primitives",
    bottomAccent: "composable",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const widgets = [
        { icon: BarChart3, label: "Chart", color: OB1.CYAN, index: 0 },
        { icon: Table2, label: "Table", color: OB1.ORANGE, index: 1 },
        { icon: SlidersHorizontal, label: "Filter", color: OB1.PURPLE, index: 2 },
        { icon: Database, label: "State", color: OB1.GREEN, index: 3 },
      ];

      // Vertical budget: 70% of zone height for cards, 5% margins top/bottom
      const cardHeight = zone.height * 0.7;
      const cardWidth = zone.width * 0.2; // 4 cards = 20% each = 80% total, 20% for gaps
      const gap = zone.width * 0.04;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: gap,
            position: "relative",
          }}
        >
          {widgets.map((widget) => {
            const Icon = widget.icon;
            const delay = stagger(widget.index, 10, 12);
            const pulseVal = pulse(sceneFrame - 60, 0.03);

            return (
              <div
                key={widget.label}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(12 * zone.scale),
                  border: `${Math.round(3 * zone.scale)}px solid ${widget.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(20 * zone.scale),
                  opacity: ease(sceneFrame, delay, delay + 20) * (0.9 + pulseVal * 0.1),
                  zIndex: 1,
                }}
              >
                <Icon
                  size={Math.round(64 * zone.scale)}
                  color={widget.color}
                  strokeWidth={2.5}
                />
                <div
                  style={{
                    fontSize: Math.round(40 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {widget.label}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CD-008-ThreeStepLoop
    // FOCAL: Horizontal flow: text input → Claude logo → output document (3 connected stages)
    // SUPPORTING: Arrows between stages
    // TEXT ON SCREEN:
    //   - "Describe" (48px) — 8 chars
    //   - "Generate" (48px) — 8 chars
    //   - "Working" (48px) — 7 chars
    //   Total visible: 23 chars ✓
    // PHASES:
    //   - 0-1.5s: Input stage fades in
    //   - 1.5-3s: Arrow + Claude logo appear
    //   - 3-4.5s: Arrow + output appear
    //   - 4.5-7s: Subtle pulse on Claude logo
    // LOGOS: claude.svg (140px)
    // ELEMENT COUNT: 3 stages (within limit) ✓
    // PHONE TEST: All text 48px, logo 140px ✓
    id: "CD-008-ThreeStepLoop",
    title: "Creation Loop",
    subtitle: "Natural language to working code",
    bottomLabel: "Describe what you need, Claude generates working output",
    bottomAccent: "working output",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stageWidth = zone.width * 0.22;
      const stageHeight = zone.height * 0.4;
      const arrowWidth = zone.width * 0.08;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: arrowWidth,
            position: "relative",
          }}
        >
          {/* Stage 1: Input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              ...fadeInUp(sceneFrame, 0),
            }}
          >
            <div
              style={{
                width: stageWidth,
                height: stageHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <FileText
                size={Math.round(80 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>
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
              Describe
            </div>
          </div>

          {/* Arrow 1 */}
          <div style={{ ...fadeInUp(sceneFrame, 30) }}>
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.DIM}
              strokeWidth={2.5}
            />
          </div>

          {/* Stage 2: Claude */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              ...fadeInUp(sceneFrame, 30),
            }}
          >
            <div
              style={{
                width: stageWidth,
                height: stageHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.9 + pulse(sceneFrame - 90, 0.03) * 0.1,
                zIndex: 1,
              }}
            >
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Generate
            </div>
          </div>

          {/* Arrow 2 */}
          <div style={{ ...fadeInUp(sceneFrame, 60) }}>
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.DIM}
              strokeWidth={2.5}
            />
          </div>

          {/* Stage 3: Output */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              ...fadeInUp(sceneFrame, 60),
            }}
          >
            <div
              style={{
                width: stageWidth,
                height: stageHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <CheckCircle2
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
              />
            </div>
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
              Working
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CD-009-WaterfallPhases
    // FOCAL: Three vertical stages with downward arrows: document → prototype → build
    // SUPPORTING: Stage labels
    // TEXT ON SCREEN:
    //   - "Spec" (56px) — 4 chars
    //   - "Prototype" (56px) — 9 chars
    //   - "Build" (56px) — 5 chars
    //   Total visible: 18 chars ✓
    // PHASES:
    //   - 0-2s: Spec stage appears
    //   - 2-4s: Arrow + Prototype stage
    //   - 4-6s: Arrow + Build stage
    //   - 6-7s: Hold
    // ELEMENT COUNT: 3 stages (within limit) ✓
    // PHONE TEST: All text 56px, icons 80px+ ✓
    id: "CD-009-WaterfallPhases",
    title: "Traditional Waterfall",
    subtitle: "Sequential handoffs",
    bottomLabel: "Written spec, then prototype, then production build",
    bottomAccent: "prototype",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stageWidth = zone.width * 0.5;
      const stageHeight = zone.height * 0.18;
      const gap = zone.height * 0.08;

      const stages = [
        { icon: FileText, label: "Spec", color: OB1.STEEL, delay: 0 },
        { icon: Lightbulb, label: "Prototype", color: OB1.AMBER, delay: 40 },
        { icon: CheckCircle2, label: "Build", color: OB1.GREEN, delay: 80 },
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
            gap: gap,
            position: "relative",
          }}
        >
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const showArrow = index < stages.length - 1;
            const arrowDelay = stage.delay + 20;

            return (
              <React.Fragment key={stage.label}>
                {/* Stage box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(32 * zone.scale),
                    ...fadeInUp(sceneFrame, stage.delay),
                  }}
                >
                  <div
                    style={{
                      width: stageWidth,
                      height: stageHeight,
                      backgroundColor: OB1.BG_MID,
                      borderRadius: Math.round(12 * zone.scale),
                      border: `${Math.round(3 * zone.scale)}px solid ${stage.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: Math.round(24 * zone.scale),
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={Math.round(80 * zone.scale)}
                      color={stage.color}
                      strokeWidth={2.5}
                    />
                    <div
                      style={{
                        fontSize: Math.round(56 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 600,
                        color: OB1.WHITE,
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {stage.label}
                    </div>
                  </div>
                </div>

                {/* Arrow between stages */}
                {showArrow && (
                  <div
                    style={{
                      opacity: ease(sceneFrame, arrowDelay, arrowDelay + 20),
                    }}
                  >
                    <ArrowDown
                      size={Math.round(40 * zone.scale)}
                      color={OB1.DIM}
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
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

export const CD_CLIPS_C = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

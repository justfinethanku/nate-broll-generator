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
  Building2,
  Factory,
  Landmark,
  Building,
  Calendar,
  TrendingUp,
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
    // DESIGN SPEC for OP-031-ProductIncreasesTheir
    // FOCAL: Growth chart with 3 horizontal bars (product lines) expanding left-to-right
    // SUPPORTING (3):
    //   1. Three product category labels on left (Analytics, Security, Infrastructure)
    //   2. Cluster of 4 Fortune 10 enterprise icons (140px each) appearing staggered at top
    //   3. Growth arrow trending upward in background (decorative)
    // TEXT ON SCREEN:
    //   - "Analytics" (48px) — 9 chars
    //   - "Security" (48px) — 8 chars
    //   - "Infrastructure" (48px) — 14 chars
    //   Total visible: 31 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Product labels fade in
    //   - 1.5-3.5s: Bars grow horizontally
    //   - 3.5-5.5s: Enterprise icons pop in staggered
    //   - 5.5-7s: Hold with subtle pulse
    // ELEMENT COUNT: 3 bars + 4-icon group = 2 visual groups ✓
    // PHONE TEST: All text 48px, all icons 140px ✓
    id: "OP-031-ProductIncreasesTheir",
    title: "Enterprise Growth",
    subtitle: "Product expansion drives adoption",
    bottomLabel: "New product categories multiply Fortune 10 customers",
    bottomAccent: "Fortune 10",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const products = [
        { label: "Analytics", color: OB1.CYAN, maxWidth: 0.5, delay: 20 },
        { label: "Security", color: OB1.ORANGE, maxWidth: 0.65, delay: 30 },
        { label: "Infrastructure", color: OB1.PURPLE, maxWidth: 0.75, delay: 40 },
      ];

      const enterpriseIcons = [
        { Icon: Building2, delay: 80 },
        { Icon: Factory, delay: 90 },
        { Icon: Landmark, delay: 100 },
        { Icon: Building, delay: 110 },
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
            position: "relative",
          }}
        >
          {/* Background growth arrow - decorative, zIndex 0 */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.15,
              right: zone.width * 0.1,
              opacity: ease(sceneFrame, 50, 80) * 0.2,
              zIndex: 0,
            }}
          >
            <TrendingUp
              size={Math.round(120 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={2}
            />
          </div>

          {/* Enterprise icons at top - icons, zIndex 1 */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.08,
              display: "flex",
              gap: Math.round(zone.width * 0.06),
              zIndex: 1,
            }}
          >
            {enterpriseIcons.map((item, i) => {
              const IconComponent = item.Icon;
              return (
                <div
                  key={i}
                  style={{
                    ...bouncePop(sceneFrame, item.delay, fps),
                  }}
                >
                  <IconComponent
                    size={Math.round(140 * zone.scale)}
                    color={OB1.WHITE}
                    strokeWidth={1.5}
                  />
                </div>
              );
            })}
          </div>

          {/* Product bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(zone.height * 0.08),
              width: zone.width * 0.85,
              marginTop: zone.height * 0.25,
            }}
          >
            {products.map((product, i) => {
              const barWidth = ease(sceneFrame, product.delay, product.delay + 40) * (zone.width * product.maxWidth);
              const pulseVal = pulse(sceneFrame - product.delay, 0.04);
              const labelOpacity = ease(sceneFrame, 10, 30);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(zone.width * 0.04),
                  }}
                >
                  {/* Label - text, zIndex 10 */}
                  <div
                    style={{
                      fontSize: Math.round(48 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      opacity: labelOpacity,
                      minWidth: Math.round(220 * zone.scale),
                      textAlign: "right",
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {product.label}
                  </div>

                  {/* Bar - shape, zIndex 1 */}
                  <div
                    style={{
                      width: barWidth,
                      height: Math.round(56 * zone.scale),
                      backgroundColor: product.color,
                      borderRadius: Math.round(8 * zone.scale),
                      opacity: 0.8 + pulseVal * 0.2,
                      zIndex: 1,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-032-YoureInA
    // FOCAL: Timeline arrow from left (OCT IPO) to right ($60B), with OpenAI/Anthropic logo collision in center
    // SUPPORTING (2):
    //   1. "OCT 2026 IPO" label at left with calendar icon
    //   2. "$60B" callout at right in large ORANGE text (96px)
    // TEXT ON SCREEN:
    //   - "OCT 2026" (56px) — 8 chars
    //   - "IPO" (56px) — 3 chars
    //   - "$60B" (96px) — 4 chars
    //   Total visible: 15 chars ✓
    // PHASES:
    //   - 0-1.5s: Timeline arrow draws left to right
    //   - 1.5-3s: OCT IPO label fades in at left
    //   - 3-4.5s: OpenAI logo slides toward center
    //   - 4.5-6s: Anthropic logo appears, collision shake
    //   - 6-7s: $60B callout pops in
    // LOGOS: openai.svg, anthropic.svg at 140px each
    // ELEMENT COUNT: 3 (timeline group, collision group, $60B) ✓
    // PHONE TEST: All text ≥56px, logos 140px ✓
    id: "OP-032-YoureInA",
    title: "IPO Race",
    subtitle: "Competitive positioning",
    bottomLabel: "October IPO target with $60B raise timing bind",
    bottomAccent: "$60B",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Timeline arrow progress
      const arrowProgress = ease(sceneFrame, 0, 30);
      const arrowWidth = arrowProgress * (zone.width * 0.8);

      // Logo positions and collision
      const openaiSlide = ease(sceneFrame, 50, 80);
      const anthropicAppear = ease(sceneFrame, 90, 110);
      const collisionShake = sceneFrame > 110 && sceneFrame < 130
        ? Math.sin((sceneFrame - 110) * 0.8) * 8 * zone.scale
        : 0;

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
          {/* Timeline arrow - decorative, zIndex 0 */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.5,
              left: zone.width * 0.1,
              width: arrowWidth,
              height: Math.round(4 * zone.scale),
              backgroundColor: OB1.STEEL,
              zIndex: 0,
            }}
          >
            {/* Arrow head */}
            {arrowProgress > 0.9 && (
              <div
                style={{
                  position: "absolute",
                  right: Math.round(-12 * zone.scale),
                  top: Math.round(-6 * zone.scale),
                  width: 0,
                  height: 0,
                  borderLeft: `${Math.round(12 * zone.scale)}px solid ${OB1.STEEL}`,
                  borderTop: `${Math.round(8 * zone.scale)}px solid transparent`,
                  borderBottom: `${Math.round(8 * zone.scale)}px solid transparent`,
                  opacity: ease(sceneFrame, 25, 35),
                }}
              />
            )}
          </div>

          {/* OCT IPO label - left side */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.08,
              top: zone.height * 0.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              ...fadeInUp(sceneFrame, 30),
            }}
          >
            <Calendar
              size={Math.round(64 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              OCT 2026
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              IPO
            </div>
          </div>

          {/* Logo collision in center */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.35 + openaiSlide * (zone.width * 0.1),
              top: zone.height * 0.4,
              display: "flex",
              gap: Math.round(40 * zone.scale),
              alignItems: "center",
              transform: `translateX(${collisionShake}px)`,
            }}
          >
            {/* OpenAI logo */}
            <div style={{ opacity: ease(sceneFrame, 50, 70) }}>
              <Img
                src={staticFile("logos/openai.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            {/* Anthropic logo */}
            <div style={{ opacity: anthropicAppear }}>
              <Img
                src={staticFile("logos/anthropic.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>

          {/* $60B callout - right side */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.1,
              top: zone.height * 0.3,
              ...bouncePop(sceneFrame, 140, fps),
            }}
          >
            <div
              style={{
                fontSize: Math.round(96 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              $60B
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for OP-033-YouShouldUpgrade
    // FOCAL: Decision flowchart with diamond decision node in center
    // SUPPORTING (3):
    //   1. "Agentic Pipeline" box at left
    //   2. "4.6 Stay" outcome box (STEEL) at bottom-left
    //   3. "4.7 Migrate" outcome box (GREEN) at bottom-right
    // TEXT ON SCREEN:
    //   - "Agentic Pipeline" (56px) — 16 chars
    //   - "Upgrade?" (60px) — 8 chars
    //   - "4.6 Stay" (48px) — 8 chars
    //   - "4.7 Migrate" (48px) — 11 chars
    //   Total visible: 43 chars ✓
    // PHASES:
    //   - 0-1.5s: Pipeline box fades in
    //   - 1.5-3s: Arrow to diamond draws
    //   - 3-4s: Diamond + "Upgrade?" appears
    //   - 4-5.5s: Left path (4.6) draws and appears
    //   - 5.5-7s: Right path (4.7) draws and appears
    // ELEMENT COUNT: 4 nodes (exactly at limit) ✓
    // PHONE TEST: All text ≥48px ✓
    id: "OP-033-YouShouldUpgrade",
    title: "Migration Decision",
    subtitle: "Agentic pipeline upgrade path",
    bottomLabel: "When to move from 4.6 to 4.7 in production",
    bottomAccent: "4.7",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Node dimensions
      const boxWidth = Math.round(280 * zone.scale);
      const boxHeight = Math.round(120 * zone.scale);
      const diamondSize = Math.round(160 * zone.scale);
      const outcomeBoxWidth = Math.round(200 * zone.scale);
      const outcomeBoxHeight = Math.round(100 * zone.scale);

      // Positions
      const pipelineX = zone.width * 0.15;
      const pipelineY = zone.height * 0.3;
      const diamondX = zone.width * 0.5;
      const diamondY = zone.height * 0.35;
      const outcome46X = zone.width * 0.3;
      const outcome47X = zone.width * 0.7;
      const outcomeY = zone.height * 0.7;

      // Animation phases
      const pipelineOpacity = ease(sceneFrame, 0, 20);
      const arrow1Progress = ease(sceneFrame, 30, 50);
      const diamondOpacity = ease(sceneFrame, 60, 80);
      const arrow2Progress46 = ease(sceneFrame, 90, 110);
      const outcome46Opacity = ease(sceneFrame, 100, 120);
      const arrow2Progress47 = ease(sceneFrame, 120, 140);
      const outcome47Opacity = ease(sceneFrame, 130, 150);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            position: "relative",
          }}
        >
          {/* Arrow 1: Pipeline to Diamond - zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            <line
              x1={pipelineX + boxWidth}
              y1={pipelineY + boxHeight / 2}
              x2={pipelineX + boxWidth + arrow1Progress * (diamondX - pipelineX - boxWidth - diamondSize / 2)}
              y2={pipelineY + boxHeight / 2}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={arrow1Progress}
            />
          </svg>

          {/* Arrow 2: Diamond to 4.6 outcome - zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            <line
              x1={diamondX - diamondSize * 0.3}
              y1={diamondY + diamondSize / 2}
              x2={diamondX - diamondSize * 0.3 + arrow2Progress46 * (outcome46X + outcomeBoxWidth / 2 - (diamondX - diamondSize * 0.3))}
              y2={diamondY + diamondSize / 2 + arrow2Progress46 * (outcomeY - outcomeBoxHeight / 2 - (diamondY + diamondSize / 2))}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={arrow2Progress46}
            />
          </svg>

          {/* Arrow 3: Diamond to 4.7 outcome - zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            <line
              x1={diamondX + diamondSize * 0.3}
              y1={diamondY + diamondSize / 2}
              x2={diamondX + diamondSize * 0.3 + arrow2Progress47 * (outcome47X - outcomeBoxWidth / 2 - (diamondX + diamondSize * 0.3))}
              y2={diamondY + diamondSize / 2 + arrow2Progress47 * (outcomeY - outcomeBoxHeight / 2 - (diamondY + diamondSize / 2))}
              stroke={OB1.GREEN}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={arrow2Progress47}
            />
          </svg>

          {/* Pipeline box - container, zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: pipelineX,
              top: pipelineY,
              width: boxWidth,
              height: boxHeight,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
              borderRadius: Math.round(8 * zone.scale),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: pipelineOpacity,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Agentic<br />Pipeline
            </div>
          </div>

          {/* Decision diamond - container, zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: diamondX - diamondSize / 2,
              top: diamondY - diamondSize / 2,
              width: diamondSize,
              height: diamondSize,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
              transform: "rotate(45deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: diamondOpacity,
              zIndex: 1,
            }}
          >
            <div
              style={{
                transform: "rotate(-45deg)",
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Upgrade?
            </div>
          </div>

          {/* 4.6 Stay outcome - container, zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: outcome46X - outcomeBoxWidth / 2,
              top: outcomeY - outcomeBoxHeight / 2,
              width: outcomeBoxWidth,
              height: outcomeBoxHeight,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
              borderRadius: Math.round(8 * zone.scale),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: outcome46Opacity,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              4.6 Stay
            </div>
          </div>

          {/* 4.7 Migrate outcome - container, zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: outcome47X - outcomeBoxWidth / 2,
              top: outcomeY - outcomeBoxHeight / 2,
              width: outcomeBoxWidth,
              height: outcomeBoxHeight,
              backgroundColor: OB1.BG_MID,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
              borderRadius: Math.round(8 * zone.scale),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: outcome47Opacity,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              4.7 Migrate
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

export const OP_CLIPS_K = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

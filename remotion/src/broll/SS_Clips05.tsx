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
  pulse,
} from "./shared";
import {
  Server,
  Brain,
  ArrowRight,
  Shield,
  Building,
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
    // DESIGN SPEC for SS-013-BusinessModelEvolution
    // FOCAL: Side-by-side comparison — Traditional SaaS box (left) vs AI-augmented box (right) with arrow between
    // SUPPORTING (3):
    //   1. Traditional SaaS icon (Server lucide icon at 64px inside 160px circle, OB1.STEEL)
    //   2. AI-augmented icon (Brain lucide icon at 64px inside 160px circle, OB1.CYAN)
    //   3. Arrow pointing right (64px ArrowRight lucide icon, OB1.ORANGE)
    // TEXT ON SCREEN:
    //   - "Traditional SaaS" (48px, below left circle) — 16 chars
    //   - "AI-Augmented" (48px, below right circle) — 13 chars
    //   Total visible: 29 chars (well under 90)
    // PHASES:
    //   - 0-1.5s: Left circle + label fade in
    //   - 1.5-2.5s: Arrow draws/fades in
    //   - 2.5-4s: Right circle + label fade in
    //   - 4-7s: Hold with subtle pulse on right circle
    // LOGOS: None (abstract concept — using lucide icons)
    // ELEMENT COUNT: 3 groups (left, arrow, right) ✓
    // PHONE TEST: All text 48px, all icons 64px in 160px circles ✓
    id: "SS-013-BusinessModelEvolution",
    title: "Business Model Evolution",
    subtitle: "The shift in AI offerings",
    bottomLabel: "Traditional SaaS to AI-augmented platforms",
    bottomAccent: "AI-augmented",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const circleSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const fontSize = Math.round(48 * zone.scale);
      const gap = zone.width * 0.08;
      const arrowSize = Math.round(64 * zone.scale);

      // Animation timing
      const leftOpacity = ease(sceneFrame, 0, 45);
      const arrowOpacity = ease(sceneFrame, 45, 75);
      const rightOpacity = ease(sceneFrame, 75, 120);
      const pulseVal = pulse(sceneFrame - 120, 0.03);

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
          {/* Left: Traditional SaaS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              opacity: leftOpacity,
            }}
          >
            <div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Server size={iconSize} color={OB1.STEEL} strokeWidth={2} />
            </div>
            <div
              style={{
                fontSize: fontSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Traditional SaaS
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: arrowOpacity,
              zIndex: 1,
            }}
          >
            <ArrowRight size={arrowSize} color={OB1.ORANGE} strokeWidth={3} />
          </div>

          {/* Right: AI-Augmented */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              opacity: rightOpacity,
            }}
          >
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
                opacity: 0.7 + pulseVal * 0.3,
                boxShadow: `0 0 ${Math.round(20 * zone.scale)}px ${OB1.CYAN}${Math.round(pulseVal * 0.4 * 255).toString(16).padStart(2, '0')}`,
                zIndex: 1,
              }}
            >
              <Brain size={iconSize} color={OB1.CYAN} strokeWidth={2} />
            </div>
            <div
              style={{
                fontSize: fontSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              AI-Augmented
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for SS-014-AnthropicTimeline
    // FOCAL: Horizontal timeline with 3 key milestone nodes
    // SUPPORTING (3):
    //   1. Milestone 1: "Anthropic Founded" (circle node 160px, anthropic.svg logo 96px, date label 40px)
    //   2. Milestone 2: "Defense Partnership" (circle node 160px, shield lucide icon 64px, date label 40px)
    //   3. Milestone 3: "Federal Access" (circle node 160px, building lucide icon 64px, date label 40px)
    // TEXT ON SCREEN:
    //   - "2021" (40px) — 4 chars
    //   - "2024" (40px) — 4 chars
    //   - "2025" (40px) — 4 chars
    //   - "Founded", "Partnership", "Federal" (40px each) — 25 chars total
    //   Total visible: ~37 chars
    // PHASES:
    //   - 0-1s: Timeline line draws left to right
    //   - 1-2.5s: Node 1 pops in with logo
    //   - 2.5-4s: Node 2 pops in
    //   - 4-5.5s: Node 3 pops in
    //   - 5.5-7s: Hold
    // LOGOS: anthropic.svg (one usage)
    // ELEMENT COUNT: 3 milestone nodes ✓
    // PHONE TEST: All text 40px+, logo 96px, icons 64px ✓
    id: "SS-014-AnthropicTimeline",
    title: "Timeline",
    subtitle: "Anthropic's federal journey",
    bottomLabel: "From startup to federal contractor",
    bottomAccent: "federal contractor",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const circleSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const logoSize = Math.round(96 * zone.scale);
      const labelSize = Math.round(40 * zone.scale);
      const lineLength = zone.width * 0.8;
      const lineY = zone.height * 0.5;

      // Timeline line draw
      const lineProgress = ease(sceneFrame, 0, 30);

      // Milestones
      const milestones = [
        {
          x: 0.1,
          year: "2021",
          label: "Founded",
          type: "logo" as const,
          delay: 30,
          color: OB1.ORANGE,
        },
        {
          x: 0.5,
          year: "2024",
          label: "Partnership",
          type: "shield" as const,
          delay: 75,
          color: OB1.CYAN,
        },
        {
          x: 0.9,
          year: "2025",
          label: "Federal",
          type: "building" as const,
          delay: 120,
          color: OB1.GREEN,
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
            position: "relative",
          }}
        >
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              left: (zone.width - lineLength) / 2,
              top: lineY,
              width: lineLength * lineProgress,
              height: Math.round(4 * zone.scale),
              backgroundColor: OB1.STEEL,
              borderRadius: Math.round(2 * zone.scale),
              zIndex: 0,
            }}
          />

          {/* Milestones */}
          {milestones.map((milestone, idx) => {
            const nodeX = (zone.width - lineLength) / 2 + lineLength * milestone.x;

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: nodeX,
                  top: lineY,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(16 * zone.scale),
                    ...bouncePop(sceneFrame, milestone.delay, fps),
                  }}
                >
                  {/* Circle node */}
                  <div
                    style={{
                      width: circleSize,
                      height: circleSize,
                      borderRadius: "50%",
                      backgroundColor: OB1.BG_MID,
                      border: `${Math.round(3 * zone.scale)}px solid ${milestone.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    {milestone.type === "logo" ? (
                      <Img
                        src={staticFile("logos/anthropic.svg")}
                        style={{
                          width: logoSize,
                          height: logoSize,
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    ) : milestone.type === "shield" ? (
                      <Shield size={iconSize} color={OB1.CYAN} strokeWidth={2} />
                    ) : (
                      <Building size={iconSize} color={OB1.GREEN} strokeWidth={2} />
                    )}
                  </div>

                  {/* Year */}
                  <div
                    style={{
                      fontSize: labelSize,
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: milestone.color,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {milestone.year}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontSize: labelSize,
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {milestone.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for SS-015-SafetyMatrix
    // FOCAL: 2x2 matrix grid with 4 vendor logos positioned by quadrant
    // SUPPORTING (4):
    //   1. Anthropic logo (120px, top-right: high safety + high enterprise)
    //   2. OpenAI logo (120px, top-left: high safety + moderate enterprise)
    //   3. Google logo (120px, bottom-right: moderate safety + high enterprise)
    //   4. Meta logo (120px, bottom-left: moderate safety + moderate enterprise)
    // TEXT ON SCREEN:
    //   - "Safety-Focused" (48px, top axis label) — 14 chars
    //   - "Enterprise-Ready" (48px, right axis label) — 16 chars
    //   Total visible: 30 chars
    // PHASES:
    //   - 0-1s: Grid axes draw (cross lines)
    //   - 1-2s: Axis labels fade in
    //   - 2-6s: Logos appear staggered (0.8s gaps) with bouncePop
    //   - 6-7s: Hold
    // LOGOS: anthropic.svg, openai.svg, google.svg, meta.svg
    // ELEMENT COUNT: 4 logos in quadrants (at the max) ✓
    // PHONE TEST: All logos 120px, all text 48px ✓
    id: "SS-015-SafetyMatrix",
    title: "Market Positioning",
    subtitle: "AI vendors by safety & enterprise focus",
    bottomLabel: "Safety posture drives federal access",
    bottomAccent: "Safety posture",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const logoSize = Math.round(120 * zone.scale);
      const axisLabelSize = Math.round(48 * zone.scale);
      // Use smaller dimension to ensure grid fits within zone
      const gridSize = Math.min(zone.width, zone.height) * 0.7;
      const centerX = zone.width / 2;
      const centerY = zone.height / 2;

      // Axis drawing
      const axisProgress = ease(sceneFrame, 0, 30);
      const labelOpacity = ease(sceneFrame, 30, 60);

      // Vendor positions (relative to center, in grid percentage)
      const vendors = [
        {
          name: "anthropic",
          x: 0.4, // high enterprise (right)
          y: -0.38, // high safety (top)
          delay: 60,
        },
        {
          name: "openai",
          x: -0.38, // moderate enterprise (left)
          y: -0.35, // high safety (top)
          delay: 84,
        },
        {
          name: "google",
          x: 0.38, // high enterprise (right)
          y: 0.35, // moderate safety (bottom)
          delay: 108,
        },
        {
          name: "meta",
          x: -0.38, // moderate enterprise (left)
          y: 0.35, // moderate safety (bottom)
          delay: 132,
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
            position: "relative",
          }}
        >
          {/* Vertical axis (Safety) */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY - (gridSize / 2) * axisProgress,
              width: Math.round(2 * zone.scale),
              height: gridSize * axisProgress,
              backgroundColor: OB1.STEEL,
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          />

          {/* Horizontal axis (Enterprise) */}
          <div
            style={{
              position: "absolute",
              left: centerX - (gridSize / 2) * axisProgress,
              top: centerY,
              width: gridSize * axisProgress,
              height: Math.round(2 * zone.scale),
              backgroundColor: OB1.STEEL,
              transform: "translateY(-50%)",
              zIndex: 0,
            }}
          />

          {/* Top axis label: Safety-Focused */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY - gridSize / 2 - Math.round(80 * zone.scale),
              transform: "translateX(-50%)",
              opacity: labelOpacity,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: axisLabelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                position: "relative",
              }}
            >
              Safety-Focused
            </div>
          </div>

          {/* Right axis label: Enterprise-Ready */}
          <div
            style={{
              position: "absolute",
              left: centerX + gridSize / 2 + Math.round(15 * zone.scale),
              top: centerY,
              transform: "translateY(-50%)",
              opacity: labelOpacity,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: axisLabelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                position: "relative",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              Enterprise-Ready
            </div>
          </div>

          {/* Vendor logos */}
          {vendors.map((vendor, idx) => {
            const x = centerX + vendor.x * gridSize;
            const y = centerY + vendor.y * gridSize;

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    ...bouncePop(sceneFrame, vendor.delay, fps),
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile(`logos/${vendor.name}.svg`)}
                    style={{
                      width: logoSize,
                      height: logoSize,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              </div>
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

export const SS_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

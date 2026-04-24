import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  bouncePop,
  pulse,
} from "./shared";
import {
  FileText,
  Mail,
  Calendar,
  Brain,
  Zap,
  TrendingUp,
  ArrowRight,
  Briefcase,
  Utensils,
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
    // DESIGN SPEC for OP-040-WorkAreEvolving
    // FOCAL: Transformation diagram — left stack (traditional work icons) → arrow → right stack (AI-augmented icons)
    // SUPPORTING:
    //   - Left: FileText, Mail, Calendar icons (80px each, DIM) in vertical stack
    //   - Center: ArrowRight (80px, ORANGE) with pulse
    //   - Right: Brain, Zap, TrendingUp icons (80px each, CYAN/GREEN/PURPLE) in vertical stack
    // TEXT ON SCREEN:
    //   - "Before" (56px, above left stack) — 6 chars
    //   - "After" (56px, above right stack) — 5 chars
    //   Total: 11 chars ✓
    // PHASES:
    //   - 0-1.5s: Left stack fades in
    //   - 1.5-3s: Arrow fades in with pulse
    //   - 3-4.5s: Right stack fades in
    //   - 4.5-7s: Hold with subtle pulse on arrow
    // ELEMENT COUNT: 3 groups ✓
    // PHONE TEST: All text 56px, all icons 80px ✓
    id: "OP-040-WorkAreEvolving",
    title: "Knowledge Work",
    subtitle: "Evolution with AI",
    bottomLabel: "Work itself is evolving — serious tasks warrant serious AI",
    bottomAccent: "serious AI",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(80 * zone.scale);
      const gap = Math.round(24 * zone.scale);
      const labelSize = Math.round(56 * zone.scale);
      const arrowSize = Math.round(80 * zone.scale);

      const leftIcons = [
        { Icon: FileText, color: OB1.DIM },
        { Icon: Mail, color: OB1.DIM },
        { Icon: Calendar, color: OB1.DIM },
      ];

      const rightIcons = [
        { Icon: Brain, color: OB1.CYAN },
        { Icon: Zap, color: OB1.GREEN },
        { Icon: TrendingUp, color: OB1.PURPLE },
      ];

      const leftOpacity = ease(sceneFrame, 0, 45);
      const arrowOpacity = ease(sceneFrame, 45, 90);
      const rightOpacity = ease(sceneFrame, 90, 135);
      const arrowPulse = pulse(sceneFrame - 90, 0.04);

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
          {/* Left stack — Before */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap,
              opacity: leftOpacity,
            }}
          >
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                marginBottom: gap,
                zIndex: 10,
                position: "relative",
              }}
            >
              Before
            </div>
            {leftIcons.map((item, i) => (
              <item.Icon
                key={i}
                size={iconSize}
                color={item.color}
                strokeWidth={2}
              />
            ))}
          </div>

          {/* Arrow — Center */}
          <div
            style={{
              opacity: arrowOpacity,
              transform: `scale(${1 + arrowPulse * 0.15})`,
              zIndex: 1,
            }}
          >
            <ArrowRight
              size={arrowSize}
              color={OB1.ORANGE}
              strokeWidth={3}
            />
          </div>

          {/* Right stack — After */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap,
              opacity: rightOpacity,
            }}
          >
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                marginBottom: gap,
                zIndex: 10,
                position: "relative",
              }}
            >
              After
            </div>
            {rightIcons.map((item, i) => (
              <item.Icon
                key={i}
                size={iconSize}
                color={item.color}
                strokeWidth={2}
              />
            ))}
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for OP-041-DinnerTableIf
    // FOCAL: Split-frame token allocation comparison
    // SUPPORTING:
    //   - Left half: Briefcase (120px) + "Deep Work" (60px) + tall ORANGE bar (~300px)
    //   - Right half: Utensils (120px) + "Casual Chat" (60px) + short DIM bar (~100px)
    //   - Vertical divider line between halves
    // TEXT ON SCREEN:
    //   - "Deep Work" (60px) — 9 chars
    //   - "Casual Chat" (60px) — 11 chars
    //   - "High Tokens" (48px) — 11 chars
    //   - "Low Tokens" (48px) — 10 chars
    //   Total: 41 chars ✓
    // PHASES:
    //   - 0-1.5s: Divider line draws
    //   - 1.5-3s: Left side fades in
    //   - 3-4.5s: Right side fades in
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 2 sides ✓
    // PHONE TEST: All text 48-60px, icons 120px ✓
    id: "OP-041-DinnerTableIf",
    title: "Token Economy",
    subtitle: "Two-tier allocation",
    bottomLabel: "Professional deep work vs casual chat — allocate tokens accordingly",
    bottomAccent: "allocate tokens",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(120 * zone.scale);
      const titleSize = Math.round(60 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);
      const gap = Math.round(16 * zone.scale);

      const leftBarHeight = zone.height * 0.52;
      const rightBarHeight = zone.height * 0.17;
      const barWidth = zone.width * 0.15;

      const dividerOpacity = ease(sceneFrame, 0, 45);
      const leftOpacity = ease(sceneFrame, 45, 90);
      const rightOpacity = ease(sceneFrame, 90, 135);

      const leftBarGrow = ease(sceneFrame, 60, 105);
      const rightBarGrow = ease(sceneFrame, 105, 150);

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
          {/* Vertical divider */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.1,
              width: Math.round(3 * zone.scale),
              height: zone.height * 0.8,
              backgroundColor: OB1.STEEL,
              opacity: dividerOpacity * 0.3,
              zIndex: 0,
            }}
          />

          {/* Left side — Deep Work */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap,
              position: "absolute",
              left: zone.width * 0.25,
              transform: "translateX(-50%)",
              opacity: leftOpacity,
            }}
          >
            <Briefcase
              size={iconSize}
              color={OB1.ORANGE}
              strokeWidth={2}
            />
            <div
              style={{
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                marginTop: gap,
                zIndex: 10,
                position: "relative",
              }}
            >
              Deep Work
            </div>
            <div
              style={{
                width: barWidth,
                height: leftBarHeight * leftBarGrow,
                backgroundColor: OB1.ORANGE,
                borderRadius: Math.round(8 * zone.scale),
                marginTop: gap * 2,
                zIndex: 1,
              }}
            />
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.ORANGE,
                marginTop: gap,
                zIndex: 10,
                position: "relative",
              }}
            >
              High Tokens
            </div>
          </div>

          {/* Right side — Casual Chat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap,
              position: "absolute",
              left: zone.width * 0.75,
              transform: "translateX(-50%)",
              opacity: rightOpacity,
            }}
          >
            <Utensils
              size={iconSize}
              color={OB1.DIM}
              strokeWidth={2}
            />
            <div
              style={{
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                marginTop: gap,
                zIndex: 10,
                position: "relative",
              }}
            >
              Casual Chat
            </div>
            <div
              style={{
                width: barWidth,
                height: rightBarHeight * rightBarGrow,
                backgroundColor: OB1.DIM,
                borderRadius: Math.round(8 * zone.scale),
                marginTop: gap * 2,
                zIndex: 1,
              }}
            />
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                marginTop: gap,
                zIndex: 10,
                position: "relative",
              }}
            >
              Low Tokens
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

export const OP_CLIPS_N = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

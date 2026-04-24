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
  Briefcase,
  Building2,
  Brain,
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingDown,
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
    // DESIGN SPEC for BYOC-010-years-are-you-690000
    // FOCAL: Large "2 YEARS" centered with horizontal timeline bar spanning zone width
    // SUPPORTING (3):
    //   1. Left cluster: Briefcase + Building2 icons (job switching)
    //   2. Right cluster: Brain + Sparkles icons (AI tool switching)
    //   3. Progress fill on timeline
    // TEXT ON SCREEN:
    //   - "NEXT 2 YEARS" (72px) — 12 chars
    //   - "Switch Jobs" (48px) — 11 chars
    //   - "Switch AI Tools" (48px) — 15 chars
    //   Total visible: 38 chars ✓
    // PHASES:
    //   - 0-1s: Timeline bar draws
    //   - 1-2.5s: Counter animates
    //   - 2.5-4s: Left cluster fades in
    //   - 4-5.5s: Right cluster fades in
    // LOGOS: None (abstract)
    // ELEMENT COUNT: 3 (timeline + 2 clusters) ✓
    // PHONE TEST: All text ≥48px ✓
    id: "BYOC-010-years-are-you-690000",
    title: "Universal Timeline",
    subtitle: "The 2-year context reset",
    bottomLabel: "Most workers will switch jobs OR AI tools in the next 2 years",
    bottomAccent: "2 years",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const timelineWidth = zone.width * 0.8;
      const timelineProgress = ease(sceneFrame, 0, 30);
      const counterValue = countUp(sceneFrame, 30, 75, 2);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.height * 0.06),
          }}
        >
          {/* Headline */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 30),
              fontSize: Math.round(72 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              zIndex: 10,
              position: "relative",
            }}
          >
            NEXT {counterValue.toFixed(0)} YEARS
          </div>

          {/* Timeline container */}
          <div
            style={{
              width: timelineWidth,
              height: Math.round(12 * zone.scale),
              backgroundColor: OB1.DIM,
              borderRadius: Math.round(6 * zone.scale),
              position: "relative",
              zIndex: 0,
            }}
          >
            {/* Timeline progress fill */}
            <div
              style={{
                width: `${timelineProgress * 100}%`,
                height: "100%",
                backgroundColor: OB1.STEEL,
                borderRadius: Math.round(6 * zone.scale),
                position: "absolute",
                zIndex: 0,
              }}
            />
          </div>

          {/* Bottom clusters container */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: timelineWidth,
              marginTop: Math.round(zone.height * 0.08),
            }}
          >
            {/* Left cluster: Job switching */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 75),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: Math.round(12 * zone.scale),
                }}
              >
                <Briefcase
                  size={Math.round(64 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2}
                />
                <Building2
                  size={Math.round(64 * zone.scale)}
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
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Switch Jobs
              </div>
            </div>

            {/* Right cluster: AI tool switching */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: Math.round(12 * zone.scale),
                }}
              >
                <Brain
                  size={Math.round(64 * zone.scale)}
                  color={OB1.PURPLE}
                  strokeWidth={2}
                />
                <Sparkles
                  size={Math.round(64 * zone.scale)}
                  color={OB1.PURPLE}
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
                Switch AI Tools
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-011-as-individuals-Employers-755050
    // FOCAL: Two large circles (200px diameter) side-by-side with icons
    // SUPPORTING (2):
    //   1. Downward arrows from each circle
    //   2. Impact labels below arrows
    // TEXT ON SCREEN:
    //   - "EMPLOYER" (60px) — 8 chars
    //   - "WORKER" (60px) — 6 chars
    //   - "Institutional Knowledge" (48px) — 23 chars
    //   - "Personal Calibration" (48px) — 21 chars
    //   Total visible: 58 chars ✓
    // PHASES:
    //   - 0-1.5s: Both circles fade in
    //   - 1.5-3s: Left arrow + label
    //   - 3-4.5s: Right arrow + label
    // LOGOS: None
    // ELEMENT COUNT: 2 groups ✓
    // PHONE TEST: All text ≥48px ✓
    id: "BYOC-011-as-individuals-Employers-755050",
    title: "Dual Impact",
    subtitle: "Loss on both sides",
    bottomLabel: "Employers lose institutional knowledge, workers lose personal calibration",
    bottomAccent: "lose",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const circleDiameter = Math.round(200 * zone.scale);
      const iconSize = Math.round(80 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.width * 0.15),
          }}
        >
          {/* Left: Employer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Circle with icon */}
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
                width: circleDiameter,
                height: circleDiameter,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Building2
                size={iconSize}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>

            {/* Label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              EMPLOYER
            </div>

            {/* Arrow */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
              }}
            >
              <TrendingDown
                size={Math.round(64 * zone.scale)}
                color={OB1.RED}
                strokeWidth={3}
              />
            </div>

            {/* Impact label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.RED,
                textAlign: "center",
                maxWidth: Math.round(280 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Institutional Knowledge
            </div>
          </div>

          {/* Right: Worker */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Circle with icon */}
            <div
              style={{
                ...bouncePop(sceneFrame, 20, fps),
                width: circleDiameter,
                height: circleDiameter,
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.CYAN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <User
                size={iconSize}
                color={OB1.CYAN}
                strokeWidth={2}
              />
            </div>

            {/* Label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 30),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              WORKER
            </div>

            {/* Arrow */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
              }}
            >
              <TrendingDown
                size={Math.round(64 * zone.scale)}
                color={OB1.AMBER}
                strokeWidth={3}
              />
            </div>

            {/* Impact label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 105),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.AMBER,
                textAlign: "center",
                maxWidth: Math.round(280 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Personal Calibration
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-012-Claude-code-and-820140
    // FOCAL: Claude logo (140px) left with green checkmark, arrow right to Cursor logo (140px) with red X
    // SUPPORTING (2):
    //   1. Arrow between logos
    //   2. "MONTHS LOST" label center-bottom
    // TEXT ON SCREEN:
    //   - "Claude Code" (56px) — 11 chars
    //   - "New Tool" (56px) — 8 chars
    //   - "Months Lost" (48px) — 11 chars
    //   Total visible: 30 chars ✓
    // PHASES:
    //   - 0-1.5s: Claude + checkmark fade in
    //   - 1.5-2.5s: Arrow draws
    //   - 2.5-4s: Cursor + X fade in
    //   - 4-5.5s: "Months Lost" fades in
    // LOGOS: claude.svg, cursor.svg
    // ELEMENT COUNT: 2 groups (before + after) ✓
    // PHONE TEST: All text ≥48px ✓
    id: "BYOC-012-Claude-code-and-820140",
    title: "Tool Switching Penalty",
    subtitle: "Calibration reset",
    bottomLabel: "Switching AI tools means months of lost calibration",
    bottomAccent: "months",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const logoSize = Math.round(140 * zone.scale);
      const checkSize = Math.round(72 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.height * 0.08),
          }}
        >
          {/* Logo comparison row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(zone.width * 0.08),
            }}
          >
            {/* Left: Claude Code (current, calibrated) */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 0),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              {/* Logo container */}
              <div
                style={{
                  position: "relative",
                  width: logoSize,
                  height: logoSize,
                }}
              >
                <Img
                  src={staticFile("logos/claude.svg")}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    filter: "brightness(0) invert(1)",
                  }}
                />
                {/* Checkmark overlay */}
                <div
                  style={{
                    ...bouncePop(sceneFrame, 20, fps),
                    position: "absolute",
                    top: Math.round(-12 * zone.scale),
                    right: Math.round(-12 * zone.scale),
                    zIndex: 10,
                  }}
                >
                  <CheckCircle2
                    size={checkSize}
                    color={OB1.GREEN}
                    fill={OB1.BG_DARK}
                    strokeWidth={3}
                  />
                </div>
              </div>

              {/* Label */}
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
                Claude Code
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "right"),
              }}
            >
              <ArrowRight
                size={Math.round(80 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={3}
              />
            </div>

            {/* Right: New Tool (uncalibrated) */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 75),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              {/* Logo container */}
              <div
                style={{
                  position: "relative",
                  width: logoSize,
                  height: logoSize,
                }}
              >
                <Img
                  src={staticFile("logos/cursor.svg")}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    filter: "brightness(0) invert(1)",
                  }}
                />
                {/* X overlay */}
                <div
                  style={{
                    ...bouncePop(sceneFrame, 95, fps),
                    position: "absolute",
                    top: Math.round(-12 * zone.scale),
                    right: Math.round(-12 * zone.scale),
                    zIndex: 10,
                  }}
                >
                  <XCircle
                    size={checkSize}
                    color={OB1.RED}
                    fill={OB1.BG_DARK}
                    strokeWidth={3}
                  />
                </div>
              </div>

              {/* Label */}
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
                New Tool
              </div>
            </div>
          </div>

          {/* Bottom message */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 120),
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              textTransform: "uppercase",
              zIndex: 10,
              position: "relative",
            }}
          >
            Months Lost
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

export const BYOC_CLIPS_D = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

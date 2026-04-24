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
  FileText,
  Monitor,
  ArrowRight,
  TrendingDown,
  Gauge,
  AlertTriangle,
  CheckCircle2,
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
    // DESIGN SPEC for CD-013-FormatCompetition
    // FOCAL: Two competing format systems side-by-side
    //   LEFT: Claude logo (140px) + "Design Markdown" label (56px)
    //   RIGHT: Google logo (140px) + "Stitch Design Tokens" label (56px)
    //   CENTER: Orange "VS" text (80px)
    // SUPPORTING (1): Green checkmark badge (64px) above Claude side
    // TEXT ON SCREEN:
    //   - "Design Markdown" (56px) — 16 chars
    //   - "Stitch Design Tokens" (56px) — 20 chars
    //   - "VS" (80px) — 2 chars
    //   Total: 38 chars ✓
    // PHASES:
    //   - 0-1.5s: Claude side fades in
    //   - 1.5-3s: VS text appears
    //   - 3-4.5s: Google side fades in
    //   - 4.5-6s: Checkmark pops above Claude
    //   - 6-7s: Hold
    // LOGOS: claude.svg, google.svg
    // ELEMENT COUNT: 2 format groups + VS + checkmark (4 total) ✓
    // PHONE TEST: All text 56-80px, logos 140px ✓
    id: "CD-013-FormatCompetition",
    title: "Format Wars",
    subtitle: "Design specification approaches",
    bottomLabel: "Design Markdown vs Stitch Design Tokens: competing format standards",
    bottomAccent: "Design Markdown",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
            position: "relative",
          }}
        >
          {/* LEFT: Claude Design Markdown */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0, 25),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              position: "relative",
            }}
          >
            {/* Checkmark badge */}
            <div
              style={{
                ...bouncePop(sceneFrame, 90, fps),
                position: "absolute",
                top: Math.round(-40 * zone.scale),
                right: Math.round(-30 * zone.scale),
                zIndex: 10,
              }}
            >
              <CheckCircle2
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                fill={OB1.BG_DARK}
              />
            </div>

            <Img
              src={staticFile("logos/claude.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
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
              Design Markdown
            </div>
          </div>

          {/* CENTER: VS */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 30, 25),
              fontSize: Math.round(80 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              zIndex: 10,
              position: "relative",
            }}
          >
            VS
          </div>

          {/* RIGHT: Google Stitch Design Tokens */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 60, 25),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            <Img
              src={staticFile("logos/google.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                maxWidth: zone.width * 0.25,
                zIndex: 10,
                position: "relative",
              }}
            >
              Stitch Design Tokens
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-014-PMTransformation
    // FOCAL: Before/after transformation with arrow
    //   LEFT: Document icon (FileText, 120px) + "PRD Document" label (56px)
    //   CENTER: Right arrow (ArrowRight, 80px, ORANGE)
    //   RIGHT: Monitor icon (120px) + "Working Prototype" label (56px)
    // SUPPORTING (1): "PM Workflow Evolution" title above (60px, DIM)
    // TEXT ON SCREEN:
    //   - "PM Workflow Evolution" (60px) — 21 chars
    //   - "PRD Document" (56px) — 12 chars
    //   - "Working Prototype" (56px) — 17 chars
    //   Total: 50 chars ✓
    // PHASES:
    //   - 0-1s: Title fades in
    //   - 1-2.5s: Left document + label fade in
    //   - 2.5-4s: Arrow slides in
    //   - 4-5.5s: Right prototype + label fade in
    //   - 5.5-7s: Hold
    // ELEMENT COUNT: 3 main items + 1 title (4 total) ✓
    // PHONE TEST: All text 56-60px, icons 80-120px ✓
    id: "CD-014-PMTransformation",
    title: "PM Evolution",
    subtitle: "From documents to prototypes",
    bottomLabel: "PRD document evolves into working prototype as specification",
    bottomAccent: "working prototype",
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
          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0, 20),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.DIM,
              zIndex: 10,
              position: "relative",
            }}
          >
            PM Workflow Evolution
          </div>

          {/* Transformation flow */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: zone.width * 0.08,
            }}
          >
            {/* LEFT: PRD Document */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20, 25),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <FileText
                size={Math.round(120 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
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
                PRD Document
              </div>
            </div>

            {/* CENTER: Arrow */}
            <div
              style={{
                ...slideIn(sceneFrame, 50, 20, "left", 60),
              }}
            >
              <ArrowRight
                size={Math.round(80 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={3}
              />
            </div>

            {/* RIGHT: Working Prototype */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 80, 25),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <Monitor
                size={Math.round(120 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
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
                Working Prototype
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-015-TimeShift
    // FOCAL: Two horizontal bars showing time allocation shift
    //   TOP BAR: "Before" — 66% filled (AMBER), label "Mockups: 66%" (56px)
    //   BOTTOM BAR: "After" — 33% filled (GREEN), label "Mockups: 33%" (56px)
    // SUPPORTING (1): Downward trend arrow (TrendingDown, 80px, GREEN) on right
    // TEXT ON SCREEN:
    //   - "Designer Time: Mockups" (60px header) — 22 chars
    //   - "Mockups: 66%" (56px) — 12 chars
    //   - "Mockups: 33%" (56px) — 12 chars
    //   Total: 46 chars ✓
    // PHASES:
    //   - 0-1s: Header fades in
    //   - 1-2.5s: Top bar fills to 66%
    //   - 2.5-4s: Arrow appears
    //   - 4-5.5s: Bottom bar fills to 33%
    //   - 5.5-7s: Hold
    // ELEMENT COUNT: 2 bars + 1 arrow + 1 header (4 total) ✓
    // PHONE TEST: All text 56-60px, arrow 80px ✓
    id: "CD-015-TimeShift",
    title: "Time Reallocation",
    subtitle: "Designer hours shift",
    bottomLabel: "Mockup work drops from 66% to 33% of designer hours",
    bottomAccent: "66% to 33%",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const beforeFill = ease(sceneFrame, 20, 50) * 0.66;
      const afterFill = ease(sceneFrame, 80, 110) * 0.33;

      const barWidth = zone.width * 0.6;
      const barHeight = Math.round(80 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.height * 0.06,
          }}
        >
          {/* Header */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0, 20),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.04,
              zIndex: 10,
              position: "relative",
            }}
          >
            Designer Time: Mockups
          </div>

          {/* Before bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(12 * zone.scale),
              opacity: ease(sceneFrame, 10, 30),
            }}
          >
            <div
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(8 * zone.scale),
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: `${beforeFill * 100}%`,
                  height: "100%",
                  backgroundColor: OB1.AMBER,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                alignSelf: "flex-start",
                zIndex: 10,
                position: "relative",
              }}
            >
              Mockups: 66%
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              ...bouncePop(sceneFrame, 60, fps),
              zIndex: 10,
            }}
          >
            <TrendingDown
              size={Math.round(80 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
            />
          </div>

          {/* After bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(12 * zone.scale),
              opacity: ease(sceneFrame, 70, 90),
            }}
          >
            <div
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(8 * zone.scale),
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: `${afterFill * 100}%`,
                  height: "100%",
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                alignSelf: "flex-start",
                zIndex: 10,
                position: "relative",
              }}
            >
              Mockups: 33%
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-016-EngineerFocus
    // FOCAL: Two labeled focus area circles
    //   LEFT: Circle (180px) with Gauge icon (80px) + "Production Scale" label (56px)
    //   RIGHT: Circle (180px) with AlertTriangle icon (80px) + "Edge Cases" label (56px)
    // SUPPORTING (1): "Engineer Priorities" title above (60px, WHITE)
    // TEXT ON SCREEN:
    //   - "Engineer Priorities" (60px) — 19 chars
    //   - "Production Scale" (56px) — 16 chars
    //   - "Edge Cases" (56px) — 10 chars
    //   Total: 45 chars ✓
    // PHASES:
    //   - 0-1s: Title fades in
    //   - 1-2.5s: Left circle + icon + label pop in
    //   - 2.5-4s: Right circle + icon + label pop in
    //   - 4-7s: Subtle pulse on both circles
    // ELEMENT COUNT: 2 focus circles + 1 title (3 total) ✓
    // PHONE TEST: All text 56-60px, icons 80px, circles 180px ✓
    id: "CD-016-EngineerFocus",
    title: "Engineer Priorities",
    subtitle: "Key focus areas",
    bottomLabel: "Engineers focus on production scale and edge case handling",
    bottomAccent: "production scale",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const pulseVal = pulse(sceneFrame - 80, 0.04);

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
          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0, 20),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.WHITE,
              zIndex: 10,
              position: "relative",
            }}
          >
            Engineer Priorities
          </div>

          {/* Focus circles */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: zone.width * 0.12,
              alignItems: "center",
            }}
          >
            {/* LEFT: Production Scale */}
            <div
              style={{
                ...bouncePop(sceneFrame, 20, fps),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: Math.round(180 * zone.scale),
                  height: Math.round(180 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.9 + pulseVal * 0.1,
                  zIndex: 1,
                }}
              >
                <Gauge
                  size={Math.round(80 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2.5}
                />
              </div>
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
                Production Scale
              </div>
            </div>

            {/* RIGHT: Edge Cases */}
            <div
              style={{
                ...bouncePop(sceneFrame, 50, fps),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: Math.round(180 * zone.scale),
                  height: Math.round(180 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.AMBER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.9 + pulseVal * 0.1,
                  zIndex: 1,
                }}
              >
                <AlertTriangle
                  size={Math.round(80 * zone.scale)}
                  color={OB1.AMBER}
                  strokeWidth={2.5}
                />
              </div>
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
                Edge Cases
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

export const CD_CLIPS_E = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

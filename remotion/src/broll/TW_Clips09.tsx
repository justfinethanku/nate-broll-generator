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
  stagger,
  pulse,
} from "./shared";
import {
  Crown,
  FileText,
  X,
  Check,
  Brain,
  Database,
  ArrowDown,
  Zap,
  ArrowRight,
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
    // DESIGN SPEC for TW-025-FileOwn
    // FOCAL: Large document/file icon with crown above (ownership symbol)
    // SUPPORTING (3):
    //   1. Row of 3 SaaS logos (notion/linear/slack) with RED X — 96px each
    //   2. Single file icon with GREEN check — 120px
    //   3. Separator line between groups
    // TEXT ON SCREEN:
    //   - "OWN YOUR ARTIFACT" (72px) — 18 chars
    //   - "Not the tool" (48px) — 12 chars
    //   Total: 30 chars ✓
    // PHASES:
    //   0-1.5s: Central crowned file
    //   1.5-3s: SaaS logos + red X
    //   3-4.5s: Separator line
    //   4.5-6.5s: File + green check
    //   6.5-7s: Hold
    // LOGOS: notion.svg, linear.svg, slack.svg
    // ELEMENT COUNT: 4 (within limit) ✓
    // PHONE TEST: All text ≥48px, logos ≥96px ✓
    id: "TW-025-FileOwn",
    title: "File Ownership",
    subtitle: "The artifact principle",
    bottomLabel: "Own your files, not the SaaS subscription",
    bottomAccent: "Own your files",
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
          {/* Central crowned file icon */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            <Crown
              size={Math.round(64 * zone.scale)}
              color={OB1.AMBER}
              fill={OB1.AMBER}
              style={{ marginBottom: Math.round(12 * zone.scale) }}
            />
            <FileText
              size={Math.round(120 * zone.scale)}
              color={OB1.WHITE}
              strokeWidth={1.5}
            />
            <div
              style={{
                fontSize: Math.round(72 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                marginTop: zone.height * 0.04,
                zIndex: 10,
                position: "relative",
              }}
            >
              OWN YOUR ARTIFACT
            </div>
          </div>

          {/* SaaS logos + "Not the tool" section */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              marginTop: zone.height * 0.02,
              zIndex: 10,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: zone.width * 0.06,
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* SaaS logos */}
              {["notion", "linear", "slack"].map((logo, i) => (
                <div
                  key={logo}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 50, 8)),
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Img
                    src={staticFile(`logos/${logo}.svg`)}
                    style={{
                      width: Math.round(96 * zone.scale),
                      height: Math.round(96 * zone.scale),
                      opacity: 0.6,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                  {/* Red X overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      opacity: ease(sceneFrame, 70, 85),
                      zIndex: 10,
                    }}
                  >
                    <X
                      size={Math.round(80 * zone.scale)}
                      color={OB1.RED}
                      strokeWidth={4}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* "Not the tool" label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                opacity: ease(sceneFrame, 90, 105),
                zIndex: 10,
                position: "relative",
              }}
            >
              Not the tool
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-026-Timing
    // FOCAL: Two-column comparison showing WHEN synthesis happens
    // SUPPORTING (2):
    //   LEFT: Wiki + brain icon + arrow + "Synthesize Early"
    //   RIGHT: Database + database icon + arrow + "Synthesize on Query"
    // TEXT ON SCREEN:
    //   - "WIKI" (60px) — 4 chars
    //   - "Synthesize Early" (52px) — 16 chars
    //   - "DATABASE" (60px) — 8 chars
    //   - "Synthesize on Query" (52px) — 19 chars
    //   Total: 47 chars ✓
    // PHASES:
    //   0-2s: Left column fades in
    //   2-4s: Right column fades in
    //   4-7s: Hold with subtle pulse on arrows
    // LUCIDE: Brain, Database, ArrowDown
    // ELEMENT COUNT: 2 columns ✓
    // PHONE TEST: All text ≥52px, icons 80px ✓
    id: "TW-026-Timing",
    title: "Work Timing",
    subtitle: "When does synthesis happen?",
    bottomLabel: "Wiki synthesizes early, database synthesizes at query time",
    bottomAccent: "query time",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const pulseVal = pulse(sceneFrame, 0.03);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.12,
            position: "relative",
          }}
        >
          {/* LEFT: Wiki column */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              WIKI
            </div>

            <Brain
              size={Math.round(80 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
            />

            <ArrowDown
              size={Math.round(64 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2.5}
              style={{ opacity: 0.6 + pulseVal * 0.4 }}
            />

            <div
              style={{
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Synthesize Early
            </div>
          </div>

          {/* RIGHT: Database column */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 60),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.PURPLE,
                zIndex: 10,
                position: "relative",
              }}
            >
              DATABASE
            </div>

            <Database
              size={Math.round(80 * zone.scale)}
              color={OB1.PURPLE}
              strokeWidth={2}
            />

            <ArrowDown
              size={Math.round(64 * zone.scale)}
              color={OB1.PURPLE}
              strokeWidth={2.5}
              style={{ opacity: 0.6 + pulseVal * 0.4 }}
            />

            <div
              style={{
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Synthesize on Query
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-027-Hybrid
    // FOCAL: Central Zap icon (fusion/power) at 120px representing merged strengths
    // SUPPORTING (3):
    //   LEFT: Brain icon + "Wiki Strength" (CYAN)
    //   RIGHT: Database icon + "DB Strength" (PURPLE)
    //   Arrows converging to center
    // TEXT ON SCREEN:
    //   - "Wiki Strength" (48px) — 13 chars
    //   - "DB Strength" (48px) — 11 chars
    //   - "HYBRID" (80px) — 6 chars
    //   Total: 30 chars ✓
    // PHASES:
    //   0-2s: Center Zap bounces in
    //   2-3.5s: Left arrow + brain + label
    //   3.5-5s: Right arrow + database + label
    //   5-7s: "HYBRID" label + pulse
    // LUCIDE: Brain, Database, Zap, ArrowRight
    // ELEMENT COUNT: 3 supporting + 1 focal = 4 ✓
    // PHONE TEST: All text ≥48px, center icon 120px ✓
    id: "TW-027-Hybrid",
    title: "Hybrid Approach",
    subtitle: "Merging both strengths",
    bottomLabel: "Next OpenBrain extension combines wiki and database models",
    bottomAccent: "combines",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const pulseVal = pulse(sceneFrame, 0.025);

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
          {/* LEFT: Wiki Strength */}
          <div
            style={{
              ...slideIn(sceneFrame, 60, 30, "right", 50),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              position: "absolute",
              left: zone.width * 0.12,
              zIndex: 10,
            }}
          >
            <Brain
              size={Math.round(72 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Wiki Strength
            </div>
          </div>

          {/* LEFT arrow pointing to center */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.32,
              opacity: ease(sceneFrame, 75, 90),
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2.5}
            />
          </div>

          {/* CENTER: Zap (fusion) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 0, fps) }}>
              <Zap
                size={Math.round(120 * zone.scale)}
                color={OB1.ORANGE}
                fill={OB1.ORANGE}
                strokeWidth={2}
                style={{ opacity: 0.8 + pulseVal * 0.2 }}
              />
            </div>

            <div
              style={{
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                opacity: ease(sceneFrame, 150, 170),
                zIndex: 10,
                position: "relative",
              }}
            >
              HYBRID
            </div>
          </div>

          {/* RIGHT arrow pointing to center */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.32,
              opacity: ease(sceneFrame, 105, 120),
              zIndex: 0,
              transform: "rotate(180deg)",
            }}
          >
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.PURPLE}
              strokeWidth={2.5}
            />
          </div>

          {/* RIGHT: DB Strength */}
          <div
            style={{
              ...slideIn(sceneFrame, 105, 30, "left", 50),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              position: "absolute",
              right: zone.width * 0.12,
              zIndex: 10,
            }}
          >
            <Database
              size={Math.round(72 * zone.scale)}
              color={OB1.PURPLE}
              strokeWidth={2}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.PURPLE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              DB Strength
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

export const TW_CLIPS_09 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

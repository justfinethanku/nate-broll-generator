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
  stagger,
} from "./shared";
import { FileText, Award, ArrowRight } from "lucide-react";

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
    // DESIGN SPEC for NK-016-ProveYourWorth
    // FOCAL: Two-column layout — LEFT: "Static Credential" column (degree icon + resume icon),
    //        RIGHT: "Live Portfolio" column (GitHub + Notion logos)
    // SUPPORTING (1): A vertical divider line between columns
    // SUPPORTING (2): Column headers "CREDENTIAL" (left, red) and "PORTFOLIO" (right, green)
    // TEXT ON SCREEN (at any moment):
    //   - "CREDENTIAL" (60px) — 10 chars
    //   - "PORTFOLIO" (60px) — 9 chars
    //   - "Degree" (44px) — 6 chars
    //   - "Resume" (44px) — 6 chars
    //   - "GitHub" (44px) — 6 chars
    //   - "Notion" (44px) — 6 chars
    //   Total visible: 43 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.0s: Divider line draws in
    //   - 1.0-2.5s: Left column header + icons fade in (staggered)
    //   - 2.5-4.0s: Right column header + logos fade in (staggered)
    //   - 4.0-7.0s: Hold
    // LOGOS: github.svg, notion.svg; Lucide FileText for resume, Award for degree
    // ELEMENT COUNT: 2 columns = 2 groups (within 4 max) ✓
    // PHONE TEST: All labels 44px+, all logos 96px, headers 60px ✓
    id: "NK-016-ProveYourWorth",
    title: "Prove Your Worth",
    subtitle: "2026's new credentialing",
    bottomLabel: "Your portfolio is the new resume — and it has to be live",
    bottomAccent: "live",
    render: (frame, _fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Vertical divider line grows from center
      const dividerProgress = ease(sceneFrame, 5, 35);

      // LEFT column: credential items
      const leftHeaderOpacity = ease(sceneFrame, 40, 60);
      const degreeAnim = fadeInUp(sceneFrame, stagger(0, 55, 18));
      const resumeAnim = fadeInUp(sceneFrame, stagger(1, 55, 18));

      // RIGHT column: portfolio items
      const rightHeaderOpacity = ease(sceneFrame, 90, 110);
      const githubAnim = slideIn(sceneFrame, stagger(0, 105, 18), 20, "right");
      const notionAnim = slideIn(sceneFrame, stagger(1, 105, 18), 20, "right");

      const colWidth = zone.width * 0.42;
      const centerX = zone.width * 0.5;
      const dividerHeight = zone.height * 0.78;
      const logoSize = Math.round(96 * zone.scale);
      const labelSize = Math.round(44 * zone.scale);
      const headerSize = Math.round(60 * zone.scale);

      // Vertical space budget (per column):
      //   Header:   60px
      //   Gap:      28px
      //   Item 1 (icon 96 + label 44 + gap 8): 148px
      //   Gap:      24px
      //   Item 2 (icon 96 + label 44 + gap 8): 148px
      //   Total:   ~408px < 576px ✓

      const renderLeftItem = (
        icon: React.ReactNode,
        label: string,
        anim: { opacity: number; transform: string }
      ) => (
        <div
          style={{
            ...anim,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: Math.round(10 * zone.scale),
          }}
        >
          <div style={{ zIndex: 1 }}>{icon}</div>
          <div
            style={{
              fontSize: labelSize,
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.DIM,
              zIndex: 10,
              position: "relative",
            }}
          >
            {label}
          </div>
        </div>
      );

      const renderRightItem = (
        logoSlug: string,
        label: string,
        anim: { opacity: number; transform: string }
      ) => (
        <div
          style={{
            ...anim,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: Math.round(10 * zone.scale),
          }}
        >
          <div style={{ zIndex: 1 }}>
            <Img
              src={staticFile(`logos/${logoSlug}.svg`)}
              style={{
                width: logoSize,
                height: logoSize,
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>
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
            {label}
          </div>
        </div>
      );

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
          {/* Divider line — zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <line
              x1={centerX}
              y1={zone.height * 0.5 - (dividerHeight * dividerProgress) / 2}
              x2={centerX}
              y2={zone.height * 0.5 + (dividerHeight * dividerProgress) / 2}
              stroke={OB1.DIM}
              strokeWidth={Math.round(2 * zone.scale)}
              strokeOpacity={0.6}
            />
          </svg>

          {/* LEFT COLUMN — Static Credentials */}
          <div
            style={{
              width: colWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(28 * zone.scale),
            }}
          >
            {/* Header */}
            <div
              style={{
                opacity: leftHeaderOpacity,
                fontSize: headerSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                letterSpacing: "0.08em",
                zIndex: 10,
                position: "relative",
              }}
            >
              CREDENTIAL
            </div>

            {/* Degree */}
            {renderLeftItem(
              <Award
                size={logoSize}
                color={OB1.DIM}
                strokeWidth={1.5}
              />,
              "Degree",
              degreeAnim
            )}

            {/* Resume */}
            {renderLeftItem(
              <FileText
                size={logoSize}
                color={OB1.DIM}
                strokeWidth={1.5}
              />,
              "Resume",
              resumeAnim
            )}
          </div>

          {/* RIGHT COLUMN — Live Portfolio */}
          <div
            style={{
              width: colWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(28 * zone.scale),
            }}
          >
            {/* Header */}
            <div
              style={{
                opacity: rightHeaderOpacity,
                fontSize: headerSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                letterSpacing: "0.08em",
                zIndex: 10,
                position: "relative",
              }}
            >
              PORTFOLIO
            </div>

            {/* GitHub */}
            {renderRightItem("github", "GitHub", githubAnim)}

            {/* Notion */}
            {renderRightItem("notion", "Notion", notionAnim)}
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

export const NK_CLIPS_06 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

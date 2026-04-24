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
  bouncePop,
  stagger,
  pulse,
} from "./shared";
import { Eye, EyeOff, ArrowRight, FileQuestion } from "lucide-react";

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
    // DESIGN SPEC for NK-013-WorkInTheOpen
    // FOCAL: Two side-by-side columns — LEFT: "PRIVATE" (EyeOff icon, dim bg), RIGHT: "PUBLIC" (Eye icon, green accent)
    // SUPPORTING (1): A center vertical divider line
    // SUPPORTING (2): "Missed observations" tag under the left column fades in late
    // TEXT ON SCREEN:
    //   - "PRIVATE" (64px label) — 7 chars
    //   - "PUBLIC" (64px label) — 6 chars
    //   - "Missed observations" (48px, AMBER, under left col) — 19 chars
    //   Total visible at peak: 32 chars ✓ (well under 90)
    // PHASES:
    //   - 0-1s (0-30f): Left column fades in
    //   - 1s-2s (30-60f): Right column fades in
    //   - 1.5s-2.5s (45-75f): Divider draws down
    //   - 3s-4.5s (90-135f): "Missed observations" fades in under left col
    // LOGOS: none — abstract concept, use lucide Eye / EyeOff
    // ELEMENT COUNT: 2 columns + 1 divider + 1 tag = 4 ✓
    // PHONE TEST: Labels 64px, icon 64px inside 160px circle, tag 48px ✓
    // VERTICAL BUDGET:
    //   Icon circle: 160px
    //   Gap: ~24px
    //   Column label: 64px
    //   Gap: ~24px
    //   Tag: ~56px
    //   Total: ~328px < 576px ✓
    id: "NK-013-WorkInTheOpen",
    title: "Working in the Open",
    subtitle: "Principle 4",
    bottomLabel: "Hidden work means missed observations — show your work",
    bottomAccent: "show your work",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftFade = ease(sceneFrame, 0, 30);
      const rightFade = ease(sceneFrame, 30, 60);
      const dividerH = ease(sceneFrame, 45, 90) * (zone.height * 0.55);
      const tagFade = ease(sceneFrame, 90, 120);

      const colWidth = zone.width * 0.38;
      const circleSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const labelSize = Math.round(64 * zone.scale);
      const tagSize = Math.round(48 * zone.scale);

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
          <div
            style={{
              position: "absolute",
              width: Math.round(2 * zone.scale),
              height: dividerH,
              backgroundColor: OB1.DIM,
              top: zone.height * 0.225,
              left: zone.width / 2 - Math.round(1 * zone.scale),
              zIndex: 0,
            }}
          />

          {/* Two-column row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: zone.width * 0.08,
              width: zone.width,
            }}
          >
            {/* LEFT: Private column */}
            <div
              style={{
                opacity: leftFade,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                width: colWidth,
              }}
            >
              {/* Icon container — zIndex 1 */}
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.DIM}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <EyeOff size={iconSize} color={OB1.DIM} style={{ zIndex: 1 }} />
              </div>

              {/* Label — zIndex 10 */}
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.DIM,
                  letterSpacing: "0.06em",
                  zIndex: 10,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                PRIVATE
              </div>

              {/* Missed tag — zIndex 10 */}
              <div
                style={{
                  opacity: tagFade,
                  fontSize: tagSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.AMBER,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Missed observations
              </div>
            </div>

            {/* RIGHT: Public column */}
            <div
              style={{
                opacity: rightFade,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
                width: colWidth,
              }}
            >
              {/* Icon container — zIndex 1 */}
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Eye size={iconSize} color={OB1.GREEN} style={{ zIndex: 1 }} />
              </div>

              {/* Label — zIndex 10 */}
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  letterSpacing: "0.06em",
                  zIndex: 10,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                PUBLIC
              </div>

              {/* Spacer to match left col height — invisible */}
              <div style={{ height: tagSize * 1.5, opacity: 0 }} />
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for NK-014-VenmoForWork
    // FOCAL: Venmo logo (left) → ArrowRight → abstract "Work" node (right)
    // SUPPORTING (1): "Payments visible" label under Venmo
    // SUPPORTING (2): "Work visible" label under Work node (fades in second)
    // TEXT ON SCREEN:
    //   - "Payments visible" (48px, under Venmo) — 16 chars
    //   - "Work visible" (48px, under Work node) — 12 chars
    //   Total at peak: 28 chars ✓
    // PHASES:
    //   - 0-1.5s (0-45f): Venmo logo + "Payments visible" fades in
    //   - 1.5-2.5s (45-75f): Arrow slides in
    //   - 2.5-4s (75-120f): Work node + "Work visible" fades in
    // LOGOS: venmo.svg
    // ELEMENT COUNT: Venmo node + arrow + Work node = 3 ✓
    // PHONE TEST: Logo 120px, labels 48px ✓
    // VERTICAL BUDGET:
    //   Logo: 120px
    //   Gap: 20px
    //   Label: 56px
    //   Total column: ~196px < 576px ✓
    id: "NK-014-VenmoForWork",
    title: "Open Source Social",
    subtitle: "The Venmo model for professional work",
    bottomLabel: "Venmo made payments visible — work needs the same model",
    bottomAccent: "visible",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const venmoFade = ease(sceneFrame, 0, 30);
      const arrowFade = ease(sceneFrame, 45, 70);
      const workFade = ease(sceneFrame, 75, 110);

      const logoSize = Math.round(120 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);
      const nodeCircle = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const arrowSize = Math.round(48 * zone.scale);

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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: zone.width * 0.06,
            }}
          >
            {/* Venmo node */}
            <div
              style={{
                opacity: venmoFade,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: nodeCircle,
                  height: nodeCircle,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Img
                  src={staticFile("logos/venmo.svg")}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    filter: "brightness(0) invert(1)",
                    zIndex: 1,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Payments visible
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                opacity: arrowFade,
                zIndex: 10,
                position: "relative",
              }}
            >
              <ArrowRight size={arrowSize} color={OB1.ORANGE} />
            </div>

            {/* Work node */}
            <div
              style={{
                opacity: workFade,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: nodeCircle,
                  height: nodeCircle,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Eye size={iconSize} color={OB1.ORANGE} style={{ zIndex: 1 }} />
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Work visible
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for NK-015-GitHubNotEnough
    // FOCAL: A horizontal spectrum bar from left (CODE) to right (AI WORK PRODUCTS)
    // SUPPORTING (1): GitHub logo + "Code" label anchored at the left end
    // SUPPORTING (2): FileQuestion icon + "Prompts · Decisions" label anchored at the right end, with a "No home" tag
    // Supporting (3): The spectrum bar itself with a fading gradient
    // TEXT ON SCREEN:
    //   - "Code" (56px) — 4 chars
    //   - "AI Work Products" (56px) — 16 chars
    //   - "No home" (48px, RED) — 7 chars
    //   Total at peak: 27 chars ✓
    // PHASES:
    //   - 0-1s (0-30f): GitHub end fades + label
    //   - 1s-2s (30-60f): Spectrum bar grows from left
    //   - 2s-3.5s (60-105f): Right end (AI artifacts) fades in
    //   - 3.5s-5s (105-150f): "No home" tag fades in with pulse
    // LOGOS: github.svg
    // ELEMENT COUNT: GitHub node + spectrum bar + AI-work node + "No home" tag = 4 ✓
    // PHONE TEST: Logo 120px, labels 56px, tag 48px ✓
    // VERTICAL BUDGET:
    //   Nodes row: 160px (circles)
    //   Gap: 20px
    //   Labels: 64px
    //   Gap: 20px
    //   Bar: 16px
    //   Gap: 20px
    //   Tag: 56px
    //   Total: ~356px < 576px ✓
    id: "NK-015-GitHubNotEnough",
    title: "GitHub Is Not Enough",
    subtitle: "The artifact gap",
    bottomLabel: "Code has GitHub — AI work products have no home yet",
    bottomAccent: "no home",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftFade = ease(sceneFrame, 0, 30);
      const barW = ease(sceneFrame, 30, 75) * (zone.width * 0.72);
      const rightFade = ease(sceneFrame, 60, 100);
      const tagFade = ease(sceneFrame, 105, 135);
      const tagPulse = pulse(sceneFrame, 0.06);

      const logoSize = Math.round(120 * zone.scale);
      const circleSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const labelSize = Math.round(56 * zone.scale);
      const tagSize = Math.round(48 * zone.scale);
      const barHeight = Math.round(12 * zone.scale);

      const spectrumLeft = zone.width * 0.14;

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
          {/* Spectrum bar — zIndex 0 */}
          <div
            style={{
              position: "absolute",
              left: spectrumLeft,
              top: zone.height * 0.5 - barHeight / 2,
              width: barW,
              height: barHeight,
              background: `linear-gradient(to right, ${OB1.CYAN}, ${OB1.DIM}, ${OB1.RED})`,
              borderRadius: Math.round(6 * zone.scale),
              zIndex: 0,
            }}
          />

          {/* Row of two endpoint nodes */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: zone.width * 0.72,
              marginBottom: Math.round(20 * zone.scale),
            }}
          >
            {/* LEFT: GitHub end */}
            <div
              style={{
                opacity: leftFade,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
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
                  zIndex: 1,
                }}
              >
                <Img
                  src={staticFile("logos/github.svg")}
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
                  fontWeight: 700,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                Code
              </div>
            </div>

            {/* RIGHT: AI Work Products end */}
            <div
              style={{
                opacity: rightFade,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <FileQuestion size={iconSize} color={OB1.RED} style={{ zIndex: 1 }} />
              </div>
              <div
                style={{
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                AI Work Products
              </div>
            </div>
          </div>

          {/* "No home" tag — appears under right end */}
          <div
            style={{
              alignSelf: "flex-end",
              marginRight: zone.width * 0.14,
              opacity: tagFade * (0.7 + tagPulse * 0.3),
              fontSize: tagSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.AMBER,
              letterSpacing: "0.04em",
              zIndex: 10,
              position: "relative",
              marginTop: Math.round(12 * zone.scale),
            }}
          >
            No home
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

export const NK_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

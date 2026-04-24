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
  FileText,
  Presentation,
  Layers,
  Layout,
  Camera,
  Smartphone,
  BarChart3,
  PenTool,
  MessageSquare,
  Video,
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
    // DESIGN SPEC for CD-001-EightThingsYou
    // FOCAL: Central Claude logo at 140px
    // SUPPORTING (2 groups appearing in time phases):
    //   - "Decks & Docs" label with 4 mini icons (FileText, Presentation, Layers, Layout) in horizontal strip
    //   - "Design Assets" label with 4 mini icons (Camera, Smartphone, BarChart3, PenTool) in horizontal strip
    // TEXT ON SCREEN:
    //   - "Decks & Docs" (12 chars, 56px)
    //   - "Design Assets" (13 chars, 56px)
    //   Total visible: 25 chars ✓
    // PHASES:
    //   - 0-1.5s: Claude logo pops in center
    //   - 1.5-3.5s: Top group ("Decks & Docs") fades in above logo
    //   - 3.5-5.5s: Bottom group ("Design Assets") fades in below logo
    //   - 5.5-7s: Hold
    // LOGOS: claude.svg center
    // ELEMENT COUNT: 1 logo + 2 labeled groups = 3 total ✓
    // PHONE TEST: All text 56px, logo 140px, mini icons 48px ✓
    id: "CD-001-EightThingsYou",
    title: "Eight Use Cases",
    subtitle: "What Claude Design can build",
    bottomLabel: "From pitch decks to prototypes, Claude Design handles visual content",
    bottomAccent: "visual content",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const topIcons = [FileText, Presentation, Layers, Layout];
      const bottomIcons = [Camera, Smartphone, BarChart3, PenTool];

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
          {/* Top group: Decks & Docs */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45, 25),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(zone.height * 0.03),
            }}
          >
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Decks & Docs
            </div>
            <div
              style={{
                display: "flex",
                gap: Math.round(zone.width * 0.03),
              }}
            >
              {topIcons.map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 50, 8), 20),
                  }}
                >
                  <Icon
                    size={Math.round(48 * zone.scale)}
                    color={OB1.STEEL}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center: Claude logo */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile("logos/claude.svg")}
              style={{
                width: Math.round(140 * zone.scale),
                height: Math.round(140 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Bottom group: Design Assets */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 105, 25),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(zone.height * 0.03),
            }}
          >
            <div
              style={{
                display: "flex",
                gap: Math.round(zone.width * 0.03),
              }}
            >
              {bottomIcons.map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 110, 8), 20),
                  }}
                >
                  <Icon
                    size={Math.round(48 * zone.scale)}
                    color={OB1.STEEL}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Design Assets
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-002-DesignSystemAnd
    // FOCAL: Vertical split line dividing frame into left/right halves
    // SUPPORTING (2):
    //   - Left side: Dimmed presentation icon + "Static Deck" label
    //   - Right side: Glowing chatbot icon + "Live AI Demo" label
    // TEXT ON SCREEN:
    //   - "Static Deck" (11 chars, 60px)
    //   - "Live AI Demo" (12 chars, 60px)
    //   Total visible: 23 chars ✓
    // PHASES:
    //   - 0-1.5s: Split line draws down center
    //   - 1.5-3s: Left side (static) fades in
    //   - 3-5s: Right side (live demo) fades in with glow
    //   - 5-7s: Hold with pulse on right side
    // LOGOS/ICONS: Presentation (lucide), MessageSquare (lucide)
    // ELEMENT COUNT: 2 sides ✓
    // PHONE TEST: All text 60px, icons 80px ✓
    id: "CD-002-DesignSystemAnd",
    title: "Static vs Interactive",
    subtitle: "Two presentation modes",
    bottomLabel: "Move from static slides to live embedded AI experiences",
    bottomAccent: "live embedded AI",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const lineHeight = ease(sceneFrame, 0, 45) * zone.height;
      const pulseVal = pulse(sceneFrame, 0.04);

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
          {/* Center dividing line */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: 0,
              width: Math.round(4 * zone.scale),
              height: lineHeight,
              backgroundColor: OB1.DIM,
              zIndex: 0,
            }}
          />

          {/* Left side: Static Presentation */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.25,
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 45, 30),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(zone.height * 0.05),
              }}
            >
              <Presentation
                size={Math.round(80 * zone.scale)}
                color={OB1.DIM}
                strokeWidth={2}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: 0.5,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Static Deck
              </div>
            </div>
          </div>

          {/* Right side: Live AI Demo */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.75,
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 90, 30),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(zone.height * 0.05),
              }}
            >
              <MessageSquare
                size={Math.round(80 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2.5}
                style={{
                  filter: `drop-shadow(0 0 ${Math.round(12 * zone.scale * (0.7 + pulseVal * 0.3))}px ${OB1.ORANGE})`,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Live AI Demo
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CD-003-TheWholeVideo
    // FOCAL: 3-stage horizontal pipeline with connecting arrows
    // SUPPORTING (3 stages):
    //   - Stage 1: Claude logo + "Input" label (left)
    //   - Stage 2: React logo + "Code" label (center)
    //   - Stage 3: Video icon + "Video" label (right)
    // TEXT ON SCREEN:
    //   - "Input" (5 chars, 48px)
    //   - "Code" (4 chars, 48px)
    //   - "Video" (5 chars, 48px)
    //   Total visible: 14 chars ✓
    // PHASES:
    //   - 0-1s: Stage 1 (Claude) fades in left
    //   - 1-2s: Arrow 1 draws
    //   - 2-3s: Stage 2 (React) fades in center
    //   - 3-4s: Arrow 2 draws
    //   - 4-5s: Stage 3 (video icon) fades in right
    //   - 5-7s: Hold
    // LOGOS: claude.svg, react.svg, Video (lucide)
    // ELEMENT COUNT: 3 stages ✓
    // PHONE TEST: All text 48px, logos 120px ✓
    id: "CD-003-TheWholeVideo",
    title: "Export Pipeline",
    subtitle: "From design to video",
    bottomLabel: "Claude Design generates React code that renders to MP4",
    bottomAccent: "renders to MP4",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const stageWidth = zone.width * 0.2;
      const arrowWidth = zone.width * 0.12;
      const gap = zone.width * 0.02;

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
          {/* Stage 1: Claude Input */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0, 30),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(zone.height * 0.04),
            }}
          >
            <Img
              src={staticFile("logos/claude.svg")}
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Input
            </div>
          </div>

          {/* Arrow 1 */}
          <div
            style={{
              width: arrowWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: ease(sceneFrame, 30, 60),
            }}
          >
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2.5}
            />
          </div>

          {/* Stage 2: React Code */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 60, 30),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(zone.height * 0.04),
            }}
          >
            <Img
              src={staticFile("logos/react.svg")}
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
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
              Code
            </div>
          </div>

          {/* Arrow 2 */}
          <div
            style={{
              width: arrowWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: ease(sceneFrame, 90, 120),
            }}
          >
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2.5}
            />
          </div>

          {/* Stage 3: Video Output */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 120, 30),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(zone.height * 0.04),
            }}
          >
            <div
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                backgroundColor: OB1.GREEN,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Video
                size={Math.round(72 * zone.scale)}
                color={OB1.WHITE}
                strokeWidth={2.5}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Video
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

export const CD_CLIPS_A = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

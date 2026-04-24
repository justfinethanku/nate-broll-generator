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
  stagger,
} from "./shared";
import { User, CheckSquare, Layout, ArrowDown, ArrowUp } from "lucide-react";

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
    // DESIGN SPEC for AIA-022-HumanRole
    // FOCAL: Before/After transformation showing human role shift
    // SUPPORTING (2):
    //   1. LEFT side: User icon with small task icons flowing downward (execution/tactical mode)
    //   2. RIGHT side: User icon elevated with larger framework/blueprint icon above (strategic/design mode)
    // TEXT ON SCREEN:
    //   - "Task Executor" (56px, left) - 13 chars
    //   - "Framework Designer" (56px, right) - 18 chars
    //   Total visible: 31 chars (well under 90) ✓
    // PHASES:
    //   - 0-2s: Left side fades in (executor mode)
    //   - 2-3.5s: Separator line draws
    //   - 3.5-6s: Right side fades in (designer mode)
    //   - 6-7s: Hold
    // LUCIDE ICONS: User, CheckSquare (tasks), Layout (framework), ArrowDown, ArrowUp
    // ELEMENT COUNT: 2 sides (within 4 max) ✓
    // PHONE TEST: All text 56px, icons 96-120px ✓
    id: "AIA-022-HumanRole",
    title: "Human Role Evolution",
    subtitle: "From execution to design",
    bottomLabel:
      "Humans shift from running experiments to architecting learning frameworks",
    bottomAccent: "architecting",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const labelSize = Math.round(56 * zone.scale);
      const iconLarge = Math.round(120 * zone.scale);
      const iconMedium = Math.round(72 * zone.scale);
      const iconSmall = Math.round(48 * zone.scale);

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
          {/* LEFT SIDE: Task Executor */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              width: zone.width * 0.42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* User icon */}
            <div
              style={{
                ...bouncePop(sceneFrame, 10, fps),
                zIndex: 1,
              }}
            >
              <User size={iconLarge} color={OB1.STEEL} strokeWidth={2.5} />
            </div>

            {/* Downward arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 25, 40),
                zIndex: 0,
              }}
            >
              <ArrowDown size={iconMedium} color={OB1.DIM} strokeWidth={2.5} />
            </div>

            {/* Task icons (checklist items flowing down) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(12 * zone.scale),
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, stagger(i, 40, 8)),
                    zIndex: 1,
                  }}
                >
                  <CheckSquare
                    size={iconSmall}
                    color={OB1.DIM}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                opacity: ease(sceneFrame, 50, 65),
                zIndex: 10,
                position: "relative",
                marginTop: Math.round(16 * zone.scale),
              }}
            >
              Task Executor
            </div>
          </div>

          {/* CENTER: Separator line */}
          <div
            style={{
              width: Math.round(3 * zone.scale),
              height: ease(sceneFrame, 60, 105) * zone.height * 0.8,
              backgroundColor: OB1.STEEL,
              opacity: 0.5,
              zIndex: 0,
            }}
          />

          {/* RIGHT SIDE: Framework Designer */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 105),
              width: zone.width * 0.42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Framework/Blueprint icon above */}
            <div
              style={{
                ...bouncePop(sceneFrame, 110, fps),
                zIndex: 1,
              }}
            >
              <Layout
                size={Math.round(96 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2.5}
              />
            </div>

            {/* Upward arrow */}
            <div
              style={{
                opacity: ease(sceneFrame, 120, 135),
                zIndex: 0,
              }}
            >
              <ArrowUp
                size={iconMedium}
                color={OB1.ORANGE}
                strokeWidth={2.5}
              />
            </div>

            {/* User icon (elevated) */}
            <div
              style={{
                ...bouncePop(sceneFrame, 140, fps),
                zIndex: 1,
              }}
            >
              <User size={iconLarge} color={OB1.ORANGE} strokeWidth={2.5} />
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.ORANGE,
                opacity: ease(sceneFrame, 150, 165),
                zIndex: 10,
                position: "relative",
                marginTop: Math.round(16 * zone.scale),
              }}
            >
              Framework Designer
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

export const AIA_CLIPS_H = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

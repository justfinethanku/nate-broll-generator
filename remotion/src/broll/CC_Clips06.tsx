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
  Brain,
  MousePointer,
  LayoutDashboard,
  FileSpreadsheet,
  PresentationIcon,
  X,
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
    // DESIGN SPEC for CC-016-CopyingPasting
    // FOCAL: Center row of 3 legacy app icons (dashboard-style interfaces) at 140px each, with an AI cursor icon (Brain + MousePointer composite) hovering above center app
    // SUPPORTING (2):
    //   1. Below apps: 3 action labels showing what the AI can do: "Click", "Type", "Copy" (48px each)
    //   2. Top label: "NO API NEEDED" (60px, ORANGE)
    // TEXT ON SCREEN:
    //   - "NO API NEEDED" (60px) — 14 chars
    //   - "Click" "Type" "Copy" (48px each) — 15 chars total
    //   Total: 29 chars ✓
    // PHASES:
    //   - 0-1s: App icons fade in (30 frames)
    //   - 1-2.5s: AI cursor pops in above center (frame 30)
    //   - 2.5-4s: Action labels stagger in below (frames 75, 85, 95)
    //   - 4-7s: Cursor pulses, hold
    // LOGOS: Lucide icons for legacy software (LayoutDashboard, FileSpreadsheet, PresentationIcon)
    // ELEMENT COUNT: 1 focal group (3 apps + cursor) + 1 title + 1 action strip = 3 ✓
    // PHONE TEST: All text ≥48px, cursor+apps ≥140px ✓
    id: "CC-016-CopyingPasting",
    title: "UI Automation",
    subtitle: "Drive any software",
    bottomLabel: "AI can control software without APIs through visual interface interaction",
    bottomAccent: "without APIs",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const pulseVal = pulse(sceneFrame, 0.04);

      const appIcons = [
        { Icon: LayoutDashboard, label: "Click", color: OB1.CYAN },
        { Icon: FileSpreadsheet, label: "Type", color: OB1.ORANGE },
        { Icon: PresentationIcon, label: "Copy", color: OB1.PURPLE },
      ];

      const iconSize = Math.round(140 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);
      const titleSize = Math.round(60 * zone.scale);
      const gap = zone.width * 0.08;

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
          {/* Top label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 20),
              fontSize: titleSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              marginBottom: zone.height * 0.06,
              zIndex: 10,
              position: "relative",
            }}
          >
            NO API NEEDED
          </div>

          {/* App icons row */}
          <div
            style={{
              display: "flex",
              gap: gap,
              alignItems: "center",
              marginBottom: zone.height * 0.08,
              zIndex: 1,
              position: "relative",
            }}
          >
            {appIcons.map((app, i) => (
              <div
                key={i}
                style={{
                  ...fadeInUp(sceneFrame, stagger(i, 10, 8)),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: Math.round(12 * zone.scale),
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.DIM}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    position: "relative",
                  }}
                >
                  <app.Icon
                    size={Math.round(64 * zone.scale)}
                    color={OB1.WHITE}
                    strokeWidth={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI cursor hovering above center app */}
          <div
            style={{
              ...bouncePop(sceneFrame, 30, fps),
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.85 + pulseVal * 0.15,
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: "relative",
                width: Math.round(80 * zone.scale),
                height: Math.round(80 * zone.scale),
              }}
            >
              <Brain
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  filter: `drop-shadow(0 0 ${Math.round(8 * zone.scale)}px ${OB1.GREEN})`,
                }}
              />
              <MousePointer
                size={Math.round(36 * zone.scale)}
                color={OB1.WHITE}
                strokeWidth={2}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  filter: `drop-shadow(0 0 ${Math.round(4 * zone.scale)}px ${OB1.WHITE})`,
                }}
              />
            </div>
          </div>

          {/* Action labels below */}
          <div
            style={{
              display: "flex",
              gap: gap,
              alignItems: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            {appIcons.map((app, i) => (
              <div
                key={i}
                style={{
                  ...fadeInUp(sceneFrame, stagger(i, 75, 10)),
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: app.color,
                  width: iconSize,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                {app.label}
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for CC-017-DidNotHave
    // FOCAL: Split-screen vertical divider. Left side: crossed-out app icon (120px) with red X overlay. Right side: same app with green checkmark + AI agent icon
    // SUPPORTING (3):
    //   1. Left label: "BEFORE" (60px, RED)
    //   2. Right label: "AFTER" (60px, GREEN)
    //   3. Vertical separator line between halves
    // TEXT ON SCREEN:
    //   - "BEFORE" (60px) — 6 chars
    //   - "AFTER" (60px) — 5 chars
    //   - "API Required" (left, 48px) — 12 chars
    //   - "UI Access" (right, 48px) — 9 chars
    //   Total: 32 chars ✓
    // PHASES:
    //   - 0-1.5s: Divider line draws vertically (frames 0-45)
    //   - 1.5-3s: Left side (crossed-out app) fades in (frames 45-90)
    //   - 3-4.5s: Right side (accessible app) fades in (frames 90-135)
    //   - 4.5-7s: Hold
    // LOGOS: Use Slack as common business app
    // ELEMENT COUNT: 2 groups (left + right) + 1 divider = 3 ✓
    // PHONE TEST: All icons ≥120px, all text ≥48px ✓
    id: "CC-017-DidNotHave",
    title: "Universal Access",
    subtitle: "Before and after",
    bottomLabel: "Computer use enables automation of any software, even without API integration",
    bottomAccent: "any software",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(120 * zone.scale);
      const titleSize = Math.round(60 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);
      const dividerHeight = ease(sceneFrame, 0, 45) * zone.height * 0.7;

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
          {/* Vertical divider line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: Math.round(3 * zone.scale),
              height: dividerHeight,
              backgroundColor: OB1.STEEL,
              zIndex: 0,
            }}
          />

          {/* Left side: BEFORE (excluded, no API) */}
          <div
            style={{
              position: "absolute",
              left: "25%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: zone.height * 0.04,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              BEFORE
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 50),
                position: "relative",
                width: iconSize,
                height: iconSize,
              }}
            >
              <Img
                src={staticFile("logos/slack.svg")}
                style={{
                  width: iconSize,
                  height: iconSize,
                  opacity: 0.4,
                  filter: "grayscale(100%)",
                  zIndex: 1,
                }}
              />
              <X
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={4}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              />
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 60),
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              API Required
            </div>
          </div>

          {/* Right side: AFTER (accessible via UI) */}
          <div
            style={{
              position: "absolute",
              left: "75%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: zone.height * 0.04,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                fontSize: titleSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              AFTER
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 95),
                position: "relative",
                width: iconSize,
                height: iconSize,
              }}
            >
              <Img
                src={staticFile("logos/slack.svg")}
                style={{
                  width: iconSize,
                  height: iconSize,
                  zIndex: 1,
                }}
              />
              <CheckCircle2
                size={Math.round(48 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={3}
                style={{
                  position: "absolute",
                  bottom: Math.round(-8 * zone.scale),
                  right: Math.round(-8 * zone.scale),
                  backgroundColor: OB1.BG_DARK,
                  borderRadius: "50%",
                  zIndex: 10,
                }}
              />
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 105),
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              UI Access
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

export const CC_CLIPS_06 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

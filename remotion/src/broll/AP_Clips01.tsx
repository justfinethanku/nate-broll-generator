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
  Building2,
  Users,
  Zap,
  Mail,
  CheckCircle2,
  Settings,
  HelpCircle,
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
    // DESIGN SPEC for AP-001-WholeAmount
    // FOCAL: Large "$5B" metric at center (120px font size), with animated countup
    // SUPPORTING (3):
    //   - 3 small lucide icons radiating around center (Building2, Users, Zap) at 64px each
    //   - Each icon in a circle node (160px diameter)
    //   - Icons positioned at 120°, 240°, 360° in radial layout at radius zone.height * 0.35
    // TEXT ON SCREEN:
    //   - "$5.0B" (120px counter, green accent) — 5 chars
    //   Total visible: 5 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Center "$5B" counter fades in and counts up from 0 to 5.0
    //   - 1.5-4s: Three radiating icons pop in (staggered by 15 frames)
    //   - 4-7s: Subtle pulse on icons, hold
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 1 focal (counter) + 3 supporting (icon nodes) = 4 ✓
    // PHONE TEST: Counter 120px, icons 64px in 160px circles ✓

    id: "AP-001-WholeAmount",
    title: "Success Stories",
    subtitle: "Enterprise agent adoption",
    bottomLabel: "Agent-Powered at Scale",
    bottomAccent: "Scale",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const count = sceneFrame < 45 ? (sceneFrame / 45) * 5.0 : 5.0;

      const radius = zone.height * 0.35;
      const icons = [
        { Icon: Building2, angle: 120, delay: 45 },
        { Icon: Users, angle: 240, delay: 60 },
        { Icon: Zap, angle: 360, delay: 75 },
      ];

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
          {/* Central counter */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              fontSize: Math.round(120 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.GREEN,
              zIndex: 10,
              position: "relative",
            }}
          >
            ${count.toFixed(1)}B
          </div>

          {/* Radiating icon nodes */}
          {icons.map((item, i) => {
            const angleRad = (item.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            const popAnim = bouncePop(sceneFrame, item.delay, fps);
            const pulseVal = pulse(sceneFrame - item.delay - 30, 0.03);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    ...popAnim,
                    width: Math.round(160 * zone.scale),
                    height: Math.round(160 * zone.scale),
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: popAnim.opacity * (0.8 + pulseVal * 0.2),
                  }}
                >
                  <item.Icon
                    size={Math.round(64 * zone.scale)}
                    color={OB1.WHITE}
                    strokeWidth={2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-002-ExpensiveClaw
    // FOCAL: Balance/scales visualization — left side heavy (investment), right side light (email task)
    // SUPPORTING (2):
    //   - Left side: Stack of 2 cost items vertically (Mac Mini logo 120px + subscription badge with "$$$" 56px)
    //   - Right side: Single large email envelope icon (Lucide Mail, 96px) looking small/light
    // TEXT ON SCREEN:
    //   - "Investment" label (48px, left above icons) — 10 chars
    //   - "Task" label (48px, right above icon) — 4 chars
    //   - "$$$" inside subscription badge — 3 chars
    //   Total visible: 17 chars ✓
    // PHASES:
    //   - 0-1.5s: Balance beam center structure fades in
    //   - 1.5-3s: Left side (Mac + subscription) slides in from left, beam tips left
    //   - 3-5s: Right side (email icon) pops in, looking tiny
    //   - 5-7s: Hold with subtle tilt animation
    // LOGOS: apple.svg for Mac Mini
    // ELEMENT COUNT: 1 focal (balance beam) + 2 supporting (left stack, right icon) = 3 ✓
    // PHONE TEST: All logos/icons 96-120px, text 48-56px ✓

    id: "AP-002-ExpensiveClaw",
    title: "Email Triage",
    subtitle: "Is this the best use?",
    bottomLabel: "Cost vs. Value",
    bottomAccent: "Value",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const beamWidth = zone.width * 0.7;
      const beamHeight = Math.round(8 * zone.scale);
      const tiltAngle = sceneFrame > 90 ? -3 : 0;

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
          {/* Balance beam center post */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              width: Math.round(12 * zone.scale),
              height: zone.height * 0.3,
              backgroundColor: OB1.STEEL,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }}
          />

          {/* Balance beam horizontal bar */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              width: beamWidth,
              height: beamHeight,
              backgroundColor: OB1.STEEL,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${tiltAngle}deg)`,
              borderRadius: Math.round(4 * zone.scale),
              zIndex: 0,
            }}
          />

          {/* LEFT SIDE: Investment stack */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: "30%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "left"),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Investment
            </div>
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "left"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              {/* Mac Mini logo */}
              <Img
                src={staticFile("logos/apple.svg")}
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  zIndex: 1,
                }}
              />
              {/* Subscription badge */}
              <div
                style={{
                  padding: `${Math.round(12 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                  backgroundColor: OB1.AMBER,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: Math.round(56 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    color: OB1.BG_DARK,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  $$$
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Email task */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.15,
              top: "35%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            <div
              style={{
                ...bouncePop(sceneFrame, 90, fps),
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Task
            </div>
            <div
              style={{
                ...bouncePop(sceneFrame, 90, fps),
              }}
            >
              <Mail
                size={Math.round(96 * zone.scale)}
                color={OB1.DIM}
                strokeWidth={2}
              />
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-003-ProminentOpenclaw
    // FOCAL: Horizontal progress/timeline bar showing 3 phases, with phase 3 (bottleneck) largest and highlighted
    // SUPPORTING (3):
    //   - Phase 1: "Install" segment (20% width, green, CheckCircle2 icon 64px, label 48px) — DONE
    //   - Phase 2: "Configure" segment (30% width, cyan, Settings icon 64px, label 48px) — IN PROGRESS
    //   - Phase 3: "What to Delegate?" segment (50% width, amber, HelpCircle icon 96px, label 56px) — STUCK
    // TEXT ON SCREEN:
    //   - "Install" (48px) — 7 chars
    //   - "Configure" (48px) — 9 chars
    //   - "What to Delegate?" (56px) — 18 chars
    //   Total visible: 34 chars ✓
    // PHASES:
    //   - 0-1.5s: Timeline container/track fades in
    //   - 1.5-2.5s: Phase 1 (Install) fills in, icon + label appear
    //   - 2.5-3.5s: Phase 2 (Configure) fills in, icon + label appear
    //   - 3.5-5.5s: Phase 3 (What to Delegate?) fills in slowly, icon + label appear, pulse
    //   - 5.5-7s: Hold with phase 3 pulsing
    // LOGOS: None (abstract workflow)
    // ELEMENT COUNT: 1 focal (timeline bar) + 3 supporting (phase segments) = 4 ✓
    // PHONE TEST: All text 48-56px, icons 64-96px ✓

    id: "AP-003-ProminentOpenclaw",
    title: "The Real Bottleneck",
    subtitle: "Where people get stuck",
    bottomLabel: "Where Everyone Gets Stuck",
    bottomAccent: "Stuck",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const trackWidth = zone.width * 0.85;
      const trackHeight = Math.round(100 * zone.scale);
      const trackY = zone.height * 0.5;

      const phases = [
        {
          label: "Install",
          widthPct: 0.2,
          color: OB1.GREEN,
          Icon: CheckCircle2,
          iconSize: 64,
          labelSize: 48,
          fillStart: 45,
          fillDur: 30,
          labelDelay: 60,
        },
        {
          label: "Configure",
          widthPct: 0.3,
          color: OB1.CYAN,
          Icon: Settings,
          iconSize: 64,
          labelSize: 48,
          fillStart: 75,
          fillDur: 30,
          labelDelay: 90,
        },
        {
          label: "What to Delegate?",
          widthPct: 0.5,
          color: OB1.AMBER,
          Icon: HelpCircle,
          iconSize: 96,
          labelSize: 56,
          fillStart: 105,
          fillDur: 60,
          labelDelay: 135,
        },
      ];

      let accumulatedX = 0;

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
          {/* Timeline container/track background */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              position: "absolute",
              left: "50%",
              top: trackY,
              transform: "translate(-50%, -50%)",
              width: trackWidth,
              height: trackHeight,
              backgroundColor: OB1.BG_MID,
              borderRadius: Math.round(16 * zone.scale),
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}40`,
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            {/* Phase segments */}
            {phases.map((phase, i) => {
              const segmentWidth = trackWidth * phase.widthPct;
              const fillProgress = ease(sceneFrame, phase.fillStart, phase.fillStart + phase.fillDur);
              const xOffset = accumulatedX;
              accumulatedX += segmentWidth;

              const pulseVal = i === 2 ? pulse(sceneFrame - phase.labelDelay - 20, 0.04) : 0;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: xOffset,
                    top: 0,
                    width: segmentWidth * fillProgress,
                    height: trackHeight,
                    backgroundColor: phase.color,
                    opacity: 0.9 + pulseVal * 0.1,
                    zIndex: 1,
                  }}
                />
              );
            })}
          </div>

          {/* Phase labels and icons ABOVE the track */}
          {phases.map((phase, i) => {
            let xPos = 0;
            for (let j = 0; j < i; j++) {
              xPos += trackWidth * phases[j].widthPct;
            }
            xPos += (trackWidth * phase.widthPct) / 2; // center of segment

            const labelOpacity = ease(sceneFrame, phase.labelDelay, phase.labelDelay + 20);
            const pulseVal = i === 2 ? pulse(sceneFrame - phase.labelDelay - 20, 0.04) : 0;

            return (
              <div
                key={`label-${i}`}
                style={{
                  position: "absolute",
                  left: `calc(50% - ${trackWidth / 2}px + ${xPos}px)`,
                  top: trackY - trackHeight * 0.5 - Math.round(80 * zone.scale),
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(12 * zone.scale),
                  opacity: labelOpacity,
                  zIndex: 10,
                }}
              >
                <phase.Icon
                  size={Math.round(phase.iconSize * zone.scale)}
                  color={phase.color}
                  strokeWidth={2.5}
                  style={{
                    filter: i === 2 ? `drop-shadow(0 0 ${Math.round(8 * pulseVal * zone.scale)}px ${phase.color})` : "none",
                  }}
                />
                <div
                  style={{
                    fontSize: Math.round(phase.labelSize * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {phase.label}
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

export const AP_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  pulse,
  stagger,
} from "./shared";
import {
  Terminal,
  Target,
  Shield,
  CheckCircle2,
  FileText,
  HelpCircle,
  Smartphone,
  Laptop,
  Tablet,
  MessageSquare,
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
    // DESIGN SPEC for AP-007-OperatingSystem
    // FOCAL: Side-by-side comparison of two paradigms
    // LEFT PANEL: "Traditional OS" with terminal/command icon (Lucide Terminal, 80px) + "Instructions →" (48px)
    // RIGHT PANEL: "AI OS" with target/brain icon (Lucide Target, 80px) + "Objectives →" (48px)
    // SUPPORTING:
    //   1. Vertical divider line between panels
    //   2. Panel headers "Traditional OS" (left) and "AI OS" (right) at 60px
    // TEXT ON SCREEN:
    //   - "Traditional OS" (60px) — 13 chars
    //   - "AI OS" (60px) — 5 chars
    //   - "Instructions →" (48px) — 15 chars
    //   - "Objectives →" (48px) — 13 chars
    //   Total visible: 46 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: Left panel (Traditional OS) fades in
    //   - 1.5-3s: Divider line draws
    //   - 3-4.5s: Right panel (AI OS) fades in
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 2 panels (within 4 max) ✓
    // PHONE TEST: All text 48-60px, icons 80px ✓
    id: "AP-007-OperatingSystem",
    title: "Operating System",
    subtitle: "Paradigm shift",
    bottomLabel: "Instructions vs. Objectives",
    bottomAccent: "Objectives",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Panel layout: left half = Traditional, right half = AI
      const panelWidth = zone.width * 0.42;
      const panelGap = zone.width * 0.16;

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
          {/* LEFT PANEL: Traditional OS */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              width: panelWidth,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.STEEL,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Traditional OS
            </div>
            <Terminal
              size={Math.round(80 * zone.scale)}
              color={OB1.STEEL}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Instructions →
            </div>
          </div>

          {/* CENTER DIVIDER */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.15,
              width: Math.round(3 * zone.scale),
              height:
                zone.height * 0.7 * ease(sceneFrame, 45, 75),
              background: OB1.DIM,
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          />

          {/* RIGHT PANEL: AI OS */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 90),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              width: panelWidth,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              AI OS
            </div>
            <Target
              size={Math.round(80 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Objectives →
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AP-008-IKnowBecause
    // FOCAL: Gap/chasm visualization showing solved vs unsolved problem
    // LEFT: "Security Wrapper" with shield icon (Lucide Shield, 96px) + checkmark (CheckCircle2, 64px, green)
    // CENTER: Visible gap/chasm (dotted line bridge, broken in middle)
    // RIGHT: "Operating Instructions" with document icon (Lucide FileText, 96px) + question mark (HelpCircle, 64px, amber)
    // SUPPORTING:
    //   1. "SOLVED" label (48px, green) under left side
    //   2. "UNSOLVED" label (48px, amber) under right side
    // TEXT ON SCREEN:
    //   - "Security Wrapper" (48px) — 16 chars
    //   - "SOLVED" (48px) — 6 chars
    //   - "Operating Instructions" (48px) — 22 chars
    //   - "UNSOLVED" (48px) — 8 chars
    //   Total visible: 52 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Left side (Security + checkmark) fades in
    //   - 1.5-3s: Gap/bridge appears
    //   - 3-4.5s: Right side (Instructions + question) fades in
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 2 solutions + 1 gap = 3 (within 4 max) ✓
    // PHONE TEST: All text 48px, icons 64-96px ✓
    id: "AP-008-IKnowBecause",
    title: "Enterprise Gap",
    subtitle: "The missing piece",
    bottomLabel: "The Enterprise Gap",
    bottomAccent: "Gap",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Three zones: left (solved), center (gap), right (unsolved)
      const sideWidth = zone.width * 0.32;
      const gapWidth = zone.width * 0.24;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* LEFT: Security Wrapper - SOLVED */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              width: sideWidth,
            }}
          >
            <div style={{ position: "relative" }}>
              <Shield
                size={Math.round(96 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <CheckCircle2
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                fill={OB1.GREEN}
                strokeWidth={0}
                style={{
                  position: "absolute",
                  bottom: Math.round(-12 * zone.scale),
                  right: Math.round(-12 * zone.scale),
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Security Wrapper
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              SOLVED
            </div>
          </div>

          {/* CENTER: Gap/Chasm - broken bridge */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.4,
              width: gapWidth,
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          >
            {/* Left half of bridge */}
            <svg
              width={Math.round(gapWidth * 0.4)}
              height={Math.round(20 * zone.scale)}
              style={{
                position: "absolute",
                left: 0,
                opacity: ease(sceneFrame, 45, 65),
              }}
            >
              <line
                x1="0"
                y1={Math.round(10 * zone.scale)}
                x2={Math.round(gapWidth * 0.4)}
                y2={Math.round(10 * zone.scale)}
                stroke={OB1.DIM}
                strokeWidth={Math.round(3 * zone.scale)}
                strokeDasharray="8,6"
              />
            </svg>
            {/* Right half of bridge */}
            <svg
              width={Math.round(gapWidth * 0.4)}
              height={Math.round(20 * zone.scale)}
              style={{
                position: "absolute",
                right: 0,
                opacity: ease(sceneFrame, 45, 65),
              }}
            >
              <line
                x1="0"
                y1={Math.round(10 * zone.scale)}
                x2={Math.round(gapWidth * 0.4)}
                y2={Math.round(10 * zone.scale)}
                stroke={OB1.DIM}
                strokeWidth={Math.round(3 * zone.scale)}
                strokeDasharray="8,6"
              />
            </svg>
          </div>

          {/* RIGHT: Operating Instructions - UNSOLVED */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 90),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              width: sideWidth,
            }}
          >
            <div style={{ position: "relative" }}>
              <FileText
                size={Math.round(96 * zone.scale)}
                color={OB1.AMBER}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <HelpCircle
                size={Math.round(64 * zone.scale)}
                color={OB1.AMBER}
                fill={OB1.AMBER}
                strokeWidth={0}
                style={{
                  position: "absolute",
                  bottom: Math.round(-12 * zone.scale),
                  right: Math.round(-12 * zone.scale),
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Operating Instructions
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.AMBER,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              UNSOLVED
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AP-009-BenefitsPeople
    // FOCAL: Hub-and-spoke with OpenClaw logo at center
    // CENTER: OpenClaw logo (openclaw.svg, 140px)
    // SPOKES: 4 device icons radiating out at 0°, 90°, 180°, 270°
    //   - Smartphone (top, 0°) — Lucide Smartphone, 80px
    //   - Laptop (right, 90°) — Lucide Laptop, 80px
    //   - Tablet (bottom, 180°) — Lucide Tablet, 80px
    //   - MessageSquare (left, 270°) — Lucide MessageSquare, 80px
    // SUPPORTING: Connecting lines from center to each icon (stroke 3px, cyan, zIndex 0)
    // TEXT ON SCREEN:
    //   - "OpenClaw" label below center logo (56px) — 8 chars
    //   Total visible: 8 chars (well under 90) ✓
    // PHASES:
    //   - 0-1s: Center logo pops in
    //   - 1-2s: Lines draw out from center
    //   - 2-4s: Icons appear staggered (0.5s gap each)
    //   - 4-7s: Hold, subtle pulse on center logo
    // ELEMENT COUNT: 1 center hub + 4 devices = 5 visual groups BUT only 1 labeled element (OpenClaw) ✓
    // PHONE TEST: Logo 140px, icons 80px, label 56px ✓
    // LOGOS: claude.svg
    id: "AP-009-BenefitsPeople",
    title: "Anywhere Access",
    subtitle: "Multi-channel control",
    bottomLabel: "Access From Anywhere",
    bottomAccent: "Anywhere",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Center hub and radial layout
      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const radius = Math.min(zone.width, zone.height) * 0.32;

      // Icon positions at 0°, 90°, 180°, 270° (top, right, bottom, left)
      const icons = {
        top: Smartphone,
        right: Laptop,
        bottom: Tablet,
        left: MessageSquare,
      };
      const angles = {
        top: -90,
        right: 0,
        bottom: 90,
        left: 180,
      };
      const positions = Object.keys(angles).map((key) => {
        const angle = (angles[key as keyof typeof angles] * Math.PI) / 180;
        return {
          key,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          Icon: icons[key as keyof typeof icons],
        };
      });

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
          {/* Connecting lines from center to each icon */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          >
            {positions.map((pos, i) => {
              const lineProgress = ease(sceneFrame, 30, 60);
              const targetX = centerX + (pos.x - centerX) * lineProgress;
              const targetY = centerY + (pos.y - centerY) * lineProgress;
              return (
                <line
                  key={pos.key}
                  x1={centerX}
                  y1={centerY}
                  x2={targetX}
                  y2={targetY}
                  stroke={OB1.CYAN}
                  strokeWidth={Math.round(3 * zone.scale)}
                  opacity={0.4}
                />
              );
            })}
          </svg>

          {/* Center hub: OpenClaw logo */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              zIndex: 1,
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <Img
                src={staticFile("logos/claude.svg")}
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  filter: "brightness(0) invert(1)",
                  opacity:
                    0.8 + pulse(sceneFrame - 120, 0.03) * 0.2,
                }}
              />
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              OpenClaw
            </div>
          </div>

          {/* Radial device icons */}
          {positions.map((pos, i) => {
            const Icon = pos.Icon;
            return (
              <div
                key={pos.key}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div style={{ ...fadeInUp(sceneFrame, stagger(i, 60, 15)) }}>
                  <Icon
                    size={Math.round(80 * zone.scale)}
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

export const AP_CLIPS_03 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

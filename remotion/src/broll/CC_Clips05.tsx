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
  pulse,
} from "./shared";
import {
  Cloud,
  Smartphone,
  Brain,
  Shield,
  ArrowLeftRight,
  Workflow,
  Film,
  Pill,
  X,
  ArrowRight,
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
    // DESIGN SPEC for CC-013-PrivacyTradeoff
    // FOCAL: Split-screen comparison with server cloud icon (left) vs device icon (right)
    // SUPPORTING (3):
    //   - "Learning" label with brain icon above server side
    //   - "Privacy" label with shield icon above device side
    //   - Bidirectional arrow between them showing tension
    // TEXT ON SCREEN:
    //   - "Server-side Learning" (60px) — 21 chars
    //   - "Local Privacy" (60px) — 14 chars
    //   Total visible: 35 chars ✓
    // PHASES:
    //   - 0-1.5s: Server side fades in (cloud + brain + label)
    //   - 1.5-3s: Device side fades in (device + shield + label)
    //   - 3-4.5s: Tension arrow draws between them
    //   - 4.5-7s: Hold with subtle pulse on arrow
    // LOGOS: None (abstract concept)
    // ICONS: Cloud, Smartphone, Brain, Shield, ArrowLeftRight (lucide)
    // ELEMENT COUNT: 2 sides (each is one compound element) + 1 connector = 3 ✓
    // PHONE TEST: All text 60px ✓
    id: "CC-013-PrivacyTradeoff",
    title: "Privacy Trade-off",
    subtitle: "Server vs. local processing",
    bottomLabel: "Agent learning requires data — where does that computation happen?",
    bottomAccent: "where",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Server side (left)
      const serverOpacity = ease(sceneFrame, 0, 45);
      // Device side (right)
      const deviceOpacity = ease(sceneFrame, 45, 90);
      // Arrow
      const arrowOpacity = ease(sceneFrame, 90, 135);
      const arrowPulse = pulse(sceneFrame - 135, 0.03);

      const iconSize = Math.round(96 * zone.scale);
      const labelSize = Math.round(60 * zone.scale);
      const subIconSize = Math.round(64 * zone.scale);

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
          {/* Server side (left) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: serverOpacity,
            }}
          >
            {/* Brain icon */}
            <Brain
              size={subIconSize}
              color={OB1.CYAN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            {/* Cloud icon */}
            <Cloud
              size={iconSize}
              color={OB1.STEEL}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Server-side
              <br />
              Learning
            </div>
          </div>

          {/* Device side (right) */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: deviceOpacity,
            }}
          >
            {/* Shield icon */}
            <Shield
              size={subIconSize}
              color={OB1.GREEN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            {/* Smartphone icon */}
            <Smartphone
              size={iconSize}
              color={OB1.STEEL}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Local
              <br />
              Privacy
            </div>
          </div>

          {/* Tension arrow (center) */}
          <div
            style={{
              opacity: arrowOpacity * (0.6 + arrowPulse * 0.4),
            }}
          >
            <ArrowLeftRight
              size={Math.round(80 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-014-MCPAdoption
    // FOCAL: Large MCP icon center with radiating adoption wave rings
    // SUPPORTING (2):
    //   - "Agent-Native Reach" label below with expanding progress bar
    //   - Small Anthropic logo bottom corner (attribution)
    // TEXT ON SCREEN:
    //   - "MCP Adoption" (72px) — 13 chars
    //   - "Agent Interface Reach" (56px) — 21 chars
    //   Total visible: 34 chars ✓
    // PHASES:
    //   - 0-1.5s: Center MCP icon pops in
    //   - 1.5-3.5s: Radiating rings expand outward (3 waves)
    //   - 3.5-5s: Bottom label + progress bar fade in, bar fills
    //   - 5-7s: Hold with subtle pulse
    // LOGOS: anthropic.svg (small, 80px attribution)
    // ICONS: Workflow (for MCP concept)
    // ELEMENT COUNT: 1 center + 2 supporting = 3 ✓
    // PHONE TEST: All text 56px+ ✓
    id: "CC-014-MCPAdoption",
    title: "MCP Adoption",
    subtitle: "Conway's bet",
    bottomLabel: "If agent tools standardize on MCP, agent-native interfaces win",
    bottomAccent: "agent-native",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerIconSize = Math.round(120 * zone.scale);
      const titleSize = Math.round(72 * zone.scale);
      const labelSize = Math.round(56 * zone.scale);
      const logoSize = Math.round(80 * zone.scale);

      // Progress bar fill
      const barFillProgress = ease(sceneFrame, 105, 150);

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
          {/* Radiating rings (decorative) */}
          {[1, 2, 3].map((ring) => {
            const delay = 45 + ring * 20;
            const ringOpacity =
              ease(sceneFrame, delay, delay + 30) *
              (0.4 - ring * 0.1) *
              (0.5 + pulse(sceneFrame - delay, 0.03) * 0.5);
            const ringScale = 0.4 + ring * 0.25;

            return (
              <div
                key={ring}
                style={{
                  position: "absolute",
                  width: Math.min(zone.width, zone.height) * ringScale,
                  height: Math.min(zone.width, zone.height) * ringScale,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.PURPLE}`,
                  opacity: ringOpacity,
                  zIndex: 0,
                }}
              />
            );
          })}

          {/* Center MCP icon */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              marginBottom: zone.height * 0.08,
              zIndex: 1,
            }}
          >
            <Workflow
              size={centerIconSize}
              color={OB1.PURPLE}
              strokeWidth={2}
            />
          </div>

          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 30),
              fontSize: titleSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.12,
              zIndex: 10,
              position: "relative",
            }}
          >
            MCP Adoption
          </div>

          {/* Bottom label + progress bar */}
          <div
            style={{
              opacity: ease(sceneFrame, 105, 135),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
              }}
            >
              Agent Interface Reach
            </div>
            {/* Progress bar container */}
            <div
              style={{
                width: zone.width * 0.4,
                height: Math.round(12 * zone.scale),
                backgroundColor: OB1.DIM,
                borderRadius: Math.round(6 * zone.scale),
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              {/* Progress bar fill */}
              <div
                style={{
                  width: `${barFillProgress * 100}%`,
                  height: "100%",
                  backgroundColor: OB1.PURPLE,
                  borderRadius: Math.round(6 * zone.scale),
                  zIndex: 1,
                }}
              />
            </div>
          </div>

          {/* Anthropic logo attribution (bottom right) */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.05,
              right: zone.width * 0.05,
              opacity: ease(sceneFrame, 150, 180),
            }}
          >
            <Img
              src={staticFile("logos/anthropic.svg")}
              style={{
                width: logoSize,
                height: logoSize,
                filter: "brightness(0) invert(1) opacity(0.6)",
              }}
            />
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for CC-015-StrategicCuts
    // FOCAL: Two large X marks over cut project icons (film + molecule)
    // SUPPORTING (1): Green arrow pointing to "Agentic Platform" label with checkmark
    // TEXT ON SCREEN:
    //   - "SORA" (60px) — 4 chars
    //   - "Drug Discovery" (56px) — 14 chars
    //   - "Focus: Agentic Platform" (60px) — 23 chars
    //   Total visible: 41 chars ✓
    // PHASES:
    //   - 0-1.5s: First X + SORA icon fade in (left)
    //   - 1.5-3s: Second X + molecule icon fade in (right)
    //   - 3-4.5s: Arrow draws toward right side
    //   - 4.5-6.5s: "Agentic Platform" label + checkmark fade in
    //   - 6.5-7s: Hold
    // LOGOS: openai.svg (small, 64px, near SORA label for context)
    // ICONS: Film, Pill, X, ArrowRight, CheckCircle2
    // ELEMENT COUNT: 2 cuts + 1 focus target = 3 ✓
    // PHONE TEST: All text 56px+ ✓
    id: "CC-015-StrategicCuts",
    title: "Strategic Discipline",
    subtitle: "Focus on agentic platform",
    bottomLabel: "SORA and drug discovery cut to double down on agents",
    bottomAccent: "agents",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const iconSize = Math.round(96 * zone.scale);
      const xSize = Math.round(120 * zone.scale);
      const checkSize = Math.round(80 * zone.scale);
      const labelSize = Math.round(60 * zone.scale);
      const subLabelSize = Math.round(56 * zone.scale);
      const logoSize = Math.round(64 * zone.scale);

      // Cut 1 (SORA)
      const cut1Opacity = ease(sceneFrame, 0, 45);
      // Cut 2 (Drug discovery)
      const cut2Opacity = ease(sceneFrame, 45, 90);
      // Arrow
      const arrowOpacity = ease(sceneFrame, 90, 135);
      const arrowScale = ease(sceneFrame, 90, 135);
      // Focus target
      const focusOpacity = ease(sceneFrame, 135, 180);

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
          {/* Cut 1: SORA (left) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.12,
              top: zone.height * 0.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              opacity: cut1Opacity,
            }}
          >
            {/* Film icon with X overlay */}
            <div style={{ position: "relative" }}>
              <Film
                size={iconSize}
                color={OB1.DIM}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <X
                size={xSize}
                color={OB1.RED}
                strokeWidth={4}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            {/* SORA label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              SORA
            </div>
            {/* OpenAI logo context */}
            <Img
              src={staticFile("logos/openai.svg")}
              style={{
                width: logoSize,
                height: logoSize,
                filter: "brightness(0) invert(1) opacity(0.4)",
              }}
            />
          </div>

          {/* Cut 2: Drug Discovery (left-center) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.12,
              bottom: zone.height * 0.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              opacity: cut2Opacity,
            }}
          >
            {/* Pill icon with X overlay */}
            <div style={{ position: "relative" }}>
              <Pill
                size={iconSize}
                color={OB1.DIM}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
              <X
                size={xSize}
                color={OB1.RED}
                strokeWidth={4}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            {/* Label */}
            <div
              style={{
                fontSize: subLabelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Drug
              <br />
              Discovery
            </div>
          </div>

          {/* Arrow pointing right */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.42,
              opacity: arrowOpacity,
              transform: `scale(${arrowScale})`,
            }}
          >
            <ArrowRight
              size={Math.round(100 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* Focus: Agentic Platform (right) */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: focusOpacity,
            }}
          >
            {/* Checkmark */}
            <CheckCircle2
              size={checkSize}
              color={OB1.GREEN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            {/* Label */}
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Focus:
              <br />
              Agentic Platform
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

export const CC_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

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
  slideIn,
  countUp,
  stagger,
  pulse,
} from "./shared";
import {
  AlertTriangle,
  X,
  ArrowRight,
  Database,
  FileText,
  Key,
  Clock,
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
    // DESIGN SPEC for AIA-013-AmplifyFailures
    // FOCAL: Warning triangle icon (AlertTriangle) at 160px, center, with expanding concentric rings showing amplification effect
    // SUPPORTING (3):
    //   - "BEFORE" label (60px) top-left with single small red X (80px)
    //   - Arrow pointing right (ArrowRight icon, 64px) center
    //   - "AFTER" label (60px) top-right with multiple large red X's (80px + 96px + 112px) showing escalation
    // TEXT ON SCREEN:
    //   - "BEFORE" (60px) — 6 chars
    //   - "AFTER" (60px) — 5 chars
    //   Total visible: 11 chars ✓
    // PHASES (REVISED for QC):
    //   - 0-0.7s: Warning triangle + rings fade in
    //   - 0.7-1.7s: "BEFORE" label + small X appear left
    //   - 1.7-2.5s: Arrow slides in from left
    //   - 2.5-3.5s: "AFTER" label + escalating X's appear right
    //   - 3.5-7s: Hold, pulse effect on rings
    // ELEMENT COUNT: 3 groups (triangle center, before-side, after-side) ✓
    // PHONE TEST: All text 60px, icons 80px+ ✓
    id: "AIA-013-AmplifyFailures",
    title: "Amplification Risk",
    subtitle: "Auto-improvement feedback loops",
    bottomLabel: "Small failures become systematic problems when automated",
    bottomAccent: "systematic",
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
          {/* Expanding rings (decorative, zIndex 0) */}
          {[1, 2, 3].map((ring) => {
            const delay = ring * 8;
            const pulseVal = pulse(sceneFrame - delay, 0.03);
            const ringOpacity =
              ease(sceneFrame, delay, delay + 15) *
              (0.25 - ring * 0.05) *
              (0.5 + pulseVal * 0.5);
            const ringScale = 0.4 + ring * 0.25;

            return (
              <div
                key={ring}
                style={{
                  position: "absolute",
                  width: zone.height * ringScale,
                  height: zone.height * ringScale,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.AMBER}`,
                  opacity: ringOpacity,
                  zIndex: 0,
                }}
              />
            );
          })}

          {/* Warning triangle center (zIndex 1) */}
          <div
            style={{
              ...bouncePop(sceneFrame, 5, fps),
              marginBottom: zone.height * 0.12,
              zIndex: 1,
            }}
          >
            <AlertTriangle
              size={Math.round(160 * zone.scale)}
              color={OB1.AMBER}
              strokeWidth={2}
            />
          </div>

          {/* Before/After comparison row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: zone.width * 0.85,
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* BEFORE group */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  ...fadeInUp(sceneFrame, 20),
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.STEEL,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                BEFORE
              </div>
              <div
                style={{
                  ...fadeInUp(sceneFrame, 30),
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <X
                  size={Math.round(80 * zone.scale)}
                  color={OB1.RED}
                  strokeWidth={3}
                />
              </div>
            </div>

            {/* Arrow (zIndex 1) */}
            <div
              style={{
                ...slideIn(sceneFrame, 50, 20, "left"),
                zIndex: 1,
              }}
            >
              <ArrowRight
                size={Math.round(64 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
              />
            </div>

            {/* AFTER group */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  ...fadeInUp(sceneFrame, 75),
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.STEEL,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                AFTER
              </div>
              <div
                style={{
                  display: "flex",
                  gap: Math.round(12 * zone.scale),
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    ...fadeInUp(sceneFrame, 85),
                    zIndex: 1,
                  }}
                >
                  <X
                    size={Math.round(80 * zone.scale)}
                    color={OB1.RED}
                    strokeWidth={3}
                  />
                </div>
                <div
                  style={{
                    ...fadeInUp(sceneFrame, 90),
                    zIndex: 1,
                  }}
                >
                  <X
                    size={Math.round(96 * zone.scale)}
                    color={OB1.RED}
                    strokeWidth={3}
                  />
                </div>
                <div
                  style={{
                    ...fadeInUp(sceneFrame, 95),
                    zIndex: 1,
                  }}
                >
                  <X
                    size={Math.round(112 * zone.scale)}
                    color={OB1.RED}
                    strokeWidth={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-014-Infrastructure
    // FOCAL: Three vertical pillars/columns (Database, FileText, Key icons at 96px each) evenly spaced horizontally
    // SUPPORTING (3): Labels below each pillar: "Memory" / "State" / "Identity" (56px each)
    // TEXT ON SCREEN:
    //   - "Memory" (56px) — 6 chars
    //   - "State" (56px) — 5 chars
    //   - "Identity" (56px) — 8 chars
    //   Total visible: 19 chars ✓
    // PHASES (REVISED for QC):
    //   - 0-0.7s: First pillar (Database + "Memory") fades in
    //   - 0.7-1.3s: Second pillar (FileText + "State") fades in
    //   - 1.3-2s: Third pillar (Key + "Identity") fades in
    //   - 2-7s: Hold with subtle glow pulse on all three
    // ELEMENT COUNT: 3 pillars (within 4 max) ✓
    // PHONE TEST: All text 56px, icons 96px ✓
    id: "AIA-014-Infrastructure",
    title: "Core Requirements",
    subtitle: "Infrastructure for autonomous agents",
    bottomLabel: "Persistent memory, structured state, and stable identity",
    bottomAccent: "Persistent memory",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const pillars = [
        {
          icon: Database,
          label: "Memory",
          color: OB1.CYAN,
          delay: 5,
        },
        {
          icon: FileText,
          label: "State",
          color: OB1.GREEN,
          delay: 25,
        },
        {
          icon: Key,
          label: "Identity",
          color: OB1.PURPLE,
          delay: 45,
        },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.width * 0.08,
          }}
        >
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const glowIntensity = pulse(sceneFrame - pillar.delay - 60, 0.04);

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: Math.round(24 * zone.scale),
                }}
              >
                {/* Icon with glow background */}
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  {/* Glow ring (zIndex 0) */}
                  <div
                    style={{
                      position: "absolute",
                      width: Math.round(160 * zone.scale),
                      height: Math.round(160 * zone.scale),
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${pillar.color}40, transparent 70%)`,
                      opacity: ease(sceneFrame, pillar.delay + 60, pillar.delay + 80) * (0.6 + glowIntensity * 0.4),
                      zIndex: 0,
                    }}
                  />
                  {/* Icon (zIndex 1) */}
                  <div
                    style={{
                      ...bouncePop(sceneFrame, pillar.delay, fps),
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <Icon
                      size={Math.round(96 * zone.scale)}
                      color={pillar.color}
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Label (zIndex 10) */}
                <div
                  style={{
                    ...fadeInUp(sceneFrame, pillar.delay + 15),
                    fontSize: Math.round(56 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  {pillar.label}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-015-Governance
    // FOCAL: Large clock icon (Clock at 160px) showing late-night time, center-top
    // SUPPORTING (2):
    //   - Counter showing "47" in huge digits (120px) center
    //   - Question marks (HelpCircle icons, 64px each) in bottom corners suggesting unclear ownership
    // TEXT ON SCREEN:
    //   - "47" (120px) — 2 chars
    //   - "3 AM" (60px, near clock) — 4 chars
    //   Total visible: 6 chars ✓
    // PHASES (REVISED for QC):
    //   - 0-0.7s: Clock icon appears with glow
    //   - 0.7-1.3s: "3 AM" label fades in below clock
    //   - 1.3-2.5s: Counter counts up from 1 to 47
    //   - 2.5-3.5s: Question marks appear in corners
    //   - 3.5-7s: Hold with dim pulse on question marks
    // ELEMENT COUNT: 3 groups (clock+time, counter, question marks) ✓
    // PHONE TEST: Counter 120px, labels 60px, icons 64-160px ✓
    id: "AIA-015-Governance",
    title: "Oversight Challenge",
    subtitle: "Who reviews at 3AM?",
    bottomLabel: "Experiment 47 needs approval, but ownership is unclear",
    bottomAccent: "unclear",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const count = Math.min(47, countUp(sceneFrame, 40, 75, 47));

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
          {/* Clock + time label at top */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              marginBottom: zone.height * 0.12,
            }}
          >
            {/* Clock icon with glow (zIndex 1) */}
            <div
              style={{
                position: "relative",
              }}
            >
              {/* Glow background (zIndex 0) */}
              <div
                style={{
                  position: "absolute",
                  width: Math.round(240 * zone.scale),
                  height: Math.round(240 * zone.scale),
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${OB1.AMBER}30, transparent 70%)`,
                  opacity: ease(sceneFrame, 5, 25),
                  zIndex: 0,
                }}
              />
              {/* Clock (zIndex 1) */}
              <div
                style={{
                  ...bouncePop(sceneFrame, 5, fps),
                  zIndex: 1,
                  position: "relative",
                }}
              >
                <Clock
                  size={Math.round(160 * zone.scale)}
                  color={OB1.AMBER}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* "3 AM" label (zIndex 10) */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 20),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.AMBER,
                position: "relative",
                zIndex: 10,
              }}
            >
              3 AM
            </div>
          </div>

          {/* Counter "47" (zIndex 10) */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 40),
              fontSize: Math.round(120 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.08,
              position: "relative",
              zIndex: 10,
            }}
          >
            {count}
          </div>

          {/* Question marks in bottom corners (zIndex 1) */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              padding: `0 ${Math.round(40 * zone.scale)}px`,
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 75),
                opacity:
                  ease(sceneFrame, 75, 95) *
                  (0.4 + pulse(sceneFrame - 75, 0.025) * 0.3),
                zIndex: 1,
              }}
            >
              <HelpCircle
                size={Math.round(64 * zone.scale)}
                color={OB1.DIM}
                strokeWidth={2}
              />
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 80),
                opacity:
                  ease(sceneFrame, 80, 100) *
                  (0.4 + pulse(sceneFrame - 80, 0.025) * 0.3),
                zIndex: 1,
              }}
            >
              <HelpCircle
                size={Math.round(64 * zone.scale)}
                color={OB1.DIM}
                strokeWidth={2}
              />
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

export const AIA_CLIPS_E = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

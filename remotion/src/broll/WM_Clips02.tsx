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
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Database,
  FileSearch,
  BarChart3,
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
    // DESIGN SPEC for WM-004-orTakeAnother
    // FOCAL: Large AI chat bubble with confident checkmark, showing a plausible-but-wrong answer
    // SUPPORTING (3):
    //   1. AlertTriangle icon (danger indicator) in red, top-right position
    //   2. User icon (simplified person silhouette) accepting the answer
    //   3. "NO REVIEW" label in red beneath user icon
    // TEXT ON SCREEN:
    //   - "CONFIDENT" (60px, above AI bubble) — 9 chars
    //   - "WRONG" (80px, inside bubble overlay) — 5 chars
    //   - "NO REVIEW" (48px, below user) — 9 chars
    //   Total visible: 23 chars (well under 90) ✓
    // PHASES:
    //   - 0-1.5s: AI bubble with checkmark fades in
    //   - 1.5-3s: "WRONG" overlay appears with alert triangle
    //   - 3-5s: User icon + "NO REVIEW" label fades in
    //   - 5-7s: Pulse on alert triangle
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 3 distinct elements (AI bubble, alert, user+label) ✓
    // PHONE TEST: All text 48-80px ✓
    id: "WM-004-orTakeAnother",
    title: "Danger Zone",
    subtitle: "Silent failure",
    bottomLabel: "AI presents wrong answer with confidence—no one catches it",
    bottomAccent: "wrong answer",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

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
          {/* AI Chat Bubble (LEFT) */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 10),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              marginRight: zone.width * 0.08,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                marginBottom: Math.round(8 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              CONFIDENT
            </div>
            <div
              style={{
                width: zone.width * 0.35,
                height: zone.height * 0.4,
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(20 * zone.scale),
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Checkmark inside bubble */}
              <CheckCircle2
                size={Math.round(100 * zone.scale)}
                color={OB1.CYAN}
                style={{
                  opacity: ease(sceneFrame, 10, 30),
                  zIndex: 1,
                }}
              />
              {/* "WRONG" overlay that appears later */}
              <div
                style={{
                  position: "absolute",
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  opacity: ease(sceneFrame, 45, 65),
                  zIndex: 10,
                }}
              >
                WRONG
              </div>
            </div>
          </div>

          {/* Alert Triangle (TOP-RIGHT of bubble) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.15,
              ...bouncePop(sceneFrame, 50, fps),
              zIndex: 10,
            }}
          >
            <AlertTriangle
              size={Math.round(80 * zone.scale)}
              color={OB1.RED}
              fill={OB1.RED}
              style={{
                opacity: 0.3 + pulse(sceneFrame - 50, 0.03) * 0.3,
              }}
            />
          </div>

          {/* Arrow connecting AI to User */}
          <div
            style={{
              ...slideIn(sceneFrame, 70, 20, "right", 30),
              zIndex: 0,
            }}
          >
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.DIM}
            />
          </div>

          {/* User accepting (RIGHT) */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 90),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              marginLeft: zone.width * 0.08,
              zIndex: 1,
            }}
          >
            {/* Simple user icon circle */}
            <div
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(72 * zone.scale),
                  color: OB1.STEEL,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                👤
              </div>
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              NO REVIEW
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-005-worldModelsYou
    // FOCAL: Two-column split showing ROUTING (left) vs EDITORIAL (right)
    // SUPPORTING (2):
    //   1. Database icon + "Information Routing" label (left column) — logistics function
    //   2. Brain/CheckCircle icon + "Editorial Decisions" label (right column) — what matters
    // TEXT ON SCREEN:
    //   - "ROUTING" (60px, left header) — 7 chars
    //   - "Information Routing" (48px, left label) — 20 chars
    //   - "EDITORIAL" (60px, right header) — 9 chars
    //   - "What Matters" (48px, right label) — 12 chars
    //   Total visible: 48 chars (under 90) ✓
    // PHASES:
    //   - 0-1.5s: Vertical separator line draws
    //   - 1.5-3.5s: Left column (routing) fades in
    //   - 3.5-5.5s: Right column (editorial) fades in
    //   - 5.5-7s: Hold both
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 2 distinct functional areas ✓
    // PHONE TEST: All text 48-60px ✓
    id: "WM-005-worldModelsYou",
    title: "Management Split",
    subtitle: "Two functions",
    bottomLabel: "Information routing (logistics) vs editorial decisions (what matters)",
    bottomAccent: "editorial decisions",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Vertical separator line
      const lineHeight = ease(sceneFrame, 0, 40) * zone.height * 0.7;

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
          {/* Vertical separator */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.5,
              top: zone.height * 0.15,
              width: Math.round(3 * zone.scale),
              height: lineHeight,
              backgroundColor: OB1.DIM,
              zIndex: 0,
            }}
          />

          {/* LEFT: Routing */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 45),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              position: "absolute",
              left: zone.width * 0.15,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.STEEL,
                zIndex: 10,
                position: "relative",
              }}
            >
              ROUTING
            </div>
            <div
              style={{
                width: Math.round(160 * zone.scale),
                height: Math.round(160 * zone.scale),
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(80 * zone.scale)}
                color={OB1.STEEL}
                style={{ zIndex: 1 }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.WHITE,
                textAlign: "center",
                maxWidth: zone.width * 0.3,
                zIndex: 10,
                position: "relative",
              }}
            >
              Information Routing
            </div>
          </div>

          {/* RIGHT: Editorial */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 90),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              position: "absolute",
              right: zone.width * 0.15,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              EDITORIAL
            </div>
            <div
              style={{
                width: Math.round(160 * zone.scale),
                height: Math.round(160 * zone.scale),
                borderRadius: "50%",
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <CheckCircle2
                size={Math.round(80 * zone.scale)}
                color={OB1.ORANGE}
                style={{ zIndex: 1 }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 500,
                color: OB1.WHITE,
                textAlign: "center",
                maxWidth: zone.width * 0.3,
                zIndex: 10,
                position: "relative",
              }}
            >
              What Matters
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-006-forDependencyDetection
    // FOCAL: Central "Semantic Retrieval" node with 3 use-case branches radiating out
    // SUPPORTING (3):
    //   1. FileSearch icon + "Status Synthesis" label (120° position)
    //   2. Database icon + "Dependency Detection" label (240° position)
    //   3. BarChart3 icon + "Report Generation" label (0° / 360° position)
    // TEXT ON SCREEN:
    //   - "SEMANTIC RETRIEVAL" (56px, center node) — 18 chars
    //   - "Status Synthesis" (40px) — 16 chars
    //   - "Dependency Detection" (40px) — 20 chars
    //   - "Report Generation" (40px) — 17 chars
    //   Total visible: 71 chars (under 90) ✓
    // PHASES:
    //   - 0-1s: Center node fades in
    //   - 1-2s: First branch (Status) appears
    //   - 2-3s: Second branch (Dependency) appears
    //   - 3-4s: Third branch (Report) appears
    //   - 4-7s: Hold, subtle pulse on center
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 4 total (1 center + 3 branches) ✓
    // PHONE TEST: Center 56px, labels 40px (exactly at floor) ✓
    id: "WM-006-forDependencyDetection",
    title: "Semantic Retrieval",
    subtitle: "Three use cases",
    bottomLabel: "Status synthesis, dependency detection, report generation",
    bottomAccent: "dependency detection",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Center position
      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;

      // Radius for use-case nodes
      const radius = Math.min(zone.width, zone.height) * 0.38;

      // Use case data
      const useCases = [
        {
          label: "Status Synthesis",
          icon: FileSearch,
          color: OB1.CYAN,
          angle: 0, // Right
          delay: 30,
        },
        {
          label: "Dependency Detection",
          icon: Database,
          color: OB1.ORANGE,
          angle: 120, // Lower-left
          delay: 60,
        },
        {
          label: "Report Generation",
          icon: BarChart3,
          color: OB1.GREEN,
          angle: 240, // Lower-right
          delay: 90,
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
            position: "relative",
          }}
        >
          {/* Center node: Semantic Retrieval */}
          <div
            style={{
              position: "absolute",
              left: centerX - Math.round(140 * zone.scale),
              top: centerY - Math.round(80 * zone.scale),
              ...bouncePop(sceneFrame, 10, fps),
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: Math.round(280 * zone.scale),
                height: Math.round(160 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(20 * zone.scale),
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.PURPLE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8 + pulse(sceneFrame - 10, 0.02) * 0.2,
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.PURPLE,
                  textAlign: "center",
                  lineHeight: 1.2,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                SEMANTIC
                <br />
                RETRIEVAL
              </div>
            </div>
          </div>

          {/* Use case nodes */}
          {useCases.map((useCase, i) => {
            const angleRad = (useCase.angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(angleRad);
            const y = centerY + radius * Math.sin(angleRad);

            // Connecting line
            const lineOpacity = ease(sceneFrame, useCase.delay, useCase.delay + 20);
            const nodeOpacity = ease(sceneFrame, useCase.delay + 10, useCase.delay + 30);

            const Icon = useCase.icon;

            return (
              <React.Fragment key={i}>
                {/* Connecting line */}
                <svg
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: zone.width,
                    height: zone.height,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + (x - centerX) * lineOpacity}
                    y2={centerY + (y - centerY) * lineOpacity}
                    stroke={useCase.color}
                    strokeWidth={Math.round(3 * zone.scale)}
                    opacity={lineOpacity * 0.6}
                  />
                </svg>

                {/* Use case node */}
                <div
                  style={{
                    position: "absolute",
                    left: x - Math.round(100 * zone.scale),
                    top: y - Math.round(80 * zone.scale),
                    opacity: nodeOpacity,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(12 * zone.scale),
                    zIndex: 1,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: Math.round(100 * zone.scale),
                      height: Math.round(100 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: OB1.BG_MID,
                      border: `${Math.round(3 * zone.scale)}px solid ${useCase.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={Math.round(50 * zone.scale)}
                      color={useCase.color}
                      style={{ zIndex: 1 }}
                    />
                  </div>
                  {/* Label */}
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      textAlign: "center",
                      width: Math.round(200 * zone.scale),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {useCase.label}
                  </div>
                </div>
              </React.Fragment>
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

export const WM_CLIPS_02 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

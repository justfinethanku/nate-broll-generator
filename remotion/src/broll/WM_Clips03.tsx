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
  Settings,
  Brain,
  Wrench,
  Hammer,
  CheckCircle,
  AlertTriangle,
  ArrowDown,
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
    // DESIGN SPEC for WM-007-toAutomateIt
    // FOCAL: Large warning triangle (amber) with rotating cogwheel icon inside, centered
    // SUPPORTING:
    //   1. Above: "EDITORIAL FUNCTION" label (60px)
    //   2. Below: Arrow + "AUTO-PILOT" label (60px)
    //   3. Small "!" exclamation badge top-right of triangle
    // TEXT ON SCREEN:
    //   - "EDITORIAL FUNCTION" — 18 chars
    //   - "AUTO-PILOT" — 10 chars
    //   Total: 28 chars ✓
    // PHASES:
    //   - 0-1s (0-30f): "EDITORIAL FUNCTION" fades in
    //   - 1-2.5s (30-75f): Triangle + cogwheel bounce in
    //   - 2.5-4s (75-120f): Arrow draws + "AUTO-PILOT" appears
    //   - 4-7s (120-210f): Cogwheel rotates continuously, badge pulses
    // ELEMENT COUNT: 3 groups ✓
    // PHONE TEST: All text 60px, icons 64px+ ✓
    id: "WM-007-toAutomateIt",
    title: "Automation Trap",
    subtitle: "The invisible handoff",
    bottomLabel: "Editorial decisions automated without deliberate choice",
    bottomAccent: "without deliberate choice",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Continuous rotation for cogwheel after it appears
      const cogwheelRotation = sceneFrame > 75 ? (sceneFrame - 75) * 2 : 0;
      const badgePulse = pulse(sceneFrame, 0.04);

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
          {/* Top label: "EDITORIAL FUNCTION" */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              letterSpacing: Math.round(2 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            EDITORIAL FUNCTION
          </div>

          {/* Warning triangle container with cogwheel inside */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Triangle icon */}
            <div style={{ ...bouncePop(sceneFrame, 30, fps) }}>
              <AlertTriangle
                size={Math.round(240 * zone.scale)}
                color={OB1.AMBER}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
            </div>

            {/* Cogwheel inside triangle */}
            <div
              style={{
                position: "absolute",
                opacity: ease(sceneFrame, 40, 60),
                transform: `rotate(${cogwheelRotation}deg)`,
                zIndex: 1,
              }}
            >
              <Settings
                size={Math.round(80 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2.5}
              />
            </div>

            {/* Exclamation badge - top right */}
            <div
              style={{
                position: "absolute",
                top: Math.round(-20 * zone.scale),
                right: Math.round(-20 * zone.scale),
                width: Math.round(48 * zone.scale),
                height: Math.round(48 * zone.scale),
                borderRadius: "50%",
                backgroundColor: OB1.RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: ease(sceneFrame, 60, 80) * (0.9 + badgePulse * 0.1),
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(32 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                !
              </div>
            </div>
          </div>

          {/* Arrow and bottom label container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(zone.height * 0.04),
            }}
          >
            {/* Arrow */}
            <div style={{ opacity: ease(sceneFrame, 75, 95), zIndex: 0 }}>
              <ArrowDown
                size={Math.round(64 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2.5}
              />
            </div>

            {/* "AUTO-PILOT" label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                letterSpacing: Math.round(2 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              AUTO-PILOT
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for WM-008-doesntKnowMight
    // FOCAL: Large brain icon (320px) with dark void circle cut through center
    // SUPPORTING:
    //   1. Above brain: "WORLD MODEL" label (60px)
    //   2. Inside void: "?" symbol (120px, pulsing)
    //   3. Below: "SILENT UNKNOWNS" label (60px, red)
    // TEXT ON SCREEN:
    //   - "WORLD MODEL" — 11 chars
    //   - "?" — 1 char
    //   - "SILENT UNKNOWNS" — 15 chars
    //   Total: 27 chars ✓
    // PHASES:
    //   - 0-1.5s (0-45f): Brain outline + "WORLD MODEL" fade in
    //   - 1.5-2.5s (45-75f): Void appears (scale from 0)
    //   - 2.5-3.5s (75-105f): "SILENT UNKNOWNS" label fades in
    //   - 3.5-7s (105-210f): "?" pulses inside void
    // ELEMENT COUNT: 3 (brain+void as 1, top label, bottom label) ✓
    // PHONE TEST: Text 60px, symbol 120px ✓
    id: "WM-008-doesntKnowMight",
    title: "Knowledge Gap",
    subtitle: "The silent danger",
    bottomLabel: "World models stay silent about critical unknowns",
    bottomAccent: "critical unknowns",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const voidScale = ease(sceneFrame, 45, 75);
      const questionPulse = pulse(sceneFrame - 105, 0.05);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(zone.height * 0.06),
          }}
        >
          {/* Top label: "WORLD MODEL" */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.CYAN,
              letterSpacing: Math.round(2 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            WORLD MODEL
          </div>

          {/* Brain with void */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Brain icon */}
            <div style={{ ...fadeInUp(sceneFrame, 10) }}>
              <Brain
                size={Math.round(320 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2}
                style={{ zIndex: 0 }}
              />
            </div>

            {/* Dark void circle in center */}
            <div
              style={{
                position: "absolute",
                width: Math.round(140 * zone.scale * voidScale),
                height: Math.round(140 * zone.scale * voidScale),
                borderRadius: "50%",
                backgroundColor: OB1.BG_DARK,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              {/* Question mark inside void */}
              <div
                style={{
                  fontSize: Math.round(120 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  opacity: ease(sceneFrame, 105, 125) * (0.7 + questionPulse * 0.3),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                ?
              </div>
            </div>
          </div>

          {/* Bottom label: "SILENT UNKNOWNS" */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 75),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              letterSpacing: Math.round(2 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            SILENT UNKNOWNS
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for WM-009-outHowTo
    // FOCAL: Three connected nodes showing building progression (left to right)
    //   - Node 1: Wrench icon (160px circle, dim/complete)
    //   - Node 2: Hammer icon (160px circle, orange/active)
    //   - Node 3: CheckCircle icon (160px circle, dim/incomplete dashed border)
    // SUPPORTING:
    //   1. Connecting arrows between nodes
    //   2. Below center node: "BUILDING" label (60px)
    // TEXT ON SCREEN:
    //   - "BUILDING" — 8 chars ✓
    // PHASES:
    //   - 0-1s (0-30f): Node 1 appears
    //   - 1-2s (30-60f): Arrow 1 draws
    //   - 2-3s (60-90f): Node 2 appears + "BUILDING" label
    //   - 3-4.5s (90-135f): Arrow 2 draws
    //   - 4.5-7s (135-210f): Node 3 appears (dashed/incomplete)
    // ELEMENT COUNT: 3 (node sequence as 1, arrows as 1, label as 1) ✓
    // PHONE TEST: Icons 64px inside 160px circles, text 60px ✓
    id: "WM-009-outHowTo",
    title: "Builder's Challenge",
    subtitle: "Constructing progress",
    bottomLabel: "Figuring out how to build a world model that works",
    bottomAccent: "that works",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const nodeSize = Math.round(160 * zone.scale);
      const iconSize = Math.round(64 * zone.scale);
      const gapBetweenNodes = zone.width * 0.15;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Nodes row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: gapBetweenNodes,
              marginBottom: Math.round(zone.height * 0.08),
            }}
          >
            {/* Node 1: Wrench (complete) */}
            <div style={{ ...bouncePop(sceneFrame, 0, fps) }}>
              <div
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.DIM}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Wrench
                  size={iconSize}
                  color={OB1.DIM}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>

            {/* Arrow 1 */}
            <div
              style={{
                opacity: ease(sceneFrame, 30, 50),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(48 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2.5}
              />
            </div>

            {/* Node 2: Hammer (active) */}
            <div
              style={{
                position: "relative",
              }}
            >
              <div style={{ ...bouncePop(sceneFrame, 60, fps) }}>
                <div
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    borderRadius: "50%",
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <Hammer
                    size={iconSize}
                    color={OB1.ORANGE}
                    strokeWidth={2.5}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </div>

              {/* "BUILDING" label below node 2 */}
              <div
                style={{
                  position: "absolute",
                  top: nodeSize + Math.round(20 * zone.scale),
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    ...fadeInUp(sceneFrame, 75),
                    fontSize: Math.round(60 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    color: OB1.ORANGE,
                    letterSpacing: Math.round(2 * zone.scale),
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  BUILDING
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div
              style={{
                opacity: ease(sceneFrame, 90, 110),
                zIndex: 0,
              }}
            >
              <ArrowRight
                size={Math.round(48 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2.5}
              />
            </div>

            {/* Node 3: CheckCircle (incomplete/future) */}
            <div style={{ ...bouncePop(sceneFrame, 135, fps) }}>
              <div
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_DARK,
                  border: `${Math.round(3 * zone.scale)}px dashed ${OB1.DIM}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.6,
                  zIndex: 1,
                }}
              >
                <CheckCircle
                  size={iconSize}
                  color={OB1.DIM}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
              </div>
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

export const WM_CLIPS_03 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

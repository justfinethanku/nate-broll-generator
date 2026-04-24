import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  slideIn,
  bouncePop,
  pulse,
} from "./shared";
import {
  User,
  Brain,
  FileText,
  CheckCircle2,
  AlertTriangle,
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
    // DESIGN SPEC for TW-016-Trust
    // FOCAL: Split screen with person icon on left, AI icon on right, giant question mark between
    // SUPPORTING:
    //   1. "Your Understanding" label above person
    //   2. "AI Synthesis" label above AI
    //   3. Large question mark in center
    // TEXT ON SCREEN:
    //   - "Your Understanding" (48px) — 18 chars
    //   - "AI Synthesis" (48px) — 12 chars
    //   - "?" (120px, dominant) — 1 char
    //   Total: 31 chars ✓
    // PHASES:
    //   - 0-1.5s: Person icon + label fade in left
    //   - 1.5-3s: AI icon + label fade in right
    //   - 3-5s: Question mark scales/pops in center
    //   - 5-7s: Subtle pulse on question mark
    // LOGOS: None (abstract concept)
    // ICONS: User (lucide, 96px), Brain (lucide, 96px for AI)
    // ELEMENT COUNT: 3 (person, AI, question mark) ✓
    // PHONE TEST: All text 48px+, question mark 120px, icons 96px ✓
    id: "TW-016-Trust",
    title: "Trust Question",
    subtitle: "Can you claim it as yours?",
    bottomLabel: "AI synthesis creates a trust boundary in knowledge work",
    bottomAccent: "trust boundary",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const pulseVal = pulse(sceneFrame, 0.03);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Left side: Your Understanding */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.18,
              top: zone.height / 2,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: `${OB1.CYAN}20`,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.CYAN}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <User
                  size={Math.round(96 * zone.scale)}
                  color={OB1.CYAN}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
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
                Your Understanding
              </div>
            </div>
          </div>

          {/* Right side: AI Synthesis */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.82,
              top: zone.height / 2,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 45),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(20 * zone.scale),
              }}
            >
              <div
                style={{
                  width: Math.round(160 * zone.scale),
                  height: Math.round(160 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: `${OB1.PURPLE}20`,
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.PURPLE}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <Brain
                  size={Math.round(96 * zone.scale)}
                  color={OB1.PURPLE}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
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
                AI Synthesis
              </div>
            </div>
          </div>

          {/* Center: Giant question mark */}
          <div
            style={{
              position: "absolute",
              left: zone.width / 2,
              top: zone.height / 2,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div style={{ ...bouncePop(sceneFrame, 90, fps) }}>
              <div
                style={{
                  fontSize: Math.round(120 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 800,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                  opacity: sceneFrame >= 150 ? 0.7 + pulseVal * 0.3 : 1,
                }}
              >
                ?
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-017-Markdown (REVISED after QC iteration 1)
    // FOCAL: Giant markdown file icon (.md) in center with "ONE FILE" emphasized
    // SUPPORTING:
    //   1. "Useful" checkmark badge top right
    //   2. "Accurate" checkmark badge bottom right
    // TEXT ON SCREEN:
    //   - "ONE FILE" (80px, above file icon) — 8 chars
    //   - "Useful" (52px) — 6 chars
    //   - "Accurate" (52px) — 8 chars
    //   - ".md" (56px, on file icon) — 3 chars
    //   Total: 25 chars ✓
    // PHASES:
    //   - 0-1.5s: File icon fades in center
    //   - 1.5-3s: "ONE FILE" text appears
    //   - 3-4.5s: "Useful" badge slides in from right
    //   - 4.5-6s: "Accurate" badge slides in from right
    //   - 6-7s: Hold
    // LOGOS: None
    // ICONS: FileText (lucide, 160px for file icon), CheckCircle2 (lucide, 64px for badges)
    // ELEMENT COUNT: 3 (file + 2 badges) ✓
    // PHONE TEST: Main text 80px, supporting 52-56px, file icon 160px ✓
    // ITERATION NOTE: Moved badges from right: 12% to left: 72% to prevent clipping
    id: "TW-017-Markdown",
    title: "One File Goal",
    subtitle: "The synthesis target",
    bottomLabel: "Profound usefulness and accuracy in a single markdown file",
    bottomAccent: "single markdown file",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Center: File icon with .md label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              ONE FILE
            </div>

            <div style={{ ...fadeInUp(sceneFrame, 10) }}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FileText
                  size={Math.round(160 * zone.scale)}
                  color={OB1.STEEL}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "55%",
                    fontSize: Math.round(56 * zone.scale),
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    color: OB1.CYAN,
                    zIndex: 10,
                  }}
                >
                  .md
                </div>
              </div>
            </div>
          </div>

          {/* Top right badge: Useful */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.72,
              top: zone.height * 0.25,
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                ...slideIn(sceneFrame, 90, 25, "right", 60),
                display: "flex",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                backgroundColor: `${OB1.GREEN}20`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                borderRadius: Math.round(32 * zone.scale),
                padding: `${Math.round(16 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                zIndex: 1,
              }}
            >
              <CheckCircle2
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(52 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Useful
              </div>
            </div>
          </div>

          {/* Bottom right badge: Accurate */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.72,
              top: zone.height * 0.65,
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                ...slideIn(sceneFrame, 135, 25, "right", 60),
                display: "flex",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
                backgroundColor: `${OB1.GREEN}20`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                borderRadius: Math.round(32 * zone.scale),
                padding: `${Math.round(16 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                zIndex: 1,
              }}
            >
              <CheckCircle2
                size={Math.round(64 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(52 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Accurate
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-018-CrossBuilt (REVISED after QC iteration 1)
    // FOCAL: Flow diagram showing documents → processor → flagged contradiction
    // SUPPORTING:
    //   1. Stack of document icons (input)
    //   2. Alert/warning icon for contradiction
    // TEXT ON SCREEN:
    //   - "Documents" (48px) — 9 chars
    //   - "Auto-Link" (56px, in processor) — 9 chars
    //   - "Contradictions" (52px, near alert) — 14 chars
    //   Total: 32 chars ✓
    // PHASES:
    //   - 0-1.5s: Document stack fades in left
    //   - 1.5-3s: Arrow draws to processor
    //   - 3-4.5s: Processor box appears with "Auto-Link"
    //   - 4.5-6s: Arrow draws to alert, alert pulses
    //   - 6-7s: Hold with subtle pulse
    // LOGOS: None
    // ICONS: FileText (lucide, 72px × 3 stacked), ArrowRight (lucide, 56px), AlertTriangle (lucide, 96px)
    // ELEMENT COUNT: 4 (doc stack, processor, arrow visual, alert) ✓
    // PHONE TEST: All text 48px+, icons 72-96px ✓
    // ITERATION NOTE: Moved alert from left: 85% to left: 78% to prevent clipping
    id: "TW-018-CrossBuilt",
    title: "Auto Cross-Reference",
    subtitle: "Built during ingest",
    bottomLabel: "Contradictions are automatically flagged when documents are ingested",
    bottomAccent: "automatically flagged",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
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
          {/* SVG for arrows */}
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
            {/* Arrow 1: Docs to Processor */}
            <line
              x1={zone.width * 0.28}
              y1={zone.height / 2}
              x2={zone.width * 0.42}
              y2={zone.height / 2}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - ease(sceneFrame, 45, 75))}
              opacity={ease(sceneFrame, 45, 75) * 0.6}
            />

            {/* Arrow 2: Processor to Alert */}
            <line
              x1={zone.width * 0.58}
              y1={zone.height / 2}
              x2={zone.width * 0.68}
              y2={zone.height / 2}
              stroke={OB1.STEEL}
              strokeWidth={Math.round(4 * zone.scale)}
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - ease(sceneFrame, 135, 165))}
              opacity={ease(sceneFrame, 135, 165) * 0.6}
            />
          </svg>

          {/* Left: Document stack */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: zone.height / 2,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              {/* Stacked document icons */}
              <div
                style={{
                  position: "relative",
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: i * Math.round(8 * zone.scale),
                      top: i * Math.round(8 * zone.scale),
                    }}
                  >
                    <FileText
                      size={Math.round(72 * zone.scale)}
                      color={OB1.CYAN}
                      strokeWidth={2}
                      style={{ zIndex: 1 }}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Documents
              </div>
            </div>
          </div>

          {/* Center: Processor box */}
          <div
            style={{
              position: "absolute",
              left: zone.width / 2,
              top: zone.height / 2,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 90),
                width: zone.width * 0.16,
                minHeight: Math.round(160 * zone.scale),
                backgroundColor: `${OB1.PURPLE}15`,
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.PURPLE}`,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: Math.round(16 * zone.scale),
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  textAlign: "center",
                  lineHeight: 1.2,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Auto-Link
              </div>
            </div>
          </div>

          {/* Right: Alert triangle with label */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.78,
              top: zone.height / 2,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 165),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div
                style={{
                  opacity: sceneFrame >= 180 ? 0.7 + pulseVal * 0.3 : 1,
                }}
              >
                <AlertTriangle
                  size={Math.round(96 * zone.scale)}
                  color={OB1.AMBER}
                  strokeWidth={2.5}
                  style={{ zIndex: 1 }}
                />
              </div>

              <div
                style={{
                  fontSize: Math.round(52 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Contradictions
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

export const TW_CLIPS_06 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

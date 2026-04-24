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
  FileUp,
  X,
  FileText,
  Network,
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
    // DESIGN SPEC for TW-001-Andre
    // FOCAL: Large Obsidian logo (140px) with connecting lines to a central "AI Agent" icon (Brain, 80px in 160px circle)
    // SUPPORTING (3):
    //   - "Knowledge Base" label above Obsidian logo (60px)
    //   - "AI Maintains" label next to Brain (60px)
    //   - "Karpathy's Approach" label bottom (56px)
    // TEXT ON SCREEN:
    //   - "Knowledge Base" (14 chars)
    //   - "AI Maintains" (12 chars)
    //   - "Karpathy's Approach" (19 chars)
    //   Total: 45 chars ✓
    // PHASES:
    //   - 0-1.5s: Obsidian logo fades in
    //   - 1.5-3s: Connecting lines draw toward center
    //   - 3-4.5s: Brain icon pops in center
    //   - 4.5-7s: Labels appear, hold
    // LOGOS: obsidian.svg
    // ELEMENT COUNT: 3 groups (Obsidian+label, Brain+label, bottom label) ✓
    // PHONE TEST: All text 56-60px, logo 140px, icon 80px in 160px circle ✓
    id: "TW-001-Andre",
    title: "Karpathy's Vision",
    subtitle: "AI-maintained knowledge",
    bottomLabel: "A wiki that writes itself",
    bottomAccent: "writes itself",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Obsidian logo position (left)
      const obsidianX = zone.width * 0.25;
      const obsidianY = zone.height * 0.45;

      // Brain center position
      const brainX = zone.width * 0.65;
      const brainY = zone.height * 0.45;

      // Line animation
      const lineProgress = ease(sceneFrame, 45, 75);

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
          {/* Connecting line - zIndex 0 */}
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
            <line
              x1={obsidianX}
              y1={obsidianY}
              x2={obsidianX + (brainX - obsidianX) * lineProgress}
              y2={obsidianY + (brainY - obsidianY) * lineProgress}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={ease(sceneFrame, 45, 60)}
            />
          </svg>

          {/* Obsidian logo + label - outer div for positioning */}
          <div
            style={{
              position: "absolute",
              left: obsidianX,
              top: obsidianY,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Inner div for animation */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
                ...fadeInUp(sceneFrame, 0, 30),
              }}
            >
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Knowledge Base
              </div>
              <div style={{ zIndex: 1 }}>
                <Img
                  src={staticFile("logos/obsidian.svg")}
                  style={{
                    width: Math.round(140 * zone.scale),
                    height: Math.round(140 * zone.scale),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Brain icon + label */}
          <div
            style={{
              position: "absolute",
              left: brainX,
              top: brainY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
            }}
          >
            <div
              style={{
                ...bouncePop(sceneFrame, 90, fps),
              }}
            >
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
                <Brain
                  size={Math.round(80 * zone.scale)}
                  color={OB1.ORANGE}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                opacity: ease(sceneFrame, 135, 155),
                zIndex: 10,
                position: "relative",
              }}
            >
              AI Maintains
            </div>
          </div>

          {/* Bottom label */}
          <div
            style={{
              position: "absolute",
              bottom: zone.height * 0.08,
              left: zone.width * 0.5,
              transform: "translateX(-50%)",
              fontSize: Math.round(56 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 500,
              color: OB1.STEEL,
              opacity: ease(sceneFrame, 155, 175),
              zIndex: 10,
            }}
          >
            Karpathy's Approach
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-002-Scale
    // FOCAL: Two side-by-side failure zones with large X marks - left shows "Wiki" breaking (file icons scattering), right shows "OpenBrain" breaking (network nodes fragmenting)
    // SUPPORTING (2):
    //   - "BREAKS AT SCALE" title centered top (72px)
    //   - Divider line between the two zones
    // TEXT ON SCREEN:
    //   - "BREAKS AT SCALE" (15 chars)
    //   - "Wiki" (4 chars)
    //   - "OpenBrain" (9 chars)
    //   Total: 28 chars ✓
    // PHASES:
    //   - 0-2s: Title fades in
    //   - 2-3s: Divider line draws
    //   - 3-4.5s: Left zone (Wiki) materializes with X
    //   - 4.5-6s: Right zone (OpenBrain) materializes with X
    //   - 6-7s: Hold
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 3 (title + 2 failure zones) ✓
    // PHONE TEST: Title 72px, labels 48px ✓
    id: "TW-002-Scale",
    title: "Breaking Points",
    subtitle: "When systems fail",
    bottomLabel: "Each approach has its limits",
    bottomAccent: "limits",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftCenterX = zone.width * 0.28;
      const rightCenterX = zone.width * 0.72;
      const centerY = zone.height * 0.55;

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
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.1,
              fontSize: Math.round(72 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              ...fadeInUp(sceneFrame, 0, 30),
              zIndex: 10,
            }}
          >
            BREAKS AT SCALE
          </div>

          {/* Divider line - zIndex 0 */}
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
            <line
              x1={zone.width * 0.5}
              y1={zone.height * 0.25}
              x2={zone.width * 0.5}
              y2={zone.height * 0.25 + (zone.height * 0.65 * ease(sceneFrame, 60, 90))}
              stroke={OB1.DIM}
              strokeWidth={Math.round(2 * zone.scale)}
              strokeDasharray="8,8"
            />
          </svg>

          {/* Left zone - Wiki */}
          <div
            style={{
              position: "absolute",
              left: leftCenterX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Scattered file icons - zIndex 1 */}
            <div
              style={{
                position: "relative",
                width: Math.round(200 * zone.scale),
                height: Math.round(200 * zone.scale),
                opacity: ease(sceneFrame, 90, 110),
                zIndex: 1,
              }}
            >
              {[
                { x: -40, y: -30, delay: 90 },
                { x: 40, y: -40, delay: 95 },
                { x: -50, y: 30, delay: 100 },
                { x: 30, y: 40, delay: 105 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${Math.round(pos.x * zone.scale)}px), calc(-50% + ${Math.round(pos.y * zone.scale)}px))`,
                    opacity: ease(sceneFrame, pos.delay, pos.delay + 20) * 0.6,
                  }}
                >
                  <FileText
                    size={Math.round(48 * zone.scale)}
                    color={OB1.STEEL}
                  />
                </div>
              ))}
              {/* Red X over files - outer div for positioning */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Inner div for animation */}
                <div
                  style={{
                    ...bouncePop(sceneFrame, 120, fps),
                    zIndex: 1,
                  }}
                >
                  <X
                    size={Math.round(120 * zone.scale)}
                    color={OB1.RED}
                    strokeWidth={Math.round(4 * zone.scale)}
                  />
                </div>
              </div>
            </div>
            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                opacity: ease(sceneFrame, 110, 130),
                zIndex: 10,
                position: "relative",
              }}
            >
              Wiki
            </div>
          </div>

          {/* Right zone - OpenBrain */}
          <div
            style={{
              position: "absolute",
              left: rightCenterX,
              top: centerY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
            }}
          >
            {/* Fragmented network - zIndex 1 */}
            <div
              style={{
                position: "relative",
                width: Math.round(200 * zone.scale),
                height: Math.round(200 * zone.scale),
                opacity: ease(sceneFrame, 135, 155),
                zIndex: 1,
              }}
            >
              {[
                { x: -45, y: -35, delay: 135 },
                { x: 45, y: -35, delay: 140 },
                { x: -45, y: 35, delay: 145 },
                { x: 45, y: 35, delay: 150 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${Math.round(pos.x * zone.scale)}px), calc(-50% + ${Math.round(pos.y * zone.scale)}px))`,
                    opacity: ease(sceneFrame, pos.delay, pos.delay + 20) * 0.6,
                  }}
                >
                  <Network
                    size={Math.round(40 * zone.scale)}
                    color={OB1.CYAN}
                  />
                </div>
              ))}
              {/* Red X over network - outer div for positioning */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Inner div for animation */}
                <div
                  style={{
                    ...bouncePop(sceneFrame, 165, fps),
                    zIndex: 1,
                  }}
                >
                  <X
                    size={Math.round(120 * zone.scale)}
                    color={OB1.RED}
                    strokeWidth={Math.round(4 * zone.scale)}
                  />
                </div>
              </div>
            </div>
            {/* Label */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                opacity: ease(sceneFrame, 155, 175),
                zIndex: 10,
                position: "relative",
              }}
            >
              OpenBrain
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-003-Documents
    // FOCAL: Three product logos in horizontal row (ChatGPT, NotebookLM, Claude) at 120px each, with upward arrows (FileUp icons 64px) below each
    // SUPPORTING (1):
    //   - "Daily Upload Workflow" title top (64px)
    // TEXT ON SCREEN:
    //   - "Daily Upload Workflow" (21 chars)
    //   - "ChatGPT" (7 chars)
    //   - "NotebookLM" (10 chars)
    //   - "Claude" (6 chars)
    //   Total: 44 chars ✓
    // PHASES:
    //   - 0-1.5s: Title fades in
    //   - 1.5-2.5s: ChatGPT logo + arrow appear (stagger 0)
    //   - 2.5-3.5s: NotebookLM logo + arrow appear (stagger 1)
    //   - 3.5-4.5s: Claude logo + arrow appear (stagger 2)
    //   - 4.5-7s: Pulse animation on arrows
    // LOGOS: openai.svg, notebooklm.svg, claude.svg
    // ELEMENT COUNT: 4 (title + 3 logo groups) ✓
    // PHONE TEST: Title 64px, logos 120px, icons 64px ✓
    id: "TW-003-Documents",
    title: "Daily AI Workflow",
    subtitle: "File uploads everywhere",
    bottomLabel: "Context scattered across platforms",
    bottomAccent: "scattered",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const tools = [
        { logo: "openai.svg", label: "ChatGPT", delay: 45 },
        { logo: "notebooklm.svg", label: "NotebookLM", delay: 75 },
        { logo: "claude.svg", label: "Claude", delay: 105 },
      ];

      const gapBetween = zone.width * 0.08;
      const totalWidth = tools.length * Math.round(120 * zone.scale) + (tools.length - 1) * gapBetween;
      const startX = (zone.width - totalWidth) / 2;

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
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: zone.height * 0.15,
              fontSize: Math.round(64 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              ...fadeInUp(sceneFrame, 0, 30),
              zIndex: 10,
            }}
          >
            Daily Upload Workflow
          </div>

          {/* Tool icons row */}
          <div
            style={{
              display: "flex",
              gap: gapBetween,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {tools.map((tool, i) => {
              const pulseVal = pulse(sceneFrame - 135, 0.04);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(24 * zone.scale),
                    ...fadeInUp(sceneFrame, tool.delay, 20),
                  }}
                >
                  {/* Logo - zIndex 1 */}
                  <div style={{ zIndex: 1 }}>
                    <Img
                      src={staticFile(`logos/${tool.logo}`)}
                      style={{
                        width: Math.round(120 * zone.scale),
                        height: Math.round(120 * zone.scale),
                      }}
                    />
                  </div>

                  {/* Upload arrow - zIndex 1 */}
                  <div
                    style={{
                      opacity: ease(sceneFrame, tool.delay + 15, tool.delay + 30) * (sceneFrame > 135 ? 0.5 + pulseVal * 0.5 : 1),
                      zIndex: 1,
                    }}
                  >
                    <FileUp
                      size={Math.round(64 * zone.scale)}
                      color={OB1.ORANGE}
                      strokeWidth={Math.round(2.5 * zone.scale)}
                    />
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontSize: Math.round(44 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      opacity: ease(sceneFrame, tool.delay + 20, tool.delay + 35),
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {tool.label}
                  </div>
                </div>
              );
            })}
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

export const TW_CLIPS_01 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

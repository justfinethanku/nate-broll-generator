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
  Database,
  FileText,
  CheckCircle2,
  X,
  FolderUp,
  Globe,
  Cpu,
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
    // DESIGN SPEC for BYOC-016-prompts-that-help-1120-610
    // FOCAL: Two-column comparison — left: database icon with structured rows; right: messy document stack
    // SUPPORTING (3):
    //   1. Green checkmark above database (left)
    //   2. Red X above document stack (right)
    //   3. Vertical separator line between columns
    // TEXT ON SCREEN:
    //   - "Structured Context" (60px, left column) — 17 chars
    //   - "Working Document" (60px, right column) — 16 chars
    //   Total visible: 33 chars ✓
    // PHASES:
    //   - 0-1.5s: Database visual fades in with checkmark
    //   - 1.5-3s: Separator line draws
    //   - 3-5s: Document stack fades in with X
    //   - 5-7s: Hold
    // ELEMENT COUNT: 2 groups (database group, document group) ✓
    // PHONE TEST: All text 60px, icons 160px+ ✓
    id: "BYOC-016-prompts-that-help-1120-610",
    title: "Database Superiority",
    subtitle: "Structured vs. documents",
    bottomLabel: "Structured context management beats working documents",
    bottomAccent: "Structured",
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
          {/* Left column: Database + checkmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(32 * zone.scale),
              ...fadeInUp(sceneFrame, 10),
            }}
          >
            <CheckCircle2
              size={Math.round(80 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                width: Math.round(180 * zone.scale),
                height: Math.round(180 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(16 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(100 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                maxWidth: Math.round(320 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Structured Context
            </div>
          </div>

          {/* Separator line */}
          <div
            style={{
              width: Math.round(3 * zone.scale),
              height: zone.height * 0.6 * ease(sceneFrame, 45, 75),
              backgroundColor: OB1.DIM,
              margin: `0 ${Math.round(zone.width * 0.08)}px`,
              zIndex: 0,
            }}
          />

          {/* Right column: Document stack + X */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(32 * zone.scale),
              ...fadeInUp(sceneFrame, 90),
            }}
          >
            <X
              size={Math.round(80 * zone.scale)}
              color={OB1.RED}
              strokeWidth={3}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                width: Math.round(180 * zone.scale),
                height: Math.round(180 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(16 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.RED}`,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Stack of documents effect */}
              {[0, 1, 2].map((i) => (
                <FileText
                  key={i}
                  size={Math.round(90 * zone.scale)}
                  color={OB1.RED}
                  strokeWidth={2}
                  style={{
                    position: "absolute",
                    transform: `translate(${i * 8 * zone.scale}px, ${i * 8 * zone.scale}px)`,
                    opacity: 1 - i * 0.3,
                    zIndex: 1,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                maxWidth: Math.round(320 * zone.scale),
                zIndex: 10,
                position: "relative",
              }}
            >
              Working Document
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-017-want-to-make-1190-190
    // FOCAL: Large folder icon (160px) with upward arrow, transforming clean data (green particles) from messy data
    // SUPPORTING (3):
    //   1. "Clean Export" label below folder (60px)
    //   2. "Proprietary" label (40px) on left side with strikethrough, fading out
    //   3. Green checkmark on right side
    // TEXT ON SCREEN:
    //   - "Clean Export" (60px) — 12 chars
    //   - "Proprietary" (40px, strikethrough, dims out) — 11 chars
    //   Total visible peak: 23 chars ✓
    // PHASES:
    //   - 0-2s: Folder icon appears
    //   - 2-4s: Proprietary label appears with strikethrough, begins fading
    //   - 4-6s: Green particles flow upward, checkmark appears
    //   - 6-7s: Hold clean state
    // ELEMENT COUNT: 3 (folder, export label, checkmark) ✓
    // PHONE TEST: All text ≥40px, folder 160px ✓
    id: "BYOC-017-want-to-make-1190-190",
    title: "Portable Context",
    subtitle: "Export clean data",
    bottomLabel: "Export professional context without proprietary employer data",
    bottomAccent: "clean",
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
          {/* Proprietary label (left, fading out) */}
          <div
            style={{
              position: "absolute",
              left: zone.width * 0.15,
              top: zone.height * 0.3,
              fontSize: Math.round(40 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.RED,
              opacity: ease(sceneFrame, 60, 90) * (1 - ease(sceneFrame, 120, 150)),
              textDecoration: "line-through",
              zIndex: 10,
            }}
          >
            Proprietary
          </div>

          {/* Central folder icon */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              marginBottom: Math.round(40 * zone.scale),
            }}
          >
            <div
              style={{
                width: Math.round(200 * zone.scale),
                height: Math.round(200 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(16 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                position: "relative",
                zIndex: 1,
              }}
            >
              <FolderUp
                size={Math.round(120 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />

              {/* Green particles flowing upward */}
              {[0, 1, 2, 3, 4].map((i) => {
                const particleDelay = 120 + i * 10;
                const particleProgress = ease(sceneFrame, particleDelay, particleDelay + 40);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: Math.round(12 * zone.scale),
                      height: Math.round(12 * zone.scale),
                      backgroundColor: OB1.GREEN,
                      borderRadius: "50%",
                      bottom: `${-40 + particleProgress * 120}%`,
                      left: `${30 + i * 10}%`,
                      opacity: particleProgress * (1 - particleProgress * 0.5),
                      zIndex: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* "Clean Export" label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 30),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: Math.round(32 * zone.scale),
              zIndex: 10,
              position: "relative",
            }}
          >
            Clean Export
          </div>

          {/* Checkmark (right side) */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.15,
              top: zone.height * 0.3,
              ...bouncePop(sceneFrame, 140, fps),
            }}
          >
            <CheckCircle2
              size={Math.round(80 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
              style={{ zIndex: 1 }}
            />
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for BYOC-018-to-the-Internet-1270-100
    // FOCAL: Two parallel lanes — top: "HTTP" label with globe icon; bottom: "MCP" label with AI chip icon
    // SUPPORTING (3):
    //   1. Connecting arrows from both to shared endpoint
    //   2. "Web" label under HTTP (40px)
    //   3. "AI" label under MCP (40px)
    //   4. "Universal Standard" label at convergence point (60px)
    // TEXT ON SCREEN:
    //   - "HTTP" (80px) — 4 chars
    //   - "MCP" (80px) — 3 chars
    //   - "Web" (40px) — 3 chars
    //   - "AI" (40px) — 2 chars
    //   - "Universal Standard" (60px) — 18 chars
    //   Total: 30 chars ✓
    // PHASES:
    //   - 0-1.5s: HTTP lane fades in
    //   - 1.5-3s: MCP lane fades in
    //   - 3-5s: Arrows draw to convergence point
    //   - 5-7s: "Universal Standard" label appears
    // ELEMENT COUNT: 4 (HTTP group, MCP group, arrows, convergence label) ✓
    // PHONE TEST: All text ≥40px, icons 96px ✓
    id: "BYOC-018-to-the-Internet-1270-100",
    title: "Universal Standard",
    subtitle: "MCP = HTTP for AI",
    bottomLabel: "MCP becoming the universal AI protocol, like HTTP for the web",
    bottomAccent: "universal",
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
          {/* HTTP lane (top) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              marginBottom: Math.round(80 * zone.scale),
              ...fadeInUp(sceneFrame, 10),
            }}
          >
            <div
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                zIndex: 1,
              }}
            >
              <Globe
                size={Math.round(72 * zone.scale)}
                color={OB1.CYAN}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                HTTP
              </div>
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.CYAN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Web
              </div>
            </div>
          </div>

          {/* MCP lane (bottom) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(24 * zone.scale),
              ...fadeInUp(sceneFrame, 45),
            }}
          >
            <div
              style={{
                width: Math.round(120 * zone.scale),
                height: Math.round(120 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
                zIndex: 1,
              }}
            >
              <Cpu
                size={Math.round(72 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2}
                style={{ zIndex: 1 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(80 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                MCP
              </div>
              <div
                style={{
                  fontSize: Math.round(40 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.ORANGE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                AI
              </div>
            </div>
          </div>

          {/* Arrows to convergence */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.2,
              top: zone.height * 0.35,
              display: "flex",
              flexDirection: "column",
              gap: Math.round(60 * zone.scale),
              opacity: ease(sceneFrame, 90, 120),
            }}
          >
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
            <ArrowRight
              size={Math.round(64 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={3}
              style={{ zIndex: 0 }}
            />
          </div>

          {/* "Universal Standard" label */}
          <div
            style={{
              position: "absolute",
              right: zone.width * 0.05,
              top: zone.height * 0.42,
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              textAlign: "center",
              maxWidth: Math.round(280 * zone.scale),
              ...fadeInUp(sceneFrame, 150),
              zIndex: 10,
            }}
          >
            Universal Standard
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

export const BYOC_CLIPS_F = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

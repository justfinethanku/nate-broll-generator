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
  Shield,
  CheckCircle2,
  AlertCircle,
  Server,
  Database,
  Search,
  Brain,
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
    // DESIGN SPEC for WM-010-worldModelThat (REVISED)
    // FOCAL: Large shield icons split — left GREEN (clear), right RED (uncertain)
    // SUPPORTING (2):
    //   - "CLEAR" label above green shield (56px)
    //   - "UNCERTAIN" label above red shield (56px)
    //   - Status icons below each shield (CheckCircle2/AlertCircle at 64px)
    // TEXT ON SCREEN:
    //   - "CLEAR" (56px) — 5 chars
    //   - "UNCERTAIN" (56px) — 9 chars
    //   Total visible: 14 chars ✓
    // PHASES:
    //   - 0-1s: Shield outlines fade in
    //   - 1-2s: Green shield fills + label appears
    //   - 2-3s: Red shield fills + label appears
    //   - 3-4s: Status icons pop in
    //   - 4-7s: Hold
    // REVISION: Increased shield size 140→200px, earlier label timing
    // ELEMENT COUNT: 2 shield groups (within 4 max) ✓
    // PHONE TEST: Text 56px, icons 64px, shields 200px ✓
    id: "WM-010-worldModelThat",
    title: "World Model Quality",
    subtitle: "The uncertainty boundary",
    bottomLabel: "Helpful models communicate uncertainty clearly",
    bottomAccent: "uncertainty",
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
          {/* Central shield container */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Left half: CLEAR */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
              }}
            >
              {/* Label */}
              <div
                style={{
                  ...fadeInUp(sceneFrame, 30),
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                CLEAR
              </div>

              {/* Shield left half */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    opacity: ease(sceneFrame, 30, 60),
                    transform: `scale(${ease(sceneFrame, 30, 60)})`,
                  }}
                >
                  <Shield
                    size={Math.round(200 * zone.scale)}
                    color={OB1.GREEN}
                    fill={OB1.GREEN}
                    style={{
                      opacity: 0.2,
                      zIndex: 1,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <Shield
                    size={Math.round(200 * zone.scale)}
                    color={OB1.GREEN}
                    strokeWidth={3}
                    style={{
                      opacity: ease(sceneFrame, 0, 30),
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>

              {/* Status icon */}
              <div
                style={{
                  ...bouncePop(sceneFrame, 90, fps),
                }}
              >
                <CheckCircle2
                  size={Math.round(64 * zone.scale)}
                  color={OB1.GREEN}
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>

            {/* Right half: UNCERTAIN */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(24 * zone.scale),
              }}
            >
              {/* Label */}
              <div
                style={{
                  ...fadeInUp(sceneFrame, 60),
                  fontSize: Math.round(56 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.RED,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                UNCERTAIN
              </div>

              {/* Shield right half */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    opacity: ease(sceneFrame, 60, 90),
                    transform: `scale(${ease(sceneFrame, 60, 90)})`,
                  }}
                >
                  <Shield
                    size={Math.round(200 * zone.scale)}
                    color={OB1.RED}
                    fill={OB1.RED}
                    style={{
                      opacity: 0.2,
                      zIndex: 1,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <Shield
                    size={Math.round(200 * zone.scale)}
                    color={OB1.RED}
                    strokeWidth={3}
                    style={{
                      opacity: ease(sceneFrame, 0, 30),
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>

              {/* Status icon */}
              <div
                style={{
                  ...bouncePop(sceneFrame, 90, fps),
                }}
              >
                <AlertCircle
                  size={Math.round(64 * zone.scale)}
                  color={OB1.RED}
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-011-fromRealSystems (REVISED)
    // FOCAL: Horizontal spectrum bar with gradient from GREEN (left) to RED (right)
    // SUPPORTING (2):
    //   - Server icon at left end with "Telemetry" label (140px icon, 48px label)
    //   - Slack logo at right end with "Docs/Chat" label (140px logo, 48px label)
    //   - "High Fidelity" / "Low Fidelity" axis labels at ends (44px)
    // TEXT ON SCREEN:
    //   - "Telemetry" (48px) — 9 chars
    //   - "Docs/Chat" (48px) — 9 chars
    //   - "High Fidelity" (44px) — 13 chars
    //   - "Low Fidelity" (44px) — 12 chars
    //   Total visible: 43 chars ✓
    // PHASES:
    //   - 0-1.5s: Spectrum bar draws left to right
    //   - 1.5-3s: Server icon + label fade in
    //   - 3-4.5s: Slack logo + label fade in
    //   - 4.5-6s: Axis labels appear
    //   - 6-7s: Hold
    // REVISION: Increased icon/logo size 120→140px, axis labels earlier timing
    // LOGOS: slack.svg (right end, low-signal)
    // ELEMENT COUNT: 3 (spectrum bar + 2 endpoint groups) ✓
    // PHONE TEST: Icons 140px, text 44-48px ✓
    id: "WM-011-fromRealSystems",
    title: "Signal Fidelity",
    subtitle: "Source quality spectrum",
    bottomLabel: "Operational telemetry vs docs sets your ceiling",
    bottomAccent: "ceiling",
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
            gap: Math.round(30 * zone.scale),
          }}
        >
          {/* Top endpoint icons and labels */}
          <div
            style={{
              display: "flex",
              width: zone.width * 0.8,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Left: Server (high fidelity) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div style={{ ...fadeInUp(sceneFrame, 45) }}>
                <Server
                  size={Math.round(140 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                  style={{ zIndex: 1 }}
                />
              </div>
              <div
                style={{
                  ...fadeInUp(sceneFrame, 60),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Telemetry
              </div>
            </div>

            {/* Right: Slack (low fidelity) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(16 * zone.scale),
              }}
            >
              <div style={{ ...fadeInUp(sceneFrame, 90) }}>
                <Img
                  src={staticFile("logos/slack.svg")}
                  style={{
                    width: Math.round(140 * zone.scale),
                    height: Math.round(140 * zone.scale),
                    zIndex: 1,
                  }}
                />
              </div>
              <div
                style={{
                  ...fadeInUp(sceneFrame, 105),
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Docs/Chat
              </div>
            </div>
          </div>

          {/* Spectrum bar with gradient */}
          <div
            style={{
              width: zone.width * 0.8 * ease(sceneFrame, 0, 45),
              height: Math.round(80 * zone.scale),
              background: `linear-gradient(to right, ${OB1.GREEN}, ${OB1.AMBER}, ${OB1.RED})`,
              borderRadius: Math.round(8 * zone.scale),
              opacity: ease(sceneFrame, 0, 45),
              zIndex: 0,
            }}
          />

          {/* Axis labels */}
          <div
            style={{
              display: "flex",
              width: zone.width * 0.8,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                fontSize: Math.round(44 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
              }}
            >
              High Fidelity
            </div>
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                fontSize: Math.round(44 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.RED,
                zIndex: 10,
                position: "relative",
              }}
            >
              Low Fidelity
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-012-entityGraphThat (REVISED)
    // FOCAL: 3-node horizontal graph — center "Schema" (STEEL), left "Discovery" (GREEN), right "Model" (PURPLE)
    // SUPPORTING (2):
    //   - Connecting lines from Schema to both outer nodes
    //   - Icon in each node (Database, Search, Brain) at 80px
    // TEXT ON SCREEN:
    //   - "Schema" (60px) — 6 chars
    //   - "Discovery" (60px) — 9 chars
    //   - "Model" (60px) — 5 chars
    //   Total visible: 20 chars ✓
    // PHASES:
    //   - 0-1s: Center node appears
    //   - 1-2s: Lines draw outward
    //   - 2-3s: Left node (Discovery) pops in
    //   - 3-4s: Right node (Model) pops in
    //   - 4-7s: Hold
    // REVISION: Increased node size 180→240px, icon size 64→80px, earlier timing for Model node
    // LOGOS: None (abstract architecture)
    // ELEMENT COUNT: 3 nodes (within 4 max) ✓
    // PHONE TEST: Nodes 240px diameter, icons 80px, text 60px ✓
    id: "WM-012-entityGraphThat",
    title: "Entity Graph",
    subtitle: "Schema + discovery balance",
    bottomLabel: "Fixed structure with exploratory model behavior",
    bottomAccent: "exploratory",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width * 0.5;
      const centerY = zone.height * 0.5;
      const radius = Math.min(zone.width, zone.height) * 0.32;
      const nodeDiameter = Math.round(240 * zone.scale);
      const nodeRadius = nodeDiameter / 2;

      // Node positions
      const leftX = centerX - radius;
      const leftY = centerY;
      const rightX = centerX + radius;
      const rightY = centerY;

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
          {/* Connecting lines (zIndex 0, render first) */}
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
            {/* Line to left node */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + (leftX - centerX) * ease(sceneFrame, 30, 60)}
              y2={centerY + (leftY - centerY) * ease(sceneFrame, 30, 60)}
              stroke={OB1.DIM}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={ease(sceneFrame, 30, 60)}
            />
            {/* Line to right node */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + (rightX - centerX) * ease(sceneFrame, 30, 60)}
              y2={centerY + (rightY - centerY) * ease(sceneFrame, 30, 60)}
              stroke={OB1.DIM}
              strokeWidth={Math.round(3 * zone.scale)}
              opacity={ease(sceneFrame, 30, 60)}
            />
          </svg>

          {/* Center node: Schema */}
          <div
            style={{
              position: "absolute",
              left: centerX - nodeRadius,
              top: centerY - nodeRadius,
              ...bouncePop(sceneFrame, 0, fps),
            }}
          >
            <div
              style={{
                width: nodeDiameter,
                height: nodeDiameter,
                borderRadius: "50%",
                backgroundColor: OB1.STEEL,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.STEEL}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(12 * zone.scale),
                zIndex: 1,
              }}
            >
              <Database
                size={Math.round(80 * zone.scale)}
                color={OB1.WHITE}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Schema
              </div>
            </div>
          </div>

          {/* Left node: Discovery */}
          <div
            style={{
              position: "absolute",
              left: leftX - nodeRadius,
              top: leftY - nodeRadius,
              ...bouncePop(sceneFrame, 60, fps),
            }}
          >
            <div
              style={{
                width: nodeDiameter,
                height: nodeDiameter,
                borderRadius: "50%",
                backgroundColor: OB1.GREEN,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.GREEN}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(12 * zone.scale),
                zIndex: 1,
              }}
            >
              <Search
                size={Math.round(80 * zone.scale)}
                color={OB1.WHITE}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Discovery
              </div>
            </div>
          </div>

          {/* Right node: Model */}
          <div
            style={{
              position: "absolute",
              left: rightX - nodeRadius,
              top: rightY - nodeRadius,
              ...bouncePop(sceneFrame, 90, fps),
            }}
          >
            <div
              style={{
                width: nodeDiameter,
                height: nodeDiameter,
                borderRadius: "50%",
                backgroundColor: OB1.PURPLE,
                border: `${Math.round(4 * zone.scale)}px solid ${OB1.PURPLE}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: Math.round(12 * zone.scale),
                zIndex: 1,
              }}
            >
              <Brain
                size={Math.round(80 * zone.scale)}
                color={OB1.WHITE}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(60 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Model
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

export const WM_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

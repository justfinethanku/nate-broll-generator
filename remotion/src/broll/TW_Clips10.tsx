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
  Users,
  Search,
  Layers,
  ArrowDown,
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
    // DESIGN SPEC for TW-028-PreBuilt (FIX 2: Option A - no arrows, clean vertical stack)
    // FOCAL: 3-layer vertical stack (icon above label): Database → Context Graph → Wiki Pages
    // SUPPORTING (1): Database icon (60px) + "Structured DB" label (48px) at bottom third
    // SUPPORTING (2): Layers icon (60px) + "Context Graph" label (48px) in middle third with glow (FOCAL)
    // SUPPORTING (3): FileText icon (60px) + "Wiki Pages" label (48px) at top third
    // TEXT ON SCREEN:
    //   - "Structured DB" (48px) — 13 chars
    //   - "Context Graph" (48px) — 13 chars
    //   - "Wiki Pages" (48px) — 10 chars
    //   Total visible: 36 chars ✓ (under 90)
    // PHASES:
    //   - 0-1s: Database layer fades in at bottom
    //   - 1-2.5s: Context graph layer fades in with glow (FOCAL)
    //   - 2.5-4s: Wiki pages layer fades in at top
    //   - 4-7s: Hold with subtle pulse on context graph
    // ELEMENT COUNT: 3 layers (within 4 max) ✓
    // PHONE TEST: All text 48px, all icons 60px ✓
    // VERTICAL BUDGET: 3 × (60 icon + 12 gap + 48 label) = 360px ✓ (well under 576px)
    // NO ARROWS: Vertical stacking implies flow; arrows removed to prevent overlap
    id: "TW-028-PreBuilt",
    title: "Pre-Built Graph",
    subtitle: "Database-powered context",
    bottomLabel: "Wiki pages generated from structured knowledge layer",
    bottomAccent: "structured knowledge",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Layer spacing - 3 equal vertical slots
      const slotHeight = zone.height / 3;
      const iconSize = Math.round(60 * zone.scale);
      const labelSize = Math.round(48 * zone.scale);

      // Animations - staggered bottom-to-top
      const dbOpacity = ease(sceneFrame, 0, 30);
      const graphOpacity = ease(sceneFrame, 30, 75);
      const wikiOpacity = ease(sceneFrame, 75, 120);
      const graphGlow = pulse(sceneFrame - 120, 0.04);

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
          {/* Bottom slot: Structured Database */}
          <div
            style={{
              width: zone.width,
              height: slotHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(12 * zone.scale),
              opacity: dbOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            <Database
              size={iconSize}
              color={OB1.STEEL}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
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
              Structured DB
            </div>
          </div>

          {/* Middle slot: Context Graph (FOCAL - with glow) */}
          <div
            style={{
              width: zone.width,
              height: slotHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(12 * zone.scale),
              opacity: graphOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              {/* Glow ring */}
              {sceneFrame >= 120 && (
                <div
                  style={{
                    position: "absolute",
                    width: Math.round(120 * zone.scale),
                    height: Math.round(120 * zone.scale),
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                    opacity: 0.4 + graphGlow * 0.3,
                    zIndex: 0,
                  }}
                />
              )}
              <Layers
                size={iconSize}
                color={OB1.CYAN}
                strokeWidth={2}
                style={{ zIndex: 1, position: "relative" }}
              />
            </div>
            <div
              style={{
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
              }}
            >
              Context Graph
            </div>
          </div>

          {/* Top slot: Wiki Pages */}
          <div
            style={{
              width: zone.width,
              height: slotHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(12 * zone.scale),
              opacity: wikiOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            <FileText
              size={iconSize}
              color={OB1.GREEN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
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
              Wiki Pages
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-029-Authority
    // FOCAL: Side-by-side comparison showing authority flow: Database (left, ORANGE glow) vs Wiki (right, dimmed)
    // SUPPORTING (1): Database icon (120px) + "Source of Truth" label (60px) + checkmark badge (48px) on left
    // SUPPORTING (2): FileText icon (96px dimmed) + "Generated Artifact" label (52px) on right
    // CONNECTING: Arrow pointing from Database to Wiki (mid-frame)
    // TEXT ON SCREEN:
    //   - "Source of Truth" (60px) — 15 chars
    //   - "Generated Artifact" (52px) — 18 chars
    //   Total visible: 33 chars ✓ (under 90)
    // PHASES:
    //   - 0-1.5s: Database (left) fades in with glow and checkmark
    //   - 1.5-2.5s: Arrow draws from left to right
    //   - 2.5-4s: Wiki (right) fades in dimmed
    //   - 4-7s: Hold with pulse on database glow
    // ELEMENT COUNT: 2 main elements (database + wiki) ✓
    // PHONE TEST: Left text 60px, right text 52px, main icon 120px ✓
    id: "TW-029-Authority",
    title: "Authority Hierarchy",
    subtitle: "Source vs artifact",
    bottomLabel: "Database is truth, wiki is presentation layer",
    bottomAccent: "truth",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const dbOpacity = ease(sceneFrame, 0, 45);
      const arrowProgress = ease(sceneFrame, 45, 75);
      const wikiOpacity = ease(sceneFrame, 75, 120);
      const dbGlow = pulse(sceneFrame - 120, 0.04);

      const arrowStartX = zone.width * 0.35;
      const arrowEndX = zone.width * 0.65;
      const arrowY = zone.height * 0.5;
      const arrowLength = (arrowEndX - arrowStartX) * arrowProgress;

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
          {/* Left: Database (Source of Truth) */}
          <div
            style={{
              width: zone.width * 0.42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: dbOpacity,
              zIndex: 10,
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              {/* Authority glow ring */}
              <div
                style={{
                  position: "absolute",
                  width: Math.round(180 * zone.scale),
                  height: Math.round(180 * zone.scale),
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
                  opacity: sceneFrame >= 120 ? 0.5 + dbGlow * 0.3 : 0.5,
                  zIndex: 0,
                }}
              />
              <Database
                size={Math.round(120 * zone.scale)}
                color={OB1.ORANGE}
                strokeWidth={2.5}
                style={{ zIndex: 1, position: "relative" }}
              />
              {/* Checkmark badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: -Math.round(8 * zone.scale),
                  right: -Math.round(8 * zone.scale),
                  zIndex: 2,
                }}
              >
                <CheckCircle2
                  size={Math.round(48 * zone.scale)}
                  color={OB1.GREEN}
                  fill={OB1.BG_DARK}
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Source of Truth
            </div>
          </div>

          {/* Arrow pointing right */}
          {arrowProgress > 0 && (
            <svg
              width={zone.width}
              height={zone.height}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <defs>
                <marker
                  id="arrowhead-authority"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill={OB1.STEEL}
                  />
                </marker>
              </defs>
              <line
                x1={arrowStartX}
                y1={arrowY}
                x2={arrowStartX + arrowLength}
                y2={arrowY}
                stroke={OB1.STEEL}
                strokeWidth={Math.round(3 * zone.scale)}
                markerEnd="url(#arrowhead-authority)"
                strokeDasharray={arrowProgress < 0.99 ? `${arrowLength} ${arrowEndX - arrowStartX}` : "none"}
              />
            </svg>
          )}

          {/* Right: Wiki (Generated Artifact - dimmed) */}
          <div
            style={{
              width: zone.width * 0.42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: wikiOpacity * 0.7,
              zIndex: 10,
              position: "relative",
            }}
          >
            <FileText
              size={Math.round(96 * zone.scale)}
              color={OB1.DIM}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.DIM,
                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
              Generated Artifact
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for TW-030-HighVol
    // FOCAL: Center "Structured Query" search box with Database icon, radiating out to 3 use-case nodes
    // SUPPORTING (1): Users icon (80px) + "Team Access" label (48px) at 11 o'clock
    // SUPPORTING (2): Layers icon (80px) + "Multi-Tool" label (48px) at 3 o'clock
    // SUPPORTING (3): Search icon (80px) + "Fast Lookup" label (48px) at 7 o'clock
    // CONNECTING: Lines from center to each node
    // TEXT ON SCREEN:
    //   - "Structured Query" (56px center) — 16 chars
    //   - "Team Access" (48px) — 11 chars
    //   - "Multi-Tool" (48px) — 10 chars
    //   - "Fast Lookup" (48px) — 11 chars
    //   Total visible: 48 chars ✓ (under 90)
    // PHASES:
    //   - 0-1s: Center search box fades in
    //   - 1-2s: Lines draw outward to 3 positions
    //   - 2-4s: Three nodes pop in staggered (11→3→7 o'clock)
    //   - 4-7s: Hold with subtle pulse on center
    // ELEMENT COUNT: 4 elements (1 center + 3 nodes) ✓ (exactly at limit)
    // PHONE TEST: Center label 56px, node labels 48px, all icons 80px ✓
    // RADIAL LAYOUT: 3 nodes at 120° intervals centered at top (11, 3, 7 o'clock = 300°, 60°, 210°)
    // FIX (2026-04-21): Increased radius 0.35→0.45, moved center label INSIDE bordered box with icon, increased satellite gap 8→16px
    id: "TW-030-HighVol",
    title: "High Volume",
    subtitle: "When you need structure",
    bottomLabel: "Team scale and multi-tool scenarios require structured queries",
    bottomAccent: "structured queries",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerOpacity = ease(sceneFrame, 0, 30);
      const linesProgress = ease(sceneFrame, 30, 60);
      const centerPulse = pulse(sceneFrame - 120, 0.04);

      // Center position
      const cx = zone.width * 0.5;
      const cy = zone.height * 0.5;

      // Radial layout - 3 nodes evenly spaced
      const radius = Math.min(zone.width, zone.height) * 0.45;
      const nodes = [
        {
          angle: (300 * Math.PI) / 180,
          icon: Users,
          label: "Team Access",
          color: OB1.CYAN,
          delay: 60,
        },
        {
          angle: (60 * Math.PI) / 180,
          icon: Layers,
          label: "Multi-Tool",
          color: OB1.PURPLE,
          delay: 75,
        },
        {
          angle: (210 * Math.PI) / 180,
          icon: Search,
          label: "Fast Lookup",
          color: OB1.GREEN,
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
          {/* Connecting lines */}
          {linesProgress > 0 && (
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
              {nodes.map((node, i) => {
                const endX = cx + radius * Math.cos(node.angle);
                const endY = cy + radius * Math.sin(node.angle);
                const currentLength = linesProgress;
                const x2 = cx + (endX - cx) * currentLength;
                const y2 = cy + (endY - cy) * currentLength;

                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x2}
                    y2={y2}
                    stroke={node.color}
                    strokeWidth={Math.round(2 * zone.scale)}
                    strokeDasharray={`${Math.round(6 * zone.scale)} ${Math.round(4 * zone.scale)}`}
                    opacity={0.6}
                  />
                );
              })}
            </svg>
          )}

          {/* Center: Structured Query with Database icon AND label inside bordered box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              opacity: sceneFrame >= 120 ? (0.85 + centerPulse * 0.15) * centerOpacity : centerOpacity,
              zIndex: 10,
              position: "relative",
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.ORANGE}`,
              borderRadius: Math.round(12 * zone.scale),
              padding: Math.round(24 * zone.scale),
              backgroundColor: `${OB1.BG_MID}cc`,
            }}
          >
            <Database
              size={Math.round(80 * zone.scale)}
              color={OB1.ORANGE}
              strokeWidth={2.5}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(56 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              Structured Query
            </div>
          </div>

          {/* Radial nodes */}
          {nodes.map((node, i) => {
            const x = cx + radius * Math.cos(node.angle);
            const y = cy + radius * Math.sin(node.angle);
            const Icon = node.icon;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(16 * zone.scale),
                    ...bouncePop(sceneFrame, node.delay, fps),
                  }}
                >
                  <div
                    style={{
                      border: `${Math.round(2 * zone.scale)}px solid ${node.color}`,
                      borderRadius: "50%",
                      padding: Math.round(16 * zone.scale),
                      backgroundColor: OB1.BG_DARK,
                    }}
                  >
                    <Icon
                      size={Math.round(80 * zone.scale)}
                      color={node.color}
                      strokeWidth={2}
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
                    {node.label}
                  </div>
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

export const TW_CLIPS_10 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

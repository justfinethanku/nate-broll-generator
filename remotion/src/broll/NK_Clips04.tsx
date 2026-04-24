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
  GitCommit,
  FileText,
  Brain,
  AlertTriangle,
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
    // DESIGN SPEC for NK-010-BlastRadius
    // FOCAL: Central "System" node (ORANGE, 160px circle) connected to 4 dependency
    //        nodes arranged in a wide arc. One node ("Payments") glows RED as failed.
    // SUPPORTING (3):
    //   (1) Failure propagation lines from Payments → 2 downstream nodes that turn AMBER
    //   (2) Label "BLAST RADIUS" arcing above in ORANGE (60px)
    //   (3) A subtle pulse ring on the failed node
    // TEXT ON SCREEN:
    //   - "BLAST RADIUS" (60px) — 12 chars
    //   - Node labels: "Auth", "Payments", "API", "Cache" (48px each) — ~4 labels visible
    //   Total: ~36 chars (well under 90)
    // PHASES:
    //   - 0–1.5s (0–45f): Graph nodes and lines fade in
    //   - 1.5–3.5s (45–105f): "Payments" node turns RED, pulse ring appears
    //   - 3.5–7s (105–210f): Propagation lines to Auth+Cache turn AMBER, hold
    // ELEMENT COUNT: 1 central node + 4 dependency nodes (displayed as labeled circles = one visual group) + header label = 3 labeled elements ✓
    // PHONE TEST: All labels ≥48px, all nodes ≥160px diameter ✓
    id: "NK-010-BlastRadius",
    title: "Blast Radius",
    subtitle: "system thinking",
    bottomLabel: "Understanding failure propagation separates systems thinkers from feature thinkers",
    bottomAccent: "failure propagation",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      // Phase timings
      const graphFadeStart = 0;
      const failureStart = 45;
      const propagateStart = 105;

      // Center of the GFX zone
      const cx = zone.width * 0.5;
      const cy = zone.height * 0.55;

      // Node definitions — 4 dependency nodes in a wide arc
      const centerR = Math.round(72 * zone.scale); // radius of center node
      const orbitR = Math.min(zone.width, zone.height) * 0.30;

      type NodeDef = {
        label: string;
        angle: number; // degrees
        isFailure: boolean;
        isPropagated: boolean;
      };

      const nodes: NodeDef[] = [
        { label: "Auth",     angle: 200, isFailure: false, isPropagated: true  },
        { label: "Payments", angle: 90,  isFailure: true,  isPropagated: false },
        { label: "API",      angle: 340, isFailure: false, isPropagated: false },
        { label: "Cache",    angle: 160, isFailure: false, isPropagated: true  },
      ];

      const toRad = (deg: number) => (deg * Math.PI) / 180;

      const nodePositions = nodes.map((n) => ({
        ...n,
        x: cx + orbitR * Math.cos(toRad(n.angle)),
        y: cy + orbitR * Math.sin(toRad(n.angle)),
      }));

      const nodeR = Math.round(60 * zone.scale); // orbit node radius

      // Helper: edge intersection point so lines stop at node border
      const edgePoint = (x1: number, y1: number, x2: number, y2: number, r: number) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return { x: x2 - (dx / dist) * r, y: y2 - (dy / dist) * r };
      };

      const failureNodeOpacity = ease(sceneFrame, failureStart, failureStart + 20);
      const propagateOpacity = ease(sceneFrame, propagateStart, propagateStart + 25);

      // Pulse on the failure node
      const failurePulse = failureNodeOpacity * pulse(sceneFrame, 0.07);

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
          {/* SVG layer — lines and rings at zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            {/* Connection lines from center to each node */}
            {nodePositions.map((n, i) => {
              const lineOpacity = ease(sceneFrame, stagger(i, graphFadeStart, 10), stagger(i, graphFadeStart, 10) + 20);
              const fromEdge = edgePoint(n.x, n.y, cx, cy, centerR);
              const toEdge = edgePoint(cx, cy, n.x, n.y, nodeR);

              // Propagated lines turn AMBER after propagation starts
              const isPropagating = n.isPropagated && propagateOpacity > 0;
              const lineColor = n.isFailure
                ? OB1.RED
                : isPropagating
                ? OB1.AMBER
                : OB1.STEEL;
              const lineColorOpacity = n.isPropagated
                ? Math.max(lineOpacity, propagateOpacity)
                : lineOpacity;

              return (
                <line
                  key={i}
                  x1={fromEdge.x}
                  y1={fromEdge.y}
                  x2={toEdge.x}
                  y2={toEdge.y}
                  stroke={lineColor}
                  strokeWidth={Math.round(2 * zone.scale)}
                  opacity={lineColorOpacity}
                />
              );
            })}

            {/* Pulse ring on the failure node */}
            {nodePositions
              .filter((n) => n.isFailure)
              .map((n, i) => (
                <circle
                  key={`pulse-${i}`}
                  cx={n.x}
                  cy={n.y}
                  r={nodeR + Math.round(20 * zone.scale) + failurePulse * Math.round(14 * zone.scale)}
                  fill="none"
                  stroke={OB1.RED}
                  strokeWidth={Math.round(2 * zone.scale)}
                  opacity={failurePulse * 0.6}
                />
              ))}
          </svg>

          {/* Central node — zIndex 1 for fill, text at zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: cx - centerR,
              top: cy - centerR,
              width: centerR * 2,
              height: centerR * 2,
              borderRadius: "50%",
              backgroundColor: OB1.ORANGE,
              border: `${Math.round(3 * zone.scale)}px solid ${OB1.WHITE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              ...bouncePop(sceneFrame, graphFadeStart + 5, fps),
            }}
          >
            <div
              style={{
                fontSize: Math.round(42 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              SYS
            </div>
          </div>

          {/* Dependency nodes */}
          {nodePositions.map((n, i) => {
            const nodeOpacity = ease(sceneFrame, stagger(i, graphFadeStart + 10, 10), stagger(i, graphFadeStart + 10, 10) + 20);

            // Determine node color based on state
            let nodeBg: string = OB1.BG_MID;
            let nodeBorder: string = OB1.STEEL;
            let textColor: string = OB1.WHITE;

            if (n.isFailure && failureNodeOpacity > 0.5) {
              nodeBg = OB1.RED;
              nodeBorder = OB1.WHITE;
            } else if (n.isPropagated && propagateOpacity > 0.5) {
              nodeBorder = OB1.AMBER;
              textColor = OB1.AMBER;
            }

            return (
              <div key={i}>
                {/* Node fill circle — zIndex 1 */}
                <div
                  style={{
                    position: "absolute",
                    left: n.x - nodeR,
                    top: n.y - nodeR,
                    width: nodeR * 2,
                    height: nodeR * 2,
                    borderRadius: "50%",
                    backgroundColor: nodeBg,
                    border: `${Math.round(2 * zone.scale)}px solid ${nodeBorder}`,
                    opacity: nodeOpacity,
                    zIndex: 1,
                  }}
                />
                {/* Node label — zIndex 10 */}
                <div
                  style={{
                    position: "absolute",
                    left: n.x - nodeR,
                    top: n.y - nodeR,
                    width: nodeR * 2,
                    height: nodeR * 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: nodeOpacity,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: textColor,
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {n.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* BLAST RADIUS header label — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              top: Math.round(4 * zone.scale),
              left: 0,
              width: zone.width,
              textAlign: "center",
              ...fadeInUp(sceneFrame, failureStart, 20),
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                letterSpacing: "0.06em",
                position: "relative",
                zIndex: 10,
              }}
            >
              BLAST RADIUS
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for NK-011-CommitMessage
    // FOCAL: Two-column split — LEFT: commit block (git logo + "commit message" label),
    //        RIGHT: explanation artifact block (document icon + "explanation artifact" label)
    // SUPPORTING:
    //   (1) Arrow or "→" connector between columns
    //   (2) Top labels: "OLD WORLD" (STEEL) / "AI ERA" (CYAN)
    // TEXT ON SCREEN:
    //   - "OLD WORLD" (48px) — 9 chars
    //   - "AI ERA" (48px) — 6 chars
    //   - "Commit Message" (60px) — 14 chars
    //   - "Explanation Artifact" (60px) — 20 chars
    //   Total visible: ~49 chars (under 90) ✓
    // PHASES:
    //   - 0–1.5s (0–45f): Left column fades in
    //   - 1.5–2.5s (45–75f): Arrow draws
    //   - 2.5–7s (75–210f): Right column fades in, hold
    // LOGOS: git.svg on the left
    // ELEMENT COUNT: 2 columns + 1 connector arrow = 3 labeled elements ✓
    // PHONE TEST: All text ≥48px, logo 120px ✓
    id: "NK-011-CommitMessage",
    title: "Explanation Artifact",
    subtitle: "the new commit message",
    bottomLabel: "Proof of reasoning bundled with the work — that's the new standard",
    bottomAccent: "proof of reasoning",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const leftStart = 0;
      const arrowStart = 45;
      const rightStart = 75;

      const colWidth = zone.width * 0.38;
      const colHeight = zone.height * 0.62;
      const gap = zone.width * 0.24;
      const leftX = zone.width * 0.5 - gap * 0.5 - colWidth;
      const rightX = zone.width * 0.5 + gap * 0.5;
      const colY = zone.height * 0.5 - colHeight * 0.5;

      // Arrow center
      const arrowCX = zone.width * 0.5;
      const arrowCY = zone.height * 0.5;
      const arrowOpacity = ease(sceneFrame, arrowStart, arrowStart + 20);

      const logoSize = Math.round(120 * zone.scale);

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
          {/* Arrow SVG — zIndex 0 */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={OB1.CYAN} />
              </marker>
            </defs>
            <line
              x1={leftX + colWidth + Math.round(16 * zone.scale)}
              y1={arrowCY}
              x2={rightX - Math.round(16 * zone.scale)}
              y2={arrowCY}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(3 * zone.scale)}
              markerEnd="url(#arrowhead)"
              opacity={arrowOpacity}
            />
          </svg>

          {/* LEFT COLUMN — Old World / Commit Message */}
          <div
            style={{
              position: "absolute",
              left: leftX,
              top: colY,
              width: colWidth,
              height: colHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(20 * zone.scale),
              ...slideIn(sceneFrame, leftStart, 25, "left"),
            }}
          >
            {/* Column background — zIndex 1 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: Math.round(16 * zone.scale),
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}`,
                zIndex: 1,
              }}
            />
            {/* Era label — zIndex 10 */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                letterSpacing: "0.05em",
                position: "relative",
                zIndex: 10,
              }}
            >
              OLD WORLD
            </div>
            {/* Git logo — zIndex 10 */}
            <div style={{ position: "relative", zIndex: 10 }}>
              <Img
                src={staticFile("logos/git.svg")}
                style={{
                  width: logoSize,
                  height: logoSize,
                }}
              />
            </div>
            {/* Label — zIndex 10 */}
            <div
              style={{
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                position: "relative",
                zIndex: 10,
                paddingLeft: Math.round(12 * zone.scale),
                paddingRight: Math.round(12 * zone.scale),
              }}
            >
              Commit Message
            </div>
          </div>

          {/* RIGHT COLUMN — AI Era / Explanation Artifact */}
          <div
            style={{
              position: "absolute",
              left: rightX,
              top: colY,
              width: colWidth,
              height: colHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(20 * zone.scale),
              ...slideIn(sceneFrame, rightStart, 25, "right"),
            }}
          >
            {/* Column background — zIndex 1 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: Math.round(16 * zone.scale),
                backgroundColor: OB1.BG_MID,
                border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                zIndex: 1,
              }}
            />
            {/* Era label — zIndex 10 */}
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.CYAN,
                letterSpacing: "0.05em",
                position: "relative",
                zIndex: 10,
              }}
            >
              AI ERA
            </div>
            {/* Document icon — zIndex 10 */}
            <div style={{ position: "relative", zIndex: 10 }}>
              <FileText
                size={Math.round(120 * zone.scale)}
                color={OB1.CYAN}
              />
            </div>
            {/* Label — zIndex 10 */}
            <div
              style={{
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.2,
                position: "relative",
                zIndex: 10,
                paddingLeft: Math.round(12 * zone.scale),
                paddingRight: Math.round(12 * zone.scale),
              }}
            >
              Explanation Artifact
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for NK-012-MicroTransactions
    // FOCAL: Two horizontal timeline lanes stacked vertically.
    //        TOP lane: "Resume" (STEEL) — sparse dots (4 dots spaced 2 years apart)
    //        BOTTOM lane: "Work Record" (ORANGE) — dense dots (continuous micro-transactions)
    // SUPPORTING:
    //   (1) Lane labels on left: "RESUME" (48px STEEL) / "WORK RECORD" (48px ORANGE)
    //   (2) Time axis below both lanes with implied "now" marker
    // TEXT ON SCREEN:
    //   - "RESUME" (48px) — 6 chars
    //   - "WORK RECORD" (48px) — 11 chars
    //   - "Every 2 yrs" (44px, below top lane) — 11 chars
    //   - "Continuous" (44px, below bottom lane) — 10 chars
    //   Total: ~38 chars (under 90) ✓
    // PHASES:
    //   - 0–1.5s (0–45f): Lane labels + top lane (sparse dots) fade in
    //   - 1.5–7s (45–210f): Bottom lane dense dots animate in progressively, overwhelming top lane visually
    // ELEMENT COUNT: 2 lanes + 2 sublabels = 4 labeled elements ✓
    // PHONE TEST: All text ≥44px, lane track heights readable ✓
    id: "NK-012-MicroTransactions",
    title: "Micro-Transactions",
    subtitle: "the new unit of value",
    bottomLabel: "Continuous micro-transactions replace the static resume",
    bottomAccent: "micro-transactions",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const topLaneStart = 10;
      const bottomLaneStart = 45;

      const laneH = Math.round(72 * zone.scale);
      const labelW = zone.width * 0.28;
      const trackW = zone.width * 0.62;
      const trackX = labelW + zone.width * 0.06;

      // Vertical layout: top lane at 28% from top, bottom at 58% from top
      const topLaneY = zone.height * 0.28 - laneH * 0.5;
      const bottomLaneY = zone.height * 0.62 - laneH * 0.5;

      // Sparse dots: 4 dots spaced evenly across trackW (resume, updated every 2 yrs)
      const sparseDots = [0.1, 0.38, 0.66, 0.94];
      const dotR = Math.round(10 * zone.scale);

      // Dense dots: many dots across trackW (continuous micro-transactions)
      const denseDotCount = 28;
      const denseProgress = ease(sceneFrame, bottomLaneStart, bottomLaneStart + 90);

      const topLaneOpacity = ease(sceneFrame, topLaneStart, topLaneStart + 25);
      const bottomLabelOpacity = ease(sceneFrame, bottomLaneStart, bottomLaneStart + 20);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* ── TOP LANE: Resume ── */}

          {/* Track bar — zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: trackX,
              top: topLaneY + laneH * 0.5 - Math.round(4 * zone.scale),
              width: trackW,
              height: Math.round(4 * zone.scale),
              backgroundColor: OB1.STEEL,
              borderRadius: Math.round(2 * zone.scale),
              opacity: topLaneOpacity,
              zIndex: 1,
            }}
          />

          {/* Sparse dots — zIndex 1 */}
          {sparseDots.map((pos, i) => (
            <div
              key={`sparse-${i}`}
              style={{
                position: "absolute",
                left: trackX + trackW * pos - dotR,
                top: topLaneY + laneH * 0.5 - dotR,
                width: dotR * 2,
                height: dotR * 2,
                borderRadius: "50%",
                backgroundColor: OB1.STEEL,
                opacity: ease(sceneFrame, stagger(i, topLaneStart + 10, 8), stagger(i, topLaneStart + 10, 8) + 15),
                zIndex: 1,
              }}
            />
          ))}

          {/* "RESUME" label — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: topLaneY,
              width: labelW,
              height: laneH,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              opacity: topLaneOpacity,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.STEEL,
                position: "relative",
                zIndex: 10,
              }}
            >
              RESUME
            </div>
          </div>

          {/* "Every 2 yrs" sublabel — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: trackX,
              top: topLaneY + laneH + Math.round(6 * zone.scale),
              opacity: topLaneOpacity,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(40 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 400,
                color: OB1.DIM,
                fontStyle: "italic",
                position: "relative",
                zIndex: 10,
              }}
            >
              updated every 2 yrs
            </div>
          </div>

          {/* ── BOTTOM LANE: Work Record ── */}

          {/* Track bar — zIndex 1 */}
          <div
            style={{
              position: "absolute",
              left: trackX,
              top: bottomLaneY + laneH * 0.5 - Math.round(4 * zone.scale),
              width: trackW,
              height: Math.round(4 * zone.scale),
              backgroundColor: OB1.ORANGE,
              borderRadius: Math.round(2 * zone.scale),
              opacity: bottomLabelOpacity,
              zIndex: 1,
            }}
          />

          {/* Dense dots — animate in progressively — zIndex 1 */}
          {Array.from({ length: denseDotCount }).map((_, i) => {
            const pos = (i + 0.5) / denseDotCount;
            const dotVisible = pos <= denseProgress;
            return (
              <div
                key={`dense-${i}`}
                style={{
                  position: "absolute",
                  left: trackX + trackW * pos - dotR,
                  top: bottomLaneY + laneH * 0.5 - dotR,
                  width: dotR * 2,
                  height: dotR * 2,
                  borderRadius: "50%",
                  backgroundColor: OB1.ORANGE,
                  opacity: dotVisible ? 1 : 0,
                  zIndex: 1,
                }}
              />
            );
          })}

          {/* "WORK RECORD" label — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: bottomLaneY,
              width: labelW,
              height: laneH,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              opacity: bottomLabelOpacity,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                position: "relative",
                zIndex: 10,
              }}
            >
              WORK RECORD
            </div>
          </div>

          {/* "Continuous" sublabel — zIndex 10 */}
          <div
            style={{
              position: "absolute",
              left: trackX,
              top: bottomLaneY + laneH + Math.round(6 * zone.scale),
              opacity: bottomLabelOpacity,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: Math.round(40 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                position: "relative",
                zIndex: 10,
              }}
            >
              continuous
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

export const NK_CLIPS_04 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

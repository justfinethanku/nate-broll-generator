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
  countUp,
  pulse,
} from "./shared";
import {
  TrendingUp,
  Cpu,
  FileCode,
  Target,
  Clock,
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
    // DESIGN SPEC for AIA-001-KarpathyMissed
    // FOCAL: Giant "11%" number with upward trending arrow, colored green (success)
    // SUPPORTING:
    //   1. Small "Before" baseline bar (gray, DIM)
    //   2. Taller "After" bar (green) showing the 11% increase
    //   3. Label "Pre-optimized" above the baseline
    // TEXT ON SCREEN:
    //   - "11%" (100px, dominant metric) — 3 chars
    //   - "Before" (48px) — 6 chars
    //   - "After" (48px) — 5 chars
    //   - "Pre-optimized" (44px, above baseline) — 13 chars
    //   Total: 27 chars ✓
    // PHASES:
    //   - 0-1s: "Before" bar fades in
    //   - 1-2.5s: "11%" counter animates from 0→11
    //   - 2.5-4s: "After" bar grows up
    //   - 4-7s: Hold with subtle pulse on the percentage
    // LOGOS: None (abstract concept)
    // ICONS: TrendingUp (lucide, 80px, integrated into the 11% display)
    // ELEMENT COUNT: 3 (percentage display, before bar, after bar) ✓
    // PHONE TEST: All text 44px+, dominant number 100px ✓
    id: "AIA-001-KarpathyMissed",
    title: "Missed Gains",
    subtitle: "Finding 11% more performance",
    bottomLabel: "Even optimized code has hidden improvements",
    bottomAccent: "11%",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const count = countUp(sceneFrame, 30, 90, 11);
      const pulseVal = pulse(sceneFrame, 0.03);

      const beforeBarHeight = ease(sceneFrame, 10, 40) * zone.height * 0.25;
      const afterBarHeight = ease(sceneFrame, 90, 130) * zone.height * 0.278; // 11% taller

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: Math.round(32 * zone.scale),
          }}
        >
          {/* Big percentage with icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              ...fadeInUp(sceneFrame, 20),
            }}
          >
            <div
              style={{
                fontSize: Math.round(100 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.GREEN,
                zIndex: 10,
                position: "relative",
                opacity: sceneFrame >= 30 ? 0.7 + pulseVal * 0.3 : 1,
              }}
            >
              {sceneFrame >= 30 ? `${Math.floor(count)}%` : ""}
            </div>
            <TrendingUp
              size={Math.round(80 * zone.scale)}
              color={OB1.GREEN}
              style={{
                opacity: ease(sceneFrame, 50, 70),
                zIndex: 1,
              }}
            />
          </div>

          {/* Label above bars */}
          <div
            style={{
              fontSize: Math.round(44 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              marginBottom: Math.round(16 * zone.scale),
              zIndex: 10,
              position: "relative",
              ...fadeInUp(sceneFrame, 5),
            }}
          >
            Pre-optimized codebase
          </div>

          {/* Bar chart comparison */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.08,
              alignItems: "flex-end",
            }}
          >
            {/* Before bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div
                style={{
                  width: zone.width * 0.18,
                  height: beforeBarHeight,
                  backgroundColor: OB1.DIM,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.WHITE,
                  opacity: ease(sceneFrame, 30, 50),
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Before
              </div>
            </div>

            {/* After bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div
                style={{
                  width: zone.width * 0.18,
                  height: afterBarHeight,
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(8 * zone.scale),
                  zIndex: 1,
                }}
              />
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
                After
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-002-OptimizingAgents
    // FOCAL: Circular flow diagram with 3 nodes: "Propose" → "Test" → "Learn" → (back to Propose)
    // SUPPORTING:
    //   1. Connecting arrows between nodes (curved paths)
    //   2. Small robot/brain icon in center (Cpu lucide icon, 64px)
    // TEXT ON SCREEN:
    //   - "Propose" (56px) — 7 chars
    //   - "Test" (56px) — 4 chars
    //   - "Learn" (56px) — 5 chars
    //   Total: 16 chars ✓
    // PHASES:
    //   - 0-1.5s: Center icon appears
    //   - 1.5-3s: "Propose" node fades in, arrow draws to "Test"
    //   - 3-4.5s: "Test" node fades in, arrow draws to "Learn"
    //   - 4.5-6s: "Learn" node fades in, arrow draws back to "Propose"
    //   - 6-7s: Subtle rotation/pulse of the entire loop
    // LOGOS: None (abstract concept)
    // ICONS: Cpu (center, 64px)
    // ELEMENT COUNT: 4 (center icon + 3 nodes) ✓
    // PHONE TEST: All text 56px ✓
    id: "AIA-002-OptimizingAgents",
    title: "Auto-Optimize",
    subtitle: "The agent improvement loop",
    bottomLabel: "Agents that improve themselves through experimentation",
    bottomAccent: "improve themselves",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const centerX = zone.width / 2;
      const centerY = zone.height / 2;
      const radius = Math.min(zone.width, zone.height) * 0.32;

      // Node positions (evenly distributed, starting at top)
      const nodes = [
        { label: "Propose", angle: -Math.PI / 2, color: OB1.CYAN, delay: 45 },
        { label: "Test", angle: Math.PI / 6, color: OB1.AMBER, delay: 90 },
        { label: "Learn", angle: (5 * Math.PI) / 6, color: OB1.GREEN, delay: 135 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            position: "relative",
          }}
        >
          {/* SVG for connecting arrows */}
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
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill={OB1.STEEL}
                />
              </marker>
            </defs>

            {/* Draw curved arrows between nodes */}
            {nodes.map((node, i) => {
              const nextNode = nodes[(i + 1) % nodes.length];
              const startX = centerX + radius * Math.cos(node.angle);
              const startY = centerY + radius * Math.sin(node.angle);
              const endX = centerX + radius * Math.cos(nextNode.angle);
              const endY = centerY + radius * Math.sin(nextNode.angle);

              // Control point for curve (slightly outside the circle)
              const midAngle = (node.angle + nextNode.angle) / 2 + (nextNode.angle < node.angle ? Math.PI : 0);
              const ctrlX = centerX + radius * 1.15 * Math.cos(midAngle);
              const ctrlY = centerY + radius * 1.15 * Math.sin(midAngle);

              const arrowDelay = nextNode.delay - 15;
              const arrowProgress = ease(sceneFrame, arrowDelay, arrowDelay + 20);

              return (
                <path
                  key={i}
                  d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                  fill="none"
                  stroke={OB1.STEEL}
                  strokeWidth={Math.round(3 * zone.scale)}
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 * (1 - arrowProgress)}
                  opacity={arrowProgress * 0.6}
                />
              );
            })}
          </svg>

          {/* Center icon */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div style={{ ...fadeInUp(sceneFrame, 10) }}>
              <Cpu
                size={Math.round(64 * zone.scale)}
                color={OB1.ORANGE}
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const x = centerX + radius * Math.cos(node.angle);
            const y = centerY + radius * Math.sin(node.angle);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    ...fadeInUp(sceneFrame, node.delay),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Node circle */}
                  <div
                    style={{
                      width: Math.round(160 * zone.scale),
                      height: Math.round(160 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: `${node.color}20`,
                      border: `${Math.round(4 * zone.scale)}px solid ${node.color}`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: Math.round(56 * zone.scale),
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: OB1.WHITE,
                        zIndex: 10,
                        position: "relative",
                      }}
                    >
                      {node.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    // DESIGN SPEC for AIA-003-WhatToExplore
    // FOCAL: Three labeled cards in a horizontal row, equal size, representing the three constraints
    // SUPPORTING: None (the three cards ARE the message)
    // TEXT ON SCREEN:
    //   - Card 1: "ONE FILE" (60px) — 8 chars
    //   - Card 2: "ONE METRIC" (60px) — 10 chars
    //   - Card 3: "FIXED TIME" (60px) — 10 chars
    //   Total: 28 chars ✓
    // PHASES:
    //   - 0-1.5s: Card 1 slides in from left
    //   - 1.5-3s: Card 2 slides in from left
    //   - 3-4.5s: Card 3 slides in from left
    //   - 4.5-7s: Hold (all three visible)
    // LOGOS: None
    // ICONS:
    //   - FileCode (card 1, 80px)
    //   - Target (card 2, 80px)
    //   - Clock (card 3, 80px)
    // ELEMENT COUNT: 3 cards ✓
    // PHONE TEST: All text 60px, all icons 80px ✓
    id: "AIA-003-WhatToExplore",
    title: "Three Constraints",
    subtitle: "The Karpathy loop",
    bottomLabel: "Narrowing the search space makes agents effective",
    bottomAccent: "search space",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const cards = [
        { label: "ONE FILE", icon: FileCode, color: OB1.CYAN, delay: 10 },
        { label: "ONE METRIC", icon: Target, color: OB1.AMBER, delay: 45 },
        { label: "FIXED TIME", icon: Clock, color: OB1.PURPLE, delay: 80 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: zone.width * 0.04,
          }}
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                style={{
                  ...slideIn(sceneFrame, card.delay, 30, "left", 80),
                }}
              >
                <div
                  style={{
                    width: zone.width * 0.28,
                    minHeight: Math.round(280 * zone.scale),
                    backgroundColor: `${card.color}15`,
                    border: `${Math.round(3 * zone.scale)}px solid ${card.color}`,
                    borderRadius: Math.round(16 * zone.scale),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: Math.round(24 * zone.scale),
                    padding: Math.round(24 * zone.scale),
                    zIndex: 1,
                  }}
                >
                  <Icon
                    size={Math.round(80 * zone.scale)}
                    color={card.color}
                    strokeWidth={2.5}
                    style={{ zIndex: 1 }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(60 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: OB1.WHITE,
                      textAlign: "center",
                      lineHeight: 1.1,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {card.label}
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

export const AIA_CLIPS_A = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

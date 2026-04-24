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
  Search,
  Database,
  Zap,
  FileText,
  AlertTriangle,
  Bot,
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
    // DESIGN SPEC for TW-019-Queries
    // FOCAL: Search bar with magnifying glass + structured query "meetings + pricing + Q1"
    // SUPPORTING (3): Three result cards with metadata badges
    // TEXT ON SCREEN:
    //   - "meetings + pricing + Q1" (48px in search bar) — 22 chars
    //   - "Budget Review", "Pricing Strategy", "Q1 Planning" (40px each) — ~45 chars
    //   Total visible: 67 chars ✓
    // PHASES:
    //   - 0-1s: Search bar fades in
    //   - 1-2.5s: Query text types in
    //   - 2.5-5s: Result cards stagger in
    //   - 5-7s: Hold with pulse
    // ELEMENT COUNT: 1 search + 3 cards = 4 ✓
    // PHONE TEST: All text ≥40px ✓
    id: "TW-019-Queries",
    title: "Structured Queries",
    subtitle: "Search with precision",
    bottomLabel: "Query across meetings, topics, and time periods with structured search",
    bottomAccent: "structured search",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const queryText = "meetings + pricing + Q1";
      const revealChars = Math.floor(ease(sceneFrame, 30, 75) * queryText.length);
      const visibleQuery = queryText.slice(0, revealChars);

      const results = [
        { title: "Budget Review", color: OB1.ORANGE, delay: 75 },
        { title: "Pricing Strategy", color: OB1.CYAN, delay: 90 },
        { title: "Q1 Planning", color: OB1.PURPLE, delay: 105 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.height * 0.08,
          }}
        >
          {/* Search bar */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              alignItems: "center",
              gap: zone.width * 0.03,
              backgroundColor: OB1.BG_MID,
              padding: `${Math.round(20 * zone.scale)}px ${Math.round(32 * zone.scale)}px`,
              borderRadius: Math.round(12 * zone.scale),
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.STEEL}`,
              width: zone.width * 0.7,
            }}
          >
            <Search
              size={Math.round(40 * zone.scale)}
              color={OB1.STEEL}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                fontSize: Math.round(48 * zone.scale),
                fontFamily: FONTS.mono,
                fontWeight: 500,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              {visibleQuery}
            </div>
          </div>

          {/* Result cards */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.04,
              alignItems: "center",
            }}
          >
            {results.map((result, i) => {
              const cardOpacity = ease(sceneFrame, result.delay, result.delay + 20);
              const cardY = (1 - ease(sceneFrame, result.delay, result.delay + 20)) * 30;
              const pulseVal = pulse(sceneFrame - result.delay - 20, 0.04);

              return (
                <div
                  key={i}
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${cardY}px)`,
                    backgroundColor: OB1.BG_MID,
                    border: `${Math.round(3 * zone.scale)}px solid ${result.color}`,
                    borderRadius: Math.round(8 * zone.scale),
                    padding: `${Math.round(24 * zone.scale)}px ${Math.round(32 * zone.scale)}px`,
                    minWidth: zone.width * 0.18,
                    boxShadow: `0 0 ${Math.round((20 + pulseVal * 10) * zone.scale)}px ${result.color}40`,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      textAlign: "center",
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {result.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-020-Volume
    // FOCAL: Large animated counter showing 5,247 entries
    // SUPPORTING (2): Two metadata badges (Database icon + "Metadata Rich", Zap icon + "Fast Retrieval")
    // TEXT ON SCREEN:
    //   - "5,247" (96px counter) — 5 chars
    //   - "ENTRIES" (60px label) — 7 chars
    //   - "Metadata Rich" (40px) — 13 chars
    //   - "Fast Retrieval" (40px) — 14 chars
    //   Total visible: 39 chars ✓
    // PHASES:
    //   - 0-1.5s: Counter container fades in
    //   - 1.5-4s: Counter animates 0→5247
    //   - 4-5.5s: Left badge fades in
    //   - 5.5-7s: Right badge fades in
    // ELEMENT COUNT: 1 counter + 2 badges = 3 ✓
    // PHONE TEST: Counter 96px, labels 60px/40px ✓
    id: "TW-020-Volume",
    title: "Handle Volume",
    subtitle: "Thousands of entries",
    bottomLabel: "OpenBrain scales to thousands of entries with rich metadata",
    bottomAccent: "thousands of entries",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const count = countUp(sceneFrame, 45, 120, 5247);
      const pulseVal = pulse(sceneFrame - 120, 0.03);

      const badges = [
        { icon: Database, label: "Metadata Rich", color: OB1.CYAN, delay: 120 },
        { icon: Zap, label: "Fast Retrieval", color: OB1.ORANGE, delay: 165 },
      ];

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.height * 0.1,
          }}
        >
          {/* Counter */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: zone.height * 0.02,
            }}
          >
            <div
              style={{
                fontSize: Math.round(96 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                letterSpacing: "-0.02em",
                textShadow: `0 0 ${Math.round((30 + pulseVal * 10) * zone.scale)}px ${OB1.ORANGE}80`,
                zIndex: 10,
                position: "relative",
              }}
            >
              {Math.floor(count).toLocaleString()}
            </div>
            <div
              style={{
                fontSize: Math.round(60 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.STEEL,
                letterSpacing: "0.1em",
                zIndex: 10,
                position: "relative",
              }}
            >
              ENTRIES
            </div>
          </div>

          {/* Metadata badges */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.08,
              alignItems: "center",
            }}
          >
            {badges.map((badge, i) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={i}
                  style={{
                    ...fadeInUp(sceneFrame, badge.delay),
                    display: "flex",
                    alignItems: "center",
                    gap: zone.width * 0.02,
                    backgroundColor: OB1.BG_MID,
                    padding: `${Math.round(16 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                    borderRadius: Math.round(8 * zone.scale),
                    border: `${Math.round(2 * zone.scale)}px solid ${badge.color}`,
                  }}
                >
                  <BadgeIcon
                    size={Math.round(48 * zone.scale)}
                    color={badge.color}
                    style={{ zIndex: 1 }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {badge.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for TW-021-Conflict
    // FOCAL: Central wiki page icon with conflict warning (AlertTriangle)
    // SUPPORTING (3): Three agent avatars (colored circles with Bot icons) at 120° intervals around center
    // TEXT ON SCREEN:
    //   - "WIKI PAGE" (60px center label) — 9 chars
    //   - "Agent A", "Agent B", "Agent C" (40px each) — 21 chars
    //   - "CONFLICT" (48px warning) — 8 chars
    //   Total visible: 38 chars ✓
    // PHASES:
    //   - 0-1s: Wiki page fades in
    //   - 1-2.5s: Agents pop in (staggered 0.5s apart)
    //   - 2.5-4s: Connection lines draw
    //   - 4-5s: Conflict warning appears
    //   - 5-7s: Pulse on conflict
    // ELEMENT COUNT: 1 wiki + 3 agents = 4 ✓
    // PHONE TEST: All text ≥40px ✓
    // FIX: Increased radius 0.28→0.38, moved WIKI PAGE label ABOVE icon
    id: "TW-021-Conflict",
    title: "Race Conditions",
    subtitle: "Multi-agent conflicts",
    bottomLabel: "Different agents updating the same wiki page simultaneously creates conflicts",
    bottomAccent: "conflicts",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const agents = [
        { label: "Agent A", color: OB1.CYAN, angle: -90, delay: 30 },
        { label: "Agent B", color: OB1.ORANGE, angle: 150, delay: 45 },
        { label: "Agent C", color: OB1.PURPLE, angle: 30, delay: 60 },
      ];

      const radius = Math.min(zone.width, zone.height) * 0.38;
      const centerX = zone.width / 2;
      const centerY = zone.height / 2;

      const pulseVal = pulse(sceneFrame - 120, 0.05);

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
          {/* Connection lines */}
          <svg
            width={zone.width}
            height={zone.height}
            style={{ position: "absolute", zIndex: 0 }}
          >
            {agents.map((agent, i) => {
              const angleRad = (agent.angle * Math.PI) / 180;
              const x = centerX + Math.cos(angleRad) * radius;
              const y = centerY + Math.sin(angleRad) * radius;
              const lineProgress = ease(sceneFrame, 75 + i * 5, 95 + i * 5);

              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={centerX + (x - centerX) * lineProgress}
                  y2={centerY + (y - centerY) * lineProgress}
                  stroke={agent.color}
                  strokeWidth={Math.round(3 * zone.scale)}
                  strokeDasharray={`${Math.round(8 * zone.scale)} ${Math.round(4 * zone.scale)}`}
                  opacity={0.6}
                />
              );
            })}
          </svg>

          {/* Central wiki page */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 0),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: zone.height * 0.02,
              }}
            >
              {/* Label ABOVE icon */}
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
                WIKI PAGE
              </div>
              {/* Icon below label */}
              <div
                style={{
                  width: Math.round(140 * zone.scale),
                  height: Math.round(140 * zone.scale),
                  borderRadius: "50%",
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <FileText
                  size={Math.round(70 * zone.scale)}
                  color={OB1.WHITE}
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Agent nodes */}
          {agents.map((agent, i) => {
            const angleRad = (agent.angle * Math.PI) / 180;
            const x = centerX + Math.cos(angleRad) * radius;
            const y = centerY + Math.sin(angleRad) * radius;

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
                    ...bouncePop(sceneFrame, agent.delay, fps),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: zone.height * 0.015,
                  }}
                >
                  <div
                    style={{
                      width: Math.round(100 * zone.scale),
                      height: Math.round(100 * zone.scale),
                      borderRadius: "50%",
                      backgroundColor: agent.color,
                      border: `${Math.round(3 * zone.scale)}px solid ${OB1.BG_DARK}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Bot
                      size={Math.round(56 * zone.scale)}
                      color={OB1.BG_DARK}
                      style={{ zIndex: 1 }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      zIndex: 10,
                      position: "relative",
                    }}
                  >
                    {agent.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Conflict warning */}
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY + radius * 1.3,
              transform: "translate(-50%, 0)",
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 120),
                display: "flex",
                alignItems: "center",
                gap: zone.width * 0.02,
                backgroundColor: OB1.RED,
                padding: `${Math.round(12 * zone.scale)}px ${Math.round(24 * zone.scale)}px`,
                borderRadius: Math.round(8 * zone.scale),
                boxShadow: `0 0 ${Math.round((20 + pulseVal * 15) * zone.scale)}px ${OB1.RED}80`,
              }}
            >
              <AlertTriangle
                size={Math.round(40 * zone.scale)}
                color={OB1.WHITE}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.WHITE,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                CONFLICT
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

export const TW_CLIPS_07 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

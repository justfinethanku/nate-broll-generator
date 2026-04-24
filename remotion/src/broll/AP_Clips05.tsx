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
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
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
    // DESIGN SPEC for AP-013-FriendsHouse (ITERATION 4 — fix root div sizing)
    // FOCAL: Two vertical paths side-by-side. GPS (cyan, straight) vs Local Shortcut (orange, winding)
    // SUPPORTING: Start/end markers, path labels
    // TEXT: "GPS Route" (52px), "Local Shortcut" (52px), "Delegatable" (42px), "Tacit" (42px) = 39 chars ✓
    // ELEMENT COUNT: 2 paths + 2 marker pairs = 4 groups ✓
    // PHONE TEST: All text ≥42px ✓
    id: "AP-013-FriendsHouse",
    title: "Expertise Paradox",
    subtitle: "Tacit knowledge is powerful but hard to share",
    bottomLabel: "Tacit vs. Explicit Knowledge",
    bottomAccent: "Tacit",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const pathHeight = zone.height * 0.45;
      const gpsProgress = ease(sceneFrame, 45, 90);
      const shortcutProgress = ease(sceneFrame, 90, 150);

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: Math.round(100 * zone.scale),
          }}
        >
          {/* GPS Route Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            {/* Label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 150),
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(52 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.CYAN,
                  marginBottom: Math.round(4 * zone.scale),
                  position: "relative",
                  zIndex: 10,
                }}
              >
                GPS Route
              </div>
              <div
                style={{
                  fontSize: Math.round(42 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.DIM,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Delegatable
              </div>
            </div>

            {/* Start marker */}
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <MapPin
                size={Math.round(56 * zone.scale)}
                color={OB1.GREEN}
                fill={OB1.GREEN}
              />
            </div>

            {/* Straight path */}
            <div
              style={{
                width: Math.round(4 * zone.scale),
                height: pathHeight * gpsProgress,
                background: `repeating-linear-gradient(
                  to bottom,
                  ${OB1.CYAN} 0,
                  ${OB1.CYAN} ${Math.round(8 * zone.scale)}px,
                  transparent ${Math.round(8 * zone.scale)}px,
                  transparent ${Math.round(16 * zone.scale)}px
                )`,
                opacity: ease(sceneFrame, 45, 60),
              }}
            />

            {/* End marker */}
            <div style={{ ...bouncePop(sceneFrame, 20, fps) }}>
              <MapPin
                size={Math.round(56 * zone.scale)}
                color={OB1.PURPLE}
                fill={OB1.PURPLE}
              />
            </div>
          </div>

          {/* Local Shortcut Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
            }}
          >
            {/* Label */}
            <div
              style={{
                ...fadeInUp(sceneFrame, 160),
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(52 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.ORANGE,
                  marginBottom: Math.round(4 * zone.scale),
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Local Shortcut
              </div>
              <div
                style={{
                  fontSize: Math.round(42 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 500,
                  color: OB1.DIM,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Tacit
              </div>
            </div>

            {/* Start marker */}
            <div style={{ ...bouncePop(sceneFrame, 10, fps) }}>
              <MapPin
                size={Math.round(56 * zone.scale)}
                color={OB1.GREEN}
                fill={OB1.GREEN}
              />
            </div>

            {/* Winding path SVG */}
            <svg
              width={Math.round(180 * zone.scale)}
              height={pathHeight}
              style={{ zIndex: 0 }}
            >
              <path
                d={`M ${90 * zone.scale} 0
                    Q ${30 * zone.scale} ${pathHeight * 0.25}, ${90 * zone.scale} ${pathHeight * 0.42}
                    Q ${150 * zone.scale} ${pathHeight * 0.58}, ${90 * zone.scale} ${pathHeight * shortcutProgress}`}
                stroke={OB1.ORANGE}
                strokeWidth={Math.round(5 * zone.scale)}
                fill="none"
                opacity={ease(sceneFrame, 90, 105)}
              />
            </svg>

            {/* End marker */}
            <div style={{ ...bouncePop(sceneFrame, 20, fps) }}>
              <MapPin
                size={Math.round(56 * zone.scale)}
                color={OB1.PURPLE}
                fill={OB1.PURPLE}
              />
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-014-DescribeCalendar (ITERATION 4)
    // FOCAL: Before (frustrating loop) vs After (smooth automation)
    // TEXT: "Before" (52px), "After" (52px), "Confirm?" x3 (42px), "Write Rules" (48px) = 46 chars ✓
    // ELEMENT COUNT: 2 workflow states + arrow = 3 groups ✓
    // PHONE TEST: All text ≥42px ✓
    id: "AP-014-DescribeCalendar",
    title: "Personal Incentive",
    subtitle: "Documentation finally becomes worth it",
    bottomLabel: "The First Personal Incentive",
    bottomAccent: "Personal",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: Math.round(60 * zone.scale),
          }}
        >
          {/* BEFORE section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: Math.round(220 * zone.scale),
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 10),
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.RED,
                marginBottom: Math.round(16 * zone.scale),
                position: "relative",
                zIndex: 10,
              }}
            >
              Before
            </div>

            <div
              style={{
                ...bouncePop(sceneFrame, 20, fps),
                marginBottom: Math.round(12 * zone.scale),
              }}
            >
              <AlertCircle
                size={Math.round(72 * zone.scale)}
                color={OB1.AMBER}
              />
            </div>

            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...fadeInUp(sceneFrame, 60 + i * 20),
                  padding: Math.round(10 * zone.scale),
                  backgroundColor: `${OB1.BG_MID}dd`,
                  border: `2px solid ${OB1.AMBER}`,
                  borderRadius: Math.round(6 * zone.scale),
                  marginBottom: Math.round(6 * zone.scale),
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: Math.round(42 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 600,
                    color: OB1.WHITE,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  Confirm?
                </div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 120),
              fontSize: Math.round(64 * zone.scale),
              color: OB1.STEEL,
              position: "relative",
              zIndex: 10,
            }}
          >
            →
          </div>

          {/* AFTER section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: Math.round(220 * zone.scale),
            }}
          >
            <div
              style={{
                ...fadeInUp(sceneFrame, 150),
                fontSize: Math.round(52 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.GREEN,
                marginBottom: Math.round(16 * zone.scale),
                position: "relative",
                zIndex: 10,
              }}
            >
              After
            </div>

            <div
              style={{
                ...fadeInUp(sceneFrame, 160),
                padding: Math.round(14 * zone.scale),
                backgroundColor: `${OB1.BG_MID}dd`,
                border: `2px solid ${OB1.CYAN}`,
                borderRadius: Math.round(6 * zone.scale),
                marginBottom: Math.round(12 * zone.scale),
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.CYAN,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Write Rules
              </div>
            </div>

            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  ...bouncePop(sceneFrame, 180 + i * 15, fps),
                  marginBottom: Math.round(6 * zone.scale),
                }}
              >
                <CheckCircle2
                  size={Math.round(60 * zone.scale)}
                  color={OB1.GREEN}
                />
              </div>
            ))}
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for AP-015-DeploysFaster (ITERATION 4)
    // FOCAL: 4-bar chart showing exponential deployment time reduction
    // TEXT: Agent labels (40px, 4x), Time labels (42px, 4x), Y-axis (48px) = 58 chars ✓
    // ELEMENT COUNT: 1 chart (4 bars) + axis labels + curve = 3 groups ✓
    // PHONE TEST: All text ≥40px ✓
    id: "AP-015-DeploysFaster",
    title: "Compounding Knowledge",
    subtitle: "Each agent makes the next one easier",
    bottomLabel: "Compounding Returns",
    bottomAccent: "Compounding",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const bars = [
        { label: "Agent 1", time: "Weeks", height: 1.0, color: OB1.AMBER, delay: 30 },
        { label: "Agent 2", time: "Days", height: 0.6, color: OB1.ORANGE, delay: 75 },
        { label: "Agent 5", time: "Hours", height: 0.25, color: OB1.CYAN, delay: 120 },
        { label: "Agent 10", time: "Min", height: 0.08, color: OB1.PURPLE, delay: 165 },
      ];

      const chartHeight = zone.height * 0.5;
      const barWidth = Math.round(120 * zone.scale);
      const barGap = Math.round(32 * zone.scale);

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Y-axis label */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 15),
              position: "absolute",
              left: Math.round(10 * zone.scale),
              top: "50%",
              fontSize: Math.round(48 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 600,
              color: OB1.STEEL,
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            Deploy Time
          </div>

          {/* Bars container */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: barGap,
              height: chartHeight,
              borderLeft: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
              borderBottom: `${Math.round(2 * zone.scale)}px solid ${OB1.DIM}`,
              paddingLeft: Math.round(12 * zone.scale),
              paddingBottom: Math.round(12 * zone.scale),
              position: "relative",
            }}
          >
            {bars.map((bar, i) => {
              const barHeight = chartHeight * bar.height * ease(sceneFrame, bar.delay, bar.delay + 30);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: chartHeight,
                  }}
                >
                  {/* Time label above bar */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, bar.delay + 20),
                      fontSize: Math.round(42 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: bar.color,
                      marginBottom: Math.round(6 * zone.scale),
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {bar.time}
                  </div>

                  {/* Bar */}
                  <div
                    style={{
                      width: barWidth,
                      height: barHeight,
                      backgroundColor: bar.color,
                      borderRadius: `${Math.round(4 * zone.scale)}px ${Math.round(4 * zone.scale)}px 0 0`,
                      marginBottom: Math.round(6 * zone.scale),
                      zIndex: 1,
                    }}
                  />

                  {/* Agent label below bar */}
                  <div
                    style={{
                      ...fadeInUp(sceneFrame, bar.delay + 10),
                      fontSize: Math.round(40 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    {bar.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decay curve overlay */}
          {sceneFrame > 165 && (
            <svg
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
                opacity: ease(sceneFrame, 165, 185),
                pointerEvents: "none",
              }}
            >
              <path
                d={`M ${zone.width * 0.35} ${zone.height * 0.3}
                    Q ${zone.width * 0.45} ${zone.height * 0.38},
                      ${zone.width * 0.55} ${zone.height * 0.5}
                    T ${zone.width * 0.65} ${zone.height * 0.65}`}
                stroke={OB1.GREEN}
                strokeWidth={Math.round(3 * zone.scale)}
                strokeDasharray="6,6"
                fill="none"
              />
            </svg>
          )}
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

export const AP_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

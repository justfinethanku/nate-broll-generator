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
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  Database,
  Brain,
  Sparkles,
  TrendingUp,
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
    // DESIGN SPEC for WM-013-usToNumber
    // FOCAL: Large question mark icon (center) with a team icon below it at 120px
    // SUPPORTING (3):
    //   - Green checkmark + "Honest Feedback" label (left, 80px icon + 48px text)
    //   - Red X + "Hide Problems" label (right, 80px icon + 48px text)
    //   - Arrow pointing from center to green side (indicates correct path)
    // TEXT ON SCREEN:
    //   - "TEAM READINESS" (60px, top) — 14 chars
    //   - "Honest Feedback" (48px) — 15 chars
    //   - "Hide Problems" (48px) — 13 chars
    //   Total visible: 42 chars ✓
    // PHASES:
    //   - 0-1.5s: Center question mark + team icon fade in
    //   - 1.5-3s: Left (green) and right (red) options appear
    //   - 3-4.5s: Arrow draws from center to green side
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 3 groups (question, green path, red path) ✓
    // PHONE TEST: All text 48-60px, icons 80-120px ✓
    id: "WM-013-usToNumber",
    title: "Team Readiness",
    subtitle: "Cultural prerequisite",
    bottomLabel: "Can your team be honest about failures with the model?",
    bottomAccent: "honest about failures",
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
          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            TEAM READINESS
          </div>

          {/* Center group: question + team */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              marginBottom: zone.height * 0.12,
              zIndex: 1,
            }}
          >
            <Users
              size={Math.round(120 * zone.scale)}
              color={OB1.WHITE}
              strokeWidth={2}
            />
          </div>

          {/* Options row */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.2,
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Green: Honest Feedback */}
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "left"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <CheckCircle2
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Honest Feedback
              </div>
            </div>

            {/* Arrow from center to green */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: zone.width * 0.15,
                height: Math.round(4 * zone.scale),
                backgroundColor: OB1.GREEN,
                opacity: ease(sceneFrame, 90, 120),
                transformOrigin: "right center",
                zIndex: 0,
              }}
            />
            <ArrowRight
              size={Math.round(48 * zone.scale)}
              color={OB1.GREEN}
              strokeWidth={3}
              style={{
                position: "absolute",
                left: "35%",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: ease(sceneFrame, 90, 120),
                zIndex: 0,
              }}
            />

            {/* Red: Hide Problems */}
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "right"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <XCircle
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.RED,
                  opacity: 0.6,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Hide Problems
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-014-soWhatDoes
    // FOCAL: Building icon (140px) at center with "100 people" counter above it
    // SUPPORTING (2):
    //   - "Senior Team" label + Users icon group (left, 64px icons, 48px text)
    //   - Architecture diagram node (right, 120px box with layers icon)
    // TEXT ON SCREEN:
    //   - "100" (80px counter) — 3 chars
    //   - "PEOPLE" (48px label) — 6 chars
    //   - "Senior Team" (48px) — 11 chars
    //   - "Architecture" (48px) — 12 chars
    //   Total visible: 32 chars ✓
    // PHASES:
    //   - 0-1.5s: Building icon + counter fade in
    //   - 1.5-3s: Senior team group appears (left)
    //   - 3-4.5s: Architecture node appears (right)
    //   - 4.5-7s: Hold
    // ELEMENT COUNT: 3 (building/count, team, architecture) ✓
    // PHONE TEST: Counter 80px, labels 48px, icons 64-140px ✓
    id: "WM-014-soWhatDoes",
    title: "Implementation",
    subtitle: "Company scale example",
    bottomLabel: "100-person company with strong leadership chooses architecture",
    bottomAccent: "100-person company",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const count = countUp(sceneFrame, 10, 60, 100);

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
          {/* Center: Building + counter */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              marginBottom: zone.height * 0.1,
            }}
          >
            <div
              style={{
                fontSize: Math.round(80 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
              }}
            >
              {Math.floor(count)}
            </div>
            <Building2
              size={Math.round(140 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
              style={{ zIndex: 1 }}
            />
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
              PEOPLE
            </div>
          </div>

          {/* Bottom row: Senior Team + Architecture */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.25,
              alignItems: "center",
            }}
          >
            {/* Left: Senior Team */}
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "left"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <Users
                size={Math.round(64 * zone.scale)}
                color={OB1.STEEL}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.STEEL,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Senior Team
              </div>
            </div>

            {/* Right: Architecture */}
            <div
              style={{
                ...slideIn(sceneFrame, 90, 20, "right"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <div
                style={{
                  width: Math.round(120 * zone.scale),
                  height: Math.round(120 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.GREEN}`,
                  borderRadius: Math.round(8 * zone.scale),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Database
                  size={Math.round(64 * zone.scale)}
                  color={OB1.GREEN}
                  strokeWidth={2}
                />
              </div>
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.GREEN,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Architecture
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-015-ofOurData
    // FOCAL: Two side-by-side data type boxes (240w × 200h each)
    // SUPPORTING: None (2 elements only — clean comparison)
    // TEXT ON SCREEN:
    //   - "FACTUAL" (60px) — 7 chars
    //   - "Encode" (48px) — 6 chars
    //   - "INTERPRETIVE" (60px) — 12 chars
    //   - "Human Judgment" (48px) — 14 chars
    //   Total visible: 39 chars ✓
    // PHASES:
    //   - 0-2s: Left box (Factual/Encode) fades in
    //   - 2-4s: Right box (Interpretive/Human) fades in
    //   - 4-7s: Hold with subtle pulse on icons
    // ELEMENT COUNT: 2 (two data type cards) ✓
    // PHONE TEST: Titles 60px, labels 48px, icons 64px ✓
    id: "WM-015-ofOurData",
    title: "Data Classification",
    subtitle: "What to encode vs interpret",
    bottomLabel: "Factual data encodes; interpretive data requires human judgment",
    bottomAccent: "human judgment",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const dataTypes = [
        {
          label: "FACTUAL",
          sublabel: "Encode",
          icon: Database,
          color: OB1.CYAN,
          delay: 0,
        },
        {
          label: "INTERPRETIVE",
          sublabel: "Human Judgment",
          icon: Brain,
          color: OB1.PURPLE,
          delay: 60,
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
            gap: zone.width * 0.06,
          }}
        >
          {dataTypes.map((type, i) => {
            const Icon = type.icon;
            const opacity = ease(sceneFrame, type.delay, type.delay + 40);
            const pulseVal = pulse(sceneFrame - type.delay, 0.03);

            return (
              <div
                key={i}
                style={{
                  width: Math.round(460 * zone.scale),
                  height: Math.round(340 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  border: `${Math.round(3 * zone.scale)}px solid ${type.color}`,
                  borderRadius: Math.round(12 * zone.scale),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(20 * zone.scale),
                  padding: Math.round(24 * zone.scale),
                  boxSizing: "border-box",
                  opacity,
                  zIndex: 1,
                }}
              >
                <Icon
                  size={Math.round(72 * zone.scale)}
                  color={type.color}
                  strokeWidth={2.5}
                  style={{
                    opacity: 0.7 + pulseVal * 0.3,
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    fontSize: Math.round(52 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    color: type.color,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {type.label}
                </div>
                <div
                  style={{
                    fontSize: Math.round(48 * zone.scale),
                    fontFamily: FONTS.heading,
                    fontWeight: 500,
                    color: OB1.WHITE,
                    opacity: 0.8,
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {type.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for WM-016-throughWhereThe
    // FOCAL: Brain icon with sparkles (center, 140px) representing world model
    // SUPPORTING (2):
    //   - Green checkmark + "Automate Complexity" (left, 80px icon, 48px text)
    //   - Red X + "Strategic Decisions" (right, 80px icon, 48px text)
    // TEXT ON SCREEN:
    //   - "WORLD MODEL" (60px, top) — 11 chars
    //   - "Automate Complexity" (48px) — 19 chars
    //   - "Strategic Decisions" (48px) — 19 chars
    //   Total visible: 49 chars ✓
    // PHASES:
    //   - 0-1.5s: Center brain icon fades in with sparkle
    //   - 1.5-3s: Left (green/automate) appears
    //   - 3-4.5s: Right (red/strategic) appears
    //   - 4.5-7s: Hold with pulse on brain
    // ELEMENT COUNT: 3 (brain, automate zone, strategic zone) ✓
    // PHONE TEST: Title 60px, labels 48px, icons 80-140px ✓
    id: "WM-016-throughWhereThe",
    title: "Strategic Thinking",
    subtitle: "Where models help",
    bottomLabel: "World models automate complexity, not strategic decisions",
    bottomAccent: "automate complexity",
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
          {/* Title */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 0),
              fontSize: Math.round(60 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.ORANGE,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            WORLD MODEL
          </div>

          {/* Center: Brain + sparkle */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              position: "relative",
              marginBottom: zone.height * 0.12,
            }}
          >
            <Brain
              size={Math.round(140 * zone.scale)}
              color={OB1.CYAN}
              strokeWidth={2}
              style={{
                opacity: 0.8 + pulse(sceneFrame, 0.03) * 0.2,
                zIndex: 1,
              }}
            />
            <Sparkles
              size={Math.round(48 * zone.scale)}
              color={OB1.AMBER}
              strokeWidth={2.5}
              style={{
                position: "absolute",
                top: Math.round(-12 * zone.scale),
                right: Math.round(-12 * zone.scale),
                opacity: ease(sceneFrame, 20, 40),
                zIndex: 1,
              }}
            />
          </div>

          {/* Options row */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.2,
              alignItems: "center",
            }}
          >
            {/* Green: Automate */}
            <div
              style={{
                ...slideIn(sceneFrame, 45, 20, "left"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <CheckCircle2
                size={Math.round(80 * zone.scale)}
                color={OB1.GREEN}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.GREEN,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Automate Complexity
              </div>
            </div>

            {/* Red: Strategic */}
            <div
              style={{
                ...slideIn(sceneFrame, 90, 20, "right"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.round(12 * zone.scale),
              }}
            >
              <XCircle
                size={Math.round(80 * zone.scale)}
                color={OB1.RED}
                strokeWidth={2.5}
                style={{ zIndex: 1 }}
              />
              <div
                style={{
                  fontSize: Math.round(48 * zone.scale),
                  fontFamily: FONTS.heading,
                  fontWeight: 600,
                  color: OB1.RED,
                  opacity: 0.6,
                  textAlign: "center",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                Strategic Decisions
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

export const WM_CLIPS_05 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

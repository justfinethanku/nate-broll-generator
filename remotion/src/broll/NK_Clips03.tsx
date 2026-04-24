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
  Radio,
  TrendingUp,
  TrendingDown,
  FileCode,
  FileText,
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
    // DESIGN SPEC for NK-007-HarderNow
    // FOCAL: Two stacked horizontal rows — top row labeled "AUTHENTIC SIGNAL" with a single strong
    //        waveform pulse (green); bottom row labeled "AI NOISE" with many chaotic small pulses (red/amber)
    // SUPPORTING (1): A vertical divider line between the two rows with a "vs." label at center
    // TEXT ON SCREEN:
    //   - "AUTHENTIC SIGNAL" (60px) — 16 chars
    //   - "AI NOISE" (60px) — 8 chars
    //   - "vs." (48px, center divider) — 3 chars
    //   Total visible: 27 chars (well under 90) ✓
    // PHASES:
    //   - 0–1.5s: "AUTHENTIC SIGNAL" row fades in + signal pulse draws left-to-right
    //   - 1.5–2.5s: "vs." appears at center divider
    //   - 2.5–4.5s: "AI NOISE" row fades in + chaotic noise pulses stagger in
    //   - 4.5–7s: Hold — pulse animation breathes on the noise band
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 3 (signal row, divider label, noise row) ✓
    // PHONE TEST: All text ≥60px, waveforms fill width ✓
    // VERTICAL BUDGET:
    //   Signal label: 60px
    //   Gap: 16px
    //   Signal waveform band: 100px
    //   Divider + vs: 56px
    //   Noise waveform band: 100px
    //   Gap: 16px
    //   Noise label: 60px
    //   Total: ~408px (under ~520px zone height at 1080p) ✓

    id: "NK-007-HarderNow",
    title: "Self-Assessment",
    subtitle: "Harder than ever",
    bottomLabel: "Generative AI buries authentic signal in noise",
    bottomAccent: "authentic signal",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const signalFade = ease(sceneFrame, 0, 20);
      const dividerFade = ease(sceneFrame, 35, 50);
      const noiseFade = ease(sceneFrame, 55, 75);

      // Waveform band dimensions
      const bandW = zone.width * 0.88;
      const bandH = Math.round(96 * zone.scale);
      const bandX = (zone.width - bandW) / 2;

      // Signal waveform: a clean single Gaussian-like pulse, drawn via SVG path
      const signalProgress = ease(sceneFrame, 5, 45);
      const signalPoints: string[] = [];
      const numPts = 80;
      for (let i = 0; i <= numPts; i++) {
        const t = i / numPts;
        if (t > signalProgress) break;
        const x = bandX + t * bandW;
        // Gaussian centered at 0.5, amplitude ~bandH * 0.8
        const gaussian = Math.exp(-Math.pow((t - 0.5) * 5, 2));
        const y = bandH / 2 - gaussian * bandH * 0.8;
        signalPoints.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
      }
      if (signalPoints.length === 0) signalPoints.push(`M${bandX},${bandH / 2}`);
      const signalPath = signalPoints.join(" ");

      // Noise waveform: many small random-ish pulses, staggered
      const noiseProgress = ease(sceneFrame, 60, 100);
      const noisePoints: string[] = [];
      const noisePts = 120;
      const pulseMod = pulse(sceneFrame, 0.08);
      for (let i = 0; i <= noisePts; i++) {
        const t = i / noisePts;
        if (t > noiseProgress) break;
        const x = bandX + t * bandW;
        // Chaotic: sum of several sine waves at different frequencies
        const chaos =
          Math.sin(t * 60) * 0.35 +
          Math.sin(t * 23 + 1.2) * 0.25 +
          Math.sin(t * 97 + 2.5) * 0.2 +
          Math.sin(t * 41 + 0.7) * 0.2;
        const amp = bandH * 0.38 * (0.85 + pulseMod * 0.15);
        const y = bandH / 2 + chaos * amp;
        noisePoints.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
      }
      if (noisePoints.length === 0) noisePoints.push(`M${bandX},${bandH / 2}`);
      const noisePath = noisePoints.join(" ");

      const labelSize = Math.round(60 * zone.scale);
      const vsSize = Math.round(48 * zone.scale);
      const gap = Math.round(16 * zone.scale);
      const dividerH = Math.round(48 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: gap,
          }}
        >
          {/* SIGNAL LABEL */}
          <div
            style={{
              opacity: signalFade,
              fontSize: labelSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.GREEN,
              letterSpacing: "0.06em",
              zIndex: 10,
              position: "relative",
            }}
          >
            AUTHENTIC SIGNAL
          </div>

          {/* SIGNAL WAVEFORM BAND */}
          <div style={{ opacity: signalFade, position: "relative", zIndex: 0 }}>
            <svg width={zone.width} height={bandH}>
              {/* Baseline */}
              <line
                x1={bandX}
                y1={bandH / 2}
                x2={bandX + bandW}
                y2={bandH / 2}
                stroke={OB1.DIM}
                strokeWidth={Math.round(1.5 * zone.scale)}
                strokeOpacity={0.5}
              />
              {/* Signal pulse */}
              <path
                d={signalPath}
                fill="none"
                stroke={OB1.GREEN}
                strokeWidth={Math.round(3.5 * zone.scale)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* DIVIDER + VS */}
          <div
            style={{
              opacity: dividerFade,
              height: dividerH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.round(24 * zone.scale),
              position: "relative",
              zIndex: 10,
              width: bandW,
            }}
          >
            <div
              style={{
                flex: 1,
                height: Math.round(1.5 * zone.scale),
                background: OB1.DIM,
                opacity: 0.4,
              }}
            />
            <div
              style={{
                fontSize: vsSize,
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.STEEL,
                flexShrink: 0,
                zIndex: 10,
                position: "relative",
              }}
            >
              vs.
            </div>
            <div
              style={{
                flex: 1,
                height: Math.round(1.5 * zone.scale),
                background: OB1.DIM,
                opacity: 0.4,
              }}
            />
          </div>

          {/* NOISE WAVEFORM BAND */}
          <div style={{ opacity: noiseFade, position: "relative", zIndex: 0 }}>
            <svg width={zone.width} height={bandH}>
              {/* Baseline */}
              <line
                x1={bandX}
                y1={bandH / 2}
                x2={bandX + bandW}
                y2={bandH / 2}
                stroke={OB1.DIM}
                strokeWidth={Math.round(1.5 * zone.scale)}
                strokeOpacity={0.5}
              />
              {/* Noise waveform */}
              <path
                d={noisePath}
                fill="none"
                stroke={OB1.RED}
                strokeWidth={Math.round(2 * zone.scale)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
              />
            </svg>
          </div>

          {/* NOISE LABEL */}
          <div
            style={{
              opacity: noiseFade,
              fontSize: labelSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.RED,
              letterSpacing: "0.06em",
              zIndex: 10,
              position: "relative",
            }}
          >
            AI NOISE
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for NK-008-VolumeVsDepth
    // FOCAL: Two side-by-side vertical bar charts — left bar "VOLUME" in ORANGE (tall, rising trend arrow
    //        on top), right bar "DEPTH" in CYAN (short, declining trend arrow below)
    // SUPPORTING (1): Center gap with a faint vertical divider line
    // TEXT ON SCREEN:
    //   - "VOLUME" (60px, above left bar) — 6 chars
    //   - "DEPTH" (60px, above right bar) — 5 chars
    //   - "More" (48px, left bar sub-label) — 4 chars
    //   - "Less" (48px, right bar sub-label) — 4 chars
    //   Total visible: 19 chars (well under 90) ✓
    // PHASES:
    //   - 0–2s: Both labels appear; left bar grows tall, right bar grows short (animated height)
    //   - 2–4s: Trend arrows appear (TrendingUp on left in orange, TrendingDown on right in cyan)
    //   - 4–7s: Hold — bars pulse subtly
    // LOGOS: None (abstract concept)
    // ELEMENT COUNT: 4 (volume bar + label, depth bar + label) ✓
    // PHONE TEST: All text ≥48px, bars are thick and dominant ✓
    // VERTICAL BUDGET:
    //   Arrow icon: 64px
    //   Label: 60px
    //   Gap: 12px
    //   Bar max height: 260px
    //   Sub-label: 48px
    //   Total column: ~444px (under ~520px zone) ✓

    id: "NK-008-VolumeVsDepth",
    title: "Volume vs. Depth",
    subtitle: "The tradeoff",
    bottomLabel: "Producing more does not equal understanding more",
    bottomAccent: "not equal",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const labelFade = ease(sceneFrame, 0, 20);
      const barProgress = ease(sceneFrame, 10, 60);
      const arrowFade = ease(sceneFrame, 65, 85);

      const barMaxH = zone.height * 0.48;
      const volumeH = barProgress * barMaxH;
      const depthH = barProgress * barMaxH * 0.22;

      const barW = zone.width * 0.28;
      const gap = zone.width * 0.14;
      const iconSize = Math.round(64 * zone.scale);
      const labelSize = Math.round(60 * zone.scale);
      const subSize = Math.round(48 * zone.scale);
      const gapPx = Math.round(12 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: gap,
          }}
        >
          {/* VOLUME COLUMN */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: gapPx,
              width: barW,
            }}
          >
            {/* Trend arrow up */}
            <div
              style={{
                opacity: arrowFade,
                zIndex: 10,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp
                size={iconSize}
                color={OB1.ORANGE}
                strokeWidth={2.5}
              />
            </div>

            {/* Label */}
            <div
              style={{
                opacity: labelFade,
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.ORANGE,
                zIndex: 10,
                position: "relative",
                letterSpacing: "0.04em",
              }}
            >
              VOLUME
            </div>

            {/* Bar */}
            <div
              style={{
                width: barW,
                height: barMaxH,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                zIndex: 1,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: volumeH,
                  background: `linear-gradient(to top, ${OB1.ORANGE}, ${OB1.AMBER})`,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                }}
              />
            </div>

            {/* Sub-label */}
            <div
              style={{
                opacity: labelFade,
                fontSize: subSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              More
            </div>
          </div>

          {/* CENTER DIVIDER */}
          <div
            style={{
              width: Math.round(1.5 * zone.scale),
              height: zone.height * 0.7,
              background: OB1.DIM,
              opacity: 0.3,
              zIndex: 0,
              position: "relative",
              flexShrink: 0,
            }}
          />

          {/* DEPTH COLUMN */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: gapPx,
              width: barW,
            }}
          >
            {/* Trend arrow down */}
            <div
              style={{
                opacity: arrowFade,
                zIndex: 10,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingDown
                size={iconSize}
                color={OB1.CYAN}
                strokeWidth={2.5}
              />
            </div>

            {/* Label */}
            <div
              style={{
                opacity: labelFade,
                fontSize: labelSize,
                fontFamily: FONTS.heading,
                fontWeight: 800,
                color: OB1.CYAN,
                zIndex: 10,
                position: "relative",
                letterSpacing: "0.04em",
              }}
            >
              DEPTH
            </div>

            {/* Bar */}
            <div
              style={{
                width: barW,
                height: barMaxH,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                zIndex: 1,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: depthH,
                  background: `linear-gradient(to top, ${OB1.CYAN}, ${OB1.STEEL})`,
                  borderRadius: `${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px 0 0`,
                }}
              />
            </div>

            {/* Sub-label */}
            <div
              style={{
                opacity: labelFade,
                fontSize: subSize,
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Less
            </div>
          </div>
        </div>
      );
    },
  },

  {
    // DESIGN SPEC for NK-009-ExplainClearly
    // FOCAL: A horizontal spectrum axis from left ("CODE") to right ("EXPLANATION") with two large
    //        anchoring icons at each end (FileCode left, FileText right) and a label above each
    // SUPPORTING (2):
    //   - A horizontal arrow spanning the full width below the icons (zIndex 0)
    //   - A center label "ARTIFACT SPECTRUM" above the arrow
    // TEXT ON SCREEN:
    //   - "ARTIFACT SPECTRUM" (60px, centered above axis) — 17 chars
    //   - "CODE" (60px, under left icon) — 4 chars
    //   - "EXPLANATION" (60px, under right icon) — 11 chars
    //   Total visible: 32 chars (well under 90) ✓
    // PHASES:
    //   - 0–1.5s: "ARTIFACT SPECTRUM" title fades in
    //   - 1.5–3s: Left anchor (CODE icon + label) bouncePops in
    //   - 3–4.5s: Spectrum arrow draws left-to-right
    //   - 4.5–6s: Right anchor (EXPLANATION icon + label) bouncePops in
    //   - 6–7s: Hold
    // LOGOS: None (abstract concept — Lucide FileCode, FileText)
    // ELEMENT COUNT: 3 (title, left anchor, right anchor; arrow is decorative) ✓
    // PHONE TEST: All text 60px, icons 80px, arrow thick ✓
    // VERTICAL BUDGET:
    //   Title: 60px
    //   Gap: 32px
    //   Icons: 80px
    //   Gap: 16px
    //   Labels: 60px
    //   Gap: 28px
    //   Arrow band: 40px
    //   Total: ~316px (under ~520px zone) ✓

    id: "NK-009-ExplainClearly",
    title: "Clear Explanation",
    subtitle: "Its own artifact class",
    bottomLabel: "Explanation is a deliverable, not a side effect",
    bottomAccent: "deliverable",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const titleFade = ease(sceneFrame, 0, 20);
      const leftPop = bouncePop(sceneFrame, 35, fps);
      const arrowProgress = ease(sceneFrame, 65, 100);
      const rightPop = bouncePop(sceneFrame, 105, fps);

      const iconSize = Math.round(80 * zone.scale);
      const labelSize = Math.round(60 * zone.scale);
      const titleSize = Math.round(60 * zone.scale);
      const gap = Math.round(32 * zone.scale);
      const smallGap = Math.round(16 * zone.scale);

      // Arrow geometry — spans 80% of zone width
      const arrowW = zone.width * 0.80;
      const arrowX0 = (zone.width - arrowW) / 2;
      const arrowX1 = arrowX0 + arrowW * arrowProgress;
      const arrowY = Math.round(20 * zone.scale);
      const headSize = Math.round(14 * zone.scale);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: gap,
          }}
        >
          {/* TITLE */}
          <div
            style={{
              opacity: titleFade,
              fontSize: titleSize,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              letterSpacing: "0.06em",
              zIndex: 10,
              position: "relative",
            }}
          >
            ARTIFACT SPECTRUM
          </div>

          {/* ANCHOR ROW */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: zone.width * 0.80,
            }}
          >
            {/* LEFT — CODE */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: smallGap,
              }}
            >
              <div
                style={{
                  ...leftPop,
                  zIndex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileCode size={iconSize} color={OB1.PURPLE} strokeWidth={1.8} />
              </div>
              <div
                style={{
                  ...leftPop,
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.PURPLE,
                  zIndex: 10,
                  position: "relative",
                  letterSpacing: "0.05em",
                }}
              >
                CODE
              </div>
            </div>

            {/* RIGHT — EXPLANATION */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: smallGap,
              }}
            >
              <div
                style={{
                  ...rightPop,
                  zIndex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={iconSize} color={OB1.AMBER} strokeWidth={1.8} />
              </div>
              <div
                style={{
                  ...rightPop,
                  fontSize: labelSize,
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  color: OB1.AMBER,
                  zIndex: 10,
                  position: "relative",
                  letterSpacing: "0.05em",
                }}
              >
                EXPLANATION
              </div>
            </div>
          </div>

          {/* SPECTRUM ARROW — decorative, zIndex 0 */}
          <div style={{ position: "relative", zIndex: 0, width: zone.width * 0.80, height: arrowY * 2 }}>
            <svg width={zone.width * 0.80} height={arrowY * 2}>
              {arrowProgress > 0.02 && (
                <>
                  <line
                    x1={0}
                    y1={arrowY}
                    x2={arrowW * arrowProgress - headSize * 0.5}
                    y2={arrowY}
                    stroke={OB1.STEEL}
                    strokeWidth={Math.round(3 * zone.scale)}
                    strokeLinecap="round"
                  />
                  {arrowProgress > 0.95 && (
                    <polygon
                      points={`${arrowW},${arrowY} ${arrowW - headSize},${arrowY - headSize * 0.6} ${arrowW - headSize},${arrowY + headSize * 0.6}`}
                      fill={OB1.STEEL}
                    />
                  )}
                </>
              )}
            </svg>
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

export const NK_CLIPS_03 = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));

/**
 * Shared B-Roll utilities — brand, easing, animations, template.
 * Follows the Nate B-Roll Recipe (Layout & Sizing Rules).
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  spring,
} from "remotion";

/* ─── Brand Palette ─── */
export const OB1 = {
  BG_DARK: "#152a3e",
  BG_MID: "#1e3d5a",
  ORANGE: "#e8601c",
  STEEL: "#5a8aaa",
  WHITE: "#f0f4f8",
  DIM: "#3a6080",
  GREEN: "#22c55e",
  CYAN: "#38bdf8",
  RED: "#ef4444",
  AMBER: "#f59e0b",
  PURPLE: "#a855f7",
} as const;

export const FONTS = {
  heading:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  mono: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
} as const;

/* ─── Safe Zones (15% title / 10% action) ─── */
export const SAFE = {
  titleX: 0.15,
  titleY: 0.15,
  actionX: 0.10,
  actionY: 0.10,
} as const;

export function titleSafe(w: number, h: number) {
  return {
    left: w * SAFE.titleX,
    right: w * SAFE.titleX,
    top: h * SAFE.titleY,
    bottom: h * SAFE.titleY,
    width: w * (1 - 2 * SAFE.titleX),
    height: h * (1 - 2 * SAFE.titleY),
  };
}

/* ─── Easing Helpers ─── */
export function ease(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

export function easeIn(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
}

/* ─── Animation Helpers ─── */
export function fadeInUp(frame: number, start: number, dur = 20) {
  const o = ease(frame, start, start + dur);
  const y = interpolate(frame, [start, start + dur], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: o, transform: `translateY(${y}px)` };
}

export function slideIn(
  frame: number,
  start: number,
  dur = 20,
  dir: "left" | "right" | "up" | "down" = "up",
  dist = 40
) {
  const progress = ease(frame, start, start + dur);
  const remaining = (1 - progress) * dist;
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "down" ? 1 : -1;
  return {
    opacity: progress,
    transform: `translate${axis}(${sign * remaining}px)`,
  };
}

export function bouncePop(frame: number, start: number, fps: number) {
  const s = spring({ frame, fps, from: 0, to: 1, config: { damping: 16, stiffness: 250, mass: 0.8 }, delay: start });
  return { opacity: s, transform: `scale(${s})` };
}

export function countUp(frame: number, start: number, end: number, target: number) {
  const n = interpolate(frame, [start, end], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.floor(n);
}

export function stagger(index: number, base: number, gap = 10) {
  return base + index * gap;
}

export function pulse(frame: number, rate = 0.05) {
  return 0.5 + 0.5 * Math.sin(frame * rate);
}

/* ─── Layout Zones ───
 *
 * The frame is divided into two hard zones that CANNOT overlap:
 *
 *  ┌─────────────────────────────────┐
 *  │          (title safe)           │
 *  │  ┌───────────────────────────┐  │
 *  │  │                           │  │
 *  │  │       GFX ZONE            │  │
 *  │  │   (scene content here)    │  │
 *  │  │                           │  │
 *  │  │                           │  │
 *  │  ├───────────────────────────┤  │  ← TITLE_ZONE_HEIGHT from bottom of safe
 *  │  │    TITLE ZONE             │  │
 *  │  │  (bottom label/message)   │  │
 *  │  └───────────────────────────┘  │
 *  └─────────────────────────────────┘
 *
 * GFX zone:  top of title-safe → (bottom of title-safe − TITLE_ZONE_HEIGHT)
 * Title zone: bottom TITLE_ZONE_HEIGHT of title-safe area
 *
 * Component authors render into the GFX zone. They CANNOT touch the title zone.
 * The title zone is reserved for the bottom label — always centered, always readable.
 */

const TITLE_ZONE_HEIGHT = 120; // px at 1080p — scales with resolution
const TITLE_ZONE_GAP = 20;    // px gap between GFX and title zones

/* ─── BRollTemplate ─── */

/**
 * GFX zone dimensions passed to every scene render function.
 * Use these to size your content — NEVER hardcode pixel values.
 * Everything you render must fit within gfxWidth x gfxHeight.
 */
export interface GfxZone {
  /** Available width for your visualization (px) */
  width: number;
  /** Available height for your visualization (px) */
  height: number;
  /** Resolution scale factor (1.0 at 1080p, ~0.67 at 720p) */
  scale: number;
}

interface Scene {
  start: number;
  end: number;
  /** Render function receives frame, progress (0-1), and the GFX zone dimensions.
   *  ALL content must fit within zone.width x zone.height. */
  render: (frame: number, progress: number, zone: GfxZone) => React.ReactNode;
}

interface BRollTemplateProps {
  title: string;
  subtitle?: string;
  bottomLabel?: string;
  bottomAccent?: string;
  scenes: Scene[];
  showGrid?: boolean;
  showChyron?: boolean;
  chyronPlatform?: "YT" | "SS";
}

export const BRollTemplate: React.FC<BRollTemplateProps> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  scenes,
  showGrid = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const safe = titleSafe(width, height);

  // Scale title zone height proportionally (120px at 1080p)
  const scale = height / 1080;
  const titleZoneH = Math.round(TITLE_ZONE_HEIGHT * scale);
  const titleZoneGap = Math.round(TITLE_ZONE_GAP * scale);

  // GFX zone: top of safe area → bottom of safe area minus title zone
  const gfxTop = safe.top;
  const gfxHeight = safe.height - titleZoneH - titleZoneGap;

  // Title zone: bottom of safe area
  const titleZoneTop = safe.top + safe.height - titleZoneH;

  // Title card (frames 0–90)
  const titleOpacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(frame, [0, 25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom label (last 80 frames)
  const labelStart = durationInFrames - 100;
  const labelOpacity = ease(frame, labelStart, labelStart + 25);

  return (
    <AbsoluteFill>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${OB1.BG_MID}, ${OB1.BG_DARK} 75%)`,
        }}
      />

      {/* SVG grid overlay */}
      {showGrid && (
        <AbsoluteFill style={{ opacity: 0.12 }}>
          <svg width={width} height={height}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={OB1.STEEL} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </AbsoluteFill>
      )}

      {/* Title card (phase 1) — renders in GFX zone */}
      {frame < 100 && (
        <div
          style={{
            position: "absolute",
            left: safe.left,
            top: gfxTop,
            width: safe.width,
            height: gfxHeight,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: Math.round(72 * 1.2 * scale),
                fontWeight: 800,
                fontFamily: FONTS.heading,
                color: OB1.WHITE,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: Math.round(36 * scale),
                  fontWeight: 400,
                  fontFamily: FONTS.heading,
                  color: OB1.STEEL,
                  marginTop: 16,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scenes — constrained to GFX ZONE (cannot touch title zone) */}
      {scenes.map((scene, i) => {
        const sceneOpacity = interpolate(
          frame,
          [scene.start, scene.start + 20, scene.end - 20, scene.end],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const progress = interpolate(frame, [scene.start, scene.end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (frame < scene.start - 5 || frame > scene.end + 5) return null;

        // Inner padding prevents content from crowding the GFX zone edges
        const innerPad = Math.round(20 * scale);
        const zone: GfxZone = {
          width: safe.width - innerPad * 2,
          height: gfxHeight - innerPad * 2,
          scale,
        };

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: safe.left,
              top: gfxTop,
              width: safe.width,
              height: gfxHeight,
              overflow: "hidden", // HARD CLIP — nothing escapes the GFX zone
              opacity: sceneOpacity,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: innerPad,
              boxSizing: "border-box",
            }}
          >
            {scene.render(frame, progress, zone)}
          </div>
        );
      })}

      {/* TITLE ZONE — bottom label, physically separated from GFX */}
      {bottomLabel && frame > labelStart && (
        <div
          style={{
            position: "absolute",
            left: safe.left,
            top: titleZoneTop,
            width: safe.width,
            height: titleZoneH,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              padding: `${Math.round(12 * scale)}px ${Math.round(32 * scale)}px`,
              borderRadius: Math.round(16 * scale),
              background: `${OB1.BG_DARK}cc`,
              border: `2px solid ${OB1.STEEL}40`,
            }}
          >
            <div
              style={{
                fontSize: Math.round(42 * scale),
                fontWeight: 600,
                fontFamily: FONTS.heading,
                color: OB1.WHITE,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {bottomAccent ? (
                <>
                  {bottomLabel.split(bottomAccent)[0]}
                  <span style={{ color: OB1.ORANGE, fontWeight: 800 }}>
                    {bottomAccent}
                  </span>
                  {bottomLabel.split(bottomAccent)[1]}
                </>
              ) : (
                bottomLabel
              )}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

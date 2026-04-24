import React from "react";
import { Easing, interpolate } from "remotion";
import {
  BRollTemplate,
  FONTS,
  getDefaultGfxZone,
  GfxZone,
  isTemplateColorToken,
  OB1,
  resolveTemplateColor,
} from "../shared";

export type ComparisonSide = {
  role: string;
  label: string;
  note?: string;
  color: string;
};

export type ComparisonTemplateProps = {
  title: string;
  subtitle?: string;
  bottomLabel?: string;
  bottomAccent?: string;
  left: ComparisonSide;
  right: ComparisonSide;
  emphasis?: "left" | "right" | "balanced";
  centerLabel?: string;
};

export type ComparisonTemplateCall = ComparisonTemplateProps & {
  template: "comparison";
};

const COMP_MAX_ROLE_CHARS = 12;
const COMP_MAX_LABEL_CHARS = 18;
const COMP_MAX_NOTE_CHARS = 18;
const COMP_MAX_CENTER_CHARS = 6;

const estimateCharLimit = ({
  availableWidth,
  fontSize,
  charWidthFactor,
  reserve,
}: {
  availableWidth: number;
  fontSize: number;
  charWidthFactor: number;
  reserve: number;
}) =>
  Math.max(
    8,
    Math.floor((availableWidth - reserve) / (fontSize * charWidthFactor))
  );

const estimateTextWidth = ({
  length,
  fontSize,
  charWidthFactor,
  padding,
}: {
  length: number;
  fontSize: number;
  charWidthFactor: number;
  padding: number;
}) => Math.round(length * fontSize * charWidthFactor + padding);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const reveal = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const getComparisonMetrics = (
  zone: GfxZone,
  emphasis: "left" | "right" | "balanced"
) => {
  const gap = Math.round(184 * zone.scale);
  const slotWidth = Math.floor((zone.width - gap) / 2);
  const outerInset = Math.round(18 * zone.scale);
  const innerInset = Math.round(20 * zone.scale);
  const minContentWidth = Math.round(360 * zone.scale);
  const maxContentWidth = slotWidth - outerInset - innerInset;
  const roleFontSize = Math.round(26 * zone.scale);
  const baseTitleFontSize = Math.round(64 * zone.scale);
  const winnerTitleFontSize = Math.round(70 * zone.scale);
  const noteFontSize = Math.round(34 * zone.scale);
  const top = Math.round(zone.height * 0.26);
  const overlineHeight = Math.round(8 * zone.scale);
  const baseOverlineWidth = Math.round(120 * zone.scale);
  const leftInnerAnchor = slotWidth - innerInset;
  const rightInnerAnchor = slotWidth + gap + innerInset;

  return {
    gap,
    slotWidth,
    outerInset,
    innerInset,
    minContentWidth,
    maxContentWidth,
    roleFontSize,
    baseTitleFontSize,
    winnerTitleFontSize,
    noteFontSize,
    top,
    overlineHeight,
    baseOverlineWidth,
    leftInnerAnchor,
    rightInnerAnchor,
  };
};

const getSideWidth = ({
  side,
  metrics,
  isWinner,
}: {
  side: ComparisonSide;
  metrics: ReturnType<typeof getComparisonMetrics>;
  isWinner: boolean;
}) => {
  const titleFontSize = isWinner
    ? metrics.winnerTitleFontSize
    : metrics.baseTitleFontSize;
  const roleWidth = estimateTextWidth({
    length: side.role.length,
    fontSize: metrics.roleFontSize,
    charWidthFactor: 0.64,
    padding: Math.round(24),
  });
  const titleWidth = estimateTextWidth({
    length: side.label.length,
    fontSize: titleFontSize,
    charWidthFactor: 0.51,
    padding: Math.round(30),
  });
  const noteWidth = side.note
    ? estimateTextWidth({
        length: side.note.length,
        fontSize: metrics.noteFontSize,
        charWidthFactor: 0.47,
        padding: Math.round(20),
      })
    : 0;
  const desiredWidth = Math.max(roleWidth, titleWidth, noteWidth);

  return clamp(desiredWidth, metrics.minContentWidth, metrics.maxContentWidth);
};

const getSideLimits = ({
  metrics,
  maxWidth,
}: {
  metrics: ReturnType<typeof getComparisonMetrics>;
  maxWidth: number;
}) => ({
  roleLimit: Math.min(
    COMP_MAX_ROLE_CHARS,
    estimateCharLimit({
      availableWidth: maxWidth,
      fontSize: metrics.roleFontSize,
      charWidthFactor: 0.64,
      reserve: 12,
    })
  ),
  titleLimit: Math.min(
    COMP_MAX_LABEL_CHARS,
    estimateCharLimit({
      availableWidth: maxWidth,
      fontSize: metrics.winnerTitleFontSize,
      charWidthFactor: 0.51,
      reserve: 18,
    })
  ),
  noteLimit: Math.min(
    COMP_MAX_NOTE_CHARS,
    estimateCharLimit({
      availableWidth: maxWidth,
      fontSize: metrics.noteFontSize,
      charWidthFactor: 0.47,
      reserve: 16,
    })
  ),
});

const assertComparisonSpec = ({
  zone,
  left,
  right,
  emphasis,
  centerLabel,
}: {
  zone: GfxZone;
  left: ComparisonSide;
  right: ComparisonSide;
  emphasis: "left" | "right" | "balanced";
  centerLabel?: string;
}) => {
  const metrics = getComparisonMetrics(zone, emphasis);

  [
    {
      sideName: "left",
      side: left,
      limits: getSideLimits({ metrics, maxWidth: metrics.maxContentWidth }),
    },
    {
      sideName: "right",
      side: right,
      limits: getSideLimits({ metrics, maxWidth: metrics.maxContentWidth }),
    },
  ].forEach(({ sideName, side, limits }) => {
    if (side.role.length > limits.roleLimit) {
      throw new Error(
        `[ComparisonTemplate] ${sideName} role is too long. Keep it at ${limits.roleLimit} characters or fewer.`
      );
    }

    if (side.label.length > limits.titleLimit) {
      throw new Error(
        `[ComparisonTemplate] ${sideName} title is too long. Keep it at ${limits.titleLimit} characters or fewer.`
      );
    }

    if (side.note && side.note.length > limits.noteLimit) {
      throw new Error(
        `[ComparisonTemplate] ${sideName} subtitle is too long. Keep it at ${limits.noteLimit} characters or fewer.`
      );
    }
  });

  if (centerLabel && centerLabel.length > COMP_MAX_CENTER_CHARS) {
    throw new Error(
      `[ComparisonTemplate] center label is too long. Keep it at ${COMP_MAX_CENTER_CHARS} characters or fewer.`
    );
  }
};

const ComparisonScene: React.FC<{
  frame: number;
  zone: GfxZone;
  left: ComparisonSide;
  right: ComparisonSide;
  emphasis: "left" | "right" | "balanced";
  centerLabel?: string;
}> = ({ frame, zone, left, right, emphasis, centerLabel }) => {
  assertComparisonSpec({ zone, left, right, emphasis, centerLabel });

  const sceneFrame = Math.max(0, frame - 90);
  const metrics = getComparisonMetrics(zone, emphasis);
  const leftWinner = emphasis === "left";
  const rightWinner = emphasis === "right";
  const leftWidth = getSideWidth({
    side: left,
    metrics,
    isWinner: leftWinner,
  });
  const rightWidth = getSideWidth({
    side: right,
    metrics,
    isWinner: rightWinner,
  });
  const leftX = metrics.leftInnerAnchor - leftWidth;
  const rightX = metrics.rightInnerAnchor;
  const leftProgress = reveal(sceneFrame, 14, 18);
  const rightProgress = reveal(sceneFrame, 20, 18);
  const vsProgress = reveal(sceneFrame, 10, 16);

  const renderSide = ({
    side,
    width,
    x,
    textAlign,
    sidePosition,
    progress,
    isWinner,
  }: {
    side: ComparisonSide;
    width: number;
    x: number;
    textAlign: "left" | "right";
    sidePosition: "left" | "right";
    progress: number;
    isWinner: boolean;
  }) => {
    const blockShift =
      sidePosition === "left"
        ? Math.round((1 - progress) * -46 * zone.scale)
        : Math.round((1 - progress) * 46 * zone.scale);
    const textAlpha = emphasis === "balanced" ? 1 : isWinner ? 1 : 0.82;
    const titleFontSize = isWinner
      ? metrics.winnerTitleFontSize
      : metrics.baseTitleFontSize;
    const roleFontSize = metrics.roleFontSize;
    const noteFontSize = metrics.noteFontSize;
    const overlineWidth = Math.round(
      metrics.baseOverlineWidth * (isWinner ? 1.18 : 1)
    );

    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: metrics.top,
          width,
          opacity: progress,
          transform: `translateX(${blockShift}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: textAlign === "left" ? "flex-start" : "flex-end",
          gap: Math.round(14 * zone.scale),
          zIndex: isWinner ? 12 : 10,
        }}
      >
        <div
          style={{
            width: overlineWidth,
            height: metrics.overlineHeight,
            borderRadius: Math.round(999 * zone.scale),
            background: side.color,
            opacity: textAlpha,
            boxShadow: isWinner
              ? `0 0 ${Math.round(18 * zone.scale)}px ${side.color}33`
              : undefined,
            transform: `scaleX(${progress})`,
            transformOrigin:
              textAlign === "left" ? "left center" : "right center",
          }}
        />

        <div
          style={{
            fontSize: roleFontSize,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: FONTS.heading,
            color: side.color,
            whiteSpace: "nowrap",
            textAlign,
            opacity: textAlpha,
          }}
        >
          {side.role}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: textAlign === "left" ? "flex-start" : "flex-end",
            gap: Math.round(12 * zone.scale),
            textAlign,
          }}
        >
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 700,
              fontFamily: FONTS.heading,
              color: OB1.WHITE,
              lineHeight: 1,
              whiteSpace: "nowrap",
              textAlign,
              opacity: textAlpha,
              transform: `scale(${isWinner ? 1.02 : 1})`,
              transformOrigin:
                textAlign === "left" ? "left center" : "right center",
            }}
          >
            {side.label}
          </div>

          {side.note ? (
            <div
              style={{
                fontSize: noteFontSize,
                fontWeight: 500,
                fontFamily: FONTS.heading,
                color: side.color,
                lineHeight: 1,
                whiteSpace: "nowrap",
                textAlign,
                opacity: textAlpha,
              }}
            >
              {side.note}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: zone.width,
        height: zone.height,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: Math.round(zone.width / 2) - Math.round(84 * zone.scale),
          top: Math.round(metrics.top - 114 * zone.scale),
          width: Math.round(168 * zone.scale),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: vsProgress,
          transform: `translateY(${Math.round((1 - vsProgress) * -16 * zone.scale)}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: Math.round(98 * zone.scale),
            fontWeight: 800,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            fontFamily: FONTS.heading,
            color: OB1.STEEL,
            textAlign: "center",
            opacity: emphasis === "balanced" ? 0.78 : 0.9,
          }}
        >
          {centerLabel ?? "vs"}
        </div>
      </div>

      {renderSide({
        side: left,
        width: leftWidth,
        x: leftX,
        textAlign: "right",
        sidePosition: "left",
        progress: leftProgress,
        isWinner: leftWinner,
      })}

      {renderSide({
        side: right,
        width: rightWidth,
        x: rightX,
        textAlign: "left",
        sidePosition: "right",
        progress: rightProgress,
        isWinner: rightWinner,
      })}
    </div>
  );
};

export const ComparisonTemplate: React.FC<ComparisonTemplateProps> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  left,
  right,
  emphasis = "balanced",
  centerLabel = "vs",
}) => {
  const Scene: React.FC<{ frame: number; zone: GfxZone }> = ({ frame, zone }) => (
    <ComparisonScene
      frame={frame}
      zone={zone}
      left={left}
      right={right}
      emphasis={emphasis}
      centerLabel={centerLabel}
    />
  );

  return (
    <BRollTemplate
      title={title}
      subtitle={subtitle}
      bottomLabel={bottomLabel}
      bottomAccent={bottomAccent}
      scenes={[
        {
          start: 90,
          end: 300,
          render: (frame, _progress, zone) => <Scene frame={frame} zone={zone} />,
        },
      ]}
    />
  );
};

export const validateComparisonTemplateCall = (
  call: ComparisonTemplateCall,
  zone: GfxZone = getDefaultGfxZone()
) => {
  [
    { side: "left", color: call.left.color },
    { side: "right", color: call.right.color },
  ].forEach(({ side, color }) => {
    if (!isTemplateColorToken(color)) {
      throw new Error(
        `[ComparisonTemplate] ${side} color must be a supported token. Use one of: amber, cyan, green, orange, purple, red, steel.`
      );
    }
  });
  assertComparisonSpec({
    zone,
    left: call.left,
    right: call.right,
    emphasis: call.emphasis ?? "balanced",
    centerLabel: call.centerLabel,
  });
};

export const renderComparisonTemplateCall = (call: ComparisonTemplateCall) => {
  validateComparisonTemplateCall(call);

  return (
    <ComparisonTemplate
      title={call.title}
      subtitle={call.subtitle}
      bottomLabel={call.bottomLabel}
      bottomAccent={call.bottomAccent}
      left={{ ...call.left, color: resolveTemplateColor(call.left.color) }}
      right={{ ...call.right, color: resolveTemplateColor(call.right.color) }}
      emphasis={call.emphasis}
      centerLabel={call.centerLabel}
    />
  );
};

import React from "react";
import { interpolate, Easing } from "remotion";
import {
  BRollTemplate,
  FONTS,
  getDefaultGfxZone,
  GfxZone,
  isTemplateColorToken,
  OB1,
  resolveTemplateColor,
} from "../shared";

export type StackLayer = {
  label: string;
  role?: string;
  note?: string;
  color: string;
};

export type StackTemplateProps = {
  title: string;
  subtitle?: string;
  bottomLabel?: string;
  bottomAccent?: string;
  layers: StackLayer[];
};

export type StackTemplateCall = StackTemplateProps & {
  template: "stack";
};

const STACK_MAX_ROLE_CHARS = 12;
const STACK_MAX_LABEL_CHARS = 22;
const STACK_MAX_NOTE_CHARS = 18;

const getStackWidthRatios = (layerCount: number) =>
  layerCount === 2
    ? [0.9, 0.8]
    : layerCount === 3
      ? [0.9, 0.82, 0.74]
      : [0.88, 0.8, 0.72, 0.64];

const getStackRoleTypography = (layerCount: number) => ({
  fontBase: layerCount === 4 ? 28 : 31,
  letterSpacingEm: layerCount === 4 ? 0.06 : 0.08,
});

const getSharedRoleWidth = (layers: StackLayer[], zone: GfxZone) => {
  const layerCount = layers.length;
  const widthRatios = getStackWidthRatios(layerCount);
  const narrowestWidth = Math.round(zone.width * widthRatios[layerCount - 1]);
  const { fontBase, letterSpacingEm } = getStackRoleTypography(layerCount);
  const longestRoleLength = layers.reduce(
    (max, layer) => Math.max(max, layer.role?.length ?? 0),
    0
  );
  const baseRoleWidth = Math.round(Math.min(narrowestWidth * 0.2, 198 * zone.scale));
  const estimatedRoleWidth = Math.round(
    ((fontBase * 0.68) * longestRoleLength +
      (fontBase * letterSpacingEm) * Math.max(0, longestRoleLength - 1) +
      44) *
      zone.scale
  );

  return layerCount === 4
    ? Math.min(Math.max(baseRoleWidth, estimatedRoleWidth), Math.round(252 * zone.scale))
    : baseRoleWidth;
};

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
}) => {
  return Math.max(
    8,
    Math.floor((availableWidth - reserve) / (fontSize * charWidthFactor))
  );
};

const getStackTextLimits = (layers: StackLayer[], zone: GfxZone, index: number) => {
  const layerCount = layers.length;
  const widthRatios = getStackWidthRatios(layerCount);
  const sharedRoleWidth = getSharedRoleWidth(layers, zone);
  const width = Math.round(zone.width * widthRatios[index]);
  const horizontalPad = Math.round(42 * zone.scale);
  const dividerWidth = Math.max(2, Math.round(2 * zone.scale));
  const sectionGap = Math.round(24 * zone.scale);
  const contentPaddingLeft = Math.round(8 * zone.scale);
  const titleFontSize = Math.round(60 * zone.scale);
  const noteFontSize = Math.round(36 * zone.scale);
  const contentWidth =
    width -
    horizontalPad * 2 -
    sharedRoleWidth -
    dividerWidth -
    sectionGap * 2 -
    contentPaddingLeft;

  return {
    titleLimit: Math.min(
      STACK_MAX_LABEL_CHARS,
      estimateCharLimit({
        availableWidth: contentWidth,
        fontSize: titleFontSize,
        charWidthFactor: 0.5,
        reserve: Math.round(16 * zone.scale),
      })
    ),
    noteLimit: Math.min(
      STACK_MAX_NOTE_CHARS,
      estimateCharLimit({
        availableWidth: contentWidth,
        fontSize: noteFontSize,
        charWidthFactor: 0.46,
        reserve: Math.round(12 * zone.scale),
      })
    ),
  };
};

const assertStackSpec = (layers: StackLayer[], zone: GfxZone) => {
  if (layers.length < 2 || layers.length > 4) {
    throw new Error("[StackTemplate] requires 2 to 4 layers.");
  }

  layers.forEach((layer, index) => {
    if (layer.role && layer.role.length > STACK_MAX_ROLE_CHARS) {
      throw new Error(
        `[StackTemplate] layer ${index + 1} role is too long. Keep left-side labels at ${STACK_MAX_ROLE_CHARS} characters or fewer.`
      );
    }

    const { titleLimit, noteLimit } = getStackTextLimits(layers, zone, index);

    if (layer.label.length > titleLimit) {
      throw new Error(
        `[StackTemplate] layer ${index + 1} title is too long for this card width. Keep right-side titles at ${titleLimit} characters or fewer.`
      );
    }

    if (layer.note && layer.note.length > noteLimit) {
      throw new Error(
        `[StackTemplate] layer ${index + 1} subtitle is too long for this card width. Keep right-side subtitles at ${noteLimit} characters or fewer.`
      );
    }
  });
};

const layerEnter = (frame: number, start: number) =>
  interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const StackScene: React.FC<{ frame: number; zone: GfxZone; layers: StackLayer[] }> = ({
  frame,
  zone,
  layers,
}) => {
  assertStackSpec(layers, zone);

  const sceneFrame = Math.max(0, frame - 90);
  const layerCount = layers.length;
  const sizeFactor = layerCount === 4 ? 1.16 : 1.3;
  const gap = Math.round(18 * zone.scale * (layerCount === 4 ? 1.05 : 1.2));
  const layerHeight = Math.round(118 * zone.scale * sizeFactor);
  const totalHeight = layerCount * layerHeight + (layerCount - 1) * gap;
  const baseTop = Math.round((zone.height - totalHeight) / 2);
  const widthRatios = getStackWidthRatios(layerCount);
  const stackLeft = Math.round(zone.width * 0.06);
  const baseHorizontalPad = Math.round(42 * zone.scale);
  const { fontBase: roleFontBase, letterSpacingEm: roleLetterSpacingEm } =
    getStackRoleTypography(layerCount);
  const sharedRoleWidth = getSharedRoleWidth(layers, zone);
  const sharedRoleStartX = stackLeft + baseHorizontalPad;
  const layerStarts = [10, 30, 48, 64];
  const slabDurations = [24, 20, 18, 16];

  return (
    <div
      style={{
        width: zone.width,
        height: zone.height,
        position: "relative",
      }}
    >
      {layers.map((layer, index) => {
        const revealOrder = layerCount - 1 - index;
        const start = layerStarts[revealOrder] ?? (10 + revealOrder * 16);
        const slabDuration = slabDurations[revealOrder] ?? 16;
        const slabProgress = layerEnter(sceneFrame, start);
        const slabReveal = interpolate(sceneFrame, [start, start + slabDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const metaProgress = interpolate(
          sceneFrame,
          [start + slabDuration - 3, start + slabDuration + 9],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );
        const width = Math.round(zone.width * widthRatios[index]);
        const left = stackLeft;
        const top = baseTop + index * (layerHeight + gap);
        const horizontalPad = Math.round(sharedRoleStartX - left);
        const roleWidth = sharedRoleWidth;
        const dividerHeight = Math.round(68 * zone.scale);
        const dividerWidth = Math.max(2, Math.round(2 * zone.scale));
        const sectionGap = Math.round(24 * zone.scale);
        const radius = Math.round(34 * zone.scale);
        const slabClip = 100 - slabReveal * 100;
        const slabTravel = Math.round((1 - slabReveal) * 26 * zone.scale);
        const metaTravel = Math.round((1 - metaProgress) * 16 * zone.scale);

        const settlePulse = Array.from({ length: index }).reduce<number>(
          (sum, _unused, upperIndex) => {
            const upperOrder = layerCount - 1 - upperIndex;
            const upperStart = layerStarts[upperOrder] ?? (10 + upperOrder * 16);
            const upperDuration = slabDurations[upperOrder] ?? 16;
            return (
              sum +
              interpolate(
                sceneFrame,
                [upperStart + upperDuration - 2, upperStart + upperDuration + 4, upperStart + upperDuration + 14],
                [0, 1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )
            );
          },
          0
        );
        const settleY = Math.round(settlePulse * 6 * zone.scale);
        const settleScaleY = 1 - settlePulse * 0.015;
        const settleScaleX = 1 + settlePulse * 0.006;

        return (
          <div
            key={`${layer.label}-${index}`}
            style={{
              position: "absolute",
              left,
              top: top + settleY,
              width,
              height: layerHeight,
              transform: `scaleX(${settleScaleX}) scaleY(${settleScaleY})`,
              transformOrigin: "center center",
              zIndex: 10 + index,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: radius,
                background: `${OB1.BG_DARK}ee`,
                border: `${Math.round(3 * zone.scale)}px solid ${layer.color}`,
                boxShadow: `0 ${Math.round(18 * zone.scale)}px ${Math.round(48 * zone.scale)}px ${layer.color}22`,
                clipPath: `inset(0 ${slabClip}% 0 0 round ${radius}px)`,
                transform: `translateX(${-slabTravel}px)`,
                transformOrigin: "left center",
                opacity: slabProgress,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                padding: `${Math.round(20 * zone.scale)}px ${horizontalPad}px`,
                gap: sectionGap,
                boxSizing: "border-box",
                opacity: metaProgress,
                transform: `translateX(${-metaTravel}px)`,
              }}
            >
              {layer.role ? (
                <div
                  style={{
                    width: roleWidth,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: Math.round(roleFontBase * zone.scale),
                    fontWeight: 700,
                    letterSpacing: `${roleLetterSpacingEm}em`,
                    textTransform: "uppercase",
                    fontFamily: FONTS.heading,
                    color: layer.color,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  {layer.role}
                </div>
              ) : null}

              {layer.role ? (
                <div
                  style={{
                    width: dividerWidth,
                    height: dividerHeight,
                    borderRadius: Math.round(999 * zone.scale),
                    background: `${layer.color}88`,
                    flexShrink: 0,
                  }}
                />
              ) : null}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: Math.round(8 * zone.scale),
                  minWidth: 0,
                  flex: 1,
                  textAlign: "left",
                  paddingLeft: Math.round(8 * zone.scale),
                }}
              >
                <div
                  style={{
                    fontSize: Math.round(60 * zone.scale),
                    fontWeight: 700,
                    fontFamily: FONTS.heading,
                    color: OB1.WHITE,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {layer.label}
                </div>
                {layer.note ? (
                  <div
                    style={{
                      fontSize: Math.round(36 * zone.scale),
                      fontWeight: 500,
                      fontFamily: FONTS.heading,
                      color: layer.color,
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textAlign: "left",
                    }}
                  >
                    {layer.note}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const StackTemplate: React.FC<StackTemplateProps> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  layers,
}) => {
  const Scene: React.FC<{ frame: number; zone: GfxZone }> = ({ frame, zone }) => (
    <StackScene frame={frame} zone={zone} layers={layers} />
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

export const validateStackTemplateCall = (
  call: StackTemplateCall,
  zone: GfxZone = getDefaultGfxZone()
) => {
  call.layers.forEach((layer, index) => {
    if (!isTemplateColorToken(layer.color)) {
      throw new Error(
        `[StackTemplate] layer ${index + 1} color must be a supported token. Use one of: amber, cyan, green, orange, purple, red, steel.`
      );
    }
  });
  assertStackSpec(call.layers, zone);
};

export const renderStackTemplateCall = (call: StackTemplateCall) => {
  validateStackTemplateCall(call);

  return (
    <StackTemplate
      title={call.title}
      subtitle={call.subtitle}
      bottomLabel={call.bottomLabel}
      bottomAccent={call.bottomAccent}
      layers={call.layers.map((layer) => ({
        ...layer,
        color: resolveTemplateColor(layer.color),
      }))}
    />
  );
};

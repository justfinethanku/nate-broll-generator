import React from "react";
import { Img, staticFile } from "remotion";
import type { LucideIcon } from "lucide-react";
import { GfxZone, OB1, FONTS } from "./shared";
import {
  assertMetricNodeGeometry,
  assertSceneSpacing,
  assertSubtitleCardGeometry,
  assertTitleNodeGeometry,
  getMetricNodeBounds,
  getSubtitleCardBounds,
  getTitleNodeBounds,
  titleNodeUsesInlineIcon,
} from "./layoutGuards";

export const sceneWrap = (zone: GfxZone): React.CSSProperties => ({
  width: zone.width,
  height: zone.height,
  position: "relative",
});

type BaseNodeProps = {
  zone: GfxZone;
  left: number;
  top: number;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  value?: string;
  accent?: string;
  opacity?: number;
  color?: string;
  icon?: LucideIcon;
  logo?: string;
  logoMono?: boolean;
  titleSize?: number;
  align?: "left" | "center";
};

type TitleNodeProps = BaseNodeProps;

type MetricNodeProps = BaseNodeProps & {
  value: string;
  valueSize?: number;
};

type SubtitleCardNodeProps = BaseNodeProps & {
  subtitle: string;
  subtitleSize?: number;
};

const renderNodeAsset = ({
  zone,
  Icon,
  logo,
  logoMono,
  color,
  large = false,
}: {
  zone: GfxZone;
  Icon?: LucideIcon;
  logo?: string;
  logoMono: boolean;
  color: string;
  large?: boolean;
}) => {
  if (Icon) {
    return <Icon size={Math.round((large ? 48 : 38) * zone.scale)} color={color} />;
  }

  if (!logo) {
    return null;
  }

  return (
    <Img
      src={staticFile(`logos/${logo}.svg`)}
      style={{
        width: Math.round((large ? 48 : 34) * zone.scale),
        height: Math.round((large ? 48 : 34) * zone.scale),
        objectFit: "contain",
        filter: logoMono ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
};

const cardBorder = (zone: GfxZone) => Math.round(3 * zone.scale);

export const TitleNode: React.FC<TitleNodeProps> = ({
  zone,
  left,
  top,
  width,
  height,
  title,
  opacity = 1,
  color = OB1.STEEL,
  icon: Icon,
  logo,
  logoMono = false,
  titleSize = 46,
  align = "center",
}) => {
  const textAlign = align;
  const scale = zone.scale;
  const hasIcon = Boolean(Icon || logo);
  const inlineIcon = titleNodeUsesInlineIcon({ zone, height, hasIcon });
  const bounds = assertTitleNodeGeometry({
    zone,
    left,
    top,
    width,
    height,
    title,
    hasIcon,
  });
  const compactBadgeSize = Math.round(60 * scale);
  const compactBadgeGap = Math.round(10 * scale);
  const compactCardTop = hasIcon && !inlineIcon ? compactBadgeSize + compactBadgeGap : 0;
  const compactTitleSize = Math.round(Math.min(titleSize, 48) * scale);
  const cardRadius = Math.round(28 * scale);
  const borderWidth = cardBorder(zone);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: bounds.height,
        overflow: "visible",
        opacity,
        zIndex: 1,
      }}
    >
      {hasIcon && !inlineIcon && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: compactBadgeSize,
            height: compactBadgeSize,
            transform: "translateX(-50%)",
            borderRadius: Math.round(18 * scale),
            background: `${OB1.BG_DARK}f0`,
            border: `${borderWidth}px solid ${color}`,
            boxShadow: `0 0 ${Math.round(24 * scale)}px ${color}30`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {renderNodeAsset({ zone, Icon, logo, logoMono, color })}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: compactCardTop,
          width,
          height,
          borderRadius: cardRadius,
          border: `${borderWidth}px solid ${color}`,
          background: `${OB1.BG_DARK}dd`,
          boxShadow: `0 0 ${Math.round(32 * scale)}px ${color}20`,
          padding: `${Math.round(16 * scale)}px ${Math.round(20 * scale)}px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: inlineIcon ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: inlineIcon ? Math.round(10 * scale) : undefined,
          textAlign,
          zIndex: 1,
        }}
      >
        {hasIcon && inlineIcon && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.round(74 * scale),
              width: "100%",
            }}
          >
            {logo ? (
              <div
                style={{
                  width: Math.round(72 * scale),
                  height: Math.round(72 * scale),
                  borderRadius: Math.round(18 * scale),
                  background: `${OB1.WHITE}12`,
                  border: `${Math.round(2 * scale)}px solid ${OB1.WHITE}18`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {renderNodeAsset({ zone, logo, logoMono, color, large: true })}
              </div>
            ) : (
              renderNodeAsset({ zone, Icon, logo, logoMono, color, large: true })
            )}
          </div>
        )}
        <div
          style={{
            fontSize: compactTitleSize,
            fontWeight: 700,
            fontFamily: FONTS.heading,
            color: OB1.WHITE,
            lineHeight: 1.05,
            zIndex: 10,
            position: "relative",
            maxWidth: "100%",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export const MetricNode: React.FC<MetricNodeProps> = ({
  zone,
  left,
  top,
  width,
  height,
  title,
  value,
  accent,
  opacity = 1,
  color = OB1.STEEL,
  icon: Icon,
  logo,
  logoMono = false,
  titleSize = 46,
  valueSize = 72,
  align = "center",
}) => {
  const textAlign = align;
  const scale = zone.scale;
  const hasIcon = Boolean(Icon || logo);
  assertMetricNodeGeometry({
    zone,
    left,
    top,
    width,
    height,
    title,
    value,
    hasIcon,
  });
  const cardRadius = Math.round(28 * scale);
  const borderWidth = cardBorder(zone);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: cardRadius,
        border: `${borderWidth}px solid ${color}`,
        background: `${OB1.BG_DARK}dd`,
        boxShadow: `0 0 ${Math.round(32 * scale)}px ${color}20`,
        padding: `${Math.round(18 * scale)}px ${Math.round(24 * scale)}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: Math.round(10 * scale),
        opacity,
        zIndex: 1,
        overflow: "visible",
      }}
    >
      {hasIcon && (
        <div
          style={{
            display: "flex",
            justifyContent: align === "center" ? "center" : "flex-start",
            alignItems: "center",
            minHeight: Math.round(74 * scale),
            width: "100%",
            paddingTop: Math.round(6 * scale),
          }}
        >
          {logo ? (
            <div
              style={{
                width: Math.round(72 * scale),
                height: Math.round(72 * scale),
                borderRadius: Math.round(18 * scale),
                background: `${OB1.WHITE}12`,
                border: `${Math.round(2 * scale)}px solid ${OB1.WHITE}18`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderNodeAsset({ zone, logo, logoMono, color, large: true })}
            </div>
          ) : (
            renderNodeAsset({ zone, Icon, logo, logoMono, color, large: true })
          )}
        </div>
      )}

      <div
        style={{
          fontSize: Math.round(valueSize * scale),
          fontWeight: 800,
          fontFamily: FONTS.heading,
          color: accent ?? OB1.WHITE,
          textAlign,
          lineHeight: 1,
          zIndex: 10,
          position: "relative",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: Math.round(titleSize * scale),
          fontWeight: 700,
          fontFamily: FONTS.heading,
          color: OB1.WHITE,
          textAlign,
          lineHeight: 1.05,
          zIndex: 10,
          position: "relative",
          maxWidth: "100%",
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const SubtitleCardNode: React.FC<SubtitleCardNodeProps> = ({
  zone,
  left,
  top,
  width,
  height,
  title,
  subtitle,
  accent,
  opacity = 1,
  color = OB1.STEEL,
  icon: Icon,
  logo,
  logoMono = false,
  titleSize = 46,
  subtitleSize = 40,
  align = "center",
}) => {
  const textAlign = align;
  const scale = zone.scale;
  const hasIcon = Boolean(Icon || logo);
  assertSubtitleCardGeometry({
    zone,
    left,
    top,
    width,
    height,
    title,
    subtitle,
    hasIcon,
  });
  const cardRadius = Math.round(28 * scale);
  const borderWidth = cardBorder(zone);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: cardRadius,
        border: `${borderWidth}px solid ${color}`,
        background: `${OB1.BG_DARK}dd`,
        boxShadow: `0 0 ${Math.round(32 * scale)}px ${color}20`,
        padding: `${Math.round(18 * scale)}px ${Math.round(24 * scale)}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: Math.round(10 * scale),
        opacity,
        zIndex: 1,
        overflow: "visible",
      }}
    >
      {hasIcon && (
        <div
          style={{
            display: "flex",
            justifyContent: align === "center" ? "center" : "flex-start",
            alignItems: "center",
            minHeight: Math.round(74 * scale),
            width: "100%",
            paddingTop: Math.round(6 * scale),
          }}
        >
          {logo ? (
            <div
              style={{
                width: Math.round(72 * scale),
                height: Math.round(72 * scale),
                borderRadius: Math.round(18 * scale),
                background: `${OB1.WHITE}12`,
                border: `${Math.round(2 * scale)}px solid ${OB1.WHITE}18`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderNodeAsset({ zone, logo, logoMono, color, large: true })}
            </div>
          ) : (
            renderNodeAsset({ zone, Icon, logo, logoMono, color, large: true })
          )}
        </div>
      )}

      <div
        style={{
          fontSize: Math.round(titleSize * scale),
          fontWeight: 700,
          fontFamily: FONTS.heading,
          color: OB1.WHITE,
          textAlign,
          lineHeight: 1.05,
          zIndex: 10,
          position: "relative",
          maxWidth: "100%",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: Math.round(subtitleSize * scale),
          fontWeight: 500,
          fontFamily: FONTS.heading,
          color: accent ?? color,
          textAlign,
          lineHeight: 1.08,
          zIndex: 10,
          position: "relative",
          maxWidth: "100%",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export {
  assertSceneSpacing,
  getMetricNodeBounds,
  getSubtitleCardBounds,
  getTitleNodeBounds,
};

type BadgeProps = {
  zone: GfxZone;
  left: number;
  top: number;
  label: string;
  color?: string;
  opacity?: number;
};

export const Badge: React.FC<BadgeProps> = ({
  zone,
  left,
  top,
  label,
  color = OB1.ORANGE,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      padding: `${Math.round(10 * zone.scale)}px ${Math.round(18 * zone.scale)}px`,
      borderRadius: Math.round(999 * zone.scale),
      background: `${color}22`,
      border: `${Math.round(2 * zone.scale)}px solid ${color}`,
      fontSize: Math.round(40 * zone.scale),
      fontWeight: 700,
      fontFamily: FONTS.heading,
      color,
      lineHeight: 1,
      opacity,
      zIndex: 10,
    }}
  >
    {label}
  </div>
);

type ConnectorProps = {
  zone: GfxZone;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  opacity?: number;
  dashed?: boolean;
  thickness?: number;
};

export const Connector: React.FC<ConnectorProps> = ({
  zone,
  x1,
  y1,
  x2,
  y2,
  color = OB1.STEEL,
  opacity = 1,
  dashed = false,
  thickness = 4,
}) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowSize = Math.round(18 * zone.scale);
  const backX = x2 - Math.cos(angle) * arrowSize;
  const backY = y2 - Math.sin(angle) * arrowSize;
  const wingAngle = Math.PI / 7;
  const leftX = backX + Math.cos(angle + Math.PI - wingAngle) * arrowSize;
  const leftY = backY + Math.sin(angle + Math.PI - wingAngle) * arrowSize;
  const rightX = backX + Math.cos(angle + Math.PI + wingAngle) * arrowSize;
  const rightY = backY + Math.sin(angle + Math.PI + wingAngle) * arrowSize;

  return (
    <svg
      width={zone.width}
      height={zone.height}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        pointerEvents: "none",
        opacity,
        zIndex: 0,
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={Math.round(thickness * zone.scale)}
        strokeDasharray={dashed ? `${Math.round(14 * zone.scale)} ${Math.round(10 * zone.scale)}` : undefined}
        strokeLinecap="round"
      />
      <polygon
        points={`${x2},${y2} ${leftX},${leftY} ${rightX},${rightY}`}
        fill={color}
      />
    </svg>
  );
};

type RingProps = {
  zone: GfxZone;
  size: number;
  color?: string;
  opacity?: number;
};

export const GlowRing: React.FC<RingProps> = ({
  zone,
  size,
  color = OB1.CYAN,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${Math.round(3 * zone.scale)}px solid ${color}`,
      boxShadow: `0 0 ${Math.round(24 * zone.scale)}px ${color}30`,
      opacity,
      zIndex: 0,
    }}
  />
);

type ColumnProps = {
  zone: GfxZone;
  left: number;
  bottom: number;
  width: number;
  height: number;
  label: string;
  color?: string;
  opacity?: number;
};

export const StatColumn: React.FC<ColumnProps> = ({
  zone,
  left,
  bottom,
  width,
  height,
  label,
  color = OB1.CYAN,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      bottom,
      width,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: Math.round(14 * zone.scale),
      opacity,
      zIndex: 1,
    }}
  >
    <div
      style={{
        width,
        height,
        borderRadius: Math.round(18 * zone.scale),
        background: `linear-gradient(180deg, ${color}, ${color}55)`,
      }}
    />
    <div
      style={{
        fontSize: Math.round(40 * zone.scale),
        fontWeight: 700,
        fontFamily: FONTS.heading,
        color: OB1.WHITE,
        textAlign: "center",
        lineHeight: 1,
        zIndex: 10,
      }}
    >
      {label}
    </div>
  </div>
);

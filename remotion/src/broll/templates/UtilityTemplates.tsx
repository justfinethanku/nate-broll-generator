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

type TemplateBase = {
  title: string;
  subtitle?: string;
  bottomLabel?: string;
  bottomAccent?: string;
};

export type TemplateTextItem = {
  role?: string;
  label: string;
  note?: string;
  color: string;
};

export type SequenceTemplateCall = TemplateBase & {
  template: "sequence";
  steps: TemplateTextItem[];
};

export type GateTemplateCall = TemplateBase & {
  template: "gate";
  before: TemplateTextItem;
  gate: TemplateTextItem;
  after: TemplateTextItem;
};

export type SurfaceTemplateCall = TemplateBase & {
  template: "surface";
  surface: TemplateTextItem;
  supports: TemplateTextItem[];
};

export type LoopTemplateCall = TemplateBase & {
  template: "loop";
  steps: TemplateTextItem[];
  center?: string;
};

export type ProgressionTemplateCall = TemplateBase & {
  template: "progression";
  stages: TemplateTextItem[];
};

export type FormulaTerm = TemplateTextItem & {
  operator?: "+" | "x" | "->";
};

export type FormulaTemplateCall = TemplateBase & {
  template: "formula";
  terms: FormulaTerm[];
  result: TemplateTextItem;
};

export type AllocationSegment = TemplateTextItem & {
  weight: number;
};

export type AllocationTemplateCall = TemplateBase & {
  template: "allocation";
  segments: AllocationSegment[];
};

export type UtilityTemplateCall =
  | SequenceTemplateCall
  | GateTemplateCall
  | SurfaceTemplateCall
  | LoopTemplateCall
  | ProgressionTemplateCall
  | FormulaTemplateCall
  | AllocationTemplateCall;

const MAX_ROLE_CHARS = 12;
const MAX_LABEL_CHARS = 22;
const MAX_NOTE_CHARS = 20;
const MAX_CENTER_CHARS = 18;

const reveal = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const yIn = (frame: number, start: number, distance = 24) => {
  const p = reveal(frame, start);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

const assertColor = (templateName: string, itemName: string, color: string) => {
  if (!isTemplateColorToken(color)) {
    throw new Error(
      `[${templateName}] ${itemName} color must be a supported token. Use one of: amber, cyan, green, orange, purple, red, steel.`
    );
  }
};

const assertTextItem = (
  templateName: string,
  itemName: string,
  item: TemplateTextItem
) => {
  assertColor(templateName, itemName, item.color);

  if (item.role && item.role.length > MAX_ROLE_CHARS) {
    throw new Error(
      `[${templateName}] ${itemName} role is too long. Keep it at ${MAX_ROLE_CHARS} characters or fewer.`
    );
  }

  if (item.label.length > MAX_LABEL_CHARS) {
    throw new Error(
      `[${templateName}] ${itemName} label is too long. Keep it at ${MAX_LABEL_CHARS} characters or fewer.`
    );
  }

  if (item.note && item.note.length > MAX_NOTE_CHARS) {
    throw new Error(
      `[${templateName}] ${itemName} note is too long. Keep it at ${MAX_NOTE_CHARS} characters or fewer.`
    );
  }
};

const resolveItem = <TItem extends TemplateTextItem>(item: TItem): TItem => ({
  ...item,
  color: resolveTemplateColor(item.color),
});

const StageCard: React.FC<{
  item: TemplateTextItem;
  align?: "left" | "center";
  frame: number;
  start: number;
  width: number;
  height: number;
  scale: number;
}> = ({ item, align = "left", frame, start, width, height, scale }) => {
  const color = item.color;

  return (
    <div
      style={{
        ...yIn(frame, start),
        width,
        height,
        borderRadius: Math.round(24 * scale),
        border: `2px solid ${color}`,
        background: `${OB1.BG_DARK}b8`,
        boxShadow: `0 ${Math.round(16 * scale)}px ${Math.round(42 * scale)}px ${color}20`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        padding: `${Math.round(22 * scale)}px ${Math.round(28 * scale)}px`,
        boxSizing: "border-box",
      }}
    >
      {item.role ? (
        <div
          style={{
            color,
            fontFamily: FONTS.heading,
            fontSize: Math.round(21 * scale),
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: Math.round(12 * scale),
            textAlign: align,
            width: "100%",
          }}
        >
          {item.role}
        </div>
      ) : null}
      <div
        style={{
          color: OB1.WHITE,
          fontFamily: FONTS.heading,
          fontSize: Math.round(44 * scale),
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.02,
          textAlign: align,
          width: "100%",
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </div>
      {item.note ? (
        <div
          style={{
            color,
            fontFamily: FONTS.heading,
            fontSize: Math.round(26 * scale),
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: Math.round(8 * scale),
            textAlign: align,
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {item.note}
        </div>
      ) : null}
    </div>
  );
};

const SequenceScene: React.FC<{
  frame: number;
  zone: GfxZone;
  steps: TemplateTextItem[];
}> = ({ frame, zone, steps }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const gap = Math.round(42 * zone.scale);
  const cardWidth = Math.floor((zone.width - gap * (steps.length - 1)) / steps.length);
  const cardHeight = Math.round(156 * zone.scale);
  const top = Math.round((zone.height - cardHeight) / 2);
  const arrowY = top + cardHeight / 2;

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      <svg
        width={zone.width}
        height={zone.height}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        {steps.slice(0, -1).map((step, index) => {
          const progress = reveal(sceneFrame, 28 + index * 14, 16);
          const x1 = (index + 1) * cardWidth + index * gap + Math.round(12 * zone.scale);
          const x2 = x1 + gap - Math.round(24 * zone.scale);
          const color = step.color;

          return (
            <g key={`${step.label}-${index}`} opacity={progress}>
              <line
                x1={x1}
                y1={arrowY}
                x2={x2}
                y2={arrowY}
                stroke={color}
                strokeWidth={Math.round(4 * zone.scale)}
                strokeLinecap="round"
              />
              <path
                d={`M ${x2 - 12 * zone.scale} ${arrowY - 10 * zone.scale} L ${x2} ${arrowY} L ${x2 - 12 * zone.scale} ${arrowY + 10 * zone.scale}`}
                fill="none"
                stroke={color}
                strokeWidth={Math.round(4 * zone.scale)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      {steps.map((step, index) => (
        <div
          key={step.label}
          style={{
            position: "absolute",
            left: index * (cardWidth + gap),
            top,
          }}
        >
          <StageCard
            item={step}
            frame={sceneFrame}
            start={8 + index * 14}
            width={cardWidth}
            height={cardHeight}
            scale={zone.scale}
          />
        </div>
      ))}
    </div>
  );
};

const GateScene: React.FC<{
  frame: number;
  zone: GfxZone;
  before: TemplateTextItem;
  gate: TemplateTextItem;
  after: TemplateTextItem;
}> = ({ frame, zone, before, gate, after }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const cardH = Math.round(158 * zone.scale);
  const sideW = Math.round(390 * zone.scale);
  const gateW = Math.round(300 * zone.scale);
  const gap = Math.round(54 * zone.scale);
  const totalW = sideW * 2 + gateW + gap * 2;
  const left = Math.round((zone.width - totalW) / 2);
  const top = Math.round((zone.height - cardH) / 2);
  const centerY = top + cardH / 2;

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      <svg width={zone.width} height={zone.height} style={{ position: "absolute" }}>
        {[0, 1].map((index) => {
          const x1 =
            index === 0
              ? left + sideW + Math.round(12 * zone.scale)
              : left + sideW + gap + gateW + Math.round(12 * zone.scale);
          const x2 = x1 + gap - Math.round(24 * zone.scale);
          const progress = reveal(sceneFrame, 28 + index * 12);
          return (
            <g key={index} opacity={progress}>
              <line
                x1={x1}
                y1={centerY}
                x2={x2}
                y2={centerY}
                stroke={OB1.STEEL}
                strokeWidth={Math.round(4 * zone.scale)}
                strokeLinecap="round"
              />
              <path
                d={`M ${x2 - 12 * zone.scale} ${centerY - 10 * zone.scale} L ${x2} ${centerY} L ${x2 - 12 * zone.scale} ${centerY + 10 * zone.scale}`}
                fill="none"
                stroke={OB1.STEEL}
                strokeWidth={Math.round(4 * zone.scale)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left, top }}>
        <StageCard item={before} frame={sceneFrame} start={8} width={sideW} height={cardH} scale={zone.scale} />
      </div>
      <div style={{ position: "absolute", left: left + sideW + gap, top }}>
        <StageCard
          item={gate}
          align="center"
          frame={sceneFrame}
          start={22}
          width={gateW}
          height={cardH}
          scale={zone.scale}
        />
      </div>
      <div style={{ position: "absolute", left: left + sideW + gap + gateW + gap, top }}>
        <StageCard item={after} frame={sceneFrame} start={36} width={sideW} height={cardH} scale={zone.scale} />
      </div>
    </div>
  );
};

const SurfaceScene: React.FC<{
  frame: number;
  zone: GfxZone;
  surface: TemplateTextItem;
  supports: TemplateTextItem[];
}> = ({ frame, zone, surface, supports }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const slabW = Math.round(zone.width * 0.72);
  const slabH = Math.round(220 * zone.scale);
  const slabLeft = Math.round((zone.width - slabW) / 2);
  const slabTop = Math.round(zone.height * 0.18);
  const supportGap = Math.round(24 * zone.scale);
  const supportW = Math.floor((slabW - supportGap * (supports.length - 1)) / supports.length);
  const supportH = Math.round(120 * zone.scale);
  const supportTop = slabTop + slabH + Math.round(42 * zone.scale);
  const slabProgress = reveal(sceneFrame, 8, 22);

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      <div
        style={{
          position: "absolute",
          left: slabLeft,
          top: slabTop,
          width: slabW,
          height: slabH,
          opacity: slabProgress,
          transform: `translateY(${(1 - slabProgress) * 26}px)`,
          borderRadius: Math.round(34 * zone.scale),
          border: `2px solid ${surface.color}`,
          background: `linear-gradient(180deg, ${OB1.BG_MID}88, ${OB1.BG_DARK}e6)`,
          boxShadow: `0 ${Math.round(28 * zone.scale)}px ${Math.round(72 * zone.scale)}px ${surface.color}1f`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: Math.round(64 * zone.scale),
          boxSizing: "border-box",
        }}
      >
        {surface.role ? (
          <div
            style={{
              color: surface.color,
              fontFamily: FONTS.heading,
              fontSize: Math.round(24 * zone.scale),
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: Math.round(14 * zone.scale),
            }}
          >
            {surface.role}
          </div>
        ) : null}
        <div
          style={{
            color: OB1.WHITE,
            fontFamily: FONTS.heading,
            fontSize: Math.round(62 * zone.scale),
            fontWeight: 850,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {surface.label}
        </div>
        {surface.note ? (
          <div
            style={{
              color: surface.color,
              fontFamily: FONTS.heading,
              fontSize: Math.round(30 * zone.scale),
              fontWeight: 700,
              marginTop: Math.round(12 * zone.scale),
            }}
          >
            {surface.note}
          </div>
        ) : null}
      </div>
      {supports.map((support, index) => (
        <div
          key={support.label}
          style={{
            position: "absolute",
            left: slabLeft + index * (supportW + supportGap),
            top: supportTop,
          }}
        >
          <StageCard
            item={support}
            align="center"
            frame={sceneFrame}
            start={34 + index * 10}
            width={supportW}
            height={supportH}
            scale={zone.scale}
          />
        </div>
      ))}
    </div>
  );
};

const LoopScene: React.FC<{
  frame: number;
  zone: GfxZone;
  steps: TemplateTextItem[];
  center?: string;
}> = ({ frame, zone, steps, center }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const cx = zone.width / 2;
  const cy = zone.height / 2;
  const radiusX = Math.round(zone.width * 0.28);
  const radiusY = Math.round(zone.height * 0.25);
  const cardW = Math.round(300 * zone.scale);
  const cardH = Math.round(124 * zone.scale);
  const railProgress = reveal(sceneFrame, 8, 28);

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      <svg width={zone.width} height={zone.height} style={{ position: "absolute" }}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={radiusX}
          ry={radiusY}
          fill="none"
          stroke={OB1.STEEL}
          strokeWidth={Math.round(3 * zone.scale)}
          strokeDasharray={`${Math.round(20 * zone.scale)} ${Math.round(16 * zone.scale)}`}
          opacity={0.35 * railProgress}
        />
        <path
          d={`M ${cx + radiusX - 18 * zone.scale} ${cy - 12 * zone.scale} L ${cx + radiusX + 6 * zone.scale} ${cy} L ${cx + radiusX - 18 * zone.scale} ${cy + 12 * zone.scale}`}
          fill="none"
          stroke={steps[0]?.color ?? OB1.CYAN}
          strokeWidth={Math.round(4 * zone.scale)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={railProgress}
        />
      </svg>
      {center ? (
        <div
          style={{
            ...yIn(sceneFrame, 18),
            position: "absolute",
            left: cx - Math.round(160 * zone.scale),
            top: cy - Math.round(48 * zone.scale),
            width: Math.round(320 * zone.scale),
            height: Math.round(96 * zone.scale),
            borderRadius: Math.round(18 * zone.scale),
            background: `${OB1.BG_DARK}cc`,
            border: `2px solid ${OB1.STEEL}55`,
            color: OB1.WHITE,
            fontFamily: FONTS.heading,
            fontSize: Math.round(34 * zone.scale),
            fontWeight: 800,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {center}
        </div>
      ) : null}
      {steps.map((step, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / steps.length;
        const x = cx + Math.cos(angle) * radiusX - cardW / 2;
        const y = cy + Math.sin(angle) * radiusY - cardH / 2;

        return (
          <div key={step.label} style={{ position: "absolute", left: x, top: y }}>
            <StageCard
              item={step}
              align="center"
              frame={sceneFrame}
              start={24 + index * 10}
              width={cardW}
              height={cardH}
              scale={zone.scale}
            />
          </div>
        );
      })}
    </div>
  );
};

const ProgressionScene: React.FC<{
  frame: number;
  zone: GfxZone;
  stages: TemplateTextItem[];
}> = ({ frame, zone, stages }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const gap = Math.round(28 * zone.scale);
  const stageW = Math.floor((zone.width * 0.78 - gap * (stages.length - 1)) / stages.length);
  const totalW = stageW * stages.length + gap * (stages.length - 1);
  const left = Math.round((zone.width - totalW) / 2);
  const baseY = Math.round(zone.height * 0.72);

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      {stages.map((stage, index) => {
        const barH = Math.round((120 + index * 46) * zone.scale);
        const progress = reveal(sceneFrame, 10 + index * 12, 20);
        const x = left + index * (stageW + gap);
        const y = baseY - barH * progress;

        return (
          <div key={stage.label}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: stageW,
                height: barH * progress,
                borderRadius: `${Math.round(22 * zone.scale)}px ${Math.round(22 * zone.scale)}px ${Math.round(8 * zone.scale)}px ${Math.round(8 * zone.scale)}px`,
                background: `${stage.color}22`,
                border: `2px solid ${stage.color}`,
                boxShadow: `0 ${Math.round(18 * zone.scale)}px ${Math.round(50 * zone.scale)}px ${stage.color}1f`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                top: baseY + Math.round(24 * zone.scale),
                width: stageW,
                opacity: progress,
                color: OB1.WHITE,
                fontFamily: FONTS.heading,
                textAlign: "center",
              }}
            >
              {stage.role ? (
                <div
                  style={{
                    color: stage.color,
                    fontSize: Math.round(20 * zone.scale),
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: Math.round(8 * zone.scale),
                  }}
                >
                  {stage.role}
                </div>
              ) : null}
              <div
                style={{
                  fontSize: Math.round(32 * zone.scale),
                  fontWeight: 850,
                  letterSpacing: "-0.03em",
                  whiteSpace: "nowrap",
                }}
              >
                {stage.label}
              </div>
              {stage.note ? (
                <div
                  style={{
                    color: stage.color,
                    fontSize: Math.round(22 * zone.scale),
                    fontWeight: 700,
                    marginTop: Math.round(6 * zone.scale),
                    whiteSpace: "nowrap",
                  }}
                >
                  {stage.note}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FormulaScene: React.FC<{
  frame: number;
  zone: GfxZone;
  terms: FormulaTerm[];
  result: TemplateTextItem;
}> = ({ frame, zone, terms, result }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const formulaItems = [...terms, result];
  const operatorW = Math.round(58 * zone.scale);
  const maxBoxW = Math.round(282 * zone.scale);
  const boxW = Math.min(
    maxBoxW,
    Math.floor((zone.width - terms.length * operatorW) / formulaItems.length)
  );
  const boxH = Math.round(138 * zone.scale);
  const totalW = formulaItems.length * boxW + terms.length * operatorW;
  const left = Math.round((zone.width - totalW) / 2);
  const top = Math.round((zone.height - boxH) / 2);

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      {formulaItems.map((item, index) => {
        const isResult = index === formulaItems.length - 1;
        const x = left + index * boxW + index * operatorW;
        const operator = index === terms.length - 1 ? "=" : terms[index]?.operator ?? "+";

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <div style={{ position: "absolute", left: x, top }}>
              <StageCard
                item={item}
                align="center"
                frame={sceneFrame}
                start={8 + index * 12}
                width={boxW}
                height={boxH}
                scale={zone.scale}
              />
            </div>
            {!isResult ? (
              <div
                style={{
                  ...yIn(sceneFrame, 18 + index * 12),
                  position: "absolute",
                  left: x + boxW,
                  top,
                  width: operatorW,
                  height: boxH,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: OB1.STEEL,
                  fontFamily: FONTS.heading,
                  fontSize: Math.round(54 * zone.scale),
                  fontWeight: 850,
                  lineHeight: 1,
                }}
              >
                {operator === "->" ? "->" : operator}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const AllocationScene: React.FC<{
  frame: number;
  zone: GfxZone;
  segments: AllocationSegment[];
}> = ({ frame, zone, segments }) => {
  const sceneFrame = Math.max(0, frame - 90);
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  const barW = Math.round(zone.width * 0.78);
  const barH = Math.round(150 * zone.scale);
  const left = Math.round((zone.width - barW) / 2);
  const top = Math.round((zone.height - barH) / 2);
  let cursor = 0;

  return (
    <div style={{ position: "relative", width: zone.width, height: zone.height }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: barW,
          height: barH,
          borderRadius: Math.round(32 * zone.scale),
          overflow: "hidden",
          border: `2px solid ${OB1.STEEL}55`,
          background: `${OB1.BG_DARK}cc`,
        }}
      >
        {segments.map((segment, index) => {
          const width = Math.round((segment.weight / totalWeight) * barW);
          const progress = reveal(sceneFrame, 8 + index * 10, 18);
          const x = cursor;
          cursor += width;

          return (
            <div
              key={segment.label}
              style={{
                position: "absolute",
                left: x,
                top: 0,
                width,
                height: "100%",
                opacity: progress,
                transform: `scaleX(${progress})`,
                transformOrigin: "left center",
                background: `${segment.color}30`,
                borderRight:
                  index === segments.length - 1
                    ? undefined
                    : `2px solid ${OB1.BG_DARK}`,
              }}
            />
          );
        })}
      </div>
      {segments.map((segment, index) => {
        const startX =
          left +
          segments
            .slice(0, index)
            .reduce((sum, item) => sum + Math.round((item.weight / totalWeight) * barW), 0);
        const width = Math.round((segment.weight / totalWeight) * barW);
        const progress = reveal(sceneFrame, 28 + index * 8, 16);

        return (
          <div
            key={`${segment.label}-label`}
            style={{
              position: "absolute",
              left: startX,
              top: top + barH + Math.round(28 * zone.scale),
              width,
              opacity: progress,
              textAlign: "center",
              fontFamily: FONTS.heading,
            }}
          >
            {segment.role ? (
              <div
                style={{
                  color: segment.color,
                  fontSize: Math.round(19 * zone.scale),
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: Math.round(7 * zone.scale),
                }}
              >
                {segment.role}
              </div>
            ) : null}
            <div
              style={{
                color: OB1.WHITE,
                fontSize: Math.round(30 * zone.scale),
                fontWeight: 850,
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
              }}
            >
              {segment.label}
            </div>
            {segment.note ? (
              <div
                style={{
                  color: segment.color,
                  fontSize: Math.round(21 * zone.scale),
                  fontWeight: 700,
                  marginTop: Math.round(6 * zone.scale),
                  whiteSpace: "nowrap",
                }}
              >
                {segment.note}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const TemplateShell: React.FC<
  TemplateBase & {
    renderScene: (frame: number, zone: GfxZone) => React.ReactNode;
  }
> = ({ title, subtitle, bottomLabel, bottomAccent, renderScene }) => (
  <BRollTemplate
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    scenes={[
      {
        start: 90,
        end: 300,
        render: (frame, _progress, zone) => renderScene(frame, zone),
      },
    ]}
  />
);

export const SequenceTemplate: React.FC<Omit<SequenceTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  steps,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => <SequenceScene frame={frame} zone={zone} steps={steps} />}
  />
);

export const GateTemplate: React.FC<Omit<GateTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  before,
  gate,
  after,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => (
      <GateScene frame={frame} zone={zone} before={before} gate={gate} after={after} />
    )}
  />
);

export const SurfaceTemplate: React.FC<Omit<SurfaceTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  surface,
  supports,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => (
      <SurfaceScene frame={frame} zone={zone} surface={surface} supports={supports} />
    )}
  />
);

export const LoopTemplate: React.FC<Omit<LoopTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  steps,
  center,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => (
      <LoopScene frame={frame} zone={zone} steps={steps} center={center} />
    )}
  />
);

export const ProgressionTemplate: React.FC<Omit<ProgressionTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  stages,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => (
      <ProgressionScene frame={frame} zone={zone} stages={stages} />
    )}
  />
);

export const FormulaTemplate: React.FC<Omit<FormulaTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  terms,
  result,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => (
      <FormulaScene frame={frame} zone={zone} terms={terms} result={result} />
    )}
  />
);

export const AllocationTemplate: React.FC<Omit<AllocationTemplateCall, "template">> = ({
  title,
  subtitle,
  bottomLabel,
  bottomAccent,
  segments,
}) => (
  <TemplateShell
    title={title}
    subtitle={subtitle}
    bottomLabel={bottomLabel}
    bottomAccent={bottomAccent}
    renderScene={(frame, zone) => <AllocationScene frame={frame} zone={zone} segments={segments} />}
  />
);

export const validateSequenceTemplateCall = (call: SequenceTemplateCall) => {
  if (call.steps.length < 3 || call.steps.length > 4) {
    throw new Error("[SequenceTemplate] requires 3 to 4 steps.");
  }
  call.steps.forEach((step, index) => assertTextItem("SequenceTemplate", `step ${index + 1}`, step));
};

export const validateGateTemplateCall = (call: GateTemplateCall) => {
  assertTextItem("GateTemplate", "before", call.before);
  assertTextItem("GateTemplate", "gate", call.gate);
  assertTextItem("GateTemplate", "after", call.after);
};

export const validateSurfaceTemplateCall = (call: SurfaceTemplateCall) => {
  if (call.supports.length < 2 || call.supports.length > 3) {
    throw new Error("[SurfaceTemplate] requires 2 to 3 support items.");
  }
  assertTextItem("SurfaceTemplate", "surface", call.surface);
  call.supports.forEach((support, index) =>
    assertTextItem("SurfaceTemplate", `support ${index + 1}`, support)
  );
};

export const validateLoopTemplateCall = (call: LoopTemplateCall) => {
  if (call.steps.length < 3 || call.steps.length > 4) {
    throw new Error("[LoopTemplate] requires 3 to 4 loop steps.");
  }
  if (call.center && call.center.length > MAX_CENTER_CHARS) {
    throw new Error(
      `[LoopTemplate] center label is too long. Keep it at ${MAX_CENTER_CHARS} characters or fewer.`
    );
  }
  call.steps.forEach((step, index) => assertTextItem("LoopTemplate", `step ${index + 1}`, step));
};

export const validateProgressionTemplateCall = (call: ProgressionTemplateCall) => {
  if (call.stages.length < 3 || call.stages.length > 5) {
    throw new Error("[ProgressionTemplate] requires 3 to 5 stages.");
  }
  call.stages.forEach((stage, index) =>
    assertTextItem("ProgressionTemplate", `stage ${index + 1}`, stage)
  );
};

export const validateFormulaTemplateCall = (call: FormulaTemplateCall) => {
  if (call.terms.length < 2 || call.terms.length > 3) {
    throw new Error("[FormulaTemplate] requires 2 to 3 input terms.");
  }
  call.terms.forEach((term, index) => {
    assertTextItem("FormulaTemplate", `term ${index + 1}`, term);
    if (term.operator && !["+", "x", "->"].includes(term.operator)) {
      throw new Error('[FormulaTemplate] operator must be "+", "x", or "->".');
    }
  });
  assertTextItem("FormulaTemplate", "result", call.result);
};

export const validateAllocationTemplateCall = (call: AllocationTemplateCall) => {
  if (call.segments.length < 2 || call.segments.length > 4) {
    throw new Error("[AllocationTemplate] requires 2 to 4 segments.");
  }
  call.segments.forEach((segment, index) => {
    assertTextItem("AllocationTemplate", `segment ${index + 1}`, segment);
    if (!Number.isFinite(segment.weight) || segment.weight <= 0) {
      throw new Error("[AllocationTemplate] segment weights must be positive numbers.");
    }
  });
};

export const renderSequenceTemplateCall = (call: SequenceTemplateCall) => {
  validateSequenceTemplateCall(call);
  return <SequenceTemplate {...call} steps={call.steps.map(resolveItem)} />;
};

export const renderGateTemplateCall = (call: GateTemplateCall) => {
  validateGateTemplateCall(call);
  return (
    <GateTemplate
      {...call}
      before={resolveItem(call.before)}
      gate={resolveItem(call.gate)}
      after={resolveItem(call.after)}
    />
  );
};

export const renderSurfaceTemplateCall = (call: SurfaceTemplateCall) => {
  validateSurfaceTemplateCall(call);
  return (
    <SurfaceTemplate
      {...call}
      surface={resolveItem(call.surface)}
      supports={call.supports.map(resolveItem)}
    />
  );
};

export const renderLoopTemplateCall = (call: LoopTemplateCall) => {
  validateLoopTemplateCall(call);
  return <LoopTemplate {...call} steps={call.steps.map(resolveItem)} />;
};

export const renderProgressionTemplateCall = (call: ProgressionTemplateCall) => {
  validateProgressionTemplateCall(call);
  return <ProgressionTemplate {...call} stages={call.stages.map(resolveItem)} />;
};

export const renderFormulaTemplateCall = (call: FormulaTemplateCall) => {
  validateFormulaTemplateCall(call);
  return (
    <FormulaTemplate
      {...call}
      terms={call.terms.map(resolveItem)}
      result={resolveItem(call.result)}
    />
  );
};

export const renderAllocationTemplateCall = (call: AllocationTemplateCall) => {
  validateAllocationTemplateCall(call);
  return <AllocationTemplate {...call} segments={call.segments.map(resolveItem)} />;
};

export const validateUtilityTemplateCall = (
  call: UtilityTemplateCall,
  _zone: GfxZone = getDefaultGfxZone()
) => {
  switch (call.template) {
    case "sequence":
      return validateSequenceTemplateCall(call);
    case "gate":
      return validateGateTemplateCall(call);
    case "surface":
      return validateSurfaceTemplateCall(call);
    case "loop":
      return validateLoopTemplateCall(call);
    case "progression":
      return validateProgressionTemplateCall(call);
    case "formula":
      return validateFormulaTemplateCall(call);
    case "allocation":
      return validateAllocationTemplateCall(call);
  }
};

export const renderUtilityTemplateCall = (call: UtilityTemplateCall) => {
  switch (call.template) {
    case "sequence":
      return renderSequenceTemplateCall(call);
    case "gate":
      return renderGateTemplateCall(call);
    case "surface":
      return renderSurfaceTemplateCall(call);
    case "loop":
      return renderLoopTemplateCall(call);
    case "progression":
      return renderProgressionTemplateCall(call);
    case "formula":
      return renderFormulaTemplateCall(call);
    case "allocation":
      return renderAllocationTemplateCall(call);
  }
};

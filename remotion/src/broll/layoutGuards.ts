import type { GfxZone } from "./shared";

export type NodeFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type NodeBounds = NodeFrame & {
  label: string;
};

type BaseLayout = NodeFrame & {
  zone: GfxZone;
  title: string;
  hasIcon?: boolean;
};

export type TitleNodeLayout = BaseLayout;

export type MetricNodeLayout = BaseLayout & {
  value: string;
};

export type SubtitleCardLayout = BaseLayout & {
  subtitle: string;
};

export type SceneSpacingOptions = {
  minGapX?: number;
  minGapY?: number;
};

const px = (zone: GfxZone, value: number) => Math.round(value * zone.scale);

const TITLE_BADGE_SIZE = 60;
const TITLE_BADGE_GAP = 10;
const TITLE_INLINE_ICON_MIN_HEIGHT = 150;
const TITLE_MIN_WIDTH = 180;
const TITLE_MIN_HEIGHT = 86;
const METRIC_MIN_WIDTH = 280;
const METRIC_MIN_HEIGHT = 170;
const METRIC_MIN_HEIGHT_WITH_ICON = 170;
const SUBTITLE_MIN_WIDTH = 280;
const SUBTITLE_MIN_HEIGHT = 210;
const SUBTITLE_MIN_HEIGHT_WITH_ICON = 250;
const DEFAULT_SCENE_GAP = 36;

const describe = (label: string, kind: string) => `${kind}:${label}`;

const assertPositiveDimensions = (frame: NodeFrame, label: string) => {
  if (frame.width <= 0 || frame.height <= 0) {
    throw new Error(`[${label}] width and height must be positive.`);
  }
};

const assertMinDimensions = (
  frame: NodeFrame,
  label: string,
  minWidth: number,
  minHeight: number,
  why: string
) => {
  const actualWidth = Math.round(frame.width);
  const actualHeight = Math.round(frame.height);

  if (actualWidth < minWidth) {
    throw new Error(
      `[${label}] width ${actualWidth}px is too small; need at least ${minWidth}px ${why}.`
    );
  }

  if (actualHeight < minHeight) {
    throw new Error(
      `[${label}] height ${actualHeight}px is too small; need at least ${minHeight}px ${why}.`
    );
  }
};

const assertWithinZone = (zone: GfxZone, bounds: NodeBounds, label: string) => {
  if (bounds.left < 0 || bounds.top < 0) {
    throw new Error(`[${label}] node starts outside the graphics zone.`);
  }

  if (bounds.left + bounds.width > zone.width) {
    throw new Error(
      `[${label}] node extends past the right edge of the graphics zone.`
    );
  }

  if (bounds.top + bounds.height > zone.height) {
    throw new Error(
      `[${label}] node extends past the bottom edge of the graphics zone.`
    );
  }
};

export const titleNodeUsesInlineIcon = ({
  zone,
  height,
  hasIcon = false,
}: Pick<TitleNodeLayout, "zone" | "height" | "hasIcon">) =>
  hasIcon && Math.round(height) >= px(zone, TITLE_INLINE_ICON_MIN_HEIGHT);

export const getTitleNodeBounds = ({
  zone,
  left,
  top,
  width,
  height,
  title,
  hasIcon = false,
}: TitleNodeLayout): NodeBounds => {
  const inlineIcon = titleNodeUsesInlineIcon({ zone, height, hasIcon });
  return {
    label: title,
    left,
    top,
    width,
    height:
      height +
      (hasIcon && !inlineIcon ? px(zone, TITLE_BADGE_SIZE + TITLE_BADGE_GAP) : 0),
  };
};

export const getMetricNodeBounds = ({
  left,
  top,
  width,
  height,
  title,
}: MetricNodeLayout): NodeBounds => ({
  label: title,
  left,
  top,
  width,
  height,
});

export const getSubtitleCardBounds = ({
  left,
  top,
  width,
  height,
  title,
}: SubtitleCardLayout): NodeBounds => ({
  label: title,
  left,
  top,
  width,
  height,
});

export const assertTitleNodeGeometry = (layout: TitleNodeLayout): NodeBounds => {
  const label = describe(layout.title, "TitleNode");
  assertPositiveDimensions(layout, label);
  assertMinDimensions(
    layout,
    label,
    px(layout.zone, TITLE_MIN_WIDTH),
    px(layout.zone, TITLE_MIN_HEIGHT),
    "for a title-only card"
  );
  const bounds = getTitleNodeBounds(layout);
  assertWithinZone(layout.zone, bounds, label);
  return bounds;
};

export const assertMetricNodeGeometry = (layout: MetricNodeLayout): NodeBounds => {
  const label = describe(layout.title, "MetricNode");
  assertPositiveDimensions(layout, label);
  assertMinDimensions(
    layout,
    label,
    px(layout.zone, METRIC_MIN_WIDTH),
    px(layout.zone, layout.hasIcon ? METRIC_MIN_HEIGHT_WITH_ICON : METRIC_MIN_HEIGHT),
    "for a metric card"
  );
  const bounds = getMetricNodeBounds(layout);
  assertWithinZone(layout.zone, bounds, label);
  return bounds;
};

export const assertSubtitleCardGeometry = (
  layout: SubtitleCardLayout
): NodeBounds => {
  const label = describe(layout.title, "SubtitleCardNode");
  assertPositiveDimensions(layout, label);
  assertMinDimensions(
    layout,
    label,
    px(layout.zone, SUBTITLE_MIN_WIDTH),
    px(
      layout.zone,
      layout.hasIcon ? SUBTITLE_MIN_HEIGHT_WITH_ICON : SUBTITLE_MIN_HEIGHT
    ),
    "for an icon/title/subtitle card"
  );
  const bounds = getSubtitleCardBounds(layout);
  assertWithinZone(layout.zone, bounds, label);
  return bounds;
};

const expandBounds = (bounds: NodeBounds, gapX: number, gapY: number): NodeBounds => ({
  ...bounds,
  left: bounds.left - gapX / 2,
  top: bounds.top - gapY / 2,
  width: bounds.width + gapX,
  height: bounds.height + gapY,
});

const intersects = (a: NodeBounds, b: NodeBounds) =>
  a.left < b.left + b.width &&
  a.left + a.width > b.left &&
  a.top < b.top + b.height &&
  a.top + a.height > b.top;

export const assertSceneSpacing = (
  sceneLabel: string,
  zone: GfxZone,
  bounds: NodeBounds[],
  options: SceneSpacingOptions = {}
) => {
  const minGapX = options.minGapX ?? px(zone, DEFAULT_SCENE_GAP);
  const minGapY = options.minGapY ?? px(zone, DEFAULT_SCENE_GAP);

  bounds.forEach((bound) => {
    assertWithinZone(zone, bound, `${sceneLabel}:${bound.label}`);
  });

  for (let i = 0; i < bounds.length; i += 1) {
    for (let j = i + 1; j < bounds.length; j += 1) {
      const first = expandBounds(bounds[i], minGapX, minGapY);
      const second = expandBounds(bounds[j], minGapX, minGapY);
      if (intersects(first, second)) {
        throw new Error(
          `[${sceneLabel}] "${bounds[i].label}" and "${bounds[j].label}" are too close. Keep at least ${minGapX}px horizontal or ${minGapY}px vertical separation between rendered node bounds.`
        );
      }
    }
  }
};

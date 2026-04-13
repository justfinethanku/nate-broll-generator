import { CalculateMetadataFunction } from "remotion";

/** Base props that every composition should include for dynamic override. */
export interface BaseCompositionProps {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  [key: string]: unknown;
}

/**
 * Generic calculateMetadata factory.
 * Pass this to <Composition calculateMetadata={makeMeta()} /> to allow
 * MCP servers or external tools to override fps/width/height/duration via props.
 */
export function makeMeta<
  T extends BaseCompositionProps,
>(): CalculateMetadataFunction<T> {
  return ({ props }) => ({
    fps: props.fps,
    width: props.width,
    height: props.height,
    durationInFrames: props.durationInFrames,
    props,
  });
}

/**
 * WM Batch Aggregator — collects all WM clip batches
 */

import { WM_CLIPS_01 } from "./WM_Clips01";
import { WM_CLIPS_02 } from "./WM_Clips02";
import { WM_CLIPS_03 } from "./WM_Clips03";
import { WM_CLIPS_04 } from "./WM_Clips04";
import { WM_CLIPS_05 } from "./WM_Clips05";

export const WM_COMPS = [
  ...WM_CLIPS_01,
  ...WM_CLIPS_02,
  ...WM_CLIPS_03,
  ...WM_CLIPS_04,
  ...WM_CLIPS_05,
];

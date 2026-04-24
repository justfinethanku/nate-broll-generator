/**
 * NK Batch Aggregator — collects all NK clip batches
 */

import { NK_CLIPS_01 } from "./NK_Clips01";
import { NK_CLIPS_02 } from "./NK_Clips02";
import { NK_CLIPS_03 } from "./NK_Clips03";
import { NK_CLIPS_04 } from "./NK_Clips04";
import { NK_CLIPS_05 } from "./NK_Clips05";
import { NK_CLIPS_06 } from "./NK_Clips06";

export const NK_COMPS = [
  ...NK_CLIPS_01,
  ...NK_CLIPS_02,
  ...NK_CLIPS_03,
  ...NK_CLIPS_04,
  ...NK_CLIPS_05,
  ...NK_CLIPS_06,
];

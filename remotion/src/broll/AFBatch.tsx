/**
 * AF Batch Aggregator — collects all AF clip batches
 */

import { AF_CLIPS_01 } from "./AF_Clips01";
import { AF_CLIPS_02 } from "./AF_Clips02";
import { AF_CLIPS_03 } from "./AF_Clips03";
import { AF_CLIPS_04 } from "./AF_Clips04";
import { AF_CLIPS_05 } from "./AF_Clips05";
import { AF_CLIPS_06 } from "./AF_Clips06";

export const AF_COMPS = [
  ...AF_CLIPS_01,
  ...AF_CLIPS_02,
  ...AF_CLIPS_03,
  ...AF_CLIPS_04,
  ...AF_CLIPS_05,
  ...AF_CLIPS_06,
];

/**
 * AP Batch Aggregator — "Agents Don't Make You Productive" (NAT-685)
 * Collects all AP clip batches into a single export for Root.tsx
 */

import { AP_CLIPS_01 } from "./AP_Clips01";
import { AP_CLIPS_02 } from "./AP_Clips02";
import { AP_CLIPS_03 } from "./AP_Clips03";
import { AP_CLIPS_04 } from "./AP_Clips04";
import { AP_CLIPS_05 } from "./AP_Clips05";
import { AP_CLIPS_06 } from "./AP_Clips06";

export const AP_COMPS = [
  ...AP_CLIPS_01,
  ...AP_CLIPS_02,
  ...AP_CLIPS_03,
  ...AP_CLIPS_04,
  ...AP_CLIPS_05,
  ...AP_CLIPS_06,
];

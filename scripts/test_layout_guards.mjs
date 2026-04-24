import {
  assertMetricNodeGeometry,
  assertSceneSpacing,
  assertSubtitleCardGeometry,
  assertTitleNodeGeometry,
  getTitleNodeBounds,
} from "../remotion/src/broll/layoutGuards.ts";

const zone = { width: 1344, height: 616, scale: 1 };

const expectPass = (label, fn) => {
  fn();
  console.log(`PASS: ${label}`);
};

const expectThrow = (label, fn, pattern) => {
  try {
    fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (pattern && !pattern.test(message)) {
      throw error;
    }
    console.log(`PASS: ${label}`);
    return;
  }

  throw new Error(`Expected failure for: ${label}`);
};

expectPass("valid title node geometry is accepted", () => {
  assertTitleNodeGeometry({
    zone,
    left: zone.width * 0.08,
    top: zone.height * 0.56,
    width: zone.width * 0.22,
    height: zone.height * 0.2,
    title: "Wakeups",
    hasIcon: true,
  });
});

expectPass("valid metric node geometry is accepted", () => {
  assertMetricNodeGeometry({
    zone,
    left: zone.width * 0.34,
    top: zone.height * 0.03,
    width: zone.width * 0.32,
    height: zone.height * 0.3,
    title: "Leaked source",
    value: "CODE",
    hasIcon: true,
  });
});

expectThrow(
  "undersized subtitle card blocks the old CCL-002 search card",
  () => {
    assertSubtitleCardGeometry({
      zone,
      left: zone.width * 0.06,
      top: zone.height * 0.11,
      width: zone.width * 0.24,
      height: zone.height * 0.22,
      title: "Search",
      subtitle: "find context",
      hasIcon: true,
    });
  },
  /SubtitleCardNode:Search/
);

expectThrow(
  "scene spacing rejects the old CCL-010 capture stack",
  () => {
    assertSceneSpacing("CCL-010-old", zone, [
      getTitleNodeBounds({
        zone,
        left: zone.width * 0.22,
        top: zone.height * 0.58,
        width: zone.width * 0.56,
        height: zone.height * 0.16,
        title: "MCP",
      }),
      getTitleNodeBounds({
        zone,
        left: zone.width * 0.26,
        top: zone.height * 0.36,
        width: zone.width * 0.48,
        height: zone.height * 0.16,
        title: "CNW zip",
      }),
      getTitleNodeBounds({
        zone,
        left: zone.width * 0.32,
        top: zone.height * 0.14,
        width: zone.width * 0.36,
        height: zone.height * 0.14,
        title: "Capture",
        hasIcon: true,
      }),
    ]);
  },
  /too close/
);

expectPass("scene spacing accepts the corrected CCL-010 capture stack", () => {
  assertSceneSpacing("CCL-010-new", zone, [
    getTitleNodeBounds({
      zone,
      left: zone.width * 0.22,
      top: zone.height * 0.58,
      width: zone.width * 0.56,
      height: zone.height * 0.16,
      title: "MCP",
    }),
    getTitleNodeBounds({
      zone,
      left: zone.width * 0.26,
      top: zone.height * 0.36,
      width: zone.width * 0.48,
      height: zone.height * 0.16,
      title: "CNW zip",
    }),
    getTitleNodeBounds({
      zone,
      left: zone.width * 0.32,
      top: zone.height * 0.04,
      width: zone.width * 0.36,
      height: zone.height * 0.16,
      title: "Capture",
    }),
  ]);
});

console.log("All layout guard checks passed.");

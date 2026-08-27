import { afterEach, describe, expect, test } from "bun:test";

import {
  beforeSend,
  type EventData,
  flushPendingEvents,
  MAX_STRING_LENGTH,
  normalizeEventData,
  pendingEventCount,
  resetPageviewDedupe,
  stackSnapshot,
  track,
  trackAttrs,
} from "../src/lib/analytics";
import { DEFAULT_STACK } from "../src/lib/constant";

const SITE = "https://www.better-t-stack.dev";

function installFakeTracker() {
  const calls: Array<[string, EventData | undefined]> = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      umami: {
        track: (name: string, data?: EventData) => {
          calls.push([name, data]);
        },
        identify: () => {},
      },
    },
  });
  return calls;
}

afterEach(() => {
  resetPageviewDedupe();
  Reflect.deleteProperty(globalThis, "window");
});

describe("beforeSend", () => {
  test("strips the query string from builder pageviews and keeps it elsewhere", () => {
    const builder = beforeSend("event", { url: `${SITE}/new?fe-w=next&backend=hono` });
    expect(builder).toEqual({ url: `${SITE}/new` });

    const docs = beforeSend("event", { url: `${SITE}/docs?utm_source=x#install` });
    expect(docs).toEqual({ url: `${SITE}/docs?utm_source=x` });
  });

  test("collapses repeated pageviews for the same normalized url", () => {
    expect(beforeSend("event", { url: `${SITE}/new?a=1` })).not.toBe(false);
    expect(beforeSend("event", { url: `${SITE}/new?a=2` })).toBe(false);
    expect(beforeSend("event", { url: `${SITE}/docs` })).not.toBe(false);
    expect(beforeSend("event", { url: `${SITE}/new?a=3` })).not.toBe(false);
  });

  test("normalizes a same-site referrer that carried builder params", () => {
    const result = beforeSend("event", { url: `${SITE}/stack`, referrer: `${SITE}/new?a=1` });
    expect(result).toEqual({ url: `${SITE}/stack`, referrer: `${SITE}/new` });
  });

  test("passes custom events and identify payloads through untouched", () => {
    const custom = { url: `${SITE}/new?a=1`, name: "builder_copy_command" };
    expect(beforeSend("event", custom)).toBe(custom);
    const identify = { url: `${SITE}/new?a=1` };
    expect(beforeSend("identify", identify)).toBe(identify);
  });
});

describe("track", () => {
  test("queues events until the tracker loads, then flushes in order", () => {
    track("builder_reset", {});
    track("builder_preset_apply", { preset: "mern" });
    expect(pendingEventCount()).toBe(2);

    const calls = installFakeTracker();
    flushPendingEvents();

    expect(pendingEventCount()).toBe(0);
    expect(calls).toEqual([
      ["builder_reset", {}],
      ["builder_preset_apply", { preset: "mern" }],
    ]);

    track("theme_toggle", { theme: "dark" });
    expect(calls[2]).toEqual(["theme_toggle", { theme: "dark" }]);
  });

  test("clamps long strings to the tracker limit and keeps other value types", () => {
    const long = "x".repeat(MAX_STRING_LENGTH + 40);
    const data = normalizeEventData({ message: long, count: 3, enabled: true });
    expect(data.message).toHaveLength(MAX_STRING_LENGTH);
    expect(data.count).toBe(3);
    expect(data.enabled).toBe(true);
  });
});

describe("trackAttrs", () => {
  test("emits data attributes the document listener can read back", () => {
    expect(
      trackAttrs("sponsor_click", { sponsor: "acme", target: "github", location: "home" }),
    ).toEqual({
      "data-track": "sponsor_click",
      "data-track-sponsor": "acme",
      "data-track-target": "github",
      "data-track-location": "home",
    });
  });
});

describe("stackSnapshot", () => {
  test("flattens the default stack and marks it as default", () => {
    const snapshot = stackSnapshot(DEFAULT_STACK);
    expect(snapshot.isDefault).toBe(true);
    expect(snapshot.frontend).toBe(
      [...DEFAULT_STACK.webFrontend, ...DEFAULT_STACK.nativeFrontend]
        .filter((value) => value !== "none")
        .join("+") || "none",
    );
    expect(snapshot.git).toBe(DEFAULT_STACK.git !== "false");
  });

  test("marks customized stacks and joins multi-select lists", () => {
    const snapshot = stackSnapshot({
      ...DEFAULT_STACK,
      backend: "hono",
      addons: ["biome", "turborepo"],
      examples: ["none"],
      yolo: "true",
    });
    expect(snapshot.isDefault).toBe(false);
    expect(snapshot.backend).toBe("hono");
    expect(snapshot.addons).toBe("biome+turborepo");
    expect(snapshot.examples).toBe("none");
    expect(snapshot.yolo).toBe(true);
  });
});

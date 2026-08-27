import { DEFAULT_STACK, isStackDefault, type StackState } from "@/lib/constant";

export type EventValue = string | number | boolean;
export type EventData = Record<string, EventValue>;
type EmptyData = Record<string, never>;

export type StackSnapshot = {
  frontend: string;
  backend: string;
  runtime: string;
  api: string;
  database: string;
  orm: string;
  dbSetup: string;
  auth: string;
  payments: string;
  addons: string;
  examples: string;
  packageManager: string;
  webDeploy: string;
  serverDeploy: string;
  git: boolean;
  install: boolean;
  yolo: boolean;
  isDefault: boolean;
};

export type BuilderCopySource = "button" | "command" | "mobile-command";
export type SharePage = "builder" | "stack";
type SponsorTarget = "github" | "website" | "sponsor-me";

export type AnalyticsEvents = {
  builder_tech_select: { category: string; tech: string; selected: boolean };
  builder_tech_remove: { category: string; tech: string };
  builder_category_jump: { category: string; source: "nav" | "badge" };
  builder_copy_command: StackSnapshot & { source: BuilderCopySource };
  builder_command_expand: { expanded: boolean };
  builder_reset: EmptyData;
  builder_randomize: EmptyData;
  builder_save: EmptyData;
  builder_load: EmptyData;
  builder_preset_apply: { preset: string };
  builder_yolo_toggle: { enabled: boolean };
  builder_view_mode: { mode: "command" | "preview" };
  builder_mobile_tab: { tab: "build" | "preview" };
  builder_compat_adjust: { count: number; message: string };
  preview_error: { message: string };
  preview_file_open: { path: string; extension: string };
  preview_file_copy: { path: string };
  share_open: { page: SharePage };
  share_copy: { page: SharePage; target: "link" | "command" };
  share_post: { page: SharePage };
  share_native: { page: SharePage };
  share_qr: { page: SharePage; shown: boolean };
  stack_copy_command: StackSnapshot;
  stack_edit: EmptyData;
  home_pm_select: { pm: string };
  home_copy_install: { pm: string };
  home_cta: { target: "builder" | "mcp-docs" | "sponsors" };
  home_video_play: { video: string; title: string };
  home_rail_navigate: { pane: string; method: "click" | "keyboard" };
  home_past_sponsors: { shown: boolean };
  nav_click: { item: string; location: "header" | "mobile-menu" };
  theme_toggle: { theme: "light" | "dark" };
  search_open: EmptyData;
  mobile_menu: { open: boolean };
  docs_copy_markdown: { path: string };
  docs_view_options_open: { path: string };
  docs_open_in: { target: string; path: string };
  sponsor_click: { sponsor: string; target: SponsorTarget; location: string };
  showcase_click: { project: string; target: "demo" | "source" };
  showcase_submit: EmptyData;
  analytics_live_feed: { open: boolean };
  outbound_click: { host: string; url: string; location: string };
  email_click: { location: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

type UmamiPayload = {
  url?: string;
  referrer?: string;
  name?: string;
};

type UmamiTracker = {
  track: (name: string, data?: EventData) => Promise<string | undefined> | void;
  identify: (data: EventData) => Promise<string | undefined> | void;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
    btsBeforeSend?: typeof beforeSend;
  }
}

export const MAX_EVENT_NAME_LENGTH = 50;
export const MAX_STRING_LENGTH = 500;
const MAX_PENDING_EVENTS = 25;
const QUERY_STRIPPED_PATHS = new Set(["/new", "/stack"]);

const pending: Array<[string, EventData]> = [];
let lastPageviewUrl: string | null = null;

function clampString(value: string) {
  return value.length > MAX_STRING_LENGTH ? value.slice(0, MAX_STRING_LENGTH) : value;
}

function clampValue(value: EventValue): EventValue {
  const text = String(value);
  return text.length > MAX_STRING_LENGTH ? clampString(text) : value;
}

export function normalizeEventData(data: EventData): EventData {
  const normalized: EventData = {};
  for (const [key, value] of Object.entries(data)) {
    normalized[key] = clampValue(value);
  }
  return normalized;
}

function getTracker() {
  return globalThis.window?.umami;
}

function send(tracker: UmamiTracker, name: string, data: EventData) {
  try {
    void tracker.track(name.slice(0, MAX_EVENT_NAME_LENGTH), normalizeEventData(data));
  } catch {
    // Analytics must never break the page.
  }
}

export function trackRaw(name: string, data: EventData = {}) {
  const tracker = getTracker();
  if (tracker) {
    send(tracker, name, data);
    return;
  }
  if (pending.length >= MAX_PENDING_EVENTS) pending.shift();
  pending.push([name, data]);
}

export function track<Name extends AnalyticsEventName>(name: Name, data: AnalyticsEvents[Name]) {
  trackRaw(name, data);
}

export function flushPendingEvents() {
  const tracker = getTracker();
  if (!tracker) return;
  while (pending.length > 0) {
    const [name, data] = pending.shift()!;
    send(tracker, name, data);
  }
}

export function pendingEventCount() {
  return pending.length;
}

export const TRACK_ATTRIBUTE = "data-track";

/**
 * Declarative tracking for links and buttons rendered by server components.
 * The document-level listener in `components/analytics.tsx` reads these back.
 */
export function trackAttrs<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEvents[Name],
) {
  return Object.fromEntries([
    [TRACK_ATTRIBUTE, name] as const,
    ...Object.entries(data).map(
      ([key, value]) => [`${TRACK_ATTRIBUTE}-${key.toLowerCase()}`, String(value)] as const,
    ),
  ]);
}

export function readTrackAttrs(element: Element): [string, EventData] | null {
  const name = element.getAttribute(TRACK_ATTRIBUTE);
  if (!name) return null;
  const prefix = `${TRACK_ATTRIBUTE}-`;
  const data: EventData = {};
  for (const attribute of element.getAttributeNames()) {
    if (!attribute.startsWith(prefix)) continue;
    data[attribute.slice(prefix.length)] = element.getAttribute(attribute) ?? "";
  }
  return [name, data];
}

function joinList(values: string[]) {
  const real = values.filter((value) => value !== "none");
  return real.length > 0 ? real.join("+") : "none";
}

export function stackSnapshot(stack: StackState): StackSnapshot {
  const isDefault = Object.keys(DEFAULT_STACK).every(
    (key) =>
      key === "projectName" ||
      isStackDefault(stack, key as keyof StackState, stack[key as keyof StackState]),
  );

  return {
    frontend: joinList([...stack.webFrontend, ...stack.nativeFrontend]),
    backend: stack.backend,
    runtime: stack.runtime,
    api: stack.api,
    database: stack.database,
    orm: stack.orm,
    dbSetup: stack.dbSetup,
    auth: stack.auth,
    payments: stack.payments,
    addons: joinList(stack.addons),
    examples: joinList(stack.examples),
    packageManager: stack.packageManager,
    webDeploy: stack.webDeploy,
    serverDeploy: stack.serverDeploy,
    git: stack.git !== "false",
    install: stack.install !== "false",
    yolo: stack.yolo === "true",
    isDefault,
  };
}

export function normalizePageviewUrl(rawUrl: string, base: string) {
  const url = new URL(rawUrl, base);
  url.hash = "";
  if (QUERY_STRIPPED_PATHS.has(url.pathname)) url.search = "";
  return url;
}

export function resetPageviewDedupe() {
  lastPageviewUrl = null;
}

/**
 * Runs inside the tracker before every request (`data-before-send`).
 * Pageviews on the builder pages drop their query string, since nuqs rewrites it on
 * every click and the stack itself is captured by the builder events. Repeated
 * pageviews for the same URL are collapsed so those rewrites do not inflate counts.
 */
export function beforeSend(type: string, payload: UmamiPayload): UmamiPayload | false {
  if (type !== "event" || payload.name || !payload.url) return payload;

  let url: URL;
  try {
    url = normalizePageviewUrl(payload.url, globalThis.location?.href ?? "https://localhost");
  } catch {
    return payload;
  }

  const key = `${url.pathname}${url.search}`;
  if (key === lastPageviewUrl) return false;
  lastPageviewUrl = key;

  const next: UmamiPayload = { ...payload, url: url.toString() };
  if (payload.referrer) {
    try {
      next.referrer = normalizePageviewUrl(payload.referrer, url.origin).toString();
    } catch {
      // Keep the referrer as sent.
    }
  }
  return next;
}

export function getOutboundEvent(
  anchor: HTMLAnchorElement,
  currentLocation: Location,
):
  | ["outbound_click", AnalyticsEvents["outbound_click"]]
  | ["email_click", AnalyticsEvents["email_click"]]
  | null {
  let url: URL;
  try {
    url = new URL(anchor.href, currentLocation.href);
  } catch {
    return null;
  }

  if (url.protocol === "mailto:") {
    return ["email_click", { location: currentLocation.pathname }];
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.hostname === currentLocation.hostname) return null;

  return [
    "outbound_click",
    {
      host: url.hostname,
      url: clampString(`${url.origin}${url.pathname}`),
      location: currentLocation.pathname,
    },
  ];
}

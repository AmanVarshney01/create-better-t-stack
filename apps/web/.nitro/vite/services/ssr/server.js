var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError("Cannot add the same private member more than once")
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, "write to private field"),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, "access private method"), method
);
var _a, _headers, _init, _b;
import require$$2 from "async_hooks";
import require$$1 from "crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { Readable, PassThrough } from "node:stream";
import { ReadableStream as ReadableStream$1 } from "node:stream/web";
import require$$5 from "stream";
import require$$0 from "util";
function _mergeNamespaces(n, m2) {
  for (var i = 0; i < m2.length; i++) {
    const e = m2[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k2 in e) {
        if (k2 !== "default" && !(k2 in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          if (d) {
            Object.defineProperty(
              n,
              k2,
              d.get
                ? d
                : {
                    enumerable: true,
                    get: () => e[k2],
                  },
            );
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var commonjsGlobal =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
          ? self
          : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default")
    ? x2["default"]
    : x2;
}
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f2 = n.default;
  if (typeof f2 == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a.prototype = f2.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function (k2) {
    var d = Object.getOwnPropertyDescriptor(n, k2);
    Object.defineProperty(
      a,
      k2,
      d.get
        ? d
        : {
            enumerable: true,
            get: function () {
              return n[k2];
            },
          },
    );
  });
  return a;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production;
function requireReactJsxRuntime_production() {
  if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
  hasRequiredReactJsxRuntime_production = 1;
  var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
    REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
  function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
      maybeKey = {};
      for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
    } else maybeKey = config;
    config = maybeKey.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== config ? config : null,
      props: maybeKey,
    };
  }
  reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
  reactJsxRuntime_production.jsx = jsxProd;
  reactJsxRuntime_production.jsxs = jsxProd;
  return reactJsxRuntime_production;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
const __storeToDerived = /* @__PURE__ */ new WeakMap();
const __derivedToStore = /* @__PURE__ */ new WeakMap();
const __depsThatHaveWrittenThisTick = {
  current: [],
};
let __isFlushing = false;
let __batchDepth = 0;
const __pendingUpdates = /* @__PURE__ */ new Set();
const __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
  for (const derived of relatedVals) {
    if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
      continue;
    }
    __depsThatHaveWrittenThisTick.current.push(derived);
    derived.recompute();
    const stores = __derivedToStore.get(derived);
    if (stores) {
      for (const store of stores) {
        const relatedLinkedDerivedVals = __storeToDerived.get(store);
        if (!(relatedLinkedDerivedVals == null ? void 0 : relatedLinkedDerivedVals.length))
          continue;
        __flush_internals(relatedLinkedDerivedVals);
      }
    }
  }
}
function __notifyListeners(store) {
  const value = {
    prevVal: store.prevState,
    currentVal: store.state,
  };
  for (const listener of store.listeners) {
    listener(value);
  }
}
function __notifyDerivedListeners(derived) {
  const value = {
    prevVal: derived.prevState,
    currentVal: derived.state,
  };
  for (const listener of derived.listeners) {
    listener(value);
  }
}
function __flush(store) {
  if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
    __initialBatchValues.set(store, store.prevState);
  }
  __pendingUpdates.add(store);
  if (__batchDepth > 0) return;
  if (__isFlushing) return;
  try {
    __isFlushing = true;
    while (__pendingUpdates.size > 0) {
      const stores = Array.from(__pendingUpdates);
      __pendingUpdates.clear();
      for (const store2 of stores) {
        const prevState = __initialBatchValues.get(store2) ?? store2.prevState;
        store2.prevState = prevState;
        __notifyListeners(store2);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        __depsThatHaveWrittenThisTick.current.push(store2);
        __flush_internals(derivedVals);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        for (const derived of derivedVals) {
          __notifyDerivedListeners(derived);
        }
      }
    }
  } finally {
    __isFlushing = false;
    __depsThatHaveWrittenThisTick.current = [];
    __initialBatchValues.clear();
  }
}
function batch(fn2) {
  __batchDepth++;
  try {
    fn2();
  } finally {
    __batchDepth--;
    if (__batchDepth === 0) {
      const pendingUpdateToFlush = __pendingUpdates.values().next().value;
      if (pendingUpdateToFlush) {
        __flush(pendingUpdateToFlush);
      }
    }
  }
}
function isUpdaterFunction(updater) {
  return typeof updater === "function";
}
class Store {
  constructor(initialState, options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      var _a2, _b2;
      this.listeners.add(listener);
      const unsub =
        (_b2 = (_a2 = this.options) == null ? void 0 : _a2.onSubscribe) == null
          ? void 0
          : _b2.call(_a2, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.prevState = initialState;
    this.state = initialState;
    this.options = options;
  }
  setState(updater) {
    var _a2, _b2, _c;
    this.prevState = this.state;
    if ((_a2 = this.options) == null ? void 0 : _a2.updateFn) {
      this.state = this.options.updateFn(this.prevState)(updater);
    } else {
      if (isUpdaterFunction(updater)) {
        this.state = updater(this.prevState);
      } else {
        this.state = updater;
      }
    }
    (_c = (_b2 = this.options) == null ? void 0 : _b2.onUpdate) == null ? void 0 : _c.call(_b2);
    __flush(this);
  }
}
const stateIndexKey = "__TSR_index";
const popStateEvent = "popstate";
const beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action, navigateOpts) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action, navigateOpts }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({ task, navigateOpts, ...actionInfo }) => {
    var _a2, _b2;
    const ignoreBlocker = (navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false;
    if (ignoreBlocker) {
      task();
      return { type: "SUCCESS" };
    }
    const blockers = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type,
        });
        if (isBlocked) {
          (_b2 = opts.onBlocked) == null ? void 0 : _b2.call(opts);
          return { type: "BLOCKED" };
        }
      }
    }
    task();
    return { type: "SUCCESS" };
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      return tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" }, navigateOpts);
        },
        navigateOpts,
        type: "PUSH",
        path,
        state,
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      return tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" }, navigateOpts);
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state,
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO",
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK",
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD",
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      var _a2;
      if (!opts.setBlockers) return () => {};
      const blockers = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        var _a3, _b2;
        const blockers2 = ((_a3 = opts.getBlockers) == null ? void 0 : _a3.call(opts)) ?? [];
        (_b2 = opts.setBlockers) == null
          ? void 0
          : _b2.call(
              opts,
              blockers2.filter((b2) => b2 !== blocker),
            );
      };
    },
    flush: () => {
      var _a2;
      return (_a2 = opts.flush) == null ? void 0 : _a2.call(opts);
    },
    destroy: () => {
      var _a2;
      return (_a2 = opts.destroy) == null ? void 0 : _a2.call(opts);
    },
    notify,
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  const key = createRandomKey();
  return {
    ...state,
    key,
    // TODO: Remove in v2 - use __TSR_key instead
    __TSR_key: key,
    [stateIndexKey]: index,
  };
}
function createBrowserHistory(opts) {
  var _a2, _b2;
  const win = typeof document !== "undefined" ? window : void 0;
  const originalPushState = win.history.pushState;
  const originalReplaceState = win.history.replaceState;
  let blockers = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers) => (blockers = newBlockers);
  const createHref = (path) => path;
  const parseLocation = () =>
    parseHref(
      `${win.location.pathname}${win.location.search}${win.location.hash}`,
      win.history.state,
    );
  if (
    !((_a2 = win.history.state) == null ? void 0 : _a2.__TSR_key) &&
    !((_b2 = win.history.state) == null ? void 0 : _b2.key)
  ) {
    const addedKey = createRandomKey();
    win.history.replaceState(
      {
        [stateIndexKey]: 0,
        key: addedKey,
        // TODO: Remove in v2 - use __TSR_key instead
        __TSR_key: addedKey,
      },
      "",
    );
  }
  let currentLocation = parseLocation();
  let rollbackLocation;
  let nextPopIsGo = false;
  let ignoreNextPop = false;
  let skipBlockerNextPop = false;
  let ignoreNextBeforeUnload = false;
  const getLocation = () => currentLocation;
  let next;
  let scheduled;
  const flush = () => {
    if (!next) {
      return;
    }
    history._ignoreSubscribers = true;
    (next.isPush ? win.history.pushState : win.history.replaceState)(next.state, "", next.href);
    history._ignoreSubscribers = false;
    next = void 0;
    scheduled = void 0;
    rollbackLocation = void 0;
  };
  const queueHistoryAction = (type, destHref, state) => {
    const href = createHref(destHref);
    if (!scheduled) {
      rollbackLocation = currentLocation;
    }
    currentLocation = parseHref(destHref, state);
    next = {
      href,
      state,
      isPush: (next == null ? void 0 : next.isPush) || type === "push",
    };
    if (!scheduled) {
      scheduled = Promise.resolve().then(() => flush());
    }
  };
  const onPushPop = (type) => {
    currentLocation = parseLocation();
    history.notify({ type });
  };
  const onPushPopEvent = async () => {
    if (ignoreNextPop) {
      ignoreNextPop = false;
      return;
    }
    const nextLocation = parseLocation();
    const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
    const isForward = delta === 1;
    const isBack = delta === -1;
    const isGo = (!isForward && !isBack) || nextPopIsGo;
    nextPopIsGo = false;
    const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
    const notify = isGo
      ? {
          type: "GO",
          index: delta,
        }
      : {
          type: isBack ? "BACK" : "FORWARD",
        };
    if (skipBlockerNextPop) {
      skipBlockerNextPop = false;
    } else {
      const blockers2 = _getBlockers();
      if (typeof document !== "undefined" && blockers2.length) {
        for (const blocker of blockers2) {
          const isBlocked = await blocker.blockerFn({
            currentLocation,
            nextLocation,
            action,
          });
          if (isBlocked) {
            ignoreNextPop = true;
            win.history.go(1);
            history.notify(notify);
            return;
          }
        }
      }
    }
    currentLocation = parseLocation();
    history.notify(notify);
  };
  const onBeforeUnload = (e) => {
    if (ignoreNextBeforeUnload) {
      ignoreNextBeforeUnload = false;
      return;
    }
    let shouldBlock = false;
    const blockers2 = _getBlockers();
    if (typeof document !== "undefined" && blockers2.length) {
      for (const blocker of blockers2) {
        const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
        if (shouldHaveBeforeUnload === true) {
          shouldBlock = true;
          break;
        }
        if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
          shouldBlock = true;
          break;
        }
      }
    }
    if (shouldBlock) {
      e.preventDefault();
      return (e.returnValue = "");
    }
    return;
  };
  const history = createHistory({
    getLocation,
    getLength: () => win.history.length,
    pushState: (href, state) => queueHistoryAction("push", href, state),
    replaceState: (href, state) => queueHistoryAction("replace", href, state),
    back: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      return win.history.back();
    },
    forward: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      win.history.forward();
    },
    go: (n) => {
      nextPopIsGo = true;
      win.history.go(n);
    },
    createHref: (href) => createHref(href),
    flush,
    destroy: () => {
      win.history.pushState = originalPushState;
      win.history.replaceState = originalReplaceState;
      win.removeEventListener(beforeUnloadEvent, onBeforeUnload, {
        capture: true,
      });
      win.removeEventListener(popStateEvent, onPushPopEvent);
    },
    onBlocked: () => {
      if (rollbackLocation && currentLocation !== rollbackLocation) {
        currentLocation = rollbackLocation;
      }
    },
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
    notifyOnIndexChange: false,
  });
  win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
  win.addEventListener(popStateEvent, onPushPopEvent);
  win.history.pushState = function (...args) {
    const res = originalPushState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("PUSH");
    return res;
  };
  win.history.replaceState = function (...args) {
    const res = originalReplaceState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("REPLACE");
    return res;
  };
  return history;
}
function createMemoryHistory(
  opts = {
    initialEntries: ["/"],
  },
) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex
    ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1)
    : entries.length - 1;
  const states = entries.map((_entry, index2) => assignKeyAndIndex(index2, void 0));
  const getLocation = () => parseHref(entries[index], states[index]);
  let blockers = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers) => (blockers = newBlockers);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: (n) => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: (path) => path,
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
  });
}
function sanitizePath(path) {
  let sanitized = path.replace(/[\x00-\x1f\x7f]/g, "");
  if (sanitized.startsWith("//")) {
    sanitized = "/" + sanitized.replace(/^\/+/, "");
  }
  return sanitized;
}
function parseHref(href, state) {
  const sanitizedHref = sanitizePath(href);
  const hashIndex = sanitizedHref.indexOf("#");
  const searchIndex = sanitizedHref.indexOf("?");
  const addedKey = createRandomKey();
  return {
    href: sanitizedHref,
    pathname: sanitizedHref.substring(
      0,
      hashIndex > 0
        ? searchIndex > 0
          ? Math.min(hashIndex, searchIndex)
          : hashIndex
        : searchIndex > 0
          ? searchIndex
          : sanitizedHref.length,
    ),
    hash: hashIndex > -1 ? sanitizedHref.substring(hashIndex) : "",
    search:
      searchIndex > -1
        ? sanitizedHref.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex)
        : "",
    state: state || { [stateIndexKey]: 0, key: addedKey, __TSR_key: addedKey },
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function last(arr) {
  return arr[arr.length - 1];
}
function isFunction(d) {
  return typeof d === "function";
}
function functionalUpdate(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
const hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(prev, _next, _depth = 0) {
  if (prev === _next) {
    return prev;
  }
  if (_depth > 500) return _next;
  const next = _next;
  const array = isPlainArray(prev) && isPlainArray(next);
  if (!array && !(isPlainObject(prev) && isPlainObject(next))) return next;
  const prevItems = array ? prev : getEnumerableOwnKeys(prev);
  if (!prevItems) return next;
  const nextItems = array ? next : getEnumerableOwnKeys(next);
  if (!nextItems) return next;
  const prevSize = prevItems.length;
  const nextSize = nextItems.length;
  const copy = array ? new Array(nextSize) : {};
  let equalItems = 0;
  for (let i = 0; i < nextSize; i++) {
    const key = array ? i : nextItems[i];
    const p2 = prev[key];
    const n = next[key];
    if (p2 === n) {
      copy[key] = p2;
      if (array ? i < prevSize : hasOwn.call(prev, key)) equalItems++;
      continue;
    }
    if (p2 === null || n === null || typeof p2 !== "object" || typeof n !== "object") {
      copy[key] = n;
      continue;
    }
    const v2 = replaceEqualDeep(p2, n, _depth + 1);
    copy[key] = v2;
    if (v2 === p2) equalItems++;
  }
  return prevSize === nextSize && equalItems === prevSize ? prev : copy;
}
function getEnumerableOwnKeys(o2) {
  const keys = [];
  const names = Object.getOwnPropertyNames(o2);
  for (const name of names) {
    if (!Object.prototype.propertyIsEnumerable.call(o2, name)) return false;
    keys.push(name);
  }
  const symbols = Object.getOwnPropertySymbols(o2);
  for (const symbol of symbols) {
    if (!Object.prototype.propertyIsEnumerable.call(o2, symbol)) return false;
    keys.push(symbol);
  }
  return keys;
}
function isPlainObject(o2) {
  if (!hasObjectPrototype(o2)) {
    return false;
  }
  const ctor = o2.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o2) {
  return Object.prototype.toString.call(o2) === "[object Object]";
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function deepEqual(a, b2, opts) {
  if (a === b2) {
    return true;
  }
  if (typeof a !== typeof b2) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b2)) {
    if (a.length !== b2.length) return false;
    for (let i = 0, l = a.length; i < l; i++) {
      if (!deepEqual(a[i], b2[i], opts)) return false;
    }
    return true;
  }
  if (isPlainObject(a) && isPlainObject(b2)) {
    const ignoreUndefined = (opts == null ? void 0 : opts.ignoreUndefined) ?? true;
    if (opts == null ? void 0 : opts.partial) {
      for (const k2 in b2) {
        if (!ignoreUndefined || b2[k2] !== void 0) {
          if (!deepEqual(a[k2], b2[k2], opts)) return false;
        }
      }
      return true;
    }
    let aCount = 0;
    if (!ignoreUndefined) {
      aCount = Object.keys(a).length;
    } else {
      for (const k2 in a) {
        if (a[k2] !== void 0) aCount++;
      }
    }
    let bCount = 0;
    for (const k2 in b2) {
      if (!ignoreUndefined || b2[k2] !== void 0) {
        bCount++;
        if (bCount > aCount || !deepEqual(a[k2], b2[k2], opts)) return false;
      }
    }
    return aCount === bCount;
  }
  return false;
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
    onResolve == null ? void 0 : onResolve(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
function isModuleNotFoundError(error) {
  if (typeof (error == null ? void 0 : error.message) !== "string") return false;
  return (
    error.message.startsWith("Failed to fetch dynamically imported module") ||
    error.message.startsWith("error loading dynamically imported module") ||
    error.message.startsWith("Importing a module script failed")
  );
}
function isPromise(value) {
  return Boolean(value && typeof value === "object" && typeof value.then === "function");
}
function sanitizePathSegment(segment) {
  return segment.replace(/[\x00-\x1f\x7f]/g, "");
}
function decodeSegment(segment) {
  let decoded;
  try {
    decoded = decodeURI(segment);
  } catch {
    decoded = segment.replaceAll(/%[0-9A-F]{2}/gi, (match) => {
      try {
        return decodeURI(match);
      } catch {
        return match;
      }
    });
  }
  return sanitizePathSegment(decoded);
}
const SAFE_URL_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];
function isDangerousProtocol(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return !SAFE_URL_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}
const HTML_ESCAPE_LOOKUP = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};
const HTML_ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(str) {
  return str.replace(HTML_ESCAPE_REGEX, (match) => HTML_ESCAPE_LOOKUP[match]);
}
function decodePath(path, decodeIgnore) {
  if (!path) return path;
  const re2 = /%25|%5C/gi;
  let cursor = 0;
  let result = "";
  let match;
  while (null !== (match = re2.exec(path))) {
    result += decodeSegment(path.slice(cursor, match.index)) + match[0];
    cursor = re2.lastIndex;
  }
  result = result + decodeSegment(cursor ? path.slice(cursor) : path);
  if (result.startsWith("//")) {
    result = "/" + result.replace(/^\/+/, "");
  }
  return result;
}
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
function createLRUCache(max) {
  const cache = /* @__PURE__ */ new Map();
  let oldest;
  let newest;
  const touch = (entry) => {
    if (!entry.next) return;
    if (!entry.prev) {
      entry.next.prev = void 0;
      oldest = entry.next;
      entry.next = void 0;
      if (newest) {
        entry.prev = newest;
        newest.next = entry;
      }
    } else {
      entry.prev.next = entry.next;
      entry.next.prev = entry.prev;
      entry.next = void 0;
      if (newest) {
        newest.next = entry;
        entry.prev = newest;
      }
    }
    newest = entry;
  };
  return {
    get(key) {
      const entry = cache.get(key);
      if (!entry) return void 0;
      touch(entry);
      return entry.value;
    },
    set(key, value) {
      if (cache.size >= max && oldest) {
        const toDelete = oldest;
        cache.delete(toDelete.key);
        if (toDelete.next) {
          oldest = toDelete.next;
          toDelete.next.prev = void 0;
        }
        if (toDelete === newest) {
          newest = void 0;
        }
      }
      const existing = cache.get(key);
      if (existing) {
        existing.value = value;
        touch(existing);
      } else {
        const entry = { key, value, prev: newest };
        if (newest) newest.next = entry;
        newest = entry;
        if (!oldest) oldest = entry;
        cache.set(key, entry);
      }
    },
    clear() {
      cache.clear();
      oldest = void 0;
      newest = void 0;
    },
  };
}
const SEGMENT_TYPE_PATHNAME = 0;
const SEGMENT_TYPE_PARAM = 1;
const SEGMENT_TYPE_WILDCARD = 2;
const SEGMENT_TYPE_OPTIONAL_PARAM = 3;
const SEGMENT_TYPE_INDEX = 4;
const SEGMENT_TYPE_PATHLESS = 5;
const PARAM_W_CURLY_BRACES_RE = /^([^{]*)\{\$([a-zA-Z_$][a-zA-Z0-9_$]*)\}([^}]*)$/;
const OPTIONAL_PARAM_W_CURLY_BRACES_RE = /^([^{]*)\{-\$([a-zA-Z_$][a-zA-Z0-9_$]*)\}([^}]*)$/;
const WILDCARD_W_CURLY_BRACES_RE = /^([^{]*)\{\$\}([^}]*)$/;
function parseSegment(path, start, output = new Uint16Array(6)) {
  const next = path.indexOf("/", start);
  const end = next === -1 ? path.length : next;
  const part = path.substring(start, end);
  if (!part || !part.includes("$")) {
    output[0] = SEGMENT_TYPE_PATHNAME;
    output[1] = start;
    output[2] = start;
    output[3] = end;
    output[4] = end;
    output[5] = end;
    return output;
  }
  if (part === "$") {
    const total = path.length;
    output[0] = SEGMENT_TYPE_WILDCARD;
    output[1] = start;
    output[2] = start;
    output[3] = total;
    output[4] = total;
    output[5] = total;
    return output;
  }
  if (part.charCodeAt(0) === 36) {
    output[0] = SEGMENT_TYPE_PARAM;
    output[1] = start;
    output[2] = start + 1;
    output[3] = end;
    output[4] = end;
    output[5] = end;
    return output;
  }
  const wildcardBracesMatch = part.match(WILDCARD_W_CURLY_BRACES_RE);
  if (wildcardBracesMatch) {
    const prefix2 = wildcardBracesMatch[1];
    const pLength = prefix2.length;
    output[0] = SEGMENT_TYPE_WILDCARD;
    output[1] = start + pLength;
    output[2] = start + pLength + 1;
    output[3] = start + pLength + 2;
    output[4] = start + pLength + 3;
    output[5] = path.length;
    return output;
  }
  const optionalParamBracesMatch = part.match(OPTIONAL_PARAM_W_CURLY_BRACES_RE);
  if (optionalParamBracesMatch) {
    const prefix2 = optionalParamBracesMatch[1];
    const paramName = optionalParamBracesMatch[2];
    const suffix = optionalParamBracesMatch[3];
    const pLength = prefix2.length;
    output[0] = SEGMENT_TYPE_OPTIONAL_PARAM;
    output[1] = start + pLength;
    output[2] = start + pLength + 3;
    output[3] = start + pLength + 3 + paramName.length;
    output[4] = end - suffix.length;
    output[5] = end;
    return output;
  }
  const paramBracesMatch = part.match(PARAM_W_CURLY_BRACES_RE);
  if (paramBracesMatch) {
    const prefix2 = paramBracesMatch[1];
    const paramName = paramBracesMatch[2];
    const suffix = paramBracesMatch[3];
    const pLength = prefix2.length;
    output[0] = SEGMENT_TYPE_PARAM;
    output[1] = start + pLength;
    output[2] = start + pLength + 2;
    output[3] = start + pLength + 2 + paramName.length;
    output[4] = end - suffix.length;
    output[5] = end;
    return output;
  }
  output[0] = SEGMENT_TYPE_PATHNAME;
  output[1] = start;
  output[2] = start;
  output[3] = end;
  output[4] = end;
  output[5] = end;
  return output;
}
function parseSegments(defaultCaseSensitive, data, route, start, node, depth, onRoute) {
  var _a2, _b2, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m;
  onRoute == null ? void 0 : onRoute(route);
  let cursor = start;
  {
    const path = route.fullPath ?? route.from;
    const length = path.length;
    const caseSensitive =
      ((_a2 = route.options) == null ? void 0 : _a2.caseSensitive) ?? defaultCaseSensitive;
    const skipOnParamError = !!(
      ((_c = (_b2 = route.options) == null ? void 0 : _b2.params) == null ? void 0 : _c.parse) &&
      ((_e2 = (_d = route.options) == null ? void 0 : _d.skipRouteOnParseError) == null
        ? void 0
        : _e2.params)
    );
    while (cursor < length) {
      const segment = parseSegment(path, cursor, data);
      let nextNode;
      const start2 = cursor;
      const end = segment[5];
      cursor = end + 1;
      depth++;
      const kind = segment[0];
      switch (kind) {
        case SEGMENT_TYPE_PATHNAME: {
          const value = path.substring(segment[2], segment[3]);
          if (caseSensitive) {
            const existingNode = (_f = node.static) == null ? void 0 : _f.get(value);
            if (existingNode) {
              nextNode = existingNode;
            } else {
              node.static ?? (node.static = /* @__PURE__ */ new Map());
              const next = createStaticNode(route.fullPath ?? route.from);
              next.parent = node;
              next.depth = depth;
              nextNode = next;
              node.static.set(value, next);
            }
          } else {
            const name = value.toLowerCase();
            const existingNode = (_g = node.staticInsensitive) == null ? void 0 : _g.get(name);
            if (existingNode) {
              nextNode = existingNode;
            } else {
              node.staticInsensitive ?? (node.staticInsensitive = /* @__PURE__ */ new Map());
              const next = createStaticNode(route.fullPath ?? route.from);
              next.parent = node;
              next.depth = depth;
              nextNode = next;
              node.staticInsensitive.set(name, next);
            }
          }
          break;
        }
        case SEGMENT_TYPE_PARAM: {
          const prefix_raw = path.substring(start2, segment[1]);
          const suffix_raw = path.substring(segment[4], end);
          const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
          const prefix2 = !prefix_raw
            ? void 0
            : actuallyCaseSensitive
              ? prefix_raw
              : prefix_raw.toLowerCase();
          const suffix = !suffix_raw
            ? void 0
            : actuallyCaseSensitive
              ? suffix_raw
              : suffix_raw.toLowerCase();
          const existingNode =
            !skipOnParamError &&
            ((_h = node.dynamic) == null
              ? void 0
              : _h.find(
                  (s) =>
                    !s.skipOnParamError &&
                    s.caseSensitive === actuallyCaseSensitive &&
                    s.prefix === prefix2 &&
                    s.suffix === suffix,
                ));
          if (existingNode) {
            nextNode = existingNode;
          } else {
            const next = createDynamicNode(
              SEGMENT_TYPE_PARAM,
              route.fullPath ?? route.from,
              actuallyCaseSensitive,
              prefix2,
              suffix,
            );
            nextNode = next;
            next.depth = depth;
            next.parent = node;
            node.dynamic ?? (node.dynamic = []);
            node.dynamic.push(next);
          }
          break;
        }
        case SEGMENT_TYPE_OPTIONAL_PARAM: {
          const prefix_raw = path.substring(start2, segment[1]);
          const suffix_raw = path.substring(segment[4], end);
          const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
          const prefix2 = !prefix_raw
            ? void 0
            : actuallyCaseSensitive
              ? prefix_raw
              : prefix_raw.toLowerCase();
          const suffix = !suffix_raw
            ? void 0
            : actuallyCaseSensitive
              ? suffix_raw
              : suffix_raw.toLowerCase();
          const existingNode =
            !skipOnParamError &&
            ((_i = node.optional) == null
              ? void 0
              : _i.find(
                  (s) =>
                    !s.skipOnParamError &&
                    s.caseSensitive === actuallyCaseSensitive &&
                    s.prefix === prefix2 &&
                    s.suffix === suffix,
                ));
          if (existingNode) {
            nextNode = existingNode;
          } else {
            const next = createDynamicNode(
              SEGMENT_TYPE_OPTIONAL_PARAM,
              route.fullPath ?? route.from,
              actuallyCaseSensitive,
              prefix2,
              suffix,
            );
            nextNode = next;
            next.parent = node;
            next.depth = depth;
            node.optional ?? (node.optional = []);
            node.optional.push(next);
          }
          break;
        }
        case SEGMENT_TYPE_WILDCARD: {
          const prefix_raw = path.substring(start2, segment[1]);
          const suffix_raw = path.substring(segment[4], end);
          const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
          const prefix2 = !prefix_raw
            ? void 0
            : actuallyCaseSensitive
              ? prefix_raw
              : prefix_raw.toLowerCase();
          const suffix = !suffix_raw
            ? void 0
            : actuallyCaseSensitive
              ? suffix_raw
              : suffix_raw.toLowerCase();
          const next = createDynamicNode(
            SEGMENT_TYPE_WILDCARD,
            route.fullPath ?? route.from,
            actuallyCaseSensitive,
            prefix2,
            suffix,
          );
          nextNode = next;
          next.parent = node;
          next.depth = depth;
          node.wildcard ?? (node.wildcard = []);
          node.wildcard.push(next);
        }
      }
      node = nextNode;
    }
    if (
      skipOnParamError &&
      route.children &&
      !route.isRoot &&
      route.id &&
      route.id.charCodeAt(route.id.lastIndexOf("/") + 1) === 95
    ) {
      const pathlessNode = createStaticNode(route.fullPath ?? route.from);
      pathlessNode.kind = SEGMENT_TYPE_PATHLESS;
      pathlessNode.parent = node;
      depth++;
      pathlessNode.depth = depth;
      node.pathless ?? (node.pathless = []);
      node.pathless.push(pathlessNode);
      node = pathlessNode;
    }
    const isLeaf = (route.path || !route.children) && !route.isRoot;
    if (isLeaf && path.endsWith("/")) {
      const indexNode = createStaticNode(route.fullPath ?? route.from);
      indexNode.kind = SEGMENT_TYPE_INDEX;
      indexNode.parent = node;
      depth++;
      indexNode.depth = depth;
      node.index = indexNode;
      node = indexNode;
    }
    node.parse =
      ((_k = (_j = route.options) == null ? void 0 : _j.params) == null ? void 0 : _k.parse) ??
      null;
    node.skipOnParamError = skipOnParamError;
    node.parsingPriority =
      ((_m = (_l = route.options) == null ? void 0 : _l.skipRouteOnParseError) == null
        ? void 0
        : _m.priority) ?? 0;
    if (isLeaf && !node.route) {
      node.route = route;
      node.fullPath = route.fullPath ?? route.from;
    }
  }
  if (route.children)
    for (const child of route.children) {
      parseSegments(defaultCaseSensitive, data, child, cursor, node, depth, onRoute);
    }
}
function sortDynamic(a, b2) {
  if (a.skipOnParamError && !b2.skipOnParamError) return -1;
  if (!a.skipOnParamError && b2.skipOnParamError) return 1;
  if (a.skipOnParamError && b2.skipOnParamError && (a.parsingPriority || b2.parsingPriority))
    return b2.parsingPriority - a.parsingPriority;
  if (a.prefix && b2.prefix && a.prefix !== b2.prefix) {
    if (a.prefix.startsWith(b2.prefix)) return -1;
    if (b2.prefix.startsWith(a.prefix)) return 1;
  }
  if (a.suffix && b2.suffix && a.suffix !== b2.suffix) {
    if (a.suffix.endsWith(b2.suffix)) return -1;
    if (b2.suffix.endsWith(a.suffix)) return 1;
  }
  if (a.prefix && !b2.prefix) return -1;
  if (!a.prefix && b2.prefix) return 1;
  if (a.suffix && !b2.suffix) return -1;
  if (!a.suffix && b2.suffix) return 1;
  if (a.caseSensitive && !b2.caseSensitive) return -1;
  if (!a.caseSensitive && b2.caseSensitive) return 1;
  return 0;
}
function sortTreeNodes(node) {
  var _a2, _b2, _c;
  if (node.pathless) {
    for (const child of node.pathless) {
      sortTreeNodes(child);
    }
  }
  if (node.static) {
    for (const child of node.static.values()) {
      sortTreeNodes(child);
    }
  }
  if (node.staticInsensitive) {
    for (const child of node.staticInsensitive.values()) {
      sortTreeNodes(child);
    }
  }
  if ((_a2 = node.dynamic) == null ? void 0 : _a2.length) {
    node.dynamic.sort(sortDynamic);
    for (const child of node.dynamic) {
      sortTreeNodes(child);
    }
  }
  if ((_b2 = node.optional) == null ? void 0 : _b2.length) {
    node.optional.sort(sortDynamic);
    for (const child of node.optional) {
      sortTreeNodes(child);
    }
  }
  if ((_c = node.wildcard) == null ? void 0 : _c.length) {
    node.wildcard.sort(sortDynamic);
    for (const child of node.wildcard) {
      sortTreeNodes(child);
    }
  }
}
function createStaticNode(fullPath) {
  return {
    kind: SEGMENT_TYPE_PATHNAME,
    depth: 0,
    pathless: null,
    index: null,
    static: null,
    staticInsensitive: null,
    dynamic: null,
    optional: null,
    wildcard: null,
    route: null,
    fullPath,
    parent: null,
    parse: null,
    skipOnParamError: false,
    parsingPriority: 0,
  };
}
function createDynamicNode(kind, fullPath, caseSensitive, prefix2, suffix) {
  return {
    kind,
    depth: 0,
    pathless: null,
    index: null,
    static: null,
    staticInsensitive: null,
    dynamic: null,
    optional: null,
    wildcard: null,
    route: null,
    fullPath,
    parent: null,
    parse: null,
    skipOnParamError: false,
    parsingPriority: 0,
    caseSensitive,
    prefix: prefix2,
    suffix,
  };
}
function processRouteMasks(routeList, processedTree) {
  const segmentTree = createStaticNode("/");
  const data = new Uint16Array(6);
  for (const route of routeList) {
    parseSegments(false, data, route, 1, segmentTree, 0);
  }
  sortTreeNodes(segmentTree);
  processedTree.masksTree = segmentTree;
  processedTree.flatCache = createLRUCache(1e3);
}
function findFlatMatch(path, processedTree) {
  path || (path = "/");
  const cached = processedTree.flatCache.get(path);
  if (cached) return cached;
  const result = findMatch(path, processedTree.masksTree);
  processedTree.flatCache.set(path, result);
  return result;
}
function findSingleMatch(from, caseSensitive, fuzzy, path, processedTree) {
  from || (from = "/");
  path || (path = "/");
  const key = caseSensitive ? `case\0${from}` : from;
  let tree = processedTree.singleCache.get(key);
  if (!tree) {
    tree = createStaticNode("/");
    const data = new Uint16Array(6);
    parseSegments(caseSensitive, data, { from }, 1, tree, 0);
    processedTree.singleCache.set(key, tree);
  }
  return findMatch(path, tree, fuzzy);
}
function findRouteMatch(path, processedTree, fuzzy = false) {
  const key = fuzzy ? path : `nofuzz\0${path}`;
  const cached = processedTree.matchCache.get(key);
  if (cached !== void 0) return cached;
  path || (path = "/");
  let result;
  try {
    result = findMatch(path, processedTree.segmentTree, fuzzy);
  } catch (err) {
    if (err instanceof URIError) {
      result = null;
    } else {
      throw err;
    }
  }
  if (result) result.branch = buildRouteBranch(result.route);
  processedTree.matchCache.set(key, result);
  return result;
}
function trimPathRight$1(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function processRouteTree(routeTree, caseSensitive = false, initRoute) {
  const segmentTree = createStaticNode(routeTree.fullPath);
  const data = new Uint16Array(6);
  const routesById = {};
  const routesByPath = {};
  let index = 0;
  parseSegments(caseSensitive, data, routeTree, 1, segmentTree, 0, (route) => {
    initRoute == null ? void 0 : initRoute(route, index);
    invariant(!(route.id in routesById), `Duplicate routes found with id: ${String(route.id)}`);
    routesById[route.id] = route;
    if (index !== 0 && route.path) {
      const trimmedFullPath = trimPathRight$1(route.fullPath);
      if (!routesByPath[trimmedFullPath] || route.fullPath.endsWith("/")) {
        routesByPath[trimmedFullPath] = route;
      }
    }
    index++;
  });
  sortTreeNodes(segmentTree);
  const processedTree = {
    segmentTree,
    singleCache: createLRUCache(1e3),
    matchCache: createLRUCache(1e3),
    flatCache: null,
    masksTree: null,
  };
  return {
    processedTree,
    routesById,
    routesByPath,
  };
}
function findMatch(path, segmentTree, fuzzy = false) {
  const parts = path.split("/");
  const leaf = getNodeMatch(path, parts, segmentTree, fuzzy);
  if (!leaf) return null;
  const [rawParams] = extractParams(path, parts, leaf);
  return {
    route: leaf.node.route,
    rawParams,
    parsedParams: leaf.parsedParams,
  };
}
function extractParams(path, parts, leaf) {
  var _a2, _b2, _c, _d, _e2, _f, _g, _h, _i;
  const list = buildBranch(leaf.node);
  let nodeParts = null;
  const rawParams = {};
  let partIndex = ((_a2 = leaf.extract) == null ? void 0 : _a2.part) ?? 0;
  let nodeIndex = ((_b2 = leaf.extract) == null ? void 0 : _b2.node) ?? 0;
  let pathIndex = ((_c = leaf.extract) == null ? void 0 : _c.path) ?? 0;
  for (; nodeIndex < list.length; partIndex++, nodeIndex++, pathIndex++) {
    const node = list[nodeIndex];
    const part = parts[partIndex];
    const currentPathIndex = pathIndex;
    if (part) pathIndex += part.length;
    if (node.kind === SEGMENT_TYPE_PARAM) {
      nodeParts ?? (nodeParts = leaf.node.fullPath.split("/"));
      const nodePart = nodeParts[nodeIndex];
      const preLength = ((_d = node.prefix) == null ? void 0 : _d.length) ?? 0;
      const isCurlyBraced = nodePart.charCodeAt(preLength) === 123;
      if (isCurlyBraced) {
        const sufLength = ((_e2 = node.suffix) == null ? void 0 : _e2.length) ?? 0;
        const name = nodePart.substring(preLength + 2, nodePart.length - sufLength - 1);
        const value = part.substring(preLength, part.length - sufLength);
        rawParams[name] = decodeURIComponent(value);
      } else {
        const name = nodePart.substring(1);
        rawParams[name] = decodeURIComponent(part);
      }
    } else if (node.kind === SEGMENT_TYPE_OPTIONAL_PARAM) {
      if (leaf.skipped & (1 << nodeIndex)) {
        partIndex--;
        continue;
      }
      nodeParts ?? (nodeParts = leaf.node.fullPath.split("/"));
      const nodePart = nodeParts[nodeIndex];
      const preLength = ((_f = node.prefix) == null ? void 0 : _f.length) ?? 0;
      const sufLength = ((_g = node.suffix) == null ? void 0 : _g.length) ?? 0;
      const name = nodePart.substring(preLength + 3, nodePart.length - sufLength - 1);
      const value =
        node.suffix || node.prefix ? part.substring(preLength, part.length - sufLength) : part;
      if (value) rawParams[name] = decodeURIComponent(value);
    } else if (node.kind === SEGMENT_TYPE_WILDCARD) {
      const n = node;
      const value = path.substring(
        currentPathIndex + (((_h = n.prefix) == null ? void 0 : _h.length) ?? 0),
        path.length - (((_i = n.suffix) == null ? void 0 : _i.length) ?? 0),
      );
      const splat = decodeURIComponent(value);
      rawParams["*"] = splat;
      rawParams._splat = splat;
      break;
    }
  }
  if (leaf.rawParams) Object.assign(rawParams, leaf.rawParams);
  return [rawParams, { part: partIndex, node: nodeIndex, path: pathIndex }];
}
function buildRouteBranch(route) {
  const list = [route];
  while (route.parentRoute) {
    route = route.parentRoute;
    list.push(route);
  }
  list.reverse();
  return list;
}
function buildBranch(node) {
  const list = Array(node.depth + 1);
  do {
    list[node.depth] = node;
    node = node.parent;
  } while (node);
  return list;
}
function getNodeMatch(path, parts, segmentTree, fuzzy) {
  if (path === "/" && segmentTree.index) return { node: segmentTree.index, skipped: 0 };
  const trailingSlash = !last(parts);
  const pathIsIndex = trailingSlash && path !== "/";
  const partsLength = parts.length - (trailingSlash ? 1 : 0);
  const stack = [
    {
      node: segmentTree,
      index: 1,
      skipped: 0,
      depth: 1,
      statics: 1,
      dynamics: 0,
      optionals: 0,
    },
  ];
  let wildcardMatch = null;
  let bestFuzzy = null;
  let bestMatch = null;
  while (stack.length) {
    const frame = stack.pop();
    const { node, index, skipped, depth, statics, dynamics, optionals } = frame;
    let { extract, rawParams, parsedParams } = frame;
    if (node.skipOnParamError) {
      const result = validateMatchParams(path, parts, frame);
      if (!result) continue;
      rawParams = frame.rawParams;
      extract = frame.extract;
      parsedParams = frame.parsedParams;
    }
    if (
      fuzzy &&
      node.route &&
      node.kind !== SEGMENT_TYPE_INDEX &&
      isFrameMoreSpecific(bestFuzzy, frame)
    ) {
      bestFuzzy = frame;
    }
    const isBeyondPath = index === partsLength;
    if (isBeyondPath) {
      if (node.route && !pathIsIndex && isFrameMoreSpecific(bestMatch, frame)) {
        bestMatch = frame;
      }
      if (!node.optional && !node.wildcard && !node.index && !node.pathless) continue;
    }
    const part = isBeyondPath ? void 0 : parts[index];
    let lowerPart;
    if (isBeyondPath && node.index) {
      const indexFrame = {
        node: node.index,
        index,
        skipped,
        depth: depth + 1,
        statics,
        dynamics,
        optionals,
        extract,
        rawParams,
        parsedParams,
      };
      if (node.index.skipOnParamError) {
        const result = validateMatchParams(path, parts, indexFrame);
        if (!result) continue;
      }
      if (statics === partsLength && !dynamics && !optionals && !skipped) {
        return indexFrame;
      }
      if (isFrameMoreSpecific(bestMatch, indexFrame)) {
        bestMatch = indexFrame;
      }
    }
    if (node.wildcard && isFrameMoreSpecific(wildcardMatch, frame)) {
      for (const segment of node.wildcard) {
        const { prefix: prefix2, suffix } = segment;
        if (prefix2) {
          if (isBeyondPath) continue;
          const casePart = segment.caseSensitive
            ? part
            : (lowerPart ?? (lowerPart = part.toLowerCase()));
          if (!casePart.startsWith(prefix2)) continue;
        }
        if (suffix) {
          if (isBeyondPath) continue;
          const end = parts.slice(index).join("/").slice(-suffix.length);
          const casePart = segment.caseSensitive ? end : end.toLowerCase();
          if (casePart !== suffix) continue;
        }
        const frame2 = {
          node: segment,
          index: partsLength,
          skipped,
          depth,
          statics,
          dynamics,
          optionals,
          extract,
          rawParams,
          parsedParams,
        };
        if (segment.skipOnParamError) {
          const result = validateMatchParams(path, parts, frame2);
          if (!result) continue;
        }
        wildcardMatch = frame2;
        break;
      }
    }
    if (node.optional) {
      const nextSkipped = skipped | (1 << depth);
      const nextDepth = depth + 1;
      for (let i = node.optional.length - 1; i >= 0; i--) {
        const segment = node.optional[i];
        stack.push({
          node: segment,
          index,
          skipped: nextSkipped,
          depth: nextDepth,
          statics,
          dynamics,
          optionals,
          extract,
          rawParams,
          parsedParams,
        });
      }
      if (!isBeyondPath) {
        for (let i = node.optional.length - 1; i >= 0; i--) {
          const segment = node.optional[i];
          const { prefix: prefix2, suffix } = segment;
          if (prefix2 || suffix) {
            const casePart = segment.caseSensitive
              ? part
              : (lowerPart ?? (lowerPart = part.toLowerCase()));
            if (prefix2 && !casePart.startsWith(prefix2)) continue;
            if (suffix && !casePart.endsWith(suffix)) continue;
          }
          stack.push({
            node: segment,
            index: index + 1,
            skipped,
            depth: nextDepth,
            statics,
            dynamics,
            optionals: optionals + 1,
            extract,
            rawParams,
            parsedParams,
          });
        }
      }
    }
    if (!isBeyondPath && node.dynamic && part) {
      for (let i = node.dynamic.length - 1; i >= 0; i--) {
        const segment = node.dynamic[i];
        const { prefix: prefix2, suffix } = segment;
        if (prefix2 || suffix) {
          const casePart = segment.caseSensitive
            ? part
            : (lowerPart ?? (lowerPart = part.toLowerCase()));
          if (prefix2 && !casePart.startsWith(prefix2)) continue;
          if (suffix && !casePart.endsWith(suffix)) continue;
        }
        stack.push({
          node: segment,
          index: index + 1,
          skipped,
          depth: depth + 1,
          statics,
          dynamics: dynamics + 1,
          optionals,
          extract,
          rawParams,
          parsedParams,
        });
      }
    }
    if (!isBeyondPath && node.staticInsensitive) {
      const match = node.staticInsensitive.get(lowerPart ?? (lowerPart = part.toLowerCase()));
      if (match) {
        stack.push({
          node: match,
          index: index + 1,
          skipped,
          depth: depth + 1,
          statics: statics + 1,
          dynamics,
          optionals,
          extract,
          rawParams,
          parsedParams,
        });
      }
    }
    if (!isBeyondPath && node.static) {
      const match = node.static.get(part);
      if (match) {
        stack.push({
          node: match,
          index: index + 1,
          skipped,
          depth: depth + 1,
          statics: statics + 1,
          dynamics,
          optionals,
          extract,
          rawParams,
          parsedParams,
        });
      }
    }
    if (node.pathless) {
      const nextDepth = depth + 1;
      for (let i = node.pathless.length - 1; i >= 0; i--) {
        const segment = node.pathless[i];
        stack.push({
          node: segment,
          index,
          skipped,
          depth: nextDepth,
          statics,
          dynamics,
          optionals,
          extract,
          rawParams,
          parsedParams,
        });
      }
    }
  }
  if (bestMatch && wildcardMatch) {
    return isFrameMoreSpecific(wildcardMatch, bestMatch) ? bestMatch : wildcardMatch;
  }
  if (bestMatch) return bestMatch;
  if (wildcardMatch) return wildcardMatch;
  if (fuzzy && bestFuzzy) {
    let sliceIndex = bestFuzzy.index;
    for (let i = 0; i < bestFuzzy.index; i++) {
      sliceIndex += parts[i].length;
    }
    const splat = sliceIndex === path.length ? "/" : path.slice(sliceIndex);
    bestFuzzy.rawParams ?? (bestFuzzy.rawParams = {});
    bestFuzzy.rawParams["**"] = decodeURIComponent(splat);
    return bestFuzzy;
  }
  return null;
}
function validateMatchParams(path, parts, frame) {
  try {
    const [rawParams, state] = extractParams(path, parts, frame);
    frame.rawParams = rawParams;
    frame.extract = state;
    const parsed = frame.node.parse(rawParams);
    frame.parsedParams = Object.assign({}, frame.parsedParams, parsed);
    return true;
  } catch {
    return null;
  }
}
function isFrameMoreSpecific(prev, next) {
  if (!prev) return true;
  return (
    next.statics > prev.statics ||
    (next.statics === prev.statics &&
      (next.dynamics > prev.dynamics ||
        (next.dynamics === prev.dynamics &&
          (next.optionals > prev.optionals ||
            (next.optionals === prev.optionals &&
              ((next.node.kind === SEGMENT_TYPE_INDEX) > (prev.node.kind === SEGMENT_TYPE_INDEX) ||
                ((next.node.kind === SEGMENT_TYPE_INDEX) ===
                  (prev.node.kind === SEGMENT_TYPE_INDEX) &&
                  next.depth > prev.depth)))))))
  );
}
function joinPaths(paths) {
  return cleanPath(
    paths
      .filter((val) => {
        return val !== void 0;
      })
      .join("/"),
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  const len = path.length;
  return len > 1 && path[len - 1] === "/" ? path.replace(/\/{1,}$/, "") : path;
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
function removeTrailingSlash(value, basepath) {
  if ((value == null ? void 0 : value.endsWith("/")) && value !== "/" && value !== `${basepath}/`) {
    return value.slice(0, -1);
  }
  return value;
}
function exactPathTest(pathName1, pathName2, basepath) {
  return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
function resolvePath({ base, to: to2, trailingSlash = "never", cache }) {
  const isAbsolute = to2.startsWith("/");
  const isBase = !isAbsolute && to2 === ".";
  let key;
  if (cache) {
    key = isAbsolute ? to2 : isBase ? base : base + "\0" + to2;
    const cached = cache.get(key);
    if (cached) return cached;
  }
  let baseSegments;
  if (isBase) {
    baseSegments = base.split("/");
  } else if (isAbsolute) {
    baseSegments = to2.split("/");
  } else {
    baseSegments = base.split("/");
    while (baseSegments.length > 1 && last(baseSegments) === "") {
      baseSegments.pop();
    }
    const toSegments = to2.split("/");
    for (let index = 0, length = toSegments.length; index < length; index++) {
      const value = toSegments[index];
      if (value === "") {
        if (!index) {
          baseSegments = [value];
        } else if (index === length - 1) {
          baseSegments.push(value);
        } else;
      } else if (value === "..") {
        baseSegments.pop();
      } else if (value === ".");
      else {
        baseSegments.push(value);
      }
    }
  }
  if (baseSegments.length > 1) {
    if (last(baseSegments) === "") {
      if (trailingSlash === "never") {
        baseSegments.pop();
      }
    } else if (trailingSlash === "always") {
      baseSegments.push("");
    }
  }
  let segment;
  let joined = "";
  for (let i = 0; i < baseSegments.length; i++) {
    if (i > 0) joined += "/";
    const part = baseSegments[i];
    if (!part) continue;
    segment = parseSegment(part, 0, segment);
    const kind = segment[0];
    if (kind === SEGMENT_TYPE_PATHNAME) {
      joined += part;
      continue;
    }
    const end = segment[5];
    const prefix2 = part.substring(0, segment[1]);
    const suffix = part.substring(segment[4], end);
    const value = part.substring(segment[2], segment[3]);
    if (kind === SEGMENT_TYPE_PARAM) {
      joined += prefix2 || suffix ? `${prefix2}{$${value}}${suffix}` : `$${value}`;
    } else if (kind === SEGMENT_TYPE_WILDCARD) {
      joined += prefix2 || suffix ? `${prefix2}{$}${suffix}` : "$";
    } else {
      joined += `${prefix2}{-$${value}}${suffix}`;
    }
  }
  joined = cleanPath(joined);
  const result = joined || "/";
  if (key && cache) cache.set(key, result);
  return result;
}
function encodeParam(key, params, decodeCharMap) {
  const value = params[key];
  if (typeof value !== "string") return value;
  if (key === "_splat") {
    return encodeURI(value);
  } else {
    return encodePathParam(value, decodeCharMap);
  }
}
function interpolatePath({ path, params, decodeCharMap }) {
  let isMissingParams = false;
  const usedParams = {};
  if (!path || path === "/") return { interpolatedPath: "/", usedParams, isMissingParams };
  if (!path.includes("$")) return { interpolatedPath: path, usedParams, isMissingParams };
  const length = path.length;
  let cursor = 0;
  let segment;
  let joined = "";
  while (cursor < length) {
    const start = cursor;
    segment = parseSegment(path, start, segment);
    const end = segment[5];
    cursor = end + 1;
    if (start === end) continue;
    const kind = segment[0];
    if (kind === SEGMENT_TYPE_PATHNAME) {
      joined += "/" + path.substring(start, end);
      continue;
    }
    if (kind === SEGMENT_TYPE_WILDCARD) {
      const splat = params._splat;
      usedParams._splat = splat;
      usedParams["*"] = splat;
      const prefix2 = path.substring(start, segment[1]);
      const suffix = path.substring(segment[4], end);
      if (!splat) {
        isMissingParams = true;
        if (prefix2 || suffix) {
          joined += "/" + prefix2 + suffix;
        }
        continue;
      }
      const value = encodeParam("_splat", params, decodeCharMap);
      joined += "/" + prefix2 + value + suffix;
      continue;
    }
    if (kind === SEGMENT_TYPE_PARAM) {
      const key = path.substring(segment[2], segment[3]);
      if (!isMissingParams && !(key in params)) {
        isMissingParams = true;
      }
      usedParams[key] = params[key];
      const prefix2 = path.substring(start, segment[1]);
      const suffix = path.substring(segment[4], end);
      const value = encodeParam(key, params, decodeCharMap) ?? "undefined";
      joined += "/" + prefix2 + value + suffix;
      continue;
    }
    if (kind === SEGMENT_TYPE_OPTIONAL_PARAM) {
      const key = path.substring(segment[2], segment[3]);
      const valueRaw = params[key];
      if (valueRaw == null) continue;
      usedParams[key] = valueRaw;
      const prefix2 = path.substring(start, segment[1]);
      const suffix = path.substring(segment[4], end);
      const value = encodeParam(key, params, decodeCharMap) ?? "";
      joined += "/" + prefix2 + value + suffix;
      continue;
    }
  }
  if (path.endsWith("/")) joined += "/";
  const interpolatedPath = joined || "/";
  return { usedParams, interpolatedPath, isMissingParams };
}
function encodePathParam(value, decodeCharMap) {
  let encoded = encodeURIComponent(value);
  if (decodeCharMap) {
    for (const [encodedChar, char] of decodeCharMap) {
      encoded = encoded.replaceAll(encodedChar, char);
    }
  }
  return encoded;
}
function isNotFound(obj) {
  return !!(obj == null ? void 0 : obj.isNotFound);
}
function getSafeSessionStorage() {
  try {
    if (typeof window !== "undefined" && typeof window.sessionStorage === "object") {
      return window.sessionStorage;
    }
  } catch {}
  return void 0;
}
const storageKey = "tsr-scroll-restoration-v1_3";
const throttle = (fn2, wait) => {
  let timeout;
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn2(...args);
        timeout = null;
      }, wait);
    }
  };
};
function createScrollRestorationCache() {
  const safeSessionStorage = getSafeSessionStorage();
  if (!safeSessionStorage) {
    return null;
  }
  const persistedState = safeSessionStorage.getItem(storageKey);
  let state = persistedState ? JSON.parse(persistedState) : {};
  return {
    state,
    // This setter is simply to make sure that we set the sessionStorage right
    // after the state is updated. It doesn't necessarily need to be a functional
    // update.
    set: (updater) => {
      state = functionalUpdate(updater, state) || state;
      try {
        safeSessionStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        console.warn("[ts-router] Could not persist scroll restoration state to sessionStorage.");
      }
    },
  };
}
const scrollRestorationCache = createScrollRestorationCache();
const defaultGetScrollRestorationKey = (location) => {
  return location.state.__TSR_key || location.href;
};
function getCssSelector(el) {
  const path = [];
  let parent;
  while ((parent = el.parentNode)) {
    path.push(`${el.tagName}:nth-child(${Array.prototype.indexOf.call(parent.children, el) + 1})`);
    el = parent;
  }
  return `${path.reverse().join(" > ")}`.toLowerCase();
}
let ignoreScroll = false;
function restoreScroll({
  storageKey: storageKey2,
  key,
  behavior,
  shouldScrollRestoration,
  scrollToTopSelectors,
  location,
}) {
  var _a2, _b2;
  let byKey;
  try {
    byKey = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
  } catch (error) {
    console.error(error);
    return;
  }
  const resolvedKey = key || ((_a2 = window.history.state) == null ? void 0 : _a2.__TSR_key);
  const elementEntries = byKey[resolvedKey];
  ignoreScroll = true;
  scroll: {
    if (shouldScrollRestoration && elementEntries && Object.keys(elementEntries).length > 0) {
      for (const elementSelector in elementEntries) {
        const entry = elementEntries[elementSelector];
        if (elementSelector === "window") {
          window.scrollTo({
            top: entry.scrollY,
            left: entry.scrollX,
            behavior,
          });
        } else if (elementSelector) {
          const element = document.querySelector(elementSelector);
          if (element) {
            element.scrollLeft = entry.scrollX;
            element.scrollTop = entry.scrollY;
          }
        }
      }
      break scroll;
    }
    const hash = (location ?? window.location).hash.split("#", 2)[1];
    if (hash) {
      const hashScrollIntoViewOptions =
        ((_b2 = window.history.state) == null ? void 0 : _b2.__hashScrollIntoViewOptions) ?? true;
      if (hashScrollIntoViewOptions) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView(hashScrollIntoViewOptions);
        }
      }
      break scroll;
    }
    const scrollOptions = { top: 0, left: 0, behavior };
    window.scrollTo(scrollOptions);
    if (scrollToTopSelectors) {
      for (const selector of scrollToTopSelectors) {
        if (selector === "window") continue;
        const element =
          typeof selector === "function" ? selector() : document.querySelector(selector);
        if (element) element.scrollTo(scrollOptions);
      }
    }
  }
  ignoreScroll = false;
}
function setupScrollRestoration(router, force) {
  if (!scrollRestorationCache && !router.isServer) {
    return;
  }
  const shouldScrollRestoration = router.options.scrollRestoration ?? false;
  if (shouldScrollRestoration) {
    router.isScrollRestoring = true;
  }
  if (router.isServer || router.isScrollRestorationSetup || !scrollRestorationCache) {
    return;
  }
  router.isScrollRestorationSetup = true;
  ignoreScroll = false;
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  window.history.scrollRestoration = "manual";
  const onScroll = (event) => {
    if (ignoreScroll || !router.isScrollRestoring) {
      return;
    }
    let elementSelector = "";
    if (event.target === document || event.target === window) {
      elementSelector = "window";
    } else {
      const attrId = event.target.getAttribute("data-scroll-restoration-id");
      if (attrId) {
        elementSelector = `[data-scroll-restoration-id="${attrId}"]`;
      } else {
        elementSelector = getCssSelector(event.target);
      }
    }
    const restoreKey = getKey(router.state.location);
    scrollRestorationCache.set((state) => {
      const keyEntry = state[restoreKey] || (state[restoreKey] = {});
      const elementEntry = keyEntry[elementSelector] || (keyEntry[elementSelector] = {});
      if (elementSelector === "window") {
        elementEntry.scrollX = window.scrollX || 0;
        elementEntry.scrollY = window.scrollY || 0;
      } else if (elementSelector) {
        const element = document.querySelector(elementSelector);
        if (element) {
          elementEntry.scrollX = element.scrollLeft || 0;
          elementEntry.scrollY = element.scrollTop || 0;
        }
      }
      return state;
    });
  };
  if (typeof document !== "undefined") {
    document.addEventListener("scroll", throttle(onScroll, 100), true);
  }
  router.subscribe("onRendered", (event) => {
    const cacheKey = getKey(event.toLocation);
    const resetScroll = event.toLocation.state.__TSR_resetScroll ?? true;
    if (!resetScroll) {
      return;
    }
    if (typeof router.options.scrollRestoration === "function") {
      const shouldRestore = router.options.scrollRestoration({
        location: router.latestLocation,
      });
      if (!shouldRestore) {
        return;
      }
    }
    restoreScroll({
      storageKey,
      key: cacheKey,
      behavior: router.options.scrollRestorationBehavior,
      shouldScrollRestoration: router.isScrollRestoring,
      scrollToTopSelectors: router.options.scrollToTopSelectors,
      location: router.history.location,
    });
    if (router.isScrollRestoring) {
      scrollRestorationCache.set((state) => {
        state[cacheKey] || (state[cacheKey] = {});
        return state;
      });
    }
  });
}
function handleHashScroll(router) {
  if (typeof document !== "undefined" && document.querySelector) {
    const hashScrollIntoViewOptions =
      router.state.location.state.__hashScrollIntoViewOptions ?? true;
    if (hashScrollIntoViewOptions && router.state.location.hash !== "") {
      const el = document.getElementById(router.state.location.hash);
      if (el) {
        el.scrollIntoView(hashScrollIntoViewOptions);
      }
    }
  }
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) {
      result.set(key, stringify(val));
    }
  }
  return result.toString();
}
function toValue(str) {
  if (!str) return "";
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
  const searchParams = new URLSearchParams(str);
  const result = {};
  for (const [key, value] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) {
      result[key] = toValue(value);
    } else if (Array.isArray(previousValue)) {
      previousValue.push(toValue(value));
    } else {
      result[key] = [previousValue, toValue(value)];
    }
  }
  return result;
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") {
      searchStr = searchStr.substring(1);
    }
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") {
        try {
          query[key] = parser(value);
        } catch (_err) {}
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) {
      try {
        return stringify(val);
      } catch (_err) {}
    } else if (hasParser && typeof val === "string") {
      try {
        parser(val);
        return stringify(val);
      } catch (_err) {}
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
const rootRouteId = "__root__";
function redirect(opts) {
  opts.statusCode = opts.statusCode || opts.code || 307;
  if (typeof opts.href === "string" && isDangerousProtocol(opts.href)) {
    throw new Error(
      `Redirect blocked: unsafe protocol in href "${opts.href}". Only ${SAFE_URL_PROTOCOLS.join(", ")} protocols are allowed.`,
    );
  }
  if (!opts.reloadDocument && typeof opts.href === "string") {
    try {
      new URL(opts.href);
      opts.reloadDocument = true;
    } catch {}
  }
  const headers = new Headers(opts.headers);
  if (opts.href && headers.get("Location") === null) {
    headers.set("Location", opts.href);
  }
  const response = new Response(null, {
    status: opts.statusCode,
    headers,
  });
  response.options = opts;
  if (opts.throw) {
    throw response;
  }
  return response;
}
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
const triggerOnReady = (inner) => {
  var _a2;
  if (!inner.rendered) {
    inner.rendered = true;
    return (_a2 = inner.onReady) == null ? void 0 : _a2.call(inner);
  }
};
const resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.state.matches.some((d) => d.id === matchId));
};
const buildMatchContext = (inner, index, includeCurrentMatch = true) => {
  const context = {
    ...(inner.router.options.context ?? {}),
  };
  const end = includeCurrentMatch ? index : index - 1;
  for (let i = 0; i <= end; i++) {
    const innerMatch = inner.matches[i];
    if (!innerMatch) continue;
    const m2 = inner.router.getMatch(innerMatch.id);
    if (!m2) continue;
    Object.assign(context, m2.__routeContext, m2.__beforeLoadContext);
  }
  return context;
};
const _handleNotFound = (inner, err) => {
  var _a2;
  const routeCursor = inner.router.routesById[err.routeId ?? ""] ?? inner.router.routeTree;
  if (
    !routeCursor.options.notFoundComponent &&
    ((_a2 = inner.router.options) == null ? void 0 : _a2.defaultNotFoundComponent)
  ) {
    routeCursor.options.notFoundComponent = inner.router.options.defaultNotFoundComponent;
  }
  invariant(routeCursor.options.notFoundComponent);
  const matchForRoute = inner.matches.find((m2) => m2.routeId === routeCursor.id);
  invariant(matchForRoute, "Could not find match for route: " + routeCursor.id);
  inner.updateMatch(matchForRoute.id, (prev) => ({
    ...prev,
    status: "notFound",
    error: err,
    isFetching: false,
  }));
  if (err.routerCode === "BEFORE_LOAD" && routeCursor.parentRoute) {
    err.routeId = routeCursor.parentRoute.id;
    _handleNotFound(inner, err);
  }
};
const handleRedirectAndNotFound = (inner, match, err) => {
  var _a2, _b2, _c;
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) {
    throw err;
  }
  if (match) {
    (_a2 = match._nonReactive.beforeLoadPromise) == null ? void 0 : _a2.resolve();
    (_b2 = match._nonReactive.loaderPromise) == null ? void 0 : _b2.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    const status = isRedirect(err) ? "redirected" : "notFound";
    match._nonReactive.error = err;
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status,
      context: buildMatchContext(inner, match.index),
      isFetching: false,
      error: err,
    }));
    if (isNotFound(err) && !err.routeId) {
      err.routeId = match.routeId;
    }
    (_c = match._nonReactive.loadPromise) == null ? void 0 : _c.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
    throw err;
  } else {
    _handleNotFound(inner, err);
    throw err;
  }
};
const shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!inner.router.isServer && match._nonReactive.dehydrated) {
    return true;
  }
  if (inner.router.isServer && match.ssr === false) {
    return true;
  }
  return false;
};
const handleSerialError = (inner, index, err, routerCode) => {
  var _a2, _b2;
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) {
    throw err;
  }
  err.routerCode = routerCode;
  inner.firstBadMatchIndex ?? (inner.firstBadMatchIndex = index);
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    (_b2 = (_a2 = route.options).onError) == null ? void 0 : _b2.call(_a2, err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    var _a3, _b3;
    (_a3 = prev._nonReactive.beforeLoadPromise) == null ? void 0 : _a3.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    (_b3 = prev._nonReactive.loadPromise) == null ? void 0 : _b3.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController(),
    };
  });
};
const isBeforeLoadSsr = (inner, matchId, index, route) => {
  var _a2;
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = (_a2 = inner.matches[index - 1]) == null ? void 0 : _a2.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = route.id === rootRouteId;
    return;
  }
  if ((parentMatch == null ? void 0 : parentMatch.ssr) === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && (parentMatch == null ? void 0 : parentMatch.ssr) === "data-only") {
      return "data-only";
    }
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr,
    })),
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) {
    return tempSsr.then((ssr) => {
      existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
    });
  }
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
  return;
};
const setupPendingTimeout = (inner, matchId, route, match) => {
  var _a2;
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  const shouldPending = !!(
    inner.onReady &&
    !inner.router.isServer &&
    !resolvePreload(inner, matchId) &&
    (route.options.loader || route.options.beforeLoad || routeNeedsPreload(route)) &&
    typeof pendingMs === "number" &&
    pendingMs !== Infinity &&
    (route.options.pendingComponent ??
      ((_a2 = inner.router.options) == null ? void 0 : _a2.defaultPendingComponent))
  );
  if (shouldPending) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
const preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise)
    return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) {
      handleRedirectAndNotFound(inner, match, match.error);
    }
  };
  return existingMatch._nonReactive.beforeLoadPromise
    ? existingMatch._nonReactive.beforeLoadPromise.then(then)
    : then();
};
const executeBeforeLoad = (inner, matchId, index, route) => {
  var _a2;
  const match = inner.router.getMatch(matchId);
  const prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise == null ? void 0 : prevLoadPromise.resolve();
  });
  const { paramsError, searchError } = match;
  if (paramsError) {
    handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
  }
  if (searchError) {
    handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
  }
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  const parentMatchId = (_a2 = inner.matches[index - 1]) == null ? void 0 : _a2.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  (parentMatch == null ? void 0 : parentMatch.context) ?? inner.router.options.context ?? void 0;
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController,
      // Note: We intentionally don't update context here.
      // Context should only be updated after beforeLoad resolves to avoid
      // components seeing incomplete context during async beforeLoad execution.
    }));
  };
  const resolve = () => {
    var _a3;
    (_a3 = match._nonReactive.beforeLoadPromise) == null ? void 0 : _a3.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false,
    }));
  };
  if (!route.options.beforeLoad) {
    batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const context = {
    ...buildMatchContext(inner, index, false),
    ...match.__routeContext,
  };
  const { search, params, cause } = match;
  const preload = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload,
    context,
    location: inner.location,
    navigate: (opts) =>
      inner.router.navigate({
        ...opts,
        _fromLocation: inner.location,
      }),
    buildLocation: inner.router.buildLocation,
    cause: preload ? "preload" : cause,
    matches: inner.matches,
    ...inner.router.options.additionalContext,
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
    }
    batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2,
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext
        .catch((err) => {
          handleSerialError(inner, index, err, "BEFORE_LOAD");
        })
        .then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err, "BEFORE_LOAD");
  }
  updateContext(beforeLoadContext);
  return;
};
const handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    if (inner.router.isServer) {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
const executeHead = (inner, matchId, route) => {
  var _a2, _b2, _c, _d, _e2, _f;
  const match = inner.router.getMatch(matchId);
  if (!match) {
    return;
  }
  if (!route.options.head && !route.options.scripts && !route.options.headers) {
    return;
  }
  const assetContext = {
    ssr: inner.router.options.ssr,
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData,
  };
  return Promise.all([
    (_b2 = (_a2 = route.options).head) == null ? void 0 : _b2.call(_a2, assetContext),
    (_d = (_c = route.options).scripts) == null ? void 0 : _d.call(_c, assetContext),
    (_f = (_e2 = route.options).headers) == null ? void 0 : _f.call(_e2, assetContext),
  ]).then(([headFnContent, scripts, headers]) => {
    const meta = headFnContent == null ? void 0 : headFnContent.meta;
    const links = headFnContent == null ? void 0 : headFnContent.links;
    const headScripts = headFnContent == null ? void 0 : headFnContent.scripts;
    const styles = headFnContent == null ? void 0 : headFnContent.styles;
    return {
      meta,
      links,
      headScripts,
      headers,
      scripts,
      styles,
    };
  });
};
const getLoaderContext = (inner, matchId, index, route) => {
  const parentMatchPromise = inner.matchPromises[index - 1];
  const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
  const context = buildMatchContext(inner, index);
  const preload = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) =>
      inner.router.navigate({
        ...opts,
        _fromLocation: inner.location,
      }),
    cause: preload ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext,
  };
};
const runLoader = async (inner, matchId, index, route) => {
  var _a2, _b2, _c, _d, _e2, _f;
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!inner.router.isServer || match.ssr === true) {
        loadRouteChunk(route);
      }
      const loaderResult =
        (_b2 = (_a2 = route.options).loader) == null
          ? void 0
          : _b2.call(_a2, getLoaderContext(inner, matchId, index, route));
      const loaderResultIsPromise = route.options.loader && isPromise(loaderResult);
      const willLoadSomething = !!(
        loaderResultIsPromise ||
        route._lazyPromise ||
        route._componentsPromise ||
        route.options.head ||
        route.options.scripts ||
        route.options.headers ||
        match._nonReactive.minPendingPromise
      );
      if (willLoadSomething) {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          isFetching: "loader",
        }));
      }
      if (route.options.loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
        if (loaderData !== void 0) {
          inner.updateMatch(matchId, (prev) => ({
            ...prev,
            loaderData,
          }));
        }
      }
      if (route._lazyPromise) await route._lazyPromise;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        context: buildMatchContext(inner, index),
        status: "success",
        isFetching: false,
        updatedAt: Date.now(),
      }));
    } catch (e) {
      let error = e;
      if ((error == null ? void 0 : error.name) === "AbortError") {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          status: prev.status === "pending" ? "success" : prev.status,
          isFetching: false,
          context: buildMatchContext(inner, index),
        }));
        return;
      }
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (isNotFound(e)) {
        await ((_d = (_c = route.options.notFoundComponent) == null ? void 0 : _c.preload) == null
          ? void 0
          : _d.call(_c));
      }
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
      try {
        (_f = (_e2 = route.options).onError) == null ? void 0 : _f.call(_e2, e);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
      }
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        context: buildMatchContext(inner, index),
        status: "error",
        isFetching: false,
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) {
      match._nonReactive.loaderPromise = void 0;
    }
    handleRedirectAndNotFound(inner, match, err);
  }
};
const loadRouteMatch = async (inner, index) => {
  var _a2, _b2;
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  if (shouldSkipLoader(inner, matchId)) {
    if (inner.router.isServer) {
      return inner.router.getMatch(matchId);
    }
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload) {
        return prevMatch;
      }
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      const error = match2._nonReactive.error || match2.error;
      if (error) {
        handleRedirectAndNotFound(inner, match2, error);
      }
    } else {
      const age = Date.now() - prevMatch.updatedAt;
      const preload = resolvePreload(inner, matchId);
      const staleAge = preload
        ? (route.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4)
        : (route.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0);
      const shouldReloadOption = route.options.shouldReload;
      const shouldReload =
        typeof shouldReloadOption === "function"
          ? shouldReloadOption(getLoaderContext(inner, matchId, index, route))
          : shouldReloadOption;
      const nextPreload = !!preload && !inner.router.state.matches.some((d) => d.id === matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          preload: nextPreload,
        }));
      }
      const { status, invalid } = match2;
      loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? age > staleAge));
      if (preload && route.options.preload === false);
      else if (loaderShouldRunAsync && !inner.sync) {
        loaderIsRunningAsync = true;
        (async () => {
          var _a3, _b3;
          try {
            await runLoader(inner, matchId, index, route);
            const match3 = inner.router.getMatch(matchId);
            (_a3 = match3._nonReactive.loaderPromise) == null ? void 0 : _a3.resolve();
            (_b3 = match3._nonReactive.loadPromise) == null ? void 0 : _b3.resolve();
            match3._nonReactive.loaderPromise = void 0;
          } catch (err) {
            if (isRedirect(err)) {
              await inner.router.navigate(err.options);
            }
          }
        })();
      } else if (status !== "success" || (loaderShouldRunAsync && inner.sync)) {
        await runLoader(inner, matchId, index, route);
      }
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    (_a2 = match._nonReactive.loaderPromise) == null ? void 0 : _a2.resolve();
    (_b2 = match._nonReactive.loadPromise) == null ? void 0 : _b2.resolve();
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false,
    }));
    return inner.router.getMatch(matchId);
  } else {
    return match;
  }
};
async function loadMatches(arg) {
  const inner = Object.assign(arg, {
    matchPromises: [],
  });
  if (!inner.router.isServer && inner.router.state.matches.some((d) => d._forcePending)) {
    triggerOnReady(inner);
  }
  try {
    for (let i = 0; i < inner.matches.length; i++) {
      const beforeLoad = handleBeforeLoad(inner, i);
      if (isPromise(beforeLoad)) await beforeLoad;
    }
    const max = inner.firstBadMatchIndex ?? inner.matches.length;
    for (let i = 0; i < max; i++) {
      inner.matchPromises.push(loadRouteMatch(inner, i));
    }
    const results = await Promise.allSettled(inner.matchPromises);
    const failures = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);
    let firstNotFound;
    for (const err of failures) {
      if (isRedirect(err)) {
        throw err;
      }
      if (!firstNotFound && isNotFound(err)) {
        firstNotFound = err;
      }
    }
    for (const match of inner.matches) {
      const { id: matchId, routeId } = match;
      const route = inner.router.looseRoutesById[routeId];
      try {
        const headResult = executeHead(inner, matchId, route);
        if (headResult) {
          const head = await headResult;
          inner.updateMatch(matchId, (prev) => ({
            ...prev,
            ...head,
          }));
        }
      } catch (err) {
        console.error(`Error executing head for route ${routeId}:`, err);
      }
    }
    if (firstNotFound) {
      throw firstNotFound;
    }
    const readyPromise = triggerOnReady(inner);
    if (isPromise(readyPromise)) await readyPromise;
  } catch (err) {
    if (isNotFound(err) && !inner.preload) {
      const readyPromise = triggerOnReady(inner);
      if (isPromise(readyPromise)) await readyPromise;
      throw err;
    }
    if (isRedirect(err)) {
      throw err;
    }
  }
  return inner.matches;
}
async function loadRouteChunk(route) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) {
    if (route.lazyFn) {
      route._lazyPromise = route.lazyFn().then((lazyRoute) => {
        const { id: _id, ...options } = lazyRoute.options;
        Object.assign(route.options, options);
        route._lazyLoaded = true;
        route._lazyPromise = void 0;
      });
    } else {
      route._lazyLoaded = true;
    }
  }
  if (!route._componentsLoaded && route._componentsPromise === void 0) {
    const loadComponents = () => {
      var _a2;
      const preloads = [];
      for (const type of componentTypes) {
        const preload = (_a2 = route.options[type]) == null ? void 0 : _a2.preload;
        if (preload) preloads.push(preload());
      }
      if (preloads.length)
        return Promise.all(preloads).then(() => {
          route._componentsLoaded = true;
          route._componentsPromise = void 0;
        });
      route._componentsLoaded = true;
      route._componentsPromise = void 0;
      return;
    };
    route._componentsPromise = route._lazyPromise
      ? route._lazyPromise.then(loadComponents)
      : loadComponents();
  }
  return route._componentsPromise;
}
function makeMaybe(value, error) {
  if (error) {
    return { status: "error", error };
  }
  return { status: "success", value };
}
function routeNeedsPreload(route) {
  var _a2;
  for (const componentType of componentTypes) {
    if ((_a2 = route.options[componentType]) == null ? void 0 : _a2.preload) {
      return true;
    }
  }
  return false;
}
const componentTypes = ["component", "errorComponent", "pendingComponent", "notFoundComponent"];
function composeRewrites(rewrites) {
  return {
    input: ({ url }) => {
      for (const rewrite of rewrites) {
        url = executeRewriteInput(rewrite, url);
      }
      return url;
    },
    output: ({ url }) => {
      for (let i = rewrites.length - 1; i >= 0; i--) {
        url = executeRewriteOutput(rewrites[i], url);
      }
      return url;
    },
  };
}
function rewriteBasepath(opts) {
  const trimmedBasepath = trimPath(opts.basepath);
  const normalizedBasepath = `/${trimmedBasepath}`;
  const normalizedBasepathWithSlash = `${normalizedBasepath}/`;
  const checkBasepath = opts.caseSensitive ? normalizedBasepath : normalizedBasepath.toLowerCase();
  const checkBasepathWithSlash = opts.caseSensitive
    ? normalizedBasepathWithSlash
    : normalizedBasepathWithSlash.toLowerCase();
  return {
    input: ({ url }) => {
      const pathname = opts.caseSensitive ? url.pathname : url.pathname.toLowerCase();
      if (pathname === checkBasepath) {
        url.pathname = "/";
      } else if (pathname.startsWith(checkBasepathWithSlash)) {
        url.pathname = url.pathname.slice(normalizedBasepath.length);
      }
      return url;
    },
    output: ({ url }) => {
      url.pathname = joinPaths(["/", trimmedBasepath, url.pathname]);
      return url;
    },
  };
}
function executeRewriteInput(rewrite, url) {
  var _a2;
  const res =
    (_a2 = rewrite == null ? void 0 : rewrite.input) == null ? void 0 : _a2.call(rewrite, { url });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url;
}
function executeRewriteOutput(rewrite, url) {
  var _a2;
  const res =
    (_a2 = rewrite == null ? void 0 : rewrite.output) == null ? void 0 : _a2.call(rewrite, { url });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url;
}
function getLocationChangeInfo(routerState) {
  const fromLocation = routerState.resolvedLocation;
  const toLocation = routerState.location;
  const pathChanged =
    (fromLocation == null ? void 0 : fromLocation.pathname) !== toLocation.pathname;
  const hrefChanged = (fromLocation == null ? void 0 : fromLocation.href) !== toLocation.href;
  const hashChanged = (fromLocation == null ? void 0 : fromLocation.hash) !== toLocation.hash;
  return { fromLocation, toLocation, pathChanged, hrefChanged, hashChanged };
}
class RouterCore {
  /**
   * @deprecated Use the `createRouter` function instead
   */
  constructor(options) {
    this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.startTransition = (fn2) => fn2();
    this.update = (newOptions) => {
      var _a2;
      if (newOptions.notFoundRoute) {
        console.warn(
          "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.",
        );
      }
      const prevOptions = this.options;
      const prevBasepath =
        this.basepath ?? (prevOptions == null ? void 0 : prevOptions.basepath) ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions == null ? void 0 : prevOptions.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions,
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters
        ? new Map(
            this.options.pathParamsAllowedCharacters.map((char) => [
              encodeURIComponent(char),
              char,
            ]),
          )
        : void 0;
      if (!this.history || (this.options.history && this.options.history !== this.history)) {
        if (!this.options.history) {
          if (!this.isServer) {
            this.history = createBrowserHistory();
          }
        } else {
          this.history = this.options.history;
        }
      }
      this.origin = this.options.origin;
      if (!this.origin) {
        if (
          !this.isServer &&
          (window == null ? void 0 : window.origin) &&
          window.origin !== "null"
        ) {
          this.origin = window.origin;
        } else {
          this.origin = "http://localhost";
        }
      }
      if (this.history) {
        this.updateLatestLocation();
      }
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        this.buildRouteTree();
      }
      if (!this.__store && this.latestLocation) {
        this.__store = new Store(getInitialRouterState(this.latestLocation), {
          onUpdate: () => {
            this.__store.state = {
              ...this.state,
              cachedMatches: this.state.cachedMatches.filter(
                (d) => !["redirected"].includes(d.status),
              ),
            };
          },
        });
        setupScrollRestoration(this);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      const basepathChanged = basepathWasUnset || prevBasepath !== nextBasepath;
      const rewriteChanged = prevRewriteOption !== nextRewriteOption;
      if (basepathChanged || rewriteChanged) {
        this.basepath = nextBasepath;
        const rewrites = [];
        if (trimPath(nextBasepath) !== "") {
          rewrites.push(
            rewriteBasepath({
              basepath: nextBasepath,
            }),
          );
        }
        if (nextRewriteOption) {
          rewrites.push(nextRewriteOption);
        }
        this.rewrite =
          rewrites.length === 0
            ? void 0
            : rewrites.length === 1
              ? rewrites[0]
              : composeRewrites(rewrites);
        if (this.history) {
          this.updateLatestLocation();
        }
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.__store) {
        this.__store.state = {
          ...this.state,
          location: this.latestLocation,
        };
      }
      if (
        typeof window !== "undefined" &&
        "CSS" in window &&
        typeof ((_a2 = window.CSS) == null ? void 0 : _a2.supports) === "function"
      ) {
        this.isViewTransitionTypesSupported = window.CSS.supports(
          "selector(:active-view-transition-type(a)",
        );
      }
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
    };
    this.buildRouteTree = () => {
      const { routesById, routesByPath, processedTree } = processRouteTree(
        this.routeTree,
        this.options.caseSensitive,
        (route, i) => {
          route.init({
            originalIndex: i,
          });
        },
      );
      if (this.options.routeMasks) {
        processRouteMasks(this.options.routeMasks, processedTree);
      }
      this.routesById = routesById;
      this.routesByPath = routesByPath;
      this.processedTree = processedTree;
      const notFoundRoute = this.options.notFoundRoute;
      if (notFoundRoute) {
        notFoundRoute.init({
          originalIndex: 99999999999,
        });
        this.routesById[notFoundRoute.id] = notFoundRoute;
      }
    };
    this.subscribe = (eventType, fn2) => {
      const listener = {
        eventType,
        fn: fn2,
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) {
          listener.fn(routerEvent);
        }
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({ href, state }) => {
        const fullUrl = new URL(href, this.origin);
        const url = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url.search = searchStr;
        const fullPath = url.href.replace(url.origin, "");
        return {
          href: fullPath,
          publicHref: href,
          url,
          pathname: decodePath(url.pathname),
          searchStr,
          search: replaceEqualDeep(
            previousLocation == null ? void 0 : previousLocation.search,
            parsedSearch,
          ),
          hash: decodePath(url.hash.split("#").reverse()[0] ?? ""),
          state: replaceEqualDeep(
            previousLocation == null ? void 0 : previousLocation.state,
            state,
          ),
        };
      };
      const location = parse(locationToParse);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location,
        };
      }
      return location;
    };
    this.resolvePathCache = createLRUCache(1e3);
    this.resolvePathWithBase = (from, path) => {
      const resolvedPath = resolvePath({
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash,
        cache: this.resolvePathCache,
      });
      return resolvedPath;
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") {
        return this.matchRoutesInternal(
          {
            pathname: pathnameOrNext,
            search: locationSearchOrOpts,
          },
          opts,
        );
      }
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname) => {
      return getMatchedRoutes({
        pathname,
        routesById: this.routesById,
        processedTree: this.processedTree,
      });
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      const currentPendingMatches = this.state.matches.filter(
        (match) => match.status === "pending",
      );
      const currentLoadingMatches = this.state.matches.filter(
        (match) => match.isFetching === "loader",
      );
      const matchesToCancelArray = /* @__PURE__ */ new Set([
        ...(this.state.pendingMatches ?? []),
        ...currentPendingMatches,
        ...currentLoadingMatches,
      ]);
      matchesToCancelArray.forEach((match) => {
        this.cancelMatch(match.id);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        var _a2, _b2;
        const currentLocation =
          dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
        const allCurrentLocationMatches = this.matchRoutes(currentLocation, {
          _buildLocation: true,
        });
        const lastMatch = last(allCurrentLocationMatches);
        if (dest.from && false);
        const defaultedFromPath =
          dest.unsafeRelative === "path"
            ? currentLocation.pathname
            : (dest.from ?? lastMatch.fullPath);
        const fromPath = this.resolvePathWithBase(defaultedFromPath, ".");
        const fromSearch = lastMatch.search;
        const fromParams = { ...lastMatch.params };
        const nextTo = dest.to
          ? this.resolvePathWithBase(fromPath, `${dest.to}`)
          : this.resolvePathWithBase(fromPath, ".");
        const nextParams =
          dest.params === false || dest.params === null
            ? {}
            : (dest.params ?? true) === true
              ? fromParams
              : Object.assign(fromParams, functionalUpdate(dest.params, fromParams));
        const interpolatedNextTo = interpolatePath({
          path: nextTo,
          params: nextParams,
        }).interpolatedPath;
        const destMatches = this.matchRoutes(interpolatedNextTo, void 0, {
          _buildLocation: true,
        });
        const destRoutes = destMatches.map((d) => this.looseRoutesById[d.routeId]);
        const globalNotFoundMatch = destMatches.find((m2) => m2.globalNotFound);
        if (Object.keys(nextParams).length > 0) {
          for (const route of destRoutes) {
            const fn2 =
              ((_a2 = route.options.params) == null ? void 0 : _a2.stringify) ??
              route.options.stringifyParams;
            if (fn2) {
              Object.assign(nextParams, fn2(nextParams));
            }
          }
        }
        const nextPathname = opts.leaveParams
          ? // Use the original template path for interpolation
            // This preserves the original parameter syntax including optional parameters
            nextTo
          : decodePath(
              interpolatePath({
                path: nextTo,
                params: nextParams,
                decodeCharMap: this.pathParamsDecodeCharMap,
              }).interpolatedPath,
            );
        let nextSearch = fromSearch;
        if (
          opts._includeValidateSearch &&
          ((_b2 = this.options.search) == null ? void 0 : _b2.strict)
        ) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) {
              try {
                Object.assign(
                  validatedSearch,
                  validateSearch(route.options.validateSearch, {
                    ...validatedSearch,
                    ...nextSearch,
                  }),
                );
              } catch {}
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch,
        });
        nextSearch = replaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash =
          dest.hash === true
            ? currentLocation.hash
            : dest.hash
              ? functionalUpdate(dest.hash, currentLocation.hash)
              : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState =
          dest.state === true
            ? currentLocation.state
            : dest.state
              ? functionalUpdate(dest.state, currentLocation.state)
              : {};
        nextState = replaceEqualDeep(currentLocation.state, nextState);
        const matchSnapshot = buildMatchSnapshotFromRoutes({
          routes: destRoutes,
          params: nextParams,
          searchStr,
          globalNotFoundRouteId: globalNotFoundMatch == null ? void 0 : globalNotFoundMatch.routeId,
        });
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        const url = new URL(fullPath, this.origin);
        const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
        const encodedHref = url.href.replace(url.origin, "");
        return {
          publicHref: rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash,
          href: encodedHref,
          url: rewrittenUrl,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          unmaskOnReload: dest.unmaskOnReload,
          _matchSnapshot: matchSnapshot,
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          const params = {};
          if (this.options.routeMasks) {
            const match = findFlatMatch(next.pathname, this.processedTree);
            if (match) {
              Object.assign(params, match.rawParams);
              const { from: _from, params: maskParams, ...maskProps } = match.route;
              const nextParams =
                maskParams === false || maskParams === null
                  ? {}
                  : (maskParams ?? true) === true
                    ? params
                    : Object.assign(params, functionalUpdate(maskParams, params));
              maskedDest = {
                from: opts.from,
                ...maskProps,
                params: nextParams,
              };
              maskedNext = build(maskedDest);
            }
          }
        }
        if (maskedNext) {
          next.maskedLocation = maskedNext;
        }
        return next;
      };
      if (opts.mask) {
        return buildWithMatches(opts, {
          from: opts.from,
          ...opts.mask,
        });
      }
      return buildWithMatches(opts);
    };
    this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
      var _a2;
      const isSameState = () => {
        const ignoredProps = [
          "key",
          // TODO: Remove in v2 - use __TSR_key instead
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions",
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
      const previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise == null ? void 0 : previousCommitPromise.resolve();
      });
      if (isSameUrl && isSameState()) {
        this.load();
        return this.commitLocationPromise;
      }
      let {
        // eslint-disable-next-line prefer-const
        maskedLocation,
        // eslint-disable-next-line prefer-const
        hashScrollIntoView,
        // don't pass url into history since it is a URL instance that cannot be serialized
        // eslint-disable-next-line prefer-const
        url: _url,
        ...nextHistory
      } = next;
      if (maskedLocation) {
        nextHistory = {
          ...maskedLocation,
          state: {
            ...maskedLocation.state,
            __tempKey: void 0,
            __tempLocation: {
              ...nextHistory,
              search: nextHistory.searchStr,
              state: {
                ...nextHistory.state,
                __tempKey: void 0,
                __tempLocation: void 0,
                __TSR_key: void 0,
                key: void 0,
                // TODO: Remove in v2 - use __TSR_key instead
              },
            },
          },
        };
        if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) {
          nextHistory.state.__tempKey = this.tempLocationKey;
        }
      }
      nextHistory.state.__hashScrollIntoViewOptions =
        hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
      nextHistory.state.__TSR_resetScroll = next.resetScroll ?? true;
      this.shouldViewTransition = viewTransition;
      nextHistory.state.__TSR_sessionId = this.sessionId;
      nextHistory.state.__TSR_matches =
        next._matchSnapshot ??
        buildMatchSnapshot({
          matchResult: this.getMatchedRoutes(next.pathname),
          pathname: next.pathname,
          searchStr: next.searchStr,
          notFoundRoute: this.options.notFoundRoute,
          notFoundMode: this.options.notFoundMode,
        });
      const precomputedLocation = {
        ...next,
        publicHref: nextHistory.publicHref,
        state: nextHistory.state,
        maskedLocation,
      };
      const result = await this.history[next.replace ? "replace" : "push"](
        nextHistory.publicHref,
        nextHistory.state,
        { ignoreBlocker, skipTransitionerLoad: true },
      );
      if (result.type === "BLOCKED") {
        (_a2 = this.commitLocationPromise) == null ? void 0 : _a2.resolve();
        return this.commitLocationPromise;
      }
      if (this.history.location.href !== nextHistory.publicHref) {
        return this.commitLocationPromise;
      }
      this.latestLocation = precomputedLocation;
      this.load({ _skipUpdateLatestLocation: true });
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({
      replace,
      resetScroll,
      hashScrollIntoView,
      viewTransition,
      ignoreBlocker,
      href,
      ...rest
    } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, {
          __TSR_index: replace ? currentIndex : currentIndex + 1,
        });
        const hrefUrl = new URL(parsed.pathname, this.origin);
        const rewrittenUrl = executeRewriteInput(this.rewrite, hrefUrl);
        rest.to = rewrittenUrl.pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true,
      });
      this.pendingBuiltLocation = location;
      const commitPromise = this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker,
      });
      Promise.resolve().then(() => {
        if (this.pendingBuiltLocation === location) {
          this.pendingBuiltLocation = void 0;
        }
      });
      return commitPromise;
    };
    this.navigate = async ({ to: to2, reloadDocument, href, publicHref, ...rest }) => {
      var _a2;
      let hrefIsUrl = false;
      if (href) {
        try {
          new URL(`${href}`);
          hrefIsUrl = true;
        } catch {}
      }
      if (hrefIsUrl && !reloadDocument) {
        reloadDocument = true;
      }
      if (reloadDocument) {
        if (to2 !== void 0 || !href) {
          const location = this.buildLocation({ to: to2, ...rest });
          href = href ?? location.url.href;
          publicHref = publicHref ?? location.url.href;
        }
        const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
        if (isDangerousProtocol(reloadHref)) {
          return Promise.resolve();
        }
        if (!rest.ignoreBlocker) {
          const historyWithBlockers = this.history;
          const blockers =
            ((_a2 = historyWithBlockers.getBlockers) == null
              ? void 0
              : _a2.call(historyWithBlockers)) ?? [];
          for (const blocker of blockers) {
            if (blocker == null ? void 0 : blocker.blockerFn) {
              const shouldBlock = await blocker.blockerFn({
                currentLocation: this.latestLocation,
                nextLocation: this.latestLocation,
                // External URLs don't have a next location in our router
                action: "PUSH",
              });
              if (shouldBlock) {
                return Promise.resolve();
              }
            }
          }
        }
        if (rest.replace) {
          window.location.replace(reloadHref);
        } else {
          window.location.href = reloadHref;
        }
        return Promise.resolve();
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to: to2,
        _isNavigate: true,
      });
    };
    this.beforeLoad = (opts) => {
      this.cancelMatches();
      if (!(opts == null ? void 0 : opts._skipUpdateLatestLocation)) {
        this.updateLatestLocation();
      }
      if (this.isServer) {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true,
        });
        if (
          this.latestLocation.publicHref !== nextLocation.publicHref ||
          nextLocation.url.origin !== this.origin
        ) {
          const href = this.getParsedLocationHref(nextLocation);
          throw redirect({ href });
        }
      }
      const snapshot =
        this.latestLocation.state.__TSR_sessionId === this.sessionId
          ? this.latestLocation.state.__TSR_matches
          : void 0;
      const pendingMatches = this.matchRoutes(this.latestLocation, { snapshot });
      this.__store.setState((s) => ({
        ...s,
        status: "pending",
        statusCode: 200,
        isLoading: true,
        location: this.latestLocation,
        pendingMatches,
        // If a cached moved to pendingMatches, remove it from cachedMatches
        cachedMatches: s.cachedMatches.filter((d) => !pendingMatches.some((e) => e.id === d.id)),
      }));
    };
    this.load = async (opts) => {
      let redirect2;
      let notFound;
      let loadPromise;
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          var _a2;
          try {
            this.beforeLoad({
              _skipUpdateLatestLocation: opts == null ? void 0 : opts._skipUpdateLatestLocation,
            });
            const next = this.latestLocation;
            const prevLocation = this.state.resolvedLocation;
            if (!this.state.redirect) {
              this.emit({
                type: "onBeforeNavigate",
                ...getLocationChangeInfo({
                  resolvedLocation: prevLocation,
                  location: next,
                }),
              });
            }
            this.emit({
              type: "onBeforeLoad",
              ...getLocationChangeInfo({
                resolvedLocation: prevLocation,
                location: next,
              }),
            });
            await loadMatches({
              router: this,
              sync: opts == null ? void 0 : opts.sync,
              matches: this.state.pendingMatches,
              location: next,
              updateMatch: this.updateMatch,
              // eslint-disable-next-line @typescript-eslint/require-await
              onReady: async () => {
                this.startTransition(() => {
                  this.startViewTransition(async () => {
                    let exitingMatches = [];
                    let enteringMatches = [];
                    let stayingMatches = [];
                    batch(() => {
                      this.__store.setState((s) => {
                        const previousMatches = s.matches;
                        const newMatches = s.pendingMatches || s.matches;
                        exitingMatches = previousMatches.filter(
                          (match) => !newMatches.some((d) => d.id === match.id),
                        );
                        enteringMatches = newMatches.filter(
                          (match) => !previousMatches.some((d) => d.id === match.id),
                        );
                        stayingMatches = newMatches.filter((match) =>
                          previousMatches.some((d) => d.id === match.id),
                        );
                        return {
                          ...s,
                          isLoading: false,
                          loadedAt: Date.now(),
                          matches: newMatches,
                          pendingMatches: void 0,
                          /**
                           * When committing new matches, cache any exiting matches that are still usable.
                           * Routes that resolved with `status: 'error'` or `status: 'notFound'` are
                           * deliberately excluded from `cachedMatches` so that subsequent invalidations
                           * or reloads re-run their loaders instead of reusing the failed/not-found data.
                           */
                          cachedMatches: [
                            ...s.cachedMatches,
                            ...exitingMatches.filter(
                              (d) => d.status !== "error" && d.status !== "notFound",
                            ),
                          ],
                        };
                      });
                      this.clearExpiredCache();
                    });
                    [
                      [exitingMatches, "onLeave"],
                      [enteringMatches, "onEnter"],
                      [stayingMatches, "onStay"],
                    ].forEach(([matches, hook]) => {
                      matches.forEach((match) => {
                        var _a3, _b2;
                        (_b2 = (_a3 = this.looseRoutesById[match.routeId].options)[hook]) == null
                          ? void 0
                          : _b2.call(_a3, match);
                      });
                    });
                  });
                });
              },
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
              if (!this.isServer) {
                this.navigate({
                  ...redirect2.options,
                  replace: true,
                  ignoreBlocker: true,
                });
              }
            } else if (isNotFound(err)) {
              notFound = err;
            }
            this.__store.setState((s) => ({
              ...s,
              statusCode: redirect2
                ? redirect2.status
                : notFound
                  ? 404
                  : s.matches.some((d) => d.status === "error")
                    ? 500
                    : 200,
              redirect: redirect2,
            }));
          }
          if (this.latestLoadPromise === loadPromise) {
            (_a2 = this.commitLocationPromise) == null ? void 0 : _a2.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) {
        await this.latestLoadPromise;
      }
      let newStatusCode = void 0;
      if (this.hasNotFoundMatch()) {
        newStatusCode = 404;
      } else if (this.__store.state.matches.some((d) => d.status === "error")) {
        newStatusCode = 500;
      }
      if (newStatusCode !== void 0) {
        this.__store.setState((s) => ({
          ...s,
          statusCode: newStatusCode,
        }));
      }
    };
    this.startViewTransition = (fn2) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      delete this.shouldViewTransition;
      if (
        shouldViewTransition &&
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"
      ) {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.state.resolvedLocation;
          const resolvedViewTransitionTypes =
            typeof shouldViewTransition.types === "function"
              ? shouldViewTransition.types(
                  getLocationChangeInfo({
                    resolvedLocation: prevLocation,
                    location: next,
                  }),
                )
              : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn2();
            return;
          }
          startViewTransitionParams = {
            update: fn2,
            types: resolvedViewTransitionTypes,
          };
        } else {
          startViewTransitionParams = fn2;
        }
        document.startViewTransition(startViewTransitionParams);
      } else {
        fn2();
      }
    };
    this.updateMatch = (id, updater) => {
      this.startTransition(() => {
        var _a2;
        const matchesKey = (
          (_a2 = this.state.pendingMatches) == null ? void 0 : _a2.some((d) => d.id === id)
        )
          ? "pendingMatches"
          : this.state.matches.some((d) => d.id === id)
            ? "matches"
            : this.state.cachedMatches.some((d) => d.id === id)
              ? "cachedMatches"
              : "";
        if (matchesKey) {
          this.__store.setState((s) => {
            var _a3;
            return {
              ...s,
              [matchesKey]:
                (_a3 = s[matchesKey]) == null
                  ? void 0
                  : _a3.map((d) => (d.id === id ? updater(d) : d)),
            };
          });
        }
      });
    };
    this.getMatch = (matchId) => {
      var _a2;
      const findFn = (d) => d.id === matchId;
      return (
        this.state.cachedMatches.find(findFn) ??
        ((_a2 = this.state.pendingMatches) == null ? void 0 : _a2.find(findFn)) ??
        this.state.matches.find(findFn)
      );
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        var _a2;
        if (
          ((_a2 = opts == null ? void 0 : opts.filter) == null ? void 0 : _a2.call(opts, d)) ??
          true
        ) {
          return {
            ...d,
            invalid: true,
            ...((opts == null ? void 0 : opts.forcePending) ||
            d.status === "error" ||
            d.status === "notFound"
              ? { status: "pending", error: void 0 }
              : void 0),
          };
        }
        return d;
      };
      this.__store.setState((s) => {
        var _a2;
        return {
          ...s,
          matches: s.matches.map(invalidate),
          cachedMatches: s.cachedMatches.map(invalidate),
          pendingMatches: (_a2 = s.pendingMatches) == null ? void 0 : _a2.map(invalidate),
        };
      });
      this.shouldViewTransition = false;
      return this.load({ sync: opts == null ? void 0 : opts.sync });
    };
    this.getParsedLocationHref = (location) => {
      let href = location.url.href;
      if (this.origin && location.url.origin === this.origin) {
        href = href.replace(this.origin, "") || "/";
      }
      return href;
    };
    this.resolveRedirect = (redirect2) => {
      const locationHeader = redirect2.headers.get("Location");
      if (!redirect2.options.href) {
        const location = this.buildLocation(redirect2.options);
        const href = this.getParsedLocationHref(location);
        redirect2.options.href = href;
        redirect2.headers.set("Location", href);
      } else if (locationHeader) {
        try {
          const url = new URL(locationHeader);
          if (this.origin && url.origin === this.origin) {
            const href = url.pathname + url.search + url.hash;
            redirect2.options.href = href;
            redirect2.headers.set("Location", href);
          }
        } catch {}
      }
      if (!redirect2.headers.get("Location")) {
        redirect2.headers.set("Location", redirect2.options.href);
      }
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter = opts == null ? void 0 : opts.filter;
      if (filter !== void 0) {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: s.cachedMatches.filter((m2) => !filter(m2)),
          };
        });
      } else {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: [],
          };
        });
      }
    };
    this.clearExpiredCache = () => {
      const filter = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) {
          return true;
        }
        const gcTime =
          (d.preload
            ? (route.options.preloadGcTime ?? this.options.defaultPreloadGcTime)
            : (route.options.gcTime ?? this.options.defaultGcTime)) ?? 5 * 60 * 1e3;
        const isError = d.status === "error";
        if (isError) return true;
        const gcEligible = Date.now() - d.updatedAt >= gcTime;
        return gcEligible;
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next = this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts,
      });
      const activeMatchIds = new Set(
        [...this.state.matches, ...(this.state.pendingMatches ?? [])].map((d) => d.id),
      );
      const loadedMatchIds = /* @__PURE__ */ new Set([
        ...activeMatchIds,
        ...this.state.cachedMatches.map((d) => d.id),
      ]);
      batch(() => {
        matches.forEach((match) => {
          if (!loadedMatchIds.has(match.id)) {
            this.__store.setState((s) => ({
              ...s,
              cachedMatches: [...s.cachedMatches, match],
            }));
          }
        });
      });
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) {
              matches = matches.map((d) => (d.id === id ? updater(d) : d));
            } else {
              this.updateMatch(id, updater);
            }
          },
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) {
            return void 0;
          }
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next,
          });
        }
        if (!isNotFound(err)) {
          console.error(err);
        }
        return void 0;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
        params: location.params || {},
        leaveParams: true,
      };
      const next = this.buildLocation(matchLocation);
      if ((opts == null ? void 0 : opts.pending) && this.state.status !== "pending") {
        return false;
      }
      const pending =
        (opts == null ? void 0 : opts.pending) === void 0 ? !this.state.isLoading : opts.pending;
      const baseLocation = pending
        ? this.latestLocation
        : this.state.resolvedLocation || this.state.location;
      const match = findSingleMatch(
        next.pathname,
        (opts == null ? void 0 : opts.caseSensitive) ?? false,
        (opts == null ? void 0 : opts.fuzzy) ?? false,
        baseLocation.pathname,
        this.processedTree,
      );
      if (!match) {
        return false;
      }
      if (location.params) {
        if (!deepEqual(match.rawParams, location.params, { partial: true })) {
          return false;
        }
      }
      if ((opts == null ? void 0 : opts.includeSearch) ?? true) {
        return deepEqual(baseLocation.search, next.search, { partial: true })
          ? match.rawParams
          : false;
      }
      return match.rawParams;
    };
    this.hasNotFoundMatch = () => {
      return this.__store.state.matches.some((d) => d.status === "notFound" || d.globalNotFound);
    };
    this.sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
    });
    if (typeof document !== "undefined") {
      self.__TSR_ROUTER__ = this;
    }
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  matchRoutesInternal(next, opts) {
    var _a2, _b2;
    const snapshot = opts == null ? void 0 : opts.snapshot;
    const snapshotValid =
      snapshot &&
      snapshot.routeIds.length > 0 &&
      snapshot.routeIds.every((id) => this.routesById[id]);
    let matchedRoutes;
    let routeParams;
    let globalNotFoundRouteId;
    let parsedParams;
    if (snapshotValid) {
      matchedRoutes = snapshot.routeIds.map((id) => this.routesById[id]);
      routeParams = { ...snapshot.params };
      globalNotFoundRouteId = snapshot.globalNotFoundRouteId;
      parsedParams = snapshot.parsedParams;
    } else {
      const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
      const { foundRoute, routeParams: rp } = matchedRoutesResult;
      routeParams = rp;
      matchedRoutes = matchedRoutesResult.matchedRoutes;
      parsedParams = matchedRoutesResult.parsedParams;
      let isGlobalNotFound = false;
      if (
        // If we found a route, and it's not an index route and we have left over path
        foundRoute
          ? foundRoute.path !== "/" && routeParams["**"]
          : // Or if we didn't find a route and we have left over path
            trimPathRight(next.pathname)
      ) {
        if (this.options.notFoundRoute) {
          matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
        } else {
          isGlobalNotFound = true;
        }
      }
      globalNotFoundRouteId = (() => {
        if (!isGlobalNotFound) {
          return void 0;
        }
        if (this.options.notFoundMode !== "root") {
          for (let i = matchedRoutes.length - 1; i >= 0; i--) {
            const route = matchedRoutes[i];
            if (route.children) {
              return route.id;
            }
          }
        }
        return rootRouteId;
      })();
    }
    const matches = [];
    const getParentContext = (parentMatch) => {
      const parentMatchId = parentMatch == null ? void 0 : parentMatch.id;
      const parentContext = !parentMatchId
        ? (this.options.context ?? void 0)
        : (parentMatch.context ?? this.options.context ?? void 0);
      return parentContext;
    };
    const canUseCachedSearch =
      snapshotValid &&
      snapshot.searchStr === next.searchStr &&
      ((_a2 = snapshot.validatedSearches) == null ? void 0 : _a2.length) === matchedRoutes.length;
    const validatedSearchesToCache = [];
    matchedRoutes.forEach((route, index) => {
      var _a3, _b3, _c;
      const parentMatch = matches[index - 1];
      const [preMatchSearch, strictMatchSearch, searchError] = (() => {
        if (canUseCachedSearch) {
          const cached = snapshot.validatedSearches[index];
          return [cached.search, cached.strictSearch, void 0];
        }
        const parentSearch = (parentMatch == null ? void 0 : parentMatch.search) ?? next.search;
        const parentStrictSearch =
          (parentMatch == null ? void 0 : parentMatch._strictSearch) ?? void 0;
        try {
          const strictSearch =
            validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          return [
            {
              ...parentSearch,
              ...strictSearch,
            },
            { ...parentStrictSearch, ...strictSearch },
            void 0,
          ];
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) {
            searchParamError = new SearchParamError(err.message, {
              cause: err,
            });
          }
          if (opts == null ? void 0 : opts.throwOnError) {
            throw searchParamError;
          }
          return [parentSearch, {}, searchParamError];
        }
      })();
      if (!canUseCachedSearch) {
        validatedSearchesToCache.push({
          search: preMatchSearch,
          strictSearch: strictMatchSearch,
        });
      }
      const loaderDeps =
        ((_b3 = (_a3 = route.options).loaderDeps) == null
          ? void 0
          : _b3.call(_a3, {
              search: preMatchSearch,
            })) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decodeCharMap: this.pathParamsDecodeCharMap,
      });
      const matchId =
        // route.id for disambiguation
        route.id + // interpolatedPath for param changes
        interpolatedPath + // explicit deps
        loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = this.state.matches.find((d) => d.routeId === route.id);
      const strictParams =
        (existingMatch == null ? void 0 : existingMatch._strictParams) ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) {
        if (route.options.skipRouteOnParseError) {
          for (const key in usedParams) {
            if (key in parsedParams) {
              strictParams[key] = parsedParams[key];
            }
          }
        } else {
          const strictParseParams =
            ((_c = route.options.params) == null ? void 0 : _c.parse) ?? route.options.parseParams;
          if (strictParseParams) {
            try {
              Object.assign(strictParams, strictParseParams(strictParams));
            } catch (err) {
              if (isNotFound(err) || isRedirect(err)) {
                paramsError = err;
              } else {
                paramsError = new PathParamError(err.message, {
                  cause: err,
                });
              }
              if (opts == null ? void 0 : opts.throwOnError) {
                throw paramsError;
              }
            }
          }
        }
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) {
        match = {
          ...existingMatch,
          cause,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          _strictParams: strictParams,
          search: previousMatch
            ? replaceEqualDeep(previousMatch.search, preMatchSearch)
            : replaceEqualDeep(existingMatch.search, preMatchSearch),
          _strictSearch: strictMatchSearch,
        };
      } else {
        const status =
          route.options.loader ||
          route.options.beforeLoad ||
          route.lazyFn ||
          routeNeedsPreload(route)
            ? "pending"
            : "success";
        match = {
          id: matchId,
          ssr: this.isServer ? void 0 : route.options.ssr,
          index,
          routeId: route.id,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch
            ? replaceEqualDeep(previousMatch.search, preMatchSearch)
            : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: {
            loadPromise: createControlledPromise(),
          },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch
            ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps)
            : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath,
        };
      }
      if (!(opts == null ? void 0 : opts.preload)) {
        match.globalNotFound = globalNotFoundRouteId === route.id;
      }
      match.searchError = searchError;
      const parentContext = getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext,
      };
      matches.push(match);
    });
    if (!canUseCachedSearch && validatedSearchesToCache.length > 0) {
      const existingSnapshot = (_b2 = next.state) == null ? void 0 : _b2.__TSR_matches;
      if (existingSnapshot) {
        existingSnapshot.searchStr = next.searchStr;
        existingSnapshot.validatedSearches = validatedSearchesToCache;
      }
    }
    matches.forEach((match, index) => {
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      if (!existingMatch && (opts == null ? void 0 : opts._buildLocation) !== true) {
        const parentMatch = matches[index - 1];
        const parentContext = getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next,
            navigate: (opts2) => this.navigate({ ...opts2, _fromLocation: next }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches,
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext,
        };
      }
    });
    return matches;
  }
}
class SearchParamError extends Error {}
class PathParamError extends Error {}
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200,
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
    if (result.issues)
      throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), {
        cause: result,
      });
    return result.value;
  }
  if ("parse" in validateSearch2) {
    return validateSearch2.parse(input);
  }
  if (typeof validateSearch2 === "function") {
    return validateSearch2(input);
  }
  return {};
}
function getMatchedRoutes({ pathname, routesById, processedTree }) {
  const routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  let foundRoute = void 0;
  let parsedParams = {};
  const match = findRouteMatch(trimmedPath, processedTree, true);
  if (match) {
    foundRoute = match.route;
    Object.assign(routeParams, match.rawParams);
    parsedParams = Object.assign({}, match.parsedParams);
  }
  const matchedRoutes = (match == null ? void 0 : match.branch) || [routesById[rootRouteId]];
  return { matchedRoutes, routeParams, foundRoute, parsedParams };
}
function buildMatchSnapshot({ matchResult, pathname, searchStr, notFoundRoute, notFoundMode }) {
  const snapshot = {
    routeIds: matchResult.matchedRoutes.map((r) => r.id),
    params: matchResult.routeParams,
    parsedParams: matchResult.parsedParams,
    searchStr,
  };
  const isGlobalNotFound = matchResult.foundRoute
    ? matchResult.foundRoute.path !== "/" && matchResult.routeParams["**"]
    : trimPathRight(pathname);
  if (isGlobalNotFound) {
    if (notFoundRoute) {
      snapshot.globalNotFoundRouteId = notFoundRoute.id;
    } else {
      if (notFoundMode !== "root") {
        for (let i = matchResult.matchedRoutes.length - 1; i >= 0; i--) {
          const route = matchResult.matchedRoutes[i];
          if (route.children) {
            snapshot.globalNotFoundRouteId = route.id;
            break;
          }
        }
      }
      if (!snapshot.globalNotFoundRouteId) {
        snapshot.globalNotFoundRouteId = rootRouteId;
      }
    }
  }
  return snapshot;
}
function buildMatchSnapshotFromRoutes({ routes, params, searchStr, globalNotFoundRouteId }) {
  const stringParams = {};
  for (const key in params) {
    const value = params[key];
    if (value != null) {
      stringParams[key] = String(value);
    }
  }
  const snapshot = {
    routeIds: routes.map((r) => r.id),
    params: stringParams,
    parsedParams: params,
    searchStr,
  };
  if (globalNotFoundRouteId) {
    snapshot.globalNotFoundRouteId = globalNotFoundRouteId;
  }
  return snapshot;
}
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
  const allMiddlewares =
    destRoutes.reduce((acc, route) => {
      var _a2;
      const middlewares = [];
      if ("search" in route.options) {
        if ((_a2 = route.options.search) == null ? void 0 : _a2.middlewares) {
          middlewares.push(...route.options.search.middlewares);
        }
      } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
        const legacyMiddleware = ({ search: search2, next }) => {
          let nextSearch = search2;
          if ("preSearchFilters" in route.options && route.options.preSearchFilters) {
            nextSearch = route.options.preSearchFilters.reduce(
              (prev, next2) => next2(prev),
              search2,
            );
          }
          const result = next(nextSearch);
          if ("postSearchFilters" in route.options && route.options.postSearchFilters) {
            return route.options.postSearchFilters.reduce((prev, next2) => next2(prev), result);
          }
          return result;
        };
        middlewares.push(legacyMiddleware);
      }
      if (_includeValidateSearch && route.options.validateSearch) {
        const validate = ({ search: search2, next }) => {
          const result = next(search2);
          try {
            const validatedSearch = {
              ...result,
              ...(validateSearch(route.options.validateSearch, result) ?? void 0),
            };
            return validatedSearch;
          } catch {
            return result;
          }
        };
        middlewares.push(validate);
      }
      return acc.concat(middlewares);
    }, []) ?? [];
  const final = ({ search: search2 }) => {
    if (!dest.search) {
      return {};
    }
    if (dest.search === true) {
      return search2;
    }
    return functionalUpdate(dest.search, search2);
  };
  allMiddlewares.push(final);
  const applyNext = (index, currentSearch) => {
    if (index >= allMiddlewares.length) {
      return currentSearch;
    }
    const middleware = allMiddlewares[index];
    const next = (newSearch) => {
      return applyNext(index + 1, newSearch);
    };
    return middleware({ search: currentSearch, next });
  };
  return applyNext(0, search);
}
var L = ((i) => (
  (i[(i.AggregateError = 1)] = "AggregateError"),
  (i[(i.ArrowFunction = 2)] = "ArrowFunction"),
  (i[(i.ErrorPrototypeStack = 4)] = "ErrorPrototypeStack"),
  (i[(i.ObjectAssign = 8)] = "ObjectAssign"),
  (i[(i.BigIntTypedArray = 16)] = "BigIntTypedArray"),
  (i[(i.RegExp = 32)] = "RegExp"),
  i
))(L || {});
var N = Symbol.asyncIterator,
  fr = Symbol.hasInstance,
  I = Symbol.isConcatSpreadable,
  b = Symbol.iterator,
  Sr = Symbol.match,
  mr = Symbol.matchAll,
  pr = Symbol.replace,
  dr = Symbol.search,
  gr = Symbol.species,
  yr = Symbol.split,
  Nr = Symbol.toPrimitive,
  P$1 = Symbol.toStringTag,
  br = Symbol.unscopables;
var qr = {
    0: "Symbol.asyncIterator",
    1: "Symbol.hasInstance",
    2: "Symbol.isConcatSpreadable",
    3: "Symbol.iterator",
    4: "Symbol.match",
    5: "Symbol.matchAll",
    6: "Symbol.replace",
    7: "Symbol.search",
    8: "Symbol.species",
    9: "Symbol.split",
    10: "Symbol.toPrimitive",
    11: "Symbol.toStringTag",
    12: "Symbol.unscopables",
  },
  Ce = {
    [N]: 0,
    [fr]: 1,
    [I]: 2,
    [b]: 3,
    [Sr]: 4,
    [mr]: 5,
    [pr]: 6,
    [dr]: 7,
    [gr]: 8,
    [yr]: 9,
    [Nr]: 10,
    [P$1]: 11,
    [br]: 12,
  },
  Xr = {
    0: N,
    1: fr,
    2: I,
    3: b,
    4: Sr,
    5: mr,
    6: pr,
    7: dr,
    8: gr,
    9: yr,
    10: Nr,
    11: P$1,
    12: br,
  },
  Qr = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" },
  o = void 0,
  et = {
    2: true,
    3: false,
    1: o,
    0: null,
    4: -0,
    5: Number.POSITIVE_INFINITY,
    6: Number.NEGATIVE_INFINITY,
    7: Number.NaN,
  };
var ve = {
    0: "Error",
    1: "EvalError",
    2: "RangeError",
    3: "ReferenceError",
    4: "SyntaxError",
    5: "TypeError",
    6: "URIError",
  },
  rt = {
    0: Error,
    1: EvalError,
    2: RangeError,
    3: ReferenceError,
    4: SyntaxError,
    5: TypeError,
    6: URIError,
  };
function c(e, r, t, n, a, s, i, u2, l, g, S, d) {
  return { t: e, i: r, s: t, c: n, m: a, p: s, e: i, a: u2, f: l, b: g, o: S, l: d };
}
function D(e) {
  return c(2, o, e, o, o, o, o, o, o, o, o, o);
}
var Z = D(2),
  $ = D(3),
  Ae = D(1),
  Re = D(0),
  tt = D(4),
  nt = D(5),
  ot = D(6),
  at = D(7);
function sn(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return o;
  }
}
function y(e) {
  let r = "",
    t = 0,
    n;
  for (let a = 0, s = e.length; a < s; a++)
    ((n = sn(e[a])), n && ((r += e.slice(t, a) + n), (t = a + 1)));
  return (t === 0 ? (r = e) : (r += e.slice(t)), r);
}
function un(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function F(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, un);
}
var U = "__SEROVAL_REFS__",
  ce = "$R",
  Ee = `self.${ce}`;
function ln(e) {
  return e == null ? `${Ee}=${Ee}||[]` : `(${Ee}=${Ee}||{})["${y(e)}"]=[]`;
}
var Cr = /* @__PURE__ */ new Map(),
  j = /* @__PURE__ */ new Map();
function vr(e) {
  return Cr.has(e);
}
function fn(e) {
  return j.has(e);
}
function st(e) {
  if (vr(e)) return Cr.get(e);
  throw new Ie(e);
}
function it(e) {
  if (fn(e)) return j.get(e);
  throw new Pe(e);
}
typeof globalThis != "undefined"
  ? Object.defineProperty(globalThis, U, {
      value: j,
      configurable: true,
      writable: false,
      enumerable: false,
    })
  : typeof window != "undefined"
    ? Object.defineProperty(window, U, {
        value: j,
        configurable: true,
        writable: false,
        enumerable: false,
      })
    : typeof self != "undefined"
      ? Object.defineProperty(self, U, {
          value: j,
          configurable: true,
          writable: false,
          enumerable: false,
        })
      : typeof global != "undefined" &&
        Object.defineProperty(global, U, {
          value: j,
          configurable: true,
          writable: false,
          enumerable: false,
        });
function xe(e) {
  return e instanceof EvalError
    ? 1
    : e instanceof RangeError
      ? 2
      : e instanceof ReferenceError
        ? 3
        : e instanceof SyntaxError
          ? 4
          : e instanceof TypeError
            ? 5
            : e instanceof URIError
              ? 6
              : 0;
}
function Sn(e) {
  let r = ve[xe(e)];
  return e.name !== r
    ? { name: e.name }
    : e.constructor.name !== r
      ? { name: e.constructor.name }
      : {};
}
function q(e, r) {
  let t = Sn(e),
    n = Object.getOwnPropertyNames(e);
  for (let a = 0, s = n.length, i; a < s; a++)
    ((i = n[a]),
      i !== "name" &&
        i !== "message" &&
        (i === "stack" ? r & 4 && ((t = t || {}), (t[i] = e[i])) : ((t = t || {}), (t[i] = e[i]))));
  return t;
}
function Te(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function Oe(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return nt;
    case Number.NEGATIVE_INFINITY:
      return ot;
  }
  return e !== e ? at : Object.is(e, -0) ? tt : c(0, o, e, o, o, o, o, o, o, o, o, o);
}
function X(e) {
  return c(1, o, y(e), o, o, o, o, o, o, o, o, o);
}
function we(e) {
  return c(3, o, "" + e, o, o, o, o, o, o, o, o, o);
}
function lt(e) {
  return c(4, e, o, o, o, o, o, o, o, o, o, o);
}
function he(e, r) {
  let t = r.valueOf();
  return c(5, e, t !== t ? "" : r.toISOString(), o, o, o, o, o, o, o, o, o);
}
function ze(e, r) {
  return c(6, e, o, y(r.source), r.flags, o, o, o, o, o, o, o);
}
function ct(e, r) {
  return c(17, e, Ce[r], o, o, o, o, o, o, o, o, o);
}
function ft(e, r) {
  return c(18, e, y(st(r)), o, o, o, o, o, o, o, o, o);
}
function fe(e, r, t) {
  return c(25, e, t, y(r), o, o, o, o, o, o, o, o);
}
function _e(e, r, t) {
  return c(9, e, o, o, o, o, o, t, o, o, Te(r), o);
}
function ke(e, r) {
  return c(21, e, o, o, o, o, o, o, r, o, o, o);
}
function De(e, r, t) {
  return c(15, e, o, r.constructor.name, o, o, o, o, t, r.byteOffset, o, r.length);
}
function Fe(e, r, t) {
  return c(16, e, o, r.constructor.name, o, o, o, o, t, r.byteOffset, o, r.byteLength);
}
function Be(e, r, t) {
  return c(20, e, o, o, o, o, o, o, t, r.byteOffset, o, r.byteLength);
}
function Me(e, r, t) {
  return c(13, e, xe(r), o, y(r.message), t, o, o, o, o, o, o);
}
function Ve(e, r, t) {
  return c(14, e, xe(r), o, y(r.message), t, o, o, o, o, o, o);
}
function Le(e, r) {
  return c(7, e, o, o, o, o, o, r, o, o, o, o);
}
function Ue(e, r) {
  return c(28, o, o, o, o, o, o, [e, r], o, o, o, o);
}
function je(e, r) {
  return c(30, o, o, o, o, o, o, [e, r], o, o, o, o);
}
function Ye(e, r, t) {
  return c(31, e, o, o, o, o, o, t, r, o, o, o);
}
function We(e, r) {
  return c(32, e, o, o, o, o, o, o, r, o, o, o);
}
function Ge(e, r) {
  return c(33, e, o, o, o, o, o, o, r, o, o, o);
}
function Ke(e, r) {
  return c(34, e, o, o, o, o, o, o, r, o, o, o);
}
var mn = { parsing: 1, serialization: 2, deserialization: 3 };
function pn(e) {
  return `Seroval Error (step: ${mn[e]})`;
}
var dn = (e, r) => pn(e),
  Se = class extends Error {
    constructor(t, n) {
      super(dn(t));
      this.cause = n;
    }
  },
  z = class extends Se {
    constructor(r) {
      super("parsing", r);
    }
  },
  He = class extends Se {
    constructor(r) {
      super("deserialization", r);
    }
  };
function _(e) {
  return `Seroval Error (specific: ${e})`;
}
var x = class extends Error {
    constructor(t) {
      super(_(1));
      this.value = t;
    }
  },
  O = class extends Error {
    constructor(r) {
      super(_(2));
    }
  },
  Q = class extends Error {
    constructor(r) {
      super(_(3));
    }
  },
  B = class extends Error {
    constructor(r) {
      super(_(4));
    }
  },
  Ie = class extends Error {
    constructor(t) {
      super(_(5));
      this.value = t;
    }
  },
  Pe = class extends Error {
    constructor(r) {
      super(_(6));
    }
  },
  Je = class extends Error {
    constructor(r) {
      super(_(7));
    }
  },
  w$1 = class w extends Error {
    constructor(r) {
      super(_(8));
    }
  },
  ee$1 = class ee extends Error {
    constructor(r) {
      super(_(9));
    }
  };
var Y = class {
  constructor(r, t) {
    this.value = r;
    this.replacement = t;
  }
};
var re$1 = () => {
    let e = { p: 0, s: 0, f: 0 };
    return (
      (e.p = new Promise((r, t) => {
        ((e.s = r), (e.f = t));
      })),
      e
    );
  },
  gn = (e, r) => {
    (e.s(r), (e.p.s = 1), (e.p.v = r));
  },
  yn = (e, r) => {
    (e.f(r), (e.p.s = 2), (e.p.v = r));
  },
  mt = re$1.toString(),
  pt = gn.toString(),
  dt = yn.toString(),
  Rr = () => {
    let e = [],
      r = [],
      t = true,
      n = false,
      a = 0,
      s = (l, g, S) => {
        for (S = 0; S < a; S++) r[S] && r[S][g](l);
      },
      i = (l, g, S, d) => {
        for (g = 0, S = e.length; g < S; g++)
          ((d = e[g]), !t && g === S - 1 ? l[n ? "return" : "throw"](d) : l.next(d));
      },
      u2 = (l, g) => (
        t && ((g = a++), (r[g] = l)),
        i(l),
        () => {
          t && ((r[g] = r[a]), (r[a--] = void 0));
        }
      );
    return {
      __SEROVAL_STREAM__: true,
      on: (l) => u2(l),
      next: (l) => {
        t && (e.push(l), s(l, "next"));
      },
      throw: (l) => {
        t && (e.push(l), s(l, "throw"), (t = false), (n = false), (r.length = 0));
      },
      return: (l) => {
        t && (e.push(l), s(l, "return"), (t = false), (n = true), (r.length = 0));
      },
    };
  },
  gt = Rr.toString(),
  Er = (e) => (r) => () => {
    let t = 0,
      n = {
        [e]: () => n,
        next: () => {
          if (t > r.d) return { done: true, value: void 0 };
          let a = t++,
            s = r.v[a];
          if (a === r.t) throw s;
          return { done: a === r.d, value: s };
        },
      };
    return n;
  },
  yt = Er.toString(),
  Ir = (e, r) => (t) => () => {
    let n = 0,
      a = -1,
      s = false,
      i = [],
      u2 = [],
      l = (S = 0, d = u2.length) => {
        for (; S < d; S++) u2[S].s({ done: true, value: void 0 });
      };
    t.on({
      next: (S) => {
        let d = u2.shift();
        (d && d.s({ done: false, value: S }), i.push(S));
      },
      throw: (S) => {
        let d = u2.shift();
        (d && d.f(S), l(), (a = i.length), (s = true), i.push(S));
      },
      return: (S) => {
        let d = u2.shift();
        (d && d.s({ done: true, value: S }), l(), (a = i.length), i.push(S));
      },
    });
    let g = {
      [e]: () => g,
      next: () => {
        if (a === -1) {
          let H = n++;
          if (H >= i.length) {
            let $r = r();
            return (u2.push($r), $r.p);
          }
          return { done: false, value: i[H] };
        }
        if (n > a) return { done: true, value: void 0 };
        let S = n++,
          d = i[S];
        if (S !== a) return { done: false, value: d };
        if (s) throw d;
        return { done: true, value: d };
      },
    };
    return g;
  },
  Nt = Ir.toString(),
  Pr = (e) => {
    let r = atob(e),
      t = r.length,
      n = new Uint8Array(t);
    for (let a = 0; a < t; a++) n[a] = r.charCodeAt(a);
    return n.buffer;
  },
  bt = Pr.toString();
var Ct = {},
  vt = {};
var At = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
  Rt = { 0: "[]", 1: mt, 2: pt, 3: dt, 4: gt, 5: bt };
function M(e) {
  return "__SEROVAL_STREAM__" in e;
}
function te() {
  return Rr();
}
function Ze(e) {
  let r = te(),
    t = e[N]();
  async function n() {
    try {
      let a = await t.next();
      a.done ? r.return(a.value) : (r.next(a.value), await n());
    } catch (a) {
      r.throw(a);
    }
  }
  return (n().catch(() => {}), r);
}
var Nn = Ir(N, re$1);
function Et(e) {
  return Nn(e);
}
function $e(e) {
  let r = [],
    t = -1,
    n = -1,
    a = e[b]();
  for (;;)
    try {
      let s = a.next();
      if ((r.push(s.value), s.done)) {
        n = r.length - 1;
        break;
      }
    } catch (s) {
      ((t = r.length), r.push(s));
    }
  return { v: r, t, d: n };
}
var bn = Er(b);
function It(e) {
  return bn(e);
}
async function xr(e) {
  try {
    return [1, await e];
  } catch (r) {
    return [0, r];
  }
}
function pe(e, r) {
  return {
    plugins: r.plugins,
    mode: e,
    marked: /* @__PURE__ */ new Set(),
    features: 63 ^ (r.disabledFeatures || 0),
    refs: r.refs || /* @__PURE__ */ new Map(),
    depthLimit: r.depthLimit || 1e3,
  };
}
function de(e, r) {
  e.marked.add(r);
}
function Tr(e, r) {
  let t = e.refs.size;
  return (e.refs.set(r, t), t);
}
function qe(e, r) {
  let t = e.refs.get(r);
  return t != null ? (de(e, t), { type: 1, value: lt(t) }) : { type: 0, value: Tr(e, r) };
}
function W(e, r) {
  let t = qe(e, r);
  return t.type === 1 ? t : vr(r) ? { type: 2, value: ft(t.value, r) } : t;
}
function E(e, r) {
  let t = W(e, r);
  if (t.type !== 0) return t.value;
  if (r in Ce) return ct(t.value, r);
  throw new x(r);
}
function k(e, r) {
  let t = qe(e, At[r]);
  return t.type === 1 ? t.value : c(26, t.value, r, o, o, o, o, o, o, o, o, o);
}
function Xe(e) {
  let r = qe(e, Ct);
  return r.type === 1 ? r.value : c(27, r.value, o, o, o, o, o, o, E(e, b), o, o, o);
}
function Qe(e) {
  let r = qe(e, vt);
  return r.type === 1 ? r.value : c(29, r.value, o, o, o, o, o, [k(e, 1), E(e, N)], o, o, o, o);
}
function er(e, r, t, n) {
  return c(t ? 11 : 10, e, o, o, o, n, o, o, o, o, Te(r), o);
}
function rr(e, r, t, n) {
  return c(8, r, o, o, o, o, { k: t, v: n }, o, k(e, 0), o, o, o);
}
function xt(e, r, t) {
  return c(22, r, t, o, o, o, o, o, k(e, 1), o, o, o);
}
function tr(e, r, t) {
  let n = new Uint8Array(t),
    a = "";
  for (let s = 0, i = n.length; s < i; s++) a += String.fromCharCode(n[s]);
  return c(19, r, y(btoa(a)), o, o, o, o, o, k(e, 5), o, o, o);
}
function ne(e, r) {
  return { base: pe(e, r), child: void 0 };
}
var wr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return C(this._p, this.depth, r);
  }
};
async function vn(e, r, t) {
  let n = [];
  for (let a = 0, s = t.length; a < s; a++) a in t ? (n[a] = await C(e, r, t[a])) : (n[a] = 0);
  return n;
}
async function An(e, r, t, n) {
  return _e(t, n, await vn(e, r, n));
}
async function hr(e, r, t) {
  let n = Object.entries(t),
    a = [],
    s = [];
  for (let i = 0, u2 = n.length; i < u2; i++) (a.push(y(n[i][0])), s.push(await C(e, r, n[i][1])));
  return (
    b in t && (a.push(E(e.base, b)), s.push(Ue(Xe(e.base), await C(e, r, $e(t))))),
    N in t && (a.push(E(e.base, N)), s.push(je(Qe(e.base), await C(e, r, Ze(t))))),
    P$1 in t && (a.push(E(e.base, P$1)), s.push(X(t[P$1]))),
    I in t && (a.push(E(e.base, I)), s.push(t[I] ? Z : $)),
    { k: a, v: s }
  );
}
async function Or(e, r, t, n, a) {
  return er(t, n, a, await hr(e, r, n));
}
async function Rn(e, r, t, n) {
  return ke(t, await C(e, r, n.valueOf()));
}
async function En(e, r, t, n) {
  return De(t, n, await C(e, r, n.buffer));
}
async function In(e, r, t, n) {
  return Fe(t, n, await C(e, r, n.buffer));
}
async function Pn(e, r, t, n) {
  return Be(t, n, await C(e, r, n.buffer));
}
async function Tt(e, r, t, n) {
  let a = q(n, e.base.features);
  return Me(t, n, a ? await hr(e, r, a) : o);
}
async function xn(e, r, t, n) {
  let a = q(n, e.base.features);
  return Ve(t, n, a ? await hr(e, r, a) : o);
}
async function Tn(e, r, t, n) {
  let a = [],
    s = [];
  for (let [i, u2] of n.entries()) (a.push(await C(e, r, i)), s.push(await C(e, r, u2)));
  return rr(e.base, t, a, s);
}
async function On(e, r, t, n) {
  let a = [];
  for (let s of n.keys()) a.push(await C(e, r, s));
  return Le(t, a);
}
async function Ot(e, r, t, n) {
  let a = e.base.plugins;
  if (a)
    for (let s = 0, i = a.length; s < i; s++) {
      let u2 = a[s];
      if (u2.parse.async && u2.test(n))
        return fe(t, u2.tag, await u2.parse.async(n, new wr(e, r), { id: t }));
    }
  return o;
}
async function wn(e, r, t, n) {
  let [a, s] = await xr(n);
  return c(12, t, a, o, o, o, o, o, await C(e, r, s), o, o, o);
}
function hn(e, r, t, n, a) {
  let s = [],
    i = t.on({
      next: (u2) => {
        (de(this.base, r),
          C(this, e, u2).then(
            (l) => {
              s.push(We(r, l));
            },
            (l) => {
              (a(l), i());
            },
          ));
      },
      throw: (u2) => {
        (de(this.base, r),
          C(this, e, u2).then(
            (l) => {
              (s.push(Ge(r, l)), n(s), i());
            },
            (l) => {
              (a(l), i());
            },
          ));
      },
      return: (u2) => {
        (de(this.base, r),
          C(this, e, u2).then(
            (l) => {
              (s.push(Ke(r, l)), n(s), i());
            },
            (l) => {
              (a(l), i());
            },
          ));
      },
    });
}
async function zn(e, r, t, n) {
  return Ye(t, k(e.base, 4), await new Promise(hn.bind(e, r, t, n)));
}
async function _n(e, r, t, n) {
  if (Array.isArray(n)) return An(e, r, t, n);
  if (M(n)) return zn(e, r, t, n);
  let a = n.constructor;
  if (a === Y) return C(e, r, n.replacement);
  let s = await Ot(e, r, t, n);
  if (s) return s;
  switch (a) {
    case Object:
      return Or(e, r, t, n, false);
    case o:
      return Or(e, r, t, n, true);
    case Date:
      return he(t, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return Tt(e, r, t, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return Rn(e, r, t, n);
    case ArrayBuffer:
      return tr(e.base, t, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return En(e, r, t, n);
    case DataView:
      return Pn(e, r, t, n);
    case Map:
      return Tn(e, r, t, n);
    case Set:
      return On(e, r, t, n);
  }
  if (a === Promise || n instanceof Promise) return wn(e, r, t, n);
  let i = e.base.features;
  if (i & 32 && a === RegExp) return ze(t, n);
  if (i & 16)
    switch (a) {
      case BigInt64Array:
      case BigUint64Array:
        return In(e, r, t, n);
    }
  if (
    i & 1 &&
    typeof AggregateError != "undefined" &&
    (a === AggregateError || n instanceof AggregateError)
  )
    return xn(e, r, t, n);
  if (n instanceof Error) return Tt(e, r, t, n);
  if (b in n || N in n) return Or(e, r, t, n, !!a);
  throw new x(n);
}
async function kn(e, r, t) {
  let n = W(e.base, t);
  if (n.type !== 0) return n.value;
  let a = await Ot(e, r, n.value, t);
  if (a) return a;
  throw new x(t);
}
async function C(e, r, t) {
  switch (typeof t) {
    case "boolean":
      return t ? Z : $;
    case "undefined":
      return Ae;
    case "string":
      return X(t);
    case "number":
      return Oe(t);
    case "bigint":
      return we(t);
    case "object": {
      if (t) {
        let n = W(e.base, t);
        return n.type === 0 ? await _n(e, r + 1, n.value, t) : n.value;
      }
      return Re;
    }
    case "symbol":
      return E(e.base, t);
    case "function":
      return kn(e, r, t);
    default:
      throw new x(t);
  }
}
async function oe(e, r) {
  try {
    return await C(e, 0, r);
  } catch (t) {
    throw t instanceof z ? t : new z(t);
  }
}
var ae = ((t) => ((t[(t.Vanilla = 1)] = "Vanilla"), (t[(t.Cross = 2)] = "Cross"), t))(ae || {});
function Js(e) {
  return e;
}
function wt(e, r) {
  for (let t = 0, n = r.length; t < n; t++) {
    let a = r[t];
    e.has(a) || (e.add(a), a.extends && wt(e, a.extends));
  }
}
function A(e) {
  if (e) {
    let r = /* @__PURE__ */ new Set();
    return (wt(r, e), [...r]);
  }
}
function ht(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new Je(e);
  }
}
var Dn = 1e6,
  Fn = 1e4,
  Bn = 2e4;
function _t(e, r) {
  switch (r) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var Mn = 1e3;
function kt(e, r) {
  var t;
  return {
    mode: e,
    plugins: r.plugins,
    refs: r.refs || /* @__PURE__ */ new Map(),
    features: (t = r.features) != null ? t : 63 ^ (r.disabledFeatures || 0),
    depthLimit: r.depthLimit || Mn,
  };
}
function Dt(e) {
  return { mode: 1, base: kt(1, e), child: o, state: { marked: new Set(e.markedRefs) } };
}
var zr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  deserialize(r) {
    return p$1(this._p, this.depth, r);
  }
};
function Bt(e, r) {
  if (r < 0 || !Number.isFinite(r) || !Number.isInteger(r)) throw new w$1({ t: 4, i: r });
  if (e.refs.has(r)) throw new Error("Conflicted ref id: " + r);
}
function Vn(e, r, t) {
  return (Bt(e.base, r), e.state.marked.has(r) && e.base.refs.set(r, t), t);
}
function Ln(e, r, t) {
  return (Bt(e.base, r), e.base.refs.set(r, t), t);
}
function v(e, r, t) {
  return e.mode === 1 ? Vn(e, r, t) : Ln(e, r, t);
}
function _r(e, r, t) {
  if (Object.hasOwn(r, t)) return r[t];
  throw new w$1(e);
}
function Un(e, r) {
  return v(e, r.i, it(F(r.s)));
}
function jn(e, r, t) {
  let n = t.a,
    a = n.length,
    s = v(e, t.i, new Array(a));
  for (let i = 0, u2; i < a; i++) ((u2 = n[i]), u2 && (s[i] = p$1(e, r, u2)));
  return (_t(s, t.o), s);
}
function Yn(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function Wn(e) {
  switch (e) {
    case N:
    case I:
    case P$1:
    case b:
      return true;
    default:
      return false;
  }
}
function zt(e, r, t) {
  Yn(r)
    ? (e[r] = t)
    : Object.defineProperty(e, r, {
        value: t,
        configurable: true,
        enumerable: true,
        writable: true,
      });
}
function Gn(e, r, t, n, a) {
  if (typeof n == "string") zt(t, n, p$1(e, r, a));
  else {
    let s = p$1(e, r, n);
    switch (typeof s) {
      case "string":
        zt(t, s, p$1(e, r, a));
        break;
      case "symbol":
        Wn(s) && (t[s] = p$1(e, r, a));
        break;
      default:
        throw new w$1(n);
    }
  }
}
function Mt(e, r, t, n) {
  let a = t.k;
  if (a.length > 0) for (let i = 0, u2 = t.v, l = a.length; i < l; i++) Gn(e, r, n, a[i], u2[i]);
  return n;
}
function Kn(e, r, t) {
  let n = v(e, t.i, t.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return (Mt(e, r, t.p, n), _t(n, t.o), n);
}
function Hn(e, r) {
  return v(e, r.i, new Date(r.s));
}
function Jn(e, r) {
  if (e.base.features & 32) {
    let t = F(r.c);
    if (t.length > Bn) throw new w$1(r);
    return v(e, r.i, new RegExp(t, r.m));
  }
  throw new O(r);
}
function Zn(e, r, t) {
  let n = v(e, t.i, /* @__PURE__ */ new Set());
  for (let a = 0, s = t.a, i = s.length; a < i; a++) n.add(p$1(e, r, s[a]));
  return n;
}
function $n(e, r, t) {
  let n = v(e, t.i, /* @__PURE__ */ new Map());
  for (let a = 0, s = t.e.k, i = t.e.v, u2 = s.length; a < u2; a++)
    n.set(p$1(e, r, s[a]), p$1(e, r, i[a]));
  return n;
}
function qn(e, r) {
  if (r.s.length > Dn) throw new w$1(r);
  return v(e, r.i, Pr(F(r.s)));
}
function Xn(e, r, t) {
  var u2;
  let n = ht(t.c),
    a = p$1(e, r, t.f),
    s = (u2 = t.b) != null ? u2 : 0;
  if (s < 0 || s > a.byteLength) throw new w$1(t);
  return v(e, t.i, new n(a, s, t.l));
}
function Qn(e, r, t) {
  var i;
  let n = p$1(e, r, t.f),
    a = (i = t.b) != null ? i : 0;
  if (a < 0 || a > n.byteLength) throw new w$1(t);
  return v(e, t.i, new DataView(n, a, t.l));
}
function Vt(e, r, t, n) {
  if (t.p) {
    let a = Mt(e, r, t.p, {});
    Object.defineProperties(n, Object.getOwnPropertyDescriptors(a));
  }
  return n;
}
function eo(e, r, t) {
  let n = v(e, t.i, new AggregateError([], F(t.m)));
  return Vt(e, r, t, n);
}
function ro(e, r, t) {
  let n = _r(t, rt, t.s),
    a = v(e, t.i, new n(F(t.m)));
  return Vt(e, r, t, a);
}
function to(e, r, t) {
  let n = re$1(),
    a = v(e, t.i, n.p),
    s = p$1(e, r, t.f);
  return (t.s ? n.s(s) : n.f(s), a);
}
function no(e, r, t) {
  return v(e, t.i, Object(p$1(e, r, t.f)));
}
function oo(e, r, t) {
  let n = e.base.plugins;
  if (n) {
    let a = F(t.c);
    for (let s = 0, i = n.length; s < i; s++) {
      let u2 = n[s];
      if (u2.tag === a) return v(e, t.i, u2.deserialize(t.s, new zr(e, r), { id: t.i }));
    }
  }
  throw new Q(t.c);
}
function ao(e, r) {
  return v(e, r.i, v(e, r.s, re$1()).p);
}
function so(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n) return (n.s(p$1(e, r, t.a[1])), o);
  throw new B("Promise");
}
function io(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n) return (n.f(p$1(e, r, t.a[1])), o);
  throw new B("Promise");
}
function uo(e, r, t) {
  p$1(e, r, t.a[0]);
  let n = p$1(e, r, t.a[1]);
  return It(n);
}
function lo(e, r, t) {
  p$1(e, r, t.a[0]);
  let n = p$1(e, r, t.a[1]);
  return Et(n);
}
function co(e, r, t) {
  let n = v(e, t.i, te()),
    a = t.a,
    s = a.length;
  if (s) for (let i = 0; i < s; i++) p$1(e, r, a[i]);
  return n;
}
function fo(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n && M(n)) return (n.next(p$1(e, r, t.f)), o);
  throw new B("Stream");
}
function So(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n && M(n)) return (n.throw(p$1(e, r, t.f)), o);
  throw new B("Stream");
}
function mo(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n && M(n)) return (n.return(p$1(e, r, t.f)), o);
  throw new B("Stream");
}
function po(e, r, t) {
  return (p$1(e, r, t.f), o);
}
function go(e, r, t) {
  return (p$1(e, r, t.a[1]), o);
}
function p$1(e, r, t) {
  if (r > e.base.depthLimit) throw new ee$1(e.base.depthLimit);
  switch (((r += 1), t.t)) {
    case 2:
      return _r(t, et, t.s);
    case 0:
      return Number(t.s);
    case 1:
      return F(String(t.s));
    case 3:
      if (String(t.s).length > Fn) throw new w$1(t);
      return BigInt(t.s);
    case 4:
      return e.base.refs.get(t.i);
    case 18:
      return Un(e, t);
    case 9:
      return jn(e, r, t);
    case 10:
    case 11:
      return Kn(e, r, t);
    case 5:
      return Hn(e, t);
    case 6:
      return Jn(e, t);
    case 7:
      return Zn(e, r, t);
    case 8:
      return $n(e, r, t);
    case 19:
      return qn(e, t);
    case 16:
    case 15:
      return Xn(e, r, t);
    case 20:
      return Qn(e, r, t);
    case 14:
      return eo(e, r, t);
    case 13:
      return ro(e, r, t);
    case 12:
      return to(e, r, t);
    case 17:
      return _r(t, Xr, t.s);
    case 21:
      return no(e, r, t);
    case 25:
      return oo(e, r, t);
    case 22:
      return ao(e, t);
    case 23:
      return so(e, r, t);
    case 24:
      return io(e, r, t);
    case 28:
      return uo(e, r, t);
    case 30:
      return lo(e, r, t);
    case 31:
      return co(e, r, t);
    case 32:
      return fo(e, r, t);
    case 33:
      return So(e, r, t);
    case 34:
      return mo(e, r, t);
    case 27:
      return po(e, r, t);
    case 29:
      return go(e, r, t);
    default:
      throw new O(t);
  }
}
function nr(e, r) {
  try {
    return p$1(e, 0, r);
  } catch (t) {
    throw new He(t);
  }
}
var yo = () => T,
  No = yo.toString(),
  Lt = /=>/.test(No);
function or(e, r) {
  return Lt
    ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") +
        "=>" +
        (r.startsWith("{") ? "(" + r + ")" : r)
    : "function(" + e.join(",") + "){return " + r + "}";
}
function Ut(e, r) {
  return Lt
    ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}"
    : "function(" + e.join(",") + "){" + r + "}";
}
var Wt = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_",
  jt = Wt.length,
  Gt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_",
  Yt = Gt.length;
function kr(e) {
  let r = e % jt,
    t = Wt[r];
  for (e = (e - r) / jt; e > 0; ) ((r = e % Yt), (t += Gt[r]), (e = (e - r) / Yt));
  return t;
}
var bo = /^[$A-Z_][0-9A-Z_$]*$/i;
function Dr(e) {
  let r = e[0];
  return (r === "$" || r === "_" || (r >= "A" && r <= "Z") || (r >= "a" && r <= "z")) && bo.test(e);
}
function ye(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function Co(e) {
  let r = [],
    t = e[0];
  for (let n = 1, a = e.length, s, i = t; n < a; n++)
    ((s = e[n]),
      s.t === 0 && s.v === i.v
        ? (t = { t: 0, s: s.s, k: o, v: ye(t) })
        : s.t === 2 && s.s === i.s
          ? (t = { t: 2, s: ye(t), k: s.k, v: s.v })
          : s.t === 1 && s.s === i.s
            ? (t = { t: 1, s: ye(t), k: o, v: s.v })
            : s.t === 3 && s.s === i.s
              ? (t = { t: 3, s: ye(t), k: s.k, v: o })
              : (r.push(t), (t = s)),
      (i = s));
  return (r.push(t), r);
}
function qt(e) {
  if (e.length) {
    let r = "",
      t = Co(e);
    for (let n = 0, a = t.length; n < a; n++) r += ye(t[n]) + ",";
    return r;
  }
  return o;
}
var vo = "Object.create(null)",
  Ao = "new Set",
  Ro = "new Map",
  Eo = "Promise.resolve",
  Io = "Promise.reject",
  Po = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: o };
function Xt(e, r) {
  return {
    mode: e,
    plugins: r.plugins,
    features: r.features,
    marked: new Set(r.markedRefs),
    stack: [],
    flags: [],
    assignments: [],
  };
}
function sr(e) {
  return { mode: 2, base: Xt(2, e), state: e, child: o };
}
var Fr = class {
  constructor(r) {
    this._p = r;
  }
  serialize(r) {
    return f(this._p, r);
  }
};
function To(e, r) {
  let t = e.valid.get(r);
  t == null && ((t = e.valid.size), e.valid.set(r, t));
  let n = e.vars[t];
  return (n == null && ((n = kr(t)), (e.vars[t] = n)), n);
}
function Oo(e) {
  return ce + "[" + e + "]";
}
function m(e, r) {
  return e.mode === 1 ? To(e.state, r) : Oo(r);
}
function h(e, r) {
  e.marked.add(r);
}
function Br(e, r) {
  return e.marked.has(r);
}
function Vr(e, r, t) {
  r !== 0 && (h(e.base, t), e.base.flags.push({ type: r, value: m(e, t) }));
}
function wo(e) {
  let r = "";
  for (let t = 0, n = e.flags, a = n.length; t < a; t++) {
    let s = n[t];
    r += Po[s.type] + "(" + s.value + "),";
  }
  return r;
}
function Qt(e) {
  let r = qt(e.assignments),
    t = wo(e);
  return r ? (t ? r + t : r) : t;
}
function en(e, r, t) {
  e.assignments.push({ t: 0, s: r, k: o, v: t });
}
function ho(e, r, t) {
  e.base.assignments.push({ t: 1, s: m(e, r), k: o, v: t });
}
function ge(e, r, t, n) {
  e.base.assignments.push({ t: 2, s: m(e, r), k: t, v: n });
}
function Kt(e, r, t) {
  e.base.assignments.push({ t: 3, s: m(e, r), k: t, v: o });
}
function Ne(e, r, t, n) {
  en(e.base, m(e, r) + "[" + t + "]", n);
}
function Mr(e, r, t, n) {
  en(e.base, m(e, r) + "." + t, n);
}
function V(e, r) {
  return r.t === 4 && e.stack.includes(r.i);
}
function se(e, r, t) {
  return e.mode === 1 && !Br(e.base, r) ? t : m(e, r) + "=" + t;
}
function zo(e) {
  return U + '.get("' + e.s + '")';
}
function Ht(e, r, t, n) {
  return t ? (V(e.base, t) ? (h(e.base, r), Ne(e, r, n, m(e, t.i)), "") : f(e, t)) : "";
}
function _o(e, r) {
  let t = r.i,
    n = r.a,
    a = n.length;
  if (a > 0) {
    e.base.stack.push(t);
    let s = Ht(e, t, n[0], 0),
      i = s === "";
    for (let u2 = 1, l; u2 < a; u2++) ((l = Ht(e, t, n[u2], u2)), (s += "," + l), (i = l === ""));
    return (e.base.stack.pop(), Vr(e, r.o, r.i), "[" + s + (i ? ",]" : "]"));
  }
  return "[]";
}
function Jt(e, r, t, n) {
  if (typeof t == "string") {
    let a = Number(t),
      s = (a >= 0 && a.toString() === t) || Dr(t);
    if (V(e.base, n)) {
      let i = m(e, n.i);
      return (
        h(e.base, r.i), s && a !== a ? Mr(e, r.i, t, i) : Ne(e, r.i, s ? t : '"' + t + '"', i), ""
      );
    }
    return (s ? t : '"' + t + '"') + ":" + f(e, n);
  }
  return "[" + f(e, t) + "]:" + f(e, n);
}
function rn(e, r, t) {
  let n = t.k,
    a = n.length;
  if (a > 0) {
    let s = t.v;
    e.base.stack.push(r.i);
    let i = Jt(e, r, n[0], s[0]);
    for (let u2 = 1, l = i; u2 < a; u2++)
      ((l = Jt(e, r, n[u2], s[u2])), (i += (l && i && ",") + l));
    return (e.base.stack.pop(), "{" + i + "}");
  }
  return "{}";
}
function ko(e, r) {
  return (Vr(e, r.o, r.i), rn(e, r, r.p));
}
function Do(e, r, t, n) {
  let a = rn(e, r, t);
  return a !== "{}" ? "Object.assign(" + n + "," + a + ")" : n;
}
function Fo(e, r, t, n, a) {
  let s = e.base,
    i = f(e, a),
    u2 = Number(n),
    l = (u2 >= 0 && u2.toString() === n) || Dr(n);
  if (V(s, a)) l && u2 !== u2 ? Mr(e, r.i, n, i) : Ne(e, r.i, l ? n : '"' + n + '"', i);
  else {
    let g = s.assignments;
    ((s.assignments = t),
      l && u2 !== u2 ? Mr(e, r.i, n, i) : Ne(e, r.i, l ? n : '"' + n + '"', i),
      (s.assignments = g));
  }
}
function Bo(e, r, t, n, a) {
  if (typeof n == "string") Fo(e, r, t, n, a);
  else {
    let s = e.base,
      i = s.stack;
    s.stack = [];
    let u2 = f(e, a);
    s.stack = i;
    let l = s.assignments;
    ((s.assignments = t), Ne(e, r.i, f(e, n), u2), (s.assignments = l));
  }
}
function Mo(e, r, t) {
  let n = t.k,
    a = n.length;
  if (a > 0) {
    let s = [],
      i = t.v;
    e.base.stack.push(r.i);
    for (let u2 = 0; u2 < a; u2++) Bo(e, r, s, n[u2], i[u2]);
    return (e.base.stack.pop(), qt(s));
  }
  return o;
}
function Lr(e, r, t) {
  if (r.p) {
    let n = e.base;
    if (n.features & 8) t = Do(e, r, r.p, t);
    else {
      h(n, r.i);
      let a = Mo(e, r, r.p);
      if (a) return "(" + se(e, r.i, t) + "," + a + m(e, r.i) + ")";
    }
  }
  return t;
}
function Vo(e, r) {
  return (Vr(e, r.o, r.i), Lr(e, r, vo));
}
function Lo(e) {
  return 'new Date("' + e.s + '")';
}
function Uo(e, r) {
  if (e.base.features & 32) return "/" + r.c + "/" + r.m;
  throw new O(r);
}
function Zt(e, r, t) {
  let n = e.base;
  return V(n, t) ? (h(n, r), ho(e, r, m(e, t.i)), "") : f(e, t);
}
function jo(e, r) {
  let t = Ao,
    n = r.a,
    a = n.length,
    s = r.i;
  if (a > 0) {
    e.base.stack.push(s);
    let i = Zt(e, s, n[0]);
    for (let u2 = 1, l = i; u2 < a; u2++) ((l = Zt(e, s, n[u2])), (i += (l && i && ",") + l));
    (e.base.stack.pop(), i && (t += "([" + i + "])"));
  }
  return t;
}
function $t(e, r, t, n, a) {
  let s = e.base;
  if (V(s, t)) {
    let i = m(e, t.i);
    if ((h(s, r), V(s, n))) {
      let l = m(e, n.i);
      return (ge(e, r, i, l), "");
    }
    if (n.t !== 4 && n.i != null && Br(s, n.i)) {
      let l = "(" + f(e, n) + ",[" + a + "," + a + "])";
      return (ge(e, r, i, m(e, n.i)), Kt(e, r, a), l);
    }
    let u2 = s.stack;
    return ((s.stack = []), ge(e, r, i, f(e, n)), (s.stack = u2), "");
  }
  if (V(s, n)) {
    let i = m(e, n.i);
    if ((h(s, r), t.t !== 4 && t.i != null && Br(s, t.i))) {
      let l = "(" + f(e, t) + ",[" + a + "," + a + "])";
      return (ge(e, r, m(e, t.i), i), Kt(e, r, a), l);
    }
    let u2 = s.stack;
    return ((s.stack = []), ge(e, r, f(e, t), i), (s.stack = u2), "");
  }
  return "[" + f(e, t) + "," + f(e, n) + "]";
}
function Yo(e, r) {
  let t = Ro,
    n = r.e.k,
    a = n.length,
    s = r.i,
    i = r.f,
    u2 = m(e, i.i),
    l = e.base;
  if (a > 0) {
    let g = r.e.v;
    l.stack.push(s);
    let S = $t(e, s, n[0], g[0], u2);
    for (let d = 1, H = S; d < a; d++) ((H = $t(e, s, n[d], g[d], u2)), (S += (H && S && ",") + H));
    (l.stack.pop(), S && (t += "([" + S + "])"));
  }
  return (i.t === 26 && (h(l, i.i), (t = "(" + f(e, i) + "," + t + ")")), t);
}
function Wo(e, r) {
  return G(e, r.f) + '("' + r.s + '")';
}
function Go(e, r) {
  return "new " + r.c + "(" + f(e, r.f) + "," + r.b + "," + r.l + ")";
}
function Ko(e, r) {
  return "new DataView(" + f(e, r.f) + "," + r.b + "," + r.l + ")";
}
function Ho(e, r) {
  let t = r.i;
  e.base.stack.push(t);
  let n = Lr(e, r, 'new AggregateError([],"' + r.m + '")');
  return (e.base.stack.pop(), n);
}
function Jo(e, r) {
  return Lr(e, r, "new " + ve[r.s] + '("' + r.m + '")');
}
function Zo(e, r) {
  let t,
    n = r.f,
    a = r.i,
    s = r.s ? Eo : Io,
    i = e.base;
  if (V(i, n)) {
    let u2 = m(e, n.i);
    t = s + (r.s ? "().then(" + or([], u2) + ")" : "().catch(" + Ut([], "throw " + u2) + ")");
  } else {
    i.stack.push(a);
    let u2 = f(e, n);
    (i.stack.pop(), (t = s + "(" + u2 + ")"));
  }
  return t;
}
function $o(e, r) {
  return "Object(" + f(e, r.f) + ")";
}
function G(e, r) {
  let t = f(e, r);
  return r.t === 4 ? t : "(" + t + ")";
}
function qo(e, r) {
  if (e.mode === 1) throw new O(r);
  return "(" + se(e, r.s, G(e, r.f) + "()") + ").p";
}
function Xo(e, r) {
  if (e.mode === 1) throw new O(r);
  return G(e, r.a[0]) + "(" + m(e, r.i) + "," + f(e, r.a[1]) + ")";
}
function Qo(e, r) {
  if (e.mode === 1) throw new O(r);
  return G(e, r.a[0]) + "(" + m(e, r.i) + "," + f(e, r.a[1]) + ")";
}
function ea(e, r) {
  let t = e.base.plugins;
  if (t)
    for (let n = 0, a = t.length; n < a; n++) {
      let s = t[n];
      if (s.tag === r.c)
        return (e.child == null && (e.child = new Fr(e)), s.serialize(r.s, e.child, { id: r.i }));
    }
  throw new Q(r.c);
}
function ra(e, r) {
  let t = "",
    n = false;
  return (
    r.f.t !== 4 && (h(e.base, r.f.i), (t = "(" + f(e, r.f) + ","), (n = true)),
    (t += se(e, r.i, "(" + yt + ")(" + m(e, r.f.i) + ")")),
    n && (t += ")"),
    t
  );
}
function ta(e, r) {
  return G(e, r.a[0]) + "(" + f(e, r.a[1]) + ")";
}
function na(e, r) {
  let t = r.a[0],
    n = r.a[1],
    a = e.base,
    s = "";
  (t.t !== 4 && (h(a, t.i), (s += "(" + f(e, t))),
    n.t !== 4 && (h(a, n.i), (s += (s ? "," : "(") + f(e, n))),
    s && (s += ","));
  let i = se(e, r.i, "(" + Nt + ")(" + m(e, n.i) + "," + m(e, t.i) + ")");
  return s ? s + i + ")" : i;
}
function oa(e, r) {
  return G(e, r.a[0]) + "(" + f(e, r.a[1]) + ")";
}
function aa(e, r) {
  let t = se(e, r.i, G(e, r.f) + "()"),
    n = r.a.length;
  if (n) {
    let a = f(e, r.a[0]);
    for (let s = 1; s < n; s++) a += "," + f(e, r.a[s]);
    return "(" + t + "," + a + "," + m(e, r.i) + ")";
  }
  return t;
}
function sa(e, r) {
  return m(e, r.i) + ".next(" + f(e, r.f) + ")";
}
function ia(e, r) {
  return m(e, r.i) + ".throw(" + f(e, r.f) + ")";
}
function ua(e, r) {
  return m(e, r.i) + ".return(" + f(e, r.f) + ")";
}
function la(e, r) {
  switch (r.t) {
    case 17:
      return qr[r.s];
    case 18:
      return zo(r);
    case 9:
      return _o(e, r);
    case 10:
      return ko(e, r);
    case 11:
      return Vo(e, r);
    case 5:
      return Lo(r);
    case 6:
      return Uo(e, r);
    case 7:
      return jo(e, r);
    case 8:
      return Yo(e, r);
    case 19:
      return Wo(e, r);
    case 16:
    case 15:
      return Go(e, r);
    case 20:
      return Ko(e, r);
    case 14:
      return Ho(e, r);
    case 13:
      return Jo(e, r);
    case 12:
      return Zo(e, r);
    case 21:
      return $o(e, r);
    case 22:
      return qo(e, r);
    case 25:
      return ea(e, r);
    case 26:
      return Rt[r.s];
    default:
      throw new O(r);
  }
}
function f(e, r) {
  switch (r.t) {
    case 2:
      return Qr[r.s];
    case 0:
      return "" + r.s;
    case 1:
      return '"' + r.s + '"';
    case 3:
      return r.s + "n";
    case 4:
      return m(e, r.i);
    case 23:
      return Xo(e, r);
    case 24:
      return Qo(e, r);
    case 27:
      return ra(e, r);
    case 28:
      return ta(e, r);
    case 29:
      return na(e, r);
    case 30:
      return oa(e, r);
    case 31:
      return aa(e, r);
    case 32:
      return sa(e, r);
    case 33:
      return ia(e, r);
    case 34:
      return ua(e, r);
    default:
      return se(e, r.i, la(e, r));
  }
}
function ur(e, r) {
  let t = f(e, r),
    n = r.i;
  if (n == null) return t;
  let a = Qt(e.base),
    s = m(e, n),
    i = e.state.scopeId,
    u2 = i == null ? "" : ce,
    l = a ? "(" + t + "," + a + s + ")" : t;
  if (u2 === "") return r.t === 10 && !a ? "(" + l + ")" : l;
  let g = i == null ? "()" : "(" + ce + '["' + y(i) + '"])';
  return "(" + or([u2], l) + ")" + g;
}
var jr = class {
    constructor(r, t) {
      this._p = r;
      this.depth = t;
    }
    parse(r) {
      return R(this._p, this.depth, r);
    }
  },
  Yr = class {
    constructor(r, t) {
      this._p = r;
      this.depth = t;
    }
    parse(r) {
      return R(this._p, this.depth, r);
    }
    parseWithError(r) {
      return K(this._p, this.depth, r);
    }
    isAlive() {
      return this._p.state.alive;
    }
    pushPendingState() {
      Jr(this._p);
    }
    popPendingState() {
      be(this._p);
    }
    onParse(r) {
      ie(this._p, r);
    }
    onError(r) {
      Kr(this._p, r);
    }
  };
function ca(e) {
  return {
    alive: true,
    pending: 0,
    initial: true,
    buffer: [],
    onParse: e.onParse,
    onError: e.onError,
    onDone: e.onDone,
  };
}
function Wr(e) {
  return { type: 2, base: pe(2, e), state: ca(e) };
}
function fa(e, r, t) {
  let n = [];
  for (let a = 0, s = t.length; a < s; a++) a in t ? (n[a] = R(e, r, t[a])) : (n[a] = 0);
  return n;
}
function Sa(e, r, t, n) {
  return _e(t, n, fa(e, r, n));
}
function Gr(e, r, t) {
  let n = Object.entries(t),
    a = [],
    s = [];
  for (let i = 0, u2 = n.length; i < u2; i++) (a.push(y(n[i][0])), s.push(R(e, r, n[i][1])));
  return (
    b in t && (a.push(E(e.base, b)), s.push(Ue(Xe(e.base), R(e, r, $e(t))))),
    N in t && (a.push(E(e.base, N)), s.push(je(Qe(e.base), R(e, r, e.type === 1 ? te() : Ze(t))))),
    P$1 in t && (a.push(E(e.base, P$1)), s.push(X(t[P$1]))),
    I in t && (a.push(E(e.base, I)), s.push(t[I] ? Z : $)),
    { k: a, v: s }
  );
}
function Ur(e, r, t, n, a) {
  return er(t, n, a, Gr(e, r, n));
}
function ma(e, r, t, n) {
  return ke(t, R(e, r, n.valueOf()));
}
function pa(e, r, t, n) {
  return De(t, n, R(e, r, n.buffer));
}
function da(e, r, t, n) {
  return Fe(t, n, R(e, r, n.buffer));
}
function ga(e, r, t, n) {
  return Be(t, n, R(e, r, n.buffer));
}
function tn(e, r, t, n) {
  let a = q(n, e.base.features);
  return Me(t, n, a ? Gr(e, r, a) : o);
}
function ya(e, r, t, n) {
  let a = q(n, e.base.features);
  return Ve(t, n, a ? Gr(e, r, a) : o);
}
function Na(e, r, t, n) {
  let a = [],
    s = [];
  for (let [i, u2] of n.entries()) (a.push(R(e, r, i)), s.push(R(e, r, u2)));
  return rr(e.base, t, a, s);
}
function ba(e, r, t, n) {
  let a = [];
  for (let s of n.keys()) a.push(R(e, r, s));
  return Le(t, a);
}
function Ca(e, r, t, n) {
  let a = Ye(t, k(e.base, 4), []);
  return (
    e.type === 1 ||
      (Jr(e),
      n.on({
        next: (s) => {
          if (e.state.alive) {
            let i = K(e, r, s);
            i && ie(e, We(t, i));
          }
        },
        throw: (s) => {
          if (e.state.alive) {
            let i = K(e, r, s);
            i && ie(e, Ge(t, i));
          }
          be(e);
        },
        return: (s) => {
          if (e.state.alive) {
            let i = K(e, r, s);
            i && ie(e, Ke(t, i));
          }
          be(e);
        },
      })),
    a
  );
}
function va(e, r, t) {
  if (this.state.alive) {
    let n = K(this, r, t);
    (n && ie(this, c(23, e, o, o, o, o, o, [k(this.base, 2), n], o, o, o, o)), be(this));
  }
}
function Aa(e, r, t) {
  if (this.state.alive) {
    let n = K(this, r, t);
    n && ie(this, c(24, e, o, o, o, o, o, [k(this.base, 3), n], o, o, o, o));
  }
  be(this);
}
function Ra(e, r, t, n) {
  let a = Tr(e.base, {});
  return (e.type === 2 && (Jr(e), n.then(va.bind(e, a, r), Aa.bind(e, a, r))), xt(e.base, t, a));
}
function Ea(e, r, t, n, a) {
  for (let s = 0, i = a.length; s < i; s++) {
    let u2 = a[s];
    if (u2.parse.sync && u2.test(n))
      return fe(t, u2.tag, u2.parse.sync(n, new jr(e, r), { id: t }));
  }
  return o;
}
function Ia(e, r, t, n, a) {
  for (let s = 0, i = a.length; s < i; s++) {
    let u2 = a[s];
    if (u2.parse.stream && u2.test(n))
      return fe(t, u2.tag, u2.parse.stream(n, new Yr(e, r), { id: t }));
  }
  return o;
}
function nn(e, r, t, n) {
  let a = e.base.plugins;
  return a ? (e.type === 1 ? Ea(e, r, t, n, a) : Ia(e, r, t, n, a)) : o;
}
function Pa(e, r, t, n, a) {
  switch (a) {
    case Object:
      return Ur(e, r, t, n, false);
    case o:
      return Ur(e, r, t, n, true);
    case Date:
      return he(t, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return tn(e, r, t, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return ma(e, r, t, n);
    case ArrayBuffer:
      return tr(e.base, t, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return pa(e, r, t, n);
    case DataView:
      return ga(e, r, t, n);
    case Map:
      return Na(e, r, t, n);
    case Set:
      return ba(e, r, t, n);
  }
  if (a === Promise || n instanceof Promise) return Ra(e, r, t, n);
  let s = e.base.features;
  if (s & 32 && a === RegExp) return ze(t, n);
  if (s & 16)
    switch (a) {
      case BigInt64Array:
      case BigUint64Array:
        return da(e, r, t, n);
    }
  if (
    s & 1 &&
    typeof AggregateError != "undefined" &&
    (a === AggregateError || n instanceof AggregateError)
  )
    return ya(e, r, t, n);
  if (n instanceof Error) return tn(e, r, t, n);
  if (b in n || N in n) return Ur(e, r, t, n, !!a);
  throw new x(n);
}
function xa(e, r, t, n) {
  if (Array.isArray(n)) return Sa(e, r, t, n);
  if (M(n)) return Ca(e, r, t, n);
  let a = n.constructor;
  if (a === Y) return R(e, r, n.replacement);
  let s = nn(e, r, t, n);
  return s || Pa(e, r, t, n, a);
}
function Ta(e, r, t) {
  let n = W(e.base, t);
  if (n.type !== 0) return n.value;
  let a = nn(e, r, n.value, t);
  if (a) return a;
  throw new x(t);
}
function R(e, r, t) {
  if (r >= e.base.depthLimit) throw new ee$1(e.base.depthLimit);
  switch (typeof t) {
    case "boolean":
      return t ? Z : $;
    case "undefined":
      return Ae;
    case "string":
      return X(t);
    case "number":
      return Oe(t);
    case "bigint":
      return we(t);
    case "object": {
      if (t) {
        let n = W(e.base, t);
        return n.type === 0 ? xa(e, r + 1, n.value, t) : n.value;
      }
      return Re;
    }
    case "symbol":
      return E(e.base, t);
    case "function":
      return Ta(e, r, t);
    default:
      throw new x(t);
  }
}
function ie(e, r) {
  e.state.initial ? e.state.buffer.push(r) : Hr(e, r, false);
}
function Kr(e, r) {
  if (e.state.onError) e.state.onError(r);
  else throw r instanceof z ? r : new z(r);
}
function on(e) {
  e.state.onDone && e.state.onDone();
}
function Hr(e, r, t) {
  try {
    e.state.onParse(r, t);
  } catch (n) {
    Kr(e, n);
  }
}
function Jr(e) {
  e.state.pending++;
}
function be(e) {
  --e.state.pending <= 0 && on(e);
}
function K(e, r, t) {
  try {
    return R(e, r, t);
  } catch (n) {
    return (Kr(e, n), o);
  }
}
function Zr(e, r) {
  let t = K(e, 0, r);
  t && (Hr(e, t, true), (e.state.initial = false), Oa(e, e.state), e.state.pending <= 0 && lr(e));
}
function Oa(e, r) {
  for (let t = 0, n = r.buffer.length; t < n; t++) Hr(e, r.buffer[t], false);
}
function lr(e) {
  e.state.alive && (on(e), (e.state.alive = false));
}
async function Zi(e, r = {}) {
  let t = A(r.plugins),
    n = ne(2, { plugins: t, disabledFeatures: r.disabledFeatures, refs: r.refs });
  return await oe(n, e);
}
function an(e, r) {
  let t = A(r.plugins),
    n = Wr({
      plugins: t,
      refs: r.refs,
      disabledFeatures: r.disabledFeatures,
      onParse(a, s) {
        let i = sr({
            plugins: t,
            features: n.base.features,
            scopeId: r.scopeId,
            markedRefs: n.base.marked,
          }),
          u2;
        try {
          u2 = ur(i, a);
        } catch (l) {
          r.onError && r.onError(l);
          return;
        }
        r.onSerialize(u2, s);
      },
      onError: r.onError,
      onDone: r.onDone,
    });
  return (Zr(n, e), lr.bind(null, n));
}
function $i(e, r) {
  let t = A(r.plugins),
    n = Wr({
      plugins: t,
      refs: r.refs,
      disabledFeatures: r.disabledFeatures,
      onParse: r.onParse,
      onError: r.onError,
      onDone: r.onDone,
    });
  return (Zr(n, e), lr.bind(null, n));
}
function du(e, r = {}) {
  var i;
  let t = A(r.plugins),
    n = r.disabledFeatures || 0,
    a = (i = e.f) != null ? i : 63,
    s = Dt({ plugins: t, markedRefs: e.m, features: a & ~n, disabledFeatures: n });
  return nr(s, e.t);
}
const GLOBAL_TSR = "$_TSR";
const TSR_SCRIPT_BARRIER_ID = "$tsr-stream-barrier";
function createSerializationAdapter(opts) {
  return opts;
}
function makeSsrSerovalPlugin(serializationAdapter, options) {
  return Js({
    tag: "$TSR/t/" + serializationAdapter.key,
    test: serializationAdapter.test,
    parse: {
      stream(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      },
    },
    serialize(node, ctx) {
      options.didRun = true;
      return GLOBAL_TSR + '.t.get("' + serializationAdapter.key + '")(' + ctx.serialize(node) + ")";
    },
    // we never deserialize on the server during SSR
    deserialize: void 0,
  });
}
function makeSerovalPlugin(serializationAdapter) {
  return Js({
    tag: "$TSR/t/" + serializationAdapter.key,
    test: serializationAdapter.test,
    parse: {
      sync(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      },
      async async(value, ctx) {
        return await ctx.parse(serializationAdapter.toSerializable(value));
      },
      stream(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      },
    },
    // we don't generate JS code outside of SSR (for now)
    serialize: void 0,
    deserialize(node, ctx) {
      return serializationAdapter.fromSerializable(ctx.deserialize(node));
    },
  });
}
var p = {},
  P = (e) =>
    new ReadableStream({
      start: (r) => {
        e.on({
          next: (a) => {
            try {
              r.enqueue(a);
            } catch (t) {}
          },
          throw: (a) => {
            r.error(a);
          },
          return: () => {
            try {
              r.close();
            } catch (a) {}
          },
        });
      },
    }),
  ee2 = Js({
    tag: "seroval-plugins/web/ReadableStreamFactory",
    test(e) {
      return e === p;
    },
    parse: {
      sync() {},
      async async() {
        return await Promise.resolve(void 0);
      },
      stream() {},
    },
    serialize() {
      return P.toString();
    },
    deserialize() {
      return p;
    },
  });
function w2(e) {
  let r = te(),
    a = e.getReader();
  async function t() {
    try {
      let n = await a.read();
      n.done ? r.return(n.value) : (r.next(n.value), await t());
    } catch (n) {
      r.throw(n);
    }
  }
  return (t().catch(() => {}), r);
}
var re = Js({
    tag: "seroval/plugins/web/ReadableStream",
    extends: [ee2],
    test(e) {
      return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
    },
    parse: {
      sync(e, r) {
        return { factory: r.parse(p), stream: r.parse(te()) };
      },
      async async(e, r) {
        return { factory: await r.parse(p), stream: await r.parse(w2(e)) };
      },
      stream(e, r) {
        return { factory: r.parse(p), stream: r.parse(w2(e)) };
      },
    },
    serialize(e, r) {
      return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
    },
    deserialize(e, r) {
      let a = r.deserialize(e.stream);
      return P(a);
    },
  }),
  u = re;
const ShallowErrorPlugin = /* @__PURE__ */ Js({
  tag: "$TSR/Error",
  test(value) {
    return value instanceof Error;
  },
  parse: {
    sync(value, ctx) {
      return {
        message: ctx.parse(value.message),
      };
    },
    async async(value, ctx) {
      return {
        message: await ctx.parse(value.message),
      };
    },
    stream(value, ctx) {
      return {
        message: ctx.parse(value.message),
      };
    },
  },
  serialize(node, ctx) {
    return "new Error(" + ctx.serialize(node.message) + ")";
  },
  deserialize(node, ctx) {
    return new Error(ctx.deserialize(node.message));
  },
});
class RawStream {
  constructor(stream, options) {
    this.stream = stream;
    this.hint = (options == null ? void 0 : options.hint) ?? "binary";
  }
}
const BufferCtor = globalThis.Buffer;
const hasNodeBuffer = !!BufferCtor && typeof BufferCtor.from === "function";
function uint8ArrayToBase64(bytes) {
  if (bytes.length === 0) return "";
  if (hasNodeBuffer) {
    return BufferCtor.from(bytes).toString("base64");
  }
  const CHUNK_SIZE = 32768;
  const chunks = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    chunks.push(String.fromCharCode.apply(null, chunk));
  }
  return btoa(chunks.join(""));
}
function base64ToUint8Array(base64) {
  if (base64.length === 0) return new Uint8Array(0);
  if (hasNodeBuffer) {
    const buf = BufferCtor.from(base64, "base64");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
const RAW_STREAM_FACTORY_BINARY = /* @__PURE__ */ Object.create(null);
const RAW_STREAM_FACTORY_TEXT = /* @__PURE__ */ Object.create(null);
const RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY = (stream) =>
  new ReadableStream({
    start(controller) {
      stream.on({
        next(base64) {
          try {
            controller.enqueue(base64ToUint8Array(base64));
          } catch {}
        },
        throw(error) {
          controller.error(error);
        },
        return() {
          try {
            controller.close();
          } catch {}
        },
      });
    },
  });
const textEncoderForFactory = new TextEncoder();
const RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT = (stream) => {
  return new ReadableStream({
    start(controller) {
      stream.on({
        next(value) {
          try {
            if (typeof value === "string") {
              controller.enqueue(textEncoderForFactory.encode(value));
            } else {
              controller.enqueue(base64ToUint8Array(value.$b64));
            }
          } catch {}
        },
        throw(error) {
          controller.error(error);
        },
        return() {
          try {
            controller.close();
          } catch {}
        },
      });
    },
  });
};
const FACTORY_BINARY = `(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))`;
const FACTORY_TEXT = `(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})`;
function toBinaryStream(readable) {
  const stream = te();
  const reader = readable.getReader();
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          stream.return(void 0);
          break;
        }
        stream.next(uint8ArrayToBase64(value));
      }
    } catch (error) {
      stream.throw(error);
    } finally {
      reader.releaseLock();
    }
  })();
  return stream;
}
function toTextStream(readable) {
  const stream = te();
  const reader = readable.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          try {
            const remaining = decoder.decode();
            if (remaining.length > 0) {
              stream.next(remaining);
            }
          } catch {}
          stream.return(void 0);
          break;
        }
        try {
          const text = decoder.decode(value, { stream: true });
          if (text.length > 0) {
            stream.next(text);
          }
        } catch {
          stream.next({ $b64: uint8ArrayToBase64(value) });
        }
      }
    } catch (error) {
      stream.throw(error);
    } finally {
      reader.releaseLock();
    }
  })();
  return stream;
}
const RawStreamFactoryBinaryPlugin = Js({
  tag: "tss/RawStreamFactory",
  test(value) {
    return value === RAW_STREAM_FACTORY_BINARY;
  },
  parse: {
    sync() {
      return void 0;
    },
    async() {
      return Promise.resolve(void 0);
    },
    stream() {
      return void 0;
    },
  },
  serialize() {
    return FACTORY_BINARY;
  },
  deserialize() {
    return RAW_STREAM_FACTORY_BINARY;
  },
});
const RawStreamFactoryTextPlugin = Js({
  tag: "tss/RawStreamFactoryText",
  test(value) {
    return value === RAW_STREAM_FACTORY_TEXT;
  },
  parse: {
    sync() {
      return void 0;
    },
    async() {
      return Promise.resolve(void 0);
    },
    stream() {
      return void 0;
    },
  },
  serialize() {
    return FACTORY_TEXT;
  },
  deserialize() {
    return RAW_STREAM_FACTORY_TEXT;
  },
});
const RawStreamSSRPlugin = Js({
  tag: "tss/RawStream",
  extends: [RawStreamFactoryBinaryPlugin, RawStreamFactoryTextPlugin],
  test(value) {
    return value instanceof RawStream;
  },
  parse: {
    sync(value, ctx) {
      const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
      return {
        hint: value.hint,
        factory: ctx.parse(factory),
        stream: ctx.parse(te()),
      };
    },
    async async(value, ctx) {
      const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
      const encodedStream =
        value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
      return {
        hint: value.hint,
        factory: await ctx.parse(factory),
        stream: await ctx.parse(encodedStream),
      };
    },
    stream(value, ctx) {
      const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
      const encodedStream =
        value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
      return {
        hint: value.hint,
        factory: ctx.parse(factory),
        stream: ctx.parse(encodedStream),
      };
    },
  },
  serialize(node, ctx) {
    return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
  },
  deserialize(node, ctx) {
    const stream = ctx.deserialize(node.stream);
    return node.hint === "text"
      ? RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT(stream)
      : RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY(stream);
  },
});
function createRawStreamRPCPlugin(onRawStream) {
  let nextStreamId = 1;
  return Js({
    tag: "tss/RawStream",
    test(value) {
      return value instanceof RawStream;
    },
    parse: {
      async(value) {
        const streamId = nextStreamId++;
        onRawStream(streamId, value.stream);
        return Promise.resolve({ streamId });
      },
      stream(value) {
        const streamId = nextStreamId++;
        onRawStream(streamId, value.stream);
        return { streamId };
      },
    },
    serialize() {
      throw new Error(
        "RawStreamRPCPlugin.serialize should not be called. RPC uses JSON serialization, not JS code generation.",
      );
    },
    deserialize() {
      throw new Error(
        "RawStreamRPCPlugin.deserialize should not be called. Use createRawStreamDeserializePlugin on client.",
      );
    },
  });
}
const defaultSerovalPlugins = [
  ShallowErrorPlugin,
  // RawStreamSSRPlugin must come before ReadableStreamPlugin to match first
  RawStreamSSRPlugin,
  // ReadableStreamNode is not exported by seroval
  u,
];
var react = { exports: {} };
var react_production = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReact_production;
function requireReact_production() {
  if (hasRequiredReact_production) return react_production;
  hasRequiredReact_production = 1;
  var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
    REACT_PORTAL_TYPE = Symbol.for("react.portal"),
    REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
    REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
    REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
    REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
    REACT_CONTEXT_TYPE = Symbol.for("react.context"),
    REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
    REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
    REACT_MEMO_TYPE = Symbol.for("react.memo"),
    REACT_LAZY_TYPE = Symbol.for("react.lazy"),
    REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
    MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable =
      (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
      maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ReactNoopUpdateQueue = {
      isMounted: function () {
        return false;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    assign = Object.assign,
    emptyObject = {};
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {};
  Component.prototype.setState = function (partialState, callback) {
    if (
      "object" !== typeof partialState &&
      "function" !== typeof partialState &&
      null != partialState
    )
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables.",
      );
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  function ComponentDummy() {}
  ComponentDummy.prototype = Component.prototype;
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
  pureComponentPrototype.constructor = PureComponent;
  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  var isArrayImpl = Array.isArray;
  function noop() {}
  var ReactSharedInternals = { H: null, A: null, T: null, S: null },
    hasOwnProperty = Object.prototype.hasOwnProperty;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props,
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return (
      "$" +
      key.replace(/[=:]/g, function (match) {
        return escaperLookup[match];
      })
    );
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key
      ? escape("" + element.key)
      : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch (
          ("string" === typeof thenable.status
            ? thenable.then(noop, noop)
            : ((thenable.status = "pending"),
              thenable.then(
                function (fulfilledValue) {
                  "pending" === thenable.status &&
                    ((thenable.status = "fulfilled"), (thenable.value = fulfilledValue));
                },
                function (error) {
                  "pending" === thenable.status &&
                    ((thenable.status = "rejected"), (thenable.reason = error));
                },
              )),
          thenable.status)
        ) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = false;
    if (null === children) invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return (
                (invokeCallback = children._init),
                mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback,
                )
              );
          }
      }
    if (invokeCallback)
      return (
        (callback = callback(children)),
        (invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar),
        isArrayImpl(callback)
          ? ((escapedPrefix = ""),
            null != invokeCallback &&
              (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"),
            mapIntoArray(callback, array, escapedPrefix, "", function (c2) {
              return c2;
            }))
          : null != callback &&
            (isValidElement(callback) &&
              (callback = cloneAndReplaceKey(
                callback,
                escapedPrefix +
                  (null == callback.key || (children && children.key === callback.key)
                    ? ""
                    : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") +
                  invokeCallback,
              )),
            array.push(callback)),
        1
      );
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        ((nameSoFar = children[i]),
          (type = nextNamePrefix + getElementKey(nameSoFar, i)),
          (invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback)));
    else if (((i = getIteratorFn(children)), "function" === typeof i))
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        ((nameSoFar = nameSoFar.value),
          (type = nextNamePrefix + getElementKey(nameSoFar, i++)),
          (invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback)));
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
      array = String(children);
      throw Error(
        "Objects are not valid as a React child (found: " +
          ("[object Object]" === array
            ? "object with keys {" + Object.keys(children).join(", ") + "}"
            : array) +
          "). If you meant to render a collection of children, use an array instead.",
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [],
      count = 0;
    mapIntoArray(children, result, "", "", function (child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result;
      ctor = ctor();
      ctor.then(
        function (moduleObject) {
          if (0 === payload._status || -1 === payload._status)
            ((payload._status = 1), (payload._result = moduleObject));
        },
        function (error) {
          if (0 === payload._status || -1 === payload._status)
            ((payload._status = 2), (payload._result = error));
        },
      );
      -1 === payload._status && ((payload._status = 0), (payload._result = ctor));
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
  }
  var reportGlobalError =
      "function" === typeof reportError
        ? reportError
        : function (error) {
            if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
              var event = new window.ErrorEvent("error", {
                bubbles: true,
                cancelable: true,
                message:
                  "object" === typeof error && null !== error && "string" === typeof error.message
                    ? String(error.message)
                    : String(error),
                error,
              });
              if (!window.dispatchEvent(event)) return;
            } else if ("object" === typeof process && "function" === typeof process.emit) {
              process.emit("uncaughtException", error);
              return;
            }
            console.error(error);
          },
    Children = {
      map: mapChildren,
      forEach: function (children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function () {
            forEachFunc.apply(this, arguments);
          },
          forEachContext,
        );
      },
      count: function (children) {
        var n = 0;
        mapChildren(children, function () {
          n++;
        });
        return n;
      },
      toArray: function (children) {
        return (
          mapChildren(children, function (child) {
            return child;
          }) || []
        );
      },
      only: function (children) {
        if (!isValidElement(children))
          throw Error("React.Children.only expected to receive a single React element child.");
        return children;
      },
    };
  react_production.Activity = REACT_ACTIVITY_TYPE;
  react_production.Children = Children;
  react_production.Component = Component;
  react_production.Fragment = REACT_FRAGMENT_TYPE;
  react_production.Profiler = REACT_PROFILER_TYPE;
  react_production.PureComponent = PureComponent;
  react_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_production.Suspense = REACT_SUSPENSE_TYPE;
  react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
    ReactSharedInternals;
  react_production.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function (size) {
      return ReactSharedInternals.H.useMemoCache(size);
    },
  };
  react_production.cache = function (fn2) {
    return function () {
      return fn2.apply(null, arguments);
    };
  };
  react_production.cacheSignal = function () {
    return null;
  };
  react_production.cloneElement = function (element, config, children) {
    if (null === element || void 0 === element)
      throw Error("The argument must be a React element, but you passed " + element + ".");
    var props = assign({}, element.props),
      key = element.key;
    if (null != config)
      for (propName in (void 0 !== config.key && (key = "" + config.key), config))
        !hasOwnProperty.call(config, propName) ||
          "key" === propName ||
          "__self" === propName ||
          "__source" === propName ||
          ("ref" === propName && void 0 === config.ref) ||
          (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_production.createContext = function (defaultValue) {
    defaultValue = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
    };
    defaultValue.Provider = defaultValue;
    defaultValue.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: defaultValue,
    };
    return defaultValue;
  };
  react_production.createElement = function (type, config, children) {
    var propName,
      props = {},
      key = null;
    if (null != config)
      for (propName in (void 0 !== config.key && (key = "" + config.key), config))
        hasOwnProperty.call(config, propName) &&
          "key" !== propName &&
          "__self" !== propName &&
          "__source" !== propName &&
          (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in ((childrenLength = type.defaultProps), childrenLength))
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_production.createRef = function () {
    return { current: null };
  };
  react_production.forwardRef = function (render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_production.isValidElement = isValidElement;
  react_production.lazy = function (ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer,
    };
  };
  react_production.memo = function (type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare,
    };
  };
  react_production.startTransition = function (scope) {
    var prevTransition = ReactSharedInternals.T,
      currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = scope(),
        onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      "object" === typeof returnValue &&
        null !== returnValue &&
        "function" === typeof returnValue.then &&
        returnValue.then(noop, reportGlobalError);
    } catch (error) {
      reportGlobalError(error);
    } finally {
      (null !== prevTransition &&
        null !== currentTransition.types &&
        (prevTransition.types = currentTransition.types),
        (ReactSharedInternals.T = prevTransition));
    }
  };
  react_production.unstable_useCacheRefresh = function () {
    return ReactSharedInternals.H.useCacheRefresh();
  };
  react_production.use = function (usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_production.useActionState = function (action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
  };
  react_production.useCallback = function (callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_production.useContext = function (Context) {
    return ReactSharedInternals.H.useContext(Context);
  };
  react_production.useDebugValue = function () {};
  react_production.useDeferredValue = function (value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
  };
  react_production.useEffect = function (create, deps) {
    return ReactSharedInternals.H.useEffect(create, deps);
  };
  react_production.useEffectEvent = function (callback) {
    return ReactSharedInternals.H.useEffectEvent(callback);
  };
  react_production.useId = function () {
    return ReactSharedInternals.H.useId();
  };
  react_production.useImperativeHandle = function (ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
  };
  react_production.useInsertionEffect = function (create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
  };
  react_production.useLayoutEffect = function (create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
  };
  react_production.useMemo = function (create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_production.useOptimistic = function (passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
  };
  react_production.useReducer = function (reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
  };
  react_production.useRef = function (initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
  };
  react_production.useState = function (initialState) {
    return ReactSharedInternals.H.useState(initialState);
  };
  react_production.useSyncExternalStore = function (subscribe2, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(subscribe2, getSnapshot, getServerSnapshot);
  };
  react_production.useTransition = function () {
    return ReactSharedInternals.H.useTransition();
  };
  react_production.version = "19.2.3";
  return react_production;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production();
  }
  return react.exports;
}
var reactExports = requireReact();
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$1 = /* @__PURE__ */ _mergeNamespaces(
  {
    __proto__: null,
    default: React,
  },
  [reactExports],
);
const REACT_USE = "use";
const reactUse = React$1[REACT_USE];
const useLayoutEffect =
  typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function usePrevious(value) {
  const ref = reactExports.useRef({
    value,
    prev: null,
  });
  const current = ref.current.value;
  if (value !== current) {
    ref.current = {
      value,
      prev: current,
    };
  }
  return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  reactExports.useEffect(() => {
    if (!ref.current || options.disabled || typeof IntersectionObserver !== "function") {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [callback, intersectionObserverOptions, options.disabled, ref]);
}
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function CatchBoundary(props) {
  const errorComponent = props.errorComponent ?? ErrorComponent;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CatchBoundaryImpl, {
    getResetKey: props.getResetKey,
    onCatch: props.onCatch,
    children: ({ error, reset }) => {
      if (error) {
        return reactExports.createElement(errorComponent, {
          error,
          reset,
        });
      }
      return props.children;
    },
  });
}
class CatchBoundaryImpl extends reactExports.Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
  }
  static getDerivedStateFromProps(props) {
    return { resetKey: props.getResetKey() };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.error && prevState.resetKey !== this.state.resetKey) {
      this.reset();
    }
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }
  render() {
    return this.props.children({
      error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
      reset: () => {
        this.reset();
      },
    });
  }
}
function ErrorComponent({ error }) {
  const [show, setShow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    style: { padding: ".5rem", maxWidth: "100%" },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: { display: "flex", alignItems: "center", gap: ".5rem" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
            style: { fontSize: "1rem" },
            children: "Something went wrong!",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            style: {
              appearance: "none",
              fontSize: ".6em",
              border: "1px solid currentColor",
              padding: ".1rem .2rem",
              fontWeight: "bold",
              borderRadius: ".25rem",
            },
            onClick: () => setShow((d) => !d),
            children: show ? "Hide Error" : "Show Error",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: ".25rem" } }),
      show
        ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", {
              style: {
                fontSize: ".7em",
                border: "1px solid red",
                borderRadius: ".25rem",
                padding: ".3rem",
                color: "red",
                overflow: "auto",
              },
              children: error.message
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: error.message })
                : null,
            }),
          })
        : null,
    ],
  });
}
function ClientOnly({ children, fallback = null }) {
  return useHydrated()
    ? /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children })
    : /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children: fallback });
}
function useHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
function subscribe() {
  return () => {};
}
function warning(condition, message) {}
var withSelector = { exports: {} };
var withSelector_production = {};
var shim = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_production;
function requireUseSyncExternalStoreShim_production() {
  if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
  hasRequiredUseSyncExternalStoreShim_production = 1;
  var React2 = requireReact();
  function is(x2, y2) {
    return (x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2)) || (x2 !== x2 && y2 !== y2);
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is,
    useState = React2.useState,
    useEffect = React2.useEffect,
    useLayoutEffect2 = React2.useLayoutEffect,
    useDebugValue = React2.useDebugValue;
  function useSyncExternalStore$2(subscribe2, getSnapshot) {
    var value = getSnapshot(),
      _useState = useState({ inst: { value, getSnapshot } }),
      inst = _useState[0].inst,
      forceUpdate = _useState[1];
    useLayoutEffect2(
      function () {
        inst.value = value;
        inst.getSnapshot = getSnapshot;
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      },
      [subscribe2, value, getSnapshot],
    );
    useEffect(
      function () {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        return subscribe2(function () {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        });
      },
      [subscribe2],
    );
    useDebugValue(value);
    return value;
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function useSyncExternalStore$1(subscribe2, getSnapshot) {
    return getSnapshot();
  }
  var shim2 =
    "undefined" === typeof window ||
    "undefined" === typeof window.document ||
    "undefined" === typeof window.document.createElement
      ? useSyncExternalStore$1
      : useSyncExternalStore$2;
  useSyncExternalStoreShim_production.useSyncExternalStore =
    void 0 !== React2.useSyncExternalStore ? React2.useSyncExternalStore : shim2;
  return useSyncExternalStoreShim_production;
}
var hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim.exports;
  hasRequiredShim = 1;
  {
    shim.exports = requireUseSyncExternalStoreShim_production();
  }
  return shim.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredWithSelector_production;
function requireWithSelector_production() {
  if (hasRequiredWithSelector_production) return withSelector_production;
  hasRequiredWithSelector_production = 1;
  var React2 = requireReact(),
    shim2 = requireShim();
  function is(x2, y2) {
    return (x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2)) || (x2 !== x2 && y2 !== y2);
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is,
    useSyncExternalStore = shim2.useSyncExternalStore,
    useRef = React2.useRef,
    useEffect = React2.useEffect,
    useMemo = React2.useMemo,
    useDebugValue = React2.useDebugValue;
  withSelector_production.useSyncExternalStoreWithSelector = function (
    subscribe2,
    getSnapshot,
    getServerSnapshot,
    selector,
    isEqual,
  ) {
    var instRef = useRef(null);
    if (null === instRef.current) {
      var inst = { hasValue: false, value: null };
      instRef.current = inst;
    } else inst = instRef.current;
    instRef = useMemo(
      function () {
        function memoizedSelector(nextSnapshot) {
          if (!hasMemo) {
            hasMemo = true;
            memoizedSnapshot = nextSnapshot;
            nextSnapshot = selector(nextSnapshot);
            if (void 0 !== isEqual && inst.hasValue) {
              var currentSelection = inst.value;
              if (isEqual(currentSelection, nextSnapshot))
                return (memoizedSelection = currentSelection);
            }
            return (memoizedSelection = nextSnapshot);
          }
          currentSelection = memoizedSelection;
          if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
          var nextSelection = selector(nextSnapshot);
          if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
            return ((memoizedSnapshot = nextSnapshot), currentSelection);
          memoizedSnapshot = nextSnapshot;
          return (memoizedSelection = nextSelection);
        }
        var hasMemo = false,
          memoizedSnapshot,
          memoizedSelection,
          maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
        return [
          function () {
            return memoizedSelector(getSnapshot());
          },
          null === maybeGetServerSnapshot
            ? void 0
            : function () {
                return memoizedSelector(maybeGetServerSnapshot());
              },
        ];
      },
      [getSnapshot, getServerSnapshot, selector, isEqual],
    );
    var value = useSyncExternalStore(subscribe2, instRef[0], instRef[1]);
    useEffect(
      function () {
        inst.hasValue = true;
        inst.value = value;
      },
      [value],
    );
    useDebugValue(value);
    return value;
  };
  return withSelector_production;
}
var hasRequiredWithSelector;
function requireWithSelector() {
  if (hasRequiredWithSelector) return withSelector.exports;
  hasRequiredWithSelector = 1;
  {
    withSelector.exports = requireWithSelector_production();
  }
  return withSelector.exports;
}
var withSelectorExports = requireWithSelector();
function useStore(store, selector = (d) => d, options = {}) {
  const equal = options.equal ?? shallow;
  const slice = withSelectorExports.useSyncExternalStoreWithSelector(
    store.subscribe,
    () => store.state,
    () => store.state,
    selector,
    equal,
  );
  return slice;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k2, v2] of objA) {
      if (!objB.has(k2) || !Object.is(v2, objB.get(k2))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v2 of objA) {
      if (!objB.has(v2)) return false;
    }
    return true;
  }
  if (objA instanceof Date && objB instanceof Date) {
    if (objA.getTime() !== objB.getTime()) return false;
    return true;
  }
  const keysA = getOwnKeys(objA);
  if (keysA.length !== getOwnKeys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }
  return true;
}
function getOwnKeys(obj) {
  return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
}
const routerContext = reactExports.createContext(null);
function getRouterContext() {
  if (typeof document === "undefined") {
    return routerContext;
  }
  if (window.__TSR_ROUTER_CONTEXT__) {
    return window.__TSR_ROUTER_CONTEXT__;
  }
  window.__TSR_ROUTER_CONTEXT__ = routerContext;
  return routerContext;
}
function useRouter(opts) {
  const value = reactExports.useContext(getRouterContext());
  warning(!(((opts == null ? void 0 : opts.warn) ?? true) && !value));
  return value;
}
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: (opts == null ? void 0 : opts.router) === void 0,
  });
  const router = (opts == null ? void 0 : opts.router) || contextRouter;
  const previousResult = reactExports.useRef(void 0);
  return useStore(router.__store, (state) => {
    if (opts == null ? void 0 : opts.select) {
      if (opts.structuralSharing ?? router.options.defaultStructuralSharing) {
        const newSlice = replaceEqualDeep(previousResult.current, opts.select(state));
        previousResult.current = newSlice;
        return newSlice;
      }
      return opts.select(state);
    }
    return state;
  });
}
const matchContext = reactExports.createContext(void 0);
const dummyMatchContext = reactExports.createContext(void 0);
var reactDom = { exports: {} };
var reactDom_production = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production) return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React2 = requireReact();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return (
      "Minified React error #" +
      code +
      "; visit " +
      url +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function noop() {}
  var Internals = {
      d: {
        f: noop,
        r: function () {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop,
      },
      p: 0,
      findDOMNode: null,
    },
    REACT_PORTAL_TYPE = Symbol.for("react.portal");
  function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: null == key ? null : "" + key,
      children,
      containerInfo,
      implementation,
    };
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input) return "use-credentials" === input ? input : "";
  }
  reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_production.createPortal = function (children, container) {
    var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (
      !container ||
      (1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
    )
      throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
  };
  reactDom_production.flushSync = function (fn2) {
    var previousTransition = ReactSharedInternals.T,
      previousUpdatePriority = Internals.p;
    try {
      if (((ReactSharedInternals.T = null), (Internals.p = 2), fn2)) return fn2();
    } finally {
      ((ReactSharedInternals.T = previousTransition),
        (Internals.p = previousUpdatePriority),
        Internals.d.f());
    }
  };
  reactDom_production.preconnect = function (href, options) {
    "string" === typeof href &&
      (options
        ? ((options = options.crossOrigin),
          (options =
            "string" === typeof options ? ("use-credentials" === options ? options : "") : void 0))
        : (options = null),
      Internals.d.C(href, options));
  };
  reactDom_production.prefetchDNS = function (href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_production.preinit = function (href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as,
        crossOrigin = getCrossOriginStringAs(as, options.crossOrigin),
        integrity = "string" === typeof options.integrity ? options.integrity : void 0,
        fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as
        ? Internals.d.S(
            href,
            "string" === typeof options.precedence ? options.precedence : void 0,
            {
              crossOrigin,
              integrity,
              fetchPriority,
            },
          )
        : "script" === as &&
          Internals.d.X(href, {
            crossOrigin,
            integrity,
            fetchPriority,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          });
    }
  };
  reactDom_production.preinitModule = function (href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          });
        }
      } else null == options && Internals.d.M(href);
  };
  reactDom_production.preload = function (href, options) {
    if (
      "string" === typeof href &&
      "object" === typeof options &&
      null !== options &&
      "string" === typeof options.as
    ) {
      var as = options.as,
        crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy:
          "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0,
      });
    }
  };
  reactDom_production.preloadModule = function (href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        });
      } else Internals.d.m(href);
  };
  reactDom_production.requestFormReset = function (form) {
    Internals.d.r(form);
  };
  reactDom_production.unstable_batchedUpdates = function (fn2, a) {
    return fn2(a);
  };
  reactDom_production.useFormState = function (action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  };
  reactDom_production.useFormStatus = function () {
    return ReactSharedInternals.H.useHostTransitionStatus();
  };
  reactDom_production.version = "19.2.3";
  return reactDom_production;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function"
    ) {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production();
  }
  return reactDom.exports;
}
function Transitioner() {
  const router = useRouter();
  const mountLoadForRouter = reactExports.useRef({ router, mounted: false });
  const [isTransitioning, setIsTransitioning] = reactExports.useState(false);
  const { hasPendingMatches, isLoading } = useRouterState({
    select: (s) => ({
      isLoading: s.isLoading,
      hasPendingMatches: s.matches.some((d) => d.status === "pending"),
    }),
    structuralSharing: true,
  });
  const previousIsLoading = usePrevious(isLoading);
  const isAnyPending = isLoading || isTransitioning || hasPendingMatches;
  const previousIsAnyPending = usePrevious(isAnyPending);
  const isPagePending = isLoading || hasPendingMatches;
  const previousIsPagePending = usePrevious(isPagePending);
  router.startTransition = (fn2) => {
    setIsTransitioning(true);
    reactExports.startTransition(() => {
      fn2();
      setIsTransitioning(false);
    });
  };
  reactExports.useEffect(() => {
    const unsub = router.history.subscribe(({ navigateOpts }) => {
      if (navigateOpts == null ? void 0 : navigateOpts.skipTransitionerLoad) {
        return;
      }
      router.load();
    });
    const nextLocation = router.buildLocation({
      to: router.latestLocation.pathname,
      search: true,
      params: true,
      hash: true,
      state: true,
      _includeValidateSearch: true,
    });
    if (
      trimPathRight(router.latestLocation.publicHref) !== trimPathRight(nextLocation.publicHref)
    ) {
      router.commitLocation({ ...nextLocation, replace: true });
    }
    return () => {
      unsub();
    };
  }, [router, router.history]);
  useLayoutEffect(() => {
    if (
      // if we are hydrating from SSR, loading is triggered in ssr-client
      (typeof window !== "undefined" && router.ssr) ||
      (mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted)
    ) {
      return;
    }
    mountLoadForRouter.current = { router, mounted: true };
    const tryLoad = async () => {
      try {
        await router.load();
      } catch (err) {
        console.error(err);
      }
    };
    tryLoad();
  }, [router]);
  useLayoutEffect(() => {
    if (previousIsLoading && !isLoading) {
      router.emit({
        type: "onLoad",
        // When the new URL has committed, when the new matches have been loaded into state.matches
        ...getLocationChangeInfo(router.state),
      });
    }
  }, [previousIsLoading, router, isLoading]);
  useLayoutEffect(() => {
    if (previousIsPagePending && !isPagePending) {
      router.emit({
        type: "onBeforeRouteMount",
        ...getLocationChangeInfo(router.state),
      });
    }
  }, [isPagePending, previousIsPagePending, router]);
  useLayoutEffect(() => {
    if (previousIsAnyPending && !isAnyPending) {
      const changeInfo = getLocationChangeInfo(router.state);
      router.emit({
        type: "onResolved",
        ...changeInfo,
      });
      router.__store.setState((s) => ({
        ...s,
        status: "idle",
        resolvedLocation: s.location,
      }));
      if (changeInfo.hrefChanged) {
        handleHashScroll(router);
      }
    }
  }, [isAnyPending, previousIsAnyPending, router]);
  return null;
}
function CatchNotFound(props) {
  const resetKey = useRouterState({
    select: (s) => `not-found-${s.location.pathname}-${s.status}`,
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CatchBoundary, {
    getResetKey: () => resetKey,
    onCatch: (error, errorInfo) => {
      var _a2;
      if (isNotFound(error)) {
        (_a2 = props.onCatch) == null ? void 0 : _a2.call(props, error, errorInfo);
      } else {
        throw error;
      }
    },
    errorComponent: ({ error }) => {
      var _a2;
      if (isNotFound(error)) {
        return (_a2 = props.fallback) == null ? void 0 : _a2.call(props, error);
      } else {
        throw error;
      }
    },
    children: props.children,
  });
}
function DefaultGlobalNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not Found" });
}
function SafeFragment(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: props.children,
  });
}
function renderRouteNotFound(router, route, data) {
  if (!route.options.notFoundComponent) {
    if (router.options.defaultNotFoundComponent) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultNotFoundComponent, {
        ...data,
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultGlobalNotFound, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(route.options.notFoundComponent, { ...data });
}
function ScriptOnce({ children }) {
  var _a2;
  const router = useRouter();
  if (!router.isServer) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
    nonce: (_a2 = router.options.ssr) == null ? void 0 : _a2.nonce,
    dangerouslySetInnerHTML: {
      __html: children + ";document.currentScript.remove()",
    },
  });
}
function ScrollRestoration() {
  const router = useRouter();
  if (!router.isScrollRestoring || !router.isServer) {
    return null;
  }
  if (typeof router.options.scrollRestoration === "function") {
    const shouldRestore = router.options.scrollRestoration({
      location: router.latestLocation,
    });
    if (!shouldRestore) {
      return null;
    }
  }
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  const userKey = getKey(router.latestLocation);
  const resolvedKey =
    userKey !== defaultGetScrollRestorationKey(router.latestLocation) ? userKey : void 0;
  const restoreScrollOptions = {
    storageKey,
    shouldScrollRestoration: true,
  };
  if (resolvedKey) {
    restoreScrollOptions.key = resolvedKey;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ScriptOnce, {
    children: `(${restoreScroll.toString()})(${escapeHtml(JSON.stringify(restoreScrollOptions))})`,
  });
}
const Match = reactExports.memo(function MatchImpl({ matchId }) {
  var _a2, _b2;
  const router = useRouter();
  const matchState = useRouterState({
    select: (s) => {
      const match = s.matches.find((d) => d.id === matchId);
      invariant(match);
      return {
        routeId: match.routeId,
        ssr: match.ssr,
        _displayPending: match._displayPending,
      };
    },
    structuralSharing: true,
  });
  const route = router.routesById[matchState.routeId];
  const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent
    ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {})
    : null;
  const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
  const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
  const routeNotFoundComponent = route.isRoot
    ? // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
      (route.options.notFoundComponent ??
      ((_a2 = router.options.notFoundRoute) == null ? void 0 : _a2.options.component))
    : route.options.notFoundComponent;
  const resolvedNoSsr = matchState.ssr === false || matchState.ssr === "data-only";
  const ResolvedSuspenseBoundary =
    // If we're on the root route, allow forcefully wrapping in suspense
    (!route.isRoot || route.options.wrapInSuspense || resolvedNoSsr) &&
    (route.options.wrapInSuspense ??
      PendingComponent ??
      (((_b2 = route.options.errorComponent) == null ? void 0 : _b2.preload) || resolvedNoSsr))
      ? reactExports.Suspense
      : SafeFragment;
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
  const resetKey = useRouterState({
    select: (s) => s.loadedAt,
  });
  const parentRouteId = useRouterState({
    select: (s) => {
      var _a3;
      const index = s.matches.findIndex((d) => d.id === matchId);
      return (_a3 = s.matches[index - 1]) == null ? void 0 : _a3.routeId;
    },
  });
  const ShellComponent = route.isRoot
    ? (route.options.shellComponent ?? SafeFragment)
    : SafeFragment;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ShellComponent, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, {
        value: matchId,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolvedSuspenseBoundary, {
          fallback: pendingElement,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolvedCatchBoundary, {
            getResetKey: () => resetKey,
            errorComponent: routeErrorComponent || ErrorComponent,
            onCatch: (error, errorInfo) => {
              if (isNotFound(error)) throw error;
              routeOnCatch == null ? void 0 : routeOnCatch(error, errorInfo);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolvedNotFoundBoundary, {
              fallback: (error) => {
                if (
                  !routeNotFoundComponent ||
                  (error.routeId && error.routeId !== matchState.routeId) ||
                  (!error.routeId && !route.isRoot)
                )
                  throw error;
                return reactExports.createElement(routeNotFoundComponent, error);
              },
              children:
                resolvedNoSsr || matchState._displayPending
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClientOnly, {
                      fallback: pendingElement,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId }),
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId }),
            }),
          }),
        }),
      }),
      parentRouteId === rootRouteId && router.options.scrollRestoration
        ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(OnRendered, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollRestoration, {}),
            ],
          })
        : null,
    ],
  });
});
function OnRendered() {
  const router = useRouter();
  const prevLocationRef = reactExports.useRef(void 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "script",
    {
      suppressHydrationWarning: true,
      ref: (el) => {
        if (
          el &&
          (prevLocationRef.current === void 0 ||
            prevLocationRef.current.href !== router.latestLocation.href)
        ) {
          router.emit({
            type: "onRendered",
            ...getLocationChangeInfo(router.state),
          });
          prevLocationRef.current = router.latestLocation;
        }
      },
    },
    router.latestLocation.state.__TSR_key,
  );
}
const MatchInner = reactExports.memo(function MatchInnerImpl({ matchId }) {
  var _a2, _b2, _c, _d;
  const router = useRouter();
  const { match, key, routeId } = useRouterState({
    select: (s) => {
      const match2 = s.matches.find((d) => d.id === matchId);
      const routeId2 = match2.routeId;
      const remountFn =
        router.routesById[routeId2].options.remountDeps ?? router.options.defaultRemountDeps;
      const remountDeps =
        remountFn == null
          ? void 0
          : remountFn({
              routeId: routeId2,
              loaderDeps: match2.loaderDeps,
              params: match2._strictParams,
              search: match2._strictSearch,
            });
      const key2 = remountDeps ? JSON.stringify(remountDeps) : void 0;
      return {
        key: key2,
        routeId: routeId2,
        match: {
          id: match2.id,
          status: match2.status,
          error: match2.error,
          invalid: match2.invalid,
          _forcePending: match2._forcePending,
          _displayPending: match2._displayPending,
        },
      };
    },
    structuralSharing: true,
  });
  const route = router.routesById[routeId];
  const out = reactExports.useMemo(() => {
    const Comp = route.options.component ?? router.options.defaultComponent;
    if (Comp) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {}, key);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }, [key, route.options.component, router.options.defaultComponent]);
  if (match._displayPending) {
    throw (_a2 = router.getMatch(match.id)) == null
      ? void 0
      : _a2._nonReactive.displayPendingPromise;
  }
  if (match._forcePending) {
    throw (_b2 = router.getMatch(match.id)) == null ? void 0 : _b2._nonReactive.minPendingPromise;
  }
  if (match.status === "pending") {
    const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
    if (pendingMinMs) {
      const routerMatch = router.getMatch(match.id);
      if (routerMatch && !routerMatch._nonReactive.minPendingPromise) {
        if (!router.isServer) {
          const minPendingPromise = createControlledPromise();
          routerMatch._nonReactive.minPendingPromise = minPendingPromise;
          setTimeout(() => {
            minPendingPromise.resolve();
            routerMatch._nonReactive.minPendingPromise = void 0;
          }, pendingMinMs);
        }
      }
    }
    throw (_c = router.getMatch(match.id)) == null ? void 0 : _c._nonReactive.loadPromise;
  }
  if (match.status === "notFound") {
    invariant(isNotFound(match.error));
    return renderRouteNotFound(router, route, match.error);
  }
  if (match.status === "redirected") {
    invariant(isRedirect(match.error));
    throw (_d = router.getMatch(match.id)) == null ? void 0 : _d._nonReactive.loadPromise;
  }
  if (match.status === "error") {
    if (router.isServer) {
      const RouteErrorComponent =
        (route.options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(RouteErrorComponent, {
        error: match.error,
        reset: void 0,
        info: {
          componentStack: "",
        },
      });
    }
    throw match.error;
  }
  return out;
});
const Outlet = reactExports.memo(function OutletImpl() {
  const router = useRouter();
  const matchId = reactExports.useContext(matchContext);
  const routeId = useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a2.routeId;
    },
  });
  const route = router.routesById[routeId];
  const parentGlobalNotFound = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const parentMatch = matches.find((d) => d.id === matchId);
      invariant(parentMatch);
      return parentMatch.globalNotFound;
    },
  });
  const childMatchId = useRouterState({
    select: (s) => {
      var _a2;
      const matches = s.matches;
      const index = matches.findIndex((d) => d.id === matchId);
      return (_a2 = matches[index + 1]) == null ? void 0 : _a2.id;
    },
  });
  const pendingElement = router.options.defaultPendingComponent
    ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultPendingComponent, {})
    : null;
  if (parentGlobalNotFound) {
    return renderRouteNotFound(router, route, void 0);
  }
  if (!childMatchId) {
    return null;
  }
  const nextMatch = /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId: childMatchId });
  if (routeId === rootRouteId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
      fallback: pendingElement,
      children: nextMatch,
    });
  }
  return nextMatch;
});
function Matches() {
  const router = useRouter();
  const rootRoute = router.routesById[rootRouteId];
  const PendingComponent =
    rootRoute.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent
    ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {})
    : null;
  const ResolvedSuspense =
    router.isServer || (typeof document !== "undefined" && router.ssr)
      ? SafeFragment
      : reactExports.Suspense;
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(ResolvedSuspense, {
    fallback: pendingElement,
    children: [
      !router.isServer && /* @__PURE__ */ jsxRuntimeExports.jsx(Transitioner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MatchesInner, {}),
    ],
  });
  return router.options.InnerWrap
    ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.InnerWrap, { children: inner })
    : inner;
}
function MatchesInner() {
  const router = useRouter();
  const matchId = useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches[0]) == null ? void 0 : _a2.id;
    },
  });
  const resetKey = useRouterState({
    select: (s) => s.loadedAt,
  });
  const matchComponent = matchId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, {
    value: matchId,
    children: router.options.disableGlobalCatchBoundary
      ? matchComponent
      : /* @__PURE__ */ jsxRuntimeExports.jsx(CatchBoundary, {
          getResetKey: () => resetKey,
          errorComponent: ErrorComponent,
          onCatch: (error) => {
            warning(false, error.message || error.toString());
          },
          children: matchComponent,
        }),
  });
}
function RouterContextProvider({ router, children, ...rest }) {
  if (Object.keys(rest).length > 0) {
    router.update({
      ...router.options,
      ...rest,
      context: {
        ...router.options.context,
        ...rest.context,
      },
    });
  }
  const routerContext2 = getRouterContext();
  const provider = /* @__PURE__ */ jsxRuntimeExports.jsx(routerContext2.Provider, {
    value: router,
    children,
  });
  if (router.options.Wrap) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterContextProvider, {
    router,
    ...rest,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Matches, {}),
  });
}
function StartServer(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router: props.router });
}
function splitSetCookieString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c2) => splitSetCookieString(c2));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
const minifiedTsrBootStrapScript =
  "self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};\n";
const SCOPE_ID = "tsr";
function dehydrateMatch(match) {
  const dehydratedMatch = {
    i: match.id,
    u: match.updatedAt,
    s: match.status,
  };
  const properties = [
    ["__beforeLoadContext", "b"],
    ["loaderData", "l"],
    ["error", "e"],
    ["ssr", "ssr"],
  ];
  for (const [key, shorthand] of properties) {
    if (match[key] !== void 0) {
      dehydratedMatch[shorthand] = match[key];
    }
  }
  return dehydratedMatch;
}
const INITIAL_SCRIPTS = [ln(SCOPE_ID), minifiedTsrBootStrapScript];
class ScriptBuffer {
  constructor(router) {
    this._scriptBarrierLifted = false;
    this._cleanedUp = false;
    this._pendingMicrotask = false;
    this.router = router;
    this._queue = INITIAL_SCRIPTS.slice();
  }
  enqueue(script) {
    if (this._cleanedUp) return;
    this._queue.push(script);
    if (this._scriptBarrierLifted && !this._pendingMicrotask) {
      this._pendingMicrotask = true;
      queueMicrotask(() => {
        this._pendingMicrotask = false;
        this.injectBufferedScripts();
      });
    }
  }
  liftBarrier() {
    if (this._scriptBarrierLifted || this._cleanedUp) return;
    this._scriptBarrierLifted = true;
    if (this._queue.length > 0 && !this._pendingMicrotask) {
      this._pendingMicrotask = true;
      queueMicrotask(() => {
        this._pendingMicrotask = false;
        this.injectBufferedScripts();
      });
    }
  }
  /**
   * Flushes any pending scripts synchronously.
   * Call this before emitting onSerializationFinished to ensure all scripts are injected.
   *
   * IMPORTANT: Only injects if the barrier has been lifted. Before the barrier is lifted,
   * scripts should remain in the queue so takeBufferedScripts() can retrieve them
   */
  flush() {
    var _a2;
    if (!this._scriptBarrierLifted) return;
    if (this._cleanedUp) return;
    this._pendingMicrotask = false;
    const scriptsToInject = this.takeAll();
    if (scriptsToInject && ((_a2 = this.router) == null ? void 0 : _a2.serverSsr)) {
      this.router.serverSsr.injectScript(scriptsToInject);
    }
  }
  takeAll() {
    const bufferedScripts = this._queue;
    this._queue = [];
    if (bufferedScripts.length === 0) {
      return void 0;
    }
    return bufferedScripts.join(";") + ";document.currentScript.remove()";
  }
  injectBufferedScripts() {
    var _a2;
    if (this._cleanedUp) return;
    if (this._queue.length === 0) return;
    const scriptsToInject = this.takeAll();
    if (scriptsToInject && ((_a2 = this.router) == null ? void 0 : _a2.serverSsr)) {
      this.router.serverSsr.injectScript(scriptsToInject);
    }
  }
  cleanup() {
    this._cleanedUp = true;
    this._queue = [];
    this.router = void 0;
  }
}
function attachRouterServerSsrUtils({ router, manifest: manifest2 }) {
  router.ssr = {
    manifest: manifest2,
  };
  let _dehydrated = false;
  let _serializationFinished = false;
  const renderFinishedListeners = [];
  const serializationFinishedListeners = [];
  const scriptBuffer = new ScriptBuffer(router);
  let injectedHtmlBuffer = [];
  router.serverSsr = {
    injectHtml: (html) => {
      if (!html) return;
      injectedHtmlBuffer.push(html);
      router.emit({
        type: "onInjectedHtml",
      });
    },
    injectScript: (script) => {
      var _a2;
      if (!script) return;
      const html = `<script${((_a2 = router.options.ssr) == null ? void 0 : _a2.nonce) ? ` nonce='${router.options.ssr.nonce}'` : ""}>${script}<\/script>`;
      router.serverSsr.injectHtml(html);
    },
    dehydrate: async () => {
      var _a2, _b2, _c;
      invariant(!_dehydrated);
      let matchesToDehydrate = router.state.matches;
      if (router.isShell()) {
        matchesToDehydrate = matchesToDehydrate.slice(0, 1);
      }
      const matches = matchesToDehydrate.map(dehydrateMatch);
      let manifestToDehydrate = void 0;
      if (manifest2) {
        const currentRouteIds = new Set(router.state.matches.map((k2) => k2.routeId));
        const filteredRoutes = Object.fromEntries(
          Object.entries(manifest2.routes).flatMap(([routeId, routeManifest]) => {
            if (currentRouteIds.has(routeId)) {
              return [[routeId, routeManifest]];
            } else if (routeManifest.assets && routeManifest.assets.length > 0) {
              return [
                [
                  routeId,
                  {
                    assets: routeManifest.assets,
                  },
                ],
              ];
            }
            return [];
          }),
        );
        manifestToDehydrate = {
          routes: filteredRoutes,
        };
      }
      const dehydratedRouter = {
        manifest: manifestToDehydrate,
        matches,
      };
      const lastMatchId =
        (_a2 = matchesToDehydrate[matchesToDehydrate.length - 1]) == null ? void 0 : _a2.id;
      if (lastMatchId) {
        dehydratedRouter.lastMatchId = lastMatchId;
      }
      const dehydratedData = await ((_c = (_b2 = router.options).dehydrate) == null
        ? void 0
        : _c.call(_b2));
      if (dehydratedData) {
        dehydratedRouter.dehydratedData = dehydratedData;
      }
      _dehydrated = true;
      const trackPlugins = { didRun: false };
      const serializationAdapters = router.options.serializationAdapters;
      const plugins = serializationAdapters
        ? serializationAdapters
            .map((t) => makeSsrSerovalPlugin(t, trackPlugins))
            .concat(defaultSerovalPlugins)
        : defaultSerovalPlugins;
      const signalSerializationComplete = () => {
        _serializationFinished = true;
        try {
          serializationFinishedListeners.forEach((l) => l());
          router.emit({ type: "onSerializationFinished" });
        } catch (err) {
          console.error("Serialization listener error:", err);
        } finally {
          serializationFinishedListeners.length = 0;
          renderFinishedListeners.length = 0;
        }
      };
      an(dehydratedRouter, {
        refs: /* @__PURE__ */ new Map(),
        plugins,
        onSerialize: (data, initial) => {
          let serialized = initial ? GLOBAL_TSR + ".router=" + data : data;
          if (trackPlugins.didRun) {
            serialized = GLOBAL_TSR + ".p(()=>" + serialized + ")";
          }
          scriptBuffer.enqueue(serialized);
        },
        scopeId: SCOPE_ID,
        onDone: () => {
          scriptBuffer.enqueue(GLOBAL_TSR + ".e()");
          scriptBuffer.flush();
          signalSerializationComplete();
        },
        onError: (err) => {
          console.error("Serialization error:", err);
          signalSerializationComplete();
        },
      });
    },
    isDehydrated() {
      return _dehydrated;
    },
    isSerializationFinished() {
      return _serializationFinished;
    },
    onRenderFinished: (listener) => renderFinishedListeners.push(listener),
    onSerializationFinished: (listener) => serializationFinishedListeners.push(listener),
    setRenderFinished: () => {
      try {
        renderFinishedListeners.forEach((l) => l());
      } catch (err) {
        console.error("Error in render finished listener:", err);
      } finally {
        renderFinishedListeners.length = 0;
      }
      scriptBuffer.liftBarrier();
    },
    takeBufferedScripts() {
      var _a2;
      const scripts = scriptBuffer.takeAll();
      const serverBufferedScript = {
        tag: "script",
        attrs: {
          nonce: (_a2 = router.options.ssr) == null ? void 0 : _a2.nonce,
          className: "$tsr",
          id: TSR_SCRIPT_BARRIER_ID,
        },
        children: scripts,
      };
      return serverBufferedScript;
    },
    liftScriptBarrier() {
      scriptBuffer.liftBarrier();
    },
    takeBufferedHtml() {
      if (injectedHtmlBuffer.length === 0) {
        return void 0;
      }
      const buffered = injectedHtmlBuffer.join("");
      injectedHtmlBuffer = [];
      return buffered;
    },
    cleanup() {
      if (!router.serverSsr) return;
      renderFinishedListeners.length = 0;
      serializationFinishedListeners.length = 0;
      injectedHtmlBuffer = [];
      scriptBuffer.cleanup();
      router.serverSsr = void 0;
    },
  };
}
function getOrigin(request) {
  try {
    return new URL(request.url).origin;
  } catch {}
  return "http://localhost";
}
function getNormalizedURL(url, base) {
  if (typeof url === "string") url = url.replace("\\", "%5C");
  const rawUrl = new URL(url, base);
  const decodedPathname = decodePath(rawUrl.pathname);
  const searchParams = new URLSearchParams(rawUrl.search);
  const normalizedHref =
    decodedPathname + (searchParams.size > 0 ? "?" : "") + searchParams.toString() + rawUrl.hash;
  return new URL(normalizedHref, rawUrl.origin);
}
function defineHandlerCallback(handler) {
  return handler;
}
function transformReadableStreamWithRouter(router, routerStream) {
  return transformStreamWithRouter(router, routerStream);
}
function transformPipeableStreamWithRouter(router, routerStream) {
  return Readable.fromWeb(transformStreamWithRouter(router, Readable.toWeb(routerStream)));
}
const BODY_END_TAG = "</body>";
const HTML_END_TAG = "</html>";
const MIN_CLOSING_TAG_LENGTH = 4;
const DEFAULT_SERIALIZATION_TIMEOUT_MS = 6e4;
const DEFAULT_LIFETIME_TIMEOUT_MS = 6e4;
const textEncoder$2 = new TextEncoder();
function findLastClosingTagEnd(str) {
  const len = str.length;
  if (len < MIN_CLOSING_TAG_LENGTH) return -1;
  let i = len - 1;
  while (i >= MIN_CLOSING_TAG_LENGTH - 1) {
    if (str.charCodeAt(i) === 62) {
      let j2 = i - 1;
      while (j2 >= 1) {
        const code = str.charCodeAt(j2);
        if (
          (code >= 97 && code <= 122) || // a-z
          (code >= 65 && code <= 90) || // A-Z
          (code >= 48 && code <= 57) || // 0-9
          code === 95 || // _
          code === 58 || // :
          code === 46 || // .
          code === 45
        ) {
          j2--;
        } else {
          break;
        }
      }
      const tagNameStart = j2 + 1;
      if (tagNameStart < i) {
        const startCode = str.charCodeAt(tagNameStart);
        if ((startCode >= 97 && startCode <= 122) || (startCode >= 65 && startCode <= 90)) {
          if (j2 >= 1 && str.charCodeAt(j2) === 47 && str.charCodeAt(j2 - 1) === 60) {
            return i + 1;
          }
        }
      }
    }
    i--;
  }
  return -1;
}
function transformStreamWithRouter(router, appStream, opts) {
  var _a2, _b2;
  let stopListeningToInjectedHtml;
  let stopListeningToSerializationFinished;
  let serializationTimeoutHandle;
  let lifetimeTimeoutHandle;
  let cleanedUp = false;
  let controller;
  let isStreamClosed = false;
  const serializationAlreadyFinished =
    ((_a2 = router.serverSsr) == null ? void 0 : _a2.isSerializationFinished()) ?? false;
  function cleanup() {
    var _a3;
    if (cleanedUp) return;
    cleanedUp = true;
    try {
      stopListeningToInjectedHtml == null ? void 0 : stopListeningToInjectedHtml();
      stopListeningToSerializationFinished == null
        ? void 0
        : stopListeningToSerializationFinished();
    } catch (e) {}
    stopListeningToInjectedHtml = void 0;
    stopListeningToSerializationFinished = void 0;
    if (serializationTimeoutHandle !== void 0) {
      clearTimeout(serializationTimeoutHandle);
      serializationTimeoutHandle = void 0;
    }
    if (lifetimeTimeoutHandle !== void 0) {
      clearTimeout(lifetimeTimeoutHandle);
      lifetimeTimeoutHandle = void 0;
    }
    pendingRouterHtmlParts = [];
    leftover = "";
    pendingClosingTags = "";
    (_a3 = router.serverSsr) == null ? void 0 : _a3.cleanup();
  }
  const textDecoder = new TextDecoder();
  function safeEnqueue(chunk) {
    if (isStreamClosed) return;
    if (typeof chunk === "string") {
      controller.enqueue(textEncoder$2.encode(chunk));
    } else {
      controller.enqueue(chunk);
    }
  }
  function safeClose() {
    if (isStreamClosed) return;
    isStreamClosed = true;
    try {
      controller.close();
    } catch {}
  }
  function safeError(error) {
    if (isStreamClosed) return;
    isStreamClosed = true;
    try {
      controller.error(error);
    } catch {}
  }
  const stream = new ReadableStream$1({
    start(c2) {
      controller = c2;
    },
    cancel() {
      isStreamClosed = true;
      cleanup();
    },
  });
  let isAppRendering = true;
  let streamBarrierLifted = false;
  let leftover = "";
  let pendingClosingTags = "";
  let serializationFinished = serializationAlreadyFinished;
  let pendingRouterHtmlParts = [];
  const bufferedHtml = (_b2 = router.serverSsr) == null ? void 0 : _b2.takeBufferedHtml();
  if (bufferedHtml) {
    pendingRouterHtmlParts.push(bufferedHtml);
  }
  function flushPendingRouterHtml() {
    if (pendingRouterHtmlParts.length > 0) {
      safeEnqueue(pendingRouterHtmlParts.join(""));
      pendingRouterHtmlParts = [];
    }
  }
  function tryFinish() {
    if (isAppRendering || !serializationFinished) return;
    if (cleanedUp || isStreamClosed) return;
    if (serializationTimeoutHandle !== void 0) {
      clearTimeout(serializationTimeoutHandle);
      serializationTimeoutHandle = void 0;
    }
    const decoderRemainder = textDecoder.decode();
    if (leftover) safeEnqueue(leftover);
    if (decoderRemainder) safeEnqueue(decoderRemainder);
    flushPendingRouterHtml();
    if (pendingClosingTags) safeEnqueue(pendingClosingTags);
    safeClose();
    cleanup();
  }
  const lifetimeMs = DEFAULT_LIFETIME_TIMEOUT_MS;
  lifetimeTimeoutHandle = setTimeout(() => {
    if (!cleanedUp && !isStreamClosed) {
      console.warn(
        `SSR stream transform exceeded maximum lifetime (${lifetimeMs}ms), forcing cleanup`,
      );
      safeError(new Error("Stream lifetime exceeded"));
      cleanup();
    }
  }, lifetimeMs);
  if (!serializationAlreadyFinished) {
    stopListeningToInjectedHtml = router.subscribe("onInjectedHtml", () => {
      var _a3;
      if (cleanedUp || isStreamClosed) return;
      const html = (_a3 = router.serverSsr) == null ? void 0 : _a3.takeBufferedHtml();
      if (!html) return;
      if (isAppRendering) {
        pendingRouterHtmlParts.push(html);
      } else {
        safeEnqueue(html);
      }
    });
    stopListeningToSerializationFinished = router.subscribe("onSerializationFinished", () => {
      serializationFinished = true;
      tryFinish();
    });
  }
  (async () => {
    var _a3, _b3, _c;
    const reader = appStream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (cleanedUp || isStreamClosed) return;
        const text =
          value instanceof Uint8Array ? textDecoder.decode(value, { stream: true }) : String(value);
        const chunkString = leftover + text;
        if (!streamBarrierLifted) {
          if (chunkString.includes(TSR_SCRIPT_BARRIER_ID)) {
            streamBarrierLifted = true;
            (_a3 = router.serverSsr) == null ? void 0 : _a3.liftScriptBarrier();
          }
        }
        const bodyEndIndex = chunkString.indexOf(BODY_END_TAG);
        const htmlEndIndex = chunkString.indexOf(HTML_END_TAG);
        if (bodyEndIndex !== -1 && htmlEndIndex !== -1 && bodyEndIndex < htmlEndIndex) {
          pendingClosingTags = chunkString.slice(bodyEndIndex);
          safeEnqueue(chunkString.slice(0, bodyEndIndex));
          flushPendingRouterHtml();
          leftover = "";
          continue;
        }
        const lastClosingTagEnd = findLastClosingTagEnd(chunkString);
        if (lastClosingTagEnd > 0) {
          safeEnqueue(chunkString.slice(0, lastClosingTagEnd));
          flushPendingRouterHtml();
          leftover = chunkString.slice(lastClosingTagEnd);
        } else {
          leftover = chunkString;
        }
      }
      if (cleanedUp || isStreamClosed) return;
      isAppRendering = false;
      (_b3 = router.serverSsr) == null ? void 0 : _b3.setRenderFinished();
      if (serializationFinished) {
        tryFinish();
      } else {
        const timeoutMs =
          (opts == null ? void 0 : opts.timeoutMs) ?? DEFAULT_SERIALIZATION_TIMEOUT_MS;
        serializationTimeoutHandle = setTimeout(() => {
          if (!cleanedUp && !isStreamClosed) {
            console.error("Serialization timeout after app render finished");
            safeError(new Error("Serialization timeout after app render finished"));
            cleanup();
          }
        }, timeoutMs);
      }
    } catch (error) {
      if (cleanedUp) return;
      console.error("Error reading appStream:", error);
      isAppRendering = false;
      (_c = router.serverSsr) == null ? void 0 : _c.setRenderFinished();
      safeError(error);
      cleanup();
    } finally {
      reader.releaseLock();
    }
  })().catch((error) => {
    if (cleanedUp) return;
    console.error("Error in stream transform:", error);
    safeError(error);
    cleanup();
  });
  return stream;
}
var server_node = {};
var reactDomServerLegacy_node_production = {};
/**
 * @license React
 * react-dom-server-legacy.node.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDomServerLegacy_node_production;
function requireReactDomServerLegacy_node_production() {
  if (hasRequiredReactDomServerLegacy_node_production) return reactDomServerLegacy_node_production;
  hasRequiredReactDomServerLegacy_node_production = 1;
  var React2 = requireReact(),
    ReactDOM = requireReactDom(),
    REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
    REACT_PORTAL_TYPE = Symbol.for("react.portal"),
    REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
    REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
    REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
    REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
    REACT_CONTEXT_TYPE = Symbol.for("react.context"),
    REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
    REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
    REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
    REACT_MEMO_TYPE = Symbol.for("react.memo"),
    REACT_LAZY_TYPE = Symbol.for("react.lazy"),
    REACT_SCOPE_TYPE = Symbol.for("react.scope"),
    REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
    REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden"),
    REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
    REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"),
    MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable =
      (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
      maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var isArrayImpl = Array.isArray;
  function murmurhash3_32_gc(key, seed) {
    var remainder = key.length & 3;
    var bytes = key.length - remainder;
    var h1 = seed;
    for (seed = 0; seed < bytes; ) {
      var k1 =
        (key.charCodeAt(seed) & 255) |
        ((key.charCodeAt(++seed) & 255) << 8) |
        ((key.charCodeAt(++seed) & 255) << 16) |
        ((key.charCodeAt(++seed) & 255) << 24);
      ++seed;
      k1 = (3432918353 * (k1 & 65535) + (((3432918353 * (k1 >>> 16)) & 65535) << 16)) & 4294967295;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (461845907 * (k1 & 65535) + (((461845907 * (k1 >>> 16)) & 65535) << 16)) & 4294967295;
      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1 = (5 * (h1 & 65535) + (((5 * (h1 >>> 16)) & 65535) << 16)) & 4294967295;
      h1 = (h1 & 65535) + 27492 + ((((h1 >>> 16) + 58964) & 65535) << 16);
    }
    k1 = 0;
    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
      case 2:
        k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
      case 1:
        ((k1 ^= key.charCodeAt(seed) & 255),
          (k1 =
            (3432918353 * (k1 & 65535) + (((3432918353 * (k1 >>> 16)) & 65535) << 16)) &
            4294967295),
          (k1 = (k1 << 15) | (k1 >>> 17)),
          (h1 ^=
            (461845907 * (k1 & 65535) + (((461845907 * (k1 >>> 16)) & 65535) << 16)) & 4294967295));
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (2246822507 * (h1 & 65535) + (((2246822507 * (h1 >>> 16)) & 65535) << 16)) & 4294967295;
    h1 ^= h1 >>> 13;
    h1 = (3266489909 * (h1 & 65535) + (((3266489909 * (h1 >>> 16)) & 65535) << 16)) & 4294967295;
    return (h1 ^ (h1 >>> 16)) >>> 0;
  }
  var assign = Object.assign,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    illegalAttributeNameCache = {},
    validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return (validatedAttributeNameCache[attributeName] = true);
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " ",
      ),
    ),
    aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    matchHtmlRegExp = /["'&<>]/;
  function escapeTextForBrowser(text) {
    if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
      return "" + text;
    text = "" + text;
    var match = matchHtmlRegExp.exec(text);
    if (match) {
      var html = "",
        index,
        lastIndex = 0;
      for (index = match.index; index < text.length; index++) {
        switch (text.charCodeAt(index)) {
          case 34:
            match = "&quot;";
            break;
          case 38:
            match = "&amp;";
            break;
          case 39:
            match = "&#x27;";
            break;
          case 60:
            match = "&lt;";
            break;
          case 62:
            match = "&gt;";
            break;
          default:
            continue;
        }
        lastIndex !== index && (html += text.slice(lastIndex, index));
        lastIndex = index + 1;
        html += match;
      }
      text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
    }
    return text;
  }
  var uppercasePattern = /([A-Z])/g,
    msPattern = /^ms-/,
    isJavaScriptProtocol =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : url;
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null,
    },
    previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: previousDispatcher.f,
    r: previousDispatcher.r,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript,
  };
  var PRELOAD_NO_CREDS = [],
    currentlyFlushingRenderState = null,
    scriptRegex = /(<\/|<)(s)(cript)/gi;
  function scriptReplacer(match, prefix3, s, suffix2) {
    return "" + prefix3 + ("s" === s ? "\\u0073" : "\\u0053") + suffix2;
  }
  function createResumableState(
    identifierPrefix,
    externalRuntimeConfig,
    bootstrapScriptContent,
    bootstrapScripts,
    bootstrapModules,
  ) {
    return {
      idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
      nextFormID: 0,
      streamingFormat: 0,
      bootstrapScriptContent,
      bootstrapScripts,
      bootstrapModules,
      instructions: 0,
      hasBody: false,
      hasHtml: false,
      unknownResources: {},
      dnsResources: {},
      connectResources: { default: {}, anonymous: {}, credentials: {} },
      imageResources: {},
      styleResources: {},
      scriptResources: {},
      moduleUnknownResources: {},
      moduleScriptResources: {},
    };
  }
  function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
    return {
      insertionMode,
      selectedValue,
      tagScope,
      viewTransition,
    };
  }
  function getChildFormatContext(parentContext, type, props) {
    var subtreeScope = parentContext.tagScope & -25;
    switch (type) {
      case "noscript":
        return createFormatContext(2, null, subtreeScope | 1, null);
      case "select":
        return createFormatContext(
          2,
          null != props.value ? props.value : props.defaultValue,
          subtreeScope,
          null,
        );
      case "svg":
        return createFormatContext(4, null, subtreeScope, null);
      case "picture":
        return createFormatContext(2, null, subtreeScope | 2, null);
      case "math":
        return createFormatContext(5, null, subtreeScope, null);
      case "foreignObject":
        return createFormatContext(2, null, subtreeScope, null);
      case "table":
        return createFormatContext(6, null, subtreeScope, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return createFormatContext(7, null, subtreeScope, null);
      case "colgroup":
        return createFormatContext(9, null, subtreeScope, null);
      case "tr":
        return createFormatContext(8, null, subtreeScope, null);
      case "head":
        if (2 > parentContext.insertionMode)
          return createFormatContext(3, null, subtreeScope, null);
        break;
      case "html":
        if (0 === parentContext.insertionMode)
          return createFormatContext(1, null, subtreeScope, null);
    }
    return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode
      ? createFormatContext(2, null, subtreeScope, null)
      : parentContext.tagScope !== subtreeScope
        ? createFormatContext(
            parentContext.insertionMode,
            parentContext.selectedValue,
            subtreeScope,
            null,
          )
        : parentContext;
  }
  function getSuspenseViewTransition(parentViewTransition) {
    return null === parentViewTransition
      ? null
      : {
          update: parentViewTransition.update,
          enter: "none",
          exit: "none",
          share: parentViewTransition.update,
          name: parentViewTransition.autoName,
          autoName: parentViewTransition.autoName,
          nameIdx: 0,
        };
  }
  function getSuspenseFallbackFormatContext(resumableState, parentContext) {
    parentContext.tagScope & 32 && (resumableState.instructions |= 128);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      parentContext.tagScope | 12,
      getSuspenseViewTransition(parentContext.viewTransition),
    );
  }
  function getSuspenseContentFormatContext(resumableState, parentContext) {
    resumableState = getSuspenseViewTransition(parentContext.viewTransition);
    var subtreeScope = parentContext.tagScope | 16;
    null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      subtreeScope,
      resumableState,
    );
  }
  var styleNameCache = /* @__PURE__ */ new Map();
  function pushStyleAttribute(target, style) {
    if ("object" !== typeof style)
      throw Error(
        "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.",
      );
    var isFirst = true,
      styleName;
    for (styleName in style)
      if (hasOwnProperty.call(style, styleName)) {
        var styleValue = style[styleName];
        if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
          if (0 === styleName.indexOf("--")) {
            var nameChunk = escapeTextForBrowser(styleName);
            styleValue = escapeTextForBrowser(("" + styleValue).trim());
          } else
            ((nameChunk = styleNameCache.get(styleName)),
              void 0 === nameChunk &&
                ((nameChunk = escapeTextForBrowser(
                  styleName
                    .replace(uppercasePattern, "-$1")
                    .toLowerCase()
                    .replace(msPattern, "-ms-"),
                )),
                styleNameCache.set(styleName, nameChunk)),
              (styleValue =
                "number" === typeof styleValue
                  ? 0 === styleValue || unitlessNumbers.has(styleName)
                    ? "" + styleValue
                    : styleValue + "px"
                  : escapeTextForBrowser(("" + styleValue).trim())));
          isFirst
            ? ((isFirst = false), target.push(' style="', nameChunk, ":", styleValue))
            : target.push(";", nameChunk, ":", styleValue);
        }
      }
    isFirst || target.push('"');
  }
  function pushBooleanAttribute(target, name, value) {
    value &&
      "function" !== typeof value &&
      "symbol" !== typeof value &&
      target.push(" ", name, '=""');
  }
  function pushStringAttribute(target, name, value) {
    "function" !== typeof value &&
      "symbol" !== typeof value &&
      "boolean" !== typeof value &&
      target.push(" ", name, '="', escapeTextForBrowser(value), '"');
  }
  var actionJavaScriptURL = escapeTextForBrowser(
    "javascript:throw new Error('React form unexpectedly submitted.')",
  );
  function pushAdditionalFormField(value, key) {
    this.push('<input type="hidden"');
    validateAdditionalFormField(value);
    pushStringAttribute(this, "name", key);
    pushStringAttribute(this, "value", value);
    this.push("/>");
  }
  function validateAdditionalFormField(value) {
    if ("string" !== typeof value)
      throw Error(
        "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration.",
      );
  }
  function getCustomFormFields(resumableState, formAction) {
    if ("function" === typeof formAction.$$FORM_ACTION) {
      var id = resumableState.nextFormID++;
      resumableState = resumableState.idPrefix + id;
      try {
        var customFields = formAction.$$FORM_ACTION(resumableState);
        if (customFields) {
          var formData = customFields.data;
          null != formData && formData.forEach(validateAdditionalFormField);
        }
        return customFields;
      } catch (x2) {
        if ("object" === typeof x2 && null !== x2 && "function" === typeof x2.then) throw x2;
      }
    }
    return null;
  }
  function pushFormActionAttribute(
    target,
    resumableState,
    renderState,
    formAction,
    formEncType,
    formMethod,
    formTarget,
    name,
  ) {
    var formData = null;
    if ("function" === typeof formAction) {
      var customFields = getCustomFormFields(resumableState, formAction);
      null !== customFields
        ? ((name = customFields.name),
          (formAction = customFields.action || ""),
          (formEncType = customFields.encType),
          (formMethod = customFields.method),
          (formTarget = customFields.target),
          (formData = customFields.data))
        : (target.push(" ", "formAction", '="', actionJavaScriptURL, '"'),
          (formTarget = formMethod = formEncType = formAction = name = null),
          injectFormReplayingRuntime(resumableState, renderState));
    }
    null != name && pushAttribute(target, "name", name);
    null != formAction && pushAttribute(target, "formAction", formAction);
    null != formEncType && pushAttribute(target, "formEncType", formEncType);
    null != formMethod && pushAttribute(target, "formMethod", formMethod);
    null != formTarget && pushAttribute(target, "formTarget", formTarget);
    return formData;
  }
  function pushAttribute(target, name, value) {
    switch (name) {
      case "className":
        pushStringAttribute(target, "class", value);
        break;
      case "tabIndex":
        pushStringAttribute(target, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        pushStringAttribute(target, name, value);
        break;
      case "style":
        pushStyleAttribute(target, value);
        break;
      case "src":
      case "href":
        if ("" === value) break;
      case "action":
      case "formAction":
        if (
          null == value ||
          "function" === typeof value ||
          "symbol" === typeof value ||
          "boolean" === typeof value
        )
          break;
        value = sanitizeURL("" + value);
        target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "ref":
        break;
      case "autoFocus":
      case "multiple":
      case "muted":
        pushBooleanAttribute(target, name.toLowerCase(), value);
        break;
      case "xlinkHref":
        if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
          break;
        value = sanitizeURL("" + value);
        target.push(" ", "xlink:href", '="', escapeTextForBrowser(value), '"');
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        "function" !== typeof value &&
          "symbol" !== typeof value &&
          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value &&
          "function" !== typeof value &&
          "symbol" !== typeof value &&
          target.push(" ", name, '=""');
        break;
      case "capture":
      case "download":
        true === value
          ? target.push(" ", name, '=""')
          : false !== value &&
            "function" !== typeof value &&
            "symbol" !== typeof value &&
            target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        "function" !== typeof value &&
          "symbol" !== typeof value &&
          !isNaN(value) &&
          1 <= value &&
          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "rowSpan":
      case "start":
        "function" === typeof value ||
          "symbol" === typeof value ||
          isNaN(value) ||
          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "xlinkActuate":
        pushStringAttribute(target, "xlink:actuate", value);
        break;
      case "xlinkArcrole":
        pushStringAttribute(target, "xlink:arcrole", value);
        break;
      case "xlinkRole":
        pushStringAttribute(target, "xlink:role", value);
        break;
      case "xlinkShow":
        pushStringAttribute(target, "xlink:show", value);
        break;
      case "xlinkTitle":
        pushStringAttribute(target, "xlink:title", value);
        break;
      case "xlinkType":
        pushStringAttribute(target, "xlink:type", value);
        break;
      case "xmlBase":
        pushStringAttribute(target, "xml:base", value);
        break;
      case "xmlLang":
        pushStringAttribute(target, "xml:lang", value);
        break;
      case "xmlSpace":
        pushStringAttribute(target, "xml:space", value);
        break;
      default:
        if (
          !(2 < name.length) ||
          ("o" !== name[0] && "O" !== name[0]) ||
          ("n" !== name[1] && "N" !== name[1])
        ) {
          if (((name = aliases.get(name) || name), isAttributeNameSafe(name))) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean":
                var prefix$8 = name.toLowerCase().slice(0, 5);
                if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
            }
            target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          }
        }
    }
  }
  function pushInnerHTML(target, innerHTML, children) {
    if (null != innerHTML) {
      if (null != children)
        throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
      if ("object" !== typeof innerHTML || !("__html" in innerHTML))
        throw Error(
          "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.",
        );
      innerHTML = innerHTML.__html;
      null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
    }
  }
  function flattenOptionChildren(children) {
    var content = "";
    React2.Children.forEach(children, function (child) {
      null != child && (content += child);
    });
    return content;
  }
  function injectFormReplayingRuntime(resumableState, renderState) {
    if (0 === (resumableState.instructions & 16)) {
      resumableState.instructions |= 16;
      var preamble = renderState.preamble,
        bootstrapChunks = renderState.bootstrapChunks;
      (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length
        ? (bootstrapChunks.push(renderState.startInlineScript),
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
          bootstrapChunks.push(
            ">",
            `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`,
            "<\/script>",
          ))
        : bootstrapChunks.unshift(
            renderState.startInlineScript,
            ">",
            `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`,
            "<\/script>",
          );
    }
  }
  function pushLinkImpl(target, props) {
    target.push(startChunkForTag("link"));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(
                "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
              );
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push("/>");
    return null;
  }
  var styleRegex = /(<\/|<)(s)(tyle)/gi;
  function styleReplacer(match, prefix3, s, suffix2) {
    return "" + prefix3 + ("s" === s ? "\\73 " : "\\53 ") + suffix2;
  }
  function pushSelfClosing(target, props, tag) {
    target.push(startChunkForTag(tag));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(
                tag +
                  " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
              );
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push("/>");
    return null;
  }
  function pushTitleImpl(target, props) {
    target.push(startChunkForTag("title"));
    var children = null,
      innerHTML = null,
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    props = Array.isArray(children) ? (2 > children.length ? children[0] : null) : children;
    "function" !== typeof props &&
      "symbol" !== typeof props &&
      null !== props &&
      void 0 !== props &&
      target.push(escapeTextForBrowser("" + props));
    pushInnerHTML(target, innerHTML, children);
    target.push(endChunkForTag("title"));
    return null;
  }
  function pushScriptImpl(target, props) {
    target.push(startChunkForTag("script"));
    var children = null,
      innerHTML = null,
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    pushInnerHTML(target, innerHTML, children);
    "string" === typeof children &&
      target.push(("" + children).replace(scriptRegex, scriptReplacer));
    target.push(endChunkForTag("script"));
    return null;
  }
  function pushStartSingletonElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = (tag = null),
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    pushInnerHTML(target, innerHTML, tag);
    return tag;
  }
  function pushStartGenericElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = (tag = null),
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    pushInnerHTML(target, innerHTML, tag);
    return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
  }
  var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,
    validatedTagCache = /* @__PURE__ */ new Map();
  function startChunkForTag(tag) {
    var tagStartChunk = validatedTagCache.get(tag);
    if (void 0 === tagStartChunk) {
      if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
      tagStartChunk = "<" + tag;
      validatedTagCache.set(tag, tagStartChunk);
    }
    return tagStartChunk;
  }
  function pushStartInstance(
    target$jscomp$0,
    type,
    props,
    resumableState,
    renderState,
    preambleState,
    hoistableState,
    formatContext,
    textEmbedded,
  ) {
    switch (type) {
      case "div":
      case "span":
      case "svg":
      case "path":
        break;
      case "a":
        target$jscomp$0.push(startChunkForTag("a"));
        var children = null,
          innerHTML = null,
          propKey;
        for (propKey in props)
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "href":
                  "" === propValue
                    ? pushStringAttribute(target$jscomp$0, "href", "")
                    : pushAttribute(target$jscomp$0, propKey, propValue);
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey, propValue);
              }
          }
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML, children);
        if ("string" === typeof children) {
          target$jscomp$0.push(escapeTextForBrowser(children));
          var JSCompiler_inline_result = null;
        } else JSCompiler_inline_result = children;
        return JSCompiler_inline_result;
      case "g":
      case "p":
      case "li":
        break;
      case "select":
        target$jscomp$0.push(startChunkForTag("select"));
        var children$jscomp$0 = null,
          innerHTML$jscomp$0 = null,
          propKey$jscomp$0;
        for (propKey$jscomp$0 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$0)) {
            var propValue$jscomp$0 = props[propKey$jscomp$0];
            if (null != propValue$jscomp$0)
              switch (propKey$jscomp$0) {
                case "children":
                  children$jscomp$0 = propValue$jscomp$0;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$0 = propValue$jscomp$0;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$0, propValue$jscomp$0);
              }
          }
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
        return children$jscomp$0;
      case "option":
        var selectedValue = formatContext.selectedValue;
        target$jscomp$0.push(startChunkForTag("option"));
        var children$jscomp$1 = null,
          value = null,
          selected = null,
          innerHTML$jscomp$1 = null,
          propKey$jscomp$1;
        for (propKey$jscomp$1 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$1)) {
            var propValue$jscomp$1 = props[propKey$jscomp$1];
            if (null != propValue$jscomp$1)
              switch (propKey$jscomp$1) {
                case "children":
                  children$jscomp$1 = propValue$jscomp$1;
                  break;
                case "selected":
                  selected = propValue$jscomp$1;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$1 = propValue$jscomp$1;
                  break;
                case "value":
                  value = propValue$jscomp$1;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$1, propValue$jscomp$1);
              }
          }
        if (null != selectedValue) {
          var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
          if (isArrayImpl(selectedValue))
            for (var i = 0; i < selectedValue.length; i++) {
              if ("" + selectedValue[i] === stringValue) {
                target$jscomp$0.push(' selected=""');
                break;
              }
            }
          else "" + selectedValue === stringValue && target$jscomp$0.push(' selected=""');
        } else selected && target$jscomp$0.push(' selected=""');
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
        return children$jscomp$1;
      case "textarea":
        target$jscomp$0.push(startChunkForTag("textarea"));
        var value$jscomp$0 = null,
          defaultValue = null,
          children$jscomp$2 = null,
          propKey$jscomp$2;
        for (propKey$jscomp$2 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$2)) {
            var propValue$jscomp$2 = props[propKey$jscomp$2];
            if (null != propValue$jscomp$2)
              switch (propKey$jscomp$2) {
                case "children":
                  children$jscomp$2 = propValue$jscomp$2;
                  break;
                case "value":
                  value$jscomp$0 = propValue$jscomp$2;
                  break;
                case "defaultValue":
                  defaultValue = propValue$jscomp$2;
                  break;
                case "dangerouslySetInnerHTML":
                  throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$2, propValue$jscomp$2);
              }
          }
        null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
        target$jscomp$0.push(">");
        if (null != children$jscomp$2) {
          if (null != value$jscomp$0)
            throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
          if (isArrayImpl(children$jscomp$2)) {
            if (1 < children$jscomp$2.length)
              throw Error("<textarea> can only have at most one child.");
            value$jscomp$0 = "" + children$jscomp$2[0];
          }
          value$jscomp$0 = "" + children$jscomp$2;
        }
        "string" === typeof value$jscomp$0 &&
          "\n" === value$jscomp$0[0] &&
          target$jscomp$0.push("\n");
        null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
        return null;
      case "input":
        target$jscomp$0.push(startChunkForTag("input"));
        var name = null,
          formAction = null,
          formEncType = null,
          formMethod = null,
          formTarget = null,
          value$jscomp$1 = null,
          defaultValue$jscomp$0 = null,
          checked = null,
          defaultChecked = null,
          propKey$jscomp$3;
        for (propKey$jscomp$3 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$3)) {
            var propValue$jscomp$3 = props[propKey$jscomp$3];
            if (null != propValue$jscomp$3)
              switch (propKey$jscomp$3) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
                  );
                case "name":
                  name = propValue$jscomp$3;
                  break;
                case "formAction":
                  formAction = propValue$jscomp$3;
                  break;
                case "formEncType":
                  formEncType = propValue$jscomp$3;
                  break;
                case "formMethod":
                  formMethod = propValue$jscomp$3;
                  break;
                case "formTarget":
                  formTarget = propValue$jscomp$3;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$jscomp$3;
                  break;
                case "defaultValue":
                  defaultValue$jscomp$0 = propValue$jscomp$3;
                  break;
                case "checked":
                  checked = propValue$jscomp$3;
                  break;
                case "value":
                  value$jscomp$1 = propValue$jscomp$3;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$3, propValue$jscomp$3);
              }
          }
        var formData = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction,
          formEncType,
          formMethod,
          formTarget,
          name,
        );
        null !== checked
          ? pushBooleanAttribute(target$jscomp$0, "checked", checked)
          : null !== defaultChecked &&
            pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
        null !== value$jscomp$1
          ? pushAttribute(target$jscomp$0, "value", value$jscomp$1)
          : null !== defaultValue$jscomp$0 &&
            pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
        target$jscomp$0.push("/>");
        null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
        return null;
      case "button":
        target$jscomp$0.push(startChunkForTag("button"));
        var children$jscomp$3 = null,
          innerHTML$jscomp$2 = null,
          name$jscomp$0 = null,
          formAction$jscomp$0 = null,
          formEncType$jscomp$0 = null,
          formMethod$jscomp$0 = null,
          formTarget$jscomp$0 = null,
          propKey$jscomp$4;
        for (propKey$jscomp$4 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$4)) {
            var propValue$jscomp$4 = props[propKey$jscomp$4];
            if (null != propValue$jscomp$4)
              switch (propKey$jscomp$4) {
                case "children":
                  children$jscomp$3 = propValue$jscomp$4;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$2 = propValue$jscomp$4;
                  break;
                case "name":
                  name$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formAction":
                  formAction$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formEncType":
                  formEncType$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formMethod":
                  formMethod$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formTarget":
                  formTarget$jscomp$0 = propValue$jscomp$4;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$4, propValue$jscomp$4);
              }
          }
        var formData$jscomp$0 = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction$jscomp$0,
          formEncType$jscomp$0,
          formMethod$jscomp$0,
          formTarget$jscomp$0,
          name$jscomp$0,
        );
        target$jscomp$0.push(">");
        null != formData$jscomp$0 &&
          formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
        if ("string" === typeof children$jscomp$3) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
          var JSCompiler_inline_result$jscomp$0 = null;
        } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
        return JSCompiler_inline_result$jscomp$0;
      case "form":
        target$jscomp$0.push(startChunkForTag("form"));
        var children$jscomp$4 = null,
          innerHTML$jscomp$3 = null,
          formAction$jscomp$1 = null,
          formEncType$jscomp$1 = null,
          formMethod$jscomp$1 = null,
          formTarget$jscomp$1 = null,
          propKey$jscomp$5;
        for (propKey$jscomp$5 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$5)) {
            var propValue$jscomp$5 = props[propKey$jscomp$5];
            if (null != propValue$jscomp$5)
              switch (propKey$jscomp$5) {
                case "children":
                  children$jscomp$4 = propValue$jscomp$5;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$3 = propValue$jscomp$5;
                  break;
                case "action":
                  formAction$jscomp$1 = propValue$jscomp$5;
                  break;
                case "encType":
                  formEncType$jscomp$1 = propValue$jscomp$5;
                  break;
                case "method":
                  formMethod$jscomp$1 = propValue$jscomp$5;
                  break;
                case "target":
                  formTarget$jscomp$1 = propValue$jscomp$5;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$5, propValue$jscomp$5);
              }
          }
        var formData$jscomp$1 = null,
          formActionName = null;
        if ("function" === typeof formAction$jscomp$1) {
          var customFields = getCustomFormFields(resumableState, formAction$jscomp$1);
          null !== customFields
            ? ((formAction$jscomp$1 = customFields.action || ""),
              (formEncType$jscomp$1 = customFields.encType),
              (formMethod$jscomp$1 = customFields.method),
              (formTarget$jscomp$1 = customFields.target),
              (formData$jscomp$1 = customFields.data),
              (formActionName = customFields.name))
            : (target$jscomp$0.push(" ", "action", '="', actionJavaScriptURL, '"'),
              (formTarget$jscomp$1 =
                formMethod$jscomp$1 =
                formEncType$jscomp$1 =
                formAction$jscomp$1 =
                  null),
              injectFormReplayingRuntime(resumableState, renderState));
        }
        null != formAction$jscomp$1 &&
          pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
        null != formEncType$jscomp$1 &&
          pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
        null != formMethod$jscomp$1 &&
          pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
        null != formTarget$jscomp$1 &&
          pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
        target$jscomp$0.push(">");
        null !== formActionName &&
          (target$jscomp$0.push('<input type="hidden"'),
          pushStringAttribute(target$jscomp$0, "name", formActionName),
          target$jscomp$0.push("/>"),
          null != formData$jscomp$1 &&
            formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
        if ("string" === typeof children$jscomp$4) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
          var JSCompiler_inline_result$jscomp$1 = null;
        } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
        return JSCompiler_inline_result$jscomp$1;
      case "menuitem":
        target$jscomp$0.push(startChunkForTag("menuitem"));
        for (var propKey$jscomp$6 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$6)) {
            var propValue$jscomp$6 = props[propKey$jscomp$6];
            if (null != propValue$jscomp$6)
              switch (propKey$jscomp$6) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$6, propValue$jscomp$6);
              }
          }
        target$jscomp$0.push(">");
        return null;
      case "object":
        target$jscomp$0.push(startChunkForTag("object"));
        var children$jscomp$5 = null,
          innerHTML$jscomp$4 = null,
          propKey$jscomp$7;
        for (propKey$jscomp$7 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$7)) {
            var propValue$jscomp$7 = props[propKey$jscomp$7];
            if (null != propValue$jscomp$7)
              switch (propKey$jscomp$7) {
                case "children":
                  children$jscomp$5 = propValue$jscomp$7;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$4 = propValue$jscomp$7;
                  break;
                case "data":
                  var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                  if ("" === sanitizedValue) break;
                  target$jscomp$0.push(
                    " ",
                    "data",
                    '="',
                    escapeTextForBrowser(sanitizedValue),
                    '"',
                  );
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$7, propValue$jscomp$7);
              }
          }
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
        if ("string" === typeof children$jscomp$5) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
          var JSCompiler_inline_result$jscomp$2 = null;
        } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
        return JSCompiler_inline_result$jscomp$2;
      case "title":
        var noscriptTagInScope = formatContext.tagScope & 1,
          isFallback = formatContext.tagScope & 4;
        if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(target$jscomp$0, props);
        else
          isFallback
            ? (JSCompiler_inline_result$jscomp$3 = null)
            : (pushTitleImpl(renderState.hoistableChunks, props),
              (JSCompiler_inline_result$jscomp$3 = void 0));
        return JSCompiler_inline_result$jscomp$3;
      case "link":
        var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1,
          isFallback$jscomp$0 = formatContext.tagScope & 4,
          rel = props.rel,
          href = props.href,
          precedence = props.precedence;
        if (
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$0 ||
          null != props.itemProp ||
          "string" !== typeof rel ||
          "string" !== typeof href ||
          "" === href
        ) {
          pushLinkImpl(target$jscomp$0, props);
          var JSCompiler_inline_result$jscomp$4 = null;
        } else if ("stylesheet" === props.rel)
          if (
            "string" !== typeof precedence ||
            null != props.disabled ||
            props.onLoad ||
            props.onError
          )
            JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props);
          else {
            var styleQueue = renderState.styles.get(precedence),
              resourceState = resumableState.styleResources.hasOwnProperty(href)
                ? resumableState.styleResources[href]
                : void 0;
            if (null !== resourceState) {
              resumableState.styleResources[href] = null;
              styleQueue ||
                ((styleQueue = {
                  precedence: escapeTextForBrowser(precedence),
                  rules: [],
                  hrefs: [],
                  sheets: /* @__PURE__ */ new Map(),
                }),
                renderState.styles.set(precedence, styleQueue));
              var resource = {
                state: 0,
                props: assign({}, props, {
                  "data-precedence": props.precedence,
                  precedence: null,
                }),
              };
              if (resourceState) {
                2 === resourceState.length &&
                  adoptPreloadCredentials(resource.props, resourceState);
                var preloadResource = renderState.preloads.stylesheets.get(href);
                preloadResource && 0 < preloadResource.length
                  ? (preloadResource.length = 0)
                  : (resource.state = 1);
              }
              styleQueue.sheets.set(href, resource);
              hoistableState && hoistableState.stylesheets.add(resource);
            } else if (styleQueue) {
              var resource$9 = styleQueue.sheets.get(href);
              resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
            }
            textEmbedded && target$jscomp$0.push("<!-- -->");
            JSCompiler_inline_result$jscomp$4 = null;
          }
        else
          props.onLoad || props.onError
            ? (JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props))
            : (textEmbedded && target$jscomp$0.push("<!-- -->"),
              (JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0
                ? null
                : pushLinkImpl(renderState.hoistableChunks, props)));
        return JSCompiler_inline_result$jscomp$4;
      case "script":
        var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1,
          asyncProp = props.async;
        if (
          "string" !== typeof props.src ||
          !props.src ||
          !asyncProp ||
          "function" === typeof asyncProp ||
          "symbol" === typeof asyncProp ||
          props.onLoad ||
          props.onError ||
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$1 ||
          null != props.itemProp
        )
          var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(target$jscomp$0, props);
        else {
          var key = props.src;
          if ("module" === props.type) {
            var resources = resumableState.moduleScriptResources;
            var preloads = renderState.preloads.moduleScripts;
          } else
            ((resources = resumableState.scriptResources),
              (preloads = renderState.preloads.scripts));
          var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
          if (null !== resourceState$jscomp$0) {
            resources[key] = null;
            var scriptProps = props;
            if (resourceState$jscomp$0) {
              2 === resourceState$jscomp$0.length &&
                ((scriptProps = assign({}, props)),
                adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
              var preloadResource$jscomp$0 = preloads.get(key);
              preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
            }
            var resource$jscomp$0 = [];
            renderState.scripts.add(resource$jscomp$0);
            pushScriptImpl(resource$jscomp$0, scriptProps);
          }
          textEmbedded && target$jscomp$0.push("<!-- -->");
          JSCompiler_inline_result$jscomp$5 = null;
        }
        return JSCompiler_inline_result$jscomp$5;
      case "style":
        var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1,
          precedence$jscomp$0 = props.precedence,
          href$jscomp$0 = props.href,
          nonce = props.nonce;
        if (
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$2 ||
          null != props.itemProp ||
          "string" !== typeof precedence$jscomp$0 ||
          "string" !== typeof href$jscomp$0 ||
          "" === href$jscomp$0
        ) {
          target$jscomp$0.push(startChunkForTag("style"));
          var children$jscomp$6 = null,
            innerHTML$jscomp$5 = null,
            propKey$jscomp$8;
          for (propKey$jscomp$8 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$8)) {
              var propValue$jscomp$8 = props[propKey$jscomp$8];
              if (null != propValue$jscomp$8)
                switch (propKey$jscomp$8) {
                  case "children":
                    children$jscomp$6 = propValue$jscomp$8;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$5 = propValue$jscomp$8;
                    break;
                  default:
                    pushAttribute(target$jscomp$0, propKey$jscomp$8, propValue$jscomp$8);
                }
            }
          target$jscomp$0.push(">");
          var child = Array.isArray(children$jscomp$6)
            ? 2 > children$jscomp$6.length
              ? children$jscomp$6[0]
              : null
            : children$jscomp$6;
          "function" !== typeof child &&
            "symbol" !== typeof child &&
            null !== child &&
            void 0 !== child &&
            target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
          target$jscomp$0.push(endChunkForTag("style"));
          var JSCompiler_inline_result$jscomp$6 = null;
        } else {
          var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
          if (
            null !==
            (resumableState.styleResources.hasOwnProperty(href$jscomp$0)
              ? resumableState.styleResources[href$jscomp$0]
              : void 0)
          ) {
            resumableState.styleResources[href$jscomp$0] = null;
            styleQueue$jscomp$0 ||
              ((styleQueue$jscomp$0 = {
                precedence: escapeTextForBrowser(precedence$jscomp$0),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map(),
              }),
              renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
            var nonceStyle = renderState.nonce.style;
            if (!nonceStyle || nonceStyle === nonce) {
              styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
              var target = styleQueue$jscomp$0.rules,
                children$jscomp$7 = null,
                innerHTML$jscomp$6 = null,
                propKey$jscomp$9;
              for (propKey$jscomp$9 in props)
                if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                  var propValue$jscomp$9 = props[propKey$jscomp$9];
                  if (null != propValue$jscomp$9)
                    switch (propKey$jscomp$9) {
                      case "children":
                        children$jscomp$7 = propValue$jscomp$9;
                        break;
                      case "dangerouslySetInnerHTML":
                        innerHTML$jscomp$6 = propValue$jscomp$9;
                    }
                }
              var child$jscomp$0 = Array.isArray(children$jscomp$7)
                ? 2 > children$jscomp$7.length
                  ? children$jscomp$7[0]
                  : null
                : children$jscomp$7;
              "function" !== typeof child$jscomp$0 &&
                "symbol" !== typeof child$jscomp$0 &&
                null !== child$jscomp$0 &&
                void 0 !== child$jscomp$0 &&
                target.push(("" + child$jscomp$0).replace(styleRegex, styleReplacer));
              pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
            }
          }
          styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
          textEmbedded && target$jscomp$0.push("<!-- -->");
          JSCompiler_inline_result$jscomp$6 = void 0;
        }
        return JSCompiler_inline_result$jscomp$6;
      case "meta":
        var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1,
          isFallback$jscomp$1 = formatContext.tagScope & 4;
        if (
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$3 ||
          null != props.itemProp
        )
          var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(target$jscomp$0, props, "meta");
        else
          (textEmbedded && target$jscomp$0.push("<!-- -->"),
            (JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1
              ? null
              : "string" === typeof props.charSet
                ? pushSelfClosing(renderState.charsetChunks, props, "meta")
                : "viewport" === props.name
                  ? pushSelfClosing(renderState.viewportChunks, props, "meta")
                  : pushSelfClosing(renderState.hoistableChunks, props, "meta")));
        return JSCompiler_inline_result$jscomp$7;
      case "listing":
      case "pre":
        target$jscomp$0.push(startChunkForTag(type));
        var children$jscomp$8 = null,
          innerHTML$jscomp$7 = null,
          propKey$jscomp$10;
        for (propKey$jscomp$10 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$10)) {
            var propValue$jscomp$10 = props[propKey$jscomp$10];
            if (null != propValue$jscomp$10)
              switch (propKey$jscomp$10) {
                case "children":
                  children$jscomp$8 = propValue$jscomp$10;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$7 = propValue$jscomp$10;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$10, propValue$jscomp$10);
              }
          }
        target$jscomp$0.push(">");
        if (null != innerHTML$jscomp$7) {
          if (null != children$jscomp$8)
            throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
            throw Error(
              "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.",
            );
          var html = innerHTML$jscomp$7.__html;
          null !== html &&
            void 0 !== html &&
            ("string" === typeof html && 0 < html.length && "\n" === html[0]
              ? target$jscomp$0.push("\n", html)
              : target$jscomp$0.push("" + html));
        }
        "string" === typeof children$jscomp$8 &&
          "\n" === children$jscomp$8[0] &&
          target$jscomp$0.push("\n");
        return children$jscomp$8;
      case "img":
        var pictureOrNoScriptTagInScope = formatContext.tagScope & 3,
          src = props.src,
          srcSet = props.srcSet;
        if (
          !(
            "lazy" === props.loading ||
            (!src && !srcSet) ||
            ("string" !== typeof src && null != src) ||
            ("string" !== typeof srcSet && null != srcSet) ||
            "low" === props.fetchPriority ||
            pictureOrNoScriptTagInScope
          ) &&
          ("string" !== typeof src ||
            ":" !== src[4] ||
            ("d" !== src[0] && "D" !== src[0]) ||
            ("a" !== src[1] && "A" !== src[1]) ||
            ("t" !== src[2] && "T" !== src[2]) ||
            ("a" !== src[3] && "A" !== src[3])) &&
          ("string" !== typeof srcSet ||
            ":" !== srcSet[4] ||
            ("d" !== srcSet[0] && "D" !== srcSet[0]) ||
            ("a" !== srcSet[1] && "A" !== srcSet[1]) ||
            ("t" !== srcSet[2] && "T" !== srcSet[2]) ||
            ("a" !== srcSet[3] && "A" !== srcSet[3]))
        ) {
          null !== hoistableState &&
            formatContext.tagScope & 64 &&
            (hoistableState.suspenseyImages = true);
          var sizes = "string" === typeof props.sizes ? props.sizes : void 0,
            key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src,
            promotablePreloads = renderState.preloads.images,
            resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
          if (resource$jscomp$1) {
            if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
              (promotablePreloads.delete(key$jscomp$0),
                renderState.highImagePreloads.add(resource$jscomp$1));
          } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
            resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
            var input = props.crossOrigin;
            var JSCompiler_inline_result$jscomp$8 =
              "string" === typeof input ? ("use-credentials" === input ? input : "") : void 0;
            var headers = renderState.headers,
              header;
            headers &&
            0 < headers.remainingCapacity &&
            "string" !== typeof props.srcSet &&
            ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) &&
            ((header = getPreloadAsHeader(src, "image", {
              imageSrcSet: props.srcSet,
              imageSizes: props.sizes,
              crossOrigin: JSCompiler_inline_result$jscomp$8,
              integrity: props.integrity,
              nonce: props.nonce,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.refererPolicy,
            })),
            0 <= (headers.remainingCapacity -= header.length + 2))
              ? ((renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS),
                headers.highImagePreloads && (headers.highImagePreloads += ", "),
                (headers.highImagePreloads += header))
              : ((resource$jscomp$1 = []),
                pushLinkImpl(resource$jscomp$1, {
                  rel: "preload",
                  as: "image",
                  href: srcSet ? void 0 : src,
                  imageSrcSet: srcSet,
                  imageSizes: sizes,
                  crossOrigin: JSCompiler_inline_result$jscomp$8,
                  integrity: props.integrity,
                  type: props.type,
                  fetchPriority: props.fetchPriority,
                  referrerPolicy: props.referrerPolicy,
                }),
                "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size
                  ? renderState.highImagePreloads.add(resource$jscomp$1)
                  : (renderState.bulkPreloads.add(resource$jscomp$1),
                    promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
          }
        }
        return pushSelfClosing(target$jscomp$0, props, "img");
      case "base":
      case "area":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "param":
      case "source":
      case "track":
      case "wbr":
        return pushSelfClosing(target$jscomp$0, props, type);
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        break;
      case "head":
        if (2 > formatContext.insertionMode) {
          var preamble = preambleState || renderState.preamble;
          if (preamble.headChunks) throw Error("The `<head>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push("<!--head-->");
          preamble.headChunks = [];
          var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
            preamble.headChunks,
            props,
            "head",
          );
        } else
          JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "head",
          );
        return JSCompiler_inline_result$jscomp$9;
      case "body":
        if (2 > formatContext.insertionMode) {
          var preamble$jscomp$0 = preambleState || renderState.preamble;
          if (preamble$jscomp$0.bodyChunks)
            throw Error("The `<body>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push("<!--body-->");
          preamble$jscomp$0.bodyChunks = [];
          var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
            preamble$jscomp$0.bodyChunks,
            props,
            "body",
          );
        } else
          JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "body",
          );
        return JSCompiler_inline_result$jscomp$10;
      case "html":
        if (0 === formatContext.insertionMode) {
          var preamble$jscomp$1 = preambleState || renderState.preamble;
          if (preamble$jscomp$1.htmlChunks)
            throw Error("The `<html>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push("<!--html-->");
          preamble$jscomp$1.htmlChunks = [""];
          var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
            preamble$jscomp$1.htmlChunks,
            props,
            "html",
          );
        } else
          JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "html",
          );
        return JSCompiler_inline_result$jscomp$11;
      default:
        if (-1 !== type.indexOf("-")) {
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$9 = null,
            innerHTML$jscomp$8 = null,
            propKey$jscomp$11;
          for (propKey$jscomp$11 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$11)) {
              var propValue$jscomp$11 = props[propKey$jscomp$11];
              if (null != propValue$jscomp$11) {
                var attributeName = propKey$jscomp$11;
                switch (propKey$jscomp$11) {
                  case "children":
                    children$jscomp$9 = propValue$jscomp$11;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$8 = propValue$jscomp$11;
                    break;
                  case "style":
                    pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                    break;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                  case "ref":
                    break;
                  case "className":
                    attributeName = "class";
                  default:
                    if (
                      isAttributeNameSafe(propKey$jscomp$11) &&
                      "function" !== typeof propValue$jscomp$11 &&
                      "symbol" !== typeof propValue$jscomp$11 &&
                      false !== propValue$jscomp$11
                    ) {
                      if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                      else if ("object" === typeof propValue$jscomp$11) continue;
                      target$jscomp$0.push(
                        " ",
                        attributeName,
                        '="',
                        escapeTextForBrowser(propValue$jscomp$11),
                        '"',
                      );
                    }
                }
              }
            }
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
          return children$jscomp$9;
        }
    }
    return pushStartGenericElement(target$jscomp$0, props, type);
  }
  var endTagCache = /* @__PURE__ */ new Map();
  function endChunkForTag(tag) {
    var chunk = endTagCache.get(tag);
    void 0 === chunk && ((chunk = "</" + tag + ">"), endTagCache.set(tag, chunk));
    return chunk;
  }
  function hoistPreambleState(renderState, preambleState) {
    renderState = renderState.preamble;
    null === renderState.htmlChunks &&
      preambleState.htmlChunks &&
      (renderState.htmlChunks = preambleState.htmlChunks);
    null === renderState.headChunks &&
      preambleState.headChunks &&
      (renderState.headChunks = preambleState.headChunks);
    null === renderState.bodyChunks &&
      preambleState.bodyChunks &&
      (renderState.bodyChunks = preambleState.bodyChunks);
  }
  function writeBootstrap(destination, renderState) {
    renderState = renderState.bootstrapChunks;
    for (var i = 0; i < renderState.length - 1; i++) destination.push(renderState[i]);
    return i < renderState.length
      ? ((i = renderState[i]), (renderState.length = 0), destination.push(i))
      : true;
  }
  function writeStartPendingSuspenseBoundary(destination, renderState, id) {
    destination.push('<!--$?--><template id="');
    if (null === id)
      throw Error("An ID must have been assigned before we can complete the boundary.");
    destination.push(renderState.boundaryPrefix);
    renderState = id.toString(16);
    destination.push(renderState);
    return destination.push('"></template>');
  }
  function writeStartSegment(destination, renderState, formatContext, id) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return (
          destination.push('<div hidden id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      case 4:
        return (
          destination.push('<svg aria-hidden="true" style="display:none" id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      case 5:
        return (
          destination.push('<math aria-hidden="true" style="display:none" id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      case 6:
        return (
          destination.push('<table hidden id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      case 7:
        return (
          destination.push('<table hidden><tbody id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      case 8:
        return (
          destination.push('<table hidden><tr id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      case 9:
        return (
          destination.push('<table hidden><colgroup id="'),
          destination.push(renderState.segmentPrefix),
          (renderState = id.toString(16)),
          destination.push(renderState),
          destination.push('">')
        );
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  function writeEndSegment(destination, formatContext) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return destination.push("</div>");
      case 4:
        return destination.push("</svg>");
      case 5:
        return destination.push("</math>");
      case 6:
        return destination.push("</table>");
      case 7:
        return destination.push("</tbody></table>");
      case 8:
        return destination.push("</tr></table>");
      case 9:
        return destination.push("</colgroup></table>");
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
  function escapeJSStringsForInstructionScripts(input) {
    return JSON.stringify(input).replace(regexForJSStringsInInstructionScripts, function (match) {
      switch (match) {
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error(
            "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
          );
      }
    });
  }
  var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
  function escapeJSObjectForInstructionScripts(input) {
    return JSON.stringify(input).replace(regexForJSStringsInScripts, function (match) {
      switch (match) {
        case "&":
          return "\\u0026";
        case ">":
          return "\\u003e";
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error(
            "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
          );
      }
    });
  }
  var currentlyRenderingBoundaryHasStylesToHoist = false,
    destinationHasCapacity = true;
  function flushStyleTagsLateForBoundary(styleQueue) {
    var rules = styleQueue.rules,
      hrefs = styleQueue.hrefs,
      i = 0;
    if (hrefs.length) {
      this.push(currentlyFlushingRenderState.startInlineStyle);
      this.push(' media="not all" data-precedence="');
      this.push(styleQueue.precedence);
      for (this.push('" data-href="'); i < hrefs.length - 1; i++)
        (this.push(hrefs[i]), this.push(" "));
      this.push(hrefs[i]);
      this.push('">');
      for (i = 0; i < rules.length; i++) this.push(rules[i]);
      destinationHasCapacity = this.push("</style>");
      currentlyRenderingBoundaryHasStylesToHoist = true;
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function hasStylesToHoist(stylesheet) {
    return 2 !== stylesheet.state ? (currentlyRenderingBoundaryHasStylesToHoist = true) : false;
  }
  function writeHoistablesForBoundary(destination, hoistableState, renderState) {
    currentlyRenderingBoundaryHasStylesToHoist = false;
    destinationHasCapacity = true;
    currentlyFlushingRenderState = renderState;
    hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
    currentlyFlushingRenderState = null;
    hoistableState.stylesheets.forEach(hasStylesToHoist);
    currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
    return destinationHasCapacity;
  }
  function flushResource(resource) {
    for (var i = 0; i < resource.length; i++) this.push(resource[i]);
    resource.length = 0;
  }
  var stylesheetFlushingQueue = [];
  function flushStyleInPreamble(stylesheet) {
    pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
    for (var i = 0; i < stylesheetFlushingQueue.length; i++) this.push(stylesheetFlushingQueue[i]);
    stylesheetFlushingQueue.length = 0;
    stylesheet.state = 2;
  }
  function flushStylesInPreamble(styleQueue) {
    var hasStylesheets = 0 < styleQueue.sheets.size;
    styleQueue.sheets.forEach(flushStyleInPreamble, this);
    styleQueue.sheets.clear();
    var rules = styleQueue.rules,
      hrefs = styleQueue.hrefs;
    if (!hasStylesheets || hrefs.length) {
      this.push(currentlyFlushingRenderState.startInlineStyle);
      this.push(' data-precedence="');
      this.push(styleQueue.precedence);
      styleQueue = 0;
      if (hrefs.length) {
        for (this.push('" data-href="'); styleQueue < hrefs.length - 1; styleQueue++)
          (this.push(hrefs[styleQueue]), this.push(" "));
        this.push(hrefs[styleQueue]);
      }
      this.push('">');
      for (styleQueue = 0; styleQueue < rules.length; styleQueue++) this.push(rules[styleQueue]);
      this.push("</style>");
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function preloadLateStyle(stylesheet) {
    if (0 === stylesheet.state) {
      stylesheet.state = 1;
      var props = stylesheet.props;
      pushLinkImpl(stylesheetFlushingQueue, {
        rel: "preload",
        as: "style",
        href: stylesheet.props.href,
        crossOrigin: props.crossOrigin,
        fetchPriority: props.fetchPriority,
        integrity: props.integrity,
        media: props.media,
        hrefLang: props.hrefLang,
        referrerPolicy: props.referrerPolicy,
      });
      for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
        this.push(stylesheetFlushingQueue[stylesheet]);
      stylesheetFlushingQueue.length = 0;
    }
  }
  function preloadLateStyles(styleQueue) {
    styleQueue.sheets.forEach(preloadLateStyle, this);
    styleQueue.sheets.clear();
  }
  function pushCompletedShellIdAttribute(target, resumableState) {
    0 === (resumableState.instructions & 32) &&
      ((resumableState.instructions |= 32),
      target.push(' id="', escapeTextForBrowser("_" + resumableState.idPrefix + "R_"), '"'));
  }
  function writeStyleResourceDependenciesInJS(destination, hoistableState) {
    destination.push("[");
    var nextArrayOpenBrackChunk = "[";
    hoistableState.stylesheets.forEach(function (resource) {
      if (2 !== resource.state)
        if (3 === resource.state)
          (destination.push(nextArrayOpenBrackChunk),
            (resource = escapeJSObjectForInstructionScripts("" + resource.props.href)),
            destination.push(resource),
            destination.push("]"),
            (nextArrayOpenBrackChunk = ",["));
        else {
          destination.push(nextArrayOpenBrackChunk);
          var precedence = resource.props["data-precedence"],
            props = resource.props,
            coercedHref = sanitizeURL("" + resource.props.href);
          coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
          destination.push(coercedHref);
          precedence = "" + precedence;
          destination.push(",");
          precedence = escapeJSObjectForInstructionScripts(precedence);
          destination.push(precedence);
          for (var propKey in props)
            if (
              hasOwnProperty.call(props, propKey) &&
              ((precedence = props[propKey]), null != precedence)
            )
              switch (propKey) {
                case "href":
                case "rel":
                case "precedence":
                case "data-precedence":
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
                  );
                default:
                  writeStyleResourceAttributeInJS(destination, propKey, precedence);
              }
          destination.push("]");
          nextArrayOpenBrackChunk = ",[";
          resource.state = 3;
        }
    });
    destination.push("]");
  }
  function writeStyleResourceAttributeInJS(destination, name, value) {
    var attributeName = name.toLowerCase();
    switch (typeof value) {
      case "function":
      case "symbol":
        return;
    }
    switch (name) {
      case "innerHTML":
      case "dangerouslySetInnerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "style":
      case "ref":
        return;
      case "className":
        attributeName = "class";
        name = "" + value;
        break;
      case "hidden":
        if (false === value) return;
        name = "";
        break;
      case "src":
      case "href":
        value = sanitizeURL(value);
        name = "" + value;
        break;
      default:
        if (
          (2 < name.length &&
            ("o" === name[0] || "O" === name[0]) &&
            ("n" === name[1] || "N" === name[1])) ||
          !isAttributeNameSafe(name)
        )
          return;
        name = "" + value;
    }
    destination.push(",");
    attributeName = escapeJSObjectForInstructionScripts(attributeName);
    destination.push(attributeName);
    destination.push(",");
    attributeName = escapeJSObjectForInstructionScripts(name);
    destination.push(attributeName);
  }
  function createHoistableState() {
    return {
      styles: /* @__PURE__ */ new Set(),
      stylesheets: /* @__PURE__ */ new Set(),
      suspenseyImages: false,
    };
  }
  function prefetchDNS(href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if ("string" === typeof href && href) {
        if (!resumableState.dnsResources.hasOwnProperty(href)) {
          resumableState.dnsResources[href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if ((JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity))
            JSCompiler_temp =
              ((header =
                "<" +
                ("" + href).replace(
                  regexForHrefInLinkHeaderURLContext,
                  escapeHrefForLinkHeaderURLContextReplacer,
                ) +
                ">; rel=dns-prefetch"),
              0 <= (resumableState.remainingCapacity -= header.length + 2));
          JSCompiler_temp
            ? ((renderState.resets.dns[href] = null),
              resumableState.preconnects && (resumableState.preconnects += ", "),
              (resumableState.preconnects += header))
            : ((header = []),
              pushLinkImpl(header, { href, rel: "dns-prefetch" }),
              renderState.preconnects.add(header));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.D(href);
  }
  function preconnect(href, crossOrigin) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if ("string" === typeof href && href) {
        var bucket =
          "use-credentials" === crossOrigin
            ? "credentials"
            : "string" === typeof crossOrigin
              ? "anonymous"
              : "default";
        if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
          resumableState.connectResources[bucket][href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if ((JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)) {
            JSCompiler_temp =
              "<" +
              ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer,
              ) +
              ">; rel=preconnect";
            if ("string" === typeof crossOrigin) {
              var escapedCrossOrigin = ("" + crossOrigin).replace(
                regexForLinkHeaderQuotedParamValueContext,
                escapeStringForLinkHeaderQuotedParamValueContextReplacer,
              );
              JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
            }
            JSCompiler_temp =
              ((header = JSCompiler_temp),
              0 <= (resumableState.remainingCapacity -= header.length + 2));
          }
          JSCompiler_temp
            ? ((renderState.resets.connect[bucket][href] = null),
              resumableState.preconnects && (resumableState.preconnects += ", "),
              (resumableState.preconnects += header))
            : ((bucket = []),
              pushLinkImpl(bucket, {
                rel: "preconnect",
                href,
                crossOrigin,
              }),
              renderState.preconnects.add(bucket));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.C(href, crossOrigin);
  }
  function preload(href, as, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (as && href) {
        switch (as) {
          case "image":
            if (options) {
              var imageSrcSet = options.imageSrcSet;
              var imageSizes = options.imageSizes;
              var fetchPriority = options.fetchPriority;
            }
            var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
            if (resumableState.imageResources.hasOwnProperty(key)) return;
            resumableState.imageResources[key] = PRELOAD_NO_CREDS;
            resumableState = renderState.headers;
            var header;
            resumableState &&
            0 < resumableState.remainingCapacity &&
            "string" !== typeof imageSrcSet &&
            "high" === fetchPriority &&
            ((header = getPreloadAsHeader(href, as, options)),
            0 <= (resumableState.remainingCapacity -= header.length + 2))
              ? ((renderState.resets.image[key] = PRELOAD_NO_CREDS),
                resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "),
                (resumableState.highImagePreloads += header))
              : ((resumableState = []),
                pushLinkImpl(
                  resumableState,
                  assign({ rel: "preload", href: imageSrcSet ? void 0 : href, as }, options),
                ),
                "high" === fetchPriority
                  ? renderState.highImagePreloads.add(resumableState)
                  : (renderState.bulkPreloads.add(resumableState),
                    renderState.preloads.images.set(key, resumableState)));
            break;
          case "style":
            if (resumableState.styleResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            pushLinkImpl(imageSrcSet, assign({ rel: "preload", href, as }, options));
            resumableState.styleResources[href] =
              !options ||
              ("string" !== typeof options.crossOrigin && "string" !== typeof options.integrity)
                ? PRELOAD_NO_CREDS
                : [options.crossOrigin, options.integrity];
            renderState.preloads.stylesheets.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            break;
          case "script":
            if (resumableState.scriptResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            renderState.preloads.scripts.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            pushLinkImpl(imageSrcSet, assign({ rel: "preload", href, as }, options));
            resumableState.scriptResources[href] =
              !options ||
              ("string" !== typeof options.crossOrigin && "string" !== typeof options.integrity)
                ? PRELOAD_NO_CREDS
                : [options.crossOrigin, options.integrity];
            break;
          default:
            if (resumableState.unknownResources.hasOwnProperty(as)) {
              if (
                ((imageSrcSet = resumableState.unknownResources[as]),
                imageSrcSet.hasOwnProperty(href))
              )
                return;
            } else ((imageSrcSet = {}), (resumableState.unknownResources[as] = imageSrcSet));
            imageSrcSet[href] = PRELOAD_NO_CREDS;
            if (
              (resumableState = renderState.headers) &&
              0 < resumableState.remainingCapacity &&
              "font" === as &&
              ((key = getPreloadAsHeader(href, as, options)),
              0 <= (resumableState.remainingCapacity -= key.length + 2))
            )
              ((renderState.resets.font[href] = PRELOAD_NO_CREDS),
                resumableState.fontPreloads && (resumableState.fontPreloads += ", "),
                (resumableState.fontPreloads += key));
            else
              switch (
                ((resumableState = []),
                (href = assign({ rel: "preload", href, as }, options)),
                pushLinkImpl(resumableState, href),
                as)
              ) {
                case "font":
                  renderState.fontPreloads.add(resumableState);
                  break;
                default:
                  renderState.bulkPreloads.add(resumableState);
              }
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.L(href, as, options);
  }
  function preloadModule(href, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (href) {
        var as = options && "string" === typeof options.as ? options.as : "script";
        switch (as) {
          case "script":
            if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
            as = [];
            resumableState.moduleScriptResources[href] =
              !options ||
              ("string" !== typeof options.crossOrigin && "string" !== typeof options.integrity)
                ? PRELOAD_NO_CREDS
                : [options.crossOrigin, options.integrity];
            renderState.preloads.moduleScripts.set(href, as);
            break;
          default:
            if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
              var resources = resumableState.unknownResources[as];
              if (resources.hasOwnProperty(href)) return;
            } else ((resources = {}), (resumableState.moduleUnknownResources[as] = resources));
            as = [];
            resources[href] = PRELOAD_NO_CREDS;
        }
        pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
        renderState.bulkPreloads.add(as);
        enqueueFlush(request);
      }
    } else previousDispatcher.m(href, options);
  }
  function preinitStyle(href, precedence, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (href) {
        precedence = precedence || "default";
        var styleQueue = renderState.styles.get(precedence),
          resourceState = resumableState.styleResources.hasOwnProperty(href)
            ? resumableState.styleResources[href]
            : void 0;
        null !== resourceState &&
          ((resumableState.styleResources[href] = null),
          styleQueue ||
            ((styleQueue = {
              precedence: escapeTextForBrowser(precedence),
              rules: [],
              hrefs: [],
              sheets: /* @__PURE__ */ new Map(),
            }),
            renderState.styles.set(precedence, styleQueue)),
          (precedence = {
            state: 0,
            props: assign({ rel: "stylesheet", href, "data-precedence": precedence }, options),
          }),
          resourceState &&
            (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState),
            (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length
              ? (renderState.length = 0)
              : (precedence.state = 1)),
          styleQueue.sheets.set(href, precedence),
          enqueueFlush(request));
      }
    } else previousDispatcher.S(href, precedence, options);
  }
  function preinitScript(src, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.scriptResources.hasOwnProperty(src)
          ? resumableState.scriptResources[src]
          : void 0;
        null !== resourceState &&
          ((resumableState.scriptResources[src] = null),
          (options = assign({ src, async: true }, options)),
          resourceState &&
            (2 === resourceState.length && adoptPreloadCredentials(options, resourceState),
            (src = renderState.preloads.scripts.get(src))) &&
            (src.length = 0),
          (src = []),
          renderState.scripts.add(src),
          pushScriptImpl(src, options),
          enqueueFlush(request));
      }
    } else previousDispatcher.X(src, options);
  }
  function preinitModuleScript(src, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.moduleScriptResources.hasOwnProperty(src)
          ? resumableState.moduleScriptResources[src]
          : void 0;
        null !== resourceState &&
          ((resumableState.moduleScriptResources[src] = null),
          (options = assign({ src, type: "module", async: true }, options)),
          resourceState &&
            (2 === resourceState.length && adoptPreloadCredentials(options, resourceState),
            (src = renderState.preloads.moduleScripts.get(src))) &&
            (src.length = 0),
          (src = []),
          renderState.scripts.add(src),
          pushScriptImpl(src, options),
          enqueueFlush(request));
      }
    } else previousDispatcher.M(src, options);
  }
  function adoptPreloadCredentials(target, preloadState) {
    null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
    null == target.integrity && (target.integrity = preloadState[1]);
  }
  function getPreloadAsHeader(href, as, params) {
    href = ("" + href).replace(
      regexForHrefInLinkHeaderURLContext,
      escapeHrefForLinkHeaderURLContextReplacer,
    );
    as = ("" + as).replace(
      regexForLinkHeaderQuotedParamValueContext,
      escapeStringForLinkHeaderQuotedParamValueContextReplacer,
    );
    as = "<" + href + '>; rel=preload; as="' + as + '"';
    for (var paramName in params)
      hasOwnProperty.call(params, paramName) &&
        ((href = params[paramName]),
        "string" === typeof href &&
          (as +=
            "; " +
            paramName.toLowerCase() +
            '="' +
            ("" + href).replace(
              regexForLinkHeaderQuotedParamValueContext,
              escapeStringForLinkHeaderQuotedParamValueContextReplacer,
            ) +
            '"'));
    return as;
  }
  var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
  function escapeHrefForLinkHeaderURLContextReplacer(match) {
    switch (match) {
      case "<":
        return "%3C";
      case ">":
        return "%3E";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
        );
    }
  }
  var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
  function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
    switch (match) {
      case '"':
        return "%22";
      case "'":
        return "%27";
      case ";":
        return "%3B";
      case ",":
        return "%2C";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
        );
    }
  }
  function hoistStyleQueueDependency(styleQueue) {
    this.styles.add(styleQueue);
  }
  function hoistStylesheetDependency(stylesheet) {
    this.stylesheets.add(stylesheet);
  }
  function hoistHoistables(parentState, childState) {
    childState.styles.forEach(hoistStyleQueueDependency, parentState);
    childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
    childState.suspenseyImages && (parentState.suspenseyImages = true);
  }
  function createRenderState(resumableState, generateStaticMarkup) {
    var idPrefix = resumableState.idPrefix,
      bootstrapChunks = [],
      bootstrapScriptContent = resumableState.bootstrapScriptContent,
      bootstrapScripts = resumableState.bootstrapScripts,
      bootstrapModules = resumableState.bootstrapModules;
    void 0 !== bootstrapScriptContent &&
      (bootstrapChunks.push("<script"),
      pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
      bootstrapChunks.push(
        ">",
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
        "<\/script>",
      ));
    bootstrapScriptContent = idPrefix + "P:";
    var JSCompiler_object_inline_segmentPrefix_1673 = idPrefix + "S:";
    idPrefix += "B:";
    var JSCompiler_object_inline_preconnects_1687 = /* @__PURE__ */ new Set(),
      JSCompiler_object_inline_fontPreloads_1688 = /* @__PURE__ */ new Set(),
      JSCompiler_object_inline_highImagePreloads_1689 = /* @__PURE__ */ new Set(),
      JSCompiler_object_inline_styles_1690 = /* @__PURE__ */ new Map(),
      JSCompiler_object_inline_bootstrapScripts_1691 = /* @__PURE__ */ new Set(),
      JSCompiler_object_inline_scripts_1692 = /* @__PURE__ */ new Set(),
      JSCompiler_object_inline_bulkPreloads_1693 = /* @__PURE__ */ new Set(),
      JSCompiler_object_inline_preloads_1694 = {
        images: /* @__PURE__ */ new Map(),
        stylesheets: /* @__PURE__ */ new Map(),
        scripts: /* @__PURE__ */ new Map(),
        moduleScripts: /* @__PURE__ */ new Map(),
      };
    if (void 0 !== bootstrapScripts)
      for (var i = 0; i < bootstrapScripts.length; i++) {
        var scriptConfig = bootstrapScripts[i],
          src,
          crossOrigin = void 0,
          integrity = void 0,
          props = {
            rel: "preload",
            as: "script",
            fetchPriority: "low",
            nonce: void 0,
          };
        "string" === typeof scriptConfig
          ? (props.href = src = scriptConfig)
          : ((props.href = src = scriptConfig.src),
            (props.integrity = integrity =
              "string" === typeof scriptConfig.integrity ? scriptConfig.integrity : void 0),
            (props.crossOrigin = crossOrigin =
              "string" === typeof scriptConfig || null == scriptConfig.crossOrigin
                ? void 0
                : "use-credentials" === scriptConfig.crossOrigin
                  ? "use-credentials"
                  : ""));
        scriptConfig = resumableState;
        var href = src;
        scriptConfig.scriptResources[href] = null;
        scriptConfig.moduleScriptResources[href] = null;
        scriptConfig = [];
        pushLinkImpl(scriptConfig, props);
        JSCompiler_object_inline_bootstrapScripts_1691.add(scriptConfig);
        bootstrapChunks.push('<script src="', escapeTextForBrowser(src), '"');
        "string" === typeof integrity &&
          bootstrapChunks.push(' integrity="', escapeTextForBrowser(integrity), '"');
        "string" === typeof crossOrigin &&
          bootstrapChunks.push(' crossorigin="', escapeTextForBrowser(crossOrigin), '"');
        pushCompletedShellIdAttribute(bootstrapChunks, resumableState);
        bootstrapChunks.push(' async=""><\/script>');
      }
    if (void 0 !== bootstrapModules)
      for (bootstrapScripts = 0; bootstrapScripts < bootstrapModules.length; bootstrapScripts++)
        ((props = bootstrapModules[bootstrapScripts]),
          (crossOrigin = src = void 0),
          (integrity = {
            rel: "modulepreload",
            fetchPriority: "low",
            nonce: void 0,
          }),
          "string" === typeof props
            ? (integrity.href = i = props)
            : ((integrity.href = i = props.src),
              (integrity.integrity = crossOrigin =
                "string" === typeof props.integrity ? props.integrity : void 0),
              (integrity.crossOrigin = src =
                "string" === typeof props || null == props.crossOrigin
                  ? void 0
                  : "use-credentials" === props.crossOrigin
                    ? "use-credentials"
                    : "")),
          (props = resumableState),
          (scriptConfig = i),
          (props.scriptResources[scriptConfig] = null),
          (props.moduleScriptResources[scriptConfig] = null),
          (props = []),
          pushLinkImpl(props, integrity),
          JSCompiler_object_inline_bootstrapScripts_1691.add(props),
          bootstrapChunks.push('<script type="module" src="', escapeTextForBrowser(i), '"'),
          "string" === typeof crossOrigin &&
            bootstrapChunks.push(' integrity="', escapeTextForBrowser(crossOrigin), '"'),
          "string" === typeof src &&
            bootstrapChunks.push(' crossorigin="', escapeTextForBrowser(src), '"'),
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
          bootstrapChunks.push(' async=""><\/script>'));
    return {
      placeholderPrefix: bootstrapScriptContent,
      segmentPrefix: JSCompiler_object_inline_segmentPrefix_1673,
      boundaryPrefix: idPrefix,
      startInlineScript: "<script",
      startInlineStyle: "<style",
      preamble: { htmlChunks: null, headChunks: null, bodyChunks: null },
      externalRuntimeScript: null,
      bootstrapChunks,
      importMapChunks: [],
      onHeaders: void 0,
      headers: null,
      resets: {
        font: {},
        dns: {},
        connect: { default: {}, anonymous: {}, credentials: {} },
        image: {},
        style: {},
      },
      charsetChunks: [],
      viewportChunks: [],
      hoistableChunks: [],
      preconnects: JSCompiler_object_inline_preconnects_1687,
      fontPreloads: JSCompiler_object_inline_fontPreloads_1688,
      highImagePreloads: JSCompiler_object_inline_highImagePreloads_1689,
      styles: JSCompiler_object_inline_styles_1690,
      bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1691,
      scripts: JSCompiler_object_inline_scripts_1692,
      bulkPreloads: JSCompiler_object_inline_bulkPreloads_1693,
      preloads: JSCompiler_object_inline_preloads_1694,
      nonce: { script: void 0, style: void 0 },
      stylesToHoist: false,
      generateStaticMarkup,
    };
  }
  function pushTextInstance(target, text, renderState, textEmbedded) {
    if (renderState.generateStaticMarkup) return (target.push(escapeTextForBrowser(text)), false);
    "" === text
      ? (target = textEmbedded)
      : (textEmbedded && target.push("<!-- -->"),
        target.push(escapeTextForBrowser(text)),
        (target = true));
    return target;
  }
  function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
    renderState.generateStaticMarkup || (lastPushedText && textEmbedded && target.push("<!-- -->"));
  }
  var bind = Function.prototype.bind,
    REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE
        ? null
        : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type ||
            ((type = innerType.displayName || innerType.name || ""),
            (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
          return type;
        case REACT_MEMO_TYPE:
          return (
            (innerType = type.displayName || null),
            null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo"
          );
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x2) {}
      }
    return null;
  }
  var emptyContextObject = {},
    currentActiveSnapshot = null;
  function popToNearestCommonAncestor(prev, next) {
    if (prev !== next) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      var parentNext = next.parent;
      if (null === prev) {
        if (null !== parentNext)
          throw Error("The stacks must reach the root at the same time. This is a bug in React.");
      } else {
        if (null === parentNext)
          throw Error("The stacks must reach the root at the same time. This is a bug in React.");
        popToNearestCommonAncestor(prev, parentNext);
      }
      next.context._currentValue2 = next.value;
    }
  }
  function popAllPrevious(prev) {
    prev.context._currentValue2 = prev.parentValue;
    prev = prev.parent;
    null !== prev && popAllPrevious(prev);
  }
  function pushAllNext(next) {
    var parentNext = next.parent;
    null !== parentNext && pushAllNext(parentNext);
    next.context._currentValue2 = next.value;
  }
  function popPreviousToCommonLevel(prev, next) {
    prev.context._currentValue2 = prev.parentValue;
    prev = prev.parent;
    if (null === prev)
      throw Error(
        "The depth must equal at least at zero before reaching the root. This is a bug in React.",
      );
    prev.depth === next.depth
      ? popToNearestCommonAncestor(prev, next)
      : popPreviousToCommonLevel(prev, next);
  }
  function popNextToCommonLevel(prev, next) {
    var parentNext = next.parent;
    if (null === parentNext)
      throw Error(
        "The depth must equal at least at zero before reaching the root. This is a bug in React.",
      );
    prev.depth === parentNext.depth
      ? popToNearestCommonAncestor(prev, parentNext)
      : popNextToCommonLevel(prev, parentNext);
    next.context._currentValue2 = next.value;
  }
  function switchContext(newSnapshot) {
    var prev = currentActiveSnapshot;
    prev !== newSnapshot &&
      (null === prev
        ? pushAllNext(newSnapshot)
        : null === newSnapshot
          ? popAllPrevious(prev)
          : prev.depth === newSnapshot.depth
            ? popToNearestCommonAncestor(prev, newSnapshot)
            : prev.depth > newSnapshot.depth
              ? popPreviousToCommonLevel(prev, newSnapshot)
              : popNextToCommonLevel(prev, newSnapshot),
      (currentActiveSnapshot = newSnapshot));
  }
  var classComponentUpdater = {
      enqueueSetState: function (inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function (inst, payload) {
        inst = inst._reactInternals;
        inst.replace = true;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function () {},
    },
    emptyTreeContext = { id: 1, overflow: "" };
  function pushTreeContext(baseContext, totalChildren, index) {
    var baseIdWithLeadingBit = baseContext.id;
    baseContext = baseContext.overflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - (baseLength % 5);
      length = (baseIdWithLeadingBit & ((1 << numberOfOverflowBits) - 1)).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      return {
        id:
          (1 << (32 - clz32(totalChildren) + baseLength)) |
          (index << baseLength) |
          baseIdWithLeadingBit,
        overflow: length + baseContext,
      };
    }
    return {
      id: (1 << length) | (index << baseLength) | baseIdWithLeadingBit,
      overflow: baseContext,
    };
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
    log = Math.log,
    LN2 = Math.LN2;
  function clz32Fallback(x2) {
    x2 >>>= 0;
    return 0 === x2 ? 32 : (31 - ((log(x2) / LN2) | 0)) | 0;
  }
  function noop() {}
  var SuspenseException = Error(
    "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`.",
  );
  function trackUsedThenable(thenableState2, thenable, index) {
    index = thenableState2[index];
    void 0 === index
      ? thenableState2.push(thenable)
      : index !== thenable && (thenable.then(noop, noop), (thenable = index));
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        "string" === typeof thenable.status
          ? thenable.then(noop, noop)
          : ((thenableState2 = thenable),
            (thenableState2.status = "pending"),
            thenableState2.then(
              function (fulfilledValue) {
                if ("pending" === thenable.status) {
                  var fulfilledThenable = thenable;
                  fulfilledThenable.status = "fulfilled";
                  fulfilledThenable.value = fulfilledValue;
                }
              },
              function (error) {
                if ("pending" === thenable.status) {
                  var rejectedThenable = thenable;
                  rejectedThenable.status = "rejected";
                  rejectedThenable.reason = error;
                }
              },
            ));
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable)
      throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function is(x2, y2) {
    return (x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2)) || (x2 !== x2 && y2 !== y2);
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is,
    currentlyRenderingComponent = null,
    currentlyRenderingTask = null,
    currentlyRenderingRequest = null,
    currentlyRenderingKeyPath = null,
    firstWorkInProgressHook = null,
    workInProgressHook = null,
    isReRender = false,
    didScheduleRenderPhaseUpdate = false,
    localIdCounter = 0,
    actionStateCounter = 0,
    actionStateMatchingIndex = -1,
    thenableIndexCounter = 0,
    thenableState = null,
    renderPhaseUpdates = null,
    numberOfReRenders = 0;
  function resolveCurrentlyRenderingComponent() {
    if (null === currentlyRenderingComponent)
      throw Error(
        "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.",
      );
    return currentlyRenderingComponent;
  }
  function createHook() {
    if (0 < numberOfReRenders) throw Error("Rendered more hooks than during the previous render");
    return { memoizedState: null, queue: null, next: null };
  }
  function createWorkInProgressHook() {
    null === workInProgressHook
      ? null === firstWorkInProgressHook
        ? ((isReRender = false), (firstWorkInProgressHook = workInProgressHook = createHook()))
        : ((isReRender = true), (workInProgressHook = firstWorkInProgressHook))
      : null === workInProgressHook.next
        ? ((isReRender = false), (workInProgressHook = workInProgressHook.next = createHook()))
        : ((isReRender = true), (workInProgressHook = workInProgressHook.next));
    return workInProgressHook;
  }
  function getThenableStateAfterSuspending() {
    var state = thenableState;
    thenableState = null;
    return state;
  }
  function resetHooksState() {
    currentlyRenderingKeyPath =
      currentlyRenderingRequest =
      currentlyRenderingTask =
      currentlyRenderingComponent =
        null;
    didScheduleRenderPhaseUpdate = false;
    firstWorkInProgressHook = null;
    numberOfReRenders = 0;
    workInProgressHook = renderPhaseUpdates = null;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function useReducer(reducer, initialArg, init) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    if (isReRender) {
      var queue = workInProgressHook.queue;
      initialArg = queue.dispatch;
      if (
        null !== renderPhaseUpdates &&
        ((init = renderPhaseUpdates.get(queue)), void 0 !== init)
      ) {
        renderPhaseUpdates.delete(queue);
        queue = workInProgressHook.memoizedState;
        do ((queue = reducer(queue, init.action)), (init = init.next));
        while (null !== init);
        workInProgressHook.memoizedState = queue;
        return [queue, initialArg];
      }
      return [workInProgressHook.memoizedState, initialArg];
    }
    reducer =
      reducer === basicStateReducer
        ? "function" === typeof initialArg
          ? initialArg()
          : initialArg
        : void 0 !== init
          ? init(initialArg)
          : initialArg;
    workInProgressHook.memoizedState = reducer;
    reducer = workInProgressHook.queue = { last: null, dispatch: null };
    reducer = reducer.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, reducer);
    return [workInProgressHook.memoizedState, reducer];
  }
  function useMemo(nextCreate, deps) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    if (null !== workInProgressHook) {
      var prevState = workInProgressHook.memoizedState;
      if (null !== prevState && null !== deps) {
        var prevDeps = prevState[1];
        a: if (null === prevDeps) prevDeps = false;
        else {
          for (var i = 0; i < prevDeps.length && i < deps.length; i++)
            if (!objectIs(deps[i], prevDeps[i])) {
              prevDeps = false;
              break a;
            }
          prevDeps = true;
        }
        if (prevDeps) return prevState[0];
      }
    }
    nextCreate = nextCreate();
    workInProgressHook.memoizedState = [nextCreate, deps];
    return nextCreate;
  }
  function dispatchAction(componentIdentity, queue, action) {
    if (25 <= numberOfReRenders)
      throw Error(
        "Too many re-renders. React limits the number of renders to prevent an infinite loop.",
      );
    if (componentIdentity === currentlyRenderingComponent)
      if (
        ((didScheduleRenderPhaseUpdate = true),
        (componentIdentity = { action, next: null }),
        null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()),
        (action = renderPhaseUpdates.get(queue)),
        void 0 === action)
      )
        renderPhaseUpdates.set(queue, componentIdentity);
      else {
        for (queue = action; null !== queue.next; ) queue = queue.next;
        queue.next = componentIdentity;
      }
  }
  function throwOnUseEffectEventCall() {
    throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
  }
  function unsupportedStartTransition() {
    throw Error("startTransition cannot be called during server rendering.");
  }
  function unsupportedSetOptimisticState() {
    throw Error("Cannot update optimistic state while rendering.");
  }
  function useActionState(action, initialState, permalink) {
    resolveCurrentlyRenderingComponent();
    var actionStateHookIndex = actionStateCounter++,
      request = currentlyRenderingRequest;
    if ("function" === typeof action.$$FORM_ACTION) {
      var nextPostbackStateKey = null,
        componentKeyPath = currentlyRenderingKeyPath;
      request = request.formState;
      var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
      if (null !== request && "function" === typeof isSignatureEqual) {
        var postbackKey = request[1];
        isSignatureEqual.call(action, request[2], request[3]) &&
          ((nextPostbackStateKey =
            void 0 !== permalink
              ? "p" + permalink
              : "k" +
                murmurhash3_32_gc(
                  JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
                  0,
                )),
          postbackKey === nextPostbackStateKey &&
            ((actionStateMatchingIndex = actionStateHookIndex), (initialState = request[0])));
      }
      var boundAction = action.bind(null, initialState);
      action = function (payload) {
        boundAction(payload);
      };
      "function" === typeof boundAction.$$FORM_ACTION &&
        (action.$$FORM_ACTION = function (prefix3) {
          prefix3 = boundAction.$$FORM_ACTION(prefix3);
          void 0 !== permalink && ((permalink += ""), (prefix3.action = permalink));
          var formData = prefix3.data;
          formData &&
            (null === nextPostbackStateKey &&
              (nextPostbackStateKey =
                void 0 !== permalink
                  ? "p" + permalink
                  : "k" +
                    murmurhash3_32_gc(
                      JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
                      0,
                    )),
            formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix3;
        });
      return [initialState, action, false];
    }
    var boundAction$22 = action.bind(null, initialState);
    return [
      initialState,
      function (payload) {
        boundAction$22(payload);
      },
      false,
    ];
  }
  function unwrapThenable(thenable) {
    var index = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    return trackUsedThenable(thenableState, thenable, index);
  }
  function unsupportedRefresh() {
    throw Error("Cache cannot be refreshed during server rendering.");
  }
  var HooksDispatcher = {
      readContext: function (context) {
        return context._currentValue2;
      },
      use: function (usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue2;
        }
        throw Error("An unsupported type was passed to use(): " + String(usable));
      },
      useContext: function (context) {
        resolveCurrentlyRenderingComponent();
        return context._currentValue2;
      },
      useMemo,
      useReducer,
      useRef: function (initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        return null === previousRef
          ? ((initialValue = { current: initialValue }),
            (workInProgressHook.memoizedState = initialValue))
          : previousRef;
      },
      useState: function (initialState) {
        return useReducer(basicStateReducer, initialState);
      },
      useInsertionEffect: noop,
      useLayoutEffect: noop,
      useCallback: function (callback, deps) {
        return useMemo(function () {
          return callback;
        }, deps);
      },
      useImperativeHandle: noop,
      useEffect: noop,
      useDebugValue: noop,
      useDeferredValue: function (value, initialValue) {
        resolveCurrentlyRenderingComponent();
        return void 0 !== initialValue ? initialValue : value;
      },
      useTransition: function () {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      },
      useId: function () {
        var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
        var overflow = JSCompiler_inline_result.overflow;
        JSCompiler_inline_result = JSCompiler_inline_result.id;
        JSCompiler_inline_result =
          (JSCompiler_inline_result & ~(1 << (32 - clz32(JSCompiler_inline_result) - 1))).toString(
            32,
          ) + overflow;
        var resumableState = currentResumableState;
        if (null === resumableState)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component.",
          );
        overflow = localIdCounter++;
        JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
        0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
        return JSCompiler_inline_result + "_";
      },
      useSyncExternalStore: function (subscribe2, getSnapshot, getServerSnapshot) {
        if (void 0 === getServerSnapshot)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.",
          );
        return getServerSnapshot();
      },
      useOptimistic: function (passthrough) {
        resolveCurrentlyRenderingComponent();
        return [passthrough, unsupportedSetOptimisticState];
      },
      useActionState,
      useFormState: useActionState,
      useHostTransitionStatus: function () {
        resolveCurrentlyRenderingComponent();
        return sharedNotPendingObject;
      },
      useMemoCache: function (size) {
        for (var data = Array(size), i = 0; i < size; i++) data[i] = REACT_MEMO_CACHE_SENTINEL;
        return data;
      },
      useCacheRefresh: function () {
        return unsupportedRefresh;
      },
      useEffectEvent: function () {
        return throwOnUseEffectEventCall;
      },
    },
    currentResumableState = null,
    DefaultAsyncDispatcher = {
      getCacheForType: function () {
        throw Error("Not implemented.");
      },
      cacheSignal: function () {
        throw Error("Not implemented.");
      },
    },
    prefix2,
    suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix2)
      try {
        throw Error();
      } catch (x2) {
        var match = x2.stack.trim().match(/\n( *(at )?)/);
        prefix2 = (match && match[1]) || "";
        suffix =
          -1 < x2.stack.indexOf("\n    at")
            ? " (<anonymous>)"
            : -1 < x2.stack.indexOf("@")
              ? "@unknown:0:0"
              : "";
      }
    return "\n" + prefix2 + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn2, construct) {
    if (!fn2 || reentry) return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function () {
          try {
            if (construct) {
              var Fake = function () {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function () {
                  throw Error();
                },
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x2) {
                  var control = x2;
                }
                Reflect.construct(fn2, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$24) {
                  control = x$24;
                }
                fn2.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$25) {
                control = x$25;
              }
              (Fake = fn2()) && "function" === typeof Fake.catch && Fake.catch(function () {});
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        },
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name",
      );
      namePropDescriptor &&
        namePropDescriptor.configurable &&
        Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
        sampleStack = _RunInRootFrame$Deter[0],
        controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"),
          controlLines = controlStack.split("\n");
        for (
          namePropDescriptor = RunInRootFrame = 0;
          RunInRootFrame < sampleLines.length &&
          !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");
        )
          RunInRootFrame++;
        for (
          ;
          namePropDescriptor < controlLines.length &&
          !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");
        )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (
            RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1;
            1 <= RunInRootFrame &&
            0 <= namePropDescriptor &&
            sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];
          )
            namePropDescriptor--;
        for (
          ;
          1 <= RunInRootFrame && 0 <= namePropDescriptor;
          RunInRootFrame--, namePropDescriptor--
        )
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (
                  (RunInRootFrame--,
                  namePropDescriptor--,
                  0 > namePropDescriptor ||
                    sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor])
                ) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn2.displayName &&
                    frame.includes("<anonymous>") &&
                    (frame = frame.replace("<anonymous>", fn2.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      ((reentry = false), (Error.prepareStackTrace = previousPrepareStackTrace));
    }
    return (previousPrepareStackTrace = fn2 ? fn2.displayName || fn2.name : "")
      ? describeBuiltInComponentFrame(previousPrepareStackTrace)
      : "";
  }
  function describeComponentStackByType(type) {
    if ("string" === typeof type) return describeBuiltInComponentFrame(type);
    if ("function" === typeof type)
      return type.prototype && type.prototype.isReactComponent
        ? describeNativeComponentFrame(type, true)
        : describeNativeComponentFrame(type, false);
    if ("object" === typeof type && null !== type) {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeNativeComponentFrame(type.render, false);
        case REACT_MEMO_TYPE:
          return describeNativeComponentFrame(type.type, false);
        case REACT_LAZY_TYPE:
          var lazyComponent = type,
            payload = lazyComponent._payload;
          lazyComponent = lazyComponent._init;
          try {
            type = lazyComponent(payload);
          } catch (x2) {
            return describeBuiltInComponentFrame("Lazy");
          }
          return describeComponentStackByType(type);
      }
      if ("string" === typeof type.name) {
        a: {
          payload = type.name;
          lazyComponent = type.env;
          var location = type.debugLocation;
          if (
            null != location &&
            ((type = Error.prepareStackTrace),
            (Error.prepareStackTrace = void 0),
            (location = location.stack),
            (Error.prepareStackTrace = type),
            location.startsWith("Error: react-stack-top-frame\n") &&
              (location = location.slice(29)),
            (type = location.indexOf("\n")),
            -1 !== type && (location = location.slice(type + 1)),
            (type = location.indexOf("react_stack_bottom_frame")),
            -1 !== type && (type = location.lastIndexOf("\n", type)),
            (type = -1 !== type ? (location = location.slice(0, type)) : ""),
            (location = type.lastIndexOf("\n")),
            (type = -1 === location ? type : type.slice(location + 1)),
            -1 !== type.indexOf(payload))
          ) {
            payload = "\n" + type;
            break a;
          }
          payload = describeBuiltInComponentFrame(
            payload + (lazyComponent ? " [" + lazyComponent + "]" : ""),
          );
        }
        return payload;
      }
    }
    switch (type) {
      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame("SuspenseList");
      case REACT_SUSPENSE_TYPE:
        return describeBuiltInComponentFrame("Suspense");
    }
    return "";
  }
  function isEligibleForOutlining(request, boundary) {
    return (500 < boundary.byteSize || false) && null === boundary.contentPreamble;
  }
  function defaultErrorHandler(error) {
    if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
      var JSCompiler_inline_result = error.environmentName;
      error = [error].slice(0);
      "string" === typeof error[0]
        ? error.splice(0, 1, "[%s] " + error[0], " " + JSCompiler_inline_result + " ")
        : error.splice(0, 0, "[%s]", " " + JSCompiler_inline_result + " ");
      error.unshift(console);
      JSCompiler_inline_result = bind.apply(console.error, error);
      JSCompiler_inline_result();
    } else console.error(error);
    return null;
  }
  function RequestInstance(
    resumableState,
    renderState,
    rootFormatContext,
    progressiveChunkSize,
    onError2,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
    formState,
  ) {
    var abortSet = /* @__PURE__ */ new Set();
    this.destination = null;
    this.flushScheduled = false;
    this.resumableState = resumableState;
    this.renderState = renderState;
    this.rootFormatContext = rootFormatContext;
    this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
    this.status = 10;
    this.fatalError = null;
    this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
    this.completedPreambleSegments = this.completedRootSegment = null;
    this.byteSize = 0;
    this.abortableTasks = abortSet;
    this.pingedTasks = [];
    this.clientRenderedBoundaries = [];
    this.completedBoundaries = [];
    this.partialBoundaries = [];
    this.trackedPostpones = null;
    this.onError = void 0 === onError2 ? defaultErrorHandler : onError2;
    this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
    this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
    this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
    this.onShellError = void 0 === onShellError ? noop : onShellError;
    this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
    this.formState = void 0 === formState ? null : formState;
  }
  function createRequest(
    children,
    resumableState,
    renderState,
    rootFormatContext,
    progressiveChunkSize,
    onError2,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
    formState,
  ) {
    resumableState = new RequestInstance(
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError2,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      formState,
    );
    renderState = createPendingSegment(resumableState, 0, null, rootFormatContext, false, false);
    renderState.parentFlushed = true;
    children = createRenderTask(
      resumableState,
      null,
      children,
      -1,
      null,
      renderState,
      null,
      null,
      resumableState.abortableTasks,
      null,
      rootFormatContext,
      null,
      emptyTreeContext,
      null,
      null,
    );
    pushComponentStack(children);
    resumableState.pingedTasks.push(children);
    return resumableState;
  }
  var currentRequest = null;
  function pingTask(request, task) {
    request.pingedTasks.push(task);
    1 === request.pingedTasks.length &&
      ((request.flushScheduled = null !== request.destination), performWork(request));
  }
  function createSuspenseBoundary(
    request,
    row,
    fallbackAbortableTasks,
    contentPreamble,
    fallbackPreamble,
  ) {
    fallbackAbortableTasks = {
      status: 0,
      rootSegmentID: -1,
      parentFlushed: false,
      pendingTasks: 0,
      row,
      completedSegments: [],
      byteSize: 0,
      fallbackAbortableTasks,
      errorDigest: null,
      contentState: createHoistableState(),
      fallbackState: createHoistableState(),
      contentPreamble,
      fallbackPreamble,
      trackedContentKeyPath: null,
      trackedFallbackNode: null,
    };
    null !== row &&
      (row.pendingTasks++,
      (contentPreamble = row.boundaries),
      null !== contentPreamble &&
        (request.allPendingTasks++,
        fallbackAbortableTasks.pendingTasks++,
        contentPreamble.push(fallbackAbortableTasks)),
      (request = row.inheritedHoistables),
      null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
    return fallbackAbortableTasks;
  }
  function createRenderTask(
    request,
    thenableState2,
    node,
    childIndex,
    blockedBoundary,
    blockedSegment,
    blockedPreamble,
    hoistableState,
    abortSet,
    keyPath,
    formatContext,
    context,
    treeContext,
    row,
    componentStack,
  ) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    var task = {
      replay: null,
      node,
      childIndex,
      ping: function () {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment,
      blockedPreamble,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2,
    };
    abortSet.add(task);
    return task;
  }
  function createReplayTask(
    request,
    thenableState2,
    replay,
    node,
    childIndex,
    blockedBoundary,
    hoistableState,
    abortSet,
    keyPath,
    formatContext,
    context,
    treeContext,
    row,
    componentStack,
  ) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    replay.pendingTasks++;
    var task = {
      replay,
      node,
      childIndex,
      ping: function () {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment: null,
      blockedPreamble: null,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2,
    };
    abortSet.add(task);
    return task;
  }
  function createPendingSegment(
    request,
    index,
    boundary,
    parentFormatContext,
    lastPushedText,
    textEmbedded,
  ) {
    return {
      status: 0,
      parentFlushed: false,
      id: -1,
      index,
      chunks: [],
      children: [],
      preambleChildren: [],
      parentFormatContext,
      boundary,
      lastPushedText,
      textEmbedded,
    };
  }
  function pushComponentStack(task) {
    var node = task.node;
    if ("object" === typeof node && null !== node)
      switch (node.$$typeof) {
        case REACT_ELEMENT_TYPE:
          task.componentStack = { parent: task.componentStack, type: node.type };
      }
  }
  function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
    return null === componentStack
      ? null
      : { parent: componentStack.parent, type: "Suspense Fallback" };
  }
  function getThrownInfo(node$jscomp$0) {
    var errorInfo = {};
    node$jscomp$0 &&
      Object.defineProperty(errorInfo, "componentStack", {
        configurable: true,
        enumerable: true,
        get: function () {
          try {
            var info = "",
              node = node$jscomp$0;
            do ((info += describeComponentStackByType(node.type)), (node = node.parent));
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x2) {
            JSCompiler_inline_result = "\nError generating stack: " + x2.message + "\n" + x2.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result,
          });
          return JSCompiler_inline_result;
        },
      });
    return errorInfo;
  }
  function logRecoverableError(request, error, errorInfo) {
    request = request.onError;
    error = request(error, errorInfo);
    if (null == error || "string" === typeof error) return error;
  }
  function fatalError(request, error) {
    var onShellError = request.onShellError,
      onFatalError = request.onFatalError;
    onShellError(error);
    onFatalError(error);
    null !== request.destination
      ? ((request.status = 14), request.destination.destroy(error))
      : ((request.status = 13), (request.fatalError = error));
  }
  function finishSuspenseListRow(request, row) {
    unblockSuspenseListRow(request, row.next, row.hoistables);
  }
  function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
    for (; null !== unblockedRow; ) {
      null !== inheritedHoistables &&
        (hoistHoistables(unblockedRow.hoistables, inheritedHoistables),
        (unblockedRow.inheritedHoistables = inheritedHoistables));
      var unblockedBoundaries = unblockedRow.boundaries;
      if (null !== unblockedBoundaries) {
        unblockedRow.boundaries = null;
        for (var i = 0; i < unblockedBoundaries.length; i++) {
          var unblockedBoundary = unblockedBoundaries[i];
          null !== inheritedHoistables &&
            hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
          finishedTask(request, unblockedBoundary, null, null);
        }
      }
      unblockedRow.pendingTasks--;
      if (0 < unblockedRow.pendingTasks) break;
      inheritedHoistables = unblockedRow.hoistables;
      unblockedRow = unblockedRow.next;
    }
  }
  function tryToResolveTogetherRow(request, togetherRow) {
    var boundaries = togetherRow.boundaries;
    if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
      for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
        var rowBoundary = boundaries[i];
        if (
          1 !== rowBoundary.pendingTasks ||
          rowBoundary.parentFlushed ||
          isEligibleForOutlining(request, rowBoundary)
        ) {
          allCompleteAndInlinable = false;
          break;
        }
      }
      allCompleteAndInlinable &&
        unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
    }
  }
  function createSuspenseListRow(previousRow) {
    var newRow = {
      pendingTasks: 1,
      boundaries: null,
      hoistables: createHoistableState(),
      inheritedHoistables: null,
      together: false,
      next: null,
    };
    null !== previousRow &&
      0 < previousRow.pendingTasks &&
      (newRow.pendingTasks++, (newRow.boundaries = []), (previousRow.next = newRow));
    return newRow;
  }
  function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
    var prevKeyPath = task.keyPath,
      prevTreeContext = task.treeContext,
      prevRow = task.row;
    task.keyPath = keyPath;
    keyPath = rows.length;
    var previousSuspenseListRow = null;
    if (null !== task.replay) {
      var resumeSlots = task.replay.slots;
      if (null !== resumeSlots && "object" === typeof resumeSlots)
        for (var n = 0; n < keyPath; n++) {
          var i =
              "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder
                ? n
                : keyPath - 1 - n,
            node = rows[i];
          task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
          task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
          var resumeSegmentID = resumeSlots[i];
          "number" === typeof resumeSegmentID
            ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i])
            : renderNode(request, task, node, i);
          0 === --previousSuspenseListRow.pendingTasks &&
            finishSuspenseListRow(request, previousSuspenseListRow);
        }
      else
        for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
          ((n =
            "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder
              ? resumeSlots
              : keyPath - 1 - resumeSlots),
            (i = rows[n]),
            (task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow)),
            (task.treeContext = pushTreeContext(prevTreeContext, keyPath, n)),
            renderNode(request, task, i, n),
            0 === --previousSuspenseListRow.pendingTasks &&
              finishSuspenseListRow(request, previousSuspenseListRow));
    } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
      for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
        ((resumeSlots = rows[revealOrder]),
          (task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow)),
          (task.treeContext = pushTreeContext(prevTreeContext, keyPath, revealOrder)),
          renderNode(request, task, resumeSlots, revealOrder),
          0 === --previousSuspenseListRow.pendingTasks &&
            finishSuspenseListRow(request, previousSuspenseListRow));
    else {
      revealOrder = task.blockedSegment;
      resumeSlots = revealOrder.children.length;
      n = revealOrder.chunks.length;
      for (i = keyPath - 1; 0 <= i; i--) {
        node = rows[i];
        task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
        task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
        resumeSegmentID = createPendingSegment(
          request,
          n,
          null,
          task.formatContext,
          0 === i ? revealOrder.lastPushedText : true,
          true,
        );
        revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
        task.blockedSegment = resumeSegmentID;
        try {
          (renderNode(request, task, node, i),
            pushSegmentFinale(
              resumeSegmentID.chunks,
              request.renderState,
              resumeSegmentID.lastPushedText,
              resumeSegmentID.textEmbedded,
            ),
            (resumeSegmentID.status = 1),
            0 === --previousSuspenseListRow.pendingTasks &&
              finishSuspenseListRow(request, previousSuspenseListRow));
        } catch (thrownValue) {
          throw ((resumeSegmentID.status = 12 === request.status ? 3 : 4), thrownValue);
        }
      }
      task.blockedSegment = revealOrder;
      revealOrder.lastPushedText = false;
    }
    null !== prevRow &&
      null !== previousSuspenseListRow &&
      0 < previousSuspenseListRow.pendingTasks &&
      (prevRow.pendingTasks++, (previousSuspenseListRow.next = prevRow));
    task.treeContext = prevTreeContext;
    task.row = prevRow;
    task.keyPath = prevKeyPath;
  }
  function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
    var prevThenableState = task.thenableState;
    task.thenableState = null;
    currentlyRenderingComponent = {};
    currentlyRenderingTask = task;
    currentlyRenderingRequest = request;
    currentlyRenderingKeyPath = keyPath;
    actionStateCounter = localIdCounter = 0;
    actionStateMatchingIndex = -1;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
      ((didScheduleRenderPhaseUpdate = false),
        (actionStateCounter = localIdCounter = 0),
        (actionStateMatchingIndex = -1),
        (thenableIndexCounter = 0),
        (numberOfReRenders += 1),
        (workInProgressHook = null),
        (request = Component(props, secondArg)));
    resetHooksState();
    return request;
  }
  function finishFunctionComponent(
    request,
    task,
    keyPath,
    children,
    hasId,
    actionStateCount,
    actionStateMatchingIndex2,
  ) {
    var didEmitActionStateMarkers = false;
    if (0 !== actionStateCount && null !== request.formState) {
      var segment = task.blockedSegment;
      if (null !== segment) {
        didEmitActionStateMarkers = true;
        segment = segment.chunks;
        for (var i = 0; i < actionStateCount; i++)
          i === actionStateMatchingIndex2 ? segment.push("<!--F!-->") : segment.push("<!--F-->");
      }
    }
    actionStateCount = task.keyPath;
    task.keyPath = keyPath;
    hasId
      ? ((keyPath = task.treeContext),
        (task.treeContext = pushTreeContext(keyPath, 1, 0)),
        renderNode(request, task, children, -1),
        (task.treeContext = keyPath))
      : didEmitActionStateMarkers
        ? renderNode(request, task, children, -1)
        : renderNodeDestructive(request, task, children, -1);
    task.keyPath = actionStateCount;
  }
  function renderElement(request, task, keyPath, type, props, ref) {
    if ("function" === typeof type)
      if (type.prototype && type.prototype.isReactComponent) {
        var newProps = props;
        if ("ref" in props) {
          newProps = {};
          for (var propName in props) "ref" !== propName && (newProps[propName] = props[propName]);
        }
        var defaultProps = type.defaultProps;
        if (defaultProps) {
          newProps === props && (newProps = assign({}, newProps, props));
          for (var propName$43 in defaultProps)
            void 0 === newProps[propName$43] && (newProps[propName$43] = defaultProps[propName$43]);
        }
        props = newProps;
        newProps = emptyContextObject;
        defaultProps = type.contextType;
        "object" === typeof defaultProps &&
          null !== defaultProps &&
          (newProps = defaultProps._currentValue2);
        newProps = new type(props, newProps);
        var initialState = void 0 !== newProps.state ? newProps.state : null;
        newProps.updater = classComponentUpdater;
        newProps.props = props;
        newProps.state = initialState;
        defaultProps = { queue: [], replace: false };
        newProps._reactInternals = defaultProps;
        ref = type.contextType;
        newProps.context =
          "object" === typeof ref && null !== ref ? ref._currentValue2 : emptyContextObject;
        ref = type.getDerivedStateFromProps;
        "function" === typeof ref &&
          ((ref = ref(props, initialState)),
          (initialState =
            null === ref || void 0 === ref ? initialState : assign({}, initialState, ref)),
          (newProps.state = initialState));
        if (
          "function" !== typeof type.getDerivedStateFromProps &&
          "function" !== typeof newProps.getSnapshotBeforeUpdate &&
          ("function" === typeof newProps.UNSAFE_componentWillMount ||
            "function" === typeof newProps.componentWillMount)
        )
          if (
            ((type = newProps.state),
            "function" === typeof newProps.componentWillMount && newProps.componentWillMount(),
            "function" === typeof newProps.UNSAFE_componentWillMount &&
              newProps.UNSAFE_componentWillMount(),
            type !== newProps.state &&
              classComponentUpdater.enqueueReplaceState(newProps, newProps.state, null),
            null !== defaultProps.queue && 0 < defaultProps.queue.length)
          )
            if (
              ((type = defaultProps.queue),
              (ref = defaultProps.replace),
              (defaultProps.queue = null),
              (defaultProps.replace = false),
              ref && 1 === type.length)
            )
              newProps.state = type[0];
            else {
              defaultProps = ref ? type[0] : newProps.state;
              initialState = true;
              for (ref = ref ? 1 : 0; ref < type.length; ref++)
                ((propName$43 = type[ref]),
                  (propName$43 =
                    "function" === typeof propName$43
                      ? propName$43.call(newProps, defaultProps, props, void 0)
                      : propName$43),
                  null != propName$43 &&
                    (initialState
                      ? ((initialState = false),
                        (defaultProps = assign({}, defaultProps, propName$43)))
                      : assign(defaultProps, propName$43)));
              newProps.state = defaultProps;
            }
          else defaultProps.queue = null;
        type = newProps.render();
        if (12 === request.status) throw null;
        props = task.keyPath;
        task.keyPath = keyPath;
        renderNodeDestructive(request, task, type, -1);
        task.keyPath = props;
      } else {
        type = renderWithHooks(request, task, keyPath, type, props, void 0);
        if (12 === request.status) throw null;
        finishFunctionComponent(
          request,
          task,
          keyPath,
          type,
          0 !== localIdCounter,
          actionStateCounter,
          actionStateMatchingIndex,
        );
      }
    else if ("string" === typeof type)
      if (((newProps = task.blockedSegment), null === newProps))
        ((newProps = props.children),
          (defaultProps = task.formatContext),
          (initialState = task.keyPath),
          (task.formatContext = getChildFormatContext(defaultProps, type, props)),
          (task.keyPath = keyPath),
          renderNode(request, task, newProps, -1),
          (task.formatContext = defaultProps),
          (task.keyPath = initialState));
      else {
        initialState = pushStartInstance(
          newProps.chunks,
          type,
          props,
          request.resumableState,
          request.renderState,
          task.blockedPreamble,
          task.hoistableState,
          task.formatContext,
          newProps.lastPushedText,
        );
        newProps.lastPushedText = false;
        defaultProps = task.formatContext;
        ref = task.keyPath;
        task.keyPath = keyPath;
        if (
          3 ===
          (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode
        ) {
          keyPath = createPendingSegment(request, 0, null, task.formatContext, false, false);
          newProps.preambleChildren.push(keyPath);
          task.blockedSegment = keyPath;
          try {
            ((keyPath.status = 6),
              renderNode(request, task, initialState, -1),
              pushSegmentFinale(
                keyPath.chunks,
                request.renderState,
                keyPath.lastPushedText,
                keyPath.textEmbedded,
              ),
              (keyPath.status = 1));
          } finally {
            task.blockedSegment = newProps;
          }
        } else renderNode(request, task, initialState, -1);
        task.formatContext = defaultProps;
        task.keyPath = ref;
        a: {
          task = newProps.chunks;
          request = request.resumableState;
          switch (type) {
            case "title":
            case "style":
            case "script":
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr":
              break a;
            case "body":
              if (1 >= defaultProps.insertionMode) {
                request.hasBody = true;
                break a;
              }
              break;
            case "html":
              if (0 === defaultProps.insertionMode) {
                request.hasHtml = true;
                break a;
              }
              break;
            case "head":
              if (1 >= defaultProps.insertionMode) break a;
          }
          task.push(endChunkForTag(type));
        }
        newProps.lastPushedText = false;
      }
    else {
      switch (type) {
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_STRICT_MODE_TYPE:
        case REACT_PROFILER_TYPE:
        case REACT_FRAGMENT_TYPE:
          type = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, props.children, -1);
          task.keyPath = type;
          return;
        case REACT_ACTIVITY_TYPE:
          type = task.blockedSegment;
          null === type
            ? "hidden" !== props.mode &&
              ((type = task.keyPath),
              (task.keyPath = keyPath),
              renderNode(request, task, props.children, -1),
              (task.keyPath = type))
            : "hidden" !== props.mode &&
              (request.renderState.generateStaticMarkup || type.chunks.push("<!--&-->"),
              (type.lastPushedText = false),
              (newProps = task.keyPath),
              (task.keyPath = keyPath),
              renderNode(request, task, props.children, -1),
              (task.keyPath = newProps),
              request.renderState.generateStaticMarkup || type.chunks.push("<!--/&-->"),
              (type.lastPushedText = false));
          return;
        case REACT_SUSPENSE_LIST_TYPE:
          a: {
            type = props.children;
            props = props.revealOrder;
            if (
              "forwards" === props ||
              "backwards" === props ||
              "unstable_legacy-backwards" === props
            ) {
              if (isArrayImpl(type)) {
                renderSuspenseListRows(request, task, keyPath, type, props);
                break a;
              }
              if ((newProps = getIteratorFn(type))) {
                if ((newProps = newProps.call(type))) {
                  defaultProps = newProps.next();
                  if (!defaultProps.done) {
                    do defaultProps = newProps.next();
                    while (!defaultProps.done);
                    renderSuspenseListRows(request, task, keyPath, type, props);
                  }
                  break a;
                }
              }
            }
            "together" === props
              ? ((props = task.keyPath),
                (newProps = task.row),
                (defaultProps = task.row = createSuspenseListRow(null)),
                (defaultProps.boundaries = []),
                (defaultProps.together = true),
                (task.keyPath = keyPath),
                renderNodeDestructive(request, task, type, -1),
                0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps),
                (task.keyPath = props),
                (task.row = newProps),
                null !== newProps &&
                  0 < defaultProps.pendingTasks &&
                  (newProps.pendingTasks++, (defaultProps.next = newProps)))
              : ((props = task.keyPath),
                (task.keyPath = keyPath),
                renderNodeDestructive(request, task, type, -1),
                (task.keyPath = props));
          }
          return;
        case REACT_VIEW_TRANSITION_TYPE:
        case REACT_SCOPE_TYPE:
          throw Error("ReactDOMServer does not yet support scope components.");
        case REACT_SUSPENSE_TYPE:
          a: if (null !== task.replay) {
            type = task.keyPath;
            newProps = task.formatContext;
            defaultProps = task.row;
            task.keyPath = keyPath;
            task.formatContext = getSuspenseContentFormatContext(request.resumableState, newProps);
            task.row = null;
            keyPath = props.children;
            try {
              renderNode(request, task, keyPath, -1);
            } finally {
              ((task.keyPath = type), (task.formatContext = newProps), (task.row = defaultProps));
            }
          } else {
            type = task.keyPath;
            ref = task.formatContext;
            var prevRow = task.row,
              parentBoundary = task.blockedBoundary;
            propName$43 = task.blockedPreamble;
            var parentHoistableState = task.hoistableState;
            propName = task.blockedSegment;
            var fallback = props.fallback;
            props = props.children;
            var fallbackAbortSet = /* @__PURE__ */ new Set();
            var newBoundary = createSuspenseBoundary(
              request,
              task.row,
              fallbackAbortSet,
              null,
              null,
            );
            null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
            var boundarySegment = createPendingSegment(
              request,
              propName.chunks.length,
              newBoundary,
              task.formatContext,
              false,
              false,
            );
            propName.children.push(boundarySegment);
            propName.lastPushedText = false;
            var contentRootSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false,
            );
            contentRootSegment.parentFlushed = true;
            if (null !== request.trackedPostpones) {
              newProps = task.componentStack;
              defaultProps = [keyPath[0], "Suspense Fallback", keyPath[2]];
              initialState = [defaultProps[1], defaultProps[2], [], null];
              request.trackedPostpones.workingMap.set(defaultProps, initialState);
              newBoundary.trackedFallbackNode = initialState;
              task.blockedSegment = boundarySegment;
              task.blockedPreamble = newBoundary.fallbackPreamble;
              task.keyPath = defaultProps;
              task.formatContext = getSuspenseFallbackFormatContext(request.resumableState, ref);
              task.componentStack =
                replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
              boundarySegment.status = 6;
              try {
                (renderNode(request, task, fallback, -1),
                  pushSegmentFinale(
                    boundarySegment.chunks,
                    request.renderState,
                    boundarySegment.lastPushedText,
                    boundarySegment.textEmbedded,
                  ),
                  (boundarySegment.status = 1));
              } catch (thrownValue) {
                throw ((boundarySegment.status = 12 === request.status ? 3 : 4), thrownValue);
              } finally {
                ((task.blockedSegment = propName),
                  (task.blockedPreamble = propName$43),
                  (task.keyPath = type),
                  (task.formatContext = ref));
              }
              task = createRenderTask(
                request,
                null,
                props,
                -1,
                newBoundary,
                contentRootSegment,
                newBoundary.contentPreamble,
                newBoundary.contentState,
                task.abortSet,
                keyPath,
                getSuspenseContentFormatContext(request.resumableState, task.formatContext),
                task.context,
                task.treeContext,
                null,
                newProps,
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            } else {
              task.blockedBoundary = newBoundary;
              task.blockedPreamble = newBoundary.contentPreamble;
              task.hoistableState = newBoundary.contentState;
              task.blockedSegment = contentRootSegment;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(request.resumableState, ref);
              task.row = null;
              contentRootSegment.status = 6;
              try {
                if (
                  (renderNode(request, task, props, -1),
                  pushSegmentFinale(
                    contentRootSegment.chunks,
                    request.renderState,
                    contentRootSegment.lastPushedText,
                    contentRootSegment.textEmbedded,
                  ),
                  (contentRootSegment.status = 1),
                  queueCompletedSegment(newBoundary, contentRootSegment),
                  0 === newBoundary.pendingTasks && 0 === newBoundary.status)
                ) {
                  if (((newBoundary.status = 1), !isEligibleForOutlining(request, newBoundary))) {
                    null !== prevRow &&
                      0 === --prevRow.pendingTasks &&
                      finishSuspenseListRow(request, prevRow);
                    0 === request.pendingRootTasks &&
                      task.blockedPreamble &&
                      preparePreamble(request);
                    break a;
                  }
                } else
                  null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
              } catch (thrownValue$30) {
                ((newBoundary.status = 4),
                  12 === request.status
                    ? ((contentRootSegment.status = 3), (newProps = request.fatalError))
                    : ((contentRootSegment.status = 4), (newProps = thrownValue$30)),
                  (defaultProps = getThrownInfo(task.componentStack)),
                  (initialState = logRecoverableError(request, newProps, defaultProps)),
                  (newBoundary.errorDigest = initialState),
                  untrackBoundary(request, newBoundary));
              } finally {
                ((task.blockedBoundary = parentBoundary),
                  (task.blockedPreamble = propName$43),
                  (task.hoistableState = parentHoistableState),
                  (task.blockedSegment = propName),
                  (task.keyPath = type),
                  (task.formatContext = ref),
                  (task.row = prevRow));
              }
              task = createRenderTask(
                request,
                null,
                fallback,
                -1,
                parentBoundary,
                boundarySegment,
                newBoundary.fallbackPreamble,
                newBoundary.fallbackState,
                fallbackAbortSet,
                [keyPath[0], "Suspense Fallback", keyPath[2]],
                getSuspenseFallbackFormatContext(request.resumableState, task.formatContext),
                task.context,
                task.treeContext,
                task.row,
                replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack),
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            }
          }
          return;
      }
      if ("object" === typeof type && null !== type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            if ("ref" in props)
              for (fallback in ((newProps = {}), props))
                "ref" !== fallback && (newProps[fallback] = props[fallback]);
            else newProps = props;
            type = renderWithHooks(request, task, keyPath, type.render, newProps, ref);
            finishFunctionComponent(
              request,
              task,
              keyPath,
              type,
              0 !== localIdCounter,
              actionStateCounter,
              actionStateMatchingIndex,
            );
            return;
          case REACT_MEMO_TYPE:
            renderElement(request, task, keyPath, type.type, props, ref);
            return;
          case REACT_CONTEXT_TYPE:
            defaultProps = props.children;
            newProps = task.keyPath;
            props = props.value;
            initialState = type._currentValue2;
            type._currentValue2 = props;
            ref = currentActiveSnapshot;
            currentActiveSnapshot = type = {
              parent: ref,
              depth: null === ref ? 0 : ref.depth + 1,
              context: type,
              parentValue: initialState,
              value: props,
            };
            task.context = type;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, defaultProps, -1);
            request = currentActiveSnapshot;
            if (null === request)
              throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
            request.context._currentValue2 = request.parentValue;
            request = currentActiveSnapshot = request.parent;
            task.context = request;
            task.keyPath = newProps;
            return;
          case REACT_CONSUMER_TYPE:
            props = props.children;
            type = props(type._context._currentValue2);
            props = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, type, -1);
            task.keyPath = props;
            return;
          case REACT_LAZY_TYPE:
            newProps = type._init;
            type = newProps(type._payload);
            if (12 === request.status) throw null;
            renderElement(request, task, keyPath, type, props, ref);
            return;
        }
      throw Error(
        "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
          ((null == type ? type : typeof type) + "."),
      );
    }
  }
  function resumeNode(request, task, segmentId, node, childIndex) {
    var prevReplay = task.replay,
      blockedBoundary = task.blockedBoundary,
      resumedSegment = createPendingSegment(request, 0, null, task.formatContext, false, false);
    resumedSegment.id = segmentId;
    resumedSegment.parentFlushed = true;
    try {
      ((task.replay = null),
        (task.blockedSegment = resumedSegment),
        renderNode(request, task, node, childIndex),
        (resumedSegment.status = 1),
        null === blockedBoundary
          ? (request.completedRootSegment = resumedSegment)
          : (queueCompletedSegment(blockedBoundary, resumedSegment),
            blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary)));
    } finally {
      ((task.replay = prevReplay), (task.blockedSegment = null));
    }
  }
  function renderNodeDestructive(request, task, node, childIndex) {
    null !== task.replay && "number" === typeof task.replay.slots
      ? resumeNode(request, task, task.replay.slots, node, childIndex)
      : ((task.node = node),
        (task.childIndex = childIndex),
        (node = task.componentStack),
        pushComponentStack(task),
        retryNode(request, task),
        (task.componentStack = node));
  }
  function retryNode(request, task) {
    var node = task.node,
      childIndex = task.childIndex;
    if (null !== node) {
      if ("object" === typeof node) {
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = node.type,
              key = node.key,
              props = node.props;
            node = props.ref;
            var ref = void 0 !== node ? node : null,
              name = getComponentNameFromType(type),
              keyOrIndex = null == key ? (-1 === childIndex ? 0 : childIndex) : key;
            key = [task.keyPath, name, keyOrIndex];
            if (null !== task.replay)
              a: {
                var replay = task.replay;
                childIndex = replay.nodes;
                for (node = 0; node < childIndex.length; node++) {
                  var node$jscomp$0 = childIndex[node];
                  if (keyOrIndex === node$jscomp$0[1]) {
                    if (4 === node$jscomp$0.length) {
                      if (null !== name && name !== node$jscomp$0[0])
                        throw Error(
                          "Expected the resume to render <" +
                            node$jscomp$0[0] +
                            "> in this slot but instead it rendered <" +
                            name +
                            ">. The tree doesn't match so React will fallback to client rendering.",
                        );
                      var childNodes = node$jscomp$0[2];
                      name = node$jscomp$0[3];
                      keyOrIndex = task.node;
                      task.replay = {
                        nodes: childNodes,
                        slots: name,
                        pendingTasks: 1,
                      };
                      try {
                        renderElement(request, task, key, type, props, ref);
                        if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                          throw Error(
                            "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
                          );
                        task.replay.pendingTasks--;
                      } catch (x2) {
                        if (
                          "object" === typeof x2 &&
                          null !== x2 &&
                          (x2 === SuspenseException || "function" === typeof x2.then)
                        )
                          throw (
                            task.node === keyOrIndex
                              ? (task.replay = replay)
                              : childIndex.splice(node, 1),
                            x2
                          );
                        task.replay.pendingTasks--;
                        props = getThrownInfo(task.componentStack);
                        key = request;
                        request = task.blockedBoundary;
                        type = x2;
                        props = logRecoverableError(key, type, props);
                        abortRemainingReplayNodes(key, request, childNodes, name, type, props);
                      }
                      task.replay = replay;
                    } else {
                      if (type !== REACT_SUSPENSE_TYPE)
                        throw Error(
                          "Expected the resume to render <Suspense> in this slot but instead it rendered <" +
                            (getComponentNameFromType(type) || "Unknown") +
                            ">. The tree doesn't match so React will fallback to client rendering.",
                        );
                      b: {
                        replay = void 0;
                        type = node$jscomp$0[5];
                        ref = node$jscomp$0[2];
                        name = node$jscomp$0[3];
                        keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                        node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                        var prevKeyPath = task.keyPath,
                          prevContext = task.formatContext,
                          prevRow = task.row,
                          previousReplaySet = task.replay,
                          parentBoundary = task.blockedBoundary,
                          parentHoistableState = task.hoistableState,
                          content = props.children,
                          fallback = props.fallback,
                          fallbackAbortSet = /* @__PURE__ */ new Set();
                        props = createSuspenseBoundary(
                          request,
                          task.row,
                          fallbackAbortSet,
                          null,
                          null,
                        );
                        props.parentFlushed = true;
                        props.rootSegmentID = type;
                        task.blockedBoundary = props;
                        task.hoistableState = props.contentState;
                        task.keyPath = key;
                        task.formatContext = getSuspenseContentFormatContext(
                          request.resumableState,
                          prevContext,
                        );
                        task.row = null;
                        task.replay = {
                          nodes: ref,
                          slots: name,
                          pendingTasks: 1,
                        };
                        try {
                          renderNode(request, task, content, -1);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
                            );
                          task.replay.pendingTasks--;
                          if (0 === props.pendingTasks && 0 === props.status) {
                            props.status = 1;
                            request.completedBoundaries.push(props);
                            break b;
                          }
                        } catch (error) {
                          ((props.status = 4),
                            (childNodes = getThrownInfo(task.componentStack)),
                            (replay = logRecoverableError(request, error, childNodes)),
                            (props.errorDigest = replay),
                            task.replay.pendingTasks--,
                            request.clientRenderedBoundaries.push(props));
                        } finally {
                          ((task.blockedBoundary = parentBoundary),
                            (task.hoistableState = parentHoistableState),
                            (task.replay = previousReplaySet),
                            (task.keyPath = prevKeyPath),
                            (task.formatContext = prevContext),
                            (task.row = prevRow));
                        }
                        childNodes = createReplayTask(
                          request,
                          null,
                          {
                            nodes: keyOrIndex,
                            slots: node$jscomp$0,
                            pendingTasks: 0,
                          },
                          fallback,
                          -1,
                          parentBoundary,
                          props.fallbackState,
                          fallbackAbortSet,
                          [key[0], "Suspense Fallback", key[2]],
                          getSuspenseFallbackFormatContext(
                            request.resumableState,
                            task.formatContext,
                          ),
                          task.context,
                          task.treeContext,
                          task.row,
                          replaceSuspenseComponentStackWithSuspenseFallbackStack(
                            task.componentStack,
                          ),
                        );
                        pushComponentStack(childNodes);
                        request.pingedTasks.push(childNodes);
                      }
                    }
                    childIndex.splice(node, 1);
                    break a;
                  }
                }
              }
            else renderElement(request, task, key, type, props, ref);
            return;
          case REACT_PORTAL_TYPE:
            throw Error(
              "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.",
            );
          case REACT_LAZY_TYPE:
            childNodes = node._init;
            node = childNodes(node._payload);
            if (12 === request.status) throw null;
            renderNodeDestructive(request, task, node, childIndex);
            return;
        }
        if (isArrayImpl(node)) {
          renderChildrenArray(request, task, node, childIndex);
          return;
        }
        if ((childNodes = getIteratorFn(node))) {
          if ((childNodes = childNodes.call(node))) {
            node = childNodes.next();
            if (!node.done) {
              props = [];
              do (props.push(node.value), (node = childNodes.next()));
              while (!node.done);
              renderChildrenArray(request, task, props, childIndex);
            }
            return;
          }
        }
        if ("function" === typeof node.then)
          return (
            (task.thenableState = null),
            renderNodeDestructive(request, task, unwrapThenable(node), childIndex)
          );
        if (node.$$typeof === REACT_CONTEXT_TYPE)
          return renderNodeDestructive(request, task, node._currentValue2, childIndex);
        childIndex = Object.prototype.toString.call(node);
        throw Error(
          "Objects are not valid as a React child (found: " +
            ("[object Object]" === childIndex
              ? "object with keys {" + Object.keys(node).join(", ") + "}"
              : childIndex) +
            "). If you meant to render a collection of children, use an array instead.",
        );
      }
      if ("string" === typeof node)
        ((childIndex = task.blockedSegment),
          null !== childIndex &&
            (childIndex.lastPushedText = pushTextInstance(
              childIndex.chunks,
              node,
              request.renderState,
              childIndex.lastPushedText,
            )));
      else if ("number" === typeof node || "bigint" === typeof node)
        ((childIndex = task.blockedSegment),
          null !== childIndex &&
            (childIndex.lastPushedText = pushTextInstance(
              childIndex.chunks,
              "" + node,
              request.renderState,
              childIndex.lastPushedText,
            )));
    }
  }
  function renderChildrenArray(request, task, children, childIndex) {
    var prevKeyPath = task.keyPath;
    if (
      -1 !== childIndex &&
      ((task.keyPath = [task.keyPath, "Fragment", childIndex]), null !== task.replay)
    ) {
      for (
        var replay = task.replay, replayNodes = replay.nodes, j2 = 0;
        j2 < replayNodes.length;
        j2++
      ) {
        var node = replayNodes[j2];
        if (node[1] === childIndex) {
          childIndex = node[2];
          node = node[3];
          task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
          try {
            renderChildrenArray(request, task, children, -1);
            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
              throw Error(
                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
              );
            task.replay.pendingTasks--;
          } catch (x2) {
            if (
              "object" === typeof x2 &&
              null !== x2 &&
              (x2 === SuspenseException || "function" === typeof x2.then)
            )
              throw x2;
            task.replay.pendingTasks--;
            children = getThrownInfo(task.componentStack);
            var boundary = task.blockedBoundary,
              error = x2;
            children = logRecoverableError(request, error, children);
            abortRemainingReplayNodes(request, boundary, childIndex, node, error, children);
          }
          task.replay = replay;
          replayNodes.splice(j2, 1);
          break;
        }
      }
      task.keyPath = prevKeyPath;
      return;
    }
    replay = task.treeContext;
    replayNodes = children.length;
    if (null !== task.replay && ((j2 = task.replay.slots), null !== j2 && "object" === typeof j2)) {
      for (childIndex = 0; childIndex < replayNodes; childIndex++)
        ((node = children[childIndex]),
          (task.treeContext = pushTreeContext(replay, replayNodes, childIndex)),
          (boundary = j2[childIndex]),
          "number" === typeof boundary
            ? (resumeNode(request, task, boundary, node, childIndex), delete j2[childIndex])
            : renderNode(request, task, node, childIndex));
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
      return;
    }
    for (j2 = 0; j2 < replayNodes; j2++)
      ((childIndex = children[j2]),
        (task.treeContext = pushTreeContext(replay, replayNodes, j2)),
        renderNode(request, task, childIndex, j2));
    task.treeContext = replay;
    task.keyPath = prevKeyPath;
  }
  function trackPostponedBoundary(request, trackedPostpones, boundary) {
    boundary.status = 5;
    boundary.rootSegmentID = request.nextSegmentId++;
    request = boundary.trackedContentKeyPath;
    if (null === request)
      throw Error("It should not be possible to postpone at the root. This is a bug in React.");
    var fallbackReplayNode = boundary.trackedFallbackNode,
      children = [],
      boundaryNode = trackedPostpones.workingMap.get(request);
    if (void 0 === boundaryNode)
      return (
        (boundary = [
          request[1],
          request[2],
          children,
          null,
          fallbackReplayNode,
          boundary.rootSegmentID,
        ]),
        trackedPostpones.workingMap.set(request, boundary),
        addToReplayParent(boundary, request[0], trackedPostpones),
        boundary
      );
    boundaryNode[4] = fallbackReplayNode;
    boundaryNode[5] = boundary.rootSegmentID;
    return boundaryNode;
  }
  function trackPostpone(request, trackedPostpones, task, segment) {
    segment.status = 5;
    var keyPath = task.keyPath,
      boundary = task.blockedBoundary;
    if (null === boundary)
      ((segment.id = request.nextSegmentId++),
        (trackedPostpones.rootSlots = segment.id),
        null !== request.completedRootSegment && (request.completedRootSegment.status = 5));
    else {
      if (null !== boundary && 0 === boundary.status) {
        var boundaryNode = trackPostponedBoundary(request, trackedPostpones, boundary);
        if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
          -1 === segment.id &&
            (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
          boundaryNode[3] = segment.id;
          return;
        }
      }
      -1 === segment.id &&
        (segment.id =
          segment.parentFlushed && null !== boundary
            ? boundary.rootSegmentID
            : request.nextSegmentId++);
      if (-1 === task.childIndex)
        null === keyPath
          ? (trackedPostpones.rootSlots = segment.id)
          : ((task = trackedPostpones.workingMap.get(keyPath)),
            void 0 === task
              ? ((task = [keyPath[1], keyPath[2], [], segment.id]),
                addToReplayParent(task, keyPath[0], trackedPostpones))
              : (task[3] = segment.id));
      else {
        if (null === keyPath)
          if (((request = trackedPostpones.rootSlots), null === request))
            request = trackedPostpones.rootSlots = {};
          else {
            if ("number" === typeof request)
              throw Error(
                "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React.",
              );
          }
        else if (
          ((boundary = trackedPostpones.workingMap),
          (boundaryNode = boundary.get(keyPath)),
          void 0 === boundaryNode)
        )
          ((request = {}),
            (boundaryNode = [keyPath[1], keyPath[2], [], request]),
            boundary.set(keyPath, boundaryNode),
            addToReplayParent(boundaryNode, keyPath[0], trackedPostpones));
        else if (((request = boundaryNode[3]), null === request)) request = boundaryNode[3] = {};
        else if ("number" === typeof request)
          throw Error(
            "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React.",
          );
        request[task.childIndex] = segment.id;
      }
    }
  }
  function untrackBoundary(request, boundary) {
    request = request.trackedPostpones;
    null !== request &&
      ((boundary = boundary.trackedContentKeyPath),
      null !== boundary &&
        ((boundary = request.workingMap.get(boundary)),
        void 0 !== boundary && ((boundary.length = 4), (boundary[2] = []), (boundary[3] = null))));
  }
  function spawnNewSuspendedReplayTask(request, task, thenableState2) {
    return createReplayTask(
      request,
      thenableState2,
      task.replay,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack,
    );
  }
  function spawnNewSuspendedRenderTask(request, task, thenableState2) {
    var segment = task.blockedSegment,
      newSegment = createPendingSegment(
        request,
        segment.chunks.length,
        null,
        task.formatContext,
        segment.lastPushedText,
        true,
      );
    segment.children.push(newSegment);
    segment.lastPushedText = false;
    return createRenderTask(
      request,
      thenableState2,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      newSegment,
      task.blockedPreamble,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack,
    );
  }
  function renderNode(request, task, node, childIndex) {
    var previousFormatContext = task.formatContext,
      previousContext = task.context,
      previousKeyPath = task.keyPath,
      previousTreeContext = task.treeContext,
      previousComponentStack = task.componentStack,
      segment = task.blockedSegment;
    if (null === segment) {
      segment = task.replay;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue) {
        if (
          (resetHooksState(),
          (node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue),
          12 !== request.status && "object" === typeof node && null !== node)
        ) {
          if ("function" === typeof node.then) {
            childIndex =
              thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
            node.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            node = spawnNewSuspendedReplayTask(request, task, node);
            request.pingedTasks.push(node);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
        }
      }
    } else {
      var childrenLength = segment.children.length,
        chunkLength = segment.chunks.length;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue$62) {
        if (
          (resetHooksState(),
          (segment.children.length = childrenLength),
          (segment.chunks.length = chunkLength),
          (node = thrownValue$62 === SuspenseException ? getSuspendedThenable() : thrownValue$62),
          12 !== request.status && "object" === typeof node && null !== node)
        ) {
          if ("function" === typeof node.then) {
            segment = node;
            node = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedRenderTask(request, task, node).ping;
            segment.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            segment =
              thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
            segment = spawnNewSuspendedRenderTask(request, task, segment);
            request.pingedTasks.push(segment);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
        }
      }
    }
    task.formatContext = previousFormatContext;
    task.context = previousContext;
    task.keyPath = previousKeyPath;
    task.treeContext = previousTreeContext;
    switchContext(previousContext);
    throw node;
  }
  function abortTaskSoft(task) {
    var boundary = task.blockedBoundary,
      segment = task.blockedSegment;
    null !== segment && ((segment.status = 3), finishedTask(this, boundary, task.row, segment));
  }
  function abortRemainingReplayNodes(
    request$jscomp$0,
    boundary,
    nodes,
    slots,
    error,
    errorDigest$jscomp$0,
  ) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (4 === node.length)
        abortRemainingReplayNodes(
          request$jscomp$0,
          boundary,
          node[2],
          node[3],
          error,
          errorDigest$jscomp$0,
        );
      else {
        node = node[5];
        var request = request$jscomp$0,
          errorDigest = errorDigest$jscomp$0,
          resumedBoundary = createSuspenseBoundary(
            request,
            null,
            /* @__PURE__ */ new Set(),
            null,
            null,
          );
        resumedBoundary.parentFlushed = true;
        resumedBoundary.rootSegmentID = node;
        resumedBoundary.status = 4;
        resumedBoundary.errorDigest = errorDigest;
        resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
      }
    }
    nodes.length = 0;
    if (null !== slots) {
      if (null === boundary)
        throw Error("We should not have any resumable nodes in the shell. This is a bug in React.");
      4 !== boundary.status &&
        ((boundary.status = 4),
        (boundary.errorDigest = errorDigest$jscomp$0),
        boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
      if ("object" === typeof slots) for (var index in slots) delete slots[index];
    }
  }
  function abortTask(task, request, error) {
    var boundary = task.blockedBoundary,
      segment = task.blockedSegment;
    if (null !== segment) {
      if (6 === segment.status) return;
      segment.status = 3;
    }
    var errorInfo = getThrownInfo(task.componentStack);
    if (null === boundary) {
      if (13 !== request.status && 14 !== request.status) {
        boundary = task.replay;
        if (null === boundary) {
          null !== request.trackedPostpones && null !== segment
            ? ((boundary = request.trackedPostpones),
              logRecoverableError(request, error, errorInfo),
              trackPostpone(request, boundary, task, segment),
              finishedTask(request, null, task.row, segment))
            : (logRecoverableError(request, error, errorInfo), fatalError(request, error));
          return;
        }
        boundary.pendingTasks--;
        0 === boundary.pendingTasks &&
          0 < boundary.nodes.length &&
          ((segment = logRecoverableError(request, error, errorInfo)),
          abortRemainingReplayNodes(request, null, boundary.nodes, boundary.slots, error, segment));
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      }
    } else {
      var trackedPostpones$63 = request.trackedPostpones;
      if (4 !== boundary.status) {
        if (null !== trackedPostpones$63 && null !== segment)
          return (
            logRecoverableError(request, error, errorInfo),
            trackPostpone(request, trackedPostpones$63, task, segment),
            boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
              return abortTask(fallbackTask, request, error);
            }),
            boundary.fallbackAbortableTasks.clear(),
            finishedTask(request, boundary, task.row, segment)
          );
        boundary.status = 4;
        segment = logRecoverableError(request, error, errorInfo);
        boundary.status = 4;
        boundary.errorDigest = segment;
        untrackBoundary(request, boundary);
        boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
      }
      boundary.pendingTasks--;
      segment = boundary.row;
      null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
        return abortTask(fallbackTask, request, error);
      });
      boundary.fallbackAbortableTasks.clear();
    }
    task = task.row;
    null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
    request.allPendingTasks--;
    0 === request.allPendingTasks && completeAll(request);
  }
  function safelyEmitEarlyPreloads(request, shellComplete) {
    try {
      var renderState = request.renderState,
        onHeaders = renderState.onHeaders;
      if (onHeaders) {
        var headers = renderState.headers;
        if (headers) {
          renderState.headers = null;
          var linkHeader = headers.preconnects;
          headers.fontPreloads &&
            (linkHeader && (linkHeader += ", "), (linkHeader += headers.fontPreloads));
          headers.highImagePreloads &&
            (linkHeader && (linkHeader += ", "), (linkHeader += headers.highImagePreloads));
          if (!shellComplete) {
            var queueIter = renderState.styles.values(),
              queueStep = queueIter.next();
            b: for (
              ;
              0 < headers.remainingCapacity && !queueStep.done;
              queueStep = queueIter.next()
            )
              for (
                var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next();
                0 < headers.remainingCapacity && !sheetStep.done;
                sheetStep = sheetIter.next()
              ) {
                var sheet = sheetStep.value,
                  props = sheet.props,
                  key = props.href,
                  props$jscomp$0 = sheet.props,
                  header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                    crossOrigin: props$jscomp$0.crossOrigin,
                    integrity: props$jscomp$0.integrity,
                    nonce: props$jscomp$0.nonce,
                    type: props$jscomp$0.type,
                    fetchPriority: props$jscomp$0.fetchPriority,
                    referrerPolicy: props$jscomp$0.referrerPolicy,
                    media: props$jscomp$0.media,
                  });
                if (0 <= (headers.remainingCapacity -= header.length + 2))
                  ((renderState.resets.style[key] = PRELOAD_NO_CREDS),
                    linkHeader && (linkHeader += ", "),
                    (linkHeader += header),
                    (renderState.resets.style[key] =
                      "string" === typeof props.crossOrigin || "string" === typeof props.integrity
                        ? [props.crossOrigin, props.integrity]
                        : PRELOAD_NO_CREDS));
                else break b;
              }
          }
          linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
        }
      }
    } catch (error) {
      logRecoverableError(request, error, {});
    }
  }
  function completeShell(request) {
    null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
    null === request.trackedPostpones && preparePreamble(request);
    request.onShellError = noop;
    request = request.onShellReady;
    request();
  }
  function completeAll(request) {
    safelyEmitEarlyPreloads(
      request,
      null === request.trackedPostpones
        ? true
        : null === request.completedRootSegment || 5 !== request.completedRootSegment.status,
    );
    preparePreamble(request);
    request = request.onAllReady;
    request();
  }
  function queueCompletedSegment(boundary, segment) {
    if (
      0 === segment.chunks.length &&
      1 === segment.children.length &&
      null === segment.children[0].boundary &&
      -1 === segment.children[0].id
    ) {
      var childSegment = segment.children[0];
      childSegment.id = segment.id;
      childSegment.parentFlushed = true;
      (1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status) ||
        queueCompletedSegment(boundary, childSegment);
    } else boundary.completedSegments.push(segment);
  }
  function finishedTask(request, boundary, row, segment) {
    null !== row &&
      (0 === --row.pendingTasks
        ? finishSuspenseListRow(request, row)
        : row.together && tryToResolveTogetherRow(request, row));
    request.allPendingTasks--;
    if (null === boundary) {
      if (null !== segment && segment.parentFlushed) {
        if (null !== request.completedRootSegment)
          throw Error("There can only be one root segment. This is a bug in React.");
        request.completedRootSegment = segment;
      }
      request.pendingRootTasks--;
      0 === request.pendingRootTasks && completeShell(request);
    } else if ((boundary.pendingTasks--, 4 !== boundary.status))
      if (0 === boundary.pendingTasks)
        if (
          (0 === boundary.status && (boundary.status = 1),
          null !== segment &&
            segment.parentFlushed &&
            (1 === segment.status || 3 === segment.status) &&
            queueCompletedSegment(boundary, segment),
          boundary.parentFlushed && request.completedBoundaries.push(boundary),
          1 === boundary.status)
        )
          ((row = boundary.row),
            null !== row && hoistHoistables(row.hoistables, boundary.contentState),
            isEligibleForOutlining(request, boundary) ||
              (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request),
              boundary.fallbackAbortableTasks.clear(),
              null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)),
            0 === request.pendingRootTasks &&
              null === request.trackedPostpones &&
              null !== boundary.contentPreamble &&
              preparePreamble(request));
        else {
          if (5 === boundary.status && ((boundary = boundary.row), null !== boundary)) {
            if (null !== request.trackedPostpones) {
              row = request.trackedPostpones;
              var postponedRow = boundary.next;
              if (null !== postponedRow && ((segment = postponedRow.boundaries), null !== segment))
                for (
                  postponedRow.boundaries = null, postponedRow = 0;
                  postponedRow < segment.length;
                  postponedRow++
                ) {
                  var postponedBoundary = segment[postponedRow];
                  trackPostponedBoundary(request, row, postponedBoundary);
                  finishedTask(request, postponedBoundary, null, null);
                }
            }
            0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
          }
        }
      else
        (null === segment ||
          !segment.parentFlushed ||
          (1 !== segment.status && 3 !== segment.status) ||
          (queueCompletedSegment(boundary, segment),
          1 === boundary.completedSegments.length &&
            boundary.parentFlushed &&
            request.partialBoundaries.push(boundary)),
          (boundary = boundary.row),
          null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary));
    0 === request.allPendingTasks && completeAll(request);
  }
  function performWork(request$jscomp$2) {
    if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
      var prevContext = currentActiveSnapshot,
        prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = HooksDispatcher;
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      var prevRequest = currentRequest;
      currentRequest = request$jscomp$2;
      var prevResumableState = currentResumableState;
      currentResumableState = request$jscomp$2.resumableState;
      try {
        var pingedTasks = request$jscomp$2.pingedTasks,
          i;
        for (i = 0; i < pingedTasks.length; i++) {
          var task = pingedTasks[i],
            request = request$jscomp$2,
            segment = task.blockedSegment;
          if (null === segment) {
            var request$jscomp$0 = request;
            if (0 !== task.replay.pendingTasks) {
              switchContext(task.context);
              try {
                "number" === typeof task.replay.slots
                  ? resumeNode(
                      request$jscomp$0,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex,
                    )
                  : retryNode(request$jscomp$0, task);
                if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                  throw Error(
                    "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
                  );
                task.replay.pendingTasks--;
                task.abortSet.delete(task);
                finishedTask(request$jscomp$0, task.blockedBoundary, task.row, null);
              } catch (thrownValue) {
                resetHooksState();
                var x2 = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                if ("object" === typeof x2 && null !== x2 && "function" === typeof x2.then) {
                  var ping = task.ping;
                  x2.then(ping, ping);
                  task.thenableState =
                    thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                } else {
                  task.replay.pendingTasks--;
                  task.abortSet.delete(task);
                  var errorInfo = getThrownInfo(task.componentStack);
                  request = void 0;
                  var request$jscomp$1 = request$jscomp$0,
                    boundary = task.blockedBoundary,
                    error$jscomp$0 =
                      12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x2,
                    replayNodes = task.replay.nodes,
                    resumeSlots = task.replay.slots;
                  request = logRecoverableError(request$jscomp$1, error$jscomp$0, errorInfo);
                  abortRemainingReplayNodes(
                    request$jscomp$1,
                    boundary,
                    replayNodes,
                    resumeSlots,
                    error$jscomp$0,
                    request,
                  );
                  request$jscomp$0.pendingRootTasks--;
                  0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
                  request$jscomp$0.allPendingTasks--;
                  0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
                }
              } finally {
              }
            }
          } else if (
            ((request$jscomp$0 = void 0),
            (request$jscomp$1 = segment),
            0 === request$jscomp$1.status)
          ) {
            request$jscomp$1.status = 6;
            switchContext(task.context);
            var childrenLength = request$jscomp$1.children.length,
              chunkLength = request$jscomp$1.chunks.length;
            try {
              (retryNode(request, task),
                pushSegmentFinale(
                  request$jscomp$1.chunks,
                  request.renderState,
                  request$jscomp$1.lastPushedText,
                  request$jscomp$1.textEmbedded,
                ),
                task.abortSet.delete(task),
                (request$jscomp$1.status = 1),
                finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1));
            } catch (thrownValue) {
              resetHooksState();
              request$jscomp$1.children.length = childrenLength;
              request$jscomp$1.chunks.length = chunkLength;
              var x$jscomp$0 =
                thrownValue === SuspenseException
                  ? getSuspendedThenable()
                  : 12 === request.status
                    ? request.fatalError
                    : thrownValue;
              if (12 === request.status && null !== request.trackedPostpones) {
                var trackedPostpones = request.trackedPostpones,
                  thrownInfo = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                logRecoverableError(request, x$jscomp$0, thrownInfo);
                trackPostpone(request, trackedPostpones, task, request$jscomp$1);
                finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
              } else if (
                "object" === typeof x$jscomp$0 &&
                null !== x$jscomp$0 &&
                "function" === typeof x$jscomp$0.then
              ) {
                request$jscomp$1.status = 0;
                task.thenableState =
                  thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                var ping$jscomp$0 = task.ping;
                x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
              } else {
                var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                request$jscomp$1.status = 4;
                var boundary$jscomp$0 = task.blockedBoundary,
                  row = task.row;
                null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                request.allPendingTasks--;
                request$jscomp$0 = logRecoverableError(request, x$jscomp$0, errorInfo$jscomp$0);
                if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
                else if ((boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status)) {
                  boundary$jscomp$0.status = 4;
                  boundary$jscomp$0.errorDigest = request$jscomp$0;
                  untrackBoundary(request, boundary$jscomp$0);
                  var boundaryRow = boundary$jscomp$0.row;
                  null !== boundaryRow &&
                    0 === --boundaryRow.pendingTasks &&
                    finishSuspenseListRow(request, boundaryRow);
                  boundary$jscomp$0.parentFlushed &&
                    request.clientRenderedBoundaries.push(boundary$jscomp$0);
                  0 === request.pendingRootTasks &&
                    null === request.trackedPostpones &&
                    null !== boundary$jscomp$0.contentPreamble &&
                    preparePreamble(request);
                }
                0 === request.allPendingTasks && completeAll(request);
              }
            } finally {
            }
          }
        }
        pingedTasks.splice(0, i);
        null !== request$jscomp$2.destination &&
          flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
      } catch (error) {
        (logRecoverableError(request$jscomp$2, error, {}), fatalError(request$jscomp$2, error));
      } finally {
        ((currentResumableState = prevResumableState),
          (ReactSharedInternals.H = prevDispatcher),
          (ReactSharedInternals.A = prevAsyncDispatcher),
          prevDispatcher === HooksDispatcher && switchContext(prevContext),
          (currentRequest = prevRequest));
      }
    }
  }
  function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
    segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
    for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
      pendingPreambles =
        preparePreambleFromSegment(request, segment.children[i], collectedPreambleSegments) ||
        pendingPreambles;
    return pendingPreambles;
  }
  function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
    var boundary = segment.boundary;
    if (null === boundary)
      return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
    var preamble = boundary.contentPreamble,
      fallbackPreamble = boundary.fallbackPreamble;
    if (null === preamble || null === fallbackPreamble) return false;
    switch (boundary.status) {
      case 1:
        hoistPreambleState(request.renderState, preamble);
        request.byteSize += boundary.byteSize;
        segment = boundary.completedSegments[0];
        if (!segment)
          throw Error(
            "A previously unvisited boundary must have exactly one root segment. This is a bug in React.",
          );
        return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
      case 5:
        if (null !== request.trackedPostpones) return true;
      case 4:
        if (1 === segment.status)
          return (
            hoistPreambleState(request.renderState, fallbackPreamble),
            preparePreambleFromSubtree(request, segment, collectedPreambleSegments)
          );
      default:
        return true;
    }
  }
  function preparePreamble(request) {
    if (request.completedRootSegment && null === request.completedPreambleSegments) {
      var collectedPreambleSegments = [],
        originalRequestByteSize = request.byteSize,
        hasPendingPreambles = preparePreambleFromSegment(
          request,
          request.completedRootSegment,
          collectedPreambleSegments,
        ),
        preamble = request.renderState.preamble;
      false === hasPendingPreambles || (preamble.headChunks && preamble.bodyChunks)
        ? (request.completedPreambleSegments = collectedPreambleSegments)
        : (request.byteSize = originalRequestByteSize);
    }
  }
  function flushSubtree(request, destination, segment, hoistableState) {
    segment.parentFlushed = true;
    switch (segment.status) {
      case 0:
        segment.id = request.nextSegmentId++;
      case 5:
        return (
          (hoistableState = segment.id),
          (segment.lastPushedText = false),
          (segment.textEmbedded = false),
          (request = request.renderState),
          destination.push('<template id="'),
          destination.push(request.placeholderPrefix),
          (request = hoistableState.toString(16)),
          destination.push(request),
          destination.push('"></template>')
        );
      case 1:
        segment.status = 2;
        var r = true,
          chunks = segment.chunks,
          chunkIdx = 0;
        segment = segment.children;
        for (var childIdx = 0; childIdx < segment.length; childIdx++) {
          for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
            destination.push(chunks[chunkIdx]);
          r = flushSegment(request, destination, r, hoistableState);
        }
        for (; chunkIdx < chunks.length - 1; chunkIdx++) destination.push(chunks[chunkIdx]);
        chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
        return r;
      case 3:
        return true;
      default:
        throw Error(
          "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.",
        );
    }
  }
  var flushedByteSize = 0;
  function flushSegment(request, destination, segment, hoistableState) {
    var boundary = segment.boundary;
    if (null === boundary) return flushSubtree(request, destination, segment, hoistableState);
    boundary.parentFlushed = true;
    if (4 === boundary.status) {
      var row = boundary.row;
      null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
      request.renderState.generateStaticMarkup ||
        ((boundary = boundary.errorDigest),
        destination.push("<!--$!-->"),
        destination.push("<template"),
        boundary &&
          (destination.push(' data-dgst="'),
          (boundary = escapeTextForBrowser(boundary)),
          destination.push(boundary),
          destination.push('"')),
        destination.push("></template>"));
      flushSubtree(request, destination, segment, hoistableState);
      request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
      return request;
    }
    if (1 !== boundary.status)
      return (
        0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++),
        0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary),
        writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID),
        hoistableState && hoistHoistables(hoistableState, boundary.fallbackState),
        flushSubtree(request, destination, segment, hoistableState),
        destination.push("<!--/$-->")
      );
    if (
      !flushingPartialBoundaries &&
      isEligibleForOutlining(request, boundary) &&
      flushedByteSize + boundary.byteSize > request.progressiveChunkSize
    )
      return (
        (boundary.rootSegmentID = request.nextSegmentId++),
        request.completedBoundaries.push(boundary),
        writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID),
        flushSubtree(request, destination, segment, hoistableState),
        destination.push("<!--/$-->")
      );
    flushedByteSize += boundary.byteSize;
    hoistableState && hoistHoistables(hoistableState, boundary.contentState);
    segment = boundary.row;
    null !== segment &&
      isEligibleForOutlining(request, boundary) &&
      0 === --segment.pendingTasks &&
      finishSuspenseListRow(request, segment);
    request.renderState.generateStaticMarkup || destination.push("<!--$-->");
    segment = boundary.completedSegments;
    if (1 !== segment.length)
      throw Error(
        "A previously unvisited boundary must have exactly one root segment. This is a bug in React.",
      );
    flushSegment(request, destination, segment[0], hoistableState);
    request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
    return request;
  }
  function flushSegmentContainer(request, destination, segment, hoistableState) {
    writeStartSegment(destination, request.renderState, segment.parentFormatContext, segment.id);
    flushSegment(request, destination, segment, hoistableState);
    return writeEndSegment(destination, segment.parentFormatContext);
  }
  function flushCompletedBoundary(request, destination, boundary) {
    flushedByteSize = boundary.byteSize;
    for (
      var completedSegments = boundary.completedSegments, i = 0;
      i < completedSegments.length;
      i++
    )
      flushPartiallyCompletedSegment(request, destination, boundary, completedSegments[i]);
    completedSegments.length = 0;
    completedSegments = boundary.row;
    null !== completedSegments &&
      isEligibleForOutlining(request, boundary) &&
      0 === --completedSegments.pendingTasks &&
      finishSuspenseListRow(request, completedSegments);
    writeHoistablesForBoundary(destination, boundary.contentState, request.renderState);
    completedSegments = request.resumableState;
    request = request.renderState;
    i = boundary.rootSegmentID;
    boundary = boundary.contentState;
    var requiresStyleInsertion = request.stylesToHoist;
    request.stylesToHoist = false;
    destination.push(request.startInlineScript);
    destination.push(">");
    requiresStyleInsertion
      ? (0 === (completedSegments.instructions & 4) &&
          ((completedSegments.instructions |= 4),
          destination.push(
            '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};',
          )),
        0 === (completedSegments.instructions & 2) &&
          ((completedSegments.instructions |= 2),
          destination.push(
            '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};',
          )),
        0 === (completedSegments.instructions & 8)
          ? ((completedSegments.instructions |= 8),
            destination.push(
              '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("',
            ))
          : destination.push('$RR("'))
      : (0 === (completedSegments.instructions & 2) &&
          ((completedSegments.instructions |= 2),
          destination.push(
            '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};',
          )),
        destination.push('$RC("'));
    completedSegments = i.toString(16);
    destination.push(request.boundaryPrefix);
    destination.push(completedSegments);
    destination.push('","');
    destination.push(request.segmentPrefix);
    destination.push(completedSegments);
    requiresStyleInsertion
      ? (destination.push('",'), writeStyleResourceDependenciesInJS(destination, boundary))
      : destination.push('"');
    boundary = destination.push(")<\/script>");
    return writeBootstrap(destination, request) && boundary;
  }
  function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
    if (2 === segment.status) return true;
    var hoistableState = boundary.contentState,
      segmentID = segment.id;
    if (-1 === segmentID) {
      if (-1 === (segment.id = boundary.rootSegmentID))
        throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
      return flushSegmentContainer(request, destination, segment, hoistableState);
    }
    if (segmentID === boundary.rootSegmentID)
      return flushSegmentContainer(request, destination, segment, hoistableState);
    flushSegmentContainer(request, destination, segment, hoistableState);
    boundary = request.resumableState;
    request = request.renderState;
    destination.push(request.startInlineScript);
    destination.push(">");
    0 === (boundary.instructions & 1)
      ? ((boundary.instructions |= 1),
        destination.push(
          '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("',
        ))
      : destination.push('$RS("');
    destination.push(request.segmentPrefix);
    segmentID = segmentID.toString(16);
    destination.push(segmentID);
    destination.push('","');
    destination.push(request.placeholderPrefix);
    destination.push(segmentID);
    destination = destination.push('")<\/script>');
    return destination;
  }
  var flushingPartialBoundaries = false;
  function flushCompletedQueues(request, destination) {
    try {
      if (!(0 < request.pendingRootTasks)) {
        var i,
          completedRootSegment = request.completedRootSegment;
        if (null !== completedRootSegment) {
          if (5 === completedRootSegment.status) return;
          var completedPreambleSegments = request.completedPreambleSegments;
          if (null === completedPreambleSegments) return;
          flushedByteSize = request.byteSize;
          var resumableState = request.resumableState,
            renderState = request.renderState,
            preamble = renderState.preamble,
            htmlChunks = preamble.htmlChunks,
            headChunks = preamble.headChunks,
            i$jscomp$0;
          if (htmlChunks) {
            for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
              destination.push(htmlChunks[i$jscomp$0]);
            if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                destination.push(headChunks[i$jscomp$0]);
            else {
              var chunk = startChunkForTag("head");
              destination.push(chunk);
              destination.push(">");
            }
          } else if (headChunks)
            for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
              destination.push(headChunks[i$jscomp$0]);
          var charsetChunks = renderState.charsetChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
            destination.push(charsetChunks[i$jscomp$0]);
          charsetChunks.length = 0;
          renderState.preconnects.forEach(flushResource, destination);
          renderState.preconnects.clear();
          var viewportChunks = renderState.viewportChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
            destination.push(viewportChunks[i$jscomp$0]);
          viewportChunks.length = 0;
          renderState.fontPreloads.forEach(flushResource, destination);
          renderState.fontPreloads.clear();
          renderState.highImagePreloads.forEach(flushResource, destination);
          renderState.highImagePreloads.clear();
          currentlyFlushingRenderState = renderState;
          renderState.styles.forEach(flushStylesInPreamble, destination);
          currentlyFlushingRenderState = null;
          var importMapChunks = renderState.importMapChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
            destination.push(importMapChunks[i$jscomp$0]);
          importMapChunks.length = 0;
          renderState.bootstrapScripts.forEach(flushResource, destination);
          renderState.scripts.forEach(flushResource, destination);
          renderState.scripts.clear();
          renderState.bulkPreloads.forEach(flushResource, destination);
          renderState.bulkPreloads.clear();
          resumableState.instructions |= 32;
          var hoistableChunks = renderState.hoistableChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
            destination.push(hoistableChunks[i$jscomp$0]);
          for (
            resumableState = hoistableChunks.length = 0;
            resumableState < completedPreambleSegments.length;
            resumableState++
          ) {
            var segments = completedPreambleSegments[resumableState];
            for (renderState = 0; renderState < segments.length; renderState++)
              flushSegment(request, destination, segments[renderState], null);
          }
          var preamble$jscomp$0 = request.renderState.preamble,
            headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
          if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
            var chunk$jscomp$0 = endChunkForTag("head");
            destination.push(chunk$jscomp$0);
          }
          var bodyChunks = preamble$jscomp$0.bodyChunks;
          if (bodyChunks)
            for (
              completedPreambleSegments = 0;
              completedPreambleSegments < bodyChunks.length;
              completedPreambleSegments++
            )
              destination.push(bodyChunks[completedPreambleSegments]);
          flushSegment(request, destination, completedRootSegment, null);
          request.completedRootSegment = null;
          var renderState$jscomp$0 = request.renderState;
          if (
            0 !== request.allPendingTasks ||
            0 !== request.clientRenderedBoundaries.length ||
            0 !== request.completedBoundaries.length ||
            (null !== request.trackedPostpones &&
              (0 !== request.trackedPostpones.rootNodes.length ||
                null !== request.trackedPostpones.rootSlots))
          ) {
            var resumableState$jscomp$0 = request.resumableState;
            if (0 === (resumableState$jscomp$0.instructions & 64)) {
              resumableState$jscomp$0.instructions |= 64;
              destination.push(renderState$jscomp$0.startInlineScript);
              if (0 === (resumableState$jscomp$0.instructions & 32)) {
                resumableState$jscomp$0.instructions |= 32;
                var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                destination.push(' id="');
                var chunk$jscomp$1 = escapeTextForBrowser(shellId);
                destination.push(chunk$jscomp$1);
                destination.push('"');
              }
              destination.push(">");
              destination.push("requestAnimationFrame(function(){$RT=performance.now()});");
              destination.push("<\/script>");
            }
          }
          writeBootstrap(destination, renderState$jscomp$0);
        }
        var renderState$jscomp$1 = request.renderState;
        completedRootSegment = 0;
        var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
        for (
          completedRootSegment = 0;
          completedRootSegment < viewportChunks$jscomp$0.length;
          completedRootSegment++
        )
          destination.push(viewportChunks$jscomp$0[completedRootSegment]);
        viewportChunks$jscomp$0.length = 0;
        renderState$jscomp$1.preconnects.forEach(flushResource, destination);
        renderState$jscomp$1.preconnects.clear();
        renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.fontPreloads.clear();
        renderState$jscomp$1.highImagePreloads.forEach(flushResource, destination);
        renderState$jscomp$1.highImagePreloads.clear();
        renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
        renderState$jscomp$1.scripts.forEach(flushResource, destination);
        renderState$jscomp$1.scripts.clear();
        renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.bulkPreloads.clear();
        var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
        for (
          completedRootSegment = 0;
          completedRootSegment < hoistableChunks$jscomp$0.length;
          completedRootSegment++
        )
          destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
        hoistableChunks$jscomp$0.length = 0;
        var clientRenderedBoundaries = request.clientRenderedBoundaries;
        for (i = 0; i < clientRenderedBoundaries.length; i++) {
          var boundary = clientRenderedBoundaries[i];
          renderState$jscomp$1 = destination;
          var resumableState$jscomp$1 = request.resumableState,
            renderState$jscomp$2 = request.renderState,
            id = boundary.rootSegmentID,
            errorDigest = boundary.errorDigest;
          renderState$jscomp$1.push(renderState$jscomp$2.startInlineScript);
          renderState$jscomp$1.push(">");
          0 === (resumableState$jscomp$1.instructions & 4)
            ? ((resumableState$jscomp$1.instructions |= 4),
              renderState$jscomp$1.push(
                '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("',
              ))
            : renderState$jscomp$1.push('$RX("');
          renderState$jscomp$1.push(renderState$jscomp$2.boundaryPrefix);
          var chunk$jscomp$2 = id.toString(16);
          renderState$jscomp$1.push(chunk$jscomp$2);
          renderState$jscomp$1.push('"');
          if (errorDigest) {
            renderState$jscomp$1.push(",");
            var chunk$jscomp$3 = escapeJSStringsForInstructionScripts(errorDigest || "");
            renderState$jscomp$1.push(chunk$jscomp$3);
          }
          var JSCompiler_inline_result = renderState$jscomp$1.push(")<\/script>");
          if (!JSCompiler_inline_result) {
            request.destination = null;
            i++;
            clientRenderedBoundaries.splice(0, i);
            return;
          }
        }
        clientRenderedBoundaries.splice(0, i);
        var completedBoundaries = request.completedBoundaries;
        for (i = 0; i < completedBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
            request.destination = null;
            i++;
            completedBoundaries.splice(0, i);
            return;
          }
        completedBoundaries.splice(0, i);
        flushingPartialBoundaries = true;
        var partialBoundaries = request.partialBoundaries;
        for (i = 0; i < partialBoundaries.length; i++) {
          var boundary$69 = partialBoundaries[i];
          a: {
            clientRenderedBoundaries = request;
            boundary = destination;
            flushedByteSize = boundary$69.byteSize;
            var completedSegments = boundary$69.completedSegments;
            for (
              JSCompiler_inline_result = 0;
              JSCompiler_inline_result < completedSegments.length;
              JSCompiler_inline_result++
            )
              if (
                !flushPartiallyCompletedSegment(
                  clientRenderedBoundaries,
                  boundary,
                  boundary$69,
                  completedSegments[JSCompiler_inline_result],
                )
              ) {
                JSCompiler_inline_result++;
                completedSegments.splice(0, JSCompiler_inline_result);
                var JSCompiler_inline_result$jscomp$0 = false;
                break a;
              }
            completedSegments.splice(0, JSCompiler_inline_result);
            var row = boundary$69.row;
            null !== row &&
              row.together &&
              1 === boundary$69.pendingTasks &&
              (1 === row.pendingTasks
                ? unblockSuspenseListRow(clientRenderedBoundaries, row, row.hoistables)
                : row.pendingTasks--);
            JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
              boundary,
              boundary$69.contentState,
              clientRenderedBoundaries.renderState,
            );
          }
          if (!JSCompiler_inline_result$jscomp$0) {
            request.destination = null;
            i++;
            partialBoundaries.splice(0, i);
            return;
          }
        }
        partialBoundaries.splice(0, i);
        flushingPartialBoundaries = false;
        var largeBoundaries = request.completedBoundaries;
        for (i = 0; i < largeBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
            request.destination = null;
            i++;
            largeBoundaries.splice(0, i);
            return;
          }
        largeBoundaries.splice(0, i);
      }
    } finally {
      ((flushingPartialBoundaries = false),
        0 === request.allPendingTasks &&
          0 === request.clientRenderedBoundaries.length &&
          0 === request.completedBoundaries.length &&
          ((request.flushScheduled = false),
          (i = request.resumableState),
          i.hasBody &&
            ((partialBoundaries = endChunkForTag("body")), destination.push(partialBoundaries)),
          i.hasHtml && ((i = endChunkForTag("html")), destination.push(i)),
          (request.status = 14),
          destination.push(null),
          (request.destination = null)));
    }
  }
  function enqueueFlush(request) {
    if (
      false === request.flushScheduled &&
      0 === request.pingedTasks.length &&
      null !== request.destination
    ) {
      request.flushScheduled = true;
      var destination = request.destination;
      destination ? flushCompletedQueues(request, destination) : (request.flushScheduled = false);
    }
  }
  function startFlowing(request, destination) {
    if (13 === request.status) ((request.status = 14), destination.destroy(request.fatalError));
    else if (14 !== request.status && null === request.destination) {
      request.destination = destination;
      try {
        flushCompletedQueues(request, destination);
      } catch (error) {
        (logRecoverableError(request, error, {}), fatalError(request, error));
      }
    }
  }
  function abort(request, reason) {
    if (11 === request.status || 10 === request.status) request.status = 12;
    try {
      var abortableTasks = request.abortableTasks;
      if (0 < abortableTasks.size) {
        var error =
          void 0 === reason
            ? Error("The render was aborted by the server without a reason.")
            : "object" === typeof reason && null !== reason && "function" === typeof reason.then
              ? Error("The render was aborted by the server with a promise.")
              : reason;
        request.fatalError = error;
        abortableTasks.forEach(function (task) {
          return abortTask(task, request, error);
        });
        abortableTasks.clear();
      }
      null !== request.destination && flushCompletedQueues(request, request.destination);
    } catch (error$71) {
      (logRecoverableError(request, error$71, {}), fatalError(request, error$71));
    }
  }
  function addToReplayParent(node, parentKeyPath, trackedPostpones) {
    if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
    else {
      var workingMap = trackedPostpones.workingMap,
        parentNode = workingMap.get(parentKeyPath);
      void 0 === parentNode &&
        ((parentNode = [parentKeyPath[1], parentKeyPath[2], [], null]),
        workingMap.set(parentKeyPath, parentNode),
        addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
      parentNode[2].push(node);
    }
  }
  function onError() {}
  function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
    var didFatal = false,
      fatalError2 = null,
      result = "",
      readyToStream = false;
    options = createResumableState(options ? options.identifierPrefix : void 0);
    children = createRequest(
      children,
      options,
      createRenderState(options, generateStaticMarkup),
      createFormatContext(0, null, 0, null),
      Infinity,
      onError,
      void 0,
      function () {
        readyToStream = true;
      },
      void 0,
      void 0,
      void 0,
    );
    children.flushScheduled = null !== children.destination;
    performWork(children);
    10 === children.status && (children.status = 11);
    null === children.trackedPostpones &&
      safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
    abort(children, abortReason);
    startFlowing(children, {
      push: function (chunk) {
        null !== chunk && (result += chunk);
        return true;
      },
      destroy: function (error) {
        didFatal = true;
        fatalError2 = error;
      },
    });
    if (didFatal && fatalError2 !== abortReason) throw fatalError2;
    if (!readyToStream)
      throw Error(
        "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.",
      );
    return result;
  }
  reactDomServerLegacy_node_production.renderToStaticMarkup = function (children, options) {
    return renderToStringImpl(
      children,
      options,
      true,
      'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server',
    );
  };
  reactDomServerLegacy_node_production.renderToString = function (children, options) {
    return renderToStringImpl(
      children,
      options,
      false,
      'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server',
    );
  };
  reactDomServerLegacy_node_production.version = "19.2.3";
  return reactDomServerLegacy_node_production;
}
var reactDomServer_node_production = {};
/**
 * @license React
 * react-dom-server.node.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDomServer_node_production;
function requireReactDomServer_node_production() {
  if (hasRequiredReactDomServer_node_production) return reactDomServer_node_production;
  hasRequiredReactDomServer_node_production = 1;
  var util = require$$0,
    crypto2 = require$$1,
    async_hooks = require$$2,
    React2 = requireReact(),
    ReactDOM = requireReactDom(),
    stream = require$$5,
    REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
    REACT_PORTAL_TYPE = Symbol.for("react.portal"),
    REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
    REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
    REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
    REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
    REACT_CONTEXT_TYPE = Symbol.for("react.context"),
    REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
    REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
    REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
    REACT_MEMO_TYPE = Symbol.for("react.memo"),
    REACT_LAZY_TYPE = Symbol.for("react.lazy"),
    REACT_SCOPE_TYPE = Symbol.for("react.scope"),
    REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
    REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden"),
    REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
    REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"),
    MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable =
      (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
      maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var isArrayImpl = Array.isArray,
    scheduleMicrotask = queueMicrotask;
  function flushBuffered(destination) {
    "function" === typeof destination.flush && destination.flush();
  }
  var currentView = null,
    writtenBytes = 0,
    destinationHasCapacity$1 = true;
  function writeChunk(destination, chunk) {
    if ("string" === typeof chunk) {
      if (0 !== chunk.length)
        if (2048 < 3 * chunk.length)
          (0 < writtenBytes &&
            (writeToDestination(destination, currentView.subarray(0, writtenBytes)),
            (currentView = new Uint8Array(2048)),
            (writtenBytes = 0)),
            writeToDestination(destination, chunk));
        else {
          var target = currentView;
          0 < writtenBytes && (target = currentView.subarray(writtenBytes));
          target = textEncoder2.encodeInto(chunk, target);
          var read = target.read;
          writtenBytes += target.written;
          read < chunk.length &&
            (writeToDestination(destination, currentView.subarray(0, writtenBytes)),
            (currentView = new Uint8Array(2048)),
            (writtenBytes = textEncoder2.encodeInto(chunk.slice(read), currentView).written));
          2048 === writtenBytes &&
            (writeToDestination(destination, currentView),
            (currentView = new Uint8Array(2048)),
            (writtenBytes = 0));
        }
    } else
      0 !== chunk.byteLength &&
        (2048 < chunk.byteLength
          ? (0 < writtenBytes &&
              (writeToDestination(destination, currentView.subarray(0, writtenBytes)),
              (currentView = new Uint8Array(2048)),
              (writtenBytes = 0)),
            writeToDestination(destination, chunk))
          : ((target = currentView.length - writtenBytes),
            target < chunk.byteLength &&
              (0 === target
                ? writeToDestination(destination, currentView)
                : (currentView.set(chunk.subarray(0, target), writtenBytes),
                  (writtenBytes += target),
                  writeToDestination(destination, currentView),
                  (chunk = chunk.subarray(target))),
              (currentView = new Uint8Array(2048)),
              (writtenBytes = 0)),
            currentView.set(chunk, writtenBytes),
            (writtenBytes += chunk.byteLength),
            2048 === writtenBytes &&
              (writeToDestination(destination, currentView),
              (currentView = new Uint8Array(2048)),
              (writtenBytes = 0))));
  }
  function writeToDestination(destination, view) {
    destination = destination.write(view);
    destinationHasCapacity$1 = destinationHasCapacity$1 && destination;
  }
  function writeChunkAndReturn(destination, chunk) {
    writeChunk(destination, chunk);
    return destinationHasCapacity$1;
  }
  function completeWriting(destination) {
    currentView && 0 < writtenBytes && destination.write(currentView.subarray(0, writtenBytes));
    currentView = null;
    writtenBytes = 0;
    destinationHasCapacity$1 = true;
  }
  var textEncoder2 = new util.TextEncoder();
  function stringToPrecomputedChunk(content) {
    return textEncoder2.encode(content);
  }
  function byteLengthOfChunk(chunk) {
    return "string" === typeof chunk ? Buffer.byteLength(chunk, "utf8") : chunk.byteLength;
  }
  var assign = Object.assign,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    illegalAttributeNameCache = {},
    validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return (validatedAttributeNameCache[attributeName] = true);
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " ",
      ),
    ),
    aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    matchHtmlRegExp = /["'&<>]/;
  function escapeTextForBrowser(text) {
    if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
      return "" + text;
    text = "" + text;
    var match = matchHtmlRegExp.exec(text);
    if (match) {
      var html = "",
        index,
        lastIndex = 0;
      for (index = match.index; index < text.length; index++) {
        switch (text.charCodeAt(index)) {
          case 34:
            match = "&quot;";
            break;
          case 38:
            match = "&amp;";
            break;
          case 39:
            match = "&#x27;";
            break;
          case 60:
            match = "&lt;";
            break;
          case 62:
            match = "&gt;";
            break;
          default:
            continue;
        }
        lastIndex !== index && (html += text.slice(lastIndex, index));
        lastIndex = index + 1;
        html += match;
      }
      text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
    }
    return text;
  }
  var uppercasePattern = /([A-Z])/g,
    msPattern = /^ms-/,
    isJavaScriptProtocol =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : url;
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null,
    },
    previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: previousDispatcher.f,
    r: previousDispatcher.r,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript,
  };
  var PRELOAD_NO_CREDS = [],
    currentlyFlushingRenderState = null;
  stringToPrecomputedChunk('"></template>');
  var startInlineScript = stringToPrecomputedChunk("<script"),
    endInlineScript = stringToPrecomputedChunk("<\/script>"),
    startScriptSrc = stringToPrecomputedChunk('<script src="'),
    startModuleSrc = stringToPrecomputedChunk('<script type="module" src="'),
    scriptNonce = stringToPrecomputedChunk(' nonce="'),
    scriptIntegirty = stringToPrecomputedChunk(' integrity="'),
    scriptCrossOrigin = stringToPrecomputedChunk(' crossorigin="'),
    endAsyncScript = stringToPrecomputedChunk(' async=""><\/script>'),
    startInlineStyle = stringToPrecomputedChunk("<style"),
    scriptRegex = /(<\/|<)(s)(cript)/gi;
  function scriptReplacer(match, prefix3, s, suffix2) {
    return "" + prefix3 + ("s" === s ? "\\u0073" : "\\u0053") + suffix2;
  }
  var importMapScriptStart = stringToPrecomputedChunk('<script type="importmap">'),
    importMapScriptEnd = stringToPrecomputedChunk("<\/script>");
  function createRenderState(
    resumableState,
    nonce,
    externalRuntimeConfig,
    importMap,
    onHeaders,
    maxHeadersLength,
  ) {
    externalRuntimeConfig = "string" === typeof nonce ? nonce : nonce && nonce.script;
    var inlineScriptWithNonce =
        void 0 === externalRuntimeConfig
          ? startInlineScript
          : stringToPrecomputedChunk(
              '<script nonce="' + escapeTextForBrowser(externalRuntimeConfig) + '"',
            ),
      nonceStyle = "string" === typeof nonce ? void 0 : nonce && nonce.style,
      inlineStyleWithNonce =
        void 0 === nonceStyle
          ? startInlineStyle
          : stringToPrecomputedChunk('<style nonce="' + escapeTextForBrowser(nonceStyle) + '"'),
      idPrefix = resumableState.idPrefix,
      bootstrapChunks = [],
      bootstrapScriptContent = resumableState.bootstrapScriptContent,
      bootstrapScripts = resumableState.bootstrapScripts,
      bootstrapModules = resumableState.bootstrapModules;
    void 0 !== bootstrapScriptContent &&
      (bootstrapChunks.push(inlineScriptWithNonce),
      pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
      bootstrapChunks.push(
        endOfStartTag,
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
        endInlineScript,
      ));
    bootstrapScriptContent = [];
    void 0 !== importMap &&
      (bootstrapScriptContent.push(importMapScriptStart),
      bootstrapScriptContent.push(
        ("" + JSON.stringify(importMap)).replace(scriptRegex, scriptReplacer),
      ),
      bootstrapScriptContent.push(importMapScriptEnd));
    importMap = onHeaders
      ? {
          preconnects: "",
          fontPreloads: "",
          highImagePreloads: "",
          remainingCapacity: 2 + ("number" === typeof maxHeadersLength ? maxHeadersLength : 2e3),
        }
      : null;
    onHeaders = {
      placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
      segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
      boundaryPrefix: stringToPrecomputedChunk(idPrefix + "B:"),
      startInlineScript: inlineScriptWithNonce,
      startInlineStyle: inlineStyleWithNonce,
      preamble: createPreambleState(),
      externalRuntimeScript: null,
      bootstrapChunks,
      importMapChunks: bootstrapScriptContent,
      onHeaders,
      headers: importMap,
      resets: {
        font: {},
        dns: {},
        connect: { default: {}, anonymous: {}, credentials: {} },
        image: {},
        style: {},
      },
      charsetChunks: [],
      viewportChunks: [],
      hoistableChunks: [],
      preconnects: /* @__PURE__ */ new Set(),
      fontPreloads: /* @__PURE__ */ new Set(),
      highImagePreloads: /* @__PURE__ */ new Set(),
      styles: /* @__PURE__ */ new Map(),
      bootstrapScripts: /* @__PURE__ */ new Set(),
      scripts: /* @__PURE__ */ new Set(),
      bulkPreloads: /* @__PURE__ */ new Set(),
      preloads: {
        images: /* @__PURE__ */ new Map(),
        stylesheets: /* @__PURE__ */ new Map(),
        scripts: /* @__PURE__ */ new Map(),
        moduleScripts: /* @__PURE__ */ new Map(),
      },
      nonce: { script: externalRuntimeConfig, style: nonceStyle },
      hoistableState: null,
      stylesToHoist: false,
    };
    if (void 0 !== bootstrapScripts)
      for (importMap = 0; importMap < bootstrapScripts.length; importMap++)
        ((idPrefix = bootstrapScripts[importMap]),
          (nonceStyle = inlineScriptWithNonce = void 0),
          (inlineStyleWithNonce = {
            rel: "preload",
            as: "script",
            fetchPriority: "low",
            nonce,
          }),
          "string" === typeof idPrefix
            ? (inlineStyleWithNonce.href = maxHeadersLength = idPrefix)
            : ((inlineStyleWithNonce.href = maxHeadersLength = idPrefix.src),
              (inlineStyleWithNonce.integrity = nonceStyle =
                "string" === typeof idPrefix.integrity ? idPrefix.integrity : void 0),
              (inlineStyleWithNonce.crossOrigin = inlineScriptWithNonce =
                "string" === typeof idPrefix || null == idPrefix.crossOrigin
                  ? void 0
                  : "use-credentials" === idPrefix.crossOrigin
                    ? "use-credentials"
                    : "")),
          (idPrefix = resumableState),
          (bootstrapScriptContent = maxHeadersLength),
          (idPrefix.scriptResources[bootstrapScriptContent] = null),
          (idPrefix.moduleScriptResources[bootstrapScriptContent] = null),
          (idPrefix = []),
          pushLinkImpl(idPrefix, inlineStyleWithNonce),
          onHeaders.bootstrapScripts.add(idPrefix),
          bootstrapChunks.push(
            startScriptSrc,
            escapeTextForBrowser(maxHeadersLength),
            attributeEnd,
          ),
          externalRuntimeConfig &&
            bootstrapChunks.push(
              scriptNonce,
              escapeTextForBrowser(externalRuntimeConfig),
              attributeEnd,
            ),
          "string" === typeof nonceStyle &&
            bootstrapChunks.push(scriptIntegirty, escapeTextForBrowser(nonceStyle), attributeEnd),
          "string" === typeof inlineScriptWithNonce &&
            bootstrapChunks.push(
              scriptCrossOrigin,
              escapeTextForBrowser(inlineScriptWithNonce),
              attributeEnd,
            ),
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
          bootstrapChunks.push(endAsyncScript));
    if (void 0 !== bootstrapModules)
      for (nonce = 0; nonce < bootstrapModules.length; nonce++)
        ((nonceStyle = bootstrapModules[nonce]),
          (maxHeadersLength = importMap = void 0),
          (inlineScriptWithNonce = {
            rel: "modulepreload",
            fetchPriority: "low",
            nonce: externalRuntimeConfig,
          }),
          "string" === typeof nonceStyle
            ? (inlineScriptWithNonce.href = bootstrapScripts = nonceStyle)
            : ((inlineScriptWithNonce.href = bootstrapScripts = nonceStyle.src),
              (inlineScriptWithNonce.integrity = maxHeadersLength =
                "string" === typeof nonceStyle.integrity ? nonceStyle.integrity : void 0),
              (inlineScriptWithNonce.crossOrigin = importMap =
                "string" === typeof nonceStyle || null == nonceStyle.crossOrigin
                  ? void 0
                  : "use-credentials" === nonceStyle.crossOrigin
                    ? "use-credentials"
                    : "")),
          (nonceStyle = resumableState),
          (inlineStyleWithNonce = bootstrapScripts),
          (nonceStyle.scriptResources[inlineStyleWithNonce] = null),
          (nonceStyle.moduleScriptResources[inlineStyleWithNonce] = null),
          (nonceStyle = []),
          pushLinkImpl(nonceStyle, inlineScriptWithNonce),
          onHeaders.bootstrapScripts.add(nonceStyle),
          bootstrapChunks.push(
            startModuleSrc,
            escapeTextForBrowser(bootstrapScripts),
            attributeEnd,
          ),
          externalRuntimeConfig &&
            bootstrapChunks.push(
              scriptNonce,
              escapeTextForBrowser(externalRuntimeConfig),
              attributeEnd,
            ),
          "string" === typeof maxHeadersLength &&
            bootstrapChunks.push(
              scriptIntegirty,
              escapeTextForBrowser(maxHeadersLength),
              attributeEnd,
            ),
          "string" === typeof importMap &&
            bootstrapChunks.push(scriptCrossOrigin, escapeTextForBrowser(importMap), attributeEnd),
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
          bootstrapChunks.push(endAsyncScript));
    return onHeaders;
  }
  function createResumableState(
    identifierPrefix,
    externalRuntimeConfig,
    bootstrapScriptContent,
    bootstrapScripts,
    bootstrapModules,
  ) {
    return {
      idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
      nextFormID: 0,
      streamingFormat: 0,
      bootstrapScriptContent,
      bootstrapScripts,
      bootstrapModules,
      instructions: 0,
      hasBody: false,
      hasHtml: false,
      unknownResources: {},
      dnsResources: {},
      connectResources: { default: {}, anonymous: {}, credentials: {} },
      imageResources: {},
      styleResources: {},
      scriptResources: {},
      moduleUnknownResources: {},
      moduleScriptResources: {},
    };
  }
  function createPreambleState() {
    return { htmlChunks: null, headChunks: null, bodyChunks: null };
  }
  function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
    return {
      insertionMode,
      selectedValue,
      tagScope,
      viewTransition,
    };
  }
  function createRootFormatContext(namespaceURI) {
    return createFormatContext(
      "http://www.w3.org/2000/svg" === namespaceURI
        ? 4
        : "http://www.w3.org/1998/Math/MathML" === namespaceURI
          ? 5
          : 0,
      null,
      0,
      null,
    );
  }
  function getChildFormatContext(parentContext, type, props) {
    var subtreeScope = parentContext.tagScope & -25;
    switch (type) {
      case "noscript":
        return createFormatContext(2, null, subtreeScope | 1, null);
      case "select":
        return createFormatContext(
          2,
          null != props.value ? props.value : props.defaultValue,
          subtreeScope,
          null,
        );
      case "svg":
        return createFormatContext(4, null, subtreeScope, null);
      case "picture":
        return createFormatContext(2, null, subtreeScope | 2, null);
      case "math":
        return createFormatContext(5, null, subtreeScope, null);
      case "foreignObject":
        return createFormatContext(2, null, subtreeScope, null);
      case "table":
        return createFormatContext(6, null, subtreeScope, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return createFormatContext(7, null, subtreeScope, null);
      case "colgroup":
        return createFormatContext(9, null, subtreeScope, null);
      case "tr":
        return createFormatContext(8, null, subtreeScope, null);
      case "head":
        if (2 > parentContext.insertionMode)
          return createFormatContext(3, null, subtreeScope, null);
        break;
      case "html":
        if (0 === parentContext.insertionMode)
          return createFormatContext(1, null, subtreeScope, null);
    }
    return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode
      ? createFormatContext(2, null, subtreeScope, null)
      : parentContext.tagScope !== subtreeScope
        ? createFormatContext(
            parentContext.insertionMode,
            parentContext.selectedValue,
            subtreeScope,
            null,
          )
        : parentContext;
  }
  function getSuspenseViewTransition(parentViewTransition) {
    return null === parentViewTransition
      ? null
      : {
          update: parentViewTransition.update,
          enter: "none",
          exit: "none",
          share: parentViewTransition.update,
          name: parentViewTransition.autoName,
          autoName: parentViewTransition.autoName,
          nameIdx: 0,
        };
  }
  function getSuspenseFallbackFormatContext(resumableState, parentContext) {
    parentContext.tagScope & 32 && (resumableState.instructions |= 128);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      parentContext.tagScope | 12,
      getSuspenseViewTransition(parentContext.viewTransition),
    );
  }
  function getSuspenseContentFormatContext(resumableState, parentContext) {
    resumableState = getSuspenseViewTransition(parentContext.viewTransition);
    var subtreeScope = parentContext.tagScope | 16;
    null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      subtreeScope,
      resumableState,
    );
  }
  var textSeparator = stringToPrecomputedChunk("<!-- -->");
  function pushTextInstance(target, text, renderState, textEmbedded) {
    if ("" === text) return textEmbedded;
    textEmbedded && target.push(textSeparator);
    target.push(escapeTextForBrowser(text));
    return true;
  }
  var styleNameCache = /* @__PURE__ */ new Map(),
    styleAttributeStart = stringToPrecomputedChunk(' style="'),
    styleAssign = stringToPrecomputedChunk(":"),
    styleSeparator = stringToPrecomputedChunk(";");
  function pushStyleAttribute(target, style) {
    if ("object" !== typeof style)
      throw Error(
        "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.",
      );
    var isFirst = true,
      styleName;
    for (styleName in style)
      if (hasOwnProperty.call(style, styleName)) {
        var styleValue = style[styleName];
        if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
          if (0 === styleName.indexOf("--")) {
            var nameChunk = escapeTextForBrowser(styleName);
            styleValue = escapeTextForBrowser(("" + styleValue).trim());
          } else
            ((nameChunk = styleNameCache.get(styleName)),
              void 0 === nameChunk &&
                ((nameChunk = stringToPrecomputedChunk(
                  escapeTextForBrowser(
                    styleName
                      .replace(uppercasePattern, "-$1")
                      .toLowerCase()
                      .replace(msPattern, "-ms-"),
                  ),
                )),
                styleNameCache.set(styleName, nameChunk)),
              (styleValue =
                "number" === typeof styleValue
                  ? 0 === styleValue || unitlessNumbers.has(styleName)
                    ? "" + styleValue
                    : styleValue + "px"
                  : escapeTextForBrowser(("" + styleValue).trim())));
          isFirst
            ? ((isFirst = false),
              target.push(styleAttributeStart, nameChunk, styleAssign, styleValue))
            : target.push(styleSeparator, nameChunk, styleAssign, styleValue);
        }
      }
    isFirst || target.push(attributeEnd);
  }
  var attributeSeparator = stringToPrecomputedChunk(" "),
    attributeAssign = stringToPrecomputedChunk('="'),
    attributeEnd = stringToPrecomputedChunk('"'),
    attributeEmptyString = stringToPrecomputedChunk('=""');
  function pushBooleanAttribute(target, name, value) {
    value &&
      "function" !== typeof value &&
      "symbol" !== typeof value &&
      target.push(attributeSeparator, name, attributeEmptyString);
  }
  function pushStringAttribute(target, name, value) {
    "function" !== typeof value &&
      "symbol" !== typeof value &&
      "boolean" !== typeof value &&
      target.push(
        attributeSeparator,
        name,
        attributeAssign,
        escapeTextForBrowser(value),
        attributeEnd,
      );
  }
  var actionJavaScriptURL = stringToPrecomputedChunk(
      escapeTextForBrowser("javascript:throw new Error('React form unexpectedly submitted.')"),
    ),
    startHiddenInputChunk = stringToPrecomputedChunk('<input type="hidden"');
  function pushAdditionalFormField(value, key) {
    this.push(startHiddenInputChunk);
    validateAdditionalFormField(value);
    pushStringAttribute(this, "name", key);
    pushStringAttribute(this, "value", value);
    this.push(endOfStartTagSelfClosing);
  }
  function validateAdditionalFormField(value) {
    if ("string" !== typeof value)
      throw Error(
        "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration.",
      );
  }
  function getCustomFormFields(resumableState, formAction) {
    if ("function" === typeof formAction.$$FORM_ACTION) {
      var id = resumableState.nextFormID++;
      resumableState = resumableState.idPrefix + id;
      try {
        var customFields = formAction.$$FORM_ACTION(resumableState);
        if (customFields) {
          var formData = customFields.data;
          null != formData && formData.forEach(validateAdditionalFormField);
        }
        return customFields;
      } catch (x2) {
        if ("object" === typeof x2 && null !== x2 && "function" === typeof x2.then) throw x2;
      }
    }
    return null;
  }
  function pushFormActionAttribute(
    target,
    resumableState,
    renderState,
    formAction,
    formEncType,
    formMethod,
    formTarget,
    name,
  ) {
    var formData = null;
    if ("function" === typeof formAction) {
      var customFields = getCustomFormFields(resumableState, formAction);
      null !== customFields
        ? ((name = customFields.name),
          (formAction = customFields.action || ""),
          (formEncType = customFields.encType),
          (formMethod = customFields.method),
          (formTarget = customFields.target),
          (formData = customFields.data))
        : (target.push(
            attributeSeparator,
            "formAction",
            attributeAssign,
            actionJavaScriptURL,
            attributeEnd,
          ),
          (formTarget = formMethod = formEncType = formAction = name = null),
          injectFormReplayingRuntime(resumableState, renderState));
    }
    null != name && pushAttribute(target, "name", name);
    null != formAction && pushAttribute(target, "formAction", formAction);
    null != formEncType && pushAttribute(target, "formEncType", formEncType);
    null != formMethod && pushAttribute(target, "formMethod", formMethod);
    null != formTarget && pushAttribute(target, "formTarget", formTarget);
    return formData;
  }
  function pushAttribute(target, name, value) {
    switch (name) {
      case "className":
        pushStringAttribute(target, "class", value);
        break;
      case "tabIndex":
        pushStringAttribute(target, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        pushStringAttribute(target, name, value);
        break;
      case "style":
        pushStyleAttribute(target, value);
        break;
      case "src":
      case "href":
        if ("" === value) break;
      case "action":
      case "formAction":
        if (
          null == value ||
          "function" === typeof value ||
          "symbol" === typeof value ||
          "boolean" === typeof value
        )
          break;
        value = sanitizeURL("" + value);
        target.push(
          attributeSeparator,
          name,
          attributeAssign,
          escapeTextForBrowser(value),
          attributeEnd,
        );
        break;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "ref":
        break;
      case "autoFocus":
      case "multiple":
      case "muted":
        pushBooleanAttribute(target, name.toLowerCase(), value);
        break;
      case "xlinkHref":
        if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
          break;
        value = sanitizeURL("" + value);
        target.push(
          attributeSeparator,
          "xlink:href",
          attributeAssign,
          escapeTextForBrowser(value),
          attributeEnd,
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        "function" !== typeof value &&
          "symbol" !== typeof value &&
          target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd,
          );
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value &&
          "function" !== typeof value &&
          "symbol" !== typeof value &&
          target.push(attributeSeparator, name, attributeEmptyString);
        break;
      case "capture":
      case "download":
        true === value
          ? target.push(attributeSeparator, name, attributeEmptyString)
          : false !== value &&
            "function" !== typeof value &&
            "symbol" !== typeof value &&
            target.push(
              attributeSeparator,
              name,
              attributeAssign,
              escapeTextForBrowser(value),
              attributeEnd,
            );
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        "function" !== typeof value &&
          "symbol" !== typeof value &&
          !isNaN(value) &&
          1 <= value &&
          target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd,
          );
        break;
      case "rowSpan":
      case "start":
        "function" === typeof value ||
          "symbol" === typeof value ||
          isNaN(value) ||
          target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd,
          );
        break;
      case "xlinkActuate":
        pushStringAttribute(target, "xlink:actuate", value);
        break;
      case "xlinkArcrole":
        pushStringAttribute(target, "xlink:arcrole", value);
        break;
      case "xlinkRole":
        pushStringAttribute(target, "xlink:role", value);
        break;
      case "xlinkShow":
        pushStringAttribute(target, "xlink:show", value);
        break;
      case "xlinkTitle":
        pushStringAttribute(target, "xlink:title", value);
        break;
      case "xlinkType":
        pushStringAttribute(target, "xlink:type", value);
        break;
      case "xmlBase":
        pushStringAttribute(target, "xml:base", value);
        break;
      case "xmlLang":
        pushStringAttribute(target, "xml:lang", value);
        break;
      case "xmlSpace":
        pushStringAttribute(target, "xml:space", value);
        break;
      default:
        if (
          !(2 < name.length) ||
          ("o" !== name[0] && "O" !== name[0]) ||
          ("n" !== name[1] && "N" !== name[1])
        ) {
          if (((name = aliases.get(name) || name), isAttributeNameSafe(name))) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean":
                var prefix$8 = name.toLowerCase().slice(0, 5);
                if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
            }
            target.push(
              attributeSeparator,
              name,
              attributeAssign,
              escapeTextForBrowser(value),
              attributeEnd,
            );
          }
        }
    }
  }
  var endOfStartTag = stringToPrecomputedChunk(">"),
    endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
  function pushInnerHTML(target, innerHTML, children) {
    if (null != innerHTML) {
      if (null != children)
        throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
      if ("object" !== typeof innerHTML || !("__html" in innerHTML))
        throw Error(
          "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.",
        );
      innerHTML = innerHTML.__html;
      null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
    }
  }
  function flattenOptionChildren(children) {
    var content = "";
    React2.Children.forEach(children, function (child) {
      null != child && (content += child);
    });
    return content;
  }
  var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""'),
    formReplayingRuntimeScript = stringToPrecomputedChunk(
      `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`,
    );
  function injectFormReplayingRuntime(resumableState, renderState) {
    if (0 === (resumableState.instructions & 16)) {
      resumableState.instructions |= 16;
      var preamble = renderState.preamble,
        bootstrapChunks = renderState.bootstrapChunks;
      (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length
        ? (bootstrapChunks.push(renderState.startInlineScript),
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState),
          bootstrapChunks.push(endOfStartTag, formReplayingRuntimeScript, endInlineScript))
        : bootstrapChunks.unshift(
            renderState.startInlineScript,
            endOfStartTag,
            formReplayingRuntimeScript,
            endInlineScript,
          );
    }
  }
  var formStateMarkerIsMatching = stringToPrecomputedChunk("<!--F!-->"),
    formStateMarkerIsNotMatching = stringToPrecomputedChunk("<!--F-->");
  function pushLinkImpl(target, props) {
    target.push(startChunkForTag("link"));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(
                "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
              );
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTagSelfClosing);
    return null;
  }
  var styleRegex = /(<\/|<)(s)(tyle)/gi;
  function styleReplacer(match, prefix3, s, suffix2) {
    return "" + prefix3 + ("s" === s ? "\\73 " : "\\53 ") + suffix2;
  }
  function pushSelfClosing(target, props, tag) {
    target.push(startChunkForTag(tag));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(
                tag +
                  " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
              );
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTagSelfClosing);
    return null;
  }
  function pushTitleImpl(target, props) {
    target.push(startChunkForTag("title"));
    var children = null,
      innerHTML = null,
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    props = Array.isArray(children) ? (2 > children.length ? children[0] : null) : children;
    "function" !== typeof props &&
      "symbol" !== typeof props &&
      null !== props &&
      void 0 !== props &&
      target.push(escapeTextForBrowser("" + props));
    pushInnerHTML(target, innerHTML, children);
    target.push(endChunkForTag("title"));
    return null;
  }
  var headPreambleContributionChunk = stringToPrecomputedChunk("<!--head-->"),
    bodyPreambleContributionChunk = stringToPrecomputedChunk("<!--body-->"),
    htmlPreambleContributionChunk = stringToPrecomputedChunk("<!--html-->");
  function pushScriptImpl(target, props) {
    target.push(startChunkForTag("script"));
    var children = null,
      innerHTML = null,
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, children);
    "string" === typeof children &&
      target.push(("" + children).replace(scriptRegex, scriptReplacer));
    target.push(endChunkForTag("script"));
    return null;
  }
  function pushStartSingletonElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = (tag = null),
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, tag);
    return tag;
  }
  function pushStartGenericElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = (tag = null),
      propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, tag);
    return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
  }
  var leadingNewline = stringToPrecomputedChunk("\n"),
    VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,
    validatedTagCache = /* @__PURE__ */ new Map();
  function startChunkForTag(tag) {
    var tagStartChunk = validatedTagCache.get(tag);
    if (void 0 === tagStartChunk) {
      if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
      tagStartChunk = stringToPrecomputedChunk("<" + tag);
      validatedTagCache.set(tag, tagStartChunk);
    }
    return tagStartChunk;
  }
  var doctypeChunk = stringToPrecomputedChunk("<!DOCTYPE html>");
  function pushStartInstance(
    target$jscomp$0,
    type,
    props,
    resumableState,
    renderState,
    preambleState,
    hoistableState,
    formatContext,
    textEmbedded,
  ) {
    switch (type) {
      case "div":
      case "span":
      case "svg":
      case "path":
        break;
      case "a":
        target$jscomp$0.push(startChunkForTag("a"));
        var children = null,
          innerHTML = null,
          propKey;
        for (propKey in props)
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "href":
                  "" === propValue
                    ? pushStringAttribute(target$jscomp$0, "href", "")
                    : pushAttribute(target$jscomp$0, propKey, propValue);
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey, propValue);
              }
          }
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML, children);
        if ("string" === typeof children) {
          target$jscomp$0.push(escapeTextForBrowser(children));
          var JSCompiler_inline_result = null;
        } else JSCompiler_inline_result = children;
        return JSCompiler_inline_result;
      case "g":
      case "p":
      case "li":
        break;
      case "select":
        target$jscomp$0.push(startChunkForTag("select"));
        var children$jscomp$0 = null,
          innerHTML$jscomp$0 = null,
          propKey$jscomp$0;
        for (propKey$jscomp$0 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$0)) {
            var propValue$jscomp$0 = props[propKey$jscomp$0];
            if (null != propValue$jscomp$0)
              switch (propKey$jscomp$0) {
                case "children":
                  children$jscomp$0 = propValue$jscomp$0;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$0 = propValue$jscomp$0;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$0, propValue$jscomp$0);
              }
          }
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
        return children$jscomp$0;
      case "option":
        var selectedValue = formatContext.selectedValue;
        target$jscomp$0.push(startChunkForTag("option"));
        var children$jscomp$1 = null,
          value = null,
          selected = null,
          innerHTML$jscomp$1 = null,
          propKey$jscomp$1;
        for (propKey$jscomp$1 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$1)) {
            var propValue$jscomp$1 = props[propKey$jscomp$1];
            if (null != propValue$jscomp$1)
              switch (propKey$jscomp$1) {
                case "children":
                  children$jscomp$1 = propValue$jscomp$1;
                  break;
                case "selected":
                  selected = propValue$jscomp$1;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$1 = propValue$jscomp$1;
                  break;
                case "value":
                  value = propValue$jscomp$1;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$1, propValue$jscomp$1);
              }
          }
        if (null != selectedValue) {
          var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
          if (isArrayImpl(selectedValue))
            for (var i = 0; i < selectedValue.length; i++) {
              if ("" + selectedValue[i] === stringValue) {
                target$jscomp$0.push(selectedMarkerAttribute);
                break;
              }
            }
          else "" + selectedValue === stringValue && target$jscomp$0.push(selectedMarkerAttribute);
        } else selected && target$jscomp$0.push(selectedMarkerAttribute);
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
        return children$jscomp$1;
      case "textarea":
        target$jscomp$0.push(startChunkForTag("textarea"));
        var value$jscomp$0 = null,
          defaultValue = null,
          children$jscomp$2 = null,
          propKey$jscomp$2;
        for (propKey$jscomp$2 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$2)) {
            var propValue$jscomp$2 = props[propKey$jscomp$2];
            if (null != propValue$jscomp$2)
              switch (propKey$jscomp$2) {
                case "children":
                  children$jscomp$2 = propValue$jscomp$2;
                  break;
                case "value":
                  value$jscomp$0 = propValue$jscomp$2;
                  break;
                case "defaultValue":
                  defaultValue = propValue$jscomp$2;
                  break;
                case "dangerouslySetInnerHTML":
                  throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$2, propValue$jscomp$2);
              }
          }
        null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
        target$jscomp$0.push(endOfStartTag);
        if (null != children$jscomp$2) {
          if (null != value$jscomp$0)
            throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
          if (isArrayImpl(children$jscomp$2)) {
            if (1 < children$jscomp$2.length)
              throw Error("<textarea> can only have at most one child.");
            value$jscomp$0 = "" + children$jscomp$2[0];
          }
          value$jscomp$0 = "" + children$jscomp$2;
        }
        "string" === typeof value$jscomp$0 &&
          "\n" === value$jscomp$0[0] &&
          target$jscomp$0.push(leadingNewline);
        null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
        return null;
      case "input":
        target$jscomp$0.push(startChunkForTag("input"));
        var name = null,
          formAction = null,
          formEncType = null,
          formMethod = null,
          formTarget = null,
          value$jscomp$1 = null,
          defaultValue$jscomp$0 = null,
          checked = null,
          defaultChecked = null,
          propKey$jscomp$3;
        for (propKey$jscomp$3 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$3)) {
            var propValue$jscomp$3 = props[propKey$jscomp$3];
            if (null != propValue$jscomp$3)
              switch (propKey$jscomp$3) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
                  );
                case "name":
                  name = propValue$jscomp$3;
                  break;
                case "formAction":
                  formAction = propValue$jscomp$3;
                  break;
                case "formEncType":
                  formEncType = propValue$jscomp$3;
                  break;
                case "formMethod":
                  formMethod = propValue$jscomp$3;
                  break;
                case "formTarget":
                  formTarget = propValue$jscomp$3;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$jscomp$3;
                  break;
                case "defaultValue":
                  defaultValue$jscomp$0 = propValue$jscomp$3;
                  break;
                case "checked":
                  checked = propValue$jscomp$3;
                  break;
                case "value":
                  value$jscomp$1 = propValue$jscomp$3;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$3, propValue$jscomp$3);
              }
          }
        var formData = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction,
          formEncType,
          formMethod,
          formTarget,
          name,
        );
        null !== checked
          ? pushBooleanAttribute(target$jscomp$0, "checked", checked)
          : null !== defaultChecked &&
            pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
        null !== value$jscomp$1
          ? pushAttribute(target$jscomp$0, "value", value$jscomp$1)
          : null !== defaultValue$jscomp$0 &&
            pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
        target$jscomp$0.push(endOfStartTagSelfClosing);
        null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
        return null;
      case "button":
        target$jscomp$0.push(startChunkForTag("button"));
        var children$jscomp$3 = null,
          innerHTML$jscomp$2 = null,
          name$jscomp$0 = null,
          formAction$jscomp$0 = null,
          formEncType$jscomp$0 = null,
          formMethod$jscomp$0 = null,
          formTarget$jscomp$0 = null,
          propKey$jscomp$4;
        for (propKey$jscomp$4 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$4)) {
            var propValue$jscomp$4 = props[propKey$jscomp$4];
            if (null != propValue$jscomp$4)
              switch (propKey$jscomp$4) {
                case "children":
                  children$jscomp$3 = propValue$jscomp$4;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$2 = propValue$jscomp$4;
                  break;
                case "name":
                  name$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formAction":
                  formAction$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formEncType":
                  formEncType$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formMethod":
                  formMethod$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formTarget":
                  formTarget$jscomp$0 = propValue$jscomp$4;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$4, propValue$jscomp$4);
              }
          }
        var formData$jscomp$0 = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction$jscomp$0,
          formEncType$jscomp$0,
          formMethod$jscomp$0,
          formTarget$jscomp$0,
          name$jscomp$0,
        );
        target$jscomp$0.push(endOfStartTag);
        null != formData$jscomp$0 &&
          formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
        if ("string" === typeof children$jscomp$3) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
          var JSCompiler_inline_result$jscomp$0 = null;
        } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
        return JSCompiler_inline_result$jscomp$0;
      case "form":
        target$jscomp$0.push(startChunkForTag("form"));
        var children$jscomp$4 = null,
          innerHTML$jscomp$3 = null,
          formAction$jscomp$1 = null,
          formEncType$jscomp$1 = null,
          formMethod$jscomp$1 = null,
          formTarget$jscomp$1 = null,
          propKey$jscomp$5;
        for (propKey$jscomp$5 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$5)) {
            var propValue$jscomp$5 = props[propKey$jscomp$5];
            if (null != propValue$jscomp$5)
              switch (propKey$jscomp$5) {
                case "children":
                  children$jscomp$4 = propValue$jscomp$5;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$3 = propValue$jscomp$5;
                  break;
                case "action":
                  formAction$jscomp$1 = propValue$jscomp$5;
                  break;
                case "encType":
                  formEncType$jscomp$1 = propValue$jscomp$5;
                  break;
                case "method":
                  formMethod$jscomp$1 = propValue$jscomp$5;
                  break;
                case "target":
                  formTarget$jscomp$1 = propValue$jscomp$5;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$5, propValue$jscomp$5);
              }
          }
        var formData$jscomp$1 = null,
          formActionName = null;
        if ("function" === typeof formAction$jscomp$1) {
          var customFields = getCustomFormFields(resumableState, formAction$jscomp$1);
          null !== customFields
            ? ((formAction$jscomp$1 = customFields.action || ""),
              (formEncType$jscomp$1 = customFields.encType),
              (formMethod$jscomp$1 = customFields.method),
              (formTarget$jscomp$1 = customFields.target),
              (formData$jscomp$1 = customFields.data),
              (formActionName = customFields.name))
            : (target$jscomp$0.push(
                attributeSeparator,
                "action",
                attributeAssign,
                actionJavaScriptURL,
                attributeEnd,
              ),
              (formTarget$jscomp$1 =
                formMethod$jscomp$1 =
                formEncType$jscomp$1 =
                formAction$jscomp$1 =
                  null),
              injectFormReplayingRuntime(resumableState, renderState));
        }
        null != formAction$jscomp$1 &&
          pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
        null != formEncType$jscomp$1 &&
          pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
        null != formMethod$jscomp$1 &&
          pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
        null != formTarget$jscomp$1 &&
          pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
        target$jscomp$0.push(endOfStartTag);
        null !== formActionName &&
          (target$jscomp$0.push(startHiddenInputChunk),
          pushStringAttribute(target$jscomp$0, "name", formActionName),
          target$jscomp$0.push(endOfStartTagSelfClosing),
          null != formData$jscomp$1 &&
            formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
        if ("string" === typeof children$jscomp$4) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
          var JSCompiler_inline_result$jscomp$1 = null;
        } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
        return JSCompiler_inline_result$jscomp$1;
      case "menuitem":
        target$jscomp$0.push(startChunkForTag("menuitem"));
        for (var propKey$jscomp$6 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$6)) {
            var propValue$jscomp$6 = props[propKey$jscomp$6];
            if (null != propValue$jscomp$6)
              switch (propKey$jscomp$6) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$6, propValue$jscomp$6);
              }
          }
        target$jscomp$0.push(endOfStartTag);
        return null;
      case "object":
        target$jscomp$0.push(startChunkForTag("object"));
        var children$jscomp$5 = null,
          innerHTML$jscomp$4 = null,
          propKey$jscomp$7;
        for (propKey$jscomp$7 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$7)) {
            var propValue$jscomp$7 = props[propKey$jscomp$7];
            if (null != propValue$jscomp$7)
              switch (propKey$jscomp$7) {
                case "children":
                  children$jscomp$5 = propValue$jscomp$7;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$4 = propValue$jscomp$7;
                  break;
                case "data":
                  var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                  if ("" === sanitizedValue) break;
                  target$jscomp$0.push(
                    attributeSeparator,
                    "data",
                    attributeAssign,
                    escapeTextForBrowser(sanitizedValue),
                    attributeEnd,
                  );
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$7, propValue$jscomp$7);
              }
          }
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
        if ("string" === typeof children$jscomp$5) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
          var JSCompiler_inline_result$jscomp$2 = null;
        } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
        return JSCompiler_inline_result$jscomp$2;
      case "title":
        var noscriptTagInScope = formatContext.tagScope & 1,
          isFallback = formatContext.tagScope & 4;
        if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(target$jscomp$0, props);
        else
          isFallback
            ? (JSCompiler_inline_result$jscomp$3 = null)
            : (pushTitleImpl(renderState.hoistableChunks, props),
              (JSCompiler_inline_result$jscomp$3 = void 0));
        return JSCompiler_inline_result$jscomp$3;
      case "link":
        var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1,
          isFallback$jscomp$0 = formatContext.tagScope & 4,
          rel = props.rel,
          href = props.href,
          precedence = props.precedence;
        if (
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$0 ||
          null != props.itemProp ||
          "string" !== typeof rel ||
          "string" !== typeof href ||
          "" === href
        ) {
          pushLinkImpl(target$jscomp$0, props);
          var JSCompiler_inline_result$jscomp$4 = null;
        } else if ("stylesheet" === props.rel)
          if (
            "string" !== typeof precedence ||
            null != props.disabled ||
            props.onLoad ||
            props.onError
          )
            JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props);
          else {
            var styleQueue = renderState.styles.get(precedence),
              resourceState = resumableState.styleResources.hasOwnProperty(href)
                ? resumableState.styleResources[href]
                : void 0;
            if (null !== resourceState) {
              resumableState.styleResources[href] = null;
              styleQueue ||
                ((styleQueue = {
                  precedence: escapeTextForBrowser(precedence),
                  rules: [],
                  hrefs: [],
                  sheets: /* @__PURE__ */ new Map(),
                }),
                renderState.styles.set(precedence, styleQueue));
              var resource = {
                state: 0,
                props: assign({}, props, {
                  "data-precedence": props.precedence,
                  precedence: null,
                }),
              };
              if (resourceState) {
                2 === resourceState.length &&
                  adoptPreloadCredentials(resource.props, resourceState);
                var preloadResource = renderState.preloads.stylesheets.get(href);
                preloadResource && 0 < preloadResource.length
                  ? (preloadResource.length = 0)
                  : (resource.state = 1);
              }
              styleQueue.sheets.set(href, resource);
              hoistableState && hoistableState.stylesheets.add(resource);
            } else if (styleQueue) {
              var resource$9 = styleQueue.sheets.get(href);
              resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
            }
            textEmbedded && target$jscomp$0.push(textSeparator);
            JSCompiler_inline_result$jscomp$4 = null;
          }
        else
          props.onLoad || props.onError
            ? (JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props))
            : (textEmbedded && target$jscomp$0.push(textSeparator),
              (JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0
                ? null
                : pushLinkImpl(renderState.hoistableChunks, props)));
        return JSCompiler_inline_result$jscomp$4;
      case "script":
        var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1,
          asyncProp = props.async;
        if (
          "string" !== typeof props.src ||
          !props.src ||
          !asyncProp ||
          "function" === typeof asyncProp ||
          "symbol" === typeof asyncProp ||
          props.onLoad ||
          props.onError ||
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$1 ||
          null != props.itemProp
        )
          var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(target$jscomp$0, props);
        else {
          var key = props.src;
          if ("module" === props.type) {
            var resources = resumableState.moduleScriptResources;
            var preloads = renderState.preloads.moduleScripts;
          } else
            ((resources = resumableState.scriptResources),
              (preloads = renderState.preloads.scripts));
          var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
          if (null !== resourceState$jscomp$0) {
            resources[key] = null;
            var scriptProps = props;
            if (resourceState$jscomp$0) {
              2 === resourceState$jscomp$0.length &&
                ((scriptProps = assign({}, props)),
                adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
              var preloadResource$jscomp$0 = preloads.get(key);
              preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
            }
            var resource$jscomp$0 = [];
            renderState.scripts.add(resource$jscomp$0);
            pushScriptImpl(resource$jscomp$0, scriptProps);
          }
          textEmbedded && target$jscomp$0.push(textSeparator);
          JSCompiler_inline_result$jscomp$5 = null;
        }
        return JSCompiler_inline_result$jscomp$5;
      case "style":
        var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1,
          precedence$jscomp$0 = props.precedence,
          href$jscomp$0 = props.href,
          nonce = props.nonce;
        if (
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$2 ||
          null != props.itemProp ||
          "string" !== typeof precedence$jscomp$0 ||
          "string" !== typeof href$jscomp$0 ||
          "" === href$jscomp$0
        ) {
          target$jscomp$0.push(startChunkForTag("style"));
          var children$jscomp$6 = null,
            innerHTML$jscomp$5 = null,
            propKey$jscomp$8;
          for (propKey$jscomp$8 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$8)) {
              var propValue$jscomp$8 = props[propKey$jscomp$8];
              if (null != propValue$jscomp$8)
                switch (propKey$jscomp$8) {
                  case "children":
                    children$jscomp$6 = propValue$jscomp$8;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$5 = propValue$jscomp$8;
                    break;
                  default:
                    pushAttribute(target$jscomp$0, propKey$jscomp$8, propValue$jscomp$8);
                }
            }
          target$jscomp$0.push(endOfStartTag);
          var child = Array.isArray(children$jscomp$6)
            ? 2 > children$jscomp$6.length
              ? children$jscomp$6[0]
              : null
            : children$jscomp$6;
          "function" !== typeof child &&
            "symbol" !== typeof child &&
            null !== child &&
            void 0 !== child &&
            target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
          target$jscomp$0.push(endChunkForTag("style"));
          var JSCompiler_inline_result$jscomp$6 = null;
        } else {
          var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
          if (
            null !==
            (resumableState.styleResources.hasOwnProperty(href$jscomp$0)
              ? resumableState.styleResources[href$jscomp$0]
              : void 0)
          ) {
            resumableState.styleResources[href$jscomp$0] = null;
            styleQueue$jscomp$0 ||
              ((styleQueue$jscomp$0 = {
                precedence: escapeTextForBrowser(precedence$jscomp$0),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map(),
              }),
              renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
            var nonceStyle = renderState.nonce.style;
            if (!nonceStyle || nonceStyle === nonce) {
              styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
              var target = styleQueue$jscomp$0.rules,
                children$jscomp$7 = null,
                innerHTML$jscomp$6 = null,
                propKey$jscomp$9;
              for (propKey$jscomp$9 in props)
                if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                  var propValue$jscomp$9 = props[propKey$jscomp$9];
                  if (null != propValue$jscomp$9)
                    switch (propKey$jscomp$9) {
                      case "children":
                        children$jscomp$7 = propValue$jscomp$9;
                        break;
                      case "dangerouslySetInnerHTML":
                        innerHTML$jscomp$6 = propValue$jscomp$9;
                    }
                }
              var child$jscomp$0 = Array.isArray(children$jscomp$7)
                ? 2 > children$jscomp$7.length
                  ? children$jscomp$7[0]
                  : null
                : children$jscomp$7;
              "function" !== typeof child$jscomp$0 &&
                "symbol" !== typeof child$jscomp$0 &&
                null !== child$jscomp$0 &&
                void 0 !== child$jscomp$0 &&
                target.push(("" + child$jscomp$0).replace(styleRegex, styleReplacer));
              pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
            }
          }
          styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
          textEmbedded && target$jscomp$0.push(textSeparator);
          JSCompiler_inline_result$jscomp$6 = void 0;
        }
        return JSCompiler_inline_result$jscomp$6;
      case "meta":
        var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1,
          isFallback$jscomp$1 = formatContext.tagScope & 4;
        if (
          4 === formatContext.insertionMode ||
          noscriptTagInScope$jscomp$3 ||
          null != props.itemProp
        )
          var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(target$jscomp$0, props, "meta");
        else
          (textEmbedded && target$jscomp$0.push(textSeparator),
            (JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1
              ? null
              : "string" === typeof props.charSet
                ? pushSelfClosing(renderState.charsetChunks, props, "meta")
                : "viewport" === props.name
                  ? pushSelfClosing(renderState.viewportChunks, props, "meta")
                  : pushSelfClosing(renderState.hoistableChunks, props, "meta")));
        return JSCompiler_inline_result$jscomp$7;
      case "listing":
      case "pre":
        target$jscomp$0.push(startChunkForTag(type));
        var children$jscomp$8 = null,
          innerHTML$jscomp$7 = null,
          propKey$jscomp$10;
        for (propKey$jscomp$10 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$10)) {
            var propValue$jscomp$10 = props[propKey$jscomp$10];
            if (null != propValue$jscomp$10)
              switch (propKey$jscomp$10) {
                case "children":
                  children$jscomp$8 = propValue$jscomp$10;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$7 = propValue$jscomp$10;
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey$jscomp$10, propValue$jscomp$10);
              }
          }
        target$jscomp$0.push(endOfStartTag);
        if (null != innerHTML$jscomp$7) {
          if (null != children$jscomp$8)
            throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
            throw Error(
              "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.",
            );
          var html = innerHTML$jscomp$7.__html;
          null !== html &&
            void 0 !== html &&
            ("string" === typeof html && 0 < html.length && "\n" === html[0]
              ? target$jscomp$0.push(leadingNewline, html)
              : target$jscomp$0.push("" + html));
        }
        "string" === typeof children$jscomp$8 &&
          "\n" === children$jscomp$8[0] &&
          target$jscomp$0.push(leadingNewline);
        return children$jscomp$8;
      case "img":
        var pictureOrNoScriptTagInScope = formatContext.tagScope & 3,
          src = props.src,
          srcSet = props.srcSet;
        if (
          !(
            "lazy" === props.loading ||
            (!src && !srcSet) ||
            ("string" !== typeof src && null != src) ||
            ("string" !== typeof srcSet && null != srcSet) ||
            "low" === props.fetchPriority ||
            pictureOrNoScriptTagInScope
          ) &&
          ("string" !== typeof src ||
            ":" !== src[4] ||
            ("d" !== src[0] && "D" !== src[0]) ||
            ("a" !== src[1] && "A" !== src[1]) ||
            ("t" !== src[2] && "T" !== src[2]) ||
            ("a" !== src[3] && "A" !== src[3])) &&
          ("string" !== typeof srcSet ||
            ":" !== srcSet[4] ||
            ("d" !== srcSet[0] && "D" !== srcSet[0]) ||
            ("a" !== srcSet[1] && "A" !== srcSet[1]) ||
            ("t" !== srcSet[2] && "T" !== srcSet[2]) ||
            ("a" !== srcSet[3] && "A" !== srcSet[3]))
        ) {
          null !== hoistableState &&
            formatContext.tagScope & 64 &&
            (hoistableState.suspenseyImages = true);
          var sizes = "string" === typeof props.sizes ? props.sizes : void 0,
            key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src,
            promotablePreloads = renderState.preloads.images,
            resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
          if (resource$jscomp$1) {
            if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
              (promotablePreloads.delete(key$jscomp$0),
                renderState.highImagePreloads.add(resource$jscomp$1));
          } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
            resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
            var input = props.crossOrigin;
            var JSCompiler_inline_result$jscomp$8 =
              "string" === typeof input ? ("use-credentials" === input ? input : "") : void 0;
            var headers = renderState.headers,
              header;
            headers &&
            0 < headers.remainingCapacity &&
            "string" !== typeof props.srcSet &&
            ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) &&
            ((header = getPreloadAsHeader(src, "image", {
              imageSrcSet: props.srcSet,
              imageSizes: props.sizes,
              crossOrigin: JSCompiler_inline_result$jscomp$8,
              integrity: props.integrity,
              nonce: props.nonce,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.refererPolicy,
            })),
            0 <= (headers.remainingCapacity -= header.length + 2))
              ? ((renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS),
                headers.highImagePreloads && (headers.highImagePreloads += ", "),
                (headers.highImagePreloads += header))
              : ((resource$jscomp$1 = []),
                pushLinkImpl(resource$jscomp$1, {
                  rel: "preload",
                  as: "image",
                  href: srcSet ? void 0 : src,
                  imageSrcSet: srcSet,
                  imageSizes: sizes,
                  crossOrigin: JSCompiler_inline_result$jscomp$8,
                  integrity: props.integrity,
                  type: props.type,
                  fetchPriority: props.fetchPriority,
                  referrerPolicy: props.referrerPolicy,
                }),
                "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size
                  ? renderState.highImagePreloads.add(resource$jscomp$1)
                  : (renderState.bulkPreloads.add(resource$jscomp$1),
                    promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
          }
        }
        return pushSelfClosing(target$jscomp$0, props, "img");
      case "base":
      case "area":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "param":
      case "source":
      case "track":
      case "wbr":
        return pushSelfClosing(target$jscomp$0, props, type);
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        break;
      case "head":
        if (2 > formatContext.insertionMode) {
          var preamble = preambleState || renderState.preamble;
          if (preamble.headChunks) throw Error("The `<head>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push(headPreambleContributionChunk);
          preamble.headChunks = [];
          var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
            preamble.headChunks,
            props,
            "head",
          );
        } else
          JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "head",
          );
        return JSCompiler_inline_result$jscomp$9;
      case "body":
        if (2 > formatContext.insertionMode) {
          var preamble$jscomp$0 = preambleState || renderState.preamble;
          if (preamble$jscomp$0.bodyChunks)
            throw Error("The `<body>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push(bodyPreambleContributionChunk);
          preamble$jscomp$0.bodyChunks = [];
          var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
            preamble$jscomp$0.bodyChunks,
            props,
            "body",
          );
        } else
          JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "body",
          );
        return JSCompiler_inline_result$jscomp$10;
      case "html":
        if (0 === formatContext.insertionMode) {
          var preamble$jscomp$1 = preambleState || renderState.preamble;
          if (preamble$jscomp$1.htmlChunks)
            throw Error("The `<html>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push(htmlPreambleContributionChunk);
          preamble$jscomp$1.htmlChunks = [doctypeChunk];
          var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
            preamble$jscomp$1.htmlChunks,
            props,
            "html",
          );
        } else
          JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "html",
          );
        return JSCompiler_inline_result$jscomp$11;
      default:
        if (-1 !== type.indexOf("-")) {
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$9 = null,
            innerHTML$jscomp$8 = null,
            propKey$jscomp$11;
          for (propKey$jscomp$11 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$11)) {
              var propValue$jscomp$11 = props[propKey$jscomp$11];
              if (null != propValue$jscomp$11) {
                var attributeName = propKey$jscomp$11;
                switch (propKey$jscomp$11) {
                  case "children":
                    children$jscomp$9 = propValue$jscomp$11;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$8 = propValue$jscomp$11;
                    break;
                  case "style":
                    pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                    break;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                  case "ref":
                    break;
                  case "className":
                    attributeName = "class";
                  default:
                    if (
                      isAttributeNameSafe(propKey$jscomp$11) &&
                      "function" !== typeof propValue$jscomp$11 &&
                      "symbol" !== typeof propValue$jscomp$11 &&
                      false !== propValue$jscomp$11
                    ) {
                      if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                      else if ("object" === typeof propValue$jscomp$11) continue;
                      target$jscomp$0.push(
                        attributeSeparator,
                        attributeName,
                        attributeAssign,
                        escapeTextForBrowser(propValue$jscomp$11),
                        attributeEnd,
                      );
                    }
                }
              }
            }
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
          return children$jscomp$9;
        }
    }
    return pushStartGenericElement(target$jscomp$0, props, type);
  }
  var endTagCache = /* @__PURE__ */ new Map();
  function endChunkForTag(tag) {
    var chunk = endTagCache.get(tag);
    void 0 === chunk &&
      ((chunk = stringToPrecomputedChunk("</" + tag + ">")), endTagCache.set(tag, chunk));
    return chunk;
  }
  function hoistPreambleState(renderState, preambleState) {
    renderState = renderState.preamble;
    null === renderState.htmlChunks &&
      preambleState.htmlChunks &&
      (renderState.htmlChunks = preambleState.htmlChunks);
    null === renderState.headChunks &&
      preambleState.headChunks &&
      (renderState.headChunks = preambleState.headChunks);
    null === renderState.bodyChunks &&
      preambleState.bodyChunks &&
      (renderState.bodyChunks = preambleState.bodyChunks);
  }
  function writeBootstrap(destination, renderState) {
    renderState = renderState.bootstrapChunks;
    for (var i = 0; i < renderState.length - 1; i++) writeChunk(destination, renderState[i]);
    return i < renderState.length
      ? ((i = renderState[i]), (renderState.length = 0), writeChunkAndReturn(destination, i))
      : true;
  }
  var shellTimeRuntimeScript = stringToPrecomputedChunk(
      "requestAnimationFrame(function(){$RT=performance.now()});",
    ),
    placeholder1 = stringToPrecomputedChunk('<template id="'),
    placeholder2 = stringToPrecomputedChunk('"></template>'),
    startActivityBoundary = stringToPrecomputedChunk("<!--&-->"),
    endActivityBoundary = stringToPrecomputedChunk("<!--/&-->"),
    startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->"),
    startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="'),
    startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>'),
    startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->"),
    endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->"),
    clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template"),
    clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"'),
    clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
  stringToPrecomputedChunk(' data-msg="');
  stringToPrecomputedChunk(' data-stck="');
  stringToPrecomputedChunk(' data-cstck="');
  var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
  function writeStartPendingSuspenseBoundary(destination, renderState, id) {
    writeChunk(destination, startPendingSuspenseBoundary1);
    if (null === id)
      throw Error("An ID must have been assigned before we can complete the boundary.");
    writeChunk(destination, renderState.boundaryPrefix);
    writeChunk(destination, id.toString(16));
    return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
  }
  var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="'),
    startSegmentHTML2 = stringToPrecomputedChunk('">'),
    endSegmentHTML = stringToPrecomputedChunk("</div>"),
    startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="'),
    startSegmentSVG2 = stringToPrecomputedChunk('">'),
    endSegmentSVG = stringToPrecomputedChunk("</svg>"),
    startSegmentMathML = stringToPrecomputedChunk(
      '<math aria-hidden="true" style="display:none" id="',
    ),
    startSegmentMathML2 = stringToPrecomputedChunk('">'),
    endSegmentMathML = stringToPrecomputedChunk("</math>"),
    startSegmentTable = stringToPrecomputedChunk('<table hidden id="'),
    startSegmentTable2 = stringToPrecomputedChunk('">'),
    endSegmentTable = stringToPrecomputedChunk("</table>"),
    startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="'),
    startSegmentTableBody2 = stringToPrecomputedChunk('">'),
    endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>"),
    startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="'),
    startSegmentTableRow2 = stringToPrecomputedChunk('">'),
    endSegmentTableRow = stringToPrecomputedChunk("</tr></table>"),
    startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="'),
    startSegmentColGroup2 = stringToPrecomputedChunk('">'),
    endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
  function writeStartSegment(destination, renderState, formatContext, id) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return (
          writeChunk(destination, startSegmentHTML),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentHTML2)
        );
      case 4:
        return (
          writeChunk(destination, startSegmentSVG),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentSVG2)
        );
      case 5:
        return (
          writeChunk(destination, startSegmentMathML),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentMathML2)
        );
      case 6:
        return (
          writeChunk(destination, startSegmentTable),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentTable2)
        );
      case 7:
        return (
          writeChunk(destination, startSegmentTableBody),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentTableBody2)
        );
      case 8:
        return (
          writeChunk(destination, startSegmentTableRow),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentTableRow2)
        );
      case 9:
        return (
          writeChunk(destination, startSegmentColGroup),
          writeChunk(destination, renderState.segmentPrefix),
          writeChunk(destination, id.toString(16)),
          writeChunkAndReturn(destination, startSegmentColGroup2)
        );
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  function writeEndSegment(destination, formatContext) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return writeChunkAndReturn(destination, endSegmentHTML);
      case 4:
        return writeChunkAndReturn(destination, endSegmentSVG);
      case 5:
        return writeChunkAndReturn(destination, endSegmentMathML);
      case 6:
        return writeChunkAndReturn(destination, endSegmentTable);
      case 7:
        return writeChunkAndReturn(destination, endSegmentTableBody);
      case 8:
        return writeChunkAndReturn(destination, endSegmentTableRow);
      case 9:
        return writeChunkAndReturn(destination, endSegmentColGroup);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  var completeSegmentScript1Full = stringToPrecomputedChunk(
      '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("',
    ),
    completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("'),
    completeSegmentScript2 = stringToPrecomputedChunk('","'),
    completeSegmentScriptEnd = stringToPrecomputedChunk('")<\/script>');
  stringToPrecomputedChunk('<template data-rsi="" data-sid="');
  stringToPrecomputedChunk('" data-pid="');
  var completeBoundaryScriptFunctionOnly = stringToPrecomputedChunk(
      '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};',
    ),
    completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("'),
    completeBoundaryWithStylesScript1FullPartial = stringToPrecomputedChunk(
      '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("',
    ),
    completeBoundaryWithStylesScript1Partial = stringToPrecomputedChunk('$RR("'),
    completeBoundaryScript2 = stringToPrecomputedChunk('","'),
    completeBoundaryScript3a = stringToPrecomputedChunk('",'),
    completeBoundaryScript3b = stringToPrecomputedChunk('"'),
    completeBoundaryScriptEnd = stringToPrecomputedChunk(")<\/script>");
  stringToPrecomputedChunk('<template data-rci="" data-bid="');
  stringToPrecomputedChunk('<template data-rri="" data-bid="');
  stringToPrecomputedChunk('" data-sid="');
  stringToPrecomputedChunk('" data-sty="');
  var clientRenderScriptFunctionOnly = stringToPrecomputedChunk(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};',
    ),
    clientRenderScript1Full = stringToPrecomputedChunk(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("',
    ),
    clientRenderScript1Partial = stringToPrecomputedChunk('$RX("'),
    clientRenderScript1A = stringToPrecomputedChunk('"'),
    clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(","),
    clientRenderScriptEnd = stringToPrecomputedChunk(")<\/script>");
  stringToPrecomputedChunk('<template data-rxi="" data-bid="');
  stringToPrecomputedChunk('" data-dgst="');
  stringToPrecomputedChunk('" data-msg="');
  stringToPrecomputedChunk('" data-stck="');
  stringToPrecomputedChunk('" data-cstck="');
  var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
  function escapeJSStringsForInstructionScripts(input) {
    return JSON.stringify(input).replace(regexForJSStringsInInstructionScripts, function (match) {
      switch (match) {
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error(
            "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
          );
      }
    });
  }
  var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
  function escapeJSObjectForInstructionScripts(input) {
    return JSON.stringify(input).replace(regexForJSStringsInScripts, function (match) {
      switch (match) {
        case "&":
          return "\\u0026";
        case ">":
          return "\\u003e";
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error(
            "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
          );
      }
    });
  }
  var lateStyleTagResourceOpen1 = stringToPrecomputedChunk(' media="not all" data-precedence="'),
    lateStyleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="'),
    lateStyleTagResourceOpen3 = stringToPrecomputedChunk('">'),
    lateStyleTagTemplateClose = stringToPrecomputedChunk("</style>"),
    currentlyRenderingBoundaryHasStylesToHoist = false,
    destinationHasCapacity = true;
  function flushStyleTagsLateForBoundary(styleQueue) {
    var rules = styleQueue.rules,
      hrefs = styleQueue.hrefs,
      i = 0;
    if (hrefs.length) {
      writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
      writeChunk(this, lateStyleTagResourceOpen1);
      writeChunk(this, styleQueue.precedence);
      for (writeChunk(this, lateStyleTagResourceOpen2); i < hrefs.length - 1; i++)
        (writeChunk(this, hrefs[i]), writeChunk(this, spaceSeparator));
      writeChunk(this, hrefs[i]);
      writeChunk(this, lateStyleTagResourceOpen3);
      for (i = 0; i < rules.length; i++) writeChunk(this, rules[i]);
      destinationHasCapacity = writeChunkAndReturn(this, lateStyleTagTemplateClose);
      currentlyRenderingBoundaryHasStylesToHoist = true;
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function hasStylesToHoist(stylesheet) {
    return 2 !== stylesheet.state ? (currentlyRenderingBoundaryHasStylesToHoist = true) : false;
  }
  function writeHoistablesForBoundary(destination, hoistableState, renderState) {
    currentlyRenderingBoundaryHasStylesToHoist = false;
    destinationHasCapacity = true;
    currentlyFlushingRenderState = renderState;
    hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
    currentlyFlushingRenderState = null;
    hoistableState.stylesheets.forEach(hasStylesToHoist);
    currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
    return destinationHasCapacity;
  }
  function flushResource(resource) {
    for (var i = 0; i < resource.length; i++) writeChunk(this, resource[i]);
    resource.length = 0;
  }
  var stylesheetFlushingQueue = [];
  function flushStyleInPreamble(stylesheet) {
    pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
    for (var i = 0; i < stylesheetFlushingQueue.length; i++)
      writeChunk(this, stylesheetFlushingQueue[i]);
    stylesheetFlushingQueue.length = 0;
    stylesheet.state = 2;
  }
  var styleTagResourceOpen1 = stringToPrecomputedChunk(' data-precedence="'),
    styleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="'),
    spaceSeparator = stringToPrecomputedChunk(" "),
    styleTagResourceOpen3 = stringToPrecomputedChunk('">'),
    styleTagResourceClose = stringToPrecomputedChunk("</style>");
  function flushStylesInPreamble(styleQueue) {
    var hasStylesheets = 0 < styleQueue.sheets.size;
    styleQueue.sheets.forEach(flushStyleInPreamble, this);
    styleQueue.sheets.clear();
    var rules = styleQueue.rules,
      hrefs = styleQueue.hrefs;
    if (!hasStylesheets || hrefs.length) {
      writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
      writeChunk(this, styleTagResourceOpen1);
      writeChunk(this, styleQueue.precedence);
      styleQueue = 0;
      if (hrefs.length) {
        for (writeChunk(this, styleTagResourceOpen2); styleQueue < hrefs.length - 1; styleQueue++)
          (writeChunk(this, hrefs[styleQueue]), writeChunk(this, spaceSeparator));
        writeChunk(this, hrefs[styleQueue]);
      }
      writeChunk(this, styleTagResourceOpen3);
      for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
        writeChunk(this, rules[styleQueue]);
      writeChunk(this, styleTagResourceClose);
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function preloadLateStyle(stylesheet) {
    if (0 === stylesheet.state) {
      stylesheet.state = 1;
      var props = stylesheet.props;
      pushLinkImpl(stylesheetFlushingQueue, {
        rel: "preload",
        as: "style",
        href: stylesheet.props.href,
        crossOrigin: props.crossOrigin,
        fetchPriority: props.fetchPriority,
        integrity: props.integrity,
        media: props.media,
        hrefLang: props.hrefLang,
        referrerPolicy: props.referrerPolicy,
      });
      for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
        writeChunk(this, stylesheetFlushingQueue[stylesheet]);
      stylesheetFlushingQueue.length = 0;
    }
  }
  function preloadLateStyles(styleQueue) {
    styleQueue.sheets.forEach(preloadLateStyle, this);
    styleQueue.sheets.clear();
  }
  stringToPrecomputedChunk('<link rel="expect" href="#');
  stringToPrecomputedChunk('" blocking="render"/>');
  var completedShellIdAttributeStart = stringToPrecomputedChunk(' id="');
  function pushCompletedShellIdAttribute(target, resumableState) {
    0 === (resumableState.instructions & 32) &&
      ((resumableState.instructions |= 32),
      target.push(
        completedShellIdAttributeStart,
        escapeTextForBrowser("_" + resumableState.idPrefix + "R_"),
        attributeEnd,
      ));
  }
  var arrayFirstOpenBracket = stringToPrecomputedChunk("["),
    arraySubsequentOpenBracket = stringToPrecomputedChunk(",["),
    arrayInterstitial = stringToPrecomputedChunk(","),
    arrayCloseBracket = stringToPrecomputedChunk("]");
  function writeStyleResourceDependenciesInJS(destination, hoistableState) {
    writeChunk(destination, arrayFirstOpenBracket);
    var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
    hoistableState.stylesheets.forEach(function (resource) {
      if (2 !== resource.state)
        if (3 === resource.state)
          (writeChunk(destination, nextArrayOpenBrackChunk),
            writeChunk(destination, escapeJSObjectForInstructionScripts("" + resource.props.href)),
            writeChunk(destination, arrayCloseBracket),
            (nextArrayOpenBrackChunk = arraySubsequentOpenBracket));
        else {
          writeChunk(destination, nextArrayOpenBrackChunk);
          var precedence = resource.props["data-precedence"],
            props = resource.props,
            coercedHref = sanitizeURL("" + resource.props.href);
          writeChunk(destination, escapeJSObjectForInstructionScripts(coercedHref));
          precedence = "" + precedence;
          writeChunk(destination, arrayInterstitial);
          writeChunk(destination, escapeJSObjectForInstructionScripts(precedence));
          for (var propKey in props)
            if (
              hasOwnProperty.call(props, propKey) &&
              ((precedence = props[propKey]), null != precedence)
            )
              switch (propKey) {
                case "href":
                case "rel":
                case "precedence":
                case "data-precedence":
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
                  );
                default:
                  writeStyleResourceAttributeInJS(destination, propKey, precedence);
              }
          writeChunk(destination, arrayCloseBracket);
          nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
          resource.state = 3;
        }
    });
    writeChunk(destination, arrayCloseBracket);
  }
  function writeStyleResourceAttributeInJS(destination, name, value) {
    var attributeName = name.toLowerCase();
    switch (typeof value) {
      case "function":
      case "symbol":
        return;
    }
    switch (name) {
      case "innerHTML":
      case "dangerouslySetInnerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "style":
      case "ref":
        return;
      case "className":
        attributeName = "class";
        name = "" + value;
        break;
      case "hidden":
        if (false === value) return;
        name = "";
        break;
      case "src":
      case "href":
        value = sanitizeURL(value);
        name = "" + value;
        break;
      default:
        if (
          (2 < name.length &&
            ("o" === name[0] || "O" === name[0]) &&
            ("n" === name[1] || "N" === name[1])) ||
          !isAttributeNameSafe(name)
        )
          return;
        name = "" + value;
    }
    writeChunk(destination, arrayInterstitial);
    writeChunk(destination, escapeJSObjectForInstructionScripts(attributeName));
    writeChunk(destination, arrayInterstitial);
    writeChunk(destination, escapeJSObjectForInstructionScripts(name));
  }
  function createHoistableState() {
    return {
      styles: /* @__PURE__ */ new Set(),
      stylesheets: /* @__PURE__ */ new Set(),
      suspenseyImages: false,
    };
  }
  function prefetchDNS(href) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if ("string" === typeof href && href) {
        if (!resumableState.dnsResources.hasOwnProperty(href)) {
          resumableState.dnsResources[href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if ((JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity))
            JSCompiler_temp =
              ((header =
                "<" +
                ("" + href).replace(
                  regexForHrefInLinkHeaderURLContext,
                  escapeHrefForLinkHeaderURLContextReplacer,
                ) +
                ">; rel=dns-prefetch"),
              0 <= (resumableState.remainingCapacity -= header.length + 2));
          JSCompiler_temp
            ? ((renderState.resets.dns[href] = null),
              resumableState.preconnects && (resumableState.preconnects += ", "),
              (resumableState.preconnects += header))
            : ((header = []),
              pushLinkImpl(header, { href, rel: "dns-prefetch" }),
              renderState.preconnects.add(header));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.D(href);
  }
  function preconnect(href, crossOrigin) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if ("string" === typeof href && href) {
        var bucket =
          "use-credentials" === crossOrigin
            ? "credentials"
            : "string" === typeof crossOrigin
              ? "anonymous"
              : "default";
        if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
          resumableState.connectResources[bucket][href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if ((JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)) {
            JSCompiler_temp =
              "<" +
              ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer,
              ) +
              ">; rel=preconnect";
            if ("string" === typeof crossOrigin) {
              var escapedCrossOrigin = ("" + crossOrigin).replace(
                regexForLinkHeaderQuotedParamValueContext,
                escapeStringForLinkHeaderQuotedParamValueContextReplacer,
              );
              JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
            }
            JSCompiler_temp =
              ((header = JSCompiler_temp),
              0 <= (resumableState.remainingCapacity -= header.length + 2));
          }
          JSCompiler_temp
            ? ((renderState.resets.connect[bucket][href] = null),
              resumableState.preconnects && (resumableState.preconnects += ", "),
              (resumableState.preconnects += header))
            : ((bucket = []),
              pushLinkImpl(bucket, {
                rel: "preconnect",
                href,
                crossOrigin,
              }),
              renderState.preconnects.add(bucket));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.C(href, crossOrigin);
  }
  function preload(href, as, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (as && href) {
        switch (as) {
          case "image":
            if (options) {
              var imageSrcSet = options.imageSrcSet;
              var imageSizes = options.imageSizes;
              var fetchPriority = options.fetchPriority;
            }
            var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
            if (resumableState.imageResources.hasOwnProperty(key)) return;
            resumableState.imageResources[key] = PRELOAD_NO_CREDS;
            resumableState = renderState.headers;
            var header;
            resumableState &&
            0 < resumableState.remainingCapacity &&
            "string" !== typeof imageSrcSet &&
            "high" === fetchPriority &&
            ((header = getPreloadAsHeader(href, as, options)),
            0 <= (resumableState.remainingCapacity -= header.length + 2))
              ? ((renderState.resets.image[key] = PRELOAD_NO_CREDS),
                resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "),
                (resumableState.highImagePreloads += header))
              : ((resumableState = []),
                pushLinkImpl(
                  resumableState,
                  assign({ rel: "preload", href: imageSrcSet ? void 0 : href, as }, options),
                ),
                "high" === fetchPriority
                  ? renderState.highImagePreloads.add(resumableState)
                  : (renderState.bulkPreloads.add(resumableState),
                    renderState.preloads.images.set(key, resumableState)));
            break;
          case "style":
            if (resumableState.styleResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            pushLinkImpl(imageSrcSet, assign({ rel: "preload", href, as }, options));
            resumableState.styleResources[href] =
              !options ||
              ("string" !== typeof options.crossOrigin && "string" !== typeof options.integrity)
                ? PRELOAD_NO_CREDS
                : [options.crossOrigin, options.integrity];
            renderState.preloads.stylesheets.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            break;
          case "script":
            if (resumableState.scriptResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            renderState.preloads.scripts.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            pushLinkImpl(imageSrcSet, assign({ rel: "preload", href, as }, options));
            resumableState.scriptResources[href] =
              !options ||
              ("string" !== typeof options.crossOrigin && "string" !== typeof options.integrity)
                ? PRELOAD_NO_CREDS
                : [options.crossOrigin, options.integrity];
            break;
          default:
            if (resumableState.unknownResources.hasOwnProperty(as)) {
              if (
                ((imageSrcSet = resumableState.unknownResources[as]),
                imageSrcSet.hasOwnProperty(href))
              )
                return;
            } else ((imageSrcSet = {}), (resumableState.unknownResources[as] = imageSrcSet));
            imageSrcSet[href] = PRELOAD_NO_CREDS;
            if (
              (resumableState = renderState.headers) &&
              0 < resumableState.remainingCapacity &&
              "font" === as &&
              ((key = getPreloadAsHeader(href, as, options)),
              0 <= (resumableState.remainingCapacity -= key.length + 2))
            )
              ((renderState.resets.font[href] = PRELOAD_NO_CREDS),
                resumableState.fontPreloads && (resumableState.fontPreloads += ", "),
                (resumableState.fontPreloads += key));
            else
              switch (
                ((resumableState = []),
                (href = assign({ rel: "preload", href, as }, options)),
                pushLinkImpl(resumableState, href),
                as)
              ) {
                case "font":
                  renderState.fontPreloads.add(resumableState);
                  break;
                default:
                  renderState.bulkPreloads.add(resumableState);
              }
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.L(href, as, options);
  }
  function preloadModule(href, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (href) {
        var as = options && "string" === typeof options.as ? options.as : "script";
        switch (as) {
          case "script":
            if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
            as = [];
            resumableState.moduleScriptResources[href] =
              !options ||
              ("string" !== typeof options.crossOrigin && "string" !== typeof options.integrity)
                ? PRELOAD_NO_CREDS
                : [options.crossOrigin, options.integrity];
            renderState.preloads.moduleScripts.set(href, as);
            break;
          default:
            if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
              var resources = resumableState.unknownResources[as];
              if (resources.hasOwnProperty(href)) return;
            } else ((resources = {}), (resumableState.moduleUnknownResources[as] = resources));
            as = [];
            resources[href] = PRELOAD_NO_CREDS;
        }
        pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
        renderState.bulkPreloads.add(as);
        enqueueFlush(request);
      }
    } else previousDispatcher.m(href, options);
  }
  function preinitStyle(href, precedence, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (href) {
        precedence = precedence || "default";
        var styleQueue = renderState.styles.get(precedence),
          resourceState = resumableState.styleResources.hasOwnProperty(href)
            ? resumableState.styleResources[href]
            : void 0;
        null !== resourceState &&
          ((resumableState.styleResources[href] = null),
          styleQueue ||
            ((styleQueue = {
              precedence: escapeTextForBrowser(precedence),
              rules: [],
              hrefs: [],
              sheets: /* @__PURE__ */ new Map(),
            }),
            renderState.styles.set(precedence, styleQueue)),
          (precedence = {
            state: 0,
            props: assign({ rel: "stylesheet", href, "data-precedence": precedence }, options),
          }),
          resourceState &&
            (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState),
            (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length
              ? (renderState.length = 0)
              : (precedence.state = 1)),
          styleQueue.sheets.set(href, precedence),
          enqueueFlush(request));
      }
    } else previousDispatcher.S(href, precedence, options);
  }
  function preinitScript(src, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.scriptResources.hasOwnProperty(src)
          ? resumableState.scriptResources[src]
          : void 0;
        null !== resourceState &&
          ((resumableState.scriptResources[src] = null),
          (options = assign({ src, async: true }, options)),
          resourceState &&
            (2 === resourceState.length && adoptPreloadCredentials(options, resourceState),
            (src = renderState.preloads.scripts.get(src))) &&
            (src.length = 0),
          (src = []),
          renderState.scripts.add(src),
          pushScriptImpl(src, options),
          enqueueFlush(request));
      }
    } else previousDispatcher.X(src, options);
  }
  function preinitModuleScript(src, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState,
        renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.moduleScriptResources.hasOwnProperty(src)
          ? resumableState.moduleScriptResources[src]
          : void 0;
        null !== resourceState &&
          ((resumableState.moduleScriptResources[src] = null),
          (options = assign({ src, type: "module", async: true }, options)),
          resourceState &&
            (2 === resourceState.length && adoptPreloadCredentials(options, resourceState),
            (src = renderState.preloads.moduleScripts.get(src))) &&
            (src.length = 0),
          (src = []),
          renderState.scripts.add(src),
          pushScriptImpl(src, options),
          enqueueFlush(request));
      }
    } else previousDispatcher.M(src, options);
  }
  function adoptPreloadCredentials(target, preloadState) {
    null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
    null == target.integrity && (target.integrity = preloadState[1]);
  }
  function getPreloadAsHeader(href, as, params) {
    href = ("" + href).replace(
      regexForHrefInLinkHeaderURLContext,
      escapeHrefForLinkHeaderURLContextReplacer,
    );
    as = ("" + as).replace(
      regexForLinkHeaderQuotedParamValueContext,
      escapeStringForLinkHeaderQuotedParamValueContextReplacer,
    );
    as = "<" + href + '>; rel=preload; as="' + as + '"';
    for (var paramName in params)
      hasOwnProperty.call(params, paramName) &&
        ((href = params[paramName]),
        "string" === typeof href &&
          (as +=
            "; " +
            paramName.toLowerCase() +
            '="' +
            ("" + href).replace(
              regexForLinkHeaderQuotedParamValueContext,
              escapeStringForLinkHeaderQuotedParamValueContextReplacer,
            ) +
            '"'));
    return as;
  }
  var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
  function escapeHrefForLinkHeaderURLContextReplacer(match) {
    switch (match) {
      case "<":
        return "%3C";
      case ">":
        return "%3E";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
        );
    }
  }
  var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
  function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
    switch (match) {
      case '"':
        return "%22";
      case "'":
        return "%27";
      case ";":
        return "%3B";
      case ",":
        return "%2C";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React",
        );
    }
  }
  function hoistStyleQueueDependency(styleQueue) {
    this.styles.add(styleQueue);
  }
  function hoistStylesheetDependency(stylesheet) {
    this.stylesheets.add(stylesheet);
  }
  function hoistHoistables(parentState, childState) {
    childState.styles.forEach(hoistStyleQueueDependency, parentState);
    childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
    childState.suspenseyImages && (parentState.suspenseyImages = true);
  }
  function hasSuspenseyContent(hoistableState) {
    return 0 < hoistableState.stylesheets.size || hoistableState.suspenseyImages;
  }
  var bind = Function.prototype.bind,
    requestStorage = new async_hooks.AsyncLocalStorage(),
    REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE
        ? null
        : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type ||
            ((type = innerType.displayName || innerType.name || ""),
            (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
          return type;
        case REACT_MEMO_TYPE:
          return (
            (innerType = type.displayName || null),
            null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo"
          );
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x2) {}
      }
    return null;
  }
  var emptyContextObject = {},
    currentActiveSnapshot = null;
  function popToNearestCommonAncestor(prev, next) {
    if (prev !== next) {
      prev.context._currentValue = prev.parentValue;
      prev = prev.parent;
      var parentNext = next.parent;
      if (null === prev) {
        if (null !== parentNext)
          throw Error("The stacks must reach the root at the same time. This is a bug in React.");
      } else {
        if (null === parentNext)
          throw Error("The stacks must reach the root at the same time. This is a bug in React.");
        popToNearestCommonAncestor(prev, parentNext);
      }
      next.context._currentValue = next.value;
    }
  }
  function popAllPrevious(prev) {
    prev.context._currentValue = prev.parentValue;
    prev = prev.parent;
    null !== prev && popAllPrevious(prev);
  }
  function pushAllNext(next) {
    var parentNext = next.parent;
    null !== parentNext && pushAllNext(parentNext);
    next.context._currentValue = next.value;
  }
  function popPreviousToCommonLevel(prev, next) {
    prev.context._currentValue = prev.parentValue;
    prev = prev.parent;
    if (null === prev)
      throw Error(
        "The depth must equal at least at zero before reaching the root. This is a bug in React.",
      );
    prev.depth === next.depth
      ? popToNearestCommonAncestor(prev, next)
      : popPreviousToCommonLevel(prev, next);
  }
  function popNextToCommonLevel(prev, next) {
    var parentNext = next.parent;
    if (null === parentNext)
      throw Error(
        "The depth must equal at least at zero before reaching the root. This is a bug in React.",
      );
    prev.depth === parentNext.depth
      ? popToNearestCommonAncestor(prev, parentNext)
      : popNextToCommonLevel(prev, parentNext);
    next.context._currentValue = next.value;
  }
  function switchContext(newSnapshot) {
    var prev = currentActiveSnapshot;
    prev !== newSnapshot &&
      (null === prev
        ? pushAllNext(newSnapshot)
        : null === newSnapshot
          ? popAllPrevious(prev)
          : prev.depth === newSnapshot.depth
            ? popToNearestCommonAncestor(prev, newSnapshot)
            : prev.depth > newSnapshot.depth
              ? popPreviousToCommonLevel(prev, newSnapshot)
              : popNextToCommonLevel(prev, newSnapshot),
      (currentActiveSnapshot = newSnapshot));
  }
  var classComponentUpdater = {
      enqueueSetState: function (inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function (inst, payload) {
        inst = inst._reactInternals;
        inst.replace = true;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function () {},
    },
    emptyTreeContext = { id: 1, overflow: "" };
  function pushTreeContext(baseContext, totalChildren, index) {
    var baseIdWithLeadingBit = baseContext.id;
    baseContext = baseContext.overflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - (baseLength % 5);
      length = (baseIdWithLeadingBit & ((1 << numberOfOverflowBits) - 1)).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      return {
        id:
          (1 << (32 - clz32(totalChildren) + baseLength)) |
          (index << baseLength) |
          baseIdWithLeadingBit,
        overflow: length + baseContext,
      };
    }
    return {
      id: (1 << length) | (index << baseLength) | baseIdWithLeadingBit,
      overflow: baseContext,
    };
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
    log = Math.log,
    LN2 = Math.LN2;
  function clz32Fallback(x2) {
    x2 >>>= 0;
    return 0 === x2 ? 32 : (31 - ((log(x2) / LN2) | 0)) | 0;
  }
  function noop() {}
  var SuspenseException = Error(
    "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`.",
  );
  function trackUsedThenable(thenableState2, thenable, index) {
    index = thenableState2[index];
    void 0 === index
      ? thenableState2.push(thenable)
      : index !== thenable && (thenable.then(noop, noop), (thenable = index));
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        "string" === typeof thenable.status
          ? thenable.then(noop, noop)
          : ((thenableState2 = thenable),
            (thenableState2.status = "pending"),
            thenableState2.then(
              function (fulfilledValue) {
                if ("pending" === thenable.status) {
                  var fulfilledThenable = thenable;
                  fulfilledThenable.status = "fulfilled";
                  fulfilledThenable.value = fulfilledValue;
                }
              },
              function (error) {
                if ("pending" === thenable.status) {
                  var rejectedThenable = thenable;
                  rejectedThenable.status = "rejected";
                  rejectedThenable.reason = error;
                }
              },
            ));
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable)
      throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function is(x2, y2) {
    return (x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2)) || (x2 !== x2 && y2 !== y2);
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is,
    currentlyRenderingComponent = null,
    currentlyRenderingTask = null,
    currentlyRenderingRequest = null,
    currentlyRenderingKeyPath = null,
    firstWorkInProgressHook = null,
    workInProgressHook = null,
    isReRender = false,
    didScheduleRenderPhaseUpdate = false,
    localIdCounter = 0,
    actionStateCounter = 0,
    actionStateMatchingIndex = -1,
    thenableIndexCounter = 0,
    thenableState = null,
    renderPhaseUpdates = null,
    numberOfReRenders = 0;
  function resolveCurrentlyRenderingComponent() {
    if (null === currentlyRenderingComponent)
      throw Error(
        "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.",
      );
    return currentlyRenderingComponent;
  }
  function createHook() {
    if (0 < numberOfReRenders) throw Error("Rendered more hooks than during the previous render");
    return { memoizedState: null, queue: null, next: null };
  }
  function createWorkInProgressHook() {
    null === workInProgressHook
      ? null === firstWorkInProgressHook
        ? ((isReRender = false), (firstWorkInProgressHook = workInProgressHook = createHook()))
        : ((isReRender = true), (workInProgressHook = firstWorkInProgressHook))
      : null === workInProgressHook.next
        ? ((isReRender = false), (workInProgressHook = workInProgressHook.next = createHook()))
        : ((isReRender = true), (workInProgressHook = workInProgressHook.next));
    return workInProgressHook;
  }
  function getThenableStateAfterSuspending() {
    var state = thenableState;
    thenableState = null;
    return state;
  }
  function resetHooksState() {
    currentlyRenderingKeyPath =
      currentlyRenderingRequest =
      currentlyRenderingTask =
      currentlyRenderingComponent =
        null;
    didScheduleRenderPhaseUpdate = false;
    firstWorkInProgressHook = null;
    numberOfReRenders = 0;
    workInProgressHook = renderPhaseUpdates = null;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function useReducer(reducer, initialArg, init) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    if (isReRender) {
      var queue = workInProgressHook.queue;
      initialArg = queue.dispatch;
      if (
        null !== renderPhaseUpdates &&
        ((init = renderPhaseUpdates.get(queue)), void 0 !== init)
      ) {
        renderPhaseUpdates.delete(queue);
        queue = workInProgressHook.memoizedState;
        do ((queue = reducer(queue, init.action)), (init = init.next));
        while (null !== init);
        workInProgressHook.memoizedState = queue;
        return [queue, initialArg];
      }
      return [workInProgressHook.memoizedState, initialArg];
    }
    reducer =
      reducer === basicStateReducer
        ? "function" === typeof initialArg
          ? initialArg()
          : initialArg
        : void 0 !== init
          ? init(initialArg)
          : initialArg;
    workInProgressHook.memoizedState = reducer;
    reducer = workInProgressHook.queue = { last: null, dispatch: null };
    reducer = reducer.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, reducer);
    return [workInProgressHook.memoizedState, reducer];
  }
  function useMemo(nextCreate, deps) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    if (null !== workInProgressHook) {
      var prevState = workInProgressHook.memoizedState;
      if (null !== prevState && null !== deps) {
        var prevDeps = prevState[1];
        a: if (null === prevDeps) prevDeps = false;
        else {
          for (var i = 0; i < prevDeps.length && i < deps.length; i++)
            if (!objectIs(deps[i], prevDeps[i])) {
              prevDeps = false;
              break a;
            }
          prevDeps = true;
        }
        if (prevDeps) return prevState[0];
      }
    }
    nextCreate = nextCreate();
    workInProgressHook.memoizedState = [nextCreate, deps];
    return nextCreate;
  }
  function dispatchAction(componentIdentity, queue, action) {
    if (25 <= numberOfReRenders)
      throw Error(
        "Too many re-renders. React limits the number of renders to prevent an infinite loop.",
      );
    if (componentIdentity === currentlyRenderingComponent)
      if (
        ((didScheduleRenderPhaseUpdate = true),
        (componentIdentity = { action, next: null }),
        null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()),
        (action = renderPhaseUpdates.get(queue)),
        void 0 === action)
      )
        renderPhaseUpdates.set(queue, componentIdentity);
      else {
        for (queue = action; null !== queue.next; ) queue = queue.next;
        queue.next = componentIdentity;
      }
  }
  function throwOnUseEffectEventCall() {
    throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
  }
  function unsupportedStartTransition() {
    throw Error("startTransition cannot be called during server rendering.");
  }
  function unsupportedSetOptimisticState() {
    throw Error("Cannot update optimistic state while rendering.");
  }
  function createPostbackActionStateKey(permalink, componentKeyPath, hookIndex) {
    if (void 0 !== permalink) return "p" + permalink;
    permalink = JSON.stringify([componentKeyPath, null, hookIndex]);
    componentKeyPath = crypto2.createHash("md5");
    componentKeyPath.update(permalink);
    return "k" + componentKeyPath.digest("hex");
  }
  function useActionState(action, initialState, permalink) {
    resolveCurrentlyRenderingComponent();
    var actionStateHookIndex = actionStateCounter++,
      request = currentlyRenderingRequest;
    if ("function" === typeof action.$$FORM_ACTION) {
      var nextPostbackStateKey = null,
        componentKeyPath = currentlyRenderingKeyPath;
      request = request.formState;
      var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
      if (null !== request && "function" === typeof isSignatureEqual) {
        var postbackKey = request[1];
        isSignatureEqual.call(action, request[2], request[3]) &&
          ((nextPostbackStateKey = createPostbackActionStateKey(
            permalink,
            componentKeyPath,
            actionStateHookIndex,
          )),
          postbackKey === nextPostbackStateKey &&
            ((actionStateMatchingIndex = actionStateHookIndex), (initialState = request[0])));
      }
      var boundAction = action.bind(null, initialState);
      action = function (payload) {
        boundAction(payload);
      };
      "function" === typeof boundAction.$$FORM_ACTION &&
        (action.$$FORM_ACTION = function (prefix3) {
          prefix3 = boundAction.$$FORM_ACTION(prefix3);
          void 0 !== permalink && ((permalink += ""), (prefix3.action = permalink));
          var formData = prefix3.data;
          formData &&
            (null === nextPostbackStateKey &&
              (nextPostbackStateKey = createPostbackActionStateKey(
                permalink,
                componentKeyPath,
                actionStateHookIndex,
              )),
            formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix3;
        });
      return [initialState, action, false];
    }
    var boundAction$22 = action.bind(null, initialState);
    return [
      initialState,
      function (payload) {
        boundAction$22(payload);
      },
      false,
    ];
  }
  function unwrapThenable(thenable) {
    var index = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    return trackUsedThenable(thenableState, thenable, index);
  }
  function unsupportedRefresh() {
    throw Error("Cache cannot be refreshed during server rendering.");
  }
  var HooksDispatcher = {
      readContext: function (context) {
        return context._currentValue;
      },
      use: function (usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue;
        }
        throw Error("An unsupported type was passed to use(): " + String(usable));
      },
      useContext: function (context) {
        resolveCurrentlyRenderingComponent();
        return context._currentValue;
      },
      useMemo,
      useReducer,
      useRef: function (initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        return null === previousRef
          ? ((initialValue = { current: initialValue }),
            (workInProgressHook.memoizedState = initialValue))
          : previousRef;
      },
      useState: function (initialState) {
        return useReducer(basicStateReducer, initialState);
      },
      useInsertionEffect: noop,
      useLayoutEffect: noop,
      useCallback: function (callback, deps) {
        return useMemo(function () {
          return callback;
        }, deps);
      },
      useImperativeHandle: noop,
      useEffect: noop,
      useDebugValue: noop,
      useDeferredValue: function (value, initialValue) {
        resolveCurrentlyRenderingComponent();
        return void 0 !== initialValue ? initialValue : value;
      },
      useTransition: function () {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      },
      useId: function () {
        var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
        var overflow = JSCompiler_inline_result.overflow;
        JSCompiler_inline_result = JSCompiler_inline_result.id;
        JSCompiler_inline_result =
          (JSCompiler_inline_result & ~(1 << (32 - clz32(JSCompiler_inline_result) - 1))).toString(
            32,
          ) + overflow;
        var resumableState = currentResumableState;
        if (null === resumableState)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component.",
          );
        overflow = localIdCounter++;
        JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
        0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
        return JSCompiler_inline_result + "_";
      },
      useSyncExternalStore: function (subscribe2, getSnapshot, getServerSnapshot) {
        if (void 0 === getServerSnapshot)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.",
          );
        return getServerSnapshot();
      },
      useOptimistic: function (passthrough) {
        resolveCurrentlyRenderingComponent();
        return [passthrough, unsupportedSetOptimisticState];
      },
      useActionState,
      useFormState: useActionState,
      useHostTransitionStatus: function () {
        resolveCurrentlyRenderingComponent();
        return sharedNotPendingObject;
      },
      useMemoCache: function (size) {
        for (var data = Array(size), i = 0; i < size; i++) data[i] = REACT_MEMO_CACHE_SENTINEL;
        return data;
      },
      useCacheRefresh: function () {
        return unsupportedRefresh;
      },
      useEffectEvent: function () {
        return throwOnUseEffectEventCall;
      },
    },
    currentResumableState = null,
    DefaultAsyncDispatcher = {
      getCacheForType: function () {
        throw Error("Not implemented.");
      },
      cacheSignal: function () {
        throw Error("Not implemented.");
      },
    };
  function prepareStackTrace(error, structuredStackTrace) {
    error = (error.name || "Error") + ": " + (error.message || "");
    for (var i = 0; i < structuredStackTrace.length; i++)
      error += "\n    at " + structuredStackTrace[i].toString();
    return error;
  }
  var prefix2, suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix2)
      try {
        throw Error();
      } catch (x2) {
        var match = x2.stack.trim().match(/\n( *(at )?)/);
        prefix2 = (match && match[1]) || "";
        suffix =
          -1 < x2.stack.indexOf("\n    at")
            ? " (<anonymous>)"
            : -1 < x2.stack.indexOf("@")
              ? "@unknown:0:0"
              : "";
      }
    return "\n" + prefix2 + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn2, construct) {
    if (!fn2 || reentry) return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = prepareStackTrace;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function () {
          try {
            if (construct) {
              var Fake = function () {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function () {
                  throw Error();
                },
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x2) {
                  var control = x2;
                }
                Reflect.construct(fn2, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$24) {
                  control = x$24;
                }
                fn2.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$25) {
                control = x$25;
              }
              (Fake = fn2()) && "function" === typeof Fake.catch && Fake.catch(function () {});
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        },
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name",
      );
      namePropDescriptor &&
        namePropDescriptor.configurable &&
        Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
        sampleStack = _RunInRootFrame$Deter[0],
        controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"),
          controlLines = controlStack.split("\n");
        for (
          namePropDescriptor = RunInRootFrame = 0;
          RunInRootFrame < sampleLines.length &&
          !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");
        )
          RunInRootFrame++;
        for (
          ;
          namePropDescriptor < controlLines.length &&
          !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");
        )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (
            RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1;
            1 <= RunInRootFrame &&
            0 <= namePropDescriptor &&
            sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];
          )
            namePropDescriptor--;
        for (
          ;
          1 <= RunInRootFrame && 0 <= namePropDescriptor;
          RunInRootFrame--, namePropDescriptor--
        )
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (
                  (RunInRootFrame--,
                  namePropDescriptor--,
                  0 > namePropDescriptor ||
                    sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor])
                ) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn2.displayName &&
                    frame.includes("<anonymous>") &&
                    (frame = frame.replace("<anonymous>", fn2.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      ((reentry = false), (Error.prepareStackTrace = previousPrepareStackTrace));
    }
    return (previousPrepareStackTrace = fn2 ? fn2.displayName || fn2.name : "")
      ? describeBuiltInComponentFrame(previousPrepareStackTrace)
      : "";
  }
  function describeComponentStackByType(type) {
    if ("string" === typeof type) return describeBuiltInComponentFrame(type);
    if ("function" === typeof type)
      return type.prototype && type.prototype.isReactComponent
        ? describeNativeComponentFrame(type, true)
        : describeNativeComponentFrame(type, false);
    if ("object" === typeof type && null !== type) {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeNativeComponentFrame(type.render, false);
        case REACT_MEMO_TYPE:
          return describeNativeComponentFrame(type.type, false);
        case REACT_LAZY_TYPE:
          var lazyComponent = type,
            payload = lazyComponent._payload;
          lazyComponent = lazyComponent._init;
          try {
            type = lazyComponent(payload);
          } catch (x2) {
            return describeBuiltInComponentFrame("Lazy");
          }
          return describeComponentStackByType(type);
      }
      if ("string" === typeof type.name) {
        a: {
          payload = type.name;
          lazyComponent = type.env;
          var location = type.debugLocation;
          if (
            null != location &&
            ((type = Error.prepareStackTrace),
            (Error.prepareStackTrace = prepareStackTrace),
            (location = location.stack),
            (Error.prepareStackTrace = type),
            location.startsWith("Error: react-stack-top-frame\n") &&
              (location = location.slice(29)),
            (type = location.indexOf("\n")),
            -1 !== type && (location = location.slice(type + 1)),
            (type = location.indexOf("react_stack_bottom_frame")),
            -1 !== type && (type = location.lastIndexOf("\n", type)),
            (type = -1 !== type ? (location = location.slice(0, type)) : ""),
            (location = type.lastIndexOf("\n")),
            (type = -1 === location ? type : type.slice(location + 1)),
            -1 !== type.indexOf(payload))
          ) {
            payload = "\n" + type;
            break a;
          }
          payload = describeBuiltInComponentFrame(
            payload + (lazyComponent ? " [" + lazyComponent + "]" : ""),
          );
        }
        return payload;
      }
    }
    switch (type) {
      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame("SuspenseList");
      case REACT_SUSPENSE_TYPE:
        return describeBuiltInComponentFrame("Suspense");
    }
    return "";
  }
  function isEligibleForOutlining(request, boundary) {
    return (
      (500 < boundary.byteSize || hasSuspenseyContent(boundary.contentState)) &&
      null === boundary.contentPreamble
    );
  }
  function defaultErrorHandler(error) {
    if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
      var JSCompiler_inline_result = error.environmentName;
      error = [error].slice(0);
      "string" === typeof error[0]
        ? error.splice(
            0,
            1,
            "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + error[0],
            "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
            " " + JSCompiler_inline_result + " ",
            "",
          )
        : error.splice(
            0,
            0,
            "\x1B[0m\x1B[7m%c%s\x1B[0m%c",
            "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
            " " + JSCompiler_inline_result + " ",
            "",
          );
      error.unshift(console);
      JSCompiler_inline_result = bind.apply(console.error, error);
      JSCompiler_inline_result();
    } else console.error(error);
    return null;
  }
  function RequestInstance(
    resumableState,
    renderState,
    rootFormatContext,
    progressiveChunkSize,
    onError,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
    formState,
  ) {
    var abortSet = /* @__PURE__ */ new Set();
    this.destination = null;
    this.flushScheduled = false;
    this.resumableState = resumableState;
    this.renderState = renderState;
    this.rootFormatContext = rootFormatContext;
    this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
    this.status = 10;
    this.fatalError = null;
    this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
    this.completedPreambleSegments = this.completedRootSegment = null;
    this.byteSize = 0;
    this.abortableTasks = abortSet;
    this.pingedTasks = [];
    this.clientRenderedBoundaries = [];
    this.completedBoundaries = [];
    this.partialBoundaries = [];
    this.trackedPostpones = null;
    this.onError = void 0 === onError ? defaultErrorHandler : onError;
    this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
    this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
    this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
    this.onShellError = void 0 === onShellError ? noop : onShellError;
    this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
    this.formState = void 0 === formState ? null : formState;
  }
  function createRequest(
    children,
    resumableState,
    renderState,
    rootFormatContext,
    progressiveChunkSize,
    onError,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
    formState,
  ) {
    resumableState = new RequestInstance(
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      formState,
    );
    renderState = createPendingSegment(resumableState, 0, null, rootFormatContext, false, false);
    renderState.parentFlushed = true;
    children = createRenderTask(
      resumableState,
      null,
      children,
      -1,
      null,
      renderState,
      null,
      null,
      resumableState.abortableTasks,
      null,
      rootFormatContext,
      null,
      emptyTreeContext,
      null,
      null,
    );
    pushComponentStack(children);
    resumableState.pingedTasks.push(children);
    return resumableState;
  }
  function createPrerenderRequest(
    children,
    resumableState,
    renderState,
    rootFormatContext,
    progressiveChunkSize,
    onError,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
  ) {
    children = createRequest(
      children,
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      void 0,
    );
    children.trackedPostpones = {
      workingMap: /* @__PURE__ */ new Map(),
      rootNodes: [],
      rootSlots: null,
    };
    return children;
  }
  function resumeRequest(
    children,
    postponedState,
    renderState,
    onError,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
  ) {
    renderState = new RequestInstance(
      postponedState.resumableState,
      renderState,
      postponedState.rootFormatContext,
      postponedState.progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      null,
    );
    renderState.nextSegmentId = postponedState.nextSegmentId;
    if ("number" === typeof postponedState.replaySlots)
      return (
        (onError = createPendingSegment(
          renderState,
          0,
          null,
          postponedState.rootFormatContext,
          false,
          false,
        )),
        (onError.parentFlushed = true),
        (children = createRenderTask(
          renderState,
          null,
          children,
          -1,
          null,
          onError,
          null,
          null,
          renderState.abortableTasks,
          null,
          postponedState.rootFormatContext,
          null,
          emptyTreeContext,
          null,
          null,
        )),
        pushComponentStack(children),
        renderState.pingedTasks.push(children),
        renderState
      );
    children = createReplayTask(
      renderState,
      null,
      {
        nodes: postponedState.replayNodes,
        slots: postponedState.replaySlots,
        pendingTasks: 0,
      },
      children,
      -1,
      null,
      null,
      renderState.abortableTasks,
      null,
      postponedState.rootFormatContext,
      null,
      emptyTreeContext,
      null,
      null,
    );
    pushComponentStack(children);
    renderState.pingedTasks.push(children);
    return renderState;
  }
  function resumeAndPrerenderRequest(
    children,
    postponedState,
    renderState,
    onError,
    onAllReady,
    onShellReady,
    onShellError,
    onFatalError,
    onPostpone,
  ) {
    children = resumeRequest(
      children,
      postponedState,
      renderState,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
    );
    children.trackedPostpones = {
      workingMap: /* @__PURE__ */ new Map(),
      rootNodes: [],
      rootSlots: null,
    };
    return children;
  }
  var currentRequest = null;
  function resolveRequest() {
    if (currentRequest) return currentRequest;
    var store = requestStorage.getStore();
    return store ? store : null;
  }
  function pingTask(request, task) {
    request.pingedTasks.push(task);
    1 === request.pingedTasks.length &&
      ((request.flushScheduled = null !== request.destination),
      null !== request.trackedPostpones || 10 === request.status
        ? scheduleMicrotask(function () {
            return performWork(request);
          })
        : setImmediate(function () {
            return performWork(request);
          }));
  }
  function createSuspenseBoundary(
    request,
    row,
    fallbackAbortableTasks,
    contentPreamble,
    fallbackPreamble,
  ) {
    fallbackAbortableTasks = {
      status: 0,
      rootSegmentID: -1,
      parentFlushed: false,
      pendingTasks: 0,
      row,
      completedSegments: [],
      byteSize: 0,
      fallbackAbortableTasks,
      errorDigest: null,
      contentState: createHoistableState(),
      fallbackState: createHoistableState(),
      contentPreamble,
      fallbackPreamble,
      trackedContentKeyPath: null,
      trackedFallbackNode: null,
    };
    null !== row &&
      (row.pendingTasks++,
      (contentPreamble = row.boundaries),
      null !== contentPreamble &&
        (request.allPendingTasks++,
        fallbackAbortableTasks.pendingTasks++,
        contentPreamble.push(fallbackAbortableTasks)),
      (request = row.inheritedHoistables),
      null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
    return fallbackAbortableTasks;
  }
  function createRenderTask(
    request,
    thenableState2,
    node,
    childIndex,
    blockedBoundary,
    blockedSegment,
    blockedPreamble,
    hoistableState,
    abortSet,
    keyPath,
    formatContext,
    context,
    treeContext,
    row,
    componentStack,
  ) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    var task = {
      replay: null,
      node,
      childIndex,
      ping: function () {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment,
      blockedPreamble,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2,
    };
    abortSet.add(task);
    return task;
  }
  function createReplayTask(
    request,
    thenableState2,
    replay,
    node,
    childIndex,
    blockedBoundary,
    hoistableState,
    abortSet,
    keyPath,
    formatContext,
    context,
    treeContext,
    row,
    componentStack,
  ) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    replay.pendingTasks++;
    var task = {
      replay,
      node,
      childIndex,
      ping: function () {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment: null,
      blockedPreamble: null,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2,
    };
    abortSet.add(task);
    return task;
  }
  function createPendingSegment(
    request,
    index,
    boundary,
    parentFormatContext,
    lastPushedText,
    textEmbedded,
  ) {
    return {
      status: 0,
      parentFlushed: false,
      id: -1,
      index,
      chunks: [],
      children: [],
      preambleChildren: [],
      parentFormatContext,
      boundary,
      lastPushedText,
      textEmbedded,
    };
  }
  function pushComponentStack(task) {
    var node = task.node;
    if ("object" === typeof node && null !== node)
      switch (node.$$typeof) {
        case REACT_ELEMENT_TYPE:
          task.componentStack = { parent: task.componentStack, type: node.type };
      }
  }
  function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
    return null === componentStack
      ? null
      : { parent: componentStack.parent, type: "Suspense Fallback" };
  }
  function getThrownInfo(node$jscomp$0) {
    var errorInfo = {};
    node$jscomp$0 &&
      Object.defineProperty(errorInfo, "componentStack", {
        configurable: true,
        enumerable: true,
        get: function () {
          try {
            var info = "",
              node = node$jscomp$0;
            do ((info += describeComponentStackByType(node.type)), (node = node.parent));
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x2) {
            JSCompiler_inline_result = "\nError generating stack: " + x2.message + "\n" + x2.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result,
          });
          return JSCompiler_inline_result;
        },
      });
    return errorInfo;
  }
  function logRecoverableError(request, error, errorInfo) {
    request = request.onError;
    error = request(error, errorInfo);
    if (null == error || "string" === typeof error) return error;
  }
  function fatalError(request, error) {
    var onShellError = request.onShellError,
      onFatalError = request.onFatalError;
    onShellError(error);
    onFatalError(error);
    null !== request.destination
      ? ((request.status = 14), request.destination.destroy(error))
      : ((request.status = 13), (request.fatalError = error));
  }
  function finishSuspenseListRow(request, row) {
    unblockSuspenseListRow(request, row.next, row.hoistables);
  }
  function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
    for (; null !== unblockedRow; ) {
      null !== inheritedHoistables &&
        (hoistHoistables(unblockedRow.hoistables, inheritedHoistables),
        (unblockedRow.inheritedHoistables = inheritedHoistables));
      var unblockedBoundaries = unblockedRow.boundaries;
      if (null !== unblockedBoundaries) {
        unblockedRow.boundaries = null;
        for (var i = 0; i < unblockedBoundaries.length; i++) {
          var unblockedBoundary = unblockedBoundaries[i];
          null !== inheritedHoistables &&
            hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
          finishedTask(request, unblockedBoundary, null, null);
        }
      }
      unblockedRow.pendingTasks--;
      if (0 < unblockedRow.pendingTasks) break;
      inheritedHoistables = unblockedRow.hoistables;
      unblockedRow = unblockedRow.next;
    }
  }
  function tryToResolveTogetherRow(request, togetherRow) {
    var boundaries = togetherRow.boundaries;
    if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
      for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
        var rowBoundary = boundaries[i];
        if (
          1 !== rowBoundary.pendingTasks ||
          rowBoundary.parentFlushed ||
          isEligibleForOutlining(request, rowBoundary)
        ) {
          allCompleteAndInlinable = false;
          break;
        }
      }
      allCompleteAndInlinable &&
        unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
    }
  }
  function createSuspenseListRow(previousRow) {
    var newRow = {
      pendingTasks: 1,
      boundaries: null,
      hoistables: createHoistableState(),
      inheritedHoistables: null,
      together: false,
      next: null,
    };
    null !== previousRow &&
      0 < previousRow.pendingTasks &&
      (newRow.pendingTasks++, (newRow.boundaries = []), (previousRow.next = newRow));
    return newRow;
  }
  function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
    var prevKeyPath = task.keyPath,
      prevTreeContext = task.treeContext,
      prevRow = task.row;
    task.keyPath = keyPath;
    keyPath = rows.length;
    var previousSuspenseListRow = null;
    if (null !== task.replay) {
      var resumeSlots = task.replay.slots;
      if (null !== resumeSlots && "object" === typeof resumeSlots)
        for (var n = 0; n < keyPath; n++) {
          var i =
              "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder
                ? n
                : keyPath - 1 - n,
            node = rows[i];
          task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
          task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
          var resumeSegmentID = resumeSlots[i];
          "number" === typeof resumeSegmentID
            ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i])
            : renderNode(request, task, node, i);
          0 === --previousSuspenseListRow.pendingTasks &&
            finishSuspenseListRow(request, previousSuspenseListRow);
        }
      else
        for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
          ((n =
            "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder
              ? resumeSlots
              : keyPath - 1 - resumeSlots),
            (i = rows[n]),
            (task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow)),
            (task.treeContext = pushTreeContext(prevTreeContext, keyPath, n)),
            renderNode(request, task, i, n),
            0 === --previousSuspenseListRow.pendingTasks &&
              finishSuspenseListRow(request, previousSuspenseListRow));
    } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
      for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
        ((resumeSlots = rows[revealOrder]),
          (task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow)),
          (task.treeContext = pushTreeContext(prevTreeContext, keyPath, revealOrder)),
          renderNode(request, task, resumeSlots, revealOrder),
          0 === --previousSuspenseListRow.pendingTasks &&
            finishSuspenseListRow(request, previousSuspenseListRow));
    else {
      revealOrder = task.blockedSegment;
      resumeSlots = revealOrder.children.length;
      n = revealOrder.chunks.length;
      for (i = keyPath - 1; 0 <= i; i--) {
        node = rows[i];
        task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
        task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
        resumeSegmentID = createPendingSegment(
          request,
          n,
          null,
          task.formatContext,
          0 === i ? revealOrder.lastPushedText : true,
          true,
        );
        revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
        task.blockedSegment = resumeSegmentID;
        try {
          (renderNode(request, task, node, i),
            resumeSegmentID.lastPushedText &&
              resumeSegmentID.textEmbedded &&
              resumeSegmentID.chunks.push(textSeparator),
            (resumeSegmentID.status = 1),
            finishedSegment(request, task.blockedBoundary, resumeSegmentID),
            0 === --previousSuspenseListRow.pendingTasks &&
              finishSuspenseListRow(request, previousSuspenseListRow));
        } catch (thrownValue) {
          throw ((resumeSegmentID.status = 12 === request.status ? 3 : 4), thrownValue);
        }
      }
      task.blockedSegment = revealOrder;
      revealOrder.lastPushedText = false;
    }
    null !== prevRow &&
      null !== previousSuspenseListRow &&
      0 < previousSuspenseListRow.pendingTasks &&
      (prevRow.pendingTasks++, (previousSuspenseListRow.next = prevRow));
    task.treeContext = prevTreeContext;
    task.row = prevRow;
    task.keyPath = prevKeyPath;
  }
  function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
    var prevThenableState = task.thenableState;
    task.thenableState = null;
    currentlyRenderingComponent = {};
    currentlyRenderingTask = task;
    currentlyRenderingRequest = request;
    currentlyRenderingKeyPath = keyPath;
    actionStateCounter = localIdCounter = 0;
    actionStateMatchingIndex = -1;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
      ((didScheduleRenderPhaseUpdate = false),
        (actionStateCounter = localIdCounter = 0),
        (actionStateMatchingIndex = -1),
        (thenableIndexCounter = 0),
        (numberOfReRenders += 1),
        (workInProgressHook = null),
        (request = Component(props, secondArg)));
    resetHooksState();
    return request;
  }
  function finishFunctionComponent(
    request,
    task,
    keyPath,
    children,
    hasId,
    actionStateCount,
    actionStateMatchingIndex2,
  ) {
    var didEmitActionStateMarkers = false;
    if (0 !== actionStateCount && null !== request.formState) {
      var segment = task.blockedSegment;
      if (null !== segment) {
        didEmitActionStateMarkers = true;
        segment = segment.chunks;
        for (var i = 0; i < actionStateCount; i++)
          i === actionStateMatchingIndex2
            ? segment.push(formStateMarkerIsMatching)
            : segment.push(formStateMarkerIsNotMatching);
      }
    }
    actionStateCount = task.keyPath;
    task.keyPath = keyPath;
    hasId
      ? ((keyPath = task.treeContext),
        (task.treeContext = pushTreeContext(keyPath, 1, 0)),
        renderNode(request, task, children, -1),
        (task.treeContext = keyPath))
      : didEmitActionStateMarkers
        ? renderNode(request, task, children, -1)
        : renderNodeDestructive(request, task, children, -1);
    task.keyPath = actionStateCount;
  }
  function renderElement(request, task, keyPath, type, props, ref) {
    if ("function" === typeof type)
      if (type.prototype && type.prototype.isReactComponent) {
        var newProps = props;
        if ("ref" in props) {
          newProps = {};
          for (var propName in props) "ref" !== propName && (newProps[propName] = props[propName]);
        }
        var defaultProps = type.defaultProps;
        if (defaultProps) {
          newProps === props && (newProps = assign({}, newProps, props));
          for (var propName$44 in defaultProps)
            void 0 === newProps[propName$44] && (newProps[propName$44] = defaultProps[propName$44]);
        }
        props = newProps;
        newProps = emptyContextObject;
        defaultProps = type.contextType;
        "object" === typeof defaultProps &&
          null !== defaultProps &&
          (newProps = defaultProps._currentValue);
        newProps = new type(props, newProps);
        var initialState = void 0 !== newProps.state ? newProps.state : null;
        newProps.updater = classComponentUpdater;
        newProps.props = props;
        newProps.state = initialState;
        defaultProps = { queue: [], replace: false };
        newProps._reactInternals = defaultProps;
        ref = type.contextType;
        newProps.context =
          "object" === typeof ref && null !== ref ? ref._currentValue : emptyContextObject;
        ref = type.getDerivedStateFromProps;
        "function" === typeof ref &&
          ((ref = ref(props, initialState)),
          (initialState =
            null === ref || void 0 === ref ? initialState : assign({}, initialState, ref)),
          (newProps.state = initialState));
        if (
          "function" !== typeof type.getDerivedStateFromProps &&
          "function" !== typeof newProps.getSnapshotBeforeUpdate &&
          ("function" === typeof newProps.UNSAFE_componentWillMount ||
            "function" === typeof newProps.componentWillMount)
        )
          if (
            ((type = newProps.state),
            "function" === typeof newProps.componentWillMount && newProps.componentWillMount(),
            "function" === typeof newProps.UNSAFE_componentWillMount &&
              newProps.UNSAFE_componentWillMount(),
            type !== newProps.state &&
              classComponentUpdater.enqueueReplaceState(newProps, newProps.state, null),
            null !== defaultProps.queue && 0 < defaultProps.queue.length)
          )
            if (
              ((type = defaultProps.queue),
              (ref = defaultProps.replace),
              (defaultProps.queue = null),
              (defaultProps.replace = false),
              ref && 1 === type.length)
            )
              newProps.state = type[0];
            else {
              defaultProps = ref ? type[0] : newProps.state;
              initialState = true;
              for (ref = ref ? 1 : 0; ref < type.length; ref++)
                ((propName$44 = type[ref]),
                  (propName$44 =
                    "function" === typeof propName$44
                      ? propName$44.call(newProps, defaultProps, props, void 0)
                      : propName$44),
                  null != propName$44 &&
                    (initialState
                      ? ((initialState = false),
                        (defaultProps = assign({}, defaultProps, propName$44)))
                      : assign(defaultProps, propName$44)));
              newProps.state = defaultProps;
            }
          else defaultProps.queue = null;
        type = newProps.render();
        if (12 === request.status) throw null;
        props = task.keyPath;
        task.keyPath = keyPath;
        renderNodeDestructive(request, task, type, -1);
        task.keyPath = props;
      } else {
        type = renderWithHooks(request, task, keyPath, type, props, void 0);
        if (12 === request.status) throw null;
        finishFunctionComponent(
          request,
          task,
          keyPath,
          type,
          0 !== localIdCounter,
          actionStateCounter,
          actionStateMatchingIndex,
        );
      }
    else if ("string" === typeof type)
      if (((newProps = task.blockedSegment), null === newProps))
        ((newProps = props.children),
          (defaultProps = task.formatContext),
          (initialState = task.keyPath),
          (task.formatContext = getChildFormatContext(defaultProps, type, props)),
          (task.keyPath = keyPath),
          renderNode(request, task, newProps, -1),
          (task.formatContext = defaultProps),
          (task.keyPath = initialState));
      else {
        initialState = pushStartInstance(
          newProps.chunks,
          type,
          props,
          request.resumableState,
          request.renderState,
          task.blockedPreamble,
          task.hoistableState,
          task.formatContext,
          newProps.lastPushedText,
        );
        newProps.lastPushedText = false;
        defaultProps = task.formatContext;
        ref = task.keyPath;
        task.keyPath = keyPath;
        if (
          3 ===
          (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode
        ) {
          keyPath = createPendingSegment(request, 0, null, task.formatContext, false, false);
          newProps.preambleChildren.push(keyPath);
          task.blockedSegment = keyPath;
          try {
            ((keyPath.status = 6),
              renderNode(request, task, initialState, -1),
              keyPath.lastPushedText && keyPath.textEmbedded && keyPath.chunks.push(textSeparator),
              (keyPath.status = 1),
              finishedSegment(request, task.blockedBoundary, keyPath));
          } finally {
            task.blockedSegment = newProps;
          }
        } else renderNode(request, task, initialState, -1);
        task.formatContext = defaultProps;
        task.keyPath = ref;
        a: {
          task = newProps.chunks;
          request = request.resumableState;
          switch (type) {
            case "title":
            case "style":
            case "script":
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr":
              break a;
            case "body":
              if (1 >= defaultProps.insertionMode) {
                request.hasBody = true;
                break a;
              }
              break;
            case "html":
              if (0 === defaultProps.insertionMode) {
                request.hasHtml = true;
                break a;
              }
              break;
            case "head":
              if (1 >= defaultProps.insertionMode) break a;
          }
          task.push(endChunkForTag(type));
        }
        newProps.lastPushedText = false;
      }
    else {
      switch (type) {
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_STRICT_MODE_TYPE:
        case REACT_PROFILER_TYPE:
        case REACT_FRAGMENT_TYPE:
          type = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, props.children, -1);
          task.keyPath = type;
          return;
        case REACT_ACTIVITY_TYPE:
          type = task.blockedSegment;
          null === type
            ? "hidden" !== props.mode &&
              ((type = task.keyPath),
              (task.keyPath = keyPath),
              renderNode(request, task, props.children, -1),
              (task.keyPath = type))
            : "hidden" !== props.mode &&
              (type.chunks.push(startActivityBoundary),
              (type.lastPushedText = false),
              (newProps = task.keyPath),
              (task.keyPath = keyPath),
              renderNode(request, task, props.children, -1),
              (task.keyPath = newProps),
              type.chunks.push(endActivityBoundary),
              (type.lastPushedText = false));
          return;
        case REACT_SUSPENSE_LIST_TYPE:
          a: {
            type = props.children;
            props = props.revealOrder;
            if (
              "forwards" === props ||
              "backwards" === props ||
              "unstable_legacy-backwards" === props
            ) {
              if (isArrayImpl(type)) {
                renderSuspenseListRows(request, task, keyPath, type, props);
                break a;
              }
              if ((newProps = getIteratorFn(type))) {
                if ((newProps = newProps.call(type))) {
                  defaultProps = newProps.next();
                  if (!defaultProps.done) {
                    do defaultProps = newProps.next();
                    while (!defaultProps.done);
                    renderSuspenseListRows(request, task, keyPath, type, props);
                  }
                  break a;
                }
              }
            }
            "together" === props
              ? ((props = task.keyPath),
                (newProps = task.row),
                (defaultProps = task.row = createSuspenseListRow(null)),
                (defaultProps.boundaries = []),
                (defaultProps.together = true),
                (task.keyPath = keyPath),
                renderNodeDestructive(request, task, type, -1),
                0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps),
                (task.keyPath = props),
                (task.row = newProps),
                null !== newProps &&
                  0 < defaultProps.pendingTasks &&
                  (newProps.pendingTasks++, (defaultProps.next = newProps)))
              : ((props = task.keyPath),
                (task.keyPath = keyPath),
                renderNodeDestructive(request, task, type, -1),
                (task.keyPath = props));
          }
          return;
        case REACT_VIEW_TRANSITION_TYPE:
        case REACT_SCOPE_TYPE:
          throw Error("ReactDOMServer does not yet support scope components.");
        case REACT_SUSPENSE_TYPE:
          a: if (null !== task.replay) {
            type = task.keyPath;
            newProps = task.formatContext;
            defaultProps = task.row;
            task.keyPath = keyPath;
            task.formatContext = getSuspenseContentFormatContext(request.resumableState, newProps);
            task.row = null;
            keyPath = props.children;
            try {
              renderNode(request, task, keyPath, -1);
            } finally {
              ((task.keyPath = type), (task.formatContext = newProps), (task.row = defaultProps));
            }
          } else {
            type = task.keyPath;
            ref = task.formatContext;
            var prevRow = task.row;
            propName$44 = task.blockedBoundary;
            propName = task.blockedPreamble;
            var parentHoistableState = task.hoistableState,
              parentSegment = task.blockedSegment,
              fallback = props.fallback;
            props = props.children;
            var fallbackAbortSet = /* @__PURE__ */ new Set();
            var newBoundary =
              2 > task.formatContext.insertionMode
                ? createSuspenseBoundary(
                    request,
                    task.row,
                    fallbackAbortSet,
                    createPreambleState(),
                    createPreambleState(),
                  )
                : createSuspenseBoundary(request, task.row, fallbackAbortSet, null, null);
            null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
            var boundarySegment = createPendingSegment(
              request,
              parentSegment.chunks.length,
              newBoundary,
              task.formatContext,
              false,
              false,
            );
            parentSegment.children.push(boundarySegment);
            parentSegment.lastPushedText = false;
            var contentRootSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false,
            );
            contentRootSegment.parentFlushed = true;
            if (null !== request.trackedPostpones) {
              newProps = task.componentStack;
              defaultProps = [keyPath[0], "Suspense Fallback", keyPath[2]];
              initialState = [defaultProps[1], defaultProps[2], [], null];
              request.trackedPostpones.workingMap.set(defaultProps, initialState);
              newBoundary.trackedFallbackNode = initialState;
              task.blockedSegment = boundarySegment;
              task.blockedPreamble = newBoundary.fallbackPreamble;
              task.keyPath = defaultProps;
              task.formatContext = getSuspenseFallbackFormatContext(request.resumableState, ref);
              task.componentStack =
                replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
              boundarySegment.status = 6;
              try {
                (renderNode(request, task, fallback, -1),
                  boundarySegment.lastPushedText &&
                    boundarySegment.textEmbedded &&
                    boundarySegment.chunks.push(textSeparator),
                  (boundarySegment.status = 1),
                  finishedSegment(request, propName$44, boundarySegment));
              } catch (thrownValue) {
                throw ((boundarySegment.status = 12 === request.status ? 3 : 4), thrownValue);
              } finally {
                ((task.blockedSegment = parentSegment),
                  (task.blockedPreamble = propName),
                  (task.keyPath = type),
                  (task.formatContext = ref));
              }
              task = createRenderTask(
                request,
                null,
                props,
                -1,
                newBoundary,
                contentRootSegment,
                newBoundary.contentPreamble,
                newBoundary.contentState,
                task.abortSet,
                keyPath,
                getSuspenseContentFormatContext(request.resumableState, task.formatContext),
                task.context,
                task.treeContext,
                null,
                newProps,
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            } else {
              task.blockedBoundary = newBoundary;
              task.blockedPreamble = newBoundary.contentPreamble;
              task.hoistableState = newBoundary.contentState;
              task.blockedSegment = contentRootSegment;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(request.resumableState, ref);
              task.row = null;
              contentRootSegment.status = 6;
              try {
                if (
                  (renderNode(request, task, props, -1),
                  contentRootSegment.lastPushedText &&
                    contentRootSegment.textEmbedded &&
                    contentRootSegment.chunks.push(textSeparator),
                  (contentRootSegment.status = 1),
                  finishedSegment(request, newBoundary, contentRootSegment),
                  queueCompletedSegment(newBoundary, contentRootSegment),
                  0 === newBoundary.pendingTasks && 0 === newBoundary.status)
                ) {
                  if (((newBoundary.status = 1), !isEligibleForOutlining(request, newBoundary))) {
                    null !== prevRow &&
                      0 === --prevRow.pendingTasks &&
                      finishSuspenseListRow(request, prevRow);
                    0 === request.pendingRootTasks &&
                      task.blockedPreamble &&
                      preparePreamble(request);
                    break a;
                  }
                } else
                  null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
              } catch (thrownValue$31) {
                ((newBoundary.status = 4),
                  12 === request.status
                    ? ((contentRootSegment.status = 3), (newProps = request.fatalError))
                    : ((contentRootSegment.status = 4), (newProps = thrownValue$31)),
                  (defaultProps = getThrownInfo(task.componentStack)),
                  (initialState = logRecoverableError(request, newProps, defaultProps)),
                  (newBoundary.errorDigest = initialState),
                  untrackBoundary(request, newBoundary));
              } finally {
                ((task.blockedBoundary = propName$44),
                  (task.blockedPreamble = propName),
                  (task.hoistableState = parentHoistableState),
                  (task.blockedSegment = parentSegment),
                  (task.keyPath = type),
                  (task.formatContext = ref),
                  (task.row = prevRow));
              }
              task = createRenderTask(
                request,
                null,
                fallback,
                -1,
                propName$44,
                boundarySegment,
                newBoundary.fallbackPreamble,
                newBoundary.fallbackState,
                fallbackAbortSet,
                [keyPath[0], "Suspense Fallback", keyPath[2]],
                getSuspenseFallbackFormatContext(request.resumableState, task.formatContext),
                task.context,
                task.treeContext,
                task.row,
                replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack),
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            }
          }
          return;
      }
      if ("object" === typeof type && null !== type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            if ("ref" in props)
              for (parentSegment in ((newProps = {}), props))
                "ref" !== parentSegment && (newProps[parentSegment] = props[parentSegment]);
            else newProps = props;
            type = renderWithHooks(request, task, keyPath, type.render, newProps, ref);
            finishFunctionComponent(
              request,
              task,
              keyPath,
              type,
              0 !== localIdCounter,
              actionStateCounter,
              actionStateMatchingIndex,
            );
            return;
          case REACT_MEMO_TYPE:
            renderElement(request, task, keyPath, type.type, props, ref);
            return;
          case REACT_CONTEXT_TYPE:
            defaultProps = props.children;
            newProps = task.keyPath;
            props = props.value;
            initialState = type._currentValue;
            type._currentValue = props;
            ref = currentActiveSnapshot;
            currentActiveSnapshot = type = {
              parent: ref,
              depth: null === ref ? 0 : ref.depth + 1,
              context: type,
              parentValue: initialState,
              value: props,
            };
            task.context = type;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, defaultProps, -1);
            request = currentActiveSnapshot;
            if (null === request)
              throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
            request.context._currentValue = request.parentValue;
            request = currentActiveSnapshot = request.parent;
            task.context = request;
            task.keyPath = newProps;
            return;
          case REACT_CONSUMER_TYPE:
            props = props.children;
            type = props(type._context._currentValue);
            props = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, type, -1);
            task.keyPath = props;
            return;
          case REACT_LAZY_TYPE:
            newProps = type._init;
            type = newProps(type._payload);
            if (12 === request.status) throw null;
            renderElement(request, task, keyPath, type, props, ref);
            return;
        }
      throw Error(
        "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
          ((null == type ? type : typeof type) + "."),
      );
    }
  }
  function resumeNode(request, task, segmentId, node, childIndex) {
    var prevReplay = task.replay,
      blockedBoundary = task.blockedBoundary,
      resumedSegment = createPendingSegment(request, 0, null, task.formatContext, false, false);
    resumedSegment.id = segmentId;
    resumedSegment.parentFlushed = true;
    try {
      ((task.replay = null),
        (task.blockedSegment = resumedSegment),
        renderNode(request, task, node, childIndex),
        (resumedSegment.status = 1),
        finishedSegment(request, blockedBoundary, resumedSegment),
        null === blockedBoundary
          ? (request.completedRootSegment = resumedSegment)
          : (queueCompletedSegment(blockedBoundary, resumedSegment),
            blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary)));
    } finally {
      ((task.replay = prevReplay), (task.blockedSegment = null));
    }
  }
  function renderNodeDestructive(request, task, node, childIndex) {
    null !== task.replay && "number" === typeof task.replay.slots
      ? resumeNode(request, task, task.replay.slots, node, childIndex)
      : ((task.node = node),
        (task.childIndex = childIndex),
        (node = task.componentStack),
        pushComponentStack(task),
        retryNode(request, task),
        (task.componentStack = node));
  }
  function retryNode(request, task) {
    var node = task.node,
      childIndex = task.childIndex;
    if (null !== node) {
      if ("object" === typeof node) {
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = node.type,
              key = node.key,
              props = node.props;
            node = props.ref;
            var ref = void 0 !== node ? node : null,
              name = getComponentNameFromType(type),
              keyOrIndex = null == key ? (-1 === childIndex ? 0 : childIndex) : key;
            key = [task.keyPath, name, keyOrIndex];
            if (null !== task.replay)
              a: {
                var replay = task.replay;
                childIndex = replay.nodes;
                for (node = 0; node < childIndex.length; node++) {
                  var node$jscomp$0 = childIndex[node];
                  if (keyOrIndex === node$jscomp$0[1]) {
                    if (4 === node$jscomp$0.length) {
                      if (null !== name && name !== node$jscomp$0[0])
                        throw Error(
                          "Expected the resume to render <" +
                            node$jscomp$0[0] +
                            "> in this slot but instead it rendered <" +
                            name +
                            ">. The tree doesn't match so React will fallback to client rendering.",
                        );
                      var childNodes = node$jscomp$0[2];
                      name = node$jscomp$0[3];
                      keyOrIndex = task.node;
                      task.replay = {
                        nodes: childNodes,
                        slots: name,
                        pendingTasks: 1,
                      };
                      try {
                        renderElement(request, task, key, type, props, ref);
                        if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                          throw Error(
                            "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
                          );
                        task.replay.pendingTasks--;
                      } catch (x2) {
                        if (
                          "object" === typeof x2 &&
                          null !== x2 &&
                          (x2 === SuspenseException || "function" === typeof x2.then)
                        )
                          throw (
                            task.node === keyOrIndex
                              ? (task.replay = replay)
                              : childIndex.splice(node, 1),
                            x2
                          );
                        task.replay.pendingTasks--;
                        props = getThrownInfo(task.componentStack);
                        key = request;
                        request = task.blockedBoundary;
                        type = x2;
                        props = logRecoverableError(key, type, props);
                        abortRemainingReplayNodes(key, request, childNodes, name, type, props);
                      }
                      task.replay = replay;
                    } else {
                      if (type !== REACT_SUSPENSE_TYPE)
                        throw Error(
                          "Expected the resume to render <Suspense> in this slot but instead it rendered <" +
                            (getComponentNameFromType(type) || "Unknown") +
                            ">. The tree doesn't match so React will fallback to client rendering.",
                        );
                      b: {
                        replay = void 0;
                        type = node$jscomp$0[5];
                        ref = node$jscomp$0[2];
                        name = node$jscomp$0[3];
                        keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                        node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                        var prevKeyPath = task.keyPath,
                          prevContext = task.formatContext,
                          prevRow = task.row,
                          previousReplaySet = task.replay,
                          parentBoundary = task.blockedBoundary,
                          parentHoistableState = task.hoistableState,
                          content = props.children,
                          fallback = props.fallback,
                          fallbackAbortSet = /* @__PURE__ */ new Set();
                        props =
                          2 > task.formatContext.insertionMode
                            ? createSuspenseBoundary(
                                request,
                                task.row,
                                fallbackAbortSet,
                                createPreambleState(),
                                createPreambleState(),
                              )
                            : createSuspenseBoundary(
                                request,
                                task.row,
                                fallbackAbortSet,
                                null,
                                null,
                              );
                        props.parentFlushed = true;
                        props.rootSegmentID = type;
                        task.blockedBoundary = props;
                        task.hoistableState = props.contentState;
                        task.keyPath = key;
                        task.formatContext = getSuspenseContentFormatContext(
                          request.resumableState,
                          prevContext,
                        );
                        task.row = null;
                        task.replay = {
                          nodes: ref,
                          slots: name,
                          pendingTasks: 1,
                        };
                        try {
                          renderNode(request, task, content, -1);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
                            );
                          task.replay.pendingTasks--;
                          if (0 === props.pendingTasks && 0 === props.status) {
                            props.status = 1;
                            request.completedBoundaries.push(props);
                            break b;
                          }
                        } catch (error) {
                          ((props.status = 4),
                            (childNodes = getThrownInfo(task.componentStack)),
                            (replay = logRecoverableError(request, error, childNodes)),
                            (props.errorDigest = replay),
                            task.replay.pendingTasks--,
                            request.clientRenderedBoundaries.push(props));
                        } finally {
                          ((task.blockedBoundary = parentBoundary),
                            (task.hoistableState = parentHoistableState),
                            (task.replay = previousReplaySet),
                            (task.keyPath = prevKeyPath),
                            (task.formatContext = prevContext),
                            (task.row = prevRow));
                        }
                        childNodes = createReplayTask(
                          request,
                          null,
                          {
                            nodes: keyOrIndex,
                            slots: node$jscomp$0,
                            pendingTasks: 0,
                          },
                          fallback,
                          -1,
                          parentBoundary,
                          props.fallbackState,
                          fallbackAbortSet,
                          [key[0], "Suspense Fallback", key[2]],
                          getSuspenseFallbackFormatContext(
                            request.resumableState,
                            task.formatContext,
                          ),
                          task.context,
                          task.treeContext,
                          task.row,
                          replaceSuspenseComponentStackWithSuspenseFallbackStack(
                            task.componentStack,
                          ),
                        );
                        pushComponentStack(childNodes);
                        request.pingedTasks.push(childNodes);
                      }
                    }
                    childIndex.splice(node, 1);
                    break a;
                  }
                }
              }
            else renderElement(request, task, key, type, props, ref);
            return;
          case REACT_PORTAL_TYPE:
            throw Error(
              "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.",
            );
          case REACT_LAZY_TYPE:
            childNodes = node._init;
            node = childNodes(node._payload);
            if (12 === request.status) throw null;
            renderNodeDestructive(request, task, node, childIndex);
            return;
        }
        if (isArrayImpl(node)) {
          renderChildrenArray(request, task, node, childIndex);
          return;
        }
        if ((childNodes = getIteratorFn(node))) {
          if ((childNodes = childNodes.call(node))) {
            node = childNodes.next();
            if (!node.done) {
              props = [];
              do (props.push(node.value), (node = childNodes.next()));
              while (!node.done);
              renderChildrenArray(request, task, props, childIndex);
            }
            return;
          }
        }
        if ("function" === typeof node.then)
          return (
            (task.thenableState = null),
            renderNodeDestructive(request, task, unwrapThenable(node), childIndex)
          );
        if (node.$$typeof === REACT_CONTEXT_TYPE)
          return renderNodeDestructive(request, task, node._currentValue, childIndex);
        childIndex = Object.prototype.toString.call(node);
        throw Error(
          "Objects are not valid as a React child (found: " +
            ("[object Object]" === childIndex
              ? "object with keys {" + Object.keys(node).join(", ") + "}"
              : childIndex) +
            "). If you meant to render a collection of children, use an array instead.",
        );
      }
      if ("string" === typeof node)
        ((childIndex = task.blockedSegment),
          null !== childIndex &&
            (childIndex.lastPushedText = pushTextInstance(
              childIndex.chunks,
              node,
              request.renderState,
              childIndex.lastPushedText,
            )));
      else if ("number" === typeof node || "bigint" === typeof node)
        ((childIndex = task.blockedSegment),
          null !== childIndex &&
            (childIndex.lastPushedText = pushTextInstance(
              childIndex.chunks,
              "" + node,
              request.renderState,
              childIndex.lastPushedText,
            )));
    }
  }
  function renderChildrenArray(request, task, children, childIndex) {
    var prevKeyPath = task.keyPath;
    if (
      -1 !== childIndex &&
      ((task.keyPath = [task.keyPath, "Fragment", childIndex]), null !== task.replay)
    ) {
      for (
        var replay = task.replay, replayNodes = replay.nodes, j2 = 0;
        j2 < replayNodes.length;
        j2++
      ) {
        var node = replayNodes[j2];
        if (node[1] === childIndex) {
          childIndex = node[2];
          node = node[3];
          task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
          try {
            renderChildrenArray(request, task, children, -1);
            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
              throw Error(
                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
              );
            task.replay.pendingTasks--;
          } catch (x2) {
            if (
              "object" === typeof x2 &&
              null !== x2 &&
              (x2 === SuspenseException || "function" === typeof x2.then)
            )
              throw x2;
            task.replay.pendingTasks--;
            children = getThrownInfo(task.componentStack);
            var boundary = task.blockedBoundary,
              error = x2;
            children = logRecoverableError(request, error, children);
            abortRemainingReplayNodes(request, boundary, childIndex, node, error, children);
          }
          task.replay = replay;
          replayNodes.splice(j2, 1);
          break;
        }
      }
      task.keyPath = prevKeyPath;
      return;
    }
    replay = task.treeContext;
    replayNodes = children.length;
    if (null !== task.replay && ((j2 = task.replay.slots), null !== j2 && "object" === typeof j2)) {
      for (childIndex = 0; childIndex < replayNodes; childIndex++)
        ((node = children[childIndex]),
          (task.treeContext = pushTreeContext(replay, replayNodes, childIndex)),
          (boundary = j2[childIndex]),
          "number" === typeof boundary
            ? (resumeNode(request, task, boundary, node, childIndex), delete j2[childIndex])
            : renderNode(request, task, node, childIndex));
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
      return;
    }
    for (j2 = 0; j2 < replayNodes; j2++)
      ((childIndex = children[j2]),
        (task.treeContext = pushTreeContext(replay, replayNodes, j2)),
        renderNode(request, task, childIndex, j2));
    task.treeContext = replay;
    task.keyPath = prevKeyPath;
  }
  function trackPostponedBoundary(request, trackedPostpones, boundary) {
    boundary.status = 5;
    boundary.rootSegmentID = request.nextSegmentId++;
    request = boundary.trackedContentKeyPath;
    if (null === request)
      throw Error("It should not be possible to postpone at the root. This is a bug in React.");
    var fallbackReplayNode = boundary.trackedFallbackNode,
      children = [],
      boundaryNode = trackedPostpones.workingMap.get(request);
    if (void 0 === boundaryNode)
      return (
        (boundary = [
          request[1],
          request[2],
          children,
          null,
          fallbackReplayNode,
          boundary.rootSegmentID,
        ]),
        trackedPostpones.workingMap.set(request, boundary),
        addToReplayParent(boundary, request[0], trackedPostpones),
        boundary
      );
    boundaryNode[4] = fallbackReplayNode;
    boundaryNode[5] = boundary.rootSegmentID;
    return boundaryNode;
  }
  function trackPostpone(request, trackedPostpones, task, segment) {
    segment.status = 5;
    var keyPath = task.keyPath,
      boundary = task.blockedBoundary;
    if (null === boundary)
      ((segment.id = request.nextSegmentId++),
        (trackedPostpones.rootSlots = segment.id),
        null !== request.completedRootSegment && (request.completedRootSegment.status = 5));
    else {
      if (null !== boundary && 0 === boundary.status) {
        var boundaryNode = trackPostponedBoundary(request, trackedPostpones, boundary);
        if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
          -1 === segment.id &&
            (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
          boundaryNode[3] = segment.id;
          return;
        }
      }
      -1 === segment.id &&
        (segment.id =
          segment.parentFlushed && null !== boundary
            ? boundary.rootSegmentID
            : request.nextSegmentId++);
      if (-1 === task.childIndex)
        null === keyPath
          ? (trackedPostpones.rootSlots = segment.id)
          : ((task = trackedPostpones.workingMap.get(keyPath)),
            void 0 === task
              ? ((task = [keyPath[1], keyPath[2], [], segment.id]),
                addToReplayParent(task, keyPath[0], trackedPostpones))
              : (task[3] = segment.id));
      else {
        if (null === keyPath)
          if (((request = trackedPostpones.rootSlots), null === request))
            request = trackedPostpones.rootSlots = {};
          else {
            if ("number" === typeof request)
              throw Error(
                "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React.",
              );
          }
        else if (
          ((boundary = trackedPostpones.workingMap),
          (boundaryNode = boundary.get(keyPath)),
          void 0 === boundaryNode)
        )
          ((request = {}),
            (boundaryNode = [keyPath[1], keyPath[2], [], request]),
            boundary.set(keyPath, boundaryNode),
            addToReplayParent(boundaryNode, keyPath[0], trackedPostpones));
        else if (((request = boundaryNode[3]), null === request)) request = boundaryNode[3] = {};
        else if ("number" === typeof request)
          throw Error(
            "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React.",
          );
        request[task.childIndex] = segment.id;
      }
    }
  }
  function untrackBoundary(request, boundary) {
    request = request.trackedPostpones;
    null !== request &&
      ((boundary = boundary.trackedContentKeyPath),
      null !== boundary &&
        ((boundary = request.workingMap.get(boundary)),
        void 0 !== boundary && ((boundary.length = 4), (boundary[2] = []), (boundary[3] = null))));
  }
  function spawnNewSuspendedReplayTask(request, task, thenableState2) {
    return createReplayTask(
      request,
      thenableState2,
      task.replay,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack,
    );
  }
  function spawnNewSuspendedRenderTask(request, task, thenableState2) {
    var segment = task.blockedSegment,
      newSegment = createPendingSegment(
        request,
        segment.chunks.length,
        null,
        task.formatContext,
        segment.lastPushedText,
        true,
      );
    segment.children.push(newSegment);
    segment.lastPushedText = false;
    return createRenderTask(
      request,
      thenableState2,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      newSegment,
      task.blockedPreamble,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack,
    );
  }
  function renderNode(request, task, node, childIndex) {
    var previousFormatContext = task.formatContext,
      previousContext = task.context,
      previousKeyPath = task.keyPath,
      previousTreeContext = task.treeContext,
      previousComponentStack = task.componentStack,
      segment = task.blockedSegment;
    if (null === segment) {
      segment = task.replay;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue) {
        if (
          (resetHooksState(),
          (node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue),
          12 !== request.status && "object" === typeof node && null !== node)
        ) {
          if ("function" === typeof node.then) {
            childIndex =
              thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
            node.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            node = spawnNewSuspendedReplayTask(request, task, node);
            request.pingedTasks.push(node);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
        }
      }
    } else {
      var childrenLength = segment.children.length,
        chunkLength = segment.chunks.length;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue$63) {
        if (
          (resetHooksState(),
          (segment.children.length = childrenLength),
          (segment.chunks.length = chunkLength),
          (node = thrownValue$63 === SuspenseException ? getSuspendedThenable() : thrownValue$63),
          12 !== request.status && "object" === typeof node && null !== node)
        ) {
          if ("function" === typeof node.then) {
            segment = node;
            node = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedRenderTask(request, task, node).ping;
            segment.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            segment =
              thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
            segment = spawnNewSuspendedRenderTask(request, task, segment);
            request.pingedTasks.push(segment);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
        }
      }
    }
    task.formatContext = previousFormatContext;
    task.context = previousContext;
    task.keyPath = previousKeyPath;
    task.treeContext = previousTreeContext;
    switchContext(previousContext);
    throw node;
  }
  function abortTaskSoft(task) {
    var boundary = task.blockedBoundary,
      segment = task.blockedSegment;
    null !== segment && ((segment.status = 3), finishedTask(this, boundary, task.row, segment));
  }
  function abortRemainingReplayNodes(
    request$jscomp$0,
    boundary,
    nodes,
    slots,
    error,
    errorDigest$jscomp$0,
  ) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (4 === node.length)
        abortRemainingReplayNodes(
          request$jscomp$0,
          boundary,
          node[2],
          node[3],
          error,
          errorDigest$jscomp$0,
        );
      else {
        node = node[5];
        var request = request$jscomp$0,
          errorDigest = errorDigest$jscomp$0,
          resumedBoundary = createSuspenseBoundary(
            request,
            null,
            /* @__PURE__ */ new Set(),
            null,
            null,
          );
        resumedBoundary.parentFlushed = true;
        resumedBoundary.rootSegmentID = node;
        resumedBoundary.status = 4;
        resumedBoundary.errorDigest = errorDigest;
        resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
      }
    }
    nodes.length = 0;
    if (null !== slots) {
      if (null === boundary)
        throw Error("We should not have any resumable nodes in the shell. This is a bug in React.");
      4 !== boundary.status &&
        ((boundary.status = 4),
        (boundary.errorDigest = errorDigest$jscomp$0),
        boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
      if ("object" === typeof slots) for (var index in slots) delete slots[index];
    }
  }
  function abortTask(task, request, error) {
    var boundary = task.blockedBoundary,
      segment = task.blockedSegment;
    if (null !== segment) {
      if (6 === segment.status) return;
      segment.status = 3;
    }
    var errorInfo = getThrownInfo(task.componentStack);
    if (null === boundary) {
      if (13 !== request.status && 14 !== request.status) {
        boundary = task.replay;
        if (null === boundary) {
          null !== request.trackedPostpones && null !== segment
            ? ((boundary = request.trackedPostpones),
              logRecoverableError(request, error, errorInfo),
              trackPostpone(request, boundary, task, segment),
              finishedTask(request, null, task.row, segment))
            : (logRecoverableError(request, error, errorInfo), fatalError(request, error));
          return;
        }
        boundary.pendingTasks--;
        0 === boundary.pendingTasks &&
          0 < boundary.nodes.length &&
          ((segment = logRecoverableError(request, error, errorInfo)),
          abortRemainingReplayNodes(request, null, boundary.nodes, boundary.slots, error, segment));
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      }
    } else {
      var trackedPostpones$64 = request.trackedPostpones;
      if (4 !== boundary.status) {
        if (null !== trackedPostpones$64 && null !== segment)
          return (
            logRecoverableError(request, error, errorInfo),
            trackPostpone(request, trackedPostpones$64, task, segment),
            boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
              return abortTask(fallbackTask, request, error);
            }),
            boundary.fallbackAbortableTasks.clear(),
            finishedTask(request, boundary, task.row, segment)
          );
        boundary.status = 4;
        segment = logRecoverableError(request, error, errorInfo);
        boundary.status = 4;
        boundary.errorDigest = segment;
        untrackBoundary(request, boundary);
        boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
      }
      boundary.pendingTasks--;
      segment = boundary.row;
      null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
        return abortTask(fallbackTask, request, error);
      });
      boundary.fallbackAbortableTasks.clear();
    }
    task = task.row;
    null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
    request.allPendingTasks--;
    0 === request.allPendingTasks && completeAll(request);
  }
  function safelyEmitEarlyPreloads(request, shellComplete) {
    try {
      var renderState = request.renderState,
        onHeaders = renderState.onHeaders;
      if (onHeaders) {
        var headers = renderState.headers;
        if (headers) {
          renderState.headers = null;
          var linkHeader = headers.preconnects;
          headers.fontPreloads &&
            (linkHeader && (linkHeader += ", "), (linkHeader += headers.fontPreloads));
          headers.highImagePreloads &&
            (linkHeader && (linkHeader += ", "), (linkHeader += headers.highImagePreloads));
          if (!shellComplete) {
            var queueIter = renderState.styles.values(),
              queueStep = queueIter.next();
            b: for (
              ;
              0 < headers.remainingCapacity && !queueStep.done;
              queueStep = queueIter.next()
            )
              for (
                var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next();
                0 < headers.remainingCapacity && !sheetStep.done;
                sheetStep = sheetIter.next()
              ) {
                var sheet = sheetStep.value,
                  props = sheet.props,
                  key = props.href,
                  props$jscomp$0 = sheet.props,
                  header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                    crossOrigin: props$jscomp$0.crossOrigin,
                    integrity: props$jscomp$0.integrity,
                    nonce: props$jscomp$0.nonce,
                    type: props$jscomp$0.type,
                    fetchPriority: props$jscomp$0.fetchPriority,
                    referrerPolicy: props$jscomp$0.referrerPolicy,
                    media: props$jscomp$0.media,
                  });
                if (0 <= (headers.remainingCapacity -= header.length + 2))
                  ((renderState.resets.style[key] = PRELOAD_NO_CREDS),
                    linkHeader && (linkHeader += ", "),
                    (linkHeader += header),
                    (renderState.resets.style[key] =
                      "string" === typeof props.crossOrigin || "string" === typeof props.integrity
                        ? [props.crossOrigin, props.integrity]
                        : PRELOAD_NO_CREDS));
                else break b;
              }
          }
          linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
        }
      }
    } catch (error) {
      logRecoverableError(request, error, {});
    }
  }
  function completeShell(request) {
    null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
    null === request.trackedPostpones && preparePreamble(request);
    request.onShellError = noop;
    request = request.onShellReady;
    request();
  }
  function completeAll(request) {
    safelyEmitEarlyPreloads(
      request,
      null === request.trackedPostpones
        ? true
        : null === request.completedRootSegment || 5 !== request.completedRootSegment.status,
    );
    preparePreamble(request);
    request = request.onAllReady;
    request();
  }
  function queueCompletedSegment(boundary, segment) {
    if (
      0 === segment.chunks.length &&
      1 === segment.children.length &&
      null === segment.children[0].boundary &&
      -1 === segment.children[0].id
    ) {
      var childSegment = segment.children[0];
      childSegment.id = segment.id;
      childSegment.parentFlushed = true;
      (1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status) ||
        queueCompletedSegment(boundary, childSegment);
    } else boundary.completedSegments.push(segment);
  }
  function finishedSegment(request, boundary, segment) {
    if (null !== byteLengthOfChunk) {
      segment = segment.chunks;
      for (var segmentByteSize = 0, i = 0; i < segment.length; i++)
        segmentByteSize += byteLengthOfChunk(segment[i]);
      null === boundary
        ? (request.byteSize += segmentByteSize)
        : (boundary.byteSize += segmentByteSize);
    }
  }
  function finishedTask(request, boundary, row, segment) {
    null !== row &&
      (0 === --row.pendingTasks
        ? finishSuspenseListRow(request, row)
        : row.together && tryToResolveTogetherRow(request, row));
    request.allPendingTasks--;
    if (null === boundary) {
      if (null !== segment && segment.parentFlushed) {
        if (null !== request.completedRootSegment)
          throw Error("There can only be one root segment. This is a bug in React.");
        request.completedRootSegment = segment;
      }
      request.pendingRootTasks--;
      0 === request.pendingRootTasks && completeShell(request);
    } else if ((boundary.pendingTasks--, 4 !== boundary.status))
      if (0 === boundary.pendingTasks)
        if (
          (0 === boundary.status && (boundary.status = 1),
          null !== segment &&
            segment.parentFlushed &&
            (1 === segment.status || 3 === segment.status) &&
            queueCompletedSegment(boundary, segment),
          boundary.parentFlushed && request.completedBoundaries.push(boundary),
          1 === boundary.status)
        )
          ((row = boundary.row),
            null !== row && hoistHoistables(row.hoistables, boundary.contentState),
            isEligibleForOutlining(request, boundary) ||
              (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request),
              boundary.fallbackAbortableTasks.clear(),
              null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)),
            0 === request.pendingRootTasks &&
              null === request.trackedPostpones &&
              null !== boundary.contentPreamble &&
              preparePreamble(request));
        else {
          if (5 === boundary.status && ((boundary = boundary.row), null !== boundary)) {
            if (null !== request.trackedPostpones) {
              row = request.trackedPostpones;
              var postponedRow = boundary.next;
              if (null !== postponedRow && ((segment = postponedRow.boundaries), null !== segment))
                for (
                  postponedRow.boundaries = null, postponedRow = 0;
                  postponedRow < segment.length;
                  postponedRow++
                ) {
                  var postponedBoundary = segment[postponedRow];
                  trackPostponedBoundary(request, row, postponedBoundary);
                  finishedTask(request, postponedBoundary, null, null);
                }
            }
            0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
          }
        }
      else
        (null === segment ||
          !segment.parentFlushed ||
          (1 !== segment.status && 3 !== segment.status) ||
          (queueCompletedSegment(boundary, segment),
          1 === boundary.completedSegments.length &&
            boundary.parentFlushed &&
            request.partialBoundaries.push(boundary)),
          (boundary = boundary.row),
          null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary));
    0 === request.allPendingTasks && completeAll(request);
  }
  function performWork(request$jscomp$2) {
    if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
      var prevContext = currentActiveSnapshot,
        prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = HooksDispatcher;
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      var prevRequest = currentRequest;
      currentRequest = request$jscomp$2;
      var prevResumableState = currentResumableState;
      currentResumableState = request$jscomp$2.resumableState;
      try {
        var pingedTasks = request$jscomp$2.pingedTasks,
          i;
        for (i = 0; i < pingedTasks.length; i++) {
          var task = pingedTasks[i],
            request = request$jscomp$2,
            segment = task.blockedSegment;
          if (null === segment) {
            var request$jscomp$0 = request;
            if (0 !== task.replay.pendingTasks) {
              switchContext(task.context);
              try {
                "number" === typeof task.replay.slots
                  ? resumeNode(
                      request$jscomp$0,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex,
                    )
                  : retryNode(request$jscomp$0, task);
                if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                  throw Error(
                    "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.",
                  );
                task.replay.pendingTasks--;
                task.abortSet.delete(task);
                finishedTask(request$jscomp$0, task.blockedBoundary, task.row, null);
              } catch (thrownValue) {
                resetHooksState();
                var x2 = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                if ("object" === typeof x2 && null !== x2 && "function" === typeof x2.then) {
                  var ping = task.ping;
                  x2.then(ping, ping);
                  task.thenableState =
                    thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                } else {
                  task.replay.pendingTasks--;
                  task.abortSet.delete(task);
                  var errorInfo = getThrownInfo(task.componentStack);
                  request = void 0;
                  var request$jscomp$1 = request$jscomp$0,
                    boundary = task.blockedBoundary,
                    error$jscomp$0 =
                      12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x2,
                    replayNodes = task.replay.nodes,
                    resumeSlots = task.replay.slots;
                  request = logRecoverableError(request$jscomp$1, error$jscomp$0, errorInfo);
                  abortRemainingReplayNodes(
                    request$jscomp$1,
                    boundary,
                    replayNodes,
                    resumeSlots,
                    error$jscomp$0,
                    request,
                  );
                  request$jscomp$0.pendingRootTasks--;
                  0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
                  request$jscomp$0.allPendingTasks--;
                  0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
                }
              } finally {
              }
            }
          } else if (
            ((request$jscomp$0 = void 0),
            (request$jscomp$1 = segment),
            0 === request$jscomp$1.status)
          ) {
            request$jscomp$1.status = 6;
            switchContext(task.context);
            var childrenLength = request$jscomp$1.children.length,
              chunkLength = request$jscomp$1.chunks.length;
            try {
              (retryNode(request, task),
                request$jscomp$1.lastPushedText &&
                  request$jscomp$1.textEmbedded &&
                  request$jscomp$1.chunks.push(textSeparator),
                task.abortSet.delete(task),
                (request$jscomp$1.status = 1),
                finishedSegment(request, task.blockedBoundary, request$jscomp$1),
                finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1));
            } catch (thrownValue) {
              resetHooksState();
              request$jscomp$1.children.length = childrenLength;
              request$jscomp$1.chunks.length = chunkLength;
              var x$jscomp$0 =
                thrownValue === SuspenseException
                  ? getSuspendedThenable()
                  : 12 === request.status
                    ? request.fatalError
                    : thrownValue;
              if (12 === request.status && null !== request.trackedPostpones) {
                var trackedPostpones = request.trackedPostpones,
                  thrownInfo = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                logRecoverableError(request, x$jscomp$0, thrownInfo);
                trackPostpone(request, trackedPostpones, task, request$jscomp$1);
                finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
              } else if (
                "object" === typeof x$jscomp$0 &&
                null !== x$jscomp$0 &&
                "function" === typeof x$jscomp$0.then
              ) {
                request$jscomp$1.status = 0;
                task.thenableState =
                  thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                var ping$jscomp$0 = task.ping;
                x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
              } else {
                var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                request$jscomp$1.status = 4;
                var boundary$jscomp$0 = task.blockedBoundary,
                  row = task.row;
                null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                request.allPendingTasks--;
                request$jscomp$0 = logRecoverableError(request, x$jscomp$0, errorInfo$jscomp$0);
                if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
                else if ((boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status)) {
                  boundary$jscomp$0.status = 4;
                  boundary$jscomp$0.errorDigest = request$jscomp$0;
                  untrackBoundary(request, boundary$jscomp$0);
                  var boundaryRow = boundary$jscomp$0.row;
                  null !== boundaryRow &&
                    0 === --boundaryRow.pendingTasks &&
                    finishSuspenseListRow(request, boundaryRow);
                  boundary$jscomp$0.parentFlushed &&
                    request.clientRenderedBoundaries.push(boundary$jscomp$0);
                  0 === request.pendingRootTasks &&
                    null === request.trackedPostpones &&
                    null !== boundary$jscomp$0.contentPreamble &&
                    preparePreamble(request);
                }
                0 === request.allPendingTasks && completeAll(request);
              }
            } finally {
            }
          }
        }
        pingedTasks.splice(0, i);
        null !== request$jscomp$2.destination &&
          flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
      } catch (error) {
        (logRecoverableError(request$jscomp$2, error, {}), fatalError(request$jscomp$2, error));
      } finally {
        ((currentResumableState = prevResumableState),
          (ReactSharedInternals.H = prevDispatcher),
          (ReactSharedInternals.A = prevAsyncDispatcher),
          prevDispatcher === HooksDispatcher && switchContext(prevContext),
          (currentRequest = prevRequest));
      }
    }
  }
  function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
    segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
    for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
      pendingPreambles =
        preparePreambleFromSegment(request, segment.children[i], collectedPreambleSegments) ||
        pendingPreambles;
    return pendingPreambles;
  }
  function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
    var boundary = segment.boundary;
    if (null === boundary)
      return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
    var preamble = boundary.contentPreamble,
      fallbackPreamble = boundary.fallbackPreamble;
    if (null === preamble || null === fallbackPreamble) return false;
    switch (boundary.status) {
      case 1:
        hoistPreambleState(request.renderState, preamble);
        request.byteSize += boundary.byteSize;
        segment = boundary.completedSegments[0];
        if (!segment)
          throw Error(
            "A previously unvisited boundary must have exactly one root segment. This is a bug in React.",
          );
        return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
      case 5:
        if (null !== request.trackedPostpones) return true;
      case 4:
        if (1 === segment.status)
          return (
            hoistPreambleState(request.renderState, fallbackPreamble),
            preparePreambleFromSubtree(request, segment, collectedPreambleSegments)
          );
      default:
        return true;
    }
  }
  function preparePreamble(request) {
    if (request.completedRootSegment && null === request.completedPreambleSegments) {
      var collectedPreambleSegments = [],
        originalRequestByteSize = request.byteSize,
        hasPendingPreambles = preparePreambleFromSegment(
          request,
          request.completedRootSegment,
          collectedPreambleSegments,
        ),
        preamble = request.renderState.preamble;
      false === hasPendingPreambles || (preamble.headChunks && preamble.bodyChunks)
        ? (request.completedPreambleSegments = collectedPreambleSegments)
        : (request.byteSize = originalRequestByteSize);
    }
  }
  function flushSubtree(request, destination, segment, hoistableState) {
    segment.parentFlushed = true;
    switch (segment.status) {
      case 0:
        segment.id = request.nextSegmentId++;
      case 5:
        return (
          (hoistableState = segment.id),
          (segment.lastPushedText = false),
          (segment.textEmbedded = false),
          (request = request.renderState),
          writeChunk(destination, placeholder1),
          writeChunk(destination, request.placeholderPrefix),
          (request = hoistableState.toString(16)),
          writeChunk(destination, request),
          writeChunkAndReturn(destination, placeholder2)
        );
      case 1:
        segment.status = 2;
        var r = true,
          chunks = segment.chunks,
          chunkIdx = 0;
        segment = segment.children;
        for (var childIdx = 0; childIdx < segment.length; childIdx++) {
          for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
            writeChunk(destination, chunks[chunkIdx]);
          r = flushSegment(request, destination, r, hoistableState);
        }
        for (; chunkIdx < chunks.length - 1; chunkIdx++) writeChunk(destination, chunks[chunkIdx]);
        chunkIdx < chunks.length && (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
        return r;
      case 3:
        return true;
      default:
        throw Error(
          "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.",
        );
    }
  }
  var flushedByteSize = 0;
  function flushSegment(request, destination, segment, hoistableState) {
    var boundary = segment.boundary;
    if (null === boundary) return flushSubtree(request, destination, segment, hoistableState);
    boundary.parentFlushed = true;
    if (4 === boundary.status) {
      var row = boundary.row;
      null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
      boundary = boundary.errorDigest;
      writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
      writeChunk(destination, clientRenderedSuspenseBoundaryError1);
      boundary &&
        (writeChunk(destination, clientRenderedSuspenseBoundaryError1A),
        writeChunk(destination, escapeTextForBrowser(boundary)),
        writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial));
      writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
      flushSubtree(request, destination, segment, hoistableState);
    } else if (1 !== boundary.status)
      (0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++),
        0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary),
        writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID),
        hoistableState && hoistHoistables(hoistableState, boundary.fallbackState),
        flushSubtree(request, destination, segment, hoistableState));
    else if (
      !flushingPartialBoundaries &&
      isEligibleForOutlining(request, boundary) &&
      (flushedByteSize + boundary.byteSize > request.progressiveChunkSize ||
        hasSuspenseyContent(boundary.contentState))
    )
      ((boundary.rootSegmentID = request.nextSegmentId++),
        request.completedBoundaries.push(boundary),
        writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID),
        flushSubtree(request, destination, segment, hoistableState));
    else {
      flushedByteSize += boundary.byteSize;
      hoistableState && hoistHoistables(hoistableState, boundary.contentState);
      segment = boundary.row;
      null !== segment &&
        isEligibleForOutlining(request, boundary) &&
        0 === --segment.pendingTasks &&
        finishSuspenseListRow(request, segment);
      writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
      segment = boundary.completedSegments;
      if (1 !== segment.length)
        throw Error(
          "A previously unvisited boundary must have exactly one root segment. This is a bug in React.",
        );
      flushSegment(request, destination, segment[0], hoistableState);
    }
    return writeChunkAndReturn(destination, endSuspenseBoundary);
  }
  function flushSegmentContainer(request, destination, segment, hoistableState) {
    writeStartSegment(destination, request.renderState, segment.parentFormatContext, segment.id);
    flushSegment(request, destination, segment, hoistableState);
    return writeEndSegment(destination, segment.parentFormatContext);
  }
  function flushCompletedBoundary(request, destination, boundary) {
    flushedByteSize = boundary.byteSize;
    for (
      var completedSegments = boundary.completedSegments, i = 0;
      i < completedSegments.length;
      i++
    )
      flushPartiallyCompletedSegment(request, destination, boundary, completedSegments[i]);
    completedSegments.length = 0;
    completedSegments = boundary.row;
    null !== completedSegments &&
      isEligibleForOutlining(request, boundary) &&
      0 === --completedSegments.pendingTasks &&
      finishSuspenseListRow(request, completedSegments);
    writeHoistablesForBoundary(destination, boundary.contentState, request.renderState);
    completedSegments = request.resumableState;
    request = request.renderState;
    i = boundary.rootSegmentID;
    boundary = boundary.contentState;
    var requiresStyleInsertion = request.stylesToHoist;
    request.stylesToHoist = false;
    writeChunk(destination, request.startInlineScript);
    writeChunk(destination, endOfStartTag);
    requiresStyleInsertion
      ? (0 === (completedSegments.instructions & 4) &&
          ((completedSegments.instructions |= 4),
          writeChunk(destination, clientRenderScriptFunctionOnly)),
        0 === (completedSegments.instructions & 2) &&
          ((completedSegments.instructions |= 2),
          writeChunk(destination, completeBoundaryScriptFunctionOnly)),
        0 === (completedSegments.instructions & 8)
          ? ((completedSegments.instructions |= 8),
            writeChunk(destination, completeBoundaryWithStylesScript1FullPartial))
          : writeChunk(destination, completeBoundaryWithStylesScript1Partial))
      : (0 === (completedSegments.instructions & 2) &&
          ((completedSegments.instructions |= 2),
          writeChunk(destination, completeBoundaryScriptFunctionOnly)),
        writeChunk(destination, completeBoundaryScript1Partial));
    completedSegments = i.toString(16);
    writeChunk(destination, request.boundaryPrefix);
    writeChunk(destination, completedSegments);
    writeChunk(destination, completeBoundaryScript2);
    writeChunk(destination, request.segmentPrefix);
    writeChunk(destination, completedSegments);
    requiresStyleInsertion
      ? (writeChunk(destination, completeBoundaryScript3a),
        writeStyleResourceDependenciesInJS(destination, boundary))
      : writeChunk(destination, completeBoundaryScript3b);
    boundary = writeChunkAndReturn(destination, completeBoundaryScriptEnd);
    return writeBootstrap(destination, request) && boundary;
  }
  function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
    if (2 === segment.status) return true;
    var hoistableState = boundary.contentState,
      segmentID = segment.id;
    if (-1 === segmentID) {
      if (-1 === (segment.id = boundary.rootSegmentID))
        throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
      return flushSegmentContainer(request, destination, segment, hoistableState);
    }
    if (segmentID === boundary.rootSegmentID)
      return flushSegmentContainer(request, destination, segment, hoistableState);
    flushSegmentContainer(request, destination, segment, hoistableState);
    boundary = request.resumableState;
    request = request.renderState;
    writeChunk(destination, request.startInlineScript);
    writeChunk(destination, endOfStartTag);
    0 === (boundary.instructions & 1)
      ? ((boundary.instructions |= 1), writeChunk(destination, completeSegmentScript1Full))
      : writeChunk(destination, completeSegmentScript1Partial);
    writeChunk(destination, request.segmentPrefix);
    segmentID = segmentID.toString(16);
    writeChunk(destination, segmentID);
    writeChunk(destination, completeSegmentScript2);
    writeChunk(destination, request.placeholderPrefix);
    writeChunk(destination, segmentID);
    destination = writeChunkAndReturn(destination, completeSegmentScriptEnd);
    return destination;
  }
  var flushingPartialBoundaries = false;
  function flushCompletedQueues(request, destination) {
    currentView = new Uint8Array(2048);
    writtenBytes = 0;
    destinationHasCapacity$1 = true;
    try {
      if (!(0 < request.pendingRootTasks)) {
        var i,
          completedRootSegment = request.completedRootSegment;
        if (null !== completedRootSegment) {
          if (5 === completedRootSegment.status) return;
          var completedPreambleSegments = request.completedPreambleSegments;
          if (null === completedPreambleSegments) return;
          flushedByteSize = request.byteSize;
          var resumableState = request.resumableState,
            renderState = request.renderState,
            preamble = renderState.preamble,
            htmlChunks = preamble.htmlChunks,
            headChunks = preamble.headChunks,
            i$jscomp$0;
          if (htmlChunks) {
            for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
              writeChunk(destination, htmlChunks[i$jscomp$0]);
            if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                writeChunk(destination, headChunks[i$jscomp$0]);
            else
              (writeChunk(destination, startChunkForTag("head")),
                writeChunk(destination, endOfStartTag));
          } else if (headChunks)
            for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
              writeChunk(destination, headChunks[i$jscomp$0]);
          var charsetChunks = renderState.charsetChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
            writeChunk(destination, charsetChunks[i$jscomp$0]);
          charsetChunks.length = 0;
          renderState.preconnects.forEach(flushResource, destination);
          renderState.preconnects.clear();
          var viewportChunks = renderState.viewportChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
            writeChunk(destination, viewportChunks[i$jscomp$0]);
          viewportChunks.length = 0;
          renderState.fontPreloads.forEach(flushResource, destination);
          renderState.fontPreloads.clear();
          renderState.highImagePreloads.forEach(flushResource, destination);
          renderState.highImagePreloads.clear();
          currentlyFlushingRenderState = renderState;
          renderState.styles.forEach(flushStylesInPreamble, destination);
          currentlyFlushingRenderState = null;
          var importMapChunks = renderState.importMapChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
            writeChunk(destination, importMapChunks[i$jscomp$0]);
          importMapChunks.length = 0;
          renderState.bootstrapScripts.forEach(flushResource, destination);
          renderState.scripts.forEach(flushResource, destination);
          renderState.scripts.clear();
          renderState.bulkPreloads.forEach(flushResource, destination);
          renderState.bulkPreloads.clear();
          htmlChunks || headChunks || (resumableState.instructions |= 32);
          var hoistableChunks = renderState.hoistableChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
            writeChunk(destination, hoistableChunks[i$jscomp$0]);
          for (
            resumableState = hoistableChunks.length = 0;
            resumableState < completedPreambleSegments.length;
            resumableState++
          ) {
            var segments = completedPreambleSegments[resumableState];
            for (renderState = 0; renderState < segments.length; renderState++)
              flushSegment(request, destination, segments[renderState], null);
          }
          var preamble$jscomp$0 = request.renderState.preamble,
            headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
          (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) &&
            writeChunk(destination, endChunkForTag("head"));
          var bodyChunks = preamble$jscomp$0.bodyChunks;
          if (bodyChunks)
            for (
              completedPreambleSegments = 0;
              completedPreambleSegments < bodyChunks.length;
              completedPreambleSegments++
            )
              writeChunk(destination, bodyChunks[completedPreambleSegments]);
          flushSegment(request, destination, completedRootSegment, null);
          request.completedRootSegment = null;
          var renderState$jscomp$0 = request.renderState;
          if (
            0 !== request.allPendingTasks ||
            0 !== request.clientRenderedBoundaries.length ||
            0 !== request.completedBoundaries.length ||
            (null !== request.trackedPostpones &&
              (0 !== request.trackedPostpones.rootNodes.length ||
                null !== request.trackedPostpones.rootSlots))
          ) {
            var resumableState$jscomp$0 = request.resumableState;
            if (0 === (resumableState$jscomp$0.instructions & 64)) {
              resumableState$jscomp$0.instructions |= 64;
              writeChunk(destination, renderState$jscomp$0.startInlineScript);
              if (0 === (resumableState$jscomp$0.instructions & 32)) {
                resumableState$jscomp$0.instructions |= 32;
                var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                writeChunk(destination, completedShellIdAttributeStart);
                writeChunk(destination, escapeTextForBrowser(shellId));
                writeChunk(destination, attributeEnd);
              }
              writeChunk(destination, endOfStartTag);
              writeChunk(destination, shellTimeRuntimeScript);
              writeChunkAndReturn(destination, endInlineScript);
            }
          }
          writeBootstrap(destination, renderState$jscomp$0);
        }
        var renderState$jscomp$1 = request.renderState;
        completedRootSegment = 0;
        var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
        for (
          completedRootSegment = 0;
          completedRootSegment < viewportChunks$jscomp$0.length;
          completedRootSegment++
        )
          writeChunk(destination, viewportChunks$jscomp$0[completedRootSegment]);
        viewportChunks$jscomp$0.length = 0;
        renderState$jscomp$1.preconnects.forEach(flushResource, destination);
        renderState$jscomp$1.preconnects.clear();
        renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.fontPreloads.clear();
        renderState$jscomp$1.highImagePreloads.forEach(flushResource, destination);
        renderState$jscomp$1.highImagePreloads.clear();
        renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
        renderState$jscomp$1.scripts.forEach(flushResource, destination);
        renderState$jscomp$1.scripts.clear();
        renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.bulkPreloads.clear();
        var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
        for (
          completedRootSegment = 0;
          completedRootSegment < hoistableChunks$jscomp$0.length;
          completedRootSegment++
        )
          writeChunk(destination, hoistableChunks$jscomp$0[completedRootSegment]);
        hoistableChunks$jscomp$0.length = 0;
        var clientRenderedBoundaries = request.clientRenderedBoundaries;
        for (i = 0; i < clientRenderedBoundaries.length; i++) {
          var boundary = clientRenderedBoundaries[i];
          renderState$jscomp$1 = destination;
          var resumableState$jscomp$1 = request.resumableState,
            renderState$jscomp$2 = request.renderState,
            id = boundary.rootSegmentID,
            errorDigest = boundary.errorDigest;
          writeChunk(renderState$jscomp$1, renderState$jscomp$2.startInlineScript);
          writeChunk(renderState$jscomp$1, endOfStartTag);
          0 === (resumableState$jscomp$1.instructions & 4)
            ? ((resumableState$jscomp$1.instructions |= 4),
              writeChunk(renderState$jscomp$1, clientRenderScript1Full))
            : writeChunk(renderState$jscomp$1, clientRenderScript1Partial);
          writeChunk(renderState$jscomp$1, renderState$jscomp$2.boundaryPrefix);
          writeChunk(renderState$jscomp$1, id.toString(16));
          writeChunk(renderState$jscomp$1, clientRenderScript1A);
          errorDigest &&
            (writeChunk(renderState$jscomp$1, clientRenderErrorScriptArgInterstitial),
            writeChunk(
              renderState$jscomp$1,
              escapeJSStringsForInstructionScripts(errorDigest || ""),
            ));
          var JSCompiler_inline_result = writeChunkAndReturn(
            renderState$jscomp$1,
            clientRenderScriptEnd,
          );
          if (!JSCompiler_inline_result) {
            request.destination = null;
            i++;
            clientRenderedBoundaries.splice(0, i);
            return;
          }
        }
        clientRenderedBoundaries.splice(0, i);
        var completedBoundaries = request.completedBoundaries;
        for (i = 0; i < completedBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
            request.destination = null;
            i++;
            completedBoundaries.splice(0, i);
            return;
          }
        completedBoundaries.splice(0, i);
        completeWriting(destination);
        currentView = new Uint8Array(2048);
        writtenBytes = 0;
        flushingPartialBoundaries = destinationHasCapacity$1 = true;
        var partialBoundaries = request.partialBoundaries;
        for (i = 0; i < partialBoundaries.length; i++) {
          var boundary$70 = partialBoundaries[i];
          a: {
            clientRenderedBoundaries = request;
            boundary = destination;
            flushedByteSize = boundary$70.byteSize;
            var completedSegments = boundary$70.completedSegments;
            for (
              JSCompiler_inline_result = 0;
              JSCompiler_inline_result < completedSegments.length;
              JSCompiler_inline_result++
            )
              if (
                !flushPartiallyCompletedSegment(
                  clientRenderedBoundaries,
                  boundary,
                  boundary$70,
                  completedSegments[JSCompiler_inline_result],
                )
              ) {
                JSCompiler_inline_result++;
                completedSegments.splice(0, JSCompiler_inline_result);
                var JSCompiler_inline_result$jscomp$0 = false;
                break a;
              }
            completedSegments.splice(0, JSCompiler_inline_result);
            var row = boundary$70.row;
            null !== row &&
              row.together &&
              1 === boundary$70.pendingTasks &&
              (1 === row.pendingTasks
                ? unblockSuspenseListRow(clientRenderedBoundaries, row, row.hoistables)
                : row.pendingTasks--);
            JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
              boundary,
              boundary$70.contentState,
              clientRenderedBoundaries.renderState,
            );
          }
          if (!JSCompiler_inline_result$jscomp$0) {
            request.destination = null;
            i++;
            partialBoundaries.splice(0, i);
            return;
          }
        }
        partialBoundaries.splice(0, i);
        flushingPartialBoundaries = false;
        var largeBoundaries = request.completedBoundaries;
        for (i = 0; i < largeBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
            request.destination = null;
            i++;
            largeBoundaries.splice(0, i);
            return;
          }
        largeBoundaries.splice(0, i);
      }
    } finally {
      ((flushingPartialBoundaries = false),
        0 === request.allPendingTasks &&
        0 === request.clientRenderedBoundaries.length &&
        0 === request.completedBoundaries.length
          ? ((request.flushScheduled = false),
            (i = request.resumableState),
            i.hasBody && writeChunk(destination, endChunkForTag("body")),
            i.hasHtml && writeChunk(destination, endChunkForTag("html")),
            completeWriting(destination),
            flushBuffered(destination),
            (request.status = 14),
            destination.end(),
            (request.destination = null))
          : (completeWriting(destination), flushBuffered(destination)));
    }
  }
  function startWork(request) {
    request.flushScheduled = null !== request.destination;
    scheduleMicrotask(function () {
      return requestStorage.run(request, performWork, request);
    });
    setImmediate(function () {
      10 === request.status && (request.status = 11);
      null === request.trackedPostpones &&
        requestStorage.run(request, enqueueEarlyPreloadsAfterInitialWork, request);
    });
  }
  function enqueueEarlyPreloadsAfterInitialWork(request) {
    safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
  }
  function enqueueFlush(request) {
    false === request.flushScheduled &&
      0 === request.pingedTasks.length &&
      null !== request.destination &&
      ((request.flushScheduled = true),
      setImmediate(function () {
        var destination = request.destination;
        destination ? flushCompletedQueues(request, destination) : (request.flushScheduled = false);
      }));
  }
  function startFlowing(request, destination) {
    if (13 === request.status) ((request.status = 14), destination.destroy(request.fatalError));
    else if (14 !== request.status && null === request.destination) {
      request.destination = destination;
      try {
        flushCompletedQueues(request, destination);
      } catch (error) {
        (logRecoverableError(request, error, {}), fatalError(request, error));
      }
    }
  }
  function abort(request, reason) {
    if (11 === request.status || 10 === request.status) request.status = 12;
    try {
      var abortableTasks = request.abortableTasks;
      if (0 < abortableTasks.size) {
        var error =
          void 0 === reason
            ? Error("The render was aborted by the server without a reason.")
            : "object" === typeof reason && null !== reason && "function" === typeof reason.then
              ? Error("The render was aborted by the server with a promise.")
              : reason;
        request.fatalError = error;
        abortableTasks.forEach(function (task) {
          return abortTask(task, request, error);
        });
        abortableTasks.clear();
      }
      null !== request.destination && flushCompletedQueues(request, request.destination);
    } catch (error$72) {
      (logRecoverableError(request, error$72, {}), fatalError(request, error$72));
    }
  }
  function addToReplayParent(node, parentKeyPath, trackedPostpones) {
    if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
    else {
      var workingMap = trackedPostpones.workingMap,
        parentNode = workingMap.get(parentKeyPath);
      void 0 === parentNode &&
        ((parentNode = [parentKeyPath[1], parentKeyPath[2], [], null]),
        workingMap.set(parentKeyPath, parentNode),
        addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
      parentNode[2].push(node);
    }
  }
  function getPostponedState(request) {
    var trackedPostpones = request.trackedPostpones;
    if (
      null === trackedPostpones ||
      (0 === trackedPostpones.rootNodes.length && null === trackedPostpones.rootSlots)
    )
      return (request.trackedPostpones = null);
    if (
      null === request.completedRootSegment ||
      (5 !== request.completedRootSegment.status && null !== request.completedPreambleSegments)
    ) {
      var nextSegmentId = request.nextSegmentId;
      var replaySlots = trackedPostpones.rootSlots;
      var resumableState = request.resumableState;
      resumableState.bootstrapScriptContent = void 0;
      resumableState.bootstrapScripts = void 0;
      resumableState.bootstrapModules = void 0;
    } else {
      nextSegmentId = 0;
      replaySlots = -1;
      resumableState = request.resumableState;
      var renderState = request.renderState;
      resumableState.nextFormID = 0;
      resumableState.hasBody = false;
      resumableState.hasHtml = false;
      resumableState.unknownResources = { font: renderState.resets.font };
      resumableState.dnsResources = renderState.resets.dns;
      resumableState.connectResources = renderState.resets.connect;
      resumableState.imageResources = renderState.resets.image;
      resumableState.styleResources = renderState.resets.style;
      resumableState.scriptResources = {};
      resumableState.moduleUnknownResources = {};
      resumableState.moduleScriptResources = {};
      resumableState.instructions = 0;
    }
    return {
      nextSegmentId,
      rootFormatContext: request.rootFormatContext,
      progressiveChunkSize: request.progressiveChunkSize,
      resumableState: request.resumableState,
      replayNodes: trackedPostpones.rootNodes,
      replaySlots,
    };
  }
  function ensureCorrectIsomorphicReactVersion() {
    var isomorphicReactPackageVersion = React2.version;
    if ("19.2.3" !== isomorphicReactPackageVersion)
      throw Error(
        'Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:\n  - react:      ' +
          (isomorphicReactPackageVersion +
            "\n  - react-dom:  19.2.3\nLearn more: https://react.dev/warnings/version-mismatch"),
      );
  }
  ensureCorrectIsomorphicReactVersion();
  function createDrainHandler(destination, request) {
    return function () {
      return startFlowing(request, destination);
    };
  }
  function createCancelHandler(request, reason) {
    return function () {
      request.destination = null;
      abort(request, Error(reason));
    };
  }
  function createRequestImpl(children, options) {
    var resumableState = createResumableState(
      options ? options.identifierPrefix : void 0,
      options ? options.unstable_externalRuntimeSrc : void 0,
      options ? options.bootstrapScriptContent : void 0,
      options ? options.bootstrapScripts : void 0,
      options ? options.bootstrapModules : void 0,
    );
    return createRequest(
      children,
      resumableState,
      createRenderState(
        resumableState,
        options ? options.nonce : void 0,
        options ? options.unstable_externalRuntimeSrc : void 0,
        options ? options.importMap : void 0,
        options ? options.onHeaders : void 0,
        options ? options.maxHeadersLength : void 0,
      ),
      createRootFormatContext(options ? options.namespaceURI : void 0),
      options ? options.progressiveChunkSize : void 0,
      options ? options.onError : void 0,
      options ? options.onAllReady : void 0,
      options ? options.onShellReady : void 0,
      options ? options.onShellError : void 0,
      void 0,
      options ? options.onPostpone : void 0,
      options ? options.formState : void 0,
    );
  }
  function createFakeWritableFromReadableStreamController$1(controller) {
    return {
      write: function (chunk) {
        "string" === typeof chunk && (chunk = textEncoder2.encode(chunk));
        controller.enqueue(chunk);
        return true;
      },
      end: function () {
        controller.close();
      },
      destroy: function (error) {
        "function" === typeof controller.error ? controller.error(error) : controller.close();
      },
    };
  }
  function resumeRequestImpl(children, postponedState, options) {
    return resumeRequest(
      children,
      postponedState,
      createRenderState(
        postponedState.resumableState,
        options ? options.nonce : void 0,
        void 0,
        void 0,
        void 0,
        void 0,
      ),
      options ? options.onError : void 0,
      options ? options.onAllReady : void 0,
      options ? options.onShellReady : void 0,
      options ? options.onShellError : void 0,
      void 0,
      options ? options.onPostpone : void 0,
    );
  }
  ensureCorrectIsomorphicReactVersion();
  function createFakeWritableFromReadableStreamController(controller) {
    return {
      write: function (chunk) {
        "string" === typeof chunk && (chunk = textEncoder2.encode(chunk));
        controller.enqueue(chunk);
        return true;
      },
      end: function () {
        controller.close();
      },
      destroy: function (error) {
        "function" === typeof controller.error ? controller.error(error) : controller.close();
      },
    };
  }
  function createFakeWritableFromReadable(readable) {
    return {
      write: function (chunk) {
        return readable.push(chunk);
      },
      end: function () {
        readable.push(null);
      },
      destroy: function (error) {
        readable.destroy(error);
      },
    };
  }
  reactDomServer_node_production.prerender = function (children, options) {
    return new Promise(function (resolve, reject) {
      var onHeaders = options ? options.onHeaders : void 0,
        onHeadersImpl;
      onHeaders &&
        (onHeadersImpl = function (headersDescriptor) {
          onHeaders(new Headers(headersDescriptor));
        });
      var resources = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0,
        ),
        request = createPrerenderRequest(
          children,
          resources,
          createRenderState(
            resources,
            void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            onHeadersImpl,
            options ? options.maxHeadersLength : void 0,
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          function () {
            var writable,
              stream2 = new ReadableStream(
                {
                  type: "bytes",
                  start: function (controller) {
                    writable = createFakeWritableFromReadableStreamController(controller);
                  },
                  pull: function () {
                    startFlowing(request, writable);
                  },
                  cancel: function (reason) {
                    request.destination = null;
                    abort(request, reason);
                  },
                },
                { highWaterMark: 0 },
              );
            stream2 = { postponed: getPostponedState(request), prelude: stream2 };
            resolve(stream2);
          },
          void 0,
          void 0,
          reject,
          options ? options.onPostpone : void 0,
        );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function () {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_node_production.prerenderToNodeStream = function (children, options) {
    return new Promise(function (resolve, reject) {
      var resumableState = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0,
        ),
        request = createPrerenderRequest(
          children,
          resumableState,
          createRenderState(
            resumableState,
            void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            options ? options.onHeaders : void 0,
            options ? options.maxHeadersLength : void 0,
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          function () {
            var readable = new stream.Readable({
                read: function () {
                  startFlowing(request, writable);
                },
              }),
              writable = createFakeWritableFromReadable(readable);
            readable = {
              postponed: getPostponedState(request),
              prelude: readable,
            };
            resolve(readable);
          },
          void 0,
          void 0,
          reject,
          options ? options.onPostpone : void 0,
        );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function () {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_node_production.renderToPipeableStream = function (children, options) {
    var request = createRequestImpl(children, options),
      hasStartedFlowing = false;
    startWork(request);
    return {
      pipe: function (destination) {
        if (hasStartedFlowing)
          throw Error("React currently only supports piping to one writable stream.");
        hasStartedFlowing = true;
        safelyEmitEarlyPreloads(
          request,
          null === request.trackedPostpones
            ? 0 === request.pendingRootTasks
            : null === request.completedRootSegment
              ? 0 === request.pendingRootTasks
              : 5 !== request.completedRootSegment.status,
        );
        startFlowing(request, destination);
        destination.on("drain", createDrainHandler(destination, request));
        destination.on(
          "error",
          createCancelHandler(request, "The destination stream errored while writing data."),
        );
        destination.on(
          "close",
          createCancelHandler(request, "The destination stream closed early."),
        );
        return destination;
      },
      abort: function (reason) {
        abort(request, reason);
      },
    };
  };
  reactDomServer_node_production.renderToReadableStream = function (children, options) {
    return new Promise(function (resolve, reject) {
      var onFatalError,
        onAllReady,
        allReady = new Promise(function (res, rej) {
          onAllReady = res;
          onFatalError = rej;
        }),
        onHeaders = options ? options.onHeaders : void 0,
        onHeadersImpl;
      onHeaders &&
        (onHeadersImpl = function (headersDescriptor) {
          onHeaders(new Headers(headersDescriptor));
        });
      var resumableState = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0,
        ),
        request = createRequest(
          children,
          resumableState,
          createRenderState(
            resumableState,
            options ? options.nonce : void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            onHeadersImpl,
            options ? options.maxHeadersLength : void 0,
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          onAllReady,
          function () {
            var writable,
              stream2 = new ReadableStream(
                {
                  type: "bytes",
                  start: function (controller) {
                    writable = createFakeWritableFromReadableStreamController$1(controller);
                  },
                  pull: function () {
                    startFlowing(request, writable);
                  },
                  cancel: function (reason) {
                    request.destination = null;
                    abort(request, reason);
                  },
                },
                { highWaterMark: 0 },
              );
            stream2.allReady = allReady;
            resolve(stream2);
          },
          function (error) {
            allReady.catch(function () {});
            reject(error);
          },
          onFatalError,
          options ? options.onPostpone : void 0,
          options ? options.formState : void 0,
        );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function () {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_node_production.resume = function (children, postponedState, options) {
    return new Promise(function (resolve, reject) {
      var onFatalError,
        onAllReady,
        allReady = new Promise(function (res, rej) {
          onAllReady = res;
          onFatalError = rej;
        }),
        request = resumeRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            options ? options.nonce : void 0,
            void 0,
            void 0,
            void 0,
            void 0,
          ),
          options ? options.onError : void 0,
          onAllReady,
          function () {
            var writable,
              stream2 = new ReadableStream(
                {
                  type: "bytes",
                  start: function (controller) {
                    writable = createFakeWritableFromReadableStreamController$1(controller);
                  },
                  pull: function () {
                    startFlowing(request, writable);
                  },
                  cancel: function (reason) {
                    request.destination = null;
                    abort(request, reason);
                  },
                },
                { highWaterMark: 0 },
              );
            stream2.allReady = allReady;
            resolve(stream2);
          },
          function (error) {
            allReady.catch(function () {});
            reject(error);
          },
          onFatalError,
          options ? options.onPostpone : void 0,
        );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function () {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_node_production.resumeAndPrerender = function (children, postponedState, options) {
    return new Promise(function (resolve, reject) {
      var request = resumeAndPrerenderRequest(
        children,
        postponedState,
        createRenderState(postponedState.resumableState, void 0, void 0, void 0, void 0, void 0),
        options ? options.onError : void 0,
        function () {
          var writable,
            stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function (controller) {
                  writable = createFakeWritableFromReadableStreamController(controller);
                },
                pull: function () {
                  startFlowing(request, writable);
                },
                cancel: function (reason) {
                  request.destination = null;
                  abort(request, reason);
                },
              },
              { highWaterMark: 0 },
            );
          stream2 = { postponed: getPostponedState(request), prelude: stream2 };
          resolve(stream2);
        },
        void 0,
        void 0,
        reject,
        options ? options.onPostpone : void 0,
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function () {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_node_production.resumeAndPrerenderToNodeStream = function (
    children,
    postponedState,
    options,
  ) {
    return new Promise(function (resolve, reject) {
      var request = resumeAndPrerenderRequest(
        children,
        postponedState,
        createRenderState(postponedState.resumableState, void 0, void 0, void 0, void 0, void 0),
        options ? options.onError : void 0,
        function () {
          var readable = new stream.Readable({
              read: function () {
                startFlowing(request, writable);
              },
            }),
            writable = createFakeWritableFromReadable(readable);
          readable = { postponed: getPostponedState(request), prelude: readable };
          resolve(readable);
        },
        void 0,
        void 0,
        reject,
        options ? options.onPostpone : void 0,
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function () {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_node_production.resumeToPipeableStream = function (
    children,
    postponedState,
    options,
  ) {
    var request = resumeRequestImpl(children, postponedState, options),
      hasStartedFlowing = false;
    startWork(request);
    return {
      pipe: function (destination) {
        if (hasStartedFlowing)
          throw Error("React currently only supports piping to one writable stream.");
        hasStartedFlowing = true;
        startFlowing(request, destination);
        destination.on("drain", createDrainHandler(destination, request));
        destination.on(
          "error",
          createCancelHandler(request, "The destination stream errored while writing data."),
        );
        destination.on(
          "close",
          createCancelHandler(request, "The destination stream closed early."),
        );
        return destination;
      },
      abort: function (reason) {
        abort(request, reason);
      },
    };
  };
  reactDomServer_node_production.version = "19.2.3";
  return reactDomServer_node_production;
}
var hasRequiredServer_node;
function requireServer_node() {
  if (hasRequiredServer_node) return server_node;
  hasRequiredServer_node = 1;
  var l, s;
  {
    l = requireReactDomServerLegacy_node_production();
    s = requireReactDomServer_node_production();
  }
  server_node.version = l.version;
  server_node.renderToString = l.renderToString;
  server_node.renderToStaticMarkup = l.renderToStaticMarkup;
  server_node.renderToPipeableStream = s.renderToPipeableStream;
  server_node.renderToReadableStream = s.renderToReadableStream;
  server_node.resumeToPipeableStream = s.resumeToPipeableStream;
  server_node.resume = s.resume;
  return server_node;
}
var server_nodeExports = requireServer_node();
const ReactDOMServer = /* @__PURE__ */ getDefaultExportFromCjs(server_nodeExports);
var fullPattern =
  " daum[ /]| deusu/|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|(?<!cam)scan|24x7|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\b\\w+\\.ai|\\bmanus-user/|\\bperl\\b|\\btime/|\\||^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\W|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^apache/|^avsdevicesdk/|^azure|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|advisor|agent\\b|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|exaleadcloudview|feed|fetcher|firephp|functionize|grab|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|infrawatch|insight|inspect|iplabel|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node\\b|nutch|offbyone|onetrust|optimize|pageburst|pagespeed|parser|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|retriever|rexx;|rigor|rss\\b|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|xtate/";
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  try {
    pattern = new RegExp(fullPattern, "i");
  } catch (error) {
    pattern = naivePattern;
  }
  return pattern;
}
function isbot(userAgent) {
  return Boolean(userAgent) && getPattern().test(userAgent);
}
const renderRouterToStream = async ({ request, router, responseHeaders, children }) => {
  var _a2, _b2;
  if (typeof ReactDOMServer.renderToReadableStream === "function") {
    const stream = await ReactDOMServer.renderToReadableStream(children, {
      signal: request.signal,
      nonce: (_a2 = router.options.ssr) == null ? void 0 : _a2.nonce,
      progressiveChunkSize: Number.POSITIVE_INFINITY,
    });
    if (isbot(request.headers.get("User-Agent"))) {
      await stream.allReady;
    }
    const responseStream = transformReadableStreamWithRouter(router, stream);
    return new Response(responseStream, {
      status: router.state.statusCode,
      headers: responseHeaders,
    });
  }
  if (typeof ReactDOMServer.renderToPipeableStream === "function") {
    const reactAppPassthrough = new PassThrough();
    try {
      const pipeable = ReactDOMServer.renderToPipeableStream(children, {
        nonce: (_b2 = router.options.ssr) == null ? void 0 : _b2.nonce,
        progressiveChunkSize: Number.POSITIVE_INFINITY,
        ...(isbot(request.headers.get("User-Agent"))
          ? {
              onAllReady() {
                pipeable.pipe(reactAppPassthrough);
              },
            }
          : {
              onShellReady() {
                pipeable.pipe(reactAppPassthrough);
              },
            }),
        onError: (error, info) => {
          console.error("Error in renderToPipeableStream:", error, info);
          if (!reactAppPassthrough.destroyed) {
            reactAppPassthrough.destroy(error instanceof Error ? error : new Error(String(error)));
          }
        },
      });
    } catch (e) {
      console.error("Error in renderToPipeableStream:", e);
      reactAppPassthrough.destroy(e instanceof Error ? e : new Error(String(e)));
    }
    const responseStream = transformPipeableStreamWithRouter(router, reactAppPassthrough);
    return new Response(responseStream, {
      status: router.state.statusCode,
      headers: responseHeaders,
    });
  }
  throw new Error(
    "No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.",
  );
};
const defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) =>
  renderRouterToStream({
    request,
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(StartServer, { router }),
  }),
);
const TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
const TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
const X_TSS_SERIALIZED = "x-tss-serialized";
const X_TSS_RAW_RESPONSE = "x-tss-raw";
const TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
const FrameType = {
  /** Seroval JSON chunk (NDJSON line) */
  JSON: 0,
  /** Raw stream data chunk */
  CHUNK: 1,
  /** Raw stream end (EOF) */
  END: 2,
  /** Raw stream error */
  ERROR: 3,
};
const FRAME_HEADER_SIZE = 9;
const TSS_FRAMED_PROTOCOL_VERSION = 1;
const TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=${TSS_FRAMED_PROTOCOL_VERSION}`;
const GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
const globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_STORAGE_KEY]) {
  globalObj$1[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
}
const startStorage = globalObj$1[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn2) {
  return startStorage.run(context, fn2);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && (opts == null ? void 0 : opts.throwIfNotFound) !== false) {
    throw new Error(
      `No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`,
    );
  }
  return context;
}
const getStartOptions = () => getStartContext().startOptions;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) {
      if (isSafeKey(key)) result[key] = target[key];
    }
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) {
      if (isSafeKey(key)) result[key] = source[key];
    }
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) {
    if (isSafeKey(key)) obj[key] = source[key];
  }
  return obj;
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) {
      throw new Error(
        `Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`,
      );
    }
    middleware.forEach((m2) => {
      if (m2.options.middleware) {
        recurse(m2.options.middleware, depth + 1);
      }
      if (!seen.has(m2)) {
        seen.add(m2);
        flattened.push(m2);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
function getDefaultSerovalPlugins() {
  const start = getStartOptions();
  const adapters = start == null ? void 0 : start.serializationAdapters;
  return [
    ...((adapters == null ? void 0 : adapters.map(makeSerovalPlugin)) ?? []),
    ...defaultSerovalPlugins,
  ];
}
const NullProtoObj = /* @__PURE__ */ (() => {
  const e = function () {};
  return ((e.prototype = /* @__PURE__ */ Object.create(null)), Object.freeze(e.prototype), e);
})();
function lazyInherit(target, source, sourceKey) {
  for (const key of [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source),
  ]) {
    if (key === "constructor") continue;
    const targetDesc = Object.getOwnPropertyDescriptor(target, key);
    const desc = Object.getOwnPropertyDescriptor(source, key);
    let modified = false;
    if (desc.get) {
      modified = true;
      desc.get =
        (targetDesc == null ? void 0 : targetDesc.get) ||
        function () {
          return this[sourceKey][key];
        };
    }
    if (desc.set) {
      modified = true;
      desc.set =
        (targetDesc == null ? void 0 : targetDesc.set) ||
        function (value) {
          this[sourceKey][key] = value;
        };
    }
    if (!(targetDesc == null ? void 0 : targetDesc.value) && typeof desc.value === "function") {
      modified = true;
      desc.value = function (...args) {
        return this[sourceKey][key](...args);
      };
    }
    if (modified) Object.defineProperty(target, key, desc);
  }
}
const FastURL = /* @__PURE__ */ (() => {
  var _url,
    _href,
    _protocol,
    _host,
    _pathname,
    _search,
    _searchParams,
    _pos,
    _URL_instances,
    getPos_fn,
    _a2;
  const NativeURL = globalThis.URL;
  const FastURL$1 =
    ((_a2 = class {
      constructor(url) {
        __privateAdd(this, _URL_instances);
        __privateAdd(this, _url);
        __privateAdd(this, _href);
        __privateAdd(this, _protocol);
        __privateAdd(this, _host);
        __privateAdd(this, _pathname);
        __privateAdd(this, _search);
        __privateAdd(this, _searchParams);
        __privateAdd(this, _pos);
        if (typeof url === "string") __privateSet(this, _href, url);
        else {
          __privateSet(this, _protocol, url.protocol);
          __privateSet(this, _host, url.host);
          __privateSet(this, _pathname, url.pathname);
          __privateSet(this, _search, url.search);
        }
      }
      static [Symbol.hasInstance](val) {
        return val instanceof NativeURL;
      }
      get _url() {
        if (__privateGet(this, _url)) return __privateGet(this, _url);
        __privateSet(this, _url, new NativeURL(this.href));
        __privateSet(this, _href, void 0);
        __privateSet(this, _protocol, void 0);
        __privateSet(this, _host, void 0);
        __privateSet(this, _pathname, void 0);
        __privateSet(this, _search, void 0);
        __privateSet(this, _searchParams, void 0);
        __privateSet(this, _pos, void 0);
        return __privateGet(this, _url);
      }
      get href() {
        if (__privateGet(this, _url)) return __privateGet(this, _url).href;
        if (!__privateGet(this, _href))
          __privateSet(
            this,
            _href,
            `${__privateGet(this, _protocol) || "http:"}//${__privateGet(this, _host) || "localhost"}${__privateGet(this, _pathname) || "/"}${__privateGet(this, _search) || ""}`,
          );
        return __privateGet(this, _href);
      }
      get pathname() {
        if (__privateGet(this, _url)) return __privateGet(this, _url).pathname;
        if (__privateGet(this, _pathname) === void 0) {
          const [, pathnameIndex, queryIndex] = __privateMethod(
            this,
            _URL_instances,
            getPos_fn,
          ).call(this);
          if (pathnameIndex === -1) return this._url.pathname;
          __privateSet(
            this,
            _pathname,
            this.href.slice(pathnameIndex, queryIndex === -1 ? void 0 : queryIndex),
          );
        }
        return __privateGet(this, _pathname);
      }
      get search() {
        if (__privateGet(this, _url)) return __privateGet(this, _url).search;
        if (__privateGet(this, _search) === void 0) {
          const [, pathnameIndex, queryIndex] = __privateMethod(
            this,
            _URL_instances,
            getPos_fn,
          ).call(this);
          if (pathnameIndex === -1) return this._url.search;
          const url = this.href;
          __privateSet(
            this,
            _search,
            queryIndex === -1 || queryIndex === url.length - 1 ? "" : url.slice(queryIndex),
          );
        }
        return __privateGet(this, _search);
      }
      get searchParams() {
        if (__privateGet(this, _url)) return __privateGet(this, _url).searchParams;
        if (!__privateGet(this, _searchParams))
          __privateSet(this, _searchParams, new URLSearchParams(this.search));
        return __privateGet(this, _searchParams);
      }
      get protocol() {
        if (__privateGet(this, _url)) return __privateGet(this, _url).protocol;
        if (__privateGet(this, _protocol) === void 0) {
          const [protocolIndex] = __privateMethod(this, _URL_instances, getPos_fn).call(this);
          if (protocolIndex === -1) return this._url.protocol;
          __privateSet(this, _protocol, this.href.slice(0, protocolIndex + 1));
        }
        return __privateGet(this, _protocol);
      }
      toString() {
        return this.href;
      }
      toJSON() {
        return this.href;
      }
    }),
    (_url = new WeakMap()),
    (_href = new WeakMap()),
    (_protocol = new WeakMap()),
    (_host = new WeakMap()),
    (_pathname = new WeakMap()),
    (_search = new WeakMap()),
    (_searchParams = new WeakMap()),
    (_pos = new WeakMap()),
    (_URL_instances = new WeakSet()),
    (getPos_fn = function () {
      if (!__privateGet(this, _pos)) {
        const url = this.href;
        const protoIndex = url.indexOf("://");
        const pathnameIndex = protoIndex === -1 ? -1 : url.indexOf("/", protoIndex + 4);
        __privateSet(this, _pos, [
          protoIndex,
          pathnameIndex,
          pathnameIndex === -1 ? -1 : url.indexOf("?", pathnameIndex),
        ]);
      }
      return __privateGet(this, _pos);
    }),
    _a2);
  lazyInherit(FastURL$1.prototype, NativeURL.prototype, "_url");
  Object.setPrototypeOf(FastURL$1.prototype, NativeURL.prototype);
  Object.setPrototypeOf(FastURL$1, NativeURL);
  return FastURL$1;
})();
const NodeResponse = /* @__PURE__ */ (() => {
  var _a2, _b2, _c, _body, _init2, _headers2, _response;
  const NativeResponse = globalThis.Response;
  const STATUS_CODES =
    ((_c =
      (_b2 = (_a2 = globalThis.process) == null ? void 0 : _a2.getBuiltinModule) == null
        ? void 0
        : _b2.call(_a2, "node:http")) == null
      ? void 0
      : _c.STATUS_CODES) || {};
  class NodeResponse$1 {
    constructor(body, init) {
      __privateAdd(this, _body);
      __privateAdd(this, _init2);
      __privateAdd(this, _headers2);
      __privateAdd(this, _response);
      __privateSet(this, _body, body);
      __privateSet(this, _init2, init);
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeResponse;
    }
    get status() {
      var _a3, _b3;
      return (
        ((_a3 = __privateGet(this, _response)) == null ? void 0 : _a3.status) ||
        ((_b3 = __privateGet(this, _init2)) == null ? void 0 : _b3.status) ||
        200
      );
    }
    get statusText() {
      var _a3, _b3;
      return (
        ((_a3 = __privateGet(this, _response)) == null ? void 0 : _a3.statusText) ||
        ((_b3 = __privateGet(this, _init2)) == null ? void 0 : _b3.statusText) ||
        STATUS_CODES[this.status] ||
        ""
      );
    }
    get headers() {
      var _a3;
      if (__privateGet(this, _response)) return __privateGet(this, _response).headers;
      if (__privateGet(this, _headers2)) return __privateGet(this, _headers2);
      const initHeaders = (_a3 = __privateGet(this, _init2)) == null ? void 0 : _a3.headers;
      return __privateSet(
        this,
        _headers2,
        initHeaders instanceof Headers ? initHeaders : new Headers(initHeaders),
      );
    }
    get ok() {
      if (__privateGet(this, _response)) return __privateGet(this, _response).ok;
      const status = this.status;
      return status >= 200 && status < 300;
    }
    get _response() {
      if (__privateGet(this, _response)) return __privateGet(this, _response);
      __privateSet(
        this,
        _response,
        new NativeResponse(
          __privateGet(this, _body),
          __privateGet(this, _headers2)
            ? {
                ...__privateGet(this, _init2),
                headers: __privateGet(this, _headers2),
              }
            : __privateGet(this, _init2),
        ),
      );
      __privateSet(this, _init2, void 0);
      __privateSet(this, _headers2, void 0);
      __privateSet(this, _body, void 0);
      return __privateGet(this, _response);
    }
    _toNodeResponse() {
      var _a3, _b3;
      const status = this.status;
      const statusText = this.statusText;
      let body;
      let contentType;
      let contentLength;
      if (__privateGet(this, _response)) body = __privateGet(this, _response).body;
      else if (__privateGet(this, _body))
        if (__privateGet(this, _body) instanceof ReadableStream) body = __privateGet(this, _body);
        else if (typeof __privateGet(this, _body) === "string") {
          body = __privateGet(this, _body);
          contentType = "text/plain; charset=UTF-8";
          contentLength = Buffer.byteLength(__privateGet(this, _body));
        } else if (__privateGet(this, _body) instanceof ArrayBuffer) {
          body = Buffer.from(__privateGet(this, _body));
          contentLength = __privateGet(this, _body).byteLength;
        } else if (__privateGet(this, _body) instanceof Uint8Array) {
          body = __privateGet(this, _body);
          contentLength = __privateGet(this, _body).byteLength;
        } else if (__privateGet(this, _body) instanceof DataView) {
          body = Buffer.from(__privateGet(this, _body).buffer);
          contentLength = __privateGet(this, _body).byteLength;
        } else if (__privateGet(this, _body) instanceof Blob) {
          body = __privateGet(this, _body).stream();
          contentType = __privateGet(this, _body).type;
          contentLength = __privateGet(this, _body).size;
        } else if (typeof __privateGet(this, _body).pipe === "function")
          body = __privateGet(this, _body);
        else body = this._response.body;
      const headers = [];
      const initHeaders = (_a3 = __privateGet(this, _init2)) == null ? void 0 : _a3.headers;
      const headerEntries =
        ((_b3 = __privateGet(this, _response)) == null ? void 0 : _b3.headers) ||
        __privateGet(this, _headers2) ||
        (initHeaders
          ? Array.isArray(initHeaders)
            ? initHeaders
            : (initHeaders == null ? void 0 : initHeaders.entries)
              ? initHeaders.entries()
              : Object.entries(initHeaders).map(([k2, v2]) => [k2.toLowerCase(), v2])
          : void 0);
      let hasContentTypeHeader;
      let hasContentLength;
      if (headerEntries)
        for (const [key, value] of headerEntries) {
          if (Array.isArray(value)) for (const v2 of value) headers.push([key, v2]);
          else headers.push([key, value]);
          if (key === "content-type") hasContentTypeHeader = true;
          else if (key === "content-length") hasContentLength = true;
        }
      if (contentType && !hasContentTypeHeader) headers.push(["content-type", contentType]);
      if (contentLength && !hasContentLength)
        headers.push(["content-length", String(contentLength)]);
      __privateSet(this, _init2, void 0);
      __privateSet(this, _headers2, void 0);
      __privateSet(this, _response, void 0);
      __privateSet(this, _body, void 0);
      return {
        status,
        statusText,
        headers,
        body,
      };
    }
  }
  _body = new WeakMap();
  _init2 = new WeakMap();
  _headers2 = new WeakMap();
  _response = new WeakMap();
  lazyInherit(NodeResponse$1.prototype, NativeResponse.prototype, "_response");
  Object.setPrototypeOf(NodeResponse$1, NativeResponse);
  Object.setPrototypeOf(NodeResponse$1.prototype, NativeResponse.prototype);
  return NodeResponse$1;
})();
const kEventNS = "h3.internal.event.";
const kEventRes = /* @__PURE__ */ Symbol.for(`${kEventNS}res`);
const kEventResHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.headers`);
var H3Event =
  ((_a = class {
    constructor(req, context, app) {
      __publicField(this, "app");
      __publicField(this, "req");
      __publicField(this, "url");
      __publicField(this, "context");
      this.context = context || req.context || new NullProtoObj();
      this.req = req;
      this.app = app;
      const _url = req._url;
      this.url = _url && _url instanceof URL ? _url : new FastURL(req.url);
    }
    get res() {
      return this[kEventRes] || (this[kEventRes] = new H3EventResponse());
    }
    get runtime() {
      return this.req.runtime;
    }
    waitUntil(promise) {
      var _a2, _b2;
      (_b2 = (_a2 = this.req).waitUntil) == null ? void 0 : _b2.call(_a2, promise);
    }
    toString() {
      return `[${this.req.method}] ${this.req.url}`;
    }
    toJSON() {
      return this.toString();
    }
    get node() {
      var _a2;
      return (_a2 = this.req.runtime) == null ? void 0 : _a2.node;
    }
    get headers() {
      return this.req.headers;
    }
    get path() {
      return this.url.pathname + this.url.search;
    }
    get method() {
      return this.req.method;
    }
  }),
  __publicField(_a, "__is_event__", true),
  _a);
var H3EventResponse = class {
  constructor() {
    __publicField(this, "status");
    __publicField(this, "statusText");
  }
  get headers() {
    return this[kEventResHeaders] || (this[kEventResHeaders] = new Headers());
  }
};
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) return defaultStatusCode;
  if (typeof statusCode === "string") statusCode = +statusCode;
  if (statusCode < 100 || statusCode > 599) return defaultStatusCode;
  return statusCode;
}
var HTTPError = class HTTPError2 extends Error {
  constructor(arg1, arg2) {
    var _a2, _b2, _c, _d, _e2, _f;
    let messageInput;
    let details;
    if (typeof arg1 === "string") {
      messageInput = arg1;
      details = arg2;
    } else details = arg1;
    const status = sanitizeStatusCode(
      (details == null ? void 0 : details.status) ||
        ((_a2 = details == null ? void 0 : details.cause) == null ? void 0 : _a2.status) ||
        (details == null ? void 0 : details.status) ||
        (details == null ? void 0 : details.statusCode),
      500,
    );
    const statusText = sanitizeStatusMessage(
      (details == null ? void 0 : details.statusText) ||
        ((_b2 = details == null ? void 0 : details.cause) == null ? void 0 : _b2.statusText) ||
        (details == null ? void 0 : details.statusText) ||
        (details == null ? void 0 : details.statusMessage),
    );
    const message =
      messageInput ||
      (details == null ? void 0 : details.message) ||
      ((_c = details == null ? void 0 : details.cause) == null ? void 0 : _c.message) ||
      (details == null ? void 0 : details.statusText) ||
      (details == null ? void 0 : details.statusMessage) ||
      ["HTTPError", status, statusText].filter(Boolean).join(" ");
    super(message, { cause: details });
    __publicField(this, "status");
    __publicField(this, "statusText");
    __publicField(this, "headers");
    __publicField(this, "cause");
    __publicField(this, "data");
    __publicField(this, "body");
    __publicField(this, "unhandled");
    this.cause = details;
    (_d = Error.captureStackTrace) == null ? void 0 : _d.call(Error, this, this.constructor);
    this.status = status;
    this.statusText = statusText || void 0;
    const rawHeaders =
      (details == null ? void 0 : details.headers) ||
      ((_e2 = details == null ? void 0 : details.cause) == null ? void 0 : _e2.headers);
    this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
    this.unhandled =
      (details == null ? void 0 : details.unhandled) ??
      ((_f = details == null ? void 0 : details.cause) == null ? void 0 : _f.unhandled) ??
      void 0;
    this.data = details == null ? void 0 : details.data;
    this.body = details == null ? void 0 : details.body;
  }
  get name() {
    return "HTTPError";
  }
  static isError(input) {
    return input instanceof Error && (input == null ? void 0 : input.name) === "HTTPError";
  }
  static status(status, statusText, details) {
    return new HTTPError2({
      ...details,
      statusText,
      status,
    });
  }
  get statusCode() {
    return this.status;
  }
  get statusMessage() {
    return this.statusText;
  }
  toJSON() {
    const unhandled = this.unhandled;
    return {
      status: this.status,
      statusText: this.statusText,
      unhandled,
      message: unhandled ? "HTTPError" : this.message,
      data: unhandled ? void 0 : this.data,
      ...(unhandled ? void 0 : this.body),
    };
  }
};
function isJSONSerializable(value, _type) {
  if (value === null || value === void 0) return true;
  if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
  if (typeof value.toJSON === "function") return true;
  if (Array.isArray(value)) return true;
  if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
  if (value instanceof NullProtoObj) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
const kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
const kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
  var _a2;
  if (typeof (val == null ? void 0 : val.then) === "function")
    return (
      ((_a2 = val.catch) == null ? void 0 : _a2.call(val, (error) => error)) || Promise.resolve(val)
    ).then((resolvedVal) => toResponse(resolvedVal, event, config));
  const response = prepareResponse(val, event, config);
  if (typeof (response == null ? void 0 : response.then) === "function")
    return toResponse(response, event, config);
  const { onResponse: onResponse$1 } = config;
  return onResponse$1
    ? Promise.resolve(onResponse$1(response, event)).then(() => response)
    : response;
}
var HTTPResponse =
  ((_b = class {
    constructor(body, init) {
      __privateAdd(this, _headers);
      __privateAdd(this, _init);
      __publicField(this, "body");
      this.body = body;
      __privateSet(this, _init, init);
    }
    get status() {
      var _a2;
      return ((_a2 = __privateGet(this, _init)) == null ? void 0 : _a2.status) || 200;
    }
    get statusText() {
      var _a2;
      return ((_a2 = __privateGet(this, _init)) == null ? void 0 : _a2.statusText) || "OK";
    }
    get headers() {
      var _a2;
      return (
        __privateGet(this, _headers) ||
        __privateSet(
          this,
          _headers,
          new Headers((_a2 = __privateGet(this, _init)) == null ? void 0 : _a2.headers),
        )
      );
    }
  }),
  (_headers = new WeakMap()),
  (_init = new WeakMap()),
  _b);
function prepareResponse(val, event, config, nested) {
  if (val === kHandled) return new NodeResponse(null);
  if (val === kNotFound)
    val = new HTTPError({
      status: 404,
      message: `Cannot find any route matching [${event.req.method}] ${event.url}`,
    });
  if (val && val instanceof Error) {
    const isHTTPError = HTTPError.isError(val);
    const error = isHTTPError ? val : new HTTPError(val);
    if (!isHTTPError) {
      error.unhandled = true;
      if (val == null ? void 0 : val.stack) error.stack = val.stack;
    }
    if (error.unhandled && !config.silent) console.error(error);
    const { onError: onError$1 } = config;
    return onError$1 && !nested
      ? Promise.resolve(onError$1(error, event))
          .catch((error$1) => error$1)
          .then((newVal) => prepareResponse(newVal ?? val, event, config, true))
      : errorResponse(error, config.debug);
  }
  const preparedRes = event[kEventRes];
  const preparedHeaders = preparedRes == null ? void 0 : preparedRes[kEventResHeaders];
  event[kEventRes] = void 0;
  if (!(val instanceof Response)) {
    const res = prepareResponseBody(val, event, config);
    const status = res.status || (preparedRes == null ? void 0 : preparedRes.status);
    return new NodeResponse(nullBody(event.req.method, status) ? null : res.body, {
      status,
      statusText: res.statusText || (preparedRes == null ? void 0 : preparedRes.statusText),
      headers:
        res.headers && preparedHeaders
          ? mergeHeaders$1(res.headers, preparedHeaders)
          : res.headers || preparedHeaders,
    });
  }
  if (!preparedHeaders || nested || !val.ok) return val;
  try {
    mergeHeaders$1(val.headers, preparedHeaders, val.headers);
    return val;
  } catch {
    return new NodeResponse(nullBody(event.req.method, val.status) ? null : val.body, {
      status: val.status,
      statusText: val.statusText,
      headers: mergeHeaders$1(val.headers, preparedHeaders),
    });
  }
}
function mergeHeaders$1(base, overrides, target = new Headers(base)) {
  for (const [name, value] of overrides)
    if (name === "set-cookie") target.append(name, value);
    else target.set(name, value);
  return target;
}
const frozenHeaders = () => {
  throw new Error("Headers are frozen");
};
var FrozenHeaders = class extends Headers {
  constructor(init) {
    super(init);
    this.set = this.append = this.delete = frozenHeaders;
  }
};
const emptyHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-length": "0" });
const jsonHeaders = /* @__PURE__ */ new FrozenHeaders({
  "content-type": "application/json;charset=UTF-8",
});
function prepareResponseBody(val, event, config) {
  var _a2;
  if (val === null || val === void 0)
    return {
      body: "",
      headers: emptyHeaders,
    };
  const valType = typeof val;
  if (valType === "string") return { body: val };
  if (val instanceof Uint8Array) {
    event.res.headers.set("content-length", val.byteLength.toString());
    return { body: val };
  }
  if (
    val instanceof HTTPResponse ||
    ((_a2 = val == null ? void 0 : val.constructor) == null ? void 0 : _a2.name) === "HTTPResponse"
  )
    return val;
  if (isJSONSerializable(val, valType))
    return {
      body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
      headers: jsonHeaders,
    };
  if (valType === "bigint")
    return {
      body: val.toString(),
      headers: jsonHeaders,
    };
  if (val instanceof Blob) {
    const headers = new Headers({
      "content-type": val.type,
      "content-length": val.size.toString(),
    });
    let filename = val.name;
    if (filename) {
      filename = encodeURIComponent(filename);
      headers.set("content-disposition", `filename="${filename}"; filename*=UTF-8''${filename}`);
    }
    return {
      body: val.stream(),
      headers,
    };
  }
  if (valType === "symbol") return { body: val.toString() };
  if (valType === "function") return { body: `${val.name}()` };
  return { body: val };
}
function nullBody(method, status) {
  return (
    method === "HEAD" ||
    status === 100 ||
    status === 101 ||
    status === 102 ||
    status === 204 ||
    status === 205 ||
    status === 304
  );
}
function errorResponse(error, debug) {
  return new NodeResponse(
    JSON.stringify(
      {
        ...error.toJSON(),
        stack: debug && error.stack ? error.stack.split("\n").map((l) => l.trim()) : void 0,
      },
      void 0,
      debug ? 2 : void 0,
    ),
    {
      status: error.status,
      statusText: error.statusText,
      headers: error.headers
        ? mergeHeaders$1(jsonHeaders, error.headers)
        : new Headers(jsonHeaders),
    },
  );
}
const GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
const globalObj = globalThis;
if (!globalObj[GLOBAL_EVENT_STORAGE_KEY]) {
  globalObj[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
}
const eventStorage = globalObj[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") {
    return headersWithSetCookie.getSetCookie();
  }
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) {
    return;
  }
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) {
    return;
  }
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
  for (const cookie of eventSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) {
    return value.then((resolved) => {
      if (resolved instanceof Response) {
        mergeEventResponseHeaders(resolved, event);
      }
      return resolved;
    });
  }
  if (value instanceof Response) {
    mergeEventResponseHeaders(value, event);
  }
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    const h3Event = new H3Event(request);
    const response = eventStorage.run({ h3Event }, () => handler(request, requestOpts));
    return toResponse(attachResponseHeaders(response, h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`,
    );
  }
  return event.h3Event;
}
function getResponse() {
  const event = getH3Event();
  return event.res;
}
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("./assets/_tanstack-start-manifest_v-kT72A6T0.js");
  const startManifest = tsrStartManifest();
  const rootRoute = (startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {});
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      async: true,
    },
    children: script,
  });
  const manifest2 = {
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).flatMap(([k2, v2]) => {
        const result = {};
        let hasData = false;
        if (v2.preloads && v2.preloads.length > 0) {
          result["preloads"] = v2.preloads;
          hasData = true;
        }
        if (v2.assets && v2.assets.length > 0) {
          result["assets"] = v2.assets;
          hasData = true;
        }
        if (!hasData) {
          return [];
        }
        return [[k2, result]];
      }),
    ),
  };
  return manifest2;
}
const textEncoder$1 = new TextEncoder();
const EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = (streamId >>> 24) & 255;
  frame[2] = (streamId >>> 16) & 255;
  frame[3] = (streamId >>> 8) & 255;
  frame[4] = streamId & 255;
  frame[5] = (payload.length >>> 24) & 255;
  frame[6] = (payload.length >>> 16) & 255;
  frame[7] = (payload.length >>> 8) & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder$1.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder$1.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams) {
  let activePumps = 1 + rawStreams.size;
  let controllerRef = null;
  let cancelled = false;
  const cancelReaders = [];
  const safeEnqueue = (chunk) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.enqueue(chunk);
    } catch {}
  };
  const safeError = (err) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.error(err);
    } catch {}
  };
  const safeClose = () => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.close();
    } catch {}
  };
  const checkComplete = () => {
    activePumps--;
    if (activePumps === 0) {
      safeClose();
    }
  };
  return new ReadableStream({
    start(controller) {
      controllerRef = controller;
      cancelReaders.length = 0;
      const pumpJSON = async () => {
        const reader = jsonStream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {});
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) break;
            safeEnqueue(encodeJSONFrame(value));
          }
        } catch (error) {
          safeError(error);
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      const pumpRawStream = async (streamId, stream) => {
        const reader = stream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {});
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) {
              safeEnqueue(encodeEndFrame(streamId));
              break;
            }
            safeEnqueue(encodeChunkFrame(streamId, value));
          }
        } catch (error) {
          safeEnqueue(encodeErrorFrame(streamId, error));
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      pumpJSON();
      for (const [streamId, stream] of rawStreams) {
        pumpRawStream(streamId, stream);
      }
    },
    cancel() {
      cancelled = true;
      controllerRef = null;
      for (const cancelReader of cancelReaders) {
        cancelReader();
      }
      cancelReaders.length = 0;
    },
  });
}
const manifest = {};
async function getServerFnById(id) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(`Server function module export not resolved for serverFn ID: ${id}`);
  }
  return action;
}
let serovalPlugins = void 0;
const textEncoder = new TextEncoder();
const FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
const MAX_PAYLOAD_SIZE = 1e6;
const handleServerAction = async ({ request, context, serverFnId }) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const methodUpper = method.toUpperCase();
  const methodLower = method.toLowerCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) {
    serovalPlugins = getDefaultSerovalPlugins();
  }
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    const parsedPayload = du(payload, { plugins: serovalPlugins });
    return parsedPayload;
  }
  const response = await (async () => {
    try {
      let serializeResult = function (res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          const rawStreamPlugin = createRawStreamRPCPlugin((id, stream2) => {
            rawStreams.set(id, stream2);
          });
          const plugins = [rawStreamPlugin, ...(serovalPlugins || [])];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            },
          };
          $i(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            },
          });
          if (done && rawStreams.size === 0) {
            return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
              status: alsResponse.status,
              statusText: alsResponse.statusText,
              headers: {
                "Content-Type": "application/json",
                [X_TSS_SERIALIZED]: "true",
              },
            });
          }
          if (rawStreams.size > 0) {
            const jsonStream = new ReadableStream({
              start(controller2) {
                callbacks.onParse = (value) => {
                  controller2.enqueue(JSON.stringify(value) + "\n");
                };
                callbacks.onDone = () => {
                  try {
                    controller2.close();
                  } catch {}
                };
                callbacks.onError = (error) => controller2.error(error);
                if (nonStreamingBody !== void 0) {
                  callbacks.onParse(nonStreamingBody);
                }
              },
            });
            const multiplexedStream = createMultiplexedStream(jsonStream, rawStreams);
            return new Response(multiplexedStream, {
              status: alsResponse.status,
              statusText: alsResponse.statusText,
              headers: {
                "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
                [X_TSS_SERIALIZED]: "true",
              },
            });
          }
          const stream = new ReadableStream({
            start(controller2) {
              callbacks.onParse = (value) =>
                controller2.enqueue(textEncoder.encode(JSON.stringify(value) + "\n"));
              callbacks.onDone = () => {
                try {
                  controller2.close();
                } catch (error) {
                  controller2.error(error);
                }
              };
              callbacks.onError = (error) => controller2.error(error);
              if (nonStreamingBody !== void 0) {
                callbacks.onParse(nonStreamingBody);
              }
            },
          });
          return new Response(stream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/x-ndjson",
              [X_TSS_SERIALIZED]: "true",
            },
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText,
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
          invariant(methodLower !== "get", "GET requests with FormData payloads are not supported");
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData,
            method: methodUpper,
          };
          if (typeof serializedContext === "string") {
            try {
              const parsedContext = JSON.parse(serializedContext);
              const deserializedContext = du(parsedContext, {
                plugins: serovalPlugins,
              });
              if (typeof deserializedContext === "object" && deserializedContext) {
                params.context = safeObjectMerge(context, deserializedContext);
              }
            } catch (e) {
              if (false);
            }
          }
          return await action(params, signal);
        }
        if (methodLower === "get") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) {
            throw new Error("Payload too large");
          }
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(context, payload2.context);
          payload2.method = methodUpper;
          return await action(payload2, signal);
        }
        if (methodLower !== "post") {
          throw new Error("expected POST method");
        }
        let jsonPayload;
        if (contentType == null ? void 0 : contentType.includes("application/json")) {
          jsonPayload = await request.json();
        }
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        payload.method = methodUpper;
        return await action(payload, signal);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) {
        res = isNotFoundResponse(res);
      }
      if (!isServerFn) {
        return unwrapped;
      }
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) {
          return unwrapped;
        }
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(
        await Promise.resolve(
          Zi(error, {
            refs: /* @__PURE__ */ new Map(),
            plugins: serovalPlugins,
          }),
        ),
      );
      const response2 = getResponse();
      return new Response(serializedError, {
        status: response2.status ?? 500,
        statusText: response2.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true",
        },
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  return response;
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });
}
const HEADERS = {
  TSS_SHELL: "X-TSS_SHELL",
};
const ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v2) => {
    if (typeof v2 !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v2)) return false;
    return !!v2[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn2 = async (opts, signal) => {
      const serverFn = await getServerFnById(functionId);
      const result = await serverFn(opts ?? {}, signal);
      return result.result;
    };
    return fn2;
  },
});
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    {
      "Content-Type": "text/html; charset=utf-8",
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    }),
  );
  return headers;
}
let entriesPromise;
let manifestPromise;
async function loadEntries() {
  const routerEntry = await import("./assets/router-Bw3MqbPS.js").then((n) => n.b);
  const startEntry = await import("./assets/start-HYkvq4Ni.js");
  return { startEntry, routerEntry };
}
function getEntries() {
  if (!entriesPromise) {
    entriesPromise = loadEntries();
  }
  return entriesPromise;
}
function getManifest(matchedRoutes) {
  if (!manifestPromise) {
    manifestPromise = getStartManifest();
  }
  return manifestPromise;
}
const ROUTER_BASEPATH = "/";
const SERVER_FN_BASE = "/_serverFn/";
const IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
const IS_SHELL_ENV = process.env.TSS_SHELL === "true";
const ERR_NO_RESPONSE = "Internal Server Error";
const ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return { response: result };
  }
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) {
        ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      }
      for (const key of Object.keys(nextCtx)) {
        if (key !== "context") {
          ctx[key] = nextCtx[key];
        }
      }
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({ ...ctx, next });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) {
        ctx.response = normalized.response;
      }
      if (normalized.context) {
        ctx.context = safeObjectMerge(ctx.context, normalized.context);
      }
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) {
    return handler;
  }
  return async (ctx) => {
    const response = await handler({ ...ctx, next: throwIfMayNotDefer });
    if (!response) {
      throwRouteHandlerError();
    }
    return response;
  };
}
function createStartHandler(cb) {
  const startRequestResolver = async (request, requestOpts) => {
    var _a2, _b2;
    let router = null;
    let cbWillCleanup = false;
    try {
      const url = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = getOrigin(request);
      const entries = await getEntries();
      const startOptions =
        (await ((_a2 = entries.startEntry.startInstance) == null ? void 0 : _a2.getOptions())) ||
        {};
      const serializationAdapters = [
        ...(startOptions.serializationAdapters || []),
        ServerFunctionSerializationAdapter,
      ];
      const requestStartOptions = {
        ...startOptions,
        serializationAdapters,
      };
      const flattenedRequestMiddlewares = startOptions.requestMiddleware
        ? flattenMiddlewares(startOptions.requestMiddleware)
        : [];
      const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) {
          isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        }
        const history = createMemoryHistory({
          initialEntries: [href],
        });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          ...{
            defaultSsr: requestStartOptions.defaultSsr,
            serializationAdapters: [
              ...requestStartOptions.serializationAdapters,
              ...(router.options.serializationAdapters || []),
            ],
          },
          basepath: ROUTER_BASEPATH,
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) {
          throw new Error("Invalid server action param for serverFnId");
        }
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext(
            {
              getRouter,
              startOptions: requestStartOptions,
              contextAfterGlobalMiddlewares: context,
              request,
              executedRequestMiddlewares,
            },
            () =>
              handleServerAction({
                request,
                context: requestOpts == null ? void 0 : requestOpts.context,
                serverFnId,
              }),
          );
        };
        const middlewares2 = flattenedRequestMiddlewares.map((d) => d.options.server);
        const ctx2 = await executeMiddleware([...middlewares2, serverFnHandler], {
          request,
          context: createNullProtoObject(requestOpts == null ? void 0 : requestOpts.context),
        });
        return handleRedirectResponse(ctx2.response, request, getRouter);
      }
      const executeRouter = async (serverContext, matchedRoutes) => {
        const acceptHeader = request.headers.get("Accept") || "*/*";
        const acceptParts = acceptHeader.split(",");
        const supportedMimeTypes = ["*/*", "text/html"];
        const isSupported = supportedMimeTypes.some((mimeType) =>
          acceptParts.some((part) => part.trim().startsWith(mimeType)),
        );
        if (!isSupported) {
          return Response.json({ error: "Only HTML requests are supported here" }, { status: 500 });
        }
        const manifest2 = await getManifest(matchedRoutes);
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2,
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) {
          return routerInstance.state.redirect;
        }
        await routerInstance.serverSsr.dehydrate();
        const responseHeaders = getStartResponseHeaders({
          router: routerInstance,
        });
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders,
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext(
          {
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares,
          },
          async () => {
            try {
              return await handleServerRoutes({
                getRouter,
                request,
                url,
                executeRouter,
                context,
                executedRequestMiddlewares,
              });
            } catch (err) {
              if (err instanceof Response) {
                return err;
              }
              throw err;
            }
          },
        );
      };
      const middlewares = flattenedRequestMiddlewares.map((d) => d.options.server);
      const ctx = await executeMiddleware([...middlewares, requestHandlerMiddleware], {
        request,
        context: createNullProtoObject(requestOpts == null ? void 0 : requestOpts.context),
      });
      return handleRedirectResponse(ctx.response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) {
        (_b2 = router.serverSsr) == null ? void 0 : _b2.cleanup();
      }
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) {
    return response;
  }
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") {
      return Response.json(
        { ...response.options, isSerializedRedirect: true },
        { headers: response.headers },
      );
    }
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) {
    throw new Error(
      `Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`,
    );
  }
  if (["params", "search", "hash"].some((d) => typeof opts[d] === "function")) {
    throw new Error(
      `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
        opts,
      )
        .filter((d) => typeof opts[d] === "function")
        .map((d) => `"${d}"`)
        .join(", ")}`,
    );
  }
  const router = await getRouter();
  const redirect2 = router.resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") {
    return Response.json(
      { ...response.options, isSerializedRedirect: true },
      { headers: response.headers },
    );
  }
  return redirect2;
}
async function handleServerRoutes({
  getRouter,
  request,
  url,
  executeRouter,
  context,
  executedRequestMiddlewares,
}) {
  var _a2, _b2;
  const router = await getRouter();
  const rewrittenUrl = executeRewriteInput(router.rewrite, url);
  const pathname = rewrittenUrl.pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = (_a2 = route.options.server) == null ? void 0 : _a2.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m2 of flattened) {
        if (!executedRequestMiddlewares.has(m2)) {
          routeMiddlewares.push(m2.options.server);
        }
      }
    }
  }
  const server2 = foundRoute == null ? void 0 : foundRoute.options.server;
  if ((server2 == null ? void 0 : server2.handlers) && isExactMatch) {
    const handlers =
      typeof server2.handlers === "function"
        ? server2.handlers({ createHandlers: (d) => d })
        : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = handlers[requestMethod] ?? handlers["ANY"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") {
        routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      } else {
        if ((_b2 = handler.middleware) == null ? void 0 : _b2.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m2 of handlerMiddlewares) {
            routeMiddlewares.push(m2.options.server);
          }
        }
        if (handler.handler) {
          routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
        }
      }
    }
  }
  routeMiddlewares.push((ctx2) => executeRouter(ctx2.context, matchedRoutes));
  const ctx = await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname,
  });
  return ctx.response;
}
const fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    },
  };
}
const server = createServerEntry({ fetch });
export {
  commonjsGlobal as A,
  getAugmentedNamespace as B,
  React$1 as C,
  requireShim as D,
  withSelectorExports as E,
  Outlet as O,
  React as R,
  trimPathRight as a,
  redirect as b,
  reactExports as c,
  createServerEntry,
  dummyMatchContext as d,
  server as default,
  useRouter as e,
  requireReactDom as f,
  getDefaultExportFromCjs as g,
  useForwardedRef as h,
  invariant as i,
  joinPaths as j,
  isDangerousProtocol as k,
  useIntersectionObserver as l,
  matchContext as m,
  functionalUpdate as n,
  exactPathTest as o,
  removeTrailingSlash as p,
  deepEqual as q,
  rootRouteId as r,
  jsxRuntimeExports as s,
  trimPathLeft as t,
  useRouterState as u,
  isModuleNotFoundError as v,
  warning as w,
  reactUse as x,
  RouterCore as y,
  escapeHtml as z,
};

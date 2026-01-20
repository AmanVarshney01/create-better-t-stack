import {
  r as rootRouteId,
  i as invariant,
  t as trimPathLeft,
  j as joinPaths,
  a as trimPathRight,
  b as redirect,
  c as reactExports,
  d as dummyMatchContext,
  m as matchContext,
  u as useRouterState,
  e as useRouter,
  g as getDefaultExportFromCjs,
  f as requireReactDom,
  h as useForwardedRef,
  k as isDangerousProtocol,
  l as useIntersectionObserver,
  n as functionalUpdate,
  o as exactPathTest,
  p as removeTrailingSlash,
  q as deepEqual,
  R as React,
  s as jsxRuntimeExports,
  w as warning,
  v as isModuleNotFoundError,
  x as reactUse,
  y as RouterCore,
  z as escapeHtml,
  O as Outlet,
} from "../server.js";
const preloadWarning = "Error preloading route! ☝️";
class BaseRoute {
  constructor(options) {
    this.init = (opts) => {
      var _a, _b;
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot =
        !(options2 == null ? void 0 : options2.path) && !(options2 == null ? void 0 : options2.id);
      this.parentRoute = (_b = (_a = this.options).getParentRoute) == null ? void 0 : _b.call(_a);
      if (isRoot) {
        this._path = rootRouteId;
      } else if (!this.parentRoute) {
        invariant(false);
      }
      let path = isRoot ? rootRouteId : options2 == null ? void 0 : options2.path;
      if (path && path !== "/") {
        path = trimPathLeft(path);
      }
      const customId = (options2 == null ? void 0 : options2.id) || path;
      let id = isRoot
        ? rootRouteId
        : joinPaths([this.parentRoute.id === rootRouteId ? "" : this.parentRoute.id, customId]);
      if (path === rootRouteId) {
        path = "/";
      }
      if (id !== rootRouteId) {
        id = joinPaths(["/", id]);
      }
      const fullPath = id === rootRouteId ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = trimPathRight(fullPath);
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) {
        this.children = children;
      }
      if (typeof children === "object" && children !== null) {
        this.children = Object.values(children);
      }
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.redirect = (opts) => redirect({ from: this.fullPath, ...opts });
    this.options = options || {};
    this.isRoot = !(options == null ? void 0 : options.getParentRoute);
    if ((options == null ? void 0 : options.id) && (options == null ? void 0 : options.path)) {
      throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
    }
  }
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
}
class BaseRootRoute extends BaseRoute {
  constructor(options) {
    super(options);
  }
}
function useMatch(opts) {
  const nearestMatchId = reactExports.useContext(opts.from ? dummyMatchContext : matchContext);
  const matchSelection = useRouterState({
    select: (state) => {
      const match = state.matches.find((d) =>
        opts.from ? opts.from === d.routeId : d.id === nearestMatchId,
      );
      invariant(
        !((opts.shouldThrow ?? true) && !match),
        `Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`,
      );
      if (match === void 0) {
        return void 0;
      }
      return opts.select ? opts.select(match) : match;
    },
    structuralSharing: opts.structuralSharing,
  });
  return matchSelection;
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    },
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s) => {
      return select ? select(s.loaderDeps) : s.loaderDeps;
    },
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    },
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    },
  });
}
function useNavigate(_defaultOpts) {
  const router2 = useRouter();
  return reactExports.useCallback(
    (options) => {
      return router2.navigate({
        ...options,
        from: options.from ?? (_defaultOpts == null ? void 0 : _defaultOpts.from),
      });
    },
    [_defaultOpts == null ? void 0 : _defaultOpts.from, router2],
  );
}
var reactDomExports = requireReactDom();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
function useLinkProps(options, forwardedRef) {
  const router2 = useRouter();
  const [isTransitioning, setIsTransitioning] = reactExports.useState(false);
  const hasRenderFetched = reactExports.useRef(false);
  const innerRef = useForwardedRef(forwardedRef);
  const {
    // custom props
    activeProps,
    inactiveProps,
    activeOptions,
    to,
    preload: userPreload,
    preloadDelay: userPreloadDelay,
    hashScrollIntoView,
    replace,
    startTransition,
    resetScroll,
    viewTransition,
    // element props
    children,
    target,
    disabled,
    style,
    className,
    onClick,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    ignoreBlocker,
    // prevent these from being returned
    params: _params,
    search: _search,
    hash: _hash,
    state: _state,
    mask: _mask,
    reloadDocument: _reloadDocument,
    unsafeRelative: _unsafeRelative,
    from: _from,
    _fromLocation,
    ...propsSafeToSpread
  } = options;
  const currentSearch = useRouterState({
    select: (s) => s.location.search,
    structuralSharing: true,
  });
  const from = options.from;
  const _options = reactExports.useMemo(
    () => {
      return { ...options, from };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      router2,
      currentSearch,
      from,
      options._fromLocation,
      options.hash,
      options.to,
      options.search,
      options.params,
      options.state,
      options.mask,
      options.unsafeRelative,
    ],
  );
  const next = reactExports.useMemo(
    () => router2.buildLocation({ ..._options }),
    [router2, _options],
  );
  const hrefOption = reactExports.useMemo(() => {
    if (disabled) {
      return void 0;
    }
    let href = next.maskedLocation ? next.maskedLocation.url.href : next.url.href;
    let external = false;
    if (router2.origin) {
      if (href.startsWith(router2.origin)) {
        href = router2.history.createHref(href.replace(router2.origin, "")) || "/";
      } else {
        external = true;
      }
    }
    return { href, external };
  }, [disabled, next.maskedLocation, next.url, router2.origin, router2.history]);
  const externalLink = reactExports.useMemo(() => {
    if (hrefOption == null ? void 0 : hrefOption.external) {
      if (isDangerousProtocol(hrefOption.href)) {
        return void 0;
      }
      return hrefOption.href;
    }
    try {
      new URL(to);
      if (isDangerousProtocol(to)) {
        if (false);
        return void 0;
      }
      return to;
    } catch {}
    return void 0;
  }, [to, hrefOption]);
  const preload =
    options.reloadDocument || externalLink
      ? false
      : (userPreload ?? router2.options.defaultPreload);
  const preloadDelay = userPreloadDelay ?? router2.options.defaultPreloadDelay ?? 0;
  const isActive = useRouterState({
    select: (s) => {
      if (externalLink) return false;
      if (activeOptions == null ? void 0 : activeOptions.exact) {
        const testExact = exactPathTest(s.location.pathname, next.pathname, router2.basepath);
        if (!testExact) {
          return false;
        }
      } else {
        const currentPathSplit = removeTrailingSlash(s.location.pathname, router2.basepath);
        const nextPathSplit = removeTrailingSlash(next.pathname, router2.basepath);
        const pathIsFuzzyEqual =
          currentPathSplit.startsWith(nextPathSplit) &&
          (currentPathSplit.length === nextPathSplit.length ||
            currentPathSplit[nextPathSplit.length] === "/");
        if (!pathIsFuzzyEqual) {
          return false;
        }
      }
      if ((activeOptions == null ? void 0 : activeOptions.includeSearch) ?? true) {
        const searchTest = deepEqual(s.location.search, next.search, {
          partial: !(activeOptions == null ? void 0 : activeOptions.exact),
          ignoreUndefined: !(activeOptions == null ? void 0 : activeOptions.explicitUndefined),
        });
        if (!searchTest) {
          return false;
        }
      }
      if (activeOptions == null ? void 0 : activeOptions.includeHash) {
        return s.location.hash === next.hash;
      }
      return true;
    },
  });
  const doPreload = reactExports.useCallback(() => {
    router2.preloadRoute({ ..._options }).catch((err) => {
      console.warn(err);
      console.warn(preloadWarning);
    });
  }, [router2, _options]);
  const preloadViewportIoCallback = reactExports.useCallback(
    (entry) => {
      if (entry == null ? void 0 : entry.isIntersecting) {
        doPreload();
      }
    },
    [doPreload],
  );
  useIntersectionObserver(innerRef, preloadViewportIoCallback, intersectionObserverOptions, {
    disabled: !!disabled || !(preload === "viewport"),
  });
  reactExports.useEffect(() => {
    if (hasRenderFetched.current) {
      return;
    }
    if (!disabled && preload === "render") {
      doPreload();
      hasRenderFetched.current = true;
    }
  }, [disabled, doPreload, preload]);
  const handleClick = (e) => {
    const elementTarget = e.currentTarget.getAttribute("target");
    const effectiveTarget = target !== void 0 ? target : elementTarget;
    if (
      !disabled &&
      !isCtrlEvent(e) &&
      !e.defaultPrevented &&
      (!effectiveTarget || effectiveTarget === "_self") &&
      e.button === 0
    ) {
      e.preventDefault();
      reactDomExports.flushSync(() => {
        setIsTransitioning(true);
      });
      const unsub = router2.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      router2.navigate({
        ..._options,
        replace,
        resetScroll,
        hashScrollIntoView,
        startTransition,
        viewTransition,
        ignoreBlocker,
      });
    }
  };
  if (externalLink) {
    return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink,
      ...(children && { children }),
      ...(target && { target }),
      ...(disabled && { disabled }),
      ...(style && { style }),
      ...(className && { className }),
      ...(onClick && { onClick }),
      ...(onFocus && { onFocus }),
      ...(onMouseEnter && { onMouseEnter }),
      ...(onMouseLeave && { onMouseLeave }),
      ...(onTouchStart && { onTouchStart }),
    };
  }
  const handleFocus = (_) => {
    if (disabled) return;
    if (preload) {
      doPreload();
    }
  };
  const handleTouchStart = handleFocus;
  const handleEnter = (e) => {
    if (disabled || !preload) return;
    if (!preloadDelay) {
      doPreload();
    } else {
      const eventTarget = e.target;
      if (timeoutMap.has(eventTarget)) {
        return;
      }
      const id = setTimeout(() => {
        timeoutMap.delete(eventTarget);
        doPreload();
      }, preloadDelay);
      timeoutMap.set(eventTarget, id);
    }
  };
  const handleLeave = (e) => {
    if (disabled || !preload || !preloadDelay) return;
    const eventTarget = e.target;
    const id = timeoutMap.get(eventTarget);
    if (id) {
      clearTimeout(id);
      timeoutMap.delete(eventTarget);
    }
  };
  const resolvedActiveProps = isActive
    ? (functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT)
    : STATIC_EMPTY_OBJECT;
  const resolvedInactiveProps = isActive
    ? STATIC_EMPTY_OBJECT
    : (functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT);
  const resolvedClassName = [
    className,
    resolvedActiveProps.className,
    resolvedInactiveProps.className,
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedStyle = (style || resolvedActiveProps.style || resolvedInactiveProps.style) && {
    ...style,
    ...resolvedActiveProps.style,
    ...resolvedInactiveProps.style,
  };
  return {
    ...propsSafeToSpread,
    ...resolvedActiveProps,
    ...resolvedInactiveProps,
    href: hrefOption == null ? void 0 : hrefOption.href,
    ref: innerRef,
    onClick: composeHandlers([onClick, handleClick]),
    onFocus: composeHandlers([onFocus, handleFocus]),
    onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
    onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
    onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
    disabled: !!disabled,
    target,
    ...(resolvedStyle && { style: resolvedStyle }),
    ...(resolvedClassName && { className: resolvedClassName }),
    ...(disabled && STATIC_DISABLED_PROPS),
    ...(isActive && STATIC_ACTIVE_PROPS),
    ...(isTransitioning && STATIC_TRANSITIONING_PROPS),
  };
}
const STATIC_EMPTY_OBJECT = {};
const STATIC_ACTIVE_OBJECT = { className: "active" };
const STATIC_DISABLED_PROPS = { role: "link", "aria-disabled": true };
const STATIC_ACTIVE_PROPS = { "data-status": "active", "aria-current": "page" };
const STATIC_TRANSITIONING_PROPS = { "data-transitioning": "transitioning" };
const timeoutMap = /* @__PURE__ */ new WeakMap();
const intersectionObserverOptions = {
  rootMargin: "100px",
};
const composeHandlers = (handlers) => (e) => {
  for (const handler of handlers) {
    if (!handler) continue;
    if (e.defaultPrevented) return;
    handler(e);
  }
};
const Link = reactExports.forwardRef((props, ref) => {
  const { _asChild, ...rest } = props;
  const { type: _type, ref: innerRef, ...linkProps } = useLinkProps(rest, ref);
  const children =
    typeof rest.children === "function"
      ? rest.children({
          isActive: linkProps["data-status"] === "active",
        })
      : rest.children;
  if (_asChild === void 0) {
    delete linkProps.disabled;
  }
  return reactExports.createElement(
    _asChild ? _asChild : "a",
    {
      ...linkProps,
      ref: innerRef,
    },
    children,
  );
});
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
let Route$4 = class Route extends BaseRoute {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts == null ? void 0 : opts.select,
        from: this.id,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => ((opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context),
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id,
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id,
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { ref, from: this.fullPath, ...props });
    });
    this.$$typeof = /* @__PURE__ */ Symbol.for("react.memo");
  }
};
function createRoute(options) {
  return new Route$4(
    // TODO: Help us TypeChris, you're our only hope!
    options,
  );
}
class RootRoute extends BaseRootRoute {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts == null ? void 0 : opts.select,
        from: this.id,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => ((opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context),
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id,
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id,
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { ref, from: this.fullPath, ...props });
    });
    this.$$typeof = /* @__PURE__ */ Symbol.for("react.memo");
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  if (typeof path === "object") {
    return new FileRoute(path, {
      silent: true,
    }).createRoute(path);
  }
  return new FileRoute(path, {
    silent: true,
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      warning(this.silent);
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts == null ? void 0 : _opts.silent;
  }
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return useMatch({
        select: opts2 == null ? void 0 : opts2.select,
        from: this.options.id,
        structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
      });
    };
    this.useRouteContext = (opts2) => {
      return useMatch({
        from: this.options.id,
        select: (d) =>
          (opts2 == null ? void 0 : opts2.select) ? opts2.select(d.context) : d.context,
      });
    };
    this.useSearch = (opts2) => {
      return useSearch({
        select: opts2 == null ? void 0 : opts2.select,
        structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
        from: this.options.id,
      });
    };
    this.useParams = (opts2) => {
      return useParams({
        select: opts2 == null ? void 0 : opts2.select,
        structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
        from: this.options.id,
      });
    };
    this.useLoaderDeps = (opts2) => {
      return useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      const router2 = useRouter();
      return useNavigate({ from: router2.routesById[this.options.id].fullPath });
    };
    this.options = opts;
    this.$$typeof = /* @__PURE__ */ Symbol.for("react.memo");
  }
}
function createLazyFileRoute(id) {
  if (typeof id === "object") {
    return new LazyRoute(id);
  }
  return (opts) => new LazyRoute({ id, ...opts });
}
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (!loadPromise) {
      loadPromise = importer()
        .then((res) => {
          loadPromise = void 0;
          comp = res[exportName];
        })
        .catch((err) => {
          error = err;
          if (isModuleNotFoundError(error)) {
            if (
              error instanceof Error &&
              typeof window !== "undefined" &&
              typeof sessionStorage !== "undefined"
            ) {
              const storageKey = `tanstack_router_reload:${error.message}`;
              if (!sessionStorage.getItem(storageKey)) {
                sessionStorage.setItem(storageKey, "1");
                reload = true;
              }
            }
          }
        });
    }
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {});
    }
    if (error) {
      throw error;
    }
    if (!comp) {
      if (reactUse) {
        reactUse(load());
      } else {
        throw load();
      }
    }
    return reactExports.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
const createRouter = (options) => {
  return new Router(options);
};
class Router extends RouterCore {
  constructor(options) {
    super(options);
  }
}
if (typeof globalThis !== "undefined") {
  globalThis.createFileRoute = createFileRoute;
  globalThis.createLazyFileRoute = createLazyFileRoute;
} else if (typeof window !== "undefined") {
  window.createFileRoute = createFileRoute;
  window.createLazyFileRoute = createLazyFileRoute;
}
function Asset({ tag, attrs, children, nonce }) {
  switch (tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        ...attrs,
        suppressHydrationWarning: true,
        children,
      });
    case "meta":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        ...attrs,
        suppressHydrationWarning: true,
      });
    case "link":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("link", {
        ...attrs,
        nonce,
        suppressHydrationWarning: true,
      });
    case "style":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        ...attrs,
        dangerouslySetInnerHTML: { __html: children },
        nonce,
      });
    case "script":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Script, { attrs, children });
    default:
      return null;
  }
}
function Script({ attrs, children }) {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    if (attrs == null ? void 0 : attrs.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      const existingScript = Array.from(document.querySelectorAll("script[src]")).find(
        (el) => el.src === normSrc,
      );
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) {
        if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) {
          script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
        }
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    if (typeof children === "string") {
      const typeAttr =
        typeof (attrs == null ? void 0 : attrs.type) === "string" ? attrs.type : "text/javascript";
      const nonceAttr =
        typeof (attrs == null ? void 0 : attrs.nonce) === "string" ? attrs.nonce : void 0;
      const existingScript = Array.from(document.querySelectorAll("script:not([src])")).find(
        (el) => {
          if (!(el instanceof HTMLScriptElement)) return false;
          const sType = el.getAttribute("type") ?? "text/javascript";
          const sNonce = el.getAttribute("nonce") ?? void 0;
          return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
        },
      );
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      script.textContent = children;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
          if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) {
            script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
          }
        }
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    return void 0;
  }, [attrs, children]);
  if (!router2.isServer) {
    const { src, ...rest } = attrs || {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: { __html: "" },
      ...rest,
    });
  }
  if ((attrs == null ? void 0 : attrs.src) && typeof attrs.src === "string") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      suppressHydrationWarning: true,
    });
  }
  if (typeof children === "string") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      dangerouslySetInnerHTML: { __html: children },
      suppressHydrationWarning: true,
    });
  }
  return null;
}
const useTags = () => {
  var _a;
  const router2 = useRouter();
  const nonce = (_a = router2.options.ssr) == null ? void 0 : _a.nonce;
  const routeMeta = useRouterState({
    select: (state) => {
      return state.matches.map((match) => match.meta).filter(Boolean);
    },
  });
  const meta = reactExports.useMemo(() => {
    const resultMeta = [];
    const metaByAttribute = {};
    let title;
    for (let i = routeMeta.length - 1; i >= 0; i--) {
      const metas = routeMeta[i];
      for (let j = metas.length - 1; j >= 0; j--) {
        const m = metas[j];
        if (!m) continue;
        if (m.title) {
          if (!title) {
            title = {
              tag: "title",
              children: m.title,
            };
          }
        } else if ("script:ld+json" in m) {
          try {
            const json = JSON.stringify(m["script:ld+json"]);
            resultMeta.push({
              tag: "script",
              attrs: {
                type: "application/ld+json",
              },
              children: escapeHtml(json),
            });
          } catch {}
        } else {
          const attribute = m.name ?? m.property;
          if (attribute) {
            if (metaByAttribute[attribute]) {
              continue;
            } else {
              metaByAttribute[attribute] = true;
            }
          }
          resultMeta.push({
            tag: "meta",
            attrs: {
              ...m,
              nonce,
            },
          });
        }
      }
    }
    if (title) {
      resultMeta.push(title);
    }
    if (nonce) {
      resultMeta.push({
        tag: "meta",
        attrs: {
          property: "csp-nonce",
          content: nonce,
        },
      });
    }
    resultMeta.reverse();
    return resultMeta;
  }, [routeMeta, nonce]);
  const links = useRouterState({
    select: (state) => {
      var _a2;
      const constructed = state.matches
        .map((match) => match.links)
        .filter(Boolean)
        .flat(1)
        .map((link) => ({
          tag: "link",
          attrs: {
            ...link,
            nonce,
          },
        }));
      const manifest = (_a2 = router2.ssr) == null ? void 0 : _a2.manifest;
      const assets = state.matches
        .map((match) => {
          var _a3;
          return (
            ((_a3 = manifest == null ? void 0 : manifest.routes[match.routeId]) == null
              ? void 0
              : _a3.assets) ?? []
          );
        })
        .filter(Boolean)
        .flat(1)
        .filter((asset) => asset.tag === "link")
        .map((asset) => ({
          tag: "link",
          attrs: {
            ...asset.attrs,
            suppressHydrationWarning: true,
            nonce,
          },
        }));
      return [...constructed, ...assets];
    },
    structuralSharing: true,
  });
  const preloadLinks = useRouterState({
    select: (state) => {
      const preloadLinks2 = [];
      state.matches
        .map((match) => router2.looseRoutesById[match.routeId])
        .forEach((route) => {
          var _a2, _b, _c, _d;
          return (_d =
            (_c =
              (_b = (_a2 = router2.ssr) == null ? void 0 : _a2.manifest) == null
                ? void 0
                : _b.routes[route.id]) == null
              ? void 0
              : _c.preloads) == null
            ? void 0
            : _d.filter(Boolean).forEach((preload) => {
                preloadLinks2.push({
                  tag: "link",
                  attrs: {
                    rel: "modulepreload",
                    href: preload,
                    nonce,
                  },
                });
              });
        });
      return preloadLinks2;
    },
    structuralSharing: true,
  });
  const styles = useRouterState({
    select: (state) =>
      state.matches
        .map((match) => match.styles)
        .flat(1)
        .filter(Boolean)
        .map(({ children, ...attrs }) => ({
          tag: "style",
          attrs: {
            ...attrs,
            nonce,
          },
          children,
        })),
    structuralSharing: true,
  });
  const headScripts = useRouterState({
    select: (state) =>
      state.matches
        .map((match) => match.headScripts)
        .flat(1)
        .filter(Boolean)
        .map(({ children, ...script }) => ({
          tag: "script",
          attrs: {
            ...script,
            nonce,
          },
          children,
        })),
    structuralSharing: true,
  });
  return uniqBy([...meta, ...preloadLinks, ...links, ...styles, ...headScripts], (d) => {
    return JSON.stringify(d);
  });
};
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function HeadContent() {
  var _a;
  const tags = useTags();
  const router2 = useRouter();
  const nonce = (_a = router2.options.ssr) == null ? void 0 : _a.nonce;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: tags.map((tag) =>
      /* @__PURE__ */ reactExports.createElement(Asset, {
        ...tag,
        key: `tsr-meta-${JSON.stringify(tag)}`,
        nonce,
      }),
    ),
  });
}
const Scripts = () => {
  var _a;
  const router2 = useRouter();
  const nonce = (_a = router2.options.ssr) == null ? void 0 : _a.nonce;
  const assetScripts = useRouterState({
    select: (state) => {
      var _a2;
      const assetScripts2 = [];
      const manifest = (_a2 = router2.ssr) == null ? void 0 : _a2.manifest;
      if (!manifest) {
        return [];
      }
      state.matches
        .map((match) => router2.looseRoutesById[match.routeId])
        .forEach((route) => {
          var _a3, _b;
          return (_b = (_a3 = manifest.routes[route.id]) == null ? void 0 : _a3.assets) == null
            ? void 0
            : _b
                .filter((d) => d.tag === "script")
                .forEach((asset) => {
                  assetScripts2.push({
                    tag: "script",
                    attrs: { ...asset.attrs, nonce },
                    children: asset.children,
                  });
                });
        });
      return assetScripts2;
    },
    structuralSharing: true,
  });
  const { scripts } = useRouterState({
    select: (state) => ({
      scripts: state.matches
        .map((match) => match.scripts)
        .flat(1)
        .filter(Boolean)
        .map(({ children, ...script }) => ({
          tag: "script",
          attrs: {
            ...script,
            suppressHydrationWarning: true,
            nonce,
          },
          children,
        })),
    }),
    structuralSharing: true,
  });
  let serverBufferedScript = void 0;
  if (router2.serverSsr) {
    serverBufferedScript = router2.serverSsr.takeBufferedScripts();
  }
  const allScripts = [...scripts, ...assetScripts];
  if (serverBufferedScript) {
    allScripts.unshift(serverBufferedScript);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: allScripts.map((asset, i) =>
      /* @__PURE__ */ reactExports.createElement(Asset, {
        ...asset,
        key: `tsr-scripts-${asset.tag}-${i}`,
      }),
    ),
  });
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) =>
  string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
    p2 ? p2.toUpperCase() : p1.toLowerCase(),
  );
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) =>
  classes
    .filter((className, index, array) => {
      return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    })
    .join(" ")
    .trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  (
    {
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    },
    ref,
  ) =>
    reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...(!children && !hasA11yProp(rest) && { "aria-hidden": "true" }),
        ...rest,
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...(Array.isArray(children) ? children : [children]),
      ],
    ),
);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(({ className, ...props }, ref) =>
    reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className,
      ),
      ...props,
    }),
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$7);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef",
    },
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
];
const Github = createLucideIcon("github", __iconNode$6);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }],
];
const Info = createLucideIcon("info", __iconNode$5);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$4);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm",
    },
  ],
];
const Moon = createLucideIcon("moon", __iconNode$3);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
      key: "2d38gg",
    },
  ],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }],
];
const OctagonX = createLucideIcon("octagon-x", __iconNode$2);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
];
const Sun = createLucideIcon("sun", __iconNode$1);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq",
    },
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const ThemeContext = reactExports.createContext(void 0);
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function getStoredTheme() {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = reactExports.useState("system");
  const [resolvedTheme, setResolvedTheme] = reactExports.useState("light");
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    setThemeState(stored);
    const resolved = stored === "system" ? getSystemTheme() : stored;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);
  reactExports.useEffect(() => {
    if (!mounted) return;
    const handleSystemThemeChange = (e) => {
      if (theme === "system") {
        const newResolved = e.matches ? "dark" : "light";
        setResolvedTheme(newResolved);
        document.documentElement.classList.toggle("dark", newResolved === "dark");
      }
    };
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme, mounted]);
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, {
    value: { theme, resolvedTheme, setTheme },
    children,
  });
}
function useTheme() {
  const context = reactExports.useContext(ThemeContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
      type: "button",
      className: "flex h-8 w-8 items-center justify-center text-muted-foreground",
      disabled: true,
      "aria-label": "Toggle theme",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
    type: "button",
    onClick: toggleTheme,
    className:
      "flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
    "aria-label": `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
    children:
      resolvedTheme === "dark"
        ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" })
        : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }),
  });
}
function Navbar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", {
    className: "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", {
      className: "container mx-auto flex h-14 items-center justify-between px-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "flex items-center gap-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
              to: "/",
              className: "font-display text-sm font-bold uppercase tracking-wider",
              children: "Better Fullstack",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "hidden items-center gap-1 sm:flex",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                to: "/new",
                className:
                  "px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
                children: "Builder",
              }),
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "flex items-center gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
              href: "https://github.com/Marve10s/Better-Fullstack",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-muted-foreground transition-colors hover:text-foreground",
              "aria-label": "GitHub",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-4 w-4" }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
          ],
        }),
      ],
    }),
  });
}
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet
    ? (style.styleSheet.cssText = code)
    : style.appendChild(document.createTextNode(code));
}
const getAsset = (type) => {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
};
const bars = Array(12).fill(0);
const Loader = ({ visible, className }) => {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: ["sonner-loading-wrapper", className].filter(Boolean).join(" "),
      "data-visible": visible,
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "sonner-spinner",
      },
      bars.map((_, i) =>
        /* @__PURE__ */ React.createElement("div", {
          className: "sonner-loading-bar",
          key: `spinner-bar-${i}`,
        }),
      ),
    ),
  );
};
const SuccessIcon = /* @__PURE__ */ React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20",
  },
  /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    clipRule: "evenodd",
  }),
);
const WarningIcon = /* @__PURE__ */ React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    height: "20",
    width: "20",
  },
  /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    clipRule: "evenodd",
  }),
);
const InfoIcon = /* @__PURE__ */ React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20",
  },
  /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    clipRule: "evenodd",
  }),
);
const ErrorIcon = /* @__PURE__ */ React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20",
  },
  /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    clipRule: "evenodd",
  }),
);
const CloseIcon = /* @__PURE__ */ React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  /* @__PURE__ */ React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18",
  }),
  /* @__PURE__ */ React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18",
  }),
);
const useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(document.hidden);
  React.useEffect(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", callback);
    return () => window.removeEventListener("visibilitychange", callback);
  }, []);
  return isDocumentHidden;
};
let toastsCounter = 1;
class Observer {
  constructor() {
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [...this.toasts, data];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id =
        typeof (data == null ? void 0 : data.id) === "number" ||
        ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0
          ? data.id
          : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message,
            });
            return {
              ...toast2,
              ...data,
              id,
              dismissible,
              title: message,
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id,
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() =>
          this.subscribers.forEach((subscriber) =>
            subscriber({
              id,
              dismiss: true,
            }),
          ),
        );
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) =>
            subscriber({
              id: toast2.id,
              dismiss: true,
            }),
          );
        });
      }
      return id;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message,
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error",
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message,
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message,
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message,
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message,
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0,
        });
      }
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p
        .then(async (response) => {
          result = ["resolve", response];
          const isReactElementResponse = React.isValidElement(response);
          if (isReactElementResponse) {
            shouldDismiss = false;
            this.create({
              id,
              type: "default",
              message: response,
            });
          } else if (isHttpResponse(response) && !response.ok) {
            shouldDismiss = false;
            const promiseData =
              typeof data.error === "function"
                ? await data.error(`HTTP error! status: ${response.status}`)
                : data.error;
            const description =
              typeof data.description === "function"
                ? await data.description(`HTTP error! status: ${response.status}`)
                : data.description;
            const isExtendedResult =
              typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: "error",
              description,
              ...toastSettings,
            });
          } else if (response instanceof Error) {
            shouldDismiss = false;
            const promiseData =
              typeof data.error === "function" ? await data.error(response) : data.error;
            const description =
              typeof data.description === "function"
                ? await data.description(response)
                : data.description;
            const isExtendedResult =
              typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: "error",
              description,
              ...toastSettings,
            });
          } else if (data.success !== void 0) {
            shouldDismiss = false;
            const promiseData =
              typeof data.success === "function" ? await data.success(response) : data.success;
            const description =
              typeof data.description === "function"
                ? await data.description(response)
                : data.description;
            const isExtendedResult =
              typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: "success",
              description,
              ...toastSettings,
            });
          }
        })
        .catch(async (error) => {
          result = ["reject", error];
          if (data.error !== void 0) {
            shouldDismiss = false;
            const promiseData =
              typeof data.error === "function" ? await data.error(error) : data.error;
            const description =
              typeof data.description === "function"
                ? await data.description(error)
                : data.description;
            const isExtendedResult =
              typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: "error",
              description,
              ...toastSettings,
            });
          }
        })
        .finally(() => {
          if (shouldDismiss) {
            this.dismiss(id);
            id = void 0;
          }
          data.finally == null ? void 0 : data.finally.call(data);
        });
      const unwrap = () =>
        new Promise((resolve, reject) =>
          originalPromise
            .then(() => (result[0] === "reject" ? reject(result[1]) : resolve(result[1])))
            .catch(reject),
        );
      if (typeof id !== "string" && typeof id !== "number") {
        return {
          unwrap,
        };
      } else {
        return Object.assign(id, {
          unwrap,
        });
      }
    };
    this.custom = (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id),
        id,
        ...data,
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ToastState = new Observer();
const toastFunction = (message, data) => {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id,
  });
  return id;
};
const isHttpResponse = (data) => {
  return (
    data &&
    typeof data === "object" &&
    "ok" in data &&
    typeof data.ok === "boolean" &&
    "status" in data &&
    typeof data.status === "number"
  );
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(
  basicToast,
  {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    custom: ToastState.custom,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading,
  },
  {
    getHistory,
    getToasts,
  },
);
__insertCSS(
  "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}",
);
function isAction(action) {
  return action.label !== void 0;
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const SWIPE_THRESHOLD = 45;
const TIME_BEFORE_UNMOUNT = 200;
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function getDefaultSwipeDirections(position) {
  const [y, x] = position.split("-");
  const directions = [];
  if (y) {
    directions.push(y);
  }
  if (x) {
    directions.push(x);
  }
  return directions;
}
const Toast = (props) => {
  var _toast_classNames,
    _toast_classNames1,
    _toast_classNames2,
    _toast_classNames3,
    _toast_classNames4,
    _toast_classNames5,
    _toast_classNames6,
    _toast_classNames7,
    _toast_classNames8;
  const {
    invert: ToasterInvert,
    toast: toast2,
    unstyled,
    interacting,
    setHeights,
    visibleToasts,
    heights,
    index,
    toasts,
    expanded,
    removeToast,
    defaultRichColors,
    closeButton: closeButtonFromToaster,
    style,
    cancelButtonStyle,
    actionButtonStyle,
    className = "",
    descriptionClassName = "",
    duration: durationFromToaster,
    position,
    gap,
    expandByDefault,
    classNames,
    icons,
    closeButtonAriaLabel = "Close toast",
  } = props;
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [swipeOutDirection, setSwipeOutDirection] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [swiping, setSwiping] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState(false);
  const [isSwiped, setIsSwiped] = React.useState(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0);
  const [initialHeight, setInitialHeight] = React.useState(0);
  const remainingTime = React.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
  const dragStartTime = React.useRef(null);
  const toastRef = React.useRef(null);
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast2.type;
  const dismissible = toast2.dismissible !== false;
  const toastClassname = toast2.className || "";
  const toastDescriptionClassname = toast2.descriptionClassName || "";
  const heightIndex = React.useMemo(
    () => heights.findIndex((height) => height.toastId === toast2.id) || 0,
    [heights, toast2.id],
  );
  const closeButton = React.useMemo(() => {
    var _toast_closeButton;
    return (_toast_closeButton = toast2.closeButton) != null
      ? _toast_closeButton
      : closeButtonFromToaster;
  }, [toast2.closeButton, closeButtonFromToaster]);
  const duration = React.useMemo(
    () => toast2.duration || durationFromToaster || TOAST_LIFETIME,
    [toast2.duration, durationFromToaster],
  );
  const closeTimerStartTimeRef = React.useRef(0);
  const offset = React.useRef(0);
  const lastCloseTimerStartTimeRef = React.useRef(0);
  const pointerStartRef = React.useRef(null);
  const [y, x] = position.split("-");
  const toastsHeightBefore = React.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) {
        return prev;
      }
      return prev + curr.height;
    }, 0);
  }, [heights, heightIndex]);
  const isDocumentHidden = useIsDocumentHidden();
  const invert = toast2.invert || ToasterInvert;
  const disabled = toastType === "loading";
  offset.current = React.useMemo(
    () => heightIndex * gap + toastsHeightBefore,
    [heightIndex, toastsHeightBefore],
  );
  React.useEffect(() => {
    remainingTime.current = duration;
  }, [duration]);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    const toastNode = toastRef.current;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      setHeights((h) => [
        {
          toastId: toast2.id,
          height,
          position: toast2.position,
        },
        ...h,
      ]);
      return () => setHeights((h) => h.filter((height2) => height2.toastId !== toast2.id));
    }
  }, [setHeights, toast2.id]);
  React.useLayoutEffect(() => {
    if (!mounted) return;
    const toastNode = toastRef.current;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    setHeights((heights2) => {
      const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
      if (!alreadyExists) {
        return [
          {
            toastId: toast2.id,
            height: newHeight,
            position: toast2.position,
          },
          ...heights2,
        ];
      } else {
        return heights2.map((height) =>
          height.toastId === toast2.id
            ? {
                ...height,
                height: newHeight,
              }
            : height,
        );
      }
    });
  }, [
    mounted,
    toast2.title,
    toast2.description,
    setHeights,
    toast2.id,
    toast2.jsx,
    toast2.action,
    toast2.cancel,
  ]);
  const deleteToast = React.useCallback(() => {
    setRemoved(true);
    setOffsetBeforeRemove(offset.current);
    setHeights((h) => h.filter((height) => height.toastId !== toast2.id));
    setTimeout(() => {
      removeToast(toast2);
    }, TIME_BEFORE_UNMOUNT);
  }, [toast2, removeToast, setHeights, offset]);
  React.useEffect(() => {
    if (
      (toast2.promise && toastType === "loading") ||
      toast2.duration === Infinity ||
      toast2.type === "loading"
    )
      return;
    let timeoutId;
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
        const elapsedTime = /* @__PURE__ */ new Date().getTime() - closeTimerStartTimeRef.current;
        remainingTime.current = remainingTime.current - elapsedTime;
      }
      lastCloseTimerStartTimeRef.current = /* @__PURE__ */ new Date().getTime();
    };
    const startTimer = () => {
      if (remainingTime.current === Infinity) return;
      closeTimerStartTimeRef.current = /* @__PURE__ */ new Date().getTime();
      timeoutId = setTimeout(() => {
        toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
        deleteToast();
      }, remainingTime.current);
    };
    if (expanded || interacting || isDocumentHidden) {
      pauseTimer();
    } else {
      startTimer();
    }
    return () => clearTimeout(timeoutId);
  }, [expanded, interacting, toast2, toastType, isDocumentHidden, deleteToast]);
  React.useEffect(() => {
    if (toast2.delete) {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    }
  }, [deleteToast, toast2.delete]);
  function getLoadingIcon() {
    var _toast_classNames9;
    if (icons == null ? void 0 : icons.loading) {
      var _toast_classNames12;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          className: cn(
            classNames == null ? void 0 : classNames.loader,
            toast2 == null
              ? void 0
              : (_toast_classNames12 = toast2.classNames) == null
                ? void 0
                : _toast_classNames12.loader,
            "sonner-loader",
          ),
          "data-visible": toastType === "loading",
        },
        icons.loading,
      );
    }
    return /* @__PURE__ */ React.createElement(Loader, {
      className: cn(
        classNames == null ? void 0 : classNames.loader,
        toast2 == null
          ? void 0
          : (_toast_classNames9 = toast2.classNames) == null
            ? void 0
            : _toast_classNames9.loader,
      ),
      visible: toastType === "loading",
    });
  }
  const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
  var _toast_richColors, _icons_close;
  return /* @__PURE__ */ React.createElement(
    "li",
    {
      tabIndex: 0,
      ref: toastRef,
      className: cn(
        className,
        toastClassname,
        classNames == null ? void 0 : classNames.toast,
        toast2 == null
          ? void 0
          : (_toast_classNames = toast2.classNames) == null
            ? void 0
            : _toast_classNames.toast,
        classNames == null ? void 0 : classNames.default,
        classNames == null ? void 0 : classNames[toastType],
        toast2 == null
          ? void 0
          : (_toast_classNames1 = toast2.classNames) == null
            ? void 0
            : _toast_classNames1[toastType],
      ),
      "data-sonner-toast": "",
      "data-rich-colors":
        (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
      "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
      "data-mounted": mounted,
      "data-promise": Boolean(toast2.promise),
      "data-swiped": isSwiped,
      "data-removed": removed,
      "data-visible": isVisible,
      "data-y-position": y,
      "data-x-position": x,
      "data-index": index,
      "data-front": isFront,
      "data-swiping": swiping,
      "data-dismissible": dismissible,
      "data-type": toastType,
      "data-invert": invert,
      "data-swipe-out": swipeOut,
      "data-swipe-direction": swipeOutDirection,
      "data-expanded": Boolean(expanded || (expandByDefault && mounted)),
      "data-testid": toast2.testId,
      style: {
        "--index": index,
        "--toasts-before": index,
        "--z-index": toasts.length - index,
        "--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
        "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
        ...style,
        ...toast2.style,
      },
      onDragEnd: () => {
        setSwiping(false);
        setSwipeDirection(null);
        pointerStartRef.current = null;
      },
      onPointerDown: (event) => {
        if (event.button === 2) return;
        if (disabled || !dismissible) return;
        dragStartTime.current = /* @__PURE__ */ new Date();
        setOffsetBeforeRemove(offset.current);
        event.target.setPointerCapture(event.pointerId);
        if (event.target.tagName === "BUTTON") return;
        setSwiping(true);
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      },
      onPointerUp: () => {
        var _toastRef_current, _toastRef_current1, _dragStartTime_current;
        if (swipeOut || !dismissible) return;
        pointerStartRef.current = null;
        const swipeAmountX = Number(
          ((_toastRef_current = toastRef.current) == null
            ? void 0
            : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0,
        );
        const swipeAmountY = Number(
          ((_toastRef_current1 = toastRef.current) == null
            ? void 0
            : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0,
        );
        const timeTaken =
          /* @__PURE__ */ new Date().getTime() -
          ((_dragStartTime_current = dragStartTime.current) == null
            ? void 0
            : _dragStartTime_current.getTime());
        const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
        const velocity = Math.abs(swipeAmount) / timeTaken;
        if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
          setOffsetBeforeRemove(offset.current);
          toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
          if (swipeDirection === "x") {
            setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
          } else {
            setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
          }
          deleteToast();
          setSwipeOut(true);
          return;
        } else {
          var _toastRef_current2, _toastRef_current3;
          (_toastRef_current2 = toastRef.current) == null
            ? void 0
            : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
          (_toastRef_current3 = toastRef.current) == null
            ? void 0
            : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
        }
        setIsSwiped(false);
        setSwiping(false);
        setSwipeDirection(null);
      },
      onPointerMove: (event) => {
        var _window_getSelection, _toastRef_current, _toastRef_current1;
        if (!pointerStartRef.current || !dismissible) return;
        const isHighlighted =
          ((_window_getSelection = window.getSelection()) == null
            ? void 0
            : _window_getSelection.toString().length) > 0;
        if (isHighlighted) return;
        const yDelta = event.clientY - pointerStartRef.current.y;
        const xDelta = event.clientX - pointerStartRef.current.x;
        var _props_swipeDirections;
        const swipeDirections =
          (_props_swipeDirections = props.swipeDirections) != null
            ? _props_swipeDirections
            : getDefaultSwipeDirections(position);
        if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
          setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
        }
        let swipeAmount = {
          x: 0,
          y: 0,
        };
        const getDampening = (delta) => {
          const factor = Math.abs(delta) / 20;
          return 1 / (1.5 + factor);
        };
        if (swipeDirection === "y") {
          if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
            if (
              (swipeDirections.includes("top") && yDelta < 0) ||
              (swipeDirections.includes("bottom") && yDelta > 0)
            ) {
              swipeAmount.y = yDelta;
            } else {
              const dampenedDelta = yDelta * getDampening(yDelta);
              swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
            }
          }
        } else if (swipeDirection === "x") {
          if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
            if (
              (swipeDirections.includes("left") && xDelta < 0) ||
              (swipeDirections.includes("right") && xDelta > 0)
            ) {
              swipeAmount.x = xDelta;
            } else {
              const dampenedDelta = xDelta * getDampening(xDelta);
              swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
            }
          }
        }
        if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
          setIsSwiped(true);
        }
        (_toastRef_current = toastRef.current) == null
          ? void 0
          : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
        (_toastRef_current1 = toastRef.current) == null
          ? void 0
          : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
      },
    },
    closeButton && !toast2.jsx && toastType !== "loading"
      ? /* @__PURE__ */ React.createElement(
          "button",
          {
            "aria-label": closeButtonAriaLabel,
            "data-disabled": disabled,
            "data-close-button": true,
            onClick:
              disabled || !dismissible
                ? () => {}
                : () => {
                    deleteToast();
                    toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
                  },
            className: cn(
              classNames == null ? void 0 : classNames.closeButton,
              toast2 == null
                ? void 0
                : (_toast_classNames2 = toast2.classNames) == null
                  ? void 0
                  : _toast_classNames2.closeButton,
            ),
          },
          (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon,
        )
      : null,
    (toastType || toast2.icon || toast2.promise) &&
      toast2.icon !== null &&
      ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon)
      ? /* @__PURE__ */ React.createElement(
          "div",
          {
            "data-icon": "",
            className: cn(
              classNames == null ? void 0 : classNames.icon,
              toast2 == null
                ? void 0
                : (_toast_classNames3 = toast2.classNames) == null
                  ? void 0
                  : _toast_classNames3.icon,
            ),
          },
          toast2.promise || (toast2.type === "loading" && !toast2.icon)
            ? toast2.icon || getLoadingIcon()
            : null,
          toast2.type !== "loading" ? icon : null,
        )
      : null,
    /* @__PURE__ */ React.createElement(
      "div",
      {
        "data-content": "",
        className: cn(
          classNames == null ? void 0 : classNames.content,
          toast2 == null
            ? void 0
            : (_toast_classNames4 = toast2.classNames) == null
              ? void 0
              : _toast_classNames4.content,
        ),
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          "data-title": "",
          className: cn(
            classNames == null ? void 0 : classNames.title,
            toast2 == null
              ? void 0
              : (_toast_classNames5 = toast2.classNames) == null
                ? void 0
                : _toast_classNames5.title,
          ),
        },
        toast2.jsx
          ? toast2.jsx
          : typeof toast2.title === "function"
            ? toast2.title()
            : toast2.title,
      ),
      toast2.description
        ? /* @__PURE__ */ React.createElement(
            "div",
            {
              "data-description": "",
              className: cn(
                descriptionClassName,
                toastDescriptionClassname,
                classNames == null ? void 0 : classNames.description,
                toast2 == null
                  ? void 0
                  : (_toast_classNames6 = toast2.classNames) == null
                    ? void 0
                    : _toast_classNames6.description,
              ),
            },
            typeof toast2.description === "function" ? toast2.description() : toast2.description,
          )
        : null,
    ),
    /* @__PURE__ */ React.isValidElement(toast2.cancel)
      ? toast2.cancel
      : toast2.cancel && isAction(toast2.cancel)
        ? /* @__PURE__ */ React.createElement(
            "button",
            {
              "data-button": true,
              "data-cancel": true,
              style: toast2.cancelButtonStyle || cancelButtonStyle,
              onClick: (event) => {
                if (!isAction(toast2.cancel)) return;
                if (!dismissible) return;
                toast2.cancel.onClick == null
                  ? void 0
                  : toast2.cancel.onClick.call(toast2.cancel, event);
                deleteToast();
              },
              className: cn(
                classNames == null ? void 0 : classNames.cancelButton,
                toast2 == null
                  ? void 0
                  : (_toast_classNames7 = toast2.classNames) == null
                    ? void 0
                    : _toast_classNames7.cancelButton,
              ),
            },
            toast2.cancel.label,
          )
        : null,
    /* @__PURE__ */ React.isValidElement(toast2.action)
      ? toast2.action
      : toast2.action && isAction(toast2.action)
        ? /* @__PURE__ */ React.createElement(
            "button",
            {
              "data-button": true,
              "data-action": true,
              style: toast2.actionButtonStyle || actionButtonStyle,
              onClick: (event) => {
                if (!isAction(toast2.action)) return;
                toast2.action.onClick == null
                  ? void 0
                  : toast2.action.onClick.call(toast2.action, event);
                if (event.defaultPrevented) return;
                deleteToast();
              },
              className: cn(
                classNames == null ? void 0 : classNames.actionButton,
                toast2 == null
                  ? void 0
                  : (_toast_classNames8 = toast2.classNames) == null
                    ? void 0
                    : _toast_classNames8.actionButton,
              ),
            },
            toast2.action.label,
          )
        : null,
  );
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
  const styles = {};
  [defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      ["top", "right", "bottom", "left"].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      ["top", "right", "bottom", "left"].forEach((key) => {
        if (offset[key] === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] =
            typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
const Toaster$1 = /* @__PURE__ */ React.forwardRef(function Toaster(props, ref) {
  const {
    id,
    invert,
    position = "bottom-right",
    hotkey = ["altKey", "KeyT"],
    expand,
    closeButton,
    className,
    offset,
    mobileOffset,
    theme = "light",
    richColors,
    duration,
    style,
    visibleToasts = VISIBLE_TOASTS_AMOUNT,
    toastOptions,
    dir = getDocumentDirection(),
    gap = GAP,
    icons,
    containerAriaLabel = "Notifications",
  } = props;
  const [toasts, setToasts] = React.useState([]);
  const filteredToasts = React.useMemo(() => {
    if (id) {
      return toasts.filter((toast2) => toast2.toasterId === id);
    }
    return toasts.filter((toast2) => !toast2.toasterId);
  }, [toasts, id]);
  const possiblePositions = React.useMemo(() => {
    return Array.from(
      new Set(
        [position].concat(
          filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position),
        ),
      ),
    );
  }, [filteredToasts, position]);
  const [heights, setHeights] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);
  const [actualTheme, setActualTheme] = React.useState(
    theme !== "system"
      ? theme
      : typeof window !== "undefined"
        ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : "light",
  );
  const listRef = React.useRef(null);
  const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const lastFocusedElementRef = React.useRef(null);
  const isFocusWithinRef = React.useRef(false);
  const removeToast = React.useCallback((toastToRemove) => {
    setToasts((toasts2) => {
      var _toasts_find;
      if (
        !((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null
          ? void 0
          : _toasts_find.delete)
      ) {
        ToastState.dismiss(toastToRemove.id);
      }
      return toasts2.filter(({ id: id2 }) => id2 !== toastToRemove.id);
    });
  }, []);
  React.useEffect(() => {
    return ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        requestAnimationFrame(() => {
          setToasts((toasts2) =>
            toasts2.map((t) =>
              t.id === toast2.id
                ? {
                    ...t,
                    delete: true,
                  }
                : t,
            ),
          );
        });
        return;
      }
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setToasts((toasts2) => {
            const indexOfExistingToast = toasts2.findIndex((t) => t.id === toast2.id);
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts2.slice(0, indexOfExistingToast),
                {
                  ...toasts2[indexOfExistingToast],
                  ...toast2,
                },
                ...toasts2.slice(indexOfExistingToast + 1),
              ];
            }
            return [toast2, ...toasts2];
          });
        });
      });
    });
  }, [toasts]);
  React.useEffect(() => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setActualTheme("dark");
      } else {
        setActualTheme("light");
      }
    }
    if (typeof window === "undefined") return;
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      darkMediaQuery.addEventListener("change", ({ matches }) => {
        if (matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      });
    } catch (error) {
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [theme]);
  React.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [toasts]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      var _listRef_current;
      const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        var _listRef_current1;
        setExpanded(true);
        (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
      }
      if (
        event.code === "Escape" &&
        (document.activeElement === listRef.current ||
          ((_listRef_current = listRef.current) == null
            ? void 0
            : _listRef_current.contains(document.activeElement)))
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hotkey]);
  React.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({
            preventScroll: true,
          });
          lastFocusedElementRef.current = null;
          isFocusWithinRef.current = false;
        }
      };
    }
  }, [listRef.current]);
  return (
    // Remove item from normal navigation flow, only available via hotkey
    /* @__PURE__ */ React.createElement(
      "section",
      {
        ref,
        "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
        tabIndex: -1,
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-atomic": "false",
        suppressHydrationWarning: true,
      },
      possiblePositions.map((position2, index) => {
        var _heights_;
        const [y, x] = position2.split("-");
        if (!filteredToasts.length) return null;
        return /* @__PURE__ */ React.createElement(
          "ol",
          {
            key: position2,
            dir: dir === "auto" ? getDocumentDirection() : dir,
            tabIndex: -1,
            ref: listRef,
            className,
            "data-sonner-toaster": true,
            "data-sonner-theme": actualTheme,
            "data-y-position": y,
            "data-x-position": x,
            style: {
              "--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
              "--width": `${TOAST_WIDTH}px`,
              "--gap": `${gap}px`,
              ...style,
              ...assignOffset(offset, mobileOffset),
            },
            onBlur: (event) => {
              if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
                isFocusWithinRef.current = false;
                if (lastFocusedElementRef.current) {
                  lastFocusedElementRef.current.focus({
                    preventScroll: true,
                  });
                  lastFocusedElementRef.current = null;
                }
              }
            },
            onFocus: (event) => {
              const isNotDismissible =
                event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
              if (isNotDismissible) return;
              if (!isFocusWithinRef.current) {
                isFocusWithinRef.current = true;
                lastFocusedElementRef.current = event.relatedTarget;
              }
            },
            onMouseEnter: () => setExpanded(true),
            onMouseMove: () => setExpanded(true),
            onMouseLeave: () => {
              if (!interacting) {
                setExpanded(false);
              }
            },
            onDragEnd: () => setExpanded(false),
            onPointerDown: (event) => {
              const isNotDismissible =
                event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
              if (isNotDismissible) return;
              setInteracting(true);
            },
            onPointerUp: () => setInteracting(false),
          },
          filteredToasts
            .filter((toast2) => (!toast2.position && index === 0) || toast2.position === position2)
            .map((toast2, index2) => {
              var _toastOptions_duration, _toastOptions_closeButton;
              return /* @__PURE__ */ React.createElement(Toast, {
                key: toast2.id,
                icons,
                index: index2,
                toast: toast2,
                defaultRichColors: richColors,
                duration:
                  (_toastOptions_duration =
                    toastOptions == null ? void 0 : toastOptions.duration) != null
                    ? _toastOptions_duration
                    : duration,
                className: toastOptions == null ? void 0 : toastOptions.className,
                descriptionClassName:
                  toastOptions == null ? void 0 : toastOptions.descriptionClassName,
                invert,
                visibleToasts,
                closeButton:
                  (_toastOptions_closeButton =
                    toastOptions == null ? void 0 : toastOptions.closeButton) != null
                    ? _toastOptions_closeButton
                    : closeButton,
                interacting,
                position: position2,
                style: toastOptions == null ? void 0 : toastOptions.style,
                unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
                classNames: toastOptions == null ? void 0 : toastOptions.classNames,
                cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
                actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
                closeButtonAriaLabel:
                  toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
                removeToast,
                toasts: filteredToasts.filter((t) => t.position == toast2.position),
                heights: heights.filter((h) => h.position == toast2.position),
                setHeights,
                expandByDefault: expand,
                gap,
                expanded,
                swipeDirections: props.swipeDirections,
              });
            }),
        );
      }),
    )
  );
});
const Toaster2 = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster$1, {
    theme,
    className: "toaster group",
    icons: {
      success: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
      info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4" }),
      warning: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
      error: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonX, { className: "size-4" }),
      loading: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, {
        className: "size-4 animate-spin",
      }),
    },
    style: {
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
      "--border-radius": "var(--radius)",
    },
    toastOptions: {
      classNames: {
        toast: "cn-toast",
      },
    },
    ...props,
  });
};
function Providers({ children }) {
  {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, {
      children: [children, /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster2, {})],
    });
  }
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
        className: "font-bold text-4xl text-foreground",
        children: "404",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-muted-foreground",
        children: "The page you're looking for doesn't exist.",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        to: "/",
        className:
          "rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90",
        children: "Go Home",
      }),
    ],
  });
}
const Route$3 = createRootRoute({
  notFoundComponent: NotFoundComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Better Fullstack" },
      {
        name: "description",
        content:
          "A CLI tool for scaffolding production-ready fullstack projects with customizable configurations. Supports multiple languages and frameworks.",
      },
      {
        name: "keywords",
        content:
          "fullstack, CLI, project scaffolding, boilerplate, TypeScript, Rust, Drizzle, Prisma, hono, elysia, turborepo, trpc, orpc, turso, neon, Better-Auth, convex, monorepo, Better-Fullstack",
      },
      { property: "og:title", content: "Better Fullstack" },
      {
        property: "og:description",
        content:
          "A CLI tool for scaffolding production-ready fullstack projects with customizable configurations. Supports multiple languages and frameworks.",
      },
      { property: "og:site_name", content: "Better Fullstack" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Better Fullstack" },
      {
        name: "twitter:description",
        content:
          "A CLI tool for scaffolding production-ready fullstack projects with customizable configurations. Supports multiple languages and frameworks.",
      },
    ],
    links: [
      { rel: "icon", href: "/logo.svg" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(RootDocument, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    ],
  });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", {
    lang: "en",
    className: "font-sans",
    suppressHydrationWarning: true,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("head", {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("body", {
        className: "bg-background text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Providers, { children }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {}),
        ],
      }),
    ],
  });
}
var util;
(function (util2) {
  util2.assertEqual = (_) => {};
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function (e) {
      return obj[e];
    });
  };
  util2.objectKeys =
    typeof Object.keys === "function"
      ? (obj) => Object.keys(obj)
      : (object) => {
          const keys = [];
          for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
              keys.push(key);
            }
          }
          return keys;
        };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item)) return item;
    }
    return void 0;
  };
  util2.isInteger =
    typeof Number.isInteger === "function"
      ? (val) => Number.isInteger(val)
      : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => (typeof val === "string" ? `'${val}'` : val)).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function (objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second,
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set",
]);
const getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (
        data.then &&
        typeof data.then === "function" &&
        data.catch &&
        typeof data.catch === "function"
      ) {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
const ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite",
]);
class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper =
      _mapper ||
      function (issue) {
        return issue.message;
      };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
let overrideErrorMap = errorMap;
function getErrorMap() {
  return overrideErrorMap;
}
const makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...(issueData.path || [])];
  const fullIssue = {
    ...issueData,
    path: fullPath,
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message,
    };
  }
  let errorMessage = "";
  const maps = errorMaps
    .filter((m) => !!m)
    .slice()
    .reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage,
  };
};
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap,
      // then global default map
    ].filter((x) => !!x),
  });
  ctx.common.issues.push(issue);
}
class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid") this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted") this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted") return INVALID;
      if (s.status === "dirty") status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value,
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted") return INVALID;
      if (value.status === "aborted") return INVALID;
      if (key.status === "dirty") status.dirty();
      if (value.status === "dirty") status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
const INVALID = Object.freeze({
  status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function (errorUtil2) {
  errorUtil2.errToObj = (message) => (typeof message === "string" ? { message } : message || {});
  errorUtil2.toString = (message) =>
    typeof message === "string" ? message : message == null ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
const handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error) return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      },
    };
  }
};
function processCreateParams(params) {
  if (!params) return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  }
  if (errorMap2) return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type") return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return (
      ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent,
      }
    );
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent,
      },
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success) return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: (params == null ? void 0 : params.async) ?? false,
        contextualErrorMap: params == null ? void 0 : params.errorMap,
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async,
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result)
          ? {
              value: result.value,
            }
          : {
              issues: ctx.common.issues,
            };
      } catch (err) {
        if (
          (_b = (_a = err == null ? void 0 : err.message) == null ? void 0 : _a.toLowerCase()) ==
          null
            ? void 0
            : _b.includes("encountered")
        ) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true,
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) =>
      isValid(result)
        ? {
            value: result.value,
          }
        : {
            issues: ctx.common.issues,
          },
    );
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success) return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params == null ? void 0 : params.errorMap,
        async: true,
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult)
      ? maybeAsyncResult
      : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () =>
        ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val),
        });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(
          typeof refinementData === "function" ? refinementData(val, ctx) : refinementData,
        );
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement },
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data),
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform },
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def),
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description,
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex =
  /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
const ipv4Regex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt)) return false;
  try {
    const [header] = jwt.split(".");
    if (!header) return false;
    const base64 = header
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(header.length + ((4 - (header.length % 4)) % 4), "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null) return false;
    if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT") return false;
    if (!decoded.alg) return false;
    if (alg && decoded.alg !== alg) return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message,
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message,
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message),
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message),
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options,
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision:
        typeof (options == null ? void 0 : options.precision) === "undefined"
          ? null
          : options == null
            ? void 0
            : options.precision,
      offset: (options == null ? void 0 : options.offset) ?? false,
      local: (options == null ? void 0 : options.local) ?? false,
      ...errorUtil.errToObj(options == null ? void 0 : options.message),
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options,
      });
    }
    return this._addCheck({
      kind: "time",
      precision:
        typeof (options == null ? void 0 : options.precision) === "undefined"
          ? null
          : options == null
            ? void 0
            : options.precision,
      ...errorUtil.errToObj(options == null ? void 0 : options.message),
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message),
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options == null ? void 0 : options.position,
      ...errorUtil.errToObj(options == null ? void 0 : options.message),
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message),
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message),
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message),
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message),
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message),
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }],
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }],
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }],
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (params == null ? void 0 : params.coerce) ?? false,
    ...processCreateParams(params),
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return (valInt % stepInt) / 10 ** decCount;
}
class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message),
        },
      ],
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message),
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message),
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message),
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message),
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message),
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find(
      (ch) => ch.kind === "int" || (ch.kind === "multipleOf" && util.isInteger(ch.value)),
    );
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min) min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params),
  });
};
class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType,
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message),
        },
      ],
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message),
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (params == null ? void 0 : params.coerce) ?? false,
    ...processCreateParams(params),
  });
};
class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params),
  });
};
class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date,
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date",
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date",
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime()),
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message),
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message),
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params == null ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params),
  });
};
class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params),
  });
};
class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params),
  });
};
class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params),
  });
};
class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params),
  });
};
class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params),
  });
};
class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType,
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params),
  });
};
class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params),
  });
};
class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message,
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message,
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message,
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all(
        [...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        }),
      ).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) },
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) },
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) },
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params),
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape,
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element),
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data,
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] },
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys,
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip");
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key),
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data,
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve()
        .then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet,
            });
          }
          return syncPairs;
        })
        .then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...(message !== void 0
        ? {
            errorMap: (issue, ctx) => {
              var _a, _b;
              const defaultError =
                ((_b = (_a = this._def).errorMap) == null
                  ? void 0
                  : _b.call(_a, issue, ctx).message) ?? ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: errorUtil.errToObj(message).message ?? defaultError,
                };
              return {
                message: defaultError,
              };
            },
          }
        : {}),
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip",
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough",
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation,
      }),
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape(),
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject,
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index,
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape,
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape,
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape,
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape,
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors,
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(
        options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: [],
            },
            parent: null,
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx,
            }),
            ctx: childCtx,
          };
        }),
      ).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: [],
          },
          parent: null,
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx,
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors,
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params),
  });
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types,
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(
        this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
        this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
      );
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params),
  });
};
class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array",
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array",
      });
      status.dirty();
    }
    const items = [...ctx.data]
      .map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema) return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      })
      .filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest,
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params),
  });
};
class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params),
  });
};
class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message,
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message,
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted") return INVALID;
        if (element.status === "dirty") status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) =>
      valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)),
    );
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) },
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) },
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params),
  });
};
class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params),
  });
};
class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value,
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params),
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params),
  });
}
class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef,
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(
      this.options.filter((opt) => !values.includes(opt)),
      {
        ...this._def,
        ...newDef,
      },
    );
  }
}
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params),
  });
};
class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const promisified =
      ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(
      promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap,
        });
      }),
    );
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params),
  });
};
class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      },
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted") return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx,
          });
          if (result.status === "aborted") return INVALID;
          if (result.status === "dirty") return DIRTY(result.value);
          if (status.value === "dirty") return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted") return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx,
        });
        if (result.status === "aborted") return INVALID;
        if (result.status === "dirty") return DIRTY(result.value);
        if (status.value === "dirty") return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error(
            "Async refinement encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (inner.status === "aborted") return INVALID;
        if (inner.status === "dirty") status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then((inner) => {
            if (inner.status === "aborted") return INVALID;
            if (inner.status === "dirty") status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (!isValid(base)) return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(
            `Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`,
          );
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then((base) => {
            if (!isValid(base)) return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
              status: status.value,
              value: result,
            }));
          });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params),
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params),
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params),
  });
};
class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params),
  });
};
class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx,
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params),
  });
};
class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: [],
      },
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx,
      },
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value:
            result2.status === "valid"
              ? result2.value
              : this._def.catchValue({
                  get error() {
                    return new ZodError(newCtx.common.issues);
                  },
                  input: newCtx.data,
                }),
        };
      });
    } else {
      return {
        status: "valid",
        value:
          result.status === "valid"
            ? result.value
            : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data,
              }),
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params),
  });
};
class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params),
  });
};
class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx,
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (inResult.status === "aborted") return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx,
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
      if (inResult.status === "aborted") return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value,
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx,
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline,
    });
  }
}
class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params),
  });
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const stringType = ZodString.create;
ZodNever.create;
ZodArray.create;
const objectType = ZodObject.create;
ZodUnion.create;
ZodIntersection.create;
ZodTuple.create;
const enumType = ZodEnum.create;
ZodPromise.create;
ZodOptional.create;
ZodNullable.create;
const zodValidator = (options) => {
  const input = "input" in options ? options.input : "input";
  const output = "output" in options ? options.output : "output";
  const _input = "schema" in options ? options.schema._input : options._input;
  const _output = "schema" in options ? options.schema._output : options._output;
  return {
    types: {
      input: input === "output" ? _output : _input,
      output: output === "input" ? _input : _output,
    },
    parse: (input2) => ("schema" in options ? options.schema.parse(input2) : options.parse(input2)),
  };
};
const TECH_OPTIONS = {
  api: [
    {
      id: "trpc",
      name: "tRPC",
      description: "End-to-end typesafe APIs",
      icon: "https://cdn.simpleicons.org/trpc/398CCB",
      color: "from-blue-500 to-blue-700",
      default: true,
    },
    {
      id: "orpc",
      name: "oRPC",
      description: "Typesafe APIs Made Simple",
      icon: "/icon/orpc.svg",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "ts-rest",
      name: "ts-rest",
      description: "RPC-like client for REST APIs",
      icon: "",
      color: "from-green-400 to-green-600",
    },
    {
      id: "garph",
      name: "Garph",
      description: "Fullstack GraphQL Framework for TypeScript",
      icon: "",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "none",
      name: "No API",
      description: "No API layer (API routes disabled)",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  webFrontend: [
    {
      id: "tanstack-router",
      name: "TanStack Router",
      description: "Modern type-safe router for React",
      icon: "/icon/tanstack.png",
      color: "from-blue-400 to-blue-600",
      default: true,
    },
    {
      id: "react-router",
      name: "React Router",
      description: "Declarative routing for React",
      icon: "/icon/react-router.svg",
      color: "from-cyan-400 to-cyan-600",
      default: false,
    },
    {
      id: "tanstack-start",
      name: "TanStack Start",
      description: "Full-stack React and Solid framework powered by TanStack Router",
      icon: "/icon/tanstack.png",
      color: "from-purple-400 to-purple-600",
      default: false,
    },
    {
      id: "next",
      name: "Next.js",
      description: "React framework with hybrid rendering",
      icon: "https://cdn.simpleicons.org/nextdotjs",
      color: "from-gray-700 to-black",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "nuxt",
      name: "Nuxt",
      description: "Vue full-stack framework (SSR, SSG, hybrid)",
      icon: "/icon/nuxt-js.svg",
      color: "from-green-400 to-green-700",
      default: false,
    },
    {
      id: "svelte",
      name: "Svelte",
      description: "Cybernetically enhanced web apps",
      icon: "/icon/svelte.png",
      color: "from-orange-500 to-orange-700",
      default: false,
    },
    {
      id: "solid",
      name: "Solid",
      description: "Simple and performant reactivity for building UIs",
      icon: "/icon/solid.svg",
      color: "from-blue-600 to-blue-800",
      default: false,
    },
    {
      id: "astro",
      name: "Astro",
      description: "Content-focused with Island Architecture",
      icon: "/icon/astro.svg",
      color: "from-purple-500 to-orange-500",
      default: false,
    },
    {
      id: "qwik",
      name: "Qwik",
      description: "Resumable framework with instant load times",
      icon: "https://cdn.simpleicons.org/qwik/AC7EF4",
      color: "from-purple-400 to-purple-600",
      default: false,
    },
    {
      id: "angular",
      name: "Angular",
      description: "Enterprise-grade TypeScript framework by Google",
      icon: "https://cdn.simpleicons.org/angular/DD0031",
      color: "from-red-500 to-red-700",
      default: false,
    },
    {
      id: "redwood",
      name: "RedwoodJS",
      description: "Opinionated fullstack (React + GraphQL + Prisma)",
      icon: "https://cdn.simpleicons.org/redwoodjs/BF4722",
      color: "from-red-600 to-orange-500",
      default: false,
    },
    {
      id: "fresh",
      name: "Fresh",
      description: "Deno-native framework with islands architecture",
      icon: "https://cdn.simpleicons.org/deno/000000",
      color: "from-teal-400 to-cyan-600",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "none",
      name: "No Web Frontend",
      description: "No web-based frontend",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  nativeFrontend: [
    {
      id: "native-bare",
      name: "Expo + Bare",
      description: "Expo with StyleSheet (no styling library)",
      icon: "https://cdn.simpleicons.org/expo",
      color: "from-blue-400 to-blue-600",
      className: "invert-0 dark:invert",
      default: true,
    },
    {
      id: "native-uniwind",
      name: "Expo + Uniwind",
      description: "Fastest Tailwind bindings for React Native with HeroUI Native",
      icon: "https://cdn.simpleicons.org/expo",
      color: "from-purple-400 to-purple-600",
      className: "invert-0 dark:invert",
      default: false,
    },
    {
      id: "native-unistyles",
      name: "Expo + Unistyles",
      description: "Expo with Unistyles (type-safe styling)",
      icon: "https://cdn.simpleicons.org/expo",
      color: "from-pink-400 to-pink-600",
      className: "invert-0 dark:invert",
      default: false,
    },
    {
      id: "none",
      name: "No Native Frontend",
      description: "No native mobile frontend",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  astroIntegration: [
    {
      id: "react",
      name: "React",
      description: "Full React component support (required for tRPC)",
      icon: "https://cdn.simpleicons.org/react/61DAFB",
      color: "from-cyan-400 to-cyan-600",
      default: true,
    },
    {
      id: "vue",
      name: "Vue",
      description: "Vue 3 component support",
      icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D",
      color: "from-green-400 to-green-600",
    },
    {
      id: "svelte",
      name: "Svelte",
      description: "Svelte component support",
      icon: "/icon/svelte.png",
      color: "from-orange-500 to-orange-700",
    },
    {
      id: "solid",
      name: "Solid",
      description: "SolidJS component support",
      icon: "/icon/solid.svg",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "none",
      name: "None",
      description: "Astro components only (no client-side JS framework)",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  runtime: [
    {
      id: "bun",
      name: "Bun",
      description: "Fast JavaScript runtime & toolkit",
      icon: "https://cdn.simpleicons.org/bun/FBF0DF",
      color: "from-amber-400 to-amber-600",
      default: true,
    },
    {
      id: "node",
      name: "Node.js",
      description: "JavaScript runtime environment",
      icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
      color: "from-green-400 to-green-600",
    },
    {
      id: "workers",
      name: "Cloudflare Workers",
      description: "Serverless runtime for the edge",
      icon: "https://cdn.simpleicons.org/cloudflareworkers/F38020",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "none",
      name: "No Runtime",
      description: "No specific runtime",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  backend: [
    {
      id: "hono",
      name: "Hono",
      description: "Ultrafast web framework",
      icon: "/icon/hono.svg",
      color: "from-blue-500 to-blue-700",
      default: true,
    },
    {
      id: "elysia",
      name: "Elysia",
      description: "TypeScript web framework",
      icon: "/icon/elysia.svg",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "express",
      name: "Express",
      description: "Popular Node.js framework",
      icon: "https://cdn.simpleicons.org/express",
      color: "from-gray-500 to-gray-700",
      className: "invert-0 dark:invert",
    },
    {
      id: "fastify",
      name: "Fastify",
      description: "Fast, low-overhead web framework for Node.js",
      icon: "https://cdn.simpleicons.org/fastify",
      color: "from-gray-500 to-gray-700",
      className: "invert-0 dark:invert",
    },
    {
      id: "nestjs",
      name: "NestJS",
      description: "Progressive Node.js framework for enterprise apps",
      icon: "https://cdn.simpleicons.org/nestjs/E0234E",
      color: "from-red-500 to-red-700",
    },
    {
      id: "encore",
      name: "Encore.ts",
      description: "Type-safe backend with built-in infrastructure",
      icon: "https://encore.dev/assets/branding/logo/logo.svg",
      color: "from-violet-500 to-indigo-700",
    },
    {
      id: "adonisjs",
      name: "AdonisJS",
      description: "Full-featured MVC framework for Node.js",
      icon: "https://cdn.simpleicons.org/adonisjs/5A45FF",
      color: "from-indigo-500 to-purple-700",
    },
    {
      id: "nitro",
      name: "Nitro",
      description: "Universal server framework (powers Nuxt)",
      icon: "/icon/nitro.svg",
      color: "from-cyan-500 to-teal-700",
    },
    {
      id: "fets",
      name: "feTS",
      description: "TypeScript HTTP Framework with e2e type-safety",
      icon: "/icon/fets.svg",
      color: "from-blue-600 to-cyan-700",
    },
    {
      id: "convex",
      name: "Convex",
      description: "Reactive backend-as-a-service",
      icon: "/icon/convex.svg",
      color: "from-pink-500 to-pink-700",
    },
    {
      id: "self-next",
      name: "Fullstack Next.js",
      description: "Use Next.js built-in API routes",
      icon: "https://cdn.simpleicons.org/nextdotjs",
      color: "from-gray-700 to-black",
      className: "invert-0 dark:invert",
    },
    {
      id: "self-tanstack-start",
      name: "Fullstack TanStack Start",
      description: "Use TanStack Start's built-in API routes",
      icon: "/icon/tanstack.png",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "self-astro",
      name: "Fullstack Astro",
      description: "Use Astro's built-in API routes with SSR",
      icon: "/icon/astro.svg",
      color: "from-purple-500 to-orange-500",
    },
    {
      id: "none",
      name: "No Backend",
      description: "Skip backend integration (frontend only)",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  database: [
    {
      id: "sqlite",
      name: "SQLite",
      description: "File-based SQL database",
      icon: "https://cdn.simpleicons.org/sqlite/003B57",
      color: "from-blue-400 to-cyan-500",
      default: true,
    },
    {
      id: "postgres",
      name: "PostgreSQL",
      description: "Advanced SQL database",
      icon: "https://cdn.simpleicons.org/postgresql/4169E1",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "mysql",
      name: "MySQL",
      description: "Popular relational database",
      icon: "https://cdn.simpleicons.org/mysql/4479A1",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      description: "NoSQL document database",
      icon: "https://cdn.simpleicons.org/mongodb/47A248",
      color: "from-green-400 to-green-600",
    },
    {
      id: "none",
      name: "No Database",
      description: "Skip database integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  orm: [
    {
      id: "drizzle",
      name: "Drizzle",
      description: "TypeScript ORM",
      icon: "https://cdn.simpleicons.org/drizzle/C5F74F",
      color: "from-cyan-400 to-cyan-600",
      default: true,
    },
    {
      id: "prisma",
      name: "Prisma",
      description: "Next-gen ORM",
      icon: "https://cdn.simpleicons.org/prisma/2D3748",
      color: "from-purple-400 to-purple-600",
      className: "invert-0 dark:invert",
    },
    {
      id: "mongoose",
      name: "Mongoose",
      description: "Elegant object modeling tool",
      icon: "https://cdn.simpleicons.org/mongoose/880000",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "typeorm",
      name: "TypeORM",
      description: "Traditional ORM with Active Record/Data Mapper",
      icon: "https://cdn.simpleicons.org/typeorm/E83524",
      color: "from-red-400 to-red-600",
    },
    {
      id: "kysely",
      name: "Kysely",
      description: "Type-safe SQL query builder",
      icon: "https://kysely.dev/img/logo.svg",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "mikroorm",
      name: "MikroORM",
      description: "Data Mapper ORM for DDD",
      icon: "https://mikro-orm.io/img/logo.svg",
      color: "from-cyan-500 to-cyan-700",
    },
    {
      id: "sequelize",
      name: "Sequelize",
      description: "Mature ORM with wide adoption",
      icon: "https://cdn.simpleicons.org/sequelize/52B0E7",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "none",
      name: "No ORM",
      description: "Skip ORM integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  dbSetup: [
    {
      id: "turso",
      name: "Turso",
      description: "Distributed SQLite with edge replicas (libSQL)",
      icon: "https://cdn.simpleicons.org/turso/4FF8D2",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "d1",
      name: "Cloudflare D1",
      description: "Serverless SQLite-compatible database for Cloudflare Workers",
      icon: "https://cdn.simpleicons.org/cloudflareworkers/F38020",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "neon",
      name: "Neon Postgres",
      description: "Serverless Postgres with autoscaling and branching",
      icon: "/icon/neon.svg",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "prisma-postgres",
      name: "Prisma PostgreSQL",
      description: "Managed Postgres via Prisma Data Platform",
      icon: "https://cdn.simpleicons.org/prisma/2D3748",
      color: "from-indigo-400 to-indigo-600",
      className: "invert-0 dark:invert",
    },
    {
      id: "mongodb-atlas",
      name: "MongoDB Atlas",
      description: "Managed MongoDB clusters in the cloud",
      icon: "https://cdn.simpleicons.org/mongodb/47A248",
      color: "from-green-400 to-green-600",
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Local Postgres stack via Supabase (Docker required)",
      icon: "https://cdn.simpleicons.org/supabase/3FCF8E",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: "planetscale",
      name: "PlanetScale",
      description: "Postgres & Vitess (MySQL) on NVMe",
      icon: "https://cdn.simpleicons.org/planetscale",
      color: "from-orange-400 to-orange-600",
      className: "invert-0 dark:invert",
    },
    {
      id: "docker",
      name: "Docker",
      description: "Run Postgres/MySQL/MongoDB locally via Docker Compose",
      icon: "https://cdn.simpleicons.org/docker/2496ED",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "none",
      name: "Basic Setup",
      description: "No cloud DB integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  webDeploy: [
    {
      id: "cloudflare",
      name: "Cloudflare",
      description: "Deploy to Cloudflare Workers using Alchemy",
      icon: "https://cdn.simpleicons.org/cloudflareworkers/F38020",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "none",
      name: "None",
      description: "Skip deployment setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  serverDeploy: [
    {
      id: "cloudflare",
      name: "Cloudflare",
      description: "Deploy to Cloudflare Workers using Alchemy",
      icon: "https://cdn.simpleicons.org/cloudflareworkers/F38020",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "none",
      name: "None",
      description: "Skip deployment setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  auth: [
    {
      id: "better-auth",
      name: "Better-Auth",
      description: "The most comprehensive authentication framework for TypeScript",
      icon: "/icon/better-auth.svg",
      color: "from-green-400 to-green-600",
      default: true,
    },
    {
      id: "clerk",
      name: "Clerk",
      description: "More than authentication, Complete User Management",
      icon: "https://cdn.simpleicons.org/clerk/6C47FF",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "nextauth",
      name: "Auth.js (NextAuth)",
      description: "Open source authentication for Next.js",
      icon: "https://cdn.simpleicons.org/auth0/EB5424",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "none",
      name: "No Auth",
      description: "Skip authentication",
      icon: "",
      color: "from-red-400 to-red-600",
    },
  ],
  payments: [
    {
      id: "polar",
      name: "Polar",
      description: "Turn your software into a business. 6 lines of code.",
      icon: "/icon/polar.svg",
      color: "from-purple-400 to-purple-600",
      default: false,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Industry standard payment processing",
      icon: "https://cdn.simpleicons.org/stripe/635BFF",
      color: "from-indigo-500 to-purple-600",
      default: false,
    },
    {
      id: "lemon-squeezy",
      name: "Lemon Squeezy",
      description: "MoR for digital products with tax handling",
      icon: "https://cdn.simpleicons.org/lemonsqueezy/FFC233",
      color: "from-yellow-400 to-yellow-600",
      default: false,
    },
    {
      id: "paddle",
      name: "Paddle",
      description: "MoR platform with global tax compliance",
      icon: "https://cdn.simpleicons.org/paddle/3D3D3D",
      color: "from-slate-500 to-slate-700",
      default: false,
    },
    {
      id: "dodo",
      name: "Dodo Payments",
      description: "MoR for AI and SaaS in 150+ countries",
      icon: "/icon/dodo.svg",
      color: "from-indigo-500 to-blue-600",
      default: false,
    },
    {
      id: "none",
      name: "No Payments",
      description: "Skip payments integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  email: [
    {
      id: "resend",
      name: "Resend",
      description: "Modern email API for developers",
      icon: "https://cdn.simpleicons.org/resend",
      color: "from-gray-600 to-gray-800",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "react-email",
      name: "React Email",
      description: "Build emails using React components (no sending)",
      icon: "https://cdn.simpleicons.org/react/61DAFB",
      color: "from-cyan-400 to-cyan-600",
      default: false,
    },
    {
      id: "nodemailer",
      name: "Nodemailer",
      description: "Classic Node.js email sending via SMTP",
      icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
      color: "from-green-400 to-green-600",
      default: false,
    },
    {
      id: "postmark",
      name: "Postmark",
      description: "Fast transactional email service",
      icon: "https://cdn.simpleicons.org/postmark/FFDE00",
      color: "from-yellow-400 to-yellow-600",
      default: false,
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Scalable email delivery platform",
      icon: "/icon/sendgrid.svg",
      color: "from-blue-400 to-blue-600",
      default: false,
    },
    {
      id: "aws-ses",
      name: "AWS SES",
      description: "Amazon Simple Email Service",
      icon: "/icon/aws-ses.svg",
      color: "from-orange-400 to-orange-600",
      default: false,
    },
    {
      id: "mailgun",
      name: "Mailgun",
      description: "Powerful email API for developers",
      icon: "https://cdn.simpleicons.org/mailgun/F06B66",
      color: "from-red-400 to-red-600",
      default: false,
    },
    {
      id: "plunk",
      name: "Plunk",
      description: "Open-source email platform with event tracking",
      icon: "/icon/plunk.svg",
      color: "from-violet-400 to-violet-600",
      default: false,
    },
    {
      id: "none",
      name: "No Email",
      description: "Skip email integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  fileUpload: [
    {
      id: "uploadthing",
      name: "UploadThing",
      description: "TypeScript-first file uploads with built-in validation",
      icon: "https://uploadthing.com/favicon.ico",
      color: "from-red-400 to-red-600",
      default: false,
    },
    {
      id: "filepond",
      name: "FilePond",
      description: "Flexible file upload with image preview and drag & drop",
      icon: "/icon/filepond.svg",
      color: "from-yellow-400 to-amber-600",
      default: false,
    },
    {
      id: "uppy",
      name: "Uppy",
      description: "Modular file uploader with resumable uploads and plugins",
      icon: "https://uppy.io/img/logo.svg",
      color: "from-cyan-400 to-teal-600",
      default: false,
    },
    {
      id: "none",
      name: "No File Upload",
      description: "Skip file upload integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  logging: [
    {
      id: "pino",
      name: "Pino",
      description: "Fast JSON logger with minimal overhead",
      icon: "",
      color: "from-green-400 to-green-600",
      default: false,
    },
    {
      id: "winston",
      name: "Winston",
      description: "Flexible logging library with multiple transports",
      icon: "",
      color: "from-blue-400 to-blue-600",
      default: false,
    },
    {
      id: "none",
      name: "No Logging",
      description: "Skip logging framework setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  observability: [
    {
      id: "opentelemetry",
      name: "OpenTelemetry",
      description: "Observability framework for traces, metrics, and logs",
      icon: "",
      color: "from-blue-400 to-cyan-500",
      default: false,
    },
    {
      id: "none",
      name: "No Observability",
      description: "Skip observability/tracing setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  backendLibraries: [
    {
      id: "effect",
      name: "Effect (Core)",
      description: "Powerful effect system for TypeScript",
      icon: "/icon/effect.svg",
      color: "from-indigo-400 to-indigo-600",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "effect-full",
      name: "Effect Full",
      description: "Full ecosystem with Schema, Platform, and SQL",
      icon: "/icon/effect.svg",
      color: "from-purple-400 to-purple-600",
      className: "invert-0 dark:invert",
      default: false,
    },
    {
      id: "none",
      name: "None",
      description: "No additional backend libraries",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  stateManagement: [
    {
      id: "zustand",
      name: "Zustand",
      description: "Lightweight state management with simple API",
      icon: "",
      color: "from-amber-400 to-amber-600",
      default: false,
    },
    {
      id: "jotai",
      name: "Jotai",
      description: "Primitive and flexible atomic state",
      icon: "",
      color: "from-gray-600 to-gray-800",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "nanostores",
      name: "Nanostores",
      description: "Tiny state manager (1KB) for all frameworks",
      icon: "",
      color: "from-blue-400 to-blue-600",
      default: false,
    },
    {
      id: "redux-toolkit",
      name: "Redux Toolkit",
      description: "Enterprise-standard state with excellent TS support",
      icon: "https://cdn.simpleicons.org/redux/764ABC",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
    {
      id: "mobx",
      name: "MobX",
      description: "Observable-based reactive state management",
      icon: "https://cdn.simpleicons.org/mobx/FF9955",
      color: "from-orange-400 to-orange-600",
      default: false,
    },
    {
      id: "xstate",
      name: "XState",
      description: "State machines and statecharts for complex logic",
      icon: "https://cdn.simpleicons.org/xstate/2C3E50",
      color: "from-slate-600 to-slate-800",
      default: false,
    },
    {
      id: "valtio",
      name: "Valtio",
      description: "Proxy-based state (same authors as Zustand)",
      icon: "",
      color: "from-teal-400 to-teal-600",
      default: false,
    },
    {
      id: "tanstack-store",
      name: "TanStack Store",
      description: "Framework-agnostic store powering TanStack ecosystem",
      icon: "",
      color: "from-red-400 to-orange-500",
      default: false,
    },
    {
      id: "legend-state",
      name: "Legend State",
      description: "High-performance observable state for React",
      icon: "",
      color: "from-violet-400 to-violet-600",
      default: false,
    },
    {
      id: "none",
      name: "No State Management",
      description: "Skip state management setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  forms: [
    {
      id: "react-hook-form",
      name: "React Hook Form",
      description: "Performant, flexible form validation library",
      icon: "https://cdn.simpleicons.org/reacthookform/EC5990",
      color: "from-pink-400 to-pink-600",
      default: true,
    },
    {
      id: "tanstack-form",
      name: "TanStack Form",
      description: "Fully-typed, framework-agnostic form library",
      icon: "/icon/tanstack.png",
      color: "from-cyan-400 to-cyan-600",
      default: false,
    },
    {
      id: "formik",
      name: "Formik",
      description: "Popular form state management with Yup validation",
      icon: "",
      color: "from-blue-500 to-blue-700",
      default: false,
    },
    {
      id: "final-form",
      name: "Final Form",
      description: "Framework-agnostic form state management",
      icon: "",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
    {
      id: "conform",
      name: "Conform",
      description: "Progressive enhancement forms with Zod validation",
      icon: "",
      color: "from-emerald-500 to-emerald-700",
      default: false,
    },
    {
      id: "modular-forms",
      name: "Modular Forms",
      description: "Type-safe forms for Solid and Qwik (3KB bundle)",
      icon: "",
      color: "from-sky-400 to-sky-600",
      default: false,
    },
    {
      id: "none",
      name: "No Form Library",
      description: "Build custom form handling",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  validation: [
    {
      id: "zod",
      name: "Zod",
      description: "TypeScript-first schema validation (default)",
      icon: "https://cdn.simpleicons.org/zod/3E67B1",
      color: "from-blue-500 to-blue-700",
      default: true,
    },
    {
      id: "valibot",
      name: "Valibot",
      description: "Smaller bundle alternative to Zod (~1KB)",
      icon: "",
      color: "from-yellow-400 to-yellow-600",
      default: false,
    },
    {
      id: "arktype",
      name: "ArkType",
      description: "TypeScript-first validation, 2-4x faster than Zod",
      icon: "",
      color: "from-purple-400 to-purple-600",
      default: false,
    },
    {
      id: "typebox",
      name: "TypeBox",
      description: "JSON Schema type builder for TypeScript",
      icon: "",
      color: "from-sky-400 to-sky-600",
      default: false,
    },
    {
      id: "typia",
      name: "Typia",
      description: "Super-fast validation via compile-time transform",
      icon: "",
      color: "from-green-400 to-green-600",
      default: false,
    },
    {
      id: "runtypes",
      name: "Runtypes",
      description: "Runtime type validation with composable validators",
      icon: "",
      color: "from-orange-400 to-orange-600",
      default: false,
    },
    {
      id: "effect-schema",
      name: "@effect/schema",
      description: "Effect ecosystem schema validation with powerful transformations",
      icon: "",
      color: "from-black to-gray-700",
      default: false,
    },
    {
      id: "none",
      name: "No Validation",
      description: "Use Zod internally only (no additional library)",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  cssFramework: [
    {
      id: "tailwind",
      name: "Tailwind CSS",
      description: "Utility-first CSS framework",
      icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      color: "from-cyan-400 to-cyan-600",
      default: true,
    },
    {
      id: "scss",
      name: "SCSS",
      description: "CSS preprocessor with variables and nesting",
      icon: "https://cdn.simpleicons.org/sass/CC6699",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "less",
      name: "Less",
      description: "Backwards-compatible CSS extension",
      icon: "https://cdn.simpleicons.org/less/1D365D",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "postcss-only",
      name: "PostCSS Only",
      description: "Minimal CSS with PostCSS plugins",
      icon: "https://cdn.simpleicons.org/postcss/DD3A0A",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "none",
      name: "No CSS Framework",
      description: "Plain CSS only",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  uiLibrary: [
    {
      id: "shadcn-ui",
      name: "shadcn/ui",
      description: "Re-usable components built with Radix and Tailwind",
      icon: "https://cdn.simpleicons.org/shadcnui",
      color: "from-gray-600 to-gray-800",
      default: true,
      className: "invert-0 dark:invert",
    },
    {
      id: "daisyui",
      name: "daisyUI",
      description: "Tailwind CSS component library",
      icon: "https://cdn.simpleicons.org/daisyui/1AD1A5",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: "radix-ui",
      name: "Radix UI",
      description: "Unstyled, accessible UI components",
      icon: "https://cdn.simpleicons.org/radixui",
      color: "from-purple-400 to-purple-600",
      className: "invert-0 dark:invert",
    },
    {
      id: "headless-ui",
      name: "Headless UI",
      description: "Unstyled, accessible components by Tailwind Labs",
      icon: "https://cdn.simpleicons.org/headlessui/66E3FF",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      id: "park-ui",
      name: "Park UI",
      description: "Beautifully designed components built on Ark UI",
      icon: "",
      color: "from-green-400 to-green-600",
    },
    {
      id: "chakra-ui",
      name: "Chakra UI",
      description: "Simple, modular React component library",
      icon: "https://cdn.simpleicons.org/chakraui/319795",
      color: "from-teal-400 to-teal-600",
    },
    {
      id: "nextui",
      name: "NextUI",
      description: "Beautiful, fast and modern React UI library",
      icon: "/icon/nextui.svg",
      color: "from-gray-600 to-gray-800",
    },
    {
      id: "mantine",
      name: "Mantine",
      description: "Full-featured React component library",
      icon: "https://cdn.simpleicons.org/mantine/339AF0",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "base-ui",
      name: "Base UI",
      description: "Unstyled components from MUI team (Radix successor)",
      icon: "https://cdn.simpleicons.org/mui/007FFF",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "ark-ui",
      name: "Ark UI",
      description: "Headless UI for React, Vue, Solid, and Svelte",
      icon: "",
      color: "from-green-500 to-teal-600",
    },
    {
      id: "react-aria",
      name: "React Aria",
      description: "Adobe's accessible, unstyled UI components",
      icon: "",
      color: "from-red-500 to-red-700",
    },
    {
      id: "none",
      name: "No UI Library",
      description: "Build custom components",
      icon: "",
      color: "from-gray-400 to-gray-600",
    },
  ],
  packageManager: [
    {
      id: "npm",
      name: "npm",
      description: "Default package manager",
      icon: "https://cdn.simpleicons.org/npm/CB3837",
      color: "from-red-500 to-red-700",
    },
    {
      id: "pnpm",
      name: "pnpm",
      description: "Fast, disk space efficient",
      icon: "https://cdn.simpleicons.org/pnpm/F69220",
      color: "from-orange-500 to-orange-700",
    },
    {
      id: "bun",
      name: "bun",
      description: "All-in-one toolkit",
      icon: "https://cdn.simpleicons.org/bun/FBF0DF",
      color: "from-amber-500 to-amber-700",
      default: true,
    },
  ],
  codeQuality: [
    {
      id: "biome",
      name: "Biome",
      description: "Format, lint, and more",
      icon: "https://cdn.simpleicons.org/biome/60A5FA",
      color: "from-blue-500 to-blue-700",
      default: false,
    },
    {
      id: "oxlint",
      name: "Oxlint",
      description: "Oxlint + Oxfmt (linting & formatting)",
      icon: "https://cdn.simpleicons.org/oxc/FF915C",
      color: "from-orange-500 to-orange-700",
      default: false,
    },
    {
      id: "ultracite",
      name: "Ultracite",
      description: "Biome preset with AI integration",
      icon: "/icon/ultracite.svg",
      color: "from-indigo-500 to-indigo-700",
      className: "invert-0 dark:invert",
      default: false,
    },
    {
      id: "lefthook",
      name: "Lefthook",
      description: "Fast and powerful Git hooks manager",
      icon: "",
      color: "from-red-500 to-red-700",
      default: false,
    },
    {
      id: "husky",
      name: "Husky",
      description: "Modern native Git hooks made easy",
      icon: "",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
    {
      id: "ruler",
      name: "Ruler",
      description: "Centralize your AI rules",
      icon: "",
      color: "from-violet-500 to-violet-700",
      default: false,
    },
  ],
  documentation: [
    {
      id: "starlight",
      name: "Starlight",
      description: "Build stellar docs with Astro",
      icon: "/icon/starlight.svg",
      color: "from-amber-500 to-amber-700",
      default: false,
    },
    {
      id: "fumadocs",
      name: "Fumadocs",
      description: "Build excellent documentation site",
      icon: "/icon/fumadocs.svg",
      color: "from-indigo-500 to-indigo-700",
      default: false,
    },
  ],
  appPlatforms: [
    {
      id: "turborepo",
      name: "Turborepo",
      description: "High-performance build system",
      icon: "https://cdn.simpleicons.org/turborepo/EF4444",
      color: "from-gray-400 to-gray-700",
      default: true,
    },
    {
      id: "pwa",
      name: "PWA",
      description: "Make your app installable and work offline",
      icon: "",
      color: "from-blue-500 to-blue-700",
      default: false,
    },
    {
      id: "tauri",
      name: "Tauri",
      description: "Build native desktop apps",
      icon: "https://cdn.simpleicons.org/tauri/FFC131",
      color: "from-amber-500 to-amber-700",
      default: false,
    },
    {
      id: "wxt",
      name: "WXT",
      description: "Build browser extensions",
      icon: "",
      color: "from-emerald-500 to-emerald-700",
      default: false,
    },
    {
      id: "opentui",
      name: "OpenTUI",
      description: "Build terminal user interfaces",
      icon: "",
      color: "from-cyan-500 to-cyan-700",
      default: false,
    },
    {
      id: "msw",
      name: "MSW",
      description: "Mock Service Worker for API mocking in tests and development",
      icon: "",
      color: "from-orange-500 to-orange-700",
      default: false,
    },
    {
      id: "storybook",
      name: "Storybook",
      description: "Component development and testing workshop",
      icon: "https://cdn.simpleicons.org/storybook/FF4785",
      color: "from-pink-500 to-pink-700",
      default: false,
    },
  ],
  examples: [
    {
      id: "todo",
      name: "Todo Example",
      description: "Simple todo application",
      icon: "",
      color: "from-indigo-500 to-indigo-700",
      default: false,
    },
    {
      id: "ai",
      name: "AI Example",
      description: "AI integration example using AI SDK",
      icon: "",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
  ],
  ai: [
    {
      id: "vercel-ai",
      name: "Vercel AI SDK",
      description: "Unified AI SDK for streaming responses and multiple providers",
      icon: "https://cdn.simpleicons.org/vercel/000000",
      color: "from-gray-700 to-black",
      default: true,
      className: "invert-0 dark:invert",
    },
    {
      id: "mastra",
      name: "Mastra",
      description: "TypeScript-native AI agent framework with workflows",
      icon: "/icon/mastra.svg",
      color: "from-purple-500 to-indigo-600",
      default: false,
    },
    {
      id: "voltagent",
      name: "VoltAgent",
      description: "AI Agent framework with memory, workflows, and observability",
      icon: "/icon/voltagent.svg",
      color: "from-yellow-500 to-orange-600",
      default: false,
    },
    {
      id: "langgraph",
      name: "LangGraph.js",
      description: "Graph-based agent orchestration with stateful workflows",
      icon: "/icon/langgraph.svg",
      color: "from-green-500 to-teal-600",
      default: false,
    },
    {
      id: "openai-agents",
      name: "OpenAI Agents SDK",
      description: "Official multi-agent framework with handoffs and guardrails",
      icon: "https://cdn.simpleicons.org/openai/412991",
      color: "from-emerald-500 to-teal-600",
      default: false,
    },
    {
      id: "google-adk",
      name: "Google ADK",
      description: "Code-first agent development kit for building AI agents",
      icon: "https://cdn.simpleicons.org/google/4285F4",
      color: "from-blue-500 to-blue-700",
      default: false,
    },
    {
      id: "modelfusion",
      name: "ModelFusion",
      description: "Type-safe AI library for multi-provider text generation",
      icon: "https://cdn.simpleicons.org/vercel/000000",
      color: "from-gray-600 to-gray-800",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "none",
      name: "No AI SDK",
      description: "Skip AI SDK integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  realtime: [
    {
      id: "socket-io",
      name: "Socket.IO",
      description: "Real-time bidirectional communication with fallbacks",
      icon: "https://cdn.simpleicons.org/socketdotio/010101",
      color: "from-gray-600 to-gray-800",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "partykit",
      name: "PartyKit",
      description: "Edge-native multiplayer infrastructure on Cloudflare",
      icon: "https://cdn.simpleicons.org/cloudflare/F38020",
      color: "from-orange-500 to-orange-700",
      default: false,
    },
    {
      id: "ably",
      name: "Ably",
      description: "Real-time messaging platform with pub/sub and presence",
      icon: "https://cdn.simpleicons.org/ably/FF5416",
      color: "from-orange-500 to-red-600",
      default: false,
    },
    {
      id: "pusher",
      name: "Pusher",
      description: "Real-time communication APIs with channels and events",
      icon: "https://cdn.simpleicons.org/pusher/300D4F",
      color: "from-purple-600 to-indigo-800",
      default: false,
    },
    {
      id: "liveblocks",
      name: "Liveblocks",
      description: "Collaboration infrastructure for multiplayer experiences",
      icon: "https://cdn.simpleicons.org/liveblocks/6366F1",
      color: "from-indigo-500 to-purple-600",
      default: false,
    },
    {
      id: "yjs",
      name: "Y.js",
      description: "CRDT library for real-time collaboration with conflict-free sync",
      icon: "",
      color: "from-emerald-500 to-teal-600",
      default: false,
    },
    {
      id: "none",
      name: "No Real-time",
      description: "Skip real-time/WebSocket integration",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  jobQueue: [
    {
      id: "bullmq",
      name: "BullMQ",
      description: "Redis-backed job queue for background tasks and scheduling",
      icon: "https://cdn.simpleicons.org/redis/DC382D",
      color: "from-red-500 to-red-700",
      default: false,
    },
    {
      id: "trigger-dev",
      name: "Trigger.dev",
      description: "Background jobs as code with serverless execution",
      icon: "/icon/trigger-dev.svg",
      color: "from-green-500 to-emerald-600",
      default: false,
    },
    {
      id: "inngest",
      name: "Inngest",
      description: "Event-driven functions with built-in queuing and scheduling",
      icon: "/icon/inngest.svg",
      color: "from-indigo-500 to-purple-600",
      default: false,
    },
    {
      id: "temporal",
      name: "Temporal",
      description: "Durable workflow orchestration for reliable distributed systems",
      icon: "/icon/temporal.svg",
      color: "from-blue-500 to-cyan-600",
      default: false,
    },
    {
      id: "none",
      name: "No Job Queue",
      description: "Skip job queue/background worker setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  effect: [
    {
      id: "effect",
      name: "Effect (Core)",
      description: "Powerful effect system for TypeScript",
      icon: "/icon/effect.svg",
      color: "from-indigo-400 to-indigo-600",
      default: false,
      className: "invert-0 dark:invert",
    },
    {
      id: "effect-full",
      name: "Effect Full",
      description: "Full ecosystem with Schema, Platform, and SQL",
      icon: "/icon/effect.svg",
      color: "from-purple-400 to-purple-600",
      className: "invert-0 dark:invert",
      default: false,
    },
    {
      id: "none",
      name: "None",
      description: "No Effect library",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  caching: [
    {
      id: "upstash-redis",
      name: "Upstash Redis",
      description: "Serverless Redis with REST API for edge and serverless",
      icon: "https://cdn.simpleicons.org/upstash/00E9A3",
      color: "from-emerald-500 to-teal-600",
      default: false,
    },
    {
      id: "none",
      name: "No Caching",
      description: "Skip caching layer setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  animation: [
    {
      id: "framer-motion",
      name: "Framer Motion",
      description: "Production-ready declarative animations for React",
      icon: "https://cdn.simpleicons.org/framer/0055FF",
      color: "from-blue-500 to-purple-600",
      default: false,
    },
    {
      id: "gsap",
      name: "GSAP",
      description: "Professional-grade animation engine for the web",
      icon: "https://cdn.simpleicons.org/greensock/88CE02",
      color: "from-green-500 to-green-700",
      default: false,
    },
    {
      id: "react-spring",
      name: "React Spring",
      description: "Physics-based animations for fluid interactions",
      icon: "",
      color: "from-pink-400 to-pink-600",
      default: false,
    },
    {
      id: "auto-animate",
      name: "Auto Animate",
      description: "Zero-config, drop-in animation utility",
      icon: "https://cdn.simpleicons.org/formkit/00DC82",
      color: "from-green-400 to-emerald-600",
      default: false,
    },
    {
      id: "lottie",
      name: "Lottie",
      description: "Render After Effects animations natively",
      icon: "https://cdn.simpleicons.org/airbnb/FF5A5F",
      color: "from-pink-500 to-red-500",
      default: false,
    },
    {
      id: "none",
      name: "No Animation",
      description: "Skip animation library setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  testing: [
    {
      id: "vitest",
      name: "Vitest",
      description:
        "Blazing fast Vite-native unit test framework with Testing Library support for React/Vue/Svelte",
      icon: "https://cdn.simpleicons.org/vitest/6E9F18",
      color: "from-green-400 to-green-600",
      default: true,
    },
    {
      id: "jest",
      name: "Jest",
      description: "Classic testing framework with Testing Library support for React/Vue/Svelte",
      icon: "https://cdn.simpleicons.org/jest/C21325",
      color: "from-red-400 to-red-600",
      default: false,
    },
    {
      id: "playwright",
      name: "Playwright",
      description: "End-to-end testing framework by Microsoft",
      icon: "https://cdn.simpleicons.org/playwright/2EAD33",
      color: "from-emerald-400 to-emerald-600",
      default: false,
    },
    {
      id: "vitest-playwright",
      name: "Vitest + Playwright",
      description: "Both unit and E2E testing with Testing Library support for complete coverage",
      icon: "https://cdn.simpleicons.org/vitest/6E9F18",
      color: "from-green-500 to-emerald-600",
      default: false,
    },
    {
      id: "cypress",
      name: "Cypress",
      description: "E2E testing with time travel debugging",
      icon: "https://cdn.simpleicons.org/cypress/69D3A7",
      color: "from-teal-400 to-teal-600",
      default: false,
    },
    {
      id: "none",
      name: "No Testing",
      description: "Skip testing framework setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  cms: [
    {
      id: "payload",
      name: "Payload",
      description: "TypeScript-first headless CMS with Next.js integration",
      icon: "/icon/payload.svg",
      color: "from-slate-700 to-slate-900",
      default: false,
    },
    {
      id: "sanity",
      name: "Sanity",
      description: "Real-time collaborative CMS with schema-as-code",
      icon: "https://cdn.simpleicons.org/sanity/F03E2F",
      color: "from-red-500 to-red-700",
      default: false,
    },
    {
      id: "strapi",
      name: "Strapi",
      description: "Open-source headless CMS with admin panel",
      icon: "https://cdn.simpleicons.org/strapi/4945FF",
      color: "from-indigo-500 to-purple-600",
      default: false,
    },
    {
      id: "none",
      name: "No CMS",
      description: "Skip headless CMS setup",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  git: [
    {
      id: "true",
      name: "Git",
      description: "Initialize Git repository",
      icon: "https://cdn.simpleicons.org/git/F05032",
      color: "from-gray-500 to-gray-700",
      default: true,
    },
    {
      id: "false",
      name: "No Git",
      description: "Skip Git initialization",
      icon: "",
      color: "from-red-400 to-red-600",
    },
  ],
  install: [
    {
      id: "true",
      name: "Install Dependencies",
      description: "Install packages automatically",
      icon: "",
      color: "from-green-400 to-green-600",
      default: true,
    },
    {
      id: "false",
      name: "Skip Install",
      description: "Skip dependency installation",
      icon: "",
      color: "from-yellow-400 to-yellow-600",
    },
  ],
  // Rust ecosystem categories
  rustWebFramework: [
    {
      id: "axum",
      name: "Axum",
      description: "Ergonomic and modular web framework by Tokio team",
      icon: "/icon/axum.svg",
      color: "from-blue-500 to-indigo-600",
      default: true,
    },
    {
      id: "actix-web",
      name: "Actix-web",
      description: "Powerful, pragmatic, and extremely fast web framework",
      icon: "/icon/actix.svg",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
    {
      id: "none",
      name: "No Web Framework",
      description: "Skip Rust web framework",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  rustFrontend: [
    {
      id: "leptos",
      name: "Leptos",
      description: "Fine-grained reactive framework with SSR support",
      icon: "/icon/leptos.svg",
      color: "from-red-500 to-orange-600",
      default: true,
    },
    {
      id: "dioxus",
      name: "Dioxus",
      description: "React-like GUI library for web, desktop, and mobile",
      icon: "/icon/dioxus.svg",
      color: "from-cyan-500 to-blue-600",
      default: false,
    },
    {
      id: "none",
      name: "No WASM Frontend",
      description: "Skip Rust WASM frontend",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  rustOrm: [
    {
      id: "sea-orm",
      name: "SeaORM",
      description: "Async & dynamic ORM with ActiveRecord pattern",
      icon: "/icon/seaorm.svg",
      color: "from-cyan-500 to-blue-600",
      default: true,
    },
    {
      id: "sqlx",
      name: "SQLx",
      description: "Async SQL toolkit with compile-time checked queries",
      icon: "",
      color: "from-orange-500 to-orange-700",
      default: false,
    },
    {
      id: "none",
      name: "No ORM",
      description: "Skip Rust ORM/database layer",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
  rustApi: [
    {
      id: "async-graphql",
      name: "async-graphql",
      description: "High-performance GraphQL server with full query language support",
      icon: "https://cdn.simpleicons.org/graphql/E10098",
      color: "from-pink-500 to-rose-600",
      default: false,
    },
    {
      id: "tonic",
      name: "Tonic",
      description: "Production-ready gRPC implementation for Rust",
      icon: "/icon/tonic.svg",
      color: "from-orange-500 to-red-600",
      default: false,
    },
    {
      id: "none",
      name: "No API Layer",
      description: "Skip Rust API layer",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  rustCli: [
    {
      id: "clap",
      name: "Clap",
      description: "CLI argument parser with derive macros (most popular)",
      icon: "",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
    {
      id: "ratatui",
      name: "Ratatui",
      description: "Terminal user interface library for building rich TUIs",
      icon: "",
      color: "from-emerald-500 to-teal-700",
      default: false,
    },
    {
      id: "none",
      name: "No CLI Tools",
      description: "Skip Rust CLI tools",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: true,
    },
  ],
  rustLibraries: [
    {
      id: "serde",
      name: "Serde",
      description: "De facto standard serialization framework (always included)",
      icon: "",
      color: "from-orange-500 to-orange-700",
      default: true,
    },
    {
      id: "validator",
      name: "Validator",
      description: "Derive-based validation for structs and fields",
      icon: "",
      color: "from-green-500 to-green-700",
      default: false,
    },
    {
      id: "jsonwebtoken",
      name: "jsonwebtoken",
      description: "JWT encoding and decoding for authentication",
      icon: "",
      color: "from-blue-500 to-indigo-700",
      default: false,
    },
    {
      id: "argon2",
      name: "Argon2",
      description: "Secure password hashing (Argon2id winner of PHC)",
      icon: "",
      color: "from-purple-500 to-purple-700",
      default: false,
    },
    {
      id: "tokio-test",
      name: "Tokio Test",
      description: "Async testing utilities for Tokio runtime",
      icon: "",
      color: "from-cyan-500 to-blue-600",
      default: false,
    },
    {
      id: "mockall",
      name: "Mockall",
      description: "Powerful mock objects library for Rust testing",
      icon: "",
      color: "from-rose-500 to-pink-600",
      default: false,
    },
    {
      id: "none",
      name: "No Additional Libraries",
      description: "Skip additional Rust core libraries",
      icon: "",
      color: "from-gray-400 to-gray-600",
      default: false,
    },
  ],
};
const ECOSYSTEMS = [
  {
    id: "typescript",
    name: "TypeScript",
    description: "Full-stack TypeScript ecosystem",
    icon: "https://cdn.simpleicons.org/typescript/3178C6",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "rust",
    name: "Rust",
    description: "High-performance Rust ecosystem",
    icon: "https://cdn.simpleicons.org/rust/000000",
    color: "from-orange-500 to-orange-700",
  },
];
const PRESET_TEMPLATES = [
  {
    id: "mern",
    name: "MERN Stack",
    description: "MongoDB + Express + React + Node.js - Classic MERN stack",
    stack: {
      projectName: "my-better-t-app",
      webFrontend: ["react-router"],
      nativeFrontend: ["none"],
      astroIntegration: "none",
      cssFramework: "tailwind",
      uiLibrary: "shadcn-ui",
      runtime: "node",
      backend: "express",
      database: "mongodb",
      orm: "mongoose",
      dbSetup: "mongodb-atlas",
      auth: "better-auth",
      payments: "none",
      email: "none",
      backendLibraries: "none",
      stateManagement: "none",
      codeQuality: [],
      documentation: [],
      appPlatforms: ["turborepo"],
      packageManager: "bun",
      examples: ["todo"],
      git: "true",
      install: "true",
      api: "orpc",
      webDeploy: "none",
      serverDeploy: "none",
      yolo: "false",
    },
  },
  {
    id: "pern",
    name: "PERN Stack",
    description: "PostgreSQL + Express + React + Node.js - Popular PERN stack",
    stack: {
      projectName: "my-better-t-app",
      webFrontend: ["tanstack-router"],
      nativeFrontend: ["none"],
      astroIntegration: "none",
      cssFramework: "tailwind",
      uiLibrary: "shadcn-ui",
      runtime: "node",
      backend: "express",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "none",
      auth: "better-auth",
      payments: "none",
      email: "none",
      backendLibraries: "none",
      stateManagement: "none",
      codeQuality: [],
      documentation: [],
      appPlatforms: ["turborepo"],
      packageManager: "bun",
      examples: ["todo"],
      git: "true",
      install: "true",
      api: "trpc",
      webDeploy: "none",
      serverDeploy: "none",
      yolo: "false",
    },
  },
  {
    id: "t3",
    name: "T3 Stack",
    description: "Next.js + tRPC + Prisma + PostgreSQL + Better Auth",
    stack: {
      projectName: "my-better-t-app",
      webFrontend: ["next"],
      nativeFrontend: ["none"],
      astroIntegration: "none",
      cssFramework: "tailwind",
      uiLibrary: "shadcn-ui",
      runtime: "none",
      backend: "self-next",
      database: "postgres",
      orm: "prisma",
      dbSetup: "none",
      auth: "better-auth",
      payments: "none",
      email: "none",
      backendLibraries: "none",
      stateManagement: "none",
      codeQuality: ["biome"],
      documentation: [],
      appPlatforms: ["turborepo"],
      packageManager: "bun",
      examples: [],
      git: "true",
      install: "true",
      api: "trpc",
      webDeploy: "none",
      serverDeploy: "none",
      yolo: "false",
    },
  },
  {
    id: "uniwind",
    name: "Uniwind Native",
    description: "Expo + Uniwind native app with no backend services",
    stack: {
      projectName: "my-better-t-app",
      webFrontend: ["none"],
      nativeFrontend: ["native-uniwind"],
      astroIntegration: "none",
      cssFramework: "none",
      uiLibrary: "none",
      runtime: "none",
      backend: "none",
      database: "none",
      orm: "none",
      dbSetup: "none",
      auth: "none",
      payments: "none",
      email: "none",
      backendLibraries: "none",
      stateManagement: "none",
      codeQuality: [],
      documentation: [],
      appPlatforms: [],
      packageManager: "bun",
      examples: [],
      git: "true",
      install: "true",
      api: "none",
      webDeploy: "none",
      serverDeploy: "none",
      yolo: "false",
    },
  },
  {
    id: "astro-react",
    name: "Astro + React",
    description: "Astro with React integration, tRPC, and Hono backend",
    stack: {
      projectName: "my-better-t-app",
      webFrontend: ["astro"],
      nativeFrontend: ["none"],
      astroIntegration: "react",
      cssFramework: "tailwind",
      uiLibrary: "daisyui",
      runtime: "bun",
      backend: "hono",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "none",
      auth: "better-auth",
      payments: "none",
      email: "none",
      backendLibraries: "none",
      stateManagement: "none",
      codeQuality: [],
      documentation: [],
      appPlatforms: ["turborepo"],
      packageManager: "bun",
      examples: [],
      git: "true",
      install: "true",
      api: "trpc",
      webDeploy: "none",
      serverDeploy: "none",
      yolo: "false",
    },
  },
  {
    id: "astro-fullstack",
    name: "Fullstack Astro",
    description: "Astro with React using built-in API routes (fullstack mode)",
    stack: {
      projectName: "my-better-t-app",
      webFrontend: ["astro"],
      nativeFrontend: ["none"],
      astroIntegration: "react",
      cssFramework: "tailwind",
      uiLibrary: "daisyui",
      runtime: "none",
      backend: "self-astro",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "none",
      auth: "better-auth",
      payments: "none",
      email: "none",
      backendLibraries: "none",
      stateManagement: "none",
      codeQuality: [],
      documentation: [],
      appPlatforms: ["turborepo"],
      packageManager: "bun",
      examples: [],
      git: "true",
      install: "true",
      api: "trpc",
      webDeploy: "none",
      serverDeploy: "none",
      yolo: "false",
    },
  },
];
const DEFAULT_STACK = {
  ecosystem: "typescript",
  projectName: "my-better-t-app",
  webFrontend: ["tanstack-router"],
  nativeFrontend: ["none"],
  astroIntegration: "none",
  runtime: "bun",
  backend: "hono",
  database: "sqlite",
  orm: "drizzle",
  dbSetup: "none",
  auth: "better-auth",
  payments: "none",
  email: "none",
  fileUpload: "none",
  logging: "none",
  observability: "none",
  backendLibraries: "none",
  stateManagement: "none",
  validation: "zod",
  testing: "vitest",
  realtime: "none",
  jobQueue: "none",
  caching: "none",
  animation: "none",
  cssFramework: "tailwind",
  uiLibrary: "shadcn-ui",
  cms: "none",
  codeQuality: [],
  documentation: [],
  appPlatforms: ["turborepo"],
  packageManager: "bun",
  examples: [],
  aiSdk: "vercel-ai",
  git: "true",
  install: "true",
  api: "trpc",
  webDeploy: "none",
  serverDeploy: "none",
  yolo: "false",
  // Rust ecosystem defaults
  rustWebFramework: "axum",
  rustFrontend: "none",
  rustOrm: "sea-orm",
  rustApi: "none",
  rustCli: "none",
  rustLibraries: "serde",
};
const isStackDefault = (stack, key, value) => {
  const defaultValue = DEFAULT_STACK[key];
  if (stack.backend === "convex") {
    if (key === "runtime" && value === "none") return true;
    if (key === "database" && value === "none") return true;
    if (key === "orm" && value === "none") return true;
    if (key === "api" && value === "none") return true;
    if (key === "auth" && value === "none") return true;
    if (key === "dbSetup" && value === "none") return true;
  }
  if (
    key === "webFrontend" ||
    key === "nativeFrontend" ||
    key === "codeQuality" ||
    key === "documentation" ||
    key === "appPlatforms" ||
    key === "examples"
  ) {
    if (Array.isArray(defaultValue) && Array.isArray(value)) {
      const sortedDefault = [...defaultValue].sort();
      const sortedValue = [...value].sort();
      return (
        sortedDefault.length === sortedValue.length &&
        sortedDefault.every((item, index) => item === sortedValue[index])
      );
    }
  }
  if (Array.isArray(defaultValue) && Array.isArray(value)) {
    const sortedDefault = [...defaultValue].sort();
    const sortedValue = [...value].sort();
    return (
      sortedDefault.length === sortedValue.length &&
      sortedDefault.every((item, index) => item === sortedValue[index])
    );
  }
  return defaultValue === value;
};
const commaSeparatedArray = (defaultValue) =>
  stringType()
    .transform((val) => val.split(",").filter(Boolean))
    .catch(defaultValue);
const stackSearchSchema = objectType({
  eco: enumType(["typescript", "rust"]).catch(DEFAULT_STACK.ecosystem),
  name: stringType().catch(DEFAULT_STACK.projectName ?? "my-better-t-app"),
  "fe-w": commaSeparatedArray(DEFAULT_STACK.webFrontend),
  "fe-n": commaSeparatedArray(DEFAULT_STACK.nativeFrontend),
  ai: stringType().catch(DEFAULT_STACK.astroIntegration),
  css: stringType().catch(DEFAULT_STACK.cssFramework),
  ui: stringType().catch(DEFAULT_STACK.uiLibrary),
  rt: stringType().catch(DEFAULT_STACK.runtime),
  be: stringType().catch(DEFAULT_STACK.backend),
  api: stringType().catch(DEFAULT_STACK.api),
  db: stringType().catch(DEFAULT_STACK.database),
  orm: stringType().catch(DEFAULT_STACK.orm),
  dbs: stringType().catch(DEFAULT_STACK.dbSetup),
  au: stringType().catch(DEFAULT_STACK.auth),
  pay: stringType().catch(DEFAULT_STACK.payments),
  em: stringType().catch(DEFAULT_STACK.email),
  fu: stringType().catch(DEFAULT_STACK.fileUpload),
  log: stringType().catch(DEFAULT_STACK.logging),
  obs: stringType().catch(DEFAULT_STACK.observability),
  bl: stringType().catch(DEFAULT_STACK.backendLibraries),
  sm: stringType().catch(DEFAULT_STACK.stateManagement),
  val: stringType().catch(DEFAULT_STACK.validation),
  tst: stringType().catch(DEFAULT_STACK.testing),
  rt2: stringType().catch(DEFAULT_STACK.realtime),
  jq: stringType().catch(DEFAULT_STACK.jobQueue),
  cache: stringType().catch(DEFAULT_STACK.caching),
  anim: stringType().catch(DEFAULT_STACK.animation),
  cms: stringType().catch(DEFAULT_STACK.cms),
  cq: commaSeparatedArray(DEFAULT_STACK.codeQuality),
  doc: commaSeparatedArray(DEFAULT_STACK.documentation),
  ap: commaSeparatedArray(DEFAULT_STACK.appPlatforms),
  pm: stringType().catch(DEFAULT_STACK.packageManager),
  ex: commaSeparatedArray(DEFAULT_STACK.examples),
  aisdk: stringType().catch(DEFAULT_STACK.aiSdk),
  git: stringType().catch(DEFAULT_STACK.git),
  i: stringType().catch(DEFAULT_STACK.install),
  wd: stringType().catch(DEFAULT_STACK.webDeploy),
  sd: stringType().catch(DEFAULT_STACK.serverDeploy),
  yolo: stringType().catch(DEFAULT_STACK.yolo),
  // Rust ecosystem fields
  rwf: stringType().catch(DEFAULT_STACK.rustWebFramework),
  rfe: stringType().catch(DEFAULT_STACK.rustFrontend),
  rorm: stringType().catch(DEFAULT_STACK.rustOrm),
  rapi: stringType().catch(DEFAULT_STACK.rustApi),
  rcli: stringType().catch(DEFAULT_STACK.rustCli),
  rlib: stringType().catch(DEFAULT_STACK.rustLibraries),
  view: enumType(["command", "preview"]).catch("command"),
  file: stringType().catch(""),
});
const $$splitComponentImporter$1 = () => import("./new-DtdfxjTt.js");
const Route$2 = createFileRoute("/new")({
  validateSearch: zodValidator(stackSearchSchema),
  head: () => ({
    meta: [
      {
        title: "Stack Builder - Better-T-Stack",
      },
      {
        name: "description",
        content: "Interactive UI to roll your own stack",
      },
      {
        property: "og:title",
        content: "Stack Builder - Better-T-Stack",
      },
      {
        property: "og:description",
        content: "Interactive UI to roll your own stack",
      },
      {
        property: "og:url",
        content: "https://better-t-stack.dev/new",
      },
      {
        property: "og:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Stack Builder - Better-T-Stack",
      },
      {
        name: "twitter:description",
        content: "Interactive UI to roll your own stack",
      },
      {
        name: "twitter:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
});
const $$splitComponentImporter = () => import("./index-DoRK_WM5.js");
const Route$1 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
});
function stackStateToConfig(state) {
  const webFrontend = state.webFrontend || [];
  const nativeFrontend = state.nativeFrontend || [];
  const frontend = [
    ...webFrontend.filter((f) => f !== "none"),
    ...nativeFrontend.filter((f) => f !== "none"),
  ];
  let backend = state.backend || "hono";
  if (backend === "self-next" || backend === "self-tanstack-start") {
    backend = "self";
  }
  const git = typeof state.git === "boolean" ? state.git : state.git === "true";
  return {
    projectName: state.projectName || "my-better-t-app",
    projectDir: "/virtual",
    relativePath: "./virtual",
    ecosystem: "typescript",
    database: state.database || "none",
    orm: state.orm || "none",
    backend,
    runtime: state.runtime || "bun",
    frontend: frontend.length > 0 ? frontend : ["tanstack-router"],
    addons: [
      ...(state.codeQuality || []),
      ...(state.documentation || []),
      ...(state.appPlatforms || []),
    ].filter((a) => a !== "none"),
    examples: (state.examples || []).filter((e) => e !== "none"),
    auth: state.auth || "none",
    payments: state.payments || "none",
    effect: state.backendLibraries || "none",
    ai: state.ai || "none",
    stateManagement: state.stateManagement || "none",
    forms: state.forms || "none",
    testing: state.testing || "none",
    email: state.email || "none",
    git,
    packageManager: state.packageManager || "bun",
    install: false,
    dbSetup: state.dbSetup || "none",
    api: state.api || "trpc",
    webDeploy: state.webDeploy || "none",
    serverDeploy: state.serverDeploy || "none",
    cssFramework: state.cssFramework || "tailwind",
    uiLibrary: state.uiLibrary || "shadcn-ui",
    validation: "none",
    realtime: "none",
    jobQueue: "none",
    animation: "none",
    fileUpload: "none",
    logging: "none",
    observability: "none",
    cms: "none",
    caching: "none",
    rustWebFramework: "none",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: [],
  };
}
function transformTree(node) {
  var _a;
  if (node.type === "file") {
    return {
      name: node.name,
      path: node.path,
      type: "file",
      content: node.content,
      extension: node.extension,
    };
  }
  return {
    name: node.name,
    path: node.path,
    type: "directory",
    children: ((_a = node.children) == null ? void 0 : _a.map(transformTree)) || [],
  };
}
const Route2 = createFileRoute("/api/preview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { generateVirtualProject, EMBEDDED_TEMPLATES } =
            await import("./index-BOeEJoTf.js");
          const config = stackStateToConfig(body);
          const result = await generateVirtualProject({
            config,
            templates: EMBEDDED_TEMPLATES,
          });
          if (!result.success || !result.tree) {
            return Response.json(
              {
                success: false,
                error: result.error || "Failed to generate project",
              },
              { status: 500 },
            );
          }
          const transformedRoot = transformTree(result.tree.root);
          return Response.json({
            success: true,
            tree: {
              root: transformedRoot,
              fileCount: result.tree.fileCount,
              directoryCount: result.tree.directoryCount,
            },
          });
        } catch (error) {
          console.error("Preview generation error:", error);
          return Response.json(
            {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
const NewRoute = Route$2.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => Route$3,
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3,
});
const ApiPreviewRoute = Route2.update({
  id: "/api/preview",
  path: "/api/preview",
  getParentRoute: () => Route$3,
});
const rootRouteChildren = {
  IndexRoute,
  NewRoute,
  ApiPreviewRoute,
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      getRouter,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
export {
  DEFAULT_STACK as D,
  ECOSYSTEMS as E,
  Github as G,
  Info as I,
  Link as L,
  PRESET_TEMPLATES as P,
  TriangleAlert as T,
  TECH_OPTIONS as a,
  router as b,
  createLucideIcon as c,
  isStackDefault as i,
  reactDomExports as r,
  toast as t,
  useSearch as u,
};

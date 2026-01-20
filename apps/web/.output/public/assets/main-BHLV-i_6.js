const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/index-De2VzOaZ.js", "assets/check-DWEmbU_d.js"]),
) => i.map((i) => d[i]);
function Eb(a, i) {
  for (var r = 0; r < i.length; r++) {
    const o = i[r];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const l in o)
        if (l !== "default" && !(l in a)) {
          const f = Object.getOwnPropertyDescriptor(o, l);
          f && Object.defineProperty(a, l, f.get ? f : { enumerable: !0, get: () => o[l] });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
function Jg(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Ju = { exports: {} },
  Es = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Zp;
function Tb() {
  if (Zp) return Es;
  Zp = 1;
  var a = Symbol.for("react.transitional.element"),
    i = Symbol.for("react.fragment");
  function r(o, l, f) {
    var d = null;
    if ((f !== void 0 && (d = "" + f), l.key !== void 0 && (d = "" + l.key), "key" in l)) {
      f = {};
      for (var h in l) h !== "key" && (f[h] = l[h]);
    } else f = l;
    return ((l = f.ref), { $$typeof: a, type: o, key: d, ref: l !== void 0 ? l : null, props: f });
  }
  return ((Es.Fragment = i), (Es.jsx = r), (Es.jsxs = r), Es);
}
var Yp;
function Rb() {
  return (Yp || ((Yp = 1), (Ju.exports = Tb())), Ju.exports);
}
var F = Rb(),
  $u = { exports: {} },
  we = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Gp;
function Ab() {
  if (Gp) return we;
  Gp = 1;
  var a = Symbol.for("react.transitional.element"),
    i = Symbol.for("react.portal"),
    r = Symbol.for("react.fragment"),
    o = Symbol.for("react.strict_mode"),
    l = Symbol.for("react.profiler"),
    f = Symbol.for("react.consumer"),
    d = Symbol.for("react.context"),
    h = Symbol.for("react.forward_ref"),
    y = Symbol.for("react.suspense"),
    p = Symbol.for("react.memo"),
    b = Symbol.for("react.lazy"),
    g = Symbol.for("react.activity"),
    S = Symbol.iterator;
  function E(x) {
    return x === null || typeof x != "object"
      ? null
      : ((x = (S && x[S]) || x["@@iterator"]), typeof x == "function" ? x : null);
  }
  var R = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    k = Object.assign,
    L = {};
  function A(x, U, Q) {
    ((this.props = x), (this.context = U), (this.refs = L), (this.updater = Q || R));
  }
  ((A.prototype.isReactComponent = {}),
    (A.prototype.setState = function (x, U) {
      if (typeof x != "object" && typeof x != "function" && x != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, x, U, "setState");
    }),
    (A.prototype.forceUpdate = function (x) {
      this.updater.enqueueForceUpdate(this, x, "forceUpdate");
    }));
  function G() {}
  G.prototype = A.prototype;
  function Z(x, U, Q) {
    ((this.props = x), (this.context = U), (this.refs = L), (this.updater = Q || R));
  }
  var P = (Z.prototype = new G());
  ((P.constructor = Z), k(P, A.prototype), (P.isPureReactComponent = !0));
  var K = Array.isArray;
  function I() {}
  var B = { H: null, A: null, T: null, S: null },
    te = Object.prototype.hasOwnProperty;
  function ae(x, U, Q) {
    var $ = Q.ref;
    return { $$typeof: a, type: x, key: U, ref: $ !== void 0 ? $ : null, props: Q };
  }
  function X(x, U) {
    return ae(x.type, U, x.props);
  }
  function ee(x) {
    return typeof x == "object" && x !== null && x.$$typeof === a;
  }
  function ue(x) {
    var U = { "=": "=0", ":": "=2" };
    return (
      "$" +
      x.replace(/[=:]/g, function (Q) {
        return U[Q];
      })
    );
  }
  var ge = /\/+/g;
  function Ue(x, U) {
    return typeof x == "object" && x !== null && x.key != null ? ue("" + x.key) : U.toString(36);
  }
  function pe(x) {
    switch (x.status) {
      case "fulfilled":
        return x.value;
      case "rejected":
        throw x.reason;
      default:
        switch (
          (typeof x.status == "string"
            ? x.then(I, I)
            : ((x.status = "pending"),
              x.then(
                function (U) {
                  x.status === "pending" && ((x.status = "fulfilled"), (x.value = U));
                },
                function (U) {
                  x.status === "pending" && ((x.status = "rejected"), (x.reason = U));
                },
              )),
          x.status)
        ) {
          case "fulfilled":
            return x.value;
          case "rejected":
            throw x.reason;
        }
    }
    throw x;
  }
  function C(x, U, Q, $, ie) {
    var de = typeof x;
    (de === "undefined" || de === "boolean") && (x = null);
    var be = !1;
    if (x === null) be = !0;
    else
      switch (de) {
        case "bigint":
        case "string":
        case "number":
          be = !0;
          break;
        case "object":
          switch (x.$$typeof) {
            case a:
            case i:
              be = !0;
              break;
            case b:
              return ((be = x._init), C(be(x._payload), U, Q, $, ie));
          }
      }
    if (be)
      return (
        (ie = ie(x)),
        (be = $ === "" ? "." + Ue(x, 0) : $),
        K(ie)
          ? ((Q = ""),
            be != null && (Q = be.replace(ge, "$&/") + "/"),
            C(ie, U, Q, "", function (Lt) {
              return Lt;
            }))
          : ie != null &&
            (ee(ie) &&
              (ie = X(
                ie,
                Q +
                  (ie.key == null || (x && x.key === ie.key)
                    ? ""
                    : ("" + ie.key).replace(ge, "$&/") + "/") +
                  be,
              )),
            U.push(ie)),
        1
      );
    be = 0;
    var xe = $ === "" ? "." : $ + ":";
    if (K(x))
      for (var Le = 0; Le < x.length; Le++)
        (($ = x[Le]), (de = xe + Ue($, Le)), (be += C($, U, Q, de, ie)));
    else if (((Le = E(x)), typeof Le == "function"))
      for (x = Le.call(x), Le = 0; !($ = x.next()).done; )
        (($ = $.value), (de = xe + Ue($, Le++)), (be += C($, U, Q, de, ie)));
    else if (de === "object") {
      if (typeof x.then == "function") return C(pe(x), U, Q, $, ie);
      throw (
        (U = String(x)),
        Error(
          "Objects are not valid as a React child (found: " +
            (U === "[object Object]" ? "object with keys {" + Object.keys(x).join(", ") + "}" : U) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return be;
  }
  function H(x, U, Q) {
    if (x == null) return x;
    var $ = [],
      ie = 0;
    return (
      C(x, $, "", "", function (de) {
        return U.call(Q, de, ie++);
      }),
      $
    );
  }
  function ne(x) {
    if (x._status === -1) {
      var U = x._result;
      ((U = U()),
        U.then(
          function (Q) {
            (x._status === 0 || x._status === -1) && ((x._status = 1), (x._result = Q));
          },
          function (Q) {
            (x._status === 0 || x._status === -1) && ((x._status = 2), (x._result = Q));
          },
        ),
        x._status === -1 && ((x._status = 0), (x._result = U)));
    }
    if (x._status === 1) return x._result.default;
    throw x._result;
  }
  var ve =
      typeof reportError == "function"
        ? reportError
        : function (x) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var U = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof x == "object" && x !== null && typeof x.message == "string"
                    ? String(x.message)
                    : String(x),
                error: x,
              });
              if (!window.dispatchEvent(U)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", x);
              return;
            }
            console.error(x);
          },
    se = {
      map: H,
      forEach: function (x, U, Q) {
        H(
          x,
          function () {
            U.apply(this, arguments);
          },
          Q,
        );
      },
      count: function (x) {
        var U = 0;
        return (
          H(x, function () {
            U++;
          }),
          U
        );
      },
      toArray: function (x) {
        return (
          H(x, function (U) {
            return U;
          }) || []
        );
      },
      only: function (x) {
        if (!ee(x))
          throw Error("React.Children.only expected to receive a single React element child.");
        return x;
      },
    };
  return (
    (we.Activity = g),
    (we.Children = se),
    (we.Component = A),
    (we.Fragment = r),
    (we.Profiler = l),
    (we.PureComponent = Z),
    (we.StrictMode = o),
    (we.Suspense = y),
    (we.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = B),
    (we.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (x) {
        return B.H.useMemoCache(x);
      },
    }),
    (we.cache = function (x) {
      return function () {
        return x.apply(null, arguments);
      };
    }),
    (we.cacheSignal = function () {
      return null;
    }),
    (we.cloneElement = function (x, U, Q) {
      if (x == null) throw Error("The argument must be a React element, but you passed " + x + ".");
      var $ = k({}, x.props),
        ie = x.key;
      if (U != null)
        for (de in (U.key !== void 0 && (ie = "" + U.key), U))
          !te.call(U, de) ||
            de === "key" ||
            de === "__self" ||
            de === "__source" ||
            (de === "ref" && U.ref === void 0) ||
            ($[de] = U[de]);
      var de = arguments.length - 2;
      if (de === 1) $.children = Q;
      else if (1 < de) {
        for (var be = Array(de), xe = 0; xe < de; xe++) be[xe] = arguments[xe + 2];
        $.children = be;
      }
      return ae(x.type, ie, $);
    }),
    (we.createContext = function (x) {
      return (
        (x = {
          $$typeof: d,
          _currentValue: x,
          _currentValue2: x,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (x.Provider = x),
        (x.Consumer = { $$typeof: f, _context: x }),
        x
      );
    }),
    (we.createElement = function (x, U, Q) {
      var $,
        ie = {},
        de = null;
      if (U != null)
        for ($ in (U.key !== void 0 && (de = "" + U.key), U))
          te.call(U, $) && $ !== "key" && $ !== "__self" && $ !== "__source" && (ie[$] = U[$]);
      var be = arguments.length - 2;
      if (be === 1) ie.children = Q;
      else if (1 < be) {
        for (var xe = Array(be), Le = 0; Le < be; Le++) xe[Le] = arguments[Le + 2];
        ie.children = xe;
      }
      if (x && x.defaultProps)
        for ($ in ((be = x.defaultProps), be)) ie[$] === void 0 && (ie[$] = be[$]);
      return ae(x, de, ie);
    }),
    (we.createRef = function () {
      return { current: null };
    }),
    (we.forwardRef = function (x) {
      return { $$typeof: h, render: x };
    }),
    (we.isValidElement = ee),
    (we.lazy = function (x) {
      return { $$typeof: b, _payload: { _status: -1, _result: x }, _init: ne };
    }),
    (we.memo = function (x, U) {
      return { $$typeof: p, type: x, compare: U === void 0 ? null : U };
    }),
    (we.startTransition = function (x) {
      var U = B.T,
        Q = {};
      B.T = Q;
      try {
        var $ = x(),
          ie = B.S;
        (ie !== null && ie(Q, $),
          typeof $ == "object" && $ !== null && typeof $.then == "function" && $.then(I, ve));
      } catch (de) {
        ve(de);
      } finally {
        (U !== null && Q.types !== null && (U.types = Q.types), (B.T = U));
      }
    }),
    (we.unstable_useCacheRefresh = function () {
      return B.H.useCacheRefresh();
    }),
    (we.use = function (x) {
      return B.H.use(x);
    }),
    (we.useActionState = function (x, U, Q) {
      return B.H.useActionState(x, U, Q);
    }),
    (we.useCallback = function (x, U) {
      return B.H.useCallback(x, U);
    }),
    (we.useContext = function (x) {
      return B.H.useContext(x);
    }),
    (we.useDebugValue = function () {}),
    (we.useDeferredValue = function (x, U) {
      return B.H.useDeferredValue(x, U);
    }),
    (we.useEffect = function (x, U) {
      return B.H.useEffect(x, U);
    }),
    (we.useEffectEvent = function (x) {
      return B.H.useEffectEvent(x);
    }),
    (we.useId = function () {
      return B.H.useId();
    }),
    (we.useImperativeHandle = function (x, U, Q) {
      return B.H.useImperativeHandle(x, U, Q);
    }),
    (we.useInsertionEffect = function (x, U) {
      return B.H.useInsertionEffect(x, U);
    }),
    (we.useLayoutEffect = function (x, U) {
      return B.H.useLayoutEffect(x, U);
    }),
    (we.useMemo = function (x, U) {
      return B.H.useMemo(x, U);
    }),
    (we.useOptimistic = function (x, U) {
      return B.H.useOptimistic(x, U);
    }),
    (we.useReducer = function (x, U, Q) {
      return B.H.useReducer(x, U, Q);
    }),
    (we.useRef = function (x) {
      return B.H.useRef(x);
    }),
    (we.useState = function (x) {
      return B.H.useState(x);
    }),
    (we.useSyncExternalStore = function (x, U, Q) {
      return B.H.useSyncExternalStore(x, U, Q);
    }),
    (we.useTransition = function () {
      return B.H.useTransition();
    }),
    (we.version = "19.2.3"),
    we
  );
}
var Qp;
function Vs() {
  return (Qp || ((Qp = 1), ($u.exports = Ab())), $u.exports);
}
var le = Vs();
const W = Jg(le),
  Mb = Eb({ __proto__: null, default: W }, [le]);
var Wu = { exports: {} },
  Ts = {},
  ef = { exports: {} },
  tf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Xp;
function Cb() {
  return (
    Xp ||
      ((Xp = 1),
      (function (a) {
        function i(C, H) {
          var ne = C.length;
          C.push(H);
          e: for (; 0 < ne; ) {
            var ve = (ne - 1) >>> 1,
              se = C[ve];
            if (0 < l(se, H)) ((C[ve] = H), (C[ne] = se), (ne = ve));
            else break e;
          }
        }
        function r(C) {
          return C.length === 0 ? null : C[0];
        }
        function o(C) {
          if (C.length === 0) return null;
          var H = C[0],
            ne = C.pop();
          if (ne !== H) {
            C[0] = ne;
            e: for (var ve = 0, se = C.length, x = se >>> 1; ve < x; ) {
              var U = 2 * (ve + 1) - 1,
                Q = C[U],
                $ = U + 1,
                ie = C[$];
              if (0 > l(Q, ne))
                $ < se && 0 > l(ie, Q)
                  ? ((C[ve] = ie), (C[$] = ne), (ve = $))
                  : ((C[ve] = Q), (C[U] = ne), (ve = U));
              else if ($ < se && 0 > l(ie, ne)) ((C[ve] = ie), (C[$] = ne), (ve = $));
              else break e;
            }
          }
          return H;
        }
        function l(C, H) {
          var ne = C.sortIndex - H.sortIndex;
          return ne !== 0 ? ne : C.id - H.id;
        }
        if (
          ((a.unstable_now = void 0),
          typeof performance == "object" && typeof performance.now == "function")
        ) {
          var f = performance;
          a.unstable_now = function () {
            return f.now();
          };
        } else {
          var d = Date,
            h = d.now();
          a.unstable_now = function () {
            return d.now() - h;
          };
        }
        var y = [],
          p = [],
          b = 1,
          g = null,
          S = 3,
          E = !1,
          R = !1,
          k = !1,
          L = !1,
          A = typeof setTimeout == "function" ? setTimeout : null,
          G = typeof clearTimeout == "function" ? clearTimeout : null,
          Z = typeof setImmediate < "u" ? setImmediate : null;
        function P(C) {
          for (var H = r(p); H !== null; ) {
            if (H.callback === null) o(p);
            else if (H.startTime <= C) (o(p), (H.sortIndex = H.expirationTime), i(y, H));
            else break;
            H = r(p);
          }
        }
        function K(C) {
          if (((k = !1), P(C), !R))
            if (r(y) !== null) ((R = !0), I || ((I = !0), ue()));
            else {
              var H = r(p);
              H !== null && pe(K, H.startTime - C);
            }
        }
        var I = !1,
          B = -1,
          te = 5,
          ae = -1;
        function X() {
          return L ? !0 : !(a.unstable_now() - ae < te);
        }
        function ee() {
          if (((L = !1), I)) {
            var C = a.unstable_now();
            ae = C;
            var H = !0;
            try {
              e: {
                ((R = !1), k && ((k = !1), G(B), (B = -1)), (E = !0));
                var ne = S;
                try {
                  t: {
                    for (P(C), g = r(y); g !== null && !(g.expirationTime > C && X()); ) {
                      var ve = g.callback;
                      if (typeof ve == "function") {
                        ((g.callback = null), (S = g.priorityLevel));
                        var se = ve(g.expirationTime <= C);
                        if (((C = a.unstable_now()), typeof se == "function")) {
                          ((g.callback = se), P(C), (H = !0));
                          break t;
                        }
                        (g === r(y) && o(y), P(C));
                      } else o(y);
                      g = r(y);
                    }
                    if (g !== null) H = !0;
                    else {
                      var x = r(p);
                      (x !== null && pe(K, x.startTime - C), (H = !1));
                    }
                  }
                  break e;
                } finally {
                  ((g = null), (S = ne), (E = !1));
                }
                H = void 0;
              }
            } finally {
              H ? ue() : (I = !1);
            }
          }
        }
        var ue;
        if (typeof Z == "function")
          ue = function () {
            Z(ee);
          };
        else if (typeof MessageChannel < "u") {
          var ge = new MessageChannel(),
            Ue = ge.port2;
          ((ge.port1.onmessage = ee),
            (ue = function () {
              Ue.postMessage(null);
            }));
        } else
          ue = function () {
            A(ee, 0);
          };
        function pe(C, H) {
          B = A(function () {
            C(a.unstable_now());
          }, H);
        }
        ((a.unstable_IdlePriority = 5),
          (a.unstable_ImmediatePriority = 1),
          (a.unstable_LowPriority = 4),
          (a.unstable_NormalPriority = 3),
          (a.unstable_Profiling = null),
          (a.unstable_UserBlockingPriority = 2),
          (a.unstable_cancelCallback = function (C) {
            C.callback = null;
          }),
          (a.unstable_forceFrameRate = function (C) {
            0 > C || 125 < C
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (te = 0 < C ? Math.floor(1e3 / C) : 5);
          }),
          (a.unstable_getCurrentPriorityLevel = function () {
            return S;
          }),
          (a.unstable_next = function (C) {
            switch (S) {
              case 1:
              case 2:
              case 3:
                var H = 3;
                break;
              default:
                H = S;
            }
            var ne = S;
            S = H;
            try {
              return C();
            } finally {
              S = ne;
            }
          }),
          (a.unstable_requestPaint = function () {
            L = !0;
          }),
          (a.unstable_runWithPriority = function (C, H) {
            switch (C) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                C = 3;
            }
            var ne = S;
            S = C;
            try {
              return H();
            } finally {
              S = ne;
            }
          }),
          (a.unstable_scheduleCallback = function (C, H, ne) {
            var ve = a.unstable_now();
            switch (
              (typeof ne == "object" && ne !== null
                ? ((ne = ne.delay), (ne = typeof ne == "number" && 0 < ne ? ve + ne : ve))
                : (ne = ve),
              C)
            ) {
              case 1:
                var se = -1;
                break;
              case 2:
                se = 250;
                break;
              case 5:
                se = 1073741823;
                break;
              case 4:
                se = 1e4;
                break;
              default:
                se = 5e3;
            }
            return (
              (se = ne + se),
              (C = {
                id: b++,
                callback: H,
                priorityLevel: C,
                startTime: ne,
                expirationTime: se,
                sortIndex: -1,
              }),
              ne > ve
                ? ((C.sortIndex = ne),
                  i(p, C),
                  r(y) === null && C === r(p) && (k ? (G(B), (B = -1)) : (k = !0), pe(K, ne - ve)))
                : ((C.sortIndex = se), i(y, C), R || E || ((R = !0), I || ((I = !0), ue()))),
              C
            );
          }),
          (a.unstable_shouldYield = X),
          (a.unstable_wrapCallback = function (C) {
            var H = S;
            return function () {
              var ne = S;
              S = H;
              try {
                return C.apply(this, arguments);
              } finally {
                S = ne;
              }
            };
          }));
      })(tf)),
    tf
  );
}
var Fp;
function kb() {
  return (Fp || ((Fp = 1), (ef.exports = Cb())), ef.exports);
}
var nf = { exports: {} },
  kt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Pp;
function Ob() {
  if (Pp) return kt;
  Pp = 1;
  var a = Vs();
  function i(y) {
    var p = "https://react.dev/errors/" + y;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++) p += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return (
      "Minified React error #" +
      y +
      "; visit " +
      p +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function r() {}
  var o = {
      d: {
        f: r,
        r: function () {
          throw Error(i(522));
        },
        D: r,
        C: r,
        L: r,
        m: r,
        X: r,
        S: r,
        M: r,
      },
      p: 0,
      findDOMNode: null,
    },
    l = Symbol.for("react.portal");
  function f(y, p, b) {
    var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: l,
      key: g == null ? null : "" + g,
      children: y,
      containerInfo: p,
      implementation: b,
    };
  }
  var d = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(y, p) {
    if (y === "font") return "";
    if (typeof p == "string") return p === "use-credentials" ? p : "";
  }
  return (
    (kt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
    (kt.createPortal = function (y, p) {
      var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || (p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)) throw Error(i(299));
      return f(y, p, null, b);
    }),
    (kt.flushSync = function (y) {
      var p = d.T,
        b = o.p;
      try {
        if (((d.T = null), (o.p = 2), y)) return y();
      } finally {
        ((d.T = p), (o.p = b), o.d.f());
      }
    }),
    (kt.preconnect = function (y, p) {
      typeof y == "string" &&
        (p
          ? ((p = p.crossOrigin),
            (p = typeof p == "string" ? (p === "use-credentials" ? p : "") : void 0))
          : (p = null),
        o.d.C(y, p));
    }),
    (kt.prefetchDNS = function (y) {
      typeof y == "string" && o.d.D(y);
    }),
    (kt.preinit = function (y, p) {
      if (typeof y == "string" && p && typeof p.as == "string") {
        var b = p.as,
          g = h(b, p.crossOrigin),
          S = typeof p.integrity == "string" ? p.integrity : void 0,
          E = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        b === "style"
          ? o.d.S(y, typeof p.precedence == "string" ? p.precedence : void 0, {
              crossOrigin: g,
              integrity: S,
              fetchPriority: E,
            })
          : b === "script" &&
            o.d.X(y, {
              crossOrigin: g,
              integrity: S,
              fetchPriority: E,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
      }
    }),
    (kt.preinitModule = function (y, p) {
      if (typeof y == "string")
        if (typeof p == "object" && p !== null) {
          if (p.as == null || p.as === "script") {
            var b = h(p.as, p.crossOrigin);
            o.d.M(y, {
              crossOrigin: b,
              integrity: typeof p.integrity == "string" ? p.integrity : void 0,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
          }
        } else p == null && o.d.M(y);
    }),
    (kt.preload = function (y, p) {
      if (typeof y == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
        var b = p.as,
          g = h(b, p.crossOrigin);
        o.d.L(y, b, {
          crossOrigin: g,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          type: typeof p.type == "string" ? p.type : void 0,
          fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
          referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
          imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
          imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
          media: typeof p.media == "string" ? p.media : void 0,
        });
      }
    }),
    (kt.preloadModule = function (y, p) {
      if (typeof y == "string")
        if (p) {
          var b = h(p.as, p.crossOrigin);
          o.d.m(y, {
            as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
            crossOrigin: b,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          });
        } else o.d.m(y);
    }),
    (kt.requestFormReset = function (y) {
      o.d.r(y);
    }),
    (kt.unstable_batchedUpdates = function (y, p) {
      return y(p);
    }),
    (kt.useFormState = function (y, p, b) {
      return d.H.useFormState(y, p, b);
    }),
    (kt.useFormStatus = function () {
      return d.H.useHostTransitionStatus();
    }),
    (kt.version = "19.2.3"),
    kt
  );
}
var Kp;
function $g() {
  if (Kp) return nf.exports;
  Kp = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return (a(), (nf.exports = Ob()), nf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ip;
function Nb() {
  if (Ip) return Ts;
  Ip = 1;
  var a = kb(),
    i = Vs(),
    r = $g();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function l(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function f(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function y(e) {
    if (f(e) !== e) throw Error(o(188));
  }
  function p(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = f(e)), t === null)) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var n = e, s = t; ; ) {
      var c = n.return;
      if (c === null) break;
      var u = c.alternate;
      if (u === null) {
        if (((s = c.return), s !== null)) {
          n = s;
          continue;
        }
        break;
      }
      if (c.child === u.child) {
        for (u = c.child; u; ) {
          if (u === n) return (y(c), e);
          if (u === s) return (y(c), t);
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== s.return) ((n = c), (s = u));
      else {
        for (var m = !1, v = c.child; v; ) {
          if (v === n) {
            ((m = !0), (n = c), (s = u));
            break;
          }
          if (v === s) {
            ((m = !0), (s = c), (n = u));
            break;
          }
          v = v.sibling;
        }
        if (!m) {
          for (v = u.child; v; ) {
            if (v === n) {
              ((m = !0), (n = u), (s = c));
              break;
            }
            if (v === s) {
              ((m = !0), (s = u), (n = c));
              break;
            }
            v = v.sibling;
          }
          if (!m) throw Error(o(189));
        }
      }
      if (n.alternate !== s) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? e : t;
  }
  function b(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (((t = b(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  var g = Object.assign,
    S = Symbol.for("react.element"),
    E = Symbol.for("react.transitional.element"),
    R = Symbol.for("react.portal"),
    k = Symbol.for("react.fragment"),
    L = Symbol.for("react.strict_mode"),
    A = Symbol.for("react.profiler"),
    G = Symbol.for("react.consumer"),
    Z = Symbol.for("react.context"),
    P = Symbol.for("react.forward_ref"),
    K = Symbol.for("react.suspense"),
    I = Symbol.for("react.suspense_list"),
    B = Symbol.for("react.memo"),
    te = Symbol.for("react.lazy"),
    ae = Symbol.for("react.activity"),
    X = Symbol.for("react.memo_cache_sentinel"),
    ee = Symbol.iterator;
  function ue(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (ee && e[ee]) || e["@@iterator"]), typeof e == "function" ? e : null);
  }
  var ge = Symbol.for("react.client.reference");
  function Ue(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.$$typeof === ge ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case k:
        return "Fragment";
      case A:
        return "Profiler";
      case L:
        return "StrictMode";
      case K:
        return "Suspense";
      case I:
        return "SuspenseList";
      case ae:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case R:
          return "Portal";
        case Z:
          return e.displayName || "Context";
        case G:
          return (e._context.displayName || "Context") + ".Consumer";
        case P:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case B:
          return ((t = e.displayName || null), t !== null ? t : Ue(e.type) || "Memo");
        case te:
          ((t = e._payload), (e = e._init));
          try {
            return Ue(e(t));
          } catch {}
      }
    return null;
  }
  var pe = Array.isArray,
    C = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    H = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ne = { pending: !1, data: null, method: null, action: null },
    ve = [],
    se = -1;
  function x(e) {
    return { current: e };
  }
  function U(e) {
    0 > se || ((e.current = ve[se]), (ve[se] = null), se--);
  }
  function Q(e, t) {
    (se++, (ve[se] = e.current), (e.current = t));
  }
  var $ = x(null),
    ie = x(null),
    de = x(null),
    be = x(null);
  function xe(e, t) {
    switch ((Q(de, t), Q(ie, e), Q($, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? fp(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI))) ((t = fp(t)), (e = dp(t, e)));
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (U($), Q($, e));
  }
  function Le() {
    (U($), U(ie), U(de));
  }
  function Lt(e) {
    e.memoizedState !== null && Q(be, e);
    var t = $.current,
      n = dp(t, e.type);
    t !== n && (Q(ie, e), Q($, n));
  }
  function Kt(e) {
    (ie.current === e && (U($), U(ie)), be.current === e && (U(be), (Ss._currentValue = ne)));
  }
  var mt, Ci;
  function It(e) {
    if (mt === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ((mt = (t && t[1]) || ""),
          (Ci =
            -1 <
            n.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < n.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      mt +
      e +
      Ci
    );
  }
  var la = !1;
  function ca(e, t) {
    if (!e || la) return "";
    la = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var s = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var Y = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(Y.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(Y, []);
                } catch (j) {
                  var D = j;
                }
                Reflect.construct(e, [], Y);
              } else {
                try {
                  Y.call();
                } catch (j) {
                  D = j;
                }
                e.call(Y.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (j) {
                D = j;
              }
              (Y = e()) && typeof Y.catch == "function" && Y.catch(function () {});
            }
          } catch (j) {
            if (j && D && typeof j.stack == "string") return [j.stack, D.stack];
          }
          return [null, null];
        },
      };
      s.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var c = Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot, "name");
      c &&
        c.configurable &&
        Object.defineProperty(s.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var u = s.DetermineComponentFrameRoot(),
        m = u[0],
        v = u[1];
      if (m && v) {
        var w = m.split(`
`),
          z = v.split(`
`);
        for (c = s = 0; s < w.length && !w[s].includes("DetermineComponentFrameRoot"); ) s++;
        for (; c < z.length && !z[c].includes("DetermineComponentFrameRoot"); ) c++;
        if (s === w.length || c === z.length)
          for (s = w.length - 1, c = z.length - 1; 1 <= s && 0 <= c && w[s] !== z[c]; ) c--;
        for (; 1 <= s && 0 <= c; s--, c--)
          if (w[s] !== z[c]) {
            if (s !== 1 || c !== 1)
              do
                if ((s--, c--, 0 > c || w[s] !== z[c])) {
                  var q =
                    `
` + w[s].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      q.includes("<anonymous>") &&
                      (q = q.replace("<anonymous>", e.displayName)),
                    q
                  );
                }
              while (1 <= s && 0 <= c);
            break;
          }
      }
    } finally {
      ((la = !1), (Error.prepareStackTrace = n));
    }
    return (n = e ? e.displayName || e.name : "") ? It(n) : "";
  }
  function jn(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return It(e.type);
      case 16:
        return It("Lazy");
      case 13:
        return e.child !== t && t !== null ? It("Suspense Fallback") : It("Suspense");
      case 19:
        return It("SuspenseList");
      case 0:
      case 15:
        return ca(e.type, !1);
      case 11:
        return ca(e.type.render, !1);
      case 1:
        return ca(e.type, !0);
      case 31:
        return It("Activity");
      default:
        return "";
    }
  }
  function Ja(e) {
    try {
      var t = "",
        n = null;
      do ((t += jn(e, n)), (n = e), (e = e.return));
      while (e);
      return t;
    } catch (s) {
      return (
        `
Error generating stack: ` +
        s.message +
        `
` +
        s.stack
      );
    }
  }
  var pt = Object.prototype.hasOwnProperty,
    En = a.unstable_scheduleCallback,
    ua = a.unstable_cancelCallback,
    gt = a.unstable_shouldYield,
    ke = a.unstable_requestPaint,
    Be = a.unstable_now,
    Ot = a.unstable_getCurrentPriorityLevel,
    Tn = a.unstable_ImmediatePriority,
    Ys = a.unstable_UserBlockingPriority,
    $a = a.unstable_NormalPriority,
    zr = a.unstable_LowPriority,
    Un = a.unstable_IdlePriority,
    Gs = a.log,
    fa = a.unstable_setDisableYieldValue,
    Wa = null,
    Nt = null;
  function bn(e) {
    if ((typeof Gs == "function" && fa(e), Nt && typeof Nt.setStrictMode == "function"))
      try {
        Nt.setStrictMode(Wa, e);
      } catch {}
  }
  var Mt = Math.clz32 ? Math.clz32 : Rn,
    ql = Math.log,
    Dr = Math.LN2;
  function Rn(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((ql(e) / Dr) | 0)) | 0);
  }
  var ki = 256,
    Oi = 262144,
    ei = 4194304;
  function An(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Se(e, t, n) {
    var s = e.pendingLanes;
    if (s === 0) return 0;
    var c = 0,
      u = e.suspendedLanes,
      m = e.pingedLanes;
    e = e.warmLanes;
    var v = s & 134217727;
    return (
      v !== 0
        ? ((s = v & ~u),
          s !== 0
            ? (c = An(s))
            : ((m &= v), m !== 0 ? (c = An(m)) : n || ((n = v & ~e), n !== 0 && (c = An(n)))))
        : ((v = s & ~u),
          v !== 0
            ? (c = An(v))
            : m !== 0
              ? (c = An(m))
              : n || ((n = s & ~e), n !== 0 && (c = An(n)))),
      c === 0
        ? 0
        : t !== 0 &&
            t !== c &&
            (t & u) === 0 &&
            ((u = c & -c), (n = t & -t), u >= n || (u === 32 && (n & 4194048) !== 0))
          ? t
          : c
    );
  }
  function et(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function yt(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ct() {
    var e = ei;
    return ((ei <<= 1), (ei & 62914560) === 0 && (ei = 4194304), e);
  }
  function da(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function nt(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function jt(e, t, n, s, c, u) {
    var m = e.pendingLanes;
    ((e.pendingLanes = n),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= n),
      (e.entangledLanes &= n),
      (e.errorRecoveryDisabledLanes &= n),
      (e.shellSuspendCounter = 0));
    var v = e.entanglements,
      w = e.expirationTimes,
      z = e.hiddenUpdates;
    for (n = m & ~n; 0 < n; ) {
      var q = 31 - Mt(n),
        Y = 1 << q;
      ((v[q] = 0), (w[q] = -1));
      var D = z[q];
      if (D !== null)
        for (z[q] = null, q = 0; q < D.length; q++) {
          var j = D[q];
          j !== null && (j.lane &= -536870913);
        }
      n &= ~Y;
    }
    (s !== 0 && ti(e, s, 0),
      u !== 0 && c === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(m & ~t)));
  }
  function ti(e, t, n) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var s = 31 - Mt(t);
    ((e.entangledLanes |= t),
      (e.entanglements[s] = e.entanglements[s] | 1073741824 | (n & 261930)));
  }
  function Ut(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var s = 31 - Mt(n),
        c = 1 << s;
      ((c & t) | (e[s] & t) && (e[s] |= t), (n &= ~c));
    }
  }
  function Bt(e, t) {
    var n = t & -t;
    return ((n = (n & 42) !== 0 ? 1 : Ni(n)), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n);
  }
  function Ni(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Sn(e) {
    return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function Vl() {
    var e = H.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : Lp(e.type));
  }
  function Jf(e, t) {
    var n = H.p;
    try {
      return ((H.p = e), t());
    } finally {
      H.p = n;
    }
  }
  var ha = Math.random().toString(36).slice(2),
    xt = "__reactFiber$" + ha,
    Ht = "__reactProps$" + ha,
    zi = "__reactContainer$" + ha,
    Zl = "__reactEvents$" + ha,
    hy = "__reactListeners$" + ha,
    my = "__reactHandles$" + ha,
    $f = "__reactResources$" + ha,
    Lr = "__reactMarker$" + ha;
  function Yl(e) {
    (delete e[xt], delete e[Ht], delete e[Zl], delete e[hy], delete e[my]);
  }
  function Di(e) {
    var t = e[xt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[zi] || n[xt])) {
        if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
          for (e = bp(e); e !== null; ) {
            if ((n = e[xt])) return n;
            e = bp(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function Li(e) {
    if ((e = e[xt] || e[zi])) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function jr(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function ji(e) {
    var t = e[$f];
    return (t || (t = e[$f] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function vt(e) {
    e[Lr] = !0;
  }
  var Wf = new Set(),
    ed = {};
  function ni(e, t) {
    (Ui(e, t), Ui(e + "Capture", t));
  }
  function Ui(e, t) {
    for (ed[e] = t, e = 0; e < t.length; e++) Wf.add(t[e]);
  }
  var py = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    td = {},
    nd = {};
  function gy(e) {
    return pt.call(nd, e)
      ? !0
      : pt.call(td, e)
        ? !1
        : py.test(e)
          ? (nd[e] = !0)
          : ((td[e] = !0), !1);
  }
  function Qs(e, t, n) {
    if (gy(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var s = t.toLowerCase().slice(0, 5);
            if (s !== "data-" && s !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function Xs(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function Bn(e, t, n, s) {
    if (s === null) e.removeAttribute(n);
    else {
      switch (typeof s) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + s);
    }
  }
  function sn(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ad(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function yy(e, t, n) {
    var s = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof s < "u" &&
      typeof s.get == "function" &&
      typeof s.set == "function"
    ) {
      var c = s.get,
        u = s.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return c.call(this);
          },
          set: function (m) {
            ((n = "" + m), u.call(this, m));
          },
        }),
        Object.defineProperty(e, t, { enumerable: s.enumerable }),
        {
          getValue: function () {
            return n;
          },
          setValue: function (m) {
            n = "" + m;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Gl(e) {
    if (!e._valueTracker) {
      var t = ad(e) ? "checked" : "value";
      e._valueTracker = yy(e, t, "" + e[t]);
    }
  }
  function id(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      s = "";
    return (
      e && (s = ad(e) ? (e.checked ? "true" : "false") : e.value),
      (e = s),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  function Fs(e) {
    if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var vy = /[\n"\\]/g;
  function on(e) {
    return e.replace(vy, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function Ql(e, t, n, s, c, u, m, v) {
    ((e.name = ""),
      m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean"
        ? (e.type = m)
        : e.removeAttribute("type"),
      t != null
        ? m === "number"
          ? ((t === 0 && e.value === "") || e.value != t) && (e.value = "" + sn(t))
          : e.value !== "" + sn(t) && (e.value = "" + sn(t))
        : (m !== "submit" && m !== "reset") || e.removeAttribute("value"),
      t != null
        ? Xl(e, m, sn(t))
        : n != null
          ? Xl(e, m, sn(n))
          : s != null && e.removeAttribute("value"),
      c == null && u != null && (e.defaultChecked = !!u),
      c != null && (e.checked = c && typeof c != "function" && typeof c != "symbol"),
      v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean"
        ? (e.name = "" + sn(v))
        : e.removeAttribute("name"));
  }
  function rd(e, t, n, s, c, u, m, v) {
    if (
      (u != null &&
        typeof u != "function" &&
        typeof u != "symbol" &&
        typeof u != "boolean" &&
        (e.type = u),
      t != null || n != null)
    ) {
      if (!((u !== "submit" && u !== "reset") || t != null)) {
        Gl(e);
        return;
      }
      ((n = n != null ? "" + sn(n) : ""),
        (t = t != null ? "" + sn(t) : n),
        v || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((s = s ?? c),
      (s = typeof s != "function" && typeof s != "symbol" && !!s),
      (e.checked = v ? e.checked : !!s),
      (e.defaultChecked = !!s),
      m != null &&
        typeof m != "function" &&
        typeof m != "symbol" &&
        typeof m != "boolean" &&
        (e.name = m),
      Gl(e));
  }
  function Xl(e, t, n) {
    (t === "number" && Fs(e.ownerDocument) === e) ||
      e.defaultValue === "" + n ||
      (e.defaultValue = "" + n);
  }
  function Bi(e, t, n, s) {
    if (((e = e.options), t)) {
      t = {};
      for (var c = 0; c < n.length; c++) t["$" + n[c]] = !0;
      for (n = 0; n < e.length; n++)
        ((c = t.hasOwnProperty("$" + e[n].value)),
          e[n].selected !== c && (e[n].selected = c),
          c && s && (e[n].defaultSelected = !0));
    } else {
      for (n = "" + sn(n), t = null, c = 0; c < e.length; c++) {
        if (e[c].value === n) {
          ((e[c].selected = !0), s && (e[c].defaultSelected = !0));
          return;
        }
        t !== null || e[c].disabled || (t = e[c]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function sd(e, t, n) {
    if (t != null && ((t = "" + sn(t)), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + sn(n) : "";
  }
  function od(e, t, n, s) {
    if (t == null) {
      if (s != null) {
        if (n != null) throw Error(o(92));
        if (pe(s)) {
          if (1 < s.length) throw Error(o(93));
          s = s[0];
        }
        n = s;
      }
      (n == null && (n = ""), (t = n));
    }
    ((n = sn(t)),
      (e.defaultValue = n),
      (s = e.textContent),
      s === n && s !== "" && s !== null && (e.value = s),
      Gl(e));
  }
  function Hi(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var by = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function ld(e, t, n) {
    var s = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === ""
      ? s
        ? e.setProperty(t, "")
        : t === "float"
          ? (e.cssFloat = "")
          : (e[t] = "")
      : s
        ? e.setProperty(t, n)
        : typeof n != "number" || n === 0 || by.has(t)
          ? t === "float"
            ? (e.cssFloat = n)
            : (e[t] = ("" + n).trim())
          : (e[t] = n + "px");
  }
  function cd(e, t, n) {
    if (t != null && typeof t != "object") throw Error(o(62));
    if (((e = e.style), n != null)) {
      for (var s in n)
        !n.hasOwnProperty(s) ||
          (t != null && t.hasOwnProperty(s)) ||
          (s.indexOf("--") === 0
            ? e.setProperty(s, "")
            : s === "float"
              ? (e.cssFloat = "")
              : (e[s] = ""));
      for (var c in t) ((s = t[c]), t.hasOwnProperty(c) && n[c] !== s && ld(e, c, s));
    } else for (var u in t) t.hasOwnProperty(u) && ld(e, u, t[u]);
  }
  function Fl(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Sy = new Map([
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
    _y =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ps(e) {
    return _y.test("" + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function Hn() {}
  var Pl = null;
  function Kl(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var qi = null,
    Vi = null;
  function ud(e) {
    var t = Li(e);
    if (t && (e = t.stateNode)) {
      var n = e[Ht] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case "input":
          if (
            (Ql(
              e,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (t = n.name),
            n.type === "radio" && t != null)
          ) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll('input[name="' + on("" + t) + '"][type="radio"]'), t = 0;
              t < n.length;
              t++
            ) {
              var s = n[t];
              if (s !== e && s.form === e.form) {
                var c = s[Ht] || null;
                if (!c) throw Error(o(90));
                Ql(
                  s,
                  c.value,
                  c.defaultValue,
                  c.defaultValue,
                  c.checked,
                  c.defaultChecked,
                  c.type,
                  c.name,
                );
              }
            }
            for (t = 0; t < n.length; t++) ((s = n[t]), s.form === e.form && id(s));
          }
          break e;
        case "textarea":
          sd(e, n.value, n.defaultValue);
          break e;
        case "select":
          ((t = n.value), t != null && Bi(e, !!n.multiple, t, !1));
      }
    }
  }
  var Il = !1;
  function fd(e, t, n) {
    if (Il) return e(t, n);
    Il = !0;
    try {
      var s = e(t);
      return s;
    } finally {
      if (
        ((Il = !1),
        (qi !== null || Vi !== null) &&
          (jo(), qi && ((t = qi), (e = Vi), (Vi = qi = null), ud(t), e)))
      )
        for (t = 0; t < e.length; t++) ud(e[t]);
    }
  }
  function Ur(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var s = n[Ht] || null;
    if (s === null) return null;
    n = s[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((s = !s.disabled) ||
          ((e = e.type),
          (s = !(e === "button" || e === "input" || e === "select" || e === "textarea"))),
          (e = !s));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(o(231, t, typeof n));
    return n;
  }
  var qn = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    Jl = !1;
  if (qn)
    try {
      var Br = {};
      (Object.defineProperty(Br, "passive", {
        get: function () {
          Jl = !0;
        },
      }),
        window.addEventListener("test", Br, Br),
        window.removeEventListener("test", Br, Br));
    } catch {
      Jl = !1;
    }
  var ma = null,
    $l = null,
    Ks = null;
  function dd() {
    if (Ks) return Ks;
    var e,
      t = $l,
      n = t.length,
      s,
      c = "value" in ma ? ma.value : ma.textContent,
      u = c.length;
    for (e = 0; e < n && t[e] === c[e]; e++);
    var m = n - e;
    for (s = 1; s <= m && t[n - s] === c[u - s]; s++);
    return (Ks = c.slice(e, 1 < s ? 1 - s : void 0));
  }
  function Is(e) {
    var t = e.keyCode;
    return (
      "charCode" in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Js() {
    return !0;
  }
  function hd() {
    return !1;
  }
  function qt(e) {
    function t(n, s, c, u, m) {
      ((this._reactName = n),
        (this._targetInst = c),
        (this.type = s),
        (this.nativeEvent = u),
        (this.target = m),
        (this.currentTarget = null));
      for (var v in e) e.hasOwnProperty(v) && ((n = e[v]), (this[v] = n ? n(u) : u[v]));
      return (
        (this.isDefaultPrevented = (
          u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1
        )
          ? Js
          : hd),
        (this.isPropagationStopped = hd),
        this
      );
    }
    return (
      g(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = Js));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = Js));
        },
        persist: function () {},
        isPersistent: Js,
      }),
      t
    );
  }
  var ai = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    $s = qt(ai),
    Hr = g({}, ai, { view: 0, detail: 0 }),
    xy = qt(Hr),
    Wl,
    ec,
    qr,
    Ws = g({}, Hr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: nc,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== qr &&
              (qr && e.type === "mousemove"
                ? ((Wl = e.screenX - qr.screenX), (ec = e.screenY - qr.screenY))
                : (ec = Wl = 0),
              (qr = e)),
            Wl);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : ec;
      },
    }),
    md = qt(Ws),
    wy = g({}, Ws, { dataTransfer: 0 }),
    Ey = qt(wy),
    Ty = g({}, Hr, { relatedTarget: 0 }),
    tc = qt(Ty),
    Ry = g({}, ai, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Ay = qt(Ry),
    My = g({}, ai, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    Cy = qt(My),
    ky = g({}, ai, { data: 0 }),
    pd = qt(ky),
    Oy = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    Ny = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    zy = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Dy(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = zy[e]) ? !!t[e] : !1;
  }
  function nc() {
    return Dy;
  }
  var Ly = g({}, Hr, {
      key: function (e) {
        if (e.key) {
          var t = Oy[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = Is(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? Ny[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: nc,
      charCode: function (e) {
        return e.type === "keypress" ? Is(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? Is(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    jy = qt(Ly),
    Uy = g({}, Ws, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    gd = qt(Uy),
    By = g({}, Hr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: nc,
    }),
    Hy = qt(By),
    qy = g({}, ai, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Vy = qt(qy),
    Zy = g({}, Ws, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Yy = qt(Zy),
    Gy = g({}, ai, { newState: 0, oldState: 0 }),
    Qy = qt(Gy),
    Xy = [9, 13, 27, 32],
    ac = qn && "CompositionEvent" in window,
    Vr = null;
  qn && "documentMode" in document && (Vr = document.documentMode);
  var Fy = qn && "TextEvent" in window && !Vr,
    yd = qn && (!ac || (Vr && 8 < Vr && 11 >= Vr)),
    vd = " ",
    bd = !1;
  function Sd(e, t) {
    switch (e) {
      case "keyup":
        return Xy.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function _d(e) {
    return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
  }
  var Zi = !1;
  function Py(e, t) {
    switch (e) {
      case "compositionend":
        return _d(t);
      case "keypress":
        return t.which !== 32 ? null : ((bd = !0), vd);
      case "textInput":
        return ((e = t.data), e === vd && bd ? null : e);
      default:
        return null;
    }
  }
  function Ky(e, t) {
    if (Zi)
      return e === "compositionend" || (!ac && Sd(e, t))
        ? ((e = dd()), (Ks = $l = ma = null), (Zi = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return yd && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Iy = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function xd(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Iy[e.type] : t === "textarea";
  }
  function wd(e, t, n, s) {
    (qi ? (Vi ? Vi.push(s) : (Vi = [s])) : (qi = s),
      (t = Yo(t, "onChange")),
      0 < t.length &&
        ((n = new $s("onChange", "change", null, n, s)), e.push({ event: n, listeners: t })));
  }
  var Zr = null,
    Yr = null;
  function Jy(e) {
    rp(e, 0);
  }
  function eo(e) {
    var t = jr(e);
    if (id(t)) return e;
  }
  function Ed(e, t) {
    if (e === "change") return t;
  }
  var Td = !1;
  if (qn) {
    var ic;
    if (qn) {
      var rc = "oninput" in document;
      if (!rc) {
        var Rd = document.createElement("div");
        (Rd.setAttribute("oninput", "return;"), (rc = typeof Rd.oninput == "function"));
      }
      ic = rc;
    } else ic = !1;
    Td = ic && (!document.documentMode || 9 < document.documentMode);
  }
  function Ad() {
    Zr && (Zr.detachEvent("onpropertychange", Md), (Yr = Zr = null));
  }
  function Md(e) {
    if (e.propertyName === "value" && eo(Yr)) {
      var t = [];
      (wd(t, Yr, e, Kl(e)), fd(Jy, t));
    }
  }
  function $y(e, t, n) {
    e === "focusin"
      ? (Ad(), (Zr = t), (Yr = n), Zr.attachEvent("onpropertychange", Md))
      : e === "focusout" && Ad();
  }
  function Wy(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return eo(Yr);
  }
  function ev(e, t) {
    if (e === "click") return eo(t);
  }
  function tv(e, t) {
    if (e === "input" || e === "change") return eo(t);
  }
  function nv(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var Jt = typeof Object.is == "function" ? Object.is : nv;
  function Gr(e, t) {
    if (Jt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e),
      s = Object.keys(t);
    if (n.length !== s.length) return !1;
    for (s = 0; s < n.length; s++) {
      var c = n[s];
      if (!pt.call(t, c) || !Jt(e[c], t[c])) return !1;
    }
    return !0;
  }
  function Cd(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function kd(e, t) {
    var n = Cd(e);
    e = 0;
    for (var s; n; ) {
      if (n.nodeType === 3) {
        if (((s = e + n.textContent.length), e <= t && s >= t)) return { node: n, offset: t - e };
        e = s;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Cd(n);
    }
  }
  function Od(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Od(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Nd(e) {
    e =
      e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = Fs(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Fs(e.document);
    }
    return t;
  }
  function sc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  var av = qn && "documentMode" in document && 11 >= document.documentMode,
    Yi = null,
    oc = null,
    Qr = null,
    lc = !1;
  function zd(e, t, n) {
    var s = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    lc ||
      Yi == null ||
      Yi !== Fs(s) ||
      ((s = Yi),
      "selectionStart" in s && sc(s)
        ? (s = { start: s.selectionStart, end: s.selectionEnd })
        : ((s = ((s.ownerDocument && s.ownerDocument.defaultView) || window).getSelection()),
          (s = {
            anchorNode: s.anchorNode,
            anchorOffset: s.anchorOffset,
            focusNode: s.focusNode,
            focusOffset: s.focusOffset,
          })),
      (Qr && Gr(Qr, s)) ||
        ((Qr = s),
        (s = Yo(oc, "onSelect")),
        0 < s.length &&
          ((t = new $s("onSelect", "select", null, t, n)),
          e.push({ event: t, listeners: s }),
          (t.target = Yi))));
  }
  function ii(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n["Webkit" + e] = "webkit" + t),
      (n["Moz" + e] = "moz" + t),
      n
    );
  }
  var Gi = {
      animationend: ii("Animation", "AnimationEnd"),
      animationiteration: ii("Animation", "AnimationIteration"),
      animationstart: ii("Animation", "AnimationStart"),
      transitionrun: ii("Transition", "TransitionRun"),
      transitionstart: ii("Transition", "TransitionStart"),
      transitioncancel: ii("Transition", "TransitionCancel"),
      transitionend: ii("Transition", "TransitionEnd"),
    },
    cc = {},
    Dd = {};
  qn &&
    ((Dd = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete Gi.animationend.animation,
      delete Gi.animationiteration.animation,
      delete Gi.animationstart.animation),
    "TransitionEvent" in window || delete Gi.transitionend.transition);
  function ri(e) {
    if (cc[e]) return cc[e];
    if (!Gi[e]) return e;
    var t = Gi[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in Dd) return (cc[e] = t[n]);
    return e;
  }
  var Ld = ri("animationend"),
    jd = ri("animationiteration"),
    Ud = ri("animationstart"),
    iv = ri("transitionrun"),
    rv = ri("transitionstart"),
    sv = ri("transitioncancel"),
    Bd = ri("transitionend"),
    Hd = new Map(),
    uc =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  uc.push("scrollEnd");
  function _n(e, t) {
    (Hd.set(e, t), ni(t, [e]));
  }
  var to =
      typeof reportError == "function"
        ? reportError
        : function (e) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var t = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == "object" && e !== null && typeof e.message == "string"
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", e);
              return;
            }
            console.error(e);
          },
    ln = [],
    Qi = 0,
    fc = 0;
  function no() {
    for (var e = Qi, t = (fc = Qi = 0); t < e; ) {
      var n = ln[t];
      ln[t++] = null;
      var s = ln[t];
      ln[t++] = null;
      var c = ln[t];
      ln[t++] = null;
      var u = ln[t];
      if (((ln[t++] = null), s !== null && c !== null)) {
        var m = s.pending;
        (m === null ? (c.next = c) : ((c.next = m.next), (m.next = c)), (s.pending = c));
      }
      u !== 0 && qd(n, c, u);
    }
  }
  function ao(e, t, n, s) {
    ((ln[Qi++] = e),
      (ln[Qi++] = t),
      (ln[Qi++] = n),
      (ln[Qi++] = s),
      (fc |= s),
      (e.lanes |= s),
      (e = e.alternate),
      e !== null && (e.lanes |= s));
  }
  function dc(e, t, n, s) {
    return (ao(e, t, n, s), io(e));
  }
  function si(e, t) {
    return (ao(e, null, null, t), io(e));
  }
  function qd(e, t, n) {
    e.lanes |= n;
    var s = e.alternate;
    s !== null && (s.lanes |= n);
    for (var c = !1, u = e.return; u !== null; )
      ((u.childLanes |= n),
        (s = u.alternate),
        s !== null && (s.childLanes |= n),
        u.tag === 22 && ((e = u.stateNode), e === null || e._visibility & 1 || (c = !0)),
        (e = u),
        (u = u.return));
    return e.tag === 3
      ? ((u = e.stateNode),
        c &&
          t !== null &&
          ((c = 31 - Mt(n)),
          (e = u.hiddenUpdates),
          (s = e[c]),
          s === null ? (e[c] = [t]) : s.push(t),
          (t.lane = n | 536870912)),
        u)
      : null;
  }
  function io(e) {
    if (50 < hs) throw ((hs = 0), (_u = null), Error(o(185)));
    for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var Xi = {};
  function ov(e, t, n, s) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = s),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function $t(e, t, n, s) {
    return new ov(e, t, n, s);
  }
  function hc(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function Vn(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = $t(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 65011712),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      (n.refCleanup = e.refCleanup),
      n
    );
  }
  function Vd(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return (
      n === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = n.childLanes),
          (e.lanes = n.lanes),
          (e.child = n.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = n.memoizedProps),
          (e.memoizedState = n.memoizedState),
          (e.updateQueue = n.updateQueue),
          (e.type = n.type),
          (t = n.dependencies),
          (e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function ro(e, t, n, s, c, u) {
    var m = 0;
    if (((s = e), typeof e == "function")) hc(e) && (m = 1);
    else if (typeof e == "string")
      m = db(e, n, $.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case ae:
          return ((e = $t(31, n, t, c)), (e.elementType = ae), (e.lanes = u), e);
        case k:
          return oi(n.children, c, u, t);
        case L:
          ((m = 8), (c |= 24));
          break;
        case A:
          return ((e = $t(12, n, t, c | 2)), (e.elementType = A), (e.lanes = u), e);
        case K:
          return ((e = $t(13, n, t, c)), (e.elementType = K), (e.lanes = u), e);
        case I:
          return ((e = $t(19, n, t, c)), (e.elementType = I), (e.lanes = u), e);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Z:
                m = 10;
                break e;
              case G:
                m = 9;
                break e;
              case P:
                m = 11;
                break e;
              case B:
                m = 14;
                break e;
              case te:
                ((m = 16), (s = null));
                break e;
            }
          ((m = 29), (n = Error(o(130, e === null ? "null" : typeof e, ""))), (s = null));
      }
    return ((t = $t(m, n, t, c)), (t.elementType = e), (t.type = s), (t.lanes = u), t);
  }
  function oi(e, t, n, s) {
    return ((e = $t(7, e, s, t)), (e.lanes = n), e);
  }
  function mc(e, t, n) {
    return ((e = $t(6, e, null, t)), (e.lanes = n), e);
  }
  function Zd(e) {
    var t = $t(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function pc(e, t, n) {
    return (
      (t = $t(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var Yd = new WeakMap();
  function cn(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Yd.get(e);
      return n !== void 0 ? n : ((t = { value: e, source: t, stack: Ja(t) }), Yd.set(e, t), t);
    }
    return { value: e, source: t, stack: Ja(t) };
  }
  var Fi = [],
    Pi = 0,
    so = null,
    Xr = 0,
    un = [],
    fn = 0,
    pa = null,
    Mn = 1,
    Cn = "";
  function Zn(e, t) {
    ((Fi[Pi++] = Xr), (Fi[Pi++] = so), (so = e), (Xr = t));
  }
  function Gd(e, t, n) {
    ((un[fn++] = Mn), (un[fn++] = Cn), (un[fn++] = pa), (pa = e));
    var s = Mn;
    e = Cn;
    var c = 32 - Mt(s) - 1;
    ((s &= ~(1 << c)), (n += 1));
    var u = 32 - Mt(t) + c;
    if (30 < u) {
      var m = c - (c % 5);
      ((u = (s & ((1 << m) - 1)).toString(32)),
        (s >>= m),
        (c -= m),
        (Mn = (1 << (32 - Mt(t) + c)) | (n << c) | s),
        (Cn = u + e));
    } else ((Mn = (1 << u) | (n << c) | s), (Cn = e));
  }
  function gc(e) {
    e.return !== null && (Zn(e, 1), Gd(e, 1, 0));
  }
  function yc(e) {
    for (; e === so; ) ((so = Fi[--Pi]), (Fi[Pi] = null), (Xr = Fi[--Pi]), (Fi[Pi] = null));
    for (; e === pa; )
      ((pa = un[--fn]),
        (un[fn] = null),
        (Cn = un[--fn]),
        (un[fn] = null),
        (Mn = un[--fn]),
        (un[fn] = null));
  }
  function Qd(e, t) {
    ((un[fn++] = Mn), (un[fn++] = Cn), (un[fn++] = pa), (Mn = t.id), (Cn = t.overflow), (pa = e));
  }
  var wt = null,
    $e = null,
    je = !1,
    ga = null,
    dn = !1,
    vc = Error(o(519));
  function ya(e) {
    var t = Error(
      o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""),
    );
    throw (Fr(cn(t, e)), vc);
  }
  function Xd(e) {
    var t = e.stateNode,
      n = e.type,
      s = e.memoizedProps;
    switch (((t[xt] = e), (t[Ht] = s), n)) {
      case "dialog":
        (Ne("cancel", t), Ne("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        Ne("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < ps.length; n++) Ne(ps[n], t);
        break;
      case "source":
        Ne("error", t);
        break;
      case "img":
      case "image":
      case "link":
        (Ne("error", t), Ne("load", t));
        break;
      case "details":
        Ne("toggle", t);
        break;
      case "input":
        (Ne("invalid", t),
          rd(t, s.value, s.defaultValue, s.checked, s.defaultChecked, s.type, s.name, !0));
        break;
      case "select":
        Ne("invalid", t);
        break;
      case "textarea":
        (Ne("invalid", t), od(t, s.value, s.defaultValue, s.children));
    }
    ((n = s.children),
      (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
      t.textContent === "" + n ||
      s.suppressHydrationWarning === !0 ||
      cp(t.textContent, n)
        ? (s.popover != null && (Ne("beforetoggle", t), Ne("toggle", t)),
          s.onScroll != null && Ne("scroll", t),
          s.onScrollEnd != null && Ne("scrollend", t),
          s.onClick != null && (t.onclick = Hn),
          (t = !0))
        : (t = !1),
      t || ya(e, !0));
  }
  function Fd(e) {
    for (wt = e.return; wt; )
      switch (wt.tag) {
        case 5:
        case 31:
        case 13:
          dn = !1;
          return;
        case 27:
        case 3:
          dn = !0;
          return;
        default:
          wt = wt.return;
      }
  }
  function Ki(e) {
    if (e !== wt) return !1;
    if (!je) return (Fd(e), (je = !0), !1);
    var t = e.tag,
      n;
    if (
      ((n = t !== 3 && t !== 27) &&
        ((n = t === 5) &&
          ((n = e.type), (n = !(n !== "form" && n !== "button") || ju(e.type, e.memoizedProps))),
        (n = !n)),
      n && $e && ya(e),
      Fd(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(o(317));
      $e = vp(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(o(317));
      $e = vp(e);
    } else
      t === 27
        ? ((t = $e), Oa(e.type) ? ((e = Vu), (Vu = null), ($e = e)) : ($e = t))
        : ($e = wt ? mn(e.stateNode.nextSibling) : null);
    return !0;
  }
  function li() {
    (($e = wt = null), (je = !1));
  }
  function bc() {
    var e = ga;
    return (e !== null && (Gt === null ? (Gt = e) : Gt.push.apply(Gt, e), (ga = null)), e);
  }
  function Fr(e) {
    ga === null ? (ga = [e]) : ga.push(e);
  }
  var Sc = x(null),
    ci = null,
    Yn = null;
  function va(e, t, n) {
    (Q(Sc, t._currentValue), (t._currentValue = n));
  }
  function Gn(e) {
    ((e._currentValue = Sc.current), U(Sc));
  }
  function _c(e, t, n) {
    for (; e !== null; ) {
      var s = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), s !== null && (s.childLanes |= t))
          : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function xc(e, t, n, s) {
    var c = e.child;
    for (c !== null && (c.return = e); c !== null; ) {
      var u = c.dependencies;
      if (u !== null) {
        var m = c.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var v = u;
          u = c;
          for (var w = 0; w < t.length; w++)
            if (v.context === t[w]) {
              ((u.lanes |= n),
                (v = u.alternate),
                v !== null && (v.lanes |= n),
                _c(u.return, n, e),
                s || (m = null));
              break e;
            }
          u = v.next;
        }
      } else if (c.tag === 18) {
        if (((m = c.return), m === null)) throw Error(o(341));
        ((m.lanes |= n), (u = m.alternate), u !== null && (u.lanes |= n), _c(m, n, e), (m = null));
      } else m = c.child;
      if (m !== null) m.return = c;
      else
        for (m = c; m !== null; ) {
          if (m === e) {
            m = null;
            break;
          }
          if (((c = m.sibling), c !== null)) {
            ((c.return = m.return), (m = c));
            break;
          }
          m = m.return;
        }
      c = m;
    }
  }
  function Ii(e, t, n, s) {
    e = null;
    for (var c = t, u = !1; c !== null; ) {
      if (!u) {
        if ((c.flags & 524288) !== 0) u = !0;
        else if ((c.flags & 262144) !== 0) break;
      }
      if (c.tag === 10) {
        var m = c.alternate;
        if (m === null) throw Error(o(387));
        if (((m = m.memoizedProps), m !== null)) {
          var v = c.type;
          Jt(c.pendingProps.value, m.value) || (e !== null ? e.push(v) : (e = [v]));
        }
      } else if (c === be.current) {
        if (((m = c.alternate), m === null)) throw Error(o(387));
        m.memoizedState.memoizedState !== c.memoizedState.memoizedState &&
          (e !== null ? e.push(Ss) : (e = [Ss]));
      }
      c = c.return;
    }
    (e !== null && xc(t, e, n, s), (t.flags |= 262144));
  }
  function oo(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Jt(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function ui(e) {
    ((ci = e), (Yn = null), (e = e.dependencies), e !== null && (e.firstContext = null));
  }
  function Et(e) {
    return Pd(ci, e);
  }
  function lo(e, t) {
    return (ci === null && ui(e), Pd(e, t));
  }
  function Pd(e, t) {
    var n = t._currentValue;
    if (((t = { context: t, memoizedValue: n, next: null }), Yn === null)) {
      if (e === null) throw Error(o(308));
      ((Yn = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
    } else Yn = Yn.next = t;
    return n;
  }
  var lv =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (n, s) {
                  e.push(s);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (n) {
                  return n();
                }));
            };
          },
    cv = a.unstable_scheduleCallback,
    uv = a.unstable_NormalPriority,
    lt = {
      $$typeof: Z,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function wc() {
    return { controller: new lv(), data: new Map(), refCount: 0 };
  }
  function Pr(e) {
    (e.refCount--,
      e.refCount === 0 &&
        cv(uv, function () {
          e.controller.abort();
        }));
  }
  var Kr = null,
    Ec = 0,
    Ji = 0,
    $i = null;
  function fv(e, t) {
    if (Kr === null) {
      var n = (Kr = []);
      ((Ec = 0),
        (Ji = Au()),
        ($i = {
          status: "pending",
          value: void 0,
          then: function (s) {
            n.push(s);
          },
        }));
    }
    return (Ec++, t.then(Kd, Kd), t);
  }
  function Kd() {
    if (--Ec === 0 && Kr !== null) {
      $i !== null && ($i.status = "fulfilled");
      var e = Kr;
      ((Kr = null), (Ji = 0), ($i = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function dv(e, t) {
    var n = [],
      s = {
        status: "pending",
        value: null,
        reason: null,
        then: function (c) {
          n.push(c);
        },
      };
    return (
      e.then(
        function () {
          ((s.status = "fulfilled"), (s.value = t));
          for (var c = 0; c < n.length; c++) (0, n[c])(t);
        },
        function (c) {
          for (s.status = "rejected", s.reason = c, c = 0; c < n.length; c++) (0, n[c])(void 0);
        },
      ),
      s
    );
  }
  var Id = C.S;
  C.S = function (e, t) {
    ((zm = Be()),
      typeof t == "object" && t !== null && typeof t.then == "function" && fv(e, t),
      Id !== null && Id(e, t));
  };
  var fi = x(null);
  function Tc() {
    var e = fi.current;
    return e !== null ? e : Ie.pooledCache;
  }
  function co(e, t) {
    t === null ? Q(fi, fi.current) : Q(fi, t.pool);
  }
  function Jd() {
    var e = Tc();
    return e === null ? null : { parent: lt._currentValue, pool: e };
  }
  var Wi = Error(o(460)),
    Rc = Error(o(474)),
    uo = Error(o(542)),
    fo = { then: function () {} };
  function $d(e) {
    return ((e = e.status), e === "fulfilled" || e === "rejected");
  }
  function Wd(e, t, n) {
    switch (
      ((n = e[n]), n === void 0 ? e.push(t) : n !== t && (t.then(Hn, Hn), (t = n)), t.status)
    ) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((e = t.reason), th(e), e);
      default:
        if (typeof t.status == "string") t.then(Hn, Hn);
        else {
          if (((e = Ie), e !== null && 100 < e.shellSuspendCounter)) throw Error(o(482));
          ((e = t),
            (e.status = "pending"),
            e.then(
              function (s) {
                if (t.status === "pending") {
                  var c = t;
                  ((c.status = "fulfilled"), (c.value = s));
                }
              },
              function (s) {
                if (t.status === "pending") {
                  var c = t;
                  ((c.status = "rejected"), (c.reason = s));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((e = t.reason), th(e), e);
        }
        throw ((hi = t), Wi);
    }
  }
  function di(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? ((hi = n), Wi) : n;
    }
  }
  var hi = null;
  function eh() {
    if (hi === null) throw Error(o(459));
    var e = hi;
    return ((hi = null), e);
  }
  function th(e) {
    if (e === Wi || e === uo) throw Error(o(483));
  }
  var er = null,
    Ir = 0;
  function ho(e) {
    var t = Ir;
    return ((Ir += 1), er === null && (er = []), Wd(er, e, t));
  }
  function Jr(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function mo(e, t) {
    throw t.$$typeof === S
      ? Error(o(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          o(
            31,
            e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e,
          ),
        ));
  }
  function nh(e) {
    function t(O, M) {
      if (e) {
        var N = O.deletions;
        N === null ? ((O.deletions = [M]), (O.flags |= 16)) : N.push(M);
      }
    }
    function n(O, M) {
      if (!e) return null;
      for (; M !== null; ) (t(O, M), (M = M.sibling));
      return null;
    }
    function s(O) {
      for (var M = new Map(); O !== null; )
        (O.key !== null ? M.set(O.key, O) : M.set(O.index, O), (O = O.sibling));
      return M;
    }
    function c(O, M) {
      return ((O = Vn(O, M)), (O.index = 0), (O.sibling = null), O);
    }
    function u(O, M, N) {
      return (
        (O.index = N),
        e
          ? ((N = O.alternate),
            N !== null
              ? ((N = N.index), N < M ? ((O.flags |= 67108866), M) : N)
              : ((O.flags |= 67108866), M))
          : ((O.flags |= 1048576), M)
      );
    }
    function m(O) {
      return (e && O.alternate === null && (O.flags |= 67108866), O);
    }
    function v(O, M, N, V) {
      return M === null || M.tag !== 6
        ? ((M = mc(N, O.mode, V)), (M.return = O), M)
        : ((M = c(M, N)), (M.return = O), M);
    }
    function w(O, M, N, V) {
      var me = N.type;
      return me === k
        ? q(O, M, N.props.children, V, N.key)
        : M !== null &&
            (M.elementType === me ||
              (typeof me == "object" && me !== null && me.$$typeof === te && di(me) === M.type))
          ? ((M = c(M, N.props)), Jr(M, N), (M.return = O), M)
          : ((M = ro(N.type, N.key, N.props, null, O.mode, V)), Jr(M, N), (M.return = O), M);
    }
    function z(O, M, N, V) {
      return M === null ||
        M.tag !== 4 ||
        M.stateNode.containerInfo !== N.containerInfo ||
        M.stateNode.implementation !== N.implementation
        ? ((M = pc(N, O.mode, V)), (M.return = O), M)
        : ((M = c(M, N.children || [])), (M.return = O), M);
    }
    function q(O, M, N, V, me) {
      return M === null || M.tag !== 7
        ? ((M = oi(N, O.mode, V, me)), (M.return = O), M)
        : ((M = c(M, N)), (M.return = O), M);
    }
    function Y(O, M, N) {
      if ((typeof M == "string" && M !== "") || typeof M == "number" || typeof M == "bigint")
        return ((M = mc("" + M, O.mode, N)), (M.return = O), M);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case E:
            return ((N = ro(M.type, M.key, M.props, null, O.mode, N)), Jr(N, M), (N.return = O), N);
          case R:
            return ((M = pc(M, O.mode, N)), (M.return = O), M);
          case te:
            return ((M = di(M)), Y(O, M, N));
        }
        if (pe(M) || ue(M)) return ((M = oi(M, O.mode, N, null)), (M.return = O), M);
        if (typeof M.then == "function") return Y(O, ho(M), N);
        if (M.$$typeof === Z) return Y(O, lo(O, M), N);
        mo(O, M);
      }
      return null;
    }
    function D(O, M, N, V) {
      var me = M !== null ? M.key : null;
      if ((typeof N == "string" && N !== "") || typeof N == "number" || typeof N == "bigint")
        return me !== null ? null : v(O, M, "" + N, V);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case E:
            return N.key === me ? w(O, M, N, V) : null;
          case R:
            return N.key === me ? z(O, M, N, V) : null;
          case te:
            return ((N = di(N)), D(O, M, N, V));
        }
        if (pe(N) || ue(N)) return me !== null ? null : q(O, M, N, V, null);
        if (typeof N.then == "function") return D(O, M, ho(N), V);
        if (N.$$typeof === Z) return D(O, M, lo(O, N), V);
        mo(O, N);
      }
      return null;
    }
    function j(O, M, N, V, me) {
      if ((typeof V == "string" && V !== "") || typeof V == "number" || typeof V == "bigint")
        return ((O = O.get(N) || null), v(M, O, "" + V, me));
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case E:
            return ((O = O.get(V.key === null ? N : V.key) || null), w(M, O, V, me));
          case R:
            return ((O = O.get(V.key === null ? N : V.key) || null), z(M, O, V, me));
          case te:
            return ((V = di(V)), j(O, M, N, V, me));
        }
        if (pe(V) || ue(V)) return ((O = O.get(N) || null), q(M, O, V, me, null));
        if (typeof V.then == "function") return j(O, M, N, ho(V), me);
        if (V.$$typeof === Z) return j(O, M, N, lo(M, V), me);
        mo(M, V);
      }
      return null;
    }
    function oe(O, M, N, V) {
      for (
        var me = null, qe = null, fe = M, Ae = (M = 0), De = null;
        fe !== null && Ae < N.length;
        Ae++
      ) {
        fe.index > Ae ? ((De = fe), (fe = null)) : (De = fe.sibling);
        var Ve = D(O, fe, N[Ae], V);
        if (Ve === null) {
          fe === null && (fe = De);
          break;
        }
        (e && fe && Ve.alternate === null && t(O, fe),
          (M = u(Ve, M, Ae)),
          qe === null ? (me = Ve) : (qe.sibling = Ve),
          (qe = Ve),
          (fe = De));
      }
      if (Ae === N.length) return (n(O, fe), je && Zn(O, Ae), me);
      if (fe === null) {
        for (; Ae < N.length; Ae++)
          ((fe = Y(O, N[Ae], V)),
            fe !== null &&
              ((M = u(fe, M, Ae)), qe === null ? (me = fe) : (qe.sibling = fe), (qe = fe)));
        return (je && Zn(O, Ae), me);
      }
      for (fe = s(fe); Ae < N.length; Ae++)
        ((De = j(fe, O, Ae, N[Ae], V)),
          De !== null &&
            (e && De.alternate !== null && fe.delete(De.key === null ? Ae : De.key),
            (M = u(De, M, Ae)),
            qe === null ? (me = De) : (qe.sibling = De),
            (qe = De)));
      return (
        e &&
          fe.forEach(function (ja) {
            return t(O, ja);
          }),
        je && Zn(O, Ae),
        me
      );
    }
    function ye(O, M, N, V) {
      if (N == null) throw Error(o(151));
      for (
        var me = null, qe = null, fe = M, Ae = (M = 0), De = null, Ve = N.next();
        fe !== null && !Ve.done;
        Ae++, Ve = N.next()
      ) {
        fe.index > Ae ? ((De = fe), (fe = null)) : (De = fe.sibling);
        var ja = D(O, fe, Ve.value, V);
        if (ja === null) {
          fe === null && (fe = De);
          break;
        }
        (e && fe && ja.alternate === null && t(O, fe),
          (M = u(ja, M, Ae)),
          qe === null ? (me = ja) : (qe.sibling = ja),
          (qe = ja),
          (fe = De));
      }
      if (Ve.done) return (n(O, fe), je && Zn(O, Ae), me);
      if (fe === null) {
        for (; !Ve.done; Ae++, Ve = N.next())
          ((Ve = Y(O, Ve.value, V)),
            Ve !== null &&
              ((M = u(Ve, M, Ae)), qe === null ? (me = Ve) : (qe.sibling = Ve), (qe = Ve)));
        return (je && Zn(O, Ae), me);
      }
      for (fe = s(fe); !Ve.done; Ae++, Ve = N.next())
        ((Ve = j(fe, O, Ae, Ve.value, V)),
          Ve !== null &&
            (e && Ve.alternate !== null && fe.delete(Ve.key === null ? Ae : Ve.key),
            (M = u(Ve, M, Ae)),
            qe === null ? (me = Ve) : (qe.sibling = Ve),
            (qe = Ve)));
      return (
        e &&
          fe.forEach(function (wb) {
            return t(O, wb);
          }),
        je && Zn(O, Ae),
        me
      );
    }
    function Ke(O, M, N, V) {
      if (
        (typeof N == "object" &&
          N !== null &&
          N.type === k &&
          N.key === null &&
          (N = N.props.children),
        typeof N == "object" && N !== null)
      ) {
        switch (N.$$typeof) {
          case E:
            e: {
              for (var me = N.key; M !== null; ) {
                if (M.key === me) {
                  if (((me = N.type), me === k)) {
                    if (M.tag === 7) {
                      (n(O, M.sibling), (V = c(M, N.props.children)), (V.return = O), (O = V));
                      break e;
                    }
                  } else if (
                    M.elementType === me ||
                    (typeof me == "object" &&
                      me !== null &&
                      me.$$typeof === te &&
                      di(me) === M.type)
                  ) {
                    (n(O, M.sibling), (V = c(M, N.props)), Jr(V, N), (V.return = O), (O = V));
                    break e;
                  }
                  n(O, M);
                  break;
                } else t(O, M);
                M = M.sibling;
              }
              N.type === k
                ? ((V = oi(N.props.children, O.mode, V, N.key)), (V.return = O), (O = V))
                : ((V = ro(N.type, N.key, N.props, null, O.mode, V)),
                  Jr(V, N),
                  (V.return = O),
                  (O = V));
            }
            return m(O);
          case R:
            e: {
              for (me = N.key; M !== null; ) {
                if (M.key === me)
                  if (
                    M.tag === 4 &&
                    M.stateNode.containerInfo === N.containerInfo &&
                    M.stateNode.implementation === N.implementation
                  ) {
                    (n(O, M.sibling), (V = c(M, N.children || [])), (V.return = O), (O = V));
                    break e;
                  } else {
                    n(O, M);
                    break;
                  }
                else t(O, M);
                M = M.sibling;
              }
              ((V = pc(N, O.mode, V)), (V.return = O), (O = V));
            }
            return m(O);
          case te:
            return ((N = di(N)), Ke(O, M, N, V));
        }
        if (pe(N)) return oe(O, M, N, V);
        if (ue(N)) {
          if (((me = ue(N)), typeof me != "function")) throw Error(o(150));
          return ((N = me.call(N)), ye(O, M, N, V));
        }
        if (typeof N.then == "function") return Ke(O, M, ho(N), V);
        if (N.$$typeof === Z) return Ke(O, M, lo(O, N), V);
        mo(O, N);
      }
      return (typeof N == "string" && N !== "") || typeof N == "number" || typeof N == "bigint"
        ? ((N = "" + N),
          M !== null && M.tag === 6
            ? (n(O, M.sibling), (V = c(M, N)), (V.return = O), (O = V))
            : (n(O, M), (V = mc(N, O.mode, V)), (V.return = O), (O = V)),
          m(O))
        : n(O, M);
    }
    return function (O, M, N, V) {
      try {
        Ir = 0;
        var me = Ke(O, M, N, V);
        return ((er = null), me);
      } catch (fe) {
        if (fe === Wi || fe === uo) throw fe;
        var qe = $t(29, fe, null, O.mode);
        return ((qe.lanes = V), (qe.return = O), qe);
      } finally {
      }
    };
  }
  var mi = nh(!0),
    ah = nh(!1),
    ba = !1;
  function Ac(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Mc(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function Sa(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function _a(e, t, n) {
    var s = e.updateQueue;
    if (s === null) return null;
    if (((s = s.shared), (Ye & 2) !== 0)) {
      var c = s.pending;
      return (
        c === null ? (t.next = t) : ((t.next = c.next), (c.next = t)),
        (s.pending = t),
        (t = io(e)),
        qd(e, null, n),
        t
      );
    }
    return (ao(e, s, t, n), io(e));
  }
  function $r(e, t, n) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194048) !== 0))) {
      var s = t.lanes;
      ((s &= e.pendingLanes), (n |= s), (t.lanes = n), Ut(e, n));
    }
  }
  function Cc(e, t) {
    var n = e.updateQueue,
      s = e.alternate;
    if (s !== null && ((s = s.updateQueue), n === s)) {
      var c = null,
        u = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var m = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
          (u === null ? (c = u = m) : (u = u.next = m), (n = n.next));
        } while (n !== null);
        u === null ? (c = u = t) : (u = u.next = t);
      } else c = u = t;
      ((n = {
        baseState: s.baseState,
        firstBaseUpdate: c,
        lastBaseUpdate: u,
        shared: s.shared,
        callbacks: s.callbacks,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  var kc = !1;
  function Wr() {
    if (kc) {
      var e = $i;
      if (e !== null) throw e;
    }
  }
  function es(e, t, n, s) {
    kc = !1;
    var c = e.updateQueue;
    ba = !1;
    var u = c.firstBaseUpdate,
      m = c.lastBaseUpdate,
      v = c.shared.pending;
    if (v !== null) {
      c.shared.pending = null;
      var w = v,
        z = w.next;
      ((w.next = null), m === null ? (u = z) : (m.next = z), (m = w));
      var q = e.alternate;
      q !== null &&
        ((q = q.updateQueue),
        (v = q.lastBaseUpdate),
        v !== m && (v === null ? (q.firstBaseUpdate = z) : (v.next = z), (q.lastBaseUpdate = w)));
    }
    if (u !== null) {
      var Y = c.baseState;
      ((m = 0), (q = z = w = null), (v = u));
      do {
        var D = v.lane & -536870913,
          j = D !== v.lane;
        if (j ? (ze & D) === D : (s & D) === D) {
          (D !== 0 && D === Ji && (kc = !0),
            q !== null &&
              (q = q.next =
                { lane: 0, tag: v.tag, payload: v.payload, callback: null, next: null }));
          e: {
            var oe = e,
              ye = v;
            D = t;
            var Ke = n;
            switch (ye.tag) {
              case 1:
                if (((oe = ye.payload), typeof oe == "function")) {
                  Y = oe.call(Ke, Y, D);
                  break e;
                }
                Y = oe;
                break e;
              case 3:
                oe.flags = (oe.flags & -65537) | 128;
              case 0:
                if (
                  ((oe = ye.payload),
                  (D = typeof oe == "function" ? oe.call(Ke, Y, D) : oe),
                  D == null)
                )
                  break e;
                Y = g({}, Y, D);
                break e;
              case 2:
                ba = !0;
            }
          }
          ((D = v.callback),
            D !== null &&
              ((e.flags |= 64),
              j && (e.flags |= 8192),
              (j = c.callbacks),
              j === null ? (c.callbacks = [D]) : j.push(D)));
        } else
          ((j = { lane: D, tag: v.tag, payload: v.payload, callback: v.callback, next: null }),
            q === null ? ((z = q = j), (w = Y)) : (q = q.next = j),
            (m |= D));
        if (((v = v.next), v === null)) {
          if (((v = c.shared.pending), v === null)) break;
          ((j = v),
            (v = j.next),
            (j.next = null),
            (c.lastBaseUpdate = j),
            (c.shared.pending = null));
        }
      } while (!0);
      (q === null && (w = Y),
        (c.baseState = w),
        (c.firstBaseUpdate = z),
        (c.lastBaseUpdate = q),
        u === null && (c.shared.lanes = 0),
        (Ra |= m),
        (e.lanes = m),
        (e.memoizedState = Y));
    }
  }
  function ih(e, t) {
    if (typeof e != "function") throw Error(o(191, e));
    e.call(t);
  }
  function rh(e, t) {
    var n = e.callbacks;
    if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) ih(n[e], t);
  }
  var tr = x(null),
    po = x(0);
  function sh(e, t) {
    ((e = Wn), Q(po, e), Q(tr, t), (Wn = e | t.baseLanes));
  }
  function Oc() {
    (Q(po, Wn), Q(tr, tr.current));
  }
  function Nc() {
    ((Wn = po.current), U(tr), U(po));
  }
  var Wt = x(null),
    hn = null;
  function xa(e) {
    var t = e.alternate;
    (Q(rt, rt.current & 1),
      Q(Wt, e),
      hn === null && (t === null || tr.current !== null || t.memoizedState !== null) && (hn = e));
  }
  function zc(e) {
    (Q(rt, rt.current), Q(Wt, e), hn === null && (hn = e));
  }
  function oh(e) {
    e.tag === 22 ? (Q(rt, rt.current), Q(Wt, e), hn === null && (hn = e)) : wa();
  }
  function wa() {
    (Q(rt, rt.current), Q(Wt, Wt.current));
  }
  function en(e) {
    (U(Wt), hn === e && (hn = null), U(rt));
  }
  var rt = x(0);
  function go(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || Hu(n) || qu(n))) return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === "forwards" ||
          t.memoizedProps.revealOrder === "backwards" ||
          t.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          t.memoizedProps.revealOrder === "together")
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Qn = 0,
    Re = null,
    Fe = null,
    ct = null,
    yo = !1,
    nr = !1,
    pi = !1,
    vo = 0,
    ts = 0,
    ar = null,
    hv = 0;
  function at() {
    throw Error(o(321));
  }
  function Dc(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Jt(e[n], t[n])) return !1;
    return !0;
  }
  function Lc(e, t, n, s, c, u) {
    return (
      (Qn = u),
      (Re = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (C.H = e === null || e.memoizedState === null ? Gh : Ic),
      (pi = !1),
      (u = n(s, c)),
      (pi = !1),
      nr && (u = ch(t, n, s, c)),
      lh(e),
      u
    );
  }
  function lh(e) {
    C.H = is;
    var t = Fe !== null && Fe.next !== null;
    if (((Qn = 0), (ct = Fe = Re = null), (yo = !1), (ts = 0), (ar = null), t)) throw Error(o(300));
    e === null || ut || ((e = e.dependencies), e !== null && oo(e) && (ut = !0));
  }
  function ch(e, t, n, s) {
    Re = e;
    var c = 0;
    do {
      if ((nr && (ar = null), (ts = 0), (nr = !1), 25 <= c)) throw Error(o(301));
      if (((c += 1), (ct = Fe = null), e.updateQueue != null)) {
        var u = e.updateQueue;
        ((u.lastEffect = null),
          (u.events = null),
          (u.stores = null),
          u.memoCache != null && (u.memoCache.index = 0));
      }
      ((C.H = Qh), (u = t(n, s)));
    } while (nr);
    return u;
  }
  function mv() {
    var e = C.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == "function" ? ns(t) : t),
      (e = e.useState()[0]),
      (Fe !== null ? Fe.memoizedState : null) !== e && (Re.flags |= 1024),
      t
    );
  }
  function jc() {
    var e = vo !== 0;
    return ((vo = 0), e);
  }
  function Uc(e, t, n) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
  }
  function Bc(e) {
    if (yo) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      yo = !1;
    }
    ((Qn = 0), (ct = Fe = Re = null), (nr = !1), (ts = vo = 0), (ar = null));
  }
  function zt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (ct === null ? (Re.memoizedState = ct = e) : (ct = ct.next = e), ct);
  }
  function st() {
    if (Fe === null) {
      var e = Re.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Fe.next;
    var t = ct === null ? Re.memoizedState : ct.next;
    if (t !== null) ((ct = t), (Fe = e));
    else {
      if (e === null) throw Re.alternate === null ? Error(o(467)) : Error(o(310));
      ((Fe = e),
        (e = {
          memoizedState: Fe.memoizedState,
          baseState: Fe.baseState,
          baseQueue: Fe.baseQueue,
          queue: Fe.queue,
          next: null,
        }),
        ct === null ? (Re.memoizedState = ct = e) : (ct = ct.next = e));
    }
    return ct;
  }
  function bo() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ns(e) {
    var t = ts;
    return (
      (ts += 1),
      ar === null && (ar = []),
      (e = Wd(ar, e, t)),
      (t = Re),
      (ct === null ? t.memoizedState : ct.next) === null &&
        ((t = t.alternate), (C.H = t === null || t.memoizedState === null ? Gh : Ic)),
      e
    );
  }
  function So(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return ns(e);
      if (e.$$typeof === Z) return Et(e);
    }
    throw Error(o(438, String(e)));
  }
  function Hc(e) {
    var t = null,
      n = Re.updateQueue;
    if ((n !== null && (t = n.memoCache), t == null)) {
      var s = Re.alternate;
      s !== null &&
        ((s = s.updateQueue),
        s !== null &&
          ((s = s.memoCache),
          s != null &&
            (t = {
              data: s.data.map(function (c) {
                return c.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      n === null && ((n = bo()), (Re.updateQueue = n)),
      (n.memoCache = t),
      (n = t.data[t.index]),
      n === void 0)
    )
      for (n = t.data[t.index] = Array(e), s = 0; s < e; s++) n[s] = X;
    return (t.index++, n);
  }
  function Xn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function _o(e) {
    var t = st();
    return qc(t, Fe, e);
  }
  function qc(e, t, n) {
    var s = e.queue;
    if (s === null) throw Error(o(311));
    s.lastRenderedReducer = n;
    var c = e.baseQueue,
      u = s.pending;
    if (u !== null) {
      if (c !== null) {
        var m = c.next;
        ((c.next = u.next), (u.next = m));
      }
      ((t.baseQueue = c = u), (s.pending = null));
    }
    if (((u = e.baseState), c === null)) e.memoizedState = u;
    else {
      t = c.next;
      var v = (m = null),
        w = null,
        z = t,
        q = !1;
      do {
        var Y = z.lane & -536870913;
        if (Y !== z.lane ? (ze & Y) === Y : (Qn & Y) === Y) {
          var D = z.revertLane;
          if (D === 0)
            (w !== null &&
              (w = w.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: z.action,
                  hasEagerState: z.hasEagerState,
                  eagerState: z.eagerState,
                  next: null,
                }),
              Y === Ji && (q = !0));
          else if ((Qn & D) === D) {
            ((z = z.next), D === Ji && (q = !0));
            continue;
          } else
            ((Y = {
              lane: 0,
              revertLane: z.revertLane,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null,
            }),
              w === null ? ((v = w = Y), (m = u)) : (w = w.next = Y),
              (Re.lanes |= D),
              (Ra |= D));
          ((Y = z.action), pi && n(u, Y), (u = z.hasEagerState ? z.eagerState : n(u, Y)));
        } else
          ((D = {
            lane: Y,
            revertLane: z.revertLane,
            gesture: z.gesture,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null,
          }),
            w === null ? ((v = w = D), (m = u)) : (w = w.next = D),
            (Re.lanes |= Y),
            (Ra |= Y));
        z = z.next;
      } while (z !== null && z !== t);
      if (
        (w === null ? (m = u) : (w.next = v),
        !Jt(u, e.memoizedState) && ((ut = !0), q && ((n = $i), n !== null)))
      )
        throw n;
      ((e.memoizedState = u), (e.baseState = m), (e.baseQueue = w), (s.lastRenderedState = u));
    }
    return (c === null && (s.lanes = 0), [e.memoizedState, s.dispatch]);
  }
  function Vc(e) {
    var t = st(),
      n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var s = n.dispatch,
      c = n.pending,
      u = t.memoizedState;
    if (c !== null) {
      n.pending = null;
      var m = (c = c.next);
      do ((u = e(u, m.action)), (m = m.next));
      while (m !== c);
      (Jt(u, t.memoizedState) || (ut = !0),
        (t.memoizedState = u),
        t.baseQueue === null && (t.baseState = u),
        (n.lastRenderedState = u));
    }
    return [u, s];
  }
  function uh(e, t, n) {
    var s = Re,
      c = st(),
      u = je;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = t();
    var m = !Jt((Fe || c).memoizedState, n);
    if (
      (m && ((c.memoizedState = n), (ut = !0)),
      (c = c.queue),
      Gc(hh.bind(null, s, c, e), [e]),
      c.getSnapshot !== t || m || (ct !== null && ct.memoizedState.tag & 1))
    ) {
      if (
        ((s.flags |= 2048),
        ir(9, { destroy: void 0 }, dh.bind(null, s, c, n, t), null),
        Ie === null)
      )
        throw Error(o(349));
      u || (Qn & 127) !== 0 || fh(s, t, n);
    }
    return n;
  }
  function fh(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = Re.updateQueue),
      t === null
        ? ((t = bo()), (Re.updateQueue = t), (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function dh(e, t, n, s) {
    ((t.value = n), (t.getSnapshot = s), mh(t) && ph(e));
  }
  function hh(e, t, n) {
    return n(function () {
      mh(t) && ph(e);
    });
  }
  function mh(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Jt(e, n);
    } catch {
      return !0;
    }
  }
  function ph(e) {
    var t = si(e, 2);
    t !== null && Qt(t, e, 2);
  }
  function Zc(e) {
    var t = zt();
    if (typeof e == "function") {
      var n = e;
      if (((e = n()), pi)) {
        bn(!0);
        try {
          n();
        } finally {
          bn(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xn,
        lastRenderedState: e,
      }),
      t
    );
  }
  function gh(e, t, n, s) {
    return ((e.baseState = n), qc(e, Fe, typeof s == "function" ? s : Xn));
  }
  function pv(e, t, n, s, c) {
    if (Eo(e)) throw Error(o(485));
    if (((e = t.action), e !== null)) {
      var u = {
        payload: c,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (m) {
          u.listeners.push(m);
        },
      };
      (C.T !== null ? n(!0) : (u.isTransition = !1),
        s(u),
        (n = t.pending),
        n === null
          ? ((u.next = t.pending = u), yh(t, u))
          : ((u.next = n.next), (t.pending = n.next = u)));
    }
  }
  function yh(e, t) {
    var n = t.action,
      s = t.payload,
      c = e.state;
    if (t.isTransition) {
      var u = C.T,
        m = {};
      C.T = m;
      try {
        var v = n(c, s),
          w = C.S;
        (w !== null && w(m, v), vh(e, t, v));
      } catch (z) {
        Yc(e, t, z);
      } finally {
        (u !== null && m.types !== null && (u.types = m.types), (C.T = u));
      }
    } else
      try {
        ((u = n(c, s)), vh(e, t, u));
      } catch (z) {
        Yc(e, t, z);
      }
  }
  function vh(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function"
      ? n.then(
          function (s) {
            bh(e, t, s);
          },
          function (s) {
            return Yc(e, t, s);
          },
        )
      : bh(e, t, n);
  }
  function bh(e, t, n) {
    ((t.status = "fulfilled"),
      (t.value = n),
      Sh(t),
      (e.state = n),
      (t = e.pending),
      t !== null &&
        ((n = t.next), n === t ? (e.pending = null) : ((n = n.next), (t.next = n), yh(e, n))));
  }
  function Yc(e, t, n) {
    var s = e.pending;
    if (((e.pending = null), s !== null)) {
      s = s.next;
      do ((t.status = "rejected"), (t.reason = n), Sh(t), (t = t.next));
      while (t !== s);
    }
    e.action = null;
  }
  function Sh(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function _h(e, t) {
    return t;
  }
  function xh(e, t) {
    if (je) {
      var n = Ie.formState;
      if (n !== null) {
        e: {
          var s = Re;
          if (je) {
            if ($e) {
              t: {
                for (var c = $e, u = dn; c.nodeType !== 8; ) {
                  if (!u) {
                    c = null;
                    break t;
                  }
                  if (((c = mn(c.nextSibling)), c === null)) {
                    c = null;
                    break t;
                  }
                }
                ((u = c.data), (c = u === "F!" || u === "F" ? c : null));
              }
              if (c) {
                (($e = mn(c.nextSibling)), (s = c.data === "F!"));
                break e;
              }
            }
            ya(s);
          }
          s = !1;
        }
        s && (t = n[0]);
      }
    }
    return (
      (n = zt()),
      (n.memoizedState = n.baseState = t),
      (s = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: _h,
        lastRenderedState: t,
      }),
      (n.queue = s),
      (n = Vh.bind(null, Re, s)),
      (s.dispatch = n),
      (s = Zc(!1)),
      (u = Kc.bind(null, Re, !1, s.queue)),
      (s = zt()),
      (c = { state: t, dispatch: null, action: e, pending: null }),
      (s.queue = c),
      (n = pv.bind(null, Re, c, u, n)),
      (c.dispatch = n),
      (s.memoizedState = e),
      [t, n, !1]
    );
  }
  function wh(e) {
    var t = st();
    return Eh(t, Fe, e);
  }
  function Eh(e, t, n) {
    if (
      ((t = qc(e, t, _h)[0]),
      (e = _o(Xn)[0]),
      typeof t == "object" && t !== null && typeof t.then == "function")
    )
      try {
        var s = ns(t);
      } catch (m) {
        throw m === Wi ? uo : m;
      }
    else s = t;
    t = st();
    var c = t.queue,
      u = c.dispatch;
    return (
      n !== t.memoizedState &&
        ((Re.flags |= 2048), ir(9, { destroy: void 0 }, gv.bind(null, c, n), null)),
      [s, u, e]
    );
  }
  function gv(e, t) {
    e.action = t;
  }
  function Th(e) {
    var t = st(),
      n = Fe;
    if (n !== null) return Eh(t, n, e);
    (st(), (t = t.memoizedState), (n = st()));
    var s = n.queue.dispatch;
    return ((n.memoizedState = e), [t, s, !1]);
  }
  function ir(e, t, n, s) {
    return (
      (e = { tag: e, create: n, deps: s, inst: t, next: null }),
      (t = Re.updateQueue),
      t === null && ((t = bo()), (Re.updateQueue = t)),
      (n = t.lastEffect),
      n === null
        ? (t.lastEffect = e.next = e)
        : ((s = n.next), (n.next = e), (e.next = s), (t.lastEffect = e)),
      e
    );
  }
  function Rh() {
    return st().memoizedState;
  }
  function xo(e, t, n, s) {
    var c = zt();
    ((Re.flags |= e),
      (c.memoizedState = ir(1 | t, { destroy: void 0 }, n, s === void 0 ? null : s)));
  }
  function wo(e, t, n, s) {
    var c = st();
    s = s === void 0 ? null : s;
    var u = c.memoizedState.inst;
    Fe !== null && s !== null && Dc(s, Fe.memoizedState.deps)
      ? (c.memoizedState = ir(t, u, n, s))
      : ((Re.flags |= e), (c.memoizedState = ir(1 | t, u, n, s)));
  }
  function Ah(e, t) {
    xo(8390656, 8, e, t);
  }
  function Gc(e, t) {
    wo(2048, 8, e, t);
  }
  function yv(e) {
    Re.flags |= 4;
    var t = Re.updateQueue;
    if (t === null) ((t = bo()), (Re.updateQueue = t), (t.events = [e]));
    else {
      var n = t.events;
      n === null ? (t.events = [e]) : n.push(e);
    }
  }
  function Mh(e) {
    var t = st().memoizedState;
    return (
      yv({ ref: t, nextImpl: e }),
      function () {
        if ((Ye & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function Ch(e, t) {
    return wo(4, 2, e, t);
  }
  function kh(e, t) {
    return wo(4, 4, e, t);
  }
  function Oh(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function () {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function Nh(e, t, n) {
    ((n = n != null ? n.concat([e]) : null), wo(4, 4, Oh.bind(null, t, e), n));
  }
  function Qc() {}
  function zh(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var s = n.memoizedState;
    return t !== null && Dc(t, s[1]) ? s[0] : ((n.memoizedState = [e, t]), e);
  }
  function Dh(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var s = n.memoizedState;
    if (t !== null && Dc(t, s[1])) return s[0];
    if (((s = e()), pi)) {
      bn(!0);
      try {
        e();
      } finally {
        bn(!1);
      }
    }
    return ((n.memoizedState = [s, t]), s);
  }
  function Xc(e, t, n) {
    return n === void 0 || ((Qn & 1073741824) !== 0 && (ze & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = n), (e = Lm()), (Re.lanes |= e), (Ra |= e), n);
  }
  function Lh(e, t, n, s) {
    return Jt(n, t)
      ? n
      : tr.current !== null
        ? ((e = Xc(e, n, s)), Jt(e, t) || (ut = !0), e)
        : (Qn & 42) === 0 || ((Qn & 1073741824) !== 0 && (ze & 261930) === 0)
          ? ((ut = !0), (e.memoizedState = n))
          : ((e = Lm()), (Re.lanes |= e), (Ra |= e), t);
  }
  function jh(e, t, n, s, c) {
    var u = H.p;
    H.p = u !== 0 && 8 > u ? u : 8;
    var m = C.T,
      v = {};
    ((C.T = v), Kc(e, !1, t, n));
    try {
      var w = c(),
        z = C.S;
      if (
        (z !== null && z(v, w), w !== null && typeof w == "object" && typeof w.then == "function")
      ) {
        var q = dv(w, s);
        as(e, t, q, an(e));
      } else as(e, t, s, an(e));
    } catch (Y) {
      as(e, t, { then: function () {}, status: "rejected", reason: Y }, an());
    } finally {
      ((H.p = u), m !== null && v.types !== null && (m.types = v.types), (C.T = m));
    }
  }
  function vv() {}
  function Fc(e, t, n, s) {
    if (e.tag !== 5) throw Error(o(476));
    var c = Uh(e).queue;
    jh(
      e,
      c,
      t,
      ne,
      n === null
        ? vv
        : function () {
            return (Bh(e), n(s));
          },
    );
  }
  function Uh(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: ne,
      baseState: ne,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xn,
        lastRenderedState: ne,
      },
      next: null,
    };
    var n = {};
    return (
      (t.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Xn,
          lastRenderedState: n,
        },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function Bh(e) {
    var t = Uh(e);
    (t.next === null && (t = e.alternate.memoizedState), as(e, t.next.queue, {}, an()));
  }
  function Pc() {
    return Et(Ss);
  }
  function Hh() {
    return st().memoizedState;
  }
  function qh() {
    return st().memoizedState;
  }
  function bv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = an();
          e = Sa(n);
          var s = _a(t, e, n);
          (s !== null && (Qt(s, t, n), $r(s, t, n)), (t = { cache: wc() }), (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function Sv(e, t, n) {
    var s = an();
    ((n = {
      lane: s,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Eo(e) ? Zh(t, n) : ((n = dc(e, t, n, s)), n !== null && (Qt(n, e, s), Yh(n, t, s))));
  }
  function Vh(e, t, n) {
    var s = an();
    as(e, t, n, s);
  }
  function as(e, t, n, s) {
    var c = {
      lane: s,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Eo(e)) Zh(t, c);
    else {
      var u = e.alternate;
      if (
        e.lanes === 0 &&
        (u === null || u.lanes === 0) &&
        ((u = t.lastRenderedReducer), u !== null)
      )
        try {
          var m = t.lastRenderedState,
            v = u(m, n);
          if (((c.hasEagerState = !0), (c.eagerState = v), Jt(v, m)))
            return (ao(e, t, c, 0), Ie === null && no(), !1);
        } catch {
        } finally {
        }
      if (((n = dc(e, t, c, s)), n !== null)) return (Qt(n, e, s), Yh(n, t, s), !0);
    }
    return !1;
  }
  function Kc(e, t, n, s) {
    if (
      ((s = {
        lane: 2,
        revertLane: Au(),
        gesture: null,
        action: s,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Eo(e))
    ) {
      if (t) throw Error(o(479));
    } else ((t = dc(e, n, s, 2)), t !== null && Qt(t, e, 2));
  }
  function Eo(e) {
    var t = e.alternate;
    return e === Re || (t !== null && t === Re);
  }
  function Zh(e, t) {
    nr = yo = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
  }
  function Yh(e, t, n) {
    if ((n & 4194048) !== 0) {
      var s = t.lanes;
      ((s &= e.pendingLanes), (n |= s), (t.lanes = n), Ut(e, n));
    }
  }
  var is = {
    readContext: Et,
    use: So,
    useCallback: at,
    useContext: at,
    useEffect: at,
    useImperativeHandle: at,
    useLayoutEffect: at,
    useInsertionEffect: at,
    useMemo: at,
    useReducer: at,
    useRef: at,
    useState: at,
    useDebugValue: at,
    useDeferredValue: at,
    useTransition: at,
    useSyncExternalStore: at,
    useId: at,
    useHostTransitionStatus: at,
    useFormState: at,
    useActionState: at,
    useOptimistic: at,
    useMemoCache: at,
    useCacheRefresh: at,
  };
  is.useEffectEvent = at;
  var Gh = {
      readContext: Et,
      use: So,
      useCallback: function (e, t) {
        return ((zt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: Et,
      useEffect: Ah,
      useImperativeHandle: function (e, t, n) {
        ((n = n != null ? n.concat([e]) : null), xo(4194308, 4, Oh.bind(null, t, e), n));
      },
      useLayoutEffect: function (e, t) {
        return xo(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        xo(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = zt();
        t = t === void 0 ? null : t;
        var s = e();
        if (pi) {
          bn(!0);
          try {
            e();
          } finally {
            bn(!1);
          }
        }
        return ((n.memoizedState = [s, t]), s);
      },
      useReducer: function (e, t, n) {
        var s = zt();
        if (n !== void 0) {
          var c = n(t);
          if (pi) {
            bn(!0);
            try {
              n(t);
            } finally {
              bn(!1);
            }
          }
        } else c = t;
        return (
          (s.memoizedState = s.baseState = c),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: c,
          }),
          (s.queue = e),
          (e = e.dispatch = Sv.bind(null, Re, e)),
          [s.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = zt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = Zc(e);
        var t = e.queue,
          n = Vh.bind(null, Re, t);
        return ((t.dispatch = n), [e.memoizedState, n]);
      },
      useDebugValue: Qc,
      useDeferredValue: function (e, t) {
        var n = zt();
        return Xc(n, e, t);
      },
      useTransition: function () {
        var e = Zc(!1);
        return ((e = jh.bind(null, Re, e.queue, !0, !1)), (zt().memoizedState = e), [!1, e]);
      },
      useSyncExternalStore: function (e, t, n) {
        var s = Re,
          c = zt();
        if (je) {
          if (n === void 0) throw Error(o(407));
          n = n();
        } else {
          if (((n = t()), Ie === null)) throw Error(o(349));
          (ze & 127) !== 0 || fh(s, t, n);
        }
        c.memoizedState = n;
        var u = { value: n, getSnapshot: t };
        return (
          (c.queue = u),
          Ah(hh.bind(null, s, u, e), [e]),
          (s.flags |= 2048),
          ir(9, { destroy: void 0 }, dh.bind(null, s, u, n, t), null),
          n
        );
      },
      useId: function () {
        var e = zt(),
          t = Ie.identifierPrefix;
        if (je) {
          var n = Cn,
            s = Mn;
          ((n = (s & ~(1 << (32 - Mt(s) - 1))).toString(32) + n),
            (t = "_" + t + "R_" + n),
            (n = vo++),
            0 < n && (t += "H" + n.toString(32)),
            (t += "_"));
        } else ((n = hv++), (t = "_" + t + "r_" + n.toString(32) + "_"));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: Pc,
      useFormState: xh,
      useActionState: xh,
      useOptimistic: function (e) {
        var t = zt();
        t.memoizedState = t.baseState = e;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return ((t.queue = n), (t = Kc.bind(null, Re, !0, n)), (n.dispatch = t), [e, t]);
      },
      useMemoCache: Hc,
      useCacheRefresh: function () {
        return (zt().memoizedState = bv.bind(null, Re));
      },
      useEffectEvent: function (e) {
        var t = zt(),
          n = { impl: e };
        return (
          (t.memoizedState = n),
          function () {
            if ((Ye & 2) !== 0) throw Error(o(440));
            return n.impl.apply(void 0, arguments);
          }
        );
      },
    },
    Ic = {
      readContext: Et,
      use: So,
      useCallback: zh,
      useContext: Et,
      useEffect: Gc,
      useImperativeHandle: Nh,
      useInsertionEffect: Ch,
      useLayoutEffect: kh,
      useMemo: Dh,
      useReducer: _o,
      useRef: Rh,
      useState: function () {
        return _o(Xn);
      },
      useDebugValue: Qc,
      useDeferredValue: function (e, t) {
        var n = st();
        return Lh(n, Fe.memoizedState, e, t);
      },
      useTransition: function () {
        var e = _o(Xn)[0],
          t = st().memoizedState;
        return [typeof e == "boolean" ? e : ns(e), t];
      },
      useSyncExternalStore: uh,
      useId: Hh,
      useHostTransitionStatus: Pc,
      useFormState: wh,
      useActionState: wh,
      useOptimistic: function (e, t) {
        var n = st();
        return gh(n, Fe, e, t);
      },
      useMemoCache: Hc,
      useCacheRefresh: qh,
    };
  Ic.useEffectEvent = Mh;
  var Qh = {
    readContext: Et,
    use: So,
    useCallback: zh,
    useContext: Et,
    useEffect: Gc,
    useImperativeHandle: Nh,
    useInsertionEffect: Ch,
    useLayoutEffect: kh,
    useMemo: Dh,
    useReducer: Vc,
    useRef: Rh,
    useState: function () {
      return Vc(Xn);
    },
    useDebugValue: Qc,
    useDeferredValue: function (e, t) {
      var n = st();
      return Fe === null ? Xc(n, e, t) : Lh(n, Fe.memoizedState, e, t);
    },
    useTransition: function () {
      var e = Vc(Xn)[0],
        t = st().memoizedState;
      return [typeof e == "boolean" ? e : ns(e), t];
    },
    useSyncExternalStore: uh,
    useId: Hh,
    useHostTransitionStatus: Pc,
    useFormState: Th,
    useActionState: Th,
    useOptimistic: function (e, t) {
      var n = st();
      return Fe !== null ? gh(n, Fe, e, t) : ((n.baseState = e), [e, n.queue.dispatch]);
    },
    useMemoCache: Hc,
    useCacheRefresh: qh,
  };
  Qh.useEffectEvent = Mh;
  function Jc(e, t, n, s) {
    ((t = e.memoizedState),
      (n = n(s, t)),
      (n = n == null ? t : g({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var $c = {
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var s = an(),
        c = Sa(s);
      ((c.payload = t),
        n != null && (c.callback = n),
        (t = _a(e, c, s)),
        t !== null && (Qt(t, e, s), $r(t, e, s)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var s = an(),
        c = Sa(s);
      ((c.tag = 1),
        (c.payload = t),
        n != null && (c.callback = n),
        (t = _a(e, c, s)),
        t !== null && (Qt(t, e, s), $r(t, e, s)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = an(),
        s = Sa(n);
      ((s.tag = 2),
        t != null && (s.callback = t),
        (t = _a(e, s, n)),
        t !== null && (Qt(t, e, n), $r(t, e, n)));
    },
  };
  function Xh(e, t, n, s, c, u, m) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(s, u, m)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Gr(n, s) || !Gr(c, u)
          : !0
    );
  }
  function Fh(e, t, n, s) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, s),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(n, s),
      t.state !== e && $c.enqueueReplaceState(t, t.state, null));
  }
  function gi(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var s in t) s !== "ref" && (n[s] = t[s]);
    }
    if ((e = e.defaultProps)) {
      n === t && (n = g({}, n));
      for (var c in e) n[c] === void 0 && (n[c] = e[c]);
    }
    return n;
  }
  function Ph(e) {
    to(e);
  }
  function Kh(e) {
    console.error(e);
  }
  function Ih(e) {
    to(e);
  }
  function To(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (s) {
      setTimeout(function () {
        throw s;
      });
    }
  }
  function Jh(e, t, n) {
    try {
      var s = e.onCaughtError;
      s(n.value, { componentStack: n.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (c) {
      setTimeout(function () {
        throw c;
      });
    }
  }
  function Wc(e, t, n) {
    return (
      (n = Sa(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        To(e, t);
      }),
      n
    );
  }
  function $h(e) {
    return ((e = Sa(e)), (e.tag = 3), e);
  }
  function Wh(e, t, n, s) {
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var u = s.value;
      ((e.payload = function () {
        return c(u);
      }),
        (e.callback = function () {
          Jh(t, n, s);
        }));
    }
    var m = n.stateNode;
    m !== null &&
      typeof m.componentDidCatch == "function" &&
      (e.callback = function () {
        (Jh(t, n, s),
          typeof c != "function" && (Aa === null ? (Aa = new Set([this])) : Aa.add(this)));
        var v = s.stack;
        this.componentDidCatch(s.value, { componentStack: v !== null ? v : "" });
      });
  }
  function _v(e, t, n, s, c) {
    if (((n.flags |= 32768), s !== null && typeof s == "object" && typeof s.then == "function")) {
      if (((t = n.alternate), t !== null && Ii(t, n, c, !0), (n = Wt.current), n !== null)) {
        switch (n.tag) {
          case 31:
          case 13:
            return (
              hn === null ? Uo() : n.alternate === null && it === 0 && (it = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = c),
              s === fo
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null ? (n.updateQueue = new Set([s])) : t.add(s),
                  Eu(e, s, c)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              s === fo
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([s]) }),
                      (n.updateQueue = t))
                    : ((n = t.retryQueue), n === null ? (t.retryQueue = new Set([s])) : n.add(s)),
                  Eu(e, s, c)),
              !1
            );
        }
        throw Error(o(435, n.tag));
      }
      return (Eu(e, s, c), Uo(), !1);
    }
    if (je)
      return (
        (t = Wt.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = c),
            s !== vc && ((e = Error(o(422), { cause: s })), Fr(cn(e, n))))
          : (s !== vc && ((t = Error(o(423), { cause: s })), Fr(cn(t, n))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (c &= -c),
            (e.lanes |= c),
            (s = cn(s, n)),
            (c = Wc(e.stateNode, s, c)),
            Cc(e, c),
            it !== 4 && (it = 2)),
        !1
      );
    var u = Error(o(520), { cause: s });
    if (((u = cn(u, n)), ds === null ? (ds = [u]) : ds.push(u), it !== 4 && (it = 2), t === null))
      return !0;
    ((s = cn(s, n)), (n = t));
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (e = c & -c),
            (n.lanes |= e),
            (e = Wc(n.stateNode, s, e)),
            Cc(n, e),
            !1
          );
        case 1:
          if (
            ((t = n.type),
            (u = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (u !== null &&
                  typeof u.componentDidCatch == "function" &&
                  (Aa === null || !Aa.has(u)))))
          )
            return (
              (n.flags |= 65536),
              (c &= -c),
              (n.lanes |= c),
              (c = $h(c)),
              Wh(c, e, n, s),
              Cc(n, c),
              !1
            );
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var eu = Error(o(461)),
    ut = !1;
  function Tt(e, t, n, s) {
    t.child = e === null ? ah(t, null, n, s) : mi(t, e.child, n, s);
  }
  function em(e, t, n, s, c) {
    n = n.render;
    var u = t.ref;
    if ("ref" in s) {
      var m = {};
      for (var v in s) v !== "ref" && (m[v] = s[v]);
    } else m = s;
    return (
      ui(t),
      (s = Lc(e, t, n, m, u, c)),
      (v = jc()),
      e !== null && !ut
        ? (Uc(e, t, c), Fn(e, t, c))
        : (je && v && gc(t), (t.flags |= 1), Tt(e, t, s, c), t.child)
    );
  }
  function tm(e, t, n, s, c) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !hc(u) && u.defaultProps === void 0 && n.compare === null
        ? ((t.tag = 15), (t.type = u), nm(e, t, u, s, c))
        : ((e = ro(n.type, null, s, t, t.mode, c)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((u = e.child), !lu(e, c))) {
      var m = u.memoizedProps;
      if (((n = n.compare), (n = n !== null ? n : Gr), n(m, s) && e.ref === t.ref))
        return Fn(e, t, c);
    }
    return ((t.flags |= 1), (e = Vn(u, s)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function nm(e, t, n, s, c) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Gr(u, s) && e.ref === t.ref)
        if (((ut = !1), (t.pendingProps = s = u), lu(e, c))) (e.flags & 131072) !== 0 && (ut = !0);
        else return ((t.lanes = e.lanes), Fn(e, t, c));
    }
    return tu(e, t, n, s, c);
  }
  function am(e, t, n, s) {
    var c = s.children,
      u = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      s.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((u = u !== null ? u.baseLanes | n : n), e !== null)) {
          for (s = t.child = e.child, c = 0; s !== null; )
            ((c = c | s.lanes | s.childLanes), (s = s.sibling));
          s = c & ~u;
        } else ((s = 0), (t.child = null));
        return im(e, t, u, n, s);
      }
      if ((n & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && co(t, u !== null ? u.cachePool : null),
          u !== null ? sh(t, u) : Oc(),
          oh(t));
      else return ((s = t.lanes = 536870912), im(e, t, u !== null ? u.baseLanes | n : n, n, s));
    } else
      u !== null
        ? (co(t, u.cachePool), sh(t, u), wa(), (t.memoizedState = null))
        : (e !== null && co(t, null), Oc(), wa());
    return (Tt(e, t, c, n), t.child);
  }
  function rs(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function im(e, t, n, s, c) {
    var u = Tc();
    return (
      (u = u === null ? null : { parent: lt._currentValue, pool: u }),
      (t.memoizedState = { baseLanes: n, cachePool: u }),
      e !== null && co(t, null),
      Oc(),
      oh(t),
      e !== null && Ii(e, t, s, !0),
      (t.childLanes = c),
      null
    );
  }
  function Ro(e, t) {
    return (
      (t = Mo({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function rm(e, t, n) {
    return (
      mi(t, e.child, null, n),
      (e = Ro(t, t.pendingProps)),
      (e.flags |= 2),
      en(t),
      (t.memoizedState = null),
      e
    );
  }
  function xv(e, t, n) {
    var s = t.pendingProps,
      c = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (je) {
        if (s.mode === "hidden") return ((e = Ro(t, s)), (t.lanes = 536870912), rs(null, e));
        if (
          (zc(t),
          (e = $e)
            ? ((e = yp(e, dn)),
              (e = e !== null && e.data === "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: pa !== null ? { id: Mn, overflow: Cn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = Zd(e)),
                (n.return = t),
                (t.child = n),
                (wt = t),
                ($e = null)))
            : (e = null),
          e === null)
        )
          throw ya(t);
        return ((t.lanes = 536870912), null);
      }
      return Ro(t, s);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var m = u.dehydrated;
      if ((zc(t), c))
        if (t.flags & 256) ((t.flags &= -257), (t = rm(e, t, n)));
        else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(o(558));
      else if ((ut || Ii(e, t, n, !1), (c = (n & e.childLanes) !== 0), ut || c)) {
        if (((s = Ie), s !== null && ((m = Bt(s, n)), m !== 0 && m !== u.retryLane)))
          throw ((u.retryLane = m), si(e, m), Qt(s, e, m), eu);
        (Uo(), (t = rm(e, t, n)));
      } else
        ((e = u.treeContext),
          ($e = mn(m.nextSibling)),
          (wt = t),
          (je = !0),
          (ga = null),
          (dn = !1),
          e !== null && Qd(t, e),
          (t = Ro(t, s)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (e = Vn(e.child, { mode: s.mode, children: s.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function Ao(e, t) {
    var n = t.ref;
    if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(o(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function tu(e, t, n, s, c) {
    return (
      ui(t),
      (n = Lc(e, t, n, s, void 0, c)),
      (s = jc()),
      e !== null && !ut
        ? (Uc(e, t, c), Fn(e, t, c))
        : (je && s && gc(t), (t.flags |= 1), Tt(e, t, n, c), t.child)
    );
  }
  function sm(e, t, n, s, c, u) {
    return (
      ui(t),
      (t.updateQueue = null),
      (n = ch(t, s, n, c)),
      lh(e),
      (s = jc()),
      e !== null && !ut
        ? (Uc(e, t, u), Fn(e, t, u))
        : (je && s && gc(t), (t.flags |= 1), Tt(e, t, n, u), t.child)
    );
  }
  function om(e, t, n, s, c) {
    if ((ui(t), t.stateNode === null)) {
      var u = Xi,
        m = n.contextType;
      (typeof m == "object" && m !== null && (u = Et(m)),
        (u = new n(s, u)),
        (t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null),
        (u.updater = $c),
        (t.stateNode = u),
        (u._reactInternals = t),
        (u = t.stateNode),
        (u.props = s),
        (u.state = t.memoizedState),
        (u.refs = {}),
        Ac(t),
        (m = n.contextType),
        (u.context = typeof m == "object" && m !== null ? Et(m) : Xi),
        (u.state = t.memoizedState),
        (m = n.getDerivedStateFromProps),
        typeof m == "function" && (Jc(t, n, m, s), (u.state = t.memoizedState)),
        typeof n.getDerivedStateFromProps == "function" ||
          typeof u.getSnapshotBeforeUpdate == "function" ||
          (typeof u.UNSAFE_componentWillMount != "function" &&
            typeof u.componentWillMount != "function") ||
          ((m = u.state),
          typeof u.componentWillMount == "function" && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(),
          m !== u.state && $c.enqueueReplaceState(u, u.state, null),
          es(t, s, u, c),
          Wr(),
          (u.state = t.memoizedState)),
        typeof u.componentDidMount == "function" && (t.flags |= 4194308),
        (s = !0));
    } else if (e === null) {
      u = t.stateNode;
      var v = t.memoizedProps,
        w = gi(n, v);
      u.props = w;
      var z = u.context,
        q = n.contextType;
      ((m = Xi), typeof q == "object" && q !== null && (m = Et(q)));
      var Y = n.getDerivedStateFromProps;
      ((q = typeof Y == "function" || typeof u.getSnapshotBeforeUpdate == "function"),
        (v = t.pendingProps !== v),
        q ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((v || z !== m) && Fh(t, u, s, m)),
        (ba = !1));
      var D = t.memoizedState;
      ((u.state = D),
        es(t, s, u, c),
        Wr(),
        (z = t.memoizedState),
        v || D !== z || ba
          ? (typeof Y == "function" && (Jc(t, n, Y, s), (z = t.memoizedState)),
            (w = ba || Xh(t, n, w, s, D, z, m))
              ? (q ||
                  (typeof u.UNSAFE_componentWillMount != "function" &&
                    typeof u.componentWillMount != "function") ||
                  (typeof u.componentWillMount == "function" && u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == "function" &&
                    u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == "function" && (t.flags |= 4194308))
              : (typeof u.componentDidMount == "function" && (t.flags |= 4194308),
                (t.memoizedProps = s),
                (t.memoizedState = z)),
            (u.props = s),
            (u.state = z),
            (u.context = m),
            (s = w))
          : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), (s = !1)));
    } else {
      ((u = t.stateNode),
        Mc(e, t),
        (m = t.memoizedProps),
        (q = gi(n, m)),
        (u.props = q),
        (Y = t.pendingProps),
        (D = u.context),
        (z = n.contextType),
        (w = Xi),
        typeof z == "object" && z !== null && (w = Et(z)),
        (v = n.getDerivedStateFromProps),
        (z = typeof v == "function" || typeof u.getSnapshotBeforeUpdate == "function") ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((m !== Y || D !== w) && Fh(t, u, s, w)),
        (ba = !1),
        (D = t.memoizedState),
        (u.state = D),
        es(t, s, u, c),
        Wr());
      var j = t.memoizedState;
      m !== Y || D !== j || ba || (e !== null && e.dependencies !== null && oo(e.dependencies))
        ? (typeof v == "function" && (Jc(t, n, v, s), (j = t.memoizedState)),
          (q =
            ba ||
            Xh(t, n, q, s, D, j, w) ||
            (e !== null && e.dependencies !== null && oo(e.dependencies)))
            ? (z ||
                (typeof u.UNSAFE_componentWillUpdate != "function" &&
                  typeof u.componentWillUpdate != "function") ||
                (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(s, j, w),
                typeof u.UNSAFE_componentWillUpdate == "function" &&
                  u.UNSAFE_componentWillUpdate(s, j, w)),
              typeof u.componentDidUpdate == "function" && (t.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
            : (typeof u.componentDidUpdate != "function" ||
                (m === e.memoizedProps && D === e.memoizedState) ||
                (t.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != "function" ||
                (m === e.memoizedProps && D === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = s),
              (t.memoizedState = j)),
          (u.props = s),
          (u.state = j),
          (u.context = w),
          (s = q))
        : (typeof u.componentDidUpdate != "function" ||
            (m === e.memoizedProps && D === e.memoizedState) ||
            (t.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != "function" ||
            (m === e.memoizedProps && D === e.memoizedState) ||
            (t.flags |= 1024),
          (s = !1));
    }
    return (
      (u = s),
      Ao(e, t),
      (s = (t.flags & 128) !== 0),
      u || s
        ? ((u = t.stateNode),
          (n = s && typeof n.getDerivedStateFromError != "function" ? null : u.render()),
          (t.flags |= 1),
          e !== null && s
            ? ((t.child = mi(t, e.child, null, c)), (t.child = mi(t, null, n, c)))
            : Tt(e, t, n, c),
          (t.memoizedState = u.state),
          (e = t.child))
        : (e = Fn(e, t, c)),
      e
    );
  }
  function lm(e, t, n, s) {
    return (li(), (t.flags |= 256), Tt(e, t, n, s), t.child);
  }
  var nu = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function au(e) {
    return { baseLanes: e, cachePool: Jd() };
  }
  function iu(e, t, n) {
    return ((e = e !== null ? e.childLanes & ~n : 0), t && (e |= nn), e);
  }
  function cm(e, t, n) {
    var s = t.pendingProps,
      c = !1,
      u = (t.flags & 128) !== 0,
      m;
    if (
      ((m = u) || (m = e !== null && e.memoizedState === null ? !1 : (rt.current & 2) !== 0),
      m && ((c = !0), (t.flags &= -129)),
      (m = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (je) {
        if (
          (c ? xa(t) : wa(),
          (e = $e)
            ? ((e = yp(e, dn)),
              (e = e !== null && e.data !== "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: pa !== null ? { id: Mn, overflow: Cn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = Zd(e)),
                (n.return = t),
                (t.child = n),
                (wt = t),
                ($e = null)))
            : (e = null),
          e === null)
        )
          throw ya(t);
        return (qu(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var v = s.children;
      return (
        (s = s.fallback),
        c
          ? (wa(),
            (c = t.mode),
            (v = Mo({ mode: "hidden", children: v }, c)),
            (s = oi(s, c, n, null)),
            (v.return = t),
            (s.return = t),
            (v.sibling = s),
            (t.child = v),
            (s = t.child),
            (s.memoizedState = au(n)),
            (s.childLanes = iu(e, m, n)),
            (t.memoizedState = nu),
            rs(null, s))
          : (xa(t), ru(t, v))
      );
    }
    var w = e.memoizedState;
    if (w !== null && ((v = w.dehydrated), v !== null)) {
      if (u)
        t.flags & 256
          ? (xa(t), (t.flags &= -257), (t = su(e, t, n)))
          : t.memoizedState !== null
            ? (wa(), (t.child = e.child), (t.flags |= 128), (t = null))
            : (wa(),
              (v = s.fallback),
              (c = t.mode),
              (s = Mo({ mode: "visible", children: s.children }, c)),
              (v = oi(v, c, n, null)),
              (v.flags |= 2),
              (s.return = t),
              (v.return = t),
              (s.sibling = v),
              (t.child = s),
              mi(t, e.child, null, n),
              (s = t.child),
              (s.memoizedState = au(n)),
              (s.childLanes = iu(e, m, n)),
              (t.memoizedState = nu),
              (t = rs(null, s)));
      else if ((xa(t), qu(v))) {
        if (((m = v.nextSibling && v.nextSibling.dataset), m)) var z = m.dgst;
        ((m = z),
          (s = Error(o(419))),
          (s.stack = ""),
          (s.digest = m),
          Fr({ value: s, source: null, stack: null }),
          (t = su(e, t, n)));
      } else if ((ut || Ii(e, t, n, !1), (m = (n & e.childLanes) !== 0), ut || m)) {
        if (((m = Ie), m !== null && ((s = Bt(m, n)), s !== 0 && s !== w.retryLane)))
          throw ((w.retryLane = s), si(e, s), Qt(m, e, s), eu);
        (Hu(v) || Uo(), (t = su(e, t, n)));
      } else
        Hu(v)
          ? ((t.flags |= 192), (t.child = e.child), (t = null))
          : ((e = w.treeContext),
            ($e = mn(v.nextSibling)),
            (wt = t),
            (je = !0),
            (ga = null),
            (dn = !1),
            e !== null && Qd(t, e),
            (t = ru(t, s.children)),
            (t.flags |= 4096));
      return t;
    }
    return c
      ? (wa(),
        (v = s.fallback),
        (c = t.mode),
        (w = e.child),
        (z = w.sibling),
        (s = Vn(w, { mode: "hidden", children: s.children })),
        (s.subtreeFlags = w.subtreeFlags & 65011712),
        z !== null ? (v = Vn(z, v)) : ((v = oi(v, c, n, null)), (v.flags |= 2)),
        (v.return = t),
        (s.return = t),
        (s.sibling = v),
        (t.child = s),
        rs(null, s),
        (s = t.child),
        (v = e.child.memoizedState),
        v === null
          ? (v = au(n))
          : ((c = v.cachePool),
            c !== null
              ? ((w = lt._currentValue), (c = c.parent !== w ? { parent: w, pool: w } : c))
              : (c = Jd()),
            (v = { baseLanes: v.baseLanes | n, cachePool: c })),
        (s.memoizedState = v),
        (s.childLanes = iu(e, m, n)),
        (t.memoizedState = nu),
        rs(e.child, s))
      : (xa(t),
        (n = e.child),
        (e = n.sibling),
        (n = Vn(n, { mode: "visible", children: s.children })),
        (n.return = t),
        (n.sibling = null),
        e !== null &&
          ((m = t.deletions), m === null ? ((t.deletions = [e]), (t.flags |= 16)) : m.push(e)),
        (t.child = n),
        (t.memoizedState = null),
        n);
  }
  function ru(e, t) {
    return ((t = Mo({ mode: "visible", children: t }, e.mode)), (t.return = e), (e.child = t));
  }
  function Mo(e, t) {
    return ((e = $t(22, e, null, t)), (e.lanes = 0), e);
  }
  function su(e, t, n) {
    return (
      mi(t, e.child, null, n),
      (e = ru(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function um(e, t, n) {
    e.lanes |= t;
    var s = e.alternate;
    (s !== null && (s.lanes |= t), _c(e.return, t, n));
  }
  function ou(e, t, n, s, c, u) {
    var m = e.memoizedState;
    m === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: s,
          tail: n,
          tailMode: c,
          treeForkCount: u,
        })
      : ((m.isBackwards = t),
        (m.rendering = null),
        (m.renderingStartTime = 0),
        (m.last = s),
        (m.tail = n),
        (m.tailMode = c),
        (m.treeForkCount = u));
  }
  function fm(e, t, n) {
    var s = t.pendingProps,
      c = s.revealOrder,
      u = s.tail;
    s = s.children;
    var m = rt.current,
      v = (m & 2) !== 0;
    if (
      (v ? ((m = (m & 1) | 2), (t.flags |= 128)) : (m &= 1),
      Q(rt, m),
      Tt(e, t, s, n),
      (s = je ? Xr : 0),
      !v && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && um(e, n, t);
        else if (e.tag === 19) um(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (c) {
      case "forwards":
        for (n = t.child, c = null; n !== null; )
          ((e = n.alternate), e !== null && go(e) === null && (c = n), (n = n.sibling));
        ((n = c),
          n === null ? ((c = t.child), (t.child = null)) : ((c = n.sibling), (n.sibling = null)),
          ou(t, !1, c, n, u, s));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, c = t.child, t.child = null; c !== null; ) {
          if (((e = c.alternate), e !== null && go(e) === null)) {
            t.child = c;
            break;
          }
          ((e = c.sibling), (c.sibling = n), (n = c), (c = e));
        }
        ou(t, !0, n, null, u, s);
        break;
      case "together":
        ou(t, !1, null, null, void 0, s);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Fn(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies), (Ra |= t.lanes), (n & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((Ii(e, t, n, !1), (n & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, n = Vn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        ((e = e.sibling), (n = n.sibling = Vn(e, e.pendingProps)), (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function lu(e, t) {
    return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && oo(e)));
  }
  function wv(e, t, n) {
    switch (t.tag) {
      case 3:
        (xe(t, t.stateNode.containerInfo), va(t, lt, e.memoizedState.cache), li());
        break;
      case 27:
      case 5:
        Lt(t);
        break;
      case 4:
        xe(t, t.stateNode.containerInfo);
        break;
      case 10:
        va(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), zc(t), null);
        break;
      case 13:
        var s = t.memoizedState;
        if (s !== null)
          return s.dehydrated !== null
            ? (xa(t), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? cm(e, t, n)
              : (xa(t), (e = Fn(e, t, n)), e !== null ? e.sibling : null);
        xa(t);
        break;
      case 19:
        var c = (e.flags & 128) !== 0;
        if (
          ((s = (n & t.childLanes) !== 0),
          s || (Ii(e, t, n, !1), (s = (n & t.childLanes) !== 0)),
          c)
        ) {
          if (s) return fm(e, t, n);
          t.flags |= 128;
        }
        if (
          ((c = t.memoizedState),
          c !== null && ((c.rendering = null), (c.tail = null), (c.lastEffect = null)),
          Q(rt, rt.current),
          s)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), am(e, t, n, t.pendingProps));
      case 24:
        va(t, lt, e.memoizedState.cache);
    }
    return Fn(e, t, n);
  }
  function dm(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) ut = !0;
      else {
        if (!lu(e, n) && (t.flags & 128) === 0) return ((ut = !1), wv(e, t, n));
        ut = (e.flags & 131072) !== 0;
      }
    else ((ut = !1), je && (t.flags & 1048576) !== 0 && Gd(t, Xr, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var s = t.pendingProps;
          if (((e = di(t.elementType)), (t.type = e), typeof e == "function"))
            hc(e)
              ? ((s = gi(e, s)), (t.tag = 1), (t = om(null, t, e, s, n)))
              : ((t.tag = 0), (t = tu(null, t, e, s, n)));
          else {
            if (e != null) {
              var c = e.$$typeof;
              if (c === P) {
                ((t.tag = 11), (t = em(null, t, e, s, n)));
                break e;
              } else if (c === B) {
                ((t.tag = 14), (t = tm(null, t, e, s, n)));
                break e;
              }
            }
            throw ((t = Ue(e) || e), Error(o(306, t, "")));
          }
        }
        return t;
      case 0:
        return tu(e, t, t.type, t.pendingProps, n);
      case 1:
        return ((s = t.type), (c = gi(s, t.pendingProps)), om(e, t, s, c, n));
      case 3:
        e: {
          if ((xe(t, t.stateNode.containerInfo), e === null)) throw Error(o(387));
          s = t.pendingProps;
          var u = t.memoizedState;
          ((c = u.element), Mc(e, t), es(t, s, null, n));
          var m = t.memoizedState;
          if (
            ((s = m.cache),
            va(t, lt, s),
            s !== u.cache && xc(t, [lt], n, !0),
            Wr(),
            (s = m.element),
            u.isDehydrated)
          )
            if (
              ((u = { element: s, isDehydrated: !1, cache: m.cache }),
              (t.updateQueue.baseState = u),
              (t.memoizedState = u),
              t.flags & 256)
            ) {
              t = lm(e, t, s, n);
              break e;
            } else if (s !== c) {
              ((c = cn(Error(o(424)), t)), Fr(c), (t = lm(e, t, s, n)));
              break e;
            } else {
              switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (
                $e = mn(e.firstChild),
                  wt = t,
                  je = !0,
                  ga = null,
                  dn = !0,
                  n = ah(t, null, s, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
            }
          else {
            if ((li(), s === c)) {
              t = Fn(e, t, n);
              break e;
            }
            Tt(e, t, s, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          Ao(e, t),
          e === null
            ? (n = wp(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = n)
              : je ||
                ((n = t.type),
                (e = t.pendingProps),
                (s = Go(de.current).createElement(n)),
                (s[xt] = t),
                (s[Ht] = e),
                Rt(s, n, e),
                vt(s),
                (t.stateNode = s))
            : (t.memoizedState = wp(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
          null
        );
      case 27:
        return (
          Lt(t),
          e === null &&
            je &&
            ((s = t.stateNode = Sp(t.type, t.pendingProps, de.current)),
            (wt = t),
            (dn = !0),
            (c = $e),
            Oa(t.type) ? ((Vu = c), ($e = mn(s.firstChild))) : ($e = c)),
          Tt(e, t, t.pendingProps.children, n),
          Ao(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            je &&
            ((c = s = $e) &&
              ((s = Wv(s, t.type, t.pendingProps, dn)),
              s !== null
                ? ((t.stateNode = s), (wt = t), ($e = mn(s.firstChild)), (dn = !1), (c = !0))
                : (c = !1)),
            c || ya(t)),
          Lt(t),
          (c = t.type),
          (u = t.pendingProps),
          (m = e !== null ? e.memoizedProps : null),
          (s = u.children),
          ju(c, u) ? (s = null) : m !== null && ju(c, m) && (t.flags |= 32),
          t.memoizedState !== null && ((c = Lc(e, t, mv, null, null, n)), (Ss._currentValue = c)),
          Ao(e, t),
          Tt(e, t, s, n),
          t.child
        );
      case 6:
        return (
          e === null &&
            je &&
            ((e = n = $e) &&
              ((n = eb(n, t.pendingProps, dn)),
              n !== null ? ((t.stateNode = n), (wt = t), ($e = null), (e = !0)) : (e = !1)),
            e || ya(t)),
          null
        );
      case 13:
        return cm(e, t, n);
      case 4:
        return (
          xe(t, t.stateNode.containerInfo),
          (s = t.pendingProps),
          e === null ? (t.child = mi(t, null, s, n)) : Tt(e, t, s, n),
          t.child
        );
      case 11:
        return em(e, t, t.type, t.pendingProps, n);
      case 7:
        return (Tt(e, t, t.pendingProps, n), t.child);
      case 8:
        return (Tt(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (Tt(e, t, t.pendingProps.children, n), t.child);
      case 10:
        return ((s = t.pendingProps), va(t, t.type, s.value), Tt(e, t, s.children, n), t.child);
      case 9:
        return (
          (c = t.type._context),
          (s = t.pendingProps.children),
          ui(t),
          (c = Et(c)),
          (s = s(c)),
          (t.flags |= 1),
          Tt(e, t, s, n),
          t.child
        );
      case 14:
        return tm(e, t, t.type, t.pendingProps, n);
      case 15:
        return nm(e, t, t.type, t.pendingProps, n);
      case 19:
        return fm(e, t, n);
      case 31:
        return xv(e, t, n);
      case 22:
        return am(e, t, n, t.pendingProps);
      case 24:
        return (
          ui(t),
          (s = Et(lt)),
          e === null
            ? ((c = Tc()),
              c === null &&
                ((c = Ie),
                (u = wc()),
                (c.pooledCache = u),
                u.refCount++,
                u !== null && (c.pooledCacheLanes |= n),
                (c = u)),
              (t.memoizedState = { parent: s, cache: c }),
              Ac(t),
              va(t, lt, c))
            : ((e.lanes & n) !== 0 && (Mc(e, t), es(t, null, null, n), Wr()),
              (c = e.memoizedState),
              (u = t.memoizedState),
              c.parent !== s
                ? ((c = { parent: s, cache: s }),
                  (t.memoizedState = c),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = c),
                  va(t, lt, s))
                : ((s = u.cache), va(t, lt, s), s !== c.cache && xc(t, [lt], n, !0))),
          Tt(e, t, t.pendingProps.children, n),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Pn(e) {
    e.flags |= 4;
  }
  function cu(e, t, n, s, c) {
    if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
      if (((e.flags |= 16777216), (c & 335544128) === c))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Hm()) e.flags |= 8192;
        else throw ((hi = fo), Rc);
    } else e.flags &= -16777217;
  }
  function hm(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
    else if (((e.flags |= 16777216), !Mp(t)))
      if (Hm()) e.flags |= 8192;
      else throw ((hi = fo), Rc);
  }
  function Co(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 && ((t = e.tag !== 22 ? Ct() : 536870912), (e.lanes |= t), (lr |= t)));
  }
  function ss(e, t) {
    if (!je)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; ) (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = e.tail;
          for (var s = null; n !== null; ) (n.alternate !== null && (s = n), (n = n.sibling));
          s === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (s.sibling = null);
      }
  }
  function We(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      s = 0;
    if (t)
      for (var c = e.child; c !== null; )
        ((n |= c.lanes | c.childLanes),
          (s |= c.subtreeFlags & 65011712),
          (s |= c.flags & 65011712),
          (c.return = e),
          (c = c.sibling));
    else
      for (c = e.child; c !== null; )
        ((n |= c.lanes | c.childLanes),
          (s |= c.subtreeFlags),
          (s |= c.flags),
          (c.return = e),
          (c = c.sibling));
    return ((e.subtreeFlags |= s), (e.childLanes = n), t);
  }
  function Ev(e, t, n) {
    var s = t.pendingProps;
    switch ((yc(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (We(t), null);
      case 1:
        return (We(t), null);
      case 3:
        return (
          (n = t.stateNode),
          (s = null),
          e !== null && (s = e.memoizedState.cache),
          t.memoizedState.cache !== s && (t.flags |= 2048),
          Gn(lt),
          Le(),
          n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
          (e === null || e.child === null) &&
            (Ki(t)
              ? Pn(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), bc())),
          We(t),
          null
        );
      case 26:
        var c = t.type,
          u = t.memoizedState;
        return (
          e === null
            ? (Pn(t), u !== null ? (We(t), hm(t, u)) : (We(t), cu(t, c, null, s, n)))
            : u
              ? u !== e.memoizedState
                ? (Pn(t), We(t), hm(t, u))
                : (We(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps), e !== s && Pn(t), We(t), cu(t, c, e, s, n)),
          null
        );
      case 27:
        if ((Kt(t), (n = de.current), (c = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== s && Pn(t);
        else {
          if (!s) {
            if (t.stateNode === null) throw Error(o(166));
            return (We(t), null);
          }
          ((e = $.current), Ki(t) ? Xd(t) : ((e = Sp(c, s, n)), (t.stateNode = e), Pn(t)));
        }
        return (We(t), null);
      case 5:
        if ((Kt(t), (c = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== s && Pn(t);
        else {
          if (!s) {
            if (t.stateNode === null) throw Error(o(166));
            return (We(t), null);
          }
          if (((u = $.current), Ki(t))) Xd(t);
          else {
            var m = Go(de.current);
            switch (u) {
              case 1:
                u = m.createElementNS("http://www.w3.org/2000/svg", c);
                break;
              case 2:
                u = m.createElementNS("http://www.w3.org/1998/Math/MathML", c);
                break;
              default:
                switch (c) {
                  case "svg":
                    u = m.createElementNS("http://www.w3.org/2000/svg", c);
                    break;
                  case "math":
                    u = m.createElementNS("http://www.w3.org/1998/Math/MathML", c);
                    break;
                  case "script":
                    ((u = m.createElement("div")),
                      (u.innerHTML = "<script><\/script>"),
                      (u = u.removeChild(u.firstChild)));
                    break;
                  case "select":
                    ((u =
                      typeof s.is == "string"
                        ? m.createElement("select", { is: s.is })
                        : m.createElement("select")),
                      s.multiple ? (u.multiple = !0) : s.size && (u.size = s.size));
                    break;
                  default:
                    u =
                      typeof s.is == "string"
                        ? m.createElement(c, { is: s.is })
                        : m.createElement(c);
                }
            }
            ((u[xt] = t), (u[Ht] = s));
            e: for (m = t.child; m !== null; ) {
              if (m.tag === 5 || m.tag === 6) u.appendChild(m.stateNode);
              else if (m.tag !== 4 && m.tag !== 27 && m.child !== null) {
                ((m.child.return = m), (m = m.child));
                continue;
              }
              if (m === t) break e;
              for (; m.sibling === null; ) {
                if (m.return === null || m.return === t) break e;
                m = m.return;
              }
              ((m.sibling.return = m.return), (m = m.sibling));
            }
            t.stateNode = u;
            e: switch ((Rt(u, c, s), c)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                s = !!s.autoFocus;
                break e;
              case "img":
                s = !0;
                break e;
              default:
                s = !1;
            }
            s && Pn(t);
          }
        }
        return (We(t), cu(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null);
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== s && Pn(t);
        else {
          if (typeof s != "string" && t.stateNode === null) throw Error(o(166));
          if (((e = de.current), Ki(t))) {
            if (((e = t.stateNode), (n = t.memoizedProps), (s = null), (c = wt), c !== null))
              switch (c.tag) {
                case 27:
                case 5:
                  s = c.memoizedProps;
              }
            ((e[xt] = t),
              (e = !!(
                e.nodeValue === n ||
                (s !== null && s.suppressHydrationWarning === !0) ||
                cp(e.nodeValue, n)
              )),
              e || ya(t, !0));
          } else ((e = Go(e).createTextNode(s)), (e[xt] = t), (t.stateNode = e));
        }
        return (We(t), null);
      case 31:
        if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((s = Ki(t)), n !== null)) {
            if (e === null) {
              if (!s) throw Error(o(318));
              if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                throw Error(o(557));
              e[xt] = t;
            } else (li(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (We(t), (e = !1));
          } else
            ((n = bc()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n),
              (e = !0));
          if (!e) return t.flags & 256 ? (en(t), t) : (en(t), null);
          if ((t.flags & 128) !== 0) throw Error(o(558));
        }
        return (We(t), null);
      case 13:
        if (
          ((s = t.memoizedState),
          e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((c = Ki(t)), s !== null && s.dehydrated !== null)) {
            if (e === null) {
              if (!c) throw Error(o(318));
              if (((c = t.memoizedState), (c = c !== null ? c.dehydrated : null), !c))
                throw Error(o(317));
              c[xt] = t;
            } else (li(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (We(t), (c = !1));
          } else
            ((c = bc()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = c),
              (c = !0));
          if (!c) return t.flags & 256 ? (en(t), t) : (en(t), null);
        }
        return (
          en(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = n), t)
            : ((n = s !== null),
              (e = e !== null && e.memoizedState !== null),
              n &&
                ((s = t.child),
                (c = null),
                s.alternate !== null &&
                  s.alternate.memoizedState !== null &&
                  s.alternate.memoizedState.cachePool !== null &&
                  (c = s.alternate.memoizedState.cachePool.pool),
                (u = null),
                s.memoizedState !== null &&
                  s.memoizedState.cachePool !== null &&
                  (u = s.memoizedState.cachePool.pool),
                u !== c && (s.flags |= 2048)),
              n !== e && n && (t.child.flags |= 8192),
              Co(t, t.updateQueue),
              We(t),
              null)
        );
      case 4:
        return (Le(), e === null && Ou(t.stateNode.containerInfo), We(t), null);
      case 10:
        return (Gn(t.type), We(t), null);
      case 19:
        if ((U(rt), (s = t.memoizedState), s === null)) return (We(t), null);
        if (((c = (t.flags & 128) !== 0), (u = s.rendering), u === null))
          if (c) ss(s, !1);
          else {
            if (it !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((u = go(e)), u !== null)) {
                  for (
                    t.flags |= 128,
                      ss(s, !1),
                      e = u.updateQueue,
                      t.updateQueue = e,
                      Co(t, e),
                      t.subtreeFlags = 0,
                      e = n,
                      n = t.child;
                    n !== null;
                  )
                    (Vd(n, e), (n = n.sibling));
                  return (Q(rt, (rt.current & 1) | 2), je && Zn(t, s.treeForkCount), t.child);
                }
                e = e.sibling;
              }
            s.tail !== null &&
              Be() > Do &&
              ((t.flags |= 128), (c = !0), ss(s, !1), (t.lanes = 4194304));
          }
        else {
          if (!c)
            if (((e = go(u)), e !== null)) {
              if (
                ((t.flags |= 128),
                (c = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                Co(t, e),
                ss(s, !0),
                s.tail === null && s.tailMode === "hidden" && !u.alternate && !je)
              )
                return (We(t), null);
            } else
              2 * Be() - s.renderingStartTime > Do &&
                n !== 536870912 &&
                ((t.flags |= 128), (c = !0), ss(s, !1), (t.lanes = 4194304));
          s.isBackwards
            ? ((u.sibling = t.child), (t.child = u))
            : ((e = s.last), e !== null ? (e.sibling = u) : (t.child = u), (s.last = u));
        }
        return s.tail !== null
          ? ((e = s.tail),
            (s.rendering = e),
            (s.tail = e.sibling),
            (s.renderingStartTime = Be()),
            (e.sibling = null),
            (n = rt.current),
            Q(rt, c ? (n & 1) | 2 : n & 1),
            je && Zn(t, s.treeForkCount),
            e)
          : (We(t), null);
      case 22:
      case 23:
        return (
          en(t),
          Nc(),
          (s = t.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== s && (t.flags |= 8192)
            : s && (t.flags |= 8192),
          s
            ? (n & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (We(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : We(t),
          (n = t.updateQueue),
          n !== null && Co(t, n.retryQueue),
          (n = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (n = e.memoizedState.cachePool.pool),
          (s = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (s = t.memoizedState.cachePool.pool),
          s !== n && (t.flags |= 2048),
          e !== null && U(fi),
          null
        );
      case 24:
        return (
          (n = null),
          e !== null && (n = e.memoizedState.cache),
          t.memoizedState.cache !== n && (t.flags |= 2048),
          Gn(lt),
          We(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function Tv(e, t) {
    switch ((yc(t), t.tag)) {
      case 1:
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (
          Gn(lt),
          Le(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (Kt(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((en(t), t.alternate === null)) throw Error(o(340));
          li();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 13:
        if ((en(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(o(340));
          li();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (U(rt), null);
      case 4:
        return (Le(), null);
      case 10:
        return (Gn(t.type), null);
      case 22:
      case 23:
        return (
          en(t),
          Nc(),
          e !== null && U(fi),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (Gn(lt), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function mm(e, t) {
    switch ((yc(t), t.tag)) {
      case 3:
        (Gn(lt), Le());
        break;
      case 26:
      case 27:
      case 5:
        Kt(t);
        break;
      case 4:
        Le();
        break;
      case 31:
        t.memoizedState !== null && en(t);
        break;
      case 13:
        en(t);
        break;
      case 19:
        U(rt);
        break;
      case 10:
        Gn(t.type);
        break;
      case 22:
      case 23:
        (en(t), Nc(), e !== null && U(fi));
        break;
      case 24:
        Gn(lt);
    }
  }
  function os(e, t) {
    try {
      var n = t.updateQueue,
        s = n !== null ? n.lastEffect : null;
      if (s !== null) {
        var c = s.next;
        n = c;
        do {
          if ((n.tag & e) === e) {
            s = void 0;
            var u = n.create,
              m = n.inst;
            ((s = u()), (m.destroy = s));
          }
          n = n.next;
        } while (n !== c);
      }
    } catch (v) {
      Xe(t, t.return, v);
    }
  }
  function Ea(e, t, n) {
    try {
      var s = t.updateQueue,
        c = s !== null ? s.lastEffect : null;
      if (c !== null) {
        var u = c.next;
        s = u;
        do {
          if ((s.tag & e) === e) {
            var m = s.inst,
              v = m.destroy;
            if (v !== void 0) {
              ((m.destroy = void 0), (c = t));
              var w = n,
                z = v;
              try {
                z();
              } catch (q) {
                Xe(c, w, q);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    } catch (q) {
      Xe(t, t.return, q);
    }
  }
  function pm(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        rh(t, n);
      } catch (s) {
        Xe(e, e.return, s);
      }
    }
  }
  function gm(e, t, n) {
    ((n.props = gi(e.type, e.memoizedProps)), (n.state = e.memoizedState));
    try {
      n.componentWillUnmount();
    } catch (s) {
      Xe(e, t, s);
    }
  }
  function ls(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var s = e.stateNode;
            break;
          case 30:
            s = e.stateNode;
            break;
          default:
            s = e.stateNode;
        }
        typeof n == "function" ? (e.refCleanup = n(s)) : (n.current = s);
      }
    } catch (c) {
      Xe(e, t, c);
    }
  }
  function kn(e, t) {
    var n = e.ref,
      s = e.refCleanup;
    if (n !== null)
      if (typeof s == "function")
        try {
          s();
        } catch (c) {
          Xe(e, t, c);
        } finally {
          ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (c) {
          Xe(e, t, c);
        }
      else n.current = null;
  }
  function ym(e) {
    var t = e.type,
      n = e.memoizedProps,
      s = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && s.focus();
          break e;
        case "img":
          n.src ? (s.src = n.src) : n.srcSet && (s.srcset = n.srcSet);
      }
    } catch (c) {
      Xe(e, e.return, c);
    }
  }
  function uu(e, t, n) {
    try {
      var s = e.stateNode;
      (Fv(s, e.type, n, t), (s[Ht] = t));
    } catch (c) {
      Xe(e, e.return, c);
    }
  }
  function vm(e) {
    return (
      e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && Oa(e.type)) || e.tag === 4
    );
  }
  function fu(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || vm(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if ((e.tag === 27 && Oa(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function du(e, t, n) {
    var s = e.tag;
    if (s === 5 || s === 6)
      ((e = e.stateNode),
        t
          ? (n.nodeType === 9
              ? n.body
              : n.nodeName === "HTML"
                ? n.ownerDocument.body
                : n
            ).insertBefore(e, t)
          : ((t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n),
            t.appendChild(e),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = Hn)));
    else if (
      s !== 4 &&
      (s === 27 && Oa(e.type) && ((n = e.stateNode), (t = null)), (e = e.child), e !== null)
    )
      for (du(e, t, n), e = e.sibling; e !== null; ) (du(e, t, n), (e = e.sibling));
  }
  function ko(e, t, n) {
    var s = e.tag;
    if (s === 5 || s === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (s !== 4 && (s === 27 && Oa(e.type) && (n = e.stateNode), (e = e.child), e !== null))
      for (ko(e, t, n), e = e.sibling; e !== null; ) (ko(e, t, n), (e = e.sibling));
  }
  function bm(e) {
    var t = e.stateNode,
      n = e.memoizedProps;
    try {
      for (var s = e.type, c = t.attributes; c.length; ) t.removeAttributeNode(c[0]);
      (Rt(t, s, n), (t[xt] = e), (t[Ht] = n));
    } catch (u) {
      Xe(e, e.return, u);
    }
  }
  var Kn = !1,
    ft = !1,
    hu = !1,
    Sm = typeof WeakSet == "function" ? WeakSet : Set,
    bt = null;
  function Rv(e, t) {
    if (((e = e.containerInfo), (Du = Jo), (e = Nd(e)), sc(e))) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var s = n.getSelection && n.getSelection();
          if (s && s.rangeCount !== 0) {
            n = s.anchorNode;
            var c = s.anchorOffset,
              u = s.focusNode;
            s = s.focusOffset;
            try {
              (n.nodeType, u.nodeType);
            } catch {
              n = null;
              break e;
            }
            var m = 0,
              v = -1,
              w = -1,
              z = 0,
              q = 0,
              Y = e,
              D = null;
            t: for (;;) {
              for (
                var j;
                Y !== n || (c !== 0 && Y.nodeType !== 3) || (v = m + c),
                  Y !== u || (s !== 0 && Y.nodeType !== 3) || (w = m + s),
                  Y.nodeType === 3 && (m += Y.nodeValue.length),
                  (j = Y.firstChild) !== null;
              )
                ((D = Y), (Y = j));
              for (;;) {
                if (Y === e) break t;
                if (
                  (D === n && ++z === c && (v = m),
                  D === u && ++q === s && (w = m),
                  (j = Y.nextSibling) !== null)
                )
                  break;
                ((Y = D), (D = Y.parentNode));
              }
              Y = j;
            }
            n = v === -1 || w === -1 ? null : { start: v, end: w };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Lu = { focusedElem: e, selectionRange: n }, Jo = !1, bt = t; bt !== null; )
      if (((t = bt), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (bt = e));
      else
        for (; bt !== null; ) {
          switch (((t = bt), (u = t.alternate), (e = t.flags), t.tag)) {
            case 0:
              if (
                (e & 4) !== 0 &&
                ((e = t.updateQueue), (e = e !== null ? e.events : null), e !== null)
              )
                for (n = 0; n < e.length; n++) ((c = e[n]), (c.ref.impl = c.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                ((e = void 0),
                  (n = t),
                  (c = u.memoizedProps),
                  (u = u.memoizedState),
                  (s = n.stateNode));
                try {
                  var oe = gi(n.type, c);
                  ((e = s.getSnapshotBeforeUpdate(oe, u)),
                    (s.__reactInternalSnapshotBeforeUpdate = e));
                } catch (ye) {
                  Xe(n, n.return, ye);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)) Bu(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Bu(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (bt = e));
            break;
          }
          bt = t.return;
        }
  }
  function _m(e, t, n) {
    var s = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        (Jn(e, n), s & 4 && os(5, n));
        break;
      case 1:
        if ((Jn(e, n), s & 4))
          if (((e = n.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (m) {
              Xe(n, n.return, m);
            }
          else {
            var c = gi(n.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(c, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (m) {
              Xe(n, n.return, m);
            }
          }
        (s & 64 && pm(n), s & 512 && ls(n, n.return));
        break;
      case 3:
        if ((Jn(e, n), s & 64 && ((e = n.updateQueue), e !== null))) {
          if (((t = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            rh(e, t);
          } catch (m) {
            Xe(n, n.return, m);
          }
        }
        break;
      case 27:
        t === null && s & 4 && bm(n);
      case 26:
      case 5:
        (Jn(e, n), t === null && s & 4 && ym(n), s & 512 && ls(n, n.return));
        break;
      case 12:
        Jn(e, n);
        break;
      case 31:
        (Jn(e, n), s & 4 && Em(e, n));
        break;
      case 13:
        (Jn(e, n),
          s & 4 && Tm(e, n),
          s & 64 &&
            ((e = n.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null && ((n = Lv.bind(null, n)), tb(e, n)))));
        break;
      case 22:
        if (((s = n.memoizedState !== null || Kn), !s)) {
          ((t = (t !== null && t.memoizedState !== null) || ft), (c = Kn));
          var u = ft;
          ((Kn = s),
            (ft = t) && !u ? $n(e, n, (n.subtreeFlags & 8772) !== 0) : Jn(e, n),
            (Kn = c),
            (ft = u));
        }
        break;
      case 30:
        break;
      default:
        Jn(e, n);
    }
  }
  function xm(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), xm(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && Yl(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var tt = null,
    Vt = !1;
  function In(e, t, n) {
    for (n = n.child; n !== null; ) (wm(e, t, n), (n = n.sibling));
  }
  function wm(e, t, n) {
    if (Nt && typeof Nt.onCommitFiberUnmount == "function")
      try {
        Nt.onCommitFiberUnmount(Wa, n);
      } catch {}
    switch (n.tag) {
      case 26:
        (ft || kn(n, t),
          In(e, t, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n)));
        break;
      case 27:
        ft || kn(n, t);
        var s = tt,
          c = Vt;
        (Oa(n.type) && ((tt = n.stateNode), (Vt = !1)),
          In(e, t, n),
          ys(n.stateNode),
          (tt = s),
          (Vt = c));
        break;
      case 5:
        ft || kn(n, t);
      case 6:
        if (((s = tt), (c = Vt), (tt = null), In(e, t, n), (tt = s), (Vt = c), tt !== null))
          if (Vt)
            try {
              (tt.nodeType === 9
                ? tt.body
                : tt.nodeName === "HTML"
                  ? tt.ownerDocument.body
                  : tt
              ).removeChild(n.stateNode);
            } catch (u) {
              Xe(n, t, u);
            }
          else
            try {
              tt.removeChild(n.stateNode);
            } catch (u) {
              Xe(n, t, u);
            }
        break;
      case 18:
        tt !== null &&
          (Vt
            ? ((e = tt),
              pp(
                e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
                n.stateNode,
              ),
              gr(e))
            : pp(tt, n.stateNode));
        break;
      case 4:
        ((s = tt),
          (c = Vt),
          (tt = n.stateNode.containerInfo),
          (Vt = !0),
          In(e, t, n),
          (tt = s),
          (Vt = c));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (Ea(2, n, t), ft || Ea(4, n, t), In(e, t, n));
        break;
      case 1:
        (ft ||
          (kn(n, t), (s = n.stateNode), typeof s.componentWillUnmount == "function" && gm(n, t, s)),
          In(e, t, n));
        break;
      case 21:
        In(e, t, n);
        break;
      case 22:
        ((ft = (s = ft) || n.memoizedState !== null), In(e, t, n), (ft = s));
        break;
      default:
        In(e, t, n);
    }
  }
  function Em(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        gr(e);
      } catch (n) {
        Xe(t, t.return, n);
      }
    }
  }
  function Tm(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        gr(e);
      } catch (n) {
        Xe(t, t.return, n);
      }
  }
  function Av(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new Sm()), t);
      case 22:
        return (
          (e = e.stateNode), (t = e._retryCache), t === null && (t = e._retryCache = new Sm()), t
        );
      default:
        throw Error(o(435, e.tag));
    }
  }
  function Oo(e, t) {
    var n = Av(e);
    t.forEach(function (s) {
      if (!n.has(s)) {
        n.add(s);
        var c = jv.bind(null, e, s);
        s.then(c, c);
      }
    });
  }
  function Zt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var s = 0; s < n.length; s++) {
        var c = n[s],
          u = e,
          m = t,
          v = m;
        e: for (; v !== null; ) {
          switch (v.tag) {
            case 27:
              if (Oa(v.type)) {
                ((tt = v.stateNode), (Vt = !1));
                break e;
              }
              break;
            case 5:
              ((tt = v.stateNode), (Vt = !1));
              break e;
            case 3:
            case 4:
              ((tt = v.stateNode.containerInfo), (Vt = !0));
              break e;
          }
          v = v.return;
        }
        if (tt === null) throw Error(o(160));
        (wm(u, m, c),
          (tt = null),
          (Vt = !1),
          (u = c.alternate),
          u !== null && (u.return = null),
          (c.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) (Rm(t, e), (t = t.sibling));
  }
  var xn = null;
  function Rm(e, t) {
    var n = e.alternate,
      s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (Zt(t, e), Yt(e), s & 4 && (Ea(3, e, e.return), os(3, e), Ea(5, e, e.return)));
        break;
      case 1:
        (Zt(t, e),
          Yt(e),
          s & 512 && (ft || n === null || kn(n, n.return)),
          s & 64 &&
            Kn &&
            ((e = e.updateQueue),
            e !== null &&
              ((s = e.callbacks),
              s !== null &&
                ((n = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = n === null ? s : n.concat(s))))));
        break;
      case 26:
        var c = xn;
        if ((Zt(t, e), Yt(e), s & 512 && (ft || n === null || kn(n, n.return)), s & 4)) {
          var u = n !== null ? n.memoizedState : null;
          if (((s = e.memoizedState), n === null))
            if (s === null)
              if (e.stateNode === null) {
                e: {
                  ((s = e.type), (n = e.memoizedProps), (c = c.ownerDocument || c));
                  t: switch (s) {
                    case "title":
                      ((u = c.getElementsByTagName("title")[0]),
                        (!u ||
                          u[Lr] ||
                          u[xt] ||
                          u.namespaceURI === "http://www.w3.org/2000/svg" ||
                          u.hasAttribute("itemprop")) &&
                          ((u = c.createElement(s)),
                          c.head.insertBefore(u, c.querySelector("head > title"))),
                        Rt(u, s, n),
                        (u[xt] = e),
                        vt(u),
                        (s = u));
                      break e;
                    case "link":
                      var m = Rp("link", "href", c).get(s + (n.href || ""));
                      if (m) {
                        for (var v = 0; v < m.length; v++)
                          if (
                            ((u = m[v]),
                            u.getAttribute("href") ===
                              (n.href == null || n.href === "" ? null : n.href) &&
                              u.getAttribute("rel") === (n.rel == null ? null : n.rel) &&
                              u.getAttribute("title") === (n.title == null ? null : n.title) &&
                              u.getAttribute("crossorigin") ===
                                (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            m.splice(v, 1);
                            break t;
                          }
                      }
                      ((u = c.createElement(s)), Rt(u, s, n), c.head.appendChild(u));
                      break;
                    case "meta":
                      if ((m = Rp("meta", "content", c).get(s + (n.content || "")))) {
                        for (v = 0; v < m.length; v++)
                          if (
                            ((u = m[v]),
                            u.getAttribute("content") ===
                              (n.content == null ? null : "" + n.content) &&
                              u.getAttribute("name") === (n.name == null ? null : n.name) &&
                              u.getAttribute("property") ===
                                (n.property == null ? null : n.property) &&
                              u.getAttribute("http-equiv") ===
                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                              u.getAttribute("charset") === (n.charSet == null ? null : n.charSet))
                          ) {
                            m.splice(v, 1);
                            break t;
                          }
                      }
                      ((u = c.createElement(s)), Rt(u, s, n), c.head.appendChild(u));
                      break;
                    default:
                      throw Error(o(468, s));
                  }
                  ((u[xt] = e), vt(u), (s = u));
                }
                e.stateNode = s;
              } else Ap(c, e.type, e.stateNode);
            else e.stateNode = Tp(c, s, e.memoizedProps);
          else
            u !== s
              ? (u === null
                  ? n.stateNode !== null && ((n = n.stateNode), n.parentNode.removeChild(n))
                  : u.count--,
                s === null ? Ap(c, e.type, e.stateNode) : Tp(c, s, e.memoizedProps))
              : s === null && e.stateNode !== null && uu(e, e.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        (Zt(t, e),
          Yt(e),
          s & 512 && (ft || n === null || kn(n, n.return)),
          n !== null && s & 4 && uu(e, e.memoizedProps, n.memoizedProps));
        break;
      case 5:
        if ((Zt(t, e), Yt(e), s & 512 && (ft || n === null || kn(n, n.return)), e.flags & 32)) {
          c = e.stateNode;
          try {
            Hi(c, "");
          } catch (oe) {
            Xe(e, e.return, oe);
          }
        }
        (s & 4 &&
          e.stateNode != null &&
          ((c = e.memoizedProps), uu(e, c, n !== null ? n.memoizedProps : c)),
          s & 1024 && (hu = !0));
        break;
      case 6:
        if ((Zt(t, e), Yt(e), s & 4)) {
          if (e.stateNode === null) throw Error(o(162));
          ((s = e.memoizedProps), (n = e.stateNode));
          try {
            n.nodeValue = s;
          } catch (oe) {
            Xe(e, e.return, oe);
          }
        }
        break;
      case 3:
        if (
          ((Fo = null),
          (c = xn),
          (xn = Qo(t.containerInfo)),
          Zt(t, e),
          (xn = c),
          Yt(e),
          s & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            gr(t.containerInfo);
          } catch (oe) {
            Xe(e, e.return, oe);
          }
        hu && ((hu = !1), Am(e));
        break;
      case 4:
        ((s = xn), (xn = Qo(e.stateNode.containerInfo)), Zt(t, e), Yt(e), (xn = s));
        break;
      case 12:
        (Zt(t, e), Yt(e));
        break;
      case 31:
        (Zt(t, e),
          Yt(e),
          s & 4 && ((s = e.updateQueue), s !== null && ((e.updateQueue = null), Oo(e, s))));
        break;
      case 13:
        (Zt(t, e),
          Yt(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) != (n !== null && n.memoizedState !== null) &&
            (zo = Be()),
          s & 4 && ((s = e.updateQueue), s !== null && ((e.updateQueue = null), Oo(e, s))));
        break;
      case 22:
        c = e.memoizedState !== null;
        var w = n !== null && n.memoizedState !== null,
          z = Kn,
          q = ft;
        if (((Kn = z || c), (ft = q || w), Zt(t, e), (ft = q), (Kn = z), Yt(e), s & 8192))
          e: for (
            t = e.stateNode,
              t._visibility = c ? t._visibility & -2 : t._visibility | 1,
              c && (n === null || w || Kn || ft || yi(e)),
              n = null,
              t = e;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                w = n = t;
                try {
                  if (((u = w.stateNode), c))
                    ((m = u.style),
                      typeof m.setProperty == "function"
                        ? m.setProperty("display", "none", "important")
                        : (m.display = "none"));
                  else {
                    v = w.stateNode;
                    var Y = w.memoizedProps.style,
                      D = Y != null && Y.hasOwnProperty("display") ? Y.display : null;
                    v.style.display = D == null || typeof D == "boolean" ? "" : ("" + D).trim();
                  }
                } catch (oe) {
                  Xe(w, w.return, oe);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                w = t;
                try {
                  w.stateNode.nodeValue = c ? "" : w.memoizedProps;
                } catch (oe) {
                  Xe(w, w.return, oe);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                w = t;
                try {
                  var j = w.stateNode;
                  c ? gp(j, !0) : gp(w.stateNode, !1);
                } catch (oe) {
                  Xe(w, w.return, oe);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) || t.memoizedState === null || t === e) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              (n === t && (n = null), (t = t.return));
            }
            (n === t && (n = null), (t.sibling.return = t.return), (t = t.sibling));
          }
        s & 4 &&
          ((s = e.updateQueue),
          s !== null && ((n = s.retryQueue), n !== null && ((s.retryQueue = null), Oo(e, n))));
        break;
      case 19:
        (Zt(t, e),
          Yt(e),
          s & 4 && ((s = e.updateQueue), s !== null && ((e.updateQueue = null), Oo(e, s))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (Zt(t, e), Yt(e));
    }
  }
  function Yt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, s = e.return; s !== null; ) {
          if (vm(s)) {
            n = s;
            break;
          }
          s = s.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var c = n.stateNode,
              u = fu(e);
            ko(e, u, c);
            break;
          case 5:
            var m = n.stateNode;
            n.flags & 32 && (Hi(m, ""), (n.flags &= -33));
            var v = fu(e);
            ko(e, v, m);
            break;
          case 3:
          case 4:
            var w = n.stateNode.containerInfo,
              z = fu(e);
            du(e, z, w);
            break;
          default:
            throw Error(o(161));
        }
      } catch (q) {
        Xe(e, e.return, q);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Am(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        (Am(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling));
      }
  }
  function Jn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) (_m(e, t.alternate, t), (t = t.sibling));
  }
  function yi(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (Ea(4, t, t.return), yi(t));
          break;
        case 1:
          kn(t, t.return);
          var n = t.stateNode;
          (typeof n.componentWillUnmount == "function" && gm(t, t.return, n), yi(t));
          break;
        case 27:
          ys(t.stateNode);
        case 26:
        case 5:
          (kn(t, t.return), yi(t));
          break;
        case 22:
          t.memoizedState === null && yi(t);
          break;
        case 30:
          yi(t);
          break;
        default:
          yi(t);
      }
      e = e.sibling;
    }
  }
  function $n(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var s = t.alternate,
        c = e,
        u = t,
        m = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          ($n(c, u, n), os(4, u));
          break;
        case 1:
          if (($n(c, u, n), (s = u), (c = s.stateNode), typeof c.componentDidMount == "function"))
            try {
              c.componentDidMount();
            } catch (z) {
              Xe(s, s.return, z);
            }
          if (((s = u), (c = s.updateQueue), c !== null)) {
            var v = s.stateNode;
            try {
              var w = c.shared.hiddenCallbacks;
              if (w !== null)
                for (c.shared.hiddenCallbacks = null, c = 0; c < w.length; c++) ih(w[c], v);
            } catch (z) {
              Xe(s, s.return, z);
            }
          }
          (n && m & 64 && pm(u), ls(u, u.return));
          break;
        case 27:
          bm(u);
        case 26:
        case 5:
          ($n(c, u, n), n && s === null && m & 4 && ym(u), ls(u, u.return));
          break;
        case 12:
          $n(c, u, n);
          break;
        case 31:
          ($n(c, u, n), n && m & 4 && Em(c, u));
          break;
        case 13:
          ($n(c, u, n), n && m & 4 && Tm(c, u));
          break;
        case 22:
          (u.memoizedState === null && $n(c, u, n), ls(u, u.return));
          break;
        case 30:
          break;
        default:
          $n(c, u, n);
      }
      t = t.sibling;
    }
  }
  function mu(e, t) {
    var n = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (n = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== n && (e != null && e.refCount++, n != null && Pr(n)));
  }
  function pu(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && Pr(e)));
  }
  function wn(e, t, n, s) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (Mm(e, t, n, s), (t = t.sibling));
  }
  function Mm(e, t, n, s) {
    var c = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (wn(e, t, n, s), c & 2048 && os(9, t));
        break;
      case 1:
        wn(e, t, n, s);
        break;
      case 3:
        (wn(e, t, n, s),
          c & 2048 &&
            ((e = null),
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== e && (t.refCount++, e != null && Pr(e))));
        break;
      case 12:
        if (c & 2048) {
          (wn(e, t, n, s), (e = t.stateNode));
          try {
            var u = t.memoizedProps,
              m = u.id,
              v = u.onPostCommit;
            typeof v == "function" &&
              v(m, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
          } catch (w) {
            Xe(t, t.return, w);
          }
        } else wn(e, t, n, s);
        break;
      case 31:
        wn(e, t, n, s);
        break;
      case 13:
        wn(e, t, n, s);
        break;
      case 23:
        break;
      case 22:
        ((u = t.stateNode),
          (m = t.alternate),
          t.memoizedState !== null
            ? u._visibility & 2
              ? wn(e, t, n, s)
              : cs(e, t)
            : u._visibility & 2
              ? wn(e, t, n, s)
              : ((u._visibility |= 2), rr(e, t, n, s, (t.subtreeFlags & 10256) !== 0 || !1)),
          c & 2048 && mu(m, t));
        break;
      case 24:
        (wn(e, t, n, s), c & 2048 && pu(t.alternate, t));
        break;
      default:
        wn(e, t, n, s);
    }
  }
  function rr(e, t, n, s, c) {
    for (c = c && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e,
        m = t,
        v = n,
        w = s,
        z = m.flags;
      switch (m.tag) {
        case 0:
        case 11:
        case 15:
          (rr(u, m, v, w, c), os(8, m));
          break;
        case 23:
          break;
        case 22:
          var q = m.stateNode;
          (m.memoizedState !== null
            ? q._visibility & 2
              ? rr(u, m, v, w, c)
              : cs(u, m)
            : ((q._visibility |= 2), rr(u, m, v, w, c)),
            c && z & 2048 && mu(m.alternate, m));
          break;
        case 24:
          (rr(u, m, v, w, c), c && z & 2048 && pu(m.alternate, m));
          break;
        default:
          rr(u, m, v, w, c);
      }
      t = t.sibling;
    }
  }
  function cs(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e,
          s = t,
          c = s.flags;
        switch (s.tag) {
          case 22:
            (cs(n, s), c & 2048 && mu(s.alternate, s));
            break;
          case 24:
            (cs(n, s), c & 2048 && pu(s.alternate, s));
            break;
          default:
            cs(n, s);
        }
        t = t.sibling;
      }
  }
  var us = 8192;
  function sr(e, t, n) {
    if (e.subtreeFlags & us) for (e = e.child; e !== null; ) (Cm(e, t, n), (e = e.sibling));
  }
  function Cm(e, t, n) {
    switch (e.tag) {
      case 26:
        (sr(e, t, n),
          e.flags & us && e.memoizedState !== null && hb(n, xn, e.memoizedState, e.memoizedProps));
        break;
      case 5:
        sr(e, t, n);
        break;
      case 3:
      case 4:
        var s = xn;
        ((xn = Qo(e.stateNode.containerInfo)), sr(e, t, n), (xn = s));
        break;
      case 22:
        e.memoizedState === null &&
          ((s = e.alternate),
          s !== null && s.memoizedState !== null
            ? ((s = us), (us = 16777216), sr(e, t, n), (us = s))
            : sr(e, t, n));
        break;
      default:
        sr(e, t, n);
    }
  }
  function km(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function fs(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var s = t[n];
          ((bt = s), Nm(s, e));
        }
      km(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) (Om(e), (e = e.sibling));
  }
  function Om(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (fs(e), e.flags & 2048 && Ea(9, e, e.return));
        break;
      case 3:
        fs(e);
        break;
      case 12:
        fs(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), No(e))
          : fs(e);
        break;
      default:
        fs(e);
    }
  }
  function No(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var s = t[n];
          ((bt = s), Nm(s, e));
        }
      km(e);
    }
    for (e = e.child; e !== null; ) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (Ea(8, t, t.return), No(t));
          break;
        case 22:
          ((n = t.stateNode), n._visibility & 2 && ((n._visibility &= -3), No(t)));
          break;
        default:
          No(t);
      }
      e = e.sibling;
    }
  }
  function Nm(e, t) {
    for (; bt !== null; ) {
      var n = bt;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Ea(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var s = n.memoizedState.cachePool.pool;
            s != null && s.refCount++;
          }
          break;
        case 24:
          Pr(n.memoizedState.cache);
      }
      if (((s = n.child), s !== null)) ((s.return = n), (bt = s));
      else
        e: for (n = e; bt !== null; ) {
          s = bt;
          var c = s.sibling,
            u = s.return;
          if ((xm(s), s === n)) {
            bt = null;
            break e;
          }
          if (c !== null) {
            ((c.return = u), (bt = c));
            break e;
          }
          bt = u;
        }
    }
  }
  var Mv = {
      getCacheForType: function (e) {
        var t = Et(lt),
          n = t.data.get(e);
        return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
      },
      cacheSignal: function () {
        return Et(lt).controller.signal;
      },
    },
    Cv = typeof WeakMap == "function" ? WeakMap : Map,
    Ye = 0,
    Ie = null,
    Oe = null,
    ze = 0,
    Qe = 0,
    tn = null,
    Ta = !1,
    or = !1,
    gu = !1,
    Wn = 0,
    it = 0,
    Ra = 0,
    vi = 0,
    yu = 0,
    nn = 0,
    lr = 0,
    ds = null,
    Gt = null,
    vu = !1,
    zo = 0,
    zm = 0,
    Do = 1 / 0,
    Lo = null,
    Aa = null,
    ht = 0,
    Ma = null,
    cr = null,
    ea = 0,
    bu = 0,
    Su = null,
    Dm = null,
    hs = 0,
    _u = null;
  function an() {
    return (Ye & 2) !== 0 && ze !== 0 ? ze & -ze : C.T !== null ? Au() : Vl();
  }
  function Lm() {
    if (nn === 0)
      if ((ze & 536870912) === 0 || je) {
        var e = Oi;
        ((Oi <<= 1), (Oi & 3932160) === 0 && (Oi = 262144), (nn = e));
      } else nn = 536870912;
    return ((e = Wt.current), e !== null && (e.flags |= 32), nn);
  }
  function Qt(e, t, n) {
    (((e === Ie && (Qe === 2 || Qe === 9)) || e.cancelPendingCommit !== null) &&
      (ur(e, 0), Ca(e, ze, nn, !1)),
      nt(e, n),
      ((Ye & 2) === 0 || e !== Ie) &&
        (e === Ie && ((Ye & 2) === 0 && (vi |= n), it === 4 && Ca(e, ze, nn, !1)), On(e)));
  }
  function jm(e, t, n) {
    if ((Ye & 6) !== 0) throw Error(o(327));
    var s = (!n && (t & 127) === 0 && (t & e.expiredLanes) === 0) || et(e, t),
      c = s ? Nv(e, t) : wu(e, t, !0),
      u = s;
    do {
      if (c === 0) {
        or && !s && Ca(e, t, 0, !1);
        break;
      } else {
        if (((n = e.current.alternate), u && !kv(n))) {
          ((c = wu(e, t, !1)), (u = !1));
          continue;
        }
        if (c === 2) {
          if (((u = t), e.errorRecoveryDisabledLanes & u)) var m = 0;
          else
            ((m = e.pendingLanes & -536870913), (m = m !== 0 ? m : m & 536870912 ? 536870912 : 0));
          if (m !== 0) {
            t = m;
            e: {
              var v = e;
              c = ds;
              var w = v.current.memoizedState.isDehydrated;
              if ((w && (ur(v, m).flags |= 256), (m = wu(v, m, !1)), m !== 2)) {
                if (gu && !w) {
                  ((v.errorRecoveryDisabledLanes |= u), (vi |= u), (c = 4));
                  break e;
                }
                ((u = Gt), (Gt = c), u !== null && (Gt === null ? (Gt = u) : Gt.push.apply(Gt, u)));
              }
              c = m;
            }
            if (((u = !1), c !== 2)) continue;
          }
        }
        if (c === 1) {
          (ur(e, 0), Ca(e, t, 0, !0));
          break;
        }
        e: {
          switch (((s = e), (u = c), u)) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Ca(s, t, nn, !Ta);
              break e;
            case 2:
              Gt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && ((c = zo + 300 - Be()), 10 < c)) {
            if ((Ca(s, t, nn, !Ta), Se(s, 0, !0) !== 0)) break e;
            ((ea = t),
              (s.timeoutHandle = hp(
                Um.bind(null, s, n, Gt, Lo, vu, t, nn, vi, lr, Ta, u, "Throttled", -0, 0),
                c,
              )));
            break e;
          }
          Um(s, n, Gt, Lo, vu, t, nn, vi, lr, Ta, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    On(e);
  }
  function Um(e, t, n, s, c, u, m, v, w, z, q, Y, D, j) {
    if (((e.timeoutHandle = -1), (Y = t.subtreeFlags), Y & 8192 || (Y & 16785408) === 16785408)) {
      ((Y = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Hn,
      }),
        Cm(t, u, Y));
      var oe = (u & 62914560) === u ? zo - Be() : (u & 4194048) === u ? zm - Be() : 0;
      if (((oe = mb(Y, oe)), oe !== null)) {
        ((ea = u),
          (e.cancelPendingCommit = oe(Qm.bind(null, e, t, u, n, s, c, m, v, w, q, Y, null, D, j))),
          Ca(e, u, m, !z));
        return;
      }
    }
    Qm(e, t, u, n, s, c, m, v, w);
  }
  function kv(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        t.flags & 16384 &&
        ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var s = 0; s < n.length; s++) {
          var c = n[s],
            u = c.getSnapshot;
          c = c.value;
          try {
            if (!Jt(u(), c)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function Ca(e, t, n, s) {
    ((t &= ~yu),
      (t &= ~vi),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      s && (e.warmLanes |= t),
      (s = e.expirationTimes));
    for (var c = t; 0 < c; ) {
      var u = 31 - Mt(c),
        m = 1 << u;
      ((s[u] = -1), (c &= ~m));
    }
    n !== 0 && ti(e, n, t);
  }
  function jo() {
    return (Ye & 6) === 0 ? (ms(0), !1) : !0;
  }
  function xu() {
    if (Oe !== null) {
      if (Qe === 0) var e = Oe.return;
      else ((e = Oe), (Yn = ci = null), Bc(e), (er = null), (Ir = 0), (e = Oe));
      for (; e !== null; ) (mm(e.alternate, e), (e = e.return));
      Oe = null;
    }
  }
  function ur(e, t) {
    var n = e.timeoutHandle;
    (n !== -1 && ((e.timeoutHandle = -1), Iv(n)),
      (n = e.cancelPendingCommit),
      n !== null && ((e.cancelPendingCommit = null), n()),
      (ea = 0),
      xu(),
      (Ie = e),
      (Oe = n = Vn(e.current, null)),
      (ze = t),
      (Qe = 0),
      (tn = null),
      (Ta = !1),
      (or = et(e, t)),
      (gu = !1),
      (lr = nn = yu = vi = Ra = it = 0),
      (Gt = ds = null),
      (vu = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var s = e.entangledLanes;
    if (s !== 0)
      for (e = e.entanglements, s &= t; 0 < s; ) {
        var c = 31 - Mt(s),
          u = 1 << c;
        ((t |= e[c]), (s &= ~u));
      }
    return ((Wn = t), no(), n);
  }
  function Bm(e, t) {
    ((Re = null),
      (C.H = is),
      t === Wi || t === uo
        ? ((t = eh()), (Qe = 3))
        : t === Rc
          ? ((t = eh()), (Qe = 4))
          : (Qe =
              t === eu
                ? 8
                : t !== null && typeof t == "object" && typeof t.then == "function"
                  ? 6
                  : 1),
      (tn = t),
      Oe === null && ((it = 1), To(e, cn(t, e.current))));
  }
  function Hm() {
    var e = Wt.current;
    return e === null
      ? !0
      : (ze & 4194048) === ze
        ? hn === null
        : (ze & 62914560) === ze || (ze & 536870912) !== 0
          ? e === hn
          : !1;
  }
  function qm() {
    var e = C.H;
    return ((C.H = is), e === null ? is : e);
  }
  function Vm() {
    var e = C.A;
    return ((C.A = Mv), e);
  }
  function Uo() {
    ((it = 4),
      Ta || ((ze & 4194048) !== ze && Wt.current !== null) || (or = !0),
      ((Ra & 134217727) === 0 && (vi & 134217727) === 0) || Ie === null || Ca(Ie, ze, nn, !1));
  }
  function wu(e, t, n) {
    var s = Ye;
    Ye |= 2;
    var c = qm(),
      u = Vm();
    ((Ie !== e || ze !== t) && ((Lo = null), ur(e, t)), (t = !1));
    var m = it;
    e: do
      try {
        if (Qe !== 0 && Oe !== null) {
          var v = Oe,
            w = tn;
          switch (Qe) {
            case 8:
              (xu(), (m = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Wt.current === null && (t = !0);
              var z = Qe;
              if (((Qe = 0), (tn = null), fr(e, v, w, z), n && or)) {
                m = 0;
                break e;
              }
              break;
            default:
              ((z = Qe), (Qe = 0), (tn = null), fr(e, v, w, z));
          }
        }
        (Ov(), (m = it));
        break;
      } catch (q) {
        Bm(e, q);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (Yn = ci = null),
      (Ye = s),
      (C.H = c),
      (C.A = u),
      Oe === null && ((Ie = null), (ze = 0), no()),
      m
    );
  }
  function Ov() {
    for (; Oe !== null; ) Zm(Oe);
  }
  function Nv(e, t) {
    var n = Ye;
    Ye |= 2;
    var s = qm(),
      c = Vm();
    Ie !== e || ze !== t ? ((Lo = null), (Do = Be() + 500), ur(e, t)) : (or = et(e, t));
    e: do
      try {
        if (Qe !== 0 && Oe !== null) {
          t = Oe;
          var u = tn;
          t: switch (Qe) {
            case 1:
              ((Qe = 0), (tn = null), fr(e, t, u, 1));
              break;
            case 2:
            case 9:
              if ($d(u)) {
                ((Qe = 0), (tn = null), Ym(t));
                break;
              }
              ((t = function () {
                ((Qe !== 2 && Qe !== 9) || Ie !== e || (Qe = 7), On(e));
              }),
                u.then(t, t));
              break e;
            case 3:
              Qe = 7;
              break e;
            case 4:
              Qe = 5;
              break e;
            case 7:
              $d(u) ? ((Qe = 0), (tn = null), Ym(t)) : ((Qe = 0), (tn = null), fr(e, t, u, 7));
              break;
            case 5:
              var m = null;
              switch (Oe.tag) {
                case 26:
                  m = Oe.memoizedState;
                case 5:
                case 27:
                  var v = Oe;
                  if (m ? Mp(m) : v.stateNode.complete) {
                    ((Qe = 0), (tn = null));
                    var w = v.sibling;
                    if (w !== null) Oe = w;
                    else {
                      var z = v.return;
                      z !== null ? ((Oe = z), Bo(z)) : (Oe = null);
                    }
                    break t;
                  }
              }
              ((Qe = 0), (tn = null), fr(e, t, u, 5));
              break;
            case 6:
              ((Qe = 0), (tn = null), fr(e, t, u, 6));
              break;
            case 8:
              (xu(), (it = 6));
              break e;
            default:
              throw Error(o(462));
          }
        }
        zv();
        break;
      } catch (q) {
        Bm(e, q);
      }
    while (!0);
    return (
      (Yn = ci = null),
      (C.H = s),
      (C.A = c),
      (Ye = n),
      Oe !== null ? 0 : ((Ie = null), (ze = 0), no(), it)
    );
  }
  function zv() {
    for (; Oe !== null && !gt(); ) Zm(Oe);
  }
  function Zm(e) {
    var t = dm(e.alternate, e, Wn);
    ((e.memoizedProps = e.pendingProps), t === null ? Bo(e) : (Oe = t));
  }
  function Ym(e) {
    var t = e,
      n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = sm(n, t, t.pendingProps, t.type, void 0, ze);
        break;
      case 11:
        t = sm(n, t, t.pendingProps, t.type.render, t.ref, ze);
        break;
      case 5:
        Bc(t);
      default:
        (mm(n, t), (t = Oe = Vd(t, Wn)), (t = dm(n, t, Wn)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? Bo(e) : (Oe = t));
  }
  function fr(e, t, n, s) {
    ((Yn = ci = null), Bc(t), (er = null), (Ir = 0));
    var c = t.return;
    try {
      if (_v(e, c, t, n, ze)) {
        ((it = 1), To(e, cn(n, e.current)), (Oe = null));
        return;
      }
    } catch (u) {
      if (c !== null) throw ((Oe = c), u);
      ((it = 1), To(e, cn(n, e.current)), (Oe = null));
      return;
    }
    t.flags & 32768
      ? (je || s === 1
          ? (e = !0)
          : or || (ze & 536870912) !== 0
            ? (e = !1)
            : ((Ta = e = !0),
              (s === 2 || s === 9 || s === 3 || s === 6) &&
                ((s = Wt.current), s !== null && s.tag === 13 && (s.flags |= 16384))),
        Gm(t, e))
      : Bo(t);
  }
  function Bo(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Gm(t, Ta);
        return;
      }
      e = t.return;
      var n = Ev(t.alternate, t, Wn);
      if (n !== null) {
        Oe = n;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        Oe = t;
        return;
      }
      Oe = t = e;
    } while (t !== null);
    it === 0 && (it = 5);
  }
  function Gm(e, t) {
    do {
      var n = Tv(e.alternate, e);
      if (n !== null) {
        ((n.flags &= 32767), (Oe = n));
        return;
      }
      if (
        ((n = e.return),
        n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        Oe = e;
        return;
      }
      Oe = e = n;
    } while (e !== null);
    ((it = 6), (Oe = null));
  }
  function Qm(e, t, n, s, c, u, m, v, w) {
    e.cancelPendingCommit = null;
    do Ho();
    while (ht !== 0);
    if ((Ye & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (
        ((u = t.lanes | t.childLanes),
        (u |= fc),
        jt(e, n, u, m, v, w),
        e === Ie && ((Oe = Ie = null), (ze = 0)),
        (cr = t),
        (Ma = e),
        (ea = n),
        (bu = u),
        (Su = c),
        (Dm = s),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            Uv($a, function () {
              return (Im(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (s = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || s)
      ) {
        ((s = C.T), (C.T = null), (c = H.p), (H.p = 2), (m = Ye), (Ye |= 4));
        try {
          Rv(e, t, n);
        } finally {
          ((Ye = m), (H.p = c), (C.T = s));
        }
      }
      ((ht = 1), Xm(), Fm(), Pm());
    }
  }
  function Xm() {
    if (ht === 1) {
      ht = 0;
      var e = Ma,
        t = cr,
        n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        ((n = C.T), (C.T = null));
        var s = H.p;
        H.p = 2;
        var c = Ye;
        Ye |= 4;
        try {
          Rm(t, e);
          var u = Lu,
            m = Nd(e.containerInfo),
            v = u.focusedElem,
            w = u.selectionRange;
          if (m !== v && v && v.ownerDocument && Od(v.ownerDocument.documentElement, v)) {
            if (w !== null && sc(v)) {
              var z = w.start,
                q = w.end;
              if ((q === void 0 && (q = z), "selectionStart" in v))
                ((v.selectionStart = z), (v.selectionEnd = Math.min(q, v.value.length)));
              else {
                var Y = v.ownerDocument || document,
                  D = (Y && Y.defaultView) || window;
                if (D.getSelection) {
                  var j = D.getSelection(),
                    oe = v.textContent.length,
                    ye = Math.min(w.start, oe),
                    Ke = w.end === void 0 ? ye : Math.min(w.end, oe);
                  !j.extend && ye > Ke && ((m = Ke), (Ke = ye), (ye = m));
                  var O = kd(v, ye),
                    M = kd(v, Ke);
                  if (
                    O &&
                    M &&
                    (j.rangeCount !== 1 ||
                      j.anchorNode !== O.node ||
                      j.anchorOffset !== O.offset ||
                      j.focusNode !== M.node ||
                      j.focusOffset !== M.offset)
                  ) {
                    var N = Y.createRange();
                    (N.setStart(O.node, O.offset),
                      j.removeAllRanges(),
                      ye > Ke
                        ? (j.addRange(N), j.extend(M.node, M.offset))
                        : (N.setEnd(M.node, M.offset), j.addRange(N)));
                  }
                }
              }
            }
            for (Y = [], j = v; (j = j.parentNode); )
              j.nodeType === 1 && Y.push({ element: j, left: j.scrollLeft, top: j.scrollTop });
            for (typeof v.focus == "function" && v.focus(), v = 0; v < Y.length; v++) {
              var V = Y[v];
              ((V.element.scrollLeft = V.left), (V.element.scrollTop = V.top));
            }
          }
          ((Jo = !!Du), (Lu = Du = null));
        } finally {
          ((Ye = c), (H.p = s), (C.T = n));
        }
      }
      ((e.current = t), (ht = 2));
    }
  }
  function Fm() {
    if (ht === 2) {
      ht = 0;
      var e = Ma,
        t = cr,
        n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        ((n = C.T), (C.T = null));
        var s = H.p;
        H.p = 2;
        var c = Ye;
        Ye |= 4;
        try {
          _m(e, t.alternate, t);
        } finally {
          ((Ye = c), (H.p = s), (C.T = n));
        }
      }
      ht = 3;
    }
  }
  function Pm() {
    if (ht === 4 || ht === 3) {
      ((ht = 0), ke());
      var e = Ma,
        t = cr,
        n = ea,
        s = Dm;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (ht = 5)
        : ((ht = 0), (cr = Ma = null), Km(e, e.pendingLanes));
      var c = e.pendingLanes;
      if (
        (c === 0 && (Aa = null),
        Sn(n),
        (t = t.stateNode),
        Nt && typeof Nt.onCommitFiberRoot == "function")
      )
        try {
          Nt.onCommitFiberRoot(Wa, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (s !== null) {
        ((t = C.T), (c = H.p), (H.p = 2), (C.T = null));
        try {
          for (var u = e.onRecoverableError, m = 0; m < s.length; m++) {
            var v = s[m];
            u(v.value, { componentStack: v.stack });
          }
        } finally {
          ((C.T = t), (H.p = c));
        }
      }
      ((ea & 3) !== 0 && Ho(),
        On(e),
        (c = e.pendingLanes),
        (n & 261930) !== 0 && (c & 42) !== 0 ? (e === _u ? hs++ : ((hs = 0), (_u = e))) : (hs = 0),
        ms(0));
    }
  }
  function Km(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), Pr(t)));
  }
  function Ho() {
    return (Xm(), Fm(), Pm(), Im());
  }
  function Im() {
    if (ht !== 5) return !1;
    var e = Ma,
      t = bu;
    bu = 0;
    var n = Sn(ea),
      s = C.T,
      c = H.p;
    try {
      ((H.p = 32 > n ? 32 : n), (C.T = null), (n = Su), (Su = null));
      var u = Ma,
        m = ea;
      if (((ht = 0), (cr = Ma = null), (ea = 0), (Ye & 6) !== 0)) throw Error(o(331));
      var v = Ye;
      if (
        ((Ye |= 4),
        Om(u.current),
        Mm(u, u.current, m, n),
        (Ye = v),
        ms(0, !1),
        Nt && typeof Nt.onPostCommitFiberRoot == "function")
      )
        try {
          Nt.onPostCommitFiberRoot(Wa, u);
        } catch {}
      return !0;
    } finally {
      ((H.p = c), (C.T = s), Km(e, t));
    }
  }
  function Jm(e, t, n) {
    ((t = cn(n, t)),
      (t = Wc(e.stateNode, t, 2)),
      (e = _a(e, t, 2)),
      e !== null && (nt(e, 2), On(e)));
  }
  function Xe(e, t, n) {
    if (e.tag === 3) Jm(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Jm(t, e, n);
          break;
        } else if (t.tag === 1) {
          var s = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof s.componentDidCatch == "function" && (Aa === null || !Aa.has(s)))
          ) {
            ((e = cn(n, e)),
              (n = $h(2)),
              (s = _a(t, n, 2)),
              s !== null && (Wh(n, s, t, e), nt(s, 2), On(s)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Eu(e, t, n) {
    var s = e.pingCache;
    if (s === null) {
      s = e.pingCache = new Cv();
      var c = new Set();
      s.set(t, c);
    } else ((c = s.get(t)), c === void 0 && ((c = new Set()), s.set(t, c)));
    c.has(n) || ((gu = !0), c.add(n), (e = Dv.bind(null, e, t, n)), t.then(e, e));
  }
  function Dv(e, t, n) {
    var s = e.pingCache;
    (s !== null && s.delete(t),
      (e.pingedLanes |= e.suspendedLanes & n),
      (e.warmLanes &= ~n),
      Ie === e &&
        (ze & n) === n &&
        (it === 4 || (it === 3 && (ze & 62914560) === ze && 300 > Be() - zo)
          ? (Ye & 2) === 0 && ur(e, 0)
          : (yu |= n),
        lr === ze && (lr = 0)),
      On(e));
  }
  function $m(e, t) {
    (t === 0 && (t = Ct()), (e = si(e, t)), e !== null && (nt(e, t), On(e)));
  }
  function Lv(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), $m(e, n));
  }
  function jv(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var s = e.stateNode,
          c = e.memoizedState;
        c !== null && (n = c.retryLane);
        break;
      case 19:
        s = e.stateNode;
        break;
      case 22:
        s = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    (s !== null && s.delete(t), $m(e, n));
  }
  function Uv(e, t) {
    return En(e, t);
  }
  var qo = null,
    dr = null,
    Tu = !1,
    Vo = !1,
    Ru = !1,
    ka = 0;
  function On(e) {
    (e !== dr && e.next === null && (dr === null ? (qo = dr = e) : (dr = dr.next = e)),
      (Vo = !0),
      Tu || ((Tu = !0), Hv()));
  }
  function ms(e, t) {
    if (!Ru && Vo) {
      Ru = !0;
      do
        for (var n = !1, s = qo; s !== null; ) {
          if (e !== 0) {
            var c = s.pendingLanes;
            if (c === 0) var u = 0;
            else {
              var m = s.suspendedLanes,
                v = s.pingedLanes;
              ((u = (1 << (31 - Mt(42 | e) + 1)) - 1),
                (u &= c & ~(m & ~v)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
            }
            u !== 0 && ((n = !0), np(s, u));
          } else
            ((u = ze),
              (u = Se(
                s,
                s === Ie ? u : 0,
                s.cancelPendingCommit !== null || s.timeoutHandle !== -1,
              )),
              (u & 3) === 0 || et(s, u) || ((n = !0), np(s, u)));
          s = s.next;
        }
      while (n);
      Ru = !1;
    }
  }
  function Bv() {
    Wm();
  }
  function Wm() {
    Vo = Tu = !1;
    var e = 0;
    ka !== 0 && Kv() && (e = ka);
    for (var t = Be(), n = null, s = qo; s !== null; ) {
      var c = s.next,
        u = ep(s, t);
      (u === 0
        ? ((s.next = null), n === null ? (qo = c) : (n.next = c), c === null && (dr = n))
        : ((n = s), (e !== 0 || (u & 3) !== 0) && (Vo = !0)),
        (s = c));
    }
    ((ht !== 0 && ht !== 5) || ms(e), ka !== 0 && (ka = 0));
  }
  function ep(e, t) {
    for (
      var n = e.suspendedLanes,
        s = e.pingedLanes,
        c = e.expirationTimes,
        u = e.pendingLanes & -62914561;
      0 < u;
    ) {
      var m = 31 - Mt(u),
        v = 1 << m,
        w = c[m];
      (w === -1
        ? ((v & n) === 0 || (v & s) !== 0) && (c[m] = yt(v, t))
        : w <= t && (e.expiredLanes |= v),
        (u &= ~v));
    }
    if (
      ((t = Ie),
      (n = ze),
      (n = Se(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      (s = e.callbackNode),
      n === 0 || (e === t && (Qe === 2 || Qe === 9)) || e.cancelPendingCommit !== null)
    )
      return (s !== null && s !== null && ua(s), (e.callbackNode = null), (e.callbackPriority = 0));
    if ((n & 3) === 0 || et(e, n)) {
      if (((t = n & -n), t === e.callbackPriority)) return t;
      switch ((s !== null && ua(s), Sn(n))) {
        case 2:
        case 8:
          n = Ys;
          break;
        case 32:
          n = $a;
          break;
        case 268435456:
          n = Un;
          break;
        default:
          n = $a;
      }
      return (
        (s = tp.bind(null, e)), (n = En(n, s)), (e.callbackPriority = t), (e.callbackNode = n), t
      );
    }
    return (
      s !== null && s !== null && ua(s), (e.callbackPriority = 2), (e.callbackNode = null), 2
    );
  }
  function tp(e, t) {
    if (ht !== 0 && ht !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var n = e.callbackNode;
    if (Ho() && e.callbackNode !== n) return null;
    var s = ze;
    return (
      (s = Se(e, e === Ie ? s : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      s === 0
        ? null
        : (jm(e, s, t),
          ep(e, Be()),
          e.callbackNode != null && e.callbackNode === n ? tp.bind(null, e) : null)
    );
  }
  function np(e, t) {
    if (Ho()) return null;
    jm(e, t, !0);
  }
  function Hv() {
    Jv(function () {
      (Ye & 6) !== 0 ? En(Tn, Bv) : Wm();
    });
  }
  function Au() {
    if (ka === 0) {
      var e = Ji;
      (e === 0 && ((e = ki), (ki <<= 1), (ki & 261888) === 0 && (ki = 256)), (ka = e));
    }
    return ka;
  }
  function ap(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean"
      ? null
      : typeof e == "function"
        ? e
        : Ps("" + e);
  }
  function ip(e, t) {
    var n = t.ownerDocument.createElement("input");
    return (
      (n.name = t.name),
      (n.value = t.value),
      e.id && n.setAttribute("form", e.id),
      t.parentNode.insertBefore(n, t),
      (e = new FormData(e)),
      n.parentNode.removeChild(n),
      e
    );
  }
  function qv(e, t, n, s, c) {
    if (t === "submit" && n && n.stateNode === c) {
      var u = ap((c[Ht] || null).action),
        m = s.submitter;
      m &&
        ((t = (t = m[Ht] || null) ? ap(t.formAction) : m.getAttribute("formAction")),
        t !== null && ((u = t), (m = null)));
      var v = new $s("action", "action", null, s, c);
      e.push({
        event: v,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (s.defaultPrevented) {
                if (ka !== 0) {
                  var w = m ? ip(c, m) : new FormData(c);
                  Fc(n, { pending: !0, data: w, method: c.method, action: u }, null, w);
                }
              } else
                typeof u == "function" &&
                  (v.preventDefault(),
                  (w = m ? ip(c, m) : new FormData(c)),
                  Fc(n, { pending: !0, data: w, method: c.method, action: u }, u, w));
            },
            currentTarget: c,
          },
        ],
      });
    }
  }
  for (var Mu = 0; Mu < uc.length; Mu++) {
    var Cu = uc[Mu],
      Vv = Cu.toLowerCase(),
      Zv = Cu[0].toUpperCase() + Cu.slice(1);
    _n(Vv, "on" + Zv);
  }
  (_n(Ld, "onAnimationEnd"),
    _n(jd, "onAnimationIteration"),
    _n(Ud, "onAnimationStart"),
    _n("dblclick", "onDoubleClick"),
    _n("focusin", "onFocus"),
    _n("focusout", "onBlur"),
    _n(iv, "onTransitionRun"),
    _n(rv, "onTransitionStart"),
    _n(sv, "onTransitionCancel"),
    _n(Bd, "onTransitionEnd"),
    Ui("onMouseEnter", ["mouseout", "mouseover"]),
    Ui("onMouseLeave", ["mouseout", "mouseover"]),
    Ui("onPointerEnter", ["pointerout", "pointerover"]),
    Ui("onPointerLeave", ["pointerout", "pointerover"]),
    ni("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    ni(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    ni("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    ni("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    ni(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    ni(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var ps =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Yv = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ps),
    );
  function rp(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var s = e[n],
        c = s.event;
      s = s.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var m = s.length - 1; 0 <= m; m--) {
            var v = s[m],
              w = v.instance,
              z = v.currentTarget;
            if (((v = v.listener), w !== u && c.isPropagationStopped())) break e;
            ((u = v), (c.currentTarget = z));
            try {
              u(c);
            } catch (q) {
              to(q);
            }
            ((c.currentTarget = null), (u = w));
          }
        else
          for (m = 0; m < s.length; m++) {
            if (
              ((v = s[m]),
              (w = v.instance),
              (z = v.currentTarget),
              (v = v.listener),
              w !== u && c.isPropagationStopped())
            )
              break e;
            ((u = v), (c.currentTarget = z));
            try {
              u(c);
            } catch (q) {
              to(q);
            }
            ((c.currentTarget = null), (u = w));
          }
      }
    }
  }
  function Ne(e, t) {
    var n = t[Zl];
    n === void 0 && (n = t[Zl] = new Set());
    var s = e + "__bubble";
    n.has(s) || (sp(t, e, 2, !1), n.add(s));
  }
  function ku(e, t, n) {
    var s = 0;
    (t && (s |= 4), sp(n, e, s, t));
  }
  var Zo = "_reactListening" + Math.random().toString(36).slice(2);
  function Ou(e) {
    if (!e[Zo]) {
      ((e[Zo] = !0),
        Wf.forEach(function (n) {
          n !== "selectionchange" && (Yv.has(n) || ku(n, !1, e), ku(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Zo] || ((t[Zo] = !0), ku("selectionchange", !1, t));
    }
  }
  function sp(e, t, n, s) {
    switch (Lp(t)) {
      case 2:
        var c = yb;
        break;
      case 8:
        c = vb;
        break;
      default:
        c = Xu;
    }
    ((n = c.bind(null, t, n, e)),
      (c = void 0),
      !Jl || (t !== "touchstart" && t !== "touchmove" && t !== "wheel") || (c = !0),
      s
        ? c !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: c })
          : e.addEventListener(t, n, !0)
        : c !== void 0
          ? e.addEventListener(t, n, { passive: c })
          : e.addEventListener(t, n, !1));
  }
  function Nu(e, t, n, s, c) {
    var u = s;
    if ((t & 1) === 0 && (t & 2) === 0 && s !== null)
      e: for (;;) {
        if (s === null) return;
        var m = s.tag;
        if (m === 3 || m === 4) {
          var v = s.stateNode.containerInfo;
          if (v === c) break;
          if (m === 4)
            for (m = s.return; m !== null; ) {
              var w = m.tag;
              if ((w === 3 || w === 4) && m.stateNode.containerInfo === c) return;
              m = m.return;
            }
          for (; v !== null; ) {
            if (((m = Di(v)), m === null)) return;
            if (((w = m.tag), w === 5 || w === 6 || w === 26 || w === 27)) {
              s = u = m;
              continue e;
            }
            v = v.parentNode;
          }
        }
        s = s.return;
      }
    fd(function () {
      var z = u,
        q = Kl(n),
        Y = [];
      e: {
        var D = Hd.get(e);
        if (D !== void 0) {
          var j = $s,
            oe = e;
          switch (e) {
            case "keypress":
              if (Is(n) === 0) break e;
            case "keydown":
            case "keyup":
              j = jy;
              break;
            case "focusin":
              ((oe = "focus"), (j = tc));
              break;
            case "focusout":
              ((oe = "blur"), (j = tc));
              break;
            case "beforeblur":
            case "afterblur":
              j = tc;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              j = md;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              j = Ey;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              j = Hy;
              break;
            case Ld:
            case jd:
            case Ud:
              j = Ay;
              break;
            case Bd:
              j = Vy;
              break;
            case "scroll":
            case "scrollend":
              j = xy;
              break;
            case "wheel":
              j = Yy;
              break;
            case "copy":
            case "cut":
            case "paste":
              j = Cy;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              j = gd;
              break;
            case "toggle":
            case "beforetoggle":
              j = Qy;
          }
          var ye = (t & 4) !== 0,
            Ke = !ye && (e === "scroll" || e === "scrollend"),
            O = ye ? (D !== null ? D + "Capture" : null) : D;
          ye = [];
          for (var M = z, N; M !== null; ) {
            var V = M;
            if (
              ((N = V.stateNode),
              (V = V.tag),
              (V !== 5 && V !== 26 && V !== 27) ||
                N === null ||
                O === null ||
                ((V = Ur(M, O)), V != null && ye.push(gs(M, V, N))),
              Ke)
            )
              break;
            M = M.return;
          }
          0 < ye.length && ((D = new j(D, oe, null, n, q)), Y.push({ event: D, listeners: ye }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((D = e === "mouseover" || e === "pointerover"),
            (j = e === "mouseout" || e === "pointerout"),
            D && n !== Pl && (oe = n.relatedTarget || n.fromElement) && (Di(oe) || oe[zi]))
          )
            break e;
          if (
            (j || D) &&
            ((D =
              q.window === q
                ? q
                : (D = q.ownerDocument)
                  ? D.defaultView || D.parentWindow
                  : window),
            j
              ? ((oe = n.relatedTarget || n.toElement),
                (j = z),
                (oe = oe ? Di(oe) : null),
                oe !== null &&
                  ((Ke = f(oe)), (ye = oe.tag), oe !== Ke || (ye !== 5 && ye !== 27 && ye !== 6)) &&
                  (oe = null))
              : ((j = null), (oe = z)),
            j !== oe)
          ) {
            if (
              ((ye = md),
              (V = "onMouseLeave"),
              (O = "onMouseEnter"),
              (M = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((ye = gd), (V = "onPointerLeave"), (O = "onPointerEnter"), (M = "pointer")),
              (Ke = j == null ? D : jr(j)),
              (N = oe == null ? D : jr(oe)),
              (D = new ye(V, M + "leave", j, n, q)),
              (D.target = Ke),
              (D.relatedTarget = N),
              (V = null),
              Di(q) === z &&
                ((ye = new ye(O, M + "enter", oe, n, q)),
                (ye.target = N),
                (ye.relatedTarget = Ke),
                (V = ye)),
              (Ke = V),
              j && oe)
            )
              t: {
                for (ye = Gv, O = j, M = oe, N = 0, V = O; V; V = ye(V)) N++;
                V = 0;
                for (var me = M; me; me = ye(me)) V++;
                for (; 0 < N - V; ) ((O = ye(O)), N--);
                for (; 0 < V - N; ) ((M = ye(M)), V--);
                for (; N--; ) {
                  if (O === M || (M !== null && O === M.alternate)) {
                    ye = O;
                    break t;
                  }
                  ((O = ye(O)), (M = ye(M)));
                }
                ye = null;
              }
            else ye = null;
            (j !== null && op(Y, D, j, ye, !1),
              oe !== null && Ke !== null && op(Y, Ke, oe, ye, !0));
          }
        }
        e: {
          if (
            ((D = z ? jr(z) : window),
            (j = D.nodeName && D.nodeName.toLowerCase()),
            j === "select" || (j === "input" && D.type === "file"))
          )
            var qe = Ed;
          else if (xd(D))
            if (Td) qe = tv;
            else {
              qe = Wy;
              var fe = $y;
            }
          else
            ((j = D.nodeName),
              !j || j.toLowerCase() !== "input" || (D.type !== "checkbox" && D.type !== "radio")
                ? z && Fl(z.elementType) && (qe = Ed)
                : (qe = ev));
          if (qe && (qe = qe(e, z))) {
            wd(Y, qe, n, q);
            break e;
          }
          (fe && fe(e, D, z),
            e === "focusout" &&
              z &&
              D.type === "number" &&
              z.memoizedProps.value != null &&
              Xl(D, "number", D.value));
        }
        switch (((fe = z ? jr(z) : window), e)) {
          case "focusin":
            (xd(fe) || fe.contentEditable === "true") && ((Yi = fe), (oc = z), (Qr = null));
            break;
          case "focusout":
            Qr = oc = Yi = null;
            break;
          case "mousedown":
            lc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((lc = !1), zd(Y, n, q));
            break;
          case "selectionchange":
            if (av) break;
          case "keydown":
          case "keyup":
            zd(Y, n, q);
        }
        var Ae;
        if (ac)
          e: {
            switch (e) {
              case "compositionstart":
                var De = "onCompositionStart";
                break e;
              case "compositionend":
                De = "onCompositionEnd";
                break e;
              case "compositionupdate":
                De = "onCompositionUpdate";
                break e;
            }
            De = void 0;
          }
        else
          Zi
            ? Sd(e, n) && (De = "onCompositionEnd")
            : e === "keydown" && n.keyCode === 229 && (De = "onCompositionStart");
        (De &&
          (yd &&
            n.locale !== "ko" &&
            (Zi || De !== "onCompositionStart"
              ? De === "onCompositionEnd" && Zi && (Ae = dd())
              : ((ma = q), ($l = "value" in ma ? ma.value : ma.textContent), (Zi = !0))),
          (fe = Yo(z, De)),
          0 < fe.length &&
            ((De = new pd(De, e, null, n, q)),
            Y.push({ event: De, listeners: fe }),
            Ae ? (De.data = Ae) : ((Ae = _d(n)), Ae !== null && (De.data = Ae)))),
          (Ae = Fy ? Py(e, n) : Ky(e, n)) &&
            ((De = Yo(z, "onBeforeInput")),
            0 < De.length &&
              ((fe = new pd("onBeforeInput", "beforeinput", null, n, q)),
              Y.push({ event: fe, listeners: De }),
              (fe.data = Ae))),
          qv(Y, e, z, n, q));
      }
      rp(Y, t);
    });
  }
  function gs(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Yo(e, t) {
    for (var n = t + "Capture", s = []; e !== null; ) {
      var c = e,
        u = c.stateNode;
      if (
        ((c = c.tag),
        (c !== 5 && c !== 26 && c !== 27) ||
          u === null ||
          ((c = Ur(e, n)),
          c != null && s.unshift(gs(e, c, u)),
          (c = Ur(e, t)),
          c != null && s.push(gs(e, c, u))),
        e.tag === 3)
      )
        return s;
      e = e.return;
    }
    return [];
  }
  function Gv(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function op(e, t, n, s, c) {
    for (var u = t._reactName, m = []; n !== null && n !== s; ) {
      var v = n,
        w = v.alternate,
        z = v.stateNode;
      if (((v = v.tag), w !== null && w === s)) break;
      ((v !== 5 && v !== 26 && v !== 27) ||
        z === null ||
        ((w = z),
        c
          ? ((z = Ur(n, u)), z != null && m.unshift(gs(n, z, w)))
          : c || ((z = Ur(n, u)), z != null && m.push(gs(n, z, w)))),
        (n = n.return));
    }
    m.length !== 0 && e.push({ event: t, listeners: m });
  }
  var Qv = /\r\n?/g,
    Xv = /\u0000|\uFFFD/g;
  function lp(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Qv,
        `
`,
      )
      .replace(Xv, "");
  }
  function cp(e, t) {
    return ((t = lp(t)), lp(e) === t);
  }
  function Pe(e, t, n, s, c, u) {
    switch (n) {
      case "children":
        typeof s == "string"
          ? t === "body" || (t === "textarea" && s === "") || Hi(e, s)
          : (typeof s == "number" || typeof s == "bigint") && t !== "body" && Hi(e, "" + s);
        break;
      case "className":
        Xs(e, "class", s);
        break;
      case "tabIndex":
        Xs(e, "tabindex", s);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Xs(e, n, s);
        break;
      case "style":
        cd(e, s, u);
        break;
      case "data":
        if (t !== "object") {
          Xs(e, "data", s);
          break;
        }
      case "src":
      case "href":
        if (s === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (s == null || typeof s == "function" || typeof s == "symbol" || typeof s == "boolean") {
          e.removeAttribute(n);
          break;
        }
        ((s = Ps("" + s)), e.setAttribute(n, s));
        break;
      case "action":
      case "formAction":
        if (typeof s == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof u == "function" &&
            (n === "formAction"
              ? (t !== "input" && Pe(e, t, "name", c.name, c, null),
                Pe(e, t, "formEncType", c.formEncType, c, null),
                Pe(e, t, "formMethod", c.formMethod, c, null),
                Pe(e, t, "formTarget", c.formTarget, c, null))
              : (Pe(e, t, "encType", c.encType, c, null),
                Pe(e, t, "method", c.method, c, null),
                Pe(e, t, "target", c.target, c, null)));
        if (s == null || typeof s == "symbol" || typeof s == "boolean") {
          e.removeAttribute(n);
          break;
        }
        ((s = Ps("" + s)), e.setAttribute(n, s));
        break;
      case "onClick":
        s != null && (e.onclick = Hn);
        break;
      case "onScroll":
        s != null && Ne("scroll", e);
        break;
      case "onScrollEnd":
        s != null && Ne("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s)) throw Error(o(61));
          if (((n = s.__html), n != null)) {
            if (c.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = s && typeof s != "function" && typeof s != "symbol";
        break;
      case "muted":
        e.muted = s && typeof s != "function" && typeof s != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (s == null || typeof s == "function" || typeof s == "boolean" || typeof s == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        ((n = Ps("" + s)), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        s != null && typeof s != "function" && typeof s != "symbol"
          ? e.setAttribute(n, "" + s)
          : e.removeAttribute(n);
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
        s && typeof s != "function" && typeof s != "symbol"
          ? e.setAttribute(n, "")
          : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        s === !0
          ? e.setAttribute(n, "")
          : s !== !1 && s != null && typeof s != "function" && typeof s != "symbol"
            ? e.setAttribute(n, s)
            : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s
          ? e.setAttribute(n, s)
          : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s)
          ? e.removeAttribute(n)
          : e.setAttribute(n, s);
        break;
      case "popover":
        (Ne("beforetoggle", e), Ne("toggle", e), Qs(e, "popover", s));
        break;
      case "xlinkActuate":
        Bn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", s);
        break;
      case "xlinkArcrole":
        Bn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", s);
        break;
      case "xlinkRole":
        Bn(e, "http://www.w3.org/1999/xlink", "xlink:role", s);
        break;
      case "xlinkShow":
        Bn(e, "http://www.w3.org/1999/xlink", "xlink:show", s);
        break;
      case "xlinkTitle":
        Bn(e, "http://www.w3.org/1999/xlink", "xlink:title", s);
        break;
      case "xlinkType":
        Bn(e, "http://www.w3.org/1999/xlink", "xlink:type", s);
        break;
      case "xmlBase":
        Bn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", s);
        break;
      case "xmlLang":
        Bn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", s);
        break;
      case "xmlSpace":
        Bn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", s);
        break;
      case "is":
        Qs(e, "is", s);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || (n[0] !== "o" && n[0] !== "O") || (n[1] !== "n" && n[1] !== "N")) &&
          ((n = Sy.get(n) || n), Qs(e, n, s));
    }
  }
  function zu(e, t, n, s, c, u) {
    switch (n) {
      case "style":
        cd(e, s, u);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s)) throw Error(o(61));
          if (((n = s.__html), n != null)) {
            if (c.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof s == "string"
          ? Hi(e, s)
          : (typeof s == "number" || typeof s == "bigint") && Hi(e, "" + s);
        break;
      case "onScroll":
        s != null && Ne("scroll", e);
        break;
      case "onScrollEnd":
        s != null && Ne("scrollend", e);
        break;
      case "onClick":
        s != null && (e.onclick = Hn);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!ed.hasOwnProperty(n))
          e: {
            if (
              n[0] === "o" &&
              n[1] === "n" &&
              ((c = n.endsWith("Capture")),
              (t = n.slice(2, c ? n.length - 7 : void 0)),
              (u = e[Ht] || null),
              (u = u != null ? u[n] : null),
              typeof u == "function" && e.removeEventListener(t, u, c),
              typeof s == "function")
            ) {
              (typeof u != "function" &&
                u !== null &&
                (n in e ? (e[n] = null) : e.hasAttribute(n) && e.removeAttribute(n)),
                e.addEventListener(t, s, c));
              break e;
            }
            n in e ? (e[n] = s) : s === !0 ? e.setAttribute(n, "") : Qs(e, n, s);
          }
    }
  }
  function Rt(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (Ne("error", e), Ne("load", e));
        var s = !1,
          c = !1,
          u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var m = n[u];
            if (m != null)
              switch (u) {
                case "src":
                  s = !0;
                  break;
                case "srcSet":
                  c = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Pe(e, t, u, m, n, null);
              }
          }
        (c && Pe(e, t, "srcSet", n.srcSet, n, null), s && Pe(e, t, "src", n.src, n, null));
        return;
      case "input":
        Ne("invalid", e);
        var v = (u = m = c = null),
          w = null,
          z = null;
        for (s in n)
          if (n.hasOwnProperty(s)) {
            var q = n[s];
            if (q != null)
              switch (s) {
                case "name":
                  c = q;
                  break;
                case "type":
                  m = q;
                  break;
                case "checked":
                  w = q;
                  break;
                case "defaultChecked":
                  z = q;
                  break;
                case "value":
                  u = q;
                  break;
                case "defaultValue":
                  v = q;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (q != null) throw Error(o(137, t));
                  break;
                default:
                  Pe(e, t, s, q, n, null);
              }
          }
        rd(e, u, v, w, z, m, c, !1);
        return;
      case "select":
        (Ne("invalid", e), (s = m = u = null));
        for (c in n)
          if (n.hasOwnProperty(c) && ((v = n[c]), v != null))
            switch (c) {
              case "value":
                u = v;
                break;
              case "defaultValue":
                m = v;
                break;
              case "multiple":
                s = v;
              default:
                Pe(e, t, c, v, n, null);
            }
        ((t = u),
          (n = m),
          (e.multiple = !!s),
          t != null ? Bi(e, !!s, t, !1) : n != null && Bi(e, !!s, n, !0));
        return;
      case "textarea":
        (Ne("invalid", e), (u = c = s = null));
        for (m in n)
          if (n.hasOwnProperty(m) && ((v = n[m]), v != null))
            switch (m) {
              case "value":
                s = v;
                break;
              case "defaultValue":
                c = v;
                break;
              case "children":
                u = v;
                break;
              case "dangerouslySetInnerHTML":
                if (v != null) throw Error(o(91));
                break;
              default:
                Pe(e, t, m, v, n, null);
            }
        od(e, s, c, u);
        return;
      case "option":
        for (w in n)
          if (n.hasOwnProperty(w) && ((s = n[w]), s != null))
            switch (w) {
              case "selected":
                e.selected = s && typeof s != "function" && typeof s != "symbol";
                break;
              default:
                Pe(e, t, w, s, n, null);
            }
        return;
      case "dialog":
        (Ne("beforetoggle", e), Ne("toggle", e), Ne("cancel", e), Ne("close", e));
        break;
      case "iframe":
      case "object":
        Ne("load", e);
        break;
      case "video":
      case "audio":
        for (s = 0; s < ps.length; s++) Ne(ps[s], e);
        break;
      case "image":
        (Ne("error", e), Ne("load", e));
        break;
      case "details":
        Ne("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        (Ne("error", e), Ne("load", e));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (z in n)
          if (n.hasOwnProperty(z) && ((s = n[z]), s != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Pe(e, t, z, s, n, null);
            }
        return;
      default:
        if (Fl(t)) {
          for (q in n)
            n.hasOwnProperty(q) && ((s = n[q]), s !== void 0 && zu(e, t, q, s, n, void 0));
          return;
        }
    }
    for (v in n) n.hasOwnProperty(v) && ((s = n[v]), s != null && Pe(e, t, v, s, n, null));
  }
  function Fv(e, t, n, s) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var c = null,
          u = null,
          m = null,
          v = null,
          w = null,
          z = null,
          q = null;
        for (j in n) {
          var Y = n[j];
          if (n.hasOwnProperty(j) && Y != null)
            switch (j) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                w = Y;
              default:
                s.hasOwnProperty(j) || Pe(e, t, j, null, s, Y);
            }
        }
        for (var D in s) {
          var j = s[D];
          if (((Y = n[D]), s.hasOwnProperty(D) && (j != null || Y != null)))
            switch (D) {
              case "type":
                u = j;
                break;
              case "name":
                c = j;
                break;
              case "checked":
                z = j;
                break;
              case "defaultChecked":
                q = j;
                break;
              case "value":
                m = j;
                break;
              case "defaultValue":
                v = j;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (j != null) throw Error(o(137, t));
                break;
              default:
                j !== Y && Pe(e, t, D, j, s, Y);
            }
        }
        Ql(e, m, v, w, z, q, u, c);
        return;
      case "select":
        j = m = v = D = null;
        for (u in n)
          if (((w = n[u]), n.hasOwnProperty(u) && w != null))
            switch (u) {
              case "value":
                break;
              case "multiple":
                j = w;
              default:
                s.hasOwnProperty(u) || Pe(e, t, u, null, s, w);
            }
        for (c in s)
          if (((u = s[c]), (w = n[c]), s.hasOwnProperty(c) && (u != null || w != null)))
            switch (c) {
              case "value":
                D = u;
                break;
              case "defaultValue":
                v = u;
                break;
              case "multiple":
                m = u;
              default:
                u !== w && Pe(e, t, c, u, s, w);
            }
        ((t = v),
          (n = m),
          (s = j),
          D != null
            ? Bi(e, !!n, D, !1)
            : !!s != !!n && (t != null ? Bi(e, !!n, t, !0) : Bi(e, !!n, n ? [] : "", !1)));
        return;
      case "textarea":
        j = D = null;
        for (v in n)
          if (((c = n[v]), n.hasOwnProperty(v) && c != null && !s.hasOwnProperty(v)))
            switch (v) {
              case "value":
                break;
              case "children":
                break;
              default:
                Pe(e, t, v, null, s, c);
            }
        for (m in s)
          if (((c = s[m]), (u = n[m]), s.hasOwnProperty(m) && (c != null || u != null)))
            switch (m) {
              case "value":
                D = c;
                break;
              case "defaultValue":
                j = c;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(o(91));
                break;
              default:
                c !== u && Pe(e, t, m, c, s, u);
            }
        sd(e, D, j);
        return;
      case "option":
        for (var oe in n)
          if (((D = n[oe]), n.hasOwnProperty(oe) && D != null && !s.hasOwnProperty(oe)))
            switch (oe) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Pe(e, t, oe, null, s, D);
            }
        for (w in s)
          if (((D = s[w]), (j = n[w]), s.hasOwnProperty(w) && D !== j && (D != null || j != null)))
            switch (w) {
              case "selected":
                e.selected = D && typeof D != "function" && typeof D != "symbol";
                break;
              default:
                Pe(e, t, w, D, s, j);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ye in n)
          ((D = n[ye]),
            n.hasOwnProperty(ye) && D != null && !s.hasOwnProperty(ye) && Pe(e, t, ye, null, s, D));
        for (z in s)
          if (((D = s[z]), (j = n[z]), s.hasOwnProperty(z) && D !== j && (D != null || j != null)))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null) throw Error(o(137, t));
                break;
              default:
                Pe(e, t, z, D, s, j);
            }
        return;
      default:
        if (Fl(t)) {
          for (var Ke in n)
            ((D = n[Ke]),
              n.hasOwnProperty(Ke) &&
                D !== void 0 &&
                !s.hasOwnProperty(Ke) &&
                zu(e, t, Ke, void 0, s, D));
          for (q in s)
            ((D = s[q]),
              (j = n[q]),
              !s.hasOwnProperty(q) ||
                D === j ||
                (D === void 0 && j === void 0) ||
                zu(e, t, q, D, s, j));
          return;
        }
    }
    for (var O in n)
      ((D = n[O]),
        n.hasOwnProperty(O) && D != null && !s.hasOwnProperty(O) && Pe(e, t, O, null, s, D));
    for (Y in s)
      ((D = s[Y]),
        (j = n[Y]),
        !s.hasOwnProperty(Y) || D === j || (D == null && j == null) || Pe(e, t, Y, D, s, j));
  }
  function up(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Pv() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var e = 0, t = 0, n = performance.getEntriesByType("resource"), s = 0;
        s < n.length;
        s++
      ) {
        var c = n[s],
          u = c.transferSize,
          m = c.initiatorType,
          v = c.duration;
        if (u && v && up(m)) {
          for (m = 0, v = c.responseEnd, s += 1; s < n.length; s++) {
            var w = n[s],
              z = w.startTime;
            if (z > v) break;
            var q = w.transferSize,
              Y = w.initiatorType;
            q && up(Y) && ((w = w.responseEnd), (m += q * (w < v ? 1 : (v - z) / (w - z))));
          }
          if ((--s, (t += (8 * (u + m)) / (c.duration / 1e3)), e++, 10 < e)) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && ((e = navigator.connection.downlink), typeof e == "number")
      ? e
      : 5;
  }
  var Du = null,
    Lu = null;
  function Go(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function fp(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function dp(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function ju(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      typeof t.children == "bigint" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Uu = null;
  function Kv() {
    var e = window.event;
    return e && e.type === "popstate" ? (e === Uu ? !1 : ((Uu = e), !0)) : ((Uu = null), !1);
  }
  var hp = typeof setTimeout == "function" ? setTimeout : void 0,
    Iv = typeof clearTimeout == "function" ? clearTimeout : void 0,
    mp = typeof Promise == "function" ? Promise : void 0,
    Jv =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof mp < "u"
          ? function (e) {
              return mp.resolve(null).then(e).catch($v);
            }
          : hp;
  function $v(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Oa(e) {
    return e === "head";
  }
  function pp(e, t) {
    var n = t,
      s = 0;
    do {
      var c = n.nextSibling;
      if ((e.removeChild(n), c && c.nodeType === 8))
        if (((n = c.data), n === "/$" || n === "/&")) {
          if (s === 0) {
            (e.removeChild(c), gr(t));
            return;
          }
          s--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") s++;
        else if (n === "html") ys(e.ownerDocument.documentElement);
        else if (n === "head") {
          ((n = e.ownerDocument.head), ys(n));
          for (var u = n.firstChild; u; ) {
            var m = u.nextSibling,
              v = u.nodeName;
            (u[Lr] ||
              v === "SCRIPT" ||
              v === "STYLE" ||
              (v === "LINK" && u.rel.toLowerCase() === "stylesheet") ||
              n.removeChild(u),
              (u = m));
          }
        } else n === "body" && ys(e.ownerDocument.body);
      n = c;
    } while (n);
    gr(t);
  }
  function gp(e, t) {
    var n = e;
    e = 0;
    do {
      var s = n.nextSibling;
      if (
        (n.nodeType === 1
          ? t
            ? ((n._stashedDisplay = n.style.display), (n.style.display = "none"))
            : ((n.style.display = n._stashedDisplay || ""),
              n.getAttribute("style") === "" && n.removeAttribute("style"))
          : n.nodeType === 3 &&
            (t
              ? ((n._stashedText = n.nodeValue), (n.nodeValue = ""))
              : (n.nodeValue = n._stashedText || "")),
        s && s.nodeType === 8)
      )
        if (((n = s.data), n === "/$")) {
          if (e === 0) break;
          e--;
        } else (n !== "$" && n !== "$?" && n !== "$~" && n !== "$!") || e++;
      n = s;
    } while (n);
  }
  function Bu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (((t = t.nextSibling), n.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (Bu(n), Yl(n));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function Wv(e, t, n, s) {
    for (; e.nodeType === 1; ) {
      var c = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!s && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (s) {
        if (!e[Lr])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (
                ((u = e.getAttribute("rel")),
                u === "stylesheet" && e.hasAttribute("data-precedence"))
              )
                break;
              if (
                u !== c.rel ||
                e.getAttribute("href") !== (c.href == null || c.href === "" ? null : c.href) ||
                e.getAttribute("crossorigin") !== (c.crossOrigin == null ? null : c.crossOrigin) ||
                e.getAttribute("title") !== (c.title == null ? null : c.title)
              )
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (
                ((u = e.getAttribute("src")),
                (u !== (c.src == null ? null : c.src) ||
                  e.getAttribute("type") !== (c.type == null ? null : c.type) ||
                  e.getAttribute("crossorigin") !==
                    (c.crossOrigin == null ? null : c.crossOrigin)) &&
                  u &&
                  e.hasAttribute("async") &&
                  !e.hasAttribute("itemprop"))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = c.name == null ? null : "" + c.name;
        if (c.type === "hidden" && e.getAttribute("name") === u) return e;
      } else return e;
      if (((e = mn(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function eb(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n) ||
        ((e = mn(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function yp(e, t) {
    for (; e.nodeType !== 8; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t) ||
        ((e = mn(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Hu(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function qu(e) {
    return e.data === "$!" || (e.data === "$?" && e.ownerDocument.readyState !== "loading");
  }
  function tb(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading") t();
    else {
      var s = function () {
        (t(), n.removeEventListener("DOMContentLoaded", s));
      };
      (n.addEventListener("DOMContentLoaded", s), (e._reactRetry = s));
    }
  }
  function mn(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = e.data),
          t === "$" ||
            t === "$!" ||
            t === "$?" ||
            t === "$~" ||
            t === "&" ||
            t === "F!" ||
            t === "F")
        )
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var Vu = null;
  function vp(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0) return mn(e.nextSibling);
          t--;
        } else (n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&") || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function bp(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (t === 0) return e;
          t--;
        } else (n !== "/$" && n !== "/&") || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Sp(e, t, n) {
    switch (((t = Go(n)), e)) {
      case "html":
        if (((e = t.documentElement), !e)) throw Error(o(452));
        return e;
      case "head":
        if (((e = t.head), !e)) throw Error(o(453));
        return e;
      case "body":
        if (((e = t.body), !e)) throw Error(o(454));
        return e;
      default:
        throw Error(o(451));
    }
  }
  function ys(e) {
    for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
    Yl(e);
  }
  var pn = new Map(),
    _p = new Set();
  function Qo(e) {
    return typeof e.getRootNode == "function"
      ? e.getRootNode()
      : e.nodeType === 9
        ? e
        : e.ownerDocument;
  }
  var ta = H.d;
  H.d = { f: nb, r: ab, D: ib, C: rb, L: sb, m: ob, X: cb, S: lb, M: ub };
  function nb() {
    var e = ta.f(),
      t = jo();
    return e || t;
  }
  function ab(e) {
    var t = Li(e);
    t !== null && t.tag === 5 && t.type === "form" ? Bh(t) : ta.r(e);
  }
  var hr = typeof document > "u" ? null : document;
  function xp(e, t, n) {
    var s = hr;
    if (s && typeof t == "string" && t) {
      var c = on(t);
      ((c = 'link[rel="' + e + '"][href="' + c + '"]'),
        typeof n == "string" && (c += '[crossorigin="' + n + '"]'),
        _p.has(c) ||
          (_p.add(c),
          (e = { rel: e, crossOrigin: n, href: t }),
          s.querySelector(c) === null &&
            ((t = s.createElement("link")), Rt(t, "link", e), vt(t), s.head.appendChild(t))));
    }
  }
  function ib(e) {
    (ta.D(e), xp("dns-prefetch", e, null));
  }
  function rb(e, t) {
    (ta.C(e, t), xp("preconnect", e, t));
  }
  function sb(e, t, n) {
    ta.L(e, t, n);
    var s = hr;
    if (s && e && t) {
      var c = 'link[rel="preload"][as="' + on(t) + '"]';
      t === "image" && n && n.imageSrcSet
        ? ((c += '[imagesrcset="' + on(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == "string" && (c += '[imagesizes="' + on(n.imageSizes) + '"]'))
        : (c += '[href="' + on(e) + '"]');
      var u = c;
      switch (t) {
        case "style":
          u = mr(e);
          break;
        case "script":
          u = pr(e);
      }
      pn.has(u) ||
        ((e = g(
          { rel: "preload", href: t === "image" && n && n.imageSrcSet ? void 0 : e, as: t },
          n,
        )),
        pn.set(u, e),
        s.querySelector(c) !== null ||
          (t === "style" && s.querySelector(vs(u))) ||
          (t === "script" && s.querySelector(bs(u))) ||
          ((t = s.createElement("link")), Rt(t, "link", e), vt(t), s.head.appendChild(t)));
    }
  }
  function ob(e, t) {
    ta.m(e, t);
    var n = hr;
    if (n && e) {
      var s = t && typeof t.as == "string" ? t.as : "script",
        c = 'link[rel="modulepreload"][as="' + on(s) + '"][href="' + on(e) + '"]',
        u = c;
      switch (s) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = pr(e);
      }
      if (
        !pn.has(u) &&
        ((e = g({ rel: "modulepreload", href: e }, t)), pn.set(u, e), n.querySelector(c) === null)
      ) {
        switch (s) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(bs(u))) return;
        }
        ((s = n.createElement("link")), Rt(s, "link", e), vt(s), n.head.appendChild(s));
      }
    }
  }
  function lb(e, t, n) {
    ta.S(e, t, n);
    var s = hr;
    if (s && e) {
      var c = ji(s).hoistableStyles,
        u = mr(e);
      t = t || "default";
      var m = c.get(u);
      if (!m) {
        var v = { loading: 0, preload: null };
        if ((m = s.querySelector(vs(u)))) v.loading = 5;
        else {
          ((e = g({ rel: "stylesheet", href: e, "data-precedence": t }, n)),
            (n = pn.get(u)) && Zu(e, n));
          var w = (m = s.createElement("link"));
          (vt(w),
            Rt(w, "link", e),
            (w._p = new Promise(function (z, q) {
              ((w.onload = z), (w.onerror = q));
            })),
            w.addEventListener("load", function () {
              v.loading |= 1;
            }),
            w.addEventListener("error", function () {
              v.loading |= 2;
            }),
            (v.loading |= 4),
            Xo(m, t, s));
        }
        ((m = { type: "stylesheet", instance: m, count: 1, state: v }), c.set(u, m));
      }
    }
  }
  function cb(e, t) {
    ta.X(e, t);
    var n = hr;
    if (n && e) {
      var s = ji(n).hoistableScripts,
        c = pr(e),
        u = s.get(c);
      u ||
        ((u = n.querySelector(bs(c))),
        u ||
          ((e = g({ src: e, async: !0 }, t)),
          (t = pn.get(c)) && Yu(e, t),
          (u = n.createElement("script")),
          vt(u),
          Rt(u, "link", e),
          n.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        s.set(c, u));
    }
  }
  function ub(e, t) {
    ta.M(e, t);
    var n = hr;
    if (n && e) {
      var s = ji(n).hoistableScripts,
        c = pr(e),
        u = s.get(c);
      u ||
        ((u = n.querySelector(bs(c))),
        u ||
          ((e = g({ src: e, async: !0, type: "module" }, t)),
          (t = pn.get(c)) && Yu(e, t),
          (u = n.createElement("script")),
          vt(u),
          Rt(u, "link", e),
          n.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        s.set(c, u));
    }
  }
  function wp(e, t, n, s) {
    var c = (c = de.current) ? Qo(c) : null;
    if (!c) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string"
          ? ((t = mr(n.href)),
            (n = ji(c).hoistableStyles),
            (s = n.get(t)),
            s || ((s = { type: "style", instance: null, count: 0, state: null }), n.set(t, s)),
            s)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          n.rel === "stylesheet" &&
          typeof n.href == "string" &&
          typeof n.precedence == "string"
        ) {
          e = mr(n.href);
          var u = ji(c).hoistableStyles,
            m = u.get(e);
          if (
            (m ||
              ((c = c.ownerDocument || c),
              (m = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              u.set(e, m),
              (u = c.querySelector(vs(e))) && !u._p && ((m.instance = u), (m.state.loading = 5)),
              pn.has(e) ||
                ((n = {
                  rel: "preload",
                  as: "style",
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                pn.set(e, n),
                u || fb(c, e, n, m.state))),
            t && s === null)
          )
            throw Error(o(528, ""));
          return m;
        }
        if (t && s !== null) throw Error(o(529, ""));
        return null;
      case "script":
        return (
          (t = n.async),
          (n = n.src),
          typeof n == "string" && t && typeof t != "function" && typeof t != "symbol"
            ? ((t = pr(n)),
              (n = ji(c).hoistableScripts),
              (s = n.get(t)),
              s || ((s = { type: "script", instance: null, count: 0, state: null }), n.set(t, s)),
              s)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(o(444, e));
    }
  }
  function mr(e) {
    return 'href="' + on(e) + '"';
  }
  function vs(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Ep(e) {
    return g({}, e, { "data-precedence": e.precedence, precedence: null });
  }
  function fb(e, t, n, s) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]")
      ? (s.loading = 1)
      : ((t = e.createElement("link")),
        (s.preload = t),
        t.addEventListener("load", function () {
          return (s.loading |= 1);
        }),
        t.addEventListener("error", function () {
          return (s.loading |= 2);
        }),
        Rt(t, "link", n),
        vt(t),
        e.head.appendChild(t));
  }
  function pr(e) {
    return '[src="' + on(e) + '"]';
  }
  function bs(e) {
    return "script[async]" + e;
  }
  function Tp(e, t, n) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var s = e.querySelector('style[data-href~="' + on(n.href) + '"]');
          if (s) return ((t.instance = s), vt(s), s);
          var c = g({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null,
          });
          return (
            (s = (e.ownerDocument || e).createElement("style")),
            vt(s),
            Rt(s, "style", c),
            Xo(s, n.precedence, e),
            (t.instance = s)
          );
        case "stylesheet":
          c = mr(n.href);
          var u = e.querySelector(vs(c));
          if (u) return ((t.state.loading |= 4), (t.instance = u), vt(u), u);
          ((s = Ep(n)),
            (c = pn.get(c)) && Zu(s, c),
            (u = (e.ownerDocument || e).createElement("link")),
            vt(u));
          var m = u;
          return (
            (m._p = new Promise(function (v, w) {
              ((m.onload = v), (m.onerror = w));
            })),
            Rt(u, "link", s),
            (t.state.loading |= 4),
            Xo(u, n.precedence, e),
            (t.instance = u)
          );
        case "script":
          return (
            (u = pr(n.src)),
            (c = e.querySelector(bs(u)))
              ? ((t.instance = c), vt(c), c)
              : ((s = n),
                (c = pn.get(u)) && ((s = g({}, n)), Yu(s, c)),
                (e = e.ownerDocument || e),
                (c = e.createElement("script")),
                vt(c),
                Rt(c, "link", s),
                e.head.appendChild(c),
                (t.instance = c))
          );
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((s = t.instance), (t.state.loading |= 4), Xo(s, n.precedence, e));
    return t.instance;
  }
  function Xo(e, t, n) {
    for (
      var s = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        c = s.length ? s[s.length - 1] : null,
        u = c,
        m = 0;
      m < s.length;
      m++
    ) {
      var v = s[m];
      if (v.dataset.precedence === t) u = v;
      else if (u !== c) break;
    }
    u
      ? u.parentNode.insertBefore(e, u.nextSibling)
      : ((t = n.nodeType === 9 ? n.head : n), t.insertBefore(e, t.firstChild));
  }
  function Zu(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function Yu(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var Fo = null;
  function Rp(e, t, n) {
    if (Fo === null) {
      var s = new Map(),
        c = (Fo = new Map());
      c.set(n, s);
    } else ((c = Fo), (s = c.get(n)), s || ((s = new Map()), c.set(n, s)));
    if (s.has(e)) return s;
    for (s.set(e, null), n = n.getElementsByTagName(e), c = 0; c < n.length; c++) {
      var u = n[c];
      if (
        !(u[Lr] || u[xt] || (e === "link" && u.getAttribute("rel") === "stylesheet")) &&
        u.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var m = u.getAttribute(t) || "";
        m = e + m;
        var v = s.get(m);
        v ? v.push(u) : s.set(m, [u]);
      }
    }
    return s;
  }
  function Ap(e, t, n) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null));
  }
  function db(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
        return !0;
      case "link":
        if (
          typeof t.rel != "string" ||
          typeof t.href != "string" ||
          t.href === "" ||
          t.onLoad ||
          t.onError
        )
          break;
        switch (t.rel) {
          case "stylesheet":
            return ((e = t.disabled), typeof t.precedence == "string" && e == null);
          default:
            return !0;
        }
      case "script":
        if (
          t.async &&
          typeof t.async != "function" &&
          typeof t.async != "symbol" &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function Mp(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function hb(e, t, n, s) {
    if (
      n.type === "stylesheet" &&
      (typeof s.media != "string" || matchMedia(s.media).matches !== !1) &&
      (n.state.loading & 4) === 0
    ) {
      if (n.instance === null) {
        var c = mr(s.href),
          u = t.querySelector(vs(c));
        if (u) {
          ((t = u._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (e.count++, (e = Po.bind(e)), t.then(e, e)),
            (n.state.loading |= 4),
            (n.instance = u),
            vt(u));
          return;
        }
        ((u = t.ownerDocument || t),
          (s = Ep(s)),
          (c = pn.get(c)) && Zu(s, c),
          (u = u.createElement("link")),
          vt(u));
        var m = u;
        ((m._p = new Promise(function (v, w) {
          ((m.onload = v), (m.onerror = w));
        })),
          Rt(u, "link", s),
          (n.instance = u));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(n, t),
        (t = n.state.preload) &&
          (n.state.loading & 3) === 0 &&
          (e.count++,
          (n = Po.bind(e)),
          t.addEventListener("load", n),
          t.addEventListener("error", n)));
    }
  }
  var Gu = 0;
  function mb(e, t) {
    return (
      e.stylesheets && e.count === 0 && Io(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (n) {
            var s = setTimeout(function () {
              if ((e.stylesheets && Io(e, e.stylesheets), e.unsuspend)) {
                var u = e.unsuspend;
                ((e.unsuspend = null), u());
              }
            }, 6e4 + t);
            0 < e.imgBytes && Gu === 0 && (Gu = 62500 * Pv());
            var c = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 && (e.stylesheets && Io(e, e.stylesheets), e.unsuspend))
                ) {
                  var u = e.unsuspend;
                  ((e.unsuspend = null), u());
                }
              },
              (e.imgBytes > Gu ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = n),
              function () {
                ((e.unsuspend = null), clearTimeout(s), clearTimeout(c));
              }
            );
          }
        : null
    );
  }
  function Po() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) Io(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        ((this.unsuspend = null), e());
      }
    }
  }
  var Ko = null;
  function Io(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++, (Ko = new Map()), t.forEach(pb, e), (Ko = null), Po.call(e)));
  }
  function pb(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Ko.get(e);
      if (n) var s = n.get(null);
      else {
        ((n = new Map()), Ko.set(e, n));
        for (
          var c = e.querySelectorAll("link[data-precedence],style[data-precedence]"), u = 0;
          u < c.length;
          u++
        ) {
          var m = c[u];
          (m.nodeName === "LINK" || m.getAttribute("media") !== "not all") &&
            (n.set(m.dataset.precedence, m), (s = m));
        }
        s && n.set(null, s);
      }
      ((c = t.instance),
        (m = c.getAttribute("data-precedence")),
        (u = n.get(m) || s),
        u === s && n.set(null, c),
        n.set(m, c),
        this.count++,
        (s = Po.bind(this)),
        c.addEventListener("load", s),
        c.addEventListener("error", s),
        u
          ? u.parentNode.insertBefore(c, u.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(c, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var Ss = {
    $$typeof: Z,
    Provider: null,
    Consumer: null,
    _currentValue: ne,
    _currentValue2: ne,
    _threadCount: 0,
  };
  function gb(e, t, n, s, c, u, m, v, w) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = da(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = da(0)),
      (this.hiddenUpdates = da(null)),
      (this.identifierPrefix = s),
      (this.onUncaughtError = c),
      (this.onCaughtError = u),
      (this.onRecoverableError = m),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = w),
      (this.incompleteTransitions = new Map()));
  }
  function Cp(e, t, n, s, c, u, m, v, w, z, q, Y) {
    return (
      (e = new gb(e, t, n, m, w, z, q, Y, v)),
      (t = 1),
      u === !0 && (t |= 24),
      (u = $t(3, null, null, t)),
      (e.current = u),
      (u.stateNode = e),
      (t = wc()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (u.memoizedState = { element: s, isDehydrated: n, cache: t }),
      Ac(u),
      e
    );
  }
  function kp(e) {
    return e ? ((e = Xi), e) : Xi;
  }
  function Op(e, t, n, s, c, u) {
    ((c = kp(c)),
      s.context === null ? (s.context = c) : (s.pendingContext = c),
      (s = Sa(t)),
      (s.payload = { element: n }),
      (u = u === void 0 ? null : u),
      u !== null && (s.callback = u),
      (n = _a(e, s, t)),
      n !== null && (Qt(n, e, t), $r(n, e, t)));
  }
  function Np(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Qu(e, t) {
    (Np(e, t), (e = e.alternate) && Np(e, t));
  }
  function zp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = si(e, 67108864);
      (t !== null && Qt(t, e, 67108864), Qu(e, 67108864));
    }
  }
  function Dp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = an();
      t = Ni(t);
      var n = si(e, t);
      (n !== null && Qt(n, e, t), Qu(e, t));
    }
  }
  var Jo = !0;
  function yb(e, t, n, s) {
    var c = C.T;
    C.T = null;
    var u = H.p;
    try {
      ((H.p = 2), Xu(e, t, n, s));
    } finally {
      ((H.p = u), (C.T = c));
    }
  }
  function vb(e, t, n, s) {
    var c = C.T;
    C.T = null;
    var u = H.p;
    try {
      ((H.p = 8), Xu(e, t, n, s));
    } finally {
      ((H.p = u), (C.T = c));
    }
  }
  function Xu(e, t, n, s) {
    if (Jo) {
      var c = Fu(s);
      if (c === null) (Nu(e, t, s, $o, n), jp(e, s));
      else if (Sb(c, e, t, n, s)) s.stopPropagation();
      else if ((jp(e, s), t & 4 && -1 < bb.indexOf(e))) {
        for (; c !== null; ) {
          var u = Li(c);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var m = An(u.pendingLanes);
                  if (m !== 0) {
                    var v = u;
                    for (v.pendingLanes |= 2, v.entangledLanes |= 2; m; ) {
                      var w = 1 << (31 - Mt(m));
                      ((v.entanglements[1] |= w), (m &= ~w));
                    }
                    (On(u), (Ye & 6) === 0 && ((Do = Be() + 500), ms(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((v = si(u, 2)), v !== null && Qt(v, u, 2), jo(), Qu(u, 2));
            }
          if (((u = Fu(s)), u === null && Nu(e, t, s, $o, n), u === c)) break;
          c = u;
        }
        c !== null && s.stopPropagation();
      } else Nu(e, t, s, null, n);
    }
  }
  function Fu(e) {
    return ((e = Kl(e)), Pu(e));
  }
  var $o = null;
  function Pu(e) {
    if ((($o = null), (e = Di(e)), e !== null)) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (((e = d(t)), e !== null)) return e;
          e = null;
        } else if (n === 31) {
          if (((e = h(t)), e !== null)) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return (($o = e), null);
  }
  function Lp(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Ot()) {
          case Tn:
            return 2;
          case Ys:
            return 8;
          case $a:
          case zr:
            return 32;
          case Un:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ku = !1,
    Na = null,
    za = null,
    Da = null,
    _s = new Map(),
    xs = new Map(),
    La = [],
    bb =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function jp(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Na = null;
        break;
      case "dragenter":
      case "dragleave":
        za = null;
        break;
      case "mouseover":
      case "mouseout":
        Da = null;
        break;
      case "pointerover":
      case "pointerout":
        _s.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        xs.delete(t.pointerId);
    }
  }
  function ws(e, t, n, s, c, u) {
    return e === null || e.nativeEvent !== u
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: s,
          nativeEvent: u,
          targetContainers: [c],
        }),
        t !== null && ((t = Li(t)), t !== null && zp(t)),
        e)
      : ((e.eventSystemFlags |= s),
        (t = e.targetContainers),
        c !== null && t.indexOf(c) === -1 && t.push(c),
        e);
  }
  function Sb(e, t, n, s, c) {
    switch (t) {
      case "focusin":
        return ((Na = ws(Na, e, t, n, s, c)), !0);
      case "dragenter":
        return ((za = ws(za, e, t, n, s, c)), !0);
      case "mouseover":
        return ((Da = ws(Da, e, t, n, s, c)), !0);
      case "pointerover":
        var u = c.pointerId;
        return (_s.set(u, ws(_s.get(u) || null, e, t, n, s, c)), !0);
      case "gotpointercapture":
        return ((u = c.pointerId), xs.set(u, ws(xs.get(u) || null, e, t, n, s, c)), !0);
    }
    return !1;
  }
  function Up(e) {
    var t = Di(e.target);
    if (t !== null) {
      var n = f(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = d(n)), t !== null)) {
            ((e.blockedOn = t),
              Jf(e.priority, function () {
                Dp(n);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = h(n)), t !== null)) {
            ((e.blockedOn = t),
              Jf(e.priority, function () {
                Dp(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Wo(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Fu(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var s = new n.constructor(n.type, n);
        ((Pl = s), n.target.dispatchEvent(s), (Pl = null));
      } else return ((t = Li(n)), t !== null && zp(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function Bp(e, t, n) {
    Wo(e) && n.delete(t);
  }
  function _b() {
    ((Ku = !1),
      Na !== null && Wo(Na) && (Na = null),
      za !== null && Wo(za) && (za = null),
      Da !== null && Wo(Da) && (Da = null),
      _s.forEach(Bp),
      xs.forEach(Bp));
  }
  function el(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      Ku || ((Ku = !0), a.unstable_scheduleCallback(a.unstable_NormalPriority, _b)));
  }
  var tl = null;
  function Hp(e) {
    tl !== e &&
      ((tl = e),
      a.unstable_scheduleCallback(a.unstable_NormalPriority, function () {
        tl === e && (tl = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t],
            s = e[t + 1],
            c = e[t + 2];
          if (typeof s != "function") {
            if (Pu(s || n) === null) continue;
            break;
          }
          var u = Li(n);
          u !== null &&
            (e.splice(t, 3),
            (t -= 3),
            Fc(u, { pending: !0, data: c, method: n.method, action: s }, s, c));
        }
      }));
  }
  function gr(e) {
    function t(w) {
      return el(w, e);
    }
    (Na !== null && el(Na, e),
      za !== null && el(za, e),
      Da !== null && el(Da, e),
      _s.forEach(t),
      xs.forEach(t));
    for (var n = 0; n < La.length; n++) {
      var s = La[n];
      s.blockedOn === e && (s.blockedOn = null);
    }
    for (; 0 < La.length && ((n = La[0]), n.blockedOn === null); )
      (Up(n), n.blockedOn === null && La.shift());
    if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
      for (s = 0; s < n.length; s += 3) {
        var c = n[s],
          u = n[s + 1],
          m = c[Ht] || null;
        if (typeof u == "function") m || Hp(n);
        else if (m) {
          var v = null;
          if (u && u.hasAttribute("formAction")) {
            if (((c = u), (m = u[Ht] || null))) v = m.formAction;
            else if (Pu(c) !== null) continue;
          } else v = m.action;
          (typeof v == "function" ? (n[s + 1] = v) : (n.splice(s, 3), (s -= 3)), Hp(n));
        }
      }
  }
  function qp() {
    function e(u) {
      u.canIntercept &&
        u.info === "react-transition" &&
        u.intercept({
          handler: function () {
            return new Promise(function (m) {
              return (c = m);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (c !== null && (c(), (c = null)), s || setTimeout(n, 20));
    }
    function n() {
      if (!s && !navigation.transition) {
        var u = navigation.currentEntry;
        u &&
          u.url != null &&
          navigation.navigate(u.url, {
            state: u.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var s = !1,
        c = null;
      return (
        navigation.addEventListener("navigate", e),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(n, 100),
        function () {
          ((s = !0),
            navigation.removeEventListener("navigate", e),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            c !== null && (c(), (c = null)));
        }
      );
    }
  }
  function Iu(e) {
    this._internalRoot = e;
  }
  ((nl.prototype.render = Iu.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var n = t.current,
        s = an();
      Op(n, s, e, t, null, null);
    }),
    (nl.prototype.unmount = Iu.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (Op(e.current, 2, null, e, null, null), jo(), (t[zi] = null));
        }
      }));
  function nl(e) {
    this._internalRoot = e;
  }
  nl.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = Vl();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < La.length && t !== 0 && t < La[n].priority; n++);
      (La.splice(n, 0, e), n === 0 && Up(e));
    }
  };
  var Vp = i.version;
  if (Vp !== "19.2.3") throw Error(o(527, Vp, "19.2.3"));
  H.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function"
        ? Error(o(188))
        : ((e = Object.keys(e).join(",")), Error(o(268, e)));
    return ((e = p(t)), (e = e !== null ? b(e) : null), (e = e === null ? null : e.stateNode), e);
  };
  var xb = {
    bundleType: 0,
    version: "19.2.3",
    rendererPackageName: "react-dom",
    currentDispatcherRef: C,
    reconcilerVersion: "19.2.3",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var al = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!al.isDisabled && al.supportsFiber)
      try {
        ((Wa = al.inject(xb)), (Nt = al));
      } catch {}
  }
  return (
    (Ts.createRoot = function (e, t) {
      if (!l(e)) throw Error(o(299));
      var n = !1,
        s = "",
        c = Ph,
        u = Kh,
        m = Ih;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (s = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (c = t.onUncaughtError),
          t.onCaughtError !== void 0 && (u = t.onCaughtError),
          t.onRecoverableError !== void 0 && (m = t.onRecoverableError)),
        (t = Cp(e, 1, !1, null, null, n, s, null, c, u, m, qp)),
        (e[zi] = t.current),
        Ou(e),
        new Iu(t)
      );
    }),
    (Ts.hydrateRoot = function (e, t, n) {
      if (!l(e)) throw Error(o(299));
      var s = !1,
        c = "",
        u = Ph,
        m = Kh,
        v = Ih,
        w = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (s = !0),
          n.identifierPrefix !== void 0 && (c = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (u = n.onUncaughtError),
          n.onCaughtError !== void 0 && (m = n.onCaughtError),
          n.onRecoverableError !== void 0 && (v = n.onRecoverableError),
          n.formState !== void 0 && (w = n.formState)),
        (t = Cp(e, 1, !0, t, n ?? null, s, c, w, u, m, v, qp)),
        (t.context = kp(null)),
        (n = t.current),
        (s = an()),
        (s = Ni(s)),
        (c = Sa(s)),
        (c.callback = null),
        _a(n, c, s),
        (n = s),
        (t.current.lanes = n),
        nt(t, n),
        On(t),
        (e[zi] = t.current),
        Ou(e),
        new nl(t)
      );
    }),
    (Ts.version = "19.2.3"),
    Ts
  );
}
var Jp;
function zb() {
  if (Jp) return Wu.exports;
  Jp = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return (a(), (Wu.exports = Nb()), Wu.exports);
}
var Db = zb();
const wf = new WeakMap(),
  Lb = new WeakMap(),
  hl = { current: [] };
let af = !1,
  Ns = 0;
const ks = new Set(),
  il = new Map();
function Wg(a) {
  for (const i of a) {
    if (hl.current.includes(i)) continue;
    (hl.current.push(i), i.recompute());
    const r = Lb.get(i);
    if (r)
      for (const o of r) {
        const l = wf.get(o);
        l != null && l.length && Wg(l);
      }
  }
}
function jb(a) {
  const i = { prevVal: a.prevState, currentVal: a.state };
  for (const r of a.listeners) r(i);
}
function Ub(a) {
  const i = { prevVal: a.prevState, currentVal: a.state };
  for (const r of a.listeners) r(i);
}
function e0(a) {
  if ((Ns > 0 && !il.has(a) && il.set(a, a.prevState), ks.add(a), !(Ns > 0) && !af))
    try {
      for (af = !0; ks.size > 0; ) {
        const i = Array.from(ks);
        ks.clear();
        for (const r of i) {
          const o = il.get(r) ?? r.prevState;
          ((r.prevState = o), jb(r));
        }
        for (const r of i) {
          const o = wf.get(r);
          o && (hl.current.push(r), Wg(o));
        }
        for (const r of i) {
          const o = wf.get(r);
          if (o) for (const l of o) Ub(l);
        }
      }
    } finally {
      ((af = !1), (hl.current = []), il.clear());
    }
}
function wr(a) {
  Ns++;
  try {
    a();
  } finally {
    if ((Ns--, Ns === 0)) {
      const i = ks.values().next().value;
      i && e0(i);
    }
  }
}
function Bb(a) {
  return typeof a == "function";
}
class Hb {
  constructor(i, r) {
    ((this.listeners = new Set()),
      (this.subscribe = (o) => {
        var l, f;
        this.listeners.add(o);
        const d =
          (f = (l = this.options) == null ? void 0 : l.onSubscribe) == null
            ? void 0
            : f.call(l, o, this);
        return () => {
          (this.listeners.delete(o), d == null || d());
        };
      }),
      (this.prevState = i),
      (this.state = i),
      (this.options = r));
  }
  setState(i) {
    var r, o, l;
    ((this.prevState = this.state),
      (r = this.options) != null && r.updateFn
        ? (this.state = this.options.updateFn(this.prevState)(i))
        : Bb(i)
          ? (this.state = i(this.prevState))
          : (this.state = i),
      (l = (o = this.options) == null ? void 0 : o.onUpdate) == null || l.call(o),
      e0(this));
  }
}
const Za = "__TSR_index",
  $p = "popstate",
  Wp = "beforeunload";
function qb(a) {
  let i = a.getLocation();
  const r = new Set(),
    o = (d, h) => {
      ((i = a.getLocation()), r.forEach((y) => y({ location: i, action: d, navigateOpts: h })));
    },
    l = (d) => {
      (a.notifyOnIndexChange ?? !0) ? o(d) : (i = a.getLocation());
    },
    f = async ({ task: d, navigateOpts: h, ...y }) => {
      var S, E;
      if ((h == null ? void 0 : h.ignoreBlocker) ?? !1) return (d(), { type: "SUCCESS" });
      const b = ((S = a.getBlockers) == null ? void 0 : S.call(a)) ?? [],
        g = y.type === "PUSH" || y.type === "REPLACE";
      if (typeof document < "u" && b.length && g)
        for (const R of b) {
          const k = ml(y.path, y.state);
          if (await R.blockerFn({ currentLocation: i, nextLocation: k, action: y.type }))
            return ((E = a.onBlocked) == null || E.call(a), { type: "BLOCKED" });
        }
      return (d(), { type: "SUCCESS" });
    };
  return {
    get location() {
      return i;
    },
    get length() {
      return a.getLength();
    },
    subscribers: r,
    subscribe: (d) => (
      r.add(d),
      () => {
        r.delete(d);
      }
    ),
    push: (d, h, y) => {
      const p = i.state[Za];
      return (
        (h = eg(p + 1, h)),
        f({
          task: () => {
            (a.pushState(d, h), o({ type: "PUSH" }, y));
          },
          navigateOpts: y,
          type: "PUSH",
          path: d,
          state: h,
        })
      );
    },
    replace: (d, h, y) => {
      const p = i.state[Za];
      return (
        (h = eg(p, h)),
        f({
          task: () => {
            (a.replaceState(d, h), o({ type: "REPLACE" }, y));
          },
          navigateOpts: y,
          type: "REPLACE",
          path: d,
          state: h,
        })
      );
    },
    go: (d, h) => {
      f({
        task: () => {
          (a.go(d), l({ type: "GO", index: d }));
        },
        navigateOpts: h,
        type: "GO",
      });
    },
    back: (d) => {
      f({
        task: () => {
          (a.back((d == null ? void 0 : d.ignoreBlocker) ?? !1), l({ type: "BACK" }));
        },
        navigateOpts: d,
        type: "BACK",
      });
    },
    forward: (d) => {
      f({
        task: () => {
          (a.forward((d == null ? void 0 : d.ignoreBlocker) ?? !1), l({ type: "FORWARD" }));
        },
        navigateOpts: d,
        type: "FORWARD",
      });
    },
    canGoBack: () => i.state[Za] !== 0,
    createHref: (d) => a.createHref(d),
    block: (d) => {
      var y;
      if (!a.setBlockers) return () => {};
      const h = ((y = a.getBlockers) == null ? void 0 : y.call(a)) ?? [];
      return (
        a.setBlockers([...h, d]),
        () => {
          var b, g;
          const p = ((b = a.getBlockers) == null ? void 0 : b.call(a)) ?? [];
          (g = a.setBlockers) == null ||
            g.call(
              a,
              p.filter((S) => S !== d),
            );
        }
      );
    },
    flush: () => {
      var d;
      return (d = a.flush) == null ? void 0 : d.call(a);
    },
    destroy: () => {
      var d;
      return (d = a.destroy) == null ? void 0 : d.call(a);
    },
    notify: o,
  };
}
function eg(a, i) {
  i || (i = {});
  const r = Lf();
  return { ...i, key: r, __TSR_key: r, [Za]: a };
}
function Vb(a) {
  var te, ae;
  const i = typeof document < "u" ? window : void 0,
    r = i.history.pushState,
    o = i.history.replaceState;
  let l = [];
  const f = () => l,
    d = (X) => (l = X),
    h = (X) => X,
    y = () => ml(`${i.location.pathname}${i.location.search}${i.location.hash}`, i.history.state);
  if (
    !((te = i.history.state) != null && te.__TSR_key) &&
    !((ae = i.history.state) != null && ae.key)
  ) {
    const X = Lf();
    i.history.replaceState({ [Za]: 0, key: X, __TSR_key: X }, "");
  }
  let p = y(),
    b,
    g = !1,
    S = !1,
    E = !1,
    R = !1;
  const k = () => p;
  let L, A;
  const G = () => {
      L &&
        ((B._ignoreSubscribers = !0),
        (L.isPush ? i.history.pushState : i.history.replaceState)(L.state, "", L.href),
        (B._ignoreSubscribers = !1),
        (L = void 0),
        (A = void 0),
        (b = void 0));
    },
    Z = (X, ee, ue) => {
      const ge = h(ee);
      (A || (b = p),
        (p = ml(ee, ue)),
        (L = { href: ge, state: ue, isPush: (L == null ? void 0 : L.isPush) || X === "push" }),
        A || (A = Promise.resolve().then(() => G())));
    },
    P = (X) => {
      ((p = y()), B.notify({ type: X }));
    },
    K = async () => {
      if (S) {
        S = !1;
        return;
      }
      const X = y(),
        ee = X.state[Za] - p.state[Za],
        ue = ee === 1,
        ge = ee === -1,
        Ue = (!ue && !ge) || g;
      g = !1;
      const pe = Ue ? "GO" : ge ? "BACK" : "FORWARD",
        C = Ue ? { type: "GO", index: ee } : { type: ge ? "BACK" : "FORWARD" };
      if (E) E = !1;
      else {
        const H = f();
        if (typeof document < "u" && H.length) {
          for (const ne of H)
            if (await ne.blockerFn({ currentLocation: p, nextLocation: X, action: pe })) {
              ((S = !0), i.history.go(1), B.notify(C));
              return;
            }
        }
      }
      ((p = y()), B.notify(C));
    },
    I = (X) => {
      if (R) {
        R = !1;
        return;
      }
      let ee = !1;
      const ue = f();
      if (typeof document < "u" && ue.length)
        for (const ge of ue) {
          const Ue = ge.enableBeforeUnload ?? !0;
          if (Ue === !0) {
            ee = !0;
            break;
          }
          if (typeof Ue == "function" && Ue() === !0) {
            ee = !0;
            break;
          }
        }
      if (ee) return (X.preventDefault(), (X.returnValue = ""));
    },
    B = qb({
      getLocation: k,
      getLength: () => i.history.length,
      pushState: (X, ee) => Z("push", X, ee),
      replaceState: (X, ee) => Z("replace", X, ee),
      back: (X) => (X && (E = !0), (R = !0), i.history.back()),
      forward: (X) => {
        (X && (E = !0), (R = !0), i.history.forward());
      },
      go: (X) => {
        ((g = !0), i.history.go(X));
      },
      createHref: (X) => h(X),
      flush: G,
      destroy: () => {
        ((i.history.pushState = r),
          (i.history.replaceState = o),
          i.removeEventListener(Wp, I, { capture: !0 }),
          i.removeEventListener($p, K));
      },
      onBlocked: () => {
        b && p !== b && (p = b);
      },
      getBlockers: f,
      setBlockers: d,
      notifyOnIndexChange: !1,
    });
  return (
    i.addEventListener(Wp, I, { capture: !0 }),
    i.addEventListener($p, K),
    (i.history.pushState = function (...X) {
      const ee = r.apply(i.history, X);
      return (B._ignoreSubscribers || P("PUSH"), ee);
    }),
    (i.history.replaceState = function (...X) {
      const ee = o.apply(i.history, X);
      return (B._ignoreSubscribers || P("REPLACE"), ee);
    }),
    B
  );
}
function Zb(a) {
  let i = a.replace(/[\x00-\x1f\x7f]/g, "");
  return (i.startsWith("//") && (i = "/" + i.replace(/^\/+/, "")), i);
}
function ml(a, i) {
  const r = Zb(a),
    o = r.indexOf("#"),
    l = r.indexOf("?"),
    f = Lf();
  return {
    href: r,
    pathname: r.substring(0, o > 0 ? (l > 0 ? Math.min(o, l) : o) : l > 0 ? l : r.length),
    hash: o > -1 ? r.substring(o) : "",
    search: l > -1 ? r.slice(l, o === -1 ? void 0 : o) : "",
    state: i || { [Za]: 0, key: f, __TSR_key: f },
  };
}
function Lf() {
  return (Math.random() + 1).toString(36).substring(7);
}
function pl(a) {
  return a[a.length - 1];
}
function Yb(a) {
  return typeof a == "function";
}
function Ha(a, i) {
  return Yb(a) ? a(i) : a;
}
const Gb = Object.prototype.hasOwnProperty;
function gn(a, i, r = 0) {
  if (a === i) return a;
  if (r > 500) return i;
  const o = i,
    l = ag(a) && ag(o);
  if (!l && !(gl(a) && gl(o))) return o;
  const f = l ? a : tg(a);
  if (!f) return o;
  const d = l ? o : tg(o);
  if (!d) return o;
  const h = f.length,
    y = d.length,
    p = l ? new Array(y) : {};
  let b = 0;
  for (let g = 0; g < y; g++) {
    const S = l ? g : d[g],
      E = a[S],
      R = o[S];
    if (E === R) {
      ((p[S] = E), (l ? g < h : Gb.call(a, S)) && b++);
      continue;
    }
    if (E === null || R === null || typeof E != "object" || typeof R != "object") {
      p[S] = R;
      continue;
    }
    const k = gn(E, R, r + 1);
    ((p[S] = k), k === E && b++);
  }
  return h === y && b === h ? a : p;
}
function tg(a) {
  const i = [],
    r = Object.getOwnPropertyNames(a);
  for (const l of r) {
    if (!Object.prototype.propertyIsEnumerable.call(a, l)) return !1;
    i.push(l);
  }
  const o = Object.getOwnPropertySymbols(a);
  for (const l of o) {
    if (!Object.prototype.propertyIsEnumerable.call(a, l)) return !1;
    i.push(l);
  }
  return i;
}
function gl(a) {
  if (!ng(a)) return !1;
  const i = a.constructor;
  if (typeof i > "u") return !0;
  const r = i.prototype;
  return !(!ng(r) || !r.hasOwnProperty("isPrototypeOf"));
}
function ng(a) {
  return Object.prototype.toString.call(a) === "[object Object]";
}
function ag(a) {
  return Array.isArray(a) && a.length === Object.keys(a).length;
}
function _i(a, i, r) {
  if (a === i) return !0;
  if (typeof a != typeof i) return !1;
  if (Array.isArray(a) && Array.isArray(i)) {
    if (a.length !== i.length) return !1;
    for (let o = 0, l = a.length; o < l; o++) if (!_i(a[o], i[o], r)) return !1;
    return !0;
  }
  if (gl(a) && gl(i)) {
    const o = (r == null ? void 0 : r.ignoreUndefined) ?? !0;
    if (r != null && r.partial) {
      for (const d in i) if ((!o || i[d] !== void 0) && !_i(a[d], i[d], r)) return !1;
      return !0;
    }
    let l = 0;
    if (!o) l = Object.keys(a).length;
    else for (const d in a) a[d] !== void 0 && l++;
    let f = 0;
    for (const d in i) if ((!o || i[d] !== void 0) && (f++, f > l || !_i(a[d], i[d], r))) return !1;
    return l === f;
  }
  return !1;
}
function wi(a) {
  let i, r;
  const o = new Promise((l, f) => {
    ((i = l), (r = f));
  });
  return (
    (o.status = "pending"),
    (o.resolve = (l) => {
      ((o.status = "resolved"), (o.value = l), i(l), a == null || a(l));
    }),
    (o.reject = (l) => {
      ((o.status = "rejected"), r(l));
    }),
    o
  );
}
function Qb(a) {
  return typeof (a == null ? void 0 : a.message) != "string"
    ? !1
    : a.message.startsWith("Failed to fetch dynamically imported module") ||
        a.message.startsWith("error loading dynamically imported module") ||
        a.message.startsWith("Importing a module script failed");
}
function Ya(a) {
  return !!(a && typeof a == "object" && typeof a.then == "function");
}
function Xb(a) {
  return a.replace(/[\x00-\x1f\x7f]/g, "");
}
function ig(a) {
  let i;
  try {
    i = decodeURI(a);
  } catch {
    i = a.replaceAll(/%[0-9A-F]{2}/gi, (r) => {
      try {
        return decodeURI(r);
      } catch {
        return r;
      }
    });
  }
  return Xb(i);
}
const t0 = ["http:", "https:", "mailto:", "tel:"];
function yl(a) {
  if (!a) return !1;
  try {
    const i = new URL(a);
    return !t0.includes(i.protocol);
  } catch {
    return !1;
  }
}
const Fb = {
    "&": "\\u0026",
    ">": "\\u003e",
    "<": "\\u003c",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
  },
  Pb = /[&><\u2028\u2029]/g;
function n0(a) {
  return a.replace(Pb, (i) => Fb[i]);
}
function rf(a, i) {
  if (!a) return a;
  const r = /%25|%5C/gi;
  let o = 0,
    l = "",
    f;
  for (; (f = r.exec(a)) !== null; ) ((l += ig(a.slice(o, f.index)) + f[0]), (o = r.lastIndex));
  return (
    (l = l + ig(o ? a.slice(o) : a)), l.startsWith("//") && (l = "/" + l.replace(/^\/+/, "")), l
  );
}
var Kb = "Invariant failed";
function Pt(a, i) {
  if (!a) throw new Error(Kb);
}
function vl(a) {
  const i = new Map();
  let r, o;
  const l = (f) => {
    f.next &&
      (f.prev
        ? ((f.prev.next = f.next),
          (f.next.prev = f.prev),
          (f.next = void 0),
          o && ((o.next = f), (f.prev = o)))
        : ((f.next.prev = void 0),
          (r = f.next),
          (f.next = void 0),
          o && ((f.prev = o), (o.next = f))),
      (o = f));
  };
  return {
    get(f) {
      const d = i.get(f);
      if (d) return (l(d), d.value);
    },
    set(f, d) {
      if (i.size >= a && r) {
        const y = r;
        (i.delete(y.key),
          y.next && ((r = y.next), (y.next.prev = void 0)),
          y === o && (o = void 0));
      }
      const h = i.get(f);
      if (h) ((h.value = d), l(h));
      else {
        const y = { key: f, value: d, prev: o };
        (o && (o.next = y), (o = y), r || (r = y), i.set(f, y));
      }
    },
    clear() {
      (i.clear(), (r = void 0), (o = void 0));
    },
  };
}
const Mr = 0,
  Ei = 1,
  Ti = 2,
  js = 3,
  _r = 4,
  Ib = 5,
  Jb = /^([^{]*)\{\$([a-zA-Z_$][a-zA-Z0-9_$]*)\}([^}]*)$/,
  $b = /^([^{]*)\{-\$([a-zA-Z_$][a-zA-Z0-9_$]*)\}([^}]*)$/,
  Wb = /^([^{]*)\{\$\}([^}]*)$/;
function jf(a, i, r = new Uint16Array(6)) {
  const o = a.indexOf("/", i),
    l = o === -1 ? a.length : o,
    f = a.substring(i, l);
  if (!f || !f.includes("$"))
    return ((r[0] = Mr), (r[1] = i), (r[2] = i), (r[3] = l), (r[4] = l), (r[5] = l), r);
  if (f === "$") {
    const p = a.length;
    return ((r[0] = Ti), (r[1] = i), (r[2] = i), (r[3] = p), (r[4] = p), (r[5] = p), r);
  }
  if (f.charCodeAt(0) === 36)
    return ((r[0] = Ei), (r[1] = i), (r[2] = i + 1), (r[3] = l), (r[4] = l), (r[5] = l), r);
  const d = f.match(Wb);
  if (d) {
    const b = d[1].length;
    return (
      (r[0] = Ti),
      (r[1] = i + b),
      (r[2] = i + b + 1),
      (r[3] = i + b + 2),
      (r[4] = i + b + 3),
      (r[5] = a.length),
      r
    );
  }
  const h = f.match($b);
  if (h) {
    const p = h[1],
      b = h[2],
      g = h[3],
      S = p.length;
    return (
      (r[0] = js),
      (r[1] = i + S),
      (r[2] = i + S + 3),
      (r[3] = i + S + 3 + b.length),
      (r[4] = l - g.length),
      (r[5] = l),
      r
    );
  }
  const y = f.match(Jb);
  if (y) {
    const p = y[1],
      b = y[2],
      g = y[3],
      S = p.length;
    return (
      (r[0] = Ei),
      (r[1] = i + S),
      (r[2] = i + S + 2),
      (r[3] = i + S + 2 + b.length),
      (r[4] = l - g.length),
      (r[5] = l),
      r
    );
  }
  return ((r[0] = Mr), (r[1] = i), (r[2] = i), (r[3] = l), (r[4] = l), (r[5] = l), r);
}
function Ol(a, i, r, o, l, f, d) {
  var y, p, b, g, S, E, R, k, L, A, G, Z, P;
  d == null || d(r);
  let h = o;
  {
    const K = r.fullPath ?? r.from,
      I = K.length,
      B = ((y = r.options) == null ? void 0 : y.caseSensitive) ?? a,
      te = !!(
        (b = (p = r.options) == null ? void 0 : p.params) != null &&
        b.parse &&
        (S = (g = r.options) == null ? void 0 : g.skipRouteOnParseError) != null &&
        S.params
      );
    for (; h < I; ) {
      const X = jf(K, h, i);
      let ee;
      const ue = h,
        ge = X[5];
      switch (((h = ge + 1), f++, X[0])) {
        case Mr: {
          const pe = K.substring(X[2], X[3]);
          if (B) {
            const C = (E = l.static) == null ? void 0 : E.get(pe);
            if (C) ee = C;
            else {
              l.static ?? (l.static = new Map());
              const H = bi(r.fullPath ?? r.from);
              ((H.parent = l), (H.depth = f), (ee = H), l.static.set(pe, H));
            }
          } else {
            const C = pe.toLowerCase(),
              H = (R = l.staticInsensitive) == null ? void 0 : R.get(C);
            if (H) ee = H;
            else {
              l.staticInsensitive ?? (l.staticInsensitive = new Map());
              const ne = bi(r.fullPath ?? r.from);
              ((ne.parent = l), (ne.depth = f), (ee = ne), l.staticInsensitive.set(C, ne));
            }
          }
          break;
        }
        case Ei: {
          const pe = K.substring(ue, X[1]),
            C = K.substring(X[4], ge),
            H = B && !!(pe || C),
            ne = pe ? (H ? pe : pe.toLowerCase()) : void 0,
            ve = C ? (H ? C : C.toLowerCase()) : void 0,
            se =
              !te &&
              ((k = l.dynamic) == null
                ? void 0
                : k.find(
                    (x) =>
                      !x.skipOnParamError &&
                      x.caseSensitive === H &&
                      x.prefix === ne &&
                      x.suffix === ve,
                  ));
          if (se) ee = se;
          else {
            const x = of(Ei, r.fullPath ?? r.from, H, ne, ve);
            ((ee = x),
              (x.depth = f),
              (x.parent = l),
              l.dynamic ?? (l.dynamic = []),
              l.dynamic.push(x));
          }
          break;
        }
        case js: {
          const pe = K.substring(ue, X[1]),
            C = K.substring(X[4], ge),
            H = B && !!(pe || C),
            ne = pe ? (H ? pe : pe.toLowerCase()) : void 0,
            ve = C ? (H ? C : C.toLowerCase()) : void 0,
            se =
              !te &&
              ((L = l.optional) == null
                ? void 0
                : L.find(
                    (x) =>
                      !x.skipOnParamError &&
                      x.caseSensitive === H &&
                      x.prefix === ne &&
                      x.suffix === ve,
                  ));
          if (se) ee = se;
          else {
            const x = of(js, r.fullPath ?? r.from, H, ne, ve);
            ((ee = x),
              (x.parent = l),
              (x.depth = f),
              l.optional ?? (l.optional = []),
              l.optional.push(x));
          }
          break;
        }
        case Ti: {
          const pe = K.substring(ue, X[1]),
            C = K.substring(X[4], ge),
            H = B && !!(pe || C),
            ne = pe ? (H ? pe : pe.toLowerCase()) : void 0,
            ve = C ? (H ? C : C.toLowerCase()) : void 0,
            se = of(Ti, r.fullPath ?? r.from, H, ne, ve);
          ((ee = se),
            (se.parent = l),
            (se.depth = f),
            l.wildcard ?? (l.wildcard = []),
            l.wildcard.push(se));
        }
      }
      l = ee;
    }
    if (
      te &&
      r.children &&
      !r.isRoot &&
      r.id &&
      r.id.charCodeAt(r.id.lastIndexOf("/") + 1) === 95
    ) {
      const X = bi(r.fullPath ?? r.from);
      ((X.kind = Ib),
        (X.parent = l),
        f++,
        (X.depth = f),
        l.pathless ?? (l.pathless = []),
        l.pathless.push(X),
        (l = X));
    }
    const ae = (r.path || !r.children) && !r.isRoot;
    if (ae && K.endsWith("/")) {
      const X = bi(r.fullPath ?? r.from);
      ((X.kind = _r), (X.parent = l), f++, (X.depth = f), (l.index = X), (l = X));
    }
    ((l.parse =
      ((G = (A = r.options) == null ? void 0 : A.params) == null ? void 0 : G.parse) ?? null),
      (l.skipOnParamError = te),
      (l.parsingPriority =
        ((P = (Z = r.options) == null ? void 0 : Z.skipRouteOnParseError) == null
          ? void 0
          : P.priority) ?? 0),
      ae && !l.route && ((l.route = r), (l.fullPath = r.fullPath ?? r.from)));
  }
  if (r.children) for (const K of r.children) Ol(a, i, K, h, l, f, d);
}
function sf(a, i) {
  if (a.skipOnParamError && !i.skipOnParamError) return -1;
  if (!a.skipOnParamError && i.skipOnParamError) return 1;
  if (a.skipOnParamError && i.skipOnParamError && (a.parsingPriority || i.parsingPriority))
    return i.parsingPriority - a.parsingPriority;
  if (a.prefix && i.prefix && a.prefix !== i.prefix) {
    if (a.prefix.startsWith(i.prefix)) return -1;
    if (i.prefix.startsWith(a.prefix)) return 1;
  }
  if (a.suffix && i.suffix && a.suffix !== i.suffix) {
    if (a.suffix.endsWith(i.suffix)) return -1;
    if (i.suffix.endsWith(a.suffix)) return 1;
  }
  return a.prefix && !i.prefix
    ? -1
    : !a.prefix && i.prefix
      ? 1
      : a.suffix && !i.suffix
        ? -1
        : !a.suffix && i.suffix
          ? 1
          : a.caseSensitive && !i.caseSensitive
            ? -1
            : !a.caseSensitive && i.caseSensitive
              ? 1
              : 0;
}
function Ua(a) {
  var i, r, o;
  if (a.pathless) for (const l of a.pathless) Ua(l);
  if (a.static) for (const l of a.static.values()) Ua(l);
  if (a.staticInsensitive) for (const l of a.staticInsensitive.values()) Ua(l);
  if ((i = a.dynamic) != null && i.length) {
    a.dynamic.sort(sf);
    for (const l of a.dynamic) Ua(l);
  }
  if ((r = a.optional) != null && r.length) {
    a.optional.sort(sf);
    for (const l of a.optional) Ua(l);
  }
  if ((o = a.wildcard) != null && o.length) {
    a.wildcard.sort(sf);
    for (const l of a.wildcard) Ua(l);
  }
}
function bi(a) {
  return {
    kind: Mr,
    depth: 0,
    pathless: null,
    index: null,
    static: null,
    staticInsensitive: null,
    dynamic: null,
    optional: null,
    wildcard: null,
    route: null,
    fullPath: a,
    parent: null,
    parse: null,
    skipOnParamError: !1,
    parsingPriority: 0,
  };
}
function of(a, i, r, o, l) {
  return {
    kind: a,
    depth: 0,
    pathless: null,
    index: null,
    static: null,
    staticInsensitive: null,
    dynamic: null,
    optional: null,
    wildcard: null,
    route: null,
    fullPath: i,
    parent: null,
    parse: null,
    skipOnParamError: !1,
    parsingPriority: 0,
    caseSensitive: r,
    prefix: o,
    suffix: l,
  };
}
function eS(a, i) {
  const r = bi("/"),
    o = new Uint16Array(6);
  for (const l of a) Ol(!1, o, l, 1, r, 0);
  (Ua(r), (i.masksTree = r), (i.flatCache = vl(1e3)));
}
function tS(a, i) {
  a || (a = "/");
  const r = i.flatCache.get(a);
  if (r) return r;
  const o = Uf(a, i.masksTree);
  return (i.flatCache.set(a, o), o);
}
function nS(a, i, r, o, l) {
  (a || (a = "/"), o || (o = "/"));
  const f = i ? `case\0${a}` : a;
  let d = l.singleCache.get(f);
  if (!d) {
    d = bi("/");
    const h = new Uint16Array(6);
    (Ol(i, h, { from: a }, 1, d, 0), l.singleCache.set(f, d));
  }
  return Uf(o, d, r);
}
function aS(a, i, r = !1) {
  const o = r ? a : `nofuzz\0${a}`,
    l = i.matchCache.get(o);
  if (l !== void 0) return l;
  a || (a = "/");
  let f;
  try {
    f = Uf(a, i.segmentTree, r);
  } catch (d) {
    if (d instanceof URIError) f = null;
    else throw d;
  }
  return (f && (f.branch = sS(f.route)), i.matchCache.set(o, f), f);
}
function iS(a) {
  return a === "/" ? a : a.replace(/\/{1,}$/, "");
}
function rS(a, i = !1, r) {
  const o = bi(a.fullPath),
    l = new Uint16Array(6),
    f = {},
    d = {};
  let h = 0;
  return (
    Ol(i, l, a, 1, o, 0, (p) => {
      if (
        (r == null || r(p, h),
        Pt(!(p.id in f), `Duplicate routes found with id: ${String(p.id)}`),
        (f[p.id] = p),
        h !== 0 && p.path)
      ) {
        const b = iS(p.fullPath);
        (!d[b] || p.fullPath.endsWith("/")) && (d[b] = p);
      }
      h++;
    }),
    Ua(o),
    {
      processedTree: {
        segmentTree: o,
        singleCache: vl(1e3),
        matchCache: vl(1e3),
        flatCache: null,
        masksTree: null,
      },
      routesById: f,
      routesByPath: d,
    }
  );
}
function Uf(a, i, r = !1) {
  const o = a.split("/"),
    l = lS(a, o, i, r);
  if (!l) return null;
  const [f] = a0(a, o, l);
  return { route: l.node.route, rawParams: f, parsedParams: l.parsedParams };
}
function a0(a, i, r) {
  var p, b, g, S, E, R, k, L, A;
  const o = oS(r.node);
  let l = null;
  const f = {};
  let d = ((p = r.extract) == null ? void 0 : p.part) ?? 0,
    h = ((b = r.extract) == null ? void 0 : b.node) ?? 0,
    y = ((g = r.extract) == null ? void 0 : g.path) ?? 0;
  for (; h < o.length; d++, h++, y++) {
    const G = o[h],
      Z = i[d],
      P = y;
    if ((Z && (y += Z.length), G.kind === Ei)) {
      l ?? (l = r.node.fullPath.split("/"));
      const K = l[h],
        I = ((S = G.prefix) == null ? void 0 : S.length) ?? 0;
      if (K.charCodeAt(I) === 123) {
        const te = ((E = G.suffix) == null ? void 0 : E.length) ?? 0,
          ae = K.substring(I + 2, K.length - te - 1),
          X = Z.substring(I, Z.length - te);
        f[ae] = decodeURIComponent(X);
      } else {
        const te = K.substring(1);
        f[te] = decodeURIComponent(Z);
      }
    } else if (G.kind === js) {
      if (r.skipped & (1 << h)) {
        d--;
        continue;
      }
      l ?? (l = r.node.fullPath.split("/"));
      const K = l[h],
        I = ((R = G.prefix) == null ? void 0 : R.length) ?? 0,
        B = ((k = G.suffix) == null ? void 0 : k.length) ?? 0,
        te = K.substring(I + 3, K.length - B - 1),
        ae = G.suffix || G.prefix ? Z.substring(I, Z.length - B) : Z;
      ae && (f[te] = decodeURIComponent(ae));
    } else if (G.kind === Ti) {
      const K = G,
        I = a.substring(
          P + (((L = K.prefix) == null ? void 0 : L.length) ?? 0),
          a.length - (((A = K.suffix) == null ? void 0 : A.length) ?? 0),
        ),
        B = decodeURIComponent(I);
      ((f["*"] = B), (f._splat = B));
      break;
    }
  }
  return (r.rawParams && Object.assign(f, r.rawParams), [f, { part: d, node: h, path: y }]);
}
function sS(a) {
  const i = [a];
  for (; a.parentRoute; ) ((a = a.parentRoute), i.push(a));
  return (i.reverse(), i);
}
function oS(a) {
  const i = Array(a.depth + 1);
  do ((i[a.depth] = a), (a = a.parent));
  while (a);
  return i;
}
function lS(a, i, r, o) {
  if (a === "/" && r.index) return { node: r.index, skipped: 0 };
  const l = !pl(i),
    f = l && a !== "/",
    d = i.length - (l ? 1 : 0),
    h = [{ node: r, index: 1, skipped: 0, depth: 1, statics: 1, dynamics: 0, optionals: 0 }];
  let y = null,
    p = null,
    b = null;
  for (; h.length; ) {
    const g = h.pop(),
      { node: S, index: E, skipped: R, depth: k, statics: L, dynamics: A, optionals: G } = g;
    let { extract: Z, rawParams: P, parsedParams: K } = g;
    if (S.skipOnParamError) {
      if (!lf(a, i, g)) continue;
      ((P = g.rawParams), (Z = g.extract), (K = g.parsedParams));
    }
    o && S.route && S.kind !== _r && Rs(p, g) && (p = g);
    const I = E === d;
    if (
      I &&
      (S.route && !f && Rs(b, g) && (b = g), !S.optional && !S.wildcard && !S.index && !S.pathless)
    )
      continue;
    const B = I ? void 0 : i[E];
    let te;
    if (I && S.index) {
      const ae = {
        node: S.index,
        index: E,
        skipped: R,
        depth: k + 1,
        statics: L,
        dynamics: A,
        optionals: G,
        extract: Z,
        rawParams: P,
        parsedParams: K,
      };
      if (S.index.skipOnParamError && !lf(a, i, ae)) continue;
      if (L === d && !A && !G && !R) return ae;
      Rs(b, ae) && (b = ae);
    }
    if (S.wildcard && Rs(y, g))
      for (const ae of S.wildcard) {
        const { prefix: X, suffix: ee } = ae;
        if (X && (I || !(ae.caseSensitive ? B : (te ?? (te = B.toLowerCase()))).startsWith(X)))
          continue;
        if (ee) {
          if (I) continue;
          const ge = i.slice(E).join("/").slice(-ee.length);
          if ((ae.caseSensitive ? ge : ge.toLowerCase()) !== ee) continue;
        }
        const ue = {
          node: ae,
          index: d,
          skipped: R,
          depth: k,
          statics: L,
          dynamics: A,
          optionals: G,
          extract: Z,
          rawParams: P,
          parsedParams: K,
        };
        if (!(ae.skipOnParamError && !lf(a, i, ue))) {
          y = ue;
          break;
        }
      }
    if (S.optional) {
      const ae = R | (1 << k),
        X = k + 1;
      for (let ee = S.optional.length - 1; ee >= 0; ee--) {
        const ue = S.optional[ee];
        h.push({
          node: ue,
          index: E,
          skipped: ae,
          depth: X,
          statics: L,
          dynamics: A,
          optionals: G,
          extract: Z,
          rawParams: P,
          parsedParams: K,
        });
      }
      if (!I)
        for (let ee = S.optional.length - 1; ee >= 0; ee--) {
          const ue = S.optional[ee],
            { prefix: ge, suffix: Ue } = ue;
          if (ge || Ue) {
            const pe = ue.caseSensitive ? B : (te ?? (te = B.toLowerCase()));
            if ((ge && !pe.startsWith(ge)) || (Ue && !pe.endsWith(Ue))) continue;
          }
          h.push({
            node: ue,
            index: E + 1,
            skipped: R,
            depth: X,
            statics: L,
            dynamics: A,
            optionals: G + 1,
            extract: Z,
            rawParams: P,
            parsedParams: K,
          });
        }
    }
    if (!I && S.dynamic && B)
      for (let ae = S.dynamic.length - 1; ae >= 0; ae--) {
        const X = S.dynamic[ae],
          { prefix: ee, suffix: ue } = X;
        if (ee || ue) {
          const ge = X.caseSensitive ? B : (te ?? (te = B.toLowerCase()));
          if ((ee && !ge.startsWith(ee)) || (ue && !ge.endsWith(ue))) continue;
        }
        h.push({
          node: X,
          index: E + 1,
          skipped: R,
          depth: k + 1,
          statics: L,
          dynamics: A + 1,
          optionals: G,
          extract: Z,
          rawParams: P,
          parsedParams: K,
        });
      }
    if (!I && S.staticInsensitive) {
      const ae = S.staticInsensitive.get(te ?? (te = B.toLowerCase()));
      ae &&
        h.push({
          node: ae,
          index: E + 1,
          skipped: R,
          depth: k + 1,
          statics: L + 1,
          dynamics: A,
          optionals: G,
          extract: Z,
          rawParams: P,
          parsedParams: K,
        });
    }
    if (!I && S.static) {
      const ae = S.static.get(B);
      ae &&
        h.push({
          node: ae,
          index: E + 1,
          skipped: R,
          depth: k + 1,
          statics: L + 1,
          dynamics: A,
          optionals: G,
          extract: Z,
          rawParams: P,
          parsedParams: K,
        });
    }
    if (S.pathless) {
      const ae = k + 1;
      for (let X = S.pathless.length - 1; X >= 0; X--) {
        const ee = S.pathless[X];
        h.push({
          node: ee,
          index: E,
          skipped: R,
          depth: ae,
          statics: L,
          dynamics: A,
          optionals: G,
          extract: Z,
          rawParams: P,
          parsedParams: K,
        });
      }
    }
  }
  if (b && y) return Rs(y, b) ? b : y;
  if (b) return b;
  if (y) return y;
  if (o && p) {
    let g = p.index;
    for (let E = 0; E < p.index; E++) g += i[E].length;
    const S = g === a.length ? "/" : a.slice(g);
    return (p.rawParams ?? (p.rawParams = {}), (p.rawParams["**"] = decodeURIComponent(S)), p);
  }
  return null;
}
function lf(a, i, r) {
  try {
    const [o, l] = a0(a, i, r);
    ((r.rawParams = o), (r.extract = l));
    const f = r.node.parse(o);
    return ((r.parsedParams = Object.assign({}, r.parsedParams, f)), !0);
  } catch {
    return null;
  }
}
function Rs(a, i) {
  return a
    ? i.statics > a.statics ||
        (i.statics === a.statics &&
          (i.dynamics > a.dynamics ||
            (i.dynamics === a.dynamics &&
              (i.optionals > a.optionals ||
                (i.optionals === a.optionals &&
                  ((i.node.kind === _r) > (a.node.kind === _r) ||
                    ((i.node.kind === _r) == (a.node.kind === _r) && i.depth > a.depth)))))))
    : !0;
}
function ul(a) {
  return Bf(a.filter((i) => i !== void 0).join("/"));
}
function Bf(a) {
  return a.replace(/\/{2,}/g, "/");
}
function i0(a) {
  return a === "/" ? a : a.replace(/^\/{1,}/, "");
}
function aa(a) {
  const i = a.length;
  return i > 1 && a[i - 1] === "/" ? a.replace(/\/{1,}$/, "") : a;
}
function r0(a) {
  return aa(i0(a));
}
function bl(a, i) {
  return a != null && a.endsWith("/") && a !== "/" && a !== `${i}/` ? a.slice(0, -1) : a;
}
function cS(a, i, r) {
  return bl(a, r) === bl(i, r);
}
function uS({ base: a, to: i, trailingSlash: r = "never", cache: o }) {
  const l = i.startsWith("/"),
    f = !l && i === ".";
  let d;
  if (o) {
    d = l ? i : f ? a : a + "\0" + i;
    const g = o.get(d);
    if (g) return g;
  }
  let h;
  if (f) h = a.split("/");
  else if (l) h = i.split("/");
  else {
    for (h = a.split("/"); h.length > 1 && pl(h) === ""; ) h.pop();
    const g = i.split("/");
    for (let S = 0, E = g.length; S < E; S++) {
      const R = g[S];
      R === ""
        ? S
          ? S === E - 1 && h.push(R)
          : (h = [R])
        : R === ".."
          ? h.pop()
          : R === "." || h.push(R);
    }
  }
  h.length > 1 && (pl(h) === "" ? r === "never" && h.pop() : r === "always" && h.push(""));
  let y,
    p = "";
  for (let g = 0; g < h.length; g++) {
    g > 0 && (p += "/");
    const S = h[g];
    if (!S) continue;
    y = jf(S, 0, y);
    const E = y[0];
    if (E === Mr) {
      p += S;
      continue;
    }
    const R = y[5],
      k = S.substring(0, y[1]),
      L = S.substring(y[4], R),
      A = S.substring(y[2], y[3]);
    E === Ei
      ? (p += k || L ? `${k}{$${A}}${L}` : `$${A}`)
      : E === Ti
        ? (p += k || L ? `${k}{$}${L}` : "$")
        : (p += `${k}{-$${A}}${L}`);
  }
  p = Bf(p);
  const b = p || "/";
  return (d && o && o.set(d, b), b);
}
function cf(a, i, r) {
  const o = i[a];
  return typeof o != "string" ? o : a === "_splat" ? encodeURI(o) : fS(o, r);
}
function uf({ path: a, params: i, decodeCharMap: r }) {
  let o = !1;
  const l = {};
  if (!a || a === "/") return { interpolatedPath: "/", usedParams: l, isMissingParams: o };
  if (!a.includes("$")) return { interpolatedPath: a, usedParams: l, isMissingParams: o };
  const f = a.length;
  let d = 0,
    h,
    y = "";
  for (; d < f; ) {
    const b = d;
    h = jf(a, b, h);
    const g = h[5];
    if (((d = g + 1), b === g)) continue;
    const S = h[0];
    if (S === Mr) {
      y += "/" + a.substring(b, g);
      continue;
    }
    if (S === Ti) {
      const E = i._splat;
      ((l._splat = E), (l["*"] = E));
      const R = a.substring(b, h[1]),
        k = a.substring(h[4], g);
      if (!E) {
        ((o = !0), (R || k) && (y += "/" + R + k));
        continue;
      }
      const L = cf("_splat", i, r);
      y += "/" + R + L + k;
      continue;
    }
    if (S === Ei) {
      const E = a.substring(h[2], h[3]);
      (!o && !(E in i) && (o = !0), (l[E] = i[E]));
      const R = a.substring(b, h[1]),
        k = a.substring(h[4], g),
        L = cf(E, i, r) ?? "undefined";
      y += "/" + R + L + k;
      continue;
    }
    if (S === js) {
      const E = a.substring(h[2], h[3]),
        R = i[E];
      if (R == null) continue;
      l[E] = R;
      const k = a.substring(b, h[1]),
        L = a.substring(h[4], g),
        A = cf(E, i, r) ?? "";
      y += "/" + k + A + L;
      continue;
    }
  }
  return (
    a.endsWith("/") && (y += "/"), { usedParams: l, interpolatedPath: y || "/", isMissingParams: o }
  );
}
function fS(a, i) {
  let r = encodeURIComponent(a);
  if (i) for (const [o, l] of i) r = r.replaceAll(o, l);
  return r;
}
function Dt(a) {
  return !!(a != null && a.isNotFound);
}
function dS() {
  try {
    if (typeof window < "u" && typeof window.sessionStorage == "object")
      return window.sessionStorage;
  } catch {}
}
const Sl = "tsr-scroll-restoration-v1_3",
  hS = (a, i) => {
    let r;
    return (...o) => {
      r ||
        (r = setTimeout(() => {
          (a(...o), (r = null));
        }, i));
    };
  };
function mS() {
  const a = dS();
  if (!a) return null;
  const i = a.getItem(Sl);
  let r = i ? JSON.parse(i) : {};
  return {
    state: r,
    set: (o) => {
      r = Ha(o, r) || r;
      try {
        a.setItem(Sl, JSON.stringify(r));
      } catch {
        console.warn("[ts-router] Could not persist scroll restoration state to sessionStorage.");
      }
    },
  };
}
const rl = mS(),
  Ef = (a) => a.state.__TSR_key || a.href;
function pS(a) {
  const i = [];
  let r;
  for (; (r = a.parentNode); )
    (i.push(`${a.tagName}:nth-child(${Array.prototype.indexOf.call(r.children, a) + 1})`), (a = r));
  return `${i.reverse().join(" > ")}`.toLowerCase();
}
let _l = !1;
function s0({
  storageKey: a,
  key: i,
  behavior: r,
  shouldScrollRestoration: o,
  scrollToTopSelectors: l,
  location: f,
}) {
  var p, b;
  let d;
  try {
    d = JSON.parse(sessionStorage.getItem(a) || "{}");
  } catch (g) {
    console.error(g);
    return;
  }
  const h = i || ((p = window.history.state) == null ? void 0 : p.__TSR_key),
    y = d[h];
  _l = !0;
  e: {
    if (o && y && Object.keys(y).length > 0) {
      for (const E in y) {
        const R = y[E];
        if (E === "window") window.scrollTo({ top: R.scrollY, left: R.scrollX, behavior: r });
        else if (E) {
          const k = document.querySelector(E);
          k && ((k.scrollLeft = R.scrollX), (k.scrollTop = R.scrollY));
        }
      }
      break e;
    }
    const g = (f ?? window.location).hash.split("#", 2)[1];
    if (g) {
      const E = ((b = window.history.state) == null ? void 0 : b.__hashScrollIntoViewOptions) ?? !0;
      if (E) {
        const R = document.getElementById(g);
        R && R.scrollIntoView(E);
      }
      break e;
    }
    const S = { top: 0, left: 0, behavior: r };
    if ((window.scrollTo(S), l))
      for (const E of l) {
        if (E === "window") continue;
        const R = typeof E == "function" ? E() : document.querySelector(E);
        R && R.scrollTo(S);
      }
  }
  _l = !1;
}
function gS(a, i) {
  if (
    (!rl && !a.isServer) ||
    ((a.options.scrollRestoration ?? !1) && (a.isScrollRestoring = !0),
    a.isServer || a.isScrollRestorationSetup || !rl)
  )
    return;
  ((a.isScrollRestorationSetup = !0), (_l = !1));
  const o = a.options.getScrollRestorationKey || Ef;
  window.history.scrollRestoration = "manual";
  const l = (f) => {
    if (_l || !a.isScrollRestoring) return;
    let d = "";
    if (f.target === document || f.target === window) d = "window";
    else {
      const y = f.target.getAttribute("data-scroll-restoration-id");
      y ? (d = `[data-scroll-restoration-id="${y}"]`) : (d = pS(f.target));
    }
    const h = o(a.state.location);
    rl.set((y) => {
      const p = y[h] || (y[h] = {}),
        b = p[d] || (p[d] = {});
      if (d === "window") ((b.scrollX = window.scrollX || 0), (b.scrollY = window.scrollY || 0));
      else if (d) {
        const g = document.querySelector(d);
        g && ((b.scrollX = g.scrollLeft || 0), (b.scrollY = g.scrollTop || 0));
      }
      return y;
    });
  };
  (typeof document < "u" && document.addEventListener("scroll", hS(l, 100), !0),
    a.subscribe("onRendered", (f) => {
      const d = o(f.toLocation);
      (f.toLocation.state.__TSR_resetScroll ?? !0) &&
        ((typeof a.options.scrollRestoration == "function" &&
          !a.options.scrollRestoration({ location: a.latestLocation })) ||
          (s0({
            storageKey: Sl,
            key: d,
            behavior: a.options.scrollRestorationBehavior,
            shouldScrollRestoration: a.isScrollRestoring,
            scrollToTopSelectors: a.options.scrollToTopSelectors,
            location: a.history.location,
          }),
          a.isScrollRestoring && rl.set((y) => (y[d] || (y[d] = {}), y))));
    }));
}
function yS(a) {
  if (typeof document < "u" && document.querySelector) {
    const i = a.state.location.state.__hashScrollIntoViewOptions ?? !0;
    if (i && a.state.location.hash !== "") {
      const r = document.getElementById(a.state.location.hash);
      r && r.scrollIntoView(i);
    }
  }
}
function o0(a, i = String) {
  const r = new URLSearchParams();
  for (const o in a) {
    const l = a[o];
    l !== void 0 && r.set(o, i(l));
  }
  return r.toString();
}
function ff(a) {
  return a ? (a === "false" ? !1 : a === "true" ? !0 : +a * 0 === 0 && +a + "" === a ? +a : a) : "";
}
function vS(a) {
  const i = new URLSearchParams(a),
    r = {};
  for (const [o, l] of i.entries()) {
    const f = r[o];
    f == null ? (r[o] = ff(l)) : Array.isArray(f) ? f.push(ff(l)) : (r[o] = [f, ff(l)]);
  }
  return r;
}
const bS = _S(JSON.parse),
  SS = xS(JSON.stringify, JSON.parse);
function _S(a) {
  return (i) => {
    i[0] === "?" && (i = i.substring(1));
    const r = vS(i);
    for (const o in r) {
      const l = r[o];
      if (typeof l == "string")
        try {
          r[o] = a(l);
        } catch {}
    }
    return r;
  };
}
function xS(a, i) {
  const r = typeof i == "function";
  function o(l) {
    if (typeof l == "object" && l !== null)
      try {
        return a(l);
      } catch {}
    else if (r && typeof l == "string")
      try {
        return (i(l), a(l));
      } catch {}
    return l;
  }
  return (l) => {
    const f = o0(l, o);
    return f ? `?${f}` : "";
  };
}
const Ft = "__root__";
function Hf(a) {
  if (((a.statusCode = a.statusCode || a.code || 307), typeof a.href == "string" && yl(a.href)))
    throw new Error(
      `Redirect blocked: unsafe protocol in href "${a.href}". Only ${t0.join(", ")} protocols are allowed.`,
    );
  if (!a.reloadDocument && typeof a.href == "string")
    try {
      (new URL(a.href), (a.reloadDocument = !0));
    } catch {}
  const i = new Headers(a.headers);
  a.href && i.get("Location") === null && i.set("Location", a.href);
  const r = new Response(null, { status: a.statusCode, headers: i });
  if (((r.options = a), a.throw)) throw r;
  return r;
}
function yn(a) {
  return a instanceof Response && !!a.options;
}
function wS(a) {
  if (a !== null && typeof a == "object" && a.isSerializedRedirect) return Hf(a);
}
const fl = (a) => {
    var i;
    if (!a.rendered) return ((a.rendered = !0), (i = a.onReady) == null ? void 0 : i.call(a));
  },
  Nl = (a, i) => !!(a.preload && !a.router.state.matches.some((r) => r.id === i)),
  Er = (a, i, r = !0) => {
    const o = { ...(a.router.options.context ?? {}) },
      l = r ? i : i - 1;
    for (let f = 0; f <= l; f++) {
      const d = a.matches[f];
      if (!d) continue;
      const h = a.router.getMatch(d.id);
      h && Object.assign(o, h.__routeContext, h.__beforeLoadContext);
    }
    return o;
  },
  l0 = (a, i) => {
    var l;
    const r = a.router.routesById[i.routeId ?? ""] ?? a.router.routeTree;
    (!r.options.notFoundComponent &&
      (l = a.router.options) != null &&
      l.defaultNotFoundComponent &&
      (r.options.notFoundComponent = a.router.options.defaultNotFoundComponent),
      Pt(r.options.notFoundComponent));
    const o = a.matches.find((f) => f.routeId === r.id);
    (Pt(o, "Could not find match for route: " + r.id),
      a.updateMatch(o.id, (f) => ({ ...f, status: "notFound", error: i, isFetching: !1 })),
      i.routerCode === "BEFORE_LOAD" &&
        r.parentRoute &&
        ((i.routeId = r.parentRoute.id), l0(a, i)));
  },
  qa = (a, i, r) => {
    var o, l, f;
    if (!(!yn(r) && !Dt(r))) {
      if (yn(r) && r.redirectHandled && !r.options.reloadDocument) throw r;
      if (i) {
        ((o = i._nonReactive.beforeLoadPromise) == null || o.resolve(),
          (l = i._nonReactive.loaderPromise) == null || l.resolve(),
          (i._nonReactive.beforeLoadPromise = void 0),
          (i._nonReactive.loaderPromise = void 0));
        const d = yn(r) ? "redirected" : "notFound";
        ((i._nonReactive.error = r),
          a.updateMatch(i.id, (h) => ({
            ...h,
            status: d,
            context: Er(a, i.index),
            isFetching: !1,
            error: r,
          })),
          Dt(r) && !r.routeId && (r.routeId = i.routeId),
          (f = i._nonReactive.loadPromise) == null || f.resolve());
      }
      throw yn(r)
        ? ((a.rendered = !0),
          (r.options._fromLocation = a.location),
          (r.redirectHandled = !0),
          (r = a.router.resolveRedirect(r)),
          r)
        : (l0(a, r), r);
    }
  },
  c0 = (a, i) => {
    const r = a.router.getMatch(i);
    return !!(
      (!a.router.isServer && r._nonReactive.dehydrated) ||
      (a.router.isServer && r.ssr === !1)
    );
  },
  As = (a, i, r, o) => {
    var h, y;
    const { id: l, routeId: f } = a.matches[i],
      d = a.router.looseRoutesById[f];
    if (r instanceof Promise) throw r;
    ((r.routerCode = o),
      a.firstBadMatchIndex ?? (a.firstBadMatchIndex = i),
      qa(a, a.router.getMatch(l), r));
    try {
      (y = (h = d.options).onError) == null || y.call(h, r);
    } catch (p) {
      ((r = p), qa(a, a.router.getMatch(l), r));
    }
    a.updateMatch(l, (p) => {
      var b, g;
      return (
        (b = p._nonReactive.beforeLoadPromise) == null || b.resolve(),
        (p._nonReactive.beforeLoadPromise = void 0),
        (g = p._nonReactive.loadPromise) == null || g.resolve(),
        {
          ...p,
          error: r,
          status: "error",
          isFetching: !1,
          updatedAt: Date.now(),
          abortController: new AbortController(),
        }
      );
    });
  },
  ES = (a, i, r, o) => {
    var E;
    const l = a.router.getMatch(i),
      f = (E = a.matches[r - 1]) == null ? void 0 : E.id,
      d = f ? a.router.getMatch(f) : void 0;
    if (a.router.isShell()) {
      l.ssr = o.id === Ft;
      return;
    }
    if ((d == null ? void 0 : d.ssr) === !1) {
      l.ssr = !1;
      return;
    }
    const h = (R) => (R === !0 && (d == null ? void 0 : d.ssr) === "data-only" ? "data-only" : R),
      y = a.router.options.defaultSsr ?? !0;
    if (o.options.ssr === void 0) {
      l.ssr = h(y);
      return;
    }
    if (typeof o.options.ssr != "function") {
      l.ssr = h(o.options.ssr);
      return;
    }
    const { search: p, params: b } = l,
      g = {
        search: sl(p, l.searchError),
        params: sl(b, l.paramsError),
        location: a.location,
        matches: a.matches.map((R) => ({
          index: R.index,
          pathname: R.pathname,
          fullPath: R.fullPath,
          staticData: R.staticData,
          id: R.id,
          routeId: R.routeId,
          search: sl(R.search, R.searchError),
          params: sl(R.params, R.paramsError),
          ssr: R.ssr,
        })),
      },
      S = o.options.ssr(g);
    if (Ya(S))
      return S.then((R) => {
        l.ssr = h(R ?? y);
      });
    l.ssr = h(S ?? y);
  },
  u0 = (a, i, r, o) => {
    var d;
    if (o._nonReactive.pendingTimeout !== void 0) return;
    const l = r.options.pendingMs ?? a.router.options.defaultPendingMs;
    if (
      !!(
        a.onReady &&
        !a.router.isServer &&
        !Nl(a, i) &&
        (r.options.loader || r.options.beforeLoad || h0(r)) &&
        typeof l == "number" &&
        l !== 1 / 0 &&
        (r.options.pendingComponent ??
          ((d = a.router.options) == null ? void 0 : d.defaultPendingComponent))
      )
    ) {
      const h = setTimeout(() => {
        fl(a);
      }, l);
      o._nonReactive.pendingTimeout = h;
    }
  },
  TS = (a, i, r) => {
    const o = a.router.getMatch(i);
    if (!o._nonReactive.beforeLoadPromise && !o._nonReactive.loaderPromise) return;
    u0(a, i, r, o);
    const l = () => {
      const f = a.router.getMatch(i);
      f.preload && (f.status === "redirected" || f.status === "notFound") && qa(a, f, f.error);
    };
    return o._nonReactive.beforeLoadPromise ? o._nonReactive.beforeLoadPromise.then(l) : l();
  },
  RS = (a, i, r, o) => {
    var I;
    const l = a.router.getMatch(i),
      f = l._nonReactive.loadPromise;
    l._nonReactive.loadPromise = wi(() => {
      f == null || f.resolve();
    });
    const { paramsError: d, searchError: h } = l;
    (d && As(a, r, d, "PARSE_PARAMS"), h && As(a, r, h, "VALIDATE_SEARCH"), u0(a, i, o, l));
    const y = new AbortController(),
      p = (I = a.matches[r - 1]) == null ? void 0 : I.id,
      b = p ? a.router.getMatch(p) : void 0;
    (b == null ? void 0 : b.context) ?? a.router.options.context;
    let g = !1;
    const S = () => {
        g ||
          ((g = !0),
          a.updateMatch(i, (B) => ({
            ...B,
            isFetching: "beforeLoad",
            fetchCount: B.fetchCount + 1,
            abortController: y,
          })));
      },
      E = () => {
        var B;
        ((B = l._nonReactive.beforeLoadPromise) == null || B.resolve(),
          (l._nonReactive.beforeLoadPromise = void 0),
          a.updateMatch(i, (te) => ({ ...te, isFetching: !1 })));
      };
    if (!o.options.beforeLoad) {
      wr(() => {
        (S(), E());
      });
      return;
    }
    l._nonReactive.beforeLoadPromise = wi();
    const R = { ...Er(a, r, !1), ...l.__routeContext },
      { search: k, params: L, cause: A } = l,
      G = Nl(a, i),
      Z = {
        search: k,
        abortController: y,
        params: L,
        preload: G,
        context: R,
        location: a.location,
        navigate: (B) => a.router.navigate({ ...B, _fromLocation: a.location }),
        buildLocation: a.router.buildLocation,
        cause: G ? "preload" : A,
        matches: a.matches,
        ...a.router.options.additionalContext,
      },
      P = (B) => {
        if (B === void 0) {
          wr(() => {
            (S(), E());
          });
          return;
        }
        ((yn(B) || Dt(B)) && (S(), As(a, r, B, "BEFORE_LOAD")),
          wr(() => {
            (S(), a.updateMatch(i, (te) => ({ ...te, __beforeLoadContext: B })), E());
          }));
      };
    let K;
    try {
      if (((K = o.options.beforeLoad(Z)), Ya(K)))
        return (
          S(),
          K.catch((B) => {
            As(a, r, B, "BEFORE_LOAD");
          }).then(P)
        );
    } catch (B) {
      (S(), As(a, r, B, "BEFORE_LOAD"));
    }
    P(K);
  },
  AS = (a, i) => {
    const { id: r, routeId: o } = a.matches[i],
      l = a.router.looseRoutesById[o],
      f = () => {
        if (a.router.isServer) {
          const y = ES(a, r, i, l);
          if (Ya(y)) return y.then(h);
        }
        return h();
      },
      d = () => RS(a, r, i, l),
      h = () => {
        if (c0(a, r)) return;
        const y = TS(a, r, l);
        return Ya(y) ? y.then(d) : d();
      };
    return f();
  },
  MS = (a, i, r) => {
    var f, d, h, y, p, b;
    const o = a.router.getMatch(i);
    if (!o || (!r.options.head && !r.options.scripts && !r.options.headers)) return;
    const l = {
      ssr: a.router.options.ssr,
      matches: a.matches,
      match: o,
      params: o.params,
      loaderData: o.loaderData,
    };
    return Promise.all([
      (d = (f = r.options).head) == null ? void 0 : d.call(f, l),
      (y = (h = r.options).scripts) == null ? void 0 : y.call(h, l),
      (b = (p = r.options).headers) == null ? void 0 : b.call(p, l),
    ]).then(([g, S, E]) => {
      const R = g == null ? void 0 : g.meta,
        k = g == null ? void 0 : g.links,
        L = g == null ? void 0 : g.scripts,
        A = g == null ? void 0 : g.styles;
      return { meta: R, links: k, headScripts: L, headers: E, scripts: S, styles: A };
    });
  },
  f0 = (a, i, r, o) => {
    const l = a.matchPromises[r - 1],
      { params: f, loaderDeps: d, abortController: h, cause: y } = a.router.getMatch(i),
      p = Er(a, r),
      b = Nl(a, i);
    return {
      params: f,
      deps: d,
      preload: !!b,
      parentMatchPromise: l,
      abortController: h,
      context: p,
      location: a.location,
      navigate: (g) => a.router.navigate({ ...g, _fromLocation: a.location }),
      cause: b ? "preload" : y,
      route: o,
      ...a.router.options.additionalContext,
    };
  },
  rg = async (a, i, r, o) => {
    var l, f, d, h, y, p;
    try {
      const b = a.router.getMatch(i);
      try {
        (!a.router.isServer || b.ssr === !0) && d0(o);
        const g = (f = (l = o.options).loader) == null ? void 0 : f.call(l, f0(a, i, r, o)),
          S = o.options.loader && Ya(g);
        if (
          (!!(
            S ||
            o._lazyPromise ||
            o._componentsPromise ||
            o.options.head ||
            o.options.scripts ||
            o.options.headers ||
            b._nonReactive.minPendingPromise
          ) && a.updateMatch(i, (k) => ({ ...k, isFetching: "loader" })),
          o.options.loader)
        ) {
          const k = S ? await g : g;
          (qa(a, a.router.getMatch(i), k),
            k !== void 0 && a.updateMatch(i, (L) => ({ ...L, loaderData: k })));
        }
        o._lazyPromise && (await o._lazyPromise);
        const R = b._nonReactive.minPendingPromise;
        (R && (await R),
          o._componentsPromise && (await o._componentsPromise),
          a.updateMatch(i, (k) => ({
            ...k,
            error: void 0,
            context: Er(a, r),
            status: "success",
            isFetching: !1,
            updatedAt: Date.now(),
          })));
      } catch (g) {
        let S = g;
        if ((S == null ? void 0 : S.name) === "AbortError") {
          a.updateMatch(i, (R) => ({
            ...R,
            status: R.status === "pending" ? "success" : R.status,
            isFetching: !1,
            context: Er(a, r),
          }));
          return;
        }
        const E = b._nonReactive.minPendingPromise;
        (E && (await E),
          Dt(g) &&
            (await ((h = (d = o.options.notFoundComponent) == null ? void 0 : d.preload) == null
              ? void 0
              : h.call(d))),
          qa(a, a.router.getMatch(i), g));
        try {
          (p = (y = o.options).onError) == null || p.call(y, g);
        } catch (R) {
          ((S = R), qa(a, a.router.getMatch(i), R));
        }
        a.updateMatch(i, (R) => ({
          ...R,
          error: S,
          context: Er(a, r),
          status: "error",
          isFetching: !1,
        }));
      }
    } catch (b) {
      const g = a.router.getMatch(i);
      (g && (g._nonReactive.loaderPromise = void 0), qa(a, g, b));
    }
  },
  CS = async (a, i) => {
    var p, b;
    const { id: r, routeId: o } = a.matches[i];
    let l = !1,
      f = !1;
    const d = a.router.looseRoutesById[o];
    if (c0(a, r)) {
      if (a.router.isServer) return a.router.getMatch(r);
    } else {
      const g = a.router.getMatch(r);
      if (g._nonReactive.loaderPromise) {
        if (g.status === "success" && !a.sync && !g.preload) return g;
        await g._nonReactive.loaderPromise;
        const S = a.router.getMatch(r),
          E = S._nonReactive.error || S.error;
        E && qa(a, S, E);
      } else {
        const S = Date.now() - g.updatedAt,
          E = Nl(a, r),
          R = E
            ? (d.options.preloadStaleTime ?? a.router.options.defaultPreloadStaleTime ?? 3e4)
            : (d.options.staleTime ?? a.router.options.defaultStaleTime ?? 0),
          k = d.options.shouldReload,
          L = typeof k == "function" ? k(f0(a, r, i, d)) : k,
          A = !!E && !a.router.state.matches.some((K) => K.id === r),
          G = a.router.getMatch(r);
        ((G._nonReactive.loaderPromise = wi()),
          A !== G.preload && a.updateMatch(r, (K) => ({ ...K, preload: A })));
        const { status: Z, invalid: P } = G;
        ((l = Z === "success" && (P || (L ?? S > R))),
          (E && d.options.preload === !1) ||
            (l && !a.sync
              ? ((f = !0),
                (async () => {
                  var K, I;
                  try {
                    await rg(a, r, i, d);
                    const B = a.router.getMatch(r);
                    ((K = B._nonReactive.loaderPromise) == null || K.resolve(),
                      (I = B._nonReactive.loadPromise) == null || I.resolve(),
                      (B._nonReactive.loaderPromise = void 0));
                  } catch (B) {
                    yn(B) && (await a.router.navigate(B.options));
                  }
                })())
              : (Z !== "success" || (l && a.sync)) && (await rg(a, r, i, d))));
      }
    }
    const h = a.router.getMatch(r);
    (f ||
      ((p = h._nonReactive.loaderPromise) == null || p.resolve(),
      (b = h._nonReactive.loadPromise) == null || b.resolve()),
      clearTimeout(h._nonReactive.pendingTimeout),
      (h._nonReactive.pendingTimeout = void 0),
      f || (h._nonReactive.loaderPromise = void 0),
      (h._nonReactive.dehydrated = void 0));
    const y = f ? h.isFetching : !1;
    return y !== h.isFetching || h.invalid !== !1
      ? (a.updateMatch(r, (g) => ({ ...g, isFetching: y, invalid: !1 })), a.router.getMatch(r))
      : h;
  };
async function sg(a) {
  const i = Object.assign(a, { matchPromises: [] });
  !i.router.isServer && i.router.state.matches.some((r) => r._forcePending) && fl(i);
  try {
    for (let h = 0; h < i.matches.length; h++) {
      const y = AS(i, h);
      Ya(y) && (await y);
    }
    const r = i.firstBadMatchIndex ?? i.matches.length;
    for (let h = 0; h < r; h++) i.matchPromises.push(CS(i, h));
    const l = (await Promise.allSettled(i.matchPromises))
      .filter((h) => h.status === "rejected")
      .map((h) => h.reason);
    let f;
    for (const h of l) {
      if (yn(h)) throw h;
      !f && Dt(h) && (f = h);
    }
    for (const h of i.matches) {
      const { id: y, routeId: p } = h,
        b = i.router.looseRoutesById[p];
      try {
        const g = MS(i, y, b);
        if (g) {
          const S = await g;
          i.updateMatch(y, (E) => ({ ...E, ...S }));
        }
      } catch (g) {
        console.error(`Error executing head for route ${p}:`, g);
      }
    }
    if (f) throw f;
    const d = fl(i);
    Ya(d) && (await d);
  } catch (r) {
    if (Dt(r) && !i.preload) {
      const o = fl(i);
      throw (Ya(o) && (await o), r);
    }
    if (yn(r)) throw r;
  }
  return i.matches;
}
async function d0(a) {
  if (
    (!a._lazyLoaded &&
      a._lazyPromise === void 0 &&
      (a.lazyFn
        ? (a._lazyPromise = a.lazyFn().then((i) => {
            const { id: r, ...o } = i.options;
            (Object.assign(a.options, o), (a._lazyLoaded = !0), (a._lazyPromise = void 0));
          }))
        : (a._lazyLoaded = !0)),
    !a._componentsLoaded && a._componentsPromise === void 0)
  ) {
    const i = () => {
      var o;
      const r = [];
      for (const l of m0) {
        const f = (o = a.options[l]) == null ? void 0 : o.preload;
        f && r.push(f());
      }
      if (r.length)
        return Promise.all(r).then(() => {
          ((a._componentsLoaded = !0), (a._componentsPromise = void 0));
        });
      ((a._componentsLoaded = !0), (a._componentsPromise = void 0));
    };
    a._componentsPromise = a._lazyPromise ? a._lazyPromise.then(i) : i();
  }
  return a._componentsPromise;
}
function sl(a, i) {
  return i ? { status: "error", error: i } : { status: "success", value: a };
}
function h0(a) {
  var i;
  for (const r of m0) if ((i = a.options[r]) != null && i.preload) return !0;
  return !1;
}
const m0 = ["component", "errorComponent", "pendingComponent", "notFoundComponent"];
function kS(a) {
  return {
    input: ({ url: i }) => {
      for (const r of a) i = Tf(r, i);
      return i;
    },
    output: ({ url: i }) => {
      for (let r = a.length - 1; r >= 0; r--) i = p0(a[r], i);
      return i;
    },
  };
}
function OS(a) {
  const i = r0(a.basepath),
    r = `/${i}`,
    o = `${r}/`,
    l = a.caseSensitive ? r : r.toLowerCase(),
    f = a.caseSensitive ? o : o.toLowerCase();
  return {
    input: ({ url: d }) => {
      const h = a.caseSensitive ? d.pathname : d.pathname.toLowerCase();
      return (
        h === l ? (d.pathname = "/") : h.startsWith(f) && (d.pathname = d.pathname.slice(r.length)),
        d
      );
    },
    output: ({ url: d }) => ((d.pathname = ul(["/", i, d.pathname])), d),
  };
}
function Tf(a, i) {
  var o;
  const r = (o = a == null ? void 0 : a.input) == null ? void 0 : o.call(a, { url: i });
  if (r) {
    if (typeof r == "string") return new URL(r);
    if (r instanceof URL) return r;
  }
  return i;
}
function p0(a, i) {
  var o;
  const r = (o = a == null ? void 0 : a.output) == null ? void 0 : o.call(a, { url: i });
  if (r) {
    if (typeof r == "string") return new URL(r);
    if (r instanceof URL) return r;
  }
  return i;
}
function NS(a) {
  return a instanceof Error ? { name: a.name, message: a.message } : { data: a };
}
function xi(a) {
  const i = a.resolvedLocation,
    r = a.location,
    o = (i == null ? void 0 : i.pathname) !== r.pathname,
    l = (i == null ? void 0 : i.href) !== r.href,
    f = (i == null ? void 0 : i.hash) !== r.hash;
  return { fromLocation: i, toLocation: r, pathChanged: o, hrefChanged: l, hashChanged: f };
}
class zS {
  constructor(i) {
    ((this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`),
      (this.shouldViewTransition = void 0),
      (this.isViewTransitionTypesSupported = void 0),
      (this.subscribers = new Set()),
      (this.isScrollRestoring = !1),
      (this.isScrollRestorationSetup = !1),
      (this.startTransition = (r) => r()),
      (this.update = (r) => {
        var S;
        r.notFoundRoute &&
          console.warn(
            "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.",
          );
        const o = this.options,
          l = this.basepath ?? (o == null ? void 0 : o.basepath) ?? "/",
          f = this.basepath === void 0,
          d = o == null ? void 0 : o.rewrite;
        ((this.options = { ...o, ...r }),
          (this.isServer = this.options.isServer ?? typeof document > "u"),
          (this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters
            ? new Map(
                this.options.pathParamsAllowedCharacters.map((E) => [encodeURIComponent(E), E]),
              )
            : void 0),
          (!this.history || (this.options.history && this.options.history !== this.history)) &&
            (this.options.history
              ? (this.history = this.options.history)
              : this.isServer || (this.history = Vb())),
          (this.origin = this.options.origin),
          this.origin ||
            (!this.isServer && window != null && window.origin && window.origin !== "null"
              ? (this.origin = window.origin)
              : (this.origin = "http://localhost")),
          this.history && this.updateLatestLocation(),
          this.options.routeTree !== this.routeTree &&
            ((this.routeTree = this.options.routeTree), this.buildRouteTree()),
          !this.__store &&
            this.latestLocation &&
            ((this.__store = new Hb(LS(this.latestLocation), {
              onUpdate: () => {
                this.__store.state = {
                  ...this.state,
                  cachedMatches: this.state.cachedMatches.filter(
                    (E) => !["redirected"].includes(E.status),
                  ),
                };
              },
            })),
            gS(this)));
        let h = !1;
        const y = this.options.basepath ?? "/",
          p = this.options.rewrite;
        if (f || l !== y || d !== p) {
          this.basepath = y;
          const E = [];
          (r0(y) !== "" && E.push(OS({ basepath: y })),
            p && E.push(p),
            (this.rewrite = E.length === 0 ? void 0 : E.length === 1 ? E[0] : kS(E)),
            this.history && this.updateLatestLocation(),
            (h = !0));
        }
        (h &&
          this.__store &&
          (this.__store.state = { ...this.state, location: this.latestLocation }),
          typeof window < "u" &&
            "CSS" in window &&
            typeof ((S = window.CSS) == null ? void 0 : S.supports) == "function" &&
            (this.isViewTransitionTypesSupported = window.CSS.supports(
              "selector(:active-view-transition-type(a)",
            )));
      }),
      (this.updateLatestLocation = () => {
        this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
      }),
      (this.buildRouteTree = () => {
        const {
          routesById: r,
          routesByPath: o,
          processedTree: l,
        } = rS(this.routeTree, this.options.caseSensitive, (d, h) => {
          d.init({ originalIndex: h });
        });
        (this.options.routeMasks && eS(this.options.routeMasks, l),
          (this.routesById = r),
          (this.routesByPath = o),
          (this.processedTree = l));
        const f = this.options.notFoundRoute;
        f && (f.init({ originalIndex: 99999999999 }), (this.routesById[f.id] = f));
      }),
      (this.subscribe = (r, o) => {
        const l = { eventType: r, fn: o };
        return (
          this.subscribers.add(l),
          () => {
            this.subscribers.delete(l);
          }
        );
      }),
      (this.emit = (r) => {
        this.subscribers.forEach((o) => {
          o.eventType === r.type && o.fn(r);
        });
      }),
      (this.parseLocation = (r, o) => {
        const l = ({ href: y, state: p }) => {
            const b = new URL(y, this.origin),
              g = Tf(this.rewrite, b),
              S = this.options.parseSearch(g.search),
              E = this.options.stringifySearch(S);
            return (
              (g.search = E),
              {
                href: g.href.replace(g.origin, ""),
                publicHref: y,
                url: g,
                pathname: rf(g.pathname),
                searchStr: E,
                search: gn(o == null ? void 0 : o.search, S),
                hash: rf(g.hash.split("#").reverse()[0] ?? ""),
                state: gn(o == null ? void 0 : o.state, p),
              }
            );
          },
          f = l(r),
          { __tempLocation: d, __tempKey: h } = f.state;
        if (d && (!h || h === this.tempLocationKey)) {
          const y = l(d);
          return (
            (y.state.key = f.state.key),
            (y.state.__TSR_key = f.state.__TSR_key),
            delete y.state.__tempLocation,
            { ...y, maskedLocation: f }
          );
        }
        return f;
      }),
      (this.resolvePathCache = vl(1e3)),
      (this.resolvePathWithBase = (r, o) =>
        uS({
          base: r,
          to: Bf(o),
          trailingSlash: this.options.trailingSlash,
          cache: this.resolvePathCache,
        })),
      (this.matchRoutes = (r, o, l) =>
        typeof r == "string"
          ? this.matchRoutesInternal({ pathname: r, search: o }, l)
          : this.matchRoutesInternal(r, o)),
      (this.getMatchedRoutes = (r) =>
        jS({ pathname: r, routesById: this.routesById, processedTree: this.processedTree })),
      (this.cancelMatch = (r) => {
        const o = this.getMatch(r);
        o &&
          (o.abortController.abort(),
          clearTimeout(o._nonReactive.pendingTimeout),
          (o._nonReactive.pendingTimeout = void 0));
      }),
      (this.cancelMatches = () => {
        const r = this.state.matches.filter((f) => f.status === "pending"),
          o = this.state.matches.filter((f) => f.isFetching === "loader");
        new Set([...(this.state.pendingMatches ?? []), ...r, ...o]).forEach((f) => {
          this.cancelMatch(f.id);
        });
      }),
      (this.buildLocation = (r) => {
        const o = (f = {}) => {
            var Ue, pe;
            const d = f._fromLocation || this.pendingBuiltLocation || this.latestLocation,
              h = this.matchRoutes(d, { _buildLocation: !0 }),
              y = pl(h);
            f.from;
            const p = f.unsafeRelative === "path" ? d.pathname : (f.from ?? y.fullPath),
              b = this.resolvePathWithBase(p, "."),
              g = y.search,
              S = { ...y.params },
              E = f.to ? this.resolvePathWithBase(b, `${f.to}`) : this.resolvePathWithBase(b, "."),
              R =
                f.params === !1 || f.params === null
                  ? {}
                  : (f.params ?? !0) === !0
                    ? S
                    : Object.assign(S, Ha(f.params, S)),
              k = uf({ path: E, params: R }).interpolatedPath,
              L = this.matchRoutes(k, void 0, { _buildLocation: !0 }),
              A = L.map((C) => this.looseRoutesById[C.routeId]),
              G = L.find((C) => C.globalNotFound);
            if (Object.keys(R).length > 0)
              for (const C of A) {
                const H =
                  ((Ue = C.options.params) == null ? void 0 : Ue.stringify) ??
                  C.options.stringifyParams;
                H && Object.assign(R, H(R));
              }
            const Z = r.leaveParams
              ? E
              : rf(
                  uf({ path: E, params: R, decodeCharMap: this.pathParamsDecodeCharMap })
                    .interpolatedPath,
                );
            let P = g;
            if (r._includeValidateSearch && (pe = this.options.search) != null && pe.strict) {
              const C = {};
              (A.forEach((H) => {
                if (H.options.validateSearch)
                  try {
                    Object.assign(C, Rf(H.options.validateSearch, { ...C, ...P }));
                  } catch {}
              }),
                (P = C));
            }
            ((P = HS({
              search: P,
              dest: f,
              destRoutes: A,
              _includeValidateSearch: r._includeValidateSearch,
            })),
              (P = gn(g, P)));
            const K = this.options.stringifySearch(P),
              I = f.hash === !0 ? d.hash : f.hash ? Ha(f.hash, d.hash) : void 0,
              B = I ? `#${I}` : "";
            let te = f.state === !0 ? d.state : f.state ? Ha(f.state, d.state) : {};
            te = gn(d.state, te);
            const ae = BS({
                routes: A,
                params: R,
                searchStr: K,
                globalNotFoundRouteId: G == null ? void 0 : G.routeId,
              }),
              X = `${Z}${K}${B}`,
              ee = new URL(X, this.origin),
              ue = p0(this.rewrite, ee),
              ge = ee.href.replace(ee.origin, "");
            return {
              publicHref: ue.pathname + ue.search + ue.hash,
              href: ge,
              url: ue,
              pathname: Z,
              search: P,
              searchStr: K,
              state: te,
              hash: I ?? "",
              unmaskOnReload: f.unmaskOnReload,
              _matchSnapshot: ae,
            };
          },
          l = (f = {}, d) => {
            const h = o(f);
            let y = d ? o(d) : void 0;
            if (!y) {
              const p = {};
              if (this.options.routeMasks) {
                const b = tS(h.pathname, this.processedTree);
                if (b) {
                  Object.assign(p, b.rawParams);
                  const { from: g, params: S, ...E } = b.route,
                    R =
                      S === !1 || S === null
                        ? {}
                        : (S ?? !0) === !0
                          ? p
                          : Object.assign(p, Ha(S, p));
                  ((d = { from: r.from, ...E, params: R }), (y = o(d)));
                }
              }
            }
            return (y && (h.maskedLocation = y), h);
          };
        return r.mask ? l(r, { from: r.from, ...r.mask }) : l(r);
      }),
      (this.commitLocation = async ({ viewTransition: r, ignoreBlocker: o, ...l }) => {
        var R;
        const f = () => {
            const k = ["key", "__TSR_key", "__TSR_index", "__hashScrollIntoViewOptions"];
            k.forEach((A) => {
              l.state[A] = this.latestLocation.state[A];
            });
            const L = _i(l.state, this.latestLocation.state);
            return (
              k.forEach((A) => {
                delete l.state[A];
              }),
              L
            );
          },
          d = aa(this.latestLocation.href) === aa(l.href),
          h = this.commitLocationPromise;
        if (
          ((this.commitLocationPromise = wi(() => {
            h == null || h.resolve();
          })),
          d && f())
        )
          return (this.load(), this.commitLocationPromise);
        let { maskedLocation: y, hashScrollIntoView: p, url: b, ...g } = l;
        (y &&
          ((g = {
            ...y,
            state: {
              ...y.state,
              __tempKey: void 0,
              __tempLocation: {
                ...g,
                search: g.searchStr,
                state: {
                  ...g.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0,
                },
              },
            },
          }),
          (g.unmaskOnReload ?? this.options.unmaskOnReload ?? !1) &&
            (g.state.__tempKey = this.tempLocationKey)),
          (g.state.__hashScrollIntoViewOptions = p ?? this.options.defaultHashScrollIntoView ?? !0),
          (g.state.__TSR_resetScroll = l.resetScroll ?? !0),
          (this.shouldViewTransition = r),
          (g.state.__TSR_sessionId = this.sessionId),
          (g.state.__TSR_matches =
            l._matchSnapshot ??
            US({
              matchResult: this.getMatchedRoutes(l.pathname),
              pathname: l.pathname,
              searchStr: l.searchStr,
              notFoundRoute: this.options.notFoundRoute,
              notFoundMode: this.options.notFoundMode,
            })));
        const S = { ...l, publicHref: g.publicHref, state: g.state, maskedLocation: y };
        return (
          await this.history[l.replace ? "replace" : "push"](g.publicHref, g.state, {
            ignoreBlocker: o,
            skipTransitionerLoad: !0,
          })
        ).type === "BLOCKED"
          ? ((R = this.commitLocationPromise) == null || R.resolve(), this.commitLocationPromise)
          : this.history.location.href !== g.publicHref
            ? this.commitLocationPromise
            : ((this.latestLocation = S),
              this.load({ _skipUpdateLatestLocation: !0 }),
              this.commitLocationPromise);
      }),
      (this.buildAndCommitLocation = ({
        replace: r,
        resetScroll: o,
        hashScrollIntoView: l,
        viewTransition: f,
        ignoreBlocker: d,
        href: h,
        ...y
      } = {}) => {
        if (h) {
          const g = this.history.location.state.__TSR_index,
            S = ml(h, { __TSR_index: r ? g : g + 1 }),
            E = new URL(S.pathname, this.origin),
            R = Tf(this.rewrite, E);
          ((y.to = R.pathname),
            (y.search = this.options.parseSearch(S.search)),
            (y.hash = S.hash.slice(1)));
        }
        const p = this.buildLocation({ ...y, _includeValidateSearch: !0 });
        this.pendingBuiltLocation = p;
        const b = this.commitLocation({
          ...p,
          viewTransition: f,
          replace: r,
          resetScroll: o,
          hashScrollIntoView: l,
          ignoreBlocker: d,
        });
        return (
          Promise.resolve().then(() => {
            this.pendingBuiltLocation === p && (this.pendingBuiltLocation = void 0);
          }),
          b
        );
      }),
      (this.navigate = async ({ to: r, reloadDocument: o, href: l, publicHref: f, ...d }) => {
        var y;
        let h = !1;
        if (l)
          try {
            (new URL(`${l}`), (h = !0));
          } catch {}
        if ((h && !o && (o = !0), o)) {
          if (r !== void 0 || !l) {
            const b = this.buildLocation({ to: r, ...d });
            ((l = l ?? b.url.href), (f = f ?? b.url.href));
          }
          const p = !h && f ? f : l;
          if (yl(p)) return Promise.resolve();
          if (!d.ignoreBlocker) {
            const b = this.history,
              g = ((y = b.getBlockers) == null ? void 0 : y.call(b)) ?? [];
            for (const S of g)
              if (
                S != null &&
                S.blockerFn &&
                (await S.blockerFn({
                  currentLocation: this.latestLocation,
                  nextLocation: this.latestLocation,
                  action: "PUSH",
                }))
              )
                return Promise.resolve();
          }
          return (
            d.replace ? window.location.replace(p) : (window.location.href = p), Promise.resolve()
          );
        }
        return this.buildAndCommitLocation({ ...d, href: l, to: r, _isNavigate: !0 });
      }),
      (this.beforeLoad = (r) => {
        if (
          (this.cancelMatches(),
          (r != null && r._skipUpdateLatestLocation) || this.updateLatestLocation(),
          this.isServer)
        ) {
          const f = this.buildLocation({
            to: this.latestLocation.pathname,
            search: !0,
            params: !0,
            hash: !0,
            state: !0,
            _includeValidateSearch: !0,
          });
          if (this.latestLocation.publicHref !== f.publicHref || f.url.origin !== this.origin) {
            const d = this.getParsedLocationHref(f);
            throw Hf({ href: d });
          }
        }
        const o =
            this.latestLocation.state.__TSR_sessionId === this.sessionId
              ? this.latestLocation.state.__TSR_matches
              : void 0,
          l = this.matchRoutes(this.latestLocation, { snapshot: o });
        this.__store.setState((f) => ({
          ...f,
          status: "pending",
          statusCode: 200,
          isLoading: !0,
          location: this.latestLocation,
          pendingMatches: l,
          cachedMatches: f.cachedMatches.filter((d) => !l.some((h) => h.id === d.id)),
        }));
      }),
      (this.load = async (r) => {
        let o, l, f;
        for (
          f = new Promise((h) => {
            this.startTransition(async () => {
              var y;
              try {
                this.beforeLoad({
                  _skipUpdateLatestLocation: r == null ? void 0 : r._skipUpdateLatestLocation,
                });
                const p = this.latestLocation,
                  b = this.state.resolvedLocation;
                (this.state.redirect ||
                  this.emit({
                    type: "onBeforeNavigate",
                    ...xi({ resolvedLocation: b, location: p }),
                  }),
                  this.emit({ type: "onBeforeLoad", ...xi({ resolvedLocation: b, location: p }) }),
                  await sg({
                    router: this,
                    sync: r == null ? void 0 : r.sync,
                    matches: this.state.pendingMatches,
                    location: p,
                    updateMatch: this.updateMatch,
                    onReady: async () => {
                      this.startTransition(() => {
                        this.startViewTransition(async () => {
                          let g = [],
                            S = [],
                            E = [];
                          (wr(() => {
                            (this.__store.setState((R) => {
                              const k = R.matches,
                                L = R.pendingMatches || R.matches;
                              return (
                                (g = k.filter((A) => !L.some((G) => G.id === A.id))),
                                (S = L.filter((A) => !k.some((G) => G.id === A.id))),
                                (E = L.filter((A) => k.some((G) => G.id === A.id))),
                                {
                                  ...R,
                                  isLoading: !1,
                                  loadedAt: Date.now(),
                                  matches: L,
                                  pendingMatches: void 0,
                                  cachedMatches: [
                                    ...R.cachedMatches,
                                    ...g.filter(
                                      (A) => A.status !== "error" && A.status !== "notFound",
                                    ),
                                  ],
                                }
                              );
                            }),
                              this.clearExpiredCache());
                          }),
                            [
                              [g, "onLeave"],
                              [S, "onEnter"],
                              [E, "onStay"],
                            ].forEach(([R, k]) => {
                              R.forEach((L) => {
                                var A, G;
                                (G = (A = this.looseRoutesById[L.routeId].options)[k]) == null ||
                                  G.call(A, L);
                              });
                            }));
                        });
                      });
                    },
                  }));
              } catch (p) {
                (yn(p)
                  ? ((o = p),
                    this.isServer ||
                      this.navigate({ ...o.options, replace: !0, ignoreBlocker: !0 }))
                  : Dt(p) && (l = p),
                  this.__store.setState((b) => ({
                    ...b,
                    statusCode: o
                      ? o.status
                      : l
                        ? 404
                        : b.matches.some((g) => g.status === "error")
                          ? 500
                          : 200,
                    redirect: o,
                  })));
              }
              (this.latestLoadPromise === f &&
                ((y = this.commitLocationPromise) == null || y.resolve(),
                (this.latestLoadPromise = void 0),
                (this.commitLocationPromise = void 0)),
                h());
            });
          }),
            this.latestLoadPromise = f,
            await f;
          this.latestLoadPromise && f !== this.latestLoadPromise;
        )
          await this.latestLoadPromise;
        let d;
        (this.hasNotFoundMatch()
          ? (d = 404)
          : this.__store.state.matches.some((h) => h.status === "error") && (d = 500),
          d !== void 0 && this.__store.setState((h) => ({ ...h, statusCode: d })));
      }),
      (this.startViewTransition = (r) => {
        const o = this.shouldViewTransition ?? this.options.defaultViewTransition;
        if (
          (delete this.shouldViewTransition,
          o &&
            typeof document < "u" &&
            "startViewTransition" in document &&
            typeof document.startViewTransition == "function")
        ) {
          let l;
          if (typeof o == "object" && this.isViewTransitionTypesSupported) {
            const f = this.latestLocation,
              d = this.state.resolvedLocation,
              h =
                typeof o.types == "function"
                  ? o.types(xi({ resolvedLocation: d, location: f }))
                  : o.types;
            if (h === !1) {
              r();
              return;
            }
            l = { update: r, types: h };
          } else l = r;
          document.startViewTransition(l);
        } else r();
      }),
      (this.updateMatch = (r, o) => {
        this.startTransition(() => {
          var f;
          const l =
            (f = this.state.pendingMatches) != null && f.some((d) => d.id === r)
              ? "pendingMatches"
              : this.state.matches.some((d) => d.id === r)
                ? "matches"
                : this.state.cachedMatches.some((d) => d.id === r)
                  ? "cachedMatches"
                  : "";
          l &&
            this.__store.setState((d) => {
              var h;
              return {
                ...d,
                [l]: (h = d[l]) == null ? void 0 : h.map((y) => (y.id === r ? o(y) : y)),
              };
            });
        });
      }),
      (this.getMatch = (r) => {
        var l;
        const o = (f) => f.id === r;
        return (
          this.state.cachedMatches.find(o) ??
          ((l = this.state.pendingMatches) == null ? void 0 : l.find(o)) ??
          this.state.matches.find(o)
        );
      }),
      (this.invalidate = (r) => {
        const o = (l) => {
          var f;
          return (((f = r == null ? void 0 : r.filter) == null ? void 0 : f.call(r, l)) ?? !0)
            ? {
                ...l,
                invalid: !0,
                ...((r != null && r.forcePending) || l.status === "error" || l.status === "notFound"
                  ? { status: "pending", error: void 0 }
                  : void 0),
              }
            : l;
        };
        return (
          this.__store.setState((l) => {
            var f;
            return {
              ...l,
              matches: l.matches.map(o),
              cachedMatches: l.cachedMatches.map(o),
              pendingMatches: (f = l.pendingMatches) == null ? void 0 : f.map(o),
            };
          }),
          (this.shouldViewTransition = !1),
          this.load({ sync: r == null ? void 0 : r.sync })
        );
      }),
      (this.getParsedLocationHref = (r) => {
        let o = r.url.href;
        return (
          this.origin && r.url.origin === this.origin && (o = o.replace(this.origin, "") || "/"), o
        );
      }),
      (this.resolveRedirect = (r) => {
        const o = r.headers.get("Location");
        if (r.options.href) {
          if (o)
            try {
              const l = new URL(o);
              if (this.origin && l.origin === this.origin) {
                const f = l.pathname + l.search + l.hash;
                ((r.options.href = f), r.headers.set("Location", f));
              }
            } catch {}
        } else {
          const l = this.buildLocation(r.options),
            f = this.getParsedLocationHref(l);
          ((r.options.href = f), r.headers.set("Location", f));
        }
        return (r.headers.get("Location") || r.headers.set("Location", r.options.href), r);
      }),
      (this.clearCache = (r) => {
        const o = r == null ? void 0 : r.filter;
        o !== void 0
          ? this.__store.setState((l) => ({
              ...l,
              cachedMatches: l.cachedMatches.filter((f) => !o(f)),
            }))
          : this.__store.setState((l) => ({ ...l, cachedMatches: [] }));
      }),
      (this.clearExpiredCache = () => {
        const r = (o) => {
          const l = this.looseRoutesById[o.routeId];
          if (!l.options.loader) return !0;
          const f =
            (o.preload
              ? (l.options.preloadGcTime ?? this.options.defaultPreloadGcTime)
              : (l.options.gcTime ?? this.options.defaultGcTime)) ?? 300 * 1e3;
          return o.status === "error" ? !0 : Date.now() - o.updatedAt >= f;
        };
        this.clearCache({ filter: r });
      }),
      (this.loadRouteChunk = d0),
      (this.preloadRoute = async (r) => {
        const o = this.buildLocation(r);
        let l = this.matchRoutes(o, { throwOnError: !0, preload: !0, dest: r });
        const f = new Set(
            [...this.state.matches, ...(this.state.pendingMatches ?? [])].map((h) => h.id),
          ),
          d = new Set([...f, ...this.state.cachedMatches.map((h) => h.id)]);
        wr(() => {
          l.forEach((h) => {
            d.has(h.id) ||
              this.__store.setState((y) => ({ ...y, cachedMatches: [...y.cachedMatches, h] }));
          });
        });
        try {
          return (
            (l = await sg({
              router: this,
              matches: l,
              location: o,
              preload: !0,
              updateMatch: (h, y) => {
                f.has(h) ? (l = l.map((p) => (p.id === h ? y(p) : p))) : this.updateMatch(h, y);
              },
            })),
            l
          );
        } catch (h) {
          if (yn(h))
            return h.options.reloadDocument
              ? void 0
              : await this.preloadRoute({ ...h.options, _fromLocation: o });
          Dt(h) || console.error(h);
          return;
        }
      }),
      (this.matchRoute = (r, o) => {
        const l = {
            ...r,
            to: r.to ? this.resolvePathWithBase(r.from || "", r.to) : void 0,
            params: r.params || {},
            leaveParams: !0,
          },
          f = this.buildLocation(l);
        if (o != null && o.pending && this.state.status !== "pending") return !1;
        const h = ((o == null ? void 0 : o.pending) === void 0 ? !this.state.isLoading : o.pending)
            ? this.latestLocation
            : this.state.resolvedLocation || this.state.location,
          y = nS(
            f.pathname,
            (o == null ? void 0 : o.caseSensitive) ?? !1,
            (o == null ? void 0 : o.fuzzy) ?? !1,
            h.pathname,
            this.processedTree,
          );
        return !y || (r.params && !_i(y.rawParams, r.params, { partial: !0 }))
          ? !1
          : ((o == null ? void 0 : o.includeSearch) ?? !0)
            ? _i(h.search, f.search, { partial: !0 })
              ? y.rawParams
              : !1
            : y.rawParams;
      }),
      (this.hasNotFoundMatch = () =>
        this.__store.state.matches.some((r) => r.status === "notFound" || r.globalNotFound)),
      (this.sessionId =
        typeof crypto < "u" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`),
      this.update({
        defaultPreloadDelay: 50,
        defaultPendingMs: 1e3,
        defaultPendingMinMs: 500,
        context: void 0,
        ...i,
        caseSensitive: i.caseSensitive ?? !1,
        notFoundMode: i.notFoundMode ?? "fuzzy",
        stringifySearch: i.stringifySearch ?? SS,
        parseSearch: i.parseSearch ?? bS,
      }),
      typeof document < "u" && (self.__TSR_ROUTER__ = this));
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
  matchRoutesInternal(i, r) {
    var E, R;
    const o = r == null ? void 0 : r.snapshot,
      l = o && o.routeIds.length > 0 && o.routeIds.every((k) => this.routesById[k]);
    let f, d, h, y;
    if (l)
      ((f = o.routeIds.map((k) => this.routesById[k])),
        (d = { ...o.params }),
        (h = o.globalNotFoundRouteId),
        (y = o.parsedParams));
    else {
      const k = this.getMatchedRoutes(i.pathname),
        { foundRoute: L, routeParams: A } = k;
      ((d = A), (f = k.matchedRoutes), (y = k.parsedParams));
      let G = !1;
      ((L ? L.path !== "/" && d["**"] : aa(i.pathname)) &&
        (this.options.notFoundRoute ? (f = [...f, this.options.notFoundRoute]) : (G = !0)),
        (h = (() => {
          if (G) {
            if (this.options.notFoundMode !== "root")
              for (let Z = f.length - 1; Z >= 0; Z--) {
                const P = f[Z];
                if (P.children) return P.id;
              }
            return Ft;
          }
        })()));
    }
    const p = [],
      b = (k) =>
        (k == null ? void 0 : k.id)
          ? (k.context ?? this.options.context ?? void 0)
          : (this.options.context ?? void 0),
      g =
        l &&
        o.searchStr === i.searchStr &&
        ((E = o.validatedSearches) == null ? void 0 : E.length) === f.length,
      S = [];
    if (
      (f.forEach((k, L) => {
        var H, ne, ve;
        const A = p[L - 1],
          [G, Z, P] = (() => {
            if (g) {
              const U = o.validatedSearches[L];
              return [U.search, U.strictSearch, void 0];
            }
            const se = (A == null ? void 0 : A.search) ?? i.search,
              x = (A == null ? void 0 : A._strictSearch) ?? void 0;
            try {
              const U = Rf(k.options.validateSearch, { ...se }) ?? void 0;
              return [{ ...se, ...U }, { ...x, ...U }, void 0];
            } catch (U) {
              let Q = U;
              if (
                (U instanceof xl || (Q = new xl(U.message, { cause: U })),
                r != null && r.throwOnError)
              )
                throw Q;
              return [se, {}, Q];
            }
          })();
        g || S.push({ search: G, strictSearch: Z });
        const K =
            ((ne = (H = k.options).loaderDeps) == null ? void 0 : ne.call(H, { search: G })) ?? "",
          I = K ? JSON.stringify(K) : "",
          { interpolatedPath: B, usedParams: te } = uf({
            path: k.fullPath,
            params: d,
            decodeCharMap: this.pathParamsDecodeCharMap,
          }),
          ae = k.id + B + I,
          X = this.getMatch(ae),
          ee = this.state.matches.find((se) => se.routeId === k.id),
          ue = (X == null ? void 0 : X._strictParams) ?? te;
        let ge;
        if (!X)
          if (k.options.skipRouteOnParseError) for (const se in te) se in y && (ue[se] = y[se]);
          else {
            const se =
              ((ve = k.options.params) == null ? void 0 : ve.parse) ?? k.options.parseParams;
            if (se)
              try {
                Object.assign(ue, se(ue));
              } catch (x) {
                if (
                  (Dt(x) || yn(x) ? (ge = x) : (ge = new DS(x.message, { cause: x })),
                  r != null && r.throwOnError)
                )
                  throw ge;
              }
          }
        Object.assign(d, ue);
        const Ue = ee ? "stay" : "enter";
        let pe;
        if (X)
          pe = {
            ...X,
            cause: Ue,
            params: ee ? gn(ee.params, d) : d,
            _strictParams: ue,
            search: gn(ee ? ee.search : X.search, G),
            _strictSearch: Z,
          };
        else {
          const se =
            k.options.loader || k.options.beforeLoad || k.lazyFn || h0(k) ? "pending" : "success";
          pe = {
            id: ae,
            ssr: this.isServer ? void 0 : k.options.ssr,
            index: L,
            routeId: k.id,
            params: ee ? gn(ee.params, d) : d,
            _strictParams: ue,
            pathname: B,
            updatedAt: Date.now(),
            search: ee ? gn(ee.search, G) : G,
            _strictSearch: Z,
            searchError: void 0,
            status: se,
            isFetching: !1,
            error: void 0,
            paramsError: ge,
            __routeContext: void 0,
            _nonReactive: { loadPromise: wi() },
            __beforeLoadContext: void 0,
            context: {},
            abortController: new AbortController(),
            fetchCount: 0,
            cause: Ue,
            loaderDeps: ee ? gn(ee.loaderDeps, K) : K,
            invalid: !1,
            preload: !1,
            links: void 0,
            scripts: void 0,
            headScripts: void 0,
            meta: void 0,
            staticData: k.options.staticData || {},
            fullPath: k.fullPath,
          };
        }
        ((r != null && r.preload) || (pe.globalNotFound = h === k.id), (pe.searchError = P));
        const C = b(A);
        ((pe.context = { ...C, ...pe.__routeContext, ...pe.__beforeLoadContext }), p.push(pe));
      }),
      !g && S.length > 0)
    ) {
      const k = (R = i.state) == null ? void 0 : R.__TSR_matches;
      k && ((k.searchStr = i.searchStr), (k.validatedSearches = S));
    }
    return (
      p.forEach((k, L) => {
        const A = this.looseRoutesById[k.routeId];
        if (!this.getMatch(k.id) && (r == null ? void 0 : r._buildLocation) !== !0) {
          const Z = p[L - 1],
            P = b(Z);
          if (A.options.context) {
            const K = {
              deps: k.loaderDeps,
              params: k.params,
              context: P ?? {},
              location: i,
              navigate: (I) => this.navigate({ ...I, _fromLocation: i }),
              buildLocation: this.buildLocation,
              cause: k.cause,
              abortController: k.abortController,
              preload: !!k.preload,
              matches: p,
            };
            k.__routeContext = A.options.context(K) ?? void 0;
          }
          k.context = { ...P, ...k.__routeContext, ...k.__beforeLoadContext };
        }
      }),
      p
    );
  }
}
class xl extends Error {}
class DS extends Error {}
function LS(a) {
  return {
    loadedAt: 0,
    isLoading: !1,
    isTransitioning: !1,
    status: "idle",
    resolvedLocation: void 0,
    location: a,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200,
  };
}
function Rf(a, i) {
  if (a == null) return {};
  if ("~standard" in a) {
    const r = a["~standard"].validate(i);
    if (r instanceof Promise) throw new xl("Async validation not supported");
    if (r.issues) throw new xl(JSON.stringify(r.issues, void 0, 2), { cause: r });
    return r.value;
  }
  return "parse" in a ? a.parse(i) : typeof a == "function" ? a(i) : {};
}
function jS({ pathname: a, routesById: i, processedTree: r }) {
  const o = {},
    l = aa(a);
  let f,
    d = {};
  const h = aS(l, r, !0);
  return (
    h && ((f = h.route), Object.assign(o, h.rawParams), (d = Object.assign({}, h.parsedParams))),
    {
      matchedRoutes: (h == null ? void 0 : h.branch) || [i[Ft]],
      routeParams: o,
      foundRoute: f,
      parsedParams: d,
    }
  );
}
function US({ matchResult: a, pathname: i, searchStr: r, notFoundRoute: o, notFoundMode: l }) {
  const f = {
    routeIds: a.matchedRoutes.map((h) => h.id),
    params: a.routeParams,
    parsedParams: a.parsedParams,
    searchStr: r,
  };
  if (a.foundRoute ? a.foundRoute.path !== "/" && a.routeParams["**"] : aa(i))
    if (o) f.globalNotFoundRouteId = o.id;
    else {
      if (l !== "root")
        for (let h = a.matchedRoutes.length - 1; h >= 0; h--) {
          const y = a.matchedRoutes[h];
          if (y.children) {
            f.globalNotFoundRouteId = y.id;
            break;
          }
        }
      f.globalNotFoundRouteId || (f.globalNotFoundRouteId = Ft);
    }
  return f;
}
function BS({ routes: a, params: i, searchStr: r, globalNotFoundRouteId: o }) {
  const l = {};
  for (const d in i) {
    const h = i[d];
    h != null && (l[d] = String(h));
  }
  const f = { routeIds: a.map((d) => d.id), params: l, parsedParams: i, searchStr: r };
  return (o && (f.globalNotFoundRouteId = o), f);
}
function HS({ search: a, dest: i, destRoutes: r, _includeValidateSearch: o }) {
  const l =
      r.reduce((h, y) => {
        var b;
        const p = [];
        if ("search" in y.options)
          (b = y.options.search) != null &&
            b.middlewares &&
            p.push(...y.options.search.middlewares);
        else if (y.options.preSearchFilters || y.options.postSearchFilters) {
          const g = ({ search: S, next: E }) => {
            let R = S;
            "preSearchFilters" in y.options &&
              y.options.preSearchFilters &&
              (R = y.options.preSearchFilters.reduce((L, A) => A(L), S));
            const k = E(R);
            return "postSearchFilters" in y.options && y.options.postSearchFilters
              ? y.options.postSearchFilters.reduce((L, A) => A(L), k)
              : k;
          };
          p.push(g);
        }
        if (o && y.options.validateSearch) {
          const g = ({ search: S, next: E }) => {
            const R = E(S);
            try {
              return { ...R, ...(Rf(y.options.validateSearch, R) ?? void 0) };
            } catch {
              return R;
            }
          };
          p.push(g);
        }
        return h.concat(p);
      }, []) ?? [],
    f = ({ search: h }) => (i.search ? (i.search === !0 ? h : Ha(i.search, h)) : {});
  l.push(f);
  const d = (h, y) => {
    if (h >= l.length) return y;
    const p = l[h];
    return p({ search: y, next: (g) => d(h + 1, g) });
  };
  return d(0, a);
}
const zn = Symbol.for("TSR_DEFERRED_PROMISE");
function qS(a, i) {
  const r = a;
  return (
    r[zn] ||
      ((r[zn] = { status: "pending" }),
      r
        .then((o) => {
          ((r[zn].status = "success"), (r[zn].data = o));
        })
        .catch((o) => {
          ((r[zn].status = "error"), (r[zn].error = { data: NS(o), __isServerError: !0 }));
        })),
    r
  );
}
const VS = "Error preloading route! ☝️";
class g0 {
  constructor(i) {
    if (
      ((this.init = (r) => {
        var p, b;
        this.originalIndex = r.originalIndex;
        const o = this.options,
          l = !(o != null && o.path) && !(o != null && o.id);
        ((this.parentRoute = (b = (p = this.options).getParentRoute) == null ? void 0 : b.call(p)),
          l ? (this._path = Ft) : this.parentRoute || Pt(!1));
        let f = l ? Ft : o == null ? void 0 : o.path;
        f && f !== "/" && (f = i0(f));
        const d = (o == null ? void 0 : o.id) || f;
        let h = l ? Ft : ul([this.parentRoute.id === Ft ? "" : this.parentRoute.id, d]);
        (f === Ft && (f = "/"), h !== Ft && (h = ul(["/", h])));
        const y = h === Ft ? "/" : ul([this.parentRoute.fullPath, f]);
        ((this._path = f), (this._id = h), (this._fullPath = y), (this._to = aa(y)));
      }),
      (this.addChildren = (r) => this._addFileChildren(r)),
      (this._addFileChildren = (r) => (
        Array.isArray(r) && (this.children = r),
        typeof r == "object" && r !== null && (this.children = Object.values(r)),
        this
      )),
      (this._addFileTypes = () => this),
      (this.updateLoader = (r) => (Object.assign(this.options, r), this)),
      (this.update = (r) => (Object.assign(this.options, r), this)),
      (this.lazy = (r) => ((this.lazyFn = r), this)),
      (this.redirect = (r) => Hf({ from: this.fullPath, ...r })),
      (this.options = i || {}),
      (this.isRoot = !(i != null && i.getParentRoute)),
      i != null && i.id && i != null && i.path)
    )
      throw new Error("Route cannot have both an 'id' and a 'path' option.");
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
class ZS extends g0 {
  constructor(i) {
    super(i);
  }
}
var YS = ((a) => (
    (a[(a.AggregateError = 1)] = "AggregateError"),
    (a[(a.ArrowFunction = 2)] = "ArrowFunction"),
    (a[(a.ErrorPrototypeStack = 4)] = "ErrorPrototypeStack"),
    (a[(a.ObjectAssign = 8)] = "ObjectAssign"),
    (a[(a.BigIntTypedArray = 16)] = "BigIntTypedArray"),
    (a[(a.RegExp = 32)] = "RegExp"),
    a
  ))(YS || {}),
  ia = Symbol.asyncIterator,
  y0 = Symbol.hasInstance,
  Tr = Symbol.isConcatSpreadable,
  ra = Symbol.iterator,
  v0 = Symbol.match,
  b0 = Symbol.matchAll,
  S0 = Symbol.replace,
  _0 = Symbol.search,
  x0 = Symbol.species,
  w0 = Symbol.split,
  E0 = Symbol.toPrimitive,
  Rr = Symbol.toStringTag,
  T0 = Symbol.unscopables,
  R0 = {
    [ia]: 0,
    [y0]: 1,
    [Tr]: 2,
    [ra]: 3,
    [v0]: 4,
    [b0]: 5,
    [S0]: 6,
    [_0]: 7,
    [x0]: 8,
    [w0]: 9,
    [E0]: 10,
    [Rr]: 11,
    [T0]: 12,
  },
  GS = {
    0: ia,
    1: y0,
    2: Tr,
    3: ra,
    4: v0,
    5: b0,
    6: S0,
    7: _0,
    8: x0,
    9: w0,
    10: E0,
    11: Rr,
    12: T0,
  },
  _ = void 0,
  QS = {
    2: !0,
    3: !1,
    1: _,
    0: null,
    4: -0,
    5: Number.POSITIVE_INFINITY,
    6: Number.NEGATIVE_INFINITY,
    7: Number.NaN,
  },
  XS = {
    0: "Error",
    1: "EvalError",
    2: "RangeError",
    3: "ReferenceError",
    4: "SyntaxError",
    5: "TypeError",
    6: "URIError",
  },
  FS = {
    0: Error,
    1: EvalError,
    2: RangeError,
    3: ReferenceError,
    4: SyntaxError,
    5: TypeError,
    6: URIError,
  };
function Ge(a, i, r, o, l, f, d, h, y, p, b, g) {
  return { t: a, i, s: r, c: o, m: l, p: f, e: d, a: h, f: y, b: p, o: b, l: g };
}
function Fa(a) {
  return Ge(2, _, a, _, _, _, _, _, _, _, _, _);
}
var A0 = Fa(2),
  M0 = Fa(3),
  PS = Fa(1),
  KS = Fa(0),
  IS = Fa(4),
  JS = Fa(5),
  $S = Fa(6),
  WS = Fa(7);
function e1(a) {
  switch (a) {
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
      return _;
  }
}
function Pa(a) {
  let i = "",
    r = 0,
    o;
  for (let l = 0, f = a.length; l < f; l++)
    ((o = e1(a[l])), o && ((i += a.slice(r, l) + o), (r = l + 1)));
  return (r === 0 ? (i = a) : (i += a.slice(r)), i);
}
function t1(a) {
  switch (a) {
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
      return a;
  }
}
function Ai(a) {
  return a.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, t1);
}
var ol = "__SEROVAL_REFS__",
  C0 = new Map(),
  xr = new Map();
function k0(a) {
  return C0.has(a);
}
function n1(a) {
  return xr.has(a);
}
function a1(a) {
  if (k0(a)) return C0.get(a);
  throw new z1(a);
}
function i1(a) {
  if (n1(a)) return xr.get(a);
  throw new D1(a);
}
typeof globalThis < "u"
  ? Object.defineProperty(globalThis, ol, {
      value: xr,
      configurable: !0,
      writable: !1,
      enumerable: !1,
    })
  : typeof window < "u"
    ? Object.defineProperty(window, ol, {
        value: xr,
        configurable: !0,
        writable: !1,
        enumerable: !1,
      })
    : typeof self < "u"
      ? Object.defineProperty(self, ol, {
          value: xr,
          configurable: !0,
          writable: !1,
          enumerable: !1,
        })
      : typeof global < "u" &&
        Object.defineProperty(global, ol, {
          value: xr,
          configurable: !0,
          writable: !1,
          enumerable: !1,
        });
function qf(a) {
  return a instanceof EvalError
    ? 1
    : a instanceof RangeError
      ? 2
      : a instanceof ReferenceError
        ? 3
        : a instanceof SyntaxError
          ? 4
          : a instanceof TypeError
            ? 5
            : a instanceof URIError
              ? 6
              : 0;
}
function r1(a) {
  let i = XS[qf(a)];
  return a.name !== i
    ? { name: a.name }
    : a.constructor.name !== i
      ? { name: a.constructor.name }
      : {};
}
function O0(a, i) {
  let r = r1(a),
    o = Object.getOwnPropertyNames(a);
  for (let l = 0, f = o.length, d; l < f; l++)
    ((d = o[l]),
      d !== "name" &&
        d !== "message" &&
        (d === "stack" ? i & 4 && ((r = r || {}), (r[d] = a[d])) : ((r = r || {}), (r[d] = a[d]))));
  return r;
}
function N0(a) {
  return Object.isFrozen(a) ? 3 : Object.isSealed(a) ? 2 : Object.isExtensible(a) ? 0 : 1;
}
function s1(a) {
  switch (a) {
    case Number.POSITIVE_INFINITY:
      return JS;
    case Number.NEGATIVE_INFINITY:
      return $S;
  }
  return a !== a ? WS : Object.is(a, -0) ? IS : Ge(0, _, a, _, _, _, _, _, _, _, _, _);
}
function z0(a) {
  return Ge(1, _, Pa(a), _, _, _, _, _, _, _, _, _);
}
function o1(a) {
  return Ge(3, _, "" + a, _, _, _, _, _, _, _, _, _);
}
function l1(a) {
  return Ge(4, a, _, _, _, _, _, _, _, _, _, _);
}
function c1(a, i) {
  let r = i.valueOf();
  return Ge(5, a, r !== r ? "" : i.toISOString(), _, _, _, _, _, _, _, _, _);
}
function u1(a, i) {
  return Ge(6, a, _, Pa(i.source), i.flags, _, _, _, _, _, _, _);
}
function f1(a, i) {
  return Ge(17, a, R0[i], _, _, _, _, _, _, _, _, _);
}
function d1(a, i) {
  return Ge(18, a, Pa(a1(i)), _, _, _, _, _, _, _, _, _);
}
function h1(a, i, r) {
  return Ge(25, a, r, Pa(i), _, _, _, _, _, _, _, _);
}
function m1(a, i, r) {
  return Ge(9, a, _, _, _, _, _, r, _, _, N0(i), _);
}
function p1(a, i) {
  return Ge(21, a, _, _, _, _, _, _, i, _, _, _);
}
function g1(a, i, r) {
  return Ge(15, a, _, i.constructor.name, _, _, _, _, r, i.byteOffset, _, i.length);
}
function y1(a, i, r) {
  return Ge(16, a, _, i.constructor.name, _, _, _, _, r, i.byteOffset, _, i.byteLength);
}
function v1(a, i, r) {
  return Ge(20, a, _, _, _, _, _, _, r, i.byteOffset, _, i.byteLength);
}
function b1(a, i, r) {
  return Ge(13, a, qf(i), _, Pa(i.message), r, _, _, _, _, _, _);
}
function S1(a, i, r) {
  return Ge(14, a, qf(i), _, Pa(i.message), r, _, _, _, _, _, _);
}
function _1(a, i) {
  return Ge(7, a, _, _, _, _, _, i, _, _, _, _);
}
function x1(a, i) {
  return Ge(28, _, _, _, _, _, _, [a, i], _, _, _, _);
}
function w1(a, i) {
  return Ge(30, _, _, _, _, _, _, [a, i], _, _, _, _);
}
function E1(a, i, r) {
  return Ge(31, a, _, _, _, _, _, r, i, _, _, _);
}
function T1(a, i) {
  return Ge(32, a, _, _, _, _, _, _, i, _, _, _);
}
function R1(a, i) {
  return Ge(33, a, _, _, _, _, _, _, i, _, _, _);
}
function A1(a, i) {
  return Ge(34, a, _, _, _, _, _, _, i, _, _, _);
}
var M1 = { parsing: 1, serialization: 2, deserialization: 3 };
function C1(a) {
  return `Seroval Error (step: ${M1[a]})`;
}
var k1 = (a, i) => C1(a),
  D0 = class extends Error {
    constructor(a, i) {
      (super(k1(a)), (this.cause = i));
    }
  },
  og = class extends D0 {
    constructor(a) {
      super("parsing", a);
    }
  },
  O1 = class extends D0 {
    constructor(a) {
      super("deserialization", a);
    }
  };
function oa(a) {
  return `Seroval Error (specific: ${a})`;
}
var zl = class extends Error {
    constructor(a) {
      (super(oa(1)), (this.value = a));
    }
  },
  L0 = class extends Error {
    constructor(a) {
      super(oa(2));
    }
  },
  N1 = class extends Error {
    constructor(a) {
      super(oa(3));
    }
  },
  Zs = class extends Error {
    constructor(a) {
      super(oa(4));
    }
  },
  z1 = class extends Error {
    constructor(a) {
      (super(oa(5)), (this.value = a));
    }
  },
  D1 = class extends Error {
    constructor(a) {
      super(oa(6));
    }
  },
  L1 = class extends Error {
    constructor(a) {
      super(oa(7));
    }
  },
  Ka = class extends Error {
    constructor(i) {
      super(oa(8));
    }
  },
  j1 = class extends Error {
    constructor(i) {
      super(oa(9));
    }
  },
  U1 = class {
    constructor(a, i) {
      ((this.value = a), (this.replacement = i));
    }
  },
  Dl = () => {
    let a = { p: 0, s: 0, f: 0 };
    return (
      (a.p = new Promise((i, r) => {
        ((a.s = i), (a.f = r));
      })),
      a
    );
  },
  B1 = (a, i) => {
    (a.s(i), (a.p.s = 1), (a.p.v = i));
  },
  H1 = (a, i) => {
    (a.f(i), (a.p.s = 2), (a.p.v = i));
  };
Dl.toString();
B1.toString();
H1.toString();
var q1 = () => {
    let a = [],
      i = [],
      r = !0,
      o = !1,
      l = 0,
      f = (y, p, b) => {
        for (b = 0; b < l; b++) i[b] && i[b][p](y);
      },
      d = (y, p, b, g) => {
        for (p = 0, b = a.length; p < b; p++)
          ((g = a[p]), !r && p === b - 1 ? y[o ? "return" : "throw"](g) : y.next(g));
      },
      h = (y, p) => (
        r && ((p = l++), (i[p] = y)),
        d(y),
        () => {
          r && ((i[p] = i[l]), (i[l--] = void 0));
        }
      );
    return {
      __SEROVAL_STREAM__: !0,
      on: (y) => h(y),
      next: (y) => {
        r && (a.push(y), f(y, "next"));
      },
      throw: (y) => {
        r && (a.push(y), f(y, "throw"), (r = !1), (o = !1), (i.length = 0));
      },
      return: (y) => {
        r && (a.push(y), f(y, "return"), (r = !1), (o = !0), (i.length = 0));
      },
    };
  },
  V1 = (a) => (i) => () => {
    let r = 0,
      o = {
        [a]: () => o,
        next: () => {
          if (r > i.d) return { done: !0, value: void 0 };
          let l = r++,
            f = i.v[l];
          if (l === i.t) throw f;
          return { done: l === i.d, value: f };
        },
      };
    return o;
  },
  Z1 = (a, i) => (r) => () => {
    let o = 0,
      l = -1,
      f = !1,
      d = [],
      h = [],
      y = (b = 0, g = h.length) => {
        for (; b < g; b++) h[b].s({ done: !0, value: void 0 });
      };
    r.on({
      next: (b) => {
        let g = h.shift();
        (g && g.s({ done: !1, value: b }), d.push(b));
      },
      throw: (b) => {
        let g = h.shift();
        (g && g.f(b), y(), (l = d.length), (f = !0), d.push(b));
      },
      return: (b) => {
        let g = h.shift();
        (g && g.s({ done: !0, value: b }), y(), (l = d.length), d.push(b));
      },
    });
    let p = {
      [a]: () => p,
      next: () => {
        if (l === -1) {
          let S = o++;
          if (S >= d.length) {
            let E = i();
            return (h.push(E), E.p);
          }
          return { done: !1, value: d[S] };
        }
        if (o > l) return { done: !0, value: void 0 };
        let b = o++,
          g = d[b];
        if (b !== l) return { done: !1, value: g };
        if (f) throw g;
        return { done: !0, value: g };
      },
    };
    return p;
  },
  j0 = (a) => {
    let i = atob(a),
      r = i.length,
      o = new Uint8Array(r);
    for (let l = 0; l < r; l++) o[l] = i.charCodeAt(l);
    return o.buffer;
  };
j0.toString();
var Y1 = {},
  G1 = {},
  Q1 = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
function Ll(a) {
  return "__SEROVAL_STREAM__" in a;
}
function Mi() {
  return q1();
}
function X1(a) {
  let i = Mi(),
    r = a[ia]();
  async function o() {
    try {
      let l = await r.next();
      l.done ? i.return(l.value) : (i.next(l.value), await o());
    } catch (l) {
      i.throw(l);
    }
  }
  return (o().catch(() => {}), i);
}
var F1 = Z1(ia, Dl);
function P1(a) {
  return F1(a);
}
function K1(a) {
  let i = [],
    r = -1,
    o = -1,
    l = a[ra]();
  for (;;)
    try {
      let f = l.next();
      if ((i.push(f.value), f.done)) {
        o = i.length - 1;
        break;
      }
    } catch (f) {
      ((r = i.length), i.push(f));
    }
  return { v: i, t: r, d: o };
}
var I1 = V1(ra);
function J1(a) {
  return I1(a);
}
async function $1(a) {
  try {
    return [1, await a];
  } catch (i) {
    return [0, i];
  }
}
function W1(a, i) {
  return {
    plugins: i.plugins,
    mode: a,
    marked: new Set(),
    features: 63 ^ (i.disabledFeatures || 0),
    refs: i.refs || new Map(),
    depthLimit: i.depthLimit || 1e3,
  };
}
function dl(a, i) {
  a.marked.add(i);
}
function e_(a, i) {
  let r = a.refs.size;
  return (a.refs.set(i, r), r);
}
function jl(a, i) {
  let r = a.refs.get(i);
  return r != null ? (dl(a, r), { type: 1, value: l1(r) }) : { type: 0, value: e_(a, i) };
}
function Vf(a, i) {
  let r = jl(a, i);
  return r.type === 1 ? r : k0(i) ? { type: 2, value: d1(r.value, i) } : r;
}
function Si(a, i) {
  let r = Vf(a, i);
  if (r.type !== 0) return r.value;
  if (i in R0) return f1(r.value, i);
  throw new zl(i);
}
function Ul(a, i) {
  let r = jl(a, Q1[i]);
  return r.type === 1 ? r.value : Ge(26, r.value, i, _, _, _, _, _, _, _, _, _);
}
function t_(a) {
  let i = jl(a, Y1);
  return i.type === 1 ? i.value : Ge(27, i.value, _, _, _, _, _, _, Si(a, ra), _, _, _);
}
function n_(a) {
  let i = jl(a, G1);
  return i.type === 1 ? i.value : Ge(29, i.value, _, _, _, _, _, [Ul(a, 1), Si(a, ia)], _, _, _, _);
}
function a_(a, i, r, o) {
  return Ge(r ? 11 : 10, a, _, _, _, o, _, _, _, _, N0(i), _);
}
function i_(a, i, r, o) {
  return Ge(8, i, _, _, _, _, { k: r, v: o }, _, Ul(a, 0), _, _, _);
}
function r_(a, i, r) {
  let o = new Uint8Array(r),
    l = "";
  for (let f = 0, d = o.length; f < d; f++) l += String.fromCharCode(o[f]);
  return Ge(19, i, Pa(btoa(l)), _, _, _, _, _, Ul(a, 5), _, _, _);
}
function s_(a, i) {
  return { base: W1(a, i), child: void 0 };
}
var o_ = class {
  constructor(a, i) {
    ((this._p = a), (this.depth = i));
  }
  parse(a) {
    return St(this._p, this.depth, a);
  }
};
async function l_(a, i, r) {
  let o = [];
  for (let l = 0, f = r.length; l < f; l++) l in r ? (o[l] = await St(a, i, r[l])) : (o[l] = 0);
  return o;
}
async function c_(a, i, r, o) {
  return m1(r, o, await l_(a, i, o));
}
async function Zf(a, i, r) {
  let o = Object.entries(r),
    l = [],
    f = [];
  for (let d = 0, h = o.length; d < h; d++) (l.push(Pa(o[d][0])), f.push(await St(a, i, o[d][1])));
  return (
    ra in r && (l.push(Si(a.base, ra)), f.push(x1(t_(a.base), await St(a, i, K1(r))))),
    ia in r && (l.push(Si(a.base, ia)), f.push(w1(n_(a.base), await St(a, i, X1(r))))),
    Rr in r && (l.push(Si(a.base, Rr)), f.push(z0(r[Rr]))),
    Tr in r && (l.push(Si(a.base, Tr)), f.push(r[Tr] ? A0 : M0)),
    { k: l, v: f }
  );
}
async function df(a, i, r, o, l) {
  return a_(r, o, l, await Zf(a, i, o));
}
async function u_(a, i, r, o) {
  return p1(r, await St(a, i, o.valueOf()));
}
async function f_(a, i, r, o) {
  return g1(r, o, await St(a, i, o.buffer));
}
async function d_(a, i, r, o) {
  return y1(r, o, await St(a, i, o.buffer));
}
async function h_(a, i, r, o) {
  return v1(r, o, await St(a, i, o.buffer));
}
async function lg(a, i, r, o) {
  let l = O0(o, a.base.features);
  return b1(r, o, l ? await Zf(a, i, l) : _);
}
async function m_(a, i, r, o) {
  let l = O0(o, a.base.features);
  return S1(r, o, l ? await Zf(a, i, l) : _);
}
async function p_(a, i, r, o) {
  let l = [],
    f = [];
  for (let [d, h] of o.entries()) (l.push(await St(a, i, d)), f.push(await St(a, i, h)));
  return i_(a.base, r, l, f);
}
async function g_(a, i, r, o) {
  let l = [];
  for (let f of o.keys()) l.push(await St(a, i, f));
  return _1(r, l);
}
async function U0(a, i, r, o) {
  let l = a.base.plugins;
  if (l)
    for (let f = 0, d = l.length; f < d; f++) {
      let h = l[f];
      if (h.parse.async && h.test(o))
        return h1(r, h.tag, await h.parse.async(o, new o_(a, i), { id: r }));
    }
  return _;
}
async function y_(a, i, r, o) {
  let [l, f] = await $1(o);
  return Ge(12, r, l, _, _, _, _, _, await St(a, i, f), _, _, _);
}
function v_(a, i, r, o, l) {
  let f = [],
    d = r.on({
      next: (h) => {
        (dl(this.base, i),
          St(this, a, h).then(
            (y) => {
              f.push(T1(i, y));
            },
            (y) => {
              (l(y), d());
            },
          ));
      },
      throw: (h) => {
        (dl(this.base, i),
          St(this, a, h).then(
            (y) => {
              (f.push(R1(i, y)), o(f), d());
            },
            (y) => {
              (l(y), d());
            },
          ));
      },
      return: (h) => {
        (dl(this.base, i),
          St(this, a, h).then(
            (y) => {
              (f.push(A1(i, y)), o(f), d());
            },
            (y) => {
              (l(y), d());
            },
          ));
      },
    });
}
async function b_(a, i, r, o) {
  return E1(r, Ul(a.base, 4), await new Promise(v_.bind(a, i, r, o)));
}
async function S_(a, i, r, o) {
  if (Array.isArray(o)) return c_(a, i, r, o);
  if (Ll(o)) return b_(a, i, r, o);
  let l = o.constructor;
  if (l === U1) return St(a, i, o.replacement);
  let f = await U0(a, i, r, o);
  if (f) return f;
  switch (l) {
    case Object:
      return df(a, i, r, o, !1);
    case _:
      return df(a, i, r, o, !0);
    case Date:
      return c1(r, o);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return lg(a, i, r, o);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return u_(a, i, r, o);
    case ArrayBuffer:
      return r_(a.base, r, o);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return f_(a, i, r, o);
    case DataView:
      return h_(a, i, r, o);
    case Map:
      return p_(a, i, r, o);
    case Set:
      return g_(a, i, r, o);
  }
  if (l === Promise || o instanceof Promise) return y_(a, i, r, o);
  let d = a.base.features;
  if (d & 32 && l === RegExp) return u1(r, o);
  if (d & 16)
    switch (l) {
      case BigInt64Array:
      case BigUint64Array:
        return d_(a, i, r, o);
    }
  if (d & 1 && typeof AggregateError < "u" && (l === AggregateError || o instanceof AggregateError))
    return m_(a, i, r, o);
  if (o instanceof Error) return lg(a, i, r, o);
  if (ra in o || ia in o) return df(a, i, r, o, !!l);
  throw new zl(o);
}
async function __(a, i, r) {
  let o = Vf(a.base, r);
  if (o.type !== 0) return o.value;
  let l = await U0(a, i, o.value, r);
  if (l) return l;
  throw new zl(r);
}
async function St(a, i, r) {
  switch (typeof r) {
    case "boolean":
      return r ? A0 : M0;
    case "undefined":
      return PS;
    case "string":
      return z0(r);
    case "number":
      return s1(r);
    case "bigint":
      return o1(r);
    case "object": {
      if (r) {
        let o = Vf(a.base, r);
        return o.type === 0 ? await S_(a, i + 1, o.value, r) : o.value;
      }
      return KS;
    }
    case "symbol":
      return Si(a.base, r);
    case "function":
      return __(a, i, r);
    default:
      throw new zl(r);
  }
}
async function x_(a, i) {
  try {
    return await St(a, 0, i);
  } catch (r) {
    throw r instanceof og ? r : new og(r);
  }
}
var w_ = ((a) => ((a[(a.Vanilla = 1)] = "Vanilla"), (a[(a.Cross = 2)] = "Cross"), a))(w_ || {});
function B0(a, i) {
  for (let r = 0, o = i.length; r < o; r++) {
    let l = i[r];
    a.has(l) || (a.add(l), l.extends && B0(a, l.extends));
  }
}
function H0(a) {
  if (a) {
    let i = new Set();
    return (B0(i, a), [...i]);
  }
}
function E_(a) {
  switch (a) {
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
      throw new L1(a);
  }
}
var T_ = 1e6,
  R_ = 1e4,
  A_ = 2e4;
function q0(a, i) {
  switch (i) {
    case 3:
      return Object.freeze(a);
    case 1:
      return Object.preventExtensions(a);
    case 2:
      return Object.seal(a);
    default:
      return a;
  }
}
var M_ = 1e3;
function C_(a, i) {
  var r;
  return {
    mode: a,
    plugins: i.plugins,
    refs: i.refs || new Map(),
    features: (r = i.features) != null ? r : 63 ^ (i.disabledFeatures || 0),
    depthLimit: i.depthLimit || M_,
  };
}
function k_(a) {
  return { mode: 2, base: C_(2, a), child: _ };
}
var O_ = class {
  constructor(a, i) {
    ((this._p = a), (this.depth = i));
  }
  deserialize(a) {
    return Je(this._p, this.depth, a);
  }
};
function V0(a, i) {
  if (i < 0 || !Number.isFinite(i) || !Number.isInteger(i)) throw new Ka({ t: 4, i });
  if (a.refs.has(i)) throw new Error("Conflicted ref id: " + i);
}
function N_(a, i, r) {
  return (V0(a.base, i), a.state.marked.has(i) && a.base.refs.set(i, r), r);
}
function z_(a, i, r) {
  return (V0(a.base, i), a.base.refs.set(i, r), r);
}
function _t(a, i, r) {
  return a.mode === 1 ? N_(a, i, r) : z_(a, i, r);
}
function Af(a, i, r) {
  if (Object.hasOwn(i, r)) return i[r];
  throw new Ka(a);
}
function D_(a, i) {
  return _t(a, i.i, i1(Ai(i.s)));
}
function L_(a, i, r) {
  let o = r.a,
    l = o.length,
    f = _t(a, r.i, new Array(l));
  for (let d = 0, h; d < l; d++) ((h = o[d]), h && (f[d] = Je(a, i, h)));
  return (q0(f, r.o), f);
}
function j_(a) {
  switch (a) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return !1;
    default:
      return !0;
  }
}
function U_(a) {
  switch (a) {
    case ia:
    case Tr:
    case Rr:
    case ra:
      return !0;
    default:
      return !1;
  }
}
function cg(a, i, r) {
  j_(i)
    ? (a[i] = r)
    : Object.defineProperty(a, i, { value: r, configurable: !0, enumerable: !0, writable: !0 });
}
function B_(a, i, r, o, l) {
  if (typeof o == "string") cg(r, o, Je(a, i, l));
  else {
    let f = Je(a, i, o);
    switch (typeof f) {
      case "string":
        cg(r, f, Je(a, i, l));
        break;
      case "symbol":
        U_(f) && (r[f] = Je(a, i, l));
        break;
      default:
        throw new Ka(o);
    }
  }
}
function Z0(a, i, r, o) {
  let l = r.k;
  if (l.length > 0) for (let f = 0, d = r.v, h = l.length; f < h; f++) B_(a, i, o, l[f], d[f]);
  return o;
}
function H_(a, i, r) {
  let o = _t(a, r.i, r.t === 10 ? {} : Object.create(null));
  return (Z0(a, i, r.p, o), q0(o, r.o), o);
}
function q_(a, i) {
  return _t(a, i.i, new Date(i.s));
}
function V_(a, i) {
  if (a.base.features & 32) {
    let r = Ai(i.c);
    if (r.length > A_) throw new Ka(i);
    return _t(a, i.i, new RegExp(r, i.m));
  }
  throw new L0(i);
}
function Z_(a, i, r) {
  let o = _t(a, r.i, new Set());
  for (let l = 0, f = r.a, d = f.length; l < d; l++) o.add(Je(a, i, f[l]));
  return o;
}
function Y_(a, i, r) {
  let o = _t(a, r.i, new Map());
  for (let l = 0, f = r.e.k, d = r.e.v, h = f.length; l < h; l++)
    o.set(Je(a, i, f[l]), Je(a, i, d[l]));
  return o;
}
function G_(a, i) {
  if (i.s.length > T_) throw new Ka(i);
  return _t(a, i.i, j0(Ai(i.s)));
}
function Q_(a, i, r) {
  var o;
  let l = E_(r.c),
    f = Je(a, i, r.f),
    d = (o = r.b) != null ? o : 0;
  if (d < 0 || d > f.byteLength) throw new Ka(r);
  return _t(a, r.i, new l(f, d, r.l));
}
function X_(a, i, r) {
  var o;
  let l = Je(a, i, r.f),
    f = (o = r.b) != null ? o : 0;
  if (f < 0 || f > l.byteLength) throw new Ka(r);
  return _t(a, r.i, new DataView(l, f, r.l));
}
function Y0(a, i, r, o) {
  if (r.p) {
    let l = Z0(a, i, r.p, {});
    Object.defineProperties(o, Object.getOwnPropertyDescriptors(l));
  }
  return o;
}
function F_(a, i, r) {
  let o = _t(a, r.i, new AggregateError([], Ai(r.m)));
  return Y0(a, i, r, o);
}
function P_(a, i, r) {
  let o = Af(r, FS, r.s),
    l = _t(a, r.i, new o(Ai(r.m)));
  return Y0(a, i, r, l);
}
function K_(a, i, r) {
  let o = Dl(),
    l = _t(a, r.i, o.p),
    f = Je(a, i, r.f);
  return (r.s ? o.s(f) : o.f(f), l);
}
function I_(a, i, r) {
  return _t(a, r.i, Object(Je(a, i, r.f)));
}
function J_(a, i, r) {
  let o = a.base.plugins;
  if (o) {
    let l = Ai(r.c);
    for (let f = 0, d = o.length; f < d; f++) {
      let h = o[f];
      if (h.tag === l) return _t(a, r.i, h.deserialize(r.s, new O_(a, i), { id: r.i }));
    }
  }
  throw new N1(r.c);
}
function $_(a, i) {
  return _t(a, i.i, _t(a, i.s, Dl()).p);
}
function W_(a, i, r) {
  let o = a.base.refs.get(r.i);
  if (o) return (o.s(Je(a, i, r.a[1])), _);
  throw new Zs("Promise");
}
function ex(a, i, r) {
  let o = a.base.refs.get(r.i);
  if (o) return (o.f(Je(a, i, r.a[1])), _);
  throw new Zs("Promise");
}
function tx(a, i, r) {
  Je(a, i, r.a[0]);
  let o = Je(a, i, r.a[1]);
  return J1(o);
}
function nx(a, i, r) {
  Je(a, i, r.a[0]);
  let o = Je(a, i, r.a[1]);
  return P1(o);
}
function ax(a, i, r) {
  let o = _t(a, r.i, Mi()),
    l = r.a,
    f = l.length;
  if (f) for (let d = 0; d < f; d++) Je(a, i, l[d]);
  return o;
}
function ix(a, i, r) {
  let o = a.base.refs.get(r.i);
  if (o && Ll(o)) return (o.next(Je(a, i, r.f)), _);
  throw new Zs("Stream");
}
function rx(a, i, r) {
  let o = a.base.refs.get(r.i);
  if (o && Ll(o)) return (o.throw(Je(a, i, r.f)), _);
  throw new Zs("Stream");
}
function sx(a, i, r) {
  let o = a.base.refs.get(r.i);
  if (o && Ll(o)) return (o.return(Je(a, i, r.f)), _);
  throw new Zs("Stream");
}
function ox(a, i, r) {
  return (Je(a, i, r.f), _);
}
function lx(a, i, r) {
  return (Je(a, i, r.a[1]), _);
}
function Je(a, i, r) {
  if (i > a.base.depthLimit) throw new j1(a.base.depthLimit);
  switch (((i += 1), r.t)) {
    case 2:
      return Af(r, QS, r.s);
    case 0:
      return Number(r.s);
    case 1:
      return Ai(String(r.s));
    case 3:
      if (String(r.s).length > R_) throw new Ka(r);
      return BigInt(r.s);
    case 4:
      return a.base.refs.get(r.i);
    case 18:
      return D_(a, r);
    case 9:
      return L_(a, i, r);
    case 10:
    case 11:
      return H_(a, i, r);
    case 5:
      return q_(a, r);
    case 6:
      return V_(a, r);
    case 7:
      return Z_(a, i, r);
    case 8:
      return Y_(a, i, r);
    case 19:
      return G_(a, r);
    case 16:
    case 15:
      return Q_(a, i, r);
    case 20:
      return X_(a, i, r);
    case 14:
      return F_(a, i, r);
    case 13:
      return P_(a, i, r);
    case 12:
      return K_(a, i, r);
    case 17:
      return Af(r, GS, r.s);
    case 21:
      return I_(a, i, r);
    case 25:
      return J_(a, i, r);
    case 22:
      return $_(a, r);
    case 23:
      return W_(a, i, r);
    case 24:
      return ex(a, i, r);
    case 28:
      return tx(a, i, r);
    case 30:
      return nx(a, i, r);
    case 31:
      return ax(a, i, r);
    case 32:
      return ix(a, i, r);
    case 33:
      return rx(a, i, r);
    case 34:
      return sx(a, i, r);
    case 27:
      return ox(a, i, r);
    case 29:
      return lx(a, i, r);
    default:
      throw new L0(r);
  }
}
function cx(a, i) {
  try {
    return Je(a, 0, i);
  } catch (r) {
    throw new O1(r);
  }
}
var ux = () => T;
ux.toString();
function hf(a, i) {
  let r = H0(i.plugins),
    o = k_({
      plugins: r,
      refs: i.refs,
      features: i.features,
      disabledFeatures: i.disabledFeatures,
    });
  return cx(o, a);
}
async function fx(a, i = {}) {
  let r = H0(i.plugins),
    o = s_(1, { plugins: r, disabledFeatures: i.disabledFeatures });
  return { t: await x_(o, a), f: o.base.features, m: Array.from(o.base.marked) };
}
function dx(a) {
  return {
    tag: "$TSR/t/" + a.key,
    test: a.test,
    parse: {
      sync(i, r) {
        return r.parse(a.toSerializable(i));
      },
      async async(i, r) {
        return await r.parse(a.toSerializable(i));
      },
      stream(i, r) {
        return r.parse(a.toSerializable(i));
      },
    },
    serialize: void 0,
    deserialize(i, r) {
      return a.fromSerializable(r.deserialize(i));
    },
  };
}
var zs = {},
  G0 = (a) =>
    new ReadableStream({
      start: (i) => {
        a.on({
          next: (r) => {
            try {
              i.enqueue(r);
            } catch {}
          },
          throw: (r) => {
            i.error(r);
          },
          return: () => {
            try {
              i.close();
            } catch {}
          },
        });
      },
    }),
  hx = {
    tag: "seroval-plugins/web/ReadableStreamFactory",
    test(a) {
      return a === zs;
    },
    parse: {
      sync() {},
      async async() {
        return await Promise.resolve(void 0);
      },
      stream() {},
    },
    serialize() {
      return G0.toString();
    },
    deserialize() {
      return zs;
    },
  };
function ug(a) {
  let i = Mi(),
    r = a.getReader();
  async function o() {
    try {
      let l = await r.read();
      l.done ? i.return(l.value) : (i.next(l.value), await o());
    } catch (l) {
      i.throw(l);
    }
  }
  return (o().catch(() => {}), i);
}
var mx = {
    tag: "seroval/plugins/web/ReadableStream",
    extends: [hx],
    test(a) {
      return typeof ReadableStream > "u" ? !1 : a instanceof ReadableStream;
    },
    parse: {
      sync(a, i) {
        return { factory: i.parse(zs), stream: i.parse(Mi()) };
      },
      async async(a, i) {
        return { factory: await i.parse(zs), stream: await i.parse(ug(a)) };
      },
      stream(a, i) {
        return { factory: i.parse(zs), stream: i.parse(ug(a)) };
      },
    },
    serialize(a, i) {
      return "(" + i.serialize(a.factory) + ")(" + i.serialize(a.stream) + ")";
    },
    deserialize(a, i) {
      let r = i.deserialize(a.stream);
      return G0(r);
    },
  },
  px = mx;
const gx = {
  tag: "$TSR/Error",
  test(a) {
    return a instanceof Error;
  },
  parse: {
    sync(a, i) {
      return { message: i.parse(a.message) };
    },
    async async(a, i) {
      return { message: await i.parse(a.message) };
    },
    stream(a, i) {
      return { message: i.parse(a.message) };
    },
  },
  serialize(a, i) {
    return "new Error(" + i.serialize(a.message) + ")";
  },
  deserialize(a, i) {
    return new Error(i.deserialize(a.message));
  },
};
class yx {
  constructor(i, r) {
    ((this.stream = i), (this.hint = (r == null ? void 0 : r.hint) ?? "binary"));
  }
}
const wl = globalThis.Buffer,
  Q0 = !!wl && typeof wl.from == "function";
function X0(a) {
  if (a.length === 0) return "";
  if (Q0) return wl.from(a).toString("base64");
  const i = 32768,
    r = [];
  for (let o = 0; o < a.length; o += i) {
    const l = a.subarray(o, o + i);
    r.push(String.fromCharCode.apply(null, l));
  }
  return btoa(r.join(""));
}
function F0(a) {
  if (a.length === 0) return new Uint8Array(0);
  if (Q0) {
    const o = wl.from(a, "base64");
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  const i = atob(a),
    r = new Uint8Array(i.length);
  for (let o = 0; o < i.length; o++) r[o] = i.charCodeAt(o);
  return r;
}
const Ds = Object.create(null),
  Ls = Object.create(null),
  vx = (a) =>
    new ReadableStream({
      start(i) {
        a.on({
          next(r) {
            try {
              i.enqueue(F0(r));
            } catch {}
          },
          throw(r) {
            i.error(r);
          },
          return() {
            try {
              i.close();
            } catch {}
          },
        });
      },
    }),
  bx = new TextEncoder(),
  Sx = (a) =>
    new ReadableStream({
      start(i) {
        a.on({
          next(r) {
            try {
              typeof r == "string" ? i.enqueue(bx.encode(r)) : i.enqueue(F0(r.$b64));
            } catch {}
          },
          throw(r) {
            i.error(r);
          },
          return() {
            try {
              i.close();
            } catch {}
          },
        });
      },
    }),
  _x =
    "(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))",
  xx =
    "(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})";
function fg(a) {
  const i = Mi(),
    r = a.getReader();
  return (
    (async () => {
      try {
        for (;;) {
          const { done: o, value: l } = await r.read();
          if (o) {
            i.return(void 0);
            break;
          }
          i.next(X0(l));
        }
      } catch (o) {
        i.throw(o);
      } finally {
        r.releaseLock();
      }
    })(),
    i
  );
}
function dg(a) {
  const i = Mi(),
    r = a.getReader(),
    o = new TextDecoder("utf-8", { fatal: !0 });
  return (
    (async () => {
      try {
        for (;;) {
          const { done: l, value: f } = await r.read();
          if (l) {
            try {
              const d = o.decode();
              d.length > 0 && i.next(d);
            } catch {}
            i.return(void 0);
            break;
          }
          try {
            const d = o.decode(f, { stream: !0 });
            d.length > 0 && i.next(d);
          } catch {
            i.next({ $b64: X0(f) });
          }
        }
      } catch (l) {
        i.throw(l);
      } finally {
        r.releaseLock();
      }
    })(),
    i
  );
}
const wx = {
    tag: "tss/RawStreamFactory",
    test(a) {
      return a === Ds;
    },
    parse: {
      sync() {},
      async() {
        return Promise.resolve(void 0);
      },
      stream() {},
    },
    serialize() {
      return _x;
    },
    deserialize() {
      return Ds;
    },
  },
  Ex = {
    tag: "tss/RawStreamFactoryText",
    test(a) {
      return a === Ls;
    },
    parse: {
      sync() {},
      async() {
        return Promise.resolve(void 0);
      },
      stream() {},
    },
    serialize() {
      return xx;
    },
    deserialize() {
      return Ls;
    },
  },
  Tx = {
    tag: "tss/RawStream",
    extends: [wx, Ex],
    test(a) {
      return a instanceof yx;
    },
    parse: {
      sync(a, i) {
        const r = a.hint === "text" ? Ls : Ds;
        return { hint: a.hint, factory: i.parse(r), stream: i.parse(Mi()) };
      },
      async async(a, i) {
        const r = a.hint === "text" ? Ls : Ds,
          o = a.hint === "text" ? dg(a.stream) : fg(a.stream);
        return { hint: a.hint, factory: await i.parse(r), stream: await i.parse(o) };
      },
      stream(a, i) {
        const r = a.hint === "text" ? Ls : Ds,
          o = a.hint === "text" ? dg(a.stream) : fg(a.stream);
        return { hint: a.hint, factory: i.parse(r), stream: i.parse(o) };
      },
    },
    serialize(a, i) {
      return "(" + i.serialize(a.factory) + ")(" + i.serialize(a.stream) + ")";
    },
    deserialize(a, i) {
      const r = i.deserialize(a.stream);
      return a.hint === "text" ? Sx(r) : vx(r);
    },
  };
function Rx(a) {
  return {
    tag: "tss/RawStream",
    test: () => !1,
    parse: {},
    serialize() {
      throw new Error(
        "RawStreamDeserializePlugin.serialize should not be called. Client only deserializes.",
      );
    },
    deserialize(i) {
      return a(i.streamId);
    },
  };
}
const Ax = [gx, Tx, px],
  Mx = "use",
  El = Mb[Mx],
  ll = typeof window < "u" ? le.useLayoutEffect : le.useEffect;
function mf(a) {
  const i = le.useRef({ value: a, prev: null }),
    r = i.current.value;
  return (a !== r && (i.current = { value: a, prev: r }), i.current.prev);
}
function Cx(a, i, r = {}, o = {}) {
  le.useEffect(() => {
    if (!a.current || o.disabled || typeof IntersectionObserver != "function") return;
    const l = new IntersectionObserver(([f]) => {
      i(f);
    }, r);
    return (
      l.observe(a.current),
      () => {
        l.disconnect();
      }
    );
  }, [i, r, o.disabled, a]);
}
function kx(a) {
  const i = le.useRef(null);
  return (le.useImperativeHandle(a, () => i.current, []), i);
}
function Ox({ promise: a }) {
  if (El) return El(a);
  const i = qS(a);
  if (i[zn].status === "pending") throw i;
  if (i[zn].status === "error") throw i[zn].error;
  return i[zn].data;
}
function Nx(a) {
  const i = F.jsx(zx, { ...a });
  return a.fallback ? F.jsx(le.Suspense, { fallback: a.fallback, children: i }) : i;
}
function zx(a) {
  const i = Ox(a);
  return a.children(i);
}
function Yf(a) {
  const i = a.errorComponent ?? Bl;
  return F.jsx(Dx, {
    getResetKey: a.getResetKey,
    onCatch: a.onCatch,
    children: ({ error: r, reset: o }) =>
      r ? le.createElement(i, { error: r, reset: o }) : a.children,
  });
}
class Dx extends le.Component {
  constructor() {
    (super(...arguments), (this.state = { error: null }));
  }
  static getDerivedStateFromProps(i) {
    return { resetKey: i.getResetKey() };
  }
  static getDerivedStateFromError(i) {
    return { error: i };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(i, r) {
    r.error && r.resetKey !== this.state.resetKey && this.reset();
  }
  componentDidCatch(i, r) {
    this.props.onCatch && this.props.onCatch(i, r);
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
function Bl({ error: a }) {
  const [i, r] = le.useState(!1);
  return F.jsxs("div", {
    style: { padding: ".5rem", maxWidth: "100%" },
    children: [
      F.jsxs("div", {
        style: { display: "flex", alignItems: "center", gap: ".5rem" },
        children: [
          F.jsx("strong", { style: { fontSize: "1rem" }, children: "Something went wrong!" }),
          F.jsx("button", {
            style: {
              appearance: "none",
              fontSize: ".6em",
              border: "1px solid currentColor",
              padding: ".1rem .2rem",
              fontWeight: "bold",
              borderRadius: ".25rem",
            },
            onClick: () => r((o) => !o),
            children: i ? "Hide Error" : "Show Error",
          }),
        ],
      }),
      F.jsx("div", { style: { height: ".25rem" } }),
      i
        ? F.jsx("div", {
            children: F.jsx("pre", {
              style: {
                fontSize: ".7em",
                border: "1px solid red",
                borderRadius: ".25rem",
                padding: ".3rem",
                color: "red",
                overflow: "auto",
              },
              children: a.message ? F.jsx("code", { children: a.message }) : null,
            }),
          })
        : null,
    ],
  });
}
function Lx({ children: a, fallback: i = null }) {
  return jx() ? F.jsx(W.Fragment, { children: a }) : F.jsx(W.Fragment, { children: i });
}
function jx() {
  return W.useSyncExternalStore(
    Ux,
    () => !0,
    () => !1,
  );
}
function Ux() {
  return () => {};
}
var pf = { exports: {} },
  gf = {},
  yf = { exports: {} },
  vf = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var hg;
function Bx() {
  if (hg) return vf;
  hg = 1;
  var a = Vs();
  function i(g, S) {
    return (g === S && (g !== 0 || 1 / g === 1 / S)) || (g !== g && S !== S);
  }
  var r = typeof Object.is == "function" ? Object.is : i,
    o = a.useState,
    l = a.useEffect,
    f = a.useLayoutEffect,
    d = a.useDebugValue;
  function h(g, S) {
    var E = S(),
      R = o({ inst: { value: E, getSnapshot: S } }),
      k = R[0].inst,
      L = R[1];
    return (
      f(
        function () {
          ((k.value = E), (k.getSnapshot = S), y(k) && L({ inst: k }));
        },
        [g, E, S],
      ),
      l(
        function () {
          return (
            y(k) && L({ inst: k }),
            g(function () {
              y(k) && L({ inst: k });
            })
          );
        },
        [g],
      ),
      d(E),
      E
    );
  }
  function y(g) {
    var S = g.getSnapshot;
    g = g.value;
    try {
      var E = S();
      return !r(g, E);
    } catch {
      return !0;
    }
  }
  function p(g, S) {
    return S();
  }
  var b =
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
      ? p
      : h;
  return (
    (vf.useSyncExternalStore = a.useSyncExternalStore !== void 0 ? a.useSyncExternalStore : b), vf
  );
}
var mg;
function Hx() {
  return (mg || ((mg = 1), (yf.exports = Bx())), yf.exports);
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var pg;
function qx() {
  if (pg) return gf;
  pg = 1;
  var a = Vs(),
    i = Hx();
  function r(p, b) {
    return (p === b && (p !== 0 || 1 / p === 1 / b)) || (p !== p && b !== b);
  }
  var o = typeof Object.is == "function" ? Object.is : r,
    l = i.useSyncExternalStore,
    f = a.useRef,
    d = a.useEffect,
    h = a.useMemo,
    y = a.useDebugValue;
  return (
    (gf.useSyncExternalStoreWithSelector = function (p, b, g, S, E) {
      var R = f(null);
      if (R.current === null) {
        var k = { hasValue: !1, value: null };
        R.current = k;
      } else k = R.current;
      R = h(
        function () {
          function A(I) {
            if (!G) {
              if (((G = !0), (Z = I), (I = S(I)), E !== void 0 && k.hasValue)) {
                var B = k.value;
                if (E(B, I)) return (P = B);
              }
              return (P = I);
            }
            if (((B = P), o(Z, I))) return B;
            var te = S(I);
            return E !== void 0 && E(B, te) ? ((Z = I), B) : ((Z = I), (P = te));
          }
          var G = !1,
            Z,
            P,
            K = g === void 0 ? null : g;
          return [
            function () {
              return A(b());
            },
            K === null
              ? void 0
              : function () {
                  return A(K());
                },
          ];
        },
        [b, g, S, E],
      );
      var L = l(p, R[0], R[1]);
      return (
        d(
          function () {
            ((k.hasValue = !0), (k.value = L));
          },
          [L],
        ),
        y(L),
        L
      );
    }),
    gf
  );
}
var gg;
function Vx() {
  return (gg || ((gg = 1), (pf.exports = qx())), pf.exports);
}
var Zx = Vx();
function Yx(a, i = (o) => o, r = {}) {
  const o = r.equal ?? Gx;
  return Zx.useSyncExternalStoreWithSelector(
    a.subscribe,
    () => a.state,
    () => a.state,
    i,
    o,
  );
}
function Gx(a, i) {
  if (Object.is(a, i)) return !0;
  if (typeof a != "object" || a === null || typeof i != "object" || i === null) return !1;
  if (a instanceof Map && i instanceof Map) {
    if (a.size !== i.size) return !1;
    for (const [o, l] of a) if (!i.has(o) || !Object.is(l, i.get(o))) return !1;
    return !0;
  }
  if (a instanceof Set && i instanceof Set) {
    if (a.size !== i.size) return !1;
    for (const o of a) if (!i.has(o)) return !1;
    return !0;
  }
  if (a instanceof Date && i instanceof Date) return a.getTime() === i.getTime();
  const r = yg(a);
  if (r.length !== yg(i).length) return !1;
  for (let o = 0; o < r.length; o++)
    if (!Object.prototype.hasOwnProperty.call(i, r[o]) || !Object.is(a[r[o]], i[r[o]])) return !1;
  return !0;
}
function yg(a) {
  return Object.keys(a).concat(Object.getOwnPropertySymbols(a));
}
const bf = le.createContext(null);
function P0() {
  return typeof document > "u"
    ? bf
    : window.__TSR_ROUTER_CONTEXT__
      ? window.__TSR_ROUTER_CONTEXT__
      : ((window.__TSR_ROUTER_CONTEXT__ = bf), bf);
}
function At(a) {
  const i = le.useContext(P0());
  return (a == null || a.warn, i);
}
function ot(a) {
  const i = At({ warn: (a == null ? void 0 : a.router) === void 0 }),
    r = (a == null ? void 0 : a.router) || i,
    o = le.useRef(void 0);
  return Yx(r.__store, (l) => {
    if (a != null && a.select) {
      if (a.structuralSharing ?? r.options.defaultStructuralSharing) {
        const f = gn(o.current, a.select(l));
        return ((o.current = f), f);
      }
      return a.select(l);
    }
    return l;
  });
}
const Hl = le.createContext(void 0),
  Qx = le.createContext(void 0);
function Ln(a) {
  const i = le.useContext(a.from ? Qx : Hl);
  return ot({
    select: (o) => {
      const l = o.matches.find((f) => (a.from ? a.from === f.routeId : f.id === i));
      if (
        (Pt(
          !((a.shouldThrow ?? !0) && !l),
          `Could not find ${a.from ? `an active match from "${a.from}"` : "a nearest match!"}`,
        ),
        l !== void 0)
      )
        return a.select ? a.select(l) : l;
    },
    structuralSharing: a.structuralSharing,
  });
}
function Gf(a) {
  return Ln({
    from: a.from,
    strict: a.strict,
    structuralSharing: a.structuralSharing,
    select: (i) => (a.select ? a.select(i.loaderData) : i.loaderData),
  });
}
function Qf(a) {
  const { select: i, ...r } = a;
  return Ln({ ...r, select: (o) => (i ? i(o.loaderDeps) : o.loaderDeps) });
}
function Xf(a) {
  return Ln({
    from: a.from,
    shouldThrow: a.shouldThrow,
    structuralSharing: a.structuralSharing,
    strict: a.strict,
    select: (i) => {
      const r = a.strict === !1 ? i.params : i._strictParams;
      return a.select ? a.select(r) : r;
    },
  });
}
function Ff(a) {
  return Ln({
    from: a.from,
    strict: a.strict,
    shouldThrow: a.shouldThrow,
    structuralSharing: a.structuralSharing,
    select: (i) => (a.select ? a.select(i.search) : i.search),
  });
}
function Pf(a) {
  const i = At();
  return le.useCallback(
    (r) => i.navigate({ ...r, from: r.from ?? (a == null ? void 0 : a.from) }),
    [a == null ? void 0 : a.from, i],
  );
}
var K0 = $g();
const Xx = Jg(K0);
function Fx(a, i) {
  const r = At(),
    [o, l] = le.useState(!1),
    f = le.useRef(!1),
    d = kx(i),
    {
      activeProps: h,
      inactiveProps: y,
      activeOptions: p,
      to: b,
      preload: g,
      preloadDelay: S,
      hashScrollIntoView: E,
      replace: R,
      startTransition: k,
      resetScroll: L,
      viewTransition: A,
      children: G,
      target: Z,
      disabled: P,
      style: K,
      className: I,
      onClick: B,
      onFocus: te,
      onMouseEnter: ae,
      onMouseLeave: X,
      onTouchStart: ee,
      ignoreBlocker: ue,
      params: ge,
      search: Ue,
      hash: pe,
      state: C,
      mask: H,
      reloadDocument: ne,
      unsafeRelative: ve,
      from: se,
      _fromLocation: x,
      ...U
    } = a,
    Q = ot({ select: (ke) => ke.location.search, structuralSharing: !0 }),
    $ = a.from,
    ie = le.useMemo(
      () => ({ ...a, from: $ }),
      [
        r,
        Q,
        $,
        a._fromLocation,
        a.hash,
        a.to,
        a.search,
        a.params,
        a.state,
        a.mask,
        a.unsafeRelative,
      ],
    ),
    de = le.useMemo(() => r.buildLocation({ ...ie }), [r, ie]),
    be = le.useMemo(() => {
      if (P) return;
      let ke = de.maskedLocation ? de.maskedLocation.url.href : de.url.href,
        Be = !1;
      return (
        r.origin &&
          (ke.startsWith(r.origin)
            ? (ke = r.history.createHref(ke.replace(r.origin, "")) || "/")
            : (Be = !0)),
        { href: ke, external: Be }
      );
    }, [P, de.maskedLocation, de.url, r.origin, r.history]),
    xe = le.useMemo(() => {
      if (be != null && be.external) return yl(be.href) ? void 0 : be.href;
      try {
        return (new URL(b), yl(b) ? void 0 : b);
      } catch {}
    }, [b, be]),
    Le = a.reloadDocument || xe ? !1 : (g ?? r.options.defaultPreload),
    Lt = S ?? r.options.defaultPreloadDelay ?? 0,
    Kt = ot({
      select: (ke) => {
        if (xe) return !1;
        if (p != null && p.exact) {
          if (!cS(ke.location.pathname, de.pathname, r.basepath)) return !1;
        } else {
          const Be = bl(ke.location.pathname, r.basepath),
            Ot = bl(de.pathname, r.basepath);
          if (!(Be.startsWith(Ot) && (Be.length === Ot.length || Be[Ot.length] === "/"))) return !1;
        }
        return ((p == null ? void 0 : p.includeSearch) ?? !0) &&
          !_i(ke.location.search, de.search, {
            partial: !(p != null && p.exact),
            ignoreUndefined: !(p != null && p.explicitUndefined),
          })
          ? !1
          : p != null && p.includeHash
            ? ke.location.hash === de.hash
            : !0;
      },
    }),
    mt = le.useCallback(() => {
      r.preloadRoute({ ...ie }).catch((ke) => {
        (console.warn(ke), console.warn(VS));
      });
    }, [r, ie]),
    Ci = le.useCallback(
      (ke) => {
        ke != null && ke.isIntersecting && mt();
      },
      [mt],
    );
  (Cx(d, Ci, $x, { disabled: !!P || Le !== "viewport" }),
    le.useEffect(() => {
      f.current || (!P && Le === "render" && (mt(), (f.current = !0)));
    }, [P, mt, Le]));
  const It = (ke) => {
    const Be = ke.currentTarget.getAttribute("target"),
      Ot = Z !== void 0 ? Z : Be;
    if (!P && !Wx(ke) && !ke.defaultPrevented && (!Ot || Ot === "_self") && ke.button === 0) {
      (ke.preventDefault(),
        K0.flushSync(() => {
          l(!0);
        }));
      const Tn = r.subscribe("onResolved", () => {
        (Tn(), l(!1));
      });
      r.navigate({
        ...ie,
        replace: R,
        resetScroll: L,
        hashScrollIntoView: E,
        startTransition: k,
        viewTransition: A,
        ignoreBlocker: ue,
      });
    }
  };
  if (xe)
    return {
      ...U,
      ref: d,
      href: xe,
      ...(G && { children: G }),
      ...(Z && { target: Z }),
      ...(P && { disabled: P }),
      ...(K && { style: K }),
      ...(I && { className: I }),
      ...(B && { onClick: B }),
      ...(te && { onFocus: te }),
      ...(ae && { onMouseEnter: ae }),
      ...(X && { onMouseLeave: X }),
      ...(ee && { onTouchStart: ee }),
    };
  const la = (ke) => {
      P || (Le && mt());
    },
    ca = la,
    jn = (ke) => {
      if (!(P || !Le))
        if (!Lt) mt();
        else {
          const Be = ke.target;
          if (Ms.has(Be)) return;
          const Ot = setTimeout(() => {
            (Ms.delete(Be), mt());
          }, Lt);
          Ms.set(Be, Ot);
        }
    },
    Ja = (ke) => {
      if (P || !Le || !Lt) return;
      const Be = ke.target,
        Ot = Ms.get(Be);
      Ot && (clearTimeout(Ot), Ms.delete(Be));
    },
    pt = Kt ? (Ha(h, {}) ?? Px) : Sf,
    En = Kt ? Sf : (Ha(y, {}) ?? Sf),
    ua = [I, pt.className, En.className].filter(Boolean).join(" "),
    gt = (K || pt.style || En.style) && { ...K, ...pt.style, ...En.style };
  return {
    ...U,
    ...pt,
    ...En,
    href: be == null ? void 0 : be.href,
    ref: d,
    onClick: Cs([B, It]),
    onFocus: Cs([te, la]),
    onMouseEnter: Cs([ae, jn]),
    onMouseLeave: Cs([X, Ja]),
    onTouchStart: Cs([ee, ca]),
    disabled: !!P,
    target: Z,
    ...(gt && { style: gt }),
    ...(ua && { className: ua }),
    ...(P && Kx),
    ...(Kt && Ix),
    ...(o && Jx),
  };
}
const Sf = {},
  Px = { className: "active" },
  Kx = { role: "link", "aria-disabled": !0 },
  Ix = { "data-status": "active", "aria-current": "page" },
  Jx = { "data-transitioning": "transitioning" },
  Ms = new WeakMap(),
  $x = { rootMargin: "100px" },
  Cs = (a) => (i) => {
    for (const r of a)
      if (r) {
        if (i.defaultPrevented) return;
        r(i);
      }
  },
  Us = le.forwardRef((a, i) => {
    const { _asChild: r, ...o } = a,
      { type: l, ref: f, ...d } = Fx(o, i),
      h =
        typeof o.children == "function"
          ? o.children({ isActive: d["data-status"] === "active" })
          : o.children;
    return (r === void 0 && delete d.disabled, le.createElement(r || "a", { ...d, ref: f }, h));
  });
function Wx(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
let ew = class extends g0 {
  constructor(i) {
    (super(i),
      (this.useMatch = (r) =>
        Ln({
          select: r == null ? void 0 : r.select,
          from: this.id,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
        })),
      (this.useRouteContext = (r) =>
        Ln({
          ...r,
          from: this.id,
          select: (o) => (r != null && r.select ? r.select(o.context) : o.context),
        })),
      (this.useSearch = (r) =>
        Ff({
          select: r == null ? void 0 : r.select,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
          from: this.id,
        })),
      (this.useParams = (r) =>
        Xf({
          select: r == null ? void 0 : r.select,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
          from: this.id,
        })),
      (this.useLoaderDeps = (r) => Qf({ ...r, from: this.id })),
      (this.useLoaderData = (r) => Gf({ ...r, from: this.id })),
      (this.useNavigate = () => Pf({ from: this.fullPath })),
      (this.Link = W.forwardRef((r, o) => F.jsx(Us, { ref: o, from: this.fullPath, ...r }))),
      (this.$$typeof = Symbol.for("react.memo")));
  }
};
function tw(a) {
  return new ew(a);
}
class nw extends ZS {
  constructor(i) {
    (super(i),
      (this.useMatch = (r) =>
        Ln({
          select: r == null ? void 0 : r.select,
          from: this.id,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
        })),
      (this.useRouteContext = (r) =>
        Ln({
          ...r,
          from: this.id,
          select: (o) => (r != null && r.select ? r.select(o.context) : o.context),
        })),
      (this.useSearch = (r) =>
        Ff({
          select: r == null ? void 0 : r.select,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
          from: this.id,
        })),
      (this.useParams = (r) =>
        Xf({
          select: r == null ? void 0 : r.select,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
          from: this.id,
        })),
      (this.useLoaderDeps = (r) => Qf({ ...r, from: this.id })),
      (this.useLoaderData = (r) => Gf({ ...r, from: this.id })),
      (this.useNavigate = () => Pf({ from: this.fullPath })),
      (this.Link = W.forwardRef((r, o) => F.jsx(Us, { ref: o, from: this.fullPath, ...r }))),
      (this.$$typeof = Symbol.for("react.memo")));
  }
}
function aw(a) {
  return new nw(a);
}
function Tl(a) {
  return typeof a == "object"
    ? new vg(a, { silent: !0 }).createRoute(a)
    : new vg(a, { silent: !0 }).createRoute;
}
class vg {
  constructor(i, r) {
    ((this.path = i),
      (this.createRoute = (o) => {
        this.silent;
        const l = tw(o);
        return ((l.isRoot = !1), l);
      }),
      (this.silent = r == null ? void 0 : r.silent));
  }
}
class bg {
  constructor(i) {
    ((this.useMatch = (r) =>
      Ln({
        select: r == null ? void 0 : r.select,
        from: this.options.id,
        structuralSharing: r == null ? void 0 : r.structuralSharing,
      })),
      (this.useRouteContext = (r) =>
        Ln({
          from: this.options.id,
          select: (o) => (r != null && r.select ? r.select(o.context) : o.context),
        })),
      (this.useSearch = (r) =>
        Ff({
          select: r == null ? void 0 : r.select,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
          from: this.options.id,
        })),
      (this.useParams = (r) =>
        Xf({
          select: r == null ? void 0 : r.select,
          structuralSharing: r == null ? void 0 : r.structuralSharing,
          from: this.options.id,
        })),
      (this.useLoaderDeps = (r) => Qf({ ...r, from: this.options.id })),
      (this.useLoaderData = (r) => Gf({ ...r, from: this.options.id })),
      (this.useNavigate = () => {
        const r = At();
        return Pf({ from: r.routesById[this.options.id].fullPath });
      }),
      (this.options = i),
      (this.$$typeof = Symbol.for("react.memo")));
  }
}
function Sg(a) {
  return typeof a == "object" ? new bg(a) : (i) => new bg({ id: a, ...i });
}
function I0(a, i) {
  let r, o, l, f;
  const d = () => (
      r ||
        (r = a()
          .then((y) => {
            ((r = void 0), (o = y[i]));
          })
          .catch((y) => {
            if (
              ((l = y),
              Qb(l) && l instanceof Error && typeof window < "u" && typeof sessionStorage < "u")
            ) {
              const p = `tanstack_router_reload:${l.message}`;
              sessionStorage.getItem(p) || (sessionStorage.setItem(p, "1"), (f = !0));
            }
          })),
      r
    ),
    h = function (p) {
      if (f) throw (window.location.reload(), new Promise(() => {}));
      if (l) throw l;
      if (!o)
        if (El) El(d());
        else throw d();
      return le.createElement(o, p);
    };
  return ((h.preload = d), h);
}
function iw() {
  const a = At(),
    i = le.useRef({ router: a, mounted: !1 }),
    [r, o] = le.useState(!1),
    { hasPendingMatches: l, isLoading: f } = ot({
      select: (g) => ({
        isLoading: g.isLoading,
        hasPendingMatches: g.matches.some((S) => S.status === "pending"),
      }),
      structuralSharing: !0,
    }),
    d = mf(f),
    h = f || r || l,
    y = mf(h),
    p = f || l,
    b = mf(p);
  return (
    (a.startTransition = (g) => {
      (o(!0),
        le.startTransition(() => {
          (g(), o(!1));
        }));
    }),
    le.useEffect(() => {
      const g = a.history.subscribe(({ navigateOpts: E }) => {
          (E != null && E.skipTransitionerLoad) || a.load();
        }),
        S = a.buildLocation({
          to: a.latestLocation.pathname,
          search: !0,
          params: !0,
          hash: !0,
          state: !0,
          _includeValidateSearch: !0,
        });
      return (
        aa(a.latestLocation.publicHref) !== aa(S.publicHref) &&
          a.commitLocation({ ...S, replace: !0 }),
        () => {
          g();
        }
      );
    }, [a, a.history]),
    ll(() => {
      if ((typeof window < "u" && a.ssr) || (i.current.router === a && i.current.mounted)) return;
      ((i.current = { router: a, mounted: !0 }),
        (async () => {
          try {
            await a.load();
          } catch (S) {
            console.error(S);
          }
        })());
    }, [a]),
    ll(() => {
      d && !f && a.emit({ type: "onLoad", ...xi(a.state) });
    }, [d, a, f]),
    ll(() => {
      b && !p && a.emit({ type: "onBeforeRouteMount", ...xi(a.state) });
    }, [p, b, a]),
    ll(() => {
      if (y && !h) {
        const g = xi(a.state);
        (a.emit({ type: "onResolved", ...g }),
          a.__store.setState((S) => ({ ...S, status: "idle", resolvedLocation: S.location })),
          g.hrefChanged && yS(a));
      }
    }, [h, y, a]),
    null
  );
}
function rw(a) {
  const i = ot({ select: (r) => `not-found-${r.location.pathname}-${r.status}` });
  return F.jsx(Yf, {
    getResetKey: () => i,
    onCatch: (r, o) => {
      var l;
      if (Dt(r)) (l = a.onCatch) == null || l.call(a, r, o);
      else throw r;
    },
    errorComponent: ({ error: r }) => {
      var o;
      if (Dt(r)) return (o = a.fallback) == null ? void 0 : o.call(a, r);
      throw r;
    },
    children: a.children,
  });
}
function sw() {
  return F.jsx("p", { children: "Not Found" });
}
function br(a) {
  return F.jsx(F.Fragment, { children: a.children });
}
function J0(a, i, r) {
  return i.options.notFoundComponent
    ? F.jsx(i.options.notFoundComponent, { ...r })
    : a.options.defaultNotFoundComponent
      ? F.jsx(a.options.defaultNotFoundComponent, { ...r })
      : F.jsx(sw, {});
}
function ow({ children: a }) {
  var r;
  const i = At();
  return i.isServer
    ? F.jsx("script", {
        nonce: (r = i.options.ssr) == null ? void 0 : r.nonce,
        dangerouslySetInnerHTML: { __html: a + ";document.currentScript.remove()" },
      })
    : null;
}
function lw() {
  const a = At();
  if (
    !a.isScrollRestoring ||
    !a.isServer ||
    (typeof a.options.scrollRestoration == "function" &&
      !a.options.scrollRestoration({ location: a.latestLocation }))
  )
    return null;
  const r = (a.options.getScrollRestorationKey || Ef)(a.latestLocation),
    o = r !== Ef(a.latestLocation) ? r : void 0,
    l = { storageKey: Sl, shouldScrollRestoration: !0 };
  return (
    o && (l.key = o), F.jsx(ow, { children: `(${s0.toString()})(${n0(JSON.stringify(l))})` })
  );
}
const $0 = le.memo(function ({ matchId: i }) {
  var A, G;
  const r = At(),
    o = ot({
      select: (Z) => {
        const P = Z.matches.find((K) => K.id === i);
        return (Pt(P), { routeId: P.routeId, ssr: P.ssr, _displayPending: P._displayPending });
      },
      structuralSharing: !0,
    }),
    l = r.routesById[o.routeId],
    f = l.options.pendingComponent ?? r.options.defaultPendingComponent,
    d = f ? F.jsx(f, {}) : null,
    h = l.options.errorComponent ?? r.options.defaultErrorComponent,
    y = l.options.onCatch ?? r.options.defaultOnCatch,
    p = l.isRoot
      ? (l.options.notFoundComponent ??
        ((A = r.options.notFoundRoute) == null ? void 0 : A.options.component))
      : l.options.notFoundComponent,
    b = o.ssr === !1 || o.ssr === "data-only",
    g =
      (!l.isRoot || l.options.wrapInSuspense || b) &&
      (l.options.wrapInSuspense ??
        f ??
        (((G = l.options.errorComponent) == null ? void 0 : G.preload) || b))
        ? le.Suspense
        : br,
    S = h ? Yf : br,
    E = p ? rw : br,
    R = ot({ select: (Z) => Z.loadedAt }),
    k = ot({
      select: (Z) => {
        var K;
        const P = Z.matches.findIndex((I) => I.id === i);
        return (K = Z.matches[P - 1]) == null ? void 0 : K.routeId;
      },
    }),
    L = l.isRoot ? (l.options.shellComponent ?? br) : br;
  return F.jsxs(L, {
    children: [
      F.jsx(Hl.Provider, {
        value: i,
        children: F.jsx(g, {
          fallback: d,
          children: F.jsx(S, {
            getResetKey: () => R,
            errorComponent: h || Bl,
            onCatch: (Z, P) => {
              if (Dt(Z)) throw Z;
              y == null || y(Z, P);
            },
            children: F.jsx(E, {
              fallback: (Z) => {
                if (!p || (Z.routeId && Z.routeId !== o.routeId) || (!Z.routeId && !l.isRoot))
                  throw Z;
                return le.createElement(p, Z);
              },
              children:
                b || o._displayPending
                  ? F.jsx(Lx, { fallback: d, children: F.jsx(_g, { matchId: i }) })
                  : F.jsx(_g, { matchId: i }),
            }),
          }),
        }),
      }),
      k === Ft && r.options.scrollRestoration
        ? F.jsxs(F.Fragment, { children: [F.jsx(cw, {}), F.jsx(lw, {})] })
        : null,
    ],
  });
});
function cw() {
  const a = At(),
    i = le.useRef(void 0);
  return F.jsx(
    "script",
    {
      suppressHydrationWarning: !0,
      ref: (r) => {
        r &&
          (i.current === void 0 || i.current.href !== a.latestLocation.href) &&
          (a.emit({ type: "onRendered", ...xi(a.state) }), (i.current = a.latestLocation));
      },
    },
    a.latestLocation.state.__TSR_key,
  );
}
const _g = le.memo(function ({ matchId: i }) {
    var y, p, b, g;
    const r = At(),
      {
        match: o,
        key: l,
        routeId: f,
      } = ot({
        select: (S) => {
          const E = S.matches.find((G) => G.id === i),
            R = E.routeId,
            k = r.routesById[R].options.remountDeps ?? r.options.defaultRemountDeps,
            L =
              k == null
                ? void 0
                : k({
                    routeId: R,
                    loaderDeps: E.loaderDeps,
                    params: E._strictParams,
                    search: E._strictSearch,
                  });
          return {
            key: L ? JSON.stringify(L) : void 0,
            routeId: R,
            match: {
              id: E.id,
              status: E.status,
              error: E.error,
              invalid: E.invalid,
              _forcePending: E._forcePending,
              _displayPending: E._displayPending,
            },
          };
        },
        structuralSharing: !0,
      }),
      d = r.routesById[f],
      h = le.useMemo(() => {
        const S = d.options.component ?? r.options.defaultComponent;
        return S ? F.jsx(S, {}, l) : F.jsx(W0, {});
      }, [l, d.options.component, r.options.defaultComponent]);
    if (o._displayPending)
      throw (y = r.getMatch(o.id)) == null ? void 0 : y._nonReactive.displayPendingPromise;
    if (o._forcePending)
      throw (p = r.getMatch(o.id)) == null ? void 0 : p._nonReactive.minPendingPromise;
    if (o.status === "pending") {
      const S = d.options.pendingMinMs ?? r.options.defaultPendingMinMs;
      if (S) {
        const E = r.getMatch(o.id);
        if (E && !E._nonReactive.minPendingPromise && !r.isServer) {
          const R = wi();
          ((E._nonReactive.minPendingPromise = R),
            setTimeout(() => {
              (R.resolve(), (E._nonReactive.minPendingPromise = void 0));
            }, S));
        }
      }
      throw (b = r.getMatch(o.id)) == null ? void 0 : b._nonReactive.loadPromise;
    }
    if (o.status === "notFound") return (Pt(Dt(o.error)), J0(r, d, o.error));
    if (o.status === "redirected")
      throw (Pt(yn(o.error)), (g = r.getMatch(o.id)) == null ? void 0 : g._nonReactive.loadPromise);
    if (o.status === "error") {
      if (r.isServer) {
        const S = (d.options.errorComponent ?? r.options.defaultErrorComponent) || Bl;
        return F.jsx(S, { error: o.error, reset: void 0, info: { componentStack: "" } });
      }
      throw o.error;
    }
    return h;
  }),
  W0 = le.memo(function () {
    const i = At(),
      r = le.useContext(Hl),
      o = ot({
        select: (p) => {
          var b;
          return (b = p.matches.find((g) => g.id === r)) == null ? void 0 : b.routeId;
        },
      }),
      l = i.routesById[o],
      f = ot({
        select: (p) => {
          const g = p.matches.find((S) => S.id === r);
          return (Pt(g), g.globalNotFound);
        },
      }),
      d = ot({
        select: (p) => {
          var S;
          const b = p.matches,
            g = b.findIndex((E) => E.id === r);
          return (S = b[g + 1]) == null ? void 0 : S.id;
        },
      }),
      h = i.options.defaultPendingComponent ? F.jsx(i.options.defaultPendingComponent, {}) : null;
    if (f) return J0(i, l, void 0);
    if (!d) return null;
    const y = F.jsx($0, { matchId: d });
    return o === Ft ? F.jsx(le.Suspense, { fallback: h, children: y }) : y;
  });
function uw() {
  const a = At(),
    r = a.routesById[Ft].options.pendingComponent ?? a.options.defaultPendingComponent,
    o = r ? F.jsx(r, {}) : null,
    l = a.isServer || (typeof document < "u" && a.ssr) ? br : le.Suspense,
    f = F.jsxs(l, { fallback: o, children: [!a.isServer && F.jsx(iw, {}), F.jsx(fw, {})] });
  return a.options.InnerWrap ? F.jsx(a.options.InnerWrap, { children: f }) : f;
}
function fw() {
  const a = At(),
    i = ot({
      select: (l) => {
        var f;
        return (f = l.matches[0]) == null ? void 0 : f.id;
      },
    }),
    r = ot({ select: (l) => l.loadedAt }),
    o = i ? F.jsx($0, { matchId: i }) : null;
  return F.jsx(Hl.Provider, {
    value: i,
    children: a.options.disableGlobalCatchBoundary
      ? o
      : F.jsx(Yf, {
          getResetKey: () => r,
          errorComponent: Bl,
          onCatch: (l) => {
            l.message || l.toString();
          },
          children: o,
        }),
  });
}
const dw = (a) => new hw(a);
class hw extends zS {
  constructor(i) {
    super(i);
  }
}
typeof globalThis < "u"
  ? ((globalThis.createFileRoute = Tl), (globalThis.createLazyFileRoute = Sg))
  : typeof window < "u" && ((window.createFileRoute = Tl), (window.createLazyFileRoute = Sg));
function mw({ router: a, children: i, ...r }) {
  Object.keys(r).length > 0 &&
    a.update({ ...a.options, ...r, context: { ...a.options.context, ...r.context } });
  const o = P0(),
    l = F.jsx(o.Provider, { value: a, children: i });
  return a.options.Wrap ? F.jsx(a.options.Wrap, { children: l }) : l;
}
function pw({ router: a, ...i }) {
  return F.jsx(mw, { router: a, ...i, children: F.jsx(uw, {}) });
}
function ey({ tag: a, attrs: i, children: r, nonce: o }) {
  switch (a) {
    case "title":
      return F.jsx("title", { ...i, suppressHydrationWarning: !0, children: r });
    case "meta":
      return F.jsx("meta", { ...i, suppressHydrationWarning: !0 });
    case "link":
      return F.jsx("link", { ...i, nonce: o, suppressHydrationWarning: !0 });
    case "style":
      return F.jsx("style", { ...i, dangerouslySetInnerHTML: { __html: r }, nonce: o });
    case "script":
      return F.jsx(gw, { attrs: i, children: r });
    default:
      return null;
  }
}
function gw({ attrs: a, children: i }) {
  const r = At();
  if (
    (le.useEffect(() => {
      if (a != null && a.src) {
        const o = (() => {
          try {
            const d = document.baseURI || window.location.href;
            return new URL(a.src, d).href;
          } catch {
            return a.src;
          }
        })();
        if (Array.from(document.querySelectorAll("script[src]")).find((d) => d.src === o)) return;
        const f = document.createElement("script");
        for (const [d, h] of Object.entries(a))
          d !== "suppressHydrationWarning" &&
            h !== void 0 &&
            h !== !1 &&
            f.setAttribute(d, typeof h == "boolean" ? "" : String(h));
        return (
          document.head.appendChild(f),
          () => {
            f.parentNode && f.parentNode.removeChild(f);
          }
        );
      }
      if (typeof i == "string") {
        const o = typeof (a == null ? void 0 : a.type) == "string" ? a.type : "text/javascript",
          l = typeof (a == null ? void 0 : a.nonce) == "string" ? a.nonce : void 0;
        if (
          Array.from(document.querySelectorAll("script:not([src])")).find((h) => {
            if (!(h instanceof HTMLScriptElement)) return !1;
            const y = h.getAttribute("type") ?? "text/javascript",
              p = h.getAttribute("nonce") ?? void 0;
            return h.textContent === i && y === o && p === l;
          })
        )
          return;
        const d = document.createElement("script");
        if (((d.textContent = i), a))
          for (const [h, y] of Object.entries(a))
            h !== "suppressHydrationWarning" &&
              y !== void 0 &&
              y !== !1 &&
              d.setAttribute(h, typeof y == "boolean" ? "" : String(y));
        return (
          document.head.appendChild(d),
          () => {
            d.parentNode && d.parentNode.removeChild(d);
          }
        );
      }
    }, [a, i]),
    !r.isServer)
  ) {
    const { src: o, ...l } = a || {};
    return F.jsx("script", {
      suppressHydrationWarning: !0,
      dangerouslySetInnerHTML: { __html: "" },
      ...l,
    });
  }
  return a != null && a.src && typeof a.src == "string"
    ? F.jsx("script", { ...a, suppressHydrationWarning: !0 })
    : typeof i == "string"
      ? F.jsx("script", {
          ...a,
          dangerouslySetInnerHTML: { __html: i },
          suppressHydrationWarning: !0,
        })
      : null;
}
const yw = () => {
  var y;
  const a = At(),
    i = (y = a.options.ssr) == null ? void 0 : y.nonce,
    r = ot({ select: (p) => p.matches.map((b) => b.meta).filter(Boolean) }),
    o = le.useMemo(() => {
      const p = [],
        b = {};
      let g;
      for (let S = r.length - 1; S >= 0; S--) {
        const E = r[S];
        for (let R = E.length - 1; R >= 0; R--) {
          const k = E[R];
          if (k)
            if (k.title) g || (g = { tag: "title", children: k.title });
            else if ("script:ld+json" in k)
              try {
                const L = JSON.stringify(k["script:ld+json"]);
                p.push({ tag: "script", attrs: { type: "application/ld+json" }, children: n0(L) });
              } catch {}
            else {
              const L = k.name ?? k.property;
              if (L) {
                if (b[L]) continue;
                b[L] = !0;
              }
              p.push({ tag: "meta", attrs: { ...k, nonce: i } });
            }
        }
      }
      return (
        g && p.push(g),
        i && p.push({ tag: "meta", attrs: { property: "csp-nonce", content: i } }),
        p.reverse(),
        p
      );
    }, [r, i]),
    l = ot({
      select: (p) => {
        var E;
        const b = p.matches
            .map((R) => R.links)
            .filter(Boolean)
            .flat(1)
            .map((R) => ({ tag: "link", attrs: { ...R, nonce: i } })),
          g = (E = a.ssr) == null ? void 0 : E.manifest,
          S = p.matches
            .map((R) => {
              var k;
              return (
                ((k = g == null ? void 0 : g.routes[R.routeId]) == null ? void 0 : k.assets) ?? []
              );
            })
            .filter(Boolean)
            .flat(1)
            .filter((R) => R.tag === "link")
            .map((R) => ({
              tag: "link",
              attrs: { ...R.attrs, suppressHydrationWarning: !0, nonce: i },
            }));
        return [...b, ...S];
      },
      structuralSharing: !0,
    }),
    f = ot({
      select: (p) => {
        const b = [];
        return (
          p.matches
            .map((g) => a.looseRoutesById[g.routeId])
            .forEach((g) => {
              var S, E, R, k;
              return (k =
                (R =
                  (E = (S = a.ssr) == null ? void 0 : S.manifest) == null
                    ? void 0
                    : E.routes[g.id]) == null
                  ? void 0
                  : R.preloads) == null
                ? void 0
                : k.filter(Boolean).forEach((L) => {
                    b.push({ tag: "link", attrs: { rel: "modulepreload", href: L, nonce: i } });
                  });
            }),
          b
        );
      },
      structuralSharing: !0,
    }),
    d = ot({
      select: (p) =>
        p.matches
          .map((b) => b.styles)
          .flat(1)
          .filter(Boolean)
          .map(({ children: b, ...g }) => ({
            tag: "style",
            attrs: { ...g, nonce: i },
            children: b,
          })),
      structuralSharing: !0,
    }),
    h = ot({
      select: (p) =>
        p.matches
          .map((b) => b.headScripts)
          .flat(1)
          .filter(Boolean)
          .map(({ children: b, ...g }) => ({
            tag: "script",
            attrs: { ...g, nonce: i },
            children: b,
          })),
      structuralSharing: !0,
    });
  return vw([...o, ...f, ...l, ...d, ...h], (p) => JSON.stringify(p));
};
function vw(a, i) {
  const r = new Set();
  return a.filter((o) => {
    const l = i(o);
    return r.has(l) ? !1 : (r.add(l), !0);
  });
}
function bw() {
  var o;
  const a = yw(),
    r = (o = At().options.ssr) == null ? void 0 : o.nonce;
  return F.jsx(F.Fragment, {
    children: a.map((l) =>
      le.createElement(ey, { ...l, key: `tsr-meta-${JSON.stringify(l)}`, nonce: r }),
    ),
  });
}
const Sw = () => {
  var d;
  const a = At(),
    i = (d = a.options.ssr) == null ? void 0 : d.nonce,
    r = ot({
      select: (h) => {
        var b;
        const y = [],
          p = (b = a.ssr) == null ? void 0 : b.manifest;
        return p
          ? (h.matches
              .map((g) => a.looseRoutesById[g.routeId])
              .forEach((g) => {
                var S, E;
                return (E = (S = p.routes[g.id]) == null ? void 0 : S.assets) == null
                  ? void 0
                  : E.filter((R) => R.tag === "script").forEach((R) => {
                      y.push({
                        tag: "script",
                        attrs: { ...R.attrs, nonce: i },
                        children: R.children,
                      });
                    });
              }),
            y)
          : [];
      },
      structuralSharing: !0,
    }),
    { scripts: o } = ot({
      select: (h) => ({
        scripts: h.matches
          .map((y) => y.scripts)
          .flat(1)
          .filter(Boolean)
          .map(({ children: y, ...p }) => ({
            tag: "script",
            attrs: { ...p, suppressHydrationWarning: !0, nonce: i },
            children: y,
          })),
      }),
      structuralSharing: !0,
    });
  let l;
  a.serverSsr && (l = a.serverSsr.takeBufferedScripts());
  const f = [...o, ...r];
  return (
    l && f.unshift(l),
    F.jsx(F.Fragment, {
      children: f.map((h, y) => le.createElement(ey, { ...h, key: `tsr-scripts-${h.tag}-${y}` })),
    })
  );
};
function _w(a, i) {
  ((a.id = i.i),
    (a.__beforeLoadContext = i.b),
    (a.loaderData = i.l),
    (a.status = i.s),
    (a.ssr = i.ssr),
    (a.updatedAt = i.u),
    (a.error = i.e));
}
async function xw(a) {
  var k, L;
  Pt(window.$_TSR);
  const i = a.options.serializationAdapters;
  if (i != null && i.length) {
    const A = new Map();
    (i.forEach((G) => {
      A.set(G.key, G.fromSerializable);
    }),
      (window.$_TSR.t = A),
      window.$_TSR.buffer.forEach((G) => G()));
  }
  ((window.$_TSR.initialized = !0), Pt(window.$_TSR.router));
  const { manifest: r, dehydratedData: o, lastMatchId: l } = window.$_TSR.router;
  a.ssr = { manifest: r };
  const f = document.querySelector('meta[property="csp-nonce"]'),
    d = f == null ? void 0 : f.content;
  a.options.ssr = { nonce: d };
  const h = a.matchRoutes(a.state.location),
    y = Promise.all(
      h.map((A) => {
        const G = a.looseRoutesById[A.routeId];
        return a.loadRouteChunk(G);
      }),
    );
  function p(A) {
    const Z = a.looseRoutesById[A.routeId].options.pendingMinMs ?? a.options.defaultPendingMinMs;
    if (Z) {
      const P = wi();
      ((A._nonReactive.minPendingPromise = P),
        (A._forcePending = !0),
        setTimeout(() => {
          (P.resolve(),
            a.updateMatch(
              A.id,
              (K) => ((K._nonReactive.minPendingPromise = void 0), { ...K, _forcePending: void 0 }),
            ));
        }, Z));
    }
  }
  function b(A) {
    const G = a.looseRoutesById[A.routeId];
    G && (G.options.ssr = A.ssr);
  }
  let g;
  (h.forEach((A) => {
    const G = window.$_TSR.router.matches.find((Z) => Z.i === A.id);
    if (!G) {
      ((A._nonReactive.dehydrated = !1), (A.ssr = !1), b(A));
      return;
    }
    (_w(A, G),
      b(A),
      (A._nonReactive.dehydrated = A.ssr !== !1),
      (A.ssr === "data-only" || A.ssr === !1) && g === void 0 && ((g = A.index), p(A)));
  }),
    a.__store.setState((A) => ({ ...A, matches: h })),
    await ((L = (k = a.options).hydrate) == null ? void 0 : L.call(k, o)),
    await Promise.all(
      a.state.matches.map(async (A) => {
        var G, Z, P, K;
        try {
          const I = a.looseRoutesById[A.routeId],
            B = a.state.matches[A.index - 1],
            te = (B == null ? void 0 : B.context) ?? a.options.context;
          if (I.options.context) {
            const ue = {
              deps: A.loaderDeps,
              params: A.params,
              context: te ?? {},
              location: a.state.location,
              navigate: (ge) => a.navigate({ ...ge, _fromLocation: a.state.location }),
              buildLocation: a.buildLocation,
              cause: A.cause,
              abortController: A.abortController,
              preload: !1,
              matches: h,
            };
            A.__routeContext = I.options.context(ue) ?? void 0;
          }
          A.context = { ...te, ...A.__routeContext, ...A.__beforeLoadContext };
          const ae = {
              ssr: a.options.ssr,
              matches: a.state.matches,
              match: A,
              params: A.params,
              loaderData: A.loaderData,
            },
            X = await ((Z = (G = I.options).head) == null ? void 0 : Z.call(G, ae)),
            ee = await ((K = (P = I.options).scripts) == null ? void 0 : K.call(P, ae));
          ((A.meta = X == null ? void 0 : X.meta),
            (A.links = X == null ? void 0 : X.links),
            (A.headScripts = X == null ? void 0 : X.scripts),
            (A.styles = X == null ? void 0 : X.styles),
            (A.scripts = ee));
        } catch (I) {
          if (Dt(I))
            ((A.error = { isNotFound: !0 }),
              console.error(`NotFound error during hydration for routeId: ${A.routeId}`, I));
          else
            throw (
              (A.error = I), console.error(`Error during hydration for route ${A.routeId}:`, I), I
            );
        }
      }),
    ));
  const S = h[h.length - 1].id !== l;
  if (!h.some((A) => A.ssr === !1) && !S)
    return (
      h.forEach((A) => {
        A._nonReactive.dehydrated = void 0;
      }),
      y
    );
  const R = Promise.resolve()
    .then(() => a.load())
    .catch((A) => {
      console.error("Error during router hydration:", A);
    });
  if (S) {
    const A = h[1];
    (Pt(A),
      p(A),
      (A._displayPending = !0),
      (A._nonReactive.displayPendingPromise = R),
      R.then(() => {
        wr(() => {
          (a.__store.state.status === "pending" &&
            a.__store.setState((G) => ({ ...G, status: "idle", resolvedLocation: G.location })),
            a.updateMatch(A.id, (G) => ({
              ...G,
              _displayPending: void 0,
              displayPendingPromise: void 0,
            })));
        });
      }));
  }
  return y;
}
const ww = "__TSS_CONTEXT",
  Mf = Symbol.for("TSS_SERVER_FUNCTION"),
  Ew = "x-tss-serialized",
  Tw = "x-tss-raw",
  ty = "application/x-tss-framed",
  na = { JSON: 0, CHUNK: 1, END: 2, ERROR: 3 },
  yr = 9,
  xg = 1,
  Rw = /;\s*v=(\d+)/;
function Aw(a) {
  const i = a.match(Rw);
  return i ? parseInt(i[1], 10) : void 0;
}
function Mw(a) {
  const i = Aw(a);
  if (i !== void 0 && i !== xg)
    throw new Error(
      `Incompatible framed protocol version: server=${i}, client=${xg}. Please ensure client and server are using compatible versions.`,
    );
}
const ny = () => window.__TSS_START_OPTIONS__;
function Cw() {
  const a = ny(),
    i = a == null ? void 0 : a.serializationAdapters;
  return [...((i == null ? void 0 : i.map(dx)) ?? []), ...Ax];
}
const wg = new TextDecoder(),
  kw = new Uint8Array(0),
  Eg = 16 * 1024 * 1024,
  Tg = 32 * 1024 * 1024,
  Rg = 1024,
  Ag = 1e5;
function Ow(a) {
  const i = new Map(),
    r = new Map(),
    o = new Set();
  let l = !1,
    f = null,
    d = 0,
    h;
  const y = new ReadableStream({
    start(g) {
      h = g;
    },
    cancel() {
      l = !0;
      try {
        f == null || f.cancel();
      } catch {}
      (i.forEach((g) => {
        try {
          g.error(new Error("Framed response cancelled"));
        } catch {}
      }),
        i.clear(),
        r.clear(),
        o.clear());
    },
  });
  function p(g) {
    const S = r.get(g);
    if (S) return S;
    if (o.has(g))
      return new ReadableStream({
        start(R) {
          R.close();
        },
      });
    if (r.size >= Rg) throw new Error(`Too many raw streams in framed response (max ${Rg})`);
    const E = new ReadableStream({
      start(R) {
        i.set(g, R);
      },
      cancel() {
        (o.add(g), i.delete(g), r.delete(g));
      },
    });
    return (r.set(g, E), E);
  }
  function b(g) {
    return (p(g), i.get(g));
  }
  return (
    (async () => {
      const g = a.getReader();
      f = g;
      const S = [];
      let E = 0;
      function R() {
        if (E < yr) return null;
        const L = S[0];
        if (L.length >= yr) {
          const B = L[0],
            te = ((L[1] << 24) | (L[2] << 16) | (L[3] << 8) | L[4]) >>> 0,
            ae = ((L[5] << 24) | (L[6] << 16) | (L[7] << 8) | L[8]) >>> 0;
          return { type: B, streamId: te, length: ae };
        }
        const A = new Uint8Array(yr);
        let G = 0,
          Z = yr;
        for (let B = 0; B < S.length && Z > 0; B++) {
          const te = S[B],
            ae = Math.min(te.length, Z);
          (A.set(te.subarray(0, ae), G), (G += ae), (Z -= ae));
        }
        const P = A[0],
          K = ((A[1] << 24) | (A[2] << 16) | (A[3] << 8) | A[4]) >>> 0,
          I = ((A[5] << 24) | (A[6] << 16) | (A[7] << 8) | A[8]) >>> 0;
        return { type: P, streamId: K, length: I };
      }
      function k(L) {
        if (L === 0) return kw;
        const A = new Uint8Array(L);
        let G = 0,
          Z = L;
        for (; Z > 0 && S.length > 0; ) {
          const P = S[0];
          if (!P) break;
          const K = Math.min(P.length, Z);
          (A.set(P.subarray(0, K), G),
            (G += K),
            (Z -= K),
            K === P.length ? S.shift() : (S[0] = P.subarray(K)));
        }
        return ((E -= L), A);
      }
      try {
        for (;;) {
          const { done: L, value: A } = await g.read();
          if (l || L) break;
          if (A) {
            if (E + A.length > Tg) throw new Error(`Framed response buffer exceeded ${Tg} bytes`);
            for (S.push(A), E += A.length; ; ) {
              const G = R();
              if (!G) break;
              const { type: Z, streamId: P, length: K } = G;
              if (Z !== na.JSON && Z !== na.CHUNK && Z !== na.END && Z !== na.ERROR)
                throw new Error(`Unknown frame type: ${Z}`);
              if (Z === na.JSON) {
                if (P !== 0) throw new Error("Invalid JSON frame streamId (expected 0)");
              } else if (P === 0) throw new Error("Invalid raw frame streamId (expected non-zero)");
              if (K > Eg) throw new Error(`Frame payload too large: ${K} bytes (max ${Eg})`);
              const I = yr + K;
              if (E < I) break;
              if (++d > Ag) throw new Error(`Too many frames in framed response (max ${Ag})`);
              k(yr);
              const B = k(K);
              switch (Z) {
                case na.JSON: {
                  try {
                    h.enqueue(wg.decode(B));
                  } catch {}
                  break;
                }
                case na.CHUNK: {
                  const te = b(P);
                  te && te.enqueue(B);
                  break;
                }
                case na.END: {
                  const te = b(P);
                  if ((o.add(P), te)) {
                    try {
                      te.close();
                    } catch {}
                    i.delete(P);
                  }
                  break;
                }
                case na.ERROR: {
                  const te = b(P);
                  if ((o.add(P), te)) {
                    const ae = wg.decode(B);
                    (te.error(new Error(ae)), i.delete(P));
                  }
                  break;
                }
              }
            }
          }
        }
        if (E !== 0) throw new Error("Incomplete frame at end of framed response");
        try {
          h.close();
        } catch {}
        (i.forEach((L) => {
          try {
            L.close();
          } catch {}
        }),
          i.clear());
      } catch (L) {
        try {
          h.error(L);
        } catch {}
        (i.forEach((A) => {
          try {
            A.error(L);
          } catch {}
        }),
          i.clear());
      } finally {
        try {
          g.releaseLock();
        } catch {}
        f = null;
      }
    })(),
    { getOrCreateStream: p, jsonChunks: y }
  );
}
let Ar = null;
const Nw = Object.prototype.hasOwnProperty;
function ay(a) {
  for (const i in a) if (Nw.call(a, i)) return !0;
  return !1;
}
async function zw(a, i, r) {
  Ar || (Ar = Cw());
  const l = i[0],
    f = l.fetch ?? r,
    d = l.data instanceof FormData ? "formData" : "payload",
    h = l.headers ? new Headers(l.headers) : new Headers();
  if (
    (h.set("x-tsr-serverFn", "true"),
    d === "payload" && h.set("accept", `${ty}, application/x-ndjson, application/json`),
    l.method === "GET")
  ) {
    if (d === "formData") throw new Error("FormData is not supported with GET requests");
    const p = await iy(l);
    if (p !== void 0) {
      const b = o0({ payload: p });
      a.includes("?") ? (a += `&${b}`) : (a += `?${b}`);
    }
  }
  let y;
  if (l.method === "POST") {
    const p = await Dw(l);
    (p != null && p.contentType && h.set("content-type", p.contentType),
      (y = p == null ? void 0 : p.body));
  }
  return await Lw(async () => f(a, { method: l.method, headers: h, signal: l.signal, body: y }));
}
async function iy(a) {
  let i = !1;
  const r = {};
  if (
    (a.data !== void 0 && ((i = !0), (r.data = a.data)),
    a.context && ay(a.context) && ((i = !0), (r.context = a.context)),
    i)
  )
    return ry(r);
}
async function ry(a) {
  return JSON.stringify(await Promise.resolve(fx(a, { plugins: Ar })));
}
async function Dw(a) {
  if (a.data instanceof FormData) {
    let r;
    return (
      a.context && ay(a.context) && (r = await ry(a.context)),
      r !== void 0 && a.data.set(ww, r),
      { body: a.data }
    );
  }
  const i = await iy(a);
  if (i) return { body: i, contentType: "application/json" };
}
async function Lw(a) {
  let i;
  try {
    i = await a();
  } catch (l) {
    if (l instanceof Response) i = l;
    else throw (console.log(l), l);
  }
  if (i.headers.get(Tw) === "true") return i;
  const r = i.headers.get("content-type");
  if ((Pt(r), !!i.headers.get(Ew))) {
    let l;
    if (r.includes(ty)) {
      if ((Mw(r), !i.body)) throw new Error("No response body for framed response");
      const { getOrCreateStream: f, jsonChunks: d } = Ow(i.body),
        y = [Rx(f), ...(Ar || [])],
        p = new Map();
      l = await Uw({
        jsonStream: d,
        onMessage: (b) => hf(b, { refs: p, plugins: y }),
        onError(b, g) {
          console.error(b, g);
        },
      });
    } else if (r.includes("application/x-ndjson")) {
      const f = new Map();
      l = await jw({
        response: i,
        onMessage: (d) => hf(d, { refs: f, plugins: Ar }),
        onError(d, h) {
          console.error(d, h);
        },
      });
    } else if (r.includes("application/json")) {
      const f = await i.json();
      l = hf(f, { plugins: Ar });
    }
    if ((Pt(l), l instanceof Error)) throw l;
    return l;
  }
  if (r.includes("application/json")) {
    const l = await i.json(),
      f = wS(l);
    if (f) throw f;
    if (Dt(l)) throw l;
    return l;
  }
  if (!i.ok) throw new Error(await i.text());
  return i;
}
async function jw({ response: a, onMessage: i, onError: r }) {
  if (!a.body) throw new Error("No response body");
  const o = a.body.pipeThrough(new TextDecoderStream()).getReader();
  let l = "",
    f = !1,
    d;
  for (; !f; ) {
    const { value: h, done: y } = await o.read();
    if ((h && (l += h), l.length === 0 && y)) throw new Error("Stream ended before first object");
    if (
      l.endsWith(`
`)
    ) {
      const p = l
          .split(`
`)
          .filter(Boolean),
        b = p[0];
      if (!b) throw new Error("No JSON line in the first chunk");
      ((d = JSON.parse(b)),
        (f = !0),
        (l = p.slice(1).join(`
`)));
    } else {
      const p = l.indexOf(`
`);
      if (p >= 0) {
        const b = l.slice(0, p).trim();
        ((l = l.slice(p + 1)), b.length > 0 && ((d = JSON.parse(b)), (f = !0)));
      }
    }
  }
  return (
    (async () => {
      try {
        for (;;) {
          const { value: h, done: y } = await o.read();
          h && (l += h);
          const p = l.lastIndexOf(`
`);
          if (p >= 0) {
            const b = l.slice(0, p);
            l = l.slice(p + 1);
            const g = b
              .split(`
`)
              .filter(Boolean);
            for (const S of g)
              try {
                i(JSON.parse(S));
              } catch (E) {
                r == null || r(`Invalid JSON line: ${S}`, E);
              }
          }
          if (y) break;
        }
      } catch (h) {
        r == null || r("Stream processing error:", h);
      }
    })(),
    i(d)
  );
}
async function Uw({ jsonStream: a, onMessage: i, onError: r }) {
  const o = a.getReader(),
    { value: l, done: f } = await o.read();
  if (f || !l) throw new Error("Stream ended before first object");
  const d = JSON.parse(l);
  return (
    (async () => {
      try {
        for (;;) {
          const { value: h, done: y } = await o.read();
          if (y) break;
          if (h)
            try {
              i(JSON.parse(h));
            } catch (p) {
              r == null || r(`Invalid JSON: ${h}`, p);
            }
        }
      } catch (h) {
        r == null || r("Stream processing error:", h);
      }
    })(),
    i(d)
  );
}
function Bw(a) {
  const i = "/_serverFn/" + a;
  return Object.assign(
    (...l) => {
      var d, h;
      const f = (h = (d = ny()) == null ? void 0 : d.serverFns) == null ? void 0 : h.fetch;
      return zw(i, l, f ?? fetch);
    },
    { url: i, serverFnMeta: { id: a }, [Mf]: !0 },
  );
}
const Hw = {
  key: "$TSS/serverfn",
  test: (a) => (typeof a != "function" || !(Mf in a) ? !1 : !!a[Mf]),
  toSerializable: ({ serverFnMeta: a }) => ({ functionId: a.id }),
  fromSerializable: ({ functionId: a }) => Bw(a),
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qw = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Vw = (a) =>
    a.replace(/^([A-Z])|[\s-_]+(\w)/g, (i, r, o) => (o ? o.toUpperCase() : r.toLowerCase())),
  Mg = (a) => {
    const i = Vw(a);
    return i.charAt(0).toUpperCase() + i.slice(1);
  },
  sy = (...a) =>
    a
      .filter((i, r, o) => !!i && i.trim() !== "" && o.indexOf(i) === r)
      .join(" ")
      .trim(),
  Zw = (a) => {
    for (const i in a) if (i.startsWith("aria-") || i === "role" || i === "title") return !0;
  };
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Yw = {
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
 */ const Gw = le.forwardRef(
  (
    {
      color: a = "currentColor",
      size: i = 24,
      strokeWidth: r = 2,
      absoluteStrokeWidth: o,
      className: l = "",
      children: f,
      iconNode: d,
      ...h
    },
    y,
  ) =>
    le.createElement(
      "svg",
      {
        ref: y,
        ...Yw,
        width: i,
        height: i,
        stroke: a,
        strokeWidth: o ? (Number(r) * 24) / Number(i) : r,
        className: sy("lucide", l),
        ...(!f && !Zw(h) && { "aria-hidden": "true" }),
        ...h,
      },
      [...d.map(([p, b]) => le.createElement(p, b)), ...(Array.isArray(f) ? f : [f])],
    ),
);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ia = (a, i) => {
  const r = le.forwardRef(({ className: o, ...l }, f) =>
    le.createElement(Gw, {
      ref: f,
      iconNode: i,
      className: sy(`lucide-${qw(Mg(a))}`, `lucide-${a}`, o),
      ...l,
    }),
  );
  return ((r.displayName = Mg(a)), r);
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Qw = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
  Xw = Ia("circle-check", Qw);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fw = [
    [
      "path",
      {
        d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
        key: "tonef",
      },
    ],
    ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
  ],
  Pw = Ia("github", Fw);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Kw = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }],
  ],
  Iw = Ia("info", Kw);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jw = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  $w = Ia("loader-circle", Jw);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ww = [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
        key: "kfwtm",
      },
    ],
  ],
  e2 = Ia("moon", Ww);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const t2 = [
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    [
      "path",
      {
        d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
        key: "2d38gg",
      },
    ],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }],
  ],
  n2 = Ia("octagon-x", t2);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const a2 = [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ],
  Cg = Ia("sun", a2);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const i2 = [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        key: "wmoenq",
      },
    ],
    ["path", { d: "M12 9v4", key: "juzpu7" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  r2 = Ia("triangle-alert", i2),
  oy = le.createContext(void 0);
function kg() {
  return typeof window > "u"
    ? "light"
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
}
function s2() {
  if (typeof window > "u") return "system";
  const a = localStorage.getItem("theme");
  return a === "light" || a === "dark" || a === "system" ? a : "system";
}
function o2({ children: a }) {
  const [i, r] = le.useState("system"),
    [o, l] = le.useState("light"),
    [f, d] = le.useState(!1);
  (le.useEffect(() => {
    d(!0);
    const y = s2();
    r(y);
    const p = y === "system" ? kg() : y;
    (l(p), document.documentElement.classList.toggle("dark", p === "dark"));
  }, []),
    le.useEffect(() => {
      if (!f) return;
      const y = (b) => {
          if (i === "system") {
            const g = b.matches ? "dark" : "light";
            (l(g), document.documentElement.classList.toggle("dark", g === "dark"));
          }
        },
        p = window.matchMedia("(prefers-color-scheme: dark)");
      return (p.addEventListener("change", y), () => p.removeEventListener("change", y));
    }, [i, f]));
  const h = (y) => {
    (r(y), localStorage.setItem("theme", y));
    const p = y === "system" ? kg() : y;
    (l(p), document.documentElement.classList.toggle("dark", p === "dark"));
  };
  return F.jsx(oy.Provider, { value: { theme: i, resolvedTheme: o, setTheme: h }, children: a });
}
function ly() {
  const a = le.useContext(oy);
  if (a === void 0) throw new Error("useTheme must be used within a ThemeProvider");
  return a;
}
function l2() {
  const { setTheme: a, resolvedTheme: i } = ly(),
    [r, o] = le.useState(!1);
  le.useEffect(() => {
    o(!0);
  }, []);
  const l = () => {
    a(i === "dark" ? "light" : "dark");
  };
  return r
    ? F.jsx("button", {
        type: "button",
        onClick: l,
        className:
          "flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
        "aria-label": `Switch to ${i === "dark" ? "light" : "dark"} mode`,
        children:
          i === "dark" ? F.jsx(Cg, { className: "h-4 w-4" }) : F.jsx(e2, { className: "h-4 w-4" }),
      })
    : F.jsx("button", {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center text-muted-foreground",
        disabled: !0,
        "aria-label": "Toggle theme",
        children: F.jsx(Cg, { className: "h-4 w-4" }),
      });
}
function c2() {
  return F.jsx("header", {
    className: "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm",
    children: F.jsxs("nav", {
      className: "container mx-auto flex h-14 items-center justify-between px-6",
      children: [
        F.jsxs("div", {
          className: "flex items-center gap-8",
          children: [
            F.jsx(Us, {
              to: "/",
              className: "font-display text-sm font-bold uppercase tracking-wider",
              children: "Better Fullstack",
            }),
            F.jsx("div", {
              className: "hidden items-center gap-1 sm:flex",
              children: F.jsx(Us, {
                to: "/new",
                className:
                  "px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
                children: "Builder",
              }),
            }),
          ],
        }),
        F.jsxs("div", {
          className: "flex items-center gap-4",
          children: [
            F.jsx("a", {
              href: "https://github.com/Marve10s/Better-Fullstack",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-muted-foreground transition-colors hover:text-foreground",
              "aria-label": "GitHub",
              children: F.jsx(Pw, { className: "h-4 w-4" }),
            }),
            F.jsx("div", { className: "h-4 w-px bg-border" }),
            F.jsx(l2, {}),
          ],
        }),
      ],
    }),
  });
}
function u2(a) {
  if (typeof document > "u") return;
  let i = document.head || document.getElementsByTagName("head")[0],
    r = document.createElement("style");
  ((r.type = "text/css"),
    i.appendChild(r),
    r.styleSheet ? (r.styleSheet.cssText = a) : r.appendChild(document.createTextNode(a)));
}
const f2 = (a) => {
    switch (a) {
      case "success":
        return m2;
      case "info":
        return g2;
      case "warning":
        return p2;
      case "error":
        return y2;
      default:
        return null;
    }
  },
  d2 = Array(12).fill(0),
  h2 = ({ visible: a, className: i }) =>
    W.createElement(
      "div",
      { className: ["sonner-loading-wrapper", i].filter(Boolean).join(" "), "data-visible": a },
      W.createElement(
        "div",
        { className: "sonner-spinner" },
        d2.map((r, o) =>
          W.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${o}` }),
        ),
      ),
    ),
  m2 = W.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    W.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clipRule: "evenodd",
    }),
  ),
  p2 = W.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    W.createElement("path", {
      fillRule: "evenodd",
      d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
      clipRule: "evenodd",
    }),
  ),
  g2 = W.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    W.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
      clipRule: "evenodd",
    }),
  ),
  y2 = W.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    W.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
      clipRule: "evenodd",
    }),
  ),
  v2 = W.createElement(
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
    W.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    W.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
  ),
  b2 = () => {
    const [a, i] = W.useState(document.hidden);
    return (
      W.useEffect(() => {
        const r = () => {
          i(document.hidden);
        };
        return (
          document.addEventListener("visibilitychange", r),
          () => window.removeEventListener("visibilitychange", r)
        );
      }, []),
      a
    );
  };
let Cf = 1;
class S2 {
  constructor() {
    ((this.subscribe = (i) => (
      this.subscribers.push(i),
      () => {
        const r = this.subscribers.indexOf(i);
        this.subscribers.splice(r, 1);
      }
    )),
      (this.publish = (i) => {
        this.subscribers.forEach((r) => r(i));
      }),
      (this.addToast = (i) => {
        (this.publish(i), (this.toasts = [...this.toasts, i]));
      }),
      (this.create = (i) => {
        var r;
        const { message: o, ...l } = i,
          f =
            typeof (i == null ? void 0 : i.id) == "number" ||
            ((r = i.id) == null ? void 0 : r.length) > 0
              ? i.id
              : Cf++,
          d = this.toasts.find((y) => y.id === f),
          h = i.dismissible === void 0 ? !0 : i.dismissible;
        return (
          this.dismissedToasts.has(f) && this.dismissedToasts.delete(f),
          d
            ? (this.toasts = this.toasts.map((y) =>
                y.id === f
                  ? (this.publish({ ...y, ...i, id: f, title: o }),
                    { ...y, ...i, id: f, dismissible: h, title: o })
                  : y,
              ))
            : this.addToast({ title: o, ...l, dismissible: h, id: f }),
          f
        );
      }),
      (this.dismiss = (i) => (
        i
          ? (this.dismissedToasts.add(i),
            requestAnimationFrame(() => this.subscribers.forEach((r) => r({ id: i, dismiss: !0 }))))
          : this.toasts.forEach((r) => {
              this.subscribers.forEach((o) => o({ id: r.id, dismiss: !0 }));
            }),
        i
      )),
      (this.message = (i, r) => this.create({ ...r, message: i })),
      (this.error = (i, r) => this.create({ ...r, message: i, type: "error" })),
      (this.success = (i, r) => this.create({ ...r, type: "success", message: i })),
      (this.info = (i, r) => this.create({ ...r, type: "info", message: i })),
      (this.warning = (i, r) => this.create({ ...r, type: "warning", message: i })),
      (this.loading = (i, r) => this.create({ ...r, type: "loading", message: i })),
      (this.promise = (i, r) => {
        if (!r) return;
        let o;
        r.loading !== void 0 &&
          (o = this.create({
            ...r,
            promise: i,
            type: "loading",
            message: r.loading,
            description: typeof r.description != "function" ? r.description : void 0,
          }));
        const l = Promise.resolve(i instanceof Function ? i() : i);
        let f = o !== void 0,
          d;
        const h = l
            .then(async (p) => {
              if (((d = ["resolve", p]), W.isValidElement(p)))
                ((f = !1), this.create({ id: o, type: "default", message: p }));
              else if (x2(p) && !p.ok) {
                f = !1;
                const g =
                    typeof r.error == "function"
                      ? await r.error(`HTTP error! status: ${p.status}`)
                      : r.error,
                  S =
                    typeof r.description == "function"
                      ? await r.description(`HTTP error! status: ${p.status}`)
                      : r.description,
                  R = typeof g == "object" && !W.isValidElement(g) ? g : { message: g };
                this.create({ id: o, type: "error", description: S, ...R });
              } else if (p instanceof Error) {
                f = !1;
                const g = typeof r.error == "function" ? await r.error(p) : r.error,
                  S = typeof r.description == "function" ? await r.description(p) : r.description,
                  R = typeof g == "object" && !W.isValidElement(g) ? g : { message: g };
                this.create({ id: o, type: "error", description: S, ...R });
              } else if (r.success !== void 0) {
                f = !1;
                const g = typeof r.success == "function" ? await r.success(p) : r.success,
                  S = typeof r.description == "function" ? await r.description(p) : r.description,
                  R = typeof g == "object" && !W.isValidElement(g) ? g : { message: g };
                this.create({ id: o, type: "success", description: S, ...R });
              }
            })
            .catch(async (p) => {
              if (((d = ["reject", p]), r.error !== void 0)) {
                f = !1;
                const b = typeof r.error == "function" ? await r.error(p) : r.error,
                  g = typeof r.description == "function" ? await r.description(p) : r.description,
                  E = typeof b == "object" && !W.isValidElement(b) ? b : { message: b };
                this.create({ id: o, type: "error", description: g, ...E });
              }
            })
            .finally(() => {
              (f && (this.dismiss(o), (o = void 0)), r.finally == null || r.finally.call(r));
            }),
          y = () =>
            new Promise((p, b) => h.then(() => (d[0] === "reject" ? b(d[1]) : p(d[1]))).catch(b));
        return typeof o != "string" && typeof o != "number"
          ? { unwrap: y }
          : Object.assign(o, { unwrap: y });
      }),
      (this.custom = (i, r) => {
        const o = (r == null ? void 0 : r.id) || Cf++;
        return (this.create({ jsx: i(o), id: o, ...r }), o);
      }),
      (this.getActiveToasts = () => this.toasts.filter((i) => !this.dismissedToasts.has(i.id))),
      (this.subscribers = []),
      (this.toasts = []),
      (this.dismissedToasts = new Set()));
  }
}
const Xt = new S2(),
  _2 = (a, i) => {
    const r = (i == null ? void 0 : i.id) || Cf++;
    return (Xt.addToast({ title: a, ...i, id: r }), r);
  },
  x2 = (a) =>
    a &&
    typeof a == "object" &&
    "ok" in a &&
    typeof a.ok == "boolean" &&
    "status" in a &&
    typeof a.status == "number",
  w2 = _2,
  E2 = () => Xt.toasts,
  T2 = () => Xt.getActiveToasts(),
  DE = Object.assign(
    w2,
    {
      success: Xt.success,
      info: Xt.info,
      warning: Xt.warning,
      error: Xt.error,
      custom: Xt.custom,
      message: Xt.message,
      promise: Xt.promise,
      dismiss: Xt.dismiss,
      loading: Xt.loading,
    },
    { getHistory: E2, getToasts: T2 },
  );
u2(
  "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}",
);
function cl(a) {
  return a.label !== void 0;
}
const R2 = 3,
  A2 = "24px",
  M2 = "16px",
  Og = 4e3,
  C2 = 356,
  k2 = 14,
  O2 = 45,
  N2 = 200;
function Nn(...a) {
  return a.filter(Boolean).join(" ");
}
function z2(a) {
  const [i, r] = a.split("-"),
    o = [];
  return (i && o.push(i), r && o.push(r), o);
}
const D2 = (a) => {
  var i, r, o, l, f, d, h, y, p;
  const {
      invert: b,
      toast: g,
      unstyled: S,
      interacting: E,
      setHeights: R,
      visibleToasts: k,
      heights: L,
      index: A,
      toasts: G,
      expanded: Z,
      removeToast: P,
      defaultRichColors: K,
      closeButton: I,
      style: B,
      cancelButtonStyle: te,
      actionButtonStyle: ae,
      className: X = "",
      descriptionClassName: ee = "",
      duration: ue,
      position: ge,
      gap: Ue,
      expandByDefault: pe,
      classNames: C,
      icons: H,
      closeButtonAriaLabel: ne = "Close toast",
    } = a,
    [ve, se] = W.useState(null),
    [x, U] = W.useState(null),
    [Q, $] = W.useState(!1),
    [ie, de] = W.useState(!1),
    [be, xe] = W.useState(!1),
    [Le, Lt] = W.useState(!1),
    [Kt, mt] = W.useState(!1),
    [Ci, It] = W.useState(0),
    [la, ca] = W.useState(0),
    jn = W.useRef(g.duration || ue || Og),
    Ja = W.useRef(null),
    pt = W.useRef(null),
    En = A === 0,
    ua = A + 1 <= k,
    gt = g.type,
    ke = g.dismissible !== !1,
    Be = g.className || "",
    Ot = g.descriptionClassName || "",
    Tn = W.useMemo(() => L.findIndex((Se) => Se.toastId === g.id) || 0, [L, g.id]),
    Ys = W.useMemo(() => {
      var Se;
      return (Se = g.closeButton) != null ? Se : I;
    }, [g.closeButton, I]),
    $a = W.useMemo(() => g.duration || ue || Og, [g.duration, ue]),
    zr = W.useRef(0),
    Un = W.useRef(0),
    Gs = W.useRef(0),
    fa = W.useRef(null),
    [Wa, Nt] = ge.split("-"),
    bn = W.useMemo(() => L.reduce((Se, et, yt) => (yt >= Tn ? Se : Se + et.height), 0), [L, Tn]),
    Mt = b2(),
    ql = g.invert || b,
    Dr = gt === "loading";
  ((Un.current = W.useMemo(() => Tn * Ue + bn, [Tn, bn])),
    W.useEffect(() => {
      jn.current = $a;
    }, [$a]),
    W.useEffect(() => {
      $(!0);
    }, []),
    W.useEffect(() => {
      const Se = pt.current;
      if (Se) {
        const et = Se.getBoundingClientRect().height;
        return (
          ca(et),
          R((yt) => [{ toastId: g.id, height: et, position: g.position }, ...yt]),
          () => R((yt) => yt.filter((Ct) => Ct.toastId !== g.id))
        );
      }
    }, [R, g.id]),
    W.useLayoutEffect(() => {
      if (!Q) return;
      const Se = pt.current,
        et = Se.style.height;
      Se.style.height = "auto";
      const yt = Se.getBoundingClientRect().height;
      ((Se.style.height = et),
        ca(yt),
        R((Ct) =>
          Ct.find((nt) => nt.toastId === g.id)
            ? Ct.map((nt) => (nt.toastId === g.id ? { ...nt, height: yt } : nt))
            : [{ toastId: g.id, height: yt, position: g.position }, ...Ct],
        ));
    }, [Q, g.title, g.description, R, g.id, g.jsx, g.action, g.cancel]));
  const Rn = W.useCallback(() => {
    (de(!0),
      It(Un.current),
      R((Se) => Se.filter((et) => et.toastId !== g.id)),
      setTimeout(() => {
        P(g);
      }, N2));
  }, [g, P, R, Un]);
  (W.useEffect(() => {
    if ((g.promise && gt === "loading") || g.duration === 1 / 0 || g.type === "loading") return;
    let Se;
    return (
      Z || E || Mt
        ? (() => {
            if (Gs.current < zr.current) {
              const Ct = new Date().getTime() - zr.current;
              jn.current = jn.current - Ct;
            }
            Gs.current = new Date().getTime();
          })()
        : (() => {
            jn.current !== 1 / 0 &&
              ((zr.current = new Date().getTime()),
              (Se = setTimeout(() => {
                (g.onAutoClose == null || g.onAutoClose.call(g, g), Rn());
              }, jn.current)));
          })(),
      () => clearTimeout(Se)
    );
  }, [Z, E, g, gt, Mt, Rn]),
    W.useEffect(() => {
      g.delete && (Rn(), g.onDismiss == null || g.onDismiss.call(g, g));
    }, [Rn, g.delete]));
  function ki() {
    var Se;
    if (H != null && H.loading) {
      var et;
      return W.createElement(
        "div",
        {
          className: Nn(
            C == null ? void 0 : C.loader,
            g == null || (et = g.classNames) == null ? void 0 : et.loader,
            "sonner-loader",
          ),
          "data-visible": gt === "loading",
        },
        H.loading,
      );
    }
    return W.createElement(h2, {
      className: Nn(
        C == null ? void 0 : C.loader,
        g == null || (Se = g.classNames) == null ? void 0 : Se.loader,
      ),
      visible: gt === "loading",
    });
  }
  const Oi = g.icon || (H == null ? void 0 : H[gt]) || f2(gt);
  var ei, An;
  return W.createElement(
    "li",
    {
      tabIndex: 0,
      ref: pt,
      className: Nn(
        X,
        Be,
        C == null ? void 0 : C.toast,
        g == null || (i = g.classNames) == null ? void 0 : i.toast,
        C == null ? void 0 : C.default,
        C == null ? void 0 : C[gt],
        g == null || (r = g.classNames) == null ? void 0 : r[gt],
      ),
      "data-sonner-toast": "",
      "data-rich-colors": (ei = g.richColors) != null ? ei : K,
      "data-styled": !(g.jsx || g.unstyled || S),
      "data-mounted": Q,
      "data-promise": !!g.promise,
      "data-swiped": Kt,
      "data-removed": ie,
      "data-visible": ua,
      "data-y-position": Wa,
      "data-x-position": Nt,
      "data-index": A,
      "data-front": En,
      "data-swiping": be,
      "data-dismissible": ke,
      "data-type": gt,
      "data-invert": ql,
      "data-swipe-out": Le,
      "data-swipe-direction": x,
      "data-expanded": !!(Z || (pe && Q)),
      "data-testid": g.testId,
      style: {
        "--index": A,
        "--toasts-before": A,
        "--z-index": G.length - A,
        "--offset": `${ie ? Ci : Un.current}px`,
        "--initial-height": pe ? "auto" : `${la}px`,
        ...B,
        ...g.style,
      },
      onDragEnd: () => {
        (xe(!1), se(null), (fa.current = null));
      },
      onPointerDown: (Se) => {
        Se.button !== 2 &&
          (Dr ||
            !ke ||
            ((Ja.current = new Date()),
            It(Un.current),
            Se.target.setPointerCapture(Se.pointerId),
            Se.target.tagName !== "BUTTON" &&
              (xe(!0), (fa.current = { x: Se.clientX, y: Se.clientY }))));
      },
      onPointerUp: () => {
        var Se, et, yt;
        if (Le || !ke) return;
        fa.current = null;
        const Ct = Number(
            ((Se = pt.current) == null
              ? void 0
              : Se.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0,
          ),
          da = Number(
            ((et = pt.current) == null
              ? void 0
              : et.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0,
          ),
          nt = new Date().getTime() - ((yt = Ja.current) == null ? void 0 : yt.getTime()),
          jt = ve === "x" ? Ct : da,
          ti = Math.abs(jt) / nt;
        if (Math.abs(jt) >= O2 || ti > 0.11) {
          (It(Un.current),
            g.onDismiss == null || g.onDismiss.call(g, g),
            U(ve === "x" ? (Ct > 0 ? "right" : "left") : da > 0 ? "down" : "up"),
            Rn(),
            Lt(!0));
          return;
        } else {
          var Ut, Bt;
          ((Ut = pt.current) == null || Ut.style.setProperty("--swipe-amount-x", "0px"),
            (Bt = pt.current) == null || Bt.style.setProperty("--swipe-amount-y", "0px"));
        }
        (mt(!1), xe(!1), se(null));
      },
      onPointerMove: (Se) => {
        var et, yt, Ct;
        if (
          !fa.current ||
          !ke ||
          ((et = window.getSelection()) == null ? void 0 : et.toString().length) > 0
        )
          return;
        const nt = Se.clientY - fa.current.y,
          jt = Se.clientX - fa.current.x;
        var ti;
        const Ut = (ti = a.swipeDirections) != null ? ti : z2(ge);
        !ve &&
          (Math.abs(jt) > 1 || Math.abs(nt) > 1) &&
          se(Math.abs(jt) > Math.abs(nt) ? "x" : "y");
        let Bt = { x: 0, y: 0 };
        const Ni = (Sn) => 1 / (1.5 + Math.abs(Sn) / 20);
        if (ve === "y") {
          if (Ut.includes("top") || Ut.includes("bottom"))
            if ((Ut.includes("top") && nt < 0) || (Ut.includes("bottom") && nt > 0)) Bt.y = nt;
            else {
              const Sn = nt * Ni(nt);
              Bt.y = Math.abs(Sn) < Math.abs(nt) ? Sn : nt;
            }
        } else if (ve === "x" && (Ut.includes("left") || Ut.includes("right")))
          if ((Ut.includes("left") && jt < 0) || (Ut.includes("right") && jt > 0)) Bt.x = jt;
          else {
            const Sn = jt * Ni(jt);
            Bt.x = Math.abs(Sn) < Math.abs(jt) ? Sn : jt;
          }
        ((Math.abs(Bt.x) > 0 || Math.abs(Bt.y) > 0) && mt(!0),
          (yt = pt.current) == null || yt.style.setProperty("--swipe-amount-x", `${Bt.x}px`),
          (Ct = pt.current) == null || Ct.style.setProperty("--swipe-amount-y", `${Bt.y}px`));
      },
    },
    Ys && !g.jsx && gt !== "loading"
      ? W.createElement(
          "button",
          {
            "aria-label": ne,
            "data-disabled": Dr,
            "data-close-button": !0,
            onClick:
              Dr || !ke
                ? () => {}
                : () => {
                    (Rn(), g.onDismiss == null || g.onDismiss.call(g, g));
                  },
            className: Nn(
              C == null ? void 0 : C.closeButton,
              g == null || (o = g.classNames) == null ? void 0 : o.closeButton,
            ),
          },
          (An = H == null ? void 0 : H.close) != null ? An : v2,
        )
      : null,
    (gt || g.icon || g.promise) &&
      g.icon !== null &&
      ((H == null ? void 0 : H[gt]) !== null || g.icon)
      ? W.createElement(
          "div",
          {
            "data-icon": "",
            className: Nn(
              C == null ? void 0 : C.icon,
              g == null || (l = g.classNames) == null ? void 0 : l.icon,
            ),
          },
          g.promise || (g.type === "loading" && !g.icon) ? g.icon || ki() : null,
          g.type !== "loading" ? Oi : null,
        )
      : null,
    W.createElement(
      "div",
      {
        "data-content": "",
        className: Nn(
          C == null ? void 0 : C.content,
          g == null || (f = g.classNames) == null ? void 0 : f.content,
        ),
      },
      W.createElement(
        "div",
        {
          "data-title": "",
          className: Nn(
            C == null ? void 0 : C.title,
            g == null || (d = g.classNames) == null ? void 0 : d.title,
          ),
        },
        g.jsx ? g.jsx : typeof g.title == "function" ? g.title() : g.title,
      ),
      g.description
        ? W.createElement(
            "div",
            {
              "data-description": "",
              className: Nn(
                ee,
                Ot,
                C == null ? void 0 : C.description,
                g == null || (h = g.classNames) == null ? void 0 : h.description,
              ),
            },
            typeof g.description == "function" ? g.description() : g.description,
          )
        : null,
    ),
    W.isValidElement(g.cancel)
      ? g.cancel
      : g.cancel && cl(g.cancel)
        ? W.createElement(
            "button",
            {
              "data-button": !0,
              "data-cancel": !0,
              style: g.cancelButtonStyle || te,
              onClick: (Se) => {
                cl(g.cancel) &&
                  ke &&
                  (g.cancel.onClick == null || g.cancel.onClick.call(g.cancel, Se), Rn());
              },
              className: Nn(
                C == null ? void 0 : C.cancelButton,
                g == null || (y = g.classNames) == null ? void 0 : y.cancelButton,
              ),
            },
            g.cancel.label,
          )
        : null,
    W.isValidElement(g.action)
      ? g.action
      : g.action && cl(g.action)
        ? W.createElement(
            "button",
            {
              "data-button": !0,
              "data-action": !0,
              style: g.actionButtonStyle || ae,
              onClick: (Se) => {
                cl(g.action) &&
                  (g.action.onClick == null || g.action.onClick.call(g.action, Se),
                  !Se.defaultPrevented && Rn());
              },
              className: Nn(
                C == null ? void 0 : C.actionButton,
                g == null || (p = g.classNames) == null ? void 0 : p.actionButton,
              ),
            },
            g.action.label,
          )
        : null,
  );
};
function Ng() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const a = document.documentElement.getAttribute("dir");
  return a === "auto" || !a ? window.getComputedStyle(document.documentElement).direction : a;
}
function L2(a, i) {
  const r = {};
  return (
    [a, i].forEach((o, l) => {
      const f = l === 1,
        d = f ? "--mobile-offset" : "--offset",
        h = f ? M2 : A2;
      function y(p) {
        ["top", "right", "bottom", "left"].forEach((b) => {
          r[`${d}-${b}`] = typeof p == "number" ? `${p}px` : p;
        });
      }
      typeof o == "number" || typeof o == "string"
        ? y(o)
        : typeof o == "object"
          ? ["top", "right", "bottom", "left"].forEach((p) => {
              o[p] === void 0
                ? (r[`${d}-${p}`] = h)
                : (r[`${d}-${p}`] = typeof o[p] == "number" ? `${o[p]}px` : o[p]);
            })
          : y(h);
    }),
    r
  );
}
const j2 = W.forwardRef(function (i, r) {
    const {
        id: o,
        invert: l,
        position: f = "bottom-right",
        hotkey: d = ["altKey", "KeyT"],
        expand: h,
        closeButton: y,
        className: p,
        offset: b,
        mobileOffset: g,
        theme: S = "light",
        richColors: E,
        duration: R,
        style: k,
        visibleToasts: L = R2,
        toastOptions: A,
        dir: G = Ng(),
        gap: Z = k2,
        icons: P,
        containerAriaLabel: K = "Notifications",
      } = i,
      [I, B] = W.useState([]),
      te = W.useMemo(
        () => (o ? I.filter((Q) => Q.toasterId === o) : I.filter((Q) => !Q.toasterId)),
        [I, o],
      ),
      ae = W.useMemo(
        () => Array.from(new Set([f].concat(te.filter((Q) => Q.position).map((Q) => Q.position)))),
        [te, f],
      ),
      [X, ee] = W.useState([]),
      [ue, ge] = W.useState(!1),
      [Ue, pe] = W.useState(!1),
      [C, H] = W.useState(
        S !== "system"
          ? S
          : typeof window < "u" &&
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
      ),
      ne = W.useRef(null),
      ve = d.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
      se = W.useRef(null),
      x = W.useRef(!1),
      U = W.useCallback((Q) => {
        B(($) => {
          var ie;
          return (
            ((ie = $.find((de) => de.id === Q.id)) != null && ie.delete) || Xt.dismiss(Q.id),
            $.filter(({ id: de }) => de !== Q.id)
          );
        });
      }, []);
    return (
      W.useEffect(
        () =>
          Xt.subscribe((Q) => {
            if (Q.dismiss) {
              requestAnimationFrame(() => {
                B(($) => $.map((ie) => (ie.id === Q.id ? { ...ie, delete: !0 } : ie)));
              });
              return;
            }
            setTimeout(() => {
              Xx.flushSync(() => {
                B(($) => {
                  const ie = $.findIndex((de) => de.id === Q.id);
                  return ie !== -1
                    ? [...$.slice(0, ie), { ...$[ie], ...Q }, ...$.slice(ie + 1)]
                    : [Q, ...$];
                });
              });
            });
          }),
        [I],
      ),
      W.useEffect(() => {
        if (S !== "system") {
          H(S);
          return;
        }
        if (
          (S === "system" &&
            (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
              ? H("dark")
              : H("light")),
          typeof window > "u")
        )
          return;
        const Q = window.matchMedia("(prefers-color-scheme: dark)");
        try {
          Q.addEventListener("change", ({ matches: $ }) => {
            H($ ? "dark" : "light");
          });
        } catch {
          Q.addListener(({ matches: ie }) => {
            try {
              H(ie ? "dark" : "light");
            } catch (de) {
              console.error(de);
            }
          });
        }
      }, [S]),
      W.useEffect(() => {
        I.length <= 1 && ge(!1);
      }, [I]),
      W.useEffect(() => {
        const Q = ($) => {
          var ie;
          if (d.every((xe) => $[xe] || $.code === xe)) {
            var be;
            (ge(!0), (be = ne.current) == null || be.focus());
          }
          $.code === "Escape" &&
            (document.activeElement === ne.current ||
              ((ie = ne.current) != null && ie.contains(document.activeElement))) &&
            ge(!1);
        };
        return (
          document.addEventListener("keydown", Q), () => document.removeEventListener("keydown", Q)
        );
      }, [d]),
      W.useEffect(() => {
        if (ne.current)
          return () => {
            se.current &&
              (se.current.focus({ preventScroll: !0 }), (se.current = null), (x.current = !1));
          };
      }, [ne.current]),
      W.createElement(
        "section",
        {
          ref: r,
          "aria-label": `${K} ${ve}`,
          tabIndex: -1,
          "aria-live": "polite",
          "aria-relevant": "additions text",
          "aria-atomic": "false",
          suppressHydrationWarning: !0,
        },
        ae.map((Q, $) => {
          var ie;
          const [de, be] = Q.split("-");
          return te.length
            ? W.createElement(
                "ol",
                {
                  key: Q,
                  dir: G === "auto" ? Ng() : G,
                  tabIndex: -1,
                  ref: ne,
                  className: p,
                  "data-sonner-toaster": !0,
                  "data-sonner-theme": C,
                  "data-y-position": de,
                  "data-x-position": be,
                  style: {
                    "--front-toast-height": `${((ie = X[0]) == null ? void 0 : ie.height) || 0}px`,
                    "--width": `${C2}px`,
                    "--gap": `${Z}px`,
                    ...k,
                    ...L2(b, g),
                  },
                  onBlur: (xe) => {
                    x.current &&
                      !xe.currentTarget.contains(xe.relatedTarget) &&
                      ((x.current = !1),
                      se.current && (se.current.focus({ preventScroll: !0 }), (se.current = null)));
                  },
                  onFocus: (xe) => {
                    (xe.target instanceof HTMLElement &&
                      xe.target.dataset.dismissible === "false") ||
                      x.current ||
                      ((x.current = !0), (se.current = xe.relatedTarget));
                  },
                  onMouseEnter: () => ge(!0),
                  onMouseMove: () => ge(!0),
                  onMouseLeave: () => {
                    Ue || ge(!1);
                  },
                  onDragEnd: () => ge(!1),
                  onPointerDown: (xe) => {
                    (xe.target instanceof HTMLElement &&
                      xe.target.dataset.dismissible === "false") ||
                      pe(!0);
                  },
                  onPointerUp: () => pe(!1),
                },
                te
                  .filter((xe) => (!xe.position && $ === 0) || xe.position === Q)
                  .map((xe, Le) => {
                    var Lt, Kt;
                    return W.createElement(D2, {
                      key: xe.id,
                      icons: P,
                      index: Le,
                      toast: xe,
                      defaultRichColors: E,
                      duration: (Lt = A == null ? void 0 : A.duration) != null ? Lt : R,
                      className: A == null ? void 0 : A.className,
                      descriptionClassName: A == null ? void 0 : A.descriptionClassName,
                      invert: l,
                      visibleToasts: L,
                      closeButton: (Kt = A == null ? void 0 : A.closeButton) != null ? Kt : y,
                      interacting: Ue,
                      position: Q,
                      style: A == null ? void 0 : A.style,
                      unstyled: A == null ? void 0 : A.unstyled,
                      classNames: A == null ? void 0 : A.classNames,
                      cancelButtonStyle: A == null ? void 0 : A.cancelButtonStyle,
                      actionButtonStyle: A == null ? void 0 : A.actionButtonStyle,
                      closeButtonAriaLabel: A == null ? void 0 : A.closeButtonAriaLabel,
                      removeToast: U,
                      toasts: te.filter((mt) => mt.position == xe.position),
                      heights: X.filter((mt) => mt.position == xe.position),
                      setHeights: ee,
                      expandByDefault: h,
                      gap: Z,
                      expanded: ue,
                      swipeDirections: i.swipeDirections,
                    });
                  }),
              )
            : null;
        }),
      )
    );
  }),
  U2 = ({ ...a }) => {
    const { theme: i = "system" } = ly();
    return F.jsx(j2, {
      theme: i,
      className: "toaster group",
      icons: {
        success: F.jsx(Xw, { className: "size-4" }),
        info: F.jsx(Iw, { className: "size-4" }),
        warning: F.jsx(r2, { className: "size-4" }),
        error: F.jsx(n2, { className: "size-4" }),
        loading: F.jsx($w, { className: "size-4 animate-spin" }),
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      },
      toastOptions: { classNames: { toast: "cn-toast" } },
      ...a,
    });
  };
function B2({ children: a }) {
  return F.jsxs(o2, { children: [a, F.jsx(U2, {})] });
}
function H2() {
  return F.jsxs("div", {
    className: "flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center",
    children: [
      F.jsx("h1", { className: "font-bold text-4xl text-foreground", children: "404" }),
      F.jsx("p", {
        className: "text-muted-foreground",
        children: "The page you're looking for doesn't exist.",
      }),
      F.jsx(Us, {
        to: "/",
        className:
          "rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90",
        children: "Go Home",
      }),
    ],
  });
}
const Kf = aw({
  notFoundComponent: H2,
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
  component: q2,
});
function q2() {
  return F.jsxs(V2, { children: [F.jsx(c2, {}), F.jsx(W0, {})] });
}
function V2({ children: a }) {
  return F.jsxs("html", {
    lang: "en",
    className: "font-sans",
    suppressHydrationWarning: !0,
    children: [
      F.jsx("head", { children: F.jsx(bw, {}) }),
      F.jsxs("body", {
        className: "bg-background text-foreground",
        children: [F.jsx(B2, { children: a }), F.jsx(Sw, {})],
      }),
    ],
  });
}
const Z2 = "modulepreload",
  Y2 = function (a) {
    return "/" + a;
  },
  zg = {},
  cy = function (i, r, o) {
    let l = Promise.resolve();
    if (r && r.length > 0) {
      let d = function (p) {
        return Promise.all(
          p.map((b) =>
            Promise.resolve(b).then(
              (g) => ({ status: "fulfilled", value: g }),
              (g) => ({ status: "rejected", reason: g }),
            ),
          ),
        );
      };
      document.getElementsByTagName("link");
      const h = document.querySelector("meta[property=csp-nonce]"),
        y = (h == null ? void 0 : h.nonce) || (h == null ? void 0 : h.getAttribute("nonce"));
      l = d(
        r.map((p) => {
          if (((p = Y2(p)), p in zg)) return;
          zg[p] = !0;
          const b = p.endsWith(".css"),
            g = b ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${p}"]${g}`)) return;
          const S = document.createElement("link");
          if (
            ((S.rel = b ? "stylesheet" : Z2),
            b || (S.as = "script"),
            (S.crossOrigin = ""),
            (S.href = p),
            y && S.setAttribute("nonce", y),
            document.head.appendChild(S),
            b)
          )
            return new Promise((E, R) => {
              (S.addEventListener("load", E),
                S.addEventListener("error", () => R(new Error(`Unable to preload CSS for ${p}`))));
            });
        }),
      );
    }
    function f(d) {
      const h = new Event("vite:preloadError", { cancelable: !0 });
      if (((h.payload = d), window.dispatchEvent(h), !h.defaultPrevented)) throw d;
    }
    return l.then((d) => {
      for (const h of d || []) h.status === "rejected" && f(h.reason);
      return i().catch(f);
    });
  };
var Ze;
(function (a) {
  a.assertEqual = (l) => {};
  function i(l) {}
  a.assertIs = i;
  function r(l) {
    throw new Error();
  }
  ((a.assertNever = r),
    (a.arrayToEnum = (l) => {
      const f = {};
      for (const d of l) f[d] = d;
      return f;
    }),
    (a.getValidEnumValues = (l) => {
      const f = a.objectKeys(l).filter((h) => typeof l[l[h]] != "number"),
        d = {};
      for (const h of f) d[h] = l[h];
      return a.objectValues(d);
    }),
    (a.objectValues = (l) =>
      a.objectKeys(l).map(function (f) {
        return l[f];
      })),
    (a.objectKeys =
      typeof Object.keys == "function"
        ? (l) => Object.keys(l)
        : (l) => {
            const f = [];
            for (const d in l) Object.prototype.hasOwnProperty.call(l, d) && f.push(d);
            return f;
          }),
    (a.find = (l, f) => {
      for (const d of l) if (f(d)) return d;
    }),
    (a.isInteger =
      typeof Number.isInteger == "function"
        ? (l) => Number.isInteger(l)
        : (l) => typeof l == "number" && Number.isFinite(l) && Math.floor(l) === l));
  function o(l, f = " | ") {
    return l.map((d) => (typeof d == "string" ? `'${d}'` : d)).join(f);
  }
  ((a.joinValues = o),
    (a.jsonStringifyReplacer = (l, f) => (typeof f == "bigint" ? f.toString() : f)));
})(Ze || (Ze = {}));
var Dg;
(function (a) {
  a.mergeShapes = (i, r) => ({ ...i, ...r });
})(Dg || (Dg = {}));
const ce = Ze.arrayToEnum([
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
  ]),
  Ba = (a) => {
    switch (typeof a) {
      case "undefined":
        return ce.undefined;
      case "string":
        return ce.string;
      case "number":
        return Number.isNaN(a) ? ce.nan : ce.number;
      case "boolean":
        return ce.boolean;
      case "function":
        return ce.function;
      case "bigint":
        return ce.bigint;
      case "symbol":
        return ce.symbol;
      case "object":
        return Array.isArray(a)
          ? ce.array
          : a === null
            ? ce.null
            : a.then && typeof a.then == "function" && a.catch && typeof a.catch == "function"
              ? ce.promise
              : typeof Map < "u" && a instanceof Map
                ? ce.map
                : typeof Set < "u" && a instanceof Set
                  ? ce.set
                  : typeof Date < "u" && a instanceof Date
                    ? ce.date
                    : ce.object;
      default:
        return ce.unknown;
    }
  },
  J = Ze.arrayToEnum([
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
class sa extends Error {
  get errors() {
    return this.issues;
  }
  constructor(i) {
    (super(),
      (this.issues = []),
      (this.addIssue = (o) => {
        this.issues = [...this.issues, o];
      }),
      (this.addIssues = (o = []) => {
        this.issues = [...this.issues, ...o];
      }));
    const r = new.target.prototype;
    (Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : (this.__proto__ = r),
      (this.name = "ZodError"),
      (this.issues = i));
  }
  format(i) {
    const r =
        i ||
        function (f) {
          return f.message;
        },
      o = { _errors: [] },
      l = (f) => {
        for (const d of f.issues)
          if (d.code === "invalid_union") d.unionErrors.map(l);
          else if (d.code === "invalid_return_type") l(d.returnTypeError);
          else if (d.code === "invalid_arguments") l(d.argumentsError);
          else if (d.path.length === 0) o._errors.push(r(d));
          else {
            let h = o,
              y = 0;
            for (; y < d.path.length; ) {
              const p = d.path[y];
              (y === d.path.length - 1
                ? ((h[p] = h[p] || { _errors: [] }), h[p]._errors.push(r(d)))
                : (h[p] = h[p] || { _errors: [] }),
                (h = h[p]),
                y++);
            }
          }
      };
    return (l(this), o);
  }
  static assert(i) {
    if (!(i instanceof sa)) throw new Error(`Not a ZodError: ${i}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, Ze.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(i = (r) => r.message) {
    const r = {},
      o = [];
    for (const l of this.issues)
      if (l.path.length > 0) {
        const f = l.path[0];
        ((r[f] = r[f] || []), r[f].push(i(l)));
      } else o.push(i(l));
    return { formErrors: o, fieldErrors: r };
  }
  get formErrors() {
    return this.flatten();
  }
}
sa.create = (a) => new sa(a);
const kf = (a, i) => {
  let r;
  switch (a.code) {
    case J.invalid_type:
      a.received === ce.undefined
        ? (r = "Required")
        : (r = `Expected ${a.expected}, received ${a.received}`);
      break;
    case J.invalid_literal:
      r = `Invalid literal value, expected ${JSON.stringify(a.expected, Ze.jsonStringifyReplacer)}`;
      break;
    case J.unrecognized_keys:
      r = `Unrecognized key(s) in object: ${Ze.joinValues(a.keys, ", ")}`;
      break;
    case J.invalid_union:
      r = "Invalid input";
      break;
    case J.invalid_union_discriminator:
      r = `Invalid discriminator value. Expected ${Ze.joinValues(a.options)}`;
      break;
    case J.invalid_enum_value:
      r = `Invalid enum value. Expected ${Ze.joinValues(a.options)}, received '${a.received}'`;
      break;
    case J.invalid_arguments:
      r = "Invalid function arguments";
      break;
    case J.invalid_return_type:
      r = "Invalid function return type";
      break;
    case J.invalid_date:
      r = "Invalid date";
      break;
    case J.invalid_string:
      typeof a.validation == "object"
        ? "includes" in a.validation
          ? ((r = `Invalid input: must include "${a.validation.includes}"`),
            typeof a.validation.position == "number" &&
              (r = `${r} at one or more positions greater than or equal to ${a.validation.position}`))
          : "startsWith" in a.validation
            ? (r = `Invalid input: must start with "${a.validation.startsWith}"`)
            : "endsWith" in a.validation
              ? (r = `Invalid input: must end with "${a.validation.endsWith}"`)
              : Ze.assertNever(a.validation)
        : a.validation !== "regex"
          ? (r = `Invalid ${a.validation}`)
          : (r = "Invalid");
      break;
    case J.too_small:
      a.type === "array"
        ? (r = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "more than"} ${a.minimum} element(s)`)
        : a.type === "string"
          ? (r = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "over"} ${a.minimum} character(s)`)
          : a.type === "number"
            ? (r = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}`)
            : a.type === "bigint"
              ? (r = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}`)
              : a.type === "date"
                ? (r = `Date must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(a.minimum))}`)
                : (r = "Invalid input");
      break;
    case J.too_big:
      a.type === "array"
        ? (r = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "less than"} ${a.maximum} element(s)`)
        : a.type === "string"
          ? (r = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "under"} ${a.maximum} character(s)`)
          : a.type === "number"
            ? (r = `Number must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}`)
            : a.type === "bigint"
              ? (r = `BigInt must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}`)
              : a.type === "date"
                ? (r = `Date must be ${a.exact ? "exactly" : a.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(a.maximum))}`)
                : (r = "Invalid input");
      break;
    case J.custom:
      r = "Invalid input";
      break;
    case J.invalid_intersection_types:
      r = "Intersection results could not be merged";
      break;
    case J.not_multiple_of:
      r = `Number must be a multiple of ${a.multipleOf}`;
      break;
    case J.not_finite:
      r = "Number must be finite";
      break;
    default:
      ((r = i.defaultError), Ze.assertNever(a));
  }
  return { message: r };
};
let G2 = kf;
function Q2() {
  return G2;
}
const X2 = (a) => {
  const { data: i, path: r, errorMaps: o, issueData: l } = a,
    f = [...r, ...(l.path || [])],
    d = { ...l, path: f };
  if (l.message !== void 0) return { ...l, path: f, message: l.message };
  let h = "";
  const y = o
    .filter((p) => !!p)
    .slice()
    .reverse();
  for (const p of y) h = p(d, { data: i, defaultError: h }).message;
  return { ...l, path: f, message: h };
};
function re(a, i) {
  const r = Q2(),
    o = X2({
      issueData: i,
      data: a.data,
      path: a.path,
      errorMaps: [a.common.contextualErrorMap, a.schemaErrorMap, r, r === kf ? void 0 : kf].filter(
        (l) => !!l,
      ),
    });
  a.common.issues.push(o);
}
class rn {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(i, r) {
    const o = [];
    for (const l of r) {
      if (l.status === "aborted") return Ee;
      (l.status === "dirty" && i.dirty(), o.push(l.value));
    }
    return { status: i.value, value: o };
  }
  static async mergeObjectAsync(i, r) {
    const o = [];
    for (const l of r) {
      const f = await l.key,
        d = await l.value;
      o.push({ key: f, value: d });
    }
    return rn.mergeObjectSync(i, o);
  }
  static mergeObjectSync(i, r) {
    const o = {};
    for (const l of r) {
      const { key: f, value: d } = l;
      if (f.status === "aborted" || d.status === "aborted") return Ee;
      (f.status === "dirty" && i.dirty(),
        d.status === "dirty" && i.dirty(),
        f.value !== "__proto__" && (typeof d.value < "u" || l.alwaysSet) && (o[f.value] = d.value));
    }
    return { status: i.value, value: o };
  }
}
const Ee = Object.freeze({ status: "aborted" }),
  Os = (a) => ({ status: "dirty", value: a }),
  vn = (a) => ({ status: "valid", value: a }),
  Lg = (a) => a.status === "aborted",
  jg = (a) => a.status === "dirty",
  Cr = (a) => a.status === "valid",
  Rl = (a) => typeof Promise < "u" && a instanceof Promise;
var he;
(function (a) {
  ((a.errToObj = (i) => (typeof i == "string" ? { message: i } : i || {})),
    (a.toString = (i) => (typeof i == "string" ? i : i == null ? void 0 : i.message)));
})(he || (he = {}));
class Qa {
  constructor(i, r, o, l) {
    ((this._cachedPath = []),
      (this.parent = i),
      (this.data = r),
      (this._path = o),
      (this._key = l));
  }
  get path() {
    return (
      this._cachedPath.length ||
        (Array.isArray(this._key)
          ? this._cachedPath.push(...this._path, ...this._key)
          : this._cachedPath.push(...this._path, this._key)),
      this._cachedPath
    );
  }
}
const Ug = (a, i) => {
  if (Cr(i)) return { success: !0, data: i.value };
  if (!a.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error) return this._error;
      const r = new sa(a.common.issues);
      return ((this._error = r), this._error);
    },
  };
};
function Ce(a) {
  if (!a) return {};
  const { errorMap: i, invalid_type_error: r, required_error: o, description: l } = a;
  if (i && (r || o))
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  return i
    ? { errorMap: i, description: l }
    : {
        errorMap: (d, h) => {
          const { message: y } = a;
          return d.code === "invalid_enum_value"
            ? { message: y ?? h.defaultError }
            : typeof h.data > "u"
              ? { message: y ?? o ?? h.defaultError }
              : d.code !== "invalid_type"
                ? { message: h.defaultError }
                : { message: y ?? r ?? h.defaultError };
        },
        description: l,
      };
}
class He {
  get description() {
    return this._def.description;
  }
  _getType(i) {
    return Ba(i.data);
  }
  _getOrReturnCtx(i, r) {
    return (
      r || {
        common: i.parent.common,
        data: i.data,
        parsedType: Ba(i.data),
        schemaErrorMap: this._def.errorMap,
        path: i.path,
        parent: i.parent,
      }
    );
  }
  _processInputParams(i) {
    return {
      status: new rn(),
      ctx: {
        common: i.parent.common,
        data: i.data,
        parsedType: Ba(i.data),
        schemaErrorMap: this._def.errorMap,
        path: i.path,
        parent: i.parent,
      },
    };
  }
  _parseSync(i) {
    const r = this._parse(i);
    if (Rl(r)) throw new Error("Synchronous parse encountered promise.");
    return r;
  }
  _parseAsync(i) {
    const r = this._parse(i);
    return Promise.resolve(r);
  }
  parse(i, r) {
    const o = this.safeParse(i, r);
    if (o.success) return o.data;
    throw o.error;
  }
  safeParse(i, r) {
    const o = {
        common: {
          issues: [],
          async: (r == null ? void 0 : r.async) ?? !1,
          contextualErrorMap: r == null ? void 0 : r.errorMap,
        },
        path: (r == null ? void 0 : r.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: i,
        parsedType: Ba(i),
      },
      l = this._parseSync({ data: i, path: o.path, parent: o });
    return Ug(o, l);
  }
  "~validate"(i) {
    var o, l;
    const r = {
      common: { issues: [], async: !!this["~standard"].async },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: i,
      parsedType: Ba(i),
    };
    if (!this["~standard"].async)
      try {
        const f = this._parseSync({ data: i, path: [], parent: r });
        return Cr(f) ? { value: f.value } : { issues: r.common.issues };
      } catch (f) {
        ((l = (o = f == null ? void 0 : f.message) == null ? void 0 : o.toLowerCase()) != null &&
          l.includes("encountered") &&
          (this["~standard"].async = !0),
          (r.common = { issues: [], async: !0 }));
      }
    return this._parseAsync({ data: i, path: [], parent: r }).then((f) =>
      Cr(f) ? { value: f.value } : { issues: r.common.issues },
    );
  }
  async parseAsync(i, r) {
    const o = await this.safeParseAsync(i, r);
    if (o.success) return o.data;
    throw o.error;
  }
  async safeParseAsync(i, r) {
    const o = {
        common: { issues: [], contextualErrorMap: r == null ? void 0 : r.errorMap, async: !0 },
        path: (r == null ? void 0 : r.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: i,
        parsedType: Ba(i),
      },
      l = this._parse({ data: i, path: o.path, parent: o }),
      f = await (Rl(l) ? l : Promise.resolve(l));
    return Ug(o, f);
  }
  refine(i, r) {
    const o = (l) =>
      typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(l) : r;
    return this._refinement((l, f) => {
      const d = i(l),
        h = () => f.addIssue({ code: J.custom, ...o(l) });
      return typeof Promise < "u" && d instanceof Promise
        ? d.then((y) => (y ? !0 : (h(), !1)))
        : d
          ? !0
          : (h(), !1);
    });
  }
  refinement(i, r) {
    return this._refinement((o, l) =>
      i(o) ? !0 : (l.addIssue(typeof r == "function" ? r(o, l) : r), !1),
    );
  }
  _refinement(i) {
    return new Or({
      schema: this,
      typeName: Te.ZodEffects,
      effect: { type: "refinement", refinement: i },
    });
  }
  superRefine(i) {
    return this._refinement(i);
  }
  constructor(i) {
    ((this.spa = this.safeParseAsync),
      (this._def = i),
      (this.parse = this.parse.bind(this)),
      (this.safeParse = this.safeParse.bind(this)),
      (this.parseAsync = this.parseAsync.bind(this)),
      (this.safeParseAsync = this.safeParseAsync.bind(this)),
      (this.spa = this.spa.bind(this)),
      (this.refine = this.refine.bind(this)),
      (this.refinement = this.refinement.bind(this)),
      (this.superRefine = this.superRefine.bind(this)),
      (this.optional = this.optional.bind(this)),
      (this.nullable = this.nullable.bind(this)),
      (this.nullish = this.nullish.bind(this)),
      (this.array = this.array.bind(this)),
      (this.promise = this.promise.bind(this)),
      (this.or = this.or.bind(this)),
      (this.and = this.and.bind(this)),
      (this.transform = this.transform.bind(this)),
      (this.brand = this.brand.bind(this)),
      (this.default = this.default.bind(this)),
      (this.catch = this.catch.bind(this)),
      (this.describe = this.describe.bind(this)),
      (this.pipe = this.pipe.bind(this)),
      (this.readonly = this.readonly.bind(this)),
      (this.isNullable = this.isNullable.bind(this)),
      (this.isOptional = this.isOptional.bind(this)),
      (this["~standard"] = { version: 1, vendor: "zod", validate: (r) => this["~validate"](r) }));
  }
  optional() {
    return Ga.create(this, this._def);
  }
  nullable() {
    return Nr.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Dn.create(this);
  }
  promise() {
    return kl.create(this, this._def);
  }
  or(i) {
    return Ml.create([this, i], this._def);
  }
  and(i) {
    return Cl.create(this, i, this._def);
  }
  transform(i) {
    return new Or({
      ...Ce(this._def),
      schema: this,
      typeName: Te.ZodEffects,
      effect: { type: "transform", transform: i },
    });
  }
  default(i) {
    const r = typeof i == "function" ? i : () => i;
    return new Nf({ ...Ce(this._def), innerType: this, defaultValue: r, typeName: Te.ZodDefault });
  }
  brand() {
    return new pE({ typeName: Te.ZodBranded, type: this, ...Ce(this._def) });
  }
  catch(i) {
    const r = typeof i == "function" ? i : () => i;
    return new zf({ ...Ce(this._def), innerType: this, catchValue: r, typeName: Te.ZodCatch });
  }
  describe(i) {
    const r = this.constructor;
    return new r({ ...this._def, description: i });
  }
  pipe(i) {
    return If.create(this, i);
  }
  readonly() {
    return Df.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const F2 = /^c[^\s-]{8,}$/i,
  P2 = /^[0-9a-z]+$/,
  K2 = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
  I2 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  J2 = /^[a-z0-9_-]{21}$/i,
  $2 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  W2 =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  eE = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
  tE = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let _f;
const nE =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  aE =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  iE =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  rE =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  sE = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  oE = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  uy =
    "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",
  lE = new RegExp(`^${uy}$`);
function fy(a) {
  let i = "[0-5]\\d";
  a.precision ? (i = `${i}\\.\\d{${a.precision}}`) : a.precision == null && (i = `${i}(\\.\\d+)?`);
  const r = a.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${i})${r}`;
}
function cE(a) {
  return new RegExp(`^${fy(a)}$`);
}
function uE(a) {
  let i = `${uy}T${fy(a)}`;
  const r = [];
  return (
    r.push(a.local ? "Z?" : "Z"),
    a.offset && r.push("([+-]\\d{2}:?\\d{2})"),
    (i = `${i}(${r.join("|")})`),
    new RegExp(`^${i}$`)
  );
}
function fE(a, i) {
  return !!(((i === "v4" || !i) && nE.test(a)) || ((i === "v6" || !i) && iE.test(a)));
}
function dE(a, i) {
  if (!$2.test(a)) return !1;
  try {
    const [r] = a.split(".");
    if (!r) return !1;
    const o = r
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(r.length + ((4 - (r.length % 4)) % 4), "="),
      l = JSON.parse(atob(o));
    return !(
      typeof l != "object" ||
      l === null ||
      ("typ" in l && (l == null ? void 0 : l.typ) !== "JWT") ||
      !l.alg ||
      (i && l.alg !== i)
    );
  } catch {
    return !1;
  }
}
function hE(a, i) {
  return !!(((i === "v4" || !i) && aE.test(a)) || ((i === "v6" || !i) && rE.test(a)));
}
class Va extends He {
  _parse(i) {
    if ((this._def.coerce && (i.data = String(i.data)), this._getType(i) !== ce.string)) {
      const f = this._getOrReturnCtx(i);
      return (re(f, { code: J.invalid_type, expected: ce.string, received: f.parsedType }), Ee);
    }
    const o = new rn();
    let l;
    for (const f of this._def.checks)
      if (f.kind === "min")
        i.data.length < f.value &&
          ((l = this._getOrReturnCtx(i, l)),
          re(l, {
            code: J.too_small,
            minimum: f.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: f.message,
          }),
          o.dirty());
      else if (f.kind === "max")
        i.data.length > f.value &&
          ((l = this._getOrReturnCtx(i, l)),
          re(l, {
            code: J.too_big,
            maximum: f.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: f.message,
          }),
          o.dirty());
      else if (f.kind === "length") {
        const d = i.data.length > f.value,
          h = i.data.length < f.value;
        (d || h) &&
          ((l = this._getOrReturnCtx(i, l)),
          d
            ? re(l, {
                code: J.too_big,
                maximum: f.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: f.message,
              })
            : h &&
              re(l, {
                code: J.too_small,
                minimum: f.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: f.message,
              }),
          o.dirty());
      } else if (f.kind === "email")
        eE.test(i.data) ||
          ((l = this._getOrReturnCtx(i, l)),
          re(l, { validation: "email", code: J.invalid_string, message: f.message }),
          o.dirty());
      else if (f.kind === "emoji")
        (_f || (_f = new RegExp(tE, "u")),
          _f.test(i.data) ||
            ((l = this._getOrReturnCtx(i, l)),
            re(l, { validation: "emoji", code: J.invalid_string, message: f.message }),
            o.dirty()));
      else if (f.kind === "uuid")
        I2.test(i.data) ||
          ((l = this._getOrReturnCtx(i, l)),
          re(l, { validation: "uuid", code: J.invalid_string, message: f.message }),
          o.dirty());
      else if (f.kind === "nanoid")
        J2.test(i.data) ||
          ((l = this._getOrReturnCtx(i, l)),
          re(l, { validation: "nanoid", code: J.invalid_string, message: f.message }),
          o.dirty());
      else if (f.kind === "cuid")
        F2.test(i.data) ||
          ((l = this._getOrReturnCtx(i, l)),
          re(l, { validation: "cuid", code: J.invalid_string, message: f.message }),
          o.dirty());
      else if (f.kind === "cuid2")
        P2.test(i.data) ||
          ((l = this._getOrReturnCtx(i, l)),
          re(l, { validation: "cuid2", code: J.invalid_string, message: f.message }),
          o.dirty());
      else if (f.kind === "ulid")
        K2.test(i.data) ||
          ((l = this._getOrReturnCtx(i, l)),
          re(l, { validation: "ulid", code: J.invalid_string, message: f.message }),
          o.dirty());
      else if (f.kind === "url")
        try {
          new URL(i.data);
        } catch {
          ((l = this._getOrReturnCtx(i, l)),
            re(l, { validation: "url", code: J.invalid_string, message: f.message }),
            o.dirty());
        }
      else
        f.kind === "regex"
          ? ((f.regex.lastIndex = 0),
            f.regex.test(i.data) ||
              ((l = this._getOrReturnCtx(i, l)),
              re(l, { validation: "regex", code: J.invalid_string, message: f.message }),
              o.dirty()))
          : f.kind === "trim"
            ? (i.data = i.data.trim())
            : f.kind === "includes"
              ? i.data.includes(f.value, f.position) ||
                ((l = this._getOrReturnCtx(i, l)),
                re(l, {
                  code: J.invalid_string,
                  validation: { includes: f.value, position: f.position },
                  message: f.message,
                }),
                o.dirty())
              : f.kind === "toLowerCase"
                ? (i.data = i.data.toLowerCase())
                : f.kind === "toUpperCase"
                  ? (i.data = i.data.toUpperCase())
                  : f.kind === "startsWith"
                    ? i.data.startsWith(f.value) ||
                      ((l = this._getOrReturnCtx(i, l)),
                      re(l, {
                        code: J.invalid_string,
                        validation: { startsWith: f.value },
                        message: f.message,
                      }),
                      o.dirty())
                    : f.kind === "endsWith"
                      ? i.data.endsWith(f.value) ||
                        ((l = this._getOrReturnCtx(i, l)),
                        re(l, {
                          code: J.invalid_string,
                          validation: { endsWith: f.value },
                          message: f.message,
                        }),
                        o.dirty())
                      : f.kind === "datetime"
                        ? uE(f).test(i.data) ||
                          ((l = this._getOrReturnCtx(i, l)),
                          re(l, {
                            code: J.invalid_string,
                            validation: "datetime",
                            message: f.message,
                          }),
                          o.dirty())
                        : f.kind === "date"
                          ? lE.test(i.data) ||
                            ((l = this._getOrReturnCtx(i, l)),
                            re(l, {
                              code: J.invalid_string,
                              validation: "date",
                              message: f.message,
                            }),
                            o.dirty())
                          : f.kind === "time"
                            ? cE(f).test(i.data) ||
                              ((l = this._getOrReturnCtx(i, l)),
                              re(l, {
                                code: J.invalid_string,
                                validation: "time",
                                message: f.message,
                              }),
                              o.dirty())
                            : f.kind === "duration"
                              ? W2.test(i.data) ||
                                ((l = this._getOrReturnCtx(i, l)),
                                re(l, {
                                  validation: "duration",
                                  code: J.invalid_string,
                                  message: f.message,
                                }),
                                o.dirty())
                              : f.kind === "ip"
                                ? fE(i.data, f.version) ||
                                  ((l = this._getOrReturnCtx(i, l)),
                                  re(l, {
                                    validation: "ip",
                                    code: J.invalid_string,
                                    message: f.message,
                                  }),
                                  o.dirty())
                                : f.kind === "jwt"
                                  ? dE(i.data, f.alg) ||
                                    ((l = this._getOrReturnCtx(i, l)),
                                    re(l, {
                                      validation: "jwt",
                                      code: J.invalid_string,
                                      message: f.message,
                                    }),
                                    o.dirty())
                                  : f.kind === "cidr"
                                    ? hE(i.data, f.version) ||
                                      ((l = this._getOrReturnCtx(i, l)),
                                      re(l, {
                                        validation: "cidr",
                                        code: J.invalid_string,
                                        message: f.message,
                                      }),
                                      o.dirty())
                                    : f.kind === "base64"
                                      ? sE.test(i.data) ||
                                        ((l = this._getOrReturnCtx(i, l)),
                                        re(l, {
                                          validation: "base64",
                                          code: J.invalid_string,
                                          message: f.message,
                                        }),
                                        o.dirty())
                                      : f.kind === "base64url"
                                        ? oE.test(i.data) ||
                                          ((l = this._getOrReturnCtx(i, l)),
                                          re(l, {
                                            validation: "base64url",
                                            code: J.invalid_string,
                                            message: f.message,
                                          }),
                                          o.dirty())
                                        : Ze.assertNever(f);
    return { status: o.value, value: i.data };
  }
  _regex(i, r, o) {
    return this.refinement((l) => i.test(l), {
      validation: r,
      code: J.invalid_string,
      ...he.errToObj(o),
    });
  }
  _addCheck(i) {
    return new Va({ ...this._def, checks: [...this._def.checks, i] });
  }
  email(i) {
    return this._addCheck({ kind: "email", ...he.errToObj(i) });
  }
  url(i) {
    return this._addCheck({ kind: "url", ...he.errToObj(i) });
  }
  emoji(i) {
    return this._addCheck({ kind: "emoji", ...he.errToObj(i) });
  }
  uuid(i) {
    return this._addCheck({ kind: "uuid", ...he.errToObj(i) });
  }
  nanoid(i) {
    return this._addCheck({ kind: "nanoid", ...he.errToObj(i) });
  }
  cuid(i) {
    return this._addCheck({ kind: "cuid", ...he.errToObj(i) });
  }
  cuid2(i) {
    return this._addCheck({ kind: "cuid2", ...he.errToObj(i) });
  }
  ulid(i) {
    return this._addCheck({ kind: "ulid", ...he.errToObj(i) });
  }
  base64(i) {
    return this._addCheck({ kind: "base64", ...he.errToObj(i) });
  }
  base64url(i) {
    return this._addCheck({ kind: "base64url", ...he.errToObj(i) });
  }
  jwt(i) {
    return this._addCheck({ kind: "jwt", ...he.errToObj(i) });
  }
  ip(i) {
    return this._addCheck({ kind: "ip", ...he.errToObj(i) });
  }
  cidr(i) {
    return this._addCheck({ kind: "cidr", ...he.errToObj(i) });
  }
  datetime(i) {
    return typeof i == "string"
      ? this._addCheck({ kind: "datetime", precision: null, offset: !1, local: !1, message: i })
      : this._addCheck({
          kind: "datetime",
          precision:
            typeof (i == null ? void 0 : i.precision) > "u"
              ? null
              : i == null
                ? void 0
                : i.precision,
          offset: (i == null ? void 0 : i.offset) ?? !1,
          local: (i == null ? void 0 : i.local) ?? !1,
          ...he.errToObj(i == null ? void 0 : i.message),
        });
  }
  date(i) {
    return this._addCheck({ kind: "date", message: i });
  }
  time(i) {
    return typeof i == "string"
      ? this._addCheck({ kind: "time", precision: null, message: i })
      : this._addCheck({
          kind: "time",
          precision:
            typeof (i == null ? void 0 : i.precision) > "u"
              ? null
              : i == null
                ? void 0
                : i.precision,
          ...he.errToObj(i == null ? void 0 : i.message),
        });
  }
  duration(i) {
    return this._addCheck({ kind: "duration", ...he.errToObj(i) });
  }
  regex(i, r) {
    return this._addCheck({ kind: "regex", regex: i, ...he.errToObj(r) });
  }
  includes(i, r) {
    return this._addCheck({
      kind: "includes",
      value: i,
      position: r == null ? void 0 : r.position,
      ...he.errToObj(r == null ? void 0 : r.message),
    });
  }
  startsWith(i, r) {
    return this._addCheck({ kind: "startsWith", value: i, ...he.errToObj(r) });
  }
  endsWith(i, r) {
    return this._addCheck({ kind: "endsWith", value: i, ...he.errToObj(r) });
  }
  min(i, r) {
    return this._addCheck({ kind: "min", value: i, ...he.errToObj(r) });
  }
  max(i, r) {
    return this._addCheck({ kind: "max", value: i, ...he.errToObj(r) });
  }
  length(i, r) {
    return this._addCheck({ kind: "length", value: i, ...he.errToObj(r) });
  }
  nonempty(i) {
    return this.min(1, he.errToObj(i));
  }
  trim() {
    return new Va({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new Va({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new Va({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find((i) => i.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((i) => i.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((i) => i.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((i) => i.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((i) => i.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((i) => i.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((i) => i.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((i) => i.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((i) => i.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((i) => i.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((i) => i.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((i) => i.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((i) => i.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((i) => i.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((i) => i.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((i) => i.kind === "base64url");
  }
  get minLength() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "min" && (i === null || r.value > i) && (i = r.value);
    return i;
  }
  get maxLength() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "max" && (i === null || r.value < i) && (i = r.value);
    return i;
  }
}
Va.create = (a) =>
  new Va({
    checks: [],
    typeName: Te.ZodString,
    coerce: (a == null ? void 0 : a.coerce) ?? !1,
    ...Ce(a),
  });
function mE(a, i) {
  const r = (a.toString().split(".")[1] || "").length,
    o = (i.toString().split(".")[1] || "").length,
    l = r > o ? r : o,
    f = Number.parseInt(a.toFixed(l).replace(".", "")),
    d = Number.parseInt(i.toFixed(l).replace(".", ""));
  return (f % d) / 10 ** l;
}
class Bs extends He {
  constructor() {
    (super(...arguments),
      (this.min = this.gte),
      (this.max = this.lte),
      (this.step = this.multipleOf));
  }
  _parse(i) {
    if ((this._def.coerce && (i.data = Number(i.data)), this._getType(i) !== ce.number)) {
      const f = this._getOrReturnCtx(i);
      return (re(f, { code: J.invalid_type, expected: ce.number, received: f.parsedType }), Ee);
    }
    let o;
    const l = new rn();
    for (const f of this._def.checks)
      f.kind === "int"
        ? Ze.isInteger(i.data) ||
          ((o = this._getOrReturnCtx(i, o)),
          re(o, {
            code: J.invalid_type,
            expected: "integer",
            received: "float",
            message: f.message,
          }),
          l.dirty())
        : f.kind === "min"
          ? (f.inclusive ? i.data < f.value : i.data <= f.value) &&
            ((o = this._getOrReturnCtx(i, o)),
            re(o, {
              code: J.too_small,
              minimum: f.value,
              type: "number",
              inclusive: f.inclusive,
              exact: !1,
              message: f.message,
            }),
            l.dirty())
          : f.kind === "max"
            ? (f.inclusive ? i.data > f.value : i.data >= f.value) &&
              ((o = this._getOrReturnCtx(i, o)),
              re(o, {
                code: J.too_big,
                maximum: f.value,
                type: "number",
                inclusive: f.inclusive,
                exact: !1,
                message: f.message,
              }),
              l.dirty())
            : f.kind === "multipleOf"
              ? mE(i.data, f.value) !== 0 &&
                ((o = this._getOrReturnCtx(i, o)),
                re(o, { code: J.not_multiple_of, multipleOf: f.value, message: f.message }),
                l.dirty())
              : f.kind === "finite"
                ? Number.isFinite(i.data) ||
                  ((o = this._getOrReturnCtx(i, o)),
                  re(o, { code: J.not_finite, message: f.message }),
                  l.dirty())
                : Ze.assertNever(f);
    return { status: l.value, value: i.data };
  }
  gte(i, r) {
    return this.setLimit("min", i, !0, he.toString(r));
  }
  gt(i, r) {
    return this.setLimit("min", i, !1, he.toString(r));
  }
  lte(i, r) {
    return this.setLimit("max", i, !0, he.toString(r));
  }
  lt(i, r) {
    return this.setLimit("max", i, !1, he.toString(r));
  }
  setLimit(i, r, o, l) {
    return new Bs({
      ...this._def,
      checks: [...this._def.checks, { kind: i, value: r, inclusive: o, message: he.toString(l) }],
    });
  }
  _addCheck(i) {
    return new Bs({ ...this._def, checks: [...this._def.checks, i] });
  }
  int(i) {
    return this._addCheck({ kind: "int", message: he.toString(i) });
  }
  positive(i) {
    return this._addCheck({ kind: "min", value: 0, inclusive: !1, message: he.toString(i) });
  }
  negative(i) {
    return this._addCheck({ kind: "max", value: 0, inclusive: !1, message: he.toString(i) });
  }
  nonpositive(i) {
    return this._addCheck({ kind: "max", value: 0, inclusive: !0, message: he.toString(i) });
  }
  nonnegative(i) {
    return this._addCheck({ kind: "min", value: 0, inclusive: !0, message: he.toString(i) });
  }
  multipleOf(i, r) {
    return this._addCheck({ kind: "multipleOf", value: i, message: he.toString(r) });
  }
  finite(i) {
    return this._addCheck({ kind: "finite", message: he.toString(i) });
  }
  safe(i) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: he.toString(i),
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: he.toString(i),
    });
  }
  get minValue() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "min" && (i === null || r.value > i) && (i = r.value);
    return i;
  }
  get maxValue() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "max" && (i === null || r.value < i) && (i = r.value);
    return i;
  }
  get isInt() {
    return !!this._def.checks.find(
      (i) => i.kind === "int" || (i.kind === "multipleOf" && Ze.isInteger(i.value)),
    );
  }
  get isFinite() {
    let i = null,
      r = null;
    for (const o of this._def.checks) {
      if (o.kind === "finite" || o.kind === "int" || o.kind === "multipleOf") return !0;
      o.kind === "min"
        ? (r === null || o.value > r) && (r = o.value)
        : o.kind === "max" && (i === null || o.value < i) && (i = o.value);
    }
    return Number.isFinite(r) && Number.isFinite(i);
  }
}
Bs.create = (a) =>
  new Bs({
    checks: [],
    typeName: Te.ZodNumber,
    coerce: (a == null ? void 0 : a.coerce) || !1,
    ...Ce(a),
  });
class Hs extends He {
  constructor() {
    (super(...arguments), (this.min = this.gte), (this.max = this.lte));
  }
  _parse(i) {
    if (this._def.coerce)
      try {
        i.data = BigInt(i.data);
      } catch {
        return this._getInvalidInput(i);
      }
    if (this._getType(i) !== ce.bigint) return this._getInvalidInput(i);
    let o;
    const l = new rn();
    for (const f of this._def.checks)
      f.kind === "min"
        ? (f.inclusive ? i.data < f.value : i.data <= f.value) &&
          ((o = this._getOrReturnCtx(i, o)),
          re(o, {
            code: J.too_small,
            type: "bigint",
            minimum: f.value,
            inclusive: f.inclusive,
            message: f.message,
          }),
          l.dirty())
        : f.kind === "max"
          ? (f.inclusive ? i.data > f.value : i.data >= f.value) &&
            ((o = this._getOrReturnCtx(i, o)),
            re(o, {
              code: J.too_big,
              type: "bigint",
              maximum: f.value,
              inclusive: f.inclusive,
              message: f.message,
            }),
            l.dirty())
          : f.kind === "multipleOf"
            ? i.data % f.value !== BigInt(0) &&
              ((o = this._getOrReturnCtx(i, o)),
              re(o, { code: J.not_multiple_of, multipleOf: f.value, message: f.message }),
              l.dirty())
            : Ze.assertNever(f);
    return { status: l.value, value: i.data };
  }
  _getInvalidInput(i) {
    const r = this._getOrReturnCtx(i);
    return (re(r, { code: J.invalid_type, expected: ce.bigint, received: r.parsedType }), Ee);
  }
  gte(i, r) {
    return this.setLimit("min", i, !0, he.toString(r));
  }
  gt(i, r) {
    return this.setLimit("min", i, !1, he.toString(r));
  }
  lte(i, r) {
    return this.setLimit("max", i, !0, he.toString(r));
  }
  lt(i, r) {
    return this.setLimit("max", i, !1, he.toString(r));
  }
  setLimit(i, r, o, l) {
    return new Hs({
      ...this._def,
      checks: [...this._def.checks, { kind: i, value: r, inclusive: o, message: he.toString(l) }],
    });
  }
  _addCheck(i) {
    return new Hs({ ...this._def, checks: [...this._def.checks, i] });
  }
  positive(i) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: he.toString(i),
    });
  }
  negative(i) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: he.toString(i),
    });
  }
  nonpositive(i) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: he.toString(i),
    });
  }
  nonnegative(i) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: he.toString(i),
    });
  }
  multipleOf(i, r) {
    return this._addCheck({ kind: "multipleOf", value: i, message: he.toString(r) });
  }
  get minValue() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "min" && (i === null || r.value > i) && (i = r.value);
    return i;
  }
  get maxValue() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "max" && (i === null || r.value < i) && (i = r.value);
    return i;
  }
}
Hs.create = (a) =>
  new Hs({
    checks: [],
    typeName: Te.ZodBigInt,
    coerce: (a == null ? void 0 : a.coerce) ?? !1,
    ...Ce(a),
  });
class Bg extends He {
  _parse(i) {
    if ((this._def.coerce && (i.data = !!i.data), this._getType(i) !== ce.boolean)) {
      const o = this._getOrReturnCtx(i);
      return (re(o, { code: J.invalid_type, expected: ce.boolean, received: o.parsedType }), Ee);
    }
    return vn(i.data);
  }
}
Bg.create = (a) =>
  new Bg({ typeName: Te.ZodBoolean, coerce: (a == null ? void 0 : a.coerce) || !1, ...Ce(a) });
class Al extends He {
  _parse(i) {
    if ((this._def.coerce && (i.data = new Date(i.data)), this._getType(i) !== ce.date)) {
      const f = this._getOrReturnCtx(i);
      return (re(f, { code: J.invalid_type, expected: ce.date, received: f.parsedType }), Ee);
    }
    if (Number.isNaN(i.data.getTime())) {
      const f = this._getOrReturnCtx(i);
      return (re(f, { code: J.invalid_date }), Ee);
    }
    const o = new rn();
    let l;
    for (const f of this._def.checks)
      f.kind === "min"
        ? i.data.getTime() < f.value &&
          ((l = this._getOrReturnCtx(i, l)),
          re(l, {
            code: J.too_small,
            message: f.message,
            inclusive: !0,
            exact: !1,
            minimum: f.value,
            type: "date",
          }),
          o.dirty())
        : f.kind === "max"
          ? i.data.getTime() > f.value &&
            ((l = this._getOrReturnCtx(i, l)),
            re(l, {
              code: J.too_big,
              message: f.message,
              inclusive: !0,
              exact: !1,
              maximum: f.value,
              type: "date",
            }),
            o.dirty())
          : Ze.assertNever(f);
    return { status: o.value, value: new Date(i.data.getTime()) };
  }
  _addCheck(i) {
    return new Al({ ...this._def, checks: [...this._def.checks, i] });
  }
  min(i, r) {
    return this._addCheck({ kind: "min", value: i.getTime(), message: he.toString(r) });
  }
  max(i, r) {
    return this._addCheck({ kind: "max", value: i.getTime(), message: he.toString(r) });
  }
  get minDate() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "min" && (i === null || r.value > i) && (i = r.value);
    return i != null ? new Date(i) : null;
  }
  get maxDate() {
    let i = null;
    for (const r of this._def.checks)
      r.kind === "max" && (i === null || r.value < i) && (i = r.value);
    return i != null ? new Date(i) : null;
  }
}
Al.create = (a) =>
  new Al({
    checks: [],
    coerce: (a == null ? void 0 : a.coerce) || !1,
    typeName: Te.ZodDate,
    ...Ce(a),
  });
class Hg extends He {
  _parse(i) {
    if (this._getType(i) !== ce.symbol) {
      const o = this._getOrReturnCtx(i);
      return (re(o, { code: J.invalid_type, expected: ce.symbol, received: o.parsedType }), Ee);
    }
    return vn(i.data);
  }
}
Hg.create = (a) => new Hg({ typeName: Te.ZodSymbol, ...Ce(a) });
class qg extends He {
  _parse(i) {
    if (this._getType(i) !== ce.undefined) {
      const o = this._getOrReturnCtx(i);
      return (re(o, { code: J.invalid_type, expected: ce.undefined, received: o.parsedType }), Ee);
    }
    return vn(i.data);
  }
}
qg.create = (a) => new qg({ typeName: Te.ZodUndefined, ...Ce(a) });
class Vg extends He {
  _parse(i) {
    if (this._getType(i) !== ce.null) {
      const o = this._getOrReturnCtx(i);
      return (re(o, { code: J.invalid_type, expected: ce.null, received: o.parsedType }), Ee);
    }
    return vn(i.data);
  }
}
Vg.create = (a) => new Vg({ typeName: Te.ZodNull, ...Ce(a) });
class Zg extends He {
  constructor() {
    (super(...arguments), (this._any = !0));
  }
  _parse(i) {
    return vn(i.data);
  }
}
Zg.create = (a) => new Zg({ typeName: Te.ZodAny, ...Ce(a) });
class Yg extends He {
  constructor() {
    (super(...arguments), (this._unknown = !0));
  }
  _parse(i) {
    return vn(i.data);
  }
}
Yg.create = (a) => new Yg({ typeName: Te.ZodUnknown, ...Ce(a) });
class Xa extends He {
  _parse(i) {
    const r = this._getOrReturnCtx(i);
    return (re(r, { code: J.invalid_type, expected: ce.never, received: r.parsedType }), Ee);
  }
}
Xa.create = (a) => new Xa({ typeName: Te.ZodNever, ...Ce(a) });
class Gg extends He {
  _parse(i) {
    if (this._getType(i) !== ce.undefined) {
      const o = this._getOrReturnCtx(i);
      return (re(o, { code: J.invalid_type, expected: ce.void, received: o.parsedType }), Ee);
    }
    return vn(i.data);
  }
}
Gg.create = (a) => new Gg({ typeName: Te.ZodVoid, ...Ce(a) });
class Dn extends He {
  _parse(i) {
    const { ctx: r, status: o } = this._processInputParams(i),
      l = this._def;
    if (r.parsedType !== ce.array)
      return (re(r, { code: J.invalid_type, expected: ce.array, received: r.parsedType }), Ee);
    if (l.exactLength !== null) {
      const d = r.data.length > l.exactLength.value,
        h = r.data.length < l.exactLength.value;
      (d || h) &&
        (re(r, {
          code: d ? J.too_big : J.too_small,
          minimum: h ? l.exactLength.value : void 0,
          maximum: d ? l.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: l.exactLength.message,
        }),
        o.dirty());
    }
    if (
      (l.minLength !== null &&
        r.data.length < l.minLength.value &&
        (re(r, {
          code: J.too_small,
          minimum: l.minLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: l.minLength.message,
        }),
        o.dirty()),
      l.maxLength !== null &&
        r.data.length > l.maxLength.value &&
        (re(r, {
          code: J.too_big,
          maximum: l.maxLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: l.maxLength.message,
        }),
        o.dirty()),
      r.common.async)
    )
      return Promise.all(
        [...r.data].map((d, h) => l.type._parseAsync(new Qa(r, d, r.path, h))),
      ).then((d) => rn.mergeArray(o, d));
    const f = [...r.data].map((d, h) => l.type._parseSync(new Qa(r, d, r.path, h)));
    return rn.mergeArray(o, f);
  }
  get element() {
    return this._def.type;
  }
  min(i, r) {
    return new Dn({ ...this._def, minLength: { value: i, message: he.toString(r) } });
  }
  max(i, r) {
    return new Dn({ ...this._def, maxLength: { value: i, message: he.toString(r) } });
  }
  length(i, r) {
    return new Dn({ ...this._def, exactLength: { value: i, message: he.toString(r) } });
  }
  nonempty(i) {
    return this.min(1, i);
  }
}
Dn.create = (a, i) =>
  new Dn({
    type: a,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: Te.ZodArray,
    ...Ce(i),
  });
function Sr(a) {
  if (a instanceof dt) {
    const i = {};
    for (const r in a.shape) {
      const o = a.shape[r];
      i[r] = Ga.create(Sr(o));
    }
    return new dt({ ...a._def, shape: () => i });
  } else
    return a instanceof Dn
      ? new Dn({ ...a._def, type: Sr(a.element) })
      : a instanceof Ga
        ? Ga.create(Sr(a.unwrap()))
        : a instanceof Nr
          ? Nr.create(Sr(a.unwrap()))
          : a instanceof Ri
            ? Ri.create(a.items.map((i) => Sr(i)))
            : a;
}
class dt extends He {
  constructor() {
    (super(...arguments),
      (this._cached = null),
      (this.nonstrict = this.passthrough),
      (this.augment = this.extend));
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    const i = this._def.shape(),
      r = Ze.objectKeys(i);
    return ((this._cached = { shape: i, keys: r }), this._cached);
  }
  _parse(i) {
    if (this._getType(i) !== ce.object) {
      const p = this._getOrReturnCtx(i);
      return (re(p, { code: J.invalid_type, expected: ce.object, received: p.parsedType }), Ee);
    }
    const { status: o, ctx: l } = this._processInputParams(i),
      { shape: f, keys: d } = this._getCached(),
      h = [];
    if (!(this._def.catchall instanceof Xa && this._def.unknownKeys === "strip"))
      for (const p in l.data) d.includes(p) || h.push(p);
    const y = [];
    for (const p of d) {
      const b = f[p],
        g = l.data[p];
      y.push({
        key: { status: "valid", value: p },
        value: b._parse(new Qa(l, g, l.path, p)),
        alwaysSet: p in l.data,
      });
    }
    if (this._def.catchall instanceof Xa) {
      const p = this._def.unknownKeys;
      if (p === "passthrough")
        for (const b of h)
          y.push({
            key: { status: "valid", value: b },
            value: { status: "valid", value: l.data[b] },
          });
      else if (p === "strict")
        h.length > 0 && (re(l, { code: J.unrecognized_keys, keys: h }), o.dirty());
      else if (p !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const p = this._def.catchall;
      for (const b of h) {
        const g = l.data[b];
        y.push({
          key: { status: "valid", value: b },
          value: p._parse(new Qa(l, g, l.path, b)),
          alwaysSet: b in l.data,
        });
      }
    }
    return l.common.async
      ? Promise.resolve()
          .then(async () => {
            const p = [];
            for (const b of y) {
              const g = await b.key,
                S = await b.value;
              p.push({ key: g, value: S, alwaysSet: b.alwaysSet });
            }
            return p;
          })
          .then((p) => rn.mergeObjectSync(o, p))
      : rn.mergeObjectSync(o, y);
  }
  get shape() {
    return this._def.shape();
  }
  strict(i) {
    return (
      he.errToObj,
      new dt({
        ...this._def,
        unknownKeys: "strict",
        ...(i !== void 0
          ? {
              errorMap: (r, o) => {
                var f, d;
                const l =
                  ((d = (f = this._def).errorMap) == null ? void 0 : d.call(f, r, o).message) ??
                  o.defaultError;
                return r.code === "unrecognized_keys"
                  ? { message: he.errToObj(i).message ?? l }
                  : { message: l };
              },
            }
          : {}),
      })
    );
  }
  strip() {
    return new dt({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new dt({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(i) {
    return new dt({ ...this._def, shape: () => ({ ...this._def.shape(), ...i }) });
  }
  merge(i) {
    return new dt({
      unknownKeys: i._def.unknownKeys,
      catchall: i._def.catchall,
      shape: () => ({ ...this._def.shape(), ...i._def.shape() }),
      typeName: Te.ZodObject,
    });
  }
  setKey(i, r) {
    return this.augment({ [i]: r });
  }
  catchall(i) {
    return new dt({ ...this._def, catchall: i });
  }
  pick(i) {
    const r = {};
    for (const o of Ze.objectKeys(i)) i[o] && this.shape[o] && (r[o] = this.shape[o]);
    return new dt({ ...this._def, shape: () => r });
  }
  omit(i) {
    const r = {};
    for (const o of Ze.objectKeys(this.shape)) i[o] || (r[o] = this.shape[o]);
    return new dt({ ...this._def, shape: () => r });
  }
  deepPartial() {
    return Sr(this);
  }
  partial(i) {
    const r = {};
    for (const o of Ze.objectKeys(this.shape)) {
      const l = this.shape[o];
      i && !i[o] ? (r[o] = l) : (r[o] = l.optional());
    }
    return new dt({ ...this._def, shape: () => r });
  }
  required(i) {
    const r = {};
    for (const o of Ze.objectKeys(this.shape))
      if (i && !i[o]) r[o] = this.shape[o];
      else {
        let f = this.shape[o];
        for (; f instanceof Ga; ) f = f._def.innerType;
        r[o] = f;
      }
    return new dt({ ...this._def, shape: () => r });
  }
  keyof() {
    return dy(Ze.objectKeys(this.shape));
  }
}
dt.create = (a, i) =>
  new dt({
    shape: () => a,
    unknownKeys: "strip",
    catchall: Xa.create(),
    typeName: Te.ZodObject,
    ...Ce(i),
  });
dt.strictCreate = (a, i) =>
  new dt({
    shape: () => a,
    unknownKeys: "strict",
    catchall: Xa.create(),
    typeName: Te.ZodObject,
    ...Ce(i),
  });
dt.lazycreate = (a, i) =>
  new dt({
    shape: a,
    unknownKeys: "strip",
    catchall: Xa.create(),
    typeName: Te.ZodObject,
    ...Ce(i),
  });
class Ml extends He {
  _parse(i) {
    const { ctx: r } = this._processInputParams(i),
      o = this._def.options;
    function l(f) {
      for (const h of f) if (h.result.status === "valid") return h.result;
      for (const h of f)
        if (h.result.status === "dirty")
          return (r.common.issues.push(...h.ctx.common.issues), h.result);
      const d = f.map((h) => new sa(h.ctx.common.issues));
      return (re(r, { code: J.invalid_union, unionErrors: d }), Ee);
    }
    if (r.common.async)
      return Promise.all(
        o.map(async (f) => {
          const d = { ...r, common: { ...r.common, issues: [] }, parent: null };
          return { result: await f._parseAsync({ data: r.data, path: r.path, parent: d }), ctx: d };
        }),
      ).then(l);
    {
      let f;
      const d = [];
      for (const y of o) {
        const p = { ...r, common: { ...r.common, issues: [] }, parent: null },
          b = y._parseSync({ data: r.data, path: r.path, parent: p });
        if (b.status === "valid") return b;
        (b.status === "dirty" && !f && (f = { result: b, ctx: p }),
          p.common.issues.length && d.push(p.common.issues));
      }
      if (f) return (r.common.issues.push(...f.ctx.common.issues), f.result);
      const h = d.map((y) => new sa(y));
      return (re(r, { code: J.invalid_union, unionErrors: h }), Ee);
    }
  }
  get options() {
    return this._def.options;
  }
}
Ml.create = (a, i) => new Ml({ options: a, typeName: Te.ZodUnion, ...Ce(i) });
function Of(a, i) {
  const r = Ba(a),
    o = Ba(i);
  if (a === i) return { valid: !0, data: a };
  if (r === ce.object && o === ce.object) {
    const l = Ze.objectKeys(i),
      f = Ze.objectKeys(a).filter((h) => l.indexOf(h) !== -1),
      d = { ...a, ...i };
    for (const h of f) {
      const y = Of(a[h], i[h]);
      if (!y.valid) return { valid: !1 };
      d[h] = y.data;
    }
    return { valid: !0, data: d };
  } else if (r === ce.array && o === ce.array) {
    if (a.length !== i.length) return { valid: !1 };
    const l = [];
    for (let f = 0; f < a.length; f++) {
      const d = a[f],
        h = i[f],
        y = Of(d, h);
      if (!y.valid) return { valid: !1 };
      l.push(y.data);
    }
    return { valid: !0, data: l };
  } else return r === ce.date && o === ce.date && +a == +i ? { valid: !0, data: a } : { valid: !1 };
}
class Cl extends He {
  _parse(i) {
    const { status: r, ctx: o } = this._processInputParams(i),
      l = (f, d) => {
        if (Lg(f) || Lg(d)) return Ee;
        const h = Of(f.value, d.value);
        return h.valid
          ? ((jg(f) || jg(d)) && r.dirty(), { status: r.value, value: h.data })
          : (re(o, { code: J.invalid_intersection_types }), Ee);
      };
    return o.common.async
      ? Promise.all([
          this._def.left._parseAsync({ data: o.data, path: o.path, parent: o }),
          this._def.right._parseAsync({ data: o.data, path: o.path, parent: o }),
        ]).then(([f, d]) => l(f, d))
      : l(
          this._def.left._parseSync({ data: o.data, path: o.path, parent: o }),
          this._def.right._parseSync({ data: o.data, path: o.path, parent: o }),
        );
  }
}
Cl.create = (a, i, r) => new Cl({ left: a, right: i, typeName: Te.ZodIntersection, ...Ce(r) });
class Ri extends He {
  _parse(i) {
    const { status: r, ctx: o } = this._processInputParams(i);
    if (o.parsedType !== ce.array)
      return (re(o, { code: J.invalid_type, expected: ce.array, received: o.parsedType }), Ee);
    if (o.data.length < this._def.items.length)
      return (
        re(o, {
          code: J.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array",
        }),
        Ee
      );
    !this._def.rest &&
      o.data.length > this._def.items.length &&
      (re(o, {
        code: J.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array",
      }),
      r.dirty());
    const f = [...o.data]
      .map((d, h) => {
        const y = this._def.items[h] || this._def.rest;
        return y ? y._parse(new Qa(o, d, o.path, h)) : null;
      })
      .filter((d) => !!d);
    return o.common.async ? Promise.all(f).then((d) => rn.mergeArray(r, d)) : rn.mergeArray(r, f);
  }
  get items() {
    return this._def.items;
  }
  rest(i) {
    return new Ri({ ...this._def, rest: i });
  }
}
Ri.create = (a, i) => {
  if (!Array.isArray(a)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Ri({ items: a, typeName: Te.ZodTuple, rest: null, ...Ce(i) });
};
class Qg extends He {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(i) {
    const { status: r, ctx: o } = this._processInputParams(i);
    if (o.parsedType !== ce.map)
      return (re(o, { code: J.invalid_type, expected: ce.map, received: o.parsedType }), Ee);
    const l = this._def.keyType,
      f = this._def.valueType,
      d = [...o.data.entries()].map(([h, y], p) => ({
        key: l._parse(new Qa(o, h, o.path, [p, "key"])),
        value: f._parse(new Qa(o, y, o.path, [p, "value"])),
      }));
    if (o.common.async) {
      const h = new Map();
      return Promise.resolve().then(async () => {
        for (const y of d) {
          const p = await y.key,
            b = await y.value;
          if (p.status === "aborted" || b.status === "aborted") return Ee;
          ((p.status === "dirty" || b.status === "dirty") && r.dirty(), h.set(p.value, b.value));
        }
        return { status: r.value, value: h };
      });
    } else {
      const h = new Map();
      for (const y of d) {
        const p = y.key,
          b = y.value;
        if (p.status === "aborted" || b.status === "aborted") return Ee;
        ((p.status === "dirty" || b.status === "dirty") && r.dirty(), h.set(p.value, b.value));
      }
      return { status: r.value, value: h };
    }
  }
}
Qg.create = (a, i, r) => new Qg({ valueType: i, keyType: a, typeName: Te.ZodMap, ...Ce(r) });
class qs extends He {
  _parse(i) {
    const { status: r, ctx: o } = this._processInputParams(i);
    if (o.parsedType !== ce.set)
      return (re(o, { code: J.invalid_type, expected: ce.set, received: o.parsedType }), Ee);
    const l = this._def;
    (l.minSize !== null &&
      o.data.size < l.minSize.value &&
      (re(o, {
        code: J.too_small,
        minimum: l.minSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: l.minSize.message,
      }),
      r.dirty()),
      l.maxSize !== null &&
        o.data.size > l.maxSize.value &&
        (re(o, {
          code: J.too_big,
          maximum: l.maxSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: l.maxSize.message,
        }),
        r.dirty()));
    const f = this._def.valueType;
    function d(y) {
      const p = new Set();
      for (const b of y) {
        if (b.status === "aborted") return Ee;
        (b.status === "dirty" && r.dirty(), p.add(b.value));
      }
      return { status: r.value, value: p };
    }
    const h = [...o.data.values()].map((y, p) => f._parse(new Qa(o, y, o.path, p)));
    return o.common.async ? Promise.all(h).then((y) => d(y)) : d(h);
  }
  min(i, r) {
    return new qs({ ...this._def, minSize: { value: i, message: he.toString(r) } });
  }
  max(i, r) {
    return new qs({ ...this._def, maxSize: { value: i, message: he.toString(r) } });
  }
  size(i, r) {
    return this.min(i, r).max(i, r);
  }
  nonempty(i) {
    return this.min(1, i);
  }
}
qs.create = (a, i) =>
  new qs({ valueType: a, minSize: null, maxSize: null, typeName: Te.ZodSet, ...Ce(i) });
class Xg extends He {
  get schema() {
    return this._def.getter();
  }
  _parse(i) {
    const { ctx: r } = this._processInputParams(i);
    return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
  }
}
Xg.create = (a, i) => new Xg({ getter: a, typeName: Te.ZodLazy, ...Ce(i) });
class Fg extends He {
  _parse(i) {
    if (i.data !== this._def.value) {
      const r = this._getOrReturnCtx(i);
      return (re(r, { received: r.data, code: J.invalid_literal, expected: this._def.value }), Ee);
    }
    return { status: "valid", value: i.data };
  }
  get value() {
    return this._def.value;
  }
}
Fg.create = (a, i) => new Fg({ value: a, typeName: Te.ZodLiteral, ...Ce(i) });
function dy(a, i) {
  return new kr({ values: a, typeName: Te.ZodEnum, ...Ce(i) });
}
class kr extends He {
  _parse(i) {
    if (typeof i.data != "string") {
      const r = this._getOrReturnCtx(i),
        o = this._def.values;
      return (
        re(r, { expected: Ze.joinValues(o), received: r.parsedType, code: J.invalid_type }), Ee
      );
    }
    if ((this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(i.data))) {
      const r = this._getOrReturnCtx(i),
        o = this._def.values;
      return (re(r, { received: r.data, code: J.invalid_enum_value, options: o }), Ee);
    }
    return vn(i.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const i = {};
    for (const r of this._def.values) i[r] = r;
    return i;
  }
  get Values() {
    const i = {};
    for (const r of this._def.values) i[r] = r;
    return i;
  }
  get Enum() {
    const i = {};
    for (const r of this._def.values) i[r] = r;
    return i;
  }
  extract(i, r = this._def) {
    return kr.create(i, { ...this._def, ...r });
  }
  exclude(i, r = this._def) {
    return kr.create(
      this.options.filter((o) => !i.includes(o)),
      { ...this._def, ...r },
    );
  }
}
kr.create = dy;
class Pg extends He {
  _parse(i) {
    const r = Ze.getValidEnumValues(this._def.values),
      o = this._getOrReturnCtx(i);
    if (o.parsedType !== ce.string && o.parsedType !== ce.number) {
      const l = Ze.objectValues(r);
      return (
        re(o, { expected: Ze.joinValues(l), received: o.parsedType, code: J.invalid_type }), Ee
      );
    }
    if (
      (this._cache || (this._cache = new Set(Ze.getValidEnumValues(this._def.values))),
      !this._cache.has(i.data))
    ) {
      const l = Ze.objectValues(r);
      return (re(o, { received: o.data, code: J.invalid_enum_value, options: l }), Ee);
    }
    return vn(i.data);
  }
  get enum() {
    return this._def.values;
  }
}
Pg.create = (a, i) => new Pg({ values: a, typeName: Te.ZodNativeEnum, ...Ce(i) });
class kl extends He {
  unwrap() {
    return this._def.type;
  }
  _parse(i) {
    const { ctx: r } = this._processInputParams(i);
    if (r.parsedType !== ce.promise && r.common.async === !1)
      return (re(r, { code: J.invalid_type, expected: ce.promise, received: r.parsedType }), Ee);
    const o = r.parsedType === ce.promise ? r.data : Promise.resolve(r.data);
    return vn(
      o.then((l) =>
        this._def.type.parseAsync(l, { path: r.path, errorMap: r.common.contextualErrorMap }),
      ),
    );
  }
}
kl.create = (a, i) => new kl({ type: a, typeName: Te.ZodPromise, ...Ce(i) });
class Or extends He {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === Te.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }
  _parse(i) {
    const { status: r, ctx: o } = this._processInputParams(i),
      l = this._def.effect || null,
      f = {
        addIssue: (d) => {
          (re(o, d), d.fatal ? r.abort() : r.dirty());
        },
        get path() {
          return o.path;
        },
      };
    if (((f.addIssue = f.addIssue.bind(f)), l.type === "preprocess")) {
      const d = l.transform(o.data, f);
      if (o.common.async)
        return Promise.resolve(d).then(async (h) => {
          if (r.value === "aborted") return Ee;
          const y = await this._def.schema._parseAsync({ data: h, path: o.path, parent: o });
          return y.status === "aborted"
            ? Ee
            : y.status === "dirty" || r.value === "dirty"
              ? Os(y.value)
              : y;
        });
      {
        if (r.value === "aborted") return Ee;
        const h = this._def.schema._parseSync({ data: d, path: o.path, parent: o });
        return h.status === "aborted"
          ? Ee
          : h.status === "dirty" || r.value === "dirty"
            ? Os(h.value)
            : h;
      }
    }
    if (l.type === "refinement") {
      const d = (h) => {
        const y = l.refinement(h, f);
        if (o.common.async) return Promise.resolve(y);
        if (y instanceof Promise)
          throw new Error(
            "Async refinement encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        return h;
      };
      if (o.common.async === !1) {
        const h = this._def.schema._parseSync({ data: o.data, path: o.path, parent: o });
        return h.status === "aborted"
          ? Ee
          : (h.status === "dirty" && r.dirty(), d(h.value), { status: r.value, value: h.value });
      } else
        return this._def.schema
          ._parseAsync({ data: o.data, path: o.path, parent: o })
          .then((h) =>
            h.status === "aborted"
              ? Ee
              : (h.status === "dirty" && r.dirty(),
                d(h.value).then(() => ({ status: r.value, value: h.value }))),
          );
    }
    if (l.type === "transform")
      if (o.common.async === !1) {
        const d = this._def.schema._parseSync({ data: o.data, path: o.path, parent: o });
        if (!Cr(d)) return Ee;
        const h = l.transform(d.value, f);
        if (h instanceof Promise)
          throw new Error(
            "Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        return { status: r.value, value: h };
      } else
        return this._def.schema
          ._parseAsync({ data: o.data, path: o.path, parent: o })
          .then((d) =>
            Cr(d)
              ? Promise.resolve(l.transform(d.value, f)).then((h) => ({
                  status: r.value,
                  value: h,
                }))
              : Ee,
          );
    Ze.assertNever(l);
  }
}
Or.create = (a, i, r) => new Or({ schema: a, typeName: Te.ZodEffects, effect: i, ...Ce(r) });
Or.createWithPreprocess = (a, i, r) =>
  new Or({
    schema: i,
    effect: { type: "preprocess", transform: a },
    typeName: Te.ZodEffects,
    ...Ce(r),
  });
class Ga extends He {
  _parse(i) {
    return this._getType(i) === ce.undefined ? vn(void 0) : this._def.innerType._parse(i);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ga.create = (a, i) => new Ga({ innerType: a, typeName: Te.ZodOptional, ...Ce(i) });
class Nr extends He {
  _parse(i) {
    return this._getType(i) === ce.null ? vn(null) : this._def.innerType._parse(i);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Nr.create = (a, i) => new Nr({ innerType: a, typeName: Te.ZodNullable, ...Ce(i) });
class Nf extends He {
  _parse(i) {
    const { ctx: r } = this._processInputParams(i);
    let o = r.data;
    return (
      r.parsedType === ce.undefined && (o = this._def.defaultValue()),
      this._def.innerType._parse({ data: o, path: r.path, parent: r })
    );
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Nf.create = (a, i) =>
  new Nf({
    innerType: a,
    typeName: Te.ZodDefault,
    defaultValue: typeof i.default == "function" ? i.default : () => i.default,
    ...Ce(i),
  });
class zf extends He {
  _parse(i) {
    const { ctx: r } = this._processInputParams(i),
      o = { ...r, common: { ...r.common, issues: [] } },
      l = this._def.innerType._parse({ data: o.data, path: o.path, parent: { ...o } });
    return Rl(l)
      ? l.then((f) => ({
          status: "valid",
          value:
            f.status === "valid"
              ? f.value
              : this._def.catchValue({
                  get error() {
                    return new sa(o.common.issues);
                  },
                  input: o.data,
                }),
        }))
      : {
          status: "valid",
          value:
            l.status === "valid"
              ? l.value
              : this._def.catchValue({
                  get error() {
                    return new sa(o.common.issues);
                  },
                  input: o.data,
                }),
        };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
zf.create = (a, i) =>
  new zf({
    innerType: a,
    typeName: Te.ZodCatch,
    catchValue: typeof i.catch == "function" ? i.catch : () => i.catch,
    ...Ce(i),
  });
class Kg extends He {
  _parse(i) {
    if (this._getType(i) !== ce.nan) {
      const o = this._getOrReturnCtx(i);
      return (re(o, { code: J.invalid_type, expected: ce.nan, received: o.parsedType }), Ee);
    }
    return { status: "valid", value: i.data };
  }
}
Kg.create = (a) => new Kg({ typeName: Te.ZodNaN, ...Ce(a) });
class pE extends He {
  _parse(i) {
    const { ctx: r } = this._processInputParams(i),
      o = r.data;
    return this._def.type._parse({ data: o, path: r.path, parent: r });
  }
  unwrap() {
    return this._def.type;
  }
}
class If extends He {
  _parse(i) {
    const { status: r, ctx: o } = this._processInputParams(i);
    if (o.common.async)
      return (async () => {
        const f = await this._def.in._parseAsync({ data: o.data, path: o.path, parent: o });
        return f.status === "aborted"
          ? Ee
          : f.status === "dirty"
            ? (r.dirty(), Os(f.value))
            : this._def.out._parseAsync({ data: f.value, path: o.path, parent: o });
      })();
    {
      const l = this._def.in._parseSync({ data: o.data, path: o.path, parent: o });
      return l.status === "aborted"
        ? Ee
        : l.status === "dirty"
          ? (r.dirty(), { status: "dirty", value: l.value })
          : this._def.out._parseSync({ data: l.value, path: o.path, parent: o });
    }
  }
  static create(i, r) {
    return new If({ in: i, out: r, typeName: Te.ZodPipeline });
  }
}
class Df extends He {
  _parse(i) {
    const r = this._def.innerType._parse(i),
      o = (l) => (Cr(l) && (l.value = Object.freeze(l.value)), l);
    return Rl(r) ? r.then((l) => o(l)) : o(r);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Df.create = (a, i) => new Df({ innerType: a, typeName: Te.ZodReadonly, ...Ce(i) });
var Te;
(function (a) {
  ((a.ZodString = "ZodString"),
    (a.ZodNumber = "ZodNumber"),
    (a.ZodNaN = "ZodNaN"),
    (a.ZodBigInt = "ZodBigInt"),
    (a.ZodBoolean = "ZodBoolean"),
    (a.ZodDate = "ZodDate"),
    (a.ZodSymbol = "ZodSymbol"),
    (a.ZodUndefined = "ZodUndefined"),
    (a.ZodNull = "ZodNull"),
    (a.ZodAny = "ZodAny"),
    (a.ZodUnknown = "ZodUnknown"),
    (a.ZodNever = "ZodNever"),
    (a.ZodVoid = "ZodVoid"),
    (a.ZodArray = "ZodArray"),
    (a.ZodObject = "ZodObject"),
    (a.ZodUnion = "ZodUnion"),
    (a.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"),
    (a.ZodIntersection = "ZodIntersection"),
    (a.ZodTuple = "ZodTuple"),
    (a.ZodRecord = "ZodRecord"),
    (a.ZodMap = "ZodMap"),
    (a.ZodSet = "ZodSet"),
    (a.ZodFunction = "ZodFunction"),
    (a.ZodLazy = "ZodLazy"),
    (a.ZodLiteral = "ZodLiteral"),
    (a.ZodEnum = "ZodEnum"),
    (a.ZodEffects = "ZodEffects"),
    (a.ZodNativeEnum = "ZodNativeEnum"),
    (a.ZodOptional = "ZodOptional"),
    (a.ZodNullable = "ZodNullable"),
    (a.ZodDefault = "ZodDefault"),
    (a.ZodCatch = "ZodCatch"),
    (a.ZodPromise = "ZodPromise"),
    (a.ZodBranded = "ZodBranded"),
    (a.ZodPipeline = "ZodPipeline"),
    (a.ZodReadonly = "ZodReadonly"));
})(Te || (Te = {}));
const Me = Va.create;
Xa.create;
Dn.create;
const gE = dt.create;
Ml.create;
Cl.create;
Ri.create;
const Ig = kr.create;
kl.create;
Ga.create;
Nr.create;
const yE = (a) => {
    const i = "input" in a ? a.input : "input",
      r = "output" in a ? a.output : "output",
      o = "schema" in a ? a.schema._input : a._input,
      l = "schema" in a ? a.schema._output : a._output;
    return {
      types: { input: i === "output" ? l : o, output: r === "input" ? o : l },
      parse: (f) => ("schema" in a ? a.schema.parse(f) : a.parse(f)),
    };
  },
  LE = {
    api: [
      {
        id: "trpc",
        name: "tRPC",
        description: "End-to-end typesafe APIs",
        icon: "https://cdn.simpleicons.org/trpc/398CCB",
        color: "from-blue-500 to-blue-700",
        default: !0,
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
        default: !0,
      },
      {
        id: "react-router",
        name: "React Router",
        description: "Declarative routing for React",
        icon: "/icon/react-router.svg",
        color: "from-cyan-400 to-cyan-600",
        default: !1,
      },
      {
        id: "tanstack-start",
        name: "TanStack Start",
        description: "Full-stack React and Solid framework powered by TanStack Router",
        icon: "/icon/tanstack.png",
        color: "from-purple-400 to-purple-600",
        default: !1,
      },
      {
        id: "next",
        name: "Next.js",
        description: "React framework with hybrid rendering",
        icon: "https://cdn.simpleicons.org/nextdotjs",
        color: "from-gray-700 to-black",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "nuxt",
        name: "Nuxt",
        description: "Vue full-stack framework (SSR, SSG, hybrid)",
        icon: "/icon/nuxt-js.svg",
        color: "from-green-400 to-green-700",
        default: !1,
      },
      {
        id: "svelte",
        name: "Svelte",
        description: "Cybernetically enhanced web apps",
        icon: "/icon/svelte.png",
        color: "from-orange-500 to-orange-700",
        default: !1,
      },
      {
        id: "solid",
        name: "Solid",
        description: "Simple and performant reactivity for building UIs",
        icon: "/icon/solid.svg",
        color: "from-blue-600 to-blue-800",
        default: !1,
      },
      {
        id: "astro",
        name: "Astro",
        description: "Content-focused with Island Architecture",
        icon: "/icon/astro.svg",
        color: "from-purple-500 to-orange-500",
        default: !1,
      },
      {
        id: "qwik",
        name: "Qwik",
        description: "Resumable framework with instant load times",
        icon: "https://cdn.simpleicons.org/qwik/AC7EF4",
        color: "from-purple-400 to-purple-600",
        default: !1,
      },
      {
        id: "angular",
        name: "Angular",
        description: "Enterprise-grade TypeScript framework by Google",
        icon: "https://cdn.simpleicons.org/angular/DD0031",
        color: "from-red-500 to-red-700",
        default: !1,
      },
      {
        id: "redwood",
        name: "RedwoodJS",
        description: "Opinionated fullstack (React + GraphQL + Prisma)",
        icon: "https://cdn.simpleicons.org/redwoodjs/BF4722",
        color: "from-red-600 to-orange-500",
        default: !1,
      },
      {
        id: "fresh",
        name: "Fresh",
        description: "Deno-native framework with islands architecture",
        icon: "https://cdn.simpleicons.org/deno/000000",
        color: "from-teal-400 to-cyan-600",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "none",
        name: "No Web Frontend",
        description: "No web-based frontend",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
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
        default: !0,
      },
      {
        id: "native-uniwind",
        name: "Expo + Uniwind",
        description: "Fastest Tailwind bindings for React Native with HeroUI Native",
        icon: "https://cdn.simpleicons.org/expo",
        color: "from-purple-400 to-purple-600",
        className: "invert-0 dark:invert",
        default: !1,
      },
      {
        id: "native-unistyles",
        name: "Expo + Unistyles",
        description: "Expo with Unistyles (type-safe styling)",
        icon: "https://cdn.simpleicons.org/expo",
        color: "from-pink-400 to-pink-600",
        className: "invert-0 dark:invert",
        default: !1,
      },
      {
        id: "none",
        name: "No Native Frontend",
        description: "No native mobile frontend",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    astroIntegration: [
      {
        id: "react",
        name: "React",
        description: "Full React component support (required for tRPC)",
        icon: "https://cdn.simpleicons.org/react/61DAFB",
        color: "from-cyan-400 to-cyan-600",
        default: !0,
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
        default: !0,
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
        default: !0,
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
        default: !0,
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
        default: !0,
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
        default: !0,
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
        default: !0,
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
        default: !0,
      },
    ],
    auth: [
      {
        id: "better-auth",
        name: "Better-Auth",
        description: "The most comprehensive authentication framework for TypeScript",
        icon: "/icon/better-auth.svg",
        color: "from-green-400 to-green-600",
        default: !0,
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
        default: !1,
      },
      {
        id: "stripe",
        name: "Stripe",
        description: "Industry standard payment processing",
        icon: "https://cdn.simpleicons.org/stripe/635BFF",
        color: "from-indigo-500 to-purple-600",
        default: !1,
      },
      {
        id: "lemon-squeezy",
        name: "Lemon Squeezy",
        description: "MoR for digital products with tax handling",
        icon: "https://cdn.simpleicons.org/lemonsqueezy/FFC233",
        color: "from-yellow-400 to-yellow-600",
        default: !1,
      },
      {
        id: "paddle",
        name: "Paddle",
        description: "MoR platform with global tax compliance",
        icon: "https://cdn.simpleicons.org/paddle/3D3D3D",
        color: "from-slate-500 to-slate-700",
        default: !1,
      },
      {
        id: "dodo",
        name: "Dodo Payments",
        description: "MoR for AI and SaaS in 150+ countries",
        icon: "/icon/dodo.svg",
        color: "from-indigo-500 to-blue-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Payments",
        description: "Skip payments integration",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    email: [
      {
        id: "resend",
        name: "Resend",
        description: "Modern email API for developers",
        icon: "https://cdn.simpleicons.org/resend",
        color: "from-gray-600 to-gray-800",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "react-email",
        name: "React Email",
        description: "Build emails using React components (no sending)",
        icon: "https://cdn.simpleicons.org/react/61DAFB",
        color: "from-cyan-400 to-cyan-600",
        default: !1,
      },
      {
        id: "nodemailer",
        name: "Nodemailer",
        description: "Classic Node.js email sending via SMTP",
        icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
        color: "from-green-400 to-green-600",
        default: !1,
      },
      {
        id: "postmark",
        name: "Postmark",
        description: "Fast transactional email service",
        icon: "https://cdn.simpleicons.org/postmark/FFDE00",
        color: "from-yellow-400 to-yellow-600",
        default: !1,
      },
      {
        id: "sendgrid",
        name: "SendGrid",
        description: "Scalable email delivery platform",
        icon: "/icon/sendgrid.svg",
        color: "from-blue-400 to-blue-600",
        default: !1,
      },
      {
        id: "aws-ses",
        name: "AWS SES",
        description: "Amazon Simple Email Service",
        icon: "/icon/aws-ses.svg",
        color: "from-orange-400 to-orange-600",
        default: !1,
      },
      {
        id: "mailgun",
        name: "Mailgun",
        description: "Powerful email API for developers",
        icon: "https://cdn.simpleicons.org/mailgun/F06B66",
        color: "from-red-400 to-red-600",
        default: !1,
      },
      {
        id: "plunk",
        name: "Plunk",
        description: "Open-source email platform with event tracking",
        icon: "/icon/plunk.svg",
        color: "from-violet-400 to-violet-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Email",
        description: "Skip email integration",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    fileUpload: [
      {
        id: "uploadthing",
        name: "UploadThing",
        description: "TypeScript-first file uploads with built-in validation",
        icon: "https://uploadthing.com/favicon.ico",
        color: "from-red-400 to-red-600",
        default: !1,
      },
      {
        id: "filepond",
        name: "FilePond",
        description: "Flexible file upload with image preview and drag & drop",
        icon: "/icon/filepond.svg",
        color: "from-yellow-400 to-amber-600",
        default: !1,
      },
      {
        id: "uppy",
        name: "Uppy",
        description: "Modular file uploader with resumable uploads and plugins",
        icon: "https://uppy.io/img/logo.svg",
        color: "from-cyan-400 to-teal-600",
        default: !1,
      },
      {
        id: "none",
        name: "No File Upload",
        description: "Skip file upload integration",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    logging: [
      {
        id: "pino",
        name: "Pino",
        description: "Fast JSON logger with minimal overhead",
        icon: "",
        color: "from-green-400 to-green-600",
        default: !1,
      },
      {
        id: "winston",
        name: "Winston",
        description: "Flexible logging library with multiple transports",
        icon: "",
        color: "from-blue-400 to-blue-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Logging",
        description: "Skip logging framework setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    observability: [
      {
        id: "opentelemetry",
        name: "OpenTelemetry",
        description: "Observability framework for traces, metrics, and logs",
        icon: "",
        color: "from-blue-400 to-cyan-500",
        default: !1,
      },
      {
        id: "none",
        name: "No Observability",
        description: "Skip observability/tracing setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    backendLibraries: [
      {
        id: "effect",
        name: "Effect (Core)",
        description: "Powerful effect system for TypeScript",
        icon: "/icon/effect.svg",
        color: "from-indigo-400 to-indigo-600",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "effect-full",
        name: "Effect Full",
        description: "Full ecosystem with Schema, Platform, and SQL",
        icon: "/icon/effect.svg",
        color: "from-purple-400 to-purple-600",
        className: "invert-0 dark:invert",
        default: !1,
      },
      {
        id: "none",
        name: "None",
        description: "No additional backend libraries",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    stateManagement: [
      {
        id: "zustand",
        name: "Zustand",
        description: "Lightweight state management with simple API",
        icon: "",
        color: "from-amber-400 to-amber-600",
        default: !1,
      },
      {
        id: "jotai",
        name: "Jotai",
        description: "Primitive and flexible atomic state",
        icon: "",
        color: "from-gray-600 to-gray-800",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "nanostores",
        name: "Nanostores",
        description: "Tiny state manager (1KB) for all frameworks",
        icon: "",
        color: "from-blue-400 to-blue-600",
        default: !1,
      },
      {
        id: "redux-toolkit",
        name: "Redux Toolkit",
        description: "Enterprise-standard state with excellent TS support",
        icon: "https://cdn.simpleicons.org/redux/764ABC",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
      {
        id: "mobx",
        name: "MobX",
        description: "Observable-based reactive state management",
        icon: "https://cdn.simpleicons.org/mobx/FF9955",
        color: "from-orange-400 to-orange-600",
        default: !1,
      },
      {
        id: "xstate",
        name: "XState",
        description: "State machines and statecharts for complex logic",
        icon: "https://cdn.simpleicons.org/xstate/2C3E50",
        color: "from-slate-600 to-slate-800",
        default: !1,
      },
      {
        id: "valtio",
        name: "Valtio",
        description: "Proxy-based state (same authors as Zustand)",
        icon: "",
        color: "from-teal-400 to-teal-600",
        default: !1,
      },
      {
        id: "tanstack-store",
        name: "TanStack Store",
        description: "Framework-agnostic store powering TanStack ecosystem",
        icon: "",
        color: "from-red-400 to-orange-500",
        default: !1,
      },
      {
        id: "legend-state",
        name: "Legend State",
        description: "High-performance observable state for React",
        icon: "",
        color: "from-violet-400 to-violet-600",
        default: !1,
      },
      {
        id: "none",
        name: "No State Management",
        description: "Skip state management setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    forms: [
      {
        id: "react-hook-form",
        name: "React Hook Form",
        description: "Performant, flexible form validation library",
        icon: "https://cdn.simpleicons.org/reacthookform/EC5990",
        color: "from-pink-400 to-pink-600",
        default: !0,
      },
      {
        id: "tanstack-form",
        name: "TanStack Form",
        description: "Fully-typed, framework-agnostic form library",
        icon: "/icon/tanstack.png",
        color: "from-cyan-400 to-cyan-600",
        default: !1,
      },
      {
        id: "formik",
        name: "Formik",
        description: "Popular form state management with Yup validation",
        icon: "",
        color: "from-blue-500 to-blue-700",
        default: !1,
      },
      {
        id: "final-form",
        name: "Final Form",
        description: "Framework-agnostic form state management",
        icon: "",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
      {
        id: "conform",
        name: "Conform",
        description: "Progressive enhancement forms with Zod validation",
        icon: "",
        color: "from-emerald-500 to-emerald-700",
        default: !1,
      },
      {
        id: "modular-forms",
        name: "Modular Forms",
        description: "Type-safe forms for Solid and Qwik (3KB bundle)",
        icon: "",
        color: "from-sky-400 to-sky-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Form Library",
        description: "Build custom form handling",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    validation: [
      {
        id: "zod",
        name: "Zod",
        description: "TypeScript-first schema validation (default)",
        icon: "https://cdn.simpleicons.org/zod/3E67B1",
        color: "from-blue-500 to-blue-700",
        default: !0,
      },
      {
        id: "valibot",
        name: "Valibot",
        description: "Smaller bundle alternative to Zod (~1KB)",
        icon: "",
        color: "from-yellow-400 to-yellow-600",
        default: !1,
      },
      {
        id: "arktype",
        name: "ArkType",
        description: "TypeScript-first validation, 2-4x faster than Zod",
        icon: "",
        color: "from-purple-400 to-purple-600",
        default: !1,
      },
      {
        id: "typebox",
        name: "TypeBox",
        description: "JSON Schema type builder for TypeScript",
        icon: "",
        color: "from-sky-400 to-sky-600",
        default: !1,
      },
      {
        id: "typia",
        name: "Typia",
        description: "Super-fast validation via compile-time transform",
        icon: "",
        color: "from-green-400 to-green-600",
        default: !1,
      },
      {
        id: "runtypes",
        name: "Runtypes",
        description: "Runtime type validation with composable validators",
        icon: "",
        color: "from-orange-400 to-orange-600",
        default: !1,
      },
      {
        id: "effect-schema",
        name: "@effect/schema",
        description: "Effect ecosystem schema validation with powerful transformations",
        icon: "",
        color: "from-black to-gray-700",
        default: !1,
      },
      {
        id: "none",
        name: "No Validation",
        description: "Use Zod internally only (no additional library)",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    cssFramework: [
      {
        id: "tailwind",
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
        color: "from-cyan-400 to-cyan-600",
        default: !0,
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
        default: !0,
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
        default: !0,
      },
    ],
    codeQuality: [
      {
        id: "biome",
        name: "Biome",
        description: "Format, lint, and more",
        icon: "https://cdn.simpleicons.org/biome/60A5FA",
        color: "from-blue-500 to-blue-700",
        default: !1,
      },
      {
        id: "oxlint",
        name: "Oxlint",
        description: "Oxlint + Oxfmt (linting & formatting)",
        icon: "https://cdn.simpleicons.org/oxc/FF915C",
        color: "from-orange-500 to-orange-700",
        default: !1,
      },
      {
        id: "ultracite",
        name: "Ultracite",
        description: "Biome preset with AI integration",
        icon: "/icon/ultracite.svg",
        color: "from-indigo-500 to-indigo-700",
        className: "invert-0 dark:invert",
        default: !1,
      },
      {
        id: "lefthook",
        name: "Lefthook",
        description: "Fast and powerful Git hooks manager",
        icon: "",
        color: "from-red-500 to-red-700",
        default: !1,
      },
      {
        id: "husky",
        name: "Husky",
        description: "Modern native Git hooks made easy",
        icon: "",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
      {
        id: "ruler",
        name: "Ruler",
        description: "Centralize your AI rules",
        icon: "",
        color: "from-violet-500 to-violet-700",
        default: !1,
      },
    ],
    documentation: [
      {
        id: "starlight",
        name: "Starlight",
        description: "Build stellar docs with Astro",
        icon: "/icon/starlight.svg",
        color: "from-amber-500 to-amber-700",
        default: !1,
      },
      {
        id: "fumadocs",
        name: "Fumadocs",
        description: "Build excellent documentation site",
        icon: "/icon/fumadocs.svg",
        color: "from-indigo-500 to-indigo-700",
        default: !1,
      },
    ],
    appPlatforms: [
      {
        id: "turborepo",
        name: "Turborepo",
        description: "High-performance build system",
        icon: "https://cdn.simpleicons.org/turborepo/EF4444",
        color: "from-gray-400 to-gray-700",
        default: !0,
      },
      {
        id: "pwa",
        name: "PWA",
        description: "Make your app installable and work offline",
        icon: "",
        color: "from-blue-500 to-blue-700",
        default: !1,
      },
      {
        id: "tauri",
        name: "Tauri",
        description: "Build native desktop apps",
        icon: "https://cdn.simpleicons.org/tauri/FFC131",
        color: "from-amber-500 to-amber-700",
        default: !1,
      },
      {
        id: "wxt",
        name: "WXT",
        description: "Build browser extensions",
        icon: "",
        color: "from-emerald-500 to-emerald-700",
        default: !1,
      },
      {
        id: "opentui",
        name: "OpenTUI",
        description: "Build terminal user interfaces",
        icon: "",
        color: "from-cyan-500 to-cyan-700",
        default: !1,
      },
      {
        id: "msw",
        name: "MSW",
        description: "Mock Service Worker for API mocking in tests and development",
        icon: "",
        color: "from-orange-500 to-orange-700",
        default: !1,
      },
      {
        id: "storybook",
        name: "Storybook",
        description: "Component development and testing workshop",
        icon: "https://cdn.simpleicons.org/storybook/FF4785",
        color: "from-pink-500 to-pink-700",
        default: !1,
      },
    ],
    examples: [
      {
        id: "todo",
        name: "Todo Example",
        description: "Simple todo application",
        icon: "",
        color: "from-indigo-500 to-indigo-700",
        default: !1,
      },
      {
        id: "ai",
        name: "AI Example",
        description: "AI integration example using AI SDK",
        icon: "",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
    ],
    ai: [
      {
        id: "vercel-ai",
        name: "Vercel AI SDK",
        description: "Unified AI SDK for streaming responses and multiple providers",
        icon: "https://cdn.simpleicons.org/vercel/000000",
        color: "from-gray-700 to-black",
        default: !0,
        className: "invert-0 dark:invert",
      },
      {
        id: "mastra",
        name: "Mastra",
        description: "TypeScript-native AI agent framework with workflows",
        icon: "/icon/mastra.svg",
        color: "from-purple-500 to-indigo-600",
        default: !1,
      },
      {
        id: "voltagent",
        name: "VoltAgent",
        description: "AI Agent framework with memory, workflows, and observability",
        icon: "/icon/voltagent.svg",
        color: "from-yellow-500 to-orange-600",
        default: !1,
      },
      {
        id: "langgraph",
        name: "LangGraph.js",
        description: "Graph-based agent orchestration with stateful workflows",
        icon: "/icon/langgraph.svg",
        color: "from-green-500 to-teal-600",
        default: !1,
      },
      {
        id: "openai-agents",
        name: "OpenAI Agents SDK",
        description: "Official multi-agent framework with handoffs and guardrails",
        icon: "https://cdn.simpleicons.org/openai/412991",
        color: "from-emerald-500 to-teal-600",
        default: !1,
      },
      {
        id: "google-adk",
        name: "Google ADK",
        description: "Code-first agent development kit for building AI agents",
        icon: "https://cdn.simpleicons.org/google/4285F4",
        color: "from-blue-500 to-blue-700",
        default: !1,
      },
      {
        id: "modelfusion",
        name: "ModelFusion",
        description: "Type-safe AI library for multi-provider text generation",
        icon: "https://cdn.simpleicons.org/vercel/000000",
        color: "from-gray-600 to-gray-800",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "none",
        name: "No AI SDK",
        description: "Skip AI SDK integration",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    realtime: [
      {
        id: "socket-io",
        name: "Socket.IO",
        description: "Real-time bidirectional communication with fallbacks",
        icon: "https://cdn.simpleicons.org/socketdotio/010101",
        color: "from-gray-600 to-gray-800",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "partykit",
        name: "PartyKit",
        description: "Edge-native multiplayer infrastructure on Cloudflare",
        icon: "https://cdn.simpleicons.org/cloudflare/F38020",
        color: "from-orange-500 to-orange-700",
        default: !1,
      },
      {
        id: "ably",
        name: "Ably",
        description: "Real-time messaging platform with pub/sub and presence",
        icon: "https://cdn.simpleicons.org/ably/FF5416",
        color: "from-orange-500 to-red-600",
        default: !1,
      },
      {
        id: "pusher",
        name: "Pusher",
        description: "Real-time communication APIs with channels and events",
        icon: "https://cdn.simpleicons.org/pusher/300D4F",
        color: "from-purple-600 to-indigo-800",
        default: !1,
      },
      {
        id: "liveblocks",
        name: "Liveblocks",
        description: "Collaboration infrastructure for multiplayer experiences",
        icon: "https://cdn.simpleicons.org/liveblocks/6366F1",
        color: "from-indigo-500 to-purple-600",
        default: !1,
      },
      {
        id: "yjs",
        name: "Y.js",
        description: "CRDT library for real-time collaboration with conflict-free sync",
        icon: "",
        color: "from-emerald-500 to-teal-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Real-time",
        description: "Skip real-time/WebSocket integration",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    jobQueue: [
      {
        id: "bullmq",
        name: "BullMQ",
        description: "Redis-backed job queue for background tasks and scheduling",
        icon: "https://cdn.simpleicons.org/redis/DC382D",
        color: "from-red-500 to-red-700",
        default: !1,
      },
      {
        id: "trigger-dev",
        name: "Trigger.dev",
        description: "Background jobs as code with serverless execution",
        icon: "/icon/trigger-dev.svg",
        color: "from-green-500 to-emerald-600",
        default: !1,
      },
      {
        id: "inngest",
        name: "Inngest",
        description: "Event-driven functions with built-in queuing and scheduling",
        icon: "/icon/inngest.svg",
        color: "from-indigo-500 to-purple-600",
        default: !1,
      },
      {
        id: "temporal",
        name: "Temporal",
        description: "Durable workflow orchestration for reliable distributed systems",
        icon: "/icon/temporal.svg",
        color: "from-blue-500 to-cyan-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Job Queue",
        description: "Skip job queue/background worker setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    effect: [
      {
        id: "effect",
        name: "Effect (Core)",
        description: "Powerful effect system for TypeScript",
        icon: "/icon/effect.svg",
        color: "from-indigo-400 to-indigo-600",
        default: !1,
        className: "invert-0 dark:invert",
      },
      {
        id: "effect-full",
        name: "Effect Full",
        description: "Full ecosystem with Schema, Platform, and SQL",
        icon: "/icon/effect.svg",
        color: "from-purple-400 to-purple-600",
        className: "invert-0 dark:invert",
        default: !1,
      },
      {
        id: "none",
        name: "None",
        description: "No Effect library",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    caching: [
      {
        id: "upstash-redis",
        name: "Upstash Redis",
        description: "Serverless Redis with REST API for edge and serverless",
        icon: "https://cdn.simpleicons.org/upstash/00E9A3",
        color: "from-emerald-500 to-teal-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Caching",
        description: "Skip caching layer setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    animation: [
      {
        id: "framer-motion",
        name: "Framer Motion",
        description: "Production-ready declarative animations for React",
        icon: "https://cdn.simpleicons.org/framer/0055FF",
        color: "from-blue-500 to-purple-600",
        default: !1,
      },
      {
        id: "gsap",
        name: "GSAP",
        description: "Professional-grade animation engine for the web",
        icon: "https://cdn.simpleicons.org/greensock/88CE02",
        color: "from-green-500 to-green-700",
        default: !1,
      },
      {
        id: "react-spring",
        name: "React Spring",
        description: "Physics-based animations for fluid interactions",
        icon: "",
        color: "from-pink-400 to-pink-600",
        default: !1,
      },
      {
        id: "auto-animate",
        name: "Auto Animate",
        description: "Zero-config, drop-in animation utility",
        icon: "https://cdn.simpleicons.org/formkit/00DC82",
        color: "from-green-400 to-emerald-600",
        default: !1,
      },
      {
        id: "lottie",
        name: "Lottie",
        description: "Render After Effects animations natively",
        icon: "https://cdn.simpleicons.org/airbnb/FF5A5F",
        color: "from-pink-500 to-red-500",
        default: !1,
      },
      {
        id: "none",
        name: "No Animation",
        description: "Skip animation library setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
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
        default: !0,
      },
      {
        id: "jest",
        name: "Jest",
        description: "Classic testing framework with Testing Library support for React/Vue/Svelte",
        icon: "https://cdn.simpleicons.org/jest/C21325",
        color: "from-red-400 to-red-600",
        default: !1,
      },
      {
        id: "playwright",
        name: "Playwright",
        description: "End-to-end testing framework by Microsoft",
        icon: "https://cdn.simpleicons.org/playwright/2EAD33",
        color: "from-emerald-400 to-emerald-600",
        default: !1,
      },
      {
        id: "vitest-playwright",
        name: "Vitest + Playwright",
        description: "Both unit and E2E testing with Testing Library support for complete coverage",
        icon: "https://cdn.simpleicons.org/vitest/6E9F18",
        color: "from-green-500 to-emerald-600",
        default: !1,
      },
      {
        id: "cypress",
        name: "Cypress",
        description: "E2E testing with time travel debugging",
        icon: "https://cdn.simpleicons.org/cypress/69D3A7",
        color: "from-teal-400 to-teal-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Testing",
        description: "Skip testing framework setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    cms: [
      {
        id: "payload",
        name: "Payload",
        description: "TypeScript-first headless CMS with Next.js integration",
        icon: "/icon/payload.svg",
        color: "from-slate-700 to-slate-900",
        default: !1,
      },
      {
        id: "sanity",
        name: "Sanity",
        description: "Real-time collaborative CMS with schema-as-code",
        icon: "https://cdn.simpleicons.org/sanity/F03E2F",
        color: "from-red-500 to-red-700",
        default: !1,
      },
      {
        id: "strapi",
        name: "Strapi",
        description: "Open-source headless CMS with admin panel",
        icon: "https://cdn.simpleicons.org/strapi/4945FF",
        color: "from-indigo-500 to-purple-600",
        default: !1,
      },
      {
        id: "none",
        name: "No CMS",
        description: "Skip headless CMS setup",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    git: [
      {
        id: "true",
        name: "Git",
        description: "Initialize Git repository",
        icon: "https://cdn.simpleicons.org/git/F05032",
        color: "from-gray-500 to-gray-700",
        default: !0,
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
        default: !0,
      },
      {
        id: "false",
        name: "Skip Install",
        description: "Skip dependency installation",
        icon: "",
        color: "from-yellow-400 to-yellow-600",
      },
    ],
    rustWebFramework: [
      {
        id: "axum",
        name: "Axum",
        description: "Ergonomic and modular web framework by Tokio team",
        icon: "/icon/axum.svg",
        color: "from-blue-500 to-indigo-600",
        default: !0,
      },
      {
        id: "actix-web",
        name: "Actix-web",
        description: "Powerful, pragmatic, and extremely fast web framework",
        icon: "/icon/actix.svg",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
      {
        id: "none",
        name: "No Web Framework",
        description: "Skip Rust web framework",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    rustFrontend: [
      {
        id: "leptos",
        name: "Leptos",
        description: "Fine-grained reactive framework with SSR support",
        icon: "/icon/leptos.svg",
        color: "from-red-500 to-orange-600",
        default: !0,
      },
      {
        id: "dioxus",
        name: "Dioxus",
        description: "React-like GUI library for web, desktop, and mobile",
        icon: "/icon/dioxus.svg",
        color: "from-cyan-500 to-blue-600",
        default: !1,
      },
      {
        id: "none",
        name: "No WASM Frontend",
        description: "Skip Rust WASM frontend",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    rustOrm: [
      {
        id: "sea-orm",
        name: "SeaORM",
        description: "Async & dynamic ORM with ActiveRecord pattern",
        icon: "/icon/seaorm.svg",
        color: "from-cyan-500 to-blue-600",
        default: !0,
      },
      {
        id: "sqlx",
        name: "SQLx",
        description: "Async SQL toolkit with compile-time checked queries",
        icon: "",
        color: "from-orange-500 to-orange-700",
        default: !1,
      },
      {
        id: "none",
        name: "No ORM",
        description: "Skip Rust ORM/database layer",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
    rustApi: [
      {
        id: "async-graphql",
        name: "async-graphql",
        description: "High-performance GraphQL server with full query language support",
        icon: "https://cdn.simpleicons.org/graphql/E10098",
        color: "from-pink-500 to-rose-600",
        default: !1,
      },
      {
        id: "tonic",
        name: "Tonic",
        description: "Production-ready gRPC implementation for Rust",
        icon: "/icon/tonic.svg",
        color: "from-orange-500 to-red-600",
        default: !1,
      },
      {
        id: "none",
        name: "No API Layer",
        description: "Skip Rust API layer",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    rustCli: [
      {
        id: "clap",
        name: "Clap",
        description: "CLI argument parser with derive macros (most popular)",
        icon: "",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
      {
        id: "ratatui",
        name: "Ratatui",
        description: "Terminal user interface library for building rich TUIs",
        icon: "",
        color: "from-emerald-500 to-teal-700",
        default: !1,
      },
      {
        id: "none",
        name: "No CLI Tools",
        description: "Skip Rust CLI tools",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !0,
      },
    ],
    rustLibraries: [
      {
        id: "serde",
        name: "Serde",
        description: "De facto standard serialization framework (always included)",
        icon: "",
        color: "from-orange-500 to-orange-700",
        default: !0,
      },
      {
        id: "validator",
        name: "Validator",
        description: "Derive-based validation for structs and fields",
        icon: "",
        color: "from-green-500 to-green-700",
        default: !1,
      },
      {
        id: "jsonwebtoken",
        name: "jsonwebtoken",
        description: "JWT encoding and decoding for authentication",
        icon: "",
        color: "from-blue-500 to-indigo-700",
        default: !1,
      },
      {
        id: "argon2",
        name: "Argon2",
        description: "Secure password hashing (Argon2id winner of PHC)",
        icon: "",
        color: "from-purple-500 to-purple-700",
        default: !1,
      },
      {
        id: "tokio-test",
        name: "Tokio Test",
        description: "Async testing utilities for Tokio runtime",
        icon: "",
        color: "from-cyan-500 to-blue-600",
        default: !1,
      },
      {
        id: "mockall",
        name: "Mockall",
        description: "Powerful mock objects library for Rust testing",
        icon: "",
        color: "from-rose-500 to-pink-600",
        default: !1,
      },
      {
        id: "none",
        name: "No Additional Libraries",
        description: "Skip additional Rust core libraries",
        icon: "",
        color: "from-gray-400 to-gray-600",
        default: !1,
      },
    ],
  },
  jE = [
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
  ],
  UE = [
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
  ],
  _e = {
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
    rustWebFramework: "axum",
    rustFrontend: "none",
    rustOrm: "sea-orm",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: "serde",
  },
  BE = (a, i, r) => {
    const o = _e[i];
    if (
      a.backend === "convex" &&
      ((i === "runtime" && r === "none") ||
        (i === "database" && r === "none") ||
        (i === "orm" && r === "none") ||
        (i === "api" && r === "none") ||
        (i === "auth" && r === "none") ||
        (i === "dbSetup" && r === "none"))
    )
      return !0;
    if (
      (i === "webFrontend" ||
        i === "nativeFrontend" ||
        i === "codeQuality" ||
        i === "documentation" ||
        i === "appPlatforms" ||
        i === "examples") &&
      Array.isArray(o) &&
      Array.isArray(r)
    ) {
      const l = [...o].sort(),
        f = [...r].sort();
      return l.length === f.length && l.every((d, h) => d === f[h]);
    }
    if (Array.isArray(o) && Array.isArray(r)) {
      const l = [...o].sort(),
        f = [...r].sort();
      return l.length === f.length && l.every((d, h) => d === f[h]);
    }
    return o === r;
  },
  vr = (a) =>
    Me()
      .transform((i) => i.split(",").filter(Boolean))
      .catch(a),
  vE = gE({
    eco: Ig(["typescript", "rust"]).catch(_e.ecosystem),
    name: Me().catch(_e.projectName ?? "my-better-t-app"),
    "fe-w": vr(_e.webFrontend),
    "fe-n": vr(_e.nativeFrontend),
    ai: Me().catch(_e.astroIntegration),
    css: Me().catch(_e.cssFramework),
    ui: Me().catch(_e.uiLibrary),
    rt: Me().catch(_e.runtime),
    be: Me().catch(_e.backend),
    api: Me().catch(_e.api),
    db: Me().catch(_e.database),
    orm: Me().catch(_e.orm),
    dbs: Me().catch(_e.dbSetup),
    au: Me().catch(_e.auth),
    pay: Me().catch(_e.payments),
    em: Me().catch(_e.email),
    fu: Me().catch(_e.fileUpload),
    log: Me().catch(_e.logging),
    obs: Me().catch(_e.observability),
    bl: Me().catch(_e.backendLibraries),
    sm: Me().catch(_e.stateManagement),
    val: Me().catch(_e.validation),
    tst: Me().catch(_e.testing),
    rt2: Me().catch(_e.realtime),
    jq: Me().catch(_e.jobQueue),
    cache: Me().catch(_e.caching),
    anim: Me().catch(_e.animation),
    cms: Me().catch(_e.cms),
    cq: vr(_e.codeQuality),
    doc: vr(_e.documentation),
    ap: vr(_e.appPlatforms),
    pm: Me().catch(_e.packageManager),
    ex: vr(_e.examples),
    aisdk: Me().catch(_e.aiSdk),
    git: Me().catch(_e.git),
    i: Me().catch(_e.install),
    wd: Me().catch(_e.webDeploy),
    sd: Me().catch(_e.serverDeploy),
    yolo: Me().catch(_e.yolo),
    rwf: Me().catch(_e.rustWebFramework),
    rfe: Me().catch(_e.rustFrontend),
    rorm: Me().catch(_e.rustOrm),
    rapi: Me().catch(_e.rustApi),
    rcli: Me().catch(_e.rustCli),
    rlib: Me().catch(_e.rustLibraries),
    view: Ig(["command", "preview"]).catch("command"),
    file: Me().catch(""),
  }),
  bE = () => cy(() => import("./new-C8-k5xsL.js"), []),
  SE = Tl("/new")({
    validateSearch: yE(vE),
    head: () => ({
      meta: [
        { title: "Stack Builder - Better-T-Stack" },
        { name: "description", content: "Interactive UI to roll your own stack" },
        { property: "og:title", content: "Stack Builder - Better-T-Stack" },
        { property: "og:description", content: "Interactive UI to roll your own stack" },
        { property: "og:url", content: "https://better-t-stack.dev/new" },
        { property: "og:image", content: "https://r2.better-t-stack.dev/og.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Stack Builder - Better-T-Stack" },
        { name: "twitter:description", content: "Interactive UI to roll your own stack" },
        { name: "twitter:image", content: "https://r2.better-t-stack.dev/og.png" },
      ],
    }),
    component: I0(bE, "component"),
  }),
  _E = () => cy(() => import("./index-De2VzOaZ.js"), __vite__mapDeps([0, 1])),
  xE = Tl("/")({ component: I0(_E, "component") }),
  wE = SE.update({ id: "/new", path: "/new", getParentRoute: () => Kf }),
  EE = xE.update({ id: "/", path: "/", getParentRoute: () => Kf }),
  TE = { IndexRoute: EE, NewRoute: wE },
  RE = Kf._addFileChildren(TE);
function AE() {
  return dw({ routeTree: RE, defaultPreload: "intent", scrollRestoration: !0 });
}
async function ME() {
  const a = await AE();
  let i;
  return (
    (i = []),
    (window.__TSS_START_OPTIONS__ = { serializationAdapters: i }),
    i.push(Hw),
    a.options.serializationAdapters && i.push(...a.options.serializationAdapters),
    a.update({ basepath: "", serializationAdapters: i }),
    a.state.matches.length || (await xw(a)),
    a
  );
}
async function CE() {
  var i;
  const a = await ME();
  return ((i = window.$_TSR) == null || i.h(), a);
}
let xf;
function kE() {
  return (xf || (xf = CE()), F.jsx(Nx, { promise: xf, children: (a) => F.jsx(pw, { router: a }) }));
}
le.startTransition(() => {
  Db.hydrateRoot(document, F.jsx(le.StrictMode, { children: F.jsx(kE, {}) }));
});
export {
  _e as D,
  jE as E,
  Pw as G,
  Iw as I,
  Us as L,
  UE as P,
  Mb as R,
  r2 as T,
  cy as _,
  K0 as a,
  Hx as b,
  Ia as c,
  LE as d,
  BE as i,
  F as j,
  le as r,
  DE as t,
  Ff as u,
  Zx as w,
};

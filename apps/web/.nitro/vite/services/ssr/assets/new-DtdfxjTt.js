import { s as jsxRuntimeExports, c as reactExports } from "../server.js";

import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
const StackBuilder = reactExports.lazy(() => import("./stack-builder-D9lBluk6.js"));
function StackBuilderPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
    fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex h-[calc(100vh-64px)] items-center justify-center",
      children: "Loading...",
    }),
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(StackBuilder, {}),
    }),
  });
}
export { StackBuilderPage as component };

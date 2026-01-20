const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/stack-builder-BWXHv_tw.js",
      "assets/main-BHLV-i_6.js",
      "assets/main-ozXaa6yP.css",
      "assets/check-DWEmbU_d.js",
    ]),
) => i.map((i) => d[i]);
import { j as e, r, _ as s } from "./main-BHLV-i_6.js";
const a = r.lazy(() =>
  s(() => import("./stack-builder-BWXHv_tw.js"), __vite__mapDeps([0, 1, 2, 3])),
);
function i() {
  return e.jsx(r.Suspense, {
    fallback: e.jsx("div", {
      className: "flex h-[calc(100vh-64px)] items-center justify-center",
      children: "Loading...",
    }),
    children: e.jsx("div", {
      className: "grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden",
      children: e.jsx(a, {}),
    }),
  });
}
export { i as component };

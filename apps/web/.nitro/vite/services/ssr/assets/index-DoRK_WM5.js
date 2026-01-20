import { s as jsxRuntimeExports, c as reactExports } from "../server.js";
import { C as Check } from "./check-yuJciO15.js";
import { c as createLucideIcon, G as Github, L as Link } from "./router-Bw3MqbPS.js";

import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }],
];
const Copy = createLucideIcon("copy", __iconNode$2);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f",
    },
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }],
];
const Linkedin = createLucideIcon("linkedin", __iconNode$1);
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
      d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
      key: "pff0z6",
    },
  ],
];
const Twitter = createLucideIcon("twitter", __iconNode);
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", {
    className: "border-t border-border",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "container mx-auto px-6 py-12",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "flex flex-col items-center justify-between gap-8 sm:flex-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex flex-col items-center gap-4 sm:flex-row sm:gap-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "font-display text-sm font-semibold uppercase tracking-wider",
                  children: "Better Fullstack",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "hidden h-4 w-px bg-border sm:block",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "text-sm text-muted-foreground",
                  children: "Type-safe TypeScript scaffolding",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex items-center gap-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
                  href: "https://github.com/Marve10s/Better-Fullstack",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-muted-foreground transition-colors hover:text-foreground",
                  "aria-label": "GitHub",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-5 w-5" }),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
                  href: "https://www.npmjs.com/package/create-better-t-stack",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-muted-foreground transition-colors hover:text-foreground",
                  "aria-label": "NPM",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                    src: "/icon/npm.svg",
                    alt: "NPM",
                    width: 20,
                    height: 20,
                    className: "opacity-60 transition-opacity hover:opacity-100 dark:invert",
                  }),
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "mt-8 flex justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
            className: "text-xs text-muted-foreground",
            children: [/* @__PURE__ */ new Date().getFullYear(), " Better Fullstack"],
          }),
        }),
      ],
    }),
  });
}
const PackageIcon = ({ pm, className }) => {
  switch (pm) {
    case "npm":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
        className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "npm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z",
          }),
        ],
      });
    case "pnpm":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
        className,
        width: "800px",
        height: "800px",
        viewBox: "0 0 32 32",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "pnpm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M30,10.75H21.251V2H30Z",
            style: { fill: "#f9ad00" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M20.374,10.75h-8.75V2h8.75Z",
            style: { fill: "#f9ad00" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M10.749,10.75H2V2h8.749Z",
            style: { fill: "#f9ad00" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M30,20.375H21.251v-8.75H30Z",
            style: { fill: "#f9ad00" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M20.374,20.375h-8.75v-8.75h8.75Z",
            style: { fill: "#fff" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M20.374,30h-8.75V21.25h8.75Z",
            style: { fill: "#fff" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M30,30H21.251V21.25H30Z",
            style: { fill: "#fff" },
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: "M10.749,30H2V21.25h8.749Z",
            style: { fill: "#fff" },
          }),
        ],
      });
    case "bun":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
        className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 100 100",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "bun" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#000",
            d: "M89.237 32.3c-.2-.213-.412-.425-.625-.625-.212-.2-.412-.425-.625-.625-.212-.2-.412-.425-.625-.625-.212-.2-.412-.425-.625-.625-.212-.2-.412-.425-.625-.625-.212-.2-.412-.425-.625-.625-.212-.2-.412-.425-.625-.625A33.08 33.08 0 0 1 94.75 51c0 20.712-21.025 37.562-46.875 37.562-14.475 0-27.425-5.287-36.038-13.575l.625.625.625.625.625.625.625.625.625.625.625.625.625.625c8.6 8.638 21.838 14.2 36.663 14.2 25.85 0 46.875-16.85 46.875-37.5 0-8.825-3.8-17.187-10.513-23.762",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#FBF0DF",
            d: "M91.625 51c0 19.012-19.588 34.425-43.75 34.425S4.125 70.012 4.125 51c0-11.788 7.5-22.2 19.025-28.375s18.7-12.5 24.725-12.5 11.175 5.162 24.725 12.5C84.125 28.8 91.625 39.212 91.625 51",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#F6DECE",
            d: "M91.625 51a27 27 0 0 0-1-7.225C87.213 85.4 36.438 87.4 16.475 74.95a50 50 0 0 0 31.4 10.475C72 85.425 91.625 69.987 91.625 51",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#FFFEFC",
            d: "M31.038 20.337c5.587-3.35 13.012-9.637 20.312-9.65a11.6 11.6 0 0 0-3.475-.562c-3.025 0-6.25 1.562-10.312 3.912-1.413.825-2.876 1.738-4.425 2.688-2.913 1.8-6.25 3.837-10 5.875C11.237 29.037 4.124 39.65 4.124 51v1.487c7.575-26.762 21.338-28.8 26.913-32.15",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#CCBEA7",
            fillRule: "evenodd",
            d: "M44.275 13.287a20.51 20.51 0 0 1-7.037 15.588c-.35.312-.075.912.375.737 4.212-1.637 9.9-6.537 7.5-16.425-.1-.562-.838-.412-.838.1m2.838 0a20.3 20.3 0 0 1 2.012 16.838c-.15.437.388.812.688.45 2.737-3.5 5.125-10.45-2.025-17.95-.363-.325-.925.175-.675.612zm3.45-.212a20.52 20.52 0 0 1 8.562 14.7.412.412 0 0 0 .813.137c1.15-4.362.5-11.8-8.963-15.662-.5-.2-.825.475-.412.775zm-23.075 13a21.18 21.18 0 0 0 13.087-11.25c.225-.45.938-.275.825.225-2.162 10-9.4 12.087-13.9 11.812-.475.013-.462-.65-.012-.787",
            clipRule: "evenodd",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#000",
            d: "M47.875 88.562C22.025 88.562 1 71.712 1 51c0-12.5 7.725-24.163 20.663-31.15 3.75-2 6.962-4.013 9.825-5.775a262 262 0 0 1 4.5-2.738C40.375 8.737 44.125 7 47.875 7S54.9 8.5 59 10.925c1.25.712 2.5 1.487 3.837 2.337 3.113 1.925 6.626 4.1 11.25 6.588C87.026 26.837 94.75 38.487 94.75 51c0 20.712-21.025 37.562-46.875 37.562m0-78.437c-3.025 0-6.25 1.562-10.312 3.912-1.413.825-2.876 1.738-4.425 2.688-2.913 1.8-6.25 3.837-10 5.875C11.237 29.037 4.124 39.65 4.124 51c0 18.987 19.625 34.437 43.75 34.437S91.625 69.987 91.625 51c0-11.35-7.112-21.963-19.025-28.375-4.725-2.5-8.412-4.85-11.4-6.7-1.363-.838-2.613-1.613-3.75-2.3-3.788-2.25-6.55-3.5-9.575-3.5",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#B71422",
            d: "M56.688 60.125a11.16 11.16 0 0 1-3.65 5.887 8.5 8.5 0 0 1-5 2.35 8.55 8.55 0 0 1-5.163-2.35 11.16 11.16 0 0 1-3.6-5.887.9.9 0 0 1 1-1.013H55.7a.9.9 0 0 1 .987 1.013",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#FF6164",
            d: "M42.875 66.112a8.64 8.64 0 0 0 5.15 2.375 8.64 8.64 0 0 0 5.137-2.375q.672-.625 1.25-1.337a8.54 8.54 0 0 0-6.125-2.888 7.69 7.69 0 0 0-6.25 3.475c.288.263.538.513.838.75",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#000",
            d: "M43.075 65.125a6.7 6.7 0 0 1 5.237-2.6 7.5 7.5 0 0 1 5 2.112c.288-.312.563-.637.825-.962a8.75 8.75 0 0 0-5.887-2.413 7.95 7.95 0 0 0-6.112 2.95q.443.482.937.913",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#000",
            d: "M47.987 69.112a9.28 9.28 0 0 1-5.562-2.5 11.9 11.9 0 0 1-3.888-6.312 1.5 1.5 0 0 1 .325-1.25 1.76 1.76 0 0 1 1.413-.638H55.7a1.8 1.8 0 0 1 1.412.638 1.49 1.49 0 0 1 .313 1.25 11.9 11.9 0 0 1-3.888 6.312 9.27 9.27 0 0 1-5.55 2.5m-7.712-9.25c-.2 0-.25.088-.263.113a10.36 10.36 0 0 0 3.413 5.462 7.8 7.8 0 0 0 4.562 2.188 7.85 7.85 0 0 0 4.563-2.163A10.38 10.38 0 0 0 55.95 60a.26.26 0 0 0-.25-.113z",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#FEBBD0",
            d: "M66.9 60.9c4.038 0 7.312-1.926 7.312-4.3 0-2.375-3.273-4.3-7.312-4.3s-7.313 1.925-7.313 4.3 3.274 4.3 7.313 4.3m-37.837 0c4.038 0 7.312-1.926 7.312-4.3 0-2.375-3.274-4.3-7.312-4.3-4.04 0-7.313 1.925-7.313 4.3s3.274 4.3 7.313 4.3",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#000",
            fillRule: "evenodd",
            d: "M32.5 54.875a6.888 6.888 0 1 0 .025-13.775 6.888 6.888 0 0 0-.025 13.775m30.963 0a6.887 6.887 0 1 0-6.838-6.888 6.875 6.875 0 0 0 6.837 6.888",
            clipRule: "evenodd",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#fff",
            fillRule: "evenodd",
            d: "M30.375 48.425a2.588 2.588 0 1 0 .025-5.176 2.588 2.588 0 0 0-.025 5.176m30.963 0a2.588 2.588 0 1 0-.026 0z",
            clipRule: "evenodd",
          }),
        ],
      });
    case "github":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
        className,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 97.63 96.03",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Github" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            fill: "#f0f6fc",
            fillRule: "evenodd",
            d: "M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a47 47 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0",
            clipRule: "evenodd",
          }),
        ],
      });
    default:
      return null;
  }
};
function HeroSection() {
  const [copied, setCopied] = reactExports.useState(false);
  const [selectedPM, setSelectedPM] = reactExports.useState("bun");
  const commands = {
    npm: "npx create-better-t-stack@latest",
    pnpm: "pnpm create better-t-stack@latest",
    bun: "bun create better-t-stack@latest",
  };
  const copyCommand = () => {
    navigator.clipboard.writeText(commands[selectedPM]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "relative flex min-h-[80vh] items-center py-24",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "absolute inset-0 opacity-[0.03] dark:opacity-[0.04]",
        style: {
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        },
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "relative z-10 grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex flex-col justify-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", {
                className:
                  "font-display text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "block text-foreground",
                    children: "Better",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "mt-2 inline-block border-2 border-foreground px-3 py-1 text-foreground",
                    children: "Fullstack",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "mt-10 max-w-md text-lg leading-relaxed text-muted-foreground",
                children: "The Power of the Full Stack Builder in the Palm Of My Hand",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "mt-10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                  to: "/new",
                  className:
                    "group inline-flex items-center gap-3 bg-foreground px-8 py-4 font-semibold uppercase tracking-wider text-background transition-all hover:bg-foreground/90",
                  children: [
                    "Start Building",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, {
                      className: "h-4 w-4 transition-transform group-hover:translate-x-1",
                    }),
                  ],
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex flex-col justify-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "border border-border bg-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center justify-between border-b border-border px-4 py-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className:
                          "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
                        children: "Quick Start",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "flex items-center gap-2",
                        children: ["bun", "pnpm", "npm"].map((pm) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => setSelectedPM(pm),
                              className: `flex items-center gap-1.5 px-2 py-1 text-xs font-medium uppercase tracking-wider transition-all ${selectedPM === pm ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(PackageIcon, {
                                  pm,
                                  className: "h-3 w-3",
                                }),
                                pm,
                              ],
                            },
                            pm,
                          ),
                        ),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center justify-between px-6 py-6",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("code", {
                        className: "font-mono text-sm text-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "$",
                          }),
                          " ",
                          commands[selectedPM],
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        type: "button",
                        onClick: copyCommand,
                        className:
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
                        children: copied
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" })
                          : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "mt-6 flex items-center gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "h-px flex-1 bg-border",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "text-xs uppercase tracking-wider text-muted-foreground",
                    children: "or",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "h-px flex-1 bg-border",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                to: "/new",
                className:
                  "group mt-6 flex items-center justify-between border border-border bg-card p-6 transition-all hover:border-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className:
                          "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
                        children: "Interactive",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "mt-1 font-semibold text-foreground",
                        children: "Use the Stack Builder",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, {
                    className:
                      "h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function SponsorSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", {
    className: "border-t border-border py-20",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
              className: "font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl",
              children: "Support the Project",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "mt-4 max-w-md text-lg leading-relaxed text-muted-foreground",
              children:
                "If you find Better Fullstack useful, consider supporting its development. Your sponsorship helps maintain and improve the project.",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
              href: "https://www.patreon.com/c/marve10s",
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "group mt-8 inline-flex items-center gap-3 border-2 border-foreground bg-transparent px-8 py-4 font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
                  className: "h-5 w-5",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
                    d: "M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z",
                  }),
                }),
                "Become a Patron",
              ],
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
              className: "font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl",
              children: "Or Would Like to Chat?",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "mt-4 max-w-md text-lg leading-relaxed text-muted-foreground",
              children: "Follow my socials or visit my portfolio for more.",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "mt-8 flex flex-wrap items-center gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
                  href: "https://www.linkedin.com/in/ibrahim-elkamali-94a466292/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground hover:text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4" }),
                    "LinkedIn",
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
                  href: "https://x.com/MARVELOUSBC",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground hover:text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "h-4 w-4" }),
                    "X",
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
                  href: "https://github.com/Marve10s",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground hover:text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-4 w-4" }),
                    "GitHub",
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
              href: "https://elkamali.dev/",
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "group mt-6 inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-muted-foreground",
              children: [
                "Visit my Portfolio",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "transition-transform group-hover:translate-x-1",
                  children: "→",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", {
    className: "container mx-auto min-h-svh px-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    ],
  });
}
export { HomePage as component };

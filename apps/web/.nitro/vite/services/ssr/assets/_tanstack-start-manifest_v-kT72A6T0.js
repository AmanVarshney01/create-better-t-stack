const tsrStartManifest = () => ({
  routes: {
    __root__: {
      filePath: "/home/ibrahim/Better-Fullstack/apps/web/src/routes/__root.tsx",
      children: ["/", "/new", "/api/preview"],
      preloads: ["/assets/main-BHLV-i_6.js"],
      assets: [
        {
          tag: "link",
          attrs: { rel: "stylesheet", href: "/assets/main-ozXaa6yP.css", type: "text/css" },
        },
      ],
    },
    "/": {
      filePath: "/home/ibrahim/Better-Fullstack/apps/web/src/routes/index.tsx",
      assets: [
        {
          tag: "link",
          attrs: { rel: "stylesheet", href: "/assets/main-ozXaa6yP.css", type: "text/css" },
        },
      ],
      preloads: ["/assets/index-De2VzOaZ.js", "/assets/check-DWEmbU_d.js"],
    },
    "/new": {
      filePath: "/home/ibrahim/Better-Fullstack/apps/web/src/routes/new.tsx",
      assets: [
        {
          tag: "link",
          attrs: { rel: "stylesheet", href: "/assets/main-ozXaa6yP.css", type: "text/css" },
        },
      ],
      preloads: ["/assets/new-C8-k5xsL.js"],
    },
    "/api/preview": {
      filePath: "/home/ibrahim/Better-Fullstack/apps/web/src/routes/api/preview.ts",
    },
  },
  clientEntry: "/assets/main-BHLV-i_6.js",
});
export { tsrStartManifest };

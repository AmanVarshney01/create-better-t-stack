import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, backend } = config;
  if (!auth || auth === "none") return;

  if (backend === "convex") {
    processConvexAuthDeps(vfs, config);
  } else {
    processStandardAuthDeps(vfs, config);
  }
}

function processConvexAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, frontend } = config;
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";
  const backendPath = "packages/backend/package.json";

  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);
  const backendExists = vfs.exists(backendPath);

  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasNextJs = frontend.includes("next");
  const hasTanStackStart = frontend.includes("tanstack-start");
  const hasViteReact = frontend.some((f) => ["tanstack-router", "react-router"].includes(f));
  const hasSolid = frontend.includes("solid");
  const hasSvelte = frontend.includes("svelte");
  const hasReactWebAuthForms = hasNextJs || hasTanStackStart || hasViteReact;

  if (auth === "clerk") {
    if (webExists) {
      if (hasNextJs) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/nextjs"] });
      } else if (hasTanStackStart) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@clerk/tanstack-react-start", "srvx"],
        });
      } else if (hasViteReact) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/clerk-react"] });
      }
    }
    if (nativeExists && hasNative) {
      addPackageDependency({ vfs, packagePath: nativePath, dependencies: ["@clerk/clerk-expo"] });
    }
  } else if (auth === "better-auth") {
    if (backendExists) {
      addPackageDependency({
        vfs,
        packagePath: backendPath,
        dependencies: ["better-auth", "@convex-dev/better-auth"],
        customDependencies: { "better-auth": "1.4.9" },
      });
      if (hasNative) {
        addPackageDependency({
          vfs,
          packagePath: backendPath,
          dependencies: ["@better-auth/expo"],
          customDependencies: { "@better-auth/expo": "1.4.9" },
        });
      }
    }

    if (webExists) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["better-auth", "@convex-dev/better-auth"],
        customDependencies: { "better-auth": "1.4.9" },
      });

      if (hasReactWebAuthForms) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/react-form"] });
      }
      if (hasSolid) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/solid-form"] });
      }
      if (hasSvelte) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@tanstack/svelte-form"],
        });
      }
    }

    if (nativeExists && hasNative) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: [
          "better-auth",
          "@better-auth/expo",
          "@convex-dev/better-auth",
          "@tanstack/react-form",
        ],
        customDependencies: { "better-auth": "1.4.9", "@better-auth/expo": "1.4.9" },
      });
    }
  }
}

function processStandardAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, frontend } = config;
  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";

  const authExists = vfs.exists(authPath);
  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);

  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasWebFrontend = frontend.some((f) =>
    [
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "astro",
    ].includes(f),
  );
  const hasReactWebAuthForms = frontend.some((f) =>
    ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
  );
  const hasSolid = frontend.includes("solid");
  const hasSvelte = frontend.includes("svelte");

  if (auth === "better-auth") {
    if (authExists) {
      addPackageDependency({ vfs, packagePath: authPath, dependencies: ["better-auth"] });
      if (hasNative) {
        addPackageDependency({ vfs, packagePath: authPath, dependencies: ["@better-auth/expo"] });
      }
    }

    if (hasWebFrontend && webExists) {
      addPackageDependency({ vfs, packagePath: webPath, dependencies: ["better-auth"] });

      if (hasReactWebAuthForms) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/react-form"] });
      }
      if (hasSolid) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/solid-form"] });
      }
      if (hasSvelte) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@tanstack/svelte-form"],
        });
      }
    }

    if (hasNative && nativeExists) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: ["better-auth", "@better-auth/expo", "@tanstack/react-form"],
      });
    }
  }
}

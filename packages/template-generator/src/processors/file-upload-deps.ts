import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

const REACT_WEB_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"];
const NATIVE_FRONTENDS = ["native-bare", "native-uniwind", "native-unistyles"];
const SVELTE_FRONTENDS = ["svelte"];
const VUE_FRONTENDS = ["nuxt"];
const SOLID_FRONTENDS = ["solid"];
const ASTRO_FRONTENDS = ["astro"];

// Fullstack frameworks that have their own backend
const FULLSTACK_WITH_SELF_BACKEND = ["next", "tanstack-start", "astro", "nuxt", "svelte", "solid"];

export function processFileUploadDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { fileUpload, frontend, backend, astroIntegration } = config;

  // Skip if not selected or set to "none"
  if (!fileUpload || fileUpload === "none") return;

  if (fileUpload === "uploadthing") {
    // Server-side SDK
    // Add to apps/server if it exists (separate backend)
    const serverPath = "apps/server/package.json";
    if (vfs.exists(serverPath) && backend !== "none" && backend !== "convex") {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["uploadthing"],
      });
    }

    // Check for fullstack frameworks with self-backend
    const hasFullstackSelf =
      backend === "self" && frontend.some((f) => FULLSTACK_WITH_SELF_BACKEND.includes(f));

    // Client-side SDK
    const webPath = "apps/web/package.json";
    if (vfs.exists(webPath)) {
      const hasReactWeb = frontend.some((f) => REACT_WEB_FRONTENDS.includes(f));
      const hasSvelte = frontend.some((f) => SVELTE_FRONTENDS.includes(f));
      const hasVue = frontend.some((f) => VUE_FRONTENDS.includes(f));
      const hasSolid = frontend.some((f) => SOLID_FRONTENDS.includes(f));
      const hasAstro = frontend.some((f) => ASTRO_FRONTENDS.includes(f));

      // For fullstack frameworks, add both client and server SDK to web package
      const baseDeps: AvailableDependencies[] = [];
      if (hasFullstackSelf) {
        baseDeps.push("uploadthing");
      }

      if (hasReactWeb) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: [...baseDeps, "@uploadthing/react"],
        });
      } else if (hasSvelte) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: [...baseDeps, "@uploadthing/svelte"],
        });
      } else if (hasVue) {
        // Nuxt uses the special nuxt module
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: [...baseDeps, "@uploadthing/nuxt"],
        });
      } else if (hasSolid) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: [...baseDeps, "@uploadthing/solid"],
        });
      } else if (hasAstro) {
        // Astro with React integration
        if (astroIntegration === "react") {
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: [...baseDeps, "@uploadthing/react"],
          });
        } else if (astroIntegration === "vue") {
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: [...baseDeps, "@uploadthing/vue"],
          });
        } else if (astroIntegration === "svelte") {
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: [...baseDeps, "@uploadthing/svelte"],
          });
        } else if (astroIntegration === "solid") {
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: [...baseDeps, "@uploadthing/solid"],
          });
        } else if (baseDeps.length > 0) {
          // Astro without UI integration but with self backend
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: baseDeps,
          });
        }
      }
    }

    // Native apps
    const hasNative = frontend.some((f) => NATIVE_FRONTENDS.includes(f));
    if (hasNative) {
      const nativePath = "apps/native/package.json";
      if (vfs.exists(nativePath)) {
        addPackageDependency({
          vfs,
          packagePath: nativePath,
          dependencies: ["@uploadthing/expo"],
        });
      }
    }
  }
}

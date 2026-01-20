import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

const REACT_WEB_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"];
const NATIVE_FRONTENDS = ["native-bare", "native-uniwind", "native-unistyles"];
const SVELTE_FRONTENDS = ["svelte"];
const VUE_FRONTENDS = ["nuxt"];
const SOLID_FRONTENDS = ["solid"];
const ASTRO_FRONTENDS = ["astro"];
const ANGULAR_FRONTENDS = ["angular"];

// Fullstack frameworks that have their own backend
const FULLSTACK_WITH_SELF_BACKEND = ["next", "tanstack-start", "astro", "nuxt", "svelte", "solid"];

// Common FilePond plugins for all frameworks
const FILEPOND_PLUGINS: AvailableDependencies[] = [
  "filepond",
  "filepond-plugin-image-preview",
  "filepond-plugin-file-validate-type",
  "filepond-plugin-file-validate-size",
];

// Common Uppy packages for all frameworks
const UPPY_CORE_PACKAGES: AvailableDependencies[] = [
  "@uppy/core",
  "@uppy/dashboard",
  "@uppy/drag-drop",
  "@uppy/progress-bar",
  "@uppy/xhr-upload",
  "@uppy/tus",
];

export function processFileUploadDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { fileUpload } = config;

  // Skip if not selected or set to "none"
  if (!fileUpload || fileUpload === "none") return;

  if (fileUpload === "uploadthing") {
    processUploadthingDeps(vfs, config);
  } else if (fileUpload === "filepond") {
    processFilepondDeps(vfs, config);
  } else if (fileUpload === "uppy") {
    processUppyDeps(vfs, config);
  }
}

function processUploadthingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, backend, astroIntegration } = config;

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

function processFilepondDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, astroIntegration } = config;

  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  const hasReactWeb = frontend.some((f) => REACT_WEB_FRONTENDS.includes(f));
  const hasSvelte = frontend.some((f) => SVELTE_FRONTENDS.includes(f));
  const hasVue = frontend.some((f) => VUE_FRONTENDS.includes(f));
  const hasAstro = frontend.some((f) => ASTRO_FRONTENDS.includes(f));

  // FilePond is a client-side only library (no server SDK needed)
  // Add framework-specific adapter + common plugins
  if (hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...FILEPOND_PLUGINS, "react-filepond"],
    });
  } else if (hasSvelte) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...FILEPOND_PLUGINS, "svelte-filepond"],
    });
  } else if (hasVue) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...FILEPOND_PLUGINS, "vue-filepond"],
    });
  } else if (hasAstro) {
    // Astro with framework integration
    if (astroIntegration === "react") {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: [...FILEPOND_PLUGINS, "react-filepond"],
      });
    } else if (astroIntegration === "vue") {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: [...FILEPOND_PLUGINS, "vue-filepond"],
      });
    } else if (astroIntegration === "svelte") {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: [...FILEPOND_PLUGINS, "svelte-filepond"],
      });
    } else {
      // Astro without UI integration - add vanilla FilePond
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: FILEPOND_PLUGINS,
      });
    }
  } else {
    // For other frontends (Solid, Qwik, Angular, etc.), add vanilla FilePond
    // These can use FilePond directly via its vanilla JS API
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: FILEPOND_PLUGINS,
    });
  }
}

function processUppyDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, astroIntegration } = config;

  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  const hasReactWeb = frontend.some((f) => REACT_WEB_FRONTENDS.includes(f));
  const hasSvelte = frontend.some((f) => SVELTE_FRONTENDS.includes(f));
  const hasVue = frontend.some((f) => VUE_FRONTENDS.includes(f));
  const hasAngular = frontend.some((f) => ANGULAR_FRONTENDS.includes(f));
  const hasAstro = frontend.some((f) => ASTRO_FRONTENDS.includes(f));

  // Uppy is a client-side only library (no server SDK needed)
  // Add framework-specific adapter + core packages
  if (hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...UPPY_CORE_PACKAGES, "@uppy/react"],
    });
  } else if (hasSvelte) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...UPPY_CORE_PACKAGES, "@uppy/svelte"],
    });
  } else if (hasVue) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...UPPY_CORE_PACKAGES, "@uppy/vue"],
    });
  } else if (hasAngular) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [...UPPY_CORE_PACKAGES, "@uppy/angular"],
    });
  } else if (hasAstro) {
    // Astro with framework integration
    if (astroIntegration === "react") {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: [...UPPY_CORE_PACKAGES, "@uppy/react"],
      });
    } else if (astroIntegration === "vue") {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: [...UPPY_CORE_PACKAGES, "@uppy/vue"],
      });
    } else if (astroIntegration === "svelte") {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: [...UPPY_CORE_PACKAGES, "@uppy/svelte"],
      });
    } else {
      // Astro without UI integration - add vanilla Uppy
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: UPPY_CORE_PACKAGES,
      });
    }
  } else {
    // For other frontends (Solid, Qwik, etc.), add vanilla Uppy
    // These can use Uppy directly via its vanilla JS API
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: UPPY_CORE_PACKAGES,
    });
  }
}

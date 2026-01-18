import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processEmailDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { email, frontend, backend } = config;
  if (!email || email === "none") return;
  if (backend === "none" || backend === "convex") return;

  const serverPath = "apps/server/package.json";

  // Add Resend SDK for resend option
  if (email === "resend" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["resend"],
    });
  }

  // Add React Email components for both resend and react-email options
  const hasReactWeb = frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );

  if (hasReactWeb && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@react-email/components", "react-email"],
    });
  }
}

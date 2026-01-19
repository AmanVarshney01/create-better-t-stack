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

  // Add Nodemailer for nodemailer option
  if (email === "nodemailer" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["nodemailer"],
      devDependencies: ["@types/nodemailer"],
    });
  }

  // Add Postmark for postmark option
  if (email === "postmark" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["postmark"],
    });
  }

  // Add React Email components for resend and react-email options (not nodemailer)
  const hasReactWeb = frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );

  if (hasReactWeb && vfs.exists(serverPath) && (email === "resend" || email === "react-email")) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@react-email/components", "react-email"],
    });
  }
}

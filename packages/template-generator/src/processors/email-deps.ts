import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

// Fullstack frontends with built-in servers that use backend=none
const FULLSTACK_FRONTENDS: Frontend[] = ["fresh", "qwik", "angular", "redwood"];

export function processEmailDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { email, frontend, backend } = config;
  if (!email || email === "none") return;
  if (backend === "convex") return;

  const serverPath = "apps/server/package.json";
  const webPath = "apps/web/package.json";

  // Determine target path: self backend targets web, standalone backend targets server,
  // fullstack frontends (fresh, qwik, etc.) fall back to web
  const hasFullstackFrontend = frontend.some((f) => FULLSTACK_FRONTENDS.includes(f));
  const targetPath =
    backend === "self" && vfs.exists(webPath)
      ? webPath
      : backend !== "none" && vfs.exists(serverPath)
        ? serverPath
        : hasFullstackFrontend && vfs.exists(webPath)
          ? webPath
          : null;

  if (!targetPath) return;

  // Add Resend SDK for resend option
  if (email === "resend") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["resend"],
    });
  }

  // Add Nodemailer for nodemailer option
  if (email === "nodemailer") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["nodemailer"],
      devDependencies: ["@types/nodemailer"],
    });
  }

  // Add Postmark for postmark option
  if (email === "postmark") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["postmark"],
    });
  }

  // Add SendGrid for sendgrid option
  if (email === "sendgrid") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["@sendgrid/mail"],
    });
  }

  // Add AWS SES for aws-ses option
  if (email === "aws-ses") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["@aws-sdk/client-ses"],
    });
  }

  // Add Mailgun for mailgun option
  if (email === "mailgun") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["mailgun.js", "form-data"],
    });
  }

  // Add Plunk for plunk option
  if (email === "plunk") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["@plunk/node"],
    });
  }

  // Add React Email components for resend and react-email options (not nodemailer)
  const hasReactWeb = frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );

  if (hasReactWeb && vfs.exists(targetPath) && (email === "resend" || email === "react-email")) {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["@react-email/components", "react-email"],
    });
  }
}

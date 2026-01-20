import type { ProjectConfig } from "@better-fullstack/types";

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

  // Add SendGrid for sendgrid option
  if (email === "sendgrid" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@sendgrid/mail"],
    });
  }

  // Add AWS SES for aws-ses option
  if (email === "aws-ses" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@aws-sdk/client-ses"],
    });
  }

  // Add Mailgun for mailgun option
  if (email === "mailgun" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["mailgun.js", "form-data"],
    });
  }

  // Add Plunk for plunk option
  if (email === "plunk" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@plunk/node"],
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

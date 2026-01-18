import type { Backend, Email } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getEmailChoice(email?: Email, backend?: Backend) {
  if (email !== undefined) return email;

  // Email requires a backend
  if (backend === "none") {
    return "none" as Email;
  }

  // Convex has its own solutions, skip email for now
  if (backend === "convex") {
    return "none" as Email;
  }

  const options = [
    {
      value: "resend" as Email,
      label: "Resend",
      hint: "Email for developers. Includes React Email components.",
    },
    {
      value: "react-email" as Email,
      label: "React Email",
      hint: "Build emails using React components (no sending service).",
    },
    {
      value: "none" as Email,
      label: "None",
      hint: "No email integration",
    },
  ];

  const response = await navigableSelect<Email>({
    message: "Select email solution",
    options,
    initialValue: DEFAULT_CONFIG.email ?? "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

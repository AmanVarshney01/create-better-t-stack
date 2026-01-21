import type { Auth, Backend, Frontend, Payments } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getPaymentsChoice(
  payments?: Payments,
  auth?: Auth,
  backend?: Backend,
  frontends?: Frontend[],
) {
  if (payments !== undefined) return payments;

  if (backend === "none") {
    return "none" as Payments;
  }

  // Polar requires better-auth and non-convex backend
  const isPolarCompatible =
    auth === "better-auth" &&
    backend !== "convex" &&
    (frontends?.length === 0 || splitFrontends(frontends).web.length > 0);

  const options: Array<{ value: Payments; label: string; hint: string }> = [];

  if (isPolarCompatible) {
    options.push({
      value: "polar" as Payments,
      label: "Polar",
      hint: "Turn your software into a business. 6 lines of code.",
    });
  }

  options.push(
    {
      value: "stripe" as Payments,
      label: "Stripe",
      hint: "Payment processing platform for internet businesses.",
    },
    {
      value: "lemon-squeezy" as Payments,
      label: "Lemon Squeezy",
      hint: "All-in-one platform for SaaS, digital products, and subscriptions.",
    },
    {
      value: "paddle" as Payments,
      label: "Paddle",
      hint: "Complete payments infrastructure for SaaS.",
    },
    {
      value: "dodo" as Payments,
      label: "Dodo Payments",
      hint: "Simple payment infrastructure for developers.",
    },
    {
      value: "none" as Payments,
      label: "None",
      hint: "No payments integration",
    },
  );

  const response = await navigableSelect<Payments>({
    message: "Select payments provider",
    options,
    initialValue: DEFAULT_CONFIG.payments,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

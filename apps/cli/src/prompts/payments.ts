import { supportsPaymentsAuth, supportsPaymentsFrontend } from "@better-t-stack/types";

import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend, Frontend, Payments } from "../types";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

export async function getPaymentsChoice(
  payments?: Payments,
  auth?: Auth,
  backend?: Backend,
  frontends?: Frontend[],
  previousValue?: Payments,
) {
  if (payments !== undefined) return payments;

  if (backend === "none") {
    return "none";
  }

  const isPolarCompatible = supportsPaymentsAuth("polar", auth);
  const isRevenueCatCompatible = supportsPaymentsFrontend("revenuecat", frontends);

  if (!isPolarCompatible && !isRevenueCatCompatible) {
    return "none";
  }

  const options: Array<{ value: Payments; label: string; hint: string }> = [];

  if (isPolarCompatible) {
    options.push({
      value: "polar",
      label: "Polar",
      hint: "Turn your software into a business. 6 lines of code.",
    });
  }

  if (isRevenueCatCompatible) {
    options.push({
      value: "revenuecat",
      label: "RevenueCat",
      hint: "In-app subscriptions and cross-platform monetization for mobile.",
    });
  }

  options.push({
    value: "none",
    label: "None",
    hint: "No payments integration",
  });

  const response = await navigableSelect<Payments>({
    message: "Add payments?",
    options,
    initialValue: preferValidInitial(options, previousValue, DEFAULT_CONFIG.payments),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}

import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend, Frontend, Payments } from "../types";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

/**
 * Prompt user for payments provider selection.
 * @param payments Optional initial payments option
 * @param auth Selected auth option
 * @param backend Selected backend option
 * @param _frontends Selected frontend frameworks
 * @param previousValue Previously selected payments option
 * @returns Selected payments choice
 */
export async function getPaymentsChoice(
  payments?: Payments,
  auth?: Auth,
  backend?: Backend,
  _frontends?: Frontend[],
  previousValue?: Payments,
) {
  if (payments !== undefined) return payments;

  if (backend === "none") {
    return "none" as Payments;
  }

  const isPolarCompatible = auth === "better-auth";

  if (!isPolarCompatible) {
    return "none" as Payments;
  }

  const options = [
    {
      value: "polar" as Payments,
      label: "Polar",
      hint: "Turn your software into a business. 6 lines of code.",
    },
    {
      value: "mollie" as Payments,
      label: "Mollie",
      hint: "Effortless payments for European businesses & beyond.",
    },
    {
      value: "none" as Payments,
      label: "None",
      hint: "No payments integration",
    },
  ];

  const response = await navigableSelect<Payments>({
    message: "Add payments?",
    options,
    initialValue: preferValidInitial(options, previousValue, DEFAULT_CONFIG.payments),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}

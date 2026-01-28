import type { Forms, Frontend } from "../types";

import { splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getFormsChoice(forms?: Forms, frontends?: Frontend[]) {
  if (forms !== undefined) return forms;

  const { web } = splitFrontends(frontends);

  // Form libraries are primarily for web frontends
  if (web.length === 0) {
    return "none" as Forms;
  }

  // Check frontend types
  const isReact = web.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next", "redwood"].includes(f),
  );
  const isSolid = web.includes("solid");
  const isQwik = web.includes("qwik");
  const isFresh = web.includes("fresh");

  // Build options based on frontend
  const options: Array<{ value: Forms; label: string; hint: string }> = [];

  if (isReact) {
    options.push(
      {
        value: "react-hook-form" as const,
        label: "React Hook Form",
        hint: "Performant, flexible form validation library",
      },
      {
        value: "formik" as const,
        label: "Formik",
        hint: "Popular form state management with Yup validation",
      },
      {
        value: "final-form" as const,
        label: "Final Form",
        hint: "Framework-agnostic form state management",
      },
      {
        value: "conform" as const,
        label: "Conform",
        hint: "Progressive enhancement forms with Zod validation",
      },
    );
  }

  // TanStack Form works with multiple frameworks (but not Fresh/Preact - no adapter exists)
  if (!isFresh) {
    options.push({
      value: "tanstack-form" as const,
      label: "TanStack Form",
      hint: "Fully-typed, framework-agnostic form library",
    });
  }

  // Modular Forms for Solid/Qwik
  if (isSolid || isQwik) {
    options.push({
      value: "modular-forms" as const,
      label: "Modular Forms",
      hint: "Type-safe forms for Solid and Qwik (3KB bundle)",
    });
  }

  options.push({
    value: "none" as const,
    label: "None",
    hint: "Build custom form handling",
  });

  const response = await navigableSelect<Forms>({
    message: "Select form library",
    options,
    initialValue: isReact ? "react-hook-form" : "tanstack-form",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

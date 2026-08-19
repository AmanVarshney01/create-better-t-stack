"use client";

import { InfoIcon, Plus, Terminal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { StackState } from "@/lib/constant";
import {
  EXTRA_APP_FRAMEWORKS,
  formatExtraApp,
  getExtraAppFrontendDisabledReason,
  getExtraAppsBlockedReason,
  parseExtraApp,
  validateExtraAppName,
} from "@/lib/extra-apps";
import { cn } from "@/lib/utils";

import { TechIcon } from "../tech-icon";

type ExtraAppsSectionProps = {
  stack: StackState;
  mode: "desktop" | "mobile";
  onAppsChange: (apps: string[]) => void;
};

/**
 * Plan additional frontend apps (name + framework) with the same gating as
 * the CLI. Renders nothing for fullstack (self) backends.
 */
export function ExtraAppsSection({ stack, mode, onAppsChange }: ExtraAppsSectionProps) {
  const isDesktop = mode === "desktop";
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [frontend, setFrontend] = useState<string | null>(null);

  const plannedApps = useMemo(
    () =>
      stack.apps.flatMap((encoded) => {
        const app = parseExtraApp(encoded);
        if (!app) return [];
        const option = EXTRA_APP_FRAMEWORKS.find((candidate) => candidate.id === app.frontend);
        return option ? [{ ...app, option }] : [];
      }),
    [stack.apps],
  );

  const takenNames = useMemo(() => new Set(plannedApps.map((app) => app.name)), [plannedApps]);

  // Hidden entirely when unavailable (fullstack self backends) — the
  // compatibility engine already drops any previously planned apps.
  if (getExtraAppsBlockedReason(stack)) return null;

  const trimmedName = name.trim();
  const nameError = validateExtraAppName(trimmedName, takenNames);
  const firstCompatible =
    EXTRA_APP_FRAMEWORKS.find((option) => !getExtraAppFrontendDisabledReason(stack, option.id))
      ?.id ?? null;
  const selectedFrontend =
    frontend && !getExtraAppFrontendDisabledReason(stack, frontend) ? frontend : firstCompatible;
  const canAdd = !nameError && selectedFrontend !== null;

  const resetForm = () => {
    setFormOpen(false);
    setName("");
    setNameTouched(false);
    setFrontend(null);
  };

  const addApp = () => {
    if (!canAdd || selectedFrontend === null) {
      setNameTouched(true);
      return;
    }
    onAppsChange([
      ...stack.apps,
      formatExtraApp({ name: trimmedName, frontend: selectedFrontend }),
    ]);
    resetForm();
  };

  return (
    <section
      id={isDesktop ? "section-apps" : "section-mobile-apps"}
      className={cn("mb-6 scroll-mt-4", isDesktop && "sm:mb-8")}
    >
      <div className="mb-3 flex items-center gap-2 text-fd-muted-foreground">
        <Terminal aria-hidden="true" className="h-3 w-3 shrink-0 text-primary" />
        <h2 className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          EXTRA APPS
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
        <Tooltip delay={100}>
          <TooltipTrigger
            render={
              <InfoIcon className="h-3.5 w-3.5 shrink-0 cursor-help text-fd-muted-foreground transition-colors duration-150 hover:text-fd-foreground" />
            }
          />
          <TooltipContent side="top" align="start">
            <p className="max-w-64 text-xs">
              Additional frontend apps (admin panel, landing page, …) created alongside your project
              via --apps. Each gets its own dev port and env module, sharing your API and auth.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        {plannedApps.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {plannedApps.map((app) => (
              <span
                key={app.name}
                className="inline-flex items-center gap-1 rounded-[4px] border pr-1 pl-2 font-mono text-[11px] text-fd-foreground"
              >
                <span className="flex items-center gap-1.5 py-0.5">
                  {app.name}
                  <span className="flex items-center gap-1 text-fd-muted-foreground">
                    {app.option.icon !== "" && (
                      <TechIcon icon={app.option.icon} name={app.option.name} className="h-3 w-3" />
                    )}
                    {app.option.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onAppsChange(
                      stack.apps.filter((encoded) => parseExtraApp(encoded)?.name !== app.name),
                    )
                  }
                  aria-label={`Remove planned app ${app.name}`}
                  className="builder-focus-ring pointer-coarse:p-2 p-0.5 text-fd-muted-foreground transition-colors duration-150 hover:text-destructive"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {formOpen ? (
          <div className="space-y-3 rounded-[4px] border p-3">
            <div className="space-y-1.5">
              <label
                htmlFor={`${mode}-extra-app-name`}
                className="block font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]"
              >
                App name
              </label>
              <Input
                id={`${mode}-extra-app-name`}
                value={name}
                autoFocus
                placeholder="admin"
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setNameTouched(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addApp();
                  }
                  if (event.key === "Escape") resetForm();
                }}
                aria-invalid={nameTouched && nameError !== null}
                className="h-8 font-mono text-[13px]"
              />
              {nameTouched && nameError && (
                <p role="alert" className="font-mono text-[11px] text-destructive leading-[1.5]">
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
                Framework
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXTRA_APP_FRAMEWORKS.map((option) => {
                  const disabledReason = getExtraAppFrontendDisabledReason(stack, option.id);
                  const isSelected = selectedFrontend === option.id;

                  const chip = (
                    <button
                      key={option.id}
                      type="button"
                      disabled={disabledReason !== null}
                      aria-pressed={isSelected}
                      aria-label={`${option.name}${disabledReason ? `. ${disabledReason}` : ""}`}
                      onClick={() => setFrontend(option.id)}
                      className={cn(
                        "builder-focus-ring flex items-center gap-1.5 rounded-[4px] border px-2 py-1 font-mono text-[11px] transition-colors duration-150",
                        disabledReason
                          ? "cursor-not-allowed border-dashed opacity-60"
                          : isSelected
                            ? "border-primary text-fd-foreground"
                            : "text-fd-muted-foreground hover:border-primary/50 hover:text-fd-foreground",
                      )}
                    >
                      {option.icon !== "" && (
                        <TechIcon icon={option.icon} name={option.name} className="h-3 w-3" />
                      )}
                      {option.name}
                    </button>
                  );

                  return disabledReason && isDesktop ? (
                    <Tooltip key={option.id} delay={100}>
                      <TooltipTrigger render={chip} />
                      <TooltipContent side="top" align="start">
                        <p className="max-w-60 text-xs">{disabledReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    chip
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="builder-focus-ring pointer-coarse:min-h-8 flex items-center justify-center rounded-[4px] border px-2 py-1.5 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addApp}
                disabled={!canAdd}
                className={cn(
                  "builder-focus-ring pointer-coarse:min-h-8 flex items-center justify-center gap-1.5 rounded-[4px] border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.10em] transition-colors duration-150",
                  canAdd
                    ? "border-primary text-primary hover:bg-primary/10"
                    : "cursor-not-allowed border-dashed text-fd-muted-foreground opacity-60",
                )}
              >
                <Plus className="h-3 w-3 shrink-0" />
                Add app
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="builder-focus-ring pointer-coarse:min-h-8 flex items-center gap-1.5 rounded-[4px] border border-dashed px-2 py-1.5 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:border-primary/50 hover:text-fd-foreground"
          >
            <Plus className="h-3 w-3 shrink-0" />
            Add app
          </button>
        )}
      </div>
    </section>
  );
}

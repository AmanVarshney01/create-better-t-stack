import { CheckCircle2, InfoIcon, Terminal } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { StackState } from "@/lib/constant";
import { TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import type { TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

import { TechIcon } from "../tech-icon";
import { getCategoryDisplayName, getDisabledReason, isOptionCompatible } from "../utils";

type TechCategoriesProps = {
  mode: "desktop" | "mobile";
  stack: StackState;
  compatibilityNotes: Record<string, { hasIssue: boolean; notes: string[] }>;
  onSelect: (category: keyof typeof TECH_OPTIONS, techId: string) => void;
  showAllCategories?: boolean;
};

function getIsSelected(stack: StackState, category: keyof StackState, techId: string) {
  const currentValue = stack[category];

  if (
    category === "addons" ||
    category === "examples" ||
    category === "webFrontend" ||
    category === "nativeFrontend"
  ) {
    return ((currentValue as string[]) || []).includes(techId);
  }

  return currentValue === techId;
}

export function TechCategories({
  mode,
  stack,
  compatibilityNotes,
  onSelect,
  showAllCategories = false,
}: TechCategoriesProps) {
  const isDesktop = mode === "desktop";
  const categories = showAllCategories ? CATEGORY_ORDER : [CATEGORY_ORDER[0]];

  return (
    <>
      {categories.map((categoryKey) => {
        const categoryOptions = TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
        const categoryDisplayName = getCategoryDisplayName(categoryKey);

        if (categoryOptions.length === 0) return null;

        return (
          <section
            key={`${mode}-${categoryKey}`}
            id={isDesktop ? `section-${categoryKey}` : `section-mobile-${categoryKey}`}
            className={cn("mb-6 scroll-mt-4", isDesktop && "sm:mb-8")}
          >
            <div className="mb-3 flex items-center gap-2 text-fd-muted-foreground">
              <Terminal aria-hidden="true" className="h-3 w-3 shrink-0 text-primary" />
              <h2 className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                {categoryDisplayName.toUpperCase()}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
              {compatibilityNotes[categoryKey]?.hasIssue && (
                <Tooltip delay={100}>
                  <TooltipTrigger
                    render={
                      <InfoIcon className="h-3.5 w-3.5 shrink-0 cursor-help text-fd-muted-foreground transition-colors duration-150 hover:text-fd-foreground" />
                    }
                  />
                  <TooltipContent side="top" align="start">
                    <ul className="list-disc space-y-1 pl-4 text-xs">
                      {compatibilityNotes[categoryKey].notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div
              className={cn(
                "grid gap-2",
                isDesktop ? "grid-cols-1 @md:grid-cols-2 @min-[864px]:grid-cols-3" : "grid-cols-1",
                isDesktop && "auto-rows-fr",
              )}
            >
              {categoryOptions.map((tech) => {
                const category = categoryKey as keyof StackState;
                const isSelected = getIsSelected(stack, category, tech.id);
                const isDisabled = !isOptionCompatible(stack, categoryKey as TechCategory, tech.id);
                const isExperimental = "experimental" in tech && tech.experimental;
                const disabledReason = getDisabledReason(
                  stack,
                  categoryKey as TechCategory,
                  tech.id,
                );

                const card = (
                  <button
                    type="button"
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    aria-pressed={isSelected}
                    aria-label={`${tech.name}${isExperimental ? ". Experimental" : ""}${isDisabled && disabledReason ? `. ${disabledReason}` : ""}`}
                    className={cn(
                      "builder-focus-ring relative h-full w-full rounded-[4px] border p-3 text-left transition-colors duration-150",
                      isSelected
                        ? "border-primary"
                        : isDisabled
                          ? "cursor-not-allowed border-dashed opacity-60"
                          : "hover:border-primary/50",
                    )}
                    onClick={() => {
                      if (isDisabled) {
                        return;
                      }
                      onSelect(categoryKey as keyof typeof TECH_OPTIONS, tech.id);
                    }}
                  >
                    <div className="flex items-start">
                      <div className="min-w-0 grow">
                        <div
                          className={cn(
                            "flex items-center justify-between gap-2",
                            tech.default && !isSelected && "pr-14",
                          )}
                        >
                          <div className="flex min-w-0 items-center">
                            {tech.icon !== "" && (
                              <TechIcon
                                icon={tech.icon}
                                name={tech.name}
                                className={cn(
                                  "mr-1.5 h-4 w-4 shrink-0",
                                  "className" in tech ? tech.className : undefined,
                                )}
                              />
                            )}
                            <span
                              className={cn(
                                "break-words font-mono text-[13px] leading-[1.55]",
                                isSelected ? "text-primary" : "text-fd-foreground",
                              )}
                            >
                              {tech.name}
                            </span>
                            {isExperimental && (
                              <span className="ml-1.5 shrink-0 rounded-[3px] border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 font-mono text-[9px] text-amber-700 uppercase leading-none tracking-[0.08em] dark:text-amber-300">
                                Experimental
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              aria-hidden="true"
                              className="h-3.5 w-3.5 shrink-0 text-primary"
                            />
                          )}
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-fd-muted-foreground leading-[1.5]">
                          {tech.description}
                        </p>
                        {isDesktop ? (
                          <div className="mt-2 min-h-7">
                            {isDisabled && disabledReason ? (
                              <p className="py-1 font-mono text-[10px] text-destructive/90 leading-tight">
                                {disabledReason}
                              </p>
                            ) : (
                              <div aria-hidden className="h-7" />
                            )}
                          </div>
                        ) : (
                          isDisabled &&
                          disabledReason && (
                            <p className="mt-2 py-1 font-mono text-[10px] text-destructive/90 leading-tight">
                              {disabledReason}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                    {tech.default && !isSelected && (
                      <span className="absolute top-2 right-2 ml-2 shrink-0 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
                        Default
                      </span>
                    )}
                  </button>
                );

                if (isDesktop && disabledReason) {
                  return (
                    <Tooltip key={`${mode}-${categoryKey}-${tech.id}`} delay={100}>
                      <TooltipTrigger render={card} />
                      <TooltipContent side="top" align="center" className="max-w-xs">
                        <p className="text-xs">{disabledReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <div key={`${mode}-${categoryKey}-${tech.id}`} className="h-full">
                    {card}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      <div className="h-24" />
    </>
  );
}

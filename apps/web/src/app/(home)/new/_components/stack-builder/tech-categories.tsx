import type React from "react";

import { InfoIcon, Terminal } from "lucide-react";
import { motion } from "motion/react";

import type { StackState } from "@/lib/constant";
import type { TechCategory } from "@/lib/types";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

import { TechIcon } from "../tech-icon";
import { getCategoryDisplayName, getDisabledReason, isOptionCompatible } from "../utils";

type TechCategoriesProps = {
  mode: "desktop" | "mobile";
  stack: StackState;
  compatibilityNotes: Record<string, { hasIssue: boolean; notes: string[] }>;
  onSelect: (category: keyof typeof TECH_OPTIONS, techId: string) => void;
  sectionRefs?: React.MutableRefObject<Record<string, HTMLElement | null>>;
};

function getIsSelected(stack: StackState, category: keyof StackState, techId: string): boolean {
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
  sectionRefs,
}: TechCategoriesProps) {
  const isDesktop = mode === "desktop";

  return (
    <>
      {CATEGORY_ORDER.map((categoryKey) => {
        const categoryOptions = TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
        const categoryDisplayName = getCategoryDisplayName(categoryKey);

        if (categoryOptions.length === 0) return null;

        return (
          <section
            ref={
              isDesktop
                ? (el) => {
                    if (sectionRefs) {
                      sectionRefs.current[categoryKey] = el;
                    }
                  }
                : undefined
            }
            key={`${mode}-${categoryKey}`}
            id={isDesktop ? `section-${categoryKey}` : `section-mobile-${categoryKey}`}
            className={cn("mb-6 scroll-mt-4", isDesktop && "sm:mb-8")}
          >
            <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
              <Terminal className={cn("mr-2 h-4 w-4 shrink-0", isDesktop && "sm:h-5 sm:w-5")} />
              <h2
                className={cn(
                  "font-semibold font-mono text-foreground text-sm",
                  isDesktop && "sm:text-base",
                )}
              >
                {categoryDisplayName}
              </h2>
              {compatibilityNotes[categoryKey]?.hasIssue && (
                <Tooltip delay={100}>
                  <TooltipTrigger
                    render={
                      <InfoIcon className="ml-2 h-4 w-4 shrink-0 cursor-help text-muted-foreground" />
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
                isDesktop
                  ? "grid-cols-1 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-4"
                  : "grid-cols-1",
              )}
            >
              {categoryOptions.map((tech) => {
                const category = categoryKey as keyof StackState;
                const isSelected = getIsSelected(stack, category, tech.id);
                const isDisabled = !isOptionCompatible(stack, categoryKey as TechCategory, tech.id);
                const disabledReason = isDesktop
                  ? getDisabledReason(stack, categoryKey as TechCategory, tech.id)
                  : null;

                const card = (
                  <motion.div
                    className={cn(
                      "relative cursor-pointer rounded border p-3 transition-all",
                      isDesktop && "p-2 sm:p-3",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : isDisabled
                          ? "border-destructive/30 bg-destructive/5 opacity-50"
                          : "border-border bg-fd-background hover:border-muted hover:bg-muted/10",
                      isDesktop && isDisabled && "hover:opacity-75",
                    )}
                    whileHover={isDesktop ? { scale: 1.02 } : undefined}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(categoryKey as keyof typeof TECH_OPTIONS, tech.id)}
                  >
                    <div className="flex items-start">
                      <div className="grow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {tech.icon !== "" && (
                              <TechIcon
                                icon={tech.icon}
                                name={tech.name}
                                className={cn(
                                  "mr-1.5 h-4 w-4",
                                  isDesktop && "h-3 w-3 sm:h-4 sm:w-4",
                                  tech.className,
                                )}
                              />
                            )}
                            <span
                              className={cn(
                                "font-medium text-sm",
                                isDesktop && "text-xs sm:text-sm",
                                isSelected ? "text-primary" : "text-foreground",
                              )}
                            >
                              {tech.name}
                            </span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-muted-foreground text-xs">{tech.description}</p>
                      </div>
                    </div>
                    {tech.default && !isSelected && (
                      <span className="absolute top-1 right-1 ml-2 shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                        Default
                      </span>
                    )}
                  </motion.div>
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

                return <div key={`${mode}-${categoryKey}-${tech.id}`}>{card}</div>;
              })}
            </div>
          </section>
        );
      })}
      <div className="h-10" />
    </>
  );
}

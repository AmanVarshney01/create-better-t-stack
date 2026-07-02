import { X } from "lucide-react";

import type { StackState } from "@/lib/constant";
import { TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import type { TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

import { getBadgeColors } from "../get-badge-color";
import { TechIcon } from "../tech-icon";
import { getCategoryDisplayName } from "../utils";

type SelectedStackBadgesProps = {
  stack: StackState;
  onRemove?: (category: TechCategory, techId: string) => void;
  onJump?: (category: TechCategory) => void;
};

export function SelectedStackBadges({ stack, onRemove, onJump }: SelectedStackBadgesProps) {
  const selections = CATEGORY_ORDER.flatMap((category) => {
    const options = TECH_OPTIONS[category];
    const selectedValue = stack[category as keyof StackState];
    if (!options || selectedValue === undefined) return [];

    const ids = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    return ids
      .filter(
        (id) =>
          id !== "none" &&
          id !== "false" &&
          !(["git", "install", "auth"].includes(category) && id === "true"),
      )
      .flatMap((id) => {
        const tech = options.find((opt) => opt.id === id);
        return tech ? [{ category: category as TechCategory, tech }] : [];
      });
  });

  if (selections.length === 0) {
    return <p className="font-mono text-muted-foreground text-xs">No selections yet</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {selections.map(({ category, tech }) => {
        const categoryLabel = getCategoryDisplayName(category);
        const chipContent = (
          <>
            {tech.icon !== "" && (
              <TechIcon
                icon={tech.icon}
                name={tech.name}
                className={cn("h-3 w-3", tech.className)}
              />
            )}
            {tech.name}
          </>
        );

        return (
          <span
            key={`${category}-${tech.id}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-full pl-2 text-xs",
              getBadgeColors(category),
              onRemove ? "pr-1" : "pr-2",
            )}
          >
            {onJump ? (
              <button
                type="button"
                onClick={() => onJump(category)}
                title={`Go to ${categoryLabel}`}
                className="builder-focus-ring flex items-center gap-1.5 py-0.5"
              >
                {chipContent}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 py-0.5">{chipContent}</span>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(category, tech.id)}
                aria-label={`Remove ${tech.name} from ${categoryLabel}`}
                className="builder-focus-ring rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}

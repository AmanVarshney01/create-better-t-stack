import { X } from "lucide-react";

import type { StackState } from "@/lib/constant";
import type { TechCategory } from "@/lib/types";

import { TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

import { getBadgeColors } from "../get-badge-color";
import { TechIcon } from "../tech-icon";
import { getCategoryDisplayName } from "../utils";

type SelectedStackBadgesProps = {
  stack: StackState;
  onRemove?: (category: TechCategory, techId: string) => void;
};

export function SelectedStackBadges({ stack, onRemove }: SelectedStackBadgesProps) {
  const groupedSelections = CATEGORY_ORDER.map((category) => {
    const categoryKey = category as keyof StackState;
    const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
    const selectedValue = stack[categoryKey];

    if (!options) {
      return null;
    }

    if (Array.isArray(selectedValue)) {
      const selectedTechs = selectedValue
        .filter((id) => id !== "none")
        .map((id) => options.find((opt) => opt.id === id))
        .filter(Boolean);

      if (selectedTechs.length === 0) {
        return null;
      }

      return {
        category: category as TechCategory,
        label: getCategoryDisplayName(category),
        techs: selectedTechs,
      };
    }

    const tech = options.find((opt) => opt.id === selectedValue);
    if (
      !tech ||
      tech.id === "none" ||
      tech.id === "false" ||
      ((category === "git" || category === "install" || category === "auth") && tech.id === "true")
    ) {
      return null;
    }

    return {
      category: category as TechCategory,
      label: getCategoryDisplayName(category),
      techs: [tech],
    };
  }).filter(Boolean);

  if (groupedSelections.length === 0) {
    return <p className="font-mono text-muted-foreground text-xs">No selections yet</p>;
  }

  return (
    <div className="space-y-2">
      {groupedSelections.map((group) => {
        if (!group) {
          return null;
        }

        return (
          <div key={group.category} className="space-y-1">
            <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.techs.map((tech) => {
                if (!tech) {
                  return null;
                }

                const canRemove = typeof onRemove === "function";
                const chipClasses = cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs",
                  getBadgeColors(group.category),
                  canRemove && "builder-focus-ring cursor-pointer pr-1 hover:brightness-95",
                );

                if (!canRemove) {
                  return (
                    <span key={`${group.category}-${tech.id}`} className={chipClasses}>
                      {tech.icon !== "" && (
                        <TechIcon
                          icon={tech.icon}
                          name={tech.name}
                          className={cn("h-3 w-3", tech.className)}
                        />
                      )}
                      {tech.name}
                    </span>
                  );
                }

                return (
                  <button
                    key={`${group.category}-${tech.id}`}
                    type="button"
                    className={chipClasses}
                    onClick={() => onRemove(group.category, tech.id)}
                    aria-label={`Remove ${tech.name} from ${group.label}`}
                  >
                    {tech.icon !== "" && (
                      <TechIcon
                        icon={tech.icon}
                        name={tech.name}
                        className={cn("h-3 w-3", tech.className)}
                      />
                    )}
                    {tech.name}
                    <span className="rounded-full p-0.5 hover:bg-muted">
                      <X className="h-2.5 w-2.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

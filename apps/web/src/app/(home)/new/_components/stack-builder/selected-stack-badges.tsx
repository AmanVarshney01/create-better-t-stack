import type { StackState } from "@/lib/constant";

import { TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

import { getBadgeColors } from "../get-badge-color";
import { TechIcon } from "../tech-icon";

type SelectedStackBadgesProps = {
  stack: StackState;
};

export function SelectedStackBadges({ stack }: SelectedStackBadgesProps) {
  return (
    <>
      {CATEGORY_ORDER.flatMap((category) => {
        const categoryKey = category as keyof StackState;
        const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
        const selectedValue = stack[categoryKey];

        if (!options) {
          return [];
        }

        if (Array.isArray(selectedValue)) {
          if (
            selectedValue.length === 0 ||
            (selectedValue.length === 1 && selectedValue[0] === "none")
          ) {
            return [];
          }

          return selectedValue
            .filter((id) => id !== "none")
            .map((id) => {
              const tech = options.find((opt) => opt.id === id);
              if (!tech) {
                return null;
              }

              return (
                <span
                  key={`${category}-${tech.id}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
                    getBadgeColors(category),
                  )}
                >
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
            })
            .filter(Boolean);
        }

        const tech = options.find((opt) => opt.id === selectedValue);
        if (
          !tech ||
          tech.id === "none" ||
          tech.id === "false" ||
          ((category === "git" || category === "install" || category === "auth") &&
            tech.id === "true")
        ) {
          return [];
        }

        return (
          <span
            key={`${category}-${tech.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors(category),
            )}
          >
            <TechIcon icon={tech.icon} name={tech.name} className="h-3 w-3" />
            {tech.name}
          </span>
        );
      })}
    </>
  );
}

import { X } from "lucide-react";

import type { StackState } from "@/lib/constant";
import { TECH_OPTIONS } from "@/lib/constant";
import { EXTRA_APP_FRAMEWORKS, parseExtraApp } from "@/lib/extra-apps";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import type { TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

import { TechIcon } from "../tech-icon";
import { getCategoryDisplayName } from "../utils";

type SelectedStackBadgesProps = {
  stack: StackState;
  onRemove?: (category: TechCategory, techId: string) => void;
  onJump?: (category: TechCategory) => void;
  onRemoveApp?: (name: string) => void;
  onJumpToApps?: () => void;
};

export function SelectedStackBadges({
  stack,
  onRemove,
  onJump,
  onRemoveApp,
  onJumpToApps,
}: SelectedStackBadgesProps) {
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

  const extraApps = stack.apps.flatMap((encoded) => {
    const app = parseExtraApp(encoded);
    if (!app) return [];
    const option = EXTRA_APP_FRAMEWORKS.find((candidate) => candidate.id === app.frontend);
    return option ? [{ ...app, option }] : [];
  });

  if (selections.length === 0 && extraApps.length === 0) {
    return (
      <p className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
        No selections yet
      </p>
    );
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
                className={cn("h-3 w-3", "className" in tech ? tech.className : undefined)}
              />
            )}
            {tech.name}
            {"experimental" in tech && tech.experimental && (
              <span className="rounded-[3px] bg-amber-500/10 px-1 py-0.5 text-[9px] text-amber-700 uppercase leading-none tracking-[0.08em] dark:text-amber-300">
                Experimental
              </span>
            )}
          </>
        );

        return (
          <span
            key={`${category}-${tech.id}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-[4px] border pl-2 font-mono text-[11px] text-fd-foreground",
              onRemove ? "pr-1" : "pr-2",
            )}
          >
            {onJump ? (
              <button
                type="button"
                onClick={() => onJump(category)}
                title={`Go to ${categoryLabel}`}
                className="builder-focus-ring pointer-coarse:py-1.5 flex items-center gap-1.5 py-0.5 transition-colors duration-150 hover:text-primary"
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
                className="builder-focus-ring pointer-coarse:p-2 p-0.5 text-fd-muted-foreground transition-colors duration-150 hover:text-destructive"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </span>
        );
      })}
      {extraApps.map((app) => {
        const chipContent = (
          <>
            {app.option.icon !== "" && (
              <TechIcon icon={app.option.icon} name={app.option.name} className="h-3 w-3" />
            )}
            {`apps/${app.name}`}
          </>
        );
        const hoverTitle = `Extra app: ${app.name} — ${app.option.name}`;

        return (
          <span
            key={`extra-app-${app.name}`}
            title={onJumpToApps ? undefined : hoverTitle}
            className={cn(
              "inline-flex items-center gap-1 rounded-[4px] border pl-2 font-mono text-[11px] text-fd-foreground",
              onRemoveApp ? "pr-1" : "pr-2",
            )}
          >
            {onJumpToApps ? (
              <button
                type="button"
                onClick={onJumpToApps}
                title={hoverTitle}
                className="builder-focus-ring pointer-coarse:py-1.5 flex items-center gap-1.5 py-0.5 transition-colors duration-150 hover:text-primary"
              >
                {chipContent}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 py-0.5">{chipContent}</span>
            )}
            {onRemoveApp && (
              <button
                type="button"
                onClick={() => onRemoveApp(app.name)}
                aria-label={`Remove extra app ${app.name}`}
                className="builder-focus-ring pointer-coarse:p-2 p-0.5 text-fd-muted-foreground transition-colors duration-150 hover:text-destructive"
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

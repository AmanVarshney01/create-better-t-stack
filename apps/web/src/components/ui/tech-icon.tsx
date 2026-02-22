"use client";

import { computeSiUrl, getInvertClass, ICON_REGISTRY } from "@/lib/tech-icons";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface TechIconProps {
  /** Preferred: look up colour-aware config from the registry */
  techId?: string;
  /** Fallback: raw icon value from constant.ts (URL, path, or emoji) */
  icon?: string;
  name: string;
  className?: string;
}

export function TechIcon({ techId, icon, name, className }: TechIconProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (techId) {
    const config = ICON_REGISTRY[techId];
    if (config) {
      if (config.type === "si") {
        return (
          <img
            src={computeSiUrl(config.slug, config.hex, isDark)}
            alt={`${name} icon`}
            width={20}
            height={20}
            className={cn("inline-block", className)}
          />
        );
      }
      // local
      return (
        <img
          src={config.src}
          alt={`${name} icon`}
          width={20}
          height={20}
          className={cn("inline-block", getInvertClass(config.needsInvert), className)}
        />
      );
    }
  }

  // ── Fallback: legacy icon prop ─────────────────────────────────────────────
  if (!icon) return null;

  if (icon.startsWith("https://") || icon.startsWith("/")) {
    return (
      <img
        src={icon}
        alt={`${name} icon`}
        width={20}
        height={20}
        className={cn("inline-block", className)}
      />
    );
  }

  // Text / emoji
  return <span className={cn("inline-flex items-center text-lg", className)}>{icon}</span>;
}

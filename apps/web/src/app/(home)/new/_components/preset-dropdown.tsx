"use client";

import { ChevronDown, Zap } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRESET_TEMPLATES } from "@/lib/constant";
import { generateStackSummary } from "@/lib/stack-utils";

type PresetDropdownProps = {
  onApplyPreset: (presetId: string) => void;
};

export function PresetDropdown({ onApplyPreset }: PresetDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="builder-focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-md bg-muted/20 px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-colors hover:bg-muted/35 hover:text-foreground"
          />
        }
      >
        <Zap className="h-3 w-3" />
        Presets
        <ChevronDown className="ml-auto h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-fd-background">
        {PRESET_TEMPLATES.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className="flex flex-col items-start gap-1 p-3"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="font-medium text-sm">{preset.name}</div>
              <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                Preset
              </span>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">{preset.description}</div>
            <div className="line-clamp-1 w-full font-mono text-[10px] text-primary uppercase tracking-wide">
              {generateStackSummary(preset.stack)}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

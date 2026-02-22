"use client";

import { Zap } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRESET_TEMPLATES } from "@/lib/constant";

interface PresetDropdownProps {
  onApplyPreset: (presetId: string) => void;
}

export function PresetDropdown({ onApplyPreset }: PresetDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 text-muted-foreground transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
          />
        }
      >
        <Zap className="h-3.5 w-3.5" />
        <span className="font-pixel text-[9px] leading-none">Presets</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-fd-background">
        {PRESET_TEMPLATES.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className="flex flex-col items-start gap-1 p-3"
          >
            <div className="font-pixel text-xs">{preset.name}</div>
            <div className="text-xs text-muted-foreground">{preset.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

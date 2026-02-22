"use client";

import { Download, RefreshCw, Shuffle, Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  onReset: () => void;
  onRandom: () => void;
  onSave: () => void;
  onLoad: () => void;
  hasSavedStack: boolean;
}

const btnBase =
  "flex flex-col items-center justify-center gap-1 rounded-md border border-border bg-fd-background py-2 text-muted-foreground transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground";

export function ActionButtons({
  onReset,
  onRandom,
  onSave,
  onLoad,
  hasSavedStack,
}: ActionButtonsProps) {
  return (
    <div className={cn("grid gap-1", hasSavedStack ? "grid-cols-4" : "grid-cols-3")}>
      <button type="button" onClick={onReset} title="Reset to defaults" className={btnBase}>
        <RefreshCw className="h-3.5 w-3.5" />
        <span className="font-pixel text-[9px] leading-none">Reset</span>
      </button>

      <button type="button" onClick={onRandom} title="Generate a random stack" className={btnBase}>
        <Shuffle className="h-3.5 w-3.5" />
        <span className="font-pixel text-[9px] leading-none">Random</span>
      </button>

      <button type="button" onClick={onSave} title="Save current stack" className={btnBase}>
        <Star className="h-3.5 w-3.5" />
        <span className="font-pixel text-[9px] leading-none">Save</span>
      </button>

      {hasSavedStack && (
        <button type="button" onClick={onLoad} title="Load saved stack" className={btnBase}>
          <Download className="h-3.5 w-3.5" />
          <span className="font-pixel text-[9px] leading-none">Load</span>
        </button>
      )}
    </div>
  );
}

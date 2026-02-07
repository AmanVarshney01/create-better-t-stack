"use client";

import { RefreshCw, Settings, Shuffle, Star } from "lucide-react";

interface ActionButtonsProps {
  onReset: () => void;
  onRandom: () => void;
  onSave: () => void;
  onLoad: () => void;
  hasSavedStack: boolean;
}

export function ActionButtons({
  onReset,
  onRandom,
  onSave,
  onLoad,
  hasSavedStack,
}: ActionButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">Actions</p>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onRandom}
          className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-md bg-primary/15 px-2 py-1.5 font-mono font-medium text-primary text-xs transition-colors hover:bg-primary/22"
          title="Generate a random stack"
        >
          <Shuffle className="h-3 w-3" />
          Randomize
        </button>
        <button
          type="button"
          onClick={onSave}
          className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-md bg-primary/15 px-2 py-1.5 font-mono font-medium text-primary text-xs transition-colors hover:bg-primary/22"
          title="Save current preferences"
        >
          <Star className="h-3 w-3" />
          Save
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onReset}
          className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-md bg-muted/20 px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-colors hover:bg-muted/35 hover:text-foreground"
          title="Reset to defaults"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </button>
        {hasSavedStack ? (
          <button
            type="button"
            onClick={onLoad}
            className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-md bg-muted/20 px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-colors hover:bg-muted/35 hover:text-foreground"
            title="Load saved preferences"
          >
            <Settings className="h-3 w-3" />
            Load
          </button>
        ) : (
          <div className="rounded-md bg-muted/15 px-2 py-1.5 text-center font-mono text-[11px] text-muted-foreground">
            No saved stack
          </div>
        )}
      </div>
    </div>
  );
}

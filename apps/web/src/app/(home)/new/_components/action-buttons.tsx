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
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onReset}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
        title="Reset to defaults"
      >
        <RefreshCw className="h-3 w-3" />
        Reset
      </button>
      <button
        type="button"
        onClick={onRandom}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
        title="Generate a random stack"
      >
        <Shuffle className="h-3 w-3" />
        Random
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
        title="Save current preferences"
      >
        <Star className="h-3 w-3" />
        Save
      </button>
      {hasSavedStack && (
        <button
          type="button"
          onClick={onLoad}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
          title="Load saved preferences"
        >
          <Settings className="h-3 w-3" />
          Load
        </button>
      )}
    </div>
  );
}

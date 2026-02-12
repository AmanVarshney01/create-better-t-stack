"use client";

import { Share2 } from "lucide-react";

import type { StackState } from "@/lib/constant";

import { ShareDialog } from "@/components/ui/share-dialog";

interface ShareButtonProps {
  stackUrl: string;
  stackState: StackState;
}

export function ShareButton({ stackUrl, stackState }: ShareButtonProps) {
  return (
    <ShareDialog stackUrl={stackUrl} stackState={stackState}>
      <button
        type="button"
        className="builder-focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-md bg-muted/20 px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-colors hover:bg-muted/35 hover:text-foreground"
        title="Share your stack"
      >
        <Share2 className="h-3 w-3" />
        Share
      </button>
    </ShareDialog>
  );
}

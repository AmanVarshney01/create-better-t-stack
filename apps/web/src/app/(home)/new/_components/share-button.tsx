"use client";

import { Share2 } from "lucide-react";

import { ShareDialog } from "@/components/ui/share-dialog";
import type { StackState } from "@/lib/constant";

interface ShareButtonProps {
  stackUrl: string;
  stackState: StackState;
}

export function ShareButton({ stackUrl, stackState }: ShareButtonProps) {
  return (
    <ShareDialog stackUrl={stackUrl} stackState={stackState}>
      <button
        type="button"
        className="builder-focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary/15 px-2 py-1.5 font-mono font-medium text-primary text-xs transition-colors hover:bg-primary/22"
        title="Share your stack"
      >
        <Share2 className="h-3 w-3" />
        Share
      </button>
    </ShareDialog>
  );
}

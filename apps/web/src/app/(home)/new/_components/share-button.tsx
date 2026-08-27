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
    <ShareDialog stackUrl={stackUrl} stackState={stackState} page="builder">
      <button
        type="button"
        className="builder-focus-ring pointer-coarse:min-h-8 flex flex-1 items-center justify-center gap-1.5 rounded-[4px] border px-2 py-1.5 font-mono text-[10px] text-primary uppercase tracking-[0.10em] transition-colors duration-150 hover:border-primary"
        title="Share your stack"
      >
        <Share2 className="h-3 w-3" />
        Share
      </button>
    </ShareDialog>
  );
}

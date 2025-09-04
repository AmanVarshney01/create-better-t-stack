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
				className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
				title="Share your stack"
			>
				<Share2 className="h-3 w-3" />
				Share
			</button>
		</ShareDialog>
	);
}

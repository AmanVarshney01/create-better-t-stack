"use client";

import { Check, Copy, Edit, Share2, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShareDialog } from "@/components/ui/share-dialog";
import { TechBadge } from "@/components/ui/tech-badge";
import { type StackState, TECH_OPTIONS } from "@/lib/constant";
import type { LoadedStackState } from "@/lib/stack-url-state";
import {
	CATEGORY_ORDER,
	generateStackCommand,
	generateStackSharingUrl,
	generateStackSummary,
	generateStackUrlFromState,
} from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

interface StackDisplayProps {
	stackState: LoadedStackState;
}

export function StackDisplay({ stackState }: StackDisplayProps) {
	const [copied, setCopied] = useState(false);
	const [stackUrl, setStackUrl] = useState<string>("");
	const [editUrl, setEditUrl] = useState<string>("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setStackUrl(generateStackSharingUrl(stackState, window.location.origin));
			setEditUrl(generateStackUrlFromState(stackState, window.location.origin));
		}
	}, [stackState]);

	const stack = stackState;
	const stackSummary = generateStackSummary(stack);

	const command = generateStackCommand(stackState);

	const techBadges = (() => {
		const badges: React.ReactNode[] = [];
		for (const category of CATEGORY_ORDER) {
			const categoryKey = category as keyof StackState;
			const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
			const selectedValue = stack[categoryKey];

			if (!options) continue;

			if (Array.isArray(selectedValue)) {
				if (
					selectedValue.length === 0 ||
					(selectedValue.length === 1 && selectedValue[0] === "none")
				) {
					continue;
				}

				for (const id of selectedValue) {
					if (id === "none") continue;
					const tech = options.find((opt) => opt.id === id);
					if (tech) {
						badges.push(
							<TechBadge
								key={`${category}-${tech.id}`}
								icon={tech.icon}
								name={tech.name}
								category={category}
							/>,
						);
					}
				}
			} else {
				const tech = options.find((opt) => opt.id === selectedValue);
				if (
					!tech ||
					tech.id === "none" ||
					tech.id === "false" ||
					((category === "git" ||
						category === "install" ||
						category === "auth") &&
						tech.id === "true")
				) {
					continue;
				}
				badges.push(
					<TechBadge
						key={`${category}-${tech.id}`}
						icon={tech.icon}
						name={tech.name}
						category={category}
					/>,
				);
			}
		}
		return badges;
	})();

	const copyCommand = async () => {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			toast.success("Command copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy command");
		}
	};

	return (
		<main className="mx-auto min-h-svh max-w-[1280px]">
			<div className="mx-auto flex flex-col gap-8 px-4 pt-12">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
					<div className="flex items-center gap-2">
						<Terminal className="h-5 w-5 text-primary" />
						<span className="font-bold text-lg sm:text-xl">
							STACK_DISPLAY.SH
						</span>
					</div>
					<div className="hidden h-px flex-1 bg-border sm:block" />
					<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
						[{techBadges.length} DEPENDENCIES]
					</span>
				</div>

				<div className="space-y-2 rounded border border-border bg-muted/20 p-4">
					<div className="flex items-center gap-2 text-sm">
						<span className="text-primary">$</span>
						<span className="text-foreground">./display_stack --summary</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<span className="text-primary">&gt;</span>
						<span className="text-muted-foreground">{stackSummary}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<span className="text-primary">$</span>
						<span className="text-muted-foreground">
							Stack loaded successfully
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Link href={editUrl}>
						<button
							type="button"
							className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 font-mono text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
						>
							<Edit className="h-3 w-3" />
							<span>./edit --stack</span>
						</button>
					</Link>

					<ShareDialog stackUrl={stackUrl} stackState={stackState}>
						<button
							type="button"
							className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 font-mono text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
						>
							<Share2 className="h-3 w-3" />
							<span>./share --config</span>
						</button>
					</ShareDialog>
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-mono font-semibold text-foreground text-sm">
							GENERATE_COMMAND
						</span>
					</div>

					<div className="flex items-center justify-between rounded border border-border bg-muted/20 p-3">
						<div className="flex items-center gap-2 font-mono text-sm">
							<span className="text-primary">$</span>
							<span className="text-foreground">{command}</span>
						</div>
						<button
							type="button"
							onClick={copyCommand}
							className={cn(
								"flex items-center gap-1 rounded border px-2 py-1 font-mono text-xs transition-colors",
								copied
									? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
									: "border-border hover:bg-muted/10",
							)}
						>
							{copied ? (
								<Check className="h-3 w-3" />
							) : (
								<Copy className="h-3 w-3" />
							)}
							{copied ? "COPIED!" : "COPY"}
						</button>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-mono font-semibold text-foreground text-sm">
							DEPENDENCIES ({techBadges.length})
						</span>
					</div>

					{techBadges.length > 0 ? (
						<div className="flex flex-wrap gap-3">{techBadges}</div>
					) : (
						<div className="flex items-center gap-2 text-muted-foreground">
							<span className="text-primary">$</span>
							<span>No technologies selected</span>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}

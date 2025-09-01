"use client";

import { Check, ChevronDown, Copy, Edit, Share2, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareDialog } from "@/components/ui/share-dialog";
import { TechBadge } from "@/components/ui/tech-badge";
import { type StackState, TECH_OPTIONS } from "@/lib/constant";
import type { LoadedStackState } from "@/lib/stack-server";
import {
	CATEGORY_ORDER,
	generateStackSummary,
	generateStackUrl,
} from "@/lib/stack-utils";
import { cn } from "@/lib/utils";
import PackageIcon from "../../_components/icons";

interface StackDisplayProps {
	stackState: LoadedStackState;
}

export function StackDisplay({ stackState }: StackDisplayProps) {
	const pathname = usePathname();
	const searchParamsHook = useSearchParams();
	const [copied, setCopied] = useState(false);
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");

	const stackUrl = generateStackUrl(pathname, searchParamsHook);
	const stack = stackState;
	const stackSummary = generateStackSummary(stack);

	const commands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	const command = commands[selectedPM];

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
				<div className="mb-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div className="space-y-2">
							<h1 className="font-bold text-4xl text-foreground">Tech Stack</h1>
							<p className="text-lg text-muted-foreground">{stackSummary}</p>
						</div>

						<div className="flex items-center gap-3">
							<Link href={`/new?${searchParamsHook.toString()}`}>
								<Button variant="outline" size="sm">
									<Edit className="h-4 w-4" />
									Edit Stack
								</Button>
							</Link>

							<ShareDialog stackUrl={stackUrl} stackState={stackState}>
								<Button variant="outline" size="sm">
									<Share2 className="h-4 w-4" />
									Share
								</Button>
							</ShareDialog>
						</div>
					</div>
				</div>

				<div className="mb-8">
					<div className="rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">GENERATE_COMMAND</span>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted/10"
									>
										<PackageIcon pm={selectedPM} className="h-3 w-3" />
										<span>{selectedPM.toUpperCase()}</span>
										<ChevronDown className="h-3 w-3" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{(["bun", "pnpm", "npm"] as const).map((pm) => (
										<DropdownMenuItem
											key={pm}
											onClick={() => setSelectedPM(pm)}
											className={cn(
												"flex items-center gap-2",
												selectedPM === pm && "bg-accent text-background",
											)}
										>
											<PackageIcon pm={pm} className="h-3 w-3" />
											<span>{pm.toUpperCase()}</span>
											{selectedPM === pm && (
												<Check className="ml-auto h-3 w-3 text-background" />
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="flex items-center justify-between rounded border border-border p-3">
							<div className="flex items-center gap-2 font-mono text-sm">
								<span className="text-primary">$</span>
								<span className="text-foreground">{command}</span>
							</div>
							<button
								type="button"
								onClick={copyCommand}
								className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-muted/10"
							>
								{copied ? (
									<Check className="h-3 w-3 text-primary" />
								) : (
									<Copy className="h-3 w-3" />
								)}
								{copied ? "COPIED!" : "COPY"}
							</button>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="font-semibold text-2xl text-foreground">
						Technologies
					</h2>
					<div className="flex flex-wrap gap-3">
						{techBadges.length > 0 ? (
							techBadges
						) : (
							<p className="text-muted-foreground">No technologies selected</p>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

"use client";
import { Check, ChevronDown, ChevronRight, Copy, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import PackageIcon from "./icons";

export default function CommandSection() {
	const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");

	const commands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	const copyCommand = (command: string, packageManager: string) => {
		navigator.clipboard.writeText(command);
		setCopiedCommand(packageManager);
		setTimeout(() => setCopiedCommand(null), 2000);
	};

	return (
		<div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div className="flex h-full flex-col justify-between rounded border border-border p-4">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Terminal className="h-4 w-4 text-primary" />
						<span className="font-semibold text-sm">CLI_COMMAND</span>
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

				<div className="space-y-3">
					<div className="flex items-center justify-between rounded border border-border p-3">
						<div className="flex items-center gap-2 font-mono text-sm">
							<span className="text-primary">$</span>
							<span className="text-foreground">{commands[selectedPM]}</span>
						</div>
						<button
							type="button"
							onClick={() => copyCommand(commands[selectedPM], selectedPM)}
							className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-muted/10"
						>
							{copiedCommand === selectedPM ? (
								<Check className="h-3 w-3 text-primary" />
							) : (
								<Copy className="h-3 w-3" />
							)}
							{copiedCommand === selectedPM ? "COPIED!" : "COPY"}
						</button>
					</div>
				</div>
			</div>

			<Link href="/new">
				<div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
							<span className="font-semibold text-sm">STACK_BUILDER</span>
						</div>
						<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
							INTERACTIVE
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between rounded border border-border p-3">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">⚡</span>
								<span className="text-foreground">
									Interactive configuration wizard
								</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								START
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}

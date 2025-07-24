"use client";
import { Check, ClipboardCopy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PackageIcon from "./icons";

const CodeContainer = () => {
	const [selectedPM, setSelectedPM] = useState<"npm" | "yarn" | "pnpm" | "bun">("bun");
	const [copied, setCopied] = useState(false);

	const commands = {
		npm: "npx create-better-t-stack@latest",
		yarn: "yarn create better-t-stack",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	const copyToClipboard = async () => {
		if (copied) return;
		await navigator.clipboard.writeText(commands[selectedPM]);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const packageManagers: Array<"npm" | "yarn" | "pnpm" | "bun"> = ["bun", "pnpm", "yarn", "npm"];

	return (
		<div className="mx-auto mt-6 w-full max-w-3xl px-2 md:px-0">
			<div className="overflow-hidden rounded-lg border border-border bg-muted/30 shadow-sm">
				<div className="flex items-center justify-between border-border border-b bg-muted/50 px-4 py-2">
					<span className="text-muted-foreground text-xs">
						Package manager:
					</span>
					<div className="flex items-center rounded-md border border-border p-0.5">
						{packageManagers.map((pm) => (
							<button
								type="button"
								key={pm}
								onClick={() => setSelectedPM(pm)}
								className={cn(
									"flex items-center gap-1.5 rounded-[5px] px-2.5 py-1 text-xs transition-colors duration-150",
									selectedPM === pm
										? "bg-primary/10 text-primary shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<PackageIcon pm={pm} className="size-3.5" />
								{pm}
							</button>
						))}
					</div>
				</div>

				<div className="relative p-4 text-sm">
					<div className="flex items-center gap-2 overflow-x-auto pb-1">
						<span className="select-none text-muted-foreground">$</span>
						<code className="whitespace-pre text-foreground">
							{commands[selectedPM]}
						</code>
					</div>

					<div className="absolute top-3 right-3">
						<motion.button
							type="button"
							onClick={copyToClipboard}
							className={cn(
								"flex h-7 w-7 items-center justify-center rounded border text-muted-foreground transition-all duration-150 hover:border-border hover:bg-muted hover:text-foreground",
								copied
									? "border-chart-4/50 bg-chart-4/10 text-chart-4"
									: "border-border",
							)}
							aria-label={copied ? "Copied" : "Copy command"}
							whileTap={{ scale: 0.9 }}
						>
							<AnimatePresence mode="wait" initial={false}>
								{copied ? (
									<motion.div
										key="check"
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.5, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Check className="size-4" />
									</motion.div>
								) : (
									<motion.div
										key="copy"
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.5, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<ClipboardCopy className="size-4" />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CodeContainer;

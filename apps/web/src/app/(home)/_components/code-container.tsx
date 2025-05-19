"use client";
import { cn } from "@/lib/utils";
import { Check, ClipboardCopy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import PackageIcon from "./icons";

const CodeContainer = () => {
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");
	const [copied, setCopied] = useState(false);
	const [, setShowCursor] = useState(true);
	const [step, setStep] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => setShowCursor((p) => !p), 500);
		return () => clearInterval(interval);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setStep(0);
		const initialTimer = setTimeout(() => setStep(1), 1000);

		return () => clearTimeout(initialTimer);
	}, [selectedPM]);

	useEffect(() => {
		if (step > 0 && step < 5) {
			const timer = setTimeout(() => setStep((s) => s + 1), 400);
			return () => clearTimeout(timer);
		}
	}, [step]);

	const commands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	const runCommands = {
		npm: "npm run dev",
		pnpm: "pnpm dev",
		bun: "bun dev",
	};

	const copyToClipboard = async () => {
		if (copied) return;
		await navigator.clipboard.writeText(commands[selectedPM]);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const packageManagers: Array<"npm" | "pnpm" | "bun"> = ["bun", "pnpm", "npm"];

	return (
		<div className="mx-auto mt-6 w-full max-w-3xl px-2 font-mono md:px-0">
			<div className="overflow-hidden rounded-lg border border-border bg-muted/30 shadow-sm">
				<div className="flex items-center justify-between border-border border-b bg-muted/50 px-4 py-2">
					<span className="text-muted-foreground text-xs">
						Choose your package manager:
					</span>
					<div className="flex items-center rounded-md border border-border bg-background p-0.5">
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

				<div className="relative bg-background p-4 text-sm">
					<div className="flex items-center gap-2 overflow-x-auto pb-1">
						<span className="select-none text-muted-foreground">$</span>
						<code className="whitespace-pre text-foreground">
							{commands[selectedPM]}
						</code>
						{step === 0 && (
							<motion.span
								key="cursor-command"
								initial={{ opacity: 0 }}
								animate={{ opacity: [0, 1, 1, 0] }}
								transition={{
									duration: 1,
									repeat: Number.POSITIVE_INFINITY,
									repeatDelay: 0,
									ease: "linear",
								}}
								className="ml-0.5 inline-block h-4 w-2 flex-shrink-0 bg-foreground"
								aria-hidden="true"
							/>
						)}
					</div>

					<div className="absolute top-3 right-3">
						<motion.button
							type="button"
							onClick={copyToClipboard}
							className={cn(
								"flex h-7 w-7 items-center justify-center rounded border bg-background text-muted-foreground transition-all duration-150 hover:border-border hover:bg-muted hover:text-foreground",
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

				<AnimatePresence>
					{step > 0 && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{
								height: "auto",
								opacity: 1,
								transition: {
									height: { duration: 0.3 },
									opacity: { duration: 0.2, delay: 0.1 },
								},
							}}
							exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
							className="overflow-hidden border-border border-t bg-background/70 px-4 pt-3 pb-4"
						>
							<div className="space-y-1 text-muted-foreground text-xs">
								{step >= 1 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										Creating a new Better-T-Stack project...
									</motion.div>
								)}

								{step >= 2 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.1 }}
										className="pt-1"
									>
										<div>
											<span className="inline-block w-20">Project:</span>
											<span className="text-foreground/90">my-app</span>
										</div>
										<div>
											<span className="inline-block w-20">Frontend:</span>
											<span className="text-foreground/90">React Web</span>
										</div>
										<div>
											<span className="inline-block w-20">Backend:</span>
											<span className="text-foreground/90">Hono</span>
										</div>
										<div>
											<span className="inline-block w-20">Database:</span>
											<span className="text-foreground/90">
												SQLite + Drizzle
											</span>
										</div>
									</motion.div>
								)}

								{step >= 3 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.2 }}
										className="flex items-center gap-1.5 pt-1"
									>
										<Check className="size-3 flex-shrink-0 text-green-500" />
										<span>Creating project structure</span>
									</motion.div>
								)}

								{step >= 4 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.3 }}
										className="flex items-center gap-1.5"
									>
										<Check className="size-3 flex-shrink-0 text-green-500" />
										<span>Installing dependencies</span>
									</motion.div>
								)}

								{step >= 5 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.4 }}
										className="!mt-3 border-green-500 border-l-2 bg-muted/50 py-2 pl-3"
									>
										<span className="block font-medium text-foreground">
											{" "}
											Project created successfully! Run:
										</span>
										<div className="mt-1 flex flex-wrap items-center gap-1.5">
											<code className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">
												cd my-app
											</code>
											<span className="text-muted-foreground">&amp;&amp;</span>
											<code className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">
												{runCommands[selectedPM]}
											</code>
										</div>
									</motion.div>
								)}

								{step >= 5 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.5 }}
										className="!mt-3 flex items-center gap-2"
									>
										<span className="select-none text-muted-foreground">$</span>
										<motion.span
											key="cursor-done"
											initial={{ opacity: 0 }}
											animate={{ opacity: [0, 1, 1, 0] }}
											transition={{
												duration: 1,
												repeat: Number.POSITIVE_INFINITY,
												repeatDelay: 0,
												ease: "linear",
											}}
											className="inline-block h-3.5 w-2 flex-shrink-0 bg-foreground"
											aria-hidden="true"
										/>
									</motion.div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="border-border border-t bg-muted/50 px-4 py-2 text-muted-foreground text-xs" />
			</div>
		</div>
	);
};

export default CodeContainer;

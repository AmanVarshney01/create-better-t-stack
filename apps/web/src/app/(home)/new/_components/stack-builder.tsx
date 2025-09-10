"use client";

import {
	Check,
	ChevronDown,
	ClipboardCopy,
	InfoIcon,
	Settings,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { startTransition, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DEFAULT_STACK,
	PRESET_TEMPLATES,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import { useStackState } from "@/lib/stack-url-state.client";
import {
	CATEGORY_ORDER,
	generateStackCommand,
	generateStackSharingUrl,
} from "@/lib/stack-utils";
import { cn } from "@/lib/utils";
import { ActionButtons } from "./action-buttons";
import { getBadgeColors } from "./get-badge-color";
import { PresetDropdown } from "./preset-dropdown";
import { ShareButton } from "./share-button";
import { TechIcon } from "./tech-icon";
import {
	analyzeStackCompatibility,
	getCategoryDisplayName,
	getDisabledReason,
	isOptionCompatible,
	validateProjectName,
} from "./utils";
import { YoloToggle } from "./yolo-toggle";

const StackBuilder = () => {
	const [stack, setStack] = useStackState();

	const [command, setCommand] = useState("");
	const [copied, setCopied] = useState(false);
	const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
	const [, setLastChanges] = useState<
		Array<{ category: string; message: string }>
	>([]);

	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
	const contentRef = useRef<HTMLDivElement>(null);
	const lastAppliedStackString = useRef<string>("");

	const compatibilityAnalysis = analyzeStackCompatibility(stack);

	const projectNameError = validateProjectName(stack.projectName || "");

	const formatProjectName = (name: string): string => {
		return name.replace(/\s+/g, "-");
	};

	const getStackUrl = (): string => {
		const stackToUse = compatibilityAnalysis.adjustedStack || stack;
		const projectName = stackToUse.projectName || "my-better-t-app";
		const formattedProjectName = formatProjectName(projectName);
		const stackWithProjectName = {
			...stackToUse,
			projectName: formattedProjectName,
		};
		return generateStackSharingUrl(stackWithProjectName);
	};

	const getRandomStack = () => {
		const randomStack: Partial<StackState> = {};
		for (const category of CATEGORY_ORDER) {
			const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS] || [];
			if (options.length === 0) continue;
			const catKey = category as keyof StackState;
			if (
				catKey === "webFrontend" ||
				catKey === "nativeFrontend" ||
				catKey === "addons" ||
				catKey === "examples"
			) {
				if (catKey === "webFrontend" || catKey === "nativeFrontend") {
					const randomIndex = Math.floor(Math.random() * options.length);
					const selectedOption = options[randomIndex].id;
					randomStack[catKey as "webFrontend" | "nativeFrontend"] = [
						selectedOption,
					];
				} else {
					const numToPick = Math.floor(
						Math.random() * Math.min(options.length, 4),
					);
					if (numToPick === 0) {
						randomStack[catKey as "addons" | "examples"] = ["none"];
					} else {
						const shuffledOptions = [...options]
							.filter((opt) => opt.id !== "none")
							.sort(() => 0.5 - Math.random())
							.slice(0, numToPick);
						randomStack[catKey as "addons" | "examples"] = shuffledOptions.map(
							(opt) => opt.id,
						);
					}
				}
			} else {
				const randomIndex = Math.floor(Math.random() * options.length);
				(randomStack[catKey] as string) = options[randomIndex].id;
			}
		}
		startTransition(() => {
			setStack({
				...(randomStack as StackState),
				projectName: stack.projectName || "my-better-t-app",
			});
		});
		contentRef.current?.scrollTo(0, 0);
	};

	const selectedBadges = (() => {
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
							<span
								key={`${category}-${tech.id}`}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
									getBadgeColors(category),
								)}
							>
								{tech.icon !== "" && (
									<TechIcon
										icon={tech.icon}
										name={tech.name}
										className={cn("h-3 w-3", tech.className)}
									/>
								)}
								{tech.name}
							</span>,
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
					<span
						key={`${category}-${tech.id}`}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
							getBadgeColors(category),
						)}
					>
						<TechIcon icon={tech.icon} name={tech.name} className="h-3 w-3" />
						{tech.name}
					</span>,
				);
			}
		}
		return badges;
	})();

	useEffect(() => {
		const savedStack = localStorage.getItem("betterTStackPreference");
		if (savedStack) {
			try {
				const parsedStack = JSON.parse(savedStack) as StackState;
				setLastSavedStack(parsedStack);
			} catch (e) {
				console.error("Failed to parse saved stack", e);
				localStorage.removeItem("betterTStackPreference");
			}
		}
	}, []);

	useEffect(() => {
		if (compatibilityAnalysis.adjustedStack) {
			const adjustedStackString = JSON.stringify(
				compatibilityAnalysis.adjustedStack,
			);

			if (lastAppliedStackString.current !== adjustedStackString) {
				startTransition(() => {
					if (compatibilityAnalysis.changes.length > 0) {
						if (compatibilityAnalysis.changes.length === 1) {
							toast.info(compatibilityAnalysis.changes[0].message, {
								duration: 4000,
							});
						} else if (compatibilityAnalysis.changes.length > 1) {
							const message = `${
								compatibilityAnalysis.changes.length
							} compatibility adjustments made:\n${compatibilityAnalysis.changes
								.map((c) => `• ${c.message}`)
								.join("\n")}`;
							toast.info(message, {
								duration: 5000,
							});
						}
					}
					setLastChanges(compatibilityAnalysis.changes);
					if (compatibilityAnalysis.adjustedStack) {
						setStack(compatibilityAnalysis.adjustedStack);
					}
					lastAppliedStackString.current = adjustedStackString;
				});
			}
		}
	}, [
		compatibilityAnalysis.adjustedStack,
		compatibilityAnalysis.changes,
		setStack,
	]);

	useEffect(() => {
		const stackToUse = compatibilityAnalysis.adjustedStack || stack;
		const projectName = stackToUse.projectName || "my-better-t-app";
		const formattedProjectName = formatProjectName(projectName);
		const stackWithProjectName = {
			...stackToUse,
			projectName: formattedProjectName,
		};
		const cmd = generateStackCommand(stackWithProjectName);
		setCommand(cmd);
		// biome-ignore lint/correctness/useExhaustiveDependencies: let it be
	}, [stack, compatibilityAnalysis.adjustedStack, formatProjectName]);

	const handleTechSelect = (
		category: keyof typeof TECH_OPTIONS,
		techId: string,
	) => {
		if (!isOptionCompatible(stack, category, techId)) {
			return;
		}

		startTransition(() => {
			setStack((currentStack: StackState) => {
				const catKey = category as keyof StackState;
				const update: Partial<StackState> = {};
				const currentValue = currentStack[catKey];

				if (
					catKey === "webFrontend" ||
					catKey === "nativeFrontend" ||
					catKey === "addons" ||
					catKey === "examples"
				) {
					const currentArray = Array.isArray(currentValue)
						? [...currentValue]
						: [];
					let nextArray = [...currentArray];
					const isSelected = currentArray.includes(techId);

					if (catKey === "webFrontend") {
						if (techId === "none") {
							nextArray = ["none"];
						} else if (isSelected) {
							if (currentArray.length > 1) {
								nextArray = nextArray.filter((id) => id !== techId);
							} else {
								nextArray = ["none"];
							}
						} else {
							nextArray = [techId];
						}
					} else if (catKey === "nativeFrontend") {
						if (techId === "none") {
							nextArray = ["none"];
						} else if (isSelected) {
							nextArray = ["none"];
						} else {
							nextArray = [techId];
						}
					} else {
						if (isSelected) {
							nextArray = nextArray.filter((id) => id !== techId);
						} else {
							nextArray.push(techId);
						}
						if (nextArray.length > 1) {
							nextArray = nextArray.filter((id) => id !== "none");
						}
						if (
							nextArray.length === 0 &&
							(catKey === "addons" || catKey === "examples")
						) {
						} else if (nextArray.length === 0) {
							nextArray = ["none"];
						}
					}

					const uniqueNext = [...new Set(nextArray)].sort();
					const uniqueCurrent = [...new Set(currentArray)].sort();

					if (JSON.stringify(uniqueNext) !== JSON.stringify(uniqueCurrent)) {
						update[catKey] = uniqueNext;
					}
				} else {
					if (currentValue !== techId) {
						update[catKey] = techId;
					} else {
						if (
							(category === "git" || category === "install") &&
							techId === "false"
						) {
							update[catKey] = "true";
						} else if (
							(category === "git" || category === "install") &&
							techId === "true"
						) {
							update[catKey] = "false";
						}
					}
				}

				return Object.keys(update).length > 0 ? update : {};
			});
		});
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const resetStack = () => {
		startTransition(() => {
			setStack(DEFAULT_STACK);
		});
		contentRef.current?.scrollTo(0, 0);
	};

	const saveCurrentStack = () => {
		const stackToUse = compatibilityAnalysis.adjustedStack || stack;
		const projectName = stackToUse.projectName || "my-better-t-app";
		const formattedProjectName = formatProjectName(projectName);
		const stackToSave = { ...stackToUse, projectName: formattedProjectName };
		localStorage.setItem("betterTStackPreference", JSON.stringify(stackToSave));
		setLastSavedStack(stackToSave);
		toast.success("Your stack configuration has been saved");
	};

	const loadSavedStack = () => {
		if (lastSavedStack) {
			startTransition(() => {
				setStack(lastSavedStack);
			});
			contentRef.current?.scrollTo(0, 0);
			toast.success("Saved configuration loaded");
		}
	};

	const applyPreset = (presetId: string) => {
		const preset = PRESET_TEMPLATES.find(
			(template: {
				id: string;
				name: string;
				description: string;
				stack: StackState;
			}) => template.id === presetId,
		);
		if (preset) {
			startTransition(() => {
				setStack(preset.stack);
			});
			contentRef.current?.scrollTo(0, 0);
			toast.success(`Applied preset: ${preset.name}`);
		}
	};

	return (
		<TooltipProvider>
			<div className="grid w-full grid-cols-1 overflow-hidden border-border text-foreground sm:grid-cols-[auto_1fr]">
				<div className="flex w-full flex-col border-border border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm">
					<ScrollArea className="flex-1">
						<div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
							<div className="space-y-3">
								<label className="flex flex-col">
									<span className="mb-1 text-muted-foreground text-xs">
										Project Name:
									</span>
									<input
										type="text"
										value={stack.projectName || ""}
										onChange={(e) => {
											setStack({ projectName: e.target.value });
										}}
										className={cn(
											"w-full rounded border px-2 py-1 text-sm focus:outline-none",
											projectNameError
												? "border-destructive bg-destructive/10 text-destructive-foreground"
												: "border-border focus:border-primary",
										)}
										placeholder="my-better-t-app"
									/>
									{projectNameError && (
										<p className="mt-1 text-destructive text-xs">
											{projectNameError}
										</p>
									)}
									{(stack.projectName || "my-better-t-app").includes(" ") && (
										<p className="mt-1 text-muted-foreground text-xs">
											Will be saved as:{" "}
											<code className="rounded bg-muted px-1 py-0.5 text-xs">
												{(stack.projectName || "my-better-t-app").replace(
													/\s+/g,
													"-",
												)}
											</code>
										</p>
									)}
								</label>

								<div className="rounded border border-border p-2">
									<div className="flex">
										<span className="mr-2 select-none text-chart-4">$</span>
										<code className="block break-all text-muted-foreground text-xs sm:text-sm">
											{command}
										</code>
									</div>
									<div className="mt-2 flex justify-end">
										<button
											type="button"
											onClick={copyToClipboard}
											className={cn(
												"flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
												copied
													? "bg-muted text-chart-4"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
											title={copied ? "Copied!" : "Copy command"}
										>
											{copied ? (
												<>
													<Check className="h-3 w-3 flex-shrink-0" />
													<span className="">Copied</span>
												</>
											) : (
												<>
													<ClipboardCopy className="h-3 w-3 flex-shrink-0" />
													<span className="">Copy</span>
												</>
											)}
										</button>
									</div>
								</div>

								<div>
									<h3 className="mb-2 font-medium text-foreground text-sm">
										Selected Stack
									</h3>
									<div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
								</div>
							</div>

							<div className="mt-auto border-border border-t pt-4">
								<div className="space-y-3">
									<ActionButtons
										onReset={resetStack}
										onRandom={getRandomStack}
										onSave={saveCurrentStack}
										onLoad={loadSavedStack}
										hasSavedStack={!!lastSavedStack}
									/>

									<div className="flex gap-1">
										<ShareButton stackUrl={getStackUrl()} stackState={stack} />

										<PresetDropdown onApplyPreset={applyPreset} />

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
												>
													<Settings className="h-3 w-3" />
													Settings
													<ChevronDown className="ml-auto h-3 w-3" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-64 bg-fd-background"
											>
												<YoloToggle
													stack={stack}
													onToggle={(yolo) => setStack({ yolo })}
												/>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>

				<div className="flex flex-1 flex-col overflow-hidden">
					<ScrollArea
						ref={contentRef}
						className="flex-1 overflow-hidden scroll-smooth"
					>
						<main className="p-3 sm:p-4">
							{CATEGORY_ORDER.map((categoryKey) => {
								const categoryOptions =
									TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
								const categoryDisplayName = getCategoryDisplayName(categoryKey);

								const filteredOptions = categoryOptions;

								if (filteredOptions.length === 0) return null;

								return (
									<section
										ref={(el) => {
											sectionRefs.current[categoryKey] = el;
										}}
										key={categoryKey}
										id={`section-${categoryKey}`}
										className="mb-6 scroll-mt-4 sm:mb-8"
									>
										<div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
											<Terminal className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
											<h2 className="font-semibold text-foreground text-sm sm:text-base">
												{categoryDisplayName}
											</h2>
											{compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
												<Tooltip delayDuration={100}>
													<TooltipTrigger asChild>
														<InfoIcon className="ml-2 h-4 w-4 flex-shrink-0 cursor-help text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent side="top" align="start">
														<ul className="list-disc space-y-1 pl-4 text-xs">
															{compatibilityAnalysis.notes[
																categoryKey
															].notes.map((note) => (
																<li key={note}>{note}</li>
															))}
														</ul>
													</TooltipContent>
												</Tooltip>
											)}
										</div>

										<div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
											{filteredOptions.map((tech) => {
												let isSelected = false;
												const category = categoryKey as keyof StackState;
												const currentValue = stack[category];

												if (
													category === "addons" ||
													category === "examples" ||
													category === "webFrontend" ||
													category === "nativeFrontend"
												) {
													isSelected = (
														(currentValue as string[]) || []
													).includes(tech.id);
												} else {
													isSelected = currentValue === tech.id;
												}

												const isDisabled = !isOptionCompatible(
													stack,
													categoryKey as keyof typeof TECH_OPTIONS,
													tech.id,
												);

												const disabledReason = isDisabled
													? getDisabledReason(
															stack,
															categoryKey as keyof typeof TECH_OPTIONS,
															tech.id,
														)
													: null;

												return (
													<Tooltip key={tech.id} delayDuration={100}>
														<TooltipTrigger asChild>
															<motion.div
																className={cn(
																	"relative cursor-pointer rounded border p-2 transition-all sm:p-3",
																	isSelected
																		? "border-primary bg-primary/10"
																		: isDisabled
																			? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
																			: "border-border hover:border-muted hover:bg-muted",
																)}
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
																onClick={() =>
																	handleTechSelect(
																		categoryKey as keyof typeof TECH_OPTIONS,
																		tech.id,
																	)
																}
															>
																<div className="flex items-start">
																	<div className="flex-grow">
																		<div className="flex items-center justify-between">
																			<div className="flex items-center">
																				{tech.icon !== "" && (
																					<TechIcon
																						icon={tech.icon}
																						name={tech.name}
																						className={cn(
																							"mr-1.5 h-3 w-3 sm:h-4 sm:w-4",
																							tech.className,
																						)}
																					/>
																				)}
																				<span
																					className={cn(
																						"font-medium text-xs sm:text-sm",
																						isSelected
																							? "text-primary"
																							: "text-foreground",
																					)}
																				>
																					{tech.name}
																				</span>
																			</div>
																		</div>
																		<p className="mt-0.5 text-muted-foreground text-xs">
																			{tech.description}
																		</p>
																	</div>
																</div>
																{tech.default && !isSelected && (
																	<span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
																		Default
																	</span>
																)}
															</motion.div>
														</TooltipTrigger>
														{disabledReason && (
															<TooltipContent
																side="top"
																align="center"
																className="max-w-xs"
															>
																<p className="text-xs">{disabledReason}</p>
															</TooltipContent>
														)}
													</Tooltip>
												);
											})}
										</div>
									</section>
								);
							})}
							<div className="h-10" />
						</main>
					</ScrollArea>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default StackBuilder;

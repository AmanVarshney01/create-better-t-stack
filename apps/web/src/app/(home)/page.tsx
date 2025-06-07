"use client";
import { TECH_OPTIONS } from "@/lib/constant";
import { cn } from "@/lib/utils";
import discordLogo from "@/public/icon/discord.svg";
import {
	Check,
	ChevronRight,
	Copy,
	Github,
	Star,
	Terminal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./_components/footer";
import PackageIcon from "./_components/icons";
import Navbar from "./_components/navbar";
import NpmPackage from "./_components/npm-package";
import SponsorsSection from "./_components/sponsors-section";
import Testimonials from "./_components/testimonials";

export default function HomePage() {
	const [stars, setStars] = useState<number | null>(null);
	const [isLoadingStars, setIsLoadingStars] = useState(true);
	const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");

	const commands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	useEffect(() => {
		async function fetchStars() {
			try {
				const response = await fetch(
					"https://api.github.com/repos/amanvarshney01/create-better-t-stack",
				);
				if (response.ok) {
					const data = await response.json();
					setStars(data.stargazers_count);
				} else {
					console.error("Failed to fetch GitHub stars");
				}
			} catch (error) {
				console.error("Error fetching GitHub stars:", error);
			} finally {
				setIsLoadingStars(false);
			}
		}
		fetchStars();
	}, []);

	const copyCommand = (command: string, packageManager: string) => {
		navigator.clipboard.writeText(command);
		setCopiedCommand(packageManager);
		setTimeout(() => setCopiedCommand(null), 2000);
	};

	const frontendOptions = [
		...TECH_OPTIONS.webFrontend.filter((option) => option.id !== "none"),
		...TECH_OPTIONS.nativeFrontend.filter((option) => option.id !== "none"),
	];

	const backendOptions = TECH_OPTIONS.backend.filter(
		(option) => option.id !== "none",
	);
	const databaseOptions = TECH_OPTIONS.database.filter(
		(option) => option.id !== "none",
	);
	const runtimeOptions = TECH_OPTIONS.runtime;
	const packageManagerOptions = TECH_OPTIONS.packageManager;
	const apiOptions = TECH_OPTIONS.api.filter((option) => option.id !== "none");
	const ormOptions = TECH_OPTIONS.orm.filter((option) => option.id !== "none");
	const dbSetupOptions = TECH_OPTIONS.dbSetup.filter(
		(option) => option.id !== "none",
	);
	const authOptions = TECH_OPTIONS.auth.filter(
		(option) => option.id !== "false",
	);
	const addonsOptions = TECH_OPTIONS.addons;
	const examplesOptions = TECH_OPTIONS.examples;

	const techStackCategories = [
		{
			category: "Frontend",
			options: frontendOptions,
		},
		{
			category: "Backend",
			options: backendOptions,
		},
		{
			category: "Database",
			options: databaseOptions,
		},
		{
			category: "Runtime",
			options: runtimeOptions,
		},
		{
			category: "API",
			options: apiOptions,
		},
		{
			category: "ORM",
			options: ormOptions,
		},
		{
			category: "Database Setup",
			options: dbSetupOptions,
		},
		{
			category: "Authentication",
			options: authOptions,
		},
		{
			category: "Package Managers",
			options: packageManagerOptions,
		},
		{
			category: "Addons",
			options: addonsOptions,
		},
		{
			category: "Examples",
			options: examplesOptions,
		},
	];

	return (
		<div className="terminal-scanlines min-h-screen bg-background font-mono">
			<Navbar />
			<main className="terminal-matrix-bg mx-auto max-w-7xl p-6 pt-28">
				<div className="mb-8 flex items-center justify-center">
					<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
██████╗  ██████╗ ██╗     ██╗
██╔══██╗██╔═══██╗██║     ██║
██████╔╝██║   ██║██║     ██║
██╔══██╗██║   ██║██║     ██║
██║  ██║╚██████╔╝███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝`}
						</pre>

						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
██╗   ██╗ ██████╗ ██╗   ██╗██████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
   ██║   ╚██████╔╝╚██████╔╝██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝`}
						</pre>

						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
 ██████╗ ██╗    ██╗███╗   ██╗
██╔═══██╗██║    ██║████╗  ██║
██║   ██║██║ █╗ ██║██╔██╗ ██║
██║   ██║██║███╗██║██║╚██╗██║
╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝`}
						</pre>

						<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
							{`
███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝
╚════██║   ██║   ██╔══██║██║     ██╔═██╗
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
						</pre>
					</div>
				</div>

				<div className="mb-6 text-center">
					<p className="mx-auto font-mono text-lg text-muted-foreground">
						# Modern CLI for scaffolding end-to-end type-safe TypeScript
						projects
					</p>
					<p className="mx-auto mt-2 max-w-2xl font-mono text-muted-foreground text-sm">
						# Production-ready • Customizable • Best practices included
					</p>
					<NpmPackage />
				</div>

				<div className="terminal-block-hover mb-8 rounded border border-border bg-muted/20 p-4">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Terminal className="h-4 w-4 text-primary" />
							<span className="font-semibold text-sm">QUICK_START</span>
						</div>
						<div className="flex items-center rounded border border-border bg-background p-0.5">
							{(["bun", "pnpm", "npm"] as const).map((pm) => (
								<button
									type="button"
									key={pm}
									onClick={() => setSelectedPM(pm)}
									className={cn(
										"flex items-center gap-1.5 rounded px-2 py-1 font-mono text-xs transition-colors duration-150",
										selectedPM === pm
											? "bg-primary/20 text-primary"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<PackageIcon pm={pm} className="h-3 w-3" />
									{pm.toUpperCase()}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between rounded border border-border bg-background p-3">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-foreground">
									{commands[selectedPM]}
								</span>
							</div>
							<button
								type="button"
								onClick={() => copyCommand(commands[selectedPM], selectedPM)}
								className="terminal-block-hover flex items-center gap-1 rounded border border-border bg-muted/20 px-2 py-1 text-xs hover:bg-muted/50"
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

				<div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
					<Link href="/new">
						<div className="group terminal-block-hover cursor-pointer rounded border border-border bg-background p-4">
							<div className="flex items-center gap-2">
								<ChevronRight className="h-4 w-4 text-primary" />
								<span className="font-mono font-semibold">
									STACK_BUILDER.EXE
								</span>
							</div>
							<p className="mt-2 font-mono text-muted-foreground text-sm">
								[EXEC] Interactive configuration wizard
							</p>
						</div>
					</Link>

					<Link
						href="https://github.com/amanvarshney01/create-better-t-stack"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="group terminal-block-hover cursor-pointer rounded border border-border bg-background p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Github className="h-4 w-4 text-primary" />
									<span className="font-mono font-semibold">
										GITHUB_REPO.GIT
									</span>
								</div>
								{stars !== null && !isLoadingStars && (
									<div className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 font-mono text-xs">
										<Star className="h-3 w-3 text-accent" />
										{stars}
									</div>
								)}
							</div>
							<p className="mt-2 font-mono text-muted-foreground text-sm">
								[LINK] Star the repository on GitHub
							</p>
						</div>
					</Link>

					<Link
						href="https://discord.gg/ZYsbjpDaM5"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="group terminal-block-hover cursor-pointer rounded border border-border bg-background p-4">
							<div className="flex items-center gap-2">
								<Image src={discordLogo} alt="discord" className="h-4 w-4" />
								<span className="font-mono font-semibold">
									DISCORD_CHAT.IRC
								</span>
							</div>
							<p className="mt-2 font-mono text-muted-foreground text-sm">
								[JOIN] Connect to developer community
							</p>
						</div>
					</Link>
				</div>

				<div className="mb-12">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Terminal className="h-5 w-5 text-primary" />
							<span className="font-bold font-mono text-lg sm:text-xl">
								TECH_STACK_MATRIX.DB
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right font-mono text-muted-foreground text-xs sm:w-auto sm:text-left">
							[
							{techStackCategories.reduce(
								(acc, cat) => acc + cat.options.length,
								0,
							)}{" "}
							PACKAGES]
						</span>
					</div>

					<div className="terminal-block-hover rounded border border-border bg-background">
						<div className="border-border border-b bg-muted/20 px-4 py-3">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-mono font-semibold text-sm">
									/tech-stack/packages/
								</span>
							</div>
						</div>

						<div className="space-y-3 p-4">
							{techStackCategories.map((category, categoryIndex) => (
								<div key={category.category} className="space-y-2">
									<div className="directory-header flex items-center gap-2 rounded px-2 py-2 transition-colors">
										<span className="font-mono font-semibold text-foreground text-sm">
											{category.category.toLowerCase().replace(/\s+/g, "-")}/
										</span>
										<span className="font-mono text-muted-foreground text-xs">
											({category.options.length} items)
										</span>
									</div>

									<div className="ml-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
										{category.options.map((option, optionIndex) => (
											<div
												key={option.id}
												className="file-browser-item file-load-animation flex items-center gap-3 rounded border border-border bg-muted/10 px-3 py-2"
												style={{
													animationDelay: `${
														categoryIndex * 100 + optionIndex * 30
													}ms`,
												}}
											>
												{option.icon !== "" && (
													<Image
														src={option.icon}
														alt={option.name}
														height={16}
														width={16}
														unoptimized
														className="file-icon h-4 w-4 flex-shrink-0"
													/>
												)}
												<span className="flex-1 truncate font-mono text-xs">
													{option.name.toLowerCase().replace(/\s+/g, "-")}
												</span>
												<span className="font-mono text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
													-rw-r--r--
												</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>

						<div className="border-border border-t bg-muted/20 px-4 py-2">
							<div className="flex items-center justify-between text-xs">
								<span className="font-mono text-muted-foreground">
									$ ls -la /tech-stack/packages/
								</span>
								<span className="font-mono text-muted-foreground">
									{techStackCategories.length} directories,{" "}
									{techStackCategories.reduce(
										(acc, cat) => acc + cat.options.length,
										0,
									)}{" "}
									files
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="terminal-block-hover mb-8 rounded border border-border bg-muted/20 p-4">
					<div className="mb-2 font-mono font-semibold text-sm">
						SYSTEM_INFO.LOG
					</div>
					<div className="grid grid-cols-1 gap-2 font-mono text-xs md:grid-cols-3">
						<div>
							<span className="text-primary">OS:</span> TypeScript_Runtime_v5.x
						</div>
						<div>
							<span className="text-primary">ARCH:</span> Full_Stack_Framework
						</div>
						<div>
							<span className="text-primary">STATUS:</span>{" "}
							<span className="text-accent">READY</span>
						</div>
					</div>
				</div>

				<SponsorsSection />
				<Testimonials />
			</main>
			<Footer />
		</div>
	);
}

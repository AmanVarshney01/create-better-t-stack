"use client";
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
import { cn } from "@/lib/utils";
import discordLogo from "@/public/icon/discord.svg";
import Footer from "./_components/footer";
import PackageIcon from "./_components/icons";
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

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<main className="mx-auto px-2 pt-16">
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
					<p className="mx-auto text-lg text-muted-foreground">
						Modern CLI for scaffolding end-to-end type-safe TypeScript projects
					</p>
					<p className="mx-auto mt-2 max-w-2xl text-muted-foreground text-sm">
						Production-ready • Customizable • Best practices included
					</p>
					<NpmPackage />
				</div>

				<div className=" mb-8 rounded border border-border p-4">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Terminal className="h-4 w-4 text-primary" />
							<span className="font-semibold text-sm">QUICK_START</span>
						</div>
						<div className="flex items-center rounded border border-border p-0.5">
							{(["bun", "pnpm", "npm"] as const).map((pm) => (
								<button
									type="button"
									key={pm}
									onClick={() => setSelectedPM(pm)}
									className={cn(
										"flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors duration-150",
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
						<div className="flex items-center justify-between rounded border border-border p-3">
							<div className="flex items-center gap-2 font-mono text-sm">
								<span className="text-primary">$</span>
								<span className=" text-foreground">{commands[selectedPM]}</span>
							</div>
							<button
								type="button"
								onClick={() => copyCommand(commands[selectedPM], selectedPM)}
								className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-muted/50"
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

				<div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 lg:grid-cols-3">
					<Link href="/new">
						<div className="group cursor-pointer rounded border border-border p-4 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:bg-muted/50">
							<div className="flex items-center gap-2">
								<ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
								<span className="font-semibold text-sm sm:text-base">
									STACK_BUILDER.SH
								</span>
							</div>
							<p className="mt-2 text-muted-foreground text-xs sm:text-sm">
								[EXEC] Interactive configuration wizard
							</p>
						</div>
					</Link>

					<Link
						href="https://github.com/amanvarshney01/create-better-t-stack"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="group cursor-pointer rounded border border-border p-4 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:bg-muted/50">
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 flex-1 items-center gap-2">
									<Github className="h-4 w-4 flex-shrink-0 text-primary" />
									<span className="truncate font-semibold text-sm sm:text-base">
										GITHUB_REPO.GIT
									</span>
								</div>
								{stars !== null && !isLoadingStars && (
									<div className="flex flex-shrink-0 items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 text-xs">
										<Star className="h-3 w-3 text-accent" />
										<span className="tabular-nums">{stars}</span>
									</div>
								)}
							</div>
							<p className="mt-2 text-muted-foreground text-xs sm:text-sm">
								[LINK] Star the repository on GitHub
							</p>
						</div>
					</Link>

					<Link
						href="https://discord.gg/ZYsbjpDaM5"
						target="_blank"
						rel="noopener noreferrer"
						className="sm:col-span-2 lg:col-span-1"
					>
						<div className="group cursor-pointer rounded border border-border p-4 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:bg-muted/50">
							<div className="flex items-center gap-2">
								<Image
									src={discordLogo}
									alt="discord"
									className="h-4 w-4 flex-shrink-0 invert-0 dark:invert"
								/>
								<span className="font-semibold text-sm sm:text-base">
									DISCORD_CHAT.IRC
								</span>
							</div>
							<p className="mt-2 text-muted-foreground text-xs sm:text-sm">
								[JOIN] Connect to developer community
							</p>
						</div>
					</Link>
				</div>

				<SponsorsSection />
				<Testimonials />
			</main>
			<Footer />
		</div>
	);
}

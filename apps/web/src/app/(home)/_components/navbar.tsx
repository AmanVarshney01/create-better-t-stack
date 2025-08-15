"use client";
import { Github, Heart, Maximize2, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import PackageIcon from "./icons";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileMenuOpen]);

	const closeMobileMenu = () => setMobileMenuOpen(false);

	const desktopNavLinks = [
		{
			href: "/",
			label: "Home",
			icon: <span className="text-primary">~/</span>,
		},
		{
			href: "https://my-better-t-app-client.pages.dev/",
			label: "Demo",
			target: "_blank",
		},
		{ href: "/showcase", label: "Showcase" },
		{
			href: "/analytics",
			label: "Analytics",
		},
		{ href: "/docs", label: "Docs" },
		{
			href: "https://www.npmjs.com/package/create-better-t-stack",
			label: "NPM",
			icon: <PackageIcon pm="npm" className="h-4 w-4" />,
			target: "_blank",
		},
	];

	const mobileNavLinks = [
		{
			href: "/",
			label: "Home",
			icon: <span className="text-primary">~/</span>,
		},
		{
			href: "https://my-better-t-app-client.pages.dev/",
			label: "Demo",
			target: "_blank",
		},
		{ href: "/showcase", label: "Showcase" },
		{
			href: "/analytics",
			label: "Analytics",
		},
		{ href: "/docs", label: "Docs" },
		{
			href: "https://www.npmjs.com/package/create-better-t-stack",
			label: "NPM",
			icon: <PackageIcon pm="npm" className="h-4 w-4" />,
			target: "_blank",
		},
		{
			href: "https://www.github.com/AmanVarshney01/create-better-t-stack",
			label: "GitHub",
			icon: <Github className="size-4" />,
			target: "_blank",
		},
	];

	return (
		<>
			<nav
				className={cn(
					"fixed top-0 z-[100] w-full transition-all duration-300 ease-in-out",
					scrolled
						? "border- border-border shadow-sm backdrop-blur-md"
						: "border-transparent border-b bg-transparent",
				)}
			>
				<div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
					<Link href="/" className="flex flex-shrink-0 items-center gap-2">
						<Image
							src="/logo.svg"
							alt="Better-T Stack"
							width={32}
							height={32}
							unoptimized
						/>
						<span className="hidden font-semibold text-foreground text-md sm:inline-block">
							Better-T Stack
						</span>
					</Link>

					<div className="hidden items-center gap-4 lg:flex">
						<div className="flex items-center gap-1">
							{desktopNavLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									target={link.target}
									className="relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-primary"
								>
									{link.icon}
									<span>{link.label}</span>
								</Link>
							))}
						</div>

						<div className="h-5 w-px bg-border" />

						<div className="flex items-center gap-2">
							<Link
								href="https://github.com/sponsors/AmanVarshney01"
								target="_blank"
								className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/90 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
								title="Sponsor on GitHub"
							>
								<Heart className="size-3.5" />
								Sponsor
							</Link>
							<Link
								href="/new"
								className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 text-primary text-xs transition-colors hover:bg-primary/20"
								title="Stack Builder"
							>
								<Maximize2 className="size-3.5" />
								Builder
							</Link>
						</div>

						<ThemeToggle />
					</div>

					<div className="flex items-center gap-2 lg:hidden">
						<ThemeToggle />
						<button
							type="button"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="flex items-center justify-center rounded-md p-1.5 text-foreground transition-colors hover:bg-muted"
							aria-expanded={mobileMenuOpen}
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<X className="size-5" />
							) : (
								<Menu className="size-5" />
							)}
						</button>
					</div>
				</div>
			</nav>

			<AnimatePresence>
				{mobileMenuOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2, ease: "easeInOut" }}
							className="fixed inset-0 z-[98 backdrop-blur-sm lg:hidden"
							onClick={closeMobileMenu}
							aria-hidden="true"
						/>

						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="fixed top-0 right-0 bottom-0 z-[99] h-full w-full max-w-xs overflow-y-auto border-border border-l shadow-lg lg:hidden"
							aria-modal="true"
						>
							<div className="flex h-16 items-center justify-between border-border border-b px-4">
								<span className="font-semibold text-foreground text-md">
									Navigation
								</span>
								<button
									type="button"
									onClick={closeMobileMenu}
									className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									aria-label="Close menu"
								>
									<X className="size-5" />
								</button>
							</div>

							<div className="flex flex-col p-4">
								<nav className="flex flex-col space-y-1">
									{mobileNavLinks.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											target={link.target}
											onClick={closeMobileMenu}
											className="flex items-center gap-3 rounded-md px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
										>
											{link.icon ? (
												<span className="flex w-5 items-center justify-center">
													{link.icon}
												</span>
											) : (
												<span className="w-5" />
											)}
											<span>{link.label}</span>
										</Link>
									))}
								</nav>

								<div className="mt-6 space-y-3 border-border border-t pt-6">
									<Link
										href="/new"
										onClick={closeMobileMenu}
										className="flex w-full items-center justify-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2.5 text-primary text-sm transition-colors hover:bg-primary/20"
									>
										<Maximize2 className="size-4" />
										Stack Builder
									</Link>
									<Link
										href="https://github.com/sponsors/AmanVarshney01"
										target="_blank"
										onClick={closeMobileMenu}
										className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/90 px-4 py-2.5 text-muted-foreground text-sm backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
									>
										<Heart className="size-4" />
										Sponsor on GitHub
									</Link>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

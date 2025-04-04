"use client";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PackageIcon from "./Icons";

const Navbar = () => {
	const [activeLink, setActiveLink] = useState("home");
	const [bgStyles, setBgStyles] = useState({});
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

	useEffect(() => {
		const updateBackground = (linkId: string) => {
			const linkElement = linkRefs.current[linkId];
			if (linkElement) {
				setBgStyles({
					padding: "0.75rem 0rem",
					width: `${linkElement.clientWidth - 12}px`,
					transform: `translateX(${linkElement.offsetLeft}px)`,
					opacity: 1,
				});
			}
		};

		updateBackground(activeLink);

		const handleScroll = () => {
			const isScrolled = window.scrollY > 50;
			setScrolled(isScrolled);
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", () => updateBackground(activeLink));

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", () => updateBackground(activeLink));
		};
	}, [activeLink]);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<>
			<nav
				className={`fixed top-0 right-0 z-[100] flex w-screen items-center justify-between px-4 py-4 transition-all duration-300 sm:px-8 ${
					scrolled
						? "border-transparent bg-transparent"
						: "border-gray-200 border-b bg-gray-50/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/80"
				}`}
			>
				<div
					className={`flex flex-row items-center space-x-3 transition-opacity duration-300 ${
						scrolled ? "opacity-0" : "opacity-100"
					}`}
				>
					<div className="flex h-4 w-4 items-center justify-center rounded-sm">
						<span className="text-blue-600 text-md dark:text-blue-500">$_</span>
					</div>
					<span className="font-semibold text-gray-600 text-md dark:text-gray-100">
						Better-T Stack
					</span>
				</div>

				<div className="-translate-x-1/2 absolute left-1/2 hidden transform md:block">
					<div
						className={`relative flex items-center rounded-lg border border-gray-200 bg-gray-100/90 px-1.5 py-1 text-sm backdrop-blur-sm transition-all duration-500 ease-out dark:border-gray-800 dark:bg-gray-900/90 ${
							scrolled ? "w-[350px]" : "w-[240px]"
						}`}
					>
						<div
							className="absolute rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out dark:bg-gray-800"
							style={bgStyles}
						/>
						<Link
							href="/"
							ref={(ref) => {
								linkRefs.current.home = ref;
							}}
							onMouseOver={() => setActiveLink("home")}
							className="relative rounded-md px-4 py-2 font-mono text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 flex gap-1 items-center"
						>
							<span className="text-blue-600 dark:text-blue-400">~/</span>
							home
						</Link>

						<Link
							href="https://my-better-t-app-client.pages.dev/"
							target="_blank"
							ref={(ref) => {
								linkRefs.current.demo = ref;
							}}
							onMouseOver={() => setActiveLink("demo")}
							onMouseLeave={() => setActiveLink("home")}
							className="relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300"
						>
							<span>demo</span>
						</Link>

						<Link
							href="https://www.npmjs.com/package/create-better-t-stack"
							target="_blank"
							ref={(ref) => {
								linkRefs.current.npm = ref;
							}}
							onMouseOver={() => setActiveLink("npm")}
							onMouseLeave={() => setActiveLink("home")}
							className="relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300"
						>
							<PackageIcon pm="npm" className="h-4 w-4 rounded-full" />{" "}
							<span>npm</span>
						</Link>

						<Link
							href="https://www.github.com/better-t-stack/create-better-t-stack"
							target="_blank"
							ref={(ref) => {
								linkRefs.current.github = ref;
							}}
							onMouseOver={() => setActiveLink("github")}
							onMouseLeave={() => setActiveLink("home")}
							className={`relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 ${
								scrolled
									? "translate-y-0 opacity-100"
									: "pointer-events-none opacity-0"
							}`}
						>
							<Github className="mr-1 size-4">
								<title>GitHub</title>
							</Github>{" "}
							Github
						</Link>
					</div>
				</div>

				<div
					className={`hidden justify-end transition-opacity duration-300 md:flex ${
						scrolled ? "pointer-events-none opacity-0" : "opacity-100"
					}`}
				>
					<Link
						href="https://www.github.com/better-t-stack/create-better-t-stack"
						target="_blank"
						className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-100/90 px-4 py-1 font-mono text-gray-700 text-sm backdrop-blur-sm transition-colors hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:text-blue-300"
					>
						<Github className="mr-2 size-4">
							<title>GitHub</title>
						</Github>
						Star on GitHub
					</Link>
				</div>

				<button
					type="button"
					onClick={toggleMobileMenu}
					className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100/50 focus:outline-none md:hidden dark:text-gray-300 dark:hover:bg-gray-800/50"
					aria-expanded={mobileMenuOpen}
				>
					{mobileMenuOpen ? (
						<X className="size-5" aria-hidden="true" />
					) : (
						<Menu className="size-5" aria-hidden="true" />
					)}
					<span className="sr-only">Toggle menu</span>
				</button>
			</nav>

			{/* Mobile Menu - Terminal Style */}
			<div
				className={`fixed inset-0 z-[99] pt-16 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden ${
					mobileMenuOpen
						? "pointer-events-auto opacity-100"
						: "pointer-events-none opacity-0"
				}`}
			>
				<div className="mx-4 mt-4 overflow-hidden rounded-lg border border-gray-300 bg-gray-100/95 shadow-lg dark:border-gray-700 dark:bg-gray-900/95">
					{/* Terminal Header */}
					<div className="flex items-center bg-gray-200 px-4 py-2 dark:bg-gray-800">
						<div className="mr-4 flex space-x-2">
							<div className="h-3 w-3 rounded-full bg-red-500" />
							<div className="h-3 w-3 rounded-full bg-yellow-500" />
							<div className="h-3 w-3 rounded-full bg-green-500" />
						</div>
						<div className="font-mono text-gray-600 text-sm dark:text-gray-300">
							better-t-stack:~
						</div>
					</div>

					{/* Terminal Body */}
					<div className="p-4 font-mono text-sm">
						<div className="pb-3">
							<span className="text-green-600 dark:text-green-500">
								user@better-t-stack
							</span>
							<span className="text-gray-600 dark:text-gray-400">:~$</span>
							<span className="ml-2 text-gray-800 dark:text-gray-200">
								ls -la
							</span>
						</div>

						<div className="space-y-2 border-gray-300 border-l-2 pl-4 dark:border-gray-700">
							<Link
								href="/"
								className="block text-blue-600 hover:underline dark:text-blue-400"
								onClick={() => setMobileMenuOpen(false)}
							>
								~/home
							</Link>

							<Link
								href="https://my-better-t-app-client.pages.dev/"
								target="_blank"
								className="block text-blue-600 hover:underline dark:text-blue-400"
								onClick={() => setMobileMenuOpen(false)}
							>
								~/demo
							</Link>

							<div className="flex items-center">
								<PackageIcon pm="npm" className="mr-2 h-4 w-4" />
								<Link
									href="https://www.npmjs.com/package/create-better-t-stack"
									target="_blank"
									className="block text-blue-600 hover:underline dark:text-blue-400"
									onClick={() => setMobileMenuOpen(false)}
								>
									~/npm
								</Link>
							</div>

							<div className="flex items-center">
								<Github className="mr-2 size-4 text-gray-700 dark:text-gray-300" />
								<Link
									href="https://www.github.com/better-t-stack/create-better-t-stack"
									target="_blank"
									className="block text-blue-600 hover:underline dark:text-blue-400"
									onClick={() => setMobileMenuOpen(false)}
								>
									~/github
								</Link>
							</div>
						</div>

						<div className="mt-6 pb-3">
							<span className="text-green-600 dark:text-green-500">
								user@better-t-stack
							</span>
							<span className="text-gray-600 dark:text-gray-400">:~$</span>
							<span className="ml-2 text-gray-800 dark:text-gray-200">
								star-repo
							</span>
						</div>

						<div className="border-gray-300 border-l-2 pb-2 pl-4 dark:border-gray-700">
							<Link
								href="https://www.github.com/better-t-stack/create-better-t-stack"
								target="_blank"
								className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Github className="mr-2 size-5" />
								Star on GitHub
							</Link>
						</div>

						<div className="mt-4">
							<span className="text-green-600 dark:text-green-500">
								user@better-t-stack
							</span>
							<span className="text-gray-600 dark:text-gray-400">:~$</span>
							<span className="ml-2 animate-pulse">█</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;

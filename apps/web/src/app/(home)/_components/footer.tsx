import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import npmIcon from "@/public/icon/npm.svg";

const Footer = () => {
	return (
		<footer className="relative w-full border-border border-t">
			<div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				<div className="mb-8 grid gap-8 sm:mb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
					<div className="sm:col-span-2 lg:col-span-1">
						<h3 className="mb-3 flex items-center gap-2 font-semibold text-base text-foreground sm:mb-4">
							<span>Better-T Stack</span>
						</h3>
						<p className="mb-4 text-muted-foreground text-sm leading-relaxed sm:mb-6 sm:text-base lg:pr-4">
							Type-safe, modern TypeScript scaffolding for full-stack web
							development
						</p>
						<div className="flex space-x-4">
							<Link
								href="https://github.com/AmanVarshney01/create-better-t-stack"
								target="_blank"
								className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
								aria-label="GitHub Repository"
							>
								<Github size={20} />
							</Link>
							<Link
								href="https://www.npmjs.com/package/create-better-t-stack"
								target="_blank"
								className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground invert-0 transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:invert"
								aria-label="NPM Package"
							>
								<Image src={npmIcon} alt="NPM" width={20} height={20} />
							</Link>
						</div>
					</div>

					<div>
						<h3 className="mb-3 font-semibold text-base text-foreground sm:mb-4">
							Resources
						</h3>
						<ul className="space-y-2 text-muted-foreground text-sm sm:space-y-3 sm:text-base">
							<li>
								<Link
									target="_blank"
									href="https://github.com/AmanVarshney01/create-better-t-stack"
									className="inline-block transition-colors hover:text-primary focus:text-primary focus:outline-none"
								>
									GitHub Repository
								</Link>
							</li>
							<li>
								<Link
									target="_blank"
									href="https://www.npmjs.com/package/create-better-t-stack"
									className="inline-block transition-colors hover:text-primary focus:text-primary focus:outline-none"
								>
									NPM Package
								</Link>
							</li>
							<li>
								<Link
									target="_blank"
									href="https://my-better-t-app-client.pages.dev/"
									className="inline-block transition-colors hover:text-primary focus:text-primary focus:outline-none"
								>
									Demo Application
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-3 font-semibold text-base text-foreground sm:mb-4">
							Contact
						</h3>
						<div className="space-y-3 text-muted-foreground text-sm sm:space-y-4 sm:text-base">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<span className="inline-flex w-fit rounded bg-muted px-2 py-1 font-mono text-xs sm:text-sm">
									$
								</span>
								<span className="break-all sm:break-normal">
									amanvarshney.work@gmail.com
								</span>
							</div>
							<p className="text-sm leading-relaxed sm:text-base">
								Have questions or feedback? Feel free to reach out or open an
								issue on GitHub.
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-4 border-border border-t pt-6 sm:flex-row sm:gap-6 sm:pt-8">
					<p className="text-center text-muted-foreground text-xs sm:text-left sm:text-sm">
						© {new Date().getFullYear()} Better-T Stack. All rights reserved.
					</p>
					<p className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
						Built with
						<span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text font-medium text-transparent">
							TypeScript
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

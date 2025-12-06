"use client";

import { FileX, Home, Terminal } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="container mx-auto mx-auto min-h-svh">
			<main className="mx-auto px-4 pt-12">
				<div className="mb-8">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Terminal className="h-4 w-4 text-primary" />
							<span className="font-bold text-lg sm:text-xl">
								ERROR_404.TXT
							</span>
						</div>
						<div className="h-px flex-1 bg-border" />
						<span className="text-muted-foreground text-xs">
							[PAGE NOT FOUND]
						</span>
					</div>
				</div>

				<div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div className="flex h-full flex-col justify-between rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<FileX className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">ERROR_DETAILS</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								404
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between rounded border border-border p-3">
								<div className="flex items-center gap-2 font-mono text-sm">
									<span className="text-primary">$</span>
									<span className="text-foreground">
										Page not found in directory
									</span>
								</div>
								<div className="rounded border border-border bg-destructive/10 px-2 py-1 text-destructive text-xs">
									ERROR
								</div>
							</div>
						</div>
					</div>

					<Link href="/">
						<div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10">
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Home className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
									<span className="font-semibold text-sm">GO_HOME</span>
								</div>
								<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
									SAFE
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between rounded border border-border p-3">
									<div className="flex items-center gap-2 text-sm">
										<Home className="h-4 w-4 text-primary" />
										<span className="text-foreground">Return to homepage</span>
									</div>
									<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
										NAVIGATE
									</div>
								</div>
							</div>
						</div>
					</Link>
				</div>
			</main>
		</div>
	);
}

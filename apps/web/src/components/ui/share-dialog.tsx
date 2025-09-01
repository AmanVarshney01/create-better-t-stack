"use client";

import { Check, Copy, Share2, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { QRCode } from "@/components/ui/kibo-ui/qr-code";
import { TechBadge } from "@/components/ui/tech-badge";
import type { StackState } from "@/lib/constant";
import { TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
	children: React.ReactNode;
	stackUrl: string;
	stackState: StackState;
}

export function ShareDialog({
	children,
	stackUrl,
	stackState,
}: ShareDialogProps) {
	const [copied, setCopied] = useState(false);

	const techBadges = (() => {
		const badges: React.ReactNode[] = [];
		for (const category of CATEGORY_ORDER) {
			const categoryKey = category as keyof StackState;
			const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
			const selectedValue = stackState[categoryKey];

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
							<TechBadge
								key={`${category}-${tech.id}`}
								icon={tech.icon}
								name={tech.name}
								category={category}
							/>,
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
					<TechBadge
						key={`${category}-${tech.id}`}
						icon={tech.icon}
						name={tech.name}
						category={category}
					/>,
				);
			}
		}
		return badges;
	})();

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(stackUrl);
			setCopied(true);
			toast.success("Link copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy link");
		}
	};

	const shareToTwitter = () => {
		const text = encodeURIComponent(
			`Check out this cool tech stack I configured with Create Better T Stack!\n\n🚀 ${techBadges.length} technologies selected\n\n`,
		);
		const url = encodeURIComponent(stackUrl);
		window.open(
			`https://twitter.com/intent/tweet?text=${text}&url=${url}`,
			"_blank",
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Share2 className="h-5 w-5" />
						Share Your Stack
					</DialogTitle>
					<DialogDescription>
						Share your custom tech stack configuration with others
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-3">
						<div className="font-medium text-foreground text-sm">
							Technologies
						</div>
						<div className="flex flex-wrap gap-1.5 rounded border border-border bg-muted/20 p-3">
							{techBadges.length > 0 ? (
								techBadges
							) : (
								<span className="text-muted-foreground text-sm">
									No technologies selected
								</span>
							)}
						</div>
					</div>

					<div className="space-y-3">
						<div className="font-medium text-foreground text-sm">QR Code</div>
						<div className="flex items-center justify-center rounded border border-border bg-muted/20 p-4">
							<div className="h-32 w-32">
								<QRCode data={stackUrl} />
							</div>
						</div>
						<p className="text-center text-muted-foreground text-xs">
							Scan to view this tech stack
						</p>
					</div>

					<div className="space-y-3">
						<div className="font-medium text-foreground text-sm">Share</div>
						<div className="flex gap-2">
							<Button
								variant="secondary"
								onClick={shareToTwitter}
								className="flex-1"
							>
								<Twitter className="h-4 w-4" />X (Twitter)
							</Button>
							<Button
								variant="secondary"
								onClick={copyToClipboard}
								className={cn(
									"flex-1",
									copied &&
										"border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
								)}
							>
								{copied ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
								{copied ? "Copied!" : "Copy URL"}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

"use client";

import {
	Check,
	Copy,
	ExternalLink,
	Linkedin,
	Share2,
	Terminal,
	Twitter,
} from "lucide-react";
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

	const shareToLinkedIn = () => {
		const text = encodeURIComponent(
			`Check out this tech stack I configured with Create Better T Stack: ${techBadges.length} technologies selected`,
		);
		const url = encodeURIComponent(stackUrl);
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
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
					{/* Terminal-style Stack Display */}
					<div className="rounded border border-border p-4">
						<div className="mb-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">TECH_STACK</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								{techBadges.length} TECHNOLOGIES
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between rounded border border-border p-3">
								<div className="flex flex-wrap gap-1.5">
									{techBadges.length > 0 ? (
										techBadges
									) : (
										<span className="text-muted-foreground text-sm">
											No technologies selected
										</span>
									)}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={copyToClipboard}
									className={cn(
										"shrink-0",
										copied &&
											"border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
									)}
								>
									{copied ? (
										<Check className="h-3 w-3 text-primary" />
									) : (
										<Copy className="h-3 w-3" />
									)}
									{copied ? "COPIED!" : "COPY"}
								</Button>
							</div>
						</div>
					</div>

					{/* QR Code */}
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

					{/* Social Sharing */}
					<div className="space-y-2">
						<div className="font-medium text-foreground text-sm">
							Share on Social Media
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={shareToTwitter}
								className="flex-1"
							>
								<Twitter className="h-4 w-4" />
								Twitter
								<ExternalLink className="h-3 w-3" />
							</Button>
							<Button
								variant="outline"
								onClick={shareToLinkedIn}
								className="flex-1"
							>
								<Linkedin className="h-4 w-4" />
								LinkedIn
								<ExternalLink className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

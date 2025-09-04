"use client";

import { Check, Copy, Terminal, Twitter } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
	const { resolvedTheme } = useTheme();

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

	useEffect(() => {
		const generateQRCode = async () => {
			try {
				const isDark = resolvedTheme === "dark";
				const dataUrl = await QRCode.toDataURL(stackUrl, {
					width: 128,
					margin: 2,
					color: {
						dark: isDark ? "#cdd6f4" : "#11111b",
						light: isDark ? "#11111b" : "#ffffff",
					},
				});
				setQrCodeDataUrl(dataUrl);
			} catch (error) {
				console.error("Failed to generate QR code:", error);
				setQrCodeDataUrl("");
			}
		};

		if (stackUrl) {
			generateQRCode();
		}
	}, [stackUrl, resolvedTheme]);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="grid grid-cols-1 bg-fd-background sm:max-w-md">
				<DialogHeader className="border-border border-b pb-4">
					<div className="flex items-center gap-2">
						<Terminal className="h-4 w-4 text-primary" />
						<DialogTitle className="font-mono font-semibold text-foreground text-sm">
							SHARE_STACK.SH
						</DialogTitle>
					</div>
					<DialogDescription className="font-mono text-muted-foreground text-xs">
						$ ./share_configuration --export
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="rounded border border-border">
						<div className="border-border border-b px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-foreground text-xs">
									DEPENDENCIES.LIST
								</span>
								<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
									<span>•</span>
									<span>{techBadges.length} PACKAGES</span>
								</div>
							</div>
						</div>
						<div className="p-3">
							<div className="flex flex-wrap gap-1.5">
								{techBadges.length > 0 ? (
									techBadges
								) : (
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<span className="text-primary">$</span>
										<span>No technologies selected</span>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-foreground text-xs">
									QR_CODE.PNG
								</span>
							</div>
						</div>
						<div className="p-4">
							<div className="flex items-center justify-center rounded border border-border bg-muted/20 p-4">
								<div className="flex h-32 w-32 items-center justify-center">
									{qrCodeDataUrl ? (
										<Image
											src={qrCodeDataUrl}
											width={128}
											height={128}
											alt="QR Code for stack configuration"
											className="h-full w-full object-contain"
										/>
									) : (
										<div className="flex flex-col items-center gap-2 text-muted-foreground text-xs">
											<span className="text-primary">$</span>
											<span>Generating QR code...</span>
										</div>
									)}
								</div>
							</div>
							<div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground text-xs">
								<span className="text-primary">$</span>
								<span>scan --url stack_config</span>
							</div>
						</div>
					</div>

					<div className="rounded border border-border">
						<div className="border-border border-b px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-foreground text-xs">
									EXPORT_ACTIONS.SH
								</span>
							</div>
						</div>
						<div className="p-3">
							<div className="grid gap-2">
								<button
									type="button"
									onClick={shareToTwitter}
									className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 font-mono text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
								>
									<Twitter className="h-3 w-3" />
									<span className="text-primary">$</span>
									<span>./share --platform twitter</span>
								</button>

								<button
									type="button"
									onClick={copyToClipboard}
									className={cn(
										"flex items-center gap-2 rounded border px-3 py-2 font-mono text-xs transition-all",
										copied
											? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
											: "border-border bg-fd-background text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground",
									)}
								>
									{copied ? (
										<Check className="h-3 w-3" />
									) : (
										<Copy className="h-3 w-3" />
									)}
									<span className="text-primary">$</span>
									<span>
										{copied
											? "./copy --status success"
											: "./copy --url clipboard"}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

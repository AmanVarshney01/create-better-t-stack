import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function TechIcon({
	icon,
	name,
	className,
}: {
	icon: string;
	name: string;
	className?: string;
}) {
	const { theme } = useTheme();

	if (!icon) return null;

	if (!icon.startsWith("https://")) {
		return (
			<span className={cn("inline-flex items-center text-lg", className)}>
				{icon}
			</span>
		);
	}

	let iconSrc = icon;
	if (
		theme === "light" &&
		(icon.includes("drizzle") ||
			icon.includes("prisma") ||
			icon.includes("express") ||
			icon.includes("clerk") ||
			icon.includes("planetscale"))
	) {
		iconSrc = icon.replace(".svg", "-light.svg");
	}

	return (
		<Image
			suppressHydrationWarning
			src={iconSrc}
			alt={`${name} icon`}
			width={20}
			height={20}
			className={cn("inline-block", className)}
			unoptimized
		/>
	);
}

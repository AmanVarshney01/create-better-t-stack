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
  if (!icon) return null;

  // Handle URLs (CDN) and local paths (/icon/)
  if (icon.startsWith("https://") || icon.startsWith("/")) {
    return (
      <img
        src={icon}
        alt={`${name} icon`}
        width={20}
        height={20}
        className={cn("inline-block", className)}
      />
    );
  }

  // Handle text/emoji icons
  return <span className={cn("inline-flex items-center text-lg", className)}>{icon}</span>;
}

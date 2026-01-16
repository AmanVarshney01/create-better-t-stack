import { Link } from "@tanstack/react-router";
import { SiGithub, SiNpm, SiDiscord, SiX } from "react-icons/si";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/new", label: "Builder" },
  { href: "/analytics", label: "Analytics" },
  { href: "/showcase", label: "Showcase" },
];

const externalLinks = [
  {
    href: "https://www.npmjs.com/package/create-better-t-stack",
    icon: SiNpm,
    label: "NPM",
    className: "invert-0 dark:invert",
  },
  {
    href: "https://x.com/amanvarshney01",
    icon: SiX,
    label: "X",
    className: "invert dark:invert-0",
  },
  {
    href: "https://discord.gg/ZYsbjpDaM5",
    icon: SiDiscord,
    label: "Discord",
    className: "invert-0 dark:invert",
  },
  {
    href: "https://github.com/AmanVarshney01/create-better-t-stack",
    icon: SiGithub,
    label: "GitHub",
    className: "",
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Better-T-Stack" className="h-8 w-8" />
            <span className="font-medium font-mono text-md tracking-tighter">Better T Stack</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&.active]:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title={link.label}
              >
                <link.icon className={cn("h-4 w-4", link.className)} />
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-sm font-bold uppercase tracking-wider">
            Better Fullstack
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            <Link
              to="/new"
              className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              Builder
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Marve10s/Better-Fullstack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <div className="h-4 w-px bg-border" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

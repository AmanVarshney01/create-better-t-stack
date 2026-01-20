import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <span className="font-display text-sm font-semibold uppercase tracking-wider">
              Better Fullstack
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="text-sm text-muted-foreground">Type-safe TypeScript scaffolding</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/better-fullstack/create-better-fullstack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.npmjs.com/package/create-better-t-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="NPM"
            >
              <img
                src="/icon/npm.svg"
                alt="NPM"
                width={20}
                height={20}
                className="opacity-60 transition-opacity hover:opacity-100 dark:invert"
              />
            </a>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} Better Fullstack
          </p>
        </div>
      </div>
    </footer>
  );
}

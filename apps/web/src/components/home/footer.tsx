"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <a
            href="https://github.com/Marve10s/Better-Fullstack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/create-better-fullstack?activeTab=readme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            npm
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {new Date().getFullYear()} Better Fullstack · Built by{" "}
          <a
            href="https://elkamali.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            Ibrahim Elkamali
          </a>
        </p>
      </div>
    </footer>
  );
}

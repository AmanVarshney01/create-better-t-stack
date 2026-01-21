"use client";

import { Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";

import PackageIcon from "./icons";

export default function HeroSection() {
  const [selectedPM, setSelectedPM] = useState<"bun" | "pnpm" | "npm">("bun");
  const [copied, setCopied] = useState(false);

  const commands = {
    npm: "npx create-better-fullstack@latest",
    pnpm: "pnpm create better-fullstack@latest",
    bun: "bun create better-fullstack@latest",
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(commands[selectedPM]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center px-4 pt-12 pb-8 sm:pt-16">
      {/* Announcement Badge */}
      <div className="mb-6 flex items-center gap-2 text-xs sm:mb-8 sm:text-sm">
        <span className="rounded bg-foreground px-2 py-0.5 text-xs font-medium text-background">
          Fork
        </span>
        <span className="text-muted-foreground">
          Based on{" "}
          <a
            href="https://github.com/better-t-stack/create-better-t-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-4 hover:underline"
          >
            create-better-t-stack
          </a>
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="max-w-3xl text-center font-mono text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        The full-stack app scaffolder
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-xl text-center text-sm text-muted-foreground sm:mt-6 sm:text-lg">
        Production-ready templates with your choice of framework, database, auth, and more.
      </p>

      {/* Package Manager Tabs */}
      <div className="mt-8 w-full max-w-2xl sm:mt-10">
        <div className="flex border-b border-border">
          {(["bun", "pnpm", "npm"] as const).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setSelectedPM(pm)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
                selectedPM === pm
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <PackageIcon pm={pm} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {pm}
            </button>
          ))}
        </div>

        {/* Command Box + Builder Button Row */}
        <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-stretch sm:gap-3">
          <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 sm:px-4 sm:py-3">
            <code className="truncate font-mono text-xs sm:text-sm">{commands[selectedPM]}</code>
            <button
              type="button"
              onClick={copyCommand}
              className="ml-3 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground sm:ml-4"
              aria-label="Copy command"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
              ) : (
                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 sm:gap-2 sm:px-5 sm:text-sm"
          >
            Builder
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>

      {/* Terminal Demo */}
      <div className="mt-8 w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-[#0a0a0a] shadow-2xl sm:mt-12">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
          </div>
          <span className="font-mono text-[10px] text-white/50 sm:text-xs">terminal</span>
          <div className="w-[40px] sm:w-[52px]" />
        </div>

        {/* Terminal Content */}
        <div className="overflow-x-auto p-4 font-mono text-xs sm:p-6 sm:text-sm">
          {/* Mobile: Simple text logo */}
          <div className="mb-4 block sm:hidden">
            <span className="text-lg font-bold tracking-wider text-white">BETTER</span>
            <span className="text-lg font-bold tracking-wider text-white/40"> FULLSTACK</span>
          </div>

          {/* Desktop: ASCII Logo */}
          <div className="hidden leading-tight sm:block">
            <pre className="text-[10px] text-white md:text-xs lg:text-sm">
              {`  ██████╗ ███████╗████████╗████████╗███████╗██████╗
  ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
  ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
  ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
  ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
  ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝`}
            </pre>
            <pre className="text-[10px] text-white/40 md:text-xs lg:text-sm">
              {`  ███████╗██╗   ██╗██╗     ██╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗
  ██╔════╝██║   ██║██║     ██║     ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
  █████╗  ██║   ██║██║     ██║     ███████╗   ██║   ███████║██║     █████╔╝
  ██╔══╝  ██║   ██║██║     ██║     ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
  ██║     ╚██████╔╝███████╗███████╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗
  ╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
            </pre>
          </div>

          <div className="mt-4 space-y-1.5 text-white/70 sm:mt-6 sm:space-y-2">
            <p>
              <span className="text-green-400">❯</span>{" "}
              <span className="text-white">{commands[selectedPM]}</span>
            </p>
            <p className="text-white/50">┌ create-better-fullstack</p>
            <p className="text-white/50">│</p>
            <p>
              <span className="text-cyan-400">◆</span>{" "}
              <span className="text-white/50">Project name:</span>{" "}
              <span className="text-white">my-app</span>
            </p>
            <p>
              <span className="text-cyan-400">◆</span>{" "}
              <span className="text-white/50">Framework:</span>{" "}
              <span className="text-white">Tanstack Start</span>
            </p>
            <p>
              <span className="text-cyan-400">◆</span>{" "}
              <span className="text-white/50">Database:</span>{" "}
              <span className="text-white">PostgreSQL + Drizzle</span>
            </p>
            <p>
              <span className="text-cyan-400">◆</span> <span className="text-white/50">Auth:</span>{" "}
              <span className="text-white">Better Auth</span>
            </p>
            <p className="text-white/50">│</p>
            <p>
              <span className="text-green-400">✓</span>{" "}
              <span className="text-white">Project created successfully!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

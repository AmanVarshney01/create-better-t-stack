"use client";

import { Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import PackageIcon from "./icons";

type TerminalTab = "ts" | "rust" | "go" | "python";

type TerminalExample = {
  id: TerminalTab;
  tabLabel: string;
  iconUrl: string;
  title: string;
  projectName: string;
  ecosystemFlag?: string;
  stackSummary: string;
  accentTextClass: string;
  details: Array<{ label: string; value: string }>;
  footer: string;
};

const terminalExamples: TerminalExample[] = [
  {
    id: "ts",
    tabLabel: "TS",
    iconUrl: "https://cdn.simpleicons.org/typescript/3178C6",
    title: "TypeScript",
    projectName: "my-saas",
    stackSummary: "TanStack Start + Hono + tRPC",
    accentTextClass: "text-violet-300",
    details: [
      { label: "Database", value: "PostgreSQL · Drizzle ORM · Neon" },
      { label: "Auth", value: "Better Auth · Clerk" },
      { label: "Payments", value: "Stripe · Polar" },
      { label: "AI", value: "Vercel AI SDK · Mastra" },
      { label: "Addons", value: "Turborepo · Biome · PWA · Tauri" },
    ],
    footer: "Scaffolded in 420ms",
  },
  {
    id: "rust",
    tabLabel: "Rust",
    iconUrl: "https://cdn.simpleicons.org/rust/FFFFFF",
    title: "Rust",
    projectName: "api-server",
    ecosystemFlag: "--ecosystem rust",
    stackSummary: "Axum + SeaORM + Tonic (gRPC)",
    accentTextClass: "text-orange-300",
    details: [
      { label: "Frontend", value: "Leptos (WASM)" },
      { label: "CLI", value: "Clap · Ratatui" },
    ],
    footer: "Scaffolded in 180ms",
  },
  {
    id: "python",
    tabLabel: "Python",
    iconUrl: "https://cdn.simpleicons.org/python/3776AB",
    title: "Python",
    projectName: "ml-pipeline",
    ecosystemFlag: "--ecosystem python",
    stackSummary: "FastAPI + SQLAlchemy + Pydantic",
    accentTextClass: "text-blue-300",
    details: [
      { label: "AI", value: "LangChain · LangGraph · CrewAI" },
      { label: "Queue", value: "Celery · Ruff" },
    ],
    footer: "Scaffolded in 95ms",
  },
  {
    id: "go",
    tabLabel: "Go",
    iconUrl: "https://cdn.simpleicons.org/go/00ADD8",
    title: "Go",
    projectName: "microservice",
    ecosystemFlag: "--ecosystem go",
    stackSummary: "Gin + GORM + gRPC-Go",
    accentTextClass: "text-cyan-300",
    details: [
      { label: "CLI", value: "Cobra · Bubble Tea" },
      { label: "Logging", value: "Zap" },
    ],
    footer: "Scaffolded in 63ms",
  },
];

export default function HeroSection() {
  const [selectedPM, setSelectedPM] = useState<"bun" | "pnpm" | "npm">("bun");
  const [selectedTerminalTab, setSelectedTerminalTab] = useState<TerminalTab>("ts");
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

  const activeExample =
    terminalExamples.find((example) => example.id === selectedTerminalTab) ?? terminalExamples[0];

  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = contentRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    outer.style.height = `${outer.scrollHeight}px`;
    requestAnimationFrame(() => {
      outer.style.height = `${inner.scrollHeight}px`;
    });
  }, [selectedTerminalTab]);

  return (
    <div className="flex flex-col items-center px-4 pt-12 pb-8 sm:pt-16">
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
      <div className="mt-8 w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#0b0c0f] shadow-[0_20px_80px_-30px_rgba(0,0,0,0.8)] sm:mt-12">
        {/* Terminal Header — Ghostty-style tab bar */}
        <div className="flex divide-x divide-white/[0.07] border-b border-white/[0.08] bg-[#1c1c1e]">
          {terminalExamples.map((example) => {
            const isActive = selectedTerminalTab === example.id;
            return (
              <button
                key={example.id}
                type="button"
                onClick={() => setSelectedTerminalTab(example.id)}
                className="group relative flex flex-1 items-center justify-center py-2.5 transition-colors sm:py-3"
              >
                {isActive && (
                  <span className="absolute inset-x-2 inset-y-1 rounded-md bg-white/[0.12]" />
                )}
                <span
                  className={`relative flex items-center gap-1.5 font-mono text-[11px] sm:text-xs ${
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/65"
                  }`}
                >
                  <img
                    src={example.iconUrl}
                    alt={example.title}
                    width={14}
                    height={14}
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-65"}`}
                  />
                  <span>{example.tabLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Terminal Content */}
        <div
          ref={contentRef}
          className="overflow-hidden transition-[height] duration-300 ease-in-out"
        >
          <div ref={innerRef} className="p-4 font-mono text-xs sm:p-6 sm:text-sm">
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

            <div className="mt-4 sm:mt-6">
              <div key={activeExample.id} className="space-y-1.5 text-white/80">
                <p>
                  <span className="text-white/40">$</span>{" "}
                  <span className="text-white">
                    {commands[selectedPM]} {activeExample.projectName}
                    {activeExample.ecosystemFlag && (
                      <>
                        {" "}
                        <span className="text-white/40">{activeExample.ecosystemFlag}</span>
                      </>
                    )}
                  </span>
                </p>
                <p>
                  <span className={activeExample.accentTextClass}>★</span>{" "}
                  <span className={activeExample.accentTextClass}>{activeExample.title}</span>
                  <span className="text-white/30"> · </span>
                  <span className="text-white/70">{activeExample.stackSummary}</span>
                </p>

                {activeExample.details.map((detail) => (
                  <p key={detail.label} className="pl-3">
                    <span className="text-green-400">✔</span>{" "}
                    <span className="text-white/40">{detail.label} </span>
                    <span className="text-white/80">{detail.value}</span>
                  </p>
                ))}

                <p className="pt-1">
                  <span className="text-green-400">✔</span>{" "}
                  <span className="text-white/60">{activeExample.footer}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

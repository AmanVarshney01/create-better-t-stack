"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useState } from "react";

import PackageIcon from "./icons";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");

  const commands = {
    npm: "npx create-better-t-stack@latest",
    pnpm: "pnpm create better-t-stack@latest",
    bun: "bun create better-t-stack@latest",
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(commands[selectedPM]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex min-h-[80vh] items-center py-24">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="block text-foreground">Better</span>
            <span className="mt-2 inline-block border-2 border-foreground px-3 py-1 text-foreground">
              Fullstack
            </span>
          </h1>

          <p className="mt-10 max-w-md text-lg leading-relaxed text-muted-foreground">
            The Power of the Full Stack Builder in the Palm Of My Hand
          </p>

          <div className="mt-10">
            <Link
              to="/new"
              className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 font-semibold uppercase tracking-wider text-background transition-all hover:bg-foreground/90"
            >
              Start Building
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Quick Start
              </span>
              <div className="flex items-center gap-2">
                {(["bun", "pnpm", "npm"] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setSelectedPM(pm)}
                    className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium uppercase tracking-wider transition-all ${
                      selectedPM === pm
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <PackageIcon pm={pm} className="h-3 w-3" />
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-6">
              <code className="font-mono text-sm text-foreground">
                <span className="text-muted-foreground">$</span> {commands[selectedPM]}
              </code>
              <button
                type="button"
                onClick={copyCommand}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link
            to="/new"
            className="group mt-6 flex items-center justify-between border border-border bg-card p-6 transition-all hover:border-foreground"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Interactive
              </span>
              <p className="mt-1 font-semibold text-foreground">Use the Stack Builder</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}

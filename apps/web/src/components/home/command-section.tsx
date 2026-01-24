"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useState } from "react";

import PackageIcon from "./icons";

export default function CommandSection() {
  const [copied, setCopied] = useState(false);
  const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");

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
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Quick Start
        </span>
      </div>

      <div className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            {(["bun", "pnpm", "npm"] as const).map((pm) => (
              <button
                key={pm}
                type="button"
                onClick={() => setSelectedPM(pm)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${
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
          <button
            type="button"
            onClick={copyCommand}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="px-6 py-8">
          <code className="font-mono text-sm text-foreground sm:text-base">
            <span className="text-muted-foreground">$</span> {commands[selectedPM]}
          </code>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/new"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Or use the interactive builder
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

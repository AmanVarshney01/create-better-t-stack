"use client";

import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import PackageIcon from "../../icons";
import { GroupHeader } from "../chrome";

const COMMANDS = {
  bun: "bun create better-t-stack@latest",
  pnpm: "pnpm create better-t-stack@latest",
  npm: "npx create-better-t-stack@latest",
} as const;

type PackageManager = keyof typeof COMMANDS;

export default function InstallPane() {
  const [selected, setSelected] = useState<PackageManager>("bun");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(COMMANDS[selected]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div>
        <GroupHeader label="package manager" />
        <div className="flex items-center gap-5">
          {(Object.keys(COMMANDS) as PackageManager[]).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setSelected(pm)}
              aria-pressed={selected === pm}
              className={cn(
                "builder-focus-ring -my-2 flex items-center gap-2 py-2 font-mono text-[13px] transition-colors duration-150",
                selected === pm
                  ? "text-fd-foreground"
                  : "text-fd-muted-foreground hover:text-fd-foreground",
              )}
            >
              <PackageIcon pm={pm} className="h-3.5 w-3.5" />
              {pm}
            </button>
          ))}
        </div>
      </div>

      <div>
        <GroupHeader label="command" />
        <div className="flex items-start justify-between gap-4">
          <code className="font-mono text-[13px] leading-[1.55]">
            <span className="text-primary">$ </span>
            {COMMANDS[selected]}
          </code>
          <button
            type="button"
            onClick={copy}
            className="builder-focus-ring -my-2 flex shrink-0 items-center gap-1.5 py-2 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em] transition-colors duration-150 hover:text-fd-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>

      <span aria-hidden="true" className="h-px w-full bg-fd-border" />

      <div>
        <GroupHeader label="stack builder" />
        <p className="mb-3 font-mono text-[13px] text-fd-muted-foreground leading-[1.55]">
          Configure every option in the browser, then copy the generated command.
        </p>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <Link
            href="/new"
            className="builder-focus-ring font-mono text-[13px] text-primary transition-colors duration-150 hover:text-primary/70"
          >
            open builder -&gt;
          </Link>
          <Link
            href="/docs/cli/agent-workflows#mcp"
            className="builder-focus-ring font-mono text-[13px] text-fd-muted-foreground transition-colors duration-150 hover:text-primary"
          >
            or run it as an MCP server -&gt;
          </Link>
        </div>
      </div>
    </>
  );
}

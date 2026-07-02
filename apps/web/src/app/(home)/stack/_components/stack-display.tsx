"use client";

import { Check, Copy, Edit, Share2, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ShareDialog } from "@/components/ui/share-dialog";
import { TechBadge } from "@/components/ui/tech-badge";
import type { LoadedStackState } from "@/lib/stack-url-state";
import {
  formatProjectName,
  generateStackCommand,
  generateStackSharingUrl,
  generateStackSummary,
  generateStackUrlFromState,
  getSelectedTechs,
} from "@/lib/stack-utils";

type StackDisplayProps = {
  stackState: LoadedStackState;
};

export function StackDisplay({ stackState }: StackDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [stackUrl, setStackUrl] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStackUrl(generateStackSharingUrl(stackState, window.location.origin));
      setEditUrl(generateStackUrlFromState(stackState, window.location.origin));
    }
  }, [stackState]);

  const stack = stackState;
  const stackSummary = generateStackSummary(stack);

  const command = generateStackCommand({
    ...stackState,
    projectName: formatProjectName(stackState.projectName),
  });

  const techBadges = getSelectedTechs(stack).map((tech) => (
    <TechBadge
      key={`${tech.category}-${tech.id}`}
      icon={tech.icon}
      name={tech.name}
      category={tech.category}
    />
  ));

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Command copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy command");
    }
  };

  return (
    <main className="container mx-auto min-h-svh">
      <div className="mx-auto flex flex-col gap-8 px-4 pt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <span className="font-bold font-mono text-lg sm:text-xl">STACK_DISPLAY.SH</span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
            [{techBadges.length} DEPENDENCIES]
          </span>
        </div>

        <div className="space-y-2 rounded border border-border bg-fd-background p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">$</span>
            <span className="text-foreground">./display_stack --summary</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">&gt;</span>
            <span className="text-muted-foreground">{stackSummary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">$</span>
            <span className="text-muted-foreground">Stack loaded successfully</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={editUrl}>
            <button
              type="button"
              className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 font-mono text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
            >
              <Edit className="h-3 w-3" />
              <span>./edit --stack</span>
            </button>
          </Link>

          <ShareDialog stackUrl={stackUrl} stackState={stackState}>
            <button
              type="button"
              className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 font-mono text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
            >
              <Share2 className="h-3 w-3" />
              <span>./share --config</span>
            </button>
          </ShareDialog>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">▶</span>
            <span className="font-mono font-semibold text-foreground text-sm">
              GENERATE_COMMAND
            </span>
          </div>

          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center justify-between rounded border border-border bg-fd-background p-3"
            onClick={copyCommand}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                copyCommand();
              }
            }}
            aria-label="Copy generated command"
            title="Click to copy command"
          >
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-primary">$</span>
              <span className="text-foreground">{command}</span>
            </div>
            <span
              className={
                copied
                  ? "flex items-center gap-1 rounded border border-green-500/20 bg-green-500/10 px-2 py-1 font-mono text-green-600 text-xs transition-colors dark:text-green-400"
                  : "flex items-center gap-1 rounded border border-border px-2 py-1 font-mono text-xs transition-colors"
              }
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "COPIED!" : "COPY"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">▶</span>
            <span className="font-mono font-semibold text-foreground text-sm">
              DEPENDENCIES ({techBadges.length})
            </span>
          </div>

          {techBadges.length > 0 ? (
            <div className="flex flex-wrap gap-3">{techBadges}</div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-primary">$</span>
              <span>No technologies selected</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

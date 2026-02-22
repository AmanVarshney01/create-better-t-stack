"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  stackUrl: string;
}

export function ShareButton({ stackUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(stackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy share link"}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 text-muted-foreground transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      <span className="font-pixel text-[9px] leading-none">{copied ? "Copied!" : "Share"}</span>
    </button>
  );
}

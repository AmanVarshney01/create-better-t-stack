"use client";

import { Check, Copy, Link2, QrCode, Share2, SquareTerminal, Terminal } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import QRCode from "qrcode";
import React, { useEffect, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { StackState } from "@/lib/constant";
import {
  formatProjectName,
  generateStackCommand,
  generateStackOgImageUrl,
  getSelectedTechs,
} from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  children: React.ReactNode;
  stackUrl: string;
  stackState: StackState;
}

type CopyTarget = "url" | "command";

function CopyRow({
  icon,
  label,
  value,
  copied,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      title={`Copy ${label.toLowerCase()}`}
      className="builder-focus-ring group flex w-full min-w-0 items-center gap-2 rounded border border-border bg-muted/10 px-3 py-2 text-left transition-colors hover:border-muted-foreground/30 hover:bg-muted/25"
    >
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground text-xs group-hover:text-foreground">
        {value}
      </span>
      <span
        className={cn(
          "flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase transition-colors",
          copied
            ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
            : "border-border text-muted-foreground group-hover:text-foreground",
        )}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}

export function ShareDialog({ children, stackUrl, stackState }: ShareDialogProps) {
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [qrFailed, setQrFailed] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { resolvedTheme } = useTheme();

  const normalizedStack = { ...stackState, projectName: formatProjectName(stackState.projectName) };
  const projectName = normalizedStack.projectName;
  const command = generateStackCommand(normalizedStack);
  const ogImageUrl = generateStackOgImageUrl(normalizedStack);
  const selectedTechs = getSelectedTechs(stackState);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    };
  }, []);

  const copyValue = async (target: CopyTarget, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      toast.success(
        target === "url" ? "Link copied to clipboard!" : "Command copied to clipboard!",
      );
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopiedTarget(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareText = () => {
    const techNames = selectedTechs.map((tech) => tech.name);
    const summary = techNames.slice(0, 6).join(" · ");
    const rest = techNames.length > 6 ? ` +${techNames.length - 6} more` : "";
    return `${projectName} — my Better-T-Stack\n\n${summary}${rest}\n\n`;
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText());
    const url = encodeURIComponent(stackUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: projectName, text: shareText(), url: stackUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Failed to open share sheet");
    }
  };

  useEffect(() => {
    if (!showQr || !stackUrl) return;
    setQrFailed(false);
    const isDark = resolvedTheme === "dark";
    QRCode.toDataURL(stackUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: isDark ? "#cdd6f4" : "#11111b",
        light: isDark ? "#11111b" : "#ffffff",
      },
    })
      .then(setQrCodeDataUrl)
      .catch(() => {
        setQrCodeDataUrl("");
        setQrFailed(true);
      });
  }, [showQr, stackUrl, resolvedTheme]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          React.isValidElement(children) ? children : <button type="button">{children}</button>
        }
      />
      <DialogContent className="grid max-h-[85vh] grid-cols-1 gap-3 overflow-y-auto bg-fd-background sm:max-w-lg">
        <DialogHeader className="border-border border-b pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <DialogTitle className="font-mono font-semibold text-foreground text-sm">
              SHARE_STACK.SH
            </DialogTitle>
          </div>
          <DialogDescription className="font-mono text-muted-foreground text-xs">
            $ ./share --stack {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded border border-border">
          <div className="flex items-center gap-2 border-border border-b px-3 py-2">
            <span className="text-primary text-xs">▶</span>
            <span className="font-mono font-semibold text-foreground text-xs">
              SOCIAL_PREVIEW.PNG
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground uppercase">
              {selectedTechs.length} techs
            </span>
          </div>
          <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted/10">
            {!previewLoaded && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 font-mono text-muted-foreground text-xs">
                <span className="text-primary">$</span>
                <span className="animate-pulse">rendering preview...</span>
              </div>
            )}
            <Image
              src={ogImageUrl}
              alt={`Social preview card for ${projectName}`}
              width={1200}
              height={630}
              unoptimized
              onLoad={() => setPreviewLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                previewLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2">
          <CopyRow
            icon={<Link2 className="h-3.5 w-3.5" />}
            label="Link"
            value={stackUrl}
            copied={copiedTarget === "url"}
            onCopy={() => copyValue("url", stackUrl)}
          />
          <CopyRow
            icon={<SquareTerminal className="h-3.5 w-3.5" />}
            label="Command"
            value={command}
            copied={copiedTarget === "command"}
            onCopy={() => copyValue("command", command)}
          />
        </div>

        <div className={cn("grid gap-2", canNativeShare ? "grid-cols-3" : "grid-cols-2")}>
          <button
            type="button"
            onClick={shareToTwitter}
            className="builder-focus-ring flex items-center justify-center gap-1.5 rounded border border-border bg-muted/10 px-2 py-2 font-mono text-muted-foreground text-xs transition-colors hover:border-muted-foreground/30 hover:bg-muted/25 hover:text-foreground"
          >
            <FaXTwitter className="h-3 w-3" />
            Post
          </button>
          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="builder-focus-ring flex items-center justify-center gap-1.5 rounded border border-border bg-muted/10 px-2 py-2 font-mono text-muted-foreground text-xs transition-colors hover:border-muted-foreground/30 hover:bg-muted/25 hover:text-foreground"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowQr((prev) => !prev)}
            className={cn(
              "builder-focus-ring flex items-center justify-center gap-1.5 rounded border px-2 py-2 font-mono text-xs transition-colors",
              showQr
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-muted/10 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/25 hover:text-foreground",
            )}
          >
            <QrCode className="h-3 w-3" />
            QR
          </button>
        </div>

        {showQr && (
          <div className="flex flex-col items-center gap-2 rounded border border-border bg-muted/10 p-4">
            {qrCodeDataUrl ? (
              <Image
                src={qrCodeDataUrl}
                width={160}
                height={160}
                alt="QR code linking to this stack"
                className="h-40 w-40 rounded"
              />
            ) : qrFailed ? (
              <div className="flex h-40 w-40 items-center justify-center font-mono text-destructive text-xs">
                qr generation failed
              </div>
            ) : (
              <div className="flex h-40 w-40 items-center justify-center font-mono text-muted-foreground text-xs">
                <span className="animate-pulse">generating...</span>
              </div>
            )}
            <span className="font-mono text-[10px] text-muted-foreground">$ scan --open stack</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

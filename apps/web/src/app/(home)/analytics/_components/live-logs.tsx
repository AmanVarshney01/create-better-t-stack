"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, ChevronRight, Radio } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const LOG_FIELD_ORDER = [
  "frontend",
  "backend",
  "database",
  "orm",
  "api",
  "runtime",
  "packageManager",
  "auth",
  "payments",
  "dbSetup",
  "webDeploy",
  "serverDeploy",
  "addons",
  "examples",
  "cli_version",
  "node_version",
  "platform",
  "git",
  "install",
] as const;

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.length > 0 ? value.join(",") : "none";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value;
  return String(value);
}

function hasLogValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function formatStackSummary(event: Record<string, unknown>) {
  const frontend = Array.isArray(event.frontend)
    ? event.frontend.join("+")
    : (event.frontend as string | undefined);
  const backend = typeof event.backend === "string" ? event.backend : "none";
  const database = typeof event.database === "string" ? event.database : "none";
  const orm = typeof event.orm === "string" ? event.orm : "none";
  const packageManager =
    typeof event.packageManager === "string" ? event.packageManager : "unknown package manager";

  return `${frontend || "none"} / ${backend} -> ${database} + ${orm} via ${packageManager}`;
}

export function LiveLogs() {
  const [isOpen, setIsOpen] = useState(false);
  const events = useQuery(api.analytics.getRecentEvents, isOpen ? { limit: 25 } : "skip");

  return (
    <div className="overflow-hidden rounded border border-border bg-fd-background">
      <Button
        variant="ghost"
        className="group h-auto w-full rounded-none border-border border-b px-4 py-3 transition-colors hover:bg-muted/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground/70 transition-transform duration-200",
                isOpen && "rotate-90",
              )}
            />
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono font-medium text-[12px] text-foreground/90 uppercase tracking-wide">
              Recent project starts
            </span>
          </div>
          <span className="font-medium text-muted-foreground text-xs transition-colors group-hover:text-foreground/80">
            {isOpen ? "Hide feed" : "Show feed"}
          </span>
        </div>
      </Button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            style={{ overflow: "hidden" }}
          >
            {events === undefined ? (
              <div className="flex h-[220px] flex-col items-center justify-center border-border/10 border-t">
                <div className="flex items-center gap-2 font-mono text-muted-foreground text-xs">
                  <Activity className="h-3.5 w-3.5 animate-pulse text-primary" />
                  Loading latest starts
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center border-border/10 border-t">
                <div className="flex flex-col items-center gap-3 opacity-70">
                  <div className="rounded border border-border bg-muted/20 p-3">
                    <Radio className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-medium text-muted-foreground text-sm">No recent activity</p>
                    <p className="text-muted-foreground/70 text-xs">
                      The feed will populate as new anonymous CLI events arrive.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[400px] border-border/10 border-t">
                <div className="border-border/60 border-b bg-muted/10 px-4 py-2">
                  <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
                    <span className="text-muted-foreground uppercase tracking-wide">
                      stream: project.starts
                    </span>
                    <span className="text-muted-foreground">{events.length} events</span>
                  </div>
                </div>
                <div className="divide-y divide-border/35">
                  <AnimatePresence initial={false} mode="popLayout">
                    {events.map((event, index) => {
                      const time = eventTimeFormatter.format(new Date(event._creationTime));
                      const eventRecord = event as Record<string, unknown>;
                      const logFields = LOG_FIELD_ORDER.flatMap((key) =>
                        hasLogValue(eventRecord[key])
                          ? [{ key, value: formatValue(eventRecord[key]) }]
                          : [],
                      );
                      const eventId = String(event._id).slice(-6);

                      return (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: Math.min(index * 0.035, 0.35) }}
                          className="grid gap-3 px-4 py-3 transition-colors hover:bg-muted/20 sm:grid-cols-[104px_minmax(0,1fr)]"
                        >
                          <div className="flex items-start gap-2 sm:block">
                            <span
                              suppressHydrationWarning
                              className="font-mono text-muted-foreground text-[11px] tabular-nums"
                            >
                              {time}
                            </span>
                            <span className="hidden font-mono text-muted-foreground/60 text-[10px] sm:mt-1 sm:block">
                              #{String(events.length - index).padStart(2, "0")}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary uppercase tracking-wide">
                                project.start
                              </span>
                              <span className="min-w-0 truncate font-mono text-[12px] text-foreground">
                                {formatStackSummary(eventRecord)}
                              </span>
                              <span className="font-mono text-muted-foreground/70 text-[10px]">
                                id={eventId}
                              </span>
                            </div>

                            <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1.5">
                              {logFields.map(({ key, value }) => (
                                <code
                                  key={key}
                                  className="max-w-full rounded border border-border/70 bg-muted/15 px-1.5 py-0.5 font-mono text-[11px] leading-5"
                                >
                                  <span className="text-muted-foreground">{key}=</span>
                                  <span className="break-all text-foreground/90">{value}</span>
                                </code>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

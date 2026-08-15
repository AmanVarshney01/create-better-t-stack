"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { Activity, ChevronRight, Radio } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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

type RecentAnalyticsEvent = FunctionReturnType<typeof api.analytics.getRecentEvents>[number];
type LogValue = RecentAnalyticsEvent[(typeof LOG_FIELD_ORDER)[number]];

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatValue(value: LogValue): string {
  if (Array.isArray(value)) return value.length > 0 ? value.join(",") : "none";
  if (value === true) return "true";
  if (value === false) return "false";
  return String(value);
}

function hasLogValue(value: LogValue): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function formatStackSummary(event: RecentAnalyticsEvent) {
  const frontend = event.frontend?.join("+");
  const backend = event.backend ?? "none";
  const database = event.database ?? "none";
  const orm = event.orm ?? "none";
  const packageManager = event.packageManager ?? "unknown package manager";

  return `${frontend || "none"} / ${backend} -> ${database} + ${orm} via ${packageManager}`;
}

export function LiveLogs() {
  const [isOpen, setIsOpen] = useState(false);
  const events = useQuery(api.analytics.getRecentEvents, isOpen ? { limit: 25 } : "skip");

  return (
    <div className="rounded-[4px] border">
      <button
        type="button"
        aria-expanded={isOpen}
        className="builder-focus-ring group flex w-full items-center justify-between gap-4 border-b px-4 py-2.5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2.5">
          <ChevronRight
            className={cn(
              "h-3 w-3 text-fd-muted-foreground/70 transition-transform duration-150",
              isOpen && "rotate-90",
            )}
          />
          <Activity className="h-3 w-3 text-primary" />
          <span className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em] transition-colors duration-150 group-hover:text-fd-foreground">
            Recent project starts
          </span>
        </span>
        <span className="text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 group-hover:text-fd-foreground">
          {isOpen ? "Hide feed" : "Show feed"}
        </span>
      </button>

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
              <div className="flex h-[220px] flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                  <Activity className="h-3 w-3 animate-pulse text-primary" />
                  Loading latest starts
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Radio className="h-4 w-4 text-fd-muted-foreground/60" />
                  <div className="space-y-1 text-center">
                    <p className="text-[13px] text-fd-muted-foreground leading-[1.55]">
                      No recent activity
                    </p>
                    <p className="text-[11px] text-fd-muted-foreground/70 leading-[1.5]">
                      The feed will populate as new anonymous CLI events arrive.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="border-b px-4 py-2">
                  <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.10em]">
                    <span className="text-fd-muted-foreground">stream: project.starts</span>
                    <span className="text-fd-muted-foreground/70 tabular-nums">
                      {events.length} events
                    </span>
                  </div>
                </div>
                <div className="divide-y">
                  <AnimatePresence initial={false} mode="popLayout">
                    {events.map((event, index) => {
                      const time = eventTimeFormatter.format(new Date(event._creationTime));
                      const logFields = LOG_FIELD_ORDER.flatMap((key) =>
                        hasLogValue(event[key]) ? [{ key, value: formatValue(event[key]) }] : [],
                      );
                      const eventId = String(event._id).slice(-6);

                      return (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: Math.min(index * 0.035, 0.35) }}
                          className="grid gap-3 px-4 py-3 sm:grid-cols-[104px_minmax(0,1fr)]"
                        >
                          <div className="flex items-start gap-2 sm:block">
                            <span
                              suppressHydrationWarning
                              className="text-[11px] text-fd-muted-foreground tabular-nums"
                            >
                              {time}
                            </span>
                            <span className="hidden text-[10px] text-fd-muted-foreground/50 tabular-nums sm:mt-1 sm:block">
                              #{String(events.length - index).padStart(2, "0")}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="text-[10px] text-primary uppercase tracking-[0.10em]">
                                project.start
                              </span>
                              <span className="min-w-0 break-words text-[13px] leading-[1.55]">
                                {formatStackSummary(event)}
                              </span>
                              <span className="text-[10px] text-fd-muted-foreground/70">
                                id={eventId}
                              </span>
                            </div>

                            <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                              {logFields.map(({ key, value }) => (
                                <code key={key} className="max-w-full text-[11px] leading-[1.5]">
                                  <span className="text-fd-muted-foreground">{key}=</span>
                                  <span className="break-all">{value}</span>
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

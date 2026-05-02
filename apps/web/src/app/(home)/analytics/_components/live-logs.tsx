"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, ChevronRight, Radio } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return String(value);
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
                <div className="divide-y divide-border/35">
                  <AnimatePresence initial={false} mode="popLayout">
                    {events.map((event, index) => {
                      const time = eventTimeFormatter.format(new Date(event._creationTime));
                      const logData = Object.fromEntries(
                        Object.entries(event).filter(
                          ([key]) => key !== "_id" && key !== "_creationTime",
                        ),
                      );

                      return (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: Math.min(index * 0.035, 0.35) }}
                          className="grid gap-3 px-4 py-3 transition-colors hover:bg-muted/20 sm:grid-cols-[86px_minmax(0,1fr)]"
                        >
                          <span
                            suppressHydrationWarning
                            className="text-muted-foreground text-xs tabular-nums"
                          >
                            {time}
                          </span>

                          <div className="flex min-w-0 flex-wrap gap-2">
                            {Object.entries(logData).map(([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex max-w-full items-center gap-1.5 rounded border border-border bg-fd-background px-2 py-1 text-xs"
                              >
                                <span className="shrink-0 text-muted-foreground">{key}</span>
                                <span className="min-w-0 truncate font-medium text-foreground/90">
                                  {formatValue(value)}
                                </span>
                              </span>
                            ))}
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

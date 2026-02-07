"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { ChevronRight, Radio, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function LiveLogs() {
  const [isOpen, setIsOpen] = useState(false);

  // Only fetch when expanded - pass "skip" to skip the query when closed
  const events = useQuery(api.analytics.getRecentEvents, isOpen ? {} : "skip");

  return (
    <div className="overflow-hidden rounded-xl bg-fd-background/85 ring-1 ring-border/35">
      <Button
        variant="ghost"
        className="group h-auto w-full rounded-none border-border/25 border-b px-4 py-3 transition-all duration-200 hover:bg-muted/25"
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
            <Terminal className="h-3.5 w-3.5 text-primary/90" />
            <span className="font-mono font-medium text-[13px] tracking-tight text-foreground/90">
              LIVE_PROJECT_LOGS.SH
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider transition-colors group-hover:text-foreground/80">
            {isOpen ? "[COLLAPSE]" : "[EXPAND FEED]"}
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
            <div className="bg-fd-background/80">
              {!events || events.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center border-border/10 border-t">
                  <div className="flex flex-col items-center gap-3 opacity-60">
                    <div className="rounded-full bg-muted/20 p-3">
                      <Radio className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="font-mono font-medium text-muted-foreground text-xs tracking-tight">
                        NO_RECENT_ACTIVITY.LOG
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                        Listening for events...
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/40">
                      <span className="text-primary/60">$</span>
                      <span>tail -f /logs/live</span>
                      <span className="block h-3 w-1.5 animate-pulse bg-primary/40"></span>
                    </div>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[400px] border-border/10 border-t">
                  <div className="flex flex-col py-2 font-mono text-sm">
                    <AnimatePresence initial={false} mode="popLayout">
                      {events.map((event, index) => {
                        const time = new Date(event._creationTime).toLocaleTimeString([], {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        });

                        const { _id, _creationTime, ...logData } = event;

                        return (
                          <motion.div
                            key={event._id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="group flex items-baseline gap-3 px-4 py-1 transition-colors hover:bg-muted/20"
                          >
                            <span
                              suppressHydrationWarning
                              className="w-[65px] shrink-0 text-muted-foreground/45 text-xs tabular-nums"
                            >
                              {time}
                            </span>

                            <div className="flex min-w-0 flex-1 items-baseline gap-3 text-sm">
                              <span className="shrink-0 font-bold text-emerald-500/90 text-xs">
                                INFO
                              </span>
                              <div className="flex flex-nowrap items-baseline gap-x-3">
                                {Object.entries(logData).map(([key, value]) => (
                                  <span key={key} className="whitespace-nowrap">
                                    <span className="mr-1 text-muted-foreground/55 text-xs">
                                      {key}=
                                    </span>
                                    <span className="text-foreground/90">
                                      {Array.isArray(value)
                                        ? `[${value.map((v) => `"${v}"`).join(",")}]`
                                        : typeof value === "string"
                                          ? `"${value}"`
                                          : String(value)}
                                    </span>
                                  </span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

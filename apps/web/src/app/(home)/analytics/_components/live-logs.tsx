"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { ChevronRight, Terminal, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function LiveLogs() {
  const [isOpen, setIsOpen] = useState(false);

  // Only fetch when expanded - pass "skip" to skip the query when closed
  const events = useQuery(api.analytics.getAllEvents, isOpen ? { range: "30m" } : "skip");

  return (
    <div className="rounded-md border border-border bg-[#0C0C0C] overflow-hidden shadow-sm">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-3 h-auto hover:bg-[#1A1A1A] rounded-none group border-b border-border/40 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/70 transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
          <Terminal className="h-3.5 w-3.5 text-primary/80" />
          <span className="font-mono text-[13px] font-medium tracking-tight text-foreground/90">
            LIVE_PROJECT_LOGS.SH
          </span>
        </div>
        <span className="text-muted-foreground/60 text-[10px] font-mono group-hover:text-foreground/80 transition-colors uppercase tracking-wider">
          {isOpen ? "[COLLAPSE]" : "[EXPAND FEED]"}
        </span>
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
            <div className="bg-[#050505]">
              {!events || events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] border-t border-border/10">
                  <div className="flex flex-col items-center gap-3 opacity-60">
                    <div className="rounded-full bg-muted/5 p-3 ring-1 ring-white/5">
                      <Radio className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-mono text-muted-foreground text-xs font-medium tracking-tight">
                        NO_RECENT_ACTIVITY.LOG
                      </p>
                      <p className="text-muted-foreground/40 text-[10px] uppercase tracking-wider">
                        Listening for events...
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/30 mt-1 font-mono">
                      <span className="text-primary/50">$</span>
                      <span>tail -f /logs/live</span>
                      <span className="animate-pulse w-1.5 h-3 bg-primary/40 block"></span>
                    </div>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[400px] border-t border-border/10">
                  <div className="flex flex-col font-mono text-sm py-2">
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
                            className="group flex gap-3 px-4 py-1 hover:bg-white/[0.04] transition-colors items-baseline"
                          >
                            <span
                              suppressHydrationWarning
                              className="text-xs text-muted-foreground/40 tabular-nums shrink-0 font-medium w-[65px]"
                            >
                              {time}
                            </span>

                            <div className="flex items-baseline gap-3 min-w-0 text-sm flex-1">
                              <span className="text-emerald-500/90 font-bold shrink-0 text-xs">
                                INFO
                              </span>
                              <div className="flex flex-nowrap gap-x-3 items-baseline">
                                {Object.entries(logData).map(([key, value]) => (
                                  <span key={key} className="whitespace-nowrap">
                                    <span className="text-muted-foreground/50 text-xs mr-1">
                                      {key}=
                                    </span>
                                    <span className="text-[#DDD]">
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

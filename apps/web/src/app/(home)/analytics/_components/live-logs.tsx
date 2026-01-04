"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Terminal, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LiveLogs() {
  const events = useQuery(api.analytics.getAllEvents, { range: "30m" });
  const [isOpen, setIsOpen] = useState(false);

  if (events === undefined) return null;

  return (
    <div className="rounded border border-border bg-fd-background overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-4 h-auto hover:bg-muted/10 rounded-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-bold font-mono text-sm">LIVE_PROJECT_LOGS.SH</span>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-primary leading-none">
              ONLINE
            </span>
          </div>
        </div>
        <span className="text-muted-foreground text-xs font-mono group-hover:text-foreground transition-colors">
          {isOpen ? "[COLLAPSE]" : `[${events.length} EVENTS]`}
        </span>
      </Button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-border p-4 bg-muted/5 font-mono text-xs">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="rounded-full border border-border bg-fd-background p-3">
                    <Radio className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-mono text-muted-foreground text-sm">
                      NO_RECENT_ACTIVITY.LOG
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                      No projects created in the last 30 minutes
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/50 mt-2">
                    <span className="text-primary">$</span>
                    <span>awaiting next scaffold event...</span>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {events.map((event) => {
                      const timeAgo = formatDistanceToNow(event._creationTime, { addSuffix: true });
                      const time = new Date(event._creationTime).toLocaleTimeString([], {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });

                      return (
                        <motion.div
                          key={event._id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="rounded border border-border/50 bg-fd-background p-3 hover:border-border transition-colors"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30">
                            <div className="flex items-center gap-2">
                              <span className="text-primary">{">"}</span>
                              <span className="font-semibold text-foreground">
                                New Project Created
                              </span>
                              {event.packageManager && (
                                <span
                                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    event.packageManager === "bun"
                                      ? "bg-orange-500/10 text-orange-500"
                                      : event.packageManager === "pnpm"
                                        ? "bg-yellow-500/10 text-yellow-500"
                                        : "bg-red-500/10 text-red-500"
                                  }`}
                                >
                                  {event.packageManager}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
                              <span>{time}</span>
                              <span className="opacity-50">({timeAgo})</span>
                            </div>
                          </div>

                          {/* Stack Info */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px]">
                            {event.frontend && event.frontend.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">frontend:</span>
                                <span className="text-accent">{event.frontend.join(", ")}</span>
                              </div>
                            )}
                            {event.backend && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">backend:</span>
                                <span className="text-accent">{event.backend}</span>
                              </div>
                            )}
                            {event.database && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">database:</span>
                                <span className="text-accent">{event.database}</span>
                              </div>
                            )}
                            {event.orm && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">orm:</span>
                                <span className="text-accent">{event.orm}</span>
                              </div>
                            )}
                            {event.api && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">api:</span>
                                <span className="text-accent">{event.api}</span>
                              </div>
                            )}
                            {event.auth && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">auth:</span>
                                <span className="text-accent">{event.auth}</span>
                              </div>
                            )}
                            {event.runtime && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">runtime:</span>
                                <span className="text-accent">{event.runtime}</span>
                              </div>
                            )}
                            {event.platform && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">platform:</span>
                                <span className="text-accent">{event.platform}</span>
                              </div>
                            )}
                            {event.dbSetup && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">db_setup:</span>
                                <span className="text-accent">{event.dbSetup}</span>
                              </div>
                            )}
                            {event.addons && event.addons.length > 0 && (
                              <div className="flex items-center gap-1.5 col-span-2">
                                <span className="text-muted-foreground">addons:</span>
                                <span className="text-accent">{event.addons.join(", ")}</span>
                              </div>
                            )}
                            {event.examples && event.examples.length > 0 && (
                              <div className="flex items-center gap-1.5 col-span-2">
                                <span className="text-muted-foreground">examples:</span>
                                <span className="text-accent">{event.examples.join(", ")}</span>
                              </div>
                            )}
                            {event.cli_version && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">cli:</span>
                                <span className="text-accent">{event.cli_version}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

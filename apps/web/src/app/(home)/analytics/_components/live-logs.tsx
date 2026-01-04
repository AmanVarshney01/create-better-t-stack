"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Terminal, Activity, Server, Database, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { ScrollArea } from "@/components/ui/scroll-area";

export function LiveLogs() {
  const events = useQuery(api.analytics.getAllEvents, { range: "1d" });

  if (!events) {
    return (
      <div className="rounded border border-border bg-fd-background p-4 animate-pulse h-[300px]">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-bold font-mono text-sm">LIVE_PROJECT_LOGS.SH</span>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-muted/20 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-border bg-fd-background p-4 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-bold font-mono text-lg sm:text-lg">LIVE_PROJECT_LOGS.SH</span>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-primary">ONLINE</span>
          </div>
        </div>
        <span className="text-muted-foreground text-xs font-mono hidden sm:inline-block">
          [{events.length} EVENTS BUFFERED]
        </span>
      </div>

      <div className="flex-1 min-h-0 rounded border border-border/50 bg-muted/10 font-mono text-xs sm:text-sm overflow-hidden relative">
        <ScrollArea className="h-full w-full p-4">
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {events.map((event) => {
                const stackParts = [];
                if (event.backend) stackParts.push(event.backend);
                if (event.frontend && event.frontend.length > 0) stackParts.push(event.frontend[0]);
                if (event.database) stackParts.push(event.database);

                const stackString = stackParts.join(" + ");
                const timeAgo = formatDistanceToNow(event._creationTime, { addSuffix: true });

                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-1.5 border-b border-border/30 last:border-0 hover:bg-muted/10 px-2 rounded-sm"
                  >
                    <div className="flex items-center gap-2 min-w-[140px] text-muted-foreground">
                      <span className="text-primary/70 shrink-0 select-none">{">"}</span>
                      <span className="shrink-0 font-medium tabular-nums opacity-70 w-[110px]">
                        {new Date(event._creationTime).toLocaleTimeString([], {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="text-foreground font-semibold">New Project Scaffolded</span>
                      <span className="text-muted-foreground hidden sm:inline">-</span>
                      <div className="flex items-center gap-1.5 text-accent">{stackString}</div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[10px] sm:text-xs">
                      <span
                        className={`px-1.5 py-0.5 rounded border ${
                          event.packageManager === "bun"
                            ? "border-orange-500/20 text-orange-500 bg-orange-500/10"
                            : event.packageManager === "pnpm"
                              ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/10"
                              : "border-red-500/20 text-red-500 bg-red-500/10"
                        }`}
                      >
                        {event.packageManager}
                      </span>
                      <span className="text-muted-foreground w-[80px] text-right truncate">
                        {timeAgo}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {events.length === 0 && (
              <div className="text-muted-foreground italic py-4 text-center">
                // Waiting for incoming connections...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Scanline effect overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
      </div>
    </div>
  );
}

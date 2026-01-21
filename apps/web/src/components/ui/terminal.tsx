"use client";

import { motion, MotionProps, useInView } from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

// Context for sequencing
interface TerminalContextValue {
  registerChild: (id: string, duration: number) => number;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

interface AnimatedSpanProps extends Omit<MotionProps, "children"> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedSpan = ({ children, delay = 0, className, ...props }: AnimatedSpanProps) => {
  const context = useContext(TerminalContext);
  const [computedDelay, setComputedDelay] = useState(delay);
  const idRef = useRef(Math.random().toString(36));

  useEffect(() => {
    if (context) {
      const d = context.registerChild(idRef.current, 300);
      setComputedDelay(d);
    }
  }, [context]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: computedDelay / 1000 }}
      className={cn("grid text-sm font-normal tracking-tight", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface TypingAnimationProps extends Omit<MotionProps, "children"> {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 50,
  delay = 0,
  ...props
}: TypingAnimationProps) => {
  const context = useContext(TerminalContext);
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [computedDelay, setComputedDelay] = useState(delay);
  const idRef = useRef(Math.random().toString(36));

  const typingDuration = children.length * duration;

  useEffect(() => {
    if (context) {
      const d = context.registerChild(idRef.current, typingDuration + 200);
      setComputedDelay(d);
    }
  }, [context, typingDuration]);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), computedDelay);
    return () => clearTimeout(timeout);
  }, [computedDelay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, duration);

    return () => clearInterval(interval);
  }, [children, duration, started]);

  return (
    <motion.span className={cn("text-sm font-normal tracking-tight", className)} {...props}>
      {displayedText}
      {started && displayedText.length < children.length && (
        <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-foreground" />
      )}
    </motion.span>
  );
};

interface TerminalProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const Terminal = ({ children, className, title = "terminal" }: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const delayMapRef = useRef<Map<string, number>>(new Map());
  const totalDelayRef = useRef(0);

  const registerChild = (id: string, duration: number): number => {
    if (delayMapRef.current.has(id)) {
      return delayMapRef.current.get(id)!;
    }
    const delay = totalDelayRef.current;
    delayMapRef.current.set(id, delay);
    totalDelayRef.current += duration;
    return delay;
  };

  return (
    <TerminalContext.Provider value={{ registerChild }}>
      <div
        ref={containerRef}
        className={cn(
          "w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
          <div className="w-[52px]" /> {/* Spacer for centering */}
        </div>

        {/* Body */}
        <div className="bg-[#0a0a0a] p-6">
          {isInView && (
            <pre className="font-mono">
              <code className="grid gap-y-1 text-sm">{children}</code>
            </pre>
          )}
        </div>
      </div>
    </TerminalContext.Provider>
  );
};

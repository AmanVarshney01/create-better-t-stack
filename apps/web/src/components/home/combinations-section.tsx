"use client";

import { Infinity, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const funFacts = [
  "That's 83 trillion universe lifetimes to test all combinations",
  "More combinations than atoms in the observable universe",
  "Each combination creates a unique, production-ready app",
];

function GlowingNumber() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      {/* Main number */}
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-5xl font-bold font-mono text-foreground sm:text-7xl">3.64</span>
        <span className="text-3xl font-bold font-mono text-foreground sm:text-5xl">× 10</span>
        <span className="text-2xl font-bold font-mono text-muted-foreground sm:text-3xl">34</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">possible project combinations</p>

      {/* Rotating fun facts */}
      <div className="mt-4 h-6 overflow-hidden">
        <p
          key={factIndex}
          className="text-xs text-muted-foreground/80 italic animate-in fade-in slide-in-from-bottom-2 duration-500 sm:text-sm"
        >
          {funFacts[factIndex]}
        </p>
      </div>
    </div>
  );
}

export default function CombinationsSection() {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <div className="flex items-center gap-2">
          <Infinity className="h-5 w-5 text-foreground" />
          <h2 className="font-pixel text-lg font-bold sm:text-xl">Infinite Possibilities</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Mix and match frameworks, databases, auth, payments, AI, and more to create your perfect
          stack.
        </p>

        {/* Big Number Display */}
        <div className="mt-8 py-8 sm:mt-12">
          <GlowingNumber />
        </div>

        {/* Universe comparison */}
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">How long to test every combination?</p>
            <p className="mt-1 text-muted-foreground">
              At 1ms per test: <span className="font-mono text-foreground">1.15 × 10²⁴ years</span>{" "}
              — that's{" "}
              <span className="font-medium text-foreground">83 trillion universe lifetimes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

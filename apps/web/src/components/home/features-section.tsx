"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

const features = [
  {
    title: "4 ecosystems",
    description: "TypeScript, Rust, Python, and Go with native tooling for each",
  },
  {
    title: "15 frontend frameworks",
    description: "Web, native mobile, and WASM frontends across all ecosystems",
  },
  {
    title: "17 backend frameworks",
    description: "From lightweight to batteries-included, across all four languages",
  },
  {
    title: "6 databases & 13 ORMs",
    description: "SQL, NoSQL, and graph databases with type-safe query builders",
  },
  {
    title: "6 auth providers",
    description: "Self-hosted and managed authentication out of the box",
  },
  {
    title: "5 payment integrations",
    description: "Subscriptions, one-time payments, and usage-based billing",
  },
  {
    title: "12 AI integrations",
    description: "Agent frameworks, LLM SDKs, and orchestration tools",
  },
  {
    title: "7 type-safe APIs & gRPC",
    description: "End-to-end type safety and high-performance RPC",
  },
  {
    title: "6 real-time & 4 job queues",
    description: "WebSockets, CRDT collaboration, and background task processing",
  },
  {
    title: "11 UI libraries",
    description: "Accessible component systems and design primitives",
  },
  {
    title: "Native & desktop apps",
    description: "Mobile, desktop, and browser extension targets",
  },
  {
    title: "5 deploy targets",
    description: "Edge, serverless, containers, and infrastructure-as-code",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <h2 className="font-pixel text-lg font-bold sm:text-xl">What is Better Fullstack?</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          A CLI that scaffolds production-ready apps with your preferred tech stack. Choose from
          270+ options across 4 ecosystems, frameworks, databases, auth, payments, AI, and more.
        </p>

        {/* Features List */}
        <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex items-start gap-2 sm:gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground sm:h-5 sm:w-5" />
              <div className="text-sm sm:text-base">
                <span className="font-medium">{feature.title}</span>
                <span className="text-muted-foreground"> — {feature.description}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to="/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90 sm:mt-8 sm:gap-2 sm:px-4 sm:text-sm"
        >
          Try it now
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </section>
  );
}

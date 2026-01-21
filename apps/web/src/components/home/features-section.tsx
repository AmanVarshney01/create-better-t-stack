"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

const features = [
  {
    title: "TypeScript & Rust",
    description: "Full ecosystem support for both languages with modern tooling",
  },
  {
    title: "12+ frontend frameworks",
    description: "Next.js, TanStack Start, Nuxt, Svelte, Solid, Astro, Qwik, Angular, and more",
  },
  {
    title: "10+ backend frameworks",
    description: "Hono, Elysia, Express, Fastify, NestJS, Nitro, Convex, and more",
  },
  {
    title: "Flexible database options",
    description: "PostgreSQL, MySQL, SQLite, MongoDB with Drizzle, Prisma, or 5 other ORMs",
  },
  {
    title: "Type-safe APIs",
    description: "tRPC, oRPC, ts-rest, or Garph for end-to-end type safety",
  },
  {
    title: "Auth & payments ready",
    description: "Better Auth, Clerk, plus Stripe, Polar, Paddle, Lemon Squeezy",
  },
  {
    title: "AI integrations",
    description: "Vercel AI SDK, Mastra, VoltAgent, LangGraph, OpenAI Agents SDK",
  },
  {
    title: "Real-time & job queues",
    description: "Socket.IO, PartyKit, Liveblocks, BullMQ, Trigger.dev, Inngest",
  },
  {
    title: "Native & desktop apps",
    description: "Expo for mobile, Tauri for desktop, WXT for browser extensions",
  },
  {
    title: "Deploy anywhere",
    description: "Cloudflare Workers, Vercel, Railway, Fly.io, and more",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <h2 className="font-mono text-lg font-bold sm:text-xl">What is Better Fullstack?</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          A CLI that scaffolds production-ready apps with your preferred tech stack. Choose from
          100+ options across frameworks, databases, auth, payments, AI, and more.
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

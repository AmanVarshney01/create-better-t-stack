"use client";

import { Github, Heart, Linkedin, Twitter } from "lucide-react";
import { motion } from "motion/react";

export default function SponsorSection() {
  return (
    <section className="border-t border-border py-24">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              support.sh
            </span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
              <div className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
              <div className="h-2 w-2 rounded-full bg-[#28c840]/70" />
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>

            <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Support the Project
            </h2>

            <p className="mt-4 max-w-md text-muted-foreground">
              If you find Better Fullstack useful, consider supporting its development. Your
              sponsorship helps maintain and improve the project.
            </p>

            {/* Terminal-style command */}
            <div className="mt-6 rounded-md bg-muted/50 px-4 py-3">
              <code className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">$</span> open patreon.com/marve10s
              </code>
            </div>

            <a
              href="https://www.patreon.com/c/marve10s"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-3 bg-foreground px-6 py-3 font-semibold uppercase tracking-wider text-background transition-all hover:bg-foreground/90"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z" />
              </svg>
              Become a Patron
            </a>
          </div>
        </motion.div>

        {/* Connect Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              connect.sh
            </span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
              <div className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
              <div className="h-2 w-2 rounded-full bg-[#28c840]/70" />
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Let's Connect
            </h2>

            <p className="mt-4 max-w-md text-muted-foreground">
              Follow my socials or visit my portfolio for more projects and updates.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://www.linkedin.com/in/ibrahim-elkamali-94a466292/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://x.com/MARVELOUSBC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />X (Twitter)
              </a>
              <a
                href="https://github.com/Marve10s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>

            {/* Portfolio Link */}
            <div className="mt-6 rounded-md bg-muted/50 px-4 py-3">
              <code className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">$</span> curl{" "}
                <a
                  href="https://elkamali.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  elkamali.dev
                </a>
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

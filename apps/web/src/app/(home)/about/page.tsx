export const dynamic = "force-static";

import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { NPM_PACKAGE_URL, REPOSITORY_URL, SITE_URL } from "@/lib/site";

import { TrustPage, TrustSection, trustPageLinkClass } from "../_components/trust-page";

const description =
  "How Better-T-Stack helps developers and coding agents create modern TypeScript applications.";

export const metadata: Metadata = {
  title: "About - Better-T-Stack",
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About - Better-T-Stack",
    description,
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <TrustPage icon={Info} title="ABOUT.MD" description={description}>
      <TrustSection title="WHAT_IT_IS">
        <p>
          Better-T-Stack is a free, MIT-licensed command-line tool for scaffolding end-to-end
          type-safe TypeScript applications. Developers choose the frontend, backend, runtime,
          database, ORM, API layer, authentication, deployment targets, and optional addons that fit
          their project. The generator then creates a focused codebase instead of forcing a fixed
          starter stack.
        </p>
        <p>
          Generated projects are ordinary source code under the developer's control. They do not
          depend on a required Better-T-Stack account, subscription, or hosted runtime after
          generation.
        </p>
      </TrustSection>

      <TrustSection title="WHO_IT_IS_FOR">
        <p>
          The project is intended for TypeScript developers, teams, educators, automation tools, and
          coding agents that want a reproducible starting point. It supports interactive prompts,
          explicit CLI flags, structured JSON commands, a programmatic npm API, and a local stdio
          MCP server.
        </p>
        <p>
          Start with the{" "}
          <Link href="/docs" className={trustPageLinkClass}>
            documentation
          </Link>
          , configure a project in the{" "}
          <Link href="/new" className={trustPageLinkClass}>
            browser builder
          </Link>
          , or inspect the published package on{" "}
          <Link href={NPM_PACKAGE_URL} className={trustPageLinkClass}>
            npm
          </Link>
          .
        </p>
      </TrustSection>

      <TrustSection title="OPEN_SOURCE">
        <p>
          Development happens publicly on GitHub. The repository contains the CLI, template
          generator, shared schemas, website, documentation, tests, and issue tracker. Bug reports,
          focused feature proposals, documentation improvements, and pull requests are welcome under
          the project contribution guidelines.
        </p>
        <p>
          Review the{" "}
          <Link href={REPOSITORY_URL} className={trustPageLinkClass}>
            source repository
          </Link>{" "}
          to understand exactly what is generated and how project analytics work.
        </p>
      </TrustSection>

      <TrustSection title="PROJECT_VALUES">
        <p>
          Better-T-Stack favors explicit choices, minimal templates, reproducible commands, and
          transparent compatibility rules. Its goal is to remove setup friction while leaving
          architecture decisions and long-term ownership with the people building the application.
        </p>
        <p>
          The project does not claim that one stack fits every team. It provides composable options
          and validation so developers can roll their own stack with fewer avoidable integration
          mistakes.
        </p>
      </TrustSection>
    </TrustPage>
  );
}

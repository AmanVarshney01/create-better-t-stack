export const dynamic = "force-static";

import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { REPOSITORY_URL, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

import { TrustPage, TrustSection, trustPageLinkClass } from "../_components/trust-page";

const description =
  "Where to ask questions, report bugs, request features, or contact the project.";

export const metadata: Metadata = {
  title: "Contact - Better-T-Stack",
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact - Better-T-Stack",
    description,
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <TrustPage icon={Mail} title="CONTACT.ENV" description={description}>
      <TrustSection title="BUG_REPORTS">
        <p>
          Report reproducible bugs through the GitHub issue tracker. Before opening an issue, search
          existing reports and confirm the behavior with the latest CLI release. Include the exact
          command, CLI version, operating system, package manager, selected stack, error output, and
          the smallest reproduction that demonstrates the problem.
        </p>
        <p>
          <Link href={`${REPOSITORY_URL}/issues/new/choose`} className={trustPageLinkClass}>
            Open a GitHub issue
          </Link>
        </p>
      </TrustSection>

      <TrustSection title="FEATURE_REQUESTS">
        <p>
          Use GitHub issues for feature ideas and integration proposals. Explain the user problem,
          the desired workflow, affected stack choices, and why the change belongs in the core
          generator. Major features should be discussed before implementation so maintainers and
          contributors can agree on scope and compatibility expectations.
        </p>
        <p>
          Public discussion keeps decisions searchable for future contributors and coding agents.
        </p>
      </TrustSection>

      <TrustSection title="GENERAL_CONTACT">
        <p>
          For project questions that do not belong in a public issue, email{" "}
          <Link href={`mailto:${SUPPORT_EMAIL}`} className={trustPageLinkClass}>
            {SUPPORT_EMAIL}
          </Link>
          . Please use a descriptive subject and avoid sending secrets, access tokens, private
          project files, or unnecessary personal information.
        </p>
        <p>
          Documentation questions are usually resolved fastest by linking the relevant page and
          describing what information was missing or unclear.
        </p>
      </TrustSection>

      <TrustSection title="SECURITY_REPORTS">
        <p>
          If a report describes a vulnerability that could put users at risk, do not publish exploit
          details or credentials in a public issue. Email the project contact with “Security” in the
          subject, affected versions, impact, reproduction steps, and any suggested mitigation.
          Allow time for investigation before public disclosure.
        </p>
        <p>
          Never include real production secrets in a report. Replace them with clearly marked test
          values and revoke any credential that may already have been exposed.
        </p>
      </TrustSection>
    </TrustPage>
  );
}

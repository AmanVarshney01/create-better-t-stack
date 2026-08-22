export const dynamic = "force-static";

import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

import { TrustPage, TrustSection, trustPageLinkClass } from "../_components/trust-page";

const description =
  "What the Better-T-Stack website and CLI collect, why it is used, and how to opt out.";

export const metadata: Metadata = {
  title: "Privacy - Better-T-Stack",
  description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy - Better-T-Stack",
    description,
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <TrustPage icon={ShieldCheck} title="PRIVACY.TXT" description={description}>
      <TrustSection title="WEBSITE_ANALYTICS">
        <p>
          The website loads a self-hosted Umami analytics script to understand aggregate traffic and
          page usage. The site also displays externally hosted content such as videos, social posts,
          images, and sponsor information. Requests to those external services are governed by their
          own privacy practices and may expose ordinary connection information such as an IP
          address, browser headers, and the requested resource.
        </p>
        <p>
          Better-T-Stack does not provide user accounts on this website and does not sell personal
          information. Theme and interface preferences may be stored locally in the browser.
        </p>
      </TrustSection>

      <TrustSection title="CLI_TELEMETRY">
        <p>
          After a project is created successfully, the CLI sends one telemetry event containing
          selected stack options and basic environment fields: CLI version, Node.js version,
          platform, and package manager. This information is used to understand which integrations
          are used and to guide maintenance priorities.
        </p>
        <p>
          The telemetry payload intentionally omits project names, paths, file contents, secrets,
          environment variables, nested provisioning options, IP addresses, and persistent user or
          project identifiers. Aggregate results are published on the analytics page.
        </p>
      </TrustSection>

      <TrustSection title="CHOICES_AND_CONTROL">
        <p>
          Disable CLI telemetry for one command with{" "}
          <code className="rounded bg-fd-muted px-1.5 py-0.5">--disable-analytics</code> or set{" "}
          <code className="rounded bg-fd-muted px-1.5 py-0.5">BTS_TELEMETRY_DISABLED=1</code>. The
          environment variable can be added to a shell profile when telemetry should remain
          disabled. Project generation continues to work when telemetry is off.
        </p>
        <p>
          See the{" "}
          <Link href="/docs/analytics" className={trustPageLinkClass}>
            analytics and telemetry documentation
          </Link>{" "}
          for the exact payload, public aggregates, and source-code links.
        </p>
      </TrustSection>

      <TrustSection title="RETENTION_AND_CONTACT">
        <p>
          The project does not currently publish a fixed retention period for CLI events or
          aggregate website statistics. Because a CLI event contains no persistent user identifier,
          the event record alone cannot be associated with a specific person. Infrastructure
          providers may retain operational logs under their own policies.
        </p>
        <p>
          Questions about this notice can be sent to{" "}
          <Link href={`mailto:${SUPPORT_EMAIL}`} className={trustPageLinkClass}>
            {SUPPORT_EMAIL}
          </Link>
          . This notice will be revised when collection or processing materially changes.
        </p>
      </TrustSection>
    </TrustPage>
  );
}

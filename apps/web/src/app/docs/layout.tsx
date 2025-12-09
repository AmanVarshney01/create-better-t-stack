import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { SpecialSponsorBanner } from "@/components/special-sponsor-banner";
import { source } from "@/lib/source";

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  // links: [],
  sidebar: {
    banner: <SpecialSponsorBanner />,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...docsOptions} nav={{ ...baseOptions.nav, mode: "top" }}>
      {children}
    </DocsLayout>
  );
}

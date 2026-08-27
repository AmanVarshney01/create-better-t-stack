"use client";

import { Terminal } from "lucide-react";

import { track } from "@/lib/analytics";

import { PageHeader } from "../../_components/page-header";
import { PageShell } from "../../_components/page-shell";
import ShowcaseItem from "../_components/showcase-item";

type ShowcaseProject = {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  tags: string[];
};

export function ShowcasePage({ showcaseProjects }: { showcaseProjects: Array<ShowcaseProject> }) {
  return (
    <PageShell>
      <PageHeader
        icon={Terminal}
        title="PROJECT_SHOWCASE.SH"
        description="Community projects built with create-better-t-stack"
        count={showcaseProjects.length}
      />

      {showcaseProjects.length === 0 ? (
        <div className="rounded-[4px] border p-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
              NO_SHOWCASE_PROJECTS_FOUND.NULL
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 font-mono text-[13px] leading-[1.55]">
            <span className="text-primary">$</span>
            <span className="text-fd-muted-foreground">Be the first to showcase your project!</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {showcaseProjects.map((project, index) => (
            <ShowcaseItem key={project._id} {...project} index={index} />
          ))}
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex items-center gap-2 font-mono text-[13px] leading-[1.55]">
          <span className="text-primary">$</span>
          <span className="text-fd-muted-foreground">
            Want to showcase your project? Submit via{" "}
            <a
              href="https://github.com/AmanVarshney01/create-better-t-stack/issues/new/choose"
              target="_blank"
              rel="noreferrer"
              onClick={() => track("showcase_submit", {})}
              className="builder-focus-ring underline decoration-fd-border underline-offset-4 transition-colors duration-150 hover:text-primary"
            >
              GitHub issues
            </a>
          </span>
        </div>
      </div>
    </PageShell>
  );
}

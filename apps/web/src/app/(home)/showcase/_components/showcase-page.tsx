"use client";

import { Terminal } from "lucide-react";

import Footer from "../../_components/footer";
import ShowcaseItem from "../_components/ShowcaseItem";

type ShowcaseProject = {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  tags: string[];
};

export default function ShowcasePage({
  showcaseProjects,
}: {
  showcaseProjects: Array<ShowcaseProject>;
}) {
  return (
    <main className="container mx-auto min-h-svh">
      <div className="space-y-8 px-4 py-8 pt-16">
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-bold font-mono text-lg sm:text-xl">PROJECT_SHOWCASE.SH</span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="text-muted-foreground text-xs">
              [{showcaseProjects.length} PROJECTS FOUND]
            </span>
          </div>
        </div>

        {showcaseProjects.length === 0 ? (
          <div className="rounded border border-border p-8">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="text-muted-foreground">NO_SHOWCASE_PROJECTS_FOUND.NULL</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">
                  Be the first to showcase your project!
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {showcaseProjects.map((project, index) => (
              <ShowcaseItem key={project._id} {...project} index={index} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <div className="rounded border border-border p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary">$</span>
              <span className="text-muted-foreground">
                Want to showcase your project? Submit via GitHub issues
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

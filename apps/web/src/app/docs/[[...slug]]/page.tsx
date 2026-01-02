import type { Metadata } from "next";

import * as FilesComponents from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/notebook/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions";
import { getPageImage, source } from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ style: "clerk" }} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {page.data.author && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>by</span>
          {page.data.author.url ? (
            <Link
              href={page.data.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fd-primary hover:underline"
            >
              {page.data.author.name}
            </Link>
          ) : (
            <span className="font-medium">{page.data.author.name}</span>
          )}
          {page.data.date && (
            <>
              <span>·</span>
              <time dateTime={page.data.date}>{page.data.date}</time>
            </>
          )}
        </div>
      )}
      <div className="flex flex-row items-center gap-2 border-b pt-2 pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/web/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, ...TabsComponents, ...FilesComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const image = getPageImage(page);

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
      images: image.url,
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: image.url,
    },
  };
}

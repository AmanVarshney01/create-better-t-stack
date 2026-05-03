import {
  loader,
  type InferPageType,
  type MetaData,
  type PageData,
  type Source,
} from "fumadocs-core/source";
import type { DocData, DocMethods, MetaMethods } from "fumadocs-mdx/runtime/types";
import { docs } from "fumadocs-mdx:collections/server";

type DocsPageData = PageData &
  DocData &
  DocMethods & {
    author?: {
      name: string;
      url?: string;
    };
    date?: string;
    full?: boolean;
  };

type DocsMetaData = MetaData & MetaMethods;

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource() as Source<{
    pageData: DocsPageData;
    metaData: DocsMetaData;
  }>,
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

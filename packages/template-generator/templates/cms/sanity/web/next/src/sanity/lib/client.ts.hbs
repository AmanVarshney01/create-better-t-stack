import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false for ISR/SSG or tag-based revalidation
});

// Server-side client with token for authenticated requests
export const serverClient = token
  ? client.withConfig({
      token,
      useCdn: false,
    })
  : client;

// Helper function for fetching data with revalidation options
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}

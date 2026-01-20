import qs from "qs";

// Query parameter builders for common Strapi operations

// Build query string for collection fetching with pagination
export function buildCollectionQuery({
  page = 1,
  pageSize = 25,
  sort,
  filters,
  populate,
  fields,
  locale,
  publicationState = "live",
}: {
  page?: number;
  pageSize?: number;
  sort?: string | string[];
  filters?: Record<string, unknown>;
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
  locale?: string;
  publicationState?: "live" | "preview";
}): Record<string, unknown> {
  return {
    pagination: { page, pageSize },
    ...(sort && { sort }),
    ...(filters && { filters }),
    ...(populate && { populate }),
    ...(fields && { fields }),
    ...(locale && { locale }),
    publicationState,
  };
}

// Stringify query params for URL
export function stringifyQuery(params: Record<string, unknown>): string {
  return qs.stringify(params, {
    encodeValuesOnly: true,
    arrayFormat: "brackets",
  });
}

// Common populate configurations
export const populateConfigs = {
  // Populate all first-level relations
  all: "*",
  // Deep populate for nested content
  deep: {
    populate: "*",
  },
  // Common blog post populate
  blogPost: {
    author: {
      fields: ["name", "email"],
      populate: {
        avatar: {
          fields: ["url", "alternativeText"],
        },
      },
    },
    featuredImage: {
      fields: ["url", "alternativeText", "width", "height"],
    },
    categories: {
      fields: ["name", "slug"],
    },
    seo: {
      populate: "*",
    },
  },
  // Common page populate
  page: {
    seo: {
      populate: "*",
    },
    blocks: {
      populate: "*",
    },
  },
} as const;

// Common filter builders
export const filterBuilders = {
  // Filter by slug
  bySlug: (slug: string) => ({
    slug: { $eq: slug },
  }),
  // Filter by published status
  published: () => ({
    publishedAt: { $notNull: true },
  }),
  // Filter by category
  byCategory: (categorySlug: string) => ({
    categories: {
      slug: { $eq: categorySlug },
    },
  }),
  // Search by title
  searchTitle: (query: string) => ({
    title: { $containsi: query },
  }),
  // Date range filter
  dateRange: (start: string, end: string) => ({
    publishedAt: {
      $gte: start,
      $lte: end,
    },
  }),
} as const;

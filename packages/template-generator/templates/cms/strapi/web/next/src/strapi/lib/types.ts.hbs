// Common Strapi response types

// Pagination metadata from Strapi
export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// Standard Strapi collection response
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: StrapiPagination;
  };
}

// Standard Strapi single response
export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// Base Strapi document attributes
export interface StrapiBaseDocument {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale?: string;
}

// Media/file type
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// SEO component type (common in Strapi projects)
export interface StrapiSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiMedia;
  keywords?: string;
  canonicalURL?: string;
  metaRobots?: string;
  structuredData?: Record<string, unknown>;
}

// Example content types - customize these for your project

export interface Article extends StrapiBaseDocument {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: StrapiMedia;
  author?: Author;
  categories?: Category[];
  seo?: StrapiSEO;
}

export interface Author extends StrapiBaseDocument {
  name: string;
  email?: string;
  bio?: string;
  avatar?: StrapiMedia;
}

export interface Category extends StrapiBaseDocument {
  name: string;
  slug: string;
  description?: string;
}

export interface Page extends StrapiBaseDocument {
  title: string;
  slug: string;
  content?: string;
  seo?: StrapiSEO;
}

// Homepage single type example
export interface Homepage extends StrapiBaseDocument {
  title: string;
  description?: string;
  heroImage?: StrapiMedia;
  seo?: StrapiSEO;
}

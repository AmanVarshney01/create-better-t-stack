import { defineQuery } from "next-sanity";

// Get all posts
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    "author": author->{ name, image }
  }
`);

// Get a single post by slug
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    mainImage,
    "author": author->{ name, image, bio }
  }
`);

// Get all pages
export const PAGES_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    slug
  }
`);

// Get a single page by slug
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content
  }
`);

// Get all authors
export const AUTHORS_QUERY = defineQuery(`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    bio
  }
`);

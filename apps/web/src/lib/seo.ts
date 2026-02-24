export const SITE_NAME = "Better Fullstack";
export const SITE_URL = "https://better-fullstack.dev";
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/og/better-fullstack-terminal-preview-1200x630.png`;
export const DEFAULT_X_IMAGE_URL = `${SITE_URL}/og/better-fullstack-terminal-preview-x-1200x630.png`;
export const DEFAULT_OG_IMAGE_ALT =
  "Better Fullstack terminal-style preview showing CLI scaffolding output";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export const DEFAULT_DESCRIPTION =
  "Scaffold production-ready fullstack apps with one CLI. Mix TypeScript, Rust, Python, and Go with modern frameworks, databases, auth, payments, and deployment tooling.";

export const DEFAULT_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export function canonicalUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  image: DEFAULT_OG_IMAGE_URL,
};

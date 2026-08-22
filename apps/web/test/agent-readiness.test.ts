import { describe, expect, test } from "bun:test";

import { NextRequest } from "next/server";

import { GET as getAgentContent } from "../src/app/agent-content/[slug]/route";
import {
  agentPageSlugByPath,
  buildStackMarkdown,
  buildLlmsIndex,
  getDocumentationMarkdownUrl,
  getAgentPageMarkdown,
  MARKDOWN_CONTENT_TYPE,
} from "../src/lib/agent-content";
import { DEFAULT_STACK } from "../src/lib/constant";
import { SITE_URL } from "../src/lib/site";
import { proxy } from "../src/proxy";

describe("agent discovery content", () => {
  test("puts the quick start first and advertises every supported automation interface", () => {
    const markdown = buildLlmsIndex([
      { data: { title: "Zebra", description: "Last page" }, url: "/docs/zebra" },
      { data: { title: "Quick Start", description: "Start here" }, url: "/docs" },
    ]);

    expect(markdown).toStartWith("# Better-T-Stack");
    expect(markdown.indexOf("[Quick Start]")).toBeLessThan(markdown.indexOf("[Zebra]"));
    expect(markdown).toContain("npx create-better-t-stack@latest my-app");
    expect(markdown).toContain("create-better-t-stack create-json");
    expect(markdown).toContain("npx create-better-t-stack@latest mcp");
    expect(markdown).toContain(`${SITE_URL}/llms-full.txt`);
    expect(markdown).toContain(`${SITE_URL}/docs/index.mdx`);
    expect(markdown).toContain("does not expose a public hosted application API");
  });

  test("uses the special Markdown URL for the documentation index", () => {
    expect(getDocumentationMarkdownUrl("/docs")).toBe("/docs/index.mdx");
    expect(getDocumentationMarkdownUrl("/docs/cli")).toBe("/docs/cli.mdx");
  });

  test("has a Markdown representation for every negotiated public page", () => {
    for (const slug of Object.values(agentPageSlugByPath)) {
      expect(getAgentPageMarkdown(slug)).toStartWith("# ");
    }
  });

  test("describes the selected stack and preserves it in agent-facing links", () => {
    const markdown = buildStackMarkdown({
      ...DEFAULT_STACK,
      backend: "elysia",
      database: "postgres",
      orm: "drizzle",
      projectName: "review-app",
    });

    expect(markdown).toContain("Project name: `review-app`");
    expect(markdown).toContain("Backend: Elysia");
    expect(markdown).toContain("Database: PostgreSQL");
    expect(markdown).toContain("--backend elysia");
    expect(markdown).toContain(`${SITE_URL}/stack?`);
    expect(markdown).toContain("be=elysia");
  });
});

describe("Markdown content negotiation", () => {
  test("rewrites the homepage to the agent index and varies the cache by Accept", () => {
    const response = proxy(markdownRequest("/"));

    expect(response.headers.get("x-middleware-rewrite")).toBe(`${SITE_URL}/llms.txt`);
    expect(response.headers.get("Vary")).toContain("Accept");
  });

  test("rewrites documentation pages to their existing Markdown routes", () => {
    const docsIndex = proxy(markdownRequest("/docs"));
    const docsPage = proxy(markdownRequest("/docs/cli/agent-workflows"));

    expect(docsIndex.headers.get("x-middleware-rewrite")).toBe(`${SITE_URL}/docs/index.mdx`);
    expect(docsPage.headers.get("x-middleware-rewrite")).toBe(
      `${SITE_URL}/docs/cli/agent-workflows.mdx`,
    );
  });

  test("rewrites standalone pages to concise Markdown representations", () => {
    const response = proxy(markdownRequest("/privacy"));

    expect(response.headers.get("x-middleware-rewrite")).toBe(`${SITE_URL}/agent-content/privacy`);
  });

  test("preserves stack selections through the rewrite and Markdown route", async () => {
    const response = proxy(markdownRequest("/stack?name=agent-app&be=elysia&db=postgres"));
    const destination = `${SITE_URL}/agent-content/stack?name=agent-app&be=elysia&db=postgres`;

    expect(response.headers.get("x-middleware-rewrite")).toBe(destination);

    const markdownResponse = await getAgentContent(new Request(destination), {
      params: Promise.resolve({ slug: "stack" }),
    });
    const markdown = await markdownResponse.text();

    expect(markdown).toContain("Project name: `agent-app`");
    expect(markdown).toContain("Backend: Elysia");
    expect(markdown).toContain("Database: PostgreSQL");
  });

  test("returns a real Markdown 404 with recovery links", async () => {
    const response = proxy(markdownRequest("/missing-agent-page"));

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(response.headers.get("Vary")).toBe("Accept");
    expect(await response.text()).toContain(`${SITE_URL}/sitemap.xml`);
  });

  test("keeps HTML responses and marks them as Accept-dependent", () => {
    const request = new NextRequest(`${SITE_URL}/`, {
      headers: { Accept: "text/html" },
    });
    const response = proxy(request);

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("Vary")).toContain("Accept");
  });

  test("does not serve Markdown when its quality value is zero", () => {
    const response = proxy(
      new NextRequest(`${SITE_URL}/`, {
        headers: { Accept: "text/markdown;q=0, text/html" },
      }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  test("honors the preferred representation when both HTML and Markdown are accepted", () => {
    const htmlResponse = proxy(
      new NextRequest(`${SITE_URL}/`, {
        headers: { Accept: "text/markdown;q=0.5, text/html;q=1" },
      }),
    );
    const markdownResponse = proxy(
      new NextRequest(`${SITE_URL}/`, {
        headers: { Accept: "text/html;q=0.5, TEXT/MARKDOWN;Q=1" },
      }),
    );

    expect(htmlResponse.headers.get("x-middleware-next")).toBe("1");
    expect(markdownResponse.headers.get("x-middleware-rewrite")).toBe(`${SITE_URL}/llms.txt`);
  });
});

function markdownRequest(pathname: string) {
  return new NextRequest(`${SITE_URL}${pathname}`, {
    headers: { Accept: "text/markdown" },
  });
}

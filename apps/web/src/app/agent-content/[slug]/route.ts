import {
  getAgentPageMarkdown,
  getAgentPageSlugs,
  MARKDOWN_CONTENT_TYPE,
  MARKDOWN_NOT_FOUND,
} from "@/lib/agent-content";

export const dynamic = "force-static";

type AgentContentRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: AgentContentRouteContext) {
  const { slug } = await params;
  const markdown = getAgentPageMarkdown(slug);

  return new Response(markdown ?? MARKDOWN_NOT_FOUND, {
    status: markdown ? 200 : 404,
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      "X-Robots-Tag": "noindex",
    },
  });
}

export function generateStaticParams() {
  return getAgentPageSlugs();
}

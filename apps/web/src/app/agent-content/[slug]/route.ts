import {
  buildStackMarkdown,
  getAgentPageMarkdown,
  MARKDOWN_CONTENT_TYPE,
  MARKDOWN_NOT_FOUND,
} from "@/lib/agent-content";
import { loadStackParams } from "@/lib/stack-url-state";

export const dynamic = "force-dynamic";

type AgentContentRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: AgentContentRouteContext) {
  const { slug } = await params;
  const searchParams = Promise.resolve(Object.fromEntries(new URL(request.url).searchParams));
  const markdown =
    slug === "stack"
      ? buildStackMarkdown(await loadStackParams(searchParams))
      : getAgentPageMarkdown(slug);

  return new Response(markdown ?? MARKDOWN_NOT_FOUND, {
    status: markdown ? 200 : 404,
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      "X-Robots-Tag": "noindex",
    },
  });
}

import { MARKDOWN_CONTENT_TYPE, MARKDOWN_NOT_FOUND } from "@/lib/agent-content";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return new Response(MARKDOWN_NOT_FOUND, {
      status: 404,
      headers: {
        "Content-Type": MARKDOWN_CONTENT_TYPE,
        Vary: "Accept",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      Vary: "Accept",
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}

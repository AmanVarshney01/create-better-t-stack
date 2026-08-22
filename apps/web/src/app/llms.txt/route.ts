import { buildLlmsIndex, MARKDOWN_CONTENT_TYPE } from "@/lib/agent-content";
import { source } from "@/lib/source";

export const revalidate = false;

export function GET() {
  return new Response(buildLlmsIndex(source.getPages()), {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
    },
  });
}

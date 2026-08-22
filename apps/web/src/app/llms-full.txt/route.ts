import { buildLlmsIndex, MARKDOWN_CONTENT_TYPE } from "@/lib/agent-content";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

// cached forever
export const revalidate = false;

export async function GET() {
  const pages = source.getPages();
  const scan = pages.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(`${buildLlmsIndex(pages)}\n\n---\n\n${scanned.join("\n\n")}`, {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
    },
  });
}

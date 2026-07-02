import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { OG_SIZE, OgShell, ogColors } from "@/lib/og";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <OgShell path={`~/docs/${page.slugs.join("/")}`} section="docs">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "48px 56px",
          flex: 1,
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: ogColors.text,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {page.data.title}
        </div>

        {page.data.description && (
          <div
            style={{
              fontSize: "24px",
              color: ogColors.subtext,
              lineHeight: 1.5,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {page.data.description}
          </div>
        )}
      </div>
    </OgShell>,
    OG_SIZE,
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}

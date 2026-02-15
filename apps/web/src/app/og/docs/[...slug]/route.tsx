import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#101012",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "40px",
          flex: 1,
          border: "1px solid #333738",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#141415",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            background: "#202022",
            borderBottom: "1px solid #333738",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#d8647e",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#f3be7c",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#7fa563",
                display: "flex",
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "#606079",
              fontSize: "14px",
              fontFamily: "monospace",
              display: "flex",
              justifyContent: "center",
            }}
          >
            ~/docs/{page.slugs.join("/")}
          </div>
        </div>

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
              color: "#cdcdcd",
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
                color: "#8d8da3",
                lineHeight: 1.5,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {page.data.description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 56px",
            borderTop: "1px solid #333738",
            background: "#202022",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                color: "#9bb4bc",
                fontSize: "18px",
                fontWeight: 600,
                display: "flex",
              }}
            >
              Better-T Stack
            </span>
            <span style={{ color: "#333738", fontSize: "18px", display: "flex" }}>/</span>
            <span style={{ color: "#606079", fontSize: "16px", display: "flex" }}>docs</span>
          </div>
          <div
            style={{
              color: "#8d8da3",
              fontSize: "14px",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            better-t-stack.dev
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}

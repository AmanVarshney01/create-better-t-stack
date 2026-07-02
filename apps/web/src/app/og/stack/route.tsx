import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import type { StackState } from "@/lib/constant";
import { OG_SIZE, OgShell, ogColors } from "@/lib/og";
import { loadStackParams } from "@/lib/stack-url-state";
import { getSelectedTechs } from "@/lib/stack-utils";

const MAX_CHIPS = 15;

const categoryChipColors: Partial<Record<string, string>> = {
  webFrontend: "#89b4fa",
  nativeFrontend: "#89b4fa",
  runtime: "#fab387",
  backend: "#74c7ec",
  api: "#b4befe",
  database: "#a6e3a1",
  orm: "#94e2d5",
  dbSetup: "#f5c2e7",
  auth: "#a6e3a1",
  payments: "#eba0ac",
  packageManager: "#f9e2af",
  addons: "#cba6f7",
  examples: "#94e2d5",
};

function commandBase(packageManager: StackState["packageManager"]) {
  if (packageManager === "npm") return "npx create-better-t-stack@latest";
  if (packageManager === "pnpm") return "pnpm create better-t-stack@latest";
  return "bun create better-t-stack@latest";
}

export async function GET(req: NextRequest) {
  const stack = await loadStackParams(
    Promise.resolve(Object.fromEntries(req.nextUrl.searchParams)),
  );
  const projectName = (stack.projectName || "my-better-t-app").slice(0, 40);
  const techs = getSelectedTechs(stack);
  const visible = techs.slice(0, MAX_CHIPS);
  const overflow = techs.length - visible.length;

  return new ImageResponse(
    <OgShell
      path={`~/stack/${projectName}`}
      section="stack"
      footerRight={`${techs.length} techs · better-t-stack.dev`}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "44px 56px",
          flex: 1,
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "monospace",
            fontSize: "20px",
          }}
        >
          <span style={{ color: ogColors.green, display: "flex" }}>$</span>
          <span style={{ color: ogColors.subtext, display: "flex" }}>
            {commandBase(stack.packageManager)} {projectName}
          </span>
        </div>

        <div
          style={{
            fontSize: "54px",
            fontWeight: 700,
            color: ogColors.text,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            display: "flex",
          }}
        >
          {projectName}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", maxWidth: "1020px" }}>
          {visible.map((tech) => {
            const color = categoryChipColors[tech.category] ?? "#a6adc8";
            return (
              <div
                key={`${tech.category}-${tech.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  border: `1px solid ${color}4d`,
                  background: `${color}1a`,
                  color,
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                {tech.name}
              </div>
            );
          })}
          {overflow > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 16px",
                borderRadius: "9999px",
                border: `1px solid ${ogColors.border}`,
                color: ogColors.overlay,
                fontSize: "20px",
              }}
            >
              +{overflow} more
            </div>
          )}
        </div>
      </div>
    </OgShell>,
    OG_SIZE,
  );
}

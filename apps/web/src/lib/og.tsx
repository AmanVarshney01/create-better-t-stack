import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

/** Dark-theme site tokens, resolved to literals because Satori has no CSS vars. */
export const ogColors = {
  base: "#0d0d0d",
  surface: "#0d0d0d",
  mantle: "#0d0d0d",
  border: "#303030",
  text: "#ebebeb",
  subtext: "#a3a3a3",
  overlay: "#8a8a8a",
  faint: "#5c5c5c",
  accent: "#cba6f7",
  green: "#a6e3a1",
  red: "#f38ba8",
  yellow: "#f9e2af",
};

type FontSpec = { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" };

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`,
      // An old UA makes Google serve TTF, which Satori can parse; woff2 it cannot.
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64)" } },
    ).then((res) => (res.ok ? res.text() : ""));
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

let fontsPromise: Promise<FontSpec[]> | undefined;

/**
 * Geist Mono for the OG images so they read as the same system as the site.
 * Resolves to [] if the fetch fails, letting Satori fall back rather than
 * failing the build.
 */
export function ogFonts(): Promise<FontSpec[]> {
  fontsPromise ??= Promise.all([
    fetchGoogleFont("Geist Mono", 400),
    fetchGoogleFont("Geist Mono", 500),
  ]).then(([regular, medium]) => {
    const fonts: FontSpec[] = [];
    if (regular) fonts.push({ name: "Geist Mono", data: regular, weight: 400, style: "normal" });
    if (medium) fonts.push({ name: "Geist Mono", data: medium, weight: 500, style: "normal" });
    return fonts;
  });
  return fontsPromise;
}

export const OG_FONT_FAMILY = "Geist Mono, ui-monospace, monospace";

export function OgShell({
  path,
  section,
  footerRight = "better-t-stack.dev",
  children,
}: {
  path: string;
  section: string;
  footerRight?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: ogColors.base,
        fontFamily: OG_FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "40px",
          flex: 1,
          border: `1px solid ${ogColors.border}`,
          borderRadius: "4px",
        }}
      >
        {/* Pane header: the same marker + lowercase title + index the rail uses. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "48px",
            padding: "0 28px",
            borderBottom: `1px solid ${ogColors.border}`,
            gap: "12px",
          }}
        >
          <span style={{ color: ogColors.accent, fontSize: "15px", display: "flex" }}>•</span>
          <span
            style={{
              color: ogColors.subtext,
              fontSize: "16px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {path}
          </span>
        </div>

        {children}

        {/* Status bar. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "46px",
            padding: "0 28px",
            borderTop: `1px solid ${ogColors.border}`,
            gap: "14px",
            fontSize: "15px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: ogColors.accent, display: "flex" }}>•</span>
          <span style={{ color: ogColors.text, fontWeight: 500, display: "flex" }}>
            better-t-stack
          </span>
          <span style={{ color: ogColors.border, display: "flex" }}>|</span>
          <span style={{ color: ogColors.subtext, display: "flex" }}>{section}</span>
          <span style={{ flex: 1, display: "flex" }} />
          <span style={{ color: ogColors.faint, display: "flex" }}>{footerRight}</span>
        </div>
      </div>
    </div>
  );
}

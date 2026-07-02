import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

export const ogColors = {
  base: "#0a0a0a",
  surface: "#11111b",
  mantle: "#181825",
  border: "#313244",
  text: "#cdd6f4",
  subtext: "#6c7086",
  overlay: "#585b70",
  faint: "#45475a",
  accent: "#cba6f7",
  green: "#a6e3a1",
  red: "#f38ba8",
  yellow: "#f9e2af",
};

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
          border: `1px solid ${ogColors.border}`,
          borderRadius: "8px",
          overflow: "hidden",
          background: ogColors.surface,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            background: ogColors.mantle,
            borderBottom: `1px solid ${ogColors.border}`,
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: ogColors.red,
                display: "flex",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: ogColors.yellow,
                display: "flex",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: ogColors.green,
                display: "flex",
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: ogColors.overlay,
              fontSize: "14px",
              fontFamily: "monospace",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {path}
          </div>
        </div>

        {children}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 56px",
            borderTop: `1px solid ${ogColors.border}`,
            background: ogColors.mantle,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                color: ogColors.accent,
                fontSize: "18px",
                fontWeight: 600,
                display: "flex",
              }}
            >
              Better-T Stack
            </span>
            <span style={{ color: ogColors.border, fontSize: "18px", display: "flex" }}>/</span>
            <span style={{ color: ogColors.overlay, fontSize: "16px", display: "flex" }}>
              {section}
            </span>
          </div>
          <div
            style={{
              color: ogColors.faint,
              fontSize: "14px",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            {footerRight}
          </div>
        </div>
      </div>
    </div>
  );
}

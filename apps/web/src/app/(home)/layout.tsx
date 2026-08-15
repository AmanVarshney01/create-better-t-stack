"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { CSSProperties, ReactNode } from "react";

import { baseOptions } from "@/app/layout.config";
import { HomeSiteHeader } from "@/components/site-header";

type HomeLayoutStyle = CSSProperties & { "--fd-layout-width": string };

const homeLayoutStyle = {
  width: "100%",
  "--fd-layout-width": "100%",
} satisfies HomeLayoutStyle;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions} slots={{ header: HomeSiteHeader }} style={homeLayoutStyle}>
      <main className="h-full w-full">{children}</main>
    </HomeLayout>
  );
}

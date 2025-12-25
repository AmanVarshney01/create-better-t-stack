"use client";

import type { ReactNode } from "react";

import { HomeLayout } from "fumadocs-ui/layouts/home";

import { baseOptions } from "@/app/layout.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      style={
        {
          "--fd-layout-width": "100%",
        } as object
      }
    >
      <main className="h-full w-full">{children}</main>
    </HomeLayout>
  );
}

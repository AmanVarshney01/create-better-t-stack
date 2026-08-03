"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

import { baseOptions } from "@/app/layout.config";
import { HomeSiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      slots={{ header: HomeSiteHeader }}
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

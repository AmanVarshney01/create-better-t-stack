import type { ReactNode } from "react";

import Footer from "./footer";

/** The one page shell shared by /analytics, /showcase and /sponsors. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-svh bg-fd-background">
      <div className="container mx-auto flex flex-col gap-10 px-4 pt-16 pb-16 font-mono font-normal text-fd-foreground">
        {children}
      </div>
      <Footer />
    </main>
  );
}

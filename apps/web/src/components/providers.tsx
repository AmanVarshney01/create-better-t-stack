import { ConvexProvider, ConvexReactClient } from "convex/react";

import { Toaster } from "@/components/ui/sonner";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
      <Toaster />
    </ConvexProvider>
  );
}

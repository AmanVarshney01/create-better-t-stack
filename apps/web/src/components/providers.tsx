import { ConvexProvider, ConvexReactClient } from "convex/react";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function Providers({ children }: { children: React.ReactNode }) {
  // If Convex is not configured, render without ConvexProvider
  if (!convex) {
    return (
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ConvexProvider client={convex}>
        {children}
        <Toaster />
      </ConvexProvider>
    </ThemeProvider>
  );
}

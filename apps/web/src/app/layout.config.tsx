import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookMarked, Github, Hammer } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "Better-T-Stack",
    enabled: false,
  },
  links: [
    {
      url: "/docs",
      text: "Documentation",
      type: "main",
      active: "none",
      icon: <BookMarked size={16} />,
    },
    {
      url: "https://github.com/AmanVarshney01/create-better-t-stack",
      text: "Github",
      type: "main",
      icon: <Github size={16} />,
    },
    {
      url: "/new",
      text: "Builder",
      type: "main",
      icon: <Hammer size={16} />,
    },
  ],
};

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookMarked } from "lucide-react";

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
      children: (
        <a
          className='border-muted flex border rounded-lg p-2 text-lg items-center gap-2'
          href='/docs'
        >
          <BookMarked size={16} />
          Documentation
        </a>
      ),
      type: "custom",
    },
  ],
  githubUrl: "https://github.com/AmanVarshney01/create-better-t-stack",
};

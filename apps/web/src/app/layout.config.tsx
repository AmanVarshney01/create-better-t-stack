import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";

import Image from "next/image";

import discordLogo from "@/public/icon/discord.svg";
import npmLogo from "@/public/icon/npm.svg";
import xLogo from "@/public/icon/x.svg";
import mainLogoDark from "@/public/logo-dark.svg";
import mainLogoLight from "@/public/logo-light.svg";

export const logo = (
  <>
    <Image
      alt="better-t-stack"
      src={mainLogoLight}
      className="w-8 dark:hidden"
      aria-label="better-t-stack"
    />
    <Image
      alt="better-t-stack"
      src={mainLogoDark}
      className="hidden w-8 dark:block"
      aria-label="better-t-stack"
    />
  </>
);

export const links: LinkItemType[] = [
  {
    text: "Docs",
    url: "/docs",
    active: "nested-url",
  },
  {
    text: "Builder",
    url: "/new",
  },
  {
    text: "Analytics",
    url: "/analytics",
  },
  {
    text: "Showcase",
    url: "/showcase",
  },
  {
    text: "Demo",
    url: "https://my-better-t-app.amanv.cloud/",
    external: true,
  },
  {
    text: "NPM",
    icon: <Image src={npmLogo} alt="npm" className="size-4 invert-0 dark:invert" />,
    label: "NPM",
    type: "icon",
    url: "https://www.npmjs.com/package/create-better-t-stack",
    external: true,
    secondary: true,
  },
  {
    text: "X",
    icon: <Image src={xLogo} alt="x" className="size-4 invert dark:invert-0" />,
    label: "X",
    type: "icon",
    url: "https://x.com/amanvarshney01",
    external: true,
    secondary: true,
  },
  {
    text: "Discord",
    icon: <Image src={discordLogo} alt="discord" className="size-5 invert-0 dark:invert" />,
    label: "Discord",
    type: "icon",
    url: "https://discord.gg/ZYsbjpDaM5",
    external: true,
    secondary: true,
  },
];

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        {logo}
        <span className="font-medium font-mono text-md tracking-tighter">Better T Stack</span>
      </>
    ),
  },
  links: links,
  githubUrl: "https://github.com/AmanVarshney01/create-better-t-stack",
};

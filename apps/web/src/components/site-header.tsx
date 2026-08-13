"use client";

import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import { SidebarCollapseTrigger, SidebarTrigger } from "fumadocs-ui/layouts/notebook/slots/sidebar";
import { type LinkItemType, LinkItem, resolveLinkItems } from "fumadocs-ui/layouts/shared";
import { FullSearchTrigger, SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { Menu, Moon, PanelLeft, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { type ComponentProps, type ReactNode, useEffect, useState } from "react";

import { baseOptions } from "@/app/layout.config";
import { cn } from "@/lib/utils";

type HrefItem = Extract<LinkItemType, { url: string }>;

function isSecondary(item: LinkItemType) {
  if ("secondary" in item && item.secondary != null) return item.secondary;
  return item.type === "icon";
}

/* One source of truth: nav items come from layout.config, github is appended by fumadocs. */
const items = resolveLinkItems({
  links: baseOptions.links,
  githubUrl: baseOptions.githubUrl,
}).filter((item): item is HrefItem => "url" in item);

const primaryItems = items.filter((item) => !isSecondary(item));
const secondaryItems = items.filter(isSecondary);

const navTitle = baseOptions.nav?.title;

const labelClass = "font-mono text-[11px] uppercase tracking-[0.08em]";
const iconButtonClass =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-[4px] p-0 text-fd-muted-foreground transition-colors hover:bg-transparent hover:text-fd-foreground [&_svg]:size-4";

function Sep({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("h-3 w-px shrink-0 bg-fd-border", className)} />;
}

function NavLink({
  item,
  className,
  onClick,
}: {
  item: HrefItem;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <LinkItem
      item={item}
      onClick={onClick}
      className={cn(
        labelClass,
        "text-fd-muted-foreground transition-colors hover:text-fd-foreground data-[active=true]:text-primary",
        className,
      )}
    >
      {item.text}
    </LinkItem>
  );
}

function IconLink({
  item,
  className,
  onClick,
}: {
  item: HrefItem;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <LinkItem
      item={item}
      aria-label={item.type === "icon" ? item.label : undefined}
      onClick={onClick}
      className={cn(iconButtonClass, className)}
    >
      {"icon" in item ? item.icon : item.text}
    </LinkItem>
  );
}

function NavTitle() {
  const className = "inline-flex shrink-0 items-center gap-2.5 text-fd-foreground";
  if (navTitle instanceof Function) {
    const Title = navTitle;
    return <Title className={className} href="/" />;
  }
  return (
    <Link aria-label="Better T Stack home" className={className} href="/">
      {navTitle}
    </Link>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(iconButtonClass, className)}
    >
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}

export interface SiteHeaderProps extends ComponentProps<"header"> {
  /** Rendered before the logo, desktop only. Used for the docs sidebar collapse control. */
  leading?: ReactNode;
  /** Rendered at the end of the bar, mobile only. Used for the docs sidebar drawer control. */
  trailing?: ReactNode;
}

export function SiteHeader({ leading, trailing, className, ...props }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header {...props} className={cn("h-14 shrink-0", className)}>
      <div className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
        {leading}

        <NavTitle />

        <Sep className="mx-1 max-md:hidden" />

        <nav aria-label="Main" className="flex items-center gap-4 max-md:hidden">
          {primaryItems.map((item) => (
            <NavLink item={item} key={item.url} />
          ))}
        </nav>

        <span className="flex-1" />

        <FullSearchTrigger
          hideIfDisabled
          className={cn(
            labelClass,
            "h-7 w-full max-w-[180px] rounded-[4px] border bg-transparent px-2 py-0 text-fd-muted-foreground transition-colors hover:bg-transparent hover:text-fd-foreground max-lg:hidden [&_kbd]:rounded-[4px] [&_kbd]:border [&_kbd]:bg-transparent [&_kbd]:px-1 [&_svg]:size-3.5",
          )}
        />
        <SearchTrigger hideIfDisabled className={cn(iconButtonClass, "lg:hidden")} />

        <Sep className="mx-1 max-md:hidden" />

        <div className="flex items-center gap-1 max-md:hidden">
          {secondaryItems.map((item) => (
            <IconLink item={item} key={item.url} />
          ))}
        </div>

        <ThemeToggle className="max-md:hidden" />

        {trailing}

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-header-menu"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(iconButtonClass, "md:hidden")}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          {/* Absolute, not fixed: backdrop-filter on the header makes it the containing block. */}
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-14 h-svh cursor-default"
          />
          <div
            id="site-header-menu"
            className="absolute inset-x-0 top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto border-b bg-fd-background px-4 pt-1 pb-3"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {primaryItems.map((item) => (
                <NavLink
                  className="py-2.5"
                  item={item}
                  key={item.url}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-1 flex items-center gap-1 border-t pt-2">
              {secondaryItems.map((item) => (
                <IconLink item={item} key={item.url} onClick={() => setOpen(false)} />
              ))}
              <span className="flex-1" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function HomeSiteHeader(props: ComponentProps<"header">) {
  return (
    <SiteHeader
      {...props}
      id="nd-nav"
      className={cn("sticky top-0 z-40 bg-fd-background/80 backdrop-blur-lg", props.className)}
    />
  );
}

/* `layout:` resolves to `#nd-notebook-layout:has(&)`, so the sidebar and TOC keep
   positioning off a 3.5rem header. */
export function DocsSiteHeader(props: ComponentProps<"header">) {
  return (
    <SiteHeader
      {...props}
      id="nd-subnav"
      className={cn(
        "sticky top-(--fd-docs-row-1) z-20 [grid-area:header] bg-fd-background/80 backdrop-blur-sm layout:[--fd-header-height:--spacing(14)]",
        props.className,
      )}
      trailing={
        <>
          <SidebarCollapseTrigger className={cn(iconButtonClass, "max-md:hidden")}>
            <PanelLeft />
          </SidebarCollapseTrigger>
          <SidebarTrigger className={cn(iconButtonClass, "md:hidden")}>
            <PanelLeft />
          </SidebarTrigger>
        </>
      }
    />
  );
}

export function ColophonFooter() {
  return (
    /* The rail's skip link lands here, so it needs a focusable target rather
       than the start of the last pane. */
    <div
      id="site-links"
      tabIndex={-1}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]"
    >
      <span>© {new Date().getFullYear()} Better-T-Stack</span>
      <a
        href="mailto:amanvarshney.work@gmail.com"
        className="builder-focus-ring normal-case transition-colors duration-150 hover:text-primary"
      >
        amanvarshney.work@gmail.com
      </a>
    </div>
  );
}

import NpmPackage from "./npm-package";

export default function HeroSection() {
  return (
    <section className="rounded-2xl bg-fd-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative mb-6 flex items-center justify-center rounded-2xl bg-fd-background px-3 py-4 sm:px-4 sm:py-5">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
            {`
██████╗  ██████╗ ██╗     ██╗
██╔══██╗██╔═══██╗██║     ██║
██████╔╝██║   ██║██║     ██║
██╔══██╗██║   ██║██║     ██║
██║  ██║╚██████╔╝███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝`}
          </pre>

          <pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
            {`
██╗   ██╗ ██████╗ ██╗   ██╗██████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
   ██║   ╚██████╔╝╚██████╔╝██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝`}
          </pre>

          <pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
            {`
 ██████╗ ██╗    ██╗███╗   ██╗
██╔═══██╗██║    ██║████╗  ██║
██║   ██║██║ █╗ ██║██╔██╗ ██║
██║   ██║██║███╗██║██║╚██╗██║
╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝`}
          </pre>

          <pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
            {`
███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝
╚════██║   ██║   ██╔══██║██║     ██╔═██╗
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
          </pre>
        </div>
      </div>

      <div className="text-center">
        <p className="mx-auto max-w-3xl font-mono text-base text-muted-foreground sm:text-lg">
          Modern CLI for scaffolding end-to-end type-safe TypeScript projects
        </p>
        <NpmPackage />
      </div>
    </section>
  );
}

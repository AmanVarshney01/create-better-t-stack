import { Github, Linkedin, Twitter } from "lucide-react";

export default function SponsorSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Support the Project
          </h2>

          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            If you find Better Fullstack useful, consider supporting its development. Your
            sponsorship helps maintain and improve the project.
          </p>

          <a
            href="https://www.patreon.com/c/marve10s"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-3 border-2 border-foreground bg-transparent px-8 py-4 font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z" />
            </svg>
            Become a Patron
          </a>
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Or Would Like to Chat?
          </h2>

          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Follow my socials or visit my portfolio for more.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://www.linkedin.com/in/ibrahim-elkamali-94a466292/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://x.com/MARVELOUSBC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />X
            </a>
            <a
              href="https://github.com/Marve10s"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>

          <a
            href="https://elkamali.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            Visit my Portfolio
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

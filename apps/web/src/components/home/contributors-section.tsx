import { Code2, GitPullRequest } from "lucide-react";

type Contributor = {
  username: string;
  name: string;
  role: string;
  github: string;
};

const contributors: Contributor[] = [
  {
    username: "EthanShoeDev",
    name: "Ethan Shoe",
    role: "QA & Testing",
    github: "https://github.com/EthanShoeDev",
  },
];

function ContributorCard({ contributor }: { contributor: Contributor }) {
  return (
    <a
      href={contributor.github}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-lg border border-border bg-background p-4 transition-all hover:border-foreground/30 hover:bg-muted/50"
    >
      <img
        src={`https://github.com/${contributor.username}.png`}
        alt={contributor.name}
        className="h-14 w-14 rounded-full border-2 border-border transition-all group-hover:border-foreground/30"
      />
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{contributor.name}</span>
        <span className="text-sm text-muted-foreground">@{contributor.username}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Code2 className="h-3 w-3" />
          {contributor.role}
        </span>
      </div>
    </a>
  );
}

export default function ContributorsSection() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <h2 className="font-mono text-xl font-bold">QA & Contributing</h2>
        <p className="mt-2 text-muted-foreground">
          Special thanks to our contributors who help improve Better Fullstack through testing,
          feedback, and code contributions.
        </p>

        {/* Contributors Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.username} contributor={contributor} />
          ))}
        </div>

        {/* Contribute CTA */}
        <a
          href="https://github.com/Marve10s/Better-Fullstack/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <GitPullRequest className="h-4 w-4" />
          Contribute to Better Fullstack
        </a>
      </div>
    </section>
  );
}

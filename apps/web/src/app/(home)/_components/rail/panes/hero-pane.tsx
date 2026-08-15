import AsciiBanner from "../ascii-banner";
import HeroMeta from "./hero-meta";

export default function HeroPane() {
  return (
    <div className="flex flex-col gap-4">
      <AsciiBanner />

      <p className="font-mono text-[15px] text-fd-muted-foreground leading-[1.5] tracking-[-0.01em]">
        Modern CLI for scaffolding end-to-end type-safe TypeScript projects
      </p>

      <HeroMeta />
    </div>
  );
}

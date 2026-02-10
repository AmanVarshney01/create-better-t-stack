import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "../src";

import {
  getCuratedSkillNamesForSourceKey,
  getRecommendedSourceKeys,
} from "../src/helpers/addons/skills-setup";

function makeConfig(overrides: Partial<ProjectConfig>): ProjectConfig {
  return {
    projectName: "test",
    projectDir: "/tmp/test",
    relativePath: "test",
    database: "sqlite",
    orm: "drizzle",
    backend: "hono",
    runtime: "bun",
    frontend: ["tanstack-router"],
    addons: [],
    examples: ["none"],
    auth: "none",
    payments: "none",
    git: false,
    packageManager: "bun",
    install: false,
    dbSetup: "none",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    ...overrides,
  };
}

describe("Skills Curation", () => {
  it("should recommend nuxt/ui source for nuxt projects", () => {
    const config = makeConfig({ frontend: ["nuxt"], api: "orpc" });
    const sources = getRecommendedSourceKeys(config);
    expect(sources).toContain("nuxt/ui");
  });

  it("should curate only nuxt-ui from nuxt/ui", () => {
    const config = makeConfig({ frontend: ["nuxt"], api: "orpc" });
    const skills = getCuratedSkillNamesForSourceKey("nuxt/ui", config);
    expect(skills).toEqual(["nuxt-ui"]);
    expect(skills).not.toContain("contributing");
  });

  it("should include prisma-postgres only for postgres database", () => {
    const postgresConfig = makeConfig({ orm: "prisma", database: "postgres" });
    const sqliteConfig = makeConfig({ orm: "prisma", database: "sqlite" });

    expect(getCuratedSkillNamesForSourceKey("prisma/skills", postgresConfig)).toContain(
      "prisma-postgres",
    );
    expect(getCuratedSkillNamesForSourceKey("prisma/skills", sqliteConfig)).not.toContain(
      "prisma-postgres",
    );
  });

  it("should include better-auth-best-practices but not create-auth-skill", () => {
    const config = makeConfig({ auth: "better-auth" });
    const skills = getCuratedSkillNamesForSourceKey("better-auth/skills", config);
    expect(skills).toContain("better-auth-best-practices");
    expect(skills).not.toContain("create-auth-skill");
  });
});

export type ProjectDatabase =
 | "sqlite"
 | "postgres"
 | "mongodb"
 | "mysql"
 | "none";
export type ProjectOrm = "drizzle" | "prisma" | "none";
export type ProjectPackageManager = "npm" | "pnpm" | "bun";
export type ProjectAddons =
 | "pwa"
 | "biome"
 | "tauri"
 | "husky"
 | "starlight"
 | "turborepo"
 | "none";
export type ProjectBackend = "hono" | "elysia" | "express" | "next" | "fastify";
export type ProjectRuntime = "node" | "bun";
export type ProjectExamples = "todo" | "ai" | "none";
export type ProjectFrontend =
 | "react-router"
 | "tanstack-router"
 | "tanstack-start"
 | "next"
 | "nuxt"
 | "native"
 | "svelte"
 | "none";
export type ProjectDBSetup =
 | "turso"
 | "prisma-postgres"
 | "mongodb-atlas"
 | "neon"
 | "none";
export type ProjectApi = "trpc" | "orpc";

export interface ProjectConfig {
 projectName: string;
 backend: ProjectBackend;
 runtime: ProjectRuntime;
 database: ProjectDatabase;
 orm: ProjectOrm;
 auth: boolean;
 addons: ProjectAddons[];
 examples: ProjectExamples[];
 git: boolean;
 packageManager: ProjectPackageManager;
 install: boolean;
 dbSetup: ProjectDBSetup;
 frontend: ProjectFrontend[];
 api: ProjectApi;
}

export type YargsArgv = {
 projectDirectory?: string;

 yes?: boolean;
 database?: ProjectDatabase;
 orm?: ProjectOrm;
 auth?: boolean;
 frontend?: ProjectFrontend[];
 addons?: ProjectAddons[];
 examples?: ProjectExamples[];
 git?: boolean;
 packageManager?: ProjectPackageManager;
 install?: boolean;
 dbSetup?: ProjectDBSetup;
 backend?: ProjectBackend;
 runtime?: ProjectRuntime;
 api?: ProjectApi;

 _: (string | number)[];
 $0: string;
};

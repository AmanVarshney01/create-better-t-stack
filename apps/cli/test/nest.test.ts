import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

const baseConfig = {
  backend: "nest",
  runtime: "node",
  database: "sqlite",
  orm: "prisma",
  api: "none",
  auth: "none",
  payments: "none",
  frontend: ["tanstack-router"],
  addons: ["turborepo"],
  examples: ["none"],
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  packageManager: "pnpm",
  install: false,
} satisfies TestConfig;

describe("Nest.js backend", () => {
  it("generates Better Auth and REST TODO integration", async () => {
    const result = await runTRPCTest({
      ...baseConfig,
      projectName: "nest-better-auth-todo",
      auth: "better-auth",
      examples: ["todo"],
    });

    expectSuccess(result);
    const projectDir = result.projectDir as string;
    const main = await fs.readFile(path.join(projectDir, "apps/server/src/main.ts"), "utf8");
    const appModule = await fs.readFile(
      path.join(projectDir, "apps/server/src/app.module.ts"),
      "utf8",
    );
    const appController = await fs.readFile(
      path.join(projectDir, "apps/server/src/app.controller.ts"),
      "utf8",
    );
    const todosController = await fs.readFile(
      path.join(projectDir, "apps/server/src/todos/todos.controller.ts"),
      "utf8",
    );
    const todosService = await fs.readFile(
      path.join(projectDir, "apps/server/src/todos/todos.service.ts"),
      "utf8",
    );
    const serverPackage = await fs.readJson(path.join(projectDir, "apps/server/package.json"));
    const webPackage = await fs.readJson(path.join(projectDir, "apps/web/package.json"));
    const createTodoDto = await fs.readFile(
      path.join(projectDir, "apps/server/src/todos/dto/create-todo.dto.ts"),
      "utf8",
    );

    expect(main).toContain("bodyParser: false");
    expect(main).toContain("new ValidationPipe({ whitelist: true, transform: true })");
    expect(appModule).toContain("AuthModule.forRoot({ auth })");
    expect(appModule).toContain("TodosModule");
    expect(appController).toContain("@AllowAnonymous()");
    expect(todosController).toContain('@Controller("todos")');
    expect(todosController).toContain('@Patch(":id")');
    expect(todosController).toContain("this.todosService.update(id, updateTodoDto)");
    expect(todosService).toContain("prisma.todo.update");
    expect(todosService).toContain('error.code !== "P2025"');
    expect(todosService).toContain("@Injectable()");
    expect(createTodoDto).toContain("@Matches(/\\S/");
    expect(
      await fs.pathExists(path.join(projectDir, "apps/server/src/todos/todos.module.ts")),
    ).toBe(true);
    expect(
      await fs.pathExists(path.join(projectDir, "apps/server/src/todos/dto/create-todo.dto.ts")),
    ).toBe(true);
    expect(
      await fs.pathExists(path.join(projectDir, "apps/server/src/todos/entities/todo.entity.ts")),
    ).toBe(true);
    expect(serverPackage.dependencies["@thallesp/nestjs-better-auth"]).toBe("^2.7.0");
    expect(serverPackage.dependencies["@nestjs/core"]).toBe("^11.1.6");
    expect(serverPackage.dependencies["class-transformer"]).toBe("^0.5.1");
    expect(serverPackage.dependencies["class-validator"]).toBe("^0.15.1");
    expect(serverPackage.dependencies["@prisma/client"]).toBeUndefined();
    expect(webPackage.dependencies["@orpc/client"]).toBeUndefined();
    expect(await fs.pathExists(path.join(projectDir, "packages/api"))).toBe(false);
  });

  it("generates a Docker-ready Nest server", async () => {
    const result = await runTRPCTest({
      ...baseConfig,
      projectName: "nest-docker",
      serverDeploy: "docker",
    });

    expectSuccess(result);
    const projectDir = result.projectDir as string;
    const main = await fs.readFile(path.join(projectDir, "apps/server/src/main.ts"), "utf8");
    expect(main).toContain('app.listen(process.env.PORT ?? 3000, "0.0.0.0")');
    expect(await fs.pathExists(path.join(projectDir, "apps/server/Dockerfile"))).toBe(true);
  });

  it("generates a Bun-powered Nest server", async () => {
    const result = await runTRPCTest({
      ...baseConfig,
      projectName: "nest-bun",
      runtime: "bun",
      packageManager: "bun",
      serverDeploy: "docker",
    });

    expectSuccess(result);
    const projectDir = result.projectDir as string;
    const serverPackage = await fs.readJson(path.join(projectDir, "apps/server/package.json"));
    const dockerfile = await fs.readFile(path.join(projectDir, "apps/server/Dockerfile"), "utf8");

    expect(serverPackage.main).toBe("src/main.ts");
    expect(serverPackage.scripts.dev).toBe("bun run --hot src/main.ts");
    expect(serverPackage.scripts.start).toBe("bun run dist/main.mjs");
    expect(serverPackage.devDependencies["@types/bun"]).toBeDefined();
    expect(serverPackage.dependencies.libsql).toBeUndefined();
    expect(dockerfile).toContain('CMD ["bun", "dist/main.mjs"]');
  });

  it("generates a Vercel-ready Nest server", async () => {
    const result = await runTRPCTest({
      ...baseConfig,
      projectName: "nest-vercel",
      serverDeploy: "vercel",
    });

    expectSuccess(result);
    const projectDir = result.projectDir as string;
    const vercelConfig = await fs.readJson(path.join(projectDir, "vercel.json"));
    const main = await fs.readFile(path.join(projectDir, "apps/server/src/main.ts"), "utf8");

    expect(vercelConfig.services.server).toMatchObject({
      framework: "nestjs",
      entrypoint: "src/main.ts",
    });
    expect(main).toContain("app.listen(process.env.PORT ?? 3000)");
  });

  it("does not wire a Todo REST client when no example is selected", async () => {
    const result = await runTRPCTest({
      ...baseConfig,
      projectName: "nest-no-example",
    });

    expectSuccess(result);
    const projectDir = result.projectDir as string;
    const webMain = await fs.readFile(path.join(projectDir, "apps/web/src/main.tsx"), "utf8");

    expect(webMain).not.toContain("utils/orpc");
    expect(webMain).not.toContain("QueryClientProvider");
  });

  const todoClientCases = [
    {
      frontend: "next" as const,
      file: "apps/web/src/components/providers.tsx",
    },
    {
      frontend: "solid" as const,
      file: "apps/web/src/main.tsx",
    },
    {
      frontend: "svelte" as const,
      file: "apps/web/src/routes/+layout.svelte",
    },
    {
      frontend: "native-bare" as const,
      file: "apps/native/app/_layout.tsx",
    },
  ];

  for (const testCase of todoClientCases) {
    it(`wires the Todo query client for ${testCase.frontend}`, async () => {
      const result = await runTRPCTest({
        ...baseConfig,
        projectName: `nest-todo-${testCase.frontend}`,
        frontend: [testCase.frontend],
        examples: ["todo"],
      });

      expectSuccess(result);
      const projectDir = result.projectDir as string;
      const provider = await fs.readFile(path.join(projectDir, testCase.file), "utf8");

      expect(provider).toContain("QueryClientProvider");
    });
  }

  it("keeps Mongoose owned by the database package", async () => {
    const result = await runTRPCTest({
      ...baseConfig,
      projectName: "nest-mongoose-dependencies",
      database: "mongodb",
      orm: "mongoose",
      examples: ["todo"],
    });

    expectSuccess(result);
    const projectDir = result.projectDir as string;
    const serverPackage = await fs.readJson(path.join(projectDir, "apps/server/package.json"));
    const dbPackage = await fs.readJson(path.join(projectDir, "packages/db/package.json"));

    expect(serverPackage.dependencies.mongoose).toBeUndefined();
    expect(dbPackage.dependencies.mongoose).toBeDefined();
  });

  const invalidCases = [
    {
      name: "Clerk auth",
      config: { auth: "clerk" as const },
      message: "Nest.js only supports Better Auth",
    },
    {
      name: "payments",
      config: { auth: "better-auth" as const, payments: "polar" as const },
      message: "Nest.js does not support payments yet",
    },
    {
      name: "Cloudflare server deployment",
      config: { serverDeploy: "cloudflare" as const },
      message: "Nest.js supports Docker or Vercel server deployment",
    },
  ];

  for (const testCase of invalidCases) {
    it(`rejects ${testCase.name}`, async () => {
      const result = await runTRPCTest({
        ...baseConfig,
        ...testCase.config,
        projectName: `nest-invalid-${testCase.name.toLowerCase().replaceAll(" ", "-")}`,
        expectError: true,
      });

      expectError(result, testCase.message);
    });
  }
});

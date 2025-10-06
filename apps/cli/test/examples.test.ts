import { describe, it } from "vitest";
import {
	EXAMPLES,
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("Example Configurations", () => {
	describe("Todo Example", () => {
		it("should work with todo example + database + backend", async () => {
			const result = await runTRPCTest({
				projectName: "todo-with-db",
				examples: ["todo"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with todo example + convex backend", async () => {
			const result = await runTRPCTest({
				projectName: "todo-convex",
				examples: ["todo"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with todo example + no backend", async () => {
			const result = await runTRPCTest({
				projectName: "todo-no-backend",
				examples: ["todo"],
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with todo example + backend + no database", async () => {
			const result = await runTRPCTest({
				projectName: "todo-backend-no-db-fail",
				examples: ["todo"],
				backend: "hono",
				runtime: "bun",
				database: "none",
				orm: "none",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"The 'todo' example requires a database if a backend (other than Convex) is present",
			);
		});
	});

	describe("AI Example", () => {
		it("should work with AI example + React frontend", async () => {
			const result = await runTRPCTest({
				projectName: "ai-react",
				examples: ["ai"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with AI example + Next.js", async () => {
			const result = await runTRPCTest({
				projectName: "ai-next",
				examples: ["ai"],
				backend: "self",
				runtime: "none",
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["next"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with AI example + Nuxt", async () => {
			const result = await runTRPCTest({
				projectName: "ai-nuxt",
				examples: ["ai"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc", // tRPC not supported with Nuxt
				frontend: ["nuxt"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with AI example + Svelte", async () => {
			const result = await runTRPCTest({
				projectName: "ai-svelte",
				examples: ["ai"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc", // tRPC not supported with Svelte
				frontend: ["svelte"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with AI example + Solid frontend", async () => {
			const result = await runTRPCTest({
				projectName: "ai-solid-fail",
				examples: ["ai"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc",
				frontend: ["solid"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"The 'ai' example is not compatible with the Solid frontend",
			);
		});

		it("should work with AI example + Convex", async () => {
			const result = await runTRPCTest({
				projectName: "ai-convex",
				examples: ["ai"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("Multiple Examples", () => {
		it("should work with both todo and AI examples", async () => {
			const result = await runTRPCTest({
				projectName: "todo-ai-combo",
				examples: ["todo", "ai"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with both examples if one is incompatible", async () => {
			const result = await runTRPCTest({
				projectName: "todo-ai-solid-fail",
				examples: ["todo", "ai"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc",
				frontend: ["solid"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"The 'ai' example is not compatible with the Solid frontend",
			);
		});
	});

	describe("Examples with None Option", () => {
		it("should work with examples none", async () => {
			const result = await runTRPCTest({
				projectName: "no-examples",
				examples: ["none"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with none + other examples", async () => {
			const result = await runTRPCTest({
				projectName: "none-with-examples-fail",
				examples: ["none", "todo"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Cannot combine 'none' with other examples");
		});
	});

	describe("Examples with API None", () => {
		it("should fail with examples when API is none (non-convex backend)", async () => {
			const result = await runTRPCTest({
				projectName: "examples-api-none-fail",
				examples: ["todo"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cannot use '--examples' when '--api' is set to 'none'",
			);
		});

		it("should work with examples when API is none (convex backend)", async () => {
			const result = await runTRPCTest({
				projectName: "examples-api-none-convex",
				examples: ["todo"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("All Example Types", () => {
		for (const example of EXAMPLES) {
			if (example === "none") continue;

			it(`should work with ${example} example in appropriate setup`, async () => {
				const config: TestConfig = {
					projectName: `test-${example}`,
					examples: [example],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					api: "trpc",
					frontend: ["tanstack-router"],
					addons: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("Example Edge Cases", () => {
		it("should work with empty examples array", async () => {
			const result = await runTRPCTest({
				projectName: "empty-examples",
				examples: ["none"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should handle complex example constraints", async () => {
			// Todo example with backend but no database should fail
			const result = await runTRPCTest({
				projectName: "complex-example-constraints",
				examples: ["todo"],
				backend: "express", // Non-convex backend
				runtime: "bun",
				database: "none", // No database
				orm: "none",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"The 'todo' example requires a database if a backend (other than Convex) is present",
			);
		});
	});
});

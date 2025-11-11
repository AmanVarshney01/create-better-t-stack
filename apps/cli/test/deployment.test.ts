import { describe, it } from "vitest";
import {
	expectError,
	expectSuccess,
	runTRPCTest,
	SERVER_DEPLOYS,
	type TestConfig,
	WEB_DEPLOYS,
} from "./test-utils";

describe("Deployment Configurations", () => {
	describe("Web Deployment", () => {
		describe("Valid Web Deploy Configurations", () => {
			for (const webDeploy of WEB_DEPLOYS) {
				if (webDeploy === "none") continue;

				it(`should work with ${webDeploy} web deploy + web frontend`, async () => {
					const result = await runTRPCTest({
						projectName: `${webDeploy}-web-deploy`,
						webDeploy: webDeploy,
						serverDeploy: "none",
						frontend: ["tanstack-router"],
						backend: "hono",
						runtime: "bun",
						database: "sqlite",
						orm: "drizzle",
						auth: "none",
						api: "trpc",
						addons: ["none"],
						examples: ["none"],
						dbSetup: "none",
						install: false,
					});

					expectSuccess(result);
				});
			}
		});

		it("should work with web deploy none", async () => {
			const result = await runTRPCTest({
				projectName: "no-web-deploy",
				webDeploy: "none",
				serverDeploy: "none",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with web deploy but no web frontend", async () => {
			const result = await runTRPCTest({
				projectName: "web-deploy-no-web-frontend-fail",
				webDeploy: "alchemy",
				serverDeploy: "none",
				frontend: ["native-bare"], // Native frontend only
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				expectError: true,
			});

			expectError(result, "'--web-deploy' requires a web frontend");
		});

		it("should work with web deploy + mixed web and native frontends", async () => {
			const result = await runTRPCTest({
				projectName: "web-deploy-mixed-frontends",
				webDeploy: "alchemy",
				serverDeploy: "none",
				frontend: ["tanstack-router", "native-bare"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with web deploy + all web frontends", async () => {
			const webFrontends = [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
				"nuxt",
				"svelte",
				"solid",
			] as const;

			for (const frontend of webFrontends) {
				const config: TestConfig = {
					projectName: `web-deploy-${frontend}`,
					webDeploy: "alchemy",
					serverDeploy: "none",
					frontend: [frontend],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					install: false,
				};

				// Handle API compatibility
				if (["nuxt", "svelte", "solid"].includes(frontend)) {
					config.api = "orpc";
				} else {
					config.api = "trpc";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			}
		});
	});

	describe("Server Deployment", () => {
		describe("Valid Server Deploy Configurations", () => {
			for (const serverDeploy of SERVER_DEPLOYS) {
				if (serverDeploy === "none") continue;

				it(`should work with ${serverDeploy} server deploy + backend`, async () => {
					const result = await runTRPCTest({
						projectName: `${serverDeploy}-server-deploy`,
						webDeploy: "none",
						serverDeploy: serverDeploy,
						backend: "hono",
						runtime: "bun",
						database: "sqlite",
						orm: "drizzle",
						auth: "none",
						api: "trpc",
						frontend: ["tanstack-router"],
						addons: ["none"],
						examples: ["none"],
						dbSetup: "none",
						install: false,
					});

					expectSuccess(result);
				});
			}
		});

		it("should work with server deploy none", async () => {
			const result = await runTRPCTest({
				projectName: "no-server-deploy",
				webDeploy: "none",
				serverDeploy: "none",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with server deploy but no backend", async () => {
			const result = await runTRPCTest({
				projectName: "server-deploy-no-backend-fail",
				webDeploy: "none",
				serverDeploy: "alchemy",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				expectError: true,
			});

			expectError(
				result,
				"Backend 'none' requires '--server-deploy none'. Please remove the --server-deploy flag or set it to 'none'.",
			);
		});

		it("should work with server deploy + all compatible backends", async () => {
			const backends = ["hono", "express", "fastify", "elysia"] as const;

			for (const backend of backends) {
				const config: TestConfig = {
					projectName: `server-deploy-${backend}`,
					webDeploy: "none",
					serverDeploy: "alchemy",
					backend,
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					api: "trpc",
					frontend: ["tanstack-router"],
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					install: false,
				};

				// Set appropriate runtime
				if (backend === "elysia") {
					config.runtime = "bun";
				} else {
					config.runtime = "bun";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			}
		});

		it("should fail with server deploy + convex backend", async () => {
			const result = await runTRPCTest({
				projectName: "server-deploy-convex-fail",
				webDeploy: "none",
				serverDeploy: "alchemy",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				expectError: true,
			});

			expectError(result, "Convex backend requires '--server-deploy none'");
		});
	});

	describe("Workers Runtime Deployment Constraints", () => {
		it("should work with workers runtime + server deploy", async () => {
			const result = await runTRPCTest({
				projectName: "workers-server-deploy",
				webDeploy: "none",
				runtime: "workers",
				serverDeploy: "alchemy",
				backend: "hono",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "d1",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with workers runtime + no server deploy", async () => {
			const result = await runTRPCTest({
				projectName: "workers-no-server-deploy-fail",
				runtime: "workers",
				serverDeploy: "none",
				backend: "hono",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cloudflare Workers runtime requires a server deployment",
			);
		});
	});

	describe("Combined Web and Server Deployment", () => {
		it("should work with both web and server deploy", async () => {
			const result = await runTRPCTest({
				projectName: "web-server-deploy-combo",
				webDeploy: "alchemy",
				serverDeploy: "alchemy",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with different deploy providers", async () => {
			const result = await runTRPCTest({
				projectName: "different-deploy-providers",
				webDeploy: "alchemy",
				serverDeploy: "alchemy",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with web deploy only", async () => {
			const result = await runTRPCTest({
				projectName: "web-deploy-only",
				webDeploy: "alchemy",
				serverDeploy: "none",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with server deploy only", async () => {
			const result = await runTRPCTest({
				projectName: "server-deploy-only",
				webDeploy: "none",
				serverDeploy: "alchemy",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("Deployment with Special Backend Constraints", () => {
		it("should work with deployment + self backend", async () => {
			const result = await runTRPCTest({
				projectName: "deploy-self-backend",
				webDeploy: "alchemy",
				serverDeploy: "none", // Self backend doesn't use server deployment
				backend: "self",
				runtime: "none",
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["next"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with deployment + fullstack setup", async () => {
			const result = await runTRPCTest({
				projectName: "deploy-fullstack",
				webDeploy: "alchemy",
				serverDeploy: "alchemy",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("All Deployment Options", () => {
		const deployOptions: ReadonlyArray<{
			webDeploy: TestConfig["webDeploy"];
			serverDeploy: TestConfig["serverDeploy"];
		}> = [
			{ webDeploy: "alchemy", serverDeploy: "alchemy" },
			{ webDeploy: "alchemy", serverDeploy: "none" },
			{ webDeploy: "none", serverDeploy: "alchemy" },
			{ webDeploy: "none", serverDeploy: "none" },
		];

		for (const { webDeploy, serverDeploy } of deployOptions) {
			it(`should work with webDeploy: ${webDeploy}, serverDeploy: ${serverDeploy}`, async () => {
				const config: TestConfig = {
					projectName: `deploy-${webDeploy}-${serverDeploy}`,
					webDeploy,
					serverDeploy,
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					api: "trpc",
					frontend: ["tanstack-router"],
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					install: false,
				};

				// Handle special cases
				if (
					webDeploy !== "none" &&
					!config.frontend?.some((f) =>
						[
							"tanstack-router",
							"react-router",
							"tanstack-start",
							"next",
							"nuxt",
							"svelte",
							"solid",
						].includes(f),
					)
				) {
					config.frontend = ["tanstack-router"]; // Ensure web frontend for web deploy
				}

				if (serverDeploy !== "none" && config.backend === "none") {
					config.backend = "hono"; // Ensure backend for server deploy
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("Deployment Edge Cases", () => {
		it("should handle deployment with complex configurations", async () => {
			const result = await runTRPCTest({
				projectName: "complex-deployment",
				webDeploy: "alchemy",
				serverDeploy: "alchemy",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"], // Single web frontend (compatible with PWA)
				addons: ["pwa", "turborepo"],
				examples: ["todo"],
				install: false,
			});

			expectSuccess(result);
		});

		it("should handle deployment constraints properly", async () => {
			// This should fail because we have web deploy but only native frontend
			const result = await runTRPCTest({
				projectName: "deployment-constraints-fail",
				webDeploy: "alchemy",
				serverDeploy: "none",
				backend: "none", // No backend but we have server deploy
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				frontend: ["native-bare"], // Only native frontend
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				expectError: true,
			});

			expectError(result, "'--web-deploy' requires a web frontend");
		});
	});
});

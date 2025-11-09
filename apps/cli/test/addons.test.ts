import { describe, it } from "vitest";
import type { Addons, Frontend } from "../src";
import {
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("Addon Configurations", () => {
	describe("Universal Addons (no frontend restrictions)", () => {
		const universalAddons = ["biome", "husky", "turborepo", "oxlint"];

		for (const addon of universalAddons) {
			it(`should work with ${addon} addon on any frontend`, async () => {
				const result = await runTRPCTest({
					projectName: `${addon}-universal`,
					addons: [addon as Addons],
					frontend: ["tanstack-router"],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					api: "trpc",
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			});
		}
	});

	describe("Frontend-Specific Addons", () => {
		describe("PWA Addon", () => {
			const pwaCompatibleFrontends = [
				"tanstack-router",
				"react-router",
				"solid",
				"next",
			];

			for (const frontend of pwaCompatibleFrontends) {
				it(`should work with PWA + ${frontend}`, async () => {
					const config: TestConfig = {
						projectName: `pwa-${frontend}`,
						addons: ["pwa"],
						frontend: [frontend as Frontend],
						backend: "hono",
						runtime: "bun",
						database: "sqlite",
						orm: "drizzle",
						auth: "none",
						examples: ["none"],
						dbSetup: "none",
						webDeploy: "none",
						serverDeploy: "none",
						install: false,
					};

					// Handle special frontend requirements
					if (frontend === "solid") {
						config.api = "orpc"; // tRPC not supported with solid
					} else {
						config.api = "trpc";
					}

					const result = await runTRPCTest(config);
					expectSuccess(result);
				});
			}

			const pwaIncompatibleFrontends = [
				"nuxt",
				"svelte",
				"native-bare",
				"native-uniwind",
				"native-unistyles",
			];

			for (const frontend of pwaIncompatibleFrontends) {
				it(`should fail with PWA + ${frontend}`, async () => {
					const config: TestConfig = {
						projectName: `pwa-${frontend}-fail`,
						addons: ["pwa"],
						frontend: [frontend as Frontend],
						backend: "hono",
						runtime: "bun",
						database: "sqlite",
						orm: "drizzle",
						auth: "none",
						examples: ["none"],
						dbSetup: "none",
						webDeploy: "none",
						serverDeploy: "none",
						expectError: true,
					};

					if (["nuxt", "svelte"].includes(frontend)) {
						config.api = "orpc";
					} else {
						config.api = "trpc";
					}

					const result = await runTRPCTest(config);
					expectError(
						result,
						"pwa addon requires one of these frontends: tanstack-router, react-router, solid, next",
					);
				});
			}
		});

		describe("Tauri Addon", () => {
			const tauriCompatibleFrontends = [
				"tanstack-router",
				"react-router",
				"nuxt",
				"svelte",
				"solid",
				"next",
			];

			for (const frontend of tauriCompatibleFrontends) {
				it(`should work with Tauri + ${frontend}`, async () => {
					const config: TestConfig = {
						projectName: `tauri-${frontend}`,
						addons: ["tauri"],
						frontend: [frontend as Frontend],
						backend: "hono",
						runtime: "bun",
						database: "sqlite",
						orm: "drizzle",
						auth: "none",
						examples: ["none"],
						dbSetup: "none",
						webDeploy: "none",
						serverDeploy: "none",
						install: false,
					};

					if (["nuxt", "svelte", "solid"].includes(frontend)) {
						config.api = "orpc";
					} else {
						config.api = "trpc";
					}

					const result = await runTRPCTest(config);
					expectSuccess(result);
				});
			}

			const tauriIncompatibleFrontends = [
				"native-bare",
				"native-uniwind",
				"native-unistyles",
			];

			for (const frontend of tauriIncompatibleFrontends) {
				it(`should fail with Tauri + ${frontend}`, async () => {
					const result = await runTRPCTest({
						projectName: `tauri-${frontend}-fail`,
						addons: ["tauri"],
						frontend: [frontend as Frontend],
						backend: "hono",
						runtime: "bun",
						database: "sqlite",
						orm: "drizzle",
						auth: "none",
						api: "trpc",
						examples: ["none"],
						dbSetup: "none",
						webDeploy: "none",
						serverDeploy: "none",
						expectError: true,
					});

					expectError(result, "tauri addon requires one of these frontends");
				});
			}
		});
	});

	describe("Multiple Addons", () => {
		it("should work with multiple compatible addons", async () => {
			const result = await runTRPCTest({
				projectName: "multiple-addons",
				addons: ["biome", "husky", "turborepo", "pwa"],
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with incompatible addon combination", async () => {
			const result = await runTRPCTest({
				projectName: "incompatible-addons-fail",
				addons: ["pwa"], // PWA not compatible with nuxt
				frontend: ["nuxt"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc",
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "pwa addon requires one of these frontends");
		});

		it("should deduplicate addons", async () => {
			const result = await runTRPCTest({
				projectName: "duplicate-addons",
				addons: ["biome", "biome", "turborepo"], // Duplicate biome
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("Addons with None Option", () => {
		it("should work with addons none", async () => {
			const result = await runTRPCTest({
				projectName: "no-addons",
				addons: ["none"],
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with none + other addons", async () => {
			const result = await runTRPCTest({
				projectName: "none-with-other-addons-fail",
				addons: ["none", "biome"],
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Cannot combine 'none' with other addons");
		});
	});

	describe("All Available Addons", () => {
		const testableAddons = [
			"pwa",
			"tauri",
			"biome",
			"husky",
			"turborepo",
			"oxlint",
			// Note: starlight, ultracite, ruler, fumadocs are prompt-controlled only
		];

		for (const addon of testableAddons) {
			it(`should work with ${addon} addon in appropriate setup`, async () => {
				const config: TestConfig = {
					projectName: `test-${addon}`,
					addons: [addon as Addons],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					api: "trpc",
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Choose compatible frontend for each addon
				if (["pwa"].includes(addon)) {
					config.frontend = ["tanstack-router"]; // PWA compatible
				} else if (["tauri"].includes(addon)) {
					config.frontend = ["tanstack-router"]; // Tauri compatible
				} else {
					config.frontend = ["tanstack-router"]; // Universal addons
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});
});

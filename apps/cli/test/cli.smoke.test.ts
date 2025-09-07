import { join } from "node:path";
import consola from "consola";
import { execa } from "execa";
import { ensureDir, existsSync, readFile, readJson, remove } from "fs-extra";
import * as JSONC from "jsonc-parser";
import { FailedToExitError } from "trpc-cli";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createBtsCli } from "../src/index";

async function runCli(argv: string[], cwd: string) {
	const previous = process.cwd();
	process.chdir(cwd);
	try {
		consola.info(`Running CLI command: bts ${argv.join(" ")}`);

		const cli = createBtsCli();
		await cli
			.run({
				argv,
				logger: { info: () => {}, error: () => {} },
				process: { exit: () => void 0 as never },
			})
			.catch((err) => {
				let e: unknown = err;
				while (e instanceof FailedToExitError) {
					if (e.exitCode === 0) return e.cause;
					e = e.cause;
				}
				throw e;
			});
	} finally {
		process.chdir(previous);
	}
}

async function createTmpDir(_prefix: string) {
	const dir = join(__dirname, "..", ".smoke");
	if (existsSync(dir)) {
		await remove(dir);
	}
	await ensureDir(dir);
	return dir;
}

async function runCliExpectingError(args: string[], cwd: string) {
	const previous = process.cwd();
	process.chdir(cwd);
	try {
		consola.info(
			`Running CLI command (expecting error): bts ${args.join(" ")}`,
		);

		const cli = createBtsCli();
		let threw = false;
		await cli
			.run({
				argv: args,
				logger: { info: () => {}, error: () => {} },
				process: { exit: () => void 0 as never },
			})
			.catch((err) => {
				threw = true;
				let e: unknown = err;
				while (e instanceof FailedToExitError) {
					if (e.exitCode === 0) throw new Error("Expected failure");
					e = e.cause;
				}
			});
		expect(threw).toBe(true);
	} finally {
		process.chdir(previous);
	}
}

async function assertScaffoldedProject(dir: string) {
	const pkgJsonPath = join(dir, "package.json");
	expect(existsSync(pkgJsonPath)).toBe(true);
	const pkg = await readJson(pkgJsonPath);
	expect(typeof pkg.name).toBe("string");
	expect(Array.isArray(pkg.workspaces)).toBe(true);
}

async function assertProjectStructure(
	dir: string,
	options: {
		hasWeb?: boolean;
		hasNative?: boolean;
		hasServer?: boolean;
		hasConvexBackend?: boolean;
		hasTurborepo?: boolean;
		hasBiome?: boolean;
		hasAuth?: boolean;
		hasDatabase?: boolean;
	},
) {
	const {
		hasWeb = false,
		hasNative = false,
		hasServer = false,
		hasConvexBackend = false,
		hasTurborepo = false,
		hasBiome = false,
		hasAuth = false,
		hasDatabase = false,
	} = options;

	expect(existsSync(join(dir, "package.json"))).toBe(true);
	expect(existsSync(join(dir, ".gitignore"))).toBe(true);

	try {
		const pmConfig = (await readBtsConfig(dir)) as { packageManager?: string };
		if (pmConfig && pmConfig.packageManager === "bun") {
			expect(existsSync(join(dir, "bunfig.toml"))).toBe(true);
		}
	} catch {}

	if (hasWeb) {
		expect(existsSync(join(dir, "apps", "web", "package.json"))).toBe(true);
		const webDir = join(dir, "apps", "web");
		const hasViteConfig = existsSync(join(webDir, "vite.config.ts"));
		const hasNextConfig =
			existsSync(join(webDir, "next.config.mjs")) ||
			existsSync(join(webDir, "next.config.js"));
		const hasNuxtConfig = existsSync(join(webDir, "nuxt.config.ts"));
		const hasSvelteConfig = existsSync(join(webDir, "svelte.config.js"));
		const hasTsConfig = existsSync(join(webDir, "tsconfig.json"));

		const hasSrcDir = existsSync(join(webDir, "src"));
		const hasAppDir = existsSync(join(webDir, "app"));
		const hasPublicDir = existsSync(join(webDir, "public"));

		expect(
			hasViteConfig ||
				hasNextConfig ||
				hasNuxtConfig ||
				hasSvelteConfig ||
				hasTsConfig ||
				hasSrcDir ||
				hasAppDir ||
				hasPublicDir,
		).toBe(true);

		const bts = (await readBtsConfig(dir)) as {
			webDeploy?: string;
			serverDeploy?: string;
			frontend?: string[];
		};
		if (bts.webDeploy === "wrangler") {
			expect(existsSync(join(dir, "apps", "web", "wrangler.jsonc"))).toBe(true);
		}

		if (
			bts.webDeploy === "alchemy" &&
			bts.serverDeploy !== "alchemy" &&
			bts.frontend &&
			bts.frontend.length > 0
		) {
			const webRunner = join(dir, "apps", "web", "alchemy.run.ts");
			consola.info(`Checking Alchemy web runner at: ${webRunner}`);
			expect(existsSync(webRunner)).toBe(true);
		}
	}

	if (hasNative) {
		const nativeDir = join(dir, "apps", "native");
		expect(existsSync(join(nativeDir, "package.json"))).toBe(true);
		const hasAppConfig = existsSync(join(nativeDir, "app.json"));
		const hasExpoConfig = existsSync(join(nativeDir, "expo"));
		const hasSrcDir = existsSync(join(nativeDir, "src"));
		const hasMainFile =
			existsSync(join(nativeDir, "App.tsx")) ||
			existsSync(join(nativeDir, "index.tsx")) ||
			existsSync(join(nativeDir, "index.js"));
		expect(hasAppConfig || hasExpoConfig || hasSrcDir || hasMainFile).toBe(
			true,
		);
	}

	if (hasServer) {
		expect(existsSync(join(dir, "apps", "server", "package.json"))).toBe(true);
		expect(existsSync(join(dir, "apps", "server", "src", "index.ts"))).toBe(
			true,
		);
		expect(existsSync(join(dir, "apps", "server", "tsconfig.json"))).toBe(true);

		const bts = (await readBtsConfig(dir)) as {
			serverDeploy?: string;
			webDeploy?: string;
		};
		if (bts.serverDeploy === "wrangler") {
			expect(existsSync(join(dir, "apps", "server", "wrangler.jsonc"))).toBe(
				true,
			);
		}
		if (bts.serverDeploy === "alchemy") {
			const serverRunner = join(dir, "apps", "server", "alchemy.run.ts");
			const serverEnv = join(dir, "apps", "server", "env.d.ts");
			consola.info(`Checking Alchemy server runner at: ${serverRunner}`);
			consola.info(`Checking Alchemy env types at: ${serverEnv}`);
			expect(existsSync(serverRunner)).toBe(true);
			expect(existsSync(serverEnv)).toBe(true);
		}
	}

	try {
		const btsAll = (await readBtsConfig(dir)) as {
			serverDeploy?: string;
			webDeploy?: string;
		};
		if (btsAll.serverDeploy === "alchemy" && btsAll.webDeploy === "alchemy") {
			const rootRunner = join(dir, "alchemy.run.ts");
			const serverEnv = join(dir, "apps", "server", "env.d.ts");
			consola.info(`Checking Alchemy root runner at: ${rootRunner}`);
			consola.info(`Checking Alchemy env types at: ${serverEnv}`);
			expect(existsSync(rootRunner)).toBe(true);
			expect(existsSync(serverEnv)).toBe(true);
		}
	} catch {}

	if (hasConvexBackend) {
		const hasPackagesDir = existsSync(join(dir, "packages"));
		const hasConvexRelated =
			existsSync(join(dir, "packages", "backend")) ||
			existsSync(join(dir, "convex")) ||
			existsSync(join(dir, "convex.config.ts"));
		expect(hasPackagesDir || hasConvexRelated).toBe(true);
	}

	if (hasTurborepo) {
		expect(existsSync(join(dir, "turbo.json"))).toBe(true);
	}

	if (hasBiome) {
		expect(existsSync(join(dir, "biome.json"))).toBe(true);
	}

	if (hasAuth && hasServer) {
		expect(
			existsSync(join(dir, "apps", "server", "src", "lib", "auth.ts")),
		).toBe(true);
	}

	if (hasDatabase && hasServer) {
		const serverDir = join(dir, "apps", "server");
		if (existsSync(serverDir)) {
			const hasDrizzleConfig = existsSync(join(serverDir, "drizzle.config.ts"));
			const hasPrismaSchema = existsSync(
				join(serverDir, "prisma", "schema.prisma"),
			);
			const hasDbFolder = existsSync(join(serverDir, "src", "db"));
			const hasSchemaFile = existsSync(join(serverDir, "src", "schema.ts"));
			const hasLibFolder = existsSync(join(serverDir, "src", "lib"));

			const hasRootPrismaDir = existsSync(join(dir, "prisma"));
			const hasRootPrismaSchema = existsSync(
				join(dir, "prisma", "schema.prisma"),
			);

			expect(
				hasDrizzleConfig ||
					hasPrismaSchema ||
					hasDbFolder ||
					hasSchemaFile ||
					hasLibFolder ||
					hasRootPrismaDir ||
					hasRootPrismaSchema,
			).toBe(true);
		}
	}

	expect(existsSync(join(dir, "bts.jsonc"))).toBe(true);
	const btsConfig = await readFile(join(dir, "bts.jsonc"), "utf8");
	expect(btsConfig).toContain("Better-T-Stack configuration");
}

async function assertBtsConfig(
	dir: string,
	expectedConfig: Partial<{
		frontend: string[];
		backend: string;
		database: string;
		orm: string;
		auth: string;
		addons: string[];
		examples: string[];
		api: string;
		runtime: string;
		packageManager: string;
		webDeploy: string;
		serverDeploy: string;
	}>,
) {
	const btsConfigPath = join(dir, "bts.jsonc");
	expect(existsSync(btsConfigPath)).toBe(true);
	const content = await readFile(btsConfigPath, "utf8");

	type BtsConfig = {
		frontend?: string[];
		backend?: string;
		database?: string;
		orm?: string;
		auth?: string;
		addons?: string[];
		examples?: string[];
		api?: string;
		runtime?: string;
		packageManager?: string;
		webDeploy?: string;
		serverDeploy?: string;
	};

	const errors: JSONC.ParseError[] = [];
	const parsed = JSONC.parse(content, errors, {
		allowTrailingComma: true,
		disallowComments: false,
	}) as BtsConfig | null;

	if (errors.length > 0 || !parsed) {
		consola.error("Failed to parse bts.jsonc", errors);
		throw new Error("Failed to parse bts.jsonc");
	}
	const config = parsed;

	if (expectedConfig.frontend) {
		expect(config.frontend).toEqual(expectedConfig.frontend);
	}
	if (expectedConfig.backend) {
		expect(config.backend).toBe(expectedConfig.backend);
	}
	if (expectedConfig.database) {
		expect(config.database).toBe(expectedConfig.database);
	}
	if (expectedConfig.orm) {
		expect(config.orm).toBe(expectedConfig.orm);
	}
	if (expectedConfig.auth !== undefined) {
		expect(config.auth).toBe(expectedConfig.auth);
	}
	if (expectedConfig.addons) {
		expect(config.addons).toEqual(expectedConfig.addons);
	}
	if (expectedConfig.examples) {
		expect(config.examples).toEqual(expectedConfig.examples);
	}
	if (expectedConfig.api) {
		expect(config.api).toBe(expectedConfig.api);
	}
	if (expectedConfig.runtime) {
		expect(config.runtime).toBe(expectedConfig.runtime);
	}
	if (expectedConfig.packageManager) {
		expect(config.packageManager).toBe(expectedConfig.packageManager);
	}
	if (expectedConfig.webDeploy) {
		expect(config.webDeploy).toBe(expectedConfig.webDeploy);
	}
	if (expectedConfig.serverDeploy) {
		expect(config.serverDeploy).toBe(expectedConfig.serverDeploy);
	}
}

async function readBtsConfig(dir: string) {
	const btsConfigPath = join(dir, "bts.jsonc");
	if (!existsSync(btsConfigPath)) return {} as Record<string, unknown>;

	const content = await readFile(btsConfigPath, "utf8");
	const errors: JSONC.ParseError[] = [];
	const parsed = JSONC.parse(content, errors, {
		allowTrailingComma: true,
		disallowComments: false,
	}) as Record<string, unknown> | null;

	if (errors.length > 0 || !parsed) {
		return {} as Record<string, unknown>;
	}
	return parsed;
}

describe("create-better-t-stack smoke", () => {
	let workdir: string;

	beforeAll(async () => {
		workdir = await createTmpDir("cli");
		consola.start("Building CLI...");
		const buildProc = execa("bun", ["run", "build"], {
			cwd: join(__dirname, ".."),
			env: {
				...process.env,
				CI: "true",
				NODE_ENV: "production",
			},
		});
		buildProc.stdout?.pipe(process.stdout);
		buildProc.stderr?.pipe(process.stderr);
		const { exitCode } = await buildProc;
		expect(exitCode).toBe(0);
		consola.success("CLI build completed");

		process.env.BTS_TELEMETRY_DISABLED = "1";
		consola.info("Programmatic CLI mode");
	});

	describe("frontend x backend matrix (no db, no api)", () => {
		const FRONTENDS = [
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"next",
			"nuxt",
			"svelte",
			"solid",
			"native-nativewind",
			"native-unistyles",
		] as const;
		const BACKENDS = ["hono", "express", "fastify", "elysia"] as const;

		const WEB_FRONTENDS = new Set([
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"next",
			"nuxt",
			"svelte",
			"solid",
		]);

		for (const backend of BACKENDS) {
			describe(`backend=${backend}`, () => {
				for (const frontend of FRONTENDS) {
					it(`scaffolds ${frontend} + ${backend}`, async () => {
						const projectName = `app-${backend}-${frontend.replace(/[^a-z-]/g, "").slice(0, 30)}`;
						await runCli(
							[
								projectName,
								"--frontend",
								frontend,
								"--backend",
								backend,
								"--runtime",
								"bun",
								"--database",
								"none",
								"--orm",
								"none",
								"--api",
								"none",
								"--auth",
								"none",
								"--db-setup",
								"none",
								"--web-deploy",
								"none",
								"--server-deploy",
								"none",
								"--addons",
								"none",
								"--examples",
								"none",
								"--package-manager",
								"bun",
								"--no-install",
								"--no-git",
							],
							workdir,
						);

						const projectDir = join(workdir, projectName);
						await assertScaffoldedProject(projectDir);
						await assertProjectStructure(projectDir, {
							hasWeb: WEB_FRONTENDS.has(frontend),
							hasNative:
								frontend === "native-nativewind" ||
								frontend === "native-unistyles",
							hasServer: true,
						});
						await assertBtsConfig(projectDir, {
							frontend: [frontend],
							backend,
							database: "none",
							orm: "none",
							auth: "none",
						});
					});
				}
			});
		}
	});

	describe("convex backend with all compatible frontends", () => {
		const FRONTENDS = [
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"next",
			"nuxt",
			"svelte",
			"native-nativewind",
			"native-unistyles",
		] as const;
		const WEB_FRONTENDS = new Set([
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"next",
			"nuxt",
			"svelte",
		]);

		for (const frontend of FRONTENDS) {
			it(`scaffolds ${frontend} + convex`, async () => {
				const projectName = `app-convex-${frontend.replace(/[^a-z-]/g, "").slice(0, 30)}`;
				await runCli(
					[
						projectName,
						"--frontend",
						frontend,
						"--backend",
						"convex",
						"--runtime",
						"none",
						"--database",
						"none",
						"--orm",
						"none",
						"--api",
						"none",
						"--auth",
						"none",
						"--db-setup",
						"none",
						"--web-deploy",
						"none",
						"--server-deploy",
						"none",
						"--addons",
						"none",
						"--examples",
						"none",
						"--package-manager",
						"bun",
						"--no-install",
						"--no-git",
					],
					workdir,
				);

				const projectDir = join(workdir, projectName);
				assertScaffoldedProject(projectDir);
				assertProjectStructure(projectDir, {
					hasWeb: WEB_FRONTENDS.has(frontend),
					hasNative:
						frontend === "native-nativewind" || frontend === "native-unistyles",
					hasConvexBackend: true,
					hasServer: false,
				});
				assertBtsConfig(projectDir, {
					frontend: [frontend],
					backend: "convex",
					database: "none",
					orm: "none",
					auth: "none",
				});
			});
		}
	});

	describe("convex + clerk auth combinations", () => {
		const WEB_FRONTENDS = [
			"tanstack-router",
			"react-router",
			"tanstack-start",
			"next",
		] as const;
		const NATIVE_FRONTENDS = ["native-nativewind", "native-unistyles"] as const;

		for (const frontend of WEB_FRONTENDS) {
			it(`scaffolds ${frontend} + convex + clerk`, async () => {
				const projectName = `app-convex-clerk-${frontend.replace(/[^a-z-]/g, "").slice(0, 20)}`;
				await runCli(
					[
						projectName,
						"--frontend",
						frontend,
						"--backend",
						"convex",
						"--runtime",
						"none",
						"--api",
						"none",
						"--database",
						"none",
						"--orm",
						"none",
						"--auth",
						"clerk",
						"--db-setup",
						"none",
						"--web-deploy",
						"none",
						"--server-deploy",
						"none",
						"--addons",
						"none",
						"--examples",
						"none",
						"--package-manager",
						"bun",
						"--no-install",
						"--no-git",
					],
					workdir,
				);

				const projectDir = join(workdir, projectName);
				assertScaffoldedProject(projectDir);
				assertProjectStructure(projectDir, {
					hasWeb: true,
					hasNative: false,
					hasConvexBackend: true,
					hasServer: false,
				});
				assertBtsConfig(projectDir, {
					frontend: [frontend],
					backend: "convex",
					database: "none",
					orm: "none",
					auth: "clerk",
				});
			});
		}

		for (const frontend of NATIVE_FRONTENDS) {
			it(`scaffolds ${frontend} + convex + clerk`, async () => {
				const projectName = `app-convex-clerk-${frontend.replace(/[^a-z-]/g, "").slice(0, 20)}`;
				await runCli(
					[
						projectName,
						"--frontend",
						frontend,
						"--backend",
						"convex",
						"--runtime",
						"none",
						"--api",
						"none",
						"--database",
						"none",
						"--orm",
						"none",
						"--auth",
						"clerk",
						"--db-setup",
						"none",
						"--web-deploy",
						"none",
						"--server-deploy",
						"none",
						"--addons",
						"none",
						"--examples",
						"none",
						"--package-manager",
						"bun",
						"--no-install",
						"--no-git",
					],
					workdir,
				);

				const projectDir = join(workdir, projectName);
				assertScaffoldedProject(projectDir);
				assertProjectStructure(projectDir, {
					hasWeb: false,
					hasNative: true,
					hasConvexBackend: true,
					hasServer: false,
				});
				assertBtsConfig(projectDir, {
					frontend: [frontend],
					backend: "convex",
					database: "none",
					orm: "none",
					auth: "clerk",
				});
			});
		}

		it("scaffolds tanstack-router + native-nativewind + convex + clerk", async () => {
			const projectName = "app-convex-clerk-web-native";
			await runCli(
				[
					projectName,
					"--frontend",
					"tanstack-router",
					"native-nativewind",
					"--backend",
					"convex",
					"--runtime",
					"none",
					"--api",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--auth",
					"clerk",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasNative: true,
				hasConvexBackend: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["tanstack-router", "native-nativewind"],
				backend: "convex",
				database: "none",
				orm: "none",
				auth: "clerk",
			});
		});

		it("scaffolds next + native-unistyles + convex + clerk", async () => {
			const projectName = "app-convex-clerk-next-native";
			await runCli(
				[
					projectName,

					"--frontend",
					"next",
					"native-unistyles",
					"--backend",
					"convex",
					"--runtime",
					"none",
					"--api",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--auth",
					"clerk",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasNative: true,
				hasConvexBackend: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["next", "native-unistyles"],
				backend: "convex",
				database: "none",
				orm: "none",
				auth: "clerk",
			});
		});

		it("scaffolds tanstack-start + native-nativewind + convex + clerk", async () => {
			const projectName = "app-convex-clerk-start-native";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-start",
					"native-nativewind",
					"--backend",
					"convex",
					"--runtime",
					"none",
					"--api",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--auth",
					"clerk",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasNative: true,
				hasConvexBackend: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["tanstack-start", "native-nativewind"],
				backend: "convex",
				database: "none",
				orm: "none",
				auth: "clerk",
			});
		});
	});
	afterAll(async () => {
		try {
			await remove(workdir);
		} catch {}
	});

	it("scaffolds minimal default project with yes flag", async () => {
		const projectName = "app-default";
		await runCli([projectName, "--yes", "--no-install", "--no-git"], workdir);

		const projectDir = join(workdir, projectName);
		assertScaffoldedProject(projectDir);
		assertProjectStructure(projectDir, {
			hasWeb: true,
			hasServer: true,
			hasAuth: true,
			hasDatabase: true,
			hasTurborepo: true,
		});
		assertBtsConfig(projectDir, {
			frontend: ["tanstack-router"],
			backend: "hono",
			database: "sqlite",
			orm: "drizzle",
			auth: "better-auth",
			addons: ["turborepo"],
		});
	});

	it("scaffolds with turborepo addon", async () => {
		const projectName = "app-turbo";
		await runCli(
			[
				projectName,

				"--frontend",
				"tanstack-router",
				"--backend",
				"hono",
				"--runtime",
				"bun",
				"--database",
				"none",
				"--orm",
				"none",
				"--api",
				"none",
				"--auth",
				"none",
				"--addons",
				"turborepo",
				"--db-setup",
				"none",
				"--examples",
				"none",
				"--package-manager",
				"bun",
				"--web-deploy",
				"none",
				"--server-deploy",
				"none",
				"--no-install",
				"--no-git",
			],
			workdir,
		);

		const projectDir = join(workdir, projectName);
		assertScaffoldedProject(projectDir);
		assertProjectStructure(projectDir, {
			hasWeb: true,
			hasServer: true,
			hasTurborepo: true,
			hasAuth: false,
			hasDatabase: false,
		});
		assertBtsConfig(projectDir, {
			frontend: ["tanstack-router"],
			backend: "hono",
			addons: ["turborepo"],
		});
	});

	it("scaffolds convex preset", async () => {
		const projectName = "app-convex";
		await runCli(
			[
				projectName,

				"--frontend",
				"tanstack-router",
				"--backend",
				"convex",
				"--runtime",
				"none",
				"--api",
				"none",
				"--database",
				"none",
				"--orm",
				"none",
				"--auth",
				"none",
				"--db-setup",
				"none",
				"--server-deploy",
				"none",
				"--addons",
				"none",
				"--examples",
				"todo",
				"--package-manager",
				"bun",
				"--web-deploy",
				"none",
				"--server-deploy",
				"none",
				"--no-install",
				"--no-git",
			],
			workdir,
		);
		const projectDir = join(workdir, projectName);
		assertScaffoldedProject(projectDir);
		assertProjectStructure(projectDir, {
			hasWeb: true,
			hasConvexBackend: true,
			hasServer: false,
			hasAuth: false,
			hasDatabase: false,
		});
		assertBtsConfig(projectDir, {
			frontend: ["tanstack-router"],
			backend: "convex",
			database: "none",
			orm: "none",
			auth: "none",
			examples: ["todo"],
		});
	});

	describe("frontend combinations", () => {
		it("scaffolds with Next.js frontend", async () => {
			const projectName = "app-next";
			await runCli(
				[
					projectName,
					"--frontend",
					"next",
					"--backend",
					"none",
					"--runtime",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["next"],
				backend: "none",
			});
		});

		it("scaffolds with Nuxt frontend", async () => {
			const projectName = "app-nuxt";
			await runCli(
				[
					projectName,
					"--frontend",
					"nuxt",
					"--backend",
					"none",
					"--runtime",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["nuxt"],
				backend: "none",
			});
		});

		it("scaffolds with Svelte frontend", async () => {
			const projectName = "app-svelte";
			await runCli(
				[
					projectName,
					"--frontend",
					"svelte",
					"--backend",
					"none",
					"--runtime",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["svelte"],
				backend: "none",
			});
		});

		it("scaffolds with Solid frontend", async () => {
			const projectName = "app-solid";
			await runCli(
				[
					projectName,
					"--frontend",
					"solid",
					"--backend",
					"none",
					"--runtime",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["solid"],
				backend: "none",
			});
		});

		it("scaffolds with React Native (NativeWind)", async () => {
			const projectName = "app-native";
			await runCli(
				[
					projectName,
					"--frontend",
					"native-nativewind",
					"--backend",
					"none",
					"--runtime",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasNative: true,
				hasServer: false,
			});
			assertBtsConfig(projectDir, {
				frontend: ["native-nativewind"],
				backend: "none",
			});
		});
	});

	describe("backend combinations", () => {
		it("scaffolds with Express backend", async () => {
			const projectName = "app-express";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"express",
					"--runtime",
					"node",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
			});
			assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "express",
			});
		});

		it("scaffolds with Fastify backend", async () => {
			const projectName = "app-fastify";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"fastify",
					"--runtime",
					"node",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
			});
			assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "fastify",
			});
		});

		it("scaffolds with Elysia backend", async () => {
			const projectName = "app-elysia";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"elysia",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
			});
			assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "elysia",
			});
		});
	});

	describe("database and ORM combinations", () => {
		it("scaffolds with SQLite + Drizzle", async () => {
			const projectName = "app-sqlite-drizzle";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasDatabase: true,
			});
			assertBtsConfig(projectDir, {
				database: "sqlite",
				orm: "drizzle",
			});
		});

		it("scaffolds with PostgreSQL + Prisma", async () => {
			const projectName = "app-postgres-prisma";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"postgres",
					"--orm",
					"prisma",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasDatabase: true,
			});
			assertBtsConfig(projectDir, {
				database: "postgres",
				orm: "prisma",
			});
		});

		it("scaffolds with PostgreSQL + Drizzle", async () => {
			const projectName = "app-postgres-drizzle";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"postgres",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasDatabase: true,
			});
			assertBtsConfig(projectDir, {
				database: "postgres",
				orm: "drizzle",
			});
		});

		it("scaffolds with MongoDB + Mongoose", async () => {
			const projectName = "app-mongo-mongoose";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"mongodb",
					"--orm",
					"mongoose",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasDatabase: true,
			});
			assertBtsConfig(projectDir, {
				database: "mongodb",
				orm: "mongoose",
			});
		});
	});

	describe("addon combinations", () => {
		it("scaffolds with Biome addon", async () => {
			const projectName = "app-biome";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"biome",
					"--db-setup",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasBiome: true,
			});
			assertBtsConfig(projectDir, {
				addons: ["biome"],
			});
		});

		it("scaffolds with multiple addons", async () => {
			const projectName = "app-multi-addons";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"turborepo",
					"biome",
					"--db-setup",
					"none",
					"--examples",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasTurborepo: true,
				hasBiome: true,
			});
			assertBtsConfig(projectDir, {
				addons: ["turborepo", "biome"],
			});
		});
	});

	describe("API types", () => {
		it("scaffolds with tRPC API", async () => {
			const projectName = "app-trpc";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				api: "trpc",
			});
		});

		it("scaffolds with oRPC API", async () => {
			const projectName = "app-orpc";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"orpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				api: "orpc",
			});
		});
	});

	describe("validation and error cases", () => {
		it("rejects invalid project names", async () => {
			await runCliExpectingError(
				[
					"<invalid>",

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects incompatible database and ORM combinations", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-database-orm",

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"mongodb",
					"--orm",
					"drizzle",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects incompatible frontend and API combinations", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-frontend-api",

					"--frontend",
					"nuxt",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects multiple web frontends", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-multiple-web",

					"--frontend",
					"tanstack-router",
					"next",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects Turso db-setup with non-SQLite database", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-turso-sqlite",

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"postgres",
					"--orm",
					"prisma",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"turso",
					"--examples",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects convex + better-auth combination", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-convex-better-auth",

					"--frontend",
					"tanstack-router",
					"--backend",
					"convex",
					"--auth",
					"better-auth",
					"--db-setup",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects nuxt + convex + clerk combination", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-nuxt-convex-clerk",

					"--frontend",
					"nuxt",
					"--backend",
					"convex",
					"--auth",
					"clerk",
					"--db-setup",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects svelte + convex + clerk combination", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-svlete-convex-clerk",

					"--frontend",
					"svelte",
					"--backend",
					"convex",
					"--auth",
					"clerk",
					"--db-setup",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});
	});

	describe("YOLO mode", () => {
		it("bypasses db-setup/database validation (Turso + Postgres + Prisma)", async () => {
			const projectName = "app-yolo-turso-postgres";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"postgres",
					"--orm",
					"prisma",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"turso",
					"--examples",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
					"--yolo",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				database: "postgres",
				orm: "prisma",
			});
		});

		it("bypasses web-deploy requires web frontend (none + wrangler)", async () => {
			const projectName = "app-yolo-webdeploy-no-frontend";
			await runCli(
				[
					projectName,
					"--frontend",
					"none",
					"--backend",
					"none",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"wrangler",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
					"--yolo",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				backend: "none",
				webDeploy: "wrangler",
			});
		});
	});

	describe("runtime compatibility", () => {
		it("scaffolds with Cloudflare Workers runtime", async () => {
			const projectName = "app-workers";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--server-deploy",
					"wrangler",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				backend: "hono",
				runtime: "workers",
				orm: "drizzle",
			});
		});

		it("rejects incompatible runtime and backend combinations", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-runtime-backend",

					"--frontend",
					"tanstack-router",
					"--backend",
					"express",
					"--runtime",
					"workers",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});

		it("rejects incompatible runtime and ORM combinations", async () => {
			await runCliExpectingError(
				[
					"invalid-combo-runtime-orm",

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--database",
					"postgres",
					"--orm",
					"prisma",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);
		});
	});

	describe("package managers", () => {
		it("scaffolds with npm package manager", async () => {
			const projectName = "app-npm";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"npm",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				packageManager: "npm",
			});
		});

		it("scaffolds with pnpm package manager", async () => {
			const projectName = "app-pnpm";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"pnpm",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				packageManager: "pnpm",
			});

			expect(existsSync(join(projectDir, "pnpm-workspace.yaml"))).toBe(true);
		});
	});

	describe("comprehensive missing combinations", () => {
		it("scaffolds Nuxt + AI example", async () => {
			const projectName = "app-nuxt-ai";
			await runCli(
				[
					projectName,

					"--frontend",
					"nuxt",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"orpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"ai",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				frontend: ["nuxt"],
				backend: "hono",
				examples: ["ai"],
				api: "orpc",
			});
		});
		it("scaffolds with todo example", async () => {
			const projectName = "app-example-todo";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"todo",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				examples: ["todo"],
			});
		});

		it("scaffolds with ai example", async () => {
			const projectName = "app-example-ai";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"ai",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				examples: ["ai"],
			});
		});

		it("scaffolds convex with todo example (default)", async () => {
			const projectName = "app-convex-todo";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"convex",
					"--runtime",
					"none",
					"--api",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--auth",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--addons",
					"none",
					"--examples",
					"todo",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				backend: "convex",
				examples: ["todo"],
				auth: "none",
			});
		});

		it("scaffolds with git enabled", async () => {
			const projectName = "app-with-git";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--git",
					"--no-install",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			expect(existsSync(join(projectDir, ".git"))).toBe(true);
		});

		it("scaffolds with install enabled", async () => {
			const projectName = "app-with-install";
			await runCli(
				[
					projectName,

					"--directory-conflict",
					"overwrite",
					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			expect(existsSync(join(projectDir, "node_modules"))).toBe(true);
		});

		it("scaffolds with PWA addon", async () => {
			const projectName = "app-addon-pwa";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"pwa",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				addons: ["pwa"],
			});
		});

		it("scaffolds with Tauri addon", async () => {
			const projectName = "app-addon-tauri";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"tauri",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				addons: ["tauri"],
			});
		});

		it("scaffolds with Husky addon", async () => {
			const projectName = "app-addon-husky";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"husky",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				addons: ["husky"],
			});
		});

		it("scaffolds with authentication enabled", async () => {
			const projectName = "app-with-auth";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"better-auth",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertProjectStructure(projectDir, {
				hasWeb: true,
				hasServer: true,
				hasAuth: true,
				hasDatabase: true,
			});
			assertBtsConfig(projectDir, {
				auth: "better-auth",
			});
		});

		it("scaffolds with MySQL + Prisma", async () => {
			const projectName = "app-mysql-prisma";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"mysql",
					"--orm",
					"prisma",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				database: "mysql",
				orm: "prisma",
			});
		});

		it("scaffolds with MySQL + Drizzle", async () => {
			const projectName = "app-mysql-drizzle";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"mysql",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				database: "mysql",
				orm: "drizzle",
			});
		});

		it("scaffolds with MySQL + Drizzle + PlanetScale", async () => {
			const projectName = "app-mysql-drizzle-planetscale";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"mysql",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"planetscale",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				database: "mysql",
				orm: "drizzle",
			});
		});

		it("scaffolds with MySQL + Prisma + PlanetScale", async () => {
			const projectName = "app-mysql-prisma-planetscale";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"mysql",
					"--orm",
					"prisma",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"planetscale",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				database: "mysql",
				orm: "prisma",
			});
		});

		it("scaffolds with PostgreSQL + Drizzle + PlanetScale", async () => {
			const projectName = "app-postgres-drizzle-planetscale";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"postgres",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"planetscale",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				database: "postgres",
				orm: "drizzle",
			});
		});

		it("scaffolds with PostgreSQL + Prisma + PlanetScale", async () => {
			const projectName = "app-postgres-prisma-planetscale";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"postgres",
					"--orm",
					"prisma",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"planetscale",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				database: "postgres",
				orm: "prisma",
			});
		});

		it("scaffolds oRPC with Next.js", async () => {
			const projectName = "app-orpc-next";
			await runCli(
				[
					projectName,

					"--frontend",
					"next",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"orpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				frontend: ["next"],
				api: "orpc",
			});
		});

		it("scaffolds oRPC with Nuxt (compatible)", async () => {
			const projectName = "app-orpc-nuxt";
			await runCli(
				[
					projectName,

					"--frontend",
					"nuxt",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"orpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				frontend: ["nuxt"],
				api: "orpc",
			});
		});

		it("scaffolds oRPC with Svelte", async () => {
			const projectName = "app-orpc-svelte";
			await runCli(
				[
					projectName,

					"--frontend",
					"svelte",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"orpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				frontend: ["svelte"],
				api: "orpc",
			});
		});

		it("scaffolds oRPC with Solid", async () => {
			const projectName = "app-orpc-solid";
			await runCli(
				[
					projectName,

					"--frontend",
					"solid",
					"--backend",
					"hono",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"orpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				frontend: ["solid"],
				api: "orpc",
			});
		});

		it("scaffolds with Next.js backend", async () => {
			const projectName = "app-backend-next";
			await runCli(
				[
					projectName,

					"--frontend",
					"next",
					"--backend",
					"next",
					"--runtime",
					"bun",
					"--database",
					"sqlite",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				frontend: ["next"],
				backend: "next",
			});
		});

		it("scaffolds with Node runtime", async () => {
			const projectName = "app-node-runtime";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"express",
					"--runtime",
					"node",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				runtime: "node",
			});
		});

		it("scaffolds with MySQL + Drizzle + PlanetScale + Node runtime", async () => {
			const projectName = "app-mysql-drizzle-planetscale-node";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"node",
					"--database",
					"mysql",
					"--orm",
					"drizzle",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"planetscale",
					"--web-deploy",
					"none",
					"--server-deploy",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				database: "mysql",
				orm: "drizzle",
				runtime: "node",
			});
		});

		it("scaffolds with MySQL + Prisma + PlanetScale + Workers runtime", async () => {
			const projectName = "app-mysql-prisma-planetscale-workers";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--database",
					"mysql",
					"--orm",
					"prisma",
					"--api",
					"trpc",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"planetscale",
					"--web-deploy",
					"none",
					"--server-deploy",
					"wrangler",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			assertScaffoldedProject(projectDir);
			assertBtsConfig(projectDir, {
				database: "mysql",
				orm: "prisma",
				runtime: "workers",
			});
		});
	});

	(process.env.WITH_BUILD === "1" ? describe : describe.skip)(
		"build each scaffolded project",
		() => {
			const sanitize = (s: string) => s.replace(/[^a-z-]/g, "").slice(0, 30);
			const FRONTENDS_ALL = [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
				"nuxt",
				"svelte",
				"solid",
				"native-nativewind",
				"native-unistyles",
			] as const;
			const BACKENDS_STANDARD = [
				"hono",
				"express",
				"fastify",
				"elysia",
			] as const;
			const CONVEX_COMPATIBLE_FRONTENDS = FRONTENDS_ALL.filter(
				(f) => f !== "solid",
			);

			const projectNames = new Set<string>();
			for (const backend of BACKENDS_STANDARD) {
				for (const frontend of FRONTENDS_ALL) {
					projectNames.add(`app-${backend}-${sanitize(frontend)}`);
				}
			}
			for (const frontend of CONVEX_COMPATIBLE_FRONTENDS) {
				projectNames.add(`app-convex-${sanitize(frontend)}`);
			}

			const WEB_FRONTENDS_CLERK = [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
			];
			const NATIVE_FRONTENDS_CLERK = ["native-nativewind", "native-unistyles"];

			for (const frontend of WEB_FRONTENDS_CLERK) {
				projectNames.add(`app-convex-clerk-${sanitize(frontend)}`);
			}
			for (const frontend of NATIVE_FRONTENDS_CLERK) {
				projectNames.add(`app-convex-clerk-${sanitize(frontend)}`);
			}
			projectNames.add("app-convex-clerk-web-native");
			projectNames.add("app-convex-clerk-next-native");
			projectNames.add("app-convex-clerk-start-native");
			[
				"app-default",
				"app-min",
				"app-turbo",
				"app-convex",
				"app-next",
				"app-nuxt",
				"app-svelte",
				"app-solid",
				"app-native",
				"app-express",
				"app-fastify",
				"app-elysia",
				"app-sqlite-drizzle",
				"app-postgres-prisma",
				"app-mongo-mongoose",
				"app-biome",
				"app-multi-addons",
				"app-trpc",
				"app-orpc",
				"app-nuxt-ai",
				"app-example-todo",
				"app-example-ai",
				"app-convex-todo",
				"app-with-git",
				"app-with-install",
				"app-addon-pwa",
				"app-addon-tauri",
				"app-addon-husky",
				"app-with-auth",
				"app-mysql-prisma",
				"app-mysql-drizzle",
				"app-mysql-drizzle-planetscale",
				"app-mysql-prisma-planetscale",
				"app-postgres-drizzle-planetscale",
				"app-postgres-prisma-planetscale",
				"app-orpc-next",
				"app-orpc-nuxt",
				"app-orpc-svelte",
				"app-orpc-solid",
				"app-backend-next",
				"app-node-runtime",
				"app-mysql-drizzle-planetscale-node",
				"app-mysql-prisma-planetscale-workers",
			].forEach((n) => {
				projectNames.add(n);
			});

			const detectPackageManager = async (
				projectDir: string,
			): Promise<"bun" | "pnpm" | "npm"> => {
				const bts = readBtsConfig(projectDir) as { packageManager?: string };
				const pkgJsonPath = join(projectDir, "package.json");
				const pkg = existsSync(pkgJsonPath) ? await readJson(pkgJsonPath) : {};
				const pkgMgrField =
					(pkg.packageManager as string | undefined) || bts.packageManager;

				if (typeof pkgMgrField === "string") {
					if (pkgMgrField.includes("pnpm")) return "pnpm";
					if (pkgMgrField.includes("npm")) return "npm";
					if (pkgMgrField.includes("bun")) return "bun";
				}
				if (existsSync(join(projectDir, "pnpm-workspace.yaml"))) return "pnpm";
				return "bun";
			};

			const runInstall = async (pm: "bun" | "pnpm" | "npm", cwd: string) => {
				if (pm === "bun")
					return execa("bun", ["install"], { cwd, stdio: "inherit" });
				if (pm === "pnpm")
					return execa("pnpm", ["install", "--no-frozen-lockfile"], {
						cwd,
						stdio: "inherit",
					});
				return execa("npm", ["install", "--no-audit", "--no-fund"], {
					cwd,
					stdio: "inherit",
				});
			};

			const runScript = async (
				pm: "bun" | "pnpm" | "npm",
				cwd: string,
				script: string,
				extraArgs: string[] = [],
				timeout?: number,
			) => {
				const base = pm === "bun" ? ["run", script] : ["run", script];
				const cmd = pm === "bun" ? "bun" : pm;
				return execa(cmd, [...base, ...extraArgs], {
					cwd,
					timeout,
					env: { ...process.env, NODE_ENV: "production", CI: "true" },
					stdio: "inherit",
				});
			};

			for (const dirName of projectNames) {
				it(`builds ${dirName}`, async () => {
					const projectDir = join(workdir, dirName);
					if (!existsSync(projectDir)) {
						consola.info(`${dirName} not found, skipping`);
						return;
					}
					const pm = await detectPackageManager(projectDir);

					consola.info(`Processing ${dirName} (pm=${pm})`);
					try {
						consola.start(`Installing dependencies for ${dirName}...`);
						try {
							const res = await runInstall(pm, projectDir);
							expect(res.exitCode).toBe(0);
						} catch (installErr) {
							if (pm !== "bun") {
								consola.warn(
									`Primary install with ${pm} failed. Retrying with bun...`,
								);
								const fallback = await runInstall("bun", projectDir);
								expect(fallback.exitCode).toBe(0);
							} else {
								throw installErr;
							}
						}

						const pkgJsonPath = join(projectDir, "package.json");
						const pkg = await readJson(pkgJsonPath);
						const scripts = pkg.scripts || {};
						consola.info(`Scripts: ${Object.keys(scripts).join(", ")}`);

						const bts = (await readBtsConfig(projectDir)) as {
							backend?: string;
							frontend?: string[];
						};
						if (bts.backend === "convex") {
							const frontends = Array.isArray(bts.frontend) ? bts.frontend : [];
							const WEB_FRONTENDS = new Set([
								"tanstack-router",
								"react-router",
								"tanstack-start",
								"next",
								"nuxt",
								"svelte",
								"solid",
							]);
							const hasWebFrontend = frontends.some((f) =>
								WEB_FRONTENDS.has(f),
							);
							if (!hasWebFrontend) {
								consola.info(
									"Skipping Convex native-only project (no web app)",
								);
								return;
							}
						}

						if (scripts.build) {
							consola.start(`Building ${dirName}...`);
							const isTurbo = existsSync(join(projectDir, "turbo.json"));
							const extraArgs = isTurbo ? ["--force"] : [];
							const buildRes = await runScript(
								pm,
								projectDir,
								"build",
								extraArgs,
								300_000,
							);
							expect(buildRes.exitCode).toBe(0);
							consola.success(`${dirName} built successfully`);
						}

						if (!scripts.build) {
							consola.info(`No build script for ${dirName}, skipping`);
						}
					} catch (error) {
						consola.error(`${dirName} failed`, error);
						throw error;
					}
				});
			}
		},
	);

	describe("deploy combinations", () => {
		it("scaffolds workers runtime + web deploy wrangler", async () => {
			const projectName = "app-web-wrangler";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--web-deploy",
					"wrangler",
					"--server-deploy",
					"wrangler",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "workers",
			});
		});

		it("scaffolds workers runtime + web deploy alchemy", async () => {
			const projectName = "app-web-alchemy";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--web-deploy",
					"alchemy",
					"--server-deploy",
					"alchemy",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "workers",
			});
		});

		it("scaffolds workers runtime + server deploy alchemy (server-only)", async () => {
			const projectName = "app-server-only-alchemy";
			await runCli(
				[
					projectName,

					"--directory-conflict",
					"overwrite",
					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--server-deploy",
					"alchemy",
					"--web-deploy",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "workers",
				serverDeploy: "alchemy",
			});
			consola.info("Verifying server-only Alchemy artifacts");
			expect(
				existsSync(join(projectDir, "apps", "server", "alchemy.run.ts")),
			).toBe(true);
			expect(existsSync(join(projectDir, "apps", "server", "env.d.ts"))).toBe(
				true,
			);
			expect(existsSync(join(projectDir, "alchemy.run.ts"))).toBe(false);
		});

		it("scaffolds workers runtime + server deploy wrangler", async () => {
			const projectName = "app-server-wrangler";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--server-deploy",
					"wrangler",
					"--web-deploy",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "workers",
			});
		});

		it("scaffolds workers runtime + server deploy alchemy", async () => {
			const projectName = "app-server-alchemy";
			await runCli(
				[
					projectName,

					"--frontend",
					"tanstack-router",
					"--backend",
					"hono",
					"--runtime",
					"workers",
					"--server-deploy",
					"alchemy",
					"--web-deploy",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "workers",
			});
		});

		it("scaffolds web deploy wrangler with backend none (no server deploy)", async () => {
			const projectName = "app-web-wrangler-only";
			await runCli(
				[
					projectName,
					"--frontend",
					"tanstack-router",
					"--backend",
					"none",
					"--runtime",
					"none",
					"--web-deploy",
					"wrangler",
					"--server-deploy",
					"none",
					"--database",
					"none",
					"--orm",
					"none",
					"--api",
					"none",
					"--auth",
					"none",
					"--addons",
					"none",
					"--examples",
					"none",
					"--db-setup",
					"none",
					"--package-manager",
					"bun",
					"--no-install",
					"--no-git",
				],
				workdir,
			);

			const projectDir = join(workdir, projectName);
			await assertScaffoldedProject(projectDir);
			await assertBtsConfig(projectDir, {
				frontend: ["tanstack-router"],
				backend: "none",
				webDeploy: "wrangler",
			});
		});
	});
});

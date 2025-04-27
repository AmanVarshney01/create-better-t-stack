import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import { globby } from "globby";
import pc from "picocolors";
import { PKG_ROOT } from "../constants";
import type { ProjectConfig } from "../types";
import { processTemplate } from "../utils/template-processor";

async function processAndCopyFiles(
	sourcePattern: string | string[],
	baseSourceDir: string,
	destDir: string,
	context: ProjectConfig,
	overwrite = true,
): Promise<void> {
	const sourceFiles = await globby(sourcePattern, {
		cwd: baseSourceDir,
		dot: true,
		onlyFiles: true,
		absolute: false,
	});

	for (const relativeSrcPath of sourceFiles) {
		const srcPath = path.join(baseSourceDir, relativeSrcPath);
		let relativeDestPath = relativeSrcPath;

		if (relativeSrcPath.endsWith(".hbs")) {
			relativeDestPath = relativeSrcPath.slice(0, -4);
		}
		if (path.basename(relativeSrcPath) === "_gitignore") {
			relativeDestPath = path.join(path.dirname(relativeSrcPath), ".gitignore");
		}
		if (path.basename(relativeSrcPath) === "_npmrc") {
			relativeDestPath = path.join(path.dirname(relativeSrcPath), ".npmrc");
		}

		const destPath = path.join(destDir, relativeDestPath);

		await fs.ensureDir(path.dirname(destPath));

		if (!overwrite && (await fs.pathExists(destPath))) {
			continue;
		}

		if (srcPath.endsWith(".hbs")) {
			await processTemplate(srcPath, destPath, context);
		} else {
			await fs.copy(srcPath, destPath, { overwrite: true });
		}
	}
}

export async function copyBaseTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const templateDir = path.join(PKG_ROOT, "templates/base");
	await processAndCopyFiles(["**/*"], templateDir, projectDir, context);
}

export async function setupFrontendTemplates(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = context.frontend.includes("nuxt");
	const hasSvelteWeb = context.frontend.includes("svelte");
	const hasNative = context.frontend.includes("native");

	if (hasReactWeb || hasNuxtWeb || hasSvelteWeb) {
		const webAppDir = path.join(projectDir, "apps/web");
		await fs.ensureDir(webAppDir);

		if (hasReactWeb) {
			const webBaseDir = path.join(
				PKG_ROOT,
				"templates/frontend/react/web-base",
			);
			if (await fs.pathExists(webBaseDir)) {
				await processAndCopyFiles("**/*", webBaseDir, webAppDir, context);
			}
			const reactFramework = context.frontend.find((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			);
			if (reactFramework) {
				const frameworkSrcDir = path.join(
					PKG_ROOT,
					`templates/frontend/react/${reactFramework}`,
				);
				if (await fs.pathExists(frameworkSrcDir)) {
					await processAndCopyFiles(
						"**/*",
						frameworkSrcDir,
						webAppDir,
						context,
					);
				}
				const apiWebBaseDir = path.join(
					PKG_ROOT,
					`templates/api/${context.api}/web/react/base`,
				);
				if (await fs.pathExists(apiWebBaseDir)) {
					await processAndCopyFiles("**/*", apiWebBaseDir, webAppDir, context);
				}
			}
		} else if (hasNuxtWeb) {
			const nuxtBaseDir = path.join(PKG_ROOT, "templates/frontend/nuxt");
			if (await fs.pathExists(nuxtBaseDir)) {
				await processAndCopyFiles("**/*", nuxtBaseDir, webAppDir, context);
			}
			const apiWebNuxtDir = path.join(
				PKG_ROOT,
				`templates/api/${context.api}/web/nuxt`,
			);
			if (await fs.pathExists(apiWebNuxtDir)) {
				await processAndCopyFiles("**/*", apiWebNuxtDir, webAppDir, context);
			}
		} else if (hasSvelteWeb) {
			const svelteBaseDir = path.join(PKG_ROOT, "templates/frontend/svelte");
			if (await fs.pathExists(svelteBaseDir)) {
				await processAndCopyFiles("**/*", svelteBaseDir, webAppDir, context);
			}
			if (context.api === "orpc") {
				const apiWebSvelteDir = path.join(
					PKG_ROOT,
					`templates/api/${context.api}/web/svelte`,
				);
				if (await fs.pathExists(apiWebSvelteDir)) {
					await processAndCopyFiles(
						"**/*",
						apiWebSvelteDir,
						webAppDir,
						context,
					);
				}
			}
		}
	}

	if (hasNative) {
		const nativeAppDir = path.join(projectDir, "apps/native");
		await fs.ensureDir(nativeAppDir);

		const nativeBaseDir = path.join(PKG_ROOT, "templates/frontend/native");
		if (await fs.pathExists(nativeBaseDir)) {
			await processAndCopyFiles("**/*", nativeBaseDir, nativeAppDir, context);
		}

		if (context.api === "trpc") {
			const apiNativeSrcDir = path.join(
				PKG_ROOT,
				`templates/api/${context.api}/native`,
			);
			if (await fs.pathExists(apiNativeSrcDir)) {
				await processAndCopyFiles(
					"**/*",
					apiNativeSrcDir,
					nativeAppDir,
					context,
				);
			}
		} else if (context.api === "orpc") {
			const apiNativeSrcDir = path.join(
				PKG_ROOT,
				`templates/api/${context.api}/native`,
			);
			if (await fs.pathExists(apiNativeSrcDir)) {
				await processAndCopyFiles(
					"**/*",
					apiNativeSrcDir,
					nativeAppDir,
					context,
				);
			}
		}
	}
}

export async function setupBackendFramework(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if ((context.backend as string) === "none") return;

	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const serverBaseDir = path.join(PKG_ROOT, "templates/backend/server-base");
	if (await fs.pathExists(serverBaseDir)) {
		await processAndCopyFiles("**/*", serverBaseDir, serverAppDir, context);
	} else {
		consola.warn(
			pc.yellow(`Warning: server-base template not found at ${serverBaseDir}`),
		);
	}

	const frameworkSrcDir = path.join(
		PKG_ROOT,
		`templates/backend/${context.backend}`,
	);
	if (await fs.pathExists(frameworkSrcDir)) {
		await processAndCopyFiles("**/*", frameworkSrcDir, serverAppDir, context);
	} else {
		consola.warn(
			pc.yellow(
				`Warning: Backend template directory not found, skipping: ${frameworkSrcDir}`,
			),
		);
	}

	const apiServerBaseDir = path.join(
		PKG_ROOT,
		`templates/api/${context.api}/server/base`,
	);
	if (await fs.pathExists(apiServerBaseDir)) {
		await processAndCopyFiles("**/*", apiServerBaseDir, serverAppDir, context);
	}

	const apiServerFrameworkDir = path.join(
		PKG_ROOT,
		`templates/api/${context.api}/server/${context.backend}`,
	);
	if (await fs.pathExists(apiServerFrameworkDir)) {
		await processAndCopyFiles(
			"**/*",
			apiServerFrameworkDir,
			serverAppDir,
			context,
		);
	}
}

export async function setupDbOrmTemplates(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (context.orm === "none" || context.database === "none") return;

	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const dbOrmSrcDir = path.join(
		PKG_ROOT,
		`templates/db/${context.orm}/${context.database}`,
	);

	if (await fs.pathExists(dbOrmSrcDir)) {
		await processAndCopyFiles("**/*", dbOrmSrcDir, serverAppDir, context);
	} else {
		consola.warn(
			pc.yellow(
				`Warning: Database/ORM template directory not found, skipping: ${dbOrmSrcDir}`,
			),
		);
	}
}

export async function setupAuthTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (!context.auth) return;

	const serverAppDir = path.join(projectDir, "apps/server");
	const webAppDir = path.join(projectDir, "apps/web");
	const nativeAppDir = path.join(projectDir, "apps/native");

	const serverAppDirExists = await fs.pathExists(serverAppDir);
	const webAppDirExists = await fs.pathExists(webAppDir);
	const nativeAppDirExists = await fs.pathExists(nativeAppDir);

	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = context.frontend.includes("nuxt");
	const hasSvelteWeb = context.frontend.includes("svelte");
	const hasNative = context.frontend.includes("native");

	if (serverAppDirExists) {
		const authServerBaseSrc = path.join(PKG_ROOT, "templates/auth/server/base");
		if (await fs.pathExists(authServerBaseSrc)) {
			await processAndCopyFiles(
				"**/*",
				authServerBaseSrc,
				serverAppDir,
				context,
			);
		}

		if (context.backend === "next") {
			const authServerNextSrc = path.join(
				PKG_ROOT,
				"templates/auth/server/next",
			);
			if (await fs.pathExists(authServerNextSrc)) {
				await processAndCopyFiles(
					"**/*",
					authServerNextSrc,
					serverAppDir,
					context,
				);
			}
		}

		if (context.orm !== "none" && context.database !== "none") {
			const orm = context.orm;
			const db = context.database;
			let authDbSrc = "";
			if (orm === "drizzle") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/server/db/drizzle/${db}`,
				);
			} else if (orm === "prisma") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/server/db/prisma/${db}`,
				);
			}
			if (authDbSrc && (await fs.pathExists(authDbSrc))) {
				await processAndCopyFiles("**/*", authDbSrc, serverAppDir, context);
			} else {
				consola.warn(
					pc.yellow(
						`Warning: Auth template for ${orm}/${db} not found at ${authDbSrc}`,
					),
				);
			}
		}
	}

	if ((hasReactWeb || hasNuxtWeb || hasSvelteWeb) && webAppDirExists) {
		if (hasReactWeb) {
			const authWebBaseSrc = path.join(
				PKG_ROOT,
				"templates/auth/web/react/base",
			);
			if (await fs.pathExists(authWebBaseSrc)) {
				await processAndCopyFiles("**/*", authWebBaseSrc, webAppDir, context);
			}
			const reactFramework = context.frontend.find((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			);
			if (reactFramework) {
				const authWebFrameworkSrc = path.join(
					PKG_ROOT,
					`templates/auth/web/react/${reactFramework}`,
				);
				if (await fs.pathExists(authWebFrameworkSrc)) {
					await processAndCopyFiles(
						"**/*",
						authWebFrameworkSrc,
						webAppDir,
						context,
					);
				}
			}
		} else if (hasNuxtWeb) {
			const authWebNuxtSrc = path.join(PKG_ROOT, "templates/auth/web/nuxt");
			if (await fs.pathExists(authWebNuxtSrc)) {
				await processAndCopyFiles("**/*", authWebNuxtSrc, webAppDir, context);
			}
		} else if (hasSvelteWeb) {
			if (context.api === "orpc") {
				const authWebSvelteSrc = path.join(
					PKG_ROOT,
					"templates/auth/web/svelte",
				);
				if (await fs.pathExists(authWebSvelteSrc)) {
					await processAndCopyFiles(
						"**/*",
						authWebSvelteSrc,
						webAppDir,
						context,
					);
				}
			}
		}
	}

	if (hasNative && nativeAppDirExists) {
		const authNativeSrc = path.join(PKG_ROOT, "templates/auth/native");
		if (await fs.pathExists(authNativeSrc)) {
			await processAndCopyFiles("**/*", authNativeSrc, nativeAppDir, context);
		} else {
			consola.warn(
				pc.yellow(
					`Warning: Auth native template not found at ${authNativeSrc}`,
				),
			);
		}
	}
}

export async function setupAddonsTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (!context.addons || context.addons.length === 0) return;

	for (const addon of context.addons) {
		if (addon === "none") continue;

		let addonSrcDir = path.join(PKG_ROOT, `templates/addons/${addon}`);
		let addonDestDir = projectDir;

		if (addon === "pwa") {
			addonSrcDir = path.join(PKG_ROOT, "templates/addons/pwa/apps/web");
			addonDestDir = path.join(projectDir, "apps/web");
			if (!(await fs.pathExists(addonDestDir))) {
				continue;
			}
		}

		if (await fs.pathExists(addonSrcDir)) {
			await processAndCopyFiles("**/*", addonSrcDir, addonDestDir, context);
		} else {
		}
	}
}

export async function setupExamplesTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (!context.examples || context.examples.length === 0) return;

	const serverAppDir = path.join(projectDir, "apps/server");
	const webAppDir = path.join(projectDir, "apps/web");

	const serverAppDirExists = await fs.pathExists(serverAppDir);
	const webAppDirExists = await fs.pathExists(webAppDir);

	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = context.frontend.includes("nuxt");
	const hasSvelteWeb = context.frontend.includes("svelte");

	for (const example of context.examples) {
		if (example === "none") continue;

		const exampleBaseDir = path.join(PKG_ROOT, `templates/examples/${example}`);

		if (serverAppDirExists) {
			const exampleServerSrc = path.join(exampleBaseDir, "server");
			if (await fs.pathExists(exampleServerSrc)) {
				if (context.orm !== "none") {
					const exampleOrmBaseSrc = path.join(
						exampleServerSrc,
						context.orm,
						"base",
					);
					if (await fs.pathExists(exampleOrmBaseSrc)) {
						await processAndCopyFiles(
							"**/*",
							exampleOrmBaseSrc,
							serverAppDir,
							context,
							false,
						);
					}

					if (context.database !== "none") {
						const exampleDbSchemaSrc = path.join(
							exampleServerSrc,
							context.orm,
							context.database,
						);
						if (await fs.pathExists(exampleDbSchemaSrc)) {
							await processAndCopyFiles(
								"**/*",
								exampleDbSchemaSrc,
								serverAppDir,
								context,
								false,
							);
						}
					}
				}
			}
		}

		if (hasReactWeb && webAppDirExists) {
			const exampleWebSrc = path.join(exampleBaseDir, "web/react");
			if (await fs.pathExists(exampleWebSrc)) {
				const reactFramework = context.frontend.find((f) =>
					[
						"next",
						"react-router",
						"tanstack-router",
						"tanstack-start",
					].includes(f),
				);
				if (reactFramework) {
					const exampleWebFrameworkSrc = path.join(
						exampleWebSrc,
						reactFramework,
					);
					if (await fs.pathExists(exampleWebFrameworkSrc)) {
						await processAndCopyFiles(
							"**/*",
							exampleWebFrameworkSrc,
							webAppDir,
							context,
							false,
						);
					}
				}
			}
		} else if (hasNuxtWeb && webAppDirExists) {
			if (context.api === "orpc") {
				const exampleWebNuxtSrc = path.join(exampleBaseDir, "web/nuxt");
				if (await fs.pathExists(exampleWebNuxtSrc)) {
					await processAndCopyFiles(
						"**/*",
						exampleWebNuxtSrc,
						webAppDir,
						context,
						false,
					);
				} else {
				}
			}
		} else if (hasSvelteWeb && webAppDirExists) {
			if (context.api === "orpc") {
				const exampleWebSvelteSrc = path.join(exampleBaseDir, "web/svelte");
				if (await fs.pathExists(exampleWebSvelteSrc)) {
					await processAndCopyFiles(
						"**/*",
						exampleWebSvelteSrc,
						webAppDir,
						context,
						false,
					);
				} else {
				}
			}
		}
	}
}

export async function handleExtras(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const extrasDir = path.join(PKG_ROOT, "templates/extras");

	if (context.packageManager === "pnpm") {
		const pnpmWorkspaceSrc = path.join(extrasDir, "pnpm-workspace.yaml");
		const pnpmWorkspaceDest = path.join(projectDir, "pnpm-workspace.yaml");
		if (await fs.pathExists(pnpmWorkspaceSrc)) {
			await fs.copy(pnpmWorkspaceSrc, pnpmWorkspaceDest);
		}
	}

	if (
		context.packageManager === "pnpm" &&
		(context.frontend.includes("native") || context.frontend.includes("nuxt"))
	) {
		const npmrcTemplateSrc = path.join(extrasDir, "_npmrc.hbs");
		const npmrcDest = path.join(projectDir, ".npmrc");
		if (await fs.pathExists(npmrcTemplateSrc)) {
			await processTemplate(npmrcTemplateSrc, npmrcDest, context);
		}
	}
}

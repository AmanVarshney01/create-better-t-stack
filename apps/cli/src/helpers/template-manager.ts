import path from "node:path";
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
		const basename = path.basename(relativeSrcPath);
		if (basename === "_gitignore") {
			relativeDestPath = path.join(path.dirname(relativeSrcPath), ".gitignore");
		} else if (basename === "_npmrc") {
			relativeDestPath = path.join(path.dirname(relativeSrcPath), ".npmrc");
		}

		const destPath = path.join(destDir, relativeDestPath);

		try {
			await fs.ensureDir(path.dirname(destPath));

			if (!overwrite && (await fs.pathExists(destPath))) {
				continue;
			}

			if (srcPath.endsWith(".hbs")) {
				await processTemplate(srcPath, destPath, context);
			} else {
				await fs.copy(srcPath, destPath, { overwrite: true });
			}
		} catch (error) {}
	}
}

export async function copyBaseTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const templateDir = path.join(PKG_ROOT, "templates/base");
	await processAndCopyFiles(["**/*"], templateDir, projectDir, context);
	await fs.ensureDir(path.join(projectDir, "packages"));
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
	const isConvex = context.backend === "convex";

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
			} else {
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
				} else {
				}
				if (!isConvex && context.api !== "none") {
					const apiWebBaseDir = path.join(
						PKG_ROOT,
						`templates/api/${context.api}/web/react/base`,
					);
					if (await fs.pathExists(apiWebBaseDir)) {
						await processAndCopyFiles(
							"**/*",
							apiWebBaseDir,
							webAppDir,
							context,
						);
					} else {
					}
				}
			}
		} else if (hasNuxtWeb) {
			const nuxtBaseDir = path.join(PKG_ROOT, "templates/frontend/nuxt");
			if (await fs.pathExists(nuxtBaseDir)) {
				await processAndCopyFiles("**/*", nuxtBaseDir, webAppDir, context);
			} else {
			}
			if (!isConvex && context.api !== "none") {
				const apiWebNuxtDir = path.join(
					PKG_ROOT,
					`templates/api/${context.api}/web/nuxt`,
				);
				if (await fs.pathExists(apiWebNuxtDir)) {
					await processAndCopyFiles("**/*", apiWebNuxtDir, webAppDir, context);
				} else {
				}
			}
		} else if (hasSvelteWeb) {
			const svelteBaseDir = path.join(PKG_ROOT, "templates/frontend/svelte");
			if (await fs.pathExists(svelteBaseDir)) {
				await processAndCopyFiles("**/*", svelteBaseDir, webAppDir, context);
			} else {
			}
			if (!isConvex && context.api === "orpc") {
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
				} else {
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
		} else {
		}

		if (!isConvex && (context.api === "trpc" || context.api === "orpc")) {
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
			} else {
			}
		}
	}
}

export async function setupBackendFramework(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (context.backend === "convex") {
		const convexBackendDestDir = path.join(projectDir, "packages/backend");
		const convexSrcDir = path.join(
			PKG_ROOT,
			"templates/backend/convex/packages/backend",
		);

		await fs.ensureDir(convexBackendDestDir);

		if (await fs.pathExists(convexSrcDir)) {
			await processAndCopyFiles(
				"**/*",
				convexSrcDir,
				convexBackendDestDir,
				context,
			);
		} else {
		}

		const serverAppDir = path.join(projectDir, "apps/server");
		if (await fs.pathExists(serverAppDir)) {
			await fs.remove(serverAppDir);
		}
		return;
	}

	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const serverBaseDir = path.join(
		PKG_ROOT,
		"templates/backend/server/server-base",
	);
	if (await fs.pathExists(serverBaseDir)) {
		await processAndCopyFiles("**/*", serverBaseDir, serverAppDir, context);
	} else {
	}

	const frameworkSrcDir = path.join(
		PKG_ROOT,
		`templates/backend/server/${context.backend}`,
	);
	if (await fs.pathExists(frameworkSrcDir)) {
		await processAndCopyFiles(
			"**/*",
			frameworkSrcDir,
			serverAppDir,
			context,
			true,
		);
	} else {
	}

	if (context.api !== "none") {
		const apiServerBaseDir = path.join(
			PKG_ROOT,
			`templates/api/${context.api}/server/base`,
		);
		if (await fs.pathExists(apiServerBaseDir)) {
			await processAndCopyFiles(
				"**/*",
				apiServerBaseDir,
				serverAppDir,
				context,
				true,
			);
		} else {
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
				true,
			);
		} else {
		}
	}
}

export async function setupDbOrmTemplates(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (
		context.backend === "convex" ||
		context.orm === "none" ||
		context.database === "none"
	)
		return;

	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const dbOrmSrcDir = path.join(
		PKG_ROOT,
		`templates/db/${context.orm}/${context.database}`,
	);

	if (await fs.pathExists(dbOrmSrcDir)) {
		await processAndCopyFiles("**/*", dbOrmSrcDir, serverAppDir, context);
	} else {
	}
}

export async function setupAuthTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (context.backend === "convex" || !context.auth) return;

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
		} else {
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
			} else {
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
			} else if (orm === "mongoose") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/server/db/mongoose/${db}`,
				)
			}
			if (authDbSrc && (await fs.pathExists(authDbSrc))) {
				await processAndCopyFiles("**/*", authDbSrc, serverAppDir, context);
			} else if (authDbSrc) {
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
			} else {
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
				} else {
				}
			}
		} else if (hasNuxtWeb) {
			const authWebNuxtSrc = path.join(PKG_ROOT, "templates/auth/web/nuxt");
			if (await fs.pathExists(authWebNuxtSrc)) {
				await processAndCopyFiles("**/*", authWebNuxtSrc, webAppDir, context);
			} else {
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
				} else {
				}
			}
		}
	}

	if (hasNative && nativeAppDirExists) {
		const authNativeSrc = path.join(PKG_ROOT, "templates/auth/native");
		if (await fs.pathExists(authNativeSrc)) {
			await processAndCopyFiles("**/*", authNativeSrc, nativeAppDir, context);
		} else {
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
		if (
			!context.examples ||
			context.examples.length === 0 ||
			context.examples[0] === "none"
		)
			continue;

		if (example === "none") continue;

		const exampleBaseDir = path.join(PKG_ROOT, `templates/examples/${example}`);

		if (serverAppDirExists) {
			const exampleServerSrc = path.join(exampleBaseDir, "server");
			if (await fs.pathExists(exampleServerSrc)) {
				if (context.backend !== "convex") {
					if (context.orm !== "none" && context.database !== "none") {
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
					const generalServerFiles = await globby(["*.ts", "*.hbs"], {
						cwd: exampleServerSrc,
						onlyFiles: true,
						deep: 1,
						ignore: [`${context.orm}/**`],
					});
					for (const file of generalServerFiles) {
						const srcPath = path.join(exampleServerSrc, file);
						const destPath = path.join(serverAppDir, file.replace(".hbs", ""));
						if (srcPath.endsWith(".hbs")) {
							await processTemplate(srcPath, destPath, context);
						} else {
							await fs.copy(srcPath, destPath, { overwrite: false });
						}
					}
				}
			}
		}

		if (webAppDirExists) {
			if (hasReactWeb) {
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
						} else {
						}
					}
				}
			} else if (hasNuxtWeb) {
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
			} else if (hasSvelteWeb) {
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

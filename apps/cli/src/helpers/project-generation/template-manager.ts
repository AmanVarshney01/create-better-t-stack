import path from "node:path";
import fs from "fs-extra";
import { globby } from "globby";
import { PKG_ROOT } from "../../constants";
import type { ProjectConfig } from "../../types";
import { processTemplate } from "../../utils/template-processor";
import { addPackageDependency } from "../../utils/add-package-deps";

async function processAndCopyFiles(
	sourcePattern: string | string[],
	baseSourceDir: string,
	destDir: string,
	context: ProjectConfig,
	overwrite = true,
) {
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
		} catch (_error) {}
	}
}

export async function copyBaseTemplate(
	projectDir: string,
	context: ProjectConfig,
) {
	const templateDir = path.join(PKG_ROOT, "templates/base");
	await processAndCopyFiles(["**/*"], templateDir, projectDir, context);
}

export async function setupFrontendTemplates(
	projectDir: string,
	context: ProjectConfig,
) {
	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = context.frontend.includes("nuxt");
	const hasSvelteWeb = context.frontend.includes("svelte");
	const hasSolidWeb = context.frontend.includes("solid");
	const hasNativeWind = context.frontend.includes("native-nativewind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const _hasNative = hasNativeWind || hasUnistyles;
	const isConvex = context.backend === "convex";

	if (hasReactWeb || hasNuxtWeb || hasSvelteWeb || hasSolidWeb) {
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

			if (!isConvex && context.api === "orpc") {
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
		} else if (hasSolidWeb) {
			const solidBaseDir = path.join(PKG_ROOT, "templates/frontend/solid");
			if (await fs.pathExists(solidBaseDir)) {
				await processAndCopyFiles("**/*", solidBaseDir, webAppDir, context);
			} else {
			}

			if (!isConvex && context.api === "orpc") {
				const apiWebSolidDir = path.join(
					PKG_ROOT,
					`templates/api/${context.api}/web/solid`,
				);
				if (await fs.pathExists(apiWebSolidDir)) {
					await processAndCopyFiles("**/*", apiWebSolidDir, webAppDir, context);
				} else {
				}
			}
		}
	}

	if (hasNativeWind || hasUnistyles) {
		const nativeAppDir = path.join(projectDir, "apps/native");
		await fs.ensureDir(nativeAppDir);

		const nativeBaseCommonDir = path.join(
			PKG_ROOT,
			"templates/frontend/native/native-base",
		);
		if (await fs.pathExists(nativeBaseCommonDir)) {
			await processAndCopyFiles(
				"**/*",
				nativeBaseCommonDir,
				nativeAppDir,
				context,
			);
		} else {
		}

		let nativeFrameworkPath = "";
		if (hasNativeWind) {
			nativeFrameworkPath = "nativewind";
		} else if (hasUnistyles) {
			nativeFrameworkPath = "unistyles";
		}

		const nativeSpecificDir = path.join(
			PKG_ROOT,
			`templates/frontend/native/${nativeFrameworkPath}`,
		);
		if (await fs.pathExists(nativeSpecificDir)) {
			await processAndCopyFiles(
				"**/*",
				nativeSpecificDir,
				nativeAppDir,
				context,
				true,
			);
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
			}
		}
	}
}

export async function setupBackendFramework(
	projectDir: string,
	context: ProjectConfig,
) {
	if (context.backend === "none") {
		return;
	}

	const serverAppDir = path.join(projectDir, "apps/server");

	if (context.backend === "convex") {
		if (await fs.pathExists(serverAppDir)) {
			await fs.remove(serverAppDir);
		}

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
		}
		return;
	}

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
) {
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

async function setupConvexAuthTemplate(
	projectDir: string,
	context: ProjectConfig,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	const nativeAppDir = path.join(projectDir, "apps/native");

	const webAppDirExists = await fs.pathExists(webAppDir);
	const nativeAppDirExists = await fs.pathExists(nativeAppDir);

	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNativeWind = context.frontend.includes("native-nativewind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const hasNative = hasNativeWind || hasUnistyles;

	// Setup React web authentication templates
	if (webAppDirExists && hasReactWeb) {
		const convexAuthReactSrc = path.join(PKG_ROOT, "templates/auth/convex/react");
		if (await fs.pathExists(convexAuthReactSrc)) {
			await processAndCopyFiles(
				"**/*",
				convexAuthReactSrc,
				webAppDir,
				context,
			);
		}

		// Add Convex Auth dependencies to web app
		await addPackageDependency({
			dependencies: ["@convex-dev/auth"],
			projectDir: webAppDir,
		});
	}

	// Setup native authentication templates (if needed in the future)
	if (nativeAppDirExists && hasNative) {
		// TODO: Add Convex native auth templates when available
	}
}

export async function setupAuthTemplate(
	projectDir: string,
	context: ProjectConfig,
) {
	if (!context.auth) return;

	// Handle Convex authentication separately
	if (context.backend === "convex") {
		await setupConvexAuthTemplate(projectDir, context);
		return;
	}

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
	const hasSolidWeb = context.frontend.includes("solid");
	const hasNativeWind = context.frontend.includes("native-nativewind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const hasNative = hasNativeWind || hasUnistyles;

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
				);
			}
			if (authDbSrc && (await fs.pathExists(authDbSrc))) {
				await processAndCopyFiles("**/*", authDbSrc, serverAppDir, context);
			} else if (authDbSrc) {
			}
		}
	}

	if (
		(hasReactWeb || hasNuxtWeb || hasSvelteWeb || hasSolidWeb) &&
		webAppDirExists
	) {
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
			const authWebSvelteSrc = path.join(PKG_ROOT, "templates/auth/web/svelte");
			if (await fs.pathExists(authWebSvelteSrc)) {
				await processAndCopyFiles("**/*", authWebSvelteSrc, webAppDir, context);
			} else {
			}
		} else if (hasSolidWeb) {
			const authWebSolidSrc = path.join(PKG_ROOT, "templates/auth/web/solid");
			if (await fs.pathExists(authWebSolidSrc)) {
				await processAndCopyFiles("**/*", authWebSolidSrc, webAppDir, context);
			} else {
			}
		}
	}

	if (hasNative && nativeAppDirExists) {
		const authNativeBaseSrc = path.join(
			PKG_ROOT,
			"templates/auth/native/native-base",
		);
		if (await fs.pathExists(authNativeBaseSrc)) {
			await processAndCopyFiles(
				"**/*",
				authNativeBaseSrc,
				nativeAppDir,
				context,
			);
		}

		let nativeFrameworkAuthPath = "";
		if (hasNativeWind) {
			nativeFrameworkAuthPath = "nativewind";
		} else if (hasUnistyles) {
			nativeFrameworkAuthPath = "unistyles";
		}

		if (nativeFrameworkAuthPath) {
			const authNativeFrameworkSrc = path.join(
				PKG_ROOT,
				`templates/auth/native/${nativeFrameworkAuthPath}`,
			);
			if (await fs.pathExists(authNativeFrameworkSrc)) {
				await processAndCopyFiles(
					"**/*",
					authNativeFrameworkSrc,
					nativeAppDir,
					context,
				);
			}
		}
	}
}

export async function setupAddonsTemplate(
	projectDir: string,
	context: ProjectConfig,
) {
	if (!context.addons || context.addons.length === 0) return;

	for (const addon of context.addons) {
		if (addon === "none") continue;

		let addonSrcDir = path.join(PKG_ROOT, `templates/addons/${addon}`);
		let addonDestDir = projectDir;

		if (addon === "pwa") {
			const webAppDir = path.join(projectDir, "apps/web");
			if (!(await fs.pathExists(webAppDir))) {
				continue;
			}
			addonDestDir = webAppDir;
			if (context.frontend.includes("next")) {
				addonSrcDir = path.join(PKG_ROOT, "templates/addons/pwa/apps/web/next");
			} else if (
				context.frontend.some((f) =>
					["tanstack-router", "react-router", "solid"].includes(f),
				)
			) {
				addonSrcDir = path.join(PKG_ROOT, "templates/addons/pwa/apps/web/vite");
			} else {
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
) {
	if (
		!context.examples ||
		context.examples.length === 0 ||
		context.examples[0] === "none"
	) {
		return;
	}

	const serverAppDir = path.join(projectDir, "apps/server");
	const webAppDir = path.join(projectDir, "apps/web");

	const serverAppDirExists = await fs.pathExists(serverAppDir);
	const webAppDirExists = await fs.pathExists(webAppDir);
	const nativeAppDir = path.join(projectDir, "apps/native");
	const nativeAppDirExists = await fs.pathExists(nativeAppDir);

	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = context.frontend.includes("nuxt");
	const hasSvelteWeb = context.frontend.includes("svelte");
	const hasSolidWeb = context.frontend.includes("solid");

	for (const example of context.examples) {
		if (example === "none") continue;

		const exampleBaseDir = path.join(PKG_ROOT, `templates/examples/${example}`);

		if (
			serverAppDirExists &&
			context.backend !== "convex" &&
			context.backend !== "none"
		) {
			const exampleServerSrc = path.join(exampleBaseDir, "server");

			if (example === "ai" && context.backend === "next") {
				const aiNextServerSrc = path.join(exampleServerSrc, "next");
				if (await fs.pathExists(aiNextServerSrc)) {
					await processAndCopyFiles(
						"**/*",
						aiNextServerSrc,
						serverAppDir,
						context,
						false,
					);
				}
			}

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

			const ignorePatterns = [`${context.orm}/**`];
			if (example === "ai" && context.backend === "next") {
				ignorePatterns.push("next/**");
			}

			const generalServerFiles = await globby(["**/*.ts", "**/*.hbs"], {
				cwd: exampleServerSrc,
				onlyFiles: true,
				deep: 1,
				ignore: ignorePatterns,
			});

			for (const file of generalServerFiles) {
				const srcPath = path.join(exampleServerSrc, file);
				const destPath = path.join(serverAppDir, file.replace(".hbs", ""));
				try {
					if (srcPath.endsWith(".hbs")) {
						await processTemplate(srcPath, destPath, context);
					} else {
						if (!(await fs.pathExists(destPath))) {
							await fs.copy(srcPath, destPath, { overwrite: false });
						}
					}
				} catch (_error) {}
			}
		}

		// Handle Convex examples
		if (context.backend === "convex") {
			const convexBackendDir = path.join(projectDir, "packages/backend/convex");
			const convexExampleSrc = path.join(exampleBaseDir, "convex/backend");

			if (await fs.pathExists(convexExampleSrc) && await fs.pathExists(convexBackendDir)) {
				await processAndCopyFiles(
					"**/*",
					convexExampleSrc,
					convexBackendDir,
					context,
					false,
				);
			}
		}

		if (webAppDirExists) {
			// Handle Convex-specific frontend examples
			if (context.backend === "convex" && hasReactWeb) {
				const convexExampleWebSrc = path.join(exampleBaseDir, "convex");
				if (await fs.pathExists(convexExampleWebSrc)) {
					await processAndCopyFiles(
						"**/*",
						convexExampleWebSrc,
						webAppDir,
						context,
						false,
					);
				}
			}
			// Handle regular frontend examples for non-Convex backends
			else if (hasReactWeb) {
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
			} else if (hasSolidWeb) {
				const exampleWebSolidSrc = path.join(exampleBaseDir, "web/solid");
				if (await fs.pathExists(exampleWebSolidSrc)) {
					await processAndCopyFiles(
						"**/*",
						exampleWebSolidSrc,
						webAppDir,
						context,
						false,
					);
				} else {
				}
			}
		}

		if (nativeAppDirExists) {
			const hasNativeWind = context.frontend.includes("native-nativewind");
			const hasUnistyles = context.frontend.includes("native-unistyles");

			if (hasNativeWind || hasUnistyles) {
				let nativeFramework = "";
				if (hasNativeWind) {
					nativeFramework = "nativewind";
				} else if (hasUnistyles) {
					nativeFramework = "unistyles";
				}

				const exampleNativeSrc = path.join(
					exampleBaseDir,
					`native/${nativeFramework}`,
				);
				if (await fs.pathExists(exampleNativeSrc)) {
					await processAndCopyFiles(
						"**/*",
						exampleNativeSrc,
						nativeAppDir,
						context,
						false,
					);
				}
			}
		}
	}
}

export async function handleExtras(projectDir: string, context: ProjectConfig) {
	const extrasDir = path.join(PKG_ROOT, "templates/extras");
	const hasNativeWind = context.frontend.includes("native-nativewind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const hasNative = hasNativeWind || hasUnistyles;

	if (context.packageManager === "pnpm") {
		const pnpmWorkspaceSrc = path.join(extrasDir, "pnpm-workspace.yaml");
		const pnpmWorkspaceDest = path.join(projectDir, "pnpm-workspace.yaml");
		if (await fs.pathExists(pnpmWorkspaceSrc)) {
			await fs.copy(pnpmWorkspaceSrc, pnpmWorkspaceDest);
		}
	}

	if (context.packageManager === "bun") {
		const bunfigSrc = path.join(extrasDir, "bunfig.toml.hbs");
		const bunfigDest = path.join(projectDir, "bunfig.toml");
		if (await fs.pathExists(bunfigSrc)) {
			await processTemplate(bunfigSrc, bunfigDest, context);
		}
	}

	if (
		context.packageManager === "pnpm" &&
		(hasNative || context.frontend.includes("nuxt"))
	) {
		const npmrcTemplateSrc = path.join(extrasDir, "_npmrc.hbs");
		const npmrcDest = path.join(projectDir, ".npmrc");
		if (await fs.pathExists(npmrcTemplateSrc)) {
			await processTemplate(npmrcTemplateSrc, npmrcDest, context);
		}
	}

	if (context.runtime === "workers") {
		const runtimeWorkersDir = path.join(PKG_ROOT, "templates/runtime/workers");
		if (await fs.pathExists(runtimeWorkersDir)) {
			await processAndCopyFiles(
				"**/*",
				runtimeWorkersDir,
				projectDir,
				context,
				false,
			);
		}
	}
}

export async function setupDockerComposeTemplates(
	projectDir: string,
	context: ProjectConfig,
) {
	if (context.dbSetup !== "docker" || context.database === "none") {
		return;
	}

	const serverAppDir = path.join(projectDir, "apps/server");
	const dockerSrcDir = path.join(
		PKG_ROOT,
		`templates/db-setup/docker-compose/${context.database}`,
	);

	if (await fs.pathExists(dockerSrcDir)) {
		await processAndCopyFiles("**/*", dockerSrcDir, serverAppDir, context);
	} else {
	}
}

export async function setupDeploymentTemplates(
	projectDir: string,
	context: ProjectConfig,
) {
	if (context.webDeploy === "none") {
		return;
	}

	if (context.webDeploy === "workers") {
		const webAppDir = path.join(projectDir, "apps/web");
		if (!(await fs.pathExists(webAppDir))) {
			return;
		}

		const frontends = context.frontend;

		const templateMap: Record<string, string> = {
			"tanstack-router": "react/tanstack-router",
			"tanstack-start": "react/tanstack-start",
			"react-router": "react/react-router",
			solid: "solid",
			next: "react/next",
			nuxt: "nuxt",
			svelte: "svelte",
		};

		for (const f of frontends) {
			if (templateMap[f]) {
				const deployTemplateSrc = path.join(
					PKG_ROOT,
					`templates/deploy/web/${templateMap[f]}`,
				);
				if (await fs.pathExists(deployTemplateSrc)) {
					await processAndCopyFiles(
						"**/*",
						deployTemplateSrc,
						webAppDir,
						context,
					);
				}
			}
		}
	}
}

import path from "node:path";
import fs from "fs-extra";
import { glob } from "tinyglobby";
import { PKG_ROOT } from "../../constants";
import type { ProjectConfig } from "../../types";
import { processTemplate } from "../../utils/template-processor";

export async function processAndCopyFiles(
	sourcePattern: string | string[],
	baseSourceDir: string,
	destDir: string,
	context: ProjectConfig,
	overwrite = true,
	ignorePatterns?: string[],
) {
	const sourceFiles = await glob(sourcePattern, {
		cwd: baseSourceDir,
		dot: true,
		onlyFiles: true,
		absolute: false,
		ignore: ignorePatterns,
	});

	for (const relativeSrcPath of sourceFiles) {
		const srcPath = path.join(baseSourceDir, relativeSrcPath);
		let relativeDestPath = relativeSrcPath;

		if (relativeSrcPath.endsWith(".hbs")) {
			relativeDestPath = relativeSrcPath.slice(0, -4);
		}

		const basename = path.basename(relativeDestPath);
		if (basename === "_gitignore") {
			relativeDestPath = path.join(
				path.dirname(relativeDestPath),
				".gitignore",
			);
		} else if (basename === "_npmrc") {
			relativeDestPath = path.join(path.dirname(relativeDestPath), ".npmrc");
		}

		const destPath = path.join(destDir, relativeDestPath);

		await fs.ensureDir(path.dirname(destPath));

		if (!overwrite && (await fs.pathExists(destPath))) {
			continue;
		}

		await processTemplate(srcPath, destPath, context);
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
	const hasNativeBare = context.frontend.includes("native-bare");
	const hasNativeUniwind = context.frontend.includes("native-uniwind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const _hasNative = hasNativeBare || hasNativeUniwind || hasUnistyles;
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

				if (
					context.backend === "self" &&
					(reactFramework === "next" || reactFramework === "tanstack-start") &&
					context.api !== "none"
				) {
					const apiFullstackDir = path.join(
						PKG_ROOT,
						`templates/api/${context.api}/fullstack/${reactFramework}`,
					);
					if (await fs.pathExists(apiFullstackDir)) {
						await processAndCopyFiles(
							"**/*",
							apiFullstackDir,
							webAppDir,
							context,
						);
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

	if (hasNativeBare || hasNativeUniwind || hasUnistyles) {
		const nativeAppDir = path.join(projectDir, "apps/native");
		await fs.ensureDir(nativeAppDir);

		const nativeBaseCommonDir = path.join(
			PKG_ROOT,
			"templates/frontend/native/base",
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
		if (hasNativeBare) {
			nativeFrameworkPath = "bare";
		} else if (hasNativeUniwind) {
			nativeFrameworkPath = "uniwind";
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

async function setupApiPackage(projectDir: string, context: ProjectConfig) {
	if (context.api === "none") return;

	const apiPackageDir = path.join(projectDir, "packages/api");
	await fs.ensureDir(apiPackageDir);

	const apiServerDir = path.join(
		PKG_ROOT,
		`templates/api/${context.api}/server`,
	);
	if (await fs.pathExists(apiServerDir)) {
		await processAndCopyFiles("**/*", apiServerDir, apiPackageDir, context);
	}
}

async function setupConfigPackage(projectDir: string, context: ProjectConfig) {
	const configPackageDir = path.join(projectDir, "packages/config");
	await fs.ensureDir(configPackageDir);

	const configBaseDir = path.join(PKG_ROOT, "templates/packages/config");
	if (await fs.pathExists(configBaseDir)) {
		await processAndCopyFiles("**/*", configBaseDir, configPackageDir, context);
	}
}

async function setupDbPackage(projectDir: string, context: ProjectConfig) {
	if (context.database === "none" || context.orm === "none") return;

	const dbPackageDir = path.join(projectDir, "packages/db");
	await fs.ensureDir(dbPackageDir);

	const dbBaseDir = path.join(PKG_ROOT, "templates/db/base");
	if (await fs.pathExists(dbBaseDir)) {
		await processAndCopyFiles("**/*", dbBaseDir, dbPackageDir, context);
	}

	const dbOrmSrcDir = path.join(
		PKG_ROOT,
		`templates/db/${context.orm}/${context.database}`,
	);
	if (await fs.pathExists(dbOrmSrcDir)) {
		await processAndCopyFiles("**/*", dbOrmSrcDir, dbPackageDir, context);
	}
}

async function setupConvexBackend(projectDir: string, context: ProjectConfig) {
	const serverAppDir = path.join(projectDir, "apps/server");
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
}

async function setupServerApp(projectDir: string, context: ProjectConfig) {
	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const serverBaseDir = path.join(PKG_ROOT, "templates/backend/server/base");
	if (await fs.pathExists(serverBaseDir)) {
		await processAndCopyFiles("**/*", serverBaseDir, serverAppDir, context);
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
	}
}

export async function setupBackendFramework(
	projectDir: string,
	context: ProjectConfig,
) {
	await setupConfigPackage(projectDir, context);

	if (context.backend === "none") {
		return;
	}

	if (context.backend === "convex") {
		await setupConvexBackend(projectDir, context);
		return;
	}

	if (context.backend === "self") {
		await setupApiPackage(projectDir, context);
		await setupDbPackage(projectDir, context);
		return;
	}

	await setupServerApp(projectDir, context);
	await setupApiPackage(projectDir, context);
	await setupDbPackage(projectDir, context);
}

export async function setupAuthTemplate(
	projectDir: string,
	context: ProjectConfig,
) {
	if (!context.auth || context.auth === "none") return;

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
	const hasNativeBare = context.frontend.includes("native-bare");
	const hasUniwind = context.frontend.includes("native-uniwind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

	const authProvider = context.auth;

	if (context.backend === "convex" && authProvider === "clerk") {
		const convexBackendDestDir = path.join(projectDir, "packages/backend");
		const convexClerkBackendSrc = path.join(
			PKG_ROOT,
			"templates/auth/clerk/convex/backend",
		);
		if (await fs.pathExists(convexClerkBackendSrc)) {
			await fs.ensureDir(convexBackendDestDir);
			await processAndCopyFiles(
				"**/*",
				convexClerkBackendSrc,
				convexBackendDestDir,
				context,
			);
		}

		if (webAppDirExists) {
			const reactFramework = context.frontend.find((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			);
			if (reactFramework) {
				const convexClerkWebSrc = path.join(
					PKG_ROOT,
					`templates/auth/clerk/convex/web/react/${reactFramework}`,
				);
				if (await fs.pathExists(convexClerkWebSrc)) {
					await processAndCopyFiles(
						"**/*",
						convexClerkWebSrc,
						webAppDir,
						context,
					);
				}
			}
		}

		if (nativeAppDirExists) {
			const convexClerkNativeBaseSrc = path.join(
				PKG_ROOT,
				"templates/auth/clerk/convex/native/base",
			);
			if (await fs.pathExists(convexClerkNativeBaseSrc)) {
				await processAndCopyFiles(
					"**/*",
					convexClerkNativeBaseSrc,
					nativeAppDir,
					context,
				);
			}

			let nativeFrameworkPath = "";
			if (hasNativeBare) nativeFrameworkPath = "bare";
			else if (hasUniwind) nativeFrameworkPath = "uniwind";
			else if (hasUnistyles) nativeFrameworkPath = "unistyles";
			if (nativeFrameworkPath) {
				const convexClerkNativeFrameworkSrc = path.join(
					PKG_ROOT,
					`templates/auth/clerk/convex/native/${nativeFrameworkPath}`,
				);
				if (await fs.pathExists(convexClerkNativeFrameworkSrc)) {
					await processAndCopyFiles(
						"**/*",
						convexClerkNativeFrameworkSrc,
						nativeAppDir,
						context,
					);
				}
			}
		}
		return;
	}

	if (context.backend === "convex" && authProvider === "better-auth") {
		const convexBackendDestDir = path.join(projectDir, "packages/backend");
		const convexBetterAuthBackendSrc = path.join(
			PKG_ROOT,
			"templates/auth/better-auth/convex/backend",
		);
		if (await fs.pathExists(convexBetterAuthBackendSrc)) {
			await fs.ensureDir(convexBackendDestDir);
			await processAndCopyFiles(
				"**/*",
				convexBetterAuthBackendSrc,
				convexBackendDestDir,
				context,
			);
		}

		if (webAppDirExists && hasReactWeb) {
			const convexBetterAuthWebBaseSrc = path.join(
				PKG_ROOT,
				"templates/auth/better-auth/convex/web/react/base",
			);
			if (await fs.pathExists(convexBetterAuthWebBaseSrc)) {
				await processAndCopyFiles(
					"**/*",
					convexBetterAuthWebBaseSrc,
					webAppDir,
					context,
				);
			}

			const reactFramework = context.frontend.find((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			);
			if (reactFramework) {
				const convexBetterAuthWebSrc = path.join(
					PKG_ROOT,
					`templates/auth/better-auth/convex/web/react/${reactFramework}`,
				);
				if (await fs.pathExists(convexBetterAuthWebSrc)) {
					await processAndCopyFiles(
						"**/*",
						convexBetterAuthWebSrc,
						webAppDir,
						context,
					);
				}
			}
		}

		if (nativeAppDirExists) {
			const convexBetterAuthNativeBaseSrc = path.join(
				PKG_ROOT,
				"templates/auth/better-auth/convex/native/base",
			);
			if (await fs.pathExists(convexBetterAuthNativeBaseSrc)) {
				await processAndCopyFiles(
					"**/*",
					convexBetterAuthNativeBaseSrc,
					nativeAppDir,
					context,
				);
			}

			let nativeFrameworkPath = "";
			if (hasNativeBare) nativeFrameworkPath = "bare";
			else if (hasUniwind) nativeFrameworkPath = "uniwind";
			else if (hasUnistyles) nativeFrameworkPath = "unistyles";
			if (nativeFrameworkPath) {
				const convexBetterAuthNativeFrameworkSrc = path.join(
					PKG_ROOT,
					`templates/auth/better-auth/convex/native/${nativeFrameworkPath}`,
				);
				if (await fs.pathExists(convexBetterAuthNativeFrameworkSrc)) {
					await processAndCopyFiles(
						"**/*",
						convexBetterAuthNativeFrameworkSrc,
						nativeAppDir,
						context,
					);
				}
			}
		}
		return;
	}

	if (
		(serverAppDirExists || context.backend === "self") &&
		context.backend !== "convex"
	) {
		const authPackageDir = path.join(projectDir, "packages/auth");
		await fs.ensureDir(authPackageDir);

		const authServerBaseSrc = path.join(
			PKG_ROOT,
			`templates/auth/${authProvider}/server/base`,
		);
		if (await fs.pathExists(authServerBaseSrc)) {
			await processAndCopyFiles(
				"**/*",
				authServerBaseSrc,
				authPackageDir,
				context,
			);
		}

		if (context.orm !== "none" && context.database !== "none") {
			const dbPackageDir = path.join(projectDir, "packages/db");
			await fs.ensureDir(dbPackageDir);

			const orm = context.orm;
			const db = context.database;
			let authDbSrc = "";
			if (orm === "drizzle") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/${authProvider}/server/db/drizzle/${db}`,
				);
			} else if (orm === "prisma") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/${authProvider}/server/db/prisma/${db}`,
				);
			} else if (orm === "mongoose") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/${authProvider}/server/db/mongoose/${db}`,
				);
			}
			if (authDbSrc && (await fs.pathExists(authDbSrc))) {
				await processAndCopyFiles("**/*", authDbSrc, dbPackageDir, context);
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
				`templates/auth/${authProvider}/web/react/base`,
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
					`templates/auth/${authProvider}/web/react/${reactFramework}`,
				);
				if (await fs.pathExists(authWebFrameworkSrc)) {
					await processAndCopyFiles(
						"**/*",
						authWebFrameworkSrc,
						webAppDir,
						context,
					);
				}

				if (
					context.backend === "self" &&
					(reactFramework === "next" || reactFramework === "tanstack-start")
				) {
					const authFullstackSrc = path.join(
						PKG_ROOT,
						`templates/auth/${authProvider}/fullstack/${reactFramework}`,
					);
					if (await fs.pathExists(authFullstackSrc)) {
						await processAndCopyFiles(
							"**/*",
							authFullstackSrc,
							webAppDir,
							context,
						);
					}
				}
			}
		} else if (hasNuxtWeb) {
			const authWebNuxtSrc = path.join(
				PKG_ROOT,
				`templates/auth/${authProvider}/web/nuxt`,
			);
			if (await fs.pathExists(authWebNuxtSrc)) {
				await processAndCopyFiles("**/*", authWebNuxtSrc, webAppDir, context);
			}
		} else if (hasSvelteWeb) {
			const authWebSvelteSrc = path.join(
				PKG_ROOT,
				`templates/auth/${authProvider}/web/svelte`,
			);
			if (await fs.pathExists(authWebSvelteSrc)) {
				await processAndCopyFiles("**/*", authWebSvelteSrc, webAppDir, context);
			}
		} else if (hasSolidWeb) {
			const authWebSolidSrc = path.join(
				PKG_ROOT,
				`templates/auth/${authProvider}/web/solid`,
			);
			if (await fs.pathExists(authWebSolidSrc)) {
				await processAndCopyFiles("**/*", authWebSolidSrc, webAppDir, context);
			}
		}
	}

	if (hasNative && nativeAppDirExists) {
		const authNativeBaseSrc = path.join(
			PKG_ROOT,
			`templates/auth/${authProvider}/native/base`,
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
		if (hasNativeBare) {
			nativeFrameworkAuthPath = "bare";
		} else if (hasUniwind) {
			nativeFrameworkAuthPath = "uniwind";
		} else if (hasUnistyles) {
			nativeFrameworkAuthPath = "unistyles";
		}

		if (nativeFrameworkAuthPath) {
			const authNativeFrameworkSrc = path.join(
				PKG_ROOT,
				`templates/auth/${authProvider}/native/${nativeFrameworkAuthPath}`,
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

export async function setupPaymentsTemplate(
	projectDir: string,
	context: ProjectConfig,
) {
	if (!context.payments || context.payments === "none") return;

	const serverAppDir = path.join(projectDir, "apps/server");
	const webAppDir = path.join(projectDir, "apps/web");

	const serverAppDirExists = await fs.pathExists(serverAppDir);
	const webAppDirExists = await fs.pathExists(webAppDir);

	if (
		(serverAppDirExists || context.backend === "self") &&
		context.backend !== "convex"
	) {
		const authPackageDir = path.join(projectDir, "packages/auth");
		await fs.ensureDir(authPackageDir);

		const paymentsServerSrc = path.join(
			PKG_ROOT,
			`templates/payments/${context.payments}/server/base`,
		);
		if (await fs.pathExists(paymentsServerSrc)) {
			await processAndCopyFiles(
				"**/*",
				paymentsServerSrc,
				authPackageDir,
				context,
			);
		}
	}

	const hasReactWeb = context.frontend.some((f) =>
		["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
	);
	const hasNuxtWeb = context.frontend.includes("nuxt");
	const hasSvelteWeb = context.frontend.includes("svelte");
	const hasSolidWeb = context.frontend.includes("solid");

	if (
		webAppDirExists &&
		(hasReactWeb || hasNuxtWeb || hasSvelteWeb || hasSolidWeb)
	) {
		if (hasReactWeb) {
			const reactFramework = context.frontend.find((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			);
			if (reactFramework) {
				const paymentsWebSrc = path.join(
					PKG_ROOT,
					`templates/payments/${context.payments}/web/react/${reactFramework}`,
				);
				if (await fs.pathExists(paymentsWebSrc)) {
					await processAndCopyFiles("**/*", paymentsWebSrc, webAppDir, context);
				}
			}
		} else if (hasNuxtWeb) {
			const paymentsWebNuxtSrc = path.join(
				PKG_ROOT,
				`templates/payments/${context.payments}/web/nuxt`,
			);
			if (await fs.pathExists(paymentsWebNuxtSrc)) {
				await processAndCopyFiles(
					"**/*",
					paymentsWebNuxtSrc,
					webAppDir,
					context,
				);
			}
		} else if (hasSvelteWeb) {
			const paymentsWebSvelteSrc = path.join(
				PKG_ROOT,
				`templates/payments/${context.payments}/web/svelte`,
			);
			if (await fs.pathExists(paymentsWebSvelteSrc)) {
				await processAndCopyFiles(
					"**/*",
					paymentsWebSvelteSrc,
					webAppDir,
					context,
				);
			}
		} else if (hasSolidWeb) {
			const paymentsWebSolidSrc = path.join(
				PKG_ROOT,
				`templates/payments/${context.payments}/web/solid`,
			);
			if (await fs.pathExists(paymentsWebSolidSrc)) {
				await processAndCopyFiles(
					"**/*",
					paymentsWebSolidSrc,
					webAppDir,
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
			(serverAppDirExists || context.backend === "self") &&
			context.backend !== "convex" &&
			context.backend !== "none"
		) {
			const exampleServerSrc = path.join(exampleBaseDir, "server");

			if (context.api !== "none") {
				const apiPackageDir = path.join(projectDir, "packages/api");
				await fs.ensureDir(apiPackageDir);

				const exampleOrmBaseSrc = path.join(
					exampleServerSrc,
					context.orm,
					"base",
				);
				if (await fs.pathExists(exampleOrmBaseSrc)) {
					await processAndCopyFiles(
						"**/*",
						exampleOrmBaseSrc,
						apiPackageDir,
						context,
						false,
					);
				}
			}

			if (context.orm !== "none" && context.database !== "none") {
				const dbPackageDir = path.join(projectDir, "packages/db");
				await fs.ensureDir(dbPackageDir);

				const exampleDbSchemaSrc = path.join(
					exampleServerSrc,
					context.orm,
					context.database,
				);
				if (await fs.pathExists(exampleDbSchemaSrc)) {
					await processAndCopyFiles(
						"**/*",
						exampleDbSchemaSrc,
						dbPackageDir,
						context,
						false,
					);
				}
			}
		}

		if (webAppDirExists) {
			if (hasReactWeb) {
				const exampleWebSrc = path.join(exampleBaseDir, "web/react");
				if (await fs.pathExists(exampleWebSrc)) {
					if (example === "ai") {
						const exampleWebBaseSrc = path.join(exampleWebSrc, "base");
						if (await fs.pathExists(exampleWebBaseSrc)) {
							await processAndCopyFiles(
								"**/*",
								exampleWebBaseSrc,
								webAppDir,
								context,
								false,
							);
						}
					}

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

						if (
							context.backend === "self" &&
							(reactFramework === "next" || reactFramework === "tanstack-start")
						) {
							const exampleFullstackSrc = path.join(
								exampleBaseDir,
								`fullstack/${reactFramework}`,
							);
							if (await fs.pathExists(exampleFullstackSrc)) {
								await processAndCopyFiles(
									"**/*",
									exampleFullstackSrc,
									webAppDir,
									context,
									false,
								);
							}
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
			const hasNativeBare = context.frontend.includes("native-bare");
			const hasUniwind = context.frontend.includes("native-uniwind");
			const hasUnistyles = context.frontend.includes("native-unistyles");

			if (hasNativeBare || hasUniwind || hasUnistyles) {
				let nativeFramework = "";
				if (hasNativeBare) {
					nativeFramework = "bare";
				} else if (hasUniwind) {
					nativeFramework = "uniwind";
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
	const hasNativeBare = context.frontend.includes("native-bare");
	const hasUniwind = context.frontend.includes("native-uniwind");
	const hasUnistyles = context.frontend.includes("native-unistyles");
	const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

	if (context.packageManager === "pnpm") {
		const pnpmWorkspaceSrc = path.join(extrasDir, "pnpm-workspace.yaml");
		const pnpmWorkspaceDest = path.join(projectDir, "pnpm-workspace.yaml");
		if (await fs.pathExists(pnpmWorkspaceSrc)) {
			await processTemplate(pnpmWorkspaceSrc, pnpmWorkspaceDest, context);
		}
	}

	if (context.packageManager === "bun") {
		const bunfigSrc = path.join(extrasDir, "bunfig.toml.hbs");
		if (await fs.pathExists(bunfigSrc)) {
			await processAndCopyFiles(
				"bunfig.toml.hbs",
				extrasDir,
				projectDir,
				context,
			);
		}
	}

	if (
		context.packageManager === "pnpm" &&
		(hasNative || context.frontend.includes("nuxt"))
	) {
		const npmrcTemplateSrc = path.join(extrasDir, "_npmrc.hbs");
		if (await fs.pathExists(npmrcTemplateSrc)) {
			await processAndCopyFiles("_npmrc.hbs", extrasDir, projectDir, context);
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

	const dbPackageDir = path.join(projectDir, "packages/db");
	const dockerSrcDir = path.join(
		PKG_ROOT,
		`templates/db-setup/docker-compose/${context.database}`,
	);

	if (await fs.pathExists(dockerSrcDir)) {
		await processAndCopyFiles("**/*", dockerSrcDir, dbPackageDir, context);
	}
}

export async function setupDeploymentTemplates(
	projectDir: string,
	context: ProjectConfig,
) {
	const isBackendSelf = context.backend === "self";

	if (context.webDeploy === "alchemy" || context.serverDeploy === "alchemy") {
		const alchemyTemplateSrc = path.join(PKG_ROOT, "templates/deploy/alchemy");

		if (
			context.webDeploy === "alchemy" &&
			(context.serverDeploy === "alchemy" || isBackendSelf)
		) {
			if (await fs.pathExists(alchemyTemplateSrc)) {
				const webAppDir = path.join(projectDir, "apps/web");
				const destDir =
					isBackendSelf && (await fs.pathExists(webAppDir))
						? webAppDir
						: projectDir;
				await processAndCopyFiles(
					"alchemy.run.ts.hbs",
					alchemyTemplateSrc,
					destDir,
					context,
				);

				if (!isBackendSelf) {
					await addEnvDtsToPackages(projectDir, context, alchemyTemplateSrc);
				}
			}
		} else {
			if (context.webDeploy === "alchemy") {
				const webAppDir = path.join(projectDir, "apps/web");
				if (
					(await fs.pathExists(alchemyTemplateSrc)) &&
					(await fs.pathExists(webAppDir))
				) {
					await processAndCopyFiles(
						"alchemy.run.ts.hbs",
						alchemyTemplateSrc,
						webAppDir,
						context,
					);

					if (!isBackendSelf) {
						await addEnvDtsToPackages(projectDir, context, alchemyTemplateSrc);
					}
				}
			}

			if (context.serverDeploy === "alchemy" && !isBackendSelf) {
				const serverAppDir = path.join(projectDir, "apps/server");
				if (
					(await fs.pathExists(alchemyTemplateSrc)) &&
					(await fs.pathExists(serverAppDir))
				) {
					await processAndCopyFiles(
						"alchemy.run.ts.hbs",
						alchemyTemplateSrc,
						serverAppDir,
						context,
					);
					await processAndCopyFiles(
						"env.d.ts.hbs",
						alchemyTemplateSrc,
						serverAppDir,
						context,
					);

					await addEnvDtsToPackages(projectDir, context, alchemyTemplateSrc);
				}
			}
		}
	}

	if (context.webDeploy !== "none" && context.webDeploy !== "alchemy") {
		const webAppDir = path.join(projectDir, "apps/web");
		if (await fs.pathExists(webAppDir)) {
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
						`templates/deploy/${context.webDeploy}/web/${templateMap[f]}`,
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

	if (
		context.serverDeploy !== "none" &&
		context.serverDeploy !== "alchemy" &&
		!isBackendSelf
	) {
		const serverAppDir = path.join(projectDir, "apps/server");
		if (await fs.pathExists(serverAppDir)) {
			const deployTemplateSrc = path.join(
				PKG_ROOT,
				`templates/deploy/${context.serverDeploy}/server`,
			);
			if (await fs.pathExists(deployTemplateSrc)) {
				await processAndCopyFiles(
					"**/*",
					deployTemplateSrc,
					serverAppDir,
					context,
				);
			}
		}
	}
}

async function addEnvDtsToPackages(
	projectDir: string,
	context: ProjectConfig,
	alchemyTemplateSrc: string,
) {
	const packages = ["packages/api", "packages/auth", "packages/db"];

	for (const packageName of packages) {
		const packageDir = path.join(projectDir, packageName);
		if (await fs.pathExists(packageDir)) {
			await processAndCopyFiles(
				"env.d.ts.hbs",
				alchemyTemplateSrc,
				packageDir,
				context,
			);
		}
	}

	const serverAppDir = path.join(projectDir, "apps/server");
	if (await fs.pathExists(serverAppDir)) {
		await processAndCopyFiles(
			"env.d.ts.hbs",
			alchemyTemplateSrc,
			serverAppDir,
			context,
		);
	}
}

import path from "node:path";
import { Biome } from "@biomejs/js-api/nodejs";
import consola from "consola";

function initializeBiome() {
	try {
		const biome = new Biome();
		const result = biome.openProject("./");
		const projectKey = result.projectKey;

		biome.applyConfiguration(projectKey, {
			formatter: {
				enabled: true,
				indentStyle: "tab",
				indentWidth: 2,
				lineWidth: 80,
			},
			linter: {
				enabled: false,
			},
			javascript: {
				formatter: {
					enabled: true,
				},
			},
			json: {
				formatter: {
					enabled: true,
				},
			},
		});

		return { biome, projectKey };
	} catch (_error) {
		return null;
	}
}

function isSupportedFile(filePath: string) {
	const ext = path.extname(filePath).toLowerCase();
	const supportedExtensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".jsonc"];
	return supportedExtensions.includes(ext);
}

function shouldSkipFile(filePath: string) {
	const basename = path.basename(filePath);
	const skipPatterns = [
		".hbs",
		"package-lock.json",
		"yarn.lock",
		"pnpm-lock.yaml",
		"bun.lock",
		".d.ts",
	];

	return skipPatterns.some((pattern) => basename.includes(pattern));
}

export function formatFileWithBiome(filePath: string, content: string) {
	if (!isSupportedFile(filePath) || shouldSkipFile(filePath)) {
		return null;
	}

	try {
		const biomeResult = initializeBiome();
		if (!biomeResult) return null;

		const { biome, projectKey } = biomeResult;

		const result = biome.formatContent(projectKey, content, {
			filePath: path.basename(filePath),
		});

		if (result.diagnostics && result.diagnostics.length > 0) {
			consola.debug(
				`Biome formatting diagnostics for ${filePath}:`,
				result.diagnostics,
			);
		}

		return result.content;
	} catch (_error) {
		return null;
	}
}

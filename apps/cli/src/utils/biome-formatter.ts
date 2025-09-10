import path from "node:path";
import { Biome } from "@biomejs/js-api/nodejs";
import consola from "consola";

let biome: Biome | null = null;
let projectKey: number | null = null;

async function initializeBiome() {
	if (biome && projectKey !== null) return { biome, projectKey };

	try {
		biome = new Biome();
		const result = biome.openProject("./");
		projectKey = result.projectKey;

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

export async function formatFileWithBiome(filePath: string, content: string) {
	if (!isSupportedFile(filePath) || shouldSkipFile(filePath)) {
		return null;
	}

	try {
		const biomeResult = await initializeBiome();
		if (!biomeResult) return null;

		const { biome: biomeInstance, projectKey: key } = biomeResult;

		const result = biomeInstance.formatContent(key, content, {
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

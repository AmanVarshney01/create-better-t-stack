import path from "node:path";
import { Biome } from "@biomejs/js-api/nodejs";
import consola from "consola";

let biome: Biome | null = null;
let projectKey: number | null = null;

async function initializeBiome(): Promise<{
	biome: Biome;
	projectKey: number;
}> {
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
	} catch (error) {
		consola.error("Failed to initialize Biome:", error);
		throw error;
	}
}

function isSupportedFile(filePath: string): boolean {
	const ext = path.extname(filePath).toLowerCase();
	const supportedExtensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".jsonc"];
	return supportedExtensions.includes(ext);
}

function shouldSkipFile(filePath: string): boolean {
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

export async function formatFileWithBiome(
	filePath: string,
	content: string,
): Promise<string | null> {
	if (!isSupportedFile(filePath) || shouldSkipFile(filePath)) {
		return null;
	}

	try {
		const { biome: biomeInstance, projectKey: key } = await initializeBiome();

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
	} catch (error) {
		consola.warn(`Failed to format ${filePath} with Biome:`, error);
		return null;
	}
}

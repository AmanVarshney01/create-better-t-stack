import path from "node:path";
import { Biome } from "@biomejs/js-api/nodejs";
import fs from "fs-extra";
import { glob } from "tinyglobby";

export async function formatProjectWithBiome(projectDir: string) {
	const biome = new Biome();
	const { projectKey } = biome.openProject(projectDir);

	biome.applyConfiguration(projectKey, {
		formatter: {
			enabled: true,
			indentStyle: "tab",
		},
		javascript: {
			formatter: {
				quoteStyle: "double",
			},
		},
	});

	const files = await glob("**/*", {
		cwd: projectDir,
		dot: true,
		absolute: true,
		onlyFiles: true,
	});

	for (const filePath of files) {
		try {
			const ext = path.extname(filePath).toLowerCase();
			const supported = new Set([
				".ts",
				".tsx",
				".js",
				".jsx",
				".cjs",
				".mjs",
				".cts",
				".mts",
				".json",
				".jsonc",
				".md",
				".mdx",
				".css",
				".scss",
				".html",
			]);
			if (!supported.has(ext)) continue;

			const original = await fs.readFile(filePath, "utf8");
			const result = biome.formatContent(projectKey, original, { filePath });
			const content = result?.content;
			if (typeof content !== "string") continue;
			if (content.length === 0 && original.length > 0) continue;
			if (content !== original) {
				await fs.writeFile(filePath, content);
			}
		} catch {}
	}
}

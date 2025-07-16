import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	clean: true,
	shims: true,
	outDir: "dist",
	outputOptions: {
		banner: "#!/usr/bin/env node",
	},
	env: {
		POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || "random",
		POSTHOG_HOST: process.env.POSTHOG_HOST || "random",
		BTS_TELEMETRY: process.env.BTS_TELEMETRY || "0",
	},
});

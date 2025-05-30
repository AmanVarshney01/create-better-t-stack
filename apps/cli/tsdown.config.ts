import "dotenv/config";
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
		POSTHOG_API_KEY: "phc_8ZUxEwwfKMajJLvxz1daGd931dYbQrwKNficBmsdIrs",
		POSTHOG_HOST: "https://us.i.posthog.com",
		MODE: process.env.MODE || "dev",
	},
});

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		testTimeout: 60000, // 60 seconds for CLI operations
		hookTimeout: 30000, // 30 seconds for setup/teardown
		globals: true,
		environment: "node",
	},
});

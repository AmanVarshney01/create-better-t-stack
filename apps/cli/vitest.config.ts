import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		watch: false,
		testTimeout: 180_000,
		hookTimeout: 120_000,
		reporters: "default",
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
	},
});

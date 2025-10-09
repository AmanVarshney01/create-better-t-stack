import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "pbs.twimg.com" },
			{ protocol: "https", hostname: "abs.twimg.com" },
			{ protocol: "https", hostname: "r2.better-t-stack.dev" },
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
		],
	},
	outputFileTracingExcludes: {
		"*": ["./**/*.js.map", "./**/*.mjs.map", "./**/*.cjs.map"],
	},
	async rewrites() {
		return [
			{
				source: "/docs/:path*.mdx",
				destination: "/llms.mdx/:path*",
			},
		];
	},
	experimental: {
		reactCompiler: true,
	},
};

export default withMDX(config);

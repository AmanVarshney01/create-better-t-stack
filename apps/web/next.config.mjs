import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
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
};

export default withMDX(config);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

import type { CreateInput, Template } from "../types";

export const TEMPLATE_PRESETS: Record<Template, CreateInput | null> = {
	mern: {
		database: "mongodb",
		orm: "mongoose",
		backend: "express",
		runtime: "node",
		frontend: ["react-router"],
		api: "orpc",
		auth: "better-auth",
		payments: "none",
		addons: ["turborepo"],
		examples: ["todo"],
		dbSetup: "mongodb-atlas",
		webDeploy: "none",
		serverDeploy: "none",
	},
	pern: {
		database: "postgres",
		orm: "drizzle",
		backend: "express",
		runtime: "node",
		frontend: ["tanstack-router"],
		api: "trpc",
		auth: "better-auth",
		payments: "none",
		addons: ["turborepo"],
		examples: ["todo"],
		dbSetup: "none",
		webDeploy: "none",
		serverDeploy: "none",
	},
	t3: {
		database: "postgres",
		orm: "prisma",
		backend: "self",
		runtime: "none",
		frontend: ["next"],
		api: "trpc",
		auth: "better-auth",
		payments: "none",
		addons: ["biome", "turborepo"],
		examples: ["none"],
		dbSetup: "none",
		webDeploy: "none",
		serverDeploy: "none",
	},
	uniwind: {
		database: "none",
		orm: "none",
		backend: "none",
		runtime: "none",
		frontend: ["native-uniwind"],
		api: "none",
		auth: "none",
		payments: "none",
		addons: ["none"],
		examples: ["none"],
		dbSetup: "none",
		webDeploy: "none",
		serverDeploy: "none",
	},
	none: null,
};

export function getTemplateConfig(template: Template) {
	if (template === "none" || !template) {
		return null;
	}

	const config = TEMPLATE_PRESETS[template];
	if (!config) {
		throw new Error(`Unknown template: ${template}`);
	}

	return config;
}

export function getTemplateDescription(template: Template) {
	const descriptions: Record<Template, string> = {
		mern: "MongoDB + Express + React + Node.js - Classic MERN stack",
		pern: "PostgreSQL + Express + React + Node.js - Popular PERN stack",
		t3: "T3 Stack - Next.js + tRPC + Prisma + PostgreSQL + Better Auth",
		uniwind: "Expo + Uniwind native app with no backend services",
		none: "No template - Full customization",
	};

	return descriptions[template] || "";
}

export function listAvailableTemplates() {
	return Object.keys(TEMPLATE_PRESETS).filter(
		(t) => t !== "none",
	) as Template[];
}

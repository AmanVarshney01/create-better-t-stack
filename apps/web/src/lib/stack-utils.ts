import {
	DEFAULT_STACK,
	isStackDefault,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import { stackUrlKeys } from "@/lib/stack-url-keys";

const CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
	"webFrontend",
	"nativeFrontend",
	"backend",
	"runtime",
	"api",
	"database",
	"orm",
	"dbSetup",
	"webDeploy",
	"serverDeploy",
	"auth",
	"packageManager",
	"addons",
	"examples",
	"git",
	"install",
];

export function generateStackSummary(stack: StackState): string {
	const selectedTechs = CATEGORY_ORDER.flatMap((category) => {
		const options = TECH_OPTIONS[category];
		const selectedValue = stack[category as keyof StackState];

		if (!options) return [];

		const getTechNames = (value: string | string[]) => {
			const values = Array.isArray(value) ? value : [value];
			return values
				.filter(
					(id) =>
						id !== "none" &&
						id !== "false" &&
						!(["git", "install", "auth"].includes(category) && id === "true"),
				)
				.map((id) => options.find((opt) => opt.id === id)?.name)
				.filter(Boolean) as string[];
		};

		return selectedValue ? getTechNames(selectedValue) : [];
	});

	return selectedTechs.length > 0 ? selectedTechs.join(" • ") : "Custom stack";
}

export function generateStackCommand(stack: StackState): string {
	const packageManagerCommands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		default: "bun create better-t-stack@latest",
	};

	const base =
		packageManagerCommands[
			stack.packageManager as keyof typeof packageManagerCommands
		] || packageManagerCommands.default;
	const projectName = stack.projectName || "my-better-t-app";

	const isStackDefaultExceptProjectName = Object.entries(DEFAULT_STACK).every(
		([key, _defaultValue]) =>
			key === "projectName" ||
			isStackDefault(
				stack,
				key as keyof StackState,
				stack[key as keyof StackState],
			),
	);

	if (isStackDefaultExceptProjectName) {
		return `${base} ${projectName} --yes`;
	}

	const flags = [
		`--frontend ${
			[...stack.webFrontend, ...stack.nativeFrontend]
				.filter((v, _, arr) => v !== "none" || arr.length === 1)
				.join(" ") || "none"
		}`,
		`--backend ${stack.backend}`,
		`--runtime ${stack.runtime}`,
		`--api ${stack.api}`,
		`--auth ${stack.auth}`,
		`--database ${stack.database}`,
		`--orm ${stack.orm}`,
		`--db-setup ${stack.dbSetup}`,
		`--package-manager ${stack.packageManager}`,
		stack.git === "false" ? "--no-git" : "--git",
		`--web-deploy ${stack.webDeploy}`,
		`--server-deploy ${stack.serverDeploy}`,
		stack.install === "false" ? "--no-install" : "--install",
		`--addons ${
			stack.addons.length > 0
				? stack.addons
						.filter((addon) =>
							[
								"pwa",
								"tauri",
								"starlight",
								"biome",
								"husky",
								"turborepo",
								"ultracite",
								"fumadocs",
								"oxlint",
								"ruler",
							].includes(addon),
						)
						.join(" ") || "none"
				: "none"
		}`,
		`--examples ${stack.examples.join(" ") || "none"}`,
	];

	if (stack.yolo === "true") {
		flags.push("--yolo");
	}

	return `${base} ${projectName} ${flags.join(" ")}`;
}

export function generateStackUrlFromState(
	stack: StackState,
	baseUrl?: string,
): string {
	const origin = baseUrl || "https://better-t-stack.dev";

	const stackParams = new URLSearchParams();
	Object.entries(stackUrlKeys).forEach(([stackKey, urlKey]) => {
		const value = stack[stackKey as keyof StackState];
		if (value !== undefined) {
			stackParams.set(
				urlKey as string,
				Array.isArray(value) ? value.join(",") : String(value),
			);
		}
	});

	const searchString = stackParams.toString();
	return `${origin}/new${searchString ? `?${searchString}` : ""}`;
}

export function generateStackSharingUrl(
	stack: StackState,
	baseUrl?: string,
): string {
	const origin = baseUrl || "https://better-t-stack.dev";

	const stackParams = new URLSearchParams();
	Object.entries(stackUrlKeys).forEach(([stackKey, urlKey]) => {
		const value = stack[stackKey as keyof StackState];
		if (value !== undefined) {
			stackParams.set(
				urlKey as string,
				Array.isArray(value) ? value.join(",") : String(value),
			);
		}
	});

	const searchString = stackParams.toString();
	return `${origin}/stack${searchString ? `?${searchString}` : ""}`;
}

export { CATEGORY_ORDER };

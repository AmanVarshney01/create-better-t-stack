"use client";
import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from "nuqs";
import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { stackUrlKeys } from "./stack-url-keys";

const getValidIds = (category: keyof typeof TECH_OPTIONS): string[] => {
	return TECH_OPTIONS[category]?.map((opt) => opt.id) ?? [];
};

export const stackParsers = {
	projectName: parseAsString.withDefault(
		DEFAULT_STACK.projectName ?? "my-better-t-app",
	),
	webFrontend: parseAsArrayOf(parseAsString).withDefault(
		DEFAULT_STACK.webFrontend,
	),
	nativeFrontend: parseAsArrayOf(parseAsString).withDefault(
		DEFAULT_STACK.nativeFrontend,
	),
	runtime: parseAsStringEnum<StackState["runtime"]>(
		getValidIds("runtime"),
	).withDefault(DEFAULT_STACK.runtime),
	backend: parseAsStringEnum<StackState["backend"]>(
		getValidIds("backend"),
	).withDefault(DEFAULT_STACK.backend),
	api: parseAsStringEnum<StackState["api"]>(getValidIds("api")).withDefault(
		DEFAULT_STACK.api,
	),
	database: parseAsStringEnum<StackState["database"]>(
		getValidIds("database"),
	).withDefault(DEFAULT_STACK.database),
	orm: parseAsStringEnum<StackState["orm"]>(getValidIds("orm")).withDefault(
		DEFAULT_STACK.orm,
	),
	dbSetup: parseAsStringEnum<StackState["dbSetup"]>(
		getValidIds("dbSetup"),
	).withDefault(DEFAULT_STACK.dbSetup),
	auth: parseAsStringEnum<StackState["auth"]>(getValidIds("auth")).withDefault(
		DEFAULT_STACK.auth,
	),
	packageManager: parseAsStringEnum<StackState["packageManager"]>(
		getValidIds("packageManager"),
	).withDefault(DEFAULT_STACK.packageManager),
	addons: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.addons),
	examples: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.examples),
	git: parseAsStringEnum<StackState["git"]>(["true", "false"]).withDefault(
		DEFAULT_STACK.git,
	),
	install: parseAsStringEnum<StackState["install"]>([
		"true",
		"false",
	]).withDefault(DEFAULT_STACK.install),
	webDeploy: parseAsStringEnum<StackState["webDeploy"]>(
		getValidIds("webDeploy"),
	).withDefault(DEFAULT_STACK.webDeploy),
	serverDeploy: parseAsStringEnum<StackState["serverDeploy"]>(
		getValidIds("serverDeploy"),
	).withDefault(DEFAULT_STACK.serverDeploy),
	yolo: parseAsStringEnum<StackState["yolo"]>(["true", "false"]).withDefault(
		DEFAULT_STACK.yolo,
	),
};

export const stackQueryStatesOptions = {
	history: "replace" as const,
	shallow: false,
	urlKeys: stackUrlKeys,
	clearOnDefault: true,
};

export function useStackState() {
	const [stack, setStack] = useQueryStates(
		stackParsers,
		stackQueryStatesOptions,
	);

	const updateStack = async (
		updates: Partial<StackState> | ((prev: StackState) => Partial<StackState>),
	) => {
		const newStack = typeof updates === "function" ? updates(stack) : updates;
		const finalStack = { ...stack, ...newStack };
		await setStack(finalStack);
	};

	return [stack, updateStack] as const;
}

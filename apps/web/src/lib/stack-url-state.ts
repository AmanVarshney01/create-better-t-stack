import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "@/lib/constant";
import {
	type UrlKeys,
	parseAsArrayOf,
	parseAsString,
	parseAsStringEnum,
} from "nuqs";

const getValidIds = (category: keyof typeof TECH_OPTIONS): string[] => {
	return TECH_OPTIONS[category]?.map((opt) => opt.id) ?? [];
};

export const stackParsers = {
	projectName: parseAsString.withDefault(DEFAULT_STACK.projectName),
	frontend: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.frontend),
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
	auth: parseAsStringEnum<StackState["auth"]>(["true", "false"]).withDefault(
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
};

export const stackUrlKeys: UrlKeys<typeof stackParsers> = {
	projectName: "name",
	frontend: "fe",
	runtime: "rt",
	backend: "be",
	api: "api",
	database: "db",
	orm: "orm",
	dbSetup: "dbs",
	auth: "au",
	packageManager: "pm",
	addons: "add",
	examples: "ex",
	git: "git",
	install: "i",
};

export const stackQueryStatesOptions = {
	history: "replace" as const,
	shallow: false,
	urlKeys: stackUrlKeys,
};

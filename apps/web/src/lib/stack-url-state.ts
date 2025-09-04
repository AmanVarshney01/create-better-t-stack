import {
	createLoader,
	createSerializer,
	parseAsArrayOf as parseAsArrayOfServer,
	parseAsStringEnum as parseAsStringEnumServer,
	parseAsString as parseAsStringServer,
	type UrlKeys,
} from "nuqs/server";
import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { stackUrlKeys } from "@/lib/stack-url-keys";

const getValidIds = (category: keyof typeof TECH_OPTIONS): string[] => {
	return TECH_OPTIONS[category]?.map((opt) => opt.id) ?? [];
};

const serverStackParsers = {
	projectName: parseAsStringServer.withDefault(
		DEFAULT_STACK.projectName || "my-better-t-app",
	),
	webFrontend: parseAsArrayOfServer(parseAsStringServer).withDefault(
		DEFAULT_STACK.webFrontend,
	),
	nativeFrontend: parseAsArrayOfServer(parseAsStringServer).withDefault(
		DEFAULT_STACK.nativeFrontend,
	),
	runtime: parseAsStringEnumServer<StackState["runtime"]>(
		getValidIds("runtime"),
	).withDefault(DEFAULT_STACK.runtime),
	backend: parseAsStringEnumServer<StackState["backend"]>(
		getValidIds("backend"),
	).withDefault(DEFAULT_STACK.backend),
	api: parseAsStringEnumServer<StackState["api"]>(
		getValidIds("api"),
	).withDefault(DEFAULT_STACK.api),
	database: parseAsStringEnumServer<StackState["database"]>(
		getValidIds("database"),
	).withDefault(DEFAULT_STACK.database),
	orm: parseAsStringEnumServer<StackState["orm"]>(
		getValidIds("orm"),
	).withDefault(DEFAULT_STACK.orm),
	dbSetup: parseAsStringEnumServer<StackState["dbSetup"]>(
		getValidIds("dbSetup"),
	).withDefault(DEFAULT_STACK.dbSetup),
	auth: parseAsStringEnumServer<StackState["auth"]>(
		getValidIds("auth"),
	).withDefault(DEFAULT_STACK.auth),
	packageManager: parseAsStringEnumServer<StackState["packageManager"]>(
		getValidIds("packageManager"),
	).withDefault(DEFAULT_STACK.packageManager),
	addons: parseAsArrayOfServer(parseAsStringServer).withDefault(
		DEFAULT_STACK.addons,
	),
	examples: parseAsArrayOfServer(parseAsStringServer).withDefault(
		DEFAULT_STACK.examples,
	),
	git: parseAsStringEnumServer<StackState["git"]>([
		"true",
		"false",
	]).withDefault(DEFAULT_STACK.git),
	install: parseAsStringEnumServer<StackState["install"]>([
		"true",
		"false",
	]).withDefault(DEFAULT_STACK.install),
	webDeploy: parseAsStringEnumServer<StackState["webDeploy"]>(
		getValidIds("webDeploy"),
	).withDefault(DEFAULT_STACK.webDeploy),
	serverDeploy: parseAsStringEnumServer<StackState["serverDeploy"]>(
		getValidIds("serverDeploy"),
	).withDefault(DEFAULT_STACK.serverDeploy),
	yolo: parseAsStringEnumServer<StackState["yolo"]>([
		"true",
		"false",
	]).withDefault(DEFAULT_STACK.yolo),
};

export const loadStackParams = createLoader(serverStackParsers, {
	urlKeys: stackUrlKeys as UrlKeys<typeof serverStackParsers>,
});

export const serializeStackParams = createSerializer(serverStackParsers, {
	urlKeys: stackUrlKeys as UrlKeys<typeof serverStackParsers>,
});

export type LoadedStackState = Awaited<ReturnType<typeof loadStackParams>>;

import type { UrlKeys } from "nuqs";
import type { StackState } from "@/lib/constant";

export const stackUrlKeys: UrlKeys<Record<keyof StackState, unknown>> = {
	projectName: "name",
	webFrontend: "fe-w",
	nativeFrontend: "fe-n",
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
	webDeploy: "wd",
	serverDeploy: "sd",
	yolo: "yolo",
};

import path from "node:path";
import fs from "fs-extra";
import {
	AddonsSchema,
	APISchema,
	BackendSchema,
	DatabaseSchema,
	DatabaseSetupSchema,
	ExamplesSchema,
	FrontendSchema,
	ORMSchema,
	PackageManagerSchema,
	RuntimeSchema,
	WebDeploySchema,
} from "../../cli/src/types";

const DATABASE_VALUES = DatabaseSchema.options;
const ORM_VALUES = ORMSchema.options;
const BACKEND_VALUES = BackendSchema.options;
const RUNTIME_VALUES = RuntimeSchema.options;
const FRONTEND_VALUES = FrontendSchema.options;
const ADDONS_VALUES = AddonsSchema.options;
const EXAMPLES_VALUES = ExamplesSchema.options;
const PACKAGE_MANAGER_VALUES = PackageManagerSchema.options;
const DATABASE_SETUP_VALUES = DatabaseSetupSchema.options;
const API_VALUES = APISchema.options;
const WEB_DEPLOY_VALUES = WebDeploySchema.options;

const configSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "https://better-t-stack.dev/schema.json",
	title: "Better-T-Stack Configuration",
	description: "Configuration file for Better-T-Stack projects",
	type: "object",
	properties: {
		$schema: {
			type: "string",
			description: "JSON Schema reference for validation",
		},
		version: {
			type: "string",
			description: "CLI version used to create this project",
			pattern: "^\\d+\\.\\d+\\.\\d+$",
		},
		createdAt: {
			type: "string",
			format: "date-time",
			description: "Timestamp when the project was created",
		},
		database: {
			type: "string",
			enum: DATABASE_VALUES,
			description: DatabaseSchema.description,
		},
		orm: {
			type: "string",
			enum: ORM_VALUES,
			description: ORMSchema.description,
		},
		backend: {
			type: "string",
			enum: BACKEND_VALUES,
			description: BackendSchema.description,
		},
		runtime: {
			type: "string",
			enum: RUNTIME_VALUES,
			description: RuntimeSchema.description,
		},
		frontend: {
			type: "array",
			items: {
				type: "string",
				enum: FRONTEND_VALUES,
			},
			description: FrontendSchema.description,
		},
		addons: {
			type: "array",
			items: {
				type: "string",
				enum: ADDONS_VALUES,
			},
			description: AddonsSchema.description,
		},
		examples: {
			type: "array",
			items: {
				type: "string",
				enum: EXAMPLES_VALUES,
			},
			description: ExamplesSchema.description,
		},
		auth: {
			type: "boolean",
			description: "Whether authentication is enabled",
		},
		packageManager: {
			type: "string",
			enum: PACKAGE_MANAGER_VALUES,
			description: PackageManagerSchema.description,
		},
		dbSetup: {
			type: "string",
			enum: DATABASE_SETUP_VALUES,
			description: DatabaseSetupSchema.description,
		},
		api: {
			type: "string",
			enum: API_VALUES,
			description: APISchema.description,
		},
		webDeploy: {
			type: "string",
			enum: WEB_DEPLOY_VALUES,
			description: WebDeploySchema.description,
		},
	},
	required: [
		"version",
		"createdAt",
		"database",
		"orm",
		"backend",
		"runtime",
		"frontend",
		"addons",
		"examples",
		"auth",
		"packageManager",
		"dbSetup",
		"api",
		"webDeploy",
	],
	additionalProperties: false,
};

async function generateSchema() {
	const schemaPath = path.join(process.cwd(), "public", "schema.json");
	await fs.ensureDir(path.dirname(schemaPath));
	await fs.writeFile(
		schemaPath,
		JSON.stringify(configSchema, null, 2),
		"utf-8",
	);
	console.log("✅ Generated schema.json from shared types package");
}

generateSchema().catch(console.error);

export * from "./types";
export * from "./core/virtual-fs";
export * from "./core/template-processor";
export * from "./generator";
export { processAddonTemplates } from "./template-handlers";
export { processAddonsDeps } from "./processors";

export { EMBEDDED_TEMPLATES, TEMPLATE_COUNT } from "./templates.generated";
export { dependencyVersionMap, type AvailableDependencies } from "./utils/add-deps";
export * from "./utils/dependency-checker";

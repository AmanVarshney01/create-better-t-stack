export * from "./types";
export * from "./core/virtual-fs";
export * from "./core/template-processor";
export * from "./generator";
export { processAddonTemplates } from "./template-handlers/addons";
export { processAddonsDeps } from "./processors/addons-deps";
export { processNxConfig } from "./processors/nx-generator";
export { processTurboConfig } from "./processors/turbo-generator";
export { processVitePlusConfig } from "./processors/vite-plus-generator";
export { processPackageConfigs, processVercelConfig } from "./post-process";
export { writeBtsConfigToVfs } from "./bts-config";

export { EMBEDDED_TEMPLATES, TEMPLATE_COUNT } from "./templates.generated";
export { dependencyVersionMap, type AvailableDependencies } from "./utils/add-deps";
export { generateReproducibleCommand } from "./utils/reproducible-command";

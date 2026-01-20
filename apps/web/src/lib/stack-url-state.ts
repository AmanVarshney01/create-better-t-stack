import { DEFAULT_STACK, type StackState } from "@/lib/constant";
import { stackUrlKeys } from "@/lib/stack-url-keys";

// Parse search params to StackState (used on server side)
export function loadStackParams(
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>,
): Promise<StackState> | StackState {
  const parseSync = (params: Record<string, string | string[] | undefined>): StackState => {
    const getString = (key: string, defaultValue: string): string => {
      const urlKey = stackUrlKeys[key as keyof typeof stackUrlKeys] || key;
      const value = params[urlKey];
      if (typeof value === "string") return value;
      return defaultValue;
    };

    const getArray = (key: string, defaultValue: string[]): string[] => {
      const urlKey = stackUrlKeys[key as keyof typeof stackUrlKeys] || key;
      const value = params[urlKey];
      if (typeof value === "string") {
        return value.split(",").filter(Boolean);
      }
      if (Array.isArray(value)) {
        return value.filter((v): v is string => typeof v === "string");
      }
      return defaultValue;
    };

    return {
      ecosystem: getString("ecosystem", DEFAULT_STACK.ecosystem) as "typescript" | "rust",
      projectName: getString("projectName", DEFAULT_STACK.projectName ?? "my-better-t-app"),
      webFrontend: getArray("webFrontend", DEFAULT_STACK.webFrontend),
      nativeFrontend: getArray("nativeFrontend", DEFAULT_STACK.nativeFrontend),
      astroIntegration: getString("astroIntegration", DEFAULT_STACK.astroIntegration),
      cssFramework: getString("cssFramework", DEFAULT_STACK.cssFramework),
      uiLibrary: getString("uiLibrary", DEFAULT_STACK.uiLibrary),
      runtime: getString("runtime", DEFAULT_STACK.runtime),
      backend: getString("backend", DEFAULT_STACK.backend),
      api: getString("api", DEFAULT_STACK.api),
      database: getString("database", DEFAULT_STACK.database),
      orm: getString("orm", DEFAULT_STACK.orm),
      dbSetup: getString("dbSetup", DEFAULT_STACK.dbSetup),
      auth: getString("auth", DEFAULT_STACK.auth),
      payments: getString("payments", DEFAULT_STACK.payments),
      email: getString("email", DEFAULT_STACK.email),
      fileUpload: getString("fileUpload", DEFAULT_STACK.fileUpload),
      logging: getString("logging", DEFAULT_STACK.logging),
      observability: getString("observability", DEFAULT_STACK.observability),
      backendLibraries: getString("backendLibraries", DEFAULT_STACK.backendLibraries),
      stateManagement: getString("stateManagement", DEFAULT_STACK.stateManagement),
      validation: getString("validation", DEFAULT_STACK.validation),
      testing: getString("testing", DEFAULT_STACK.testing),
      realtime: getString("realtime", DEFAULT_STACK.realtime),
      jobQueue: getString("jobQueue", DEFAULT_STACK.jobQueue),
      caching: getString("caching", DEFAULT_STACK.caching),
      animation: getString("animation", DEFAULT_STACK.animation),
      cms: getString("cms", DEFAULT_STACK.cms),
      codeQuality: getArray("codeQuality", DEFAULT_STACK.codeQuality),
      documentation: getArray("documentation", DEFAULT_STACK.documentation),
      appPlatforms: getArray("appPlatforms", DEFAULT_STACK.appPlatforms),
      packageManager: getString("packageManager", DEFAULT_STACK.packageManager),
      examples: getArray("examples", DEFAULT_STACK.examples),
      aiSdk: getString("aiSdk", DEFAULT_STACK.aiSdk),
      git: getString("git", DEFAULT_STACK.git),
      install: getString("install", DEFAULT_STACK.install),
      webDeploy: getString("webDeploy", DEFAULT_STACK.webDeploy),
      serverDeploy: getString("serverDeploy", DEFAULT_STACK.serverDeploy),
      yolo: getString("yolo", DEFAULT_STACK.yolo),
      // Rust ecosystem fields
      rustWebFramework: getString("rustWebFramework", DEFAULT_STACK.rustWebFramework),
      rustFrontend: getString("rustFrontend", DEFAULT_STACK.rustFrontend),
      rustOrm: getString("rustOrm", DEFAULT_STACK.rustOrm),
      rustApi: getString("rustApi", DEFAULT_STACK.rustApi),
      rustCli: getString("rustCli", DEFAULT_STACK.rustCli),
      rustLibraries: getString("rustLibraries", DEFAULT_STACK.rustLibraries),
    };
  };

  if (searchParams instanceof Promise) {
    return searchParams.then(parseSync);
  }
  return parseSync(searchParams);
}

// Serialize StackState to URL string
export function serializeStackParams(basePath: string, stack: StackState): string {
  const params = new URLSearchParams();

  const addParam = (key: keyof StackState, value: string | string[] | null) => {
    const urlKey = stackUrlKeys[key] || key;
    const defaultValue = DEFAULT_STACK[key];

    if (Array.isArray(value)) {
      const serialized = value.join(",");
      const defaultSerialized = Array.isArray(defaultValue) ? defaultValue.join(",") : "";
      if (serialized !== defaultSerialized) {
        params.set(urlKey, serialized);
      }
    } else if (value !== null && value !== defaultValue) {
      params.set(urlKey, value);
    }
  };

  addParam("ecosystem", stack.ecosystem);
  addParam("projectName", stack.projectName);
  addParam("webFrontend", stack.webFrontend);
  addParam("nativeFrontend", stack.nativeFrontend);
  addParam("astroIntegration", stack.astroIntegration);
  addParam("cssFramework", stack.cssFramework);
  addParam("uiLibrary", stack.uiLibrary);
  addParam("runtime", stack.runtime);
  addParam("backend", stack.backend);
  addParam("api", stack.api);
  addParam("database", stack.database);
  addParam("orm", stack.orm);
  addParam("dbSetup", stack.dbSetup);
  addParam("auth", stack.auth);
  addParam("payments", stack.payments);
  addParam("email", stack.email);
  addParam("fileUpload", stack.fileUpload);
  addParam("logging", stack.logging);
  addParam("observability", stack.observability);
  addParam("backendLibraries", stack.backendLibraries);
  addParam("stateManagement", stack.stateManagement);
  addParam("validation", stack.validation);
  addParam("testing", stack.testing);
  addParam("realtime", stack.realtime);
  addParam("jobQueue", stack.jobQueue);
  addParam("caching", stack.caching);
  addParam("animation", stack.animation);
  addParam("cms", stack.cms);
  addParam("codeQuality", stack.codeQuality);
  addParam("documentation", stack.documentation);
  addParam("appPlatforms", stack.appPlatforms);
  addParam("packageManager", stack.packageManager);
  addParam("examples", stack.examples);
  addParam("aiSdk", stack.aiSdk);
  addParam("git", stack.git);
  addParam("install", stack.install);
  addParam("webDeploy", stack.webDeploy);
  addParam("serverDeploy", stack.serverDeploy);
  addParam("yolo", stack.yolo);
  // Rust ecosystem fields
  addParam("rustWebFramework", stack.rustWebFramework);
  addParam("rustFrontend", stack.rustFrontend);
  addParam("rustOrm", stack.rustOrm);
  addParam("rustApi", stack.rustApi);
  addParam("rustCli", stack.rustCli);
  addParam("rustLibraries", stack.rustLibraries);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export type LoadedStackState = StackState;

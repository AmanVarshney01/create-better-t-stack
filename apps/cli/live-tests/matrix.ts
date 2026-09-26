import { createHash } from "node:crypto";

import {
  ADDONS_VALUES,
  API_VALUES,
  AUTH_VALUES,
  BACKEND_VALUES,
  DATABASE_SETUP_VALUES,
  DATABASE_VALUES,
  EXAMPLES_VALUES,
  FRONTEND_VALUES,
  ORM_VALUES,
  PACKAGE_MANAGER_VALUES,
  PAYMENTS_VALUES,
  RUNTIME_VALUES,
  SERVER_DEPLOY_VALUES,
  WEB_DEPLOY_VALUES,
  ProjectConfigSchema,
  getBackendDisabledOptions,
  isFrontendAllowedWithBackend,
  supportsOrmDatabase,
  supportsRuntimeBackend,
  supportsRuntimeDatabase,
  supportsDatabaseSetup,
  supportsDatabaseSetupRuntime,
  supportsServerDeployRuntime,
  supportsPaymentsAuth,
  allowedApisForFrontends,
  validateAddonCompatibility,
  type ProjectConfig,
} from "@better-t-stack/types";

import { validateResolvedConfigCompatibility } from "../src/validation";

export const selectionSchema = ProjectConfigSchema.pick({
  frontend: true,
  backend: true,
  runtime: true,
  database: true,
  orm: true,
  dbSetup: true,
  auth: true,
  api: true,
  payments: true,
  webDeploy: true,
  serverDeploy: true,
  packageManager: true,
  addons: true,
  examples: true,
})
  .partial()
  .strict();
export type Selection = ReturnType<typeof selectionSchema.parse>;

export function* subsets<T>(values: readonly T[]): Generator<T[]> {
  if (values.length === 0) {
    yield [];
    return;
  }
  const [first, ...rest] = values;
  for (const subset of subsets(rest)) {
    yield subset;
    yield [first!, ...subset];
  }
}

function choices<T>(value: T | undefined, values: readonly T[]): readonly T[] {
  return value === undefined ? values : [value];
}

export function caseId(config: ProjectConfig) {
  const { projectName: _name, projectDir: _dir, relativePath: _relative, ...selection } = config;
  return createHash("sha256")
    .update(
      JSON.stringify({
        ...selection,
        frontend: [...selection.frontend].sort(),
        addons: [...selection.addons].sort(),
        examples: [...selection.examples].sort(),
      }),
    )
    .digest("hex")
    .slice(0, 20);
}

export function* configurations(filter: Selection = {}): Generator<ProjectConfig> {
  const web = FRONTEND_VALUES.filter((f) => f !== "none" && !f.startsWith("native-"));
  const native = FRONTEND_VALUES.filter((f) => f.startsWith("native-"));
  const frontends = filter.frontend
    ? [filter.frontend]
    : [
        [],
        ...web.map((f) => [f]),
        ...native.map((f) => [f]),
        ...web.flatMap((w) => native.map((n) => [w, n])),
      ];
  for (const backend of choices(filter.backend, BACKEND_VALUES)) {
    const disabled = new Set<string>(getBackendDisabledOptions(backend));
    for (const runtime of choices(filter.runtime, RUNTIME_VALUES)) {
      if (!supportsRuntimeBackend(runtime, backend)) continue;
      for (const database of choices(filter.database, DATABASE_VALUES)) {
        if (disabled.has("database") && database !== "none") continue;
        if (!supportsRuntimeDatabase(runtime, database)) continue;
        for (const orm of choices(filter.orm, ORM_VALUES)) {
          if (!supportsOrmDatabase(orm, database)) continue;
          for (const dbSetup of choices(filter.dbSetup, DATABASE_SETUP_VALUES)) {
            if (
              !supportsDatabaseSetup(dbSetup, database) ||
              !supportsDatabaseSetupRuntime(dbSetup, runtime, backend)
            )
              continue;
            for (const frontend of frontends) {
              for (const auth of choices(filter.auth, AUTH_VALUES)) {
                if (disabled.has("auth") && auth !== "none") continue;
                if (frontend.some((f) => !isFrontendAllowedWithBackend(f, backend, auth))) continue;
                for (const api of choices(filter.api, API_VALUES)) {
                  if (disabled.has("api") && api !== "none") continue;
                  if (!allowedApisForFrontends(frontend).includes(api)) continue;
                  for (const payments of choices(filter.payments, PAYMENTS_VALUES)) {
                    if (!supportsPaymentsAuth(payments, auth)) continue;
                    for (const webDeploy of choices(filter.webDeploy, WEB_DEPLOY_VALUES)) {
                      if (webDeploy !== "none" && !frontend.some((f) => web.includes(f))) continue;
                      for (const serverDeploy of choices(
                        filter.serverDeploy,
                        SERVER_DEPLOY_VALUES,
                      )) {
                        if (disabled.has("serverDeploy") && serverDeploy !== "none") continue;
                        if (
                          !disabled.has("serverDeploy") &&
                          !supportsServerDeployRuntime(serverDeploy, runtime)
                        )
                          continue;
                        const base: ProjectConfig = {
                          projectName: "live-app",
                          projectDir: "/virtual/live-app",
                          relativePath: "live-app",
                          backend,
                          runtime,
                          database,
                          orm,
                          dbSetup,
                          frontend: [...frontend],
                          auth,
                          api,
                          payments,
                          webDeploy,
                          serverDeploy,
                          packageManager: "bun",
                          addons: [],
                          examples: [],
                          git: false,
                          install: true,
                        };
                        if (validateResolvedConfigCompatibility(base).isErr()) continue;
                        const availableAddons = ADDONS_VALUES.filter(
                          (a) =>
                            a !== "none" &&
                            validateAddonCompatibility(a, frontend, auth, backend, runtime)
                              .isCompatible,
                        );
                        for (const addons of filter.addons
                          ? [filter.addons]
                          : subsets(availableAddons)) {
                          const parsed = ProjectConfigSchema.safeParse({ ...base, addons });
                          if (
                            !parsed.success ||
                            validateResolvedConfigCompatibility(parsed.data).isErr()
                          )
                            continue;
                          for (const examples of filter.examples
                            ? [filter.examples]
                            : subsets(EXAMPLES_VALUES.filter((e) => e !== "none"))) {
                            for (const packageManager of choices(
                              filter.packageManager,
                              PACKAGE_MANAGER_VALUES,
                            )) {
                              const config = { ...parsed.data, examples, packageManager };
                              if (validateResolvedConfigCompatibility(config).isOk()) yield config;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

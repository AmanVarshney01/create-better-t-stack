import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { create } from "../src";
import {
  getPackageManagerCommand,
  runCommand,
  runWorkspaceTypeChecks,
  sampleTimeoutMs,
} from "./generated-builds/harness";
import {
  bootAndValidateAstroWebsite,
  bootAndValidateAxiomRuntime,
  bootAndValidateNuxtAuthRuntime,
  bootAndValidatePrismaWebArtifact,
  bootAndValidateSolidDevRuntime,
  bootAndValidateSolidRuntime,
  bootAndValidateStartAuthRuntime,
  bootAndValidateStartCsrf,
  validatePwaBuildArtifacts,
  validateSolidBuildArtifacts,
  writeNuxtSsrAuthProbe,
  writeOrpcInferenceChecks,
  writeStartCsrfProbe,
  writeSyntheticBuildConfig,
} from "./generated-builds/probes";
import { getSelectedBuildSamples } from "./generated-builds/samples";
import { SMOKE_DIR } from "./setup";

// Generated projects install real dependencies, typecheck, build and, where a
// sample asks for it, boot. Run with BTS_BUILD_SAMPLES=1. CI shards the samples
// with BTS_BUILD_SAMPLE_SHARD=n/N, and BTS_BUILD_SAMPLE_FILTER selects by name.
const shouldRunBuildSamples = process.env.BTS_BUILD_SAMPLES === "1";

if (shouldRunBuildSamples) {
  process.env.BTS_SKIP_EXTERNAL_COMMANDS = "1";
  process.env.BTS_TEST_MODE = "1";
}

describe.skipIf(!shouldRunBuildSamples)("Generated project install/build samples", () => {
  for (const sample of shouldRunBuildSamples ? getSelectedBuildSamples() : []) {
    it(
      `installs dependencies and builds ${sample.name}`,
      async () => {
        const projectDir = path.join(SMOKE_DIR, "generated-builds", sample.name);
        await fs.remove(projectDir);

        try {
          const createResult = await create(projectDir, sample.config);
          expect(createResult.isOk()).toBe(true);
          await writeSyntheticBuildConfig(projectDir);
          await writeStartCsrfProbe(sample, projectDir);

          const install = getPackageManagerCommand(sample.packageManager, "install");
          await runCommand(sample.name, projectDir, install.command, install.args);
          if (await fs.pathExists(path.join(projectDir, "packages/infra/alchemy.run.ts"))) {
            await runCommand(
              sample.name,
              path.join(projectDir, "packages/infra"),
              sample.packageManager,
              ["run", "dev", ...(sample.packageManager === "npm" ? ["--"] : []), "--help"],
            );
          }
          if (sample.config.orm === "prisma") {
            const generatedClient = path.join(projectDir, "packages/db/prisma/generated/client.ts");
            expect(await fs.pathExists(generatedClient)).toBe(false);
            await runCommand(
              sample.name,
              path.join(projectDir, "packages/db"),
              sample.packageManager,
              ["run", "db:generate"],
            );
            expect(await fs.pathExists(generatedClient)).toBe(true);
          }
          if (sample.checks.includes("auth-generate")) {
            await runCommand(sample.name, projectDir, sample.packageManager, [
              "run",
              "auth:generate",
            ]);
          }
          const restoreTypeFixtures = sample.checks.includes("scaffold-types-only")
            ? undefined
            : await writeOrpcInferenceChecks(sample, projectDir);
          await writeNuxtSsrAuthProbe(sample, projectDir);
          try {
            await runWorkspaceTypeChecks(sample.name, projectDir, sample.packageManager);
          } finally {
            // Build and boot the scaffold without the compile-only custom auth field.
            await restoreTypeFixtures?.();
          }
          const build = getPackageManagerCommand(sample.packageManager, "build");
          await runCommand(sample.name, projectDir, build.command, build.args);
          await bootAndValidatePrismaWebArtifact(sample, projectDir);
          await bootAndValidateAstroWebsite(sample, projectDir);
          await bootAndValidateAxiomRuntime(sample, projectDir);
          await bootAndValidateStartAuthRuntime(sample, projectDir);
          await bootAndValidateStartCsrf(sample, projectDir);
          await bootAndValidateNuxtAuthRuntime(sample, projectDir);
          await bootAndValidateSolidDevRuntime(sample, projectDir);
          await bootAndValidateSolidRuntime(sample, projectDir);
          await validateSolidBuildArtifacts(sample, projectDir);
          await validatePwaBuildArtifacts(sample, projectDir);
          if (sample.config.frontend?.some((frontend) => frontend.startsWith("native-"))) {
            // Exercise Metro/Babel and platform imports as well as TypeScript.
            // This exports JS bundles; it does not compile or sign native binaries.
            for (const platform of ["ios", "android"]) {
              await runCommand(sample.name, path.join(projectDir, "apps/native"), "bun", [
                "x",
                "--no-install",
                "expo",
                "export",
                "--platform",
                platform,
              ]);
            }
          }
        } finally {
          await fs.remove(projectDir);
        }
      },
      sampleTimeoutMs,
    );
  }
});

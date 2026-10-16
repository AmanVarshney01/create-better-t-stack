import { describe, expect, it } from "bun:test";

import { coerce } from "semver";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

const frontends = ["native-bare", "native-uniwind", "native-unistyles"] as const;
const authProviders = ["none", "better-auth", "clerk"] as const;
const packageManagers = ["bun", "npm", "pnpm"] as const;

describe("Native SDK alignment", () => {
  for (const frontend of frontends) {
    for (const auth of authProviders) {
      for (const packageManager of packageManagers) {
        it(`aligns ${frontend}/${auth}/${packageManager} and scopes peer overrides`, async () => {
          const result = await createVirtual({
            projectName: "native-sdk-check",
            frontend: [frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth,
            api: "orpc",
            addons: [],
            examples: ["todo", "ai"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
            git: false,
            packageManager,
            payments: "none",
          });
          if (result.isErr()) throw result.error;
          const files = collectFiles(result.value.root, result.value.root.path);
          const pkg = JSON.parse(files.get("apps/native/package.json")!);
          const rootPkg = JSON.parse(files.get("package.json")!);
          const overrides = rootPkg.overrides ?? {};
          expect(overrides["@clerk/expo"]).toEqual(
            packageManager === "npm" && auth === "clerk"
              ? { expo: pkg.dependencies.expo }
              : undefined,
          );
          expect(overrides["heroui-native"]).toEqual(
            packageManager === "npm" && frontend === "native-uniwind"
              ? { "react-native-gesture-handler": pkg.dependencies["react-native-gesture-handler"] }
              : undefined,
          );
          const sdk = coerce(pkg.dependencies.expo)!.major;
          for (const [name, version] of Object.entries<string>(pkg.dependencies)) {
            if (name.startsWith("expo-") || name === "@expo/ui" || name === "@expo/metro-runtime")
              expect(coerce(version)!.major, name).toBe(sdk);
            expect(pkg.devDependencies[name], `${name} must not be duplicated`).toBeUndefined();
          }
          expect(coerce(pkg.devDependencies["babel-preset-expo"])!.major).toBe(sdk);
          expect(pkg.dependencies["react-dom"]).toBe(pkg.dependencies.react);
          const react = coerce(pkg.dependencies.react)!;
          const reactTypes = coerce(pkg.devDependencies["@types/react"])!;
          expect([reactTypes.major, reactTypes.minor]).toEqual([react.major, react.minor]);
          expect(pkg.dependencies["expo-dev-client"]).toBeDefined();
          if (auth === "clerk") expect(pkg.dependencies["@clerk/expo"]).toBeDefined();
          if (frontend === "native-uniwind")
            expect(pkg.dependencies["heroui-native"]).toBeDefined();
          if (frontend === "native-unistyles")
            expect(pkg.dependencies["react-native-unistyles"]).toBeDefined();
        });
      }
    }
  }
});

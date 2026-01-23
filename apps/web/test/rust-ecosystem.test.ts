import { describe, expect, it } from "bun:test";

import type { Ecosystem, TechCategory } from "../src/lib/types";

import { getCategoryDisplayName } from "../src/components/stack-builder/utils";
import {
  DEFAULT_STACK,
  ECOSYSTEMS,
  ECOSYSTEM_CATEGORIES,
  TECH_OPTIONS,
  type StackState,
} from "../src/lib/constant";
import {
  CATEGORY_ORDER,
  RUST_CATEGORY_ORDER,
  TYPESCRIPT_CATEGORY_ORDER,
} from "../src/lib/stack-utils";

describe("Rust Ecosystem Tab", () => {
  describe("Ecosystem Type", () => {
    it("should have typescript and rust as valid ecosystem values", () => {
      const ecosystems: Ecosystem[] = ["typescript", "rust"];
      expect(ecosystems).toContain("typescript");
      expect(ecosystems).toContain("rust");
    });
  });

  describe("ECOSYSTEMS constant", () => {
    it("should contain TypeScript ecosystem", () => {
      const tsEcosystem = ECOSYSTEMS.find((e) => e.id === "typescript");
      expect(tsEcosystem).toBeDefined();
      expect(tsEcosystem?.name).toBe("TypeScript");
      expect(tsEcosystem?.icon).toContain("typescript");
    });

    it("should contain Rust ecosystem", () => {
      const rustEcosystem = ECOSYSTEMS.find((e) => e.id === "rust");
      expect(rustEcosystem).toBeDefined();
      expect(rustEcosystem?.name).toBe("Rust");
      expect(rustEcosystem?.icon).toContain("rust");
      expect(rustEcosystem?.description).toBe("High-performance Rust ecosystem");
    });

    it("should have exactly 3 ecosystems", () => {
      expect(ECOSYSTEMS).toHaveLength(3);
    });
  });

  describe("ECOSYSTEM_CATEGORIES", () => {
    it("should have categories for typescript ecosystem", () => {
      expect(ECOSYSTEM_CATEGORIES.typescript).toBeDefined();
      expect(ECOSYSTEM_CATEGORIES.typescript.length).toBeGreaterThan(0);
    });

    it("should have categories for rust ecosystem", () => {
      expect(ECOSYSTEM_CATEGORIES.rust).toBeDefined();
      expect(ECOSYSTEM_CATEGORIES.rust.length).toBeGreaterThan(0);
    });

    it("should include rust-specific categories in rust ecosystem", () => {
      const rustCategories = ECOSYSTEM_CATEGORIES.rust;
      expect(rustCategories).toContain("rustWebFramework");
      expect(rustCategories).toContain("rustFrontend");
      expect(rustCategories).toContain("rustOrm");
      expect(rustCategories).toContain("rustApi");
      expect(rustCategories).toContain("rustCli");
      expect(rustCategories).toContain("rustLibraries");
    });

    it("should include git and install in rust ecosystem", () => {
      const rustCategories = ECOSYSTEM_CATEGORIES.rust;
      expect(rustCategories).toContain("git");
      expect(rustCategories).toContain("install");
    });

    it("should NOT include rust categories in typescript ecosystem", () => {
      const tsCategories = ECOSYSTEM_CATEGORIES.typescript;
      expect(tsCategories).not.toContain("rustWebFramework");
      expect(tsCategories).not.toContain("rustFrontend");
      expect(tsCategories).not.toContain("rustOrm");
    });
  });

  describe("TECH_OPTIONS - Rust Categories", () => {
    const rustCategories: TechCategory[] = [
      "rustWebFramework",
      "rustFrontend",
      "rustOrm",
      "rustApi",
      "rustCli",
      "rustLibraries",
    ];

    for (const category of rustCategories) {
      it(`should have options for ${category}`, () => {
        const options = TECH_OPTIONS[category];
        expect(options).toBeDefined();
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBeGreaterThan(0);
      });

      it(`should have a "none" option for ${category}`, () => {
        const options = TECH_OPTIONS[category];
        const noneOption = options.find((o) => o.id === "none");
        expect(noneOption).toBeDefined();
      });

      it(`should have exactly one default option for ${category}`, () => {
        const options = TECH_OPTIONS[category];
        const defaultOptions = options.filter((o) => o.default === true);
        expect(defaultOptions.length).toBe(1);
      });
    }

    it("should have Axum as default for rustWebFramework", () => {
      const options = TECH_OPTIONS.rustWebFramework;
      const axumOption = options.find((o) => o.id === "axum");
      expect(axumOption).toBeDefined();
      expect(axumOption?.default).toBe(true);
      expect(axumOption?.name).toBe("Axum");
      expect(axumOption?.description).toContain("Tokio team");
    });

    it("should have Actix-web option for rustWebFramework", () => {
      const options = TECH_OPTIONS.rustWebFramework;
      const actixOption = options.find((o) => o.id === "actix-web");
      expect(actixOption).toBeDefined();
      expect(actixOption?.name).toBe("Actix-web");
    });

    it("should have Leptos as default for rustFrontend", () => {
      const options = TECH_OPTIONS.rustFrontend;
      const leptosOption = options.find((o) => o.id === "leptos");
      expect(leptosOption).toBeDefined();
      expect(leptosOption?.default).toBe(true);
      expect(leptosOption?.name).toBe("Leptos");
      expect(leptosOption?.description).toContain("reactive");
      expect(leptosOption?.description).toContain("SSR");
    });

    it("should have none option for rustFrontend when user wants to skip", () => {
      const options = TECH_OPTIONS.rustFrontend;
      const noneOption = options.find((o) => o.id === "none");
      expect(noneOption).toBeDefined();
      expect(noneOption?.default).toBe(false);
      expect(noneOption?.name).toBe("No WASM Frontend");
    });

    it("should have Serde as default for rustLibraries", () => {
      const options = TECH_OPTIONS.rustLibraries;
      const serdeOption = options.find((o) => o.id === "serde");
      expect(serdeOption).toBeDefined();
      expect(serdeOption?.default).toBe(true);
      expect(serdeOption?.name).toBe("Serde");
      expect(serdeOption?.description).toContain("serialization");
    });

    it("should have none option for rustLibraries when user wants additional libraries only", () => {
      const options = TECH_OPTIONS.rustLibraries;
      const noneOption = options.find((o) => o.id === "none");
      expect(noneOption).toBeDefined();
      expect(noneOption?.default).toBe(false);
      expect(noneOption?.name).toBe("No Additional Libraries");
    });

    it("should have Validator option for rustLibraries", () => {
      const options = TECH_OPTIONS.rustLibraries;
      const validatorOption = options.find((o) => o.id === "validator");
      expect(validatorOption).toBeDefined();
      expect(validatorOption?.default).toBe(false);
      expect(validatorOption?.name).toBe("Validator");
      expect(validatorOption?.description).toContain("validation");
    });

    it("should have jsonwebtoken option for rustLibraries", () => {
      const options = TECH_OPTIONS.rustLibraries;
      const jwtOption = options.find((o) => o.id === "jsonwebtoken");
      expect(jwtOption).toBeDefined();
      expect(jwtOption?.default).toBe(false);
      expect(jwtOption?.name).toBe("jsonwebtoken");
      expect(jwtOption?.description).toContain("JWT");
    });

    it("should have argon2 option for rustLibraries", () => {
      const options = TECH_OPTIONS.rustLibraries;
      const argon2Option = options.find((o) => o.id === "argon2");
      expect(argon2Option).toBeDefined();
      expect(argon2Option?.default).toBe(false);
      expect(argon2Option?.name).toBe("Argon2");
      expect(argon2Option?.description).toContain("password hashing");
    });
  });

  describe("DEFAULT_STACK", () => {
    it("should have ecosystem set to typescript by default", () => {
      expect(DEFAULT_STACK.ecosystem).toBe("typescript");
    });

    it("should have rust fields with default values", () => {
      expect(DEFAULT_STACK.rustWebFramework).toBe("axum");
      expect(DEFAULT_STACK.rustFrontend).toBe("none");
      expect(DEFAULT_STACK.rustOrm).toBe("sea-orm");
      expect(DEFAULT_STACK.rustApi).toBe("none");
      expect(DEFAULT_STACK.rustCli).toBe("none");
      expect(DEFAULT_STACK.rustLibraries).toBe("serde");
    });

    it("should have serde as the default for rustLibraries", () => {
      expect(DEFAULT_STACK.rustLibraries).toBe("serde");
    });
  });

  describe("StackState type", () => {
    it("should include ecosystem field", () => {
      const stack: Partial<StackState> = {
        ecosystem: "rust",
      };
      expect(stack.ecosystem).toBe("rust");
    });

    it("should include all rust fields", () => {
      const stack: Partial<StackState> = {
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: "none",
      };
      expect(stack.rustWebFramework).toBe("none");
      expect(stack.rustFrontend).toBe("none");
      expect(stack.rustOrm).toBe("none");
      expect(stack.rustApi).toBe("none");
      expect(stack.rustCli).toBe("none");
      expect(stack.rustLibraries).toBe("none");
    });
  });

  describe("Category Order", () => {
    it("TYPESCRIPT_CATEGORY_ORDER should not contain rust categories", () => {
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("rustWebFramework");
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("rustFrontend");
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("rustOrm");
    });

    it("RUST_CATEGORY_ORDER should contain rust categories", () => {
      expect(RUST_CATEGORY_ORDER).toContain("rustWebFramework");
      expect(RUST_CATEGORY_ORDER).toContain("rustFrontend");
      expect(RUST_CATEGORY_ORDER).toContain("rustOrm");
      expect(RUST_CATEGORY_ORDER).toContain("rustApi");
      expect(RUST_CATEGORY_ORDER).toContain("rustCli");
      expect(RUST_CATEGORY_ORDER).toContain("rustLibraries");
    });

    it("RUST_CATEGORY_ORDER should contain git and install", () => {
      expect(RUST_CATEGORY_ORDER).toContain("git");
      expect(RUST_CATEGORY_ORDER).toContain("install");
    });

    it("CATEGORY_ORDER should contain all categories", () => {
      // TypeScript categories
      expect(CATEGORY_ORDER).toContain("webFrontend");
      expect(CATEGORY_ORDER).toContain("backend");
      expect(CATEGORY_ORDER).toContain("database");

      // Rust categories
      expect(CATEGORY_ORDER).toContain("rustWebFramework");
      expect(CATEGORY_ORDER).toContain("rustFrontend");
    });
  });

  describe("getCategoryDisplayName", () => {
    it("should return correct display name for rust categories", () => {
      expect(getCategoryDisplayName("rustWebFramework")).toBe("Rust Web Framework");
      expect(getCategoryDisplayName("rustFrontend")).toBe("Rust Frontend (WASM)");
      expect(getCategoryDisplayName("rustOrm")).toBe("Rust ORM / Database");
      expect(getCategoryDisplayName("rustApi")).toBe("Rust API Layer");
      expect(getCategoryDisplayName("rustCli")).toBe("Rust CLI Tools");
      expect(getCategoryDisplayName("rustLibraries")).toBe("Rust Core Libraries");
    });

    it("should return camelCase conversion for other categories", () => {
      expect(getCategoryDisplayName("webFrontend")).toBe("Web Frontend");
      expect(getCategoryDisplayName("backend")).toBe("Backend");
    });
  });
});

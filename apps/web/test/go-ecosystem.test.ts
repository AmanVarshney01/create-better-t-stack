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
  GO_CATEGORY_ORDER,
  RUST_CATEGORY_ORDER,
  TYPESCRIPT_CATEGORY_ORDER,
} from "../src/lib/stack-utils";

describe("Go Ecosystem Tab", () => {
  describe("Ecosystem Type", () => {
    it("should have go as a valid ecosystem value", () => {
      const ecosystems: Ecosystem[] = ["typescript", "rust", "python", "go"];
      expect(ecosystems).toContain("go");
    });
  });

  describe("ECOSYSTEMS constant", () => {
    it("should contain Go ecosystem", () => {
      const goEcosystem = ECOSYSTEMS.find((e) => e.id === "go");
      expect(goEcosystem).toBeDefined();
      expect(goEcosystem?.name).toBe("Go");
      expect(goEcosystem?.icon).toContain("go");
      expect(goEcosystem?.description).toBe("High-performance Go ecosystem");
    });

    it("should have exactly 4 ecosystems", () => {
      expect(ECOSYSTEMS).toHaveLength(4);
    });
  });

  describe("ECOSYSTEM_CATEGORIES", () => {
    it("should have categories for go ecosystem", () => {
      expect(ECOSYSTEM_CATEGORIES.go).toBeDefined();
      expect(ECOSYSTEM_CATEGORIES.go.length).toBeGreaterThan(0);
    });

    it("should include go-specific categories in go ecosystem", () => {
      const goCategories = ECOSYSTEM_CATEGORIES.go;
      expect(goCategories).toContain("goWebFramework");
      expect(goCategories).toContain("goOrm");
      expect(goCategories).toContain("goApi");
      expect(goCategories).toContain("goCli");
      expect(goCategories).toContain("goLogging");
    });

    it("should include git and install in go ecosystem", () => {
      const goCategories = ECOSYSTEM_CATEGORIES.go;
      expect(goCategories).toContain("git");
      expect(goCategories).toContain("install");
    });

    it("should NOT include go categories in typescript ecosystem", () => {
      const tsCategories = ECOSYSTEM_CATEGORIES.typescript;
      expect(tsCategories).not.toContain("goWebFramework");
      expect(tsCategories).not.toContain("goOrm");
      expect(tsCategories).not.toContain("goApi");
    });

    it("should NOT include go categories in rust ecosystem", () => {
      const rustCategories = ECOSYSTEM_CATEGORIES.rust;
      expect(rustCategories).not.toContain("goWebFramework");
      expect(rustCategories).not.toContain("goOrm");
    });
  });

  describe("TECH_OPTIONS - Go Categories", () => {
    const goCategories: TechCategory[] = ["goWebFramework", "goOrm", "goApi", "goCli", "goLogging"];

    for (const category of goCategories) {
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

    it("should have Gin as default for goWebFramework", () => {
      const options = TECH_OPTIONS.goWebFramework;
      const ginOption = options.find((o) => o.id === "gin");
      expect(ginOption).toBeDefined();
      expect(ginOption?.default).toBe(true);
      expect(ginOption?.name).toBe("Gin");
      expect(ginOption?.description).toContain("HTTP web framework");
    });

    it("should have Echo option for goWebFramework", () => {
      const options = TECH_OPTIONS.goWebFramework;
      const echoOption = options.find((o) => o.id === "echo");
      expect(echoOption).toBeDefined();
      expect(echoOption?.name).toBe("Echo");
      expect(echoOption?.description).toContain("minimalist");
    });

    it("should have GORM as default for goOrm", () => {
      const options = TECH_OPTIONS.goOrm;
      const gormOption = options.find((o) => o.id === "gorm");
      expect(gormOption).toBeDefined();
      expect(gormOption?.default).toBe(true);
      expect(gormOption?.name).toBe("GORM");
      expect(gormOption?.description).toContain("ORM library");
    });

    it("should have sqlc option for goOrm", () => {
      const options = TECH_OPTIONS.goOrm;
      const sqlcOption = options.find((o) => o.id === "sqlc");
      expect(sqlcOption).toBeDefined();
      expect(sqlcOption?.name).toBe("sqlc");
      expect(sqlcOption?.description).toContain("type-safe");
    });

    it("should have gRPC-Go option for goApi", () => {
      const options = TECH_OPTIONS.goApi;
      const grpcOption = options.find((o) => o.id === "grpc-go");
      expect(grpcOption).toBeDefined();
      expect(grpcOption?.name).toBe("gRPC-Go");
      expect(grpcOption?.description).toContain("gRPC");
    });

    it("should have Cobra option for goCli", () => {
      const options = TECH_OPTIONS.goCli;
      const cobraOption = options.find((o) => o.id === "cobra");
      expect(cobraOption).toBeDefined();
      expect(cobraOption?.name).toBe("Cobra");
      expect(cobraOption?.description).toContain("CLI");
    });

    it("should have Bubble Tea option for goCli", () => {
      const options = TECH_OPTIONS.goCli;
      const bubbleTeaOption = options.find((o) => o.id === "bubbletea");
      expect(bubbleTeaOption).toBeDefined();
      expect(bubbleTeaOption?.name).toBe("Bubble Tea");
      expect(bubbleTeaOption?.description).toContain("TUI");
    });

    it("should have Zap as default for goLogging", () => {
      const options = TECH_OPTIONS.goLogging;
      const zapOption = options.find((o) => o.id === "zap");
      expect(zapOption).toBeDefined();
      expect(zapOption?.default).toBe(true);
      expect(zapOption?.name).toBe("Zap");
      expect(zapOption?.description).toContain("logging");
    });
  });

  describe("DEFAULT_STACK", () => {
    it("should have go fields with default values", () => {
      expect(DEFAULT_STACK.goWebFramework).toBe("gin");
      expect(DEFAULT_STACK.goOrm).toBe("gorm");
      expect(DEFAULT_STACK.goApi).toBe("none");
      expect(DEFAULT_STACK.goCli).toBe("none");
      expect(DEFAULT_STACK.goLogging).toBe("zap");
    });

    it("should have gin as the default for goWebFramework", () => {
      expect(DEFAULT_STACK.goWebFramework).toBe("gin");
    });

    it("should have gorm as the default for goOrm", () => {
      expect(DEFAULT_STACK.goOrm).toBe("gorm");
    });

    it("should have zap as the default for goLogging", () => {
      expect(DEFAULT_STACK.goLogging).toBe("zap");
    });
  });

  describe("StackState type", () => {
    it("should include ecosystem field with go", () => {
      const stack: Partial<StackState> = {
        ecosystem: "go",
      };
      expect(stack.ecosystem).toBe("go");
    });

    it("should include all go fields", () => {
      const stack: Partial<StackState> = {
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      };
      expect(stack.goWebFramework).toBe("gin");
      expect(stack.goOrm).toBe("gorm");
      expect(stack.goApi).toBe("none");
      expect(stack.goCli).toBe("none");
      expect(stack.goLogging).toBe("zap");
    });
  });

  describe("Category Order", () => {
    it("TYPESCRIPT_CATEGORY_ORDER should not contain go categories", () => {
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("goWebFramework");
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("goOrm");
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("goApi");
    });

    it("RUST_CATEGORY_ORDER should not contain go categories", () => {
      expect(RUST_CATEGORY_ORDER).not.toContain("goWebFramework");
      expect(RUST_CATEGORY_ORDER).not.toContain("goOrm");
    });

    it("GO_CATEGORY_ORDER should contain go categories", () => {
      expect(GO_CATEGORY_ORDER).toContain("goWebFramework");
      expect(GO_CATEGORY_ORDER).toContain("goOrm");
      expect(GO_CATEGORY_ORDER).toContain("goApi");
      expect(GO_CATEGORY_ORDER).toContain("goCli");
      expect(GO_CATEGORY_ORDER).toContain("goLogging");
    });

    it("GO_CATEGORY_ORDER should contain git and install", () => {
      expect(GO_CATEGORY_ORDER).toContain("git");
      expect(GO_CATEGORY_ORDER).toContain("install");
    });

    it("CATEGORY_ORDER should contain all categories including go", () => {
      // TypeScript categories
      expect(CATEGORY_ORDER).toContain("webFrontend");
      expect(CATEGORY_ORDER).toContain("backend");
      expect(CATEGORY_ORDER).toContain("database");

      // Go categories
      expect(CATEGORY_ORDER).toContain("goWebFramework");
      expect(CATEGORY_ORDER).toContain("goOrm");
      expect(CATEGORY_ORDER).toContain("goApi");
      expect(CATEGORY_ORDER).toContain("goCli");
      expect(CATEGORY_ORDER).toContain("goLogging");
    });
  });

  describe("getCategoryDisplayName", () => {
    it("should return correct display name for go categories", () => {
      expect(getCategoryDisplayName("goWebFramework")).toBe("Go Web Framework");
      expect(getCategoryDisplayName("goOrm")).toBe("Go ORM / Database");
      expect(getCategoryDisplayName("goApi")).toBe("Go API Layer");
      expect(getCategoryDisplayName("goCli")).toBe("Go CLI Tools");
      expect(getCategoryDisplayName("goLogging")).toBe("Go Logging");
    });

    it("should return camelCase conversion for other categories", () => {
      expect(getCategoryDisplayName("webFrontend")).toBe("Web Frontend");
      expect(getCategoryDisplayName("backend")).toBe("Backend");
    });
  });
});

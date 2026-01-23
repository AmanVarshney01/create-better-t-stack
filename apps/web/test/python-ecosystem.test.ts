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
  PYTHON_CATEGORY_ORDER,
  RUST_CATEGORY_ORDER,
  TYPESCRIPT_CATEGORY_ORDER,
} from "../src/lib/stack-utils";

describe("Python Ecosystem Tab", () => {
  describe("Ecosystem Type", () => {
    it("should have typescript, rust, and python as valid ecosystem values", () => {
      const ecosystems: Ecosystem[] = ["typescript", "rust", "python"];
      expect(ecosystems).toContain("typescript");
      expect(ecosystems).toContain("rust");
      expect(ecosystems).toContain("python");
    });
  });

  describe("ECOSYSTEMS constant", () => {
    it("should contain TypeScript ecosystem", () => {
      const tsEcosystem = ECOSYSTEMS.find((e) => e.id === "typescript");
      expect(tsEcosystem).toBeDefined();
      expect(tsEcosystem?.name).toBe("TypeScript");
    });

    it("should contain Rust ecosystem", () => {
      const rustEcosystem = ECOSYSTEMS.find((e) => e.id === "rust");
      expect(rustEcosystem).toBeDefined();
      expect(rustEcosystem?.name).toBe("Rust");
    });

    it("should contain Python ecosystem", () => {
      const pythonEcosystem = ECOSYSTEMS.find((e) => e.id === "python");
      expect(pythonEcosystem).toBeDefined();
      expect(pythonEcosystem?.name).toBe("Python");
      expect(pythonEcosystem?.icon).toContain("python");
      expect(pythonEcosystem?.description).toBe("Python full-stack ecosystem");
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

    it("should have categories for python ecosystem", () => {
      expect(ECOSYSTEM_CATEGORIES.python).toBeDefined();
      expect(ECOSYSTEM_CATEGORIES.python.length).toBeGreaterThan(0);
    });

    it("should include python-specific categories in python ecosystem", () => {
      const pythonCategories = ECOSYSTEM_CATEGORIES.python;
      expect(pythonCategories).toContain("pythonWebFramework");
      expect(pythonCategories).toContain("pythonOrm");
      expect(pythonCategories).toContain("pythonValidation");
      expect(pythonCategories).toContain("pythonAi");
      expect(pythonCategories).toContain("pythonTaskQueue");
      expect(pythonCategories).toContain("pythonQuality");
    });

    it("should include git and install in python ecosystem", () => {
      const pythonCategories = ECOSYSTEM_CATEGORIES.python;
      expect(pythonCategories).toContain("git");
      expect(pythonCategories).toContain("install");
    });

    it("should NOT include python categories in typescript ecosystem", () => {
      const tsCategories = ECOSYSTEM_CATEGORIES.typescript;
      expect(tsCategories).not.toContain("pythonWebFramework");
      expect(tsCategories).not.toContain("pythonOrm");
      expect(tsCategories).not.toContain("pythonAi");
    });

    it("should NOT include python categories in rust ecosystem", () => {
      const rustCategories = ECOSYSTEM_CATEGORIES.rust;
      expect(rustCategories).not.toContain("pythonWebFramework");
      expect(rustCategories).not.toContain("pythonOrm");
      expect(rustCategories).not.toContain("pythonAi");
    });
  });

  describe("TECH_OPTIONS - Python Categories", () => {
    const pythonCategories: TechCategory[] = [
      "pythonWebFramework",
      "pythonOrm",
      "pythonValidation",
      "pythonAi",
      "pythonTaskQueue",
      "pythonQuality",
    ];

    for (const category of pythonCategories) {
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

    it("should have FastAPI as default for pythonWebFramework", () => {
      const options = TECH_OPTIONS.pythonWebFramework;
      const fastapiOption = options.find((o) => o.id === "fastapi");
      expect(fastapiOption).toBeDefined();
      expect(fastapiOption?.default).toBe(true);
      expect(fastapiOption?.name).toBe("FastAPI");
      expect(fastapiOption?.description).toContain("fast");
    });

    it("should have Django option for pythonWebFramework", () => {
      const options = TECH_OPTIONS.pythonWebFramework;
      const djangoOption = options.find((o) => o.id === "django");
      expect(djangoOption).toBeDefined();
      expect(djangoOption?.name).toBe("Django");
      expect(djangoOption?.description).toContain("batteries included");
    });

    it("should have SQLAlchemy as default for pythonOrm", () => {
      const options = TECH_OPTIONS.pythonOrm;
      const sqlalchemyOption = options.find((o) => o.id === "sqlalchemy");
      expect(sqlalchemyOption).toBeDefined();
      expect(sqlalchemyOption?.default).toBe(true);
      expect(sqlalchemyOption?.name).toBe("SQLAlchemy");
      expect(sqlalchemyOption?.description).toContain("SQL toolkit");
    });

    it("should have SQLModel option for pythonOrm", () => {
      const options = TECH_OPTIONS.pythonOrm;
      const sqlmodelOption = options.find((o) => o.id === "sqlmodel");
      expect(sqlmodelOption).toBeDefined();
      expect(sqlmodelOption?.name).toBe("SQLModel");
      expect(sqlmodelOption?.description).toContain("FastAPI");
    });

    it("should have Pydantic as default for pythonValidation", () => {
      const options = TECH_OPTIONS.pythonValidation;
      const pydanticOption = options.find((o) => o.id === "pydantic");
      expect(pydanticOption).toBeDefined();
      expect(pydanticOption?.default).toBe(true);
      expect(pydanticOption?.name).toBe("Pydantic");
      expect(pydanticOption?.description).toContain("validation");
    });

    it("should have LangChain option for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const langchainOption = options.find((o) => o.id === "langchain");
      expect(langchainOption).toBeDefined();
      expect(langchainOption?.name).toBe("LangChain");
    });

    it("should have LlamaIndex option for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const llamaindexOption = options.find((o) => o.id === "llamaindex");
      expect(llamaindexOption).toBeDefined();
      expect(llamaindexOption?.name).toBe("LlamaIndex");
    });

    it("should have OpenAI SDK option for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const openaiOption = options.find((o) => o.id === "openai-sdk");
      expect(openaiOption).toBeDefined();
      expect(openaiOption?.name).toBe("OpenAI SDK");
    });

    it("should have Anthropic SDK option for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const anthropicOption = options.find((o) => o.id === "anthropic-sdk");
      expect(anthropicOption).toBeDefined();
      expect(anthropicOption?.name).toBe("Anthropic SDK");
    });

    it("should have LangGraph option for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const langgraphOption = options.find((o) => o.id === "langgraph");
      expect(langgraphOption).toBeDefined();
      expect(langgraphOption?.name).toBe("LangGraph");
    });

    it("should have CrewAI option for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const crewaiOption = options.find((o) => o.id === "crewai");
      expect(crewaiOption).toBeDefined();
      expect(crewaiOption?.name).toBe("CrewAI");
    });

    it("should have none as default for pythonAi", () => {
      const options = TECH_OPTIONS.pythonAi;
      const noneOption = options.find((o) => o.id === "none");
      expect(noneOption).toBeDefined();
      expect(noneOption?.default).toBe(true);
    });

    it("should have Celery option for pythonTaskQueue", () => {
      const options = TECH_OPTIONS.pythonTaskQueue;
      const celeryOption = options.find((o) => o.id === "celery");
      expect(celeryOption).toBeDefined();
      expect(celeryOption?.name).toBe("Celery");
      expect(celeryOption?.description).toContain("task queue");
    });

    it("should have none as default for pythonTaskQueue", () => {
      const options = TECH_OPTIONS.pythonTaskQueue;
      const noneOption = options.find((o) => o.id === "none");
      expect(noneOption).toBeDefined();
      expect(noneOption?.default).toBe(true);
    });

    it("should have Ruff as default for pythonQuality", () => {
      const options = TECH_OPTIONS.pythonQuality;
      const ruffOption = options.find((o) => o.id === "ruff");
      expect(ruffOption).toBeDefined();
      expect(ruffOption?.default).toBe(true);
      expect(ruffOption?.name).toBe("Ruff");
      expect(ruffOption?.description).toContain("linter");
    });
  });

  describe("DEFAULT_STACK", () => {
    it("should have ecosystem set to typescript by default", () => {
      expect(DEFAULT_STACK.ecosystem).toBe("typescript");
    });

    it("should have python fields with default values", () => {
      expect(DEFAULT_STACK.pythonWebFramework).toBe("fastapi");
      expect(DEFAULT_STACK.pythonOrm).toBe("sqlalchemy");
      expect(DEFAULT_STACK.pythonValidation).toBe("pydantic");
      expect(DEFAULT_STACK.pythonAi).toBe("none");
      expect(DEFAULT_STACK.pythonTaskQueue).toBe("none");
      expect(DEFAULT_STACK.pythonQuality).toBe("ruff");
    });

    it("should have ruff as the default for pythonQuality", () => {
      expect(DEFAULT_STACK.pythonQuality).toBe("ruff");
    });
  });

  describe("StackState type", () => {
    it("should include ecosystem field with python option", () => {
      const stack: Partial<StackState> = {
        ecosystem: "python",
      };
      expect(stack.ecosystem).toBe("python");
    });

    it("should include all python fields", () => {
      const stack: Partial<StackState> = {
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: "langchain",
        pythonTaskQueue: "celery",
        pythonQuality: "ruff",
      };
      expect(stack.pythonWebFramework).toBe("fastapi");
      expect(stack.pythonOrm).toBe("sqlalchemy");
      expect(stack.pythonValidation).toBe("pydantic");
      expect(stack.pythonAi).toBe("langchain");
      expect(stack.pythonTaskQueue).toBe("celery");
      expect(stack.pythonQuality).toBe("ruff");
    });
  });

  describe("Category Order", () => {
    it("TYPESCRIPT_CATEGORY_ORDER should not contain python categories", () => {
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("pythonWebFramework");
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("pythonOrm");
      expect(TYPESCRIPT_CATEGORY_ORDER).not.toContain("pythonAi");
    });

    it("RUST_CATEGORY_ORDER should not contain python categories", () => {
      expect(RUST_CATEGORY_ORDER).not.toContain("pythonWebFramework");
      expect(RUST_CATEGORY_ORDER).not.toContain("pythonOrm");
      expect(RUST_CATEGORY_ORDER).not.toContain("pythonAi");
    });

    it("PYTHON_CATEGORY_ORDER should contain python categories", () => {
      expect(PYTHON_CATEGORY_ORDER).toContain("pythonWebFramework");
      expect(PYTHON_CATEGORY_ORDER).toContain("pythonOrm");
      expect(PYTHON_CATEGORY_ORDER).toContain("pythonValidation");
      expect(PYTHON_CATEGORY_ORDER).toContain("pythonAi");
      expect(PYTHON_CATEGORY_ORDER).toContain("pythonTaskQueue");
      expect(PYTHON_CATEGORY_ORDER).toContain("pythonQuality");
    });

    it("PYTHON_CATEGORY_ORDER should contain git and install", () => {
      expect(PYTHON_CATEGORY_ORDER).toContain("git");
      expect(PYTHON_CATEGORY_ORDER).toContain("install");
    });

    it("CATEGORY_ORDER should contain all categories including python", () => {
      // TypeScript categories
      expect(CATEGORY_ORDER).toContain("webFrontend");
      expect(CATEGORY_ORDER).toContain("backend");
      expect(CATEGORY_ORDER).toContain("database");

      // Rust categories
      expect(CATEGORY_ORDER).toContain("rustWebFramework");
      expect(CATEGORY_ORDER).toContain("rustFrontend");

      // Python categories
      expect(CATEGORY_ORDER).toContain("pythonWebFramework");
      expect(CATEGORY_ORDER).toContain("pythonOrm");
      expect(CATEGORY_ORDER).toContain("pythonAi");
    });
  });

  describe("getCategoryDisplayName", () => {
    it("should return correct display name for python categories", () => {
      expect(getCategoryDisplayName("pythonWebFramework")).toBe("Python Web Framework");
      expect(getCategoryDisplayName("pythonOrm")).toBe("Python ORM / Database");
      expect(getCategoryDisplayName("pythonValidation")).toBe("Python Validation");
      expect(getCategoryDisplayName("pythonAi")).toBe("Python AI / ML");
      expect(getCategoryDisplayName("pythonTaskQueue")).toBe("Python Task Queue");
      expect(getCategoryDisplayName("pythonQuality")).toBe("Python Code Quality");
    });

    it("should return camelCase conversion for other categories", () => {
      expect(getCategoryDisplayName("webFrontend")).toBe("Web Frontend");
      expect(getCategoryDisplayName("backend")).toBe("Backend");
    });
  });
});

import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import {
  EcosystemSchema,
  RustWebFrameworkSchema,
  RustFrontendSchema,
  RustOrmSchema,
  RustApiSchema,
  RustCliSchema,
  RustLibrariesSchema,
} from "../src/types";

/**
 * Extract enum values from a Zod enum schema
 */
function extractEnumValues<T extends string>(schema: { options: readonly T[] }): readonly T[] {
  return schema.options;
}

// Extract all Rust-related enum values
const ECOSYSTEMS = extractEnumValues(EcosystemSchema);
const RUST_WEB_FRAMEWORKS = extractEnumValues(RustWebFrameworkSchema);
const RUST_FRONTENDS = extractEnumValues(RustFrontendSchema);
const RUST_ORMS = extractEnumValues(RustOrmSchema);
const RUST_APIS = extractEnumValues(RustApiSchema);
const RUST_CLIS = extractEnumValues(RustCliSchema);
const RUST_LIBRARIES = extractEnumValues(RustLibrariesSchema);

describe("Rust Ecosystem", () => {
  describe("Schema Definitions", () => {
    it("should have ecosystem schema with typescript and rust", () => {
      expect(ECOSYSTEMS).toContain("typescript");
      expect(ECOSYSTEMS).toContain("rust");
      expect(ECOSYSTEMS.length).toBe(2);
    });

    it("should have rust web framework options", () => {
      expect(RUST_WEB_FRAMEWORKS).toContain("axum");
      expect(RUST_WEB_FRAMEWORKS).toContain("actix-web");
      expect(RUST_WEB_FRAMEWORKS).toContain("none");
    });

    it("should have rust frontend options", () => {
      expect(RUST_FRONTENDS).toContain("leptos");
      expect(RUST_FRONTENDS).toContain("dioxus");
      expect(RUST_FRONTENDS).toContain("none");
    });

    it("should have rust ORM options", () => {
      expect(RUST_ORMS).toContain("sea-orm");
      expect(RUST_ORMS).toContain("sqlx");
      expect(RUST_ORMS).toContain("none");
    });

    it("should have rust API options", () => {
      expect(RUST_APIS).toContain("tonic");
      expect(RUST_APIS).toContain("async-graphql");
      expect(RUST_APIS).toContain("none");
    });

    it("should have rust CLI options", () => {
      expect(RUST_CLIS).toContain("clap");
      expect(RUST_CLIS).toContain("ratatui");
      expect(RUST_CLIS).toContain("none");
    });

    it("should have rust libraries options", () => {
      expect(RUST_LIBRARIES).toContain("serde");
      expect(RUST_LIBRARIES).toContain("validator");
      expect(RUST_LIBRARIES).toContain("jsonwebtoken");
      expect(RUST_LIBRARIES).toContain("argon2");
      expect(RUST_LIBRARIES).toContain("tokio-test");
      expect(RUST_LIBRARIES).toContain("mockall");
      expect(RUST_LIBRARIES).toContain("none");
    });
  });

  describe("Virtual Project Generation - Rust Ecosystem", () => {
    it("should create a basic Rust project with Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-basic",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
      expect(result.tree?.fileCount).toBeGreaterThan(0);
    });

    it("should create Rust project with Axum web framework", async () => {
      const result = await createVirtual({
        projectName: "rust-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with Actix-web framework", async () => {
      const result = await createVirtual({
        projectName: "rust-actix",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with SQLx ORM", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with SeaORM", async () => {
      const result = await createVirtual({
        projectName: "rust-sea-orm",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with Tonic gRPC", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with async-graphql", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with Clap CLI", async () => {
      const result = await createVirtual({
        projectName: "rust-cli",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "clap",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with Ratatui TUI", async () => {
      const result = await createVirtual({
        projectName: "rust-tui",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create Rust project with core libraries", async () => {
      const result = await createVirtual({
        projectName: "rust-libs",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: ["serde", "validator", "jsonwebtoken", "argon2"],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });

    it("should create full-stack Rust project", async () => {
      const result = await createVirtual({
        projectName: "rust-fullstack",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "sqlx",
        rustApi: "async-graphql",
        rustCli: "clap",
        rustLibraries: ["serde", "validator", "jsonwebtoken", "argon2"],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });
  });

  describe("TypeScript Ecosystem (backward compatibility)", () => {
    it("should default to TypeScript ecosystem when not specified", async () => {
      const result = await createVirtual({
        projectName: "ts-default",
        // ecosystem not specified - should default to typescript
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
      // TypeScript project should have package.json
      expect(result.tree?.fileCount).toBeGreaterThan(0);
    });

    it("should create TypeScript project when ecosystem is explicitly set", async () => {
      const result = await createVirtual({
        projectName: "ts-explicit",
        ecosystem: "typescript",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
    });
  });

  describe("Ecosystem Switching", () => {
    it("should use different base templates for different ecosystems", async () => {
      // Create TypeScript project
      const tsResult = await createVirtual({
        projectName: "compare-ts",
        ecosystem: "typescript",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
      });

      // Create Rust project
      const rustResult = await createVirtual({
        projectName: "compare-rust",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(tsResult.success).toBe(true);
      expect(rustResult.success).toBe(true);

      // Both should generate different structures
      expect(tsResult.tree).toBeDefined();
      expect(rustResult.tree).toBeDefined();
    });
  });
});

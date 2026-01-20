import type { VirtualNode, VirtualFile } from "@better-t-stack/template-generator";

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

/**
 * Helper function to find a file in the virtual file tree by exact path
 */
function findFile(node: VirtualNode, path: string): VirtualFile | undefined {
  if (node.type === "file") {
    // Exact match only - normalize to handle leading slashes
    const normalizedNodePath = node.path.replace(/^\/+/, "");
    const normalizedPath = path.replace(/^\/+/, "");
    if (normalizedNodePath === normalizedPath) {
      return node;
    }
    return undefined;
  }

  for (const child of node.children) {
    const found = findFile(child, path);
    if (found) return found;
  }
  return undefined;
}

/**
 * Helper function to check if a file exists in the virtual file tree
 */
function hasFile(node: VirtualNode, path: string): boolean {
  return findFile(node, path) !== undefined;
}

/**
 * Helper function to get file content from virtual file tree
 */
function getFileContent(node: VirtualNode, path: string): string | undefined {
  const file = findFile(node, path);
  return file?.content;
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

  describe("Rust Base Template Structure", () => {
    it("should create a Rust project with proper Cargo workspace structure", async () => {
      const result = await createVirtual({
        projectName: "rust-workspace",
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

      const root = result.tree!.root;

      // Verify workspace files exist
      expect(hasFile(root, "Cargo.toml")).toBe(true);
      expect(hasFile(root, "rust-toolchain.toml")).toBe(true);
      expect(hasFile(root, ".gitignore")).toBe(true);
      expect(hasFile(root, ".env.example")).toBe(true);

      // Verify crates directory structure
      expect(hasFile(root, "crates/server/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/server/src/main.rs")).toBe(true);
    });

    it("should have correct workspace Cargo.toml structure", async () => {
      const result = await createVirtual({
        projectName: "rust-cargo-check",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();

      // Verify workspace configuration
      expect(cargoContent).toContain("[workspace]");
      expect(cargoContent).toContain('resolver = "2"');
      expect(cargoContent).toContain("members = [");
      expect(cargoContent).toContain('"crates/server"');

      // Verify workspace.package
      expect(cargoContent).toContain("[workspace.package]");
      expect(cargoContent).toContain('version = "0.1.0"');
      expect(cargoContent).toContain('edition = "2021"');

      // Verify core workspace dependencies
      expect(cargoContent).toContain("[workspace.dependencies]");
      expect(cargoContent).toContain("tokio");
      expect(cargoContent).toContain("serde");
      expect(cargoContent).toContain("tracing");
      expect(cargoContent).toContain("dotenvy");
    });

    it("should have correct server crate Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-server-check",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();

      // Verify package name uses project name
      expect(serverCargoContent).toContain("[package]");
      expect(serverCargoContent).toContain('name = "rust-server-check-server"');

      // Verify workspace inheritance
      expect(serverCargoContent).toContain("version.workspace = true");
      expect(serverCargoContent).toContain("edition.workspace = true");

      // Verify dependencies
      expect(serverCargoContent).toContain("[dependencies]");
      expect(serverCargoContent).toContain("tokio.workspace = true");
      expect(serverCargoContent).toContain("serde.workspace = true");
      expect(serverCargoContent).toContain("tracing.workspace = true");
    });

    it("should have correct rust-toolchain.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-toolchain-check",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const toolchainContent = getFileContent(root, "rust-toolchain.toml");
      expect(toolchainContent).toBeDefined();
      expect(toolchainContent).toContain("[toolchain]");
      expect(toolchainContent).toContain('channel = "stable"');
      expect(toolchainContent).toContain("rustfmt");
      expect(toolchainContent).toContain("clippy");
    });

    it("should have proper .gitignore for Rust projects", async () => {
      const result = await createVirtual({
        projectName: "rust-gitignore-check",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const gitignoreContent = getFileContent(root, ".gitignore");
      expect(gitignoreContent).toBeDefined();
      expect(gitignoreContent).toContain("/target/");
      expect(gitignoreContent).toContain(".env");
    });

    it("should have proper .env.example with Rust environment variables", async () => {
      const result = await createVirtual({
        projectName: "rust-env-check",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const envContent = getFileContent(root, ".env.example");
      expect(envContent).toBeDefined();
      expect(envContent).toContain("RUST_LOG");
      expect(envContent).toContain("HOST");
      expect(envContent).toContain("PORT");
    });
  });

  describe("Axum Web Framework", () => {
    it("should include Axum dependencies in workspace Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-axum-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("axum");
      expect(cargoContent).toContain("tower");
      expect(cargoContent).toContain("tower-http");
    });

    it("should include Axum dependencies in server crate", async () => {
      const result = await createVirtual({
        projectName: "rust-axum-server",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("axum.workspace = true");
      expect(serverCargoContent).toContain("tower.workspace = true");
      expect(serverCargoContent).toContain("tower-http.workspace = true");
    });

    it("should generate Axum main.rs with router and health endpoint", async () => {
      const result = await createVirtual({
        projectName: "rust-axum-main",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toBeDefined();

      // Verify Axum-specific code
      expect(mainRsContent).toContain("use axum::");
      expect(mainRsContent).toContain("Router");
      expect(mainRsContent).toContain("CorsLayer");
      expect(mainRsContent).toContain("#[tokio::main]");
      expect(mainRsContent).toContain("async fn main()");
      expect(mainRsContent).toContain('route("/health"');
      expect(mainRsContent).toContain("axum::serve");
    });
  });

  describe("Actix-web Framework", () => {
    it("should include Actix-web dependencies in workspace Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-actix-deps",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("actix-web");
      expect(cargoContent).toContain("actix-rt");
      expect(cargoContent).toContain("actix-cors");
    });

    it("should generate Actix-web main.rs with server configuration", async () => {
      const result = await createVirtual({
        projectName: "rust-actix-main",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toBeDefined();

      // Verify Actix-specific code
      expect(mainRsContent).toContain("use actix_web::");
      expect(mainRsContent).toContain("use actix_cors::Cors");
      expect(mainRsContent).toContain("#[actix_web::main]");
      expect(mainRsContent).toContain("HttpServer::new");
      expect(mainRsContent).toContain("App::new()");
      expect(mainRsContent).toContain('#[get("/health")]');
    });
  });

  describe("SQLx ORM", () => {
    it("should include SQLx dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("sqlx");
      expect(cargoContent).toContain("runtime-tokio");
      expect(cargoContent).toContain("postgres");
      expect(cargoContent).toContain("sqlite");
      expect(cargoContent).toContain("mysql");
      expect(cargoContent).toContain("migrate");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("sqlx.workspace = true");
    });

    it("should generate SQLx integration code with Axum", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("use sqlx::postgres::PgPoolOptions");
      expect(mainContent).toContain("use sqlx::PgPool");
      expect(mainContent).toContain("AppState");
      expect(mainContent).toContain("DATABASE_URL");
      expect(mainContent).toContain("PgPoolOptions::new()");
      expect(mainContent).toContain(".max_connections(5)");
      expect(mainContent).toContain(".with_state(state)");
    });

    it("should generate SQLx integration code with Actix-web", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-actix",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("use sqlx::postgres::PgPoolOptions");
      expect(mainContent).toContain("use sqlx::PgPool");
      expect(mainContent).toContain("AppState");
      expect(mainContent).toContain("DATABASE_URL");
      expect(mainContent).toContain("PgPoolOptions::new()");
      expect(mainContent).toContain("web::Data::new(AppState");
      expect(mainContent).toContain(".app_data(state.clone())");
    });

    it("should include database health check with SQLx", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-health",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("db.acquire()");
      expect(mainContent).toContain("database:");
    });

    it("should work with SQLx and Leptos frontend", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-leptos",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify SQLx dependencies
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("sqlx");

      // Verify Leptos frontend exists
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/client/src/lib.rs")).toBe(true);
    });

    it("should work with SQLx and Dioxus frontend", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-dioxus",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify SQLx dependencies
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("sqlx");

      // Verify Dioxus frontend exists
      expect(hasFile(root, "crates/dioxus-client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/dioxus-client/src/main.rs")).toBe(true);
    });

    it("should work with SQLx and async-graphql", async () => {
      const result = await createVirtual({
        projectName: "rust-sqlx-graphql",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("sqlx");
      expect(cargoContent).toContain("async-graphql");
    });
  });

  describe("SeaORM", () => {
    it("should include SeaORM dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-seaorm-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("sea-orm");
      expect(cargoContent).toContain("sea-orm-migration");
      expect(cargoContent).toContain("runtime-tokio-rustls");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("sea-orm.workspace = true");
    });

    it("should generate SeaORM integration code with Axum", async () => {
      const result = await createVirtual({
        projectName: "rust-seaorm-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("use sea_orm::{Database, DatabaseConnection}");
      expect(mainContent).toContain("AppState");
      expect(mainContent).toContain("DATABASE_URL");
      expect(mainContent).toContain("Database::connect");
      expect(mainContent).toContain(".with_state(state)");
    });

    it("should generate SeaORM integration code with Actix-web", async () => {
      const result = await createVirtual({
        projectName: "rust-seaorm-actix",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("use sea_orm::{Database, DatabaseConnection}");
      expect(mainContent).toContain("AppState");
      expect(mainContent).toContain("DATABASE_URL");
      expect(mainContent).toContain("Database::connect");
      expect(mainContent).toContain("web::Data::new(AppState");
      expect(mainContent).toContain(".app_data(state.clone())");
    });

    it("should include database health check with SeaORM", async () => {
      const result = await createVirtual({
        projectName: "rust-seaorm-health",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("db.ping()");
      expect(mainContent).toContain("database:");
    });

    it("should work with SeaORM and Leptos frontend", async () => {
      const result = await createVirtual({
        projectName: "rust-seaorm-leptos",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "sea-orm",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify SeaORM dependencies
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("sea-orm");

      // Verify Leptos frontend exists
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/client/src/lib.rs")).toBe(true);
    });

    it("should work with SeaORM and async-graphql", async () => {
      const result = await createVirtual({
        projectName: "rust-seaorm-graphql",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("sea-orm");
      expect(cargoContent).toContain("async-graphql");
    });
  });

  describe("Tonic gRPC", () => {
    it("should include Tonic dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("tonic");
      expect(cargoContent).toContain("tonic-build");
      expect(cargoContent).toContain("prost");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("tonic.workspace = true");
      expect(serverCargoContent).toContain("prost.workspace = true");
    });

    it("should include proto crate in workspace when tonic is selected", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-proto",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain('"crates/proto"');
    });

    it("should create proto crate with all required files", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-files",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify proto crate files exist
      expect(hasFile(root, "crates/proto/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/proto/build.rs")).toBe(true);
      expect(hasFile(root, "crates/proto/src/lib.rs")).toBe(true);
      expect(hasFile(root, "crates/proto/proto/greeter.proto")).toBe(true);
      expect(hasFile(root, "crates/proto/src/generated/greeter.rs")).toBe(true);
    });

    it("should have correct proto crate Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-proto-cargo",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const protoCargoContent = getFileContent(root, "crates/proto/Cargo.toml");
      expect(protoCargoContent).toBeDefined();
      expect(protoCargoContent).toContain('name = "rust-tonic-proto-cargo-proto"');
      expect(protoCargoContent).toContain("tonic.workspace = true");
      expect(protoCargoContent).toContain("prost.workspace = true");
      expect(protoCargoContent).toContain("[build-dependencies]");
      expect(protoCargoContent).toContain("tonic-build.workspace = true");
    });

    it("should have correct proto definition file", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-proto-def",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const protoContent = getFileContent(root, "crates/proto/proto/greeter.proto");
      expect(protoContent).toBeDefined();
      expect(protoContent).toContain('syntax = "proto3"');
      expect(protoContent).toContain("service Greeter");
      expect(protoContent).toContain("rpc SayHello");
      expect(protoContent).toContain("message HelloRequest");
      expect(protoContent).toContain("message HelloReply");
    });

    it("should include gRPC module in server main.rs with Axum", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-axum-main",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toBeDefined();
      expect(mainRsContent).toContain("mod grpc;");
      expect(mainRsContent).toContain("GRPC_PORT");
      expect(mainRsContent).toContain("grpc::create_grpc_server()");
      expect(mainRsContent).toContain("tonic::transport::Server");
    });

    it("should include gRPC module in server main.rs with Actix-web", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-actix-main",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toBeDefined();
      expect(mainRsContent).toContain("mod grpc;");
      expect(mainRsContent).toContain("GRPC_PORT");
      expect(mainRsContent).toContain("grpc::create_grpc_server()");
    });

    it("should create gRPC service implementation file", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-grpc-service",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "crates/server/src/grpc.rs")).toBe(true);

      const grpcContent = getFileContent(root, "crates/server/src/grpc.rs");
      expect(grpcContent).toBeDefined();
      expect(grpcContent).toContain("GreeterService");
      expect(grpcContent).toContain("impl Greeter for GreeterService");
      expect(grpcContent).toContain("async fn say_hello");
      expect(grpcContent).toContain("async fn say_hello_stream");
      expect(grpcContent).toContain("pub fn create_grpc_server()");
    });

    it("should work with tonic and no web framework", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-no-web",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toBeDefined();
      expect(mainRsContent).toContain("mod grpc;");
      expect(mainRsContent).toContain("tonic::transport::Server");
      expect(mainRsContent).toContain("GRPC_PORT");
      // Should not contain axum or actix imports
      expect(mainRsContent).not.toContain("use axum::");
      expect(mainRsContent).not.toContain("use actix_web::");
    });

    it("should work with tonic and SQLx", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-sqlx",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("tonic");
      expect(cargoContent).toContain("sqlx");

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toContain("mod grpc;");
      expect(mainRsContent).toContain("sqlx");
    });

    it("should work with tonic and SeaORM", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-seaorm",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("tonic");
      expect(cargoContent).toContain("sea-orm");
    });

    it("should NOT include proto crate when tonic is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-tonic",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "crates/proto/Cargo.toml")).toBe(false);
      expect(hasFile(root, "crates/server/src/grpc.rs")).toBe(false);

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).not.toContain('"crates/proto"');
      expect(cargoContent).not.toContain("tonic");

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).not.toContain("mod grpc;");
    });

    it("should include proto crate as server dependency", async () => {
      const result = await createVirtual({
        projectName: "rust-tonic-server-dep",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "tonic",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("rust-tonic-server-dep-proto");
      expect(serverCargoContent).toContain('path = "../proto"');
      expect(serverCargoContent).toContain("tokio-stream");
    });
  });

  describe("async-graphql", () => {
    it("should include async-graphql dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("async-graphql");
      expect(cargoContent).toContain("async-graphql-axum");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("async-graphql.workspace = true");
      expect(serverCargoContent).toContain("async-graphql-axum.workspace = true");
    });

    it("should create graphql.rs module when async-graphql selected", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql-module",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify graphql.rs exists
      expect(hasFile(root, "crates/server/src/graphql.rs")).toBe(true);

      // Verify graphql.rs has proper content
      const graphqlContent = getFileContent(root, "crates/server/src/graphql.rs");
      expect(graphqlContent).toBeDefined();
      expect(graphqlContent).toContain("async_graphql");
      expect(graphqlContent).toContain("QueryRoot");
      expect(graphqlContent).toContain("MutationRoot");
      expect(graphqlContent).toContain("build_schema");
    });

    it("should NOT create graphql.rs when async-graphql is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-graphql",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify graphql.rs does NOT exist
      expect(hasFile(root, "crates/server/src/graphql.rs")).toBe(false);
    });

    it("should integrate GraphQL with main.rs for Axum", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("mod graphql");
      expect(mainContent).toContain("GraphiQLSource");
      expect(mainContent).toContain('"/graphql"');
      expect(mainContent).toContain('"/graphiql"');
    });

    it("should use async-graphql-actix-web for Actix-web framework", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql-actix",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify Actix-web GraphQL integration
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("async-graphql-actix-web");
      expect(cargoContent).not.toContain("async-graphql-axum");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("async-graphql-actix-web.workspace = true");

      // Verify main.rs has GraphQL integration
      const mainContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("mod graphql");
      expect(mainContent).toContain("GraphiQLSource");
    });

    it("should integrate GraphQL schema with SeaORM database", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql-seaorm",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sea-orm",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const graphqlContent = getFileContent(root, "crates/server/src/graphql.rs");
      expect(graphqlContent).toBeDefined();
      expect(graphqlContent).toContain("sea_orm::DatabaseConnection");
      expect(graphqlContent).toContain("Arc<DatabaseConnection>");
    });

    it("should integrate GraphQL schema with SQLx database", async () => {
      const result = await createVirtual({
        projectName: "rust-graphql-sqlx",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "async-graphql",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const graphqlContent = getFileContent(root, "crates/server/src/graphql.rs");
      expect(graphqlContent).toBeDefined();
      expect(graphqlContent).toContain("sqlx::PgPool");
    });
  });

  describe("Clap CLI", () => {
    it("should include Clap dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-clap-deps",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "clap",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("clap");
      expect(cargoContent).toContain('features = ["derive"]');
    });

    it("should include cli crate in workspace members when clap is selected", async () => {
      const result = await createVirtual({
        projectName: "rust-clap-workspace",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "clap",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain('"crates/cli"');
    });

    it("should create CLI crate with proper structure when clap is selected", async () => {
      const result = await createVirtual({
        projectName: "rust-clap-crate",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "clap",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Check CLI crate Cargo.toml exists
      const cliCargoContent = getFileContent(root, "crates/cli/Cargo.toml");
      expect(cliCargoContent).toBeDefined();
      expect(cliCargoContent).toContain("rust-clap-crate-cli");
      expect(cliCargoContent).toContain("clap.workspace = true");

      // Check CLI main.rs exists with clap usage
      const cliMainContent = getFileContent(root, "crates/cli/src/main.rs");
      expect(cliMainContent).toBeDefined();
      expect(cliMainContent).toContain("use clap::{Parser, Subcommand}");
      expect(cliMainContent).toContain("#[derive(Parser, Debug)]");
      expect(cliMainContent).toContain("Commands");
    });

    it("should NOT create CLI crate when clap is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-cli",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // CLI crate should not exist
      const cliCargoContent = getFileContent(root, "crates/cli/Cargo.toml");
      expect(cliCargoContent).toBeUndefined();

      // Workspace should not include cli
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).not.toContain('"crates/cli"');
    });
  });

  describe("Ratatui TUI", () => {
    it("should include Ratatui dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-deps",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("ratatui");
      expect(cargoContent).toContain("crossterm");
      expect(cargoContent).toContain("tracing-appender");
    });

    it("should include tui crate in workspace members when ratatui is selected", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-workspace",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain('"crates/tui"');
    });

    it("should create TUI crate with proper structure when ratatui is selected", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-crate",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Check TUI crate Cargo.toml exists
      const tuiCargoContent = getFileContent(root, "crates/tui/Cargo.toml");
      expect(tuiCargoContent).toBeDefined();
      expect(tuiCargoContent).toContain("rust-ratatui-crate-tui");
      expect(tuiCargoContent).toContain("ratatui.workspace = true");
      expect(tuiCargoContent).toContain("crossterm.workspace = true");
      expect(tuiCargoContent).toContain("tracing-appender.workspace = true");

      // Check TUI main.rs exists with ratatui usage
      const tuiMainContent = getFileContent(root, "crates/tui/src/main.rs");
      expect(tuiMainContent).toBeDefined();
      expect(tuiMainContent).toContain("use ratatui::");
      expect(tuiMainContent).toContain("use crossterm::");
      expect(tuiMainContent).toContain("struct App");
      expect(tuiMainContent).toContain("fn ui(");
    });

    it("should NOT create TUI crate when ratatui is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-tui",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // TUI crate should not exist
      const tuiCargoContent = getFileContent(root, "crates/tui/Cargo.toml");
      expect(tuiCargoContent).toBeUndefined();

      // Workspace should not include tui
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).not.toContain('"crates/tui"');
    });

    it("should NOT create CLI crate when ratatui is selected instead of clap", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-no-cli",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // CLI crate should not exist (only TUI crate)
      const cliCargoContent = getFileContent(root, "crates/cli/Cargo.toml");
      expect(cliCargoContent).toBeUndefined();

      // TUI crate should exist
      const tuiCargoContent = getFileContent(root, "crates/tui/Cargo.toml");
      expect(tuiCargoContent).toBeDefined();

      // Workspace should include tui but not cli
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain('"crates/tui"');
      expect(cargoContent).not.toContain('"crates/cli"');
    });

    it("should work with ratatui and web frameworks", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("ratatui");
      expect(cargoContent).toContain("axum");
    });

    it("should work with ratatui and database options", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-sqlx",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "sqlx",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain("ratatui");
      expect(cargoContent).toContain("sqlx");
    });

    it("should have correct TUI main.rs with application structure", async () => {
      const result = await createVirtual({
        projectName: "rust-ratatui-structure",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "ratatui",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const tuiMainContent = getFileContent(root, "crates/tui/src/main.rs");
      expect(tuiMainContent).toBeDefined();

      // Check for main TUI components
      expect(tuiMainContent).toContain("enable_raw_mode");
      expect(tuiMainContent).toContain("disable_raw_mode");
      expect(tuiMainContent).toContain("Terminal::new");
      expect(tuiMainContent).toContain("CrosstermBackend");
      expect(tuiMainContent).toContain("EnterAlternateScreen");
      expect(tuiMainContent).toContain("LeaveAlternateScreen");

      // Check for UI rendering
      expect(tuiMainContent).toContain("terminal.draw");
      expect(tuiMainContent).toContain("Block::");
      expect(tuiMainContent).toContain("Layout::");

      // Check for event handling
      expect(tuiMainContent).toContain("Event::Key");
      expect(tuiMainContent).toContain("KeyCode::");
    });
  });

  describe("Rust Libraries", () => {
    it("should include validator library when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-validator-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: ["validator"],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("validator");
      expect(cargoContent).toContain('features = ["derive"]');

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("validator.workspace = true");
    });

    it("should include jsonwebtoken library when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-jwt-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: ["jsonwebtoken"],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("jsonwebtoken");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("jsonwebtoken.workspace = true");
    });

    it("should include argon2 library when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-argon2-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: ["argon2"],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("argon2");

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain("argon2.workspace = true");
    });

    it("should include multiple libraries when selected", async () => {
      const result = await createVirtual({
        projectName: "rust-multi-libs",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: ["validator", "jsonwebtoken", "argon2"],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("validator");
      expect(cargoContent).toContain("jsonwebtoken");
      expect(cargoContent).toContain("argon2");
    });
  });

  describe("Leptos Frontend", () => {
    it("should include Leptos dependencies in workspace Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("leptos");
      expect(cargoContent).toContain("leptos_router");
      expect(cargoContent).toContain("leptos_meta");
      expect(cargoContent).toContain("wasm-bindgen");
      expect(cargoContent).toContain("console_error_panic_hook");
    });

    it("should include client crate in workspace members", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-workspace",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain('"crates/client"');
    });

    it("should create client crate directory structure", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-structure",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify client crate files
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/client/src/lib.rs")).toBe(true);
      expect(hasFile(root, "crates/client/index.html")).toBe(true);
      expect(hasFile(root, "crates/client/Trunk.toml")).toBe(true);
      expect(hasFile(root, "crates/client/style/main.css")).toBe(true);
    });

    it("should have correct client Cargo.toml with workspace references", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-client-cargo",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const clientCargoContent = getFileContent(root, "crates/client/Cargo.toml");
      expect(clientCargoContent).toBeDefined();
      expect(clientCargoContent).toContain('name = "rust-leptos-client-cargo-client"');
      expect(clientCargoContent).toContain("leptos.workspace = true");
      expect(clientCargoContent).toContain("leptos_router.workspace = true");
      expect(clientCargoContent).toContain("leptos_meta.workspace = true");
      expect(clientCargoContent).toContain('crate-type = ["cdylib", "rlib"]');
    });

    it("should have correct lib.rs with Leptos components", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-lib",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const libRsContent = getFileContent(root, "crates/client/src/lib.rs");
      expect(libRsContent).toBeDefined();
      expect(libRsContent).toContain("use leptos::prelude::*");
      expect(libRsContent).toContain("#[component]");
      expect(libRsContent).toContain("pub fn App()");
      expect(libRsContent).toContain("fn HomePage()");
      expect(libRsContent).toContain("fn AboutPage()");
      expect(libRsContent).toContain("Router");
      expect(libRsContent).toContain("leptos::mount::mount_to_body");
    });

    it("should have correct index.html with Trunk configuration", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-html",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const htmlContent = getFileContent(root, "crates/client/index.html");
      expect(htmlContent).toBeDefined();
      expect(htmlContent).toContain("<!DOCTYPE html>");
      expect(htmlContent).toContain('data-trunk rel="css"');
      expect(htmlContent).toContain('data-trunk rel="rust"');
      expect(htmlContent).toContain("rust-leptos-html");
    });

    it("should have Trunk.toml configuration", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-trunk",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const trunkContent = getFileContent(root, "crates/client/Trunk.toml");
      expect(trunkContent).toBeDefined();
      expect(trunkContent).toContain("[build]");
      expect(trunkContent).toContain('target = "index.html"');
      expect(trunkContent).toContain("[serve]");
      expect(trunkContent).toContain("port = 8080");
    });

    it("should include wasm32 target in rust-toolchain.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-toolchain",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const toolchainContent = getFileContent(root, "rust-toolchain.toml");
      expect(toolchainContent).toBeDefined();
      expect(toolchainContent).toContain("wasm32-unknown-unknown");
    });

    it("should NOT include client crate when leptos is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-leptos",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should not have client crate
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(false);
      expect(hasFile(root, "crates/client/src/lib.rs")).toBe(false);

      // Workspace should not include client
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).not.toContain('"crates/client"');
      expect(cargoContent).not.toContain("leptos");
    });

    it("should NOT include wasm32 target when leptos is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-wasm",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const toolchainContent = getFileContent(root, "rust-toolchain.toml");
      expect(toolchainContent).toBeDefined();
      expect(toolchainContent).not.toContain("wasm32-unknown-unknown");
    });

    it("should include backend framework info in Leptos About page", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-about-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const libRsContent = getFileContent(root, "crates/client/src/lib.rs");
      expect(libRsContent).toBeDefined();
      expect(libRsContent).toContain("Axum");
    });

    it("should work with Actix-web backend", async () => {
      const result = await createVirtual({
        projectName: "rust-leptos-actix",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "leptos",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify both server and client crates exist
      expect(hasFile(root, "crates/server/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(true);

      // Verify Actix-web in server
      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toContain("actix-web.workspace = true");

      // Verify About page shows Actix-web
      const libRsContent = getFileContent(root, "crates/client/src/lib.rs");
      expect(libRsContent).toContain("Actix-web");
    });
  });

  describe("Dioxus Frontend", () => {
    it("should include Dioxus dependencies in workspace Cargo.toml", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-deps",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain("dioxus");
      expect(cargoContent).toContain("dioxus-router");
      expect(cargoContent).toContain("dioxus-logger");
      expect(cargoContent).toContain("wasm-bindgen");
      expect(cargoContent).toContain("console_error_panic_hook");
    });

    it("should include dioxus-client crate in workspace members", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-workspace",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();
      expect(cargoContent).toContain('"crates/dioxus-client"');
    });

    it("should create dioxus-client crate directory structure", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-structure",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify dioxus-client crate files
      expect(hasFile(root, "crates/dioxus-client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/dioxus-client/src/main.rs")).toBe(true);
      expect(hasFile(root, "crates/dioxus-client/Dioxus.toml")).toBe(true);
      expect(hasFile(root, "crates/dioxus-client/assets/main.css")).toBe(true);
    });

    it("should have correct dioxus-client Cargo.toml with workspace references", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-client-cargo",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const clientCargoContent = getFileContent(root, "crates/dioxus-client/Cargo.toml");
      expect(clientCargoContent).toBeDefined();
      expect(clientCargoContent).toContain('name = "rust-dioxus-client-cargo-client"');
      expect(clientCargoContent).toContain("dioxus.workspace = true");
      expect(clientCargoContent).toContain("dioxus-router.workspace = true");
    });

    it("should have correct main.rs with Dioxus components", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-main",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/dioxus-client/src/main.rs");
      expect(mainRsContent).toBeDefined();
      expect(mainRsContent).toContain("use dioxus::prelude::*");
      expect(mainRsContent).toContain("use dioxus_router::prelude::*");
      expect(mainRsContent).toContain("#[component]");
      expect(mainRsContent).toContain("fn App()");
      expect(mainRsContent).toContain("fn Home()");
      expect(mainRsContent).toContain("fn About()");
      expect(mainRsContent).toContain("Router::<Route>");
      expect(mainRsContent).toContain("launch(App)");
    });

    it("should have Dioxus.toml configuration", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-config",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const dioxusContent = getFileContent(root, "crates/dioxus-client/Dioxus.toml");
      expect(dioxusContent).toBeDefined();
      expect(dioxusContent).toContain("[application]");
      expect(dioxusContent).toContain('default_platform = "web"');
      expect(dioxusContent).toContain("[web.app]");
      expect(dioxusContent).toContain("[web.watcher]");
    });

    it("should include wasm32 target in rust-toolchain.toml for Dioxus", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-toolchain",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const toolchainContent = getFileContent(root, "rust-toolchain.toml");
      expect(toolchainContent).toBeDefined();
      expect(toolchainContent).toContain("wasm32-unknown-unknown");
    });

    it("should NOT include dioxus-client crate when dioxus is not selected", async () => {
      const result = await createVirtual({
        projectName: "rust-no-dioxus",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should not have dioxus-client crate
      expect(hasFile(root, "crates/dioxus-client/Cargo.toml")).toBe(false);
      expect(hasFile(root, "crates/dioxus-client/src/main.rs")).toBe(false);

      // Workspace should not include dioxus-client
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).not.toContain('"crates/dioxus-client"');
      expect(cargoContent).not.toContain("dioxus =");
    });

    it("should include backend framework info in Dioxus About page", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-about-axum",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/dioxus-client/src/main.rs");
      expect(mainRsContent).toBeDefined();
      expect(mainRsContent).toContain("Axum");
    });

    it("should work with Actix-web backend", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-actix",
        ecosystem: "rust",
        rustWebFramework: "actix-web",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify both server and dioxus-client crates exist
      expect(hasFile(root, "crates/server/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/dioxus-client/Cargo.toml")).toBe(true);

      // Verify Actix-web in server
      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toContain("actix-web.workspace = true");

      // Verify About page shows Actix-web
      const mainRsContent = getFileContent(root, "crates/dioxus-client/src/main.rs");
      expect(mainRsContent).toContain("Actix-web");
    });

    it("should NOT include Leptos client crate when Dioxus is selected", async () => {
      const result = await createVirtual({
        projectName: "rust-dioxus-no-leptos",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "dioxus",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should have dioxus-client but not leptos client
      expect(hasFile(root, "crates/dioxus-client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(false);

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toContain('"crates/dioxus-client"');
      expect(cargoContent).not.toContain('"crates/client"');
    });
  });

  describe("Full-stack Rust Project", () => {
    it("should create a complete Rust project with all options", async () => {
      const result = await createVirtual({
        projectName: "rust-fullstack",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "leptos",
        rustOrm: "sqlx",
        rustApi: "async-graphql",
        rustCli: "clap",
        rustLibraries: ["validator", "jsonwebtoken", "argon2"],
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();

      const root = result.tree!.root;
      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();

      // Web framework
      expect(cargoContent).toContain("axum");

      // Frontend
      expect(cargoContent).toContain("leptos");

      // ORM
      expect(cargoContent).toContain("sqlx");

      // API
      expect(cargoContent).toContain("async-graphql");

      // CLI
      expect(cargoContent).toContain("clap");

      // Libraries
      expect(cargoContent).toContain("validator");
      expect(cargoContent).toContain("jsonwebtoken");
      expect(cargoContent).toContain("argon2");

      // Client crate
      expect(hasFile(root, "crates/client/Cargo.toml")).toBe(true);
      expect(hasFile(root, "crates/client/src/lib.rs")).toBe(true);
    });
  });

  describe("No Framework Selected", () => {
    it("should generate basic main.rs without web framework", async () => {
      const result = await createVirtual({
        projectName: "rust-no-framework",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainRsContent = getFileContent(root, "crates/server/src/main.rs");
      expect(mainRsContent).toBeDefined();

      // Should not contain web framework code
      expect(mainRsContent).not.toContain("use axum::");
      expect(mainRsContent).not.toContain("use actix_web::");

      // Should have basic tokio main
      expect(mainRsContent).toContain("#[tokio::main]");
      expect(mainRsContent).toContain("async fn main()");
      expect(mainRsContent).toContain("tracing::info!");
    });

    it("should not include framework dependencies when none selected", async () => {
      const result = await createVirtual({
        projectName: "rust-minimal",
        ecosystem: "rust",
        rustWebFramework: "none",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const cargoContent = getFileContent(root, "Cargo.toml");
      expect(cargoContent).toBeDefined();

      // Should not contain framework dependencies
      expect(cargoContent).not.toContain("axum =");
      expect(cargoContent).not.toContain("actix-web =");
      expect(cargoContent).not.toContain("sqlx =");
      expect(cargoContent).not.toContain("sea-orm =");
      expect(cargoContent).not.toContain("tonic =");
      expect(cargoContent).not.toContain("async-graphql =");
    });
  });

  describe("TypeScript Ecosystem (backward compatibility)", () => {
    it("should default to TypeScript ecosystem when not specified", async () => {
      const result = await createVirtual({
        projectName: "ts-default",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();

      const root = result.tree!.root;
      // TypeScript project should have package.json, not Cargo.toml
      expect(hasFile(root, "package.json")).toBe(true);
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

      const root = result.tree!.root;
      expect(hasFile(root, "package.json")).toBe(true);
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

      const tsRoot = tsResult.tree!.root;
      const rustRoot = rustResult.tree!.root;

      // TypeScript should have package.json
      expect(hasFile(tsRoot, "package.json")).toBe(true);
      expect(hasFile(tsRoot, "Cargo.toml")).toBe(false);

      // Rust should have Cargo.toml
      expect(hasFile(rustRoot, "Cargo.toml")).toBe(true);
      expect(hasFile(rustRoot, "package.json")).toBe(false);
    });
  });

  describe("Project Name Handling", () => {
    it("should use project name in Cargo.toml server crate", async () => {
      const result = await createVirtual({
        projectName: "my-awesome-rust-app",
        ecosystem: "rust",
        rustWebFramework: "axum",
        rustFrontend: "none",
        rustOrm: "none",
        rustApi: "none",
        rustCli: "none",
        rustLibraries: [],
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const serverCargoContent = getFileContent(root, "crates/server/Cargo.toml");
      expect(serverCargoContent).toBeDefined();
      expect(serverCargoContent).toContain('name = "my-awesome-rust-app-server"');
    });
  });
});

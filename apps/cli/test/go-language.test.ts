import type { VirtualNode, VirtualFile } from "@better-fullstack/template-generator";

import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import {
  EcosystemSchema,
  GoWebFrameworkSchema,
  GoOrmSchema,
  GoApiSchema,
  GoCliSchema,
  GoLoggingSchema,
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

// Extract all Go-related enum values
const ECOSYSTEMS = extractEnumValues(EcosystemSchema);
const GO_WEB_FRAMEWORKS = extractEnumValues(GoWebFrameworkSchema);
const GO_ORMS = extractEnumValues(GoOrmSchema);
const GO_APIS = extractEnumValues(GoApiSchema);
const GO_CLIS = extractEnumValues(GoCliSchema);
const GO_LOGGINGS = extractEnumValues(GoLoggingSchema);

describe("Go Language Support", () => {
  describe("Schema Definitions", () => {
    it("should have ecosystem schema with typescript, rust, python, and go", () => {
      expect(ECOSYSTEMS).toContain("typescript");
      expect(ECOSYSTEMS).toContain("rust");
      expect(ECOSYSTEMS).toContain("python");
      expect(ECOSYSTEMS).toContain("go");
      expect(ECOSYSTEMS.length).toBe(4);
    });

    it("should have go web framework options", () => {
      expect(GO_WEB_FRAMEWORKS).toContain("gin");
      expect(GO_WEB_FRAMEWORKS).toContain("echo");
      expect(GO_WEB_FRAMEWORKS).toContain("none");
    });

    it("should have go ORM options", () => {
      expect(GO_ORMS).toContain("gorm");
      expect(GO_ORMS).toContain("sqlc");
      expect(GO_ORMS).toContain("none");
    });

    it("should have go API options", () => {
      expect(GO_APIS).toContain("grpc-go");
      expect(GO_APIS).toContain("none");
    });

    it("should have go CLI options", () => {
      expect(GO_CLIS).toContain("cobra");
      expect(GO_CLIS).toContain("bubbletea");
      expect(GO_CLIS).toContain("none");
    });

    it("should have go logging options", () => {
      expect(GO_LOGGINGS).toContain("zap");
      expect(GO_LOGGINGS).toContain("none");
    });
  });

  describe("Go Base Template Structure", () => {
    it("should create a Go project with proper go.mod structure", async () => {
      const result = await createVirtual({
        projectName: "go-project",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();

      const root = result.tree!.root;

      // Verify project files exist
      expect(hasFile(root, "go.mod")).toBe(true);
      expect(hasFile(root, ".gitignore")).toBe(true);
      expect(hasFile(root, ".env.example")).toBe(true);
      expect(hasFile(root, "README.md")).toBe(true);

      // Verify source directory structure
      expect(hasFile(root, "cmd/server/main.go")).toBe(true);
    });

    it("should have correct go.mod structure", async () => {
      const result = await createVirtual({
        projectName: "go-mod-check",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();

      // Verify module declaration
      expect(goModContent).toContain("module go-mod-check");
      expect(goModContent).toContain("go 1.22");

      // Verify godotenv is always included
      expect(goModContent).toContain("github.com/joho/godotenv");
    });

    it("should have proper .gitignore for Go projects", async () => {
      const result = await createVirtual({
        projectName: "go-gitignore-check",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const gitignoreContent = getFileContent(root, ".gitignore");
      expect(gitignoreContent).toBeDefined();
      expect(gitignoreContent).toContain(".env");
    });

    it("should have proper .env.example with Go environment variables", async () => {
      const result = await createVirtual({
        projectName: "go-env-check",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const envContent = getFileContent(root, ".env.example");
      expect(envContent).toBeDefined();
      expect(envContent).toContain("HOST=");
      expect(envContent).toContain("PORT=");
    });
  });

  describe("Gin Web Framework Integration", () => {
    it("should include Gin dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-gin-project",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("github.com/gin-gonic/gin");
    });

    it("should generate proper Gin main.go with routes", async () => {
      const result = await createVirtual({
        projectName: "go-gin-main-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "cmd/server/main.go");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("github.com/gin-gonic/gin");
      expect(mainContent).toContain("gin.Default()");
      expect(mainContent).toContain(`r.GET("/health"`);
      expect(mainContent).toContain("r.Run(addr)");
    });
  });

  describe("Echo Web Framework Integration", () => {
    it("should include Echo dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-echo-project",
        ecosystem: "go",
        goWebFramework: "echo",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("github.com/labstack/echo/v4");
    });

    it("should generate proper Echo main.go with middleware", async () => {
      const result = await createVirtual({
        projectName: "go-echo-main-check",
        ecosystem: "go",
        goWebFramework: "echo",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "cmd/server/main.go");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("github.com/labstack/echo/v4");
      expect(mainContent).toContain("echo.New()");
      expect(mainContent).toContain("middleware.Logger()");
      expect(mainContent).toContain("middleware.Recover()");
      expect(mainContent).toContain("middleware.CORS()");
      expect(mainContent).toContain(`e.GET("/health"`);
      expect(mainContent).toContain("e.Start(addr)");
    });
  });

  describe("GORM ORM Integration", () => {
    it("should include GORM dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-gorm-project",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("gorm.io/gorm");
      expect(goModContent).toContain("gorm.io/driver/sqlite");
      expect(goModContent).toContain("gorm.io/driver/postgres");
    });

    it("should generate database package with GORM setup", async () => {
      const result = await createVirtual({
        projectName: "go-gorm-db-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "internal/database/database.go")).toBe(true);
      expect(hasFile(root, "internal/models/models.go")).toBe(true);
      expect(hasFile(root, "internal/handlers/handlers.go")).toBe(true);

      const dbContent = getFileContent(root, "internal/database/database.go");
      expect(dbContent).toBeDefined();
      expect(dbContent).toContain("package database");
      expect(dbContent).toContain("gorm.io/gorm");
      expect(dbContent).toContain("func InitDB()");
      expect(dbContent).toContain("func GetDB()");
      expect(dbContent).toContain("AutoMigrate");
    });

    it("should generate models with GORM structs", async () => {
      const result = await createVirtual({
        projectName: "go-gorm-models-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const modelsContent = getFileContent(root, "internal/models/models.go");
      expect(modelsContent).toBeDefined();
      expect(modelsContent).toContain("package models");
      expect(modelsContent).toContain("gorm.io/gorm");
      expect(modelsContent).toContain("type User struct");
      expect(modelsContent).toContain("type Post struct");
      expect(modelsContent).toContain("gorm.DeletedAt");
    });

    it("should generate handlers with CRUD operations for Gin", async () => {
      const result = await createVirtual({
        projectName: "go-gorm-handlers-gin",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const handlersContent = getFileContent(root, "internal/handlers/handlers.go");
      expect(handlersContent).toBeDefined();
      expect(handlersContent).toContain("package handlers");
      expect(handlersContent).toContain("github.com/gin-gonic/gin");
      expect(handlersContent).toContain("func GetUsers");
      expect(handlersContent).toContain("func GetUser");
      expect(handlersContent).toContain("func CreateUser");
      expect(handlersContent).toContain("func UpdateUser");
      expect(handlersContent).toContain("func DeleteUser");
    });

    it("should generate handlers with CRUD operations for Echo", async () => {
      const result = await createVirtual({
        projectName: "go-gorm-handlers-echo",
        ecosystem: "go",
        goWebFramework: "echo",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const handlersContent = getFileContent(root, "internal/handlers/handlers.go");
      expect(handlersContent).toBeDefined();
      expect(handlersContent).toContain("package handlers");
      expect(handlersContent).toContain("github.com/labstack/echo/v4");
      expect(handlersContent).toContain("func GetUsers(c echo.Context) error");
      expect(handlersContent).toContain("func CreateUser(c echo.Context) error");
    });
  });

  describe("SQLc Integration", () => {
    it("should include SQLc dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-project",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("github.com/jackc/pgx/v5");
    });

    it("should generate database package with pgx pool setup", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-db-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const dbContent = getFileContent(root, "internal/database/database.go");
      expect(dbContent).toBeDefined();
      expect(dbContent).toContain("package database");
      expect(dbContent).toContain("github.com/jackc/pgx/v5/pgxpool");
      expect(dbContent).toContain("pgxpool.Pool");
      expect(dbContent).toContain("func InitDB()");
      expect(dbContent).toContain("func GetPool()");
    });

    it("should generate sqlc.yaml configuration file", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-config-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "sqlc.yaml")).toBe(true);
      const sqlcConfig = getFileContent(root, "sqlc.yaml");
      expect(sqlcConfig).toBeDefined();
      expect(sqlcConfig).toContain('version: "2"');
      expect(sqlcConfig).toContain('engine: "postgresql"');
      expect(sqlcConfig).toContain('queries: "sql/queries/"');
      expect(sqlcConfig).toContain('schema: "sql/schema/"');
      expect(sqlcConfig).toContain('sql_package: "pgx/v5"');
    });

    it("should generate SQL schema file", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-schema-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "sql/schema/001_schema.sql")).toBe(true);
      const schemaContent = getFileContent(root, "sql/schema/001_schema.sql");
      expect(schemaContent).toBeDefined();
      expect(schemaContent).toContain("CREATE TABLE IF NOT EXISTS users");
      expect(schemaContent).toContain("CREATE TABLE IF NOT EXISTS posts");
      expect(schemaContent).toContain("BIGSERIAL PRIMARY KEY");
    });

    it("should generate SQL query files", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-queries-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Check users queries
      expect(hasFile(root, "sql/queries/users.sql")).toBe(true);
      const usersQueries = getFileContent(root, "sql/queries/users.sql");
      expect(usersQueries).toBeDefined();
      expect(usersQueries).toContain("-- name: GetUsers :many");
      expect(usersQueries).toContain("-- name: CreateUser :one");
      expect(usersQueries).toContain("-- name: DeleteUser :exec");

      // Check posts queries
      expect(hasFile(root, "sql/queries/posts.sql")).toBe(true);
      const postsQueries = getFileContent(root, "sql/queries/posts.sql");
      expect(postsQueries).toBeDefined();
      expect(postsQueries).toContain("-- name: GetPosts :many");
      expect(postsQueries).toContain("-- name: CreatePost :one");
    });

    it("should generate handlers with pgxpool CRUD operations for Gin", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-handlers-gin",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const handlersContent = getFileContent(root, "internal/handlers/handlers.go");
      expect(handlersContent).toBeDefined();
      expect(handlersContent).toContain("package handlers");
      expect(handlersContent).toContain("github.com/gin-gonic/gin");
      expect(handlersContent).toContain("database.GetPool()");
      expect(handlersContent).toContain("func GetUsers(c *gin.Context)");
      expect(handlersContent).toContain("func CreateUser(c *gin.Context)");
      expect(handlersContent).toContain("func DeleteUser(c *gin.Context)");
      expect(handlersContent).toContain("ctx := c.Request.Context()");
    });

    it("should generate handlers with pgxpool CRUD operations for Echo", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-handlers-echo",
        ecosystem: "go",
        goWebFramework: "echo",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const handlersContent = getFileContent(root, "internal/handlers/handlers.go");
      expect(handlersContent).toBeDefined();
      expect(handlersContent).toContain("package handlers");
      expect(handlersContent).toContain("github.com/labstack/echo/v4");
      expect(handlersContent).toContain("database.GetPool()");
      expect(handlersContent).toContain("func GetUsers(c echo.Context) error");
      expect(handlersContent).toContain("func CreateUser(c echo.Context) error");
      expect(handlersContent).toContain("ctx := c.Request().Context()");
    });

    it("should generate models with int64 IDs for SQLc", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-models-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const modelsContent = getFileContent(root, "internal/models/models.go");
      expect(modelsContent).toBeDefined();
      expect(modelsContent).toContain("package models");
      expect(modelsContent).toContain("type User struct");
      expect(modelsContent).toContain("ID        int64");
      expect(modelsContent).not.toContain("gorm.io/gorm");
    });

    it("should initialize database pool in main.go with SQLc", async () => {
      const result = await createVirtual({
        projectName: "go-sqlc-main-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "sqlc",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "cmd/server/main.go");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("database.InitDB()");
      expect(mainContent).toContain("defer database.Close()");
    });

    it("should not generate sqlc files when GORM is selected", async () => {
      const result = await createVirtual({
        projectName: "go-gorm-no-sqlc",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "sqlc.yaml")).toBe(false);
      expect(hasFile(root, "sql/schema/001_schema.sql")).toBe(false);
      expect(hasFile(root, "sql/queries/users.sql")).toBe(false);
    });
  });

  describe("gRPC Integration", () => {
    it("should include gRPC dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-grpc-project",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "grpc-go",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("google.golang.org/grpc");
      expect(goModContent).toContain("google.golang.org/protobuf");
    });

    it("should generate proto files when gRPC selected", async () => {
      const result = await createVirtual({
        projectName: "go-grpc-proto-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "grpc-go",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "proto/greeter.proto")).toBe(true);
      expect(hasFile(root, "proto/greeter.go")).toBe(true);
      expect(hasFile(root, "proto/greeter.pb.go")).toBe(true);
      expect(hasFile(root, "proto/greeter_grpc.pb.go")).toBe(true);
    });

    it("should not generate proto files when gRPC not selected", async () => {
      const result = await createVirtual({
        projectName: "go-no-grpc-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "proto/greeter.proto")).toBe(false);
    });

    it("should include gRPC server in main.go when selected", async () => {
      const result = await createVirtual({
        projectName: "go-grpc-main-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "grpc-go",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "cmd/server/main.go");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("google.golang.org/grpc");
      expect(mainContent).toContain("grpc.NewServer()");
      expect(mainContent).toContain("RegisterGreeterServer");
    });
  });

  describe("Cobra CLI Integration", () => {
    it("should include Cobra dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-cobra-project",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "cobra",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("github.com/spf13/cobra");
    });

    it("should generate cmd/cli directory when Cobra selected", async () => {
      const result = await createVirtual({
        projectName: "go-cobra-cli-check",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "cobra",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "cmd/cli/main.go")).toBe(true);

      const cliContent = getFileContent(root, "cmd/cli/main.go");
      expect(cliContent).toBeDefined();
      expect(cliContent).toContain("github.com/spf13/cobra");
      expect(cliContent).toContain("rootCmd");
    });

    it("should not generate cmd/cli when Cobra not selected", async () => {
      const result = await createVirtual({
        projectName: "go-no-cobra-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "cmd/cli/main.go")).toBe(false);
    });
  });

  describe("Bubble Tea TUI Integration", () => {
    it("should include Bubble Tea dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-bubbletea-project",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "bubbletea",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("github.com/charmbracelet/bubbletea");
      expect(goModContent).toContain("github.com/charmbracelet/lipgloss");
    });

    it("should generate cmd/tui directory when Bubble Tea selected", async () => {
      const result = await createVirtual({
        projectName: "go-bubbletea-tui-check",
        ecosystem: "go",
        goWebFramework: "none",
        goOrm: "none",
        goApi: "none",
        goCli: "bubbletea",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "cmd/tui/main.go")).toBe(true);

      const tuiContent = getFileContent(root, "cmd/tui/main.go");
      expect(tuiContent).toBeDefined();
      expect(tuiContent).toContain("github.com/charmbracelet/bubbletea");
      expect(tuiContent).toContain("tea.Model");
    });

    it("should not generate cmd/tui when Bubble Tea not selected", async () => {
      const result = await createVirtual({
        projectName: "go-no-bubbletea-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      expect(hasFile(root, "cmd/tui/main.go")).toBe(false);
    });
  });

  describe("Zap Logging Integration", () => {
    it("should include Zap dependencies when selected", async () => {
      const result = await createVirtual({
        projectName: "go-zap-project",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toBeDefined();
      expect(goModContent).toContain("go.uber.org/zap");
    });

    it("should include Zap logger initialization in main.go", async () => {
      const result = await createVirtual({
        projectName: "go-zap-main-check",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "cmd/server/main.go");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("go.uber.org/zap");
      expect(mainContent).toContain("var logger *zap.Logger");
      expect(mainContent).toContain("func initLogger()");
      expect(mainContent).toContain("logger.Info");
    });
  });

  describe("Combined Integration Scenarios", () => {
    it("should generate full-stack Go project with Gin + GORM + Zap", async () => {
      const result = await createVirtual({
        projectName: "go-fullstack",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify all expected files exist
      expect(hasFile(root, "go.mod")).toBe(true);
      expect(hasFile(root, "cmd/server/main.go")).toBe(true);
      expect(hasFile(root, "internal/database/database.go")).toBe(true);
      expect(hasFile(root, "internal/models/models.go")).toBe(true);
      expect(hasFile(root, "internal/handlers/handlers.go")).toBe(true);

      // Verify go.mod has all dependencies
      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toContain("github.com/gin-gonic/gin");
      expect(goModContent).toContain("gorm.io/gorm");
      expect(goModContent).toContain("go.uber.org/zap");

      // Verify main.go has all integrations
      const mainContent = getFileContent(root, "cmd/server/main.go");
      expect(mainContent).toContain("github.com/gin-gonic/gin");
      expect(mainContent).toContain("go.uber.org/zap");
      expect(mainContent).toContain("database.InitDB()");
    });

    it("should generate full-stack Go project with Echo + SQLc + gRPC", async () => {
      const result = await createVirtual({
        projectName: "go-echo-grpc",
        ecosystem: "go",
        goWebFramework: "echo",
        goOrm: "sqlc",
        goApi: "grpc-go",
        goCli: "none",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify all expected files exist
      expect(hasFile(root, "go.mod")).toBe(true);
      expect(hasFile(root, "cmd/server/main.go")).toBe(true);
      expect(hasFile(root, "internal/database/database.go")).toBe(true);
      expect(hasFile(root, "proto/greeter.proto")).toBe(true);

      // Verify go.mod has all dependencies
      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toContain("github.com/labstack/echo/v4");
      expect(goModContent).toContain("github.com/jackc/pgx/v5");
      expect(goModContent).toContain("google.golang.org/grpc");
    });

    it("should generate CLI tools with Cobra alongside web server", async () => {
      const result = await createVirtual({
        projectName: "go-cli-web",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "none",
        goApi: "none",
        goCli: "cobra",
        goLogging: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify both cmd directories exist
      expect(hasFile(root, "cmd/server/main.go")).toBe(true);
      expect(hasFile(root, "cmd/cli/main.go")).toBe(true);

      // Verify go.mod has both dependencies
      const goModContent = getFileContent(root, "go.mod");
      expect(goModContent).toContain("github.com/gin-gonic/gin");
      expect(goModContent).toContain("github.com/spf13/cobra");
    });
  });

  describe("Go vs Other Ecosystems", () => {
    it("should not generate TypeScript files for Go projects", async () => {
      const result = await createVirtual({
        projectName: "go-no-ts",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should not have TypeScript/JS files
      expect(hasFile(root, "package.json")).toBe(false);
      expect(hasFile(root, "tsconfig.json")).toBe(false);
    });

    it("should not generate Python files for Go projects", async () => {
      const result = await createVirtual({
        projectName: "go-no-python",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should not have Python files
      expect(hasFile(root, "pyproject.toml")).toBe(false);
      expect(hasFile(root, "requirements.txt")).toBe(false);
    });

    it("should not generate Rust files for Go projects", async () => {
      const result = await createVirtual({
        projectName: "go-no-rust",
        ecosystem: "go",
        goWebFramework: "gin",
        goOrm: "gorm",
        goApi: "none",
        goCli: "none",
        goLogging: "zap",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should not have Rust files
      expect(hasFile(root, "Cargo.toml")).toBe(false);
      expect(hasFile(root, "rust-toolchain.toml")).toBe(false);
    });
  });
});

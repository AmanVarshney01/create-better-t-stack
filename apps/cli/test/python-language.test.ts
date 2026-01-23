import type { VirtualNode, VirtualFile } from "@better-fullstack/template-generator";

import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import {
  EcosystemSchema,
  PythonWebFrameworkSchema,
  PythonOrmSchema,
  PythonValidationSchema,
  PythonAiSchema,
  PythonTaskQueueSchema,
  PythonQualitySchema,
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

// Extract all Python-related enum values
const ECOSYSTEMS = extractEnumValues(EcosystemSchema);
const PYTHON_WEB_FRAMEWORKS = extractEnumValues(PythonWebFrameworkSchema);
const PYTHON_ORMS = extractEnumValues(PythonOrmSchema);
const PYTHON_VALIDATIONS = extractEnumValues(PythonValidationSchema);
const PYTHON_AIS = extractEnumValues(PythonAiSchema);
const PYTHON_TASK_QUEUES = extractEnumValues(PythonTaskQueueSchema);
const PYTHON_QUALITIES = extractEnumValues(PythonQualitySchema);

describe("Python Language Support", () => {
  describe("Schema Definitions", () => {
    it("should have ecosystem schema with typescript, rust, and python", () => {
      expect(ECOSYSTEMS).toContain("typescript");
      expect(ECOSYSTEMS).toContain("rust");
      expect(ECOSYSTEMS).toContain("python");
      expect(ECOSYSTEMS.length).toBe(3);
    });

    it("should have python web framework options", () => {
      expect(PYTHON_WEB_FRAMEWORKS).toContain("fastapi");
      expect(PYTHON_WEB_FRAMEWORKS).toContain("django");
      expect(PYTHON_WEB_FRAMEWORKS).toContain("none");
    });

    it("should have python ORM options", () => {
      expect(PYTHON_ORMS).toContain("sqlalchemy");
      expect(PYTHON_ORMS).toContain("sqlmodel");
      expect(PYTHON_ORMS).toContain("none");
    });

    it("should have python validation options", () => {
      expect(PYTHON_VALIDATIONS).toContain("pydantic");
      expect(PYTHON_VALIDATIONS).toContain("none");
    });

    it("should have python AI options", () => {
      expect(PYTHON_AIS).toContain("langchain");
      expect(PYTHON_AIS).toContain("llamaindex");
      expect(PYTHON_AIS).toContain("openai-sdk");
      expect(PYTHON_AIS).toContain("anthropic-sdk");
      expect(PYTHON_AIS).toContain("langgraph");
      expect(PYTHON_AIS).toContain("crewai");
      expect(PYTHON_AIS).toContain("none");
    });

    it("should have python task queue options", () => {
      expect(PYTHON_TASK_QUEUES).toContain("celery");
      expect(PYTHON_TASK_QUEUES).toContain("none");
    });

    it("should have python quality options", () => {
      expect(PYTHON_QUALITIES).toContain("ruff");
      expect(PYTHON_QUALITIES).toContain("none");
    });
  });

  describe("Python Base Template Structure", () => {
    it("should create a Python project with proper pyproject.toml structure", async () => {
      const result = await createVirtual({
        projectName: "python-project",
        ecosystem: "python",
        pythonWebFramework: "none",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();

      const root = result.tree!.root;

      // Verify project files exist
      expect(hasFile(root, "pyproject.toml")).toBe(true);
      expect(hasFile(root, ".gitignore")).toBe(true);
      expect(hasFile(root, ".env.example")).toBe(true);
      expect(hasFile(root, "README.md")).toBe(true);

      // Verify source directory structure
      expect(hasFile(root, "src/app/__init__.py")).toBe(true);
      expect(hasFile(root, "src/app/main.py")).toBe(true);

      // Verify tests directory
      expect(hasFile(root, "tests/__init__.py")).toBe(true);
      expect(hasFile(root, "tests/test_main.py")).toBe(true);
    });

    it("should have correct pyproject.toml structure", async () => {
      const result = await createVirtual({
        projectName: "python-toml-check",
        ecosystem: "python",
        pythonWebFramework: "none",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();

      // Verify project configuration
      expect(pyprojectContent).toContain("[project]");
      expect(pyprojectContent).toContain('name = "python-toml-check"');
      expect(pyprojectContent).toContain('version = "0.1.0"');
      expect(pyprojectContent).toContain('requires-python = ">=3.11"');

      // Verify build system
      expect(pyprojectContent).toContain("[build-system]");
      expect(pyprojectContent).toContain("hatchling");
    });

    it("should have proper .gitignore for Python projects", async () => {
      const result = await createVirtual({
        projectName: "python-gitignore-check",
        ecosystem: "python",
        pythonWebFramework: "none",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const gitignoreContent = getFileContent(root, ".gitignore");
      expect(gitignoreContent).toBeDefined();
      expect(gitignoreContent).toContain("__pycache__/");
      expect(gitignoreContent).toContain(".env");
      expect(gitignoreContent).toContain(".venv");
      expect(gitignoreContent).toContain(".uv/");
    });

    it("should have proper .env.example with Python environment variables", async () => {
      const result = await createVirtual({
        projectName: "python-env-check",
        ecosystem: "python",
        pythonWebFramework: "none",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const envContent = getFileContent(root, ".env.example");
      expect(envContent).toBeDefined();
      expect(envContent).toContain("DEBUG");
      expect(envContent).toContain("HOST");
      expect(envContent).toContain("PORT");
    });
  });

  describe("FastAPI Web Framework", () => {
    it("should include FastAPI dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-fastapi-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("fastapi");
      expect(pyprojectContent).toContain("uvicorn");
    });

    it("should have FastAPI main.py with proper structure", async () => {
      const result = await createVirtual({
        projectName: "python-fastapi-main",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "src/app/main.py");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("from fastapi import FastAPI");
      expect(mainContent).toContain("app = FastAPI(");
      expect(mainContent).toContain('@app.get("/")');
      expect(mainContent).toContain('@app.get("/health")');
    });
  });

  describe("Django Web Framework", () => {
    it("should include Django dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-django-deps",
        ecosystem: "python",
        pythonWebFramework: "django",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("django");
      expect(pyprojectContent).toContain("django-cors-headers");
    });

    it("should have Django main.py with proper structure", async () => {
      const result = await createVirtual({
        projectName: "python-django-main",
        ecosystem: "python",
        pythonWebFramework: "django",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "src/app/main.py");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("import django");
      expect(mainContent).toContain("from django.http import JsonResponse");
    });
  });

  describe("SQLAlchemy ORM", () => {
    it("should include SQLAlchemy dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("sqlalchemy");
      expect(pyprojectContent).toContain("alembic");
      expect(pyprojectContent).toContain("aiosqlite");
    });

    it("should create SQLAlchemy database module", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-database",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify database.py exists
      expect(hasFile(root, "src/app/database.py")).toBe(true);
      const databaseContent = getFileContent(root, "src/app/database.py");
      expect(databaseContent).toBeDefined();
      expect(databaseContent).toContain("from sqlalchemy import create_engine");
      expect(databaseContent).toContain("SessionLocal");
      expect(databaseContent).toContain("get_db");
      expect(databaseContent).toContain("init_db");
    });

    it("should create SQLAlchemy models module", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-models",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify models.py exists
      expect(hasFile(root, "src/app/models.py")).toBe(true);
      const modelsContent = getFileContent(root, "src/app/models.py");
      expect(modelsContent).toBeDefined();
      expect(modelsContent).toContain("class Base(DeclarativeBase)");
      expect(modelsContent).toContain("class User(Base)");
      expect(modelsContent).toContain("class Post(Base)");
      expect(modelsContent).toContain("__tablename__");
    });

    it("should create SQLAlchemy schemas module with Pydantic", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-schemas",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify schemas.py exists
      expect(hasFile(root, "src/app/schemas.py")).toBe(true);
      const schemasContent = getFileContent(root, "src/app/schemas.py");
      expect(schemasContent).toBeDefined();
      expect(schemasContent).toContain("from pydantic import BaseModel");
      expect(schemasContent).toContain("class UserBase(BaseModel)");
      expect(schemasContent).toContain("class UserCreate");
      expect(schemasContent).toContain("class UserResponse");
      expect(schemasContent).toContain("class PostBase(BaseModel)");
    });

    it("should create SQLAlchemy CRUD module", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-crud",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify crud.py exists
      expect(hasFile(root, "src/app/crud.py")).toBe(true);
      const crudContent = getFileContent(root, "src/app/crud.py");
      expect(crudContent).toBeDefined();
      expect(crudContent).toContain("def get_user");
      expect(crudContent).toContain("def create_user");
      expect(crudContent).toContain("def update_user");
      expect(crudContent).toContain("def delete_user");
      expect(crudContent).toContain("def get_post");
      expect(crudContent).toContain("def create_post");
    });

    it("should create Alembic migration configuration", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-alembic",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify alembic.ini exists
      expect(hasFile(root, "alembic.ini")).toBe(true);
      const alembicIniContent = getFileContent(root, "alembic.ini");
      expect(alembicIniContent).toBeDefined();
      expect(alembicIniContent).toContain("[alembic]");
      expect(alembicIniContent).toContain("script_location = migrations");

      // Verify migrations/env.py exists
      expect(hasFile(root, "migrations/env.py")).toBe(true);
      const envContent = getFileContent(root, "migrations/env.py");
      expect(envContent).toBeDefined();
      expect(envContent).toContain("from alembic import context");
      expect(envContent).toContain("from app.models import Base");
      expect(envContent).toContain("target_metadata = Base.metadata");

      // Verify migrations/script.py.mako exists
      expect(hasFile(root, "migrations/script.py.mako")).toBe(true);
    });

    it("should create database test file", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-tests",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify test_database.py exists
      expect(hasFile(root, "tests/test_database.py")).toBe(true);
      const testContent = getFileContent(root, "tests/test_database.py");
      expect(testContent).toBeDefined();
      expect(testContent).toContain("class TestUserModel");
      expect(testContent).toContain("class TestPostModel");
      expect(testContent).toContain("class TestUserCrud");
      expect(testContent).toContain("class TestPostCrud");
      expect(testContent).toContain("@pytest.fixture");
      expect(testContent).toContain("db_session");
    });

    it("should integrate SQLAlchemy with FastAPI endpoints", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-fastapi",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "src/app/main.py");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("from app.database import get_db, init_db");
      expect(mainContent).toContain("from app import crud");
      expect(mainContent).toContain("from app.schemas import");
      expect(mainContent).toContain('@app.post("/users"');
      expect(mainContent).toContain('@app.get("/users"');
      expect(mainContent).toContain('@app.post("/posts"');
      expect(mainContent).toContain("Depends(get_db)");
      expect(mainContent).toContain("init_db()");
    });

    it("should generate README with SQLAlchemy instructions", async () => {
      const result = await createVirtual({
        projectName: "python-sqlalchemy-readme",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const readmeContent = getFileContent(root, "README.md");
      expect(readmeContent).toBeDefined();
      expect(readmeContent).toContain("SQLAlchemy");
      expect(readmeContent).toContain("Alembic");
      expect(readmeContent).toContain("alembic revision");
      expect(readmeContent).toContain("alembic upgrade head");
    });

    it("should NOT create SQLAlchemy files when pythonOrm is none", async () => {
      const result = await createVirtual({
        projectName: "python-no-sqlalchemy",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify SQLAlchemy files do NOT exist
      expect(hasFile(root, "src/app/database.py")).toBe(false);
      expect(hasFile(root, "src/app/models.py")).toBe(false);
      expect(hasFile(root, "src/app/crud.py")).toBe(false);
      expect(hasFile(root, "alembic.ini")).toBe(false);
      expect(hasFile(root, "migrations/env.py")).toBe(false);
    });
  });

  describe("SQLModel ORM", () => {
    it("should include SQLModel dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("sqlmodel");
      expect(pyprojectContent).toContain("alembic");
    });

    it("should create SQLModel database module", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-database",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify database.py exists
      expect(hasFile(root, "src/app/database.py")).toBe(true);
      const databaseContent = getFileContent(root, "src/app/database.py");
      expect(databaseContent).toBeDefined();
      expect(databaseContent).toContain("from sqlmodel import Session, SQLModel, create_engine");
      expect(databaseContent).toContain("get_db");
      expect(databaseContent).toContain("init_db");
    });

    it("should create SQLModel models with built-in schemas", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-models",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify models.py exists
      expect(hasFile(root, "src/app/models.py")).toBe(true);
      const modelsContent = getFileContent(root, "src/app/models.py");
      expect(modelsContent).toBeDefined();
      expect(modelsContent).toContain("from sqlmodel import Field, SQLModel");
      expect(modelsContent).toContain("class User(UserBase, table=True)");
      expect(modelsContent).toContain("class Post(PostBase, table=True)");
      // SQLModel combines models and schemas
      expect(modelsContent).toContain("class UserCreate");
      expect(modelsContent).toContain("class UserUpdate");
      expect(modelsContent).toContain("class UserResponse");
      expect(modelsContent).toContain("class PostCreate");
      expect(modelsContent).toContain("class PostUpdate");
      expect(modelsContent).toContain("class PostResponse");
    });

    it("should NOT create separate schemas.py for SQLModel", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-no-schemas",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // SQLModel doesn't need separate schemas.py
      expect(hasFile(root, "src/app/schemas.py")).toBe(false);
    });

    it("should create SQLModel CRUD module", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-crud",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify crud.py exists
      expect(hasFile(root, "src/app/crud.py")).toBe(true);
      const crudContent = getFileContent(root, "src/app/crud.py");
      expect(crudContent).toBeDefined();
      expect(crudContent).toContain("from sqlmodel import Session, select");
      expect(crudContent).toContain("def get_user");
      expect(crudContent).toContain("def create_user");
      expect(crudContent).toContain("def update_user");
      expect(crudContent).toContain("def delete_user");
      expect(crudContent).toContain("def get_post");
      expect(crudContent).toContain("def create_post");
    });

    it("should create Alembic migration configuration for SQLModel", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-alembic",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify alembic.ini exists
      expect(hasFile(root, "alembic.ini")).toBe(true);
      const alembicIniContent = getFileContent(root, "alembic.ini");
      expect(alembicIniContent).toBeDefined();
      expect(alembicIniContent).toContain("[alembic]");
      expect(alembicIniContent).toContain("script_location = migrations");

      // Verify migrations/env.py exists
      expect(hasFile(root, "migrations/env.py")).toBe(true);
      const envContent = getFileContent(root, "migrations/env.py");
      expect(envContent).toBeDefined();
      expect(envContent).toContain("from alembic import context");
      expect(envContent).toContain("from sqlmodel import SQLModel");
      expect(envContent).toContain("target_metadata = SQLModel.metadata");

      // Verify migrations/script.py.mako exists
      expect(hasFile(root, "migrations/script.py.mako")).toBe(true);
    });

    it("should create database test file for SQLModel", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-tests",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify test_database.py exists
      expect(hasFile(root, "tests/test_database.py")).toBe(true);
      const testContent = getFileContent(root, "tests/test_database.py");
      expect(testContent).toBeDefined();
      expect(testContent).toContain("from sqlmodel import Session, SQLModel, create_engine");
      expect(testContent).toContain("class TestUserModel");
      expect(testContent).toContain("class TestPostModel");
      expect(testContent).toContain("class TestUserCrud");
      expect(testContent).toContain("class TestPostCrud");
      expect(testContent).toContain("@pytest.fixture");
      expect(testContent).toContain("db_session");
    });

    it("should integrate SQLModel with FastAPI endpoints", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-fastapi",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const mainContent = getFileContent(root, "src/app/main.py");
      expect(mainContent).toBeDefined();
      expect(mainContent).toContain("from sqlmodel import Session");
      expect(mainContent).toContain("from app.database import get_db, init_db");
      expect(mainContent).toContain("from app import crud");
      expect(mainContent).toContain("from app.models import");
      expect(mainContent).toContain('@app.post("/users"');
      expect(mainContent).toContain('@app.get("/users"');
      expect(mainContent).toContain('@app.post("/posts"');
      expect(mainContent).toContain("Depends(get_db)");
      expect(mainContent).toContain("init_db()");
    });

    it("should generate README with SQLModel instructions", async () => {
      const result = await createVirtual({
        projectName: "python-sqlmodel-readme",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlmodel",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const readmeContent = getFileContent(root, "README.md");
      expect(readmeContent).toBeDefined();
      expect(readmeContent).toContain("SQLModel");
      expect(readmeContent).toContain("Alembic");
      expect(readmeContent).toContain("alembic revision");
      expect(readmeContent).toContain("alembic upgrade head");
    });

    it("should NOT create SQLModel files when pythonOrm is none", async () => {
      const result = await createVirtual({
        projectName: "python-no-sqlmodel",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Verify SQLModel files do NOT exist
      expect(hasFile(root, "src/app/database.py")).toBe(false);
      expect(hasFile(root, "src/app/models.py")).toBe(false);
      expect(hasFile(root, "src/app/crud.py")).toBe(false);
      expect(hasFile(root, "alembic.ini")).toBe(false);
      expect(hasFile(root, "migrations/env.py")).toBe(false);
    });
  });

  describe("Pydantic Validation", () => {
    it("should include Pydantic dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-pydantic-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "pydantic",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("pydantic");
      expect(pyprojectContent).toContain("pydantic-settings");
    });
  });

  describe("AI/ML Frameworks", () => {
    it("should include LangChain dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-langchain-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: ["langchain"],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("langchain");
      expect(pyprojectContent).toContain("langchain-openai");
    });

    it("should include OpenAI SDK dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-openai-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: ["openai-sdk"],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("openai");
    });

    it("should include Anthropic SDK dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-anthropic-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: ["anthropic-sdk"],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("anthropic");
    });

    it("should include multiple AI frameworks", async () => {
      const result = await createVirtual({
        projectName: "python-multi-ai-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: ["langchain", "openai-sdk", "anthropic-sdk"],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("langchain");
      expect(pyprojectContent).toContain("openai");
      expect(pyprojectContent).toContain("anthropic");
    });
  });

  describe("Celery Task Queue", () => {
    it("should include Celery dependencies in pyproject.toml", async () => {
      const result = await createVirtual({
        projectName: "python-celery-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "celery",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("celery");
    });
  });

  describe("Ruff Quality Tool", () => {
    it("should include Ruff in dev dependencies and configuration", async () => {
      const result = await createVirtual({
        projectName: "python-ruff-deps",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "ruff",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();
      expect(pyprojectContent).toContain("ruff");
      expect(pyprojectContent).toContain("[tool.ruff]");
      expect(pyprojectContent).toContain("[tool.ruff.lint]");
      expect(pyprojectContent).toContain("[tool.ruff.format]");
    });
  });

  describe("README Generation", () => {
    it("should generate README with FastAPI instructions", async () => {
      const result = await createVirtual({
        projectName: "python-fastapi-readme",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const readmeContent = getFileContent(root, "README.md");
      expect(readmeContent).toBeDefined();
      expect(readmeContent).toContain("python-fastapi-readme");
      expect(readmeContent).toContain("FastAPI");
      expect(readmeContent).toContain("uv sync");
      expect(readmeContent).toContain("uvicorn");
    });

    it("should generate README with Django instructions", async () => {
      const result = await createVirtual({
        projectName: "python-django-readme",
        ecosystem: "python",
        pythonWebFramework: "django",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const readmeContent = getFileContent(root, "README.md");
      expect(readmeContent).toBeDefined();
      expect(readmeContent).toContain("python-django-readme");
      expect(readmeContent).toContain("Django");
      expect(readmeContent).toContain("uv sync");
    });
  });

  describe("Full Stack Python Project", () => {
    it("should create a full-featured Python project with all options", async () => {
      const result = await createVirtual({
        projectName: "python-fullstack",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "sqlalchemy",
        pythonValidation: "pydantic",
        pythonAi: ["langchain", "openai-sdk"],
        pythonTaskQueue: "celery",
        pythonQuality: "ruff",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      const pyprojectContent = getFileContent(root, "pyproject.toml");
      expect(pyprojectContent).toBeDefined();

      // Verify all dependencies are included
      expect(pyprojectContent).toContain("fastapi");
      expect(pyprojectContent).toContain("uvicorn");
      expect(pyprojectContent).toContain("sqlalchemy");
      expect(pyprojectContent).toContain("alembic");
      expect(pyprojectContent).toContain("pydantic");
      expect(pyprojectContent).toContain("langchain");
      expect(pyprojectContent).toContain("openai");
      expect(pyprojectContent).toContain("celery");
      expect(pyprojectContent).toContain("ruff");
    });
  });

  describe("Python Ecosystem Isolation", () => {
    it("should not include TypeScript options when Python is selected", async () => {
      const result = await createVirtual({
        projectName: "python-isolated",
        ecosystem: "python",
        pythonWebFramework: "fastapi",
        pythonOrm: "none",
        pythonValidation: "none",
        pythonAi: [],
        pythonTaskQueue: "none",
        pythonQuality: "none",
      });

      expect(result.success).toBe(true);
      const root = result.tree!.root;

      // Should not have TypeScript files
      expect(hasFile(root, "package.json")).toBe(false);
      expect(hasFile(root, "tsconfig.json")).toBe(false);

      // Should not have Rust files
      expect(hasFile(root, "Cargo.toml")).toBe(false);
    });
  });
});

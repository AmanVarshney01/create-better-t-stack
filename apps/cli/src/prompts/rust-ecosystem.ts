import type {
  RustApi,
  RustCli,
  RustFrontend,
  RustLibraries,
  RustOrm,
  RustWebFramework,
} from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableMultiselect, navigableSelect } from "./navigable";

export async function getRustWebFrameworkChoice(rustWebFramework?: RustWebFramework) {
  if (rustWebFramework !== undefined) return rustWebFramework;

  const options = [
    {
      value: "axum" as const,
      label: "Axum",
      hint: "Ergonomic and modular web framework from Tokio",
    },
    {
      value: "actix-web" as const,
      label: "Actix Web",
      hint: "Powerful, pragmatic, and extremely fast web framework",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No web framework",
    },
  ];

  const response = await navigableSelect<RustWebFramework>({
    message: "Select Rust web framework",
    options,
    initialValue: "axum",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getRustFrontendChoice(rustFrontend?: RustFrontend) {
  if (rustFrontend !== undefined) return rustFrontend;

  const options = [
    {
      value: "leptos" as const,
      label: "Leptos",
      hint: "Build fast web applications with Rust",
    },
    {
      value: "dioxus" as const,
      label: "Dioxus",
      hint: "Fullstack, cross-platform UI library for Rust",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No Rust frontend (API only)",
    },
  ];

  const response = await navigableSelect<RustFrontend>({
    message: "Select Rust frontend framework",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getRustOrmChoice(rustOrm?: RustOrm) {
  if (rustOrm !== undefined) return rustOrm;

  const options = [
    {
      value: "sea-orm" as const,
      label: "SeaORM",
      hint: "Async & dynamic ORM for Rust",
    },
    {
      value: "sqlx" as const,
      label: "SQLx",
      hint: "Async SQL toolkit with compile-time checked queries",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No database layer",
    },
  ];

  const response = await navigableSelect<RustOrm>({
    message: "Select Rust ORM/database layer",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getRustApiChoice(rustApi?: RustApi) {
  if (rustApi !== undefined) return rustApi;

  const options = [
    {
      value: "tonic" as const,
      label: "Tonic",
      hint: "gRPC implementation for Rust",
    },
    {
      value: "async-graphql" as const,
      label: "async-graphql",
      hint: "High-performance GraphQL server library",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "REST API only",
    },
  ];

  const response = await navigableSelect<RustApi>({
    message: "Select Rust API layer",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getRustCliChoice(rustCli?: RustCli) {
  if (rustCli !== undefined) return rustCli;

  const options = [
    {
      value: "clap" as const,
      label: "Clap",
      hint: "Command Line Argument Parser for Rust",
    },
    {
      value: "ratatui" as const,
      label: "Ratatui",
      hint: "Build rich terminal user interfaces",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No CLI tools",
    },
  ];

  const response = await navigableSelect<RustCli>({
    message: "Select Rust CLI tools",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getRustLibrariesChoice(rustLibraries?: RustLibraries[]) {
  if (rustLibraries !== undefined) return rustLibraries;

  const options = [
    {
      value: "serde" as const,
      label: "Serde",
      hint: "Serialization framework for Rust",
    },
    {
      value: "validator" as const,
      label: "Validator",
      hint: "Struct validation derive macros",
    },
    {
      value: "jsonwebtoken" as const,
      label: "jsonwebtoken",
      hint: "JWT encoding/decoding library",
    },
    {
      value: "argon2" as const,
      label: "Argon2",
      hint: "Password hashing library",
    },
    {
      value: "tokio-test" as const,
      label: "Tokio Test",
      hint: "Testing utilities for Tokio",
    },
    {
      value: "mockall" as const,
      label: "Mockall",
      hint: "Powerful mocking library for Rust",
    },
  ];

  const response = await navigableMultiselect({
    message: "Select Rust libraries",
    options,
    required: false,
    initialValues: ["serde"],
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response as RustLibraries[];
}

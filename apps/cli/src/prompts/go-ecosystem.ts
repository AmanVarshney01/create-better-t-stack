import type { GoApi, GoCli, GoLogging, GoOrm, GoWebFramework } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getGoWebFrameworkChoice(goWebFramework?: GoWebFramework) {
  if (goWebFramework !== undefined) return goWebFramework;

  const options = [
    {
      value: "gin" as const,
      label: "Gin",
      hint: "High-performance HTTP web framework with martini-like API",
    },
    {
      value: "echo" as const,
      label: "Echo",
      hint: "High performance, minimalist Go web framework",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No web framework",
    },
  ];

  const response = await navigableSelect<GoWebFramework>({
    message: "Select Go web framework",
    options,
    initialValue: "gin",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getGoOrmChoice(goOrm?: GoOrm) {
  if (goOrm !== undefined) return goOrm;

  const options = [
    {
      value: "gorm" as const,
      label: "GORM",
      hint: "The fantastic ORM library for Golang",
    },
    {
      value: "sqlc" as const,
      label: "sqlc",
      hint: "Generate type-safe Go code from SQL",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No ORM/database layer",
    },
  ];

  const response = await navigableSelect<GoOrm>({
    message: "Select Go ORM/database layer",
    options,
    initialValue: "gorm",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getGoApiChoice(goApi?: GoApi) {
  if (goApi !== undefined) return goApi;

  const options = [
    {
      value: "grpc-go" as const,
      label: "gRPC-Go",
      hint: "The Go implementation of gRPC",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No API layer",
    },
  ];

  const response = await navigableSelect<GoApi>({
    message: "Select Go API layer",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getGoCliChoice(goCli?: GoCli) {
  if (goCli !== undefined) return goCli;

  const options = [
    {
      value: "cobra" as const,
      label: "Cobra",
      hint: "Library for creating powerful modern CLI applications",
    },
    {
      value: "bubbletea" as const,
      label: "Bubble Tea",
      hint: "Powerful TUI framework based on The Elm Architecture",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No CLI tools",
    },
  ];

  const response = await navigableSelect<GoCli>({
    message: "Select Go CLI tools",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getGoLoggingChoice(goLogging?: GoLogging) {
  if (goLogging !== undefined) return goLogging;

  const options = [
    {
      value: "zap" as const,
      label: "Zap",
      hint: "Blazing fast, structured, leveled logging in Go",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No logging library",
    },
  ];

  const response = await navigableSelect<GoLogging>({
    message: "Select Go logging library",
    options,
    initialValue: "zap",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

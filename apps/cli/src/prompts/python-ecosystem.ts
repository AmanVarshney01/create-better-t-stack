import type {
  PythonAi,
  PythonOrm,
  PythonQuality,
  PythonTaskQueue,
  PythonValidation,
  PythonWebFramework,
} from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableMultiselect, navigableSelect } from "./navigable";

export async function getPythonWebFrameworkChoice(pythonWebFramework?: PythonWebFramework) {
  if (pythonWebFramework !== undefined) return pythonWebFramework;

  const options = [
    {
      value: "fastapi" as const,
      label: "FastAPI",
      hint: "Modern, fast (high-performance) web framework for building APIs",
    },
    {
      value: "django" as const,
      label: "Django",
      hint: "High-level Python web framework with batteries included",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No web framework",
    },
  ];

  const response = await navigableSelect<PythonWebFramework>({
    message: "Select Python web framework",
    options,
    initialValue: "fastapi",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getPythonOrmChoice(pythonOrm?: PythonOrm) {
  if (pythonOrm !== undefined) return pythonOrm;

  const options = [
    {
      value: "sqlalchemy" as const,
      label: "SQLAlchemy",
      hint: "The SQL toolkit and ORM for Python",
    },
    {
      value: "sqlmodel" as const,
      label: "SQLModel",
      hint: "SQL databases in Python with Pydantic and SQLAlchemy",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No ORM/database layer",
    },
  ];

  const response = await navigableSelect<PythonOrm>({
    message: "Select Python ORM/database layer",
    options,
    initialValue: "sqlalchemy",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getPythonValidationChoice(pythonValidation?: PythonValidation) {
  if (pythonValidation !== undefined) return pythonValidation;

  const options = [
    {
      value: "pydantic" as const,
      label: "Pydantic",
      hint: "Data validation using Python type hints",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No validation library",
    },
  ];

  const response = await navigableSelect<PythonValidation>({
    message: "Select Python validation library",
    options,
    initialValue: "pydantic",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getPythonAiChoice(pythonAi?: PythonAi[]) {
  if (pythonAi !== undefined) return pythonAi;

  const options = [
    {
      value: "langchain" as const,
      label: "LangChain",
      hint: "Building applications with LLMs through composability",
    },
    {
      value: "llamaindex" as const,
      label: "LlamaIndex",
      hint: "Data framework for LLM applications",
    },
    {
      value: "openai-sdk" as const,
      label: "OpenAI SDK",
      hint: "Official OpenAI Python client",
    },
    {
      value: "anthropic-sdk" as const,
      label: "Anthropic SDK",
      hint: "Official Anthropic Claude API client",
    },
    {
      value: "langgraph" as const,
      label: "LangGraph",
      hint: "Graph-based agent orchestration",
    },
    {
      value: "crewai" as const,
      label: "CrewAI",
      hint: "Multi-agent orchestration framework",
    },
  ];

  const response = await navigableMultiselect({
    message: "Select Python AI/ML frameworks",
    options,
    required: false,
    initialValues: [],
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response as PythonAi[];
}

export async function getPythonTaskQueueChoice(pythonTaskQueue?: PythonTaskQueue) {
  if (pythonTaskQueue !== undefined) return pythonTaskQueue;

  const options = [
    {
      value: "celery" as const,
      label: "Celery",
      hint: "Distributed task queue for Python",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No task queue",
    },
  ];

  const response = await navigableSelect<PythonTaskQueue>({
    message: "Select Python task queue",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getPythonQualityChoice(pythonQuality?: PythonQuality) {
  if (pythonQuality !== undefined) return pythonQuality;

  const options = [
    {
      value: "ruff" as const,
      label: "Ruff",
      hint: "An extremely fast Python linter and formatter",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No code quality tools",
    },
  ];

  const response = await navigableSelect<PythonQuality>({
    message: "Select Python code quality tool",
    options,
    initialValue: "ruff",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

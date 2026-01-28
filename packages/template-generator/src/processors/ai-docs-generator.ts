import type { AiDocs, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processAiDocs(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.aiDocs || config.aiDocs.length === 0) return;

  for (const docType of config.aiDocs) {
    if (docType === "none") continue;

    const content = generateContent(config, docType);
    const filename = getFilename(docType);
    if (filename && content) {
      vfs.writeFile(filename, content);
    }
  }
}

function getFilename(docType: AiDocs): string {
  switch (docType) {
    case "claude-md":
      return "CLAUDE.md";
    case "agents-md":
      return "Agents.md";
    case "cursorrules":
      return ".cursorrules";
    default:
      return "";
  }
}

function generateContent(config: ProjectConfig, docType: AiDocs): string {
  if (docType === "cursorrules") {
    return generateCursorRules(config);
  }
  return generateMarkdownDoc(config, docType);
}

function generateMarkdownDoc(config: ProjectConfig, docType: AiDocs): string {
  const sections: string[] = [];

  sections.push(`# ${config.projectName}\n`);
  sections.push(`This file provides context about the project for AI assistants.\n`);

  sections.push(`## Project Overview\n`);
  sections.push(`- **Ecosystem**: ${capitalizeFirst(config.ecosystem)}`);

  sections.push(generateTechStackSection(config));
  sections.push(generateStructureSection(config));
  sections.push(generateCommandsSection(config));
  sections.push(generateMaintenanceSection(docType));

  return sections.join("\n");
}

function generateTechStackSection(config: ProjectConfig): string {
  const lines: string[] = ["\n## Tech Stack\n"];

  if (config.ecosystem === "typescript") {
    lines.push(`- **Runtime**: ${config.runtime}`);
    lines.push(`- **Package Manager**: ${config.packageManager}`);

    if (config.frontend?.length && !config.frontend.includes("none")) {
      lines.push(`\n### Frontend`);
      lines.push(`- Framework: ${config.frontend.join(", ")}`);
      if (config.cssFramework !== "none") lines.push(`- CSS: ${config.cssFramework}`);
      if (config.uiLibrary !== "none") lines.push(`- UI Library: ${config.uiLibrary}`);
      if (config.stateManagement !== "none") lines.push(`- State: ${config.stateManagement}`);
    }

    if (config.backend !== "none") {
      lines.push(`\n### Backend`);
      lines.push(`- Framework: ${config.backend}`);
      if (config.api !== "none") lines.push(`- API: ${config.api}`);
      if (config.validation !== "none") lines.push(`- Validation: ${config.validation}`);
    }

    if (config.database !== "none") {
      lines.push(`\n### Database`);
      lines.push(`- Database: ${config.database}`);
      if (config.orm !== "none") lines.push(`- ORM: ${config.orm}`);
    }

    if (config.auth !== "none") {
      lines.push(`\n### Authentication`);
      lines.push(`- Provider: ${config.auth}`);
    }

    const additional: string[] = [];
    if (config.testing !== "none") additional.push(`Testing: ${config.testing}`);
    if (config.ai !== "none") additional.push(`AI: ${config.ai}`);
    if (config.email !== "none") additional.push(`Email: ${config.email}`);
    if (config.payments !== "none") additional.push(`Payments: ${config.payments}`);
    if (config.realtime !== "none") additional.push(`Realtime: ${config.realtime}`);
    if (config.jobQueue !== "none") additional.push(`Job Queue: ${config.jobQueue}`);
    if (config.caching !== "none") additional.push(`Caching: ${config.caching}`);
    if (config.cms !== "none") additional.push(`CMS: ${config.cms}`);
    if (config.logging !== "none") additional.push(`Logging: ${config.logging}`);
    if (config.observability !== "none") additional.push(`Observability: ${config.observability}`);

    if (additional.length > 0) {
      lines.push(`\n### Additional Features`);
      additional.forEach((f) => lines.push(`- ${f}`));
    }
  }

  if (config.ecosystem === "rust") {
    if (config.rustWebFramework !== "none")
      lines.push(`- Web Framework: ${config.rustWebFramework}`);
    if (config.rustFrontend !== "none") lines.push(`- Frontend: ${config.rustFrontend}`);
    if (config.rustOrm !== "none") lines.push(`- Database: ${config.rustOrm}`);
    if (config.rustApi !== "none") lines.push(`- API: ${config.rustApi}`);
    if (config.rustCli !== "none") lines.push(`- CLI: ${config.rustCli}`);
    if (config.rustLibraries?.length) {
      const libs = config.rustLibraries.filter((l) => l !== "none");
      if (libs.length > 0) lines.push(`- Libraries: ${libs.join(", ")}`);
    }
  }

  if (config.ecosystem === "python") {
    if (config.pythonWebFramework !== "none")
      lines.push(`- Web Framework: ${config.pythonWebFramework}`);
    if (config.pythonOrm !== "none") lines.push(`- ORM: ${config.pythonOrm}`);
    if (config.pythonValidation !== "none") lines.push(`- Validation: ${config.pythonValidation}`);
    if (config.pythonAi?.length) {
      const aiLibs = config.pythonAi.filter((l) => l !== "none");
      if (aiLibs.length > 0) lines.push(`- AI: ${aiLibs.join(", ")}`);
    }
    if (config.pythonTaskQueue !== "none") lines.push(`- Task Queue: ${config.pythonTaskQueue}`);
    if (config.pythonQuality !== "none") lines.push(`- Code Quality: ${config.pythonQuality}`);
  }

  if (config.ecosystem === "go") {
    if (config.goWebFramework !== "none") lines.push(`- Web Framework: ${config.goWebFramework}`);
    if (config.goOrm !== "none") lines.push(`- Database: ${config.goOrm}`);
    if (config.goApi !== "none") lines.push(`- API: ${config.goApi}`);
    if (config.goCli !== "none") lines.push(`- CLI: ${config.goCli}`);
    if (config.goLogging !== "none") lines.push(`- Logging: ${config.goLogging}`);
  }

  return lines.join("\n");
}

function generateStructureSection(config: ProjectConfig): string {
  const lines: string[] = ["\n## Project Structure\n"];

  if (config.ecosystem === "typescript") {
    lines.push("```");
    lines.push(`${config.projectName}/`);
    lines.push("├── apps/");

    const hasWeb = config.frontend?.some(
      (f) => !["none", "native-bare", "native-uniwind", "native-unistyles"].includes(f),
    );
    const hasNative = config.frontend?.some((f) =>
      ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
    );
    const isBackendSelf = config.backend === "self";

    if (hasWeb) {
      lines.push("│   ├── web/         # Frontend application");
    }
    if (hasNative) {
      lines.push("│   ├── native/      # Mobile application (React Native)");
    }
    if (config.backend !== "none" && !isBackendSelf) {
      lines.push("│   └── server/      # Backend API");
    }

    lines.push("├── packages/");
    if (config.api !== "none") {
      lines.push("│   ├── api/         # API layer");
    }
    if (config.auth !== "none") {
      lines.push("│   ├── auth/        # Authentication");
    }
    if (config.database !== "none") {
      lines.push("│   └── db/          # Database schema");
    }
    lines.push("```");
  } else if (config.ecosystem === "rust") {
    lines.push("```");
    lines.push(`${config.projectName}/`);
    lines.push("├── Cargo.toml       # Workspace manifest");
    lines.push("├── crates/");
    lines.push("│   └── server/      # Backend server");
    if (config.rustFrontend !== "none") {
      lines.push(
        `│   └── ${config.rustFrontend === "leptos" ? "client" : "dioxus-client"}/    # WASM frontend`,
      );
    }
    lines.push("```");
  } else if (config.ecosystem === "python") {
    lines.push("```");
    lines.push(`${config.projectName}/`);
    lines.push("├── pyproject.toml   # Project config");
    lines.push("├── src/");
    lines.push("│   └── app/         # Application code");
    lines.push("├── tests/           # Test suite");
    if (config.pythonOrm !== "none") {
      lines.push("├── migrations/      # Database migrations");
    }
    lines.push("```");
  } else if (config.ecosystem === "go") {
    lines.push("```");
    lines.push(`${config.projectName}/`);
    lines.push("├── go.mod           # Module definition");
    lines.push("├── cmd/");
    lines.push("│   └── server/      # Server entry point");
    if (config.goOrm !== "none") {
      lines.push("├── internal/        # Internal packages");
    }
    if (config.goApi === "grpc-go") {
      lines.push("├── proto/           # Protocol buffers");
    }
    lines.push("```");
  }

  return lines.join("\n");
}

function generateCommandsSection(config: ProjectConfig): string {
  const lines: string[] = ["\n## Common Commands\n"];

  if (config.ecosystem === "typescript") {
    const pm = config.packageManager;
    const run = pm === "npm" ? "npm run" : pm;
    lines.push(`- \`${pm} install\` - Install dependencies`);
    lines.push(`- \`${run} dev\` - Start development server`);
    lines.push(`- \`${run} build\` - Build for production`);
    if (config.testing !== "none") {
      lines.push(`- \`${run} test\` - Run tests`);
    }
    if (config.database !== "none") {
      lines.push(`- \`${run} db:push\` - Push database schema`);
      lines.push(`- \`${run} db:studio\` - Open database UI`);
    }
  } else if (config.ecosystem === "rust") {
    lines.push(`- \`cargo build\` - Build project`);
    lines.push(`- \`cargo run\` - Run project`);
    lines.push(`- \`cargo test\` - Run tests`);
    lines.push(`- \`cargo clippy\` - Run linter`);
    lines.push(`- \`cargo fmt\` - Format code`);
  } else if (config.ecosystem === "python") {
    lines.push(`- \`uv sync\` - Install dependencies`);
    if (config.pythonWebFramework === "fastapi") {
      lines.push(`- \`uv run uvicorn app.main:app --reload\` - Start dev server`);
    } else {
      lines.push(`- \`uv run python -m app.main\` - Run application`);
    }
    lines.push(`- \`uv run pytest\` - Run tests`);
    if (config.pythonQuality === "ruff") {
      lines.push(`- \`uv run ruff check .\` - Run linter`);
      lines.push(`- \`uv run ruff format .\` - Format code`);
    }
  } else if (config.ecosystem === "go") {
    lines.push(`- \`go mod tidy\` - Install dependencies`);
    lines.push(`- \`go run cmd/server/main.go\` - Start server`);
    lines.push(`- \`go test ./...\` - Run tests`);
    lines.push(`- \`go fmt ./...\` - Format code`);
  }

  return lines.join("\n");
}

function generateMaintenanceSection(docType: AiDocs): string {
  const fileName =
    docType === "claude-md" ? "CLAUDE.md" : docType === "agents-md" ? "Agents.md" : "this file";

  return `
## Maintenance

Keep ${fileName} updated when:
- Adding/removing dependencies
- Changing project structure
- Adding new features or services
- Modifying build/dev workflows

AI assistants should suggest updates to this file when they notice relevant changes.
`;
}

function generateCursorRules(config: ProjectConfig): string {
  const rules: string[] = [];

  rules.push(`# Project: ${config.projectName}`);
  rules.push(`# Ecosystem: ${capitalizeFirst(config.ecosystem)}`);
  rules.push(``);

  if (config.ecosystem === "typescript") {
    rules.push(`You are working on a TypeScript project.`);
    if (config.runtime !== "none") rules.push(`Runtime: ${config.runtime}`);
    if (config.packageManager) rules.push(`Package manager: ${config.packageManager}`);
    if (config.frontend?.length && !config.frontend.includes("none")) {
      rules.push(`Frontend: ${config.frontend.join(", ")}`);
    }
    if (config.backend !== "none") rules.push(`Backend: ${config.backend}`);
    if (config.database !== "none") {
      rules.push(
        `Database: ${config.database}${config.orm !== "none" ? ` with ${config.orm}` : ""}`,
      );
    }
    if (config.api !== "none") rules.push(`API: ${config.api}`);
    if (config.auth !== "none") rules.push(`Auth: ${config.auth}`);
    if (config.testing !== "none") rules.push(`Testing: ${config.testing}`);
    if (config.validation !== "none") rules.push(`Validation: ${config.validation}`);
  } else if (config.ecosystem === "rust") {
    rules.push(`You are working on a Rust project.`);
    if (config.rustWebFramework !== "none") rules.push(`Web framework: ${config.rustWebFramework}`);
    if (config.rustFrontend !== "none") rules.push(`Frontend: ${config.rustFrontend}`);
    if (config.rustOrm !== "none") rules.push(`Database: ${config.rustOrm}`);
    if (config.rustApi !== "none") rules.push(`API: ${config.rustApi}`);
  } else if (config.ecosystem === "python") {
    rules.push(`You are working on a Python project.`);
    if (config.pythonWebFramework !== "none")
      rules.push(`Web framework: ${config.pythonWebFramework}`);
    if (config.pythonOrm !== "none") rules.push(`ORM: ${config.pythonOrm}`);
    if (config.pythonValidation !== "none") rules.push(`Validation: ${config.pythonValidation}`);
    if (config.pythonQuality !== "none") rules.push(`Code quality: ${config.pythonQuality}`);
  } else if (config.ecosystem === "go") {
    rules.push(`You are working on a Go project.`);
    if (config.goWebFramework !== "none") rules.push(`Web framework: ${config.goWebFramework}`);
    if (config.goOrm !== "none") rules.push(`Database: ${config.goOrm}`);
    if (config.goApi !== "none") rules.push(`API: ${config.goApi}`);
    if (config.goLogging !== "none") rules.push(`Logging: ${config.goLogging}`);
  }

  rules.push(``);
  rules.push(`Follow existing code patterns and conventions.`);
  rules.push(`Use the established project structure.`);
  rules.push(`Keep this file updated when the project structure changes.`);

  return rules.join("\n");
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

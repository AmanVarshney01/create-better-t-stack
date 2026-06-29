// Static guidance for choosing a valid Better T Stack configuration.
// Kept dependency-free so it can be shared by the MCP server and other
// integrations (e.g. the opencode plugin) without pulling in the MCP SDK.
export function getStackGuidance() {
  return {
    workflow: [
      "Call bts_get_schema or bts_get_stack_guidance before constructing a config if the request is ambiguous.",
      "For project creation, build a full explicit config before calling bts_plan_project.",
      "Always call bts_plan_project before bts_create_project.",
      "Only call bts_create_project after the plan succeeds and matches the user's intent.",
      "Use bts_plan_addons before bts_add_addons for existing projects.",
    ],
    createContract: {
      requiresExplicitFields: [
        "projectName",
        "frontend",
        "backend",
        "runtime",
        "database",
        "orm",
        "api",
        "auth",
        "payments",
        "addons",
        "examples",
        "git",
        "packageManager",
        "install",
        "dbSetup",
        "webDeploy",
        "serverDeploy",
      ],
      optionalFields: ["addonOptions", "dbSetupOptions", "directoryConflict"],
      rule: "Do not call bts_plan_project or bts_create_project with a partial payload. MCP project creation requires the full explicit stack config.",
    },
    fieldNotes: {
      frontend:
        "frontend is for app surfaces only. Choose explicit app targets such as next, react-router, tanstack-router, native-bare, native-uniwind, or native-unistyles.",
      addons: "addons must be an explicit array. Use [] when no addons are requested.",
      examples: "examples must be an explicit array. Use [] when no examples are requested.",
      dbSetup:
        "dbSetup is always required. Use 'none' when no managed database provisioning is requested.",
      webDeploy:
        "webDeploy is always required. Use 'none' when no web deployment target is requested.",
      serverDeploy:
        "serverDeploy is always required. Use 'none' when no server deployment target is requested.",
      packageManager:
        "packageManager is always required because installation and reproducible commands depend on it.",
      install:
        "install is always required. For MCP project creation, prefer false because many clients enforce request timeouts around long-running dependency installs.",
      git: "git is always required. Set it to true or false explicitly instead of relying on defaults.",
    },
    ambiguityRules: [
      "If the user request leaves major stack choices unspecified, stop and resolve them before calling bts_plan_project.",
      "Do not infer extra app surfaces, addons, examples, or provisioning choices from a template name or styling preference.",
      "If the user wants the smallest valid stack, still send the full config with explicit 'none', [] , true, or false values where appropriate.",
      "For MCP execution, scaffold with install=false and let the user or agent run dependency installation separately from a terminal session.",
    ],
  };
}

export type FumadocsTemplate =
  | "next-mdx"
  | "next-mdx-static"
  | "waku"
  | "react-router"
  | "react-router-spa"
  | "tanstack-start"
  | "tanstack-start-spa";

export type WxtTemplate = "vanilla" | "vue" | "react" | "solid" | "svelte";

export type AddonSetupStatus = "planned" | "skipped" | "success" | "warning" | "failed";

export type ExternalAddonStepReport = {
  addon: string;
  status: AddonSetupStatus;
  selectedOptions?: Record<string, unknown>;
  commands?: string[];
  postChecks?: string[];
  warning?: string;
  error?: string;
};

export type AddonOptionsInput = {
  fumadocs?: {
    template?: FumadocsTemplate;
  };
  wxt?: {
    template?: WxtTemplate;
  };
  mcp?: {
    scope?: "project" | "global";
    agents?: string[];
    serverKeys?: string[];
  };
  skills?: {
    scope?: "project" | "global";
    agents?: string[];
    skillKeys?: string[];
  };
};

export type AddonSetupContext = {
  interactive?: boolean;
  addonOptions?: AddonOptionsInput;
  collectExternalReport?: (report: ExternalAddonStepReport) => void;
};

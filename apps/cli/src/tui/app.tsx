/**
 * TUI Entry Point using @opentui/react
 * Stacked prompt design EXACTLY matching src/prompts/*
 */
import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useState, useCallback, useEffect } from "react";
import { useLogger } from "./use-logger";
import type { ProjectConfig } from "../types";
import { getDefaultConfig, DEFAULT_CONFIG } from "../constants";

// Import theme
import { theme } from "./theme";

// Import steps configuration
import { STEPS, type StepConfig } from "./steps";

// Import components
import {
  Logo,
  Spinner,
  StatusBar,
  type Phase,
  InputPrompt,
  SelectPrompt,
  MultiSelectPrompt,
  ConfirmPrompt,
} from "./components";

// Types
export interface TuiOptions {
  initialConfig?: Partial<ProjectConfig>;
  onComplete: (config: ProjectConfig) => Promise<void>;
  onCancel: () => void;
}

// Log display using the logger hook
function LogDisplay() {
  const logs = useLogger();

  const getLogIcon = (level: string) => {
    switch (level) {
      case "success":
        return { icon: "✓", color: theme.success };
      case "error":
        return { icon: "✗", color: theme.error };
      case "warn":
        return { icon: "⚠", color: "#f59e0b" };
      case "step":
        return { icon: "→", color: theme.primary };
      default:
        return { icon: "ℹ", color: theme.muted };
    }
  };

  return (
    <box style={{ flexDirection: "column" }}>
      {logs.slice(-15).map((log) => {
        const { icon, color } = getLogIcon(log.level);
        return (
          <text key={log.id}>
            <span fg={color}>{icon}</span>
            <span fg={theme.text}> {log.message}</span>
          </text>
        );
      })}
    </box>
  );
}

// Main App component
function App(props: {
  initialConfig?: Partial<ProjectConfig>;
  onComplete: (config: ProjectConfig) => Promise<void>;
  onExit: () => void;
}) {
  const { width, height } = useTerminalDimensions();
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<any>(props.initialConfig ?? {});
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<Phase>("prompts");
  const [finalConfig, setFinalConfig] = useState<ProjectConfig | null>(null);
  const [creationStatus, setCreationStatus] = useState("Preparing...");

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") props.onExit();
    // Exit on any key when done
    if (phase === "done" && key.name !== "c") {
      process.exit(0);
    }
  });

  const updateConfig = useCallback((key: string, value: any) => {
    setConfig((prev: any) => {
      const newConfig = { ...prev, [key]: value };
      if (key === "webFramework" || key === "nativeFramework" || key === "projectType") {
        const frontends: string[] = [];
        if (newConfig.webFramework) frontends.push(newConfig.webFramework);
        if (newConfig.nativeFramework) frontends.push(newConfig.nativeFramework);
        newConfig.frontend = frontends.length > 0 ? frontends : [];
      }
      return newConfig;
    });
  }, []);

  const getVisibleSteps = useCallback(() => {
    const visible: { step: StepConfig; index: number }[] = [];
    for (let i = 0; i < STEPS.length; i++) {
      const step = STEPS[i];
      if (!step.skip || !step.skip(config)) visible.push({ step, index: i });
    }
    return visible;
  }, [config]);

  const visibleSteps = getVisibleSteps();
  const currentVisibleIndex = visibleSteps.findIndex((v) => v.index === stepIndex);

  const goNext = useCallback(() => {
    // Use setConfig to get the latest config value (avoids stale closure)
    setConfig((currentConfig: any) => {
      let next = stepIndex + 1;
      while (next < STEPS.length) {
        const step = STEPS[next];
        // Check skip with the CURRENT config, not stale closure
        if (!step.skip || !step.skip(currentConfig)) {
          setStepIndex(next);
          return currentConfig; // Return unchanged config
        }
        // Auto-set default for skipped steps
        if (step.getDefault) {
          currentConfig = { ...currentConfig, [step.id]: step.getDefault(currentConfig) };
        }
        next++;
      }
      setCompleted(true);
      return currentConfig;
    });
  }, [stepIndex]);

  const goPrev = useCallback(() => {
    let prev = stepIndex - 1;
    while (prev >= 0) {
      const step = STEPS[prev];
      if (!step.skip || !step.skip(config)) {
        setStepIndex(prev);
        return;
      }
      prev--;
    }
  }, [stepIndex, config]);

  // Start project creation when prompts are completed
  useEffect(() => {
    if (completed && phase === "prompts") {
      setPhase("creating");
      setCreationStatus("Creating project...");
      const defaultConfig = getDefaultConfig();
      const fullConfig: ProjectConfig = {
        projectName: config.projectName || defaultConfig.projectName,
        projectDir: process.cwd() + "/" + (config.projectName || defaultConfig.projectName),
        relativePath: config.projectName || defaultConfig.projectName,
        frontend: config.frontend || defaultConfig.frontend,
        backend: config.backend || defaultConfig.backend,
        runtime: config.runtime || defaultConfig.runtime,
        database: config.database || defaultConfig.database,
        orm: config.orm || defaultConfig.orm,
        auth: config.auth || defaultConfig.auth,
        payments: config.payments || defaultConfig.payments,
        addons: config.addons || defaultConfig.addons,
        examples: config.examples || defaultConfig.examples,
        git: config.git ?? defaultConfig.git,
        packageManager: config.packageManager || defaultConfig.packageManager,
        install: config.install ?? defaultConfig.install,
        dbSetup: config.dbSetup || defaultConfig.dbSetup,
        api: config.api || defaultConfig.api,
        webDeploy: config.webDeploy || defaultConfig.webDeploy,
        serverDeploy: config.serverDeploy || defaultConfig.serverDeploy,
      };
      setFinalConfig(fullConfig);
      props.onComplete(fullConfig).then(() => {
        setPhase("done");
      });
    }
  }, [completed, phase, config, props.onComplete]);

  const currentStep = STEPS[stepIndex];
  const getOptions = (step: StepConfig) => step.getOptions?.(config) ?? step.options ?? [];

  const getValue = (stepId: string) => {
    const val = config[stepId];
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return val ?? "";
  };

  const getRunCommand = () =>
    config.packageManager === "npm"
      ? "npm run"
      : config.packageManager === "pnpm"
        ? "pnpm run"
        : "bun run";

  // Responsive: hide header on very narrow terminals
  const showHeader = width >= 50;

  return (
    <box style={{ width, height, backgroundColor: theme.bg, flexDirection: "column" }}>
      {/* Header - hidden on very narrow terminals */}
      {showHeader && (
        <box
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 1,
          }}
        >
          <Logo />
        </box>
      )}

      <box
        style={{
          flexGrow: 1,
          flexDirection: "column",
          padding: 1,
          paddingLeft: 2,
          overflow: "scroll",
        }}
      >
        {/* Prompts Phase */}
        {phase === "prompts" && (
          <box style={{ flexDirection: "column" }}>
            {/* Completed steps - compact list */}
            {visibleSteps.slice(0, currentVisibleIndex).map(({ step }) => (
              <box key={step.id} style={{ flexDirection: "row", marginBottom: 0 }}>
                <text>
                  <span fg={theme.success}>◆</span>
                  <span fg={theme.muted}> {step.title}: </span>
                  <span fg={theme.text}>{getValue(step.id) || "none"}</span>
                </text>
              </box>
            ))}

            {/* Current step - prominent with spacing */}
            {!completed && currentStep && (
              <box style={{ marginTop: currentVisibleIndex > 0 ? 1 : 0, flexDirection: "column" }}>
                <box style={{ flexDirection: "row", marginBottom: 1 }}>
                  <text>
                    <span fg={theme.primary}>◇</span>
                    <span fg={theme.text}> {currentStep.title}</span>
                  </text>
                </box>
                {currentStep.type === "input" && (
                  <InputPrompt
                    onSubmit={(v) => {
                      updateConfig(currentStep.id, v);
                      if (currentStep.id === "projectName") {
                        updateConfig("projectDir", process.cwd() + "/" + v);
                        updateConfig("relativePath", v);
                      }
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
                {currentStep.type === "select" && (
                  <SelectPrompt
                    options={getOptions(currentStep)}
                    initialValue={
                      currentStep.getDefault
                        ? currentStep.getDefault(config)
                        : DEFAULT_CONFIG[currentStep.id as keyof typeof DEFAULT_CONFIG]
                    }
                    onSelect={(v) => {
                      updateConfig(currentStep.id, v);
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
                {currentStep.type === "multiselect" && (
                  <MultiSelectPrompt
                    options={getOptions(currentStep)}
                    selected={
                      config[currentStep.id] ??
                      (currentStep.getDefault ? currentStep.getDefault(config) : [])
                    }
                    onSubmit={(v) => {
                      updateConfig(
                        currentStep.id,
                        v.length > 0 ? v : currentStep.id === "projectType" ? ["web"] : [],
                      );
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
                {currentStep.type === "confirm" && (
                  <ConfirmPrompt
                    onSubmit={(v) => {
                      updateConfig(currentStep.id, v);
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
              </box>
            )}
          </box>
        )}

        {/* Creating Phase */}
        {phase === "creating" && (
          <box style={{ flexDirection: "column" }}>
            <Spinner text={creationStatus} />
            <box style={{ marginTop: 1 }}>
              <LogDisplay />
            </box>
          </box>
        )}

        {/* Done Phase */}
        {phase === "done" && finalConfig && (
          <box style={{ flexDirection: "column" }}>
            <text>
              <span fg={theme.success}>✓</span>
              <span fg={theme.text}> Project created successfully!</span>
            </text>
            <box style={{ marginTop: 1 }}>
              <text>
                <span fg={theme.muted}>Next steps:</span>
              </text>
            </box>
            <box style={{ paddingLeft: 2 }}>
              <text>
                <span fg={theme.text}>cd {finalConfig.projectName}</span>
              </text>
            </box>
            <box style={{ paddingLeft: 2 }}>
              <text>
                <span fg={theme.text}>{getRunCommand()} dev</span>
              </text>
            </box>
            <box style={{ marginTop: 1 }}>
              <text>
                <span fg={theme.muted}>Give us a star on GitHub!</span>
              </text>
            </box>
            <box style={{ paddingLeft: 2 }}>
              <text>
                <span fg={theme.primary}>
                  https://github.com/AmanVarshney01/create-better-t-stack
                </span>
              </text>
            </box>
          </box>
        )}
      </box>

      {/* Status Bar */}
      <StatusBar phase={phase} canGoBack={stepIndex > 0} />
    </box>
  );
}

// Entry point
export async function renderTui(options: TuiOptions): Promise<void> {
  const renderer = await createCliRenderer({ exitOnCtrlC: false });

  return new Promise((resolve) => {
    const handleExit = () => {
      // Clean up the renderer before exiting (following opencode pattern)
      try {
        renderer.destroy();
      } catch {
        // Ignore errors during cleanup
      }
      options.onCancel();
      resolve();
      process.exit(0);
    };

    // Handle SIGINT (Ctrl+C) for clean exit
    process.on("SIGINT", handleExit);

    createRoot(renderer).render(
      <App
        initialConfig={options.initialConfig}
        onComplete={async (config) => {
          await options.onComplete(config);
          // Clean up after successful completion
          try {
            renderer.destroy();
          } catch {
            // Ignore errors during cleanup
          }
          resolve();
        }}
        onExit={handleExit}
      />,
    );
  });
}

"use client";

import {
  type PresetConfig,
  type ShadcnBase,
  DEFAULT_PRESETS,
  encodePreset,
} from "@better-t-stack/types";
import { Check, ClipboardCopy, Palette, RotateCcw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { StackState } from "@/lib/constant";
import { cn } from "@/lib/utils";

import { ShadcnExtraOptions } from "./extra-options";
import { chipClasses, fieldLabelClasses } from "./field-controls";
import {
  buildShadcnOptionsUpdate,
  formatPresetFieldValue,
  getPresetConfig,
  parsePresetInput,
  resetShadcnFields,
  type ShadcnFields,
  updatePresetCode,
} from "./helpers";
import { ThemePickerGroups } from "./theme-picker-groups";

// Fixed order of the built-in named presets. `satisfies` keeps this in sync
// with DEFAULT_PRESETS without duplicating the names as a cast.
const NAMED_PRESET_NAMES = [
  "nova",
  "vega",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
] as const satisfies readonly (keyof typeof DEFAULT_PRESETS)[];

type ThemeEditorDialogProps = {
  fields: ShadcnFields;
  onChange: (update: Partial<StackState>) => void;
};

export function ThemeEditorDialog({ fields, onChange }: ThemeEditorDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [presetInput, setPresetInput] = React.useState(fields.shadcnPreset);
  const [presetError, setPresetError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const copyResetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

  // Re-sync the text field whenever the dialog opens or the applied preset
  // changes underneath it (quick picks, reset, edits from a picker).
  React.useEffect(() => {
    if (open) {
      setPresetInput(fields.shadcnPreset);
      setPresetError(null);
    }
  }, [open, fields.shadcnPreset]);

  const config = getPresetConfig(fields.shadcnPreset);
  // Always render a shareable code, even when the stack relies on defaults.
  const effectiveCode = fields.shadcnPreset.length > 0 ? fields.shadcnPreset : encodePreset(config);

  const withPreset = (preset: string) =>
    onChange(
      buildShadcnOptionsUpdate({
        preset,
        base: fields.shadcnBase,
        rtl: fields.shadcnRtl,
        pointer: fields.shadcnPointer,
      }),
    );

  const applyPresetPatch = (patch: Partial<PresetConfig>) => {
    withPreset(updatePresetCode(effectiveCode, patch));
  };

  const applyBase = (base: ShadcnBase) => {
    onChange(
      buildShadcnOptionsUpdate({
        preset: fields.shadcnPreset,
        base,
        rtl: fields.shadcnRtl,
        pointer: fields.shadcnPointer,
      }),
    );
  };

  const applyToggle = (key: "rtl" | "pointer", value: boolean) => {
    onChange(
      buildShadcnOptionsUpdate({
        preset: fields.shadcnPreset,
        base: fields.shadcnBase,
        rtl: key === "rtl" ? value : fields.shadcnRtl,
        pointer: key === "pointer" ? value : fields.shadcnPointer,
      }),
    );
  };

  const commitPresetInput = (raw: string) => {
    if (raw.trim() === "") {
      setPresetError(null);
      withPreset("");
      return;
    }

    const parsed = parsePresetInput(raw);
    if (!parsed.ok) {
      setPresetError(parsed.error);
      return;
    }

    setPresetError(null);
    withPreset(parsed.code);
  };

  const applyNamedPreset = (name: (typeof NAMED_PRESET_NAMES)[number]) => {
    setPresetError(null);
    withPreset(encodePreset(DEFAULT_PRESETS[name]));
  };

  const reset = () => {
    setPresetError(null);
    onChange(resetShadcnFields());
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(effectiveCode);
      setCopied(true);
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }
      copyResetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-[4px] border px-2 py-1.5 font-mono text-[10px] text-primary uppercase tracking-[0.10em] transition-colors duration-150 hover:border-primary"
          />
        }
      >
        <Palette className="h-3 w-3" />
        Customize theme
      </DialogTrigger>

      <DialogContent className="grid max-h-[85vh] grid-cols-1 gap-3 overflow-y-auto bg-fd-background sm:max-w-2xl">
        <DialogHeader className="border-border border-b pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <DialogTitle className="font-mono text-sm font-semibold text-foreground">
              SHADCN_THEME
            </DialogTitle>
          </div>
          <DialogDescription className="font-mono text-xs text-muted-foreground">
            Configure the shadcn design system for your React app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-[4px] border p-3">
          <label className="flex flex-col gap-1">
            <span className={fieldLabelClasses}>Preset code or URL</span>
            <Input
              value={presetInput}
              onChange={(event) => {
                setPresetInput(event.target.value);
                if (presetError) {
                  setPresetError(null);
                }
              }}
              onBlur={(event) => commitPresetInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitPresetInput(presetInput);
                }
              }}
              aria-invalid={!!presetError}
              aria-describedby={presetError ? "shadcn-preset-error" : undefined}
              placeholder="b1x9M8ZeJW or https://ui.shadcn.com/themes?preset=..."
              className="builder-focus-ring font-mono text-[12px]"
            />
          </label>
          <p className="font-mono text-[10px] leading-relaxed text-fd-muted-foreground">
            Build a theme and copy its preset code at{" "}
            <a
              href="https://ui.shadcn.com/create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-fd-foreground"
            >
              ui.shadcn.com/create
            </a>
            .
          </p>
          {presetError && (
            <p
              id="shadcn-preset-error"
              role="alert"
              className="font-mono text-[10px] text-destructive"
            >
              {presetError}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {NAMED_PRESET_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => applyNamedPreset(name)}
                className={cn(chipClasses, "text-fd-muted-foreground hover:text-fd-foreground")}
              >
                {formatPresetFieldValue(name)}
              </button>
            ))}
          </div>
        </div>

        <ThemePickerGroups config={config} onPatch={applyPresetPatch} />

        <ShadcnExtraOptions fields={fields} onBaseChange={applyBase} onToggle={applyToggle} />

        <div className="flex flex-wrap items-center gap-2 rounded-[4px] border p-3">
          <span className={fieldLabelClasses}>Preset</span>
          <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-primary">
            {effectiveCode}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyCode}
            aria-label="Copy preset code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            aria-label="Reset shadcn theme to defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

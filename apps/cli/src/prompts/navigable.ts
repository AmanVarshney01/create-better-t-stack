/**
 * Navigable prompt wrappers using @clack/core
 * These prompts return GO_BACK_SYMBOL when 'b' is pressed (instead of canceling)
 */

import type { Readable, Writable } from "node:stream";

import {
  ConfirmPrompt,
  type Prompt,
  type State,
  GroupMultiSelectPrompt,
  MultiSelectPrompt,
  SelectPrompt,
  isCancel,
} from "@clack/core";
import { limitOptions } from "@clack/prompts";
import pc from "picocolors";

import {
  didLastPromptShowUI as ctxDidLastPromptShowUI,
  getPromptProgress,
  isFirstPrompt as ctxIsFirstPrompt,
  setIsFirstPrompt as ctxSetIsFirstPrompt,
  setLastPromptShownUI as ctxSetLastPromptShownUI,
} from "../utils/context";
import { GO_BACK_SYMBOL } from "../utils/navigation";

const unicode = process.platform !== "win32";
const S_STEP_ACTIVE = unicode ? "◆" : "*";
const S_STEP_CANCEL = unicode ? "■" : "x";
const S_STEP_ERROR = unicode ? "▲" : "x";
const S_STEP_SUBMIT = unicode ? "◇" : "o";
const S_STEP_BACK = unicode ? "↶" : "<";
const S_BAR = unicode ? "│" : "|";
const S_BAR_END = unicode ? "└" : "—";
const S_RADIO_ACTIVE = unicode ? "●" : ">";
const S_RADIO_INACTIVE = unicode ? "○" : " ";
const S_CHECKBOX_ACTIVE = unicode ? "◻" : "[•]";
const S_CHECKBOX_SELECTED = unicode ? "◼" : "[+]";
const S_CHECKBOX_INACTIVE = unicode ? "◻" : "[ ]";
const promptsNavigatingBack = new WeakSet<object>();

function keycap(label: string): string {
  return pc.inverse(` ${label} `);
}

function symbol(state: State) {
  switch (state) {
    case "initial":
    case "active":
      return pc.cyan(S_STEP_ACTIVE);
    case "cancel":
      return pc.red(S_STEP_CANCEL);
    case "error":
      return pc.yellow(S_STEP_ERROR);
    case "submit":
      return pc.green(S_STEP_SUBMIT);
  }
}

const KEYBOARD_HINT = pc.dim(
  `${keycap("↑↓")} move  ${keycap("enter")} choose  ${keycap("b")} back  ${keycap("^c")} cancel`,
);

const KEYBOARD_HINT_FIRST = pc.dim(
  `${keycap("↑↓")} move  ${keycap("enter")} choose  ${keycap("^c")} cancel`,
);

const KEYBOARD_HINT_MULTI = pc.dim(
  `${keycap("↑↓")} move  ${keycap("space")} toggle  ${keycap("enter")} choose  ${keycap("b")} back  ${keycap("^c")} cancel`,
);

const KEYBOARD_HINT_MULTI_FIRST = pc.dim(
  `${keycap("↑↓")} move  ${keycap("space")} toggle  ${keycap("enter")} choose  ${keycap("^c")} cancel`,
);

export const setIsFirstPrompt = ctxSetIsFirstPrompt;
export const setLastPromptShownUI = ctxSetLastPromptShownUI;
export const didLastPromptShowUI = ctxDidLastPromptShowUI;

function getHint(): string {
  return ctxIsFirstPrompt() ? KEYBOARD_HINT_FIRST : KEYBOARD_HINT;
}

function getMultiHint(): string {
  return ctxIsFirstPrompt() ? KEYBOARD_HINT_MULTI_FIRST : KEYBOARD_HINT_MULTI;
}

function activePromptTitle(message: string, state: "active" | "error" = "active"): string {
  const progress = getPromptProgress();
  const eyebrow = progress
    ? `${pc.magenta(pc.bold(progress.section.toUpperCase()))} ${pc.dim(`· ${progress.current}/${progress.total}`)}`
    : pc.dim("SETUP");

  return `${pc.gray(S_BAR)}  ${eyebrow}\n${symbol(state)}  ${pc.bold(message)}\n`;
}

function resolvedPrompt(message: string, value: string, state: "submit" | "cancel"): string {
  const promptMessage = state === "cancel" ? pc.strikethrough(pc.dim(message)) : pc.dim(message);
  return `${symbol(state)}  ${promptMessage} ${pc.dim("›")} ${value}`;
}

function canceledPrompt(prompt: object, message: string, value: string): string {
  if (promptsNavigatingBack.has(prompt)) {
    return `${pc.cyan(S_STEP_BACK)}  ${pc.dim(message)}`;
  }
  return resolvedPrompt(message, value, "cancel");
}

function normalizeValidationMessage(
  validationMessage: string | Error | undefined,
): string | undefined {
  return validationMessage instanceof Error ? validationMessage.message : validationMessage;
}

async function runWithNavigation<T>(prompt: Prompt<T>): Promise<T | symbol> {
  let goBack = false;

  prompt.on("key", (char: string | undefined) => {
    if ((char === "b" || char === "B") && !ctxIsFirstPrompt()) {
      goBack = true;
      promptsNavigatingBack.add(prompt);
      // Use Clack's public state field so the normal keypress finalize path
      // restores raw mode, listeners, and the terminal cursor.
      prompt.state = "cancel";
    }
  });

  ctxSetLastPromptShownUI(true);
  try {
    const result = await prompt.prompt();
    return goBack ? GO_BACK_SYMBOL : (result as T | symbol);
  } finally {
    promptsNavigatingBack.delete(prompt);
  }
}

interface NavigableCommonOptions {
  /** Abort this prompt through Clack's normal cancellation path. */
  signal?: AbortSignal;
  /** Override streams for embedding or deterministic prompt tests. */
  input?: Readable;
  output?: Writable;
}

interface SelectOption<T> {
  value: T;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export interface NavigableSelectOptions<T> extends NavigableCommonOptions {
  message: string;
  options: SelectOption<T>[];
  initialValue?: T;
  maxItems?: number;
}

export async function navigableSelect<T>(opts: NavigableSelectOptions<T>): Promise<T | symbol> {
  const opt = (
    option: SelectOption<T> | undefined,
    state: "inactive" | "active" | "selected" | "cancelled" | "disabled",
  ) => {
    if (!option) return pc.dim("none");
    const label = option.label ?? String(option.value);
    switch (state) {
      case "disabled":
        return `${pc.gray(S_RADIO_INACTIVE)} ${pc.gray(label)}${option.hint ? ` ${pc.dim(`(${option.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${pc.dim(label)}`;
      case "active":
        return `${pc.cyan(S_RADIO_ACTIVE)} ${label}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
      case "cancelled":
        return `${pc.strikethrough(pc.dim(label))}`;
      default:
        return `${pc.dim(S_RADIO_INACTIVE)} ${pc.dim(label)}`;
    }
  };

  const prompt = new SelectPrompt({
    options: opts.options,
    initialValue: opts.initialValue,
    signal: opts.signal,
    input: opts.input,
    output: opts.output,
    render() {
      switch (this.state) {
        case "submit": {
          return resolvedPrompt(opts.message, opt(this.options[this.cursor], "selected"), "submit");
        }
        case "cancel": {
          return canceledPrompt(this, opts.message, opt(this.options[this.cursor], "cancelled"));
        }
        default: {
          const optionsText = limitOptions({
            output: opts.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            columnPadding: 3,
            rowPadding: 5,
            style: (option, active) =>
              opt(option, option.disabled ? "disabled" : active ? "active" : "inactive"),
          }).join(`\n${pc.cyan(S_BAR)}  `);
          const hint = `${pc.gray(S_BAR_END)}  ${getHint()}`;
          return `${activePromptTitle(opts.message)}${pc.cyan(S_BAR)}  ${optionsText}\n${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<T | symbol>;
}

export interface NavigableMultiselectOptions<T> extends NavigableCommonOptions {
  message: string;
  options: SelectOption<T>[];
  initialValues?: T[];
  cursorAt?: T;
  maxItems?: number;
  required?: boolean;
  validate?: (selected: T[] | undefined) => string | Error | undefined;
}

export async function navigableMultiselect<T>(
  opts: NavigableMultiselectOptions<T>,
): Promise<T[] | symbol> {
  const required = opts.required ?? true;

  const opt = (
    option: SelectOption<T>,
    state:
      | "inactive"
      | "active"
      | "selected"
      | "active-selected"
      | "submitted"
      | "cancelled"
      | "disabled",
  ) => {
    const label = option.label ?? String(option.value);
    if (state === "disabled") {
      return `${pc.gray(S_CHECKBOX_INACTIVE)} ${pc.strikethrough(pc.gray(label))}${option.hint ? ` ${pc.dim(`(${option.hint ?? "disabled"})`)}` : ""}`;
    }
    if (state === "active") {
      return `${pc.cyan(S_CHECKBOX_ACTIVE)} ${label}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
    }
    if (state === "selected") {
      return `${pc.green(S_CHECKBOX_SELECTED)} ${pc.dim(label)}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
    }
    if (state === "cancelled") {
      return `${pc.strikethrough(pc.dim(label))}`;
    }
    if (state === "active-selected") {
      return `${pc.green(S_CHECKBOX_SELECTED)} ${label}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
    }
    if (state === "submitted") {
      return `${pc.dim(label)}`;
    }
    return `${pc.dim(S_CHECKBOX_INACTIVE)} ${pc.dim(label)}`;
  };

  const prompt = new MultiSelectPrompt({
    options: opts.options,
    initialValues: opts.initialValues,
    cursorAt: opts.cursorAt,
    required,
    signal: opts.signal,
    input: opts.input,
    output: opts.output,
    validate(selected: T[] | undefined) {
      if (required && (selected === undefined || selected.length === 0)) {
        return `Please select at least one option.\n${pc.reset(pc.dim(`Press ${pc.gray(pc.bgWhite(pc.inverse(" space ")))} to select, ${pc.gray(pc.bgWhite(pc.inverse(" enter ")))} to submit`))}`;
      }
      return normalizeValidationMessage(opts.validate?.(selected));
    },
    render() {
      const value = this.value ?? [];

      const styleOption = (option: SelectOption<T>, active: boolean) => {
        if (option.disabled) {
          return opt(option, "disabled");
        }
        const selected = value.includes(option.value);
        if (active && selected) {
          return opt(option, "active-selected");
        }
        if (selected) {
          return opt(option, "selected");
        }
        return opt(option, active ? "active" : "inactive");
      };

      switch (this.state) {
        case "submit": {
          const submitText =
            this.options
              .filter(({ value: optionValue }) => value.includes(optionValue))
              .map((option) => opt(option, "submitted"))
              .join(pc.dim(", ")) || pc.dim("none");
          return resolvedPrompt(opts.message, submitText, "submit");
        }
        case "cancel": {
          const label =
            this.options
              .filter(({ value: optionValue }) => value.includes(optionValue))
              .map((option) => opt(option, "cancelled"))
              .join(pc.dim(", ")) || pc.dim("none");
          return canceledPrompt(this, opts.message, label);
        }
        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) => (i === 0 ? `${pc.yellow(S_BAR_END)}  ${pc.yellow(ln)}` : `   ${ln}`))
            .join("\n");
          const optionsText = limitOptions({
            output: opts.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            columnPadding: 3,
            rowPadding: footer.split("\n").length + 4,
            style: styleOption,
          }).join(`\n${pc.yellow(S_BAR)}  `);
          return `${activePromptTitle(opts.message, "error")}${pc.yellow(S_BAR)}  ${optionsText}\n${footer}\n`;
        }
        default: {
          const optionsText = limitOptions({
            output: opts.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            columnPadding: 3,
            rowPadding: 5,
            style: styleOption,
          }).join(`\n${pc.cyan(S_BAR)}  `);
          const hint = `${pc.gray(S_BAR_END)}  ${getMultiHint()}`;
          return `${activePromptTitle(opts.message)}${pc.cyan(S_BAR)}  ${optionsText}\n${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<T[] | symbol>;
}

export interface NavigableConfirmOptions extends NavigableCommonOptions {
  message: string;
  active?: string;
  inactive?: string;
  initialValue?: boolean;
}

export async function navigableConfirm(opts: NavigableConfirmOptions): Promise<boolean | symbol> {
  const active = opts.active ?? "Yes";
  const inactive = opts.inactive ?? "No";

  const prompt = new ConfirmPrompt({
    active,
    inactive,
    initialValue: opts.initialValue ?? true,
    signal: opts.signal,
    input: opts.input,
    output: opts.output,
    render() {
      const value = this.value ? active : inactive;

      switch (this.state) {
        case "submit":
          return resolvedPrompt(opts.message, pc.dim(value), "submit");
        case "cancel":
          return canceledPrompt(this, opts.message, pc.strikethrough(pc.dim(value)));
        default: {
          const hint = `${pc.gray(S_BAR_END)}  ${getHint()}`;
          return `${activePromptTitle(opts.message)}${pc.cyan(S_BAR)}  ${
            this.value
              ? `${pc.cyan(S_RADIO_ACTIVE)} ${active}`
              : `${pc.dim(S_RADIO_INACTIVE)} ${pc.dim(active)}`
          } ${pc.dim("/")} ${
            !this.value
              ? `${pc.cyan(S_RADIO_ACTIVE)} ${inactive}`
              : `${pc.dim(S_RADIO_INACTIVE)} ${pc.dim(inactive)}`
          }\n${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<boolean | symbol>;
}

export interface GroupMultiSelectOption<T> {
  value: T;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export interface NavigableGroupMultiselectOptions<T> extends NavigableCommonOptions {
  message: string;
  options: Record<string, GroupMultiSelectOption<T>[]>;
  initialValues?: T[];
  cursorAt?: T;
  maxItems?: number;
  required?: boolean;
  validate?: (selected: T[] | undefined) => string | Error | undefined;
}

export async function navigableGroupMultiselect<T>(
  opts: NavigableGroupMultiselectOptions<T>,
): Promise<T[] | symbol> {
  const required = opts.required ?? true;

  const opt = (
    option: GroupMultiSelectOption<T> & { group: string | boolean },
    state:
      | "inactive"
      | "active"
      | "selected"
      | "active-selected"
      | "group-active"
      | "group-active-selected"
      | "submitted"
      | "cancelled",
    options: (GroupMultiSelectOption<T> & { group: string | boolean })[] = [],
  ) => {
    const label = option.label ?? String(option.value);
    const isItem = typeof option.group === "string";
    const next = isItem && (options[options.indexOf(option) + 1] ?? { group: true });
    const isLast = isItem && next && next.group === true;
    const prefix = isItem ? `${isLast ? S_BAR_END : S_BAR} ` : "";

    if (state === "active") {
      return `${pc.dim(prefix)}${pc.cyan(S_CHECKBOX_ACTIVE)} ${label}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
    }
    if (state === "group-active") {
      return `${prefix}${pc.cyan(S_CHECKBOX_ACTIVE)} ${pc.dim(label)}`;
    }
    if (state === "group-active-selected") {
      return `${prefix}${pc.green(S_CHECKBOX_SELECTED)} ${pc.dim(label)}`;
    }
    if (state === "selected") {
      const selectedCheckbox = isItem ? pc.green(S_CHECKBOX_SELECTED) : "";
      return `${pc.dim(prefix)}${selectedCheckbox} ${pc.dim(label)}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
    }
    if (state === "cancelled") {
      return `${pc.strikethrough(pc.dim(label))}`;
    }
    if (state === "active-selected") {
      return `${pc.dim(prefix)}${pc.green(S_CHECKBOX_SELECTED)} ${label}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
    }
    if (state === "submitted") {
      return `${pc.dim(label)}`;
    }
    const unselectedCheckbox = isItem ? pc.dim(S_CHECKBOX_INACTIVE) : "";
    return `${pc.dim(prefix)}${unselectedCheckbox} ${pc.dim(label)}`;
  };

  const prompt = new GroupMultiSelectPrompt<GroupMultiSelectOption<T>>({
    options: opts.options,
    initialValues: opts.initialValues,
    cursorAt: opts.cursorAt,
    required,
    selectableGroups: true,
    signal: opts.signal,
    input: opts.input,
    output: opts.output,
    validate(selected: T[] | undefined) {
      if (required && (selected === undefined || selected.length === 0)) {
        return `Please select at least one option.\n${pc.reset(pc.dim(`Press ${pc.gray(pc.bgWhite(pc.inverse(" space ")))} to select, ${pc.gray(pc.bgWhite(pc.inverse(" enter ")))} to submit`))}`;
      }
      return normalizeValidationMessage(opts.validate?.(selected));
    },
    render() {
      const value = this.value ?? [];
      const styleOption = (
        option: GroupMultiSelectOption<T> & { group: string | boolean },
        active: boolean,
      ) => {
        const selected =
          value.includes(option.value) ||
          (option.group === true && this.isGroupSelected(`${option.value}`));
        const groupActive =
          !active &&
          typeof option.group === "string" &&
          this.options[this.cursor]?.value === option.group;
        if (groupActive) {
          return opt(option, selected ? "group-active-selected" : "group-active", this.options);
        }
        if (active && selected) {
          return opt(option, "active-selected", this.options);
        }
        if (selected) {
          return opt(option, "selected", this.options);
        }
        return opt(option, active ? "active" : "inactive", this.options);
      };

      switch (this.state) {
        case "submit": {
          const selectedOptions = this.options
            .filter(({ value: optionValue }) => value.includes(optionValue))
            .map((option) => opt(option, "submitted"));
          const optionsText = selectedOptions.join(pc.dim(", ")) || pc.dim("none");
          return resolvedPrompt(opts.message, optionsText, "submit");
        }
        case "cancel": {
          const label =
            this.options
              .filter(({ value: optionValue }) => value.includes(optionValue))
              .map((option) => opt(option, "cancelled"))
              .join(pc.dim(", ")) || pc.dim("none");
          return canceledPrompt(this, opts.message, label);
        }
        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) => (i === 0 ? `${pc.yellow(S_BAR_END)}  ${pc.yellow(ln)}` : `   ${ln}`))
            .join("\n");
          const optionsText = limitOptions({
            output: opts.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            columnPadding: 3,
            rowPadding: footer.split("\n").length + 4,
            style: styleOption,
          }).join(`\n${pc.yellow(S_BAR)}  `);
          return `${activePromptTitle(opts.message, "error")}${pc.yellow(S_BAR)}  ${optionsText}\n${footer}\n`;
        }
        default: {
          const optionsText = limitOptions({
            output: opts.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            columnPadding: 3,
            rowPadding: 5,
            style: styleOption,
          }).join(`\n${pc.cyan(S_BAR)}  `);
          const hint = `${pc.gray(S_BAR_END)}  ${getMultiHint()}`;
          return `${activePromptTitle(opts.message)}${pc.cyan(S_BAR)}  ${optionsText}\n${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<T[] | symbol>;
}

/** Use the remembered answer as the initial value only while it is still selectable. */
export function preferValidInitial<T>(
  options: ReadonlyArray<{ value: T }>,
  previous: T | undefined,
  fallback: T,
): T {
  return previous !== undefined && options.some((o) => o.value === previous) ? previous : fallback;
}

export { isCancel };
export { isGoBack, GO_BACK_SYMBOL } from "../utils/navigation";

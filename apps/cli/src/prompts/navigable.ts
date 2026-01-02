/**
 * Navigable prompt wrappers using @clack/core
 * These prompts return GO_BACK_SYMBOL when 'b' is pressed (instead of canceling)
 */

import {
  ConfirmPrompt,
  type State,
  GroupMultiSelectPrompt,
  MultiSelectPrompt,
  SelectPrompt,
  TextPrompt,
  isCancel,
} from "@clack/core";
import pc from "picocolors";

import {
  didLastPromptShowUI as ctxDidLastPromptShowUI,
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
const S_BAR = unicode ? "│" : "|";
const S_BAR_END = unicode ? "└" : "—";
const S_RADIO_ACTIVE = unicode ? "●" : ">";
const S_RADIO_INACTIVE = unicode ? "○" : " ";
const S_CHECKBOX_ACTIVE = unicode ? "◻" : "[•]";
const S_CHECKBOX_SELECTED = unicode ? "◼" : "[+]";
const S_CHECKBOX_INACTIVE = unicode ? "◻" : "[ ]";

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
  `${pc.gray("↑/↓")} navigate • ${pc.gray("enter")} confirm • ${pc.gray("b")} back • ${pc.gray("ctrl+c")} cancel`,
);

const KEYBOARD_HINT_FIRST = pc.dim(
  `${pc.gray("↑/↓")} navigate • ${pc.gray("enter")} confirm • ${pc.gray("ctrl+c")} cancel`,
);

const KEYBOARD_HINT_MULTI = pc.dim(
  `${pc.gray("↑/↓")} navigate • ${pc.gray("space")} select • ${pc.gray("enter")} confirm • ${pc.gray("b")} back • ${pc.gray("ctrl+c")} cancel`,
);

const KEYBOARD_HINT_MULTI_FIRST = pc.dim(
  `${pc.gray("↑/↓")} navigate • ${pc.gray("space")} select • ${pc.gray("enter")} confirm • ${pc.gray("ctrl+c")} cancel`,
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

async function runWithNavigation<T>(prompt: any): Promise<T | symbol> {
  let goBack = false;

  prompt.on("key", (char: string | undefined) => {
    if (char === "b" && !ctxIsFirstPrompt()) {
      goBack = true;
      prompt.state = "cancel";
    }
  });

  ctxSetLastPromptShownUI(true);
  const result = await prompt.prompt();

  return goBack ? GO_BACK_SYMBOL : result;
}

interface SelectOption<T> {
  value: T;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export interface NavigableSelectOptions<T> {
  message: string;
  options: SelectOption<T>[];
  initialValue?: T;
}

export async function navigableSelect<T>(opts: NavigableSelectOptions<T>): Promise<T | symbol> {
  const opt = (
    option: SelectOption<T>,
    state: "inactive" | "active" | "selected" | "cancelled" | "disabled",
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case "disabled":
        return `${pc.gray(S_RADIO_INACTIVE)} ${pc.gray(label)}${option.hint ? ` ${pc.dim(`(${option.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${pc.dim(label)}`;
      case "active":
        return `${pc.green(S_RADIO_ACTIVE)} ${label}${option.hint ? ` ${pc.dim(`(${option.hint})`)}` : ""}`;
      case "cancelled":
        return `${pc.strikethrough(pc.dim(label))}`;
      default:
        return `${pc.dim(S_RADIO_INACTIVE)} ${pc.dim(label)}`;
    }
  };

  const prompt = new SelectPrompt({
    options: opts.options,
    initialValue: opts.initialValue,
    render() {
      const title = `${pc.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;

      switch (this.state) {
        case "submit": {
          return `${title}${pc.gray(S_BAR)}  ${opt(this.options[this.cursor], "selected")}`;
        }
        case "cancel": {
          return `${title}${pc.gray(S_BAR)}  ${opt(this.options[this.cursor], "cancelled")}\n${pc.gray(S_BAR)}`;
        }
        default: {
          const optionsText = this.options
            .map((option, i) =>
              opt(option, option.disabled ? "disabled" : i === this.cursor ? "active" : "inactive"),
            )
            .join(`\n${pc.cyan(S_BAR)}  `);
          const hint = `\n${pc.gray(S_BAR)}  ${getHint()}`;
          return `${title}${pc.cyan(S_BAR)}  ${optionsText}\n${pc.cyan(S_BAR_END)}${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<T | symbol>;
}

export interface NavigableMultiselectOptions<T> {
  message: string;
  options: SelectOption<T>[];
  initialValues?: T[];
  required?: boolean;
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
    required,
    validate(selected: T[] | undefined) {
      if (required && (selected === undefined || selected.length === 0)) {
        return `Please select at least one option.\n${pc.reset(pc.dim(`Press ${pc.gray(pc.bgWhite(pc.inverse(" space ")))} to select, ${pc.gray(pc.bgWhite(pc.inverse(" enter ")))} to submit`))}`;
      }
    },
    render() {
      const title = `${pc.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
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
          return `${title}${pc.gray(S_BAR)}  ${submitText}`;
        }
        case "cancel": {
          const label = this.options
            .filter(({ value: optionValue }) => value.includes(optionValue))
            .map((option) => opt(option, "cancelled"))
            .join(pc.dim(", "));
          return `${title}${pc.gray(S_BAR)}  ${label}\n${pc.gray(S_BAR)}`;
        }
        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) => (i === 0 ? `${pc.yellow(S_BAR_END)}  ${pc.yellow(ln)}` : `   ${ln}`))
            .join("\n");
          const optionsText = this.options
            .map((option, i) => styleOption(option, i === this.cursor))
            .join(`\n${pc.yellow(S_BAR)}  `);
          return `${title}${pc.yellow(S_BAR)}  ${optionsText}\n${footer}\n`;
        }
        default: {
          const optionsText = this.options
            .map((option, i) => styleOption(option, i === this.cursor))
            .join(`\n${pc.cyan(S_BAR)}  `);
          const hint = `\n${pc.gray(S_BAR)}  ${getMultiHint()}`;
          return `${title}${pc.cyan(S_BAR)}  ${optionsText}\n${pc.cyan(S_BAR_END)}${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<T[] | symbol>;
}

export interface NavigableConfirmOptions {
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
    render() {
      const title = `${pc.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const value = this.value ? active : inactive;

      switch (this.state) {
        case "submit":
          return `${title}${pc.gray(S_BAR)}  ${pc.dim(value)}`;
        case "cancel":
          return `${title}${pc.gray(S_BAR)}  ${pc.strikethrough(pc.dim(value))}\n${pc.gray(S_BAR)}`;
        default: {
          const hint = `\n${pc.gray(S_BAR)}  ${getHint()}`;
          return `${title}${pc.cyan(S_BAR)}  ${
            this.value
              ? `${pc.green(S_RADIO_ACTIVE)} ${active}`
              : `${pc.dim(S_RADIO_INACTIVE)} ${pc.dim(active)}`
          } ${pc.dim("/")} ${
            !this.value
              ? `${pc.green(S_RADIO_ACTIVE)} ${inactive}`
              : `${pc.dim(S_RADIO_INACTIVE)} ${pc.dim(inactive)}`
          }\n${pc.cyan(S_BAR_END)}${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<boolean | symbol>;
}

export interface NavigableTextOptions {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  initialValue?: string;
  validate?: (value: string | undefined) => string | Error | undefined;
}

export async function navigableText(opts: NavigableTextOptions): Promise<string | symbol> {
  const prompt = new TextPrompt({
    validate: opts.validate,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    initialValue: opts.initialValue,
    render() {
      const title = `${pc.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const placeholder = opts.placeholder
        ? pc.inverse(opts.placeholder[0]) + pc.dim(opts.placeholder.slice(1))
        : pc.inverse(pc.hidden("_"));
      // biome-ignore lint/suspicious/noExplicitAny: TextPrompt has userInput but types don't expose it
      const self = this as any;
      const userInput = !self.userInput ? placeholder : self.userInputWithCursor;
      const value = this.value ?? "";

      switch (this.state) {
        case "error": {
          const errorText = this.error ? `  ${pc.yellow(this.error)}` : "";
          return `${title.trim()}\n${pc.yellow(S_BAR)}  ${userInput}\n${pc.yellow(S_BAR_END)}${errorText}\n`;
        }
        case "submit": {
          const valueText = value ? `  ${pc.dim(value)}` : "";
          return `${title}${pc.gray(S_BAR)}${valueText}`;
        }
        case "cancel": {
          const valueText = value ? `  ${pc.strikethrough(pc.dim(value))}` : "";
          return `${title}${pc.gray(S_BAR)}${valueText}${value.trim() ? `\n${pc.gray(S_BAR)}` : ""}`;
        }
        default: {
          const hint = `\n${pc.gray(S_BAR)}  ${getHint()}`;
          return `${title}${pc.cyan(S_BAR)}  ${userInput}\n${pc.cyan(S_BAR_END)}${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<string | symbol>;
}

export interface GroupMultiSelectOption<T> {
  value: T;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export interface NavigableGroupMultiselectOptions<T> {
  message: string;
  options: Record<string, GroupMultiSelectOption<T>[]>;
  initialValues?: T[];
  required?: boolean;
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
    required,
    selectableGroups: true,
    validate(selected: T[] | undefined) {
      if (required && (selected === undefined || selected.length === 0)) {
        return `Please select at least one option.\n${pc.reset(pc.dim(`Press ${pc.gray(pc.bgWhite(pc.inverse(" space ")))} to select, ${pc.gray(pc.bgWhite(pc.inverse(" enter ")))} to submit`))}`;
      }
    },
    render() {
      const title = `${pc.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const value = this.value ?? [];

      switch (this.state) {
        case "submit": {
          const selectedOptions = this.options
            .filter(({ value: optionValue }) => value.includes(optionValue))
            .map((option) => opt(option, "submitted"));
          const optionsText =
            selectedOptions.length === 0 ? "" : `  ${selectedOptions.join(pc.dim(", "))}`;
          return `${title}${pc.gray(S_BAR)}${optionsText}`;
        }
        case "cancel": {
          const label = this.options
            .filter(({ value: optionValue }) => value.includes(optionValue))
            .map((option) => opt(option, "cancelled"))
            .join(pc.dim(", "));
          return `${title}${pc.gray(S_BAR)}  ${label.trim() ? `${label}\n${pc.gray(S_BAR)}` : ""}`;
        }
        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) => (i === 0 ? `${pc.yellow(S_BAR_END)}  ${pc.yellow(ln)}` : `   ${ln}`))
            .join("\n");
          const optionsText = this.options
            .map((option, i, options) => {
              const selected =
                value.includes(option.value) ||
                (option.group === true && this.isGroupSelected(`${option.value}`));
              const active = i === this.cursor;
              const groupActive =
                !active &&
                typeof option.group === "string" &&
                this.options[this.cursor].value === option.group;
              if (groupActive) {
                return opt(option, selected ? "group-active-selected" : "group-active", options);
              }
              if (active && selected) {
                return opt(option, "active-selected", options);
              }
              if (selected) {
                return opt(option, "selected", options);
              }
              return opt(option, active ? "active" : "inactive", options);
            })
            .join(`\n${pc.yellow(S_BAR)}  `);
          return `${title}${pc.yellow(S_BAR)}  ${optionsText}\n${footer}\n`;
        }
        default: {
          const optionsText = this.options
            .map((option, i, options) => {
              const selected =
                value.includes(option.value) ||
                (option.group === true && this.isGroupSelected(`${option.value}`));
              const active = i === this.cursor;
              const groupActive =
                !active &&
                typeof option.group === "string" &&
                this.options[this.cursor].value === option.group;
              let optionText = "";
              if (groupActive) {
                optionText = opt(
                  option,
                  selected ? "group-active-selected" : "group-active",
                  options,
                );
              } else if (active && selected) {
                optionText = opt(option, "active-selected", options);
              } else if (selected) {
                optionText = opt(option, "selected", options);
              } else {
                optionText = opt(option, active ? "active" : "inactive", options);
              }
              const optPrefix = i !== 0 && !optionText.startsWith("\n") ? "  " : "";
              return `${optPrefix}${optionText}`;
            })
            .join(`\n${pc.cyan(S_BAR)}`);
          const optionsPrefix = optionsText.startsWith("\n") ? "" : "  ";
          const hint = `\n${pc.gray(S_BAR)}  ${getMultiHint()}`;
          return `${title}${pc.cyan(S_BAR)}${optionsPrefix}${optionsText}\n${pc.cyan(S_BAR_END)}${hint}\n`;
        }
      }
    },
  });

  return runWithNavigation(prompt) as Promise<T[] | symbol>;
}

export { isCancel };
export { isGoBack, GO_BACK_SYMBOL } from "../utils/navigation";

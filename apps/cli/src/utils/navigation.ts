/**
 * Navigation symbols and utilities for prompt navigation
 */

export const GO_BACK_SYMBOL = Symbol("clack:goBack");

export function isGoBack(value: unknown): value is symbol {
  return value === GO_BACK_SYMBOL;
}

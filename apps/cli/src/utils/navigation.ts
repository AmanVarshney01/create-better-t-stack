export const GO_BACK_SYMBOL = Symbol("clack:goBack");

export function isGoBack<T>(value: T | symbol): value is symbol {
  return value === GO_BACK_SYMBOL;
}

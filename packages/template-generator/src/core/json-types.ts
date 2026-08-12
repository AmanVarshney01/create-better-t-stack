export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue | undefined;
}

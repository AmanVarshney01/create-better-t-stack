import { z } from "zod";

export const chartDatumValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.date(),
  z.null(),
  z.undefined(),
]);

export type ChartDatumValue = z.infer<typeof chartDatumValueSchema>;

export interface ChartDatum extends Record<string, ChartDatumValue> {}

const finiteNumberSchema = z.number().finite();
const stringSchema = z.string();
const dateSchema = z
  .union([z.date(), z.string(), z.number()])
  .pipe(z.coerce.date())
  .refine((value) => !Number.isNaN(value.getTime()));

export function parseChartNumber<T>(value: T): number | null {
  const result = finiteNumberSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseChartString<T>(value: T): string | null {
  const result = stringSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseChartDate<T>(value: T): Date | null {
  const result = dateSchema.safeParse(value);
  return result.success ? result.data : null;
}

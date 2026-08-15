import { CodeBlockWriter } from "ts-morph";

export type AlchemyWriter = CodeBlockWriter;

export function createAlchemyWriter(): AlchemyWriter {
  return new CodeBlockWriter({
    newLine: "\n",
    indentNumberOfSpaces: 2,
    useTabs: false,
    useSingleQuote: false,
  });
}

export function writeLines(writer: AlchemyWriter, lines: readonly string[]): void {
  for (const line of lines) writer.writeLine(line);
}

export function writeObject(
  writer: AlchemyWriter,
  opening: string,
  body: () => void,
  closing: string,
): void {
  writer.writeLine(opening);
  writer.indent(body);
  writer.writeLine(closing);
}

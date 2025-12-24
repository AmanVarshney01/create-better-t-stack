/**
 * File formatter utility
 * NOTE: oxfmt was removed because it has native bindings that don't work with bun compile.
 * Files are returned as-is without formatting. Users can run their own formatter after project creation.
 */

export async function formatFile(_filePath: string, content: string): Promise<string | null> {
  // Return content unchanged - formatting removed for bun compile compatibility
  // Users should run their preferred formatter (biome, prettier, etc.) after project creation
  return content;
}

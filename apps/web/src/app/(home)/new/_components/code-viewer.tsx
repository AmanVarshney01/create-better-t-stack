"use client";

import { memo, useMemo } from "react";

import type { BundledLanguage } from "@/components/ui/kibo-ui/code-block";

import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
} from "@/components/ui/kibo-ui/code-block";

interface CodeViewerProps {
  filePath: string;
  content: string;
  extension: string;
}

// Map file extensions to Shiki language IDs
function getLanguage(extension: string): BundledLanguage {
  const languageMap: Record<string, BundledLanguage> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    md: "markdown",
    mdx: "mdx",
    css: "css",
    scss: "scss",
    html: "html",
    vue: "vue",
    svelte: "svelte",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    sql: "sql",
    prisma: "prisma",
    graphql: "graphql",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    fish: "bash",
    dockerfile: "dockerfile",
    env: "shellscript",
    hbs: "handlebars",
  };
  return languageMap[extension.toLowerCase()] || "text";
}

export const CodeViewer = memo(function CodeViewer({
  filePath,
  content,
  extension,
}: CodeViewerProps) {
  const language = useMemo(() => getLanguage(extension), [extension]);
  const filename = useMemo(() => filePath.split("/").pop() || filePath, [filePath]);

  const codeData = useMemo(
    () => [
      {
        language,
        filename,
        code: content,
      },
    ],
    [language, filename, content],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-fd-background">
      <CodeBlock
        key={filePath}
        data={codeData}
        defaultValue={language}
        className="flex flex-col h-full bg-fd-background"
      >
        <CodeBlockHeader>
          <CodeBlockFiles>
            {(item) => (
              <CodeBlockFilename key={item.language} value={item.language}>
                {filePath}
              </CodeBlockFilename>
            )}
          </CodeBlockFiles>
          <CodeBlockCopyButton />
        </CodeBlockHeader>
        <CodeBlockBody className="flex-1 overflow-auto [&_.shiki]:bg-fd-background! dark:[&_.shiki]:bg-fd-background! bg-fd-background">
          {(item) => (
            <CodeBlockItem key={item.language} value={item.language}>
              <CodeBlockContent
                language={item.language as BundledLanguage}
                themes={{
                  light: "catppuccin-latte",
                  dark: "catppuccin-mocha",
                }}
                className="bg-fd-background"
              >
                {item.code}
              </CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </CodeBlock>
    </div>
  );
});

interface EmptyStateProps {
  message?: string;
}

export function CodeViewerEmpty({
  message = "Select a file to view its content",
}: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <p className="text-sm">{message}</p>
    </div>
  );
}

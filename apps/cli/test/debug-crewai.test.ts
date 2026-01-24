import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";

function listFiles(node: any, files: string[] = [], prefix = ""): string[] {
  if (node.type === "file") {
    files.push(node.path);
  } else if (node.type === "directory") {
    for (const child of node.children) {
      listFiles(child, files, prefix);
    }
  }
  return files;
}

describe("Debug CrewAI", () => {
  it("should generate langchain files", async () => {
    const result = await createVirtual({
      projectName: "test-langchain",
      ecosystem: "python",
      pythonWebFramework: "fastapi",
      pythonOrm: "none",
      pythonValidation: "none",
      pythonAi: ["langchain"],
      pythonTaskQueue: "none",
      pythonQuality: "none",
    });

    expect(result.success).toBe(true);
    const files = listFiles(result.tree!.root);
    console.log("LangChain Generated files:", files);

    // Check for langchain files
    const langchainFiles = files.filter((f) => f.includes("langchain"));
    console.log("LangChain files:", langchainFiles);

    expect(langchainFiles.length).toBeGreaterThan(0);
  });
});

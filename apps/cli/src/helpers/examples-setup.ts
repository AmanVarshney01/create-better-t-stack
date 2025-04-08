import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type { ProjectBackend, ProjectFrontend, ProjectOrm } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupExamples(
	projectDir: string,
	examples: string[],
	orm: ProjectOrm,
	auth: boolean,
	backend: ProjectBackend,
	frontend: ProjectFrontend[] = ["tanstack-router"],
): Promise<void> {
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasTanstackStart = frontend.includes("tanstack-start");
	const hasReactRouter = frontend.includes("react-router");
	const hasWebFrontend =
		hasTanstackRouter || hasReactRouter || hasTanstackStart;

	let routerType: string;
	if (hasTanstackRouter) {
		routerType = "web-tanstack-router";
	} else if (hasTanstackStart) {
		routerType = "web-tanstack-start";
	} else {
		routerType = "web-react-router";
	}

	const webAppExists = await fs.pathExists(path.join(projectDir, "apps/web"));

	if (examples.includes("todo") && hasWebFrontend && webAppExists) {
		await setupTodoExample(projectDir, orm, auth, routerType);
	} else {
		await cleanupTodoFiles(projectDir, orm);
	}

	if (
		examples.includes("ai") &&
		(backend === "hono" || backend === "express") &&
		hasWebFrontend &&
		webAppExists
	) {
		await setupAIExample(projectDir, routerType);
	}
}

async function setupAIExample(
	projectDir: string,
	routerType: string,
): Promise<void> {
	const aiExampleDir = path.join(PKG_ROOT, "template/examples/ai");

	if (await fs.pathExists(aiExampleDir)) {
		const aiRouteSourcePath = path.join(
			aiExampleDir,
			`apps/${routerType}/src/routes/ai.tsx`,
		);
		const aiRouteTargetPath = path.join(
			projectDir,
			"apps/web/src/routes/ai.tsx",
		);

		if (await fs.pathExists(aiRouteSourcePath)) {
			await fs.copy(aiRouteSourcePath, aiRouteTargetPath, { overwrite: true });
		}

		await updateHeaderWithAILink(projectDir, routerType);

		const clientDir = path.join(projectDir, "apps/web");
		addPackageDependency({
			dependencies: ["ai"],
			projectDir: clientDir,
		});

		const serverDir = path.join(projectDir, "apps/server");
		addPackageDependency({
			dependencies: ["ai", "@ai-sdk/google"],
			projectDir: serverDir,
		});

		await updateServerIndexWithAIRoute(projectDir);
	}
}

async function updateServerIndexWithAIRoute(projectDir: string): Promise<void> {
	const serverIndexPath = path.join(projectDir, "apps/server/src/index.ts");

	if (await fs.pathExists(serverIndexPath)) {
		let indexContent = await fs.readFile(serverIndexPath, "utf8");
		const isHono = indexContent.includes("hono");
		const isExpress = indexContent.includes("express");

		if (isHono) {
			const importSection = `import { streamText } from "ai";\nimport { google } from "@ai-sdk/google";\nimport { stream } from "hono/streaming";`;

			const aiRouteHandler = `
// AI chat endpoint
app.post("/ai", async (c) => {
  const body = await c.req.json();
  const messages = body.messages || [];

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  return stream(c, (stream) => stream.pipe(result.toDataStream()));
});`;

			if (indexContent.includes("import {")) {
				const lastImportIndex = indexContent.lastIndexOf("import");
				const endOfLastImport = indexContent.indexOf("\n", lastImportIndex);
				indexContent = `${indexContent.substring(0, endOfLastImport + 1)}
${importSection}
${indexContent.substring(endOfLastImport + 1)}`;
			} else {
				indexContent = `${importSection}

${indexContent}`;
			}

			const trpcHandlerIndex =
				indexContent.indexOf('app.use("/trpc"') ||
				indexContent.indexOf("app.use(trpc(");
			if (trpcHandlerIndex !== -1) {
				indexContent = `${indexContent.substring(0, trpcHandlerIndex)}${aiRouteHandler}

${indexContent.substring(trpcHandlerIndex)}`;
			} else {
				const exportIndex = indexContent.indexOf("export default");
				if (exportIndex !== -1) {
					indexContent = `${indexContent.substring(0, exportIndex)}${aiRouteHandler}

${indexContent.substring(exportIndex)}`;
				} else {
					indexContent = `${indexContent}

${aiRouteHandler}`;
				}
			}
		} else if (isExpress) {
			const importSection = `import { streamText } from "ai";\nimport { google } from "@ai-sdk/google";`;

			const aiRouteHandler = `
// AI chat endpoint
app.post("/ai", async (req, res) => {
  const { messages = [] } = req.body;

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
  });

  result.pipeDataStreamToResponse(res);
});`;

			if (
				indexContent.includes("import {") ||
				indexContent.includes("import ")
			) {
				const lastImportIndex = indexContent.lastIndexOf("import");
				const endOfLastImport = indexContent.indexOf("\n", lastImportIndex);
				indexContent = `${indexContent.substring(0, endOfLastImport + 1)}
${importSection}
${indexContent.substring(endOfLastImport + 1)}`;
			} else {
				indexContent = `${importSection}

${indexContent}`;
			}

			const trpcHandlerIndex = indexContent.indexOf('app.use("/trpc"');
			if (trpcHandlerIndex !== -1) {
				indexContent = `${indexContent.substring(0, trpcHandlerIndex)}${aiRouteHandler}

${indexContent.substring(trpcHandlerIndex)}`;
			} else {
				const appListenIndex = indexContent.indexOf("app.listen(");
				if (appListenIndex !== -1) {
					const prevNewlineIndex = indexContent.lastIndexOf(
						"\n",
						appListenIndex,
					);
					indexContent = `${indexContent.substring(0, prevNewlineIndex)}${aiRouteHandler}

${indexContent.substring(prevNewlineIndex)}`;
				} else {
					indexContent = `${indexContent}

${aiRouteHandler}`;
				}
			}
		}

		await fs.writeFile(serverIndexPath, indexContent);
	}
}

async function updateHeaderWithAILink(
	projectDir: string,
	routerType: string,
): Promise<void> {
	const headerPath = path.join(
		projectDir,
		"apps/web/src/components/header.tsx",
	);

	if (await fs.pathExists(headerPath)) {
		let headerContent = await fs.readFile(headerPath, "utf8");

		const linksPattern = /const links = \[\s*([^;]*?)\s*\];/s;
		const linksMatch = headerContent.match(linksPattern);

		if (linksMatch) {
			const linksContent = linksMatch[1];
			if (!linksContent.includes('"/ai"')) {
				const updatedLinks = `const links = [\n    ${linksContent}${
					linksContent.trim().endsWith(",") ? "" : ","
				}\n    { to: "/ai", label: "AI Chat" },\n  ];`;

				headerContent = headerContent.replace(linksPattern, updatedLinks);
				await fs.writeFile(headerPath, headerContent);
			}
		}
	}
}

async function setupTodoExample(
	projectDir: string,
	orm: ProjectOrm,
	auth: boolean,
	routerType: string,
): Promise<void> {
	const todoExampleDir = path.join(PKG_ROOT, "template/examples/todo");

	if (await fs.pathExists(todoExampleDir)) {
		const todoRouteSourcePath = path.join(
			todoExampleDir,
			`apps/${routerType}/src/routes/todos.tsx`,
		);
		const todoRouteTargetPath = path.join(
			projectDir,
			"apps/web/src/routes/todos.tsx",
		);

		if (await fs.pathExists(todoRouteSourcePath)) {
			await fs.copy(todoRouteSourcePath, todoRouteTargetPath, {
				overwrite: true,
			});
		}

		if (orm !== "none") {
			const todoRouterSourceFile = path.join(
				todoExampleDir,
				`apps/server/src/routers/with-${orm}-todo.ts`,
			);
			const todoRouterTargetFile = path.join(
				projectDir,
				"apps/server/src/routers/todo.ts",
			);

			if (await fs.pathExists(todoRouterSourceFile)) {
				await fs.copy(todoRouterSourceFile, todoRouterTargetFile, {
					overwrite: true,
				});
			}

			await updateRouterIndexToIncludeTodo(projectDir);
		}

		await updateHeaderWithTodoLink(projectDir, routerType);
	}
}

async function updateRouterIndexToIncludeTodo(
	projectDir: string,
): Promise<void> {
	const routerFile = path.join(projectDir, "apps/server/src/routers/index.ts");

	if (await fs.pathExists(routerFile)) {
		let routerContent = await fs.readFile(routerFile, "utf8");

		if (!routerContent.includes("import { todoRouter }")) {
			const lastImportIndex = routerContent.lastIndexOf("import");
			const endOfImports = routerContent.indexOf("\n\n", lastImportIndex);

			if (endOfImports !== -1) {
				routerContent = `${routerContent.slice(0, endOfImports)}
import { todoRouter } from "./todo";${routerContent.slice(endOfImports)}`;
			} else {
				routerContent = `import { todoRouter } from "./todo";\n${routerContent}`;
			}

			const routerDefIndex = routerContent.indexOf(
				"export const appRouter = router({",
			);
			if (routerDefIndex !== -1) {
				const routerContentStart =
					routerContent.indexOf("{", routerDefIndex) + 1;
				routerContent = `${routerContent.slice(0, routerContentStart)}
  todo: todoRouter,${routerContent.slice(routerContentStart)}`;
			}

			await fs.writeFile(routerFile, routerContent);
		}
	}
}

async function updateHeaderWithTodoLink(
	projectDir: string,
	routerType: string,
): Promise<void> {
	const headerPath = path.join(
		projectDir,
		"apps/web/src/components/header.tsx",
	);

	if (await fs.pathExists(headerPath)) {
		let headerContent = await fs.readFile(headerPath, "utf8");

		const linksPattern = /const links = \[\s*([^;]*?)\s*\];/s;
		const linksMatch = headerContent.match(linksPattern);

		if (linksMatch) {
			const linksContent = linksMatch[1];
			if (!linksContent.includes('"/todos"')) {
				const updatedLinks = `const links = [\n    ${linksContent}${
					linksContent.trim().endsWith(",") ? "" : ","
				}\n    { to: "/todos", label: "Todos" },\n  ];`;

				headerContent = headerContent.replace(linksPattern, updatedLinks);
				await fs.writeFile(headerPath, headerContent);
			}
		}
	}
}

async function cleanupTodoFiles(
	projectDir: string,
	orm: ProjectOrm,
): Promise<void> {
	if (orm === "drizzle") {
		const todoSchemaFile = path.join(
			projectDir,
			"apps/server/src/db/schema/todo.ts",
		);
		if (await fs.pathExists(todoSchemaFile)) {
			await fs.remove(todoSchemaFile);
		}
	} else if (orm === "prisma") {
		const todoPrismaFile = path.join(
			projectDir,
			"apps/server/prisma/schema/todo.prisma",
		);
		if (await fs.pathExists(todoPrismaFile)) {
			await fs.remove(todoPrismaFile);
		}
	}

	const todoRouterFile = path.join(
		projectDir,
		"apps/server/src/routers/todo.ts",
	);
	if (await fs.pathExists(todoRouterFile)) {
		await fs.remove(todoRouterFile);
	}

	await updateRouterIndex(projectDir);
}

async function updateRouterIndex(projectDir: string): Promise<void> {
	const routerFile = path.join(projectDir, "apps/server/src/routers/index.ts");

	if (await fs.pathExists(routerFile)) {
		let routerContent = await fs.readFile(routerFile, "utf8");
		routerContent = routerContent.replace(
			/import { todoRouter } from ".\/todo";/,
			"",
		);
		routerContent = routerContent.replace(/todo: todoRouter,/, "");
		await fs.writeFile(routerFile, routerContent);
	}
}

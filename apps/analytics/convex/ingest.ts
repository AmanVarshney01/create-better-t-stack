import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const trackProjectCreation = httpAction(async (ctx, request) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();

    // Insert the project creation event
    await ctx.runMutation(internal.events.insertProjectCreation, {
      ecosystem: body.ecosystem ?? "typescript",
      database: body.database ?? "none",
      orm: body.orm ?? "none",
      backend: body.backend ?? "none",
      runtime: body.runtime ?? "none",
      frontend: body.frontend ?? [],
      api: body.api ?? "none",
      auth: body.auth ?? "none",
      payments: body.payments ?? "none",
      addons: body.addons ?? [],
      examples: body.examples ?? [],
      dbSetup: body.dbSetup ?? "none",
      webDeploy: body.webDeploy ?? "none",
      serverDeploy: body.serverDeploy ?? "none",
      cssFramework: body.cssFramework ?? "none",
      uiLibrary: body.uiLibrary ?? "none",
      animation: body.animation ?? "none",
      stateManagement: body.stateManagement ?? "none",
      forms: body.forms ?? "none",
      validation: body.validation ?? "zod",
      realtime: body.realtime ?? "none",
      caching: body.caching ?? "none",
      ai: body.ai ?? "none",
      effect: body.effect ?? "none",
      email: body.email ?? "none",
      fileUpload: body.fileUpload ?? "none",
      jobQueue: body.jobQueue ?? "none",
      logging: body.logging ?? "none",
      observability: body.observability ?? "none",
      cms: body.cms ?? "none",
      testing: body.testing ?? "vitest",
      rustWebFramework: body.rustWebFramework,
      rustFrontend: body.rustFrontend,
      rustOrm: body.rustOrm,
      rustApi: body.rustApi,
      rustCli: body.rustCli,
      rustLibraries: body.rustLibraries,
      astroIntegration: body.astroIntegration,
      git: body.git ?? true,
      packageManager: body.packageManager ?? "npm",
      install: body.install ?? false,
      cli_version: body.cli_version,
      node_version: body.node_version,
      platform: body.platform,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Failed to track project creation:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

// Handle CORS preflight
export const options = httpAction(async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
});

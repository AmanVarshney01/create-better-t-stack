import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const uiMessages = body.messages || [];

  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(uiMessages),
  });

  return result.toUIMessageStreamResponse();
});

import { google } from '@ai-sdk/google';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
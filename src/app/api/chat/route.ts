import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(JSON.stringify(messages, null, 2), 'is messages');

  const result = streamText({
    model: mistral('mistral-small-latest'),
    messages,
  });

  console.log(result, "is result");
  return result.toDataStreamResponse();
}

import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.string().trim().min(1, "Query is required"),
  limit: z.number().int().min(1).max(20).optional(),
});

export const answerRequestSchema = z.object({
  query: z.string().trim().min(1, "Query is required"),
  chunkIds: z.array(z.string().trim().min(1)).min(1).max(8).optional(),
});

export function validationError(message: string, details?: unknown) {
  return {
    error: {
      code: "INVALID_REQUEST",
      message,
      details,
    },
  };
}

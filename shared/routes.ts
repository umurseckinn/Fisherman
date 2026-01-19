
import { z } from 'zod';
import { insertHighScoreSchema, high_scores } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scores: {
    list: {
      method: 'GET' as const,
      path: '/api/scores',
      responses: {
        200: z.array(z.custom<typeof high_scores.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scores',
      input: insertHighScoreSchema,
      responses: {
        201: z.custom<typeof high_scores.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type HighScoreInput = z.infer<typeof api.scores.create.input>;
export type HighScoreResponse = z.infer<typeof api.scores.create.responses[201]>;
export type HighScoresListResponse = z.infer<typeof api.scores.list.responses[200]>;

import { z } from "zod";

export const ErrorResponseSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .meta({ id: "ErrorResponse" });

export function errorExample(code: string, message: string, details?: unknown) {
  return { error: { code, message, ...(details === undefined ? {} : { details }) } };
}

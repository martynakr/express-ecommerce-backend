import { z } from "zod";
import { registry } from "./openapi.js";

export const ErrorResponseSchema = registry.register(
  "ErrorResponse",
  z.object({
    error: z.object({
      code: z.string().openapi({ example: "VALIDATION_ERROR" }),
      message: z.string().openapi({ example: "Validation failed" }),
      details: z.unknown().optional(),
    }),
  }),
);

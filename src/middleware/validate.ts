import type { RequestHandler } from "express";
import { z } from "zod";
import { ValidationError } from "../errors/app-error.js";

type RequestSchemas = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

export function validate(schemas: RequestSchemas): RequestHandler {
  return (req, _res, next) => {
    const errors: Record<string, unknown> = {};

    for (const key of ["body", "params", "query"] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);

      if (!result.success) {
        errors[key] = z.flattenError(result.error).fieldErrors;
        continue;
      }

      Object.defineProperty(req, key, {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.keys(errors).length > 0) {
      next(new ValidationError(errors));
      return;
    }

    next();
  };
}

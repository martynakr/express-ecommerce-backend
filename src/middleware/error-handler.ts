import type { ErrorRequestHandler } from "express";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { Prisma } from "../generated/prisma/client.js";

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function toAppError(err: unknown): AppError | undefined {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return new AppError(409, "CONFLICT", "Resource already exists");
    }
    if (err.code === "P2025") {
      return new AppError(404, "NOT_FOUND", "Resource not found");
    }
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    return new AppError(400, "INVALID_JSON", "Request body is not valid JSON");
  }

  return undefined;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const appError = toAppError(err);

  if (appError) {
    const body: ErrorBody = {
      error: { code: appError.code, message: appError.message },
    };
    if (appError.details !== undefined) {
      body.error.details = appError.details;
    }
    res.status(appError.statusCode).json(body);
    return;
  }

  console.error(err);

  const body: ErrorBody = {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production" || !(err instanceof Error)
          ? "Something went wrong"
          : err.message,
    },
  };
  res.status(500).json(body);
};

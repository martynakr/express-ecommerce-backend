import { ErrorResponseSchema, errorExample } from "../../docs/common.schemas.js";
import { registry } from "../../docs/openapi.js";
import { AuthResponseSchema, LoginBodySchema } from "./auth.schemas.js";

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Log in with email and password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginBodySchema,
          example: { email: "customer@example.com", password: "Password123!" },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Logged in. Send the token as 'Authorization: Bearer <token>'",
      content: {
        "application/json": {
          schema: AuthResponseSchema,
          example: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            user: {
              id: 2,
              email: "customer@example.com",
              name: "Customer User",
              role: "CUSTOMER",
              createdAt: "2026-11-24T01:32:08.199Z",
            },
          },
        },
      },
    },
    400: {
      description: "Validation failed",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: errorExample("VALIDATION_ERROR", "Validation failed", {
            body: { email: ["Invalid email address"] },
          }),
        },
      },
    },
    401: {
      description: "Invalid email or password",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: errorExample("UNAUTHORIZED", "Invalid email or password"),
        },
      },
    },
  },
});

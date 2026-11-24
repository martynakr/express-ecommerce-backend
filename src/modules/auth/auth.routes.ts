import { Router } from "express";
import { registry } from "../../docs/openapi.js";
import { ErrorResponseSchema } from "../../docs/common.schemas.js";
import { validate } from "../../middleware/validate.js";
import { authController } from "./auth.controller.js";
import { AuthResponseSchema, LoginBodySchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/login", validate({ body: LoginBodySchema }), authController.login);

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Log in with email and password",
  request: {
    body: {
      content: { "application/json": { schema: LoginBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Logged in. Send the token as 'Authorization: Bearer <token>'",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    400: {
      description: "Validation failed",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    401: {
      description: "Invalid email or password",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

import { z } from "zod";
import { registry } from "../../docs/openapi.js";
import { UserResponseSchema } from "../users/users.schemas.js";

export const LoginBodySchema = registry.register(
  "LoginBody",
  z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email())
      .openapi({ example: "customer@example.com" }),
    password: z.string().min(1).openapi({ example: "Password123!" }),
  }),
);

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const AuthResponseSchema = registry.register(
  "AuthResponse",
  z.object({
    token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
    user: UserResponseSchema,
  }),
);

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

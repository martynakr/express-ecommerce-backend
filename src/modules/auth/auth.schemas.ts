import { z } from "zod";
import { UserResponseSchema } from "../users/users.schemas.js";

export const LoginBodySchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(1),
  })
  .meta({ id: "LoginBody" });

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const AuthResponseSchema = z
  .object({
    token: z.string(),
    user: UserResponseSchema,
  })
  .meta({ id: "AuthResponse" });

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

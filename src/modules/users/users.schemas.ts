import { z } from "zod";
import { registry } from "../../docs/openapi.js";
import type { User } from "../../generated/prisma/client.js";
import { Role } from "../../generated/prisma/enums.js";

export const UserResponseSchema = registry.register(
  "UserResponse",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    email: z.email().openapi({ example: "customer@example.com" }),
    name: z.string().openapi({ example: "Customer User" }),
    role: z.enum(Role).openapi({ example: Role.CUSTOMER }),
    createdAt: z.iso.datetime(),
  }),
);

export type UserResponse = z.infer<typeof UserResponseSchema>;

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

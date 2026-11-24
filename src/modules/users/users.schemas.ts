import { z } from "zod";
import type { User } from "../../generated/prisma/client.js";
import { Role } from "../../generated/prisma/enums.js";

export const UserResponseSchema = z
  .object({
    id: z.number().int(),
    email: z.email(),
    name: z.string(),
    role: z.enum(Role),
    createdAt: z.iso.datetime(),
  })
  .meta({ id: "UserResponse" });

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

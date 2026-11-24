import { UnauthorizedError } from "../../errors/app-error.js";
import { signAccessToken } from "../../lib/jwt.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { usersRepository } from "../users/users.repository.js";
import { toUserResponse } from "../users/users.schemas.js";
import type { AuthResponse, LoginBody } from "./auth.schemas.js";

const dummyPasswordHash = hashPassword("timing-attack-protection");

export const authService = {
  async login({ email, password }: LoginBody): Promise<AuthResponse> {
    const user = await usersRepository.findByEmail(email);

    const passwordMatches = await verifyPassword(
      password,
      user?.passwordHash ?? (await dummyPasswordHash),
    );

    if (!user || !passwordMatches) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return {
      token: signAccessToken({ userId: user.id }),
      user: toUserResponse(user),
    };
  },
};

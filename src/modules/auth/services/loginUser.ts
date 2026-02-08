import type { LoginRequest } from "@modules/auth/types/types";
import { unauthorizedError } from "@common/errorFactory";
import { authRepository } from "@modules/auth/repositories";
import { compareHash } from "@utils/hash";
import { extractRoleName, sanitizeUser } from "@utils/user";
import { issueAuthTokens } from "@utils/authSession";

export const loginUser = async (payload: LoginRequest, deps = authRepository) => {
  const user = await deps.findUserByEmail(payload.email);

  if (!user) {
    throw unauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await compareHash(payload.password, user.passwordHash);
  if (!isPasswordValid) {
    throw unauthorizedError("Invalid email or password");
  }

  const tokens = await issueAuthTokens(
    {
      id: user.id,
      email: user.email,
      role: extractRoleName(user)
    },
    deps.createRefreshToken
  );

  return {
    user: sanitizeUser(user),
    tokens
  };
};
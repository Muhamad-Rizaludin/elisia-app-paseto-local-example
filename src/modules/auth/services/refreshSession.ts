import { unauthorizedError } from "@common/errorFactory";
import { authRepository } from "@modules/auth/repositories";
import { compareHash } from "@utils/hash";
import { verifyRefreshToken } from "@utils/token";
import { extractRoleName, sanitizeUser } from "@utils/user";
import { issueAuthTokens } from "@utils/authSession";

export const refreshSession = async (refreshToken: string, deps = authRepository) => {
  const payload = await verifyRefreshToken(refreshToken);
  const savedToken = await deps.findRefreshTokenByTokenId(payload.jti);

  if (!savedToken) {
    throw unauthorizedError("Refresh token not found");
  }

  if (savedToken.isRevoked) {
    throw unauthorizedError("Refresh token revoked");
  }

  if (savedToken.expiresAt.getTime() <= Date.now()) {
    throw unauthorizedError("Refresh token expired");
  }

  const isTokenMatch = await compareHash(refreshToken, savedToken.tokenHash);
  if (!isTokenMatch) {
    throw unauthorizedError("Invalid refresh token");
  }

  await deps.revokeRefreshTokenByTokenId(payload.jti);

  const user = await deps.findUserById(Number(payload.sub));
  if (!user) {
    throw unauthorizedError("User not found");
  }

  const tokens = await issueAuthTokens(
    {
      id: user.id,
      email: user.email,
      role: extractRoleName(user)
    },
    deps.createRefreshToken,
    savedToken.expiresAt
  );

  return {
    user: sanitizeUser(user),
    tokens
  };
};

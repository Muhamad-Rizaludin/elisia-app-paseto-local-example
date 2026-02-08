import type { AuthTokens } from "@modules/auth/types/types";
import { createAccessTokenWithExpiry, createRefreshToken } from "@utils/token";
import { durationToMs } from "@utils/duration";
import { hashValue } from "@utils/hash";

type SaveRefreshTokenFn = (payload: {
  userId: number;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
}) => Promise<unknown>;

export const issueAuthTokens = async (
  user: { id: number; email: string; role: string },
  saveRefreshToken: SaveRefreshTokenFn,
  sessionExpiresAt?: Date
): Promise<AuthTokens> => {
  const absoluteSessionExpiry = sessionExpiresAt ?? new Date(Date.now() + durationToMs(process.env.SESSION_MAX_AGE || "8h"));
  const remainingSessionMs = absoluteSessionExpiry.getTime() - Date.now();

  const accessTtlMs = durationToMs(process.env.ACCESS_TOKEN_TTL || "8h");
  const refreshTtlMs = durationToMs(process.env.REFRESH_TOKEN_TTL || "8h");
  const effectiveAccessMs = Math.max(1, Math.min(accessTtlMs, remainingSessionMs));
  const effectiveRefreshMs = Math.max(1, Math.min(refreshTtlMs, remainingSessionMs));
  const accessTokenMaxAgeSec = Math.max(1, Math.floor(effectiveAccessMs / 1000));
  const refreshTokenMaxAgeSec = Math.max(1, Math.floor(effectiveRefreshMs / 1000));

  const accessToken = await createAccessTokenWithExpiry(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role
    },
    `${accessTokenMaxAgeSec}s`
  );

  const refresh = await createRefreshToken(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role
    },
    `${refreshTokenMaxAgeSec}s`
  );

  const tokenHash = await hashValue(refresh.token);

  await saveRefreshToken({
    userId: user.id,
    tokenId: refresh.tokenId,
    tokenHash,
    expiresAt: absoluteSessionExpiry
  });

  return {
    accessToken,
    refreshToken: refresh.token,
    accessTokenMaxAgeSec,
    refreshTokenMaxAgeSec,
    sessionExpiresAt: absoluteSessionExpiry
  };
};

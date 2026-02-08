import { authRepository } from "@modules/auth/repositories";
import type { LogoutPayload } from "@modules/auth/types/types";
import { verifyAccessToken, verifyRefreshToken } from "@utils/token";

export const logoutUser = async (payload: LogoutPayload, deps = authRepository) => {
  if (payload.refreshToken) {
    try {
      const refreshPayload = await verifyRefreshToken(payload.refreshToken);
      await deps.revokeRefreshTokenByTokenId(refreshPayload.jti);
    } catch {
      // Tetap lanjut agar logout idempotent.
    }
  }

  if (payload.accessToken) {
    try {
      const accessPayload = await verifyAccessToken(payload.accessToken);
      await deps.revokeRefreshTokensByUserId(Number(accessPayload.sub));
    } catch {
      // Tetap lanjut agar logout idempotent.
    }
  }
};

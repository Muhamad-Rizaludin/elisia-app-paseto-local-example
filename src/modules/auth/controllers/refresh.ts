import type { HttpSet } from "@plugins/common/types";
import { logger } from "@config/logger";
import { refreshSession } from "@modules/auth/services/refreshSession";
import { setAuthCookies } from "@utils/cookies";
import { successResponse } from "@utils/response";

export const refreshController = async (refreshToken: string, set: HttpSet) => {
  const result = await refreshSession(refreshToken);
  const responseData = {
    user: result.user,
    token: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    expiredToken: result.tokens.accessTokenMaxAgeSec
  };

  setAuthCookies(set, result.tokens.accessToken, result.tokens.refreshToken, {
    accessTokenMaxAgeSec: result.tokens.accessTokenMaxAgeSec,
    refreshTokenMaxAgeSec: result.tokens.refreshTokenMaxAgeSec
  });
  logger.info("auth.refresh.success", { userId: result.user.id, email: result.user.email });

  return successResponse("Token refreshed", responseData);
};

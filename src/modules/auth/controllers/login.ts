import type { LoginRequest } from "@modules/auth/types/types";
import type { HttpSet } from "@plugins/common/types";
import { logger } from "@config/logger";
import { loginUser } from "@modules/auth/services/loginUser";
import { setAuthCookies } from "@utils/cookies";
import { successResponse } from "@utils/response";

export const loginController = async (payload: LoginRequest, set: HttpSet) => {
  const result = await loginUser(payload);
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
  logger.info("auth.login.success", { userId: result.user.id, email: result.user.email });

  return successResponse("Login success", responseData);
};

import type { RegisterRequest } from "@modules/auth/types/types";
import type { HttpSet } from "@plugins/common/types";
import { logger } from "@config/logger";
import { registerUser } from "@modules/auth/services/registerUser";
import { setAuthCookies } from "@utils/cookies";
import { successResponse } from "@utils/response";

export const registerController = async (payload: RegisterRequest, set: HttpSet) => {
  const result = await registerUser(payload);
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
  logger.info("auth.register.success", { userId: result.user.id, email: result.user.email });

  return successResponse("Register success", responseData);
};

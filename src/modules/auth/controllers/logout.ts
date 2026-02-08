import type { LogoutPayload } from "@modules/auth/types/types";
import type { HttpSet } from "@plugins/common/types";
import { logger } from "@config/logger";
import { logoutUser } from "@modules/auth/services/logoutUser";
import { clearAuthCookies } from "@utils/cookies";
import { successResponse } from "@utils/response";

export const logoutController = async (payload: LogoutPayload, set: HttpSet) => {
  await logoutUser(payload);

  clearAuthCookies(set);
  logger.info("auth.logout.success");

  return successResponse("Logout success", null);
};

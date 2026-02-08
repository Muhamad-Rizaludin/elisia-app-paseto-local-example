import { getMe } from "@modules/auth/services/getMe";
import { logger } from "@config/logger";
import { successResponse } from "@utils/response";

export const meController = async (userId: string) => {
  const user = await getMe(userId);
  logger.info("auth.me.success", { userId });
  return successResponse("Profile retrieved", user);
};

import { logger } from "@config/logger";
import { getUserById } from "@modules/users/services/getUserById";
import { successResponse } from "@utils/response";

export const usersGetController = async (id: string) => {
  const user = await getUserById(id);
  logger.info("users.get.success", { userId: id });

  return successResponse("User retrieved", user);
};

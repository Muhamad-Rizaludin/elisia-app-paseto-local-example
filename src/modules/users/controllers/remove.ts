import { logger } from "@config/logger";
import { deleteUser } from "@modules/users/services/deleteUser";
import { successResponse } from "@utils/response";

export const usersDeleteController = async (id: string) => {
  await deleteUser(id);
  logger.info("users.delete.success", { userId: id });

  return successResponse("User deleted", null);
};

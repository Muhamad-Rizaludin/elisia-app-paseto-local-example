import type { UpdateUserRequest } from "@modules/users/types/types";
import { logger } from "@config/logger";
import { updateUser } from "@modules/users/services/updateUser";
import { successResponse } from "@utils/response";

export const usersUpdateController = async (id: number, payload: UpdateUserRequest) => {
  const user = await updateUser(id, payload);
  logger.info("users.update.success", { userId: id });

  return successResponse("User updated", user);
};

import type { CreateUserRequest } from "@modules/users/types/types";
import { logger } from "@config/logger";
import { createUser } from "@modules/users/services/createUser";
import { successResponse } from "@utils/response";

export const usersCreateController = async (payload: CreateUserRequest) => {
  const user = await createUser(payload);
  logger.info("users.create.success", { userId: user.id, email: user.email });

  return successResponse("User created", user);
};

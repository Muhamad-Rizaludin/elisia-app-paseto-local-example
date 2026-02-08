import { notFoundError } from "@common/errorFactory";
import { authRepository } from "@modules/auth/repositories";
import { sanitizeUser } from "@utils/user";

export const getMe = async (userId: number, deps = authRepository) => {
  const user = await deps.findUserById(userId);

  if (!user) {
    throw notFoundError("User not found");
  }

  return sanitizeUser(user);
};

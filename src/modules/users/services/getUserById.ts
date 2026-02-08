import { notFoundError } from "@common/errorFactory";
import { usersRepository } from "@modules/users/repositories";
import { sanitizeUser } from "@utils/user";

export const getUserById = async (id: string, deps = usersRepository) => {
  const user = await deps.findUserById(id);
  if (!user) {
    throw notFoundError("User not found");
  }

  return sanitizeUser(user);
};

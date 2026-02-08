import type { CreateUserRequest } from "@modules/users/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { conflictError, notFoundError } from "@common/errorFactory";
import { usersRepository } from "@modules/users/repositories";
import { hashValue } from "@utils/hash";
import { sanitizeUser } from "@utils/user";

export const createUser = async (payload: CreateUserRequest, deps = usersRepository) => {
  const roleName = payload.role || RoleName.USER;
  const role = await deps.findRoleByName(roleName);

  if (!role) {
    throw notFoundError("Role not found");
  }

  const existingUser = await deps.findUserByEmail(payload.email);
  if (existingUser) {
    throw conflictError("Email already registered");
  }

  const passwordHash = await hashValue(payload.password);
  const createdUser = await deps.createUser({
    roleId: role.id,
    name: payload.name,
    email: payload.email,
    passwordHash
  });

  const completeUser = await deps.findUserById(createdUser.id);
  if (!completeUser) {
    throw notFoundError("Created user not found");
  }

  return sanitizeUser(completeUser);
};

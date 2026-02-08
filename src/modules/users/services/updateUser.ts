import type { UpdateUserRequest } from "@modules/users/types/types";
import { conflictError, notFoundError } from "@common/errorFactory";
import { usersRepository } from "@modules/users/repositories";
import { hashValue } from "@utils/hash";
import { sanitizeUser } from "@utils/user";

export const updateUser = async (id: number, payload: UpdateUserRequest, deps = usersRepository) => {
  const existingUser = await deps.findUserById(id);
  if (!existingUser) {
    throw notFoundError("User not found");
  }

  if (payload.email && payload.email !== existingUser.email) {
    const emailTaken = await deps.findUserByEmail(payload.email, { includeDeleted: true });
    if (emailTaken) {
      throw conflictError("Email already registered");
    }
  }

  let roleId = existingUser.roleId;
  if (payload.role) {
    const role = await deps.findRoleByName(payload.role);
    if (!role) {
      throw notFoundError("Role not found");
    }
    roleId = role.id;
  }

  const passwordHash = payload.password ? await hashValue(payload.password) : undefined;

  await deps.updateUserById(id, {
    name: payload.name ?? existingUser.name,
    email: payload.email ?? existingUser.email,
    roleId,
    passwordHash: passwordHash ?? existingUser.passwordHash
  });

  const updatedUser = await deps.findUserById(id);
  if (!updatedUser) {
    throw notFoundError("User not found");
  }

  return sanitizeUser(updatedUser);
};

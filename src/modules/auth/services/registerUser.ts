import type { RegisterRequest } from "@modules/auth/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { conflictError, notFoundError } from "@common/errorFactory";
import { authRepository } from "@modules/auth/repositories";
import { hashValue } from "@utils/hash";
import { extractRoleName, sanitizeUser } from "@utils/user";
import { issueAuthTokens } from "@utils/authSession";

export const registerUser = async (payload: RegisterRequest, deps = authRepository) => {
  const role = await deps.findRoleByName(RoleName.USER);

  if (!role) {
    throw notFoundError("Default role not found");
  }

  const existingUser = await deps.findUserByEmail(payload.email, { includeDeleted: true });
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
    throw notFoundError("Registered user not found");
  }

  const tokens = await issueAuthTokens(
    {
      id: completeUser.id,
      email: completeUser.email,
      role: extractRoleName(completeUser)
    },
    deps.createRefreshToken
  );

  return {
    user: sanitizeUser(completeUser),
    tokens
  };
};

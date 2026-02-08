import { createRefreshToken } from "@modules/auth/repositories/createRefreshToken";
import { createUser } from "@modules/auth/repositories/createUser";
import { findRefreshTokenByTokenId } from "@modules/auth/repositories/findRefreshTokenByTokenId";
import { findRoleByName } from "@modules/auth/repositories/findRoleByName";
import { findUserByEmail } from "@modules/auth/repositories/findUserByEmail";
import { findUserById } from "@modules/auth/repositories/findUserById";
import { revokeRefreshTokenByTokenId } from "@modules/auth/repositories/revokeRefreshTokenByTokenId";
import { revokeRefreshTokensByUserId } from "@modules/auth/repositories/revokeRefreshTokensByUserId";

export const authRepository = {
  createRefreshToken,
  createUser,
  findRefreshTokenByTokenId,
  findRoleByName,
  findUserByEmail,
  findUserById,
  revokeRefreshTokenByTokenId,
  revokeRefreshTokensByUserId
};

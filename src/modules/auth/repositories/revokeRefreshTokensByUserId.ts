import { RefreshToken } from "@schemas/models";

export const revokeRefreshTokensByUserId = (userId: number) =>
  RefreshToken.update(
    { isRevoked: true },
    {
      where: { userId, isRevoked: false }
    }
  );

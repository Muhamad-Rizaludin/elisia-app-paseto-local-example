import { RefreshToken } from "@schemas/models";

export const revokeRefreshTokensByUserId = (userId: string) =>
  RefreshToken.update(
    { isRevoked: true },
    {
      where: { userId, isRevoked: false }
    }
  );

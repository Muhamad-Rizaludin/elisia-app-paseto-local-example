import { RefreshToken } from "@schemas/models";

export const revokeRefreshTokenByTokenId = (tokenId: string) =>
  RefreshToken.update(
    { isRevoked: true },
    {
      where: { tokenId }
    }
  );

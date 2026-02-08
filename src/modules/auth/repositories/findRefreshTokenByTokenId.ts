import { RefreshToken } from "@schemas/models";

export const findRefreshTokenByTokenId = (tokenId: string) =>
  RefreshToken.findOne({
    where: { tokenId }
  });

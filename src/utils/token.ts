import { createSecretKey, randomUUID } from "node:crypto";
import { V3 } from "paseto";
import type { AccessTokenPayload, RefreshTokenPayload } from "@modules/auth/types/types";
import { TokenType } from "@modules/auth/types/enums";
import { unauthorizedError } from "@common/errorFactory";

const getSecretKey = () => {
  const rawSecret = process.env.PASETO_SECRET || "";
  const normalized = rawSecret.length >= 32 ? rawSecret.slice(0, 32) : rawSecret.padEnd(32, "0");
  return createSecretKey(Buffer.from(normalized));
};

export const createAccessToken = async (payload: Omit<AccessTokenPayload, "tokenType">): Promise<string> =>
  createAccessTokenWithExpiry(payload);

export const createAccessTokenWithExpiry = async (
  payload: Omit<AccessTokenPayload, "tokenType">,
  expiresIn?: string
): Promise<string> =>
  V3.encrypt(
    {
      ...payload,
      tokenType: TokenType.ACCESS
    },
    getSecretKey(),
    {
      expiresIn: expiresIn || process.env.ACCESS_TOKEN_TTL || "15m"
    }
  );

export const createRefreshToken = async (
  payload: Omit<RefreshTokenPayload, "tokenType" | "jti">,
  expiresIn?: string
): Promise<{ token: string; tokenId: string }> => {
  const tokenId = randomUUID();
  const token = await V3.encrypt(
    {
      ...payload,
      tokenType: TokenType.REFRESH,
      jti: tokenId
    },
    getSecretKey(),
    {
      expiresIn: expiresIn || process.env.REFRESH_TOKEN_TTL || "7d"
    }
  );

  return { token, tokenId };
};

export const verifyAccessToken = async (token: string): Promise<AccessTokenPayload> => {
  const payload = await V3.decrypt(token, getSecretKey());

  if (!payload || payload.tokenType !== TokenType.ACCESS) {
    throw unauthorizedError("Invalid access token");
  }

  return payload as AccessTokenPayload;
};

export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
  const payload = await V3.decrypt(token, getSecretKey());

  if (!payload || payload.tokenType !== TokenType.REFRESH) {
    throw unauthorizedError("Invalid refresh token");
  }

  return payload as RefreshTokenPayload;
};

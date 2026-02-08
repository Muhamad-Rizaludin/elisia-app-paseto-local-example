export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refreshToken?: string;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  tokenType: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  role: string;
  tokenType: "refresh";
  jti: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenMaxAgeSec: number;
  refreshTokenMaxAgeSec: number;
  sessionExpiresAt: Date;
};

export type CreateUserPayload = {
  roleId: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type CreateRefreshTokenPayload = {
  userId: string;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
  isRevoked?: boolean;
};

export type LogoutPayload = {
  accessToken?: string | null;
  refreshToken?: string | null;
};

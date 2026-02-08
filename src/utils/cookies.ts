import type { HttpSet } from "@plugins/common/types";
import { durationToMs } from "@utils/duration";

const getCookieFlags = () => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `HttpOnly; Path=/; SameSite=Lax${secure}`;
};

export const setAuthCookies = (
  set: HttpSet,
  accessToken: string,
  refreshToken: string,
  options?: {
    accessTokenMaxAgeSec?: number;
    refreshTokenMaxAgeSec?: number;
  }
) => {
  const flags = getCookieFlags();
  const defaultAccessTokenMaxAgeSec = Math.max(1, Math.floor(durationToMs(process.env.ACCESS_TOKEN_TTL || "8h") / 1000));
  const defaultRefreshTokenMaxAgeSec = Math.max(1, Math.floor(durationToMs(process.env.REFRESH_TOKEN_TTL || "8h") / 1000));
  const accessTokenMaxAgeSec = options?.accessTokenMaxAgeSec ?? defaultAccessTokenMaxAgeSec;
  const refreshTokenMaxAgeSec = options?.refreshTokenMaxAgeSec ?? defaultRefreshTokenMaxAgeSec;
  const cookies = [
    `token=${accessToken}; Max-Age=${accessTokenMaxAgeSec}; ${flags}`,
    `refreshToken=${refreshToken}; Max-Age=${refreshTokenMaxAgeSec}; ${flags}`,
    `expiredToken=${accessTokenMaxAgeSec}; Max-Age=${accessTokenMaxAgeSec}; ${flags}`
  ];

  set.headers["set-cookie"] = cookies;
};

export const clearAuthCookies = (set: HttpSet) => {
  const flags = getCookieFlags();
  const cookies = [
    `token=; Max-Age=0; ${flags}`,
    `refreshToken=; Max-Age=0; ${flags}`,
    `expiredToken=; Max-Age=0; ${flags}`,
    `at=; Max-Age=0; ${flags}`,
    `rt=; Max-Age=0; ${flags}`
  ];

  set.headers["set-cookie"] = cookies;
};

export const getCookieValue = (request: Request, name: string): string | null => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const chunks = cookieHeader.split(";").map((chunk) => chunk.trim());
  const pair = chunks.find((chunk) => chunk.startsWith(`${name}=`));

  return pair ? decodeURIComponent(pair.split("=")[1]) : null;
};

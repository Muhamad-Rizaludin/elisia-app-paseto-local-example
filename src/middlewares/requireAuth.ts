import { unauthorizedError } from "@common/errorFactory";
import { getCookieValue } from "@utils/cookies";
import { verifyAccessToken } from "@utils/token";

export const requireAuth = async (request: Request) => {
  const accessToken = getCookieValue(request, "token") || getCookieValue(request, "at");

  if (!accessToken) {
    throw unauthorizedError("Missing access token");
  }

  return verifyAccessToken(accessToken);
};

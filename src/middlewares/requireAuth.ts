import { unauthorizedError } from "@common/errorFactory";
import { verifyAccessToken } from "@utils/token";

export const requireAuth = async (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  const headerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : undefined;
  const accessToken = headerToken;

  if (!accessToken) {
    throw unauthorizedError("Missing access token");
  }

  return verifyAccessToken(accessToken);
};

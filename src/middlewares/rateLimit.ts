import { tooManyRequestsError } from "@common/errorFactory";
import { increaseRateLimit } from "@utils/rateLimitStore";

type RateLimitOptions = {
  keyPrefix: string;
  max: number;
  windowMs: number;
};

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
};

export const createRateLimiter = (options: RateLimitOptions) => (request: Request) => {
  const clientIp = getClientIp(request);
  const key = `${options.keyPrefix}:${clientIp}`;
  const result = increaseRateLimit(key, options.windowMs);

  if (result.count > options.max) {
    throw tooManyRequestsError("Rate limit exceeded");
  }
};

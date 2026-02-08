import { Elysia } from "elysia";
import type { BodyRequestSetContext } from "@plugins/common/types";
import type { RefreshRequest } from "@modules/auth/types/types";
import { refreshValidator } from "@modules/auth/validators/refresh";
import { validateYup } from "@utils/validateYup";
import { getCookieValue } from "@utils/cookies";
import { refreshController } from "@modules/auth/controllers/refresh";
import { createRateLimiter } from "@middlewares/rateLimit";
import { unauthorizedError } from "@common/errorFactory";

const refreshLimiter = createRateLimiter({
  keyPrefix: "auth:refresh",
  max: Number(process.env.RATE_LIMIT_MAX || 5),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
});

export const refreshEndpoint = new Elysia().post("/refresh", async ({ body, request, set }: BodyRequestSetContext) => {
  refreshLimiter(request);

  const payload = await validateYup<RefreshRequest>(refreshValidator, body);
  const cookieRefreshToken = getCookieValue(request, "refreshToken") || getCookieValue(request, "rt");
  const refreshToken = payload.refreshToken || cookieRefreshToken;

  if (!refreshToken) {
    throw unauthorizedError("Refresh token is required");
  }

  return refreshController(refreshToken, set);
}, {
  detail: {
    tags: ["Auth"],
    summary: "Refresh Token",
    description: "Menerbitkan access token dan refresh token baru menggunakan refresh token yang valid.",
    requestBody: {
      required: false,
      content: {
        "application/json": {
          example: {
            refreshToken: "v3.local.eyJ..."
          }
        }
      }
    },
    responses: {
      200: {
        description: "Refresh berhasil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Token refreshed",
              data: {
                user: {
                  id: 1,
                  name: "System Admin",
                  email: "admin@example.com",
                  role: "admin"
                },
                token: "v3.local.eyJ...",
                refreshToken: "v3.local.eyJ...",
                expiredToken: 28800
              },
              meta: {
                currentPage: 0,
                pageSize: 0,
                total: 0,
                totalPage: 0,
                hasNext: false,
                hasPrev: false
              }
            }
          }
        }
      },
      401: {
        description: "Refresh token tidak valid / expired / revoked",
        content: {
          "application/json": {
            example: {
              status: 401,
              success: false,
              message: "Invalid refresh token",
              data: null,
              meta: {
                currentPage: 0,
                pageSize: 0,
                total: 0,
                totalPage: 0,
                hasNext: false,
                hasPrev: false
              }
            }
          }
        }
      },
      429: {
        description: "Terlalu banyak request refresh",
        content: {
          "application/json": {
            example: {
              status: 429,
              success: false,
              message: "Rate limit exceeded",
              data: null,
              meta: {
                currentPage: 0,
                pageSize: 0,
                total: 0,
                totalPage: 0,
                hasNext: false,
                hasPrev: false
              }
            }
          }
        }
      }
    }
  }
});

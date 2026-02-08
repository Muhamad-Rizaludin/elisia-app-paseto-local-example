import { Elysia } from "elysia";
import type { BodyRequestSetContext } from "@plugins/common/types";
import type { LoginRequest } from "@modules/auth/types/types";
import { loginValidator } from "@modules/auth/validators/login";
import { validateYup } from "@utils/validateYup";
import { loginController } from "@modules/auth/controllers/login";
import { createRateLimiter } from "@middlewares/rateLimit";

const loginLimiter = createRateLimiter({
  keyPrefix: "auth:login",
  max: Number(process.env.RATE_LIMIT_MAX || 5),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
});

export const loginEndpoint = new Elysia().post("/login", async ({ body, request, set }: BodyRequestSetContext) => {
  loginLimiter(request);

  const payload = await validateYup<LoginRequest>(loginValidator, body);
  return loginController(payload, set);
}, {
  detail: {
    tags: ["Auth"],
    summary: "Login",
    description: "Melakukan login dengan email dan password, lalu mengembalikan token access/refresh serta mengatur cookie auth.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            email: "admin@example.com",
            password: "Admin12345!"
          }
        }
      }
    },
    responses: {
      200: {
        description: "Login berhasil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Login success",
              data: {
                user: {
                  id: "11111111-1111-1111-1111-111111111111",
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
        description: "Email/password tidak valid",
        content: {
          "application/json": {
            example: {
              status: 401,
              success: false,
              message: "Invalid email or password",
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
      422: {
        description: "Validasi request gagal",
        content: {
          "application/json": {
            example: {
              status: 422,
              success: false,
              message: "Validation failed",
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
        description: "Terlalu banyak percobaan login",
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

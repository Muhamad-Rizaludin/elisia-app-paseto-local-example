import { Elysia } from "elysia";
import type { BodySetContext } from "@plugins/common/types";
import type { RegisterRequest } from "@modules/auth/types/types";
import { registerValidator } from "@modules/auth/validators/register";
import { validateYup } from "@utils/validateYup";
import { registerController } from "@modules/auth/controllers/register";

export const registerEndpoint = new Elysia().post("/register", async ({ body, set }: BodySetContext) => {
  const payload = await validateYup<RegisterRequest>(registerValidator, body);
  return registerController(payload, set);
}, {
  detail: {
    tags: ["Auth"],
    summary: "Register",
    description: "Mendaftarkan user baru, mengembalikan token auth, dan mengatur cookie auth.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            name: "Budi",
            email: "budi@example.com",
            password: "Password123!"
          }
        }
      }
    },
    responses: {
      200: {
        description: "Register berhasil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Register success",
              data: {
                user: {
                  id: 2,
                  name: "Budi",
                  email: "budi@example.com",
                  role: "user"
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
      409: {
        description: "Email sudah terdaftar",
        content: {
          "application/json": {
            example: {
              status: 409,
              success: false,
              message: "Email already registered",
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
      }
    }
  }
});

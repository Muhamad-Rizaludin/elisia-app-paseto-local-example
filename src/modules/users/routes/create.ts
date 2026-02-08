import { Elysia } from "elysia";
import type { BodyRequestContext } from "@plugins/common/types";
import type { CreateUserRequest } from "@modules/users/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { forbiddenError } from "@common/errorFactory";
import { requireAuth } from "@middlewares/requireAuth";
import { usersCreateValidator } from "@modules/users/validators/create";
import { validateYup } from "@utils/validateYup";
import { usersCreateController } from "@modules/users/controllers/create";

export const usersCreateEndpoint = new Elysia().post("/", async ({ request, body }: BodyRequestContext) => {
  const auth = await requireAuth(request);

  if (auth.role !== RoleName.ADMIN) {
    throw forbiddenError("Only admin can create users");
  }

  const payload = await validateYup<CreateUserRequest>(usersCreateValidator, body);
  return usersCreateController(payload);
}, {
  detail: {
    tags: ["Users"],
    summary: "Create User",
    description: "Membuat user baru. Endpoint ini hanya bisa diakses role admin.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            name: "Budi",
            email: "budi@example.com",
            password: "Password123!",
            role: "user"
          }
        }
      }
    },
    responses: {
      200: {
        description: "User berhasil dibuat",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "User created",
              data: {
                id: 2,
                name: "Budi",
                email: "budi@example.com",
                role: "user",
                createdAt: "2026-02-08T00:00:00.000Z"
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
      }
    }
  }
});

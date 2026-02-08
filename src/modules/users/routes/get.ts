import { Elysia } from "elysia";
import type { RequestParamsContext } from "@plugins/common/types";
import type { UserIdParams } from "@modules/users/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { forbiddenError } from "@common/errorFactory";
import { requireAuth } from "@middlewares/requireAuth";
import { userIdParamValidator } from "@modules/users/validators/params";
import { validateYup } from "@utils/validateYup";
import { usersGetController } from "@modules/users/controllers/get";

export const usersGetEndpoint = new Elysia().get("/:id", async ({ request, params }: RequestParamsContext) => {
  const auth = await requireAuth(request);

  if (auth.role !== RoleName.ADMIN) {
    throw forbiddenError("Only admin can access user detail");
  }

  const validatedParams = await validateYup<UserIdParams>(userIdParamValidator, { id: params.id });
  return usersGetController(validatedParams.id);
}, {
  detail: {
    tags: ["Users"],
    summary: "Get User",
    description: "Mengambil detail user berdasarkan id. Endpoint ini hanya bisa diakses role admin.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "User id"
      }
    ],
    responses: {
      200: {
        description: "User berhasil diambil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "User retrieved",
              data: {
                id: "11111111-1111-1111-1111-111111111111",
                name: "System Admin",
                email: "admin@example.com",
                role: "admin",
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
      },
      404: {
        description: "User tidak ditemukan"
      }
    }
  }
});

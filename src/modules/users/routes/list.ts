import { Elysia } from "elysia";
import type { RequestQueryContext } from "@plugins/common/types";
import type { UserDatatableQuery } from "@modules/users/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { forbiddenError } from "@common/errorFactory";
import { requireAuth } from "@middlewares/requireAuth";
import { usersListValidator } from "@modules/users/validators/list";
import { validateYup } from "@utils/validateYup";
import { usersListController } from "@modules/users/controllers/list";

export const usersListEndpoint = new Elysia().get("/", async ({ request, query }: RequestQueryContext) => {
  const auth = await requireAuth(request);

  if (auth.role !== RoleName.ADMIN) {
    throw forbiddenError("Only admin can access users list");
  }

  const validatedQuery = await validateYup<UserDatatableQuery>(usersListValidator, query);
  return usersListController(validatedQuery);
}, {
  detail: {
    tags: ["Users"],
    summary: "Users Datatable",
    description: "Mengambil daftar user dengan pagination. Endpoint ini hanya bisa diakses role admin.",
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: { type: "integer", minimum: 1, default: 1 },
        description: "Nomor halaman"
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
        description: "Jumlah data per halaman"
      },
      {
        name: "search",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Keyword pencarian name/email"
      }
    ],
    responses: {
      200: {
        description: "Data user berhasil diambil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Users list retrieved",
              data: [
                {
                  id: 1,
                  name: "System Admin",
                  email: "admin@example.com",
                  role: "admin",
                  createdAt: "2026-02-08T00:00:00.000Z"
                }
              ],
              meta: {
                currentPage: 1,
                pageSize: 10,
                total: 1,
                totalPage: 1,
                hasNext: false,
                hasPrev: false
              }
            }
          }
        }
      },
      401: {
        description: "Token tidak valid",
        content: {
          "application/json": {
            example: {
              status: 401,
              success: false,
              message: "Missing access token",
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
      403: {
        description: "Role bukan admin",
        content: {
          "application/json": {
            example: {
              status: 403,
              success: false,
              message: "Only admin can access users list",
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

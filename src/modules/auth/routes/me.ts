import { Elysia } from "elysia";
import type { RequestOnlyContext } from "@plugins/common/types";
import { requireAuth } from "@middlewares/requireAuth";
import { meController } from "@modules/auth/controllers/me";

export const meEndpoint = new Elysia().get("/me", async ({ request }: RequestOnlyContext) => {
  const payload = await requireAuth(request);
  return meController(Number(payload.sub));
}, {
  detail: {
    tags: ["Auth"],
    summary: "Get Me",
    description: "Mengambil profile user berdasarkan access token yang valid.",
    responses: {
      200: {
        description: "Profile berhasil diambil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Profile retrieved",
              data: {
                id: 1,
                name: "System Admin",
                email: "admin@example.com",
                role: "admin"
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
        description: "Access token tidak ada atau tidak valid",
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
      }
    }
  }
});

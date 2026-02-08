import { Elysia } from "elysia";
import type { RequestSetContext } from "@plugins/common/types";
import { getCookieValue } from "@utils/cookies";
import { logoutController } from "@modules/auth/controllers/logout";

export const logoutEndpoint = new Elysia().post("/logout", async ({ request, set }: RequestSetContext) => {
  const accessToken = getCookieValue(request, "token") || getCookieValue(request, "at");
  const refreshToken = getCookieValue(request, "refreshToken") || getCookieValue(request, "rt");

  return logoutController(
    {
      accessToken,
      refreshToken
    },
    set
  );
}, {
  detail: {
    tags: ["Auth"],
    summary: "Logout",
    description: "Logout user, revoke refresh token aktif, dan hapus cookie auth.",
    responses: {
      200: {
        description: "Logout berhasil",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Logout success",
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

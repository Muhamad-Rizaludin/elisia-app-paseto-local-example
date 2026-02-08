import { Elysia } from "elysia";
import type { RequestParamsContext } from "@plugins/common/types";
import type { UserIdParams } from "@modules/users/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { forbiddenError } from "@common/errorFactory";
import { requireAuth } from "@middlewares/requireAuth";
import { userIdParamValidator } from "@modules/users/validators/params";
import { validateYup } from "@utils/validateYup";
import { usersDeleteController } from "@modules/users/controllers/remove";

export const usersDeleteEndpoint = new Elysia().delete("/:id", async ({ request, params }: RequestParamsContext) => {
  const auth = await requireAuth(request);

  if (auth.role !== RoleName.ADMIN) {
    throw forbiddenError("Only admin can delete users");
  }

  const validatedParams = await validateYup<UserIdParams>(userIdParamValidator, { id: params.id });
  return usersDeleteController(validatedParams.id);
}, {
  detail: {
    tags: ["Users"],
    summary: "Delete User",
    description: "Menghapus user berdasarkan id. Endpoint ini hanya bisa diakses role admin.",
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
        description: "User berhasil dihapus"
      }
    }
  }
});

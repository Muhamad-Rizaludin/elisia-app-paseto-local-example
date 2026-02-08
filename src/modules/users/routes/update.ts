import { Elysia } from "elysia";
import type { BodyRequestParamsContext } from "@plugins/common/types";
import type { UpdateUserRequest, UserIdParams } from "@modules/users/types/types";
import { RoleName } from "@modules/auth/types/enums";
import { forbiddenError } from "@common/errorFactory";
import { requireAuth } from "@middlewares/requireAuth";
import { userIdParamValidator } from "@modules/users/validators/params";
import { usersUpdateValidator } from "@modules/users/validators/update";
import { validateYup } from "@utils/validateYup";
import { usersUpdateController } from "@modules/users/controllers/update";

export const usersUpdateEndpoint = new Elysia().patch("/:id", async ({ request, params, body }: BodyRequestParamsContext) => {
  const auth = await requireAuth(request);

  if (auth.role !== RoleName.ADMIN) {
    throw forbiddenError("Only admin can update users");
  }

  const validatedParams = await validateYup<UserIdParams>(userIdParamValidator, params);
  const payload = await validateYup<UpdateUserRequest>(usersUpdateValidator, body);
  return usersUpdateController(validatedParams.id, payload);
}, {
  detail: {
    tags: ["Users"],
    summary: "Update User",
    description: "Memperbarui data user. Endpoint ini hanya bisa diakses role admin.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer", minimum: 1 },
        description: "User id"
      }
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            name: "Budi Update",
            email: "budi.update@example.com",
            password: "Password123!",
            role: "admin"
          }
        }
      }
    },
    responses: {
      200: {
        description: "User berhasil diperbarui"
      }
    }
  }
});

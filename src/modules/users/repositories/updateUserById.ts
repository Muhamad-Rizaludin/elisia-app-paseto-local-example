import { User } from "@schemas/models";
import type { UpdateUserPayload } from "@modules/users/types/types";

export const updateUserById = (id: number, payload: UpdateUserPayload) =>
  User.update(payload, { where: { id } });

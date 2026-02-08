import { User } from "@schemas/models";
import type { CreateUserPayload } from "@modules/auth/types/types";

export const createUser = (payload: CreateUserPayload) => User.create(payload);

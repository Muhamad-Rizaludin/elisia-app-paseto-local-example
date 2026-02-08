import { RefreshToken } from "@schemas/models";
import type { CreateRefreshTokenPayload } from "@modules/auth/types/types";

export const createRefreshToken = (payload: CreateRefreshTokenPayload) => RefreshToken.create(payload);

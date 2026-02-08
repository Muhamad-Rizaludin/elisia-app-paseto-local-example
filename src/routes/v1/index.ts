import { Elysia } from "elysia";
import { authRoutes } from "@modules/auth/routes";
import { usersRoutes } from "@modules/users/routes";
import { healthRoutes } from "@modules/health/routes";

export const v1Routes = new Elysia().use(authRoutes).use(usersRoutes).use(healthRoutes);

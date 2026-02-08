import { Elysia } from "elysia";
import { healthEndpoint } from "@modules/health/routes/get";

export const healthRoutes = new Elysia({ prefix: "/api/v1/health" }).use(healthEndpoint);

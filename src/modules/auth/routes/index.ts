import { Elysia } from "elysia";
import { registerEndpoint } from "@modules/auth/routes/register";
import { loginEndpoint } from "@modules/auth/routes/login";
import { refreshEndpoint } from "@modules/auth/routes/refresh";
import { logoutEndpoint } from "@modules/auth/routes/logout";
import { meEndpoint } from "@modules/auth/routes/me";

export const authRoutes = new Elysia({ prefix: "/api/v1/auth" })
  .use(registerEndpoint)
  .use(loginEndpoint)
  .use(refreshEndpoint)
  .use(logoutEndpoint)
  .use(meEndpoint);

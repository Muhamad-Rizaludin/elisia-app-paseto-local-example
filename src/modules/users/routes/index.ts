import { Elysia } from "elysia";
import { usersListEndpoint } from "@modules/users/routes/list";

export const usersRoutes = new Elysia({ prefix: "/api/v1/users" }).use(usersListEndpoint);

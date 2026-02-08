import { Elysia } from "elysia";
import { usersCreateEndpoint } from "@modules/users/routes/create";
import { usersGetEndpoint } from "@modules/users/routes/get";
import { usersListEndpoint } from "@modules/users/routes/list";
import { usersUpdateEndpoint } from "@modules/users/routes/update";
import { usersDeleteEndpoint } from "@modules/users/routes/remove";

export const usersRoutes = new Elysia({ prefix: "/api/v1/users" })
	.use(usersListEndpoint)
	.use(usersCreateEndpoint)
	.use(usersGetEndpoint)
	.use(usersUpdateEndpoint)
	.use(usersDeleteEndpoint);

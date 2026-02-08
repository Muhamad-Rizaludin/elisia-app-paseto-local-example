import { Elysia } from "elysia";
import { v1Routes } from "@routes/v1";

export const appRoutes = new Elysia().use(v1Routes);

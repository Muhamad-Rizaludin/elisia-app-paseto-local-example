import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { appRoutes } from "@routes/index";
import { mapErrorToResponse } from "@middlewares/errorHandler";
import { logger } from "@config/logger";
import { errorResponse } from "@utils/response";

const parseAllowedOrigins = () => {
  const origins = (process.env.ALLOWED_ORIGINS || "").trim();
  if (!origins) {
    return true;
  }

  return origins.split(",").map((origin) => origin.trim());
};

export const createApp = () => {
  const app = new Elysia()
    .use(
      cors({
        origin: parseAllowedOrigins(),
        credentials: true
      })
    )
    .onRequest(({ request }) => {
      logger.info("Incoming request", {
        method: request.method,
        url: request.url
      });
    })
    .onError(({ error, set }) => {
      const mapped = mapErrorToResponse(error);
      set.status = mapped.status;
      return mapped.body;
    });

  if (process.env.NODE_ENV === "production") {
    app.get("/docs", ({ set }) => {
      set.status = 404;
      return errorResponse("Not found", 404);
    });

    app.get("/docs/json", ({ set }) => {
      set.status = 404;
      return errorResponse("Not found", 404);
    });
  } else {
    app.use(
      swagger({
        path: "/docs",
        scalarConfig: {
          showDeveloperTools: "never",
          hideClientButton: true,
          documentDownloadType: "none"
        } as any,
        documentation: {
          info: {
            title: process.env.APP_NAME || "elisia-app",
            version: "1.0.0"
          }
        }
      })
    );
  }

  app.get("/", () => "Service is running");

  app.use(appRoutes);

  return app;
};

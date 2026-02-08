import { Elysia } from "elysia";
import { healthController } from "@modules/health/controllers/get";

export const healthEndpoint = new Elysia().get("/", healthController, {
  detail: {
    tags: ["Health"],
    summary: "Health Check",
    description: "Memeriksa status service. Endpoint ini public dan tidak memerlukan token.",
    responses: {
      200: {
        description: "Service sehat",
        content: {
          "application/json": {
            example: {
              status: 200,
              success: true,
              message: "Service is healthy",
              data: {
                uptime: 123.45,
                environment: "development"
              },
              meta: {
                currentPage: 0,
                pageSize: 0,
                total: 0,
                totalPage: 0,
                hasNext: false,
                hasPrev: false
              }
            }
          }
        }
      }
    }
  }
});

import { logger } from "@config/logger";
import { successResponse } from "@utils/response";

export const healthController = () => {
  const data = {
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  };

  logger.info("health.check.success", data);
  return successResponse("Service is healthy", data);
};

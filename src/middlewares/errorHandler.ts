import type { BaseResponse } from "@plugins/common/types";
import { BaseError } from "@common/BaseError";
import { logger } from "@config/logger";
import { emptyMeta } from "@utils/pagination";

export const mapErrorToResponse = (error: unknown): { status: number; body: BaseResponse<null> } => {
  if (error instanceof BaseError) {
    return {
      status: error.statusCode,
      body: {
        status: error.statusCode,
        success: false,
        message: error.message,
        data: null,
        meta: emptyMeta()
      }
    };
  }

  logger.error("Unhandled error", { error });

  return {
    status: 500,
    body: {
      status: 500,
      success: false,
      message: "Internal server error",
      data: null,
      meta: emptyMeta()
    }
  };
};

import { BaseError } from "@common/BaseError";
import { ErrorCode } from "@plugins/errors/enums";

export const badRequestError = (message: string, details?: unknown) =>
  new BaseError(400, ErrorCode.BAD_REQUEST, message, details);

export const unauthorizedError = (message = "Unauthorized", details?: unknown) =>
  new BaseError(401, ErrorCode.UNAUTHORIZED, message, details);

export const forbiddenError = (message = "Forbidden", details?: unknown) =>
  new BaseError(403, ErrorCode.FORBIDDEN, message, details);

export const notFoundError = (message = "Not found", details?: unknown) =>
  new BaseError(404, ErrorCode.NOT_FOUND, message, details);

export const conflictError = (message: string, details?: unknown) =>
  new BaseError(409, ErrorCode.CONFLICT, message, details);

export const tooManyRequestsError = (message = "Too many requests", details?: unknown) =>
  new BaseError(429, ErrorCode.TOO_MANY_REQUESTS, message, details);

export const validationError = (message: string, details?: unknown) =>
  new BaseError(422, ErrorCode.VALIDATION_ERROR, message, details);

export const internalServerError = (message = "Internal server error", details?: unknown) =>
  new BaseError(500, ErrorCode.INTERNAL_SERVER_ERROR, message, details);

import { ErrorCode } from "@plugins/errors/enums";

export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "BaseError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

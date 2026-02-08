import type { BaseResponse, DatatableMeta } from "@plugins/common/types";
import { emptyMeta } from "@utils/pagination";

export const successResponse = <T>(
  message: string,
  data: T | null,
  meta?: DatatableMeta,
  status = 200
): BaseResponse<T> => ({
  status,
  success: true,
  message,
  data,
  meta: meta ?? emptyMeta()
});

export const errorResponse = (message: string, status = 500): BaseResponse<null> => ({
  status,
  success: false,
  message,
  data: null,
  meta: emptyMeta()
});

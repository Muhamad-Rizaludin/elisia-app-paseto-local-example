export type DatatableMeta = {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export enum DeletedStatus {
  FALSE = 0,
  TRUE = 1
}

export type BaseResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  meta: DatatableMeta;
};

export type PaginationQuery = {
  page?: number;
  pageSize?: number;
};

export type HttpHeaderValue = string | number | string[];

export type HttpSet = {
  headers: Record<string, HttpHeaderValue>;
  status?: number | string;
};

export type RequestOnlyContext = {
  request: Request;
};

export type RequestSetContext = {
  request: Request;
  set: HttpSet;
};

export type BodySetContext = {
  body: unknown;
  set: HttpSet;
};

export type BodyRequestSetContext = {
  body: unknown;
  request: Request;
  set: HttpSet;
};

export type BodyRequestContext = {
  body: unknown;
  request: Request;
};

export type RequestQueryContext = {
  request: Request;
  query: Record<string, unknown>;
};

export type RequestParamsContext = {
  request: Request;
  params: Record<string, string>;
};

export type BodyRequestParamsContext = {
  request: Request;
  params: Record<string, string>;
  body: unknown;
};

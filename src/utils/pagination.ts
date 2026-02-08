import type { DatatableMeta } from "@plugins/common/types";

export const buildMeta = (page: number, pageSize: number, total: number): DatatableMeta => {
  const totalPage = Math.max(1, Math.ceil(total / pageSize));

  return {
    currentPage: page,
    pageSize,
    total,
    totalPage,
    hasNext: page < totalPage,
    hasPrev: page > 1
  };
};

export const emptyMeta = (): DatatableMeta => ({
  currentPage: 0,
  pageSize: 0,
  total: 0,
  totalPage: 0,
  hasNext: false,
  hasPrev: false
});

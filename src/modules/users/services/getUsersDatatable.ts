import type { UserDatatableQuery } from "@modules/users/types/types";
import { usersRepository } from "@modules/users/repositories";
import { buildMeta } from "@utils/pagination";
import { sanitizeUser } from "@utils/user";

export const getUsersDatatable = async (query: UserDatatableQuery, deps = usersRepository) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const offset = (page - 1) * pageSize;
  const search = query.search?.trim();

  const result = await deps.findUsersDatatable({
    limit: pageSize,
    offset,
    search: search || undefined
  });

  return {
    items: result.rows.map((row) => sanitizeUser(row)),
    meta: buildMeta(page, pageSize, result.count)
  };
};

import type { UserDatatableQuery } from "@modules/users/types/types";
import { logger } from "@config/logger";
import { getUsersDatatable } from "@modules/users/services/getUsersDatatable";
import { successResponse } from "@utils/response";

export const usersListController = async (query: UserDatatableQuery) => {
  const result = await getUsersDatatable(query);
  logger.info("users.list.success", {
    page: query.page || 1,
    pageSize: query.pageSize || 10
  });

  return successResponse("Users list retrieved", result.items, result.meta);
};

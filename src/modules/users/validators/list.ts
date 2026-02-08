import * as yup from "yup";

export const usersListValidator = yup.object({
  page: yup.number().integer().min(1).default(1),
  pageSize: yup.number().integer().min(1).max(100).default(10),
  search: yup.string().max(120).optional()
});

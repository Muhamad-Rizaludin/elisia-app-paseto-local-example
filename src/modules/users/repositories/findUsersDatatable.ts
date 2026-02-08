import { Op } from "sequelize";
import { Role, User } from "@schemas/models";
import type { FindUsersDatatableDependencies, FindUsersDatatableParams } from "@modules/users/types/types";

export const findUsersDatatable = (
  { limit, offset, search }: FindUsersDatatableParams,
  deps: FindUsersDatatableDependencies = { userModel: User }
) => {
  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      }
    : undefined;

  return deps.userModel.findAndCountAll({
    where,
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    attributes: ["id", "name", "email", "createdAt"],
    order: [["id", "DESC"]],
    limit,
    offset
  });
};

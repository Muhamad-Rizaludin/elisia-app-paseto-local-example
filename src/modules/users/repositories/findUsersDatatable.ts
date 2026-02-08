import { Op } from "sequelize";
import { Role, User } from "@schemas/models";
import { DeletedStatus } from "@plugins/common/types";
import type { FindUsersDatatableDependencies, FindUsersDatatableParams } from "@modules/users/types/types";

export const findUsersDatatable = (
  { limit, offset, search }: FindUsersDatatableParams,
  deps: FindUsersDatatableDependencies = { userModel: User }
) => {
  const where = {
    deleted: DeletedStatus.FALSE,
    ...(search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {})
  };

  return deps.userModel.findAndCountAll({
    where,
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    attributes: ["id", "name", "email", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });
};

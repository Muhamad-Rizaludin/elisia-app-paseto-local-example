import { Role, User } from "@schemas/models";
import { DeletedStatus } from "@plugins/common/types";

type FindUserByEmailOptions = {
  includeDeleted?: boolean;
};

export const findUserByEmail = (email: string, options: FindUserByEmailOptions = {}) => {
  const deletedFilter = options.includeDeleted ? {} : { deleted: DeletedStatus.FALSE };

  return User.findOne({
    where: {
      email,
      ...deletedFilter
    },
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
};

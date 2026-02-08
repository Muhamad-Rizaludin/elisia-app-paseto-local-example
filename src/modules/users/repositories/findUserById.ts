import { Role, User } from "@schemas/models";
import { DeletedStatus } from "@plugins/common/types";

export const findUserById = (id: string) =>
  User.findOne({
    where: {
      id,
      deleted: DeletedStatus.FALSE
    },
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });

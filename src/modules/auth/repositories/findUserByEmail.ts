import { Role, User } from "@schemas/models";
import { DeletedStatus } from "@plugins/common/types";

export const findUserByEmail = (email: string) =>
  User.findOne({
    where: {
      email,
      deleted: DeletedStatus.FALSE
    },
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
